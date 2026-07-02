'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'

// ── Stoichiometry Mapper ─────────────────────────────────────────────────
// The classic "stoichiometry road map": grams/particles of A → moles A →
// (mole-ratio bridge from the balanced equation) → moles B → grams/particles
// of B. Molar masses below are hand-calculated from standard atomic masses
// (H=1.008, C=12.01, N=14.01, O=16.00, Al=26.98, Cl=35.45, Ca=40.08) and
// verified by hand.

const AVOGADRO = 6.022e23

type Unit = 'grams' | 'moles' | 'particles'
const UNITS: Unit[] = ['grams', 'moles', 'particles']
const UNIT_LABEL: Record<Unit, string> = { grams: 'g', moles: 'mol', particles: 'particles' }

type Substance = { formula: string; molarMass: number; coeff: number }
type ReactionDef = { eq: string; substances: Substance[] }

const REACTIONS: ReactionDef[] = [
  { eq: '2H₂ + O₂ → 2H₂O', substances: [
    { formula: 'H₂', molarMass: 2.02, coeff: 2 },
    { formula: 'O₂', molarMass: 32.00, coeff: 1 },
    { formula: 'H₂O', molarMass: 18.02, coeff: 2 },
  ]},
  { eq: 'N₂ + 3H₂ → 2NH₃', substances: [
    { formula: 'N₂', molarMass: 28.02, coeff: 1 },
    { formula: 'H₂', molarMass: 2.02, coeff: 3 },
    { formula: 'NH₃', molarMass: 17.03, coeff: 2 },
  ]},
  { eq: 'CH₄ + 2O₂ → CO₂ + 2H₂O', substances: [
    { formula: 'CH₄', molarMass: 16.04, coeff: 1 },
    { formula: 'O₂', molarMass: 32.00, coeff: 2 },
    { formula: 'CO₂', molarMass: 44.01, coeff: 1 },
    { formula: 'H₂O', molarMass: 18.02, coeff: 2 },
  ]},
  { eq: '2Al + 3Cl₂ → 2AlCl₃', substances: [
    { formula: 'Al', molarMass: 26.98, coeff: 2 },
    { formula: 'Cl₂', molarMass: 70.90, coeff: 3 },
    { formula: 'AlCl₃', molarMass: 133.33, coeff: 2 },
  ]},
  { eq: 'CaCO₃ → CaO + CO₂', substances: [
    { formula: 'CaCO₃', molarMass: 100.09, coeff: 1 },
    { formula: 'CaO', molarMass: 56.08, coeff: 1 },
    { formula: 'CO₂', molarMass: 44.01, coeff: 1 },
  ]},
]

function toMoles(value: number, unit: Unit, molarMass: number) {
  if (unit === 'grams') return value / molarMass
  if (unit === 'particles') return value / AVOGADRO
  return value
}
function fromMoles(moles: number, unit: Unit, molarMass: number) {
  if (unit === 'grams') return moles * molarMass
  if (unit === 'particles') return moles * AVOGADRO
  return moles
}
function fmt(n: number) {
  if (n === 0) return '0'
  if (Math.abs(n) >= 100000 || Math.abs(n) < 0.001) return n.toExponential(3)
  return n.toPrecision(4).replace(/\.?0+$/, '')
}

