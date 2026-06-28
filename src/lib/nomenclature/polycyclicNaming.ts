// V4 (2026-06-22): spiro and ortho-fused bicyclic von Baeyer nomenclature — see RULES.md §5.
// Scoped deliberately narrow: plain saturated hydrocarbon (+ alkyl/halogen substituent) spiro and
// fused-bicyclic systems only. No ring unsaturation, no functional groups, no general bridged
// (three-non-zero-bridge, e.g. norbornane) bicyclics — each of those compounds the already-intricate
// numbering logic here in a way this round doesn't take on. Bridged bicyclics specifically aren't even
// constructible via the editor (attachFusedRing only ever shares an existing BOND, which is always the
// ortho-fused/z=0 shape), so they're not expected to reach this code at all.
import { MoleculeGraph, Ring, neighbors, bondBetween } from './model'
import { nameSubstituent, SubstituentName } from './substituents'
import { compareNumberArrays, LocatedSubstituent } from './numbering'
import { chainRoot } from './roots'
import { buildSubstituentToken } from './substituentTokens'

export interface PolycyclicResult {
  name: string
  ruleApplied: string
  unsupported?: string
  orderedAtomIds?: string[]
}

const RULE_SPIRO_UNSUPPORTED = 'Spiro numbering: this particular spiro shape is not supported yet (see the specific reason below).'
const RULE_FUSED_UNSUPPORTED = 'Fused-bicyclic numbering: this particular shape is not supported yet (see the specific reason below).'

function unsupportedOxygenOrNitrogen(graph: MoleculeGraph, ringSet: Set<string>): boolean {
  for (const id of ringSet) {
    if (graph.atoms[id].element !== 'C') return true
  }
  return false
}

function hasAnyRingDoubleBond(graph: MoleculeGraph, ring: Ring): boolean {
  const n = ring.atomIds.length
  for (let i = 0; i < n; i++) {
    const bond = bondBetween(graph, ring.atomIds[i], ring.atomIds[(i + 1) % n])
    if (bond && bond.order !== 1) return true
  }
  return false
}

function scanSubstituents(
  graph: MoleculeGraph,
  ordered: string[],
  ringSet: Set<string>
): { substituents: LocatedSubstituent[]; unsupported?: string } {
  const substituents: LocatedSubstituent[] = []
  let unsupported: string | undefined
  // No skip-list needed: a spiro atom's 4 bonds are ALL ring bonds (2 per ring), so every neighbor is
  // already in `ringSet` and gets filtered below. A FUSED bridgehead, though, only uses 3 of its 4
  // bonds on the ring skeleton (the shared bond + one bridge in each direction) — the 4th can carry a
  // real substituent (e.g. "1-methylbicyclo[2.2.1]heptane"). A previous version of this function
  // explicitly skipped bridgeheads on the wrong assumption that they're always fully ring-saturated,
  // which silently dropped any substituent actually attached there (found via fuzz testing against
  // OPSIN: a COOH+alkyne branch on a bridgehead produced the bare, wrong name "bicyclo[4.4.0]decane").
  ordered.forEach((atomId, idx) => {
    const locant = idx + 1
    for (const { atom } of neighbors(graph, atomId)) {
      if (ringSet.has(atom.id) || atom.element === 'H') continue
      const named: SubstituentName | null = nameSubstituent(graph, atom.id, atomId)
      if (!named) {
        unsupported = `A substituent on the polycyclic skeleton at C${locant} isn't supported yet (only alkyl/halogen).`
        continue
      }
      substituents.push({ ...named, locant })
    }
  })
  return { substituents, unsupported }
}

function assembleWithSubstituents(parentCore: string, substituents: LocatedSubstituent[]): string {
  if (substituents.length === 0) return parentCore
  const groups = new Map<string, { alphaKey: string; locants: number[] }>()
  for (const sub of substituents) {
    const entry = groups.get(sub.name) ?? { alphaKey: sub.alphaKey, locants: [] }
    entry.locants.push(sub.locant)
    groups.set(sub.name, entry)
  }
  const tokens = Array.from(groups.entries())
    .sort((a, b) => a[1].alphaKey.localeCompare(b[1].alphaKey))
    .map(([name, { locants }]) => buildSubstituentToken(name, locants))
  return `${tokens.join('-')}${parentCore}`
}

function pickBestCandidate<T extends { substituents: LocatedSubstituent[]; unsupported?: string }>(candidates: T[]): T | null {
  const supported = candidates.filter((c) => !c.unsupported)
  if (supported.length === 0) return candidates[0] ?? null
  let best = supported[0]
  for (const c of supported.slice(1)) {
    const cmp = compareNumberArrays(c.substituents.map((s) => s.locant), best.substituents.map((s) => s.locant))
    if (cmp < 0) {
      best = c
    } else if (cmp === 0) {
      const sortedC = [...c.substituents].sort((x, y) => x.alphaKey.localeCompare(y.alphaKey))
      const sortedB = [...best.substituents].sort((x, y) => x.alphaKey.localeCompare(y.alphaKey))
      if (sortedC.length > 0 && sortedB.length > 0 && sortedC[0].alphaKey === sortedB[0].alphaKey && sortedC[0].locant < sortedB[0].locant) {
        best = c
      }
    }
  }
  return best
}

