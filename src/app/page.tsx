import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'TheChemSolver — Free Chemistry Tools for AP Chem, Orgo & IChO',
  description: 'Free interactive chemistry solvers and virtual labs for AP Chemistry, Organic Chemistry, and IChO. IUPAC namer, titration simulator, VSEPR, equilibrium, kinetics, electrochemistry and more.',
  keywords: 'AP chemistry tools free, organic chemistry solver, IChO chemistry, IUPAC namer, titration simulator, VSEPR, equilibrium calculator, chemistry virtual lab',
  openGraph: {
    title: 'TheChemSolver — Free Chemistry Solvers & Virtual Labs',
    description: 'Free interactive chemistry tools for AP Chemistry, Orgo, and IChO students. No login, no subscription.',
    url: 'https://www.thechemsolver.com',
    siteName: 'TheChemSolver',
    type: 'website',
  },
}

const TOOL_CATEGORIES = [
  {
    id: 'organic',
    label: 'Organic Chemistry',
    color: '#a855f7',
    gradient: 'from-purple-900/40 to-purple-950/20',
    border: 'border-purple-700/30',
    tools: [
      {
        name: 'IUPAC Nomenclature Engine',
        href: '/labs/nomenclature',
        desc: 'Draw any molecule → get correct IUPAC name with step-by-step rule explanation',
        badge: 'NEW',
        badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30',
        tag: 'Orgo 1 & 2 • AP Chem Unit 1',
      },
      {
        name: 'Hydrocarbon Structure Builder',
        href: '/labs/hydrocarbon',
        desc: 'Interactive 3D builder for alkanes, alkenes, alkynes with IUPAC auto-naming',
        badge: null,
        badgeColor: '',
        tag: 'Orgo 1 • AP Chem Unit 1',
      },
      {
        name: 'Structural Formula Viewer',
        href: '/labs/nomenclature',
        desc: 'Convert IUPAC names to bond-line structural formulas with substituent positions',
        badge: null,
        badgeColor: '',
        tag: 'Orgo 1',
      },
    ],
  },
  {
    id: 'physical',
    label: 'Physical Chemistry',
    color: '#3b82f6',
    gradient: 'from-blue-900/40 to-blue-950/20',
    border: 'border-blue-700/30',
    tools: [
      {
        name: 'Titration Curve Simulator',
        href: '/labs/titration',
        desc: 'Strong/weak acid-base, polyprotic, and redox titrations with live S-curve and equivalence point',
        badge: 'POPULAR',
        badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        tag: 'AP Chem Unit 8 • IChO',
      },
      {
        name: 'Chemical Equilibrium Lab',
        href: '/labs/equilibrium',
        desc: 'ICE table solver + Le Chatelier visualizer — shift concentrations, temperature, pressure in real time',
        badge: null,
        badgeColor: '',
        tag: 'AP Chem Unit 7 • IChO',
      },
      {
        name: 'Ionic Equilibrium & Buffers',
        href: '/labs/ionic-equilibrium',
        desc: 'pH calculations for weak acids, bases, salts, buffer systems (Henderson-Hasselbalch)',
        badge: 'POPULAR',
        badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        tag: 'AP Chem Unit 8 • IChO',
      },
      {
        name: 'Reaction Kinetics Simulator',
        href: '/labs/kinetics',
        desc: 'First/second order kinetics, half-life, integrated rate laws, Arrhenius equation plotter',
        badge: null,
        badgeColor: '',
        tag: 'AP Chem Unit 5 • IChO',
      },
      {
        name: 'Thermodynamics Calculator',
        href: '/labs/thermodynamics',
        desc: 'ΔG, ΔH, ΔS with Maxwell-Boltzmann distributions and Carnot cycle efficiency',
        badge: null,
        badgeColor: '',
        tag: 'AP Chem Unit 9 • IChO',
      },
    ],
  },
  {
    id: 'electrochemistry',
    label: 'Electrochemistry & Inorganic',
    color: '#f97316',
    gradient: 'from-orange-900/40 to-orange-950/20',
    border: 'border-orange-700/30',
    tools: [
      {
        name: 'Electrochemical Cell Simulator',
        href: '/labs/electrochemical-potentials',
        desc: 'Galvanic and electrolytic cells, standard reduction potentials, Nernst equation',
        badge: null,
        badgeColor: '',
        tag: 'AP Chem Unit 9 • IChO',
      },
      {
        name: 'Coordination Chemistry & Crystal Field',
        href: '/labs/coordination',
        desc: 'd-orbital splitting, crystal field stabilization energy, complex geometry (IChO level)',
        badge: 'IChO',
        badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        tag: 'IChO • Inorganic Chem',
      },
      {
        name: 'Nuclear Decay Simulator',
        href: '/labs/nuclear-decay',
        desc: 'Alpha/beta/gamma decay chains, half-life graphing, activity and dose calculations',
        badge: null,
        badgeColor: '',
        tag: 'AP Chem Unit 1 • IChO',
      },
    ],
  },
  {
    id: 'quantum',
    label: 'Quantum Chemistry & Atomic Structure',
    color: '#06b6d4',
    gradient: 'from-cyan-900/40 to-cyan-950/20',
    border: 'border-cyan-700/30',
    tools: [
      {
        name: 'Quantum Number Explorer',
        href: '/labs/quantum',
        desc: 'Visualize n, l, ml, ms quantum numbers with real 3D orbital shape rendering',
        badge: null,
        badgeColor: '',
        tag: 'AP Chem Unit 1 • IChO',
      },
      {
        name: 'Radial Probability Density',
        href: '/labs/radial-probability',
        desc: 'Plot ψ² radial distribution for any H-atom orbital — 1s through 4f with node visualization',
        badge: 'IChO',
        badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        tag: 'IChO • Physical Chem',
      },
      {
        name: 'Atomic Spectra & Energy Levels',
        href: '/labs/atomic-evolution',
        desc: 'Bohr model, emission spectra, electron transition energies, hydrogen line series',
        badge: null,
        badgeColor: '',
        tag: 'AP Chem Unit 1 • IChO',
      },
    ],
  },
  {
    id: 'molecular',
    label: 'Molecular Structure & Bonding',
    color: '#22c55e',
    gradient: 'from-green-900/40 to-green-950/20',
    border: 'border-green-700/30',
    tools: [
      {
        name: 'VSEPR & Molecular Geometry',
        href: '/labs/vsepr',
        desc: 'Build molecules, predict geometry and bond angles using VSEPR theory with 3D visualization',
        badge: 'POPULAR',
        badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        tag: 'AP Chem Unit 2 • IChO',
      },
    ],
  },
]

