import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLiveExtractionRequest } from '@/lib/liveExtractionRequests'
import PatentAnalyticsHeader from '../../../PatentAnalyticsHeader'
import OpenStandardReportButton from '../../../OpenStandardReportButton'
import UnlockButton from '../../UnlockButton'

export const metadata: Metadata = { title: 'Extraction Result — Patent Analytics', robots: { index: false } }

type Props = { params: Promise<{ id: string }> }

export default async function ResultPage({ params }: Props) {
  const { id } = await params
  const request = await getLiveExtractionRequest(id)
  if (!request) notFound()

  return (
    <>
      <PatentAnalyticsHeader />
      <main>
        <div className="max-w-[800px] mx-auto px-6 py-12 md:py-16">
          <Link href="/patent-analytics/newest-patents" className="pa-mono text-xs uppercase tracking-wide" style={{ color: 'var(--on-surface-muted)' }}>
            ← Newest Patent Extraction
          </Link>

          <div className="pa-mono text-xs mt-4 mb-1" style={{ color: 'var(--on-surface-muted)' }}>{request.patent_number}</div>

          {request.status === 'pending' || request.status === 'processing' ? (
            <StillProcessing />
          ) : request.status === 'failed' ? (
            <Failed message={request.error_message} />
          ) : request.outcome === 'confirmed' ? (
            <Confirmed request={request} />
          ) : (
            <NeedsReview request={request} />
          )}
        </div>
      </main>
    </>
  )
}

function StillProcessing() {
  return (
    <div className="pa-glass p-8 text-center mt-4">
      <h1 className="pa-display text-2xl font-bold mb-3" style={{ color: 'var(--on-surface)' }}>Still processing</h1>
      <p className="text-base leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>
        This usually takes up to 30 minutes. We&rsquo;ll email you a link the moment it&rsquo;s ready — check back here anytime with this same link.
      </p>
    </div>
  )
}

function Failed({ message }: { message: string | null }) {
  return (
    <div className="pa-glass p-8 mt-4">
      <h1 className="pa-display text-2xl font-bold mb-3" style={{ color: 'var(--on-surface)' }}>Couldn&rsquo;t process this one</h1>
      <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--on-surface-variant)' }}>
        {message || 'Something went wrong fetching or reading this patent.'}
      </p>
      <p className="text-sm" style={{ color: 'var(--on-surface-muted)' }}>
        No charge for this. Email <a href="mailto:support@thechemsolver.com" style={{ color: 'var(--tertiary-bright)' }}>support@thechemsolver.com</a> if you&rsquo;d like us to take a manual look.
      </p>
    </div>
  )
}

type RequestWithResult = NonNullable<Awaited<ReturnType<typeof getLiveExtractionRequest>>>

function Confirmed({ request }: { request: RequestWithResult }) {
  const r = request.result_json!
  const confirmedStructures = r.structures.filter((s) => s.tier === 'confirmed')
  return (
    <div className="pa-glass p-8 mt-4">
      <h1 className="pa-display text-2xl font-bold mb-3" style={{ color: 'var(--on-surface)' }}>
        Success — {r.n_confirmed} of {r.n_structures_found} structures confirmed
      </h1>
      <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--on-surface-variant)' }}>
        We scanned {r.n_pages_scanned} of {r.n_pages_total} pages and found {confirmedStructures.length} structure(s)
        both of our independent extraction models agreed on.
      </p>

      {request.unlocked ? (
        <div className="flex flex-col gap-3">
          {confirmedStructures.map((s, i) => (
            <div key={i} className="pa-glass p-4">
              <div className="pa-mono text-xs mb-1" style={{ color: 'var(--on-surface-muted)' }}>Page {s.page}</div>
              <div className="pa-mono text-sm break-all" style={{ color: 'var(--on-surface)' }}>{s.molscribe_smiles}</div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="pa-glass p-5 mb-6" style={{ background: 'var(--surface-bright)' }}>
            <p className="text-sm mb-2" style={{ color: 'var(--on-surface-muted)' }}>Preview (unlock to see full SMILES):</p>
            {confirmedStructures.map((_, i) => (
              <div key={i} className="pa-mono text-sm mb-1" style={{ color: 'var(--on-surface-muted)', filter: 'blur(4px)' }}>
                C{'█'.repeat(20 + i * 4)}
              </div>
            ))}
          </div>
          <UnlockButton requestId={request.id} />
        </>
      )}
    </div>
  )
}

function NeedsReview({ request }: { request: RequestWithResult }) {
  const r = request.result_json!
  return (
    <div className="pa-glass p-8 mt-4">
      <h1 className="pa-display text-2xl font-bold mb-3" style={{ color: 'var(--on-surface)' }}>
        No confirmed structure — here&rsquo;s exactly why
      </h1>
      <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--on-surface-variant)' }}>
        We scanned {r.n_pages_scanned} of {r.n_pages_total} pages and found {r.n_structures_found} candidate
        structure(s), but none passed our confirmation bar (both independent models must agree). This is free —
        no charge for an unconfirmed result. Here&rsquo;s what we actually found:
      </p>
      <div className="flex flex-col gap-3 mb-6">
        {r.structures.length === 0 && (
          <p className="text-sm" style={{ color: 'var(--on-surface-muted)' }}>{r.error_message || 'No structure-bearing pages were found in this patent.'}</p>
        )}
        {r.structures.map((s, i) => (
          <div key={i} className="pa-glass p-4">
            <div className="pa-mono text-xs mb-1" style={{ color: 'var(--on-surface-muted)' }}>Page {s.page} — {s.tier}</div>
            {s.molscribe_smiles && <div className="pa-mono text-xs mb-1 break-all" style={{ color: 'var(--on-surface-variant)' }}>MolScribe: {s.molscribe_smiles}</div>}
            {s.molnextr_smiles && <div className="pa-mono text-xs mb-1 break-all" style={{ color: 'var(--on-surface-variant)' }}>MolNexTR: {s.molnextr_smiles}</div>}
            {s.reason && <div className="text-sm mt-1" style={{ color: 'var(--on-surface-muted)' }}>{s.reason}</div>}
          </div>
        ))}
      </div>
      <div className="pa-glass p-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ background: 'var(--surface-bright)' }}>
        <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
          A person can often resolve exactly this kind of ambiguity — confirm a stereocenter, read a condensed
          formula by eye.
        </p>
        <OpenStandardReportButton className="pa-chip text-sm font-medium px-5 py-2.5 shrink-0">
          Get a Standard Report →
        </OpenStandardReportButton>
      </div>
    </div>
  )
}
