import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
import amendments from '../docs/website-editor/public-copy-amendments.json' with {type:'json'}

const digest=value=>createHash('sha256').update(value).digest('hex')
export function applyPublicCopyAmendments(file,source){
  const change=amendments.changes.find(change=>change.path===file)
  if(!change)return source
  assert.equal(digest(source),change.beforeSha256,`${file}: incorrect copy-amendment input`)
  for(const {before,after} of change.replacements){
    assert.equal(source.split(before).length,2,`${file}: expected one exact copy-amendment location`)
    source=source.replace(before,after)
  }
  assert.equal(digest(source),change.afterSha256,`${file}: copy amendment exceeded its reviewed scope`)
  return source
}
