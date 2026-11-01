import { CatchError, TryError } from '../util/error.js'
import { getContentField, getContentFields, validateContentPath, validateContentValue, validateExpectedRevision, websiteContentCatalogField } from '../util/websiteContentPolicy.js'
import { readContentStates, recoverContentStates, changeWebsiteContent, getWebsiteContentHistory, findWebsiteContentRevision } from '../util/websiteContentStore.js'
import { processWebsiteImage, validateWebsiteImageReference } from '../util/websiteImageProcessor.js'

const requireAdministrator = req => {
  // AuthMiddleware checks the active database account, role and JWT version.
  // Its session projection deliberately does not include an isActive property.
  if (!req.session || !['admin', 'super-admin'].includes(req.session.role) || !/^[a-f\d]{24}$/i.test(req.session.id)) throw TryError('Unauthorized access', 401)
}

function query(req, allowed) {
  // Keep duplicate query values visible for new endpoints without changing the
  // existing adapter/query semantics of any established module.
  const params = req.websiteContentQuery || Object.entries(req.query || {})
  const seen = new Set()
  const result = {}
  for (const [key, value] of params) {
    if (!allowed.includes(key) || seen.has(key) || typeof value !== 'string') throw TryError('Invalid content query', 400)
    seen.add(key)
    result[key] = value
  }
  return result
}

function body(req, allowed, required) {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body) || Object.getPrototypeOf(req.body) !== Object.prototype) throw TryError('Expected a JSON object', 400)
  for (const key of Object.keys(req.body)) if (!allowed.includes(key)) throw TryError('Invalid content request field', 400)
  for (const key of required) if (!Object.hasOwn(req.body, key)) throw TryError(`Missing ${key}`, 400)
  return req.body
}

function metadataMatches(field, state) {
  return state.scope === field.scope && state.pagePath === field.pagePath && state.contentType === field.contentType
}

export const getPublishedWebsiteContent = async (req, res) => {
  try {
    const options = query(req, ['path'])
    const pagePath = validateContentPath(options.path ?? '/')
    const fields = getContentFields(pagePath).filter(field => field.status === 'editable')
    const indexed = new Map(fields.map(field => [field.key, field]))
    const states = await readContentStates(fields.map(field => field.key))
    const overrides = Object.create(null)
    for (const state of states) {
      const field = indexed.get(state.key)
      if (!field || state.hasOverride !== true || !Number.isSafeInteger(state.revision) || state.revision < 1 || !metadataMatches(field, state)) continue
      let value
      try { value = validateContentValue(field, state.value) }
      catch (err) {
        // A manually corrupted database row must not replace an original
        // fallback or prevent other independently valid fields from loading.
        if ([400, 403, 404].includes(err.status)) continue
        throw err
      }
      // Explicit projection: no pending operations, actor IDs or history data.
      overrides[field.key] = { value, revision: state.revision, contentType: field.contentType }
    }
    res.json({ path: pagePath, overrides })
  } catch (err) { CatchError(err, res, 'Failed to read website content') }
}

export const getWebsiteContentCatalog = async (req, res) => {
  try {
    requireAdministrator(req)
    const options = query(req, ['path'])
    const pagePath = validateContentPath(options.path ?? '/')
    const fields = getContentFields(pagePath)
    // Recovery is an administrator operation; public reads never seed or repair.
    const recovered = await recoverContentStates(fields.filter(field => field.status === 'editable').map(field => field.key))
    const states = new Map(recovered.map(state => [state.key, state]))
    res.json({ path: pagePath, fields: fields.map(field => websiteContentCatalogField(field, states.get(field.key))) })
  } catch (err) { CatchError(err, res, 'Failed to read website content catalog') }
}

