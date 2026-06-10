import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
// @ts-ignore: CSS module declarations are not available in this setup
import './globals.css'
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: 'Plant Database | Case Study',
  description:
    'A persistent plant database built for a client, integrating the Trefle botanical API with user authentication and saved plant collections.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="font-sans antialiased">{children}<Analytics/></body>
    </html>
  )
}
