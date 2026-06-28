'use client'
import { useState } from 'react'
import { ChainLength, OhRight, defaultOhRight, dlForConfig, interiorCarbonCount } from '@/lib/projection/sugarFischer'
import { GROUP_COLOR } from './groupPalette'

const LENGTH_OPTIONS: { length: ChainLength; name: string }[] = [
  { length: 3, name: 'Aldotriose (3C)' },
  { length: 4, name: 'Aldotetrose (4C)' },
  { length: 5, name: 'Aldopentose (5C)' },
  { length: 6, name: 'Aldohexose (6C)' },
]

const ROW_HEIGHT = 46
const TOP_PAD = 30
const ARM = 30
const CX = 130

function LadderSvg({ length, ohRight }: { length: ChainLength; ohRight: OhRight }) {
  const rowCount = length // CHO row + (length-2) interior rows + CH2OH row
  const height = TOP_PAD * 2 + ROW_HEIGHT * (rowCount - 1)
  const yFor = (row: number) => TOP_PAD + row * ROW_HEIGHT
  const ohColor = GROUP_COLOR.OH
  const hColor = GROUP_COLOR.H
  return (
    <svg viewBox={`0 0 260 ${height}`} width="100%" height="100%" style={{ overflow: 'hidden' }}>
      <line x1={CX} y1={yFor(0)} x2={CX} y2={yFor(rowCount - 1)} stroke="#475569" strokeWidth={3} />
      {/* C1: CHO */}
      <circle cx={CX} cy={yFor(0)} r={4} fill="#94a3b8" />
      <text x={CX} y={yFor(0) - 12} textAnchor="middle" fontSize={13} fontWeight={700} fill="#f97316">
        CHO
      </text>
      <text x={CX - ARM - 14} y={yFor(0) + 4} textAnchor="end" fontSize={9} fill="#64748b">
        C1
      </text>
      {/* Interior stereocenters */}
      {ohRight.map((right, i) => {
        const row = i + 1
        const y = yFor(row)
        const ohX = right ? CX + ARM : CX - ARM
        const hX = right ? CX - ARM : CX + ARM
        const isLastInterior = i === ohRight.length - 1
        return (
          <g key={i}>
            <line x1={CX - ARM} y1={y} x2={CX + ARM} y2={y} stroke="#475569" strokeWidth={3} />
            <circle cx={CX} cy={y} r={4} fill={isLastInterior ? '#f97316' : '#94a3b8'} />
            <text x={hX} y={y - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill={hColor}>
              H
            </text>
            <text x={ohX} y={y - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill={ohColor}>
              OH
            </text>
            <text x={CX - ARM - 14} y={y + 4} textAnchor="end" fontSize={9} fill={isLastInterior ? '#f97316' : '#64748b'}>
              C{row + 1}
              {isLastInterior ? ' ←D/L' : ''}
            </text>
          </g>
        )
      })}
      {/* Last carbon: CH2OH */}
      <circle cx={CX} cy={yFor(rowCount - 1)} r={4} fill="#94a3b8" />
      <text x={CX} y={yFor(rowCount - 1) + 18} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ef4444">
        CH2OH
      </text>
      <text x={CX - ARM - 14} y={yFor(rowCount - 1) + 4} textAnchor="end" fontSize={9} fill="#64748b">
        C{length}
      </text>
    </svg>
  )
}

export default function CarbohydrateFischer() {
  const [length, setLength] = useState<ChainLength>(6)
  const [ohRight, setOhRight] = useState<OhRight>(() => defaultOhRight(6))

  function setLengthAndResize(next: ChainLength) {
    setLength(next)
    setOhRight((prev) => {
      const count = interiorCarbonCount(next)
      const resized = prev.slice(0, count)
      while (resized.length < count) resized.push(true)
      return resized
    })
  }

  function toggle(i: number) {
    setOhRight((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
  }

  const dl = dlForConfig(ohRight)

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'auto', padding: 16, gap: 24 }}>
      <div style={{ width: 280, flexShrink: 0 }}>
        <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Chain length</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
          {LENGTH_OPTIONS.map((opt) => (
            <button
              key={opt.length}
              onClick={() => setLengthAndResize(opt.length)}
              style={{
                padding: '7px 10px',
                borderRadius: 7,
                border: `1px solid ${length === opt.length ? '#f9731680' : 'rgba(255,255,255,0.15)'}`,
                background: length === opt.length ? '#f9731620' : 'rgba(255,255,255,0.04)',
                color: length === opt.length ? '#f97316' : '#cbd5e1',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {opt.name}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
          OH side per carbon (click to flip)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
          {ohRight.map((right, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              style={{
                padding: '7px 10px',
                borderRadius: 7,
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.04)',
                color: '#cbd5e1',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              C{i + 2}: OH on the {right ? 'right' : 'left'}
              {i === ohRight.length - 1 ? ' (sets D/L)' : ''}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.7 }}>
          <strong style={{ color: '#f8fafc' }}>D/L is NOT the same as R/S.</strong> D/L is an older,
          purely positional convention: draw the chain vertically with CHO on top, then look ONLY at
          the stereocenter closest to the bottom (CH2OH) end — OH on the right is D, OH on the left is
          L. Every other carbon's OH side changes WHICH named sugar this is, but never changes whether
          it's D or L. CIP's R/S, by contrast, is computed independently at every single stereocenter
          from priority rules and ignores the drawing's orientation entirely — a D-sugar can be (R) or
          (S) at any given carbon depending on what's actually attached there.
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            padding: '10px 20px',
            borderRadius: 10,
            border: `1px solid ${dl === 'D' ? '#22c55e80' : '#a855f780'}`,
            background: dl === 'D' ? 'rgba(34,197,94,0.1)' : 'rgba(168,85,247,0.1)',
            color: dl === 'D' ? '#22c55e' : '#a855f7',
            fontSize: 18,
            fontWeight: 800,
          }}
        >
          {dl}-aldose
        </div>
        <div style={{ width: 280, height: 30 * length + 80, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden' }}>
          <LadderSvg length={length} ohRight={ohRight} />
        </div>
      </div>
    </div>
  )
}
