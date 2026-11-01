import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const babel = require('next/dist/compiled/babel/core')
const registry = JSON.parse(await fs.readFile('docs/website-editor/baseline/content-registry.json', 'utf8'))
const cache = new Map()
const kinds = new Map(), moduleFields = [], missing = [], special = []
for (const field of registry.fields.filter(f => f.audience === 'public' && f.status === 'editable')) {
  const file = field.source.file
  if (!cache.has(file)) {
    const source = await fs.readFile(`docs/website-editor/baseline/source/${file}.txt`, 'utf8')
    const ast = babel.parseSync(source, {configFile:false,babelrc:false,parserOpts:{plugins:['jsx']}})
    const nodes=[]
    function walk(n, ancestors=[]) { if(!n?.type)return; nodes.push({n,ancestors}); for(const [k,v] of Object.entries(n)){if(['loc','extra','comments','tokens'].includes(k))continue;if(Array.isArray(v))v.forEach(x=>walk(x,[...ancestors,n]));else if(v?.type)walk(v,[...ancestors,n])} }
    walk(ast); cache.set(file,{source,nodes})
  }
  const {nodes}=cache.get(file)
  const found=nodes.find(({n})=>n.start===field.source.start&&n.end===field.source.end)
  if(!found){missing.push({key:field.key,file,raw:field.rawSource});continue}
  kinds.set(found.n.type,(kinds.get(found.n.type)||0)+1)
  const variable=found.ancestors.findLast(n=>n.type==='VariableDeclarator')
  const fn=found.ancestors.find(n=>['ArrowFunctionExpression','FunctionExpression','FunctionDeclaration'].includes(n.type))
  if(!fn)moduleFields.push({key:field.key,file,variable:variable?.id?.name,type:found.n.type})
  if(!['JSXText','StringLiteral','NumericLiteral','TemplateLiteral'].includes(found.n.type))special.push({key:field.key,type:found.n.type})
}
console.log(JSON.stringify({kinds:Object.fromEntries(kinds),moduleFields,missing,special},null,2))
