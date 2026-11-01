# Stable content registry

Generated from the actual executable UI source on 31 October 2026; manually reviewed against data arrays, JSX, active component use, printable notice HTML, models and services. This is an offline foundation, not runtime CMS content. **883 editable public scalar fields** are identified. No existing content was changed.

## Counts and ownership

| Category | Fields |
| --- | ---: |
| Editable public static fields | 883 |
| Protected public references/punctuation/technical display fragments | 136 |
| Dormant component fields (protected) | 45 |
| Admin/system fields (protected) | 224 |
| Total static registry entries | 1288 |
| Separate existing MongoDB field templates | 40 |

The total is a count of source field occurrences, not a count of words or DOM instances. A data title reused as heading and image alt is one underlying field; a repeated literal in a separate loading/mobile branch is a separate field. Existing record field templates are counted separately and not migrated into static content. No live record values/counts are asserted. Dormant and admin/system wording is outside the public editing surface.

## Registry contract

[content-registry.json](baseline/content-registry.json) is authoritative. Each entry carries key, global/page scope, page path, section identifier, human field name, content type, exact default value, original raw source, source reference, editable/protected status, existing data source, audience and route use. The tables below show every static entry; all are static-source owned. Full source addresses, offsets and usage arrays remain in JSON.

Keys are frozen identities from actual component/data property/section occurrences. Do not renumber array item keys or regenerate JSX counters after editing. Section-N identifies the original section occurrence. Global page paths are null in JSON; Home-only child components are page scoped to /. No illustrative school defaults were invented. The registry does not make any route, icon, class, stylesheet, internal ID, application condition, security setting or schema editable.

Default values below use JSON notation, so meaningful line breaks, leading/trailing spaces and escapes remain visible. rawSource preserves the exact original source spelling (including JSX entities, string escapes and line endings), while defaultValue is the original JavaScript/JSX value. React JSX indentation folding is represented separately from raw source. Styled spans keep separate text segments; punctuation/glyphs and reference destinations stay protected.

Existing image URLs/background images and link/payment destinations are recorded but protected under this request. Labels and alt wording can be eligible; where an alt derives from a title/name, preserve that relationship deliberately. See render-expressions.json for all exact derived bindings rather than inventing duplicate default strings.

## Static field inventory

### app/layout.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| global.layout.metadata.title | global / shared | metadata / layout / metadata / title | text | editable | "St. Mary's School" | 6 |
| global.layout.metadata.description | global / shared | metadata / layout / metadata / description | text | editable | "St. Mary's School website" | 7 |

### src/components/admin/Circulars.jsx

Audience: admin-or-system.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| global.circulars.fetch-circulars.text | global / shared | fetch-circulars / Circulars / fetch-circulars / text | text | protected | "Failed to fetch circulars" | 34 |
| global.circulars.handle-submit.text | global / shared | handle-submit / Circulars / handle-submit / text | text | protected | "Circular updated successfully" | 63 |
| global.circulars.handle-submit.text.2 | global / shared | handle-submit / Circulars / handle-submit / text 2 | text | protected | "Circular created successfully" | 66 |
| global.circulars.handle-submit.text.3 | global / shared | handle-submit / Circulars / handle-submit / text 3 | text | protected | "Operation failed" | 74 |
| global.circulars.handle-delete.text | global / shared | handle-delete / Circulars / handle-delete / text | text | protected | "Circular deleted successfully" | 85 |
| global.circulars.handle-delete.text.2 | global / shared | handle-delete / Circulars / handle-delete / text 2 | text | protected | "Failed to delete circular" | 89 |
| global.circulars.handle-toggle-publish.text | global / shared | handle-toggle-publish / Circulars / handle-toggle-publish / text | text | protected | "published" | 96 |
| global.circulars.handle-toggle-publish.text.2 | global / shared | handle-toggle-publish / Circulars / handle-toggle-publish / text 2 | text | protected | "unpublished" | 96 |
| global.circulars.handle-toggle-publish.text.3 | global / shared | handle-toggle-publish / Circulars / handle-toggle-publish / text 3 | text | protected | "Circular " | 96 |
| global.circulars.handle-toggle-publish.text.4 | global / shared | handle-toggle-publish / Circulars / handle-toggle-publish / text 4 | text | protected | "Failed to update status" | 100 |
| global.circulars.circulars.heading | global / shared | circulars / Circulars / circulars / heading | text | protected | "Circulars" | 151 |
| global.circulars.circulars.button-label | global / shared | circulars / Circulars / circulars / button-label | text | protected | "Add Circular" | 156 |
| global.circulars.circulars.paragraph | global / shared | circulars / Circulars / circulars / paragraph | text | protected | "No circulars added yet" | 173 |
| global.circulars.circulars.button-label.2 | global / shared | circulars / Circulars / circulars / button-label 2 | text | protected | "Create your first circular" | 177 |
| global.circulars.circulars.text | global / shared | circulars / Circulars / circulars / text | text | protected | "Published" | 189 |
| global.circulars.circulars.text.2 | global / shared | circulars / Circulars / circulars / text 2 | text | protected | "Draft" | 189 |
| global.circulars.circulars.text.3 | global / shared | circulars / Circulars / circulars / text 3 | text | protected | "Download PDF" | 210 |
| global.circulars.circulars.title | global / shared | circulars / Circulars / circulars / title | text | protected | "Unpublish" | 220 |
| global.circulars.circulars.title.2 | global / shared | circulars / Circulars / circulars / title 2 | text | protected | "Publish" | 220 |
| global.circulars.circulars.heading.2 | global / shared | circulars / Circulars / circulars / heading 2 | text | protected | "Edit Circular" | 249 |
| global.circulars.circulars.heading.3 | global / shared | circulars / Circulars / circulars / heading 3 | text | protected | "Create New Circular" | 249 |
| global.circulars.circulars.text.4 | global / shared | circulars / Circulars / circulars / text 4 | text | protected | "Title *" | 261 |
| global.circulars.circulars.placeholder | global / shared | circulars / Circulars / circulars / placeholder | text | protected | "Circular title" | 268 |
| global.circulars.circulars.text.5 | global / shared | circulars / Circulars / circulars / text 5 | text | protected | "Content *" | 273 |
| global.circulars.circulars.placeholder.2 | global / shared | circulars / Circulars / circulars / placeholder 2 | text | protected | "Circular content..." | 280 |
| global.circulars.circulars.text.6 | global / shared | circulars / Circulars / circulars / text 6 | text | protected | "Date" | 286 |
| global.circulars.circulars.text.7 | global / shared | circulars / Circulars / circulars / text 7 | text | protected | "Time" | 295 |
| global.circulars.circulars.text.8 | global / shared | circulars / Circulars / circulars / text 8 | text | protected | "Upload PDF (Optional)" | 306 |
| global.circulars.circulars.paragraph.2 | global / shared | circulars / Circulars / circulars / paragraph 2 | text | protected | "Leave empty to keep existing file" | 314 |
| global.circulars.circulars.text.9 | global / shared | circulars / Circulars / circulars / text 9 | text | protected | "Publish immediately" | 325 |
| global.circulars.circulars.button-label.3 | global / shared | circulars / Circulars / circulars / button-label 3 | text | protected | "Saving..." | 334 |
| global.circulars.circulars.button-label.4 | global / shared | circulars / Circulars / circulars / button-label 4 | text | protected | "Update Circular" | 334 |
| global.circulars.circulars.button-label.5 | global / shared | circulars / Circulars / circulars / button-label 5 | text | protected | "Create Circular" | 334 |
| global.circulars.circulars.button-label.6 | global / shared | circulars / Circulars / circulars / button-label 6 | text | protected | "Cancel" | 340 |

### src/components/admin/Dashboard.jsx

Audience: admin-or-system.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| global.dashboard.stat-cards.item1.title | global / shared | stat-cards / Dashboard / stat-cards.item1 / title | text | protected | "Circulars" | 62 |
| global.dashboard.stat-cards.item1.path | global / shared | stat-cards / Dashboard / stat-cards.item1 / path | url | protected | "/admin/circulars" | 62 |
| global.dashboard.stat-cards.item2.title | global / shared | stat-cards / Dashboard / stat-cards.item2 / title | text | protected | "Staff Members" | 63 |
| global.dashboard.stat-cards.item2.path | global / shared | stat-cards / Dashboard / stat-cards.item2 / path | url | protected | "/admin/staff" | 63 |
| global.dashboard.stat-cards.item3.title | global / shared | stat-cards / Dashboard / stat-cards.item3 / title | text | protected | "Gallery Images" | 64 |
| global.dashboard.stat-cards.item3.path | global / shared | stat-cards / Dashboard / stat-cards.item3 / path | url | protected | "/admin/gallery" | 64 |
| global.dashboard.stat-cards.item4.title | global / shared | stat-cards / Dashboard / stat-cards.item4 / title | text | protected | "Syllabus" | 65 |
| global.dashboard.stat-cards.item4.path | global / shared | stat-cards / Dashboard / stat-cards.item4 / path | url | protected | "/admin/syllabus" | 65 |
| global.dashboard.dashboard.heading | global / shared | dashboard / Dashboard / dashboard / heading | text | protected | "Dashboard" | 71 |
| global.dashboard.dashboard.text | global / shared | dashboard / Dashboard / dashboard / text | text | protected | "Welcome back, Admin" | 72 |
| global.dashboard.dashboard.heading.2 | global / shared | dashboard / Dashboard / dashboard / heading 2 | text | protected | "Recent Circulars" | 95 |
| global.dashboard.dashboard.href | global / shared | dashboard / Dashboard / dashboard / href | url | protected | "/admin/circulars" | 96 |
| global.dashboard.dashboard.text.2 | global / shared | dashboard / Dashboard / dashboard / text 2 | text | protected | "View All →" | 96 |
| global.dashboard.dashboard.paragraph | global / shared | dashboard / Dashboard / dashboard / paragraph | text | protected | "No circulars yet" | 111 |
| global.dashboard.dashboard.href.2 | global / shared | dashboard / Dashboard / dashboard / href 2 | url | protected | "/admin/circulars" | 112 |
| global.dashboard.dashboard.text.3 | global / shared | dashboard / Dashboard / dashboard / text 3 | text | protected | "Create your first circular →" | 112 |
| global.dashboard.dashboard.href.3 | global / shared | dashboard / Dashboard / dashboard / href 3 | url | protected | "/admin/circulars" | 119 |
| global.dashboard.dashboard.text.4 | global / shared | dashboard / Dashboard / dashboard / text 4 | text | protected | "Published" | 124 |
| global.dashboard.dashboard.text.5 | global / shared | dashboard / Dashboard / dashboard / text 5 | text | protected | "Draft" | 124 |

### src/components/admin/Gallery.jsx

Audience: admin-or-system.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| global.gallery.fetch-events.text | global / shared | fetch-events / Gallery / fetch-events / text | text | protected | "Failed to fetch events" | 45 |
| global.gallery.handle-submit.text | global / shared | handle-submit / Gallery / handle-submit / text | text | protected | "Event updated successfully" | 66 |
| global.gallery.handle-submit.text.2 | global / shared | handle-submit / Gallery / handle-submit / text 2 | text | protected | "Event created successfully" | 69 |
| global.gallery.handle-submit.text.3 | global / shared | handle-submit / Gallery / handle-submit / text 3 | text | protected | "Operation failed" | 76 |
| global.gallery.handle-delete-event.text | global / shared | handle-delete-event / Gallery / handle-delete-event / text | text | protected | "Event deleted successfully" | 87 |
| global.gallery.handle-delete-event.text.2 | global / shared | handle-delete-event / Gallery / handle-delete-event / text 2 | text | protected | "Failed to delete event" | 90 |
| global.gallery.handle-upload-images.text | global / shared | handle-upload-images / Gallery / handle-upload-images / text | text | protected | "Please select at least one image" | 97 |
| global.gallery.handle-upload-images.text.2 | global / shared | handle-upload-images / Gallery / handle-upload-images / text 2 | text | protected | "Maximum 4 images allowed" | 101 |
| global.gallery.handle-upload-images.text.3 | global / shared | handle-upload-images / Gallery / handle-upload-images / text 3 | text | protected | " image(s) uploaded successfully" | 117 |
| global.gallery.handle-upload-images.text.4 | global / shared | handle-upload-images / Gallery / handle-upload-images / text 4 | text | protected | "Upload failed" | 122 |
| global.gallery.handle-delete-image.text | global / shared | handle-delete-image / Gallery / handle-delete-image / text | text | protected | "Image deleted" | 132 |
| global.gallery.handle-delete-image.text.2 | global / shared | handle-delete-image / Gallery / handle-delete-image / text 2 | text | protected | "Failed to delete image" | 135 |
| global.gallery.gallery.heading | global / shared | gallery / Gallery / gallery / heading | text | protected | "Gallery Events" | 172 |
| global.gallery.gallery.paragraph | global / shared | gallery / Gallery / gallery / paragraph | text | protected | "Manage events and upload up to 4 images per event" | 173 |
| global.gallery.gallery.button-label | global / shared | gallery / Gallery / gallery / button-label | text | protected | "Create Event" | 179 |
| global.gallery.gallery.paragraph.2 | global / shared | gallery / Gallery / gallery / paragraph 2 | text | protected | "No events created yet" | 193 |
| global.gallery.gallery.button-label.2 | global / shared | gallery / Gallery / gallery / button-label 2 | text | protected | "Create your first event" | 197 |
| global.gallery.gallery.text | global / shared | gallery / Gallery / gallery / text | text | protected | " images" | 219 |
| global.gallery.gallery.text.2 | global / shared | gallery / Gallery / gallery / text 2 | text | protected | "Inactive" | 222 |
| global.gallery.gallery.text.3 | global / shared | gallery / Gallery / gallery / text 3 | text | protected | "+" | 256 |
| global.gallery.gallery.button-label.3 | global / shared | gallery / Gallery / gallery / button-label 3 | text | protected | "Upload Images" | 268 |
| global.gallery.gallery.heading.2 | global / shared | gallery / Gallery / gallery / heading 2 | text | protected | "Edit Event" | 298 |
| global.gallery.gallery.heading.3 | global / shared | gallery / Gallery / gallery / heading 3 | text | protected | "Create Event" | 298 |
| global.gallery.gallery.text.4 | global / shared | gallery / Gallery / gallery / text 4 | text | protected | "Event Name *" | 310 |
| global.gallery.gallery.placeholder | global / shared | gallery / Gallery / gallery / placeholder | text | protected | "Annual Day 2025" | 317 |
| global.gallery.gallery.text.5 | global / shared | gallery / Gallery / gallery / text 5 | text | protected | "Description" | 322 |
| global.gallery.gallery.placeholder.2 | global / shared | gallery / Gallery / gallery / placeholder 2 | text | protected | "Brief description of the event" | 328 |
| global.gallery.gallery.text.6 | global / shared | gallery / Gallery / gallery / text 6 | text | protected | "Event Date" | 333 |
| global.gallery.gallery.text.7 | global / shared | gallery / Gallery / gallery / text 7 | text | protected | "Active" | 349 |
| global.gallery.gallery.button-label.4 | global / shared | gallery / Gallery / gallery / button-label 4 | text | protected | "Saving..." | 358 |
| global.gallery.gallery.button-label.5 | global / shared | gallery / Gallery / gallery / button-label 5 | text | protected | "Update Event" | 358 |
| global.gallery.gallery.button-label.6 | global / shared | gallery / Gallery / gallery / button-label 6 | text | protected | "Create Event" | 358 |
| global.gallery.gallery.button-label.7 | global / shared | gallery / Gallery / gallery / button-label 7 | text | protected | "Cancel" | 364 |
| global.gallery.gallery.heading.4 | global / shared | gallery / Gallery / gallery / heading 4 | text | protected | "Upload Images" | 379 |
| global.gallery.gallery.paragraph.3 | global / shared | gallery / Gallery / gallery / paragraph 3 | text | protected | "Event: " | 380 |
| global.gallery.gallery.text.8 | global / shared | gallery / Gallery / gallery / text 8 | text | protected | "Select Images (up to 4)" | 392 |
| global.gallery.gallery.paragraph.4 | global / shared | gallery / Gallery / gallery / paragraph 4 | text | protected | "360x360px recommended, will be resized automatically" | 402 |
| global.gallery.gallery.paragraph.5 | global / shared | gallery / Gallery / gallery / paragraph 5 | text | protected | " file(s) selected" | 403 |
| global.gallery.gallery.button-label.8 | global / shared | gallery / Gallery / gallery / button-label 8 | text | protected | "Uploading..." | 412 |
| global.gallery.gallery.button-label.9 | global / shared | gallery / Gallery / gallery / button-label 9 | text | protected | "Upload " | 412 |
| global.gallery.gallery.button-label.10 | global / shared | gallery / Gallery / gallery / button-label 10 | text | protected | " Image(s)" | 412 |
| global.gallery.gallery.button-label.11 | global / shared | gallery / Gallery / gallery / button-label 11 | text | protected | "Cancel" | 418 |

### src/components/admin/Staff.jsx

Audience: admin-or-system.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| global.staff.subject-options.item1.text | global / shared | subject-options / Staff / subject-options.item1 / text | text | protected | "Mathematics" | 481 |
| global.staff.subject-options.item2.text | global / shared | subject-options / Staff / subject-options.item2 / text | text | protected | "Science" | 482 |
| global.staff.subject-options.item3.text | global / shared | subject-options / Staff / subject-options.item3 / text | text | protected | "English" | 483 |
| global.staff.subject-options.item4.text | global / shared | subject-options / Staff / subject-options.item4 / text | text | protected | "Hindi" | 484 |
| global.staff.subject-options.item5.text | global / shared | subject-options / Staff / subject-options.item5 / text | text | protected | "Assamese" | 485 |
| global.staff.subject-options.item6.text | global / shared | subject-options / Staff / subject-options.item6 / text | text | protected | "Social Studies" | 486 |
| global.staff.subject-options.item7.text | global / shared | subject-options / Staff / subject-options.item7 / text | text | protected | "Computer Science" | 487 |
| global.staff.subject-options.item8.text | global / shared | subject-options / Staff / subject-options.item8 / text | text | protected | "Physics" | 488 |
| global.staff.subject-options.item9.text | global / shared | subject-options / Staff / subject-options.item9 / text | text | protected | "Chemistry" | 489 |
| global.staff.subject-options.item10.text | global / shared | subject-options / Staff / subject-options.item10 / text | text | protected | "Biology" | 490 |
| global.staff.subject-options.item11.text | global / shared | subject-options / Staff / subject-options.item11 / text | text | protected | "Economics" | 491 |
| global.staff.subject-options.item12.text | global / shared | subject-options / Staff / subject-options.item12 / text | text | protected | "Accountancy" | 492 |
| global.staff.subject-options.item13.text | global / shared | subject-options / Staff / subject-options.item13 / text | text | protected | "Business Studies" | 493 |
| global.staff.subject-options.item14.text | global / shared | subject-options / Staff / subject-options.item14 / text | text | protected | "Physical Education" | 494 |
| global.staff.subject-options.item15.text | global / shared | subject-options / Staff / subject-options.item15 / text | text | protected | "Art & Craft" | 495 |
| global.staff.subject-options.item16.text | global / shared | subject-options / Staff / subject-options.item16 / text | text | protected | "Music" | 496 |
| global.staff.fetch-staff.text | global / shared | fetch-staff / Staff / fetch-staff / text | text | protected | "Failed to fetch staff" | 508 |
| global.staff.handle-submit.text | global / shared | handle-submit / Staff / handle-submit / text | text | protected | "Staff updated successfully" | 549 |
| global.staff.handle-submit.text.2 | global / shared | handle-submit / Staff / handle-submit / text 2 | text | protected | "Staff added successfully" | 552 |
| global.staff.handle-submit.text.3 | global / shared | handle-submit / Staff / handle-submit / text 3 | text | protected | "Operation failed" | 559 |
| global.staff.handle-delete.text | global / shared | handle-delete / Staff / handle-delete / text | text | protected | "Staff deleted successfully" | 570 |
| global.staff.handle-delete.text.2 | global / shared | handle-delete / Staff / handle-delete / text 2 | text | protected | "Failed to delete staff" | 573 |
| global.staff.staff.heading | global / shared | staff / Staff / staff / heading | text | protected | "Staff" | 623 |
| global.staff.staff.paragraph | global / shared | staff / Staff / staff / paragraph | text | protected | "Manage your teaching and non-teaching staff" | 624 |
| global.staff.staff.button-label | global / shared | staff / Staff / staff / button-label | text | protected | "Add Staff" | 630 |
| global.staff.staff.button-label.2 | global / shared | staff / Staff / staff / button-label 2 | text | protected | "All" | 644 |
| global.staff.staff.paragraph.2 | global / shared | staff / Staff / staff / paragraph 2 | text | protected | "No staff members found" | 676 |
| global.staff.staff.button-label.3 | global / shared | staff / Staff / staff / button-label 3 | text | protected | "Add your first staff member" | 680 |
| global.staff.staff.text | global / shared | staff / Staff / staff / text | number | protected | 0 | 699 |
| global.staff.staff.paragraph.3 | global / shared | staff / Staff / staff / paragraph 3 | text | protected | "Subject: " | 707 |
| global.staff.staff.heading.2 | global / shared | staff / Staff / staff / heading 2 | text | protected | "Edit Staff" | 737 |
| global.staff.staff.heading.3 | global / shared | staff / Staff / staff / heading 3 | text | protected | "Add New Staff" | 737 |
| global.staff.staff.text.2 | global / shared | staff / Staff / staff / text 2 | text | protected | "Full Name *" | 750 |
| global.staff.staff.placeholder | global / shared | staff / Staff / staff / placeholder | text | protected | "John Doe" | 757 |
| global.staff.staff.text.3 | global / shared | staff / Staff / staff / text 3 | text | protected | "Designation *" | 761 |
| global.staff.staff.placeholder.2 | global / shared | staff / Staff / staff / placeholder 2 | text | protected | "Head Teacher" | 768 |
| global.staff.staff.text.4 | global / shared | staff / Staff / staff / text 4 | text | protected | "Category *" | 775 |
| global.staff.staff.text.5 | global / shared | staff / Staff / staff / text 5 | text | protected | "Subject (Optional)" | 788 |
| global.staff.staff.text.6 | global / shared | staff / Staff / staff / text 6 | text | protected | "No Subject" | 794 |
| global.staff.staff.text.7 | global / shared | staff / Staff / staff / text 7 | text | protected | "Qualification *" | 804 |
| global.staff.staff.placeholder.3 | global / shared | staff / Staff / staff / placeholder 3 | text | protected | "B.Sc., M.Ed." | 811 |
| global.staff.staff.text.8 | global / shared | staff / Staff / staff / text 8 | text | protected | "Experience" | 815 |
| global.staff.staff.placeholder.4 | global / shared | staff / Staff / staff / placeholder 4 | text | protected | "10 years" | 821 |
| global.staff.staff.text.9 | global / shared | staff / Staff / staff / text 9 | text | protected | "Bio (Optional)" | 827 |
| global.staff.staff.placeholder.5 | global / shared | staff / Staff / staff / placeholder 5 | text | protected | "Short bio about the staff member" | 833 |
| global.staff.staff.text.10 | global / shared | staff / Staff / staff / text 10 | text | protected | "Email" | 839 |
| global.staff.staff.placeholder.6 | global / shared | staff / Staff / staff / placeholder 6 | text | protected | "email@example.com" | 845 |
| global.staff.staff.text.11 | global / shared | staff / Staff / staff / text 11 | text | protected | "Phone" | 849 |
| global.staff.staff.placeholder.7 | global / shared | staff / Staff / staff / placeholder 7 | text | protected | "+91-XXXXX-XXXXX" | 855 |
| global.staff.staff.text.12 | global / shared | staff / Staff / staff / text 12 | text | protected | "Display Order" | 861 |
| global.staff.staff.placeholder.8 | global / shared | staff / Staff / staff / placeholder 8 | text | protected | "0" | 867 |
| global.staff.staff.text.13 | global / shared | staff / Staff / staff / text 13 | text | protected | "Profile Image (360x360)" | 872 |
| global.staff.staff.paragraph.4 | global / shared | staff / Staff / staff / paragraph 4 | text | protected | "Leave empty to keep existing image" | 880 |
| global.staff.staff.paragraph.5 | global / shared | staff / Staff / staff / paragraph 5 | text | protected | "Recommended: 360x360 pixels, will be resized automatically" | 882 |
| global.staff.staff.text.14 | global / shared | staff / Staff / staff / text 14 | text | protected | "Active" | 892 |
| global.staff.staff.button-label.4 | global / shared | staff / Staff / staff / button-label 4 | text | protected | "Saving..." | 901 |
| global.staff.staff.button-label.5 | global / shared | staff / Staff / staff / button-label 5 | text | protected | "Update Staff" | 901 |
| global.staff.staff.button-label.6 | global / shared | staff / Staff / staff / button-label 6 | text | protected | "Add Staff" | 901 |
| global.staff.staff.button-label.7 | global / shared | staff / Staff / staff / button-label 7 | text | protected | "Cancel" | 907 |

### src/components/admin/Syllabus.jsx

Audience: admin-or-system.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| global.syllabus.stream-options.item1.value | global / shared | stream-options / Syllabus / stream-options.item1 / value | text | protected | "arts" | 18 |
| global.syllabus.stream-options.item1.label | global / shared | stream-options / Syllabus / stream-options.item1 / label | text | protected | "Arts" | 18 |
| global.syllabus.stream-options.item2.value | global / shared | stream-options / Syllabus / stream-options.item2 / value | text | protected | "science" | 19 |
| global.syllabus.stream-options.item2.label | global / shared | stream-options / Syllabus / stream-options.item2 / label | text | protected | "Science" | 19 |
| global.syllabus.stream-options.item3.value | global / shared | stream-options / Syllabus / stream-options.item3 / value | text | protected | "commerce" | 20 |
| global.syllabus.stream-options.item3.label | global / shared | stream-options / Syllabus / stream-options.item3 / label | text | protected | "Commerce" | 20 |
| global.syllabus.fetch-syllabus.text | global / shared | fetch-syllabus / Syllabus / fetch-syllabus / text | text | protected | "Failed to fetch syllabus" | 42 |
| global.syllabus.handle-submit.text | global / shared | handle-submit / Syllabus / handle-submit / text | text | protected | "Syllabus updated successfully" | 70 |
| global.syllabus.handle-submit.text.2 | global / shared | handle-submit / Syllabus / handle-submit / text 2 | text | protected | "Syllabus added successfully" | 73 |
| global.syllabus.handle-submit.text.3 | global / shared | handle-submit / Syllabus / handle-submit / text 3 | text | protected | "Operation failed" | 79 |
| global.syllabus.handle-delete.text | global / shared | handle-delete / Syllabus / handle-delete / text | text | protected | "Syllabus deleted successfully" | 90 |
| global.syllabus.handle-delete.text.2 | global / shared | handle-delete / Syllabus / handle-delete / text 2 | text | protected | "Failed to delete syllabus" | 93 |
| global.syllabus.syllabus.heading | global / shared | syllabus / Syllabus / syllabus / heading | text | protected | "Syllabus" | 144 |
| global.syllabus.syllabus.paragraph | global / shared | syllabus / Syllabus / syllabus / paragraph | text | protected | "Manage class-wise syllabus PDFs" | 145 |
| global.syllabus.syllabus.button-label | global / shared | syllabus / Syllabus / syllabus / button-label | text | protected | "Add Syllabus" | 151 |
| global.syllabus.syllabus.paragraph.2 | global / shared | syllabus / Syllabus / syllabus / paragraph 2 | text | protected | "No syllabus entries" | 166 |
| global.syllabus.syllabus.button-label.2 | global / shared | syllabus / Syllabus / syllabus / button-label 2 | text | protected | "Add your first syllabus entry" | 170 |
| global.syllabus.syllabus.text | global / shared | syllabus / Syllabus / syllabus / text | text | protected | "Class " | 181 |
| global.syllabus.syllabus.text.2 | global / shared | syllabus / Syllabus / syllabus / text 2 | text | protected | "View PDF" | 199 |
| global.syllabus.syllabus.text.3 | global / shared | syllabus / Syllabus / syllabus / text 3 | text | protected | "Published" | 205 |
| global.syllabus.syllabus.text.4 | global / shared | syllabus / Syllabus / syllabus / text 4 | text | protected | "Draft" | 205 |
| global.syllabus.syllabus.heading.2 | global / shared | syllabus / Syllabus / syllabus / heading 2 | text | protected | "Edit Syllabus" | 234 |
| global.syllabus.syllabus.heading.3 | global / shared | syllabus / Syllabus / syllabus / heading 3 | text | protected | "Add Syllabus" | 234 |
| global.syllabus.syllabus.text.5 | global / shared | syllabus / Syllabus / syllabus / text 5 | text | protected | "Academic Year *" | 247 |
| global.syllabus.syllabus.placeholder | global / shared | syllabus / Syllabus / syllabus / placeholder | text | protected | "2025-26" | 253 |
| global.syllabus.syllabus.text.6 | global / shared | syllabus / Syllabus / syllabus / text 6 | text | protected | "Class *" | 260 |
| global.syllabus.syllabus.text.7 | global / shared | syllabus / Syllabus / syllabus / text 7 | text | protected | "Class " | 268 |
| global.syllabus.syllabus.text.8 | global / shared | syllabus / Syllabus / syllabus / text 8 | text | protected | "Stream *" | 276 |
| global.syllabus.syllabus.text.9 | global / shared | syllabus / Syllabus / syllabus / text 9 | text | protected | "Select Stream" | 283 |
| global.syllabus.syllabus.paragraph.3 | global / shared | syllabus / Syllabus / syllabus / paragraph 3 | text | protected | "Stream is required for Class 11 and 12" | 288 |
| global.syllabus.syllabus.text.10 | global / shared | syllabus / Syllabus / syllabus / text 10 | text | protected | "Upload PDF *" | 294 |
| global.syllabus.syllabus.paragraph.4 | global / shared | syllabus / Syllabus / syllabus / paragraph 4 | text | protected | "Leave empty to keep existing file" | 303 |
| global.syllabus.syllabus.paragraph.5 | global / shared | syllabus / Syllabus / syllabus / paragraph 5 | text | protected | "Only PDF files are allowed (Max 10MB)" | 305 |
| global.syllabus.syllabus.text.11 | global / shared | syllabus / Syllabus / syllabus / text 11 | text | protected | "Publish immediately" | 316 |
| global.syllabus.syllabus.button-label.3 | global / shared | syllabus / Syllabus / syllabus / button-label 3 | text | protected | "Saving..." | 326 |
| global.syllabus.syllabus.button-label.4 | global / shared | syllabus / Syllabus / syllabus / button-label 4 | text | protected | "Update Syllabus" | 326 |
| global.syllabus.syllabus.button-label.5 | global / shared | syllabus / Syllabus / syllabus / button-label 5 | text | protected | "Add Syllabus" | 326 |
| global.syllabus.syllabus.button-label.6 | global / shared | syllabus / Syllabus / syllabus / button-label 6 | text | protected | "Cancel" | 332 |

