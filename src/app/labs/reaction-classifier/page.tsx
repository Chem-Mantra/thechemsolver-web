'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'

// ── Reaction Type Classifier ─────────────────────────────────────────────
// Classify balanced equations into the 5 standard reaction types. All
// equations below are real, correctly balanced reactions (verified by hand:
// every atom count matches on both sides).

type Category = 'Synthesis' | 'Decomposition' | 'Single replacement' | 'Double replacement' | 'Combustion'
type Reaction = { eq: string; category: Category; explain: string }

const CATEGORY_COLOR: Record<Category, string> = {
  Synthesis: '#4ade80',
  Decomposition: '#fb923c',
  'Single replacement': '#60a5fa',
  'Double replacement': '#c084fc',
  Combustion: '#f87171',
}

const CATEGORY_RULE: Record<Category, string> = {
  Synthesis: 'A + B → AB — two or more simple substances combine into one product.',
  Decomposition: 'AB → A + B — one compound breaks down into two or more simpler substances.',
  'Single replacement': 'A + BC → AC + B — one element replaces another in a compound.',
  'Double replacement': 'AB + CD → AD + CB — the ions of two compounds swap partners.',
  Combustion: 'fuel + O₂ → CO₂ + H₂O — a substance burns rapidly in oxygen, releasing heat/light.',
}

