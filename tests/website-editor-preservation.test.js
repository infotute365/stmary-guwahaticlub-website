import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import vm from 'node:vm'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const require = createRequire(import.meta.url)
const babel = require('next/dist/compiled/babel/core')
const reactPreset = require('next/dist/compiled/babel/preset-react')
const commonJs = require('next/dist/compiled/babel/plugin-transform-modules-commonjs')
const root = new URL('../', import.meta.url)
const read = file => fs.readFile(new URL(file, root), 'utf8')
const manifest = JSON.parse(await read('docs/website-editor/baseline/source-hashes.json'))
const task02 = JSON.parse(await read('docs/website-editor/task02-changes.json'))
const completion = JSON.parse(await read('docs/website-editor/task03-completion-changes.json'))
const task04 = JSON.parse(await read('docs/website-editor/task04-changes.json'))
const master = JSON.parse(await read('docs/website-editor/master-changes.json'))
const bindingFiles = JSON.parse(await read('docs/website-editor/task04-binding-files.json'))
const integrations = [...new Set([...bindingFiles.map(file=>file.path),
  'src/components/home/HeroCarousel.jsx',
  'src/components/home/WelcomeSection.jsx',
  'src/site-pages/Home.jsx',
  'src/components/home/CircularsPanel.jsx',
  'src/components/common/StaffCard.jsx',
  'src/components/common/Card.jsx',
  'src/site-pages/Gallery.jsx',
  'src/site-pages/academics/Syllabus.jsx',
])]
const changedUi = new Set([
  ...integrations, 'src/components/Providers.jsx', 'src/components/layout/AdminLayout.jsx',
])

test('original styles, assets, public layouts, routes and other untouched source keep their frozen bytes', async () => {
  const backendHashes = new Map(task02.modifiedFiles.map(file => [file.path, file.afterSha256]))
  for (const change of completion.modifiedFiles) backendHashes.set(change.path, change.afterSha256)
  for (const change of task04.modifiedFiles) backendHashes.set(change.path, change.afterSha256)
  for (const change of master.modifiedFiles) backendHashes.set(change.path, change.afterSha256)
  for (const file of manifest.files.filter(file => !changedUi.has(file.path))) {
    const bytes = await fs.readFile(new URL(file.path, root))
    assert.equal(createHash('sha256').update(bytes).digest('hex'), backendHashes.get(file.path) ?? file.sha256, file.path)
  }
})

const parse = source => babel.parseSync(source, {
  configFile: false, babelrc: false, sourceType: 'module', parserOpts: { plugins: ['jsx'] },
})
function walk(node, visit) {
  if (!node || typeof node !== 'object') return
  if (node.type) visit(node)
  for (const [key, child] of Object.entries(node)) {
    if (['loc', 'start', 'end', 'extra', 'comments', 'leadingComments', 'trailingComments', 'innerComments'].includes(key)) continue
    if (Array.isArray(child)) child.forEach(item => walk(item, visit))
    else if (child?.type) walk(child, visit)
  }
}
function canonical(node) {
  if (Array.isArray(node)) return node.map(canonical)
  if (!node || typeof node !== 'object') return node
  if(node.type==='CallExpression' && node.callee?.object?.name==='websiteContent' && node.callee.property?.name==='value') return canonical(node.arguments[1])
  return Object.fromEntries(Object.entries(node)
    .filter(([key]) => !['loc', 'start', 'end', 'extra', 'comments', 'leadingComments', 'trailingComments', 'innerComments'].includes(key))
    .map(([key, value]) => [key, canonical(value)]))
}
function openingElements(source) {
  const elements = []
  walk(parse(source), node => { if (node.type === 'JSXOpeningElement') elements.push(node) })
  return elements
}

test('public bindings add no wrapper elements and retain every original presentation and behavior attribute', async () => {
  for (const file of integrations) {
    const original = openingElements(await read(`docs/website-editor/baseline/source/${file}.txt`))
    const current = openingElements(await read(file))
    assert.equal(current.length, original.length, `${file}: JSX element count`)
    for (let i = 0; i < original.length; i++) {
      assert.deepEqual(canonical(current[i].name), canonical(original[i].name), `${file}: element ${i}`)
      for (const attribute of original[i].attributes) {
        assert.ok(current[i].attributes.some(candidate => {
          try {
            const normalized = canonical(candidate)
            if(attribute.value?.type==='StringLiteral' && normalized.value?.type==='JSXExpressionContainer' && normalized.value.expression?.type==='StringLiteral') normalized.value=normalized.value.expression
            if (file === 'src/site-pages/Home.jsx' && attribute.name?.name === 'href' && attribute.value?.value === '/contact' && candidate.value?.expression?.object?.name === 'contactDestination' && candidate.value.expression.property?.name === 'value') normalized.value = canonical(attribute.value)
            if (file === 'src/components/home/HeroCarousel.jsx' && attribute.name?.name === 'style') {
              const property = normalized.value?.expression?.properties?.find(item => item.key?.name === 'backgroundImage')
              if (property?.value?.object?.name === 'heroImage' && property.value.property?.name === 'value') property.value = canonical(attribute.value.expression.properties.find(item => item.key?.name === 'backgroundImage').value)
            }
            assert.deepEqual(normalized, canonical(attribute)); return true
          } catch { return false }
        }), `${file}: original ${attribute.name?.name ?? 'spread'} attribute on element ${i}`)
      }
    }
  }
})

