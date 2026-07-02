import { Metadata } from 'next'
import Link from 'next/link'
import EmailCaptureForm from '../components/EmailCaptureForm'

export const metadata: Metadata = {
  title: 'IChO Prep — Free International Chemistry Olympiad Tools',
  description: 'Free IChO prep on TheChemSolver. Advanced simulators for theoretical and practical exam topics — coordination chemistry, thermodynamics, organic synthesis, spectroscopy, and more.',
  alternates: { canonical: 'https://www.thechemsolver.com/icho' },
  openGraph: {
    title: 'IChO Prep — Simulations, Problems & Study Tools',
    description: 'Free International Chemistry Olympiad prep — advanced simulators, preparatory problems, and interactive study materials.',
    url: 'https://www.thechemsolver.com/icho',
    siteName: 'TheChemSolver',
    type: 'website',
  },
}

const EXAM_FORMAT = [
  { label: 'Theoretical', detail: '5–6 problems · ~5 hours', icon: '📐' },
  { label: 'Practical', detail: '3–4 lab tasks · ~5 hours', icon: '🧪' },
  { label: 'Prep Problems', detail: '~30 advance problems', icon: '📚' },
  { label: 'Selection', detail: '4 students/country · via USNCO', icon: '🌍' },
]

const GATEWAY = [
  {
    icon: '🧪',
    title: 'Simulations',
    subtitle: 'Advanced Interactive Labs',
    desc: '30+ simulators covering IChO-level topics — crystal field theory, coordination chemistry, thermodynamics, electrochemistry, stereochemistry, organic mechanisms, quantum chemistry, and more.',
    href: '/labs',
    color: '#eab308',
    gradient: 'from-yellow-900/40 to-yellow-950/30',
    border: 'border-yellow-700/40',
    cta: 'Browse All Simulations →',
    badge: '30+ free tools',
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    live: true,
  },
  {
    icon: '📖',
    title: 'Ebook',
    subtitle: 'Interactive Study Guide',
    desc: 'An IChO-level interactive ebook covering all theory domains — physical, inorganic, organic, and analytical chemistry at undergraduate depth, with worked examples and practice.',
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
    title: 'Problems',
    subtitle: 'Prep Problems & Past Papers',
    desc: 'Official IChO preparatory problems (2001–2025) with model solutions, marking schemes, and topic-filtered browsing. Build the problem-solving depth IChO demands.',
    href: '/icho/problems',
    color: '#f97316',
    gradient: 'from-orange-900/40 to-orange-950/30',
    border: 'border-orange-700/40',
    cta: 'View Prep Problems →',
    badge: 'Available now',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    live: true,
  },
]

export default function IChOPage() {
  return (
    <div className="bg-[#060610] text-white">

      {/* Hero */}
      <section className="px-5 pt-14 pb-10 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">IUPAC · Global</span>
          <span className="text-white/20">·</span>
          <span className="text-xs text-gray-500">July each year · rotating host nation</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
          IChO
          <span className="block text-xl md:text-2xl font-semibold text-gray-400 mt-1">
            International Chemistry Olympiad
          </span>
        </h1>
        <p className="text-gray-400 max-w-xl mb-4 leading-relaxed text-sm">
          The world's most demanding chemistry competition. IChO spans all branches at undergraduate depth — physical, inorganic, organic, analytical — in a 5-hour theoretical exam. Prepare with free advanced simulators and official prep problems.
        </p>

        <Link
          href="/icho/strategy"
          className="inline-flex items-center gap-2 text-xs font-semibold text-yellow-300 hover:text-yellow-200 bg-yellow-900/20 hover:bg-yellow-900/30 border border-yellow-700/30 rounded-full px-3.5 py-1.5 mb-6 transition-colors"
        >
          📊 See what IChO actually tests — real past-paper data →
        </Link>

        {/* Exam format chips */}
        <div className="flex flex-wrap gap-3 mb-2">
          {EXAM_FORMAT.map(f => (
            <div key={f.label} className="flex items-center gap-2 bg-yellow-900/20 border border-yellow-700/25 rounded-xl px-3 py-2">
              <span className="text-base">{f.icon}</span>
              <div>
                <div className="text-xs font-bold text-yellow-300 leading-none">{f.label}</div>
                <div className="text-[11px] text-gray-400 leading-none mt-0.5">{f.detail}</div>
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
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: '🔬', title: 'No Curriculum Boundary', desc: 'IChO problems routinely require first-year university chemistry — thermodynamic cycles, crystal field theory, advanced spectroscopy, and organometallic reactions.' },
            { icon: '🧮', title: 'Heavy Calculation Load', desc: 'Expect multi-step quantitative problems: equilibrium constants, electrochemical potentials, partition functions, and Born-Haber cycles within a single question.' },
            { icon: '⚗️', title: 'Practical Lab Skills', desc: 'The practical exam tests synthesis, titration, spectroscopic analysis, and kinetic measurements under strict time constraints with real reagents.' },
          ].map(c => (
            <div key={c.title} className="bg-yellow-900/10 border border-yellow-700/20 rounded-2xl p-5">
              <div className="text-2xl mb-3">{c.icon}</div>
              <div className="font-semibold text-sm mb-2">{c.title}</div>
              <div className="text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Email capture */}
      <section className="px-5 pb-16 max-w-md mx-auto text-center">
        <h2 className="text-lg font-bold mb-2">Get IChO Updates</h2>
        <p className="text-gray-400 text-sm mb-5">Occasional emails when we ship new simulators or study guides. No spam, unsubscribe anytime.</p>
        <EmailCaptureForm sourcePage="/icho" />
      </section>

    </div>
  )
}
