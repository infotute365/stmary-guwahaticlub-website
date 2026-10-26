// Exercises the real production launcher and HTTP server using only disposable
// local MongoDB data and an external temporary upload directory. No VPS access.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import { createRequire } from 'node:module'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { createHash } from 'node:crypto'
import mongoose from 'mongoose'

const require = createRequire(import.meta.url)
const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'stmary-gc-production-'))
const database = `stmary_gc_test_smoke_${Date.now()}`
const uri = `mongodb://127.0.0.1:27017/${database}`
const origin = 'https://fixture-school.example.com'
const env = { ...process.env, NODE_ENV: 'production', MONGODB_URI: uri, JWT_SECRET: 'fixture-only-production-smoke-secret-abcdefghijklmnopqrstuvwxyz', APP_ORIGIN: origin, UPLOAD_DIR: directory, NEXT_PUBLIC_API_URL: '/api', ADMIN_INITIAL_EMAIL: 'fixture-smoke@example.com', ADMIN_INITIAL_PASSWORD: 'Fixture-Only-Aa123!', TRUST_PROXY_IP: 'false' }
const report = { database: 'disposable local database (removed afterward)', checks: [] }
let server
let serverLog = ''
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))
async function runNode(args) {
  const child = spawn(process.execPath, args, { env, stdio: ['ignore', 'pipe', 'pipe'] })
  let output = ''
  child.stdout.on('data', data => { output += data })
  child.stderr.on('data', data => { output += data })
  const code = await new Promise((resolve, reject) => { child.on('error', reject); child.on('exit', resolve) })
  assert.equal(code, 0, output)
  return output
}
async function stop() {
  if (!server || server.exitCode !== null) return
  const child = server
  // On Windows killing a parent does not kill its Next.js child. The launcher
  // accepts SIGINT on POSIX; taskkill /T terminates only this test process tree.
  if (process.platform === 'win32') {
    await new Promise(resolve => { const killer = spawn('taskkill', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' }); killer.on('exit', resolve) })
  } else child.kill('SIGTERM')
  await Promise.race([new Promise(resolve => child.on('exit', resolve)), pause(5000)])
  server = null
}
async function freePort() {
  const probe = createServer()
  await new Promise(resolve => probe.listen(0, '127.0.0.1', resolve))
  const port = probe.address().port
  await new Promise(resolve => probe.close(resolve))
  return port
}
async function start(port) {
  serverLog = ''
  server = spawn(process.execPath, ['./scripts/start.mjs', '--hostname', '127.0.0.1', '--port', String(port)], { env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
  server.stdout.on('data', data => { serverLog += data })
  server.stderr.on('data', data => { serverLog += data })
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null) throw new Error(serverLog)
    try { if ((await fetch(`http://127.0.0.1:${port}/api/health`)).ok) return }
    catch {}
    await pause(200)
  }
  throw new Error('Production test server did not become ready')
}
try {
  const fixture = Buffer.from('%PDF-1.4\nfixture persistence check\n%%EOF')
  await fs.mkdir(path.join(directory, 'syllabus'))
  await fs.writeFile(path.join(directory, 'syllabus', 'persistence.pdf'), fixture)
  if (process.argv.includes('--rebuild')) {
    console.log('Rebuilding with a verification file already present in external storage...')
    await runNode([require.resolve('next/dist/bin/next'), 'build'])
    report.checks.push('Existing external upload survived production rebuild')
  }
  assert.match(await runNode(['./scripts/seed-admin.mjs']), /created/)
  assert.match(await runNode(['./scripts/seed-admin.mjs']), /already exists/)
  report.checks.push('Actual seed CLI succeeds twice without password replacement')
  const port = await freePort()
  await start(port)
  const base = `http://127.0.0.1:${port}`
  const baseline = JSON.parse((await fs.readFile('docs/verification/baseline.json', 'utf8')).replace(/^\uFEFF/, ''))
  const routes = baseline.files.filter(item => item.path.startsWith('app/') && item.path.endsWith('/page.jsx')).map(item => '/' + item.path.slice(4, -9).split('/').filter(part => !part.startsWith('(')).join('/')).map(route => route.replace(/\/$/, '') || '/')
  const links = new Set()
  const scripts = new Set()
  for (const route of routes) {
    const response = await fetch(base + route)
    assert.equal(response.status, 200, route)
    assert.match(response.headers.get('content-type'), /text\/html/)
    const html = await response.text()
    for (const match of html.matchAll(/href="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) if (!match[1].startsWith('/_next/') && !/\.(svg|png|jpe?g|webp|pdf|ico)$/i.test(match[1])) links.add(match[1])
    for (const match of html.matchAll(/src="(\/_next\/static\/[^"?]+)/g)) scripts.add(match[1])
  }
  for (const link of links) assert.equal((await fetch(base + link)).status, 200, `Navigation: ${link}`)
  for (const asset of scripts) assert.equal((await fetch(base + asset)).status, 200, `Static chunk: ${asset}`)
  report.checks.push(`${routes.length} existing page routes, ${links.size} internal navigation targets and ${scripts.size} static chunks returned HTTP 200`)
  const jar = new Map()
  async function api(method, route, body) {
    const headers = { origin, 'content-type': 'application/json' }
    if (jar.size) headers.cookie = [...jar].map(([key, value]) => `${key}=${value}`).join('; ')
    const response = await fetch(`${base}/api/${route}`, { method, headers, body: method === 'GET' ? undefined : JSON.stringify(body || {}) })
    for (const line of response.headers.getSetCookie()) { const [name, ...value] = line.split(';')[0].split('='); if (value.join('=')) jar.set(name, value.join('=')); else jar.delete(name) }
    return { response, data: await response.json() }
  }
  const loggedIn = await api('POST', 'auth/login', { email: env.ADMIN_INITIAL_EMAIL, password: env.ADMIN_INITIAL_PASSWORD })
  assert.equal(loggedIn.response.status, 200, JSON.stringify(loggedIn.data))
  assert.match(loggedIn.response.headers.get('set-cookie'), /Secure/)
  assert.match(loggedIn.response.headers.get('set-cookie'), /HttpOnly/)
  assert.match(loggedIn.response.headers.get('set-cookie'), /SameSite=lax/i)
  assert.equal((await api('GET', 'auth/session')).response.status, 200)
  assert.equal((await api('POST', 'auth/refresh-token')).response.status, 200)
  const created = await api('POST', 'circulars', { title: 'Production fixture', content: 'Disposable fixture' })
  assert.equal(created.response.status, 201)
  assert.equal((await api('DELETE', `circulars/${created.data.circular._id}`)).response.status, 200)
  const csrf = await fetch(`${base}/api/auth/logout`, { method: 'POST', headers: { origin: 'https://evil.example', cookie: [...jar].map(([k, v]) => `${k}=${v}`).join('; ') } })
  assert.equal(csrf.status, 403)
  assert.equal((await api('POST', 'auth/logout')).response.status, 200)
  assert.equal(jar.size, 0)
  report.checks.push('Production HTTP login/session/refresh/create/delete/logout pass with Secure cookies and cross-origin mutation rejection')
  const hash = data => createHash('sha256').update(data).digest('hex')
  for (const prefix of ['/uploads', '/api/uploads']) {
    const response = await fetch(`${base}${prefix}/syllabus/persistence.pdf`)
    assert.equal(response.status, 200)
    assert.equal(hash(Buffer.from(await response.arrayBuffer())), hash(fixture))
  }
  await stop()
  await start(port)
  const response = await fetch(`${base}/uploads/syllabus/persistence.pdf`)
  assert.equal(hash(Buffer.from(await response.arrayBuffer())), hash(fixture))
  report.checks.push('Both media URL forms work; upload checksum is unchanged after process restart')
  report.status = 'PASS'
  await fs.writeFile('docs/verification/production-smoke.json', JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify(report, null, 2))
} finally {
  await stop()
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  await mongoose.connection.dropDatabase()
  await mongoose.disconnect()
  await fs.rm(directory, { recursive: true, force: true })
}
