# Final website editor audit and fixes

Audited on **1 November 2026**, in the existing St. Mary's Guwahati Club checkout. This report supersedes the current-status statements in the earlier Task 01–05 reports; those historical files remain unchanged. In particular, Mandatory Disclosure management is now implemented.

**Result:** three reproduced defects were fixed, Disclosure management was completed, and the final local suite passed **112 tests, 0 failures, 0 skips**. The production build and real production HTTP/restart journeys passed. Browser/mobile acceptance and actual Hetzner validation remain blocked or external checks, not assumed passes. No production connection, deployment or school-record mutation was performed.

## Scope and inventory

The audit covered `app/(site)`, all seven current admin routes, login/protection, the public page components and reusable/editor components, services, server controllers/models/middleware/storage, the previous five stages' manifests/reports/tests, assets, deployment examples and both preservation gates. The package scripts remain `dev`, `build`, `start`, `verify:preservation`, `seed:admin` and `test`; no framework, CMS service or authentication architecture was added.

Filesystem route discovery matches the frozen baseline: **23 content routes**, with no additional content route omitted. The publicly accessible `/login` is the additional authentication page (24 public URLs when it is counted); admin routes and the not-found fallback are classified separately from school-content pages. Fresh HTTP checks also load the login form and all seven admin routes, confirming their anonymous initial guards. `/admin/disclosure` is the new admin route behind the existing admin layout/guard; it is not a new public page.

The complete original registry has **1,288 static entries**. All **959 approved manageable fields** are connected: **883 original text/number fields, 20 approved static image slots and 56 approved destinations**. There are **zero missing approved bindings**. The **40 original database-field templates** continue to belong to their existing dynamic modules; they are not duplicated in WebsiteContent. Disclosure adds six maintained record properties through its own module: title, description, status, PDF reference, optional expiry date and publication flag. Version, actor and timestamps are server-managed.

[master-content-inventory.json](master-content-inventory.json) explicitly cross-references every original key, audience, route, source, type, connection status and maintenance decision, plus dynamic ownership. It lists all **60 protected public fragments** and **269 dormant/admin/system entries** rather than silently treating them as missing editors.

Protected public entries comprise original payment URLs, structural dropdown paths, the admin login destination, dynamic avatar URL fragments, the map iframe, technical syllabus stream enums, decorative glyphs, separators, punctuation and required-field markers. They are not suitable arbitrary content inputs. Record photographs remain maintained through Staff; a map iframe is not treated as a banner image. Existing labels and appropriate content around these values remain editable.

## Per-page coverage

Counts are fields available on each route; shared keys repeat between rows and must not be summed. **DB** means fresh controller/MongoDB publication/history/reset checks; **HTTP** means actual production Next visitor HTML save/reset checks. **Browser** includes interactive visual/mobile acceptance.

