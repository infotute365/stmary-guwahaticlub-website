# Task 03 — Visual website editor

The existing administrator sidebar now has exactly one additional **Edit Website** navigation item. It opens `/`, using the actual public Homepage, TopBar, Navbar, Footer and original sections. There is no duplicate site or alternative public layout. Task 04 has not been started.

## Using the editor

1. Sign in through the existing administrator login. Choose **Edit Website** in the existing sidebar.
2. Wait for the current session and page catalog to be verified by the server. The editor toolbar then appears over the original page.
3. Click an outlined field, use Tab then Enter, or choose a field from **Edit fields**. The contextual panel edits only that registered scalar value. Original and currently saved content are available in its disclosure.
4. **Save** writes only the selected field with its expected revision. **Cancel** discards only that field's draft. **Save Changes** writes the dirty bound fields individually; **Discard Changes** clears unsaved drafts. Partial failures retain remaining drafts; no unrelated catalog values are posted.
5. **Preview** hides outlines, panels and toolbar, while keeping draft values visible. A small **Return to editing** button restores editing and receives keyboard focus.
6. **Exit Editor** returns to the existing dashboard. With unsaved changes, choose Save and Exit, Discard and Exit, or Cancel. The same check applies when delegating to an existing content module. A browser unload with drafts uses its native unsaved-change warning.

All 23 existing public paths remain navigable. Editor intent and drafts survive client-side public navigation in the root provider. Intent can survive a reload; drafts remain in memory and are not written to browser storage. Saved content is read from the published-content API after reload. No query parameter enables editing. Other public pages show the editor toolbar and existing-module tools, but their static text has not been bound in this initial integration.

## Four connected fields

| Original field | Frozen content key |
| --- | --- |
| First hero slide heading | `home.hero-carousel.slides.item1.title` |
| First hero slide description | `home.hero-carousel.slides.item1.description` |
| Existing welcome paragraph | `home.welcome-section.welcome-section.paragraph` |
| Established quick fact | `home.home.item1.value` |

The original slide array, other slides, quick-fact array, wording, layout elements, existing classes, images and destinations are preserved. The welcome paragraph's fallback exactly matches the original JSX-visible text. Inactive-hook SSR tests compare the changed components with the original Task 01 snapshots. The hero carousel pauses on its first slide only while actively editing; preview/exit resumes its existing autoplay. Its original normal-mode configuration is unchanged.

`useWebsiteField` returns a value and editor-only attributes for an existing element. It adds no wrapper and uses normal React escaping. It works for single-line/multiline text, individual styled segments, labels, card/list text and scalar values. `useWebsiteAttribute` supports the approved presentation attributes placeholder/title/alt/src/href/aria-label without permitting arbitrary event/style attributes. Further binding coverage belongs to Task 04.

The contextual panel has protected image/destination presentation, but all existing image/URL fields remain protected by the Task 01/02 backend allowlist. No image replacement or fee-link change is enabled by this task. No raw JSON/HTML editor or document-wide contenteditable behavior is introduced.

## Security and interactions

Browser session storage holds only the string `requested`, never credentials, authorization, content values or server revisions. Controls start hidden. Fresh authenticated `getSession()` and catalog responses must confirm the current active administrator before controls are enabled. Navigation requires a catalog for the new page; focus/visibility and a periodic check revalidate access. Anonymous/expired/forbidden access clears mode state. Client AuthContext claims alone cannot authorize the editor. Every save still passes the unchanged server-side allowlist, active-role authentication, origin validation and concurrency checks from Task 02.

Drafts are separate from published values and appear only while an authorized editor is active. A revision conflict keeps the draft and offers **Reload saved value**; it never silently advances the draft's original concurrency token. Saves use an immediate in-flight lock to prevent duplicate clicks. Published-response races cannot replace a newer successful local save/catalog result.

