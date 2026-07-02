'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { SUBSHELLS } from '../electron-config/subshells'
import { ELEMENTS, ELEMENT_SYMBOLS } from '@/lib/elements'

// ── PES Spectrum Reader ──────────────────────────────────────────────────
// Photoelectron spectroscopy: peak position = binding energy of a subshell
// (core electrons bind tightest → highest BE, plotted on the LEFT per AP
// convention), peak height = relative number of electrons in that subshell.
//
// Binding energies here are MODELED, not looked up from an experimental
// table: Z_eff per subshell via Slater's rules, then a Bohr-style
// BE = k * Z_eff^2 / n*^2. The leading constant k was calibrated against two
// confirmed real reference points (O 1s = 52.6 MJ/mol, F 1s = 67.2 MJ/mol —
// both matched a single k to within 1%), so core-level peaks should be
// close to real values. The s-vs-p splitting within the same shell uses a
// small empirical penetration correction (Slater's rules alone predict
// identical Z_eff for ns/np) — that part is illustrative, not calibrated.

type Occ = { n: number; l: 's' | 'p' | 'd' | 'f'; label: string; count: number }

function configFor(z: number): Occ[] {
  let remaining = z
  const out: Occ[] = []
  for (const s of SUBSHELLS) {
    if (remaining <= 0) break
    const capacity = s.orbitals * 2
    const count = Math.min(capacity, remaining)
    out.push({ n: s.n, l: s.l, label: s.label, count })
    remaining -= count
  }
  return out
}

const EFFECTIVE_N: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 3.7, 5: 4.0, 6: 4.2, 7: 4.4 }
// Exaggerated beyond a "realistic" penetration correction so same-shell
// subshells (e.g. 2s vs 2p) render as visibly distinct peaks rather than
// merging — the qualitative s > p > d > f ordering is real, the exact gap
// size here is for legibility, not calibrated.
const L_PENETRATION: Record<string, number> = { s: 1.0, p: 0.78, d: 0.62, f: 0.5 }
const L_RANK: Record<string, number> = { s: 0, p: 1, d: 2, f: 3 }
const K_CONST = 0.887 // calibrated against O 1s & F 1s reference values

function slaterGroupKey(n: number, l: string) {
  return l === 's' || l === 'p' ? `${n}sp` : `${n}${l}`
}

function bindingEnergyMJ(z: number, config: Occ[], targetIdx: number): number {
  const target = config[targetIdx]
  const targetGroup = slaterGroupKey(target.n, target.l)
  let S = 0
  for (let i = 0; i < config.length; i++) {
    const g = config[i]
    const isSelf = i === targetIdx
    const electronsHere = isSelf ? g.count - 1 : g.count
    if (electronsHere <= 0) continue
    const groupKey = slaterGroupKey(g.n, g.l)
    if (groupKey === targetGroup) {
      S += electronsHere * (target.n === 1 ? 0.3 : 0.35)
    } else if (target.l === 's' || target.l === 'p') {
      if (g.n === target.n - 1) S += electronsHere * 0.85
      else if (g.n <= target.n - 2) S += electronsHere * 1.0
    } else {
      // d/f target: every group earlier in (n,l) order shields fully
      const before = g.n < target.n || (g.n === target.n && (g.l === 's' || g.l === 'p'))
      if (before) S += electronsHere * 1.0
    }
  }
  const zEff = z - S
  const nEff = EFFECTIVE_N[target.n] ?? target.n
  return K_CONST * (zEff * zEff) / (nEff * nEff) * L_PENETRATION[target.l]
}

type Peak = { label: string; n: number; l: string; count: number; be: number }

function spectrumFor(z: number): Peak[] {
  const config = configFor(z)
  return config
    .map((occ, idx) => ({ label: occ.label, n: occ.n, l: occ.l, count: occ.count, be: bindingEnergyMJ(z, config, idx) }))
    .sort((a, b) => b.be - a.be)
}

