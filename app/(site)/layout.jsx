import TopBar from '../../src/components/layout/TopBar.jsx'
import Navbar from '../../src/components/layout/Navbar.jsx'
import Footer from '../../src/components/layout/Footer.jsx'
import SchoolMotion from '../../src/components/common/SchoolMotion.jsx'

export default function SiteLayout({ children }) {
  return (
    <SchoolMotion><div className="school-site min-h-screen flex flex-col">
      <TopBar />
      <Navbar />
      <main className="grow">{children}</main>
      <Footer />
    </div></SchoolMotion>
  )
}
