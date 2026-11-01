'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Award, Building2, GraduationCap, Computer, Sparkles, Crown, Heart, MapPin, Users, BookOpen, Star, Rocket } from 'lucide-react'
import { useWebsiteContent } from '../../components/website-editor/useWebsiteContent.js'

const OurJourney = () => {
  const websiteContent = useWebsiteContent()

  const milestones = [
    { 
      year: websiteContent.value("about.journey.milestones.item1.year", '1924'),
      title: websiteContent.value("about.journey.milestones.item1.title", 'Foundation'),
      description: websiteContent.value("about.journey.milestones.item1.description", 'St. Mary\'s Higher Secondary School was established with a vision to provide quality education rooted in Christian values.'),
      icon: <Building2 size={24} />,
      image: websiteContent.value("about.journey.milestones.item1.image", 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=400&h=300&fit=crop&crop=center')
    },
    { 
      year: websiteContent.value("about.journey.milestones.item2.year", '1930'),
      title: websiteContent.value("about.journey.milestones.item2.title", 'First Batch'),
      description: websiteContent.value("about.journey.milestones.item2.description", 'The first batch of students graduated from the school, marking the beginning of a legacy of academic excellence.'),
      icon: <GraduationCap size={24} />,
      image: websiteContent.value("about.journey.milestones.item2.image", 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=400&h=300&fit=crop&crop=center')
    },
    { 
      year: websiteContent.value("about.journey.milestones.item3.year", '1950'),
      title: websiteContent.value("about.journey.milestones.item3.title", 'Infrastructure Expansion'),
      description: websiteContent.value("about.journey.milestones.item3.description", 'New buildings, classrooms, and facilities were added to accommodate the growing student population.'),
      icon: <Building2 size={24} />,
      image: websiteContent.value("about.journey.milestones.item3.image", 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop&crop=center')
    },
    { 
      year: websiteContent.value("about.journey.milestones.item4.year", '1975'),
      title: websiteContent.value("about.journey.milestones.item4.title", 'Golden Jubilee'),
      description: websiteContent.value("about.journey.milestones.item4.description", 'Celebrated 50 years of excellence in education with the entire school community and alumni.'),
      icon: <Award size={24} />,
      image: websiteContent.value("about.journey.milestones.item4.image", 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop&crop=center')
    },
    { 
      year: websiteContent.value("about.journey.milestones.item5.year", '1990'),
      title: websiteContent.value("about.journey.milestones.item5.title", 'Computer Education'),
      description: websiteContent.value("about.journey.milestones.item5.description", 'Introduced computer science education with state-of-the-art computer labs and IT infrastructure.'),
      icon: <Computer size={24} />,
      image: websiteContent.value("about.journey.milestones.item5.image", 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop&crop=center')
    },
    { 
      year: websiteContent.value("about.journey.milestones.item6.year", '2000'),
      title: websiteContent.value("about.journey.milestones.item6.title", 'Digital Transformation'),
      description: websiteContent.value("about.journey.milestones.item6.description", 'Modernized teaching methods with smart classrooms, digital content, and technology-enabled learning.'),
      icon: <Rocket size={24} />,
      image: websiteContent.value("about.journey.milestones.item6.image", 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop&crop=center')
    },
    { 
      year: websiteContent.value("about.journey.milestones.item7.year", '2010'),
      title: websiteContent.value("about.journey.milestones.item7.title", 'Global Recognition'),
      description: websiteContent.value("about.journey.milestones.item7.description", 'St. Mary\'s achieved recognition as one of the top educational institutions in the region.'),
      icon: <Star size={24} />,
      image: websiteContent.value("about.journey.milestones.item7.image", 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=400&h=300&fit=crop&crop=center')
    },
    { 
      year: websiteContent.value("about.journey.milestones.item8.year", '2024'),
      title: websiteContent.value("about.journey.milestones.item8.title", 'Century Legacy'),
      description: websiteContent.value("about.journey.milestones.item8.description", 'Celebrating 100 years of educational excellence, shaping young minds and building a legacy for generations to come.'),
      icon: <Crown size={24} />,
      image: websiteContent.value("about.journey.milestones.item8.image", 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop&crop=center')
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-maroon-900 h-[30vh] min-h-[220px] max-h-[280px]">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-300 rounded-full translate-y-1/2 -translate-x-1/3" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span {...websiteContent.props(["about.journey.our-journey.text"])} className="text-[80px] md:text-[120px] font-serif font-bold text-white/5 tracking-[0.3em] select-none">{websiteContent.value("about.journey.our-journey.text", "JOURNEY")}</span>
        </div>

        <div className="container-custom relative h-full flex items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-2"
            >
              <Calendar size={18} className="text-gold-400" />
              <span {...websiteContent.props(["about.journey.our-journey.text.2"])} className="text-xs font-semibold text-gold-400 tracking-[0.2em] uppercase">{websiteContent.value("about.journey.our-journey.text.2", "1924 - 2024")}</span>
            </motion.div>

            <motion.h1 {...websiteContent.props(["about.journey.our-journey.heading"])}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white"
            >{websiteContent.value("about.journey.our-journey.heading", "Our ")}<span {...websiteContent.props(["about.journey.our-journey.text.3"])} className="text-gold-400">{websiteContent.value("about.journey.our-journey.text.3", "Journey")}</span>
            </motion.h1>

            <motion.p {...websiteContent.props(["about.journey.our-journey.paragraph"])}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-white/50 text-sm mt-1"
            >{websiteContent.value("about.journey.our-journey.paragraph", "100 years of educational excellence")}</motion.p>
          </div>
        </div>

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
            <div className="inline-flex items-center gap-2 bg-maroon-50 border border-maroon-100 rounded-full px-4 py-1.5 mb-4">
              <Sparkles size={14} className="text-gold-500" />
              <span {...websiteContent.props(["about.journey.our-journey.text.4"])} className="text-xs font-semibold text-maroon-700 tracking-widest uppercase">{websiteContent.value("about.journey.our-journey.text.4", "Our Legacy")}</span>
            </div>
            <p {...websiteContent.props(["about.journey.our-journey.paragraph.2"])} className="text-gray-600 text-lg leading-relaxed">{websiteContent.value("about.journey.our-journey.paragraph.2", "Since 1924, St. Mary's Higher Secondary School has been on a remarkable journey of educational excellence. From humble beginnings to becoming a premier institution, our story is one of dedication, growth, and unwavering commitment to quality education.")}</p>
          </motion.div>
        </div>
      </section>

      {/* ===== MILESTONES GRID ===== */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="group"
              >
                <div className="bg-white rounded-2xl border border-gray-100 hover:border-gold-300 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden h-full">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    <img {...websiteContent.imageProps(milestone.image)}
                      src={milestone.image}
                      alt={milestone.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span {...websiteContent.propsFor(milestone.year)} className="inline-block bg-gold-500 text-maroon-900 text-xs font-bold px-3 py-1 rounded-full">
                        {milestone.year}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg">
                      <span {...websiteContent.propsFor(milestone.icon)} className="text-maroon-700">{milestone.icon}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 {...websiteContent.propsFor(milestone.title)} className="font-serif font-bold text-lg text-maroon-900 mb-2 group-hover:text-maroon-700 transition-colors duration-300">
                      {milestone.title}
                    </h3>
                    <p {...websiteContent.propsFor(milestone.description)} className="text-gray-600 text-sm leading-relaxed">
                      {milestone.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-gold-500 font-semibold">●</span>
                      <span {...websiteContent.props(["about.journey.our-journey.text.6"])} className="text-xs text-gray-400">{websiteContent.value("about.journey.our-journey.text.6", "Legacy Milestone")}</span>
                    </div>
                  </div>

                  {/* Bottom Accent */}
                  <div className="h-0.5 bg-gradient-to-r from-gold-400 to-gold-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="py-12 bg-maroon-50 border-y border-maroon-100">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { icon: <Calendar size={20} />, value: websiteContent.value("about.journey.our-journey.item1.value", '1924'), label: websiteContent.value("about.journey.our-journey.item1.label", 'Founded') },
              { icon: <Users size={20} />, value: websiteContent.value("about.journey.our-journey.item2.value", '2500+'), label: websiteContent.value("about.journey.our-journey.item2.label", 'Students') },
              { icon: <Award size={20} />, value: websiteContent.value("about.journey.our-journey.item3.value", '100+'), label: websiteContent.value("about.journey.our-journey.item3.label", 'Awards Won') },
              { icon: <GraduationCap size={20} />, value: websiteContent.value("about.journey.our-journey.item4.value", '50+'), label: websiteContent.value("about.journey.our-journey.item4.label", 'Years Legacy') }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div {...websiteContent.propsFor(stat.icon)} className="text-gold-500 flex justify-center mb-2">{stat.icon}</div>
                <div {...websiteContent.propsFor(stat.value)} className="text-2xl font-serif font-bold text-maroon-900">{stat.value}</div>
                <div {...websiteContent.propsFor(stat.label)} className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart size={22} className="text-rose-400" />
              <span {...websiteContent.props(["about.journey.our-journey.text.7"])} className="text-xs font-semibold text-maroon-700 tracking-widest uppercase">{websiteContent.value("about.journey.our-journey.text.7", "Continuing the Legacy")}</span>
            </div>
            <h3 {...websiteContent.props(["about.journey.our-journey.heading.2"])} className="text-2xl md:text-3xl font-serif font-bold text-maroon-900 mb-4">{websiteContent.value("about.journey.our-journey.heading.2", "Join Us in ")}<span {...websiteContent.props(["about.journey.our-journey.text.8"])} className="text-gold-600">{websiteContent.value("about.journey.our-journey.text.8", "Shaping the Future")}</span>
            </h3>
            <p {...websiteContent.props(["about.journey.our-journey.paragraph.3"])} className="text-gray-600 text-base leading-relaxed">{websiteContent.value("about.journey.our-journey.paragraph.3", "As we celebrate our rich history, we continue to build on our legacy of excellence, nurturing young minds and preparing them for the challenges of tomorrow.")}</p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <a {...websiteContent.props(["about.journey.our-journey.href","about.journey.our-journey.text.9"])}
                href={websiteContent.value("about.journey.our-journey.href", "/about/founders")}
                className="inline-flex items-center gap-2 bg-maroon-800 hover:bg-maroon-700 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg text-sm"
              >{websiteContent.value("about.journey.our-journey.text.9", "Meet Our Founders")}<Sparkles size={14} />
              </a>
              <a {...websiteContent.props(["about.journey.our-journey.href.2","about.journey.our-journey.text.10"])}
                href={websiteContent.value("about.journey.our-journey.href.2", "/admissions")}
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-maroon-800 px-6 py-2.5 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg border border-gray-200 text-sm"
              >{websiteContent.value("about.journey.our-journey.text.10", "Join Our Family")}<span>→</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default OurJourney