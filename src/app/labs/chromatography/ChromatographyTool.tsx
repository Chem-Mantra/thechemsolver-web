'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

// ── Chromatography Simulator ─────────────────────────────────────────────
// Paper chromatography: a mixed spot at the baseline separates as solvent
// climbs the strip, because each component has different affinity for the
// stationary phase (paper) vs the mobile phase (solvent). Rf = distance
// traveled by spot / distance traveled by solvent front — and stays
// constant throughout the run, which the live readout demonstrates.
//
// Rf values here are illustrative (real Rf depends on the exact solvent
// system used), but the RELATIVE ordering for the leaf-pigment mixture is
// the well-established real result: carotene runs fastest, then
// chlorophyll a, then chlorophyll b, then xanthophyll slowest.

type Component = { name: string; color: string; rf: number }
type Mixture = { name: string; components: Component[] }

const MIXTURES: Mixture[] = [
  { name: 'Black ink', components: [
    { name: 'Yellow dye', color: '#facc15', rf: 0.85 },
    { name: 'Red dye', color: '#ef4444', rf: 0.62 },
    { name: 'Blue dye', color: '#3b82f6', rf: 0.32 },
  ]},
  { name: 'Spinach leaf extract', components: [
    { name: 'Carotene', color: '#f97316', rf: 0.95 },
    { name: 'Chlorophyll a', color: '#15803d', rf: 0.65 },
    { name: 'Chlorophyll b', color: '#4ade80', rf: 0.45 },
    { name: 'Xanthophyll', color: '#eab308', rf: 0.22 },
  ]},
  { name: 'Food dye mix', components: [
    { name: 'Yellow #5', color: '#fde047', rf: 0.80 },
    { name: 'Red #40', color: '#dc2626', rf: 0.55 },
    { name: 'Blue #1', color: '#2563eb', rf: 0.28 },
  ]},
]

const STRIP_TOP = 30
const STRIP_BOTTOM = 330
const STRIP_LEN = STRIP_BOTTOM - STRIP_TOP

