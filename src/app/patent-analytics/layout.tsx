import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'

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

export default function PatentAnalyticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${geist.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      {children}
    </div>
  )
}
