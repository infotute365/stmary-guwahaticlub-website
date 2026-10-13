// import sharp from 'sharp'
// import path from 'path'
// import fs from 'fs'
// import { v4 as uuid } from 'uuid'

// const TARGET_SIZE = 360
// const QUALITY = 80

// export const processAndSaveImage = async (file, folder = 'gallery') => {
//     try {
//         // Validate input
//         if (!file) {
//             throw new Error('No file provided')
//         }

//         // Determine the source path
//         const sourcePath = file.path || file.buffer
//         if (!sourcePath) {
//             throw new Error('No file path or buffer found')
//         }

//         // Ensure the upload directory exists
//         const uploadDir = path.join(process.cwd(), 'uploads', folder)
//         if (!fs.existsSync(uploadDir)) {
//             fs.mkdirSync(uploadDir, { recursive: true })
//         }

//         // Generate a unique filename with .webp extension
//         const filename = `${uuid()}.webp`
//         const outputPath = path.join(uploadDir, filename)

//         // Process image with sharp
//         const image = sharp(sourcePath)
//         const metadata = await image.metadata()

//         // Resize only if larger than target size
//         let resizeOptions = {}
//         if (metadata.width > TARGET_SIZE || metadata.height > TARGET_SIZE) {
//             resizeOptions = {
//                 width: TARGET_SIZE,
//                 height: TARGET_SIZE,
//                 fit: 'cover',
//                 position: 'center'
//             }
//         }

//         // Save as WebP with compression
//         await image
//             .resize(resizeOptions)
//             .webp({ quality: QUALITY })
//             .toFile(outputPath)

//         // Clean up the temporary multer file (if it exists)
//         if (file.path && fs.existsSync(file.path)) {
//             fs.unlinkSync(file.path)
//         }

//         // Return the public URL path
//         return `/uploads/${folder}/${filename}`
//     } catch (err) {
//         console.error('Image processing error:', err.message)
//         // If a temp file exists, try to clean it up
//         if (file?.path && fs.existsSync(file.path)) {
//             try { fs.unlinkSync(file.path) } catch (e) {}
//         }
//         throw err
//     }
// }

// export const deleteImage = (imagePath) => {
//     try {
//         if (!imagePath) return false
//         // Remove leading slash if present
//         const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath
//         const fullPath = path.join(process.cwd(), cleanPath)
//         if (fs.existsSync(fullPath)) {
//             fs.unlinkSync(fullPath)
//             return true
//         }
//         return false
//     } catch (err) {
//         console.error('Error deleting image:', err.message)
//         return false
//     }
// }

// export const deleteMultipleImages = (imagePaths) => {
//     let deleted = 0
//     for (const imgPath of imagePaths) {
//         if (deleteImage(imgPath)) deleted++
//     }
//     return deleted
// }













import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { v4 as uuid } from 'uuid'
import { validateUploadBuffer } from './validation.mjs'

const TARGET_SIZE = 360
const QUALITY = 80
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const MAX_PDF_SIZE = 15 * 1024 * 1024
const UPLOAD_ROOT = path.resolve(process.cwd(), 'public', 'uploads')

const normalizeUploadPath = (relativePath) => {
  const normalized = path.posix.normalize(String(relativePath).replace(/\\/g, '/').replace(/^\/+/, ''))
  if (!normalized || normalized === '.' || normalized === '..' || normalized.startsWith('../')) {
    throw new Error('Invalid upload path')
  }
  return normalized
}

const getUploadPath = (relativePath) => {
  const normalized = normalizeUploadPath(relativePath)
  const fullPath = path.resolve(UPLOAD_ROOT, ...normalized.split('/'))
  if (!fullPath.startsWith(`${UPLOAD_ROOT}${path.sep}`)) throw new Error('Invalid upload path')
  return fullPath
}

const getPublicUploadUrl = (relativePath) => `/uploads/${relativePath.split('/').map(encodeURIComponent).join('/')}`

export const processAndSaveImage = async (file, folder = 'gallery') => {
  if (!file?.buffer) throw new Error('No file buffer provided')

  validateUploadBuffer(file.buffer, file.mimetype, file.originalname, {
    maxSize: MAX_IMAGE_SIZE,
  })

  const image = sharp(file.buffer)
  const metadata = await image.metadata()
  if (!metadata.width || !metadata.height) {
    throw new Error('Invalid image file')
  }

  const resizeOptions = metadata.width > TARGET_SIZE || metadata.height > TARGET_SIZE
    ? { width: TARGET_SIZE, height: TARGET_SIZE, fit: 'cover', position: 'center' }
    : {}

  const processedBuffer = await image.resize(resizeOptions).webp({ quality: QUALITY }).toBuffer()
  const filename = `${uuid()}.webp`
  const relativePath = normalizeUploadPath(`${folder}/${filename}`)
  const outputPath = getUploadPath(relativePath)

  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, processedBuffer)
  return getPublicUploadUrl(relativePath)
}

export const uploadPDFToLocal = async (file, folder = 'syllabus') => {
  if (!file?.buffer) throw new Error('No PDF buffer provided')

  validateUploadBuffer(file.buffer, file.mimetype || 'application/pdf', file.originalname || 'document.pdf', {
    maxSize: MAX_PDF_SIZE,
  })

  const extension = file.originalname ? path.extname(file.originalname).toLowerCase() : '.pdf'
  const safeExtension = extension === '.pdf' ? '.pdf' : '.pdf'
  const filename = `${uuid()}${safeExtension}`
  const relativePath = normalizeUploadPath(`${folder}/${filename}`)
  const outputPath = getUploadPath(relativePath)

  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, file.buffer)
  return getPublicUploadUrl(relativePath)
}

export const deleteUploadedFile = async (fileUrl) => {
  if (!fileUrl) return false

  try {
    const pathname = new URL(fileUrl, 'http://localhost').pathname
    if (!pathname.startsWith('/uploads/')) return false

    const relativePath = decodeURIComponent(pathname.slice('/uploads/'.length))
    await fs.unlink(getUploadPath(relativePath))
    return true
  } catch (error) {
    if (error.code !== 'ENOENT') {
      return false
    }
    return false
  }
}

export const deleteMultipleImages = async (imagePaths) => {
  let deleted = 0
  for (const imagePath of imagePaths) {
    if (await deleteUploadedFile(imagePath)) deleted++
  }
  return deleted
}