export const saveWebsiteContent = async (req, res) => {
  try {
    requireAdministrator(req)
    query(req, [])
    const field = getContentField(req.params.key, { editable: true })
    const input = body(req, ['value', 'expectedRevision', 'contentType', 'confirmDestination'], ['value', 'expectedRevision'])
    if (field.contentType === 'url' && input.confirmDestination !== true) throw TryError('Confirm this destination change before saving',400)
    if (input.contentType !== undefined && input.contentType !== field.contentType) throw TryError('Invalid content type', 400)
    const expectedRevision = validateExpectedRevision(input.expectedRevision)
    const value = validateContentValue(field, input.value)
    await validateWebsiteImageReference(field,value)
    const result = await changeWebsiteContent(field, { expectedRevision, value, administrator: req.session.id, action: 'save' })
    res.json({ message: 'Website content saved successfully', field: result })
  } catch (err) { CatchError(err, res, 'Failed to save website content') }
}

export const getWebsiteContentRevisions = async (req, res) => {
  try {
    requireAdministrator(req)
    const field = getContentField(req.params.key, { editable: true })
    const options = query(req, ['before', 'limit'])
    const numeric = (value, label, max) => {
      if (value === undefined) return null
      if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) > max) throw TryError(`Invalid ${label}`, 400)
      return Number(value)
    }
    const before = numeric(options.before, 'revision cursor', Number.MAX_SAFE_INTEGER - 1)
    const limit = numeric(options.limit, 'history limit', 100) ?? 25
    const history = await getWebsiteContentHistory(field, { before, limit })
    res.json({ key: field.key, ...history })
  } catch (err) { CatchError(err, res, 'Failed to read website content history') }
}

export const restoreWebsiteContent = async (req, res) => {
  try {
    requireAdministrator(req)
    query(req, [])
    const field = getContentField(req.params.key, { editable: true })
    const input = body(req, ['revision', 'expectedRevision', 'confirmDestination'], ['revision', 'expectedRevision'])
    if (field.contentType === 'url' && input.confirmDestination !== true) throw TryError('Confirm this destination change before restoring',400)
    const expectedRevision = validateExpectedRevision(input.expectedRevision)
    if (!Number.isSafeInteger(input.revision) || input.revision < 1 || input.revision >= Number.MAX_SAFE_INTEGER) throw TryError('Invalid revision to restore', 400)
    const previous = await findWebsiteContentRevision(field, input.revision)
    if (!previous) throw TryError('Content revision not found', 404)
    const value = validateContentValue(field, previous.newValue)
    await validateWebsiteImageReference(field,value)
    const result = await changeWebsiteContent(field, { expectedRevision, value, hasOverride: previous.hasOverride, administrator: req.session.id, action: 'restore', restoredFromRevision: input.revision })
    res.json({ message: 'Website content revision restored successfully', field: result })
  } catch (err) { CatchError(err, res, 'Failed to restore website content') }
}

export const resetWebsiteContent = async (req, res) => {
  try {
    requireAdministrator(req)
    query(req, [])
    const field = getContentField(req.params.key, { editable: true })
    const input = body(req, ['expectedRevision', 'confirmDestination'], ['expectedRevision'])
    if (field.contentType === 'url' && input.confirmDestination !== true) throw TryError('Confirm restoring the original destination',400)
    const expectedRevision = validateExpectedRevision(input.expectedRevision)
    const result = await changeWebsiteContent(field, { expectedRevision, value: field.defaultValue, hasOverride: false, administrator: req.session.id, action: 'reset' })
    res.json({ message: 'Website content reset successfully', field: result })
  } catch (err) { CatchError(err, res, 'Failed to reset website content') }
}

export const uploadWebsiteContentImage = async (req,res) => {
  try {
    requireAdministrator(req)
    query(req,[])
    const field=getContentField(req.params.key,{editable:true})
    if(!req.file)throw TryError('Choose an image to upload',400)
    const image=await processWebsiteImage(req.file,field)
    res.json({message:'Image prepared. Preview it, then save to publish.',image})
  } catch(error){CatchError(error,res,'Website image upload failed')}
}
