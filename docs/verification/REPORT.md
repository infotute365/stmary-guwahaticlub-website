# Verification and compatibility report

Verified locally on 26 October 2026 using Windows, Node.js 22.14.0, Next.js 15.5.28 and a local MongoDB service. This report does not assert deployment to Hetzner.

## Implementation and reference comparison

The local reference at `../St-marys_Maligaon_fixed/St-marys_Maligaon` was available. Inspected its `src/server/config/database.js`, upload Route Handler, authentication middleware and `package.json`. Adopted the cached connection/retry structure and explicit upload-serving convention. Guwahati Club retains its own singular `controller/` and `model/` layout, refresh-session design, field names and collections. No reference project files were modified or branding copied.

The authoritative connection is `src/server/config/database.js`. Runtime importer: `src/server/route-adapter.js`. Provisioning importer: `scripts/seed-admin.mjs`. `src/server/db.js` was removed after checking all imports. The tests also import the centralized helper. The production smoke script uses its own direct connection only to delete its uniquely named disposable test database.

Concurrent initial calls share one promise and pool. Failed initial connections close the failed client and clear the pending promise; future calls retry. A successfully established driver's temporary network interruption is distinguished from a failed initial client and uses the driver's existing topology, without opening another pool. Real integration tests cover failed initial selection followed by successful retry and explicit disconnect/reconnect; unit tests cover concurrent acquisition and the driver-reconnect branch. Model registration still uses `mongoose.models.<Name> || model(...)`.

## Actual results

| Executed check | Final result |
| --- | --- |
| `npm ci` on the patched lockfile | PASS; 166 packages installed reproducibly |
| `TEST_MONGODB_URI=... npm test` | PASS; 28 tests, zero failures, zero skipped; includes real MongoDB integration |
| `npm run build` | PASS on Next.js 15.5.28; all original pages remain in build output |
| `npm audit --omit=dev` | PASS; zero vulnerabilities |
| `npm run verify:preservation` | PASS; 108 immutable original files match pre-change SHA-256 hashes |
| `node scripts/production-smoke.mjs --rebuild` | PASS; production build, launcher, real HTTP server and external upload persistence |
| Production route/chunk requests | 30 existing page routes, 21 internal navigation targets and 50 static chunks returned HTTP 200 |
| Actual seed CLI (production settings, disposable DB) | PASS twice; second run preserves the password |
| Production authentication HTTP | Login, session, POST refresh, content create/delete, logout and CSRF rejection pass; Secure/HttpOnly/SameSite cookies verified |
| Existing external upload before rebuild and after restart | Same URL and SHA-256; both `/uploads/...` and `/api/uploads/...` served successfully |
| `git diff --check` | PASS |

Initial audit identified a critical Next.js advisory and high-severity `follow-redirects` advisories. Compatible updates installed Next.js/@next/env 15.5.28 and a patched redirect dependency; no forced audit upgrade was used. The final connection test also reproduces the failed-client topology issue so it cannot regress unnoticed. Failed test iterations were corrected and the complete suite rerun successfully.

Tests use generated `stmary_gc_test_...` database names. Integration and smoke cleanup delete only their own disposable databases and temporary files. No school database was used or migrated. Integration tests are deliberately skipped when `TEST_MONGODB_URI` is absent; the reported full run supplied it. Unique per-run suffixes prevent fixtures left by a failed run from affecting later runs.

Covered regression behaviors include missing URI, cached concurrent connection, failure/retry, bcrypt and idempotent seed, explicit reset safeguards, generic invalid credentials, active admin enforcement, no tokens in JSON, 15-minute/seven-day cookie units, session checking, legacy UUID migration, hashed refresh storage, atomic rotation, concurrent refresh consumption, replay rejection, password/session rotation, logout after access expiry, public/private record filtering, all four CRUD modules, gallery slug/flat/image operations, syllabus metadata, invalid IDs, unauthorized writes/uploads, JSON/operator/pollution checks, CSRF, rate limits, streamed body size limits, image/PDF signatures, corrected WebP signature offsets, image re-encoding, file retrieval/deletion, quota and traversal rejection. Failed schema updates retain the previous media file. Frontend tests verify a shared refresh for concurrent expired requests and session recovery before admin `all=true` reads.

## Baseline and preserved contracts

`baseline.json` records hashes captured before source edits at Git HEAD `8b6d4afc8c11721e70cbc63932ca3c5b7a3b75c3`: 36 app files, 80 src files, eight public assets and the existing test/seed files. Original images/logo/PDF references and visible school content are preserved in the unchanged components/pages/assets. There were no tracked PDF assets in this baseline; school PDF records in a live database were not inventoried because no live database was accessed.

