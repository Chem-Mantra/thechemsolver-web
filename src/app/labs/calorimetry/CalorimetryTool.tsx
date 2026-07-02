'use client'
import Link from 'next/link'
import { useState } from 'react'

// ── Calorimetry Lab ──────────────────────────────────────────────────────
// q = mcΔT, and heat lost by the hot object equals heat gained by the cold
// one: m₁c₁(T₁−Tf) = m₂c₂(Tf−T₂). Solving for Tf gives the equilibrium
// temperature reached when two substances are mixed. Specific heat values
// (J/g·°C) are the standard reference constants: water 4.184, aluminum
// 0.897, iron 0.449, copper 0.385, gold 0.129, lead 0.128, ethanol 2.44,
// glass 0.84.

type Material = { name: string; c: number; color: string }
const MATERIALS: Material[] = [
  { name: 'Water', c: 4.184, color: '#3b82f6' },
  { name: 'Aluminum', c: 0.897, color: '#94a3b8' },
  { name: 'Iron', c: 0.449, color: '#78716c' },
  { name: 'Copper', c: 0.385, color: '#fb923c' },
  { name: 'Gold', c: 0.129, color: '#fbbf24' },
  { name: 'Lead', c: 0.128, color: '#64748b' },
  { name: 'Ethanol', c: 2.44, color: '#a78bfa' },
  { name: 'Glass', c: 0.84, color: '#67e8f9' },
]

export default function CalorimetryLab() {
  const [mat1Idx, setMat1Idx] = useState(3) // copper
  const [mass1, setMass1] = useState(50)
  const [t1, setT1] = useState(95)

  const [mat2Idx, setMat2Idx] = useState(0) // water
  const [mass2, setMass2] = useState(150)
  const [t2, setT2] = useState(22)

  const m1 = MATERIALS[mat1Idx]
  const m2 = MATERIALS[mat2Idx]

  const tf = (mass1 * m1.c * t1 + mass2 * m2.c * t2) / (mass1 * m1.c + mass2 * m2.c)
  const q1 = mass1 * m1.c * (t1 - tf)
  const q2 = mass2 * m2.c * (tf - t2)

  const minT = Math.min(t1, t2) - 5
  const maxT = Math.max(t1, t2) + 5
  const pct = (v: number) => ((v - minT) / (maxT - minT)) * 100

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 52, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#a6b0b1', textDecoration: 'none', fontSize: 16 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 19 }}>Calorimetry Lab</strong>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: controls */}
        <div style={{ width: 360, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 24, overflowY: 'auto' }}>
          {[{ idx: mat1Idx, setIdx: setMat1Idx, mass: mass1, setMass: setMass1, t: t1, setT: setT1, label: 'Object 1 (hot)' },
            { idx: mat2Idx, setIdx: setMat2Idx, mass: mass2, setMass: setMass2, t: t2, setT: setT2, label: 'Object 2 (cold)' }].map((o, gi) => {
            const mat = MATERIALS[o.idx]
            return (
              <div key={gi} style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{o.label}</div>
                <select value={o.idx} onChange={e => o.setIdx(Number(e.target.value))}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${mat.color}55`, borderRadius: 8, color: mat.color, fontSize: 16, fontWeight: 700, padding: '8px 10px', marginBottom: 10 }}>
                  {MATERIALS.map((m, i) => <option key={m.name} value={i}>{m.name} (c = {m.c} J/g·°C)</option>)}
                </select>
                <div style={{ fontSize: 15, color: '#a6b0b1', marginBottom: 4 }}>Mass: <strong style={{ color: '#f8fafc', fontFamily: 'monospace' }}>{o.mass} g</strong></div>
                <input type="range" min={5} max={300} step={5} value={o.mass} onChange={e => o.setMass(Number(e.target.value))} style={{ width: '100%', marginBottom: 10 }} />
                <div style={{ fontSize: 15, color: '#a6b0b1', marginBottom: 4 }}>Initial temp: <strong style={{ color: '#f8fafc', fontFamily: 'monospace' }}>{o.t}°C</strong></div>
                <input type="range" min={0} max={100} step={1} value={o.t} onChange={e => o.setT(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
            )
          })}

          <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 15, color: '#a6b0b1', marginBottom: 8 }}>m₁c₁(T₁−Tf) = m₂c₂(Tf−T₂)</div>
            <div style={{ fontSize: 15, fontFamily: 'monospace', color: '#67e8f9', lineHeight: 1.7 }}>
              Tf = (m₁c₁T₁ + m₂c₂T₂) / (m₁c₁ + m₂c₂)
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, overflow: 'auto', padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26 }}>
          <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 16, padding: '20px 30px', textAlign: 'center' }}>
            <div style={{ fontSize: 15, color: '#a6b0b1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Equilibrium temperature</div>
            <div style={{ fontSize: 34, fontWeight: 900, fontFamily: 'monospace', color: '#86efac' }}>{tf.toFixed(1)}°C</div>
          </div>

          {/* temperature bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: '100%', maxWidth: 560 }}>
            {[{ label: m1.name, t: t1, color: m1.color }, { label: 'Equilibrium (Tf)', t: tf, color: '#86efac' }, { label: m2.name, t: t2, color: m2.color }].map((row, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, color: '#a6b0b1', marginBottom: 4 }}>
                  <span>{row.label}</span>
                  <span style={{ fontFamily: 'monospace', color: row.color }}>{row.t.toFixed(1)}°C</span>
                </div>
                <div style={{ height: 14, background: 'rgba(255,255,255,0.05)', borderRadius: 7, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct(row.t)}%`, background: row.color, borderRadius: 7, opacity: 0.8 }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 18px', minWidth: 220 }}>
              <div style={{ fontSize: 15, color: m1.color, fontWeight: 700, marginBottom: 6 }}>Heat released by {m1.name}</div>
              <div style={{ fontSize: 15, fontFamily: 'monospace', color: '#a6b0b1' }}>
                q = {mass1} × {m1.c} × ({t1} − {tf.toFixed(1)})
              </div>
              <div style={{ fontSize: 19, fontWeight: 800, fontFamily: 'monospace', color: '#f87171', marginTop: 4 }}>{Math.abs(q1).toFixed(0)} J</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 18px', minWidth: 220 }}>
              <div style={{ fontSize: 15, color: m2.color, fontWeight: 700, marginBottom: 6 }}>Heat absorbed by {m2.name}</div>
              <div style={{ fontSize: 15, fontFamily: 'monospace', color: '#a6b0b1' }}>
                q = {mass2} × {m2.c} × ({tf.toFixed(1)} − {t2})
              </div>
              <div style={{ fontSize: 19, fontWeight: 800, fontFamily: 'monospace', color: '#60a5fa', marginTop: 4 }}>{Math.abs(q2).toFixed(0)} J</div>
            </div>
          </div>

          <div style={{ fontSize: 15, color: '#7c8590', lineHeight: 1.8, maxWidth: 600, textAlign: 'center' }}>
            The two heat values are always equal in magnitude — that's the conservation-of-energy assumption behind every calorimetry problem (no heat lost to the surroundings). Water's unusually high specific heat (4.184 J/g·°C) is why it changes temperature so much more slowly than metals.
          </div>
        </div>
      </div>
    </div>
  )
}
