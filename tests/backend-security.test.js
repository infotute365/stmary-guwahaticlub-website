import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import sharp from 'sharp'
import { checkMutationOrigin, boundedBody, validateBody, rateLimit } from '../src/server/util/requestSecurity.js'
import { validateStrongPassword } from '../src/server/util/validation.mjs'
import { processAndSaveImage, uploadPDFToLocal, deleteUploadedFile } from '../src/server/util/imageProcessor.js'
import { uploadPath, writeUpload } from '../src/server/config/localStorage.js'
import { serveUpload } from '../src/server/util/serveUpload.js'
import { toNextResponse, routeFor, handleApiRequest } from '../src/server/route-adapter.js'

test('cookie lifetime conversion and clearing match Next.js seconds', () => {
  const response = toNextResponse({ status: 200, body: {}, cookies: [{ name: 'test', value: 'ok', options: { maxAge: 900, httpOnly: true, path: '/' } }] })
  assert.match(response.headers.get('set-cookie'), /Max-Age=900/)
})

test('CSRF uses configured origin and ignores hostile forwarded hosts', () => {
  const previous = { node: process.env.NODE_ENV, origin: process.env.APP_ORIGIN }
  process.env.NODE_ENV = 'production'
  process.env.APP_ORIGIN = 'https://school.example.com'
  try {
    const request = headers => new Request('http://localhost/api/auth/login', { method: 'POST', headers })
    assert.doesNotThrow(() => checkMutationOrigin(request({ origin: 'https://school.example.com' })))
    assert.throws(() => checkMutationOrigin(request({ origin: 'https://evil.example', 'x-forwarded-host': 'evil.example' })), { status: 403 })
    assert.throws(() => checkMutationOrigin(request({ cookie: 'accessToken=x' })), { status: 403 })
    delete process.env.APP_ORIGIN
    assert.throws(() => checkMutationOrigin(request({})), /APP_ORIGIN/)
  } finally {
    if (previous.node === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previous.node
    if (previous.origin === undefined) delete process.env.APP_ORIGIN; else process.env.APP_ORIGIN = previous.origin
  }
})

test('stream limits reject actual oversized bodies without Content-Length', async () => {
  await assert.rejects(boundedBody(new Request('http://localhost/api/x', { method: 'POST', body: '0123456789' }), 5), { status: 413 })
  assert.equal((await boundedBody(new Request('http://localhost/api/x', { method: 'POST', body: '{}' }), 5)).toString(), '{}')
})

test('body validation blocks operator injection, pollution and executable media URLs', () => {
  for (const body of [{ email: { $ne: null } }, JSON.parse('{"__proto__":{}}'), { fileUrl: 'javascript:alert(1)' }, { images: ['data:text/html,evil'] }]) assert.throws(() => validateBody(body), { status: 400 })
  assert.doesNotThrow(() => validateBody({ title: 'School', images: ['/uploads/gallery/a.webp'], isActive: true }))
  assert.throws(() => validateStrongPassword('short'))
  assert.throws(() => validateStrongPassword('Aa1!' + 'x'.repeat(70)))
  assert.doesNotThrow(() => validateStrongPassword('Fixture-Only-Aa123!'))
})

test('login rate limiter rejects excess attempts and ignores untrusted forwarding', () => {
  delete globalThis.__guwahatiRateLimits
  const req = new Request('http://localhost/api/auth/login', { headers: { 'x-forwarded-for': '1.2.3.4' } })
  rateLimit(req, 'test', 2, 1000)
  rateLimit(req, 'test', 2, 1000)
  assert.throws(() => rateLimit(req, 'test', 2, 1000), { status: 429 })
})

test('persistent images and PDFs serve through stable URLs; traversal and quota are blocked', async t => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'stmary-gc-upload-test-'))
  const previous = process.env.UPLOAD_DIR
  const quota = process.env.UPLOAD_MAX_BYTES
  process.env.UPLOAD_DIR = directory
  t.after(async () => { if (previous === undefined) delete process.env.UPLOAD_DIR; else process.env.UPLOAD_DIR = previous; if (quota === undefined) delete process.env.UPLOAD_MAX_BYTES; else process.env.UPLOAD_MAX_BYTES = quota; await fs.rm(directory, { recursive: true, force: true }) })
  const buffer = await sharp({ create: { width: 20, height: 20, channels: 3, background: 'red' } }).png().toBuffer()
  const image = await processAndSaveImage({ buffer, mimetype: 'image/png', originalname: 'fixture.png' }, 'gallery')
  const context = { params: Promise.resolve({ path: image.slice('/uploads/'.length).split('/') }) }
  let response = await serveUpload(new Request(`http://localhost${image}`), context)
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('content-type'), 'image/webp')
  assert.equal((await sharp(Buffer.from(await response.arrayBuffer())).metadata()).format, 'webp')
  const webp = await sharp(buffer).webp().toBuffer()
  await processAndSaveImage({ buffer: webp, mimetype: 'image/webp', originalname: 'fixture.webp' })
  const pdf = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\n%%EOF')
  const pdfUrl = await uploadPDFToLocal({ buffer: pdf, mimetype: 'application/pdf', originalname: 'fixture.pdf' })
  response = await serveUpload(new Request(`http://localhost${pdfUrl}`, { method: 'HEAD' }), { params: { path: pdfUrl.slice(9).split('/') } })
  assert.equal(response.status, 200)
  assert.equal(await response.text(), '')
  for (const invalid of ['../outside', 'gallery/../../file', 'C:\\file', '%2e%2e/file', 'gallery/.env']) await assert.rejects(uploadPath(invalid), { status: 400 })
  assert.equal(await deleteUploadedFile('/uploads/../../package.json'), false)
  assert.equal(await deleteUploadedFile('https://evil.example/uploads/gallery/a.webp'), false)
  await assert.rejects(processAndSaveImage({ buffer: Buffer.from('executable'), mimetype: 'image/png', originalname: 'evil.png' }), { status: 400 })
  process.env.UPLOAD_MAX_BYTES = String(20 * 1024 * 1024)
  await assert.rejects(writeUpload('gallery/quota.webp', Buffer.alloc(20 * 1024 * 1024)), { status: 507 })
  assert.equal(await deleteUploadedFile(image), true)
  assert.equal((await serveUpload(new Request(`http://localhost${image}`), context)).status, 404)
})

test('all existing write routes remain protected; refresh is POST; health does not need MongoDB', async () => {
  const id = '0123456789abcdef01234567'
  for (const resource of ['circulars', 'staff', 'gallery', 'syllabus']) {
    assert.equal(routeFor('POST', [resource]).auth, true)
    assert.equal(routeFor('PUT', [resource, id]).auth, true)
    assert.equal(routeFor('DELETE', [resource, id]).auth, true)
    assert.ok(routeFor('GET', [resource]))
  }
  for (const endpoint of ['image', 'images', 'pdf']) assert.equal(routeFor('POST', ['upload', endpoint]).auth, true)
  assert.equal(routeFor('DELETE', ['upload', 'file']).auth, true)
  assert.equal(routeFor('POST', ['auth', 'refresh-token']).refresh, true)
  assert.equal(routeFor('GET', ['auth', 'refresh-token']), null)
  const response = await handleApiRequest(new Request('http://localhost/api/health'), {})
  assert.equal(response.status, 200)
  assert.equal((await response.json()).status, 'OK')
})
