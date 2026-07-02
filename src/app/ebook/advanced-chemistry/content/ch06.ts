import type { AdvChapter } from '../types'

export const CH06: AdvChapter = {
  id: 'ch06',
  number: 6,
  title: 'Spectroscopy as an Analytical Technique',
  examRelevance: 'Low raw frequency but backs 4 existing labs (NMR, mass spec, PES, Beer-Lambert) with no textual content until now',
  accentHex: '#f59e0b',
  concepts: [

    // ── Concept 1: ¹H NMR — Chemical Shift, Splitting & Integration ─────────────
    {
      id: 'ch06-c1-nmr',
      title: '¹H NMR: Chemical Shift, Splitting & Integration',
      subtitle: 'Reading a proton spectrum like a structural fingerprint',
      estimatedMinutes: 14,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'Every ¹H NMR signal carries three independent pieces of structural information: where it appears (chemical shift — what kind of proton), how it\'s split (spin-spin coupling — what\'s attached nearby), and how big it is (integration — how many protons it represents). Reading all three together is what turns a spectrum into a structure.',
        },
        {
          type: 'table',
          headers: ['Proton environment', 'Typical δ (ppm)'],
          rows: [
            ['Alkyl C–H (CH₃, CH₂, CH)', '0.9 – 1.7'],
            ['Allylic / benzylic C–H', '1.7 – 2.5'],
            ['C–H adjacent to C=O (α to carbonyl)', '2.0 – 2.5'],
            ['C–H adjacent to halogen or O (C–X, C–O)', '3.3 – 4.5'],
            ['Vinyl C=C–H', '4.5 – 6.5'],
            ['Aromatic ring H', '6.5 – 8.5'],
            ['Aldehyde H (–CHO)', '9.5 – 10.5'],
            ['Carboxylic acid O–H', '10 – 13 (broad, variable)'],
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'The n+1 Rule',
          body: 'A proton with n chemically equivalent neighboring protons (on adjacent carbons) is split into n+1 peaks, following roughly a Pascal\'s-triangle intensity ratio (1:1 for a doublet, 1:2:1 for a triplet, 1:3:3:1 for a quartet). Protons on the same carbon as each other, and protons more than 3 bonds away, typically don\'t couple visibly. O–H and N–H protons often appear as broad singlets since rapid exchange averages out their coupling.',
        },
        {
          type: 'text',
          body: 'Integration (the relative area under each signal) gives the ratio of protons in each environment, not an absolute count — a 3:2:1 integration ratio could mean 3, 2, 1 protons or 6, 4, 2, and the molecular formula (often from mass spectrometry) is needed to fix the actual numbers. Coupling constants (J, in Hz) measure how strongly two protons interact; protons with matching J values are coupled to each other, which is often the deciding clue for connectivity in a more complex molecule.',
        },
      ],
      mcqs: [
        {
          question: 'A proton signal appears as a quartet. How many equivalent protons are on the adjacent carbon(s)?',
          options: ['2', '3', '4', '5'],
          correct: 1,
          explanation: 'By the n+1 rule, a quartet (4 peaks) means n+1 = 4, so n = 3 equivalent neighboring protons — the classic pattern for a CH₂ adjacent to a CH₃ group (or vice versa).',
        },
      ],
      flashcards: [
        { front: 'n+1 rule', back: 'A proton with n equivalent neighboring protons splits into n+1 peaks.' },
        { front: 'What does integration measure?', back: 'The relative ratio of protons between signals — not an absolute count.' },
        { front: 'Typical δ for aromatic ring protons', back: '6.5–8.5 ppm.' },
      ],
    },

    // ── Concept 2: IR Spectroscopy — Characteristic Group Absorptions ───────────
    {
      id: 'ch06-c2-ir-spectroscopy',
      title: 'IR Spectroscopy: Characteristic Group Absorptions',
      subtitle: 'Identifying functional groups from where a molecule absorbs infrared light',
      estimatedMinutes: 11,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'Infrared spectroscopy detects bond vibrations (stretching and bending), and different functional groups absorb at characteristic, largely predictable frequencies regardless of the rest of the molecule — making IR the fastest way to screen for the presence or absence of a specific functional group before committing to full structure elucidation.',
        },
        {
          type: 'table',
          headers: ['Bond / group', 'Absorption range (cm⁻¹)', 'Appearance'],
          rows: [
            ['O–H (alcohol)', '3200 – 3550', 'Broad'],
            ['O–H (carboxylic acid)', '2500 – 3300', 'Very broad'],
            ['N–H', '3300 – 3500', 'Medium, sharper than O–H'],
            ['C–H (sp³)', '2850 – 2960', 'Medium'],
            ['C≡C / C≡N', '2100 – 2260', 'Sharp, medium intensity'],
            ['C=O (carbonyl)', '1650 – 1780', 'Strong, sharp — the most diagnostic band in IR'],
            ['C=C (alkene)', '1620 – 1680', 'Weak to medium'],
            ['Aromatic C=C', '1450 – 1600', 'Medium, often multiple bands'],
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'The Carbonyl Stretch Is the Single Most Useful IR Band',
          body: 'A strong, sharp absorption around 1650–1780 cm⁻¹ almost always signals C=O, and its exact position narrows down which carbonyl: esters and acid chlorides tend toward the higher end (~1735–1815), ketones and aldehydes sit near 1705–1725, and amides typically drop lowest (~1630–1700) because delocalization into the nitrogen weakens the C=O bond itself.',
        },
        {
          type: 'text',
          body: 'The broad O–H stretch of an alcohol (hydrogen-bonded, 3200–3550 cm⁻¹) looks completely different from the very broad, often "smeared" O–H of a carboxylic acid (2500–3300 cm⁻¹, frequently overlapping the C–H region) — this single distinction is often enough to identify a carboxylic acid without any other data, especially when a carbonyl band is present alongside it.',
        },
      ],
      mcqs: [
        {
          question: 'An unknown compound shows a strong sharp absorption at 1715 cm⁻¹ and no absorption in the O–H or N–H region. What functional group is most consistent with this data?',
          options: ['Alcohol', 'Ketone or aldehyde', 'Carboxylic acid', 'Amine'],
          correct: 1,
          explanation: 'A strong carbonyl absorption near 1705-1725 cm⁻¹ with no O–H or N–H present rules out carboxylic acids, alcohols, and amines/amides — leaving a ketone or aldehyde as the best fit (further data, like an aldehyde C-H stretch near 2720-2850 cm⁻¹, would distinguish between the two).',
        },
      ],
      flashcards: [
        { front: 'Most diagnostic IR band', back: 'The C=O (carbonyl) stretch, 1650-1780 cm⁻¹ — strong and sharp.' },
        { front: 'Alcohol O-H vs. carboxylic acid O-H in IR', back: 'Alcohol: broad, 3200-3550 cm⁻¹. Carboxylic acid: very broad, 2500-3300 cm⁻¹, often overlapping C-H signals.' },
      ],
    },

    // ── Concept 3: Mass Spectrometry — Fragmentation & Isotope Patterns ─────────
    {
      id: 'ch06-c3-mass-spectrometry',
      title: 'Mass Spectrometry: Fragmentation & Isotope Patterns',
      subtitle: 'Reading a fragmentation pattern to reconstruct a molecule',
      estimatedMinutes: 12,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'In electron-impact (EI) mass spectrometry, a molecule is ionized by knocking out an electron, forming a radical cation called the molecular ion (M⁺•) whose mass equals the molecule\'s full molecular weight. This ion is often unstable and fragments into smaller pieces, and the pattern of fragment masses is what actually reveals structural detail — sometimes more reliably than the molecular ion itself, which can be too unstable to observe at all in some compounds.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Common Neutral Losses from the Molecular Ion',
          body: 'Certain small, stable neutral fragments are lost so commonly that their mass difference from M⁺• becomes a diagnostic clue: loss of 15 (•CH₃), 18 (H₂O), 17 (•OH or NH₃), 28 (CO or C₂H₄), 29 (•CHO or •C₂H₅), 43 (•C₃H₇ or CH₃CO•), and 45 (•COOH) are among the most frequently tested.',
        },
        {
          type: 'text',
          body: 'The McLafferty rearrangement is a specific, exam-favorite fragmentation for carbonyl compounds with a γ-hydrogen (a hydrogen on the carbon three positions from the carbonyl). It proceeds through a six-membered cyclic transition state, transferring that γ-hydrogen to the carbonyl oxygen and cleaving the bond between the α and β carbons — producing a distinctive even-electron fragment and a neutral alkene, without needing simple bond homolysis.',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Isotope Patterns Reveal Cl and Br Directly',
          body: 'Chlorine occurs naturally as ³⁵Cl (about 76%) and ³⁷Cl (about 24%) — roughly a 3:1 ratio — so any fragment or molecular ion containing one chlorine shows a matching M and M+2 peak pair at about 3:1 intensity. Bromine\'s two isotopes (⁷⁹Br and ⁸¹Br) occur in almost exactly equal abundance, giving an unmistakable M and M+2 pair at roughly 1:1 — instantly signaling "this fragment contains one bromine" without any other evidence needed.',
        },
      ],
      mcqs: [
        {
          question: 'A mass spectrum shows a molecular ion pair at m/z 150 and 152 with roughly equal (1:1) intensity. What does this pattern most strongly suggest?',
          options: [
            'The compound contains one chlorine atom',
            'The compound contains one bromine atom',
            'The compound has no halogens at all',
            'The molecular ion is unusually unstable',
          ],
          correct: 1,
          explanation: "A roughly 1:1 intensity ratio between M and M+2 is the signature isotope pattern of a single bromine atom (⁷⁹Br and ⁸¹Br occur in nearly equal natural abundance). Chlorine's M:M+2 ratio is instead about 3:1.",
        },
        {
          question: 'A ketone with a γ-hydrogen undergoes a McLafferty rearrangement. What structural feature does this fragmentation require?',
          options: [
            'A halogen atom on the molecule',
            'A hydrogen atom on the carbon three positions away from the carbonyl, accessible via a six-membered cyclic transition state',
            'An aromatic ring adjacent to the carbonyl',
            'At least two carbonyl groups in the molecule',
          ],
          correct: 1,
          explanation: 'The McLafferty rearrangement specifically requires a γ-hydrogen positioned so that a six-membered transition state can transfer it to the carbonyl oxygen while cleaving the α–β C–C bond.',
        },
      ],
      flashcards: [
        { front: 'Molecular ion (M⁺•)', back: 'The radical cation formed by removing one electron from the molecule — its mass equals the molecular weight.' },
        { front: 'Cl vs. Br isotope pattern (M:M+2 ratio)', back: 'Chlorine: ~3:1. Bromine: ~1:1.' },
        { front: 'McLafferty rearrangement requirement', back: 'A carbonyl compound with a γ-hydrogen, transferred via a six-membered cyclic transition state.' },
      ],
    },

  ],
}
