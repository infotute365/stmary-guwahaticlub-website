# Existing dynamic modules and incomplete features

This is a source audit, not a live MongoDB export. Model field templates are recorded in [dynamic-fields.json](baseline/dynamic-fields.json); actual record counts, record values and external uploaded files were not queried. No database, model, API, admin UI or record was changed.

## Shared request and storage behavior

All modules use `src/services/api.js` → `app/api/[...path]/route.js` → `src/server/route-adapter.js` → `src/server/controller/*.controller.js` → the existing Mongoose models. POST/PUT/DELETE content routes require the existing administrator session; public read handlers filter unpublished/inactive records, including by-ID reads. `all=true` includes hidden records only for an authenticated administrator. The adapter preserves `{ message }` errors, mutation-origin checks, rate/body limits and cookie semantics.

Uploads use authenticated `POST /api/upload/image` (`image` multipart field), `/images` (`images` fields), or `/pdf` (`pdf` field), with the existing `folder` query. Responses expose `path` and the existing message/filename or images fields. `DELETE /api/upload/file` takes `{ filePath }`. Images are validated, processed with Sharp and saved as WebP; images over 360 pixels in either dimension are resized/cropped to 360 × 360. Existing files are not reprocessed by this audit. PDFs retain PDF bytes. Maximums are 5 MiB/image, 15 MiB/PDF and four images/request, with additional request/concurrency/quota limits.

Storage remains `UPLOAD_DIR` or the development `public/uploads` fallback. Production requires an absolute persistent external directory. Both `/uploads/...` and `/api/uploads/...` serve the same local media. Image/file helper normalization in `api.js` and direct URL construction in individual components differ; retain each existing contract. Authentication credentials, upload folder rules, resize policy, limits, query enum values and file serving are technical configuration, not editable website content.

## Circulars

| Area | Current implementation |
| --- | --- |
| Admin | `app/admin/circulars/page.jsx` → `src/components/admin/Circulars.jsx`. Loads `getCirculars(true)`, creates/edits modal fields, optionally uploads a PDF, toggles published/draft, confirms deletion and refreshes the list. |
| Model | `src/server/model/circular.model.js`, Mongoose model `Circular`: required `title`, `content`; `date` defaults to now; `time` defaults to `10:00 AM`; optional `fileUrl`; `isPublished` defaults true; `createdBy`; timestamps. |
| Read | `GET /api/circulars` returns an array, sorted by `date` descending then `createdAt` descending, populating `createdBy` fullname/email. `GET /api/circulars/:id` returns the record. `getCirculars()` tolerates an array or the existing `circulars`/`data` envelope. |
| Create/update | `POST /api/circulars` returns HTTP 201 `{ message, circular }`; `PUT /api/circulars/:id` returns `{ message, circular }`. Required title/content and existing controller fallbacks are retained. Updates run validators. Replacing a nonempty file URL deletes the old local file after update; clearing it with an empty string is not supported by the current fallback logic. |
| Delete | `DELETE /api/circulars/:id` deletes its local attachment, then the record, and returns `{ message }`. |
| Public render | `src/components/home/CircularsPanel.jsx` on `/` fetches published circulars and takes the first four. It renders title/date/time, opens the full notice modal, displays content and supports attachment download or generated print notice. Static headings/actions and print-header/footer wording are separately registered. The View All Notices anchor currently points to `#`; there is no separate public notices route. |

The generated notice uses `element.innerHTML` with interpolated record title/content and writes a print window; this is existing behavior requiring separate review before binding or editing print content. It is not changed here. Old reports should not be interpreted as a guarantee that there is no active HTML interpolation in this checkout.

## Staff

| Area | Current implementation |
| --- | --- |
| Admin | `app/admin/staff/page.jsx` → `src/components/admin/Staff.jsx`. Lists all authorized records with a category filter, uploads optional staff image, creates/edits records and confirms deletion. Derives `staffType` from selected category rather than treating it as display wording. |
| Model | `src/server/model/staff.model.js`, model `Staff`: required name, designation, category, staffType and qualification; optional subject, experience, bio, email, phone and image; displayOrder defaults 0; isActive defaults true; timestamps. Categories: management, primary, middle, high, higher-secondary, non-teaching. Types: management, teaching, non-teaching. |
| Read | `GET /api/staff?category=...&staffType=...&all=true` returns an array sorted by staffType, category, displayOrder and name ascending. Public reads require isActive. `GET /api/staff/:id` returns one visible/authorized record. |
| Create/update | `POST /api/staff` returns HTTP 201 `{ message, staff }`; validates category/type combinations. `PUT /api/staff/:id` updates explicit fields, runs validators and returns `{ message, staff }`. A new image path replaces the old image and triggers old local-file cleanup; null/empty image preserves the previous image. |
| Delete | `DELETE /api/staff/:id` removes its local image and then record; returns `{ message }`. |
| Public render | Management calls `getStaff('management','management')`; NonTeachingStaff calls `getStaff('non-teaching','non-teaching')`; PrimarySchool, MiddleSchool, HighSchool and HigherSecondery call their corresponding category with `teaching`. They render the unchanged StaffCard or existing Coming Soon fallback. |

StaffCard displays name, designation, qualification and experience, with conditional email/phone links. The image alt derives from name; absent image uses the existing ui-avatars URL with the name. Subject and bio are managed by the admin but not shown in this shared card. Preserve existing heading labels, including the source's particular class-range descriptions, without correcting their wording as part of a CMS foundation.

## Gallery

