# Task 01 preservation baseline

Captured on 31 October 2026 (Asia/Calcutta). This audit changes no pre-existing tracked file. The original public rendering, static content, images, URLs, payment links, models, API contracts, styles and behavior are preserved at the checkout state recorded in [source-hashes.json](baseline/source-hashes.json).

## Evidence and boundaries

| Evidence | What it preserves |
| --- | --- |
| [Original file hashes](baseline/source-hashes.json) | SHA-256 and byte length of all 157 pre-existing tracked files, with Git HEAD. Includes routes, CSS, images, controllers, models, authentication, deployment and old verification files. |
| [Content registry](baseline/content-registry.json) | Exact source slices, decoded defaults, source locations, frozen keys, editable/protected status and route usage. |
| [Literal inventory](baseline/source-literals.json) | All 9,784 JSX/string/numeric/template literal nodes in the audited UI sources, including reasons for excluding technical values. Comments are excluded from executable content. |
| [Source structure](baseline/source-structure.json) | 2,489 ordered JSX opening elements, element names, source addresses, self-closing status and exact attribute expressions. This is a source-level DOM contract, including classes and animation props. |
| [Render expressions](baseline/render-expressions.json) | 1,608 expressions, including dynamic text, image/alt bindings, template expressions, conditionals and technical expressions. This file is evidence, not an editing allowlist. |
| [Imports](baseline/imports.json) | Shared component dependencies and module references. |
| [Public routes](baseline/routes.json) | All 23 requested public routes and their exact App Router wrappers and page implementations. |
| [Business/API contracts](baseline/contracts.json) | Existing dispatcher methods, handler names, auth/refresh requirements, upload aliases, payment destinations and protected contract file hashes. |
| [Production SSR](baseline/rendered-pages.json) | HTML snapshots for all 23 routes from the successful production build; each snapshot has a checksum, image references and URLs. |
| [Source snapshots](baseline/source/) | Exact original public UI source and route-wrapper bytes, stored as `.txt` for future binding review. Not executable application code. |
| [Audit artifact hashes](artifact-hashes.json) | Hashes of new audit scripts, documents and baseline evidence; excludes this hash manifest itself and the verification result log to avoid circular hashing. |

SSR HTML is the production build's initial render, not a hydrated browser DOM. Client effects, API records, modal interactions, carousel movement, font loading and viewport-dependent appearance are not asserted by these snapshots. Snapshot script/chunk URLs belong to the recorded build and are historical evidence, not a separately deployable site.

No project Playwright/Puppeteer installation, browser harness, screenshot script or existing desktop/mobile visual baseline was found. Desktop and mobile screenshots were therefore **not captured**. No browser packages were installed for this source-only audit. Before later bindings are accepted, capture hydrated desktop (1440 × 900) and mobile (390 × 844) screenshots against the same database state, browser, fonts, timezone and animation/scroll state. Include all slides, nested navigation, notices/modal/print, FAQ expansion, gallery filters/lightbox, forms and dynamic empty/populated states. Source hashes and SSR do not establish pixel equivalence.

Private `.env.local`, node_modules, `.next`, Git internals and the pre-existing untracked `stmary-guwahaticlub-website.rar` were not copied or changed. Existing public assets are hashed; remote Unsplash and avatar images are recorded as URL references, without fetching or replacing their bytes. Live MongoDB records and external upload storage were not exported. Runtime files under `public/uploads/` are not treated as new source files; the tracked `.gitkeep` is preserved.

## Existing baseline failure, separate from this task

`npm run verify:preservation` **fails** with:

```text
Preserved website file changed: src/components/layout/TopBar.jsx
```

This was reproduced before adding any application changes. Git was clean for tracked files at audit start, so this discrepancy already exists in the current commit relative to `docs/verification/baseline.json` (26 October 2026). The older baseline, its verification script and the TopBar were not edited, reset, waived or rehashed to make the check pass.

[legacy-comparison.json](baseline/legacy-comparison.json) lists all 17 differences from that older snapshot, including expected/current hashes. Of the old check's immutable website/model files, TopBar is the single unresolved discrepancy. Footer matches the existing explicitly approved Admin Login hash. Other differences include the backend/authentication/dependency work already described in `docs/verification/REPORT.md`; the old script permits those source changes. They are not new modifications from Task 01.

The payment links currently present in TopBar are captured exactly in `contracts.json`. This task does not judge which historical TopBar version should be approved. Resolving the old mismatch requires a separate review of its history and expected version, not an automatic exception.

## Commands and results

```powershell
npm run verify:preservation
node scripts/website-editor-audit.mjs verify
npm test
npm run build
node scripts/website-editor-audit.mjs review-bindings docs/website-editor/binding-plan.example.json
```

| Check | Result |
| --- | --- |
| Original preservation command | FAIL, pre-existing TopBar discrepancy above. |
| New current-checkout comparison | All 157 original files unchanged; all 23 routes, content slices, source structure, expressions, imports and literal classifications preserved. The combined command still returns nonzero because the old gate fails. |
| Existing test suite before audit-helper tests | 19 tests discovered: 18 pass, 0 fail, 1 skipped MongoDB integration test. No `TEST_MONGODB_URI` supplied. |
| Final test suite, including audit-helper fixtures | 25 tests discovered: 24 pass, 0 fail, 1 skipped MongoDB integration test. The six new isolated fixtures verify exact binding acceptance and rejection of layout edits, rewritten defaults, protected fields, duplicate keys and unlisted source changes. |
| Production build | PASS, Next.js 15.5.28; all 23 public routes and 7 existing login/admin routes emitted. No application source changes. |
| Empty future-binding plan | Review-only candidate with zero bindings; never approval or a waiver. |
| Browser screenshots and hydrated dynamic records | Not verified; tooling/database fixture limitations described above. |

The combined verifier always invokes the old preservation script. It continues with independent current-checkout evidence so the two findings remain visible, then exits 1 if the legacy gate failed. Do not use shell output from only the last command to infer that all checks passed. Full results and tool checks are recorded in [verification-results.json](verification-results.json).

## Approval process for a later prompt

1. Keep the original baseline and this Task 01 baseline immutable. Never run capture over either snapshot. The audit CLI's `capture` mode refuses to overwrite its original file manifest.
2. Propose a plan with exact source files, frozen registry keys, before/after hashes and the single proposed lookup import. The [empty example](binding-plan.example.json) contains no exemptions.
3. Run `review-bindings <plan.json>`. It reconstructs an expected file from original source snapshots and only registered, public, editable scalar segments. It permits exact `getWebsiteContent(key, originalDefault)` substitutions and the proposed reader import. Any additional byte change, changed fallback, protected field, unlisted original-file modification or duplicate binding is rejected. Mixed template segments and notice-print HTML require a separate future design review.
4. This command is a **review aid only**. It cannot authorize edits, introduce a runtime reader, alter a model/API/security setting, update the old hash checker or turn a failing combined verification into a pass. Review source diff, exact no-content-change DOM, screenshots, links, image references, route/build output and existing business tests before approving a narrowly scoped future gate revision.
5. Any approved hash exception must name one file and its exact reviewed hash, with rationale and evidence. Preserve fallback literals and protected classes, element order, styles, icons, animation props, routes, payment URLs and existing data/API ownership. Keep the old independent verification active; do not add folder-wide exemptions or accept arbitrary changed hashes.

No bindings or approval exceptions are applied in Task 01. Prompt 02 has not been started.