const AP_UNITS = [
  { unit: 'Unit 1', name: 'Atomic Structure & Properties', tools: ['Quantum Explorer', 'Atomic Spectra', 'IUPAC Namer'] },
  { unit: 'Unit 2', name: 'Molecular & Ionic Bonding', tools: ['VSEPR', 'Structural Formula', 'Hydrocarbon Builder'] },
  { unit: 'Unit 5', name: 'Kinetics', tools: ['Reaction Kinetics Simulator'] },
  { unit: 'Unit 7', name: 'Equilibrium', tools: ['Chemical Equilibrium Lab'] },
  { unit: 'Unit 8', name: 'Acids & Bases', tools: ['Titration Simulator', 'Ionic Equilibrium & Buffers'] },
  { unit: 'Unit 9', name: 'Thermodynamics & Electrochemistry', tools: ['Thermodynamics Calc', 'Electrochemical Cell'] },
]

const ICHO_TOPICS = [
  'Coordination Chemistry & Crystal Field Theory',
  'Advanced Acid-Base & Buffer Equilibria',
  'Electrochemical Cells & Nernst Equation',
  'Quantum Numbers & Orbital Theory',
  'Nuclear Chemistry & Decay Kinetics',
  'Thermodynamic Calculations (ΔG, ΔH, ΔS)',
]

