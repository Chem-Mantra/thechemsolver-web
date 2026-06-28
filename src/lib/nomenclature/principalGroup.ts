import { MoleculeGraph, neighbors, AtomNode } from './model'
import { nameSubstituent } from './substituents'
import { isNitroNitrogen } from './valency'

export type GroupType =
  | 'carboxylic_acid'
  | 'ester'
  | 'acid_fluoride'
  | 'acid_chloride'
  | 'acid_bromide'
  | 'acid_iodide'
  | 'amide'
  | 'nitrile'
  | 'aldehyde'
  | 'ketone'
  | 'alcohol'
  | 'amine'

export interface GroupInstance {
  type: GroupType
  carbonId: string
  heteroatomIds: string[]
  /** Ester only: first carbon of the O-alkyl group, named as a separate leading word (e.g. "methyl" in "methyl propanoate"). */
  esterAlkylRootId?: string
  /** Amine/amide only: carbon(s) bonded directly to the group's own nitrogen besides the "host" bond
   * (for amine, every OTHER carbon on that same nitrogen besides the chosen parent-chain carbon; for
   * amide, every carbon on the nitrogen at all, since the acyl carbon is already fixed elsewhere) —
   * cited as "N-methyl"/"N,N-dimethyl" prefixes (Blue Book P-66.6.1.2), never folded into the ordinary
   * numbered-substituent list since an N-substituent's locant is always the letter "N", not a chain
   * position. Empty/absent for a plain primary amine or unsubstituted amide. */
  nSubstituentIds?: string[]
}

export interface GroupAnalysis {
  principalType: GroupType | 'none'
  /** All instances of the principal (most senior present) type — the suffix, possibly multi-locant (diol, dione, dinitrile...). */
  principal: GroupInstance[]
  /** Every other instance, of any other type — becomes an ordinary prefix (hydroxy/amino/oxo/cyano/carbamoyl...). */
  demoted: GroupInstance[]
}

/** Blue Book P-41 Table 4.1 seniority order, restricted to the classes this engine supports (RULES.md §1/§5). */
export const SENIORITY_ORDER: GroupType[] = [
  'carboxylic_acid',
  'ester',
  'acid_fluoride',
  'acid_chloride',
  'acid_bromide',
  'acid_iodide',
  'amide',
  'nitrile',
  'aldehyde',
  'ketone',
  'alcohol',
  'amine',
]

export const SUFFIX_WORD: Record<GroupType, string> = {
  carboxylic_acid: 'oic acid',
  ester: 'oate',
  acid_fluoride: 'oyl fluoride',
  acid_chloride: 'oyl chloride',
  acid_bromide: 'oyl bromide',
  acid_iodide: 'oyl iodide',
  amide: 'amide',
  nitrile: 'nitrile',
  aldehyde: 'al',
  ketone: 'one',
  alcohol: 'ol',
  amine: 'amine',
}

/** Prefix used when a group of this type is present but NOT the principal (most senior) one. Every
 * entry here is a fixed string — ester is the one type whose demoted prefix is instance-dependent
 * (varies with the O-alkyl group), so it's handled separately wherever PREFIX_WORD is consulted. */
export const PREFIX_WORD: Record<GroupType, string> = {
  carboxylic_acid: 'carboxy',
  ester: 'oxycarbonyl', // placeholder — ester demotion is computed specially, never read from here
  acid_fluoride: 'fluorocarbonyl',
  acid_chloride: 'chlorocarbonyl',
  acid_bromide: 'bromocarbonyl',
  acid_iodide: 'iodocarbonyl',
  amide: 'carbamoyl',
  nitrile: 'cyano',
  // A demoted aldehyde's own carbon is always a numbered chain position (aldehyde carbons are
  // always chain-terminus by construction, so they're always either a principal carbon or forced
  // onto the chosen chain) — from the chain's perspective that's indistinguishable from a chain-
  // terminal C=O, i.e. the same "oxo" word a demoted ketone uses, not "formyl" (which would only be
  // correct for a genuinely separate -CHO branch off the chain — a shape this engine doesn't reach,
  // since substituents.ts's heteroatom check rejects such a branch as unsupported rather than
  // mis-describing it).
  aldehyde: 'oxo',
  ketone: 'oxo',
  alcohol: 'hydroxy',
  amine: 'amino',
}

