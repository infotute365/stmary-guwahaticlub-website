import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const json = async file => JSON.parse((await fs.readFile(file, 'utf8')).replace(/^\uFEFF/, ''))
const digest = bytes => createHash('sha256').update(bytes).digest('hex')
const baseline = await json('docs/website-editor/baseline/source-hashes.json')
const seal = await json('docs/website-editor/artifact-hashes.json')
const backend = await json('docs/website-editor/task02-changes.json')
const editor = await json('docs/website-editor/task03-changes.json')
const completion = await json('docs/website-editor/task03-completion-changes.json')
const coverage = await json('docs/website-editor/task04-changes.json')
const audit = await json('docs/website-editor/task05-changes.json')
const master = await json('docs/website-editor/master-changes.json')
const copyChanges = await json('docs/website-editor/public-copy-changes.json')
const expected = new Map()
function add(file) {
  if (expected.has(file.path)) assert.equal(expected.get(file.path), file.sha256, `Conflicting evidence: ${file.path}`)
  expected.set(file.path, file.sha256)
}
for (const file of [...baseline.files, ...seal.files]) add(file)
for (const stage of [backend, editor, completion, coverage, audit, master, copyChanges]) {
  for (const change of stage.modifiedFiles) {
    assert.equal(expected.get(change.path), change.beforeSha256, `Incorrect reviewed transition: ${change.path}`)
    expected.set(change.path, change.afterSha256)
  }
  for (const file of stage.newFiles) add(file)
  for (const file of stage.previousEvidence || []) add(file)
}
for (const [file, hash] of expected) assert.equal(digest(await fs.readFile(file)), hash, `Unreviewed implementation/evidence change: ${file}`)
async function checkDirectory(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = `${directory}/${entry.name}`
    if (entry.isDirectory()) await checkDirectory(file)
    else if (file.startsWith('public/uploads/') && file !== 'public/uploads/.gitkeep') continue
    else assert.ok(expected.has(file), `Unreviewed source file: ${file}`)
  }
}
for (const directory of ['app', 'src', 'public', 'scripts', 'tests', 'deploy']) await checkDirectory(directory)
const bindings = spawnSync(process.execPath, ['scripts/task04-bindings.mjs', '--check'], {encoding:'utf8',windowsHide:true})
if(bindings.stdout)process.stdout.write(bindings.stdout)
if(bindings.stderr)process.stderr.write(bindings.stderr)
assert.equal(bindings.status,0,'Exact registry binding verification failed')
const legacy = spawnSync(process.execPath, ['scripts/verify-preservation.mjs'], { encoding: 'utf8', windowsHide: true })
if (legacy.stdout) process.stdout.write(legacy.stdout)
if (legacy.stderr) process.stderr.write(legacy.stderr)
assert.equal(legacy.status, 0, 'Historical preservation check failed')
console.log(JSON.stringify({ masterPreservation: 'PASS', exactFilesVerified: expected.size,
  reviewedAuditChanges: master.modifiedFiles.length, frozenTask01Evidence: 'unchanged',
  originalStylesAssetsRoutesAndPaymentDefaults: 'unchanged', historicalPreservation: 'PASS' }, null, 2))
