'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useWebsiteEditor } from './WebsiteEditorProvider.jsx'

export function useWebsiteField(key, originalValue) {
  const editor = useWebsiteEditor()
  const draft = editor.active && editor.drafts?.[key]
  const saved = editor.published?.[key]
  const value = draft ? draft.value : saved && Object.hasOwn(saved, 'value') ? saved.value : originalValue
  return { value, editorProps: editor.fieldProps(key) }
}

// Reusable attribute slots retain the original element and React's escaping.
// Image/destination permissions still come from the server catalog, never type.
export function useWebsiteAttribute(key, originalValue, attribute) {
  if (!['placeholder', 'title', 'alt', 'src', 'href', 'aria-label'].includes(attribute)) throw new Error('Unsupported website content attribute')
  const field = useWebsiteField(key, originalValue)
  return { value: field.value, editorProps: { ...field.editorProps, [attribute]: field.value } }
}

// Background images can sit below gradient/content layers. Annotate the existing
// visual surface separately so blank-area clicks can select its image slot,
// while nested text fields, links and buttons keep their own interaction.
export function useWebsiteImage(key, originalValue) {
  const field = useWebsiteField(key, originalValue)
  return { ...field, targetProps: field.editorProps['data-website-field'] ? { 'data-website-image-field': key } : {} }
}

export function useManagedRecord(module) {
  const editor = useWebsiteEditor()
  return useCallback((id, label) => editor.recordProps(module, id, label), [editor.recordProps, module])
}

export function useEditorCarousel() {
  const { active, preview, selectedField } = useWebsiteEditor()
  const swiper = useRef(null)
  const paused = useRef(false)
  const enabled = active && !preview
  const selectedSlide = selectedField?.key?.match(/^home\.hero-carousel\.slides\.item(\d+)\./)
  const slideIndex = selectedSlide ? Number(selectedSlide[1]) - 1 : null
  const apply = useCallback(instance => {
    if (!instance || instance.destroyed) return
    if (enabled) {
      if (slideIndex !== null) instance.slideTo(slideIndex, 0)
      else if (!paused.current) instance.slideTo(0, 0)
      instance.autoplay?.stop()
      paused.current = true
    } else if (paused.current) {
      instance.autoplay?.start()
      paused.current = false
    }
  }, [enabled, slideIndex])
  useEffect(() => { apply(swiper.current) }, [apply])
  return useCallback(instance => { swiper.current = instance; apply(instance) }, [apply])
}
