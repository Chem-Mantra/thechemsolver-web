import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'All Chemistry Tools — TheChemSolver',
  description: 'Free chemistry tools and virtual labs for AP Chemistry, Organic Chemistry, and IChO. Titration, equilibrium, VSEPR, IUPAC, kinetics, quantum, and more.',
  alternates: { canonical: 'https://www.thechemsolver.com/labs' },
}

const ALL_TOOLS = [
  // Organic Chemistry
  { name: 'IUPAC Nomenclature Engine', slug: 'nomenclature', cat: 'Organic', tag: 'AP Unit 1 · IChO', color: '#a855f7' },
  { name: 'Hydrocarbon Structure Builder', slug: 'hydrocarbon', cat: 'Organic', tag: 'AP Unit 1 · Orgo 1', color: '#a855f7' },
  { name: 'SN1 / SN2 / E1 / E2 Predictor', slug: 'sn1-sn2-e1-e2', cat: 'Organic', tag: 'AP · Orgo 2 · IChO', color: '#a855f7' },
  { name: 'Organic Reaction Mechanisms', slug: 'organic-mechanism', cat: 'Organic', tag: 'AP · Orgo 2 · IChO', color: '#a855f7' },
  { name: '3D Reaction Mechanism Viewer', slug: 'mechanisms', cat: 'Organic', tag: 'AP · Orgo 2 · IChO', color: '#a855f7' },
  { name: 'Organic Synthesis Pathways', slug: 'organic-synthesis', cat: 'Organic', tag: 'IChO · Orgo 2', color: '#a855f7' },
  { name: 'Stereochemistry & R/S Solver', slug: 'stereochemistry', cat: 'Organic', tag: 'AP · IChO · Orgo 2', color: '#a855f7' },
  { name: 'Projection Formula Lab', slug: 'projection-formula', cat: 'Organic', tag: 'AP · IChO', color: '#a855f7' },
  { name: '¹H NMR Predictor', slug: 'nmr-predictor', cat: 'Organic', tag: 'AP · Orgo 2 · IChO', color: '#a855f7' },
  { name: 'Mass Spectrometry Simulator', slug: 'mass-spec', cat: 'Organic', tag: 'AP · IChO', color: '#a855f7' },
  // Physical Chemistry
  { name: 'Gas Laws Simulator', slug: 'gas-laws', cat: 'Physical', tag: 'AP Unit 3 · IChO', color: '#3b82f6' },
  { name: 'Colligative Properties', slug: 'colligative-properties', cat: 'Physical', tag: 'AP Unit 3 · IChO', color: '#3b82f6' },
  { name: 'Phase Diagram Explorer', slug: 'phase-diagram', cat: 'Physical', tag: 'AP Unit 3 · IChO', color: '#3b82f6' },
  { name: 'Chemical Equilibrium Lab', slug: 'equilibrium', cat: 'Physical', tag: 'AP Unit 7 · IChO', color: '#3b82f6' },
  { name: 'Ionic Equilibrium & Buffers', slug: 'ionic-equilibrium', cat: 'Physical', tag: 'AP Unit 8 · IChO', color: '#3b82f6' },
  { name: 'Titration Curve Simulator', slug: 'titration', cat: 'Physical', tag: 'AP Unit 8 · IChO', color: '#3b82f6' },
  { name: 'Reaction Kinetics Simulator', slug: 'kinetics', cat: 'Physical', tag: 'AP Unit 5 · IChO', color: '#3b82f6' },
  { name: 'Thermodynamics Calculator', slug: 'thermodynamics', cat: 'Physical', tag: 'AP Unit 9 · IChO', color: '#3b82f6' },
  { name: 'Calorimetry Lab', slug: 'calorimetry', cat: 'Physical', tag: 'AP Unit 6 · IChO', color: '#3b82f6' },
  { name: "Hess's Law Builder", slug: 'hess-law', cat: 'Physical', tag: 'AP Unit 6 · IChO', color: '#3b82f6' },
  { name: 'Bond Energy Calculator', slug: 'bond-energy', cat: 'Physical', tag: 'AP Unit 2 · IChO', color: '#3b82f6' },
  { name: 'Enthalpy Diagram Plotter', slug: 'enthalpy-diagram', cat: 'Physical', tag: 'AP Unit 5 & 6', color: '#3b82f6' },
  { name: 'Beer-Lambert Law Lab', slug: 'beer-lambert', cat: 'Physical', tag: 'AP Unit 3 · IChO', color: '#3b82f6' },
  { name: 'Chromatography Simulator', slug: 'chromatography', cat: 'Physical', tag: 'AP Unit 3', color: '#3b82f6' },
  // Electrochemistry
  { name: 'Electrochemical Cell Simulator', slug: 'electrochemical-potentials', cat: 'Electrochemistry', tag: 'AP Unit 9 · IChO', color: '#f97316' },
  { name: 'Electrolytic Cell Simulator', slug: 'electrolytic-cell', cat: 'Electrochemistry', tag: 'AP Unit 9 · IChO', color: '#f97316' },
  { name: 'Electrochemistry Simulator', slug: 'electrochemistry', cat: 'Electrochemistry', tag: 'AP Unit 9 · IChO', color: '#f97316' },
  { name: 'Electrochemical Cell Lab', slug: 'electrochemical', cat: 'Electrochemistry', tag: 'AP Unit 9 · IChO', color: '#f97316' },
  // Stoichiometry / Reactions
  { name: 'Stoichiometry Mapper', slug: 'stoichiometry-mapper', cat: 'Stoichiometry', tag: 'AP Unit 4', color: '#f97316' },
  { name: 'Limiting Reagent Visualizer', slug: 'limiting-reagent', cat: 'Stoichiometry', tag: 'AP Unit 4', color: '#f97316' },
  { name: 'Reaction Type Classifier', slug: 'reaction-classifier', cat: 'Stoichiometry', tag: 'AP Unit 4', color: '#f97316' },
  { name: 'Net Ionic Equation Builder', slug: 'net-ionic-equation', cat: 'Stoichiometry', tag: 'AP Unit 4 & 8', color: '#f97316' },
  // Inorganic / Molecular
  { name: 'VSEPR & Molecular Geometry', slug: 'vsepr', cat: 'Molecular', tag: 'AP Unit 2 · IChO', color: '#22c55e' },
  { name: 'Hybridization Explorer', slug: 'hybridization', cat: 'Molecular', tag: 'AP Unit 2 · IChO', color: '#22c55e' },
  { name: 'Lewis Structure Builder', slug: 'lewis-structure', cat: 'Molecular', tag: 'AP Unit 2 · IChO', color: '#22c55e' },
  { name: 'Bond Polarity Visualizer', slug: 'bond-polarity', cat: 'Molecular', tag: 'AP Unit 2 · IChO', color: '#22c55e' },
  { name: 'IMF Comparator', slug: 'imf-comparator', cat: 'Molecular', tag: 'AP Unit 3 · IChO', color: '#22c55e' },
  { name: 'MO Diagram Builder', slug: 'mo-diagram', cat: 'Molecular', tag: 'AP · IChO', color: '#22c55e' },
  { name: 'Unit Cell & Crystal Structure', slug: 'unit-cell', cat: 'Inorganic', tag: 'AP Unit 2 · IChO', color: '#22c55e' },
  { name: 'Coordination Chemistry & Crystal Field', slug: 'coordination', cat: 'Inorganic', tag: 'IChO', color: '#22c55e' },
  { name: 'Crystal Field Theory', slug: 'crystal-field', cat: 'Inorganic', tag: 'IChO', color: '#22c55e' },
  { name: 'Interactive Periodic Table', slug: 'periodic-table', cat: 'Inorganic', tag: 'AP Unit 1 · IChO', color: '#22c55e' },
  { name: 'Periodic Properties Simulator', slug: 'periodic', cat: 'Inorganic', tag: 'AP Unit 1 · IChO', color: '#22c55e' },
  // Quantum & Nuclear
  { name: 'Quantum Number Explorer', slug: 'quantum', cat: 'Quantum', tag: 'AP Unit 1 · IChO', color: '#06b6d4' },
  { name: 'Electron Configuration Builder', slug: 'electron-config', cat: 'Quantum', tag: 'AP Unit 1 · IChO', color: '#06b6d4' },
  { name: 'Radial Probability Density', slug: 'radial-probability', cat: 'Quantum', tag: 'IChO', color: '#06b6d4' },
  { name: 'Photoelectric Effect Simulator', slug: 'photoelectric-effect', cat: 'Quantum', tag: 'AP Unit 1 · IChO', color: '#06b6d4' },
  { name: 'Hydrogen Emission Spectrum', slug: 'h-emission-spectrum', cat: 'Quantum', tag: 'AP Unit 1 · IChO', color: '#06b6d4' },
  { name: 'Atomic Spectra & Energy Levels', slug: 'atomic-evolution', cat: 'Quantum', tag: 'AP Unit 1 · IChO', color: '#06b6d4' },
  { name: 'PES Spectrum Reader', slug: 'pes-spectrum', cat: 'Quantum', tag: 'AP Unit 1', color: '#06b6d4' },
  { name: 'Isotope Mass Spectrometer', slug: 'isotope-mass-spec', cat: 'Quantum', tag: 'AP Unit 1 · IChO', color: '#06b6d4' },
  { name: 'Nuclear Decay Simulator', slug: 'nuclear-decay', cat: 'Nuclear', tag: 'AP Unit 1 · IChO', color: '#06b6d4' },
]

export default function USLabsPage() {
  return (
    <div className="max-w-5xl mx-auto px-5 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Chemistry Tools &amp; Virtual Labs</h1>
        <p className="text-gray-400">15-day free trial on interactive labs · then $15/year full access</p>
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
