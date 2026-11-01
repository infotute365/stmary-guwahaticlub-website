'use client'

// import React, { useState } from 'react'
// import { motion } from 'framer-motion'
// import { FileText, Users, BookOpen, CheckCircle, Calendar, IndianRupee, Download, GraduationCap } from 'lucide-react'
// import SectionWrapper from '../../components/common/SectionWrapper.jsx'
// import Accordion from '../../components/common/Accordion.jsx'

// const Admission = () => {
//   const [activeTab, setActiveTab] = useState('eligibility')

//   const faqItems = [
//     {
//       title: 'What is the admission process?',
//       content: 'The admission process includes filling out the application form, submission of required documents, and an entrance test (if applicable). Contact the school office for more details.'
//     },
//     {
//       title: 'What are the documents required?',
//       content: 'Required documents include: Birth certificate, Previous academic records, Transfer certificate (if applicable), Aadhar card, Passport size photographs, and Parent\'s ID proof.'
//     },
//     {
//       title: 'What is the fee structure?',
//       content: 'The fee structure varies by class. Please contact the school office or visit the admission office for the detailed fee schedule.'
//     },
//     {
//       title: 'Is there any entrance test?',
//       content: 'Yes, students seeking admission to higher classes may need to take an entrance test. The test assesses the student\'s academic readiness.'
//     }
//   ]

//   const documents = [
//     'Registration Card',
//     'Admit Card of Class X Board Examination',
//     'Marksheet of Class X Pre-Board Examination',
//     'Pass certificate of Class X Board Examination',
//     'Class IX Final Mark Sheet',
//     'Original Transfer Certificate from the school last attended at the time of admission',
//     'Character certificate from the School last attended',
//     'Migration certificate for CBSE students (compulsory)',
//     'School CCE Evaluation Card (IX-X) for CBSE School students(compulsory)',
//     'School Report Card of Class-X(ten) for SEBA School students',
//     'SC/ST/OBC/MOBC/ certificate in the name of the student (if applicable)',
//     'Detailed report of co-curricular achievements (National/District/State)'
//   ]

//   const feeStructure = [
//     { label: 'Admission Fees', amount: '₹16,000/-' },
//     { label: 'Tuition fees per month', amount: '₹1,800/-' },
//     { label: 'Tuition fees (Per Installment)', amount: '₹7,200/-' },
//     { label: 'Annual & Other Fees (Per Installment)', amount: '₹5,315/-' },
//     { label: 'Laboratory Fees (Science Stream - Per Installment)', amount: '₹2,500/-' },
//     { label: 'Computer Fees (As per selection of subjects)', amount: '₹3,100/-' },
//     { label: 'Psychology (Lab fee - As per selection of subjects)', amount: '₹1,100/-' }
//   ]

//   return (
//     <div className="min-h-screen bg-white">
//       {/* ===== HERO SECTION ===== */}
//       <section className="relative overflow-hidden bg-maroon-900 h-[30vh] min-h-[220px] max-h-[280px]">
//         {/* Background Pattern */}
//         <div className="absolute inset-0 opacity-5">
//           <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full -translate-y-1/2 translate-x-1/3" />
//           <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-300 rounded-full translate-y-1/2 -translate-x-1/3" />
//         </div>

//         {/* Background Text */}
//         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//           <span className="text-[80px] md:text-[120px] font-serif font-bold text-white/5 tracking-[0.3em] select-none">
//             ADMISSIONS
//           </span>
//         </div>

//         <div className="container-custom relative h-full flex items-center">
//           <div>
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="flex items-center gap-3 mb-2"
//             >
//               <GraduationCap size={18} className="text-gold-400" />
//               <span className="text-xs font-semibold text-gold-400 tracking-[0.2em] uppercase">Join Us</span>
//             </motion.div>

//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2, duration: 0.6 }}
//               className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white"
//             >
//               Our <span className="text-gold-400">Admissions</span>
//             </motion.h1>

//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.4, duration: 0.6 }}
//               className="text-white/50 text-sm mt-1"
//             >
//               Join the St. Mary's family
//             </motion.p>
//           </div>
//         </div>

