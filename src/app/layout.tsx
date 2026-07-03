import type { Metadata, Viewport } from 'next'
import './globals.css'
import NavWrapper from './NavWrapper'
import CapacitorNative from './CapacitorNative'
import RegisterServiceWorker from './RegisterServiceWorker'
import { AuthProvider } from './AuthProvider'
import AdsGate from './AdsGate'
import AuthCallbackListener from './AuthCallbackListener'
import { Analytics } from '@vercel/analytics/next'
// Monetization is paused for now — everything is free, including inside
// the native app. Google sign-in (AuthProvider, AuthCallbackListener,
// /account) stays active. To re-enable the paywall later: re-import and
// re-wrap with NativeAccessGate, and re-add <AdFreePopup /> below — see
// docs/RAZORPAY_SETUP.md.

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
          <Analytics />
          <RegisterServiceWorker />
          <AdsGate client={ADSENSE_CLIENT} />
        </AuthProvider>
      </body>
    </html>
  )
}
