'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Article = {
  id: string
  title: string
  summary: string
  parties: string
  source_url: string
  published_date: string
}

async function fetchArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('patent_news')
    .select('*')
    .order('published_date', { ascending: false })
    .limit(30)
  if (error) {
    console.warn('patent_news fetch failed:', error.message)
    return []
  }
  return data as Article[]
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/** Compact top-right teaser: today's headline only, links down to the full feed. */
export function LatestNewsTeaser() {
  const [latest, setLatest] = useState<Article | null>(null)

  useEffect(() => {
    fetchArticles().then((a) => setLatest(a[0] ?? null))
  }, [])

  if (!latest) return null

  return (
    <a
      href="#patent-news"
      className="pa-glass hidden lg:flex items-center gap-2 px-3 py-2 max-w-[280px] hover:shadow-md transition-shadow"
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ background: 'var(--tertiary-bright)' }} />
      <div className="min-w-0">
        <div className="pa-mono text-[10px] uppercase" style={{ color: 'var(--on-surface-muted)' }}>Latest patent news</div>
        <div className="text-xs font-semibold truncate" style={{ color: 'var(--on-surface)' }}>{latest.title}</div>
      </div>
    </a>
  )
}

/** Full feed: latest article expanded, older ones as click-to-expand accordion rows. */
export function PatentNewsFeedSection() {
  const [articles, setArticles] = useState<Article[] | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    fetchArticles().then((a) => {
      setArticles(a)
      if (a[0]) setOpenId(a[0].id)
    })
  }, [])

  if (articles === null) {
    return (
      <section id="patent-news" className="w-full px-6 md:px-12 py-16">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-base" style={{ color: 'var(--on-surface-muted)' }}>Loading patent news…</p>
        </div>
      </section>
    )
  }

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
          {articles.map((a) => {
            const open = openId === a.id
            return (
              <div key={a.id} className="pa-glass overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : a.id)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="pa-mono text-xs mb-1" style={{ color: 'var(--on-surface-muted)' }}>{formatDate(a.published_date)}</div>
                    <div className="font-semibold text-base truncate">{a.title}</div>
                  </div>
                  <span
                    className="shrink-0 text-lg transition-transform"
                    style={{ transform: open ? 'rotate(45deg)' : 'none', color: 'var(--primary)' }}
                  >
                    +
                  </span>
                </button>
                {open && (
                  <div className="px-6 pb-5">
                    <p className="text-base leading-relaxed mb-3" style={{ color: 'var(--on-surface-variant)' }}>{a.summary}</p>
                    <p className="text-sm mb-2" style={{ color: 'var(--on-surface-muted)' }}>
                      <b>Parties:</b> {a.parties}
                    </p>
                    <a href={a.source_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium" style={{ color: 'var(--primary)' }}>
                      Read source →
                    </a>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
