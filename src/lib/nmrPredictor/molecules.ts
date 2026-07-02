import { NmrMolecule } from './types'

/** Sentinel neighbor count for groups whose real coupling pattern is too complex for the simple n+1
 * rule to apply cleanly (monosubstituted-benzene aromatic rings, vinyl ABX systems) — always resolves
 * to 'multiplet' rather than a specific peak count. */
export const COMPLEX_NEIGHBORS = 7

/** A curated set of classic intro-organic-chemistry ¹H NMR examples — chosen because their signal
 * count, splitting, integration, and approximate shifts are extremely well-established and commonly
 * taught, not because they're exhaustive. This is NOT a general structure-to-spectrum engine: it
 * doesn't parse arbitrary molecules, detect equivalence from a drawn structure, or predict aromatic
 * substitution patterns. OH/NH/COOH groups are modeled with neighborCount=0 (appearing as a singlet)
 * per the standard simplification that fast proton exchange washes out their coupling in practice. */
export const NMR_MOLECULES: NmrMolecule[] = [
  {
    id: 'ethanol', name: 'Ethanol', formula: 'CH₃CH₂OH', totalH: 6,
    groups: [
      { label: 'CH₃', shiftPpm: 1.2, integration: 3, neighborCount: 2, assignment: 'Methyl, split by adjacent CH₂' },
      { label: 'CH₂', shiftPpm: 3.7, integration: 2, neighborCount: 3, assignment: 'Methylene next to O, split by adjacent CH₃' },
      { label: 'OH', shiftPpm: 2.6, integration: 1, neighborCount: 0, assignment: 'Hydroxyl — variable shift, exchange washes out coupling' },
    ],
  },
  {
    id: 'acetone', name: 'Acetone', formula: '(CH₃)₂C=O', totalH: 6,
    groups: [
      { label: 'CH₃ ×2', shiftPpm: 2.1, integration: 6, neighborCount: 0, assignment: 'Both methyls equivalent, no adjacent H' },
    ],
  },
  {
    id: 'diethylEther', name: 'Diethyl ether', formula: 'CH₃CH₂-O-CH₂CH₃', totalH: 10,
    groups: [
      { label: 'CH₃ ×2', shiftPpm: 1.2, integration: 6, neighborCount: 2, assignment: 'Methyls, split by adjacent CH₂' },
      { label: 'CH₂ ×2', shiftPpm: 3.4, integration: 4, neighborCount: 3, assignment: 'Methylenes next to O, split by adjacent CH₃' },
    ],
  },
  {
    id: 'toluene', name: 'Toluene', formula: 'C₆H₅-CH₃', totalH: 8,
    groups: [
      { label: 'Ar-H ×5', shiftPpm: 7.2, integration: 5, neighborCount: COMPLEX_NEIGHBORS, assignment: 'Aromatic ring protons — real pattern too complex for simple n+1' },
      { label: 'CH₃', shiftPpm: 2.3, integration: 3, neighborCount: 0, assignment: 'Methyl attached directly to the ring, no adjacent H' },
    ],
  },
  {
    id: 'dichloroethane', name: '1,2-Dichloroethane', formula: 'ClCH₂CH₂Cl', totalH: 4,
    groups: [
      { label: 'CH₂ ×2', shiftPpm: 3.7, integration: 4, neighborCount: 0, assignment: 'All 4 H equivalent — equivalent protons do not split each other' },
    ],
  },
  {
    id: 'acetaldehyde', name: 'Acetaldehyde', formula: 'CH₃CHO', totalH: 4,
    groups: [
      { label: 'CH₃', shiftPpm: 2.2, integration: 3, neighborCount: 1, assignment: 'Methyl, split by the single CHO proton' },
      { label: 'CHO', shiftPpm: 9.8, integration: 1, neighborCount: 3, assignment: 'Aldehyde proton, far downfield, split by adjacent CH₃' },
    ],
  },
  {
    id: 'ethylAcetate', name: 'Ethyl acetate', formula: 'CH₃COOCH₂CH₃', totalH: 8,
    groups: [
      { label: 'CH₃CO', shiftPpm: 2.0, integration: 3, neighborCount: 0, assignment: 'Acetyl methyl, no adjacent H' },
      { label: 'OCH₂', shiftPpm: 4.1, integration: 2, neighborCount: 3, assignment: 'Methylene next to ester O, split by adjacent CH₃' },
      { label: 'CH₃', shiftPpm: 1.2, integration: 3, neighborCount: 2, assignment: 'Ethyl methyl, split by adjacent CH₂' },
    ],
  },
  {
    id: 'bromopropane', name: '1-Bromopropane', formula: 'CH₃CH₂CH₂Br', totalH: 7,
    groups: [
      { label: 'CH₃', shiftPpm: 1.0, integration: 3, neighborCount: 2, assignment: 'Methyl, split by the central CH₂' },
      { label: 'CH₂ (central)', shiftPpm: 1.9, integration: 2, neighborCount: 5, assignment: 'Split by both neighboring CH₃ (3H) and CH₂Br (2H) = 5 neighbors → sextet' },
      { label: 'CH₂Br', shiftPpm: 3.4, integration: 2, neighborCount: 2, assignment: 'Next to Br, split by the central CH₂' },
    ],
  },
  {
    id: 'isopropylBromide', name: 'Isopropyl bromide', formula: '(CH₃)₂CHBr', totalH: 7,
    groups: [
      { label: 'CH₃ ×2', shiftPpm: 1.7, integration: 6, neighborCount: 1, assignment: 'Both methyls equivalent, split by the single CH' },
      { label: 'CH', shiftPpm: 4.2, integration: 1, neighborCount: 6, assignment: 'Split by 6 equivalent methyl H → septet' },
    ],
  },
  {
    id: 'methanol', name: 'Methanol', formula: 'CH₃OH', totalH: 4,
    groups: [
      { label: 'CH₃', shiftPpm: 3.3, integration: 3, neighborCount: 0, assignment: 'Methyl next to O; OH coupling not resolved in practice' },
      { label: 'OH', shiftPpm: 2.5, integration: 1, neighborCount: 0, assignment: 'Hydroxyl — variable shift' },
    ],
  },
  {
    id: 'aceticAcid', name: 'Acetic acid', formula: 'CH₃COOH', totalH: 4,
    groups: [
      { label: 'CH₃', shiftPpm: 2.1, integration: 3, neighborCount: 0, assignment: 'Methyl, no adjacent H' },
      { label: 'COOH', shiftPpm: 11.5, integration: 1, neighborCount: 0, assignment: 'Carboxylic acid proton — very far downfield, variable shift' },
    ],
  },
  {
    id: 'tertButanol', name: 'tert-Butanol', formula: '(CH₃)₃COH', totalH: 10,
    groups: [
      { label: 'CH₃ ×3', shiftPpm: 1.2, integration: 9, neighborCount: 0, assignment: 'All 9 H equivalent, no adjacent H on the quaternary carbon' },
      { label: 'OH', shiftPpm: 2.5, integration: 1, neighborCount: 0, assignment: 'Hydroxyl — variable shift' },
    ],
  },
  {
    id: 'butanone', name: '2-Butanone (MEK)', formula: 'CH₃COCH₂CH₃', totalH: 8,
    groups: [
      { label: 'CH₃CO', shiftPpm: 2.1, integration: 3, neighborCount: 0, assignment: 'Acetyl methyl, no adjacent H' },
      { label: 'CH₂', shiftPpm: 2.4, integration: 2, neighborCount: 3, assignment: 'Split by adjacent CH₃' },
      { label: 'CH₃', shiftPpm: 1.0, integration: 3, neighborCount: 2, assignment: 'Ethyl methyl, split by adjacent CH₂' },
    ],
  },
]

export function nmrMoleculeById(id: string): NmrMolecule {
  const found = NMR_MOLECULES.find((m) => m.id === id)
  if (!found) throw new Error(`Unknown molecule id: ${id}`)
  return found
}