const SHELL_COLORS: Record<number, string> = { 1: '#ef4444', 2: '#f97316', 3: '#eab308', 4: '#22c55e', 5: '#22d3ee', 6: '#a78bfa', 7: '#f472b6' }

const MIN_BE = 0.25
const MAX_BE = 130
const PLOT_X0 = 60
const PLOT_X1 = 860
const PLOT_Y0 = 40
const PLOT_Y1 = 300

function xForBE(be: number) {
  const t = (Math.log(be) - Math.log(MIN_BE)) / (Math.log(MAX_BE) - Math.log(MIN_BE))
  return PLOT_X1 - t * (PLOT_X1 - PLOT_X0) // reversed: high BE on the left
}

function peakPath(cx: number, height: number, width = 9) {
  const pts: string[] = []
  const steps = 24
  for (let i = 0; i <= steps; i++) {
    const dx = (i / steps - 0.5) * width * 3.2
    const y = height * Math.exp(-(dx * dx) / (2 * width * width))
    pts.push(`${cx + dx},${PLOT_Y1 - y}`)
  }
  return `M${PLOT_X0},${PLOT_Y1} L${pts[0]} ` + pts.map(p => `L${p}`).join(' ') + ` L${PLOT_X1},${PLOT_Y1} Z`
}

const QUICK_PICKS = [1, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 19, 20]

type Mode = 'explore' | 'identify'

