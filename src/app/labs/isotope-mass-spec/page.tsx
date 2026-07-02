'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'

// ── Isotope Mass Spectrometer ────────────────────────────────────────────
// Mass spectrum of an element: peak position = isotope mass (amu), peak
// height = relative natural abundance (%). The weighted average of all
// peaks gives the atomic mass shown on the periodic table — this is the
// core AP Chem skill the "Calculate" mode practices directly.
//
// Isotope masses & abundances are real, sourced from a standard reference
// table (cross-checked against NIST-style isotope composition data), not
// modeled/approximated — unlike the PES lab's binding energies, these
// numbers should match what's in a textbook isotope table.

type Isotope = { mass: number; abundance: number }

const ISOTOPE_DATA: Record<string, Isotope[]> = {
  H: [{ mass: 1.007825, abundance: 99.985 }, { mass: 2.014102, abundance: 0.015 }],
  Li: [{ mass: 6.015123, abundance: 7.42 }, { mass: 7.016005, abundance: 92.58 }],
  B: [{ mass: 10.012938, abundance: 19.80 }, { mass: 11.009305, abundance: 80.20 }],
  C: [{ mass: 12.000000, abundance: 98.90 }, { mass: 13.003355, abundance: 1.10 }],
  N: [{ mass: 14.003074, abundance: 99.63 }, { mass: 15.000109, abundance: 0.37 }],
  O: [{ mass: 15.994915, abundance: 99.76 }, { mass: 16.999131, abundance: 0.038 }, { mass: 17.999159, abundance: 0.20 }],
  Ne: [{ mass: 19.992439, abundance: 90.60 }, { mass: 20.993845, abundance: 0.26 }, { mass: 21.991384, abundance: 9.20 }],
  Mg: [{ mass: 23.985045, abundance: 78.90 }, { mass: 24.985839, abundance: 10.00 }, { mass: 25.982595, abundance: 11.10 }],
  Si: [{ mass: 27.976928, abundance: 92.23 }, { mass: 28.976496, abundance: 4.67 }, { mass: 29.973772, abundance: 3.10 }],
  S: [{ mass: 31.972072, abundance: 95.02 }, { mass: 32.971459, abundance: 0.75 }, { mass: 33.967868, abundance: 4.21 }, { mass: 35.967079, abundance: 0.02 }],
  Cl: [{ mass: 34.968853, abundance: 75.77 }, { mass: 36.965903, abundance: 24.23 }],
  Ar: [{ mass: 35.967546, abundance: 0.34 }, { mass: 37.962732, abundance: 0.063 }, { mass: 39.962383, abundance: 99.60 }],
  K: [{ mass: 38.963708, abundance: 93.20 }, { mass: 39.963999, abundance: 0.012 }, { mass: 40.961825, abundance: 6.73 }],
  Ca: [{ mass: 39.962591, abundance: 96.95 }, { mass: 41.958622, abundance: 0.65 }, { mass: 42.958770, abundance: 0.14 }, { mass: 43.955485, abundance: 2.086 }, { mass: 45.953689, abundance: 0.004 }, { mass: 47.952532, abundance: 0.19 }],
  Ti: [{ mass: 45.952633, abundance: 8.00 }, { mass: 46.951765, abundance: 7.30 }, { mass: 47.947947, abundance: 73.80 }, { mass: 48.947871, abundance: 5.50 }, { mass: 49.944786, abundance: 5.40 }],
  Cr: [{ mass: 49.946046, abundance: 4.35 }, { mass: 51.940510, abundance: 83.79 }, { mass: 52.940651, abundance: 9.50 }, { mass: 53.938882, abundance: 2.36 }],
  Fe: [{ mass: 53.939612, abundance: 5.80 }, { mass: 55.934939, abundance: 91.72 }, { mass: 56.935396, abundance: 2.20 }, { mass: 57.933278, abundance: 0.28 }],
  Ni: [{ mass: 57.935347, abundance: 68.27 }, { mass: 59.930789, abundance: 26.10 }, { mass: 60.931059, abundance: 1.13 }, { mass: 61.928346, abundance: 3.59 }, { mass: 63.927968, abundance: 0.91 }],
  Cu: [{ mass: 62.929599, abundance: 69.17 }, { mass: 64.927792, abundance: 30.83 }],
  Zn: [{ mass: 63.929145, abundance: 48.60 }, { mass: 65.926035, abundance: 27.90 }, { mass: 66.927129, abundance: 4.10 }, { mass: 67.924846, abundance: 18.80 }, { mass: 69.925325, abundance: 0.60 }],
  Ga: [{ mass: 68.925581, abundance: 60.10 }, { mass: 70.924701, abundance: 39.90 }],
  Br: [{ mass: 78.918336, abundance: 50.69 }, { mass: 80.916290, abundance: 49.31 }],
  Ag: [{ mass: 106.905095, abundance: 51.84 }, { mass: 108.904754, abundance: 48.16 }],
  Sn: [{ mass: 111.904826, abundance: 0.97 }, { mass: 113.902784, abundance: 0.65 }, { mass: 114.903348, abundance: 0.36 }, { mass: 115.901744, abundance: 14.70 }, { mass: 116.902954, abundance: 7.70 }, { mass: 117.901607, abundance: 24.30 }, { mass: 118.903310, abundance: 8.60 }, { mass: 119.902199, abundance: 32.40 }, { mass: 121.903440, abundance: 4.60 }, { mass: 123.905271, abundance: 5.60 }],
  Sb: [{ mass: 120.903824, abundance: 57.30 }, { mass: 122.904222, abundance: 42.70 }],
  I: [{ mass: 126.904477, abundance: 100.00 }],
}