// These tests compare the actual old/new component bodies with editing hooks
// inactive. Identical presentational stubs remove browser-only motion/Swiper
// machinery; the assertions do not claim hydrated or pixel-level equivalence.
const motionAttributes = new Set([
  'initial', 'animate', 'exit', 'transition', 'variants', 'viewport',
  'whileHover', 'whileTap', 'whileInView', 'layout', 'layoutId',
])
const element = tag => ({ children, ...props }) => React.createElement(tag,
  Object.fromEntries(Object.entries(props).filter(([key]) => !motionAttributes.has(key))), children)
const motion = new Proxy({}, { get: (_, tag) => element(tag) })
const icons = new Proxy({ __esModule: true }, {
  get: (target, name) => name in target ? target[name] : ({ children, ...props }) => React.createElement('svg', { ...props, 'data-original-icon': name }, children),
})
const placeholder = name => ({ children }) => React.createElement('section', { 'data-original-component': name }, children)
const inactiveHooks = {
  useWebsiteContent: () => ({value:(_key,original)=>original,props:()=>({}),propsFor:()=>({}),html:(_key,original)=>original,imageProps:()=>({})}),
  useWebsiteField: (_key, originalValue) => ({ value: originalValue, editorProps: {} }),
  useWebsiteImage: (_key, originalValue) => ({ value: originalValue, editorProps: {}, targetProps: {} }),
  useManagedRecord: () => () => ({}),
  useEditorCarousel: () => undefined,
}
function loadComponent(source, file, stateOverrides = {}) {
  const stateNames=[]
  walk(parse(source),node=>{if(node.type==='VariableDeclarator'&&node.id.type==='ArrayPattern'&&node.init?.callee?.name==='useState')stateNames.push(node.id.elements[0]?.name)})
  let stateCursor=0
  const result = babel.transformSync(source, {
    filename: file, configFile: false, babelrc: false,
    presets: [[reactPreset, { runtime: 'classic' }]], plugins: [commonJs],
  })
  const module = { exports: {} }
  const mockedRequire = id => {
    if (id === 'react') return {...React,useState:initial=>{const name=stateNames[stateCursor++];return React.useState(Object.hasOwn(stateOverrides,name)?stateOverrides[name]:initial)}}
    if (id === 'framer-motion') return { motion, AnimatePresence: ({ children }) => children }
    if (id === 'lucide-react') return icons
    if (id === 'swiper/react') return {
      Swiper: ({ children, className }) => React.createElement('div', { className, 'data-original-component': 'Swiper' }, children),
      SwiperSlide: placeholder('SwiperSlide'),
    }
    if (id === 'swiper/modules') return { Autoplay: {}, Pagination: {}, EffectFade: {} }
    if (id.startsWith('swiper/css')) return {}
    if (id.endsWith('/website-editor/useWebsiteField.js')) return inactiveHooks
    if (id.endsWith('/website-editor/useWebsiteContent.js')) return inactiveHooks
    if (id.endsWith('/SectionWrapper.jsx') || id.endsWith('/Card.jsx') || id.endsWith('/Accordion.jsx')) {
      return { __esModule: true, default: placeholder(id.split('/').at(-1)) }
    }
    if (/\/(HeroCarousel|StatsCounter|CircularsPanel|WelcomeSection|FeatureCard|PrincipalMessage)\.jsx$/.test(id)) {
      return { __esModule: true, default: placeholder(id.split('/').at(-1)) }
    }
    if (id.endsWith('/services/api.js')) return {
      getCirculars: async () => [], getGallery: async () => [], getSyllabus: async () => [],
      getAcademicYears: async () => [], getSyllabusClasses: async () => [], getSyllabusStreams: async () => [],
      getStaff:async()=>[],getDisclosures:async()=>[],
      getFileUrl: value => value,
    }
    if (id.endsWith('/utils/helpers.js')) return { formatDate: value => value }
    if (id === 'next/link') return {__esModule:true,default:({children,href,...props})=>React.createElement('a',{href,...props},children)}
    if (id === 'next/navigation') return {usePathname:()=>'/'}
    if (/\/(NavDropdown|NavNestedDropdown|PageHeader|StaffCard|Breadcrumb)\.jsx$/.test(id)) return {__esModule:true,default:placeholder(id.split('/').at(-1))}
    if (id === 'react-toastify') return { toast: { success() {}, error() {}, info() {} } }
    throw new Error(`Unexpected import in preservation fixture: ${id} (${file})`)
  }
  vm.runInNewContext('(function(require, module, exports, process) {' + result.code + '\n})', {}, { filename: file })(
    mockedRequire, module, module.exports, process,
  )
  return module.exports.default
}

