import { NextResponse } from 'next/server.js'
import connectDB from './config/database.js'
import { readAccessUser, sessionUser } from './config/auth.js'
import { TryError } from './util/error.js'
import { checkMutationOrigin, rateLimit, boundedBody, validateBody } from './util/requestSecurity.js'
import { resolveRoutePath } from './route-path.js'
import AuthMiddleware from './middleware/auth.middleware.js'
import RefreshMiddleware from './middleware/refresh.middleware.js'
import { login, logout, getSession, refreshToken, changePassword } from './controller/auth.controller.js'
import { createCircular, getCirculars, getCircularById, updateCircular, deleteCircular } from './controller/circular.controller.js'
import { createStaff, getStaff, getStaffById, updateStaff, deleteStaff } from './controller/staff.controller.js'
import { createEvent, getEvents, getEventById, getEventBySlug, updateEvent, deleteEvent, addImagesToEvent, deleteImageFromEvent, updateImageTitle } from './controller/gallery.controller.js'
import { createSyllabus, getSyllabus, getSyllabusById, getAcademicYears, getClasses, getStreams, updateSyllabus, deleteSyllabus } from './controller/syllabus.controller.js'
import { uploadImage, uploadMultipleImages, uploadPDF, deleteFile } from './controller/upload.controller.js'

const normalizeCookieOptions = (options = {}) => ({
  httpOnly: options.httpOnly ?? true,
  // Express uses milliseconds; Next.js ResponseCookies uses seconds.
  maxAge: options.maxAge === undefined ? undefined : Math.floor(options.maxAge / 1000),
  secure: process.env.NODE_ENV === 'production' || options.secure === true,
  sameSite: options.sameSite ?? 'lax',
  path: options.path ?? '/',
})

const createMockResponse = () => {
  const state = { status: 200, body: null, cookies: [] }
  return {
    state,
    status(code) { state.status = code; return this },
    json(body) { state.body = body; return this },
    cookie(name, value, options = {}) {
      state.cookies.push({ name, value, options: normalizeCookieOptions(options) }); return this
    },
    clearCookie(name, options = {}) {
      state.cookies.push({ name, value: '', options: { ...normalizeCookieOptions(options), maxAge: 0 } }); return this
    },
    setHeader() { return this },
  }
}

async function parseRequest(request, params, parseBody = true) {
  const url = new URL(request.url)
  const cookies = {}
  for (const item of (request.headers.get('cookie') || '').split(';')) {
    if (!item.trim()) continue
    const [name, ...value] = item.trim().split('=')
    try { cookies[name] = decodeURIComponent(value.join('=')) } catch { throw TryError('Invalid cookie', 400) }
  }

  let body = {}
  let file
  let files
  const contentType = request.headers.get('content-type') || ''

  if (parseBody && !['GET', 'HEAD'].includes(request.method)) {
    const multipart = contentType.includes('multipart/form-data')
    if (multipart && !url.pathname.startsWith('/api/upload/')) throw TryError('Unsupported content type', 415)
    const bytes = await boundedBody(request, multipart ? 21 * 1024 * 1024 : 128 * 1024)
    if (contentType.includes('multipart/form-data')) {
      let form
      try { form = await new Response(bytes, { headers: { 'content-type': contentType } }).formData() }
      catch { throw TryError('Invalid multipart request', 400) }
      const entries = [...form.entries()]
      const uploads = entries.filter(([, value]) => typeof value !== 'string')
      const multiple = url.pathname.endsWith('/upload/images')
      if (entries.length > 8 || uploads.length > (multiple ? 4 : 1)) throw TryError('Too many uploaded files', 400)
      const asFile = async (value, maxSize = Infinity) => {
        if (!value || typeof value.arrayBuffer !== 'function') return null
        const fileSize = Number(value.size || 0)
        if (!Number.isFinite(fileSize) || fileSize <= 0) return null
        if (fileSize > maxSize) {
          throw TryError('File too large', 413)
        }
        return { buffer: Buffer.from(await value.arrayBuffer()), originalname: value.name, mimetype: value.type, size: fileSize }
      }

      const uploadMaxImage = 5 * 1024 * 1024
      const uploadMaxPdf = 15 * 1024 * 1024

      file = await asFile(form.get('image'), uploadMaxImage) || await asFile(form.get('pdf'), uploadMaxPdf) || undefined
      if (!file) {
        for (const [, value] of form.entries()) {
          file = await asFile(value, value.type === 'application/pdf' ? uploadMaxPdf : uploadMaxImage)
          if (file) break
        }
      }

      const all = []
      for (const value of form.getAll('images')) {
        const parsed = await asFile(value, uploadMaxImage)
        if (parsed) all.push(parsed)
      }
      if (all.length) files = all
    } else {
      if (bytes.length && !contentType.includes('application/json')) throw TryError('Expected application/json', 415)
      try { body = bytes.length ? JSON.parse(bytes.toString('utf8')) : {} }
      catch { throw TryError('Invalid JSON body', 400) }
      validateBody(body)
    }
  }

  return {
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    body,
    params,
    query: Object.fromEntries(url.searchParams.entries()),
    cookies,
    file,
    files,
    session: undefined,
  }
}

