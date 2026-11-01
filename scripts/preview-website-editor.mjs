// Local visual-editor QA only. The parent process never loads .env.local and
// every database connection targets an owned, temporary standalone mongod.
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { createServer, connect } from 'node:net'
import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'
import mongoose from 'mongoose'
import Auth from '../src/server/model/auth.model.js'
import Circular from '../src/server/model/circular.model.js'
import Gallery from '../src/server/model/gallery.model.js'
import sharp from 'sharp'
import { randomUUID } from 'node:crypto'
import { verifyPublicPages } from './website-pages-smoke.mjs'
import { verifyFinalIntegration } from './website-final-smoke.mjs'

const require = createRequire(import.meta.url)
const options = {}
for (let index = 2; index < process.argv.length; index += 2) {
  const flag = process.argv[index]
  if (!['--port', '--mongod', '--mode', '--verify-pages', '--verify-final','--stage'].includes(flag) || !process.argv[index + 1] || Object.hasOwn(options, flag)) throw new Error('Invalid preview option')
  options[flag] = process.argv[index + 1]
}
const mode=options['--mode']||'development'
if(!['development','production'].includes(mode)||options['--verify-pages']&&options['--verify-pages']!=='true')throw new Error('Invalid preview mode or verification option')
if(options['--verify-final'] && (options['--verify-final']!=='true'||mode!=='production'))throw new Error('Final verification requires production mode')
if(options['--stage']&&!['05','master'].includes(options['--stage']))throw new Error('Invalid verification stage')
const requestedPort = options['--port'] === undefined ? 0 : Number(options['--port'])
if (!Number.isInteger(requestedPort) || requestedPort !== 0 && (requestedPort < 1024 || requestedPort > 65535)) throw new Error('Preview port must be an integer from 1024 to 65535')
const mongodExecutable = options['--mongod'] || process.env.MONGOD_BINARY || (process.platform === 'win32' ? 'C:/Program Files/MongoDB/Server/8.0/bin/mongod.exe' : 'mongod')
const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'stmary-gc-editor-preview-'))
const database = `stmary_gc_test_editor_preview_${process.pid}_${Date.now()}`
if (!/^stmary_gc_test_editor_preview_\d+_\d+$/.test(database)) throw new Error('Unsafe fixture database name')
const email = 'editor-fixture@example.test'
const password = 'Fixture-Editor-Only-Aa123!'
let mongoServer
let nextServer
let nextLog = ''
let intentionalRestart = false
let releaseModules
let stopReason
let resolveStop
const stopRequested = new Promise(resolve => { resolveStop = resolve })
const requestStop = reason => { if (!stopReason) { stopReason = reason; resolveStop() } }
const alive = child => Boolean(child?.pid && child.exitCode === null && child.signalCode === null)
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

async function freePort(preferred = 0) {
  const probe = createServer()
  await new Promise((resolve, reject) => { probe.once('error', reject); probe.listen(preferred, '127.0.0.1', resolve) })
  const port = probe.address().port
  await new Promise(resolve => probe.close(resolve))
  return port
}

async function waitForExit(child, exitPromise, timeoutMs = 10000) {
  if (!alive(child)) return true
  let timer
  try {
    return await Promise.race([
      exitPromise.then(() => true),
      new Promise(resolve => { timer = setTimeout(() => resolve(false), timeoutMs) }),
    ])
  } finally { clearTimeout(timer) }
}

