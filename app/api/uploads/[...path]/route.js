// Compatibility for existing frontend components that prefix media paths with /api.
import { serveUpload } from '../../../../src/server/util/serveUpload.js'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const GET = serveUpload
export const HEAD = serveUpload
