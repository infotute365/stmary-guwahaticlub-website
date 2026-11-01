'use client'

import React from 'react'
import { motion } from 'framer-motion'
import SectionWrapper from '../../components/common/SectionWrapper.jsx'
import Accordion from '../../components/common/Accordion.jsx'
import { ClipboardCheck, BookOpen, GraduationCap, BarChart, Award, Calendar, Sparkles } from 'lucide-react'
import { useWebsiteContent } from '../../components/website-editor/useWebsiteContent.js'

const Evaluation = () => {
  const websiteContent = useWebsiteContent()

  const evaluationDetails = [
    {
      title: websiteContent.value("academics.evaluation.evaluation-details.item1.title", 'Continuous Assessment (CA)'),
      content: websiteContent.value("academics.evaluation.evaluation-details.item1.content", 'Contineous assessment consists of various projects assignment and co-curricular activities taken part by the student throughout the academic year')
    },
    {
      title: websiteContent.value("academics.evaluation.evaluation-details.item2.title", 'Unit-Test-One'),
      content: websiteContent.value("academics.evaluation.evaluation-details.item2.content", 'The unit test one examination is conducted in the month of june out of 50 marks.')
    },
    {
      title: websiteContent.value("academics.evaluation.evaluation-details.item3.title", 'Half yearly examination'),
      content: websiteContent.value("academics.evaluation.evaluation-details.item3.content", 'The half yearly examination is conducted in the month of September/October. The examination is being conducted out of 100 marks.')
    },
    {
      title: websiteContent.value("academics.evaluation.evaluation-details.item4.title", 'Unit-test-two'),
      content: websiteContent.value("academics.evaluation.evaluation-details.item4.content", 'The unit test one examination is conducted in the month of December out of 50 marks.')
    },
    {
      title: websiteContent.value("academics.evaluation.evaluation-details.item5.title", 'Annual examination'),
      content: websiteContent.value("academics.evaluation.evaluation-details.item5.content", 'The Annual examination is conducted in the month of mid Feb to march , out of 100 marks')
    }
  ]

  const assessmentTypes = [
    {
      title: websiteContent.value("academics.evaluation.assessment-types.item1.title", 'Formative Assessment'),
      description: websiteContent.value("academics.evaluation.assessment-types.item1.description", 'Conducted throughout the academic session through observations, worksheets, quizzes, and class activities to monitor day-to-day learning progress.')
    },
    {
      title: websiteContent.value("academics.evaluation.assessment-types.item2.title", 'Summative Assessment'),
      description: websiteContent.value("academics.evaluation.assessment-types.item2.description", 'End-term evaluations that test the cumulative knowledge and understanding of the subjects covered during the academic period.')
    },
    {
      title: websiteContent.value("academics.evaluation.assessment-types.item3.title", 'Practical Assessment'),
      description: websiteContent.value("academics.evaluation.assessment-types.item3.description", 'For subjects like Science, Computer Science, and AI, practical assessments evaluate hands-on skills, experimentation, and application of concepts.')
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-maroon-900 h-[30vh] min-h-55 max-h-70">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-300 rounded-full translate-y-1/2 -translate-x-1/3" />
        </div>

        {/* Background Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span {...websiteContent.props(["academics.evaluation.evaluation.text"])} className="text-[80px] md:text-[120px] font-serif font-bold text-white/5 tracking-[0.3em] select-none">{websiteContent.value("academics.evaluation.evaluation.text", "EVALUATION")}</span>
        </div>

        <div className="container-custom relative h-full flex items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-2"
            >
              <ClipboardCheck size={18} className="text-gold-400" />
              <span {...websiteContent.props(["academics.evaluation.evaluation.text.2"])} className="text-xs font-semibold text-gold-400 tracking-[0.2em] uppercase">{websiteContent.value("academics.evaluation.evaluation.text.2", "Assessment")}</span>
            </motion.div>

            <motion.h1 {...websiteContent.props(["academics.evaluation.evaluation.heading"])}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white"
            >{websiteContent.value("academics.evaluation.evaluation.heading", "Evaluation of ")}<span {...websiteContent.props(["academics.evaluation.evaluation.text.3"])} className="text-gold-400">{websiteContent.value("academics.evaluation.evaluation.text.3", "Examination")}</span>
            </motion.h1>

            <motion.p {...websiteContent.props(["academics.evaluation.evaluation.paragraph"])}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-white/50 text-sm mt-1"
            >{websiteContent.value("academics.evaluation.evaluation.paragraph", "Understanding our assessment system")}</motion.p>
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
              <BarChart size={14} className="text-maroon-700" />
              <span {...websiteContent.props(["academics.evaluation.evaluation.text.4"])} className="text-xs font-semibold text-maroon-700 tracking-widest uppercase">{websiteContent.value("academics.evaluation.evaluation.text.4", "Assessment System")}</span>
            </div>
            <p {...websiteContent.props(["academics.evaluation.evaluation.paragraph.2"])} className="text-gray-600 text-lg leading-relaxed">{websiteContent.value("academics.evaluation.evaluation.paragraph.2", "At St. Mary's, we follow a comprehensive evaluation system designed to assess students' knowledge, understanding, and application skills effectively.")}</p>
          </motion.div>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {assessmentTypes.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 text-center hover:shadow-xl transition-all duration-300 hover:border-gold-300 group">
                  <div className="w-12 h-12 rounded-full bg-maroon-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-maroon-200 transition-colors">
                    {index === 0 && <BookOpen size={22} className="text-maroon-700" />}
                    {index === 1 && <GraduationCap size={22} className="text-maroon-700" />}
                    {index === 2 && <ClipboardCheck size={22} className="text-maroon-700" />}
                  </div>
                  <h3 {...websiteContent.propsFor(item.title)} className="font-serif font-bold text-maroon-800 text-xl group-hover:text-gold-600 transition-colors">
                    {item.title}
                  </h3>
                  <p {...websiteContent.propsFor(item.description)} className="text-gray-600 text-sm mt-2 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <SectionWrapper>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:border-gold-200 transition-all duration-300"
            >
              <h2 {...websiteContent.props(["academics.evaluation.evaluation.heading.2"])} className="text-2xl font-serif font-bold text-maroon-800 mb-6 flex items-center gap-2">
                <Award size={24} className="text-gold-500" />{websiteContent.value("academics.evaluation.evaluation.heading.2", "Detailed Evaluation Structure")}</h2>
              <Accordion items={evaluationDetails} />
            </motion.div>
          </SectionWrapper>

          <SectionWrapper className="mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-maroon-50 rounded-xl p-8 border border-maroon-100"
            >
              <h3 {...websiteContent.props(["academics.evaluation.evaluation.heading.3"])} className="font-serif font-bold text-maroon-800 text-xl text-center flex items-center justify-center gap-2">
                <BarChart size={24} className="text-gold-500" />{websiteContent.value("academics.evaluation.evaluation.heading.3", "Assessment Weightage Distribution")}</h3>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:border-gold-300 border-2 border-transparent">
                  <div {...websiteContent.props(["academics.evaluation.evaluation.text.5"])} className="text-3xl font-bold text-maroon-700">{websiteContent.value("academics.evaluation.evaluation.text.5", "20%")}</div>
                  <p {...websiteContent.props(["academics.evaluation.evaluation.paragraph.3"])} className="text-sm text-gray-600 font-medium">{websiteContent.value("academics.evaluation.evaluation.paragraph.3", "Continuous Assessment")}</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:border-gold-300 border-2 border-transparent">
                  <div {...websiteContent.props(["academics.evaluation.evaluation.text.6"])} className="text-3xl font-bold text-maroon-700">{websiteContent.value("academics.evaluation.evaluation.text.6", "30%")}</div>
                  <p {...websiteContent.props(["academics.evaluation.evaluation.paragraph.4"])} className="text-sm text-gray-600 font-medium">{websiteContent.value("academics.evaluation.evaluation.paragraph.4", "Half-Yearly")}</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:border-gold-300 border-2 border-transparent">
                  <div {...websiteContent.props(["academics.evaluation.evaluation.text.7"])} className="text-3xl font-bold text-maroon-700">{websiteContent.value("academics.evaluation.evaluation.text.7", "50%")}</div>
                  <p {...websiteContent.props(["academics.evaluation.evaluation.paragraph.5"])} className="text-sm text-gray-600 font-medium">{websiteContent.value("academics.evaluation.evaluation.paragraph.5", "Annual Examination")}</p>
                </div>
                <div className="bg-linear-to-r from-gold-500 to-gold-600 rounded-lg p-4 text-center shadow-sm border-2 border-gold-400 hover:shadow-lg transition-all duration-300">
                  <div {...websiteContent.props(["academics.evaluation.evaluation.text.8"])} className="text-3xl font-bold text-black">{websiteContent.value("academics.evaluation.evaluation.text.8", "100%")}</div>
                  <p {...websiteContent.props(["academics.evaluation.evaluation.paragraph.6"])} className="text-m text-black font-medium">{websiteContent.value("academics.evaluation.evaluation.paragraph.6", "Total Marks")}</p>
                </div>
              </div>
            </motion.div>
          </SectionWrapper>
        </div>
      </section>
    </div>
  )
}

export default Evaluation