| Original public route | Page | Shared | Available | DB | HTTP | Browser |
| --- | ---: | ---: | ---: | --- | --- | --- |
| `/` | 139 | 112 | 251 | PASS | PASS | BLOCKED |
| `/about/founders` | 33 | 112 | 145 | PASS | PASS | BLOCKED |
| `/about/journey` | 56 | 112 | 168 | PASS | PASS | BLOCKED |
| `/about/principal` | 62 | 112 | 174 | PASS | PASS | BLOCKED |
| `/about/superiors` | 34 | 112 | 146 | PASS | PASS | BLOCKED |
| `/academics/evaluation` | 33 | 112 | 145 | PASS | PASS | BLOCKED |
| `/academics/syllabus` | 21 | 112 | 133 | PASS | PASS | BLOCKED |
| `/administration/management` | 15 | 113 | 128 | PASS | PASS | BLOCKED |
| `/administration/non-teaching` | 12 | 113 | 125 | PASS | PASS | BLOCKED |
| `/administration/teaching-staff/high` | 12 | 113 | 125 | PASS | PASS | BLOCKED |
| `/administration/teaching-staff/higher-secondary` | 12 | 113 | 125 | PASS | PASS | BLOCKED |
| `/administration/teaching-staff/middle` | 12 | 113 | 125 | PASS | PASS | BLOCKED |
| `/administration/teaching-staff/primary` | 12 | 113 | 125 | PASS | PASS | BLOCKED |
| `/admissions` | 60 | 112 | 172 | PASS | PASS | BLOCKED |
| `/admissions/inquiry` | 71 | 112 | 183 | PASS | PASS | BLOCKED |
| `/contact` | 50 | 112 | 162 | PASS | PASS | BLOCKED |
| `/extracurricular/clubs` | 10 | 112 | 122 | PASS | PASS | BLOCKED |
| `/extracurricular/moments` | 10 | 112 | 122 | PASS | PASS | BLOCKED |
| `/gallery` | 42 | 112 | 154 | PASS | PASS | BLOCKED |
| `/infrastructure` | 40 | 112 | 152 | PASS | PASS | BLOCKED |
| `/mandatory-disclosure` | 28 | 112 | 140 | PASS | PASS | BLOCKED |
| `/past-pupils` | 36 | 114 | 150 | PASS | PASS | BLOCKED |
| `/student-rules` | 44 | 112 | 156 | PASS | PASS | BLOCKED |

Fresh evidence: [959 provider results](master-provider-field-results.json), [959 database results](master-field-save-results.json), [23 controller routes](master-route-save-results.json), [23 production HTTP routes and shared publication](master-ssr-http-results.json). Provider checks execute the actual controller using deterministic hooks/API/browser-state mocks; they are not browser automation. Every approved field is selected, changed, saved, reloaded into public provider state, viewed in history and reset. Independent real-controller/MongoDB loops verify persistence, public projection, initial-server snapshot and exact prior/new history. Conditional/modal/print/loading/success fields retain their original conditions.

## Findings and fixes

| Finding | Classification | Fix and executed verification |
| --- | --- | --- |
| Fresh server data omitted a reset override, but the provider merged the previous client value back in | Editor correctness bug | Missing keys in a refreshed server snapshot now remove stale overrides. Newer local revisions are retained only when a server override still exists. Regression failed before and passes after. |
| A queued multi-field save continued after local authorization was revoked; old asynchronous results could alter the new editor state | Editor/session lifecycle bug | Added an authorization epoch, immediate inactive state/ref cleanup, guards before later writes and after save/restore/upload completion, and history request cancellation. Stale completions are ignored and later queued writes stop. Already accepted server writes are not retroactively cancelled. Regression failed before and passes after; server authorization remains independently enforced. |
| Syllabus save succeeded but its admin table was never refreshed | Pre-existing admin editing bug | Added one awaited call to the existing `fetchSyllabus()` after successful create/update. No JSX, styling, API payload or business rule changed. Actual form execution reproduced the stale list before the fix and verifies the saved record appears after it. |
| Disclosure navigation led to a missing admin page, while `getDisclosures()` returned a hard-coded empty array | Missing content-management module | Added the existing-link destination, Disclosure model/controllers/API/service, admin CRUD/PDF form and editor Existing content entry. Existing public Disclosure JSX remains byte-identical; it consumes real records through its original array contract and existing PDF compatibility URL. No sample school certificates or production records are seeded. |
| History/capability loading state could outlive a revoked session or field change | Related lifecycle defect | Revocation clears private catalog/history/loading state; history responses and pagination are tied to the current request generation. Covered by provider and full-suite checks. |

Before-fix evidence: [provider regressions: two failures](master-provider-before.tap), [Syllabus form regression: one failure](master-syllabus-before.tap). After-fix evidence: [provider tests](master-provider-after.tap), [admin form/service tests](master-admin-service.tap), and the final full suite. Initial master full tests/build passed before the additional Syllabus defect was found; [initial TAP](master-tests-initial.tap) and [initial build](master-build-initial.log) are retained. A first admin-unit assertion incorrectly assumed the Link handler itself invoked `router.push`; it was corrected to verify the actual Next Link href and intent handler, without changing the working navigation.

