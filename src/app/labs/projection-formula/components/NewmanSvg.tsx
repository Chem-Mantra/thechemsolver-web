'use client'
import { NewmanLayout, NewmanSlot } from '@/lib/projection/newmanLayout'
import { GROUP_COLOR, RANK_COLOR } from './groupPalette'

function toXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) }
}

const slotColor = (slot: NewmanSlot, showCip: boolean) => (showCip && slot.rank ? RANK_COLOR[slot.rank - 1] : GROUP_COLOR[slot.label] ?? '#94a3b8')

/** The rank1→rank2→rank3 sweep among a carbon's 3 VISIBLE arms (the 4th substituent — the bond to the
 * other carbon — is the axis itself, drawn as the trunk/rim line, so it has no arm tip to point an
 * arrow at). Mirrors FischerSvg's `CipArrow` bow-curve technique exactly, pulling both control points
 * outward from the same center used for the arm geometry. */
function RankArrow({ cx, cy, slots, radius, bow = 1.7 }: { cx: number; cy: number; slots: NewmanSlot[]; radius: number; bow?: number }) {
  const ranked = slots.filter((s): s is NewmanSlot & { rank: 1 | 2 | 3 | 4 } => s.rank !== undefined).sort((a, b) => a.rank - b.rank)
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
  return <path d={path} fill="none" stroke="#a855f7" strokeWidth={2.5} markerEnd="url(#newmanCipArrowHead)" opacity={0.85} />
}

function axisStatusLine(tag: string, axisRank?: 1 | 2 | 3 | 4): string | null {
  if (!axisRank) return null
  return axisRank === 4 ? `${tag} axis = rank 4 (direct read)` : `${tag} axis = rank ${axisRank} (not the sightline)`
}

export default function NewmanSvg({ layout, showCip = false }: { layout: NewmanLayout | null; showCip?: boolean }) {
  if (!layout) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#475569', fontSize: 13 }}>
        Needs 2 carbon centers
      </div>
    )
  }
  const cx = 110
  const cy = 110
  const circleR = 50
  const frontArm = 38
  const backArm = circleR + 32
  const statusLines = [axisStatusLine('front', layout.frontAxisRank), axisStatusLine('back', layout.backAxisRank)].filter((s): s is string => s !== null)
  return (
    <svg viewBox="0 0 220 220" width="100%" height="100%" style={{ overflow: 'hidden' }}>
      <defs>
        <marker id="newmanCipArrowHead" markerWidth={8} markerHeight={8} refX={6} refY={3} orient="auto">
          <path d="M0,0 L7,3 L0,6 Z" fill="#a855f7" />
        </marker>
      </defs>
      <circle cx={cx} cy={cy} r={circleR} fill="none" stroke="#475569" strokeWidth={2} />
      {layout.back.map((slot, i) => {
        const rim = toXY(cx, cy, circleR, slot.angleDeg)
        const tip = toXY(cx, cy, backArm, slot.angleDeg)
        const color = slotColor(slot, showCip)
        return (
          <g key={`b${i}`}>
            <line x1={rim.x} y1={rim.y} x2={tip.x} y2={tip.y} stroke={color} strokeWidth={2.5} />
            <text x={tip.x} y={tip.y} dy={tip.y > cy ? 14 : -8} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>
              {slot.label || 'H'}
            </text>
          </g>
        )
      })}
      {layout.front.map((slot, i) => {
        const tip = toXY(cx, cy, frontArm, slot.angleDeg)
        const color = slotColor(slot, showCip)
        return (
          <g key={`f${i}`}>
            <line x1={cx} y1={cy} x2={tip.x} y2={tip.y} stroke={color} strokeWidth={3} />
            <text x={tip.x} y={tip.y} dy={tip.y > cy ? 14 : -8} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>
              {slot.label || 'H'}
            </text>
          </g>
        )
      })}
      {showCip && <RankArrow cx={cx} cy={cy} slots={layout.front} radius={frontArm * 0.62} />}
      {showCip && <RankArrow cx={cx} cy={cy} slots={layout.back} radius={circleR + (backArm - circleR) * 0.55} />}
      <circle cx={cx} cy={cy} r={4} fill="#f8fafc" />
      {showCip && statusLines.length > 0 ? (
        <>
          <rect x={0} y={193} width={220} height={27} fill="#0f172a" opacity={0.85} />
          {statusLines.map((line, i) => (
            <text key={i} x={cx} y={204 + i * 11} textAnchor="middle" fontSize={9} fill="#94a3b8">
              {line}
            </text>
          ))}
        </>
      ) : (
        <text x={cx} y={208} textAnchor="middle" fontSize={10} fill="#475569">
          front carbon (center) · back carbon (rim)
        </text>
      )}
    </svg>
  )
}
