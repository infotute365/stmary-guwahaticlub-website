import fs from 'node:fs/promises'
import path from 'node:path'
import { Readable } from 'node:stream'
import { uploadPath } from '../config/localStorage.js'

const types = { '.pdf': 'application/pdf', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.avif': 'image/avif' }
export async function serveUpload(request, context) {
  let file
  try {
    const params = await context.params
    const relative = params.path.join('/')
    const type = types[path.extname(relative).toLowerCase()]
    if (!type) return new Response(null, { status: 404 })
    file = await fs.open(await uploadPath(relative), 'r')
    const stat = await file.stat()
    if (!stat.isFile()) return new Response(null, { status: 404 })
    const headers = { 'Content-Type': type, 'Content-Length': String(stat.size), 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'public, max-age=3600', 'Content-Security-Policy': "default-src 'none'; sandbox" }
    if (type === 'application/pdf') headers['Content-Disposition'] = 'inline'
    if (request.method === 'HEAD') return new Response(null, { headers })
    const stream = Readable.toWeb(file.createReadStream())
    file = null // The stream owns and closes this descriptor, including cancellation.
    return new Response(stream, { headers })
  } catch (err) {
    return Response.json({ message: err.code === 'ENOENT' || err.status === 400 ? 'File not found' : 'File unavailable' }, { status: err.code === 'ENOENT' || err.status === 400 ? 404 : 503 })
  } finally { await file?.close() }
}
