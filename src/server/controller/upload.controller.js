// import { CatchError, TryError } from "../util/error.js"
// import { processAndSaveImage } from "../util/imageProcessor.js"
// import fs from 'fs'
// import path from 'path'
// import { v4 as uuid } from 'uuid'

// export const uploadImage = async (req, res) => {
//     try {
//         if (!req.session) {
//             throw TryError("Unauthorized", 401)
//         }

//         if (!req.file) {
//             throw TryError("No image file provided", 400)
//         }

//         const folder = req.query.folder || 'gallery'
//         const imagePath = await processAndSaveImage(req.file, folder)

//         res.json({
//             message: "Image uploaded successfully",
//             path: imagePath
//         })
//     }
//     catch (err) {
//         CatchError(err, res, "Failed to upload image")
//     }
// }

// export const uploadMultipleImages = async (req, res) => {
//     try {
//         if (!req.session) {
//             throw TryError("Unauthorized", 401)
//         }

//         if (!req.files || req.files.length === 0) {
//             throw TryError("No images provided", 400)
//         }

//         if (req.files.length > 4) {
//             throw TryError("Maximum 4 images can be uploaded at once", 400)
//         }

//         const folder = req.query.folder || 'gallery'
//         const results = []

//         for (const file of req.files) {
//             const imagePath = await processAndSaveImage(file, folder)
//             results.push(imagePath)
//         }

//         res.json({
//             message: `${results.length} images uploaded successfully`,
//             images: results
//         })
//     }
//     catch (err) {
//         CatchError(err, res, "Failed to upload images")
//     }
// }

// export const uploadPDF = async (req, res) => {
//     try {
//         if (!req.session) {
//             throw TryError("Unauthorized", 401)
//         }

//         if (!req.file) {
//             throw TryError("No PDF file provided", 400)
//         }

//         const folder = req.query.folder || 'syllabus'
//         const uploadDir = path.join(process.cwd(), 'uploads', folder)
        
//         if (!fs.existsSync(uploadDir)) {
//             fs.mkdirSync(uploadDir, { recursive: true })
//         }

//         const ext = path.extname(req.file.originalname)
//         const filename = `${uuid()}${ext}`
//         const filePath = path.join(uploadDir, filename)

//         // Move file to destination
//         fs.renameSync(req.file.path, filePath)

//         const url = `/uploads/${folder}/${filename}`

//         res.json({
//             message: "PDF uploaded successfully",
//             path: url,
//             filename: req.file.originalname
//         })
//     }
//     catch (err) {
//         CatchError(err, res, "Failed to upload PDF")
//     }
// }

// export const deleteFile = async (req, res) => {
//     try {
//         if (!req.session) {
//             throw TryError("Unauthorized", 401)
//         }

//         const { filePath } = req.body

//         if (!filePath) {
//             throw TryError("File path is required", 400)
//         }

//         const fullPath = path.join(process.cwd(), filePath)
        
//         if (fs.existsSync(fullPath)) {
//             fs.unlinkSync(fullPath)
//             res.json({ message: "File deleted successfully" })
//         } else {
//             throw TryError("File not found", 404)
//         }
//     }
//     catch (err) {
//         CatchError(err, res, "Failed to delete file")
//     }
// }




import { CatchError, TryError } from "../util/error.js"
import {
  processAndSaveImage,
  uploadPDFToLocal,
  deleteUploadedFile
} from "../util/imageProcessor.js"

// Website revisions retain their immutable image families. Existing Gallery,
// Staff and Syllabus tools cannot overwrite or delete that reserved namespace.
const protectWebsiteFolder = folder => {
  if (typeof folder === 'string' && /^website(?:\/|$)/i.test(folder)) throw TryError('Use the website image editor for this storage area',403)
}

export const uploadImage = async (req, res) => {
  try {
    if (!req.session) throw TryError("Unauthorized", 401)
    if (!req.file) throw TryError("No image file provided", 400)

    const folder = req.query.folder || 'gallery'
    protectWebsiteFolder(folder)
    const imagePath = await processAndSaveImage(req.file, folder)

    res.json({
      message: "Image uploaded successfully",
      path: imagePath
    })
  } catch (err) {
    CatchError(err, res, "Failed to upload image")
  }
}

export const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.session) throw TryError("Unauthorized", 401)
    if (!req.files || req.files.length === 0) throw TryError("No images provided", 400)
    if (req.files.length > 4) throw TryError("Maximum 4 images can be uploaded at once", 400)

    const folder = req.query.folder || 'gallery'
    protectWebsiteFolder(folder)
    const results = []
    for (const file of req.files) {
      const imagePath = await processAndSaveImage(file, folder)
      results.push(imagePath)
    }

    res.json({
      message: `${results.length} images uploaded successfully`,
      images: results
    })
  } catch (err) {
    CatchError(err, res, "Failed to upload images")
  }
}

export const uploadPDF = async (req, res) => {
  try {
    if (!req.session) throw TryError("Unauthorized", 401)
    if (!req.file) throw TryError("No PDF file provided", 400)

    const folder = req.query.folder || 'syllabus'
    protectWebsiteFolder(folder)
    const pdfUrl = await uploadPDFToLocal(req.file, folder)

    res.json({
      message: "PDF uploaded successfully",
      path: pdfUrl,
      filename: req.file.originalname
    })
  } catch (err) {
    CatchError(err, res, "Failed to upload PDF")
  }
}

export const deleteFile = async (req, res) => {
  try {
    if (!req.session) throw TryError("Unauthorized", 401)
    const { filePath } = req.body
    if (!filePath) throw TryError("File path is required", 400)
    let inspectedPath=filePath
    if(typeof inspectedPath==='string')try{inspectedPath=decodeURIComponent(inspectedPath)}catch{ /* Existing storage validation handles malformed paths. */ }
    if (typeof inspectedPath === 'string' && /^(?:https?:\/\/[^/]+)?\/?(?:api\/)?uploads\/website\//i.test(inspectedPath)) throw TryError('Website images are retained for revision rollback',403)

    const deleted = await deleteUploadedFile(filePath)
    if (deleted) {
      res.json({ message: "File deleted successfully" })
    } else {
      throw TryError("File not found or could not be deleted", 404)
    }
  } catch (err) {
    CatchError(err, res, "Failed to delete file")
  }
}
