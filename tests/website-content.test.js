import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import {
  getContentField, getContentFields, validateContentPath,
  validateContentValue, validateExpectedRevision, resolveWebsiteContentValue, validateApprovedImageUrl,
} from '../src/server/util/websiteContentPolicy.js'
import { routeFor } from '../src/server/route-adapter.js'
import { websiteContentApprovals } from '../src/server/util/websiteContentApprovals.js'

const registry = JSON.parse(await fs.readFile(new URL('../docs/website-editor/baseline/content-registry.json', import.meta.url), 'utf8'))
const routes = JSON.parse(await fs.readFile(new URL('../docs/website-editor/baseline/routes.json', import.meta.url), 'utf8'))
const originalContracts = JSON.parse(await fs.readFile(new URL('../docs/website-editor/baseline/contracts.json', import.meta.url), 'utf8'))
const editable = registry.fields.filter(field => field.audience === 'public' && field.status === 'editable')
const textField = getContentField(editable.find(field => field.contentType === 'text').key)
const numberField = getContentField(editable.find(field => field.contentType === 'number').key)

test('website content uses the complete original registry and exact scalar fallbacks without truthiness replacement', () => {
  assert.equal(editable.length, 883)
  for (const field of editable) {
    const registered = getContentField(field.key, { editable: true })
    assert.equal(registered.defaultValue, field.defaultValue, field.key)
    assert.equal(resolveWebsiteContentValue(registered, null), field.defaultValue, field.key)
    assert.equal(resolveWebsiteContentValue(registered, { hasOverride: false, value: 'ignored tombstone' }), field.defaultValue, field.key)
    assert.doesNotThrow(() => validateContentValue(registered, field.defaultValue), field.key)
  }
  assert.equal(resolveWebsiteContentValue(textField, { hasOverride: true, value: '' }), '')
  assert.equal(resolveWebsiteContentValue(numberField, { hasOverride: true, value: 0 }), 0)
})

test('website content catalogs registered pages and shared content without exposing unrelated or dormant fields', () => {
  for (const route of routes) {
    assert.equal(validateContentPath(route.path), route.path)
    const fields = getContentFields(route.path)
    const expected = registry.fields.filter(field => field.audience === 'public' && field.usedOnRoutes.includes(route.path))
    assert.deepEqual(fields.map(field => field.key).sort(), expected.map(field => field.key).sort(), route.path)
  }
  for (const invalid of ['/../', '/contact/../admin', '//evil.example', 'https://evil.example/', '/%2e%2e/', '/contact?secret=1', '/contact#form', '/admin', '/not-a-school-page']) {
    assert.throws(() => validateContentPath(invalid), error => [400, 404].includes(error.status), invalid)
  }
})

test('website content rejects unknown, protected, dormant and administrative keys', () => {
  for (const key of ['unregistered.heading', '__proto__', 'constructor', '../school', 'global.navbar.$where']) {
    assert.throws(() => getContentField(key, { editable: true }), error => [400, 404].includes(error.status), key)
  }
  for (const field of registry.fields.filter(field => (field.status !== 'editable' || field.audience !== 'public') && !Object.hasOwn(websiteContentApprovals, field.key))) {
    assert.throws(() => getContentField(field.key, { editable: true }), error => [403, 404].includes(error.status), field.key)
  }
  for (const field of registry.fields.filter(field => ['url', 'image'].includes(field.contentType))) {
    assert.notEqual(field.status, 'editable', field.key)
  }
})

test('only reviewed static image/destination slots accept server choices; payment and structural destinations stay protected', () => {
  assert.equal(Object.keys(websiteContentApprovals).length, 76)
  for (const [key, approval] of Object.entries(websiteContentApprovals)) {
    const field = getContentField(key, { editable: true })
    assert.equal(field.defaultValue, registry.fields.find(item => item.key === key).defaultValue)
    for (const choice of approval.choices) assert.equal(validateContentValue(field, choice.value), choice.value)
    for (const value of ['javascript:alert(1)', 'https://evil.example', '//evil.example', '/admin', '/contact?redirect=https://evil.example', "url('/unknown.png')", '', null, {}]) {
      assert.throws(() => validateContentValue(field, value), { status: 400 })
    }
    assert.throws(() => validateContentValue({ ...field, choices: [{ value: '/admin' }] }, '/admin'), { status: 400 })
  }
  for (const field of registry.fields.filter(item => item.key.startsWith('global.top-bar.fee-options.') && item.contentType === 'url')) {
    assert.throws(() => getContentField(field.key, { editable: true }), { status: 403 })
  }
})