async function stopChild(child, tree = false) {
  if (!alive(child)) return
  // Register before signalling: a Windows child may deliver exit immediately.
  const exited = new Promise(resolve => child.once('exit', resolve))
  if (tree && process.platform === 'win32') {
    if (!Number.isSafeInteger(child.pid) || child.pid <= 0) throw new Error('Unsafe owned preview PID')
    await new Promise((resolve, reject) => {
      const killer = spawn('taskkill', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' })
      killer.once('error', reject)
      killer.once('exit', resolve)
    })
  } else if (tree && process.platform !== 'win32') {
    try { process.kill(-child.pid, 'SIGTERM') }
    catch (error) { if (error.code !== 'ESRCH') throw error }
  } else child.kill('SIGTERM')
  if (!await waitForExit(child, exited) && alive(child)) {
    if (tree && process.platform !== 'win32') {
      try { process.kill(-child.pid, 'SIGKILL') }
      catch (error) { if (error.code !== 'ESRCH') throw error }
    } else child.kill('SIGKILL')
    if (!await waitForExit(child, exited)) throw new Error('Owned preview process did not stop')
  }
}

const signalStop = () => requestStop('signal')
process.on('SIGINT', signalStop)
process.on('SIGTERM', signalStop)
process.stdin.setEncoding('utf8')
let input = ''
const receiveInput = chunk => {
  input += chunk
  let newline
  while ((newline = input.indexOf('\n')) >= 0) {
    const line = input.slice(0, newline).trim().toLowerCase()
    input = input.slice(newline + 1)
    if (line === 'quit' || line === 'exit') requestStop('stdin')
  }
}
process.stdin.on('data', receiveInput)
// A retained tool session may close its input pipe; that alone does not stop QA.
process.stdin.resume()

try {
  await fs.mkdir(path.join(directory, 'data'))
  await fs.mkdir(path.join(directory, 'uploads'))
  const mongoPort = await freePort()
  let mongoLaunchError
  mongoServer = spawn(mongodExecutable, ['--dbpath', path.join(directory, 'data'), '--bind_ip', '127.0.0.1', '--port', String(mongoPort), '--logpath', path.join(directory, 'mongod.log')], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] })
  mongoServer.once('error', error => { mongoLaunchError = error; requestStop('mongo-error') })
  let mongoLog = ''
  mongoServer.stderr.on('data', data => { mongoLog = (mongoLog + data).slice(-8192) })
  mongoServer.once('exit', () => requestStop('mongo-exit'))
  let mongoReady = false
  for (let attempt = 0; attempt < 100; attempt++) {
    if (mongoLaunchError) throw mongoLaunchError
    if (stopReason) throw new Error(`Disposable MongoDB did not start: ${mongoLog}`)
    mongoReady = await new Promise(resolve => {
      const socket = connect({ port: mongoPort, host: '127.0.0.1' })
      socket.setTimeout(200)
      socket.once('connect', () => { socket.destroy(); resolve(true) })
      socket.once('error', () => resolve(false))
      socket.once('timeout', () => { socket.destroy(); resolve(false) })
    })
    if (mongoReady) break
    await pause(100)
  }
  if (!mongoReady) throw new Error('Disposable MongoDB did not become ready')
  const uri = `mongodb://127.0.0.1:${mongoPort}/${database}`
  const fixtureUrl = new URL(uri)
  if (fixtureUrl.hostname !== '127.0.0.1' || fixtureUrl.port !== String(mongoPort) || fixtureUrl.pathname !== `/${database}`) throw new Error('Unsafe preview database connection')
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000, maxPoolSize: 2, bufferCommands: false })
  if (mongoose.connection.name !== database) throw new Error('Unexpected fixture database')
  const administrator = await Auth.create({ fullname: 'Editor QA Fixture', email, password, role: 'admin', isActive: true })
  await Circular.create({ title: 'Editor QA fixture notice', content: 'Disposable notice for checking the existing Circulars editor action.', createdBy: administrator._id, isPublished: true })
  // Seed only the owned fixture, with local images for actual Lightbox QA.
  await fs.mkdir(path.join(directory, 'uploads', 'gallery'))
  const images = []
  for (const [source, title] of [['walpaper.png', 'Fixture school photograph'], ['domenica.png', 'Fixture historical portrait']]) {
    const filename = `${randomUUID()}.webp`
    await sharp(await fs.readFile(new URL(`../public/${source}`, import.meta.url)))
      .resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 80 })
      .toFile(path.join(directory, 'uploads', 'gallery', filename))
    // Match the upload URL contract used by the real gallery; a bare gallery/
    // path is interpreted as an API route rather than an uploaded image.
    images.push({ image: `/uploads/gallery/${filename}`, title })
  }
  await Gallery.create({ name: 'Editor QA fixture gallery', slug: 'editor-qa-fixture-gallery', images, coverImage: images[0].image, createdBy: administrator._id, isActive: true })
  await mongoose.disconnect()

  const port = await freePort(requestedPort)
  const origin = `http://localhost:${port}`
  // Production enforces an HTTPS public origin behind its loopback proxy.
  // The HTTP-only acceptance client supplies this fixed synthetic proxy origin;
  // interactive browser previews continue to use development mode by default.
  const mutationOrigin=mode==='production'?'https://fixture-school.example.test':origin
  const projectRoot=process.cwd()
  async function startNext(cwd=projectRoot) {
  let nextLaunchError
  const useNpm=options['--verify-final']==='true'
  nextServer = spawn(useNpm?'npm':process.execPath, useNpm?['run','start','--','--hostname','127.0.0.1','--port',String(port)]:[require.resolve('next/dist/bin/next'), mode==='production'?'start':'dev', '--hostname', '127.0.0.1', '--port', String(port)], {
    cwd,
    shell:useNpm&&process.platform==='win32', // Fixed npm command and validated integer port.
    windowsHide: true,
    detached: process.platform !== 'win32',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {
      ...process.env,
      NODE_ENV: mode,
      MONGODB_URI: uri,
      JWT_SECRET: 'fixture-editor-preview-only-secret-abcdefghijklmnopqrstuvwxyz',
      APP_ORIGIN: mutationOrigin,
      UPLOAD_DIR: path.join(directory, 'uploads'),
      NEXT_PUBLIC_API_URL: '/api',
      COOKIE_SECURE: 'false',
      TRUST_PROXY_IP: 'false',
      NEXT_TELEMETRY_DISABLED: '1',
    },
  })
  nextServer.once('error', error => { nextLaunchError = error; requestStop('next-error') })
  const captureLog = data => { nextLog = (nextLog + data).slice(-16384) }
  nextServer.stdout.on('data', captureLog)
  nextServer.stderr.on('data', captureLog)
  nextServer.once('exit', () => {if(!intentionalRestart)requestStop('next-exit')})
  let ready = false
  for (let attempt = 0; attempt < 180; attempt++) {
    if (nextLaunchError) throw nextLaunchError
    if (stopReason) throw new Error(`Owned Next preview exited before readiness:\n${nextLog}`)
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/health`, { signal: AbortSignal.timeout(3000) })
      if (response.ok) { ready = true; break }
    } catch { /* The owned dev server is still compiling. */ }
    await pause(500)
  }
  if (!ready) throw new Error(`Owned Next preview did not become ready:\n${nextLog}`)
  }
  await startNext()
  console.log(`Editor QA preview ready: ${origin}`)
  console.log(`Disposable fixture login: ${email}`)
  console.log(`Disposable fixture password: ${password}`)
  console.log('The fixture Gallery includes two local images for Lightbox and record-action checks.')
  console.log('Only the owned temporary database is used. Send quit and Enter to stop and remove this fixture.')
  if(options['--verify-pages']==='true') {
    const result=await verifyPublicPages({origin,mutationOrigin,email,password}).catch(error=>{console.error('Owned local preview server log:',nextLog);throw error})
    console.log(JSON.stringify({publicSSR:result.status,routes:result.routes.length,sharedRoutes:result.shared.length,metadata:result.metadata,image:result.image.upload}))
    requestStop('selfcheck')
  }
  if(options['--verify-final']==='true') {
    const restart=async()=>{
      intentionalRestart=true
      await stopChild(nextServer,true)
      intentionalRestart=false
      // Prove a deployable release needs neither audit docs/tests nor private
      // checkout files. Only original public assets and runtime files are copied.
      const release=path.join(directory,'release')
      await fs.mkdir(release)
      await fs.cp(path.join(projectRoot,'.next'),path.join(release,'.next'),{recursive:true,filter:source=>!source.startsWith(path.join(projectRoot,'.next','cache'))})
      for(const file of ['package.json','package-lock.json','next.config.mjs','scripts/start.mjs']) {
        await fs.mkdir(path.dirname(path.join(release,file)),{recursive:true})
        await fs.copyFile(path.join(projectRoot,file),path.join(release,file))
      }
      await fs.cp(path.join(projectRoot,'src','server'),path.join(release,'src','server'),{recursive:true})
      const baseline=JSON.parse(await fs.readFile(path.join(projectRoot,'docs/website-editor/baseline/source-hashes.json'),'utf8'))
      for(const {path:file} of baseline.files.filter(file=>file.path.startsWith('public/')&&!file.path.startsWith('public/uploads/'))) {
        await fs.mkdir(path.dirname(path.join(release,file)),{recursive:true})
        await fs.copyFile(path.join(projectRoot,file),path.join(release,file))
      }
      releaseModules=path.join(release,'node_modules')
      await fs.symlink(path.join(projectRoot,'node_modules'),releaseModules,process.platform==='win32'?'junction':'dir')
      await startNext(release)
    }
    const inspectDatabase=async()=>{
      await mongoose.connect(uri,{serverSelectionTimeoutMS:5000,maxPoolSize:2,bufferCommands:false})
      if(mongoose.connection.name!==database)throw new Error('Unexpected audit fixture database')
      try {
        const db=mongoose.connection.db
        const names=(await db.listCollections({}, {nameOnly:true}).toArray()).map(row=>row.name).sort()
        const content=db.collection('websitecontents'),history=db.collection('websitecontentrevisions')
        const explain=await content.find({key:'global.navbar.navbar.src'}).explain('executionStats')
        const historyExplain=await history.find({key:'global.navbar.navbar.src'}).sort({revision:-1}).limit(26).explain('executionStats')
        return {collections:names,contentIndexes:await content.indexes(),historyIndexes:await history.indexes(),contentLookup:{returned:explain.executionStats.nReturned,documentsExamined:explain.executionStats.totalDocsExamined,keysExamined:explain.executionStats.totalKeysExamined},historyLookup:{returned:historyExplain.executionStats.nReturned,documentsExamined:historyExplain.executionStats.totalDocsExamined,keysExamined:historyExplain.executionStats.totalKeysExamined}}
      } finally {await mongoose.disconnect()}
    }
    const result=await verifyFinalIntegration({origin,mutationOrigin,email,password,restart,inspectDatabase,stage:options['--stage']||'05'}).catch(error=>{console.error('Owned local preview server log:',nextLog);throw error})
    console.log(JSON.stringify({finalIntegration:result.status,restart:result.restart.status,securityChecks:result.security.length}))
    requestStop('selfcheck')
  }
  await stopRequested
  if (!['stdin', 'signal', 'selfcheck'].includes(stopReason)) throw new Error(`Owned preview process stopped unexpectedly (${stopReason}):\n${nextLog}`)
} finally {
  process.off('SIGINT', signalStop)
  process.off('SIGTERM', signalStop)
  process.stdin.off('data', receiveInput)
  process.stdin.pause()
  let cleanupError
  try { await stopChild(nextServer, true) } catch (error) { cleanupError = error }
  // The parent only ever opened the explicitly checked fixture database.
  if (mongoose.connection.readyState !== 0) {
    if (mongoose.connection.name && mongoose.connection.name !== database) throw new Error('Refusing to disconnect an unexpected database')
    await mongoose.disconnect()
  }
  try { await stopChild(mongoServer) } catch (error) { cleanupError ||= error }
  if (cleanupError) throw cleanupError
  if(releaseModules)await fs.unlink(releaseModules)
  const target = path.resolve(directory)
  if (path.dirname(target) !== path.resolve(os.tmpdir()) || !path.basename(target).startsWith('stmary-gc-editor-preview-')) throw new Error('Unsafe preview cleanup target')
  await fs.rm(target, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 })
  console.log('Owned editor QA processes stopped and temporary fixture removed.')
}