### src/components/common/Breadcrumb.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| global.breadcrumb.breadcrumb.href | global / shared | breadcrumb / Breadcrumb / breadcrumb / href | url | protected | "/" | 10 |
| global.breadcrumb.breadcrumb.text | global / shared | breadcrumb / Breadcrumb / breadcrumb / text | text | editable | "Home" | 10 |

### src/components/common/ContactForm.jsx

Audience: dormant-source.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| global.contact-form.contact-form.text | global / shared | contact-form / ContactForm / contact-form / text | text | protected | "Full Name *" | 45 |
| global.contact-form.contact-form.placeholder | global / shared | contact-form / ContactForm / contact-form / placeholder | text | protected | "Your full name" | 53 |
| global.contact-form.contact-form.text.2 | global / shared | contact-form / ContactForm / contact-form / text 2 | text | protected | "Email Address *" | 57 |
| global.contact-form.contact-form.placeholder.2 | global / shared | contact-form / ContactForm / contact-form / placeholder 2 | text | protected | "you@example.com" | 65 |
| global.contact-form.contact-form.text.3 | global / shared | contact-form / ContactForm / contact-form / text 3 | text | protected | "Phone Number" | 71 |
| global.contact-form.contact-form.placeholder.3 | global / shared | contact-form / ContactForm / contact-form / placeholder 3 | text | protected | "+91-XXXXX-XXXXX" | 78 |
| global.contact-form.contact-form.text.4 | global / shared | contact-form / ContactForm / contact-form / text 4 | text | protected | "Subject" | 82 |
| global.contact-form.contact-form.placeholder.4 | global / shared | contact-form / ContactForm / contact-form / placeholder 4 | text | protected | "Subject of inquiry" | 89 |
| global.contact-form.contact-form.text.5 | global / shared | contact-form / ContactForm / contact-form / text 5 | text | protected | "Message *" | 94 |
| global.contact-form.contact-form.placeholder.5 | global / shared | contact-form / ContactForm / contact-form / placeholder 5 | text | protected | "Your message here..." | 102 |
| global.contact-form.contact-form.button-label | global / shared | contact-form / ContactForm / contact-form / button-label | text | protected | "Sending..." | 110 |
| global.contact-form.contact-form.button-label.2 | global / shared | contact-form / ContactForm / contact-form / button-label 2 | text | protected | "Send Message" | 110 |
| global.contact-form.contact-form.text.6 | global / shared | contact-form / ContactForm / contact-form / text 6 | text | protected | "Thank you for your message! We'll get back to you soon." | 114 |

### src/components/common/Lightbox.jsx

Audience: dormant-source.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| global.lightbox.lightbox.paragraph | global / shared | lightbox / Lightbox / lightbox / paragraph | text | protected | " (" | 58 |
| global.lightbox.lightbox.paragraph.2 | global / shared | lightbox / Lightbox / lightbox / paragraph 2 | text | protected | "/" | 58 |
| global.lightbox.lightbox.paragraph.3 | global / shared | lightbox / Lightbox / lightbox / paragraph 3 | text | protected | ")" | 58 |

### src/components/common/StaffCard.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| global.staff-card.staff-card.src | global / shared | staff-card / StaffCard / staff-card / src | image | protected | "https://ui-avatars.com/api/?name=" | 61 |
| global.staff-card.staff-card.src.2 | global / shared | staff-card / StaffCard / staff-card / src 2 | image | protected | "&background=7A0C1E&color=fff&size=120" | 61 |
| global.staff-card.staff-card.paragraph | global / shared | staff-card / StaffCard / staff-card / paragraph | text | editable | "Experience: " | 72 |

### src/components/home/CircularsPanel.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| home.circulars-panel.notice-print.text1 | page / / | notice-print / Printable notice / text 1 | text | editable | "St. Mary's Higher Secondary School" | 35 |
| home.circulars-panel.notice-print.text2 | page / / | notice-print / Printable notice / text 2 | text | editable | "M.C.Road, Chenikuthi, Guwahati - 781003" | 36 |
| home.circulars-panel.notice-print.text3 | page / / | notice-print / Printable notice / text 3 | text | editable | "NOTICE" | 37 |
| home.circulars-panel.notice-print.text4 | page / / | notice-print / Printable notice / text 4 | text | editable | "Date: " | 41 |
| home.circulars-panel.notice-print.text5 | page / / | notice-print / Printable notice / text 5 | text | editable | " \| Time: " | 41 |
| home.circulars-panel.notice-print.text6 | page / / | notice-print / Printable notice / text 6 | text | editable | "This is a system-generated notice from St. Mary's Higher Secondary School" | 47 |
| home.circulars-panel.notice-print.text7 | page / / | notice-print / Printable notice / text 7 | text | editable | "Generated on: " | 48 |
| home.circulars-panel.circulars-panel.heading | page / / | circulars-panel / CircularsPanel / circulars-panel / heading | text | editable | "Latest Notices" | 105 |
| home.circulars-panel.circulars-panel.heading.2 | page / / | circulars-panel / CircularsPanel / circulars-panel / heading 2 | text | editable | "Latest Notices" | 126 |
| home.circulars-panel.circulars-panel.text | page / / | circulars-panel / CircularsPanel / circulars-panel / text | text | editable | " New" | 128 |
| home.circulars-panel.circulars-panel.paragraph | page / / | circulars-panel / CircularsPanel / circulars-panel / paragraph | text | editable | "No notices available" | 137 |
| home.circulars-panel.circulars-panel.text.2 | page / / | circulars-panel / CircularsPanel / circulars-panel / text 2 | text | editable | "10:00 AM" | 166 |
| home.circulars-panel.circulars-panel.href | page / / | circulars-panel / CircularsPanel / circulars-panel / href | url | protected | "#" | 182 |
| home.circulars-panel.circulars-panel.text.3 | page / / | circulars-panel / CircularsPanel / circulars-panel / text 3 | text | editable | "View All Notices" | 185 |
| home.circulars-panel.circulars-panel.text.4 | page / / | circulars-panel / CircularsPanel / circulars-panel / text 4 | text | editable | "10:00 AM" | 218 |
| home.circulars-panel.circulars-panel.text.5 | page / / | circulars-panel / CircularsPanel / circulars-panel / text 5 | text | editable | "Published" | 241 |
| home.circulars-panel.circulars-panel.text.6 | page / / | circulars-panel / CircularsPanel / circulars-panel / text 6 | text | editable | "Posted: " | 244 |
| home.circulars-panel.circulars-panel.text.7 | page / / | circulars-panel / CircularsPanel / circulars-panel / text 7 | text | editable | "Download PDF" | 256 |
| home.circulars-panel.circulars-panel.button-label | page / / | circulars-panel / CircularsPanel / circulars-panel / button-label | text | editable | "Download Notice" | 269 |
| home.circulars-panel.circulars-panel.button-label.2 | page / / | circulars-panel / CircularsPanel / circulars-panel / button-label 2 | text | editable | "Close" | 275 |

### src/components/home/FeatureCard.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| home.feature-card.features.item1.title | page / / | features / FeatureCard / features.item1 / title | text | editable | "Academic Excellence" | 16 |
| home.feature-card.features.item1.description | page / / | features / FeatureCard / features.item1 / description | text | editable | "Our curriculum is designed to foster critical thinking, creativity, and a love for learning in every student." | 17 |
| home.feature-card.features.item1.image | page / / | features / FeatureCard / features.item1 / image | image | protected | "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80" | 18 |
| home.feature-card.features.item1.stats | page / / | features / FeatureCard / features.item1 / stats | text | editable | "98% Pass Rate" | 21 |
| home.feature-card.features.item1.tag | page / / | features / FeatureCard / features.item1 / tag | text | editable | "Top Rated" | 22 |
| home.feature-card.features.item2.title | page / / | features / FeatureCard / features.item2 / title | text | editable | "Modern Infrastructure" | 26 |
| home.feature-card.features.item2.description | page / / | features / FeatureCard / features.item2 / description | text | editable | "State-of-the-art classrooms, laboratories, library, and sports facilities for holistic development." | 27 |
| home.feature-card.features.item2.image | page / / | features / FeatureCard / features.item2 / image | image | protected | "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80" | 28 |
| home.feature-card.features.item2.stats | page / / | features / FeatureCard / features.item2 / stats | text | editable | "25+ Facilities" | 31 |
| home.feature-card.features.item2.tag | page / / | features / FeatureCard / features.item2 / tag | text | editable | "Smart Campus" | 32 |
| home.feature-card.features.item3.title | page / / | features / FeatureCard / features.item3 / title | text | editable | "Science & Innovation" | 36 |
| home.feature-card.features.item3.description | page / / | features / FeatureCard / features.item3 / description | text | editable | "Well-equipped science labs and innovation centers to nurture young scientists and inventors." | 37 |
| home.feature-card.features.item3.image | page / / | features / FeatureCard / features.item3 / image | image | protected | "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80" | 38 |
| home.feature-card.features.item3.stats | page / / | features / FeatureCard / features.item3 / stats | text | editable | "12+ Labs" | 41 |
| home.feature-card.features.item3.tag | page / / | features / FeatureCard / features.item3 / tag | text | editable | "Innovation Hub" | 42 |
| home.feature-card.features.item4.title | page / / | features / FeatureCard / features.item4 / title | text | editable | "Computer Education" | 46 |
| home.feature-card.features.item4.description | page / / | features / FeatureCard / features.item4 / description | text | editable | "Comprehensive computer science education from basic programming to advanced AI concepts." | 47 |
| home.feature-card.features.item4.image | page / / | features / FeatureCard / features.item4 / image | image | protected | "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80" | 48 |
| home.feature-card.features.item4.stats | page / / | features / FeatureCard / features.item4 / stats | text | editable | "AI & ML Ready" | 51 |
| home.feature-card.features.item4.tag | page / / | features / FeatureCard / features.item4 / tag | text | editable | "Future Ready" | 52 |
| home.feature-card.features.item5.title | page / / | features / FeatureCard / features.item5 / title | text | editable | "Community & Values" | 56 |
| home.feature-card.features.item5.description | page / / | features / FeatureCard / features.item5 / description | text | editable | "A nurturing environment that promotes values, discipline, and social responsibility." | 57 |
| home.feature-card.features.item5.image | page / / | features / FeatureCard / features.item5 / image | image | protected | "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80" | 58 |
| home.feature-card.features.item5.stats | page / / | features / FeatureCard / features.item5 / stats | text | editable | "2,500+ Students" | 61 |
| home.feature-card.features.item5.tag | page / / | features / FeatureCard / features.item5 / tag | text | editable | "Family First" | 62 |
| home.feature-card.features.item6.title | page / / | features / FeatureCard / features.item6 / title | text | editable | "Extracurricular Activities" | 66 |
| home.feature-card.features.item6.description | page / / | features / FeatureCard / features.item6 / description | text | editable | "Wide range of activities including sports, arts, clubs, and cultural events for overall growth." | 67 |
| home.feature-card.features.item6.image | page / / | features / FeatureCard / features.item6 / image | image | protected | "https://images.unsplash.com/photo-1461896836934-bd09ba8b1782?w=800&q=80" | 68 |
| home.feature-card.features.item6.stats | page / / | features / FeatureCard / features.item6 / stats | text | editable | "50+ Activities" | 71 |
| home.feature-card.features.item6.tag | page / / | features / FeatureCard / features.item6 / tag | text | editable | "All Rounder" | 72 |
| home.feature-card.feature-card.text | page / / | feature-card / FeatureCard / feature-card / text | text | editable | "Featured" | 152 |
| home.feature-card.feature-card.text.2 | page / / | feature-card / FeatureCard / feature-card / text 2 | text | editable | "Learn More" | 203 |

### src/components/home/HeroCarousel.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| home.hero-carousel.slides.item1.title | page / / | slides / HeroCarousel / slides.item1 / title | text | editable | "St. Mary's" | 15 |
| home.hero-carousel.slides.item1.subtitle | page / / | slides / HeroCarousel / slides.item1 / subtitle | text | editable | "Higher Secondary School, Guwahati" | 16 |
| home.hero-carousel.slides.item1.description | page / / | slides / HeroCarousel / slides.item1 / description | text | editable | "\"If you are seeking a secondary school, St. Mary's School is the place to be.\"" | 17 |
| home.hero-carousel.slides.item1.badge | page / / | slides / HeroCarousel / slides.item1 / badge | text | editable | "SINCE 1924" | 18 |
| home.hero-carousel.slides.item2.title | page / / | slides / HeroCarousel / slides.item2 / title | text | editable | "Every Age, Every Ambition" | 21 |
| home.hero-carousel.slides.item2.subtitle | page / / | slides / HeroCarousel / slides.item2 / subtitle | text | editable | "KG to Class XII" | 22 |
| home.hero-carousel.slides.item2.description | page / / | slides / HeroCarousel / slides.item2 / description | text | editable | "\"From a child's first alphabet to a young adult's final examination — one campus, one continuous journey.\"" | 23 |
| home.hero-carousel.slides.item2.badge | page / / | slides / HeroCarousel / slides.item2 / badge | text | editable | "100+ YEARS LEGACY" | 24 |
| home.hero-carousel.slides.item3.title | page / / | slides / HeroCarousel / slides.item3 / title | text | editable | "Beyond the Classroom" | 27 |
| home.hero-carousel.slides.item3.subtitle | page / / | slides / HeroCarousel / slides.item3 / subtitle | text | editable | "Mind, Body & Character" | 28 |
| home.hero-carousel.slides.item3.description | page / / | slides / HeroCarousel / slides.item3 / description | text | editable | "\"Education here is not a subject to be studied, but a life to be lived — fully, kindly, and with purpose.\"" | 29 |
| home.hero-carousel.slides.item3.badge | page / / | slides / HeroCarousel / slides.item3 / badge | text | editable | "EST. 1924" | 30 |
| home.hero-carousel.hero-carousel.style | page / / | hero-carousel / HeroCarousel / hero-carousel / style | image | protected | "url('/walpaper.png')" | 72 |
| home.hero-carousel.hero-carousel.href | page / / | hero-carousel / HeroCarousel / hero-carousel / href | url | protected | "/admissions" | 176 |
| home.hero-carousel.hero-carousel.text | page / / | hero-carousel / HeroCarousel / hero-carousel / text | text | editable | "Start Journey" | 179 |
| home.hero-carousel.hero-carousel.href.2 | page / / | hero-carousel / HeroCarousel / hero-carousel / href 2 | url | protected | "/about/founders" | 186 |
| home.hero-carousel.hero-carousel.text.2 | page / / | hero-carousel / HeroCarousel / hero-carousel / text 2 | text | editable | "Our Legacy" | 189 |
| home.hero-carousel.hero-carousel.text.3 | page / / | hero-carousel / HeroCarousel / hero-carousel / text 3 | text | editable | "100+" | 209 |
| home.hero-carousel.hero-carousel.text.4 | page / / | hero-carousel / HeroCarousel / hero-carousel / text 4 | text | editable | "Years Legacy" | 210 |
| home.hero-carousel.hero-carousel.text.5 | page / / | hero-carousel / HeroCarousel / hero-carousel / text 5 | text | editable | "KG-XII" | 218 |
| home.hero-carousel.hero-carousel.text.6 | page / / | hero-carousel / HeroCarousel / hero-carousel / text 6 | text | editable | "Classes" | 219 |
| home.hero-carousel.hero-carousel.text.7 | page / / | hero-carousel / HeroCarousel / hero-carousel / text 7 | text | editable | "2000+" | 227 |
| home.hero-carousel.hero-carousel.text.8 | page / / | hero-carousel / HeroCarousel / hero-carousel / text 8 | text | editable | "Students" | 228 |

### src/components/home/PrincipalMessage.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| home.principal-message.principal-message.heading | page / / | section-1 / PrincipalMessage / principal-message / heading | text | editable | "A Word From Our " | 32 |
| home.principal-message.principal-message.text | page / / | section-1 / PrincipalMessage / principal-message / text | text | editable | "Principal" | 33 |
| home.principal-message.principal-message.src | page / / | section-1 / PrincipalMessage / principal-message / src | image | protected | "/principal.png" | 50 |
| home.principal-message.principal-message.alt | page / / | section-1 / PrincipalMessage / principal-message / alt | text | editable | "Principal Sr. Jessy Nedumala" | 51 |
| home.principal-message.principal-message.text.2 | page / / | section-1 / PrincipalMessage / principal-message / text 2 | text | editable | "100 Years" | 68 |
| home.principal-message.principal-message.paragraph | page / / | section-1 / PrincipalMessage / principal-message / paragraph | text | editable | "Sr. Jessy Nedumala" | 76 |
| home.principal-message.principal-message.paragraph.2 | page / / | section-1 / PrincipalMessage / principal-message / paragraph 2 | text | editable | "Principal" | 79 |
| home.principal-message.principal-message.text.3 | page / / | section-1 / PrincipalMessage / principal-message / text 3 | text | editable | "Dear Parents and Students," | 89 |
| home.principal-message.principal-message.paragraph.3 | page / / | section-1 / PrincipalMessage / principal-message / paragraph 3 | text | editable | "The legacy and excellence of " | 96 |
| home.principal-message.principal-message.text.4 | page / / | section-1 / PrincipalMessage / principal-message / text 4 | text | editable | "St. Mary's Higher Secondary School, Guwahati" | 97 |
| home.principal-message.principal-message.paragraph.4 | page / / | section-1 / PrincipalMessage / principal-message / paragraph 4 | text | editable | " has carved a niche for itself through " | 97 |
| home.principal-message.principal-message.text.5 | page / / | section-1 / PrincipalMessage / principal-message / text 5 | text | editable | "100 glorious years" | 97 |
| home.principal-message.principal-message.paragraph.5 | page / / | section-1 / PrincipalMessage / principal-message / paragraph 5 | text | editable | ". The essence of the institution lies in its focus on virtue, knowledge, and discipline — each day striving to produce women of quality and stature." | 97 |
| home.principal-message.principal-message.paragraph.6 | page / / | section-1 / PrincipalMessage / principal-message / paragraph 6 | text | editable | "We believe that schools are centres that harness power — the power to mould, to direct, to change. The pivot of the institution is the relationship between teachers, students, parents, and management, all essential in creating an environment for the holistic development of a child." | 100 |
| home.principal-message.principal-message.paragraph.7 | page / / | section-1 / PrincipalMessage / principal-message / paragraph 7 | text | editable | "\"We aim to create a safe, nurturing yet challenging space — preparing each student to be academically excellent, spiritually enlightened, emotionally balanced, socially committed, and eco-conscious.\"" | 106 |
| home.principal-message.principal-message.paragraph.8 | page / / | section-1 / PrincipalMessage / principal-message / paragraph 8 | text | editable | "As an inclusive institution, we understand, acknowledge, and respect every student's unique individuality. Our teachers ensure every student leaves with respect, cooperation, kindness, empathy, and tolerance — a positive attitude to navigate the world with confidence." | 111 |
| home.principal-message.principal-message.paragraph.9 | page / / | section-1 / PrincipalMessage / principal-message / paragraph 9 | text | editable | "As you explore our website, you'll see our commitment to academic excellence and to giving every student the opportunities they deserve. Our teachers and management work together to nurture competent, upright, and empowered young women." | 115 |
| home.principal-message.principal-message.paragraph.10 | page / / | section-1 / PrincipalMessage / principal-message / paragraph 10 | text | editable | "Sr. Jessy Nedumala" | 124 |
| home.principal-message.principal-message.paragraph.11 | page / / | section-1 / PrincipalMessage / principal-message / paragraph 11 | text | editable | "Principal" | 125 |
| home.principal-message.principal-message.text.6 | page / / | section-1 / PrincipalMessage / principal-message / text 6 | text | editable | "God Bless us all." | 133 |
| home.principal-message.principal-message.text.7 | page / / | section-1 / PrincipalMessage / principal-message / text 7 | text | editable | "Est. 1924" | 137 |

### src/components/home/StatsCounter.jsx

Audience: dormant-source.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| home.stats-counter.stats.item1.value | page / / | stats / StatsCounter / stats.item1 / value | number | protected | 50 | 34 |
| home.stats-counter.stats.item1.label | page / / | stats / StatsCounter / stats.item1 / label | text | protected | "Years of Legacy" | 34 |
| home.stats-counter.stats.item1.suffix | page / / | stats / StatsCounter / stats.item1 / suffix | text | protected | "+" | 34 |
| home.stats-counter.stats.item2.value | page / / | stats / StatsCounter / stats.item2 / value | number | protected | 2500 | 35 |
| home.stats-counter.stats.item2.label | page / / | stats / StatsCounter / stats.item2 / label | text | protected | "Students" | 35 |
| home.stats-counter.stats.item2.suffix | page / / | stats / StatsCounter / stats.item2 / suffix | text | protected | "+" | 35 |
| home.stats-counter.stats.item3.value | page / / | stats / StatsCounter / stats.item3 / value | number | protected | 85 | 36 |
| home.stats-counter.stats.item3.label | page / / | stats / StatsCounter / stats.item3 / label | text | protected | "Teaching Staff" | 36 |
| home.stats-counter.stats.item3.suffix | page / / | stats / StatsCounter / stats.item3 / suffix | text | protected | "+" | 36 |
| home.stats-counter.stats.item4.value | page / / | stats / StatsCounter / stats.item4 / value | number | protected | 100 | 37 |
| home.stats-counter.stats.item4.label | page / / | stats / StatsCounter / stats.item4 / label | text | protected | "Awards Won" | 37 |
| home.stats-counter.stats.item4.suffix | page / / | stats / StatsCounter / stats.item4 / suffix | text | protected | "+" | 37 |

### src/components/home/WelcomeSection.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| home.welcome-section.welcome-section.text | page / / | welcome-section / WelcomeSection / welcome-section / text | text | editable | "Welcome to St. Mary's" | 58 |
| home.welcome-section.welcome-section.text.2 | page / / | welcome-section / WelcomeSection / welcome-section / text 2 | text | editable | "Since 1924" | 63 |
| home.welcome-section.welcome-section.text.3 | page / / | welcome-section / WelcomeSection / welcome-section / text 3 | text | editable | "Your Journey Begins Here" | 75 |
| home.welcome-section.welcome-section.text.4 | page / / | welcome-section / WelcomeSection / welcome-section / text 4 | text | editable | "Start Your" | 80 |
| home.welcome-section.welcome-section.text.5 | page / / | welcome-section / WelcomeSection / welcome-section / text 5 | text | editable | "Golden Journey" | 82 |
| home.welcome-section.welcome-section.paragraph | page / / | welcome-section / WelcomeSection / welcome-section / paragraph | text | editable | "Where every student discovers their potential, builds character, and achieves excellence. Join us for a transformative educational journey." | 92 |
| home.welcome-section.welcome-section.item1.label | page / / | welcome-section / WelcomeSection / welcome-section.item1 / label | text | editable | "100+ Years Legacy" | 100 |
| home.welcome-section.welcome-section.item2.label | page / / | welcome-section / WelcomeSection / welcome-section.item2 / label | text | editable | "Class KG-12" | 101 |
| home.welcome-section.welcome-section.item3.label | page / / | welcome-section / WelcomeSection / welcome-section.item3 / label | text | editable | "2026-27 Session" | 102 |
| home.welcome-section.welcome-section.href | page / / | welcome-section / WelcomeSection / welcome-section / href | url | protected | "/admissions" | 116 |
| home.welcome-section.welcome-section.text.6 | page / / | welcome-section / WelcomeSection / welcome-section / text 6 | text | editable | "Begin Your Journey" | 119 |
| home.welcome-section.welcome-section.href.2 | page / / | welcome-section / WelcomeSection / welcome-section / href 2 | url | protected | "/about/founders" | 125 |
| home.welcome-section.welcome-section.text.7 | page / / | welcome-section / WelcomeSection / welcome-section / text 7 | text | editable | "Discover Our Heritage" | 128 |
| home.welcome-section.welcome-section.href.3 | page / / | welcome-section / WelcomeSection / welcome-section / href 3 | url | protected | "/academics/syllabus" | 148 |
| home.welcome-section.welcome-section.text.8 | page / / | welcome-section / WelcomeSection / welcome-section / text 8 | text | editable | "Download Syllabus" | 151 |
| home.welcome-section.welcome-section.href.4 | page / / | welcome-section / WelcomeSection / welcome-section / href 4 | url | protected | "/gallery" | 156 |
| home.welcome-section.welcome-section.text.9 | page / / | welcome-section / WelcomeSection / welcome-section / text 9 | text | editable | "Explore Gallery" | 159 |

### src/components/layout/AdminLayout.jsx

