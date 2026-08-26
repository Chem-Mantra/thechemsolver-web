import type { Metadata } from 'next'
import { Fragment } from 'react'
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

          <div className="flex flex-wrap gap-2 mb-8">
            {partyList.map((p) => (
              <span key={p} className="pa-chip" style={{ background: 'rgba(75, 65, 225, 0.06)', borderColor: 'rgba(75, 65, 225, 0.14)', color: 'var(--secondary)' }}>
                {p}
              </span>
            ))}
          </div>

          <MoleculeDivider />

          <div className="flex flex-col gap-5 my-8">
            {paragraphs.map((para, i) => {
              const isCallout = /^why (it|this) matters:?/i.test(para.trim())
              const midpoint = article.inline_image_url ? Math.floor(paragraphs.length / 2) : -1
              return (
                <Fragment key={i}>
                  {i === midpoint && (
                    <div className="pa-glass pa-glass-elevated overflow-hidden my-2">
                      <Image
                        src={article.inline_image_url as string}
                        alt=""
                        width={1600}
                        height={900}
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                  {isCallout ? (
                    <div
                      className="pa-glass pa-glass-elevated p-6 flex gap-4 items-start"
                      style={{ borderLeft: '4px solid var(--primary)', background: 'linear-gradient(135deg, rgba(2,132,199,0.05), var(--surface-glass))' }}
                    >
                      <span className="shrink-0 text-2xl leading-none mt-0.5" aria-hidden>💡</span>
                      <p className="text-lg leading-relaxed font-medium" style={{ color: 'var(--on-surface)' }}>{para}</p>
                    </div>
                  ) : i > 0 && i % 3 === 0 ? (
                    // Every third paragraph gets a large colored pull-quote mark
                    // for visual rhythm, breaking up the text wall without
                    // needing an image for every beat.
                    <div className="flex gap-4 items-start">
                      <span className="pa-display shrink-0 text-5xl leading-none select-none" style={{ color: 'var(--primary)', opacity: 0.25 }} aria-hidden>“</span>
                      <p className="text-lg leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>{para}</p>
                    </div>
                  ) : (
                    <p className="text-lg leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>{para}</p>
                  )}
                </Fragment>
              )
            })}
          </div>

          <MoleculeDivider />

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

/** Purely decorative section break — same molecule motif as the header
 * logo, in brand colors. Breaks up the text wall without depending on an
 * externally-generated image for every beat of the article. */
function MoleculeDivider() {
  return (
    <div className="flex items-center gap-3 my-2" aria-hidden>
      <div className="h-px flex-1" style={{ background: 'var(--border-light)' }} />
      <svg width="28" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="6" cy="6" r="2.5" fill="var(--primary)" />
        <circle cx="18" cy="6" r="2.5" fill="var(--secondary)" />
        <circle cx="12" cy="16" r="2.5" fill="var(--tertiary-bright)" />
        <path d="M8 7.5L10.5 14.5M16 7.5L13.5 14.5M8.5 6H15.5" stroke="var(--outline-variant)" strokeWidth="1.2" />
      </svg>
      <div className="h-px flex-1" style={{ background: 'var(--border-light)' }} />
    </div>
  )
}
