// Offline audit only. Never imported by the application. Capture is deliberately
// create-only: reviewing a later change must not silently replace the baseline.
import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
const require = createRequire(import.meta.url)
const babel = require('next/dist/compiled/babel/core')
const output = 'docs/website-editor/baseline'
const hash = data => createHash('sha256').update(data).digest('hex')
const read = file => fs.readFile(file, 'utf8')
const json = file => read(file).then(s => JSON.parse(s.replace(/^\uFEFF/, '')))
const slash = s => s.replaceAll('\\', '/')
async function walk(dir) {
  return (await Promise.all((await fs.readdir(dir, { withFileTypes: true })).sort((a,b) => a.name.localeCompare(b.name)).map(e => e.isDirectory() ? walk(`${dir}/${e.name}`) : `${dir}/${e.name}`))).flat()
}
function parse(source) { return babel.parseSync(source, { configFile: false, babelrc: false, sourceType: 'module', parserOpts: { plugins: ['jsx'] } }) }
function visit(node, fn, ancestors = [], address = 'program') {
  if (!node || typeof node !== 'object' || !node.type) return
  fn(node, ancestors, address)
  for (const [key, child] of Object.entries(node)) {
    if (['loc','start','end','extra','leadingComments','trailingComments','innerComments','comments','tokens'].includes(key)) continue
    if (Array.isArray(child)) child.forEach((n,i) => visit(n,fn,[...ancestors,node],`${address}.${key}[${i}]`))
    else if (child?.type) visit(child,fn,[...ancestors,node],`${address}.${key}`)
  }
}
const name = n => !n ? '' : n.name || (n.type === 'JSXMemberExpression' ? `${name(n.object)}.${name(n.property)}` : n.value || '')
const slug = s => s.replace(/([a-z])([A-Z])/g,'$1-$2').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase()
// React's JSX whitespace folding. rawSource separately retains exact bytes.
function jsxText(value) {
  const lines = value.split(/\r\n|\n|\r/)
  let last = 0
  lines.forEach((line,i) => { if (/[^ \t]/.test(line)) last = i })
  return lines.map((line,i) => {
    let v = line.replace(/\t/g,' ')
    if (i !== 0) v = v.replace(/^ +/,'')
    if (i !== lines.length-1) v = v.replace(/ +$/,'')
    return v && i !== last ? v + ' ' : v
  }).join('')
}
const contentProps = new Set(['title','subtitle','description','content','text','label','name','heading','subheading','quote','author','role','designation','qualification','experience','bio','email','phone','address','question','answer','year','period','date','time','value','number','suffix','prefix','count','stat','highlight','tagline','badge','location','timing','detail','details','caption','message','alt','placeholder','aria-label','ariaLabel','buttonText','buttonLabel','cta','subject','duration','category','stream','type','amount','fee','linkText','button','image','src','href','to','path','link','url','fileUrl','backgroundImage','imageUrl'])
const technicalProps = new Set(['className','class','id','key','style','icon','color','bgColor','textColor','borderColor','gradient','iconBg','iconColor','initial','animate','exit','transition','variants','viewport','whileHover','whileTap','whileInView','size','width','height','loading','target','rel','type','name','value','method','action','htmlFor','accept','autoComplete','role','tabIndex','lang','direction','ease','fontFamily','background','objectPosition','position','delay','displayOrder'])
const urlProps = new Set(['href','to','path','link','url','fileUrl'])
const imageProps = new Set(['image','src','imageUrl','backgroundImage'])
for (const p of ['stats','tag','bank','profession','rules','shortName','years','feastDay']) contentProps.add(p)
contentProps.delete('duration')
function classify(n, a, source) {
  const parent = a.at(-1)
  const attr = [...a].reverse().find(x => x.type === 'JSXAttribute')
  const prop = [...a].reverse().find(x => x.type === 'ObjectProperty')
  const propName = prop && name(prop.key)
  const variable = [...a].reverse().find(x => x.type === 'VariableDeclarator')
  const variableName = variable && name(variable.id)
  const raw = source.slice(n.start,n.end)
  const value = n.type === 'JSXText' ? jsxText(n.value) : n.type === 'TemplateElement' ? n.value.cooked ?? n.value.raw : n.value
  if (n.type === 'JSXText') return value.trim() ? { value, kind: 'text', reason: 'JSX text segment' } : { value, reason: 'JSX formatting whitespace' }
  if (value === '') return {value,reason:'empty literal or template boundary'}
  if (a.some(x => x.type === 'ImportDeclaration' || x.type.startsWith('Export') && x.source === n)) return {value,reason:'module reference'}
  if (parent?.type === 'ObjectProperty' && parent.key === n && !parent.computed) return {value,reason:'object key'}
  if (a.some(x => x.type === 'JSXElement' && ['style','script'].includes(name(x.openingElement.name)))) return {value,reason:'CSS or script'}
  if (a.some(x => x.type === 'ObjectPattern')) return {value,reason:'component parameter default'}
  if (['/api','http','mailto:','tel:'].includes(value)) return {value,reason:'URL construction or API configuration'}
  if (['heights','classOptions','categories'].includes(variableName)) return {value,reason:'layout or filter enumeration'}
  const functionCall=[...a].reverse().find(x=>x.type==='CallExpression')
  if(functionCall && /^(Array|Array\.from)$/.test(source.slice(functionCall.callee.start,functionCall.callee.end))) return {value,reason:'skeleton iteration count'}
  if(functionCall && /console\.|\.includes$|\.split$|\.replace$|\.startsWith$|\.endsWith$|\.toLocale|\.padStart$|\.toString$|\.slice$|\.join$|addEventListener|removeEventListener|querySelector/.test(source.slice(functionCall.callee.start,functionCall.callee.end))) return {value,reason:'technical function argument'}
  if (/Variants|variants|fadeIn|stagger|formData/i.test(variableName || '') || a.some(x=>x.type==='CallExpression' && /^(useState|setFormData)$/.test(source.slice(x.callee.start,x.callee.end)))) return {value,reason:'state or animation configuration'}
  if (a.some(x => x.type==='ConditionalExpression' && n.start>=x.test.start && n.end<=x.test.end || x.type==='BinaryExpression')) return {value,reason:'application condition or arithmetic'}
  if (propName === 'backgroundImage' && typeof value==='string' && value.includes('url(')) return {value,kind:'image',reason:'existing background image; protected'}
  if (attr && (technicalProps.has(name(attr.name)) || name(attr.name).startsWith('on'))) return {value,reason:`technical ${name(attr.name)} attribute`}
  if (attr && !prop) {
    const p = name(attr.name)
    if (['alt','title','placeholder','aria-label','subtitle'].includes(p)) return {value,kind:'text',reason:`public ${p} attribute`}
    if (urlProps.has(p)) return {value,kind:'url',reason:'existing destination; protected by preservation requirement'}
    if (imageProps.has(p)) return {value,kind:'image',reason:'existing image; protected by preservation requirement'}
    if (technicalProps.has(p) || p.startsWith('on') || p.startsWith('data-') || p.startsWith('aria-')) return {value,reason:`technical ${p} attribute`}
    if (contentProps.has(p) || p === 'end') return {value,kind:typeof value === 'number'?'number':'text',reason:`content prop ${p}`}
    return {value,reason:`component behavior prop ${p}`}
  }
  if (a.some(x => x.type==='IfStatement' && n.start>=x.test.start && n.end<=x.test.end || ['SwitchCase','SwitchStatement','BinaryExpression','NewExpression','ImportDeclaration'].includes(x.type))) {
    // Literals in JSX conditional result arms are handled below, not tests.
    const cond = [...a].reverse().find(x => x.type === 'ConditionalExpression')
    if (!cond || (n.start >= cond.test.start && n.end <= cond.test.end)) return {value,reason:'application condition, constructor or comparison'}
  }
  if (prop && contentProps.has(propName) && !technicalProps.has(propName) || prop && ['name','value','role','category','stream','type'].includes(propName)) {
    if (/Variants|variants|style|Style|formData/i.test(variableName || '')) return {value,reason:'animation, style or form state'}
    const isUrl = urlProps.has(propName)
    return {value,kind:isUrl?'url':imageProps.has(propName)?'image':typeof value === 'number'?'number':'text',reason:`source data ${variableName || 'inline'}.${propName}`}
  }
  const call = [...a].reverse().find(x => x.type === 'CallExpression')
  if (call && /^(useState|useRef|useEffect|useMemo|useCallback|set\w+|get\w+|fetch\w+|console\.|router\.)/.test(source.slice(call.callee.start,call.callee.end))) return {value,reason:'state, API or application behavior'}
  if (call && /console\.|\.includes$|\.split$|\.replace$|\.startsWith$|\.endsWith$|\.toLocale|addEventListener|removeEventListener|getElementById|querySelector/.test(source.slice(call.callee.start,call.callee.end))) return {value,reason:'technical function argument'}
  if (call && /\.padStart$|\.toString$|\.slice$|\.join$|\.filter$/.test(source.slice(call.callee.start,call.callee.end))) return {value,reason:'formatting or collection operation'}
  if (call && /toast\.(error|success)|alert/.test(source.slice(call.callee.start,call.callee.end))) return {value,kind:'text',reason:'visible notification'}
  if (prop) return {value,reason:`technical data property ${propName}`}
  if (parent?.type === 'ArrayExpression' && typeof value==='number') return {value,reason:'iteration count or skeleton index'}
  if (parent?.type === 'ArrayExpression' && !a.some(x => x.type === 'CallExpression' && /includes/.test(source.slice(x.callee.start,x.callee.end)))) return {value,kind:typeof value === 'number'?'number':'text',reason:`list item in ${variableName || 'inline array'}`}
  if (a.some(x => x.type === 'JSXExpressionContainer')) return {value,kind:typeof value === 'number'?'number':'text',reason:'rendered expression literal'}
  if (parent?.type === 'LogicalExpression' && call && /toast\./.test(source.slice(call.callee.start,call.callee.end))) return {value,kind:'text',reason:'notification fallback'}
  return {value,reason:'non-rendered application literal'}
}
export async function inspect() {
  const pages = (await walk('app/(site)')).filter(f => f.endsWith('/page.jsx'))
  const routes = []
  for (const file of pages) {
    const source = await read(file)
    const match = source.match(/import\s+(\w+)\s+from\s+['"]([^'"]+)/)
    routes.push({path:'/' + file.slice('app/(site)/'.length,-'page.jsx'.length).replace(/\/$/,''),routeFile:file,component:match[1],sourceFile:slash(path.normalize(path.join(path.dirname(file),match[2])))})
  }
  routes.sort((a,b) => a.path.localeCompare(b.path))
  const files = [...new Set([...await walk('src/site-pages'), ...await walk('src/components'), 'app/layout.jsx','app/(site)/layout.jsx','app/not-found.jsx'])].filter(f=> /\.(jsx|js)$/.test(f)).sort()
  const records = [], literals = [], structures = [], expressions = [], imports = []
  const variableUses=new Map()
  for (const file of files) {
    const source = await read(file), ast = parse(source)
    const page = routes.find(r => r.sourceFile === file) || (file.startsWith('src/components/home/') ? routes.find(r=>r.path==='/') : null)
    const global = !page
    const auxiliary = /\/admin\/|\/Login.jsx$|\/NotFound.jsx$|AdminLayout|ProtectedRoute|Providers/.test(file) || file === 'app/not-found.jsx'
    const prefix = page ? (page.path === '/'?file.startsWith('src/components/home/')?`home.${slug(path.basename(file,'.jsx'))}`:'home':slug(page.path).replaceAll('-','.')) : `global.${slug(path.basename(file,'.jsx'))}`
    const counters = new Map()
    visit(ast,(n,a,address) => {
      if(n.type==='Identifier') {
        const p=a.at(-1)
        if(!(p?.type==='VariableDeclarator'&&p.id===n)&&!(p?.type==='ObjectProperty'&&p.key===n)&&!(p?.type==='MemberExpression'&&p.property===n&&!p.computed)) {
          const k=`${file}:${n.name}`;variableUses.set(k,(variableUses.get(k)||0)+1)
        }
      }
      if (n.type === 'ImportDeclaration') {
        imports.push({file,reference:n.source.value,names:n.specifiers.map(s=>name(s.local))})
        return
      }
      if (n.type === 'JSXOpeningElement') {
        structures.push({file,line:n.loc.start.line,address,element:name(n.name),selfClosing:n.selfClosing,attributes:n.attributes.map(x=>source.slice(x.start,x.end))})
      }
      if (n.type === 'JSXExpressionContainer' && n.expression.type !== 'JSXEmptyExpression') {
        const attr=a.at(-1)?.type==='JSXAttribute'?name(a.at(-1).name):null
        expressions.push({file,line:n.loc.start.line,address,attribute:attr,expression:source.slice(n.expression.start,n.expression.end)})
      }
      // The notice print window is visible HTML outside the React tree. Extract
      // only text tokens; never offer its inline CSS or executable script.
      if (n.type === 'TemplateLiteral' && n.quasis.some(q=>/<(?:div|html)\b/.test(q.value.raw))) {
        let blocked=false, segment=0
        for (const q of n.quasis) {
          const raw=source.slice(q.start,q.end)
          for(const match of raw.matchAll(/<[^>]*>|[^<]+/g)) {
            const token=match[0]
            if(token.startsWith('<')) {
              if(/^<(?:style|script)\b/i.test(token)) blocked=true
              if(/^<\/(?:style|script)>/i.test(token)) blocked=false
              continue
            }
            if(blocked||!token.trim()) continue
            const start=q.start+match.index, end=start+token.length
            const locator={file,line:source.slice(0,start).split('\n').length,column:start-source.lastIndexOf('\n',start)-1,start,end,address:`${address}.printText[${segment++}]`}
            records.push({key:`${prefix}.notice-print.text${segment}`,scope:global?'global':'page',pagePath:page?.path??null,section:'notice-print',fieldName:`Printable notice / text ${segment}`,contentType:'text',defaultValue:token,rawSource:token,source:locator,status:'editable',existingDataSource:'static-source',audience:'public',reason:'visible print-window HTML text'})
          }
        }
      }
      if (!['JSXText','StringLiteral','NumericLiteral','TemplateElement'].includes(n.type)) return
      const c = classify(n,a,source)
      const locator = {file,line:n.loc.start.line,column:n.loc.start.column,start:n.start,end:n.end,address}
      const rawSource = source.slice(n.start,n.end)
      const entry = { ...locator,nodeType:n.type,rawSource,value:c.value,classification:c.kind?'content':'technical',reason:c.reason,auxiliary }
      literals.push(entry)
      if (!c.kind) return
      const attr = [...a].reverse().find(x=>x.type==='JSXAttribute')
      const prop = [...a].reverse().find(x=>x.type==='ObjectProperty')
      const variable = [...a].reverse().find(x=>x.type==='VariableDeclarator')
      const element = [...a].reverse().find(x=>x.type==='JSXElement')
      const tag = element ? name(element.openingElement.name) : ''
      const sectionNode = a.find(x=>x.type==='JSXElement' && name(x.openingElement.name)==='section')
      const section = sectionNode ? `section-${source.slice(0,sectionNode.start).match(/<section\b/g)?.length + 1 || 1}` : variable ? slug(name(variable.id)) : slug(path.basename(file,'.jsx'))
      let context = variable ? slug(name(variable.id)) : section
      // Data-array positions become frozen semantic item identities.
      for (let i=0;i<a.length;i++) if (a[i].type==='ArrayExpression') {
        const child=a[i+1]||n, index=a[i].elements.indexOf(child)
        if (index>=0) context+=`.item${index+1}`
      }
      const field = slug(attr ? name(attr.name) : prop ? name(prop.key) : /^h[1-6]$|^motion.h[1-6]$/.test(tag)?'heading':tag==='p'||tag==='motion.p'?'paragraph':tag==='button'?'button-label':tag==='li'?'list-item':tag==='th'?'table-heading':tag==='td'?'table-value':'text')
      const base = `${prefix}.${context}.${field}`
      const count=(counters.get(base)||0)+1; counters.set(base,count)
      const key = count===1?base:`${base}.${count}`
      const protectedField = auxiliary || ['url','image'].includes(c.kind) || typeof c.value==='string'&&!/[\p{L}\p{N}]/u.test(c.value) || /^(category|stream|type)$/.test(prop && name(prop.key)) || prop && name(prop.key)==='value' && !/^\d/.test(String(c.value)) || typeof c.value !== 'string' && !['end','number','value','count','year'].includes(attr?name(attr.name):prop?name(prop.key):'')
      records.push({key,scope:global?'global':'page',pagePath:page?.path??null,section,fieldName:`${path.basename(file,'.jsx')} / ${context} / ${field}${count>1?` ${count}`:''}`,contentType:c.kind,defaultValue:c.value,rawSource,source:locator,status:protectedField?'protected':'editable',existingDataSource:'static-source',audience:auxiliary?'admin-or-system':'public',reason:c.reason,dataVariable:variable?name(variable.id):null,dataDeclarationType:variable?.init?.type??null,dataProperty:prop?name(prop.key):null})
    })
  }
  // Reachability follows rendered component references, not unused imports.
  const usage=new Map(files.map(f=>[f,[]]))
  function dependents(file,route,seen=new Set()) {
    if(seen.has(file)) return
    seen.add(file); usage.get(file)?.push(route)
    const rendered=new Set(structures.filter(s=>s.file===file).map(s=>s.element.split('.')[0]))
    for(const i of imports.filter(i=>i.file===file && i.reference.startsWith('.') && i.names.some(n=>rendered.has(n)))) {
      const resolved=slash(path.normalize(path.join(path.dirname(file),i.reference)))
      if(usage.has(resolved)) dependents(resolved,route,seen)
    }
  }
  for(const route of routes) { const seen=new Set(); for(const f of [route.sourceFile,'app/(site)/layout.jsx','app/layout.jsx']) dependents(f,route.path,seen) }
  for(const r of records) {
    r.usedOnRoutes=[...new Set(usage.get(r.source.file)||[])]
    if(r.audience==='public'&&!r.usedOnRoutes.length) {r.audience='dormant-source';r.status='protected'}
    if(r.audience==='public'&&r.reason.startsWith('source data')&&['ArrayExpression','ObjectExpression'].includes(r.dataDeclarationType)&&r.source.file!=='app/layout.jsx') {
      const unusedVariable=r.dataVariable&&!variableUses.has(`${r.source.file}:${r.dataVariable}`)
      const unusedProperty=r.dataProperty&&!expressions.some(e=>new RegExp(`\\.${r.dataProperty}\\b`).test(e.expression))
      if(unusedVariable||unusedProperty) {r.audience='dormant-source';r.status='protected';r.usedOnRoutes=[];r.reason+=`; ${unusedVariable?'unreferenced data variable':'no render-expression property consumer'}`}
    }
  }
  return {routes,records,literals,structures,expressions,imports}
}
async function capture() {
  try { await fs.access(`${output}/source-hashes.json`); throw new Error('Baseline already exists; capture cannot overwrite it') } catch(e) { if(e.code!=='ENOENT') throw e }
  const tracked=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean)
  const files=[]
  for(const file of tracked) { const data=await fs.readFile(file); files.push({path:file,sha256:hash(data),bytes:data.length}) }
  await fs.mkdir(output,{recursive:true})
  const audit=await inspect()
  for(const [file,data] of Object.entries({'source-hashes':{captured:'2026-10-31',gitHead:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),files},'routes':audit.routes,'content-registry':{version:1,keyPolicy:'Frozen identities. Do not regenerate keys after edits; migrate source locators explicitly.',fields:audit.records},'source-literals':audit.literals,'source-structure':audit.structures,'render-expressions':audit.expressions,'imports':audit.imports})) await fs.writeFile(`${output}/${file}.json`,JSON.stringify(data,null,2)+'\n')
  console.log(JSON.stringify({routes:audit.routes.length,fields:audit.records.length,editable:audit.records.filter(x=>x.status==='editable'&&x.audience==='public').length,sourceFiles:files.length},null,2))
}
async function verify() {
  // Retain the existing independent hard gate, including its Footer exception.
  let legacyPassed=true
  try { execFileSync(process.execPath,['scripts/verify-preservation.mjs'],{stdio:'inherit'}) } catch { legacyPassed=false }
  const baseline=await json(`${output}/source-hashes.json`)
  const failures=[]
  for(const file of baseline.files) {
    const current=await fs.readFile(file.path).catch(()=>null)
    if(!current||hash(current)!==file.sha256) failures.push(file.path)
  }
  const known=new Set(baseline.files.map(f=>f.path))
  for(const directory of ['app','src','public','deploy','tests']) for(const file of await walk(directory)) {
    if(file.startsWith('public/uploads/')&&file!=='public/uploads/.gitkeep') continue
    if(!known.has(file)) failures.push(`Unexpected file in preserved tree: ${file}`)
  }
  const registry=await json(`${output}/content-registry.json`)
  const keys=new Set()
  for(const field of registry.fields) {
    if(keys.has(field.key)) failures.push(`duplicate key ${field.key}`)
    keys.add(field.key)
    const source=await read(field.source.file)
    if(source.slice(field.source.start,field.source.end)!==field.rawSource) failures.push(`content segment changed: ${field.key}`)
  }
  const current=await inspect()
  for(const [file,data] of [['routes',current.routes],['source-structure',current.structures],['render-expressions',current.expressions],['imports',current.imports],['source-literals',current.literals]]) if(JSON.stringify(await json(`${output}/${file}.json`))!==JSON.stringify(data)) failures.push(`${file} changed`)
  if(failures.length) throw new Error(`Preservation failures:\n${failures.join('\n')}`)
  const seal=await json('docs/website-editor/artifact-hashes.json')
  for(const f of seal.files) {
    const data=await fs.readFile(f.path).catch(()=>null)
    if(!data||hash(data)!==f.sha256) throw new Error(`Audit artifact changed: ${f.path}`)
  }
  console.log(JSON.stringify({status:legacyPassed?'PASS':'CURRENT_BASELINE_PASS_LEGACY_FAILURE',originalFilesUnchanged:baseline.files.length,publicRoutes:current.routes.length,uniqueRegistryKeys:keys.size,sourceStructure:'unchanged',expressionsAndReferences:'unchanged',legacyPreservation:legacyPassed?'PASS':'FAIL (pre-existing; not waived)'},null,2))
  if(!legacyPassed) process.exitCode=1
}
async function reviewBindings(planFile) {
  if(!planFile) throw new Error('A review plan JSON path is required')
  const plan=await json(planFile), baseline=await json(`${output}/source-hashes.json`)
  const fields=(await json(`${output}/content-registry.json`)).fields
  const literals=await json(`${output}/source-literals.json`)
  if(plan.version!==1||!Array.isArray(plan.files)) throw new Error('Invalid binding review plan')
  const changed=new Set(), keys=new Set()
  for(const item of plan.files) {
    if(changed.has(item.path)) throw new Error(`Duplicate file: ${item.path}`)
    changed.add(item.path)
    if(!/^(src\/(site-pages|components)\/|app\/layout\.jsx$)/.test(item.path)) throw new Error('Only registered public content files are eligible')
    const original=await read(`${output}/source/${item.path}.txt`)
    const originalHash=baseline.files.find(f=>f.path===item.path)?.sha256
    if(hash(original)!==originalHash||item.beforeSha256!==originalHash) throw new Error(`Original hash mismatch: ${item.path}`)
    if(!Array.isArray(item.bindings)||!item.bindings.length) throw new Error('Each file must list explicit content bindings')
    const edits=[]
    for(const binding of item.bindings) {
      if(keys.has(binding.key)) throw new Error(`Duplicate binding: ${binding.key}`)
      keys.add(binding.key)
      const field=fields.find(f=>f.key===binding.key)
      if(!field||field.status!=='editable'||field.audience!=='public'||field.source.file!==item.path||field.reason.includes('print-window')) throw new Error(`Ineligible binding: ${binding.key}`)
      const literal=literals.find(l=>l.file===item.path&&l.start===field.source.start)
      if(!literal||!['JSXText','StringLiteral','NumericLiteral'].includes(literal.nodeType)) throw new Error(`Binding needs separate review for this syntax: ${binding.key}`)
      const lookup=`getWebsiteContent(${JSON.stringify(field.key)}, ${JSON.stringify(field.defaultValue)})`
      const attribute=literal.address.includes('.attributes[')
      edits.push({start:field.source.start,end:field.source.end,replacement:literal.nodeType==='JSXText'||attribute?`{${lookup}}`:lookup})
    }
    edits.sort((a,b)=>b.start-a.start)
    let expected=original, previous=Infinity
    for(const edit of edits) {
      if(edit.end>previous) throw new Error('Overlapping content bindings')
      previous=edit.start
      expected=expected.slice(0,edit.start)+edit.replacement+expected.slice(edit.end)
    }
    // Proposed future import only. Task 01 implements no runtime content reader.
    if(item.lookupImport) {
      const resolved=slash(path.normalize(path.join(path.dirname(item.path),item.lookupImport)))
      if(resolved!=='src/content/website-content.js') throw new Error('Only the proposed content reader import is eligible')
      const directive=expected.match(/^(['"])use client\1\s*;?\r?\n/)
      const offset=directive?directive[0].length:0
      expected=expected.slice(0,offset)+`import { getWebsiteContent } from ${JSON.stringify(item.lookupImport)}\n`+expected.slice(offset)
    }
    const actual=await read(item.path)
    if(actual!==expected||hash(actual)!==item.afterSha256) throw new Error(`Change exceeds exact fallback-preserving bindings: ${item.path}`)
    parse(actual)
  }
  for(const file of baseline.files) if(!changed.has(file.path)&&hash(await fs.readFile(file.path))!==file.sha256) throw new Error(`Unlisted original change: ${file.path}`)
  console.log(JSON.stringify({status:'REVIEW_CANDIDATE_ONLY',files:changed.size,bindings:keys.size,approved:false,notice:'Never waives the existing preservation gate. Human review, browser/DOM comparisons, and an explicit narrowly scoped future gate update are required.'},null,2))
}
if(process.argv[1] && path.resolve(process.argv[1])===path.resolve(fileURLToPath(import.meta.url))) {
  const command=process.argv[2]
  if(command==='capture') await capture()
  else if(command==='verify') await verify()
  else if(command==='review-bindings') await reviewBindings(process.argv[3])
  else throw new Error('Usage: node scripts/website-editor-audit.mjs capture|verify|review-bindings <plan.json>')
}