## Working editor features and administrator entry

The existing styled **Edit Website** admin navigation item calls `startEditing()` and uses its original Next Link destination `/`. The actual handler and href are executed/inspected in the admin test. The provider requires fresh server session/catalog authorization; browser storage is intent only. Navigation preserves drafts, exit offers save/discard/cancel, and normal visitors receive no selection props or editor UI. Local logout/role loss immediately deactivates the provider and drops private state; expired/revoked cookies are rejected by the server. Cross-tab recognition follows focus/visibility checks and the existing polling behavior; no instant cross-tab broadcast is claimed.

The toolbar provides editing state, current page, Save Changes, Discard Changes, Preview and Exit Editor. Selected-field Save/Cancel, dirty-state protection, explicit destination confirmation, image draft preview, meaningful validation/network/conflict errors, reload-latest, saved history/original restoration and older-history paging are connected. Save locks prevent duplicate controller saves; multi-field saves are separate revision-checked operations rather than one atomic transaction. Styled segments and unrelated repeated fields retain distinct keys. The heavy editor UI remains dynamically loaded with SSR disabled.

## Backend, database and existing modules

Website editor endpoints verified:

| Method | Endpoint | Access |
| --- | --- | --- |
| GET | `/api/website-content?path=...` | Public published projection |
| GET | `/api/website-content/catalog?path=...` | Administrator |
| PUT | `/api/website-content/:key` | Administrator, expected revision |
| GET | `/api/website-content/history/:key` | Administrator, bounded cursor paging |
| POST | `/api/website-content/:key/restore` | Administrator, source/current revisions |
| POST | `/api/website-content/:key/reset` | Administrator, expected revision |
| POST | `/api/website-content/images/:key` | Administrator, multipart approved image |

WebsiteContent → `websitecontents` and WebsiteContentRevision → `websitecontentrevisions` remain additive. Unique key and key/revision indexes, stable allowlisted keys, majority/journal acknowledgements, standalone-MongoDB durable recovery, original fallbacks and privacy projections pass tests. Public reads neither seed defaults nor repair pending operations. Simultaneous/stale first/subsequent saves and failure/recovery boundaries are exercised against real disposable MongoDB.

Existing `auths`, `circulars`, `staffs`, `galleries` and `syllabuses` keep their identities, models and contracts. Existing login/logout/refresh/password recovery, Circular/Staff/Syllabus CRUD/filtering/publication, Gallery event/slug/image operations, persistent image/multiple-image/PDF uploads, safe failed updates and database reconnection all pass the real-adapter/database tests. The frozen original dispatch contracts still pass. The visual editor routes record maintenance to the original admin modules. No business record was copied into WebsiteContent.

Disclosure → `disclosures` is the additional model/collection. Only authorized intentional CRUD creates records. `disclosure_public_cursor` covers published-state and descending ID paging; list reads fetch at most limit+1 records. Existing data/collections are not renamed, reset or migrated. Inspect any pre-existing deployment collection/schema before activating this new module; no production database state was inspected here.

## Disclosure usage and API supplement

Use the existing **Disclosure** sidebar item or **Existing content → Disclosure**. Add the school's actual PDF, title/description, factual status and optional expiry date. New entries start as **drafts**. Select the publish checkbox only after review. Existing records can be edited, unpublished or deleted; upload failures/conflicts preserve the form and report the error. Deleting/replacing a record does not delete its persistent PDF, avoiding broken shared references. Capacity/retention requires operator management.

The public page uses its exact existing cards, labels, empty state, styling and download link convention. Empty storage still yields the original empty state. No certificates, expiry dates, historical facts or document defaults are invented. Uploaded PDFs are public media by URL even while the corresponding record is unpublished; this upload system is for documents intended for public release, not private school files.

