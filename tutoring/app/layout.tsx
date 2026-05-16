import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { content } from '@/config/content'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: content.siteTitle,
  description:
    'One-on-one STEM tutoring in Math, Physics, Chemistry, Biology, and Computer Science — in-person (San Diego) or via Zoom.',
  openGraph: {
    title: content.siteTitle,
    description:
      'Expert STEM tutoring from a Cal Poly mechanical engineer. Evening house calls in San Diego or Zoom sessions anywhere.',
    url: `${content.portfolioUrl}/tutoring`,
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white text-zinc-950 font-sans">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
