import { chainRoot, MULTIPLYING_PREFIXES } from './roots'
import { LocatedSubstituent } from './numbering'
import { GroupType, SUFFIX_WORD, ALWAYS_OMIT_LOCANT_TYPES, NO_ELISION_TYPES } from './principalGroup'
import { buildSubstituentToken } from './substituentTokens'

export interface ParentCoreInput {
  chainLength: number
  doubleLocants: number[]
  tripleLocants: number[]
  principalGroupLocants: number[]
  principalGroupType: GroupType | 'none'
}

/**
 * Builds the root+infix+suffix core (e.g. "pentane", "pent-2-ene", "pentan-2-ol",
 * "pent-1-en-3-ol", "buta-1,3-diene", "propanoic acid", "pentane-2,4-dione").
 * Encodes the elision/linking-vowel rules implicit in Blue Book substitutive
 * nomenclature: "-ane" loses its final 'e' before a vowel-initial suffix
 * (-ol, -amine, -oic acid, -al) when there's exactly one locant, but keeps it
 * (and gains a linking '-locants-' block) before a multiplying prefix when
 * there are several (ethane-1,2-diol, pentane-2,4-dione). The locant is
 * omitted entirely for -oic acid/-al (always C1 by construction — RULES.md
 * §5 dicarboxylic/dialdehyde combos are out of scope so there's always
 * exactly one) and for -ol/-amine on chains of length <=2 (methanol,
 * ethanamine), matching common JEE-level convention.
 */
export function buildParentCore(input: ParentCoreInput): string {
  const root = chainRoot(input.chainLength)
  const hasUnsaturation = input.doubleLocants.length > 0 || input.tripleLocants.length > 0
  const hasGroup = input.principalGroupType !== 'none'
  const groupType = input.principalGroupType as GroupType
  const suffixWord = hasGroup ? SUFFIX_WORD[groupType] : ''
  const locants = [...input.principalGroupLocants].sort((a, b) => a - b)
  const alwaysOmitLocant = hasGroup && ALWAYS_OMIT_LOCANT_TYPES.includes(groupType)
  // Only nitrile's suffix is consonant-initial ("-nitrile") — every other supported suffix starts
  // with a vowel and elides the parent hydride's final "e" (RULES.md), so nitrile alone needs that
  // "e" put back: "ethane" + "nitrile" = "ethanenitrile", not "ethannitrile".
  const keepTrailingE = hasGroup && NO_ELISION_TYPES.includes(groupType)

  if (!hasUnsaturation) {
    if (!hasGroup) return `${root}ane`
    if (locants.length <= 1) {
      const omit = alwaysOmitLocant || (input.chainLength <= 2 && (groupType === 'alcohol' || groupType === 'amine'))
      const stem = keepTrailingE ? `${root}ane` : `${root}an`
      return omit ? `${stem}${suffixWord}` : `${stem}-${locants[0]}-${suffixWord}`
    }
    const mult = MULTIPLYING_PREFIXES[locants.length] ?? ''
    // A terminus-only group (acid/aldehyde/ester/acid halide/amide/nitrile) present twice can only
    // sit at the two chain ends by construction, so the locant set is redundant and conventionally
    // omitted: "hexanedioic acid", "hexanedinitrile" — never "hexane-1,6-dioic acid".
    if (alwaysOmitLocant) return `${root}ane${mult}${suffixWord}`
    return `${root}ane-${locants.join(',')}-${mult}${suffixWord}`
  }

  // The linking vowel 'a' eases the consonant clash between the parent hydride root and a
  // multiplying prefix ("hex" + "diene" -> "hexa-...-diene") — it only ever applies right where the
  // root's final consonant meets the FIRST unsaturation segment. A later segment is already separated
  // from the root by "en"/"yn", so it never gets its own linking 'a' even when IT has a multiplying
  // prefix: "hept-1-en-3,6-diyne" is correct, not "hept-1-ena-3,6-diyne" (found via fuzz testing
  // against OPSIN, which rejected the stray "a" as unparseable).
  const segments: string[] = []
  let isFirstSegment = true
  if (input.doubleLocants.length > 0) {
    const linking = isFirstSegment && input.doubleLocants.length > 1 ? 'a' : ''
    const mult = MULTIPLYING_PREFIXES[input.doubleLocants.length] ?? ''
    const ls = [...input.doubleLocants].sort((a, b) => a - b).join(',')
    segments.push(`${linking}-${ls}-${mult}en`)
    isFirstSegment = false
  }
  if (input.tripleLocants.length > 0) {
    const linking = isFirstSegment && input.tripleLocants.length > 1 ? 'a' : ''
    const mult = MULTIPLYING_PREFIXES[input.tripleLocants.length] ?? ''
    const ls = [...input.tripleLocants].sort((a, b) => a - b).join(',')
    segments.push(`${linking}-${ls}-${mult}yn`)
  }
  const core = root + segments.join('')
  if (!hasGroup) return `${core}e`
  if (locants.length <= 1) {
    if (alwaysOmitLocant) return keepTrailingE ? `${core}e${suffixWord}` : `${core}${suffixWord}`
    return `${core}-${locants[0]}-${suffixWord}`
  }
  const mult = MULTIPLYING_PREFIXES[locants.length] ?? ''
  if (alwaysOmitLocant) return `${core}e${mult}${suffixWord}`
  return `${core}e-${locants.join(',')}-${mult}${suffixWord}`
}

