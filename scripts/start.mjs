import nextEnv from '@next/env'
import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'
import { jwtSecret } from '../src/server/config/auth.js'
import { uploadRoot } from '../src/server/config/localStorage.js'
import { appOrigin } from '../src/server/util/requestSecurity.js'

process.env.NODE_ENV = 'production'
nextEnv.loadEnvConfig(process.cwd(), false)
try {
  if (!process.env.MONGODB_URI?.trim()) throw new Error('MONGODB_URI is required')
  jwtSecret()
  appOrigin({ url: 'http://localhost' })
  uploadRoot()
} catch (error) {
  console.error(`Startup configuration error: ${error.message}`)
  process.exit(1)
}
const require = createRequire(import.meta.url)
const child = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'start', ...process.argv.slice(2)], { stdio: 'inherit', env: process.env })
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal))
child.on('error', () => { console.error('Unable to start Next.js'); process.exitCode = 1 })
child.on('exit', code => { process.exitCode = code ?? 1 })
