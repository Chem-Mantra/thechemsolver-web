import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import NavWrapper from './NavWrapper'
import { Analytics } from '@vercel/analytics/next'

const ADSENSE_CLIENT = 'ca-pub-4376919875096457'

export const metadata: Metadata = {
  title: {
    default: 'TheChemSolver — Free Chemistry Tools for AP, USNCO & IChO',
    template: '%s | TheChemSolver',
  },
  other: {
    'google-adsense-account': ADSENSE_CLIENT,
  },
  description:
    'Free interactive chemistry simulators and practice tools for AP Chemistry, USNCO, and IChO students. 25+ labs, MCQ practice, FRQ viewer, and IChO prep problems. No login required.',
  keywords: [
    'AP Chemistry tools free',
    'USNCO practice',
    'IChO preparatory problems',
    'chemistry simulator',
    'titration simulator',
    'equilibrium lab',
    'electrochemistry simulator',
  ],
  openGraph: {
    title: 'TheChemSolver — Free Chemistry Tools',
    description: 'Interactive simulators for AP Chemistry, USNCO, and IChO. Free, no account needed.',
    url: 'https://www.thechemsolver.com',
    siteName: 'TheChemSolver',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TheChemSolver — Free Chemistry Tools',
    description: 'Interactive simulators for AP, USNCO, and IChO. Free forever.',
  },
  robots: { index: true, follow: true },
}

const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TheChemSolver',
  url: 'https://www.thechemsolver.com',
  description:
    'Free interactive chemistry simulators, ebooks, and practice tools for AP Chemistry, USNCO, and IChO students.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <NavWrapper>{children}</NavWrapper>
        <Analytics />
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
