'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'

// ── Hydrogen Emission Spectrum ──────────────────────────────────────────
// Click a higher energy level then a lower one (or vice versa) to select an
// electron transition. We compute the emitted photon's energy/wavelength via
// the Rydberg formula and show where it falls in the EM spectrum.

const RYDBERG_EV = 13.6 // eV, Rydberg energy for hydrogen
const HC_EV_NM = 1239.84 // eV·nm, hc in convenient units

const LEVELS = [1, 2, 3, 4, 5, 6]

const SERIES = [
  { nLow: 1, name: 'Lyman', region: 'Ultraviolet', color: '#a855f7' },
  { nLow: 2, name: 'Balmer', region: 'Visible', color: '#22c55e' },
  { nLow: 3, name: 'Paschen', region: 'Infrared', color: '#ef4444' },
  { nLow: 4, name: 'Brackett', region: 'Infrared', color: '#f97316' },
  { nLow: 5, name: 'Pfund', region: 'Infrared', color: '#fbbf24' },
]

const BALMER_PRESETS = [
  { label: 'Hα', nHigh: 3, nLow: 2 },
  { label: 'Hβ', nHigh: 4, nLow: 2 },
  { label: 'Hγ', nHigh: 5, nLow: 2 },
  { label: 'Hδ', nHigh: 6, nLow: 2 },
]

function energyOf(n: number) {
  return -RYDBERG_EV / (n * n)
}

// Public-domain-style wavelength(nm) → approximate sRGB, for the visible range.
function wavelengthToColor(nm: number): string {
  if (nm < 380 || nm > 750) return '#3a4060'
  let r = 0, g = 0, b = 0
  if (nm < 440) { r = -(nm - 440) / (440 - 380); b = 1 }
  else if (nm < 490) { g = (nm - 440) / (490 - 440); b = 1 }
  else if (nm < 510) { g = 1; b = -(nm - 510) / (510 - 490) }
  else if (nm < 580) { r = (nm - 510) / (580 - 510); g = 1 }
  else if (nm < 645) { r = 1; g = -(nm - 645) / (645 - 580) }
  else { r = 1 }
  let factor = 1
  if (nm < 420) factor = 0.3 + 0.7 * (nm - 380) / (420 - 380)
  else if (nm > 700) factor = 0.3 + 0.7 * (750 - nm) / (750 - 700)
  const f = (c: number) => Math.round(255 * Math.pow(c * factor, 0.8))
  return `rgb(${f(r)},${f(g)},${f(b)})`
}

// Vertical position for a level on the diagram — log-compressed so n=1..6
// don't crowd into the top few pixels (levels really do bunch up near n=∞).
function levelY(n: number, height: number) {
  const e1 = energyOf(1), e6 = energyOf(6)
  const t = (energyOf(n) - e1) / (e6 - e1) // 0 at n=1, ~1 near n=6
  return height - 30 - t * (height - 60)
}

