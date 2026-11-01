# Task 04 — complete public content integration

Implemented on 1 November 2026. Task 05 has not been started. Historical Task 01/02/03 registries, snapshots, manifests and reports remain unchanged; this stage has its own exact transitions and reports.

## Coverage and editing

All 883 originally editable public text/number keys have actual content reads across all 23 routes. An explicit server policy additionally approves 20 existing static image slots and 56 existing destinations, giving 959 manageable keys. The generated field list is `src/content/website-bindings.js`; it retains every frozen key and each field's original route/scope. Shared Navbar/TopBar/Footer/Breadcrumb/StaffCard fields use their original global keys; page components retain distinct page keys. Identical text is never merged into one stored field.

`useWebsiteContent()` runs once per component. Its plain `value()` function works in arrays, tables, timelines, FAQ data, conditionals and handlers without calling hooks inside loops. Every direct JSX text segment retains its original element and styled span boundaries. Labels, placeholders, instructions, existing status text and notification/print text are bound independently. Print-window substitutions escape edited text and preserve original HTML when no override is present. The existing form input names, enums, state, validation, handlers, endpoints and contracts are unchanged; no new form submission service was added.

Editor-only attributes add no wrapper elements. Direct fields and data values can be selected on the existing page. Ambiguous repeated values and elements with multiple styled text segments retain separate keys and offer a contextual field selector. The searchable **Edit fields** menu lists all fields for the current page plus shared content, including metadata and conditional/modal/print fields. Selecting a hero slide field reveals that slide and pauses autoplay only while editing. Normal public autoplay is unchanged.

The contextual editor supports field-specific Save/Cancel, validation/conflict errors, preview, destination confirmation, replacement image upload, restore-original, saved revision previews, confirmed revision restoration and loading older history. Saves and reversions retain other fields' drafts and expected revisions. Uploading an image prepares a draft; only a subsequent Save publishes it. Existing authenticated editor intent remains separate from server authorization.

## Server rendering, metadata and freshness

The root server layout loads validated public overrides before rendering and passes the same snapshot to the client provider. React's request-scoped cache shares that read with metadata generation. Public routes render dynamically; no cross-request content cache can retain a pre-save snapshot. Missing/invalid rows and database-read failures preserve exact original defaults. Metadata title/description retain their original values until deliberately edited.

Published values are therefore available in the initial server-rendered page, including shared content. Normal client navigation refreshes only the relevant public projection once per page change; the initial server snapshot does not require a hydration-time default-text replacement. A save updates local published values immediately and requests a server refresh. Original data-dependent loading, modal and empty-state branches remain in place; a field in a closed modal remains conditional rather than inventing a new public section.

## Images and persistent storage

The new authenticated multipart endpoint is `POST /api/website-content/images/:key`. It uses the existing administrator middleware, origin checks, request bounds and concurrent-upload limit. Only approved static image keys accept uploads. JPEG, PNG and WebP contents/signatures/filenames are checked; SVG, PDF, animation, corrupt data, oversized files and excessive pixel dimensions are rejected.

`websiteImageProcessor.js` is separate from the original Gallery/Staff `imageProcessor.js`, whose bytes and 360×360 behavior remain unchanged. Website uploads accept at most 10 MB and 40 million decoded pixels, apply EXIF rotation, preserve aspect ratio, never upscale or crop, strip metadata and produce WebP widths up to 640/1280/1920/2560 where the source permits. Original static files are never overwritten, moved or deleted.

Replacement families are stored under the existing persistent `UPLOAD_DIR` as `website/<uuid>/<width>.webp`. A non-public JSON manifest records the selected slot and variants. Saving/restoring validates that an uploaded family belongs to that exact field. Replaced `<img>` slots receive responsive `srcSet`/`sizes`; original images receive no new presentation attributes. Backgrounds use the optimized primary image. Existing layout classes, including their original image fit/shape, remain intact.

Files used by earlier revisions are retained for rollback. The existing generic upload/delete endpoints cannot write into or delete the reserved website namespace, including case/URL-encoded spellings. Existing Gallery/Staff/Syllabus storage paths and CRUD behavior are otherwise preserved. Website files belong in the existing persistent-upload backup/restore process; they are not release assets.

