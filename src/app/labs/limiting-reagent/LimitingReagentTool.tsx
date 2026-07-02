'use client'
import Link from 'next/link'
import { useState } from 'react'

// ── Limiting Reagent Visualizer ──────────────────────────────────────────
// Divide each reactant's moles by its coefficient — the smaller result is
// the limiting reagent, and what's left of the other is excess. The icon
// grid makes this concrete: reactants "pair up" by stoichiometric ratio
// until one runs out.

type ReactionDef = {
  eq: string
  aLabel: string; aCoeff: number; aColor: string
  bLabel: string; bCoeff: number; bColor: string
  productLabel: string; productCoeff: number; productColor: string
}

const REACTIONS: ReactionDef[] = [
  { eq: 'N₂ + 3H₂ → 2NH₃', aLabel: 'N₂', aCoeff: 1, aColor: '#60a5fa', bLabel: 'H₂', bCoeff: 3, bColor: '#facc15', productLabel: 'NH₃', productCoeff: 2, productColor: '#4ade80' },
  { eq: '2H₂ + O₂ → 2H₂O', aLabel: 'H₂', aCoeff: 2, aColor: '#facc15', bLabel: 'O₂', bCoeff: 1, bColor: '#f87171', productLabel: 'H₂O', productCoeff: 2, productColor: '#67e8f9' },
  { eq: '2Al + 3Br₂ → 2AlBr₃', aLabel: 'Al', aCoeff: 2, aColor: '#94a3b8', bLabel: 'Br₂', bCoeff: 3, bColor: '#fb923c', productLabel: 'AlBr₃', productCoeff: 2, productColor: '#c084fc' },
  { eq: 'CH₄ + 2O₂ → CO₂ + 2H₂O', aLabel: 'CH₄', aCoeff: 1, aColor: '#4ade80', bLabel: 'O₂', bCoeff: 2, bColor: '#f87171', productLabel: 'CO₂', productCoeff: 1, productColor: '#a6b0b1' },
  { eq: 'Zn + 2HCl → ZnCl₂ + H₂', aLabel: 'Zn', aCoeff: 1, aColor: '#a78bfa', bLabel: 'HCl', bCoeff: 2, bColor: '#34d399', productLabel: 'H₂', productCoeff: 1, productColor: '#67e8f9' },
]

function Icon({ color, faded }: { color: string; faded: boolean }) {
  return <div style={{ width: 22, height: 22, borderRadius: '50%', background: color, opacity: faded ? 0.22 : 1, border: faded ? '1px dashed rgba(255,255,255,0.3)' : '1px solid rgba(0,0,0,0.2)' }} />
}

