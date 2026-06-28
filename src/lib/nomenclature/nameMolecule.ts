import { MoleculeGraph, neighbors, addAtom, addBond, extractSubgraph, connectedComponent } from './model'
import { fillImplicitHydrogens, validateValency, isSingleComponent } from './valency'
import { computeFormula } from './formula'
import { analyzeGroups, GroupAnalysis, explainPrincipalGroupChoice } from './principalGroup'
import { selectParentChain } from './parentChain'
import { numberChain } from './numbering'
import { assembleAcyclicName } from './assembleName'
import { nameRing } from './ringNaming'
import { nameRingSubstitutedChain } from './ringSubstituentChain'
import { classifyTwoRings, nameSpiroCompound, nameFusedBicyclic } from './polycyclicNaming'
import { tryBranchGroupNaming, BRANCH_SUFFIX_WORD } from './branchGroupNaming'
import { lookupCommonName } from './commonNames'
import { explainRuleTrail } from './explain'
import { nameSubstituent } from './substituents'
import { MULTIPLYING_PREFIXES } from './roots'
import { buildNSubstituentTokens, explainNSubstituent } from './nSubstituents'
import { buildStereoPrefix, explainStereoDescriptors } from './stereo'

/** Builds the "...anoic"-style acid name (with " acid" stripped) for one acyl branch of an anhydride,
 * by extracting that branch (everything reachable from `acylCarbonId` without crossing the bridging
 * oxygen) into its own standalone graph, attaching a SYNTHETIC -OH to turn it into a complete,
 * ordinary carboxylic acid, and recursively running the full naming pipeline on it — reusing every
 * existing rule (substituents, rings, unsaturation...) instead of duplicating any of it. Returns null
 * if that branch doesn't end up naming as a plain carboxylic acid (an unsupported shape inside it). */
function nameAnhydrideBranch(graph: MoleculeGraph, acylCarbonId: string, bridgeOId: string): string | null {
  const branchIds = connectedComponent(graph, acylCarbonId, (atom) => atom.id !== bridgeOId)
  const branch = extractSubgraph(graph, branchIds)
  const oh = addAtom(branch, 'O', 0, 0)
  addBond(branch, acylCarbonId, oh.id, 1)
  const result = nameMolecule(branch)
  if (!result.iupacName || !result.iupacName.endsWith(' acid')) return null
  return result.iupacName.slice(0, -' acid'.length)
}

/** Detects the anhydride bridge (an oxygen singly-bonded to exactly two carbons, each of which also
 * bears its own C=O) and, if found, names the whole molecule from its two acyl branches. Returns null
 * when there's no such bridge at all, so the caller falls through to the normal pipeline — checked
 * BEFORE the ring-count branches since an anhydride's own bridge is never part of a ring, but either
 * of its acyl branches independently might contain one (e.g. "benzoic propanoic anhydride"), which
 * must be resolved by the RECURSIVE call on that branch alone, not by this function or the outer
 * ring-counting logic looking at the molecule as a whole. */
const RULE_ANHYDRIDE_UNSUPPORTED = 'Anhydride naming: this particular anhydride shape is not supported yet (see the specific reason below).'

