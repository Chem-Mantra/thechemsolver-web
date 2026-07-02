'use client'
import Link from 'next/link'
import { useState } from 'react'

// ── Hess's Law Builder ───────────────────────────────────────────────────
// Hess's Law: ΔH for an overall reaction equals the sum of ΔH for any set
// of steps that add up to it, however you reverse or scale them (reversing
// flips the sign of ΔH; scaling by a factor scales ΔH by the same factor).
// For each step pick the manipulation that makes everything cancel down to
// the target equation; the sum of the adjusted ΔH values is the answer.
//
// All ΔH values are the standard textbook reference enthalpies for these
// classic reactions (ΔHf CO2 = -393.5 kJ/mol, ΔHf H2O(l) = -285.8 kJ/mol,
// ΔH combustion C2H2 = -1299.6 kJ/mol, etc.) — the same constants used on
// AP Chemistry thermochemistry problems.

type Choice = { label: string; eq: string; dH: number; correct: boolean }
type Step = { title: string; choices: Choice[] }
type Puzzle = { target: string; steps: Step[]; targetDH: number; note: string }

const PUZZLES: Puzzle[] = [
  {
    target: 'C(s) + ½O₂(g) → CO(g)',
    targetDH: -110.5,
    note: 'This combination of carbon and CO combustion data gives the formation enthalpy of carbon monoxide.',
    steps: [
      { title: 'Step 1', choices: [
        { label: 'As written', eq: 'C(s) + O₂(g) → CO₂(g)', dH: -393.5, correct: true },
        { label: 'Reversed', eq: 'CO₂(g) → C(s) + O₂(g)', dH: 393.5, correct: false },
      ]},
      { title: 'Step 2', choices: [
        { label: 'As written', eq: 'CO(g) + ½O₂(g) → CO₂(g)', dH: -283.0, correct: false },
        { label: 'Reversed', eq: 'CO₂(g) → CO(g) + ½O₂(g)', dH: 283.0, correct: true },
      ]},
    ],
  },
  {
    target: 'S(s) + 3⁄2O₂(g) → SO₃(g)',
    targetDH: -395.9,
    note: 'Scaling the second step by ½ matches its SO₂ and SO₃ coefficients to the target.',
    steps: [
      { title: 'Step 1', choices: [
        { label: 'As written', eq: 'S(s) + O₂(g) → SO₂(g)', dH: -296.8, correct: true },
        { label: 'Reversed', eq: 'SO₂(g) → S(s) + O₂(g)', dH: 296.8, correct: false },
      ]},
      { title: 'Step 2', choices: [
        { label: 'As written (×1)', eq: '2SO₂(g) + O₂(g) → 2SO₃(g)', dH: -198.2, correct: false },
        { label: 'Halved (×½)', eq: 'SO₂(g) + ½O₂(g) → SO₃(g)', dH: -99.1, correct: true },
        { label: 'Reversed (×1)', eq: '2SO₃(g) → 2SO₂(g) + O₂(g)', dH: 198.2, correct: false },
      ]},
    ],
  },
  {
    target: '2C(s) + H₂(g) → C₂H₂(g)',
    targetDH: 226.8,
    note: 'Acetylene has a positive (endothermic) heat of formation despite being a fuel — its C≡C triple bond stores a lot of energy.',
    steps: [
      { title: 'Step 1', choices: [
        { label: 'As written (×1)', eq: 'C(s) + O₂(g) → CO₂(g)', dH: -393.5, correct: false },
        { label: 'Doubled (×2)', eq: '2C(s) + 2O₂(g) → 2CO₂(g)', dH: -787.0, correct: true },
      ]},
      { title: 'Step 2', choices: [
        { label: 'As written (×1)', eq: 'H₂(g) + ½O₂(g) → H₂O(l)', dH: -285.8, correct: true },
        { label: 'Doubled (×2)', eq: '2H₂(g) + O₂(g) → 2H₂O(l)', dH: -571.6, correct: false },
      ]},
      { title: 'Step 3', choices: [
        { label: 'As written (×1)', eq: 'C₂H₂(g) + 5⁄2O₂(g) → 2CO₂(g) + H₂O(l)', dH: -1299.6, correct: false },
        { label: 'Reversed (×1)', eq: '2CO₂(g) + H₂O(l) → C₂H₂(g) + 5⁄2O₂(g)', dH: 1299.6, correct: true },
      ]},
    ],
  },
]

