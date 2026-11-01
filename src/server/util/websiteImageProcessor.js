import sharp from 'sharp'
import fs from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { validateUploadBuffer } from './validation.mjs'
import { writeUpload, uploadPath, deleteUpload } from '../config/localStorage.js'
import { TryError } from './error.js'

export async function processWebsiteImage(file, field) {
  if (!field?.uploadAllowed || field.contentType !== 'image') throw TryError('This image slot is protected', 403)
  try { validateUploadBuffer(file?.buffer, file?.mimetype, file?.originalname, {maxSize:10*1024*1024}) }
  catch (error) { throw TryError(error.message, /too large/i.test(error.message)?413:400) }
  if (!['image/jpeg','image/png','image/webp'].includes(file.mimetype)) throw TryError('Use a JPEG, PNG or WebP image', 400)
  let metadata
  try {
    metadata = await sharp(file.buffer, {limitInputPixels:40000000, animated:false}).metadata()
    if (!metadata.width || !metadata.height || metadata.width>20000 || metadata.height>20000 || (metadata.pages||1)!==1) throw new Error('Unsupported dimensions or animation')
  } catch { throw TryError('Invalid or excessively large image',400) }
  const orientedWidth = [5,6,7,8].includes(metadata.orientation) ? metadata.height : metadata.width
  const maximum = Math.min(2560,orientedWidth)
  const sizes = [...new Set([640,1280,1920,maximum].filter(width=>width<=maximum))].sort((a,b)=>a-b)
  const id=randomUUID(), variants=[], written=[]
  try {
    for(const width of sizes) {
      const {data,info}=await sharp(file.buffer,{limitInputPixels:40000000}).rotate().resize({width,withoutEnlargement:true}).webp({quality:85}).toBuffer({resolveWithObject:true})
      const url=await writeUpload(`website/${id}/${info.width}.webp`,data)
      written.push(url);variants.push({url,width:info.width,height:info.height,bytes:data.length})
    }
    const primary=variants.at(-1)
    const manifest={key:field.key,variants,createdAt:new Date().toISOString()}
    written.push(await writeUpload(`website/${id}/manifest.json`,Buffer.from(JSON.stringify(manifest))))
    return {value:field.backgroundImage?`url('${primary.url}')`:primary.url,variants,width:primary.width,height:primary.height}
  } catch(error) {
    for(const url of written) await deleteUpload(url).catch(()=>{})
    if(error.status)throw error
    throw TryError('Could not process or store this image',503)
  }
}

export async function validateWebsiteImageReference(field,value) {
  if(field.contentType!=='image' || field.choices?.some(choice=>choice.value===value))return
  const source=field.backgroundImage?value.match(/^url\('([^']+)'\)$/)?.[1]:value
  const match=source?.match(/^\/uploads\/website\/([a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12})\/[1-9]\d{0,3}\.webp$/i)
  if(!match)throw TryError('Image is not an approved website upload',400)
  try {
    const file=await uploadPath(`website/${match[1]}/manifest.json`)
    const bytes=await fs.readFile(file)
    if(bytes.length>65536)throw new Error('Invalid manifest')
    const manifest=JSON.parse(bytes.toString('utf8'))
    if(manifest.key!==field.key || !manifest.variants?.some(variant=>variant.url===source))throw new Error('Image belongs to another slot')
    await fs.access(await uploadPath(source.slice('/uploads/'.length)))
  } catch { throw TryError('This image was not uploaded for the selected field',400) }
}