function tryAnhydrideNaming(graph: MoleculeGraph): { name: string; ruleApplied: string; chainAtomIds: string[]; unsupported?: string } | null {
  const oxygens = Object.values(graph.atoms).filter((a) => a.element === 'O')
  const bridges = oxygens.filter((o) => {
    const ns = neighbors(graph, o.id)
    if (ns.length !== 2 || ns.some((n) => n.atom.element !== 'C' || n.bond.order !== 1)) return false
    return ns.every((n) => neighbors(graph, n.atom.id).some((m) => m.atom.element === 'O' && m.atom.id !== o.id && m.bond.order === 2))
  })
  if (bridges.length === 0) return null
  if (bridges.length > 1) {
    return { name: '', ruleApplied: RULE_ANHYDRIDE_UNSUPPORTED, chainAtomIds: [], unsupported: 'More than one anhydride bridge in the same molecule is not supported yet.' }
  }
  const bridge = bridges[0]
  const [c1, c2] = neighbors(graph, bridge.id).map((n) => n.atom.id)

  const branch1 = connectedComponent(graph, c1, (atom) => atom.id !== bridge.id)
  const branch2 = connectedComponent(graph, c2, (atom) => atom.id !== bridge.id)
  if ([...branch1].some((id) => branch2.has(id))) {
    return { name: '', ruleApplied: RULE_ANHYDRIDE_UNSUPPORTED, chainAtomIds: [], unsupported: 'A cyclic anhydride (the bridge closing into a ring) is not supported yet.' }
  }

  const name1 = nameAnhydrideBranch(graph, c1, bridge.id)
  const name2 = nameAnhydrideBranch(graph, c2, bridge.id)
  if (name1 === null || name2 === null) {
    return { name: '', ruleApplied: RULE_ANHYDRIDE_UNSUPPORTED, chainAtomIds: [], unsupported: "One of this anhydride's two acyl groups doesn't match a supported acid shape yet (RULES.md §5)." }
  }
  const chainAtomIds = [...branch1, ...branch2]
  const lead = 'Step 1 — This is an anhydride: two acyl groups joined by a shared bridging oxygen, so each acyl branch is named as its own acid first.'
  if (name1 === name2) {
    return {
      name: `${name1} anhydride`,
      ruleApplied: `${lead} Both branches name to the same acid, "${name1} acid" — for a symmetric anhydride, " acid" is simply replaced by "anhydride", giving "${name1} anhydride".`,
      chainAtomIds,
    }
  }
  // Alphabetized ignoring any leading locant (e.g. "2-methylpropanoic" sorts as "methylpropanoic",
  // after "ethanoic") — a plain string sort would wrongly put a digit-led name first (ASCII digits
  // sort before letters), found by checking a branched-acid mixed anhydride against OPSIN.
  const stripLocant = (n: string) => n.replace(/^[\d,]+-/, '')
  const [a, b] = [name1, name2].sort((x, y) => stripLocant(x).localeCompare(stripLocant(y)))
  return {
    name: `${a} ${b} anhydride`,
    ruleApplied:
      `${lead} The two branches name to different acids — "${name1} acid" and "${name2} acid" — so this is a MIXED ` +
      `anhydride: both acid names are cited alphabetically, space-separated ("${a}" before "${b}"), before "anhydride".`,
    chainAtomIds,
  }
}

const RULE_ESTER_UNSUPPORTED = "This ester's O-alkyl group doesn't match a supported substituent shape yet (RULES.md §5)."

/** Esters are named as a separate leading word ("methyl propanoate"), never fused into the parent
 * core string the way every other suffix is — this builds and prepends that word. A diester where
 * every instance shares the same O-alkyl group multiplies it ("dimethyl butanedioate"); a MIXED
 * diester (different O-alkyl group per instance, e.g. "1-ethyl 4-methyl butanedioate") instead gives
 * each its own explicit locant — found by checking which chain position its own carbonyl carbon sits
 * at, since an ester's carbon (when principal) is itself a numbered chain atom — alphabetized like
 * any other prefix list (RULES.md §5, 2026-06-23). */
