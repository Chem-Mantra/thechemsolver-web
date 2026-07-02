'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'

// ── Bond Polarity Visualizer ─────────────────────────────────────────────
// Pick any two elements, see the electronegativity difference (ΔEN), the
// resulting bond classification (nonpolar / polar covalent / ionic — the
// standard AP cutoffs at ΔEN 0.5 and 1.7), and a dipole-arrow diagram with
// δ+/δ− labels. Pauling electronegativities below, web-verified.

const EN: Record<string, number> = {
  H: 2.20,
  Li: 0.98, Be: 1.57, B: 2.04, C: 2.55, N: 3.04, O: 3.44, F: 3.98,
  Na: 0.93, Mg: 1.31, Al: 1.61, Si: 1.90, P: 2.19, S: 2.58, Cl: 3.16,
  K: 0.82, Ca: 1.00, Br: 2.96,
  Rb: 0.82, Sr: 0.95, I: 2.66,
  Cs: 0.79, Ba: 0.89,
  Fe: 1.83, Cu: 1.90, Zn: 1.65, Ag: 1.93, Au: 2.54, Pb: 2.33, Sn: 1.96,
}
const ELEMENTS = Object.keys(EN)

const COLOR: Record<string, string> = {
  H: '#e2e8f0', Li: '#c4b5fd', Be: '#5eead4', B: '#f9a8d4', C: '#94a3b8', N: '#60a5fa', O: '#f87171', F: '#86efac',
  Na: '#c4b5fd', Mg: '#5eead4', Al: '#cbd5e1', Si: '#a3a3a3', P: '#fb923c', S: '#fbbf24', Cl: '#4ade80',
  K: '#c4b5fd', Ca: '#5eead4', Br: '#fb7185',
  Rb: '#c4b5fd', Sr: '#5eead4', I: '#c084fc',
  Cs: '#c4b5fd', Ba: '#5eead4',
  Fe: '#fdba74', Cu: '#f97316', Zn: '#67e8f9', Ag: '#e5e7eb', Au: '#fde047', Pb: '#94a3b8', Sn: '#cbd5e1',
}

function classify(d: number): { label: string; color: string } {
  if (d < 0.5) return { label: 'Nonpolar covalent', color: '#4ade80' }
  if (d < 1.7) return { label: 'Polar covalent', color: '#fbbf24' }
  return { label: 'Ionic', color: '#f87171' }
}

const QUICK_PAIRS: [string, string][] = [
  ['H', 'H'], ['C', 'H'], ['Cl', 'Cl'], ['C', 'C'],
  ['H', 'Cl'], ['C', 'O'], ['N', 'H'], ['O', 'H'], ['C', 'Cl'], ['C', 'F'], ['S', 'O'],
  ['Na', 'Cl'], ['K', 'Br'], ['Mg', 'O'], ['Ca', 'O'], ['Cs', 'F'], ['Li', 'F'],
]

type Mode = 'explore' | 'classify'

