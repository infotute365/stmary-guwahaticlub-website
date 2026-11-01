import fs from 'node:fs/promises'
import Disclosure from '../model/disclosure.model.js'
import { uploadPath } from '../config/localStorage.js'
import { CatchError, TryError } from '../util/error.js'

const administrator=req=>Boolean(req.session&&['admin','super-admin'].includes(req.session.role))
const requireAdmin=req=>{if(!administrator(req))throw TryError('Unauthorized access',401)}
const publicProjection={title:1,description:1,status:1,fileUrl:1,expiryDate:1}
const privateProjection={...publicProjection,isPublished:1,version:1,updatedAt:1}
const initialized=new WeakMap()
async function indexes(){
  const db=Disclosure.db.db
  if(!initialized.has(db))initialized.set(db,Disclosure.createIndexes().catch(error=>{initialized.delete(db);throw error}))
  await initialized.get(db)
}
function query(req){
  const result={}
  for(const [key,value] of req.disclosureQuery||Object.entries(req.query||{})){
    if(!['all','before','limit'].includes(key)||Object.hasOwn(result,key)||typeof value!=='string')throw TryError('Invalid disclosure query',400)
    result[key]=value
  }
  if(result.all!==undefined&&!['true','false'].includes(result.all))throw TryError('Invalid disclosure visibility',400)
  if(result.before!==undefined&&!/^[a-f\d]{24}$/i.test(result.before))throw TryError('Invalid disclosure cursor',400)
  if(result.limit!==undefined&&(!/^[1-9]\d?$|^100$/.test(result.limit)))throw TryError('Invalid disclosure limit',400)
  return result
}
function object(input,allowed){
  if(!input||Array.isArray(input)||Object.getPrototypeOf(input)!==Object.prototype||Object.keys(input).some(key=>!allowed.includes(key)))throw TryError('Invalid disclosure request',400)
  return input
}
function version(value){if(!Number.isSafeInteger(value)||value<0||value>=Number.MAX_SAFE_INTEGER)throw TryError('A valid expectedVersion is required',400);return value}
function text(value,name,max,required=false){
  if(typeof value!=='string'||value.length>max||(required&&!value.trim())||/[<>\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value)||/(?:javascript|vbscript|data):|&(?:lt|gt|#0*60|#x0*3c);/i.test(value))throw TryError(`Invalid ${name}`,400)
  return value
}
async function payload(body){
  object(body,['title','description','status','fileUrl','expiryDate','isPublished','expectedVersion'])
  const value={title:text(body.title,'title',200,true),description:text(body.description??'','description',5000),status:body.status??'Pending',fileUrl:body.fileUrl,expiryDate:null,isPublished:body.isPublished??false}
  if(!['Pending','Valid','Active','Expired'].includes(value.status)||typeof value.isPublished!=='boolean')throw TryError('Invalid disclosure status or publication flag',400)
  if(typeof value.fileUrl!=='string'||!/^\/uploads\/disclosure\/[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}\.pdf$/i.test(value.fileUrl))throw TryError('Upload a disclosure PDF first',400)
  // Do not accept an arbitrary local or external file reference. The existing
  // PDF uploader validates bytes; this checks the persistent file still exists.
  try {await fs.access(await uploadPath(value.fileUrl.slice('/uploads/'.length)))}catch{throw TryError('Disclosure PDF is unavailable',400)}
  if(body.expiryDate!==undefined&&body.expiryDate!==null&&body.expiryDate!==''){
    if(typeof body.expiryDate!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(body.expiryDate)||!Number.isFinite(Date.parse(body.expiryDate))||new Date(body.expiryDate).toISOString().slice(0,10)!==body.expiryDate)throw TryError('Invalid expiry date',400)
    value.expiryDate=new Date(`${body.expiryDate}T00:00:00.000Z`)
  }
  return value
}
export async function getDisclosures(req,res){
  try{
    const options=query(req),all=options.all==='true'
    if(all)requireAdmin(req)
    const filter=all?{}:{isPublished:true}
    if(options.before)filter._id={$lt:options.before}
    const limit=Number(options.limit||100)
    const rows=await Disclosure.find(filter,all?privateProjection:publicProjection).sort({_id:-1}).limit(limit+1).lean()
    const hasMore=rows.length>limit,disclosures=rows.slice(0,limit)
    res.json({disclosures,nextBefore:hasMore?String(disclosures.at(-1)._id):null})
  }catch(error){CatchError(error,res,'Failed to load disclosures')}
}
export async function getDisclosureById(req,res){
  try{
    if(Object.keys(req.query||{}).length)throw TryError('Invalid disclosure query',400)
    const filter={_id:req.params.id,...(!administrator(req)?{isPublished:true}:{})}
    const disclosure=await Disclosure.findOne(filter,administrator(req)?privateProjection:publicProjection).lean()
    if(!disclosure)throw TryError('Disclosure not found',404)
    res.json({disclosure})
  }catch(error){CatchError(error,res,'Failed to load disclosure')}
}
export async function createDisclosure(req,res){
  try{
    requireAdmin(req)
    if(Object.keys(req.query||{}).length)throw TryError('Invalid disclosure query',400)
    if(Object.hasOwn(req.body,'expectedVersion'))throw TryError('New disclosures do not have a version',400)
    const value=await payload(req.body)
    await indexes()
    const disclosure=await Disclosure.create({...value,updatedBy:req.session.id})
    res.status(201).json({message:'Disclosure created successfully',disclosure})
  }catch(error){CatchError(error,res,'Failed to create disclosure')}
}
export async function updateDisclosure(req,res){
  try{
    requireAdmin(req)
    if(Object.keys(req.query||{}).length)throw TryError('Invalid disclosure query',400)
    const expectedVersion=version(req.body.expectedVersion),value=await payload(req.body)
    const disclosure=await Disclosure.findOneAndUpdate({_id:req.params.id,version:expectedVersion},{$set:{...value,updatedBy:req.session.id},$inc:{version:1}},{new:true,runValidators:true}).lean()
    if(!disclosure){if(!await Disclosure.exists({_id:req.params.id}))throw TryError('Disclosure not found',404);throw TryError('Disclosure changed; reload before saving',409)}
    res.json({message:'Disclosure updated successfully',disclosure})
  }catch(error){CatchError(error,res,'Failed to update disclosure')}
}
export async function deleteDisclosure(req,res){
  try{
    requireAdmin(req)
    if(Object.keys(req.query||{}).length)throw TryError('Invalid disclosure query',400)
    object(req.body,['expectedVersion'])
    const expectedVersion=version(req.body.expectedVersion)
    const deleted=await Disclosure.findOneAndDelete({_id:req.params.id,version:expectedVersion}).lean()
    if(!deleted){if(!await Disclosure.exists({_id:req.params.id}))throw TryError('Disclosure not found',404);throw TryError('Disclosure changed; reload before deleting',409)}
    // Retain uploaded PDFs: another record or a backup may still reference them.
    res.json({message:'Disclosure deleted successfully'})
  }catch(error){CatchError(error,res,'Failed to delete disclosure')}
}