export default function HEmissionSpectrum() {
  const [nHigh, setNHigh] = useState<number | null>(4)
  const [nLow, setNLow] = useState<number | null>(2)
  const W = 360, H = 420

  const pick = (n: number) => {
    if (nHigh === null) { setNHigh(n); return }
    if (nLow === null) {
      if (n === nHigh) return
      setNLow(Math.min(n, nHigh)); setNHigh(Math.max(n, nHigh))
      return
    }
    // both already set — start a fresh selection
    setNHigh(n); setNLow(null)
  }

  const reset = () => { setNHigh(null); setNLow(null) }

  const result = useMemo(() => {
    if (nHigh === null || nLow === null || nHigh === nLow) return null
    const dE = energyOf(nLow) - energyOf(nHigh) // positive, energy released
    const lambdaNm = HC_EV_NM / dE
    const freqHz = (dE * 1.602e-19) / 6.626e-34
    const series = SERIES.find(s => s.nLow === nLow) ?? null
    const visible = lambdaNm >= 380 && lambdaNm <= 750
    return { dE, lambdaNm, freqHz, series, visible }
  }, [nHigh, nLow])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 46, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#849495', textDecoration: 'none', fontSize: 15 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 16 }}>Hydrogen Emission Spectrum</strong>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Energy level diagram */}
        <div style={{ width: W + 40, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 20, overflowY: 'auto' }}>
          <div style={{ fontSize: 13, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            Click two energy levels (n)
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
            {LEVELS.map(n => {
              const y = levelY(n, H)
              const isHigh = n === nHigh, isLow = n === nLow
              const active = isHigh || isLow
              return (
                <g key={n} onClick={() => pick(n)} style={{ cursor: 'pointer' }}>
                  <line x1={50} y1={y} x2={W - 30} y2={y} stroke={active ? (isHigh ? '#fbbf24' : '#22c55e') : '#3a4060'} strokeWidth={active ? 2.5 : 1.5} />
                  <rect x={20} y={y - 18} width={300} height={36} fill="transparent" />
                  <text x={30} y={y + 4} fill={active ? '#f8fafc' : '#849495'} fontSize={15} fontFamily="monospace" fontWeight={active ? 800 as const : 400 as const}>n={n}</text>
                  <text x={W - 26} y={y + 4} fill="#525a72" fontSize={13} fontFamily="monospace">{energyOf(n).toFixed(2)} eV</text>
                </g>
              )
            })}
            {/* n = ∞ reference line */}
            <line x1={50} y1={levelY(6, H) - 14} x2={W - 30} y2={levelY(6, H) - 14} stroke="#3a4060" strokeWidth={1} strokeDasharray="2,3" />
            <text x={30} y={levelY(6, H) - 18} fill="#525a72" fontSize={13} fontFamily="monospace">n=∞, 0 eV</text>

            {/* transition arrow */}
            {nHigh !== null && nLow !== null && nHigh !== nLow && (
              <g>
                <defs>
                  <marker id="dropArrow" markerWidth={8} markerHeight={8} refX={4} refY={4} orient="auto">
                    <path d="M0,0 L8,4 L0,8 Z" fill={result?.series?.color ?? '#f8fafc'} />
                  </marker>
                </defs>
                <line x1={W - 90} y1={levelY(nHigh, H)} x2={W - 90} y2={levelY(nLow, H)}
                  stroke={result?.series?.color ?? '#f8fafc'} strokeWidth={2.5} markerEnd="url(#dropArrow)" />
              </g>
            )}
          </svg>
          <button onClick={reset} style={{ marginTop: 8, padding: '5px 12px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#849495', fontSize: 14, cursor: 'pointer' }}>
            Reset selection
          </button>

          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 13, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Balmer series presets</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {BALMER_PRESETS.map(p => (
                <button key={p.label} onClick={() => { setNHigh(p.nHigh); setNLow(p.nLow) }}
                  style={{ padding: '5px 10px', borderRadius: 7, border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.08)', color: '#22c55e', fontSize: 14, cursor: 'pointer', fontFamily: 'monospace' }}>
                  {p.label} ({p.nHigh}→{p.nLow})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result panel */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!result && (
            <div style={{ color: '#525a72', fontSize: 15, textAlign: 'center', paddingTop: 60 }}>
              Click a level for the electron to start at (higher n), then the level it falls to (lower n).
            </div>
          )}
          {result && (
            <>
              <div style={{ background: `${result.series?.color ?? '#525a72'}10`, border: `1px solid ${result.series?.color ?? '#525a72'}35`, borderRadius: 14, padding: '16px 20px' }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: result.series?.color ?? '#f8fafc', marginBottom: 4 }}>
                  n={nHigh} → n={nLow}
                </div>
                <div style={{ fontSize: 15, color: '#849495' }}>
                  {result.series ? `${result.series.name} series — ${result.series.region}` : 'Transition'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Photon energy', val: `${result.dE.toFixed(3)} eV`, color: '#06b6d4' },
                  { label: 'Wavelength', val: `${result.lambdaNm.toFixed(1)} nm`, color: '#a78bfa' },
                  { label: 'Frequency', val: `${result.freqHz.toExponential(3)} Hz`, color: '#22c55e' },
                  { label: 'Visible to eye?', val: result.visible ? 'Yes' : 'No (' + (result.lambdaNm < 380 ? 'UV' : 'IR') + ')', color: result.visible ? '#22c55e' : '#fbbf24' },
                ].map(x => (
                  <div key={x.label} style={{ background: 'rgba(9,14,28,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 14px' }}>
                    <div style={{ fontSize: 13, color: '#849495', marginBottom: 3 }}>{x.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'monospace', color: x.color }}>{x.val}</div>
                  </div>
                ))}
              </div>

              {/* Spectral line viewer */}
              <div>
                <div style={{ fontSize: 13, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                  Visible spectrum (380–750 nm)
                </div>
                <div style={{ position: 'relative', height: 44, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #8b00ff, #4b0082, #0000ff, #00ff00, #ffff00, #ff7f00, #ff0000)' }} />
                  {result.visible && (
                    <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${((result.lambdaNm - 380) / (750 - 380)) * 100}%`, width: 3, background: '#fff', boxShadow: '0 0 8px #fff' }} />
                  )}
                </div>
                {result.visible && (
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: wavelengthToColor(result.lambdaNm), boxShadow: `0 0 10px ${wavelengthToColor(result.lambdaNm)}` }} />
                    <span style={{ fontSize: 14, color: '#849495' }}>Approximate emitted color</span>
                  </div>
                )}
                {!result.visible && (
                  <div style={{ marginTop: 8, fontSize: 14, color: '#fbbf24' }}>
                    Outside the visible range — {result.lambdaNm < 380 ? 'this photon is ultraviolet, invisible to the human eye' : 'this photon is infrared, invisible to the human eye'}.
                  </div>
                )}
              </div>

              <div style={{ fontSize: 14, color: '#525a72', lineHeight: 1.7, background: 'rgba(255,255,255,0.02)', borderRadius: 10, padding: '10px 14px' }}>
                Rydberg formula: 1/λ = R<sub>H</sub>(1/n<sub>low</sub>² − 1/n<sub>high</sub>²), with R<sub>H</sub> = 13.6 eV (1.097×10⁷ m⁻¹).
                The electron drops from n={nHigh} to n={nLow}, releasing the energy difference as a single photon.
              </div>
            </>
          )}

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 13, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Series reference</div>
            {SERIES.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#849495' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                <span style={{ color: '#cbd5e1', fontWeight: 700 }}>{s.name}</span>
                <span>n→{s.nLow} · {s.region}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
