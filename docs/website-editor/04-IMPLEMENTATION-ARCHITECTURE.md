# Visual website CMS foundation — architecture only

Task 01 provides an offline registry and preservation evidence. It implements no visual editor, content reader, MongoDB content collection, migration, new runtime API or public-page binding.

## Current architecture

Next.js 15 App Router page wrappers in `app/(site)` import client page components from `src/site-pages`. `app/(site)/layout.jsx` renders TopBar, Navbar, the page in `main`, and Footer. `app/layout.jsx` adds metadata, providers, global CSS and Vercel Analytics. React 19, Tailwind 4, Framer Motion and Swiper control existing presentation and interactions. The lockfile/build identifies Next.js 15.5.28; no dependency was upgraded for this task.

Public dynamic records flow through `src/services/api.js` to `/api/[...path]`, then `src/server/route-adapter.js` and the existing controllers/models. `NEXT_PUBLIC_API_URL` defaults to `/api`. Axios uses credentialed requests and shares a refresh request across concurrent 401s; admin `all=true` reads first check the session. Fetch-based uploads use the same refresh behavior.

The adapter converts Next Requests into the controllers' existing request/response shape. It resolves awaited route parameters, validates origins and bounded bodies, applies throttles, connects through the cached Mongoose helper, and authenticates mutations before parsing upload bodies. Public reads filter drafts/inactive records, and administrator reads can include them. Preserve existing arrays/envelopes and URL normalization rather than replacing controllers or introducing an alternate backend.

JWT access cookies, refresh rotation/history, session versions, role checks, Secure/HttpOnly/SameSite settings, password provisioning and upload/storage settings remain technical configuration. The production launcher validates configuration; Nginx and PM2 examples expect an isolated Guwahati Club app and external persistent upload directory. These files are hash-protected by the new baseline.

## Registry boundary

The machine-readable source of truth is [content-registry.json](baseline/content-registry.json); [02-CONTENT-REGISTRY.md](02-CONTENT-REGISTRY.md) is its human-readable view. It is documentation data and is not imported into the running site.

Each static entry has a frozen unique `key`, `scope`, `pagePath`, `section`, human-readable `fieldName`, `contentType`, exact `defaultValue`, exact `rawSource`, source file/line/column/character range/AST address, `status`, `existingDataSource`, `audience`, and `usedOnRoutes`. Character offsets are JavaScript string offsets, not byte offsets. Exact byte preservation is checked independently by SHA-256.

Keys were discovered from actual source files, array item positions, property names and original JSX segments. Once published here, they are identities: never regenerate or renumber them when text changes or items move. Preserve the same key and deliberately migrate its locator. The `section-N` identities name the original source section occurrence; they do not authorize adding, moving or renaming sections. Repeated desktop/mobile or loading/loaded literals keep separate keys. No automatic synchronization is inferred from equal strings.

Home-only components have page scope `/`; shared layout/common text has global scope and an explicit list of using routes. An absent `pagePath` on a global entry means a reusable field, not a new route. Admin/system and dormant fields remain protected and outside the public editing surface. Dynamic templates in [dynamic-fields.json](baseline/dynamic-fields.json) remain owned by existing modules; their null values mean unknown live records, never blank replacement content.

## Editable text versus technical configuration

| Eligible content | Protected or excluded |
| --- | --- |
| Exact headings, individual styled text fragments, paragraphs, data-array descriptions, card statistics, FAQ text and rule/list items | Element hierarchy/order, React keys, internal IDs, icon components and decorative glyphs |
| Navigation labels and footer/contact text | Existing route/link destinations, bank URLs, API bases, generated URL prefixes and upload paths |
| Labels, placeholders, button wording, visible success/error fallback text and select display labels | Input names/types/values, validation rules, required flags, filter/stream/category enum values and submit behavior |
| Existing school information, table labels/values, static visible statistics and image alt wording | Existing image sources/background images, styles, classes, colors, dimensions, fonts, animation settings and carousel behavior |
| Static print-notice wording, identified separately from markup | Print HTML markup/CSS/scripts and record-provided HTML interpolation |
| Root title/description metadata, separately recorded | Secrets, auth/session settings, technical errors/API contracts and deployment configuration |

Image references and destinations are inventoried as content-related fields but protected under this request's explicit preservation constraints. Alt text may come from a shared title/name field; inspect the corresponding render expression before any later binding so editing one underlying value does not unintentionally change a different presentation. An API-provided error message is a dynamic expression controlled by its existing service, not a license to make backend diagnostics editable.

The AST pass excludes commented-out code, imports, object keys, CSS/script bodies, animation configuration, state initialization, comparisons, formatting constants and behavior props. Every literal classification and reason remains reviewable in `source-literals.json`. Reachability follows rendered component references rather than unused imports, with a further check of data-variable/property consumers. Consequently dormant StatsCounter, ContactForm and Lightbox text, unused founders shortName values, and the unrendered Admissions feeStructure data are documented but not counted as currently editable public content.

## Proposed later implementation boundary

For a later authorized prompt, introduce a dedicated reader that accepts only registered keys and returns the exact static default when no published override exists. Preserve missing-versus-empty semantics; do not use a truthiness fallback that discards an intentional empty value. Keep text escaped through React, and preserve existing styled segment boundaries, whitespace and line breaks. Do not introduce rich HTML, extra wrapper elements or editable layout markup.

Use the existing client/server boundary deliberately: define when published overrides are loaded, how initial SSR and hydration receive the same version, how cache invalidation works, and what happens during database failure. No extra fetch is introduced here. A reader signature proposed only for preservation review is `getWebsiteContent(key, originalDefault)` from `src/content/website-content.js`; that file does not exist in Task 01.

If persistence is later authorized, use a separate collection for registered static overrides with explicit type/scope validation, draft/published versions, audit metadata and rollback. Do not extend or rename existing Circular, Staff, Gallery, Syllabus or Auth schemas. Use existing JWT cookie authentication, administrator roles and mutation security conventions for any separately authorized endpoint. Never expose unregistered keys, security settings, arbitrary URLs, markup or filesystem paths as editable fields.

Keep Circulars, Staff, Gallery and Syllabus editing in their current admin modules. A later visual selection may link into the existing module for a record; it must not duplicate that record into the static registry or create a second source of truth. Category/stream IDs, ordering, visibility controls and record IDs remain the existing module's business logic. Mandatory Disclosure needs its own scoped product/backend decision because its current implementation is a stub.

Preview should eventually show draft content only to authenticated editors, using a separately designed draft mechanism that cannot leak into public caches. Editing, saving and publishing should be explicit and reversible. A missing or failed override lookup must preserve the original site. These are design requirements for a future task, not delivered features.

## Acceptance before later content bindings

Use the exact-range review process in [03-PRESERVATION-BASELINE.md](03-PRESERVATION-BASELINE.md). First establish a reviewed resolution for the pre-existing TopBar baseline discrepancy. Compare an empty-override render with this baseline, including desktop/mobile screenshots and the same populated/empty dynamic fixtures. Verify every original URL, image/alt expression, bank link, shared label, styled fragment, form behavior, dynamic module and authentication flow. New source bindings must preserve all original defaults and pass independently reviewed preservation exceptions without disabling the old checker.

This foundation does not decide the content database schema or ship a binding/editor. Stop at Task 01 until the next user request.
