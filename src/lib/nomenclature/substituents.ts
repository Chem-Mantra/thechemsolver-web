import { MoleculeGraph, neighbors, bondBetween } from './model'
import { chainRoot, MULTIPLYING_PREFIXES } from './roots'
import { isNitroNitrogen } from './valency'
import { buildStereoPrefix } from './stereo'

const HALOGEN_NAMES: Record<string, string> = { F: 'fluoro', Cl: 'chloro', Br: 'bromo', I: 'iodo' }

export interface SubstituentName {
  name: string
  /** Alphabetization key per Blue Book P-14.5: "iso" counts, "sec-"/"tert-" are ignored. */
  alphaKey: string
}

function carbonNeighborsExcluding(graph: MoleculeGraph, atomId: string, excludeId: string): string[] {
  return neighbors(graph, atomId)
    .filter((n) => n.atom.element === 'C' && n.atom.id !== excludeId)
    .map((n) => n.atom.id)
}

/** Walks a straight (unbranched) carbon chain starting at `startId`, away from `excludeId`, tracking
 * any double/triple bonds AND halogen substituents met along the way (a "composite" substituent like
 * "2-chloroethyl" — RULES.md §5 — found via fuzz testing/the V13-era ester bug, where a halogenated
 * O-alkyl group like "chloromethyl" had to be honestly rejected since this wasn't built yet).
 * Locants are counted from `startId` = 1 — a substituent group's free valence is always position 1 (no
 * direction choice, unlike numbering the main chain). Returns null if the chain branches anywhere past
 * the start (more than one carbon neighbor), or if a non-halogen heteroatom is met (out of scope — see
 * `nameSubstituent`'s docstring; this engine only builds composite names for halogens). */
function walkLinearChain(
  graph: MoleculeGraph,
  startId: string,
  excludeId: string
): {
  length: number
  orderedAtomIds: string[]
  doubleLocants: number[]
  tripleLocants: number[]
  haloLocants: { locant: number; name: string }[]
} | null {
  let length = 1
  let current = startId
  let prev = excludeId
  const orderedAtomIds: string[] = [startId]
  const doubleLocants: number[] = []
  const tripleLocants: number[] = []
  const haloLocants: { locant: number; name: string }[] = []
  while (true) {
    for (const { atom } of neighbors(graph, current)) {
      if (atom.id === prev || atom.element === 'C' || atom.element === 'H') continue
      const haloName = HALOGEN_NAMES[atom.element]
      if (!haloName) return null // a non-halogen heteroatom on the branch: out of scope, fail honestly
      haloLocants.push({ locant: length, name: haloName })
    }
    const next = carbonNeighborsExcluding(graph, current, prev)
    if (next.length === 0) break
    if (next.length > 1) return null
    const bond = bondBetween(graph, current, next[0])
    if (bond?.order === 2) doubleLocants.push(length)
    if (bond?.order === 3) tripleLocants.push(length)
    length += 1
    prev = current
    current = next[0]
    orderedAtomIds.push(current)
  }
  return { length, orderedAtomIds, doubleLocants, tripleLocants, haloLocants }
}

/** Builds the halogen-prefix portion of a composite substituent name, e.g. "2-chloro-3-fluoro" or
 * "1,1-dichloro" — grouped by halogen, alphabetized, multiplied like any other prefix list. Returns ''
 * when there are no halogens (the common case), so callers can just prepend the result unconditionally. */
function buildHaloPrefix(haloLocants: { locant: number; name: string }[]): string {
  if (haloLocants.length === 0) return ''
  const groups = new Map<string, number[]>()
  for (const h of haloLocants) groups.set(h.name, [...(groups.get(h.name) ?? []), h.locant])
  return Array.from(groups.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, locants]) => {
      const sorted = [...locants].sort((a, b) => a - b)
      const mult = sorted.length > 1 ? MULTIPLYING_PREFIXES[sorted.length] ?? '' : ''
      return `${sorted.join(',')}-${mult}${name}`
    })
    .join('-')
}

/** For a single-carbon branch (size===1): checks attachId's own non-C/H neighbors (excluding
 * cameFromId) are ALL halogens — e.g. "chloromethyl", "difluoromethyl", "trifluoromethyl" (a very
 * common JEE group). No locant is needed (there's only the one carbon position), just the halogen
 * name(s), grouped and alphabetized like any other prefix list. Returns '' when there are none (the
 * plain "methyl" case), or null if a non-halogen heteroatom is present (out of scope). */
