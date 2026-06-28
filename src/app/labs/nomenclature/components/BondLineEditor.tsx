'use client'
import { useMemo, useRef, useState } from 'react'
import { MoleculeGraph } from '@/lib/nomenclature/model'
import { ToolId } from './tools'

const PX = 70 // pixels per model-space unit
// Fixed, content-independent viewBox: ~14x10 model units, comfortably fits a
// zigzag chain up to ~decane plus branches/rings. Deliberately NOT auto-fit to
// the current atoms — a viewBox that re-centers as atoms are added makes
// already-placed atoms visually drift on screen, so a second click on "the
// same spot" misses the atom it just placed. Keeping it fixed means an atom's
// model (x,y) maps to one stable screen position for the whole session.
const VIEW_BOX = { minX: -490, minY: -350, w: 980, h: 700 }

export interface BondLineEditorProps {
  graph: MoleculeGraph
  activeTool: ToolId
  showH: boolean
  highlightAtomIds?: string[]
  showNumbering?: boolean
  onAtomClick: (atomId: string) => void
  onEmptyCanvasClick: (x: number, y: number) => void
  /** `nearAtomId` is whichever of the bond's two endpoints the click landed closer to — used by the
   * wedge/hash tool to decide which end is the stereocenter (the narrow point); every other tool
   * ignores it. */
  onBondClick: (bondId: string, nearAtomId: string) => void
  /** Mouse released at (x, y) in model space after dragging from `fromId` — for the chain tool this is a
   * new carbon at that exact spot; for substituent/ring/spiro tools it's the direction the new group
   * gets anchored toward, instead of an auto-picked angle. */
  onAtomDragEnd: (fromId: string, x: number, y: number) => void
}

const HETEROATOM_COLOR: Record<string, string> = { O: '#f87171', N: '#60a5fa', F: '#34d399', Cl: '#34d399', Br: '#fb923c', I: '#c084fc' }

// Tools that should stay simple-click on atoms (no drag-to-aim): 'erase' just removes a leaf atom,
// 'ring-fused' targets a ring BOND, not an atom, and 'wedge'/'hash' only ever mark an EXISTING bond's
// stereo notation (never extend a new atom). Every other tool — including the bond-order tools, which
// extend the chain with that bond order when dragged from an atom — benefits from drag-to-aim.
const NON_DRAG_TOOLS = new Set<ToolId>(['erase', 'ring-fused', 'wedge', 'hash'])

