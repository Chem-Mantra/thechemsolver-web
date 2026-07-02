'use client'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { SUBSHELLS, sumArr, initFilled } from './subshells'
import { ELEMENTS, ELEMENT_SYMBOLS } from '@/lib/elements'

const AtomicModel3D = dynamic(() => import('./components/AtomicModel3D'), { ssr: false })
const BohrModel = dynamic(() => import('./components/BohrModel'), { ssr: false })

// ── Electron Configuration Builder ──────────────────────────────────────
// Click (or drag an electron onto) subshell boxes to fill them. Every
// placement is validated against Aufbau (energy order), Pauli (max 2 per
// orbital, opposite spin), and Hund's rule (singly-fill degenerate orbitals
// before pairing) — with inline feedback explaining any rejection.

const QUICK_PICKS = [1,2,6,7,8,9,10,11,12,17,18,19,20,24,26,29,30,35,36,47,53,54,79]

const NOBLE_GASES = [
  { z: 2, sym: 'He', boundaryIdx: 0 },
  { z: 10, sym: 'Ne', boundaryIdx: 2 },
  { z: 18, sym: 'Ar', boundaryIdx: 4 },
  { z: 36, sym: 'Kr', boundaryIdx: 7 },
  { z: 54, sym: 'Xe', boundaryIdx: 10 },
  { z: 86, sym: 'Rn', boundaryIdx: 14 },
]

// Well-known Aufbau exceptions (extra stability of half-filled / filled d subshells).
const EXCEPTIONS: Record<number, string> = {
  24: 'Cr is an exception: actual ground state is [Ar] 3d⁵4s¹ (not 3d⁴4s²) — a half-filled d subshell is extra stable.',
  29: 'Cu is an exception: actual ground state is [Ar] 3d¹⁰4s¹ (not 3d⁹4s²) — a fully-filled d subshell is extra stable.',
  41: 'Nb is an exception: actual ground state is [Kr] 4d⁴5s¹ (not 4d³5s²).',
  42: 'Mo is an exception: actual ground state is [Kr] 4d⁵5s¹ (not 4d⁴5s²) — half-filled d subshell.',
  44: 'Ru is an exception: actual ground state is [Kr] 4d⁷5s¹ (not 4d⁶5s²).',
  45: 'Rh is an exception: actual ground state is [Kr] 4d⁸5s¹ (not 4d⁷5s²).',
  46: 'Pd is an exception: actual ground state is [Kr] 4d¹⁰5s⁰ (not 4d⁸5s²) — fully-filled d subshell.',
  47: 'Ag is an exception: actual ground state is [Kr] 4d¹⁰5s¹ (not 4d⁹5s²) — fully-filled d subshell.',
  78: 'Pt is an exception: actual ground state is [Xe] 4f¹⁴5d⁹6s¹ (not 5d⁸6s²).',
  79: 'Au is an exception: actual ground state is [Xe] 4f¹⁴5d¹⁰6s¹ (not 5d⁹6s²) — fully-filled d subshell.',
}

const SUP: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }
const sup = (n: number) => String(n).split('').map(d => SUP[d]).join('')

const L_VALUE: Record<string, number> = { s: 0, p: 1, d: 2, f: 3 }
// Standard convention: orbitals singly-fill in ml = -l..+l order (spin +½), then pair in the same order (spin -½).
function kthElectronQN(n: number, lLetter: string, orbitals: number, k: number) {
  const l = L_VALUE[lLetter]
  if (k <= orbitals) return { n, l, ml: -l + (k - 1), ms: '+½' }
  return { n, l, ml: -l + (k - orbitals - 1), ms: '−½' }
}
const fmtMl = (v: number) => (v > 0 ? `+${v}` : `${v}`)

type Feedback = { kind: 'success' | 'error' | 'info'; text: string } | null

