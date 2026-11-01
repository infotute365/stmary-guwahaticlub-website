# Task 02 — Delivery and actual verification

Completed 31 October 2026. Task 02 implements content persistence, optimistic concurrency, revision history, restore/reset, secured endpoints and frontend API service functions. No editor interface, public-page content binding, default seed, live data migration or Task 03 work was performed.

## Files

Only two pre-existing application files changed:

- `src/server/route-adapter.js`: exact new website-content routes, content-specific rate buckets/query handling and new public-cookie isolation. Existing dispatch/auth/origin/body/error behavior remains intact for every established endpoint.
- `src/services/api.js`: six additional functions and default-export entries, using the existing credentialed Axios/refresh behavior. Existing functions, named exports and contracts are retained.

New runtime files:

- `src/server/model/website-content.model.js`
- `src/server/model/website-content-revision.model.js`
- `src/server/util/websiteContentPolicy.js`
- `src/server/util/websiteContentStore.js`
- `src/server/controller/website-content.controller.js`

New tests/tooling:

- `tests/website-content.test.js`
- `tests/website-content-integration.test.js`
- `tests/website-content-service.test.js`
- `scripts/run-website-content-tests.mjs`
- `scripts/verify-website-content.mjs`

New documentation/evidence:

- [06-BACKEND-API.md](06-BACKEND-API.md)
- [07-BACKEND-DATABASE.md](07-BACKEND-DATABASE.md)
- This verification report
- [task02-changes.json](task02-changes.json): exact reviewed before/after hashes for the two integrations and hashes of the new implementation/test/document files
- [task02-verification-results.json](task02-verification-results.json): machine-readable check results

The five Task 01 documents, registry, source snapshots, baseline hashes, old verification scripts and their artifact seal remain unchanged. The pre-existing archive is untouched. Dependencies, deployment configuration, all original models/controllers and every public page/component/CSS/asset remain unchanged.

## Tests actually executed

| Command | Actual result |
| --- | --- |
| `node --test tests/website-content.test.js` | PASS: 8 tests, including every one of the 883 exact original editable defaults and all 23 route field sets. Final expanded assertions also passed in the complete suite. |
| `node --test tests/website-content-service.test.js` | PASS: 7 counted tests including its parent and 6 cases; endpoint/payload semantics, empty/zero values, concurrent shared refresh and 409 propagation. |
| `node scripts/run-website-content-tests.mjs` | PASS: **63 tests, 63 passed, 0 failed, 0 skipped**, final exit code 0. Includes both original and new real MongoDB integration suites. |
| `npm test` without `TEST_MONGODB_URI` | PASS: 41 counted tests, 39 passed, 0 failed, 2 explicitly skipped real-MongoDB parent suites. The separate isolated run above executed those suites successfully. |
| `npm run build` | PASS on Next.js 15.5.28 after the final backend changes; all 23 original public and 7 login/admin page routes retained. |
| `git diff --check` | PASS. |
| `node scripts/verify-website-content.mjs` | Task 02 preservation comparison passes; the command retains a nonzero exit because it also runs the unchanged old gate, which still fails on the pre-existing TopBar mismatch described below. |

Node's test totals include parent tests and nested subtests. The MongoDB integration requests exercise the actual Next Request/Response adapter and real controllers/models against the disposable server. The build verifies the bundled API/JSON registry import; no live deployment or browser editing interface is claimed.

The first isolated run already passed all 63 tests but its harness exited unsuccessfully during Windows process cleanup due to an already-delivered exit event. The harness was corrected to distinguish an exited signal-terminated child from a running process. The complete rerun passed all 63 tests with exit 0 and removed its temporary server/data directory. The stopped first-run fixture was separately verified and removed. No school MongoDB service was stopped or reconfigured.

## Covered behavior

- Original fallback for every editable registry field, no default records seeded, explicit empty-string and zero overrides, route/global scope.
- First save, subsequent save, audit event content, actor/timestamp, unique key/revision indexes and public-safe projection.
- Simultaneous first saves, same-revision updates and stale edits produce exactly one winner and HTTP 409 conflicts.
- Restore appends a revision; reset returns the exact original value, removes the override and retains its monotonic tombstone; stale save/restore/reset attempts are rejected.
- Descending private history pagination, anonymous/non-admin/inactive/expired-session rejection, shared expired-session refresh with identical retry payloads, and no retry on 409.
- Unknown/protected/dormant/admin keys; protected fee URLs even with a browser confirmation flag; invalid types, limits, paths, duplicate queries, operators, prototype pollution, unsafe URLs, encoded markup, executable HTML/JavaScript/CSS and CSRF.
- Interrupted saves after reservation and after history insertion leave the old public state unchanged, retain recoverable pending state, and recover idempotently, including concurrent recovery.
- Public GET ignores expired or malformed unrelated cookies and never leaks actor or pending data; externally corrupted override text is omitted in favor of the unchanged source fallback.
- All original dispatcher contracts and existing authentication, Circulars/Staff/Gallery/Syllabus CRUD, uploads, media persistence and database-reconnection integration tests continue to pass.

## Preservation and existing failure

The new verifier compares all 157 original Task 01 source-file hashes. **155 remain byte-for-byte unchanged**, and only the two explicitly listed backend/service integration files have exact reviewed revisions. It also checks all 125 frozen Task 01 artifact hashes, original API handler/auth/parameter contracts, new implementation hashes and unexpected source-file additions. Public pages, layouts, components, styles, images, navigation labels, fee links, business models/controllers, auth configuration and old tests have no exceptions.

The original `scripts/verify-preservation.mjs` still fails with `Preserved website file changed: src/components/layout/TopBar.jsx`. Task 01 recorded this before any implementation change. TopBar is unchanged from that Task 01 snapshot. This task does not rewrite its expected hash, waive it, remove the check or change a bank destination. The new verifier reports its independent Task 02 success and still exits 1 when the old gate fails.

The strict Task 01 audit verifier is a historical no-change gate; it will additionally report the intentionally authorized new backend files and the two source integrations in this task. Its original baseline and script remain frozen. Use the explicit Task 02 change manifest and verifier to review this additive scope; no folder-wide preservation exemption is introduced.

## Remaining issues and limits

- The historical TopBar baseline discrepancy needs its own reviewed resolution; it is not a new backend regression.
- All image/link fields remain protected by the current authoritative registry. A visual editor cannot unlock fee URLs with request data. A later policy change must be separately reviewed; no sensitive destination edit occurred here.
- No production database, deployed origin, browser UI or real school record was used in tests. Real-MongoDB verification used only the isolated server and fenced disposable database names.
- Interrupted operations recover on the next authenticated catalog/history/mutation access, not through an added background service. Clients must reload after ambiguous network/server failures before resubmitting with a fresh expected revision.
- Mandatory Disclosure and timer-only contact/admission forms retain their existing behavior. Existing dynamic records stay in their original modules.
- The visual interface and public content bindings are intentionally deferred. No Prompt 03 implementation was started.
