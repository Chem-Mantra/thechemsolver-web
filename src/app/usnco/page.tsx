import { Metadata } from 'next'
import Link from 'next/link'
import EmailCaptureForm from '../components/EmailCaptureForm'

export const metadata: Metadata = {
  title: 'USNCO Prep — Free Tools & Practice',
  description: 'Free USNCO prep on TheChemSolver. Interactive simulators, practice MCQ sets, and coming-soon ebook for Local and National exam levels. No login required.',
  alternates: { canonical: 'https://www.thechemsolver.com/usnco' },
  openGraph: {
    title: 'USNCO Prep — Simulations, Ebook & Tests',
    description: 'Free US Chemistry Olympiad prep — simulations, practice tests, and interactive study materials.',
    url: 'https://www.thechemsolver.com/usnco',
    siteName: 'TheChemSolver',
    type: 'website',
  },
}

const EXAM_STAGES = [
  { stage: 'Local Exam', format: '60 MCQ · 110 min', icon: '🏫' },
  { stage: 'National Part I', format: '60 MCQ · 110 min', icon: '📝' },
  { stage: 'National Part II', format: 'Lab Practical · 90 min', icon: '🧪' },
  { stage: 'National Part III', format: '8 Free-Response · 90 min', icon: '✍️' },
]

const GATEWAY = [
  {
    icon: '🧪',
    title: 'Simulations',
    subtitle: 'Interactive Labs',
    desc: '30+ interactive simulators covering USNCO topics — equilibrium, kinetics, electrochemistry, coordination chemistry, stereochemistry, organic mechanisms, and more.',
    href: '/labs',
    color: '#f97316',
    gradient: 'from-orange-900/40 to-orange-950/30',
    border: 'border-orange-700/40',
    cta: 'Browse All Simulations →',
    badge: '30+ free tools',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    live: true,
  },
  {
    icon: '📖',
    title: 'Ebook',
    subtitle: 'Interactive Study Guide',
    desc: 'A comprehensive USNCO-level interactive ebook covering general, physical, organic, and analytical chemistry — with worked examples, flashcards, and practice problems.',
    href: '#',
    color: '#a855f7',
    gradient: 'from-purple-900/30 to-purple-950/20',
    border: 'border-purple-700/30',
    cta: 'Coming Soon',
    badge: 'In development',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    live: false,
  },
  {
    icon: '📝',
    title: 'Tests',
    subtitle: 'MCQ & FRQ Practice',
    desc: 'Full 60-question timed Local exam sets and National Part I/III past papers with answer explanations. Build exam-level speed and accuracy.',
    href: '/usnco/practice',
    color: '#f59e0b',
    gradient: 'from-amber-900/40 to-amber-950/30',
    border: 'border-amber-700/40',
    cta: 'Start Practice →',
    badge: 'Live — Local, National I/II/III',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    live: true,
  },
]

export default function USNCOPage() {
  return (
    <div className="bg-[#060610] text-white">

      {/* Hero */}
      <section className="px-5 pt-14 pb-10 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-400">American Chemical Society</span>
          <span className="text-white/20">·</span>
          <span className="text-xs text-gray-500">March (Local) · April (National)</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
          USNCO
          <span className="block text-xl md:text-2xl font-semibold text-gray-400 mt-1">
            US National Chemistry Olympiad
          </span>
        </h1>
        <p className="text-gray-400 max-w-xl mb-4 leading-relaxed text-sm">
          From local school exam to IChO selection camp. Prepare with free simulators, practice tests, and coming-soon study materials — all in one place.
        </p>

        <Link
          href="/usnco/strategy"
          className="inline-flex items-center gap-2 text-xs font-semibold text-orange-300 hover:text-orange-200 bg-orange-900/20 hover:bg-orange-900/30 border border-orange-700/30 rounded-full px-3.5 py-1.5 mb-6 transition-colors"
        >
          📊 See what USNCO actually tests — real past-paper data →
        </Link>

        {/* Exam stage chips */}
        <div className="flex flex-wrap gap-3 mb-2">
          {EXAM_STAGES.map(s => (
            <div key={s.stage} className="flex items-center gap-2 bg-orange-900/20 border border-orange-700/25 rounded-xl px-3 py-2">
              <span className="text-base">{s.icon}</span>
              <div>
                <div className="text-xs font-bold text-orange-300 leading-none">{s.stage}</div>
                <div className="text-[11px] text-gray-400 leading-none mt-0.5">{s.format}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3 Gateway Cards ─────────────────────────── */}
      <section className="px-5 pb-16 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-5">
          {GATEWAY.map(g => (
            <Link
              key={g.title}
              href={g.href}
              className={`group flex flex-col rounded-2xl border ${g.border} bg-gradient-to-br ${g.gradient} p-6 transition-all duration-200 ${g.live ? 'hover:brightness-110 hover:scale-[1.02] cursor-pointer' : 'opacity-70 pointer-events-none'}`}
            >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                    style={{ background: g.color + '22' }}
                  >
                    {g.icon}
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${g.badgeColor}`}>
                    {g.badge}
                  </span>
                </div>

                <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: g.color }}>
                  {g.subtitle}
                </p>
                <h2 className="text-xl font-bold text-white mb-2">{g.title}</h2>
                <p className="text-sm text-gray-400 leading-relaxed flex-1 mb-5">{g.desc}</p>

                <span
                  className={`text-sm font-semibold inline-block ${g.live ? 'group-hover:translate-x-1 transition-transform' : ''}`}
                  style={{ color: g.color }}
                >
                  {g.cta}
                </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Depth note */}
      <section className="px-5 pb-16 max-w-5xl mx-auto">
        <div className="rounded-2xl bg-orange-900/10 border border-orange-700/20 p-6">
          <h3 className="text-base font-bold text-white mb-2">USNCO goes deeper than AP Chemistry</h3>
          <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">
            Expect harder thermodynamics, coordination chemistry (crystal field theory), multi-step organic synthesis, and advanced stereochemistry on the National exam. Use the simulations to build the conceptual depth these topics demand — not just AP-level recall.
          </p>
        </div>
      </section>

      {/* Email capture */}
      <section className="px-5 pb-16 max-w-md mx-auto text-center">
        <h2 className="text-lg font-bold mb-2">Get USNCO Updates</h2>
        <p className="text-gray-400 text-sm mb-5">Occasional emails when we ship new simulators or study guides. No spam, unsubscribe anytime.</p>
        <EmailCaptureForm sourcePage="/usnco" />
      </section>

    </div>
  )
}
