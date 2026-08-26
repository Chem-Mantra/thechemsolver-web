import Link from 'next/link'
import { getAllArticles, slugify } from '@/lib/patentNews'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Server-rendered (not client-fetched) so article content is present in
// the initial HTML for crawlers -- a client useEffect fetch left the
// page looking empty to anything that doesn't execute JS, which
// defeated the point of a page meant to rank for patent-law searches.

/** Compact top-right teaser: today's headline only, links to its own page. */
export async function LatestNewsTeaser() {
  const articles = await getAllArticles()
  const latest = articles[0]
  if (!latest) return null

  return (
    <Link
      href={`/patent-analytics/news/${slugify(latest.title)}`}
      className="pa-glass hidden lg:flex items-center gap-2 px-3 py-2 max-w-[280px] hover:shadow-md transition-shadow"
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ background: 'var(--tertiary-bright)' }} />
      <div className="min-w-0">
        <div className="pa-mono text-[10px] uppercase" style={{ color: 'var(--on-surface-muted)' }}>Latest patent news</div>
        <div className="text-xs font-semibold truncate" style={{ color: 'var(--on-surface)' }}>{latest.title}</div>
      </div>
    </Link>
  )
}

/** Full feed: a list of cards, each linking to its own indexable article page. */
export async function PatentNewsFeedSection() {
  const articles = await getAllArticles()

  if (articles.length === 0) {
    return (
      <section id="patent-news" className="w-full px-6 md:px-12 py-16">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="pa-display text-3xl font-bold mb-2">Patent News</h2>
          <p className="text-base" style={{ color: 'var(--on-surface-muted)' }}>
            Daily curated patent news starts soon — check back shortly.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="patent-news" className="w-full px-6 md:px-12 py-16" style={{ background: 'var(--surface-container-low)' }}>
      <div className="max-w-[1400px] mx-auto">
        <h2 className="pa-display text-3xl font-bold mb-2">Patent News</h2>
        <p className="text-base mb-10" style={{ color: 'var(--on-surface-muted)' }}>
          Curated daily — real, sourced developments in patent law and chemistry IP.
        </p>
        <div className="flex flex-col gap-3 max-w-3xl">
          {articles.map((a) => (
            <Link
              key={a.id}
              href={`/patent-analytics/news/${slugify(a.title)}`}
              className="pa-glass overflow-hidden px-6 py-4 hover:shadow-md transition-shadow"
            >
              <div className="pa-mono text-xs mb-1" style={{ color: 'var(--on-surface-muted)' }}>{formatDate(a.published_date)}</div>
              <div className="font-semibold text-base mb-1">{a.title}</div>
              <p className="text-sm line-clamp-2" style={{ color: 'var(--on-surface-variant)' }}>{a.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
