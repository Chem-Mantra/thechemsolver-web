'use client'
import Link from 'next/link'
import { useState, useMemo, useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts'

// ── Nuclear Decay Simulator ─────────────────────────────────
// Real decay math: N(t) = N₀ × e^(-λt), λ = ln2/t½

interface Isotope {
  name: string; symbol: string; Z: number; A: number
  halfLife: number; halfLifeUnit: string; halfLifeSeconds: number
  decayType: string; daughter: string; energy: number
  bindingEnergy: number; color: string; application: string
}

const ISOTOPES: Isotope[] = [
  { name: 'Carbon-14',    symbol: '¹⁴C',  Z: 6,  A: 14, halfLife: 5730,    halfLifeUnit: 'years',     halfLifeSeconds: 1.81e11, decayType: 'β⁻', daughter: '¹⁴N',  energy: 0.156, bindingEnergy: 105.28, color: '#22c55e', application: 'Radiocarbon dating of organic material up to ~50,000 years old' },
  { name: 'Uranium-238',  symbol: '²³⁸U', Z: 92, A: 238, halfLife: 4.47e9, halfLifeUnit: 'years',     halfLifeSeconds: 1.41e17, decayType: 'α',  daughter: '²³⁴Th', energy: 4.27,  bindingEnergy: 1801.7, color: '#f97316', application: 'Geological dating, nuclear fuel cycle' },
  { name: 'Iodine-131',   symbol: '¹³¹I', Z: 53, A: 131, halfLife: 8.02,   halfLifeUnit: 'days',      halfLifeSeconds: 693000,  decayType: 'β⁻', daughter: '¹³¹Xe', energy: 0.606, bindingEnergy: 1103.2, color: '#a78bfa', application: 'Thyroid cancer treatment and imaging' },
  { name: 'Cobalt-60',    symbol: '⁶⁰Co', Z: 27, A: 60,  halfLife: 5.27,   halfLifeUnit: 'years',     halfLifeSeconds: 1.66e8,  decayType: 'β⁻+γ', daughter: '⁶⁰Ni', energy: 1.33, bindingEnergy: 524.8, color: '#06b6d4', application: 'Cancer radiotherapy, industrial sterilisation' },
  { name: 'Radium-226',   symbol: '²²⁶Ra', Z: 88, A: 226, halfLife: 1600,  halfLifeUnit: 'years',     halfLifeSeconds: 5.05e10, decayType: 'α',  daughter: '²²²Rn', energy: 4.87, bindingEnergy: 1731.6, color: '#fbbf24', application: 'Historical: luminous watch dials. Now: cancer treatment' },
  { name: 'Technetium-99m', symbol: '⁹⁹ᵐTc', Z: 43, A: 99, halfLife: 6.02, halfLifeUnit: 'hours',   halfLifeSeconds: 21672,   decayType: 'γ',  daughter: '⁹⁹Tc', energy: 0.14,  bindingEnergy: 852.2,  color: '#ec4899', application: 'Medical imaging (SPECT scans) — most used medical radioisotope' },
  { name: 'Strontium-90', symbol: '⁹⁰Sr', Z: 38, A: 90,  halfLife: 28.8,   halfLifeUnit: 'years',     halfLifeSeconds: 9.09e8,  decayType: 'β⁻', daughter: '⁹⁰Y',  energy: 0.546, bindingEnergy: 782.6,  color: '#ef4444', application: 'Nuclear waste concern, bone cancer treatment' },
  { name: 'Fluorine-18',  symbol: '¹⁸F',  Z: 9,  A: 18,  halfLife: 109.8,  halfLifeUnit: 'minutes',   halfLifeSeconds: 6588,    decayType: 'β⁺', daughter: '¹⁸O',  energy: 0.634, bindingEnergy: 137.4,  color: '#34d399', application: 'PET scans (glucose metabolism, cancer detection)' },
  { name: 'Polonium-210', symbol: '²¹⁰Po', Z: 84, A: 210, halfLife: 138.4, halfLifeUnit: 'days',      halfLifeSeconds: 1.196e7, decayType: 'α',  daughter: '²⁰⁶Pb', energy: 5.3,  bindingEnergy: 1615.9, color: '#f87171', application: 'Extremely toxic α emitter. Used as heat source in satellites.' },
  { name: 'Radon-222',    symbol: '²²²Rn', Z: 86, A: 222, halfLife: 3.82,  halfLifeUnit: 'days',      halfLifeSeconds: 330000,  decayType: 'α',  daughter: '²¹⁸Po', energy: 5.49, bindingEnergy: 1708.2, color: '#fbbf24', application: 'Indoor air quality concern; radon gas seeps from soil' },
]

// Generate N(t)/N₀ decay data
function generateDecayData(halfLifeSeconds: number, points = 200) {
  const lambda = Math.LN2 / halfLifeSeconds
  const duration = halfLifeSeconds * 7 // show 7 half-lives
  return Array.from({ length: points }, (_, i) => {
    const t = i * duration / points
    const ratio = Math.exp(-lambda * t)
    const halves = t / halfLifeSeconds
    return { t: +(halves.toFixed(3)), N: +(ratio * 100).toFixed(4), logN: +(Math.log10(ratio * 100)).toFixed(4) }
  })
}

// Binding energy per nucleon formula (from SEMF)
function semfBE(Z: number, A: number): number {
  const aV = 15.75, aS = 17.8, aC = 0.711, aA = 23.7, aP = 11.2
  const N = A - Z
  let delta = 0
  if (A % 2 === 0) delta = (Z % 2 === 0) ? aP : -aP
  const BE = aV * A - aS * Math.pow(A, 2/3) - aC * Z*(Z-1)/Math.pow(A, 1/3) - aA*(N-Z)**2/A + delta/Math.sqrt(A)
  return Math.max(0, BE / A)
}

// Generate binding energy per nucleon vs A
function generateBEData() {
  const points: { A: number; BEperA: number }[] = []
  for (let A = 1; A <= 240; A += 3) {
    const Z = Math.round(A / (1.98 + 0.015 * Math.pow(A, 2/3))) // approximate stable Z
    points.push({ A, BEperA: +(semfBE(Z, A).toFixed(3)) })
  }
  return points
}

const BE_DATA = generateBEData()

// Decay chain for U-238 (simplified, major steps)
const U238_CHAIN = [
  { sym: '²³⁸U', Z: 92, A: 238, t: 'α', daughter: '²³⁴Th' },
  { sym: '²³⁴Th', Z: 90, A: 234, t: 'β⁻', daughter: '²³⁴Pa' },
  { sym: '²³⁴Pa', Z: 91, A: 234, t: 'β⁻', daughter: '²³⁴U' },
  { sym: '²³⁴U',  Z: 92, A: 234, t: 'α', daughter: '²³⁰Th' },
  { sym: '²³⁰Th', Z: 90, A: 230, t: 'α', daughter: '²²⁶Ra' },
  { sym: '²²⁶Ra', Z: 88, A: 226, t: 'α', daughter: '²²²Rn' },
  { sym: '²²²Rn', Z: 86, A: 222, t: 'α', daughter: '²¹⁸Po' },
  { sym: '²¹⁸Po', Z: 84, A: 218, t: 'α', daughter: '²⁰⁶Pb' },
  { sym: '²⁰⁶Pb', Z: 82, A: 206, t: '⚫', daughter: 'stable' },
]

export default function NuclearDecay() {
  const [isoIdx, setIsoIdx] = useState(0)
  const [N0, setN0] = useState(1000)
  const [t, setT] = useState(1)
  const [view, setView] = useState<'decay' | 'log' | 'binding' | 'chain'>('decay')
  const [animRunning, setAnimRunning] = useState(false)
  const animRef = useRef<ReturnType<typeof setInterval>>()

  const iso = ISOTOPES[isoIdx]
  const lambda = Math.LN2 / iso.halfLifeSeconds
  const Nt = N0 * Math.exp(-lambda * t * iso.halfLifeSeconds)
  const decayed = N0 - Nt
  const pctRemaining = (Nt / N0 * 100).toFixed(2)
  const activityBq = Math.round(lambda * Nt)

  const decayData = useMemo(() => generateDecayData(iso.halfLifeSeconds), [isoIdx])

  useEffect(() => {
    clearInterval(animRef.current)
    if (!animRunning) return
    animRef.current = setInterval(() => {
      setT(prev => { if (prev >= 7) { setAnimRunning(false); return 7 } return +(prev + 0.05).toFixed(2) })
    }, 100)
    return () => clearInterval(animRef.current)
  }, [animRunning])

  const decayColor = iso.decayType.startsWith('α') ? '#f97316' : iso.decayType.startsWith('β⁺') ? '#22c55e' : iso.decayType.startsWith('β⁻') ? '#06b6d4' : '#a78bfa'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 46, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#849495', textDecoration: 'none', fontSize: 13 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 14 }}>Nuclear Decay — Half-life, Decay Chains & Binding Energy</strong>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Isotope list */}
        <div style={{ width: 210, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 10, overflowY: 'auto' }}>
          <div style={{ fontSize: 9, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Select Isotope</div>
          {ISOTOPES.map((iso, i) => (
            <button key={iso.symbol} onClick={() => { setIsoIdx(i); setT(1); setAnimRunning(false) }}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 9, marginBottom: 5, border: `1px solid ${isoIdx === i ? iso.color + '60' : 'rgba(255,255,255,0.06)'}`, background: isoIdx === i ? iso.color + '12' : 'rgba(255,255,255,0.02)', color: isoIdx === i ? iso.color : '#849495', fontSize: 10, cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: 14 }}>{iso.symbol}</span>
                <span style={{ fontSize: 9, background: `${decayTypeColor(iso.decayType)}25`, color: decayTypeColor(iso.decayType), padding: '1px 5px', borderRadius: 4 }}>{iso.decayType}</span>
              </div>
              <div style={{ fontSize: 8, opacity: 0.7, marginTop: 2 }}>t½ = {iso.halfLife} {iso.halfLifeUnit}</div>
              <div style={{ fontSize: 8, opacity: 0.5, marginTop: 1 }}>{iso.name}</div>
            </button>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 14, overflow: 'hidden', gap: 10 }}>
          {/* Isotope header */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ background: `${iso.color}14`, border: `1px solid ${iso.color}50`, borderRadius: 12, padding: '10px 16px' }}>
              <div style={{ fontSize: 30, fontWeight: 900, fontFamily: 'monospace', color: iso.color, lineHeight: 1 }}>{iso.symbol}</div>
              <div style={{ fontSize: 11, color: '#f8fafc', marginTop: 4 }}>{iso.name}</div>
              <div style={{ fontSize: 9, color: '#849495' }}>Z={iso.Z}, A={iso.A}, N={iso.A - iso.Z}</div>
            </div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: 'Decay Type', val: iso.decayType, color: decayColor },
                { label: 'Daughter', val: iso.daughter, color: '#f8fafc' },
                { label: 'Half-life', val: `${iso.halfLife} ${iso.halfLifeUnit}`, color: iso.color },
                { label: 'Q-value', val: `${iso.energy} MeV`, color: '#fbbf24' },
                { label: 'Binding E', val: `${iso.bindingEnergy.toFixed(1)} MeV`, color: '#22c55e' },
                { label: 'Application', val: iso.application.slice(0, 50) + '…', color: '#849495' },
              ].map(item => (
                <div key={item.label} style={{ background: 'rgba(26,31,47,0.8)', borderRadius: 9, padding: '7px 10px' }}>
                  <div style={{ fontSize: 8, color: '#849495' }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: item.color, fontWeight: 600, fontFamily: 'monospace', marginTop: 2 }}>{item.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Time slider */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: '#849495', flexShrink: 0 }}>t = {t.toFixed(2)} half-lives</span>
            <input type="range" min={0} max={7} step={0.01} value={t} onChange={e => { setT(+e.target.value); setAnimRunning(false) }}
              style={{ flex: 1, accentColor: iso.color }} />
            <button onClick={() => { setT(0); setAnimRunning(true) }}
              style={{ padding: '3px 12px', borderRadius: 20, border: `1px solid ${iso.color}50`, background: animRunning ? `${iso.color}25` : 'transparent', color: iso.color, fontSize: 11, cursor: 'pointer' }}>
              {animRunning ? '⏸' : '▶ Animate'}
            </button>
          </div>

          {/* Live results */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { label: 'N(t)', val: Nt.toFixed(0), unit: 'nuclei', color: iso.color },
              { label: 'Decayed', val: decayed.toFixed(0), unit: '', color: '#ef4444' },
              { label: 'Remaining', val: `${pctRemaining}%`, unit: '', color: '#22c55e' },
              { label: 'Activity', val: activityBq > 1e6 ? `${(activityBq/1e6).toFixed(2)}M` : activityBq > 1e3 ? `${(activityBq/1e3).toFixed(2)}k` : String(activityBq), unit: 'Bq', color: '#fbbf24' },
            ].map(item => (
              <div key={item.label} style={{ flex: 1, background: `${item.color}0f`, border: `1px solid ${item.color}35`, borderRadius: 10, padding: '8px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: '#849495' }}>{item.label}</div>
                <div style={{ fontSize: 16, fontWeight: 900, fontFamily: 'monospace', color: item.color }}>{item.val}</div>
                <div style={{ fontSize: 8, color: '#849495' }}>{item.unit}</div>
              </div>
            ))}
          </div>

          {/* View tabs */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[{ id: 'decay', label: 'N(t) Decay' }, { id: 'log', label: 'Log N(t)' }, { id: 'binding', label: 'Binding Energy' }, { id: 'chain', label: 'U-238 Chain' }].map(tab => (
              <button key={tab.id} onClick={() => setView(tab.id as typeof view)}
                style={{ padding: '4px 12px', borderRadius: 20, border: `1px solid ${view === tab.id ? iso.color : 'rgba(255,255,255,0.1)'}`, background: view === tab.id ? `${iso.color}20` : 'transparent', color: view === tab.id ? iso.color : '#849495', fontSize: 10, cursor: 'pointer' }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Chart area */}
          <div style={{ flex: 1, minHeight: 0 }}>
            {(view === 'decay' || view === 'log') && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={decayData} margin={{ top: 5, right: 20, left: 5, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="t" label={{ value: 'Time (half-lives)', position: 'insideBottom', offset: -18, fill: '#849495', fontSize: 11 }} tick={{ fill: '#849495', fontSize: 9 }} />
                  <YAxis tick={{ fill: '#849495', fontSize: 9 }} label={{ value: view === 'log' ? 'log₁₀ N%' : 'N(t)/N₀ %', angle: -90, position: 'insideLeft', fill: '#849495', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#130818', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 10 }}
                    formatter={(v: number) => [`${v.toFixed(3)}${view === 'decay' ? '%' : ''}`, view === 'decay' ? 'Remaining %' : 'log₁₀(N%)']}
                    labelFormatter={(t: number) => `t = ${Number(t).toFixed(2)} t½`} />
                  <Line type="monotone" dataKey={view === 'decay' ? 'N' : 'logN'} stroke={iso.color} strokeWidth={2.5} dot={false} />
                  <ReferenceLine x={t} stroke="rgba(255,255,255,0.4)" strokeDasharray="4 2" label={{ value: `t=${t.toFixed(1)}`, position: 'top', fill: '#fff', fontSize: 9 }} />
                  {[1, 2, 3, 4, 5, 6, 7].map(n => (
                    <ReferenceLine key={n} x={n} stroke="rgba(255,255,255,0.08)" strokeDasharray="2 3" />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
            {view === 'binding' && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 10, color: '#849495' }}>Binding Energy per Nucleon (MeV/A) vs Mass Number — from Semi-Empirical Mass Formula</div>
                <ResponsiveContainer width="100%" height="85%">
                  <LineChart data={BE_DATA} margin={{ top: 5, right: 20, left: 5, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="A" label={{ value: 'Mass Number A', position: 'insideBottom', offset: -18, fill: '#849495', fontSize: 11 }} tick={{ fill: '#849495', fontSize: 9 }} />
                    <YAxis tick={{ fill: '#849495', fontSize: 9 }} label={{ value: 'BE/A (MeV)', angle: -90, position: 'insideLeft', fill: '#849495', fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: '#130818', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 10 }}
                      formatter={(v: number) => [`${v} MeV/nucleon`, 'Binding Energy']} />
                    <Line type="monotone" dataKey="BEperA" stroke="#06b6d4" strokeWidth={2} dot={false} />
                    <ReferenceLine x={56} stroke="#fbbf24" strokeDasharray="4 2" label={{ value: '⁵⁶Fe (peak)', position: 'top', fill: '#fbbf24', fontSize: 9 }} />
                    <ReferenceLine x={iso.A} stroke={iso.color} strokeDasharray="3 2" label={{ value: iso.symbol, position: 'top', fill: iso.color, fontSize: 9 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            {view === 'chain' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 10, color: '#849495' }}>Uranium-238 Decay Chain (simplified) — α decay: Z−2, A−4 | β⁻: Z+1, A unchanged</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                  {U238_CHAIN.map((nuc, i) => (
                    <div key={nuc.sym} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ background: nuc.t === '⚫' ? 'rgba(34,197,94,0.15)' : 'rgba(26,31,47,0.9)', border: `1px solid ${nuc.t === '⚫' ? '#22c55e50' : nuc.t === 'α' ? '#f9731650' : '#06b6d450'}`, borderRadius: 10, padding: '8px 12px', textAlign: 'center' }}>
                        <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: 14, color: nuc.t === '⚫' ? '#22c55e' : nuc.t === 'α' ? '#f97316' : '#06b6d4' }}>{nuc.sym}</div>
                        <div style={{ fontSize: 8, color: '#849495' }}>Z={nuc.Z} A={nuc.A}</div>
                      </div>
                      {i < U238_CHAIN.length - 1 && (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 12, color: nuc.t === 'α' ? '#f97316' : '#06b6d4' }}>→</div>
                          <div style={{ fontSize: 8, color: nuc.t === 'α' ? '#f97316' : '#06b6d4', fontWeight: 700 }}>{nuc.t}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  {[
                    { color: '#f97316', label: 'α decay', desc: 'Emits ²He nucleus (Z−2, A−4). High ionization. Stopped by paper.' },
                    { color: '#06b6d4', label: 'β⁻ decay', desc: 'n→p + e⁻ + ν̄e (Z+1, A unchanged). Stopped by Al foil.' },
                    { color: '#a78bfa', label: 'β⁺ decay', desc: 'p→n + e⁺ + νe (Z−1). Stopped by Al, annihilates → 2γ.' },
                    { color: '#22c55e', label: 'γ emission', desc: 'Nuclear energy level change. Penetrating, needs Pb shielding.' },
                  ].map(item => (
                    <div key={item.label} style={{ flex: 1, background: `${item.color}0f`, border: `1px solid ${item.color}30`, borderRadius: 9, padding: '8px 10px' }}>
                      <div style={{ fontSize: 10, color: item.color, fontWeight: 700 }}>{item.label}</div>
                      <div style={{ fontSize: 9, color: '#849495', marginTop: 3 }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ width: 185, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 12, overflowY: 'auto', fontSize: 9 }}>
          <div style={{ color: iso.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Nuclear Decay Laws</div>
          {[
            { title: 'Decay Law', content: 'N(t) = N₀ e^(−λt)\nλ = decay constant = ln2/t½\nA = activity = λN (Bq)\n1 Ci = 3.7×10¹⁰ Bq', color: iso.color },
            { title: 'Half-life Formulas', content: 'N = N₀(½)^n   (n = # half-lives)\nN = N₀ e^(−0.693t/t½)\nt = (t½/ln2) × ln(N₀/N)\nFor % remaining: (t½ × log(N/N₀))/log(½)', color: '#fbbf24' },
            { title: 'Carbon Dating', content: 'C-14: t½ = 5730 y\nAtmospheric ¹⁴C constant in living organisms\nDeath → ¹⁴C/¹²C decreases\nt = −8267 ln(A/A₀) years\nUsable range: ~100–50,000 years', color: '#22c55e' },
            { title: 'Binding Energy', content: 'BE = (Zmp + Nmn − M)c²\nPeak at Fe-56 (~8.8 MeV/A)\nFusion (H→He): gain BE\nFission (U→smaller): gain BE\nMass defect: Δm = BE/c²', color: '#06b6d4' },
            { title: 'Radioactive Series', content: 'Uranium series: U-238 → Pb-206\nThorium series: Th-232 → Pb-208\nActinium series: U-235 → Pb-207\nNeptunium series: Np-237 → Bi-209\n(Artificial — no natural Np)', color: '#f97316' },
            { title: 'Geiger-Nuttall Law', content: 'log(λ) = A − B/√E\nHigher α energy → shorter t½\nPo-212: t½ = 0.3 μs, E = 8.78 MeV\nTh-232: t½ = 14 Gy, E = 4.08 MeV', color: '#a78bfa' },
          ].map(item => (
            <div key={item.title} style={{ marginBottom: 10, padding: '7px 9px', background: `${item.color}08`, border: `1px solid ${item.color}25`, borderRadius: 9 }}>
              <div style={{ color: item.color, fontWeight: 700, marginBottom: 3 }}>{item.title}</div>
              <div style={{ color: '#849495', whiteSpace: 'pre-line', lineHeight: 1.5 }}>{item.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function decayTypeColor(type: string) {
  if (type.startsWith('α')) return '#f97316'
  if (type.startsWith('β⁺')) return '#22c55e'
  if (type.startsWith('β⁻')) return '#06b6d4'
  return '#a78bfa'
}
