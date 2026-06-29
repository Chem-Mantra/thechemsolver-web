import type { OrgoChapter } from '../types'

export const CH05: OrgoChapter = {
  id: 'ch05',
  number: 5,
  title: 'Stereochemistry',
  orgo: 1,
  accentHex: '#10b981',
  concepts: [

    // ── Concept 1: Chirality & R/S Configuration ──────────────────────────────
    {
      id: 'ch05-c1-chirality',
      title: 'Chirality, Stereocenters & R/S Configuration',
      subtitle: 'The geometry of handedness — CIP rules and absolute configuration',
      estimatedMinutes: 15,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'Chirality is the property of an object that is non-superimposable on its mirror image. Your hands are chiral: no amount of rotation makes your left hand identical to your right. A molecule is chiral if it cannot be superimposed on its mirror image — typically because it has a carbon atom bonded to four different groups (a stereocenter or chiral center). Chirality in molecules has profound biological consequences: enzymes distinguish enantiomers, drugs have only one active form, and the two enantiomers of a compound can have completely different physiological effects.',
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'The Glove Analogy for Chirality',
          body: 'Imagine trying to put a left-handed glove on your right hand. No matter how you rotate it in 3D space, it won\'t fit properly — only a right-handed glove fits a right hand. Similarly, the "left-handed" enantiomer of a drug (one mirror image) may fit an enzyme active site perfectly (like glove on hand), while the "right-handed" enantiomer does not fit — it is pharmacologically inactive or even toxic. Thalidomide is the tragic example: one enantiomer treated morning sickness, the other caused birth defects.',
        },
        {
          type: 'list',
          variant: 'numbered',
          items: [
            'Identify the stereocenter: a carbon bonded to four DIFFERENT groups',
            'Assign priorities 1–4 to the four groups using CIP rules (see below)',
            'Orient the molecule so priority 4 (lowest) points AWAY from you (into the page)',
            'Read priorities 1→2→3: if clockwise = R; counterclockwise = S',
            'If priority 4 is pointing toward you, read 1→2→3 and then REVERSE the assignment',
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'CIP Priority Rules (Cahn-Ingold-Prelog)',
          body: '1. Higher atomic number = higher priority (Br > Cl > O > N > C > H)\n2. Tie at first atom? Go to the next atom attached and compare (breadth-first)\n3. Double and triple bonds are treated as phantom duplicate atoms:\n   –C=O is treated as –C(O)(O)– where the phantom O has no further connections\n   –C≡N is treated as –C(N)(N)(N)– with phantom N atoms\n\nPractical tip: F, Cl, Br, I all beat O, N, and C. Among second-row elements: O > N > C > B. H is always last.\n\nFor multiple bonds, the duplicated atoms count toward priority but have no substituents of their own (phantom atoms).',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'What Makes a Molecule Achiral?',
          body: 'A molecule is achiral (not chiral) if it has:\n1. No stereocenters at all\n2. A plane of symmetry (mirror plane through the molecule) even if stereocenters are present → meso compound\n3. A center of inversion or n-fold rotation-reflection axis (less common in orgo 1)\n\nNOTE: not all molecules with stereocenters are chiral — meso compounds have stereocenters but are achiral due to internal symmetry.',
        },
      ],
      mcqs: [
        {
          question: 'Assign R or S to the stereocenter in (S)-2-bromobutane. The stereocenter has: –Br (priority 1), –CH₂CH₃ (priority 3), –CH₃ (priority 4), –H (lowest). Wait — H is priority 4. With H pointing away, the order 1→2→3 is: Br → ??? → CH₂CH₃. Need: what is priority 2? For (2-bromobutane): the four groups are Br, H, CH₃, CH₂CH₃. Priorities: Br (Br > all) = 1; CH₂CH₃ (C–C–C chain) vs CH₃ (C–H,H,H): CH₂CH₃ has C at next level, CH₃ has H — so CH₂CH₃ = 2; CH₃ = 3; H = 4.',
          options: [
            'R — because 1→2→3 clockwise with H pointing away',
            'S — because 1→2→3 counterclockwise with H pointing away',
            'Cannot be determined without a 3D model',
            'The compound has no stereocenter',
          ],
          correct: 1,
          explanation: 'For (S)-2-bromobutane: priorities are Br(1) > CH₂CH₃(2) > CH₃(3) > H(4). With H (priority 4) pointing away, reading 1→2→3: Br to CH₂CH₃ to CH₃ counterclockwise = S configuration. This is consistent with the given "(S)" in the name. If priority 4 (H) were pointing toward you, the apparent clockwise would actually be S after reversal.',
        },
        {
          question: 'Which of the following is NOT a stereocenter?',
          options: [
            'The central carbon in CHClBrF',
            'C2 of 2-chlorobutane (CH₃CHClCH₂CH₃)',
            'C1 of 1-chlorobutane (ClCH₂CH₂CH₂CH₃)',
            'The central carbon of glyceraldehyde (HOCH₂CHOHCHO)',
          ],
          correct: 2,
          explanation: 'C1 of 1-chlorobutane: the four groups bonded to C1 are Cl, H, H, and CH₂CH₂CH₃. Two of the four groups are H — identical! A stereocenter requires FOUR different groups. C1 here has two hydrogens, so it is NOT a stereocenter — it is a primary carbon with no chirality. All other carbons listed have four different groups: CHClBrF has Cl, Br, F, H (all different); C2 of 2-chlorobutane has Cl, H, CH₃, CH₂CH₃ (all different); glyceraldehyde C2 has OH, H, CHO, CH₂OH (all different).',
        },
        {
          question: 'In the CIP system, what is the priority of a vinyl carbon (–CH=CH₂) relative to an ethyl carbon (–CH₂CH₃)?',
          options: [
            'Ethyl is higher priority (more H atoms)',
            'Vinyl is higher priority (the double bond is treated as two C atoms at the second shell)',
            'They have identical priority (both have 2 carbons)',
            'Priority cannot be determined for carbon-containing groups',
          ],
          correct: 1,
          explanation: 'Vinyl (–CH=CH₂) is higher priority. The double bond is treated as duplicate atoms: –CH=CH₂ becomes –CH(CH₂)(pC)– where pC is a phantom carbon at the second shell (the duplicated carbon). At the first atom: vinyl C has (C, C, H) phantom-expanded; ethyl –CH₂CH₃ has (C, H, H). Comparing at the first attached carbon: vinyl shows (C,C,H) vs ethyl (C,H,H) — vinyl wins at this position because C > H. So vinyl > ethyl in CIP priority.',
        },
      ],
      flashcards: [
        {
          front: 'Definition of a stereocenter (chiral center)',
          back: 'A carbon atom bonded to FOUR different substituents. Also called an asymmetric carbon or chiral carbon. Identified in names with an asterisk (C*). Gives rise to R and S configurations. Note: stereocenters can also exist at N, P, S in certain compounds, but for orgo 1 focus on carbon.',
        },
        {
          front: 'CIP priority assignment — quick rules',
          back: '1. Higher atomic number = higher priority: I > Br > Cl > S > O > N > C > H\n2. Tie at first atom: proceed to the next shell and compare (breadth-first, NOT depth-first)\n3. Double bond: treat as two phantom atoms of same element (no further substituents)\n4. Triple bond: treat as three phantom atoms\n\nAlways compare atom by atom, not group weight.',
        },
        {
          front: 'R vs S: reading the rotation',
          back: 'Place lowest priority (usually H, priority 4) pointing AWAY from you.\nRead 1→2→3 around the remaining three groups:\n• Clockwise = R (Latin: rectus, "right")\n• Counterclockwise = S (Latin: sinister, "left")\n\nIf priority 4 is pointing TOWARD you: read the rotation, then REVERSE the assignment (clockwise → S, counterclockwise → R).',
        },
        {
          front: 'What biological consequence does chirality have?',
          back: 'Enzymes and receptors are themselves chiral (made of L-amino acids). They recognize only one enantiomer of a substrate. In drugs: often only one enantiomer is active (eutomer); the other may be inactive (distomer) or harmful. Example: S-ibuprofen is the active pain reliever; R-ibuprofen is less active. Amino acids in biology are all L; sugars are mostly D.',
        },
      ],
    },

    // ── Concept 2: Enantiomers, Diastereomers & Meso Compounds ───────────────
    {
      id: 'ch05-c2-stereo-relationships',
      title: 'Enantiomers, Diastereomers & Meso Compounds',
      subtitle: 'Non-identical mirror images and unexpected symmetry',
      estimatedMinutes: 13,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'When a compound has more than one stereocenter, the number of possible stereoisomers can be large. For n stereocenters, the maximum number of stereoisomers is 2ⁿ (this can be reduced by internal symmetry). Stereoisomers that are non-superimposable mirror images are enantiomers. Stereoisomers that are NOT mirror images of each other are diastereomers. Diastereomers have different physical AND chemical properties — enantiomers have the same physical properties (boiling point, solubility, melting point) except for optical rotation and behavior toward chiral agents.',
        },
        {
          type: 'table',
          headers: ['Relationship', 'Mirror images?', 'Superimposable?', 'Physical properties', 'Optical rotation'],
          rows: [
            ['Enantiomers', 'Yes (non-superimposable)', 'No', 'Identical (bp, mp, solubility)', 'Equal magnitude, opposite sign (+/−)'],
            ['Diastereomers', 'No', 'No', 'Different (different mp, bp, Rf)', 'Usually different magnitudes and signs'],
            ['Meso compound', 'Yes (superimposable!)', 'Yes — same compound!', 'Achiral despite having stereocenters', 'Optically inactive (0°)'],
            ['Constitutional isomers', 'No', 'No (different connectivity)', 'Very different', 'Different'],
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Meso Compounds: Stereocenters Without Chirality',
          body: 'A meso compound has stereocenters but is achiral because it has an internal plane of symmetry — one half of the molecule is the mirror image of the other half. The stereocenter configurations cancel each other out.\n\nExample: meso-tartaric acid has configurations (2R,3S). Its mirror image is (2S,3R) — but this is the same compound after rotation! Rotate 180° and the (2R,3S) molecule is superimposable on (2S,3R). Physical property: optically inactive (specific rotation = 0). It is NOT a racemate — it is a single compound.\n\nContrast with (2R,3R)-tartaric acid and (2S,3S)-tartaric acid, which are true enantiomers.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Counting Stereoisomers Systematically',
          body: 'For a compound with n stereocenters (no internal symmetry): max stereoisomers = 2ⁿ\nThese come in enantiomeric pairs: 2ⁿ/2 enantiomeric pairs\n\nWith internal symmetry (potential meso forms): fewer than 2ⁿ\n\nExample: 2,3-dichlorobutane has 2 stereocenters → max 4 stereoisomers:\n• (2R,3R) and (2S,3S) — enantiomers\n• (2R,3S) — meso compound (= its own mirror image)\n→ Only 3 distinct stereoisomers total (not 4), because the meso form accounts for two slots.\n\nA racemic mixture = equimolar mixture of two enantiomers. It is optically inactive (rotations cancel). A single enantiomer is optically active.',
        },
      ],
      mcqs: [
        {
          question: 'Which pair of compounds are diastereomers?',
          options: [
            '(R)-lactic acid and (S)-lactic acid',
            '(2R,3R)-2,3-dibromobutane and (2S,3S)-2,3-dibromobutane',
            '(2R,3R)-2,3-dibromobutane and (2R,3S)-2,3-dibromobutane (meso)',
            '1-bromobutane and 2-bromobutane',
          ],
          correct: 2,
          explanation: '(2R,3R) and meso-(2R,3S) are diastereomers. They are stereoisomers (same connectivity, same formula) but NOT mirror images of each other. (2R,3R) is optically active; the meso form (2R,3S) is optically inactive. They have different physical properties (different melting points, solubilities). Option A is enantiomers (mirror images). Option B is enantiomers ((RR) and (SS) are mirror images). Option D involves different connectivities — those are constitutional isomers, not stereoisomers.',
        },
        {
          question: 'meso-Tartaric acid has the configuration (2R,3S). Its mirror image appears to be (2S,3R). These are:',
          options: [
            'Enantiomers — they have opposite configurations at both stereocenters',
            'The same compound — (2R,3S) is superimposable on (2S,3R) due to the internal plane of symmetry; they are both meso-tartaric acid',
            'Diastereomers — they have different configurations',
            'Constitutional isomers — they differ in the position of the OH groups',
          ],
          correct: 1,
          explanation: 'Meso-tartaric acid (2R,3S) has an internal plane of symmetry passing through the C2–C3 bond. One half of the molecule (containing C2-R) is the mirror image of the other half (C3-S). The "mirror image" of meso-tartaric acid is (2S,3R), but rotating it 180° shows it is superimposable on (2R,3S) — they are the SAME compound. This is the definition of a meso compound: apparent stereocenters, but the molecule is its own mirror image. Optically inactive with specific rotation = 0°.',
        },
        {
          question: 'How many stereoisomers exist for 2-bromopentane?',
          options: [
            '1', '2', '4', '0',
          ],
          correct: 1,
          explanation: '2-Bromopentane (CH₃–CHBr–CH₂CH₂CH₃) has ONE stereocenter at C2: bonded to Br, H, CH₃, and CH₂CH₂CH₃ (all different). One stereocenter → 2¹ = 2 stereoisomers: (R)-2-bromopentane and (S)-2-bromopentane. These are enantiomers. There is no internal symmetry possibility with a single stereocenter, so no meso form. Both are optically active; their equimolar mixture would be a racemic mixture (optically inactive).',
        },
      ],
      flashcards: [
        {
          front: 'Enantiomers vs diastereomers: key differences',
          back: 'Enantiomers: non-superimposable mirror images. Same physical properties except optical rotation (equal magnitude, opposite sign ±). Same chemical reactivity toward achiral reagents; different reactivity toward chiral reagents.\n\nDiastereomers: NOT mirror images of each other. DIFFERENT physical properties (mp, bp, solubility, Rf). Different reactivity. Can be separated by ordinary chromatography.',
        },
        {
          front: 'How do you identify a meso compound?',
          back: 'A meso compound has stereocenters but is achiral. Test: draw the mirror image. If the mirror image can be superimposed on the original by rotation, it is meso.\n\nQuick visual: does the molecule have a plane of symmetry that bisects the molecule into two mirror-image halves? If yes → meso.\n\nResult: meso compounds are optically inactive (rotate plane-polarized light 0°) despite having stereocenters. Example: meso-tartaric acid (2R,3S).',
        },
        {
          front: 'Racemic mixture vs meso compound — both optically inactive, but why?',
          back: 'Racemic mixture: a 50:50 mixture of (+) and (−) enantiomers. Each enantiomer rotates light equally in opposite directions — they cancel. Optically inactive macroscopically, but each molecule IS chiral.\n\nMeso compound: a single, pure compound with an internal mirror plane. Each molecule is inherently achiral — symmetric at the molecular level. Not a mixture.',
        },
        {
          front: 'How many stereoisomers for a compound with n stereocenters?',
          back: 'Maximum = 2ⁿ stereoisomers.\nIf internal symmetry exists (meso possible): fewer than 2ⁿ.\n\nExamples:\n• 1 stereocenter → 2 stereoisomers (1 pair of enantiomers)\n• 2 stereocenters (no meso) → 4 stereoisomers (2 pairs of enantiomers)\n• 2 stereocenters with meso possible → 3 stereoisomers (1 meso + 1 enantiomeric pair)',
        },
      ],
    },

    // ── Concept 3: Optical Activity & Reaction Stereochemistry ───────────────
    {
      id: 'ch05-c3-optical-activity',
      title: 'Optical Activity & Stereochemistry in Reactions',
      subtitle: 'Specific rotation, SN2 inversion, and SN1 racemization',
      estimatedMinutes: 11,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'Optical activity is the ability of a chiral compound to rotate plane-polarized light. When plane-polarized light passes through a solution of a pure enantiomer, the plane of polarization rotates by a specific angle. Compounds that rotate light clockwise are called dextrorotatory (+); those that rotate counterclockwise are levorotatory (−). This is measured experimentally and is called the optical rotation (α).',
        },
        {
          type: 'formula',
          latex: '[\\alpha]^{20}_D = \\frac{\\alpha_{\\text{obs}}}{l \\times c}',
          display: true,
          caption: 'Specific rotation [α]: αobs = observed rotation (degrees); l = path length (dm); c = concentration (g/mL). The D and 20 refer to sodium D light (589 nm) at 20°C. Specific rotation is a characteristic physical property of a pure enantiomer.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'R/S Does NOT Predict + or −',
          body: 'The R/S designation (absolute configuration) and the (+)/(−) sign of optical rotation are INDEPENDENT properties. R does not mean + and S does not mean −. The sign of optical rotation is determined experimentally, not predicted from the priority sequence.\n\nExample: (R)-glyceraldehyde is (+) dextrorotatory. But (R)-lactic acid is (−) levorotatory. The R label is absolute configuration; the + or − sign is a measured property.\n\nThe only connection: the enantiomer always has the opposite sign: if (R)-X has [α] = +23°, then (S)-X has [α] = −23°.',
        },
        {
          type: 'table',
          headers: ['Reaction type', 'Stereochemical outcome', 'Product(s)', 'Why'],
          rows: [
            ['SN2 at a stereocenter', 'Inversion of configuration (Walden inversion)', 'Single enantiomer, opposite configuration', 'Backside attack: nucleophile enters opposite to leaving group — umbrella-flip of bonds'],
            ['SN1 at a stereocenter', 'Racemization (mostly)', 'Racemic mixture (equal + and −)', 'Carbocation intermediate is planar (sp²); nucleophile attacks both faces equally'],
            ['E2 elimination', 'Anti-periplanar requirement', 'Specific alkene geometry (cis or trans) determined by substrate geometry', 'H and LG must be anti in transition state'],
            ['Catalytic hydrogenation of alkene', 'Syn addition of H₂', 'Two adjacent H added to same face', 'H₂ delivered from one face of metal surface'],
          ],
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Why SN2 Inverts and SN1 Racemizes',
          body: 'SN2: The nucleophile attacks the back face of the tetrahedral carbon — like pushing an umbrella through from one side. The four bonds on the carbon "flip" to the other side (inversion). This always produces the opposite configuration at the stereocenter. Starting from (R) → product is (S), and vice versa.\n\nSN1: The first step forms a carbocation with a flat (sp²) trigonal planar structure. The remaining three bonds define a plane. The nucleophile can attack from either face with (nearly) equal probability, producing approximately equal amounts of both enantiomers — a racemic mixture. Some SN1 reactions give slightly more inversion if the leaving group partially blocks one face (ion pairing).',
        },
      ],
      mcqs: [
        {
          question: 'A sample of (R)-2-bromobutane undergoes SN2 reaction with NaOH. What is the stereochemical outcome?',
          options: [
            'Racemic mixture of (R)- and (S)-2-butanol',
            '(S)-2-butanol only — inversion of configuration',
            '(R)-2-butanol only — retention of configuration',
            'No stereospecific product because OH is smaller than Br',
          ],
          correct: 1,
          explanation: 'SN2 reactions are stereospecifically inverting. The OH⁻ nucleophile attacks the back face (anti to Br) of the C2 carbon. As Br leaves from the front, the three remaining bonds flip like an umbrella. Since (R)-2-bromobutane had configuration R at C2, the product (S)-2-butanol has configuration S — complete inversion. This is the Walden inversion. SN2 is 100% stereospecific — no racemization occurs because the reaction is concerted (no planar intermediate).',
        },
        {
          question: 'The specific rotation of (R)-2-butanol is +13.5°. What is the specific rotation of a racemic mixture of 2-butanol?',
          options: [
            '+13.5°',
            '−13.5°',
            '0° — because the equal amounts of + and − enantiomers cancel',
            '+27.0° — because both enantiomers contribute',
          ],
          correct: 2,
          explanation: 'A racemic mixture contains equimolar amounts of (R)- and (S)-2-butanol. (R)-2-butanol has [α] = +13.5°; (S)-2-butanol has [α] = −13.5°. In a 50:50 mixture, the positive and negative rotations cancel exactly, giving a net optical rotation of 0°. A racemic mixture is optically inactive — it does not rotate plane-polarized light. This is why racemic mixtures behave differently from pure enantiomers in biological systems — the racemate may be half as effective as the pure active enantiomer.',
        },
        {
          question: 'Which of the following reactions gives predominantly RACEMIC product when starting from a pure (R) enantiomer?',
          options: [
            'SN2 reaction of (R)-2-bromobutane with KCN',
            'SN1 reaction of (R)-2-bromo-2-methylbutane with water',
            'E2 reaction of (R)-2-bromobutane with KOH/ethanol',
            'Catalytic hydrogenation of (R)-2-methylbut-2-ene',
          ],
          correct: 1,
          explanation: 'SN1 proceeds through a planar carbocation intermediate. For (R)-2-bromo-2-methylbutane (tertiary substrate, stable carbocation), the ionization gives a flat sp² carbocation. Water nucleophile attacks both faces equally → ~50:50 mixture of (R) and (S) product = racemic mixture. SN2 (option A) gives inversion (stereospecific). E2 (option C) gives elimination with anti-periplanar requirement, stereospecific product geometry. Catalytic hydrogenation (option D) gives syn addition.',
        },
      ],
      flashcards: [
        {
          front: 'Specific rotation formula and what it measures',
          back: '[α]²⁰_D = α_obs / (l × c)\nα_obs = measured rotation (degrees), l = path length (dm), c = concentration (g/mL)\n\nThe D subscript = sodium D-line light (589 nm). Superscript 20 = 20°C. Positive [α] = dextrorotatory (+); negative = levorotatory (−). Pure enantiomers rotate equally but in opposite directions.',
        },
        {
          front: 'SN2 stereochemistry: what is Walden inversion?',
          back: 'SN2 occurs by backside attack — the nucleophile approaches from the side opposite the leaving group. The three bonds at the carbon "flip" like an umbrella inverting in wind. Result: configuration at the stereocenter is inverted (R → S or S → R). This is 100% stereospecific because SN2 has no intermediate — the mechanism is concerted.',
        },
        {
          front: 'SN1 stereochemistry: why racemization?',
          back: 'SN1 forms a planar sp² carbocation intermediate. The three substituents on the carbocation define a plane. Nucleophile approaches from either face with roughly equal probability → approximately equal amounts of R and S products = racemic mixture. Often slightly more inversion due to ion-pair shielding of one face by the leaving group, but the dominant outcome is racemization.',
        },
        {
          front: 'Does R configuration predict + or − optical rotation?',
          back: 'NO. R/S (absolute configuration) and +/− (optical rotation sign) are COMPLETELY INDEPENDENT. R can be + or − depending on the specific compound. The sign is experimentally measured, not calculated from priorities. The ONLY rule: enantiomers rotate by equal magnitude but opposite sign. (+) one enantiomer → (−) its mirror image.',
        },
      ],
    },
  ],
}
