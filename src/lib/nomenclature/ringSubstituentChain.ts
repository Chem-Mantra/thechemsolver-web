// Handles the case where a ring (benzene/cyclohexane) carries a substituent chain that itself bears
// the molecule's principal characteristic group (e.g. Ring-CH2-CH2-OH). Blue Book P-44 requires the
// parent to contain the principal characteristic group — that overrides the "rings outrank chains"
// rule (P-23.2.5), which only decides parent selection when no principal group forces the issue. So
// here the OFF-ring chain becomes the parent (e.g. "...ol"/"...one"/"...oic acid") and the ring itself
// is demoted to an ordinary substituent prefix ("phenyl", "(3,5-difluorophenyl)", "cyclohexyl"...).
import { MoleculeGraph, Ring, neighbors, extractSubgraph, bondBetween } from './model'
import { GroupAnalysis, analyzeGroups } from './principalGroup'
import { selectParentChain } from './parentChain'
import { numberChain, LocatedSubstituent, compareNumberArrays } from './numbering'
import { assembleAcyclicName } from './assembleName'
import { nameSubstituent, SubstituentName } from './substituents'
import { MULTIPLYING_PREFIXES } from './roots'
import { ringAlkylName, RING_ROOT } from './ringNaming'
import { buildSubstituentToken } from './substituentTokens'
import { buildNSubstituentTokens, explainNSubstituent } from './nSubstituents'
import { buildStereoPrefix, explainStereoDescriptors } from './stereo'

export interface RingSubstituentChainResult {
  name: string
  ruleTrail: string[]
  chainAtomIds: string[]
  /** For the structural-formula panel: the ring's substituent label and which atoms belong to it, so
   * it can render that branch as a fixed tag instead of recursing into the ring (which would loop). */
  ringSubstituent: { ringAtomIds: string[]; label: string }
}

const RULE_RING_DEMOTED =
  'Parent selection (Blue Book P-44): the principal characteristic group must be in the parent — this ' +
  'overrides "rings outrank chains" (P-23.2.5) when the group sits on a substituent chain instead of ' +
  'the ring, so the chain becomes the parent and the ring is cited as an ordinary substituent prefix.'

function branchAtomIds(graph: MoleculeGraph, ringSet: Set<string>, rootId: string): Set<string> {
  const seen = new Set<string>([rootId])
  const stack = [rootId]
  while (stack.length) {
    const current = stack.pop()!
    for (const { atom } of neighbors(graph, current)) {
      if (ringSet.has(atom.id) || seen.has(atom.id)) continue
      seen.add(atom.id)
      stack.push(atom.id)
    }
  }
  return seen
}