Audience: admin-or-system.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| global.admin-layout.menu-items.item1.path | global / shared | menu-items / AdminLayout / menu-items.item1 / path | url | protected | "/admin/dashboard" | 20 |
| global.admin-layout.menu-items.item1.label | global / shared | menu-items / AdminLayout / menu-items.item1 / label | text | protected | "Dashboard" | 20 |
| global.admin-layout.menu-items.item2.path | global / shared | menu-items / AdminLayout / menu-items.item2 / path | url | protected | "/admin/circulars" | 21 |
| global.admin-layout.menu-items.item2.label | global / shared | menu-items / AdminLayout / menu-items.item2 / label | text | protected | "Circulars" | 21 |
| global.admin-layout.menu-items.item3.path | global / shared | menu-items / AdminLayout / menu-items.item3 / path | url | protected | "/admin/staff" | 22 |
| global.admin-layout.menu-items.item3.label | global / shared | menu-items / AdminLayout / menu-items.item3 / label | text | protected | "Staff" | 22 |
| global.admin-layout.menu-items.item4.path | global / shared | menu-items / AdminLayout / menu-items.item4 / path | url | protected | "/admin/gallery" | 23 |
| global.admin-layout.menu-items.item4.label | global / shared | menu-items / AdminLayout / menu-items.item4 / label | text | protected | "Gallery" | 23 |
| global.admin-layout.menu-items.item5.path | global / shared | menu-items / AdminLayout / menu-items.item5 / path | url | protected | "/admin/syllabus" | 24 |
| global.admin-layout.menu-items.item5.label | global / shared | menu-items / AdminLayout / menu-items.item5 / label | text | protected | "Syllabus" | 24 |
| global.admin-layout.menu-items.item6.path | global / shared | menu-items / AdminLayout / menu-items.item6 / path | url | protected | "/admin/disclosure" | 25 |
| global.admin-layout.menu-items.item6.label | global / shared | menu-items / AdminLayout / menu-items.item6 / label | text | protected | "Disclosure" | 25 |
| global.admin-layout.admin-layout.text | global / shared | admin-layout / AdminLayout / admin-layout / text | text | protected | "St. Mary's Admin" | 53 |
| global.admin-layout.admin-layout.text.2 | global / shared | admin-layout / AdminLayout / admin-layout / text 2 | text | protected | "Logout" | 88 |
| global.admin-layout.admin-layout.heading | global / shared | admin-layout / AdminLayout / admin-layout / heading | text | protected | "Dashboard" | 104 |
| global.admin-layout.admin-layout.text.3 | global / shared | admin-layout / AdminLayout / admin-layout / text 3 | number | protected | 0 | 109 |

### src/components/layout/Footer.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| global.footer.footer.heading | global / shared | footer / Footer / footer / heading | text | editable | "St. Mary's" | 52 |
| global.footer.footer.paragraph | global / shared | footer / Footer / footer / paragraph | text | editable | "Higher Secondary School" | 53 |
| global.footer.footer.paragraph.2 | global / shared | footer / Footer / footer / paragraph 2 | text | editable | "St. Mary's Higher Secondary School, Guwahati, is committed to providing quality education and fostering holistic development of students since 1924." | 56 |
| global.footer.footer.item1.label | global / shared | footer / Footer / footer.item1 / label | text | editable | "Website" | 61 |
| global.footer.footer.item2.label | global / shared | footer / Footer / footer.item2 / label | text | editable | "WhatsApp" | 62 |
| global.footer.footer.item3.label | global / shared | footer / Footer / footer.item3 / label | text | editable | "Telegram" | 63 |
| global.footer.footer.item4.label | global / shared | footer / Footer / footer.item4 / label | text | editable | "YouTube" | 64 |
| global.footer.footer.href | global / shared | footer / Footer / footer / href | url | protected | "#" | 68 |
| global.footer.footer.href.2 | global / shared | footer / Footer / footer / href 2 | url | protected | "/login" | 81 |
| global.footer.footer.text | global / shared | footer / Footer / footer / text | text | editable | "Admin Login" | 84 |
| global.footer.footer.heading.2 | global / shared | footer / Footer / footer / heading 2 | text | editable | "Quick Links" | 92 |
| global.footer.footer.item1.to | global / shared | footer / Footer / footer.item1 / to | url | protected | "/about/founders" | 97 |
| global.footer.footer.item1.label.2 | global / shared | footer / Footer / footer.item1 / label 2 | text | editable | "About Us" | 97 |
| global.footer.footer.item2.to | global / shared | footer / Footer / footer.item2 / to | url | protected | "/admissions" | 98 |
| global.footer.footer.item2.label.2 | global / shared | footer / Footer / footer.item2 / label 2 | text | editable | "Admissions" | 98 |
| global.footer.footer.item3.to | global / shared | footer / Footer / footer.item3 / to | url | protected | "/academics/syllabus" | 99 |
| global.footer.footer.item3.label.2 | global / shared | footer / Footer / footer.item3 / label 2 | text | editable | "Syllabus" | 99 |
| global.footer.footer.item4.to | global / shared | footer / Footer / footer.item4 / to | url | protected | "/gallery" | 100 |
| global.footer.footer.item4.label.2 | global / shared | footer / Footer / footer.item4 / label 2 | text | editable | "Gallery" | 100 |
| global.footer.footer.item5.to | global / shared | footer / Footer / footer.item5 / to | url | protected | "/contact" | 101 |
| global.footer.footer.item5.label | global / shared | footer / Footer / footer.item5 / label | text | editable | "Contact Us" | 101 |
| global.footer.footer.heading.3 | global / shared | footer / Footer / footer / heading 3 | text | editable | "Academics" | 119 |
| global.footer.footer.item1.to.2 | global / shared | footer / Footer / footer.item1 / to 2 | url | protected | "/academics/syllabus" | 124 |
| global.footer.footer.item1.label.3 | global / shared | footer / Footer / footer.item1 / label 3 | text | editable | "Syllabus" | 124 |
| global.footer.footer.item2.to.2 | global / shared | footer / Footer / footer.item2 / to 2 | url | protected | "/academics/evaluation" | 125 |
| global.footer.footer.item2.label.3 | global / shared | footer / Footer / footer.item2 / label 3 | text | editable | "Evaluation System" | 125 |
| global.footer.footer.item3.to.2 | global / shared | footer / Footer / footer.item3 / to 2 | url | protected | "/administration/teaching-staff/primary" | 126 |
| global.footer.footer.item3.label.3 | global / shared | footer / Footer / footer.item3 / label 3 | text | editable | "Primary School" | 126 |
| global.footer.footer.item4.to.2 | global / shared | footer / Footer / footer.item4 / to 2 | url | protected | "/administration/teaching-staff/higher-secondary" | 127 |
| global.footer.footer.item4.label.3 | global / shared | footer / Footer / footer.item4 / label 3 | text | editable | "Higher Secondary" | 127 |
| global.footer.footer.heading.4 | global / shared | footer / Footer / footer / heading 4 | text | editable | "Contact" | 145 |
| global.footer.footer.text.2 | global / shared | footer / Footer / footer / text 2 | text | editable | "Guwahati, Assam - 781001" | 153 |
| global.footer.footer.text.3 | global / shared | footer / Footer / footer / text 3 | text | editable | "+91 9435190537" | 161 |
| global.footer.footer.text.4 | global / shared | footer / Footer / footer / text 4 | text | editable | "stmarysghy1924@yahoo.com" | 169 |
| global.footer.footer.href.3 | global / shared | footer / Footer / footer / href 3 | url | protected | "/contact" | 177 |
| global.footer.footer.text.5 | global / shared | footer / Footer / footer / text 5 | text | editable | "Get in Touch" | 181 |
| global.footer.footer.paragraph.3 | global / shared | footer / Footer / footer / paragraph 3 | text | protected | "© " | 196 |
| global.footer.footer.paragraph.4 | global / shared | footer / Footer / footer / paragraph 4 | text | editable | " St. Mary's Higher Secondary School. All rights reserved." | 197 |
| global.footer.footer.text.6 | global / shared | footer / Footer / footer / text 6 | text | editable | "Privacy Policy" | 200 |
| global.footer.footer.text.7 | global / shared | footer / Footer / footer / text 7 | text | editable | "Terms of Service" | 202 |
| global.footer.footer.text.8 | global / shared | footer / Footer / footer / text 8 | text | editable | "Made with " | 204 |
| global.footer.footer.text.9 | global / shared | footer / Footer / footer / text 9 | text | editable | " in Assam" | 205 |

### src/components/layout/Navbar.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| global.navbar.nav-items.item1.label | global / shared | nav-items / Navbar / nav-items.item1 / label | text | editable | "Home" | 46 |
| global.navbar.nav-items.item1.path | global / shared | nav-items / Navbar / nav-items.item1 / path | url | protected | "/" | 46 |
| global.navbar.nav-items.item2.label | global / shared | nav-items / Navbar / nav-items.item2 / label | text | editable | "About" | 48 |
| global.navbar.nav-items.item2.path | global / shared | nav-items / Navbar / nav-items.item2 / path | url | protected | "/about" | 49 |
| global.navbar.nav-items.item2.item1.label | global / shared | nav-items / Navbar / nav-items.item2.item1 / label | text | editable | "Our Founders" | 51 |
| global.navbar.nav-items.item2.item1.path | global / shared | nav-items / Navbar / nav-items.item2.item1 / path | url | protected | "/about/founders" | 51 |
| global.navbar.nav-items.item2.item2.label | global / shared | nav-items / Navbar / nav-items.item2.item2 / label | text | editable | "Our Journey" | 52 |
| global.navbar.nav-items.item2.item2.path | global / shared | nav-items / Navbar / nav-items.item2.item2 / path | url | protected | "/about/journey" | 52 |
| global.navbar.nav-items.item2.item3.label | global / shared | nav-items / Navbar / nav-items.item2.item3 / label | text | editable | "Superiors" | 53 |
| global.navbar.nav-items.item2.item3.path | global / shared | nav-items / Navbar / nav-items.item2.item3 / path | url | protected | "/about/superiors" | 53 |
| global.navbar.nav-items.item2.item4.label | global / shared | nav-items / Navbar / nav-items.item2.item4 / label | text | editable | "Principal" | 54 |
| global.navbar.nav-items.item2.item4.path | global / shared | nav-items / Navbar / nav-items.item2.item4 / path | url | protected | "/about/principal" | 54 |
| global.navbar.nav-items.item3.label | global / shared | nav-items / Navbar / nav-items.item3 / label | text | editable | "Administration" | 58 |
| global.navbar.nav-items.item3.path | global / shared | nav-items / Navbar / nav-items.item3 / path | url | protected | "/administration" | 59 |
| global.navbar.nav-items.item3.item1.label | global / shared | nav-items / Navbar / nav-items.item3.item1 / label | text | editable | "Management" | 61 |
| global.navbar.nav-items.item3.item1.path | global / shared | nav-items / Navbar / nav-items.item3.item1 / path | url | protected | "/administration/management" | 61 |
| global.navbar.nav-items.item3.item2.label | global / shared | nav-items / Navbar / nav-items.item3.item2 / label | text | editable | "Teaching Staff" | 63 |
| global.navbar.nav-items.item3.item2.path | global / shared | nav-items / Navbar / nav-items.item3.item2 / path | url | protected | "/administration/teaching-staff" | 64 |
| global.navbar.nav-items.item3.item2.item1.label | global / shared | nav-items / Navbar / nav-items.item3.item2.item1 / label | text | editable | "Primary School" | 66 |
| global.navbar.nav-items.item3.item2.item1.path | global / shared | nav-items / Navbar / nav-items.item3.item2.item1 / path | url | protected | "/administration/teaching-staff/primary" | 66 |
| global.navbar.nav-items.item3.item2.item2.label | global / shared | nav-items / Navbar / nav-items.item3.item2.item2 / label | text | editable | "Middle School" | 67 |
| global.navbar.nav-items.item3.item2.item2.path | global / shared | nav-items / Navbar / nav-items.item3.item2.item2 / path | url | protected | "/administration/teaching-staff/middle" | 67 |
| global.navbar.nav-items.item3.item2.item3.label | global / shared | nav-items / Navbar / nav-items.item3.item2.item3 / label | text | editable | "High School" | 68 |
| global.navbar.nav-items.item3.item2.item3.path | global / shared | nav-items / Navbar / nav-items.item3.item2.item3 / path | url | protected | "/administration/teaching-staff/high" | 68 |
| global.navbar.nav-items.item3.item2.item4.label | global / shared | nav-items / Navbar / nav-items.item3.item2.item4 / label | text | editable | "Higher Secondary" | 69 |
| global.navbar.nav-items.item3.item2.item4.path | global / shared | nav-items / Navbar / nav-items.item3.item2.item4 / path | url | protected | "/administration/teaching-staff/higher-secondary" | 69 |
| global.navbar.nav-items.item3.item3.label | global / shared | nav-items / Navbar / nav-items.item3.item3 / label | text | editable | "Non-Teaching Staff" | 72 |
| global.navbar.nav-items.item3.item3.path | global / shared | nav-items / Navbar / nav-items.item3.item3 / path | url | protected | "/administration/non-teaching" | 72 |
| global.navbar.nav-items.item4.label | global / shared | nav-items / Navbar / nav-items.item4 / label | text | editable | "Infrastructure" | 75 |
| global.navbar.nav-items.item4.path | global / shared | nav-items / Navbar / nav-items.item4 / path | url | protected | "/infrastructure" | 75 |
| global.navbar.nav-items.item5.label | global / shared | nav-items / Navbar / nav-items.item5 / label | text | editable | "Admissions" | 77 |
| global.navbar.nav-items.item5.path | global / shared | nav-items / Navbar / nav-items.item5 / path | url | protected | "/admissions" | 78 |
| global.navbar.nav-items.item5.item1.label | global / shared | nav-items / Navbar / nav-items.item5.item1 / label | text | editable | "Admission Process" | 80 |
| global.navbar.nav-items.item5.item1.path | global / shared | nav-items / Navbar / nav-items.item5.item1 / path | url | protected | "/admissions" | 80 |
| global.navbar.nav-items.item5.item2.label | global / shared | nav-items / Navbar / nav-items.item5.item2 / label | text | editable | "Enquiry Form" | 81 |
| global.navbar.nav-items.item5.item2.path | global / shared | nav-items / Navbar / nav-items.item5.item2 / path | url | protected | "/admissions/inquiry" | 81 |
| global.navbar.nav-items.item6.label | global / shared | nav-items / Navbar / nav-items.item6 / label | text | editable | "Academics" | 85 |
| global.navbar.nav-items.item6.path | global / shared | nav-items / Navbar / nav-items.item6 / path | url | protected | "/academics" | 86 |
| global.navbar.nav-items.item6.item1.label | global / shared | nav-items / Navbar / nav-items.item6.item1 / label | text | editable | "Syllabus" | 88 |
| global.navbar.nav-items.item6.item1.path | global / shared | nav-items / Navbar / nav-items.item6.item1 / path | url | protected | "/academics/syllabus" | 88 |
| global.navbar.nav-items.item6.item2.label | global / shared | nav-items / Navbar / nav-items.item6.item2 / label | text | editable | "Evaluation System" | 89 |
| global.navbar.nav-items.item6.item2.path | global / shared | nav-items / Navbar / nav-items.item6.item2 / path | url | protected | "/academics/evaluation" | 89 |
| global.navbar.nav-items.item7.label | global / shared | nav-items / Navbar / nav-items.item7 / label | text | editable | "Student Rules" | 92 |
| global.navbar.nav-items.item7.path | global / shared | nav-items / Navbar / nav-items.item7 / path | url | protected | "/student-rules" | 92 |
| global.navbar.nav-items.item8.label | global / shared | nav-items / Navbar / nav-items.item8 / label | text | editable | "Activities" | 94 |
| global.navbar.nav-items.item8.path | global / shared | nav-items / Navbar / nav-items.item8 / path | url | protected | "/extracurricular" | 95 |
| global.navbar.nav-items.item8.item1.label | global / shared | nav-items / Navbar / nav-items.item8.item1 / label | text | editable | "Clubs & Associations" | 97 |
| global.navbar.nav-items.item8.item1.path | global / shared | nav-items / Navbar / nav-items.item8.item1 / path | url | protected | "/extracurricular/clubs" | 97 |
| global.navbar.nav-items.item8.item2.label | global / shared | nav-items / Navbar / nav-items.item8.item2 / label | text | editable | "Formative Moments" | 98 |
| global.navbar.nav-items.item8.item2.path | global / shared | nav-items / Navbar / nav-items.item8.item2 / path | url | protected | "/extracurricular/moments" | 98 |
| global.navbar.nav-items.item9.label | global / shared | nav-items / Navbar / nav-items.item9 / label | text | editable | "Gallery" | 101 |
| global.navbar.nav-items.item9.path | global / shared | nav-items / Navbar / nav-items.item9 / path | url | protected | "/gallery" | 101 |
| global.navbar.nav-items.item10.label | global / shared | nav-items / Navbar / nav-items.item10 / label | text | editable | "Contact" | 102 |
| global.navbar.nav-items.item10.path | global / shared | nav-items / Navbar / nav-items.item10 / path | url | protected | "/contact" | 102 |
| global.navbar.navbar.href | global / shared | navbar / Navbar / navbar / href | url | protected | "/" | 119 |
| global.navbar.navbar.src | global / shared | navbar / Navbar / navbar / src | image | protected | "/logo.jpeg" | 125 |
| global.navbar.navbar.alt | global / shared | navbar / Navbar / navbar / alt | text | editable | "St. Mary's School Logo" | 126 |
| global.navbar.navbar.heading | global / shared | navbar / Navbar / navbar / heading | text | editable | "St. Mary's" | 135 |
| global.navbar.navbar.paragraph | global / shared | navbar / Navbar / navbar / paragraph | text | editable | "Higher Secondary School" | 143 |
| global.navbar.navbar.text | global / shared | navbar / Navbar / navbar / text | text | editable | "🏫 St. Mary's" | 324 |
| global.navbar.navbar.text.2 | global / shared | navbar / Navbar / navbar / text 2 | text | editable | "📚 Guwahati" | 326 |

### src/components/layout/TopBar.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| global.top-bar.fee-options.item1.label | global / shared | fee-options / TopBar / fee-options.item1 / label | text | editable | "Class KG – VIII" | 12 |
| global.top-bar.fee-options.item1.bank | global / shared | fee-options / TopBar / fee-options.item1 / bank | text | editable | "Federal Bank, Silpukhuri Branch" | 13 |
| global.top-bar.fee-options.item1.url | global / shared | fee-options / TopBar / fee-options.item1 / url | url | protected | "https://epay.federalbank.co.in/easypayments/DIRECTPAYMENT.ASPX?CODE=DABB4QLY4Q1O4" | 14 |
| global.top-bar.fee-options.item2.label | global / shared | fee-options / TopBar / fee-options.item2 / label | text | editable | "Class IX – XII" | 17 |
| global.top-bar.fee-options.item2.bank | global / shared | fee-options / TopBar / fee-options.item2 / bank | text | editable | "South Indian Bank, Ambari Branch" | 18 |
| global.top-bar.fee-options.item2.url | global / shared | fee-options / TopBar / fee-options.item2 / url | url | protected | "https://eacademia.southindianbank.bank.in/feeuser/org?id=3037" | 19 |
| global.top-bar.top-bar.href | global / shared | top-bar / TopBar / top-bar / href | url | protected | "tel:+919435190537" | 40 |
| global.top-bar.top-bar.text | global / shared | top-bar / TopBar / top-bar / text | text | editable | "+91-94351-90537" | 44 |
| global.top-bar.top-bar.href.2 | global / shared | top-bar / TopBar / top-bar / href 2 | url | protected | "mailto:stmarysghy1924@yahoo.com" | 47 |
| global.top-bar.top-bar.text.2 | global / shared | top-bar / TopBar / top-bar / text 2 | text | editable | "stmarysghy1924@yahoo.com" | 51 |
| global.top-bar.top-bar.href.3 | global / shared | top-bar / TopBar / top-bar / href 3 | url | protected | "https://maps.google.com" | 54 |
| global.top-bar.top-bar.text.3 | global / shared | top-bar / TopBar / top-bar / text 3 | text | editable | "Guwahati, Assam" | 60 |
| global.top-bar.top-bar.text.4 | global / shared | top-bar / TopBar / top-bar / text 4 | text | editable | "Pay Fees Online" | 78 |
| global.top-bar.top-bar.text.5 | global / shared | top-bar / TopBar / top-bar / text 5 | text | editable | "Pay Fees" | 79 |
| global.top-bar.top-bar.paragraph | global / shared | top-bar / TopBar / top-bar / paragraph | text | editable | "Select Your Class Group" | 97 |
| global.top-bar.top-bar.text.6 | global / shared | top-bar / TopBar / top-bar / text 6 | text | editable | "Pay Now" | 119 |

### src/site-pages/ContactUs.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| contact.handle-submit.text | page / /contact | handle-submit / ContactUs / handle-submit / text | text | editable | "Thank you for your message! We will get back to you soon." | 33 |
| contact.handle-submit.text.2 | page / /contact | handle-submit / ContactUs / handle-submit / text 2 | text | editable | "Failed to send message. Please try again." | 42 |
| contact.contact-info.item1.title | page / /contact | contact-info / ContactUs / contact-info.item1 / title | text | editable | "Visit Us" | 51 |
| contact.contact-info.item1.details | page / /contact | contact-info / ContactUs / contact-info.item1 / details | text | editable | "St. Mary's Higher Secondary School\nM.C.Road, Chenikuthi\nGuwahati - 781003" | 52 |
| contact.contact-info.item2.title | page / /contact | contact-info / ContactUs / contact-info.item2 / title | text | editable | "Call Us" | 59 |
| contact.contact-info.item2.details | page / /contact | contact-info / ContactUs / contact-info.item2 / details | text | editable | "+91 9435190537" | 60 |
| contact.contact-info.item3.title | page / /contact | contact-info / ContactUs / contact-info.item3 / title | text | editable | "Email Us" | 67 |
| contact.contact-info.item3.details | page / /contact | contact-info / ContactUs / contact-info.item3 / details | text | editable | "stmarysghy1924@yahoo.com" | 68 |
| contact.contact-info.item4.title | page / /contact | contact-info / ContactUs / contact-info.item4 / title | text | editable | "Office Hours" | 75 |
| contact.contact-info.item4.details | page / /contact | contact-info / ContactUs / contact-info.item4 / details | text | editable | "Monday - Saturday\n7:45 AM - 2:00 PM" | 76 |
| contact.social-links.item1.label | page / /contact | social-links / ContactUs / social-links.item1 / label | text | editable | "Website" | 84 |
| contact.social-links.item2.label | page / /contact | social-links / ContactUs / social-links.item2 / label | text | editable | "WhatsApp" | 85 |
| contact.social-links.item3.label | page / /contact | social-links / ContactUs / social-links.item3 / label | text | editable | "Telegram" | 86 |
| contact.social-links.item4.label | page / /contact | social-links / ContactUs / social-links.item4 / label | text | editable | "Support" | 87 |
| contact.contact-us.text | page / /contact | section-1 / ContactUs / contact-us / text | text | editable | "CONTACT" | 130 |
| contact.contact-us.text.2 | page / /contact | section-1 / ContactUs / contact-us / text 2 | text | editable | "Reach Out" | 144 |
| contact.contact-us.heading | page / /contact | section-1 / ContactUs / contact-us / heading | text | editable | "Contact " | 152 |
| contact.contact-us.text.3 | page / /contact | section-1 / ContactUs / contact-us / text 3 | text | editable | "Us" | 153 |
| contact.contact-us.paragraph | page / /contact | section-1 / ContactUs / contact-us / paragraph | text | editable | "Get in touch with us" | 161 |
| contact.contact-us.text.4 | page / /contact | section-2 / ContactUs / contact-us / text 4 | text | editable | "We'd Love to Hear From You" | 183 |
| contact.contact-us.paragraph.2 | page / /contact | section-2 / ContactUs / contact-us / paragraph 2 | text | editable | "Have questions about admissions, academics, or anything else? We'd love to hear from you. Fill out the form and we'll get back to you soon." | 185 |
| contact.contact-us.text.5 | page / /contact | section-3 / ContactUs / contact-us / text 5 | text | editable | "Get in Touch" | 209 |
| contact.contact-us.heading.2 | page / /contact | section-3 / ContactUs / contact-us / heading 2 | text | editable | "Send Us a " | 212 |
| contact.contact-us.text.6 | page / /contact | section-3 / ContactUs / contact-us / text 6 | text | editable | "Message" | 213 |
| contact.contact-us.paragraph.3 | page / /contact | section-3 / ContactUs / contact-us / paragraph 3 | text | editable | "Have questions about admissions, academics, or anything else? We'd love to hear from you. Fill out the form and we'll get back to you soon." | 216 |
| contact.contact-us.text.7 | page / /contact | section-3 / ContactUs / contact-us / text 7 | text | editable | "Full Name " | 224 |
| contact.contact-us.text.8 | page / /contact | section-3 / ContactUs / contact-us / text 8 | text | protected | "*" | 225 |
| contact.contact-us.placeholder | page / /contact | section-3 / ContactUs / contact-us / placeholder | text | editable | "Your full name" | 234 |
| contact.contact-us.text.9 | page / /contact | section-3 / ContactUs / contact-us / text 9 | text | editable | "Email Address " | 238 |
| contact.contact-us.text.10 | page / /contact | section-3 / ContactUs / contact-us / text 10 | text | protected | "*" | 239 |
| contact.contact-us.placeholder.2 | page / /contact | section-3 / ContactUs / contact-us / placeholder 2 | text | editable | "you@example.com" | 248 |
| contact.contact-us.text.11 | page / /contact | section-3 / ContactUs / contact-us / text 11 | text | editable | "Phone Number" | 254 |
| contact.contact-us.placeholder.3 | page / /contact | section-3 / ContactUs / contact-us / placeholder 3 | text | editable | "+91-XXXXX-XXXXX" | 263 |
| contact.contact-us.text.12 | page / /contact | section-3 / ContactUs / contact-us / text 12 | text | editable | "Subject" | 267 |
| contact.contact-us.placeholder.4 | page / /contact | section-3 / ContactUs / contact-us / placeholder 4 | text | editable | "Subject of inquiry" | 276 |
| contact.contact-us.text.13 | page / /contact | section-3 / ContactUs / contact-us / text 13 | text | editable | "Message " | 281 |
| contact.contact-us.text.14 | page / /contact | section-3 / ContactUs / contact-us / text 14 | text | protected | "*" | 282 |
| contact.contact-us.placeholder.5 | page / /contact | section-3 / ContactUs / contact-us / placeholder 5 | text | editable | "Your message here..." | 291 |
| contact.contact-us.button-label | page / /contact | section-3 / ContactUs / contact-us / button-label | text | editable | "Sending..." | 303 |
| contact.contact-us.button-label.2 | page / /contact | section-3 / ContactUs / contact-us / button-label 2 | text | editable | "Send Message" | 308 |
| contact.contact-us.paragraph.4 | page / /contact | section-3 / ContactUs / contact-us / paragraph 4 | text | editable | "We'll get back to you within 24 hours" | 314 |
| contact.contact-us.text.15 | page / /contact | section-3 / ContactUs / contact-us / text 15 | text | editable | "Contact Information" | 342 |
| contact.contact-us.heading.3 | page / /contact | section-3 / ContactUs / contact-us / heading 3 | text | editable | "Connect With Us" | 372 |
| contact.contact-us.href | page / /contact | section-3 / ContactUs / contact-us / href | url | protected | "#" | 377 |
| contact.contact-us.text.16 | page / /contact | section-3 / ContactUs / contact-us / text 16 | text | editable | "Emergency" | 402 |
| contact.contact-us.paragraph.5 | page / /contact | section-3 / ContactUs / contact-us / paragraph 5 | text | editable | "Need immediate assistance?" | 404 |
| contact.contact-us.paragraph.6 | page / /contact | section-3 / ContactUs / contact-us / paragraph 6 | text | editable | "Call our emergency helpline available 24/7" | 407 |
| contact.contact-us.paragraph.7 | page / /contact | section-3 / ContactUs / contact-us / paragraph 7 | text | editable | "+91 9435190537" | 415 |
| contact.contact-us.paragraph.8 | page / /contact | section-3 / ContactUs / contact-us / paragraph 8 | text | editable | "Available 24/7" | 416 |
| contact.contact-us.text.17 | page / /contact | section-3 / ContactUs / contact-us / text 17 | text | editable | "Visit us:" | 432 |
| contact.contact-us.paragraph.9 | page / /contact | section-3 / ContactUs / contact-us / paragraph 9 | text | editable | " M.C.Road, Chenikuthi, Guwahati - 781003" | 432 |
| contact.contact-us.src | page / /contact | section-4 / ContactUs / contact-us / src | image | protected | "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3584.456789012345!2d91.7!3d26.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDA2JzAwLjAiTiA5McKwNDInMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890" | 454 |
| contact.contact-us.title | page / /contact | section-4 / ContactUs / contact-us / title | text | editable | "St. Mary's School Location" | 461 |
| contact.contact-us.text.18 | page / /contact | section-4 / ContactUs / contact-us / text 18 | text | editable | "St. Mary's Higher Secondary School" | 469 |

