'use client'
import Link from 'next/link'
import { useState } from 'react'

// ── Net Ionic Equation Builder ───────────────────────────────────────────
// Given a complete ionic equation (already split into ions + non-dissociating
// species), click every SPECTATOR ion — one that appears unchanged on both
// sides — to cancel it. What's left is the net ionic equation. All 6
// reactions are real, correctly balanced, and the spectator/net-ionic
// breakdown is hand-verified.

type Tile = { label: string; side: 'left' | 'right'; spectator: boolean }
type Reaction = { molecular: string; tiles: Tile[]; netIonic: string; note: string }

const REACTIONS: Reaction[] = [
  {
    molecular: 'AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq)',
    tiles: [
      { label: 'Ag⁺(aq)', side: 'left', spectator: false },
      { label: 'NO₃⁻(aq)', side: 'left', spectator: true },
      { label: 'Na⁺(aq)', side: 'left', spectator: true },
      { label: 'Cl⁻(aq)', side: 'left', spectator: false },
      { label: 'AgCl(s)', side: 'right', spectator: false },
      { label: 'Na⁺(aq)', side: 'right', spectator: true },
      { label: 'NO₃⁻(aq)', side: 'right', spectator: true },
    ],
    netIonic: 'Ag⁺(aq) + Cl⁻(aq) → AgCl(s)',
    note: 'AgCl is insoluble — it precipitates instead of dissociating.',
  },
  {
    molecular: 'Pb(NO₃)₂(aq) + 2KI(aq) → PbI₂(s) + 2KNO₃(aq)',
    tiles: [
      { label: 'Pb²⁺(aq)', side: 'left', spectator: false },
      { label: '2NO₃⁻(aq)', side: 'left', spectator: true },
      { label: '2K⁺(aq)', side: 'left', spectator: true },
      { label: '2I⁻(aq)', side: 'left', spectator: false },
      { label: 'PbI₂(s)', side: 'right', spectator: false },
      { label: '2K⁺(aq)', side: 'right', spectator: true },
      { label: '2NO₃⁻(aq)', side: 'right', spectator: true },
    ],
    netIonic: 'Pb²⁺(aq) + 2I⁻(aq) → PbI₂(s)',
    note: 'PbI₂ is a bright yellow precipitate — classic qualitative-analysis test.',
  },
  {
    molecular: 'BaCl₂(aq) + Na₂SO₄(aq) → BaSO₄(s) + 2NaCl(aq)',
    tiles: [
      { label: 'Ba²⁺(aq)', side: 'left', spectator: false },
      { label: '2Cl⁻(aq)', side: 'left', spectator: true },
      { label: '2Na⁺(aq)', side: 'left', spectator: true },
      { label: 'SO₄²⁻(aq)', side: 'left', spectator: false },
      { label: 'BaSO₄(s)', side: 'right', spectator: false },
      { label: '2Na⁺(aq)', side: 'right', spectator: true },
      { label: '2Cl⁻(aq)', side: 'right', spectator: true },
    ],
    netIonic: 'Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s)',
    note: 'Nearly all sulfates are soluble except those of Ba²⁺, Sr²⁺, Pb²⁺, Ca²⁺ — this is the classic precipitation test for sulfate ion.',
  },
  {
    molecular: 'HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)',
    tiles: [
      { label: 'H⁺(aq)', side: 'left', spectator: false },
      { label: 'Cl⁻(aq)', side: 'left', spectator: true },
      { label: 'Na⁺(aq)', side: 'left', spectator: true },
      { label: 'OH⁻(aq)', side: 'left', spectator: false },
      { label: 'Na⁺(aq)', side: 'right', spectator: true },
      { label: 'Cl⁻(aq)', side: 'right', spectator: true },
      { label: 'H₂O(l)', side: 'right', spectator: false },
    ],
    netIonic: 'H⁺(aq) + OH⁻(aq) → H₂O(l)',
    note: 'Strong acid + strong base neutralization always reduces to this same net ionic equation.',
  },
  {
    molecular: 'CaCO₃(s) + 2HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g)',
    tiles: [
      { label: 'CaCO₃(s)', side: 'left', spectator: false },
      { label: '2H⁺(aq)', side: 'left', spectator: false },
      { label: '2Cl⁻(aq)', side: 'left', spectator: true },
      { label: 'Ca²⁺(aq)', side: 'right', spectator: false },
      { label: '2Cl⁻(aq)', side: 'right', spectator: true },
      { label: 'H₂O(l)', side: 'right', spectator: false },
      { label: 'CO₂(g)', side: 'right', spectator: false },
    ],
    netIonic: 'CaCO₃(s) + 2H⁺(aq) → Ca²⁺(aq) + H₂O(l) + CO₂(g)',
    note: 'CaCO₃ is an insoluble solid — it never dissociates, so it stays whole in every step. This is why acids dissolve limestone.',
  },
  {
    molecular: 'CuSO₄(aq) + 2NaOH(aq) → Cu(OH)₂(s) + Na₂SO₄(aq)',
    tiles: [
      { label: 'Cu²⁺(aq)', side: 'left', spectator: false },
      { label: 'SO₄²⁻(aq)', side: 'left', spectator: true },
      { label: '2Na⁺(aq)', side: 'left', spectator: true },
      { label: '2OH⁻(aq)', side: 'left', spectator: false },
      { label: 'Cu(OH)₂(s)', side: 'right', spectator: false },
      { label: '2Na⁺(aq)', side: 'right', spectator: true },
      { label: 'SO₄²⁻(aq)', side: 'right', spectator: true },
    ],
    netIonic: 'Cu²⁺(aq) + 2OH⁻(aq) → Cu(OH)₂(s)',
    note: 'Cu(OH)₂ is a pale blue precipitate.',
  },
]