export default function ChromatographySimulator() {
  const [mixIdx, setMixIdx] = useState(0)
  const mix = MIXTURES[mixIdx]
  const [front, setFront] = useState(0) // 0..1, fraction of strip the solvent has climbed
  const [running, setRunning] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    setFront(0); setRunning(false); setRevealed(false)
  }, [mixIdx])

  useEffect(() => {
    if (!running) return
    let last = performance.now()
    function tick(now: number) {
      const dt = (now - last) / 1000
      last = now
      setFront(f => {
        const next = f + dt * 0.12
        if (next >= 1) { setRunning(false); return 1 }
        return next
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [running])

  const frontY = STRIP_BOTTOM - front * STRIP_LEN

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 52, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#a6b0b1', textDecoration: 'none', fontSize: 16 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 19 }}>Chromatography Simulator</strong>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: controls */}
        <div style={{ width: 340, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 24, overflowY: 'auto' }}>
          <div style={{ fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Mixture</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
            {MIXTURES.map((m, i) => (
              <button key={m.name} onClick={() => setMixIdx(i)}
                style={{ padding: '9px 12px', borderRadius: 8, border: `1px solid ${i === mixIdx ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.1)'}`, background: i === mixIdx ? 'rgba(34,211,238,0.12)' : 'transparent', color: i === mixIdx ? '#22d3ee' : '#a6b0b1', fontSize: 16, cursor: 'pointer', textAlign: 'left' }}>
                {m.name}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <button onClick={() => setRunning(r => !r)} disabled={front >= 1}
              style={{ flex: 1, padding: '11px 0', borderRadius: 9, border: '1px solid rgba(34,211,238,0.4)', background: front >= 1 ? 'rgba(255,255,255,0.03)' : 'rgba(34,211,238,0.12)', color: front >= 1 ? '#525a72' : '#22d3ee', fontSize: 16, fontWeight: 700, cursor: front >= 1 ? 'not-allowed' : 'pointer' }}>
              {running ? '⏸ Pause' : '▶ Run solvent'}
            </button>
            <button onClick={() => { setFront(0); setRunning(false); setRevealed(false) }}
              style={{ padding: '11px 16px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#a6b0b1', fontSize: 16, cursor: 'pointer' }}>
              Reset
            </button>
          </div>

          <div style={{ fontSize: 15, color: '#a6b0b1', marginBottom: 8 }}>Solvent front position: <strong style={{ color: '#f8fafc', fontFamily: 'monospace' }}>{(front * 100).toFixed(0)}%</strong></div>
          <input type="range" min={0} max={1} step={0.01} value={front} onChange={e => { setFront(Number(e.target.value)); setRunning(false) }}
            style={{ width: '100%', marginBottom: 20 }} />

          <button onClick={() => setRevealed(r => !r)} style={{ width: '100%', padding: '9px 0', borderRadius: 8, border: '1px solid rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.12)', color: '#a78bfa', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 18 }}>
            {revealed ? 'Hide identities' : '🔍 Reveal identities'}
          </button>

          <div style={{ fontSize: 15, color: '#a6b0b1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Rf = spot distance / front distance</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {mix.components.map(c => {
              const liveRf = front > 0.001 ? c.rf : 0
              return (
                <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 15, padding: '6px 10px', borderRadius: 7, background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: c.color }} />
                    <span style={{ color: revealed ? '#cbd5e1' : '#525a72' }}>{revealed ? c.name : '???'}</span>
                  </div>
                  <span style={{ fontFamily: 'monospace', color: '#67e8f9' }}>{front > 0.001 ? liveRf.toFixed(2) : '—'}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Main: strip */}
        <div style={{ flex: 1, overflow: 'auto', padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg viewBox="0 0 200 380" width={220} height={418}>
            {/* solvent reservoir */}
            <rect x={20} y={345} width={160} height={25} fill="#1e293b" stroke="#475569" strokeWidth={1.5} rx={3} />
            <text x={100} y={362} textAnchor="middle" fontSize={15} fill="#94a3b8">solvent</text>

            {/* paper strip */}
            <rect x={70} y={STRIP_TOP} width={60} height={STRIP_BOTTOM - STRIP_TOP + 20} fill="#f5f0e6" stroke="#cbd5e1" strokeWidth={1.5} />

            {/* solvent-soaked region (below front) */}
            <rect x={70} y={frontY} width={60} height={STRIP_BOTTOM + 20 - frontY} fill="#bae6fd" opacity={0.35} />

            {/* solvent front line */}
            {front > 0.001 && <line x1={68} y1={frontY} x2={132} y2={frontY} stroke="#0ea5e9" strokeWidth={2} strokeDasharray="3,3" />}

            {/* baseline */}
            <line x1={68} y1={STRIP_BOTTOM} x2={132} y2={STRIP_BOTTOM} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2,2" />

            {/* component spots */}
            {mix.components.map((c, i) => {
              const spotY = STRIP_BOTTOM - front * c.rf * STRIP_LEN
              const spread = front < 0.03 ? 0 : (i - (mix.components.length - 1) / 2) * 4
              return (
                <circle key={c.name} cx={100 + spread * Math.min(1, front * 3)} cy={spotY} r={front < 0.03 ? 7 : 6} fill={c.color} opacity={0.85} stroke="#00000022" />
              )
            })}
          </svg>

          <div style={{ marginTop: 10, fontSize: 15, color: '#7c8590', lineHeight: 1.8, maxWidth: 480, textAlign: 'center' }}>
            More polar components cling to the paper (stationary phase) and travel less — lower Rf. Less polar components dissolve more readily in the solvent (mobile phase) and travel farther — higher Rf. Rf stays the same no matter how far the solvent climbs.
          </div>
        </div>
      </div>
    </div>
  )
}
