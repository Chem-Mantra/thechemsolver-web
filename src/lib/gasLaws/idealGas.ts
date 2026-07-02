import { R_L_ATM } from './constants'

export interface IdealGasInputs {
  P?: number // atm
  V?: number // L
  n?: number // mol
  T?: number // K
}

export type IdealGasVariable = 'P' | 'V' | 'n' | 'T'

/** Solves PV = nRT for whichever ONE of {P,V,n,T} is omitted, given the other 3 — the standard
 * "ideal gas law calculator" use case. Throws if anything other than exactly one variable is missing,
 * rather than silently guessing which one the caller meant to solve for. */
export function solveIdealGas(inputs: IdealGasInputs): number {
  const { P, V, n, T } = inputs
  const missing = (['P', 'V', 'n', 'T'] as IdealGasVariable[]).filter((k) => inputs[k] === undefined)
  if (missing.length !== 1) throw new Error(`Need exactly 3 of {P,V,n,T} to solve for the 4th — got ${4 - missing.length} provided.`)

  if (P === undefined) return (n! * R_L_ATM * T!) / V!
  if (V === undefined) return (n! * R_L_ATM * T!) / P!
  if (n === undefined) return (P * V) / (R_L_ATM * T!)
  return (P * V) / (n * R_L_ATM)
}

/** Molar volume at the given T (K) and P (atm) — at the classic US-textbook STP (273.15 K, 1 atm) this
 * evaluates to the familiar "22.4 L/mol." */
export function molarVolume(T: number, P: number): number {
  return solveIdealGas({ n: 1, T, P })
}
