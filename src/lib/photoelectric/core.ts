import { HC_EV_NM, C_M_S } from './constants'

/** Photon energy in eV for a given wavelength in nm — E = hc/λ. */
export function photonEnergyEV(wavelengthNm: number): number {
  return HC_EV_NM / wavelengthNm
}

/** Threshold wavelength in nm below which (i.e. higher frequency/energy than) photoelectrons are
 * emitted — the longest wavelength capable of ejecting an electron from this metal. */
export function thresholdWavelengthNm(workFunctionEV: number): number {
  return HC_EV_NM / workFunctionEV
}

export interface PhotoelectricResult {
  photonEnergyEV: number
  /** false when the photon energy doesn't clear the work function — no photoelectrons are emitted
   * at ANY intensity, the central result classical wave theory couldn't explain. */
  emits: boolean
  /** eV; null when `emits` is false. */
  maxKineticEnergyEV: number | null
  /** volts; numerically equal to maxKineticEnergyEV since both express the same energy per electron
   * charge (V_stop = KE/e, and KE is already expressed in eV = energy per e). null when `emits` is false. */
  stoppingVoltageV: number | null
}

/** Applies Einstein's photoelectric equation, KE_max = hf − φ = hc/λ − φ, for light of the given
 * wavelength on a metal with the given work function. */
export function solvePhotoelectric(wavelengthNm: number, workFunctionEV: number): PhotoelectricResult {
  const E = photonEnergyEV(wavelengthNm)
  const KE = E - workFunctionEV
  const emits = KE > 0
  return {
    photonEnergyEV: E,
    emits,
    maxKineticEnergyEV: emits ? KE : null,
    stoppingVoltageV: emits ? KE : null,
  }
}

export interface KeVsFrequencyPoint {
  frequencyHz: number
  keEV: number | null
}

/** c/λ, with λ in nm converted to meters. */
export function wavelengthToFrequencyHz(wavelengthNm: number): number {
  return C_M_S / (wavelengthNm * 1e-9)
}

/** A KE_max-vs-frequency sweep for the classic Einstein plot — a straight line of slope h, x-intercept
 * at the threshold frequency f0 = φ/h, and y-intercept at −φ. Points below threshold come back with
 * `keEV: null` rather than a negative number, since no photoelectrons (and therefore no KE) exist there. */
export function keVsFrequencySweep(wavelengthsNm: number[], workFunctionEV: number): KeVsFrequencyPoint[] {
  return wavelengthsNm.map((lambda) => ({
    frequencyHz: wavelengthToFrequencyHz(lambda),
    keEV: solvePhotoelectric(lambda, workFunctionEV).maxKineticEnergyEV,
  }))
}

export interface PhotoelectricDerivation {
  photonEnergyFormula: string
  photonEnergySubstitution: string
  photonEnergyResult: string
  keFormula: string
  keSubstitution: string
  keResult: string
}

/** Builds formula → substitution → result steps for both the photon energy and the resulting maximum
 * kinetic energy, reusing `solvePhotoelectric`'s exact arithmetic so the displayed work can never drift
 * from the real computed answer. */
export function photoelectricDerivation(wavelengthNm: number, workFunctionEV: number): PhotoelectricDerivation {
  const { photonEnergyEV: E, emits, maxKineticEnergyEV } = solvePhotoelectric(wavelengthNm, workFunctionEV)
  const KE = emits ? maxKineticEnergyEV! : E - workFunctionEV
  return {
    photonEnergyFormula: 'E = hc / λ',
    photonEnergySubstitution: `E = ${HC_EV_NM.toFixed(2)} eV·nm / ${wavelengthNm} nm`,
    photonEnergyResult: `E = ${E.toFixed(3)} eV`,
    keFormula: 'KE_max = E − φ',
    keSubstitution: `KE_max = ${E.toFixed(3)} eV − ${workFunctionEV} eV`,
    keResult: emits ? `KE_max = ${KE.toFixed(3)} eV` : `KE_max = ${KE.toFixed(3)} eV → no photoelectrons emitted (E < φ)`,
  }
}
