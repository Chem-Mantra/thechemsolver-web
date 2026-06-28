// Converts the live 3D projection-formula state into a synthetic 2D MoleculeGraph (the SAME model
// src/lib/nomenclature/ already uses) so the entire existing naming/stereo pipeline — nameMolecule,
// assignRS, explainStereoDescriptors — can be reused completely unchanged. The only genuinely new
// logic in this whole lab lives here: turning a true 3D tetrahedral arrangement into a 2D-plus-one-
// wedge-bond drawing that's chirality-EQUIVALENT to it, so `nameMolecule()` reports the same R/S the
// real 3D model has.
import * as THREE from 'three'
import { MoleculeGraph, createEmptyGraph, addAtom, addBond, bondBetween } from '../nomenclature/model'
import { attachSubstituent, setBondWedge } from '../nomenclature/editOps'
import { rankSubstituents, assignRS } from '../nomenclature/stereo'
import { symmetricTetrahedralDirections, tripodDirections, signedVolume } from './geometry'
import { ProjectionState, AssignedGroup } from './state'

const BOND_LENGTH = 1 // model units — same convention editOps.ts's own UNIT uses internally

/**
 * Rigidly rotates `directions` (always exactly 4) so `directions[hashIndex]` points to (0,0,-1)
 * ("straight back, hash bond"), then returns the OTHER 3 directions' resulting (x,y) — a rigid
 * rotation never changes chirality, and dropping z after isolating one vertex along the view axis
 * gives those 3 a correct, non-degenerate in-plane arrangement (same approximation
 * src/lib/nomenclature/stereo.ts's own assignRS already makes for every non-wedge substituent: treat
 * it as flat, z=0).
 *
 * The hash slot itself is NOT given its own (degenerate, ≈(0,0) by construction) projection — instead
 * it's placed opposite the other 3's combined direction, wherever a 4th tetrahedral bond visually
 * belongs once the other 3 are drawn spread out (the wedge/hash flag, not the exact on-screen angle,
 * carries the depth information — same simplification a hand-drawn skeletal structure uses).
 *
 * This 2D approximation is only EXPECTED to be chirality-correct, not provably so for every rotation —
 * `correctWedgeIfNeeded` below is the actual guarantee, by cross-checking against the true 3D vectors
 * directly and flipping the wedge if the approximation got it backwards for this particular geometry.
 */
function embedAsWedgeDash(directions: THREE.Vector3[], hashIndex: number): { x: number; y: number }[] {
  const target = new THREE.Vector3(0, 0, -1)
  const q = new THREE.Quaternion().setFromUnitVectors(directions[hashIndex].clone().normalize(), target)
  const positions = directions.map((d) => {
    const rotated = d.clone().applyQuaternion(q)
    return { x: rotated.x, y: rotated.y }
  })
  const sum = positions.reduce(
    (acc, p, i) => (i === hashIndex ? acc : { x: acc.x + p.x, y: acc.y + p.y }),
    { x: 0, y: 0 }
  )
  const mag = Math.hypot(sum.x, sum.y) || 1
  positions[hashIndex] = { x: (-sum.x / mag) * BOND_LENGTH, y: (-sum.y / mag) * BOND_LENGTH }
  return positions
}

/**
 * The ONE ground-truth check for this whole module: ranks `centerId`'s real substituents by CIP
 * priority (graph-structure-based, so this is exactly as trustworthy as the rest of the nomenclature
 * engine), looks up each ranked substituent's TRUE 3D direction (via `directionByAtomId`, `undefined`
 * key standing in for an implicit H's slot), and computes the scalar triple product directly from
 * those — no 2D approximation involved at all. If `assignRS`'s answer on the embedded graph disagrees
 * with this, the embedding's wedge was a coin-flip away from being a faithful depiction (see
 * `embedAsWedgeDash`'s doc comment) and gets flipped to the other one, which exactly inverts
 * `assignRS`'s reported descriptor (verified in toMoleculeGraph.test.ts) — guaranteeing the FINAL
 * result always matches the true 3D arrangement, regardless of any per-rotation embedding quirk.
 * Sign convention (positive triple product => 'R') calibrated against the OPSIN-validated
 * (2R)-2-chlorobutane wedge example in goldenNames.test.ts — see toMoleculeGraph.test.ts.
 */
function correctWedgeIfNeeded(graph: MoleculeGraph, centerId: string, directionByAtomId: Map<string | null, THREE.Vector3>): MoleculeGraph {
  const reported = assignRS(graph, centerId)
  if (!reported) return graph
  const ranked = rankSubstituents(graph, centerId)
  if (!ranked) return graph
  const dirs = ranked.map((r) => directionByAtomId.get(r.atomId))
  if (dirs.some((d) => !d)) return graph
  const [d1, d2, d3, d4] = dirs as THREE.Vector3[]
  const trueSign = Math.sign(signedVolume(d1.clone().sub(d4), d2.clone().sub(d4), d3.clone().sub(d4)))
  const expected = trueSign > 0 ? 'R' : 'S'
  if (reported === expected) return graph
  const wedgeBond = Object.values(graph.bonds).find((b) => b.wedge?.fromAtomId === centerId)
  if (!wedgeBond?.wedge) return graph
  return setBondWedge(graph, wedgeBond.id, centerId, wedgeBond.wedge.direction === 'up' ? 'down' : 'up')
}

