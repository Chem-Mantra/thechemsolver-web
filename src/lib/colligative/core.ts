import { R_L_ATM, Solvent } from './constants'

export interface BoilingPointResult {
  deltaTb: number
  newBoilingPointC: number
}

/** ΔTb = i·Kb·m, the boiling point elevation — applies to any solute (electrolyte or not), since
 * boiling/freezing point shifts depend only on the TOTAL particle concentration, not particle identity. */
export function boilingPointElevation(molality: number, vantHoffFactor: number, solvent: Pick<Solvent, 'Kb' | 'normalBoilingPointC'>): BoilingPointResult {
  const deltaTb = vantHoffFactor * solvent.Kb * molality
  return { deltaTb, newBoilingPointC: solvent.normalBoilingPointC + deltaTb }
}

export interface FreezingPointResult {
  deltaTf: number
  newFreezingPointC: number
}

/** ΔTf = i·Kf·m, the freezing point depression. */
export function freezingPointDepression(molality: number, vantHoffFactor: number, solvent: Pick<Solvent, 'Kf' | 'normalFreezingPointC'>): FreezingPointResult {
  const deltaTf = vantHoffFactor * solvent.Kf * molality
  return { deltaTf, newFreezingPointC: solvent.normalFreezingPointC - deltaTf }
}

/** π = iMRT, the van't Hoff osmotic pressure equation — M in mol/L, T in K, returns atm. */
export function osmoticPressureAtm(molarity: number, vantHoffFactor: number, temperatureK: number): number {
  return vantHoffFactor * molarity * R_L_ATM * temperatureK
}

export interface RaoultResult {
  solutionVaporPressure: number
  vaporPressureLowering: number
}

/** Raoult's law: P_solution = X_solvent·P°_solvent, so the lowering ΔP = X_solute·P°_solvent. Pressure
 * unit is whatever `pureVaporPressure` is given in (mmHg, atm, kPa...) — the law is unit-agnostic. */
export function raoultVaporPressure(soluteMoleFraction: number, pureVaporPressure: number): RaoultResult {
  const solventMoleFraction = 1 - soluteMoleFraction
  const solutionVaporPressure = solventMoleFraction * pureVaporPressure
  return { solutionVaporPressure, vaporPressureLowering: pureVaporPressure - solutionVaporPressure }
}

/** Molality (mol solute / kg solvent) from moles of solute and solvent mass in grams — the form most
 * "X g of solute in Y g of solvent" textbook problems actually give. */
export function molalityFromMass(molesSolute: number, solventMassG: number): number {
  return molesSolute / (solventMassG / 1000)
}

export interface BoilingPointDerivation {
  formula: string
  substitution: string
  result: string
}

export function boilingPointDerivation(molality: number, vantHoffFactor: number, solvent: Pick<Solvent, 'Kb' | 'normalBoilingPointC'>): BoilingPointDerivation {
  const { deltaTb, newBoilingPointC } = boilingPointElevation(molality, vantHoffFactor, solvent)
  return {
    formula: 'ΔTb = i · Kb · m',
    substitution: `ΔTb = ${vantHoffFactor} × ${solvent.Kb} × ${molality}`,
    result: `ΔTb = ${deltaTb.toFixed(3)} °C → new bp = ${newBoilingPointC.toFixed(3)} °C`,
  }
}

export interface FreezingPointDerivation {
  formula: string
  substitution: string
  result: string
}

export function freezingPointDerivation(molality: number, vantHoffFactor: number, solvent: Pick<Solvent, 'Kf' | 'normalFreezingPointC'>): FreezingPointDerivation {
  const { deltaTf, newFreezingPointC } = freezingPointDepression(molality, vantHoffFactor, solvent)
  return {
    formula: 'ΔTf = i · Kf · m',
    substitution: `ΔTf = ${vantHoffFactor} × ${solvent.Kf} × ${molality}`,
    result: `ΔTf = ${deltaTf.toFixed(3)} °C → new fp = ${newFreezingPointC.toFixed(3)} °C`,
  }
}

export interface OsmoticPressureDerivation {
  formula: string
  substitution: string
  result: string
}

export function osmoticPressureDerivation(molarity: number, vantHoffFactor: number, temperatureK: number): OsmoticPressureDerivation {
  const pi = osmoticPressureAtm(molarity, vantHoffFactor, temperatureK)
  return {
    formula: 'π = i · M · R · T',
    substitution: `π = ${vantHoffFactor} × ${molarity} × ${R_L_ATM} × ${temperatureK}`,
    result: `π = ${pi.toFixed(3)} atm`,
  }
}
