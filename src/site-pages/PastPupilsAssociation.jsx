'use client'

import React from 'react'
import PageHeader from '../components/common/PageHeader.jsx'
import SectionWrapper from '../components/common/SectionWrapper.jsx'
import Card from '../components/common/Card.jsx'
import { Users, Mail, Calendar, Building2, Award, Heart } from 'lucide-react'
import { useWebsiteContent } from '../components/website-editor/useWebsiteContent.js'

const PastPupilsAssociation = () => {
  const websiteContent = useWebsiteContent()

  const testimonials = [
    {
      name: websiteContent.value("past.pupils.testimonials.item1.name", 'Dr. Ritu Sharma'),
      year: websiteContent.value("past.pupils.testimonials.item1.year", '2005'),
      profession: websiteContent.value("past.pupils.testimonials.item1.profession", 'Software Engineer at Google'),
      message: websiteContent.value("past.pupils.testimonials.item1.message", 'St. Mary\'s gave me the foundation that made my career in technology possible. The values and discipline I learned here continue to guide me.')
    },
    {
      name: websiteContent.value("past.pupils.testimonials.item2.name", 'Mr. Anupam Das'),
      year: websiteContent.value("past.pupils.testimonials.item2.year", '2008'),
      profession: websiteContent.value("past.pupils.testimonials.item2.profession", 'Entrepreneur & CEO'),
      message: websiteContent.value("past.pupils.testimonials.item2.message", 'The entrepreneurial spirit was nurtured at St. Mary\'s. The teachers encouraged us to think beyond textbooks and explore real-world applications.')
    },
    {
      name: websiteContent.value("past.pupils.testimonials.item3.name", 'Ms. Priya Patel'),
      year: websiteContent.value("past.pupils.testimonials.item3.year", '2010'),
      profession: websiteContent.value("past.pupils.testimonials.item3.profession", 'Medical Professional'),
      message: websiteContent.value("past.pupils.testimonials.item3.message", 'The emphasis on science education and ethical values at St. Mary\'s inspired me to pursue a career in healthcare and serve the community.')
    }
  ]

  return (
    <div>
      <PageHeader {...websiteContent.props(["past.pupils.past-pupils-association.title","past.pupils.past-pupils-association.subtitle"])}
        title={websiteContent.value("past.pupils.past-pupils-association.title", "Past Pupils Association")}
        subtitle={websiteContent.value("past.pupils.past-pupils-association.subtitle", "Alumni network connecting generations")}
        breadcrumb={[{ label: websiteContent.value("past.pupils.past-pupils-association.item1.breadcrumb", 'Past Pupils Association') }]}
      />
      <section className="section-padding">
        <div className="container-custom">
          <SectionWrapper className="text-center max-w-3xl mx-auto mb-12">
            <p {...websiteContent.props(["past.pupils.past-pupils-association.paragraph"])} className="text-gray-600 text-lg">{websiteContent.value("past.pupils.past-pupils-association.paragraph", "The Past Pupils Association (PPA) of St. Mary's is a vibrant community of former students who continue to contribute to the school's growth and maintain lifelong bonds with their alma mater.")}</p>
          </SectionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: <Users size={24} />, label: websiteContent.value("past.pupils.past-pupils-association.item1.label", 'Active Members'), value: websiteContent.value("past.pupils.past-pupils-association.item1.value", '500+') },
              { icon: <Calendar size={24} />, label: websiteContent.value("past.pupils.past-pupils-association.item2.label", 'Annual Reunions'), value: websiteContent.value("past.pupils.past-pupils-association.item2.value", '10+') },
              { icon: <Award size={24} />, label: websiteContent.value("past.pupils.past-pupils-association.item3.label", 'Scholarships'), value: websiteContent.value("past.pupils.past-pupils-association.item3.value", '25+') },
              { icon: <Heart size={24} />, label: websiteContent.value("past.pupils.past-pupils-association.item4.label", 'Years of Legacy'), value: websiteContent.value("past.pupils.past-pupils-association.item4.value", '50') }
            ].map((stat, index) => (
              <SectionWrapper key={index} delay={index * 0.05}>
                <Card className="p-6 text-center">
                  <div {...websiteContent.propsFor(stat.icon)} className="text-maroon-700 flex justify-center mb-2">{stat.icon}</div>
                  <div {...websiteContent.propsFor(stat.value)} className="text-2xl font-bold text-maroon-800">{stat.value}</div>
                  <p {...websiteContent.propsFor(stat.label)} className="text-gray-600 text-sm">{stat.label}</p>
                </Card>
              </SectionWrapper>
            ))}
          </div>

          <SectionWrapper>
            <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
              <h2 {...websiteContent.props(["past.pupils.past-pupils-association.heading"])} className="text-2xl font-serif font-bold text-maroon-800 text-center mb-6">{websiteContent.value("past.pupils.past-pupils-association.heading", "Why Join the Past Pupils Association?")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Building2 size={28} />,
                    title: websiteContent.value("past.pupils.past-pupils-association.item1.title", 'Stay Connected'),
                    description: websiteContent.value("past.pupils.past-pupils-association.item1.description", 'Connect with old friends, teachers, and stay updated on school events and developments.')
                  },
                  {
                    icon: <Users size={28} />,
                    title: websiteContent.value("past.pupils.past-pupils-association.item2.title", 'Network & Mentor'),
                    description: websiteContent.value("past.pupils.past-pupils-association.item2.description", 'Access to a network of professionals across various fields and opportunities to mentor current students.')
                  },
                  {
                    icon: <Heart size={28} />,
                    title: websiteContent.value("past.pupils.past-pupils-association.item3.title", 'Give Back'),
                    description: websiteContent.value("past.pupils.past-pupils-association.item3.description", 'Contribute to school development, scholarships, and support initiatives that benefit current students.')
                  }
                ].map((item, index) => (
                  <div key={index} className="text-center p-4 rounded-lg bg-gray-50">
                    <div {...websiteContent.propsFor(item.icon)} className="text-maroon-700 flex justify-center mb-3">{item.icon}</div>
                    <h3 {...websiteContent.propsFor(item.title)} className="font-serif font-semibold text-maroon-800">{item.title}</h3>
                    <p {...websiteContent.propsFor(item.description)} className="text-gray-600 text-sm mt-1">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper>
            <div className="bg-gradient-to-r from-maroon-800 to-maroon-700 text-white rounded-xl p-8 text-center">
              <h3 {...websiteContent.props(["past.pupils.past-pupils-association.heading.2"])} className="font-serif font-bold text-2xl mb-3">{websiteContent.value("past.pupils.past-pupils-association.heading.2", "Alumni Testimonials")}</h3>
              <p {...websiteContent.props(["past.pupils.past-pupils-association.paragraph.2"])} className="text-white/80 mb-8">{websiteContent.value("past.pupils.past-pupils-association.paragraph.2", "Hear from our distinguished alumni")}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-left">
                    <p {...websiteContent.propsFor(testimonial.message)} className="text-white/90 text-sm italic leading-relaxed">"{testimonial.message}"</p>
                    <div className="mt-4">
                      <p {...websiteContent.propsFor(testimonial.name)} className="font-semibold text-gold-400">{testimonial.name}</p>
                      <p {...websiteContent.propsFor(testimonial.profession)} className="text-white/60 text-xs">{testimonial.profession}</p>
                      <p {...websiteContent.props(["past.pupils.past-pupils-association.paragraph.5"])} className="text-white/40 text-xs">{websiteContent.value("past.pupils.past-pupils-association.paragraph.5", "Batch: ")}{testimonial.year}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <a {...websiteContent.props(["past.pupils.past-pupils-association.href","past.pupils.past-pupils-association.text"])}
                  href={websiteContent.value("past.pupils.past-pupils-association.href", "/contact")}
                  className="inline-block bg-gold-500 text-maroon-900 px-8 py-3 rounded-lg font-semibold hover:bg-gold-400 transition-colors"
                >{websiteContent.value("past.pupils.past-pupils-association.text", "Join the Association")}</a>
              </div>
            </div>
          </SectionWrapper>
        </div>
      </section>
    </div>
  )
}

export default PastPupilsAssociation