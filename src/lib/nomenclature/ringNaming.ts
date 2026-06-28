import { MoleculeGraph, Ring, neighbors, bondBetween } from './model'
import { nameSubstituent, SubstituentName } from './substituents'
import { compareNumberArrays, LocatedSubstituent } from './numbering'
import { MULTIPLYING_PREFIXES } from './roots'
import { GroupType, GroupInstance, SUFFIX_WORD, demotedPrefixWord } from './principalGroup'
import { buildSubstituentToken } from './substituentTokens'
import { buildNSubstituentTokens, explainNSubstituent } from './nSubstituents'
import { buildStereoPrefix, explainStereoDescriptors } from './stereo'

/** V3 update (2026-06-22): generalized from "always 6-membered" to 3/4/5/6-membered rings — see
 * RULES.md §5. Benzene (aromatic) only ever applies at n=6; this engine never builds an aromatic
 * ring of any other size (no neutral 3/4/5-membered aromatic hydrocarbon exists at JEE level). */
export const RING_ROOT: Record<number, string> = {
  3: 'cyclopropane',
  4: 'cyclobutane',
  5: 'cyclopentane',
  6: 'cyclohexane',
}

/** "cyclohexane" -> "cyclohexyl", "cyclopentane" -> "cyclopentyl"... used both for the ring-as-
 * substituent prefix (ringSubstituentChain.ts) and nowhere else. */
export function ringAlkylName(n: number, aromatic: boolean): string {
  if (aromatic && n === 6) return 'phenyl'
  return `${RING_ROOT[n].slice(0, -3)}yl`
}

/** Describes the WINNING numbering's actual locants, concretely, rather than just restating the
 * abstract lowest-locants procedure — same "show the real numbers, not just the rule name" approach
 * used for the chain naming path (numbering.ts), adapted for a ring's bigger search space (every
 * starting atom AND both directions, not just 2 options) by describing the achieved outcome per tier
 * instead of narrating the full elimination tournament. */
function explainRingNumbering(n: number, best: RingDirectionEval, stepNumber: 1 | 2): string {
  const totalOptions = n * 2
  const parts = [`Step ${stepNumber} — Number the ring: tried every starting atom and both directions around the ring (${totalOptions} numbering options in total), keeping the one with the lowest locants.`]
  if (best.principalGroupLocants.length > 0) {
    parts.push(`Lowest priority goes to the principal characteristic group first — it lands at C${[...best.principalGroupLocants].sort((a, b) => a - b).join(', C')}.`)
  }
  if (best.doubleLocants.length > 0) {
    parts.push(`${best.principalGroupLocants.length > 0 ? 'Next, ring' : 'Ring'} double bond(s) get the lowest locant(s) available after that — C${[...best.doubleLocants].sort((a, b) => a - b).join(', C')}.`)
  }
  if (best.substituents.length > 0) {
    const locants = [...new Set(best.substituents.map((s) => s.locant))].sort((a, b) => a - b)
    parts.push(`${best.principalGroupLocants.length > 0 || best.doubleLocants.length > 0 ? 'Finally, the' : 'The'} other substituent(s) get the lowest remaining locant(s): C${locants.join(', C')}.`)
  }
  return parts.join(' ')
}

const RULE_RING_UNSUPPORTED = 'Ring numbering: this particular ring shape is not supported yet (see the specific reason below).'

export interface RingNamingResult {
  name: string
  ruleApplied: string[]
  unsupported?: string
  orderedAtomIds?: string[]
}

interface RingDirectionEval {
  orderedAtomIds: string[]
  principalGroupLocants: number[]
  doubleLocants: number[]
  substituents: LocatedSubstituent[]
  unsupported?: string
}

