# Task 02 — Content persistence and revision durability

Two additive Mongoose models use the existing connection helper and database. No original model, collection, record, index, authentication setting or deployment prerequisite is migrated or changed. The new modules do not load private environment files themselves. There is no default-content seed.

## WebsiteContent

Mongoose model `WebsiteContent`, collection `websitecontents`:

| Field | Meaning |
| --- | --- |
| key | Exact stable Task 01 registry identifier; unique indexed key |
| scope, pagePath, contentType | Server-derived registry metadata; schema validation requires an exact match |
| value | Primitive string or number for the currently published override; absent after reset |
| hasOverride | Explicit publication/override flag; false means use the original source default |
| revision | Nonnegative monotonically increasing integer; starts conceptually at 0 |
| updatedBy | Administrator ObjectId from the authenticated session, not the request body |
| updatedAt | Committed change timestamp; reservation alone does not update it |
| pending | Private durable operation/outbox; excluded from default selection and public projections |

Indexes are unique `{ key: 1 }` and `{ scope: 1, pagePath: 1, hasOverride: 1 }`. Strict schemas reject unknown fields. Current allowlisted editable content consists only of text and numbers; existing image/link fields remain protected. Model validation re-resolves the key and checks value, metadata, pending revision order, previous state, action and reset/restore constraints. API validation additionally enforces exact primitive JSON types before Mongoose can cast anything.

Importing the new models and public reads do not create collections/indexes: both schemas disable automatic creation/indexing. An administrator operation explicitly ensures only the new indexes, cached per actual connected database object. Initial catalog/public reads do not create school content records. A pending approved operation or reset tombstone may have no current override value; these are concurrency/audit state, not copied defaults.

## WebsiteContentRevision

Mongoose model `WebsiteContentRevision`, collection `websitecontentrevisions`:

| Field | Meaning |
| --- | --- |
| key | Registry identifier, restricted to an editable public static field |
| previousValue, newValue | Exact effective content before and after this operation, including original fallback when relevant |
| revision | Positive revision assigned by the content reservation |
| administrator | Authenticated actor ObjectId |
| changedAt | Change timestamp |
| action | save, restore or reset |
| previousOverride, hasOverride | Whether each side is an actual override |
| restoredFromRevision | Historical source revision for restore, otherwise null |

Unique `{ key: 1, revision: 1 }` supports ordered history and prevents duplicate audit events. The persistence layer writes revisions with `$setOnInsert`, verifies that an existing row is exactly the same operation, and never rewrites a committed history row. Restores and resets append history. Actor references are not populated with names/emails, and only private endpoints can read them.

## Standalone-compatible commit protocol

The existing deployment does not require a MongoDB replica set. Cross-document transactions would impose a new deployment requirement, so this implementation uses a durable per-field outbox and atomic single-document compare-and-set operations. No in-memory lock is treated as concurrency authority.

1. Resolve/validate the registry field, value, action, administrator and expected revision. Finish any previously reserved operation for that key. Check the committed revision against the request.
2. Atomically reserve the next operation in `WebsiteContent.pending` only when key, expected revision and an empty pending slot match. A unique-key race during the first save or an unmatched reservation returns 409. The currently published value/revision remain unchanged.
3. Durably insert the separate history event with the next revision and verify equality if another worker already inserted it.
4. Atomically publish only the matching pending token/current revision, increment the committed revision, set value/actor/timestamp (or remove value for reset), and clear pending. Return that operation's revision/value even if a later administrator commits before its response arrives.

Reservation, history and publication use acknowledged journaled writes (`w: majority`, `j: true`), supported by the tested standalone server. This is a recovery protocol rather than a multi-document transaction: an uncommitted history row may exist internally between steps, but public reads see only the prior committed content. Administrator history is bounded by the committed content revision, so prepared future audit rows are not presented as committed history.

If the process or database operation fails between steps, pending contains the entire approved event. The next authenticated catalog/history/mutation can idempotently finish it. Concurrent recovery workers verify the same audit event and use the pending token CAS; they cannot publish it twice or overwrite a later revision. Public GET never repairs, seeds or writes. Recovery failures remain errors; they are not swallowed as successful saves. No background task, extra service or change to the school MongoDB service is required.

Reset keeps its row with `hasOverride: false` and a new revision, rather than deleting it. This prevents the ABA bug in which revision 0 becomes valid again after a save/reset cycle. The effective reset value always comes from the immutable Task 01 default. Restoring an old revision appends a fresh revision; it never rewinds the concurrency token.

## Operation and verification

Run `node scripts/run-website-content-tests.mjs` for the complete test suite against a new isolated standalone MongoDB process, free loopback port and unique temporary data directory. On Windows it defaults to the installed MongoDB 8.0 executable; use `--mongod /absolute/path/to/mongod` or `MONGOD_BINARY` elsewhere. It never reads `.env.local`, starts/reconfigures the existing MongoDB service, or uses the school's database. Test database names require the `stmary_gc_test_` prefix and append process/time suffixes; cleanup verifies the exact disposable target before removal.

For an already provisioned disposable server, the tests may alternatively receive `TEST_MONGODB_URI` with that mandatory test-database prefix. Never point it at school data. Without the variable, the real MongoDB integration tests are explicitly skipped; unit/service/security tests still run with `npm test`.

See [08-BACKEND-VERIFICATION.md](08-BACKEND-VERIFICATION.md) for actual executed results, preservation evidence and remaining limitations. No live data migration or user-facing content binding is part of Task 02.
