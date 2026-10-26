import { isIP } from 'node:net'
import { createHash } from 'node:crypto'
import { TryError } from './error.js'

export function appOrigin(request) {
  const configured = process.env.APP_ORIGIN?.trim()
  if (!configured && process.env.NODE_ENV === 'production') throw new Error('APP_ORIGIN is required in production')
  let origin
  try { origin = new URL(configured || new URL(request.url).origin) } catch { throw new Error('APP_ORIGIN must be a valid public origin') }
  if (!['https:', 'http:'].includes(origin.protocol) || origin.username || origin.password || origin.search || origin.hash || origin.pathname !== '/' || (process.env.NODE_ENV === 'production' && origin.protocol !== 'https:')) throw new Error('APP_ORIGIN must be an HTTPS origin in production')
  return origin.origin
}
export function checkMutationOrigin(request) {
  const expected = appOrigin(request)
  const origin = request.headers.get('origin')
  const site = request.headers.get('sec-fetch-site')
  if (site === 'cross-site' || (origin && origin !== expected) || (!origin && request.headers.has('cookie'))) throw TryError('Request origin is not allowed', 403)
}
export function rateLimit(request, scope, max, windowMs) {
  // Only enable behind the documented loopback-bound Nginx proxy, which replaces
  // X-Real-IP. Never accept arbitrary client-provided X-Forwarded-For chains.
  const header = process.env.TRUST_PROXY_IP === 'true' ? request.headers.get('x-real-ip') : null
  const ip = header && isIP(header) ? header : 'shared'
  const key = `${scope}:${createHash('sha256').update(ip).digest('hex')}`
  const now = Date.now()
  const buckets = globalThis.__guwahatiRateLimits || (globalThis.__guwahatiRateLimits = new Map())
  for (const [id, bucket] of buckets) if (bucket.until <= now) buckets.delete(id)
  let bucket = buckets.get(key)
  if (!bucket) {
    // Bound memory even if a trusted proxy sees many distinct source addresses.
    if (buckets.size >= 10000) throw TryError('Too many requests; try again later', 429)
    bucket = { count: 0, until: now + windowMs }
    buckets.set(key, bucket)
  }
  if (++bucket.count > max) throw TryError('Too many requests; try again later', 429)
}
export async function boundedBody(request, limit) {
  const length = request.headers.get('content-length')
  if (length && (!/^\d+$/.test(length) || Number(length) > limit)) throw TryError('Request body too large', 413)
  if (!request.body) return Buffer.alloc(0)
  const reader = request.body.getReader()
  const chunks = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > limit) { await reader.cancel(); throw TryError('Request body too large', 413) }
      chunks.push(Buffer.from(value))
    }
  } finally { reader.releaseLock() }
  return Buffer.concat(chunks, size)
}
export function validateBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw TryError('Expected a JSON object', 400)
  for (const [key, value] of Object.entries(body)) {
    if (key.startsWith('$') || ['__proto__', 'prototype', 'constructor'].includes(key) || key.includes('.')) throw TryError('Invalid request field', 400)
    if (value !== null && typeof value === 'object' && (!Array.isArray(value) || value.some(item => typeof item !== 'string'))) throw TryError('Invalid request field', 400)
    if (typeof value === 'string' && value.length > 100000) throw TryError('Request field too long', 400)
    if (['image', 'fileUrl', 'coverImage'].includes(key) && value && (typeof value !== 'string' || !/^(?:\/(?!\/)|https?:\/\/)/i.test(value))) throw TryError('Invalid media URL', 400)
    if (key === 'images' && Array.isArray(value) && value.some(item => !/^(?:\/(?!\/)|https?:\/\/)/i.test(item))) throw TryError('Invalid media URL', 400)
  }
}
