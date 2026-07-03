import { Metadata } from 'next'
import Link from 'next/link'
import EmailCaptureForm from '../components/EmailCaptureForm'
import TopicBarChart from '../components/TopicBarChart'
import { AP_OFFICIAL_MCQ, AP_OFFICIAL_FRQ } from '@/data/examTopicFrequency'

const AP_BLUE = '#3b82f6'

export const metadata: Metadata = {
  title: 'AP Chemistry — Free Prep Hub, Real Exam Data & Tools',
  description: 'Free AP Chemistry prep on TheChemSolver. Real topic-frequency data from 361 official exam questions, interactive ebook for Units 1–9, 30+ simulators mapped to AP units, and MCQ/FRQ practice sets. No login required.',
  alternates: { canonical: 'https://www.thechemsolver.com/ap-chemistry' },
  openGraph: {
    title: 'AP Chemistry Prep — Simulations, Ebook & Tests',
    description: 'Everything you need for AP Chemistry in one place. Free interactive ebook, 30+ simulators, and practice tests.',
    url: 'https://www.thechemsolver.com/ap-chemistry',
    siteName: 'TheChemSolver',
    type: 'website',
  },
}

const EXAM_FORMAT = [
  { section: 'MCQ', detail: '60 questions · 90 min · 50%', icon: '📝' },
  { section: 'FRQ', detail: '7 questions · 105 min · 50%', icon: '✍️' },
  { section: 'Calculator', detail: 'Allowed throughout', icon: '🔢' },
  { section: 'Exam Date', detail: 'First Monday of May', icon: '📅' },
]