export default function LimitingReagentVisualizer() {
  const [rxnIdx, setRxnIdx] = useState(0)
  const r = REACTIONS[rxnIdx]
  const [molesA, setMolesA] = useState(6)
  const [molesB, setMolesB] = useState(6)

  const groupsFromA = Math.floor(molesA / r.aCoeff)
  const groupsFromB = Math.floor(molesB / r.bCoeff)
  const limitGroups = Math.min(groupsFromA, groupsFromB)
  const isTie = groupsFromA === groupsFromB
  const limitingIsA = groupsFromA < groupsFromB
  const usedA = limitGroups * r.aCoeff
  const usedB = limitGroups * r.bCoeff
  const excessA = molesA - usedA
  const excessB = molesB - usedB
  const productMoles = limitGroups * r.productCoeff

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 52, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#a6b0b1', textDecoration: 'none', fontSize: 16 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 19 }}>Limiting Reagent Visualizer</strong>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: controls */}
        <div style={{ width: 340, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 24, overflowY: 'auto' }}>
          <div style={{ fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Reaction</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 22 }}>
            {REACTIONS.map((rx, i) => (
              <button key={rx.eq} onClick={() => { setRxnIdx(i); setMolesA(6); setMolesB(6) }}
                style={{ padding: '9px 12px', borderRadius: 8, border: `1px solid ${i === rxnIdx ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.1)'}`, background: i === rxnIdx ? 'rgba(34,211,238,0.12)' : 'transparent', color: i === rxnIdx ? '#22d3ee' : '#a6b0b1', fontSize: 15, fontFamily: 'monospace', cursor: 'pointer', textAlign: 'left' }}>
                {rx.eq}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Icon color={r.aColor} faded={false} />
            <span style={{ fontSize: 16, color: '#a6b0b1' }}>{r.aLabel}: <strong style={{ color: '#f8fafc', fontFamily: 'monospace' }}>{molesA} mol</strong></span>
          </div>
          <input type="range" min={0} max={12} step={1} value={molesA} onChange={e => setMolesA(Number(e.target.value))} style={{ width: '100%', marginBottom: 16 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Icon color={r.bColor} faded={false} />
            <span style={{ fontSize: 16, color: '#a6b0b1' }}>{r.bLabel}: <strong style={{ color: '#f8fafc', fontFamily: 'monospace' }}>{molesB} mol</strong></span>
          </div>
          <input type="range" min={0} max={12} step={1} value={molesB} onChange={e => setMolesB(Number(e.target.value))} style={{ width: '100%', marginBottom: 22 }} />

          <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 12, padding: '14px 16px', marginBottom: 16, fontSize: 15, lineHeight: 1.9, fontFamily: 'monospace' }}>
            <div style={{ color: r.aColor }}>{r.aLabel}: {molesA} ÷ {r.aCoeff} = {groupsFromA} groups</div>
            <div style={{ color: r.bColor }}>{r.bLabel}: {molesB} ÷ {r.bCoeff} = {groupsFromB} groups</div>
          </div>

          <div style={{ background: isTie ? 'rgba(167,139,250,0.1)' : 'rgba(34,197,94,0.1)', border: `1px solid ${isTie ? 'rgba(167,139,250,0.3)' : 'rgba(34,197,94,0.3)'}`, borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
            {isTie ? (
              <div style={{ fontSize: 16, color: '#c4b5fd' }}>Exact stoichiometric ratio — both fully consumed, no excess.</div>
            ) : (
              <div style={{ fontSize: 16, color: '#86efac' }}>
                Limiting reagent: <strong>{limitingIsA ? r.aLabel : r.bLabel}</strong><br />
                Excess: <strong>{(limitingIsA ? excessB : excessA).toFixed(0)} mol</strong> of {limitingIsA ? r.bLabel : r.aLabel} left over
              </div>
            )}
          </div>

          <div style={{ fontSize: 16, color: '#a6b0b1' }}>Product formed: <strong style={{ color: r.productColor, fontFamily: 'monospace' }}>{productMoles} mol {r.productLabel}</strong></div>
        </div>

        {/* Main: icon grid */}
        <div style={{ flex: 1, overflow: 'auto', padding: 30, display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div>
            <div style={{ fontSize: 15, color: r.aColor, fontWeight: 700, marginBottom: 8 }}>{r.aLabel} ({molesA} mol)</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {Array.from({ length: molesA }).map((_, i) => <Icon key={i} color={r.aColor} faded={i >= usedA} />)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 15, color: r.bColor, fontWeight: 700, marginBottom: 8 }}>{r.bLabel} ({molesB} mol)</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {Array.from({ length: molesB }).map((_, i) => <Icon key={i} color={r.bColor} faded={i >= usedB} />)}
            </div>
          </div>

          <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.08)' }} />

          <div>
            <div style={{ fontSize: 15, color: r.productColor, fontWeight: 700, marginBottom: 8 }}>{r.productLabel} produced ({productMoles} mol)</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {Array.from({ length: productMoles }).map((_, i) => <Icon key={i} color={r.productColor} faded={false} />)}
            </div>
          </div>

          <div style={{ fontSize: 15, color: '#7c8590', lineHeight: 1.8, maxWidth: 600 }}>
            Faded, dashed circles are leftover (excess) reactant — there wasn't enough of the other reactant to react with them. The reaction stops the instant the limiting reagent runs out.
          </div>
        </div>
      </div>
    </div>
  )
}