export default function HessLawBuilder() {
  const [pzIdx, setPzIdx] = useState(0)
  const puzzle = PUZZLES[pzIdx]
  const [selected, setSelected] = useState<(number | null)[]>(puzzle.steps.map(() => null))
  const [checked, setChecked] = useState(false)

  function selectPuzzle(i: number) {
    setPzIdx(i)
    setSelected(PUZZLES[i].steps.map(() => null))
    setChecked(false)
  }

  function pick(stepIdx: number, choiceIdx: number) {
    if (checked) return
    setSelected(prev => prev.map((v, i) => i === stepIdx ? choiceIdx : v))
  }

  const allPicked = selected.every(s => s !== null)
  const allCorrect = checked && selected.every((c, i) => c !== null && puzzle.steps[i].choices[c].correct)
  const sum = selected.reduce((acc, c, i) => acc + (c !== null ? puzzle.steps[i].choices[c].dH : 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 52, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#a6b0b1', textDecoration: 'none', fontSize: 16 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 19 }}>Hess's Law Builder</strong>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: puzzle picker + rule reminder */}
        <div style={{ width: 300, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 24, overflowY: 'auto' }}>
          <div style={{ fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Puzzle</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 22 }}>
            {PUZZLES.map((p, i) => (
              <button key={i} onClick={() => selectPuzzle(i)}
                style={{ padding: '9px 12px', borderRadius: 8, border: `1px solid ${i === pzIdx ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.1)'}`, background: i === pzIdx ? 'rgba(34,211,238,0.12)' : 'transparent', color: i === pzIdx ? '#22d3ee' : '#a6b0b1', fontSize: 15, fontFamily: 'monospace', cursor: 'pointer', textAlign: 'left' }}>
                {p.target}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>The rules</div>
          <div style={{ fontSize: 15, color: '#7c8590', lineHeight: 1.8 }}>
            <strong style={{ color: '#cbd5e1' }}>Reverse</strong> a step → flip the sign of ΔH.<br />
            <strong style={{ color: '#cbd5e1' }}>Scale</strong> a step by a factor → multiply ΔH by that factor.<br /><br />
            Pick the manipulation for each step that makes them add up to the target equation.
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, overflow: 'auto', padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 15, color: '#a6b0b1', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Target reaction</div>
          <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'monospace', color: '#f8fafc', marginBottom: 8, textAlign: 'center' }}>{puzzle.target}</div>
          <div style={{ fontSize: 18, fontFamily: 'monospace', color: '#fbbf24', marginBottom: 26 }}>ΔH = {checked && allCorrect ? `${puzzle.targetDH} kJ` : '? kJ'}</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: '100%', maxWidth: 680, marginBottom: 22 }}>
            {puzzle.steps.map((step, si) => (
              <div key={si}>
                <div style={{ fontSize: 15, color: '#a6b0b1', fontWeight: 700, marginBottom: 8 }}>{step.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {step.choices.map((c, ci) => {
                    const isSel = selected[si] === ci
                    const wrong = checked && isSel && !c.correct
                    const showCorrect = checked && c.correct
                    return (
                      <button key={ci} onClick={() => pick(si, ci)}
                        style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 9,
                          border: `1.5px solid ${wrong ? '#f87171' : showCorrect ? '#4ade80' : isSel ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.1)'}`,
                          background: wrong ? 'rgba(239,68,68,0.1)' : showCorrect ? 'rgba(74,222,128,0.1)' : isSel ? 'rgba(34,211,238,0.1)' : 'rgba(255,255,255,0.03)',
                          cursor: checked ? 'default' : 'pointer', fontSize: 16, fontFamily: 'monospace', textAlign: 'left',
                          color: wrong ? '#fca5a5' : showCorrect ? '#86efac' : '#cbd5e1',
                        }}>
                        <span>{c.eq}</span>
                        <span style={{ marginLeft: 12, fontWeight: 700 }}>{c.dH > 0 ? `+${c.dH}` : c.dH} kJ</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {!checked && (
            <button onClick={() => setChecked(true)} disabled={!allPicked}
              style={{ padding: '11px 28px', borderRadius: 10, border: '1px solid rgba(34,211,238,0.4)', background: allPicked ? 'rgba(34,211,238,0.12)' : 'rgba(255,255,255,0.03)', color: allPicked ? '#22d3ee' : '#525a72', fontSize: 17, fontWeight: 700, cursor: allPicked ? 'pointer' : 'not-allowed', marginBottom: 18 }}>
              Check
            </button>
          )}

          {checked && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: allCorrect ? '#4ade80' : '#f87171' }}>
                {allCorrect ? '✓ Correct!' : '✗ Not quite — check the red step(s) above.'}
              </div>
              <div style={{ fontSize: 16, color: '#a6b0b1', fontFamily: 'monospace' }}>
                Sum: {selected.map((c, i) => c !== null ? (puzzle.steps[i].choices[c].dH > 0 ? `+${puzzle.steps[i].choices[c].dH}` : puzzle.steps[i].choices[c].dH) : '?').join(' + ')} = <strong style={{ color: allCorrect ? '#86efac' : '#f8fafc' }}>{sum.toFixed(1)} kJ</strong>
              </div>
              {allCorrect && <div style={{ fontSize: 15, color: '#7c8590', lineHeight: 1.7, maxWidth: 560, textAlign: 'center' }}>{puzzle.note}</div>}
              <button onClick={() => selectPuzzle((pzIdx + 1) % PUZZLES.length)} style={{ padding: '10px 24px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#a6b0b1', fontSize: 16, cursor: 'pointer', marginTop: 6 }}>
                Next puzzle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