| Method/path | Input/result |
| --- | --- |
| `GET /api/disclosure?limit=100&before=<id>` | Published projection only; `{disclosures,nextBefore}`; limit 1–100 |
| `GET /api/disclosure?all=true` | Administrator draft/published list, including version |
| `GET /api/disclosure/:id` | Published record publicly; drafts only for an administrator |
| `POST /api/disclosure` | Administrator; title, description, status, fileUrl, expiryDate, isPublished; returns 201 `{message,disclosure}` |
| `PUT /api/disclosure/:id` | Administrator; complete record fields plus `expectedVersion`; returns updated version or 409 |
| `DELETE /api/disclosure/:id` | Administrator; `{expectedVersion}`; stale versions return 409 |
| `POST /api/upload/pdf?folder=disclosure` | Reuses existing multipart PDF upload, max 15 MiB; response `path` used as fileUrl |

Statuses are Pending/Valid/Active/Expired. Date input is an exact valid `YYYY-MM-DD` or null. PDF references must be existing managed `/uploads/disclosure/<uuid>.pdf` files; arbitrary paths/hosts and other module files are rejected. Unknown fields/queries, duplicate list queries, operator/prototype payloads, invalid IDs, markup, unsafe URLs and invalid types are rejected. Writes retain existing cookie/origin enforcement and bounded JSON bodies. Anonymous draft requests return 401, missing/unpublished public detail returns 404, stale changes return 409. Successful responses and errors use existing service conventions and no-store caching.

The service preserves the public component's array contract by traversing bounded cursor pages, rejects repeated cursors and explicitly fails rather than returning a silently truncated list beyond its 100-page safety cap. New records use version 0. Server-managed version, actor/timestamps and document validation prevent body-supplied configuration changes.

## Security and image results

The final live production fixture records **20 explicit passing security checks**, including unauthorized editor/Disclosure writes and private reads, protected/unknown keys, executable destinations, script content, cross-origin writes, oversize JSON, Mongo operators, prototype pollution, history bounds, expired access, stale revisions, upload traversal, private image manifests and revoked-cookie access after logout. [Detailed HTTP results](master-final-http-results.json).

Real adapter/database tests additionally reject non-admin/inactive accounts, even when a JWT claims an administrator role, and test concurrent edits, revision recovery, PDF ownership/paths, malformed input and versioned Disclosure update/delete races. Production cookies retain Secure/HttpOnly/SameSite=Lax/path flags, refresh and logout revocation. No second authentication system or secret storage was introduced. The fresh npm production audit reported **zero known advisories**, which is not a proof of zero vulnerabilities.

All 20 approved image slots pass field publication/reset checks. JPEG/PNG/WebP processing, signature/extension validation, 10 MiB limit, 40-million-pixel and 20,000-dimension limits, animated/corrupt file rejection, EXIF orientation, preserved aspect/no-upscale, metadata stripping, responsive WebP variants, slot ownership and rollback are tested. Generic uploads cannot overwrite/delete the reserved root website namespace. Original Gallery/Staff image processing remains unchanged. Original source assets are never overwritten.

The actual production launcher was restarted against the same owned MongoDB/upload directory from a release copy without audit docs/tests/private env files. Published text, image URL/SHA-256 and private history survived; a prior uploaded image and exact original logo/text were restored. Installed production dependencies were shared through a temporary checked junction, then unlinked during cleanup. This proves the tested local runtime path, not a clean Linux production install or VPS reboot.

## Performance, SEO and preservation

The final HTTP run measured **105 successful decoded full page responses**, including the login page and seven protected admin loading responses: min **13.60 ms**, median **19.39 ms**, p95 **29.22 ms**, max **115.08 ms**; decoded bodies **6,746–146,945 bytes**. These are sequential loopback fixture measurements, not browser LCP, compressed wire bytes, load capacity or real-user latency. All sampled page responses are private/no-store. Individual samples remain in the HTTP JSON. The earlier successful HTTP run is retained in [initial results](master-final-http-initial-results.json); the final run adds explicit login/all-admin guard checks.

