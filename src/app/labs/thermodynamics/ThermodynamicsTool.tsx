'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ScatterChart, Scatter } from 'recharts'

// ── Thermodynamics engine ──────────────────────────────────────
const R = 8.314 // J/mol·K

// All values in kJ/mol, kJ/mol·K
const REACTIONS = [
  { id:'combustion-ch4',  label:'CH₄ + 2O₂ → CO₂ + 2H₂O',    dH:-890.3, dS:-242.8, eg:'Combustion of methane' },
  { id:'haber',           label:'N₂ + 3H₂ ⇌ 2NH₃',             dH:-92.4,  dS:-198.2, eg:'Haber process' },
  { id:'caco3',           label:'CaCO₃ → CaO + CO₂',           dH:178.3,  dS:160.4,  eg:'Lime kiln' },
  { id:'hf',              label:'H₂ + F₂ → 2HF',               dH:-546.6, dS:14.1,   eg:'HF formation' },
  { id:'n2o4',            label:'N₂O₄ ⇌ 2NO₂',                 dH:57.2,   dS:175.8,  eg:'Brown gas' },
  { id:'fe2o3',           label:'2Fe + 3/2 O₂ → Fe₂O₃',       dH:-824.2, dS:-271.9, eg:'Rusting of iron' },
  { id:'photosynthesis',  label:'6CO₂+6H₂O → C₆H₁₂O₆+6O₂',  dH:2803,   dS:259.0,  eg:'Photosynthesis' },
  { id:'custom',          label:'Custom reaction',              dH:0,      dS:0,      eg:'Set your own ΔH and ΔS' },
]

function gibbs(dH_kJ: number, dS_J_K: number, T: number): number {
  return dH_kJ * 1000 - T * dS_J_K // J/mol
}

function spontaneous(dG: number, dH: number, dS: number): { label: string; color: string; always: string } {
  if (dH < 0 && dS > 0) return { label: 'Always spontaneous', color: '#22c55e', always: 'Spontaneous at all T' }
  if (dH > 0 && dS < 0) return { label: 'Never spontaneous', color: '#ef4444', always: 'Non-spontaneous at all T' }
  if (dH < 0 && dS < 0) return { label: dG < 0 ? 'Spontaneous (low T)' : 'Non-spontaneous', color: dG < 0 ? '#06b6d4' : '#ef4444', always: 'Spontaneous only at LOW T' }
  return { label: dG < 0 ? 'Spontaneous (high T)' : 'Non-spontaneous', color: dG < 0 ? '#22c55e' : '#f97316', always: 'Spontaneous only at HIGH T' }
}

function crossoverT(dH_kJ: number, dS_J_K: number): number | null {
  if (Math.abs(dS_J_K) < 0.01) return null
  return (dH_kJ * 1000) / dS_J_K
}

function Keq(dG0_J: number, T: number): number {
  return Math.exp(-dG0_J / (R * T))
}

function buildGvsT(dH_kJ: number, dS_J_K: number) {
  return Array.from({ length: 80 }, (_, i) => {
    const T = 100 + i * 15
    const dG = gibbs(dH_kJ, dS_J_K, T) / 1000 // kJ/mol
    return { T, dG: Math.round(dG * 10) / 10 }
  })
}

function buildEntropyCurve(dS_J_K: number) {
  return Array.from({ length: 60 }, (_, i) => {
    const T = 50 + i * 20
    const TdS = T * dS_J_K / 1000 // kJ/mol
    return { T, TdS: Math.round(TdS * 10) / 10 }
  })
}

