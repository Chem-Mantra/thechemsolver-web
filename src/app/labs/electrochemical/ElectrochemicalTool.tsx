'use client'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'

const CELLS = [
  { name: 'Galvanic (Voltaic)', anode: 'Zn → Zn²⁺ + 2e⁻', cathode: 'Cu²⁺ + 2e⁻ → Cu', emf: '+1.10 V', spontaneous: true },
  { name: 'Electrolytic',       anode: '2Cl⁻ → Cl₂ + 2e⁻', cathode: '2H₂O + 2e⁻ → H₂ + 2OH⁻', emf: '-1.36 V', spontaneous: false },
]

export default function ElectrochemicalCellSimulator() {
  const [cellType, setCellType] = useState(0)
  const [concentration, setConcentration] = useState(50)

  const cell = CELLS[cellType]
  const nernstE = (parseFloat(cell.emf) - (0.0592 / 2) * Math.log10(Math.pow(concentration / 50, 2))).toFixed(3)

  return (
    <div className="bg-background text-on-surface min-h-screen hex-bg">
      <div className="fixed inset-0 pointer-events-none opacity-40 hex-bg z-0" aria-hidden="true" />
      <div className="scan-line pointer-events-none fixed inset-0 z-0" aria-hidden="true" />

      <header className="fixed top-0 w-full z-50 bg-surface-dim/80 backdrop-blur-xl border-b border-primary/20 flex justify-between items-center px-4 md:px-margin-desktop py-4"
        style={{ boxShadow: '0 0 20px rgba(0,242,255,0.1)' }} aria-label="Electrochemical cell navigation">
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" className="font-bold text-primary-container tracking-tighter" style={{ fontFamily: 'var(--font-sora)', fontSize: '18px' }}>CHEM MANTRA</Link>
          <nav className="hidden md:flex gap-5" aria-label="Lab sections">
            {['Modules','Simulations','Analytics'].map((l, i) => (
              <Link key={l} href="#" className={`font-label-sm text-sm transition-colors ${i === 1 ? 'text-primary-fixed-dim border-b-2 border-primary-fixed-dim pb-1' : 'text-on-surface-variant hover:text-primary'}`}>{l}</Link>
            ))}
          </nav>
        </div>
        <div className="flex gap-3">
          <motion.button type="button" className="px-4 py-2 bg-primary-container text-on-primary font-bold text-sm rounded-lg"
            style={{ boxShadow: '0 0 15px rgba(0,219,231,0.3)' }} whileTap={{ scale: 0.96 }}>
            Run Cell
          </motion.button>
        </div>
      </header>

      <main className="relative z-10 pt-24 px-4 md:px-8 pb-12 max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary-container" style={{ fontFamily: 'var(--font-sora)' }}>
            Advanced Electrochemical Cell Simulator
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">Galvanic vs Electrolytic cell analysis</p>
        </div>

        {/* Cell type selector */}
        <div className="flex gap-3">
          {CELLS.map(({ name }, i) => (
            <motion.button key={name} type="button" onClick={() => setCellType(i)}
              className={`px-5 py-2.5 rounded-lg font-label-sm text-xs uppercase transition-all ${i === cellType ? 'bg-primary-container text-on-primary' : 'glass-panel text-on-surface-variant border border-white/10 hover:border-primary-container/30'}`}
              whileTap={{ scale: 0.96 }}>
              {name}
            </motion.button>
          ))}
        </div>

        {/* Cell diagram */}
        <div className="glass-panel p-5 md:p-8 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6">
            <div className="text-center">
              <div className="text-[10px] text-on-surface-variant uppercase font-label-sm mb-2">ANODE (Oxidation)</div>
              <div className="glass-panel rounded-xl p-4 border border-saffron-500/30 bg-saffron-500/5">
                <div className="font-mono text-saffron-500 text-sm mb-1" style={{ fontFamily: 'var(--font-space-mono)' }}>{cell.anode}</div>
                <div className="text-[10px] text-on-surface-variant mt-2">Electrons flow OUT</div>
              </div>
            </div>
            <div className="text-center flex flex-col items-center justify-center gap-3">
              <div className={`text-3xl font-bold ${cell.spontaneous ? 'text-primary-container' : 'text-error'}`}
                style={{ fontFamily: 'var(--font-sora)' }}>
                E°cell = {cell.emf}
              </div>
              <div className={`text-[11px] px-3 py-1 rounded-full border font-label-sm ${cell.spontaneous ? 'text-primary-container border-primary-container/30 bg-primary-container/10' : 'text-error border-error/30 bg-error/10'}`}>
                {cell.spontaneous ? '✓ SPONTANEOUS' : '✗ NON-SPONTANEOUS'}
              </div>
              <div className="font-mono text-sm text-on-surface-variant">
                E(Nernst) = <span className="text-primary-container">{nernstE} V</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-on-surface-variant uppercase font-label-sm mb-2">CATHODE (Reduction)</div>
              <div className="glass-panel rounded-xl p-4 border border-primary-container/30 bg-primary-container/5">
                <div className="font-mono text-primary-container text-sm mb-1" style={{ fontFamily: 'var(--font-space-mono)' }}>{cell.cathode}</div>
                <div className="text-[10px] text-on-surface-variant mt-2">Electrons flow IN</div>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-5 border-t border-white/10">
            <div className="flex justify-between">
              <label className="text-on-surface-variant text-sm">Ion Concentration Ratio</label>
              <span className="text-primary-container font-mono text-sm">{concentration}%</span>
            </div>
            <input type="range" min="1" max="100" value={concentration} onChange={e => setConcentration(Number(e.target.value))} className="w-full" aria-label="Ion concentration ratio" />
          </div>
        </div>

        {/* Key equations */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Nernst Equation', eq: 'E = E° - (RT/nF)lnQ' },
            { label: 'ΔG relation',      eq: 'ΔG = -nFE' },
            { label: 'Faraday const.',   eq: 'F = 96485 C/mol' },
            { label: 'Standard cond.',   eq: '25°C, 1M, 1 atm' },
          ].map(({ label, eq }) => (
            <div key={label} className="glass-panel rounded-xl p-4">
              <div className="text-[10px] text-on-surface-variant uppercase font-label-sm mb-2">{label}</div>
              <div className="font-mono text-primary-container text-[11px]" style={{ fontFamily: 'var(--font-space-mono)' }}>{eq}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
