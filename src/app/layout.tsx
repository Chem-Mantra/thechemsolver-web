import type { Metadata, Viewport } from 'next'
import './globals.css'
import NavWrapper from './NavWrapper'
import CapacitorNative from './CapacitorNative'
import RegisterServiceWorker from './RegisterServiceWorker'
import { AuthProvider } from './AuthProvider'
import AdsGate from './AdsGate'
import AdFreePopup from './AdFreePopup'
import AuthCallbackListener from './AuthCallbackListener'
import GoogleOneTap from './GoogleOneTap'
import { Analytics } from '@vercel/analytics/next'
import NativeAccessGate from './NativeAccessGate'
// Freemium: 15-day free trial, then $15/year full access (PayPal on web).
// AccessGate wraps interactive tools; AdFreePopup nags near/after trial end.
// NativeAccessGate is a no-op on the website; on Capacitor it requires
// sign-in + trial/paid access and points users to the web for PayPal.

const ADSENSE_CLIENT = 'ca-pub-4376919875096457'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // lets env(safe-area-inset-*) resolve inside the iOS app shell
  themeColor: '#08020d',
}

const SITE_URL = 'https://www.thechemsolver.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    'Free interactive chemistry simulators and practice tools for AP Chemistry, USNCO, and IChO students. 25+ labs, MCQ practice, FRQ viewer, and IChO prep problems.',
  keywords: [
    'AP Chemistry tools free',
    'USNCO practice',
    'IChO preparatory problems',
    'chemistry simulator',
    'titration simulator',
    'equilibrium lab',
    'electrochemistry simulator',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'TheChemSolver — Free Chemistry Tools',
    description: 'Interactive simulators for AP Chemistry, USNCO, and IChO.',
    url: SITE_URL,
    siteName: 'TheChemSolver',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TheChemSolver — Free Chemistry Tools',
    description: 'Interactive simulators for AP, USNCO, and IChO.',
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
          <NativeAccessGate>
            <CapacitorNative />
            <AuthCallbackListener />
            <GoogleOneTap />
            <NavWrapper>{children}</NavWrapper>
            <AdFreePopup />
            <Analytics />
            <RegisterServiceWorker />
            <AdsGate client={ADSENSE_CLIENT} />
          </NativeAccessGate>
        </AuthProvider>
      </body>
    </html>
  )
}