function withEsterAlkylWord(
  graph: MoleculeGraph,
  groups: GroupAnalysis,
  orderedAtomIds: string[],
  name: string,
  ruleTrail: string[]
): { name: string; ruleTrail: string[]; unsupported?: string } {
  if (groups.principalType !== 'ester') return { name, ruleTrail }
  const instances = groups.principal
  // heteroatomIds is [doubleO, bridgeO] for an ester (principalGroup.ts) — the alkyl root is bonded
  // to the bridge oxygen, not directly to the acyl carbon, so that's the correct "arrived from" atom.
  const named = instances.map((g) => (g.esterAlkylRootId ? nameSubstituent(graph, g.esterAlkylRootId, g.heteroatomIds[1]) : null))
  if (named.some((n) => !n)) {
    // The O-alkyl group itself is a shape nameSubstituent doesn't support (e.g. a halogen-bearing
    // composite branch like "chloromethyl") — this used to silently return the suffix alone
    // ("ethanoate" with the whole O-alkyl word missing) instead of failing honestly, a real bug found
    // via fuzz testing: a wrong/incomplete name is far more dangerous than a clear rejection.
    return { name, ruleTrail, unsupported: RULE_ESTER_UNSUPPORTED }
  }
  const names = named.map((n) => n!.name)
  const lead = `Step 5 — Esters are named as two words: the O-alkyl group first, then the acyl chain with the suffix "-oate".`
  if (new Set(names).size === 1) {
    const mult = instances.length > 1 ? MULTIPLYING_PREFIXES[instances.length] ?? '' : ''
    const esterRule =
      instances.length > 1
        ? `${lead} All ${instances.length} ester instances share the same O-alkyl group, "${names[0]}", so it's cited once with the multiplying prefix "${mult}": "${mult}${names[0]}".`
        : `${lead} The O-alkyl group here is "${names[0]}", giving "${names[0]} ${name}".`
    return { name: `${mult}${names[0]} ${name}`, ruleTrail: [...ruleTrail, esterRule] }
  }
  const tokens = instances
    .map((g, i) => ({ locant: orderedAtomIds.indexOf(g.carbonId) + 1, name: names[i] }))
    .sort((a, b) => a.name.localeCompare(b.name))
  const word = tokens.map((t) => `${t.locant}-${t.name}`).join(' ')
  const esterRule =
    `${lead} This is a MIXED diester — the O-alkyl groups differ per instance (${tokens.map((t) => `"${t.name}" at C${t.locant}`).join(', ')}), ` +
    `so each gets its own explicit locant, alphabetized: "${word}".`
  return { name: `${word} ${name}`, ruleTrail: [...ruleTrail, esterRule] }
}


export interface NamingResult {
  iupacName?: string
  commonName?: string
  molecularFormula?: string
  explanation: string[]
  error?: string
  /** Parent chain/ring atom ids in locant order (index 0 = locant 1) — for the "highlight parent chain" / numbering overlays. */
  chainAtomIds?: string[]
  /** 'ring' when the ring itself is the parent (chainAtomIds are ring atoms); 'chain' when an
   * off-ring substituent chain was promoted to parent and the ring is cited as a prefix instead —
   * tells the structural-formula panel which renderer matches the chosen name. */
  parentKind?: 'ring' | 'chain'
  /** Set only when parentKind is 'chain' and a ring is still present (demoted to a substituent) —
   * lets the structural-formula panel render that branch as a fixed tag instead of recursing into it. */
  ringSubstituent?: { ringAtomIds: string[]; label: string }
}

function explainTwoRingClassification(relation: { kind: 'spiro' | 'fused' | 'unsupported'; sharedAtomIds: string[] }): string {
  if (relation.kind === 'spiro') {
    return 'This molecule has two rings sharing exactly one atom — that single shared atom is a spiro union, so this is a spiro bicyclic system.'
  }
  if (relation.kind === 'fused') {
    return 'This molecule has two rings sharing two adjacent (bonded) atoms — that shared bond makes this an ortho-fused bicyclic system.'
  }
  if (relation.sharedAtomIds.length === 0) {
    return 'This molecule has two rings that share no atoms at all — they must be joined by a connecting chain instead, which is a shape this engine doesn\'t name yet.'
  }
  return (
    `This molecule has two rings sharing ${relation.sharedAtomIds.length} atoms that aren't directly bonded to each other — ` +
    'neither a spiro union (exactly one shared atom) nor an ortho-fused system (two shared, BONDED atoms) — a general bridged polycyclic system like this is out of scope.'
  )
}

