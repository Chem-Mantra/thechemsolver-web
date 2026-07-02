// SN1/SN2/E1/E2 pathway prediction — a rules-based decision engine over the standard textbook
// variables (substrate class, nucleophile/base strength+bulk, solvent, temperature), NOT a full
// structure/graph engine like nomenclature's stereo.ts. Scope is deliberately the well-established
// intro-organic-chemistry decision framework (Klein/Master Organic Chemistry style) — see predict.ts's
// top comment for the explicit list of nuances left out of v1 (neighboring-group steric effects beyond
// plain substrate class, ring anti-periplanar geometry, carbocation rearrangement specifics).

export type SubstrateClass = 'methyl' | 'primary' | 'secondary' | 'tertiary'

export type Solvent = 'protic' | 'aprotic'

export type Mechanism = 'SN1' | 'SN2' | 'E1' | 'E2'

export type Likelihood = 'dominant' | 'minor' | 'none'

/** A reagent's classification along the 3 axes that actually drive the SN1/SN2/E1/E2 decision —
 * independent of which specific solvent a given problem pairs it with (the same reagent can appear in
 * both protic and aprotic problems), so `defaultSolvent` is just a sensible UI starting point, not a
 * fixed fact about the reagent. */
export interface ReagentProfile {
  id: string
  label: string
  /** How good this species is at attacking carbon in a concerted backside SN2 step — independent of
   * basicity (e.g. tBuO⁻ is a strong BASE but a poor nucleophile because of its bulk). */
  nucleophilicity: 'strong' | 'weak'
  /** How good this species is at removing a proton (E2/E1 driving force). */
  basicity: 'strong' | 'weak'
  /** Steric bulk — a bulky base/nucleophile is sterically blocked from backside attack (poor SN2) and
   * is pushed toward proton abstraction (E2) instead, even on substrates that would otherwise tolerate
   * SN2 fine. */
  bulk: 'small' | 'bulky'
  defaultSolvent: Solvent
  note: string
}

export interface PredictionInput {
  substrate: SubstrateClass
  /** Allylic/benzylic 1° (or any case where the carbocation would be resonance-stabilized) — the one
   * deliberate escape hatch from "1°/methyl can't ionize," since this specific exception is common
   * enough in homework problems to be worth modeling explicitly rather than excluding outright. */
  resonanceStabilized: boolean
  reagentId: string
  solvent: Solvent
  heat: boolean
}

export interface MechanismVerdict {
  mechanism: Mechanism
  likelihood: Likelihood
  reasoning: string[]
}

export interface PredictionResult {
  verdicts: MechanismVerdict[]
  /** The single highest-likelihood mechanism(s) — ties are possible (e.g. a genuine SN1/E1 mixture). */
  dominant: Mechanism[]
  summary: string
  productHint?: string
  caveats: string[]
}
