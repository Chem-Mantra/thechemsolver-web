'use client'
import { SawhorseLayout, SawhorseSlot } from '@/lib/projection/sawhorseLayout'
import { GROUP_COLOR, RANK_COLOR } from './groupPalette'

function toXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) }
}

const slotColor = (slot: SawhorseSlot, showCip: boolean) => (showCip && slot.rank ? RANK_COLOR[slot.rank - 1] : GROUP_COLOR[slot.label] ?? '#94a3b8')

/** Same bow-curve rank1→2→3 sweep as NewmanSvg's `RankArrow`, among a carbon's 3 visible fan arms
 * (the 4th substituent — the C–C bond — is the diagonal trunk line itself, no arm tip to draw at). */
function RankArrow({ cx, cy, slots, radius, bow = 1.7 }: { cx: number; cy: number; slots: SawhorseSlot[]; radius: number; bow?: number }) {
  const ranked = slots.filter((s): s is SawhorseSlot & { rank: 1 | 2 | 3 | 4 } => s.rank !== undefined).sort((a, b) => a.rank - b.rank)
  if (ranked.length < 3) return null
  const [p1, p2, p3] = ranked.slice(0, 3).map((s) => toXY(cx, cy, radius, s.angleDeg))
  const ctrl = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const mx = (a.x + b.x) / 2
    const my = (a.y + b.y) / 2
    return { x: cx + (mx - cx) * bow, y: cy + (my - cy) * bow }
  }
  const c1 = ctrl(p1, p2)
  const c2 = ctrl(p2, p3)
  const path = `M ${p1.x} ${p1.y} Q ${c1.x} ${c1.y} ${p2.x} ${p2.y} Q ${c2.x} ${c2.y} ${p3.x} ${p3.y}`
  return <path d={path} fill="none" stroke="#a855f7" strokeWidth={2.5} markerEnd="url(#sawhorseCipArrowHead)" opacity={0.85} />
}

function axisStatusLine(tag: string, axisRank?: 1 | 2 | 3 | 4): string | null {
  if (!axisRank) return null
  return `${tag} C–C bond = rank ${axisRank}`
}

export default function SawhorseSvg({ layout, showCip = false }: { layout: SawhorseLayout | null; showCip?: boolean }) {
  if (!layout) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#475569', fontSize: 13 }}>
        Needs 2 carbon centers
      </div>
    )
  }
  const frontC = { x: 75, y: 145 }
  const backC = { x: 145, y: 75 }
  const arm = 40
  const statusLines = [axisStatusLine('front', layout.frontAxisRank), axisStatusLine('back', layout.backAxisRank)].filter((s): s is string => s !== null)
  return (
    <svg viewBox="0 0 220 220" width="100%" height="100%" style={{ overflow: 'hidden' }}>
      <defs>
        <marker id="sawhorseCipArrowHead" markerWidth={8} markerHeight={8} refX={6} refY={3} orient="auto">
          <path d="M0,0 L7,3 L0,6 Z" fill="#a855f7" />
        </marker>
      </defs>
      <line x1={frontC.x} y1={frontC.y} x2={backC.x} y2={backC.y} stroke="#cbd5e1" strokeWidth={3} />
      {layout.front.map((slot, i) => {
        const tip = toXY(frontC.x, frontC.y, arm, slot.angleDeg)
        const color = slotColor(slot, showCip)
        return (
          <g key={`f${i}`}>
            <line x1={frontC.x} y1={frontC.y} x2={tip.x} y2={tip.y} stroke={color} strokeWidth={2.5} />
            <text x={tip.x} y={tip.y} dy={tip.y > frontC.y ? 14 : -8} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>
              {slot.label || 'H'}
            </text>
          </g>
        )
      })}
      {layout.back.map((slot, i) => {
        const tip = toXY(backC.x, backC.y, arm, slot.angleDeg)
        const color = slotColor(slot, showCip)
        return (
          <g key={`b${i}`}>
            <line x1={backC.x} y1={backC.y} x2={tip.x} y2={tip.y} stroke={color} strokeWidth={2.5} />
            <text x={tip.x} y={tip.y} dy={tip.y > backC.y ? 14 : -8} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>
              {slot.label || 'H'}
            </text>
          </g>
        )
      })}
      {showCip && <RankArrow cx={frontC.x} cy={frontC.y} slots={layout.front} radius={arm * 0.6} />}
      {showCip && <RankArrow cx={backC.x} cy={backC.y} slots={layout.back} radius={arm * 0.6} />}
      <circle cx={frontC.x} cy={frontC.y} r={4} fill="#f8fafc" />
      <circle cx={backC.x} cy={backC.y} r={4} fill="#f8fafc" />
      {showCip && statusLines.length > 0 ? (
        statusLines.map((line, i) => (
          <text key={i} x={110} y={198 + i * 11} textAnchor="middle" fontSize={9} fill="#475569">
            {line}
          </text>
        ))
      ) : (
        <text x={110} y={208} textAnchor="middle" fontSize={10} fill="#475569">
          oblique view along the C–C bond
        </text>
      )}
    </svg>
  )
}
