// The editor-facing mutation API. Each function clones the graph, applies one
// edit, and returns the new graph — callers never mutate React state in place.
// This is the boundary between the "editor layer" (clicks/tools) and the pure
// "chemistry model layer" (model.ts) described in the design doc.

import {
  MoleculeGraph,
  AtomNode,
  Bond,
  addAtom,
  addBond,
  cloneGraph,
  removeAtom as removeAtomFromGraph,
  bondsOf,
  bondBetween,
  neighbors,
} from './model'
import { freeValence, fillImplicitHydrogens } from './valency'

export type SubstituentKind =
  | 'F'
  | 'Cl'
  | 'Br'
  | 'I'
  | 'OH'
  | 'NH2'
  | 'CH3'
  | 'C2H5'
  | 'COOH'
  | 'C=O'
  | 'CHO'
  | 'NO2'
  | 'CN'
  | 'OCH3'
  | 'COOCH3'

const HEX_ANGLES_DEG = [-30, 30, -90, 90, -150, 150] // preferred order: right-up, right-down, up, down, left-up, left-down

function angleOf(dx: number, dy: number): number {
  return (Math.atan2(dy, dx) * 180) / Math.PI
}

function angleDiff(a: number, b: number): number {
  let d = Math.abs(a - b) % 360
  if (d > 180) d = 360 - d
  return d
}

/**
 * Picks a direction from `fromId` for the next new atom. When `preferredDeg` is given (the student
 * dragged toward a specific point rather than just clicking) and it doesn't land right on top of an
 * existing bond, it's used as-is — so the student gets the exact angle they dragged to, not a snap to
 * the nearest hex-grid direction. Falls back to the original hex-grid auto-pick otherwise (a plain
 * click, or no open angle near the drag direction).
 */
function pickNextAngle(graph: MoleculeGraph, fromId: string, preferredDeg?: number): number {
  const from = graph.atoms[fromId]
  const occupied = bondsOf(graph, fromId).map((bond) => {
    const otherId = bond.a === fromId ? bond.b : bond.a
    const other = graph.atoms[otherId]
    return angleOf(other.x - from.x, other.y - from.y)
  })
  if (preferredDeg !== undefined && !occupied.some((o) => angleDiff(o, preferredDeg) < 15)) {
    return preferredDeg
  }
  for (const candidate of HEX_ANGLES_DEG) {
    if (!occupied.some((o) => angleDiff(o, candidate) < 20)) return candidate
  }
  return HEX_ANGLES_DEG[occupied.length % HEX_ANGLES_DEG.length]
}

const UNIT = 1 // grid unit in model space; the view layer scales this to pixels
const DRAG_NOOP_THRESHOLD = 0.25 // a drag shorter than this (model units) is treated as a plain click

/** Converts a student's drag-drop point into a preferred angle from `fromId`, or undefined for a
 * plain click (no drop point, or the drag was too short to express real intent). */
function preferredAngleFromDrop(graph: MoleculeGraph, fromId: string, drop?: { x: number; y: number }): number | undefined {
  if (!drop) return undefined
  const from = graph.atoms[fromId]
  if (Math.hypot(drop.x - from.x, drop.y - from.y) < DRAG_NOOP_THRESHOLD) return undefined
  return angleOf(drop.x - from.x, drop.y - from.y)
}

function nextPosition(graph: MoleculeGraph, fromId: string, preferredDeg?: number): { x: number; y: number } {
  const from = graph.atoms[fromId]
  const angle = (pickNextAngle(graph, fromId, preferredDeg) * Math.PI) / 180
  return { x: from.x + UNIT * Math.cos(angle), y: from.y + UNIT * Math.sin(angle) }
}