function haloOnlyPrefix(graph: MoleculeGraph, attachId: string, cameFromId: string): string | null {
  const names: string[] = []
  for (const { atom } of neighbors(graph, attachId)) {
    if (atom.id === cameFromId || atom.element === 'C' || atom.element === 'H') continue
    const haloName = HALOGEN_NAMES[atom.element]
    if (!haloName) return null
    names.push(haloName)
  }
  if (names.length === 0) return ''
  const counts = new Map<string, number>()
  for (const n of names) counts.set(n, (counts.get(n) ?? 0) + 1)
  return Array.from(counts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, count]) => `${count > 1 ? MULTIPLYING_PREFIXES[count] ?? '' : ''}${name}`)
    .join('-')
}

/** Builds e.g. "pent-4-en-1-yl" / "but-1,3-dien-1-yl" from a saturated root and the locants found by
 * `walkLinearChain` — null/empty locant arrays should be checked by the caller first (the plain "-yl"
 * name is shorter and more standard when there's no unsaturation to report). `ylidene` swaps the
 * ending to "-ylidene" for a double-bonded attachment point (e.g. "but-3-en-1-ylidene"). */
function unsaturatedSubstituentName(root: string, doubleLocants: number[], tripleLocants: number[], ylidene = false): SubstituentName {
  const segments: string[] = []
  if (doubleLocants.length > 0) {
    const mult = doubleLocants.length > 1 ? MULTIPLYING_PREFIXES[doubleLocants.length] ?? '' : ''
    segments.push(`${doubleLocants.join(',')}-${mult}en`)
  }
  if (tripleLocants.length > 0) {
    const mult = tripleLocants.length > 1 ? MULTIPLYING_PREFIXES[tripleLocants.length] ?? '' : ''
    segments.push(`${tripleLocants.join(',')}-${mult}yn`)
  }
  const name = `${root}-${segments.join('-')}-1-${ylidene ? 'ylidene' : 'yl'}`
  return { name, alphaKey: name }
}

/** True if any carbon inside this branch carries an extra non-C, non-H neighbor (halogen, OH, etc.)
 * that the plain methyl/ethyl/propyl/... shape-matching below doesn't know how to fold in — e.g. a
 * chlorine two atoms into an "ethyl" branch. Composite substituent names (e.g. "2-chloroethyl") with
 * their own internal locants aren't built yet, so this is the difference between honestly failing and
 * silently naming such a branch "ethyl" while ignoring the chlorine. */
function branchHasExtraHeteroatom(graph: MoleculeGraph, branchSet: Set<string>, attachId: string, cameFromId: string): boolean {
  for (const id of branchSet) {
    // attachId's own bond back to cameFromId (the chain atom, or — recursing through an ether
    // oxygen — that oxygen itself) is the legitimate attachment point, not an extra substituent.
    const exclude = id === attachId ? cameFromId : ''
    for (const { atom } of neighbors(graph, id)) {
      if (atom.id === exclude) continue
      if (atom.element !== 'C' && atom.element !== 'H') return true
    }
  }
  return false
}

/**
 * Names a single substituent attached at `attachId`, having arrived from
 * `cameFromId` (the parent-chain atom). Returns null for branch shapes
 * outside V1 scope (RULES.md §5) rather than guessing — nameMolecule turns
 * that into a clear "not supported yet" message instead of a wrong name.
 */
