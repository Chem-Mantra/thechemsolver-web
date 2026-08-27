import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PRODUCTS, productBySlug, getResultByProductAndPatent } from '@/lib/productResults'
import PatentAnalyticsHeader from '../../../PatentAnalyticsHeader'
import GatedDownloadButton from '../../../GatedDownloadButton'
import OpenLeadFormButton from '../../../OpenLeadFormButton'

const SITE = 'https://patent-analytics.thechemsolver.com'

type Props = { params: Promise<{ product: string; patentNumber: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product: slug, patentNumber } = await params
  const productType = productBySlug(slug)
  if (!productType) return { title: 'Not found' }
  const result = await getResultByProductAndPatent(productType, patentNumber)
  if (!result) return { title: 'Not found' }

  const p = PRODUCTS[productType]
  const url = `${SITE}/data/${slug}/${patentNumber}`
  return {
    // Unique, specific title per report -- this (not the shared product
    // listing page) is what should rank for a search on this exact patent.
    title: { absolute: `${result.headline} — ${p.shortName} — Patent Analytics` },
    description: result.summary,
    alternates: { canonical: url },
    robots: { index: true, follow: true, googleBot: { 'max-image-preview': 'large' } },
    openGraph: {
      title: result.headline,
      description: result.summary,
      url,
      type: 'article',
      publishedTime: result.published_date,
    },
  }
}

export default async function ProductResultPage({ params }: Props) {
  const { product: slug, patentNumber } = await params
  const productType = productBySlug(slug)
  if (!productType) notFound()
  const result = await getResultByProductAndPatent(productType, patentNumber)
  if (!result) notFound()
  const p = PRODUCTS[productType]

  const url = `${SITE}/data/${slug}/${patentNumber}`
  // Dataset -- the closest accurate schema.org type for a structured
  // per-patent analysis result, distinct from the NewsArticle type used
  // for the daily case-law articles.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: result.headline,
    description: result.summary,
    datePublished: result.published_date,
    url,
    creator: {
      '@type': 'Person',
      name: 'Prashant Kotian',
      jobTitle: 'PhD Researcher, Chemistry (Institute of Chemical Technology, Mumbai)',
      url: `${SITE}#contact`,
    },
    publisher: { '@type': 'Organization', name: 'Patent Analytics by TheChemSolver', url: SITE },
    about: result.patent_number,
    isAccessibleForFree: true,
  }

  return (
    <>
      <PatentAnalyticsHeader />
      <main>
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="max-w-[820px] mx-auto px-6 py-12 md:py-16">
          <Link href={`/patent-analytics/data/${slug}`} className="pa-mono text-xs uppercase tracking-wide" style={{ color: 'var(--on-surface-muted)' }}>
            ← All {p.shortName} results
          </Link>

          <div className="pa-chip mt-6 mb-4">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--tertiary-bright)' }} />
            {p.shortName} · {new Date(result.published_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>

          <div className="pa-mono text-sm mb-3" style={{ color: 'var(--on-surface-muted)' }}>{result.patent_number}</div>

          <h1 className="pa-display text-[28px] md:text-[38px] font-bold leading-[1.15] mb-6" style={{ color: 'var(--on-surface)' }}>
            {result.headline}
          </h1>

          {/* Direct-answer framing up top -- helps both classic featured
              snippets and AI answer engines extract the finding cleanly. */}
          <div
            className="pa-glass pa-glass-elevated p-6 mb-8"
            style={{ borderLeft: '4px solid var(--primary)', background: 'linear-gradient(135deg, rgba(2,132,199,0.05), var(--surface-glass))' }}
          >
            <p className="text-lg leading-relaxed font-medium" style={{ color: 'var(--on-surface)' }}>{result.summary}</p>
          </div>

          <p className="text-sm mb-8" style={{ color: 'var(--on-surface-muted)' }}>
            Confidence: <b>auto-verified</b> — this result did not require human review before publishing.
          </p>

          <GatedDownloadButton
            filenameBase={`${slug}-${result.patent_number}`}
            title={result.headline}
            subtitle={`${result.patent_number} — ${PRODUCTS[productType].name}`}
            data={result.details_json}
            className="pa-btn-primary text-base font-medium px-6 py-3 mb-12"
          >
            Download full data →
          </GatedDownloadButton>

          <div
            className="pa-glass pa-glass-elevated p-6 md:p-8"
            style={{ background: 'linear-gradient(135deg, rgba(2,132,199,0.06), rgba(75,65,225,0.05))' }}
          >
            <p className="pa-mono text-[11px] uppercase tracking-wide mb-2" style={{ color: 'var(--tertiary)' }}>What we do</p>
            <h2 className="pa-display text-2xl font-bold mb-3" style={{ color: 'var(--on-surface)' }}>Need this run on your own compound?</h2>
            <p className="text-base leading-relaxed mb-6 max-w-2xl" style={{ color: 'var(--on-surface-variant)' }}>
              This is one of many patents we screen daily. If you have a specific compound or patent you need checked,
              we&apos;ll run a free sample report on it.
            </p>
            <OpenLeadFormButton className="pa-btn-primary text-base font-medium px-6 py-3">
              Get a free sample report →
            </OpenLeadFormButton>
          </div>
        </div>
      </main>
    </>
  )
}
