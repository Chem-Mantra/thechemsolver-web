import { PhaseDiagramSubstance } from './constants'

/**
 * Modeling notes (read before trusting a number out of this module away from a substance's own
 * triple/critical point):
 *
 * - Above the triple point, the liquid-gas (vaporization) boundary is a Clausius-Clapeyron exponential
 *   calibrated through the triple point and the critical point. Below the triple point, the solid-gas
 *   (sublimation) boundary is calibrated through the triple point and `normalSublimationPointK` (1 atm)
 *   when available (currently CO2) — sublimation has a different, steeper slope than vaporization
 *   (ΔHsub = ΔHfus + ΔHvap), so reusing the vaporization curve's calibration below the triple point would
 *   under-predict how cold the substance needs to be to stay solid at 1 atm. Where no dedicated
 *   sublimation point is given (water, whose 1 atm transition near room conditions is governed by the
 *   fusion curve instead), the triple→critical curve is reused below the triple point as a fallback —
 *   good enough for the qualitative shape there, not a substitute for water's real ΔHsub.
 * - The fusion (solid-liquid) boundary is modeled as a straight line through the triple point with a
 *   small FIXED slope magnitude (real fusion curves are famously almost vertical — for water it takes
 *   roughly 130-140 atm to shift the melting point by 1°C, the commonly cited ballpark this constant is
 *   tuned to). The SIGN of the slope (`fusionSlope`) is physically correct per substance; the exact
 *   magnitude away from the triple point is illustrative.
 */

const FUSION_DT_DP_K_PER_ATM = 0.0074 // ≈ water's real ballpark; sign is applied per-substance

/** Calibrates k in P = P1·exp(-k(1/T - 1/T1)) so the curve passes through both (T1,P1) and (T2,P2)
 * exactly — the standard 2-point form of the Clausius-Clapeyron equation. */
function calibrateK(T1: number, P1: number, T2: number, P2: number): number {
  return -Math.log(P2 / P1) / (1 / T2 - 1 / T1)
}

/** The solid/gas-or-liquid boundary pressure at temperature T (K), per the module's modeling notes
 * above — branches at the triple point between the sublimation and vaporization calibrations. */
export function vaporPressureCurveAtm(substance: PhaseDiagramSubstance, T: number): number {
  const { triplePointK: Tt, triplePointAtm: Pt, criticalPointK: Tc, criticalPointAtm: Pc, normalSublimationPointK } = substance
  if (T <= Tt && normalSublimationPointK !== null) {
    const k = calibrateK(Tt, Pt, normalSublimationPointK, 1)
    return Pt * Math.exp(-k * (1 / T - 1 / Tt))
  }
  const k = calibrateK(Tt, Pt, Tc, Pc)
  return Pt * Math.exp(-k * (1 / T - 1 / Tt))
}

/** The fusion (solid-liquid) boundary temperature at pressure P (atm) — only meaningful for P ≥ the
 * triple point pressure, since no liquid phase exists below it. */
export function fusionBoundaryK(substance: PhaseDiagramSubstance, P: number): number {
  const sign = substance.fusionSlope === 'negative' ? -1 : 1
  return substance.triplePointK + sign * FUSION_DT_DP_K_PER_ATM * (P - substance.triplePointAtm)
}

export type Phase = 'solid' | 'liquid' | 'gas' | 'supercritical'

/** Classifies which phase a substance is in at the given temperature (K) and pressure (atm). */
export function classifyPoint(substance: PhaseDiagramSubstance, T: number, P: number): Phase {
  if (T > substance.criticalPointK && P > substance.criticalPointAtm) return 'supercritical'

  const Pvp = vaporPressureCurveAtm(substance, T)
  if (P < Pvp) return 'gas'

  if (P <= substance.triplePointAtm) return 'solid' // no liquid phase possible below the triple point pressure

  const Tfusion = fusionBoundaryK(substance, P)
  return T < Tfusion ? 'solid' : 'liquid'
}

export interface CurveSweepPoint {
  temperatureK: number
  pressureAtm: number
}

/** Samples the vapor-pressure boundary curve across a temperature range — for plotting. */
export function vaporPressureCurveSweep(substance: PhaseDiagramSubstance, tMinK: number, tMaxK: number, steps = 80): CurveSweepPoint[] {
  return Array.from({ length: steps }, (_, i) => {
    const T = tMinK + ((tMaxK - tMinK) * i) / (steps - 1)
    return { temperatureK: T, pressureAtm: vaporPressureCurveAtm(substance, T) }
  })
}

/** Samples the fusion boundary curve across a pressure range — for plotting. Returns {temperatureK,
 * pressureAtm} pairs so it composes with the same plotting code as vaporPressureCurveSweep, even though
 * here pressure is the independent variable. */
export function fusionBoundarySweep(substance: PhaseDiagramSubstance, pMinAtm: number, pMaxAtm: number, steps = 40): CurveSweepPoint[] {
  return Array.from({ length: steps }, (_, i) => {
    const P = pMinAtm + ((pMaxAtm - pMinAtm) * i) / (steps - 1)
    return { temperatureK: fusionBoundaryK(substance, P), pressureAtm: P }
  })
}
