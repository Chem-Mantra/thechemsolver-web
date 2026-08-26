import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticleBySlug } from '@/lib/patentNews'

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
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
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
    publisher: {
      '@type': 'Organization',
      name: 'Patent Analytics by TheChemSolver',
      url: SITE,
    },
    about: article.parties,
  }

  return (
    <main className="min-h-screen" style={{ background: '#fff', color: '#191c1e' }}>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-[760px] mx-auto px-6 py-16">
        <Link href="/patent-analytics" className="pa-mono text-xs uppercase tracking-wide" style={{ color: 'var(--on-surface-muted, #6b7280)' }}>
          ← Patent Analytics
        </Link>
        <h1 className="pa-display text-[32px] md:text-[44px] font-bold leading-[1.1] mt-4 mb-3">{article.title}</h1>
        <p className="pa-mono text-xs mb-6" style={{ color: 'var(--on-surface-muted, #6b7280)' }}>
          {new Date(article.published_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <p className="text-sm mb-8" style={{ color: 'var(--on-surface-muted, #6b7280)' }}>
          <b>Parties:</b> {article.parties}
        </p>
        <div className="flex flex-col gap-4 mb-10">
          {article.body.split('\n\n').map((para, i) => (
            <p key={i} className="text-lg leading-relaxed" style={{ color: 'var(--on-surface-variant, #3f3f46)' }}>{para}</p>
          ))}
        </div>
        <a
          href={article.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="pa-mono text-[11px] uppercase tracking-wide"
          style={{ color: 'var(--on-surface-muted, #6b7280)' }}
        >
          Source ↗
        </a>
      </div>
    </main>
  )
}
