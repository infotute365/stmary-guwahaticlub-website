# Task 02 — Website content API

This additive backend uses the existing Next.js catch-all API, controllers, cached Mongoose connection, JWT cookies, administrator middleware, origin checks, body validation, rate limiter and error conventions. It does not bind public page JSX or add an editing interface. Existing public content and the four original content modules remain unchanged.

The frozen Task 01 registry is the server-side allowlist: **883 editable public fields, comprising 862 text fields and 21 numbers**. Unknown fields return 404; protected, dormant and administrator/system fields return 403 for editing/history. All existing image references and URL destinations remain protected, including the two fee-payment URLs. A browser confirmation flag cannot override that policy. A future sensitive-link feature would require an explicitly reviewed server policy change as well as administrative confirmation and an audited revision; no such exception exists here.

## Endpoints

All responses, including errors, have `Cache-Control: no-store`. Successful mutation responses use HTTP 200. Data changes publish immediately; this stage has no draft/publish workflow.

| Method and path | Access | Parameters/body | Response |
| --- | --- | --- | --- |
| `GET /api/website-content?path=/` | Public; ignores optional access-token identity | Optional `path`, default `/`; must match one of the 23 inventoried public paths exactly | `{ path, overrides: { [key]: { value, revision, contentType } } }` |
| `GET /api/website-content/catalog?path=/` | Authenticated active administrator | Same path rule | `{ path, fields: [...] }` |
| `PUT /api/website-content/:key` | Authenticated active administrator | `{ value, expectedRevision, contentType? }` | `{ message, field: { key, value, hasOverride, revision, updatedAt } }` |
| `GET /api/website-content/history/:key` | Authenticated active administrator | Optional `limit` (1–100, default 25) and `before` positive revision cursor | `{ key, revision, entries, hasMore, nextBefore }` |
| `POST /api/website-content/:key/restore` | Authenticated active administrator | `{ revision, expectedRevision }` | Same mutation envelope; creates a new revision |
| `POST /api/website-content/:key/reset` | Authenticated active administrator | `{ expectedRevision }` | Same mutation envelope, original value and `hasOverride: false` |

Encode a key as a URL segment with `encodeURIComponent`. Routes reject extra segments and unsupported methods. Queries reject unknown or duplicate parameters. Bodies reject unexpected properties, missing required fields, objects/arrays as values, mismatched types and invalid revision numbers. `expectedRevision` is a JSON integer, never a numeric string. New fields start at revision 0 without a database record.

The public response contains **only committed overrides**, not defaults, history, pending operations, administrator references or account information. Global fields relevant to the requested route are included alongside that page's fields. A home-only override is absent from `/contact`. Empty strings and numeric zero remain intentional overrides.

## Original/default behavior

There is no seed or migration. An empty content database returns:

```json
{ "path": "/", "overrides": {} }
```

Catalog entries merge the exact original registry default when an override is absent or reset. The server helper `resolveWebsiteContentValue(field, state)` uses the explicit `hasOverride` flag, preserving intentional empty/zero values. Public pages still read their unchanged source literals in this stage. Future bindings must fall back to the same exact registry/source values, rather than interpreting an absent override as blank content.

Catalog entries expose key, scope, pagePath, section, human-readable fieldName, contentType, defaultValue, effective value, revision, hasOverride, editable, status, maxLength and existingDataSource. Protected public references are readable in the private catalog as `editable: false`; no dormant/admin-only fields are included. Catalog reads never seed defaults. An authenticated catalog/history access can finish a previously approved interrupted operation, as described in the database document.

## Save, conflict, restore and reset

For the actual registered key `home.hero-carousel.slides.item1.title`, a save request has this shape:

```json
{ "value": "Administrator supplied text", "expectedRevision": 0, "contentType": "text" }
```

The response includes revision 1. The next save must submit `expectedRevision: 1`. Two concurrent requests with the same expected revision cannot both win. A stale revision returns HTTP 409 with the existing `{ message }` error shape. The client must reload the catalog/history and ask the administrator to reconcile the content; it must not silently retry against a newer revision.

