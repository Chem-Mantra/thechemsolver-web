/** Atom symbol → count. Uses NOMINAL (integer) atomic masses throughout, not exact monoisotopic
 * masses — the standard simplification intro courses use for EI-MS nominal-mass problems. */
export type Formula = Partial<Record<'C' | 'H' | 'N' | 'O' | 'F' | 'Cl' | 'Br', number>>

export interface FragmentationPathway {
  label: string
  neutralLoss: Formula
  fragmentDescription: string
  isBasePeak: boolean
}

export interface MassSpecMolecule {
  id: string
  name: string
  formulaLabel: string
  formula: Formula
  /** Qualitative note about the molecular ion peak's relative intensity — some classes (branched
   * alcohols, alkyl halides) fragment so readily that M⁺• is weak or unobserved; conjugated/aromatic
   * molecules tend to show a prominent M⁺•. */
  molecularIonNote: string
  pathways: FragmentationPathway[]
}
