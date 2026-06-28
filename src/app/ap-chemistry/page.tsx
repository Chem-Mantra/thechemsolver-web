import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AP Chemistry Prep — Free Tools, Labs & Practice | TheChemSolver',
  description: 'Free AP Chemistry tools aligned to College Board Units 1–9. Interactive simulators for titration, equilibrium, kinetics, thermodynamics, electrochemistry, quantum mechanics, and more. Prep for the AP Chem MCQ and FRQ sections.',
  keywords: 'AP Chemistry prep free, AP chem tools, AP chemistry simulator, AP chem practice MCQ FRQ, college board AP chemistry units',
  alternates: { canonical: 'https://www.thechemsolver.com/ap-chemistry' },
  openGraph: {
    title: 'AP Chemistry Prep — Free Interactive Labs & Tools',
    description: 'Every AP Chemistry unit covered. Free simulators, no login required.',
    url: 'https://www.thechemsolver.com/ap-chemistry',
    siteName: 'TheChemSolver',
    type: 'website',
  },
}

const EXAM_FORMAT = [
  { section: 'Section I — MCQ', detail: '60 questions · 90 min · 50% of score', icon: '📝' },
  { section: 'Section II — FRQ', detail: '7 questions (3 long, 4 short) · 105 min · 50% of score', icon: '✍️' },
  { section: 'Calculator', detail: 'Allowed on entire exam', icon: '🔢' },
  { section: 'Exam date', detail: 'First Monday of May each year', icon: '📅' },
]

const AP_UNITS = [
  {
    unit: 'Unit 1', name: 'Atomic Structure & Properties',
    color: 'blue',
    labs: [
      { name: 'Quantum Number Explorer', href: '/labs/quantum' },
      { name: 'Radial Probability Density', href: '/labs/radial-probability' },
      { name: 'Atomic Evolution Lab', href: '/labs/atomic-evolution' },
      { name: 'Interactive Periodic Table', href: '/labs/periodic-table' },
      { name: 'Periodic Properties', href: '/labs/periodic' },
      { name: 'IUPAC Nomenclature Engine', href: '/labs/nomenclature' },
    ],
  },
  {
    unit: 'Unit 2', name: 'Molecular & Ionic Compound Structure',
    color: 'indigo',
    labs: [
      { name: 'VSEPR & Molecular Geometry', href: '/labs/vsepr' },
      { name: 'Hybridization Explorer', href: '/labs/hybridization' },
      { name: 'Hydrocarbon Structure Builder', href: '/labs/hydrocarbon' },
    ],
  },
  {
    unit: 'Unit 3', name: 'Intermolecular Forces & Properties',
    color: 'violet',
    labs: [
      { name: 'VSEPR & Molecular Geometry', href: '/labs/vsepr' },
      { name: 'Periodic Properties', href: '/labs/periodic' },
    ],
  },
  {
    unit: 'Unit 4', name: 'Chemical Reactions',
    color: 'purple',
    labs: [
      { name: 'Organic Mechanism Viewer', href: '/labs/organic-mechanism' },
      { name: '3D Reaction Mechanism Viewer', href: '/labs/mechanisms' },
    ],
  },
  {
    unit: 'Unit 5', name: 'Kinetics',
    color: 'fuchsia',
    labs: [
      { name: 'Reaction Kinetics Simulator', href: '/labs/kinetics' },
    ],
  },
  {
    unit: 'Unit 6', name: 'Thermodynamics',
    color: 'pink',
    labs: [
      { name: 'Thermodynamics Calculator', href: '/labs/thermodynamics' },
    ],
  },
  {
    unit: 'Unit 7', name: 'Equilibrium',
    color: 'rose',
    labs: [
      { name: 'Chemical Equilibrium Lab', href: '/labs/equilibrium' },
      { name: 'Ionic Equilibrium & Buffer', href: '/labs/ionic-equilibrium' },
    ],
  },
  {
    unit: 'Unit 8', name: 'Acids & Bases',
    color: 'orange',
    labs: [
      { name: 'Titration Curve Simulator', href: '/labs/titration' },
      { name: 'Ionic Equilibrium & Buffer', href: '/labs/ionic-equilibrium' },
    ],
  },
  {
    unit: 'Unit 9', name: 'Applications of Thermodynamics',
    color: 'amber',
    labs: [
      { name: 'Electrochemical Cell Simulator', href: '/labs/electrochemical-potentials' },
      { name: 'Electrochemistry Simulator', href: '/labs/electrochemistry' },
      { name: 'Thermodynamics Calculator', href: '/labs/thermodynamics' },
    ],
  },
]

const COMING_SOON = [
  { icon: '📋', label: 'MCQ Question Bank', desc: '60-question timed practice sets from past AP exams (2000–2025)', eta: 'Q3 2025' },
  { icon: '✍️', label: 'FRQ Past Papers', desc: 'All AP Chemistry FRQs with model answers, 2012–2025', eta: 'Q3 2025' },
  { icon: '🎯', label: 'Unit-wise Practice', desc: 'Filter practice by Unit 1–9 and question type', eta: 'Q3 2025' },
  { icon: '📊', label: 'Score Predictor', desc: 'Track performance and predict 5-score probability', eta: 'Q4 2025' },
]