function AdSlot({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center bg-white/[0.02] border border-white/5 rounded-xl text-gray-700 text-xs ${className}`}>
      {/* Replace with: <ins class="adsbygoogle" data-ad-client="ca-pub-XXXXXXXX" data-ad-slot="XXXXXXXX" /> */}
      Advertisement
    </div>
  )
}

export default function USHomePage() {
  return (
    <div className="bg-[#060610] text-white">

      {/* Nav */}
      <nav className="border-b border-white/10 px-5 py-4 flex items-center justify-between sticky top-0 bg-[#060610]/95 backdrop-blur z-50">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚗️</span>
          <span className="font-bold text-xl tracking-tight">TheChemSolver</span>
          <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">100% FREE</span>
        </div>
        <div className="hidden md:flex items-center gap-1 text-sm">
          <Link href="/ap-chemistry" className="text-blue-400 hover:text-blue-300 font-semibold px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors">AP Chemistry</Link>
          <Link href="/usnco" className="text-orange-400 hover:text-orange-300 font-semibold px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors">USNCO</Link>
          <Link href="/icho" className="text-yellow-400 hover:text-yellow-300 font-semibold px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors">IChO</Link>
          <span className="text-white/20 mx-1">|</span>
          <a href="#tools" className="text-gray-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors">All Tools</a>
        </div>
        <Link href="/labs/nomenclature" className="bg-purple-600 hover:bg-purple-500 text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium">
          Try IUPAC Namer →
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-5 py-20 md:py-28 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
          🆓 Every tool is completely free — no account, no credit card
        </div>
        <h1 className="text-5xl md:text-6xl font-black mb-5 leading-tight tracking-tight">
          Chemistry Tools for
          <span className="block bg-gradient-to-r from-blue-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mt-1">
            AP · USNCO · IChO
          </span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Free interactive labs and simulators purpose-built for each exam — from AP Chemistry Units 1–9 to IChO-level coordination chemistry and multi-step synthesis.
        </p>

        {/* Exam division cards */}
        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10">
          <Link href="/ap-chemistry"
            className="group bg-blue-900/20 hover:bg-blue-900/35 border border-blue-700/30 hover:border-blue-600/50 rounded-2xl p-6 text-left transition-all">
            <div className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">AP Chemistry</div>
            <div className="font-bold text-lg mb-2">College Board Exam</div>
            <div className="text-gray-400 text-xs mb-4 leading-relaxed">60 MCQ + 7 FRQ · Units 1–9 · May exam · All 9 units covered with dedicated simulators</div>
            <div className="text-blue-400 text-sm font-semibold group-hover:translate-x-1 transition-transform inline-block">AP Chemistry Hub →</div>
          </Link>
          <Link href="/usnco"
            className="group bg-orange-900/20 hover:bg-orange-900/35 border border-orange-700/30 hover:border-orange-600/50 rounded-2xl p-6 text-left transition-all">
            <div className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-2">USNCO</div>
            <div className="font-bold text-lg mb-2">US Chemistry Olympiad</div>
            <div className="text-gray-400 text-xs mb-4 leading-relaxed">Local 60 MCQ + National Parts I/II/III · Deeper than AP · Coordination, organic synthesis, physical chem</div>
            <div className="text-orange-400 text-sm font-semibold group-hover:translate-x-1 transition-transform inline-block">USNCO Hub →</div>
          </Link>
          <Link href="/icho"
            className="group bg-yellow-900/20 hover:bg-yellow-900/35 border border-yellow-700/30 hover:border-yellow-600/50 rounded-2xl p-6 text-left transition-all">
            <div className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-2">IChO</div>
            <div className="font-bold text-lg mb-2">International Olympiad</div>
            <div className="text-gray-400 text-xs mb-4 leading-relaxed">5-hr theoretical + 5-hr practical · University-level depth · Crystal field, synthesis, advanced thermodynamics</div>
            <div className="text-yellow-400 text-sm font-semibold group-hover:translate-x-1 transition-transform inline-block">IChO Hub →</div>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <a href="#tools" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold px-7 py-3.5 rounded-xl transition-all">
            Browse All Tools
          </a>
          <Link href="/labs/titration" className="border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-semibold px-7 py-3.5 rounded-xl transition-all">
            Titration Simulator
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { v: '25+', l: 'Free Simulators' },
            { v: '$0', l: 'Forever Free' },
            { v: '3', l: 'Exam Tracks' },
            { v: '0', l: 'Login Required' },
          ].map(s => (
            <div key={s.l} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-2xl font-black text-white mb-0.5">{s.v}</div>
              <div className="text-xs text-gray-400">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* AdSense leaderboard */}
      <div className="px-5 pb-8 max-w-5xl mx-auto">
        <AdSlot className="h-24" />
      </div>

      {/* AP Chemistry */}
      <section id="ap-chem" className="px-5 py-16 bg-gradient-to-br from-blue-950/60 to-slate-950 border-y border-blue-800/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-blue-400 font-semibold text-xs mb-2 uppercase tracking-widest">AP Chemistry</div>
          <h2 className="text-3xl font-bold mb-2">Aligned to the AP Chem Exam</h2>
          <p className="text-gray-400 mb-8 max-w-2xl">
            Every tool maps to a specific AP Chemistry Big Idea and Unit. Use them alongside your textbook (Zumdahl / Brown / Chang) to build real conceptual understanding — not just memorization.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {AP_UNITS.map(u => (
              <div key={u.unit} className="bg-blue-900/20 border border-blue-700/25 rounded-xl p-4">
                <div className="text-blue-400 text-xs font-bold mb-1">{u.unit}</div>
                <div className="font-semibold text-sm mb-2">{u.name}</div>
                <div className="flex flex-wrap gap-1">
                  {u.tools.map(t => (
                    <span key={t} className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IChO */}
      <section id="icho" className="px-5 py-16 bg-gradient-to-br from-yellow-950/40 to-slate-950 border-b border-yellow-800/20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <div className="text-yellow-400 font-semibold text-xs mb-2 uppercase tracking-widest">International Chemistry Olympiad</div>
            <h2 className="text-3xl font-bold mb-3">IChO-Level Problem Support</h2>
            <p className="text-gray-400 mb-5 leading-relaxed">
              The simulators go beyond AP level — coordination chemistry, crystal field theory, radial probability density, and advanced thermodynamics are all IChO exam topics. Use these to build the deep intuition that Olympiad problems demand.
            </p>
            <Link href="/labs/coordination" className="inline-flex items-center gap-2 bg-yellow-600/80 hover:bg-yellow-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
              Open Crystal Field Lab →
            </Link>
          </div>
          <div className="md:w-64 shrink-0">
            <div className="bg-yellow-900/20 border border-yellow-700/25 rounded-2xl p-5">
              <div className="text-yellow-400 text-xs font-bold mb-3 uppercase tracking-wide">IChO Topics Covered</div>
              <ul className="space-y-2">
                {ICHO_TOPICS.map(t => (
                  <li key={t} className="flex items-start gap-2 text-xs text-gray-300">
                    <span className="text-yellow-500 mt-0.5 shrink-0">✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* All Tools */}
      <section id="tools" className="px-5 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">All Free Chemistry Tools</h2>
          <p className="text-gray-400">Click any tool — no login, no signup required</p>
        </div>

        <div className="space-y-10">
          {TOOL_CATEGORIES.map(cat => (
            <div key={cat.id}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: cat.color }} />
                <h3 className="font-bold text-lg">{cat.label}</h3>
              </div>
              <div className={`rounded-2xl border ${cat.border} bg-gradient-to-br ${cat.gradient} p-1`}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-1">
                  {cat.tools.map(tool => (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      className="group bg-black/30 hover:bg-black/50 rounded-xl p-4 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4 className="font-semibold text-sm leading-tight">{tool.name}</h4>
                        {tool.badge && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 border ${tool.badgeColor}`}>
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs leading-relaxed mb-2">{tool.desc}</p>
                      <div className="text-[10px] font-medium text-gray-500">{tool.tag}</div>
                    </Link>
                  ))}
                </div>
              </div>
              <AdSlot className="h-16 mt-3" />
            </div>
          ))}
        </div>
      </section>

      {/* Why Free */}
      <section className="px-5 py-16 bg-white/[0.02] border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Why Is Everything Free?</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            TheChemSolver is supported by non-intrusive display ads. You get full access to every tool, every simulation, every calculator — free forever.
            No freemium. No paywalled features. No account required.
          </p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            {[
              { icon: '🔓', label: 'No Login Required', desc: 'Open any tool and start immediately' },
              { icon: '♾️', label: 'Unlimited Use', desc: 'No daily limits or usage caps' },
              { icon: '📱', label: 'Works on Mobile', desc: 'Fully responsive on any device' },
            ].map(f => (
              <div key={f.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-2xl mb-1.5">{f.icon}</div>
                <div className="font-semibold text-xs mb-1">{f.label}</div>
                <div className="text-gray-500 text-xs">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-20 text-center">
        <h2 className="text-3xl font-bold mb-3">Start With Any Tool</h2>
        <p className="text-gray-400 mb-8">No account. No subscription. Just chemistry.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { label: 'IUPAC Namer ⚗️', href: '/labs/nomenclature', bg: 'bg-purple-700 hover:bg-purple-600' },
            { label: 'Titration Simulator 🧪', href: '/labs/titration', bg: 'bg-blue-700 hover:bg-blue-600' },
            { label: 'VSEPR Lab 🔬', href: '/labs/vsepr', bg: 'bg-green-700 hover:bg-green-600' },
            { label: 'Kinetics Simulator 📈', href: '/labs/kinetics', bg: 'bg-orange-700 hover:bg-orange-600' },
            { label: 'Quantum Orbitals ⚛️', href: '/labs/quantum', bg: 'bg-cyan-700 hover:bg-cyan-600' },
          ].map(b => (
            <Link key={b.label} href={b.href} className={`${b.bg} text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm`}>
              {b.label}
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