| Area | Current implementation |
| --- | --- |
| Admin | `app/admin/gallery/page.jsx` → `src/components/admin/Gallery.jsx`. Uses `getGalleryEvents(1,100,true)`, creates/edits events, uploads/attaches up to four selected files per operation, removes individual images and confirms event deletion. The implementation uploads selected images one at a time before attaching their paths; do not replace its workflow. |
| Model | `src/server/model/gallery.model.js`, model `Gallery`: unique name and slug, description, nested images `{ image, title, uploadedAt }`, coverImage, eventDate, isActive, displayOrder, createdBy and timestamps. |
| Read | `GET /api/gallery` returns `{ data: events, pagination }`. Pagination is applied to events, with displayOrder ascending/eventDate descending. `flat=true` flattens images from that page of events and still reports event pagination totals. Public reads include only active events. GET by `/:id` and `/slug/:slug` return a record. |
| Create/update | `POST /api/gallery` generates a lowercased hyphenated slug from name, checks duplicate slugs, and returns HTTP 201 `{ message, event }`. `PUT /api/gallery/:id` updates explicit event metadata, recalculates slug when name changes, validates uniqueness and returns `{ message, event }`. |
| Image operations | `POST /api/gallery/:id/images` accepts `{ images: [path,...] }`, max four per call; appends image records and sets the first cover if absent. `PUT /api/gallery/:eventId/images/:imageId` takes `{ title }`; returns `{ message, event }`. The current admin UI does not expose the image-title update endpoint. |
| Delete | DELETE the nested image URL deletes its local file, removes the subdocument and reassigns the cover if needed. `DELETE /api/gallery/:id` deletes nested image files, cover image and record. Existing messages/event envelopes are retained. |
| Public render | `src/site-pages/Gallery.jsx` calls `getGallery(1,12,false)` then subsequent pages through IntersectionObserver. Search and categories filter the already loaded images. Card title uses image title or event name; category is event name. Date uses image upload date or event date. Existing view modes, lightbox, zoom/rotation, browser share, download and in-memory favorites remain intact. |

The event model has no four-images-total limit: append calls can add further batches. The UI's “up to 4 images per event” wording and event-based flat pagination are existing characteristics, not changed contracts. Description and cover image are managed/stored metadata; the public flat image response does not expose them as separate fields. No new public event route was inferred from the API slug endpoint.

## Syllabus

| Area | Current implementation |
| --- | --- |
| Admin | `app/admin/syllabus/page.jsx` → `src/components/admin/Syllabus.jsx`. Loads all authorized entries, uploads/replaces the PDF, creates/updates academic year/class/stream and publish state, and confirms deletion. |
| Model | `src/server/model/syllabus.model.js`, model `Syllabus`: required academicYear, class and fileUrl; stream defaults general; fileName, isPublished, displayOrder, uploadedBy and timestamps. Classes KG and 1–12; streams arts, science, commerce, general. |
| Read | `GET /api/syllabus` returns an array filtered by class, academicYear, stream and public publication state; sorted academicYear descending, class ascending, displayOrder ascending. By-ID returns a record. `/academic-years`, `/classes?academicYear=...`, `/streams?class=...` return distinct value arrays; class sorting puts KG first, then numeric classes, and stream helper excludes general. |
| Create/update | `POST /api/syllabus` requires academic year/class/file; classes 11/12 require a stream; returns HTTP 201 `{ message, syllabus }`. `PUT /api/syllabus/:id` updates explicit fields, validates, replaces/deletes the prior PDF when appropriate, and returns `{ message, syllabus }`. |
| Delete | `DELETE /api/syllabus/:id` deletes the local PDF and record; returns `{ message }`. |
| Public render | `src/site-pages/academics/Syllabus.jsx` loads academic years, chooses the first year, then classes, conditional streams and filtered records. Renders class, conditional stream, View PDF link, upload date, counts and empty-state text. The unused classOptions array is not editable page wording; stream display labels are separate from protected enum values. |

The model's existing `{ academicYear: 1, class: 1, subject: 1 }` index names a subject property absent from the current schema. The distinct helper queries do not apply publication filtering. These source observations are recorded for later scoped work; no index, query, default or behavior was changed.

## Mandatory Disclosure: current stub

`app/(site)/mandatory-disclosure/page.jsx` imports `src/site-pages/MandatoryDisclosure.jsx`. It calls `getDisclosures()`; the export in `src/services/api.js` simply resolves `[]` and performs no HTTP request. Create/update/delete service functions are commented out. No disclosure model, controller, dispatcher branch, admin component or `/admin/disclosure` page exists.

The public component has loading, empty and hypothetical populated-card branches. The populated branch expects title, description, status, fileUrl and expiryDate; status changes icons/colors, defaults to Valid, and labels cards Verified. A footer uses the browser's current date as Last Updated, not a record update timestamp. All static wording remains inventoried, including presently unreachable populated-state text; no default certificate records were invented. These hypothetical fields are not reported as an existing MongoDB module.

AdminLayout includes a Disclosure navigation target `/admin/disclosure`, which is missing. The dashboard actively loads only Circulars, Staff, Gallery and Syllabus. Completing disclosure CRUD, removing its link, adding documents, correcting verification wording or changing date semantics requires a separate request; none was done here.

## Other existing functional limits

ContactUs, AdmissionInquiry and the unused common ContactForm simulate submission with timers, local state and success messages; they do not persist inquiries or send email through this backend. Preserve this behavior in Task 01. Clubs & Associations and Formative Moments are static Coming Soon pages. Admissions includes a prospectus modal saying the download will be available soon. Social anchors in Footer/Contact include `#` placeholders, and Privacy Policy/Terms of Service are text, not implemented routes. FeatureCard's Learn More is display UI with no destination. These are existing gaps, not changes introduced by this audit.

No live database inventory or end-to-end browser interaction is claimed. Unit/security tests and the production build passed as recorded in [03-PRESERVATION-BASELINE.md](03-PRESERVATION-BASELINE.md); the opt-in real MongoDB integration test was skipped.
