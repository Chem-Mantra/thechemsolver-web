'use client'
import { FischerCross, FischerPos, cipReadingInfo } from '@/lib/projection/fischerLayout'
import { GROUP_COLOR, RANK_COLOR } from './groupPalette'

type SelectedSlot = { center: 0 | 1; slot: number } | null

function ClickableLabel({
  x,
  y,
  anchor,
  label,
  color,
  selected,
  onClick,
}: {
  x: number
  y: number
  anchor: 'start' | 'middle' | 'end'
  label: string
  color: string
  selected: boolean
  onClick?: () => void
}) {
  return (
    <g onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      {selected && <circle cx={x} cy={y - 4} r={16} fill="rgba(249,115,22,0.35)" stroke="#f97316" strokeWidth={1.5} />}
      <text x={x} y={y} textAnchor={anchor} fontSize={14} fontWeight={700} fill={color}>
        {label}
      </text>
    </g>
  )
}

const groupColor = (text: string) => GROUP_COLOR[text] ?? '#94a3b8'
const entryColor = (entry: FischerCross[FischerPos], showCip: boolean) => (showCip ? RANK_COLOR[entry.rank - 1] : groupColor(entry.label))

function posXY(cx: number, cy: number, arm: number): Record<FischerPos, { x: number; y: number }> {
  return { top: { x: cx, y: cy - arm }, bottom: { x: cx, y: cy + arm }, left: { x: cx - arm, y: cy }, right: { x: cx + arm, y: cy } }
}

/** The rank1→rank2→rank3 sweep, drawn as a 2-segment curved arrow bowing outward from the cross's
 * center — the direction a student would actually trace with a finger to apply the CIP clockwise/
 * counterclockwise rule. Needs the shared `#cipArrowHead` marker defined once at the outer <svg> level
 * (SVG ids must be unique per document, and the 2-carbon ladder renders 2 of these). */
function CipArrow({ cross, cx, cy, arm }: { cross: FischerCross; cx: number; cy: number; arm: number }) {
  const info = cipReadingInfo(cross)
  const P = posXY(cx, cy, arm)
  const [pos1, pos2, pos3] = info.orderedPositions
  const [p1, p2, p3] = [P[pos1], P[pos2], P[pos3]]
  const bow = 1.55
  const ctrl = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const mx = (a.x + b.x) / 2
    const my = (a.y + b.y) / 2
    return { x: cx + (mx - cx) * bow, y: cy + (my - cy) * bow }
  }
  const c1 = ctrl(p1, p2)
  const c2 = ctrl(p2, p3)
  const path = `M ${p1.x} ${p1.y} Q ${c1.x} ${c1.y} ${p2.x} ${p2.y} Q ${c2.x} ${c2.y} ${p3.x} ${p3.y}`
  return <path d={path} fill="none" stroke="#a855f7" strokeWidth={2.5} markerEnd="url(#cipArrowHead)" opacity={0.85} />
}

function cipStatusLine(cross: FischerCross): string {
  const info = cipReadingInfo(cross)
  const rank4Label = cross[info.rank4Pos].label || 'H'
  return info.rank4IsVertical ? `rank 4 (${rank4Label}) vertical → read directly` : `rank 4 (${rank4Label}) horizontal → flip to read`
}

/** Single isolated stereocenter — all 4 positions are real, clickable palette slots: click one, then
 * another on the SAME cross, to swap them (same mechanic as the 3D wedge-dash panel). */
function SingleCross({
  cross,
  cx,
  cy,
  arm,
  selectedSlot,
  onEntryClick,
  showCip,
}: {
  cross: FischerCross
  cx: number
  cy: number
  arm: number
  selectedSlot: SelectedSlot
  onEntryClick: (center: 0 | 1, slot: number) => void
  showCip: boolean
}) {
  const isSel = (slotIndex: number | null) => slotIndex !== null && selectedSlot?.center === 0 && selectedSlot.slot === slotIndex
  const click = (slotIndex: number | null) => (slotIndex !== null ? () => onEntryClick(0, slotIndex) : undefined)
  return (
    <g>
      <line x1={cx} y1={cy - arm} x2={cx} y2={cy + arm} stroke="#475569" strokeWidth={3} />
      <line x1={cx - arm} y1={cy} x2={cx + arm} y2={cy} stroke="#475569" strokeWidth={3} />
      {showCip && <CipArrow cross={cross} cx={cx} cy={cy} arm={arm * 0.55} />}
      <circle cx={cx} cy={cy} r={4} fill="#94a3b8" />
      <ClickableLabel x={cx} y={cy - arm - 8} anchor="middle" label={cross.top.label || 'H'} color={entryColor(cross.top, showCip)} selected={isSel(cross.top.slotIndex)} onClick={click(cross.top.slotIndex)} />
      <ClickableLabel x={cx} y={cy + arm + 18} anchor="middle" label={cross.bottom.label || 'H'} color={entryColor(cross.bottom, showCip)} selected={isSel(cross.bottom.slotIndex)} onClick={click(cross.bottom.slotIndex)} />
      <ClickableLabel x={cx - arm - 12} y={cy + 5} anchor="end" label={cross.left.label || 'H'} color={entryColor(cross.left, showCip)} selected={isSel(cross.left.slotIndex)} onClick={click(cross.left.slotIndex)} />
      <ClickableLabel x={cx + arm + 12} y={cy + 5} anchor="start" label={cross.right.label || 'H'} color={entryColor(cross.right, showCip)} selected={isSel(cross.right.slotIndex)} onClick={click(cross.right.slotIndex)} />
    </g>
  )
}

