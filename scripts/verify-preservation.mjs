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