export default function BondLineEditor({
  graph,
  activeTool,
  showH,
  highlightAtomIds,
  showNumbering,
  onAtomClick,
  onEmptyCanvasClick,
  onBondClick,
  onAtomDragEnd,
}: BondLineEditorProps) {
  const atoms = Object.values(graph.atoms)
  const bonds = Object.values(graph.bonds)
  const viewBox = VIEW_BOX
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragFrom, setDragFrom] = useState<string | null>(null)
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null)
  const [hoveredAtomId, setHoveredAtomId] = useState<string | null>(null)
  const isDragTool = !NON_DRAG_TOOLS.has(activeTool)

  const locantByAtom = useMemo(() => {
    const map = new Map<string, number>()
    highlightAtomIds?.forEach((id, idx) => map.set(id, idx + 1))
    return map
  }, [highlightAtomIds])

  const highlightSet = useMemo(() => new Set(highlightAtomIds ?? []), [highlightAtomIds])

  const bondedAtomIds = useMemo(() => {
    const set = new Set<string>()
    bonds.forEach((b) => {
      set.add(b.a)
      set.add(b.b)
    })
    return set
  }, [bonds])

  function clientToModel(clientX: number, clientY: number): { x: number; y: number } {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const rect = svg.getBoundingClientRect()
    const px = ((clientX - rect.left) / rect.width) * viewBox.w + viewBox.minX
    const py = ((clientY - rect.top) / rect.height) * viewBox.h + viewBox.minY
    return { x: px / PX, y: py / PX }
  }

  // Attaches the window-level move/up listeners synchronously, inside the mousedown handler itself,
  // rather than via a useEffect keyed on dragFrom state. A useEffect only runs after React commits the
  // render from setDragFrom — for a fast/synthetic click (mousedown immediately followed by mouseup,
  // as a plain click is), the native mouseup can fire before that effect has run, so the listener
  // would never be attached in time and the drag would silently never finalize.
  function startDrag(atomId: string, startX: number, startY: number) {
    setDragFrom(atomId)
    setDragPos({ x: startX, y: startY })

    function handleMove(e: MouseEvent) {
      setDragPos(clientToModel(e.clientX, e.clientY))
    }
    function handleUp(e: MouseEvent) {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
      const pos = clientToModel(e.clientX, e.clientY)
      onAtomDragEnd(atomId, pos.x, pos.y)
      setDragFrom(null)
      setDragPos(null)
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
  }

  function handleBackgroundClick(e: React.MouseEvent<SVGSVGElement>) {
    if (activeTool !== 'chain' && !activeTool.startsWith('ring-')) return
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * viewBox.w + viewBox.minX
    const py = ((e.clientY - rect.top) / rect.height) * viewBox.h + viewBox.minY
    onEmptyCanvasClick(px / PX, py / PX)
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`${viewBox.minX} ${viewBox.minY} ${viewBox.w} ${viewBox.h}`}
      style={{ width: '100%', height: '100%', background: '#0b0712', cursor: 'crosshair' }}
      onClick={handleBackgroundClick}
    >
      {atoms.length === 0 && (
        <text x={viewBox.minX + viewBox.w / 2} y={viewBox.minY + viewBox.h / 2} textAnchor="middle" fill="#475569" fontSize={13}>
          Click anywhere to place your first carbon
        </text>
      )}

      {bonds.map((bond) => {
        const a = graph.atoms[bond.a]
        const b = graph.atoms[bond.b]
        if (!a || !b) return null
        const x1 = a.x * PX
        const y1 = a.y * PX
        const x2 = b.x * PX
        const y2 = b.y * PX
        const dx = x2 - x1
        const dy = y2 - y1
        const len = Math.hypot(dx, dy) || 1
        const nx = (-dy / len) * 4
        const ny = (dx / len) * 4
        const isHighlighted = highlightSet.has(bond.a) && highlightSet.has(bond.b)
        const stroke = isHighlighted ? '#f97316' : '#cbd5e1'
        const offsets = bond.order === 1 ? [0] : bond.order === 2 ? [-1, 1] : [-1.6, 0, 1.6]
        const handleClick = (e: React.MouseEvent) => {
          e.stopPropagation()
          const model = clientToModel(e.clientX, e.clientY)
          const da = Math.hypot(model.x - a.x, model.y - a.y)
          const db = Math.hypot(model.x - b.x, model.y - b.y)
          onBondClick(bond.id, da <= db ? bond.a : bond.b)
        }
        // A wedge/hash bond is drawn as a filled (wedge) or dashed-stripe (hash) triangle, narrow at
        // `fromAtomId` (the stereocenter) and wide at the other endpoint — the standard skeletal-
        // formula convention. Every other bond keeps the plain offset-lines rendering (1/2/3 order).
        if (bond.wedge) {
          const flip = bond.wedge.fromAtomId === bond.b
          const [nxX, nxY, fxX, fxY] = flip ? [x2, y2, x1, y1] : [x1, y1, x2, y2]
          const wideHalfWidth = 5
          if (bond.wedge.direction === 'up') {
            return (
              <g key={bond.id}>
                <polygon
                  points={`${nxX},${nxY} ${fxX + nx * wideHalfWidth},${fxY + ny * wideHalfWidth} ${fxX - nx * wideHalfWidth},${fxY - ny * wideHalfWidth}`}
                  fill={stroke}
                  style={{ cursor: 'pointer' }}
                  onClick={handleClick}
                />
              </g>
            )
          }
          const stripes = 6
          return (
            <g key={bond.id}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth={16} style={{ cursor: 'pointer' }} onClick={handleClick} />
              {Array.from({ length: stripes }, (_, i) => {
                const t = (i + 1) / stripes
                const w = wideHalfWidth * t
                const px = nxX + (fxX - nxX) * t
                const py = nxY + (fxY - nxY) * t
                return <line key={i} x1={px - nx * w} y1={py - ny * w} x2={px + nx * w} y2={py + ny * w} stroke={stroke} strokeWidth={1.8} pointerEvents="none" />
              })}
            </g>
          )
        }
        return (
          <g key={bond.id}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth={16} style={{ cursor: 'pointer' }} onClick={handleClick} />
            {offsets.map((o, i) => (
              <line
                key={i}
                x1={x1 + nx * o}
                y1={y1 + ny * o}
                x2={x2 + nx * o}
                y2={y2 + ny * o}
                stroke={stroke}
                strokeWidth={2.2}
                strokeLinecap="round"
                pointerEvents="none"
              />
            ))}
          </g>
        )
      })}

      {dragFrom && dragPos && graph.atoms[dragFrom] && (
        <line
          x1={graph.atoms[dragFrom].x * PX}
          y1={graph.atoms[dragFrom].y * PX}
          x2={dragPos.x * PX}
          y2={dragPos.y * PX}
          stroke="#f97316"
          strokeWidth={2}
          strokeDasharray="5 4"
          pointerEvents="none"
        />
      )}

      {atoms.map((atom) => {
        const x = atom.x * PX
        const y = atom.y * PX
        const isHetero = atom.element !== 'C'
        const isHighlighted = highlightSet.has(atom.id)
        const label = isHetero ? (atom.element === 'O' && atom.implicitHCount === 1 ? 'OH' : atom.element === 'N' && atom.implicitHCount === 2 ? 'NH2' : atom.element) : null
        const isHovered = hoveredAtomId === atom.id && activeTool !== 'erase'
        return (
          <g key={atom.id}>
            {isHovered && <circle cx={x} cy={y} r={12} fill="none" stroke="#f97316" strokeWidth={1.5} pointerEvents="none" />}
            <circle
              cx={x}
              cy={y}
              r={14}
              fill="transparent"
              style={{ cursor: isDragTool ? 'grab' : 'pointer' }}
              onMouseEnter={() => setHoveredAtomId(atom.id)}
              onMouseLeave={() => setHoveredAtomId((id) => (id === atom.id ? null : id))}
              onMouseDown={(e) => {
                if (!isDragTool) return
                e.stopPropagation()
                startDrag(atom.id, atom.x, atom.y)
              }}
              onClick={(e) => {
                e.stopPropagation()
                // Drag-capable tools handle atom interaction entirely through the drag gesture above (a
                // plain click is just a near-zero-distance drag, resolved by the parent's distance
                // check) — calling onAtomClick here too would double-fire the edit.
                if (!isDragTool) onAtomClick(atom.id)
              }}
            />
            {isHighlighted && <circle cx={x} cy={y} r={9} fill="#f9731633" pointerEvents="none" />}
            {!label && !bondedAtomIds.has(atom.id) && (
              <circle cx={x} cy={y} r={4} fill="#f8fafc" pointerEvents="none" />
            )}
            {label && (
              <>
                <circle cx={x} cy={y} r={label.length > 1 ? 13 : 10} fill="#0b0712" pointerEvents="none" />
                <text x={x} y={y + 6} textAnchor="middle" fontSize={17} fontWeight={700} fill={HETEROATOM_COLOR[atom.element] ?? '#f8fafc'} pointerEvents="none">
                  {label}
                </text>
              </>
            )}
            {!label && showH && atom.implicitHCount > 0 && (
              <text x={x + 11} y={y + 4} fontSize={9} fill="#64748b" pointerEvents="none">
                H{atom.implicitHCount > 1 ? atom.implicitHCount : ''}
              </text>
            )}
            {showNumbering && locantByAtom.has(atom.id) && (
              <text x={x} y={y - 14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f97316" pointerEvents="none">
                {locantByAtom.get(atom.id)}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
