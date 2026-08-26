import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import './patent-analytics.css'
import LeadCaptureModal from './LeadCaptureModal'

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
  title: { absolute: 'Patent Analytics — Chemical Structure & Genus-Claim Analysis' },
  description: 'Chemical structure extraction, genus/species Markush coverage analysis, and Section 3(d) screening for patent attorneys and pharma IP teams.',
  metadataBase: new URL('https://patent-analytics.thechemsolver.com'),
  alternates: { canonical: 'https://patent-analytics.thechemsolver.com/' },
  // Deliberately hidden from Google while this was being built quietly;
  // now that it's a real product page meant to surface in patent-law
  // searches, it needs to be indexed like any other page.
  robots: { index: true, follow: true },
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
      {children}
    </div>
  )
}
