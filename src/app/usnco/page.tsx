import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'USNCO Prep — Free Practice Tools & Past Exam Resources | TheChemSolver',
  description: 'Free USNCO (US National Chemistry Olympiad) prep tools. Local exam MCQ practice, national exam FRQ problems, and interactive simulators covering the full USNCO syllabus. No login required.',
  keywords: 'USNCO prep free, US national chemistry olympiad practice, USNCO local exam, USNCO past papers, chemistry olympiad MCQ',
  alternates: { canonical: 'https://www.thechemsolver.com/usnco' },
  openGraph: {
    title: 'USNCO Prep — Free Chemistry Olympiad Tools',
    description: 'Local exam, national exam, and IChO selection — all covered with free interactive tools.',
    url: 'https://www.thechemsolver.com/usnco',
    siteName: 'TheChemSolver',
    type: 'website',
  },
}

const EXAM_STAGES = [
  {
    stage: 'Local Exam',
    format: '60 MCQ · 110 min',
    desc: 'Held at participating schools in March. Top scorers qualify for the National Exam.',
    color: 'orange',
    icon: '🏫',
  },
  {
    stage: 'National Part I',
    format: '60 MCQ · 110 min',
    desc: 'Taken by ~1000 top local scorers. Covers general, organic, analytical, and physical chemistry.',
    color: 'orange',
    icon: '📝',
  },
  {
    stage: 'National Part II',
    format: 'Lab Practical · 3 tasks · 90 min',
    desc: 'Hands-on laboratory skills. Only at the Study Camp.',
    color: 'orange',
    icon: '🧪',
  },
  {
    stage: 'National Part III',
    format: '8 Free-Response · 90 min',
    desc: 'Extended problem-solving. Top ~20 scorers become IChO team candidates.',
    color: 'orange',
    icon: '✍️',
  },
]

const TOPIC_AREAS = [
  {
    area: 'General Chemistry',
    weight: 'Heavily tested — both local and national',
    color: 'orange',
    labs: [
      { name: 'Chemical Equilibrium Lab', href: '/labs/equilibrium' },
      { name: 'Ionic Equilibrium & Buffer', href: '/labs/ionic-equilibrium' },
      { name: 'Titration Curve Simulator', href: '/labs/titration' },
      { name: 'Reaction Kinetics Simulator', href: '/labs/kinetics' },
      { name: 'Thermodynamics Calculator', href: '/labs/thermodynamics' },
      { name: 'Nuclear Decay Simulator', href: '/labs/nuclear-decay' },
    ],
  },
  {
    area: 'Atomic & Molecular Structure',
    weight: 'Core MCQ topic',
    color: 'amber',
    labs: [
      { name: 'Quantum Number Explorer', href: '/labs/quantum' },
      { name: 'Radial Probability Density', href: '/labs/radial-probability' },
      { name: 'VSEPR & Molecular Geometry', href: '/labs/vsepr' },
      { name: 'Hybridization Explorer', href: '/labs/hybridization' },
      { name: 'Periodic Properties', href: '/labs/periodic' },
      { name: 'Interactive Periodic Table', href: '/labs/periodic-table' },
    ],
  },
  {
    area: 'Electrochemistry',
    weight: 'National exam focus',
    color: 'yellow',
    labs: [
      { name: 'Electrochemical Cell Lab', href: '/labs/electrochemical' },
      { name: 'Electrochemistry Simulator', href: '/labs/electrochemistry' },
      { name: 'Nernst Equation & Potentials', href: '/labs/electrochemical-potentials' },
    ],
  },
  {
    area: 'Organic Chemistry',
    weight: 'National Part I & III',
    color: 'red',
    labs: [
      { name: 'IUPAC Nomenclature Engine', href: '/labs/nomenclature' },
      { name: 'Hydrocarbon Structure Builder', href: '/labs/hydrocarbon' },
      { name: 'Stereochemistry Lab', href: '/labs/stereochemistry' },
      { name: 'Projection Formula Lab', href: '/labs/projection-formula' },
      { name: 'Organic Mechanism Viewer', href: '/labs/organic-mechanism' },
      { name: '3D Reaction Mechanisms', href: '/labs/mechanisms' },
      { name: 'Organic Synthesis Pathways', href: '/labs/organic-synthesis' },
    ],
  },
  {
    area: 'Coordination & Advanced Inorganic',
    weight: 'National Part III & IChO camp',
    color: 'rose',
    labs: [
      { name: 'Crystal Field Theory', href: '/labs/crystal-field' },
      { name: 'Crystal Field Simulator', href: '/labs/coordination' },
      { name: 'Atomic Evolution Lab', href: '/labs/atomic-evolution' },
    ],
  },
]

const COMING_SOON = [
  { icon: '📋', label: 'Local Exam MCQ Bank', desc: 'Full 60-question timed sets from USNCO Local exams 2000–2025 with answer explanations', eta: 'Q3 2025' },
  { icon: '📄', label: 'National Exam Archive', desc: 'National Part I, II, and III past papers with worked solutions (2000–2025)', eta: 'Q3 2025' },
  { icon: '⏱️', label: 'Timed Practice Mode', desc: '60-question mock local exam with 110-minute countdown and score report', eta: 'Q4 2025' },
  { icon: '🔬', label: 'Lab Practical Guide', desc: 'Interactive walkthrough of common Part II lab techniques and calculations', eta: '2026' },
]

