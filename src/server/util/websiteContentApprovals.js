import registry from '../../../docs/website-editor/baseline/content-registry.json' with { type: 'json' }
import routes from '../../../docs/website-editor/baseline/routes.json' with { type: 'json' }
import { CONTENT_BINDINGS } from '../../content/website-bindings.js'

// Preserve the existing Task 03 image choices and all original defaults.
const priorApprovals = {
  'home.hero-carousel.hero-carousel.style': Object.freeze({
    contentType: 'image', defaultValue: "url('/walpaper.png')",
    choices: Object.freeze([
      { value: "url('/walpaper.png')", label: 'Original school photograph' },
      { value: "url('/domenica.png')", label: 'Mother Domenica' },
      { value: "url('/john.png')", label: 'Saint John Bosco' },
      { value: "url('/sister.jpg')", label: 'School photograph: Sister' },
    ].map(Object.freeze)),
  }),
  'home.home.href.2': Object.freeze({
    contentType: 'url', defaultValue: '/contact',
    choices: Object.freeze([
      { value: '/contact', label: 'Contact Us (original)' },
      { value: '/admissions', label: 'Admissions' },
      { value: '/admissions/inquiry', label: 'Admission Inquiry' },
    ].map(Object.freeze)),
  }),
}
const bound = new Set(CONTENT_BINDINGS.map(field => field.key))
export const websiteContentApprovals = Object.freeze(Object.fromEntries(registry.fields
  .filter(field => bound.has(field.key) && ['image','url'].includes(field.contentType))
  .map(field => [field.key, Object.freeze({
    contentType: field.contentType,
    defaultValue: field.defaultValue,
    uploadAllowed: field.contentType === 'image',
    backgroundImage: field.contentType === 'image' && /^url\(/.test(field.defaultValue),
    choices: Object.freeze(field.contentType === 'url'
      ? [...new Map([{value:field.defaultValue,label:'Original destination'}, ...routes.map(route=>({value:route.path,label:route.path==='/'?'Home':route.path}))].map(choice=>[choice.value,Object.freeze(choice)])).values()]
      : priorApprovals[field.key]?.choices || [Object.freeze({value:field.defaultValue,label:'Original image'})]),
  })])))
