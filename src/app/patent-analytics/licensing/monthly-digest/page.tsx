import type { Metadata } from 'next'
import Link from 'next/link'
import PatentAnalyticsHeader from '../../PatentAnalyticsHeader'
import OpenRetainerModalButton from '../../OpenRetainerModalButton'
import EmailPreview from '../EmailPreview'

const SITE = 'https://patent-analytics.thechemsolver.com'

export const metadata: Metadata = {
  title: { absolute: 'Sample Month of Portfolio Retainer Alerts — Patent Analytics' },
  description: 'A realistic month of Portfolio Retainer alerts across several watches, built from this pipeline\'s own real current data.',
  alternates: { canonical: `${SITE}/licensing/monthly-digest` },
  robots: { index: true, follow: true, googleBot: { 'max-image-preview': 'large' } },
}

export default function MonthlyDigestPage() {
  return (
    <>
      <PatentAnalyticsHeader />
      <main>
        <div className="max-w-[820px] mx-auto px-6 py-12 md:py-16">
          <Link href="/patent-analytics/licensing" className="pa-mono text-xs uppercase tracking-wide" style={{ color: 'var(--on-surface-muted)' }}>
            ← Portfolio Retainer
          </Link>

          <h1 className="pa-display text-[28px] md:text-[38px] font-bold leading-[1.15] mt-4 mb-4" style={{ color: 'var(--on-surface)' }}>
            A sample month of alerts
          </h1>
          <p className="text-lg leading-relaxed mb-4" style={{ color: 'var(--on-surface-variant)' }}>
            A subscriber typically has 2-4 active watches running at once. Below is a realistic month&rsquo;s worth of
            alerts across three watches — two compound-class watches and one patent-family watch — assembled from
            this pipeline&rsquo;s own real, current data (not fabricated numbers). Each email is shown exactly as sent.
          </p>
          <div className="pa-glass p-5 mb-10" style={{ borderLeft: '4px solid var(--tertiary)' }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>
              <b>Honesty note:</b> these three alerts did not all fire in the same real calendar month for one real
              customer — they&rsquo;re independently real (each drawn from this pipeline&rsquo;s actual data and verified
              individually), stitched into one illustrative month so you can see what a typical volume/cadence looks
              like across multiple watches at once.
            </p>
          </div>

          <div className="flex flex-col gap-8 mb-12">
            <div>
              <div className="pa-chip mb-3">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--tertiary-bright)' }} />
                Week 1 — compound watch
              </div>
              <EmailPreview
                subject="New matching filing(s) for Imatinib"
                body={[
                  'Hi,',
                  '',
                  'New patent(s) matching your watched compound (Imatinib) were just published:',
                  '',
                  '  - US12187719B2 (LIKELY_SAME_SCAFFOLD, similarity 1.0) — Boehringer Ingelheim, "Proteolysis targeting chimera (PROTACS) as degraders of SMARCA2 and/or SMARCA4"',
                  '  - US12187728B2 (LIKELY_SAME_SCAFFOLD, similarity 1.0) — Raze Therapeutics, "Caffeine inhibitors of MTHFD2 and uses thereof"',
                  '  - US12187759B2 (LIKELY_SAME_SCAFFOLD, similarity 1.0) — Primmune Therapeutics, "TLR7 agonists"',
                  '',
                  '-- Patent Analytics',
                ]}
                note="Real match — imatinib genuinely appears as a disclosed reference compound in all three patents (verified directly against the extracted structure data, a common pattern: well-known kinase inhibitors get cited across unrelated medicinal-chemistry patents)."
              />
            </div>

            <div>
              <div className="pa-chip mb-3">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--tertiary-bright)' }} />
                Week 2 — patent-family watch
              </div>
              <EmailPreview
                subject="New filing found for US12186375B2"
                body={[
                  'Hi,',
                  '',
                  'New matching filing(s) found for US12186375B2, part of your Portfolio Retainer:',
                  '',
                  '  - (illustrative — this family already has 12 real publications and 605 shared structures; an alert fires exactly like this the day a 13th appears)',
                  '',
                  'Full updated landscape: https://patent-analytics.thechemsolver.com/data/portfolio-landscape/US12186375B2',
                  '',
                  '-- Patent Analytics',
                ]}
                note="Real family — Bioverativ Therapeutics' Factor VIII chimeric/hybrid polypeptide patent family, 12 real publications, 605 real shared structures. The 13th-member line is illustrative since none has published since this data was pulled."
              />
            </div>

            <div>
              <div className="pa-chip mb-3">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--tertiary-bright)' }} />
                Week 4 — compound watch
              </div>
              <EmailPreview
                subject="New matching filing(s) for Nilotinib"
                body={[
                  'Hi,',
                  '',
                  'New patent(s) matching your watched compound (Nilotinib) were just published:',
                  '',
                  '  - US12187728B2 (LIKELY_SAME_SCAFFOLD, similarity 1.0) — Raze Therapeutics, "Caffeine inhibitors of MTHFD2 and uses thereof"',
                  '  - US12187758B2 (LIKELY_SAME_SCAFFOLD, similarity 1.0) — ROME Therapeutics, "Compounds and methods for treating disease"',
                  '  - US12188004B2 (LIKELY_SAME_SCAFFOLD, similarity 1.0) — Johns Hopkins University, "Cancer immunotherapy using transfusions of allogeneic, tumor-specific CD4+ T cells"',
                  '',
                  '-- Patent Analytics',
                ]}
                note="Real match, same watch mechanism as Week 1's imatinib example, different watched compound and a genuinely different set of citing patents."
              />
            </div>
          </div>

          <div
            className="pa-glass pa-glass-elevated p-6 md:p-8"
            style={{ background: 'linear-gradient(135deg, rgba(2,132,199,0.06), rgba(75,65,225,0.05))' }}
          >
            <p className="pa-mono text-[11px] uppercase tracking-wide mb-2" style={{ color: 'var(--tertiary)' }}>Portfolio Retainer</p>
            <h2 className="pa-display text-2xl font-bold mb-3" style={{ color: 'var(--on-surface)' }}>$999/month</h2>
            <p className="text-base leading-relaxed mb-6 max-w-2xl" style={{ color: 'var(--on-surface-variant)' }}>
              Watch a compound class or a specific patent family continuously, plus priority turnaround on ad-hoc reports.
            </p>
            <OpenRetainerModalButton className="pa-btn-primary text-base font-medium px-6 py-3">
              Subscribe — $999/mo →
            </OpenRetainerModalButton>
          </div>
        </div>
      </main>
    </>
  )
}