test('website content validates scalar types, length limits, markup, executable schemes and code payloads', () => {
  assert.doesNotThrow(() => validateContentValue(textField, 'A safe school heading & community'))
  assert.doesNotThrow(() => validateContentValue(textField, ''))
  assert.doesNotThrow(() => validateContentValue(numberField, 0))
  assert.doesNotThrow(() => validateContentValue(textField, 'x'.repeat(textField.maxLength)))
  assert.throws(() => validateContentValue(textField, 'x'.repeat(textField.maxLength + 1)), { status: 400 })
  for (const value of [null, true, [], {}, { $ne: null }, new String('wrapped'), 5]) {
    assert.throws(() => validateContentValue(textField, value), { status: 400 })
  }
  for (const value of ['5', null, false, NaN, Infinity, -Infinity, -1, 1.25, Number.MAX_SAFE_INTEGER, {}, []]) {
    assert.throws(() => validateContentValue(numberField, value), { status: 400 })
  }
  for (const value of [
    '<script>alert(1)</script>', '<img src=x onerror="alert(1)">', '<svg/onload=alert(1)>',
    '&lt;script&gt;alert(1)&lt;/script&gt;', '%3Cscript%3Ealert(1)%3C%2Fscript%3E', '&#x3c;svg/onload=alert(1)&#x3e;',
    'javascript:alert(1)', 'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)', 'body { color: red; }', 'document.cookie = "stolen"',
    '\u0000hidden', 'x'.repeat(100001),
  ]) assert.throws(() => validateContentValue(textField, value), { status: 400 }, value.slice(0, 80))
})

test('website content requires a nonnegative safe integer expected revision', () => {
  for (const value of [0, 1, 100]) assert.doesNotThrow(() => validateExpectedRevision(value))
  for (const value of [undefined, null, '1', true, -1, 1.2, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => validateExpectedRevision(value), { status: 400 })
  }
})

test('website content image URL policy accepts only managed assets or exact original external references', () => {
  assert.equal(validateApprovedImageUrl('/uploads/gallery/11111111-1111-4111-8111-111111111111.webp'), '/uploads/gallery/11111111-1111-4111-8111-111111111111.webp')
  const original = registry.fields.find(field => field.contentType === 'image' && /^https:\/\//.test(field.defaultValue)).defaultValue
  assert.equal(validateApprovedImageUrl(original), original)
  for (const url of [
    'javascript:alert(1)', 'data:image/svg+xml,<svg/onload=alert(1)>', 'https://evil.example/image.png',
    '//evil.example/image.png', '/uploads/gallery/../../secret.webp', '/uploads/gallery/%2e%2e%2fsecret.webp',
    '/uploads/gallery/------------------------------------.webp', '/uploads/gallery/11111111-1111-4111-8111-111111111111.svg',
    '/uploads/unknown/11111111-1111-4111-8111-111111111111.webp',
  ]) assert.throws(() => validateApprovedImageUrl(url), { status: 400 }, url)
})

test('website content route dispatch protects all private operations and rejects extra path segments', () => {
  const key = textField.key
  assert.equal(Boolean(routeFor('GET', ['website-content']).auth), false)
  for (const [method, segments] of [
    ['GET', ['website-content', 'catalog']],
    ['GET', ['website-content', 'history', key]],
    ['PUT', ['website-content', key]],
    ['POST', ['website-content', key, 'restore']],
    ['POST', ['website-content', key, 'reset']],
  ]) assert.equal(routeFor(method, segments)?.auth, true, `${method} ${segments.join('/')}`)
  for (const [method, segments] of [
    ['POST', ['website-content']], ['DELETE', ['website-content', key]],
    ['GET', ['website-content', 'history']], ['GET', ['website-content', key]],
    ['PUT', ['website-content', key, 'reset']],
    ['POST', ['website-content', key, 'reset', 'extra']],
    ['GET', ['website-content', 'catalog', 'extra']],
  ]) assert.equal(routeFor(method, segments), null, `${method} ${segments.join('/')}`)
})

test('all existing API dispatch contracts remain intact after adding website content routes', () => {
  for (const contract of originalContracts.endpoints) {
    const actual = routeFor(contract.method, contract.path.slice('/api/'.length).split('/'))
    assert.ok(actual, `${contract.method} ${contract.path}`)
    assert.equal(actual.handler.name, contract.handler, contract.path)
    assert.equal(Boolean(actual.auth), contract.authenticated, contract.path)
    assert.equal(Boolean(actual.refresh), contract.refresh, contract.path)
    assert.deepEqual(actual.params || {}, contract.params, contract.path)
  }
})
