import type { Metadata } from 'next'
import Link from 'next/link'
import PatentAnalyticsHeader from '../PatentAnalyticsHeader'
import OpenLeadFormButton from '../OpenLeadFormButton'
import EmailPreview from './EmailPreview'

const SITE = 'https://patent-analytics.thechemsolver.com'

export const metadata: Metadata = {
  title: { absolute: 'Patent Portfolio Intelligence for BD & Licensing Teams — Patent Analytics' },
  description: 'Know a target\'s whole patent family before you sign a deal — real structure-level portfolio landscape and patent-cliff timing, updated continuously, not a one-time snapshot.',
  alternates: { canonical: `${SITE}/licensing` },
  robots: { index: true, follow: true, googleBot: { 'max-image-preview': 'large' } },
}

const USE_CASES = [
  {
    title: 'Before an in-licensing deal',
    desc: 'See a target compound\'s entire patent family consolidated into one structure database — not just the headline patent you were shown.',
  },
  {
    title: 'Before an M&A diligence call',
    desc: 'Know which patents in a target\'s portfolio are structurally weak or already approaching expiry, before you\'re negotiating price.',
  },
  {
    title: 'Ongoing, not one-time',
    desc: 'A retainer means new filings in a compound class get flagged as they publish — you\'re not re-running diligence from scratch every quarter.',
  },
]

export default function LicensingPage() {
  return (
    <>
      <PatentAnalyticsHeader />
      <main>
        <div className="max-w-[1200px] mx-auto px-6 py-16 md:py-20">
          <div className="max-w-3xl mb-16">
            <div className="pa-chip mb-6">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--tertiary-bright)' }} />
              Built for BD, licensing, and corporate strategy teams
            </div>
            <h1 className="pa-display text-[36px] md:text-[52px] font-bold leading-[1.08] mb-6" style={{ color: 'var(--on-surface)' }}>
              Know their whole portfolio,<br />not just the patent they showed you
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-2xl" style={{ color: 'var(--on-surface-variant)' }}>
              An in-licensing pitch or an M&amp;A target usually leads with one strong
              patent. We consolidate an entire patent family around a drug or target
              into a single real structure database, so you can see which claims are
              actually strong, which are weak or expiring, and time a deal or a
              generic launch window with real data instead of a sales deck.
            </p>
            <div className="flex flex-wrap gap-3">
              <OpenLeadFormButton className="pa-btn-primary text-base font-semibold px-6 py-3.5">
                Request a free sample landscape →
              </OpenLeadFormButton>
              <Link href="/patent-analytics/pricing" className="pa-btn-ghost text-base font-semibold px-6 py-3.5 inline-block">
                See the retainer pricing
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {USE_CASES.map((u) => (
              <div key={u.title} className="pa-glass p-6">
                <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--on-surface)' }}>{u.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>{u.desc}</p>
              </div>
            ))}
          </div>

          <div className="pa-glass pa-glass-elevated p-8 md:p-10 mb-16">
            <p className="pa-mono text-[11px] uppercase tracking-wide mb-2" style={{ color: 'var(--tertiary)' }}>How it works</p>
            <h2 className="pa-display text-2xl font-bold mb-4" style={{ color: 'var(--on-surface)' }}>
              Real family data, not a sales deck
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--on-surface-variant)' }}>
              Every other publication in the same patent family (Google&rsquo;s own DOCDB
              family data, not inferred), each one&rsquo;s own chemical structures
              consolidated by canonical structure across the whole family, and which
              specific family members share which compounds. The Portfolio Retainer
              tier keeps this current — new matching filings flagged as they publish,
              not a snapshot that goes stale the week after you read it.
            </p>
            <Link href="/patent-analytics/data/portfolio-landscape" className="text-sm font-medium" style={{ color: 'var(--primary)' }}>
              See real, live portfolio landscape results →
            </Link>
          </div>

          {/* Sample alerts -- this service is fundamentally different from
              the other 4 products: it doesn't produce a report, it emails
              you only when something NEW shows up. There's no "result page"
              to link to for proof, so the honest sample IS the alert email
              itself. Both examples below use real data from this pipeline's
              own current corpus (not fabricated) -- verified before use:
              imatinib genuinely appears as a disclosed reference compound
              in each listed patent (confirmed directly against the real
              extracted structure data, not assumed from a coincidental
              similarity score). */}
          <div className="mb-16">
            <p className="pa-mono text-[11px] uppercase tracking-wide mb-2" style={{ color: 'var(--tertiary)' }}>Sample alerts</p>
            <h2 className="pa-display text-2xl font-bold mb-4" style={{ color: 'var(--on-surface)' }}>
              What you actually receive
            </h2>
            <p className="text-base leading-relaxed mb-8 max-w-2xl" style={{ color: 'var(--on-surface-variant)' }}>
              This isn&rsquo;t a report you download once — it&rsquo;s an inbox notification the moment something new
              publishes. Two real examples, generated from this pipeline&rsquo;s own real data, in the exact format we send.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
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
                note="Compound-class watch — screens every newly-processed patent against your watched structure (RDKit Morgan/ECFP4 Tanimoto, the same engine FTO Triage uses). Imatinib genuinely appears as a cited reference compound in all three — verified against the real extracted structure data before this example was written, not assumed from the score alone."
              />
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
                note="Patent-family watch — re-runs the real family/structure consolidation and diffs against what was there last time you were checked. Family and structure counts above are real (Bioverativ Therapeutics' Factor VIII patent family); the 13th-member line is illustrative since none has actually published since we pulled this data."
              />
            </div>

            <p className="text-sm max-w-2xl" style={{ color: 'var(--on-surface-variant)' }}>
              A subscriber typically watches several compound classes or families at once — see a{' '}
              <Link href="/patent-analytics/licensing/monthly-digest" className="font-medium" style={{ color: 'var(--primary)' }}>
                sample month of combined alerts →
              </Link>
            </p>
          </div>

          <div className="pa-glass p-8 max-w-2xl mx-auto text-center">
            <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              Every report includes an explicit &ldquo;what we claim / what we don&apos;t claim&rdquo;
              section — family membership and structural data are real, sourced facts;
              legal conclusions (validity, freedom to operate) stay with you and your counsel.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
