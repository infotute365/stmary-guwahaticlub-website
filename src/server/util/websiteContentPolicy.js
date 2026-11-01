import registry from '../../../docs/website-editor/baseline/content-registry.json' with { type: 'json' }
import routes from '../../../docs/website-editor/baseline/routes.json' with { type: 'json' }
import { TryError } from './error.js'
import { websiteContentApprovals } from './websiteContentApprovals.js'

// Frozen Task 01 fields plus explicitly reviewed static image/link approvals.
// Request scope, type, filename, choices and confirmation flags cannot grant them.
const fields = new Map()
for (const entry of registry.fields) {
  if (fields.has(entry.key)) throw new Error('Duplicate website content registry key')
  const original = entry.defaultValue
  const approval = websiteContentApprovals[entry.key]
  if (approval && (entry.audience !== 'public' || entry.existingDataSource !== 'static-source' || entry.contentType !== approval.contentType || original !== approval.defaultValue)) throw new Error('Approved content slot does not match the frozen registry')
  const prose = /paragraph|description|content|message|answer|details|notice-print/i.test(`${entry.fieldName} ${entry.dataProperty || ''}`)
  const maxLength = typeof original === 'string'
    ? Math.max(original.length, original.includes('\n') || original.length > 1000 ? 10000 : prose ? 5000 : /heading|label|title|placeholder/i.test(entry.fieldName) ? 300 : 1000)
    : null
  fields.set(entry.key, Object.freeze({
    key: entry.key,
    scope: entry.scope,
    pagePath: entry.pagePath,
    section: entry.section,
    fieldName: entry.fieldName,
    contentType: entry.contentType,
    defaultValue: original,
    status: approval ? 'editable' : entry.status,
    choices: approval?.choices,
    uploadAllowed: approval?.uploadAllowed === true,
    backgroundImage: approval?.backgroundImage === true,
    audience: entry.audience,
    existingDataSource: entry.existingDataSource,
    usedOnRoutes: Object.freeze([...entry.usedOnRoutes]),
    maxLength,
  }))
}
const pagePaths = new Set(routes.map(route => route.path))
const isEditable = field => field.audience === 'public' && field.status === 'editable' && field.existingDataSource === 'static-source'

export function getContentField(key, { editable = false } = {}) {
  if (typeof key !== 'string' || key.length > 300 || !/^[a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*$/.test(key) || key.split('.').some(part => ['__proto__', 'constructor', 'prototype'].includes(part))) throw TryError('Unknown content key', 404)
  const field = fields.get(key)
  if (!field) throw TryError('Unknown content key', 404)
  if (editable && !isEditable(field)) throw TryError('This content field is protected', 403)
  return field
}

export function validateContentPath(value) {
  // Exact route membership rejects traversal, alternate encodings, origins,
  // query fragments and grouping paths that are not actual public pages.
  if (typeof value !== 'string' || !pagePaths.has(value)) throw TryError('Invalid public page path', 400)
  return value
}

export function getContentFields(pagePath) {
  validateContentPath(pagePath)
  return [...fields.values()].filter(field => field.audience === 'public' && field.usedOnRoutes.includes(pagePath))
}

export function validateExpectedRevision(value) {
  if (!Number.isSafeInteger(value) || value < 0 || value >= Number.MAX_SAFE_INTEGER) throw TryError('expectedRevision must be a nonnegative integer', 400)
  return value
}

function securityProbe(value) {
  // Inspection only; the stored string is never decoded, trimmed or rewritten.
  let probe = value
  for (let pass = 0; pass < 3; pass++) {
    probe = probe.replace(/&#(?:x([a-f\d]+)|(\d+));?/gi, (_match, hex, decimal) => {
      const code = Number.parseInt(hex || decimal, hex ? 16 : 10)
      return code <= 0x10ffff ? String.fromCodePoint(code) : '\uFFFD'
    }).replace(/&(lt|gt|colon|tab|newline|amp);/gi, (_match, entity) => ({ lt: '<', gt: '>', colon: ':', tab: '\t', newline: '\n', amp: '&' })[entity.toLowerCase()])
    try { probe = decodeURIComponent(probe) } catch { /* Ordinary % in prose. */ }
  }
  return probe
}