/** Suffix words that don't start with a vowel don't trigger the "-ane" -> "-an-" elision (P-affix rules)
 * — only nitrile needs this ("ethanenitrile", not "ethannitrile"); every other suffix here is vowel-initial. */
export const NO_ELISION_TYPES: GroupType[] = ['nitrile']

/** Plain-English short name for each group type ("carboxylic acid", "acid fluoride"...) — used when the
 * name needs to read naturally mid-sentence (e.g. "X outranks Y"), unlike GROUP_DISPLAY below which
 * always carries its formula and reads awkwardly if truncated to one word. */
const GROUP_SHORT_NAME: Record<GroupType, string> = {
  carboxylic_acid: 'carboxylic acid',
  ester: 'ester',
  acid_fluoride: 'acid fluoride',
  acid_chloride: 'acid chloride',
  acid_bromide: 'acid bromide',
  acid_iodide: 'acid iodide',
  amide: 'amide',
  nitrile: 'nitrile',
  aldehyde: 'aldehyde',
  ketone: 'ketone',
  alcohol: 'alcohol',
  amine: 'amine',
}

/** Plain-English name for each group type, used only in the step-by-step explanation — never in the
 * assembled IUPAC name itself (that's SUFFIX_WORD/PREFIX_WORD's job). */
const GROUP_DISPLAY: Record<GroupType, string> = {
  carboxylic_acid: 'carboxylic acid (-COOH)',
  ester: 'ester (-COO-)',
  acid_fluoride: 'acid fluoride (-COF)',
  acid_chloride: 'acid chloride (-COCl)',
  acid_bromide: 'acid bromide (-COBr)',
  acid_iodide: 'acid iodide (-COI)',
  amide: 'amide (-CONH2)',
  nitrile: 'nitrile (-CN)',
  aldehyde: 'aldehyde (-CHO)',
  ketone: 'ketone (C=O)',
  alcohol: 'alcohol (-OH)',
  amine: 'amine (-NH2)',
}

/** Builds the very first step of the explanation — identifying which characteristic group becomes the
 * suffix and which others get demoted to prefixes — something the rest of the naming pipeline never
 * spelled out explicitly before (RULES.md V18 step-by-step round, 2026-06-24): it just silently fed the
 * already-decided principalType into parent chain selection. This walks a student through the actual
 * decision: what's present, and why one outranks the rest.
 */
