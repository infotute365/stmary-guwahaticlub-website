import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import * as bindings from '../src/components/website-editor/editor-bindings.js'
import * as state from '../src/components/website-editor/editor-state.js'
import { getContentField } from '../src/server/util/websiteContentPolicy.js'
import { CONTENT_BINDINGS } from '../src/content/website-bindings.js'

const require = createRequire(import.meta.url)
const babel = require('next/dist/compiled/babel/core')
const registry = JSON.parse(await fs.readFile(new URL('../docs/website-editor/baseline/content-registry.json', import.meta.url), 'utf8'))
const source = await fs.readFile(new URL('../src/components/website-editor/WebsiteEditorProvider.jsx', import.meta.url), 'utf8')
const compiled = babel.transformSync(source, { configFile: false, babelrc: false,
  presets: [[require('next/dist/compiled/babel/preset-react'), { runtime: 'classic' }]],
  plugins: [require('next/dist/compiled/babel/plugin-transform-modules-commonjs')],
}).code

// Execute the actual provider with deterministic hooks and API responses. This
// verifies its controller transitions, not browser rendering or mobile layout.
async function fixture({ authorized = true, intent = false, catalogBindings = bindings.HOME_BINDINGS, initialPublished } = {}) {
  let serverPublished=initialPublished
  const hooks = [], effects = [], storage = new Map(), listeners = new Map()
  let cursor = 0, dirty = true, context
  const server = { authorized, path: '/', saved: {}, history: {}, requests: [], conflict: false, navigated: null, auth:{loading:false,isAdmin:true} }
  if (intent) storage.set('stmary.website-editor.intent.v1', 'requested')
  const changed = (a, b) => !a || a.length !== b.length || a.some((value, index) => !Object.is(value, b[index]))
  const React = {
    createContext: value => ({ Provider: 'Provider', value }),
    createElement: (type, props, ...children) => ({ type, props: { ...props, children } }),
    useState(initial) {
      const slot = cursor++
      if (!hooks[slot]) hooks[slot] = { value: typeof initial === 'function' ? initial() : initial }
      const set = value => { const next = typeof value === 'function' ? value(hooks[slot].value) : value; if (!Object.is(next, hooks[slot].value)) { hooks[slot].value = next; dirty = true } }
      return [hooks[slot].value, set]
    },
    useRef(value) { const slot = cursor++; return hooks[slot] || (hooks[slot] = { current: value }) },
    useCallback(fn, deps) { const slot = cursor++; if (!hooks[slot] || changed(hooks[slot].deps, deps)) hooks[slot] = { value: fn, deps }; return hooks[slot].value },
    useMemo(fn, deps) { const slot = cursor++; if (!hooks[slot] || changed(hooks[slot].deps, deps)) hooks[slot] = { value: fn(), deps }; return hooks[slot].value },
    useEffect(fn, deps) { const slot = cursor++; if (!hooks[slot] || changed(hooks[slot].deps, deps)) { const old = hooks[slot]; hooks[slot] = { deps, cleanup: old?.cleanup }; effects.push(() => { old?.cleanup?.(); hooks[slot].cleanup = fn() }) } },
    useContext: () => context,
  }
  const unauthorized = () => Object.assign(new Error('Unauthorized'), { response: { status: 401, data: { message: 'Unauthorized' } } })
  const catalog = () => catalogBindings.filter(binding=>getContentField(binding.key).usedOnRoutes.includes(server.path)).map(binding => {
    const original = getContentField(binding.key)
    const saved = server.saved[binding.key]
    return { ...original, editable: true, value: saved?.value ?? original.defaultValue, revision: saved?.revision ?? 0, hasOverride: Boolean(saved) && saved.hasOverride!==false, maxLength: 10000 }
  })
  const api = {
    getWebsiteContentHistory: async key => ({key,entries:server.history[key]||[],hasMore:false}),
    resetWebsiteContent: async (key,expectedRevision) => {
      if(expectedRevision!==(server.saved[key]?.revision??0))throw {response:{status:409}}
      const original=getContentField(key)
      const field={key,value:original.defaultValue,revision:expectedRevision+1,hasOverride:false}
      server.saved[key]={...field,contentType:original.contentType}
      return {field}
    },
    restoreWebsiteContent: async (key,revision,expectedRevision) => {
      if(expectedRevision!==(server.saved[key]?.revision??0))throw {response:{status:409}}
      const entry=server.history[key].find(entry=>entry.revision===revision)
      const field={key,value:entry.newValue,revision:expectedRevision+1,hasOverride:true}
      server.saved[key]={...field,contentType:getContentField(key).contentType}
      return {field}
    },
    uploadWebsiteImage: async key => ({image:{value:getContentField(key).backgroundImage?"url('/uploads/website/11111111-1111-4111-8111-111111111111/2560.webp')":'/uploads/website/11111111-1111-4111-8111-111111111111/2560.webp'}}),
    getSession: async () => { if (!server.authorized) throw unauthorized(); return { id: 'fixture-admin', isActive: true, role: 'admin' } },
    getWebsiteContentCatalog: async path => { if (!server.authorized) throw unauthorized(); return { path, fields: catalog() } },
    getWebsiteContent: async () => ({ path: '/', overrides: Object.fromEntries(Object.entries(server.saved).filter(([,value])=>value.hasOverride!==false)) }),
    saveWebsiteContent: async (key, value, expectedRevision, contentType, options) => {
      server.requests.push({ key, value, expectedRevision, contentType, options })
      if(server.beforeSave)await server.beforeSave()
      if (!server.authorized) throw unauthorized()
      if (server.conflict || expectedRevision !== (server.saved[key]?.revision ?? 0)) throw { response: { status: 409, data: { message: 'Changed elsewhere' } } }
      const field = { key, value, revision: expectedRevision + 1, hasOverride: true, updatedAt: 'fixture-time' }
      server.saved[key] = { value, revision: field.revision, contentType }
      server.history[key]=[{revision:field.revision,newValue:value,changedAt:'2026-11-01T00:00:00Z'},...(server.history[key]||[])]
      return { field }
    },
  }
  const module = { exports: {} }
  const listen = (name, fn) => listeners.set(name, fn)
  const sandbox = {
    URL,
    sessionStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) },
    document: { visibilityState: 'visible', querySelectorAll: () => [], addEventListener: listen, removeEventListener: name => listeners.delete(name) },
    window: { location: { origin: 'http://fixture.local', search: '' }, addEventListener: listen, removeEventListener: name => listeners.delete(name), setInterval: () => 1, innerHeight: 800 },
    clearInterval() {},
  }
  const router = { push: path => { server.path = path; server.navigated = path } }
  const mockedRequire = id => {
    if (id === 'react') return React
    if (id === 'next/dynamic') return { __esModule: true, default: () => 'EditorUI' }
    if (id === 'next/navigation') return { usePathname: () => server.path, useRouter: () => router }
    if (id.endsWith('/services/api.js')) return api
    if (id === './editor-bindings.js') return bindings
    if (id.endsWith('/content/website-bindings.js')) return { CONTENT_BINDINGS }
    if (id === './editor-state.js') return state
    if (id.endsWith('/hooks/useAuth.js')) return { useAuth: () => server.auth }
    throw new Error(`Unexpected provider import: ${id}`)
  }
  vm.runInNewContext('(function(require,module,exports){' + compiled + '\n})', sandbox)(mockedRequire, module, module.exports)
  async function settle() {
    dirty = true // A navigation supplies new router props even without state.
    for (let turn = 0; turn < 30; turn++) {
      if (dirty) { dirty = false; cursor = 0; context = module.exports.default({ children: 'Original website', ...(serverPublished ? {initialPublished:serverPublished} : {}) }).props.value }
      while (effects.length) effects.shift()()
      await new Promise(resolve => setImmediate(resolve))
      if (!dirty && !effects.length) return context
    }
    throw new Error('Provider failed to settle')
  }
  await settle()
  return { server, storage, listeners, get context() { return context }, settle, async receiveServerSnapshot(value){serverPublished=value;return settle()} }
}

