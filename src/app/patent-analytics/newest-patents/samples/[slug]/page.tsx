import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSampleBySlug, SAMPLE_RESULTS } from '@/lib/newestPatentsSamples'
import PatentAnalyticsHeader from '../../../PatentAnalyticsHeader'
import GatedDownloadButton from '../../../GatedDownloadButton'

const SITE = 'https://patent-analytics.thechemsolver.com'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return SAMPLE_RESULTS.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const sample = getSampleBySlug(slug)
  if (!sample) return { title: 'Not found' }
  return {
    title: { absolute: `${sample.title} — Newest Patent Extraction Sample` },
    description: sample.note,
    alternates: { canonical: `${SITE}/newest-patents/samples/${slug}` },
    robots: { index: true, follow: true },
  }
}

const TIER_LABEL: Record<string, string> = {
  confirmed: 'Confirmed',
  needs_review: 'Needs review',
  failed: 'Failed',
}
const TIER_BADGE_CLASS: Record<string, string> = {
  confirmed: 'badge-verified',
  needs_review: 'badge-review',
  failed: 'badge-review',
}

export default async function SampleResultPage({ params }: Props) {
  const { slug } = await params
  const sample = getSampleBySlug(slug)
  if (!sample) notFound()

  const confirmedCount = sample.structures.filter((s) => s.tier === 'confirmed').length

  return (
    <>
      <PatentAnalyticsHeader />
      <main>
        <div className="max-w-[800px] mx-auto px-6 py-12 md:py-16">
          <Link href="/patent-analytics/newest-patents" className="pa-mono text-xs uppercase tracking-wide" style={{ color: 'var(--on-surface-muted)' }}>
            ← Newest Patent Extraction
          </Link>

          <div className="pa-mono text-xs mt-4 mb-1" style={{ color: 'var(--on-surface-muted)' }}>{sample.patentNumber}</div>
          <h1 className="pa-display text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--on-surface)' }}>{sample.title}</h1>
          <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--on-surface-variant)' }}>{sample.note}</p>

          <div className="pa-glass p-5 mb-6">
            <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              Scanned {sample.nPagesScanned} of {sample.nPagesTotal} pages — {confirmedCount} of {sample.structures.length} structure(s) confirmed
              (both independent extraction models agreed).
            </p>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            {sample.structures.map((s, i) => (
              <div key={i} className="pa-glass p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge ${TIER_BADGE_CLASS[s.tier]}`} style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 999, background: s.tier === 'confirmed' ? '#e3f6ea' : '#fdf1de', color: s.tier === 'confirmed' ? '#167a3f' : '#a5610a' }}>
                    {TIER_LABEL[s.tier]}
                  </span>
                  <span className="pa-mono text-xs" style={{ color: 'var(--on-surface-muted)' }}>Page {s.page}</span>
                </div>
                {s.molscribe_smiles && (
                  <div className="pa-mono text-sm mb-1 break-all" style={{ color: 'var(--on-surface)' }}>MolScribe: {s.molscribe_smiles}</div>
                )}
                {s.molnextr_smiles && (
                  <div className="pa-mono text-sm mb-1 break-all" style={{ color: 'var(--on-surface-variant)' }}>MolNexTR: {s.molnextr_smiles}</div>
                )}
                {s.reason && <div className="text-sm mt-2" style={{ color: 'var(--on-surface-muted)' }}>{s.reason}</div>}
              </div>
            ))}
          </div>

          <GatedDownloadButton
            filenameBase={`newest-patent-extraction-${sample.slug}`}
            title={sample.title}
            subtitle={`${sample.patentNumber} — Newest Patent Extraction sample`}
            data={{
              patent_number: sample.patentNumber,
              n_pages_total: sample.nPagesTotal,
              n_pages_scanned: sample.nPagesScanned,
              structures: sample.structures,
            }}
            className="pa-btn-primary text-base font-semibold px-6 py-3.5 inline-block"
          >
            Download full result →
          </GatedDownloadButton>
        </div>
      </main>
    </>
  )
}