//         {/* Bottom Gold Line */}
//         <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500/50" />
//       </section>

//       {/* ===== INTRO TEXT ===== */}
//       <section className="py-12 border-b border-gray-100">
//         <div className="container-custom">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//             className="text-center max-w-3xl mx-auto"
//           >
//             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-maroon-50 border border-maroon-100 rounded-full mb-4">
//               <Users size={14} className="text-maroon-700" />
//               <span className="text-xs font-semibold text-maroon-700 tracking-widest uppercase">Admissions Open</span>
//             </div>
//             <p className="text-gray-600 text-lg leading-relaxed">
//               St. Mary's Higher Secondary School welcomes students from Class 5 to 10.
//               Our admission process is designed to be transparent and student-friendly.
//             </p>
//           </motion.div>
//         </div>
//       </section>

//       {/* ===== MAIN CONTENT ===== */}
//       <section className="section-padding bg-white">
//         <div className="container-custom">
//           <SectionWrapper>
//             <div className="text-center max-w-3xl mx-auto mb-12">
//               <h2 className="text-3xl md:text-4xl font-serif font-bold text-maroon-800 mb-4">
//                 Welcome to <span className="text-gold-600">St. Mary's</span>
//               </h2>
//               <div className="w-16 h-0.5 bg-gold-400 mx-auto mb-4" />
//             </div>
//           </SectionWrapper>

//           {/* Tab Buttons */}
//           <SectionWrapper>
//             <div className="flex flex-wrap justify-center gap-4 mb-10">
//               <button
//                 onClick={() => setActiveTab('eligibility')}
//                 className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
//                   activeTab === 'eligibility'
//                     ? 'bg-maroon-700 text-white shadow-lg'
//                     : 'bg-gray-100 text-gray-700 hover:bg-maroon-700 hover:text-white-700'
//                 }`}
//               >
//                 <FileText size={18} className="inline mr-2" />
//                 Eligibility Criteria
//               </button>
//               <button
//                 onClick={() => setActiveTab('prospectus')}
//                 className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
//                   activeTab === 'prospectus'
//                     ? 'bg-maroon-700 text-white shadow-lg'
//                     : 'bg-gray-100 text-gray-700 hover:bg-maroon-100 hover:text-maroon-700'
//                 }`}
//               >
//                 <BookOpen size={18} className="inline mr-2" />
//                 Admission Prospectus
//               </button>
//             </div>
//           </SectionWrapper>

//           {/* Eligibility Tab Content */}
//           {activeTab === 'eligibility' && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* Left Column - Cut-off Marks */}
//                 <SectionWrapper>
//                   <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
//                     <h3 className="font-serif font-bold text-xl text-maroon-800 mb-4 flex items-center gap-2">
//                       <CheckCircle size={22} className="text-gold-600" />
//                       Cut-off Marks
//                     </h3>
//                     <p className="text-sm text-gray-500 mb-4">CGPA or equivalent marks</p>
                    
//                     <div className="space-y-4">
//                       <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
//                         <div className="flex justify-between items-center">
//                           <div>
//                             <p className="font-semibold text-gray-800">Humanities</p>
//                             <p className="text-sm text-gray-600">English & Social Science</p>
//                           </div>
//                           <span className="text-2xl font-bold text-blue-700">45%</span>
//                         </div>
//                       </div>
                      
//                       <div className="bg-green-50 border border-green-200 rounded-xl p-4">
//                         <div className="flex justify-between items-center">
//                           <div>
//                             <p className="font-semibold text-gray-800">Science Stream</p>
//                             <p className="text-sm text-gray-600">Science & Mathematics</p>
//                           </div>
//                           <span className="text-2xl font-bold text-green-700">45%</span>
//                         </div>
//                       </div>
                      
//                       <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
//                         <div className="flex justify-between items-center">
//                           <div>
//                             <p className="font-semibold text-gray-800">Commerce Stream</p>
//                             <p className="text-sm text-gray-600">Social Science & Mathematics</p>
//                           </div>
//                           <span className="text-2xl font-bold text-amber-700">45%</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </SectionWrapper>