const ELEMENT_NAMES: Record<string, string> = {
  H: 'Hydrogen', Li: 'Lithium', B: 'Boron', C: 'Carbon', N: 'Nitrogen', O: 'Oxygen', Ne: 'Neon',
  Mg: 'Magnesium', Si: 'Silicon', S: 'Sulfur', Cl: 'Chlorine', Ar: 'Argon', K: 'Potassium', Ca: 'Calcium',
  Ti: 'Titanium', Cr: 'Chromium', Fe: 'Iron', Ni: 'Nickel', Cu: 'Copper', Zn: 'Zinc', Ga: 'Gallium',
  Br: 'Bromine', Ag: 'Silver', Sn: 'Tin', Sb: 'Antimony', I: 'Iodine',
}

const SYMBOLS = Object.keys(ISOTOPE_DATA)

const PEAK_COLORS = ['#22d3ee', '#f97316', '#a78bfa', '#f472b6', '#4ade80', '#fbbf24', '#ef4444', '#38bdf8', '#fb7185', '#34d399']

function averageMass(isotopes: Isotope[]) {
  return isotopes.reduce((sum, iso) => sum + iso.mass * (iso.abundance / 100), 0)
}

const PLOT_X0 = 70
const PLOT_X1 = 870
const PLOT_Y0 = 30
const PLOT_Y1 = 300

function peakPath(cx: number, height: number, x0: number, x1: number, width = 7) {
  const pts: string[] = []
  const steps = 24
  for (let i = 0; i <= steps; i++) {
    const dx = (i / steps - 0.5) * width * 3.2
    const y = height * Math.exp(-(dx * dx) / (2 * width * width))
    pts.push(`${cx + dx},${PLOT_Y1 - y}`)
  }
  return `M${x0},${PLOT_Y1} L${pts[0]} ` + pts.map(p => `L${p}`).join(' ') + ` L${x1},${PLOT_Y1} Z`
}

type Mode = 'explore' | 'calculate'