/** The authentic textbook "stacked ladder": ONE continuous vertical line running through both
 * carbons (their shared bond IS that line, not a separately-drawn arm), with whichever carbon carries
 * the molecule's principal characteristic group drawn at the TOP (`topIsA` says which) — its top arm
 * and left/right are clickable, the bottom carbon's bottom arm and left/right are clickable; the
 * connecting segment itself is a real bond, not a swappable group, so it has no label and isn't
 * clickable. */
function LadderDiagram({
  crossA,
  crossB,
  topIsA,
  cx,
  cyA,
  cyB,
  arm,
  selectedSlot,
  onEntryClick,
  showCip,
  locantA,
  locantB,
  numberingOn,
}: {
  crossA: FischerCross
  crossB: FischerCross
  topIsA: boolean
  cx: number
  cyA: number
  cyB: number
  arm: number
  selectedSlot: SelectedSlot
  onEntryClick: (center: 0 | 1, slot: number) => void
  showCip: boolean
  locantA?: number | null
  locantB?: number | null
  numberingOn?: boolean
}) {
  const tagFor = (center: 0 | 1, fallback: string) => {
    const locant = center === 0 ? locantA : locantB
    return numberingOn && locant ? `C${locant}` : fallback
  }
  const top: { cross: FischerCross; center: 0 | 1; tag: string; cy: number } = topIsA
    ? { cross: crossA, center: 0, tag: tagFor(0, 'A'), cy: cyA }
    : { cross: crossB, center: 1, tag: tagFor(1, 'B'), cy: cyA }
  const bottom: { cross: FischerCross; center: 0 | 1; tag: string; cy: number } = topIsA
    ? { cross: crossB, center: 1, tag: tagFor(1, 'B'), cy: cyB }
    : { cross: crossA, center: 0, tag: tagFor(0, 'A'), cy: cyB }
  const isSel = (center: 0 | 1, slotIndex: number | null) => slotIndex !== null && selectedSlot?.center === center && selectedSlot.slot === slotIndex
  const click = (center: 0 | 1, slotIndex: number | null) => (slotIndex !== null ? () => onEntryClick(center, slotIndex) : undefined)
  return (
    <g>
      <line x1={cx} y1={cyA - arm} x2={cx} y2={cyB + arm} stroke="#475569" strokeWidth={3} />
      <line x1={cx - arm} y1={cyA} x2={cx + arm} y2={cyA} stroke="#475569" strokeWidth={3} />
      <line x1={cx - arm} y1={cyB} x2={cx + arm} y2={cyB} stroke="#475569" strokeWidth={3} />
      {showCip && <CipArrow cross={top.cross} cx={cx} cy={top.cy} arm={arm * 0.55} />}
      {showCip && <CipArrow cross={bottom.cross} cx={cx} cy={bottom.cy} arm={arm * 0.55} />}
      <circle cx={cx} cy={cyA} r={4} fill="#94a3b8" />
      <circle cx={cx} cy={cyB} r={4} fill="#94a3b8" />
      <text x={cx - 10} y={cyA - 10} textAnchor="end" fontSize={numberingOn ? 12 : 9} fontWeight={700} fill={numberingOn ? '#fbbf24' : '#64748b'}>{top.tag}</text>
      <text x={cx - 10} y={cyB - 10} textAnchor="end" fontSize={numberingOn ? 12 : 9} fontWeight={700} fill={numberingOn ? '#fbbf24' : '#64748b'}>{bottom.tag}</text>

      <ClickableLabel x={cx} y={cyA - arm - 8} anchor="middle" label={top.cross.top.label || 'H'} color={entryColor(top.cross.top, showCip)} selected={isSel(top.center, top.cross.top.slotIndex)} onClick={click(top.center, top.cross.top.slotIndex)} />
      <ClickableLabel x={cx - arm - 12} y={cyA + 5} anchor="end" label={top.cross.left.label || 'H'} color={entryColor(top.cross.left, showCip)} selected={isSel(top.center, top.cross.left.slotIndex)} onClick={click(top.center, top.cross.left.slotIndex)} />
      <ClickableLabel x={cx + arm + 12} y={cyA + 5} anchor="start" label={top.cross.right.label || 'H'} color={entryColor(top.cross.right, showCip)} selected={isSel(top.center, top.cross.right.slotIndex)} onClick={click(top.center, top.cross.right.slotIndex)} />

      <ClickableLabel x={cx - arm - 12} y={cyB + 5} anchor="end" label={bottom.cross.left.label || 'H'} color={entryColor(bottom.cross.left, showCip)} selected={isSel(bottom.center, bottom.cross.left.slotIndex)} onClick={click(bottom.center, bottom.cross.left.slotIndex)} />
      <ClickableLabel x={cx + arm + 12} y={cyB + 5} anchor="start" label={bottom.cross.right.label || 'H'} color={entryColor(bottom.cross.right, showCip)} selected={isSel(bottom.center, bottom.cross.right.slotIndex)} onClick={click(bottom.center, bottom.cross.right.slotIndex)} />
      <ClickableLabel x={cx} y={cyB + arm + 18} anchor="middle" label={bottom.cross.bottom.label || 'H'} color={entryColor(bottom.cross.bottom, showCip)} selected={isSel(bottom.center, bottom.cross.bottom.slotIndex)} onClick={click(bottom.center, bottom.cross.bottom.slotIndex)} />
    </g>
  )
}

