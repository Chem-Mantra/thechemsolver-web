import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'IChO Prep — Free International Chemistry Olympiad Tools | TheChemSolver',
  description: 'Free IChO (International Chemistry Olympiad) prep tools covering theoretical and practical exam topics. Coordination chemistry, crystal field theory, thermodynamics, organic synthesis, stereochemistry, and more. No login required.',
  keywords: 'IChO prep free, international chemistry olympiad tools, IChO theoretical problems, chemistry olympiad practice, IChO past papers',
  alternates: { canonical: 'https://www.thechemsolver.com/icho' },
  openGraph: {
    title: 'IChO Prep — Free International Chemistry Olympiad Tools',
    description: 'Advanced chemistry simulators covering the full IChO theoretical and practical syllabus.',
    url: 'https://www.thechemsolver.com/icho',
    siteName: 'TheChemSolver',
    type: 'website',
  },
}

const EXAM_FORMAT = [
  { label: 'Theoretical Exam', detail: '5–6 multi-part problems · ~5 hours', icon: '📐', note: 'Problems span all chemistry domains' },
  { label: 'Practical Exam', detail: '3–4 lab tasks · ~5 hours', icon: '🧪', note: 'Synthesis, analysis, and identification' },
  { label: 'Preparatory Problems', detail: '~30 advance problems released ~6 months before', icon: '📚', note: 'Official host-country prep set' },
  { label: 'Selection', detail: '4 students per country · via USNCO camp', icon: '🌍', note: 'July each year, rotating host nation' },
]

const TOPIC_DOMAINS = [
  {
    domain: 'Physical Chemistry',
    depth: 'Heaviest theoretical weight',
    color: 'yellow',
    labs: [
      { name: 'Thermodynamics Calculator (ΔG, ΔH, ΔS)', href: '/labs/thermodynamics' },
      { name: 'Reaction Kinetics Simulator', href: '/labs/kinetics' },
      { name: 'Electrochemistry Simulator', href: '/labs/electrochemistry' },
      { name: 'Electrochemical Cell Lab', href: '/labs/electrochemical' },
      { name: 'Nernst Equation & Potentials', href: '/labs/electrochemical-potentials' },
    ],
  },
  {
    domain: 'Atomic & Quantum Chemistry',
    depth: 'Spectroscopy, atomic structure, quantum numbers',
    color: 'amber',
    labs: [
      { name: 'Quantum Number Explorer', href: '/labs/quantum' },
      { name: 'Radial Probability Density', href: '/labs/radial-probability' },
      { name: 'Atomic Evolution Lab', href: '/labs/atomic-evolution' },
      { name: 'Hybridization Explorer', href: '/labs/hybridization' },
    ],
  },
  {
    domain: 'Coordination & Inorganic Chemistry',
    depth: 'Crystal field theory, d-block, spectroscopy',
    color: 'gold',
    labs: [
      { name: 'Crystal Field Theory Simulator', href: '/labs/crystal-field' },
      { name: 'Crystal Field & Coordination', href: '/labs/coordination' },
      { name: 'Periodic Properties', href: '/labs/periodic' },
      { name: 'Interactive Periodic Table', href: '/labs/periodic-table' },
    ],
  },
  {
    domain: 'Organic Chemistry',
    depth: 'Reaction mechanisms, stereochemistry, synthesis',
    color: 'lime',
    labs: [
      { name: 'Stereochemistry Lab', href: '/labs/stereochemistry' },
      { name: 'Projection Formula Lab (Fischer/Newman/Sawhorse)', href: '/labs/projection-formula' },
      { name: 'Organic Synthesis Pathways', href: '/labs/organic-synthesis' },
      { name: '3D Reaction Mechanism Viewer', href: '/labs/mechanisms' },
      { name: 'Organic Mechanism Viewer', href: '/labs/organic-mechanism' },
      { name: 'IUPAC Nomenclature Engine', href: '/labs/nomenclature' },
    ],
  },
  {
    domain: 'Analytical & Equilibrium Chemistry',
    depth: 'Titrations, buffers, solubility, Ksp',
    color: 'teal',
    labs: [
      { name: 'Titration Curve Simulator', href: '/labs/titration' },
      { name: 'Ionic Equilibrium & Buffer', href: '/labs/ionic-equilibrium' },
      { name: 'Chemical Equilibrium Lab', href: '/labs/equilibrium' },
    ],
  },
  {
    domain: 'Nuclear & Radiochemistry',
    depth: 'Decay chains, half-life, binding energy',
    color: 'cyan',
    labs: [
      { name: 'Nuclear Decay Simulator', href: '/labs/nuclear-decay' },
    ],
  },
]

