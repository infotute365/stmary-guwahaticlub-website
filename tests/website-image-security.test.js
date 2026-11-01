import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import sharp from 'sharp'
import { processWebsiteImage, validateWebsiteImageReference } from '../src/server/util/websiteImageProcessor.js'
import { getContentField } from '../src/server/util/websiteContentPolicy.js'
import { uploadPath } from '../src/server/config/localStorage.js'

const field=getContentField('global.navbar.navbar.src',{editable:true})
test('website images accept each supported format without cropping, upscaling or exposing metadata',async t=>{
  const directory=await fs.mkdtemp(path.join(os.tmpdir(),'stmary-gc-final-images-'))
  const previous=process.env.UPLOAD_DIR
  process.env.UPLOAD_DIR=directory
  t.after(async()=>{
    if(previous===undefined)delete process.env.UPLOAD_DIR;else process.env.UPLOAD_DIR=previous
    const target=path.resolve(directory)
    assert.equal(path.dirname(target),path.resolve(os.tmpdir()))
    assert.ok(path.basename(target).startsWith('stmary-gc-final-images-'))
    await fs.rm(target,{recursive:true,force:true})
  })
  for(const [format,mimetype,extension] of [['jpeg','image/jpeg','jpg'],['png','image/png','png'],['webp','image/webp','webp']]) {
    const buffer=await sharp({create:{width:900,height:300,channels:4,background:'#7a0c1e'}}).toFormat(format).withMetadata().toBuffer()
    const image=await processWebsiteImage({buffer,mimetype,originalname:`fixture.${extension}`},field)
    assert.equal(image.width,900);assert.equal(image.height,300)
    assert.deepEqual(image.variants.map(variant=>variant.width),[640,900])
    for(const variant of image.variants) {
      const info=await sharp(await fs.readFile(await uploadPath(variant.url.slice('/uploads/'.length)))).metadata()
      assert.equal(info.format,'webp');assert.ok(Math.abs(info.width/info.height-3)<.01)
      assert.equal(info.exif,undefined);assert.equal(info.icc,undefined)
    }
    await validateWebsiteImageReference(field,image.value)
  }
})

test('website image decoder rejects excessive dimensions, excessive pixel count and animation',async()=>{
  const tooWide=await sharp({create:{width:20001,height:1,channels:3,background:'red'}}).png().toBuffer()
  await assert.rejects(processWebsiteImage({buffer:tooWide,mimetype:'image/png',originalname:'wide.png'},field),{status:400})
  const tooManyPixels=await sharp({create:{width:6500,height:6500,channels:3,background:'red'}}).png().toBuffer()
  await assert.rejects(processWebsiteImage({buffer:tooManyPixels,mimetype:'image/png',originalname:'pixels.png'},field),{status:400})
  const pixels=Buffer.alloc(20*40*3)
  pixels.fill(255,0,20*20*3)
  const animated=await sharp(pixels,{raw:{width:20,height:40,channels:3,pageHeight:20}}).webp({loop:0,delay:[100,100]}).toBuffer()
  assert.equal((await sharp(animated,{animated:true}).metadata()).pages,2,'Fixture must genuinely contain two frames')
  await assert.rejects(processWebsiteImage({buffer:animated,mimetype:'image/webp',originalname:'animation.webp'},field),{status:400})
})

test('website images reject executable extensions, spoofed signatures and oversized files before storage',async()=>{
  const buffer=await sharp({create:{width:10,height:10,channels:3,background:'red'}}).png().toBuffer()
  for(const originalname of ['fixture.png.exe','fixture.svg','fixture.html'])await assert.rejects(processWebsiteImage({buffer,mimetype:'image/png',originalname},field),{status:400})
  await assert.rejects(processWebsiteImage({buffer,mimetype:'image/jpeg',originalname:'spoof.jpg'},field),{status:400})
  await assert.rejects(processWebsiteImage({buffer:Buffer.alloc(10*1024*1024+1),mimetype:'image/png',originalname:'large.png'},field),{status:413})
})