/** Places the very first atom, or extends a new carbon from an existing atom (if it has spare valence). `order` lets the bond-order tools (=, #) extend the chain with a double/triple bond directly instead of needing a separate "place then upgrade the bond" step. */
export function placeOrExtendCarbon(
  graph: MoleculeGraph,
  fromId: string | null,
  fallbackX: number,
  fallbackY: number,
  order: 1 | 2 | 3 = 1
): MoleculeGraph {
  const next = cloneGraph(graph)
  if (!fromId) {
    addAtom(next, 'C', fallbackX, fallbackY)
    return fillImplicitHydrogens(next)
  }
  if (freeValence(next, fromId) < order) return next
  const pos = nextPosition(next, fromId)
  const newAtom = addAtom(next, 'C', pos.x, pos.y)
  addBond(next, fromId, newAtom.id, order)
  return fillImplicitHydrogens(next)
}

// Model units; a drop this close to an EXISTING other atom closes a ring instead of placing a new
// one. Deliberately tight (smaller than the ~0.2-unit atom hit-circle would suggest is "obviously the
// same atom") — a looser radius risks an accidental ring-closing bond firing during ordinary chain
// drawing whenever two unrelated atoms happen to land spatially close together (e.g. a tight zigzag
// near a ring), silently turning a plain chain into a branched/cyclic structure the student never
// intended and didn't ask for.
const RING_CLOSE_SNAP_DIST = 0.22

/** Shortest existing-bond path between two atoms (BFS) — used right before adding a ring-closing bond, to capture exactly which atoms the new bond turns into a ring. */
function pathBetweenAtoms(graph: MoleculeGraph, fromId: string, toId: string): string[] | null {
  const visited = new Set([fromId])
  const parent = new Map<string, string>()
  const queue = [fromId]
  while (queue.length > 0) {
    const cur = queue.shift()!
    if (cur === toId) {
      const path = [cur]
      let p = cur
      while (p !== fromId) {
        p = parent.get(p)!
        path.push(p)
      }
      return path.reverse()
    }
    for (const { atom } of neighbors(graph, cur)) {
      if (!visited.has(atom.id)) {
        visited.add(atom.id)
        parent.set(atom.id, cur)
        queue.push(atom.id)
      }
    }
  }
  return null
}

function findNearbyAtom(graph: MoleculeGraph, excludeId: string, x: number, y: number): string | null {
  let best: string | null = null
  let bestDist = RING_CLOSE_SNAP_DIST
  for (const atom of Object.values(graph.atoms)) {
    if (atom.id === excludeId) continue
    const d = Math.hypot(atom.x - x, atom.y - y)
    if (d < bestDist) {
      bestDist = d
      best = atom.id
    }
  }
  return best
}

/**
 * Extends a carbon from `fromId` at an exact, user-chosen (x, y) instead of an auto-picked hex angle.
 * Used by the drag-to-draw gesture so students control bond direction/length directly, rather than the
 * angle heuristic guessing wrong and producing overlapping/crossing bonds on denser structures.
 *
 * If the drop point lands right on an EXISTING other atom instead of empty space, this closes a ring
 * by bonding straight to that atom rather than placing a brand new one — this is how a student hand-
 * draws an arbitrary ring (of any size) with the plain chain tool: draw a path, then drag the last atom
 * back onto the first one. `order` lets the bond-order tools (=, #) extend/close with that bond order.
 */
export function placeCarbonAt(graph: MoleculeGraph, fromId: string, x: number, y: number, order: 1 | 2 | 3 = 1): MoleculeGraph {
  if (freeValence(graph, fromId) < order) return graph
  const nearby = findNearbyAtom(graph, fromId, x, y)
  if (nearby) {
    if (bondBetween(graph, fromId, nearby)) return graph // already connected — nothing sensible to do
    if (freeValence(graph, nearby) < order) return graph
    const next = cloneGraph(graph)
    const cyclePath = pathBetweenAtoms(next, fromId, nearby) // computed BEFORE the new bond exists
    addBond(next, fromId, nearby, order)
    if (cyclePath && cyclePath.length >= 3) {
      next.rings.push({ id: `ring_${nearby}`, atomIds: cyclePath, aromatic: false })
    }
    return fillImplicitHydrogens(next)
  }
  const next = cloneGraph(graph)
  const newAtom = addAtom(next, 'C', x, y)
  addBond(next, fromId, newAtom.id, order)
  return fillImplicitHydrogens(next)
}

