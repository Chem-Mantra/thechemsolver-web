// Detects the classic tartaric-acid-style "meso trap": a 2-carbon stereocenter molecule where both
// carbons carry the SAME set of substituents (so the molecule has a potential internal mirror
// symmetry swapping carbon A and carbon B). For such molecules — and ONLY such molecules — the (R,S)/
// (S,R) combination is a single achiral MESO compound (superimposable on its own mirror image, despite
// having 2 real stereocenters), while (R,R)/(S,S) is a genuine chiral pair of enantiomers. This is the
// single most commonly cited "trap" in stereochemistry education research: students find a
// stereocenter and assume the molecule must be chiral, missing the internal symmetry.
import { AssignedGroup } from './state'

type Groups3 = readonly [AssignedGroup, AssignedGroup, AssignedGroup]

/** True when A and B carry the identical MULTISET of substituents (implicit slots count as 'H') —
 * the structural precondition for the meso/chiral-pair question to even apply. Order within each
 * carbon doesn't matter (only the set of what's attached does). */
export function hasExchangeSymmetry(groupsA: Groups3, groupsB: Groups3): boolean {
  const normalize = (g: Groups3) => g.map((x) => x ?? 'H').slice().sort()
  const a = normalize(groupsA)
  const b = normalize(groupsB)
  return a.length === b.length && a.every((v, i) => v === b[i])
}

export type MesoVerdict =
  | { kind: 'not-applicable' } // A and B don't share the same substituent set — meso/chiral-pair question doesn't apply
  | { kind: 'meso' } // (R,S) or (S,R) on a symmetric backbone — single achiral compound
  | { kind: 'chiral-pair' } // (R,R) or (S,S) on a symmetric backbone — genuine enantiomer pair

/**
 * `rsA`/`rsB` must already be each carbon's OWN true configuration (from `assignRS`). Only meaningful
 * when `hasExchangeSymmetry` holds — callers should check that first if they want to explain WHY the
 * question doesn't apply (vs. just getting 'not-applicable' back).
 */
export function mesoVerdict(groupsA: Groups3, groupsB: Groups3, rsA: 'R' | 'S', rsB: 'R' | 'S'): MesoVerdict {
  if (!hasExchangeSymmetry(groupsA, groupsB)) return { kind: 'not-applicable' }
  return rsA !== rsB ? { kind: 'meso' } : { kind: 'chiral-pair' }
}
