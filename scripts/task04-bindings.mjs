import fs from 'node:fs/promises'
import path from 'node:path'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import {applyPublicCopyAmendments} from './public-copy-amendments.mjs'
const require = createRequire(import.meta.url)
const babel = require('next/dist/compiled/babel/core')
const registry = JSON.parse(await fs.readFile('docs/website-editor/baseline/content-registry.json', 'utf8'))
const routes = JSON.parse(await fs.readFile('docs/website-editor/baseline/routes.json', 'utf8'))
const sourceRoot = 'docs/website-editor/task04-source-inputs'
const manual = new Set(['home.hero-carousel.slides.item1.title','home.hero-carousel.slides.item1.description','home.welcome-section.welcome-section.paragraph','home.home.item1.value','home.hero-carousel.hero-carousel.style','home.home.href.2'])
const protectedImages = new Set(['global.staff-card.staff-card.src','global.staff-card.staff-card.src.2','contact.contact-us.src'])
const structuralDestinations = new Set(['global.footer.footer.href.2', ...registry.fields.filter(f => f.source.file.endsWith('/Navbar.jsx') && f.contentType === 'url' && !routes.some(r => r.path === f.defaultValue)).map(f=>f.key)])
export const approved = registry.fields.filter(f => f.audience === 'public' && (f.status === 'editable' || f.contentType === 'image' && !protectedImages.has(f.key) || f.contentType === 'url' && !f.key.startsWith('global.top-bar.fee-options.') && !structuralDestinations.has(f.key)))
const files = [...new Set(approved.map(f => f.source.file))].sort()
const digest = bytes => createHash('sha256').update(bytes).digest('hex')
const json = value => JSON.stringify(value)
function parse(source) {
  const ast = babel.parseSync(source, {configFile:false,babelrc:false,parserOpts:{plugins:['jsx']}})
  const nodes=[], elements=[], variables=[]
  function walk(n, trail=[], ancestors=[]) {
    if(!n?.type)return
    const record={n,trail,ancestors}; nodes.push(record)
    if(n.type==='JSXElement')elements.push(record)
    if(n.type==='VariableDeclarator')variables.push(record)
    for(const [k,v] of Object.entries(n)) {
      if(['loc','extra','comments','leadingComments','trailingComments','innerComments','tokens'].includes(k))continue
      if(Array.isArray(v))v.forEach((x,i)=>walk(x,[...trail,k,i],[...ancestors,record]))
      else if(v?.type)walk(v,[...trail,k],[...ancestors,record])
    }
  }
  walk(ast); return {ast,nodes,elements,variables}
}
const get = (node, trail) => trail.reduce((n,k)=>n?.[k],node)
function transform(file, original, input) {
  const before=parse(original), current=parse(input), edits=[], props=new Map()
  assert.equal(current.elements.length,before.elements.length,`${file}: pre-existing JSX structure drift`)
  const component= current.variables.find(({n})=>/^[A-Z]/.test(n.id?.name || '') && n.init?.type === 'ArrowFunctionExpression')
  assert.ok(component,`${file}: component hook insertion point`)
  const locate = field => {
    let record=before.nodes.find(({n})=>n.start===field.source.start&&n.end===field.source.end)
    let partial=false
    if(!record) {record=before.nodes.find(({n})=>n.type==='TemplateElement'&&n.start<=field.source.start&&n.end>=field.source.end);partial=true}
    assert.ok(record,`${field.key}: original AST node`)
    const owner=record.ancestors.findLast(r=>r.n.type==='JSXElement')
    let candidate
    if(owner) {
      const index=before.elements.indexOf(owner)
      candidate=get(current.elements[index].n,record.trail.slice(owner.trail.length))
    } else {
      const variable=record.ancestors.findLast(r=>r.n.type==='VariableDeclarator')
      assert.ok(variable,`${field.key}: original variable`)
      const candidates=current.variables.filter(r=>r.n.id?.name===variable.n.id?.name)
      assert.equal(candidates.length,1,`${field.key}: unique current variable`)
      candidate=get(candidates[0].n,record.trail.slice(variable.trail.length))
    }
    assert.ok(candidate,`${field.key}: current AST node`)
    const start=candidate.start+(partial?field.source.start-record.n.start:0)
    const end=partial?start+field.rawSource.length:candidate.end
    assert.equal(input.slice(start,end),field.rawSource,`${field.key}: exact original literal`)
    return {record,candidate,start,end,owner}
  }
  for(const field of approved.filter(f=>f.source.file===file&&!manual.has(f.key))) {
    const {record,candidate,start,end,owner}=locate(field)
    const parent=record.ancestors.at(-1)?.n
    const call=`websiteContent.${field.reason==='visible print-window HTML text'?'html':'value'}(${json(field.key)}, ${record.n.type==='JSXText'||record.n.type==='TemplateElement'||field.reason==='visible print-window HTML text'?json(field.defaultValue):input.slice(start,end)})`
    let replacement=call
    if(record.n.type==='JSXText'||parent?.type==='JSXAttribute')replacement=`{${call}}`
    else if(record.n.type==='TemplateElement'||field.reason==='visible print-window HTML text')replacement='${'+call+'}'
    edits.push({start,end,text:replacement,key:field.key})
    if(owner && (record.n.type==='JSXText'||parent?.type==='JSXAttribute'||field.reason==='rendered expression literal')) {
      const element=current.elements[before.elements.indexOf(owner)].n
      const keys=props.get(element)||[];keys.push(field.key);props.set(element,keys)
    }
  }
  for(const [element,keys] of props) edits.push({start:element.openingElement.name.end,end:element.openingElement.name.end,text:` {...websiteContent.props(${json(keys)})}`})
  // Data-array/member/identifier text retains its element and uses the key index
  // built by value() in this component render; equal fields stay separate keys.
  const pure=n=>n&&(['Identifier','StringLiteral','NumericLiteral','BooleanLiteral','NullLiteral'].includes(n.type)
    || ['MemberExpression','OptionalMemberExpression'].includes(n.type)&&pure(n.object)&&(!n.computed||pure(n.property))
    || ['BinaryExpression','LogicalExpression'].includes(n.type)&&pure(n.left)&&pure(n.right)
    || n.type==='ConditionalExpression'&&pure(n.test)&&pure(n.consequent)&&pure(n.alternate)
    || n.type==='UnaryExpression'&&pure(n.argument)
    || n.type==='TemplateLiteral'&&n.expressions.every(pure))
  for(const {n} of current.elements) {
    if(n.openingElement.name.type==='JSXIdentifier'&&['style','script'].includes(n.openingElement.name.name))continue
    const expressions=n.children.filter(child=>child.type==='JSXExpressionContainer'&&pure(child.expression))
    if(!props.has(n) && expressions.length) {
      const values=expressions.map(child=>input.slice(child.expression.start,child.expression.end))
      edits.push({start:n.openingElement.name.end,end:n.openingElement.name.end,text:` {...websiteContent.propsFor(${values.join(', ')})}`})
    }
  }
  const importPath=path.posix.relative(path.posix.dirname(file),'src/components/website-editor/useWebsiteContent.js')
  const lastImport=current.ast.program.body.filter(n=>n.type==='ImportDeclaration').at(-1)
  edits.push({start:lastImport.end,end:lastImport.end,text:`\nimport { useWebsiteContent } from '${importPath.startsWith('.')?importPath:`./${importPath}`}'`})
  edits.push({start:component.n.init.body.start+1,end:component.n.init.body.start+1,text:`\n  const websiteContent = useWebsiteContent()\n`})
  edits.sort((a,b)=>b.start-a.start||b.end-a.end)
  let edge=input.length+1, output=input
  for(const edit of edits) {
    assert.ok(edit.end<=edge,`${file}: overlapping binding ${edit.key||''}`)
    output=output.slice(0,edit.start)+edit.text+output.slice(edit.end); edge=edit.start
  }
  const imageEdits=[]
  for(const {n} of parse(output).elements) {
    if(n.openingElement.name.type!=='JSXIdentifier'||n.openingElement.name.name!=='img'||n.openingElement.attributes.some(a=>a.name?.name==='srcSet'))continue
    const attribute=n.openingElement.attributes.find(a=>a.name?.name==='src')
    if(attribute?.value?.type!=='JSXExpressionContainer')continue
    const expression=attribute.value.expression
    if(!['CallExpression','MemberExpression'].includes(expression.type))continue
    if(expression.type==='CallExpression'&&expression.callee?.object?.name!=='websiteContent')continue
    imageEdits.push({start:n.openingElement.name.end,text:` {...websiteContent.imageProps(${output.slice(expression.start,expression.end)})}`})
  }
  for(const edit of imageEdits.sort((a,b)=>b.start-a.start))output=output.slice(0,edit.start)+edit.text+output.slice(edit.start)
  const literals=parse(output).nodes.filter(({n})=>['StringLiteral','TemplateElement'].includes(n.type)||n.type==='JSXText'&&n.value.trim())
  // A few original JS data lines had trailing spaces. Newly bound code lines
  // must pass diff --check while every literal/default keeps its exact bytes.
  output=output.replace(/[ \t]+(?=\r?$)/gm,(spaces,offset)=>{
    const line=output.slice(output.lastIndexOf('\n',offset)+1,offset)
    return line.includes('websiteContent')&&!literals.some(({n})=>n.start<=offset&&n.end>=offset+spaces.length)?'':spaces
  })
  parse(output)
  return applyPublicCopyAmendments(file,output)
}
const mode=process.argv[2]
if(mode==='--capture') {
  await fs.mkdir(sourceRoot,{recursive:false})
  const snapshots=[]
  for(const file of files) {
    const bytes=await fs.readFile(file)
    const target=`${sourceRoot}/${file}.txt`;await fs.mkdir(path.posix.dirname(target),{recursive:true});await fs.writeFile(target,bytes)
    snapshots.push({path:file,sha256:digest(bytes),snapshot:target})
  }
  await fs.writeFile('docs/website-editor/task04-source-inputs.json',JSON.stringify({captured:'2026-11-01',files:snapshots},null,2)+'\n')
  console.log(`Captured ${snapshots.length} exact Task 03 source inputs; no application files changed.`)
} else if(['--write','--check'].includes(mode)) {
  const generated=[]
  for(const file of files.filter(f=>f!=='app/layout.jsx')) {
    const original=await fs.readFile(`docs/website-editor/baseline/source/${file}.txt`,'utf8')
    const input=await fs.readFile(`${sourceRoot}/${file}.txt`,'utf8')
    const output=transform(file,original,input)
    if(mode==='--write')await fs.writeFile(file,output)
    else assert.equal(await fs.readFile(file,'utf8'),output,`${file}: unreviewed binding/layout change`)
    generated.push({path:file,sha256:digest(output)})
  }
  const bindings=approved.map(f=>({key:f.key,scope:f.scope,path:f.pagePath,routes:f.usedOnRoutes,sourceFile:f.source.file,kind:f.contentType==='text'?(typeof f.defaultValue==='string'&&(/\n/.test(f.defaultValue)||f.defaultValue.length>220)?'multiline':'text'):f.contentType,label:typeof f.defaultValue==='string'&&f.contentType==='text'?f.defaultValue.replace(/\s+/g,' ').trim().slice(0,80):f.fieldName}))
  const config=`// Generated from the immutable Task 01 registry by scripts/task04-bindings.mjs.\nexport const CONTENT_BINDINGS = Object.freeze(${JSON.stringify(bindings,null,2)})\n`
  if(mode==='--write') {await fs.mkdir('src/content',{recursive:true});await fs.writeFile('src/content/website-bindings.js',config);await fs.writeFile('docs/website-editor/task04-binding-files.json',JSON.stringify(generated,null,2)+'\n')}
  else assert.equal(await fs.readFile('src/content/website-bindings.js','utf8'),config)
  console.log(JSON.stringify({mode,files:generated.length,approvedFields:approved.length,registeredEditable:approved.filter(f=>f.status==='editable').length,images:approved.filter(f=>f.contentType==='image').length,destinations:approved.filter(f=>f.contentType==='url').length,routes:routes.length}))
} else if(!mode) console.log(JSON.stringify({approvedFields:approved.length,files:files.length}))
else throw new Error('Use --capture, --write or --check')