Only authenticated edit mode installs selection/interaction listeners and editor attributes. Payment, external and non-HTTP link activation is blocked in edit mode, including preview; public forms cannot submit from editor interactions. Normal public mode retains the original links/forms/animations/Lightbox handlers. Existing public CSS is untouched. Editor CSS is scoped to its portal; outline rules exist only in the authenticated, non-preview portal and match editor-only attributes.

The toolbar and panels include responsive mobile/tablet rules, focusable field selection, live status/errors, field labels, a keyboard-focused preview return button and a focus-trapped unsaved-exit dialog. No editor elements are rendered for ordinary visitors. Responsive CSS and controller behavior are implemented; actual desktop/mobile browser acceptance is limited as described below.

## Existing database records

Circulars, Staff, Gallery and Syllabus retain their own models/APIs/admin pages. Minimal editor-only record attributes identify the original rendered records. The existing-content menu and record hover action open a contextual action that delegates to the respective existing `/admin/...` module. Record labels are shown; raw IDs/JSON are not editing fields. Those existing modules do not support selecting a record via a URL, so the editor opens their existing list rather than inventing an unsupported deep link.

Record hover buttons sit outside the original record bounds; the Gallery image's original click still opens its Lightbox. Alt+Enter on a managed record opens the contextual action. No dynamic records are copied into WebsiteContent and no existing CRUD behavior was rewritten.

## Files and preservation evidence

New runtime files are in `src/components/website-editor/`: WebsiteEditorProvider.jsx, WebsiteEditorUI.jsx, WebsiteEditorUI.module.css, useWebsiteField.js, editor-state.js and editor-bindings.js. The root Providers adds the DOM-free provider, AdminLayout adds the one item, and the eight public-component integrations add only value bindings or editor-only record attributes. Card forwards the empty-or-editor attribute object without adding a wrapper.

New test files: website-editor.test.js, website-editor-preservation.test.js and website-editor-controller.test.js. New tooling: preview-website-editor.mjs and verify-website-editor.mjs. Exact source hashes and new-file hashes are in [task03-changes.json](task03-changes.json). Earlier Task 01/02 evidence remains frozen.

The strict historical preservation script still rejects changed public files, including the newly authorized bindings; the previously recorded TopBar discrepancy also remains. It was not deleted, weakened or rebaselined. The Task 03 addendum verifies exact approved integrations and all untouched hashes, while retaining a nonzero exit for that old gate. The preservation tests additionally check all original public element names/attributes and equal inactive component markup with inert browser-library stubs. They do not claim pixel or hydrated-DOM equivalence.

## Tests actually performed and limitations

- Production build: passed on Next.js 15.5.28; all existing public/admin routes retained.
- The targeted editor/state/hook/preservation tests passed, including exact defaults, empty/zero values, protected navigation, original concurrency tokens and unchanged inactive markup for eight public integrations.
- The actual provider executes in a deterministic React-hook/API harness to test spoofed intent rejection, verified activation, selected-only saves, duplicate-save lock, conflict retention, preview, Cancel, public navigation and all Exit choices. This is a controller test, not browser automation.
- The complete database-enabled suite runs through the existing isolated-MongoDB runner. Its final actual count/result is recorded in [task03-verification-results.json](task03-verification-results.json).
- A disposable local Next/MongoDB preview started successfully. Computer Use could not inspect Chrome because it was minimized, then stopped at the Windows browser URL policy check when the fallback browser URL could not be determined confidently. No policy bypass or alternative browser-control channel was attempted. **Actual browser click-through, screenshots, mobile viewport acceptance and real Lightbox interaction were not verified.** The owned preview process tree was stopped and its temporary data removed.
- No real school database/account/records were used. No production deployment or publishing was performed.

For manual acceptance, start `node scripts/preview-website-editor.mjs --port 3210` in an interactive terminal, use the printed disposable fixture login, and follow the usage steps above at desktop/tablet/mobile widths. Stop that terminal fixture with `quit` and Enter. Check the four fields, save/reload, conflict, Preview, each Exit choice, external/payment protection, non-submitting forms and Gallery Lightbox before deployment. No real school credentials are needed for this fixture.
