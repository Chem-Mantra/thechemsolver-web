// Fischer projection: a cross with the convention "horizontal bonds point toward the viewer,
// vertical bonds point away" — purely a CONFIGURATION depiction (no conformation/dihedral info at
// all, unlike sawhorse/Newman), which is exactly why it's independent of `dihedralRad`.
import * as THREE from 'three'
import { MoleculeGraph } from '../nomenclature/model'
import { assignRS } from '../nomenclature/stereo'
import { analyzeGroups } from '../nomenclature/principalGroup'
import { CenterRankInfo } from './toMoleculeGraph'
import { signedVolume } from './geometry'

export type FischerPos = 'top' | 'bottom' | 'left' | 'right'

/** `slotIndex` is `null` for a position that isn't a swappable palette group at all — the implicit
 * H... no, H IS swappable (it's just whichever slot is currently unassigned) — `null` only for the
 * forced inter-carbon bond position in the 2-carbon ladder layout, which is a real chemical bond, not
 * a palette slot. `rank` is this substituent's CIP priority (1 = highest) — exposed so the "Show CIP
 * ranking" overlay can color-code positions and draw the rank1→rank2→rank3 arrow without redoing CIP
 * ranking itself. */
export interface FischerEntry {
  label: string
  slotIndex: number | null
  rank: 1 | 2 | 3 | 4
}

export interface FischerCross {
  top: FischerEntry
  bottom: FischerEntry
  left: FischerEntry
  right: FischerEntry
}

const ALL_POSITIONS: FischerPos[] = ['top', 'bottom', 'left', 'right']

export interface CipReadingInfo {
  /** Where the lowest-priority (rank 4) substituent sits. */
  rank4Pos: FischerPos
  /** True when rank 4 is on a vertical (away-from-viewer) bond — the position CIP's own rule actually
   * wants it in, so the rank1→rank2→rank3 sweep can be read DIRECTLY off the page. False when rank 4
   * is horizontal (toward viewer) — direct reading gives the WRONG answer; the apparent sweep
   * direction must be reversed to get the true configuration. */
  rank4IsVertical: boolean
  /** Positions of rank 1, rank 2, rank 3 in that order — what the "show CIP ranking" arrow connects. */
  orderedPositions: [FischerPos, FischerPos, FischerPos]
}

/** Pure positional facts about a cross's CIP-rank layout — no rendering, just which position holds
 * which rank and whether direct reading is valid. Used by the "Show CIP ranking" overlay (draws the
 * 1→2→3 arrow and the direct-read/flip explanation) on the Fischer panel. */
export function cipReadingInfo(cross: FischerCross): CipReadingInfo {
  const byRank = new Map<number, FischerPos>()
  for (const pos of ALL_POSITIONS) byRank.set(cross[pos].rank, pos)
  const rank4Pos = byRank.get(4)!
  return {
    rank4Pos,
    rank4IsVertical: rank4Pos === 'top' || rank4Pos === 'bottom',
    orderedPositions: [byRank.get(1)!, byRank.get(2)!, byRank.get(3)!],
  }
}

const FISCHER_POINT: Record<FischerPos, THREE.Vector3> = {
  top: new THREE.Vector3(0, -1, -1),
  bottom: new THREE.Vector3(0, 1, -1),
  left: new THREE.Vector3(-1, 0, 1),
  right: new THREE.Vector3(1, 0, 1),
}

/** True R/S depicted by placing CIP rank1..rank4 at the 4 given positions (horizontal = toward
 * viewer/+z, vertical = away/-z; model convention: y increases downward) — computed directly via
 * geometry.ts's signedVolume, the same scalar-triple-product primitive `correctWedgeIfNeeded` in
 * toMoleculeGraph.ts uses, under the same "positive triple => R" calibration (itself calibrated
 * against the OPSIN-validated (2R)-2-chlorobutane example — see toMoleculeGraph.test.ts). */
function trueRSForPositions(positionsByRank: [FischerPos, FischerPos, FischerPos, FischerPos]): 'R' | 'S' {
  const [p1, p2, p3, p4] = positionsByRank.map((pos) => FISCHER_POINT[pos])
  const triple = signedVolume(p1.clone().sub(p4), p2.clone().sub(p4), p3.clone().sub(p4))
  return triple > 0 ? 'R' : 'S'
}

