import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import {
  updateDraft, removeDraft, editorErrorMessage, blocksExternalNavigation,
} from '../src/components/website-editor/editor-state.js'
import { HOME_BINDINGS, PUBLIC_PAGES } from '../src/components/website-editor/editor-bindings.js'

const registry = JSON.parse(await fs.readFile(new URL('../docs/website-editor/baseline/content-registry.json', import.meta.url), 'utf8'))
const routes = JSON.parse(await fs.readFile(new URL('../docs/website-editor/baseline/routes.json', import.meta.url), 'utf8'))
const contracts = JSON.parse(await fs.readFile(new URL('../docs/website-editor/baseline/contracts.json', import.meta.url), 'utf8'))

test('initial visual editing retains four original text fields and adds only two approved attribute slots', () => {
  const expected = new Map([
    ['home.hero-carousel.slides.item1.title', "St. Mary's"],
    ['home.hero-carousel.slides.item1.description', '"If you are seeking a secondary school, St. Mary\'s School is the place to be."'],
    ['home.welcome-section.welcome-section.paragraph', 'Where every student discovers their potential, builds character, and achieves excellence. Join us for a transformative educational journey.'],
    ['home.home.item1.value', '1924'],
    ['home.hero-carousel.hero-carousel.style', "url('/walpaper.png')"],
    ['home.home.href.2', '/contact'],
  ])
  assert.equal(HOME_BINDINGS.length, expected.size)
  assert.deepEqual(new Set(HOME_BINDINGS.map(field => field.key)), new Set(expected.keys()))
  for (const binding of HOME_BINDINGS) {
    const registered = registry.fields.find(field => field.key === binding.key)
    assert.equal(registered.defaultValue, expected.get(binding.key), binding.key)
    assert.equal(registered.pagePath, '/')
    assert.equal(registered.audience, 'public')
    if (['image', 'url'].includes(registered.contentType)) assert.equal(registered.status, 'protected', 'Original registry remains immutable')
    else { assert.equal(registered.status, 'editable'); assert.equal(registered.contentType, 'text') }
    assert.ok(binding.label.trim())
    assert.ok(binding.kind)
  }
})

test('editor navigation uses all and only the original public routes', () => {
  assert.equal(PUBLIC_PAGES.length, routes.length)
  assert.deepEqual(new Set(PUBLIC_PAGES.map(page => page.path)), new Set(routes.map(route => route.path)))
  for (const page of PUBLIC_PAGES) assert.ok(page.label.trim(), page.path)
})

test('draft changes preserve unrelated fields and the original concurrency revision', () => {
  const other = Object.freeze({ value: 'Keep another page change', expectedRevision: 7 })
  const initial = Object.freeze({ other })
  const first = updateDraft(initial, 'heading', 'First local edit', 'Published heading', 2)
  assert.deepEqual(initial, { other })
  assert.notEqual(first, initial)
  assert.equal(first.other, other)
  assert.deepEqual(first.heading, { value: 'First local edit', expectedRevision: 2 })

  // A catalog refresh can discover another editor's revision. Continuing to type
  // must retain revision 2 so the server can detect, rather than overwrite, it.
  const continued = updateDraft(first, 'heading', 'Second local edit', 'Another administrator saved', 3)
  assert.deepEqual(continued.heading, { value: 'Second local edit', expectedRevision: 2 })
  assert.equal(first.heading.value, 'First local edit')
  assert.equal(continued.other, other)
})

test('reverting or cancelling a field removes only that draft, including intentional empty and zero values', () => {
  const other = { value: 'Unsaved paragraph', expectedRevision: 4 }
  const empty = updateDraft({ other }, 'heading', '', 'Original heading', 0)
  assert.deepEqual(empty.heading, { value: '', expectedRevision: 0 })
  const zero = updateDraft(empty, 'statistic', 0, 1924, 0)
  assert.deepEqual(zero.statistic, { value: 0, expectedRevision: 0 })

  const reverted = updateDraft(zero, 'heading', 'Original heading', 'Original heading', 0)
  assert.equal(Object.hasOwn(reverted, 'heading'), false)
  assert.equal(reverted.other, other)
  assert.deepEqual(reverted.statistic, zero.statistic)
  const cancelled = removeDraft(reverted, 'statistic')
  assert.deepEqual(cancelled, { other })
  assert.equal(Object.hasOwn(reverted, 'statistic'), true)
  assert.deepEqual(updateDraft({}, 'blank', '', '', 8), {})
  assert.deepEqual(updateDraft({}, 'zero', 0, 0, 8), {})
})

test('editor errors distinguish stale writes, lost authentication, validation and unavailable servers', () => {
  const responseError = (status, message) => ({ response: { status, data: { message } } })
  assert.match(editorErrorMessage(responseError(409, 'Stale revision')), /conflict|another|changed|reload|revision/i)
  assert.match(editorErrorMessage(responseError(401, 'Unauthorized')), /session|sign.in|log.in|authenticat/i)
  assert.match(editorErrorMessage(responseError(403, 'Forbidden')), /permission|access|allowed|protected|forbidden/i)
  assert.match(editorErrorMessage(responseError(400, 'Heading exceeds the allowed length')), /Heading exceeds the allowed length/)
  assert.ok(editorErrorMessage(responseError(500, 'Temporary save failure')).trim())
  assert.ok(editorErrorMessage(new Error('Network Error')).trim())
  assert.ok(editorErrorMessage(null).trim())
})

test('edit mode guards external and original payment links while allowing normal same-origin navigation', () => {
  const origin = 'https://school.example'
  for (const href of [
    '/', '/admissions', '/about/founders#history', '/?view=public', '#latest-notices',
    'contact', 'https://school.example/gallery', '//school.example/contact',
  ]) assert.equal(blocksExternalNavigation(href, origin), false, href)

  for (const href of [
    ...contracts.bankLinks,
    'https://external.example/about', '//external.example/', 'http://school.example/',
    'https://school.example@external.example/', 'mailto:school@example.test',
    'tel:+910000000000', 'javascript:alert(1)', 'data:text/html,example',
  ]) assert.equal(blocksExternalNavigation(href, origin), true, href)
})