const COMING_SOON = [
  { icon: '📐', label: 'IChO Preparatory Problems', desc: 'Official prep problem sets from IChO 2001–2025 with detailed model solutions and marking schemes', eta: 'Q3 2025' },
  { icon: '📄', label: 'Theoretical Exam Archive', desc: 'Full theoretical exam papers and official solutions from past IChO editions (2001–2025)', eta: 'Q3 2025' },
  { icon: '🧮', label: 'IChO-Format Problem Viewer', desc: 'Multi-part problem interface with sub-question navigation, formula rendering, and solution reveal', eta: 'Q4 2025' },
  { icon: '🗂️', label: 'Preparatory Problem Topic Index', desc: 'Browse IChO prep problems filtered by topic: thermodynamics, coordination, organic, kinetics, etc.', eta: 'Q4 2025' },
]

const colorMap: Record<string, { card: string; label: string }> = {
  yellow: { card: 'bg-yellow-900/15 border-yellow-700/30', label: 'text-yellow-400' },
  amber:  { card: 'bg-amber-900/15 border-amber-700/30',  label: 'text-amber-400' },
  gold:   { card: 'bg-yellow-900/20 border-yellow-600/30', label: 'text-yellow-300' },
  lime:   { card: 'bg-lime-900/15 border-lime-700/30',    label: 'text-lime-400' },
  teal:   { card: 'bg-teal-900/15 border-teal-700/30',    label: 'text-teal-400' },
  cyan:   { card: 'bg-cyan-900/15 border-cyan-700/30',    label: 'text-cyan-400' },
}