test('an authoritative refreshed server snapshot removes overrides restored by another administrator',async()=>{
  const key=bindings.HOME_BINDINGS.find(field=>field.kind==='text').key
  const app=await fixture({initialPublished:{[key]:{value:'Previously published',revision:2,contentType:'text'}}})
  assert.equal(app.context.published[key].value,'Previously published')
  await app.receiveServerSnapshot({})
  assert.equal(app.context.published[key],undefined,'Restored defaults must not be re-added from stale client state')
})

test('logout during an in-flight multi-field save stops later saves and ignores stale completions',async()=>{
  const app=await fixture({intent:true})
  const keys=app.context.fields.filter(field=>field.contentType==='text').slice(0,2).map(field=>field.key)
  for(const key of keys){app.context.selectField(key);await app.settle();app.context.changeField(`Draft ${key}`);await app.settle()}
  let finish
  app.server.beforeSave=()=>app.server.requests.length===1?new Promise(resolve=>{finish=resolve}):Promise.resolve()
  const saving=app.context.saveAll()
  await new Promise(resolve=>setImmediate(resolve))
  app.server.auth={loading:false,isAdmin:false}
  await app.settle()
  assert.equal(app.context.active,false)
  finish()
  assert.equal(await saving,false)
  await app.settle()
  assert.equal(app.server.requests.length,1)
  assert.equal(Object.keys(app.context.drafts).length,0)
  assert.equal(app.context.published[keys[0]],undefined)
})