/**
 * Aromatic rings keep their Kekule double bonds as pure valence bookkeeping (RULES.md) — they're
 * never cited as "-ene" unsaturation, the ring is always plain "benzene". Only non-aromatic
 * (cyclohexane-family) rings can carry a real, nameable double bond (cyclohexene, cyclohexadiene).
 *
 * `principalRingAtoms`/`demotedRingAtoms` (V10, generalized to carry full GroupInstances in the
 * secondary/tertiary-amine round) let an -OH/-NHR/-NR2 directly on the ring (cyclohexanol,
 * cyclohexane-1,2-diamine, N-methylcyclohexanamine...) take priority over plain substituent locants,
 * same as a chain's principal-group-first numbering rule — both default to empty, so passing nothing
 * reproduces the exact pre-V10 behavior (plain alkyl/halogen-substituted rings only).
 */
function evaluateRingDirection(
  graph: MoleculeGraph,
  orderedAtomIds: string[],
  aromatic: boolean,
  principalRingAtoms: Map<string, GroupInstance> = new Map(),
  demotedRingAtoms: Map<string, GroupInstance> = new Map()
): RingDirectionEval {
  const n = orderedAtomIds.length
  const ringSet = new Set(orderedAtomIds)
  const doubleLocants: number[] = []
  let unsupported: string | undefined
  if (!aromatic) {
    for (let i = 0; i < n; i++) {
      const bond = bondBetween(graph, orderedAtomIds[i], orderedAtomIds[(i + 1) % n])
      if (bond?.order === 2) doubleLocants.push(i + 1)
      // A triple bond inside a ring this small isn't a real, supportable structure (massive bond-angle
      // strain — true cycloalkynes need an 8+ membered ring even to exist at all), but the bond-order
      // tool only checks valence, not ring-geometry feasibility, so the editor lets a triple bond land
      // here anyway. This used to be silently invisible to the ring-double-bond scan below (which only
      // ever checked for order===2), so the name dropped it entirely — found via fuzz testing: a ring
      // bond cycled to a triple bond produced the bare, wrong name "cyclobutane" with no mention of it.
      if (bond?.order === 3) unsupported = 'A triple bond inside a ring is not supported (and not a real structure at this ring size).'
    }
  }

  const principalGroupLocants: number[] = []
  const substituents: LocatedSubstituent[] = []

  orderedAtomIds.forEach((atomId, idx) => {
    const locant = idx + 1
    const principalInstance = principalRingAtoms.get(atomId)
    const demotedInstance = demotedRingAtoms.get(atomId)
    if (principalInstance) principalGroupLocants.push(locant)
    if (demotedInstance) {
      const prefix = demotedPrefixWord(graph, demotedInstance)
      if (!prefix) {
        unsupported = `This ring amine's own N-substituent doesn't match a supported shape yet (RULES.md §5) at C${locant}.`
        return
      }
      substituents.push({ name: prefix.word, alphaKey: prefix.alphaKey, locant })
    }
    for (const { atom } of neighbors(graph, atomId)) {
      if (ringSet.has(atom.id) || atom.element === 'H') continue
      // The principal/demoted group's own heteroatom at this ring position is already accounted
      // for above (its own N-substituent carbons, if any, are two bonds away from the ring atom —
      // never visited by this loop at all, so they need no explicit skip here) — only a genuinely
      // separate substituent on the same ring atom reaches the normal alkyl/halogen scan below.
      if (principalInstance?.heteroatomIds.includes(atom.id)) continue
      if (demotedInstance?.heteroatomIds.includes(atom.id)) continue
      const named: SubstituentName | null = nameSubstituent(graph, atom.id, atomId)
      if (!named) {
        unsupported = `A substituent on the ring at C${locant} isn't supported yet (RULES.md §5 — only alkyl/halogen substituents on rings).`
        continue
      }
      substituents.push({ ...named, locant })
    }
  })

  return { orderedAtomIds, principalGroupLocants, doubleLocants, substituents, unsupported }
}

