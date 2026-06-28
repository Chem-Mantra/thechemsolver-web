// R/S (tetrahedral) and E/Z (double-bond) stereodescriptor assignment — Blue Book P-92 (CIP rules)
// and P-93.1.2, restricted to what JEE Advanced actually asks for: "up to two stereocenters/double
// bonds" (see RULES.md §5). No isotopes, no phantom-atom edge cases beyond what double/triple bonds
// and ring closures need, no Fischer-projection-style inputs — only what the 2D skeletal editor (with
// the new wedge/hash bond tool) can actually draw.

import { MoleculeGraph, AtomNode, neighbors } from './model'

const ATOMIC_NUMBER: Record<string, number> = { H: 1, C: 6, N: 7, O: 8, F: 9, Cl: 17, Br: 35, I: 53 }

/** A node in the CIP hierarchical digraph rooted at one substituent of a stereocenter (or one side
 * of a double bond). `children` are this atom's own substituents (excluding the path back toward the
 * root), already including phantom duplicate atoms for any multiple bond and a phantom for each
 * implicit H — sorted descending by priority so two trees can be compared position-by-position. */
interface CipNode {
  atomicNum: number
  children: CipNode[]
}

const PHANTOM_NONE: CipNode = { atomicNum: 0, children: [] }

function buildCipTree(graph: MoleculeGraph, atomId: string, cameFromId: string | null, visited: Set<string>): CipNode {
  const atom = graph.atoms[atomId]
  if (visited.has(atomId)) {
    // Ring closure: CIP treats the revisited atom as a phantom duplicate (same atomic number, no
    // further children) rather than walking the cycle forever — a simplification of the full
    // hierarchical-digraph rule, but sufficient for the simple ring stereocenters this engine builds.
    return { atomicNum: ATOMIC_NUMBER[atom.element] ?? 0, children: [] }
  }
  const nextVisited = new Set(visited)
  nextVisited.add(atomId)
  const children: CipNode[] = []
  for (const { atom: nbr, bond } of neighbors(graph, atomId)) {
    if (nbr.id === cameFromId) {
      // The bond back toward the root still contributes phantom duplicates if it's a double/triple
      // bond (e.g. the carbonyl carbon's own root atom needs a phantom O duplicate for the O it just
      // came from) — just not a real walked-into child (that would loop back to the root).
      for (let extra = 1; extra < bond.order; extra++) children.push({ atomicNum: ATOMIC_NUMBER[nbr.element] ?? 0, children: [] })
      continue
    }
    children.push(buildCipTree(graph, nbr.id, atomId, nextVisited))
    for (let extra = 1; extra < bond.order; extra++) children.push({ atomicNum: ATOMIC_NUMBER[nbr.element] ?? 0, children: [] })
  }
  for (let i = 0; i < atom.implicitHCount; i++) children.push({ atomicNum: 1, children: [] })
  children.sort(compareCipNode)
  return { atomicNum: ATOMIC_NUMBER[atom.element] ?? 0, children }
}

/** Descending priority order: higher atomic number first; ties broken by recursively comparing each
 * node's own (already-sorted) children list position by position, treating a missing child as a
 * phantom of atomic number 0 (lower priority than any real atom). */
function compareCipNode(a: CipNode, b: CipNode): number {
  if (a.atomicNum !== b.atomicNum) return b.atomicNum - a.atomicNum
  const n = Math.max(a.children.length, b.children.length)
  for (let i = 0; i < n; i++) {
    const cmp = compareCipNode(a.children[i] ?? PHANTOM_NONE, b.children[i] ?? PHANTOM_NONE)
    if (cmp !== 0) return cmp
  }
  return 0
}

export interface RankedSubstituent {
  /** The real atom id, or null for an implicit hydrogen (no atom of its own in the graph). */
  atomId: string | null
  rank: number // 1 = highest CIP priority
}

/** Ranks every substituent of `centerId` (its real neighbors, plus one implicit-H entry per
 * `implicitHCount`) by CIP priority — used for both R/S (3-4 substituents on an sp3 center) and E/Z
 * (the 1-2 substituents on each end of a double bond). Returns null if two substituents tie all the
 * way down (a genuine non-stereocenter, e.g. two identical ethyl groups) — Rule 5 (R precedes S)
 * tie-breaks for like/unlike descriptors aren't built, so a true tie is reported as "not assignable"
 * rather than guessed. */
export function rankSubstituents(graph: MoleculeGraph, centerId: string): RankedSubstituent[] | null {
  const atom = graph.atoms[centerId]
  const entries: { atomId: string | null; tree: CipNode }[] = []
  for (const { atom: nbr } of neighbors(graph, centerId)) {
    entries.push({ atomId: nbr.id, tree: buildCipTree(graph, nbr.id, centerId, new Set([centerId])) })
  }
  for (let i = 0; i < atom.implicitHCount; i++) entries.push({ atomId: null, tree: { atomicNum: 1, children: [] } })
  entries.sort((x, y) => compareCipNode(x.tree, y.tree))
  for (let i = 0; i < entries.length - 1; i++) {
    if (compareCipNode(entries[i].tree, entries[i + 1].tree) === 0) return null
  }
  return entries.map((e, i) => ({ atomId: e.atomId, rank: i + 1 }))
}

function atomXY(graph: MoleculeGraph, atomId: string | null, centerAtom: AtomNode): { x: number; y: number } {
  // An implicit H has no real (x,y) of its own — placed opposite the centroid of the other explicit
  // substituents, which is geometrically what "the H is wherever there's room" means in a skeletal
  // drawing. Only used for the in-plane (z=0) substituents' angular position, never for chirality
  // itself (which only needs each substituent's z sign, computed separately).
  if (atomId === null) return { x: centerAtom.x, y: centerAtom.y }
  return { x: graph.atoms[atomId].x, y: graph.atoms[atomId].y }
}

/**
 * R/S for one sp3 stereocenter. Requires exactly one of the center's bonds to carry wedge/hash
 * notation (set via the editor's wedge tool) — every other substituent is treated as in-plane (z=0),
 * and an implicit H (if the center has only 3 explicit neighbors) is placed on the OPPOSITE side of
 * the one explicit wedge/hash, the standard simple skeletal-formula convention. Returns null when:
 * the center doesn't have exactly 3 or 4 total substituents (not a real tetrahedral center), no
 * wedge/hash is set on any of its bonds (configuration genuinely unspecified — not an error, just
 * nothing to report), or `rankSubstituents` can't find 4 distinct priorities.
 */
export function assignRS(graph: MoleculeGraph, centerId: string): 'R' | 'S' | null {
  const center = graph.atoms[centerId]
  const nbrs = neighbors(graph, centerId)
  const totalSubstituents = nbrs.length + center.implicitHCount
  if (totalSubstituents !== 4) return null
  const wedgeBond = nbrs.find(({ bond }) => bond.wedge?.fromAtomId === centerId)?.bond
  if (!wedgeBond?.wedge) return null
  const wedgeAtomId = wedgeBond.a === centerId ? wedgeBond.b : wedgeBond.a
  const wedgeZ = wedgeBond.wedge.direction === 'up' ? 1 : -1

  const ranked = rankSubstituents(graph, centerId)
  if (!ranked) return null

  const withZ = ranked.map((r) => {
    if (r.atomId === wedgeAtomId) return { ...r, z: wedgeZ }
    if (r.atomId === null) return { ...r, z: -wedgeZ } // implicit H opposite the one explicit wedge/hash
    return { ...r, z: 0 }
  })
  // If there are 4 EXPLICIT substituents (no implicit H) and only one carries wedge/hash, the other
  // three are all treated as in-plane (z=0) — a common simplified-but-standard zig-zag depiction.
  // Geometrically under-determined in full rigor, but sufficient for the simple, single-wedge drawings
  // this editor produces (never two independent wedges on one center).

  const positions = withZ.map((r) => {
    const { x, y } = atomXY(graph, r.atomId, center)
    return { rank: r.rank, x: x - center.x, y: y - center.y, z: r.z }
  })
  const byRank = (n: number) => positions.find((p) => p.rank === n)!
  const p1 = byRank(1)
  const p2 = byRank(2)
  const p3 = byRank(3)
  const p4 = byRank(4)

  // Standard CIP visualization: view from the side OPPOSITE the lowest-priority (rank 4) substituent,
  // then read whether 1->2->3 goes clockwise (R) or counterclockwise (S). Implemented as the sign of
  // the scalar triple product of (p1-p4, p2-p4, p3-p4) — calibrated against OPSIN-verified (R)/(S)
  // examples (see goldenNames.test.ts's V23 block) rather than derived from first principles, since
  // the screen/model y-axis points DOWN (SVG convention), which flips handedness versus the usual
  // math convention and is easy to get backwards by reasoning alone.
  const ax = p1.x - p4.x,
    ay = p1.y - p4.y,
    az = p1.z - p4.z
  const bx = p2.x - p4.x,
    by = p2.y - p4.y,
    bz = p2.z - p4.z
  const cx = p3.x - p4.x,
    cy = p3.y - p4.y,
    cz = p3.z - p4.z
  // Triple product a . (b x c) — sign-calibrated against a hand-derived (R)-CHFClBr example (see
  // stereo.test.ts) rather than derived from first principles, since the model/SVG y-axis points
  // DOWN (screen convention), which flips handedness versus the usual math convention and is easy to
  // get backwards by reasoning alone. Positive -> R, negative -> S.
  const cross = { x: by * cz - bz * cy, y: bz * cx - bx * cz, z: bx * cy - by * cx }
  const triple = ax * cross.x + ay * cross.y + az * cross.z
  return triple > 0 ? 'R' : 'S'
}

/** Every sp3 atom in the graph that has a wedge/hash bond AND resolves to a real R/S assignment —
 * the set of stereocenters this molecule actually specifies a configuration for. */
export function findAssignedStereocenters(graph: MoleculeGraph): { atomId: string; descriptor: 'R' | 'S' }[] {
  const out: { atomId: string; descriptor: 'R' | 'S' }[] = []
  for (const atom of Object.values(graph.atoms)) {
    if (atom.element !== 'C') continue
    const descriptor = assignRS(graph, atom.id)
    if (descriptor) out.push({ atomId: atom.id, descriptor })
  }
  return out
}

/** True when `aId`-`bId` is an edge of some ring in the graph (both atoms in that ring's `atomIds`
 * AND adjacent in its cycle order) — `Bond.inRing` is never actually populated (dead field), so this
 * checks `graph.rings` directly instead. */
function isRingEdge(graph: MoleculeGraph, aId: string, bId: string): boolean {
  return graph.rings.some((ring) => {
    const n = ring.atomIds.length
    const ia = ring.atomIds.indexOf(aId)
    if (ia === -1) return false
    return ring.atomIds[(ia + 1) % n] === bId || ring.atomIds[(ia - 1 + n) % n] === bId
  })
}

/**
 * E/Z for one C=C double bond. Ranks the (up to 2) substituents on each carbon by CIP priority, then
 * uses the existing 2D geometry directly — a double bond's substituents are coplanar by construction
 * (no bond rotation), so "same side"/"opposite side" is already fully determined by where the editor
 * placed them, no wedge notation needed. Returns null when either carbon doesn't have exactly 2 total
 * substituents besides its double-bond partner (i.e. isn't a stereogenic center: a terminal =CH2, or
 * two identical substituents on one side), or when the bond is ENDOCYCLIC (both atoms adjacent within
 * the same ring) — every ring size this engine supports (3-6 membered) physically can't hold a trans
 * double bond at all (real trans-cycloalkenes need an 8+ membered ring to exist), so E/Z simply isn't
 * a real choice there; found via fuzz testing, which surfaced nonsense like "(1Z)-cyclohexene" before
 * this check existed.
 */
export function assignEZ(graph: MoleculeGraph, carbonAId: string, carbonBId: string): 'E' | 'Z' | null {
  if (isRingEdge(graph, carbonAId, carbonBId)) return null
  const a = graph.atoms[carbonAId]
  const b = graph.atoms[carbonBId]
  const aSubs = neighbors(graph, carbonAId).filter((n) => n.atom.id !== carbonBId)
  const bSubs = neighbors(graph, carbonBId).filter((n) => n.atom.id !== carbonAId)
  if (aSubs.length + a.implicitHCount !== 2 || bSubs.length + b.implicitHCount !== 2) return null

  const rankedA = rankSubstituents(graph, carbonAId)
  const rankedB = rankSubstituents(graph, carbonBId)
  if (!rankedA || !rankedB) return null
  // rankSubstituents includes the double-bond partner itself as a "substituent" of each carbon — for
  // E/Z we only care about the OTHER two substituents on each side, so the partner's own rank is
  // irrelevant; just pick whichever of the two non-partner entries ranks higher.
  const highA = rankedA.filter((r) => r.atomId !== carbonBId).sort((x, y) => x.rank - y.rank)[0]
  const highB = rankedB.filter((r) => r.atomId !== carbonAId).sort((x, y) => x.rank - y.rank)[0]

  // Double-bond axis direction; "side" is the sign of the cross product of the axis with the vector
  // to each high-priority substituent (using an implicit H's position as directly opposite the OTHER
  // explicit substituent on that same carbon, mirroring how a real 2D skeletal drawing places it).
  const axis = { x: b.x - a.x, y: b.y - a.y }
  function sideOf(carbon: AtomNode, subAtomId: string | null, otherSubAtomId: string | null): number {
    let px: number, py: number
    if (subAtomId !== null) {
      px = graph.atoms[subAtomId].x - carbon.x
      py = graph.atoms[subAtomId].y - carbon.y
    } else {
      // Implicit H: place opposite whichever explicit substituent is on this same carbon.
      const other = otherSubAtomId !== null ? graph.atoms[otherSubAtomId] : null
      px = other ? -(other.x - carbon.x) : 0
      py = other ? -(other.y - carbon.y) : 0
    }
    const cross = axis.x * py - axis.y * px
    // A substituent drawn (anywhere close to) exactly ON the double-bond axis — e.g. a single bond
    // continuing in a perfectly straight line into the C=C, found via fuzz testing — has no real
    // "side" at all; floating-point noise would otherwise still confidently sign() a near-zero cross
    // product into a definite ±1 and assert a wrong-by-luck E/Z. Normalizing by the vector lengths
    // (this is sin of the angle between them) makes the threshold meaningful regardless of bond length.
    const len = Math.hypot(axis.x, axis.y) * Math.hypot(px, py)
    if (len === 0 || Math.abs(cross) / len < 0.05) return 0
    return Math.sign(cross)
  }
  // A real sp2 carbon's bond directions (double bond + its other 1-2 substituents) must be spread
  // around MORE than a half-plane — if they all fit within some 180-degree arc, no single substituent
  // has a well-defined "side" at all, and the cross-product test below would be reading noise off a
  // depiction that couldn't represent a real trigonal-planar atom. (The earlier, narrower attempt at
  // this check — requiring the two NON-double-bond substituents to straddle the axis — was too strict
  // and rejected perfectly normal hex-grid-drawn shapes, e.g. 2-chlorobut-2-ene, where the low-priority
  // methyl legitimately ends up collinear with the C=C axis while the chlorine itself is unambiguous.)
  function hasValidSpread(carbon: AtomNode, towardPartner: { x: number; y: number }, subIds: string[]): boolean {
    // Only meaningful with BOTH non-partner substituents explicitly drawn (3 real directions total —
    // axis + 2 substituents). With just 1 explicit substituent (+ implicit H), any angle away from the
    // axis is a perfectly fine depiction — 2 directions split the circle into 2 arcs that always sum to
    // 360, so one is trivially >=180 by construction; that's not a real degeneracy, just arithmetic.
    if (subIds.length !== 2) return true
    const dirs = [towardPartner, ...subIds.map((id) => ({ x: graph.atoms[id].x - carbon.x, y: graph.atoms[id].y - carbon.y }))]
    const angles = dirs.map((v) => Math.atan2(v.y, v.x)).sort((x, y) => x - y)
    for (let i = 0; i < angles.length; i++) {
      const next = i + 1 < angles.length ? angles[i + 1] : angles[0] + 2 * Math.PI
      if (next - angles[i] >= Math.PI - 1e-9) return false
    }
    return true
  }
  if (
    !hasValidSpread(a, axis, aSubs.map((n) => n.atom.id)) ||
    !hasValidSpread(b, { x: -axis.x, y: -axis.y }, bSubs.map((n) => n.atom.id))
  )
    return null

  const otherA = aSubs.find((n) => n.atom.id !== highA.atomId)?.atom.id ?? null
  const otherB = bSubs.find((n) => n.atom.id !== highB.atomId)?.atom.id ?? null
  const sideA = sideOf(a, highA.atomId, otherA)
  const sideB = sideOf(b, highB.atomId, otherB)
  if (sideA === 0 || sideB === 0) return null
  // Same side (cis-like for the two HIGH-priority groups) -> Z ("zusammen"); opposite -> E ("entgegen").
  return sideA === sideB ? 'Z' : 'E'
}