export function explainPrincipalGroupChoice(groups: GroupAnalysis, suffixOverride?: string): string {
  if (groups.principalType === 'none') {
    return (
      'Step 1 — Find the principal characteristic group: none of -COOH, -COOR (ester), -COX (acid halide), ' +
      '-CONH2 (amide), -CN (nitrile), -CHO (aldehyde), C=O (ketone), -OH (alcohol), or -NH2 (amine) is ' +
      'present anywhere in this structure. With no characteristic group to name as a suffix, the molecule ' +
      'is named as a plain hydrocarbon — any halogens or other branches are cited only as ordinary prefixes.'
    )
  }

  const principalType = groups.principalType
  const principalCount = groups.principal.length
  const principalDisplay = GROUP_DISPLAY[principalType]
  const principalCountWord = principalCount > 1 ? `${principalCount} ` : ''
  const principalPlural = principalCount > 1 ? 's' : ''
  // 3+ instances of carboxylic_acid/nitrile/aldehyde can't all sit chain-terminal, so the suffix actually
  // used ends up "-carboxylic acid"/"-carbonitrile"/"-carbaldehyde" (branchGroupNaming.ts), not the normal
  // terminal-position "-oic acid"/"-nitrile"/"-al" SUFFIX_WORD — without this override this step would
  // describe a suffix the assembled name never actually uses.
  const suffixWord = suffixOverride ?? SUFFIX_WORD[principalType]

  const otherTypesPresent = Array.from(new Set(groups.demoted.map((g) => g.type)))
  if (otherTypesPresent.length === 0) {
    return (
      `Step 1 — Find the principal characteristic group: found ${principalCountWord}${principalDisplay} group${principalPlural} ` +
      `and nothing else competing for the suffix, so it becomes the principal characteristic group — ` +
      `named with the suffix "-${suffixWord}".`
    )
  }

  const otherDisplays = otherTypesPresent.map((t) => GROUP_DISPLAY[t]).join(' and ')
  const rankOf = (t: GroupType) => SENIORITY_ORDER.indexOf(t)
  const outranked = otherTypesPresent.filter((t) => rankOf(t) > rankOf(principalType)).map((t) => GROUP_DISPLAY[t])
  // PREFIX_WORD per TYPE here, not the full instance-specific demotedPrefixWord (which needs the graph
  // and can build a compound "methylamino"-style word) — this is just a quick "what does it become"
  // preview, the real prefix word is computed properly later when the name is actually assembled.
  const demotedWords = Array.from(new Set(otherTypesPresent.map((t) => `"${PREFIX_WORD[t]}"`)))
  return (
    `Step 1 — Find the principal characteristic group: this structure has more than one kind of ` +
    `characteristic group — ${principalCountWord}${principalDisplay}${principalPlural} as well as ${otherDisplays}. ` +
    `Checking seniority order (acids outrank esters, which outrank acid halides, then amides, nitriles, ` +
    `aldehydes, ketones, alcohols, and amines): ${GROUP_SHORT_NAME[principalType]} outranks ${outranked.join(', ') || 'the others'}, ` +
    `so it wins and becomes the principal characteristic group (suffix "-${suffixWord}"). ` +
    `Every other group present is demoted to an ordinary prefix instead (${demotedWords.join(', ')}).`
  )
}

export interface DemotedPrefix {
  /** The literal text to splice into the assembled name (already enclosed in parentheses when it's a
   * compound amino/carbamoyl prefix — see below). */
  word: string
  /** The unwrapped text to alphabetize by — a leading "(" would otherwise sort before every letter. */
  alphaKey: string
}

/** The demoted-prefix word for a GroupInstance — every type besides ester is the fixed PREFIX_WORD
 * string; ester's varies with its own O-alkyl group ("methyl" -> "methoxycarbonyl", "isopropyl" ->
 * "isopropoxycarbonyl"...), so it's computed here instead of being a literal PREFIX_WORD entry (whose
 * "oxycarbonyl" placeholder is never meant to be read directly). Returns null only when the ester's
 * O-alkyl group itself doesn't match a supported substituent shape — callers should propagate that as
 * an "unsupported" result rather than guessing a name. */
export function demotedPrefixWord(graph: MoleculeGraph, instance: GroupInstance): DemotedPrefix | null {
  if (instance.type === 'ester') {
    if (!instance.esterAlkylRootId) return null
    const alkyl = nameSubstituent(graph, instance.esterAlkylRootId, instance.heteroatomIds[1])
    if (!alkyl || !alkyl.name.endsWith('yl')) return null
    const word = `${alkyl.name.slice(0, -2)}oxycarbonyl`
    return { word, alphaKey: word }
  }
  if ((instance.type === 'amine' || instance.type === 'amide') && instance.nSubstituentIds?.length) {
    // The nitrogen never needs its own "N-" locant in this PREFIX form (unlike the suffix case in
    // nSubstituents.ts) — there's nothing else it could be substituted on, since "amino"/"carbamoyl"'s
    // only other bond is the fixed one to its host/acyl carbon. Enclosing parens ARE required though —
    // OPSIN flagged "3-methylaminopropanoic acid" as ambiguous, and "3-ethylmethylaminopropanoic acid"
    // (two DIFFERENT substituents) round-tripped to a completely different structure without them;
    // "3-(ethylmethylamino)propanoic acid" round-trips correctly.
    const nitrogenId = instance.type === 'amide' ? instance.heteroatomIds[1] : instance.heteroatomIds[0]
    const names = instance.nSubstituentIds.map((id) => nameSubstituent(graph, id, nitrogenId))
    if (names.some((n) => !n)) return null
    const sorted = [...(names as NonNullable<(typeof names)[number]>[])].sort((a, b) => a.name.localeCompare(b.name))
    const joined =
      sorted.length === 2 && sorted[0].name === sorted[1].name ? `di${sorted[0].name}` : sorted.map((n) => n.name).join('')
    const alphaKey = `${joined}${PREFIX_WORD[instance.type]}`
    return { word: `(${alphaKey})`, alphaKey }
  }
  return { word: PREFIX_WORD[instance.type], alphaKey: PREFIX_WORD[instance.type] }
}

