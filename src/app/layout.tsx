import type { Metadata } from 'next'
import './globals.css'
import NavWrapper from './NavWrapper'

export const metadata: Metadata = {
  title: {
    default: 'TheChemSolver — Free Chemistry Tools for AP, USNCO & IChO',
    template: '%s | TheChemSolver',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavWrapper>{children}</NavWrapper>
      </body>
    </html>
  )
}
