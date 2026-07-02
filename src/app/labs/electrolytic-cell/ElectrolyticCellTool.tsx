'use client'
import Link from 'next/link'
import { useState } from 'react'

// ── Electrolytic Cell Simulator ──────────────────────────────────────────
// Electrolysis uses an external power source to force a non-spontaneous
// redox reaction. Unlike a galvanic cell, the anode here is wired to the
// POSITIVE terminal (oxidation still happens at the anode, reduction still
// happens at the cathode — only the wiring convention flips). Faraday's
// law connects current and time to the amount of product:
// charge Q = I·t, moles e⁻ = Q / F (F = 96485 C/mol), moles product =
// moles e⁻ ÷ n (electrons per mole of product, from the half-reaction).

const FARADAY = 96485
const MOLAR_VOLUME_STP = 22.4 // L/mol

type HalfRxn = { label: string; eq: string; n: number; product: string; molarMass?: number; isGas?: boolean }
type Scenario = { name: string; electrolyte: string; cathode: HalfRxn; anode: HalfRxn }

const SCENARIOS: Scenario[] = [
  {
    name: 'Molten NaCl',
    electrolyte: 'molten NaCl (industrial sodium/chlorine production)',
    cathode: { label: 'Cathode (reduction)', eq: 'Na⁺ + e⁻ → Na(l)', n: 1, product: 'Na', molarMass: 22.99 },
    anode: { label: 'Anode (oxidation)', eq: '2Cl⁻ → Cl₂(g) + 2e⁻', n: 2, product: 'Cl₂', isGas: true },
  },
  {
    name: 'Water (acidified)',
    electrolyte: 'water with a little H₂SO₄ to carry current',
    cathode: { label: 'Cathode (reduction)', eq: '2H⁺ + 2e⁻ → H₂(g)', n: 2, product: 'H₂', isGas: true },
    anode: { label: 'Anode (oxidation)', eq: '2H₂O → O₂(g) + 4H⁺ + 4e⁻', n: 4, product: 'O₂', isGas: true },
  },
  {
    name: 'CuSO₄ (electroplating)',
    electrolyte: 'CuSO₄ solution with copper electrodes',
    cathode: { label: 'Cathode (reduction)', eq: 'Cu²⁺ + 2e⁻ → Cu(s)', n: 2, product: 'Cu', molarMass: 63.55 },
    anode: { label: 'Anode (oxidation)', eq: 'Cu(s) → Cu²⁺ + 2e⁻', n: 2, product: 'Cu²⁺ (dissolves into solution)' },
  },
  {
    name: 'Molten Al₂O₃',
    electrolyte: 'molten Al₂O₃ (Hall-Héroult process)',
    cathode: { label: 'Cathode (reduction)', eq: 'Al³⁺ + 3e⁻ → Al(l)', n: 3, product: 'Al', molarMass: 26.98 },
    anode: { label: 'Anode (oxidation)', eq: '2O²⁻ → O₂(g) + 4e⁻', n: 4, product: 'O₂', isGas: true },
  },
]