/**
 * Builds the leading "(2R,3E)-"-style stereodescriptor block for a numbered chain or ring —
 * `orderedAtomIds` is the locant-ordered atom list (index 0 = locant 1) already chosen by the normal
 * numbering rules; `doubleLocants` is the SAME list `numbering.ts`/`ringNaming.ts` already compute
 * (the lower-numbered atom of each double bond). Descriptors are always locant-prefixed (even when
 * there's only one) and sorted together by locant in one shared parenthetical, comma-separated —
 * verified against OPSIN: "(2R,3E)-..." parses identically to two separate parenthetical blocks, and
 * an explicit locant on a sole descriptor round-trips the same as an omitted one. Returns '' (no
 * leading "-") when nothing in this molecule has an assignable configuration — most molecules, since a
 * stereocenter/stereogenic double bond needs an explicit wedge/hash (R/S) or just doesn't tie (E/Z) to
 * get a descriptor at all; this is never an error, just nothing to report.
 */
export function buildStereoPrefix(graph: MoleculeGraph, orderedAtomIds: string[], doubleLocants: number[]): string {
  const entries: { locant: number; descriptor: string }[] = []
  orderedAtomIds.forEach((atomId, idx) => {
    const rs = assignRS(graph, atomId)
    if (rs) entries.push({ locant: idx + 1, descriptor: rs })
  })
  for (const locant of doubleLocants) {
    const ez = assignEZ(graph, orderedAtomIds[locant - 1], orderedAtomIds[locant])
    if (ez) entries.push({ locant, descriptor: ez })
  }
  if (entries.length === 0) return ''
  entries.sort((a, b) => a.locant - b.locant)
  return `(${entries.map((e) => `${e.locant}${e.descriptor}`).join(',')})-`
}

function describeSubstituent(graph: MoleculeGraph, atomId: string | null): string {
  if (atomId === null) return 'H'
  return graph.atoms[atomId].element
}