//                 {/* Right Column - Admission Procedure */}
//                 <SectionWrapper>
//                   <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
//                     <h3 className="font-serif font-bold text-xl text-maroon-800 mb-4 flex items-center gap-2">
//                       <Calendar size={22} className="text-gold-600" />
//                       Admission Procedure
//                     </h3>
                    
//                     <ul className="space-y-3 text-sm text-gray-700">
//                       <li className="flex items-start gap-2">
//                         <span className="text-maroon-600 font-bold">•</span>
//                         <span>Submit the duly filled admission form and take admission on or within 3 days of the issue of form.</span>
//                       </li>
//                       <li className="flex items-start gap-2">
//                         <span className="text-maroon-600 font-bold">•</span>
//                         <span>Admission will be granted into preferred streams according to the availability of seats.</span>
//                       </li>
//                       <li className="flex items-start gap-2">
//                         <span className="text-maroon-600 font-bold">•</span>
//                         <span>Admission will stand automatically cancelled if admission is not taken on the dates announced.</span>
//                       </li>
//                     </ul>

//                     <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
//                       <p className="text-xs text-red-700 font-semibold">
//                         ⚠️ NO REFUND OF ANY KIND SHALL BE MADE ONCE ADMISSION IS TAKEN.
//                       </p>
//                     </div>
//                   </div>
//                 </SectionWrapper>
//               </div>

//               {/* Documents Required */}
//               <SectionWrapper>
//                 <div className="mt-8 bg-gray-50 rounded-2xl border border-gray-200 p-6">
//                   <h3 className="font-serif font-bold text-xl text-maroon-800 mb-4 flex items-center gap-2">
//                     <FileText size={22} className="text-gold-600" />
//                     Documents Required
//                   </h3>
//                   <p className="text-sm text-gray-500 mb-4">The following self-attested documents are to be submitted along with the application:</p>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                     {documents.map((doc, index) => (
//                       <div key={index} className="flex items-start gap-2 p-2 rounded-lg hover:bg-white transition-colors">
//                         <span className="text-maroon-600 text-sm font-bold">{index + 1}.</span>
//                         <span className="text-sm text-gray-700">{doc}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </SectionWrapper>

//               {/* Fee Structure */}
//               <SectionWrapper>
//                 <div className="mt-8 bg-gray-50 rounded-2xl border border-gray-200 p-6">
//                   <h3 className="font-serif font-bold text-xl text-maroon-800 mb-4 flex items-center gap-2">
//                     <IndianRupee size={22} className="text-gold-600" />
//                     Fee Structure
//                   </h3>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {feeStructure.map((fee, index) => (
//                       <div key={index} className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200">
//                         <span className="text-sm text-gray-700">{fee.label}</span>
//                         <span className="font-bold text-maroon-700">{fee.amount}</span>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="mt-4 p-4 bg-maroon-50 border border-maroon-200 rounded-xl">
//                     <p className="text-sm text-maroon-800">
//                       <span className="font-bold">Note:</span> Admission Fees and 1st Installment should be paid at the time of Admission.
//                       Registration Fee will be taken when AHSEC gives information.
//                     </p>
//                   </div>

//                   <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
//                     <p className="text-sm text-blue-800">
//                       <span className="font-bold">📞 For further information contact School Office:</span> PH. No. 9435190537
//                     </p>
//                   </div>
//                 </div>
//               </SectionWrapper>

//               {/* Important Notes */}
//               <SectionWrapper>
//                 <div className="mt-8 bg-maroon-50 border border-maroon-200 rounded-2xl p-6">
//                   <h4 className="font-bold text-maroon-800 text-sm mb-3">⚠️ Important Notes:</h4>
//                   <ul className="space-y-2 text-sm text-maroon-700">
//                     <li className="flex items-start gap-2">
//                       <span className="font-bold">•</span>
//                       <span>INCOMPLETE FORMS WILL BE REJECTED UPON SCRUTINY.</span>
//                     </li>
//                     <li className="flex items-start gap-2">
//                       <span className="font-bold">•</span>
//                       <span>SUBMISSION OF FORMS DOES NOT RESERVE THE RIGHT TO ADMISSION.</span>
//                     </li>
//                     <li className="flex items-start gap-2">
//                       <span className="font-bold">•</span>
//                       <span>FINAL DISCRETION LIES WITH THE PRINCIPAL IN ALL MATTERS.</span>
//                     </li>
//                   </ul>
//                 </div>
//               </SectionWrapper>
//             </motion.div>
//           )}