export default function IsotopeMassSpec() {
  const [mode, setMode] = useState<Mode>('explore')
  const [symbol, setSymbol] = useState('Cl')
  const [hovered, setHovered] = useState<number | null>(null)

  const [challengeSymbol, setChallengeSymbol] = useState('Br')
  const [answer, setAnswer] = useState('')
  const [checked, setChecked] = useState<'correct' | 'wrong' | null>(null)

  const isotopes = ISOTOPE_DATA[symbol]
  const avgMass = useMemo(() => averageMass(isotopes), [isotopes])
  const maxAbundance = Math.max(...isotopes.map(i => i.abundance))

  const challengeIsotopes = ISOTOPE_DATA[challengeSymbol]
  const challengeAvg = useMemo(() => averageMass(challengeIsotopes), [challengeIsotopes])
  const challengeMax = Math.max(...challengeIsotopes.map(i => i.abundance))

  const minMass = Math.min(...isotopes.map(i => i.mass))
  const maxMass = Math.max(...isotopes.map(i => i.mass))
  const padding = Math.max(1.2, (maxMass - minMass) * 0.6 + 0.8)
  const lo = minMass - padding, hi = maxMass + padding
  const xFor = (m: number) => PLOT_X0 + ((m - lo) / (hi - lo)) * (PLOT_X1 - PLOT_X0)

  const cMinMass = Math.min(...challengeIsotopes.map(i => i.mass))
  const cMaxMass = Math.max(...challengeIsotopes.map(i => i.mass))
  const cPadding = Math.max(1.2, (cMaxMass - cMinMass) * 0.6 + 0.8)
  const cLo = cMinMass - cPadding, cHi = cMaxMass + cPadding
  const cXFor = (m: number) => PLOT_X0 + ((m - cLo) / (cHi - cLo)) * (PLOT_X1 - PLOT_X0)

  function newChallenge() {
    const pool = SYMBOLS.filter(s => ISOTOPE_DATA[s].length >= 2)
    setChallengeSymbol(pool[Math.floor(Math.random() * pool.length)])
    setAnswer('')
    setChecked(null)
  }

  function checkAnswer() {
    const guess = parseFloat(answer)
    if (!isFinite(guess)) { setChecked('wrong'); return }
    setChecked(Math.abs(guess - challengeAvg) <= 0.05 ? 'correct' : 'wrong')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 50, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#849495', textDecoration: 'none', fontSize: 16 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 18 }}>Isotope Mass Spectrometer</strong>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: controls */}
        <div style={{ width: 310, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 22, overflowY: 'auto' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
            <button onClick={() => setMode('explore')} style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: `1px solid ${mode === 'explore' ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.1)'}`, background: mode === 'explore' ? 'rgba(34,211,238,0.12)' : 'transparent', color: mode === 'explore' ? '#22d3ee' : '#849495', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Explore</button>
            <button onClick={() => { setMode('calculate'); newChallenge() }} style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: `1px solid ${mode === 'calculate' ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.1)'}`, background: mode === 'calculate' ? 'rgba(167,139,250,0.12)' : 'transparent', color: mode === 'calculate' ? '#a78bfa' : '#849495', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Calculate</button>
          </div>

          {mode === 'explore' && (
            <>
              <div style={{ fontSize: 12, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Element</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: '#22d3ee', marginBottom: 2 }}>{symbol}</div>
              <div style={{ fontSize: 16, color: '#cbd5e1', marginBottom: 14 }}>{ELEMENT_NAMES[symbol]}</div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                {SYMBOLS.map(s => (
                  <button key={s} onClick={() => setSymbol(s)}
                    style={{ padding: '5px 9px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: s === symbol ? 'rgba(34,211,238,0.15)' : 'transparent', color: s === symbol ? '#22d3ee' : '#849495', fontSize: 14, cursor: 'pointer', fontFamily: 'monospace' }}>
                    {s}
                  </button>
                ))}
              </div>

              <div style={{ fontSize: 12, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Isotopes</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 18 }}>
                {isotopes.map((iso, i) => (
                  <div key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                    style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5, fontFamily: 'monospace', padding: '5px 9px', borderRadius: 6, background: hovered === i ? 'rgba(255,255,255,0.06)' : 'transparent', color: PEAK_COLORS[i % PEAK_COLORS.length] }}>
                    <span>{symbol}-{Math.round(iso.mass)}</span>
                    <span>{iso.abundance}%</span>
                  </div>
                ))}
              </div>

              <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 12, color: '#849495', marginBottom: 8 }}>Weighted average atomic mass</div>
                <div style={{ fontSize: 13.5, fontFamily: 'monospace', color: '#67e8f9', lineHeight: 1.9 }}>
                  {isotopes.map((iso, i) => (
                    <div key={i}>{iso.mass.toFixed(3)} × {(iso.abundance / 100).toFixed(4)}{i < isotopes.length - 1 ? ' +' : ''}</div>
                  ))}
                  <div style={{ fontWeight: 800, color: '#22d3ee', fontSize: 17, marginTop: 6 }}>= {avgMass.toFixed(3)} amu</div>
                </div>
              </div>
            </>
          )}

          {mode === 'calculate' && (
            <>
              <div style={{ fontSize: 15, color: '#849495', lineHeight: 1.6, marginBottom: 16 }}>
                A mystery element's spectrum is plotted. Compute its weighted average atomic mass from the peaks and enter it below.
              </div>
              <input
                value={answer}
                onChange={e => { setAnswer(e.target.value); setChecked(null) }}
                onKeyDown={e => e.key === 'Enter' && checkAnswer()}
                placeholder="Average mass (amu)"
                type="number" step="0.001"
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, color: '#f8fafc', fontSize: 16, padding: '10px 12px', marginBottom: 10 }}
              />
              <button onClick={checkAnswer} style={{ width: '100%', padding: '9px 0', borderRadius: 8, border: '1px solid rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.12)', color: '#a78bfa', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 10 }}>
                Check answer
              </button>
              {checked === 'correct' && (
                <div style={{ padding: '11px 13px', borderRadius: 8, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#86efac', fontSize: 15, marginBottom: 10 }}>
                  ✓ Correct — {challengeSymbol} ({ELEMENT_NAMES[challengeSymbol]}) averages {challengeAvg.toFixed(3)} amu.
                </div>
              )}
              {checked === 'wrong' && (
                <div style={{ padding: '11px 13px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: 15, marginBottom: 10 }}>
                  ✗ Not quite. Multiply each peak's mass by its abundance fraction (%/100), then sum.
                </div>
              )}
              <button onClick={newChallenge} style={{ width: '100%', padding: '8px 0', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#849495', fontSize: 14, cursor: 'pointer' }}>
                New mystery spectrum
              </button>
            </>
          )}

          <div style={{ marginTop: 26, fontSize: 12, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>How to read it</div>
          <div style={{ fontSize: 14, color: '#849495', lineHeight: 1.9 }}>
            <div><strong style={{ color: '#cbd5e1' }}>Position:</strong> isotope mass (amu).</div>
            <div><strong style={{ color: '#cbd5e1' }}>Height:</strong> relative natural abundance (%).</div>
            <div><strong style={{ color: '#cbd5e1' }}>Weighted average</strong> of all peaks = the periodic table's atomic mass.</div>
          </div>
        </div>

        {/* Main: spectrum chart */}
        <div style={{ flex: 1, overflow: 'auto', padding: 26, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {mode === 'explore' && (
            <div style={{ marginBottom: 14, fontSize: 16, color: '#849495' }}>
              Mass spectrum of <strong style={{ color: '#f8fafc' }}>{ELEMENT_NAMES[symbol]}</strong> — {isotopes.length} stable isotope{isotopes.length > 1 ? 's' : ''}
            </div>
          )}
          {mode === 'calculate' && (
            <div style={{ marginBottom: 14, fontSize: 16, color: '#849495' }}>
              Mystery element — {challengeIsotopes.length} peaks shown
            </div>
          )}

          <svg viewBox={`0 0 940 330`} width="100%" style={{ maxWidth: 940 }}>
            <line x1={PLOT_X0} y1={PLOT_Y1} x2={PLOT_X1} y2={PLOT_Y1} stroke="#3a4060" strokeWidth={1.5} />
            <line x1={PLOT_X0} y1={PLOT_Y0 - 10} x2={PLOT_X0} y2={PLOT_Y1} stroke="#3a4060" strokeWidth={1.5} />
            <text x={(PLOT_X0 + PLOT_X1) / 2} y={320} fill="#849495" fontSize={14} textAnchor="middle">Mass (amu)</text>
            <text x={24} y={(PLOT_Y0 + PLOT_Y1) / 2} fill="#849495" fontSize={14} textAnchor="middle" transform={`rotate(-90, 24, ${(PLOT_Y0 + PLOT_Y1) / 2})`}>Relative abundance (%)</text>

            {mode === 'explore' && isotopes.map((iso, i) => {
              const cx = xFor(iso.mass)
              const h = (iso.abundance / maxAbundance) * (PLOT_Y1 - PLOT_Y0 - 20)
              const isHovered = hovered === i
              const color = PEAK_COLORS[i % PEAK_COLORS.length]
              return (
                <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ cursor: 'pointer' }}>
                  <path d={peakPath(cx, h, PLOT_X0, PLOT_X1)} fill={color} fillOpacity={isHovered ? 0.85 : 0.55} stroke={color} strokeWidth={isHovered ? 2 : 1.2} />
                  <text x={cx} y={PLOT_Y1 - h - 10} fill={color} fontSize={14} fontWeight={700} textAnchor="middle" fontFamily="monospace">{symbol}-{Math.round(iso.mass)}</text>
                </g>
              )
            })}

            {mode === 'calculate' && challengeIsotopes.map((iso, i) => {
              const cx = cXFor(iso.mass)
              const h = (iso.abundance / challengeMax) * (PLOT_Y1 - PLOT_Y0 - 20)
              const color = PEAK_COLORS[i % PEAK_COLORS.length]
              return (
                <g key={i}>
                  <path d={peakPath(cx, h, PLOT_X0, PLOT_X1)} fill={color} fillOpacity={0.55} stroke={color} strokeWidth={1.2} />
                  <text x={cx} y={PLOT_Y1 - h - 10} fill={color} fontSize={14} fontWeight={700} textAnchor="middle" fontFamily="monospace">{iso.mass.toFixed(2)}, {iso.abundance}%</text>
                </g>
              )
            })}
          </svg>

          {mode === 'explore' && hovered !== null && isotopes[hovered] && (
            <div style={{ marginTop: 10, padding: '11px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 15, fontFamily: 'monospace', color: PEAK_COLORS[hovered % PEAK_COLORS.length] }}>
              {symbol}-{Math.round(isotopes[hovered].mass)}: mass = {isotopes[hovered].mass.toFixed(4)} amu, abundance = {isotopes[hovered].abundance}%
            </div>
          )}

          <div style={{ marginTop: 20, fontSize: 13, color: '#525a72', lineHeight: 1.8, maxWidth: 800, textAlign: 'center' }}>
            Isotope masses and natural abundances are real reference values (cross-checked against a standard NIST-style isotope composition table), not modeled — the weighted average shown here should match the atomic mass on a periodic table.
          </div>
        </div>
      </div>
    </div>
  )
}
