import { MoleculeGraph, neighbors, bondBetween } from './model'
import { ChainCandidate, TERMINAL_OWNING_TYPES } from './parentChain'
import { GroupAnalysis, demotedPrefixWord } from './principalGroup'
import { nameSubstituent, SubstituentName } from './substituents'

export interface LocatedSubstituent extends SubstituentName {
  locant: number
}

export interface NumberingResult {
  orderedAtomIds: string[]
  principalGroupLocants: number[]
  doubleLocants: number[]
  tripleLocants: number[]
  substituents: LocatedSubstituent[]
  ruleApplied: string
  unsupported?: string
}

interface DirectionEval {
  orderedAtomIds: string[]
  principalGroupLocants: number[]
  doubleLocants: number[]
  tripleLocants: number[]
  substituents: LocatedSubstituent[]
  unsupported?: string
}

function evaluateDirection(graph: MoleculeGraph, atomIds: string[], groups: GroupAnalysis): DirectionEval {
  const chainSet = new Set(atomIds)
  const doubleLocants: number[] = []
  const tripleLocants: number[] = []
  for (let i = 0; i < atomIds.length - 1; i++) {
    const bond = bondBetween(graph, atomIds[i], atomIds[i + 1])
    if (bond?.order === 2) doubleLocants.push(i + 1)
    if (bond?.order === 3) tripleLocants.push(i + 1)
  }

  const principalByCarbonId = new Map(groups.principal.map((g) => [g.carbonId, g]))
  const demotedByCarbonId = new Map(groups.demoted.map((g) => [g.carbonId, g]))

  const principalGroupLocants: number[] = []
  const substituents: LocatedSubstituent[] = []
  let unsupported: string | undefined

  atomIds.forEach((atomId, idx) => {
    const locant = idx + 1
    // Heteroatom ids already accounted for by whichever group sits at this position — excluded below
    // so the leftover-neighbor scan doesn't re-describe them as a separate substituent. For acid/
    // ester/acid-halide/amide/nitrile/aldehyde/ketone carbons this set provably uses up all remaining
    // valence already (nothing real can be left to scan), but alcohol and amine carbons (-OH/-NH2 use
    // only one valence slot) legitimately CAN carry an extra substituent too (e.g. a chlorohydrin-type
    // carbon bearing both -OH and -Cl) — skipping the scan entirely for "the principal/demoted carbon"
    // was a real bug that silently dropped that second substituent rather than naming it.
    const accountedFor = new Set<string>()
    const principal = principalByCarbonId.get(atomId)
    const demoted = demotedByCarbonId.get(atomId)
    if (principal) {
      principalGroupLocants.push(locant)
      principal.heteroatomIds.forEach((id) => accountedFor.add(id))
    } else if (demoted) {
      const prefix = demotedPrefixWord(graph, demoted)
      if (!prefix) {
        unsupported = `This ester's O-alkyl group doesn't match a supported substituent shape yet (RULES.md §5), so it can't form its demoted "...oxycarbonyl" prefix at C${locant}.`
        return
      }
      substituents.push({ name: prefix.word, alphaKey: prefix.alphaKey, locant })
      demoted.heteroatomIds.forEach((id) => accountedFor.add(id))
    }
    for (const { atom } of neighbors(graph, atomId)) {
      if (chainSet.has(atom.id) || atom.element === 'H' || accountedFor.has(atom.id)) continue
      // A neighbor that's itself a DEMOTED terminal-owning group's own carbon (e.g. a "cyano" nitrile
      // carbon, deliberately excluded from the parent chain by parentChain.ts's TERMINAL_OWNING_TYPES)
      // must be cited via its prefix word directly — nameSubstituent correctly refuses to name it as a
      // plain alkyl branch (it has a non-C/H heteroatom of its own, the nitrile's N), so without this
      // check it used to surface as "not supported" instead of the correct "cyano..." prefix.
      // Restricted to TERMINAL_OWNING_TYPES only: alcohol/amine's own carbon is NOT terminal-owning
      // (their group is just "-OH"/"-NH2" hanging off whatever carbon it sits on, no dedicated extra
      // carbon) — if that carbon isn't the CURRENT chain atom but a further-away neighbor instead
      // (e.g. a -CH2-NH2 branch), citing "amino" directly here would wrongly skip over that spacer
      // carbon entirely, found via fuzz testing: "2-aminobut-2-enoic acid" for a structure where the
      // amine is actually on an extra CH2 one bond further out than C2.
      const neighborDemoted = demotedByCarbonId.get(atom.id)
      if (neighborDemoted && TERMINAL_OWNING_TYPES.includes(neighborDemoted.type)) {
        const prefix = demotedPrefixWord(graph, neighborDemoted)
        if (!prefix) {
          unsupported = `This ester's O-alkyl group doesn't match a supported substituent shape yet (RULES.md §5), so it can't form its demoted "...oxycarbonyl" prefix at C${locant}.`
          continue
        }
        substituents.push({ name: prefix.word, alphaKey: prefix.alphaKey, locant })
        continue
      }
      const named = nameSubstituent(graph, atom.id, atomId)
      if (!named) {
        unsupported = `A substituent branch at C${locant} doesn't match a V1/V2-supported pattern (see RULES.md §5).`
        continue
      }
      substituents.push({ ...named, locant })
    }
  })

  return { orderedAtomIds: atomIds, principalGroupLocants, doubleLocants, tripleLocants, substituents, unsupported }
}

export function compareNumberArrays(a: number[], b: number[]): number {
  const aa = [...a].sort((x, y) => x - y)
  const bb = [...b].sort((x, y) => x - y)
  for (let i = 0; i < Math.max(aa.length, bb.length); i++) {
    const av = aa[i] ?? Infinity
    const bv = bb[i] ?? Infinity
    if (av !== bv) return av - bv
  }
  return 0
}