### src/site-pages/Gallery.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| gallery.fetch-gallery.text | page / /gallery | fetch-gallery / Gallery / fetch-gallery / text | text | editable | "Failed to load gallery" | 45 |
| gallery.load-more.text | page / /gallery | load-more / Gallery / load-more / text | text | editable | "Failed to load more images" | 62 |
| gallery.toggle-like.text | page / /gallery | toggle-like / Gallery / toggle-like / text | text | editable | "Removed from favorites" | 137 |
| gallery.toggle-like.text.2 | page / /gallery | toggle-like / Gallery / toggle-like / text 2 | text | editable | "Added to favorites" | 137 |
| gallery.handle-download.text | page / /gallery | handle-download / Gallery / handle-download / text | text | editable | "Image downloaded successfully" | 158 |
| gallery.handle-download.text.2 | page / /gallery | handle-download / Gallery / handle-download / text 2 | text | editable | "Failed to download image" | 160 |
| gallery.handle-share.title | page / /gallery | handle-share / Gallery / handle-share / title | text | editable | "St. Mary's Gallery" | 168 |
| gallery.handle-share.text | page / /gallery | handle-share / Gallery / handle-share / text | text | editable | "Check out this image from St. Mary's: " | 169 |
| gallery.handle-share.text.2 | page / /gallery | handle-share / Gallery / handle-share / text 2 | text | editable | "Image URL copied to clipboard" | 179 |
| gallery.handle-share.text.3 | page / /gallery | handle-share / Gallery / handle-share / text 3 | text | editable | "Failed to share image" | 182 |
| gallery.gallery.text | page / /gallery | section-1 / Gallery / gallery / text | text | editable | "GALLERY" | 248 |
| gallery.gallery.text.2 | page / /gallery | section-1 / Gallery / gallery / text 2 | text | editable | "Memories" | 254 |
| gallery.gallery.heading | page / /gallery | section-1 / Gallery / gallery / heading | text | editable | "Our " | 256 |
| gallery.gallery.text.3 | page / /gallery | section-1 / Gallery / gallery / text 3 | text | editable | "Gallery" | 257 |
| gallery.gallery.paragraph | page / /gallery | section-1 / Gallery / gallery / paragraph | text | editable | "Moments captured at St. Mary's" | 259 |
| gallery.gallery.text.4 | page / /gallery | section-3 / Gallery / gallery / text 4 | text | editable | "GALLERY" | 285 |
| gallery.gallery.text.5 | page / /gallery | section-3 / Gallery / gallery / text 5 | text | editable | "Memories" | 296 |
| gallery.gallery.heading.2 | page / /gallery | section-3 / Gallery / gallery / heading 2 | text | editable | "Our " | 303 |
| gallery.gallery.text.6 | page / /gallery | section-3 / Gallery / gallery / text 6 | text | editable | "Gallery" | 304 |
| gallery.gallery.paragraph.2 | page / /gallery | section-3 / Gallery / gallery / paragraph 2 | text | editable | "Moments captured at St. Mary's" | 311 |
| gallery.gallery.text.7 | page / /gallery | section-4 / Gallery / gallery / text 7 | text | editable | "Moments That Matter" | 331 |
| gallery.gallery.paragraph.3 | page / /gallery | section-4 / Gallery / gallery / paragraph 3 | text | editable | "Explore the vibrant life at St. Mary's through our gallery. From academic events to cultural celebrations, every moment tells a story of growth and community." | 333 |
| gallery.gallery.button-label | page / /gallery | section-5 / Gallery / gallery / button-label | text | editable | "All" | 358 |
| gallery.gallery.placeholder | page / /gallery | section-5 / Gallery / gallery / placeholder | text | editable | "Search images..." | 367 |
| gallery.gallery.heading.3 | page / /gallery | section-5 / Gallery / gallery / heading 3 | text | editable | "No photos found" | 403 |
| gallery.gallery.paragraph.4 | page / /gallery | section-5 / Gallery / gallery / paragraph 4 | text | editable | "Try adjusting your search or filter" | 404 |
| gallery.gallery.text.8 | page / /gallery | section-5 / Gallery / gallery / text 8 | text | editable | "General" | 439 |
| gallery.gallery.text.9 | page / /gallery | section-5 / Gallery / gallery / text 9 | text | editable | "View" | 479 |
| gallery.gallery.text.10 | page / /gallery | section-5 / Gallery / gallery / text 10 | text | editable | "Scroll for more" | 493 |
| gallery.gallery.paragraph.5 | page / /gallery | section-5 / Gallery / gallery / paragraph 5 | text | editable | "You've seen all photos 🎉" | 499 |
| gallery.gallery.paragraph.6 | page / /gallery | section-5 / Gallery / gallery / paragraph 6 | text | editable | "Showing " | 509 |
| gallery.gallery.paragraph.7 | page / /gallery | section-5 / Gallery / gallery / paragraph 7 | text | editable | "photo" | 510 |
| gallery.gallery.paragraph.8 | page / /gallery | section-5 / Gallery / gallery / paragraph 8 | text | editable | "photos" | 510 |
| gallery.gallery.paragraph.9 | page / /gallery | section-5 / Gallery / gallery / paragraph 9 | text | editable | " in " | 511 |
| gallery.gallery.text.11 | page / /gallery | gallery / Gallery / gallery / text 11 | text | editable | "General" | 572 |
| gallery.gallery.text.12 | page / /gallery | gallery / Gallery / gallery / text 12 | text | protected | " / " | 577 |
| gallery.gallery.item1.label | page / /gallery | gallery / Gallery / gallery.item1 / label | text | editable | "Zoom In" | 584 |
| gallery.gallery.item2.label | page / /gallery | gallery / Gallery / gallery.item2 / label | text | editable | "Zoom Out" | 585 |
| gallery.gallery.item3.label | page / /gallery | gallery / Gallery / gallery.item3 / label | text | editable | "Rotate" | 586 |
| gallery.gallery.item4.label | page / /gallery | gallery / Gallery / gallery.item4 / label | text | editable | "Like" | 589 |
| gallery.gallery.item5.label | page / /gallery | gallery / Gallery / gallery.item5 / label | text | editable | "Share" | 592 |
| gallery.gallery.item6.label | page / /gallery | gallery / Gallery / gallery.item6 / label | text | editable | "Download" | 593 |
| gallery.gallery.text.13 | page / /gallery | gallery / Gallery / gallery / text 13 | text | protected | " / " | 606 |
| gallery.gallery.title | page / /gallery | gallery / Gallery / gallery / title | text | editable | "Refresh Gallery" | 622 |

### src/site-pages/Home.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| home.home.text | page / / | section-2 / Home / home / text | text | protected | "✦" | 87 |
| home.home.heading | page / / | section-2 / Home / home / heading | text | editable | "Quick Facts" | 87 |
| home.home.item1.label | page / / | section-2 / Home / home.item1 / label | text | editable | "Established" | 92 |
| home.home.item1.value | page / / | section-2 / Home / home.item1 / value | text | editable | "1924" | 92 |
| home.home.item2.label | page / / | section-2 / Home / home.item2 / label | text | editable | "Students" | 93 |
| home.home.item2.value | page / / | section-2 / Home / home.item2 / value | text | editable | "2,000+" | 93 |
| home.home.item3.label | page / / | section-2 / Home / home.item3 / label | text | editable | "Teachers" | 94 |
| home.home.item3.value | page / / | section-2 / Home / home.item3 / value | text | editable | "85+" | 94 |
| home.home.item4.label | page / / | section-2 / Home / home.item4 / label | text | editable | "Years Legacy" | 95 |
| home.home.item4.value | page / / | section-2 / Home / home.item4 / value | text | editable | "100+" | 95 |
| home.home.item5.label | page / / | section-2 / Home / home.item5 / label | text | editable | "Awards Won" | 96 |
| home.home.item5.value | page / / | section-2 / Home / home.item5 / value | text | editable | "100+" | 96 |
| home.home.href | page / / | section-2 / Home / home / href | url | protected | "/about/founders" | 113 |
| home.home.text.2 | page / / | section-2 / Home / home / text 2 | text | editable | "Discover Our Legacy" | 115 |
| home.home.text.3 | page / / | section-2 / Home / home / text 3 | text | protected | "→" | 117 |
| home.home.text.4 | page / / | section-3 / Home / home / text 4 | text | editable | "Why Choose Us" | 149 |
| home.home.heading.2 | page / / | section-3 / Home / home / heading 2 | text | editable | "Why Choose " | 154 |
| home.home.text.5 | page / / | section-3 / Home / home / text 5 | text | editable | "St. Mary's?" | 155 |
| home.home.paragraph | page / / | section-3 / Home / home / paragraph | text | editable | "For over a century, St. Mary's has been shaping young minds into responsible citizens and future leaders through quality education and values." | 160 |
| home.home.text.6 | page / / | section-4 / Home / home / text 6 | text | editable | "Join Our Family" | 189 |
| home.home.heading.3 | page / / | section-4 / Home / home / heading 3 | text | editable | "Ready to Join " | 194 |
| home.home.text.7 | page / / | section-4 / Home / home / text 7 | text | editable | "St. Mary's?" | 195 |
| home.home.paragraph.2 | page / / | section-4 / Home / home / paragraph 2 | text | editable | "Take the first step towards a bright future. Be with us for upcoming admission notification details." | 198 |
| home.home.href.2 | page / / | section-4 / Home / home / href 2 | url | protected | "/contact" | 204 |
| home.home.text.8 | page / / | section-4 / Home / home / text 8 | text | editable | "Contact Us" | 206 |
| home.home.text.9 | page / / | section-4 / Home / home / text 9 | text | protected | "→" | 208 |
| home.home.text.10 | page / / | section-4 / Home / home / text 10 | text | editable | "📍 M.C.Road, Chenikuthi, Guwahati" | 213 |
| home.home.text.11 | page / / | section-4 / Home / home / text 11 | text | editable | "📞 +91-94351-90537" | 214 |
| home.home.text.12 | page / / | section-4 / Home / home / text 12 | text | editable | "✉️ stmarysghy1924@yahoo.com" | 215 |

### src/site-pages/Infrastructure.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| infrastructure.facilities.item1.title | page / /infrastructure | facilities / Infrastructure / facilities.item1 / title | text | editable | "Modern Classrooms" | 18 |
| infrastructure.facilities.item1.description | page / /infrastructure | facilities / Infrastructure / facilities.item1 / description | text | editable | "Spacious, well-ventilated classrooms equipped with smart boards and modern teaching aids for an enhanced learning experience." | 19 |
| infrastructure.facilities.item1.tag | page / /infrastructure | facilities / Infrastructure / facilities.item1 / tag | text | editable | "Smart Learning" | 20 |
| infrastructure.facilities.item2.title | page / /infrastructure | facilities / Infrastructure / facilities.item2 / title | text | editable | "Library" | 27 |
| infrastructure.facilities.item2.description | page / /infrastructure | facilities / Infrastructure / facilities.item2 / description | text | editable | "A well-stocked library with thousands of books, reference materials, and digital resources to support academic excellence." | 28 |
| infrastructure.facilities.item2.tag | page / /infrastructure | facilities / Infrastructure / facilities.item2 / tag | text | editable | "Knowledge Hub" | 29 |
| infrastructure.facilities.item3.title | page / /infrastructure | facilities / Infrastructure / facilities.item3 / title | text | editable | "Science Laboratories" | 36 |
| infrastructure.facilities.item3.description | page / /infrastructure | facilities / Infrastructure / facilities.item3 / description | text | editable | "State-of-the-art laboratories for Physics, Chemistry, and Biology with modern equipment for hands-on learning." | 37 |
| infrastructure.facilities.item3.tag | page / /infrastructure | facilities / Infrastructure / facilities.item3 / tag | text | editable | "Innovation" | 38 |
| infrastructure.facilities.item4.title | page / /infrastructure | facilities / Infrastructure / facilities.item4 / title | text | editable | "Computer Labs" | 45 |
| infrastructure.facilities.item4.description | page / /infrastructure | facilities / Infrastructure / facilities.item4 / description | text | editable | "Fully equipped computer labs with high-speed internet, latest software, and programming tools for computer science education." | 46 |
| infrastructure.facilities.item4.tag | page / /infrastructure | facilities / Infrastructure / facilities.item4 / tag | text | editable | "Digital Ready" | 47 |
| infrastructure.facilities.item5.title | page / /infrastructure | facilities / Infrastructure / facilities.item5 / title | text | editable | "Smart Classrooms" | 54 |
| infrastructure.facilities.item5.description | page / /infrastructure | facilities / Infrastructure / facilities.item5 / description | text | editable | "Technology-enabled classrooms with interactive displays, digital content, and audio-visual facilities for engaging lessons." | 55 |
| infrastructure.facilities.item5.tag | page / /infrastructure | facilities / Infrastructure / facilities.item5 / tag | text | editable | "Tech Enabled" | 56 |
| infrastructure.facilities.item6.title | page / /infrastructure | facilities / Infrastructure / facilities.item6 / title | text | editable | "Activity Rooms" | 63 |
| infrastructure.facilities.item6.description | page / /infrastructure | facilities / Infrastructure / facilities.item6 / description | text | editable | "Dedicated rooms for various activities including arts and crafts, music, dance, and debate to nurture creative talents." | 64 |
| infrastructure.facilities.item6.tag | page / /infrastructure | facilities / Infrastructure / facilities.item6 / tag | text | editable | "Creative Space" | 65 |
| infrastructure.facilities.item7.title | page / /infrastructure | facilities / Infrastructure / facilities.item7 / title | text | editable | "Sports Facilities" | 72 |
| infrastructure.facilities.item7.description | page / /infrastructure | facilities / Infrastructure / facilities.item7 / description | text | editable | "Extensive sports facilities including playgrounds, courts, and indoor sports facilities for holistic physical development." | 73 |
| infrastructure.facilities.item7.tag | page / /infrastructure | facilities / Infrastructure / facilities.item7 / tag | text | editable | "Sports Excellence" | 74 |
| infrastructure.facilities.item8.title | page / /infrastructure | facilities / Infrastructure / facilities.item8 / title | text | editable | "Auditorium" | 81 |
| infrastructure.facilities.item8.description | page / /infrastructure | facilities / Infrastructure / facilities.item8 / description | text | editable | "A well equipped set up stage for our students to explore and display their potential with great enthusiasm." | 82 |
| infrastructure.facilities.item8.tag | page / /infrastructure | facilities / Infrastructure / facilities.item8 / tag | text | editable | "Hall area" | 83 |
| infrastructure.infrastructure.text | page / /infrastructure | section-1 / Infrastructure / infrastructure / text | text | editable | "CAMPUS" | 136 |
| infrastructure.infrastructure.text.2 | page / /infrastructure | section-1 / Infrastructure / infrastructure / text 2 | text | editable | "Our Campus" | 150 |
| infrastructure.infrastructure.heading | page / /infrastructure | section-1 / Infrastructure / infrastructure / heading | text | editable | "Our " | 158 |
| infrastructure.infrastructure.text.3 | page / /infrastructure | section-1 / Infrastructure / infrastructure / text 3 | text | editable | "Infrastructure" | 159 |
| infrastructure.infrastructure.paragraph | page / /infrastructure | section-1 / Infrastructure / infrastructure / paragraph | text | editable | "State-of-the-art facilities for holistic education" | 167 |
| infrastructure.infrastructure.text.4 | page / /infrastructure | section-2 / Infrastructure / infrastructure / text 4 | text | editable | "Our Campus" | 189 |
| infrastructure.infrastructure.paragraph.2 | page / /infrastructure | section-2 / Infrastructure / infrastructure / paragraph 2 | text | editable | "St. Mary's Higher Secondary School boasts modern infrastructure designed to provide students with the best possible environment for learning and personal growth." | 191 |
| infrastructure.infrastructure.heading.2 | page / /infrastructure | section-3 / Infrastructure / infrastructure / heading 2 | text | editable | "World-Class " | 205 |
| infrastructure.infrastructure.text.5 | page / /infrastructure | section-3 / Infrastructure / infrastructure / text 5 | text | editable | "Infrastructure" | 206 |
| infrastructure.infrastructure.text.6 | page / /infrastructure | section-3 / Infrastructure / infrastructure / text 6 | text | editable | "Learn More" | 259 |
| infrastructure.infrastructure.text.7 | page / /infrastructure | section-3 / Infrastructure / infrastructure / text 7 | text | editable | "8+" | 282 |
| infrastructure.infrastructure.paragraph.3 | page / /infrastructure | section-3 / Infrastructure / infrastructure / paragraph 3 | text | editable | " World-Class Facilities" | 282 |
| infrastructure.infrastructure.text.8 | page / /infrastructure | section-3 / Infrastructure / infrastructure / text 8 | text | protected | " \| " | 283 |
| infrastructure.infrastructure.text.9 | page / /infrastructure | section-3 / Infrastructure / infrastructure / text 9 | text | editable | "24/7" | 285 |
| infrastructure.infrastructure.paragraph.4 | page / /infrastructure | section-3 / Infrastructure / infrastructure / paragraph 4 | text | editable | " Access" | 285 |
| infrastructure.infrastructure.text.10 | page / /infrastructure | section-3 / Infrastructure / infrastructure / text 10 | text | protected | " \| " | 286 |
| infrastructure.infrastructure.text.11 | page / /infrastructure | section-3 / Infrastructure / infrastructure / text 11 | text | editable | "100%" | 288 |
| infrastructure.infrastructure.paragraph.5 | page / /infrastructure | section-3 / Infrastructure / infrastructure / paragraph 5 | text | editable | " Student Satisfaction" | 288 |

### src/site-pages/Login.jsx

Audience: admin-or-system.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| global.login.handle-submit.text | global / shared | handle-submit / Login / handle-submit / text | text | protected | "Login successful!" | 29 |
| global.login.handle-submit.text.2 | global / shared | handle-submit / Login / handle-submit / text 2 | text | protected | "Login failed. Please check your credentials." | 32 |
| global.login.login.heading | global / shared | login / Login / login / heading | text | protected | "St. Mary's Admin" | 47 |
| global.login.login.paragraph | global / shared | login / Login / login / paragraph | text | protected | "Sign in to manage your school website" | 50 |
| global.login.login.text | global / shared | login / Login / login / text | text | protected | "Email Address" | 57 |
| global.login.login.placeholder | global / shared | login / Login / login / placeholder | text | protected | "admin@school.edu" | 68 |
| global.login.login.text.2 | global / shared | login / Login / login / text 2 | text | protected | "Password" | 74 |
| global.login.login.placeholder.2 | global / shared | login / Login / login / placeholder 2 | text | protected | "Enter your password" | 85 |
| global.login.login.button-label | global / shared | login / Login / login / button-label | text | protected | "Signing in..." | 95 |
| global.login.login.button-label.2 | global / shared | login / Login / login / button-label 2 | text | protected | "Sign In" | 95 |
| global.login.login.paragraph.2 | global / shared | login / Login / login / paragraph 2 | text | protected | "Contact administrator if you need access" | 99 |

### src/site-pages/MandatoryDisclosure.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| mandatory.disclosure.fetch-disclosures.text | page / /mandatory-disclosure | fetch-disclosures / MandatoryDisclosure / fetch-disclosures / text | text | editable | "Failed to load disclosures" | 23 |
| mandatory.disclosure.mandatory-disclosure.text | page / /mandatory-disclosure | section-1 / MandatoryDisclosure / mandatory-disclosure / text | text | editable | "DISCLOSURE" | 96 |
| mandatory.disclosure.mandatory-disclosure.text.2 | page / /mandatory-disclosure | section-1 / MandatoryDisclosure / mandatory-disclosure / text 2 | text | editable | "Official" | 104 |
| mandatory.disclosure.mandatory-disclosure.heading | page / /mandatory-disclosure | section-1 / MandatoryDisclosure / mandatory-disclosure / heading | text | editable | "Mandatory " | 106 |
| mandatory.disclosure.mandatory-disclosure.text.3 | page / /mandatory-disclosure | section-1 / MandatoryDisclosure / mandatory-disclosure / text 3 | text | editable | "Disclosure" | 107 |
| mandatory.disclosure.mandatory-disclosure.paragraph | page / /mandatory-disclosure | section-1 / MandatoryDisclosure / mandatory-disclosure / paragraph | text | editable | "Official Certificates & Documents" | 109 |
| mandatory.disclosure.mandatory-disclosure.text.4 | page / /mandatory-disclosure | section-3 / MandatoryDisclosure / mandatory-disclosure / text 4 | text | editable | "DISCLOSURE" | 138 |
| mandatory.disclosure.mandatory-disclosure.text.5 | page / /mandatory-disclosure | section-3 / MandatoryDisclosure / mandatory-disclosure / text 5 | text | editable | "Official" | 152 |
| mandatory.disclosure.mandatory-disclosure.heading.2 | page / /mandatory-disclosure | section-3 / MandatoryDisclosure / mandatory-disclosure / heading 2 | text | editable | "Mandatory " | 160 |
| mandatory.disclosure.mandatory-disclosure.text.6 | page / /mandatory-disclosure | section-3 / MandatoryDisclosure / mandatory-disclosure / text 6 | text | editable | "Disclosure" | 161 |
| mandatory.disclosure.mandatory-disclosure.paragraph.2 | page / /mandatory-disclosure | section-3 / MandatoryDisclosure / mandatory-disclosure / paragraph 2 | text | editable | "Official Certificates & Documents" | 169 |
| mandatory.disclosure.mandatory-disclosure.text.7 | page / /mandatory-disclosure | section-4 / MandatoryDisclosure / mandatory-disclosure / text 7 | text | editable | "Official Documents" | 191 |
| mandatory.disclosure.mandatory-disclosure.paragraph.3 | page / /mandatory-disclosure | section-4 / MandatoryDisclosure / mandatory-disclosure / paragraph 3 | text | editable | "St. Mary's Higher Secondary School maintains all mandatory certificates and disclosures as required by regulatory authorities." | 193 |
| mandatory.disclosure.mandatory-disclosure.text.8 | page / /mandatory-disclosure | section-5 / MandatoryDisclosure / mandatory-disclosure / text 8 | text | editable | "Official Documents" | 207 |
| mandatory.disclosure.mandatory-disclosure.heading.3 | page / /mandatory-disclosure | section-5 / MandatoryDisclosure / mandatory-disclosure / heading 3 | text | editable | "Certificates & " | 209 |
| mandatory.disclosure.mandatory-disclosure.text.9 | page / /mandatory-disclosure | section-5 / MandatoryDisclosure / mandatory-disclosure / text 9 | text | editable | "Disclosures" | 210 |
| mandatory.disclosure.mandatory-disclosure.paragraph.4 | page / /mandatory-disclosure | section-5 / MandatoryDisclosure / mandatory-disclosure / paragraph 4 | text | editable | "St. Mary's Higher Secondary School maintains all mandatory certificates and disclosures as required by regulatory authorities." | 213 |
| mandatory.disclosure.mandatory-disclosure.heading.4 | page / /mandatory-disclosure | section-5 / MandatoryDisclosure / mandatory-disclosure / heading 4 | text | editable | "No disclosures found" | 228 |
| mandatory.disclosure.mandatory-disclosure.paragraph.5 | page / /mandatory-disclosure | section-5 / MandatoryDisclosure / mandatory-disclosure / paragraph 5 | text | editable | "No certificates or disclosures have been uploaded yet." | 229 |
| mandatory.disclosure.mandatory-disclosure.text.10 | page / /mandatory-disclosure | section-5 / MandatoryDisclosure / mandatory-disclosure / text 10 | text | editable | "Valid" | 263 |
| mandatory.disclosure.mandatory-disclosure.text.11 | page / /mandatory-disclosure | section-5 / MandatoryDisclosure / mandatory-disclosure / text 11 | text | editable | "✓ Verified" | 265 |
| mandatory.disclosure.mandatory-disclosure.text.12 | page / /mandatory-disclosure | section-5 / MandatoryDisclosure / mandatory-disclosure / text 12 | text | editable | "View Document" | 277 |
| mandatory.disclosure.mandatory-disclosure.text.13 | page / /mandatory-disclosure | section-5 / MandatoryDisclosure / mandatory-disclosure / text 13 | text | editable | "Expires: " | 285 |
| mandatory.disclosure.mandatory-disclosure.text.14 | page / /mandatory-disclosure | section-5 / MandatoryDisclosure / mandatory-disclosure / text 14 | text | editable | "Verified & Authentic" | 315 |
| mandatory.disclosure.mandatory-disclosure.text.15 | page / /mandatory-disclosure | section-5 / MandatoryDisclosure / mandatory-disclosure / text 15 | text | editable | "Note:" | 319 |
| mandatory.disclosure.mandatory-disclosure.paragraph.6 | page / /mandatory-disclosure | section-5 / MandatoryDisclosure / mandatory-disclosure / paragraph 6 | text | editable | " All certificates are valid and maintained as per the requirements of the education board and government regulations. For any queries, please contact the school administration." | 319 |
| mandatory.disclosure.mandatory-disclosure.text.16 | page / /mandatory-disclosure | section-5 / MandatoryDisclosure / mandatory-disclosure / text 16 | text | editable | "📅 Last Updated: " | 324 |
| mandatory.disclosure.mandatory-disclosure.text.17 | page / /mandatory-disclosure | section-5 / MandatoryDisclosure / mandatory-disclosure / text 17 | text | protected | "\|" | 329 |
| mandatory.disclosure.mandatory-disclosure.text.18 | page / /mandatory-disclosure | section-5 / MandatoryDisclosure / mandatory-disclosure / text 18 | text | editable | "🔒 Verified by: School Administration" | 330 |

### src/site-pages/NotFound.jsx

Audience: admin-or-system.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| global.not-found.not-found.heading | global / shared | not-found / NotFound / not-found / heading | text | protected | "404" | 11 |
| global.not-found.not-found.heading.2 | global / shared | not-found / NotFound / not-found / heading 2 | text | protected | "Page Not Found" | 12 |
| global.not-found.not-found.paragraph | global / shared | not-found / NotFound / not-found / paragraph | text | protected | "Oops! The page you're looking for doesn't exist or has been moved." | 13 |
| global.not-found.not-found.href | global / shared | not-found / NotFound / not-found / href | url | protected | "/" | 17 |
| global.not-found.not-found.text | global / shared | not-found / NotFound / not-found / text | text | protected | "Back to Home" | 20 |

