import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLiveExtractionRequest, type Section3dResult, type CompoundMatchResult } from '@/lib/liveExtractionRequests'
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
          ) : request.query_mode === 'section3d' ? (
            <Section3d request={request} />
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
  const isCompoundMatch = Boolean(request.query_compound_input)
  // Only reached when query_mode !== 'section3d' (routed away in the parent
  // dispatch), so match_result here is always the compound-match shape.
  const matchResult = request.match_result as CompoundMatchResult | null
  const confirmedStructures = isCompoundMatch
    ? r.structures.filter((s) => matchResult?.matched_pages.includes(s.page))
    : r.structures.filter((s) => s.tier === 'confirmed')

  return (
    <div className="pa-glass p-8 mt-4">
      <h1 className="pa-display text-2xl font-bold mb-3" style={{ color: 'var(--on-surface)' }}>
        {isCompoundMatch
          ? <>Match found — &ldquo;{request.query_compound_input}&rdquo; appears in this patent</>
          : <>Success — {r.n_confirmed} of {r.n_structures_found} structures confirmed</>}
      </h1>
      <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--on-surface-variant)' }}>
        {isCompoundMatch ? (
          <>We scanned {r.n_pages_scanned} of {r.n_pages_total} pages and confirmed your compound&rsquo;s structure
          matches one both of our independent extraction models agreed on.</>
        ) : (
          <>We scanned {r.n_pages_scanned} of {r.n_pages_total} pages and found {confirmedStructures.length} structure(s)
          both of our independent extraction models agreed on.</>
        )}
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
            <p className="text-sm mb-2" style={{ color: 'var(--on-surface-muted)' }}>Preview (unlock to see the page and full SMILES):</p>
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
  const isCompoundMatch = Boolean(request.query_compound_input)
  return (
    <div className="pa-glass p-8 mt-4">
      <h1 className="pa-display text-2xl font-bold mb-3" style={{ color: 'var(--on-surface)' }}>
        {isCompoundMatch
          ? <>Not confirmed — &ldquo;{request.query_compound_input}&rdquo; wasn&rsquo;t found with confidence</>
          : <>No confirmed structure — here&rsquo;s exactly why</>}
      </h1>
      <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--on-surface-variant)' }}>
        {isCompoundMatch ? (
          <>We scanned {r.n_pages_scanned} of {r.n_pages_total} pages and found {r.n_structures_found} candidate
          structure(s) in this patent, but none that both independent models confirmed matched your compound.
          This doesn&rsquo;t mean it definitely isn&rsquo;t there — only that we can&rsquo;t confirm it automatically.
          This is free. Here&rsquo;s what we actually found in the patent:</>
        ) : (
          <>We scanned {r.n_pages_scanned} of {r.n_pages_total} pages and found {r.n_structures_found} candidate
          structure(s), but none passed our confirmation bar (both independent models must agree). This is free —
          no charge for an unconfirmed result. Here&rsquo;s what we actually found:</>
        )}
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

const SECTION3D_CATEGORY_LABEL: Record<string, string> = {
  SALT: 'Salt',
  ISOMER: 'Isomer',
  IDENTICAL_STRUCTURE: 'Identical structure',
  SAME_FORMULA_DIFFERENT_CONNECTIVITY: 'Same formula, different connectivity',
  POSSIBLE_ESTER_ETHER_DERIVATIVE: 'Possible ester/ether derivative',
}

function Section3d({ request }: { request: RequestWithResult }) {
  const r = request.result_json!
  const section3d = request.match_result as Section3dResult | null
  const hits = section3d?.hits ?? []

  return (
    <div className="pa-glass p-8 mt-4">
      <h1 className="pa-display text-2xl font-bold mb-3" style={{ color: 'var(--on-surface)' }}>
        {hits.length > 0
          ? <>Structural relationship found vs. &ldquo;{request.query_compound_input}&rdquo;</>
          : <>No Section 3(d)-relevant relationship found vs. &ldquo;{request.query_compound_input}&rdquo;</>}
      </h1>
      <p className="text-base leading-relaxed mb-2" style={{ color: 'var(--on-surface-variant)' }}>
        We scanned {r.n_pages_scanned} of {r.n_pages_total} pages, extracted {r.n_confirmed} confirmed structure(s),
        and compared each against your known compound using real substructure/formula analysis (RDKit) — not a
        keyword or similarity-score match.
      </p>
      <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--on-surface-muted)' }}>
        This screens the structural relationship only. It cannot determine whether therapeutic efficacy was
        enhanced — Section 3(d)&rsquo;s actual bar also requires that, and no structural tool can see it from a
        SMILES string alone. Not a validity or infringement conclusion; for your counsel&rsquo;s review.
      </p>

      {section3d?.error ? (
        <div className="pa-glass p-5" style={{ background: 'var(--surface-bright)' }}>
          <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>{section3d.error}</p>
        </div>
      ) : hits.length === 0 ? (
        <>
          <div className="pa-glass p-5 mb-6" style={{ background: 'var(--surface-bright)' }}>
            <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              No confirmed structure in this patent showed a salt, isomer, ester/ether, or identical-structure
              relationship to your known compound. This is free — no charge for this result.
            </p>
          </div>
          <div className="pa-glass p-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ background: 'var(--surface-bright)' }}>
            <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              Want a hand-reviewed genus/coverage analysis instead of a structural screen?
            </p>
            <OpenStandardReportButton className="pa-chip text-sm font-medium px-5 py-2.5 shrink-0">
              Get a Standard Report →
            </OpenStandardReportButton>
          </div>
        </>
      ) : request.unlocked ? (
        <div className="flex flex-col gap-3">
          {hits.map((h, i) => (
            <div key={i} className="pa-glass p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="pa-chip" style={{ padding: '2px 10px', fontSize: '11px' }}>
                  {SECTION3D_CATEGORY_LABEL[h.category] ?? h.category}
                </span>
                <span className="pa-mono text-xs" style={{ color: 'var(--on-surface-muted)' }}>Page {h.page}</span>
              </div>
              <div className="pa-mono text-sm mb-2 break-all" style={{ color: 'var(--on-surface)' }}>{h.new_compound_smiles}</div>
              <div className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>{h.explanation}</div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="pa-glass p-5 mb-6" style={{ background: 'var(--surface-bright)' }}>
            <p className="text-sm mb-2" style={{ color: 'var(--on-surface-muted)' }}>Preview (unlock to see the page, structure, and full explanation):</p>
            {hits.map((h, i) => (
              <div key={i} className="flex items-center gap-2 mb-1">
                <span className="pa-chip" style={{ padding: '2px 10px', fontSize: '11px' }}>
                  {SECTION3D_CATEGORY_LABEL[h.category] ?? h.category}
                </span>
                <span className="pa-mono text-sm" style={{ color: 'var(--on-surface-muted)', filter: 'blur(4px)' }}>
                  C{'█'.repeat(20 + i * 4)}
                </span>
              </div>
            ))}
          </div>
          <UnlockButton requestId={request.id} />
        </>
      )}
    </div>
  )
}