/** These always sit at the chain terminus by construction, so their locant is conventionally never
 * shown (RULES.md): "butanoic acid", "butanal", "methyl butanoate", "butanoyl chloride", "butanamide",
 * "butanenitrile" — never "butan-1-oic acid" etc. */
export const ALWAYS_OMIT_LOCANT_TYPES: GroupType[] = [
  'carboxylic_acid',
  'ester',
  'acid_fluoride',
  'acid_chloride',
  'acid_bromide',
  'acid_iodide',
  'amide',
  'nitrile',
  'aldehyde',
]

const HALOGENS = new Set(['F', 'Cl', 'Br', 'I'])
const ACID_HALIDE_TYPE: Record<string, GroupType> = {
  F: 'acid_fluoride',
  Cl: 'acid_chloride',
  Br: 'acid_bromide',
  I: 'acid_iodide',
}

/** Types whose demotion this engine doesn't build (beyond blocking them outright when more than one
 * is present) — anhydrides specifically, since they span two carbons via a bridging oxygen and don't
 * fit the single-carbon GroupInstance shape at all yet. */
const ANHYDRIDE_UNSUPPORTED_MESSAGE =
  'Anhydrides are not supported yet (RULES.md §5) — naming one needs special bridging-oxygen parent-chain handling this round doesn\'t cover.'

type Analysis = GroupAnalysis | { unsupported: string }

/** BFS count of every carbon reachable from `startId` without crossing back through `excludeId` (the
 * nitrogen) — used to pick which of a secondary/tertiary amine's nitrogen's carbon branches is the
 * longest (becomes the parent chain), the rest become "N-..." prefixes. Branching-agnostic (counts
 * the whole subtree, not just a straight walk) since an N-substituent can itself be a branched shape
 * (e.g. N-isopropyl). */
function carbonSubtreeSize(graph: MoleculeGraph, startId: string, excludeId: string): number {
  const visited = new Set<string>([startId])
  const stack = [startId]
  while (stack.length) {
    const current = stack.pop()!
    for (const { atom } of neighbors(graph, current)) {
      if (atom.element !== 'C' || atom.id === excludeId || visited.has(atom.id)) continue
      visited.add(atom.id)
      stack.push(atom.id)
    }
  }
  return visited.size
}

/**
 * Scans every carbon for -COOH / -COO-R (ester) / -COX (acid halide) / -CONH2 (amide) / -C#N
 * (nitrile) / -CHO / C=O(ketone) / -OH, and every nitrogen for -NH2/-NHR/-NR2, then applies
 * seniority (RULES.md §1) to decide which type is the principal characteristic group (suffix)
 * versus demoted to a prefix. Plain ethers (C-O-C, neither side a carbonyl) are intentionally
 * never added here — they're named later as an "alkoxy" substituent prefix (substituents.ts),
 * since ethers have no suffix form in Table 4.1 at all.
 *
 * Anhydrides are detected and rejected here too (see ANHYDRIDE_UNSUPPORTED_MESSAGE) as a fallback —
 * the real anhydride naming lives in nameMolecule.ts's tryAnhydrideNaming, which runs first and
 * intercepts the shape before this function is even reached for a true anhydride.
 */
