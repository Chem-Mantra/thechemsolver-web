import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getArticleBySlug } from '@/lib/patentNews'
import PatentAnalyticsHeader from '../../PatentAnalyticsHeader'
import OpenLeadFormButton from '../../OpenLeadFormButton'

const SITE = 'https://patent-analytics.thechemsolver.com'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return { title: 'Article not found' }

  const url = `${SITE}/news/${slug}`
  return {
    title: { absolute: `${article.title} — Patent Analytics` },
    description: article.summary,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title: article.title,
      description: article.summary,
      url,
      type: 'article',
      publishedTime: article.published_date,
      images: article.image_url ? [article.image_url] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: article.image_url ? [article.image_url] : undefined,
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const url = `${SITE}/news/${slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary,
    datePublished: article.published_date,
    url,
    image: article.image_url ? `${SITE}${article.image_url}` : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Patent Analytics by TheChemSolver',
      url: SITE,
    },
    about: article.parties,
  }

  const paragraphs = article.body.split('\n\n')
  const partyList = article.parties.split(';').map((p) => p.trim()).filter(Boolean)

  return (
    <>
      <PatentAnalyticsHeader />
      <main>
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="max-w-[820px] mx-auto px-6 py-12 md:py-16">
          <Link href="/patent-analytics#patent-news" className="pa-mono text-xs uppercase tracking-wide" style={{ color: 'var(--on-surface-muted)' }}>
            ← All patent news
          </Link>

          <div className="pa-chip mt-6 mb-4">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--tertiary-bright)' }} />
            {new Date(article.published_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>

          <h1 className="pa-display text-[32px] md:text-[48px] font-bold leading-[1.1] mb-6" style={{ color: 'var(--on-surface)' }}>
            {article.title}
          </h1>

          {article.image_url && (
            <div className="pa-glass pa-glass-elevated overflow-hidden mb-8">
              <Image
                src={article.image_url}
                alt={article.title}
                width={1600}
                height={900}
                className="w-full h-auto"
                priority
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-10">
            {partyList.map((p) => (
              <span key={p} className="pa-chip" style={{ background: 'rgba(75, 65, 225, 0.06)', borderColor: 'rgba(75, 65, 225, 0.14)', color: 'var(--secondary)' }}>
                {p}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-5 mb-4">
            {paragraphs.map((para, i) => {
              const isCallout = /^why (it|this) matters:?/i.test(para.trim())
              if (isCallout) {
                return (
                  <div
                    key={i}
                    className="pa-glass pa-glass-elevated p-6"
                    style={{ borderLeft: '4px solid var(--primary)', background: 'linear-gradient(135deg, rgba(2,132,199,0.05), var(--surface-glass))' }}
                  >
                    <p className="text-lg leading-relaxed font-medium" style={{ color: 'var(--on-surface)' }}>{para}</p>
                  </div>
                )
              }
              return (
                <p key={i} className="text-lg leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>{para}</p>
              )
            })}
          </div>

          {/* Services CTA — every article reader is a prospective client;
              this is the actual conversion point, not just a news blurb. */}
          <div
            className="pa-glass pa-glass-elevated p-6 md:p-8 mt-4"
            style={{ background: 'linear-gradient(135deg, rgba(2,132,199,0.06), rgba(75,65,225,0.05))' }}
          >
            <p className="pa-mono text-[11px] uppercase tracking-wide mb-2" style={{ color: 'var(--tertiary)' }}>
              What we do
            </p>
            <h2 className="pa-display text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--on-surface)' }}>
              See if this applies to one of your matters
            </h2>
            <p className="text-base leading-relaxed mb-6 max-w-2xl" style={{ color: 'var(--on-surface-variant)' }}>
              We run genus/species (Markush) claim coverage analysis, Section 3(d) compliance screening, and prior-art
              structural triage on real chemical structures — not keyword search. If a case like this one is live for
              you, we&apos;ll run a free sample on a compound of your choosing.
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
