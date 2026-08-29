import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllExpirations, slugify } from '@/lib/patentExpirations'
import PatentAnalyticsHeader from '../PatentAnalyticsHeader'

const SITE = 'https://patent-analytics.thechemsolver.com'

export const metadata: Metadata = {
  title: { absolute: 'Patent Expiry Watch — Patent Analytics' },
  description: 'Daily infographics on real drug patents expiring soon — what it is, whose patent, expiry date, and the generic-entry picture.',
  alternates: { canonical: `${SITE}/expirations` },
  robots: { index: true, follow: true, googleBot: { 'max-image-preview': 'large' } },
}

function formatDate(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function ExpirationsFeedPage() {
  const items = await getAllExpirations()

  return (
    <>
      <PatentAnalyticsHeader />
      <main>
        <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-16">
          <Link href="/patent-analytics#services" className="pa-mono text-xs uppercase tracking-wide" style={{ color: 'var(--on-surface-muted)' }}>
            ← All services
          </Link>

          <h1 className="pa-display text-[32px] md:text-[44px] font-bold leading-[1.1] mt-4 mb-3" style={{ color: 'var(--on-surface)' }}>
            Patent Expiry Watch
          </h1>
          <p className="text-lg mb-10 max-w-2xl" style={{ color: 'var(--on-surface-variant)' }}>
            Daily infographic: a real drug, whose patent, when it expires, and what happens to the market when it
            does — the kind of tracking a Portfolio Retainer does continuously, made public one drug at a time.
          </p>

          {items.length === 0 ? (
            <div className="pa-glass p-8 text-center">
              <p className="text-base" style={{ color: 'var(--on-surface-muted)' }}>
                Daily patent-expiry infographics start soon — check back shortly.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/patent-analytics/expirations/${slugify(item.title)}`}
                  className="pa-glass pa-glass-elevated overflow-hidden block hover:shadow-md transition-shadow"
                >
                  <div className="relative w-full aspect-square bg-black/[0.02]">
                    <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="pa-mono text-xs mb-1" style={{ color: 'var(--on-surface-muted)' }}>{formatDate(item.published_date)}</div>
                    <div className="font-semibold text-sm">{item.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