export default function NetIonicBuilder() {
  const [idx, setIdx] = useState(0)
  const [marked, setMarked] = useState<Set<number>>(new Set())
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const reaction = REACTIONS[idx]

  function toggle(i: number) {
    if (checked) return
    setMarked(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i); else next.add(i)
      return next
    })
  }

  function check() {
    const allCorrect = reaction.tiles.every((t, i) => t.spectator === marked.has(i))
    setChecked(true)
    if (allCorrect) setScore(s => ({ correct: s.correct + 1, total: s.total + 1 }))
    else setScore(s => ({ correct: s.correct, total: s.total + 1 }))
  }

  function next() {
    setIdx(i => (i + 1) % REACTIONS.length)
    setMarked(new Set())
    setChecked(false)
  }

  const allCorrect = checked && reaction.tiles.every((t, i) => t.spectator === marked.has(i))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 52, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#a6b0b1', textDecoration: 'none', fontSize: 16 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 19 }}>Net Ionic Equation Builder</strong>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: reference */}
        <div style={{ width: 300, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 24, overflowY: 'auto' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
            <div style={{ fontSize: 15, color: '#a6b0b1', marginBottom: 4 }}>Score</div>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'monospace', color: '#22d3ee' }}>{score.correct} / {score.total}</div>
          </div>

          <div style={{ fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>How to dissociate</div>
          <div style={{ fontSize: 15, color: '#7c8590', lineHeight: 1.8, marginBottom: 18 }}>
            <strong style={{ color: '#cbd5e1' }}>Dissociates into ions:</strong> strong acids, strong bases, soluble salts (aq)<br /><br />
            <strong style={{ color: '#cbd5e1' }}>Stays whole:</strong> solids (s), liquids (l) like H₂O, gases (g), weak acids/bases
          </div>

          <div style={{ fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>The goal</div>
          <div style={{ fontSize: 15, color: '#7c8590', lineHeight: 1.8 }}>
            A <strong style={{ color: '#cbd5e1' }}>spectator ion</strong> appears unchanged on both sides — it doesn't actually react. Click every spectator below to cancel it; what survives is the net ionic equation.
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, overflow: 'auto', padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 15, color: '#a6b0b1', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Molecular equation</div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'monospace', color: '#cbd5e1', marginBottom: 26, textAlign: 'center' }}>{reaction.molecular}</div>

          <div style={{ fontSize: 15, color: '#a6b0b1', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Complete ionic equation — click the spectator ions</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 760, marginBottom: 22 }}>
            {reaction.tiles.map((t, i) => {
              const isMarked = marked.has(i)
              const wrong = checked && isMarked !== t.spectator
              return (
                <button key={i} onClick={() => toggle(i)}
                  style={{
                    padding: '10px 16px', borderRadius: 10, fontSize: 18, fontFamily: 'monospace', fontWeight: 700, cursor: checked ? 'default' : 'pointer',
                    border: `1.5px solid ${wrong ? '#f87171' : isMarked ? '#fbbf24' : 'rgba(255,255,255,0.15)'}`,
                    background: wrong ? 'rgba(239,68,68,0.12)' : isMarked ? 'rgba(251,191,36,0.12)' : 'rgba(255,255,255,0.03)',
                    color: wrong ? '#fca5a5' : isMarked ? '#fbbf24' : '#f8fafc',
                    textDecoration: isMarked ? 'line-through' : 'none',
                    opacity: isMarked ? 0.6 : 1,
                  }}>
                  {t.label}{wrong ? (t.spectator ? ' (missed)' : ' (not a spectator)') : ''}
                </button>
              )
            })}
          </div>

          {!checked && (
            <button onClick={check} style={{ padding: '11px 28px', borderRadius: 10, border: '1px solid rgba(34,211,238,0.4)', background: 'rgba(34,211,238,0.12)', color: '#22d3ee', fontSize: 17, fontWeight: 700, cursor: 'pointer', marginBottom: 18 }}>
              Check
            </button>
          )}

          {checked && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: allCorrect ? '#4ade80' : '#f87171' }}>
                {allCorrect ? '✓ Correct!' : '✗ Not quite — check the marked tiles above.'}
              </div>
              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 14, padding: '18px 26px', textAlign: 'center' }}>
                <div style={{ fontSize: 15, color: '#a6b0b1', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Net ionic equation</div>
                <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'monospace', color: '#86efac' }}>{reaction.netIonic}</div>
              </div>
              <div style={{ fontSize: 15, color: '#7c8590', lineHeight: 1.7, maxWidth: 560, textAlign: 'center' }}>{reaction.note}</div>
              <button onClick={next} style={{ padding: '10px 24px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#a6b0b1', fontSize: 16, cursor: 'pointer' }}>
                Next reaction
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