export function routeFor(method, parts) {
  const [resource, first, second, third] = parts
  if (resource === 'health' && method === 'GET') return { handler: (_req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }) }

  if (resource === 'auth') {
    if (method === 'POST' && first === 'login') return { handler: login }
    if (method === 'POST' && first === 'logout') return { handler: logout }
    if (method === 'GET' && first === 'session') return { handler: getSession }
    if (method === 'POST' && first === 'refresh-token') return { handler: refreshToken, refresh: true }
    if (method === 'PUT' && first === 'change-password') return { handler: changePassword, auth: true }
  }

  if (resource === 'circulars') {
    if (method === 'GET' && !first) return { handler: getCirculars }
    if (method === 'GET' && first) return { handler: getCircularById, params: { id: first } }
    if (method === 'POST' && !first) return { handler: createCircular, auth: true }
    if (method === 'PUT' && first) return { handler: updateCircular, auth: true, params: { id: first } }
    if (method === 'DELETE' && first) return { handler: deleteCircular, auth: true, params: { id: first } }
  }

  if (resource === 'staff') {
    if (method === 'GET' && !first) return { handler: getStaff }
    if (method === 'GET' && first) return { handler: getStaffById, params: { id: first } }
    if (method === 'POST' && !first) return { handler: createStaff, auth: true }
    if (method === 'PUT' && first) return { handler: updateStaff, auth: true, params: { id: first } }
    if (method === 'DELETE' && first) return { handler: deleteStaff, auth: true, params: { id: first } }
  }

  if (resource === 'gallery') {
    if (method === 'GET' && first === 'slug' && second) return { handler: getEventBySlug, params: { slug: second } }
    if (method === 'GET' && !first) return { handler: getEvents }
    if (method === 'GET' && first) return { handler: getEventById, params: { id: first } }
    if (method === 'POST' && first && second === 'images') return { handler: addImagesToEvent, auth: true, params: { id: first } }
    if (method === 'POST' && !first) return { handler: createEvent, auth: true }
    if (method === 'PUT' && first && second === 'images' && third) return { handler: updateImageTitle, auth: true, params: { eventId: first, imageId: third } }
    if (method === 'PUT' && first) return { handler: updateEvent, auth: true, params: { id: first } }
    if (method === 'DELETE' && first && second === 'images' && third) return { handler: deleteImageFromEvent, auth: true, params: { eventId: first, imageId: third } }
    if (method === 'DELETE' && first) return { handler: deleteEvent, auth: true, params: { id: first } }
  }

  if (resource === 'syllabus') {
    if (method === 'GET' && first === 'academic-years') return { handler: getAcademicYears }
    if (method === 'GET' && first === 'classes') return { handler: getClasses }
    if (method === 'GET' && first === 'streams') return { handler: getStreams }
    if (method === 'GET' && !first) return { handler: getSyllabus }
    if (method === 'GET' && first) return { handler: getSyllabusById, params: { id: first } }
    if (method === 'POST' && !first) return { handler: createSyllabus, auth: true }
    if (method === 'PUT' && first) return { handler: updateSyllabus, auth: true, params: { id: first } }
    if (method === 'DELETE' && first) return { handler: deleteSyllabus, auth: true, params: { id: first } }
  }

  if (resource === 'upload') {
    if (method === 'POST' && first === 'image') return { handler: uploadImage, auth: true }
    if (method === 'POST' && first === 'images') return { handler: uploadMultipleImages, auth: true }
    if (method === 'POST' && first === 'pdf') return { handler: uploadPDF, auth: true }
    if (method === 'DELETE' && first === 'file') return { handler: deleteFile, auth: true }
  }

  return null
}