export default function ElectrolyticCellSimulator() {
  const [idx, setIdx] = useState(0)
  const s = SCENARIOS[idx]
  const [current, setCurrent] = useState(2)
  const [minutes, setMinutes] = useState(30)

  const seconds = minutes * 60
  const charge = current * seconds
  const molesE = charge / FARADAY

  function productAmount(h: HalfRxn) {
    const moles = molesE / h.n
    if (h.isGas) return { moles, value: moles * MOLAR_VOLUME_STP, unit: 'L (at STP)' }
    if (h.molarMass) return { moles, value: moles * h.molarMass, unit: 'g' }
    return { moles, value: moles, unit: 'mol' }
  }

  const cathodeAmt = productAmount(s.cathode)
  const anodeAmt = productAmount(s.anode)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 52, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#a6b0b1', textDecoration: 'none', fontSize: 16 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 19 }}>Electrolytic Cell Simulator</strong>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: controls */}
        <div style={{ width: 340, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 24, overflowY: 'auto' }}>
          <div style={{ fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Electrolyte</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 22 }}>
            {SCENARIOS.map((sc, i) => (
              <button key={sc.name} onClick={() => setIdx(i)}
                style={{ padding: '9px 12px', borderRadius: 8, border: `1px solid ${i === idx ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.1)'}`, background: i === idx ? 'rgba(34,211,238,0.12)' : 'transparent', color: i === idx ? '#22d3ee' : '#a6b0b1', fontSize: 15, cursor: 'pointer', textAlign: 'left' }}>
                {sc.name}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 15, color: '#a6b0b1', marginBottom: 8 }}>Current: <strong style={{ color: '#f8fafc', fontFamily: 'monospace' }}>{current} A</strong></div>
          <input type="range" min={0.5} max={10} step={0.5} value={current} onChange={e => setCurrent(Number(e.target.value))} style={{ width: '100%', marginBottom: 16 }} />

          <div style={{ fontSize: 15, color: '#a6b0b1', marginBottom: 8 }}>Time: <strong style={{ color: '#f8fafc', fontFamily: 'monospace' }}>{minutes} min</strong></div>
          <input type="range" min={1} max={120} step={1} value={minutes} onChange={e => setMinutes(Number(e.target.value))} style={{ width: '100%', marginBottom: 22 }} />

          <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 12, padding: '14px 16px', fontSize: 15, fontFamily: 'monospace', lineHeight: 1.8 }}>
            <div>Q = It = {current} × {seconds} = {charge.toFixed(0)} C</div>
            <div>mol e⁻ = Q/F = {charge.toFixed(0)} / 96485</div>
            <div style={{ color: '#67e8f9', fontWeight: 700 }}>= {molesE.toFixed(4)} mol e⁻</div>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, overflow: 'auto', padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <div style={{ fontSize: 15, color: '#7c8590' }}>{s.electrolyte}</div>

          {/* cell diagram */}
          <svg viewBox="0 0 360 160" width="100%" style={{ maxWidth: 420 }}>
            <rect x={40} y={30} width={280} height={110} rx={8} fill="rgba(96,165,250,0.08)" stroke="#3a4060" strokeWidth={1.5} />
            <line x1={90} y1={20} x2={90} y2={135} stroke="#94a3b8" strokeWidth={6} />
            <line x1={270} y1={20} x2={270} y2={135} stroke="#94a3b8" strokeWidth={6} />
            <text x={90} y={14} fill="#fbbf24" fontSize={16} fontWeight={700} textAnchor="middle">+</text>
            <text x={270} y={14} fill="#60a5fa" fontSize={16} fontWeight={700} textAnchor="middle">−</text>
            <text x={90} y={150} fill="#fbbf24" fontSize={15} fontWeight={700} textAnchor="middle">Anode</text>
            <text x={270} y={150} fill="#60a5fa" fontSize={15} fontWeight={700} textAnchor="middle">Cathode</text>
            <line x1={90} y1={10} x2={270} y2={10} stroke="#525a72" strokeWidth={2} />
            <rect x={160} y={0} width={40} height={20} fill="#1e293b" stroke="#525a72" strokeWidth={1.5} />
            <text x={180} y={14} fill="#a6b0b1" fontSize={15} textAnchor="middle">⎓</text>
          </svg>

          <div style={{ display: 'flex', gap: 18, width: '100%', maxWidth: 680, flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ flex: 1, minWidth: 280, background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.25)', borderRadius: 14, padding: '16px 20px' }}>
              <div style={{ fontSize: 15, color: '#60a5fa', fontWeight: 700, marginBottom: 6 }}>{s.cathode.label}</div>
              <div style={{ fontSize: 17, fontFamily: 'monospace', color: '#cbd5e1', marginBottom: 10 }}>{s.cathode.eq}</div>
              <div style={{ fontSize: 15, color: '#a6b0b1', marginBottom: 4 }}>mol {s.cathode.product} = {molesE.toFixed(4)} / {s.cathode.n} = {cathodeAmt.moles.toFixed(4)}</div>
              <div style={{ fontSize: 19, fontWeight: 800, fontFamily: 'monospace', color: '#93c5fd' }}>{cathodeAmt.value.toFixed(3)} {cathodeAmt.unit} {s.cathode.product}</div>
            </div>
            <div style={{ flex: 1, minWidth: 280, background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: 14, padding: '16px 20px' }}>
              <div style={{ fontSize: 15, color: '#fbbf24', fontWeight: 700, marginBottom: 6 }}>{s.anode.label}</div>
              <div style={{ fontSize: 17, fontFamily: 'monospace', color: '#cbd5e1', marginBottom: 10 }}>{s.anode.eq}</div>
              <div style={{ fontSize: 15, color: '#a6b0b1', marginBottom: 4 }}>mol {s.anode.product} = {molesE.toFixed(4)} / {s.anode.n} = {anodeAmt.moles.toFixed(4)}</div>
              <div style={{ fontSize: 19, fontWeight: 800, fontFamily: 'monospace', color: '#fde047' }}>{anodeAmt.value.toFixed(3)} {anodeAmt.unit} {s.anode.product}</div>
            </div>
          </div>

          <div style={{ fontSize: 15, color: '#7c8590', lineHeight: 1.8, maxWidth: 620, textAlign: 'center' }}>
            Note the wiring: in an electrolytic cell the anode connects to the <strong style={{ color: '#fbbf24' }}>positive</strong> terminal and the cathode to the <strong style={{ color: '#60a5fa' }}>negative</strong> terminal — the opposite of a galvanic cell, because here the power source is forcing electrons to flow against their spontaneous direction.
          </div>
        </div>
      </div>
    </div>
  )
}
