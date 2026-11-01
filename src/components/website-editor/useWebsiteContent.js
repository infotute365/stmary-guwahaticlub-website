'use client'
import { useWebsiteEditor } from './WebsiteEditorProvider.jsx'

const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]))

// One hook per existing component. value() is a plain function and is safe in
// data arrays, maps, conditionals and event handlers; it never adds DOM nodes.
export function useWebsiteContent() {
  const editor = useWebsiteEditor()
  const index = new Map()
  const value = (key, original) => {
    const draft = editor.active && editor.drafts?.[key]
    const saved = editor.published?.[key]
    const result = draft ? draft.value : saved && Object.hasOwn(saved, 'value') ? saved.value : original
    const keys = index.get(result) || []
    if (!keys.includes(key)) keys.push(key)
    index.set(result, keys)
    return result
  }
  const props = keys => {
    const unique = [...new Set(Array.isArray(keys) ? keys : [keys])]
    const enabled = unique.filter(key => Object.keys(editor.fieldProps(key)).length)
    return enabled.length ? { ...editor.fieldProps(enabled[0]), 'data-website-fields': enabled.join(' ') } : {}
  }
  return {
    value,
    props,
    propsFor: (...values) => props(values.flatMap(item => {
      const exact=index.get(item)
      if(exact)return exact
      // Split biography paragraphs still select their one registered source.
      if(typeof item==='string' && item.length>12)return [...index.entries()].filter(([candidate])=>typeof candidate==='string'&&candidate.includes(item)).flatMap(([,keys])=>keys)
      return []
    })),
    imageProps: source => {
      const selection=props(index.get(source)||[])
      const match=typeof source==='string'&&source.match(/^(\/uploads\/website\/[a-f\d-]+\/)([1-9]\d{0,3})\.webp$/i)
      if(!match)return selection
      const maximum=Number(match[2])
      const widths=[...new Set([640,1280,1920,maximum].filter(width=>width<=maximum))].sort((a,b)=>a-b)
      return {...selection,srcSet:widths.map(width=>`${match[1]}${width}.webp ${width}w`).join(', '),sizes:'(max-width: 768px) 100vw, 1280px'}
    },
    // Preserve the exact print HTML when no override exists; escape edited text.
    html: (key, original) => { const current = value(key, original); return current === original ? original : escapeHtml(current) },
  }
}
