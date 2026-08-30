import type { Metadata } from 'next'
import Link from 'next/link'
import PatentAnalyticsHeader from '../PatentAnalyticsHeader'
import NewestPatentsForm from './NewestPatentsForm'

const SITE = 'https://patent-analytics.thechemsolver.com'

export const metadata: Metadata = {
  title: { absolute: 'Newest Patent Structure Extraction — Patent Analytics' },
  description: "We extract chemical structures from the newest patents — even the ones Google Patents and PubChem haven't indexed yet.",
  alternates: { canonical: `${SITE}/newest-patents` },
  robots: { index: true, follow: true, googleBot: { 'max-image-preview': 'large' } },
}

export default function NewestPatentsPage() {
  return (
    <>
      <PatentAnalyticsHeader />
      <main>
        <div className="max-w-[900px] mx-auto px-6 py-12 md:py-16">
          <Link href="/patent-analytics#services" className="pa-mono text-xs uppercase tracking-wide" style={{ color: 'var(--on-surface-muted)' }}>
            ← All services
          </Link>

          <h1 className="pa-display text-[32px] md:text-[44px] font-bold leading-[1.1] mt-4 mb-3" style={{ color: 'var(--on-surface)' }}>
            Newest Patent Structure Extraction
          </h1>
          <p className="text-lg mb-10" style={{ color: 'var(--on-surface-variant)' }}>
            We extract chemical structures directly from the newest patents — even the ones Google Patents and
            PubChem haven&rsquo;t indexed yet. Structure data on our other pages comes from those two sources,
            which typically lag 3+ months behind a patent&rsquo;s actual grant date. This is the tool for
            everything more recent than that.
          </p>

          <NewestPatentsForm />

          <div className="pa-glass p-6 mt-8">
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--on-surface)' }}>How this works</h2>
            <ol className="flex flex-col gap-2 text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              <li>1. Sign in and submit a patent number — one free run per account.</li>
              <li>2. We fetch the real document directly from the USPTO and run it through our own extraction pipeline (typically under 30 minutes).</li>
              <li>3. We email you a link. If a structure comes back confirmed with high confidence, unlocking the download is $15. If nothing comes back clean, you see the full result — including exactly what tripped it up — for free, with the option to escalate to a human-reviewed report.</li>
            </ol>
          </div>

          <div className="mt-8">
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--on-surface)' }}>Sample results</h2>
            <p className="text-sm mb-4" style={{ color: 'var(--on-surface-variant)' }}>
              Real extractions, run against real, currently un-indexed patents — including one showing exactly
              what a flagged, uncertain result looks like, not just the clean cases.
            </p>
            <div className="flex flex-col gap-3">
              <SampleCard
                patent="US12698261B2"
                title="Dana-Farber — Cyano-pyrimidine inhibitors of EGFR/HER2"
                note="Confirmed structure extracted from a real synthetic-procedures scheme."
              />
              <SampleCard
                patent="US12698271B2"
                title="Pfizer — Crystalline form of a SHP2 inhibitor"
                note="5 of 5 structures confirmed — both models agreed on every one."
              />
              <SampleCard
                patent="US12698270B2"
                title="MindRank AI — Aryl ether-substituted heterocyclic compounds as GLP1R agonists"
                note="Real mixed result: some structures confirmed, others honestly flagged as uncertain rather than guessed."
              />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

function SampleCard({ patent, title, note }: { patent: string; title: string; note: string }) {
  return (
    <div className="pa-glass p-5">
      <div className="pa-mono text-xs mb-1" style={{ color: 'var(--on-surface-muted)' }}>{patent}</div>
      <div className="text-sm font-semibold mb-1" style={{ color: 'var(--on-surface)' }}>{title}</div>
      <div className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>{note}</div>
    </div>
  )
}