function pickBetterRing(a: RingDirectionEval, b: RingDirectionEval): RingDirectionEval {
  const principalCmp = compareNumberArrays(a.principalGroupLocants, b.principalGroupLocants)
  if (principalCmp !== 0) return principalCmp < 0 ? a : b

  const doubleCmp = compareNumberArrays(a.doubleLocants, b.doubleLocants)
  if (doubleCmp !== 0) return doubleCmp < 0 ? a : b

  const subsCmp = compareNumberArrays(a.substituents.map((s) => s.locant), b.substituents.map((s) => s.locant))
  if (subsCmp !== 0) return subsCmp < 0 ? a : b

  const sortedA = [...a.substituents].sort((x, y) => x.alphaKey.localeCompare(y.alphaKey))
  const sortedB = [...b.substituents].sort((x, y) => x.alphaKey.localeCompare(y.alphaKey))
  if (sortedA.length > 0 && sortedB.length > 0 && sortedA[0].alphaKey === sortedB[0].alphaKey) {
    return sortedA[0].locant <= sortedB[0].locant ? a : b
  }
  return a
}

function buildRingParentCore(n: number, aromatic: boolean, doubleLocants: number[]): string {
  if (aromatic && n === 6) return 'benzene'
  const root = RING_ROOT[n]
  const stem = root.slice(0, -3) // "cyclohexane" -> "cyclohex"
  if (doubleLocants.length === 0) return root
  const sorted = [...doubleLocants].sort((a, b) => a - b)
  if (sorted.length === 1) return `${stem}-${sorted[0]}-ene`
  const linking = 'a'
  const mult = MULTIPLYING_PREFIXES[sorted.length] ?? ''
  return `${stem}${linking}-${sorted.join(',')}-${mult}ene`
}

/** A ring carbon with two ring-double-bonds of its own (a cumulated, allene-like diene around the
 * ring) isn't a real isolable structure at this level — smallest case is cyclopropa-1,2-diene. This
 * is the one ring-shape this engine rejects rather than naming, regardless of size. */
function hasCumulatedRingDiene(graph: MoleculeGraph, ring: Ring): boolean {
  const n = ring.atomIds.length
  for (let i = 0; i < n; i++) {
    const prevBond = bondBetween(graph, ring.atomIds[(i - 1 + n) % n], ring.atomIds[i])
    const nextBond = bondBetween(graph, ring.atomIds[i], ring.atomIds[(i + 1) % n])
    if (prevBond?.order === 2 && nextBond?.order === 2) return true
  }
  return false
}

/** Builds the prefix-token list shared by both the plain-ring and principal-group ring naming
 * paths: group same-named substituents, alphabetize, attach multiplying prefixes + locants.
 * `extraTokens` (so far: only "N-methyl"/"N,N-dimethyl" tokens for a principal ring amine's own
 * N-substituents, which have no numeric locant of their own) are alphabetized in alongside the
 * ordinary ones — real IUPAC names interleave them, e.g. "4-chloro-N-methylaniline". */
function buildSubstituentTokens(
  substituents: LocatedSubstituent[],
  omitSoleLocant: boolean,
  extraTokens: { alphaKey: string; token: string }[] = []
): string[] {
  const groups = new Map<string, { alphaKey: string; locants: number[] }>()
  for (const sub of substituents) {
    const entry = groups.get(sub.name) ?? { alphaKey: sub.alphaKey, locants: [] }
    entry.locants.push(sub.locant)
    groups.set(sub.name, entry)
  }
  const ordinary = Array.from(groups.entries()).map(([name, { alphaKey, locants }]) => ({
    alphaKey,
    token: buildSubstituentToken(name, locants, omitSoleLocant),
  }))
  return [...ordinary, ...extraTokens].sort((a, b) => a.alphaKey.localeCompare(b.alphaKey)).map((t) => t.token)
}

/** Ring version of explainPrincipalGroupChoice (principalGroup.ts) — much simpler than the chain case
 * since this engine's ring scope only ever lets -OH and -NH2 compete directly on a ring (never acids,
 * esters, etc.), so there's no seniority TABLE to walk, just "alcohol always outranks amine." */
