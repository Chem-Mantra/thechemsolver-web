// Conceptual quiz content for the practice-quiz lab: CIP-priority comparisons and the R/S-vs-optical-
// rotation misconception, both directly targeting documented research findings (see chat history) —
// "students misuse atom-count instead of atomic number / miss the duplicate-atom rule" and "R does not
// equal (+), S does not equal (-)" are the two most frequently cited stereochemistry misconceptions in
// the chemistry-education literature.
import { createEmptyGraph, addAtom, bondBetween } from '../nomenclature/model'
import { attachSubstituent } from '../nomenclature/editOps'
import { rankSubstituents } from '../nomenclature/stereo'
import { SubstituentKind } from '../nomenclature/editOps'

/**
 * Which of `a`/`b` has the HIGHER CIP priority, determined by actually building a 2-substituent
 * carbon and asking the same `rankSubstituents` engine the rest of this app already trusts for R/S —
 * never hand-asserted, since CIP priority ordering (especially the duplicate-atom rule for C=O/C≡N,
 * and "more atoms visually" vs "higher atomic number at first difference") is exactly the kind of
 * thing that's easy to get backwards by reasoning alone.
 */
// A third, always-distinct filler substituent — needed because attaching only `a` and `b` leaves 2
// implicit hydrogens on the center, which TIE with each other and make `rankSubstituents` return null
// (it refuses to guess past a genuine tie, see its own doc comment). 'F' never appears in
// `CIP_RANK_PAIRS` and never structurally ties with any of those groups, so it safely reduces the
// implicit-H count to 1 (no tie possible) without affecting the a-vs-b comparison itself — each
// substituent's CIP tree is built independently from the center.
const FILLER: SubstituentKind = 'F'

export function higherPriorityGroup(a: SubstituentKind, b: SubstituentKind): SubstituentKind {
  let graph = createEmptyGraph()
  const center = addAtom(graph, 'C', 0, 0)
  const attach = (kind: SubstituentKind, x: number, y: number): string => {
    const before = new Set(Object.keys(graph.atoms))
    graph = attachSubstituent(graph, center.id, kind, { x, y })
    return Object.keys(graph.atoms).find((id) => !before.has(id) && bondBetween(graph, center.id, id))!
  }
  const idA = attach(a, 1, -1)
  const idB = attach(b, -1, -1)
  attach(FILLER, 0, 1)
  const ranked = rankSubstituents(graph, center.id)
  if (!ranked) throw new Error(`higherPriorityGroup(${a}, ${b}): ranking engine reported a tie — pick a different FILLER or pair`)
  const rankOf = (id: string) => ranked.find((r) => r.atomId === id)!.rank
  return rankOf(idA) < rankOf(idB) ? a : b
}

export interface CipRankPair {
  a: SubstituentKind
  b: SubstituentKind
  /** Why — written to explain whichever of a/b actually wins per `higherPriorityGroup` (verified by a
   * test against the real engine, not just asserted here). */
  explanation: string
}

/** Curated comparison pairs covering the documented traps: the duplicate-atom rule for C=O/C≡N
 * (CHO/COOH/CN all attach as carbon but expand to multiple high-priority neighbors), "more atoms
 * doesn't mean higher priority" (CH3 vs C2H5 — both look like "just carbon chains" but differ one
 * shell out), and "the group that LOOKS bigger/fancier can still lose on the very first atom"
 * (COOH vs OCH3 — oxygen beats carbon before COOH's internal structure is ever examined). */
export const CIP_RANK_PAIRS: CipRankPair[] = [
  {
    a: 'OH',
    b: 'NH2',
    explanation: 'The very first atom decides it: O (atomic number 8) outranks N (7). No need to look any further.',
  },
  {
    a: 'Br',
    b: 'Cl',
    explanation: 'Straight atomic number comparison: Br (35) outranks Cl (17).',
  },
  {
    a: 'CH3',
    b: 'C2H5',
    explanation:
      'Both attach through carbon, so CIP has to look one shell further: CH3\'s carbon sees only (H,H,H), but C2H5\'s carbon sees (C,H,H) — a carbon there outranks a third hydrogen, so C2H5 wins.',
  },
  {
    a: 'CHO',
    b: 'CN',
    explanation:
      "Both attach through carbon, and both use the duplicate-atom rule (C=O duplicates O once, C≡N duplicates N twice) — but CIP compares the HIGHEST-ranked duplicated neighbor first: CHO's best neighbor is O (8), CN's best neighbor is N (7). O beats N immediately, even though CN has three duplicated neighbors against CHO's two — more duplicates does NOT beat one higher-priority atom.",
  },
  {
    a: 'COOH',
    b: 'CHO',
    explanation:
      "Both carbons see two oxygens first (tied). The THIRD neighbor breaks it: COOH's carbon also bonds to the -OH oxygen (a third O), while CHO's carbon only has a remaining H. Three O's beats two O's and an H.",
  },
  {
    a: 'COOH',
    b: 'OCH3',
    explanation:
      "Don't be fooled by COOH looking like the 'bigger' group — CIP only looks at the atom DIRECTLY attached first. COOH attaches through carbon (6); OCH3 attaches through oxygen (8) directly. Oxygen wins before COOH's internal structure is even examined.",
  },
]

export interface RotationStatement {
  statement: string
  isTrue: boolean
  explanation: string
}

/** The "R ≠ (+), S ≠ (−)" misconception, broken into true/false statements — one of the most
 * frequently cited stereochemistry misconceptions in chemistry-education research and MCAT prep. */
export const ROTATION_STATEMENTS: RotationStatement[] = [
  {
    statement: 'An (R) configuration always rotates plane-polarized light clockwise, i.e. is always (+).',
    isTrue: false,
    explanation:
      '(R)/(S) is a STRUCTURAL label from the CIP priority rules — pure geometry. (+)/(−) is an experimentally MEASURED property (which way a polarimeter shows light rotating). They are not derived from each other: some (R) compounds are (+), some are (−), and you cannot tell which just by looking at the structure.',
  },
  {
    statement: 'You can predict whether a compound is dextrorotatory (+) or levorotatory (−) just by working out its CIP (R/S) configuration on paper.',
    isTrue: false,
    explanation:
      'No — optical rotation direction and magnitude must be measured (or looked up), never derived from CIP rules. (R)/(S) and (+)/(−) are independent labeling systems that happen to both describe chirality.',
  },
  {
    statement: 'Two enantiomers (mirror images of each other) always have opposite (R)/(S) labels at every corresponding stereocenter.',
    isTrue: true,
    explanation:
      "True by definition of 'enantiomer' — a mirror image inverts every stereocenter's configuration. (This is exactly why swapping any 2 groups on a stereocenter — a single mirror-like operation — always flips its R/S label, the same invariant used throughout this lab.)",
  },
  {
    statement: 'Two enantiomers always rotate plane-polarized light by the same amount but in opposite directions.',
    isTrue: true,
    explanation:
      'True — this one IS guaranteed, because rotation magnitude/direction is a physical consequence of the molecule\'s actual 3D shape, and mirror-image shapes interact with polarized light as exact opposites. The part that\'s NOT predictable is which specific enantiomer is (+) and which is (−) just from looking at R/S — that still has to be measured.',
  },
  {
    statement: 'A racemic mixture (50/50 of both enantiomers) shows zero net optical rotation.',
    isTrue: true,
    explanation:
      "True — equal amounts of (+) and (−) rotation exactly cancel. This is why a racemic mixture is described as 'optically inactive' even though every individual molecule in it IS chiral.",
  },
]