/**
 * Attaches one center's substituents at the given 4 directions. `groups[i]` is `undefined` either for
 * a plain implicit-H slot, or (2-carbon mode) for the slot already occupied by the real bonded
 * neighbor carbon — `realSlot(i)` distinguishes the two so the wedge/hash flag always lands on an
 * ACTUAL bond: it's picked as the highest-index slot that's either an assigned group or the
 * already-bonded neighbor, never an implicit H (which has no bond of its own to flag).
 *
 * `externalSlotIndex(i)` converts this function's own loop index `i` (which always runs over all 4
 * directions, including the bond-to-other-carbon slot in 2-carbon mode) back to the index into the
 * caller's REAL `groupsA`/`groupsB`/`groups` state array — 1-carbon mode passes `i` through unchanged
 * (no offset, `state.groups` IS the 4-element array), but 2-carbon mode passes `[undefined,
 * ...state.groupsA]` (a synthetic 4th leading slot for the backbone bond) so `i - 1` is the real
 * index. Recording the wrong one here was a real bug: clicking a Fischer/3D slot wrote the resulting
 * `slotIndex` straight into `groupsA[slotIndex] = kind` in page.tsx, so an off-by-one silently grew
 * `groupsA` past its 3 real elements (e.g. writing index 3 of a 3-element array) — which then crashed
 * downstream as a `positions[i]` out-of-bounds the NEXT time the now-corrupted, too-long array got
 * re-expanded with the leading placeholder. Always verify slot-index plumbing end-to-end (state
 * write → re-read) rather than assuming a loop index lines up with caller-array indices for free.
 */
function attachGroupsAtDirections(
  graph: MoleculeGraph,
  centerId: string,
  directions: THREE.Vector3[],
  groups: readonly AssignedGroup[],
  realSlot: (i: number) => boolean,
  externalSlotIndex: (i: number) => number
): {
  graph: MoleculeGraph
  directionByAtomId: Map<string | null, THREE.Vector3>
  labelByAtomId: Map<string | null, string>
  slotIndexByAtomId: Map<string | null, number>
} {
  const center = graph.atoms[centerId]
  const directionByAtomId = new Map<string | null, THREE.Vector3>()
  const labelByAtomId = new Map<string | null, string>()
  const slotIndexByAtomId = new Map<string | null, number>()
  let hashIndex = -1
  for (let i = directions.length - 1; i >= 0; i--) {
    if (realSlot(i)) {
      hashIndex = i
      break
    }
  }
  if (hashIndex === -1) return { graph, directionByAtomId, labelByAtomId, slotIndexByAtomId }
  const positions = embedAsWedgeDash(directions, hashIndex)
  let g = graph
  groups.forEach((kind, i) => {
    if (!kind) {
      if (!realSlot(i)) {
        directionByAtomId.set(null, directions[i]) // implicit H's slot
        labelByAtomId.set(null, 'H')
        slotIndexByAtomId.set(null, externalSlotIndex(i))
      }
      return
    }
    const pos = positions[i]
    const before = new Set(Object.keys(g.atoms))
    g = attachSubstituent(g, centerId, kind, { x: center.x + pos.x, y: center.y + pos.y })
    const newAtomId = Object.keys(g.atoms).find((id) => !before.has(id) && bondBetween(g, centerId, id))
    if (newAtomId) {
      directionByAtomId.set(newAtomId, directions[i])
      labelByAtomId.set(newAtomId, kind)
      slotIndexByAtomId.set(newAtomId, externalSlotIndex(i))
      if (i === hashIndex) {
        const bond = bondBetween(g, centerId, newAtomId)!
        g = setBondWedge(g, bond.id, centerId, 'down')
      }
    }
  })
  return { graph: g, directionByAtomId, labelByAtomId, slotIndexByAtomId }
}

/** One center's substituents in CIP-priority order (rank1 = highest), each with its display label
 * ('H' for the implicit slot) and `slotIndex` — the index into that center's own `groups` array this
 * substituent came from (`null` for the bond to the OTHER carbon in 2-carbon mode, which isn't a
 * swappable palette slot at all) — exactly what Fischer/sawhorse/Newman layouts need to decide which
 * group goes where, AND what the Fischer panel's click-to-swap needs to map a clicked label back to
 * the same `groupsA`/`groupsB`/`groups` state the 3D view's swap already operates on. */
export interface CenterRankInfo {
  centerId: string
  ranked: { label: string; atomId: string | null; slotIndex: number | null }[]
}

export interface ProjectionGraph {
  graph: MoleculeGraph
  centerIds: string[]
  centerInfo: CenterRankInfo[]
}

