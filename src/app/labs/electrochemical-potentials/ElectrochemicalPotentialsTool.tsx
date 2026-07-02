'use client'
import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

// ── Standard reduction potentials (V) ─────────────────────────
const HALF_CELLS = [
  { id: 'F2',   label: 'F₂/F⁻',          E0:  2.87, ox: 'F₂',  red: 'F⁻',  color: '#f97316' },
  { id: 'Au',   label: 'Au³⁺/Au',         E0:  1.50, ox: 'Au³⁺', red: 'Au', color: '#eab308' },
  { id: 'Cl2',  label: 'Cl₂/Cl⁻',         E0:  1.36, ox: 'Cl₂', red: 'Cl⁻', color: '#a3e635' },
  { id: 'O2',   label: 'O₂/H₂O (acid)',   E0:  1.23, ox: 'O₂',  red: 'H₂O', color: '#4ade80' },
  { id: 'Br2',  label: 'Br₂/Br⁻',         E0:  1.07, ox: 'Br₂', red: 'Br⁻', color: '#fb923c' },
  { id: 'Ag',   label: 'Ag⁺/Ag',          E0:  0.80, ox: 'Ag⁺', red: 'Ag',  color: '#d1d5db' },
  { id: 'Fe3',  label: 'Fe³⁺/Fe²⁺',       E0:  0.77, ox: 'Fe³⁺',red: 'Fe²⁺',color: '#f97316' },
  { id: 'Cu',   label: 'Cu²⁺/Cu',         E0:  0.34, ox: 'Cu²⁺',red: 'Cu',  color: '#fb923c' },
  { id: 'SHE',  label: 'H⁺/H₂ (SHE)',     E0:  0.00, ox: 'H⁺',  red: 'H₂',  color: '#a3e635' },
  { id: 'Pb',   label: 'Pb²⁺/Pb',         E0: -0.13, ox: 'Pb²⁺',red: 'Pb',  color: '#9ca3af' },
  { id: 'Ni',   label: 'Ni²⁺/Ni',         E0: -0.25, ox: 'Ni²⁺',red: 'Ni',  color: '#6ee7b7' },
  { id: 'Fe',   label: 'Fe²⁺/Fe',         E0: -0.44, ox: 'Fe²⁺',red: 'Fe',  color: '#f97316' },
  { id: 'Zn',   label: 'Zn²⁺/Zn',         E0: -0.76, ox: 'Zn²⁺',red: 'Zn',  color: '#93c5fd' },
  { id: 'Al',   label: 'Al³⁺/Al',         E0: -1.66, ox: 'Al³⁺',red: 'Al',  color: '#c4b5fd' },
  { id: 'Mg',   label: 'Mg²⁺/Mg',         E0: -2.37, ox: 'Mg²⁺',red: 'Mg',  color: '#f0abfc' },
  { id: 'Na',   label: 'Na⁺/Na',          E0: -2.71, ox: 'Na⁺', red: 'Na',  color: '#fbbf24' },
  { id: 'Li',   label: 'Li⁺/Li',          E0: -3.04, ox: 'Li⁺', red: 'Li',  color: '#fb7185' },
]

// ── Nernst equation: E = E° - (RT/nF)·ln Q ──────────────────
function nernst(E0cell: number, n: number, T: number, Q: number): number {
  if (Q <= 0) return E0cell
  const R = 8.314, F = 96485
  return E0cell - (R * T) / (n * F) * Math.log(Q)
}

function deltaG(E: number, n: number): number {
  return -n * 96485 * E  // J/mol
}

function equilibriumConstant(E0: number, n: number, T: number): number {
  const R = 8.314, F = 96485
  return Math.exp((n * F * E0) / (R * T))
}