/** Tries both directions along the chosen parent chain and picks the IUPAC-preferred numbering. */
export function numberChain(graph: MoleculeGraph, candidate: ChainCandidate, groups: GroupAnalysis): NumberingResult {
  const forward = evaluateDirection(graph, candidate.atomIds, groups)
  const backward = evaluateDirection(graph, [...candidate.atomIds].reverse(), groups)

  const { winner, ruleApplied } = pickBetter(forward, backward)
  return { ...winner, ruleApplied }
}

/** Set-bracket notation `{1,3}` reads naturally with 2+ locants, but for a single locant it just
 * looks like an unsubstituted template placeholder (a real student complaint) — so a lone locant is
 * rendered bare ("1"), and only an actual multi-element set gets the braces. */
function fmtSet(locants: number[]): string {
  if (locants.length === 0) return 'none'
  if (locants.length === 1) return String(locants[0])
  return `{${[...locants].sort((a, b) => a - b).join(',')}}`
}

function pickBetter(forward: DirectionEval, backward: DirectionEval): { winner: DirectionEval; ruleApplied: string } {
  const lead = 'Step 3 — Number the chain: numbering can run in either direction along the parent chain. '

  // 1. Principal characteristic group locant(s), as a set.
  const principalCmp = compareNumberArrays(forward.principalGroupLocants, backward.principalGroupLocants)
  if (principalCmp !== 0) {
    const lower = principalCmp < 0 ? forward : backward
    return {
      winner: lower,
      ruleApplied:
        lead +
        `The principal characteristic group gets locant${forward.principalGroupLocants.length > 1 ? 's' : ''} ` +
        `${fmtSet(forward.principalGroupLocants)} numbering one way, or ${fmtSet(backward.principalGroupLocants)} the other way. ` +
        `The lowest-locant set wins, so numbering goes the way that gives ${fmtSet(lower.principalGroupLocants)}.`,
    }
  }

  // 2. Multiple bonds as a combined set, then double-before-triple at the first point of difference.
  const fMultiple = [...forward.doubleLocants, ...forward.tripleLocants]
  const bMultiple = [...backward.doubleLocants, ...backward.tripleLocants]
  const multipleCmp = compareNumberArrays(fMultiple, bMultiple)
  if (multipleCmp !== 0) {
    const lower = multipleCmp < 0 ? forward : backward
    return {
      winner: lower,
      ruleApplied:
        lead +
        (forward.principalGroupLocants.length > 0
          ? `Both directions give the principal group the same locant${forward.principalGroupLocants.length > 1 ? 's' : ''} (${fmtSet(forward.principalGroupLocants)}), so the tie is broken by the double/triple bonds: `
          : 'There is no principal characteristic group to decide it, so the double/triple bonds decide instead: ') +
        `${fmtSet(fMultiple)} one way versus ${fmtSet(bMultiple)} the other way. ` +
        `The lower set wins, giving the multiple bonds locant(s) ${fmtSet(multipleCmp < 0 ? fMultiple : bMultiple)}.`,
    }
  }
  if (fMultiple.length > 0) {
    const doubleCmp = compareNumberArrays(forward.doubleLocants, backward.doubleLocants)
    if (doubleCmp !== 0) {
      const lower = doubleCmp < 0 ? forward : backward
      return {
        winner: lower,
        ruleApplied:
          lead +
          `Both directions give the multiple bonds the same combined locant set, so double bonds are checked ` +
          `ahead of triple bonds at the first point of difference: ${fmtSet(forward.doubleLocants)} versus ${fmtSet(backward.doubleLocants)}. ` +
          `The lower one wins.`,
      }
    }
  }

  // 3. Substituent locants (including demoted-group prefixes) as a set.
  const fSubs = forward.substituents.map((s) => s.locant)
  const bSubs = backward.substituents.map((s) => s.locant)
  const subsCmp = compareNumberArrays(fSubs, bSubs)
  if (subsCmp !== 0) {
    const lower = subsCmp < 0 ? forward : backward
    return {
      winner: lower,
      ruleApplied:
        lead +
        `Principal group and multiple bonds don't decide it (both directions tie), so it comes down to the ` +
        `substituents' locants as a set: ${fmtSet(fSubs)} one way versus ${fmtSet(bSubs)} the other way. ` +
        `The lower set wins, giving the substituents locant(s) ${fmtSet(subsCmp < 0 ? fSubs : bSubs)}.`,
    }
  }

  // 4. Lowest locant to the substituent cited first alphabetically.
  const sortedF = [...forward.substituents].sort((a, b) => a.alphaKey.localeCompare(b.alphaKey))
  const sortedB = [...backward.substituents].sort((a, b) => a.alphaKey.localeCompare(b.alphaKey))
  if (sortedF.length > 0 && sortedB.length > 0 && sortedF[0].alphaKey === sortedB[0].alphaKey) {
    const lower = sortedF[0].locant <= sortedB[0].locant ? forward : backward
    return {
      winner: lower,
      ruleApplied:
        lead +
        `Every earlier check ties, so the very last tie-break applies: whichever direction gives the LOWEST ` +
        `locant to the substituent cited first alphabetically ("${sortedF[0].alphaKey}") wins — that's ` +
        `C${Math.min(sortedF[0].locant, sortedB[0].locant)}.`,
    }
  }

  return {
    winner: forward,
    ruleApplied: lead + 'Every numbering rule ties between the two directions — the chain is symmetric, so the direction makes no difference to the final name.',
  }
}
