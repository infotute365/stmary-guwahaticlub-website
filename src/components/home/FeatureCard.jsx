'use client'

import React, { useState } from 'react'
import {
  GraduationCap, Building2, FlaskConical, Code, Users, Trophy,
  ArrowRight, Star, Sparkles, Award
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useWebsiteContent } from '../website-editor/useWebsiteContent.js'

const FeatureCard = () => {
  const websiteContent = useWebsiteContent()

  const [hoveredIndex, setHoveredIndex] = useState(null)

  const features = [
    {
      icon: <GraduationCap size={22} />,
      title: websiteContent.value("home.feature-card.features.item1.title", 'Academic Excellence'),
      description: websiteContent.value("home.feature-card.features.item1.description", 'Our curriculum is designed to foster critical thinking, creativity, and a love for learning in every student.'),
      image: websiteContent.value("home.feature-card.features.item1.image", 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80'),
      accent: '#7A0C1E',
      lightAccent: '#fdf2f3',
      stats: websiteContent.value("home.feature-card.features.item1.stats", '98% Pass Rate'),
      tag: websiteContent.value("home.feature-card.features.item1.tag", 'Top Rated')
    },
    {
      icon: <Building2 size={22} />,
      title: websiteContent.value("home.feature-card.features.item2.title", 'Modern Infrastructure'),
      description: websiteContent.value("home.feature-card.features.item2.description", 'State-of-the-art classrooms, laboratories, library, and sports facilities for holistic development.'),
      image: websiteContent.value("home.feature-card.features.item2.image", 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80'),
      accent: '#8a1e2a',
      lightAccent: '#fbe6e8',
      stats: websiteContent.value("home.feature-card.features.item2.stats", '25+ Facilities'),
      tag: websiteContent.value("home.feature-card.features.item2.tag", 'Smart Campus')
    },
    {
      icon: <FlaskConical size={22} />,
      title: websiteContent.value("home.feature-card.features.item3.title", 'Science & Innovation'),
      description: websiteContent.value("home.feature-card.features.item3.description", 'Well-equipped science labs and innovation centers to nurture young scientists and inventors.'),
      image: websiteContent.value("home.feature-card.features.item3.image", 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80'),
      accent: '#b02d3a',
      lightAccent: '#f5c9cd',
      stats: websiteContent.value("home.feature-card.features.item3.stats", '12+ Labs'),
      tag: websiteContent.value("home.feature-card.features.item3.tag", 'Innovation Hub')
    },
    {
      icon: <Code size={22} />,
      title: websiteContent.value("home.feature-card.features.item4.title", 'Computer Education'),
      description: websiteContent.value("home.feature-card.features.item4.description", 'Comprehensive computer science education from basic programming to advanced AI concepts.'),
      image: websiteContent.value("home.feature-card.features.item4.image", 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80'),
      accent: '#c94a54',
      lightAccent: '#ed9fa5',
      stats: websiteContent.value("home.feature-card.features.item4.stats", 'AI & ML Ready'),
      tag: websiteContent.value("home.feature-card.features.item4.tag", 'Future Ready')
    },
    {
      icon: <Users size={22} />,
      title: websiteContent.value("home.feature-card.features.item5.title", 'Community & Values'),
      description: websiteContent.value("home.feature-card.features.item5.description", 'A nurturing environment that promotes values, discipline, and social responsibility.'),
      image: websiteContent.value("home.feature-card.features.item5.image", 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80'),
      accent: '#8a1e2a',
      lightAccent: '#fbe6e8',
      stats: websiteContent.value("home.feature-card.features.item5.stats", '2,500+ Students'),
      tag: websiteContent.value("home.feature-card.features.item5.tag", 'Family First')
    },
    {
      icon: <Trophy size={22} />,
      title: websiteContent.value("home.feature-card.features.item6.title", 'Extracurricular Activities'),
      description: websiteContent.value("home.feature-card.features.item6.description", 'Wide range of activities including sports, arts, clubs, and cultural events for overall growth.'),
      image: websiteContent.value("home.feature-card.features.item6.image", 'https://images.unsplash.com/photo-1461896836934-bd09ba8b1782?w=800&q=80'),
      accent: '#D9A441',
      lightAccent: '#fdf8ef',
      stats: websiteContent.value("home.feature-card.features.item6.stats", '50+ Activities'),
      tag: websiteContent.value("home.feature-card.features.item6.tag", 'All Rounder')
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6, 
        ease: [0.4, 0, 0.2, 1] 
      }
    }
  }

  const shimmerVariants = {
    hover: {
      x: ["0%", "100%"],
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          variants={cardVariants}
          whileHover={{ y: -10 }}
          transition={{ duration: 0.3 }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="group relative bg-white rounded-3xl shadow-lg hover:shadow-3xl transition-all duration-500 overflow-hidden border border-gray-100/80 hover:border-gold-300/60"
        >
          {/* Decorative corner glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold-100/0 to-gold-100/0 group-hover:from-gold-100/20 group-hover:to-gold-100/20 rounded-tr-3xl transition-all duration-700 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-maroon-100/0 to-maroon-100/0 group-hover:from-maroon-100/20 group-hover:to-maroon-100/20 rounded-bl-3xl transition-all duration-700 pointer-events-none" />

          {/* Image Header */}
          <div className="relative h-48 overflow-hidden">
            <img {...websiteContent.imageProps(feature.image)}
              src={feature.image}
              alt={feature.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Premium Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/70 via-maroon-900/20 to-transparent" />
            
            {/* Shimmer Effect */}
            <motion.div
              variants={shimmerVariants}
              initial={{ x: "-100%" }}
              whileHover="hover"
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
            />

            {/* Number Tag - Premium Style */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <span className="text-[10px] font-bold text-white/60">
                {(index + 1).toString().padStart(2, '0')}
              </span>
              <div className="w-px h-4 bg-white/20" />
              <span {...websiteContent.props(["home.feature-card.feature-card.text"])} className="text-[10px] font-semibold text-gold-300">{websiteContent.value("home.feature-card.feature-card.text", "Featured")}</span>
            </div>

            {/* Tag Badge - Premium */}
            <div className="absolute top-4 right-4 bg-gold-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
              <span {...websiteContent.propsFor(feature.tag)} className="flex items-center gap-1.5 text-[10px] font-bold text-maroon-900">
                <Sparkles size={11} />
                {feature.tag}
              </span>
            </div>

            {/* Stats Badge - Bottom */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full shadow-lg">
              <span {...websiteContent.propsFor(feature.stats)} className="flex items-center gap-1.5 text-xs font-semibold text-maroon-800">
                <Star size={13} className="text-gold-500 fill-gold-400" />
                {feature.stats}
              </span>
            </div>
          </div>

          {/* Icon Badge - Overlapping */}
          <div className="relative px-6 pt-0">
            <div {...websiteContent.propsFor(feature.icon)}
              className="absolute -top-6 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl ring-4 ring-white transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl"
              style={{ backgroundColor: feature.accent }}
            >
              {feature.icon}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pt-10 pb-6">
            <h3 {...websiteContent.propsFor(feature.title)} className="font-display font-bold text-xl text-maroon-900 mb-2.5 group-hover:text-maroon-700 transition-colors duration-300">
              {feature.title}
            </h3>
            
            {/* Premium Underline */}
            <div className="w-12 h-0.5 bg-gradient-to-r from-gold-400 to-gold-500 rounded-full mb-3 group-hover:w-20 transition-all duration-700" />
            
            <p {...websiteContent.propsFor(feature.description)} className="text-gray-600 text-sm leading-relaxed">
              {feature.description}
            </p>

            {/* Learn More - Premium Style */}
            <div className="mt-5 flex items-center gap-3">
              <div
                className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3 cursor-pointer"
                style={{ color: feature.accent }}
              >
                <span {...websiteContent.props(["home.feature-card.feature-card.text.2"])}>{websiteContent.value("home.feature-card.feature-card.text.2", "Learn More")}</span>
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </div>
              
              {/* Decorative dot */}
              <div 
                className="w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: feature.accent }}
              />
            </div>
          </div>

          {/* Bottom Accent Bar - Premium */}
          <div
            className="h-1 w-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-out"
            style={{ backgroundColor: feature.accent }}
          />
          
          {/* Second accent bar - gold */}
          <div
            className="h-0.5 w-0 group-hover:w-full origin-right transition-all duration-700 delay-100 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent"
          />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default FeatureCard