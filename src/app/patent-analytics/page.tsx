import Link from 'next/link'
import StructureSlideshow from './StructureSlideshow'
import OpenLeadFormButton from './OpenLeadFormButton'
import { PatentNewsFeedSection } from './PatentNewsFeed'
import PatentAnalyticsHeader from './PatentAnalyticsHeader'
import { getLiveVolumeStats, getPilotAccuracyStats } from '@/lib/productResults'

// Re-renders in the background at most once an hour so the live volume stat
// below actually grows as 04_upload_to_website.py uploads more rows -- this
// page has no other dynamic data, so without this it would stay static at
// whatever it looked like at the last deploy.
export const revalidate = 3600

const services = [
  {
    name: 'Section 3(d) Compliance Screening',
    desc: 'India’s sharpest tool against evergreening: classifies whether a claimed compound is a salt, ester, isomer, or other "known substance" derivative, and flags whether real efficacy data is present — the exact test that struck down Novartis’s Glivec patent. Built to find the secondary patents worth challenging.',
    flagship: true,
    slug: 'section-3d',
  },
  {
    name: 'Genus/Species (Markush) Coverage & Design-Around Analysis',
    desc: "Does your target compound actually fall inside a competitor's broad genus claim — or is there a real, legally distinct gap your chemists can design around? Structural coverage testing built on real cheminformatics matching, not a keyword search.",
    slug: 'markush-coverage',
  },
  {
    name: 'Pre-Launch FTO Structural Triage',
    desc: 'Before committing R&D or manufacturing spend to a target compound or synthetic route, screen it against the real existing patent landscape — fast first-pass clearance, before a full manual search.',
    slug: 'fto-triage',
  },
  {
    name: 'Patent Cliff & Portfolio Landscape Mapping',
    desc: 'An entire patent family around one drug or target, consolidated into a single structure database — see which patents in the family are weak or already expiring, and time your launch window with real data.',
    slug: 'portfolio-landscape',
  },
  {
    name: 'Ongoing Patent Monitoring & Portfolio Intelligence',
    desc: 'Retainer-based alerts when new patents matching your compound classes are published, plus continuously-updated portfolio landscapes for BD, licensing, and corporate strategy teams.',
    slug: 'licensing', // placeholder to make the card clickable, see href override below
    href: '/licensing',
  },
  {
    name: 'CDMO Process FTO Pre-Screens',
    desc: 'Check a proposed synthetic route against existing process patents before committing manufacturing resources — one of the most commonly mishandled risks in CDMO/sponsor agreements.',
    slug: 'fto-triage', // same engine as Pre-Launch FTO Structural Triage, see its own tagline
    href: '/cdmo', // dedicated landing page for this buyer (CDMO business development,
    // not patent attorneys) instead of the generic /data/fto-triage listing
  },
]

