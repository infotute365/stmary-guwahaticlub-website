'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Building2, Users, Clock, Award, Crown } from 'lucide-react'
import SectionWrapper from '../../components/common/SectionWrapper.jsx'
import StaffCard from '../../components/common/StaffCard.jsx'
import { getStaff } from '../../services/api.js'
import { useWebsiteContent } from '../../components/website-editor/useWebsiteContent.js'

const Management = () => {
  const websiteContent = useWebsiteContent()

  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStaff('management')
      .then(data => {
        setStaff(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-maroon-900 h-[30vh] min-h-[220px] max-h-[280px]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-300 rounded-full translate-y-1/2 -translate-x-1/3" />
        </div>

        {/* Background Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span {...websiteContent.props(["administration.management.management.text"])} className="text-[80px] md:text-[120px] font-serif font-bold text-white/5 tracking-[0.3em] select-none">{websiteContent.value("administration.management.management.text", "MANAGEMENT")}</span>
        </div>

        <div className="container-custom relative h-full flex items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-2"
            >
              <Building2 size={18} className="text-gold-400" />
              <span {...websiteContent.props(["administration.management.management.text.2"])} className="text-xs font-semibold text-gold-400 tracking-[0.2em] uppercase">{websiteContent.value("administration.management.management.text.2", "Our Leadership")}</span>
            </motion.div>

            <motion.h1 {...websiteContent.props(["administration.management.management.heading"])}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white"
            >{websiteContent.value("administration.management.management.heading", "Our ")}<span {...websiteContent.props(["administration.management.management.text.3"])} className="text-gold-400">{websiteContent.value("administration.management.management.text.3", "Management")}</span>
            </motion.h1>

            <motion.p {...websiteContent.props(["administration.management.management.paragraph"])}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-white/50 text-sm mt-1"
            >{websiteContent.value("administration.management.management.paragraph", "Dedicated leadership team guiding our institution")}</motion.p>
          </div>
        </div>

        {/* Bottom Gold Line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500/50" />
      </section>

      {/* ===== INTRO TEXT ===== */}
      <section className="py-12 border-b border-gray-100">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-maroon-50 border border-maroon-100 rounded-full mb-4">
              <Building2 size={14} className="text-maroon-700" />
              <span {...websiteContent.props(["administration.management.management.text.4"])} className="text-xs font-semibold text-maroon-700 tracking-widest uppercase">{websiteContent.value("administration.management.management.text.4", "Our Leaders")}</span>
            </div>
            <p {...websiteContent.props(["administration.management.management.paragraph.2"])} className="text-gray-600 text-lg leading-relaxed">{websiteContent.value("administration.management.management.paragraph.2", "Our management team consists of dedicated professionals committed to providing the best educational experience for our students.")}</p>
          </motion.div>
        </div>
      </section>

      {/* ===== MANAGEMENT TEAM ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionWrapper>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 {...websiteContent.props(["administration.management.management.heading.2","administration.management.management.heading.3"])} className="text-3xl md:text-4xl font-serif font-bold text-maroon-800 mb-4">{websiteContent.value("administration.management.management.heading.2", "Dedicated ")}<span {...websiteContent.props(["administration.management.management.text.5"])} className="text-gold-600">{websiteContent.value("administration.management.management.text.5", "Management")}</span>{websiteContent.value("administration.management.management.heading.3", " Team")}</h2>
              <div className="w-16 h-0.5 bg-gold-400 mx-auto mb-4" />
            </div>
          </SectionWrapper>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/2 mx-auto mt-3"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/3 mx-auto mt-1"></div>
                  <div className="h-3 bg-gray-100 rounded w-2/3 mx-auto mt-2"></div>
                </div>
              ))}
            </div>
          ) : staff.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staff.map((member) => (
                <SectionWrapper key={member.id}>
                  <StaffCard staff={member} />
                </SectionWrapper>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16 bg-maroon-50 rounded-3xl border border-maroon-200"
            >
              <div className="max-w-md mx-auto px-4">
                {/* Icon */}
                <div className="inline-flex p-6 bg-white rounded-2xl shadow-lg mb-6 border border-maroon-100">
                  <Clock size={48} className="text-maroon-700" />
                </div>
                
                {/* Title */}
                <h3 {...websiteContent.props(["administration.management.management.heading.4"])} className="text-3xl font-serif font-bold text-maroon-800 mb-3">{websiteContent.value("administration.management.management.heading.4", "Coming Soon")}</h3>
                
                {/* Decorative Line */}
                <div className="w-16 h-0.5 bg-gold-400 mx-auto mb-4" />
                
                {/* Description */}
                <p {...websiteContent.props(["administration.management.management.paragraph.3"])} className="text-gray-600 text-base leading-relaxed">{websiteContent.value("administration.management.management.paragraph.3", "We are currently updating our management team details. Please check back later for the complete list of our dedicated leadership team.")}</p>

                {/* Stats or Placeholder Info */}
                <div className="mt-6 grid grid-cols-2 gap-4 max-w-xs mx-auto">
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <Users size={20} className="text-maroon-600 mx-auto mb-1" />
                    <p {...websiteContent.props(["administration.management.management.paragraph.4"])} className="text-xs text-gray-500">{websiteContent.value("administration.management.management.paragraph.4", "Team Members")}</p>
                    <p className="text-lg font-bold text-maroon-800">—</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <Award size={20} className="text-maroon-600 mx-auto mb-1" />
                    <p {...websiteContent.props(["administration.management.management.paragraph.6"])} className="text-xs text-gray-500">{websiteContent.value("administration.management.management.paragraph.6", "Years of Service")}</p>
                    <p className="text-lg font-bold text-maroon-800">—</p>
                  </div>
                </div>

                {/* Small note */}
                <p {...websiteContent.props(["administration.management.management.paragraph.8"])} className="text-xs text-gray-400 mt-6">{websiteContent.value("administration.management.management.paragraph.8", "Management details will be available soon")}</p>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Management