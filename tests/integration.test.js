import test from 'node:test'
import assert from 'node:assert/strict'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import sharp from 'sharp'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import connectDB from '../src/server/config/database.js'
import Auth from '../src/server/model/auth.model.js'
import { provisionAdmin } from '../src/server/util/provisionAdmin.js'
import { handleApiRequest } from '../src/server/route-adapter.js'
import { serveUpload } from '../src/server/util/serveUpload.js'

let testUri = process.env.TEST_MONGODB_URI

test('disposable MongoDB: administrator lifecycle, every CRUD module, uploads and recovery', { skip: !testUri }, async t => {
  const parsed = new URL(testUri)
  assert.match(parsed.pathname, /^\/stmary_gc_test_[a-z\d_]+$/i, 'Only an explicitly named disposable test database may be used')
  parsed.pathname += `_${process.pid}_${Date.now()}`
  testUri = parsed.toString()
  process.env.MONGODB_URI = testUri
  process.env.JWT_SECRET = 'fixture-only-secret-for-tests-abcdefghijklmnopqrstuvwxyz'
  process.env.APP_ORIGIN = 'http://localhost'
  process.env.NODE_ENV = 'test'
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'stmary-gc-integration-'))
  process.env.UPLOAD_DIR = directory
  const jar = new Map()
  const email = 'fixture-admin@example.com'
  const password = 'Fixture-Only-Aa123!'
  await connectDB()
  t.after(async () => {
    await mongoose.disconnect()
    process.env.MONGODB_URI = testUri
    await connectDB()
    await mongoose.connection.dropDatabase()
    await mongoose.disconnect()
    await fs.rm(directory, { recursive: true, force: true })
  })
  async function call(method, route, body, authenticated = true) {
    const headers = { origin: 'http://localhost' }
    if (authenticated && jar.size) headers.cookie = [...jar].map(([name, value]) => `${name}=${value}`).join('; ')
    let data
    if (body instanceof FormData) data = body
    else if (!['GET', 'HEAD'].includes(method)) { data = JSON.stringify(body || {}); headers['content-type'] = 'application/json' }
    const response = await handleApiRequest(new Request(`http://localhost/api/${route}`, { method, headers, body: data }), {})
    for (const cookie of response.cookies.getAll()) { if (cookie.value) jar.set(cookie.name, cookie.value); else jar.delete(cookie.name) }
    return { status: response.status, data: await response.json(), headers: response.headers }
  }
  let admin
  await t.test('seed is idempotent, bcrypt hashes passwords, reset is explicit and initial seed refuses another admin', async () => {
    assert.match(await provisionAdmin({ email, password }), /created/)
    admin = await Auth.findOne({ email }).select('+password')
    assert.notEqual(admin.password, password)
    assert.equal(await bcrypt.compare(password, admin.password), true)
    const hash = admin.password
    await provisionAdmin({ email, password: 'Different-Fixture-Aa123!' })
    assert.equal((await Auth.findOne({ email }).select('+password')).password, hash)
    assert.equal(await Auth.countDocuments(), 1)
    await assert.rejects(provisionAdmin({ email: 'another@example.com', password }), /already exists/)
    await assert.rejects(provisionAdmin({ email: 'missing@example.com', password, reset: true }), /does not exist/)
    await assert.rejects(provisionAdmin({ email, password: 'weak' }), /Password/)
  })
  await t.test('login, safe response, cookie expiry, session, wrong credentials and roles', async () => {
    const bad = await call('POST', 'auth/login', { email, password: 'wrong' }, false)
    const unknown = await call('POST', 'auth/login', { email: 'unknown@example.com', password: 'wrong' }, false)
    assert.equal(bad.status, 401)
    assert.deepEqual(bad.data, unknown.data)
    const result = await call('POST', 'auth/login', { email, password }, false)
    assert.equal(result.status, 200)
    assert.deepEqual(Object.keys(result.data).sort(), ['message', 'user'])
    assert.equal(result.data.user.role, 'super-admin')
    assert.match(result.headers.get('set-cookie'), /Max-Age=900;/)
    assert.match(result.headers.get('set-cookie'), /Max-Age=604800;/)
    assert.match(result.headers.get('set-cookie'), /HttpOnly/)
    const stored = await Auth.findById(admin._id).select('+refreshToken')
    assert.match(stored.refreshToken, /^sha256:/)
    assert.notEqual(stored.refreshToken, jar.get('refreshToken'))
    assert.equal((await call('GET', 'auth/session')).data.email, email)
    await Auth.updateOne({ _id: admin._id }, { $set: { isActive: false } })
    assert.equal((await call('GET', 'auth/session')).status, 401)
    await Auth.updateOne({ _id: admin._id }, { $set: { isActive: true } })
  })
  await t.test('all unauthorized mutations are rejected and public reading remains accessible', async () => {
    const id = '0123456789abcdef01234567'
    for (const resource of ['circulars', 'staff', 'gallery', 'syllabus']) {
      assert.equal((await call('GET', resource, null, false)).status, 200)
      for (const [method, route] of [['POST', resource], ['PUT', `${resource}/${id}`], ['DELETE', `${resource}/${id}`]]) assert.equal((await call(method, route, {}, false)).status, 401)
    }
    for (const route of ['upload/image', 'upload/images', 'upload/pdf']) assert.equal((await call('POST', route, {}, false)).status, 401)
    assert.equal((await call('DELETE', 'upload/file', { filePath: '/uploads/a.pdf' }, false)).status, 401)
  })
  await t.test('circular, staff and syllabus create/read/update/filter/delete retain response fields and draft visibility', async () => {
    const cases = [
      ['circulars', 'circular', { title: 'Fixture notice', content: 'Fixture only', isPublished: false }, { title: 'Updated fixture' }],
      ['staff', 'staff', { name: 'Fixture teacher', designation: 'Teacher', category: 'primary', staffType: 'teaching', qualification: 'Fixture degree', isActive: false }, { name: 'Updated fixture' }],
      ['syllabus', 'syllabus', { academicYear: '2098-2099', class: '11', stream: 'science', fileUrl: '/uploads/syllabus/fixture.pdf', isPublished: false }, { fileName: 'Updated fixture', stream: 'science' }],
    ]
    for (const [resource, key, payload, update] of cases) {
      const created = await call('POST', resource, payload)
      assert.equal(created.status, 201, JSON.stringify(created.data))
      const id = created.data[key]._id
      assert.equal((await call('GET', `${resource}/${id}`, null, false)).status, 404)
      assert.equal((await call('GET', `${resource}/${id}`)).status, 200)
      assert.equal((await call('GET', `${resource}?all=true`)).data.length, 1)
      assert.equal((await call('GET', `${resource}?all=true`, null, false)).data.length, 0)
      const updated = await call('PUT', `${resource}/${id}`, update)
      assert.equal(updated.status, 200, JSON.stringify(updated.data))
      assert.ok(updated.data[key])
      assert.equal((await call('DELETE', `${resource}/${id}`)).status, 200)
      assert.equal((await call('GET', `${resource}/${id}`)).status, 404)
    }
    assert.equal((await call('GET', 'staff?category=primary&staffType=teaching')).status, 200)
    for (const endpoint of ['academic-years', 'classes?academicYear=2098-2099', 'streams?class=11']) assert.equal((await call('GET', `syllabus/${endpoint}`)).status, 200)
    assert.equal((await call('GET', 'staff/invalid')).status, 400)
  })
  await t.test('gallery event CRUD, slug, flattening and image operations', async () => {
    const created = await call('POST', 'gallery', { name: 'Fixture Event', description: 'Fixture only' })
    assert.equal(created.status, 201)
    const id = created.data.event._id
    assert.equal((await call('GET', 'gallery/slug/fixture-event', null, false)).status, 200)
    let result = await call('POST', `gallery/${id}/images`, { images: ['/uploads/gallery/fixture.webp'] })
    assert.equal(result.status, 200)
    const imageId = result.data.event.images[0]._id
    result = await call('PUT', `gallery/${id}/images/${imageId}`, { title: 'Fixture caption' })
    assert.equal(result.data.event.images[0].title, 'Fixture caption')
    const flat = await call('GET', 'gallery?flat=true', null, false)
    assert.equal(flat.data.data[0].title, 'Fixture caption')
    assert.ok(flat.data.pagination)
    assert.equal((await call('DELETE', `gallery/${id}/images/${imageId}`)).status, 200)
    assert.equal((await call('PUT', `gallery/${id}`, { name: 'Updated Fixture Event' })).status, 200)
    assert.equal((await call('GET', `gallery/${id}`)).status, 200)
    assert.equal((await call('DELETE', `gallery/${id}`)).status, 200)
  })
  await t.test('rejected updates preserve the previous media file', async () => {
    await fs.mkdir(path.join(directory, 'staff'), { recursive: true })
    await fs.writeFile(path.join(directory, 'staff', 'keep.webp'), 'fixture')
    const created = await call('POST', 'staff', { name: 'Fixture', designation: 'Teacher', category: 'primary', staffType: 'teaching', qualification: 'Fixture degree', image: '/uploads/staff/keep.webp' })
    const id = created.data.staff._id
    assert.equal((await call('PUT', `staff/${id}`, { category: 'invalid', image: '/uploads/staff/new.webp' })).status, 400)
    assert.equal(await fs.readFile(path.join(directory, 'staff', 'keep.webp'), 'utf8'), 'fixture')
    assert.equal((await call('DELETE', `staff/${id}`)).status, 200)
  })
  await t.test('multipart image, multiple images, PDF, retrieval and deletion use persistent storage', async () => {
    const image = await sharp({ create: { width: 12, height: 12, channels: 3, background: 'blue' } }).png().toBuffer()
    for (const [route, field, bytes, mime, filename, count] of [
      ['image', 'image', image, 'image/png', 'fixture.png', 1],
      ['images', 'images', image, 'image/png', 'fixture.png', 2],
      ['pdf', 'pdf', Buffer.from('%PDF-1.4\n%%EOF'), 'application/pdf', 'fixture.pdf', 1],
    ]) {
      const form = new FormData()
      for (let i = 0; i < count; i++) form.append(field, new Blob([bytes], { type: mime }), filename)
      const result = await call('POST', `upload/${route}`, form)
      assert.equal(result.status, 200, JSON.stringify(result.data))
      const paths = result.data.images || [result.data.path]
      for (const url of paths) {
        const response = await serveUpload(new Request(`http://localhost${url}`), { params: { path: url.slice(9).split('/') } })
        assert.equal(response.status, 200)
        assert.ok((await response.arrayBuffer()).byteLength)
        assert.equal((await call('DELETE', 'upload/file', { filePath: url })).status, 200)
      }
    }
    const tooMany = new FormData()
    for (let i = 0; i < 5; i++) tooMany.append('images', new Blob([image], { type: 'image/png' }), 'fixture.png')
    assert.equal((await call('POST', 'upload/images', tooMany)).status, 400)
  })
  await t.test('expired access recovers via refresh, rotation rejects replay and revokes sessions', async () => {
    const current = await Auth.findById(admin._id)
    jar.set('accessToken', jwt.sign({ id: String(admin._id), version: current.sessionVersion }, process.env.JWT_SECRET, { expiresIn: -1 }))
    assert.equal((await call('GET', 'auth/session')).status, 401)
    const old = jar.get('refreshToken')
    assert.equal((await call('POST', 'auth/refresh-token')).status, 200)
    assert.notEqual(jar.get('refreshToken'), old)
    assert.equal((await call('GET', 'auth/session')).status, 200)
    jar.set('refreshToken', old)
    assert.equal((await call('POST', 'auth/refresh-token')).status, 401)
    assert.equal((await call('GET', 'auth/session')).status, 401)
    await call('POST', 'auth/login', { email, password }, false)
    const results = await Promise.all([call('POST', 'auth/refresh-token'), call('POST', 'auth/refresh-token')])
    assert.equal(results.filter(result => result.status === 200).length, 1)
    assert.equal(results.filter(result => result.status === 401).length, 1)
  })
  await t.test('password change and intentional recovery reset revoke old sessions; logout works after expiry', async () => {
    await call('POST', 'auth/login', { email, password }, false)
    const oldAccess = jar.get('accessToken')
    const changed = 'Updated-Fixture-Aa456!'
    assert.equal((await call('PUT', 'auth/change-password', { oldPassword: password, newPassword: changed })).status, 200)
    assert.equal((await call('GET', 'auth/session')).status, 200)
    const newAccess = jar.get('accessToken')
    jar.set('accessToken', oldAccess)
    assert.equal((await call('GET', 'auth/session')).status, 401)
    jar.set('accessToken', newAccess)
    assert.equal((await call('POST', 'auth/logout')).status, 200)
    assert.equal(jar.size, 0)
    assert.equal((await call('POST', 'auth/login', { email, password: changed }, false)).status, 200)
    await provisionAdmin({ email, password, reset: true })
    assert.equal((await call('GET', 'auth/session')).status, 401)
    assert.equal((await call('POST', 'auth/login', { email, password }, false)).status, 200)
    await Auth.updateOne({ _id: admin._id }, { $set: { expiry: new Date(0) } })
    assert.equal((await call('POST', 'auth/refresh-token')).status, 401)
    jar.delete('accessToken')
    const out = await call('POST', 'auth/logout')
    assert.equal(out.status, 200)
    assert.match(out.headers.get('set-cookie'), /Max-Age=0/)
    assert.equal((await Auth.findById(admin._id).select('+refreshToken')).refreshToken, null)
  })
  await t.test('explicit disconnect and reconnect opens a usable pool without touching school records', async () => {
    await mongoose.disconnect()
    await connectDB()
    assert.equal(await Auth.countDocuments(), 1)
  })
  await t.test('legacy UUID refresh sessions migrate without resetting credentials', async () => {
    const legacy = '11111111-1111-4111-8111-111111111111'
    await Auth.updateOne({ _id: admin._id }, { $set: { sessionVersion: 0, refreshToken: legacy, expiry: new Date(Date.now() + 60000) } })
    jar.set('refreshToken', legacy)
    jar.set('accessToken', jwt.sign({ id: String(admin._id) }, process.env.JWT_SECRET, { expiresIn: '15m' }))
    assert.equal((await call('GET', 'auth/session')).status, 200)
    assert.equal((await call('POST', 'auth/refresh-token')).status, 200)
    assert.match((await Auth.findById(admin._id).select('+refreshToken')).refreshToken, /^sha256:/)
    assert.equal((await call('POST', 'auth/logout')).status, 200)
  })
  await t.test('real failed initial connection clears its promise and permits retry', async () => {
    await mongoose.disconnect()
    process.env.MONGODB_URI = `mongodb://127.0.0.1:1${parsed.pathname}`
    try { await assert.rejects(connectDB()) }
    finally { process.env.MONGODB_URI = testUri }
    await connectDB()
    assert.equal(await Auth.countDocuments(), 1)
  })
})