export default function IChOPage() {
  return (
    <div className="bg-[#060610] text-white">

      {/* Hero */}
      <section className="px-5 pt-16 pb-12 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">IUPAC · Global</span>
          <span className="text-white/20">·</span>
          <span className="text-xs text-gray-500">July each year · rotating host nation</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
          IChO
          <span className="block text-2xl md:text-3xl font-semibold text-gray-400 mt-1">
            International Chemistry Olympiad
          </span>
        </h1>
        <p className="text-gray-400 max-w-2xl mb-8 leading-relaxed">
          The world's most demanding chemistry competition. IChO problems span all branches of chemistry at undergraduate depth — physical, inorganic, organic, analytical — often requiring university-level reasoning in a 5-hour exam. Our simulators cover the most tested theoretical topics.
        </p>
        <div className="flex flex-wrap gap-3 mb-10">
          <Link href="/labs/crystal-field"
            className="bg-yellow-600 hover:bg-yellow-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            Crystal Field Theory Lab
          </Link>
          <Link href="/labs/thermodynamics"
            className="border border-yellow-700/40 hover:border-yellow-500/60 hover:bg-yellow-900/20 text-yellow-300 font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            Thermodynamics Calculator
          </Link>
          <Link href="/labs"
            className="border border-white/20 hover:border-white/40 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            Browse All Labs →
          </Link>
        </div>

        {/* Format cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {EXAM_FORMAT.map(f => (
            <div key={f.label} className="bg-yellow-900/15 border border-yellow-700/25 rounded-2xl p-4">
              <div className="text-xl mb-2">{f.icon}</div>
              <div className="text-xs font-bold text-yellow-300 mb-1">{f.label}</div>
              <div className="text-xs text-blue-300 font-medium mb-1.5">{f.detail}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{f.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Domain Coverage */}
      <section className="px-5 py-14 bg-gradient-to-b from-yellow-950/20 to-transparent border-y border-yellow-800/15">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-1">Simulators by IChO Domain</h2>
          <p className="text-gray-500 text-sm mb-8">All simulators match topics from IChO preparatory problems and past theoretical exams</p>
          <div className="space-y-4">
            {TOPIC_DOMAINS.map(d => {
              const cls = colorMap[d.color] ?? colorMap.yellow
              return (
                <div key={d.domain} className={`border rounded-2xl p-5 ${cls.card}`}>
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="md:w-56 shrink-0">
                      <div className={`text-xs font-bold uppercase tracking-wide mb-1 ${cls.label}`}>{d.domain}</div>
                      <div className="text-xs text-gray-500">{d.depth}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {d.labs.map(lab => (
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

      {/* Past Papers + Coming Soon */}
      <section className="px-5 py-14 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold">Past Papers & Problem Archive</h2>
          <span className="text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-2.5 py-1 rounded-full">In Development</span>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {COMING_SOON.map(c => (
            <div key={c.label} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex gap-4">
              <span className="text-2xl shrink-0">{c.icon}</span>
              <div>
                <div className="font-semibold text-sm mb-1">{c.label}</div>
                <div className="text-gray-500 text-xs leading-relaxed mb-2">{c.desc}</div>
                <span className="text-xs bg-yellow-900/40 text-yellow-400 border border-yellow-700/30 px-2 py-0.5 rounded-full">{c.eta}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why IChO is Different */}
      <section className="px-5 py-14 bg-gradient-to-br from-yellow-950/15 to-transparent border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Why IChO Prep is Different</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: '🔬', title: 'No Curriculum Boundary', desc: 'IChO problems routinely require first-year university chemistry. Thermodynamic cycles, crystal field theory, advanced spectroscopy, and organometallic reactions are all fair game.' },
              { icon: '🧮', title: 'Heavy Calculation Load', desc: 'Expect multi-step quantitative problems involving equilibrium constants, electrochemical potentials, partition functions, and Born-Haber cycles in a single question.' },
              { icon: '⚗️', title: 'Practical Lab Skills', desc: 'The practical exam tests synthesis, titration, spectroscopic analysis, and kinetic measurements — all under strict time constraints with real reagents.' },
            ].map(c => (
              <div key={c.title} className="bg-yellow-900/10 border border-yellow-700/20 rounded-2xl p-5">
                <div className="text-2xl mb-3">{c.icon}</div>
                <div className="font-semibold text-sm mb-2">{c.title}</div>
                <div className="text-gray-500 text-xs leading-relaxed">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-14 text-center">
        <h2 className="text-2xl font-bold mb-2">Start With the Hardest Topics</h2>
        <p className="text-gray-400 text-sm mb-7">No account needed. Every simulator is free.</p>
        <div className="flex flex-wrap gap-3 justify-center mb-5">
          <Link href="/icho/problems"
            className="bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors">
            View Prep Problems →
          </Link>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { l: 'Crystal Field Theory', h: '/labs/crystal-field' },
            { l: 'Thermodynamics', h: '/labs/thermodynamics' },
            { l: 'Electrochemistry', h: '/labs/electrochemistry' },
            { l: 'Organic Synthesis', h: '/labs/organic-synthesis' },
            { l: 'Projection Formulas', h: '/labs/projection-formula' },
            { l: 'Reaction Mechanisms', h: '/labs/mechanisms' },
          ].map(b => (
            <Link key={b.h} href={b.h}
              className="border border-yellow-700/40 hover:border-yellow-500/60 hover:bg-yellow-900/20 text-yellow-300 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
              {b.l}
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
