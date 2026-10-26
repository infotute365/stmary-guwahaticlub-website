import sharp from 'sharp'
import { v4 as uuid } from 'uuid'
import { validateUploadBuffer } from './validation.mjs'
import { normalizeUploadPath, writeUpload, deleteUpload } from '../config/localStorage.js'
import { TryError } from './error.js'

const validate = (file, maxSize) => {
  try { validateUploadBuffer(file?.buffer, file?.mimetype, file?.originalname, { maxSize }) }
  catch (err) { throw TryError(err.message, /too large/i.test(err.message) ? 413 : 400) }
}
export const processAndSaveImage = async (file, folder = 'gallery') => {
  normalizeUploadPath(folder)
  validate(file, 5 * 1024 * 1024)
  if (!file.mimetype.startsWith('image/')) throw TryError('Invalid image file', 400)
  let processed
  try {
    const image = sharp(file.buffer, { limitInputPixels: 40000000 })
    const metadata = await image.metadata()
    if (!metadata.width || !metadata.height) throw new Error('Invalid image')
    const resize = metadata.width > 360 || metadata.height > 360 ? { width: 360, height: 360, fit: 'cover', position: 'center' } : {}
    processed = await image.resize(resize).webp({ quality: 80 }).toBuffer()
  } catch { throw TryError('Invalid image file', 400) }
  return writeUpload(`${folder}/${uuid()}.webp`, processed)
}
export const uploadPDFToLocal = async (file, folder = 'syllabus') => {
  normalizeUploadPath(folder)
  validate(file, 15 * 1024 * 1024)
  if (file.mimetype !== 'application/pdf') throw TryError('Invalid PDF file', 400)
  return writeUpload(`${folder}/${uuid()}.pdf`, file.buffer)
}
export const deleteUploadedFile = deleteUpload
export const deleteMultipleImages = async paths => {
  let deleted = 0
  for (const item of paths) if (await deleteUpload(item)) deleted++
  return deleted
}