const SUBSTITUENT_SPEC: Record<
  SubstituentKind,
  {
    build: (g: MoleculeGraph, attachId: string, anchor: { x: number; y: number }) => void
    valenceNeeded: number
    /** Set when build() lays out its own atoms (branching groups like -COOH) — skips the generic straight-line layout. */
    selfPositioned?: boolean
  }
> = {
  F: { valenceNeeded: 1, build: (g, attachId) => addBond(g, attachId, addAtom(g, 'F', 0, 0).id, 1) },
  Cl: { valenceNeeded: 1, build: (g, attachId) => addBond(g, attachId, addAtom(g, 'Cl', 0, 0).id, 1) },
  Br: { valenceNeeded: 1, build: (g, attachId) => addBond(g, attachId, addAtom(g, 'Br', 0, 0).id, 1) },
  I: { valenceNeeded: 1, build: (g, attachId) => addBond(g, attachId, addAtom(g, 'I', 0, 0).id, 1) },
  OH: { valenceNeeded: 1, build: (g, attachId) => addBond(g, attachId, addAtom(g, 'O', 0, 0).id, 1) },
  NH2: { valenceNeeded: 1, build: (g, attachId) => addBond(g, attachId, addAtom(g, 'N', 0, 0).id, 1) },
  CH3: { valenceNeeded: 1, build: (g, attachId) => addBond(g, attachId, addAtom(g, 'C', 0, 0).id, 1) },
  C2H5: {
    valenceNeeded: 1,
    build: (g, attachId) => {
      const c1 = addAtom(g, 'C', 0, 0)
      const c2 = addAtom(g, 'C', 0, 0)
      addBond(g, attachId, c1.id, 1)
      addBond(g, c1.id, c2.id, 1)
    },
  },
  // Double-bonded O directly on the clicked atom: becomes an aldehyde (-CHO) if that atom is a chain
  // end with one H left, or a ketone (C=O) if it's an internal carbon with two chain neighbors — the
  // engine (principalGroup.ts) classifies which based on the resulting valence, the editor doesn't decide.
  'C=O': {
    valenceNeeded: 2,
    build: (g, attachId, anchor) => addBond(g, attachId, addAtom(g, 'O', anchor.x, anchor.y).id, 2),
  },
  // -CHO (aldehyde): unlike 'C=O' above, this adds its OWN new carbon (single-bonded to attachId,
  // exactly like CN's nitrile carbon below) rather than turning attachId itself into the carbonyl
  // carbon — needed whenever attachId must stay sp3 (e.g. a stereocenter with its own 4 substituents).
  CHO: {
    valenceNeeded: 1,
    build: (g, attachId) => {
      const aldehydeCarbon = addAtom(g, 'C', 0, 0)
      addBond(g, attachId, aldehydeCarbon.id, 1)
      addBond(g, aldehydeCarbon.id, addAtom(g, 'O', 0, 0).id, 2)
    },
  },
  // -COOH adds a new carbon (the acid carbon, becomes part of the parent chain) bearing one double-bonded
  // and one single-bonded (auto-protonated) oxygen, laid out at its own open hex angles, not a straight line.
  COOH: {
    valenceNeeded: 1,
    selfPositioned: true,
    build: (g, attachId, anchor) => {
      const acidCarbon = addAtom(g, 'C', anchor.x, anchor.y)
      addBond(g, attachId, acidCarbon.id, 1)
      const p1 = nextPosition(g, acidCarbon.id)
      addBond(g, acidCarbon.id, addAtom(g, 'O', p1.x, p1.y).id, 2)
      const p2 = nextPosition(g, acidCarbon.id)
      addBond(g, acidCarbon.id, addAtom(g, 'O', p2.x, p2.y).id, 1)
    },
  },
  // -NO2: the nitrogen and its two double-bonded oxygens all need their own open angles, same
  // reason -COOH is self-positioned. This is the one substituent whose bond-order sum (5, from the
  // textbook N(=O)(=O)- depiction) legitimately exceeds plain covalent valence — valency.ts's
  // isNitroNitrogen exempts exactly this shape rather than rejecting it as over-valent.
  NO2: {
    valenceNeeded: 1,
    selfPositioned: true,
    build: (g, attachId, anchor) => {
      const n = addAtom(g, 'N', anchor.x, anchor.y)
      addBond(g, attachId, n.id, 1)
      const p1 = nextPosition(g, n.id)
      addBond(g, n.id, addAtom(g, 'O', p1.x, p1.y).id, 2)
      const p2 = nextPosition(g, n.id)
      addBond(g, n.id, addAtom(g, 'O', p2.x, p2.y).id, 2)
    },
  },
  // -C#N: a new carbon (becomes part of the parent chain, just like -COOH's acid carbon) triple-
  // bonded to nitrogen — a straight line off attachId, so the generic post-build layout (below) is fine.
  CN: {
    valenceNeeded: 1,
    build: (g, attachId) => {
      const nitrileCarbon = addAtom(g, 'C', 0, 0)
      addBond(g, attachId, nitrileCarbon.id, 1)
      addBond(g, nitrileCarbon.id, addAtom(g, 'N', 0, 0).id, 3)
    },
  },
  // -O-CH3 (methoxy): a plain ether bridge, also a straight line off attachId.
  OCH3: {
    valenceNeeded: 1,
    build: (g, attachId) => {
      const o = addAtom(g, 'O', 0, 0)
      addBond(g, attachId, o.id, 1)
      addBond(g, o.id, addAtom(g, 'C', 0, 0).id, 1)
    },
  },
  // -COOCH3 (methyl ester): like -COOH but the second oxygen bridges to a methyl carbon instead of
  // carrying an H — three new atoms branching off the acyl carbon's own open angles.
  COOCH3: {
    valenceNeeded: 1,
    selfPositioned: true,
    build: (g, attachId, anchor) => {
      const acylCarbon = addAtom(g, 'C', anchor.x, anchor.y)
      addBond(g, attachId, acylCarbon.id, 1)
      const p1 = nextPosition(g, acylCarbon.id)
      addBond(g, acylCarbon.id, addAtom(g, 'O', p1.x, p1.y).id, 2)
      const p2 = nextPosition(g, acylCarbon.id)
      const bridgeO = addAtom(g, 'O', p2.x, p2.y)
      addBond(g, acylCarbon.id, bridgeO.id, 1)
      const p3 = nextPosition(g, bridgeO.id)
      addBond(g, bridgeO.id, addAtom(g, 'C', p3.x, p3.y).id, 1)
    },
  },
}

