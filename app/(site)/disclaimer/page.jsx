import PageHeader from '../../../src/components/common/PageHeader.jsx'

export const metadata = {
  title: "Website Disclaimer | St. Mary's Higher Secondary School, Guwahati",
  description: "Website disclaimer for St. Mary's Higher Secondary School, Guwahati.",
}

export default function DisclaimerPage() {
  return (
    <>
      <PageHeader title="Website Disclaimer" breadcrumb={[{ label: 'Disclaimer' }]} />

      <div className="container-custom py-12 md:py-16">
        <article aria-label="Website Disclaimer" className="mx-auto max-w-4xl space-y-8 rounded-2xl border border-maroon-100 bg-white p-6 text-base leading-relaxed text-gray-700 shadow-sm md:p-10">
          <section aria-labelledby="general-information">
            <h2 id="general-information" className="mb-3 font-serif text-xl font-bold text-maroon-800 md:text-2xl">1. General Information</h2>
            <p>
              The information contained on <strong>stmarysguwahati.com</strong> (the &quot;Website&quot;) is provided by <strong>ST. MARY’S HIGHER SECONDARY SCHOOL, Guwahati</strong> (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) for general informational and educational purposes only. While we strive to keep all academic calendars, circulars, fee structures, and admission notices accurate and up to date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on the Website. Any reliance you place on such information is strictly at your own risk.
            </p>
          </section>

          <section aria-labelledby="admissions-fees-records">
            <h2 id="admissions-fees-records" className="mb-3 font-serif text-xl font-bold text-maroon-800 md:text-2xl">2. Admissions, Fees, and Official Records</h2>
            <p>
              Details regarding admissions, syllabus, examinations, and fee schedules published on this Website are indicative and subject to change without prior notice. In the event of any discrepancy between the information displayed on this Website and the official hard-copy records maintained at the <strong>ST. MARY’S HIGHER SECONDARY SCHOOL</strong> administrative office, the physical records at the school office shall be treated as final and binding.
            </p>
          </section>

          <section aria-labelledby="limitation-of-liability">
            <h2 id="limitation-of-liability" className="mb-3 font-serif text-xl font-bold text-maroon-800 md:text-2xl">3. Limitation of Liability</h2>
            <p>
              In no event will <strong>ST. MARY’S HIGHER SECONDARY SCHOOL</strong>, its management, trustees, principal, faculty, or staff be liable for any loss or damage, including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this Website. Every effort is made to keep the Website up and running smoothly; however, <strong>ST. MARY’S HIGHER SECONDARY SCHOOL</strong> takes no responsibility for, and will not be liable for, the Website being temporarily unavailable due to technical issues beyond our control.
            </p>
          </section>

          <section aria-labelledby="external-links">
            <h2 id="external-links" className="mb-3 font-serif text-xl font-bold text-maroon-800 md:text-2xl">4. External Links and Third-Party Services</h2>
            <p>
              Through this Website, you may be able to link to other websites (such as examination boards, educational portals, or online payment gateways) that are not under the control of <strong>ST. MARY’S HIGHER SECONDARY SCHOOL</strong>. We have no control over the nature, content, and availability of those external sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
            </p>
          </section>

          <section aria-labelledby="intellectual-property-privacy">
            <h2 id="intellectual-property-privacy" className="mb-3 font-serif text-xl font-bold text-maroon-800 md:text-2xl">5. Intellectual Property and Student Privacy</h2>
            <p>
              All content on this Website, including text, school logos, emblems, photographs, videos, and downloadable study materials, is the intellectual property of <strong>ST. MARY’S HIGHER SECONDARY SCHOOL</strong> unless otherwise stated. Unauthorized copying, downloading, distribution, or misuse of any content—especially photographs or personal details of students and staff—is strictly prohibited and may attract legal action.
            </p>
          </section>

          <section aria-labelledby="modifications-governing-law">
            <h2 id="modifications-governing-law" className="mb-3 font-serif text-xl font-bold text-maroon-800 md:text-2xl">6. Right to Modify and Governing Law</h2>
            <p>
              <strong>ST. MARY’S HIGHER SECONDARY SCHOOL</strong> reserves the right to add, delete, or modify any part of the Website content or this Disclaimer at any time without prior notice. This Disclaimer shall be governed by and construed in accordance with the laws of <strong>INDIA</strong>, and any disputes relating to this Disclaimer shall be subject to the exclusive jurisdiction of the courts in <strong>Guwahati</strong>.
            </p>
          </section>

          <section aria-labelledby="contact-us">
            <h2 id="contact-us" className="mb-3 font-serif text-xl font-bold text-maroon-800 md:text-2xl">7. Contact Us</h2>
            <p>
              If you notice any inaccuracies on the Website or have questions regarding this Disclaimer, please contact the school office at <a href="mailto:stmarysghy1924@yahoo.com" className="break-words font-bold text-maroon-700 underline underline-offset-4 hover:text-maroon-900">stmarysghy1924@yahoo.com</a>
            </p>
          </section>
        </article>
      </div>
    </>
  )
}
