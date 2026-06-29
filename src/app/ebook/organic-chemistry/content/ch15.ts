import type { OrgoChapter } from '../types'

export const CH15: OrgoChapter = {
  id: 'ch15',
  number: 15,
  title: 'Spectroscopy & Structure Determination',
  orgo: 2,
  accentHex: '#a855f7',
  concepts: [

    // ── Concept 1: IR Spectroscopy ────────────────────────────────────────────
    {
      id: 'ch15-c1-ir',
      title: 'Infrared Spectroscopy',
      subtitle: 'Functional group identification from bond vibrations',
      estimatedMinutes: 11,
      accentHex: '#a855f7',
      blocks: [
        {
          type: 'text',
          body: 'Infrared (IR) spectroscopy measures the absorption of IR light by molecular bonds. When IR radiation matches the natural vibration frequency of a bond, the molecule absorbs energy and the bond vibrates more intensely. The position of absorption (wavenumber, cm⁻¹) identifies the type of bond; the intensity and shape provide additional structural information. IR is most useful for identifying functional groups quickly.',
        },
        {
          type: 'table',
          headers: ['Functional group', 'Wavenumber (cm⁻¹)', 'Shape/Notes'],
          rows: [
            ['O–H (alcohol)', '3200–3550', 'Broad, strong absorption (H-bonding broadens)'],
            ['N–H (amine, 1°)', '3300–3500', 'Two peaks (symmetric and asymmetric N–H stretch)'],
            ['N–H (amine, 2°)', '3300–3500', 'One peak (one N–H)'],
            ['O–H (carboxylic acid)', '2500–3300', 'Very broad, overlapping with C–H region (H-bonded dimer)'],
            ['C–H (sp³, alkane)', '2850–3000', 'Multiple moderate peaks; unremarkable'],
            ['C–H (sp², alkene/aromatic)', '3000–3100', 'Just above 3000 cm⁻¹'],
            ['C–H (sp, alkyne)', '~3300', 'Sharp, strong (terminal alkyne only)'],
            ['C≡N (nitrile)', '2200–2260', 'Sharp, strong'],
            ['C≡C (alkyne)', '2100–2260', 'Sharp, moderate (absent if internal symmetric)'],
            ['C=O (aldehyde)', '1720–1740', 'Strong, sharp; two C–H at 2700–2850 (aldehyde C–H)'],
            ['C=O (ketone)', '1705–1725', 'Strong, sharp'],
            ['C=O (ester)', '1735–1750', 'Strong, higher than ketone'],
            ['C=O (carboxylic acid)', '1700–1725', 'Strong; broad O–H also present'],
            ['C=O (amide)', '1630–1690', 'Lowest of all C=O (resonance with N lone pair)'],
            ['C=C (alkene)', '1620–1680', 'Moderate; symmetrical C=C may be weak/absent'],
            ['C–O (alcohol, ether, ester)', '1000–1300', 'Strong C–O single bond stretch'],
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'IR Quick Identification Strategy',
          body: 'Step 1: Look at the 3000–3500 cm⁻¹ region:\n• Broad, strong >3200: O–H (alcohol or acid)\n• Very broad 2500–3300: carboxylic acid O–H\n• Sharp ~3300: terminal alkyne C–H or N–H\n\nStep 2: Look at the 1700 cm⁻¹ region (carbonyl C=O):\n• Peak present → has C=O. Exact position: ester (1735–1750) > aldehyde (1720–1740) > ketone (1705–1725) ≈ acid (1700–1725) > amide (1630–1690)\n• No peak → no C=O (amine, alcohol, ether, alkene, alkyne, alkane)\n\nStep 3: Look at 2100–2270 cm⁻¹ for C≡C or C≡N\n\nFingerprint region (<1500 cm⁻¹): complex pattern — used for comparison, not individual bond ID.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Why C=O Frequency Varies Across Functional Groups',
          body: 'The C=O stretching frequency depends on the electron density in the C=O bond:\n\n• Electron donation into C=O (lone pair resonance) WEAKENS the bond → lower force constant → lower frequency (fewer cm⁻¹)\n• Electron withdrawal from C=O STRENGTHENS the bond → higher frequency\n\nAmide: N lone pair strongly donates into C=O (resonance: N–C=O ↔ N⁺=C–O⁻) → C=O weakened → 1630–1690 cm⁻¹ (lowest)\nEster: O lone pair donates (weaker than N) → 1735–1750 cm⁻¹\nKetone: alkyl groups (mild electron donation) → 1705–1725 cm⁻¹\nAldeyhde: one alkyl, one H → 1720–1740 cm⁻¹\nAcyl chloride: Cl partial EWG → ~1800 cm⁻¹ (highest)',
        },
      ],
      mcqs: [
        {
          question: 'An IR spectrum shows: strong broad absorption at 2500–3300 cm⁻¹ AND a strong C=O peak at ~1710 cm⁻¹. What functional group is present?',
          options: [
            'Alcohol (O–H at 3200–3550 and no C=O)',
            'Carboxylic acid — the very broad O–H (2500–3300, H-bonded dimer) and C=O at ~1710 cm⁻¹ are characteristic of RCOOH',
            'Aldehyde — the C=O appears at 1710 cm⁻¹',
            'Ester — the broad O–H must be from residual water',
          ],
          correct: 1,
          explanation: 'Carboxylic acids form hydrogen-bonded dimers in solution and the solid state. The O–H stretch in carboxylic acids appears as an extremely broad, strong absorption from 2500–3300 cm⁻¹ — much lower and broader than an alcohol OH (3200–3550). This broad feature often overlaps the C–H stretching region. Combined with a strong C=O peak at ~1710 cm⁻¹ (slightly lower than ester, similar to ketone but the broad OH distinguishes it), these together are diagnostic for carboxylic acid.',
        },
        {
          question: 'Why does an amide C=O appear at a lower frequency (~1650 cm⁻¹) than an ester C=O (~1735 cm⁻¹)?',
          options: [
            'Amides have stronger C=O bonds due to resonance',
            'The nitrogen lone pair donates into the C=O by resonance, partially weakening the C=O bond (C–N becomes partial double bond, C=O becomes partial single bond) → lower force constant → lower stretching frequency',
            'Amides are more polar, lowering the frequency of all vibrations',
            'The N–H bond interferes with C=O vibration in amides',
          ],
          correct: 1,
          explanation: 'Amide resonance: –N–C=O ↔ ⁺N=C–O⁻. The nitrogen lone pair is strongly conjugated with the carbonyl. This resonance makes the C=O bond have less double-bond character (partial single bond) — the force constant decreases. A weaker C=O bond vibrates at lower frequency. Ester resonance (O–C=O ↔ O=C–O⁻) also occurs but is weaker (O lone pair is less available than N due to higher electronegativity). Net: amide C=O ~1650 < acid/ketone ~1710 < ester ~1735 < acyl chloride ~1800 cm⁻¹.',
        },
        {
          question: 'A compound shows no O–H or N–H absorptions in IR, no C=O peak, and a C≡C stretch at ~2150 cm⁻¹. The molecular formula is C₆H₁₀. What is the compound?',
          options: [
            'Benzene (C₆H₆)',
            'An internal alkyne (e.g., hex-3-yne: CH₃CH₂C≡CCH₂CH₃)',
            'A cyclic alkene',
            'A diene',
          ],
          correct: 1,
          explanation: 'C₆H₁₀: DoU = (12+2−10)/2 = 2. Two degrees of unsaturation consistent with one triple bond (2 DoU). The C≡C stretch at 2150 cm⁻¹ confirms alkyne. No terminal alkyne C–H peak (~3300 cm⁻¹) → internal alkyne. Hex-3-yne (CH₃CH₂C≡CCH₂CH₃) is an internal alkyne with formula C₆H₁₀ — it matches perfectly. Benzene has DoU = 4 and aromatic C–H stretches. A cyclic alkene or diene would have C=C (not C≡C) at 1620–1680 cm⁻¹ and DoU of 2 from ring+alkene, but no C≡C.',
        },
      ],
      flashcards: [
        {
          front: 'Key IR absorption regions (memorize these first)',
          back: 'O–H (alcohol): 3200–3550 broad\nO–H (acid): 2500–3300 very broad\nN–H: 3300–3500 (1 or 2 peaks)\nSp C–H (alkyne): ~3300 sharp\nSp³ C–H: 2850–3000\nC≡N/C≡C: 2100–2260\nC=O: 1630–1820 (varies by group)\nC=C: 1620–1680\nC–O: 1000–1300',
        },
        {
          front: 'C=O frequency order (high → low cm⁻¹)',
          back: 'Highest: Acyl chloride (~1800)\nEster (~1735–1750)\nAldehyde (~1720–1740)\nKetone (~1705–1725)\nCarboxylic acid (~1700–1725)\nLowest: Amide (~1630–1690)\n\nRule: more electron donation into C=O → weaker C=O → lower frequency',
        },
        {
          front: 'How to distinguish alcohol O–H from carboxylic acid O–H by IR',
          back: 'Alcohol O–H: 3200–3550 cm⁻¹ broad, fairly strong. No C=O peak (unless also has carbonyl elsewhere).\n\nCarboxylic acid O–H: 2500–3300 cm⁻¹, VERY broad (often overlaps C–H region entirely). ALWAYS has a C=O peak at ~1700–1725 cm⁻¹ simultaneously.\n\nKey: how broad and how low? Acid O–H is broader and lower. Acid always has both O–H AND C=O together.',
        },
      ],
    },

    // ── Concept 2: ¹H NMR Spectroscopy ───────────────────────────────────────
    {
      id: 'ch15-c2-hnmr',
      title: '¹H NMR Spectroscopy',
      subtitle: 'Chemical shift, integration, multiplicity, and coupling constants',
      estimatedMinutes: 15,
      accentHex: '#a855f7',
      blocks: [
        {
          type: 'text',
          body: '¹H NMR (proton NMR) is the most information-rich single technique in structural organic chemistry. It reveals how many types of hydrogen are present, their chemical environment, how many are present, and which hydrogens are adjacent to each other. Modern compound identification almost always begins with ¹H NMR.',
        },
        {
          type: 'table',
          headers: ['Hydrogen type', 'Chemical shift (δ, ppm)', 'Notes'],
          rows: [
            ['TMS (reference)', '0.0', 'Internal standard; all shifts measured relative to this'],
            ['Alkane C–H (sp³)', '0.5–1.8', 'Most shielded; upfield'],
            ['Allylic C–H (adjacent to C=C)', '1.6–2.6', 'Slightly deshielded'],
            ['Alkynyl C–H (≡C–H)', '1.8–3.1', 'Shielded by ring current of triple bond'],
            ['Propargylic / benzylic C–H', '2.3–3.0', 'Adjacent to aromatic or triple bond'],
            ['C–H adjacent to halogen', '3.0–4.0', 'Halogen deshields'],
            ['C–H adjacent to O (ethers, esters)', '3.3–4.5', 'Oxygen strong deshielder'],
            ['Vinyl C–H (=CH–)', '4.5–6.5', 'sp² C–H; anisotropy of C=C deshields equatorial'],
            ['Aromatic C–H', '6.5–8.5', 'Strong deshielding by ring current'],
            ['Aldehyde C–H (–CHO)', '9.5–10.0', 'Very deshielded: adjacent to C=O AND sp²'],
            ['Carboxylic acid O–H', '10–12', 'Highly deshielded; broad; variable'],
            ['Phenol O–H, alcohol O–H', '0.5–5 (variable)', 'Broad; often exchangeable (D₂O shake)'],
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'The N+1 Rule for Spin-Spin Splitting',
          body: 'The multiplicity (number of peaks in a signal) tells you how many equivalent neighboring H atoms there are:\n\nN+1 rule: a proton with N equivalent neighboring protons (within 3 bonds, vicinal) appears as a multiplet with N+1 peaks.\n\n• N=0 → singlet (s): 1 peak — no neighboring H\n• N=1 → doublet (d): 2 peaks — 1 neighbor\n• N=2 → triplet (t): 3 peaks — 2 neighbors\n• N=3 → quartet (q): 4 peaks — 3 neighbors\n• N=4 → quintet: 5 peaks\n• N=5 → sextet: 6 peaks\n\nPattern follows Pascal\'s triangle. The pattern depends on coupling constant J (Hz) — equivalent protons don\'t split each other.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Integration and Equivalence',
          body: 'NMR integration gives the RATIO of different types of protons, not the absolute number. From the molecular formula and the ratio, you can determine the actual count.\n\nEquivalent protons: protons that can be interconverted by a symmetry operation (rotation axis, mirror plane) are equivalent — they give one NMR signal. Example: the 6 H\'s of benzene are all equivalent (one signal at ~7.2 ppm).\n\nHomotopic protons: identical in all environments — equivalent by rotation.\nEnantiotopic protons: equivalent in achiral environments (NMR); diastereotopic protons in chiral environments appear at different shifts.\n\nD₂O exchange: add D₂O to NMR tube. Exchangeable protons (O–H, N–H) disappear from the spectrum (replaced by D). Useful for identifying OH and NH signals.',
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'The Chemical Shift "Address System"',
          body: 'Think of chemical shift as an address that tells you the neighborhood a proton lives in. Upfield (low δ, 0–2 ppm) = quiet residential area (shielded, lots of electron density). Downfield (high δ, 6–12 ppm) = downtown financial district (deshielded, electron-poor — next to electronegativity, pi systems with anisotropy). As you move from alkane → allylic → benzylic → adjacent to O/N → vinyl/aryl → aldehyde, the address moves progressively downtown (downfield). Knowing the neighborhood instantly tells you the functional group environment.',
        },
      ],
      mcqs: [
        {
          question: 'Ethyl acetate (CH₃COOCH₂CH₃) has three different types of protons. In the ¹H NMR, the O–CH₂ protons appear as:',
          options: [
            'Singlet at ~2.0 ppm',
            'Triplet at ~4.1 ppm (split by adjacent CH₃) with integration ratio 2:3 vs OCH₂:CH₃',
            'Quartet at ~4.1 ppm split by the adjacent CH₃ (3 equivalent neighbors → 4 lines); integration 2H',
            'Doublet at ~1.3 ppm',
          ],
          correct: 2,
          explanation: 'In ethyl acetate (CH₃CO–O–CH₂CH₃): the O–CH₂ protons are adjacent to the CH₃ group. By the N+1 rule: 3 equivalent neighboring H (from CH₃) → N=3 → quartet (4 peaks). Chemical shift: O–CH₂ (~4.1 ppm, deshielded by adjacent ester oxygen). Integration: 2H. The ester CH₃ adjacent to O appears as a triplet (~1.3 ppm, split by 2 H from CH₂ → N=2 → triplet). The acetyl CH₃ (CH₃CO–) at ~2.0 ppm appears as a singlet (no adjacent H). Total: 1 singlet (3H) + 1 quartet (2H) + 1 triplet (3H).',
        },
        {
          question: 'A compound with formula C₄H₈O shows a single ¹H NMR peak at ~9.7 ppm as a triplet, and another set of peaks for CH₂ and CH₃ groups. What is the compound?',
          options: [
            'Butanone (methyl ethyl ketone) — no aldehyde H',
            'Butanal (CH₃CH₂CH₂CHO) — aldehyde H at 9.7 ppm as triplet (split by adjacent CH₂)',
            'Tetrahydrofuran (THF)',
            '2-Methylpropanal (isobutyraldehyde, (CH₃)₂CHCHO — aldehyde H at 9.7 as doublet)',
          ],
          correct: 1,
          explanation: 'Aldehyde C–H appears at 9.5–10.0 ppm — highly diagnostic. A triplet means the aldehyde H has 2 equivalent neighbors (N=2). In butanal (CH₃CH₂CH₂CHO), the CHO hydrogen is adjacent to the CH₂ group next to it — 2 equivalent H → triplet. Formula C₄H₈O: DoU = (8+2−8)/2 = 1 → one C=O. The aldehyde peak at 9.7 ppm as a triplet points to butanal. For 2-methylpropanal ((CH₃)₂CHCHO), the CHO would be a doublet (split by 1 adjacent H on the CH).',
        },
        {
          question: 'How many ¹H NMR signals would para-xylene (1,4-dimethylbenzene) show and what would they be?',
          options: [
            'Five signals — one for each carbon type',
            'Two signals: one for the aromatic H (s, 4H, ~7.1 ppm) and one for the methyl H (s, 6H, ~2.3 ppm)',
            'Three signals: ortho, meta, and para aromatic H\'s',
            'One signal — all protons are equivalent in benzene rings',
          ],
          correct: 1,
          explanation: 'Para-xylene has a plane of symmetry: the four aromatic H atoms (at C2, C3, C5, C6) are all equivalent by the ring symmetry (two-fold rotation and mirror planes). They appear as one singlet. The two methyl groups at C1 and C4 are also equivalent → one singlet at ~2.3 ppm. Total: 2 signals. Signal 1: aromatic H, singlet, 4H, ~7.1 ppm. Signal 2: CH₃, singlet, 6H, ~2.3 ppm. The 4:6 integration ratio (simplifies to 2:3) confirms the structure.',
        },
      ],
      flashcards: [
        {
          front: '¹H NMR: the four pieces of information',
          back: '1. NUMBER OF SIGNALS = number of chemically distinct H environments\n2. CHEMICAL SHIFT (δ, ppm) = electronic environment (functional group)\n3. INTEGRATION = relative number of H atoms in each signal\n4. MULTIPLICITY = number of equivalent H atoms on adjacent (vicinal) carbon: N+1 rule → N neighbors → N+1 peaks\n\n(Coupling constant J also gives structural info — large J = trans vinyl; small J = cis; ~7 Hz = typical vicinal sp³)',
        },
        {
          front: 'Chemical shift landmarks (memorize these δ values)',
          back: '~0.9 ppm: CH₃ of alkane\n~1.2 ppm: CH₂ of alkane\n~2.0 ppm: CH₃CO– (adjacent to C=O)\n~2.3 ppm: ArCH₃ (benzylic)\n~3.4 ppm: CH₃O– (ether methyl)\n~4.1 ppm: –OCH₂– (ester)\n~5.2 ppm: vinyl =CH₂\n~7.3 ppm: benzene ring H\n~9.7 ppm: aldehyde CHO',
        },
        {
          front: 'N+1 rule: how to predict multiplicity',
          back: 'A proton with N equivalent VICINAL (3-bond, adjacent carbon) neighbors appears as N+1 peaks.\n\nSinglet (s, 1 peak): N=0 neighbors\nDoublet (d, 2 peaks): N=1 neighbor\nTriplet (t, 3 peaks): N=2 neighbors\nQuartet (q, 4 peaks): N=3 neighbors\n\nPeak heights follow Pascal\'s triangle: d = 1:1; t = 1:2:1; q = 1:3:3:1; quintet = 1:4:6:4:1\n\nNote: equivalent protons on the SAME carbon do NOT split each other.',
        },
        {
          front: 'D₂O exchange: what does it tell you?',
          back: 'Adding D₂O to an NMR sample exchanges labile protons (O–H, N–H) for D. These protons disappear from the ¹H NMR spectrum.\n\nIf a signal disappears after D₂O: O–H or N–H (exchangeable proton)\nIf a signal remains after D₂O: C–H (not exchangeable)\n\nUseful to: confirm presence of OH or NH; distinguish from non-exchangeable C–H at similar δ; identify carboxylic acid broad peaks.',
        },
      ],
    },

    // ── Concept 3: Mass Spectrometry ──────────────────────────────────────────
    {
      id: 'ch15-c3-ms',
      title: 'Mass Spectrometry',
      subtitle: 'Molecular ion, fragmentation patterns, and structural clues',
      estimatedMinutes: 10,
      accentHex: '#a855f7',
      blocks: [
        {
          type: 'text',
          body: 'Mass spectrometry (MS) measures the mass-to-charge ratio (m/z) of molecular fragments. Unlike NMR or IR, MS can determine the exact molecular weight (and even molecular formula from high-resolution MS). Molecules are ionized, then fragmentation occurs along characteristic bonds — the pattern of fragments reveals the carbon skeleton and functional groups.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Reading a Mass Spectrum: Key Features',
          body: '1. Molecular ion peak (M⁺): highest m/z peak from the intact molecule. M⁺ = molecular weight (for singly charged ions). An even M⁺ suggests no nitrogen (even-electron). Odd M⁺ suggests an odd number of nitrogen atoms (nitrogen rule).\n\n2. M+2 peak: isotope peak. Chlorine has two isotopes ³⁵Cl and ³⁷Cl in ~3:1 ratio → M and M+2 peaks in ~3:1 ratio confirms Cl. Bromine: ⁷⁹Br and ⁸¹Br in ~1:1 ratio → M and M+2 in ~1:1 ratio confirms Br.\n\n3. Base peak: most intense fragment (100% relative abundance). Not necessarily M⁺.\n\n4. Common losses: loss of 15 = –CH₃; loss of 17 = –OH; loss of 28 = CO or –CH₂CH₂; loss of 29 = –CHO; loss of 31 = –OCH₃; loss of 45 = –OC₂H₅ or –CHO (wait, 45 = OEt).\n\n5. McLafferty rearrangement: γ-hydrogen migrates to C=O → even-electron cleavage with loss of a neutral alkene.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Nitrogen Rule: Odd or Even M⁺?',
          body: 'A useful rule for reading mass spectra:\n• Even M⁺ (e.g., 44, 88, 136): compound contains no nitrogen, or an EVEN number of nitrogen atoms\n• Odd M⁺ (e.g., 43, 101, 87): compound contains an ODD number of nitrogen atoms (1, 3, 5...)\n\nWhy? Carbon, oxygen, hydrogen, and halogens give even-mass molecules. Nitrogen is exceptional: ¹⁴N has an even mass but uses three bonds (one more than expected from its valence). Each odd-bonded nitrogen shifts M⁺ by 14 (or contributes to making it odd).\n\nExamples: CH₄ (M⁺=16, even, no N). C₂H₅N (M⁺=45, odd, one N). C₄H₁₁N (trimethylamine analog, M⁺=73, odd).',
        },
      ],
      mcqs: [
        {
          question: 'A mass spectrum shows M⁺ = 78, base peak = 78, with no significant M+2 peak. The compound gives an aromatic C–H IR absorption and a single ¹H NMR peak. What is the compound?',
          options: [
            'Cyclohexene (MW = 82)',
            'Benzene (MW = 78, 6 equivalent H = 1 NMR peak at ~7.3 ppm, aromatic IR)',
            'Pyridine (MW = 79, odd = suggests N)',
            'Cyclohexane (MW = 84)',
          ],
          correct: 1,
          explanation: 'Benzene (C₆H₆): MW = 6(12) + 6(1) = 78. Even M⁺ (no nitrogen). No M+2 at M+2/3 ratio (no Cl or Br). Aromatic C–H stretch in IR (~3030 cm⁻¹). One ¹H NMR signal (all 6 H equivalent, singlet at 7.27 ppm). M⁺ = base peak (benzene is very stable, molecular ion doesn\'t fragment easily). All data consistent with benzene.',
        },
        {
          question: 'A compound\'s mass spectrum shows M⁺ = 136 and M+2 = 138 in approximately 1:1 ratio. This pattern strongly suggests:',
          options: [
            'The compound contains one chlorine atom (³⁵Cl/³⁷Cl ≈ 3:1 ratio)',
            'The compound contains one bromine atom (⁷⁹Br/⁸¹Br ≈ 1:1 ratio)',
            'The compound contains two oxygen atoms',
            'The compound is a racemate with both enantiomers at different masses',
          ],
          correct: 1,
          explanation: 'Bromine has two major isotopes: ⁷⁹Br (78.9 amu, 50.7%) and ⁸¹Br (80.9 amu, 49.3%) — approximately 1:1. If a compound contains one Br, the M⁺ (containing ⁷⁹Br) and M+2 (containing ⁸¹Br) peaks appear in roughly 1:1 ratio. M⁺ = 136 → the carbon framework mass = 136−79 = 57 (C₄H₉ = butyl). Chlorine: ³⁵Cl (75.8%) and ³⁷Cl (24.2%) → M : M+2 ≈ 3:1 (not 1:1). The 1:1 M : M+2 ratio uniquely identifies bromine.',
        },
      ],
      flashcards: [
        {
          front: 'Mass spectrometry key features',
          back: 'M⁺ = molecular ion (intact molecule cation) = molecular weight\nBase peak = most intense fragment (100%)\nM+1 and M+2 = isotope peaks\n\nIsotope patterns:\n• Cl: M : M+2 = 3:1 (³⁵Cl:³⁷Cl)\n• Br: M : M+2 = 1:1 (⁷⁹Br:⁸¹Br)\n• Two Cl: M : M+2 : M+4 = 9:6:1\n\nNitrogen rule: even M⁺ → 0 or even number of N; odd M⁺ → odd number of N',
        },
        {
          front: 'Common MS fragmentation losses',
          back: 'Loss of 15 → –CH₃ (methyl)\nLoss of 17 → –OH\nLoss of 18 → –H₂O (alcohol or acid dehydration)\nLoss of 28 → –CO (ketone or aldehyde) or –CH₂=CH₂\nLoss of 29 → –CHO (aldehyde) or –C₂H₅\nLoss of 31 → –OCH₃\nLoss of 45 → –OEt or –CHO+O\nLoss of 77 → phenyl group (C₆H₅, MW 77)',
        },
      ],
    },
  ],
}
