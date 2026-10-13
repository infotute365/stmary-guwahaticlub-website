import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeAdminEmail, validateUploadBuffer } from '../src/server/util/validation.mjs'
import { resolveRoutePath } from '../src/server/route-path.js'

test('normalizeAdminEmail trims whitespace and lowercases the address', () => {
  assert.equal(normalizeAdminEmail('  Admin@Example.COM  '), 'admin@example.com')
})

test('normalizeAdminEmail rejects malformed addresses', () => {
  assert.throws(() => normalizeAdminEmail('not-an-email'), /invalid email/i)
})

test('resolveRoutePath resolves async Next.js params before reading path', async () => {
  const request = { url: 'http://localhost:3000/api/auth/session' }
  const context = { params: Promise.resolve({ path: ['auth', 'session'] }) }

  assert.deepEqual(await resolveRoutePath(request, context), ['auth', 'session'])
})

test('validateUploadBuffer accepts a real PDF signature', () => {
  const buffer = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF')
  assert.doesNotThrow(() => validateUploadBuffer(buffer, 'application/pdf', 'example.pdf'))
})

test('validateUploadBuffer rejects a mismatched MIME type or invalid signature', () => {
  const buffer = Buffer.from('not-a-pdf')
  assert.throws(() => validateUploadBuffer(buffer, 'application/pdf', 'example.pdf'), /invalid pdf/i)
})

test('validateUploadBuffer rejects oversized uploads', () => {
  const buffer = Buffer.alloc(3 * 1024 * 1024)
  assert.throws(() => validateUploadBuffer(buffer, 'image/png', 'large.png', { maxSize: 2 * 1024 * 1024 }), /too large/i)
})
