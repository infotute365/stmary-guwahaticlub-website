import test from 'node:test'
import assert from 'node:assert/strict'
import mongoose from 'mongoose'
import connectDB from '../src/server/config/database.js'

test('database missing URI, concurrent success, pool reuse, failure, retry and driver reconnect', async t => {
  const originalUri = process.env.MONGODB_URI
  const originalState = mongoose.connection.readyState
  const originalDb = mongoose.connection.db
  t.after(() => { t.mock.restoreAll(); mongoose.connection.readyState = originalState; mongoose.connection.db = originalDb; if (originalUri === undefined) delete process.env.MONGODB_URI; else process.env.MONGODB_URI = originalUri; delete globalThis.__guwahatiClubMongo })
  delete process.env.MONGODB_URI
  await assert.rejects(connectDB(), /MONGODB_URI/)
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/stmary_gc_test_mock'
  mongoose.connection.readyState = 0
  t.mock.method(mongoose.connection, 'getClient', () => undefined)
  t.mock.method(mongoose, 'disconnect', async () => { mongoose.connection.readyState = 0 })
  let attempts = 0
  let fail = false
  t.mock.method(mongoose, 'connect', async (_uri, options) => {
    attempts++
    assert.equal(options.maxPoolSize, 10)
    assert.equal(options.bufferCommands, false)
    await new Promise(resolve => setImmediate(resolve))
    if (fail) throw new Error('Temporary failure')
    mongoose.connection.readyState = 1
    return mongoose
  })
  const results = await Promise.all(Array.from({ length: 10 }, () => connectDB()))
  assert.ok(results.every(value => value === mongoose))
  assert.equal(attempts, 1)
  await connectDB()
  assert.equal(attempts, 1)
  mongoose.connection.readyState = 0
  fail = true
  await assert.rejects(connectDB(), /Temporary failure/)
  assert.equal(globalThis.__guwahatiClubMongo.pending, null)
  fail = false
  await connectDB()
  assert.equal(attempts, 3)
  // A live driver's topology should recover without creating a second pool.
  mongoose.connection.readyState = 0
  const client = { topology: {} }
  globalThis.__guwahatiClubMongo.client = client
  t.mock.method(mongoose.connection, 'getClient', () => client)
  t.mock.method(mongoose.connection, 'asPromise', async () => mongoose.connection)
  let pings = 0
  mongoose.connection.db = { admin: () => ({ ping: async () => { pings++ } }) }
  await Promise.all([connectDB(), connectDB()])
  assert.equal(pings, 1)
  assert.equal(attempts, 3)
})