The 20 approved slots include the logo, hero background, principal photograph, founder photos, feature-card images and timeline images. Dynamic avatar URL fragments and the map iframe are explicitly protected; their fragments are not replaceable standalone photographs.

## Destinations and existing records

Each approved destination offers its exact original value plus existing public routes. The server independently validates membership, and save/reset/restore require the boolean `confirmDestination: true` for URL fields. The editor requires an explicit confirmation checkbox describing the saved/selected destination. JavaScript/data URLs, arbitrary external hosts, admin paths and unapproved query destinations cannot be introduced.

Both fee-payment URLs remain protected and keep their existing bank associations. Structural dropdown grouping paths and the Footer's login entry remain technical navigation values, rather than editable destinations. Existing displayed labels stay editable. External destination defaults such as phone/mail/maps remain unchanged until an explicit approved selection is saved.

Circulars, Staff, Gallery and Syllabus still use their original records, models, APIs and admin tools. Record actions continue to delegate to those existing modules. No dynamic records were copied into WebsiteContent. The original Gallery Lightbox handlers and Syllabus filters/PDF behavior are retained.

Mandatory Disclosure is deliberately limited to its existing displayed text. `getDisclosures()` still returns an empty array and `/admin/disclosure` still has no completed CRUD module. Certificate schemas, publication rules, uploads and administrative management require separate product/data-management work. No certificates, links, school information or default public sections were invented.

## Preservation and evidence

`task04-source-inputs/` contains exact copies of the Task 03 component sources, with their hashes in `task04-source-inputs.json`. `scripts/task04-bindings.mjs --check` reconstructs every approved binding from those inputs and the immutable Task 01 source locations, preserving exact defaults and rejecting unrelated source changes. Only changed code-line whitespace is normalized; literal contents remain exact.

`task04-changes.json` records exact before/after hashes on top of the prior stage chain. The combined verifier also checks the original assets/styles/routes/API contracts and invokes the historical preservation gate with exact per-file approvals. The earlier Footer approval has an explicit hash transition. No folder-wide exemptions or overwritten historical baselines were used.

Read [the completeness audit](12-TASK04-COMPLETENESS.md) and [field-level coverage](task04-coverage.json) for all keys/routes and verification status. Controller/database checks, real Next HTTP checks, source/markup checks and browser acceptance are reported separately.

## Browser verification limit and manual acceptance

Browser discovery returned no available browser surface and reported **“The browser access host is unavailable.”** Desktop/tablet/mobile screenshots, hydrated keyboard interactions and actual browser Lightbox/form/carousel behavior could not be verified. Automated SSR/stubbed-component checks are not a substitute for those checks. No alternative browser-control path was used.

For a disposable interactive preview, run `node scripts/preview-website-editor.mjs --port 3210` and use only its printed fixture account. It creates its own temporary MongoDB, circular and local Gallery images, never school data. Stop it with `quit` and Enter. Production HTTP acceptance can be repeated after building with `node scripts/preview-website-editor.mjs --port 3210 --mode production --verify-pages true`; it uses the production HTTPS-origin requirement with a fixed synthetic proxy-origin header and cleans up automatically. Production security is not disabled for this check.

At desktop, tablet and mobile widths, verify:

1. Sign in, open Edit Website and navigate all 23 public routes. Search page/shared fields, edit styled heading segments and repeated items, save, reload as a visitor and restore originals.
2. Edit shared Footer/Navbar content and verify it across routes. Check metadata, FAQ/table/timeline values and conditional/modal/print text without altering their existing presentation.
3. Upload wide/tall/transparent image examples to different approved slots, preview, save, reload and restore older/original images. Check fit and responsive resource selection.
4. Confirm URL changes explicitly. Verify that fee links, dropdown grouping, external-navigation protection, normal public navigation and the login entry behave as intended.
5. Exercise the existing Contact/Admission Inquiry flows in normal mode; verify edit clicks cannot submit them. Check keyboard focus, responsive toolbar/panels, unsaved exits and conflict handling in two sessions.
6. Exercise existing Circulars/Staff/Gallery/Syllabus management actions, Gallery filtering/Lightbox and Syllabus filters/PDF links. Confirm that Disclosure's current empty behavior remains intact.

No school account/database was used for automated mutations and no deployment/publication was performed by this stage.
