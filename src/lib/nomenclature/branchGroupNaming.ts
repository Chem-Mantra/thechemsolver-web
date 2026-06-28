// V6 (2026-06-22): three or more instances of carboxylic acid / nitrile / aldehyde can't all sit at a
// chain terminus (a simple chain only has two ends), so real IUPAC switches to a different suffix
// convention for these specific classes: the group's own carbon is cited as a SUBSTITUENT-style suffix
// ("-carboxylic acid" / "-carbonitrile" / "-carbaldehyde") on a parent chain that EXCLUDES every group
// carbon, instead of the normal "-oic acid" / "-nitrile" / "-al" convention where the group's carbon IS
// one of the chain's own numbered positions. E.g. propane-1,2,3-tricarboxylic acid (3 -COOH groups on a
// 3-carbon backbone), not some impossible "propanetrioic acid". Scoped to exactly these three classes,
// all of the SAME type, with no other principal-eligible group present (RULES.md §5).
import { MoleculeGraph, neighbors, extractSubgraph } from './model'
import { isSingleComponent } from './valency'
import { GroupAnalysis, GroupInstance, GroupType } from './principalGroup'
import { selectParentChain } from './parentChain'
import { numberChain } from './numbering'
import { assembleAcyclicName } from './assembleName'
import { MULTIPLYING_PREFIXES } from './roots'

export const BRANCH_SUFFIX_WORD: Record<string, string> = {
  carboxylic_acid: 'carboxylic acid',
  nitrile: 'carbonitrile',
  aldehyde: 'carbaldehyde',
}

const ELIGIBLE_TYPES = new Set<GroupType>(['carboxylic_acid', 'nitrile', 'aldehyde'])

const RULE_BRANCH_GROUP_UNSUPPORTED = 'Branch-group naming: this particular shape is not supported yet (see the specific reason below).'

export interface BranchGroupResult {
  name: string
  ruleApplied: string
  chainAtomIds: string[]
  unsupported?: string
}

/** Returns null when this naming mode doesn't apply at all (fewer than 3 instances of an eligible
 * type) — the caller should fall through to the normal terminus-based pipeline in that case. */
