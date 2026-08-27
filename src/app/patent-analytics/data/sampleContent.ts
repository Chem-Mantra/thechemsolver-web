// Real, validated sample content for the two products that can't be
// bulk-automated against new patents (Markush Coverage needs a hand-
// transcribed genus definition per patent; Section 3(d) needs a human-
// confirmed known/new pair -- see SECTION3D_AUTOPAIR_RESULTS.md for why
// that couldn't be auto-derived). These pages show real, already-validated
// work instead of fabricated "sample" output.

export const MARKUSH_SAMPLE = {
  caseTitle: 'Intra Cellular Therapies v. Controller of Patents (Delhi High Court, Aug 2026)',
  description:
    'A real, current example of exactly the question this tool answers: does a specific compound (here, a deuterated variant) fall within the coverage of an existing genus/Markush claim, even where the genus patent never specifically discloses that exact species? The Delhi High Court held that it does — coverage under a Markush claim can defeat novelty of a later species claim.',
  linkHref: '/patent-analytics/news/delhi-hc-markush-genus-claims-can-defeat-novelty-of-a-species-even-without-speci',
  linkText: 'Read the full case analysis →',
  methodNote:
    'Our tool answers this at the structure level directly: given a genus definition (R-group SMILES transcribed from the actual claim) and a target compound, RDKit R-Group Decomposition tests real chemical membership — not a keyword or text match. Bugs found and fixed during development (RDKit atom-map notation, canonicalization on R-group removal) are documented in the tool\'s own test suite.',
}

export const SECTION_3D_SAMPLE = {
  caseTitle: 'Novartis AG v. Union of India (Supreme Court of India, 2013) — imatinib mesylate beta-crystalline form',
  knownSubstance: { name: 'Imatinib (free base)', pubchemCid: 5291 },
  newForm: { name: 'Imatinib mesylate, beta-crystalline form' },
  result: 'NOT PATENTABLE under Section 3(d)',
  reasoning:
    'The claimed form is a salt (mesylate) plus a specific crystalline polymorph of an already-known substance (imatinib free base, verified against real PubChem CID 5291 before scoring). Section 3(d) requires the new form to demonstrate significantly enhanced therapeutic efficacy over the known substance — bioavailability improvements alone, without therapeutic efficacy data, do not meet that bar. This matches the real, decided outcome of the case.',
  methodNote:
    'Our screener classifies the structural relationship (salt / ester / isomer / polymorph-undeterminable) between a known substance and a claimed new form automatically from SMILES, then flags whether efficacy data is present in the application — the same structural test Indian courts apply. It does not itself decide patentability; that judgment stays with counsel.',
}
