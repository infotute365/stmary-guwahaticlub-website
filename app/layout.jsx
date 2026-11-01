import './globals.css'
import Providers from '../src/components/Providers.jsx'
import { Analytics } from "@vercel/analytics/next"
import { getServerWebsiteContent } from '../src/server/util/publishedWebsiteContent.js'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const published = await getServerWebsiteContent()
  return {
    title: published['global.layout.metadata.title']?.value ?? "St. Mary's School",
    description: published['global.layout.metadata.description']?.value ?? "St. Mary's School website",
  }
}

export default async function RootLayout({ children }) {
  const publishedContent = await getServerWebsiteContent()
  return (
    <html lang="en">
      <body>
        <Providers publishedContent={publishedContent}>{children}</Providers>
        <Analytics/>
      </body>
    </html>
  )
}