function explainRingPrincipalGroup(principalType: GroupType, principalCount: number, demotedCount: number): string {
  const groupWord = principalType === 'alcohol' ? '-OH' : '-NH2'
  const suffixWord = principalType === 'alcohol' ? '-ol' : '-amine'
  const countWord = principalCount > 1 ? `${principalCount} ` : ''
  if (demotedCount === 0) {
    return (
      `Step 1 — Find the principal characteristic group: found ${countWord}${groupWord} group${principalCount > 1 ? 's' : ''} directly on the ring ` +
      `and nothing else competing for the suffix, so the ring itself becomes the parent — named with the suffix "${suffixWord}".`
    )
  }
  return (
    `Step 1 — Find the principal characteristic group: the ring carries both -OH and -NH2 directly. ` +
    `-OH (alcohol) always outranks -NH2 (amine), so it becomes the principal characteristic group ` +
    `(suffix "${suffixWord}") and the amine is demoted to the prefix "amino" instead.`
  )
}

/**
 * V10 (2026-06-22): -OH/-NH2 directly on a ring (cyclohexanol, cyclohexane-1,2-diol,
 * cyclohexanamine...) makes the ring itself the parent with a real substitutive suffix, exactly
 * like a chain's principal group — not a "substituent on the ring" the way alkyl/halogen are. Only
 * the AROMATIC, no-other-substituent case is irregular enough to need a genuine retained name
 * (phenol/aniline); the regular cyclo-an-...-ol/-amine pattern covers everything else, including
 * mixing with ordinary alkyl/halogen substituents and multiple instances (a diol/diamine).
 */
