'use client'
import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import { createEmptyGraph, MoleculeGraph } from '@/lib/nomenclature/model'
import { nameMolecule } from '@/lib/nomenclature/nameMolecule'
import {
  placeOrExtendCarbon,
  placeCarbonAt,
  attachSubstituent,
  placeRing,
  attachRing,
  attachSpiroRing,
  attachFusedRing,
  setBondOrder,
  cycleBondOrder,
  setBondWedge,
  eraseLeafAtom,
  SubstituentKind,
  RingSize,
} from '@/lib/nomenclature/editOps'
import AtomPalette from './components/AtomPalette'
import BondLineEditor from './components/BondLineEditor'
import StructuralFormulaView from './components/StructuralFormulaView'
import NamingPanel from './components/NamingPanel'
import { ToolId } from './components/tools'

const SUBSTITUENT_TOOLS: SubstituentKind[] = ['F', 'Cl', 'Br', 'I', 'OH', 'NH2', 'CH3', 'C2H5', 'COOH', 'C=O', 'NO2', 'CN', 'OCH3', 'COOCH3']
// A drag shorter than this (in model units, ~1 unit per bond length) is treated as a plain click —
// falls back to the old auto-angle placement so quick repeated clicking still works.
const DRAG_THRESHOLD = 0.3

const RING_TOOL_SIZE: Record<string, RingSize> = {
  'ring-benzene': 6,
  'ring-cyclohexane': 6,
  'ring-cyclopentane': 5,
  'ring-cyclobutane': 4,
  'ring-cyclopropane': 3,
}
const RING_TOOL_AROMATIC: Record<string, boolean> = {
  'ring-benzene': true,
  'ring-cyclohexane': false,
  'ring-cyclopentane': false,
  'ring-cyclobutane': false,
  'ring-cyclopropane': false,
}

