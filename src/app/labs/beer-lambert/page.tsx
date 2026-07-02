'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'

// ── Beer-Lambert Law Lab ─────────────────────────────────────────────────
// A = ε·b·c (absorbance = molar absorptivity × path length × concentration).
// Adjust concentration, watch the cuvette darken and absorbance rise, then
// "measure" points onto a calibration curve and use its slope to back out
// an unknown sample's concentration — the classic AP Chem skill.
//
// ε values here are illustrative round numbers (real molar absorptivity is
// wavelength-dependent — the same compound has a different ε at every λ),
// not claimed as exact published constants.

type Compound = { name: string; color: string; epsilon: number }
const COMPOUNDS: Compound[] = [
  { name: 'Blue dye solution', color: '#3b82f6', epsilon: 1200 },
  { name: 'Purple solution (KMnO₄-like)', color: '#a855f7', epsilon: 2400 },
  { name: 'Red food dye', color: '#ef4444', epsilon: 600 },
  { name: 'Yellow-green solution', color: '#84cc16', epsilon: 300 },
]

const PATH_LENGTH = 1.0 // cm, standard cuvette
const MAX_C = 0.02 // mol/L

function absorbance(epsilon: number, c: number) {
  return epsilon * PATH_LENGTH * c
}

type Point = { c: number; a: number }