export function toNextResponse(state) {
  const response = NextResponse.json(state.body ?? {}, { status: state.status })
  response.headers.set('Cache-Control', 'no-store')
  for (const cookie of state.cookies) response.cookies.set(cookie.name, cookie.value, cookie.options)
  return response
}

export async function handleApiRequest(request, context) {
  let uploadSlot = false
  try {
    const resolvedPath = await resolveRoutePath(request, context)
    const route = routeFor(request.method, resolvedPath)
    if (!route) return NextResponse.json({ message: 'Endpoint not found' }, { status: 404 })
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) checkMutationOrigin(request)
    if (resolvedPath.join('/') === 'auth/login') rateLimit(request, 'login', 10, 15 * 60 * 1000)
    if (resolvedPath.join('/') === 'auth/refresh-token') rateLimit(request, 'refresh', 60, 60 * 1000)
    if (resolvedPath[0] === 'upload') rateLimit(request, 'upload', 60, 60 * 1000)
    const req = await parseRequest(request, route.params || {}, false)
    const res = createMockResponse()
    if (resolvedPath[0] !== 'health') {
      try { await connectDB() } catch { throw TryError('Database unavailable', 503) }
    }
    let nextCalled = !route.auth && !route.refresh
    const next = () => { nextCalled = true }

    if (route.auth) await AuthMiddleware(req, res, next)
    if (route.refresh) await RefreshMiddleware(req, res, next)
    if (!nextCalled) return toNextResponse(res.state)
    if (request.method === 'GET' && !['auth', 'health'].includes(resolvedPath[0]) && req.cookies.accessToken) {
      try { req.session = sessionUser(await readAccessUser(req.cookies.accessToken)) }
      catch (err) { if (err.status !== 401) throw err }
    }
    if (resolvedPath[0] === 'upload' && request.method === 'POST') {
      if ((globalThis.__guwahatiActiveUploads || 0) >= 2) throw TryError('Too many concurrent uploads', 429)
      globalThis.__guwahatiActiveUploads = (globalThis.__guwahatiActiveUploads || 0) + 1
      uploadSlot = true
    }
    if (!['GET', 'HEAD'].includes(request.method)) Object.assign(req, await parseRequest(request, route.params || {}), { session: req.session })
    for (const [name, value] of Object.entries(req.params)) {
      if (name.toLowerCase().endsWith('id') && !/^[a-f\d]{24}$/i.test(value)) throw TryError('Invalid ID', 400)
    }
    await route.handler(req, res)
    return toNextResponse(res.state)
  } catch (error) {
    return NextResponse.json({ message: error.status ? error.message : 'Internal server error' }, { status: error.status || 500, headers: { 'Cache-Control': 'no-store' } })
  } finally {
    if (uploadSlot) globalThis.__guwahatiActiveUploads--
  }
}
