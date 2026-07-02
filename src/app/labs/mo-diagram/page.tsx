'use client'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

// ── MO Diagram Builder ───────────────────────────────────────────────────
// Homonuclear diatomics, period 1-2. Click MO levels to fill electrons —
// same Aufbau/Pauli/Hund rules as atomic configs, just applied to molecular
// orbitals. Two energy orderings are used (verified against real bond
// orders for all 10 molecules): H2/He2 use only σ1s/σ*1s; Li2 through N2
// have π2p BELOW σ2p (s-p mixing), while O2 through Ne2 have σ2p below π2p.

type MOLevel = { label: string; kind: 'bonding' | 'antibonding'; orbitals: number }

const LOW_Z_LEVELS: MOLevel[] = [
  { label: 'σ2s', kind: 'bonding', orbitals: 1 },
  { label: 'σ*2s', kind: 'antibonding', orbitals: 1 },
  { label: 'π2p', kind: 'bonding', orbitals: 2 },
  { label: 'σ2p', kind: 'bonding', orbitals: 1 },
  { label: 'π*2p', kind: 'antibonding', orbitals: 2 },
  { label: 'σ*2p', kind: 'antibonding', orbitals: 1 },
]
const HIGH_Z_LEVELS: MOLevel[] = [
  { label: 'σ2s', kind: 'bonding', orbitals: 1 },
  { label: 'σ*2s', kind: 'antibonding', orbitals: 1 },
  { label: 'σ2p', kind: 'bonding', orbitals: 1 },
  { label: 'π2p', kind: 'bonding', orbitals: 2 },
  { label: 'π*2p', kind: 'antibonding', orbitals: 2 },
  { label: 'σ*2p', kind: 'antibonding', orbitals: 1 },
]
const S_LEVELS: MOLevel[] = [
  { label: 'σ1s', kind: 'bonding', orbitals: 1 },
  { label: 'σ*1s', kind: 'antibonding', orbitals: 1 },
]

type MoleculeSpec = { formula: string; name: string; levels: MOLevel[]; totalE: number }

const MOLECULES: MoleculeSpec[] = [
  { formula: 'H2', name: 'Hydrogen', levels: S_LEVELS, totalE: 2 },
  { formula: 'He2', name: 'Helium (unstable)', levels: S_LEVELS, totalE: 4 },
  { formula: 'Li2', name: 'Lithium', levels: LOW_Z_LEVELS, totalE: 2 },
  { formula: 'Be2', name: 'Beryllium (unstable)', levels: LOW_Z_LEVELS, totalE: 4 },
  { formula: 'B2', name: 'Boron', levels: LOW_Z_LEVELS, totalE: 6 },
  { formula: 'C2', name: 'Carbon', levels: LOW_Z_LEVELS, totalE: 8 },
  { formula: 'N2', name: 'Nitrogen', levels: LOW_Z_LEVELS, totalE: 10 },
  { formula: 'O2', name: 'Oxygen', levels: HIGH_Z_LEVELS, totalE: 12 },
  { formula: 'F2', name: 'Fluorine', levels: HIGH_Z_LEVELS, totalE: 14 },
  { formula: 'Ne2', name: 'Neon (unstable)', levels: HIGH_Z_LEVELS, totalE: 16 },
]

const SPECIAL_NOTES: Record<string, string> = {
  O2: 'MO theory correctly predicts O₂ is paramagnetic (2 unpaired electrons in π*2p) — something a simple Lewis structure (O=O, all electrons paired) cannot explain. This was historic evidence for MO theory.',
  B2: 'B₂ is paramagnetic too: Hund\'s rule forces the 2 electrons in the degenerate π2p pair to stay unpaired, one per orbital — the same logic as filling p subshells.',
  He2: 'Bond order = 0, so He₂ does not exist as a stable molecule — every bonding electron is cancelled by an antibonding one.',
  Be2: 'Bond order = 0 here too: Be₂ is not a stable molecule under simple MO theory.',
  Ne2: 'Every level is completely full (bonding = antibonding), giving bond order 0 — Ne₂ does not exist.',
}