/**
 * Attaches a palette substituent group to `attachId`. When `drop` is given (the student dragged to a
 * specific point rather than just clicking), the new group is anchored exactly in that direction
 * instead of an auto-picked hex angle — keeps hand-drawn structures from bending at angles the student
 * didn't choose. Silently no-ops if there's no spare valence.
 */
export function attachSubstituent(graph: MoleculeGraph, attachId: string, kind: SubstituentKind, drop?: { x: number; y: number }): MoleculeGraph {
  const spec = SUBSTITUENT_SPEC[kind]
  if (freeValence(graph, attachId) < spec.valenceNeeded) return graph
  const next = cloneGraph(graph)
  const preferredDeg = preferredAngleFromDrop(next, attachId, drop)
  const pos = nextPosition(next, attachId, preferredDeg)
  if (spec.selfPositioned) {
    spec.build(next, attachId, pos)
    return fillImplicitHydrogens(next)
  }
  // build() always creates its first new atom at (0,0); patch it to the chosen position, and lay out any
  // follow-on atoms (C2H5's second carbon) one more step further out along the same direction.
  const before = new Set(Object.keys(next.atoms))
  spec.build(next, attachId, pos)
  const created = Object.keys(next.atoms).filter((id) => !before.has(id))
  created.forEach((id, i) => {
    const atom = next.atoms[id]
    atom.x = pos.x + i * (pos.x - next.atoms[attachId].x) * 0.6
    atom.y = pos.y + i * (pos.y - next.atoms[attachId].y) * 0.6
  })
  return fillImplicitHydrogens(next)
}

