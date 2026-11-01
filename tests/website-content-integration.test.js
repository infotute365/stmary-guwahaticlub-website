import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import connectDB from '../src/server/config/database.js'
import Auth from '../src/server/model/auth.model.js'
import WebsiteContent from '../src/server/model/website-content.model.js'
import WebsiteContentRevision from '../src/server/model/website-content-revision.model.js'
import { handleApiRequest } from '../src/server/route-adapter.js'
import { getContentField } from '../src/server/util/websiteContentPolicy.js'
import {
  ensureWebsiteContentIndexes, readContentState, recoverContentState, changeWebsiteContent,
} from '../src/server/util/websiteContentStore.js'

const registry = JSON.parse(await fs.readFile(new URL('../docs/website-editor/baseline/content-registry.json', import.meta.url), 'utf8'))
const homeFields = registry.fields.filter(field => field.audience === 'public' && field.status === 'editable' && field.pagePath === '/' && field.contentType === 'text')
const field = getContentField(homeFields.find(item => item.key.includes('hero-carousel.slides.item1.title'))?.key || homeFields[0].key)
const secondField = getContentField(homeFields.find(item => item.key !== field.key && item.defaultValue.length < 100).key)
const globalField = getContentField(registry.fields.find(item => item.audience === 'public' && item.status === 'editable' && item.scope === 'global' && item.contentType === 'text').key)
const numericField = getContentField(registry.fields.find(item => item.audience === 'public' && item.status === 'editable' && item.contentType === 'number').key)
const protectedFee = registry.fields.find(item => item.key === 'global.top-bar.fee-options.item1.url')
const initialTestUri = process.env.TEST_MONGODB_URI