test('editor intent and a client admin claim never authorize an anonymous session', async () => {
  const app = await fixture({ authorized: false, intent: true })
  assert.equal(app.context.active, false)
  assert.equal(app.storage.size, 0)
  assert.deepEqual(Object.keys(app.context.drafts), [])
})

test('every approved field can be selected, saved, reloaded publicly, viewed in history and reset through the actual provider controller',async()=>{
  const app=await fixture({intent:true,catalogBindings:CONTENT_BINDINGS})
  const results=[]
  try {
    for(const [index,binding] of CONTENT_BINDINGS.entries()) {
      const field=getContentField(binding.key,{editable:true})
      const row={key:field.key,route:field.usedOnRoutes[0],select:'NOT_RUN',save:'NOT_RUN',freshPublicProvider:'NOT_RUN',history:'NOT_RUN',reset:'NOT_RUN'}
      results.push(row)
      app.server.path=row.route;await app.settle()
      assert.equal(app.context.active,true)
      app.context.selectField(field.key);await app.settle()
      assert.equal(app.context.selectedField.key,field.key)
      assert.equal(app.context.value,field.defaultValue)
      row.select='PASS'
      let value
      if(field.contentType==='image') {await app.context.uploadSelectedImage({name:'fixture.png'});await app.settle();value=app.context.value}
      else {
        value=field.contentType==='number'?field.defaultValue+1:field.contentType==='url'?field.choices.find(choice=>choice.value!==field.defaultValue).value:`Provider verified field ${index}`
        app.context.changeField(value);await app.settle()
      }
      if(field.contentType==='url'){app.context.confirmDestination(true);await app.settle()}
      assert.equal(await app.context.saveField(),true);await app.settle()
      assert.equal(app.context.dirtyCount,0)
      assert.equal(app.context.published[field.key].value,value)
      row.save='PASS'
      const fresh=await fixture({initialPublished:{[field.key]:app.context.published[field.key]}})
      assert.equal(fresh.context.active,false)
      assert.equal(fresh.context.published[field.key].value,value)
      assert.equal(Object.keys(fresh.context.fieldProps(field.key)).length,0)
      row.freshPublicProvider='PASS'
      assert.equal(app.context.history.entries[0].newValue,value)
      row.history='PASS'
      if(field.contentType==='url'){app.context.confirmDestination(true);await app.settle()}
      assert.equal(await app.context.revertSelected(),true);await app.settle()
      assert.equal(app.context.value,field.defaultValue)
      assert.equal(app.context.published[field.key],undefined)
      row.reset='PASS'
    }
  } finally {
    const prefix=process.env.WEBSITE_EDITOR_TEST_STAGE==='master'?'master':process.env.WEBSITE_EDITOR_TEST_STAGE==='05'?'task05':'task04'
    await fs.writeFile(`docs/website-editor/${prefix}-provider-field-results.json`,JSON.stringify({scope:'Actual React provider/controller with deterministic hook, API and browser-state mocks; not browser automation',results},null,2)+'\n')
  }
})