### src/site-pages/PastPupilsAssociation.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| past.pupils.testimonials.item1.name | page / /past-pupils | testimonials / PastPupilsAssociation / testimonials.item1 / name | text | editable | "Dr. Ritu Sharma" | 12 |
| past.pupils.testimonials.item1.year | page / /past-pupils | testimonials / PastPupilsAssociation / testimonials.item1 / year | text | editable | "2005" | 13 |
| past.pupils.testimonials.item1.profession | page / /past-pupils | testimonials / PastPupilsAssociation / testimonials.item1 / profession | text | editable | "Software Engineer at Google" | 14 |
| past.pupils.testimonials.item1.message | page / /past-pupils | testimonials / PastPupilsAssociation / testimonials.item1 / message | text | editable | "St. Mary's gave me the foundation that made my career in technology possible. The values and discipline I learned here continue to guide me." | 15 |
| past.pupils.testimonials.item2.name | page / /past-pupils | testimonials / PastPupilsAssociation / testimonials.item2 / name | text | editable | "Mr. Anupam Das" | 18 |
| past.pupils.testimonials.item2.year | page / /past-pupils | testimonials / PastPupilsAssociation / testimonials.item2 / year | text | editable | "2008" | 19 |
| past.pupils.testimonials.item2.profession | page / /past-pupils | testimonials / PastPupilsAssociation / testimonials.item2 / profession | text | editable | "Entrepreneur & CEO" | 20 |
| past.pupils.testimonials.item2.message | page / /past-pupils | testimonials / PastPupilsAssociation / testimonials.item2 / message | text | editable | "The entrepreneurial spirit was nurtured at St. Mary's. The teachers encouraged us to think beyond textbooks and explore real-world applications." | 21 |
| past.pupils.testimonials.item3.name | page / /past-pupils | testimonials / PastPupilsAssociation / testimonials.item3 / name | text | editable | "Ms. Priya Patel" | 24 |
| past.pupils.testimonials.item3.year | page / /past-pupils | testimonials / PastPupilsAssociation / testimonials.item3 / year | text | editable | "2010" | 25 |
| past.pupils.testimonials.item3.profession | page / /past-pupils | testimonials / PastPupilsAssociation / testimonials.item3 / profession | text | editable | "Medical Professional" | 26 |
| past.pupils.testimonials.item3.message | page / /past-pupils | testimonials / PastPupilsAssociation / testimonials.item3 / message | text | editable | "The emphasis on science education and ethical values at St. Mary's inspired me to pursue a career in healthcare and serve the community." | 27 |
| past.pupils.past-pupils-association.title | page / /past-pupils | past-pupils-association / PastPupilsAssociation / past-pupils-association / title | text | editable | "Past Pupils Association" | 34 |
| past.pupils.past-pupils-association.subtitle | page / /past-pupils | past-pupils-association / PastPupilsAssociation / past-pupils-association / subtitle | text | editable | "Alumni network connecting generations" | 35 |
| past.pupils.past-pupils-association.item1.breadcrumb | page / /past-pupils | past-pupils-association / PastPupilsAssociation / past-pupils-association.item1 / breadcrumb | text | editable | "Past Pupils Association" | 36 |
| past.pupils.past-pupils-association.paragraph | page / /past-pupils | section-1 / PastPupilsAssociation / past-pupils-association / paragraph | text | editable | "The Past Pupils Association (PPA) of St. Mary's is a vibrant community of former students who continue to contribute to the school's growth and maintain lifelong bonds with their alma mater." | 41 |
| past.pupils.past-pupils-association.item1.label | page / /past-pupils | section-1 / PastPupilsAssociation / past-pupils-association.item1 / label | text | editable | "Active Members" | 50 |
| past.pupils.past-pupils-association.item1.value | page / /past-pupils | section-1 / PastPupilsAssociation / past-pupils-association.item1 / value | text | editable | "500+" | 50 |
| past.pupils.past-pupils-association.item2.label | page / /past-pupils | section-1 / PastPupilsAssociation / past-pupils-association.item2 / label | text | editable | "Annual Reunions" | 51 |
| past.pupils.past-pupils-association.item2.value | page / /past-pupils | section-1 / PastPupilsAssociation / past-pupils-association.item2 / value | text | editable | "10+" | 51 |
| past.pupils.past-pupils-association.item3.label | page / /past-pupils | section-1 / PastPupilsAssociation / past-pupils-association.item3 / label | text | editable | "Scholarships" | 52 |
| past.pupils.past-pupils-association.item3.value | page / /past-pupils | section-1 / PastPupilsAssociation / past-pupils-association.item3 / value | text | editable | "25+" | 52 |
| past.pupils.past-pupils-association.item4.label | page / /past-pupils | section-1 / PastPupilsAssociation / past-pupils-association.item4 / label | text | editable | "Years of Legacy" | 53 |
| past.pupils.past-pupils-association.item4.value | page / /past-pupils | section-1 / PastPupilsAssociation / past-pupils-association.item4 / value | text | editable | "50" | 53 |
| past.pupils.past-pupils-association.heading | page / /past-pupils | section-1 / PastPupilsAssociation / past-pupils-association / heading | text | editable | "Why Join the Past Pupils Association?" | 67 |
| past.pupils.past-pupils-association.item1.title | page / /past-pupils | section-1 / PastPupilsAssociation / past-pupils-association.item1 / title | text | editable | "Stay Connected" | 74 |
| past.pupils.past-pupils-association.item1.description | page / /past-pupils | section-1 / PastPupilsAssociation / past-pupils-association.item1 / description | text | editable | "Connect with old friends, teachers, and stay updated on school events and developments." | 75 |
| past.pupils.past-pupils-association.item2.title | page / /past-pupils | section-1 / PastPupilsAssociation / past-pupils-association.item2 / title | text | editable | "Network & Mentor" | 79 |
| past.pupils.past-pupils-association.item2.description | page / /past-pupils | section-1 / PastPupilsAssociation / past-pupils-association.item2 / description | text | editable | "Access to a network of professionals across various fields and opportunities to mentor current students." | 80 |
| past.pupils.past-pupils-association.item3.title | page / /past-pupils | section-1 / PastPupilsAssociation / past-pupils-association.item3 / title | text | editable | "Give Back" | 84 |
| past.pupils.past-pupils-association.item3.description | page / /past-pupils | section-1 / PastPupilsAssociation / past-pupils-association.item3 / description | text | editable | "Contribute to school development, scholarships, and support initiatives that benefit current students." | 85 |
| past.pupils.past-pupils-association.heading.2 | page / /past-pupils | section-1 / PastPupilsAssociation / past-pupils-association / heading 2 | text | editable | "Alumni Testimonials" | 100 |
| past.pupils.past-pupils-association.paragraph.2 | page / /past-pupils | section-1 / PastPupilsAssociation / past-pupils-association / paragraph 2 | text | editable | "Hear from our distinguished alumni" | 101 |
| past.pupils.past-pupils-association.paragraph.3 | page / /past-pupils | section-1 / PastPupilsAssociation / past-pupils-association / paragraph 3 | text | protected | "\"" | 105 |
| past.pupils.past-pupils-association.paragraph.4 | page / /past-pupils | section-1 / PastPupilsAssociation / past-pupils-association / paragraph 4 | text | protected | "\"" | 105 |
| past.pupils.past-pupils-association.paragraph.5 | page / /past-pupils | section-1 / PastPupilsAssociation / past-pupils-association / paragraph 5 | text | editable | "Batch: " | 109 |
| past.pupils.past-pupils-association.href | page / /past-pupils | section-1 / PastPupilsAssociation / past-pupils-association / href | url | protected | "/contact" | 116 |
| past.pupils.past-pupils-association.text | page / /past-pupils | section-1 / PastPupilsAssociation / past-pupils-association / text | text | editable | "Join the Association" | 118 |

### src/site-pages/StudentRules.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| student.rules.rules.item1.title | page / /student-rules | rules / StudentRules / rules.item1 / title | text | editable | "Discipline" | 12 |
| student.rules.rules.item1.item1.rules | page / /student-rules | rules / StudentRules / rules.item1.item1 / rules | text | editable | "Students must maintain discipline at all times within the school premises." | 14 |
| student.rules.rules.item1.item2.rules | page / /student-rules | rules / StudentRules / rules.item1.item2 / rules | text | editable | "Respect all teachers, staff, and fellow students." | 15 |
| student.rules.rules.item1.item3.rules | page / /student-rules | rules / StudentRules / rules.item1.item3 / rules | text | editable | "School property must be treated with care and respect." | 16 |
| student.rules.rules.item1.item4.rules | page / /student-rules | rules / StudentRules / rules.item1.item4 / rules | text | editable | "Any form of bullying, harassment, or discrimination is strictly prohibited." | 17 |
| student.rules.rules.item2.title | page / /student-rules | rules / StudentRules / rules.item2 / title | text | editable | "Attendance & Punctuality" | 22 |
| student.rules.rules.item2.item1.rules | page / /student-rules | rules / StudentRules / rules.item2.item1 / rules | text | editable | "Students must arrive at school by 8:00 AM sharp." | 24 |
| student.rules.rules.item2.item2.rules | page / /student-rules | rules / StudentRules / rules.item2.item2 / rules | text | editable | "Attendance of at least 75% is mandatory for promotion." | 25 |
| student.rules.rules.item2.item3.rules | page / /student-rules | rules / StudentRules / rules.item2.item3 / rules | text | editable | "Leave applications must be submitted in advance for planned absences." | 26 |
| student.rules.rules.item2.item4.rules | page / /student-rules | rules / StudentRules / rules.item2.item4 / rules | text | editable | "Medical certificates required for absences of more than 3 days." | 27 |
| student.rules.rules.item3.title | page / /student-rules | rules / StudentRules / rules.item3 / title | text | editable | "Academic Conduct" | 32 |
| student.rules.rules.item3.item1.rules | page / /student-rules | rules / StudentRules / rules.item3.item1 / rules | text | editable | "Homework and assignments must be submitted on time." | 34 |
| student.rules.rules.item3.item2.rules | page / /student-rules | rules / StudentRules / rules.item3.item2 / rules | text | editable | "Academic integrity is paramount - no cheating or plagiarism." | 35 |
| student.rules.rules.item3.item3.rules | page / /student-rules | rules / StudentRules / rules.item3.item3 / rules | text | editable | "Students must bring all required textbooks and materials to class." | 36 |
| student.rules.rules.item3.item4.rules | page / /student-rules | rules / StudentRules / rules.item3.item4 / rules | text | editable | "Active participation in classroom activities is encouraged." | 37 |
| student.rules.rules.item4.title | page / /student-rules | rules / StudentRules / rules.item4 / title | text | editable | "School Uniform & Appearance" | 42 |
| student.rules.rules.item4.item1.rules | page / /student-rules | rules / StudentRules / rules.item4.item1 / rules | text | editable | "Prescribed school uniform must be worn on all school days." | 44 |
| student.rules.rules.item4.item2.rules | page / /student-rules | rules / StudentRules / rules.item4.item2 / rules | text | editable | "Students must maintain clean and neat appearance." | 45 |
| student.rules.rules.item4.item3.rules | page / /student-rules | rules / StudentRules / rules.item4.item3 / rules | text | editable | "Hair should be neatly combed and properly styled." | 46 |
| student.rules.rules.item4.item4.rules | page / /student-rules | rules / StudentRules / rules.item4.item4 / rules | text | editable | "No jewelry or accessories beyond the permitted items." | 47 |
| student.rules.rules.item5.title | page / /student-rules | rules / StudentRules / rules.item5 / title | text | editable | "School Hours & Behavior" | 52 |
| student.rules.rules.item5.item1.rules | page / /student-rules | rules / StudentRules / rules.item5.item1 / rules | text | editable | "School hours are from 8:00 AM to 3:00 PM." | 54 |
| student.rules.rules.item5.item2.rules | page / /student-rules | rules / StudentRules / rules.item5.item2 / rules | text | editable | "Students must not leave the school premises without permission." | 55 |
| student.rules.rules.item5.item3.rules | page / /student-rules | rules / StudentRules / rules.item5.item3 / rules | text | editable | "Mobile phones and electronic devices are strictly prohibited." | 56 |
| student.rules.rules.item5.item4.rules | page / /student-rules | rules / StudentRules / rules.item5.item4 / rules | text | editable | "Lunch breaks should be used responsibly." | 57 |
| student.rules.rules.item6.title | page / /student-rules | rules / StudentRules / rules.item6 / title | text | editable | "Values & Ethics" | 62 |
| student.rules.rules.item6.item1.rules | page / /student-rules | rules / StudentRules / rules.item6.item1 / rules | text | editable | "Practice honesty, kindness, and empathy in daily interactions." | 64 |
| student.rules.rules.item6.item2.rules | page / /student-rules | rules / StudentRules / rules.item6.item2 / rules | text | editable | "Respect cultural and religious diversity of all students." | 65 |
| student.rules.rules.item6.item3.rules | page / /student-rules | rules / StudentRules / rules.item6.item3 / rules | text | editable | "Maintain cleanliness in all areas of the school." | 66 |
| student.rules.rules.item6.item4.rules | page / /student-rules | rules / StudentRules / rules.item6.item4 / rules | text | editable | "Participate actively in community service activities." | 67 |
| student.rules.student-rules.text | page / /student-rules | section-1 / StudentRules / student-rules / text | text | editable | "RULES" | 106 |
| student.rules.student-rules.text.2 | page / /student-rules | section-1 / StudentRules / student-rules / text 2 | text | editable | "Guidelines" | 120 |
| student.rules.student-rules.heading | page / /student-rules | section-1 / StudentRules / student-rules / heading | text | editable | "Student " | 128 |
| student.rules.student-rules.text.3 | page / /student-rules | section-1 / StudentRules / student-rules / text 3 | text | editable | "Rules" | 129 |
| student.rules.student-rules.paragraph | page / /student-rules | section-1 / StudentRules / student-rules / paragraph | text | editable | "Guidelines for a disciplined and enriching school life" | 137 |
| student.rules.student-rules.text.4 | page / /student-rules | section-2 / StudentRules / student-rules / text 4 | text | editable | "School Guidelines" | 159 |
| student.rules.student-rules.paragraph.2 | page / /student-rules | section-2 / StudentRules / student-rules / paragraph 2 | text | editable | "Our school rules are designed to create a safe, respectful, and conducive learning environment where every student can thrive academically and personally." | 161 |
| student.rules.student-rules.text.5 | page / /student-rules | section-3 / StudentRules / student-rules / text 5 | text | protected | "•" | 200 |
| student.rules.student-rules.text.6 | page / /student-rules | section-3 / StudentRules / student-rules / text 6 | text | editable | "Core Values" | 228 |
| student.rules.student-rules.heading.2 | page / /student-rules | section-3 / StudentRules / student-rules / heading 2 | text | editable | "Remember" | 231 |
| student.rules.student-rules.paragraph.3 | page / /student-rules | section-3 / StudentRules / student-rules / paragraph 3 | text | editable | "These rules are not just about maintaining discipline - they are about building character, fostering respect, and creating a community where everyone can succeed." | 232 |
| student.rules.student-rules.text.7 | page / /student-rules | section-3 / StudentRules / student-rules / text 7 | text | editable | "Respect" | 238 |
| student.rules.student-rules.text.8 | page / /student-rules | section-3 / StudentRules / student-rules / text 8 | text | editable | "Discipline" | 242 |
| student.rules.student-rules.text.9 | page / /student-rules | section-3 / StudentRules / student-rules / text 9 | text | editable | "Integrity" | 246 |
| student.rules.student-rules.text.10 | page / /student-rules | section-3 / StudentRules / student-rules / text 10 | text | editable | "Excellence" | 250 |

### src/site-pages/about/OurFounders.jsx

Audience: public, dormant-source.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| about.founders.founders.item1.name | page / /about/founders | founders / OurFounders / founders.item1 / name | text | editable | "St. John Bosco" | 11 |
| about.founders.founders.item1.role | page / /about/founders | founders / OurFounders / founders.item1 / role | text | editable | "Founder" | 12 |
| about.founders.founders.item1.short-name | page / /about/founders | founders / OurFounders / founders.item1 / short-name | text | protected | "Don Bosco" | 13 |
| about.founders.founders.item1.description | page / /about/founders | founders / OurFounders / founders.item1 / description | text | editable | "St. John Bosco, popularly known as Don Bosco (Italian for Father Bosco) was born at Becchi, in Piedmont, Italy on August 16, 1815. From a very young age he was inspired to work for the poor young people of his time, when Europe was under the grip of the Industrial Revolution and many a young person who came to the cities to study or in search of work, fell an easy prey to the many social evils of his time.\n\nHe lost his father at the age of 2 and was brought up by his mother Mama Margherita, who was truly his guide, his model and his educator. From early years of life he discovered his leadership qualities especially among his peers. At the age of nine little John Bosco was given a mission in a vision. He was to transform young people \"NOT WITH BLOWS BUT WITH KINDNESS\" that became the goal of his life. Overcoming untold hardships and hostility he became a priest on June 5th, 1841. His determination to be a priest for young people combined with his dynamic optimism resulted in the flowering of his long cherished goal.\n\nDon Bosco was an educational practitioner rather than an educational theorist. It is impossible to understand his approach to education without reference to his experiences in life, because he actually incorporated the lessons of his own life experiences into his pedagogy. This style of education consists in involving young people, their parents or guardians and the educators in a family atmosphere. This system is based on Reason, Religion (Faith in God) and Loving Kindness. The goal is integral formation. It embraces developing physical, intellectual, moral, social and spiritual aspects of a person's life.\n\nIn spite of initial poverty, hardships, opposition of all sorts, soon his works flourished. The little seed planted by him grew into a mighty tree, and now there are hundreds of educational institutions catering to thousands of young people all over the world. Rightly, Don Bosco is recognized as the Father, Friend and Teacher of young people. He is the Founder of the Salesian Fathers (SDB), Salesian Sisters (FMA), and Salesian Cooperators (SC)." | 14 |
| about.founders.founders.item1.image | page / /about/founders | founders / OurFounders / founders.item1 / image | image | protected | "/john.png" | 21 |
| about.founders.founders.item1.years | page / /about/founders | founders / OurFounders / founders.item1 / years | text | editable | "1815 - 1888" | 22 |
| about.founders.founders.item1.feast-day | page / /about/founders | founders / OurFounders / founders.item1 / feast-day | text | editable | "January 31" | 23 |
| about.founders.founders.item2.name | page / /about/founders | founders / OurFounders / founders.item2 / name | text | editable | "St. Mary Domenica Mazzarello" | 27 |
| about.founders.founders.item2.role | page / /about/founders | founders / OurFounders / founders.item2 / role | text | editable | "Co-Founder" | 28 |
| about.founders.founders.item2.short-name | page / /about/founders | founders / OurFounders / founders.item2 / short-name | text | protected | "Mary Mazzarello" | 29 |
| about.founders.founders.item2.description | page / /about/founders | founders / OurFounders / founders.item2 / description | text | editable | "God's ways are marvellous. Contemporaneously with Don Bosco, Mary Mazzarello in the hamlet of Mornese a little village in Piedmont, Italy thirsted with the same desire to help girls. She was born on May 9, 1837.\n\nShe too received a heavenly mandate. While walking down the uninhabited slopes of Borgo Alto she saw a group of girls playing in the non existent playground and a strong voice-firm and steady, communicated to her the divine mission : \"I entrust them to you\" Was it a dream, a hallucination? Yet, there she was fully awake. Walking in full consciousness...\n\nIn 1864 came the momentous meeting with Don Bosco, \"He is a saint! I can feel it!\" She said to all. Don Bosco too saw something exceptional in her. In Mary Mazzarello a likeminded soul, Salesian by instinct Don Bosco found a ready, active and creative collaborator. In 1872, he founded the Society of the Salesian Sisters (FMA) with Mary Mazzarello at their head. Imbibed with the spirit of the Founder they would march forward in the quest of providing integral formation and education for girls. 1875 saw the first expansion of the Salesian work outside Europe. India welcomed the first Salesian Sisters in 1922." | 30 |
| about.founders.founders.item2.image | page / /about/founders | founders / OurFounders / founders.item2 / image | image | protected | "/domenica.png" | 35 |
| about.founders.founders.item2.years | page / /about/founders | founders / OurFounders / founders.item2 / years | text | editable | "1837 - 1881" | 36 |
| about.founders.founders.item2.feast-day | page / /about/founders | founders / OurFounders / founders.item2 / feast-day | text | editable | "May 13" | 37 |
| about.founders.founders.item3.name | page / /about/founders | founders / OurFounders / founders.item3 / name | text | editable | "Pioneering Sisters" | 41 |
| about.founders.founders.item3.role | page / /about/founders | founders / OurFounders / founders.item3 / role | text | editable | "First Missionaries to Assam" | 42 |
| about.founders.founders.item3.short-name | page / /about/founders | founders / OurFounders / founders.item3 / short-name | text | protected | "First Sisters" | 43 |
| about.founders.founders.item3.description | page / /about/founders | founders / OurFounders / founders.item3 / description | text | editable | "Sr. Innocenza Vallino, Sr. Cecilia Da Roit, Sr. Clotilde Appiano, Sr. Maria Bricarello, Sr. Rosetti Antonietta and Sr. Giulia Berra formed the first batch of sisters destined for Assam. These courageous women ventured into the unknown, bringing education and hope to the people of Assam. Their pioneering spirit and dedication to the Salesian mission laid the foundation for St. Mary's Higher Secondary School and the countless educational institutions that followed." | 44 |
| about.founders.founders.item3.image | page / /about/founders | founders / OurFounders / founders.item3 / image | image | protected | "/sister.jpg" | 45 |
| about.founders.founders.item3.years | page / /about/founders | founders / OurFounders / founders.item3 / years | text | editable | "1922" | 46 |
| about.founders.founders.item3.feast-day | page / /about/founders | founders / OurFounders / founders.item3 / feast-day | text | protected | "—" | 47 |
| about.founders.our-founders.text | page / /about/founders | section-1 / OurFounders / our-founders / text | text | editable | "FOUNDERS" | 85 |
| about.founders.our-founders.text.2 | page / /about/founders | section-1 / OurFounders / our-founders / text 2 | text | editable | "Est. 1924" | 99 |
| about.founders.our-founders.heading | page / /about/founders | section-1 / OurFounders / our-founders / heading | text | editable | "Our " | 107 |
| about.founders.our-founders.text.3 | page / /about/founders | section-1 / OurFounders / our-founders / text 3 | text | editable | "Founders" | 108 |
| about.founders.our-founders.paragraph | page / /about/founders | section-1 / OurFounders / our-founders / paragraph | text | editable | "The visionaries who laid the foundation of St. Mary's Higher Secondary School" | 116 |
| about.founders.our-founders.paragraph.2 | page / /about/founders | section-2 / OurFounders / our-founders / paragraph 2 | text | editable | "St. Mary's Higher Secondary School was established with a vision to provide quality education rooted in Christian values. Our founders dedicated their lives to building an institution that would serve the community for generations." | 136 |
| about.founders.our-founders.text.4 | page / /about/founders | section-3 / OurFounders / our-founders / text 4 | text | editable | "Feast: " | 192 |
| about.founders.our-founders.paragraph.3 | page / /about/founders | section-3 / OurFounders / our-founders / paragraph 3 | text | protected | "\"" | 213 |
| about.founders.our-founders.paragraph.4 | page / /about/founders | section-3 / OurFounders / our-founders / paragraph 4 | text | editable | "NOT WITH BLOWS BUT WITH KINDNESS" | 214 |
| about.founders.our-founders.paragraph.5 | page / /about/founders | section-3 / OurFounders / our-founders / paragraph 5 | text | editable | "I entrust them to you" | 214 |
| about.founders.our-founders.paragraph.6 | page / /about/founders | section-3 / OurFounders / our-founders / paragraph 6 | text | editable | "Courage to venture into the unknown" | 214 |
| about.founders.our-founders.paragraph.7 | page / /about/founders | section-3 / OurFounders / our-founders / paragraph 7 | text | protected | "\"" | 214 |
| about.founders.our-founders.text.5 | page / /about/founders | section-4 / OurFounders / our-founders / text 5 | text | editable | "Carrying Forward the Vision" | 242 |
| about.founders.our-founders.paragraph.8 | page / /about/founders | section-4 / OurFounders / our-founders / paragraph 8 | text | editable | "The legacy of our founders continues to inspire generations of students. Their vision of quality education rooted in values remains the cornerstone of St. Mary's Higher Secondary School." | 244 |
| about.founders.our-founders.href | page / /about/founders | section-4 / OurFounders / our-founders / href | url | protected | "/about/journey" | 251 |
| about.founders.our-founders.text.6 | page / /about/founders | section-4 / OurFounders / our-founders / text 6 | text | editable | "Explore Our Journey" | 253 |
| about.founders.our-founders.href.2 | page / /about/founders | section-4 / OurFounders / our-founders / href 2 | url | protected | "/about/principal" | 258 |
| about.founders.our-founders.text.7 | page / /about/founders | section-4 / OurFounders / our-founders / text 7 | text | editable | "Principal's Message" | 260 |
| about.founders.our-founders.text.8 | page / /about/founders | section-4 / OurFounders / our-founders / text 8 | text | protected | "→" | 262 |

