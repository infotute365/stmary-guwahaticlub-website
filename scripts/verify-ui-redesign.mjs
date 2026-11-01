import fs from 'node:fs';
import {createHash} from 'node:crypto';
import babel from 'next/dist/compiled/babel/core.js';
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=(n,fn)=>{if(!n||typeof n!=='object')return;fn(n);for(const [k,v] of Object.entries(n)){if(['loc','extra','comments','tokens'].includes(k))continue;if(Array.isArray(v))v.forEach(x=>walk(x,fn));else if(v&&typeof v==='object')walk(v,fn)}};
export function contract(source){
 const result=[];
 const tree=babel.parseSync(source,{configFile:false,babelrc:false,sourceType:'module',parserOpts:{plugins:['jsx']}});
 walk(tree,n=>{
  if(n.type==='JSXText'&&n.value.trim())result.push(['text',n.value.replace(/\s+/g,' ').trim()]);
  if(n.type==='CallExpression'&&(n.callee?.property?.name==='value'||['useWebsiteField','useWebsiteImage','useManagedRecord'].includes(n.callee?.name))){result.push(['binding',n.arguments.map(x=>x.type==='StringLiteral'?x.value:x.type).join('|')]);}
  if(n.type==='JSXAttribute'&&['src','href','alt'].includes(n.name?.name)&&n.value?.type==='StringLiteral')result.push([n.name.name,n.value.value]);
  if(n.type==='ObjectProperty'&&['title','description','url','image','path'].includes(n.key?.name)&&n.value?.type==='StringLiteral')result.push([n.key.name,n.value.value]);
 });return result.sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
}
const file='docs/ui-redesign/content-baseline.json';
const files=[];
for(const dir of ['app','src','public'])for(const f of fs.readdirSync(dir,{recursive:true})){const path=dir+'/'+f.replaceAll('\\','/');if(!fs.statSync(path).isFile())continue;const bytes=fs.readFileSync(path);files.push({path,sha256:hash(bytes),...(/\.jsx$/.test(path)?{content:contract(bytes.toString())}:{})});}
if(process.argv.includes('--capture')){if(fs.existsSync(file))throw Error('Baseline already exists');fs.writeFileSync(file,JSON.stringify({files},null,2));console.log('Captured content contracts and source/asset hashes');}
else {const baseline=JSON.parse(fs.readFileSync(file));let immutable=0,content=0;for(const original of baseline.files){const current=files.find(x=>x.path===original.path);if(!current)throw Error('Missing '+original.path);if(original.content){if(JSON.stringify(original.content)!==JSON.stringify(current.content))throw Error('Content/binding changed: '+original.path);content++;}else if(!original.path.endsWith('.css')){if(original.sha256!==current.sha256)throw Error('Immutable source/asset changed: '+original.path);immutable++;}}const result={status:'PASS',publicContentAndBindingFiles:content,immutableAssetsAndLogicFiles:immutable};fs.writeFileSync('docs/ui-redesign/content-results.json',JSON.stringify(result,null,2));console.log(result);}
