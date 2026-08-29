import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getExpirationBySlug } from '@/lib/patentExpirations'
import PatentAnalyticsHeader from '../../PatentAnalyticsHeader'
import OpenRetainerModalButton from '../../OpenRetainerModalButton'
import ProductSidebarCards from '../../ProductSidebarCards'

const SITE = 'https://patent-analytics.thechemsolver.com'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = await getExpirationBySlug(slug)
  if (!item) return { title: 'Not found' }

  const url = `${SITE}/expirations/${slug}`
  return {
    title: { absolute: `${item.title} — Patent Expiry Watch — Patent Analytics` },
    description: item.caption,
    alternates: { canonical: url },
    robots: { index: true, follow: true, googleBot: { 'max-image-preview': 'large' } },
    openGraph: { title: item.title, description: item.caption, url, type: 'article', publishedTime: item.published_date, images: [item.image_url] },
    twitter: { card: 'summary_large_image', title: item.title, description: item.caption, images: [item.image_url] },
  }
}

export default async function ExpirationPage({ params }: Props) {
  const { slug } = await params
  const item = await getExpirationBySlug(slug)
  if (!item) notFound()

  const url = `${SITE}/expirations/${slug}`
  // ImageObject, not NewsArticle -- this content IS the image (an
  // infographic), not a text article illustrated by one. Distinct from the
  // NewsArticle schema the /news pages use.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    name: item.title,
    description: item.caption,
    contentUrl: `${SITE}${item.image_url}`,
    datePublished: item.published_date,
    url,
    creator: { '@type': 'Person', name: 'Prashant Kotian', jobTitle: 'PhD Researcher, Chemistry (Institute of Chemical Technology, Mumbai)' },
    publisher: { '@type': 'Organization', name: 'Patent Analytics by TheChemSolver', url: SITE },
  }

  return (
    <>
      <PatentAnalyticsHeader />
      <main>
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="flex justify-center gap-6 max-w-[1400px] mx-auto px-6">
          <ProductSidebarCards side="left" />
          <div className="max-w-[820px] w-full py-12 md:py-16">
            <Link href="/patent-analytics/expirations" className="pa-mono text-xs uppercase tracking-wide" style={{ color: 'var(--on-surface-muted)' }}>
              ← Patent Expiry Watch
            </Link>

            <div className="pa-chip mt-6 mb-4">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--tertiary-bright)' }} />
              {new Date(item.published_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              {item.expiry_date && ` · Patent expires ${new Date(item.expiry_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
            </div>

            <h1 className="pa-display text-[28px] md:text-[38px] font-bold leading-[1.15] mb-4" style={{ color: 'var(--on-surface)' }}>
              {item.title}
            </h1>

            <div className="pa-glass pa-glass-elevated overflow-hidden mb-6">
              <Image src={item.image_url} alt={item.title} width={1600} height={1600} className="w-full h-auto" priority />
            </div>

            <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--on-surface-variant)' }}>{item.caption}</p>

            <div
              className="pa-glass pa-glass-elevated p-6 md:p-8"
              style={{ background: 'linear-gradient(135deg, rgba(2,132,199,0.06), rgba(75,65,225,0.05))' }}
            >
              <p className="pa-mono text-[11px] uppercase tracking-wide mb-2" style={{ color: 'var(--tertiary)' }}>What we do</p>
              <h2 className="pa-display text-2xl font-bold mb-3" style={{ color: 'var(--on-surface)' }}>
                We track expirations like this continuously
              </h2>
              <p className="text-base leading-relaxed mb-6 max-w-2xl" style={{ color: 'var(--on-surface-variant)' }}>
                This is one drug, picked for today&apos;s post. A Portfolio Retainer watches an entire portfolio or
                compound class on an ongoing basis and flags new matching filings as they publish.
              </p>
              <OpenRetainerModalButton className="pa-btn-primary text-base font-medium px-6 py-3">
                See the Portfolio Retainer →
              </OpenRetainerModalButton>
            </div>
          </div>
          <ProductSidebarCards side="right" />
        </div>
      </main>
    </>
  )
}