const ARROW_MARKER = (
  <defs>
    <marker id="cipArrowHead" markerWidth={8} markerHeight={8} refX={6} refY={3} orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="#a855f7" />
    </marker>
  </defs>
)

export default function FischerSvg({
  single,
  ladder,
  selectedSlot,
  onEntryClick,
  showCip = false,
  numberingOn = false,
  locantA,
  locantB,
}: {
  single?: FischerCross | null
  ladder?: { crossA: FischerCross; crossB: FischerCross; topIsA: boolean } | null
  selectedSlot: SelectedSlot
  onEntryClick: (center: 0 | 1, slot: number) => void
  showCip?: boolean
  numberingOn?: boolean
  locantA?: number | null
  locantB?: number | null
}) {
  if (single) {
    return (
      <svg viewBox="0 0 220 220" width="100%" height="100%">
        {ARROW_MARKER}
        <SingleCross cross={single} cx={110} cy={110} arm={62} selectedSlot={selectedSlot} onEntryClick={onEntryClick} showCip={showCip} />
        {numberingOn && (
          <text x={110} y={32} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fbbf24">
            C{locantA ?? 1}
          </text>
        )}
        <text x={110} y={205} textAnchor="middle" fontSize={10} fill="#475569">
          {showCip ? cipStatusLine(single) : 'horizontal = toward you · vertical = away'}
        </text>
      </svg>
    )
  }
  if (ladder) {
    return (
      <svg viewBox="0 0 240 410" width="100%" height="100%">
        {ARROW_MARKER}
        <LadderDiagram
          crossA={ladder.crossA}
          crossB={ladder.crossB}
          topIsA={ladder.topIsA}
          cx={120}
          cyA={100}
          cyB={290}
          arm={55}
          selectedSlot={selectedSlot}
          onEntryClick={onEntryClick}
          showCip={showCip}
          locantA={locantA}
          locantB={locantB}
          numberingOn={numberingOn}
        />
        {showCip ? (
          <>
            <text x={120} y={392} textAnchor="middle" fontSize={9} fill="#475569">A: {cipStatusLine(ladder.crossA)}</text>
            <text x={120} y={404} textAnchor="middle" fontSize={9} fill="#475569">B: {cipStatusLine(ladder.crossB)}</text>
          </>
        ) : (
          <text x={120} y={400} textAnchor="middle" fontSize={10} fill="#475569">horizontal = toward you · vertical = away</text>
        )}
      </svg>
    )
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#475569', fontSize: 13 }}>
      Assign 4 different groups to see the Fischer projection
    </div>
  )
}
