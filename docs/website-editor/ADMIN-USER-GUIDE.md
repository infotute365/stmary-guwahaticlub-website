# Website editor: administrator guide

This editor changes the existing website's published content. The original page structure, theme and default assets are retained. Only an active administrator or super-administrator can publish changes.

## Open the editor

1. Sign in through the existing **Admin Login** using your school administrator account.
2. From the admin area, select **Edit Website**. The public website opens with the editor toolbar.
3. Navigate using the original public navigation. The **Edit fields** menu lists the current page's fields and shared content; search it to find text, placeholders, metadata or content inside a conditional section.

Ordinary visitors see the published website without editor controls. Being signed in or changing a browser flag does not bypass server authorization.

## Change and publish a field

1. Select outlined content, or select its entry in **Edit fields**. Keyboard users can use Tab and Enter.
2. Change the value in the side panel. Separately styled words and repeated cards remain separate fields; choose the intended segment when several fields share an element.
3. Use **Save** for that field. **Cancel** discards only that field's draft. The toolbar's **Save Changes** saves dirty fields; it is not a single atomic transaction across several fields.
4. Wait for the success message. Reload the public page in a separate signed-out window to check the result.

Drafts affect the editor preview until saved. **Preview** hides selection controls; **Return to editing** restores them. Drafts are kept during public navigation in the same editor session, but are not a durable backup across browser reloads. **Discard Changes** discards drafts; it does not undo already published changes. On **Exit Editor**, use the unsaved-changes dialog to save, discard or stay.

Shared fields are marked **Shared** and can affect several pages. Metadata title and description are edited through the field menu. FAQ, table, timeline, form label/placeholder and card entries retain their original locations and behavior. A field inside a closed modal, print view or loading/success state remains conditional; selecting it does not create a new public section. Selecting a carousel slide field reveals that slide and pauses autoplay while editing.

## Images and links

The 20 approved static image slots support JPEG, PNG and WebP uploads up to 10 MiB. Images must decode successfully, be non-animated, have at most 40 million pixels and no dimension above 20,000 pixels. Prefer a source whose shape suits the existing slot. The processor preserves aspect ratio and produces WebP variants without upscaling; the original page's image fit/shape still applies.

Uploading prepares a draft. Preview it and select **Save** to publish. Original school images are never overwritten. Historical replacement files are retained for restoration. Do not manually delete the persistent `website/` upload directory or its manifests.

The 56 approved destination fields offer the exact original destination and existing public pages. Select a destination and explicitly confirm the change before saving or restoring it. Arbitrary external URLs are not accepted. The two fee-payment destinations, structural navigation paths and the admin login destination remain protected. Existing payment links are blocked from activation while editing; check payments in normal visitor mode without submitting a transaction.

## Restore content

Select a field to view its saved revision history. Use **Restore original** to return to the exact original default, or select a historical revision and confirm restoration. Restoring creates a new revision; it does not erase the audit history. Link restoration also requires destination confirmation. Load older history when needed.

If another administrator saved first, the editor reports a conflict instead of overwriting their change. Reload the selected field, review the current value, then make the intended change again. Other fields' drafts are retained. If the session expires, sign in again before publishing; never assume a failed request saved successfully.

## Existing school records

Use **Existing content** or a record's management action to open the established Circulars, Staff, Gallery or Syllabus tools. Records and documents continue to use those modules, not static website fields. Check publication/active flags and existing module validation when a record is absent from the public page.

Mandatory Disclosure currently has editable display text, an empty data source and no completed document-management module. The original Contact and Admission Inquiry forms simulate their success flow; this editor does not add message delivery or a new admissions service. Those are existing limitations requiring separate work.

## Troubleshooting

| Message or symptom | Action |
| --- | --- |
| Session/access error | Sign in with an active administrator account; ask the operator to check account status if it persists. |
| Conflict | Reload the selected field and review the current published value before saving again. |
| Validation error | Use plain text, an allowed numeric value, an approved destination or a valid supported image. |
| Upload/storage unavailable | Ask the operator to check persistent storage permissions, quota, free space and MongoDB. Keep the original image. |
| Save failed or connection lost | Preserve your draft, check the published page/history, then retry after the service recovers. |
| Unexpected default content | A missing/invalid override or database outage falls back to original content. Ask the operator to check database readiness. |

Desktop/mobile screenshots, hydrated keyboard/animation/form behavior and responsive image selection remain manual acceptance items because browser access was unavailable during this audit. See [TEST-RESULTS.md](TEST-RESULTS.md).