export type RingSize = 3 | 4 | 5 | 6

/** Places a standalone ring (3-6 membered; aromatic only ever passed true at size 6, since no neutral
 * 3/4/5-membered aromatic hydrocarbon exists at this level) — V1/V2 support exactly one ring per
 * molecule (relaxed for spiro/bicyclic in V4, see attachFusedRing/attachSpiroRing). */
export function placeRing(graph: MoleculeGraph, centerX: number, centerY: number, aromatic: boolean, size: RingSize = 6): MoleculeGraph {
  if (graph.rings.length > 0) return graph
  const next = cloneGraph(graph)
  const atoms: AtomNode[] = []
  for (let i = 0; i < size; i++) {
    const angle = ((2 * Math.PI) / size) * i - Math.PI / 2
    atoms.push(addAtom(next, 'C', centerX + UNIT * Math.cos(angle), centerY + UNIT * Math.sin(angle)))
  }
  // Benzene needs alternating single/double (Kekule) ring bonds so each unsubstituted carbon ends up
  // with exactly 1 implicit H (C6H6) — all-single ring bonds would wrongly leave 2 H's per carbon (C6H12,
  // i.e. cyclohexane's formula). Cyclohexane (and the smaller saturated rings) are correctly all-single
  // since they have no ring unsaturation.
  for (let i = 0; i < size; i++) {
    const order = aromatic && i % 2 === 0 ? 2 : 1
    addBond(next, atoms[i].id, atoms[(i + 1) % size].id, order)
  }
  next.rings.push({ id: `ring_${atoms[0].id}`, atomIds: atoms.map((a) => a.id), aromatic })
  return fillImplicitHydrogens(next)
}

/**
 * Bonds a brand-new ring onto an existing atom (e.g. turning a plain chain into
 * propylbenzene/cyclohexylethane) — the ring-tool counterpart to `placeRing`, used when the canvas
 * already has atoms so a standalone ring would otherwise be left disconnected from them. No-ops if a
 * ring already exists (V1/V2: one ring per molecule) or `attachId` has no spare valence.
 */
export function attachRing(graph: MoleculeGraph, attachId: string, aromatic: boolean, size: RingSize = 6, drop?: { x: number; y: number }): MoleculeGraph {
  if (graph.rings.length > 0) return graph
  if (freeValence(graph, attachId) < 1) return graph
  const next = cloneGraph(graph)
  const from = next.atoms[attachId]
  const preferredDeg = preferredAngleFromDrop(next, attachId, drop)
  const dirRad = (pickNextAngle(next, attachId, preferredDeg) * Math.PI) / 180
  const centerX = from.x + 2 * UNIT * Math.cos(dirRad)
  const centerY = from.y + 2 * UNIT * Math.sin(dirRad)
  const baseAngle = dirRad + Math.PI // atoms[0] sits exactly one unit from `from`, facing back toward it

  const atoms: AtomNode[] = []
  for (let i = 0; i < size; i++) {
    const angle = baseAngle + ((2 * Math.PI) / size) * i
    atoms.push(addAtom(next, 'C', centerX + UNIT * Math.cos(angle), centerY + UNIT * Math.sin(angle)))
  }
  for (let i = 0; i < size; i++) {
    const order = aromatic && i % 2 === 0 ? 2 : 1
    addBond(next, atoms[i].id, atoms[(i + 1) % size].id, order)
  }
  next.rings.push({ id: `ring_${atoms[0].id}`, atomIds: atoms.map((a) => a.id), aromatic })
  addBond(next, attachId, atoms[0].id, 1)
  return fillImplicitHydrogens(next)
}

