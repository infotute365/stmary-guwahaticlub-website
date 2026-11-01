# Final audit: executed tests and limits

Executed locally on 1 November 2026 with Windows, Node **22.14.0**, npm **11.5.2**, Next **15.5.28**, installed lockfile dependencies and fresh standalone MongoDB processes. No production URI or school records were used for test mutations. Test runners never load `.env.local`; fixture environment values override checkout values for child applications. The production build uses Next's normal environment loader, with no build-time database query required by the dynamic pages.

## Commands and evidence

| Executed check | Final result | Evidence |
| --- | --- | --- |
| `npm ls --omit=dev --depth=0 --json` | PASS; consistent installed tree, reinstall unnecessary | [installed dependencies](task05-installed-dependencies.json) |
| `node scripts/run-website-content-tests.mjs --npm-test --stage05` (executes actual `npm test`) | PASS; **100 tests, 100 pass, 0 fail, 0 skip** | [full suite TAP](task05-tests.tap) |
| `node --test tests/website-editor-controller.test.js` with stage 05 | PASS, 8 tests, including all 959 provider fields | [targeted provider TAP](task05-controller-targeted.tap) |
| `node --test tests/website-image-security.test.js` | PASS, 3 tests | [targeted image TAP](task05-images-targeted.tap) |
| `npm run build` | PASS; all 23 public routes dynamic; shared first-load JS 103 kB | [production build](task05-build.log) |
| `npm audit --omit=dev --json` | PASS, 0 known advisories returned; no dependency changes in this stage | [actual audit JSON](task05-npm-audit.json) |
| `node scripts/preview-website-editor.mjs --mode production --verify-final true` | PASS; actual `npm run start`, restart and cleanup | [HTTP/restart log](task05-production-http.log), [detailed results](task05-final-http-results.json) |
| `npm run verify:preservation` | PASS | [final historical gate](task05-preservation.log) |
| `node scripts/verify-website-editor.mjs` | PASS; complete staged exact-hash chain, generator and historical gate | [final combined gate](task05-final-preservation.log) |
| `git diff --check` | PASS, exit 0 | [whitespace check](task05-diff-check.log) |

The final suite completed in **49,963 ms** (100 tests including nested subtests, 66 top-level tests). The earlier full run passed 97 tests before three additional image-security tests were added; its [initial TAP](task05-tests-initial.tap) is retained. The additional field assertions are loops inside tests, not 959 separately counted Node tests. npm ci was not run because installed dependencies matched the unchanged package/lock inputs. No clean Linux/container install is claimed.

## Field and route coverage

- **959/959 provider fields:** enter authorized intent, select exact field, change/save, check no dirty draft, boot a fresh inactive public provider with published data, verify no selection props, view history and reset exact default. This executes the actual provider through deterministic React-hook/API/browser-state mocks, not browser automation. [Per-field results](task05-provider-field-results.json).
- **959/959 actual controller/MongoDB fields:** isolated mutation, public API projection, fresh server snapshot, exact prior/new revision history, original reset, no unrelated override. Real uploaded image families are generated for image slots; destination confirmation is applied. [Per-field results](task05-field-save-results.json).
- **23/23 page-specific controller checks:** publish, fresh public read/server snapshot and reset. [Route results](task05-route-save-results.json).
- **23/23 actual production Next routes:** select an original visible page-specific text node, save, anonymous public read, new visitor HTML contains edited text after removing scripts/styles/RSC data, reset and verify original. Shared Footer publication is checked on **23/23** routes. Metadata title and real logo `src`/`srcSet`, served WebP and original logo restoration pass. [HTTP route results](task05-ssr-http-results.json).
- Default source/markup comparison covers the 33 integrated public components and shared Card with original presentation attributes/element order; loaded/expanded navigation, form-success and Lightbox states use identical inert browser-library stubs. Reader tests retain styled boundaries, repeated keys, empty/zero values, escaped print text, original carousel behavior and draft isolation.

Text, multiline/styled segments, numbers, arrays/cards/FAQ/table data, labels/placeholders, image slots, button text and destinations are covered through the complete field inventory. Conditional/modal/print/empty-state fields retain their original conditions. The matrix above must not be described as interactive browser coverage for every field.

## Server security

| Requirement | Actual evidence/result |
| --- | --- |
| Anonymous write/private history | Production HTTP 401; controller/adapter tests also cover reset/restore/catalog |
| Non-admin, inactive and expired sessions | Real adapter + isolated Auth/MongoDB tests reject private revisions/writes; production expired-write HTTP 401 |
| Logged-out session | Real production logout/refresh, then previous cookie write and private history both 401 |
| Unknown/protected keys | Actual production 404/403; all protected registry classifications tested by policy |
| Unsafe destinations/HTML | Production 400 for executable URL/script; policy and adapter tests cover encoded markup, schemes, types and lengths |
| CSRF | Production cross-origin 403; configured-origin tests reject missing Origin with cookies and ignore hostile forwarded host |
| Oversize | Production JSON 413; actual streamed body test without Content-Length; website multipart >10 MiB returns 413 |
| Mongo operator/prototype payloads | Production 400 plus adapter/policy tests; no nested operator input reaches the content query |
| Concurrent/stale saves | Production stale-write 409; actual MongoDB simultaneous first/subsequent edits, ABA tombstones and journal recovery tested |
| History integrity/bounds | Administrator-only, paginated max 100; production limit 101 returns 400; exact history for every saved field |
| Public controls/private data | All visited production HTML lacks field/editor UI attributes; public projection excludes actor/history/pending data |
| Cookie/session contracts | Actual production Secure/HttpOnly/SameSite=Lax/path flags, refresh and logout; existing suite verifies lifetime, rotation/replay and version revocation |

