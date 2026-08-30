// Real sample outputs from the Newest Patent Extraction pipeline -- not
// synthetic. Every SMILES here came from an actual run against a real,
// currently un-indexed-by-Google-Patents patent (confirmed via direct
// testing this session), through the real MolScribe+MolNexTR ensemble.
// Static (not live_extraction_requests rows) because these are permanent
// marketing samples, not per-client paid runs -- deliberately kept
// separate from the live queue table per the same decoupling decision
// applied everywhere else in this product.
export type SampleStructure = {
  page: number
  tier: 'confirmed' | 'needs_review' | 'failed'
  reason: string | null
  molscribe_smiles: string | null
  molnextr_smiles: string | null
}

export type SampleResult = {
  slug: string
  patentNumber: string
  title: string
  note: string
  nPagesTotal: number
  nPagesScanned: number
  structures: SampleStructure[]
}

export const SAMPLE_RESULTS: SampleResult[] = [
  {
    slug: 'egfr-her2-inhibitor',
    patentNumber: 'US12698261B2',
    title: 'Dana-Farber — Cyano-pyrimidine inhibitors of EGFR/HER2',
    note: 'Confirmed structure extracted from a real synthetic-procedures scheme.',
    nPagesTotal: 61,
    nPagesScanned: 8,
    structures: [
      {
        page: 29,
        tier: 'confirmed',
        reason: null,
        molscribe_smiles: 'COc1cc(N(C)CCN(C)C)c([N+](=O)[O-])cc1Nc1ncc(Br)c(NC23CC(C2)C3)n1',
        molnextr_smiles: 'COc1cc(N(C)CCN(C)C)c([N+](=O)[O-])cc1Nc1ncc(Br)c(NC23CC(C2)C3)n1',
      },
    ],
  },
  {
    slug: 'shp2-inhibitor',
    patentNumber: 'US12698271B2',
    title: 'Pfizer — Crystalline form of a SHP2 inhibitor',
    note: '5 of 5 structures confirmed — both models agreed on every one.',
    nPagesTotal: 16,
    nPagesScanned: 8,
    structures: [
      { page: 11, tier: 'confirmed', reason: null, molscribe_smiles: 'N[C@@H]1c2ccccc2CC12CCNCC2', molnextr_smiles: 'N[C@@H]1c2ccccc2CC12CCNCC2' },
      { page: 11, tier: 'confirmed', reason: null, molscribe_smiles: 'Brc1cnc(Br)nn1', molnextr_smiles: 'Brc1cnc(Br)nn1' },
      { page: 12, tier: 'confirmed', reason: null, molscribe_smiles: 'N[C@@H]1c2ccccc2CC12CCN(c1ncc(Br)nn1)CC2', molnextr_smiles: 'N[C@@H]1c2ccccc2CC12CCN(c1ncc(Br)nn1)CC2' },
      { page: 12, tier: 'confirmed', reason: null, molscribe_smiles: 'Nc1nccc([S][Na])c1Cl', molnextr_smiles: 'Nc1nccc([S][Na])c1Cl' },
      { page: 12, tier: 'confirmed', reason: null, molscribe_smiles: 'Nc1nccc(Sc2cnc(N3CCC4(CC3)Cc3ccccc3[C@H]4N)nn2)c1Cl', molnextr_smiles: 'Nc1nccc(Sc2cnc(N3CCC4(CC3)Cc3ccccc3[C@H]4N)nn2)c1Cl' },
    ],
  },
  {
    slug: 'glp1r-agonist',
    patentNumber: 'US12698270B2',
    title: 'MindRank AI — Aryl ether-substituted heterocyclic compounds as GLP1R agonists',
    note: 'Real mixed result: some structures confirmed, others honestly flagged as uncertain rather than guessed — this is what a flagged result actually looks like.',
    nPagesTotal: 445,
    nPagesScanned: 12,
    structures: [
      {
        page: 60,
        tier: 'confirmed',
        reason: null,
        molscribe_smiles: 'N#CCC1(Cn2c(CN3CCC(Oc4cccc(COc5ccc(Cl)cc5F)c4)CC3)nc3ccc(/C=C/C(=O)O)cc32)CC1',
        molnextr_smiles: 'N#CCC1(Cn2c(CN3CCC(Oc4cccc(COc5ccc(Cl)cc5F)c4)CC3)nc3ccc(/C=C/C(=O)O)cc32)CC1',
      },
      {
        page: 60,
        tier: 'needs_review',
        reason: 'The two extraction models disagree — MolScribe attached a stray, chemically ungrounded sulfur fragment that MolNexTR did not. Connectivity is likely right, but this did not pass our agreement bar.',
        molscribe_smiles: 'N#CCC1(Cn2c(CN3CCC(Oc4cccc(COc5ccc(Cl)cc5F)c4)CC3)nc3c(F)cc(/C=C/C(=O)O)cc32)CC1.S',
        molnextr_smiles: null,
      },
      {
        page: 60,
        tier: 'failed',
        reason: 'Neither model produced a chemically valid structure for this crop.',
        molscribe_smiles: null,
        molnextr_smiles: null,
      },
    ],
  },
]

export function getSampleBySlug(slug: string): SampleResult | null {
  return SAMPLE_RESULTS.find((s) => s.slug === slug) ?? null
}