export function validateApprovedImageUrl(value) {
  if (typeof value !== 'string' || value.length > 2048 || /[\\\x00-\x20<>"'`]/.test(value)) throw TryError('Invalid approved image URL', 400)
  if (/%(?:2e|2f|5c|00)|(?:^|\/)\.{1,2}(?:\/|$)/i.test(value)) throw TryError('Invalid approved image URL', 400)
  // The existing managed upload service generates UUID-named WebP assets.
  if (/^\/uploads\/(?:gallery|staff)\/[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}\.webp$/i.test(value)) return value
  // External images may only retain an exact, already inventoried reference.
  if ([...fields.values()].some(field => field.contentType === 'image' && field.defaultValue === value && /^https:\/\//.test(value))) return value
  throw TryError('Image URL is not approved', 400)
}

export function validateContentValue(field, value) {
  // Re-resolve metadata to prevent a caller-created object from changing policy.
  const approved = getContentField(field?.key, { editable: true })
  if (field.contentType !== approved.contentType) throw TryError('Invalid content type', 400)
  if (approved.choices) {
    if (typeof value === 'string' && approved.choices.some(choice => choice.value === value)) return value
    const source = approved.backgroundImage && typeof value === 'string' ? value.match(/^url\('([^']+)'\)$/)?.[1] : value
    if (approved.uploadAllowed && typeof source === 'string' && /^\/uploads\/website\/[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}\/(?:[1-9]\d{0,3})\.webp$/i.test(source)) return value
    throw TryError('Choose an approved image or destination', 400)
  }
  if (approved.contentType === 'number') {
    if (typeof value !== 'number' || !Number.isFinite(value) || !Number.isSafeInteger(value) || value < 0 || value > 1000000000) throw TryError('Invalid numeric content value', 400)
    return value
  }
  if (approved.contentType === 'image') return validateApprovedImageUrl(value)
  // Non-approved URL/image fields remain protected. No request can unlock them.
  if (approved.contentType !== 'text' || typeof value !== 'string') throw TryError('Invalid content type', 400)
  if (value.length > approved.maxLength) throw TryError(`Content value exceeds ${approved.maxLength} characters`, 400)
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(value)) throw TryError('Invalid content characters', 400)
  const probe = securityProbe(value)
  if (/<\s*[!/?a-z][^>]*>|<!--|\b(?:javascript|vbscript|data|file|blob)\s*:|\bon\w+\s*=|\b(?:window|document|globalThis)\s*\.|\b(?:eval|Function)\s*\(|\b(?:const|let|var)\s+[a-z_$][\w$]*\s*=|=>|@(?:import|font-face)|\b(?:expression|url)\s*\(|[{}]/i.test(probe) || /\b(?:javascript|vbscript|data|file|blob):/i.test(probe.replace(/[\x00-\x20]/g, '')) || /(?:^|;)\s*(?:color|background(?:-color|-image)?|font(?:-size|-family|-weight)?|margin|padding|position|display|width|height|transform)\s*:/i.test(probe)) throw TryError('Content must be plain text without executable markup or code', 400)
  return value
}

export function resolveWebsiteContentValue(field, state) {
  if (!state?.hasOverride) return field.defaultValue
  return validateContentValue(field, state.value)
}

export function websiteContentCatalogField(field, state) {
  return {
    key: field.key,
    scope: field.scope,
    pagePath: field.pagePath,
    section: field.section,
    fieldName: field.fieldName,
    contentType: field.contentType,
    defaultValue: field.defaultValue,
    value: resolveWebsiteContentValue(field, state),
    revision: state?.revision ?? 0,
    hasOverride: Boolean(state?.hasOverride),
    editable: isEditable(field),
    status: field.status,
    maxLength: field.maxLength,
    ...(field.choices ? { choices: field.choices } : {}),
    ...(field.uploadAllowed ? { uploadAllowed: true, backgroundImage: field.backgroundImage } : {}),
    existingDataSource: field.existingDataSource,
  }
}
