import Link from 'next/link'
import PatentAnalyticsHeader from './PatentAnalyticsHeader'

// Real bug found 2026-08-29: with no not-found.tsx in this segment, a
// notFound() thrown anywhere under /patent-analytics (e.g. an invalid
// product slug in /data/[product]/[patentNumber]) bubbled all the way up
// to the root app's default 404, which the root layout wraps in the
// EDUCATION site's nav+footer chrome (AP Chemistry / USNCO / IChO /
// TheChemSolver branding) -- a B2B visitor hitting a broken link saw the
// wrong product's branding baked right into the server-rendered HTML, not
// just a client-side flash. A segment-level not-found.tsx is caught before
// it ever reaches that fallback, so this doesn't depend on the
// pathname/hostname bypass logic in NavWrapper.tsx at all.
export default function PatentAnalyticsNotFound() {
  return (
    <>
      <PatentAnalyticsHeader />
      <main>
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <p className="pa-mono text-xs uppercase tracking-wide mb-4" style={{ color: 'var(--on-surface-muted)' }}>404</p>
          <h1 className="pa-display text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--on-surface)' }}>
            We couldn&rsquo;t find that page
          </h1>
          <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--on-surface-variant)' }}>
            The link you followed may be out of date, or the patent/result you&rsquo;re looking for isn&rsquo;t in
            our database yet.
          </p>
          <Link href="/patent-analytics" className="pa-btn-primary text-base font-semibold px-6 py-3.5 inline-block">
            Back to Patent Analytics →
          </Link>
        </div>
      </main>
    </>
  )
}
