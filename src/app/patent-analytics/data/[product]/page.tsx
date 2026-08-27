import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PRODUCTS, productBySlug, getResultsByProduct } from '@/lib/productResults'
import { MARKUSH_SAMPLE, SECTION_3D_SAMPLE } from '../sampleContent'
import PatentAnalyticsHeader from '../../PatentAnalyticsHeader'
import OpenCheckPatentButton from '../../OpenCheckPatentButton'

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

  const results = p.hasLiveData ? await getResultsByProduct(productType) : []

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

          {p.hasLiveData ? (
            <LiveResults slug={p.slug} results={results} />
          ) : (
            <SampleContent productType={productType} />
          )}

          {p.hasLiveData && (
            <div className="pa-glass p-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                Don&rsquo;t see the patent you&rsquo;re looking for? We&rsquo;ll run it and email you within 1 hour.
              </p>
              <OpenCheckPatentButton className="pa-chip text-sm font-medium px-5 py-2.5 shrink-0">
                Check a patent →
              </OpenCheckPatentButton>
            </div>
          )}
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

function SampleContent({ productType }: { productType: string }) {
  if (productType === 'markush_coverage') {
    const s = MARKUSH_SAMPLE
    return (
      <div className="pa-glass pa-glass-elevated p-8">
        <p className="pa-mono text-[11px] uppercase tracking-wide mb-2" style={{ color: 'var(--tertiary)' }}>Real validated example</p>
        <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--on-surface)' }}>{s.caseTitle}</h2>
        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--on-surface-variant)' }}>{s.description}</p>
        <Link href={s.linkHref} className="pa-btn-primary inline-block text-sm font-medium px-5 py-2.5 mb-6">{s.linkText}</Link>
        <div className="border-t pt-4" style={{ borderColor: 'var(--border-light)' }}>
          <p className="text-sm" style={{ color: 'var(--on-surface-muted)' }}>{s.methodNote}</p>
        </div>
      </div>
    )
  }
  if (productType === 'section_3d') {
    const s = SECTION_3D_SAMPLE
    return (
      <div className="pa-glass pa-glass-elevated p-8">
        <p className="pa-mono text-[11px] uppercase tracking-wide mb-2" style={{ color: 'var(--tertiary)' }}>Real validated example</p>
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--on-surface)' }}>{s.caseTitle}</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="pa-chip" style={{ display: 'block' }}>
            <div className="pa-mono text-[10px] uppercase mb-1" style={{ color: 'var(--on-surface-muted)' }}>Known substance</div>
            <div className="text-sm font-medium">{s.knownSubstance.name}</div>
            <div className="text-xs" style={{ color: 'var(--on-surface-muted)' }}>PubChem CID {s.knownSubstance.pubchemCid}</div>
          </div>
          <div className="pa-chip" style={{ display: 'block' }}>
            <div className="pa-mono text-[10px] uppercase mb-1" style={{ color: 'var(--on-surface-muted)' }}>Claimed new form</div>
            <div className="text-sm font-medium">{s.newForm.name}</div>
          </div>
        </div>
        <p className="text-base font-semibold mb-2" style={{ color: 'var(--primary)' }}>{s.result}</p>
        <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--on-surface-variant)' }}>{s.reasoning}</p>
        <div className="border-t pt-4" style={{ borderColor: 'var(--border-light)' }}>
          <p className="text-sm" style={{ color: 'var(--on-surface-muted)' }}>{s.methodNote}</p>
        </div>
      </div>
    )
  }
  return null
}