The production HTTP fixture records **17 explicit security cases**, all PASS, with statuses in [task05-final-http-results.json](task05-final-http-results.json). Non-admin/inactive and simultaneous-race tests use the real adapter/controllers/database inside npm test; they are not separate browser sessions or extra live-Next cases.

## Uploads, restart and business modules

Supported JPEG, PNG and WebP each pass real processing, aspect ratio, no-upscale, responsive widths, metadata removal and slot ownership checks. Rejections cover corrupt/signature-spoofed data, SVG/PDF, executable extensions, >10 MiB files, excessive dimensions/pixels and animated WebP. EXIF portrait orientation, field-owned manifests, protected slots and root namespace protection are tested. Existing Gallery's 360×360 processor and `gallery/website` subfolder behavior remain intact.

The actual npm production launcher is stopped and restarted against the same owned database and persistent external uploads, from a sanitized release without audit docs/tests/env files. Text and image publication survive; served image SHA-256 remains equal; private history is available; an older replacement is restored and served; exact original logo/text are then reset. Traversal and manifest requests return 404. Original school assets are copied read-only for the fixture, never deleted. The temporary dependency junction is unlinked before checked recursive fixture cleanup. [Restart evidence](task05-final-http-results.json).

Existing login/logout/refresh/password recovery, Circular/Staff/Syllabus create/read/update/filter/delete, Gallery events/slugs/images, persistent image/multiple-image/PDF upload/retrieval/deletion, failure-preserving updates and connection recovery pass through their original API adapter/contracts and isolated MongoDB. Existing page API dispatch is compared with the frozen inventory. No API contract was changed to satisfy a test. Disclosure's empty data and simulated Contact/Inquiry submissions are pre-existing limitations, not successful new business workflows.

## Measured performance, SEO and caching

The final HTTP run recorded **97 successful full page-response samples**: minimum **15.06 ms**, median **18.75 ms**, p95 **30.13 ms**, maximum **120.36 ms**. Decoded response bodies ranged **60,562–146,945 bytes**. These are sequential loopback Node-fetch measurements with fixture data, including response consumption and cold/warm variation; they are not browser paint/LCP, compressed wire size, real-user latency or load capacity. All sampled pages returned private/no-store cache directives. Individual requests remain in the JSON evidence.

Actual MongoDB explain: unique content lookup returned/examined **1 document/1 key**; descending key-scoped history returned/examined **5 documents/5 keys**, with query limit 26 for default history pagination. Live index inspection confirmed unique key, page-state and unique key/revision indexes. The public content read is bounded by the fixed registered keys (at most 959 for the root snapshot), uses a projection and never scans arbitrary visitor-supplied keys. History uses key/revision and at most limit+1 rows. Old business-module list behavior was not reworked into pagination.

Metadata title publication/default restoration and original source description fallback pass. Request-scoped React cache shares metadata/layout content reads; there is no cross-request stale content cache. The provider/controller tests verify initial snapshot/draft/save transitions and source checks confirm navigation refresh behavior. Actual browser network-request counts, duplicate user clicks under browser timing, image candidate selection and client memory over long sessions were not measured. Do not infer those results from HTTP or hook mocks.

## Failures, correction and unexecuted acceptance

The first final HTTP attempt failed a **test-harness assertion** after successful restart: an original apostrophe was HTML-escaped, while the assertion compared raw default text. The comparison now decodes HTML entities, matching the existing route helper's semantics. No application behavior was changed. [Initial failure log](task05-production-http-initial.log) and [initial partial results](task05-final-http-initial-results.json) are retained; the full fresh disposable rerun passed. There are no unresolved failing executable checks in the final run.

Browser discovery returned no enabled browser and **“The browser access host is unavailable.”** Consequently the following are **NOT RUN**, not PASS:

1. Compare Task 01 desktop/mobile screenshots at desktop, tablet and narrow mobile widths on every route. Check original theme, layout, order, responsive breakpoints, logo/images and no editor-induced shifts.
2. Exercise hydrated navigation/dropdowns, carousel autoplay/edit-slide selection, animation, Gallery filtering/Lightbox, Syllabus filters/PDF links, original Contact/Inquiry success flows and print views.
3. Sign in to the disposable fixture and select/edit/save/reload/reset each content type, including shared content, separate styled spans, repeated cards, FAQ/table values, forms, images and destinations. Check keyboard focus, toolbar/panel fit, preview and unsaved exits. Use two sessions to inspect conflict UX.
4. Inspect browser console/hydration warnings and filmstrip/flicker. Measure actual content requests, responsive image downloads, memory/listener cleanup during repeated navigation, and double-click/save timing.
5. Complete the actual Hetzner checks: production-only Linux install, port/TLS/Nginx/permissions, real database/index access, backups and isolated restore, persistence after release switch/VPS reboot and traffic behavior. No live payment or real school-form submission should be used for QA.

Follow [DEPLOYMENT-AND-ROLLBACK.md](DEPLOYMENT-AND-ROLLBACK.md) before any authorized rollout. The local audit is complete with those limitations explicitly carried forward; production readiness is not asserted beyond the executed evidence.
