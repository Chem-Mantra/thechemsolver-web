import type { OrgoChapter } from '../types'

export const CH03: OrgoChapter = {
  id: 'ch03',
  number: 3,
  title: 'Functional Groups & Reactivity Overview',
  orgo: 1,
  accentHex: '#10b981',
  concepts: [

    // ── Concept 1: Hydrocarbons ───────────────────────────────────────────────
    {
      id: 'ch03-c1-hydrocarbons',
      title: 'Hydrocarbons: Alkanes, Alkenes & Alkynes',
      subtitle: 'Carbon and hydrogen only — but vastly different reactivity',
      estimatedMinutes: 11,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'A functional group is the reactive part of an organic molecule — the atoms responsible for characteristic chemical behavior. Hydrocarbons contain only carbon and hydrogen. Despite this simple composition, three different hybridization states create three completely different classes: alkanes (sp³, all σ bonds), alkenes (sp²/sp³, one π bond), and alkynes (sp, two π bonds).',
        },
        {
          type: 'table',
          headers: ['Class', 'Hybridization', 'Bond order', 'Degree of unsaturation', 'Key reactivity'],
          rows: [
            ['Alkane (C–C, C–H)', 'sp³', 'C–C single bond', '0', 'Radical halogenation; combustion; largely inert to ionic reagents'],
            ['Alkene (C=C)', 'sp²', 'One σ + one π', '1 per double bond', 'Electrophilic addition; hydrogenation; ozonolysis; epoxidation'],
            ['Alkyne (C≡C)', 'sp', 'One σ + two π', '2 per triple bond', 'Electrophilic addition; reduction to cis/trans alkene; terminal C–H acidity'],
            ['Arene (benzene ring)', 'sp²', 'Delocalized', '4 per ring', 'Electrophilic aromatic substitution; NOT simple electrophilic addition'],
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Degree of Unsaturation (DoU) — Calculate It First',
          body: 'For a molecular formula CₙHₘNₚOqXᵣ (X = halogen):\n\nDoU = (2n + 2 + p − m − r) / 2\n\nEach ring or π bond contributes 1 DoU. Oxygen and sulfur do not change the formula. Nitrogen adds 1 (like adding an extra H: NH is like CH₂ plus minus one for N).\n\nExamples:\n• C₆H₁₂: DoU = (12 + 2 − 12)/2 = 1 → one ring or one double bond\n• C₆H₆: DoU = (12 + 2 − 6)/2 = 4 → benzene ring (1 ring + 3 π bonds = 4)\n• C₄H₆: DoU = (8 + 2 − 6)/2 = 2 → diene, or one triple bond, or ring + double bond',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Alkenes Are the Workhorses of Organic Synthesis',
          body: 'The C=C π bond is the most versatile functional group in organic chemistry. It can be:\n• Added across (electrophilic addition: HX, X₂, H₂O, H₂)\n• Oxidized (ozonolysis → two fragments; permanganate → diols or cleavage)\n• Epoxidized (peracid → 3-membered ring)\n• Hydroboration-oxidized (anti-Markovnikov OH addition)\n• Reduced (catalytic H₂ → alkane)\n\nEvery product is different, so mastering alkene reactions = mastering synthesis.',
        },
      ],
      mcqs: [
        {
          question: 'What is the degree of unsaturation in C₅H₈?',
          options: ['1', '2', '3', '4'],
          correct: 1,
          explanation: 'DoU = (2×5 + 2 − 8)/2 = (10 + 2 − 8)/2 = 4/2 = 2. This is consistent with a cyclopentene (one ring + one double bond = 2 DoU), a diene like 1,3-pentadiene (two double bonds = 2 DoU), or a cyclopentyne-type compound, among others. Two degrees of unsaturation means two rings and/or π bonds total.',
        },
        {
          question: 'Which hydrocarbon class is the LEAST reactive toward electrophiles?',
          options: ['Alkenes', 'Alkynes', 'Arenes (benzene)', 'Alkanes'],
          correct: 3,
          explanation: 'Alkanes have only σ bonds and no lone pairs, no π electrons, and no partial charges — they offer nothing for electrophiles or nucleophiles to attack. Their only reactivity is radical halogenation (which requires heat or light, not electrophiles) and combustion. Alkenes, alkynes, and arenes all have π electrons that can act as Lewis bases toward electrophiles. Alkanes are the least reactive.',
        },
        {
          question: 'A compound with molecular formula C₄H₄ has DoU = 3. Which structure is most consistent with this formula?',
          options: [
            'Cyclobutane (C₄H₈)',
            'Vinylacetylene (CH₂=CH–C≡CH: one double bond + one triple bond = 3 DoU)',
            '1-Butyne (C₄H₆)',
            'Cyclobutene (C₄H₆)',
          ],
          correct: 1,
          explanation: 'DoU for C₄H₄ = (8 + 2 − 4)/2 = 3. Vinylacetylene (CH₂=CH–C≡CH) has one C=C (1 DoU) + one C≡C (2 DoU) = 3 DoU and molecular formula C₄H₄ — it fits perfectly. Cyclobutane is C₄H₈ (DoU 1), 1-butyne is C₄H₆ (DoU 2), cyclobutene is C₄H₆ (DoU 2). Only vinylacetylene matches both the formula and the DoU.',
        },
      ],
      flashcards: [
        {
          front: 'Degree of unsaturation formula',
          back: 'DoU = (2C + 2 + N − H − X) / 2\n(O and S do not affect DoU)\nEach DoU = one ring OR one π bond\nBenzene ring = 4 DoU (1 ring + 3 π bonds)',
        },
        {
          front: 'How does hybridization change along alkane → alkene → alkyne?',
          back: 'Alkane: all sp³ (109.5°, tetrahedral)\nAlkene: sp²/sp³ (120°, trigonal planar at C=C)\nAlkyne: sp (180°, linear at C≡C)\n→ More s-character = shorter, stronger bond = higher electronegativity of C = more acidic C–H',
        },
        {
          front: 'Why is benzene resistant to addition but undergoes substitution?',
          back: 'Addition to benzene would destroy the 6 π-electron aromatic ring (losing ~150 kJ/mol resonance stabilization). Substitution is preferred because it restores aromaticity after the intermediate arenium ion loses a proton. The molecule "prefers to stay aromatic" — EAS not addition.',
        },
        {
          front: 'What is the key reactivity difference between alkenes and alkynes?',
          back: 'Both undergo electrophilic addition, but alkynes are less reactive toward electrophilic addition (vinyl carbocations formed are less stable). Alkynes have more acidic terminal C–H (pKa ~25 vs >44 for alkenes). Alkynes can be selectively reduced to cis alkenes (Lindlar catalyst) or trans alkenes (Na/NH₃).',
        },
      ],
    },

    // ── Concept 2: Oxygen-Containing Functional Groups ────────────────────────
    {
      id: 'ch03-c2-oxygen-groups',
      title: 'Oxygen-Containing Functional Groups',
      subtitle: 'Alcohols, ethers, aldehydes, ketones, carboxylic acids, and esters',
      estimatedMinutes: 13,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'Oxygen in organic molecules dramatically changes physical and chemical properties. The electronegativity of oxygen creates polar bonds and the possibility of hydrogen bonding. The key insight: the oxidation state of the carbon attached to oxygen determines the class — and climbing up the oxidation ladder from alcohol to aldehyde to carboxylic acid corresponds to losing hydrogen or gaining oxygen.',
        },
        {
          type: 'table',
          headers: ['Functional group', 'Structure', 'Key properties', 'Key reactions'],
          rows: [
            ['Alcohol (–OH)', 'R–OH', 'H-bonding → high bp; hydrophilic; amphoteric', 'Oxidation, dehydration, substitution of OH by X'],
            ['Ether (–O–)', 'R–O–R\'', 'Low reactivity; good solvent; no H-bond donor', 'Acid cleavage of C–O bond; Williamson synthesis'],
            ['Aldehyde (–CHO)', 'R–CHO', 'Polarized C=O; no α-H protection; highly reactive to nucleophiles', 'Nucleophilic addition, oxidation to RCOOH, Wittig'],
            ['Ketone (R–CO–R\')', 'R–CO–R\'', 'Polarized C=O; less reactive than aldehyde (steric)', 'Nucleophilic addition, Baeyer-Villiger, Wittig'],
            ['Carboxylic acid (–COOH)', 'R–COOH', 'pKa ~4–5; H-bonding; highest-bp class', 'Esterification, decarboxylation, reduction to alcohol or aldehyde'],
            ['Ester (–COO–)', 'R–COO–R\'', 'Pleasant odors; lower bp than acid; no H-bond donor', 'Hydrolysis, transesterification, reduction'],
            ['Epoxide (oxirane)', '3-membered ring with O', 'Highly strained; reactive to nucleophiles at C', 'Ring opening by Nu: (acid or base conditions)'],
          ],
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'Think of Oxidation State as a Carbon "Ladder"',
          body: 'Carbon can be thought of as climbing a 4-rung ladder from most reduced to most oxidized:\n\nRung 0: CH₄ (all C–H bonds) — most reduced\nRung 1: CH₃OH (alcohol) — one C–O bond\nRung 2: CH₂O (aldehyde/ketone) — two C–O bonds or one C=O\nRung 3: HCOOH (carboxylic acid) — three C–O equivalents\nRung 4: CO₂ (most oxidized carbon)\n\nEach oxidation "step up" removes 2H or adds 1O. Reduction is the reverse. Naming reactions by this oxidation relationship makes mechanisms predictable.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Boiling Point Trends Across Functional Groups',
          body: 'For compounds of similar molecular weight:\n\nCarboxylic acids > Alcohols > Aldehydes/Ketones > Ethers ≈ Alkanes\n\nWhy? Acids and alcohols form H-bonds (they donate AND accept). Ketones/aldehydes accept H-bonds from water but don\'t donate to each other. Ethers can only accept. Alkanes have only London dispersion.\n\nWater solubility follows a similar trend: short-chain acids, alcohols, and ketones/aldehydes are miscible with water; long-chain (>5C) become insoluble; ethers are poorly soluble; alkanes are insoluble.',
        },
      ],
      mcqs: [
        {
          question: 'Rank these compounds in order of increasing boiling point: diethyl ether (MW 74), 1-butanol (MW 74), butanal (MW 72).',
          options: [
            '1-butanol < butanal < diethyl ether',
            'diethyl ether < butanal < 1-butanol',
            'butanal < diethyl ether < 1-butanol',
            'diethyl ether < 1-butanol < butanal',
          ],
          correct: 1,
          explanation: 'Similar molecular weights, so intermolecular forces determine bp. Diethyl ether has no H-bond donors — only London dispersion and lone-pair acceptance. bp = 34.6°C. Butanal (an aldehyde) has a polar C=O, dipole-dipole interactions, but no H-bond donor. bp = 74.8°C. 1-Butanol has an O–H group: full hydrogen bonding (both donor and acceptor). bp = 117.7°C. Order: diethyl ether < butanal < 1-butanol.',
        },
        {
          question: 'Why are carboxylic acids (e.g., acetic acid, pKa 4.7) so much more acidic than alcohols (e.g., ethanol, pKa 16)?',
          options: [
            'The carboxyl group has two oxygens, so it attracts more electrons from the O–H bond',
            'The carboxylate anion is stabilized by resonance delocalization over two equivalent oxygens; the ethoxide anion has no resonance relief',
            'Carboxylic acids have more carbon atoms and are therefore more electronegative',
            'The C=O oxygen withdraws electrons inductively from the O–H bond',
          ],
          correct: 1,
          explanation: 'The carboxylate anion (RCOO⁻) has two equivalent resonance structures — the negative charge is delocalized equally over both oxygens (bond order 1.5 for each C–O). This resonance stabilization dramatically lowers the energy of the conjugate base, making carboxylic acids ~10¹¹ times more acidic than alcohols. Ethoxide has no resonance stabilization — all negative charge on one oxygen. Inductive effects (choice D) play a minor role but resonance is the dominant factor.',
        },
        {
          question: 'An unknown compound has the molecular formula C₃H₆O. Which functional group is MOST consistent if the compound reacts readily with sodium borohydride (NaBH₄) to give C₃H₈O?',
          options: [
            'Ether (propylene oxide ring-opening)',
            'Alkene with an OH group',
            'Aldehyde (propanal) or ketone (acetone) — both have DoU = 1 and can be reduced to an alcohol',
            'Carboxylic acid',
          ],
          correct: 2,
          explanation: 'DoU for C₃H₆O = (6 + 2 − 6)/2 = 1. This is consistent with an aldehyde (propanal, CH₃CH₂CHO) or a ketone (acetone, CH₃COCH₃) — both have one C=O contributing one DoU. NaBH₄ selectively reduces aldehydes and ketones (the C=O double bond) to alcohols; the product C₃H₈O is a primary (from propanal) or secondary (from acetone) alcohol. NaBH₄ does not reduce esters, carboxylic acids, or epoxides under normal conditions.',
        },
      ],
      flashcards: [
        {
          front: 'Oxidation state ladder for carbon (most reduced → most oxidized)',
          back: 'CH₄ (alkane) → R–CH₂OH (primary alcohol) → R–CHO (aldehyde) → R–COOH (carboxylic acid) → CO₂\n\nEach step up = oxidation (loss of H or gain of O). Going down = reduction. Ketones sit at the aldehyde level (two C–O bonds, but with two C substituents instead of C and H).',
        },
        {
          front: 'Why do carboxylic acids have higher boiling points than alcohols of similar MW?',
          back: 'Carboxylic acids form cyclic hydrogen-bonded dimers in the liquid phase (two H-bonds per molecular pair instead of one). This effectively doubles the intermolecular attraction vs. a single OH···O hydrogen bond in alcohols, raising the boiling point further.',
        },
        {
          front: 'What distinguishes an aldehyde from a ketone?',
          back: 'Aldehyde: C=O is at the END of a carbon chain — one hydrogen on the carbonyl carbon (R–CHO). Ketone: C=O is in the MIDDLE — two carbon substituents (R–CO–R\'). Aldehydes are more reactive toward nucleophilic addition (less hindered carbonyl carbon, less electron donation from substituents).',
        },
        {
          front: 'What is the unique reactivity of epoxides compared to regular ethers?',
          back: 'Epoxides are highly strained 3-membered rings — the C–O–C angle is forced to 60° (vs. ideal 104°). This ring strain makes epoxides much more reactive than regular ethers. They open readily with nucleophiles (Nu⁻ + acid or base): under basic conditions, Nu: attacks the less hindered carbon; under acidic conditions, Nu: attacks the more substituted (more carbocation-like) carbon.',
        },
      ],
    },

    // ── Concept 3: N-Containing Groups & Recognizing Reactive Sites ──────────
    {
      id: 'ch03-c3-heteroatoms',
      title: 'Nitrogen Groups & Identifying Reactive Sites',
      subtitle: 'Amines, amides, nitriles, and the electrophile/nucleophile framework',
      estimatedMinutes: 12,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'Nitrogen-containing functional groups are critically important in biology and pharmaceuticals — every amino acid, every nucleotide base, and most drugs contain nitrogen. The lone pair on nitrogen makes it a nucleophile and base; how reactive it is depends on the hybridization state and whether the lone pair is delocalized.',
        },
        {
          type: 'table',
          headers: ['Functional group', 'Structure', 'N hybridization', 'Basicity/Nucleophilicity', 'Key reactions'],
          rows: [
            ['Primary amine (–NH₂)', 'R–NH₂', 'sp³', 'pKa of RNH₃⁺ ~10–11; good nucleophile', 'Reductive amination, acylation, alkylation, reaction with carbonyl'],
            ['Secondary amine', 'R₂NH', 'sp³', 'pKa ~11; slightly less nucleophilic than 1°', 'Similar to primary; cannot form primary amide'],
            ['Tertiary amine', 'R₃N', 'sp³', 'pKa ~9–10; nucleophilic but steric hindrance', 'Quaternary ammonium salt formation; Hofmann elimination'],
            ['Amide (–CONH₂)', 'R–CO–NH₂', 'sp² (N lone pair in resonance with C=O)', 'pKa ~−1 (weakly basic); poor nucleophile', 'Hydrolysis; Hofmann rearrangement; peptide bonds'],
            ['Nitrile (–CN)', 'R–C≡N', 'sp (N triple bond)', 'Very weakly basic; electrophilic C', 'Hydrolysis to amide then acid; reduction to amine; addition reactions'],
            ['Nitro (–NO₂)', 'R–NO₂', 'Resonance-stabilized', 'Not basic (N is oxidized)', 'Reduction to amine; EWG for ring deactivation in EAS'],
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Amide Nitrogen Is NOT Basic',
          body: 'The pKa of an amide nitrogen\'s conjugate acid is about −1 — meaning an amide is essentially never protonated at physiological pH. Why? The nitrogen lone pair is delocalized into the adjacent C=O by resonance (N–C=O ↔ N⁺=C–O⁻). The lone pair is "used up" stabilizing the carbonyl, making it unavailable to accept a proton.\n\nThis is why peptide bonds (which are amide bonds) are planar, rigid, and have restricted rotation — the N lone pair is in a π bond with C=O about 40% of the time. This planarity is the structural basis for protein secondary structure (α-helix, β-sheet).',
        },
        {
          type: 'text',
          body: 'The most powerful organizing principle in organic chemistry is the identification of electrophilic and nucleophilic sites. An electrophile is electron-poor — it wants electrons. A nucleophile is electron-rich — it wants to donate electrons. Reaction occurs when a nucleophile attacks an electrophile.',
        },
        {
          type: 'list',
          variant: 'bullet',
          items: [
            'Electrophilic sites: carbons bearing partial positive charge (δ+) — carbonyl carbons, carbocations, carbon bonded to electronegative atom (C–X, C–OH); empty orbitals; Lewis acids',
            'Nucleophilic sites: atoms with lone pairs or π electrons — O (alcohols, ethers, water), N (amines), S (thiols), halide ions, alkenes, alkynes, enols/enolates',
            'Leaving groups: atoms/groups that depart with the bonding electrons — halides, tosylate, mesylate, water (after protonation), carboxylate',
            'Electrophilic aromatic positions: atoms on electron-poor arenes (meta to deactivating groups, or on rings with EWG)',
          ],
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'One Map to Read Every Mechanism',
          body: 'Draw the molecule. Mark δ+ on every carbon bonded to an electronegative atom (O, N, X). Mark lone pairs on every heteroatom. Then ask: which δ+ site could a lone pair or π electrons attack?\n\nThis is not a simplification — it is literally how organic mechanisms work. The arrows in mechanisms always flow FROM the lone pair or π bond (nucleophile) TO the electrophilic site. Every single arrow in every organic mechanism obeys this rule.',
        },
      ],
      mcqs: [
        {
          question: 'Why is aniline (C₆H₅–NH₂, pKa 4.6 of conjugate acid) a much weaker base than cyclohexylamine (C₆H₁₁–NH₂, pKa 10.6 of conjugate acid)?',
          options: [
            'Aniline has fewer lone pairs than cyclohexylamine',
            'The nitrogen lone pair in aniline is delocalized into the benzene ring by resonance, making it less available for protonation',
            'The benzene ring withdraws electrons inductively from the N–H bond, weakening basicity',
            'Cyclohexylamine is a tertiary amine, which is always more basic',
          ],
          correct: 1,
          explanation: 'In aniline, the N lone pair overlaps with the benzene π system — drawing resonance structures shows partial positive charge on N (N⁺=) and negative charge at ortho/para ring positions. This delocalization stabilizes the free amine but destabilizes the conjugate acid (protonation disrupts resonance). The lone pair is less available for protonation, making aniline a much weaker base (pKa 4.6) than cyclohexylamine (pKa 10.6), where no resonance competes. This is the same effect seen in amides.',
        },
        {
          question: 'In an ester (R–COO–R\'), which carbon is the electrophilic site?',
          options: [
            'The alkyl R carbon (far from the oxygen)',
            'The carbonyl carbon (C=O) — it bears δ+ due to oxygen electronegativity',
            'Both oxygens are electrophilic sites',
            'There is no electrophilic site in an ester',
          ],
          correct: 1,
          explanation: 'The carbonyl carbon of an ester (C=O) is electron-deficient (δ+) because the electronegative oxygen withdraws electrons from carbon. This is the site attacked by nucleophiles in acyl substitution reactions (hydrolysis, aminolysis, transesterification). The alkyl group R\' on the other oxygen is not the primary electrophilic site for nucleophilic acyl substitution, though it can be attacked in SN2 reactions for certain activated esters.',
        },
        {
          question: 'A compound contains a nitrile group (C≡N). What product is formed when it is reduced with LiAlH₄?',
          options: [
            'A carboxylic acid (RCOOH)',
            'An aldehyde (RCHO)',
            'A primary amine (RCH₂NH₂)',
            'An amide (RCONH₂)',
          ],
          correct: 2,
          explanation: 'LiAlH₄ is a powerful reducing agent that reduces nitriles all the way to primary amines: R–C≡N + 4[H] → R–CH₂–NH₂. The mechanism involves two successive hydride additions. Milder reduction (with DIBAL-H at −78°C, then aqueous workup) gives an aldehyde. Hydrolysis (acid or base + H₂O) gives the amide then the carboxylic acid, not reduction. This nitrile-to-amine transformation is a key synthetic route because nitriles are easily formed from primary alkyl halides (SN2 with CN⁻).',
        },
      ],
      flashcards: [
        {
          front: 'Why are amide nitrogens much less basic than amine nitrogens?',
          back: 'The N lone pair in an amide is delocalized by resonance into the adjacent C=O group (N–C=O ↔ ⁻N=C–O⁻ ... actually N⁺=C–O⁻). This resonance stabilizes the amide but uses up the lone pair. The N lone pair is not freely available to accept a proton — amide pKa (conjugate acid) ≈ −1 vs. amine pKa ≈ 10.',
        },
        {
          front: 'What are the key electrophilic sites in organic molecules?',
          back: '• Carbonyl carbons (C=O in aldehydes, ketones, esters, amides) — δ+\n• Carbocations (empty p orbital)\n• Carbons bonded to halogens or other EWG (δ+)\n• Aromatic rings with EWG (especially meta positions)\n• Lewis acid metals (AlCl₃, BF₃)',
        },
        {
          front: 'What are the key nucleophilic sites in organic molecules?',
          back: '• Amines (lone pair on N)\n• Alcohols/water/ethers (lone pairs on O)\n• Halide ions (Cl⁻, Br⁻, I⁻)\n• Enolates (α-carbanion stabilized by C=O)\n• Alkenes and alkynes (π electrons)\n• Organolithium and Grignard (C⁻ = very strong nucleophile)',
        },
        {
          front: 'Nitrile → amine: what reagents convert –C≡N to –CH₂NH₂?',
          back: 'LiAlH₄ (LAH) in dry ether, then aqueous workup. LiAlH₄ delivers 2 hydrides to give an imine intermediate then 2 more to give the primary amine. This is a useful synthetic route: RX + NaCN (SN2) → RCN + LiAlH₄ → RCH₂NH₂ — a one-carbon homologation with a primary amine.',
        },
      ],
    },
  ],
}
