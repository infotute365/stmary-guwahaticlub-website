import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { getContentField, websiteContentCatalogField } from '../src/server/util/websiteContentPolicy.js'

const require = createRequire(import.meta.url)
const babel = require('next/dist/compiled/babel/core')
const source = await fs.readFile(new URL('../src/components/website-editor/WebsiteEditorUI.jsx', import.meta.url), 'utf8')
const compiled = babel.transformSync(source, { configFile: false, babelrc: false,
  presets: [[require('next/dist/compiled/babel/preset-react'), { runtime: 'classic' }]],
  plugins: [require('next/dist/compiled/babel/plugin-transform-modules-commonjs')],
}).code

function render(editor) {
  const module = { exports: {} }
  const noop = () => {}
  const context = { active: true, preview: false, fields: [], pageName: 'Home', drafts: {},
    dirtyCount: 1, ...Object.fromEntries(['selectField', 'changeField', 'saveField', 'cancelField', 'closePanel', 'saveAll', 'discardAll', 'togglePreview', 'requestExit', 'finishExit', 'reloadSelected', 'retryCatalog', 'manageRecord', 'chooseManagedModule', 'selectManagedRecord'].map(key => [key, noop])), ...editor }
  const mockedRequire = id => {
    if (id === 'react') return { ...React, useState: initial => React.useState(initial === false ? true : initial) }
    if (id === 'react-dom') return { createPortal: children => children }
    if (id === './WebsiteEditorProvider.jsx') return { useWebsiteEditor: () => context }
    if (id.endsWith('.module.css')) return new Proxy({ __esModule: true }, { get: (_, key) => key === 'default' ? new Proxy({}, { get: (_, name) => name }) : undefined })
    if (id === 'lucide-react') return new Proxy({ __esModule: true }, { get: (_, key) => key === '__esModule' ? true : () => React.createElement('svg', { 'aria-hidden': true }) })
    throw new Error(`Unexpected UI import: ${id}`)
  }
  vm.runInNewContext('(function(require,module,exports){' + compiled + '\n})', {
    document: { body: {} }, window: { innerHeight: 900, innerWidth: 1440 },
  })(mockedRequire, module, module.exports)
  return renderToStaticMarkup(React.createElement(module.exports.default))
}

test('actual contextual UI renders approved image/destination selectors and draft image previews without raw CSS/URL inputs', () => {
  for (const key of ['home.hero-carousel.hero-carousel.style', 'home.home.href.2']) {
    const selectedField = websiteContentCatalogField(getContentField(key))
    const value = selectedField.choices[1].value
    const html = render({ selectedField, value })
    assert.match(html, /<select/)
    assert.doesNotMatch(html, /<textarea|<input[^>]*type="(?:text|url)"/)
    for (const choice of selectedField.choices) assert.ok(html.includes(choice.label))
    assert.match(html, />\s*Save<\/button>/)
    assert.match(html, />Cancel<\/button>/)
    if (selectedField.contentType === 'image') assert.match(html, /src="\/domenica.png"/)
  }
})

test('actual preview UI hides every edit panel and toolbar while preserving return access', () => {
  const html = render({ preview: true })
  assert.match(html, /Return to editing/)
  assert.doesNotMatch(html, /Save Changes|Discard Changes|Edit Website|<select|<textarea|<style/)
})

test('actual exit dialog provides saving, discarding and cancelling with accessible labels', () => {
  const html = render({ exitDestination: '/admin/dashboard', dirtyCount: 2 })
  assert.match(html, /role="alertdialog"/)
  assert.match(html, /aria-modal="true"/)
  for (const label of ['Save and Exit', 'Discard and Exit', 'Cancel']) assert.ok(html.includes(label))
})
