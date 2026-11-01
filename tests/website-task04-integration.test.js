import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import sharp from 'sharp'
import mongoose from 'mongoose'
import connectDB from '../src/server/config/database.js'
import Auth from '../src/server/model/auth.model.js'
import { CONTENT_BINDINGS } from '../src/content/website-bindings.js'
import { PUBLIC_PAGES } from '../src/components/website-editor/editor-bindings.js'
import { getContentField } from '../src/server/util/websiteContentPolicy.js'
import { saveWebsiteContent,resetWebsiteContent,restoreWebsiteContent,getPublishedWebsiteContent,uploadWebsiteContentImage } from '../src/server/controller/website-content.controller.js'
import { loadPublishedWebsiteContent } from '../src/server/util/publishedWebsiteContent.js'
import { getWebsiteContentHistory } from '../src/server/util/websiteContentStore.js'
import { processWebsiteImage,validateWebsiteImageReference } from '../src/server/util/websiteImageProcessor.js'
import { processAndSaveImage } from '../src/server/util/imageProcessor.js'
import { uploadPath } from '../src/server/config/localStorage.js'
import { handleApiRequest } from '../src/server/route-adapter.js'

const initialUri=process.env.TEST_MONGODB_URI
const resultPrefix=process.env.WEBSITE_EDITOR_TEST_STAGE==='master'?'master':process.env.WEBSITE_EDITOR_TEST_STAGE==='05'?'task05':'task04'
test('Task 04: all approved fields, all routes, isolated publication/rollback and separate website image uploads', {skip:!initialUri}, async t=>{
  const parsed=new URL(initialUri)
  assert.equal(parsed.protocol,'mongodb:')
  assert.match(parsed.pathname,/^\/stmary_gc_test_[a-z\d_]+$/i)
  parsed.pathname+=`_task04_${process.pid}_${Date.now()}`
  const database=parsed.pathname.slice(1)
  const directory=await fs.mkdtemp(path.join(os.tmpdir(),'stmary-gc-task04-'))
  process.env.MONGODB_URI=parsed.toString()
  process.env.JWT_SECRET='fixture-task04-only-secret-abcdefghijklmnopqrstuvwxyz'
  process.env.APP_ORIGIN='http://localhost'
  process.env.NODE_ENV='test'
  process.env.UPLOAD_DIR=path.join(directory,'uploads')
  delete globalThis.__guwahatiRateLimits
  await connectDB()
  assert.equal(mongoose.connection.name,database)
  t.after(async()=>{
    assert.equal(mongoose.connection.name,database)
    try {await mongoose.connection.dropDatabase()}finally{await mongoose.disconnect()}
    const target=path.resolve(directory)
    assert.equal(path.dirname(target),path.resolve(os.tmpdir()))
    assert.ok(path.basename(target).startsWith('stmary-gc-task04-'))
    await fs.rm(target,{recursive:true,force:true})
  })
  const administrator=await Auth.create({fullname:'Task 04 Fixture',email:'task04-fixture@example.test',password:'Fixture-Task04-Only-Aa123!',role:'admin',isActive:true})
  const session={id:String(administrator._id),role:'admin'}
  const call=async(handler,key,body={},pagePath='/')=>{
    const state={status:200,data:null}
    const response={status(code){state.status=code;return this},json(data){state.data=data;return this}}
    await handler({session,params:{key},body,query:handler===getPublishedWebsiteContent?{path:pagePath}:{},websiteContentQuery:handler===getPublishedWebsiteContent?[['path',pagePath]]:[]},response)
    return state
  }
  const sourceImage=await sharp({create:{width:3000,height:1000,channels:3,background:'#7a0c1e'}}).png().toBuffer()
  const file={buffer:sourceImage,mimetype:'image/png',originalname:'fixture-wide.png'}
  const results=[],imageValues=new Map()
  await t.test('every approved field saves only itself, survives fresh reads and restores its exact default',async()=>{
    assert.equal(CONTENT_BINDINGS.length,959)
    try {
      for(const [index,binding] of CONTENT_BINDINGS.entries()) {
        const field=getContentField(binding.key,{editable:true})
        const record={key:field.key,save:'NOT_RUN',freshPublishedRead:'NOT_RUN',serverSnapshot:'NOT_RUN',history:'NOT_RUN',reset:'NOT_RUN'}
        results.push(record)
        let value
        if(field.contentType==='image') {
          const image=await processWebsiteImage(file,field)
          assert.ok(image.width>360)
          for(const variant of image.variants)assert.ok(Math.abs(variant.width/variant.height-3)<0.02,'Website processor does not crop')
          value=image.value;imageValues.set(field.key,value)
        } else if(field.contentType==='url')value=field.choices.find(choice=>choice.value!==field.defaultValue).value
        else if(field.contentType==='number')value=field.defaultValue+1
        else value=`Task 04 verified field ${index}`
        const confirmation=field.contentType==='url'?{confirmDestination:true}:{}
        const saved=await call(saveWebsiteContent,field.key,{value,expectedRevision:0,contentType:field.contentType,...confirmation})
        assert.equal(saved.status,200,`${field.key}: ${JSON.stringify(saved.data)}`)
        record.save='PASS'
        const page=field.usedOnRoutes[0]
        const published=await call(getPublishedWebsiteContent,null,{},page)
        assert.equal(published.status,200)
        assert.deepEqual(Object.keys(published.data.overrides),[field.key],'No unrelated override is written')
        assert.equal(published.data.overrides[field.key].value,value)
        record.freshPublishedRead='PASS'
        assert.equal((await loadPublishedWebsiteContent())[field.key].value,value)
        record.serverSnapshot='PASS'
        const history=await getWebsiteContentHistory(field)
        assert.equal(history.entries.length,1)
        assert.equal(history.entries[0].newValue,value)
        assert.equal(history.entries[0].previousValue,field.defaultValue)
        record.history='PASS'
        const reset=await call(resetWebsiteContent,field.key,{expectedRevision:1,...confirmation})
        assert.equal(reset.status,200,field.key)
        assert.equal(reset.data.field.value,field.defaultValue)
        assert.equal(reset.data.field.hasOverride,false)
        assert.equal((await call(getPublishedWebsiteContent,null,{},page)).data.overrides[field.key],undefined)
        record.reset='PASS'
      }
    } finally {
      await fs.writeFile(`docs/website-editor/${resultPrefix}-field-save-results.json`,JSON.stringify({captured:'2026-11-01',scope:'Actual controllers, isolated MongoDB, revision history, public API projection and initial-server snapshot loader; not browser automation',results},null,2)+'\n')
    }
  })
  await t.test('each of the 23 routes publishes its own page text and restores it',async()=>{
    const results=[]
    for(const page of PUBLIC_PAGES) {
      const binding=CONTENT_BINDINGS.find(field=>field.path===page.path&&field.kind==='text')
      assert.ok(binding,`${page.path}: page-specific text binding`)
      const value=`Route verified ${page.path}`
      assert.equal((await call(saveWebsiteContent,binding.key,{value,expectedRevision:2})).status,200)
      assert.equal((await call(getPublishedWebsiteContent,null,{},page.path)).data.overrides[binding.key].value,value)
      assert.equal((await loadPublishedWebsiteContent())[binding.key].value,value)
      assert.equal((await call(resetWebsiteContent,binding.key,{expectedRevision:3})).status,200)
      results.push({route:page.path,key:binding.key,saveFreshReadServerSnapshotReset:'PASS'})
    }
    await fs.writeFile(`docs/website-editor/${resultPrefix}-route-save-results.json`,JSON.stringify({scope:'Page-specific controller and server-snapshot checks; browser rendering is separate',results},null,2)+'\n')
  })
  await t.test('destination mutation and rollback require explicit confirmation; payment mappings stay protected',async()=>{
    const key='home.home.href.2'
    const field=getContentField(key)
    assert.equal((await call(saveWebsiteContent,key,{value:'/',expectedRevision:2})).status,400)
    assert.equal((await call(resetWebsiteContent,key,{expectedRevision:2})).status,400)
    assert.equal((await call(restoreWebsiteContent,key,{revision:1,expectedRevision:2})).status,400)
    for(const flag of ['true',1,false,null])assert.equal((await call(saveWebsiteContent,key,{value:'/',expectedRevision:2,confirmDestination:flag})).status,400)
    for(const value of ['javascript:alert(1)','data:text/html,x','//evil.example','https://evil.example','/admin','/contact?redirect=//evil.example'])assert.equal((await call(saveWebsiteContent,key,{value,expectedRevision:2,confirmDestination:true})).status,400)
    assert.equal(field.defaultValue,'/contact')
    assert.equal((await call(saveWebsiteContent,'global.top-bar.fee-options.item1.url',{value:'/',expectedRevision:0,confirmDestination:true})).status,403)
  })
  await t.test('replacement images are slot-owned, retained for rollback, oriented and processed separately from Gallery/Staff',async()=>{
    const field=getContentField('home.hero-carousel.hero-carousel.style',{editable:true})
    const prior=imageValues.get(field.key)
    const portrait=await sharp(sourceImage).jpeg().withMetadata({orientation:6}).toBuffer()
    const replacement=await processWebsiteImage({buffer:portrait,mimetype:'image/jpeg',originalname:'portrait.jpg'},field)
    assert.ok(Math.abs(replacement.width/replacement.height-1/3)<0.01)
    await assert.rejects(validateWebsiteImageReference(getContentField('global.navbar.navbar.src'),replacement.value),{status:400})
    assert.equal((await call(saveWebsiteContent,field.key,{value:replacement.value,expectedRevision:2})).status,200)
    assert.equal((await call(restoreWebsiteContent,field.key,{revision:1,expectedRevision:3})).status,200)
    assert.equal((await loadPublishedWebsiteContent())[field.key].value,prior)
    await validateWebsiteImageReference(field,prior)
    assert.equal((await call(resetWebsiteContent,field.key,{expectedRevision:4})).status,200)
    const legacy=await processAndSaveImage(file,'gallery')
    const legacyInfo=await sharp(await fs.readFile(await uploadPath(legacy.slice('/uploads/'.length)))).metadata()
    assert.equal(legacyInfo.width,360);assert.equal(legacyInfo.height,360)
    assert.equal((await getWebsiteContentHistory(field)).entries.length,5)
  })
  await t.test('real multipart endpoint enforces authentication, format validation, slot protection and storage retention',async()=>{
    let cookie=''
    const request=async(method,route,body,anonymous=false)=>{
      const headers={origin:'http://localhost'}
      if(cookie&&!anonymous)headers.cookie=cookie
      if(body && !(body instanceof FormData)){headers['content-type']='application/json';body=JSON.stringify(body)}
      const parts=route.split('?')[0].split('/').map(decodeURIComponent)
      const response=await handleApiRequest(new Request(`http://localhost/api/${route}`,{method,headers,body}),{params:Promise.resolve({path:parts})})
      if(route==='auth/login'&&response.ok)cookie=response.cookies.getAll().map(item=>`${item.name}=${item.value}`).join('; ')
      return {status:response.status,data:await response.json()}
    }
    const form=(buffer=sourceImage,type='image/png',name='wide.png')=>{const data=new FormData();data.append('image',new Blob([buffer],{type}),name);return data}
    const key='home.hero-carousel.hero-carousel.style'
    assert.equal((await request('POST',`website-content/images/${key}`,form(),true)).status,401)
    assert.equal((await request('POST','auth/login',{email:'task04-fixture@example.test',password:'Fixture-Task04-Only-Aa123!'},true)).status,200)
    const uploaded=await request('POST',`website-content/images/${key}`,form())
    assert.equal(uploaded.status,200,JSON.stringify(uploaded.data))
    assert.equal((await loadPublishedWebsiteContent())[key],undefined,'Upload alone never publishes')
    for(const [data,type,name] of [[Buffer.from('<svg/>'),'image/svg+xml','bad.svg'],[Buffer.from('%PDF-1.4'),'application/pdf','bad.pdf'],[Buffer.from([137,80,78,71,13,10,26,10,1]),'image/png','broken.png']])assert.equal((await request('POST',`website-content/images/${key}`,form(data,type,name))).status,400)
    assert.equal((await request('POST','website-content/images/contact.contact-us.src',form())).status,403)
    const path=uploaded.data.image.variants[0].url
    assert.equal((await request('DELETE','upload/file',{filePath:path})).status,403)
    for(const altered of [path.replace('/website/','/Website/'),path.replace('/website/','/%77ebsite/')])assert.equal((await request('DELETE','upload/file',{filePath:altered})).status,403)
    await fs.access(await uploadPath(path.slice('/uploads/'.length)))
    const existingGalleryFolder=await processAndSaveImage(file,'gallery/website')
    assert.equal((await request('DELETE','upload/file',{filePath:existingGalleryFolder})).status,200,'Only the reserved root namespace is protected; existing Gallery subfolders retain their behavior')
    assert.equal((await request('POST','upload/image?folder=website',form())).status,403)
    assert.equal((await request('POST',`website-content/images/${key}`,form(Buffer.alloc(10*1024*1024+1), 'image/png','huge.png'))).status,413)
  })
})