function buildCenterInfo(
  graph: MoleculeGraph,
  centerId: string,
  labelByAtomId: Map<string | null, string>,
  slotIndexByAtomId: Map<string | null, number>
): CenterRankInfo {
  const ranked = rankSubstituents(graph, centerId) ?? []
  return {
    centerId,
    ranked: ranked.map((r) => ({
      label: labelByAtomId.get(r.atomId) ?? '?',
      atomId: r.atomId,
      slotIndex: slotIndexByAtomId.get(r.atomId) ?? null,
    })),
  }
}

/** Splits a center's CIP-ranked substituents into the 3 "visible arm" ranks (indexed by `slotIndex`
 * 0/1/2, the same 3 slots Newman/Sawhorse draw as a Y) and the rank of the 4th substituent — the bond
 * to the OTHER carbon, drawn as the trunk/axis line itself rather than an arm. Returns `slotRanks: []`
 * (and `axisRank: undefined`) when the center isn't a real stereocenter (`ranked` empty, e.g. 2
 * implicit hydrogens tie) — there's no priority order to show. */
export interface AxisCenterRanks {
  /** `slotRanks[i]` is groups-array slot `i`'s CIP rank (1 = highest), or `undefined` if not a real
   * stereocenter. */
  slotRanks: (1 | 2 | 3 | 4 | undefined)[]
  /** CIP rank of the bond to the other carbon (the Newman/Sawhorse axis), or `undefined` likewise. */
  axisRank: 1 | 2 | 3 | 4 | undefined
}

export function axisCenterRanks(info: CenterRankInfo | undefined, slotCount: number): AxisCenterRanks {
  const slotRanks: (1 | 2 | 3 | 4 | undefined)[] = new Array(slotCount).fill(undefined)
  if (!info || info.ranked.length === 0) return { slotRanks, axisRank: undefined }
  let axisRank: 1 | 2 | 3 | 4 | undefined
  info.ranked.forEach((r, i) => {
    const rank = (i + 1) as 1 | 2 | 3 | 4
    if (r.slotIndex === null) axisRank = rank
    else slotRanks[r.slotIndex] = rank
  })
  return { slotRanks, axisRank }
}

export function toMoleculeGraph(state: ProjectionState): ProjectionGraph {
  let graph = createEmptyGraph()
  if (state.mode === 'one-carbon') {
    const center = addAtom(graph, 'C', 0, 0)
    const directions = symmetricTetrahedralDirections()
    const attached = attachGroupsAtDirections(graph, center.id, directions, state.groups, (i) => !!state.groups[i], (i) => i)
    graph = correctWedgeIfNeeded(attached.graph, center.id, attached.directionByAtomId)
    return {
      graph,
      centerIds: [center.id],
      centerInfo: [buildCenterInfo(graph, center.id, attached.labelByAtomId, attached.slotIndexByAtomId)],
    }
  }

  // Two-carbon: one abstract global bond axis (arbitrary — only the RELATIVE angle to it matters).
  const bondAxis = new THREE.Vector3(1, 0, 0)
  const a = addAtom(graph, 'C', 0, 0)

  // Carbon A: directions = [bondToB, satA0, satA1, satA2] (azimuth reference 0, the fixed center).
  const dirsA = [bondAxis, ...tripodDirections(bondAxis, 0)]
  const posA = embedAsWedgeDash(dirsA, 3)
  const bToBDir = new THREE.Vector2(posA[0].x, posA[0].y).normalize()
  const b = addAtom(graph, 'C', a.x + bToBDir.x * BOND_LENGTH, a.y + bToBDir.y * BOND_LENGTH)
  addBond(graph, a.id, b.id, 1)
  const attachedA = attachGroupsAtDirections(graph, a.id, dirsA, [undefined, ...state.groupsA], (i) => i === 0 || !!state.groupsA[i - 1], (i) => i - 1)
  attachedA.directionByAtomId.set(b.id, dirsA[0])
  attachedA.labelByAtomId.set(b.id, 'C')
  graph = correctWedgeIfNeeded(attachedA.graph, a.id, attachedA.directionByAtomId)

  // Carbon B: directions = [bondToA, satB0, satB1, satB2] (azimuth offset = the live dihedral).
  const dirsB = [bondAxis.clone().negate(), ...tripodDirections(bondAxis.clone().negate(), state.dihedralRad)]
  const attachedB = attachGroupsAtDirections(graph, b.id, dirsB, [undefined, ...state.groupsB], (i) => i === 0 || !!state.groupsB[i - 1], (i) => i - 1)
  attachedB.directionByAtomId.set(a.id, dirsB[0])
  attachedB.labelByAtomId.set(a.id, 'C')
  graph = correctWedgeIfNeeded(attachedB.graph, b.id, attachedB.directionByAtomId)

  return {
    graph,
    centerIds: [a.id, b.id],
    centerInfo: [
      buildCenterInfo(graph, a.id, attachedA.labelByAtomId, attachedA.slotIndexByAtomId),
      buildCenterInfo(graph, b.id, attachedB.labelByAtomId, attachedB.slotIndexByAtomId),
    ],
  }
}
