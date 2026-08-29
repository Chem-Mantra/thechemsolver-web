import type { Metadata } from 'next'
import PatentAnalyticsHeader from '../PatentAnalyticsHeader'
import OpenLeadFormButton from '../OpenLeadFormButton'
import OpenCheckPatentButton from '../OpenCheckPatentButton'
import OpenRetainerModalButton from '../OpenRetainerModalButton'
import OpenStandardReportButton from '../OpenStandardReportButton'

const SITE = 'https://patent-analytics.thechemsolver.com'

export const metadata: Metadata = {
  title: { absolute: 'Pricing — Patent Analytics' },
  description: 'Instant compound checks, standard reports, and portfolio retainers for India\'s generic pharma companies, CDMOs, and the patent attorneys serving them. First report free.',
  alternates: { canonical: `${SITE}/pricing` },
  robots: { index: true, follow: true, googleBot: { 'max-image-preview': 'large' } },
}

const TIERS = [
  {
    name: 'Instant Compound Check',
    price: '$10',
    per: 'per check',
    description: 'Look up a specific patent, or search your own compound for structurally similar matches and the patents they\'re linked to — fully automated, delivered live. No human review in the loop, so it\'s priced like software.',
    features: [
      'Patent lookup or compound structural search, your choice',
      'Cross-patent scaffold matches, tiered by similarity',
      'Delivered live — under a minute, no waiting',
      'Downloadable data (JSON)',
    ],
    cta: 'Check a patent or compound →',
    ctaType: 'check' as const,
    flagship: false,
  },
  {
    name: 'Standard Report',
    price: '$199',
    per: 'per report',
    description: 'A full structure-extraction or coverage report on a specific patent. Anything flagged for review gets our own real chemist sign-off before you see it — this is where our actual time goes, priced accordingly.',
    features: [
      'Full genus/species, Section 3(d), or FTO triage report',
      'Needs-review items get human sign-off, not just a flag',
      '24-48h turnaround',
      'Full HD structure images + data + sources, packaged',
    ],
    cta: 'Order a report — $199 →',
    ctaType: 'standard_report' as const,
    flagship: true,
  },
  {
    name: 'Portfolio Retainer',
    price: '$999',
    per: 'per month',
    description: 'Ongoing monitoring across a portfolio or compound class — new matching patents flagged as they publish, plus priority turnaround on ad-hoc reports. For teams tracking a space continuously, not one-off.',
    features: [
      'Recurring alerts on new matching patents',
      'Priority turnaround on Standard Reports',
      'Direct line to review findings together',
      'Cancel anytime',
    ],
    cta: 'Subscribe — $999/mo →',
    ctaType: 'retainer' as const,
    flagship: false,
  },
]

export default function PricingPage() {
  return (
    <>
      <PatentAnalyticsHeader />
      <main>
        <div className="max-w-[1200px] mx-auto px-6 py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="pa-chip mb-6 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--tertiary-bright)' }} />
              Priced like software, not a law firm
            </div>
            <h1 className="pa-display text-[36px] md:text-[48px] font-bold leading-[1.1] mb-4" style={{ color: 'var(--on-surface)' }}>
              Pricing
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>
              Manual chemist/associate triage on a single patent typically runs $300–800+ in billable time.
              Our automation carries near-zero marginal cost, so we pass that through — your first report is free.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {TIERS.map((t) => (
              <div
                key={t.name}
                className="pa-glass pa-glass-elevated p-8 flex flex-col"
                style={t.flagship ? { borderTop: '3px solid var(--primary)' } : undefined}
              >
                {t.flagship && (
                  <div className="pa-mono text-[10px] uppercase tracking-wide mb-3" style={{ color: 'var(--primary)' }}>
                    Most popular
                  </div>
                )}
                <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--on-surface)' }}>{t.name}</h2>
                <div className="flex items-baseline gap-1.5 mb-4">
                  <span className="pa-display text-4xl font-bold" style={{ color: 'var(--on-surface)' }}>{t.price}</span>
                  <span className="text-sm" style={{ color: 'var(--on-surface-muted)' }}>{t.per}</span>
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--on-surface-variant)' }}>{t.description}</p>
                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {t.features.map((f) => (
                    <li key={f} className="text-sm flex items-start gap-2" style={{ color: 'var(--on-surface-variant)' }}>
                      <span style={{ color: 'var(--tertiary-bright)' }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                {t.ctaType === 'check' ? (
                  <OpenCheckPatentButton className={t.flagship ? 'pa-btn-primary text-sm font-medium px-5 py-3 w-full' : 'pa-chip text-sm font-medium px-5 py-3 w-full justify-center'}>
                    {t.cta}
                  </OpenCheckPatentButton>
                ) : t.ctaType === 'retainer' ? (
                  <OpenRetainerModalButton className={t.flagship ? 'pa-btn-primary text-sm font-medium px-5 py-3 w-full' : 'pa-chip text-sm font-medium px-5 py-3 w-full justify-center'}>
                    {t.cta}
                  </OpenRetainerModalButton>
                ) : (
                  <div className="flex flex-col gap-2 items-center">
                    <OpenStandardReportButton className="pa-btn-primary text-sm font-medium px-5 py-3 w-full">
                      {t.cta}
                    </OpenStandardReportButton>
                    <OpenLeadFormButton className="text-xs font-medium hover:underline text-[color:var(--primary)]">
                      or see a free sample first →
                    </OpenLeadFormButton>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pa-glass p-8 max-w-2xl mx-auto text-center">
            <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              Every report includes an explicit &ldquo;what we claim / what we don&apos;t claim&rdquo; section — we identify
              chemical structures and their relationship to claimed scope, not legal conclusions like infringement or validity.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
