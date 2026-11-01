import fs from 'node:fs/promises'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'

const baseline = JSON.parse((await fs.readFile(new URL('../docs/verification/baseline.json', import.meta.url), 'utf8')).replace(/^\uFEFF/, ''))
const changes = []
// Explicitly requested after the backend refactor: small footer login button.
// Keep the original baseline intact and accept only this reviewed UI revision.
const approvedUiHashes = {
  'src/components/layout/Footer.jsx': '962b0df817433e88b52531f4141599a33e52f486f1bb5bc79ebe26516a82105c',
}
const approvedUiChanges = []
// Exact Task 03 integrations and the already committed bank-link fix.
// Retain the historical baseline; unlisted changes still fail closed.
const editorApprovals = JSON.parse(await fs.readFile(new URL('../docs/verification/approved-website-editor.json', import.meta.url), 'utf8'))
const seenApprovals = new Set()
for (const approval of editorApprovals.files) {
  const original = baseline.files.find(item => item.path === approval.path)
  assert.equal(approval.baselineSha256, original?.sha256, `Wrong approval base: ${approval.path}`)
  assert.ok(approval.reason?.trim(), `Missing review rationale: ${approval.path}`)
  assert.match(approval.sha256, /^[a-f\d]{64}$/)
  assert.ok(!seenApprovals.has(approval.path), `Duplicate UI approval: ${approval.path}`)
  seenApprovals.add(approval.path)
  if (Object.hasOwn(approvedUiHashes, approval.path)) assert.equal(approval.previousApprovedSha256, approvedUiHashes[approval.path], `Incorrect prior UI approval: ${approval.path}`)
  approvedUiHashes[approval.path] = approval.sha256
}
let preserved = 0
for (const item of baseline.files) {
  const current = await fs.readFile(item.path).catch(() => null)
  const hash = current && createHash('sha256').update(current).digest('hex')
  const matches = hash === item.sha256
  const immutable = item.path.startsWith('app/') || item.path.startsWith('public/') || item.path.startsWith('src/assets/') || item.path.startsWith('src/site-pages/') || item.path.startsWith('src/components/') || item.path.startsWith('src/context/') || item.path.startsWith('src/hooks/') || item.path.startsWith('src/utils/') || (item.path.startsWith('src/server/model/') && !item.path.endsWith('auth.model.js'))
  if (immutable) {
    if (matches) preserved++
    else {
      assert.ok(hash && hash === approvedUiHashes[item.path], `Preserved website file changed: ${item.path}`)
      approvedUiChanges.push(item.path)
    }
  }
  if (!matches) changes.push(item.path)
}
console.log(JSON.stringify({ immutableFilesPreserved: preserved, approvedUiChanges, authorizedSourceChanges: changes }, null, 2))