export default function BeerLambertLab() {
  const [compoundIdx, setCompoundIdx] = useState(1)
  const compound = COMPOUNDS[compoundIdx]
  const [conc, setConc] = useState(0.005)
  const [points, setPoints] = useState<Point[]>([])

  const [unknownA, setUnknownA] = useState('')
  const [revealedC, setRevealedC] = useState<number | null>(null)

  const A = absorbance(compound.epsilon, conc)
  const T = Math.pow(10, -A)
  const opacity = Math.min(0.95, 1 - Math.pow(10, -A))

  function measure() {
    setPoints(prev => {
      const exists = prev.some(p => Math.abs(p.c - conc) < 1e-6)
      if (exists) return prev
      return [...prev, { c: conc, a: A }].sort((x, y) => x.c - y.c)
    })
  }

  // slope from collected points (theoretical slope = epsilon * b; estimate from data if we have any)
  const slope = points.length > 0
    ? points.reduce((s, p) => s + p.a / p.c, 0) / points.length
    : compound.epsilon * PATH_LENGTH

  function solveUnknown() {
    const aVal = parseFloat(unknownA)
    if (!isFinite(aVal) || points.length < 2) { setRevealedC(null); return }
    setRevealedC(aVal / slope)
  }

  // plot geometry
  const PX0 = 60, PX1 = 460, PY0 = 20, PY1 = 260
  const maxA = Math.max(2.5, ...points.map(p => p.a), unknownA ? parseFloat(unknownA) || 0 : 0)
  const xFor = (c: number) => PX0 + (c / MAX_C) * (PX1 - PX0)
  const yFor = (a: number) => PY1 - (a / maxA) * (PY1 - PY0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 52, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#a6b0b1', textDecoration: 'none', fontSize: 16 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 19 }}>Beer-Lambert Law Lab</strong>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: controls */}
        <div style={{ width: 340, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 24, overflowY: 'auto' }}>
          <div style={{ fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Solution</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
            {COMPOUNDS.map((c, i) => (
              <button key={c.name} onClick={() => { setCompoundIdx(i); setPoints([]); setRevealedC(null) }}
                style={{ padding: '7px 11px', borderRadius: 7, border: `1px solid ${i === compoundIdx ? c.color : 'rgba(255,255,255,0.1)'}`, background: i === compoundIdx ? `${c.color}22` : 'transparent', color: i === compoundIdx ? c.color : '#a6b0b1', fontSize: 15, cursor: 'pointer' }}>
                {c.name}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 15, color: '#a6b0b1', marginBottom: 8 }}>Concentration: <strong style={{ color: '#f8fafc', fontFamily: 'monospace' }}>{conc.toFixed(4)} M</strong></div>
          <input type="range" min={0.0005} max={MAX_C} step={0.0005} value={conc} onChange={e => setConc(Number(e.target.value))}
            style={{ width: '100%', marginBottom: 18 }} />

          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ fontSize: 15, color: '#a6b0b1' }}>Absorbance A</div>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'monospace', color: compound.color }}>{A.toFixed(3)}</div>
            </div>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ fontSize: 15, color: '#a6b0b1' }}>%Transmittance</div>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'monospace', color: '#67e8f9' }}>{(T * 100).toFixed(1)}%</div>
            </div>
          </div>

          <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 12, padding: '14px 16px', marginBottom: 18 }}>
            <div style={{ fontSize: 15, color: '#a6b0b1', marginBottom: 8 }}>A = ε · b · c</div>
            <div style={{ fontSize: 16, fontFamily: 'monospace', color: '#67e8f9', lineHeight: 1.8 }}>
              <div>= {compound.epsilon} × {PATH_LENGTH.toFixed(2)} × {conc.toFixed(4)}</div>
              <div style={{ fontWeight: 800, color: '#22d3ee', fontSize: 18 }}>= {A.toFixed(3)}</div>
            </div>
          </div>

          <button onClick={measure} style={{ width: '100%', padding: '11px 0', borderRadius: 9, border: '1px solid rgba(34,211,238,0.4)', background: 'rgba(34,211,238,0.12)', color: '#22d3ee', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 18 }}>
            ➕ Measure this point
          </button>

          <div style={{ fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Find an unknown</div>
          <div style={{ fontSize: 15, color: '#a6b0b1', lineHeight: 1.6, marginBottom: 10 }}>
            Once you've measured at least 2 points, enter a mystery sample's absorbance to solve for its concentration using the calibration line.
          </div>
          <input value={unknownA} onChange={e => { setUnknownA(e.target.value); setRevealedC(null) }} placeholder="Unknown absorbance"
            type="number" step="0.01"
            style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, color: '#f8fafc', fontSize: 16, padding: '8px 10px', marginBottom: 10 }} />
          <button onClick={solveUnknown} disabled={points.length < 2} style={{ width: '100%', padding: '9px 0', borderRadius: 8, border: '1px solid rgba(167,139,250,0.4)', background: points.length < 2 ? 'rgba(255,255,255,0.03)' : 'rgba(167,139,250,0.12)', color: points.length < 2 ? '#525a72' : '#a78bfa', fontSize: 16, fontWeight: 700, cursor: points.length < 2 ? 'not-allowed' : 'pointer' }}>
            Solve for concentration
          </button>
          {revealedC !== null && (
            <div style={{ marginTop: 10, padding: '11px 14px', borderRadius: 9, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#86efac', fontSize: 16 }}>
              c = A / slope = {unknownA} / {slope.toFixed(0)} ≈ <strong>{revealedC.toExponential(2)} M</strong>
            </div>
          )}
        </div>

        {/* Main: cuvette + calibration plot */}
        <div style={{ flex: 1, overflow: 'auto', padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
            {/* light source */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#fde68a', boxShadow: '0 0 16px #fde68a' }} />
              <div style={{ fontSize: 15, color: '#a6b0b1', marginTop: 6 }}>source</div>
            </div>
            <div style={{ width: 60, height: 3, background: 'linear-gradient(to right, #fde68a, #fde68a99)' }} />
            {/* cuvette */}
            <div style={{ textAlign: 'center' }}>
              <svg width={70} height={140} viewBox="0 0 70 140">
                <rect x={5} y={5} width={60} height={130} rx={4} fill="none" stroke="#7c8590" strokeWidth={2} />
                <rect x={8} y={8} width={54} height={124} rx={2} fill={compound.color} fillOpacity={opacity} />
              </svg>
              <div style={{ fontSize: 15, color: '#a6b0b1', marginTop: 4 }}>cuvette (b = 1 cm)</div>
            </div>
            <div style={{ width: 60, height: 3, background: `linear-gradient(to right, ${compound.color}, transparent)`, opacity: T }} />
            {/* detector */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 26, height: 26, borderRadius: 6, background: '#1e293b', border: '2px solid #475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: '#94a3b8' }}>det</div>
              <div style={{ fontSize: 15, color: '#a6b0b1', marginTop: 6 }}>{(T * 100).toFixed(0)}% reaches here</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 16, color: '#a6b0b1', marginBottom: 10, textAlign: 'center' }}>Calibration curve — Absorbance vs Concentration</div>
            <svg viewBox="0 0 480 280" width="100%" style={{ maxWidth: 520 }}>
              <line x1={PX0} y1={PY1} x2={PX1} y2={PY1} stroke="#3a4060" strokeWidth={1.5} />
              <line x1={PX0} y1={PY0} x2={PX0} y2={PY1} stroke="#3a4060" strokeWidth={1.5} />
              <text x={(PX0 + PX1) / 2} y={275} fill="#a6b0b1" fontSize={15} textAnchor="middle">Concentration (M)</text>
              <text x={18} y={(PY0 + PY1) / 2} fill="#a6b0b1" fontSize={15} textAnchor="middle" transform={`rotate(-90, 18, ${(PY0 + PY1) / 2})`}>Absorbance</text>

              {points.length > 0 && (
                <line x1={xFor(0)} y1={yFor(0)} x2={xFor(MAX_C)} y2={yFor(slope * MAX_C)} stroke={compound.color} strokeWidth={2} strokeDasharray="5,4" opacity={0.7} />
              )}
              {points.map((p, i) => (
                <circle key={i} cx={xFor(p.c)} cy={yFor(p.a)} r={6} fill={compound.color} stroke="#fff" strokeWidth={1.5} />
              ))}
              {revealedC !== null && (
                <circle cx={xFor(revealedC)} cy={yFor(parseFloat(unknownA))} r={7} fill="none" stroke="#86efac" strokeWidth={2.5} />
              )}
              <circle cx={xFor(conc)} cy={yFor(A)} r={5} fill="none" stroke="#f8fafc" strokeWidth={2} />
            </svg>
          </div>

          <div style={{ fontSize: 15, color: '#7c8590', lineHeight: 1.8, maxWidth: 600, textAlign: 'center' }}>
            The white-outlined ring is your current live reading. Filled dots are measured points. The dashed line is the calibration line through them (slope = ε·b). Molar absorptivity (ε) values here are illustrative round numbers — real ε is wavelength-dependent.
          </div>
        </div>
      </div>
    </div>
  )
}
