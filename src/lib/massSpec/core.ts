import { Formula, MassSpecMolecule } from './types'

/** Nominal (integer) atomic masses — the standard simplification for EI-MS "calculate the m/z" problems
 * at the intro level, as opposed to exact monoisotopic masses. */
export const NOMINAL_MASS: Record<string, number> = { H: 1, C: 12, N: 14, O: 16, F: 19, Cl: 35, Br: 79 }

export function formulaMass(formula: Formula): number {
  return Object.entries(formula).reduce((sum, [el, count]) => sum + NOMINAL_MASS[el] * (count ?? 0), 0)
}

export interface PredictedPeak {
  label: string
  mz: number
  description: string
  isBasePeak: boolean
  isMolecularIon: boolean
}

/** Computes the molecular ion m/z and every curated fragmentation pathway's m/z as M minus the
 * neutral-loss mass, sorted by decreasing m/z (the conventional left-to-right reading order of a mass
 * spectrum). The m/z arithmetic is genuinely computed from the formula, not hardcoded — only the
 * CHOICE of which fragmentation pathways occur (and which is the base peak) is curated reference data. */
export function predictMassSpectrum(molecule: MassSpecMolecule): PredictedPeak[] {
  const M = formulaMass(molecule.formula)
  const molecularIonPeak: PredictedPeak = {
    label: 'M⁺• (molecular ion)',
    mz: M,
    description: molecule.molecularIonNote,
    isBasePeak: false,
    isMolecularIon: true,
  }
  const fragmentPeaks = molecule.pathways.map((p) => ({
    label: p.label,
    mz: M - formulaMass(p.neutralLoss),
    description: p.fragmentDescription,
    isBasePeak: p.isBasePeak,
    isMolecularIon: false,
  }))
  return [molecularIonPeak, ...fragmentPeaks].sort((a, b) => b.mz - a.mz)
}