export function nameSubstituent(
  graph: MoleculeGraph,
  attachId: string,
  cameFromId: string
): SubstituentName | null {
  const atom = graph.atoms[attachId]
  if (atom.element !== 'C') {
    const halogenName = HALOGEN_NAMES[atom.element]
    if (halogenName) return { name: halogenName, alphaKey: halogenName }
    if (atom.element === 'O' && atom.implicitHCount === 0) {
      // Plain ether oxygen (-O-R): name the far side as an ordinary alkyl group, then turn its
      // "-yl" ending into "-oxy" (methyl -> methoxy, isopropyl -> isopropoxy, sec-butyl -> sec-butoxy...).
      const farCarbon = neighbors(graph, attachId).find((n) => n.atom.id !== cameFromId && n.atom.element === 'C')
      if (!farCarbon) return null
      const inner = nameSubstituent(graph, farCarbon.atom.id, attachId)
      if (!inner || !inner.name.endsWith('yl')) return null
      return { name: `${inner.name.slice(0, -2)}oxy`, alphaKey: `${inner.alphaKey.slice(0, -2)}oxy` }
    }
    if (atom.element === 'N' && isNitroNitrogen(graph, attachId)) return { name: 'nitro', alphaKey: 'nitro' }
    return null // O/N branches besides the recognised principal groups: out of scope (RULES.md §5)
  }

  // A substituent's own ATTACHMENT bond is assumed single ("-yl") almost everywhere below — a
  // double-bonded attachment (one atom using BOTH its free valences on the parent, e.g. an exocyclic
  // =CH2 on a ring reachable by dragging the "=" bond tool from a ring atom) needs the "-ylidene"
  // suffix instead, and a triple-bonded one needs "-ylidyne". Found via fuzz testing: this used to be
  // silently named as a plain "methyl"/"ethyl"/... single-bond substituent, completely dropping the
  // fact that it's actually double-bonded to its attachment point — a real, reachable structure
  // (methylidenecyclohexane etc.), not just a theoretical gap.
  const attachBondOrder = bondBetween(graph, attachId, cameFromId)?.order ?? 1
  if (attachBondOrder === 3) return null // "-ylidyne": vanishingly rare, not built

  // Carbons reachable from attachId without crossing back through cameFromId (a tree branch in V1).
  const visited = new Set<string>([attachId])
  const stack = [attachId]
  const branchSet = new Set<string>([attachId])
  while (stack.length) {
    const current = stack.pop()!
    const exclude = current === attachId ? cameFromId : ''
    for (const id of carbonNeighborsExcluding(graph, current, exclude)) {
      if (id === cameFromId) continue
      if (!visited.has(id)) {
        visited.add(id)
        branchSet.add(id)
        stack.push(id)
      }
    }
  }
  const size = branchSet.size
  const childrenOfAttach = carbonNeighborsExcluding(graph, attachId, cameFromId)

  if (size === 1) {
    // A halogen directly on a single-carbon branch (e.g. "chloromethyl", the ester O-alkyl shape that
    // used to be honestly rejected — RULES.md §5) is the simplest composite substituent: no internal
    // locant needed, since there's only the one carbon position to put it on.
    const haloPrefix = haloOnlyPrefix(graph, attachId, cameFromId)
    if (haloPrefix === null) return null // a non-halogen heteroatom directly on this carbon
    const base = attachBondOrder === 2 ? 'methylidene' : 'methyl'
    const name = `${haloPrefix}${base}`
    return { name, alphaKey: name }
  }

  // A double-bonded attachment on a BRANCHED shape (isopropylidene, sec-butylidene...) needs its own
  // naming this engine doesn't build yet — only the straight-chain walk below handles "-ylidene".
  if (attachBondOrder === 2 && childrenOfAttach.length !== 1) return null

  // Straight-chain substituents of any length (ethyl, propyl, butyl, pentyl...) share one walk: the
  // attachment atom is always locant 1 (a substituent group's free valence anchors numbering there,
  // no direction choice like the main chain has), so a double/triple bond OR halogen met along the way
  // is named directly off that fixed locant instead of being silently dropped — a real bug this engine
  // used to have for unsaturation (e.g. a "prop-1-en-1-yl" branch was named plain "propyl") and, until
  // now, an honest-but-incomplete rejection for halogens (e.g. "2-chloroethyl").
  if (childrenOfAttach.length === 1) {
    const walk = walkLinearChain(graph, attachId, cameFromId)
    if (walk && walk.length === size) {
      const root = chainRoot(walk.length)
      const haloPrefix = buildHaloPrefix(walk.haloLocants)
      if (walk.doubleLocants.length === 0 && walk.tripleLocants.length === 0) {
        const name = `${haloPrefix}${root}${attachBondOrder === 2 ? 'ylidene' : 'yl'}`
        return { name, alphaKey: name }
      }
      const unsaturated = unsaturatedSubstituentName(root, walk.doubleLocants, walk.tripleLocants, attachBondOrder === 2)
      // A double bond INSIDE the substituent branch itself (e.g. "but-2-en-1-yl") can have its own
      // E/Z just like a parent-chain one — buildStereoPrefix needs the branch's own locant-ordered atom
      // list, not the parent's, since locant 1 here is always attachId (RULES.md §5, added 2026-06-24
      // — this used to be a documented scope gap entirely, not just an edge case). The descriptor is
      // ignored for alphabetization (alphaKey stays plain), matching how a leading stereo prefix is
      // always ignored in alphanumerical ordering (P-14.5).
      const stereoPrefix = buildStereoPrefix(graph, walk.orderedAtomIds, walk.doubleLocants)
      const name = `${stereoPrefix}${haloPrefix}${unsaturated.name}`
      return { name, alphaKey: `${haloPrefix}${unsaturated.name}` }
    }
    // Not a straight chain — falls through below for the one branched shape that starts this way
    // (isobutyl: the branch point sits one atom in, not at the attachment atom itself, so the
    // earlier "branched shape" reject above — keyed on childrenOfAttach.length — doesn't catch it).
    // "isobutylidene" naming isn't built, so a double-bonded attachment here is rejected too. Halogens
    // on a branched shape (e.g. "1-chloroisobutyl") aren't built either — reuses the strict
    // all-heteroatoms-reject guard, unlike the straight-chain walk above.
    if (branchHasExtraHeteroatom(graph, branchSet, attachId, cameFromId)) return null
    if (size === 4 && attachBondOrder !== 2) {
      const mid = childrenOfAttach[0]
      const midChildren = carbonNeighborsExcluding(graph, mid, attachId)
      if (
        midChildren.length === 2 &&
        midChildren.every((id) => carbonNeighborsExcluding(graph, id, mid).length === 0) &&
        (bondBetween(graph, attachId, mid)?.order ?? 1) === 1 &&
        midChildren.every((id) => (bondBetween(graph, mid, id)?.order ?? 1) === 1)
      ) {
        return { name: 'isobutyl', alphaKey: 'isobutyl' }
      }
    }
    return null
  }

  // Branched shapes (isopropyl, sec-butyl, tert-butyl) don't build composite/halogenated forms yet —
  // only the straight-chain walk above does (see RULES.md §5: "composite substituent names" scope is
  // limited to the straight-chain case for now, matching the one example structure that motivated it).
  if (branchHasExtraHeteroatom(graph, branchSet, attachId, cameFromId)) return null

  if (size === 3) {
    if (childrenOfAttach.length === 2) {
      const bothTerminal = childrenOfAttach.every((id) => carbonNeighborsExcluding(graph, id, attachId).length === 0)
      // isopropyl shape — only the fully-saturated form is supported; a double bond here (e.g.
      // isopropenyl/prop-1-en-2-yl) needs its own naming this engine doesn't build yet, so fail
      // honestly instead of silently dropping the unsaturation.
      if (bothTerminal && childrenOfAttach.every((id) => (bondBetween(graph, attachId, id)?.order ?? 1) === 1)) {
        return { name: 'isopropyl', alphaKey: 'isopropyl' }
      }
    }
    return null
  }

  if (size === 4) {
    if (childrenOfAttach.length === 2) {
      const terminalChildren = childrenOfAttach.filter((id) => carbonNeighborsExcluding(graph, id, attachId).length === 0)
      const nonTerminal = childrenOfAttach.filter((id) => carbonNeighborsExcluding(graph, id, attachId).length === 1)
      if (terminalChildren.length === 1 && nonTerminal.length === 1) {
        const next = carbonNeighborsExcluding(graph, nonTerminal[0], attachId)[0]
        const allSingle =
          carbonNeighborsExcluding(graph, next, nonTerminal[0]).length === 0 &&
          (bondBetween(graph, attachId, terminalChildren[0])?.order ?? 1) === 1 &&
          (bondBetween(graph, attachId, nonTerminal[0])?.order ?? 1) === 1 &&
          (bondBetween(graph, nonTerminal[0], next)?.order ?? 1) === 1
        if (allSingle) return { name: 'sec-butyl', alphaKey: 'butyl' } // "sec-" ignored for alphabetization, P-14.5
      }
      return null
    }
    if (childrenOfAttach.length === 3) {
      const allTerminal = childrenOfAttach.every((id) => carbonNeighborsExcluding(graph, id, attachId).length === 0)
      const allSingle = childrenOfAttach.every((id) => (bondBetween(graph, attachId, id)?.order ?? 1) === 1)
      if (allTerminal && allSingle) return { name: 'tert-butyl', alphaKey: 'butyl' } // "tert-" ignored for alphabetization
    }
    return null
  }

  return null
}
