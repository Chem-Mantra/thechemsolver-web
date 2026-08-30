import type { Metadata } from 'next'
import Link from 'next/link'
import PatentAnalyticsHeader from '../PatentAnalyticsHeader'
import NewestPatentsForm from './NewestPatentsForm'
import FaqSection from '../FaqSection'
import { SAMPLE_RESULTS } from '@/lib/newestPatentsSamples'

const FAQS = [
  {
    question: 'How is this different from your other products?',
    answer: "Those rely on Google Patents and PubChem's own structure indexing, which typically lags a patent's grant date by 3+ months. This tool fetches the real patent PDF directly from the USPTO and runs our own extraction pipeline, so it covers patents the other tools can't see yet.",
  },
  {
    question: 'What does it cost?',
    answer: "It's free to run — you only pay $15 to unlock a confirmed result's download. If nothing comes back confirmed, you see the full result, including exactly what tripped it up, for free.",
  },
  {
    question: 'How long does it take?',
    answer: "Typically under 30 minutes. We email you a link when it's done so you don't have to wait on the page — sign in, submit, and close the tab.",
  },
  {
    question: "What if my patent isn't chemistry-related, or has a broad genus claim instead of one fixed compound?",
    answer: 'We check this up front. Unrelated patents get a clear "not applicable" response instead of wasting a run, and genus/Markush cases route to our Markush Coverage product\'s human-reviewed process instead.',
  },
]

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
              {SAMPLE_RESULTS.map((s) => (
                <SampleCard key={s.slug} slug={s.slug} patent={s.patentNumber} title={s.title} note={s.note} />
              ))}
            </div>
          </div>

          <FaqSection title="Frequently asked" faqs={FAQS} />
        </div>
      </main>
    </>
  )
}

function SampleCard({ slug, patent, title, note }: { slug: string; patent: string; title: string; note: string }) {
  return (
    <Link href={`/patent-analytics/newest-patents/samples/${slug}`} className="pa-glass pa-glass-elevated p-5 block hover:shadow-md transition-shadow">
      <div className="pa-mono text-xs mb-1" style={{ color: 'var(--on-surface-muted)' }}>{patent}</div>
      <div className="text-sm font-semibold mb-1" style={{ color: 'var(--on-surface)' }}>{title}</div>
      <div className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>{note}</div>
    </Link>
  )
}
