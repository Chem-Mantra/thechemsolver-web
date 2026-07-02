import { R_L_ATM, VdwGasConstants } from './constants'

export function idealPressure(n: number, V: number, T: number): number {
  return (n * R_L_ATM * T) / V
}

/** Pressure predicted by the van der Waals equation — a direct algebraic rearrangement of
 * (P + an²/V²)(V − nb) = nRT, valid as long as V > nb (otherwise the gas's own molecules would have to
 * occupy negative free volume, which is unphysical — this is exactly the same "excluded volume" b
 * correction, just pushed to its breaking point). */
export function vdwPressure(n: number, V: number, T: number, gas: Pick<VdwGasConstants, 'a' | 'b'>): number {
  const freeVolume = V - n * gas.b
  if (freeVolume <= 0) {
    throw new Error('Volume must exceed the gas\'s own excluded volume (n·b) for the van der Waals equation to stay physical.')
  }
  return (n * R_L_ATM * T) / freeVolume - (gas.a * n * n) / (V * V)
}

/** Percent by which the real (van der Waals) pressure differs from the ideal-gas prediction at the
 * same n, V, T — the standard "how non-ideal is this gas under these conditions" metric. Negative means
 * the real gas exerts LESS pressure than ideal (intermolecular attraction, the `a` term, dominates);
 * positive means MORE (excluded volume, the `b` term, dominates) — both regimes are real and testable. */
export function percentDeviation(n: number, V: number, T: number, gas: Pick<VdwGasConstants, 'a' | 'b'>): number {
  const pIdeal = idealPressure(n, V, T)
  const pVdw = vdwPressure(n, V, T, gas)
  return ((pVdw - pIdeal) / pIdeal) * 100
}

export interface PressureDerivation {
  formula: string
  substitution: string
  /** Only present for van der Waals, where the two correction terms are worth showing combined-but-
   * not-yet-subtracted before the final number — the ideal-gas case has nothing to simplify. */
  simplified?: string
  result: string
}

/** Builds the formula → substitution → result steps for a plain ideal-gas pressure calculation, using
 * the exact same `idealPressure` arithmetic — so the displayed work can never drift from the real
 * computed answer. */
export function idealPressureDerivation(n: number, V: number, T: number): PressureDerivation {
  const P = idealPressure(n, V, T)
  return {
    formula: 'P = nRT / V',
    substitution: `P = (${n} mol × ${R_L_ATM} L·atm/mol·K × ${T} K) / ${V} L`,
    result: `P = ${P.toFixed(3)} atm`,
  }
}

/** Builds the formula → substitution → simplified-terms → result steps for a van der Waals pressure
 * calculation, reusing `vdwPressure`'s exact arithmetic for the final number (computed independently
 * here only for the purpose of displaying the 2 separated terms before they're subtracted). */
export function vdwPressureDerivation(n: number, V: number, T: number, gas: Pick<VdwGasConstants, 'a' | 'b'>): PressureDerivation {
  const freeVolume = V - n * gas.b
  if (freeVolume <= 0) {
    throw new Error('Volume must exceed the gas\'s own excluded volume (n·b) for the van der Waals equation to stay physical.')
  }
  const attractionTerm = (n * R_L_ATM * T) / freeVolume
  const excludedVolumeTerm = (gas.a * n * n) / (V * V)
  const P = attractionTerm - excludedVolumeTerm
  return {
    formula: 'P = nRT / (V − nb) − an² / V²',
    substitution: `P = (${n} × ${R_L_ATM} × ${T}) / (${V} − ${n}×${gas.b}) − (${gas.a} × ${n}²) / ${V}²`,
    simplified: `P = ${attractionTerm.toFixed(3)} − ${excludedVolumeTerm.toFixed(3)}`,
    result: `P = ${P.toFixed(3)} atm`,
  }
}

/** Finds the smallest volume above the excluded volume at which the van der Waals deviation from ideal
 * has decayed to within `thresholdPercent` — the "where does this stop being interesting" boundary.
 * Used to auto-scale an isotherm plot's volume axis so the deviation region (which can be a tiny
 * sliver next to a much larger, visually flat low-density tail) isn't squeezed out of view. */
export function findDeviationCutoffVolume(n: number, T: number, gas: Pick<VdwGasConstants, 'a' | 'b'>, thresholdPercent = 0.5): number {
  const vBound = n * gas.b
  let V = vBound * 1.02
  for (let i = 0; i < 200; i++) {
    V *= 1.08
    if (Math.abs(percentDeviation(n, V, T, gas)) < thresholdPercent) return V
  }
  return V
}

export interface IsothermPoint {
  V: number
  idealP: number
  /** null where V doesn't exceed the gas's own excluded volume (n·b) — van der Waals isn't physical there. */
  vdwP: number | null
}

/** A pressure-vs-volume sweep at fixed n, T for both models — what an isotherm comparison plot needs.
 * `volumes` should be ascending; points at or below the excluded volume are returned with `vdwP: null`
 * rather than thrown away, so the UI can still show WHERE the real-gas curve becomes invalid. */
export function isothermSweep(n: number, T: number, gas: Pick<VdwGasConstants, 'a' | 'b'>, volumes: number[]): IsothermPoint[] {
  return volumes.map((V) => ({
    V,
    idealP: idealPressure(n, V, T),
    vdwP: V > n * gas.b ? vdwPressure(n, V, T, gas) : null,
  }))
}