function nameRingWithPrincipalGroup(
  graph: MoleculeGraph,
  ring: Ring,
  principalType: GroupType,
  principalRingAtoms: Map<string, GroupInstance>,
  demotedRingAtoms: Map<string, GroupInstance>
): RingNamingResult {
  const n = ring.atomIds.length
  const principalGroupRule = explainRingPrincipalGroup(principalType, principalRingAtoms.size, demotedRingAtoms.size)

  // A secondary/tertiary amine directly on the ring (N-methylaniline, N,N-dimethylcyclohexanamine)
  // cites its nitrogen's own carbon substituents as "N-methyl"/"N,N-dimethyl" prefixes, exactly like
  // the chain version (Blue Book P-66.6.1.2) — reuses the same buildNSubstituentTokens used there,
  // which already rejects (returns null) a 2+-instance diamine where any instance has N-substituents,
  // since which "N" a locant like "N1-methyl" refers to isn't built yet.
  const nTokens =
    principalType === 'amine'
      ? buildNSubstituentTokens(graph, { principalType: 'amine', principal: [...principalRingAtoms.values()], demoted: [] })
      : []
  if (nTokens === null) {
    return {
      name: '',
      ruleApplied: [principalGroupRule, RULE_RING_UNSUPPORTED],
      unsupported: 'A ring bearing two or more amine instances where any of them is secondary/tertiary is not supported yet.',
    }
  }

  // "Phenol"/"aniline" are RETAINED names (P-66/P-23) whose own numbering is fixed — the OH/NH2
  // carbon is always C1 by definition of the retained name itself, never shown as a locant, and
  // never up for rotation. Only the ring's WALK DIRECTION is still free, chosen (like every other
  // ring numbering in this engine) to give the lowest locants to whatever else is on the ring —
  // ordinary alkyl/halogen substituents, or a demoted second principal-group atom ("amino", when
  // both -OH and -NH2 are present and -OH outranks -NH2 as principal — e.g. "4-aminophenol").
  // Two or more OH/NH2 instances on one aromatic ring (a diol/diamine) can't reuse a single-OH
  // retained name at all, so that case still falls through to "not supported yet" below.
  if (ring.aromatic && n === 6 && principalRingAtoms.size === 1) {
    const principalId = [...principalRingAtoms.keys()][0]
    const startIdx = ring.atomIds.indexOf(principalId)
    let best: RingDirectionEval | null = null
    for (const dir of [1, -1]) {
      const ordered: string[] = []
      for (let k = 0; k < n; k++) {
        const idx = (((startIdx + dir * k) % n) + n) % n
        ordered.push(ring.atomIds[idx])
      }
      const candidate = evaluateRingDirection(graph, ordered, true, principalRingAtoms, demotedRingAtoms)
      best = best ? pickBetterRing(best, candidate) : candidate
    }
    if (!best) throw new Error('Ring has no atoms')
    if (best.unsupported) return { name: '', ruleApplied: [principalGroupRule, RULE_RING_UNSUPPORTED], unsupported: best.unsupported }
    const stereoPrefix = buildStereoPrefix(graph, best.orderedAtomIds, best.doubleLocants)
    const stereoExplanation = explainStereoDescriptors(graph, best.orderedAtomIds, best.doubleLocants)
    const parentWord = principalType === 'alcohol' ? 'phenol' : 'aniline'
    // "Phenol"/"aniline" fix C1 by definition of the retained name itself (not a locant choice), so
    // only the walk DIRECTION is genuinely "numbered" here — describe that, not the full n*2 search the
    // general ring path below does.
    const directionRule = `Step 2 — Number the ring: "${parentWord}" is a retained name, so the -OH/-NH2 carbon is always C1 by definition — only the walk direction around the ring is chosen, picking whichever gives the lowest locants to everything else on the ring.`
    if (best.substituents.length === 0 && nTokens.length === 0) {
      return { name: `${stereoPrefix}${parentWord}`, ruleApplied: [principalGroupRule, directionRule, ...stereoExplanation], orderedAtomIds: best.orderedAtomIds }
    }
    const tokens = buildSubstituentTokens(best.substituents, false, nTokens)
    const nRule = nTokens.length > 0 ? [explainNSubstituent(nTokens)] : []
    return {
      name: `${stereoPrefix}${tokens.join('-')}${parentWord}`,
      ruleApplied: [principalGroupRule, directionRule, ...nRule, ...stereoExplanation],
      orderedAtomIds: best.orderedAtomIds,
    }
  }
  if (ring.aromatic && n === 6) {
    return {
      name: '',
      ruleApplied: [principalGroupRule, RULE_RING_UNSUPPORTED],
      unsupported: 'An aromatic ring bearing two or more -OH/-NH2 groups directly is not supported yet.',
    }
  }

  let best: RingDirectionEval | null = null
  for (let start = 0; start < n; start++) {
    for (const dir of [1, -1]) {
      const ordered: string[] = []
      for (let k = 0; k < n; k++) {
        const idx = ((start + dir * k) % n + n) % n
        ordered.push(ring.atomIds[idx])
      }
      const candidate = evaluateRingDirection(graph, ordered, ring.aromatic, principalRingAtoms, demotedRingAtoms)
      best = best ? pickBetterRing(best, candidate) : candidate
    }
  }
  if (!best) throw new Error('Ring has no atoms')
  if (best.unsupported) return { name: '', ruleApplied: [principalGroupRule, RULE_RING_UNSUPPORTED], unsupported: best.unsupported }
  const stereoPrefix = buildStereoPrefix(graph, best.orderedAtomIds, best.doubleLocants)
  const stereoExplanation = explainStereoDescriptors(graph, best.orderedAtomIds, best.doubleLocants)
  const numberingRule = explainRingNumbering(n, best, 2)

  const suffixWord = SUFFIX_WORD[principalType]
  const root = RING_ROOT[n]
  const stem = root.slice(0, -3) // "cyclohexane" -> "cyclohex"
  const pLocants = [...best.principalGroupLocants].sort((a, b) => a - b)
  const pMult = pLocants.length > 1 ? MULTIPLYING_PREFIXES[pLocants.length] ?? '' : ''
  // A SOLE principal-group instance with NOTHING else on the ring can always be rotated to locant 1
  // (no other substituent, demoted prefix, or double bond fixes the numbering independently), so its
  // locant is conventionally dropped only in that fully-bare case — "cyclohexanol", but
  // "4-chlorocyclohexan-1-ol" once another substituent is present (the locant stops being redundant
  // information for the reader, even though it's still always 1 by construction). An N-substituent
  // alone doesn't fix the numbering either (its locant is always the letter "N", never competing for
  // a ring position), so it's excluded from this check too — "N-methylcyclohexan-1-amine" still omits
  // the redundant "1" the same as the unsubstituted case, confirmed against OPSIN.
  const omitPrincipalLocant = pLocants.length === 1 && best.doubleLocants.length === 0 && best.substituents.length === 0

  let parentCore: string
  if (best.doubleLocants.length === 0) {
    if (pLocants.length === 1) {
      // Single locant always elides to "an" (vowel-initial suffix), shown or not: "cyclohexanol" /
      // "cyclohexan-1-ol" — only 2+ instances keep the full "ane" before the locant block.
      parentCore = omitPrincipalLocant ? `${stem}an${suffixWord}` : `${stem}an-${pLocants[0]}-${suffixWord}`
    } else {
      parentCore = `${stem}ane-${pLocants.join(',')}-${pMult}${suffixWord}`
    }
  } else {
    const linking = best.doubleLocants.length > 1 ? 'a' : ''
    const dMult = best.doubleLocants.length > 1 ? MULTIPLYING_PREFIXES[best.doubleLocants.length] ?? '' : ''
    const eneCore = `${stem}${linking}-${best.doubleLocants.join(',')}-${dMult}en` // e.g. "cyclohex-3-en"
    // Single principal locant attaches directly (no extra "e" — "cyclohex-3-en-1-ol", not
    // "cyclohex-3-ene-1-ol"); 2+ locants need the "e" back before the multiplying-prefix block,
    // same elision rule the chain version (assembleName.ts) already uses.
    parentCore = pLocants.length === 1 ? `${eneCore}-${pLocants[0]}-${suffixWord}` : `${eneCore}e-${pLocants.join(',')}-${pMult}${suffixWord}`
  }

  if (best.substituents.length === 0 && nTokens.length === 0) {
    return { name: `${stereoPrefix}${parentCore}`, ruleApplied: [principalGroupRule, numberingRule, ...stereoExplanation], orderedAtomIds: best.orderedAtomIds }
  }
  const tokens = buildSubstituentTokens(best.substituents, false, nTokens)
  const nRule = nTokens.length > 0 ? [explainNSubstituent(nTokens)] : []
  return {
    name: `${stereoPrefix}${tokens.join('-')}${parentCore}`,
    ruleApplied: [principalGroupRule, numberingRule, ...nRule, ...stereoExplanation],
    orderedAtomIds: best.orderedAtomIds,
  }
}

