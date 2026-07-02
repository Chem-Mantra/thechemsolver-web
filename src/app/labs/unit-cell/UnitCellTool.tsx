'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { edgeLengthFromRadius, packingEfficiency, densityGCm3, densityDerivation } from '@/lib/unitCell/core'
import { CELL_TYPES, CellType, cellTypeInfo } from '@/lib/unitCell/constants'

function ModeButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 12px',
        borderRadius: 8,
        border: `1px solid ${active ? '#f9731680' : 'rgba(255,255,255,0.1)'}`,
        background: active ? '#f9731620' : 'rgba(255,255,255,0.03)',
        color: active ? '#f97316' : '#94a3b8',
        fontSize: 12,
        fontWeight: 700,
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
      }}
    >
      {children}
    </button>
  )
}

function NumberField({ label, value, onChange, unit }: { label: string; value: string; onChange: (v: string) => void; unit: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#f8fafc', fontSize: 13 }}
        />
        <span style={{ fontSize: 12, color: '#64748b', width: 36 }}>{unit}</span>
      </div>
    </div>
  )
}

const COS30 = Math.cos(Math.PI / 6)
const SIN30 = Math.sin(Math.PI / 6)
const SCALE = 130
const ORIGIN_X = 200
const ORIGIN_Y = 220

function project([x, y, z]: [number, number, number]): [number, number] {
  const sx = (x - z) * COS30
  const sy = (x + z) * SIN30 - y
  return [ORIGIN_X + sx * SCALE, ORIGIN_Y + sy * SCALE]
}

const CORNERS: [number, number, number][] = [
  [0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1],
  [1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1],
]
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 4], [2, 6], [3, 5], [3, 6], [4, 7], [5, 7], [6, 7],
]
const FACE_CENTERS: [number, number, number][] = [
  [0.5, 0.5, 0], [0.5, 0.5, 1], [0.5, 0, 0.5], [0.5, 1, 0.5], [0, 0.5, 0.5], [1, 0.5, 0.5],
]
const BODY_CENTER: [number, number, number] = [0.5, 0.5, 0.5]

function IsometricCell({ type }: { type: CellType }) {
  const corners = CORNERS.map(project)
  return (
    <svg viewBox="0 0 400 340" width="100%" height="100%">
      {EDGES.map(([a, b], i) => (
        <line key={i} x1={corners[a][0]} y1={corners[a][1]} x2={corners[b][0]} y2={corners[b][1]} stroke="#475569" strokeWidth={1.5} />
      ))}
      {corners.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={9} fill="#a855f7" stroke="#08020d" strokeWidth={1.5} />
      ))}
      {type === 'fcc' &&
        FACE_CENTERS.map((p, i) => {
          const [cx, cy] = project(p)
          return <circle key={i} cx={cx} cy={cy} r={13} fill="#06b6d4" stroke="#08020d" strokeWidth={1.5} />
        })}
      {type === 'bcc' && (() => {
        const [cx, cy] = project(BODY_CENTER)
        return <circle cx={cx} cy={cy} r={16} fill="#22c55e" stroke="#08020d" strokeWidth={1.5} />
      })()}
      <g transform="translate(10, 320)">
        <circle cx={8} cy={0} r={6} fill="#a855f7" />
        <text x={20} y={4} fontSize={11} fill="#cbd5e1">Corner atom (1/8 inside cell)</text>
      </g>
      {type === 'fcc' && (
        <g transform="translate(220, 320)">
          <circle cx={8} cy={0} r={6} fill="#06b6d4" />
          <text x={20} y={4} fontSize={11} fill="#cbd5e1">Face atom (1/2 inside cell)</text>
        </g>
      )}
      {type === 'bcc' && (
        <g transform="translate(220, 320)">
          <circle cx={8} cy={0} r={6} fill="#22c55e" />
          <text x={20} y={4} fontSize={11} fill="#cbd5e1">Body atom (fully inside cell)</text>
        </g>
      )}
    </svg>
  )
}

export default function UnitCellPage() {
  const [type, setType] = useState<CellType>('fcc')
  const [radius, setRadius] = useState('128')
  const [molarMass, setMolarMass] = useState('63.55')

  const info = cellTypeInfo(type)
  const r = Math.max(Number(radius) || 1, 1)
  const M = Math.max(Number(molarMass) || 1, 1)

  const edgeLength = useMemo(() => edgeLengthFromRadius(type, r), [type, r])
  const efficiency = useMemo(() => packingEfficiency(type), [type])
  const density = useMemo(() => densityGCm3(type, edgeLength, M), [type, edgeLength, M])
  const derivation = useMemo(() => densityDerivation(type, edgeLength, M), [type, edgeLength, M])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ height: 46, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#849495', textDecoration: 'none', fontSize: 13 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 14 }}>Unit Cell & Crystal Structure — Packing, Coordination, Density</strong>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        <div style={{ width: 300, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', overflowY: 'auto', padding: 16 }}>
          <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Cell type</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            {CELL_TYPES.map((c) => (
              <ModeButton key={c.id} active={type === c.id} onClick={() => setType(c.id)}>{c.label}</ModeButton>
            ))}
          </div>

          <NumberField label="Atomic radius (r)" value={radius} onChange={setRadius} unit="pm" />
          <NumberField label="Molar mass (M)" value={molarMass} onChange={setMolarMass} unit="g/mol" />

          <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.6, marginTop: 8 }}>
            Default values are copper (FCC, r=128 pm, M=63.55 g/mol) — the classic example showing this
            geometric model reproduces copper's real density (~8.96 g/cm³).
          </div>
          <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.6, marginTop: 12 }}>
            Hexagonal close-packed (HCP) isn't a cubic cell, so it's not modeled here directly — but it
            shares FCC's coordination number (12) and packing efficiency (74.0%), just stacked
            differently (ABAB vs ABCABC).
          </div>
        </div>

        <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ width: 400, height: 340, flexShrink: 0 }}>
              <IsometricCell type={type} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div style={{ padding: 14, borderRadius: 10, background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)' }}>
                  <div style={{ fontSize: 10, color: '#d8b4fe' }}>Atoms per cell (Z)</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#a855f7' }}>{info.atomsPerCell}</div>
                </div>
                <div style={{ padding: 14, borderRadius: 10, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)' }}>
                  <div style={{ fontSize: 10, color: '#67e8f9' }}>Coordination number</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#06b6d4' }}>{info.coordinationNumber}</div>
                </div>
                <div style={{ padding: 14, borderRadius: 10, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
                  <div style={{ fontSize: 10, color: '#86efac' }}>Packing efficiency</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#22c55e' }}>{(efficiency * 100).toFixed(1)}%</div>
                </div>
                <div style={{ padding: 14, borderRadius: 10, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)' }}>
                  <div style={{ fontSize: 10, color: '#fdba74' }}>Edge length (a)</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#f97316' }}>{edgeLength.toFixed(1)} pm</div>
                </div>
              </div>

              <div style={{ padding: 16, borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: '#fca5a5', marginBottom: 4 }}>Theoretical density</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#ef4444' }}>{density.toFixed(3)} g/cm³</div>
              </div>

              <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Step-by-step calculation</div>
              <div style={{ padding: 14, borderRadius: 10, background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.4)' }}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6, fontFamily: 'monospace' }}>{derivation.formula}</div>
                <div style={{ fontSize: 12, color: '#cbd5e1', marginBottom: 6, fontFamily: 'monospace' }}>{derivation.substitution}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#ef4444', fontFamily: 'monospace', marginTop: 8 }}>{derivation.result}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