/**
 * Fuses a brand-new ring onto an EXISTING ring atom, sharing exactly that one atom (a spiro union —
 * e.g. spiro[3.3]heptane: two 4-membered rings sharing one carbon). `spiroAtomId` must already belong
 * to the molecule's one existing ring and have at least 2 free bonds (it's about to gain two more ring
 * bonds, to the new ring's two neighbors of the shared atom). No-ops (returns the input graph
 * unchanged) on any precondition failure — there is no second ring yet, or no spare valence — so
 * callers can detect a no-op by reference equality, same convention as every other editOp here.
 */
export function attachSpiroRing(graph: MoleculeGraph, spiroAtomId: string, size: RingSize, drop?: { x: number; y: number }): MoleculeGraph {
  if (graph.rings.length !== 1) return graph
  if (!graph.rings[0].atomIds.includes(spiroAtomId)) return graph
  if (freeValence(graph, spiroAtomId) < 2) return graph
  const next = cloneGraph(graph)
  const spiro = next.atoms[spiroAtomId]
  const preferredDeg = preferredAngleFromDrop(next, spiroAtomId, drop)
  const dirRad = (pickNextAngle(next, spiroAtomId, preferredDeg) * Math.PI) / 180
  const centerX = spiro.x + UNIT * Math.cos(dirRad)
  const centerY = spiro.y + UNIT * Math.sin(dirRad)

  // The spiro atom itself is one of the new ring's `size` members; the rest are brand new.
  const newAtoms: AtomNode[] = []
  for (let i = 1; i < size; i++) {
    const angle = dirRad + Math.PI + ((2 * Math.PI) / size) * i
    newAtoms.push(addAtom(next, 'C', centerX + UNIT * Math.cos(angle), centerY + UNIT * Math.sin(angle)))
  }
  const ringAtomIds = [spiroAtomId, ...newAtoms.map((a) => a.id)]
  for (let i = 0; i < size; i++) {
    addBond(next, ringAtomIds[i], ringAtomIds[(i + 1) % size], 1)
  }
  next.rings.push({ id: `ring_${newAtoms[0].id}`, atomIds: ringAtomIds, aromatic: false })
  return fillImplicitHydrogens(next)
}

/**
 * Fuses a brand-new ring onto an EXISTING ring bond, sharing that bond's two atoms as the new
 * bicyclic system's bridgeheads (ortho-fusion — e.g. two fused 6-membered rings = decalin,
 * bicyclo[4.4.0]decane). `sharedBondId` must be a bond inside the molecule's one existing ring; both
 * its endpoints need at least 1 free bond each (each bridgehead gains exactly one new ring bond, to
 * the new ring's path of fresh atoms). No-ops on any precondition failure.
 */