export default async function PatentAnalyticsPage() {
  const [liveStats, pilotStats] = await Promise.all([getLiveVolumeStats(), getPilotAccuracyStats()])
  const stats = [
    { v: String(pilotStats.structuresTested), l: 'structures tested' },
    { v: String(pilotStats.realPatents), l: 'real patents' },
    { v: `${pilotStats.falsePositiveRatePercent}%`, l: 'false positives on auto-verified' },
    { v: `${pilotStats.autoVerifiedRatePercent}%`, l: 'auto-verified, zero errors measured' },
  ]
  return (
    <div className="min-h-screen w-full">
      <PatentAnalyticsHeader />

      {/* Hero — full-width bento split */}
      <section className="w-full px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center max-w-[1400px] mx-auto">
          <div className="lg:col-span-7">
            <div className="pa-chip mb-6">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--tertiary-bright)' }} />
              Chemistry-grade patent clearance, built for India
            </div>
            <h1 className="pa-display text-[40px] md:text-[56px] font-bold leading-[1.05] mb-6" style={{ color: 'var(--on-surface)' }}>
              Patent clearance for<br />India&rsquo;s generic &amp;<br />
              <span style={{ color: 'var(--primary)' }}>CDMO pharma industry</span>
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-xl" style={{ color: 'var(--on-surface-variant)' }}>
              Before committing R&amp;D or manufacturing spend, know whether a compound is
              actually covered by a genus claim, whether a secondary patent has a real
              Section 3(d) weakness, and where your freedom-to-operate actually stands —
              the same structural analysis that decided cases like <em>Natco v. Roche</em>{' '}
              and <em>Novartis v. Union of India</em>. Every report is honest about
              what&rsquo;s independently confirmed and what still needs your counsel&rsquo;s review.
            </p>
            <div className="flex flex-wrap gap-3">
              <OpenLeadFormButton className="pa-btn-primary text-base font-semibold px-6 py-3.5">
                Request a free sample report →
              </OpenLeadFormButton>
              <a href="#services" className="pa-btn-ghost text-base font-semibold px-6 py-3.5 inline-block">
                See all services
              </a>
            </div>
          </div>

          {/* Real extracted structures, auto-advancing */}
          <div className="lg:col-span-5 relative h-[380px] hidden lg:block">
            <StructureSlideshow />
            <div
              className="pa-glass absolute -bottom-4 -left-4 px-4 py-3"
              style={{ transform: 'perspective(1000px) rotateY(-6deg) rotateX(3deg) translateZ(20px)' }}
            >
              <div className="pa-mono text-xs" style={{ color: 'var(--on-surface-muted)' }}>LIVE EXTRACTION</div>
              <div className="text-base font-semibold" style={{ color: 'var(--tertiary)' }}>Real structures, real patents</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bento row */}
      <section id="proof" className="w-full px-6 md:px-12 pb-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="pa-mono text-sm uppercase mb-4" style={{ color: 'var(--on-surface-muted)' }}>Measured, not marketed</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.l} className="pa-glass p-5">
                <div className="pa-display text-4xl font-bold mb-1" style={{ color: 'var(--primary)' }}>{s.v}</div>
                <div className="text-base leading-snug" style={{ color: 'var(--on-surface-variant)' }}>{s.l}</div>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: 'var(--on-surface-muted)' }}>
            Pilot accuracy validation ({pilotStats.realPatents}-patent benchmark, checked against ground truth) — as of {pilotStats.lastUpdated}.
          </p>

          <div className="pa-mono text-sm uppercase mt-10 mb-4" style={{ color: 'var(--on-surface-muted)' }}>Growing daily</div>
          <div className="grid grid-cols-2 gap-4 max-w-xl">
            <div className="pa-glass p-5">
              <div className="pa-display text-4xl font-bold mb-1" style={{ color: 'var(--tertiary)' }}>{liveStats.uniquePatents}</div>
              <div className="text-base leading-snug" style={{ color: 'var(--on-surface-variant)' }}>real 2025 patents analyzed</div>
            </div>
            <div className="pa-glass p-5">
              <div className="pa-display text-4xl font-bold mb-1" style={{ color: 'var(--tertiary)' }}>{liveStats.totalResults}</div>
              <div className="text-base leading-snug" style={{ color: 'var(--on-surface-variant)' }}>results published</div>
            </div>
          </div>
          <p className="text-base mt-5 max-w-2xl leading-relaxed" style={{ color: 'var(--on-surface-muted)' }}>
            Every structure in a report is labeled either{' '}
            <b style={{ color: 'var(--tertiary)' }}>Verified</b> (passed automated
            chemical validation and was independently confirmed against a second,
            unrelated source) or <b style={{ color: 'var(--secondary)' }}>Needs review</b> —
            never presented as fact when it isn&rsquo;t one.
          </p>
        </div>
      </section>

      {/* Services bento grid */}
      <section id="services" className="w-full px-6 md:px-12 py-16" style={{ background: 'var(--surface-container-low)' }}>
        <div className="max-w-[1400px] mx-auto">
          <h2 className="pa-display text-3xl font-bold mb-2">Services</h2>
          <p className="text-base mb-10" style={{ color: 'var(--on-surface-muted)' }}>
            The structure-extraction report is our free sample. Everything below is
            what we can build out for your team.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => {
              const cardClass = `pa-glass p-6 block${s.slug ? ' hover:pa-glass-elevated transition-shadow cursor-pointer' : ''}`
              const cardStyle = s.flagship ? { borderTop: '2px solid var(--tertiary-bright)' } : undefined
              const content = (
                <>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-semibold text-base">{s.name}</h3>
                    {s.flagship && (
                      <span className="pa-chip" style={{ padding: '2px 10px', fontSize: '11px' }}>Flagship</span>
                    )}
                  </div>
                  <p className="text-base leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>{s.desc}</p>
                  {s.slug && (
                    <p className="text-sm mt-3 font-medium" style={{ color: 'var(--primary)' }}>
                      {'href' in s && s.href ? 'Learn more →' : 'See real extracted data →'}
                    </p>
                  )}
                </>
              )
              return s.slug ? (
                <Link key={s.name} href={'href' in s && s.href ? s.href : `/data/${s.slug}`} className={cardClass} style={cardStyle}>
                  {content}
                </Link>
              ) : (
                <div key={s.name} className={cardClass} style={cardStyle}>
                  {content}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Founder credibility */}
      <section id="about" className="w-full px-6 md:px-12 py-16">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-6">
          <div className="pa-glass p-8">
            <h2 className="pa-display text-xl font-bold mb-4">Who&rsquo;s behind this</h2>
            <p className="text-base leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>
              Built by <b style={{ color: 'var(--on-surface)' }}>Prashant Kotian</b>, a
              chemistry researcher pursuing a PhD in Chemistry at the Institute of
              Chemical Technology (ICT), Mumbai, with 9+ years teaching organic and
              analytical chemistry for IIT-JEE and NEET, and founder of TheChemSolver
              and Chem-Mantra — chemistry education platforms combined serving 300+
              interactive simulations and 22,000+ practice questions. This
              patent-analytics work applies the same structure-verification rigor
              built into those platforms&rsquo; chemistry engines to real patent documents.
            </p>
          </div>
          <div className="pa-glass p-8">
            <h2 className="pa-display text-xl font-bold mb-4">What we don&rsquo;t claim</h2>
            <p className="text-base leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>
              Our reports identify chemical structures and their relationships to
              claimed scope — they do not assert legal conclusions (infringement,
              validity, disclosure/enablement). That judgment stays with you and your
              counsel. Every report explicitly separates what was independently
              confirmed from what still needs your review.
            </p>
          </div>
        </div>
      </section>

      <PatentNewsFeedSection />

      {/* Contact */}
      <section id="contact" className="w-full px-6 md:px-12 py-16" style={{ background: 'var(--surface-container-low)' }}>
        <div className="max-w-[1400px] mx-auto pa-glass pa-glass-elevated p-8 md:p-10 grid md:grid-cols-[auto_1fr] gap-8 items-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 pa-display text-2xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
          >
            PK
          </div>
          <div>
            <h2 className="pa-display text-xl font-bold mb-1">Prashant Kotian</h2>
            <p className="text-sm mb-4" style={{ color: 'var(--on-surface-muted)' }}>
              PhD Researcher (Chemistry), Institute of Chemical Technology (ICT), Mumbai — Founder, Patent Analytics
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="mailto:support@thechemsolver.com" className="pa-chip hover:shadow-md transition-shadow">
                ✉ support@thechemsolver.com
              </a>
              <a href="tel:+919136255574" className="pa-chip hover:shadow-md transition-shadow">
                ☎ +91 91362 55574
              </a>
              <a
                href="https://wa.me/919136255574"
                target="_blank"
                rel="noopener noreferrer"
                className="pa-chip hover:shadow-md transition-shadow"
                style={{ background: 'rgba(37, 211, 102, 0.08)', borderColor: 'rgba(37, 211, 102, 0.2)', color: '#1a9e4a' }}
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full px-6 md:px-12 py-20">
        <div className="max-w-[1400px] mx-auto pa-glass pa-glass-elevated text-center py-16 px-6" style={{ background: 'linear-gradient(180deg, rgba(2,132,199,0.04), var(--surface-glass))' }}>
          <h2 className="pa-display text-2xl md:text-3xl font-bold mb-3">Request a free sample report</h2>
          <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: 'var(--on-surface-variant)' }}>
            Fill in your details and get instant access to a real structure-extraction
            report — no cost, no obligation.
          </p>
          <OpenLeadFormButton className="pa-btn-primary text-base font-semibold px-8 py-4">
            Get my free sample report →
          </OpenLeadFormButton>
        </div>
      </section>

      {/* Footer — own, no TheChemSolver branding */}
      <footer className="w-full px-6 md:px-12 py-8 border-t text-center" style={{ borderColor: 'var(--border-light)' }}>
        <p className="pa-mono text-sm" style={{ color: 'var(--on-surface-muted)' }}>
          patent-analytics.thechemsolver.com ·{' '}
          <a href="mailto:support@thechemsolver.com" className="hover:underline">support@thechemsolver.com</a>
          {' '}·{' '}
          <a href="tel:+919136255574" className="hover:underline">+91 91362 55574</a>
        </p>
      </footer>
    </div>
  )
}