test('inactive homepage and record bindings render exactly the frozen component markup with inert browser libraries', async () => {
  for (const file of integrations) {
    const before = loadComponent(await read(`docs/website-editor/baseline/source/${file}.txt`), file)
    const after = loadComponent(await read(file), file)
    const cases = file.endsWith('/StaffCard.jsx') ? [
      { staff: { _id: 'fixture-staff', name: 'Fixture Teacher', designation: 'Teacher', qualification: 'Fixture Degree', experience: '5 years', image: '/uploads/staff/fixture.webp', email: 'teacher@example.test', phone: '0000000000' } },
      { staff: { _id: 'fixture-fallback', name: 'Fixture Without Image', designation: 'Teacher', qualification: '', experience: '' } },
    ] : file.endsWith('/Card.jsx') ? [
      { children: React.createElement('p', null, 'Original card body'), className: 'original-extra-class' },
      { children: 'Original card body', hover: false },
    ] : file.endsWith('/Breadcrumb.jsx') ? [{items:[{label:'Fixture breadcrumb',path:'/contact'}]}] : [{}]
    for (const props of cases) {
      const original = renderToStaticMarkup(React.createElement(before, props))
      const current = renderToStaticMarkup(React.createElement(after, props))
      assert.equal(current, original, file)
      assert.doesNotMatch(current, /data-website-editor|data-editor-|contenteditable/i, file)
    }
  }
})

test('loaded, expanded navigation, successful-form and lightbox states retain original markup with no overrides', async () => {
  const image={id:'fixture-image',_id:'fixture-image',image:'/uploads/gallery/fixture.webp',title:'Fixture image',category:'Fixture event',eventDate:'2026-01-01',description:'Fixture description'}
  const stateOverrides={loading:false,isOpen:true,success:true,isLightboxOpen:true,images:[image],selectedImage:image,selectedCircular:{_id:'fixture-notice',title:'Fixture notice',content:'Fixture notice content',date:'2026-01-01'}}
  for(const file of integrations) {
    const props=file.endsWith('/StaffCard.jsx')?{staff:{_id:'fixture-staff',name:'Fixture teacher',designation:'Teacher',qualification:'Fixture degree'}}:file.endsWith('/Breadcrumb.jsx')?{items:[{label:'Fixture breadcrumb',path:'/contact'}]}:{}
    const before=loadComponent(await read(`docs/website-editor/baseline/source/${file}.txt`),file,stateOverrides)
    const after=loadComponent(await read(file),file,stateOverrides)
    assert.equal(renderToStaticMarkup(React.createElement(after,props)),renderToStaticMarkup(React.createElement(before,props)),file)
  }
})

test('the actual field hook preserves defaults and empty overrides while keeping inactive drafts out of public output', async () => {
  const editor = { active: false, published: {}, drafts: {}, fieldProps: () => ({}) }
  const file = 'src/components/website-editor/useWebsiteField.js'
  const compiled = babel.transformSync(await read(file), {
    filename: file, configFile: false, babelrc: false, plugins: [commonJs],
  })
  const module = { exports: {} }
  const mockedRequire = id => {
    if (id === 'react') return React
    if (id === './WebsiteEditorProvider.jsx') return { useWebsiteEditor: () => editor }
    throw new Error(`Unexpected field-hook import: ${id}`)
  }
  vm.runInNewContext('(function(require, module, exports) {' + compiled.code + '\n})', {}, { filename: file })(
    mockedRequire, module, module.exports,
  )
  function Field() {
    const { value, editorProps } = module.exports.useWebsiteField('registered.key', 'Original value')
    return React.createElement('span', editorProps, value)
  }
  const render = () => renderToStaticMarkup(React.createElement(Field))
  assert.equal(render(), '<span>Original value</span>')
  editor.drafts['registered.key'] = { value: 'Private unsaved value', expectedRevision: 0 }
  assert.equal(render(), '<span>Original value</span>')
  editor.published['registered.key'] = { value: '', revision: 1 }
  assert.equal(render(), '<span></span>')
  editor.published['registered.key'] = { value: 0, revision: 2 }
  assert.equal(render(), '<span>0</span>')
  editor.active = true
  assert.equal(render(), '<span>Private unsaved value</span>')
  editor.active = false
  assert.equal(render(), '<span>0</span>')
})