### src/site-pages/about/OurJourney.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| about.journey.milestones.item1.year | page / /about/journey | milestones / OurJourney / milestones.item1 / year | text | editable | "1924" | 10 |
| about.journey.milestones.item1.title | page / /about/journey | milestones / OurJourney / milestones.item1 / title | text | editable | "Foundation" | 11 |
| about.journey.milestones.item1.description | page / /about/journey | milestones / OurJourney / milestones.item1 / description | text | editable | "St. Mary's Higher Secondary School was established with a vision to provide quality education rooted in Christian values." | 12 |
| about.journey.milestones.item1.image | page / /about/journey | milestones / OurJourney / milestones.item1 / image | image | protected | "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=400&h=300&fit=crop&crop=center" | 14 |
| about.journey.milestones.item2.year | page / /about/journey | milestones / OurJourney / milestones.item2 / year | text | editable | "1930" | 17 |
| about.journey.milestones.item2.title | page / /about/journey | milestones / OurJourney / milestones.item2 / title | text | editable | "First Batch" | 18 |
| about.journey.milestones.item2.description | page / /about/journey | milestones / OurJourney / milestones.item2 / description | text | editable | "The first batch of students graduated from the school, marking the beginning of a legacy of academic excellence." | 19 |
| about.journey.milestones.item2.image | page / /about/journey | milestones / OurJourney / milestones.item2 / image | image | protected | "https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=400&h=300&fit=crop&crop=center" | 21 |
| about.journey.milestones.item3.year | page / /about/journey | milestones / OurJourney / milestones.item3 / year | text | editable | "1950" | 24 |
| about.journey.milestones.item3.title | page / /about/journey | milestones / OurJourney / milestones.item3 / title | text | editable | "Infrastructure Expansion" | 25 |
| about.journey.milestones.item3.description | page / /about/journey | milestones / OurJourney / milestones.item3 / description | text | editable | "New buildings, classrooms, and facilities were added to accommodate the growing student population." | 26 |
| about.journey.milestones.item3.image | page / /about/journey | milestones / OurJourney / milestones.item3 / image | image | protected | "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop&crop=center" | 28 |
| about.journey.milestones.item4.year | page / /about/journey | milestones / OurJourney / milestones.item4 / year | text | editable | "1975" | 31 |
| about.journey.milestones.item4.title | page / /about/journey | milestones / OurJourney / milestones.item4 / title | text | editable | "Golden Jubilee" | 32 |
| about.journey.milestones.item4.description | page / /about/journey | milestones / OurJourney / milestones.item4 / description | text | editable | "Celebrated 50 years of excellence in education with the entire school community and alumni." | 33 |
| about.journey.milestones.item4.image | page / /about/journey | milestones / OurJourney / milestones.item4 / image | image | protected | "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop&crop=center" | 35 |
| about.journey.milestones.item5.year | page / /about/journey | milestones / OurJourney / milestones.item5 / year | text | editable | "1990" | 38 |
| about.journey.milestones.item5.title | page / /about/journey | milestones / OurJourney / milestones.item5 / title | text | editable | "Computer Education" | 39 |
| about.journey.milestones.item5.description | page / /about/journey | milestones / OurJourney / milestones.item5 / description | text | editable | "Introduced computer science education with state-of-the-art computer labs and IT infrastructure." | 40 |
| about.journey.milestones.item5.image | page / /about/journey | milestones / OurJourney / milestones.item5 / image | image | protected | "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop&crop=center" | 42 |
| about.journey.milestones.item6.year | page / /about/journey | milestones / OurJourney / milestones.item6 / year | text | editable | "2000" | 45 |
| about.journey.milestones.item6.title | page / /about/journey | milestones / OurJourney / milestones.item6 / title | text | editable | "Digital Transformation" | 46 |
| about.journey.milestones.item6.description | page / /about/journey | milestones / OurJourney / milestones.item6 / description | text | editable | "Modernized teaching methods with smart classrooms, digital content, and technology-enabled learning." | 47 |
| about.journey.milestones.item6.image | page / /about/journey | milestones / OurJourney / milestones.item6 / image | image | protected | "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop&crop=center" | 49 |
| about.journey.milestones.item7.year | page / /about/journey | milestones / OurJourney / milestones.item7 / year | text | editable | "2010" | 52 |
| about.journey.milestones.item7.title | page / /about/journey | milestones / OurJourney / milestones.item7 / title | text | editable | "Global Recognition" | 53 |
| about.journey.milestones.item7.description | page / /about/journey | milestones / OurJourney / milestones.item7 / description | text | editable | "St. Mary's achieved recognition as one of the top educational institutions in the region." | 54 |
| about.journey.milestones.item7.image | page / /about/journey | milestones / OurJourney / milestones.item7 / image | image | protected | "https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=400&h=300&fit=crop&crop=center" | 56 |
| about.journey.milestones.item8.year | page / /about/journey | milestones / OurJourney / milestones.item8 / year | text | editable | "2024" | 59 |
| about.journey.milestones.item8.title | page / /about/journey | milestones / OurJourney / milestones.item8 / title | text | editable | "Century Legacy" | 60 |
| about.journey.milestones.item8.description | page / /about/journey | milestones / OurJourney / milestones.item8 / description | text | editable | "Celebrating 100 years of educational excellence, shaping young minds and building a legacy for generations to come." | 61 |
| about.journey.milestones.item8.image | page / /about/journey | milestones / OurJourney / milestones.item8 / image | image | protected | "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop&crop=center" | 63 |
| about.journey.our-journey.text | page / /about/journey | section-1 / OurJourney / our-journey / text | text | editable | "JOURNEY" | 99 |
| about.journey.our-journey.text.2 | page / /about/journey | section-1 / OurJourney / our-journey / text 2 | text | editable | "1924 - 2024" | 113 |
| about.journey.our-journey.heading | page / /about/journey | section-1 / OurJourney / our-journey / heading | text | editable | "Our " | 121 |
| about.journey.our-journey.text.3 | page / /about/journey | section-1 / OurJourney / our-journey / text 3 | text | editable | "Journey" | 122 |
| about.journey.our-journey.paragraph | page / /about/journey | section-1 / OurJourney / our-journey / paragraph | text | editable | "100 years of educational excellence" | 130 |
| about.journey.our-journey.text.4 | page / /about/journey | section-2 / OurJourney / our-journey / text 4 | text | editable | "Our Legacy" | 151 |
| about.journey.our-journey.paragraph.2 | page / /about/journey | section-2 / OurJourney / our-journey / paragraph 2 | text | editable | "Since 1924, St. Mary's Higher Secondary School has been on a remarkable journey of educational excellence. From humble beginnings to becoming a premier institution, our story is one of dedication, growth, and unwavering commitment to quality education." | 153 |
| about.journey.our-journey.text.5 | page / /about/journey | section-3 / OurJourney / our-journey / text 5 | text | protected | "●" | 207 |
| about.journey.our-journey.text.6 | page / /about/journey | section-3 / OurJourney / our-journey / text 6 | text | editable | "Legacy Milestone" | 208 |
| about.journey.our-journey.item1.value | page / /about/journey | section-4 / OurJourney / our-journey.item1 / value | text | editable | "1924" | 232 |
| about.journey.our-journey.item1.label | page / /about/journey | section-4 / OurJourney / our-journey.item1 / label | text | editable | "Founded" | 232 |
| about.journey.our-journey.item2.value | page / /about/journey | section-4 / OurJourney / our-journey.item2 / value | text | editable | "2500+" | 233 |
| about.journey.our-journey.item2.label | page / /about/journey | section-4 / OurJourney / our-journey.item2 / label | text | editable | "Students" | 233 |
| about.journey.our-journey.item3.value | page / /about/journey | section-4 / OurJourney / our-journey.item3 / value | text | editable | "100+" | 234 |
| about.journey.our-journey.item3.label | page / /about/journey | section-4 / OurJourney / our-journey.item3 / label | text | editable | "Awards Won" | 234 |
| about.journey.our-journey.item4.value | page / /about/journey | section-4 / OurJourney / our-journey.item4 / value | text | editable | "50+" | 235 |
| about.journey.our-journey.item4.label | page / /about/journey | section-4 / OurJourney / our-journey.item4 / label | text | editable | "Years Legacy" | 235 |
| about.journey.our-journey.text.7 | page / /about/journey | section-5 / OurJourney / our-journey / text 7 | text | editable | "Continuing the Legacy" | 266 |
| about.journey.our-journey.heading.2 | page / /about/journey | section-5 / OurJourney / our-journey / heading 2 | text | editable | "Join Us in " | 268 |
| about.journey.our-journey.text.8 | page / /about/journey | section-5 / OurJourney / our-journey / text 8 | text | editable | "Shaping the Future" | 269 |
| about.journey.our-journey.paragraph.3 | page / /about/journey | section-5 / OurJourney / our-journey / paragraph 3 | text | editable | "As we celebrate our rich history, we continue to build on our legacy of excellence, nurturing young minds and preparing them for the challenges of tomorrow." | 271 |
| about.journey.our-journey.href | page / /about/journey | section-5 / OurJourney / our-journey / href | url | protected | "/about/founders" | 277 |
| about.journey.our-journey.text.9 | page / /about/journey | section-5 / OurJourney / our-journey / text 9 | text | editable | "Meet Our Founders" | 279 |
| about.journey.our-journey.href.2 | page / /about/journey | section-5 / OurJourney / our-journey / href 2 | url | protected | "/admissions" | 284 |
| about.journey.our-journey.text.10 | page / /about/journey | section-5 / OurJourney / our-journey / text 10 | text | editable | "Join Our Family" | 286 |
| about.journey.our-journey.text.11 | page / /about/journey | section-5 / OurJourney / our-journey / text 11 | text | protected | "→" | 288 |

### src/site-pages/about/Principal.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| about.principal.principals.item1.number | page / /about/principal | principals / Principal / principals.item1 / number | number | editable | 1 | 12 |
| about.principal.principals.item1.name | page / /about/principal | principals / Principal / principals.item1 / name | text | editable | "Sr. Catherine Susngi" | 12 |
| about.principal.principals.item2.number | page / /about/principal | principals / Principal / principals.item2 / number | number | editable | 2 | 13 |
| about.principal.principals.item2.name | page / /about/principal | principals / Principal / principals.item2 / name | text | editable | "Sr. Lydia Dias" | 13 |
| about.principal.principals.item3.number | page / /about/principal | principals / Principal / principals.item3 / number | number | editable | 3 | 14 |
| about.principal.principals.item3.name | page / /about/principal | principals / Principal / principals.item3 / name | text | editable | "Sr. Maria Rodrigues" | 14 |
| about.principal.principals.item4.number | page / /about/principal | principals / Principal / principals.item4 / number | number | editable | 4 | 15 |
| about.principal.principals.item4.name | page / /about/principal | principals / Principal / principals.item4 / name | text | editable | "Sr. Rosy Devassy" | 15 |
| about.principal.principals.item5.number | page / /about/principal | principals / Principal / principals.item5 / number | number | editable | 5 | 16 |
| about.principal.principals.item5.name | page / /about/principal | principals / Principal / principals.item5 / name | text | editable | "Sr. Anna Varkey" | 16 |
| about.principal.principals.item6.number | page / /about/principal | principals / Principal / principals.item6 / number | number | editable | 6 | 17 |
| about.principal.principals.item6.name | page / /about/principal | principals / Principal / principals.item6 / name | text | editable | "Sr. Beatrice Gonsalves" | 17 |
| about.principal.principals.item7.number | page / /about/principal | principals / Principal / principals.item7 / number | number | editable | 7 | 18 |
| about.principal.principals.item7.name | page / /about/principal | principals / Principal / principals.item7 / name | text | editable | "Sr. Mary George" | 18 |
| about.principal.principals.item8.number | page / /about/principal | principals / Principal / principals.item8 / number | number | editable | 8 | 19 |
| about.principal.principals.item8.name | page / /about/principal | principals / Principal / principals.item8 / name | text | editable | "Sr. Bridget Kurian" | 19 |
| about.principal.principals.item9.number | page / /about/principal | principals / Principal / principals.item9 / number | number | editable | 9 | 20 |
| about.principal.principals.item9.name | page / /about/principal | principals / Principal / principals.item9 / name | text | editable | "Sr. Mary Parekatt" | 20 |
| about.principal.principals.item10.number | page / /about/principal | principals / Principal / principals.item10 / number | number | editable | 10 | 21 |
| about.principal.principals.item10.name | page / /about/principal | principals / Principal / principals.item10 / name | text | editable | "Sr. Ivy D'Souza" | 21 |
| about.principal.principals.item11.number | page / /about/principal | principals / Principal / principals.item11 / number | number | editable | 11 | 22 |
| about.principal.principals.item11.name | page / /about/principal | principals / Principal / principals.item11 / name | text | editable | "Sr. Elizabeth Joseph" | 22 |
| about.principal.principals.item12.number | page / /about/principal | principals / Principal / principals.item12 / number | number | editable | 12 | 23 |
| about.principal.principals.item12.name | page / /about/principal | principals / Principal / principals.item12 / name | text | editable | "Sr. Teresa Kurian" | 23 |
| about.principal.principals.item13.number | page / /about/principal | principals / Principal / principals.item13 / number | number | editable | 13 | 24 |
| about.principal.principals.item13.name | page / /about/principal | principals / Principal / principals.item13 / name | text | editable | "Sr. Elizabeth George" | 24 |
| about.principal.principals.item14.number | page / /about/principal | principals / Principal / principals.item14 / number | number | editable | 14 | 25 |
| about.principal.principals.item14.name | page / /about/principal | principals / Principal / principals.item14 / name | text | editable | "Sr. Celine Porinchu" | 25 |
| about.principal.principals.item15.number | page / /about/principal | principals / Principal / principals.item15 / number | number | editable | 15 | 26 |
| about.principal.principals.item15.name | page / /about/principal | principals / Principal / principals.item15 / name | text | editable | "Sr. Catherine Kanannampuzha" | 26 |
| about.principal.principals.item16.number | page / /about/principal | principals / Principal / principals.item16 / number | number | editable | 16 | 27 |
| about.principal.principals.item16.name | page / /about/principal | principals / Principal / principals.item16 / name | text | editable | "Sr. Annie Villuviruthil" | 27 |
| about.principal.principals.item17.number | page / /about/principal | principals / Principal / principals.item17 / number | number | editable | 17 | 28 |
| about.principal.principals.item17.name | page / /about/principal | principals / Principal / principals.item17 / name | text | editable | "Sr. Lucy Nedumala" | 28 |
| about.principal.principals.item18.number | page / /about/principal | principals / Principal / principals.item18 / number | number | editable | 18 | 29 |
| about.principal.principals.item18.name | page / /about/principal | principals / Principal / principals.item18 / name | text | editable | "Sr. Jessy Nedumala" | 29 |
| about.principal.principals.item19.number | page / /about/principal | principals / Principal / principals.item19 / number | number | editable | 19 | 30 |
| about.principal.principals.item19.name | page / /about/principal | principals / Principal / principals.item19 / name | text | editable | "Sr. (Dr) Molly Kaniampadickal" | 30 |
| about.principal.principals.item20.number | page / /about/principal | principals / Principal / principals.item20 / number | number | editable | 20 | 31 |
| about.principal.principals.item20.name | page / /about/principal | principals / Principal / principals.item20 / name | text | editable | "Sr. Kathreena Kannapuzha" | 31 |
| about.principal.principals.item21.number | page / /about/principal | principals / Principal / principals.item21 / number | number | editable | 21 | 32 |
| about.principal.principals.item21.name | page / /about/principal | principals / Principal / principals.item21 / name | text | editable | "Sr. Tessy Davis" | 32 |
| about.principal.principal.text | page / /about/principal | section-1 / Principal / principal / text | text | editable | "PRINCIPALS" | 61 |
| about.principal.principal.text.2 | page / /about/principal | section-1 / Principal / principal / text 2 | text | editable | "Leadership Legacy" | 75 |
| about.principal.principal.heading | page / /about/principal | section-1 / Principal / principal / heading | text | editable | "Headmistresses / " | 83 |
| about.principal.principal.text.3 | page / /about/principal | section-1 / Principal / principal / text 3 | text | editable | "Principals" | 84 |
| about.principal.principal.paragraph | page / /about/principal | section-1 / Principal / principal / paragraph | text | editable | "Our esteemed leaders through the years" | 92 |
| about.principal.principal.text.4 | page / /about/principal | section-2 / Principal / principal / text 4 | text | editable | "Our Leadership" | 114 |
| about.principal.principal.paragraph.2 | page / /about/principal | section-2 / Principal / principal / paragraph 2 | text | editable | "St. Mary's Higher Secondary School has been blessed with visionary leaders who have guided the institution with wisdom, dedication, and grace. Here is the complete list of Headmistresses and Principals who have shaped our school's legacy." | 116 |
| about.principal.principal.text.5 | page / /about/principal | section-3 / Principal / principal / text 5 | text | editable | "Headmistress / Principal #" | 145 |
| about.principal.principal.paragraph.3 | page / /about/principal | section-3 / Principal / principal / paragraph 3 | text | editable | "St. Mary's Higher Secondary School" | 151 |
| about.principal.principal.text.6 | page / /about/principal | section-3 / Principal / principal / text 6 | text | editable | "Visionary Leader" | 156 |
| about.principal.principal.text.7 | page / /about/principal | section-3 / Principal / principal / text 7 | text | editable | "Dedicated Service" | 160 |
| about.principal.principal.text.8 | page / /about/principal | section-3 / Principal / principal / text 8 | text | editable | "Legacy Builder" | 164 |
| about.principal.principal.text.9 | page / /about/principal | section-3 / Principal / principal / text 9 | text | editable | " of " | 203 |
| about.principal.principal.heading.2 | page / /about/principal | section-3 / Principal / principal / heading 2 | text | editable | "Complete List of Headmistresses / Principals" | 212 |
| about.principal.principal.paragraph.4 | page / /about/principal | section-3 / Principal / principal / paragraph 4 | text | editable | "Celebrating 21 years of leadership legacy" | 215 |
| about.principal.principal.text.10 | page / /about/principal | section-3 / Principal / principal / text 10 | text | editable | "Our Legacy" | 255 |
| about.principal.principal.paragraph.5 | page / /about/principal | section-3 / Principal / principal / paragraph 5 | text | editable | "These remarkable leaders have dedicated their lives to the growth and excellence of St. Mary's Higher Secondary School. Their vision, wisdom, and unwavering commitment have shaped generations of students and built the foundation of our institution's success." | 258 |
| about.principal.principal.text.11 | page / /about/principal | section-3 / Principal / principal / text 11 | text | editable | "21 Leaders" | 266 |
| about.principal.principal.text.12 | page / /about/principal | section-3 / Principal / principal / text 12 | text | editable | "Decades of Service" | 270 |
| about.principal.principal.text.13 | page / /about/principal | section-3 / Principal / principal / text 13 | text | editable | "Legacy of Excellence" | 274 |

### src/site-pages/about/Superiors.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| about.superiors.superiors-list.item1.name | page / /about/superiors | superiors-list / Superiors / superiors-list.item1 / name | text | editable | "Sr. Innocenza Vallino" | 10 |
| about.superiors.superiors-list.item2.name | page / /about/superiors | superiors-list / Superiors / superiors-list.item2 / name | text | editable | "Sr. Maria Avio" | 11 |
| about.superiors.superiors-list.item3.name | page / /about/superiors | superiors-list / Superiors / superiors-list.item3 / name | text | editable | "Sr. Clotilde Appiano" | 12 |
| about.superiors.superiors-list.item4.name | page / /about/superiors | superiors-list / Superiors / superiors-list.item4 / name | text | editable | "Sr. Luigina Saletta" | 13 |
| about.superiors.superiors-list.item5.name | page / /about/superiors | superiors-list / Superiors / superiors-list.item5 / name | text | editable | "Sr. Clotilde Appiano" | 14 |
| about.superiors.superiors-list.item6.name | page / /about/superiors | superiors-list / Superiors / superiors-list.item6 / name | text | editable | "Sr. Teresa Villa" | 15 |
| about.superiors.superiors-list.item7.name | page / /about/superiors | superiors-list / Superiors / superiors-list.item7 / name | text | editable | "Sr. Francesca Martina" | 16 |
| about.superiors.superiors-list.item8.name | page / /about/superiors | superiors-list / Superiors / superiors-list.item8 / name | text | editable | "Sr. Severina Schiapparelli" | 17 |
| about.superiors.superiors-list.item9.name | page / /about/superiors | superiors-list / Superiors / superiors-list.item9 / name | text | editable | "Sr. Clotilde Appiano" | 18 |
| about.superiors.superiors-list.item10.name | page / /about/superiors | superiors-list / Superiors / superiors-list.item10 / name | text | editable | "Sr. Cleofe Fassa" | 19 |
| about.superiors.superiors-list.item11.name | page / /about/superiors | superiors-list / Superiors / superiors-list.item11 / name | text | editable | "Sr. Margaret Greppi" | 20 |
| about.superiors.superiors-list.item12.name | page / /about/superiors | superiors-list / Superiors / superiors-list.item12 / name | text | editable | "Sr. Lydia Dias" | 21 |
| about.superiors.superiors-list.item13.name | page / /about/superiors | superiors-list / Superiors / superiors-list.item13 / name | text | editable | "Sr. Rosy Devassy" | 22 |
| about.superiors.superiors-list.item14.name | page / /about/superiors | superiors-list / Superiors / superiors-list.item14 / name | text | editable | "Sr. Margaret Greppi" | 23 |
| about.superiors.superiors-list.item15.name | page / /about/superiors | superiors-list / Superiors / superiors-list.item15 / name | text | editable | "Sr. Rosy Devassy" | 24 |
| about.superiors.superiors-list.item16.name | page / /about/superiors | superiors-list / Superiors / superiors-list.item16 / name | text | editable | "Sr. Mary Mampilly" | 25 |
| about.superiors.superiors-list.item17.name | page / /about/superiors | superiors-list / Superiors / superiors-list.item17 / name | text | editable | "Sr. Celine Michael" | 26 |
| about.superiors.superiors-list.item18.name | page / /about/superiors | superiors-list / Superiors / superiors-list.item18 / name | text | editable | "Sr. Annie Adichirayil" | 27 |
| about.superiors.superiors-list.item19.name | page / /about/superiors | superiors-list / Superiors / superiors-list.item19 / name | text | editable | "Sr. Alphonsa Kurisinkal" | 28 |
| about.superiors.superiors-list.item20.name | page / /about/superiors | superiors-list / Superiors / superiors-list.item20 / name | text | editable | "Sr. Lucy Rose Ozhukayil" | 29 |
| about.superiors.superiors-list.item21.name | page / /about/superiors | superiors-list / Superiors / superiors-list.item21 / name | text | editable | "Sr. Grace Ottalankal" | 30 |
| about.superiors.superiors-list.item22.name | page / /about/superiors | superiors-list / Superiors / superiors-list.item22 / name | text | editable | "Sr. Bridget Chittappanattu" | 31 |
| about.superiors.superiors.text | page / /about/superiors | section-1 / Superiors / superiors / text | text | editable | "SUPERIORS" | 68 |
| about.superiors.superiors.text.2 | page / /about/superiors | section-1 / Superiors / superiors / text 2 | text | editable | "Our Leadership" | 82 |
| about.superiors.superiors.heading | page / /about/superiors | section-1 / Superiors / superiors / heading | text | editable | "Our " | 90 |
| about.superiors.superiors.text.3 | page / /about/superiors | section-1 / Superiors / superiors / text 3 | text | editable | "Superiors" | 91 |
| about.superiors.superiors.paragraph | page / /about/superiors | section-1 / Superiors / superiors / paragraph | text | editable | "Spiritual & administrative leadership guiding our institution" | 99 |
| about.superiors.superiors.text.4 | page / /about/superiors | section-2 / Superiors / superiors / text 4 | text | editable | "Our Superiors" | 121 |
| about.superiors.superiors.paragraph.2 | page / /about/superiors | section-2 / Superiors / superiors / paragraph 2 | text | editable | "Our superiors provide the spiritual and administrative guidance that keeps our institution aligned with its founding vision and values." | 123 |
| about.superiors.superiors.heading.2 | page / /about/superiors | section-3 / Superiors / superiors / heading 2 | text | editable | "Spiritual & Administrative " | 135 |
| about.superiors.superiors.text.5 | page / /about/superiors | section-3 / Superiors / superiors / text 5 | text | editable | "Leadership" | 136 |
| about.superiors.superiors.text.6 | page / /about/superiors | section-3 / Superiors / superiors / text 6 | text | editable | "Superiors" | 191 |
| about.superiors.superiors.text.7 | page / /about/superiors | section-3 / Superiors / superiors / text 7 | text | editable | "Serving with " | 195 |
| about.superiors.superiors.text.8 | page / /about/superiors | section-3 / Superiors / superiors / text 8 | text | protected | "❤️" | 196 |
| about.superiors.superiors.text.9 | page / /about/superiors | section-3 / Superiors / superiors / text 9 | text | editable | " and dedication" | 196 |

### src/site-pages/academics/Evaluation.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| academics.evaluation.evaluation-details.item1.title | page / /academics/evaluation | evaluation-details / Evaluation / evaluation-details.item1 / title | text | editable | "Continuous Assessment (CA)" | 12 |
| academics.evaluation.evaluation-details.item1.content | page / /academics/evaluation | evaluation-details / Evaluation / evaluation-details.item1 / content | text | editable | "Contineous assessment consists of various projects assignment and co-curricular activities taken part by the student throughout the academic year" | 13 |
| academics.evaluation.evaluation-details.item2.title | page / /academics/evaluation | evaluation-details / Evaluation / evaluation-details.item2 / title | text | editable | "Unit-Test-One" | 16 |
| academics.evaluation.evaluation-details.item2.content | page / /academics/evaluation | evaluation-details / Evaluation / evaluation-details.item2 / content | text | editable | "The unit test one examination is conducted in the month of june out of 50 marks." | 17 |
| academics.evaluation.evaluation-details.item3.title | page / /academics/evaluation | evaluation-details / Evaluation / evaluation-details.item3 / title | text | editable | "Half yearly examination" | 20 |
| academics.evaluation.evaluation-details.item3.content | page / /academics/evaluation | evaluation-details / Evaluation / evaluation-details.item3 / content | text | editable | "The half yearly examination is conducted in the month of September/October. The examination is being conducted out of 100 marks." | 21 |
| academics.evaluation.evaluation-details.item4.title | page / /academics/evaluation | evaluation-details / Evaluation / evaluation-details.item4 / title | text | editable | "Unit-test-two" | 24 |
| academics.evaluation.evaluation-details.item4.content | page / /academics/evaluation | evaluation-details / Evaluation / evaluation-details.item4 / content | text | editable | "The unit test one examination is conducted in the month of December out of 50 marks." | 25 |
| academics.evaluation.evaluation-details.item5.title | page / /academics/evaluation | evaluation-details / Evaluation / evaluation-details.item5 / title | text | editable | "Annual examination" | 28 |
| academics.evaluation.evaluation-details.item5.content | page / /academics/evaluation | evaluation-details / Evaluation / evaluation-details.item5 / content | text | editable | "The Annual examination is conducted in the month of mid Feb to march , out of 100 marks" | 29 |
| academics.evaluation.assessment-types.item1.title | page / /academics/evaluation | assessment-types / Evaluation / assessment-types.item1 / title | text | editable | "Formative Assessment" | 35 |
| academics.evaluation.assessment-types.item1.description | page / /academics/evaluation | assessment-types / Evaluation / assessment-types.item1 / description | text | editable | "Conducted throughout the academic session through observations, worksheets, quizzes, and class activities to monitor day-to-day learning progress." | 36 |
| academics.evaluation.assessment-types.item2.title | page / /academics/evaluation | assessment-types / Evaluation / assessment-types.item2 / title | text | editable | "Summative Assessment" | 39 |
| academics.evaluation.assessment-types.item2.description | page / /academics/evaluation | assessment-types / Evaluation / assessment-types.item2 / description | text | editable | "End-term evaluations that test the cumulative knowledge and understanding of the subjects covered during the academic period." | 40 |
| academics.evaluation.assessment-types.item3.title | page / /academics/evaluation | assessment-types / Evaluation / assessment-types.item3 / title | text | editable | "Practical Assessment" | 43 |
| academics.evaluation.assessment-types.item3.description | page / /academics/evaluation | assessment-types / Evaluation / assessment-types.item3 / description | text | editable | "For subjects like Science, Computer Science, and AI, practical assessments evaluate hands-on skills, experimentation, and application of concepts." | 44 |
| academics.evaluation.evaluation.text | page / /academics/evaluation | section-1 / Evaluation / evaluation / text | text | editable | "EVALUATION" | 60 |
| academics.evaluation.evaluation.text.2 | page / /academics/evaluation | section-1 / Evaluation / evaluation / text 2 | text | editable | "Assessment" | 74 |
| academics.evaluation.evaluation.heading | page / /academics/evaluation | section-1 / Evaluation / evaluation / heading | text | editable | "Evaluation of " | 82 |
| academics.evaluation.evaluation.text.3 | page / /academics/evaluation | section-1 / Evaluation / evaluation / text 3 | text | editable | "Examination" | 83 |
| academics.evaluation.evaluation.paragraph | page / /academics/evaluation | section-1 / Evaluation / evaluation / paragraph | text | editable | "Understanding our assessment system" | 91 |
| academics.evaluation.evaluation.text.4 | page / /academics/evaluation | section-2 / Evaluation / evaluation / text 4 | text | editable | "Assessment System" | 113 |
| academics.evaluation.evaluation.paragraph.2 | page / /academics/evaluation | section-2 / Evaluation / evaluation / paragraph 2 | text | editable | "At St. Mary's, we follow a comprehensive evaluation system designed to assess students' knowledge, understanding, and application skills effectively." | 115 |
| academics.evaluation.evaluation.heading.2 | page / /academics/evaluation | section-3 / Evaluation / evaluation / heading 2 | text | editable | "Detailed Evaluation Structure" | 159 |
| academics.evaluation.evaluation.heading.3 | page / /academics/evaluation | section-3 / Evaluation / evaluation / heading 3 | text | editable | "Assessment Weightage Distribution" | 175 |
| academics.evaluation.evaluation.text.5 | page / /academics/evaluation | section-3 / Evaluation / evaluation / text 5 | text | editable | "20%" | 180 |
| academics.evaluation.evaluation.paragraph.3 | page / /academics/evaluation | section-3 / Evaluation / evaluation / paragraph 3 | text | editable | "Continuous Assessment" | 181 |
| academics.evaluation.evaluation.text.6 | page / /academics/evaluation | section-3 / Evaluation / evaluation / text 6 | text | editable | "30%" | 184 |
| academics.evaluation.evaluation.paragraph.4 | page / /academics/evaluation | section-3 / Evaluation / evaluation / paragraph 4 | text | editable | "Half-Yearly" | 185 |
| academics.evaluation.evaluation.text.7 | page / /academics/evaluation | section-3 / Evaluation / evaluation / text 7 | text | editable | "50%" | 188 |
| academics.evaluation.evaluation.paragraph.5 | page / /academics/evaluation | section-3 / Evaluation / evaluation / paragraph 5 | text | editable | "Annual Examination" | 189 |
| academics.evaluation.evaluation.text.8 | page / /academics/evaluation | section-3 / Evaluation / evaluation / text 8 | text | editable | "100%" | 192 |
| academics.evaluation.evaluation.paragraph.6 | page / /academics/evaluation | section-3 / Evaluation / evaluation / paragraph 6 | text | editable | "Total Marks" | 193 |