/** What a student would read off THIS exact cross by applying the standard Fischer convention
 * directly ("horizontal = toward viewer, vertical = away") to whatever is CURRENTLY at each position —
 * i.e. treats the cross as a fresh, literal drawing, regardless of whether it's the canonical one
 * `fischerLayoutForCenter`/`fischerLadderLayout` built or a student-rotated one from
 * `rotateFischerCross`. For an unrotated cross this always equals the true configuration (that's what
 * those builder functions guarantee); the whole point of exposing this separately is that after a 90°/
 * 270° rotation it can legitimately disagree with the true configuration — the rotated DRAWING is read
 * differently even though the real molecule never moved. */
export function apparentRSForCross(cross: FischerCross): 'R' | 'S' {
  const byRank = new Map<number, FischerPos>()
  for (const pos of ALL_POSITIONS) byRank.set(cross[pos].rank, pos)
  return trueRSForPositions([byRank.get(1)!, byRank.get(2)!, byRank.get(3)!, byRank.get(4)!])
}

/** Swaps whatever's drawn at two positions — a single transposition, which always inverts the
 * depicted configuration regardless of which two positions or which entries are involved (the same
 * "swap any 2 substituents on a stereocenter inverts R/S" invariant `forcedCross`'s own correction
 * step and `toMoleculeGraph.test.ts` already rely on). Used by the practice quiz to generate a
 * genuine, distinct "wrong enantiomer" multiple-choice option from a correct cross, without needing to
 * rebuild one from scratch. */
export function swapFischerPositions(cross: FischerCross, a: FischerPos, b: FischerPos): FischerCross {
  return { ...cross, [a]: cross[b], [b]: cross[a] }
}

export type FischerRotationDeg = 0 | 90 | 180 | 270

/**
 * Simulates physically rotating the DRAWN cross (the paper, not the molecule) clockwise by `deg` —
 * moves each position's content to wherever a clockwise paper-rotation would carry it (e.g. at 90°,
 * whatever was at 'top' ends up at 'right', since rotating a clock face clockwise by a quarter turn
 * carries 12 o'clock to 3 o'clock), while every `FischerEntry`'s own `slotIndex`/`rank` travels WITH
 * it unchanged — so click-to-swap (which only cares about `slotIndex`, not screen position) keeps
 * working exactly as before, and `apparentRSForCross` on the result correctly reflects what direct
 * reading of the ROTATED drawing would say. This is the "1/3 → 90°/270° inverts, 2/4 → 180°/360°
 * retains" rule students need to internalize: rotating a Fischer drawing in the page plane is a 4-cycle
 * permutation of its 4 positions, which is odd (sign-flipping) at 90°/270° and even (sign-preserving)
 * at 180°/360° — see `__tests__/fischerLayout.test.ts` for the verified consequence.
 */
export function rotateFischerCross(cross: FischerCross, deg: FischerRotationDeg): FischerCross {
  if (deg === 0) return cross
  const steps = deg / 90
  // Position `p`'s NEW content comes from whichever position, after `steps` clockwise quarter-turns,
  // would land ON `p` — i.e. apply `steps` counter-clockwise turns to `p` to find its source.
  const ccw = (pos: FischerPos): FischerPos => ({ top: 'left', left: 'bottom', bottom: 'right', right: 'top' } as const)[pos]
  const out: Partial<FischerCross> = {}
  for (const pos of ALL_POSITIONS) {
    let src: FischerPos = pos
    for (let i = 0; i < steps; i++) src = ccw(src)
    out[pos] = cross[src]
  }
  return out as FischerCross
}

export type LadderRotationStep = 0 | 1 | 2

const CW_ORDER: FischerPos[] = ['top', 'right', 'bottom', 'left']

/**
 * Spins ONE ladder carbon's 3 peripheral substituents around its own fixed backbone-bond position —
 * the only rotation that's physically meaningful for a single center wired into a connected chain.
 * Unlike an isolated center (all 4 positions are free, so `rotateFischerCross`'s full-page rotation
 * applies), the inter-carbon bond here can't move independently of the bond on the OTHER carbon — that
 * would require the chain itself to bend, which a rigid-paper rotation can't do. `forcedPos` is
 * wherever THIS cross's backbone entry sits (always 'bottom' for the top-drawn carbon, 'top' for the
 * bottom-drawn one — see `fischerLadderLayout`); it never moves. The remaining 3 positions, taken in
 * clockwise order with `forcedPos` skipped, form a genuine 3-cycle at `step` 1 or 2 — always an EVEN
 * permutation, so (unlike the isolated-center 90°/270° case) spinning these substituents can NEVER
 * flip the apparent R/S reading. That's a deliberately different lesson from the free-rotation one:
 * there's no way to misread a ladder cross by spinning its substituents around the fixed chain.
 */
export function rotateLadderCross(cross: FischerCross, forcedPos: FischerPos, step: LadderRotationStep): FischerCross {
  if (step === 0) return cross
  const freeOrder = CW_ORDER.filter((p) => p !== forcedPos)
  const out: Partial<FischerCross> = { [forcedPos]: cross[forcedPos] }
  freeOrder.forEach((from, i) => {
    out[freeOrder[(i + step) % 3]] = cross[from]
  })
  return out as FischerCross
}

/**
 * There's no single "correct" Fischer layout for an isolated center (no chain to orient vertically) —
 * any assignment of the 4 ranked groups to {top,bottom,left,right} is a valid Fischer DRAWING of SOME
 * configuration; the only requirement is that THIS specific drawing depicts the SAME configuration
 * `assignRS` already reports. Start from one fixed canonical assignment (rank1 top, rank2 right, rank3
 * bottom, rank4 left, horizontal=toward viewer) and flip the horizontal pair if that assignment's
 * implied configuration doesn't match — exactly the same "compute, compare, swap-if-needed" guarantee
 * `toMoleculeGraph.ts`'s `correctWedgeIfNeeded` uses, so this never silently draws the wrong enantiomer.
 */
export function fischerLayoutForCenter(graph: MoleculeGraph, info: CenterRankInfo): FischerCross | null {
  const reported = assignRS(graph, info.centerId)
  if (!reported || info.ranked.length !== 4) return null
  const [r1, r2, r3, r4] = info.ranked
  const canonical: [FischerPos, FischerPos, FischerPos, FischerPos] = ['top', 'right', 'bottom', 'left']
  const swapped: [FischerPos, FischerPos, FischerPos, FischerPos] = ['top', 'left', 'bottom', 'right']
  const positions = trueRSForPositions(canonical) === reported ? canonical : swapped
  const entry = (r: { label: string; slotIndex: number | null }, rank: 1 | 2 | 3 | 4): FischerEntry => ({ label: r.label, slotIndex: r.slotIndex, rank })
  const byPos: Record<FischerPos, FischerEntry> = {
    [positions[0]]: entry(r1, 1),
    [positions[1]]: entry(r2, 2),
    [positions[2]]: entry(r3, 3),
    [positions[3]]: entry(r4, 4),
  } as Record<FischerPos, FischerEntry>
  return byPos
}

/** Every heteroatom id that belongs to an instance of the molecule's PRINCIPAL (suffix-determining)
 * characteristic group — e.g. the O of an -OH when `principalType` is 'alcohol'. Real IUPAC Fischer
 * convention draws the chain vertical with this group at the top of the whole ladder (Blue Book
 * numbering also gives it the lowest locant) — not whichever substituent happens to rank highest by
 * CIP priority, which is an unrelated ordering used only for the R/S descriptor itself. */
function principalGroupHeteroatomIds(graph: MoleculeGraph): Set<string> {
  const analysis = analyzeGroups(graph)
  const ids = new Set<string>()
  if ('unsupported' in analysis) return ids
  for (const inst of analysis.principal) {
    for (const hid of inst.heteroatomIds) ids.add(hid)
  }
  return ids
}

/**
 * The authentic textbook "stacked ladder" depiction of a 2-carbon chain: ONE continuous vertical line
 * — the top carbon's top arm, straight down through it, down through the inter-carbon bond, down
 * through the bottom carbon, to its bottom arm — with each carbon's OTHER 2-3 substituents on its own
 * top/left/right (top carbon) or bottom/left/right (bottom carbon). Two things are FORCED here, unlike
 * the single-center layout above: (1) the inter-carbon bond's position (so the chain itself is one
 * straight vertical line, never wherever CIP rank would otherwise place it), and (2) whichever carbon
 * carries the molecule's principal characteristic group is drawn ON TOP, with THAT specific
 * substituent forced into the top arm — swapping `infoA`/`infoB`'s usual order if the principal group
 * is actually on B. The remaining free position(s) still fall back to CIP-rank order, then the same
 * "compute true R/S for this exact arrangement, swap the 2 always-free horizontal positions if it
 * disagrees with `assignRS`" guarantee used everywhere in this lab — which still works regardless of
 * what's forced, since swapping any two groups on a stereocenter inverts its configuration no matter
 * which two you pick.
 */