test('destination confirmation is required before saving and image upload stays a draft until explicit save',async()=>{
  const app=await fixture({intent:true})
  const key='home.home.href.2'
  app.context.selectField(key);await app.settle()
  app.context.changeField('/admissions');await app.settle()
  assert.equal(await app.context.saveField(),false);await app.settle()
  assert.match(app.context.fieldError,/Confirm/)
  assert.equal(app.server.requests.length,0)
  app.context.confirmDestination(true);await app.settle()
  assert.equal(await app.context.saveField(),true);await app.settle()
  assert.equal(app.server.requests[0].options.confirmDestination,true)
  const image='home.hero-carousel.hero-carousel.style'
  app.context.selectField(image);await app.settle()
  assert.equal(await app.context.uploadSelectedImage({name:'fixture.png'}),true);await app.settle()
  assert.equal(app.server.saved[image],undefined)
  assert.match(app.context.drafts[image].value,/uploads\/website/)
  assert.equal(await app.context.saveField(),true);await app.settle()
  assert.match(app.context.published[image].value,/uploads\/website/)
})

test('actual reversion controller restores originals and history without discarding unrelated drafts',async()=>{
  const app=await fixture({intent:true})
  const key=bindings.HOME_BINDINGS[0].key,other=bindings.HOME_BINDINGS[1].key
  app.context.selectField(key);await app.settle();app.context.changeField('Saved revision fixture');await app.settle()
  await app.context.saveField();await app.settle()
  assert.equal(app.context.history.entries.length,1)
  app.context.selectField(other);await app.settle();app.context.changeField('Keep unrelated draft');await app.settle()
  app.context.selectField(key);await app.settle()
  assert.equal(await app.context.revertSelected(),true);await app.settle()
  assert.equal(app.context.value,getContentField(key).defaultValue)
  assert.equal(app.context.drafts[other].value,'Keep unrelated draft')
  assert.equal(await app.context.revertSelected(1),true);await app.settle()
  assert.equal(app.context.value,'Saved revision fixture')
  assert.equal(app.context.drafts[other].value,'Keep unrelated draft')
})

test('actual provider saves only dirty registered fields, keeps conflicts and supports preview/cancel/exit', async () => {
  const app = await fixture()
  assert.equal(app.context.active, false)
  app.context.startEditing()
  await app.settle()
  assert.equal(app.context.active, true)
  const key = bindings.HOME_BINDINGS[0].key
  const other = bindings.HOME_BINDINGS[1].key
  app.context.selectField(key)
  await app.settle()
  app.context.changeField('Fixture heading')
  await app.settle()
  assert.equal(app.context.dirtyCount, 1)
  const one = app.context.saveField()
  const duplicate = app.context.saveField()
  await Promise.all([one, duplicate])
  await app.settle()
  assert.equal(app.server.requests.length, 1)
  assert.equal(app.server.requests[0].key, key)
  assert.equal(app.context.dirtyCount, 0)
  assert.equal(app.context.published[key].value, 'Fixture heading')

  app.context.changeField('Unsaved heading')
  await app.settle()
  app.context.togglePreview()
  await app.settle()
  assert.equal(app.context.preview, true)
  assert.equal(Object.keys(app.context.fieldProps(key)).length, 0)
  app.context.togglePreview()
  await app.settle()
  assert.equal(app.context.preview, false)
  app.context.selectField(other)
  await app.settle()
  app.context.changeField('Unsaved description')
  await app.settle()
  app.context.cancelField()
  await app.settle()
  assert.equal(app.context.dirtyCount, 1)
  assert.equal(app.context.drafts[key].value, 'Unsaved heading')

  app.context.selectField(key)
  await app.settle()
  app.server.conflict = true
  assert.equal(await app.context.saveField(), false)
  await app.settle()
  assert.equal(app.context.errorStatus, 409)
  assert.equal(app.context.dirtyCount, 1)
  app.context.requestExit('/admin/dashboard')
  await app.settle()
  assert.equal(app.context.exitDestination, '/admin/dashboard')
  await app.context.finishExit('cancel')
  await app.settle()
  assert.equal(app.context.active, true)
  assert.equal(app.context.exitDestination, null)
  app.context.requestExit('/admin/dashboard')
  await app.settle()
  await app.context.finishExit('discard')
  await app.settle()
  assert.equal(app.context.active, false)
  assert.equal(app.context.dirtyCount, 0)
  assert.equal(app.server.navigated, '/admin/dashboard')
  assert.equal(app.storage.size, 0)
})