export function analyzeGroups(graph: MoleculeGraph, extraNeighborCounts?: Map<string, number>): Analysis {
  const found: GroupInstance[] = []
  const usedNitrogenIds = new Set<string>()
  const carbons = Object.values(graph.atoms).filter((a) => a.element === 'C')

  for (const c of carbons) {
    const ns = neighbors(graph, c.id)
    const oxygenLinks = ns.filter((n) => n.atom.element === 'O')
    const nitrogenLinks = ns.filter((n) => n.atom.element === 'N')
    const halogenLinks = ns.filter((n) => HALOGENS.has(n.atom.element))

    const doubleO = oxygenLinks.find((n) => n.bond.order === 2)
    const singleOH = oxygenLinks.find((n) => n.bond.order === 1 && n.atom.implicitHCount === 1)
    const singleOEther = oxygenLinks.find((n) => n.bond.order === 1 && n.atom.implicitHCount === 0)
    const tripleN = nitrogenLinks.find((n) => n.bond.order === 3)
    // An amide nitrogen may carry 0, 1, or 2 of its OWN carbon substituents besides the acyl carbon
    // (plain -CONH2, N-alkyl -CONHR, or N,N-dialkyl -CONR2) — those extra carbons are cited later as
    // "N-methyl"/"N,N-dimethyl" prefixes (Blue Book P-66.6.1.2), not folded into the chain. Found via
    // the user's explicit request to build this (RULES.md §5 — previously any nitrogen shape besides
    // bare -NH2 was rejected outright as "malformed").
    const amideNCandidate = nitrogenLinks.find((n) => n.bond.order === 1)
    let amideN: typeof amideNCandidate | undefined
    let amideNSubstituentIds: string[] = []
    if (amideNCandidate) {
      const nNeighbors = neighbors(graph, amideNCandidate.atom.id)
      const otherCarbons = nNeighbors.filter((x) => x.atom.element === 'C' && x.atom.id !== c.id)
      const otherHeteroatoms = nNeighbors.filter((x) => x.atom.id !== c.id && x.atom.element !== 'C' && x.atom.element !== 'H')
      if (
        otherCarbons.length <= 2 &&
        otherHeteroatoms.length === 0 &&
        amideNCandidate.atom.implicitHCount === 2 - otherCarbons.length
      ) {
        amideN = amideNCandidate
        amideNSubstituentIds = otherCarbons.map((x) => x.atom.id)
      }
    }
    // A nitro nitrogen (-NO2) is single-bonded to its carbon and has 0 H, same shape as an ether-like
    // attachment from this carbon's point of view — it's never a principal/demoted group (no suffix
    // form), just silently allowed through here so it can be picked up as a "nitro" prefix later.
    const nitroN = nitrogenLinks.find((n) => n.bond.order === 1 && isNitroNitrogen(graph, n.atom.id))
    if (nitroN) usedNitrogenIds.add(nitroN.atom.id) // keep it out of the separate amine-detection loop below
    const acylHalogen = halogenLinks.find((n) => n.bond.order === 1)

    const malformedOxygen = oxygenLinks.find((n) => n !== doubleO && n !== singleOH && n !== singleOEther)
    if (malformedOxygen) {
      return { unsupported: 'This oxygen pattern is not supported yet (RULES.md §5).' }
    }
    const malformedNitrogen = nitrogenLinks.find((n) => n !== tripleN && n !== amideN && n !== nitroN)
    if (malformedNitrogen) {
      return { unsupported: 'This nitrogen pattern is not supported yet (RULES.md §5).' }
    }

    // extraNeighborCounts lets a caller (ringSubstituentChain.ts) say "treat this atom as having N
    // more carbon-like neighbors than the graph shows" — needed when this graph is a branch extracted
    // away from a ring: the root atom's real bond to the (now-removed) ring atom doesn't appear here,
    // but its implicitHCount was copied verbatim from the original molecule and still reflects that
    // bond's effect on valence. Without this, a ketone carbon sitting directly on the ring attachment
    // point (0 H, 2 real carbon neighbors in the original molecule but only 1 visible here once the
    // ring bond is dropped) would mismatch both the aldehyde and ketone shape checks below.
    const carbonNeighborCount = ns.filter((n) => n.atom.element === 'C').length + (extraNeighborCounts?.get(c.id) ?? 0)

    if (doubleO && singleOH) {
      found.push({ type: 'carboxylic_acid', carbonId: c.id, heteroatomIds: [doubleO.atom.id, singleOH.atom.id] })
      continue
    }
    if (doubleO && singleOEther) {
      const otherCarbon = neighbors(graph, singleOEther.atom.id).find((n) => n.atom.id !== c.id && n.atom.element === 'C')
      const otherHasDoubleO = otherCarbon && neighbors(graph, otherCarbon.atom.id).some((n) => n.atom.element === 'O' && n.bond.order === 2)
      if (otherHasDoubleO) return { unsupported: ANHYDRIDE_UNSUPPORTED_MESSAGE }
      if (!otherCarbon) {
        // The bridging oxygen's far side isn't a carbon at all — e.g. another O (a peroxyacid,
        // -C(=O)-O-OH) or N. That's not a real ester (there's no alkyl group to name), and treating it
        // as one with an absent esterAlkylRootId used to silently produce the suffix alone with no
        // O-alkyl word at all (found via fuzz testing: "pent-2-ynoate" with no error, missing the fact
        // that this is a peroxyacid the engine doesn't actually support).
        return { unsupported: 'This O-O/O-N pattern next to a carbonyl (e.g. a peroxyacid) is not supported yet (RULES.md §5).' }
      }
      found.push({
        type: 'ester',
        carbonId: c.id,
        heteroatomIds: [doubleO.atom.id, singleOEther.atom.id],
        esterAlkylRootId: otherCarbon.atom.id,
      })
      continue
    }
    if (doubleO && acylHalogen) {
      found.push({ type: ACID_HALIDE_TYPE[acylHalogen.atom.element], carbonId: c.id, heteroatomIds: [doubleO.atom.id, acylHalogen.atom.id] })
      continue
    }
    if (doubleO && amideN) {
      usedNitrogenIds.add(amideN.atom.id)
      found.push({
        type: 'amide',
        carbonId: c.id,
        heteroatomIds: [doubleO.atom.id, amideN.atom.id],
        nSubstituentIds: amideNSubstituentIds,
      })
      continue
    }
    if (doubleO) {
      if (c.implicitHCount === 1 && carbonNeighborCount <= 1) {
        found.push({ type: 'aldehyde', carbonId: c.id, heteroatomIds: [doubleO.atom.id] })
      } else if (c.implicitHCount === 0 && carbonNeighborCount === 2) {
        found.push({ type: 'ketone', carbonId: c.id, heteroatomIds: [doubleO.atom.id] })
      } else {
        return { unsupported: 'This C=O pattern does not match a supported aldehyde/ketone shape (check valence/branching).' }
      }
      continue
    }
    if (tripleN) {
      usedNitrogenIds.add(tripleN.atom.id)
      found.push({ type: 'nitrile', carbonId: c.id, heteroatomIds: [tripleN.atom.id] })
      continue
    }
    if (singleOH) {
      found.push({ type: 'alcohol', carbonId: c.id, heteroatomIds: [singleOH.atom.id] })
    }
    // A lone singleOEther with no doubleO partner is a plain ether — silently skipped here, picked
    // up later as an "alkoxy" substituent prefix (it has no suffix form, so it's never a candidate).
  }

  for (const n of Object.values(graph.atoms).filter((a) => a.element === 'N')) {
    if (usedNitrogenIds.has(n.id)) continue
    const ns = neighbors(graph, n.id)
    const carbonNeighbors = ns.filter((x) => x.atom.element === 'C')
    if (ns.length !== carbonNeighbors.length || carbonNeighbors.length === 0 || carbonNeighbors.length > 3) {
      return { unsupported: 'This nitrogen pattern is not supported yet (RULES.md §5).' }
    }
    if (n.implicitHCount !== 3 - carbonNeighbors.length) {
      return { unsupported: 'This nitrogen pattern is not supported yet (RULES.md §5).' }
    }
    // Secondary/tertiary amines (-NHR, -NR2) have no inherent "host" carbon the way amide's acyl
    // carbon is fixed elsewhere — any of the nitrogen's own carbon branches could become the parent
    // chain. Blue Book P-66.6.1.2 picks the LONGEST branch as the parent (matching the general
    // longest-chain-wins rule used everywhere else in this engine); the rest become "N-..." prefixes.
    // A symmetric case (e.g. diethylamine) ties, and the name comes out the same either way.
    let hostIdx = 0
    let hostSize = -1
    const sizes = carbonNeighbors.map((cn) => carbonSubtreeSize(graph, cn.atom.id, n.id))
    sizes.forEach((size, i) => {
      if (size > hostSize) {
        hostSize = size
        hostIdx = i
      }
    })
    const nSubstituentIds = carbonNeighbors.filter((_, i) => i !== hostIdx).map((cn) => cn.atom.id)
    found.push({ type: 'amine', carbonId: carbonNeighbors[hostIdx].atom.id, heteroatomIds: [n.id], nSubstituentIds })
  }

  // Combining 2+ of {carboxylic acid, ester, acid halide, amide} on one molecule is now supported
  // (RULES.md §5, 2026-06-23) — whichever is most senior (SENIORITY_ORDER) becomes the suffix, the
  // rest demote to prefixes via demotedPrefixWord (fixed words for acid/halide/amide; ester's own
  // O-alkyl group is baked into its prefix, e.g. "methoxycarbonyl"). Multiple instances of the SAME
  // type (a diacid-halide, a diester — possibly with a DIFFERENT O-alkyl group per instance, e.g.
  // "1-ethyl 4-methyl butanedioate") are handled by the normal multi-locant suffix machinery
  // (buildParentCore) / withEsterAlkylWord (nameMolecule.ts).

  if (found.length === 0) return { principalType: 'none', principal: [], demoted: [] }

  const present = new Set(found.map((f) => f.type))
  const principalType = SENIORITY_ORDER.find((t) => present.has(t))!

  // A PRINCIPAL terminus-only group needs every instance to sit at a chain terminus — a simple chain
  // only has two ends, so 3+ can never all be principal simultaneously without either crashing
  // parent-chain selection or producing an impossible name. Demoted instances of any count are fine
  // (each cited independently wherever its own carbon sits, no chain-membership constraint).
  // carboxylic_acid/nitrile/aldehyde are deliberately excluded here — they already get the
  // branchGroupNaming.ts "3+ instances" substituent-style treatment, computed AFTER this function
  // returns, from the very `groups.principal.length >= 3` shape this guard would otherwise reject
  // first; ester/acid-halide/amide don't have that alternative form built yet, so they still need it.
  const TERMINUS_ONLY_NO_BRANCH_FORM: GroupType[] = [
    'ester',
    'acid_fluoride',
    'acid_chloride',
    'acid_bromide',
    'acid_iodide',
    'amide',
  ]
  if (TERMINUS_ONLY_NO_BRANCH_FORM.includes(principalType) && found.filter((f) => f.type === principalType).length > 2) {
    return {
      unsupported:
        'Three or more instances of this group all needing to be the principal suffix is not supported yet — only carboxylic acid/nitrile/aldehyde get the substituent-style "tri-" treatment for that shape (RULES.md §5/§6).',
    }
  }
  const demoted = found.filter((f) => f.type !== principalType)
  return {
    principalType,
    principal: found.filter((f) => f.type === principalType),
    demoted,
  }
}

export function isHeteroatom(atom: AtomNode): boolean {
  return atom.element === 'O' || atom.element === 'N'
}
