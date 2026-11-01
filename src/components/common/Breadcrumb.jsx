'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useWebsiteContent } from '../website-editor/useWebsiteContent.js'

const Breadcrumb = ({ items, className = '' }) => {
  const websiteContent = useWebsiteContent()

  return (
    <nav className={`flex items-center gap-2 text-sm ${className}`}>
      <Link {...websiteContent.props(["global.breadcrumb.breadcrumb.href","global.breadcrumb.breadcrumb.text"])} href={websiteContent.value("global.breadcrumb.breadcrumb.href", "/")} className="text-white/70 hover:text-white transition-colors">{websiteContent.value("global.breadcrumb.breadcrumb.text", "Home")}</Link>
      {items.map((item, index) => (
        <React.Fragment key={item.path || index}>
          <ChevronRight size={14} className="text-white/40" />
          {item.path && index < items.length - 1 ? (
            <Link {...websiteContent.propsFor(item.label)} href={item.path} className="text-white/70 hover:text-white transition-colors">
              {item.label}
            </Link>
          ) : (
            <span {...websiteContent.propsFor(item.label)} className="text-gold-300">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumb