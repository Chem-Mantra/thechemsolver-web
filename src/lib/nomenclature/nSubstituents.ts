import { MoleculeGraph } from './model'
import { GroupAnalysis } from './principalGroup'
import { nameSubstituent } from './substituents'
import { MULTIPLYING_PREFIXES } from './roots'

/** Concrete version of the old static RULE_N_SUBSTITUENT — describes the ACTUAL "N-..." token(s) this
 * molecule produced, not just the abstract rule. Takes the array `buildNSubstituentTokens` already
 * returned, so the two can never disagree about what was actually cited. */
export function explainNSubstituent(tokens: { alphaKey: string; token: string }[]): string {
  const cited = tokens.map((t) => `"${t.token}"`).join(', ')
  return (
    `This nitrogen carries its own substituent${tokens.length > 1 ? 's' : ''}, cited with "N" as the locant ` +
    `instead of a chain position (so two on the same nitrogen read "N,N-..."): ${cited}. ` +
    `Alphabetized together with every other substituent prefix, same as any ordinary one.`
  )
}

/** Builds "N-methyl"/"N,N-dimethyl"-style tokens for a secondary/tertiary amine or N-substituted
 * amide's PRINCIPAL group (groups.demoted never reaches here — principalGroup.ts already rejects a
 * demoted instance with N-substituents, since the fixed "amino"/"carbamoyl" prefix strings have no
 * way to carry them). Returns null (not just an empty array) only on a genuine failure — an
 * N-substituent that doesn't match a supported shape (e.g. RULES.md §5's branched-ylidene gaps) —
 * versus [] for the ordinary case of no N-substituents at all. Shared by both naming paths that can
 * reach a principal amine/amide: the plain acyclic pipeline (nameMolecule.ts) and an off-ring chain
 * promoted to parent (ringSubstituentChain.ts) — found via fuzz testing against OPSIN: the latter
 * called assembleAcyclicName directly without this, silently dropping a ring-attached secondary
 * amine's N-substituent from the name while the underlying structure still had it. */
export function buildNSubstituentTokens(
  graph: MoleculeGraph,
  groups: GroupAnalysis
): { alphaKey: string; token: string }[] | null {
  if (groups.principalType !== 'amine' && groups.principalType !== 'amide') return []
  if (groups.principal.length !== 1) {
    // A diamine/diamide where one instance happens to be secondary/tertiary isn't built yet — kept
    // simple by relying on the same principalGroup.ts machinery used for the demoted case instead.
    return groups.principal.some((g) => (g.nSubstituentIds?.length ?? 0) > 0) ? null : []
  }
  const group = groups.principal[0]
  const ids = group.nSubstituentIds ?? []
  if (ids.length === 0) return []
  // amine: heteroatomIds = [nitrogenId]; amide: heteroatomIds = [doubleOId, nitrogenId].
  const nAtomId = group.heteroatomIds[group.heteroatomIds.length - 1]
  const named = ids.map((id) => nameSubstituent(graph, id, nAtomId))
  if (named.some((n) => !n)) return null
  const counts = new Map<string, { alphaKey: string; count: number }>()
  for (const n of named) {
    const entry = counts.get(n!.name) ?? { alphaKey: n!.alphaKey, count: 0 }
    entry.count += 1
    counts.set(n!.name, entry)
  }
  return Array.from(counts.entries()).map(([name, { alphaKey, count }]) => {
    const composite = name.includes('-')
    const word = composite ? `(${name})` : name
    const mult = count > 1 ? MULTIPLYING_PREFIXES[count] ?? '' : ''
    const nLabel = Array(count).fill('N').join(',')
    return { alphaKey, token: `${nLabel}-${mult}${word}` }
  })
}