export default function MODiagramBuilder() {
  const [molIdx, setMolIdx] = useState(6) // default N2
  const mol = MOLECULES[molIdx]
  const [filled, setFilled] = useState<Record<string, number[]>>({})
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const init: Record<string, number[]> = {}
    mol.levels.forEach(l => { init[l.label] = Array(l.orbitals).fill(0) })
    setFilled(init)
    setFeedback(null)
  }, [molIdx]) // eslint-disable-line react-hooks/exhaustive-deps

  const totalPlaced = useMemo(() => mol.levels.reduce((s, l) => s + (filled[l.label] ?? []).reduce((a, b) => a + b, 0), 0), [filled, mol])

  function isLevelFull(label: string) {
    const lvl = mol.levels.find(l => l.label === label)!
    return (filled[label] ?? []).reduce((a, b) => a + b, 0) === lvl.orbitals * 2
  }

  function handleClick(label: string, idx: number) {
    const lvl = mol.levels.find(l => l.label === label)!
    const arr = filled[label] ?? []
    const count = arr[idx] ?? 0

    if (count >= 2) {
      const next = { ...filled, [label]: arr.map((c, i) => (i === idx ? c - 1 : c)) }
      setFilled(next)
      setFeedback({ kind: 'success', text: `Removed an electron from ${label}.` })
      return
    }
    if (totalPlaced >= mol.totalE) {
      setFeedback({ kind: 'error', text: `All ${mol.totalE} electrons for ${mol.formula} are already placed.` })
      return
    }
    const levelIdx = mol.levels.findIndex(l => l.label === label)
    for (let i = 0; i < levelIdx; i++) {
      if (!isLevelFull(mol.levels[i].label)) {
        setFeedback({ kind: 'error', text: `Aufbau violation: fill ${mol.levels[i].label} completely before adding to ${label}.` })
        return
      }
    }
    if (count === 1 && lvl.orbitals > 1) {
      const hasEmptySibling = arr.some((c, i) => i !== idx && c === 0)
      if (hasEmptySibling) {
        setFeedback({ kind: 'error', text: `Hund's rule: both ${label} orbitals need one electron before either gets a second, paired electron.` })
        return
      }
    }
    const next = { ...filled, [label]: arr.map((c, i) => (i === idx ? c + 1 : c)) }
    setFilled(next)
    setFeedback({ kind: 'success', text: `Placed electron #${totalPlaced + 1} in ${label} (${count === 0 ? 'spin ↑' : 'spin ↓'}).` })
  }

  const bondingE = mol.levels.filter(l => l.kind === 'bonding').reduce((s, l) => s + (filled[l.label] ?? []).reduce((a, b) => a + b, 0), 0)
  const antibondingE = mol.levels.filter(l => l.kind === 'antibonding').reduce((s, l) => s + (filled[l.label] ?? []).reduce((a, b) => a + b, 0), 0)
  const bondOrder = (bondingE - antibondingE) / 2
  const unpaired = mol.levels.reduce((s, l) => s + (filled[l.label] ?? []).filter(c => c === 1).length, 0)
  const complete = totalPlaced === mol.totalE

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 52, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#a6b0b1', textDecoration: 'none', fontSize: 16 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 19 }}>MO Diagram Builder</strong>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: controls */}
        <div style={{ width: 320, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 24, overflowY: 'auto' }}>
          <div style={{ fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Diatomic molecule</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
            {MOLECULES.map((m, i) => (
              <button key={m.formula} onClick={() => setMolIdx(i)}
                style={{ padding: '7px 11px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: i === molIdx ? 'rgba(34,211,238,0.15)' : 'transparent', color: i === molIdx ? '#22d3ee' : '#a6b0b1', fontSize: 16, cursor: 'pointer', fontFamily: 'monospace' }}>
                {m.formula}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 26, fontWeight: 900, color: '#22d3ee', marginBottom: 2 }}>{mol.formula}</div>
          <div style={{ fontSize: 17, color: '#cbd5e1', marginBottom: 18 }}>{mol.name}</div>

          {feedback && (
            <div style={{
              marginBottom: 16, padding: '11px 14px', borderRadius: 9, fontSize: 15,
              background: feedback.kind === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
              border: `1px solid ${feedback.kind === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
              color: feedback.kind === 'error' ? '#fca5a5' : '#86efac',
            }}>
              {feedback.text}
            </div>
          )}

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>
            <div style={{ fontSize: 15, color: '#a6b0b1', marginBottom: 4 }}>Electrons placed</div>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'monospace', color: complete ? '#86efac' : '#fbbf24' }}>{totalPlaced} / {mol.totalE}</div>
          </div>

          <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
            <div style={{ fontSize: 15, color: '#a6b0b1', marginBottom: 8 }}>Bond order = (bonding − antibonding) / 2</div>
            <div style={{ fontSize: 16, fontFamily: 'monospace', color: '#67e8f9', lineHeight: 1.8 }}>
              <div>= ({bondingE} − {antibondingE}) / 2</div>
              <div style={{ fontWeight: 800, color: '#22d3ee', fontSize: 19 }}>= {bondOrder}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ fontSize: 15, color: '#a6b0b1' }}>Unpaired e⁻</div>
              <div style={{ fontSize: 19, fontWeight: 800, fontFamily: 'monospace', color: '#06b6d4' }}>{unpaired}</div>
            </div>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ fontSize: 15, color: '#a6b0b1' }}>Magnetism</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: unpaired > 0 ? '#fbbf24' : '#06b6d4' }}>{unpaired > 0 ? 'Paramagnetic' : 'Diamagnetic'}</div>
            </div>
          </div>

          {complete && SPECIAL_NOTES[mol.formula] && (
            <div style={{ fontSize: 15, color: '#fde68a', lineHeight: 1.7, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: 10, padding: '12px 14px' }}>
              ⚠ {SPECIAL_NOTES[mol.formula]}
            </div>
          )}

          <div style={{ marginTop: 22, fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>How to build it</div>
          <div style={{ fontSize: 15, color: '#a6b0b1', lineHeight: 1.9 }}>
            <div><strong style={{ color: '#cbd5e1' }}>Click a level</strong> to add an electron (Aufbau, Pauli, Hund all enforced).</div>
            <div>π levels are doubly degenerate — fill both singly before pairing.</div>
          </div>
        </div>

        {/* Main: MO ladder */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', width: '100%', maxWidth: 560 }}>
            <div style={{ width: 26, position: 'relative', flexShrink: 0 }}>
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, transform: 'translateX(-50%)', background: 'linear-gradient(to top, #3a4060, #a855f7)', borderRadius: 1 }} />
              <div style={{ position: 'absolute', left: '50%', top: -4, transform: 'translateX(-50%)', color: '#a855f7', fontSize: 15 }}>▲</div>
              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%) rotate(-90deg)', whiteSpace: 'nowrap', fontSize: 15, color: '#a6b0b1', fontWeight: 700, letterSpacing: '0.12em' }}>
                ENERGY INCREASING
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', gap: 8 }}>
              {mol.levels.map(lvl => {
                const arr = filled[lvl.label] ?? Array(lvl.orbitals).fill(0)
                const count = arr.reduce((a, b) => a + b, 0)
                const cap = lvl.orbitals * 2
                const full = count === cap
                const isAnti = lvl.kind === 'antibonding'
                return (
                  <div key={lvl.label} style={{
                    display: 'flex', alignItems: 'center', gap: 16, padding: '10px 14px', borderRadius: 10,
                    background: full ? (isAnti ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)') : 'rgba(255,255,255,0.02)',
                    border: `1.5px ${isAnti ? 'dashed' : 'solid'} ${full ? (isAnti ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)') : 'rgba(255,255,255,0.08)'}`,
                  }}>
                    <div style={{ width: 70, fontFamily: 'monospace', fontWeight: 800, fontSize: 18, color: isAnti ? '#f87171' : '#4ade80' }}>{lvl.label}</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {arr.map((c, idx) => (
                        <div key={idx}
                          data-testid={`mo-${lvl.label}-${idx}`}
                          onClick={() => handleClick(lvl.label, idx)}
                          style={{
                            width: 40, height: 38, borderRadius: 7, cursor: 'pointer',
                            border: `1.5px solid ${c > 0 ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.15)'}`,
                            background: c === 2 ? 'rgba(34,211,238,0.12)' : 'rgba(255,255,255,0.02)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2,
                            fontSize: 18, fontWeight: 700, userSelect: 'none',
                          }}>
                          {c >= 1 && <span style={{ color: '#22d3ee' }}>↑</span>}
                          {c >= 2 && <span style={{ color: '#fb923c' }}>↓</span>}
                        </div>
                      ))}
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: 15, fontFamily: 'monospace', color: full ? (isAnti ? '#f87171' : '#4ade80') : '#7c8590' }}>{count}/{cap}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ marginTop: 24, fontSize: 15, color: '#7c8590', lineHeight: 1.8, maxWidth: 600, textAlign: 'center' }}>
            Solid borders = bonding orbitals (lower in energy, stabilize the molecule). Dashed borders = antibonding orbitals (destabilize it). Bond order = ½(bonding e⁻ − antibonding e⁻); 0 means the molecule doesn't form.
          </div>
        </div>
      </div>
    </div>
  )
}
