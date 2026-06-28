'use client'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'

const HYBRIDS = [
  { type: 'sp³', eg: 'CH₄, NH₃, H₂O', angle: '109.5°', geometry: 'Tetrahedral', orbitals: '1s + 3p', lp: 0, color: 'text-primary-container' },
  { type: 'sp²', eg: 'C₂H₄, BF₃, SO₃', angle: '120°', geometry: 'Trigonal Planar', orbitals: '1s + 2p', lp: 0, color: 'text-secondary' },
  { type: 'sp',  eg: 'C₂H₂, CO₂, HCN', angle: '180°', geometry: 'Linear', orbitals: '1s + 1p', lp: 0, color: 'text-saffron-500' },
  { type: 'sp³d', eg: 'PCl₅, SF₄', angle: '90°/120°', geometry: 'Trigonal Bipyramidal', orbitals: '1s + 3p + 1d', lp: 0, color: 'text-tertiary-fixed-dim' },
  { type: 'sp³d²', eg: 'SF₆, [Fe(CN)₆]³⁻', angle: '90°', geometry: 'Octahedral', orbitals: '1s + 3p + 2d', lp: 0, color: 'text-primary-container' },
]

export default function InteractiveHybridizationLab() {
  const [active, setActive] = useState('sp³')
  const hyb = HYBRIDS.find(h => h.type === active)!

  return (
    <div className="bg-background text-on-surface min-h-screen hex-bg">
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-margin-desktop h-16 bg-surface-dim/80 backdrop-blur-xl border-b border-primary/20"
        style={{ boxShadow: '0 0 20px rgba(0,242,255,0.15)' }} aria-label="Hybridization lab navigation">
        <div className="flex items-center gap-5">
          <Link href="/" className="font-bold tracking-tighter text-primary-container" style={{ fontFamily: 'var(--font-sora)', fontSize: '15px' }}>CHEM MANTRA | HYBRID_LAB</Link>
          <nav className="hidden md:flex items-center gap-5" aria-label="Lab sections">
            {['Lab Console','Atomic Models','Spectroscopy','Session Logs'].map((l, i) => (
              <Link key={l} href="#" className={`font-label-sm text-[11px] transition-colors ${i === 2 ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}>{l}</Link>
            ))}
          </nav>
        </div>
        <motion.button type="button" className="px-4 py-2 bg-primary-container text-on-primary font-bold text-xs rounded-lg"
          whileTap={{ scale: 0.96 }}>Visualize 3D</motion.button>
      </header>

      <main className="pt-24 px-4 md:px-8 pb-12 max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary-container" style={{ fontFamily: 'var(--font-sora)' }}>Interactive Hybridization Lab</h1>
          <p className="text-on-surface-variant text-sm mt-1">Orbital mixing, geometry prediction, and VSEPR theory</p>
        </div>

        {/* Hybridization types */}
        <div className="flex gap-2 md:gap-3 flex-wrap">
          {HYBRIDS.map(({ type, color }) => (
            <motion.button key={type} type="button" onClick={() => setActive(type)}
              className={`px-5 py-2.5 rounded-lg font-mono font-bold text-sm transition-all ${type === active ? 'bg-primary-container text-on-primary' : `glass-panel ${color} border border-current/30 hover:border-current/60`}`}
              whileTap={{ scale: 0.96 }}>
              {type}
            </motion.button>
          ))}
        </div>

        {/* Active hybrid detail */}
        <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass-panel p-5 md:p-8 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <h2 className="font-bold text-on-surface text-2xl mb-4" style={{ fontFamily: 'var(--font-sora)' }}>{hyb.type} Hybridization</h2>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: 'Bond Angle', value: hyb.angle },
                    { label: 'Geometry', value: hyb.geometry },
                    { label: 'Orbitals Mixed', value: hyb.orbitals },
                    { label: 'Examples', value: hyb.eg },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-surface-container/40 rounded-xl p-3">
                      <div className="text-[10px] text-on-surface-variant uppercase font-label-sm mb-1">{label}</div>
                      <div className="font-bold text-on-surface text-sm" style={{ fontFamily: 'var(--font-sora)' }}>{value}</div>
                    </div>
                  ))}
                </div>
                <div className="glass-panel rounded-lg p-4 border border-primary-container/20">
                  <div className="text-[10px] text-on-surface-variant uppercase font-label-sm mb-2">Formation</div>
                  <div className="font-mono text-primary-container text-sm" style={{ fontFamily: 'var(--font-space-mono)' }}>
                    {hyb.type} = {hyb.orbitals} → {hyb.type === 'sp³' ? '4 equivalent orbitals' : hyb.type === 'sp²' ? '3 eq. + 1 unhybridized p' : hyb.type === 'sp' ? '2 eq. + 2 unhybridized p' : 'mixed set'}
                  </div>
                </div>
              </div>

              {/* Geometry visualization */}
              <div className="flex items-center justify-center glass-panel rounded-xl border border-primary-container/20 min-h-56">
                <svg viewBox="0 0 200 200" className="w-full max-w-48" aria-label={`${hyb.geometry} geometry for ${hyb.type}`}>
                  <circle cx="100" cy="100" r="8" fill="#00dbe7" />
                  {hyb.type === 'sp³' && [0,90,180,270].map((angle, i) => {
                    const r = 55; const rad = (angle * Math.PI) / 180
                    return <g key={i}>
                      <line x1="100" y1="100" x2={100+r*Math.cos(rad)} y2={100+r*Math.sin(rad)} stroke="#00dbe7" strokeWidth="2" opacity="0.6" />
                      <circle cx={100+r*Math.cos(rad)} cy={100+r*Math.sin(rad)} r="6" fill="#f97316" />
                    </g>
                  })}
                  {hyb.type === 'sp²' && [270,30,150].map((angle, i) => {
                    const r = 60; const rad = (angle * Math.PI) / 180
                    return <g key={i}>
                      <line x1="100" y1="100" x2={100+r*Math.cos(rad)} y2={100+r*Math.sin(rad)} stroke="#00dbe7" strokeWidth="2" opacity="0.6" />
                      <circle cx={100+r*Math.cos(rad)} cy={100+r*Math.sin(rad)} r="6" fill="#8b5cf6" />
                    </g>
                  })}
                  {hyb.type === 'sp' && [0,180].map((angle, i) => {
                    const r = 65; const rad = (angle * Math.PI) / 180
                    return <g key={i}>
                      <line x1="100" y1="100" x2={100+r*Math.cos(rad)} y2={100+r*Math.sin(rad)} stroke="#00dbe7" strokeWidth="2.5" opacity="0.7" />
                      <circle cx={100+r*Math.cos(rad)} cy={100+r*Math.sin(rad)} r="6" fill="#f97316" />
                    </g>
                  })}
                  {(hyb.type === 'sp³d' || hyb.type === 'sp³d²') && [0,72,144,216,288].map((angle, i) => {
                    const r = 55; const rad = (angle * Math.PI) / 180
                    return <g key={i}>
                      <line x1="100" y1="100" x2={100+r*Math.cos(rad)} y2={100+r*Math.sin(rad)} stroke="#00dbe7" strokeWidth="1.5" opacity="0.6" />
                      <circle cx={100+r*Math.cos(rad)} cy={100+r*Math.sin(rad)} r="5" fill="#e9c400" />
                    </g>
                  })}
                  <text x="100" y="185" textAnchor="middle" fill="#b9cacb" fontSize="11" fontFamily="var(--font-space-mono)">{hyb.geometry}</text>
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