/** Names the ring itself as a substituent prefix, numbered from `attachRingAtomId` (locant 1). */
function nameRingAsSubstituent(
  graph: MoleculeGraph,
  ring: Ring,
  attachRingAtomId: string,
  mainBranchRootId: string
): SubstituentName | null {
  const n = ring.atomIds.length
  const startIdx = ring.atomIds.indexOf(attachRingAtomId)
  if (startIdx === -1) return null

  // A ring atom's own attachment to the parent chain is usually a single bond ("-yl"), but it can be
  // double ("-ylidene" — e.g. cyclohexylidene, a real and unambiguous shape since a ring atom has no
  // "branched ylidene" issue the way a chain substituent does) — found via fuzz testing: this used to
  // always assume "-yl" and silently drop the fact that the ring's attachment was actually a double
  // bond. A triple-bonded attachment is valence-unreachable here (2 ring bonds + a triple bond already
  // exceeds carbon's 4 total) so it isn't separately handled.
  const attachBondOrder = bondBetween(graph, attachRingAtomId, mainBranchRootId)?.order ?? 1

  function evalDirection(dir: 1 | -1) {
    const ordered: string[] = []
    for (let k = 0; k < n; k++) ordered.push(ring.atomIds[((startIdx + dir * k) % n + n) % n])
    const ringSetLocal = new Set(ordered)
    // Aromatic rings keep their Kekule double bonds as pure valence bookkeeping (never cited as
    // "-ene", same convention used everywhere else in this engine — see ringNaming.ts); only a
    // non-aromatic ring's double bond is real, nameable unsaturation on this substituent.
    const doubleLocants: number[] = []
    let unsupported = false
    if (!ring.aromatic) {
      for (let i = 0; i < n; i++) {
        const bond = bondBetween(graph, ordered[i], ordered[(i + 1) % n])
        if (bond?.order === 2) doubleLocants.push(i + 1)
        // Same scope cut as ringNaming.ts: a triple bond inside a ring is geometrically absurd at any
        // size this engine builds, and used to be silently invisible to this scan (which only ever
        // checked for order===2) — found via fuzz testing, where the bond-order tool's valence-only
        // check let a ring bond get cycled all the way to a triple bond.
        if (bond?.order === 3) unsupported = true
      }
    }
    const subs: LocatedSubstituent[] = []
    ordered.forEach((atomId, idx) => {
      const locant = idx + 1
      for (const { atom } of neighbors(graph, atomId)) {
        if (ringSetLocal.has(atom.id) || atom.element === 'H') continue
        if (idx === 0 && atom.id === mainBranchRootId) continue // the bond to the parent chain itself
        const named = nameSubstituent(graph, atom.id, atomId)
        if (!named) {
          unsupported = true
          continue
        }
        subs.push({ ...named, locant })
      }
    })
    return { subs, doubleLocants, unsupported }
  }

  const a = evalDirection(1)
  const b = evalDirection(-1)
  if (a.unsupported && b.unsupported) return null

  // Lowest locants go to the ring's own double bond(s) first, then to its other substituents — same
  // two-tier priority order used everywhere else a ring is numbered (ringNaming.ts); the attachment
  // point itself is always locant 1 by construction (that's what "substituent group" numbering means),
  // so there's no separate "principal group" tier to consider here.
  let chosen = a
  if (a.unsupported) {
    chosen = b
  } else if (!b.unsupported) {
    const doubleCmp = compareNumberArrays(a.doubleLocants, b.doubleLocants)
    if (doubleCmp > 0) {
      chosen = b
    } else if (doubleCmp === 0) {
      const cmp = compareNumberArrays(a.subs.map((s) => s.locant), b.subs.map((s) => s.locant))
      if (cmp > 0) {
        chosen = b
      } else if (cmp === 0) {
        const sortedA = [...a.subs].sort((x, y) => x.alphaKey.localeCompare(y.alphaKey))
        const sortedB = [...b.subs].sort((x, y) => x.alphaKey.localeCompare(y.alphaKey))
        if (sortedA[0] && sortedB[0] && sortedA[0].alphaKey === sortedB[0].alphaKey && sortedB[0].locant < sortedA[0].locant) {
          chosen = b
        }
      }
    }
  }

  let baseWord = ringAlkylName(ring.atomIds.length, ring.aromatic)
  if (!ring.aromatic && chosen.doubleLocants.length > 0) {
    // e.g. "cyclohexyl" -> "cyclohex-3-en-1-yl" — the attachment point is always locant 1, spelled
    // out explicitly here (unlike a plain saturated ring substituent, which omits it) because the
    // double-bond locant alone would otherwise leave the attachment point ambiguous.
    const root = RING_ROOT[n].slice(0, -3) // "cyclohexane" -> "cyclohex"
    const sorted = [...chosen.doubleLocants].sort((x, y) => x - y)
    const linking = sorted.length > 1 ? 'a' : ''
    const mult = sorted.length > 1 ? MULTIPLYING_PREFIXES[sorted.length] ?? '' : ''
    baseWord = `${root}${linking}-${sorted.join(',')}-${mult}en-1-yl`
  }
  if (attachBondOrder === 2) baseWord = baseWord.replace(/yl$/, 'ylidene')
  if (chosen.subs.length === 0) {
    // A baseWord that's gained its own internal locant(s) (the unsaturated case above) needs
    // enclosing parentheses once embedded in the parent name, same Blue Book rule (P-16.3.3) that
    // already applies below when the ring carries other substituents — "4-(cyclohex-3-en-1-yl)-...",
    // not "4-cyclohex-3-en-1-yl-...", which would misread the ring's own locants as the parent's.
    if (baseWord.includes('-')) return { name: `(${baseWord})`, alphaKey: baseWord }
    return { name: baseWord, alphaKey: baseWord }
  }

  const groupsMap = new Map<string, { alphaKey: string; locants: number[] }>()
  for (const s of chosen.subs) {
    const entry = groupsMap.get(s.name) ?? { alphaKey: s.alphaKey, locants: [] }
    entry.locants.push(s.locant)
    groupsMap.set(s.name, entry)
  }
  const tokens = Array.from(groupsMap.entries())
    .sort((x, y) => x[1].alphaKey.localeCompare(y[1].alphaKey))
    .map(([name, { locants }]) => buildSubstituentToken(name, locants))
  const inner = `${tokens.join('-')}${baseWord}`
  return { name: `(${inner})`, alphaKey: inner }
}

/**
 * Entry point from nameMolecule.ts. Only called once the caller has already confirmed a principal
 * group exists and none of its carbons sit on the ring itself (cyclic principal groups like
 * cyclohexanone/cyclohexanol are a different, not-yet-built feature and are left to surface their
 * existing "unsupported substituent" error from ringNaming.ts instead of reaching this code).
 */