export function nameRing(graph: MoleculeGraph, ring: Ring): RingNamingResult {
  const n = ring.atomIds.length
  if (!RING_ROOT[n]) {
    return { name: '', ruleApplied: [RULE_RING_UNSUPPORTED], unsupported: `Rings of size ${n} are not supported yet (RULES.md §5 — 3 to 6 atoms only).` }
  }
  if (hasCumulatedRingDiene(graph, ring)) {
    return {
      name: '',
      ruleApplied: [RULE_RING_UNSUPPORTED],
      unsupported: 'A ring carbon with two of its own ring double bonds (a cumulated diene) is not a supported structure.',
    }
  }

  const ringSet = new Set(ring.atomIds)
  const ohRingAtoms = new Map<string, GroupInstance>()
  const amineRingAtoms = new Map<string, GroupInstance>()
  for (const rid of ring.atomIds) {
    for (const { atom: n } of neighbors(graph, rid)) {
      if (ringSet.has(n.id)) continue
      if (n.element === 'O' && n.implicitHCount === 1) {
        ohRingAtoms.set(rid, { type: 'alcohol', carbonId: rid, heteroatomIds: [n.id] })
      }
      // A ring nitrogen tolerates 0-2 of its OWN carbon substituents besides the ring bond itself
      // (-NH2/-NHR/-NR2, same shape principalGroup.ts's chain amine detection already accepts) — any
      // other shape (e.g. a heteroatom on the nitrogen) is left undetected here and falls through to
      // the ordinary substituent scan below, which rejects it honestly rather than guessing.
      if (n.element === 'N') {
        const nNeighbors = neighbors(graph, n.id)
        const otherCarbons = nNeighbors.filter((x) => x.atom.element === 'C' && x.atom.id !== rid)
        const otherHeteroatoms = nNeighbors.filter((x) => x.atom.id !== rid && x.atom.element !== 'C' && x.atom.element !== 'H')
        if (otherCarbons.length <= 2 && otherHeteroatoms.length === 0 && n.implicitHCount === 2 - otherCarbons.length) {
          amineRingAtoms.set(rid, { type: 'amine', carbonId: rid, heteroatomIds: [n.id], nSubstituentIds: otherCarbons.map((x) => x.atom.id) })
        }
      }
    }
  }
  if (ohRingAtoms.size > 0 || amineRingAtoms.size > 0) {
    const principalType: GroupType = ohRingAtoms.size > 0 ? 'alcohol' : 'amine'
    const principalRingAtoms = principalType === 'alcohol' ? ohRingAtoms : amineRingAtoms
    const demotedRingAtoms = new Map<string, GroupInstance>()
    if (principalType === 'alcohol') for (const [rid, instance] of amineRingAtoms) demotedRingAtoms.set(rid, instance)
    return nameRingWithPrincipalGroup(graph, ring, principalType, principalRingAtoms, demotedRingAtoms)
  }

  let best: RingDirectionEval | null = null
  for (let start = 0; start < n; start++) {
    for (const dir of [1, -1]) {
      const ordered: string[] = []
      for (let k = 0; k < n; k++) {
        const idx = ((start + dir * k) % n + n) % n
        ordered.push(ring.atomIds[idx])
      }
      const candidate = evaluateRingDirection(graph, ordered, ring.aromatic)
      best = best ? pickBetterRing(best, candidate) : candidate
    }
  }
  if (!best) throw new Error('Ring has no atoms')
  if (best.unsupported) return { name: '', ruleApplied: [RULE_RING_UNSUPPORTED], unsupported: best.unsupported }
  const stereoPrefix = buildStereoPrefix(graph, best.orderedAtomIds, best.doubleLocants)
  const stereoExplanation = explainStereoDescriptors(graph, best.orderedAtomIds, best.doubleLocants)
  const numberingRule = explainRingNumbering(n, best, 1)

  const parentCore = buildRingParentCore(n, ring.aromatic, best.doubleLocants)

  if (best.substituents.length === 0) {
    return { name: `${stereoPrefix}${parentCore}`, ruleApplied: [numberingRule, ...stereoExplanation], orderedAtomIds: best.orderedAtomIds }
  }

  // A single substituent's locant "1" is implicit only when there's no ring double bond to anchor
  // the numbering independently (e.g. "methylbenzene", but "4-methylcyclohex-1-ene" must still spell
  // out its substituent locant since numbering is no longer arbitrary).
  const tokens = buildSubstituentTokens(best.substituents, best.doubleLocants.length === 0 && best.substituents.length === 1)

  return {
    name: `${stereoPrefix}${tokens.join('-')}${parentCore}`,
    ruleApplied: [numberingRule, ...stereoExplanation],
    orderedAtomIds: best.orderedAtomIds,
  }
}
