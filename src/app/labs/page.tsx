import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'All Chemistry Tools — TheChemSolver',
  description: 'Free chemistry tools and virtual labs for AP Chemistry, Organic Chemistry, and IChO. Titration, equilibrium, VSEPR, IUPAC, kinetics, quantum, and more.',
}

const ALL_TOOLS = [
  { name: 'IUPAC Nomenclature Engine', slug: 'nomenclature', cat: 'Organic', tag: 'Orgo 1 & 2 · AP Unit 1', color: '#a855f7' },
  { name: 'Hydrocarbon Structure Builder', slug: 'hydrocarbon', cat: 'Organic', tag: 'Orgo 1 · AP Unit 1', color: '#a855f7' },
  { name: 'Titration Curve Simulator', slug: 'titration', cat: 'Physical', tag: 'AP Unit 8 · IChO', color: '#3b82f6' },
  { name: 'Chemical Equilibrium Lab', slug: 'equilibrium', cat: 'Physical', tag: 'AP Unit 7 · IChO', color: '#3b82f6' },
  { name: 'Ionic Equilibrium & Buffers', slug: 'ionic-equilibrium', cat: 'Physical', tag: 'AP Unit 8 · IChO', color: '#3b82f6' },
  { name: 'Reaction Kinetics Simulator', slug: 'kinetics', cat: 'Physical', tag: 'AP Unit 5 · IChO', color: '#3b82f6' },
  { name: 'Thermodynamics Calculator', slug: 'thermodynamics', cat: 'Physical', tag: 'AP Unit 9 · IChO', color: '#3b82f6' },
  { name: 'Electrochemical Cell Simulator', slug: 'electrochemical-potentials', cat: 'Electrochemistry', tag: 'AP Unit 9 · IChO', color: '#f97316' },
  { name: 'Coordination Chemistry & Crystal Field', slug: 'coordination', cat: 'Inorganic', tag: 'IChO', color: '#f97316' },
  { name: 'Nuclear Decay Simulator', slug: 'nuclear-decay', cat: 'Nuclear', tag: 'AP Unit 1 · IChO', color: '#f97316' },
  { name: 'Quantum Number Explorer', slug: 'quantum', cat: 'Quantum', tag: 'AP Unit 1 · IChO', color: '#06b6d4' },
  { name: 'Radial Probability Density', slug: 'radial-probability', cat: 'Quantum', tag: 'IChO', color: '#06b6d4' },
  { name: 'Atomic Spectra & Energy Levels', slug: 'atomic-evolution', cat: 'Quantum', tag: 'AP Unit 1 · IChO', color: '#06b6d4' },
  { name: 'VSEPR & Molecular Geometry', slug: 'vsepr', cat: 'Molecular', tag: 'AP Unit 2 · IChO', color: '#22c55e' },
]

export default function USLabsPage() {
  return (
    <div className="max-w-5xl mx-auto px-5 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">All Free Chemistry Tools</h1>
        <p className="text-gray-400">Every tool is free — no login, no account required</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {ALL_TOOLS.map(tool => (
          <Link
            key={tool.slug}
            href={`/labs/${tool.slug}`}
            className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-4 transition-all"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: tool.color }} />
              <span className="text-xs text-gray-500">{tool.cat}</span>
            </div>
            <h3 className="font-semibold text-sm mb-1 group-hover:text-white transition-colors">{tool.name}</h3>
            <div className="text-xs text-gray-500">{tool.tag}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
