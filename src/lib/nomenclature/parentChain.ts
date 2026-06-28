import { MoleculeGraph, neighbors } from './model'
import { GroupAnalysis, GroupType } from './principalGroup'

// These group types' DEMOTED prefix form ("cyano", "carbamoyl", "(methoxycarbonyl)"...) explicitly
// bundles its own dedicated carbon, separate from whatever it's attached to — so that carbon must
// never be absorbed into the numbered parent chain. Aldehyde is deliberately excluded even though it
// also normally sits at a chain terminus: its demoted prefix is "oxo" (just "=O", same as ketone),
// which reuses the EXISTING chain carbon rather than bringing a new one — confirmed against OPSIN:
// "3-oxopropanoic acid" (OHC-CH2-COOH) is 3 carbons total, while "4-cyanobutanoic acid" would need 5
// (cyano's own carbon, separate from the 4-carbon chain) — these two demoted forms aren't analogous.
export const TERMINAL_OWNING_TYPES: GroupType[] = [
  'carboxylic_acid',
  'ester',
  'acid_fluoride',
  'acid_chloride',
  'acid_bromide',
  'acid_iodide',
  'amide',
  'nitrile',
]

export interface ChainCandidate {
  atomIds: string[] // carbons only, ordered along the chain from one end to the other
  length: number
  multipleBondCount: number
  hasPrincipalGroup: boolean
  substituentCount: number
}

function carbonNeighborIds(graph: MoleculeGraph, atomId: string): string[] {
  return neighbors(graph, atomId)
    .filter((n) => n.atom.element === 'C')
    .map((n) => n.atom.id)
}

/** Ordered simple path between two carbons in the (tree-shaped, V1 acyclic) carbon skeleton, or null
 * if they're not reachable through carbon-carbon bonds alone — which legitimately happens now that a
 * plain ether bridge (-O-) can split one molecule's carbon skeleton into separate carbon-only "islands"
 * (e.g. CH3-O-CH2CH3 has no C-C bond connecting the methyl side to the ethyl side at all). */
function pathBetween(graph: MoleculeGraph, startId: string, endId: string): string[] | null {
  const visited = new Set<string>([startId])
  const parent = new Map<string, string>()
  const queue = [startId]
  while (queue.length) {
    const current = queue.shift()!
    if (current === endId) break
    for (const next of carbonNeighborIds(graph, current)) {
      if (!visited.has(next)) {
        visited.add(next)
        parent.set(next, current)
        queue.push(next)
      }
    }
  }
  if (!visited.has(endId)) return null
  const path = [endId]
  let cursor = endId
  while (cursor !== startId) {
    const prev = parent.get(cursor)
    if (!prev) return null
    path.push(prev)
    cursor = prev
  }
  return path.reverse()
}

function multipleBondsAlong(graph: MoleculeGraph, atomIds: string[]): number {
  let count = 0
  for (let i = 0; i < atomIds.length - 1; i++) {
    const bond = Object.values(graph.bonds).find(
      (b) =>
        (b.a === atomIds[i] && b.b === atomIds[i + 1]) || (b.a === atomIds[i + 1] && b.b === atomIds[i])
    )
    if (bond && bond.order > 1) count += 1
  }
  return count
}

function substituentsAlong(graph: MoleculeGraph, atomIds: string[]): number {
  const chainSet = new Set(atomIds)
  let count = 0
  for (const id of atomIds) {
    for (const { atom } of neighbors(graph, id)) {
      if (!chainSet.has(atom.id) && atom.element !== 'H') count += 1
    }
  }
  return count
}

export interface ParentSelectionResult {
  candidate: ChainCandidate
  ruleApplied: string
}

/**
 * Enumerates every leaf-to-leaf path in the (acyclic, tree-shaped) carbon
 * skeleton and applies the RULES.md §2 selection order. Assumes the caller
 * has already confirmed there is no ring (rings are handled separately by
 * ringNaming.ts — a ring is always the parent when one is present, per
 * RULES.md §5 / Blue Book P-23.2.5).
 */