The preservation script asserts byte-for-byte identity of every original App Router file, public asset, site page, component, context, hook, utility, source asset and non-auth model (108 files). Existing public and admin page names, CSS/Tailwind classes, navigation markup, login redirects and dashboard appearance were not edited. Only the frontend API service changed to coordinate POST refresh and retry expired sessions. New media-serving routes are additive.

Models remain `Auth`, `Circular`, `Staff`, `Gallery`, `Syllabus`, with unchanged implicit collection registration. Only Auth gained additive `sessionVersion` and consumed refresh hash history; `refreshToken` is excluded from default projections. No passwords are reset by deployment, startup or a normal seed rerun. Existing long legacy login passwords are still accepted within the request limit; the 72-byte bcrypt ceiling applies to newly provisioned/changed passwords.

| API family / paths under `/api` | Preserved request/response contract |
| --- | --- |
| `POST auth/login` | email/password -> `{message,user}`; user has id/fullname/email/role/isActive |
| `GET auth/session` | flat safe user object |
| `POST auth/logout`, `PUT auth/change-password` | existing `{message}` response; oldPassword/newPassword unchanged |
| `auth/refresh-token` | URL and `{message}` preserved; intentional security change GET -> protected POST, frontend updated atomically |
| `GET/POST circulars`, `GET/PUT/DELETE circulars/:id` | list array, detail object, create/update `{message,circular}`, delete `{message}`; `all` preserved |
| `GET/POST staff`, `GET/PUT/DELETE staff/:id` | category/staffType/all preserved; list array, detail object, create/update `{message,staff}`, delete `{message}` |
| `GET/POST gallery`, `GET/PUT/DELETE gallery/:id`, `GET gallery/slug/:slug` | event/detail and paginated `{data,pagination}`/flat image shapes preserved; page/limit/all/flat preserved |
| `POST gallery/:id/images` | images array -> `{message,event,addedCount}` |
| `PUT/DELETE gallery/:eventId/images/:imageId` | title/update/delete responses retain `{message,event}` |
| `GET/POST syllabus`, `GET/PUT/DELETE syllabus/:id` | class/academicYear/stream/all preserved; list/detail and `{message,syllabus}` shapes preserved |
| `GET syllabus/academic-years`, `classes`, `streams` | arrays and existing filters preserved |
| `POST upload/image`, `upload/images`, `upload/pdf` | image/images/pdf multipart names and folder query preserved; `{message,path}`, `{message,images}`, PDF `{message,path,filename}` |
| `DELETE upload/file` | body filePath -> `{message}`; deletion restricted to validated storage paths |
| `GET health` | existing `{status:'OK',timestamp}` shape; liveness no longer depends on MongoDB |

Admin read sessions now load optionally; this repairs unpublished/inactive dashboard reads while public reads remain filtered. All administrative mutations enforce database-backed active administrator roles. Login and logout remain at the same URLs; logout can invalidate a saved refresh session even after access expiry. Tokens are not returned in JSON. The single saved account session is replaced on login; recognized refresh replay revokes that session, and the last 64 consumed hashes are retained. Concurrent refresh is single-flight within a browser module; simultaneous independent browser tabs/devices can still require re-login under strict replay protection. This follows the existing single-session-per-account storage design rather than adding multi-device sessions.

Security corrections intentionally bound gallery pagination to 1-100 records/page and page <=100000, JSON to 128 KiB, multipart to 21 MiB, images to 5 MiB each (max four), PDFs to 15 MiB, and active uploads to two per process. New/changed passwords require a strong 12-character minimum and <=72 UTF-8 bytes. Invalid schema updates return 400. File paths/URLs and payload types are validated, and application errors remain controlled `{message}` bodies without stack traces. These are documented security limits; no module or business field was removed.

The source review found no active `dangerouslySetInnerHTML`, eval, arbitrary request-object update spreads, query-operator passthrough or user-controlled login redirect. Existing React rendering escapes text. New media URLs reject executable schemes. Existing localhost remote-image patterns were retained for development; no active browser API consumer hardcodes a localhost backend, and the canonical public API base is `/api`.

## Deployment prerequisites and NOT VERIFIED items

No actual VPS, DNS, Nginx/PM2 service or production database was changed. The following need the deployer's target environment:

