import { MassSpecMolecule } from './types'

/** A curated set of classic intro-organic EI-MS fragmentation examples — chosen because their major
 * fragment m/z values and base peaks are extremely well-established, frequently-reproduced teaching
 * examples (alpha-cleavage of alcohols/ketones, tropylium formation, tertiary-cation-driven halide
 * loss), not because they're exhaustive. This is NOT a general structure-to-spectrum engine: it
 * doesn't predict fragmentation from an arbitrary drawn structure, simulate isotope patterns, or model
 * McLafferty rearrangements in detail. */
export const MASS_SPEC_MOLECULES: MassSpecMolecule[] = [
  {
    id: 'ethanol', name: 'Ethanol', formulaLabel: 'C₂H₆O', formula: { C: 2, H: 6, O: 1 },
    molecularIonNote: 'M⁺• is typically weak for small alcohols — they fragment very readily.',
    pathways: [
      { label: 'Loss of CH₃ (α-cleavage)', neutralLoss: { C: 1, H: 3 }, fragmentDescription: 'CH₂=OH⁺ — a resonance-stabilized oxocarbenium ion; the classic base peak for primary alcohols', isBasePeak: true },
    ],
  },
  {
    id: 'propanol', name: '1-Propanol', formulaLabel: 'C₃H₈O', formula: { C: 3, H: 8, O: 1 },
    molecularIonNote: 'M⁺• is typically weak for small alcohols — they fragment very readily.',
    pathways: [
      { label: 'Loss of C₂H₅ (α-cleavage)', neutralLoss: { C: 2, H: 5 }, fragmentDescription: 'CH₂=OH⁺ — same stabilized oxocarbenium as ethanol; primary alcohols funnel to this fragment by losing the LARGER alkyl group', isBasePeak: true },
    ],
  },
  {
    id: 'acetone', name: 'Acetone', formulaLabel: 'C₃H₆O', formula: { C: 3, H: 6, O: 1 },
    molecularIonNote: 'M⁺• is moderately stable but the acylium fragment usually dominates.',
    pathways: [
      { label: 'Loss of CH₃ (α-cleavage)', neutralLoss: { C: 1, H: 3 }, fragmentDescription: 'CH₃-C≡O⁺ (acetyl/acylium cation) — extremely stable, the textbook m/z 43 base peak for methyl ketones', isBasePeak: true },
    ],
  },
  {
    id: 'butanone', name: '2-Butanone (MEK)', formulaLabel: 'C₄H₈O', formula: { C: 4, H: 8, O: 1 },
    molecularIonNote: 'M⁺• is moderately stable; cleavage occurs on both sides of the carbonyl.',
    pathways: [
      { label: 'Loss of CH₃ (α-cleavage)', neutralLoss: { C: 1, H: 3 }, fragmentDescription: 'CH₃CH₂-C≡O⁺ (propanoyl cation)', isBasePeak: false },
      { label: 'Loss of C₂H₅ (α-cleavage)', neutralLoss: { C: 2, H: 5 }, fragmentDescription: 'CH₃-C≡O⁺ (acetyl cation) — losing the LARGER alkyl group is favored, making this the base peak', isBasePeak: true },
    ],
  },
  {
    id: 'tertButylChloride', name: 'tert-Butyl chloride', formulaLabel: 'C₄H₉Cl', formula: { C: 4, H: 9, Cl: 1 },
    molecularIonNote: 'M⁺• is typically very weak — tertiary alkyl halides lose Cl readily.',
    pathways: [
      { label: 'Loss of Cl', neutralLoss: { Cl: 1 }, fragmentDescription: '(CH₃)₃C⁺ — the tertiary carbocation, exceptionally stable, the classic base peak for tertiary alkyl halides', isBasePeak: true },
    ],
  },
  {
    id: 'toluene', name: 'Toluene', formulaLabel: 'C₇H₈', formula: { C: 7, H: 8 },
    molecularIonNote: 'M⁺• is prominent — aromatic ring conjugation stabilizes the radical cation.',
    pathways: [
      { label: 'Loss of H', neutralLoss: { H: 1 }, fragmentDescription: 'C₇H₇⁺ (tropylium cation) — a rearranged, exceptionally stable aromatic cation at m/z 91, the classic base peak for toluene and many benzyl compounds', isBasePeak: true },
    ],
  },
  {
    id: 'methylAcetate', name: 'Methyl acetate', formulaLabel: 'C₃H₆O₂', formula: { C: 3, H: 6, O: 2 },
    molecularIonNote: 'M⁺• is usually weak for esters.',
    pathways: [
      { label: 'Loss of OCH₃ (α-cleavage)', neutralLoss: { O: 1, C: 1, H: 3 }, fragmentDescription: 'CH₃-C≡O⁺ (acetyl/acylium cation) — esters cleave at the carbonyl, losing the alkoxy group', isBasePeak: true },
    ],
  },
  {
    id: 'aceticAcid', name: 'Acetic acid', formulaLabel: 'C₂H₄O₂', formula: { C: 2, H: 4, O: 2 },
    molecularIonNote: 'M⁺• is usually weak for carboxylic acids.',
    pathways: [
      { label: 'Loss of OH (α-cleavage)', neutralLoss: { O: 1, H: 1 }, fragmentDescription: 'CH₃-C≡O⁺ (acetyl/acylium cation)', isBasePeak: true },
    ],
  },
  {
    id: 'bromoethane', name: 'Bromoethane', formulaLabel: 'C₂H₅Br', formula: { C: 2, H: 5, Br: 1 },
    molecularIonNote: 'M⁺• shows a characteristic isotope DOUBLET (M and M+2 of roughly equal height) from ⁷⁹Br/⁸¹Br — a standard way to recognize a bromine-containing molecule (chlorine instead gives a ~3:1 M:M+2 ratio).',
    pathways: [
      { label: 'Loss of Br', neutralLoss: { Br: 1 }, fragmentDescription: 'CH₃CH₂⁺ (ethyl cation)', isBasePeak: true },
    ],
  },
  {
    id: 'diethylEther', name: 'Diethyl ether', formulaLabel: 'C₄H₁₀O', formula: { C: 4, H: 10, O: 1 },
    molecularIonNote: 'M⁺• is typically weak for ethers.',
    pathways: [
      { label: 'Loss of CH₃ (α-cleavage)', neutralLoss: { C: 1, H: 3 }, fragmentDescription: 'A resonance-stabilized oxocarbenium ion from cleavage next to the ether oxygen', isBasePeak: true },
    ],
  },
]

export function massSpecMoleculeById(id: string): MassSpecMolecule {
  const found = MASS_SPEC_MOLECULES.find((m) => m.id === id)
  if (!found) throw new Error(`Unknown molecule id: ${id}`)
  return found
}
