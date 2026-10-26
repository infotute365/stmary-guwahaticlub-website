import fs from 'node:fs/promises'
import path from 'node:path'
import { TryError } from '../util/error.js'

export function uploadRoot() {
  const configured = process.env.UPLOAD_DIR?.trim()
  if (process.env.NODE_ENV === 'production' && (!configured || !path.isAbsolute(configured) || path.resolve(configured) === process.cwd() || path.resolve(configured).startsWith(`${process.cwd()}${path.sep}`))) throw new Error('Production UPLOAD_DIR must be an absolute persistent directory outside the release')
  return path.resolve(configured || path.join(process.cwd(), 'public', 'uploads'))
}
export function normalizeUploadPath(value) {
  if (typeof value !== 'string' || !value || value.length > 1024 || /[\\\x00-\x1f:%?#]/.test(value)) throw TryError('Invalid upload path', 400)
  const parts = value.split('/')
  if (parts.some(part => !part || part === '.' || part === '..' || part.startsWith('.') || !/^[\p{L}\p{N}_ .()-]+$/u.test(part))) throw TryError('Invalid upload path', 400)
  return parts.join('/')
}
export const publicUploadUrl = relative => `/uploads/${normalizeUploadPath(relative).split('/').map(encodeURIComponent).join('/')}`
export async function uploadPath(relative, create = false) {
  const root = uploadRoot()
  const normalized = normalizeUploadPath(relative)
  if (create) await fs.mkdir(root, { recursive: true })
  const realRoot = await fs.realpath(root)
  let current = root
  const parts = normalized.split('/')
  for (const [index, part] of parts.entries()) {
    current = path.join(current, part)
    try {
      const stat = await fs.lstat(current)
      if (stat.isSymbolicLink()) throw TryError('Invalid upload path', 400)
      const real = await fs.realpath(current)
      if (!real.startsWith(`${realRoot}${path.sep}`)) throw TryError('Invalid upload path', 400)
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
      if (!create) throw err
      if (index < parts.length - 1) await fs.mkdir(current)
    }
  }
  return current
}
async function storageBytes(directory) {
  let total = 0
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const name = path.join(directory, entry.name)
    if (entry.isDirectory()) total += await storageBytes(name)
    else if (entry.isFile()) total += (await fs.stat(name)).size
  }
  return total
}
// PM2 runs a single process; serialize the quota check with each write.
export async function writeUpload(relative, buffer) {
  const previous = globalThis.__guwahatiUploadWrite || Promise.resolve()
  const task = previous.catch(() => {}).then(async () => {
    const output = await uploadPath(relative, true)
    const quota = Number(process.env.UPLOAD_MAX_BYTES || 1024 * 1024 * 1024)
    if (!Number.isSafeInteger(quota) || quota < 20 * 1024 * 1024) throw new Error('Invalid UPLOAD_MAX_BYTES')
    if (await storageBytes(uploadRoot()) + buffer.length > quota) throw TryError('Upload storage limit reached', 507)
    await fs.writeFile(output, buffer, { flag: 'wx', mode: 0o640 })
    return publicUploadUrl(relative)
  })
  globalThis.__guwahatiUploadWrite = task.then(() => {}, () => {})
  return task
}
export async function deleteUpload(fileUrl) {
  if (typeof fileUrl !== 'string') return false
  try {
    if (/^https?:\/\//i.test(fileUrl)) {
      const url = new URL(fileUrl)
      if (!process.env.APP_ORIGIN || url.origin !== new URL(process.env.APP_ORIGIN).origin) return false
      fileUrl = url.pathname
    }
    fileUrl = fileUrl.replace(/^\/?api(?=\/uploads\/)/, '').replace(/^uploads\//, '/uploads/')
    if (!fileUrl.startsWith('/uploads/')) return false
    const relative = decodeURIComponent(fileUrl.slice('/uploads/'.length))
    await fs.unlink(await uploadPath(relative))
    return true
  } catch (err) {
    if (err.code === 'ENOENT' || err.status === 400) return false
    throw err
  }
}