//           {/* Prospectus Tab Content */}
//           {activeTab === 'prospectus' && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-200"
//             >
//               <div className="max-w-md mx-auto px-4">
//                 <div className="inline-flex p-6 bg-white rounded-2xl shadow-lg mb-6 border border-gray-200">
//                   <Download size={48} className="text-maroon-700" />
//                 </div>
//                 <h3 className="text-2xl font-serif font-bold text-maroon-800 mb-3">
//                   Admission Prospectus
//                 </h3>
//                 <div className="w-16 h-0.5 bg-gold-400 mx-auto mb-4" />
//                 <p className="text-gray-600 text-base leading-relaxed">
//                   The admission prospectus will be available for download soon.
//                   Please check back later or contact the school office for more information.
//                 </p>
//                 <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
//                   <p className="text-sm text-gray-600">
//                     📞 Contact: <span className="font-semibold text-maroon-700">9435190537</span>
//                   </p>
//                   <p className="text-sm text-gray-600 mt-1">
//                     ✉️ Email: <span className="font-semibold text-maroon-700">stmarysghy1924@yahoo.com</span>
//                   </p>
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           {/* FAQ Section - Common for both tabs */}
//           <SectionWrapper>
//             <div className="mt-12 bg-gray-50 rounded-2xl border border-gray-200 p-6">
//               <h3 className="font-serif font-bold text-xl text-maroon-800 mb-4 text-center">
//                 Frequently Asked Questions
//               </h3>
//               <Accordion items={faqItems} />
//             </div>
//           </SectionWrapper>
//         </div>
//       </section>
//     </div>
//   )
// }

// export default Admission

















import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Users, BookOpen, CheckCircle, Calendar, IndianRupee, Download, GraduationCap } from 'lucide-react'
import SectionWrapper from '../../components/common/SectionWrapper.jsx'
import Accordion from '../../components/common/Accordion.jsx'
import { useWebsiteContent } from '../../components/website-editor/useWebsiteContent.js'