test('editor mode and drafts survive public navigation; Save and Exit persists before clearing intent', async () => {
  const app = await fixture({ intent: true })
  const key = bindings.HOME_BINDINGS[3].key
  app.context.selectField(key)
  await app.settle()
  app.context.changeField('1925 fixture')
  await app.settle()
  app.server.path = '/contact'
  await app.settle()
  assert.equal(app.context.active, true)
  assert.equal(app.context.dirtyCount, 1)
  assert.equal(app.context.fields.length, 0)
  app.server.path = '/'
  await app.settle()
  app.context.requestExit('/admin/dashboard')
  await app.settle()
  await app.context.finishExit('save')
  await app.settle()
  assert.equal(app.server.saved[key].value, '1925 fixture')
  assert.equal(app.context.active, false)
  assert.equal(app.context.dirtyCount, 0)
})

test('actual capture handler routes plain public anchors without unloading drafts and blocks payment activation', async () => {
  const app = await fixture({ intent: true })
  const key = bindings.HOME_BINDINGS[0].key
  app.context.selectField(key)
  await app.settle()
  app.context.changeField('Keep this draft during navigation')
  await app.settle()
  const activate = href => {
    let prevented = false
    const anchor = { getAttribute: () => href, hasAttribute: () => false }
    app.listeners.get('click')({ target: { closest: selector => selector === 'a[href]' ? anchor : null },
      preventDefault() { prevented = true }, stopPropagation() {},
    })
    return prevented
  }
  assert.equal(activate('https://epay.federalbank.co.in/easypayments/DIRECTPAYMENT.ASPX?CODE=DABB4QLY4Q1O4'), true)
  await app.settle()
  assert.equal(app.server.navigated, null)
  assert.match(app.context.message, /protected/)
  assert.equal(activate('/contact'), true)
  await app.settle()
  assert.equal(app.server.navigated, '/contact')
  assert.equal(app.context.active, true)
  assert.equal(app.context.drafts[key].value, 'Keep this draft during navigation')
})

test('background-image surfaces are selectable without swallowing nested hero links', async () => {
  const app = await fixture({ intent: true })
  const key = 'home.hero-carousel.hero-carousel.style'
  let prevented = false
  app.listeners.get('click')({ target: { closest: selector => selector === '[data-website-image-field]' ? { dataset: { websiteImageField: key } } : null },
    preventDefault() { prevented = true }, stopPropagation() {},
  })
  await app.settle()
  assert.equal(prevented, true)
  assert.equal(app.context.selectedField.key, key)
  const anchor = { getAttribute: () => '/admissions', hasAttribute: () => false }
  app.listeners.get('click')({ target: { closest: selector => selector === 'a,button,input,select,textarea' || selector === 'a[href]' ? anchor : selector === '[data-website-image-field]' ? { dataset: { websiteImageField: key } } : null },
    preventDefault() {}, stopPropagation() {},
  })
  await app.settle()
  assert.equal(app.server.navigated, '/admissions')
})