export default function NomenclaturePage() {
  const [graph, setGraph] = useState<MoleculeGraph>(createEmptyGraph())
  const [history, setHistory] = useState<MoleculeGraph[]>([])
  const [activeTool, setActiveTool] = useState<ToolId>('chain')
  const [showH, setShowH] = useState(false)
  const [highlightOn, setHighlightOn] = useState(false)
  const [numberingOn, setNumberingOn] = useState(false)
  const [practiceMode, setPracticeMode] = useState(false)
  const [warning, setWarning] = useState<string | null>(null)
  const warningTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const result = useMemo(() => nameMolecule(graph), [graph])

  // Every edit pushes the pre-edit graph onto the undo stack — Clear counts as an edit too.
  function mutate(next: MoleculeGraph) {
    setHistory((h) => [...h, graph])
    setGraph(next)
  }

  function handleUndo() {
    setHistory((h) => {
      if (h.length === 0) return h
      setGraph(h[h.length - 1])
      return h.slice(0, -1)
    })
  }

  function flashWarning(message: string) {
    setWarning(message)
    clearTimeout(warningTimer.current)
    warningTimer.current = setTimeout(() => setWarning(null), 2500)
  }

  function handleAtomClick(atomId: string) {
    if (activeTool === 'erase') return mutate(eraseLeafAtom(graph, atomId))
    // Every other tool's atom interaction goes through handleAtomDragEnd (drag gesture) instead —
    // 'ring-fused' acts on a ring BOND, not an atom, so it legitimately no-ops here.
  }

  const BOND_TOOL_ORDER: Partial<Record<ToolId, 1 | 2 | 3>> = { 'bond-1': 1, 'bond-2': 2, 'bond-3': 3 }

  // Mouse released at (x, y) after starting a drag from `fromId`. A near-zero-distance "drag" (i.e. a
  // plain click) keeps the old quick auto-angle placement for fast repeated clicking; a real drag aims
  // the new carbon/group/ring exactly where the student dropped it, so structures stay clean instead of
  // the angle heuristic guessing wrong and crossing other bonds — same idea for every drag-capable tool,
  // not just the chain tool.
  function handleAtomDragEnd(fromId: string, x: number, y: number) {
    const from = graph.atoms[fromId]
    if (!from) return
    if (activeTool === 'chain' || activeTool in BOND_TOOL_ORDER) {
      // A bond-order tool (=, #) dragged from an atom extends the chain with that bond order directly,
      // instead of needing the separate "place a carbon, then click the bond to upgrade it" two-step.
      const order = BOND_TOOL_ORDER[activeTool] ?? 1
      const dist = Math.hypot(x - from.x, y - from.y)
      if (dist < DRAG_THRESHOLD) return mutate(placeOrExtendCarbon(graph, fromId, 0, 0, order))
      return mutate(placeCarbonAt(graph, fromId, x, y, order))
    }
    if ((SUBSTITUENT_TOOLS as ToolId[]).includes(activeTool)) {
      return mutate(attachSubstituent(graph, fromId, activeTool as SubstituentKind, { x, y }))
    }
    // Dragging onto/from an existing atom with a ring tool bonds a brand-new ring onto it (e.g. chain ->
    // propylbenzene) — this is how cyclic and acyclic pieces actually get connected; placing a ring on
    // empty canvas (below) only ever starts a fresh, separate structure. If that atom is already part
    // of an existing ring, this becomes a SPIRO union instead (same size/aromaticity as whichever ring
    // tool is active) — no separate "spiro" tool needed, dragging any ring tool onto a ring atom does it.
    if (activeTool in RING_TOOL_SIZE) {
      if (graph.rings.some((r) => r.atomIds.includes(fromId))) {
        const next = attachSpiroRing(graph, fromId, RING_TOOL_SIZE[activeTool], { x, y })
        if (next === graph) return flashWarning("Can't start a spiro union there — that atom has no spare bonds left.")
        return mutate(next)
      }
      return mutate(attachRing(graph, fromId, RING_TOOL_AROMATIC[activeTool], RING_TOOL_SIZE[activeTool], { x, y }))
    }
    // Dedicated spiro tool: drag from an existing RING atom to fuse a new (always 6-membered) ring
    // sharing exactly that one atom. Kept alongside the unified ring-tool behavior above for students
    // who want to be explicit that they're doing a spiro union specifically.
    if (activeTool === 'ring-spiro') {
      const next = attachSpiroRing(graph, fromId, 6, { x, y })
      if (next === graph) return flashWarning('Click an atom that is already part of a ring to start a spiro union.')
      return mutate(next)
    }
  }

  function handleEmptyCanvasClick(x: number, y: number) {
    if (activeTool === 'chain' && Object.keys(graph.atoms).length === 0) {
      return mutate(placeOrExtendCarbon(graph, null, x, y))
    }
    // A standalone ring on empty canvas only makes sense as the very first thing drawn — once other
    // atoms exist, clicking empty space here would otherwise create a second, disconnected piece.
    // Connecting to existing atoms happens via handleAtomClick (attachRing/attachSpiroRing) above, or
    // handleBondClick (attachFusedRing) below.
    if (Object.keys(graph.atoms).length === 0 && activeTool in RING_TOOL_SIZE) {
      return mutate(placeRing(graph, x, y, RING_TOOL_AROMATIC[activeTool], RING_TOOL_SIZE[activeTool]))
    }
  }

  function handleBondClick(bondId: string, nearAtomId: string) {
    if (activeTool === 'wedge' || activeTool === 'hash') {
      const next = setBondWedge(graph, bondId, nearAtomId, activeTool === 'wedge' ? 'up' : 'down')
      if (next === graph) {
        if (graph.bonds[bondId]?.order !== 1) flashWarning('Only a single bond can carry wedge/hash stereo notation.')
        return
      }
      return mutate(next)
    }
    if (activeTool === 'bond-1' || activeTool === 'bond-2' || activeTool === 'bond-3') {
      const order = activeTool === 'bond-1' ? 1 : activeTool === 'bond-2' ? 2 : 3
      const next = setBondOrder(graph, bondId, order)
      if (next === graph) {
        if (graph.bonds[bondId]?.order !== order) flashWarning("Valence doesn't allow that bond order here.")
        return
      }
      return mutate(next)
    }
    if (activeTool === 'erase') return
    // Clicking a bond that's part of an existing ring with ANY ring tool active fuses a new ring
    // (sharing that bond's two atoms as bridgeheads) onto that edge — no separate "fused" tool needed,
    // same unification as the spiro case above. The dedicated 'ring-fused' tool (always 6-membered)
    // stays available too for students who want to be explicit about it.
    if (activeTool in RING_TOOL_SIZE && graph.rings.some((r) => r.atomIds.includes(graph.bonds[bondId]?.a ?? '') && r.atomIds.includes(graph.bonds[bondId]?.b ?? ''))) {
      const next = attachFusedRing(graph, bondId, RING_TOOL_SIZE[activeTool])
      if (next === graph) return flashWarning("Can't fuse a new ring onto that edge — one of its atoms has no spare bonds left.")
      return mutate(next)
    }
    if (activeTool === 'ring-fused') {
      const next = attachFusedRing(graph, bondId, 6)
      if (next === graph) return flashWarning('Click a bond that is part of an existing ring to fuse a new ring onto that edge.')
      return mutate(next)
    }
    // Any other tool (chain, halogens, groups, rings...): a plain click on a bond cycles its order
    // single -> double -> triple -> single, so there's no need to switch to a dedicated bond tool first.
    const cycled = cycleBondOrder(graph, bondId)
    if (!cycled.changed) {
      if (cycled.blockedReason) flashWarning(cycled.blockedReason)
      return
    }
    mutate(cycled.graph)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 46, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#849495', textDecoration: 'none', fontSize: 13 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 14 }}>IUPAC Nomenclature Engine — build a structure, see its name update live</strong>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <AtomPalette
          activeTool={activeTool}
          onSelectTool={setActiveTool}
          showH={showH}
          onToggleShowH={() => setShowH((v) => !v)}
          onClear={() => mutate(createEmptyGraph())}
          onUndo={handleUndo}
          canUndo={history.length > 0}
        />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <div style={{ flex: 1, borderRight: '1px solid rgba(255,255,255,0.07)', position: 'relative', overflow: 'hidden' }}>
              <PanelLabel>✏️ Click or drag here to draw</PanelLabel>
              <BondLineEditor
                graph={graph}
                activeTool={activeTool}
                showH={showH}
                highlightAtomIds={highlightOn ? result.chainAtomIds : undefined}
                showNumbering={numberingOn}
                onAtomClick={handleAtomClick}
                onEmptyCanvasClick={handleEmptyCanvasClick}
                onBondClick={handleBondClick}
                onAtomDragEnd={handleAtomDragEnd}
              />
              {warning && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 14,
                    left: 14,
                    right: 14,
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: 'rgba(248,113,113,0.12)',
                    border: '1px solid rgba(248,113,113,0.35)',
                    color: '#fca5a5',
                    fontSize: 12.5,
                    fontWeight: 600,
                  }}
                >
                  {warning}
                </div>
              )}
            </div>
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <PanelLabel>Structural formula</PanelLabel>
              <StructuralFormulaView
                graph={graph}
                chainAtomIds={result.chainAtomIds}
                parentKind={result.parentKind}
                ringSubstituent={result.ringSubstituent}
              />
            </div>
          </div>

          <NamingPanel
            result={result}
            highlightOn={highlightOn}
            numberingOn={numberingOn}
            onToggleHighlight={() => setHighlightOn((v) => !v)}
            onToggleNumbering={() => setNumberingOn((v) => !v)}
            practiceMode={practiceMode}
            onTogglePracticeMode={() => setPracticeMode((v) => !v)}
          />
        </div>
      </div>
    </div>
  )
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        left: 14,
        zIndex: 1,
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: '#64748b',
        pointerEvents: 'none',
      }}
    >
      {children}
    </div>
  )
}
