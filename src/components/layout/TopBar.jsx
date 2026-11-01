'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Phone, Mail, MapPin, CreditCard, ChevronDown, ExternalLink, Sparkles, ArrowRight } from 'lucide-react'
import { useWebsiteContent } from '../website-editor/useWebsiteContent.js'

const TopBar = () => {
  const websiteContent = useWebsiteContent()

  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const toggleRef = useRef(null)

  const feeOptions = [
    {
      label: websiteContent.value("global.top-bar.fee-options.item1.label", 'Class KG – VIII'),
      bank: websiteContent.value("global.top-bar.fee-options.item1.bank", 'Federal Bank, Silpukhuri Branch'),
      url: 'https://epay.federalbank.co.in/easypayments/DIRECTPAYMENT.ASPX?CODE=DABB4QLY4Q1O4'
    },
    {
      label: websiteContent.value("global.top-bar.fee-options.item2.label", 'Class IX – XII'),
      bank: websiteContent.value("global.top-bar.fee-options.item2.bank", 'South Indian Bank, Ambari Branch'),
      url: 'https://eacademia.southindianbank.bank.in/feeuser/org?id=3037'
    }
  ]

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    const escape = event => {if(event.key==='Escape'&&dropdownRef.current?.contains(event.target)){setIsOpen(false);toggleRef.current?.focus()}}
    document.addEventListener('pointerdown', handleClickOutside)
    document.addEventListener('keydown',escape)
    return () => {document.removeEventListener('pointerdown', handleClickOutside);document.removeEventListener('keydown',escape)}
  }, [])

  return (
    <div className="school-topbar">
      <div className="container-custom">
        <div className="school-topbar-row">
          {/* Left - Contact Info - Hidden on mobile, visible on md+ */}
          <div className="school-contact-details">
            <a {...websiteContent.props(["global.top-bar.top-bar.href"])}
              href={websiteContent.value("global.top-bar.top-bar.href", "tel:+919435190537")}
              className="school-contact-link school-contact-phone"
            >
              <Phone size={14} className="text-[#c9a84c] group-hover:scale-110 transition-transform" />
              <span {...websiteContent.props(["global.top-bar.top-bar.text"])} className="tracking-wide font-medium">{websiteContent.value("global.top-bar.top-bar.text", "+91-94351-90537")}</span>
            </a>
            <a {...websiteContent.props(["global.top-bar.top-bar.href.2"])}
              href={websiteContent.value("global.top-bar.top-bar.href.2", "mailto:stmarysghy1924@yahoo.com")}
              className="school-contact-link school-contact-email"
            >
              <Mail size={14} className="text-[#c9a84c] group-hover:scale-110 transition-transform" />
              <span {...websiteContent.props(["global.top-bar.top-bar.text.2"])} className="tracking-wide font-medium">{websiteContent.value("global.top-bar.top-bar.text.2", "stmarysghy1924@yahoo.com")}</span>
            </a>
            <a {...websiteContent.props(["global.top-bar.top-bar.href.3"])}
              href={websiteContent.value("global.top-bar.top-bar.href.3", "https://maps.google.com")}
              target="_blank" 
              rel="noopener noreferrer"
              className="school-contact-link school-contact-location"
            >
              <MapPin size={14} className="text-[#c9a84c] group-hover:scale-110 transition-transform" />
              <span {...websiteContent.props(["global.top-bar.top-bar.text.3"])} className="tracking-wide font-medium">{websiteContent.value("global.top-bar.top-bar.text.3", "Guwahati, Assam")}</span>
            </a>
          </div>

          {/* Right - Pay Fees Button - Always visible, centered on mobile */}
          <div className="school-fees-cell">
            <div className="flex items-center">
              {/* Pay Fees Dropdown - Premium Design */}
              <div className="relative z-70" ref={dropdownRef}>
                <button
                  ref={toggleRef}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls="school-fee-options"
                  onClick={() => setIsOpen(!isOpen)}
                  className="school-fees-button group"
                >
                  <span className="relative">
                    <Sparkles size={12}  className="inline sm:h-3.5 sm:w-3.5 text-[#1a0a0a]" />
                    <span className="absolute -inset-1 blur-md bg-[#c9a84c]/20 rounded-full -z-10" />
                  </span>
                  <span className="relative whitespace-nowrap">
                    <span {...websiteContent.props(["global.top-bar.top-bar.text.4"])} className="hidden sm:inline">{websiteContent.value("global.top-bar.top-bar.text.4", "Pay Fees Online")}</span>
                    <span {...websiteContent.props(["global.top-bar.top-bar.text.5"])} className="sm:hidden">{websiteContent.value("global.top-bar.top-bar.text.5", "Pay Fees")}</span>
                    <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-[#1a0a0a]/30 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </span>
                  <ChevronDown
                    size={12}
                    className={`transition-all duration-300 ${isOpen ? 'rotate-180' : ''} group-hover:translate-y-0.5`}
                  />
                  <span className="absolute -inset-1 rounded-full bg-linear-to-r from-[#c9a84c]/20 via-transparent to-[#c9a84c]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                </button>

                {/* Dropdown - Responsive width */}
                <div
                  id="school-fee-options"
                  hidden={!isOpen}
                  className="school-fees-popup"
                  style={{ zIndex: 9999 }}
                >
                  <div className="bg-linear-to-r from-[#1a0a0a] to-[#2d1212] px-4 py-3 flex items-center justify-between">
                    <p {...websiteContent.props(["global.top-bar.top-bar.paragraph"])} className="text-white text-[10px] sm:text-xs font-semibold tracking-wider uppercase">{websiteContent.value("global.top-bar.top-bar.paragraph", "Select Your Class Group")}</p>
                    <CreditCard size={14} className="text-[#c9a84c]" />
                  </div>
                  {feeOptions.map((option, index) => (
                    <a
                      key={index}
                      href={option.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between px-4 py-3.5 hover:bg-linear-to-r hover:from-[#f5f0e6] hover:to-[#faf6ed] transition-all duration-200 border-b border-gray-100 last:border-b-0 group/item"
                    >
                      <div>
                        <p {...websiteContent.propsFor(option.label)} className="text-xs sm:text-sm font-semibold text-[#1a0a0a] group-hover/item:text-[#2d1212] flex items-center gap-1.5">
                          {option.label}
                          <span className="w-1 h-1 rounded-full bg-[#c9a84c] opacity-60" />
                        </p>
                        <p {...websiteContent.propsFor(option.bank)} className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{option.bank}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span {...websiteContent.props(["global.top-bar.top-bar.text.6"])} className="text-[10px] text-[#c9a84c] font-medium opacity-0 group-hover/item:opacity-100 transition-opacity hidden sm:inline">{websiteContent.value("global.top-bar.top-bar.text.6", "Pay Now")}</span>
                        <ExternalLink size={14} className="text-[#c9a84c] shrink-0 opacity-60 group-hover/item:opacity-100 transition-all group-hover/item:translate-x-0.5" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar
