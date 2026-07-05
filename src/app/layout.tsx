import type { Metadata, Viewport } from 'next'
import './globals.css'
import NavWrapper from './NavWrapper'
import CapacitorNative from './CapacitorNative'
import RegisterServiceWorker from './RegisterServiceWorker'
import { AuthProvider } from './AuthProvider'
import AdsGate from './AdsGate'
import AdFreePopup from './AdFreePopup'
import AuthCallbackListener from './AuthCallbackListener'
import { Analytics } from '@vercel/analytics/next'
// The $15/year ad-free purchase is live (website only — see AdFreePopup.tsx
// for why the native app never shows it). NativeAccessGate (a full-app
// paywall for the native build) stays unmounted — that's a materially
// different, higher-risk pattern under App Store guidelines, unrelated to
// this website ad-removal feature; see docs/RAZORPAY_SETUP.md.

const ADSENSE_CLIENT = 'ca-pub-4376919875096457'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // lets env(safe-area-inset-*) resolve inside the iOS app shell
  themeColor: '#08020d',
}

export const metadata: Metadata = {
  title: {
    default: 'TheChemSolver — Free Chemistry Tools for AP, USNCO & IChO',
    template: '%s | TheChemSolver',
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TheChemSolver',
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
        <AuthProvider>
          <CapacitorNative />
          <AuthCallbackListener />
          <NavWrapper>{children}</NavWrapper>
          <AdFreePopup />
          <Analytics />
          <RegisterServiceWorker />
          <AdsGate client={ADSENSE_CLIENT} />
        </AuthProvider>
      </body>
    </html>
  )
}