export default function ElectronConfigBuilder() {
  const [z, setZ] = useState(6)
  const [filled, setFilled] = useState<Record<string, number[]>>(initFilled)
  const [feedback, setFeedback] = useState<Feedback>(null)

  useEffect(() => { setFilled(initFilled()); setFeedback(null) }, [z])

  const element = ELEMENTS[z - 1]
  const totalPlaced = useMemo(() => sumArr(Object.values(filled).map(sumArr)), [filled])

  const visibleCount = useMemo(() => {
    let cum = 0
    for (let i = 0; i < SUBSHELLS.length; i++) {
      cum += SUBSHELLS[i].orbitals * 2
      if (cum >= z) return Math.min(SUBSHELLS.length, i + 2)
    }
    return SUBSHELLS.length
  }, [z])
  const visibleSubshells = SUBSHELLS.slice(0, visibleCount)

  // Heavier elements need many more subshell rows — shrink the orbital boxes
  // as rows pile up instead of forcing the panel to grow or scroll badly.
  const rowCount = visibleSubshells.length
  const boxSize = rowCount <= 6 ? 34 : rowCount <= 10 ? 28 : rowCount <= 14 ? 23 : 19
  const rowGap = rowCount <= 10 ? 6 : 4
  const rowPadding = rowCount <= 10 ? '8px 12px' : '4px 10px'
  const boxFontSize = boxSize >= 30 ? 17 : boxSize >= 25 ? 14 : 12

  function isSubshellFull(label: string) {
    const s = SUBSHELLS.find(s => s.label === label)!
    return sumArr(filled[label]) === s.orbitals * 2
  }

  function handleAdd(label: string, idx: number) {
    const s = SUBSHELLS.find(s => s.label === label)!
    const count = filled[label][idx]

    if (count >= 2) {
      setFilled({ ...filled, [label]: filled[label].map((c, i) => (i === idx ? c - 1 : c)) })
      setFeedback({ kind: 'info', text: `Removed an electron from ${label}.` })
      return
    }
    if (totalPlaced >= z) {
      setFeedback({ kind: 'error', text: `All ${z} electrons for ${element.name} are already placed. Reset or pick a heavier element.` })
      return
    }
    const sIdx = SUBSHELLS.findIndex(x => x.label === label)
    for (let i = 0; i < sIdx; i++) {
      const prevLabel = SUBSHELLS[i].label
      if (!isSubshellFull(prevLabel)) {
        setFeedback({ kind: 'error', text: `Aufbau violation: fill ${prevLabel} completely (${sumArr(filled[prevLabel])}/${SUBSHELLS[i].orbitals * 2}) before adding to ${label}.` })
        return
      }
    }
    if (count === 1 && s.orbitals > 1) {
      const hasEmptySibling = filled[label].some((c, i) => i !== idx && c === 0)
      if (hasEmptySibling) {
        setFeedback({ kind: 'error', text: `Hund's rule: every ${label} orbital needs one electron before any orbital gets a second, paired electron.` })
        return
      }
    }
    setFilled({ ...filled, [label]: filled[label].map((c, i) => (i === idx ? c + 1 : c)) })
    setFeedback({ kind: 'success', text: `Placed electron #${totalPlaced + 1} in ${label} (${count === 0 ? 'spin ↑' : 'spin ↓'}).` })
  }

  const liveConfig = SUBSHELLS
    .filter(s => sumArr(filled[s.label]) > 0)
    .map(s => `${s.label}${sup(sumArr(filled[s.label]))}`)
    .join(' ')

  const complete = totalPlaced === z
  const unpaired = SUBSHELLS.reduce((acc, s) => acc + filled[s.label].filter(c => c === 1).length, 0)

  const nobleNotation = useMemo(() => {
    if (!complete) return null
    const core = [...NOBLE_GASES].reverse().find(g => g.z < z) ?? null
    if (!core) return liveConfig
    const rest = SUBSHELLS.slice(core.boundaryIdx + 1)
      .filter(s => sumArr(filled[s.label]) > 0)
      .map(s => `${s.label}${sup(sumArr(filled[s.label]))}`)
      .join(' ')
    return `[${core.sym}]${rest ? ' ' + rest : ''}`
  }, [complete, z, filled, liveConfig])

  const muSquared = unpaired * (unpaired + 2)
  const mu = Math.sqrt(muSquared)

  const lastElectron = useMemo(() => {
    if (!complete) return null
    let lastSub: typeof SUBSHELLS[number] | null = null
    for (const s of SUBSHELLS) { if (sumArr(filled[s.label]) > 0) lastSub = s }
    if (!lastSub) return null
    const k = sumArr(filled[lastSub.label])
    return { subshell: lastSub, qn: kthElectronQN(lastSub.n, lastSub.l, lastSub.orbitals, k) }
  }, [complete, filled])

  const valenceElectron = useMemo(() => {
    if (!complete || !lastElectron) return null
    const occupied = SUBSHELLS.filter(s => sumArr(filled[s.label]) > 0)
    const maxN = Math.max(...occupied.map(s => s.n))
    if (lastElectron.subshell.n === maxN) return null
    let valSub: typeof SUBSHELLS[number] | null = null
    for (const s of SUBSHELLS) { if (s.n === maxN && sumArr(filled[s.label]) > 0) valSub = s }
    if (!valSub) return null
    const k = sumArr(filled[valSub.label])
    return { subshell: valSub, qn: kthElectronQN(valSub.n, valSub.l, valSub.orbitals, k) }
  }, [complete, filled, lastElectron])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 46, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#849495', textDecoration: 'none', fontSize: 15 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 16 }}>Electron Configuration Builder</strong>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: element picker + pool + rules */}
        <div style={{ width: 260, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 20, overflowY: 'auto' }}>
          <div style={{ fontSize: 13, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Element</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <button onClick={() => setZ(Math.max(1, z - 1))} style={stepBtn}>−</button>
            <input
              type="number" min={1} max={118} value={z}
              onChange={e => { const v = Math.min(118, Math.max(1, Number(e.target.value) || 1)); setZ(v) }}
              style={{ width: 56, textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, color: '#f8fafc', fontFamily: 'monospace', fontSize: 15, padding: '5px 0' }}
            />
            <button onClick={() => setZ(Math.min(118, z + 1))} style={stepBtn}>+</button>
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#22d3ee' }}>{element.sym} <span style={{ fontSize: 15, color: '#849495', fontWeight: 400 }}>Z={element.z}</span></div>
          <div style={{ fontSize: 15, color: '#cbd5e1', marginBottom: 14 }}>{element.name}</div>

          <select value={z} onChange={e => setZ(Number(e.target.value))} style={{ width: '100%', marginBottom: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, color: '#f8fafc', fontSize: 15, padding: '6px 4px' }}>
            {ELEMENTS.map(e => <option key={e.z} value={e.z}>{e.z} — {e.sym} ({e.name})</option>)}
          </select>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
            {QUICK_PICKS.map(qz => (
              <button key={qz} onClick={() => setZ(qz)}
                style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: qz === z ? 'rgba(34,211,238,0.15)' : 'transparent', color: qz === z ? '#22d3ee' : '#849495', fontSize: 14, cursor: 'pointer', fontFamily: 'monospace' }}>
                {ELEMENT_SYMBOLS[qz - 1]}
              </button>
            ))}
          </div>

          <div
            draggable
            onDragStart={e => e.dataTransfer.setData('text/plain', 'electron')}
            style={{ padding: '8px 12px', borderRadius: 9, border: '1px dashed rgba(34,211,238,0.4)', background: 'rgba(34,211,238,0.06)', color: '#22d3ee', fontSize: 15, textAlign: 'center', cursor: 'grab', marginBottom: 8 }}
          >
            ⚛ drag → next e⁻
          </div>
          <div style={{ fontSize: 15, color: '#849495', marginBottom: 6 }}>Placed: <strong style={{ color: '#f8fafc' }}>{totalPlaced}</strong> / {z}</div>
          <div style={{ height: 6, borderRadius: 4, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 18 }}>
            <div style={{ height: '100%', width: `${(totalPlaced / z) * 100}%`, background: complete ? '#22c55e' : '#22d3ee', transition: 'width 0.2s' }} />
          </div>

          <button onClick={() => { setFilled(initFilled()); setFeedback(null) }} style={{ width: '100%', padding: '7px 0', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#849495', fontSize: 14, cursor: 'pointer', marginBottom: 20 }}>
            Reset {element.sym}
          </button>

          <div style={{ fontSize: 13, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Rules</div>
          <div style={{ fontSize: 14, color: '#849495', lineHeight: 1.8 }}>
            <div><strong style={{ color: '#cbd5e1' }}>Aufbau:</strong> fill lowest-energy subshells first.</div>
            <div><strong style={{ color: '#cbd5e1' }}>Pauli:</strong> max 2 e⁻ per orbital, opposite spins.</div>
            <div><strong style={{ color: '#cbd5e1' }}>Hund:</strong> singly-fill degenerate orbitals before pairing.</div>
          </div>
        </div>

        {/* 2x2 grid: builder + 3D model on top, results + Bohr model on bottom */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', overflow: 'hidden' }}>

        {/* Top-left: orbital diagram */}
        <div style={{ overflowY: 'auto', padding: 22, borderRight: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {feedback && (
            <div style={{
              marginBottom: 16, padding: '10px 14px', borderRadius: 10, fontSize: 15.5,
              background: feedback.kind === 'error' ? 'rgba(239,68,68,0.1)' : feedback.kind === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(148,163,184,0.1)',
              border: `1px solid ${feedback.kind === 'error' ? 'rgba(239,68,68,0.3)' : feedback.kind === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(148,163,184,0.25)'}`,
              color: feedback.kind === 'error' ? '#fca5a5' : feedback.kind === 'success' ? '#86efac' : '#cbd5e1',
            }}>
              {feedback.text}
            </div>
          )}

          <div style={{ display: 'flex', gap: 14, alignItems: 'stretch' }}>
            {/* Energy axis — 1s at the bottom, energy rises upward */}
            <div style={{ width: 24, position: 'relative', flexShrink: 0 }}>
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, transform: 'translateX(-50%)', background: 'linear-gradient(to top, #3a4060, #a855f7)', borderRadius: 1 }} />
              <div style={{ position: 'absolute', left: '50%', top: -4, transform: 'translateX(-50%)', color: '#a855f7', fontSize: 15, lineHeight: 1 }}>▲</div>
              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%) rotate(-90deg)', whiteSpace: 'nowrap', fontSize: 13, color: '#849495', fontWeight: 700, letterSpacing: '0.12em' }}>
                ENERGY INCREASING
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', gap: rowGap }}>
              {visibleSubshells.map(s => {
                const label = s.label as string
                const orbitals = s.orbitals as number
                const cap = orbitals * 2
                const count = sumArr(filled[label])
                const full = count === cap
                return (
                  <div key={label} style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: rowPadding, borderRadius: 10,
                    background: full ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${full ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.06)'}`,
                  }}>
                    <div style={{ width: 32, fontFamily: 'monospace', fontWeight: 800, fontSize: 15, color: full ? '#22c55e' : '#cbd5e1' }}>{label}</div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {filled[label].map((c, idx) => (
                        <div
                          key={idx}
                          data-testid={`orbital-${label}-${idx}`}
                          onClick={() => handleAdd(label, idx)}
                          onDragOver={e => e.preventDefault()}
                          onDrop={e => { e.preventDefault(); handleAdd(label, idx) }}
                          style={{
                            width: boxSize, height: boxSize, borderRadius: 7, cursor: 'pointer',
                            border: `1.5px solid ${c > 0 ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.15)'}`,
                            background: c === 2 ? 'rgba(34,211,238,0.1)' : 'rgba(255,255,255,0.02)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                            fontSize: boxFontSize, fontWeight: 700, userSelect: 'none',
                          }}
                        >
                          {c >= 1 && <span style={{ color: '#22d3ee' }}>↑</span>}
                          {c >= 2 && <span style={{ color: '#fb923c' }}>↓</span>}
                        </div>
                      ))}
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: 14, fontFamily: 'monospace', color: full ? '#22c55e' : '#525a72' }}>{count}/{cap}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ marginTop: 18, fontSize: 15, color: '#849495' }}>
            Building: <span style={{ fontFamily: 'monospace', color: '#f8fafc' }}>{liveConfig || '—'}</span>
          </div>
        </div>

        {/* Top-right: 3D atomic model — light studio backdrop */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#f4ede0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '10px 16px 6px', fontSize: 13, color: '#7a6f5c', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0 }}>
            3D Atomic Model — {element.sym}
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <AtomicModel3D filled={filled} />
          </div>
        </div>

        {/* Bottom-left: result panel */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 20, overflowY: 'auto' }}>
          {!complete && (
            <div style={{ color: '#525a72', fontSize: 15, textAlign: 'center', paddingTop: 60 }}>
              Place all {z} electrons for {element.name} to see the full configuration and analysis.
            </div>
          )}
          {complete && (
            <>
              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 14, padding: '14px 16px', marginBottom: 14 }}>
                <div style={{ fontSize: 14, color: '#849495', marginBottom: 4 }}>Full configuration</div>
                <div style={{ fontSize: 16, fontFamily: 'monospace', color: '#86efac', lineHeight: 1.6, wordBreak: 'break-word' }}>{liveConfig}</div>
              </div>
              <div style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 14, padding: '14px 16px', marginBottom: 14 }}>
                <div style={{ fontSize: 14, color: '#849495', marginBottom: 4 }}>Noble-gas notation</div>
                <div style={{ fontSize: 16, fontFamily: 'monospace', color: '#c4b5fd', lineHeight: 1.6, wordBreak: 'break-word' }}>{nobleNotation}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div style={{ background: 'rgba(9,14,28,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 14px' }}>
                  <div style={{ fontSize: 13, color: '#849495', marginBottom: 3 }}>Unpaired e⁻</div>
                  <div style={{ fontSize: 17, fontWeight: 700, fontFamily: 'monospace', color: '#06b6d4' }}>{unpaired}</div>
                </div>
                <div style={{ background: 'rgba(9,14,28,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 14px' }}>
                  <div style={{ fontSize: 13, color: '#849495', marginBottom: 3 }}>Magnetism</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: unpaired > 0 ? '#fbbf24' : '#06b6d4' }}>{unpaired > 0 ? 'Paramagnetic' : 'Diamagnetic'}</div>
                </div>
              </div>

              <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 14, padding: '14px 16px', marginBottom: 14 }}>
                <div style={{ fontSize: 14, color: '#849495', marginBottom: 8 }}>Magnetic moment, μ = √[n(n+2)]</div>
                <div style={{ fontSize: 15, fontFamily: 'monospace', color: '#67e8f9', lineHeight: 1.9 }}>
                  <div>μ = √[{unpaired}({unpaired}+2)]</div>
                  <div>μ = √{muSquared}</div>
                  <div style={{ fontWeight: 800, color: '#22d3ee', fontSize: 16 }}>μ ≈ {mu.toFixed(2)} B.M.</div>
                </div>
              </div>

              {lastElectron && (
                <div style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 14, padding: '14px 16px', marginBottom: 14 }}>
                  <div style={{ fontSize: 14, color: '#849495', marginBottom: 8 }}>Last electron entered — {lastElectron.subshell.label}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {([['n', lastElectron.qn.n], ['l', lastElectron.qn.l], ['mₗ', fmtMl(lastElectron.qn.ml)], ['mₛ', lastElectron.qn.ms]] as const).map(([k, v]) => (
                      <div key={k} style={{ background: 'rgba(9,14,28,0.7)', borderRadius: 8, padding: '6px 10px', textAlign: 'center', minWidth: 50 }}>
                        <div style={{ fontSize: 13, color: '#849495' }}>{k}</div>
                        <div style={{ fontSize: 16, fontFamily: 'monospace', fontWeight: 700, color: '#fb923c' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {valenceElectron && (
                <div style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.25)', borderRadius: 14, padding: '14px 16px', marginBottom: 14 }}>
                  <div style={{ fontSize: 14, color: '#849495', marginBottom: 8 }}>Valence electron — {valenceElectron.subshell.label} <span style={{ color: '#525a72' }}>(differs from last entered)</span></div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {([['n', valenceElectron.qn.n], ['l', valenceElectron.qn.l], ['mₗ', fmtMl(valenceElectron.qn.ml)], ['mₛ', valenceElectron.qn.ms]] as const).map(([k, v]) => (
                      <div key={k} style={{ background: 'rgba(9,14,28,0.7)', borderRadius: 8, padding: '6px 10px', textAlign: 'center', minWidth: 50 }}>
                        <div style={{ fontSize: 13, color: '#849495' }}>{k}</div>
                        <div style={{ fontSize: 16, fontFamily: 'monospace', fontWeight: 700, color: '#f472b6' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {EXCEPTIONS[z] && (
                <div style={{ fontSize: 14.5, color: '#fde68a', lineHeight: 1.6, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: 10, padding: '10px 14px' }}>
                  ⚠ {EXCEPTIONS[z]}
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom-right: Bohr model */}
        <div style={{ background: '#05070d', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '10px 16px 6px', fontSize: 13, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0 }}>
            Bohr Model — {element.sym}
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <BohrModel filled={filled} />
          </div>
        </div>

        </div>
      </div>
    </div>
  )
}

const stepBtn: React.CSSProperties = {
  width: 26, height: 26, borderRadius: 6, border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.04)', color: '#cbd5e1', fontSize: 16, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