export function nameRingSubstitutedChain(
  graph: MoleculeGraph,
  ring: Ring,
  groups: GroupAnalysis
): RingSubstituentChainResult | { unsupported: string } {
  const ringSet = new Set(ring.atomIds)

  const branchRoots: { ringAtomId: string; rootId: string }[] = []
  for (const ringAtomId of ring.atomIds) {
    for (const { atom } of neighbors(graph, ringAtomId)) {
      if (!ringSet.has(atom.id) && atom.element !== 'H') {
        branchRoots.push({ ringAtomId, rootId: atom.id })
      }
    }
  }

  const principalCarbonIds = new Set(groups.principal.map((g) => g.carbonId))
  const allGroupCarbonIds = new Set([...groups.principal, ...groups.demoted].map((g) => g.carbonId))

  let mainBranch: { ringAtomId: string; rootId: string; atomIds: Set<string> } | null = null
  for (const b of branchRoots) {
    const ids = branchAtomIds(graph, ringSet, b.rootId)
    const hasPrincipal = [...principalCarbonIds].some((id) => ids.has(id))
    if (hasPrincipal) {
      if (mainBranch) {
        return { unsupported: 'The principal characteristic group is split across more than one ring substituent — not supported yet.' }
      }
      mainBranch = { ringAtomId: b.ringAtomId, rootId: b.rootId, atomIds: ids }
    }
  }
  if (!mainBranch) return { unsupported: 'Could not isolate the chain carrying the principal characteristic group.' }

  for (const b of branchRoots) {
    if (b.rootId === mainBranch.rootId) continue
    const ids = branchAtomIds(graph, ringSet, b.rootId)
    if ([...allGroupCarbonIds].some((id) => ids.has(id))) {
      return { unsupported: 'A second functional group on a different ring substituent is not supported yet.' }
    }
  }

  const ringDescriptor = nameRingAsSubstituent(graph, ring, mainBranch.ringAtomId, mainBranch.rootId)
  if (!ringDescriptor) return { unsupported: "This ring's own substitution pattern is not supported yet." }

  const subgraph = extractSubgraph(graph, mainBranch.atomIds)
  // The root atom's bond to the ring doesn't exist in this extracted subgraph, but its implicitHCount
  // (copied verbatim) still reflects that bond's effect on valence — see principalGroup.ts's
  // extraNeighborCounts doc comment for why this matters specifically for a ketone/aldehyde sitting
  // right at the ring attachment point.
  const subgroups = analyzeGroups(subgraph, new Map([[mainBranch.rootId, 1]]))
  if ('unsupported' in subgroups) return { unsupported: subgroups.unsupported }
  if (subgroups.principalType === 'ester') {
    return { unsupported: 'An ester group on a ring-attached chain is not supported yet.' }
  }

  const { candidate, ruleApplied: parentRule } = selectParentChain(subgraph, subgroups)
  const numbering = numberChain(subgraph, candidate, subgroups)
  if (numbering.unsupported) return { unsupported: numbering.unsupported }

  // mainBranch.rootId is the off-ring atom directly bonded to the ring — this whole function assumes
  // that atom IS the chain atom adjacent to the ring (e.g. "2-phenylethanol"'s C2). When the ring
  // instead connects through a spacer that parent-chain selection put on a SIDE branch rather than in
  // the numbered chain itself (e.g. a -CH2-ring group hanging off a carbon that isn't the longest
  // chain), that assumption breaks down — indexOf would silently return -1, producing locant 0 (found
  // via fuzz testing: "0-phenylpent-3-enal"). Naming the ring as part of a nested branch like that
  // isn't built, so reject honestly instead of producing an impossible locant.
  if (!numbering.orderedAtomIds.includes(mainBranch.rootId)) {
    return { unsupported: "The ring connects through a branch that isn't part of the parent chain — not supported yet." }
  }

  const attachLocant = numbering.orderedAtomIds.indexOf(mainBranch.rootId) + 1
  const substituentsWithRing: LocatedSubstituent[] = [
    ...numbering.substituents,
    { name: ringDescriptor.name, alphaKey: ringDescriptor.alphaKey, locant: attachLocant },
  ]

  const nTokens = buildNSubstituentTokens(subgraph, subgroups)
  if (nTokens === null) {
    return { unsupported: "This amine/amide nitrogen's own substituent doesn't match a supported substituent shape yet (RULES.md §5)." }
  }

  const { name, ruleApplied: assemblyRule } = assembleAcyclicName(
    {
      chainLength: candidate.length,
      doubleLocants: numbering.doubleLocants,
      tripleLocants: numbering.tripleLocants,
      principalGroupLocants: numbering.principalGroupLocants,
      principalGroupType: subgroups.principalType,
    },
    substituentsWithRing,
    nTokens
  )

  // Stereo descriptors are computed against the FULL original `graph`, not `subgraph` — CIP priority
  // for a chain stereocenter needs to "see" the real ring branch attached at `attachLocant`, which the
  // ring-stripped subgraph used for numbering doesn't have. `extractSubgraph` preserves atom ids
  // verbatim, so `numbering.orderedAtomIds` are valid lookups into `graph` too.
  const stereoPrefix = buildStereoPrefix(graph, numbering.orderedAtomIds, numbering.doubleLocants)
  const stereoExplanation = explainStereoDescriptors(graph, numbering.orderedAtomIds, numbering.doubleLocants)

  return {
    name: `${stereoPrefix}${name}`,
    ruleTrail:
      nTokens.length > 0
        ? [RULE_RING_DEMOTED, parentRule, numbering.ruleApplied, assemblyRule, explainNSubstituent(nTokens), ...stereoExplanation]
        : [RULE_RING_DEMOTED, parentRule, numbering.ruleApplied, assemblyRule, ...stereoExplanation],
    chainAtomIds: numbering.orderedAtomIds,
    ringSubstituent: { ringAtomIds: ring.atomIds, label: ringDescriptor.alphaKey },
  }
}