### src/site-pages/academics/Syllabus.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| academics.syllabus.stream-options.item1.value | page / /academics/syllabus | stream-options / Syllabus / stream-options.item1 / value | text | protected | "arts" | 22 |
| academics.syllabus.stream-options.item1.label | page / /academics/syllabus | stream-options / Syllabus / stream-options.item1 / label | text | editable | "Arts" | 22 |
| academics.syllabus.stream-options.item2.value | page / /academics/syllabus | stream-options / Syllabus / stream-options.item2 / value | text | protected | "science" | 23 |
| academics.syllabus.stream-options.item2.label | page / /academics/syllabus | stream-options / Syllabus / stream-options.item2 / label | text | editable | "Science" | 23 |
| academics.syllabus.stream-options.item3.value | page / /academics/syllabus | stream-options / Syllabus / stream-options.item3 / value | text | protected | "commerce" | 24 |
| academics.syllabus.stream-options.item3.label | page / /academics/syllabus | stream-options / Syllabus / stream-options.item3 / label | text | editable | "Commerce" | 24 |
| academics.syllabus.syllabus-public.text | page / /academics/syllabus | section-1 / Syllabus / syllabus-public / text | text | editable | "SYLLABUS" | 130 |
| academics.syllabus.syllabus-public.text.2 | page / /academics/syllabus | section-1 / Syllabus / syllabus-public / text 2 | text | editable | "Curriculum" | 144 |
| academics.syllabus.syllabus-public.heading | page / /academics/syllabus | section-1 / Syllabus / syllabus-public / heading | text | editable | "Our " | 152 |
| academics.syllabus.syllabus-public.text.3 | page / /academics/syllabus | section-1 / Syllabus / syllabus-public / text 3 | text | editable | "Syllabus" | 153 |
| academics.syllabus.syllabus-public.paragraph | page / /academics/syllabus | section-1 / Syllabus / syllabus-public / paragraph | text | editable | "Class-wise curriculum overview" | 161 |
| academics.syllabus.syllabus-public.text.4 | page / /academics/syllabus | section-2 / Syllabus / syllabus-public / text 4 | text | editable | "Academic Year" | 176 |
| academics.syllabus.syllabus-public.text.5 | page / /academics/syllabus | section-2 / Syllabus / syllabus-public / text 5 | text | editable | "Class" | 192 |
| academics.syllabus.syllabus-public.text.6 | page / /academics/syllabus | section-2 / Syllabus / syllabus-public / text 6 | text | editable | "Class " | 201 |
| academics.syllabus.syllabus-public.text.7 | page / /academics/syllabus | section-2 / Syllabus / syllabus-public / text 7 | text | editable | "Stream" | 209 |
| academics.syllabus.syllabus-public.heading.2 | page / /academics/syllabus | section-3 / Syllabus / syllabus-public / heading 2 | text | editable | "No syllabus found" | 237 |
| academics.syllabus.syllabus-public.paragraph.2 | page / /academics/syllabus | section-3 / Syllabus / syllabus-public / paragraph 2 | text | editable | "No syllabus available for " | 238 |
| academics.syllabus.syllabus-public.paragraph.3 | page / /academics/syllabus | section-3 / Syllabus / syllabus-public / paragraph 3 | text | editable | " - Class " | 239 |
| academics.syllabus.syllabus-public.paragraph.4 | page / /academics/syllabus | section-3 / Syllabus / syllabus-public / paragraph 4 | text | protected | " - " | 240 |
| academics.syllabus.syllabus-public.paragraph.5 | page / /academics/syllabus | section-3 / Syllabus / syllabus-public / paragraph 5 | text | editable | "Showing " | 246 |
| academics.syllabus.syllabus-public.paragraph.6 | page / /academics/syllabus | section-3 / Syllabus / syllabus-public / paragraph 6 | text | editable | " syllabus entries" | 247 |
| academics.syllabus.syllabus-public.text.8 | page / /academics/syllabus | section-3 / Syllabus / syllabus-public / text 8 | text | editable | " · Class " | 250 |
| academics.syllabus.syllabus-public.text.9 | page / /academics/syllabus | section-3 / Syllabus / syllabus-public / text 9 | text | protected | " · " | 251 |
| academics.syllabus.syllabus-public.text.10 | page / /academics/syllabus | section-3 / Syllabus / syllabus-public / text 10 | text | editable | "Class " | 271 |
| academics.syllabus.syllabus-public.text.11 | page / /academics/syllabus | section-3 / Syllabus / syllabus-public / text 11 | text | editable | "View PDF" | 287 |
| academics.syllabus.syllabus-public.paragraph.7 | page / /academics/syllabus | section-3 / Syllabus / syllabus-public / paragraph 7 | text | editable | "Uploaded: " | 292 |

### src/site-pages/administration/Management.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| administration.management.management.text | page / /administration/management | section-1 / Management / management / text | text | editable | "MANAGEMENT" | 35 |
| administration.management.management.text.2 | page / /administration/management | section-1 / Management / management / text 2 | text | editable | "Our Leadership" | 49 |
| administration.management.management.heading | page / /administration/management | section-1 / Management / management / heading | text | editable | "Our " | 57 |
| administration.management.management.text.3 | page / /administration/management | section-1 / Management / management / text 3 | text | editable | "Management" | 58 |
| administration.management.management.paragraph | page / /administration/management | section-1 / Management / management / paragraph | text | editable | "Dedicated leadership team guiding our institution" | 66 |
| administration.management.management.text.4 | page / /administration/management | section-2 / Management / management / text 4 | text | editable | "Our Leaders" | 88 |
| administration.management.management.paragraph.2 | page / /administration/management | section-2 / Management / management / paragraph 2 | text | editable | "Our management team consists of dedicated professionals committed to providing the best educational experience for our students." | 90 |
| administration.management.management.heading.2 | page / /administration/management | section-3 / Management / management / heading 2 | text | editable | "Dedicated " | 103 |
| administration.management.management.text.5 | page / /administration/management | section-3 / Management / management / text 5 | text | editable | "Management" | 104 |
| administration.management.management.heading.3 | page / /administration/management | section-3 / Management / management / heading 3 | text | editable | " Team" | 104 |
| administration.management.management.heading.4 | page / /administration/management | section-3 / Management / management / heading 4 | text | editable | "Coming Soon" | 143 |
| administration.management.management.paragraph.3 | page / /administration/management | section-3 / Management / management / paragraph 3 | text | editable | "We are currently updating our management team details. Please check back later for the complete list of our dedicated leadership team." | 151 |
| administration.management.management.paragraph.4 | page / /administration/management | section-3 / Management / management / paragraph 4 | text | editable | "Team Members" | 161 |
| administration.management.management.paragraph.5 | page / /administration/management | section-3 / Management / management / paragraph 5 | text | protected | "—" | 162 |
| administration.management.management.paragraph.6 | page / /administration/management | section-3 / Management / management / paragraph 6 | text | editable | "Years of Service" | 166 |
| administration.management.management.paragraph.7 | page / /administration/management | section-3 / Management / management / paragraph 7 | text | protected | "—" | 167 |
| administration.management.management.paragraph.8 | page / /administration/management | section-3 / Management / management / paragraph 8 | text | editable | "Management details will be available soon" | 172 |

### src/site-pages/administration/NonTeachingStaff.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| administration.non.teaching.non-teaching-staff.text | page / /administration/non-teaching | section-1 / NonTeachingStaff / non-teaching-staff / text | text | editable | "SUPPORT" | 35 |
| administration.non.teaching.non-teaching-staff.text.2 | page / /administration/non-teaching | section-1 / NonTeachingStaff / non-teaching-staff / text 2 | text | editable | "Support Team" | 49 |
| administration.non.teaching.non-teaching-staff.heading | page / /administration/non-teaching | section-1 / NonTeachingStaff / non-teaching-staff / heading | text | editable | "Non-Teaching " | 57 |
| administration.non.teaching.non-teaching-staff.text.3 | page / /administration/non-teaching | section-1 / NonTeachingStaff / non-teaching-staff / text 3 | text | editable | "Staff" | 58 |
| administration.non.teaching.non-teaching-staff.paragraph | page / /administration/non-teaching | section-1 / NonTeachingStaff / non-teaching-staff / paragraph | text | editable | "The dedicated support team behind our success" | 66 |
| administration.non.teaching.non-teaching-staff.text.4 | page / /administration/non-teaching | section-2 / NonTeachingStaff / non-teaching-staff / text 4 | text | editable | "Support Staff" | 88 |
| administration.non.teaching.non-teaching-staff.paragraph.2 | page / /administration/non-teaching | section-2 / NonTeachingStaff / non-teaching-staff / paragraph 2 | text | editable | "Our dedicated non-teaching staff plays a crucial role in the smooth functioning of the school, supporting teachers and students in every possible way." | 90 |
| administration.non.teaching.non-teaching-staff.heading.2 | page / /administration/non-teaching | section-3 / NonTeachingStaff / non-teaching-staff / heading 2 | text | editable | "Dedicated " | 103 |
| administration.non.teaching.non-teaching-staff.text.5 | page / /administration/non-teaching | section-3 / NonTeachingStaff / non-teaching-staff / text 5 | text | editable | "Non-Teaching" | 104 |
| administration.non.teaching.non-teaching-staff.heading.3 | page / /administration/non-teaching | section-3 / NonTeachingStaff / non-teaching-staff / heading 3 | text | editable | " Staff" | 104 |
| administration.non.teaching.non-teaching-staff.heading.4 | page / /administration/non-teaching | section-3 / NonTeachingStaff / non-teaching-staff / heading 4 | text | editable | "Staff List Coming Soon" | 137 |
| administration.non.teaching.non-teaching-staff.paragraph.3 | page / /administration/non-teaching | section-3 / NonTeachingStaff / non-teaching-staff / paragraph 3 | text | editable | "We are currently updating our non-teaching staff details. Please check back later." | 141 |

### src/site-pages/administration/teaching-staff/HighSchool.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| administration.teaching.staff.high.high-school.text | page / /administration/teaching-staff/high | section-1 / HighSchool / high-school / text | text | editable | "HIGH" | 35 |
| administration.teaching.staff.high.high-school.text.2 | page / /administration/teaching-staff/high | section-1 / HighSchool / high-school / text 2 | text | editable | "Class 9" | 49 |
| administration.teaching.staff.high.high-school.heading | page / /administration/teaching-staff/high | section-1 / HighSchool / high-school / heading | text | editable | "High " | 57 |
| administration.teaching.staff.high.high-school.text.3 | page / /administration/teaching-staff/high | section-1 / HighSchool / high-school / text 3 | text | editable | "School Staff" | 58 |
| administration.teaching.staff.high.high-school.paragraph | page / /administration/teaching-staff/high | section-1 / HighSchool / high-school / paragraph | text | editable | "Expert teachers preparing students for excellence" | 66 |
| administration.teaching.staff.high.high-school.text.4 | page / /administration/teaching-staff/high | section-2 / HighSchool / high-school / text 4 | text | editable | "High Section" | 88 |
| administration.teaching.staff.high.high-school.paragraph.2 | page / /administration/teaching-staff/high | section-2 / HighSchool / high-school / paragraph 2 | text | editable | "Expert teachers preparing students for board examinations and higher studies, equipping them with the knowledge and skills for future success." | 90 |
| administration.teaching.staff.high.high-school.heading.2 | page / /administration/teaching-staff/high | section-3 / HighSchool / high-school / heading 2 | text | editable | "Dedicated " | 103 |
| administration.teaching.staff.high.high-school.text.5 | page / /administration/teaching-staff/high | section-3 / HighSchool / high-school / text 5 | text | editable | "High School" | 104 |
| administration.teaching.staff.high.high-school.heading.3 | page / /administration/teaching-staff/high | section-3 / HighSchool / high-school / heading 3 | text | editable | " Teachers" | 104 |
| administration.teaching.staff.high.high-school.heading.4 | page / /administration/teaching-staff/high | section-3 / HighSchool / high-school / heading 4 | text | editable | "Staff List Coming Soon" | 137 |
| administration.teaching.staff.high.high-school.paragraph.3 | page / /administration/teaching-staff/high | section-3 / HighSchool / high-school / paragraph 3 | text | editable | "We are currently updating our high school staff details. Please check back later." | 141 |

### src/site-pages/administration/teaching-staff/HigherSecondery.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| administration.teaching.staff.higher.secondary.higher-secondary.text | page / /administration/teaching-staff/higher-secondary | section-1 / HigherSecondery / higher-secondary / text | text | editable | "HIGHER SEC" | 35 |
| administration.teaching.staff.higher.secondary.higher-secondary.text.2 | page / /administration/teaching-staff/higher-secondary | section-1 / HigherSecondery / higher-secondary / text 2 | text | editable | "Class 10" | 49 |
| administration.teaching.staff.higher.secondary.higher-secondary.heading | page / /administration/teaching-staff/higher-secondary | section-1 / HigherSecondery / higher-secondary / heading | text | editable | "Higher " | 57 |
| administration.teaching.staff.higher.secondary.higher-secondary.text.3 | page / /administration/teaching-staff/higher-secondary | section-1 / HigherSecondery / higher-secondary / text 3 | text | editable | "Secondary Staff" | 58 |
| administration.teaching.staff.higher.secondary.higher-secondary.paragraph | page / /administration/teaching-staff/higher-secondary | section-1 / HigherSecondery / higher-secondary / paragraph | text | editable | "Experienced subject specialists guiding board preparation" | 66 |
| administration.teaching.staff.higher.secondary.higher-secondary.text.4 | page / /administration/teaching-staff/higher-secondary | section-2 / HigherSecondery / higher-secondary / text 4 | text | editable | "Higher Secondary" | 88 |
| administration.teaching.staff.higher.secondary.higher-secondary.paragraph.2 | page / /administration/teaching-staff/higher-secondary | section-2 / HigherSecondery / higher-secondary / paragraph 2 | text | editable | "Experienced subject specialists guiding students through board preparation, ensuring academic excellence and career readiness." | 90 |
| administration.teaching.staff.higher.secondary.higher-secondary.heading.2 | page / /administration/teaching-staff/higher-secondary | section-3 / HigherSecondery / higher-secondary / heading 2 | text | editable | "Dedicated " | 103 |
| administration.teaching.staff.higher.secondary.higher-secondary.text.5 | page / /administration/teaching-staff/higher-secondary | section-3 / HigherSecondery / higher-secondary / text 5 | text | editable | "Higher Secondary" | 104 |
| administration.teaching.staff.higher.secondary.higher-secondary.heading.3 | page / /administration/teaching-staff/higher-secondary | section-3 / HigherSecondery / higher-secondary / heading 3 | text | editable | " Teachers" | 104 |
| administration.teaching.staff.higher.secondary.higher-secondary.heading.4 | page / /administration/teaching-staff/higher-secondary | section-3 / HigherSecondery / higher-secondary / heading 4 | text | editable | "Staff List Coming Soon" | 137 |
| administration.teaching.staff.higher.secondary.higher-secondary.paragraph.3 | page / /administration/teaching-staff/higher-secondary | section-3 / HigherSecondery / higher-secondary / paragraph 3 | text | editable | "We are currently updating our higher secondary staff details. Please check back later." | 141 |

### src/site-pages/administration/teaching-staff/MiddleSchool.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| administration.teaching.staff.middle.middle-school.text | page / /administration/teaching-staff/middle | section-1 / MiddleSchool / middle-school / text | text | editable | "MIDDLE" | 35 |
| administration.teaching.staff.middle.middle-school.text.2 | page / /administration/teaching-staff/middle | section-1 / MiddleSchool / middle-school / text 2 | text | editable | "Classes 7-8" | 49 |
| administration.teaching.staff.middle.middle-school.heading | page / /administration/teaching-staff/middle | section-1 / MiddleSchool / middle-school / heading | text | editable | "Middle " | 57 |
| administration.teaching.staff.middle.middle-school.text.3 | page / /administration/teaching-staff/middle | section-1 / MiddleSchool / middle-school / text 3 | text | editable | "School Staff" | 58 |
| administration.teaching.staff.middle.middle-school.paragraph | page / /administration/teaching-staff/middle | section-1 / MiddleSchool / middle-school / paragraph | text | editable | "Experienced educators guiding young minds" | 66 |
| administration.teaching.staff.middle.middle-school.text.4 | page / /administration/teaching-staff/middle | section-2 / MiddleSchool / middle-school / text 4 | text | editable | "Middle Section" | 88 |
| administration.teaching.staff.middle.middle-school.paragraph.2 | page / /administration/teaching-staff/middle | section-2 / MiddleSchool / middle-school / paragraph 2 | text | editable | "Experienced educators who guide students through their critical middle school years, preparing them for the challenges of higher education." | 90 |
| administration.teaching.staff.middle.middle-school.heading.2 | page / /administration/teaching-staff/middle | section-3 / MiddleSchool / middle-school / heading 2 | text | editable | "Dedicated " | 103 |
| administration.teaching.staff.middle.middle-school.text.5 | page / /administration/teaching-staff/middle | section-3 / MiddleSchool / middle-school / text 5 | text | editable | "Middle" | 104 |
| administration.teaching.staff.middle.middle-school.heading.3 | page / /administration/teaching-staff/middle | section-3 / MiddleSchool / middle-school / heading 3 | text | editable | " Teachers" | 104 |
| administration.teaching.staff.middle.middle-school.heading.4 | page / /administration/teaching-staff/middle | section-3 / MiddleSchool / middle-school / heading 4 | text | editable | "Staff List Coming Soon" | 137 |
| administration.teaching.staff.middle.middle-school.paragraph.3 | page / /administration/teaching-staff/middle | section-3 / MiddleSchool / middle-school / paragraph 3 | text | editable | "We are currently updating our middle school staff details. Please check back later." | 141 |

### src/site-pages/administration/teaching-staff/PrimarySchool.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| administration.teaching.staff.primary.primary-school.text | page / /administration/teaching-staff/primary | section-1 / PrimarySchool / primary-school / text | text | editable | "PRIMARY" | 35 |
| administration.teaching.staff.primary.primary-school.text.2 | page / /administration/teaching-staff/primary | section-1 / PrimarySchool / primary-school / text 2 | text | editable | "Classes 5-6" | 49 |
| administration.teaching.staff.primary.primary-school.heading | page / /administration/teaching-staff/primary | section-1 / PrimarySchool / primary-school / heading | text | editable | "Primary " | 57 |
| administration.teaching.staff.primary.primary-school.text.3 | page / /administration/teaching-staff/primary | section-1 / PrimarySchool / primary-school / text 3 | text | editable | "School Staff" | 58 |
| administration.teaching.staff.primary.primary-school.paragraph | page / /administration/teaching-staff/primary | section-1 / PrimarySchool / primary-school / paragraph | text | editable | "Dedicated teachers nurturing young minds" | 66 |
| administration.teaching.staff.primary.primary-school.text.4 | page / /administration/teaching-staff/primary | section-2 / PrimarySchool / primary-school / text 4 | text | editable | "Primary Section" | 88 |
| administration.teaching.staff.primary.primary-school.paragraph.2 | page / /administration/teaching-staff/primary | section-2 / PrimarySchool / primary-school / paragraph 2 | text | editable | "Dedicated teachers who nurture and guide students in their formative years, building a strong foundation for their educational journey." | 90 |
| administration.teaching.staff.primary.primary-school.heading.2 | page / /administration/teaching-staff/primary | section-3 / PrimarySchool / primary-school / heading 2 | text | editable | "Dedicated " | 103 |
| administration.teaching.staff.primary.primary-school.text.5 | page / /administration/teaching-staff/primary | section-3 / PrimarySchool / primary-school / text 5 | text | editable | "Primary" | 104 |
| administration.teaching.staff.primary.primary-school.heading.3 | page / /administration/teaching-staff/primary | section-3 / PrimarySchool / primary-school / heading 3 | text | editable | " Teachers" | 104 |
| administration.teaching.staff.primary.primary-school.heading.4 | page / /administration/teaching-staff/primary | section-3 / PrimarySchool / primary-school / heading 4 | text | editable | "Staff List Coming Soon" | 137 |
| administration.teaching.staff.primary.primary-school.paragraph.3 | page / /administration/teaching-staff/primary | section-3 / PrimarySchool / primary-school / paragraph 3 | text | editable | "We are currently updating our primary school staff details. Please check back later." | 141 |

### src/site-pages/admissions/Admission.jsx

Audience: public, dormant-source.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| admissions.faq-items.item1.title | page / /admissions | faq-items / Admission / faq-items.item1 / title | text | editable | "What is the admission process?" | 404 |
| admissions.faq-items.item1.content | page / /admissions | faq-items / Admission / faq-items.item1 / content | text | editable | "The admission process includes filling out the application form, submission of required documents, and an entrance test (if applicable). Contact the school office for more details." | 405 |
| admissions.faq-items.item2.title | page / /admissions | faq-items / Admission / faq-items.item2 / title | text | editable | "What are the documents required?" | 408 |
| admissions.faq-items.item2.content | page / /admissions | faq-items / Admission / faq-items.item2 / content | text | editable | "Required documents include: Birth certificate, Previous academic records, Transfer certificate (if applicable), Aadhar card, Passport size photographs, and Parent's ID proof." | 409 |
| admissions.faq-items.item3.title | page / /admissions | faq-items / Admission / faq-items.item3 / title | text | editable | "What is the fee structure?" | 412 |
| admissions.faq-items.item3.content | page / /admissions | faq-items / Admission / faq-items.item3 / content | text | editable | "The fee structure varies by class. Please contact the school office or visit the admission office for the detailed fee schedule." | 413 |
| admissions.faq-items.item4.title | page / /admissions | faq-items / Admission / faq-items.item4 / title | text | editable | "Is there any entrance test?" | 416 |
| admissions.faq-items.item4.content | page / /admissions | faq-items / Admission / faq-items.item4 / content | text | editable | "Yes, students seeking admission to higher classes may need to take an entrance test. The test assesses the student's academic readiness." | 417 |
| admissions.documents-kg-to8.item1.text | page / /admissions | documents-kg-to8 / Admission / documents-kg-to8.item1 / text | text | editable | "Birth Certificate" | 423 |
| admissions.documents-kg-to8.item2.text | page / /admissions | documents-kg-to8 / Admission / documents-kg-to8.item2 / text | text | editable | "Aadhar Card" | 424 |
| admissions.documents-kg-to8.item3.text | page / /admissions | documents-kg-to8 / Admission / documents-kg-to8.item3 / text | text | editable | "Previous Class Marksheet" | 425 |
| admissions.documents-kg-to8.item4.text | page / /admissions | documents-kg-to8 / Admission / documents-kg-to8.item4 / text | text | editable | "Transfer Certificate from previous school (other than KG)" | 426 |
| admissions.documents-hs.item1.text | page / /admissions | documents-hs / Admission / documents-hs.item1 / text | text | editable | "HSLC Marksheet" | 430 |
| admissions.documents-hs.item2.text | page / /admissions | documents-hs / Admission / documents-hs.item2 / text | text | editable | "Registration Card" | 431 |
| admissions.documents-hs.item3.text | page / /admissions | documents-hs / Admission / documents-hs.item3 / text | text | editable | "Transfer Certificate from previous school" | 432 |
| admissions.documents-hs.item4.text | page / /admissions | documents-hs / Admission / documents-hs.item4 / text | text | editable | "Migration Certificate (for CBSE students)" | 433 |
| admissions.documents-hs.item5.text | page / /admissions | documents-hs / Admission / documents-hs.item5 / text | text | editable | "Admit Card of Class 10" | 434 |
| admissions.documents-hs.item6.text | page / /admissions | documents-hs / Admission / documents-hs.item6 / text | text | editable | "Pass Certificate of Class 10" | 435 |
| admissions.fee-structure.item1.label | page / /admissions | fee-structure / Admission / fee-structure.item1 / label | text | protected | "Admission Fees" | 439 |
| admissions.fee-structure.item1.amount | page / /admissions | fee-structure / Admission / fee-structure.item1 / amount | text | protected | "₹16,000/-" | 439 |
| admissions.fee-structure.item2.label | page / /admissions | fee-structure / Admission / fee-structure.item2 / label | text | protected | "Tuition fees per month" | 440 |
| admissions.fee-structure.item2.amount | page / /admissions | fee-structure / Admission / fee-structure.item2 / amount | text | protected | "₹1,800/-" | 440 |
| admissions.fee-structure.item3.label | page / /admissions | fee-structure / Admission / fee-structure.item3 / label | text | protected | "Tuition fees (Per Installment)" | 441 |
| admissions.fee-structure.item3.amount | page / /admissions | fee-structure / Admission / fee-structure.item3 / amount | text | protected | "₹7,200/-" | 441 |
| admissions.fee-structure.item4.label | page / /admissions | fee-structure / Admission / fee-structure.item4 / label | text | protected | "Annual & Other Fees (Per Installment)" | 442 |
| admissions.fee-structure.item4.amount | page / /admissions | fee-structure / Admission / fee-structure.item4 / amount | text | protected | "₹5,315/-" | 442 |
| admissions.fee-structure.item5.label | page / /admissions | fee-structure / Admission / fee-structure.item5 / label | text | protected | "Laboratory Fees (Science Stream - Per Installment)" | 443 |
| admissions.fee-structure.item5.amount | page / /admissions | fee-structure / Admission / fee-structure.item5 / amount | text | protected | "₹2,500/-" | 443 |
| admissions.fee-structure.item6.label | page / /admissions | fee-structure / Admission / fee-structure.item6 / label | text | protected | "Computer Fees (As per selection of subjects)" | 444 |
| admissions.fee-structure.item6.amount | page / /admissions | fee-structure / Admission / fee-structure.item6 / amount | text | protected | "₹3,100/-" | 444 |
| admissions.fee-structure.item7.label | page / /admissions | fee-structure / Admission / fee-structure.item7 / label | text | protected | "Psychology (Lab fee - As per selection of subjects)" | 445 |
| admissions.fee-structure.item7.amount | page / /admissions | fee-structure / Admission / fee-structure.item7 / amount | text | protected | "₹1,100/-" | 445 |
| admissions.admission.text | page / /admissions | section-4 / Admission / admission / text | text | editable | "ADMISSIONS" | 460 |
| admissions.admission.text.2 | page / /admissions | section-4 / Admission / admission / text 2 | text | editable | "Join Us" | 474 |
| admissions.admission.heading | page / /admissions | section-4 / Admission / admission / heading | text | editable | "Our " | 482 |
| admissions.admission.text.3 | page / /admissions | section-4 / Admission / admission / text 3 | text | editable | "Admissions" | 483 |
| admissions.admission.paragraph | page / /admissions | section-4 / Admission / admission / paragraph | text | editable | "Join the St. Mary's family" | 491 |
| admissions.admission.text.4 | page / /admissions | section-5 / Admission / admission / text 4 | text | editable | "Admissions Open" | 513 |
| admissions.admission.paragraph.2 | page / /admissions | section-5 / Admission / admission / paragraph 2 | text | editable | "St. Mary's Higher Secondary School welcomes students from Class 5 to 10. Our admission process is designed to be transparent and student-friendly." | 515 |
| admissions.admission.heading.2 | page / /admissions | section-6 / Admission / admission / heading 2 | text | editable | "Welcome to " | 528 |
| admissions.admission.text.5 | page / /admissions | section-6 / Admission / admission / text 5 | text | editable | "St. Mary's" | 529 |
| admissions.admission.button-label | page / /admissions | section-6 / Admission / admission / button-label | text | editable | "Eligibility Criteria" | 546 |
| admissions.admission.button-label.2 | page / /admissions | section-6 / Admission / admission / button-label 2 | text | editable | "Admission Prospectus" | 557 |
| admissions.admission.heading.3 | page / /admissions | section-6 / Admission / admission / heading 3 | text | editable | "Cut-off Marks" | 575 |
| admissions.admission.paragraph.3 | page / /admissions | section-6 / Admission / admission / paragraph 3 | text | editable | "CGPA or equivalent marks" | 578 |
| admissions.admission.paragraph.4 | page / /admissions | section-6 / Admission / admission / paragraph 4 | text | editable | "Humanities" | 584 |
| admissions.admission.paragraph.5 | page / /admissions | section-6 / Admission / admission / paragraph 5 | text | editable | "English & Social Science" | 585 |
| admissions.admission.text.6 | page / /admissions | section-6 / Admission / admission / text 6 | text | editable | "45%" | 587 |
| admissions.admission.paragraph.6 | page / /admissions | section-6 / Admission / admission / paragraph 6 | text | editable | "Science Stream" | 594 |
| admissions.admission.paragraph.7 | page / /admissions | section-6 / Admission / admission / paragraph 7 | text | editable | "Science & Mathematics" | 595 |
| admissions.admission.text.7 | page / /admissions | section-6 / Admission / admission / text 7 | text | editable | "45%" | 597 |
| admissions.admission.paragraph.8 | page / /admissions | section-6 / Admission / admission / paragraph 8 | text | editable | "Commerce Stream" | 604 |
| admissions.admission.paragraph.9 | page / /admissions | section-6 / Admission / admission / paragraph 9 | text | editable | "Social Science & Mathematics" | 605 |
| admissions.admission.text.8 | page / /admissions | section-6 / Admission / admission / text 8 | text | editable | "45%" | 607 |
| admissions.admission.heading.4 | page / /admissions | section-6 / Admission / admission / heading 4 | text | editable | "Admission Procedure" | 618 |
| admissions.admission.text.9 | page / /admissions | section-6 / Admission / admission / text 9 | text | protected | "•" | 624 |
| admissions.admission.text.10 | page / /admissions | section-6 / Admission / admission / text 10 | text | editable | "Submit the duly filled admission form and take admission on or within 3 days of the issue of form." | 625 |
| admissions.admission.text.11 | page / /admissions | section-6 / Admission / admission / text 11 | text | protected | "•" | 628 |
| admissions.admission.text.12 | page / /admissions | section-6 / Admission / admission / text 12 | text | editable | "Admission will be granted into preferred streams according to the availability of seats." | 629 |
| admissions.admission.text.13 | page / /admissions | section-6 / Admission / admission / text 13 | text | protected | "•" | 632 |
| admissions.admission.text.14 | page / /admissions | section-6 / Admission / admission / text 14 | text | editable | "Admission will stand automatically cancelled if admission is not taken on the dates announced." | 633 |
| admissions.admission.paragraph.10 | page / /admissions | section-6 / Admission / admission / paragraph 10 | text | editable | "⚠️ NO REFUND OF ANY KIND SHALL BE MADE ONCE ADMISSION IS TAKEN." | 638 |
| admissions.admission.heading.5 | page / /admissions | section-6 / Admission / admission / heading 5 | text | editable | "Documents Required" | 650 |
| admissions.admission.paragraph.11 | page / /admissions | section-6 / Admission / admission / paragraph 11 | text | editable | "The following self-attested documents are to be submitted along with the application." | 653 |
| admissions.admission.text.15 | page / /admissions | section-6 / Admission / admission / text 15 | text | protected | "📘" | 661 |
| admissions.admission.heading.6 | page / /admissions | section-6 / Admission / admission / heading 6 | text | editable | " For KG to Class 8" | 661 |
| admissions.admission.text.16 | page / /admissions | section-6 / Admission / admission / text 16 | text | protected | "." | 666 |
| admissions.admission.text.17 | page / /admissions | section-6 / Admission / admission / text 17 | text | protected | "🎓" | 676 |
| admissions.admission.heading.7 | page / /admissions | section-6 / Admission / admission / heading 7 | text | editable | " For Class 9 & 10 (HSLC)" | 676 |
| admissions.admission.text.18 | page / /admissions | section-6 / Admission / admission / text 18 | text | protected | "." | 681 |
| admissions.admission.heading.8 | page / /admissions | section-6 / Admission / admission / heading 8 | text | editable | "⚠️ Important Notes:" | 726 |
| admissions.admission.text.19 | page / /admissions | section-6 / Admission / admission / text 19 | text | protected | "•" | 729 |
| admissions.admission.text.20 | page / /admissions | section-6 / Admission / admission / text 20 | text | editable | "INCOMPLETE FORMS WILL BE REJECTED UPON SCRUTINY." | 730 |
| admissions.admission.text.21 | page / /admissions | section-6 / Admission / admission / text 21 | text | protected | "•" | 733 |
| admissions.admission.text.22 | page / /admissions | section-6 / Admission / admission / text 22 | text | editable | "SUBMISSION OF FORMS DOES NOT RESERVE THE RIGHT TO ADMISSION." | 734 |
| admissions.admission.text.23 | page / /admissions | section-6 / Admission / admission / text 23 | text | protected | "•" | 737 |
| admissions.admission.text.24 | page / /admissions | section-6 / Admission / admission / text 24 | text | editable | "FINAL DISCRETION LIES WITH THE PRINCIPAL IN ALL MATTERS." | 738 |
| admissions.admission.heading.9 | page / /admissions | section-6 / Admission / admission / heading 9 | text | editable | "Admission Prospectus" | 758 |
| admissions.admission.paragraph.12 | page / /admissions | section-6 / Admission / admission / paragraph 12 | text | editable | "The admission prospectus will be available for download soon. Please check back later or contact the school office for more information." | 762 |
| admissions.admission.paragraph.13 | page / /admissions | section-6 / Admission / admission / paragraph 13 | text | editable | "📞 Contact: " | 767 |
| admissions.admission.text.25 | page / /admissions | section-6 / Admission / admission / text 25 | text | editable | "9435190537" | 768 |
| admissions.admission.paragraph.14 | page / /admissions | section-6 / Admission / admission / paragraph 14 | text | editable | "✉️ Email: " | 770 |
| admissions.admission.text.26 | page / /admissions | section-6 / Admission / admission / text 26 | text | editable | "stmarysghy1924@yahoo.com" | 771 |
| admissions.admission.heading.10 | page / /admissions | section-6 / Admission / admission / heading 10 | text | editable | "Frequently Asked Questions" | 781 |