function explainOneStereocenter(graph: MoleculeGraph, centerId: string, locant: number, descriptor: 'R' | 'S'): string {
  const ranked = rankSubstituents(graph, centerId)!
  const labels = ranked.map((r) => describeSubstituent(graph, r.atomId))
  // A tie at the directly-attached atom (e.g. two carbon branches) is genuinely resolved by CIP's
  // "explore outward until a difference appears" rule, not shown here — flagged honestly rather than
  // pretending the immediate-atom element alone decided it.
  const tieNote = labels.some((l, i) => i > 0 && l === labels[i - 1])
    ? ' (where two groups share the same directly-attached atom, the tie was broken by looking further out along that branch).'
    : '.'
  return (
    `Stereocenter at C${locant}: its four attached groups rank ${labels[0]} (1st) > ${labels[1]} (2nd) > ` +
    `${labels[2]} (3rd) > ${labels[3]} (4th) by CIP priority${tieNote} Viewed from the side opposite the ` +
    `lowest-priority group (${labels[3]}), priority 1→2→3 runs ${descriptor === 'R' ? 'clockwise' : 'counterclockwise'}, ` +
    `so C${locant} is (${descriptor}).`
  )
}

function explainOneDoubleBond(graph: MoleculeGraph, aId: string, bId: string, locantA: number, locantB: number, descriptor: 'E' | 'Z'): string {
  const rankedA = rankSubstituents(graph, aId)!
    .filter((r) => r.atomId !== bId)
    .sort((x, y) => x.rank - y.rank)
  const rankedB = rankSubstituents(graph, bId)!
    .filter((r) => r.atomId !== aId)
    .sort((x, y) => x.rank - y.rank)
  const highA = describeSubstituent(graph, rankedA[0].atomId)
  const lowA = describeSubstituent(graph, rankedA[1].atomId)
  const highB = describeSubstituent(graph, rankedB[0].atomId)
  const lowB = describeSubstituent(graph, rankedB[1].atomId)
  return (
    `Double bond C${locantA}=C${locantB}: at C${locantA}, ${highA} outranks ${lowA}; at C${locantB}, ${highB} outranks ${lowB}. ` +
    `The two higher-priority groups (${highA} at C${locantA}, ${highB} at C${locantB}) are on the ` +
    `${descriptor === 'Z' ? 'same side, so this bond is (Z)' : 'opposite sides, so this bond is (E)'}.`
  )
}

/** Same shape of loop as `buildStereoPrefix` (deliberately — keeps the explanation text and the actual
 * descriptor block guaranteed in sync), but returns one human-readable sentence per assigned
 * stereocenter/double bond instead of building the "(2R,3E)-" prefix string. Empty array when nothing
 * in this molecule has an assignable configuration. */
export function explainStereoDescriptors(graph: MoleculeGraph, orderedAtomIds: string[], doubleLocants: number[]): string[] {
  const out: { locant: number; text: string }[] = []
  orderedAtomIds.forEach((atomId, idx) => {
    const rs = assignRS(graph, atomId)
    if (rs) out.push({ locant: idx + 1, text: explainOneStereocenter(graph, atomId, idx + 1, rs) })
  })
  for (const locant of doubleLocants) {
    const aId = orderedAtomIds[locant - 1]
    const bId = orderedAtomIds[locant]
    const ez = assignEZ(graph, aId, bId)
    if (ez) out.push({ locant, text: explainOneDoubleBond(graph, aId, bId, locant, locant + 1, ez) })
  }
  out.sort((a, b) => a.locant - b.locant)
  return out.map((o) => o.text)
}

/** Every C=C double bond in the graph that resolves to a real E/Z assignment. */
export function findAssignedDoubleBonds(graph: MoleculeGraph): { atomAId: string; atomBId: string; descriptor: 'E' | 'Z' }[] {
  const out: { atomAId: string; atomBId: string; descriptor: 'E' | 'Z' }[] = []
  for (const bond of Object.values(graph.bonds)) {
    if (bond.order !== 2) continue
    const a = graph.atoms[bond.a]
    const b = graph.atoms[bond.b]
    if (a.element !== 'C' || b.element !== 'C') continue
    const descriptor = assignEZ(graph, bond.a, bond.b)
    if (descriptor) out.push({ atomAId: bond.a, atomBId: bond.b, descriptor })
  }
  return out
}
