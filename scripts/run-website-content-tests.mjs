// Run the complete test suite against a new standalone mongod process. Never
// reads .env.local, connects to the school database or changes its service.
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { createServer, connect } from 'node:net'
import { spawn } from 'node:child_process'

const configured = process.argv.indexOf('--mongod')
const executable = configured >= 0 ? process.argv[configured + 1] : process.env.MONGOD_BINARY || (process.platform === 'win32' ? 'C:/Program Files/MongoDB/Server/8.0/bin/mongod.exe' : 'mongod')
if (!executable) throw new Error('Specify --mongod with the local server binary path')
const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'stmary-gc-content-mongo-'))
const probe = createServer()
await new Promise((resolve, reject) => { probe.once('error', reject); probe.listen(0, '127.0.0.1', resolve) })
const port = probe.address().port
await new Promise(resolve => probe.close(resolve))
let server
let serverOutput = ''
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
try {
  await fs.mkdir(path.join(directory, 'data'))
  server = spawn(executable, ['--dbpath', path.join(directory, 'data'), '--bind_ip', '127.0.0.1', '--port', String(port), '--logpath', path.join(directory, 'mongod.log')], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
  let launchError
  server.on('error', error => { launchError = error })
  server.stdout.on('data', data => { serverOutput += data })
  server.stderr.on('data', data => { serverOutput += data })
  let ready = false
  for (let attempt = 0; attempt < 100; attempt++) {
    if (launchError) throw launchError
    if (server.exitCode !== null) throw new Error(`Disposable MongoDB exited: ${serverOutput}`)
    ready = await new Promise(resolve => {
      const socket = connect({ port, host: '127.0.0.1' })
      socket.setTimeout(100)
      socket.once('connect', () => { socket.destroy(); resolve(true) })
      socket.once('error', () => resolve(false))
      socket.once('timeout', () => { socket.destroy(); resolve(false) })
    })
    if (ready) break
    await delay(100)
  }
  if (!ready) throw new Error('Disposable MongoDB did not become ready')
  console.log('Testing against a new isolated standalone MongoDB process and disposable test databases.')
  const npmTest = process.argv.includes('--npm-test')
  const child = spawn(npmTest ? 'npm' : process.execPath, npmTest ? ['test'] : ['--test'], {
    windowsHide: true,
    shell: npmTest && process.platform === 'win32', // Fixed "npm test"; no interpolated arguments.
    stdio: 'inherit',
    env: { ...process.env, TEST_MONGODB_URI: `mongodb://127.0.0.1:${port}/stmary_gc_test_website_content`, ...(process.argv.includes('--master') ? {WEBSITE_EDITOR_TEST_STAGE:'master'} : process.argv.includes('--stage05') ? { WEBSITE_EDITOR_TEST_STAGE: '05' } : {}) },
  })
  process.exitCode = await new Promise((resolve, reject) => { child.once('error', reject); child.once('exit', code => resolve(code ?? 1)) })
} finally {
  if (server?.pid && server.exitCode === null && server.signalCode === null) {
    const stopped = new Promise(resolve => server.once('exit', resolve))
    server.kill('SIGTERM')
    await Promise.race([stopped, delay(10000)])
    if (server.exitCode === null && server.signalCode === null) {
      server.kill('SIGKILL')
      await stopped
    }
  }
  // Resolve/check the exact target before any recursive Windows cleanup.
  const target = path.resolve(directory)
  if (path.dirname(target) !== path.resolve(os.tmpdir()) || !path.basename(target).startsWith('stmary-gc-content-mongo-')) throw new Error('Unsafe disposable MongoDB cleanup path')
  await fs.rm(target, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 })
}