export function attachFusedRing(graph: MoleculeGraph, sharedBondId: string, size: RingSize): MoleculeGraph {
  if (graph.rings.length !== 1) return graph
  const bond = graph.bonds[sharedBondId]
  if (!bond) return graph
  const ring = graph.rings[0]
  if (!ring.atomIds.includes(bond.a) || !ring.atomIds.includes(bond.b)) return graph
  const p = bond.a
  const q = bond.b
  if (freeValence(graph, p) < 1 || freeValence(graph, q) < 1) return graph
  if (size < 3) return graph // smallest possible fused ring: 1 new atom bridging the two bridgeheads

  const next = cloneGraph(graph)
  const pAtom = next.atoms[p]
  const qAtom = next.atoms[q]
  const midX = (pAtom.x + qAtom.x) / 2
  const midY = (pAtom.y + qAtom.y) / 2
  // Outward direction: away from the existing ring's own center, so the new ring is drawn on the
  // opposite side of the shared edge rather than overlapping the first ring.
  const ringCenterX = ring.atomIds.reduce((s, id) => s + next.atoms[id].x, 0) / ring.atomIds.length
  const ringCenterY = ring.atomIds.reduce((s, id) => s + next.atoms[id].y, 0) / ring.atomIds.length
  const outAngle = Math.atan2(midY - ringCenterY, midX - ringCenterX)

  const pathCount = size - 2 // new atoms strictly between the two bridgeheads

  // Lay the new ring out as an actual regular polygon (p and q as two ADJACENT vertices of it), not
  // points along a shallow arc off the p-q baseline — a shallow arc visually flattens/distorts for
  // ring sizes beyond 4, making e.g. a real 5- or 6-membered second ring look like it has fewer sides
  // than it does (a real bug: the chemistry/name was always correct, only the drawing was misleading).
  const theta = (2 * Math.PI) / size
  const sideLen = Math.hypot(qAtom.x - pAtom.x, qAtom.y - pAtom.y) || UNIT
  const circumradius = sideLen / (2 * Math.sin(theta / 2))
  const apothem = circumradius * Math.cos(theta / 2)
  const centerX = midX + apothem * Math.cos(outAngle)
  const centerY = midY + apothem * Math.sin(outAngle)
  const angleToP = Math.atan2(pAtom.y - centerY, pAtom.x - centerX)
  const angleToQ = Math.atan2(qAtom.y - centerY, qAtom.x - centerX)
  let angleDiff = angleToQ - angleToP
  while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI
  while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI
  const dir = angleDiff > 0 ? 1 : -1 // rotational direction from p to q around the new ring's center

  const newAtoms: AtomNode[] = []
  // Step away from p, in the direction OPPOSITE q — i.e. the long way around the polygon — so
  // newAtoms[0] ends up adjacent to p and the last new atom ends up adjacent to q.
  for (let i = 1; i <= pathCount; i++) {
    const angle = angleToP - dir * theta * i
    newAtoms.push(addAtom(next, 'C', centerX + circumradius * Math.cos(angle), centerY + circumradius * Math.sin(angle)))
  }
  const path = [p, ...newAtoms.map((a) => a.id), q]
  for (let i = 0; i < path.length - 1; i++) addBond(next, path[i], path[i + 1], 1)
  next.rings.push({ id: `ring_${newAtoms[0]?.id ?? p}`, atomIds: path, aromatic: false })
  return fillImplicitHydrogens(next)
}

/** True if `bondId` connects two atoms of the same AROMATIC ring — these bonds are pure Kekule
 * bookkeeping (RULES.md), not independently editable: changing one to a different order without
 * touching the rest would corrupt the ring into something that isn't really benzene anymore (e.g. a
 * triple bond inside a six-membered "aromatic" ring) while the engine kept trusting the stale
 * `aromatic` flag and still calling it "benzene"/"phenyl" — a real bug found via fuzz testing. */
function isAromaticRingBond(graph: MoleculeGraph, bondId: string): boolean {
  const bond = graph.bonds[bondId]
  if (!bond) return false
  return graph.rings.some((ring) => ring.aromatic && ring.atomIds.includes(bond.a) && ring.atomIds.includes(bond.b))
}

/** Sets a bond directly to single/double/triple. No-ops if stepping up would exceed either atom's
 * valence, or if the bond belongs to an aromatic ring (see isAromaticRingBond). */