const GATEWAY = [
  {
    icon: '🧪',
    title: 'Simulations',
    subtitle: 'Interactive Labs',
    desc: '30+ interactive simulators mapped to AP Chemistry Units 1–9. Titration, equilibrium, kinetics, electrochemistry, VSEPR, quantum orbitals, and more.',
    href: '/labs',
    color: '#3b82f6',
    gradient: 'from-blue-900/40 to-blue-950/30',
    border: 'border-blue-700/40',
    cta: 'Browse All Simulations →',
    badge: '30+ free tools',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  {
    icon: '📖',
    title: 'Ebook',
    subtitle: 'Interactive Study Guide',
    desc: 'Full AP Chemistry interactive ebook — all 9 units with concept explanations, KaTeX formulas, practice MCQs, flashcard decks, and simulation embeds.',
    href: '/ebook/ap-chemistry',
    color: '#a855f7',
    gradient: 'from-purple-900/40 to-purple-950/30',
    border: 'border-purple-700/40',
    cta: 'Open Ebook →',
    badge: 'All 9 units',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  },
  {
    icon: '📝',
    title: 'Tests',
    subtitle: 'MCQ & FRQ Practice',
    desc: 'Timed MCQ practice sets and FRQ past papers aligned to the AP Chemistry exam format. Build exam stamina and identify weak units before test day.',
    href: '/ap-chemistry/practice',
    color: '#10b981',
    gradient: 'from-emerald-900/40 to-emerald-950/30',
    border: 'border-emerald-700/40',
    cta: 'Start Practice →',
    badge: 'Coming soon',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
]

const AP_UNITS = [
  { n: '1', name: 'Atomic Structure & Properties', weight: '7–9%' },
  { n: '2', name: 'Compound Structure & Properties', weight: '7–9%' },
  { n: '3', name: 'Properties of Substances & Mixtures', weight: '18–22%' },
  { n: '4', name: 'Chemical Reactions', weight: '7–9%' },
  { n: '5', name: 'Kinetics', weight: '7–9%' },
  { n: '6', name: 'Thermochemistry', weight: '7–9%' },
  { n: '7', name: 'Equilibrium', weight: '7–9%' },
  { n: '8', name: 'Acids & Bases', weight: '11–15%' },
  { n: '9', name: 'Thermodynamics & Electrochemistry', weight: '7–9%' },
]

export default function APChemistryPage() {
  return (
    <div className="bg-[#060610] text-white">

      {/* Hero */}
      <section className="px-5 pt-14 pb-10 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">College Board · AP Program</span>
          <span className="text-white/20">·</span>
          <span className="text-xs text-gray-500">Exam in May</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
          AP Chemistry
        </h1>
        <p className="text-gray-400 max-w-xl mb-8 leading-relaxed text-sm">
          Everything you need in one place — an interactive ebook for all 9 units, 30+ simulators, and exam-style practice. All free, no login required.
        </p>

        {/* Exam format chips */}
        <div className="flex flex-wrap gap-3 mb-2">
          {EXAM_FORMAT.map(f => (
            <div key={f.section} className="flex items-center gap-2 bg-blue-900/20 border border-blue-700/25 rounded-xl px-3 py-2">
              <span className="text-base">{f.icon}</span>
              <div>
                <div className="text-xs font-bold text-blue-300 leading-none">{f.section}</div>
                <div className="text-[11px] text-gray-400 leading-none mt-0.5">{f.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── What AP Chemistry Actually Tests (real past-paper data) ─────── */}
      <section className="px-5 pb-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">📊 Data-Driven Strategy</span>
          <span className="text-white/20">·</span>
          <span className="text-xs text-gray-500">361 official exam questions analyzed</span>
        </div>
        <div className="rounded-2xl bg-blue-900/10 border border-blue-700/20 p-5 mb-5">
          <h2 className="text-sm font-bold text-blue-300 mb-2">The single biggest finding</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            College Board's official unit weighting lists Unit 3 (Properties of Substances &
            Mixtures) as the single largest chunk of the exam — but tagging real past MCQs shows{' '}
            <strong className="text-white">Bonding (15.1%)</strong> is actually the most-tested
            single topic, and <strong className="text-white">Acids and Bases</strong> and{' '}
            <strong className="text-white">Equilibrium</strong> tie at 13.2% each. On the
            free-response side, <strong className="text-white">Thermodynamics (25%)</strong> and{' '}
            <strong className="text-white">Equilibrium (22.2%)</strong> alone account for nearly
            half of all FRQ points — the highest-yield topics to master for writing full-credit answers.
          </p>
        </div>
        <div className="space-y-5">
          <TopicBarChart title="AP Official MCQ" subtitle="Section I · 2012, 2014-2019 official/practice exams" data={AP_OFFICIAL_MCQ} accentHex={AP_BLUE} />
          <TopicBarChart title="AP Official FRQ" subtitle="Section II · free-response questions, same exams" data={AP_OFFICIAL_FRQ} accentHex={AP_BLUE} />
        </div>
        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
          2013's official exam is excluded — our extraction of that particular PDF is still
          incomplete and will be added once resolved.
        </p>
      </section>

      {/* ── 3 Gateway Cards ─────────────────────────── */}
      <section className="px-5 pb-16 max-w-5xl mx-auto">
        <h2 className="text-lg font-bold mb-5">Ready to prepare?</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {GATEWAY.map(g => (
            <Link
              key={g.title}
              href={g.href}
              className={`group flex flex-col rounded-2xl border ${g.border} bg-gradient-to-br ${g.gradient} p-6 transition-all duration-200 hover:brightness-110 hover:scale-[1.02]`}
            >
              {/* Icon + badge */}
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

              {/* Title */}
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: g.color }}>
                {g.subtitle}
              </p>
              <h2 className="text-xl font-bold text-white mb-2">{g.title}</h2>

              {/* Description */}
              <p className="text-sm text-gray-400 leading-relaxed flex-1 mb-5">{g.desc}</p>

              {/* CTA */}
              <span
                className="text-sm font-semibold group-hover:translate-x-1 transition-transform inline-block"
                style={{ color: g.color }}
              >
                {g.cta}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Unit overview strip */}
      <section className="px-5 pb-16 max-w-5xl mx-auto">
        <h2 className="text-lg font-bold mb-4 text-gray-300">Units Covered in Ebook & Simulations</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {AP_UNITS.map(u => (
            <div
              key={u.n}
              className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/10 px-4 py-2.5"
            >
              <span className="text-xs font-bold text-blue-400 shrink-0 w-10">U{u.n}</span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-white truncate">{u.name}</p>
                <p className="text-[10px] text-gray-500">{u.weight} of exam</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Email capture */}
      <section className="px-5 pb-16 max-w-md mx-auto text-center">
        <h2 className="text-lg font-bold mb-2">Get AP Chem Updates</h2>
        <p className="text-gray-400 text-sm mb-5">Occasional emails when we ship new simulators or study guides. No spam, unsubscribe anytime.</p>
        <EmailCaptureForm sourcePage="/ap-chemistry" />
      </section>

    </div>
  )
}
