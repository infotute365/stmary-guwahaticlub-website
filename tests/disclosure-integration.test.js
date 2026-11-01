import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import Auth from '../src/server/model/auth.model.js'
import Disclosure from '../src/server/model/disclosure.model.js'
import {handleApiRequest,routeFor} from '../src/server/route-adapter.js'
import connectDB from '../src/server/config/database.js'
import {uploadPath} from '../src/server/config/localStorage.js'

test('disclosure routes are additive, strict and administrator-protected',()=>{
  for(const [method,parts] of [['POST',['disclosure']],['PUT',['disclosure','0123456789abcdef01234567']],['DELETE',['disclosure','0123456789abcdef01234567']]])assert.equal(routeFor(method,parts).auth,true)
  assert.equal(routeFor('PUT',['disclosure','0123456789abcdef01234567','extra']),null)
})

test('disposable MongoDB: disclosure management, publication, documents, conflicts and authorization',{skip:!process.env.TEST_MONGODB_URI},async t=>{
  const uri=new URL(process.env.TEST_MONGODB_URI)
  assert.equal(uri.hostname,'127.0.0.1');assert.match(uri.pathname,/^\/stmary_gc_test_[a-z\d_]+$/i)
  uri.pathname+=`_disclosure_${process.pid}_${Date.now()}`
  const database=uri.pathname.slice(1),directory=await fs.mkdtemp(path.join(os.tmpdir(),'stmary-gc-disclosure-'))
  process.env.MONGODB_URI=uri.toString();process.env.JWT_SECRET='fixture-only-disclosure-secret-abcdefghijklmnopqrstuvwxyz';process.env.APP_ORIGIN='http://localhost';process.env.NODE_ENV='test';process.env.UPLOAD_DIR=directory
  delete globalThis.__guwahatiRateLimits
  await connectDB();assert.equal(mongoose.connection.name,database)
  t.after(async()=>{
    assert.equal(mongoose.connection.name,database)
    try{await mongoose.connection.dropDatabase()}finally{await mongoose.disconnect()}
    const target=path.resolve(directory);assert.equal(path.dirname(target),path.resolve(os.tmpdir()));assert.ok(path.basename(target).startsWith('stmary-gc-disclosure-'))
    await fs.rm(target,{recursive:true,force:true})
  })
  let cookie=''
  const call=async(method,route,body,options={})=>{
    const headers={origin:options.origin||'http://localhost'}
    if(options.cookie!==undefined)headers.cookie=options.cookie;else if(cookie&&!options.anonymous)headers.cookie=cookie
    if(body!==undefined&&!(body instanceof FormData)){headers['content-type']='application/json';body=JSON.stringify(body)}
    const response=await handleApiRequest(new Request(`http://localhost/api/${route}`,{method,headers,body}),{})
    if(route==='auth/login'&&response.ok)cookie=response.cookies.getAll().map(entry=>`${entry.name}=${entry.value}`).join('; ')
    return {status:response.status,data:await response.json(),headers:response.headers}
  }
  const email='disclosure-fixture@example.test',password='Fixture-Disclosure-Only-Aa123!'
  const admin=await Auth.create({fullname:'Disclosure Fixture',email,password,role:'admin',isActive:true})
  let draft,id
  await t.test('public empty reads create no records; all private writes and draft lists require a valid administrator',async()=>{
    assert.deepEqual((await call('GET','disclosure')).data,{disclosures:[],nextBefore:null})
    assert.equal(await Disclosure.countDocuments(),0)
    assert.equal((await call('GET','disclosure?all=true')).status,401)
    for(const [method,route] of [['POST','disclosure'],['PUT',`disclosure/${admin._id}`],['DELETE',`disclosure/${admin._id}`]])assert.equal((await call(method,route,{})).status,401)
    const viewer=new mongoose.Types.ObjectId()
    await Auth.collection.insertOne({_id:viewer,role:'viewer',isActive:true,sessionVersion:0})
    const forged=jwt.sign({id:String(viewer),role:'admin',version:0},process.env.JWT_SECRET,{expiresIn:'15m'})
    assert.equal((await call('POST','disclosure',{}, {cookie:`accessToken=${forged}`})).status,401)
    assert.equal((await call('POST','auth/login',{email,password})).status,200)
  })
  await t.test('existing PDF upload creates a private draft and public projection only appears after explicit publication',async()=>{
    const form=new FormData();form.append('pdf',new Blob([Buffer.from('%PDF-1.4\n% Disposable fixture only\n%%EOF')],{type:'application/pdf'}),'fixture.pdf')
    const upload=await call('POST','upload/pdf?folder=disclosure',form)
    assert.equal(upload.status,200,JSON.stringify(upload.data))
    draft={title:'Disposable disclosure fixture',description:'Fixture only, no school certificate',status:'Pending',fileUrl:upload.data.path,expiryDate:'2099-12-31',isPublished:false}
    const result=await call('POST','disclosure',draft)
    assert.equal(result.status,201,JSON.stringify(result.data));id=result.data.disclosure._id
    assert.equal(result.data.disclosure.version,0)
    assert.equal((await call('GET',`disclosure/${id}`,undefined,{anonymous:true})).status,404)
    assert.equal((await call('GET','disclosure',undefined,{anonymous:true})).data.disclosures.length,0)
    assert.equal((await call('GET','disclosure?all=true')).data.disclosures.length,1)
    const published=await call('PUT',`disclosure/${id}`,{...draft,isPublished:true,expectedVersion:0})
    assert.equal(published.status,200);assert.equal(published.data.disclosure.version,1)
    const publicData=(await call('GET','disclosure',undefined,{anonymous:true})).data.disclosures[0]
    assert.equal(publicData.title,draft.title)
    for(const key of ['updatedBy','version','isPublished','createdAt','updatedAt'])assert.equal(publicData[key],undefined)
  })
  await t.test('invalid input, unsafe files, CSRF, expired sessions and operator/prototype injection cannot alter a disclosure',async()=>{
    for(const body of [{...draft,title:'<script>alert(1)</script>'},{...draft,fileUrl:'javascript:alert(1)'},{...draft,fileUrl:'/uploads/../outside.pdf'},{...draft,fileUrl:'/uploads/syllabus/11111111-1111-4111-8111-111111111111.pdf'},{...draft,expiryDate:'2099-02-31'},{...draft,status:'Invented'},{...draft,isPublished:'true'},{...draft,title:{$ne:null}},{...draft,unexpected:true},JSON.parse('{"__proto__":{}}')])assert.equal((await call('POST','disclosure',body)).status,400)
    assert.equal((await call('POST','disclosure',draft,{origin:'https://evil.example'})).status,403)
    const account=await Auth.findById(admin._id)
    const expired=jwt.sign({id:String(admin._id),version:account.sessionVersion},process.env.JWT_SECRET,{expiresIn:-1})
    assert.equal((await call('POST','disclosure',draft,{cookie:`accessToken=${expired}`})).status,401)
    for(const query of ['limit=101','limit=0','before=invalid','all=true&all=false','unexpected=true'])assert.equal((await call('GET',`disclosure?${query}`)).status,400)
    assert.equal(await Disclosure.countDocuments(),1)
  })
  await t.test('concurrent update and deletion reject stale versions without deleting the original PDF',async()=>{
    const results=await Promise.all([call('PUT',`disclosure/${id}`,{...draft,title:'First concurrent fixture',isPublished:true,expectedVersion:1}),call('PUT',`disclosure/${id}`,{...draft,title:'Second concurrent fixture',isPublished:true,expectedVersion:1})])
    assert.deepEqual(results.map(result=>result.status).sort(),[200,409])
    assert.equal((await call('DELETE',`disclosure/${id}`,{expectedVersion:1})).status,409)
    assert.equal((await call('DELETE',`disclosure/${id}`,{expectedVersion:2})).status,200)
    assert.equal((await call('GET',`disclosure/${id}`)).status,404)
    await fs.access(await uploadPath(draft.fileUrl.slice('/uploads/'.length)))
  })
  await t.test('cursor pagination is bounded, indexed and does not drop or expose private records',async()=>{
    const items=Array.from({length:104},(_,index)=>({...draft,title:`Paging fixture ${index}`,isPublished:index<103,updatedBy:admin._id}))
    await Disclosure.insertMany(items)
    const first=await call('GET','disclosure?limit=100',undefined,{anonymous:true})
    assert.equal(first.data.disclosures.length,100);assert.ok(first.data.nextBefore)
    const second=await call('GET',`disclosure?limit=100&before=${first.data.nextBefore}`,undefined,{anonymous:true})
    assert.equal(second.data.disclosures.length,3);assert.equal(second.data.nextBefore,null)
    assert.equal(new Set([...first.data.disclosures,...second.data.disclosures].map(item=>item._id)).size,103)
    assert.ok((await Disclosure.collection.indexes()).some(index=>index.name==='disclosure_public_cursor'))
    assert.equal((await call('POST','auth/logout',{})).status,200)
    assert.equal((await call('POST','disclosure',draft)).status,401)
  })
})