export function setBondOrder(graph: MoleculeGraph, bondId: string, order: 1 | 2 | 3): MoleculeGraph {
  const bond = graph.bonds[bondId]
  if (!bond || bond.order === order) return graph
  if (isAromaticRingBond(graph, bondId)) return graph
  const delta = order - bond.order
  if (delta > 0) {
    if (freeValence(graph, bond.a) < delta || freeValence(graph, bond.b) < delta) return graph
  }
  const next = cloneGraph(graph)
  next.bonds[bondId].order = order
  if (order !== 1) next.bonds[bondId].wedge = undefined // wedge/hash notation only ever applies to a single bond
  return fillImplicitHydrogens(next)
}

export interface BondCycleResult {
  graph: MoleculeGraph
  changed: boolean
  blockedReason?: string
}

/**
 * Clicking a bond cycles single -> double -> triple -> single, so students don't need to pick a
 * dedicated bond-order tool first. Stepping up to double/triple is rejected (graph unchanged,
 * blockedReason set) when either endpoint doesn't have enough free valence for the extra bond order,
 * or when the bond belongs to an aromatic ring (see isAromaticRingBond) — the ring's Kekule bonds
 * aren't meant to be edited one at a time.
 */
export function cycleBondOrder(graph: MoleculeGraph, bondId: string): BondCycleResult {
  const bond = graph.bonds[bondId]
  if (!bond) return { graph, changed: false }
  if (isAromaticRingBond(graph, bondId)) {
    return { graph, changed: false, blockedReason: "An aromatic ring's bonds can't be edited individually — erase the ring to start over." }
  }
  const nextOrder = bond.order === 1 ? 2 : bond.order === 2 ? 3 : 1
  const delta = nextOrder - bond.order
  if (delta > 0 && (freeValence(graph, bond.a) < delta || freeValence(graph, bond.b) < delta)) {
    return { graph, changed: false, blockedReason: "Valence doesn't allow another bond there — one of these atoms has no free bonds left." }
  }
  const next = cloneGraph(graph)
  next.bonds[bondId].order = nextOrder
  if (nextOrder !== 1) next.bonds[bondId].wedge = undefined
  return { graph: fillImplicitHydrogens(next), changed: true }
}

/**
 * Marks (or un-marks) a bond as wedge/hash stereo notation, narrow end at `fromAtomId` (the
 * stereocenter). Clicking the SAME bond+direction+endpoint again clears it back to a plain bond —
 * the toggle behavior every other tool in this editor already has. Only a single bond (order 1) can
 * carry this notation (a double/triple bond's geometry is already fully determined by the drawing
 * itself, never wedge-able) — returns the same graph, unchanged, if the bond's order isn't 1. Doesn't
 * validate that `fromAtomId` is actually a real stereocenter (4 different substituents) — that's the
 * naming engine's job (stereo.ts); a wedge on a non-stereocenter just never produces an R/S label.
 */
export function setBondWedge(graph: MoleculeGraph, bondId: string, fromAtomId: string, direction: 'up' | 'down'): MoleculeGraph {
  const bond = graph.bonds[bondId]
  if (!bond || bond.order !== 1) return graph
  if (bond.a !== fromAtomId && bond.b !== fromAtomId) return graph
  const next = cloneGraph(graph)
  const already = next.bonds[bondId].wedge
  next.bonds[bondId].wedge = already?.fromAtomId === fromAtomId && already.direction === direction ? undefined : { fromAtomId, direction }
  return next
}

/** Erases a leaf atom (degree <= 1) only — keeps the graph connected by construction instead of needing cascade-delete logic. */
export function eraseLeafAtom(graph: MoleculeGraph, atomId: string): MoleculeGraph {
  const degree = bondsOf(graph, atomId).length
  if (degree > 1) return graph
  if (graph.rings.some((ring) => ring.atomIds.includes(atomId))) return graph // ring atoms aren't leaves to erase individually
  const next = cloneGraph(graph)
  removeAtomFromGraph(next, atomId)
  return fillImplicitHydrogens(next)
}

export function bondAt(graph: MoleculeGraph, bondId: string): Bond | undefined {
  return graph.bonds[bondId]
}