export function selectParentChain(
  graph: MoleculeGraph,
  groups: GroupAnalysis
): ParentSelectionResult {
  const carbons = Object.values(graph.atoms).filter((a) => a.element === 'C')
  if (carbons.length === 0) throw new Error('No carbon skeleton to name')

  const principalCarbonIds = groups.principal.map((g) => g.carbonId)
  const containsAllPrincipalCarbons = (atomIds: string[]) => principalCarbonIds.every((id) => atomIds.includes(id))

  // A DEMOTED terminal-owning group's carbon (e.g. a "cyano" nitrile carbon when an ester elsewhere is
  // principal) must never become part of the numbered parent chain — that carbon, plus its non-carbon
  // atoms, IS the complete substituent ("cyano", "carbamoyl"...), so walking the backbone into it would
  // double-count the same functional group as both a chain atom AND its own prefix. Found via fuzz
  // testing against OPSIN: a demoted nitrile's carbon was being treated as an equally-valid chain
  // terminus, and a tie-break that rewards "more substituents" then favored it (the bond to its own N
  // counted as one MORE off-chain substituent than the alternative, genuinely-longer-correct chain),
  // producing "methyl 5-cyano-4-methylpentanoate" — a name implying 6 carbons for a 5-carbon structure.
  const blockedTerminalIds = new Set(
    groups.demoted.filter((g) => TERMINAL_OWNING_TYPES.includes(g.type)).map((g) => g.carbonId)
  )
  const leaves = carbons.filter((c) => carbonNeighborIds(graph, c.id).length <= 1 && !blockedTerminalIds.has(c.id))
  // A blocked carbon is always a leaf itself (its functional group consumes every other valence slot),
  // so simply excluding it from `leaves` would also remove the chain's only legitimate stopping point
  // nearby — the chain must still reach right up to (never into) it. Each blocked carbon's own
  // neighbor becomes a valid chain terminus instead, e.g. N#C-CH2-CH2-COOH's parent chain correctly
  // stops at the CH2 next to the nitrile carbon ("3-cyanopropanoic acid"), not at the nitrile carbon
  // itself ("4-cyanobutanoic acid", which would need a 5th, nonexistent carbon for "cyano").
  const terminalIdSet = new Set(leaves.map((c) => c.id))
  for (const blockedId of blockedTerminalIds) {
    for (const neighborId of carbonNeighborIds(graph, blockedId)) {
      if (!blockedTerminalIds.has(neighborId)) terminalIdSet.add(neighborId)
    }
  }
  const terminalCandidates = carbons.filter((c) => terminalIdSet.has(c.id))
  const terminals = terminalCandidates.length > 0 ? terminalCandidates : [carbons[0]]

  // A plain ether (or any other non-carbon bridge) can split the carbon skeleton into separate
  // carbon-only "islands" with no C-C path between them at all — pathBetween returns null for any
  // such pair, which is skipped rather than treated as an error. Every terminal also gets registered
  // as its own trivial 1-atom candidate so a single-carbon island (e.g. the "methyl" side of methyl
  // ethyl ether) is still a valid, comparable candidate even though it has no leaf partner of its own.
  const candidates: ChainCandidate[] = []
  const seen = new Set<string>()
  function addCandidate(atomIds: string[]) {
    const key = atomIds.slice().sort().join(',')
    if (seen.has(key)) return
    seen.add(key)
    candidates.push({
      atomIds,
      length: atomIds.length,
      multipleBondCount: multipleBondsAlong(graph, atomIds),
      hasPrincipalGroup: groups.principalType !== 'none' && containsAllPrincipalCarbons(atomIds),
      substituentCount: substituentsAlong(graph, atomIds),
    })
  }
  for (const t of terminals) addCandidate([t.id])
  for (let i = 0; i < terminals.length; i++) {
    for (let j = i + 1; j < terminals.length; j++) {
      const atomIds = pathBetween(graph, terminals[i].id, terminals[j].id)
      if (atomIds) addCandidate(atomIds)
    }
  }

  const totalCandidates = candidates.length
  let pool = candidates
  let groupFilterMattered = false
  if (groups.principalType !== 'none') {
    const withGroup = pool.filter((c) => c.hasPrincipalGroup)
    if (withGroup.length > 0) {
      groupFilterMattered = withGroup.length < pool.length
      pool = withGroup
    }
  }
  const afterGroupFilter = pool.length
  const maxLength = Math.max(...pool.map((c) => c.length))
  pool = pool.filter((c) => c.length === maxLength)
  const lengthFilterMattered = pool.length < afterGroupFilter
  const beforeBondsTiebreak = pool.length
  const maxBonds = Math.max(...pool.map((c) => c.multipleBondCount))
  pool = pool.filter((c) => c.multipleBondCount === maxBonds)
  const bondsTiebreakMattered = pool.length < beforeBondsTiebreak && beforeBondsTiebreak > 1
  const beforeSubsTiebreak = pool.length
  const maxSubs = Math.max(...pool.map((c) => c.substituentCount))
  pool = pool.filter((c) => c.substituentCount === maxSubs)
  const subsTiebreakMattered = pool.length < beforeSubsTiebreak && beforeSubsTiebreak > 1

  const sentences: string[] = [
    `Step 2 — Choose the parent chain: this carbon skeleton has ${totalCandidates} possible continuous chain${totalCandidates > 1 ? 's' : ''} to pick from.`,
  ]
  if (groupFilterMattered) {
    sentences.push(
      `The parent chain MUST contain the principal characteristic group, which immediately narrows it down to ${afterGroupFilter} candidate${afterGroupFilter > 1 ? 's' : ''}.`
    )
  }
  sentences.push(
    `Among ${lengthFilterMattered ? 'those' : 'these'}, the longest is ${maxLength} carbon${maxLength > 1 ? 's' : ''} long` +
      (lengthFilterMattered ? ', so the parent chain has that many carbons' : '') +
      '.'
  )
  if (bondsTiebreakMattered) {
    sentences.push(
      `${beforeBondsTiebreak} chains tied for longest, so the tie was broken by picking whichever has the most double/triple bonds (${maxBonds}).`
    )
  }
  if (subsTiebreakMattered) {
    sentences.push(
      `Still ${beforeSubsTiebreak} chains tied after that, so the final tie-break was whichever has the most substituents attached (${maxSubs}).`
    )
  }
  const ruleApplied = sentences.join(' ')

  return { candidate: pool[0], ruleApplied }
}