export function fischerLadderLayout(
  graph: MoleculeGraph,
  infoA: CenterRankInfo,
  infoB: CenterRankInfo
): { crossA: FischerCross; crossB: FischerCross; topIsA: boolean } | null {
  const reportedA = assignRS(graph, infoA.centerId)
  const reportedB = assignRS(graph, infoB.centerId)
  if (!reportedA || !reportedB) return null

  const principalIds = principalGroupHeteroatomIds(graph)
  const principalAtomOn = (info: CenterRankInfo) => info.ranked.find((r) => r.atomId && principalIds.has(r.atomId))?.atomId ?? null
  const aPrincipal = principalAtomOn(infoA)
  const bPrincipal = principalAtomOn(infoB)
  // A stays on top by default; only flip to B-on-top when B has the principal group and A doesn't.
  const topIsA = !(bPrincipal !== null && aPrincipal === null)

  const topInfo = topIsA ? infoA : infoB
  const bottomInfo = topIsA ? infoB : infoA
  const topCross = forcedCross(topInfo, 'bottom', bottomInfo.centerId, topIsA ? reportedA : reportedB, topIsA ? aPrincipal : bPrincipal)
  const bottomCross = forcedCross(bottomInfo, 'top', topInfo.centerId, topIsA ? reportedB : reportedA, topIsA ? bPrincipal : aPrincipal)
  if (!topCross || !bottomCross) return null
  // crossA/crossB keys always refer to PHYSICAL carbon A/B (so click handling stays center-index-based,
  // unaffected by which one is drawn on top) — `topIsA` separately tells the SVG which key to render
  // at the top y-position.
  return topIsA ? { crossA: topCross, crossB: bottomCross, topIsA } : { crossA: bottomCross, crossB: topCross, topIsA }
}

function forcedCross(
  info: CenterRankInfo,
  forcedPos: 'top' | 'bottom',
  backboneAtomId: string,
  reported: 'R' | 'S',
  forcePrincipalAtomId: string | null
): FischerCross | null {
  if (info.ranked.length !== 4) return null
  const backboneRankIdx = info.ranked.findIndex((r) => r.atomId === backboneAtomId)
  if (backboneRankIdx === -1) return null
  const freePositions: FischerPos[] = forcedPos === 'bottom' ? ['top', 'left', 'right'] : ['bottom', 'left', 'right']
  const freeRankIdxs = [0, 1, 2, 3].filter((i) => i !== backboneRankIdx)

  // The principal group (if present on this center) takes freePositions[0] — 'top' or 'bottom',
  // whichever is this center's OWN vertically-extreme free slot — ahead of plain CIP-rank order.
  const principalRankIdx = forcePrincipalAtomId ? freeRankIdxs.find((i) => info.ranked[i].atomId === forcePrincipalAtomId) : undefined
  const orderedFreeRankIdxs =
    principalRankIdx !== undefined ? [principalRankIdx, ...freeRankIdxs.filter((i) => i !== principalRankIdx)] : freeRankIdxs

  const posByRankIdx = new Map<number, FischerPos>()
  posByRankIdx.set(backboneRankIdx, forcedPos)
  orderedFreeRankIdxs.forEach((rankIdx, i) => posByRankIdx.set(rankIdx, freePositions[i]))

  const positionsByRank = [0, 1, 2, 3].map((i) => posByRankIdx.get(i)!) as [FischerPos, FischerPos, FischerPos, FischerPos]
  if (trueRSForPositions(positionsByRank) !== reported) {
    // Swap the 2 always-free horizontal positions — inverts the depicted configuration regardless of
    // which rank currently occupies them, and never disturbs the forced top/bottom slot.
    const leftRankIdx = [...posByRankIdx.entries()].find(([, p]) => p === 'left')![0]
    const rightRankIdx = [...posByRankIdx.entries()].find(([, p]) => p === 'right')![0]
    posByRankIdx.set(leftRankIdx, 'right')
    posByRankIdx.set(rightRankIdx, 'left')
  }

  const out: Partial<FischerCross> = {}
  posByRankIdx.forEach((pos, rankIdx) => {
    const r = info.ranked[rankIdx]
    out[pos] = { label: r.label, slotIndex: r.atomId === backboneAtomId ? null : r.slotIndex, rank: (rankIdx + 1) as 1 | 2 | 3 | 4 }
  })
  return out as FischerCross
}
