# Website content API

Base path: `/api/website-content`. Existing authentication and business-module endpoints retain their contracts; the frozen dispatch inventory is [baseline/contracts.json](baseline/contracts.json). This document describes the additive editor endpoints.

## Access and transport

The public GET returns validated published overrides only. Every other editor endpoint requires the existing HttpOnly access cookie for an active database account with role `admin` or `super-admin`. The server verifies JWT expiry, allowed algorithm, account status, role and session version. Client state never grants access.

Mutation requests use the exact configured `Origin: <APP_ORIGIN>` and JSON content type, except image uploads which use multipart form data. Cookie-authenticated mutations without Origin and cross-site requests are rejected. Production cookies remain Secure, HttpOnly, SameSite=Lax, path `/`; access lasts 900 seconds and refresh lasts 604800 seconds. Existing `POST /api/auth/refresh-token` rotates the session; logout revokes prior access.

Keys come from the immutable registry plus explicit image/destination approvals. URL-encode path parameters. Arbitrary keys, nested JSON values, operator/prototype keys, unknown body/query properties and duplicate query properties are rejected. JSON bodies are bounded to 128 KiB. Text limits are field-specific and returned by the catalog; numbers must satisfy the catalog policy. Plain text is rendered as text, not executable HTML.

## Endpoints

| Method/path | Access | Input | Success |
| --- | --- | --- | --- |
| `GET /api/website-content?path=/contact` | Public | Existing public path; defaults to `/` | `{path, overrides}` |
| `GET /api/website-content/catalog?path=/contact` | Administrator | Existing public path; defaults to `/` | `{path, fields}` |
| `PUT /api/website-content/:key` | Administrator | `{value, expectedRevision, contentType?, confirmDestination?}` | `{message, field}` |
| `GET /api/website-content/history/:key?limit=25&before=20` | Administrator | Limit 1–100, default 25; optional positive revision cursor | `{key, revision, entries, hasMore, nextBefore}` |
| `POST /api/website-content/:key/restore` | Administrator | `{revision, expectedRevision, confirmDestination?}` | `{message, field}` |
| `POST /api/website-content/:key/reset` | Administrator | `{expectedRevision, confirmDestination?}` | `{message, field}` |
| `POST /api/website-content/images/:key` | Administrator | Multipart `image` file, approved static image slot | `{message, image}` |

`overrides` maps keys to `{value, revision, contentType}`. It omits original defaults, reset tombstones, actor IDs, pending operations and history. Shared fields used on the requested route are included; unrelated page keys are omitted. Public reads never seed defaults, repair journals or write records. Responses use `Cache-Control: no-store`.

Catalog fields include the exact original `defaultValue`, effective `value`, `revision`, `hasOverride`, scope/page/source labels, content type, editability and applicable choices/limits. Protected fields may be described but cannot be mutated. The public registry originally contains 883 editable text/number fields; 20 image slots and 56 destinations are explicitly approved, for 959 manageable keys.

Example save after reading the catalog:

```json
{
  "value": "A temporary review heading",
  "expectedRevision": 0,
  "contentType": "text"
}
```

The returned `field` is `{key, value, hasOverride, revision, updatedAt}`. Use its revision on the next mutation. A stale revision returns 409. Each successful save/reset/restore increments the revision, including resets to the default, preventing stale writes after a reset. Saving several fields is a sequence of independent operations.

For destination fields, `confirmDestination: true` is required for save, reset and restoration. Values must be one of that field's server-approved choices: its exact original destination or an existing public route. Arbitrary external hosts, executable URLs and admin destinations are rejected. Payment destinations remain protected.

History entries contain `key`, previous/new values, revision, administrator reference, timestamp, action, override flags and optional source revision. Pages are ordered newest first; use `nextBefore` only when `hasMore` is true. Restoration appends a new audited revision rather than editing history. There is no visitor-facing history mutation endpoint.

## Image processing and serving

The upload endpoint prepares an image; it does not publish the selected slot. The client then sends the returned `image.value` using the normal PUT endpoint. The response includes `{value, variants, width, height}`, with each variant `{url,width,height,bytes}`. Background slots return a constrained `url('...')` value.

JPEG/PNG/WebP contents, signature, extension and decoded dimensions must agree with policy. Limits: 10 MiB/file, 40 million decoded pixels, 20,000 pixels per dimension, single non-animated image. Rotation follows EXIF; metadata is stripped. WebP widths use 640/1280/1920/2560 where the source permits, preserve aspect ratio and never upscale or crop. Existing Gallery/Staff processing remains separate.

Storage is `UPLOAD_DIR/website/<uuid>/<width>.webp`, with a private slot-bound `manifest.json`. Image save/restore validates the manifest and file's availability. A family cannot be published in another slot. Public media is served through `/uploads/...` and the existing `/api/uploads/...` compatibility route, with `image/webp`, nosniff and bounded public caching. Manifests, hidden files, unsupported extensions, traversal and symlinked paths are rejected. The generic upload/delete API cannot alter the reserved root website namespace. Prior families remain available for rollback; retention/quota needs operational monitoring.

## Storage, concurrency and errors

Additive Mongoose models/collections: `WebsiteContent` → `websitecontents`; `WebsiteContentRevision` → `websitecontentrevisions`. Existing school collections are not renamed or copied. Unique indexes are `website_content_key_unique` on key and `website_content_revision_unique` on key/revision; the content page index covers scope/page/override state. Index initialization is performed on private editor operations.

The standalone-MongoDB durable outbox reserves one pending event, persists its revision with majority/journal acknowledgement, then publishes. Interrupted operations retain the last committed public value until an administrator operation recovers the event idempotently. Pending state never appears publicly. No replica-set migration is required.

| Status | Meaning |
| --- | --- |
| 400 | Invalid input, unsupported image, invalid query/value or missing destination confirmation |
| 401 | Missing/expired/revoked/ineligible session |
| 403 | Protected content or forbidden request origin |
| 404 | Unknown key/path or missing revision/media |
| 409 | Stale revision, concurrent operation or busy content |
| 413 | Request or file too large |
| 415 | Unsupported request media type where enforced by the adapter |
| 429 | Rate/concurrent-upload limit |
| 503 | Database/storage/configuration unavailable or invalid durable state |
| 507 | Persistent upload quota exceeded |

Error JSON follows the existing `{message}` convention. Per-minute editor buckets are 300 public reads and 120 private reads/writes; existing login/refresh/upload bounds also apply. With `TRUST_PROXY_IP=false`, clients share a safe process-local bucket. Multi-process deployment needs shared rate/quota coordination. Never log cookie values, credentials, secrets or database URIs.
