import fs from 'node:fs'
import path from 'node:path'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import AuthModel from '../src/server/model/auth.model.js'
import { normalizeAdminEmail, requireServerEnv } from '../src/server/util/validation.mjs'

const repairRequested = process.argv.includes('--repair-password') || process.argv.includes('--reset-password')

const loadEnvFileIfExists = (envFilePath) => {
  if (!fs.existsSync(envFilePath)) return

  const content = fs.readFileSync(envFilePath, 'utf8')
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const equalsIndex = trimmed.indexOf('=')
    if (equalsIndex === -1) continue

    const key = trimmed.slice(0, equalsIndex).trim()
    let value = trimmed.slice(equalsIndex + 1).trim()

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    process.env[key] = value
  }
}

const localEnvPath = path.resolve(process.cwd(), '.env.local')
loadEnvFileIfExists(localEnvPath)

const main = async () => {
  const mongoUri = requireServerEnv('MONGODB_URI')
  const seedEmail = normalizeAdminEmail(process.env.ADMIN_INITIAL_EMAIL || '')
  const seedPassword = String(process.env.ADMIN_INITIAL_PASSWORD || '').trim()

  if (!seedEmail) {
    throw new Error('Missing required environment variable: ADMIN_INITIAL_EMAIL')
  }

  if (!seedPassword) {
    throw new Error('Missing required environment variable: ADMIN_INITIAL_PASSWORD')
  }

  await mongoose.connect(mongoUri, { bufferCommands: false, serverSelectionTimeoutMS: 15000 })

  const existingUser = await AuthModel.findOne({ email: seedEmail }).select('+password')
  if (!existingUser) {
    await AuthModel.create({
      fullname: 'Super Admin',
      email: seedEmail,
      password: seedPassword,
      role: 'super-admin',
      isActive: true
    })

    console.log('Initial administrator account created successfully.')
    return
  }

  const passwordMatches = await bcrypt.compare(seedPassword, existingUser.password)
  if (passwordMatches) {
    console.log('Admin account already exists; no changes were made.')
    return
  }

  if (!repairRequested) {
    console.log('Admin account already exists, but the stored password does not match the configured bootstrap credentials. Run: npm run seed:admin -- --repair-password')
    process.exitCode = 1
    return
  }

  existingUser.password = seedPassword
  await existingUser.save()

  console.log('Local admin password repaired successfully.')
}

main()
  .catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