export function tryBranchGroupNaming(graph: MoleculeGraph, groups: GroupAnalysis): BranchGroupResult | null {
  if (groups.principal.length < 3 || !ELIGIBLE_TYPES.has(groups.principalType as GroupType)) return null
  const type = groups.principalType as GroupType
  const suffixWord = BRANCH_SUFFIX_WORD[type]

  const groupCarbonIds = new Set(groups.principal.map((g) => g.carbonId))
  const allCarbonIds = new Set(Object.values(graph.atoms).filter((a) => a.element === 'C').map((a) => a.id))
  const backboneCarbonIds = new Set([...allCarbonIds].filter((id) => !groupCarbonIds.has(id)))
  if (backboneCarbonIds.size === 0) {
    return { name: '', ruleApplied: RULE_BRANCH_GROUP_UNSUPPORTED, chainAtomIds: [], unsupported: 'These groups have no shared carbon backbone to attach to — not supported yet.' }
  }

  // Each group carbon's one real attachment point is its only neighbor that's an actual backbone
  // carbon (its other neighbors are its own heteroatoms — =O, -OH, #N — already accounted for by the
  // group itself, never a second backbone connection by construction at this shape).
  const attachmentByGroup = new Map<GroupInstance, string>()
  for (const g of groups.principal) {
    const attach = neighbors(graph, g.carbonId).find((n) => backboneCarbonIds.has(n.atom.id))
    if (!attach) {
      return { name: '', ruleApplied: RULE_BRANCH_GROUP_UNSUPPORTED, chainAtomIds: [], unsupported: "One of these groups isn't attached to the shared backbone — not supported yet." }
    }
    attachmentByGroup.set(g, attach.atom.id)
  }

  const backbone = extractSubgraph(graph, backboneCarbonIds)
  if (!isSingleComponent(backbone)) {
    return { name: '', ruleApplied: RULE_BRANCH_GROUP_UNSUPPORTED, chainAtomIds: [], unsupported: 'These groups sit on disconnected backbone pieces — not supported yet.' }
  }

  // An attachment carbon bearing an ADDITIONAL ordinary substituent (not just chain continuation, and
  // not a second group instance sharing the same carbon, which is allowed) isn't handled by the
  // numbering step below — it treats every attachment atom as fully accounted for by its group(s),
  // same as a normal principal-group carbon, so anything else there would be silently dropped instead
  // of named. Checked against the ORIGINAL graph (not the carbon-only backbone) so a non-carbon
  // substituent like a halogen is actually seen — a carbon-only subgraph would just drop that bond.
  for (const attachId of new Set(attachmentByGroup.values())) {
    const extra = neighbors(graph, attachId).filter(
      (n) => n.atom.element !== 'H' && !groupCarbonIds.has(n.atom.id) && !backboneCarbonIds.has(n.atom.id)
    )
    if (extra.length > 0) {
      return {
        name: '',
        ruleApplied: RULE_BRANCH_GROUP_UNSUPPORTED,
        chainAtomIds: [],
        unsupported: 'A backbone carbon bearing one of these groups also has another substituent — not supported yet.',
      }
    }
  }

  // Selecting the backbone's own parent chain ignores "contains the principal group" (there is none
  // left in this subgraph) and just falls through to longest-chain / most-branching, same as any plain
  // alkane backbone.
  const noneGroups: GroupAnalysis = { principalType: 'none', principal: [], demoted: groups.demoted }
  const { candidate } = selectParentChain(backbone, noneGroups)

  // The synthetic GroupInstance list re-points each group's "carbonId" at its BACKBONE attachment atom
  // (not its real, now-excluded carbon) — numberChain's lowest-locants logic then treats every
  // attachment point as principal-group-like, exactly the priority these positions need, with no
  // changes to numbering.ts itself. Duplicate attachment atoms (two groups on the same backbone
  // carbon) collapse to one Set entry for DIRECTION comparison, which is fine — "lowest locants as a
  // set" doesn't care about multiplicity, only which positions are occupied.
  const syntheticGroups: GroupAnalysis = {
    principalType: type,
    principal: groups.principal.map((g) => ({ type, carbonId: attachmentByGroup.get(g)!, heteroatomIds: [] })),
    demoted: groups.demoted,
  }
  const numbering = numberChain(backbone, candidate, syntheticGroups)
  if (numbering.unsupported) {
    return { name: '', ruleApplied: RULE_BRANCH_GROUP_UNSUPPORTED, chainAtomIds: [], unsupported: numbering.unsupported }
  }

  // Re-derive the locant for EVERY original group instance (allowing duplicates, e.g. two groups on
  // the same backbone carbon both legitimately get that carbon's locant) — numbering.principalGroupLocants
  // came from a Set-deduped comparison and can't be reused directly for the final multi-locant suffix.
  const locantOf = new Map(numbering.orderedAtomIds.map((id, idx) => [id, idx + 1]))
  const suffixLocants = groups.principal.map((g) => locantOf.get(attachmentByGroup.get(g)!)!).sort((a, b) => a - b)

  const { name: baseName } = assembleAcyclicName(
    {
      chainLength: candidate.length,
      doubleLocants: numbering.doubleLocants,
      tripleLocants: numbering.tripleLocants,
      principalGroupLocants: [],
      principalGroupType: 'none',
    },
    numbering.substituents
  )
  const mult = MULTIPLYING_PREFIXES[suffixLocants.length] ?? ''
  const name = `${baseName}-${suffixLocants.join(',')}-${mult}${suffixWord}`

  const ruleApplied =
    `Step 2 — ${groups.principal.length} instances of -${suffixWord === 'carboxylic acid' ? 'COOH' : suffixWord === 'carbonitrile' ? 'CN' : 'CHO'} can't all sit at a chain ` +
    `terminus (a chain only has two ends), so each group's own carbon is excluded from the parent chain (leaving a ` +
    `${candidate.length}-carbon backbone) and cited instead as the substituent-style suffix "-${suffixWord}" at ` +
    `C${suffixLocants.join(', C')}, giving "${name}".`

  return { name, ruleApplied, chainAtomIds: numbering.orderedAtomIds }
}