test('disposable MongoDB: website content HTTP, revisions, concurrency, security and crash recovery', { skip: !initialTestUri }, async t => {
  const parsed = new URL(initialTestUri)
  assert.equal(parsed.protocol, 'mongodb:')
  assert.match(parsed.pathname, /^\/stmary_gc_test_[a-z\d_]+$/i, 'Only an explicitly named disposable database may be used')
  parsed.pathname += `_content_${process.pid}_${Date.now()}`
  const expectedDatabase = parsed.pathname.slice(1)
  process.env.MONGODB_URI = parsed.toString()
  process.env.JWT_SECRET = 'fixture-only-content-secret-abcdefghijklmnopqrstuvwxyz'
  process.env.APP_ORIGIN = 'http://localhost'
  process.env.NODE_ENV = 'test'
  process.env.TRUST_PROXY_IP = 'false'
  delete globalThis.__guwahatiRateLimits
  await connectDB()
  assert.equal(mongoose.connection.name, expectedDatabase)
  t.after(async () => {
    try {
      assert.equal(mongoose.connection.name, expectedDatabase)
      assert.match(expectedDatabase, /^stmary_gc_test_.*_content_\d+_\d+$/)
      await mongoose.connection.dropDatabase()
    } finally { await mongoose.disconnect() }
  })
  await ensureWebsiteContentIndexes()
  const email = 'fixture-content-admin@example.com'
  const password = 'Fixture-Only-Content-Aa123!'
  const admin = await Auth.create({ fullname: 'Fixture Content Admin', email, password, role: 'admin', isActive: true })
  const jar = new Map()
  async function call(method, route, body, options = {}) {
    const headers = { origin: options.origin || 'http://localhost', ...options.headers }
    if (options.cookie !== undefined) headers.cookie = options.cookie
    else if (options.authenticated !== false && jar.size) headers.cookie = [...jar].map(([name, value]) => `${name}=${value}`).join('; ')
    let data
    if (!['GET', 'HEAD'].includes(method)) {
      headers['content-type'] = options.contentType || 'application/json'
      data = options.rawBody ?? JSON.stringify(body ?? {})
    }
    const parts = route.split('?')[0].split('/').map(part => decodeURIComponent(part))
    const response = await handleApiRequest(new Request(`http://localhost/api/${route}`, { method, headers, body: data }), { params: Promise.resolve({ path: parts }) })
    if (options.captureCookies !== false) for (const cookie of response.cookies.getAll()) {
      if (cookie.value) jar.set(cookie.name, cookie.value)
      else jar.delete(cookie.name)
    }
    return { status: response.status, data: await response.json(), headers: response.headers }
  }
  const keyPath = key => `website-content/${encodeURIComponent(key)}`
  const mutation = (key, value, expectedRevision, extra = {}) => call('PUT', keyPath(key), { value, expectedRevision, ...extra })
  const effectiveCatalog = path => call('GET', `website-content/catalog?path=${encodeURIComponent(path)}`)
  const published = path => call('GET', `website-content?path=${encodeURIComponent(path)}`, null, { authenticated: false })
  const history = (key, query = '') => call('GET', `website-content/history/${encodeURIComponent(key)}${query}`)
  const signin = () => call('POST', 'auth/login', { email, password }, { authenticated: false })
  let revision = 0

  await t.test('published reads do not seed defaults and private catalog/history require authentication', async () => {
    const result = await published('/')
    assert.equal(result.status, 200, JSON.stringify(result.data))
    assert.deepEqual(result.data, { path: '/', overrides: {} })
    assert.equal(result.headers.get('cache-control'), 'no-store')
    assert.equal(await WebsiteContent.countDocuments(), 0)
    assert.equal(await WebsiteContentRevision.countDocuments(), 0)
    assert.equal((await call('GET', 'website-content/catalog?path=/', null, { authenticated: false })).status, 401)
    assert.equal((await call('GET', `website-content/history/${field.key}`, null, { authenticated: false })).status, 401)
    assert.equal((await call('PUT', keyPath(field.key), { value: 'Anonymous', expectedRevision: 0 }, { authenticated: false })).status, 401)
    for (const action of ['restore', 'reset']) {
      assert.equal((await call('POST', `${keyPath(field.key)}/${action}`, { revision: 1, expectedRevision: 0 }, { authenticated: false })).status, 401)
    }
    assert.equal((await signin()).status, 200)
    const catalog = await effectiveCatalog('/')
    assert.equal(catalog.status, 200)
    const current = catalog.data.fields.find(item => item.key === field.key)
    assert.equal(current.value, field.defaultValue)
    assert.equal(current.defaultValue, field.defaultValue)
    assert.equal(current.revision, 0)
    assert.equal(current.hasOverride, false)
    assert.equal(await WebsiteContent.countDocuments(), 0)
  })

  await t.test('first and subsequent saves publish immediately and preserve complete revision history', async () => {
    let result = await mutation(field.key, 'First fixture heading', 0)
    assert.equal(result.status, 200, JSON.stringify(result.data))
    assert.equal(result.data.field.revision, 1)
    revision = 1
    assert.equal((await published('/')).data.overrides[field.key].value, 'First fixture heading')
    result = await mutation(field.key, 'Second fixture heading', revision)
    assert.equal(result.status, 200, JSON.stringify(result.data))
    revision = result.data.field.revision
    assert.equal(revision, 2)
    const audit = await history(field.key)
    assert.equal(audit.status, 200)
    assert.equal(audit.data.entries.length, 2)
    assert.equal(audit.data.entries[1].previousValue, field.defaultValue)
    assert.equal(audit.data.entries[1].newValue, 'First fixture heading')
    assert.equal(audit.data.entries[0].previousValue, 'First fixture heading')
    assert.equal(audit.data.entries[0].newValue, 'Second fixture heading')
    assert.equal(audit.data.entries[0].revision, 2)
    assert.equal(String(audit.data.entries[0].administrator), String(admin._id))
    assert.ok(audit.data.entries[0].changedAt)
    const publicValue = (await published('/')).data
    assert.doesNotMatch(JSON.stringify(publicValue), /administrator|updatedBy|pending|fixture-content-admin|Fixture Content Admin/)
    assert.deepEqual(Object.keys(publicValue.overrides[field.key]).sort(), ['contentType', 'revision', 'value'])
    assert.equal((await published('/contact')).data.overrides[field.key], undefined)
  })

  await t.test('stale, simultaneous and first-save editors cannot silently overwrite each other', async () => {
    assert.equal((await mutation(field.key, 'Stale fixture', 0)).status, 409)
    const raced = await Promise.all([
      mutation(field.key, 'Concurrent fixture one', revision),
      mutation(field.key, 'Concurrent fixture two', revision),
    ])
    assert.deepEqual(raced.map(result => result.status).sort(), [200, 409])
    revision++
    const firstRace = await Promise.all([
      mutation(secondField.key, 'First-race fixture one', 0),
      mutation(secondField.key, 'First-race fixture two', 0),
    ])
    assert.deepEqual(firstRace.map(result => result.status).sort(), [200, 409])
    assert.equal(await WebsiteContent.countDocuments({ key: secondField.key }), 1)
    assert.equal(await WebsiteContentRevision.countDocuments({ key: secondField.key }), 1)
    assert.equal((await history(field.key)).data.entries.length, revision)
  })

  await t.test('approved image and internal destination saves persist, validate on the server, and retain audited restore/reset', async () => {
    const unrelatedBefore = (await published('/')).data.overrides[field.key]
    const catalog = (await effectiveCatalog('/')).data.fields
    for (const key of ['home.hero-carousel.hero-carousel.style', 'home.home.href.2']) {
      const slot = catalog.find(item => item.key === key)
      assert.equal(slot.editable, true)
      assert.ok(slot.choices.length > 1)
      const chosen = slot.choices[1].value
      assert.equal((await call('PUT', keyPath(key), { value: chosen, expectedRevision: 0 }, { authenticated: false })).status, 401)
      assert.equal((await mutation(key, chosen, 0, { contentType: slot.contentType, ...(slot.contentType==='url'?{confirmDestination:true}:{}) })).status, 200)
      assert.equal((await published('/')).data.overrides[key].value, chosen)
      assert.equal((await effectiveCatalog('/')).data.fields.find(item => item.key === key).value, chosen)
      assert.equal((await mutation(key, chosen, 0, slot.contentType==='url'?{confirmDestination:true}:{})).status, 409)
      for (const unsafe of ['https://evil.example', '/admin', '/contact?redirect=//evil.example', "url('https://evil.example/image.png')"]) {
        assert.equal((await mutation(key, unsafe, 1)).status, 400)
      }
      assert.equal((await call('POST', `${keyPath(key)}/reset`, { expectedRevision: 1, ...(slot.contentType==='url'?{confirmDestination:true}:{}) })).status, 200)
      assert.equal((await published('/')).data.overrides[key], undefined)
      assert.equal((await call('POST', `${keyPath(key)}/restore`, { revision: 1, expectedRevision: 2, ...(slot.contentType==='url'?{confirmDestination:true}:{}) })).status, 200)
      assert.equal((await published('/')).data.overrides[key].value, chosen)
      assert.equal((await history(key)).data.entries.length, 3)
      assert.equal((await call('POST', `${keyPath(key)}/reset`, { expectedRevision: 3, ...(slot.contentType==='url'?{confirmDestination:true}:{}) })).status, 200)
      assert.equal((await effectiveCatalog('/')).data.fields.find(item => item.key === key).value, slot.defaultValue)
    }
    assert.deepEqual((await published('/')).data.overrides[field.key], unrelatedBefore)
    assert.equal((await mutation(protectedFee.key, '/contact', 0)).status, 403)
  })

  await t.test('restore appends a revision, reset returns the exact original, and tombstones reject ABA edits', async () => {
    let result = await call('POST', `${keyPath(field.key)}/restore`, { revision: 1, expectedRevision: revision })
    assert.equal(result.status, 200, JSON.stringify(result.data))
    revision++
    assert.equal(result.data.field.revision, revision)
    assert.equal(result.data.field.value, 'First fixture heading')
    assert.equal((await history(field.key)).data.entries[0].action, 'restore')
    assert.equal((await history(field.key)).data.entries[0].restoredFromRevision, 1)
    result = await call('POST', `${keyPath(field.key)}/reset`, { expectedRevision: revision })
    assert.equal(result.status, 200, JSON.stringify(result.data))
    revision++
    assert.equal(result.data.field.revision, revision)
    assert.equal(result.data.field.value, field.defaultValue)
    assert.equal(result.data.field.hasOverride, false)
    assert.equal((await published('/')).data.overrides[field.key], undefined)
    assert.equal((await effectiveCatalog('/')).data.fields.find(item => item.key === field.key).value, field.defaultValue)
    const current = await WebsiteContent.findOne({ key: field.key }).lean()
    assert.equal(current.revision, revision)
    assert.equal(current.hasOverride, false)
    assert.equal(current.value, undefined)
    assert.equal((await mutation(field.key, 'ABA stale fixture', 0)).status, 409)
    assert.equal((await call('POST', `${keyPath(field.key)}/restore`, { revision: 1, expectedRevision: 0 })).status, 409)
    assert.equal((await call('POST', `${keyPath(field.key)}/reset`, { expectedRevision: 0 })).status, 409)
    assert.equal((await call('POST', `${keyPath(field.key)}/restore`, { revision: 9999, expectedRevision: revision })).status, 404)
    const resetHistory = await history(field.key, '?limit=2')
    assert.equal(resetHistory.data.entries.length, 2)
    assert.equal(resetHistory.data.entries[0].action, 'reset')
    assert.equal(resetHistory.data.hasMore, true)
    const next = await history(field.key, `?limit=2&before=${resetHistory.data.nextBefore}`)
    assert.ok(next.data.entries.every(entry => entry.revision < resetHistory.data.entries.at(-1).revision))
  })

  await t.test('intentional empty strings and zero values remain actual overrides, including global scope', async () => {
    let result = await mutation(globalField.key, '', 0)
    assert.equal(result.status, 200, JSON.stringify(result.data))
    assert.equal((await published('/')).data.overrides[globalField.key].value, '')
    assert.equal((await published('/contact')).data.overrides[globalField.key].value, '')
    result = await mutation(numericField.key, 0, 0)
    assert.equal(result.status, 200, JSON.stringify(result.data))
    const path = numericField.usedOnRoutes[0]
    assert.equal((await published(path)).data.overrides[numericField.key].value, 0)
    assert.equal(typeof (await published(path)).data.overrides[numericField.key].value, 'number')
  })

  await t.test('strict allowlists, paths, types, lengths and malicious payloads reject without creating changes', async () => {
    assert.equal((await mutation('unknown.field', 'Fixture', 0)).status, 404)
    assert.equal((await history('unknown.field')).status, 404)
    assert.equal((await mutation(protectedFee.key, 'https://evil.example/fees', 0)).status, 403)
    assert.equal((await history(protectedFee.key)).status, 403)
    const confirmed = await mutation(protectedFee.key, protectedFee.defaultValue, 0, { confirmed: true })
    assert.ok([400, 403].includes(confirmed.status))
    assert.equal((await mutation(field.key, 'Fixture', revision, { contentType: 'image' })).status, 400)
    assert.equal((await mutation(field.key, 'Fixture', '0')).status, 400)
    const cases = [
      { value: { $ne: null }, expectedRevision: revision },
      { value: ['array'], expectedRevision: revision },
      { value: true, expectedRevision: revision },
      { value: '<script>alert(1)</script>', expectedRevision: revision },
      { value: '<svg/onload=alert(1)>', expectedRevision: revision },
      { value: '&lt;script&gt;alert(1)&lt;/script&gt;', expectedRevision: revision },
      { value: '%3Cscript%3Ealert(1)%3C%2Fscript%3E', expectedRevision: revision },
      { value: 'javascript:alert(1)', expectedRevision: revision },
      { value: 'data:text/html,executable', expectedRevision: revision },
      { value: 'body { color: red; }', expectedRevision: revision },
      { value: 'document.cookie = "stolen"', expectedRevision: revision },
      { value: 'x'.repeat(100001), expectedRevision: revision },
      { value: 'Fixture', expectedRevision: revision, updatedBy: String(admin._id) },
      { value: 'Fixture', expectedRevision: revision, scope: 'global' },
    ]
    for (const body of cases) {
      const result = await call('PUT', keyPath(field.key), body)
      assert.equal(result.status, 400, JSON.stringify(body).slice(0, 100) + JSON.stringify(result.data))
    }
    assert.equal((await call('PUT', keyPath(field.key), null, { rawBody: `{"__proto__":{},"value":"Fixture","expectedRevision":${revision}}` })).status, 400)
    assert.equal((await call('PUT', keyPath(field.key), null, { rawBody: '{bad json' })).status, 400)
    assert.equal((await call('PUT', keyPath(field.key), null, { rawBody: 'fixture', contentType: 'text/plain' })).status, 415)
    assert.equal((await call('PUT', keyPath(field.key), { value: 'Fixture', expectedRevision: revision }, { origin: 'https://evil.example' })).status, 403)
    for (const path of ['/../', '//evil.example', '/%2e%2e/', '/admin', '/unknown']) {
      const result = await published(path)
      assert.ok([400, 404].includes(result.status), path)
    }
    assert.equal((await call('GET', 'website-content?path=/&unexpected=true', null, { authenticated: false })).status, 400)
    assert.equal((await call('GET', 'website-content?path=/&path=/contact', null, { authenticated: false })).status, 400)
    assert.equal((await history(field.key, '?limit=100000')).status, 400)
    assert.equal((await history(field.key, '?before=not-a-revision')).status, 400)
    assert.equal(await WebsiteContentRevision.countDocuments({ key: field.key }), revision)
  })

  await t.test('expired, inactive and non-admin sessions cannot read private revisions or write; public output ignores cookies', async () => {
    const current = await Auth.findById(admin._id)
    const expired = jwt.sign({ id: String(admin._id), role: 'admin', version: current.sessionVersion }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: -1 })
    const expiredCookie = `accessToken=${expired}`
    assert.equal((await call('GET', `website-content/history/${field.key}`, null, { cookie: expiredCookie })).status, 401)
    assert.equal((await call('PUT', keyPath(field.key), { value: 'Expired fixture', expectedRevision: revision }, { cookie: expiredCookie })).status, 401)
    const publicExpired = await call('GET', 'website-content?path=/', null, { cookie: expiredCookie })
    assert.equal(publicExpired.status, 200)
    assert.deepEqual(publicExpired.data, (await published('/')).data)
    const publicMalformed = await call('GET', 'website-content?path=/', null, { cookie: 'accessToken=%ZZ; unrelated=%malformed' })
    assert.equal(publicMalformed.status, 200)
    assert.deepEqual(publicMalformed.data, publicExpired.data)
    await Auth.updateOne({ _id: admin._id }, { $set: { isActive: false } })
    assert.equal((await history(field.key)).status, 401)
    assert.equal((await mutation(field.key, 'Inactive fixture', revision)).status, 401)
    await Auth.updateOne({ _id: admin._id }, { $set: { isActive: true } })
    const outsiderId = new mongoose.Types.ObjectId()
    await Auth.collection.insertOne({ _id: outsiderId, fullname: 'Fixture Viewer', email: 'fixture-viewer@example.com', role: 'viewer', isActive: true, sessionVersion: 0 })
    const outsider = jwt.sign({ id: String(outsiderId), role: 'admin', version: 0 }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '15m' })
    assert.equal((await call('PUT', keyPath(field.key), { value: 'Non-admin fixture', expectedRevision: revision }, { cookie: `accessToken=${outsider}` })).status, 401)
    assert.equal((await call('GET', `website-content/history/${field.key}`, null, { cookie: `accessToken=${outsider}` })).status, 401)
    jar.set('accessToken', expired)
    assert.equal((await call('POST', 'auth/refresh-token')).status, 200)
    assert.notEqual(jar.get('accessToken'), expired)
    assert.equal((await effectiveCatalog('/')).status, 200)
    const result = await mutation(field.key, 'Refreshed fixture heading', revision)
    assert.equal(result.status, 200, JSON.stringify(result.data))
    revision++
  })

  await t.test('models reject direct protected/invalid content and maintain unique key and revision indexes', async () => {
    const unsafe = new WebsiteContent({ key: protectedFee.key, scope: protectedFee.scope, pagePath: protectedFee.pagePath, contentType: protectedFee.contentType, hasOverride: true, value: protectedFee.defaultValue, revision: 1, updatedBy: admin._id })
    await assert.rejects(unsafe.validate())
    const bad = new WebsiteContent({ key: field.key, scope: field.scope, pagePath: field.pagePath, contentType: field.contentType, hasOverride: true, value: '<script>bad</script>', revision: 1, updatedBy: admin._id })
    await assert.rejects(bad.validate())
    const wrongScope = new WebsiteContent({ key: field.key, scope: 'global', pagePath: null, contentType: field.contentType, hasOverride: true, value: 'Fixture', revision: 1, updatedBy: admin._id })
    await assert.rejects(wrongScope.validate())
    const indexes = await WebsiteContent.collection.indexes()
    assert.ok(indexes.some(index => index.unique && index.key.key === 1))
    const revisionIndexes = await WebsiteContentRevision.collection.indexes()
    assert.ok(revisionIndexes.some(index => index.unique && index.key.key === 1 && index.key.revision === 1))
    const corruptField = getContentField(homeFields.at(-1).key)
    const inserted = await WebsiteContent.collection.insertOne({ key: corruptField.key, scope: corruptField.scope, pagePath: corruptField.pagePath, contentType: corruptField.contentType, value: '<script>fixture corrupted row</script>', hasOverride: true, revision: 1 })
    try {
      const result = await published('/')
      assert.equal(result.status, 200)
      assert.equal(result.data.overrides[corruptField.key], undefined)
      assert.doesNotMatch(JSON.stringify(result.data), /fixture corrupted row/)
    } finally { await WebsiteContent.collection.deleteOne({ _id: inserted.insertedId }) }
  })

  await t.test('a failure after reservation cannot publish unaudited content and recovers idempotently', async () => {
    const recoveryField = getContentField(homeFields.find(item => ![field.key, secondField.key].includes(item.key) && item.defaultValue.length < 100).key)
    const originalPersist = WebsiteContentRevision.findOneAndUpdate
    let injected = false
    WebsiteContentRevision.findOneAndUpdate = function (...args) {
      if (!injected && args[0]?.key === recoveryField.key) {
        injected = true
        const failure = new Error('Fixture interrupted after reservation')
        failure.name = 'MongoNetworkError'
        throw failure
      }
      return originalPersist.apply(this, args)
    }
    try {
      const failed = await mutation(recoveryField.key, 'Recovered fixture heading', 0)
      assert.equal(failed.status, 503, JSON.stringify(failed.data))
    } finally { WebsiteContentRevision.findOneAndUpdate = originalPersist }
    assert.equal(injected, true)
    const committed = await readContentState(recoveryField.key)
    assert.equal(committed.revision, 0)
    assert.equal(committed.hasOverride, false)
    assert.equal(Object.hasOwn(committed, 'pending'), false)
    const pending = await WebsiteContent.findOne({ key: recoveryField.key }).select('+pending').lean()
    assert.ok(pending.pending?.token)
    assert.equal(await WebsiteContentRevision.countDocuments({ key: recoveryField.key }), 0)
    assert.equal((await published('/')).data.overrides[recoveryField.key], undefined)
    const recovered = await recoverContentState(recoveryField.key)
    assert.equal(recovered.revision, 1)
    assert.equal(recovered.value, 'Recovered fixture heading')
    await recoverContentState(recoveryField.key)
    assert.equal(await WebsiteContentRevision.countDocuments({ key: recoveryField.key }), 1)
    assert.equal((await WebsiteContent.findOne({ key: recoveryField.key }).select('+pending').lean()).pending, null)
    assert.equal((await mutation(recoveryField.key, 'Stale retry fixture', 0)).status, 409)
  })

  await t.test('a failure after history persistence keeps the old public value until one recoverable publication', async () => {
    const reserved = new Set([field.key, secondField.key])
    const candidates = homeFields.filter(item => !reserved.has(item.key) && item.defaultValue.length < 100)
    const recoveryField = getContentField(candidates[1].key)
    let initial = await changeWebsiteContent(recoveryField, { expectedRevision: 0, value: 'Original committed fixture', administrator: String(admin._id) })
    assert.equal(initial.revision, 1)
    const originalUpdate = WebsiteContent.findOneAndUpdate
    let injected = false
    WebsiteContent.findOneAndUpdate = function (...args) {
      if (!injected && args[0]?.key === recoveryField.key && args[1]?.$set?.pending === null) {
        injected = true
        const failure = new Error('Fixture interrupted after audit persistence')
        failure.name = 'MongoNetworkError'
        throw failure
      }
      return originalUpdate.apply(this, args)
    }
    try {
      const failed = await mutation(recoveryField.key, 'Next audited fixture', 1)
      assert.equal(failed.status, 503, JSON.stringify(failed.data))
    } finally { WebsiteContent.findOneAndUpdate = originalUpdate }
    assert.equal(injected, true)
    assert.equal(await WebsiteContentRevision.countDocuments({ key: recoveryField.key }), 2)
    const beforeRecovery = await readContentState(recoveryField.key)
    assert.equal(beforeRecovery.revision, 1)
    assert.equal(beforeRecovery.value, 'Original committed fixture')
    assert.equal((await published('/')).data.overrides[recoveryField.key].value, 'Original committed fixture')
    const results = await Promise.all([recoverContentState(recoveryField.key), recoverContentState(recoveryField.key)])
    assert.ok(results.every(result => result.revision === 2))
    assert.equal((await published('/')).data.overrides[recoveryField.key].value, 'Next audited fixture')
    assert.equal(await WebsiteContentRevision.countDocuments({ key: recoveryField.key }), 2)
    assert.equal((await history(recoveryField.key)).data.entries.length, 2)
  })
})
