import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import vm from 'node:vm'
import {createRequire} from 'node:module'
import React from 'react'
import {MANAGED_MODULES} from '../src/components/website-editor/editor-bindings.js'

const require=createRequire(import.meta.url),babel=require('next/dist/compiled/babel/core')
test('the actual admin Edit Website control starts editor intent and routes to the original homepage',async()=>{
  const source=await fs.readFile('src/components/layout/AdminLayout.jsx','utf8')
  const compiled=babel.transformSync(source,{configFile:false,babelrc:false,presets:[[require('next/dist/compiled/babel/preset-react'),{runtime:'classic'}]],plugins:[require('next/dist/compiled/babel/plugin-transform-modules-commonjs')]}).code
  const calls=[],module={exports:{}}
  const runtime={...React,useState:initial=>[initial,()=>{}]}
  const imports=id=>{
    if(id==='react')return runtime
    if(id==='next/link')return {__esModule:true,default:'a'}
    if(id==='next/navigation')return {usePathname:()=>'/admin/dashboard',useRouter:()=>({push:value=>calls.push(['navigate',value])})}
    if(id==='lucide-react')return new Proxy({},{get:()=>()=>null})
    if(id.endsWith('/useAuth.js'))return {useAuth:()=>({user:{fullname:'QA Fixture',email:'fixture@example.test'},logout:async()=>{}})}
    if(id.endsWith('/WebsiteEditorProvider.jsx'))return {useWebsiteEditor:()=>({startEditing:()=>calls.push(['start'])})}
    throw new Error(`Unexpected admin import ${id}`)
  }
  vm.runInNewContext('(function(require,module,exports){'+compiled+'\n})',{})(imports,module,module.exports)
  const root=module.exports.default({children:'fixture'}),elements=[]
  const visit=node=>{if(!node||typeof node!=='object')return;if(node.type)elements.push(node);React.Children.forEach(node.props?.children,visit)}
  visit(root)
  const label=node=>{if(typeof node==='string')return node;return React.Children.toArray(node?.props?.children).map(label).join('')}
  const control=elements.find(node=>label(node)==='Edit Website'&&typeof node.props?.onClick==='function')
  assert.ok(control,'Original admin navigation must expose the actual editor handler')
  assert.ok(control.props.className.includes('rounded-lg'),'Uses the existing admin navigation styling')
  control.props.onClick({preventDefault:()=>calls.push(['preventDefault'])})
  assert.deepEqual(calls,[['start']])
  assert.equal(control.props.href,'/','The existing Next Link owns homepage navigation')
  assert.ok(elements.some(node=>node.props?.href==='/admin/disclosure'))
  assert.equal(MANAGED_MODULES.disclosure.path,'/admin/disclosure')
})

test('saving through the actual Syllabus form refreshes the administrator list with the saved record',async()=>{
  const source=await fs.readFile('src/components/admin/Syllabus.jsx','utf8')
  const compiled=babel.transformSync(source,{configFile:false,babelrc:false,presets:[[require('next/dist/compiled/babel/preset-react'),{runtime:'classic'}]],plugins:[require('next/dist/compiled/babel/plugin-transform-modules-commonjs')]}).code
  const hooks=[],calls=[],module={exports:{}}
  let cursor=0
  const record={_id:'0123456789abcdef01234567',class:'5',academicYear:'2025-26',stream:'general',isPublished:true}
  const runtime={...React,useState:initial=>{
    const index=cursor++
    if(!(index in hooks))hooks[index]=initial
    return [hooks[index],value=>{hooks[index]=typeof value==='function'?value(hooks[index]):value}]
  },useEffect:()=>{}}
  const imports=id=>{
    if(id==='react')return runtime
    if(id==='lucide-react')return new Proxy({},{get:()=>()=>null})
    if(id==='react-toastify')return {toast:{success:()=>{},error:value=>{throw new Error(value)}}}
    if(id.endsWith('/services/api.js'))return {
      getSyllabus:async()=>{calls.push('read');return [record]},
      createSyllabus:async payload=>{assert.equal(payload.fileUrl,'/uploads/syllabus/fixture.pdf');calls.push('create')},
      updateSyllabus:async()=>{calls.push('update')},deleteSyllabus:async()=>{},
      uploadPDF:async()=>{calls.push('upload');return {path:'/uploads/syllabus/fixture.pdf'}},getFileUrl:value=>value,
    }
    throw new Error(`Unexpected syllabus import ${id}`)
  }
  vm.runInNewContext('(function(require,module,exports){'+compiled+'\n})',{})(imports,module,module.exports)
  const render=()=>{cursor=0;const nodes=[];const visit=node=>{if(!node||typeof node!=='object')return;nodes.push(node);React.Children.forEach(node.props?.children,visit)};visit(module.exports.default());return nodes}
  let nodes=render()
  const text=node=>typeof node==='string'?node:React.Children.toArray(node?.props?.children).map(text).join('')
  nodes.find(node=>node.type==='button'&&text(node).includes('Add Syllabus')).props.onClick()
  nodes=render()
  nodes.find(node=>node.type==='input'&&node.props.type==='file').props.onChange({target:{files:[{name:'fixture.pdf'}]}})
  nodes=render()
  await nodes.find(node=>node.type==='form').props.onSubmit({preventDefault(){}})
  assert.deepEqual(calls,['upload','create','read'])
  assert.equal(hooks[0][0],record,'The refreshed saved record must appear in the actual component state')
})