export default function BondPolarityVisualizer() {
  const [mode, setMode] = useState<Mode>('explore')
  const [elA, setElA] = useState('H')
  const [elB, setElB] = useState('Cl')

  const [chalA, setChalA] = useState('Na')
  const [chalB, setChalB] = useState('Cl')
  const [guess, setGuess] = useState<string | null>(null)

  const enA = EN[elA], enB = EN[elB]
  const delta = Math.abs(enA - enB)
  const result = classify(delta)

  const chalEnA = EN[chalA], chalEnB = EN[chalB]
  const chalDelta = Math.abs(chalEnA - chalEnB)
  const chalResult = classify(chalDelta)

  function newChallenge() {
    const a = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)]
    let b = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)]
    while (b === a) b = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)]
    setChalA(a); setChalB(b); setGuess(null)
  }

  function checkGuess(label: string) {
    setGuess(label)
  }

  const gaugeMax = 3.6
  const gaugePct = (d: number) => Math.min(100, (d / gaugeMax) * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 52, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#a6b0b1', textDecoration: 'none', fontSize: 16 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 19 }}>Bond Polarity Visualizer</strong>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: controls */}
        <div style={{ width: 330, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 24, overflowY: 'auto' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
            <button onClick={() => setMode('explore')} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: `1px solid ${mode === 'explore' ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.1)'}`, background: mode === 'explore' ? 'rgba(34,211,238,0.12)' : 'transparent', color: mode === 'explore' ? '#22d3ee' : '#a6b0b1', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Explore</button>
            <button onClick={() => { setMode('classify'); newChallenge() }} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: `1px solid ${mode === 'classify' ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.1)'}`, background: mode === 'classify' ? 'rgba(167,139,250,0.12)' : 'transparent', color: mode === 'classify' ? '#a78bfa' : '#a6b0b1', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Classify</button>
          </div>

          {mode === 'explore' && (
            <>
              <div style={{ fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Bond between</div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <select value={elA} onChange={e => setElA(e.target.value)} style={selStyle}>
                  {ELEMENTS.map(el => <option key={el} value={el}>{el}</option>)}
                </select>
                <select value={elB} onChange={e => setElB(e.target.value)} style={selStyle}>
                  {ELEMENTS.map(el => <option key={el} value={el}>{el}</option>)}
                </select>
              </div>

              <div style={{ fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Common bonds</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                {QUICK_PAIRS.map(([a, b], i) => (
                  <button key={i} onClick={() => { setElA(a); setElB(b) }}
                    style={{ padding: '6px 10px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: (elA === a && elB === b) ? 'rgba(34,211,238,0.15)' : 'transparent', color: (elA === a && elB === b) ? '#22d3ee' : '#a6b0b1', fontSize: 15, cursor: 'pointer', fontFamily: 'monospace' }}>
                    {a}–{b}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px' }}>
                  <div style={{ fontSize: 15, color: '#a6b0b1' }}>EN({elA})</div>
                  <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'monospace', color: COLOR[elA] }}>{enA.toFixed(2)}</div>
                </div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px' }}>
                  <div style={{ fontSize: 15, color: '#a6b0b1' }}>EN({elB})</div>
                  <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'monospace', color: COLOR[elB] }}>{enB.toFixed(2)}</div>
                </div>
              </div>

              <div style={{ background: `${result.color}18`, border: `1px solid ${result.color}55`, borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
                <div style={{ fontSize: 15, color: '#a6b0b1', marginBottom: 4 }}>ΔEN = |{enA.toFixed(2)} − {enB.toFixed(2)}|</div>
                <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'monospace', color: result.color, marginBottom: 6 }}>{delta.toFixed(2)}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: result.color }}>{result.label}</div>
              </div>
            </>
          )}

          {mode === 'classify' && (
            <>
              <div style={{ fontSize: 16, color: '#a6b0b1', lineHeight: 1.7, marginBottom: 18 }}>
                Classify the <strong style={{ color: '#f8fafc' }}>{chalA}–{chalB}</strong> bond as nonpolar covalent, polar covalent, or ionic.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                {['Nonpolar covalent', 'Polar covalent', 'Ionic'].map(label => {
                  const c = label === 'Nonpolar covalent' ? '#4ade80' : label === 'Polar covalent' ? '#fbbf24' : '#f87171'
                  const isPicked = guess === label
                  const isAnswer = chalResult.label === label
                  const show = guess !== null
                  return (
                    <button key={label} onClick={() => checkGuess(label)}
                      style={{
                        padding: '12px 14px', borderRadius: 9, fontSize: 16, fontWeight: 700, cursor: guess ? 'default' : 'pointer', textAlign: 'left',
                        border: `1.5px solid ${show && isAnswer ? c : show && isPicked ? '#f87171' : 'rgba(255,255,255,0.12)'}`,
                        background: show && isAnswer ? `${c}22` : show && isPicked ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.03)',
                        color: show && (isAnswer || isPicked) ? c : '#cbd5e1',
                      }}>
                      {label} {show && isAnswer ? '✓' : show && isPicked ? '✗' : ''}
                    </button>
                  )
                })}
              </div>
              {guess !== null && (
                <div style={{ fontSize: 15, color: '#a6b0b1', marginBottom: 14, lineHeight: 1.7 }}>
                  ΔEN = |{chalEnA.toFixed(2)} − {chalEnB.toFixed(2)}| = <strong style={{ color: '#f8fafc' }}>{chalDelta.toFixed(2)}</strong>
                </div>
              )}
              <button onClick={newChallenge} style={{ width: '100%', padding: '9px 0', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#a6b0b1', fontSize: 15, cursor: 'pointer' }}>
                New pair
              </button>
            </>
          )}

          <div style={{ marginTop: 26, fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Cutoffs</div>
          <div style={{ fontSize: 15, color: '#a6b0b1', lineHeight: 1.9 }}>
            <div><span style={{ color: '#4ade80', fontWeight: 700 }}>ΔEN &lt; 0.5</span> — nonpolar covalent</div>
            <div><span style={{ color: '#fbbf24', fontWeight: 700 }}>0.5 ≤ ΔEN &lt; 1.7</span> — polar covalent</div>
            <div><span style={{ color: '#f87171', fontWeight: 700 }}>ΔEN ≥ 1.7</span> — ionic</div>
          </div>
        </div>

        {/* Main: diagram */}
        <div style={{ flex: 1, overflow: 'auto', padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {(() => {
            const A = mode === 'explore' ? elA : chalA
            const B = mode === 'explore' ? elB : chalB
            const d = mode === 'explore' ? delta : chalDelta
            const res = mode === 'explore' ? result : chalResult
            const [loEl, hiEl] = EN[A] <= EN[B] ? [A, B] : [B, A]
            const arrowLen = 40 + Math.min(1, d / 3) * 140
            const showLabels = mode === 'explore' || guess !== null

            return (
              <>
                <div style={{ marginBottom: 18, fontSize: 17, color: '#a6b0b1' }}>
                  {showLabels ? <>Bond: <strong style={{ color: '#f8fafc' }}>{A}–{B}</strong></> : <>Bond between two unlabeled elements</>}
                </div>

                <svg viewBox="0 0 600 260" width="100%" style={{ maxWidth: 640 }}>
                  {/* dipole arrow */}
                  {showLabels && d >= 0.3 && (
                    <g>
                      <defs>
                        <marker id="dipoleHead" markerWidth={10} markerHeight={10} refX={8} refY={4} orient="auto">
                          <path d="M0,0 L9,4 L0,8 Z" fill={res.color} />
                        </marker>
                      </defs>
                      <line
                        x1={300 - arrowLen / 2 * (EN[A] <= EN[B] ? 1 : -1)}
                        y1={70}
                        x2={300 + arrowLen / 2 * (EN[A] <= EN[B] ? 1 : -1)}
                        y2={70}
                        stroke={res.color} strokeWidth={3.5} markerEnd="url(#dipoleHead)" />
                      <line x1={300 - arrowLen / 2 * (EN[A] <= EN[B] ? 1 : -1)} y1={62} x2={300 - arrowLen / 2 * (EN[A] <= EN[B] ? 1 : -1)} y2={78} stroke={res.color} strokeWidth={3.5} />
                    </g>
                  )}

                  {/* bond line */}
                  <line x1={190} y1={150} x2={410} y2={150} stroke={res.label === 'Ionic' ? 'transparent' : '#cbd5e1'} strokeWidth={4} strokeDasharray={res.label === 'Ionic' ? '6,6' : undefined} />
                  {res.label === 'Ionic' && <line x1={190} y1={150} x2={410} y2={150} stroke="#525a72" strokeWidth={3} strokeDasharray="6,6" />}

                  {/* atoms */}
                  <circle cx={150} cy={150} r={42} fill="#0b0f1c" stroke={COLOR[A]} strokeWidth={3} />
                  <text x={150} y={159} textAnchor="middle" fontSize={26} fontWeight={800} fill={COLOR[A]}>{A}</text>
                  <circle cx={450} cy={150} r={42} fill="#0b0f1c" stroke={COLOR[B]} strokeWidth={3} />
                  <text x={450} y={159} textAnchor="middle" fontSize={26} fontWeight={800} fill={COLOR[B]}>{B}</text>

                  {showLabels && d >= 0.3 && (
                    <>
                      <text x={A === loEl ? 150 : 450} y={210} textAnchor="middle" fontSize={20} fontWeight={800} fill="#fbbf24">δ+</text>
                      <text x={A === hiEl ? 150 : 450} y={210} textAnchor="middle" fontSize={20} fontWeight={800} fill="#60a5fa">δ−</text>
                    </>
                  )}
                  {showLabels && res.label === 'Ionic' && (
                    <>
                      <text x={A === loEl ? 150 : 450} y={210} textAnchor="middle" fontSize={20} fontWeight={800} fill="#fbbf24">+</text>
                      <text x={A === hiEl ? 150 : 450} y={210} textAnchor="middle" fontSize={20} fontWeight={800} fill="#60a5fa">−</text>
                    </>
                  )}
                </svg>

                {/* polarity gauge */}
                <div style={{ width: '100%', maxWidth: 640, marginTop: 10 }}>
                  <div style={{ position: 'relative', height: 34, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ position: 'absolute', left: 0, width: `${gaugePct(0.5)}%`, top: 0, bottom: 0, background: 'rgba(74,222,128,0.25)' }} />
                    <div style={{ position: 'absolute', left: `${gaugePct(0.5)}%`, width: `${gaugePct(1.7) - gaugePct(0.5)}%`, top: 0, bottom: 0, background: 'rgba(251,191,36,0.25)' }} />
                    <div style={{ position: 'absolute', left: `${gaugePct(1.7)}%`, right: 0, top: 0, bottom: 0, background: 'rgba(248,113,113,0.25)' }} />
                    {showLabels && (
                      <div style={{ position: 'absolute', left: `calc(${gaugePct(d)}% - 2px)`, top: 0, bottom: 0, width: 4, background: '#f8fafc', boxShadow: '0 0 8px #fff' }} />
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, color: '#a6b0b1', marginTop: 6 }}>
                    <span>0</span><span>0.5</span><span>1.7</span><span>{gaugeMax}+</span>
                  </div>
                </div>
              </>
            )
          })()}

          <div style={{ marginTop: 22, fontSize: 15, color: '#7c8590', lineHeight: 1.8, maxWidth: 640, textAlign: 'center' }}>
            Electronegativity values are the standard Pauling scale. The dipole arrow points from the less electronegative atom (δ+) toward the more electronegative one (δ−), tail crossed like a partial-plus sign — the convention used in AP Chemistry.
          </div>
        </div>
      </div>
    </div>
  )
}

const selStyle: React.CSSProperties = {
  flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8,
  color: '#f8fafc', fontSize: 17, fontFamily: 'monospace', padding: '8px 6px', textAlign: 'center',
}
