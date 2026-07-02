'use client'
import Link from 'next/link'
import { useState } from 'react'

// ── Bond Energy Calculator ───────────────────────────────────────────────
// ΔH(reaction) = Σ(bond energies broken in reactants) − Σ(bond energies
// formed in products). Breaking bonds always costs energy (endothermic);
// forming bonds always releases it (exothermic) — which one wins decides
// the reaction's sign. Average bond energies (kJ/mol) are the standard
// textbook reference values. Bond-energy ΔH is an estimate (these are
// AVERAGE energies across many molecules) — it lands close to, but not
// exactly on, the true measured ΔH.

type BondTally = { bond: string; energy: number; count: number }
type Reaction = { eq: string; broken: BondTally[]; formed: BondTally[]; realDH: string }

const REACTIONS: Reaction[] = [
  {
    eq: 'H₂ + Cl₂ → 2HCl',
    broken: [{ bond: 'H–H', energy: 436, count: 1 }, { bond: 'Cl–Cl', energy: 242, count: 1 }],
    formed: [{ bond: 'H–Cl', energy: 431, count: 2 }],
    realDH: '≈ −184.6 kJ (measured) — bond-energy estimate lands almost exactly on it.',
  },
  {
    eq: 'H₂ + F₂ → 2HF',
    broken: [{ bond: 'H–H', energy: 436, count: 1 }, { bond: 'F–F', energy: 159, count: 1 }],
    formed: [{ bond: 'H–F', energy: 567, count: 2 }],
    realDH: '≈ −542 kJ (measured) — very exothermic; the H–F bond is unusually strong.',
  },
  {
    eq: 'N₂ + 3H₂ → 2NH₃',
    broken: [{ bond: 'N≡N', energy: 941, count: 1 }, { bond: 'H–H', energy: 436, count: 3 }],
    formed: [{ bond: 'N–H', energy: 391, count: 6 }],
    realDH: '≈ −92 kJ (measured) — the Haber process. N≡N is one of the strongest bonds known, which is why this reaction needs a catalyst and high pressure to run at a useful rate.',
  },
  {
    eq: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
    broken: [{ bond: 'C–H', energy: 413, count: 4 }, { bond: 'O=O', energy: 495, count: 2 }],
    formed: [{ bond: 'C=O', energy: 799, count: 2 }, { bond: 'O–H', energy: 467, count: 4 }],
    realDH: '≈ −802 kJ (measured) — methane combustion. Close to the bond-energy estimate, with the usual small gap from using average rather than molecule-specific bond energies.',
  },
]

function sum(tallies: BondTally[]) {
  return tallies.reduce((s, t) => s + t.energy * t.count, 0)
}

export default function BondEnergyCalculator() {
  const [idx, setIdx] = useState(0)
  const r = REACTIONS[idx]
  const [predicted, setPredicted] = useState<'exo' | 'endo' | null>(null)

  const brokenSum = sum(r.broken)
  const formedSum = sum(r.formed)
  const dH = brokenSum - formedSum
  const isExo = dH < 0

  function selectReaction(i: number) {
    setIdx(i)
    setPredicted(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 52, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#a6b0b1', textDecoration: 'none', fontSize: 16 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 19 }}>Bond Energy Calculator</strong>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: reaction picker + reference */}
        <div style={{ width: 300, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 24, overflowY: 'auto' }}>
          <div style={{ fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Reaction</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 22 }}>
            {REACTIONS.map((rx, i) => (
              <button key={rx.eq} onClick={() => selectReaction(i)}
                style={{ padding: '9px 12px', borderRadius: 8, border: `1px solid ${i === idx ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.1)'}`, background: i === idx ? 'rgba(34,211,238,0.12)' : 'transparent', color: i === idx ? '#22d3ee' : '#a6b0b1', fontSize: 15, fontFamily: 'monospace', cursor: 'pointer', textAlign: 'left' }}>
                {rx.eq}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>The rule</div>
          <div style={{ fontSize: 15, color: '#7c8590', lineHeight: 1.8 }}>
            ΔH = Σ(bonds broken) − Σ(bonds formed)<br /><br />
            Breaking bonds always <strong style={{ color: '#f87171' }}>costs</strong> energy.<br />
            Forming bonds always <strong style={{ color: '#4ade80' }}>releases</strong> energy.
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, overflow: 'auto', padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'monospace', marginBottom: 22 }}>{r.eq}</div>

          {predicted === null && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ fontSize: 16, color: '#a6b0b1' }}>Predict: is this reaction exothermic or endothermic?</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setPredicted('exo')} style={{ padding: '10px 22px', borderRadius: 9, border: '1px solid rgba(248,113,113,0.4)', background: 'rgba(248,113,113,0.1)', color: '#fca5a5', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Exothermic</button>
                <button onClick={() => setPredicted('endo')} style={{ padding: '10px 22px', borderRadius: 9, border: '1px solid rgba(96,165,250,0.4)', background: 'rgba(96,165,250,0.1)', color: '#93c5fd', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Endothermic</button>
              </div>
            </div>
          )}

          {predicted !== null && (
            <>
              <div style={{ fontSize: 16, fontWeight: 700, color: (predicted === 'exo') === isExo ? '#4ade80' : '#f87171', marginBottom: 20 }}>
                {(predicted === 'exo') === isExo ? '✓ Correct prediction!' : `✗ Actually ${isExo ? 'exothermic' : 'endothermic'}.`}
              </div>

              <div style={{ display: 'flex', gap: 20, marginBottom: 22, flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 14, padding: '16px 20px', minWidth: 240 }}>
                  <div style={{ fontSize: 15, color: '#fca5a5', fontWeight: 700, marginBottom: 10 }}>Bonds broken (reactants)</div>
                  {r.broken.map(b => (
                    <div key={b.bond} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontFamily: 'monospace', color: '#cbd5e1', marginBottom: 4 }}>
                      <span>{b.count} × {b.bond} ({b.energy})</span><span>{b.count * b.energy}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 800, color: '#fca5a5' }}>
                    <span>Total</span><span>+{brokenSum} kJ</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: 14, padding: '16px 20px', minWidth: 240 }}>
                  <div style={{ fontSize: 15, color: '#86efac', fontWeight: 700, marginBottom: 10 }}>Bonds formed (products)</div>
                  {r.formed.map(b => (
                    <div key={b.bond} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontFamily: 'monospace', color: '#cbd5e1', marginBottom: 4 }}>
                      <span>{b.count} × {b.bond} ({b.energy})</span><span>{b.count * b.energy}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 800, color: '#86efac' }}>
                    <span>Total</span><span>−{formedSum} kJ</span>
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '16px 24px', textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 15, color: '#a6b0b1', marginBottom: 6 }}>ΔH = {brokenSum} − {formedSum}</div>
                <div style={{ fontSize: 28, fontWeight: 900, fontFamily: 'monospace', color: isExo ? '#86efac' : '#93c5fd' }}>{dH > 0 ? '+' : ''}{dH} kJ</div>
                <div style={{ fontSize: 16, color: isExo ? '#86efac' : '#93c5fd', marginTop: 4 }}>{isExo ? 'Exothermic — energy released' : 'Endothermic — energy absorbed'}</div>
              </div>

              <div style={{ fontSize: 15, color: '#7c8590', lineHeight: 1.7, maxWidth: 600, textAlign: 'center' }}>{r.realDH}</div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
