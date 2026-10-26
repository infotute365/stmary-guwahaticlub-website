import test from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'

function seed(overrides) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['./scripts/seed-admin.mjs'], {
      env: {
        ...process.env,
        NODE_ENV: 'test',
        // Deliberately invalid URI: credential validation must happen first.
        MONGODB_URI: 'invalid-uri-containing-private-fixture',
        ADMIN_INITIAL_EMAIL: 'fixture@example.com',
        ADMIN_INITIAL_PASSWORD: 'Fixture-Only-Aa123!',
        ...overrides,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    })
    let output = ''
    child.stdout.on('data', data => { output += data })
    child.stderr.on('data', data => { output += data })
    child.on('error', reject)
    child.on('exit', code => resolve({ code, output }))
  })
}

test('seed CLI explains a short password before trying the database and does not disclose credentials', async () => {
  const result = await seed({ ADMIN_INITIAL_PASSWORD: 'Short-Aa1!' })
  assert.equal(result.code, 1)
  assert.match(result.output, /Password must have at least 12 characters/)
  assert.doesNotMatch(result.output, /Short-Aa1!|fixture@example\.com|invalid-uri-containing-private-fixture/)
})

test('seed CLI explains missing or malformed email without disclosing the configured value', async () => {
  for (const email of ['', 'private-invalid-fixture']) {
    const result = await seed({ ADMIN_INITIAL_EMAIL: email })
    assert.equal(result.code, 1)
    assert.match(result.output, /required for provisioning|Invalid email address/)
    assert.doesNotMatch(result.output, /private-invalid-fixture|Fixture-Only-Aa123!|invalid-uri-containing-private-fixture/)
  }
})

test('seed CLI redacts a malformed database URI from its failure output', async () => {
  const result = await seed({})
  assert.equal(result.code, 1)
  assert.match(result.output, /MONGODB_URI has an invalid format/)
  assert.doesNotMatch(result.output, /invalid-uri-containing-private-fixture|Fixture-Only-Aa123!|fixture@example\.com|\n\s+at /)
})