/** The single entry point — orchestrates steps 1-8 of the pipeline (RULES.md). Pure function. */
export function nameMolecule(rawGraph: MoleculeGraph): NamingResult {
  if (Object.keys(rawGraph.atoms).length === 0) {
    return { explanation: [], error: 'Empty structure — place an atom to begin.' }
  }
  if (!isSingleComponent(rawGraph)) {
    return { explanation: [], error: "This structure has disconnected pieces — V1 names one connected molecule at a time." }
  }

  const filled = fillImplicitHydrogens(rawGraph)
  const validation = validateValency(filled)
  if (!validation.ok) {
    return { explanation: [], error: `Invalid structure: ${validation.reason}.` }
  }
  const molecularFormula = computeFormula(filled)

  const anhydride = tryAnhydrideNaming(filled)
  if (anhydride) {
    if (anhydride.unsupported) {
      return { molecularFormula, explanation: [anhydride.ruleApplied], error: anhydride.unsupported }
    }
    return {
      iupacName: anhydride.name,
      commonName: lookupCommonName(anhydride.name),
      molecularFormula,
      explanation: explainRuleTrail([anhydride.ruleApplied]),
      chainAtomIds: anhydride.chainAtomIds,
      parentKind: 'chain',
    }
  }

  if (filled.rings.length > 2) {
    return {
      molecularFormula,
      explanation: [],
      error: 'More than two rings (polycyclic systems beyond spiro/ortho-fused) are out of scope (RULES.md §5).',
    }
  }

  if (filled.rings.length === 2) {
    const [ringA, ringB] = filled.rings
    const relation = classifyTwoRings(filled, ringA, ringB)
    const classificationRule = explainTwoRingClassification(relation)
    if (relation.kind === 'unsupported') {
      return { molecularFormula, explanation: [classificationRule], error: relation.unsupportedReason }
    }
    const poly =
      relation.kind === 'spiro'
        ? nameSpiroCompound(filled, ringA, ringB, relation.sharedAtomIds[0])
        : nameFusedBicyclic(filled, ringA, ringB, relation.sharedAtomIds[0], relation.sharedAtomIds[1])
    if (poly.unsupported) {
      return { molecularFormula, explanation: [classificationRule, poly.ruleApplied], error: poly.unsupported }
    }
    return {
      iupacName: poly.name,
      commonName: lookupCommonName(poly.name),
      molecularFormula,
      explanation: explainRuleTrail([classificationRule, poly.ruleApplied]),
      chainAtomIds: poly.orderedAtomIds,
      parentKind: 'ring',
    }
  }

  if (filled.rings.length === 1) {
    const ringAtom = filled.rings[0]
    const wholeGraphGroups = analyzeGroups(filled)
    const hasOffRingPrincipalGroup =
      !('unsupported' in wholeGraphGroups) &&
      wholeGraphGroups.principalType !== 'none' &&
      wholeGraphGroups.principal.every((g) => !ringAtom.atomIds.includes(g.carbonId))

    if (hasOffRingPrincipalGroup) {
      const composite = nameRingSubstitutedChain(filled, ringAtom, wholeGraphGroups as GroupAnalysis)
      if ('unsupported' in composite) {
        return { molecularFormula, explanation: [], error: composite.unsupported }
      }
      return {
        iupacName: composite.name,
        commonName: lookupCommonName(composite.name),
        molecularFormula,
        explanation: explainRuleTrail(composite.ruleTrail),
        chainAtomIds: composite.chainAtomIds,
        parentKind: 'chain',
        ringSubstituent: composite.ringSubstituent,
      }
    }

    const ring = nameRing(filled, ringAtom)
    if (ring.unsupported) {
      return { molecularFormula, explanation: ring.ruleApplied, error: ring.unsupported }
    }
    return {
      iupacName: ring.name,
      commonName: lookupCommonName(ring.name),
      molecularFormula,
      explanation: explainRuleTrail(ring.ruleApplied),
      chainAtomIds: ring.orderedAtomIds,
      parentKind: 'ring',
    }
  }

  const groupsResult = analyzeGroups(filled)
  if ('unsupported' in groupsResult) {
    return { molecularFormula, explanation: [], error: groupsResult.unsupported }
  }
  const groups = groupsResult as GroupAnalysis
  const branchGroup = tryBranchGroupNaming(filled, groups)
  const principalGroupRule = explainPrincipalGroupChoice(groups, branchGroup ? BRANCH_SUFFIX_WORD[groups.principalType] : undefined)

  if (branchGroup) {
    if (branchGroup.unsupported) {
      return { molecularFormula, explanation: [principalGroupRule, branchGroup.ruleApplied], error: branchGroup.unsupported }
    }
    return {
      iupacName: branchGroup.name,
      commonName: lookupCommonName(branchGroup.name),
      molecularFormula,
      explanation: explainRuleTrail([principalGroupRule, branchGroup.ruleApplied]),
      chainAtomIds: branchGroup.chainAtomIds,
      parentKind: 'chain',
    }
  }

  const { candidate, ruleApplied: parentRule } = selectParentChain(filled, groups)
  const numbering = numberChain(filled, candidate, groups)
  if (numbering.unsupported) {
    return { molecularFormula, explanation: [principalGroupRule, parentRule, numbering.ruleApplied], error: numbering.unsupported }
  }

  const nTokens = buildNSubstituentTokens(filled, groups)
  if (nTokens === null) {
    return {
      molecularFormula,
      explanation: [principalGroupRule, parentRule, numbering.ruleApplied],
      error: "This amine/amide nitrogen's own substituent doesn't match a supported substituent shape yet (RULES.md §5).",
    }
  }

  const { name: assembledName, ruleApplied: assemblyRule } = assembleAcyclicName(
    {
      chainLength: candidate.length,
      doubleLocants: numbering.doubleLocants,
      tripleLocants: numbering.tripleLocants,
      principalGroupLocants: numbering.principalGroupLocants,
      principalGroupType: groups.principalType,
    },
    numbering.substituents,
    nTokens
  )
  const baseRuleTrail =
    nTokens.length > 0
      ? [principalGroupRule, parentRule, numbering.ruleApplied, assemblyRule, explainNSubstituent(nTokens)]
      : [principalGroupRule, parentRule, numbering.ruleApplied, assemblyRule]
  // The stereo prefix belongs on the ACYL part specifically, not the whole two-word ester name — it
  // must be applied to assembledName BEFORE withEsterAlkylWord prepends the O-alkyl word in front,
  // otherwise "(2Z)-but-2-en-1-yl but-2-enoate" reads (and OPSIN parses it) as the Z applying to the
  // ALKYL chain's own locant 2, not the acyl chain's — found via fuzz testing on an ester whose O-alkyl
  // group also happened to contain a double bond.
  const stereoPrefix = buildStereoPrefix(filled, numbering.orderedAtomIds, numbering.doubleLocants)
  const stereoExplanation = explainStereoDescriptors(filled, numbering.orderedAtomIds, numbering.doubleLocants)
  const { name, ruleTrail, unsupported: esterUnsupported } = withEsterAlkylWord(
    filled,
    groups,
    numbering.orderedAtomIds,
    `${stereoPrefix}${assembledName}`,
    baseRuleTrail
  )
  if (esterUnsupported) {
    return { molecularFormula, explanation: baseRuleTrail, error: esterUnsupported }
  }

  const finalName = name

  return {
    iupacName: finalName,
    commonName: lookupCommonName(finalName),
    molecularFormula,
    explanation: explainRuleTrail([...ruleTrail, ...stereoExplanation]),
    chainAtomIds: numbering.orderedAtomIds,
    parentKind: 'chain',
  }
}