// ── Animated particle system ───────────────────────────────────
function ThermodynamicsViz({ dH, dS, T, spontaneous: spon }: { dH: number; dS: number; T: number; spontaneous: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const raf = useRef<number>(0)
  const particles = useRef<{ x: number; y: number; vx: number; vy: number; energy: number }[]>([])

  useEffect(() => {
    // Particles with energies proportional to T, speeds from Maxwell-Boltzmann
    const avgSpeed = Math.sqrt(2 * R * T / 0.028) / 100
    particles.current = Array.from({ length: 30 }, () => ({
      x: Math.random() * 280, y: Math.random() * 160,
      vx: (Math.random() - 0.5) * avgSpeed * 2,
      vy: (Math.random() - 0.5) * avgSpeed * 2,
      energy: Math.random() * T / 300,
    }))
  }, [T])

  useEffect(() => {
    const cv = ref.current; if (!cv) return
    const ctx = cv.getContext('2d')!
    const W = cv.width, H = cv.height

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Background gradient based on spontaneity
      const grad = ctx.createLinearGradient(0, 0, W, H)
      if (spon) { grad.addColorStop(0, 'rgba(34,197,94,0.05)'); grad.addColorStop(1, 'rgba(6,182,212,0.05)') }
      else { grad.addColorStop(0, 'rgba(239,68,68,0.05)'); grad.addColorStop(1, 'rgba(249,115,22,0.05)') }
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H)

      // Energy barrier visualization
      const barrierH = Math.max(20, Math.min(H - 20, H/2 - dH / 5))
      ctx.beginPath()
      ctx.moveTo(0, H * 0.7)
      ctx.bezierCurveTo(W * 0.3, H * 0.7, W * 0.4, barrierH, W * 0.5, barrierH)
      ctx.bezierCurveTo(W * 0.6, barrierH, W * 0.7, H * 0.7 + dH / 5, W, H * 0.7 + dH / 5)
      ctx.strokeStyle = spon ? 'rgba(34,197,94,0.5)' : 'rgba(239,68,68,0.5)'
      ctx.lineWidth = 2; ctx.stroke()

      // Reactant label
      ctx.font = '10px monospace'; ctx.fillStyle = '#849495'; ctx.textAlign = 'center'
      ctx.fillText('Reactants', W * 0.1, H * 0.7 - 10)
      ctx.fillText('Products', W * 0.9, H * 0.7 + dH / 5 - 10)

      // ΔH arrow
      if (Math.abs(dH) > 5) {
        ctx.strokeStyle = dH < 0 ? '#22c55e' : '#ef4444'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3])
        ctx.beginPath()
        ctx.moveTo(W * 0.85, H * 0.7)
        ctx.lineTo(W * 0.85, H * 0.7 + dH / 5)
        ctx.stroke(); ctx.setLineDash([])
        ctx.font = 'bold 9px monospace'; ctx.fillStyle = dH < 0 ? '#22c55e' : '#ef4444'
        ctx.fillText(`ΔH=${dH > 0 ? '+' : ''}${dH.toFixed(0)} kJ`, W * 0.85, H * 0.7 + dH / 10)
      }

      // Particles
      particles.current.forEach(p => {
        const speed = Math.sqrt(R * T / 0.028) / 100
        p.x += p.vx; p.y += p.vy
        if (p.x < 5 || p.x > W - 5) p.vx *= -1
        if (p.y < 5 || p.y > H - 5) p.vy *= -1
        const r = 4 + p.energy * 3
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        const heat = Math.min(1, T / 600)
        ctx.fillStyle = `rgba(${Math.round(heat * 239)},${Math.round((1 - heat) * 182)},${Math.round((1 - heat) * 212)},0.7)`
        ctx.fill()
      })

      raf.current = requestAnimationFrame(draw)
    }
    raf.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf.current)
  }, [dH, dS, T, spon])

  return <canvas ref={ref} width={300} height={200}
    style={{ background: 'rgba(14,19,34,0.85)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: 300 }} />
}

// ── Main Simulator ─────────────────────────────────────────────
export default function ThermodynamicsSim() {
  const [rxnId, setRxnId]   = useState('haber')
  const [T, setT]           = useState(298)
  const [customDH, setCDH]  = useState(0)
  const [customDS, setCDS]  = useState(0)
  const [playing, setPlaying] = useState(true)

  const rxn = REACTIONS.find(r => r.id === rxnId)!
  const dH = rxnId === 'custom' ? customDH : rxn.dH   // kJ/mol
  const dS = rxnId === 'custom' ? customDS : rxn.dS   // J/mol·K (note: J not kJ)
  const dG_J   = gibbs(dH, dS, T)
  const dG_kJ  = dG_J / 1000
  const spont  = spontaneous(dG_J, dH, dS)
  const Tcross = crossoverT(dH, dS)
  const K      = Keq(dG_J, T)
  const gVsT   = buildGvsT(dH, dS)
  const sTData = buildEntropyCurve(dS)

  // Hess's Law example values
  const TdS_kJ = T * dS / 1000

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ height: 46, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/labs" style={{ color: '#849495', textDecoration: 'none', fontSize: 13 }}>← Labs</Link>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          <strong style={{ fontSize: 14 }}>Thermodynamics Simulator — ΔG = ΔH − TΔS</strong>
        </div>
        <button onClick={() => setPlaying(p => !p)}
          style={{ padding: '4px 12px', borderRadius: 8, border: '1px solid rgba(0,219,231,0.4)', background: playing ? 'rgba(0,219,231,0.1)' : 'transparent', color: playing ? '#00dbe7' : '#849495', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Controls */}
        <div style={{ width: 220, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>

          <div>
            <div style={{ fontSize: 9, color: '#00dbe7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>Reaction</div>
            {REACTIONS.map(r => (
              <button key={r.id} onClick={() => setRxnId(r.id)}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 8px', borderRadius: 6, marginBottom: 3, border: `1px solid ${rxnId === r.id ? 'rgba(0,219,231,0.4)' : 'transparent'}`, background: rxnId === r.id ? 'rgba(0,219,231,0.1)' : 'rgba(255,255,255,0.02)', color: rxnId === r.id ? '#00dbe7' : '#849495', fontSize: 10, cursor: 'pointer' }}>
                <span style={{ display: 'block', fontWeight: rxnId === r.id ? 700 : 400 }}>{r.label}</span>
                <span style={{ fontSize: 9, opacity: 0.6 }}>{r.eg}</span>
              </button>
            ))}
          </div>

          {/* Custom */}
          {rxnId === 'custom' && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase' }}>ΔH° (kJ/mol)</span>
                  <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#f97316' }}>{customDH > 0 ? '+' : ''}{customDH}</span>
                </div>
                <input type="range" min="-1000" max="1000" step="5" value={customDH} onChange={e => setCDH(+e.target.value)} style={{ width: '100%' }} />
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 9, color: '#8b5cf6', fontWeight: 700, textTransform: 'uppercase' }}>ΔS° (J/mol·K)</span>
                  <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#8b5cf6' }}>{customDS > 0 ? '+' : ''}{customDS}</span>
                </div>
                <input type="range" min="-500" max="500" step="5" value={customDS} onChange={e => setCDS(+e.target.value)} style={{ width: '100%' }} />
              </div>
            </div>
          )}

          {/* Temperature */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 9, color: '#00dbe7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Temperature</span>
              <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: '#00dbe7' }}>{T} K &nbsp; ({T - 273}°C)</span>
            </div>
            <input type="range" min="100" max="1500" step="5" value={T} onChange={e => setT(+e.target.value)} style={{ width: '100%' }} />
            <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
              {[{ l: '25°C', v: 298 }, { l: '100°C', v: 373 }, { l: '500°C', v: 773 }, { l: '1000°C', v: 1273 }].map(({ l, v }) => (
                <button key={l} onClick={() => setT(v)} style={{ padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#849495', fontSize: 9, cursor: 'pointer' }}>{l}</button>
              ))}
            </div>
          </div>

          {/* Values */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8 }}>
            <div style={{ fontSize: 9, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>All Values</div>
            {[
              { l: 'ΔH°', v: `${dH > 0 ? '+' : ''}${dH.toFixed(1)} kJ/mol`, c: dH < 0 ? '#22c55e' : '#ef4444' },
              { l: 'ΔS°', v: `${dS > 0 ? '+' : ''}${dS.toFixed(1)} J/mol·K`, c: dS > 0 ? '#22c55e' : '#ef4444' },
              { l: 'T·ΔS', v: `${TdS_kJ > 0 ? '+' : ''}${TdS_kJ.toFixed(1)} kJ/mol`, c: '#8b5cf6' },
              { l: 'ΔG° = ΔH−TΔS', v: `${dG_kJ > 0 ? '+' : ''}${dG_kJ.toFixed(1)} kJ/mol`, c: dG_kJ < 0 ? '#22c55e' : '#ef4444' },
              { l: 'Kc = e^(−ΔG°/RT)', v: K > 1e10 ? `${K.toExponential(2)} >> 1` : K < 1e-10 ? `${K.toExponential(2)} << 1` : K.toFixed(4), c: K > 1 ? '#22c55e' : '#ef4444' },
              { l: 'Tcrossover', v: Tcross !== null ? `${Tcross.toFixed(0)} K (${(Tcross - 273).toFixed(0)}°C)` : 'None (always/never)', c: '#f97316' },
            ].map(({ l, v, c }) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '4px 0', fontSize: 10 }}>
                <span style={{ color: '#849495' }}>{l}</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: c }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Formula + spontaneity bar */}
          <AnimatePresence mode="wait">
            <motion.div key={`${dH}-${dS}-${Math.round(T/50)}`} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
              style={{ background: `${spont.color}12`, borderBottom: `2px solid ${spont.color}40`, padding: '10px 16px', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>

                {/* Core equation */}
                <div>
                  <div style={{ fontSize: 9, color: spont.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Gibbs Free Energy</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 700, color: spont.color, background: `${spont.color}18`, padding: '4px 10px', borderRadius: 6, display: 'inline-block' }}>
                    ΔG° = ΔH° − T·ΔS°
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#f8fafc', marginTop: 4 }}>
                    = {dH > 0 ? '+' : ''}{dH.toFixed(1)} − {T} × ({dS > 0 ? '+' : ''}{dS.toFixed(1)}/1000)
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 13, color: spont.color, fontWeight: 700, marginTop: 2 }}>
                    = {dG_kJ > 0 ? '+' : ''}{dG_kJ.toFixed(2)} kJ/mol
                  </div>
                </div>

                {/* Spontaneity */}
                <div>
                  <div style={{ fontSize: 9, color: spont.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Spontaneity</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: spont.color, padding: '4px 10px', border: `1px solid ${spont.color}60`, borderRadius: 6, display: 'inline-block' }}>
                    {dG_kJ < 0 ? '✓' : '✗'} {spont.label}
                  </div>
                  <div style={{ fontSize: 10, color: '#849495', marginTop: 4 }}>{spont.always}</div>
                  {Tcross !== null && (
                    <div style={{ fontSize: 10, color: '#f97316', marginTop: 2 }}>Crossover at T = {Tcross.toFixed(0)} K ({(Tcross - 273).toFixed(0)}°C)</div>
                  )}
                </div>

                {/* ΔH/ΔS signs table */}
                <div style={{ fontSize: 9, color: '#849495', lineHeight: 1.7 }}>
                  <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: 2 }}>Spontaneity Guide:</div>
                  <div>ΔH− ΔS+ → <strong style={{ color: '#22c55e' }}>Always spontaneous</strong></div>
                  <div>ΔH+ ΔS− → <strong style={{ color: '#ef4444' }}>Never spontaneous</strong></div>
                  <div>ΔH− ΔS− → <strong style={{ color: '#06b6d4' }}>Spontaneous at LOW T</strong></div>
                  <div>ΔH+ ΔS+ → <strong style={{ color: '#f97316' }}>Spontaneous at HIGH T</strong></div>
                </div>

                {/* Kc relation */}
                <div>
                  <div style={{ fontSize: 9, color: '#8b5cf6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Equilibrium Constant</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#f8fafc' }}>ΔG° = −RT ln Kc</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#8b5cf6', marginTop: 2 }}>Kc = e^(−ΔG°/RT) = {K.toExponential(2)}</div>
                  <div style={{ fontSize: 9, color: '#849495', marginTop: 2 }}>
                    {K > 1 ? `Kc > 1: products favoured` : `Kc < 1: reactants favoured`}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Visualization + ΔG gauge */}
          <div style={{ display: 'flex', padding: '10px 14px', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>

            {/* Animated reaction vessel */}
            <div style={{ background: 'rgba(26,31,47,0.6)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '10px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: 9, color: '#849495', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Reaction Vessel (T={T}K)</div>
              <ThermodynamicsViz dH={dH} dS={dS} T={T} spontaneous={dG_kJ < 0} />
              <div style={{ fontSize: 9, color: '#849495', textAlign: 'center' }}>
                Particles faster at higher T &nbsp;|&nbsp; {playing ? 'Live' : 'Paused'}
              </div>
            </div>

            {/* ΔG gauge */}
            <div style={{ background: 'rgba(26,31,47,0.6)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, minWidth: 140 }}>
              <div style={{ fontSize: 9, color: '#849495', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ΔG°</div>
              <motion.div key={dG_kJ.toFixed(0)} style={{ fontSize: 40, fontWeight: 900, fontFamily: 'monospace', color: spont.color, lineHeight: 1 }}
                animate={{ scale: [1.06, 1] }} transition={{ duration: 0.15 }}>
                {dG_kJ > 0 ? '+' : ''}{dG_kJ.toFixed(0)}
              </motion.div>
              <div style={{ fontSize: 11, color: '#849495' }}>kJ/mol</div>
              <div style={{ width: '100%', height: 16, background: 'rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '50%', top: 0, width: 1, height: '100%', background: 'rgba(255,255,255,0.3)' }} />
                <motion.div
                  style={{ position: 'absolute', top: 0, height: '100%', background: spont.color, borderRadius: 8 }}
                  animate={{ left: dG_kJ < 0 ? `${Math.max(0, 50 - Math.min(50, Math.abs(dG_kJ) / 20))}%` : '50%', width: `${Math.min(50, Math.abs(dG_kJ) / 20)}%` }}
                  transition={{ duration: 0.3 }} />
              </div>
              <div style={{ fontSize: 9, color: '#849495', display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <span style={{ color: '#22c55e' }}>← Spontaneous</span>
                <span style={{ color: '#ef4444' }}>Non-spont. →</span>
              </div>
            </div>

            {/* Component breakdown */}
            <div style={{ flex: 1, background: 'rgba(26,31,47,0.6)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ fontSize: 9, color: '#849495', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Component Breakdown</div>

              {/* Visual bar chart ΔH vs TΔS */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 100, marginBottom: 8 }}>
                {[
                  { label: 'ΔH°', value: dH, color: dH < 0 ? '#22c55e' : '#ef4444', max: 1000 },
                  { label: 'T·ΔS°', value: TdS_kJ, color: TdS_kJ > 0 ? '#8b5cf6' : '#f97316', max: 1000 },
                  { label: 'ΔG°', value: dG_kJ, color: spont.color, max: 1000 },
                ].map(({ label, value, color, max }) => (
                  <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <div style={{ fontSize: 9, fontFamily: 'monospace', color, fontWeight: 700 }}>{value > 0 ? '+' : ''}{value.toFixed(0)}</div>
                    <div style={{ width: '100%', position: 'relative', height: 70 }}>
                      <div style={{ position: 'absolute', bottom: '50%', left: 0, right: 0, borderBottom: '1px solid rgba(255,255,255,0.2)' }} />
                      <motion.div
                        style={{ position: 'absolute', left: '10%', right: '10%', background: color, borderRadius: 3, ...(value < 0 ? { bottom: '50%' } : { top: '50%' }) }}
                        animate={{ height: `${Math.min(48, Math.abs(value) / max * 48)}%` }}
                        transition={{ duration: 0.3 }} />
                    </div>
                    <div style={{ fontSize: 9, color: '#849495' }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Relation formulas */}
              <div style={{ fontSize: 9, fontFamily: 'monospace', color: '#849495', lineHeight: 1.6 }}>
                <div>ΔG° = ΔH° − T·ΔS°</div>
                <div>ΔG° = −RT ln Kc &nbsp;&nbsp; ΔG° = −nFE°</div>
                <div style={{ color: '#f8fafc' }}>At equil: ΔG = 0, Q = Kc</div>
              </div>
            </div>
          </div>

          {/* ΔG vs T chart */}
          <div style={{ flex: 1, padding: '10px 16px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>ΔG° vs Temperature</div>
                <div style={{ fontSize: 10, color: '#849495' }}>
                  Slope = −ΔS° = {(-dS / 1000).toFixed(4)} kJ/K &nbsp;|&nbsp; y-intercept = ΔH° = {dH.toFixed(1)} kJ/mol
                  {Tcross !== null && ` | Crossover at ${Tcross.toFixed(0)} K`}
                </div>
              </div>
              <div style={{ fontSize: 10, textAlign: 'right', color: '#849495' }}>
                <div>Current T = {T} K → ΔG° = <span style={{ color: spont.color, fontWeight: 700 }}>{dG_kJ.toFixed(1)} kJ/mol</span></div>
              </div>
            </div>
            <div style={{ flex: 1, minHeight: 140 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gVsT} margin={{ top: 5, right: 20, left: 5, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="T" stroke="#849495" tick={{ fontSize: 9 }} label={{ value: 'Temperature (K)', position: 'insideBottom', offset: -12, fill: '#849495', fontSize: 9 }} />
                  <YAxis stroke="#849495" tick={{ fontSize: 9 }} label={{ value: 'ΔG° (kJ/mol)', angle: -90, position: 'insideLeft', fill: '#849495', fontSize: 9 }} />
                  <Tooltip contentStyle={{ background: '#130818', border: '1px solid rgba(0,219,231,0.3)', borderRadius: 8, fontSize: 10 }}
                    formatter={(v: number) => [v?.toFixed(1) + ' kJ/mol', 'ΔG°']} labelFormatter={v => `T = ${v} K`} />
                  <ReferenceLine y={0} stroke="rgba(34,197,94,0.5)" strokeWidth={2} />
                  {Tcross !== null && <ReferenceLine x={Tcross} stroke="rgba(249,115,22,0.6)" strokeDasharray="4 4" />}
                  <ReferenceLine x={T} stroke="rgba(255,255,255,0.75)" strokeWidth={2} />
                  <Line type="monotone" dataKey="dG" stroke={spont.color} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
