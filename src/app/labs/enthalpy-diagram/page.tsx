'use client'
import Link from 'next/link'
import { useState } from 'react'

// ── Enthalpy Diagram Plotter ─────────────────────────────────────────────
// The reaction-coordinate diagram: energy of reactants and products sets
// ΔH (= E_products − E_reactants), the peak (transition state) sets the
// activation energy in each direction. A catalyst lowers the peak — and
// therefore both Ea values — without moving the reactant or product energy
// levels, so ΔH never changes. That's the one fact AP Chem always tests
// about catalysts on this diagram.

const PX0 = 60, PX1 = 460, PY0 = 30, PY1 = 280
const EMAX = 160

export default function EnthalpyDiagramPlotter() {
  const [eReact, setEReact] = useState(50)
  const [eTrans, setETrans] = useState(120)
  const [eProd, setEProd] = useState(20)
  const [catalyst, setCatalyst] = useState(false)
  const [catalystDrop, setCatalystDrop] = useState(40)

  const dH = eProd - eReact
  const eaFwd = eTrans - eReact
  const eaRev = eTrans - eProd
  const eTransCat = Math.max(Math.max(eReact, eProd) + 5, eTrans - catalystDrop)
  const eaFwdCat = eTransCat - eReact
  const eaRevCat = eTransCat - eProd

  const xFor = (frac: number) => PX0 + frac * (PX1 - PX0)
  const yFor = (e: number) => PY1 - (e / EMAX) * (PY1 - PY0)

  function curve(eStart: number, ePeak: number, eEnd: number) {
    const x0 = xFor(0.08), xp = xFor(0.5), x1 = xFor(0.92)
    const y0 = yFor(eStart), yp = yFor(ePeak), y1 = yFor(eEnd)
    return `M ${x0} ${y0} Q ${(x0 + xp) / 2} ${y0}, ${xp} ${yp} Q ${(xp + x1) / 2} ${y1}, ${x1} ${y1}`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 52, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#a6b0b1', textDecoration: 'none', fontSize: 16 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 19 }}>Enthalpy Diagram Plotter</strong>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: controls */}
        <div style={{ width: 340, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 24, overflowY: 'auto' }}>
          <div style={{ fontSize: 15, color: '#22d3ee', marginBottom: 6 }}>Reactants energy: <strong style={{ fontFamily: 'monospace' }}>{eReact}</strong></div>
          <input type="range" min={0} max={140} step={1} value={eReact} onChange={e => setEReact(Number(e.target.value))} style={{ width: '100%', marginBottom: 16 }} />

          <div style={{ fontSize: 15, color: '#fbbf24', marginBottom: 6 }}>Transition state energy: <strong style={{ fontFamily: 'monospace' }}>{eTrans}</strong></div>
          <input type="range" min={0} max={155} step={1} value={eTrans} onChange={e => setETrans(Number(e.target.value))} style={{ width: '100%', marginBottom: 16 }} />

          <div style={{ fontSize: 15, color: '#4ade80', marginBottom: 6 }}>Products energy: <strong style={{ fontFamily: 'monospace' }}>{eProd}</strong></div>
          <input type="range" min={0} max={140} step={1} value={eProd} onChange={e => setEProd(Number(e.target.value))} style={{ width: '100%', marginBottom: 22 }} />

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, color: '#a6b0b1', marginBottom: catalyst ? 10 : 22, cursor: 'pointer' }}>
            <input type="checkbox" checked={catalyst} onChange={e => setCatalyst(e.target.checked)} style={{ width: 18, height: 18 }} />
            Add a catalyst
          </label>
          {catalyst && (
            <>
              <div style={{ fontSize: 15, color: '#c084fc', marginBottom: 6 }}>Catalyst lowers peak by: <strong style={{ fontFamily: 'monospace' }}>{catalystDrop}</strong></div>
              <input type="range" min={0} max={100} step={1} value={catalystDrop} onChange={e => setCatalystDrop(Number(e.target.value))} style={{ width: '100%', marginBottom: 22 }} />
            </>
          )}

          <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
            <div style={{ fontSize: 16, fontFamily: 'monospace', lineHeight: 2 }}>
              <div>ΔH = {eProd} − {eReact} = <strong style={{ color: dH < 0 ? '#86efac' : '#93c5fd' }}>{dH > 0 ? '+' : ''}{dH}</strong></div>
              <div>Ea (forward) = <strong style={{ color: '#fbbf24' }}>{eaFwd}</strong></div>
              <div>Ea (reverse) = <strong style={{ color: '#fbbf24' }}>{eaRev}</strong></div>
            </div>
          </div>
          <div style={{ fontSize: 15, color: dH < 0 ? '#86efac' : '#93c5fd', fontWeight: 700 }}>{dH < 0 ? 'Exothermic' : dH > 0 ? 'Endothermic' : 'Thermoneutral'}</div>

          {catalyst && (
            <div style={{ marginTop: 14, background: 'rgba(192,132,252,0.08)', border: '1px solid rgba(192,132,252,0.25)', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 16, fontFamily: 'monospace', color: '#c084fc', lineHeight: 2 }}>
                <div>Catalyzed Ea (fwd) = <strong>{eaFwdCat.toFixed(0)}</strong></div>
                <div>Catalyzed Ea (rev) = <strong>{eaRevCat.toFixed(0)}</strong></div>
                <div>ΔH unchanged = <strong>{dH > 0 ? '+' : ''}{dH}</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* Main: diagram */}
        <div style={{ flex: 1, overflow: 'auto', padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg viewBox="0 0 520 320" width="100%" style={{ maxWidth: 620 }}>
            <line x1={PX0} y1={PY1} x2={PX1} y2={PY1} stroke="#3a4060" strokeWidth={1.5} />
            <line x1={PX0} y1={PY0} x2={PX0} y2={PY1} stroke="#3a4060" strokeWidth={1.5} />
            <text x={(PX0 + PX1) / 2} y={310} fill="#a6b0b1" fontSize={15} textAnchor="middle">Reaction progress</text>
            <text x={18} y={(PY0 + PY1) / 2} fill="#a6b0b1" fontSize={15} textAnchor="middle" transform={`rotate(-90, 18, ${(PY0 + PY1) / 2})`}>Energy</text>

            {catalyst && (
              <path d={curve(eReact, eTransCat, eProd)} fill="none" stroke="#c084fc" strokeWidth={2.5} strokeDasharray="6,5" opacity={0.85} />
            )}
            <path d={curve(eReact, eTrans, eProd)} fill="none" stroke="#f8fafc" strokeWidth={3} />

            {/* level lines */}
            <line x1={xFor(0.08)} y1={yFor(eReact)} x2={xFor(0.5)} y2={yFor(eReact)} stroke="#22d3ee" strokeWidth={1} strokeDasharray="3,3" opacity={0.5} />
            <line x1={xFor(0.5)} y1={yFor(eProd)} x2={xFor(0.92)} y2={yFor(eProd)} stroke="#4ade80" strokeWidth={1} strokeDasharray="3,3" opacity={0.5} />

            {/* labels */}
            <text x={xFor(0.08)} y={yFor(eReact) - 10} fill="#22d3ee" fontSize={15} fontWeight={700}>Reactants</text>
            <text x={xFor(0.92)} y={yFor(eProd) - 10} fill="#4ade80" fontSize={15} fontWeight={700} textAnchor="end">Products</text>
            <text x={xFor(0.5)} y={yFor(eTrans) - 12} fill="#fbbf24" fontSize={15} fontWeight={700} textAnchor="middle">Transition state</text>

            {/* dH bracket on the right */}
            <line x1={xFor(0.97)} y1={yFor(eReact)} x2={xFor(0.97)} y2={yFor(eProd)} stroke="#67e8f9" strokeWidth={2} />
            <text x={xFor(0.97) + 8} y={(yFor(eReact) + yFor(eProd)) / 2} fill="#67e8f9" fontSize={15} fontWeight={700}>ΔH</text>
          </svg>

          <div style={{ fontSize: 15, color: '#7c8590', lineHeight: 1.8, maxWidth: 600, textAlign: 'center', marginTop: 8 }}>
            A catalyst (dashed purple curve) lowers the energy barrier in both directions but never changes where the reactants or products sit — ΔH is identical with or without it.
          </div>
        </div>
      </div>
    </div>
  )
}
