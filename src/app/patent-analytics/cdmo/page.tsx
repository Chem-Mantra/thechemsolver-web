import type { Metadata } from 'next'
import Link from 'next/link'
import PatentAnalyticsHeader from '../PatentAnalyticsHeader'
import OpenLeadFormButton from '../OpenLeadFormButton'

const SITE = 'https://patent-analytics.thechemsolver.com'

export const metadata: Metadata = {
  title: { absolute: 'CDMO Process FTO Pre-Screens — Patent Analytics' },
  description: 'Before committing manufacturing resources to a target compound or synthetic route, screen it against the real existing patent landscape. Built for CDMOs and their sponsors.',
  alternates: { canonical: `${SITE}/cdmo` },
  robots: { index: true, follow: true, googleBot: { 'max-image-preview': 'large' } },
}

const STEPS = [
  {
    n: '01',
    title: 'You give us the target',
    desc: 'A compound structure, a synthetic route, or a patent number describing the process you\'re evaluating for a sponsor.',
  },
  {
    n: '02',
    title: 'We screen it structurally',
    desc: 'Real cheminformatics (RDKit Morgan fingerprints, Tanimoto similarity) against the existing patent landscape — not a keyword or claim-text search.',
  },
  {
    n: '03',
    title: 'You get a clear read',
    desc: 'Auto-verified hits are flagged instantly; anything ambiguous goes to a real chemist before it reaches you, not silently upgraded to a false "clear".',
  },
]

export default function CDMOPage() {
  return (
    <>
      <PatentAnalyticsHeader />
      <main>
        <div className="max-w-[1200px] mx-auto px-6 py-16 md:py-20">
          <div className="max-w-3xl mb-16">
            <div className="pa-chip mb-6">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--tertiary-bright)' }} />
              Built for CDMOs and their sponsors
            </div>
            <h1 className="pa-display text-[36px] md:text-[52px] font-bold leading-[1.08] mb-6" style={{ color: 'var(--on-surface)' }}>
              Check the patent before<br />you check the route
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-2xl" style={{ color: 'var(--on-surface-variant)' }}>
              Freedom-to-operate on manufacturing processes is one of the most commonly
              mishandled parts of CDMO/sponsor agreements — both the product AND the
              process used to make it need their own FTO check, and the process side
              routinely gets skipped until it&rsquo;s expensive to fix. We screen a proposed
              synthetic route or target compound against the real patent landscape before
              you commit manufacturing resources to it.
            </p>
            <div className="flex flex-wrap gap-3">
              <OpenLeadFormButton className="pa-btn-primary text-base font-semibold px-6 py-3.5">
                Request a free sample screen →
              </OpenLeadFormButton>
              <Link href="/patent-analytics/pricing" className="pa-btn-ghost text-base font-semibold px-6 py-3.5 inline-block">
                See pricing
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {STEPS.map((s) => (
              <div key={s.n} className="pa-glass p-6">
                <div className="pa-mono text-sm mb-3" style={{ color: 'var(--primary)' }}>{s.n}</div>
                <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--on-surface)' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="pa-glass pa-glass-elevated p-8 md:p-10 mb-16">
            <p className="pa-mono text-[11px] uppercase tracking-wide mb-2" style={{ color: 'var(--tertiary)' }}>Why this matters now</p>
            <h2 className="pa-display text-2xl font-bold mb-4" style={{ color: 'var(--on-surface)' }}>
              The CDMO market is growing fast — and FTO risk grows with it
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--on-surface-variant)' }}>
              The global CDMO market is projected to grow from roughly $239B (2024) to
              over $465B by 2032. More manufacturing volume moving through third-party
              CDMOs means more process patents to clear, and more sponsors who assume
              &ldquo;someone else already checked this.&rdquo; A real structural screen — not a
              keyword search of claim text — is the fast, defensible first pass before
              committing real manufacturing spend.
            </p>
            <Link href="/patent-analytics/data/fto-triage" className="text-sm font-medium" style={{ color: 'var(--primary)' }}>
              See real, live cross-patent structural screening results →
            </Link>
          </div>

          <div className="pa-glass p-8 max-w-2xl mx-auto text-center">
            <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              Every screen includes an explicit &ldquo;what we claim / what we don&apos;t claim&rdquo;
              section — we identify structural overlap and its relationship to claimed
              scope, not legal conclusions like infringement or validity. That judgment
              stays with you and your counsel.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
