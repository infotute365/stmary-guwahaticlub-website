import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import sharp from 'sharp'
import routes from '../docs/website-editor/baseline/routes.json' with {type:'json'}
import registry from '../docs/website-editor/baseline/content-registry.json' with {type:'json'}

const decode=source=>source.replace(/&#x([a-f\d]+);/gi,(_,code)=>String.fromCodePoint(parseInt(code,16))).replace(/&#(\d+);/g,(_,code)=>String.fromCodePoint(Number(code))).replace(/&(amp|lt|gt|quot|apos);/g,(_,entity)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"}[entity]))
const withoutScripts=html=>html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'')
const text=html=>decode(withoutScripts(html).replace(/<[^>]*>/g,' ')).replace(/\s+/g,' ')
const textNodes=html=>withoutScripts(html).split(/<[^>]*>/g).map(node=>decode(node).replace(/\s+/g,' ').trim()).filter(Boolean)

// This is direct HTTP acceptance of the owned local Next instance. It neither
// controls a browser nor claims screenshots, hydration or mobile verification.
export async function verifyPublicPages({origin,mutationOrigin=origin,email,password,stage='04',request=fetch}) {
  const prefix=stage==='master'?'master':`task${stage}`
  assert.equal(new URL(origin).hostname,'localhost')
  assert.equal(email,'editor-fixture@example.test')
  assert.ok([origin,'https://fixture-school.example.test'].includes(mutationOrigin))
  let cookie=''
  const report={captured:'2026-11-01',scope:'Production Next HTTP responses; actual visible SSR text after removing scripts, styles and serialized RSC data',routes:[],shared:[],metadata:null,image:null,browserAutomation:false}
  const api=async(method,route,body,anonymous=false)=>{
    const headers={origin:mutationOrigin}
    if(cookie&&!anonymous)headers.cookie=cookie
    if(body&&!(body instanceof FormData)){headers['content-type']='application/json';body=JSON.stringify(body)}
    const response=await request(`${origin}/api/${route}`,{method,headers,body,cache:'no-store'})
    const data=await response.json()
    if(route==='auth/login'&&response.ok)cookie=response.headers.getSetCookie().map(value=>value.split(';')[0]).join('; ')
    return {status:response.status,data}
  }
  const page=async route=>{
    const response=await request(`${origin}${route}`,{cache:'no-store'})
    assert.equal(response.status,200,route)
    const html=await response.text()
    assert.doesNotMatch(withoutScripts(html),/data-website-(?:field|editor-ui)=/)
    return html
  }
  const save=async(key,value,expectedRevision=0)=>{
    const response=await api('PUT',`website-content/${key}`,{value,expectedRevision})
    assert.equal(response.status,200,JSON.stringify(response.data))
    return response.data.field
  }
  const reset=async(key,revision)=>{
    const response=await api('POST',`website-content/${key}/reset`,{expectedRevision:revision})
    assert.equal(response.status,200,JSON.stringify(response.data))
  }
  try {
    assert.equal((await api('GET','website-content/catalog?path=/',null,true)).status,401)
    const login=await api('POST','auth/login',{email,password},true)
    assert.equal(login.status,200,JSON.stringify(login.data))
    const session=await api('GET','auth/session')
    assert.equal(session.data.fullname,'Editor QA Fixture')
    assert.equal(session.data.email,email)
    for(const [index,route] of routes.entries()) {
      const original=await page(route.path)
      const originalNodes=new Set(textNodes(original))
      const candidates=registry.fields.filter(field=>field.status==='editable'&&field.pagePath===route.path&&field.source.file===route.sourceFile&&field.reason==='JSX text segment'&&field.defaultValue.trim().length>=3)
      candidates.sort((a,b)=>Number(b.key.includes('.heading'))-Number(a.key.includes('.heading'))||b.defaultValue.trim().length-a.defaultValue.trim().length)
      // Match an entire rendered node, not a substring also present in another
      // branch (e.g. Disclosure's loading paragraph vs its loaded heading).
      const field=candidates.find(field=>originalNodes.has(field.defaultValue.replace(/\s+/g,' ').trim()))
      assert.ok(field,`${route.path}: visible page-specific initial HTML content`)
      report.currentRoute={route:route.path,key:field.key,originalDefault:field.defaultValue}
      const value=`Task${stage} SSR verification ${index+1}`
      const saved=await save(field.key,value)
      const published=await api('GET',`website-content?path=${encodeURIComponent(route.path)}`,null,true)
      assert.equal(published.data.overrides[field.key].value,value)
      const edited=await page(route.path)
      if(!text(edited).includes(value))await fs.writeFile(`docs/website-editor/${prefix}-ssr-failure.html`,edited)
      assert.ok(text(edited).includes(value),`${route.path} ${field.key}: saved text must be in actual initial HTML, not only serialized props; serialized value present: ${edited.includes(value)}`)
      await reset(field.key,saved.revision)
      const restored=await page(route.path)
      assert.ok(!text(restored).includes(value),`${route.path}: reset removes edited text`)
      assert.ok(text(restored).includes(field.defaultValue.replace(/\s+/g,' ').trim()))
      report.routes.push({route:route.path,key:field.key,save:'PASS',freshPublicAPI:'PASS',initialVisitorHTML:'PASS',resetToOriginal:'PASS'})
      delete report.currentRoute
    }
    const footer=registry.fields.find(field=>field.source.file==='src/components/layout/Footer.jsx'&&field.status==='editable'&&field.reason==='JSX text segment'&&field.defaultValue.trim().length>10)
    const sharedValue=`Task${stage} shared footer verification`
    const sharedSave=await save(footer.key,sharedValue)
    for(const route of routes){assert.ok(text(await page(route.path)).includes(sharedValue));report.shared.push({route:route.path,key:footer.key,initialVisitorHTML:'PASS'})}
    await reset(footer.key,sharedSave.revision)
    const metaKey='global.layout.metadata.title'
    const metadataValue=`Task${stage} server metadata verification`
    const metadataSave=await save(metaKey,metadataValue)
    assert.ok((await page('/')).includes(`<title>${metadataValue}</title>`))
    await reset(metaKey,metadataSave.revision)
    report.metadata='PASS'
    const imageKey='global.navbar.navbar.src'
    const buffer=await sharp({create:{width:3000,height:1000,channels:3,background:'#7a0c1e'}}).png().toBuffer()
    const form=new FormData();form.append('image',new Blob([buffer],{type:'image/png'}),'fixture-wide.png')
    const upload=await api('POST',`website-content/images/${imageKey}`,form)
    assert.equal(upload.status,200,JSON.stringify(upload.data))
    assert.ok(upload.data.image.width>360)
    const savedImage=await save(imageKey,upload.data.image.value)
    const imageHtml=decode(withoutScripts(await page('/')))
    assert.ok(imageHtml.includes(`src="${upload.data.image.value}"`),'Uploaded image must appear in an actual source attribute, not just a preload')
    assert.ok(imageHtml.includes('srcSet=')||imageHtml.includes('srcset='))
    const media=await request(`${origin}${upload.data.image.variants[0].url}`)
    assert.equal(media.status,200);assert.match(media.headers.get('content-type'),/image\/webp/)
    await reset(imageKey,savedImage.revision)
    assert.ok(decode(withoutScripts(await page('/'))).includes('src="/logo.jpeg"'))
    report.image={slot:imageKey,upload:'PASS',optimizedVariants:upload.data.image.variants.length,initialVisitorHTML:'PASS',persistentMedia:'PASS',resetOriginalLogo:'PASS'}
    report.status='PASS'
    return report
  } catch(error){report.status='FAIL';report.error=error.message;throw error}
  finally {await fs.writeFile(`docs/website-editor/${prefix}-ssr-http-results.json`,JSON.stringify(report,null,2)+'\n')}
}
