export type Multiplicity = 'singlet' | 'doublet' | 'triplet' | 'quartet' | 'quintet' | 'sextet' | 'septet' | 'multiplet'

export interface ProtonGroup {
  label: string
  /** ppm, downfield (high) to upfield (low) — a representative value, not a precise prediction. */
  shiftPpm: number
  /** Number of H's in this chemically-equivalent group — the relative integration. */
  integration: number
  /** Number of NON-equivalent neighboring H's this group couples to — the input to the n+1 rule.
   * Equivalent protons don't split each other (e.g. ClCH2CH2Cl's 4 H's are one singlet), and OH/NH are
   * modeled here as showing no resolved coupling (neighborCount=0) per the common simplification that
   * fast exchange washes out that splitting in practice — both deliberate, documented simplifications. */
  neighborCount: number
  assignment: string
}

export interface NmrMolecule {
  id: string
  name: string
  formula: string
  totalH: number
  groups: ProtonGroup[]
}
