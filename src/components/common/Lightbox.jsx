'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const Lightbox = ({ images, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const dialogRef = useRef(null)

  useEffect(() => {
    const previous = document.body.style.overflow
    const opener = document.activeElement
    dialogRef.current?.focus()
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'Tab') {
        const controls = [...dialogRef.current.querySelectorAll('button')]
        const first = controls[0], last = controls.at(-1)
        if (e.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && (document.activeElement === last || document.activeElement === dialogRef.current)) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previous
      opener?.focus()
    }
  }, [onClose, images.length])

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const next = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={images[currentIndex].title} tabIndex={-1} onClick={e=>{if(e.target===e.currentTarget)onClose()}} className="school-lightbox fixed inset-0 z-[999] bg-black/90 flex items-center justify-center">
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2"
      >
        <X size={32} />
      </button>
      <button
        onClick={prev}
        aria-label="Previous image"
        className="absolute left-4 text-white/70 hover:text-white transition-colors p-2"
      >
        <ChevronLeft size={40} />
      </button>
      <button
        onClick={next}
        aria-label="Next image"
        className="absolute right-4 text-white/70 hover:text-white transition-colors p-2"
      >
        <ChevronRight size={40} />
      </button>
      <div className="max-w-5xl max-h-[80vh] px-8">
        <img
          src={images[currentIndex].image}
          alt={images[currentIndex].title}
          className="max-w-full max-h-[75vh] object-contain rounded-lg"
        />
        <p className="text-white text-center mt-4 text-sm">
          {images[currentIndex].title} ({currentIndex + 1}/{images.length})
        </p>
      </div>
    </div>
  )
}

export default Lightbox
