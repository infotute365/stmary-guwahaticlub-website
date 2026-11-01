// Four Task 03 text fields and two explicitly approved attribute slots. Frozen
// Task 01 keys, not a new source of defaults or an editing authorization list.
export const HOME_BINDINGS = Object.freeze([
  { key: 'home.hero-carousel.slides.item1.title', label: 'Hero heading', kind: 'text', path: '/' },
  { key: 'home.hero-carousel.slides.item1.description', label: 'Hero description', kind: 'multiline', path: '/' },
  { key: 'home.welcome-section.welcome-section.paragraph', label: 'Welcome paragraph', kind: 'multiline', path: '/' },
  { key: 'home.home.item1.value', label: 'Established quick fact', kind: 'text', path: '/' },
  { key: 'home.hero-carousel.hero-carousel.style', label: 'Hero background image', kind: 'image', path: '/' },
  { key: 'home.home.href.2', label: 'Contact button destination', kind: 'url', path: '/' },
])

export const PUBLIC_PAGES = Object.freeze([
  { path: '/', label: 'Home' },
  { path: '/about/founders', label: 'Our Founders' },
  { path: '/about/journey', label: 'Our Journey' },
  { path: '/about/principal', label: 'Principal' },
  { path: '/about/superiors', label: 'Superiors' },
  { path: '/academics/evaluation', label: 'Evaluation System' },
  { path: '/academics/syllabus', label: 'Syllabus' },
  { path: '/administration/management', label: 'Management' },
  { path: '/administration/non-teaching', label: 'Non-Teaching Staff' },
  { path: '/administration/teaching-staff/high', label: 'High School' },
  { path: '/administration/teaching-staff/higher-secondary', label: 'Higher Secondary' },
  { path: '/administration/teaching-staff/middle', label: 'Middle School' },
  { path: '/administration/teaching-staff/primary', label: 'Primary School' },
  { path: '/admissions', label: 'Admissions' },
  { path: '/admissions/inquiry', label: 'Admission Inquiry' },
  { path: '/contact', label: 'Contact Us' },
  { path: '/extracurricular/clubs', label: 'Clubs & Associations' },
  { path: '/extracurricular/moments', label: 'Formative Moments' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/infrastructure', label: 'Infrastructure' },
  { path: '/mandatory-disclosure', label: 'Mandatory Disclosure' },
  { path: '/past-pupils', label: 'Past Pupils Association' },
  { path: '/student-rules', label: 'Student Rules' },
])

export const MANAGED_MODULES = Object.freeze({
  circulars: { label: 'Circulars', path: '/admin/circulars' },
  staff: { label: 'Staff', path: '/admin/staff' },
  gallery: { label: 'Gallery', path: '/admin/gallery' },
  syllabus: { label: 'Syllabus', path: '/admin/syllabus' },
  disclosure: { label: 'Disclosure', path: '/admin/disclosure' },
})
