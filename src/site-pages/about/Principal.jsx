'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import SectionWrapper from '../../components/common/SectionWrapper.jsx'
import { Mail, Phone, GraduationCap, Award, Calendar, ChevronLeft, ChevronRight, Crown } from 'lucide-react'
import { useWebsiteContent } from '../../components/website-editor/useWebsiteContent.js'

const Principal = () => {
  const websiteContent = useWebsiteContent()

  const [currentIndex, setCurrentIndex] = useState(0)

  const principals = [
    { number: websiteContent.value("about.principal.principals.item1.number", 1), name: websiteContent.value("about.principal.principals.item1.name", "Sr. Catherine Susngi") },
    { number: websiteContent.value("about.principal.principals.item2.number", 2), name: websiteContent.value("about.principal.principals.item2.name", "Sr. Lydia Dias") },
    { number: websiteContent.value("about.principal.principals.item3.number", 3), name: websiteContent.value("about.principal.principals.item3.name", "Sr. Maria Rodrigues") },
    { number: websiteContent.value("about.principal.principals.item4.number", 4), name: websiteContent.value("about.principal.principals.item4.name", "Sr. Rosy Devassy") },
    { number: websiteContent.value("about.principal.principals.item5.number", 5), name: websiteContent.value("about.principal.principals.item5.name", "Sr. Anna Varkey") },
    { number: websiteContent.value("about.principal.principals.item6.number", 6), name: websiteContent.value("about.principal.principals.item6.name", "Sr. Beatrice Gonsalves") },
    { number: websiteContent.value("about.principal.principals.item7.number", 7), name: websiteContent.value("about.principal.principals.item7.name", "Sr. Mary George") },
    { number: websiteContent.value("about.principal.principals.item8.number", 8), name: websiteContent.value("about.principal.principals.item8.name", "Sr. Bridget Kurian") },
    { number: websiteContent.value("about.principal.principals.item9.number", 9), name: websiteContent.value("about.principal.principals.item9.name", "Sr. Mary Parekatt") },
    { number: websiteContent.value("about.principal.principals.item10.number", 10), name: websiteContent.value("about.principal.principals.item10.name", "Sr. Ivy D'Souza") },
    { number: websiteContent.value("about.principal.principals.item11.number", 11), name: websiteContent.value("about.principal.principals.item11.name", "Sr. Elizabeth Joseph") },
    { number: websiteContent.value("about.principal.principals.item12.number", 12), name: websiteContent.value("about.principal.principals.item12.name", "Sr. Teresa Kurian") },
    { number: websiteContent.value("about.principal.principals.item13.number", 13), name: websiteContent.value("about.principal.principals.item13.name", "Sr. Elizabeth George") },
    { number: websiteContent.value("about.principal.principals.item14.number", 14), name: websiteContent.value("about.principal.principals.item14.name", "Sr. Celine Porinchu") },
    { number: websiteContent.value("about.principal.principals.item15.number", 15), name: websiteContent.value("about.principal.principals.item15.name", "Sr. Catherine Kanannampuzha") },
    { number: websiteContent.value("about.principal.principals.item16.number", 16), name: websiteContent.value("about.principal.principals.item16.name", "Sr. Annie Villuviruthil") },
    { number: websiteContent.value("about.principal.principals.item17.number", 17), name: websiteContent.value("about.principal.principals.item17.name", "Sr. Lucy Nedumala") },
    { number: websiteContent.value("about.principal.principals.item18.number", 18), name: websiteContent.value("about.principal.principals.item18.name", "Sr. Jessy Nedumala") },
    { number: websiteContent.value("about.principal.principals.item19.number", 19), name: websiteContent.value("about.principal.principals.item19.name", "Sr. (Dr) Molly Kaniampadickal") },
    { number: websiteContent.value("about.principal.principals.item20.number", 20), name: websiteContent.value("about.principal.principals.item20.name", "Sr. Kathreena Kannapuzha") },
    { number: websiteContent.value("about.principal.principals.item21.number", 21), name: websiteContent.value("about.principal.principals.item21.name", "Sr. Tessy Davis") }
  ]

  const currentPrincipal = principals[currentIndex]

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? principals.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === principals.length - 1 ? 0 : prev + 1))
  }

  const goToPrincipal = (index) => {
    setCurrentIndex(index)
  }

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
          <span {...websiteContent.props(["about.principal.principal.text"])} className="text-[80px] md:text-[120px] font-serif font-bold text-white/5 tracking-[0.3em] select-none">{websiteContent.value("about.principal.principal.text", "PRINCIPALS")}</span>
        </div>

        <div className="container-custom relative h-full flex items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-2"
            >
              <Crown size={18} className="text-gold-400" />
              <span {...websiteContent.props(["about.principal.principal.text.2"])} className="text-xs font-semibold text-gold-400 tracking-[0.2em] uppercase">{websiteContent.value("about.principal.principal.text.2", "Leadership Legacy")}</span>
            </motion.div>

            <motion.h1 {...websiteContent.props(["about.principal.principal.heading"])}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white"
            >{websiteContent.value("about.principal.principal.heading", "Headmistresses / ")}<span {...websiteContent.props(["about.principal.principal.text.3"])} className="text-gold-400">{websiteContent.value("about.principal.principal.text.3", "Principals")}</span>
            </motion.h1>

            <motion.p {...websiteContent.props(["about.principal.principal.paragraph"])}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-white/50 text-sm mt-1"
            >{websiteContent.value("about.principal.principal.paragraph", "Our esteemed leaders through the years")}</motion.p>
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
              <GraduationCap size={14} className="text-maroon-700" />
              <span {...websiteContent.props(["about.principal.principal.text.4"])} className="text-xs font-semibold text-maroon-700 tracking-widest uppercase">{websiteContent.value("about.principal.principal.text.4", "Our Leadership")}</span>
            </div>
            <p {...websiteContent.props(["about.principal.principal.paragraph.2"])} className="text-gray-600 text-lg leading-relaxed">{websiteContent.value("about.principal.principal.paragraph.2", "St. Mary's Higher Secondary School has been blessed with visionary leaders who have guided the institution with wisdom, dedication, and grace. Here is the complete list of Headmistresses and Principals who have shaped our school's legacy.")}</p>
          </motion.div>
        </div>
      </section>

      {/* ===== CURRENT PRINCIPAL DISPLAY ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionWrapper>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-maroon-900/5 via-gold-50/30 to-maroon-900/5 rounded-3xl p-8 md:p-12 border border-gold-200/30 shadow-xl mb-12"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative flex-shrink-0">
                  <div {...websiteContent.propsFor(currentPrincipal.number)} className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-maroon-700 to-maroon-900 flex items-center justify-center text-white text-5xl font-bold shadow-2xl border-4 border-gold-400/50">
                    {currentPrincipal.number}
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-gold-400/20 to-maroon-600/20 rounded-full blur-xl opacity-50" />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div {...websiteContent.props(["about.principal.principal.text.5"])} className="inline-block px-4 py-1 bg-gold-400/20 border border-gold-400/30 rounded-full text-xs font-bold text-gold-700 uppercase tracking-wider mb-3">{websiteContent.value("about.principal.principal.text.5", "Headmistress / Principal #")}{currentPrincipal.number}
                  </div>
                  <h2 {...websiteContent.propsFor(currentPrincipal.name)} className="text-3xl md:text-4xl font-serif font-bold text-maroon-900">
                    {currentPrincipal.name}
                  </h2>
                  <p {...websiteContent.props(["about.principal.principal.paragraph.3"])} className="text-gold-600 font-medium mt-1">{websiteContent.value("about.principal.principal.paragraph.3", "St. Mary's Higher Secondary School")}</p>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                    <span {...websiteContent.props(["about.principal.principal.text.6"])} className="flex items-center gap-2">
                      <GraduationCap size={16} className="text-maroon-700" />{websiteContent.value("about.principal.principal.text.6", "Visionary Leader")}</span>
                    <span {...websiteContent.props(["about.principal.principal.text.7"])} className="flex items-center gap-2">
                      <Award size={16} className="text-maroon-700" />{websiteContent.value("about.principal.principal.text.7", "Dedicated Service")}</span>
                    <span {...websiteContent.props(["about.principal.principal.text.8"])} className="flex items-center gap-2">
                      <Calendar size={16} className="text-maroon-700" />{websiteContent.value("about.principal.principal.text.8", "Legacy Builder")}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={goToPrevious}
                    className="p-3 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-maroon-50 transition-all duration-300 border border-gray-200"
                  >
                    <ChevronLeft size={20} className="text-maroon-700" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="p-3 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-maroon-50 transition-all duration-300 border border-gray-200"
                  >
                    <ChevronRight size={20} className="text-maroon-700" />
                  </button>
                </div>
              </div>

              {/* Navigation Dots */}
              <div className="flex flex-wrap justify-center gap-1.5 mt-6">
                {principals.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToPrincipal(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'w-8 bg-maroon-700'
                        : 'w-2 bg-gray-300 hover:bg-maroon-300'
                    }`}
                  />
                ))}
              </div>

              {/* Counter */}
              <div {...websiteContent.props(["about.principal.principal.text.9"])} className="text-center mt-4 text-sm text-gray-400 font-medium">
                {currentIndex + 1}{websiteContent.value("about.principal.principal.text.9", " of ")}{principals.length}
              </div>
            </motion.div>
          </SectionWrapper>

          {/* ===== COMPLETE LIST ===== */}
          <SectionWrapper>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-maroon-800 to-maroon-700 px-6 py-4">
                <h3 {...websiteContent.props(["about.principal.principal.heading.2"])} className="text-white font-serif font-semibold text-lg">{websiteContent.value("about.principal.principal.heading.2", "Complete List of Headmistresses / Principals")}</h3>
                <p {...websiteContent.props(["about.principal.principal.paragraph.4"])} className="text-white/60 text-sm">{websiteContent.value("about.principal.principal.paragraph.4", "Celebrating 21 years of leadership legacy")}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
                {principals.map((principal, index) => (
                  <button
                    key={index}
                    onClick={() => goToPrincipal(index)}
                    className={`group p-3 rounded-xl text-left transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-gradient-to-r from-maroon-50/80 to-gold-50/80 border-2 border-maroon-300 shadow-md'
                        : 'hover:bg-gray-50 border-2 border-transparent hover:border-gold-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span {...websiteContent.propsFor(principal.number)} className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        index === currentIndex
                          ? 'bg-maroon-700 text-white shadow-md'
                          : 'bg-gray-100 text-gray-500 group-hover:bg-maroon-100 group-hover:text-maroon-700'
                      }`}>
                        {principal.number}
                      </span>
                      <span {...websiteContent.propsFor(principal.name)} className={`text-sm font-medium transition-colors duration-300 ${
                        index === currentIndex
                          ? 'text-maroon-800'
                          : 'text-gray-700 group-hover:text-maroon-700'
                      }`}>
                        {principal.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </SectionWrapper>

          {/* ===== LEGACY MESSAGE ===== */}
          <SectionWrapper>
            <div className="mt-12 bg-gradient-to-r from-maroon-50 to-gold-50/30 rounded-2xl p-8 border border-maroon-100/60 text-center">
              <div className="max-w-3xl mx-auto">
                <div {...websiteContent.props(["about.principal.principal.text.10"])} className="inline-block px-4 py-1 bg-maroon-100/50 border border-maroon-200/50 rounded-full text-xs font-bold text-maroon-700 uppercase tracking-wider mb-4">{websiteContent.value("about.principal.principal.text.10", "Our Legacy")}</div>
                <p {...websiteContent.props(["about.principal.principal.paragraph.5"])} className="text-gray-700 text-lg leading-relaxed">{websiteContent.value("about.principal.principal.paragraph.5", "These remarkable leaders have dedicated their lives to the growth and excellence of St. Mary's Higher Secondary School. Their vision, wisdom, and unwavering commitment have shaped generations of students and built the foundation of our institution's success.")}</p>
                <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-gray-500">
                  <span {...websiteContent.props(["about.principal.principal.text.11"])} className="flex items-center gap-2">
                    <Award size={16} className="text-gold-500" />{websiteContent.value("about.principal.principal.text.11", "21 Leaders")}</span>
                  <span {...websiteContent.props(["about.principal.principal.text.12"])} className="flex items-center gap-2">
                    <Calendar size={16} className="text-gold-500" />{websiteContent.value("about.principal.principal.text.12", "Decades of Service")}</span>
                  <span {...websiteContent.props(["about.principal.principal.text.13"])} className="flex items-center gap-2">
                    <GraduationCap size={16} className="text-gold-500" />{websiteContent.value("about.principal.principal.text.13", "Legacy of Excellence")}</span>
                </div>
              </div>
            </div>
          </SectionWrapper>
        </div>
      </section>
    </div>
  )
}

export default Principal