// HTTP acceptance against a caller-owned disposable production fixture only.
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { performance } from 'node:perf_hooks'
import jwt from 'jsonwebtoken'
import sharp from 'sharp'
import { verifyPublicPages } from './website-pages-smoke.mjs'
import { getContentField } from '../src/server/util/websiteContentPolicy.js'

const digest=bytes=>createHash('sha256').update(bytes).digest('hex')
const visible=html=>html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'')
const decode=html=>html.replace(/&#x([a-f\d]+);/gi,(_,value)=>String.fromCodePoint(parseInt(value,16))).replace(/&#(\d+);/g,(_,value)=>String.fromCodePoint(Number(value))).replace(/&(amp|lt|gt|quot|apos);/g,(_,value)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"}[value]))
export async function verifyFinalIntegration({origin,mutationOrigin,email,password,restart,inspectDatabase,stage='05'}) {
  const prefix=stage==='master'?'master':`task${stage}`
  assert.equal(new URL(origin).hostname,'localhost')
  assert.equal(email,'editor-fixture@example.test')
  const report={captured:'2026-11-01',scope:'Real production npm run start, loopback HTTP, owned standalone MongoDB and external temporary uploads; no browser automation',security:[],restart:{status:'NOT_RUN'},measurements:[],status:'RUNNING'}
  const request=async(url,options={})=>{
    const started=performance.now()
    const response=await fetch(url,{...options,signal:AbortSignal.timeout(30000)})
    const bytes=(await response.clone().arrayBuffer()).byteLength
    report.measurements.push({path:new URL(url).pathname,method:options.method||'GET',status:response.status,milliseconds:Math.round((performance.now()-started)*100)/100,bytes,cacheControl:response.headers.get('cache-control')})
    return response
  }
  const jar=new Map()
  const cookies=()=>[...jar].map(([name,value])=>`${name}=${value}`).join('; ')
  const api=async(method,route,body,options={})=>{
    const headers={origin:mutationOrigin,...options.headers}
    if(options.cookie!==undefined)headers.cookie=options.cookie
    else if(!options.anonymous)headers.cookie=cookies()
    if(body!==undefined&&!(body instanceof FormData)){headers['content-type']='application/json';body=typeof body==='string'?body:JSON.stringify(body)}
    const response=await request(`${origin}/api/${route}`,{method,headers,body})
    if(options.capture!==false)for(const line of response.headers.getSetCookie()) {
      const [pair]=line.split(';'),index=pair.indexOf('=');jar.set(pair.slice(0,index),pair.slice(index+1))
    }
    const raw=await response.text()
    let data
    try {data=JSON.parse(raw)} catch {data={nonJson:true}}
    return {status:response.status,data,headers:response.headers}
  }
  const check=async(name,method,route,body,expected,options)=>{
    const response=await api(method,route,body,options)
    assert.ok([expected].flat().includes(response.status),`${name}: ${response.status} ${JSON.stringify(response.data)}`)
    report.security.push({name,status:'PASS',httpStatus:response.status})
    return response
  }
  const logo='global.navbar.navbar.src',textKey='home.hero-carousel.slides.item1.title'
  const getField=async key=>{const result=await api('GET','website-content/catalog?path=/');assert.equal(result.status,200);return result.data.fields.find(field=>field.key===key)}
  const mutate=async(key,value,expectedRevision)=>{
    const result=await api('PUT',`website-content/${key}`,{value,expectedRevision});assert.equal(result.status,200,JSON.stringify(result.data));return result.data.field
  }
  const reset=async(key,expectedRevision)=>{
    const result=await api('POST',`website-content/${key}/reset`,{expectedRevision});assert.equal(result.status,200,JSON.stringify(result.data))
  }
  try {
    await verifyPublicPages({origin,mutationOrigin,email,password,stage,request})
    const login=await api('POST','auth/login',{email,password},{anonymous:true})
    assert.equal(login.status,200)
    for(const line of login.headers.getSetCookie()){assert.match(line,/HttpOnly/i);assert.match(line,/Secure/i);assert.match(line,/SameSite=Lax/i);assert.match(line,/Path=\//i)}
    report.authentication={productionCookieFlags:'PASS'}
    const field=await getField(textKey)
    if(stage==='master'){
      const loginPage=await request(`${origin}/login`)
      assert.equal(loginPage.status,200)
      assert.match(visible(await loginPage.text()),/type="password"/)
      report.loginPage={status:'PASS',anonymousFormHTML:'PASS'}
      report.adminPages=[]
      for(const route of ['/admin','/admin/dashboard','/admin/circulars','/admin/staff','/admin/gallery','/admin/syllabus']){
        const response=await request(`${origin}${route}`)
        assert.equal(response.status,200,route)
        assert.doesNotMatch(visible(await response.text()),/<form(?:\s|>)/,`${route}: anonymous server HTML must retain the existing admin guard`)
        report.adminPages.push({route,anonymousInitialGuard:'PASS',hydratedAdminInteraction:'NOT_RUN: browser host unavailable'})
      }
      const adminPage=await request(`${origin}/admin/disclosure`)
      assert.equal(adminPage.status,200)
      assert.doesNotMatch(visible(await adminPage.text()),/>Add Disclosure</,'Anonymous server HTML must retain the existing admin loading/auth guard')
      report.adminPages.push({route:'/admin/disclosure',anonymousInitialGuard:'PASS',hydratedAdminInteraction:'NOT_RUN: browser host unavailable'})
      await check('anonymous disclosure write','POST','disclosure',{},401,{anonymous:true})
      await check('anonymous disclosure private list','GET','disclosure?all=true',undefined,401,{anonymous:true})
      const form=new FormData();form.append('pdf',new Blob([Buffer.from('%PDF-1.4\n% Disposable HTTP fixture only\n%%EOF')],{type:'application/pdf'}),'disclosure-fixture.pdf')
      const upload=await api('POST','upload/pdf?folder=disclosure',form)
      assert.equal(upload.status,200,JSON.stringify(upload.data))
      const body={title:'Disposable HTTP disclosure',description:'Fixture only',status:'Pending',fileUrl:upload.data.path,isPublished:false}
      const created=await api('POST','disclosure',body)
      assert.equal(created.status,201,JSON.stringify(created.data))
      const id=created.data.disclosure._id
      assert.equal((await api('GET','disclosure',undefined,{anonymous:true})).data.disclosures.length,0)
      const published=await api('PUT',`disclosure/${id}`,{...body,isPublished:true,expectedVersion:0})
      assert.equal(published.status,200,JSON.stringify(published.data))
      const publicRows=(await api('GET','disclosure',undefined,{anonymous:true})).data.disclosures
      assert.equal(publicRows[0].title,body.title);assert.equal(publicRows[0].version,undefined)
      const media=await request(`${origin}/api${upload.data.path}`)
      assert.equal(media.status,200);assert.match(media.headers.get('content-type'),/application\/pdf/)
      await check('stale disclosure update','PUT',`disclosure/${id}`,{...body,expectedVersion:0},409)
      assert.equal((await api('DELETE',`disclosure/${id}`,{expectedVersion:1})).status,200)
      report.disclosure={adminRoute:'PASS',upload:'PASS',draftPrivate:'PASS',publishPublic:'PASS',updateVersion:'PASS',compatiblePublicPDF:'PASS',delete:'PASS',browserCardRendering:'NOT_RUN: browser host unavailable'}
    }
    assert.ok(field)
    const target=`website-content/${textKey}`,body={value:'Final HTTP fixture heading',expectedRevision:field.revision}
    await check('anonymous write','PUT',target,body,401,{anonymous:true})
    await check('anonymous private history','GET',`website-content/history/${textKey}`,undefined,401,{anonymous:true})
    await check('unknown key','PUT','website-content/unregistered.heading',body,404)
    await check('protected payment key','PUT','website-content/global.top-bar.fee-options.item1.url',body,403)
    await check('unsafe destination','PUT','website-content/home.home.href.2',{value:'javascript:alert(1)',expectedRevision:0,confirmDestination:true},400)
    await check('script markup','PUT',target,{...body,value:'<script>alert(1)</script>'},400)
    await check('cross-site origin','PUT',target,body,403,{headers:{origin:'https://attacker.example.test'}})
    await check('oversized JSON','PUT',target,{...body,value:'x'.repeat(150000)},413)
    await check('MongoDB operator injection','PUT',target,{...body,value:{$ne:null}},400)
    await check('prototype pollution','PUT',target,'{"value":"fixture","expectedRevision":0,"__proto__":{"polluted":true}}',400)
    await check('history bounds','GET',`website-content/history/${textKey}?limit=101`,undefined,400)
    const payload=jwt.decode(jar.get('accessToken'));delete payload.iat;delete payload.exp
    const expired=jwt.sign(payload,'fixture-editor-preview-only-secret-abcdefghijklmnopqrstuvwxyz',{algorithm:'HS256',expiresIn:-1})
    await check('expired session write','PUT',target,body,401,{cookie:`accessToken=${expired}`,capture:false})
    const saved=await mutate(textKey,body.value,field.revision)
    await check('stale revision conflict','PUT',target,body,409)
    const currentLogo=await getField(logo)
    const form=new FormData()
    const input=await sharp({create:{width:1800,height:600,channels:3,background:'#914e24'}}).jpeg().toBuffer()
    form.append('image',new Blob([input],{type:'image/jpeg'}),'restart-fixture.jpg')
    const upload=await api('POST',`website-content/images/${logo}`,form)
    assert.equal(upload.status,200,JSON.stringify(upload.data))
    const image=upload.data.image
    assert.equal(image.width/image.height,3)
    const savedImage=await mutate(logo,image.value,currentLogo.revision)
    const before=await request(`${origin}${image.value}`)
    assert.equal(before.status,200)
    const checksum=digest(Buffer.from(await before.arrayBuffer()))
    await restart()
    const persisted=await api('GET','website-content?path=/',undefined,{anonymous:true})
    assert.equal(persisted.data.overrides[textKey].value,body.value)
    assert.equal(persisted.data.overrides[logo].value,image.value)
    const html=visible(await (await request(`${origin}/`)).text())
    assert.ok(html.includes(body.value));assert.ok(html.includes(`src="${image.value}"`))
    assert.doesNotMatch(html,/data-website-(?:field|editor-ui)=/)
    const after=await request(`${origin}${image.value}`)
    assert.equal(after.status,200);assert.equal(digest(Buffer.from(await after.arrayBuffer())),checksum)
    const history=await api('GET',`website-content/history/${logo}`)
    assert.equal(history.status,200)
    assert.ok(history.data.entries.some(entry=>entry.revision===savedImage.revision&&entry.newValue===image.value))
    const old=history.data.entries.find(entry=>entry.revision===1)
    assert.ok(old)
    const restored=await api('POST',`website-content/${logo}/restore`,{revision:1,expectedRevision:savedImage.revision})
    assert.equal(restored.status,200,JSON.stringify(restored.data))
    assert.equal((await request(`${origin}${old.newValue}`)).status,200)
    await reset(logo,restored.data.field.revision)
    await reset(textKey,saved.revision)
    const defaults=visible(await (await request(`${origin}/`)).text())
    assert.ok(defaults.includes('src="/logo.jpeg"'))
    assert.ok(decode(defaults).includes(getContentField(textKey).defaultValue))
    report.restart={status:'PASS',launcher:'npm run start',publishedText:'PASS',imageURLAndSHA256:'PASS',privateHistory:'PASS',restoreHistoricalImage:'PASS',restoreOriginalLogoAndText:'PASS',releaseWithoutDocsTestsOrEnvFiles:'PASS',dependencies:'Installed production node_modules shared by a temporary checked junction; npm ci --omit=dev in a clean Linux image was not run'}
    await check('upload traversal','GET','../uploads/%2e%2e%2fpackage.json',undefined,[400,404],{anonymous:true})
    await check('private image manifest','GET',`../${image.value.replace(/^\//,'').replace(/[^/]+$/,'manifest.json')}`,undefined,[400,404],{anonymous:true})
    const refresh=await api('POST','auth/refresh-token',{})
    assert.equal(refresh.status,200)
    report.authentication.refresh='PASS'
    const revoked=cookies()
    assert.equal((await api('POST','auth/logout',{})).status,200)
    await check('logged-out previous cookie cannot write','PUT',target,body,401,{cookie:revoked,capture:false})
    await check('logged-out previous cookie cannot read history','GET',`website-content/history/${textKey}`,undefined,401,{cookie:revoked,capture:false})
    report.authentication.logoutRevokesAccess='PASS'
    report.database=await inspectDatabase()
    assert.ok(report.database.contentIndexes.some(index=>index.name==='website_content_key_unique'&&index.unique))
    assert.ok(report.database.historyIndexes.some(index=>index.name==='website_content_revision_unique'&&index.unique))
    assert.ok(report.database.contentLookup.documentsExamined<=1)
    assert.ok(report.database.historyLookup.documentsExamined<=26)
    const pages=report.measurements.filter(row=>row.method==='GET'&&row.status===200&&!row.path.startsWith('/api/')&&!row.path.startsWith('/uploads/'))
    const sorted=pages.map(row=>row.milliseconds).sort((a,b)=>a-b)
    report.performance={scope:'Sequential local full HTTP response consumption, fixture data, no browser/LCP/production-load claim',pageSamples:sorted.length,minMs:sorted[0],p50Ms:sorted[Math.floor((sorted.length-1)*.5)],p95Ms:sorted[Math.floor((sorted.length-1)*.95)],maxMs:sorted.at(-1),pageBytesMin:Math.min(...pages.map(row=>row.bytes)),pageBytesMax:Math.max(...pages.map(row=>row.bytes)),allPagesPrivateOrNoStore:pages.every(row=>/private|no-store/.test(row.cacheControl||''))}
    assert.equal(report.performance.allPagesPrivateOrNoStore,true)
    report.status='PASS'
    return report
  } catch(error){report.status='FAIL';report.error=error.message;throw error}
  finally {await fs.writeFile(`docs/website-editor/${prefix}-final-http-results.json`,JSON.stringify(report,null,2)+'\n')}
}
