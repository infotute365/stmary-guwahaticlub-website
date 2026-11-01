import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { routeFor } from '../src/server/route-adapter.js'

const json = async file => JSON.parse((await fs.readFile(file, 'utf8')).replace(/^\uFEFF/, ''))
const digest = value => createHash('sha256').update(value).digest('hex')
const baseline = await json('docs/website-editor/baseline/source-hashes.json')
const changes = await json('docs/website-editor/task02-changes.json')
const artifactSeal = await json('docs/website-editor/artifact-hashes.json')
const authorized = new Map(changes.modifiedFiles.map(file => [file.path, file]))
assert.deepEqual([...authorized.keys()].sort(), ['src/server/route-adapter.js', 'src/services/api.js'])
let originalFilesUnchanged = 0
for (const file of baseline.files) {
  const current = await fs.readFile(file.path)
  const approval = authorized.get(file.path)
  if (approval) {
    assert.equal(approval.beforeSha256, file.sha256, `Incorrect original hash: ${file.path}`)
    assert.equal(digest(current), approval.afterSha256, `Backend integration changed after review: ${file.path}`)
  } else {
    assert.equal(digest(current), file.sha256, `Unexpected original-file change: ${file.path}`)
    originalFilesUnchanged++
  }
}
for (const file of [...artifactSeal.files, ...changes.newFiles]) {
  assert.equal(digest(await fs.readFile(file.path)), file.sha256, `Evidence or new implementation changed: ${file.path}`)
}
async function walk(directory) {
  const result = []
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = `${directory}/${entry.name}`
    if (entry.isDirectory()) result.push(...await walk(file))
    else result.push(file)
  }
  return result
}
const known = new Set([...baseline.files, ...artifactSeal.files, ...changes.newFiles].map(file => file.path))
for (const directory of ['app', 'src', 'public', 'scripts', 'tests', 'deploy']) for (const file of await walk(directory)) {
  if (file.startsWith('public/uploads/') && file !== 'public/uploads/.gitkeep') continue
  assert.ok(known.has(file), `Unreviewed source file: ${file}`)
}
const contracts = await json('docs/website-editor/baseline/contracts.json')
for (const previous of contracts.endpoints) {
  const current = routeFor(previous.method, previous.path.slice('/api/'.length).split('/'))
  assert.ok(current, `Missing original API: ${previous.path}`)
  assert.equal(current.handler.name, previous.handler)
  assert.equal(Boolean(current.auth), previous.authenticated)
  assert.equal(Boolean(current.refresh), previous.refresh)
  assert.deepEqual(current.params || {}, previous.params)
}
const result = spawnSync(process.execPath, ['scripts/verify-preservation.mjs'], { encoding: 'utf8', windowsHide: true })
if (result.stdout) process.stdout.write(result.stdout)
if (result.stderr) process.stderr.write(result.stderr)
console.log(JSON.stringify({
  task02Preservation: 'PASS',
  unchangedOriginalFiles: originalFilesUnchanged,
  exactReviewedBackendIntegrations: authorized.size,
  task01ArtifactsUnchanged: artifactSeal.files.length,
  allOriginalPublicSources: 'unchanged',
  originalApiContracts: 'unchanged',
  legacyPreservation: result.status === 0 ? 'PASS' : 'FAIL (pre-existing TopBar mismatch; not waived)',
}, null, 2))
// This addendum does not convert the old failing gate into a successful check.
if (result.status !== 0) process.exitCode = 1