// ── Animated Galvanic Cell ────────────────────────────────────
function GalvanicCellViz({
  anodeLabel, cathodeLabel, emf, isRunning
}: { anodeLabel: string; cathodeLabel: string; emf: number; isRunning: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const electronsRef = useRef<Array<{ x: number; y: number; progress: number; speed: number }>>([])
  const ionsRef = useRef<Array<{ x: number; y: number; vy: number; type: 'cat' | 'an' }>>([])

  useEffect(() => {
    // Initialize electrons on the wire
    electronsRef.current = Array.from({ length: 6 }, (_, i) => ({
      x: 0, y: 0, progress: i / 6, speed: 0.004 + Math.random() * 0.002
    }))
    ionsRef.current = Array.from({ length: 8 }, (_, i) => ({
      x: i % 2 === 0 ? 130 + Math.random() * 40 : 190 + Math.random() * 40,
      y: 120 + Math.random() * 60,
      vy: (Math.random() - 0.5) * 0.5,
      type: i % 2 === 0 ? 'cat' : 'an'
    }))
  }, [anodeLabel, cathodeLabel])

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.width, H = canvas.height

    const wirePath = [
      [60, 40], [W - 60, 40]
    ]

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Beaker / solution
      ctx.fillStyle = 'rgba(0,219,231,0.06)'
      ctx.fillRect(20, 80, W - 40, H - 100)
      ctx.strokeStyle = 'rgba(0,219,231,0.3)'
      ctx.lineWidth = 1.5
      ctx.strokeRect(20, 80, W - 40, H - 100)

      // Salt bridge
      ctx.fillStyle = 'rgba(139,92,246,0.25)'
      ctx.fillRect(W / 2 - 20, 80, 40, H - 100)
      ctx.strokeStyle = 'rgba(139,92,246,0.5)'
      ctx.lineWidth = 1
      ctx.strokeRect(W / 2 - 20, 80, 40, H - 100)
      ctx.font = '9px monospace'; ctx.fillStyle = 'rgba(139,92,246,0.9)'
      ctx.textAlign = 'center'
      ctx.fillText('Salt', W / 2, H / 2 - 5)
      ctx.fillText('Bridge', W / 2, H / 2 + 8)

      // Anode (left electrode)
      ctx.fillStyle = '#ef4444'
      ctx.fillRect(45, 85, 14, H - 110)
      ctx.font = 'bold 10px var(--font-sora, sans-serif)'; ctx.fillStyle = '#ef4444'
      ctx.textAlign = 'center'
      ctx.fillText('−', 52, 75)
      ctx.fillText('ANODE', 52, H - 10)
      ctx.font = '9px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.6)'
      ctx.fillText(anodeLabel, 52, H - 0)

      // Cathode (right electrode)
      ctx.fillStyle = '#06b6d4'
      ctx.fillRect(W - 59, 85, 14, H - 110)
      ctx.font = 'bold 10px var(--font-sora, sans-serif)'; ctx.fillStyle = '#06b6d4'
      ctx.textAlign = 'center'
      ctx.fillText('+', W - 52, 75)
      ctx.fillText('CATHODE', W - 52, H - 10)
      ctx.font = '9px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.6)'
      ctx.fillText(cathodeLabel, W - 52, H - 0)

      // Wire
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(52, 85); ctx.lineTo(52, 40)
      ctx.lineTo(W - 52, 40); ctx.lineTo(W - 52, 85)
      ctx.stroke()

      // Voltmeter
      ctx.beginPath()
      ctx.arc(W / 2, 40, 18, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(14,19,34,0.95)'; ctx.fill()
      ctx.strokeStyle = emf > 0 ? '#00dbe7' : '#ef4444'; ctx.lineWidth = 1.5; ctx.stroke()
      ctx.font = 'bold 9px monospace'; ctx.fillStyle = emf > 0 ? '#00dbe7' : '#ef4444'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(`${Math.abs(emf).toFixed(2)}V`, W / 2, 40)
      ctx.textBaseline = 'alphabetic'

      // Electrons moving on wire
      if (isRunning && emf > 0) {
        electronsRef.current.forEach(e => {
          e.progress = (e.progress + e.speed * emf) % 1
          // Wire path: up left, across top, down right
          let ex, ey
          if (e.progress < 0.15) { ex = 52; ey = 85 - (e.progress / 0.15) * 45 }
          else if (e.progress < 0.85) { const t = (e.progress - 0.15) / 0.7; ex = 52 + t * (W - 104); ey = 40 }
          else { const t = (e.progress - 0.85) / 0.15; ex = W - 52; ey = 40 + t * 45 }

          ctx.beginPath(); ctx.arc(ex, ey, 3.5, 0, Math.PI * 2)
          ctx.fillStyle = '#fbbf24'; ctx.fill()
          ctx.font = '7px monospace'; ctx.fillStyle = '#fbbf24'
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
          ctx.fillText('e⁻', ex, ey)
        })
      }

      // Ions in solution
      ionsRef.current.forEach(ion => {
        if (isRunning) { ion.y += ion.vy; if (ion.y < 85 || ion.y > H - 25) ion.vy *= -1 }
        ctx.beginPath(); ctx.arc(ion.x, ion.y, 5, 0, Math.PI * 2)
        ctx.fillStyle = ion.type === 'cat' ? 'rgba(6,182,212,0.7)' : 'rgba(239,68,68,0.7)'; ctx.fill()
        ctx.font = '7px monospace'; ctx.fillStyle = 'white'
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText(ion.type === 'cat' ? 'M⁺' : 'X⁻', ion.x, ion.y)
      })

      ctx.textBaseline = 'alphabetic'
      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [anodeLabel, cathodeLabel, emf, isRunning])

  return (
    <canvas ref={canvasRef} width={340} height={220}
      className="rounded-xl border border-white/10 w-full"
      style={{ background: 'rgba(14,19,34,0.85)', maxWidth: 340 }} />
  )
}

// ── Q vs E chart ──────────────────────────────────────────────
function generateQvsE(E0cell: number, n: number, T: number) {
  return Array.from({ length: 60 }, (_, i) => {
    const logQ = -10 + i * 0.35
    const Q = Math.pow(10, logQ)
    return { logQ, E: Number(nernst(E0cell, n, T, Q).toFixed(4)) }
  })
}

// ── Main simulator ────────────────────────────────────────────
export default function ElectrochemistrySimulator() {
  const [cathodeId, setCathodeId] = useState('Cu')
  const [anodeId,   setAnodeId]   = useState('Zn')
  const [n, setN]       = useState(2)
  const [T, setT]       = useState(298)
  const [logQ, setLogQ] = useState(0)   // log10(Q)
  const [playing, setPlaying] = useState(true)

  const cathode = HALF_CELLS.find(h => h.id === cathodeId)!
  const anode   = HALF_CELLS.find(h => h.id === anodeId)!
  const Q       = Math.pow(10, logQ)
  const E0cell  = cathode.E0 - anode.E0
  const Ecell   = nernst(E0cell, n, T, Q)
  const dG      = deltaG(Ecell, n)
  const Keq     = equilibriumConstant(E0cell, n, T)
  const spontaneous = Ecell > 0

  const qVsE = generateQvsE(E0cell, n, T)

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">

      <header className="sticky top-0 z-50 bg-surface/85 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 md:px-6 h-14"
        style={{ boxShadow: '0 0 20px rgba(0,219,231,0.08)' }}>
        <div className="flex items-center gap-3">
          <Link href="/labs" className="text-on-surface-variant hover:text-teal-300 text-sm font-medium transition-colors">← Labs</Link>
          <span className="text-white/20">|</span>
          <h1 className="font-bold text-white text-sm" style={{ fontFamily: 'var(--font-sora)' }}>
            Electrochemistry &amp; Nernst Equation Simulator
          </h1>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setPlaying(p => !p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${playing ? 'bg-teal-300/10 border-teal-300/40 text-teal-300' : 'border-white/20 text-on-surface-variant'}`}>
            {playing ? '⏸ Pause' : '▶ Play'}
          </button>
          <button type="button" onClick={() => { setCathodeId('Cu'); setAnodeId('Zn'); setN(2); setT(298); setLogQ(0) }}
            className="px-3 py-1.5 rounded-lg text-xs border border-white/20 text-on-surface-variant hover:border-white/40">
            Reset (Daniell)
          </button>
        </div>
      </header>

      <div className="flex flex-col xl:flex-row flex-1">

        {/* Controls */}
        <aside className="w-full xl:w-72 border-b xl:border-b-0 xl:border-r border-white/8 bg-surface-container-lowest/50 p-4 space-y-4 overflow-y-auto">

          {/* Electrode selection */}
          <div>
            <div className="font-label-sm text-[10px] text-teal-300 uppercase tracking-widest mb-2">Cathode (Reduction) (+)</div>
            <select value={cathodeId} onChange={e => setCathodeId(e.target.value)}
              className="w-full bg-surface-container border border-white/15 rounded-lg px-3 py-2 text-sm text-on-surface focus:border-teal-300/50 focus:outline-none">
              {HALF_CELLS.filter(h => h.id !== anodeId).map(h => (
                <option key={h.id} value={h.id}>{h.label} &nbsp; E°={h.E0.toFixed(2)}V</option>
              ))}
            </select>
          </div>

          <div>
            <div className="font-label-sm text-[10px] text-red-400 uppercase tracking-widest mb-2">Anode (Oxidation) (−)</div>
            <select value={anodeId} onChange={e => setAnodeId(e.target.value)}
              className="w-full bg-surface-container border border-white/15 rounded-lg px-3 py-2 text-sm text-on-surface focus:border-red-400/50 focus:outline-none">
              {HALF_CELLS.filter(h => h.id !== cathodeId).map(h => (
                <option key={h.id} value={h.id}>{h.label} &nbsp; E°={h.E0.toFixed(2)}V</option>
              ))}
            </select>
          </div>

          {/* n — electrons transferred */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="font-label-sm text-[10px] text-teal-300 uppercase tracking-widest">Electrons transferred (n)</span>
              <span className="font-mono text-xs text-teal-300">{n}</span>
            </div>
            <input type="range" min="1" max="6" step="1" value={n}
              onChange={e => setN(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[9px] text-on-surface-variant"><span>1e⁻</span><span>6e⁻</span></div>
          </div>

          {/* Temperature */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="font-label-sm text-[10px] text-teal-300 uppercase tracking-widest">Temperature</span>
              <span className="font-mono text-xs text-teal-300">{T} K &nbsp; ({(T - 273).toFixed(0)}°C)</span>
            </div>
            <input type="range" min="200" max="500" step="1" value={T}
              onChange={e => setT(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[9px] text-on-surface-variant"><span>200K (−73°C)</span><span>500K (227°C)</span></div>
          </div>

          {/* Reaction quotient Q */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="font-label-sm text-[10px] text-teal-300 uppercase tracking-widest">Reaction Quotient (Q)</span>
              <span className="font-mono text-xs text-teal-300">10^{logQ.toFixed(1)} = {Q.toExponential(1)}</span>
            </div>
            <input type="range" min="-10" max="10" step="0.1" value={logQ}
              onChange={e => setLogQ(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[9px] text-on-surface-variant"><span>Q=10⁻¹⁰ (product-poor)</span><span>Q=10¹⁰ (product-rich)</span></div>
          </div>

          {/* Known cell presets */}
          <div className="border-t border-white/10 pt-3">
            <div className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">Famous Cells</div>
            <div className="space-y-1">
              {[
                { name: 'Daniell Cell',  cat: 'Cu',  an: 'Zn', n: 2 },
                { name: 'Lead-Acid',     cat: 'Pb',  an: 'Fe', n: 2 },
                { name: 'Silver-Zinc',   cat: 'Ag',  an: 'Zn', n: 2 },
                { name: 'Chlorine Cell', cat: 'Cl2', an: 'Na', n: 1 },
              ].map(({ name, cat, an, n: nv }) => (
                <button key={name} type="button"
                  onClick={() => { setCathodeId(cat); setAnodeId(an); setN(nv) }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-on-surface-variant hover:bg-white/5 hover:text-teal-300 transition-colors border border-transparent hover:border-teal-300/20">
                  {name} → E°={( (HALF_CELLS.find(h=>h.id===cat)?.E0??0) - (HALF_CELLS.find(h=>h.id===an)?.E0??0) ).toFixed(2)}V
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-4 md:p-5 space-y-4 overflow-y-auto">

          {/* Top: Cell viz + EMF display + values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Animated cell */}
            <div className="glass-panel rounded-2xl p-4 flex flex-col items-center gap-3">
              <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest">
                Galvanic Cell — {playing ? 'Live' : 'Paused'}
              </span>
              <GalvanicCellViz
                anodeLabel={anode.label} cathodeLabel={cathode.label}
                emf={Ecell} isRunning={playing && spontaneous} />
              <div className="flex justify-between w-full text-[10px]">
                <span className="text-red-400">Anode: {anode.ox} → {anode.red} (oxidation)</span>
                <span className="text-teal-300">{cathode.ox} → {cathode.red} (reduction)</span>
              </div>
            </div>

            {/* EMF meter */}
            <div className="glass-panel rounded-2xl p-5 flex flex-col items-center justify-center gap-3">
              <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest">Cell EMF</span>
              <motion.div key={Ecell.toFixed(3)} className="font-black tabular-nums text-center"
                style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(40px,5vw,60px)', color: spontaneous ? '#00dbe7' : '#ef4444' }}
                animate={{ scale: [1.04, 1] }} transition={{ duration: 0.15 }}>
                {Ecell.toFixed(3)} V
              </motion.div>
              <div className={`text-sm font-bold px-3 py-1.5 rounded-full border ${spontaneous ? 'text-teal-300 border-teal-300/40 bg-teal-300/10' : 'text-red-400 border-red-400/40 bg-red-400/10'}`}>
                {spontaneous ? '✓ Spontaneous (galvanic)' : '✗ Non-spontaneous (electrolytic)'}
              </div>
              <div className="w-full glass-panel rounded-xl p-3 text-center border border-teal-300/20">
                <div className="font-label-sm text-[10px] text-on-surface-variant mb-1">Nernst Equation</div>
                <div className="font-mono text-xs text-on-surface">E = E° − (RT/nF)·ln Q</div>
                <div className="font-mono text-xs text-teal-300 mt-1">
                  E = {E0cell.toFixed(3)} − {((8.314 * T) / (n * 96485)).toFixed(5)}·ln({Q.toExponential(1)})
                </div>
                <div className="font-mono text-sm text-teal-300 font-bold mt-1">= {Ecell.toFixed(3)} V</div>
              </div>
            </div>

            {/* Calculated values */}
            <div className="glass-panel rounded-2xl p-4 space-y-2">
              <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest block mb-3">Thermodynamics</span>
              {[
                { label: 'E°cell', value: `${E0cell.toFixed(3)} V`, color: 'text-teal-300', note: 'Standard EMF' },
                { label: 'E cell', value: `${Ecell.toFixed(3)} V`, color: Ecell > 0 ? 'text-teal-300' : 'text-red-400', note: `at T=${T}K, Q=${Q.toExponential(1)}` },
                { label: 'ΔG°', value: `${(-n * 96485 * E0cell / 1000).toFixed(1)} kJ/mol`, color: E0cell > 0 ? 'text-teal-300' : 'text-red-400', note: '= −nFE°' },
                { label: 'ΔG', value: `${(dG / 1000).toFixed(1)} kJ/mol`, color: dG < 0 ? 'text-teal-300' : 'text-red-400', note: '= −nFE' },
                { label: 'Kc', value: Keq > 1e10 ? `${Keq.toExponential(2)}` : Keq < 1e-10 ? `${Keq.toExponential(2)}` : Keq.toFixed(4), color: 'text-violet-400', note: 'Equilibrium constant' },
                { label: 'n (e⁻)', value: String(n), color: 'text-on-surface-variant', note: 'Electrons transferred' },
              ].map(({ label, value, color, note }) => (
                <div key={label} className="flex justify-between items-start py-1 border-b border-white/5">
                  <div>
                    <span className="text-xs text-on-surface-variant">{label}</span>
                    <div className="text-[9px] text-on-surface-variant/50">{note}</div>
                  </div>
                  <span className={`font-mono text-xs font-bold ${color} text-right`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* E vs log(Q) chart */}
          <div className="glass-panel rounded-2xl p-4 md:p-5">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="font-bold text-on-surface text-sm" style={{ fontFamily: 'var(--font-sora)' }}>
                  Cell EMF vs Reaction Quotient Q
                </h3>
                <p className="text-[10px] text-on-surface-variant">Nernst equation — how EMF drops as Q increases</p>
              </div>
              <div className="text-right text-[10px]">
                <div className="text-on-surface-variant">At equilibrium (E=0)</div>
                <div className="font-mono text-teal-300">log(Kc) = {(Math.log10(Keq)).toFixed(2)}</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={qVsE} margin={{ top: 5, right: 15, left: 5, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="logQ" stroke="#849495" tick={{ fontSize: 10 }}
                  label={{ value: 'log Q', position: 'insideBottom', offset: -12, fill: '#849495', fontSize: 10 }} />
                <YAxis stroke="#849495" tick={{ fontSize: 10 }}
                  label={{ value: 'E (V)', angle: -90, position: 'insideLeft', fill: '#849495', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#130818', border: '1px solid rgba(0,219,231,0.3)', borderRadius: 8, fontSize: 11 }}
                  formatter={(v: number) => [v.toFixed(3) + ' V', 'EMF']}
                  labelFormatter={v => `log Q = ${v}`} />
                <ReferenceLine y={0} stroke="rgba(239,68,68,0.5)" strokeDasharray="4 4" />
                <ReferenceLine x={logQ} stroke="rgba(255,255,255,0.6)" strokeWidth={1.5} />
                <Line type="monotone" dataKey="E" stroke="#00dbe7" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: '#00dbe7' }} />
              </LineChart>
            </ResponsiveContainer>

            {/* Key relations */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              {[
                { eq: 'ΔG° = −nFE°', note: 'Standard Gibbs & EMF', color: 'text-teal-300' },
                { eq: 'ΔG° = −RT ln Kc', note: 'Gibbs & equilibrium', color: 'text-violet-400' },
                { eq: 'log Kc = nE°/0.0592', note: 'At 298K (simplified)', color: 'text-saffron-500' },
              ].map(({ eq, note, color }) => (
                <div key={eq} className="glass-panel rounded-xl p-3 border border-white/10">
                  <div className={`font-mono text-sm font-bold ${color}`}>{eq}</div>
                  <div className="text-[10px] text-on-surface-variant mt-0.5">{note}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
