import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PRODUCTS, productBySlug, getResultsByProduct } from '@/lib/productResults'
import PatentAnalyticsHeader from '../../PatentAnalyticsHeader'
import OpenCheckPatentButton from '../../OpenCheckPatentButton'
import OpenStandardReportButton from '../../OpenStandardReportButton'
import FaqSection from '../../FaqSection'

// Only fto_triage/portfolio_landscape are automated enough to promise a
// same-hour turnaround on an arbitrary new patent (the $10 Instant
// Compound Check flow OpenCheckPatentButton opens). Markush Coverage and
// Section 3(d) genuinely need a hand-built genus definition / hand-
// confirmed known+new pair per case (real example: this session's own
// Markush cases each took real research + verification time, not an
// automated minutes-long run) -- pointing that same "1 hour" paid-$10 CTA
// at them would be selling a turnaround this pipeline cannot deliver.
// These two route to the $199 Standard Report (human-reviewed) instead.
const AUTOMATED_CHECK_PRODUCTS = new Set(['fto_triage', 'portfolio_landscape'])

const SITE = 'https://patent-analytics.thechemsolver.com'

type Props = { params: Promise<{ product: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product: slug } = await params
  const productType = productBySlug(slug)
  if (!productType) return { title: 'Not found' }
  const p = PRODUCTS[productType]
  return {
    title: { absolute: `${p.name} — Patent Analytics` },
    description: p.tagline,
    alternates: { canonical: `${SITE}/data/${slug}` },
    robots: { index: true, follow: true, googleBot: { 'max-image-preview': 'large' } },
  }
}

export default async function ProductDataPage({ params }: Props) {
  const { product: slug } = await params
  const productType = productBySlug(slug)
  if (!productType) notFound()
  const p = PRODUCTS[productType]

  const results = await getResultsByProduct(productType)

  return (
    <>
      <PatentAnalyticsHeader />
      <main>
        <div className="max-w-[1000px] mx-auto px-6 py-12 md:py-16">
          <Link href="/patent-analytics#services" className="pa-mono text-xs uppercase tracking-wide" style={{ color: 'var(--on-surface-muted)' }}>
            ← All services
          </Link>

          <h1 className="pa-display text-[32px] md:text-[44px] font-bold leading-[1.1] mt-4 mb-3" style={{ color: 'var(--on-surface)' }}>
            {p.name}
          </h1>
          <p className="text-lg mb-10" style={{ color: 'var(--on-surface-variant)' }}>{p.tagline}</p>

          <LiveResults slug={p.slug} results={results} />

          {AUTOMATED_CHECK_PRODUCTS.has(productType) ? (
            <div className="pa-glass p-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                Don&rsquo;t see the patent you&rsquo;re looking for? We&rsquo;ll run it and email you within 1 hour.
              </p>
              <OpenCheckPatentButton className="pa-chip text-sm font-medium px-5 py-2.5 shrink-0">
                Check a patent →
              </OpenCheckPatentButton>
            </div>
          ) : (
            <div className="pa-glass p-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                Need this run on your own compound or patent? {p.shortName} needs a hand-reviewed
                case build, not an automated minutes-long check — get a Standard Report with real human sign-off.
              </p>
              <OpenStandardReportButton className="pa-chip text-sm font-medium px-5 py-2.5 shrink-0">
                Get a Standard Report →
              </OpenStandardReportButton>
            </div>
          )}

          <FaqSection title="Frequently asked" faqs={p.faq} />
        </div>
      </main>
    </>
  )
}

function LiveResults({ slug, results }: { slug: string; results: Awaited<ReturnType<typeof getResultsByProduct>> }) {
  if (results.length === 0) {
    return (
      <div className="pa-glass p-8 text-center">
        <p className="text-base" style={{ color: 'var(--on-surface-muted)' }}>
          Real patent results are being processed and will appear here as they're auto-verified — check back soon.
        </p>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-4">
      {results.map((r) => (
        // Each result is its own indexable page (not an anchor on this
        // shared listing) -- a Google search on this specific patent
        // should land here, not on a page shared with every other result.
        <Link key={r.id} href={`/patent-analytics/data/${slug}/${r.patent_number}`} className="pa-glass pa-glass-elevated p-6 block hover:shadow-md transition-shadow">
          <div className="pa-mono text-xs mb-2" style={{ color: 'var(--on-surface-muted)' }}>{r.patent_number}</div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--on-surface)' }}>{r.headline}</h2>
          <p className="text-base" style={{ color: 'var(--on-surface-variant)' }}>{r.summary}</p>
        </Link>
      ))}
    </div>
  )
}