History entries contain key, previousValue, newValue, revision, administrator ObjectId, changedAt, action (`save`, `restore`, `reset`), previousOverride, hasOverride and restoredFromRevision. They never populate account names/emails. History is available only through administrator routes and uses descending revision pagination. `nextBefore` is an exclusive cursor for the next page.

Restore uses a committed historical revision for the same key and appends a new revision; it never decrements the current revision or rewrites history. Restoring a reset revision restores its absence of override. Reset appends an audited reset and removes the current override value, while preserving a monotonically increasing revision tombstone. Therefore a stale editor holding revision 0 cannot overwrite a previously reset field.

If a save is interrupted, the API reports the relevant failure and does not report success without a durable audit record. The last committed public value remains visible until publication finishes. After a network/server failure, reload the administrator catalog to discover/recover the committed state before attempting a new save. Do not assume that a lost response means the operation was discarded. The outbox protocol and failure tests are explained in [07-BACKEND-DATABASE.md](07-BACKEND-DATABASE.md).

## Validation and security

- New private endpoints use the existing active-account/role/JWT-version middleware. Existing unauthorized, inactive, non-admin or expired-session behavior remains HTTP 401. A controller guard also verifies the administrator session projection.
- Mutations retain the existing same-origin/CSRF checks and JSON request-body bound. New endpoint scopes allow 300 public reads/minute, 120 private reads/minute and 120 mutations/minute per existing rate-limiter IP bucket. Existing modules' rate/auth behavior is not changed.
- Text remains a primitive string and is never trimmed, paraphrased, decoded or otherwise normalized before storing. Field-specific maximums are returned in the catalog: headings/labels/placeholders generally 300 characters, other short text 1,000, prose 5,000, and long/multiline biographies 10,000, always sufficient for the exact original default.
- Numbers must be finite, nonnegative safe integers at most 1,000,000,000. Strings cannot impersonate numeric values, or vice versa.
- Text rejects control characters, HTML/executable markup, encoded executable markup, unsafe URL schemes and obvious JavaScript/CSS payloads. It remains plain content for React's normal escaping. No `dangerouslySetInnerHTML` is introduced.
- Request keys and value types cannot become MongoDB query operators or schema updates. Unknown body properties, prototype-pollution names, arbitrary scope/type/admin identity, unregistered paths and traversal encodings are rejected. The server builds all database filters/updates explicitly.
- Image URL validation recognizes only managed UUID WebP upload paths or exact inventoried external HTTPS image references; executable/relative-traversal/unapproved URLs are rejected. This does **not** unlock the currently protected image fields. No URL/fee-payment field can currently be saved, restored or reset by the generic API.

## Frontend service functions

`src/services/api.js` adds these named exports and corresponding default-export entries without changing existing ones:

```javascript
getWebsiteContent(path = '/')
getWebsiteContentCatalog(path = '/')
saveWebsiteContent(key, value, expectedRevision, contentType)
getWebsiteContentHistory(key, { before, limit } = {})
restoreWebsiteContent(key, revision, expectedRevision)
resetWebsiteContent(key, expectedRevision)
```

They use the existing credentialed Axios instance and its shared expired-session refresh. A 401 triggers the existing POST refresh and retries the exact original payload once. A 409 is returned to the caller for conflict handling. No public component imports or invokes these functions yet.

## Existing dynamic module delegation

The future editor must recognize data origin before choosing an API. Static allowlisted fields use this new API. Circular records continue through `get/create/update/deleteCircular`; staff through their existing Staff functions; gallery events/images through existing Gallery functions; syllabus/PDF entries through existing Syllabus and upload functions. Their record IDs, schemas, visibility, ordering and API payloads remain owned by those modules. Do not copy their values into WebsiteContent.

A future selection of a database-driven card should open or delegate to its existing admin module. Mandatory Disclosure remains its documented stub and missing admin route; this stage does not invent a fifth module, records or endpoints. Task 03 has not been implemented.
