# Page and component inventory

Audited 31 October 2026. **23 of 23 requested public routes exist and were inspected.** This inventory follows the actual App Router imports and active JSX component references. No routes, sections, wording, assets or behavior were changed.

## Public routes

All rows inherit TopBar → Navbar → main page content → Footer from `app/(site)/layout.jsx`; `app/layout.jsx` supplies global CSS, metadata, providers and Analytics. Editable counts below are direct literals in the page source; shared and Home child-component fields are counted once in their owning files. Exact word-level defaults and locations are in [02-CONTENT-REGISTRY.md](02-CONTENT-REGISTRY.md).

| Route | App Router file | Page source | Editable direct fields | Existing sections/data and behavior |
| --- | --- | --- | ---: | --- |
| / | app/(site)/page.jsx | src/site-pages/Home.jsx | 24 | HeroCarousel beside CircularsPanel (#latest-notices); WelcomeSection and Quick Facts; Why Choose Us / FeatureCard; PrincipalMessage; Ready to Join CTA. StatsCounter is imported but commented out. |
| /about/founders | app/(site)/about/founders/page.jsx | src/site-pages/about/OurFounders.jsx | 28 | Founders hero/introduction; three founder cards (John Bosco, Mary Domenica Mazzarello, Pioneering Sisters), biographies, years, feast days, quotes, images; principal CTA. |
| /about/journey | app/(site)/about/journey/page.jsx | src/site-pages/about/OurJourney.jsx | 46 | Journey hero/introduction; eight milestone cards (1924–2024) with year/title/description/image; static statistics; Continuing the Legacy CTA. |
| /about/principal | app/(site)/about/principal/page.jsx | src/site-pages/about/Principal.jsx | 62 | Leadership hero/introduction; current selected principal carousel; 21-entry Headmistresses/Principals table; Our Legacy closing content. Source is the historical list; current principal message lives on Home. |
| /about/superiors | app/(site)/about/superiors/page.jsx | src/site-pages/about/Superiors.jsx | 34 | Superiors hero/introduction; Spiritual & Administrative Leadership list of 22 names; total/closing text. IDs remain internal and protected. |
| /academics/evaluation | app/(site)/academics/evaluation/page.jsx | src/site-pages/academics/Evaluation.jsx | 33 | Evaluation hero/introduction; detailed evaluation/assessment cards; assessment descriptions; 20% / 30% / 50% / 100% weightage display. |
| /academics/syllabus | app/(site)/academics/syllabus/page.jsx | src/site-pages/academics/Syllabus.jsx | 21 | Syllabus hero; academic year/class/conditional stream filters; MongoDB syllabus entries with PDF link and upload date; counts/empty state. |
| /administration/management | app/(site)/administration/management/page.jsx | src/site-pages/administration/Management.jsx | 15 | Management hero/introduction; category=management, staffType=management cards; skeleton/Coming Soon statistics and message. |
| /administration/non-teaching | app/(site)/administration/non-teaching/page.jsx | src/site-pages/administration/NonTeachingStaff.jsx | 12 | Support hero/introduction; category=non-teaching, staffType=non-teaching cards; skeleton/Coming Soon message. |
| /administration/teaching-staff/high | app/(site)/administration/teaching-staff/high/page.jsx | src/site-pages/administration/teaching-staff/HighSchool.jsx | 12 | High hero/introduction; category=high, staffType=teaching cards; skeleton/Coming Soon. Existing hero class label: Class 9. |
| /administration/teaching-staff/higher-secondary | app/(site)/administration/teaching-staff/higher-secondary/page.jsx | src/site-pages/administration/teaching-staff/HigherSecondery.jsx | 12 | Higher Secondary hero/introduction; category=higher-secondary, staffType=teaching cards; skeleton/Coming Soon. Existing hero class label: Class 10. Source filename intentionally remains HigherSecondery.jsx. |
| /administration/teaching-staff/middle | app/(site)/administration/teaching-staff/middle/page.jsx | src/site-pages/administration/teaching-staff/MiddleSchool.jsx | 12 | Middle hero/introduction; category=middle, staffType=teaching cards; skeleton/Coming Soon. Existing hero class label: Classes 7-8. |
| /administration/teaching-staff/primary | app/(site)/administration/teaching-staff/primary/page.jsx | src/site-pages/administration/teaching-staff/PrimarySchool.jsx | 12 | Primary hero/introduction; category=primary, staffType=teaching cards; skeleton/Coming Soon. Existing hero class label: Classes 5-6. |
| /admissions | app/(site)/admissions/page.jsx | src/site-pages/admissions/Admission.jsx | 60 | Admissions hero/introduction; Welcome / Eligibility / Prospectus controls; cutoff marks; admission procedure; KG–8 and Class 9/10 document lists; important notes; prospectus Coming Soon modal; four FAQs. feeStructure is declared but not rendered. |
| /admissions/inquiry | app/(site)/admissions/inquiry/page.jsx | src/site-pages/admissions/AdmissionInquiry.jsx | 68 | Inquiry hero/introduction; student details, board/grade/year and parent/contact fields; submitting/success states; Admission Office; Important Dates with /#latest-notices links; assistance panel. Timer-only submission. |
| /contact | app/(site)/contact/page.jsx | src/site-pages/ContactUs.jsx | 49 | Contact hero/introduction; contact form and messages; contactInfo cards (address/phone/email/office hours); social links; emergency panel; embedded Google map and school/location wording. Timer-only submission. |
| /extracurricular/clubs | app/(site)/extracurricular/clubs/page.jsx | src/site-pages/extracurricular/ClubsAndAssociations.jsx | 10 | Clubs hero; Coming Soon introduction and Clubs & Associations preparation/check-back content. No dynamic clubs module. |
| /extracurricular/moments | app/(site)/extracurricular/moments/page.jsx | src/site-pages/extracurricular/FormativeMoments.jsx | 10 | Moments hero; Coming Soon introduction and Formative Moments preparation/check-back content. No dynamic moments module. |
| /gallery | app/(site)/gallery/page.jsx | src/site-pages/Gallery.jsx | 42 | Loading/loaded hero; Moments That Matter introduction; category/search/view-mode controls; MongoDB image grid, counts/infinite scroll/empty state; lightbox and image actions/notifications. |
| /infrastructure | app/(site)/infrastructure/page.jsx | src/site-pages/Infrastructure.jsx | 40 | Campus hero/introduction; eight facility cards and their tag/title/description content; Learn More display; facility/access/satisfaction figures. No separate infrastructure model. |
| /mandatory-disclosure | app/(site)/mandatory-disclosure/page.jsx | src/site-pages/MandatoryDisclosure.jsx | 28 | Loading/loaded disclosure hero; Official Documents introduction; certificates heading; empty list and hypothetical populated card labels; Verified & Authentic/footer date. getDisclosures returns []. |
| /past-pupils | app/(site)/past-pupils/page.jsx | src/site-pages/PastPupilsAssociation.jsx | 35 | PageHeader/Breadcrumb; alumni introduction; four statistical cards; three membership benefits; three testimonials including profession/year/message; Join the Association CTA to /contact. |
| /student-rules | app/(site)/student-rules/page.jsx | src/site-pages/StudentRules.jsx | 44 | Rules hero/introduction; six rule categories, each with four literal rule items; closing discipline/responsibility content. |

## Shared components and active use

Navbar owns the full nested navigation data. NavDropdown and NavNestedDropdown render labels/destinations from that data; they do not invent more public routes. Group paths such as /about, /administration, /academics and /extracurricular are navigation grouping values, not additional page files. Desktop/mobile labels retain distinct literal occurrences where the source duplicates them. TopBar owns contact links and two bank fee options; Footer owns school/contact text, social labels, quick/academic links, Admin Login, copyright fragments and policy/service wording. The copyright year is computed and remains application logic.

Home child order is HeroCarousel/CircularsPanel, WelcomeSection with Quick Facts, FeatureCard, PrincipalMessage, then the final CTA. HeroCarousel has three slides and the original /walpaper.png background; slide title/subtitle/description/badge are separate fields. FeatureCard has six cards, each with title, description, image, statistics and tag; colors/icons stay technical. PrincipalMessage includes the original /principal.png image, alt text, greeting, independently styled paragraph fragments, signature and blessing.

Common PageHeader passes title/subtitle/breadcrumb; Breadcrumb provides the Home label; Accordion renders caller-provided FAQ titles/content. StaffCard renders existing MongoDB staff fields. SectionWrapper/Card and UI Button/Badge/Loader preserve presentation/children contracts. GalleryGrid is active only if referenced by rendered JSX; the current Gallery page implements its own grid/lightbox. Dormant common ContactForm and Lightbox, and Home StatsCounter, are inspected and protected rather than made editable.

The following list includes every inspected component, even files without literal content. Route usage is based on active JSX references, not merely imports. Admin components are inspected separately from public-route reachability.

| Component file | Use on requested public routes | Source literal fields (all statuses) |
| --- | --- | ---: |
| src/components/ProtectedRoute.jsx | No active public JSX reference | 0 |
| src/components/Providers.jsx | Referenced by layout.jsx | 0 |
| src/components/admin/Circulars.jsx | Admin/system only | 34 |
| src/components/admin/Dashboard.jsx | Admin/system only | 19 |
| src/components/admin/Gallery.jsx | Admin/system only | 42 |
| src/components/admin/Staff.jsx | Admin/system only | 59 |
| src/components/admin/Syllabus.jsx | Admin/system only | 38 |
| src/components/common/Accordion.jsx | Referenced by Evaluation.jsx, Admission.jsx | 0 |
| src/components/common/Breadcrumb.jsx | /past-pupils | 2 |
| src/components/common/Card.jsx | Referenced by StaffCard.jsx, PastPupilsAssociation.jsx | 0 |
| src/components/common/ContactForm.jsx | No active public JSX reference | 13 |
| src/components/common/GalleryGrid.jsx | No active public JSX reference | 0 |
| src/components/common/Lightbox.jsx | Referenced by GalleryGrid.jsx | 3 |
| src/components/common/PageHeader.jsx | Referenced by PastPupilsAssociation.jsx | 0 |
| src/components/common/SectionWrapper.jsx | Referenced by WelcomeSection.jsx, ContactUs.jsx, Gallery.jsx, Home.jsx, Infrastructure.jsx, MandatoryDisclosure.jsx, PastPupilsAssociation.jsx, StudentRules.jsx, Principal.jsx, Superiors.jsx, Evaluation.jsx, Management.jsx, NonTeachingStaff.jsx, HighSchool.jsx, HigherSecondery.jsx, MiddleSchool.jsx, PrimarySchool.jsx, Admission.jsx, AdmissionInquiry.jsx | 0 |
| src/components/common/StaffCard.jsx | /administration/management, /administration/non-teaching, /administration/teaching-staff/high, /administration/teaching-staff/higher-secondary, /administration/teaching-staff/middle, /administration/teaching-staff/primary | 3 |
| src/components/home/CircularsPanel.jsx | / | 20 |
| src/components/home/FeatureCard.jsx | / | 32 |
| src/components/home/HeroCarousel.jsx | / | 23 |
| src/components/home/PrincipalMessage.jsx | / | 21 |
| src/components/home/StatsCounter.jsx | No active public JSX reference | 12 |
| src/components/home/WelcomeSection.jsx | / | 17 |
| src/components/layout/AdminLayout.jsx | Admin/system only | 16 |
| src/components/layout/Footer.jsx | All 23 | 42 |
| src/components/layout/NavDropdown.jsx | Referenced by Navbar.jsx | 0 |
| src/components/layout/NavNestedDropdown.jsx | Referenced by Navbar.jsx | 0 |
| src/components/layout/Navbar.jsx | All 23 | 61 |
| src/components/layout/TopBar.jsx | All 23 | 16 |
| src/components/ui/Badge.jsx | No active public JSX reference | 0 |
| src/components/ui/Button.jsx | No active public JSX reference | 0 |
| src/components/ui/Loader.jsx | Referenced by ProtectedRoute.jsx | 0 |

## Existing admin and auxiliary routes

- /login → Login.jsx and the existing cookie-authentication context.
- /admin → redirect to /admin/dashboard.
- /admin/dashboard → Dashboard.jsx; four dynamic totals/recent circulars using existing services.
- /admin/circulars, /admin/staff, /admin/gallery, /admin/syllabus → existing respective CRUD components.
- All admin pages use ProtectedRoute and AdminLayout. Disclosure is linked in AdminLayout, but /admin/disclosure does not exist.
- app/not-found.jsx and src/site-pages/NotFound.jsx were inspected as system UI; they are outside the 23-route count.

There are 30 existing page routes in total when the seven login/admin routes are included. API catch-all and two upload route handlers are endpoint infrastructure, not extra public content pages.

## Source/data audit coverage

The audit also inspected src/services/api.js, route-adapter.js and route-path.js, all six controllers, all five models, all three server config files, both authentication middleware files, helpers/hooks/context/providers, global CSS, public assets, and existing scripts/tests/deployment/verification files. Backend source and business contracts are protected; see [05-EXISTING-DYNAMIC-MODULES.md](05-EXISTING-DYNAMIC-MODULES.md).

No generated school facts, missing-page content or database records were supplied. Existing disagreements between labels/statistics/addresses are preserved. For example, StatsCounter (dormant), Quick Facts, Journey and FeatureCard use their own original numbers; Home, Contact and Footer contain different address/phone formatting. These are independent source fields, not an authorization to reconcile them.

## Public assets

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| public/domenica.png | 2305068 | 56f23e948a4b900de76f0b22e76d00ed59694dc08863f118fa753c4011457521 |
| public/favicon.svg | 9522 | 61bc9a161de58248288e6905425d7180f0624c2865007b97d763fdac12043a66 |
| public/icons.svg | 5055 | 7ca2d67c9c3aebf50cdc8709ee8aacf8cdb8cc7ea6325ea94939caef5da1c53d |
| public/john.png | 2467643 | a0fe590343f116b112220453930005c55f311b1a6cb2064b9f51ecc3c285585c |
| public/logo.jpeg | 319793 | bc80e9c6fbe27544bd53fce5febbc85a96f991eb2e5994deb496c32660534635 |
| public/principal.png | 1620473 | d1392ba05f6d8420d2462042f4e13726cd88bab414d266b605a2a4c7fcc74b89 |
| public/sister.jpg | 34357 | 00fb8c815eead2f0a015fdc8b785ebaa227c26f46f3fc9be62362a102c99bcce |
| public/uploads/.gitkeep | 0 | e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| public/walpaper.png | 2479314 | feae3ca6c9dee7d1b45b04b913be2c9ecef0bb6fd2e661d01be598bc8dab69bd |
| src/assets/hero.png | 13057 | 881ffbcaafc212e49addad08846a5b82761355fa20624253af3477ba33262c5c |

All original image references, including remote Unsplash images, the avatar fallback and CSS background image, remain unchanged. No new public asset was added. Raw per-route SSR HTML, source structure, source literals and exact URLs are indexed in [03-PRESERVATION-BASELINE.md](03-PRESERVATION-BASELINE.md). Screenshot and live-record limitations are recorded there.