/** Non-spiro atoms of `ring`, ordered starting adjacent to `spiroAtomId`, walking in `dir`. */
function spiroRingSequence(ring: Ring, spiroAtomId: string, dir: 1 | -1): string[] {
  const n = ring.atomIds.length
  const idx = ring.atomIds.indexOf(spiroAtomId)
  const seq: string[] = []
  for (let k = 1; k < n; k++) seq.push(ring.atomIds[(((idx + dir * k) % n) + n) % n])
  return seq
}

export function nameSpiroCompound(graph: MoleculeGraph, ringA: Ring, ringB: Ring, spiroAtomId: string): PolycyclicResult {
  const ringSet = new Set([...ringA.atomIds, ...ringB.atomIds])
  if (unsupportedOxygenOrNitrogen(graph, ringSet)) {
    return { name: '', ruleApplied: RULE_SPIRO_UNSUPPORTED, unsupported: 'Heteroatoms directly in a spiro ring skeleton are not supported yet.' }
  }
  if (hasAnyRingDoubleBond(graph, ringA) || hasAnyRingDoubleBond(graph, ringB)) {
    return { name: '', ruleApplied: RULE_SPIRO_UNSUPPORTED, unsupported: 'Unsaturated spiro rings are not supported yet — only saturated spiro hydrocarbons.' }
  }

  const candidates: { order: [Ring, Ring]; ordered: string[]; substituents: LocatedSubstituent[]; unsupported?: string }[] = []
  const ringPairs: [Ring, Ring][] = ringA.atomIds.length === ringB.atomIds.length ? [[ringA, ringB], [ringB, ringA]] : ringA.atomIds.length < ringB.atomIds.length ? [[ringA, ringB]] : [[ringB, ringA]]

  for (const [small, large] of ringPairs) {
    for (const dirSmall of [1, -1] as const) {
      for (const dirLarge of [1, -1] as const) {
        const ordered = [...spiroRingSequence(small, spiroAtomId, dirSmall), spiroAtomId, ...spiroRingSequence(large, spiroAtomId, dirLarge)]
        const { substituents, unsupported } = scanSubstituents(graph, ordered, ringSet)
        candidates.push({ order: [small, large], ordered, substituents, unsupported })
      }
    }
  }

  const best = pickBestCandidate(candidates)
  if (!best) throw new Error('No spiro numbering candidate produced')
  if (best.unsupported) return { name: '', ruleApplied: RULE_SPIRO_UNSUPPORTED, unsupported: best.unsupported }

  const smallSize = best.order[0].atomIds.length
  const largeSize = best.order[1].atomIds.length
  const total = smallSize + largeSize - 1
  const parentCore = `spiro[${smallSize - 1}.${largeSize - 1}]${chainRoot(total)}ane`
  const subLocants = [...new Set(best.substituents.map((s) => s.locant))].sort((a, b) => a - b)
  const ruleApplied =
    `Step 1 — Spiro numbering: two rings (sizes ${smallSize} and ${largeSize}) share exactly one atom (the spiro atom). ` +
    `Numbering starts in the smaller ring at the atom next to the spiro atom, goes around it, through the spiro atom ` +
    `(C${smallSize}), then around the larger ring — out of every starting-direction combination tried, the one giving ` +
    `the lowest substituent locants was picked` +
    (subLocants.length > 0 ? ` (C${subLocants.join(', C')})` : ' (no substituents to compare here)') +
    `, naming the skeleton "${parentCore}".`

  return {
    name: assembleWithSubstituents(parentCore, best.substituents),
    ruleApplied,
    orderedAtomIds: best.ordered,
  }
}

/** Non-bridgehead atoms of `ring` on the path from `fromId` to `toId` NOT using the direct bond
 * between them (i.e. the long way around) — ordered starting adjacent to `fromId`. */
function bridgeSequence(graph: MoleculeGraph, ring: Ring, fromId: string, toId: string): string[] {
  const n = ring.atomIds.length
  const idxFrom = ring.atomIds.indexOf(fromId)
  const nextIsTo = ring.atomIds[(idxFrom + 1) % n] === toId
  const dir = nextIsTo ? -1 : 1
  const seq: string[] = []
  let cur = ((idxFrom + dir) % n + n) % n
  while (ring.atomIds[cur] !== toId) {
    seq.push(ring.atomIds[cur])
    cur = ((cur + dir) % n + n) % n
  }
  return seq
}

export function nameFusedBicyclic(graph: MoleculeGraph, ringA: Ring, ringB: Ring, p: string, q: string): PolycyclicResult {
  const ringSet = new Set([...ringA.atomIds, ...ringB.atomIds])
  if (unsupportedOxygenOrNitrogen(graph, ringSet)) {
    return { name: '', ruleApplied: RULE_FUSED_UNSUPPORTED, unsupported: 'Heteroatoms directly in a fused-ring skeleton are not supported yet.' }
  }
  if (hasAnyRingDoubleBond(graph, ringA) || hasAnyRingDoubleBond(graph, ringB)) {
    return { name: '', ruleApplied: RULE_FUSED_UNSUPPORTED, unsupported: 'Unsaturated fused-ring systems are not supported yet — only saturated bicyclics.' }
  }

  const bridgeInA = bridgeSequence(graph, ringA, p, q)
  const bridgeInB = bridgeSequence(graph, ringB, p, q)
  const lenA = bridgeInA.length
  const lenB = bridgeInB.length

  type BridgeAssignment = { longRing: Ring; shortRing: Ring; longLen: number; shortLen: number }
  const assignments: BridgeAssignment[] =
    lenA === lenB
      ? [{ longRing: ringA, shortRing: ringB, longLen: lenA, shortLen: lenB }, { longRing: ringB, shortRing: ringA, longLen: lenB, shortLen: lenA }]
      : lenA > lenB
        ? [{ longRing: ringA, shortRing: ringB, longLen: lenA, shortLen: lenB }]
        : [{ longRing: ringB, shortRing: ringA, longLen: lenB, shortLen: lenA }]

  const candidates: { assignment: BridgeAssignment; ordered: string[]; substituents: LocatedSubstituent[]; unsupported?: string }[] = []
  for (const assignment of assignments) {
    for (const [c1, other] of [[p, q], [q, p]] as [string, string][]) {
      const longSeq = bridgeSequence(graph, assignment.longRing, c1, other)
      const shortSeq = bridgeSequence(graph, assignment.shortRing, other, c1)
      const ordered = [c1, ...longSeq, other, ...shortSeq]
      const { substituents, unsupported } = scanSubstituents(graph, ordered, ringSet)
      candidates.push({ assignment, ordered, substituents, unsupported })
    }
  }

  const best = pickBestCandidate(candidates)
  if (!best) throw new Error('No fused-bicyclic numbering candidate produced')
  if (best.unsupported) return { name: '', ruleApplied: RULE_FUSED_UNSUPPORTED, unsupported: best.unsupported }

  const { longLen, shortLen } = best.assignment
  const total = longLen + shortLen + 2
  const parentCore = `bicyclo[${longLen}.${shortLen}.0]${chainRoot(total)}ane`
  const subLocants = [...new Set(best.substituents.map((s) => s.locant))].sort((a, b) => a - b)
  const ruleApplied =
    `Step 1 — Fused-bicyclic numbering: two rings share a bond, fusing them at its two bridgehead atoms ` +
    `(C1 and C${longLen + 2}). Numbering starts at one bridgehead, goes around the LONGER bridge first ` +
    `(${longLen} atoms) to the other bridgehead, then back along the shorter bridge (${shortLen} atoms) — ` +
    `out of every bridgehead/direction combination tried, the one giving the lowest substituent locants was picked` +
    (subLocants.length > 0 ? ` (C${subLocants.join(', C')})` : ' (no substituents to compare here)') +
    `, naming the skeleton "${parentCore}".`

  return {
    name: assembleWithSubstituents(parentCore, best.substituents),
    ruleApplied,
    orderedAtomIds: best.ordered,
  }
}

export interface RingRelation {
  kind: 'spiro' | 'fused' | 'unsupported'
  sharedAtomIds: string[]
  unsupportedReason?: string
}

/** Classifies how two rings relate so nameMolecule.ts can route to the right naming function. */
export function classifyTwoRings(graph: MoleculeGraph, ringA: Ring, ringB: Ring): RingRelation {
  const setA = new Set(ringA.atomIds)
  const shared = ringB.atomIds.filter((id) => setA.has(id))
  if (shared.length === 0) {
    return { kind: 'unsupported', sharedAtomIds: [], unsupportedReason: 'Two separate rings connected only by a chain (not spiro or fused) are not supported yet.' }
  }
  if (shared.length === 1) {
    return { kind: 'spiro', sharedAtomIds: shared }
  }
  if (shared.length === 2 && bondBetween(graph, shared[0], shared[1])) {
    return { kind: 'fused', sharedAtomIds: shared }
  }
  return { kind: 'unsupported', sharedAtomIds: shared, unsupportedReason: 'Bridged bicyclic systems (e.g. norbornane-style, three non-zero bridges) are not supported yet.' }
}
