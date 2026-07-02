'use client'
import Link from 'next/link'
import { useState } from 'react'

// ── IMF Comparator ───────────────────────────────────────────────────────
// Compare intermolecular forces between substances and predict relative
// boiling points. Every substance's molar mass, polarity, H-bonding
// capability, and real boiling point below are real reference values
// (web-verified for the famous comparison pairs: HF vs HCl, ethanol vs
// dimethyl ether, H2O vs H2S).

type Substance = { formula: string; name: string; mw: number; polar: boolean; hbond: boolean; bp: number }

const SUBSTANCES: Substance[] = [
  { formula: 'He', name: 'Helium', mw: 4, polar: false, hbond: false, bp: -269 },
  { formula: 'Ne', name: 'Neon', mw: 20, polar: false, hbond: false, bp: -246 },
  { formula: 'Ar', name: 'Argon', mw: 40, polar: false, hbond: false, bp: -186 },
  { formula: 'Kr', name: 'Krypton', mw: 84, polar: false, hbond: false, bp: -153 },
  { formula: 'Xe', name: 'Xenon', mw: 131, polar: false, hbond: false, bp: -108 },
  { formula: 'CH4', name: 'Methane', mw: 16, polar: false, hbond: false, bp: -161 },
  { formula: 'C2H6', name: 'Ethane', mw: 30, polar: false, hbond: false, bp: -89 },
  { formula: 'C3H8', name: 'Propane', mw: 44, polar: false, hbond: false, bp: -42 },
  { formula: 'C4H10', name: 'Butane', mw: 58, polar: false, hbond: false, bp: -1 },
  { formula: 'F2', name: 'Fluorine', mw: 38, polar: false, hbond: false, bp: -188 },
  { formula: 'Cl2', name: 'Chlorine', mw: 71, polar: false, hbond: false, bp: -34 },
  { formula: 'Br2', name: 'Bromine', mw: 160, polar: false, hbond: false, bp: 59 },
  { formula: 'I2', name: 'Iodine', mw: 254, polar: false, hbond: false, bp: 184 },
  { formula: 'CO2', name: 'Carbon dioxide', mw: 44, polar: false, hbond: false, bp: -78.5 },
  { formula: 'SO2', name: 'Sulfur dioxide', mw: 64, polar: true, hbond: false, bp: -10 },
  { formula: 'HF', name: 'Hydrogen fluoride', mw: 20, polar: true, hbond: true, bp: -19.5 },
  { formula: 'HCl', name: 'Hydrogen chloride', mw: 36.5, polar: true, hbond: false, bp: -85 },
  { formula: 'HBr', name: 'Hydrogen bromide', mw: 81, polar: true, hbond: false, bp: -67 },
  { formula: 'HI', name: 'Hydrogen iodide', mw: 128, polar: true, hbond: false, bp: -35 },
  { formula: 'H2O', name: 'Water', mw: 18, polar: true, hbond: true, bp: 100 },
  { formula: 'H2S', name: 'Hydrogen sulfide', mw: 34, polar: true, hbond: false, bp: -60 },
  { formula: 'NH3', name: 'Ammonia', mw: 17, polar: true, hbond: true, bp: -33 },
  { formula: 'PH3', name: 'Phosphine', mw: 34, polar: true, hbond: false, bp: -87 },
  { formula: 'CH3OH', name: 'Methanol', mw: 32, polar: true, hbond: true, bp: 65 },
  { formula: 'C2H5OH', name: 'Ethanol', mw: 46, polar: true, hbond: true, bp: 78 },
  { formula: 'CH3OCH3', name: 'Dimethyl ether', mw: 46, polar: true, hbond: false, bp: -24 },
]

const FAMOUS_PAIRS: [string, string][] = [
  ['H2O', 'H2S'], ['HF', 'HCl'], ['C2H5OH', 'CH3OCH3'], ['NH3', 'PH3'],
  ['CH4', 'C4H10'], ['CO2', 'SO2'], ['F2', 'I2'], ['Cl2', 'Br2'],
]

