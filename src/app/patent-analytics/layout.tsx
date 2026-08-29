import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import './patent-analytics.css'
import LeadCaptureModal from './LeadCaptureModal'
import CheckPatentModal from './CheckPatentModal'
import RetainerModal from './RetainerModal'
import StandardReportModal from './StandardReportModal'

// Self-hosted via next/font (no external CDN calls at runtime) — matches
// the "Synthetix Light Spatial" design system: Geist for headlines, Inter
// for body, JetBrains Mono for patent IDs / SMILES / chemical notation.
// Geist isn't on Google Fonts (it's Vercel's own typeface) so it needs the
// dedicated `geist` package rather than next/font/google, unlike the other two.
const geist = GeistSans
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['400', '500', '600'] })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['500'] })

export const metadata: Metadata = {
  // `absolute` overrides the root layout's `%s | TheChemSolver` title
  // template — this product's branding must never show the parent site's name.
  title: { absolute: 'Patent Analytics — Patent Clearance for India’s Generic & CDMO Pharma Industry' },
  description: 'Section 3(d) screening, genus/species Markush coverage, FTO structural triage, and patent-cliff mapping for Indian generic pharma companies, CDMOs, and the IP firms serving them.',
  metadataBase: new URL('https://patent-analytics.thechemsolver.com'),
  alternates: { canonical: 'https://patent-analytics.thechemsolver.com/' },
  // Deliberately hidden from Google while this was being built quietly;
  // now that it's a real product page meant to surface in patent-law
  // searches, it needs to be indexed like any other page.
  // max-image-preview:large is required for Google Discover/News to show
  // a full-size image card instead of a tiny or no thumbnail -- our hero
  // images are real, large (1672x941), non-generic illustrations, which
  // is exactly what Discover eligibility wants.
  robots: { index: true, follow: true, googleBot: { 'max-image-preview': 'large' } },
}

// "Synthetix Light Spatial" design tokens. Previously only defined inline
// on the landing page's own wrapper div, so every other route under this
// segment (e.g. /news/[slug]) rendered with no brand fonts or colors at
// all -- looked like a bare, generic page instead of part of this product.
// Defined once here so every page in this segment inherits them.
const tokens = {
  '--surface': '#f7f9fb',
  '--surface-bright': '#ffffff',
  '--surface-container-low': '#f2f4f6',
  '--surface-container': '#eceef0',
  '--on-surface': '#191c1e',
  '--on-surface-variant': '#3f4850',
  '--on-surface-muted': '#64748b',
  '--outline-variant': '#bfc7d2',
  '--primary': '#0284c7',
  '--primary-container': '#007bb9',
  '--secondary': '#4b41e1',
  '--tertiary': '#00647c',
  '--tertiary-bright': '#0ea5c4',
  '--surface-glass': 'rgba(255, 255, 255, 0.7)',
  '--border-light': 'rgba(15, 23, 42, 0.08)',
  '--input-bg': '#f1f5f9',
} as React.CSSProperties

export default function PatentAnalyticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${geist.variable} ${inter.variable} ${jetbrainsMono.variable} min-h-screen w-full`}
      style={{ ...tokens, background: 'var(--surface)', color: 'var(--on-surface)', fontFamily: 'var(--font-inter), Inter, sans-serif' }}
    >
      <LeadCaptureModal />
      <CheckPatentModal />
      <RetainerModal />
      <StandardReportModal />
      {children}
    </div>
  )
}