### src/site-pages/admissions/AdmissionInquiry.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| admissions.inquiry.admission-inquiry.text | page / /admissions/inquiry | section-1 / AdmissionInquiry / admission-inquiry / text | text | editable | "INQUIRY" | 70 |
| admissions.inquiry.admission-inquiry.text.2 | page / /admissions/inquiry | section-1 / AdmissionInquiry / admission-inquiry / text 2 | text | editable | "Begin Your Journey" | 84 |
| admissions.inquiry.admission-inquiry.heading | page / /admissions/inquiry | section-1 / AdmissionInquiry / admission-inquiry / heading | text | editable | "Admission " | 92 |
| admissions.inquiry.admission-inquiry.text.3 | page / /admissions/inquiry | section-1 / AdmissionInquiry / admission-inquiry / text 3 | text | editable | "Inquiry" | 93 |
| admissions.inquiry.admission-inquiry.paragraph | page / /admissions/inquiry | section-1 / AdmissionInquiry / admission-inquiry / paragraph | text | editable | "Your journey begins here" | 101 |
| admissions.inquiry.admission-inquiry.text.4 | page / /admissions/inquiry | section-2 / AdmissionInquiry / admission-inquiry / text 4 | text | editable | "Enquiry Form" | 123 |
| admissions.inquiry.admission-inquiry.paragraph.2 | page / /admissions/inquiry | section-2 / AdmissionInquiry / admission-inquiry / paragraph 2 | text | editable | "Fill in the details below and our admissions team will get back to you within 24 hours. We're here to help you take the first step towards a brighter future." | 125 |
| admissions.inquiry.admission-inquiry.text.5 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 5 | text | editable | "Enquiry Form" | 143 |
| admissions.inquiry.admission-inquiry.heading.2 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / heading 2 | text | editable | "Admission " | 147 |
| admissions.inquiry.admission-inquiry.text.6 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 6 | text | editable | "Enquiry" | 148 |
| admissions.inquiry.admission-inquiry.paragraph.3 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / paragraph 3 | text | editable | "Fill in the details below and our admissions team will get back to you within 24 hours." | 151 |
| admissions.inquiry.admission-inquiry.text.7 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 7 | text | editable | "Student Name " | 158 |
| admissions.inquiry.admission-inquiry.text.8 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 8 | text | protected | "*" | 159 |
| admissions.inquiry.admission-inquiry.placeholder | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / placeholder | text | editable | "Enter student's full name" | 170 |
| admissions.inquiry.admission-inquiry.text.9 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 9 | text | editable | "Date of Birth " | 177 |
| admissions.inquiry.admission-inquiry.text.10 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 10 | text | protected | "*" | 178 |
| admissions.inquiry.admission-inquiry.text.11 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 11 | text | editable | "Gender " | 195 |
| admissions.inquiry.admission-inquiry.text.12 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 12 | text | protected | "*" | 196 |
| admissions.inquiry.admission-inquiry.text.13 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 13 | text | editable | "Male" | 208 |
| admissions.inquiry.admission-inquiry.text.14 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 14 | text | editable | "Female" | 219 |
| admissions.inquiry.admission-inquiry.text.15 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 15 | text | editable | "Choice of Board" | 226 |
| admissions.inquiry.admission-inquiry.text.16 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 16 | text | editable | "Select Board" | 237 |
| admissions.inquiry.admission-inquiry.text.17 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 17 | text | editable | "CBSE" | 238 |
| admissions.inquiry.admission-inquiry.text.18 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 18 | text | editable | "SEBA" | 239 |
| admissions.inquiry.admission-inquiry.text.19 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 19 | text | editable | "ICSE" | 240 |
| admissions.inquiry.admission-inquiry.text.20 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 20 | text | editable | "Other" | 241 |
| admissions.inquiry.admission-inquiry.text.21 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 21 | text | editable | "Admission into (Grade) " | 248 |
| admissions.inquiry.admission-inquiry.text.22 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 22 | text | protected | "*" | 249 |
| admissions.inquiry.admission-inquiry.text.23 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 23 | text | editable | "Select Grade" | 260 |
| admissions.inquiry.admission-inquiry.text.24 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 24 | text | editable | "Class 5" | 261 |
| admissions.inquiry.admission-inquiry.text.25 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 25 | text | editable | "Class 6" | 262 |
| admissions.inquiry.admission-inquiry.text.26 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 26 | text | editable | "Class 7" | 263 |
| admissions.inquiry.admission-inquiry.text.27 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 27 | text | editable | "Class 8" | 264 |
| admissions.inquiry.admission-inquiry.text.28 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 28 | text | editable | "Class 9" | 265 |
| admissions.inquiry.admission-inquiry.text.29 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 29 | text | editable | "Class 10" | 266 |
| admissions.inquiry.admission-inquiry.text.30 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 30 | text | editable | "Academic Year" | 273 |
| admissions.inquiry.admission-inquiry.text.31 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 31 | text | editable | "Select Academic Year" | 284 |
| admissions.inquiry.admission-inquiry.text.32 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 32 | text | editable | "2025-26" | 285 |
| admissions.inquiry.admission-inquiry.text.33 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 33 | text | editable | "2026-27" | 286 |
| admissions.inquiry.admission-inquiry.text.34 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 34 | text | editable | "School Currently studying in (with the curriculum)" | 293 |
| admissions.inquiry.admission-inquiry.placeholder.2 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / placeholder 2 | text | editable | "Enter current school name" | 304 |
| admissions.inquiry.admission-inquiry.heading.3 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / heading 3 | text | editable | "Contact Details" | 312 |
| admissions.inquiry.admission-inquiry.text.35 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 35 | text | editable | "Father's Name " | 318 |
| admissions.inquiry.admission-inquiry.text.36 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 36 | text | protected | "*" | 319 |
| admissions.inquiry.admission-inquiry.placeholder.3 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / placeholder 3 | text | editable | "Enter father's full name" | 328 |
| admissions.inquiry.admission-inquiry.text.37 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 37 | text | editable | "Mother's Name " | 334 |
| admissions.inquiry.admission-inquiry.text.38 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 38 | text | protected | "*" | 335 |
| admissions.inquiry.admission-inquiry.placeholder.4 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / placeholder 4 | text | editable | "Enter mother's full name" | 344 |
| admissions.inquiry.admission-inquiry.text.39 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 39 | text | editable | "Contact No. " | 350 |
| admissions.inquiry.admission-inquiry.text.40 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 40 | text | protected | "*" | 351 |
| admissions.inquiry.admission-inquiry.placeholder.5 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / placeholder 5 | text | editable | "Enter contact number" | 362 |
| admissions.inquiry.admission-inquiry.text.41 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 41 | text | editable | "E-mail " | 369 |
| admissions.inquiry.admission-inquiry.text.42 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 42 | text | protected | "*" | 370 |
| admissions.inquiry.admission-inquiry.placeholder.6 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / placeholder 6 | text | editable | "Enter email address" | 381 |
| admissions.inquiry.admission-inquiry.text.43 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 43 | text | editable | "Correspondence Address " | 388 |
| admissions.inquiry.admission-inquiry.text.44 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 44 | text | protected | "*" | 389 |
| admissions.inquiry.admission-inquiry.placeholder.7 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / placeholder 7 | text | editable | "Enter complete correspondence address" | 398 |
| admissions.inquiry.admission-inquiry.text.45 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 45 | text | editable | "Submitting..." | 414 |
| admissions.inquiry.admission-inquiry.text.46 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 46 | text | editable | "Submit Enquiry" | 420 |
| admissions.inquiry.admission-inquiry.text.47 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 47 | text | editable | "✅ Thank you for your enquiry! Our admissions team will get back to you within 24 hours." | 426 |
| admissions.inquiry.admission-inquiry.heading.4 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / heading 4 | text | editable | "Admission Office" | 441 |
| admissions.inquiry.admission-inquiry.paragraph.4 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / paragraph 4 | text | editable | "Visit our admission office for a campus tour and to learn more about the admission process in detail." | 444 |
| admissions.inquiry.admission-inquiry.text.48 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 48 | text | editable | "+91 9435190537" | 453 |
| admissions.inquiry.admission-inquiry.text.49 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 49 | text | editable | "stmarysghy1924@yahoo.com" | 459 |
| admissions.inquiry.admission-inquiry.text.50 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 50 | text | editable | "Mon-Sat: 7:45 AM - 2:00 PM" | 465 |
| admissions.inquiry.admission-inquiry.heading.5 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / heading 5 | text | editable | "Important Dates" | 472 |
| admissions.inquiry.admission-inquiry.text.51 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 51 | text | editable | "Application Form Available For KG" | 477 |
| admissions.inquiry.admission-inquiry.text.52 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 52 | text | editable | "August/September" | 478 |
| admissions.inquiry.admission-inquiry.text.53 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 53 | text | editable | "Last Date of Submission" | 481 |
| admissions.inquiry.admission-inquiry.href | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / href | url | protected | "/#latest-notices" | 482 |
| admissions.inquiry.admission-inquiry.text.54 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 54 | text | editable | "Check for updates" | 482 |
| admissions.inquiry.admission-inquiry.text.55 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 55 | text | editable | "Entrance dates" | 487 |
| admissions.inquiry.admission-inquiry.href.2 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / href 2 | url | protected | "/#latest-notices" | 488 |
| admissions.inquiry.admission-inquiry.text.56 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 56 | text | editable | "Check for updates" | 488 |
| admissions.inquiry.admission-inquiry.text.57 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 57 | text | editable | "Admission List" | 493 |
| admissions.inquiry.admission-inquiry.href.3 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / href 3 | url | protected | "/#latest-notices" | 494 |
| admissions.inquiry.admission-inquiry.text.58 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 58 | text | editable | "Check for updates" | 494 |
| admissions.inquiry.admission-inquiry.text.59 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / text 59 | text | protected | "📞" | 507 |
| admissions.inquiry.admission-inquiry.paragraph.5 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / paragraph 5 | text | editable | "For immediate assistance" | 508 |
| admissions.inquiry.admission-inquiry.paragraph.6 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / paragraph 6 | text | editable | "+91-94351-90537" | 509 |
| admissions.inquiry.admission-inquiry.paragraph.7 | page / /admissions/inquiry | section-3 / AdmissionInquiry / admission-inquiry / paragraph 7 | text | editable | "Available 24/7" | 511 |

### src/site-pages/extracurricular/ClubsAndAssociations.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| extracurricular.clubs.clubs-and-associations.text | page / /extracurricular/clubs | section-1 / ClubsAndAssociations / clubs-and-associations / text | text | editable | "CLUBS" | 21 |
| extracurricular.clubs.clubs-and-associations.text.2 | page / /extracurricular/clubs | section-1 / ClubsAndAssociations / clubs-and-associations / text 2 | text | editable | "Extracurricular" | 35 |
| extracurricular.clubs.clubs-and-associations.heading | page / /extracurricular/clubs | section-1 / ClubsAndAssociations / clubs-and-associations / heading | text | editable | "Clubs & " | 43 |
| extracurricular.clubs.clubs-and-associations.text.3 | page / /extracurricular/clubs | section-1 / ClubsAndAssociations / clubs-and-associations / text 3 | text | editable | "Associations" | 44 |
| extracurricular.clubs.clubs-and-associations.paragraph | page / /extracurricular/clubs | section-1 / ClubsAndAssociations / clubs-and-associations / paragraph | text | editable | "Pursue your passions beyond the classroom" | 52 |
| extracurricular.clubs.clubs-and-associations.text.4 | page / /extracurricular/clubs | section-2 / ClubsAndAssociations / clubs-and-associations / text 4 | text | editable | "Coming Soon" | 74 |
| extracurricular.clubs.clubs-and-associations.paragraph.2 | page / /extracurricular/clubs | section-2 / ClubsAndAssociations / clubs-and-associations / paragraph 2 | text | editable | "We are currently updating our clubs and associations. Stay tuned for exciting new opportunities to explore your interests, develop new skills, and build lasting friendships." | 76 |
| extracurricular.clubs.clubs-and-associations.heading.2 | page / /extracurricular/clubs | section-3 / ClubsAndAssociations / clubs-and-associations / heading 2 | text | editable | "Clubs & Associations" | 97 |
| extracurricular.clubs.clubs-and-associations.paragraph.3 | page / /extracurricular/clubs | section-3 / ClubsAndAssociations / clubs-and-associations / paragraph 3 | text | editable | "We're preparing an exciting lineup of clubs and associations for our students. From music and art to coding and sports, there will be something for everyone." | 101 |
| extracurricular.clubs.clubs-and-associations.paragraph.4 | page / /extracurricular/clubs | section-3 / ClubsAndAssociations / clubs-and-associations / paragraph 4 | text | editable | "Check back soon for the complete list and how to join." | 105 |

### src/site-pages/extracurricular/FormativeMoments.jsx

Audience: public.

| Stable key | Scope / page | Section / human field | Type | Status | Exact original/default (JSON) | Source line |
| --- | --- | --- | --- | --- | --- | ---: |
| extracurricular.moments.formative-moments.text | page / /extracurricular/moments | section-1 / FormativeMoments / formative-moments / text | text | editable | "MOMENTS" | 21 |
| extracurricular.moments.formative-moments.text.2 | page / /extracurricular/moments | section-1 / FormativeMoments / formative-moments / text 2 | text | editable | "School Life" | 35 |
| extracurricular.moments.formative-moments.heading | page / /extracurricular/moments | section-1 / FormativeMoments / formative-moments / heading | text | editable | "Formative " | 43 |
| extracurricular.moments.formative-moments.text.3 | page / /extracurricular/moments | section-1 / FormativeMoments / formative-moments / text 3 | text | editable | "Moments" | 44 |
| extracurricular.moments.formative-moments.paragraph | page / /extracurricular/moments | section-1 / FormativeMoments / formative-moments / paragraph | text | editable | "Creating memories that last a lifetime" | 52 |
| extracurricular.moments.formative-moments.text.4 | page / /extracurricular/moments | section-2 / FormativeMoments / formative-moments / text 4 | text | editable | "Coming Soon" | 74 |
| extracurricular.moments.formative-moments.paragraph.2 | page / /extracurricular/moments | section-2 / FormativeMoments / formative-moments / paragraph 2 | text | editable | "We are currently updating our formative moments gallery. Soon you'll be able to explore the rich tapestry of events and activities that shape character, build community, and create unforgettable memories at St. Mary's." | 76 |
| extracurricular.moments.formative-moments.heading.2 | page / /extracurricular/moments | section-3 / FormativeMoments / formative-moments / heading 2 | text | editable | "Formative Moments" | 98 |
| extracurricular.moments.formative-moments.paragraph.3 | page / /extracurricular/moments | section-3 / FormativeMoments / formative-moments / paragraph 3 | text | editable | "We're compiling a collection of memorable moments from school life. From Annual Day celebrations to Science Exhibitions, Sports Day to Cultural Festivals, every moment tells a story of growth and community." | 102 |
| extracurricular.moments.formative-moments.paragraph.4 | page / /extracurricular/moments | section-3 / FormativeMoments / formative-moments / paragraph 4 | text | editable | "Check back soon to relive the cherished memories of St. Mary's." | 107 |

## Existing MongoDB field templates

These are source-schema contracts, not invented record defaults. All have protected static-registry status and remain editable only through their existing module where supported. A null default below means the actual live value was not queried; the original schema default expression is provided independently. Visibility describes the existing public renderer, not permission to expose all model fields.

| Key | Page | Type | Public renderer uses field | Schema default expression | Owner | Source |
| --- | --- | --- | --- | --- | --- | --- |
| dynamic.circular.record.title | / | text | yes | none | MongoDB / Circular via existing /api/circulars | src/server/model/circular.model.js:4 |
| dynamic.circular.record.content | / | text | yes | none | MongoDB / Circular via existing /api/circulars | src/server/model/circular.model.js:9 |
| dynamic.circular.record.date | / | date | yes | Date.now | MongoDB / Circular via existing /api/circulars | src/server/model/circular.model.js:13 |
| dynamic.circular.record.time | / | text | yes | '10:00 AM' | MongoDB / Circular via existing /api/circulars | src/server/model/circular.model.js:18 |
| dynamic.circular.record.fileUrl | / | url | yes | null | MongoDB / Circular via existing /api/circulars | src/server/model/circular.model.js:22 |
| dynamic.circular.record.isPublished | / | text | no; admin/stored metadata | true | MongoDB / Circular via existing /api/circulars | src/server/model/circular.model.js:26 |
| dynamic.circular.record.createdBy | / | text | no; admin/stored metadata | none | MongoDB / Circular via existing /api/circulars | src/server/model/circular.model.js:30 |
| dynamic.staff.record.name | staff category pages | text | yes | none | MongoDB / Staff via existing /api/staff | src/server/model/staff.model.js:4 |
| dynamic.staff.record.designation | staff category pages | text | yes | none | MongoDB / Staff via existing /api/staff | src/server/model/staff.model.js:9 |
| dynamic.staff.record.qualification | staff category pages | text | yes | none | MongoDB / Staff via existing /api/staff | src/server/model/staff.model.js:29 |
| dynamic.staff.record.experience | staff category pages | text | yes | null | MongoDB / Staff via existing /api/staff | src/server/model/staff.model.js:34 |
| dynamic.staff.record.email | staff category pages | text | yes | null | MongoDB / Staff via existing /api/staff | src/server/model/staff.model.js:44 |
| dynamic.staff.record.phone | staff category pages | text | yes | null | MongoDB / Staff via existing /api/staff | src/server/model/staff.model.js:50 |
| dynamic.staff.record.image | staff category pages | image | yes | null | MongoDB / Staff via existing /api/staff | src/server/model/staff.model.js:55 |
| dynamic.staff.record.category | staff category pages | text | no; admin/stored metadata | none | MongoDB / Staff via existing /api/staff | src/server/model/staff.model.js:14 |
| dynamic.staff.record.staffType | staff category pages | text | no; admin/stored metadata | none | MongoDB / Staff via existing /api/staff | src/server/model/staff.model.js:19 |
| dynamic.staff.record.subject | staff category pages | text | no; admin/stored metadata | null | MongoDB / Staff via existing /api/staff | src/server/model/staff.model.js:24 |
| dynamic.staff.record.bio | staff category pages | text | no; admin/stored metadata | null | MongoDB / Staff via existing /api/staff | src/server/model/staff.model.js:39 |
| dynamic.staff.record.displayOrder | staff category pages | text | no; admin/stored metadata | 0 | MongoDB / Staff via existing /api/staff | src/server/model/staff.model.js:59 |
| dynamic.staff.record.isActive | staff category pages | text | no; admin/stored metadata | true | MongoDB / Staff via existing /api/staff | src/server/model/staff.model.js:63 |
| dynamic.gallery.record.name | /gallery | text | yes | none | MongoDB / Gallery via existing /api/gallery | src/server/model/gallery.model.js:20 |
| dynamic.gallery.record.images.image | /gallery | image | yes | none | MongoDB / Gallery via existing /api/gallery | src/server/model/gallery.model.js:4 |
| dynamic.gallery.record.images.title | /gallery | image | yes | null | MongoDB / Gallery via existing /api/gallery | src/server/model/gallery.model.js:8 |
| dynamic.gallery.record.images.uploadedAt | /gallery | image | yes | Date.now | MongoDB / Gallery via existing /api/gallery | src/server/model/gallery.model.js:13 |
| dynamic.gallery.record.eventDate | /gallery | date | yes | Date.now | MongoDB / Gallery via existing /api/gallery | src/server/model/gallery.model.js:43 |
| dynamic.gallery.record.slug | /gallery | text | no; admin/stored metadata | none | MongoDB / Gallery via existing /api/gallery | src/server/model/gallery.model.js:26 |
| dynamic.gallery.record.description | /gallery | text | no; admin/stored metadata | null | MongoDB / Gallery via existing /api/gallery | src/server/model/gallery.model.js:33 |
| dynamic.gallery.record.coverImage | /gallery | image | no; admin/stored metadata | null | MongoDB / Gallery via existing /api/gallery | src/server/model/gallery.model.js:39 |
| dynamic.gallery.record.isActive | /gallery | text | no; admin/stored metadata | true | MongoDB / Gallery via existing /api/gallery | src/server/model/gallery.model.js:47 |
| dynamic.gallery.record.displayOrder | /gallery | text | no; admin/stored metadata | 0 | MongoDB / Gallery via existing /api/gallery | src/server/model/gallery.model.js:51 |
| dynamic.gallery.record.createdBy | /gallery | text | no; admin/stored metadata | none | MongoDB / Gallery via existing /api/gallery | src/server/model/gallery.model.js:55 |
| dynamic.syllabus.record.academicYear | /academics/syllabus | text | yes | none | MongoDB / Syllabus via existing /api/syllabus | src/server/model/syllabus.model.js:4 |
| dynamic.syllabus.record.class | /academics/syllabus | text | yes | none | MongoDB / Syllabus via existing /api/syllabus | src/server/model/syllabus.model.js:9 |
| dynamic.syllabus.record.stream | /academics/syllabus | text | yes | 'general' | MongoDB / Syllabus via existing /api/syllabus | src/server/model/syllabus.model.js:14 |
| dynamic.syllabus.record.fileUrl | /academics/syllabus | url | yes | none | MongoDB / Syllabus via existing /api/syllabus | src/server/model/syllabus.model.js:19 |
| dynamic.syllabus.record.createdAt | /academics/syllabus | date | yes | timestamps: true | MongoDB / Syllabus via existing /api/syllabus | src/server/model/syllabus.model.js:timestamps |
| dynamic.syllabus.record.fileName | /academics/syllabus | text | no; admin/stored metadata | none | MongoDB / Syllabus via existing /api/syllabus | src/server/model/syllabus.model.js:23 |
| dynamic.syllabus.record.isPublished | /academics/syllabus | text | no; admin/stored metadata | true | MongoDB / Syllabus via existing /api/syllabus | src/server/model/syllabus.model.js:27 |
| dynamic.syllabus.record.displayOrder | /academics/syllabus | text | no; admin/stored metadata | 0 | MongoDB / Syllabus via existing /api/syllabus | src/server/model/syllabus.model.js:31 |
| dynamic.syllabus.record.uploadedBy | /academics/syllabus | text | no; admin/stored metadata | none | MongoDB / Syllabus via existing /api/syllabus | src/server/model/syllabus.model.js:35 |

Mandatory Disclosure is not a fifth MongoDB module. Its service currently returns an empty array, and card fields are hypothetical. Static wording in all its branches remains listed above. Computed copyright/year/date formatting, list counts and other derived values stay expressions, not invented editable defaults.

## Review and future binding

Every excluded literal and classification reason is retained in [source-literals.json](baseline/source-literals.json). Original classes/attributes and all expressions are retained separately. This allows review of omissions without granting technical strings editing permission. Static feeStructure data in Admissions is declared but not rendered; its protected classification is recorded in the field notes.

Use the architecture and exact preservation/binding-review process in [04-IMPLEMENTATION-ARCHITECTURE.md](04-IMPLEMENTATION-ARCHITECTURE.md) and [03-PRESERVATION-BASELINE.md](03-PRESERVATION-BASELINE.md). An editable status identifies a future candidate; it does not apply a binding or authorize a content change in Task 01.