Live MongoDB explain confirmed the content unique-key lookup examined **1 document/1 key** and the bounded descending history query examined **5 documents/5 keys**. The root snapshot is bounded by the fixed 959 approved keys, though it is site-wide rather than page-minimal. Request-scoped React cache shares metadata/layout reads; there is no stale cross-request content cache. Metadata title publication/reset, source description fallback, published visitor HTML and no public controls pass. The production build reports **103 kB shared first-load JS**. Browser network counts, layout shift, hydration flicker/errors, memory retention and responsive image downloads were not measured.

Original public components, root layouts/default content, CSS/Tailwind classes, fonts, breakpoints, source assets/logo, animation/behavior attributes, routes, section order and payment destinations retain their previous exact reviewed bytes. The deterministic binding generator still reconstructs all 33 integrated public components and all approved defaults. Source/stubbed-markup checks retain original element hierarchy, including expanded/loaded/form-success/Lightbox states. These establish source/default preservation, not screenshot equivalence.

The sole existing admin form change is the explicit Syllabus post-save refresh. Its exact per-file preservation approval describes that call; no whole-folder exemption or baseline rewrite was used. [master-changes.json](master-changes.json) extends the original Task 01–05 hash chain, seals the previous Task 05 manifest and records all final source/document hashes. The final combined gate verifies **383 exact files and 15 reviewed transitions**. The original historical preservation gate and combined generator/hash gate remain active.

## Executed checks and journeys

| Executed command/check | Result/evidence |
| --- | --- |
| Initial API/policy regression tests | 16 passed; [initial targeted TAP](master-initial-checks.tap) |
| New defect reproductions | Two provider failures and one Syllabus form failure before fixes; linked above |
| Provider regression suite after fixes | 10 passed; [targeted TAP](master-provider-after.tap) |
| Admin handler/Syllabus form/Disclosure service | 3 passed; [targeted TAP](master-admin-service.tap) |
| `node scripts/run-website-content-tests.mjs --npm-test --master` | Executes actual `npm test`: **112 passed, 0 failed/skipped**, 73 top-level tests, 56,866 ms; [final TAP](master-tests.tap) |
| `npm run build` | PASS, includes `/admin/disclosure`; [build log](master-build.log) |
| `npm audit --omit=dev --json` | PASS, zero known advisories returned; [audit JSON](master-npm-audit.json) |
| `node scripts/preview-website-editor.mjs --mode production --verify-final true --stage master` | PASS, actual `npm run start`, all routes, Disclosure, security, restart and cleanup; [log](master-production-http.log), [results](master-final-http-results.json) |
| `npm run verify:preservation` | PASS; [historical gate](master-preservation.log) |
| `node scripts/verify-website-editor.mjs` | PASS; [staged exact-hash/generator gate](master-final-preservation.log) |
| `git diff --check` | PASS; [whitespace check](master-diff-check.log) |

Dependencies and lockfile were unchanged and already installed consistently; npm ci was unnecessary. There is no dedicated lint script/config to execute; Next's build validation and executable/parser/source-preservation tests were run. No unexecuted clean-install or separate ESLint pass is claimed.

