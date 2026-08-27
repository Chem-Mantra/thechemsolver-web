import Link from 'next/link'
import { LatestNewsTeaser } from './PatentNewsFeed'
import OpenLeadFormButton from './OpenLeadFormButton'

// Shared across the landing page and every article page so branding is
// identical everywhere in this segment, rather than re-typed per page and
// drifting out of sync.
export default function PatentAnalyticsHeader() {
  return (
    <header className="sticky top-0 z-50 w-full pa-glass" style={{ borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
      <div className="w-full px-6 md:px-12 py-5 flex items-center justify-between flex-wrap gap-4">
        <Link href="/patent-analytics" className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-lg flex items-center justify-center pa-scaffold-node shrink-0"
            style={{ background: `linear-gradient(135deg, var(--primary), var(--secondary))` }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="6" cy="6" r="2.5" fill="white" />
              <circle cx="18" cy="6" r="2.5" fill="white" />
              <circle cx="12" cy="16" r="2.5" fill="white" />
              <path d="M8 7.5L10.5 14.5M16 7.5L13.5 14.5M8.5 6H15.5" stroke="white" strokeWidth="1.2" />
            </svg>
          </div>
          <span className="pa-display text-[28px] md:text-[64px] font-bold leading-none">patent-analytics.thechemsolver.com</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <a href="/patent-analytics#services" className="text-base px-3 py-2 rounded-lg hover:bg-black/[0.03] transition-colors" style={{ color: 'var(--on-surface-variant)' }}>Services</a>
          <Link href="/patent-analytics/pricing" className="text-base px-3 py-2 rounded-lg hover:bg-black/[0.03] transition-colors" style={{ color: 'var(--on-surface-variant)' }}>Pricing</Link>
          <a href="/patent-analytics#proof" className="text-base px-3 py-2 rounded-lg hover:bg-black/[0.03] transition-colors" style={{ color: 'var(--on-surface-variant)' }}>Measured Accuracy</a>
          <a href="/patent-analytics#patent-news" className="text-base px-3 py-2 rounded-lg hover:bg-black/[0.03] transition-colors" style={{ color: 'var(--on-surface-variant)' }}>Patent News</a>
          <a href="/patent-analytics#contact" className="text-base px-3 py-2 rounded-lg hover:bg-black/[0.03] transition-colors" style={{ color: 'var(--on-surface-variant)' }}>Contact</a>
        </nav>
        <div className="flex items-center gap-3">
          <LatestNewsTeaser />
          <OpenLeadFormButton className="pa-btn-primary text-base font-medium px-5 py-2.5">
            Free sample →
          </OpenLeadFormButton>
        </div>
      </div>
    </header>
  )
}
