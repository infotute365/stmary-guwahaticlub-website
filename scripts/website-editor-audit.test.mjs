import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const cli=fileURLToPath(new URL('./website-editor-audit.mjs',import.meta.url))
const digest=s=>createHash('sha256').update(s).digest('hex')
const original=`'use client'\nexport default function Home() { return <h1 className="original">Welcome</h1> }\n`
const key='home.section-1.heading'
const lookup=`getWebsiteContent("${key}", "Welcome")`

async function fixture(t) {
  const directory=await fs.mkdtemp(path.join(os.tmpdir(),'stmary-editor-check-'))
  t.after(async()=>{
    // Delete only the exact uniquely created fixture directory.
    if(path.dirname(path.resolve(directory))!==path.resolve(os.tmpdir())||!path.basename(directory).startsWith('stmary-editor-check-')) throw new Error('Unsafe fixture cleanup path')
    await fs.rm(directory,{recursive:true,force:true})
  })
  async function write(file,value) {
    const target=path.join(directory,file)
    await fs.mkdir(path.dirname(target),{recursive:true})
    await fs.writeFile(target,typeof value==='string'?value:JSON.stringify(value))
  }
  const file='src/site-pages/Home.jsx'
  await write(file,original)
  await write(`docs/website-editor/baseline/source/${file}.txt`,original)
  await write('docs/website-editor/baseline/source-hashes.json',{files:[{path:file,sha256:digest(original)}]})
  const field={key,status:'editable',audience:'public',defaultValue:'Welcome',reason:'JSX text segment',source:{file,start:original.indexOf('Welcome'),end:original.indexOf('Welcome')+7}}
  await write('docs/website-editor/baseline/content-registry.json',{fields:[field]})
  await write('docs/website-editor/baseline/source-literals.json',[{file,start:field.source.start,nodeType:'JSXText',address:'program.body.children[0]'}])
  const bound=original.replace('Welcome',`{${lookup}}`)
  const item={path:file,beforeSha256:digest(original),afterSha256:digest(bound),bindings:[{key}]}
  const run=()=>spawnSync(process.execPath,[cli,'review-bindings','plan.json'],{cwd:directory,encoding:'utf8',windowsHide:true})
  return {write,run,file,field,bound,item}
}

test('binding review accepts only the exact lookup with the original default',async t=>{
  const f=await fixture(t)
  await f.write(f.file,f.bound)
  await f.write('plan.json',{version:1,files:[f.item]})
  const r=f.run()
  assert.equal(r.status,0,r.stderr)
  assert.equal(JSON.parse(r.stdout).approved,false)
})

test('binding review rejects an extra layout change even with its correct after hash',async t=>{
  const f=await fixture(t), actual=f.bound.replace('className="original"','className="redesigned"')
  await f.write(f.file,actual)
  await f.write('plan.json',{version:1,files:[{...f.item,afterSha256:digest(actual)}]})
  const r=f.run()
  assert.notEqual(r.status,0)
  assert.match(r.stderr,/exceeds exact fallback-preserving/)
})

test('binding review rejects a rewritten fallback',async t=>{
  const f=await fixture(t), actual=f.bound.replace('"Welcome"','"New wording"')
  await f.write(f.file,actual)
  await f.write('plan.json',{version:1,files:[{...f.item,afterSha256:digest(actual)}]})
  const r=f.run()
  assert.notEqual(r.status,0)
  assert.match(r.stderr,/exceeds exact fallback-preserving/)
})

test('binding review rejects protected fields',async t=>{
  const f=await fixture(t)
  await f.write('docs/website-editor/baseline/content-registry.json',{fields:[{...f.field,status:'protected'}]})
  await f.write(f.file,f.bound)
  await f.write('plan.json',{version:1,files:[f.item]})
  const r=f.run()
  assert.notEqual(r.status,0)
  assert.match(r.stderr,/Ineligible binding/)
})

test('binding review rejects unlisted source changes',async t=>{
  const f=await fixture(t)
  await f.write(f.file,original.replace('Welcome','Changed'))
  await f.write('plan.json',{version:1,files:[]})
  const r=f.run()
  assert.notEqual(r.status,0)
  assert.match(r.stderr,/Unlisted original change/)
})

test('binding review rejects duplicate bindings',async t=>{
  const f=await fixture(t)
  await f.write('plan.json',{version:1,files:[{...f.item,bindings:[{key},{key}]}]})
  const r=f.run()
  assert.notEqual(r.status,0)
  assert.match(r.stderr,/Duplicate binding/)
})