- NOT VERIFIED: actual Hetzner port availability, operating-system packages, least-privilege MongoDB credentials, network isolation and service coexistence with Maligaon.
- NOT VERIFIED: real DNS, HTTPS certificate issuance/renewal, Nginx syntax and trusted proxy behavior on that machine.
- NOT VERIFIED: PM2 startup after VPS reboot, mount dependencies, Linux upload ownership/permissions, and persistence across an actual VPS reboot or distinct release cutover. Local rebuild and application process restart persistence did pass.
- NOT VERIFIED: live database record/media inventory, the operator's first-copy upload migration and actual database/upload restore. No live records or files were moved.
- NOT VERIFIED: interactive browser dashboard clicks, actual browser HTTPS cookie acceptance and visual rendering on each device. HTTP route rendering, frontend recovery unit tests, backend operations and unchanged UI source hashes passed; these do not replace browser acceptance on the target origin.

Run the complete post-deployment checklist in `../deployment/HETZNER_DEPLOYMENT.md`. Supply private runtime settings per `../deployment/ENVIRONMENT_VARIABLES.md`; copy the previous AUTH_SECRET privately into JWT_SECRET when sufficiently strong, or deliberately require re-login after rotation. Provision only a missing first admin; never reset an existing account automatically.

Rollback keeps the prior release, private configuration backup, current database and external uploads. Switch the release symlink back and restart only Guwahati Club. A pre-refactor release needs its legacy secret variable and upload-directory mapping; expect refresh re-login because it cannot consume hashed refresh sessions. Never restore an old DB snapshot or delete uploads as routine application rollback.

## Files changed

The following implementation files were updated. `package-lock.json` already had user changes when work began; dependency patching extended that file. The pre-existing deletion of `scripts.zip` was left untouched and is not part of this refactor.

### Updated

- `.env.example`
- `README.md`
- `src/components/layout/Footer.jsx` (subsequent user-requested Admin Login button)
- `next.config.mjs`
- `package-lock.json`
- `package.json`
- `scripts/seed-admin.mjs`
- `src/server/controller/auth.controller.js`
- `src/server/controller/circular.controller.js`
- `src/server/controller/gallery.controller.js`
- `src/server/controller/staff.controller.js`
- `src/server/controller/syllabus.controller.js`
- `src/server/middleware/auth.middleware.js`
- `src/server/middleware/refresh.middleware.js`
- `src/server/model/auth.model.js`
- `src/server/route-adapter.js`
- `src/server/util/error.js`
- `src/server/util/imageProcessor.js`
- `src/server/util/validation.mjs`
- `src/services/api.js`

### Created

- `app/api/uploads/[...path]/route.js`
- `app/uploads/[...path]/route.js`
- `deploy/ecosystem.config.cjs`
- `deploy/nginx-proxy.conf.example`
- `deploy/nginx.conf.example`
- `docs/deployment/ENVIRONMENT_VARIABLES.md`
- `docs/deployment/HETZNER_DEPLOYMENT.md`
- `docs/verification/REPORT.md`
- `docs/verification/baseline.json`
- `docs/verification/production-smoke.json`
- `scripts/production-smoke.mjs`
- `scripts/start.mjs`
- `scripts/verify-preservation.mjs`
- `src/server/config/auth.js`
- `src/server/config/database.js`
- `src/server/config/localStorage.js`
- `src/server/util/provisionAdmin.js`
- `src/server/util/requestSecurity.js`
- `src/server/util/serveUpload.js`
- `tests/backend-security.test.js`
- `tests/database.test.js`
- `tests/frontend-auth.test.js`
- `tests/integration.test.js`
- `tests/seed-cli.test.js`

### Removed

- `src/server/db.js` (replaced by the authoritative configuration helper)

## Local provisioning diagnostics follow-up

The seed CLI now validates credentials before connecting and reports fixed, specific setup errors while redacting arbitrary driver errors and credentials. `node --test tests/seed-cli.test.js` passed all three new CLI regression tests: short-password validation, missing/malformed email validation, and database URI redaction. These targeted tests do not connect to a database or create accounts. The full 28-test result above records the earlier architecture verification run.

## Requested footer login button follow-up

After the architecture refactor, the user explicitly requested a small footer login button. `Footer.jsx` now links to the existing `/login` page with a matching outlined button and login icon. The existing login page already sends valid administrator logins to `/admin/dashboard`; authentication code was unchanged for this request. Next.js SWC compilation of the footer and the icon export check passed. Preservation verification now reports 107 original immutable files unchanged and one explicitly approved footer revision, checked against its reviewed hash without altering the original baseline inventory. No interactive browser test was run for this small UI addition.