const colorMap: Record<string, { card: string; label: string; tag: string }> = {
  orange: { card: 'bg-orange-900/15 border-orange-700/30', label: 'text-orange-400', tag: 'bg-orange-500/10 text-orange-300 border-orange-500/20' },
  amber:  { card: 'bg-amber-900/15 border-amber-700/30',  label: 'text-amber-400',  tag: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
  yellow: { card: 'bg-yellow-900/15 border-yellow-700/30', label: 'text-yellow-400', tag: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20' },
  red:    { card: 'bg-red-900/15 border-red-700/30',    label: 'text-red-400',    tag: 'bg-red-500/10 text-red-300 border-red-500/20' },
  rose:   { card: 'bg-rose-900/15 border-rose-700/30',  label: 'text-rose-400',  tag: 'bg-rose-500/10 text-rose-300 border-rose-500/20' },
}

export default function USNCOPage() {
  return (
    <div className="bg-[#060610] text-white">

      {/* Hero */}
      <section className="px-5 pt-16 pb-12 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-400">American Chemical Society</span>
          <span className="text-white/20">·</span>
          <span className="text-xs text-gray-500">March (Local) · April (National)</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
          USNCO
          <span className="block text-2xl md:text-3xl font-semibold text-gray-400 mt-1">
            US National Chemistry Olympiad
          </span>
        </h1>
        <p className="text-gray-400 max-w-2xl mb-8 leading-relaxed">
          The pathway from local school exam to IChO selection camp. USNCO tests deeper than AP Chemistry — expect harder thermodynamics, coordination chemistry, and multi-step organic synthesis on the national exam.
        </p>
        <div className="flex flex-wrap gap-3 mb-10">
          <Link href="/labs/equilibrium"
            className="bg-orange-600 hover:bg-orange-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            Start with Equilibrium Lab
          </Link>
          <Link href="/labs"
            className="border border-white/20 hover:border-white/40 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            Browse All Labs →
          </Link>
        </div>

        {/* Exam stage cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {EXAM_STAGES.map(s => (
            <div key={s.stage} className="bg-orange-900/15 border border-orange-700/25 rounded-2xl p-4">
              <div className="text-xl mb-2">{s.icon}</div>
              <div className="text-xs font-bold text-orange-300 mb-1">{s.stage}</div>
              <div className="text-xs text-blue-300 font-medium mb-2">{s.format}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Topic Areas + Labs */}
      <section className="px-5 py-14 bg-gradient-to-b from-orange-950/20 to-transparent border-y border-orange-800/15">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-1">Simulators by USNCO Topic Area</h2>
          <p className="text-gray-500 text-sm mb-8">Click any tool to open it — all free, no account needed</p>
          <div className="space-y-4">
            {TOPIC_AREAS.map(t => {
              const cls = colorMap[t.color] ?? colorMap.orange
              return (
                <div key={t.area} className={`border rounded-2xl p-5 ${cls.card}`}>
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="md:w-52 shrink-0">
                      <div className={`text-xs font-bold uppercase tracking-wide mb-1 ${cls.label}`}>{t.area}</div>
                      <div className="text-xs text-gray-500">{t.weight}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {t.labs.map(lab => (
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
          <h2 className="text-2xl font-bold">Question Bank & Past Papers</h2>
          <span className="text-xs bg-orange-500/20 text-orange-300 border border-orange-500/30 px-2.5 py-1 rounded-full">Coming Soon</span>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {COMING_SOON.map(c => (
            <div key={c.label} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex gap-4">
              <span className="text-2xl shrink-0">{c.icon}</span>
              <div>
                <div className="font-semibold text-sm mb-1">{c.label}</div>
                <div className="text-gray-500 text-xs leading-relaxed mb-2">{c.desc}</div>
                <span className="text-xs bg-orange-900/40 text-orange-400 border border-orange-700/30 px-2 py-0.5 rounded-full">{c.eta}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-14 text-center bg-gradient-to-t from-orange-950/15 to-transparent border-t border-white/5">
        <h2 className="text-2xl font-bold mb-2">Build the Depth USNCO Demands</h2>
        <p className="text-gray-400 text-sm mb-7">Start with any simulator — free, no account required.</p>
        <div className="flex flex-wrap gap-3 justify-center mb-5">
          <Link href="/usnco/practice"
            className="bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors">
            Practice MCQ Exam →
          </Link>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { l: 'Equilibrium Lab', h: '/labs/equilibrium' },
            { l: 'Titration Simulator', h: '/labs/titration' },
            { l: 'Thermodynamics', h: '/labs/thermodynamics' },
            { l: '3D Mechanisms', h: '/labs/mechanisms' },
            { l: 'Crystal Field Theory', h: '/labs/crystal-field' },
            { l: 'Organic Synthesis', h: '/labs/organic-synthesis' },
            { l: 'Stereochemistry Lab', h: '/labs/stereochemistry' },
          ].map(b => (
            <Link key={b.h} href={b.h}
              className="border border-orange-700/40 hover:border-orange-500/60 hover:bg-orange-900/20 text-orange-300 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
              {b.l}
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