function imfList(s: Substance): string[] {
  const list = ['London dispersion']
  if (s.polar) list.push('Dipole–dipole')
  if (s.hbond) list.push('Hydrogen bonding')
  return list
}
function strongestIMF(s: Substance): string {
  if (s.hbond) return 'Hydrogen bonding'
  if (s.polar) return 'Dipole–dipole'
  return 'London dispersion'
}

type Mode = 'explore' | 'predict'

export default function IMFComparator() {
  const [mode, setMode] = useState<Mode>('explore')
  const [a, setA] = useState('H2O')
  const [b, setB] = useState('H2S')

  const [pairIdx, setPairIdx] = useState(0)
  const [pick, setPick] = useState<string | null>(null)

  const subA = SUBSTANCES.find(s => s.formula === a)!
  const subB = SUBSTANCES.find(s => s.formula === b)!

  const [pa, pb] = FAMOUS_PAIRS[pairIdx]
  const predA = SUBSTANCES.find(s => s.formula === pa)!
  const predB = SUBSTANCES.find(s => s.formula === pb)!
  const correctHigher = predA.bp >= predB.bp ? predA.formula : predB.formula

  function newPrediction() {
    setPairIdx(Math.floor(Math.random() * FAMOUS_PAIRS.length))
    setPick(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 52, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#a6b0b1', textDecoration: 'none', fontSize: 16 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 19 }}>IMF Comparator</strong>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: controls */}
        <div style={{ width: 330, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 24, overflowY: 'auto' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
            <button onClick={() => setMode('explore')} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: `1px solid ${mode === 'explore' ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.1)'}`, background: mode === 'explore' ? 'rgba(34,211,238,0.12)' : 'transparent', color: mode === 'explore' ? '#22d3ee' : '#a6b0b1', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Compare</button>
            <button onClick={() => { setMode('predict'); newPrediction() }} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: `1px solid ${mode === 'predict' ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.1)'}`, background: mode === 'predict' ? 'rgba(167,139,250,0.12)' : 'transparent', color: mode === 'predict' ? '#a78bfa' : '#a6b0b1', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Predict</button>
          </div>

          {mode === 'explore' && (
            <>
              <div style={{ fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Compare two substances</div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
                <select value={a} onChange={e => setA(e.target.value)} style={selStyle}>
                  {SUBSTANCES.map(s => <option key={s.formula} value={s.formula}>{s.formula}</option>)}
                </select>
                <select value={b} onChange={e => setB(e.target.value)} style={selStyle}>
                  {SUBSTANCES.map(s => <option key={s.formula} value={s.formula}>{s.formula}</option>)}
                </select>
              </div>

              <div style={{ fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Famous pairs</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
                {FAMOUS_PAIRS.map(([x, y], i) => (
                  <button key={i} onClick={() => { setA(x); setB(y) }}
                    style={{ padding: '6px 10px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: (a === x && b === y) ? 'rgba(34,211,238,0.15)' : 'transparent', color: (a === x && b === y) ? '#22d3ee' : '#a6b0b1', fontSize: 15, cursor: 'pointer', fontFamily: 'monospace' }}>
                    {x} vs {y}
                  </button>
                ))}
              </div>
            </>
          )}

          {mode === 'predict' && (
            <>
              <div style={{ fontSize: 16, color: '#a6b0b1', lineHeight: 1.7, marginBottom: 18 }}>
                Which has the <strong style={{ color: '#f8fafc' }}>higher boiling point</strong>: <strong style={{ color: '#22d3ee' }}>{pa}</strong> or <strong style={{ color: '#f472b6' }}>{pb}</strong>?
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                {[pa, pb].map(formula => {
                  const show = pick !== null
                  const isAnswer = formula === correctHigher
                  const isPicked = pick === formula
                  return (
                    <button key={formula} onClick={() => setPick(formula)}
                      style={{
                        padding: '12px 14px', borderRadius: 9, fontSize: 17, fontWeight: 700, cursor: pick ? 'default' : 'pointer', textAlign: 'left',
                        border: `1.5px solid ${show && isAnswer ? '#4ade80' : show && isPicked ? '#f87171' : 'rgba(255,255,255,0.12)'}`,
                        background: show && isAnswer ? 'rgba(74,222,128,0.12)' : show && isPicked ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.03)',
                        color: show && isAnswer ? '#86efac' : show && isPicked ? '#fca5a5' : '#cbd5e1',
                      }}>
                      {formula} {show && isAnswer ? '✓' : show && isPicked ? '✗' : ''}
                    </button>
                  )
                })}
              </div>
              {pick !== null && (
                <div style={{ fontSize: 15, color: '#a6b0b1', marginBottom: 14, lineHeight: 1.8 }}>
                  {pa}: {predA.bp}°C, strongest IMF = <strong style={{ color: '#f8fafc' }}>{strongestIMF(predA)}</strong><br />
                  {pb}: {predB.bp}°C, strongest IMF = <strong style={{ color: '#f8fafc' }}>{strongestIMF(predB)}</strong>
                </div>
              )}
              <button onClick={newPrediction} style={{ width: '100%', padding: '9px 0', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#a6b0b1', fontSize: 15, cursor: 'pointer' }}>
                New pair
              </button>
            </>
          )}

          <div style={{ marginTop: 26, fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Strength order</div>
          <div style={{ fontSize: 15, color: '#a6b0b1', lineHeight: 1.9 }}>
            <div>London dispersion <span style={{ color: '#525a72' }}>(all molecules; grows with size)</span></div>
            <div>&lt; Dipole–dipole <span style={{ color: '#525a72' }}>(polar molecules)</span></div>
            <div>&lt; Hydrogen bonding <span style={{ color: '#525a72' }}>(H bonded to N, O, or F)</span></div>
          </div>
        </div>

        {/* Main: comparison cards */}
        <div style={{ flex: 1, overflow: 'auto', padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {(() => {
            const left = mode === 'explore' ? subA : predA
            const right = mode === 'explore' ? subB : predB
            const showBP = mode === 'explore' || pick !== null
            return (
              <div style={{ display: 'flex', gap: 24, width: '100%', maxWidth: 760, marginBottom: 24 }}>
                {[left, right].map((s, i) => (
                  <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '20px 22px' }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color: i === 0 ? '#22d3ee' : '#f472b6', marginBottom: 2 }}>{s.formula}</div>
                    <div style={{ fontSize: 16, color: '#cbd5e1', marginBottom: 16 }}>{s.name}</div>
                    <div style={{ fontSize: 15, color: '#a6b0b1', marginBottom: 10 }}>Molar mass: <strong style={{ color: '#f8fafc' }}>{s.mw} g/mol</strong></div>
                    <div style={{ fontSize: 15, color: '#a6b0b1', marginBottom: 6 }}>Intermolecular forces:</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
                      {imfList(s).map(f => (
                        <div key={f} style={{ fontSize: 15, color: f === 'Hydrogen bonding' ? '#f87171' : f === 'Dipole–dipole' ? '#fbbf24' : '#4ade80', fontWeight: 600 }}>✓ {f}</div>
                      ))}
                    </div>
                    {showBP && (
                      <div style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.25)', borderRadius: 10, padding: '10px 14px' }}>
                        <div style={{ fontSize: 15, color: '#a6b0b1' }}>Boiling point</div>
                        <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'monospace', color: '#22d3ee' }}>{s.bp}°C</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          })()}

          <div style={{ fontSize: 15, color: '#7c8590', lineHeight: 1.8, maxWidth: 700, textAlign: 'center' }}>
            All molecules feel London dispersion forces; it's the strongest force PRESENT that usually dominates boiling point — though a much heavier molecule's dispersion forces can still outweigh a lighter molecule's dipole-dipole forces. Boiling points are real reference values.
          </div>
        </div>
      </div>
    </div>
  )
}

const selStyle: React.CSSProperties = {
  flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8,
  color: '#f8fafc', fontSize: 16, fontFamily: 'monospace', padding: '8px 6px', textAlign: 'center',
}
