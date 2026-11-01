import { cache } from 'react'
import connectDB from '../config/database.js'
import { getContentFields, validateContentValue } from './websiteContentPolicy.js'
import { readContentStates } from './websiteContentStore.js'
import routes from '../../../docs/website-editor/baseline/routes.json' with { type: 'json' }

export async function loadPublishedWebsiteContent() {
  const fields = new Map(routes.flatMap(route => getContentFields(route.path)).filter(field => field.status === 'editable').map(field => [field.key, field]))
  await connectDB()
  const states = await readContentStates([...fields.keys()])
  const overrides = {}
  for (const state of states) {
    const field = fields.get(state.key)
    if (!field || !state.hasOverride || state.scope !== field.scope || state.pagePath !== field.pagePath || state.contentType !== field.contentType || !Number.isSafeInteger(state.revision) || state.revision < 1) continue
    try { overrides[field.key] = { value: validateContentValue(field, state.value), revision: state.revision, contentType: field.contentType } }
    catch (error) { if (![400,403,404].includes(error.status)) throw error }
  }
  return overrides
}

// Request-scoped React cache shares one snapshot between metadata and layout.
// No cross-request cache: saves are durable before the next server render.
export const getServerWebsiteContent = cache(async () => {
  try { return await loadPublishedWebsiteContent() }
  catch { return {} } // The exact original website remains available on DB outage.
})