| Requested journey | Verified portion | Outstanding portion |
| --- | --- | --- |
| A: login → Edit Website → text save/public/reset | Actual login/session HTTP, actual admin href/intent handler, actual provider/controller, MongoDB and visitor HTML | Hydrated browser clicks/focus |
| B: edit another page and return | All 23 page-specific saves/fresh visitor HTML; provider navigation/draft tests | Interactive browser navigation |
| C: shared footer | Saved Footer appears in visitor HTML on all 23 routes | Browser visual inspection |
| D: image replacement/restore | Multipart upload, actual HTML source/srcSet, served variants and reset/history | Browser fit/candidate download inspection |
| E: unauthorized access | Real server rejection matrix and inactive visitor props/HTML | Browser presentation of redirects |
| F: existing modules/forms | Real original CRUD/filter/upload/auth contracts; source/markup preservation and Syllabus actual-form save refresh | Hydrated forms/Lightbox/filter interaction; external form delivery remains absent originally |
| G: mobile/tablet/desktop | Original classes/breakpoints unchanged; editor CSS present | **NOT RUN: browser host unavailable** |
| H: errors | Controller network/conflict/auth failures, duplicate-save locks, real malformed/stale/revoked requests, database crash recovery | Browser timing/toast/focus/long-session behavior |
| I: refresh/restart | Fresh public provider/HTTP, actual npm production restart, database/image/history persistence | Real browser reload and actual VPS reboot |

## Files and operational handoff

Created implementation files: `app/admin/disclosure/page.jsx`, `src/components/admin/Disclosure.jsx`, `src/server/model/disclosure.model.js`, `src/server/controller/disclosure.controller.js`. Created tests: `tests/disclosure-integration.test.js`, `tests/disclosure-service.test.js`, `tests/master-admin-ui.test.js`.

Modified implementation files: `WebsiteEditorProvider.jsx`, `WebsiteEditorUI.jsx`, `editor-bindings.js`, `src/components/admin/Syllabus.jsx`, `src/services/api.js`, `src/server/route-adapter.js`. Modified verification support: isolated test runner, preview/final/page HTTP helpers, combined preservation verifier, provider/integration/preservation tests and the exact Syllabus approval entry. No public source component or original asset/style file was edited in this master stage. The complete path/hash list is in the master manifest; the registry inventory and this report are also sealed there. Generated execution logs/results are kept separately from immutable historical evidence.

For a safe local interactive fixture run `node scripts/preview-website-editor.mjs --port 3210`; use only the printed fixture credentials and stop with `quit` plus Enter. For production-like HTTP repeat the build and final-fixture command above. Tests create owned temporary MongoDB processes/databases and upload roots, enforce test-name/loopback guards and clean up their own files/processes.

Normal development retains `npm run dev`; production retains `npm run build` then `npm run start -- --hostname 127.0.0.1 --port <verified-free-port>`. Keep the existing private MongoDB URI and stable JWT secret, exact HTTPS APP_ORIGIN, same-origin `/api`, external persistent UPLOAD_DIR, supported Node and single-process rate/quota assumptions. Back up MongoDB plus all uploads/manifests before an authorized release. Retain the prior release; code rollback keeps current database/uploads, and content mistakes use field restoration. Include `disclosures` and `uploads/disclosure/` in coordinated backups. No destructive migration or administrator reset is needed. See the existing [deployment/rollback guide](DEPLOYMENT-AND-ROLLBACK.md) for the full operator procedure; this report adds Disclosure specifics.

## Remaining limits and acceptance decision

Browser discovery again returned no enabled browser and **“The browser access host is unavailable.”** No alternate control path, screenshots, mobile emulation or fabricated browser results were used. Before rollout, complete desktop/tablet/mobile screenshot comparison, actual editor click/keyboard/focus/preview/exit flows, carousel/animation/Lightbox/forms, console/hydration/filmstrip checks, network/image selection and repeated-navigation memory inspection in a disposable environment.

Actual Hetzner Linux installation, database/index permissions, Nginx/TLS/ports, mounts/permissions, backup restore, production load and persistence across VPS reboot remain operator checks. Production was not accessed. Uploaded media is public by URL; retained image/PDF files need monitored quota and reviewed retention. The original Contact and Admission Inquiry handlers still simulate success and do not deliver messages/store applications; adding such services would change existing business scope and require separate configuration. External payment/mail/phone/map availability and transactions were not exercised.

No failing executable check or known critical defect remains in the audited editor implementation. The source/backend/local HTTP acceptance is complete with the above evidence. Full visual/mobile and actual production acceptance remain **unverified**, so unconditional production readiness is not asserted.