export default function StoichiometryMapper() {
  const [rxnIdx, setRxnIdx] = useState(0)
  const r = REACTIONS[rxnIdx]
  const [fromIdx, setFromIdx] = useState(0)
  const [toIdx, setToIdx] = useState(1)
  const [fromUnit, setFromUnit] = useState<Unit>('grams')
  const [toUnit, setToUnit] = useState<Unit>('grams')
  const [fromValue, setFromValue] = useState(10)

  const from = r.substances[fromIdx]
  const to = r.substances[toIdx % r.substances.length]

  const molesFrom = toMoles(fromValue, fromUnit, from.molarMass)
  const molesTo = molesFrom * (to.coeff / from.coeff)
  const result = fromMoles(molesTo, toUnit, to.molarMass)

  function selectReaction(i: number) {
    setRxnIdx(i)
    setFromIdx(0)
    setToIdx(1)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 52, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#a6b0b1', textDecoration: 'none', fontSize: 16 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 19 }}>Stoichiometry Mapper</strong>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: controls */}
        <div style={{ width: 340, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 24, overflowY: 'auto' }}>
          <div style={{ fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Reaction</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 22 }}>
            {REACTIONS.map((rx, i) => (
              <button key={rx.eq} onClick={() => selectReaction(i)}
                style={{ padding: '9px 12px', borderRadius: 8, border: `1px solid ${i === rxnIdx ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.1)'}`, background: i === rxnIdx ? 'rgba(34,211,238,0.12)' : 'transparent', color: i === rxnIdx ? '#22d3ee' : '#a6b0b1', fontSize: 15, fontFamily: 'monospace', cursor: 'pointer', textAlign: 'left' }}>
                {rx.eq}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Given</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <select value={fromIdx} onChange={e => setFromIdx(Number(e.target.value))} style={selStyle}>
              {r.substances.map((s, i) => <option key={s.formula} value={i}>{s.formula}</option>)}
            </select>
            <select value={fromUnit} onChange={e => setFromUnit(e.target.value as Unit)} style={selStyle}>
              {UNITS.map(u => <option key={u} value={u}>{UNIT_LABEL[u]}</option>)}
            </select>
          </div>
          <input type="number" value={fromValue} onChange={e => setFromValue(Number(e.target.value) || 0)}
            style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, color: '#f8fafc', fontSize: 16, padding: '8px 10px', marginBottom: 20, fontFamily: 'monospace' }} />

          <div style={{ fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Find</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
            <select value={toIdx} onChange={e => setToIdx(Number(e.target.value))} style={selStyle}>
              {r.substances.map((s, i) => <option key={s.formula} value={i}>{s.formula}</option>)}
            </select>
            <select value={toUnit} onChange={e => setToUnit(e.target.value as Unit)} style={selStyle}>
              {UNITS.map(u => <option key={u} value={u}>{UNIT_LABEL[u]}</option>)}
            </select>
          </div>

          <div style={{ fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Molar masses</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {r.substances.map(s => (
              <div key={s.formula} style={{ fontSize: 15, color: '#7c8590', fontFamily: 'monospace' }}>{s.formula}: {s.molarMass} g/mol</div>
            ))}
          </div>
        </div>

        {/* Main: road map */}
        <div style={{ flex: 1, overflow: 'auto', padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 980 }}>
            <RoadBox label={`Given`} value={fmt(fromValue)} unit={UNIT_LABEL[fromUnit]} formula={from.formula} color="#22d3ee" />
            <Arrow text={fromUnit === 'grams' ? `÷ ${from.molarMass}` : fromUnit === 'particles' ? `÷ 6.022×10²³` : '(already mol)'} />
            <RoadBox label="moles" value={fmt(molesFrom)} unit="mol" formula={from.formula} color="#a78bfa" />
            <Arrow text={`× ${to.coeff}/${from.coeff}`} highlight />
            <RoadBox label="moles" value={fmt(molesTo)} unit="mol" formula={to.formula} color="#a78bfa" />
            <Arrow text={toUnit === 'grams' ? `× ${to.molarMass}` : toUnit === 'particles' ? `× 6.022×10²³` : '(stays mol)'} />
            <RoadBox label="Find" value={fmt(result)} unit={UNIT_LABEL[toUnit]} formula={to.formula} color="#4ade80" big />
          </div>

          <div style={{ fontSize: 15, color: '#7c8590', lineHeight: 1.8, maxWidth: 640, textAlign: 'center', marginTop: 24 }}>
            The mole-ratio bridge (middle arrow) comes straight from the balanced equation's coefficients — it's the only step that actually uses the chemistry. Everything before and after is just unit conversion.
          </div>
        </div>
      </div>
    </div>
  )
}

function RoadBox({ label, value, unit, formula, color, big }: { label: string; value: string; unit: string; formula: string; color: string; big?: boolean }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: `1.5px solid ${color}55`, borderRadius: 14, padding: big ? '20px 22px' : '16px 18px', minWidth: big ? 180 : 150, textAlign: 'center' }}>
      <div style={{ fontSize: 15, color: '#7c8590', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
      <div style={{ fontSize: big ? 26 : 22, fontWeight: 800, fontFamily: 'monospace', color }}>{value}</div>
      <div style={{ fontSize: 16, color: '#a6b0b1', marginTop: 4 }}>{unit} {formula}</div>
    </div>
  )
}

function Arrow({ text, highlight }: { text: string; highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 10px', minWidth: 90 }}>
      <div style={{ fontSize: 15, color: highlight ? '#fbbf24' : '#7c8590', fontFamily: 'monospace', marginBottom: 4, whiteSpace: 'nowrap' }}>{text}</div>
      <div style={{ fontSize: 22, color: highlight ? '#fbbf24' : '#525a72' }}>→</div>
    </div>
  )
}

const selStyle: React.CSSProperties = {
  flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7,
  color: '#f8fafc', fontSize: 15, fontFamily: 'monospace', padding: '7px 6px', textAlign: 'center',
}
