'use client'

import React from 'react'
import Link from 'next/link'
import { School, Phone, Mail, MapPin, Globe2, MessageCircle, Send, Play, Heart, ChevronRight, LogIn } from 'lucide-react'
import { motion } from 'framer-motion'
import { useWebsiteContent } from '../website-editor/useWebsiteContent.js'

const Footer = () => {
  const websiteContent = useWebsiteContent()

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <footer className="bg-maroon-900 text-white relative overflow-hidden">
      {/* Decorative Top Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-gold-400 to-transparent" />
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-maroon-700/30 rounded-full translate-y-1/2 -translate-x-1/3" />

      <div className="container-custom pt-16 pb-8 relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8"
        >
          {/* About - Column 1 */}
          <motion.div variants={fadeInUp}>
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-gold-500/10 p-2.5 rounded-xl">
                <School size={28} className="text-gold-400" />
              </div>
              <div>
                <h3 {...websiteContent.props(["global.footer.footer.heading"])} className="text-2xl font-serif font-bold text-white">{websiteContent.value("global.footer.footer.heading", "St. Mary's")}</h3>
                <p {...websiteContent.props(["global.footer.footer.paragraph"])} className="text-[10px] text-gold-400 tracking-[0.2em] uppercase font-label">{websiteContent.value("global.footer.footer.paragraph", "Higher Secondary School")}</p>
              </div>
            </div>
            <p {...websiteContent.props(["global.footer.footer.paragraph.2"])} className="text-gray-400 text-sm leading-relaxed max-w-xs">{websiteContent.value("global.footer.footer.paragraph.2", "St. Mary's Higher Secondary School, Guwahati, is committed to providing quality education and fostering holistic development of students since 1924.")}</p>
            <div className="flex gap-3 mt-5">
              {[
                { icon: <Globe2 size={16} />, label: websiteContent.value("global.footer.footer.item1.label", 'Website') },
                { icon: <MessageCircle size={16} />, label: websiteContent.value("global.footer.footer.item2.label", 'WhatsApp') },
                { icon: <Send size={16} />, label: websiteContent.value("global.footer.footer.item3.label", 'Telegram') },
                { icon: <Play size={16} />, label: websiteContent.value("global.footer.footer.item4.label", 'YouTube') }
              ].map((item, index) => (
                <motion.a {...websiteContent.props(["global.footer.footer.href"])}
                  key={index}
                  href={websiteContent.value("global.footer.footer.href", "#")}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 hover:bg-gold-500/20 p-2.5 rounded-xl transition-all duration-300 group"
                  aria-label={item.label}
                >
                  <span {...websiteContent.propsFor(item.icon)} className="text-gray-300 group-hover:text-gold-400 transition-colors duration-300">
                    {item.icon}
                  </span>
                </motion.a>
              ))}
            </div>
            <Link {...websiteContent.props(["global.footer.footer.text"])}
              href="/login"
              className="mt-5 inline-flex items-center gap-2 rounded-md border border-white/20 px-3 py-2 text-xs font-medium text-gray-300 transition-colors hover:border-gold-400/60 hover:bg-white/5 hover:text-gold-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400"
            >
              <LogIn size={14} aria-hidden="true" />{websiteContent.value("global.footer.footer.text", "Admin Login")}</Link>
          </motion.div>

          {/* Quick Links - Column 2 */}
          <motion.div variants={fadeInUp}>
            <h4 {...websiteContent.props(["global.footer.footer.heading.2"])} className="font-serif text-lg font-semibold mb-5 text-white flex items-center gap-2">
              <span className="w-6 h-0.5 bg-gold-400" />{websiteContent.value("global.footer.footer.heading.2", "Quick Links")}</h4>
            <ul className="space-y-3">
              {[
                { to: websiteContent.value("global.footer.footer.item1.to", '/about/founders'), label: websiteContent.value("global.footer.footer.item1.label.2", 'About Us') },
                { to: websiteContent.value("global.footer.footer.item2.to", '/admissions'), label: websiteContent.value("global.footer.footer.item2.label.2", 'Admissions') },
                { to: websiteContent.value("global.footer.footer.item3.to", '/academics/syllabus'), label: websiteContent.value("global.footer.footer.item3.label.2", 'Syllabus') },
                { to: websiteContent.value("global.footer.footer.item4.to", '/gallery'), label: websiteContent.value("global.footer.footer.item4.label.2", 'Gallery') },
                { to: websiteContent.value("global.footer.footer.item5.to", '/contact'), label: websiteContent.value("global.footer.footer.item5.label", 'Contact Us') }
              ].map((item) => (
                <li key={item.to}>
                  <Link 
                    href={item.to} 
                    className="group flex items-center gap-2 text-gray-400 hover:text-gold-400 transition-all duration-300 text-sm"
                  >
                    <ChevronRight size={12} className="text-gold-400/50 group-hover:text-gold-400 group-hover:translate-x-0.5 transition-all duration-300" />
                    <span {...websiteContent.propsFor(item.label)} className="group-hover:translate-x-1 transition-all duration-300">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Academics - Column 3 */}
          <motion.div variants={fadeInUp}>
            <h4 {...websiteContent.props(["global.footer.footer.heading.3"])} className="font-serif text-lg font-semibold mb-5 text-white flex items-center gap-2">
              <span className="w-6 h-0.5 bg-gold-400" />{websiteContent.value("global.footer.footer.heading.3", "Academics")}</h4>
            <ul className="space-y-3">
              {[
                { to: websiteContent.value("global.footer.footer.item1.to.2", '/academics/syllabus'), label: websiteContent.value("global.footer.footer.item1.label.3", 'Syllabus') },
                { to: websiteContent.value("global.footer.footer.item2.to.2", '/academics/evaluation'), label: websiteContent.value("global.footer.footer.item2.label.3", 'Evaluation System') },
                { to: websiteContent.value("global.footer.footer.item3.to.2", '/administration/teaching-staff/primary'), label: websiteContent.value("global.footer.footer.item3.label.3", 'Primary School') },
                { to: websiteContent.value("global.footer.footer.item4.to.2", '/administration/teaching-staff/higher-secondary'), label: websiteContent.value("global.footer.footer.item4.label.3", 'Higher Secondary') }
              ].map((item) => (
                <li key={item.to}>
                  <Link 
                    href={item.to} 
                    className="group flex items-center gap-2 text-gray-400 hover:text-gold-400 transition-all duration-300 text-sm"
                  >
                    <ChevronRight size={12} className="text-gold-400/50 group-hover:text-gold-400 group-hover:translate-x-0.5 transition-all duration-300" />
                    <span {...websiteContent.propsFor(item.label)} className="group-hover:translate-x-1 transition-all duration-300">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact - Column 4 */}
          <motion.div variants={fadeInUp}>
            <h4 {...websiteContent.props(["global.footer.footer.heading.4"])} className="font-serif text-lg font-semibold mb-5 text-white flex items-center gap-2">
              <span className="w-6 h-0.5 bg-gold-400" />{websiteContent.value("global.footer.footer.heading.4", "Contact")}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm group">
                <div className="bg-gold-500/10 p-2 rounded-lg shrink-0 group-hover:bg-gold-500/20 transition-colors duration-300">
                  <MapPin size={16} className="text-gold-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span {...websiteContent.props(["global.footer.footer.text.2"])} className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{websiteContent.value("global.footer.footer.text.2", "Guwahati, Assam - 781001")}</span>
              </li>
              <li className="flex items-center gap-3 text-sm group">
                <div className="bg-gold-500/10 p-2 rounded-lg shrink-0 group-hover:bg-gold-500/20 transition-colors duration-300">
                  <Phone size={16} className="text-gold-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span {...websiteContent.props(["global.footer.footer.text.3"])} className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{websiteContent.value("global.footer.footer.text.3", "+91 9435190537")}</span>
              </li>
              <li className="flex items-center gap-3 text-sm group">
                <div className="bg-gold-500/10 p-2 rounded-lg shrink-0 group-hover:bg-gold-500/20 transition-colors duration-300">
                  <Mail size={16} className="text-gold-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span {...websiteContent.props(["global.footer.footer.text.4"])} className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{websiteContent.value("global.footer.footer.text.4", "stmarysghy1924@yahoo.com")}</span>
              </li>
            </ul>

            {/* Quick Contact Button - CHANGED TO YELLOW */}
            <motion.a {...websiteContent.props(["global.footer.footer.href.3","global.footer.footer.text.5"])}
              href={websiteContent.value("global.footer.footer.href.3", "/contact")}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-yellow-400 text-maroon-900 rounded-lg font-semibold font-label text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
            >{websiteContent.value("global.footer.footer.text.5", "Get in Touch")}<ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p {...websiteContent.props(["global.footer.footer.paragraph.4"])} className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()}{websiteContent.value("global.footer.footer.paragraph.4", " St. Mary's Higher Secondary School. All rights reserved.")}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span {...websiteContent.props(["global.footer.footer.text.6"])}>{websiteContent.value("global.footer.footer.text.6", "Privacy Policy")}</span>
            <span className="w-px h-4 bg-white/10" />
            <span {...websiteContent.props(["global.footer.footer.text.7"])}>{websiteContent.value("global.footer.footer.text.7", "Terms of Service")}</span>
            <span className="w-px h-4 bg-white/10" />
            <span {...websiteContent.props(["global.footer.footer.text.8","global.footer.footer.text.9"])} className="flex items-center gap-1">{websiteContent.value("global.footer.footer.text.8", "Made with ")}{websiteContent.value("global.footer.footer.text.9", " in Assam") && <Heart size={12} className="text-gold-400 animate-pulse" />}{websiteContent.value("global.footer.footer.text.9", " in Assam")}</span>
          </div>
        </motion.div>
      </div>

      <style>{`
        .font-label {
          font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
        }
        .font-serif {
          font-family: 'Fraunces', Georgia, serif;
        }
      `}</style>
    </footer>
  )
}

export default Footer