const Admission = () => {
  const websiteContent = useWebsiteContent()

  const [activeTab, setActiveTab] = useState('eligibility')

  const faqItems = [
    {
      title: websiteContent.value("admissions.faq-items.item1.title", 'What is the admission process?'),
      content: websiteContent.value("admissions.faq-items.item1.content", 'The admission process includes filling out the application form, submission of required documents, and an entrance test (if applicable). Contact the school office for more details.')
    },
    {
      title: websiteContent.value("admissions.faq-items.item2.title", 'What are the documents required?'),
      content: websiteContent.value("admissions.faq-items.item2.content", 'Required documents include: Birth certificate, Previous academic records, Transfer certificate (if applicable), Aadhar card, Passport size photographs, and Parent\'s ID proof.')
    },
    {
      title: websiteContent.value("admissions.faq-items.item3.title", 'What is the fee structure?'),
      content: websiteContent.value("admissions.faq-items.item3.content", 'The fee structure varies by class. Please contact the school office or visit the admission office for the detailed fee schedule.')
    },
    {
      title: websiteContent.value("admissions.faq-items.item4.title", 'Is there any entrance test?'),
      content: websiteContent.value("admissions.faq-items.item4.content", 'Yes, students seeking admission to higher classes may need to take an entrance test. The test assesses the student\'s academic readiness.')
    }
  ]

  // ----- Updated Documents -----
  const documentsKgTo8 = [
    websiteContent.value("admissions.documents-kg-to8.item1.text", 'Birth Certificate'),
    websiteContent.value("admissions.documents-kg-to8.item2.text", 'Aadhar Card'),
    websiteContent.value("admissions.documents-kg-to8.item3.text", 'Previous Class Marksheet'),
    websiteContent.value("admissions.documents-kg-to8.item4.text", 'Transfer Certificate from previous school (other than KG)')
  ]

  const documentsHs = [
    websiteContent.value("admissions.documents-hs.item1.text", 'HSLC Marksheet'),
    websiteContent.value("admissions.documents-hs.item2.text", 'Registration Card'),
    websiteContent.value("admissions.documents-hs.item3.text", 'Transfer Certificate from previous school'),
    websiteContent.value("admissions.documents-hs.item4.text", 'Migration Certificate (for CBSE students)'),
    websiteContent.value("admissions.documents-hs.item5.text", 'Admit Card of Class 10'),
    websiteContent.value("admissions.documents-hs.item6.text", 'Pass Certificate of Class 10')
  ]

  const feeStructure = [
    { label: 'Admission Fees', amount: '₹16,000/-' },
    { label: 'Tuition fees per month', amount: '₹1,800/-' },
    { label: 'Tuition fees (Per Installment)', amount: '₹7,200/-' },
    { label: 'Annual & Other Fees (Per Installment)', amount: '₹5,315/-' },
    { label: 'Laboratory Fees (Science Stream - Per Installment)', amount: '₹2,500/-' },
    { label: 'Computer Fees (As per selection of subjects)', amount: '₹3,100/-' },
    { label: 'Psychology (Lab fee - As per selection of subjects)', amount: '₹1,100/-' }
  ]

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
          <span {...websiteContent.props(["admissions.admission.text"])} className="text-[80px] md:text-[120px] font-serif font-bold text-white/5 tracking-[0.3em] select-none">{websiteContent.value("admissions.admission.text", "ADMISSIONS")}</span>
        </div>

        <div className="container-custom relative h-full flex items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-2"
            >
              <GraduationCap size={18} className="text-gold-400" />
              <span {...websiteContent.props(["admissions.admission.text.2"])} className="text-xs font-semibold text-gold-400 tracking-[0.2em] uppercase">{websiteContent.value("admissions.admission.text.2", "Join Us")}</span>
            </motion.div>

            <motion.h1 {...websiteContent.props(["admissions.admission.heading"])}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white"
            >{websiteContent.value("admissions.admission.heading", "Our ")}<span {...websiteContent.props(["admissions.admission.text.3"])} className="text-gold-400">{websiteContent.value("admissions.admission.text.3", "Admissions")}</span>
            </motion.h1>

            <motion.p {...websiteContent.props(["admissions.admission.paragraph"])}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-white/50 text-sm mt-1"
            >{websiteContent.value("admissions.admission.paragraph", "Join the St. Mary's family")}</motion.p>
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
              <Users size={14} className="text-maroon-700" />
              <span {...websiteContent.props(["admissions.admission.text.4"])} className="text-xs font-semibold text-maroon-700 tracking-widest uppercase">{websiteContent.value("admissions.admission.text.4", "Admissions Open")}</span>
            </div>
            <p {...websiteContent.props(["admissions.admission.paragraph.2"])} className="text-gray-600 text-lg leading-relaxed">{websiteContent.value("admissions.admission.paragraph.2", "St. Mary's Higher Secondary School welcomes students from Class 5 to 10. Our admission process is designed to be transparent and student-friendly.")}</p>
          </motion.div>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionWrapper>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 {...websiteContent.props(["admissions.admission.heading.2"])} className="text-3xl md:text-4xl font-serif font-bold text-maroon-800 mb-4">{websiteContent.value("admissions.admission.heading.2", "Welcome to ")}<span {...websiteContent.props(["admissions.admission.text.5"])} className="text-gold-600">{websiteContent.value("admissions.admission.text.5", "St. Mary's")}</span>
              </h2>
              <div className="w-16 h-0.5 bg-gold-400 mx-auto mb-4" />
            </div>
          </SectionWrapper>

          {/* ===== TAB BUTTONS (FIXED VISIBILITY) ===== */}
          <SectionWrapper>
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <button {...websiteContent.props(["admissions.admission.button-label"])}
                onClick={() => setActiveTab('eligibility')}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 border-2 ${
                  activeTab === 'eligibility'
                    ? 'bg-maroon-700 text-white border-gold-400 shadow-lg'
                    : 'bg-gray-100 text-gray-700 border-transparent hover:bg-maroon-700 hover:text-white hover:border-gold-400'
                }`}
              >
                <FileText size={18} className="inline mr-2" />{websiteContent.value("admissions.admission.button-label", "Eligibility Criteria")}</button>
              <button {...websiteContent.props(["admissions.admission.button-label.2"])}
                onClick={() => setActiveTab('prospectus')}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 border-2 ${
                  activeTab === 'prospectus'
                    ? 'bg-maroon-700 text-white border-gold-400 shadow-lg'
                    : 'bg-gray-100 text-gray-700 border-transparent hover:bg-maroon-700 hover:text-white hover:border-gold-400'
                }`}
              >
                <BookOpen size={18} className="inline mr-2" />{websiteContent.value("admissions.admission.button-label.2", "Admission Prospectus")}</button>
            </div>
          </SectionWrapper>

          {/* Eligibility Tab Content */}
          {activeTab === 'eligibility' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Cut-off Marks */}
                <SectionWrapper>
                  <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                    <h3 {...websiteContent.props(["admissions.admission.heading.3"])} className="font-serif font-bold text-xl text-maroon-800 mb-4 flex items-center gap-2">
                      <CheckCircle size={22} className="text-gold-600" />{websiteContent.value("admissions.admission.heading.3", "Cut-off Marks")}</h3>
                    <p {...websiteContent.props(["admissions.admission.paragraph.3"])} className="text-sm text-gray-500 mb-4">{websiteContent.value("admissions.admission.paragraph.3", "CGPA or equivalent marks")}</p>
                    
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p {...websiteContent.props(["admissions.admission.paragraph.4"])} className="font-semibold text-gray-800">{websiteContent.value("admissions.admission.paragraph.4", "Humanities")}</p>
                            <p {...websiteContent.props(["admissions.admission.paragraph.5"])} className="text-sm text-gray-600">{websiteContent.value("admissions.admission.paragraph.5", "English & Social Science")}</p>
                          </div>
                          <span {...websiteContent.props(["admissions.admission.text.6"])} className="text-2xl font-bold text-blue-700">{websiteContent.value("admissions.admission.text.6", "45%")}</span>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p {...websiteContent.props(["admissions.admission.paragraph.6"])} className="font-semibold text-gray-800">{websiteContent.value("admissions.admission.paragraph.6", "Science Stream")}</p>
                            <p {...websiteContent.props(["admissions.admission.paragraph.7"])} className="text-sm text-gray-600">{websiteContent.value("admissions.admission.paragraph.7", "Science & Mathematics")}</p>
                          </div>
                          <span {...websiteContent.props(["admissions.admission.text.7"])} className="text-2xl font-bold text-green-700">{websiteContent.value("admissions.admission.text.7", "45%")}</span>
                        </div>
                      </div>
                      
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p {...websiteContent.props(["admissions.admission.paragraph.8"])} className="font-semibold text-gray-800">{websiteContent.value("admissions.admission.paragraph.8", "Commerce Stream")}</p>
                            <p {...websiteContent.props(["admissions.admission.paragraph.9"])} className="text-sm text-gray-600">{websiteContent.value("admissions.admission.paragraph.9", "Social Science & Mathematics")}</p>
                          </div>
                          <span {...websiteContent.props(["admissions.admission.text.8"])} className="text-2xl font-bold text-amber-700">{websiteContent.value("admissions.admission.text.8", "45%")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionWrapper>

                {/* Right Column - Admission Procedure */}
                <SectionWrapper>
                  <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                    <h3 {...websiteContent.props(["admissions.admission.heading.4"])} className="font-serif font-bold text-xl text-maroon-800 mb-4 flex items-center gap-2">
                      <Calendar size={22} className="text-gold-600" />{websiteContent.value("admissions.admission.heading.4", "Admission Procedure")}</h3>
                    
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-maroon-600 font-bold">•</span>
                        <span {...websiteContent.props(["admissions.admission.text.10"])}>{websiteContent.value("admissions.admission.text.10", "Submit the duly filled admission form and take admission on or within 3 days of the issue of form.")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-maroon-600 font-bold">•</span>
                        <span {...websiteContent.props(["admissions.admission.text.12"])}>{websiteContent.value("admissions.admission.text.12", "Admission will be granted into preferred streams according to the availability of seats.")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-maroon-600 font-bold">•</span>
                        <span {...websiteContent.props(["admissions.admission.text.14"])}>{websiteContent.value("admissions.admission.text.14", "Admission will stand automatically cancelled if admission is not taken on the dates announced.")}</span>
                      </li>
                    </ul>

                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p {...websiteContent.props(["admissions.admission.paragraph.10"])} className="text-xs text-red-700 font-semibold">{websiteContent.value("admissions.admission.paragraph.10", "⚠️ NO REFUND OF ANY KIND SHALL BE MADE ONCE ADMISSION IS TAKEN.")}</p>
                    </div>
                  </div>
                </SectionWrapper>
              </div>

              {/* ===== DOCUMENTS REQUIRED (UPDATED) ===== */}
              <SectionWrapper>
                <div className="mt-8 bg-gray-50 rounded-2xl border border-gray-200 p-6">
                  <h3 {...websiteContent.props(["admissions.admission.heading.5"])} className="font-serif font-bold text-xl text-maroon-800 mb-4 flex items-center gap-2">
                    <FileText size={22} className="text-gold-600" />{websiteContent.value("admissions.admission.heading.5", "Documents Required")}</h3>
                  <p {...websiteContent.props(["admissions.admission.paragraph.11"])} className="text-sm text-gray-500 mb-6">{websiteContent.value("admissions.admission.paragraph.11", "The following self-attested documents are to be submitted along with the application.")}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* KG to Class 8 */}
                    <div>
                      <h4 {...websiteContent.props(["admissions.admission.heading.6"])} className="font-semibold text-maroon-700 mb-3 flex items-center gap-2">
                        <span className="text-gold-500">📘</span>{websiteContent.value("admissions.admission.heading.6", " For KG to Class 8")}</h4>
                      <ul className="space-y-2">
                        {documentsKgTo8.map((doc, index) => (
                          <li key={index} className="flex items-start gap-2 p-2 rounded-lg hover:bg-white transition-colors">
                            <span {...websiteContent.propsFor(index + 1)} className="text-maroon-600 text-sm font-bold">{index + 1}.</span>
                            <span {...websiteContent.propsFor(doc)} className="text-sm text-gray-700">{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Class 9 & 10 (HSLC) */}
                    <div>
                      <h4 {...websiteContent.props(["admissions.admission.heading.7"])} className="font-semibold text-maroon-700 mb-3 flex items-center gap-2">
                        <span className="text-gold-500">🎓</span>{websiteContent.value("admissions.admission.heading.7", " For Class 9 & 10 (HSLC)")}</h4>
                      <ul className="space-y-2">
                        {documentsHs.map((doc, index) => (
                          <li key={index} className="flex items-start gap-2 p-2 rounded-lg hover:bg-white transition-colors">
                            <span {...websiteContent.propsFor(index + 1)} className="text-maroon-600 text-sm font-bold">{index + 1}.</span>
                            <span {...websiteContent.propsFor(doc)} className="text-sm text-gray-700">{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </SectionWrapper>

              {/* Fee Structure */}
              {/* <SectionWrapper>
                <div className="mt-8 bg-gray-50 rounded-2xl border border-gray-200 p-6">
                  <h3 className="font-serif font-bold text-xl text-maroon-800 mb-4 flex items-center gap-2">
                    <IndianRupee size={22} className="text-gold-600" />
                    Fee Structure
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {feeStructure.map((fee, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200">
                        <span className="text-sm text-gray-700">{fee.label}</span>
                        <span className="font-bold text-maroon-700">{fee.amount}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-4 bg-maroon-50 border border-maroon-200 rounded-xl">
                    <p className="text-sm text-maroon-800">
                      <span className="font-bold">Note:</span> Admission Fees and 1st Installment should be paid at the time of Admission.
                      Registration Fee will be taken when AHSEC gives information.
                    </p>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm text-blue-800">
                      <span className="font-bold">📞 For further information contact School Office:</span> PH. No. 9435190537
                    </p>
                  </div>
                </div>
              </SectionWrapper> */}

              {/* Important Notes */}
              <SectionWrapper>
                <div className="mt-8 bg-maroon-50 border border-maroon-200 rounded-2xl p-6">
                  <h4 {...websiteContent.props(["admissions.admission.heading.8"])} className="font-bold text-maroon-800 text-sm mb-3">{websiteContent.value("admissions.admission.heading.8", "⚠️ Important Notes:")}</h4>
                  <ul className="space-y-2 text-sm text-maroon-700">
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span {...websiteContent.props(["admissions.admission.text.20"])}>{websiteContent.value("admissions.admission.text.20", "INCOMPLETE FORMS WILL BE REJECTED UPON SCRUTINY.")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span {...websiteContent.props(["admissions.admission.text.22"])}>{websiteContent.value("admissions.admission.text.22", "SUBMISSION OF FORMS DOES NOT RESERVE THE RIGHT TO ADMISSION.")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span {...websiteContent.props(["admissions.admission.text.24"])}>{websiteContent.value("admissions.admission.text.24", "FINAL DISCRETION LIES WITH THE PRINCIPAL IN ALL MATTERS.")}</span>
                    </li>
                  </ul>
                </div>
              </SectionWrapper>
            </motion.div>
          )}

          {/* Prospectus Tab Content */}
          {activeTab === 'prospectus' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-200"
            >
              <div className="max-w-md mx-auto px-4">
                <div className="inline-flex p-6 bg-white rounded-2xl shadow-lg mb-6 border border-gray-200">
                  <Download size={48} className="text-maroon-700" />
                </div>
                <h3 {...websiteContent.props(["admissions.admission.heading.9"])} className="text-2xl font-serif font-bold text-maroon-800 mb-3">{websiteContent.value("admissions.admission.heading.9", "Admission Prospectus")}</h3>
                <div className="w-16 h-0.5 bg-gold-400 mx-auto mb-4" />
                <p {...websiteContent.props(["admissions.admission.paragraph.12"])} className="text-gray-600 text-base leading-relaxed">{websiteContent.value("admissions.admission.paragraph.12", "The admission prospectus will be available for download soon. Please check back later or contact the school office for more information.")}</p>
                <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
                  <p {...websiteContent.props(["admissions.admission.paragraph.13"])} className="text-sm text-gray-600">{websiteContent.value("admissions.admission.paragraph.13", "📞 Contact: ")}<span {...websiteContent.props(["admissions.admission.text.25"])} className="font-semibold text-maroon-700">{websiteContent.value("admissions.admission.text.25", "9435190537")}</span>
                  </p>
                  <p {...websiteContent.props(["admissions.admission.paragraph.14"])} className="text-sm text-gray-600 mt-1">{websiteContent.value("admissions.admission.paragraph.14", "✉️ Email: ")}<span {...websiteContent.props(["admissions.admission.text.26"])} className="font-semibold text-maroon-700">{websiteContent.value("admissions.admission.text.26", "stmarysghy1924@yahoo.com")}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* FAQ Section - Common for both tabs */}
          <SectionWrapper>
            <div className="mt-12 bg-gray-50 rounded-2xl border border-gray-200 p-6">
              <h3 {...websiteContent.props(["admissions.admission.heading.10"])} className="font-serif font-bold text-xl text-maroon-800 mb-4 text-center">{websiteContent.value("admissions.admission.heading.10", "Frequently Asked Questions")}</h3>
              <Accordion items={faqItems} />
            </div>
          </SectionWrapper>
        </div>
      </section>
    </div>
  )
}

export default Admission