export interface AssembleResult {
  name: string
  ruleApplied: string
}

export function assembleAcyclicName(
  core: ParentCoreInput,
  substituents: LocatedSubstituent[],
  // Pre-built tokens with no numeric locant of their own (so far: only "N-methyl"/"N,N-dimethyl"
  // amine/amide substituent prefixes, built by nameMolecule.ts since they need the nitrogen atom id,
  // not just the chain). Alphabetized together with the ordinary numeric-locant tokens below — real
  // IUPAC names interleave them (e.g. "2-chloro-N-methylaniline", not always N-first or N-last).
  extraTokens: { alphaKey: string; token: string }[] = []
): AssembleResult {
  const groups = new Map<string, { alphaKey: string; locants: number[] }>()
  for (const sub of substituents) {
    const entry = groups.get(sub.name) ?? { alphaKey: sub.alphaKey, locants: [] }
    entry.locants.push(sub.locant)
    groups.set(sub.name, entry)
  }

  // A one-carbon parent has only one possible position, so the locant is conventionally omitted
  // when there's a single substituent (e.g. "phenylmethanol", not "1-phenylmethanol") — same implicit-
  // locant convention already used for monosubstituted rings (ringNaming.ts). Only ever applies to the
  // ordinary numeric-locant substituents — an N-token never has a numeric locant to omit in the first
  // place (it always shows "N-"). Amide is excluded even at chain length 1: its own nitrogen is a
  // second, EQUALLY valid single-atom attachment point with free valence, so an unlocanted ordinary
  // substituent is genuinely ambiguous between "on the carbon" and "on the nitrogen" — found via fuzz
  // testing against OPSIN, which read our unlocanted "nitromethanamide" as nitro-ON-THE-NITROGEN
  // (a totally different structure from the intended O2N-C(=O)-NH2) and only matched once the locant
  // was shown explicitly ("1-nitromethanamide"). No other supported principal-group type has a second
  // free-valence atom competing with its own chain carbon this way.
  const omitSoleLocant = core.chainLength === 1 && groups.size === 1 && extraTokens.length === 0 && core.principalGroupType !== 'amide'

  const namedTokens = Array.from(groups.entries()).map(([name, { alphaKey, locants }]) => ({
    alphaKey,
    token: buildSubstituentToken(name, locants, omitSoleLocant),
  }))
  const allTokens = [...namedTokens, ...extraTokens].sort((a, b) => a.alphaKey.localeCompare(b.alphaKey))
  const tokens = allTokens.map((t) => t.token)

  // Hyphens surround locants, not plain letter-to-letter boundaries: "2-methyl" + "propane"
  // fuses to "2-methylpropane" (no hyphen before the parent root, which never starts with a digit).
  const parentCore = buildParentCore(core)
  const name = tokens.length > 0 ? `${tokens.join('-')}${parentCore}` : parentCore

  const lead = `Step 4 — Assemble the name: the parent core is "${parentCore}".`
  let ruleApplied: string
  if (allTokens.length === 0) {
    ruleApplied = `${lead} There are no substituents to cite, so that's the complete name.`
  } else if (allTokens.length === 1) {
    ruleApplied = `${lead} There's one substituent to cite — "${allTokens[0].token}" — placed in front of the parent core to give "${name}".`
  } else {
    const order = allTokens.map((t) => `"${t.alphaKey}"`).join(' < ')
    ruleApplied =
      `${lead} There are ${allTokens.length} substituents to cite: ${allTokens.map((t) => `"${t.token}"`).join(', ')}. ` +
      `They're cited in alphabetical order of the substituent name itself (not its locant) — ${order} — ` +
      `giving "${tokens.join('-')}" in front of the parent core, for the complete name "${name}".`
  }
  return { name, ruleApplied }
}