export default function PESSpectrumReader() {
  const [mode, setMode] = useState<Mode>('explore')
  const [z, setZ] = useState(6)
  const [hovered, setHovered] = useState<number | null>(null)

  // Identify mode state
  const [mysteryZ, setMysteryZ] = useState(7)
  const [guess, setGuess] = useState('')
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)

  const element = ELEMENTS[z - 1]
  const peaks = useMemo(() => spectrumFor(z), [z])
  const maxCount = Math.max(...peaks.map(p => p.count))

  const mysteryElement = ELEMENTS[mysteryZ - 1]
  const mysteryPeaks = useMemo(() => spectrumFor(mysteryZ), [mysteryZ])
  const mysteryMaxCount = Math.max(...mysteryPeaks.map(p => p.count))

  function newMystery() {
    const newZ = QUICK_PICKS[Math.floor(Math.random() * QUICK_PICKS.length)]
    setMysteryZ(newZ)
    setGuess('')
    setResult(null)
  }

  function submitGuess() {
    const guessZ = ELEMENT_SYMBOLS.findIndex(s => s.toLowerCase() === guess.trim().toLowerCase()) + 1
    if (guessZ === mysteryZ) setResult('correct')
    else setResult('wrong')
  }

  const activePeaks = mode === 'explore' ? peaks : mysteryPeaks
  const activeMax = mode === 'explore' ? maxCount : mysteryMaxCount

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 46, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#849495', textDecoration: 'none', fontSize: 16 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 18 }}>PES Spectrum Reader</strong>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: controls */}
        <div style={{ width: 280, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 20, overflowY: 'auto' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
            <button onClick={() => setMode('explore')} style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: `1px solid ${mode === 'explore' ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.1)'}`, background: mode === 'explore' ? 'rgba(34,211,238,0.12)' : 'transparent', color: mode === 'explore' ? '#22d3ee' : '#849495', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Explore</button>
            <button onClick={() => { setMode('identify'); newMystery() }} style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: `1px solid ${mode === 'identify' ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.1)'}`, background: mode === 'identify' ? 'rgba(167,139,250,0.12)' : 'transparent', color: mode === 'identify' ? '#a78bfa' : '#849495', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Identify</button>
          </div>

          {mode === 'explore' && (
            <>
              <div style={{ fontSize: 12, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Element</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <button onClick={() => setZ(Math.max(1, z - 1))} style={stepBtn}>−</button>
                <input type="number" min={1} max={36} value={z}
                  onChange={e => setZ(Math.min(36, Math.max(1, Number(e.target.value) || 1)))}
                  style={{ width: 56, textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, color: '#f8fafc', fontFamily: 'monospace', fontSize: 16, padding: '6px 0' }} />
                <button onClick={() => setZ(Math.min(36, z + 1))} style={stepBtn}>+</button>
              </div>
              <div style={{ fontSize: 30, fontWeight: 900, color: '#22d3ee' }}>{element.sym} <span style={{ fontSize: 17, color: '#849495', fontWeight: 400 }}>Z={element.z}</span></div>
              <div style={{ fontSize: 16, color: '#cbd5e1', marginBottom: 14 }}>{element.name}</div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
                {QUICK_PICKS.map(qz => (
                  <button key={qz} onClick={() => setZ(qz)}
                    style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: qz === z ? 'rgba(34,211,238,0.15)' : 'transparent', color: qz === z ? '#22d3ee' : '#849495', fontSize: 14, cursor: 'pointer', fontFamily: 'monospace' }}>
                    {ELEMENT_SYMBOLS[qz - 1]}
                  </button>
                ))}
              </div>

              <div style={{ fontSize: 12, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Peaks (high → low binding energy)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {peaks.map((p, i) => (
                  <div key={p.label + i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                    style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5, fontFamily: 'monospace', padding: '5px 8px', borderRadius: 6, background: hovered === i ? 'rgba(255,255,255,0.06)' : 'transparent', color: SHELL_COLORS[p.n] }}>
                    <span>{p.label} ({p.count}e⁻)</span>
                    <span>{p.be.toFixed(2)} MJ/mol</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {mode === 'identify' && (
            <>
              <div style={{ fontSize: 15, color: '#849495', lineHeight: 1.6, marginBottom: 14 }}>
                A mystery element's spectrum is plotted, unlabeled. Use peak count, spacing, and relative heights to identify it.
              </div>
              <input
                value={guess}
                onChange={e => { setGuess(e.target.value); setResult(null) }}
                onKeyDown={e => e.key === 'Enter' && submitGuess()}
                placeholder="Element symbol (e.g. N)"
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, color: '#f8fafc', fontSize: 16, padding: '10px 12px', marginBottom: 10 }}
              />
              <button onClick={submitGuess} style={{ width: '100%', padding: '8px 0', borderRadius: 8, border: '1px solid rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.12)', color: '#a78bfa', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 10 }}>
                Check answer
              </button>
              {result === 'correct' && (
                <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#86efac', fontSize: 15, marginBottom: 10 }}>
                  ✓ Correct — it's {mysteryElement.sym} ({mysteryElement.name}), Z={mysteryZ}.
                </div>
              )}
              {result === 'wrong' && (
                <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: 15, marginBottom: 10 }}>
                  ✗ Not quite — try counting total electrons (sum of peak heights) and check the highest-BE peak count for the innermost shell.
                </div>
              )}
              <button onClick={newMystery} style={{ width: '100%', padding: '7px 0', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#849495', fontSize: 14, cursor: 'pointer' }}>
                New mystery element
              </button>
            </>
          )}

          <div style={{ marginTop: 24, fontSize: 12, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>How to read it</div>
          <div style={{ fontSize: 14, color: '#849495', lineHeight: 1.9 }}>
            <div><strong style={{ color: '#cbd5e1' }}>Position:</strong> binding energy — core e⁻ (high BE) on the left, valence e⁻ (low BE) on the right.</div>
            <div><strong style={{ color: '#cbd5e1' }}>Height:</strong> relative number of electrons in that subshell.</div>
            <div><strong style={{ color: '#cbd5e1' }}>Total area:</strong> sums to the atomic number Z.</div>
          </div>
        </div>

        {/* Main: spectrum chart */}
        <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {mode === 'explore' && (
            <div style={{ marginBottom: 12, fontSize: 16, color: '#849495' }}>
              Spectrum for <strong style={{ color: '#f8fafc' }}>{element.name}</strong> — electron configuration: <span style={{ fontFamily: 'monospace', color: '#22d3ee' }}>{peaks.slice().sort((a, b) => a.n - b.n || L_RANK[a.l] - L_RANK[b.l]).map(p => `${p.label}${sup(p.count)}`).join(' ')}</span>
            </div>
          )}
          {mode === 'identify' && (
            <div style={{ marginBottom: 12, fontSize: 16, color: '#849495' }}>
              Mystery spectrum — total electrons (peak area sum) = <strong style={{ color: '#f8fafc' }}>{mysteryZ}</strong>
            </div>
          )}

          <svg viewBox={`0 0 920 340`} width="100%" style={{ maxWidth: 920 }}>
            {/* axis */}
            <line x1={PLOT_X0} y1={PLOT_Y1} x2={PLOT_X1} y2={PLOT_Y1} stroke="#3a4060" strokeWidth={1.5} />
            <line x1={PLOT_X0} y1={PLOT_Y0 - 10} x2={PLOT_X0} y2={PLOT_Y1} stroke="#3a4060" strokeWidth={1.5} />
            <text x={(PLOT_X0 + PLOT_X1) / 2} y={326} fill="#849495" fontSize={14} textAnchor="middle">Binding energy (MJ/mol) — high ←→ low</text>
            <text x={20} y={(PLOT_Y0 + PLOT_Y1) / 2} fill="#849495" fontSize={14} textAnchor="middle" transform={`rotate(-90, 20, ${(PLOT_Y0 + PLOT_Y1) / 2})`}>Relative e⁻ count</text>

            {activePeaks.map((p, i) => {
              const cx = xForBE(p.be)
              const h = (p.count / activeMax) * (PLOT_Y1 - PLOT_Y0 - 20)
              const isHovered = mode === 'explore' && hovered === i
              const color = SHELL_COLORS[p.n] ?? '#94a3b8'
              return (
                <g key={p.label + i}
                  onMouseEnter={() => mode === 'explore' && setHovered(i)}
                  onMouseLeave={() => mode === 'explore' && setHovered(null)}
                  style={{ cursor: mode === 'explore' ? 'pointer' : 'default' }}>
                  <path d={peakPath(cx, h)} fill={color} fillOpacity={isHovered ? 0.85 : 0.55} stroke={color} strokeWidth={isHovered ? 2 : 1.2} />
                  {mode === 'explore' && (
                    <text x={cx} y={PLOT_Y1 - h - 8} fill={color} fontSize={15} fontWeight={700} textAnchor="middle" fontFamily="monospace">{p.label}</text>
                  )}
                </g>
              )
            })}
          </svg>

          {mode === 'explore' && hovered !== null && peaks[hovered] && (
            <div style={{ marginTop: 8, padding: '10px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 15, fontFamily: 'monospace', color: SHELL_COLORS[peaks[hovered].n] }}>
              {peaks[hovered].label}: {peaks[hovered].count} electrons, binding energy ≈ {peaks[hovered].be.toFixed(2)} MJ/mol
            </div>
          )}

          <div style={{ marginTop: 18, fontSize: 13, color: '#525a72', lineHeight: 1.8, maxWidth: 800, textAlign: 'center' }}>
            Binding energies are modeled (Slater's-rules effective nuclear charge + Bohr-style scaling), calibrated against real O 1s / F 1s reference values — illustrative for teaching peak patterns, not a substitute for an experimental ESCA table.
          </div>
        </div>
      </div>
    </div>
  )
}

const SUP_DIGITS: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }
const sup = (n: number) => String(n).split('').map(d => SUP_DIGITS[d]).join('')

const stepBtn: React.CSSProperties = {
  width: 32, height: 32, borderRadius: 7, border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.04)', color: '#cbd5e1', fontSize: 16, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
