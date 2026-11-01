import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const require=createRequire(import.meta.url)
const babel=require('next/dist/compiled/babel/core')
const source=await fs.readFile(new URL('../src/components/website-editor/useWebsiteContent.js',import.meta.url),'utf8')
const compiled=babel.transformSync(source,{configFile:false,babelrc:false,plugins:[require('next/dist/compiled/babel/plugin-transform-modules-commonjs')]}).code
const editor={active:false,preview:false,published:{},drafts:{},fieldProps:key=>editor.active&&!editor.preview?{'data-website-field':key,tabIndex:0}:{}}
const module={exports:{}}
vm.runInNewContext('(function(require,module,exports){'+compiled+'\n})',{})(()=>({useWebsiteEditor:()=>editor}),module,module.exports)
const reader=()=>module.exports.useWebsiteContent()

test('actual content reader preserves distinct array keys, styled boundaries, empty/zero values and public draft isolation',()=>{
  editor.active=false;editor.published={first:{value:''},second:{value:0}};editor.drafts={third:{value:'Private draft'}}
  let content=reader()
  assert.equal(content.value('first','Original'),'')
  assert.equal(content.value('second',12),0)
  assert.equal(content.value('third','Public default'),'Public default')
  assert.deepEqual(Object.keys(content.props(['first','second'])),[])
  editor.active=true;editor.published={};editor.drafts={}
  content=reader()
  content.value('card.one','Same text');content.value('card.two','Same text')
  assert.equal(content.propsFor('Same text')['data-website-fields'],'card.one card.two')
  editor.published={'card.one':{value:'Changed first'}}
  content=reader();content.value('card.one','Same text');content.value('card.two','Same text')
  assert.equal(content.propsFor('Changed first')['data-website-fields'],'card.one')
  assert.equal(content.propsFor('Same text')['data-website-fields'],'card.two')
  content.value('biography','First full paragraph.\n\nSecond full paragraph.')
  assert.equal(content.propsFor('Second full paragraph.')['data-website-field'],'biography')
  editor.published={};editor.active=false
  content=reader()
  const html=renderToStaticMarkup(React.createElement('h1',null,content.value('heading.one','Our '),React.createElement('span',{className:'original-gold'},content.value('heading.two','Founders'))))
  assert.equal(html,'<h1>Our <span class="original-gold">Founders</span></h1>')
})

test('actual print reader leaves original HTML text intact and escapes edited text',()=>{
  editor.active=false;editor.published={};editor.drafts={}
  assert.equal(reader().html('print','School & Family'),'School & Family')
  editor.published={print:{value:'Edited & <unsafe> "text"'}}
  assert.equal(reader().html('print','Original'),'Edited &amp; &lt;unsafe&gt; &quot;text&quot;')
})

test('responsive image attributes appear only for replacement families and preview removes selection controls',()=>{
  editor.active=false;editor.published={};editor.drafts={}
  assert.deepEqual(Object.keys(reader().imageProps('/logo.jpeg')),[])
  const source='/uploads/website/11111111-1111-4111-8111-111111111111/2560.webp'
  const props=reader().imageProps(source)
  assert.match(props.srcSet,/640\.webp 640w/)
  assert.match(props.srcSet,/2560\.webp 2560w/)
  assert.equal(Object.hasOwn(props,'data-website-field'),false)
  editor.active=true;editor.preview=true
  const content=reader();content.value('logo','/logo.jpeg')
  assert.deepEqual(Object.keys(content.imageProps('/logo.jpeg')),[])
  editor.preview=false;editor.active=false
})

test('the actual carousel hook leaves public autoplay alone and selects the edited slide in edit mode',async()=>{
  const source=await fs.readFile(new URL('../src/components/website-editor/useWebsiteField.js',import.meta.url),'utf8')
  const code=babel.transformSync(source,{configFile:false,babelrc:false,plugins:[require('next/dist/compiled/babel/plugin-transform-modules-commonjs')]}).code
  const refs=[];let cursor=0
  const react={useRef:initial=>refs[cursor++]||(refs[cursor-1]={current:initial}),useCallback:fn=>fn,useEffect:fn=>fn()}
  const state={active:false,preview:false,selectedField:null}
  const output={exports:{}}
  vm.runInNewContext('(function(require,module,exports){'+code+'\n})',{})(id=>id==='react'?react:{useWebsiteEditor:()=>state},output,output.exports)
  const changes=[]
  const swiper={slideTo:index=>changes.push(`slide ${index}`),autoplay:{stop:()=>changes.push('stop'),start:()=>changes.push('start')}}
  const render=()=>{cursor=0;return output.exports.useEditorCarousel()}
  render()(swiper);assert.deepEqual(changes,[])
  state.active=true;render();assert.deepEqual(changes,['slide 0','stop'])
  state.selectedField={key:'home.hero-carousel.slides.item3.title'};render();assert.deepEqual(changes.slice(-2),['slide 2','stop'])
  state.active=false;render();assert.equal(changes.at(-1),'start')
  const count=changes.length;render();assert.equal(changes.length,count)
})