const colorMap: Record<string, string> = {
  blue: 'bg-blue-900/20 border-blue-700/30 text-blue-400',
  indigo: 'bg-indigo-900/20 border-indigo-700/30 text-indigo-400',
  violet: 'bg-violet-900/20 border-violet-700/30 text-violet-400',
  purple: 'bg-purple-900/20 border-purple-700/30 text-purple-400',
  fuchsia: 'bg-fuchsia-900/20 border-fuchsia-700/30 text-fuchsia-400',
  pink: 'bg-pink-900/20 border-pink-700/30 text-pink-400',
  rose: 'bg-rose-900/20 border-rose-700/30 text-rose-400',
  orange: 'bg-orange-900/20 border-orange-700/30 text-orange-400',
  amber: 'bg-amber-900/20 border-amber-700/30 text-amber-400',
}

export default function APChemistryPage() {
  return (
    <div className="bg-[#060610] text-white">

      {/* Hero */}
      <section className="px-5 pt-16 pb-12 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">College Board</span>
          <span className="text-white/20">·</span>
          <span className="text-xs text-gray-500">Exam in May</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
          AP Chemistry
          <span className="block text-2xl md:text-3xl font-semibold text-gray-400 mt-1">
            Free Prep Tools & Simulators
          </span>
        </h1>
        <p className="text-gray-400 max-w-2xl mb-8 leading-relaxed">
          Every interactive lab on TheChemSolver is mapped to an AP Chemistry unit. Use them to build the deep conceptual understanding the FRQ section demands — not just MCQ elimination practice.
        </p>
        <div className="flex flex-wrap gap-3 mb-10">
          <Link href="/labs/titration"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            Start with Titration Simulator
          </Link>
          <Link href="/labs"
            className="border border-white/20 hover:border-white/40 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            Browse All Labs →
          </Link>
        </div>

        {/* Exam format cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {EXAM_FORMAT.map(f => (
            <div key={f.section} className="bg-blue-900/15 border border-blue-700/25 rounded-2xl p-4">
              <div className="text-xl mb-2">{f.icon}</div>
              <div className="text-xs font-bold text-blue-300 mb-1">{f.section}</div>
              <div className="text-xs text-gray-400 leading-relaxed">{f.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Unit-by-Unit Labs */}
      <section className="px-5 py-14 bg-gradient-to-b from-blue-950/30 to-transparent border-y border-blue-800/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-1">Labs by AP Unit</h2>
          <p className="text-gray-500 text-sm mb-8">Click any simulator to open it — no login, no signup</p>
          <div className="space-y-3">
            {AP_UNITS.map(u => {
              const cls = colorMap[u.color] ?? colorMap.blue
              return (
                <div key={u.unit} className={`border rounded-2xl p-5 ${cls.split(' ').slice(0, 2).join(' ')}`}>
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <div className="md:w-52 shrink-0">
                      <span className={`text-xs font-bold uppercase tracking-wide ${cls.split(' ')[2]}`}>{u.unit}</span>
                      <div className="font-semibold text-sm mt-0.5">{u.name}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {u.labs.map(lab => (
                        <Link key={lab.href} href={lab.href}
                          className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors">
                          {lab.name} →
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="px-5 py-14 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold">Coming Soon</h2>
          <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-full">In Development</span>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {COMING_SOON.map(c => (
            <div key={c.label} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex gap-4">
              <span className="text-2xl shrink-0">{c.icon}</span>
              <div>
                <div className="font-semibold text-sm mb-1">{c.label}</div>
                <div className="text-gray-500 text-xs leading-relaxed mb-2">{c.desc}</div>
                <span className="text-xs bg-blue-900/40 text-blue-400 border border-blue-700/30 px-2 py-0.5 rounded-full">{c.eta}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Practice CTA */}
      <section className="px-5 py-14 text-center bg-gradient-to-t from-blue-950/20 to-transparent border-t border-white/5">
        <h2 className="text-2xl font-bold mb-2">Start Prepping Now</h2>
        <p className="text-gray-400 text-sm mb-7">No account needed. Every tool is free, forever.</p>
        <div className="flex flex-wrap gap-3 justify-center mb-5">
          <Link href="/ap-chemistry/practice"
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors">
            Practice MCQ &amp; FRQ →
          </Link>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { l: 'Titration Simulator', h: '/labs/titration' },
            { l: 'Equilibrium Lab', h: '/labs/equilibrium' },
            { l: 'Kinetics Simulator', h: '/labs/kinetics' },
            { l: 'Thermodynamics', h: '/labs/thermodynamics' },
            { l: 'Electrochemistry', h: '/labs/electrochemical-potentials' },
            { l: 'Quantum Orbitals', h: '/labs/quantum' },
          ].map(b => (
            <Link key={b.h} href={b.h}
              className="border border-blue-700/40 hover:border-blue-500/60 hover:bg-blue-900/20 text-blue-300 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
              {b.l}
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