const REACTIONS: Reaction[] = [
  { eq: '2H₂ + O₂ → 2H₂O', category: 'Synthesis', explain: 'Two elements combine into a single compound.' },
  { eq: 'N₂ + 3H₂ → 2NH₃', category: 'Synthesis', explain: 'The Haber process — two elements combine into ammonia.' },
  { eq: '2Na + Cl₂ → 2NaCl', category: 'Synthesis', explain: 'A metal and a nonmetal combine into a salt.' },
  { eq: 'CaO + H₂O → Ca(OH)₂', category: 'Synthesis', explain: 'Two compounds combine into one larger compound.' },
  { eq: 'S + O₂ → SO₂', category: 'Synthesis', explain: 'Two elements combine into a single compound.' },

  { eq: '2H₂O₂ → 2H₂O + O₂', category: 'Decomposition', explain: 'Hydrogen peroxide breaks down into water and oxygen gas.' },
  { eq: 'CaCO₃ → CaO + CO₂', category: 'Decomposition', explain: 'Thermal decomposition of limestone.' },
  { eq: '2KClO₃ → 2KCl + 3O₂', category: 'Decomposition', explain: 'One compound splits into a salt and oxygen gas.' },
  { eq: '2NaHCO₃ → Na₂CO₃ + H₂O + CO₂', category: 'Decomposition', explain: 'Baking soda decomposes into three simpler substances on heating.' },
  { eq: '2HgO → 2Hg + O₂', category: 'Decomposition', explain: 'A compound breaks into its constituent elements.' },

  { eq: 'Zn + 2HCl → ZnCl₂ + H₂', category: 'Single replacement', explain: 'Zinc replaces hydrogen in hydrochloric acid.' },
  { eq: 'Fe + CuSO₄ → FeSO₄ + Cu', category: 'Single replacement', explain: 'Iron replaces copper in copper sulfate (a classic activity-series demo).' },
  { eq: '2Al + 3CuCl₂ → 2AlCl₃ + 3Cu', category: 'Single replacement', explain: 'Aluminum replaces copper in copper chloride.' },
  { eq: 'Mg + 2HCl → MgCl₂ + H₂', category: 'Single replacement', explain: 'Magnesium replaces hydrogen in the acid.' },
  { eq: 'Cl₂ + 2NaBr → 2NaCl + Br₂', category: 'Single replacement', explain: 'Chlorine, more reactive, displaces bromide from solution.' },

  { eq: 'AgNO₃ + NaCl → AgCl + NaNO₃', category: 'Double replacement', explain: 'Ag⁺ and Na⁺ swap partners; AgCl precipitates out.' },
  { eq: 'BaCl₂ + Na₂SO₄ → BaSO₄ + 2NaCl', category: 'Double replacement', explain: 'Ba²⁺ and Na⁺ swap partners; BaSO₄ precipitates.' },
  { eq: 'Pb(NO₃)₂ + 2KI → PbI₂ + 2KNO₃', category: 'Double replacement', explain: 'Pb²⁺ and K⁺ swap partners; PbI₂ precipitates (bright yellow).' },
  { eq: 'HCl + NaOH → NaCl + H₂O', category: 'Double replacement', explain: 'Acid-base neutralization — a special case of double replacement.' },
  { eq: 'CaCl₂ + Na₂CO₃ → CaCO₃ + 2NaCl', category: 'Double replacement', explain: 'Ca²⁺ and Na⁺ swap partners; CaCO₃ precipitates.' },

  { eq: 'CH₄ + 2O₂ → CO₂ + 2H₂O', category: 'Combustion', explain: 'Methane burns completely in oxygen.' },
  { eq: 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O', category: 'Combustion', explain: 'Propane combustion (the gas in a grill tank).' },
  { eq: '2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O', category: 'Combustion', explain: 'Ethane combustion.' },
  { eq: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O', category: 'Combustion', explain: 'Glucose combustion (the overall reaction behind cellular respiration).' },
  { eq: '2C₄H₁₀ + 13O₂ → 8CO₂ + 10H₂O', category: 'Combustion', explain: 'Butane combustion (lighter fluid).' },
]

const CATEGORIES: Category[] = ['Synthesis', 'Decomposition', 'Single replacement', 'Double replacement', 'Combustion']

type Mode = 'explore' | 'quiz'

export default function ReactionClassifier() {
  const [mode, setMode] = useState<Mode>('quiz')
  const [idx, setIdx] = useState(0)
  const [pick, setPick] = useState<Category | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const reaction = REACTIONS[idx]

  function next() {
    setIdx(Math.floor(Math.random() * REACTIONS.length))
    setPick(null)
  }

  function choose(cat: Category) {
    if (pick !== null) return
    setPick(cat)
    setScore(s => ({ correct: s.correct + (cat === reaction.category ? 1 : 0), total: s.total + 1 }))
  }

  const grouped = useMemo(() => {
    const map: Record<Category, Reaction[]> = { Synthesis: [], Decomposition: [], 'Single replacement': [], 'Double replacement': [], Combustion: [] }
    REACTIONS.forEach(r => map[r.category].push(r))
    return map
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 52, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#a6b0b1', textDecoration: 'none', fontSize: 16 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 19 }}>Reaction Type Classifier</strong>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: controls */}
        <div style={{ width: 320, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 24, overflowY: 'auto' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
            <button onClick={() => setMode('quiz')} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: `1px solid ${mode === 'quiz' ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.1)'}`, background: mode === 'quiz' ? 'rgba(34,211,238,0.12)' : 'transparent', color: mode === 'quiz' ? '#22d3ee' : '#a6b0b1', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Quiz</button>
            <button onClick={() => setMode('explore')} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: `1px solid ${mode === 'explore' ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.1)'}`, background: mode === 'explore' ? 'rgba(167,139,250,0.12)' : 'transparent', color: mode === 'explore' ? '#a78bfa' : '#a6b0b1', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Reference</button>
          </div>

          {mode === 'quiz' && (
            <>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 16px', marginBottom: 18 }}>
                <div style={{ fontSize: 15, color: '#a6b0b1', marginBottom: 4 }}>Score</div>
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'monospace', color: '#22d3ee' }}>{score.correct} / {score.total}</div>
              </div>

              <div style={{ fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Pick the reaction type</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {CATEGORIES.map(cat => {
                  const show = pick !== null
                  const isAnswer = cat === reaction.category
                  const isPicked = pick === cat
                  return (
                    <button key={cat} onClick={() => choose(cat)}
                      style={{
                        padding: '11px 14px', borderRadius: 9, fontSize: 16, fontWeight: 700, cursor: pick ? 'default' : 'pointer', textAlign: 'left',
                        border: `1.5px solid ${show && isAnswer ? CATEGORY_COLOR[cat] : show && isPicked ? '#f87171' : 'rgba(255,255,255,0.12)'}`,
                        background: show && isAnswer ? `${CATEGORY_COLOR[cat]}22` : show && isPicked ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.03)',
                        color: show && isAnswer ? CATEGORY_COLOR[cat] : show && isPicked ? '#fca5a5' : '#cbd5e1',
                      }}>
                      {cat} {show && isAnswer ? '✓' : show && isPicked ? '✗' : ''}
                    </button>
                  )
                })}
              </div>

              {pick !== null && (
                <div style={{ fontSize: 15, color: '#a6b0b1', lineHeight: 1.7, marginBottom: 14, background: 'rgba(255,255,255,0.02)', borderRadius: 9, padding: '11px 13px' }}>
                  <strong style={{ color: CATEGORY_COLOR[reaction.category] }}>{reaction.category}:</strong> {reaction.explain}
                </div>
              )}
              <button onClick={next} style={{ width: '100%', padding: '9px 0', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#a6b0b1', fontSize: 16, cursor: 'pointer' }}>
                Next reaction
              </button>
            </>
          )}

          {mode === 'explore' && (
            <div style={{ fontSize: 15, color: '#a6b0b1', lineHeight: 1.9 }}>
              Browse all 5 reaction types and their patterns on the right. Switch to Quiz to practice classifying them.
            </div>
          )}

          <div style={{ marginTop: 24, fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>The 5 patterns</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {CATEGORIES.map(cat => (
              <div key={cat} style={{ fontSize: 15, lineHeight: 1.6 }}>
                <strong style={{ color: CATEGORY_COLOR[cat] }}>{cat}:</strong> <span style={{ color: '#7c8590' }}>{CATEGORY_RULE[cat]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, overflow: 'auto', padding: 30 }}>
          {mode === 'quiz' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60 }}>
              <div style={{ fontSize: 15, color: '#a6b0b1', marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.1em' }}>What type of reaction is this?</div>
              <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'monospace', color: '#f8fafc', textAlign: 'center', maxWidth: 700, lineHeight: 1.6, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '30px 36px' }}>
                {reaction.eq}
              </div>
            </div>
          )}

          {mode === 'explore' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 26, maxWidth: 800, margin: '0 auto' }}>
              {CATEGORIES.map(cat => (
                <div key={cat}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 4, height: 20, borderRadius: 2, background: CATEGORY_COLOR[cat] }} />
                    <div style={{ fontSize: 19, fontWeight: 800, color: CATEGORY_COLOR[cat] }}>{cat}</div>
                  </div>
                  <div style={{ fontSize: 15, color: '#7c8590', marginBottom: 10, marginLeft: 14 }}>{CATEGORY_RULE[cat]}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginLeft: 14 }}>
                    {grouped[cat].map(r => (
                      <div key={r.eq} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '9px 14px', fontFamily: 'monospace', fontSize: 17 }}>
                        {r.eq}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
