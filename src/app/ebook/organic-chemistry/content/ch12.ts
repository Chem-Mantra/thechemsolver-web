import type { OrgoChapter } from '../types'

export const CH12: OrgoChapter = {
  id: 'ch12',
  number: 12,
  title: 'Aromatic Compounds',
  orgo: 2,
  accentHex: '#a855f7',
  concepts: [

    // ── Concept 1: Benzene & Hückel's Rule ────────────────────────────────────
    {
      id: 'ch12-c1-huckel',
      title: 'Benzene & Hückel\'s Rule',
      subtitle: 'The 4n+2 criterion for aromaticity',
      estimatedMinutes: 13,
      accentHex: '#a855f7',
      blocks: [
        {
          type: 'text',
          body: 'Benzene is the prototypical aromatic compound — a ring system so stabilized by electron delocalization that it resists addition reactions and prefers substitution. The word "aromatic" in modern chemistry has a precise mathematical definition based on quantum mechanics: a cyclic, planar, fully conjugated system with 4n+2 π electrons (Hückel\'s rule, where n = 0, 1, 2, 3...). This resonance energy (aromatic stabilization energy ≈ 150 kJ/mol for benzene) is what makes aromatic compounds so distinctive.',
        },
        {
          type: 'formula',
          latex: '\\text{Aromatic: cyclic, planar, fully conjugated, } (4n+2) \\text{ π electrons}',
          display: true,
          caption: 'Hückel\'s rule: n = 0 gives 2 π e⁻ (cyclopropenyl cation); n = 1 gives 6 π e⁻ (benzene, pyridine, pyrrole); n = 2 gives 10 π e⁻ (naphthalene, azulene); n = 3 gives 14 π e⁻ (anthracene).',
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'Why 4n+2 and Not Just Any Even Number?',
          body: 'Molecular orbital theory explains why. Fill the π MOs of a ring from lowest to highest energy. The lowest MO holds 2 electrons; the next shell holds 4 (two degenerate MOs); the next holds 4 more; and so on. A closed-shell (all electrons paired) configuration occurs at 2, 6, 10, 14 electrons — exactly 4n+2. Antiaromatic systems have 4n electrons (4, 8, 12...) — these half-fill a degenerate shell, giving a triplet diradical by Hund\'s rule: highly destabilized. Think of filling atomic orbitals: a closed shell (noble gas) is extra stable (aromatic); a half-filled p shell (e.g., carbon) is reactive.',
        },
        {
          type: 'table',
          headers: ['Compound', 'π electrons', 'n value', 'Classification'],
          rows: [
            ['Benzene (C₆H₆)', '6', 'n=1', 'Aromatic (4(1)+2=6)'],
            ['Cyclopentadienyl anion (C₅H₅⁻)', '6', 'n=1', 'Aromatic (lone pair on C⁻ in conjugation)'],
            ['Cyclopropenyl cation (C₃H₃⁺)', '2', 'n=0', 'Aromatic (4(0)+2=2)'],
            ['Naphthalene (C₁₀H₈)', '10', 'n=2', 'Aromatic'],
            ['Pyridine (C₅H₅N)', '6', 'n=1', 'Aromatic (N lone pair in ring plane, not in π system)'],
            ['Pyrrole (C₄H₄NH)', '6', 'n=1', 'Aromatic (N lone pair IN π system)'],
            ['Cyclobutadiene (C₄H₄)', '4', '4(1)=4', 'Antiaromatic (4n electrons)'],
            ['Cyclopentadienyl cation (C₅H₅⁺)', '4', '4(1)=4', 'Antiaromatic (empty orbital in ring)'],
            ['Cyclooctatetraene (C₈H₈)', '8', '4(2)=8', 'Nonaromatic (tub-shaped, not planar)'],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Antiaromatic vs Nonaromatic: Important Distinction',
          body: 'ANTIAROMATIC: cyclic, planar, fully conjugated, with 4n π electrons (4, 8, 12...). These are DESTABILIZED relative to open-chain analogues — they avoid forming if possible. Cyclobutadiene is so unstable it exists only transiently at very low temperatures.\n\nNONAROMATC: a cyclic compound that does not meet all criteria for aromaticity but is also not antiaromatic. Either NOT planar, NOT fully conjugated, or lacks the right electron count. Cyclooctatetraene (COT, C₈H₈) has 8 π electrons (antiaromatic count) but distorts to a tub shape to avoid planarity — it\'s nonaromatic, not antiaromatic, and behaves like a normal polyene.',
        },
      ],
      mcqs: [
        {
          question: 'Is the cyclopentadienyl anion (C₅H₅⁻) aromatic?',
          options: [
            'No — it has a negative charge, which prevents aromaticity',
            'Yes — the lone pair on the carbanion participates in the ring π system, giving 6 π electrons (4n+2 with n=1)',
            'No — a 5-membered ring cannot be aromatic',
            'It is antiaromatic with 4 π electrons',
          ],
          correct: 1,
          explanation: 'C₅H₅⁻ (cyclopentadienyl anion): the ring has 5 carbons. Four carbons are part of the two double bonds (4 π electrons from two C=C). The fifth carbon (bearing the negative charge) has a lone pair that is in a p orbital perpendicular to the ring — it contributes 2 more π electrons. Total: 6 π electrons = 4(1)+2 → Hückel aromatic. C₅H₅⁻ is exceptionally stable for a carbanion. Its pKa is ~16 (like an alcohol!) — cyclopentadiene is unusually acidic for a hydrocarbon because deprotonation gives the aromatic anion.',
        },
        {
          question: 'Cyclobutadiene (C₄H₄) is extremely unstable and cannot be isolated at room temperature. The best explanation is:',
          options: [
            'Small ring size makes it too strained',
            'It is antiaromatic — planar, cyclic, conjugated, with 4 π electrons (4n, n=1) — highly destabilized',
            'It has too many double bonds for a 4-membered ring',
            'Cyclobutadiene readily polymerizes',
          ],
          correct: 1,
          explanation: 'Cyclobutadiene has 4 π electrons = 4n (n=1) — the antiaromatic count. It is planar, cyclic, and fully conjugated. The 4 π electrons half-fill a pair of degenerate MOs (by Hund\'s rule: two unpaired electrons = triplet diradical), giving a destabilized, highly reactive species. Antiaromaticity adds ~167 kJ/mol of destabilization. Cyclobutadiene exists only at −196°C or less, trapped in a rigid matrix. Ring strain (4-membered ring, 90° angles) adds to the instability but antiaromaticity is the primary cause of extreme instability.',
        },
        {
          question: 'Pyridine (C₅H₅N) has 6 π electrons in the ring. Where does nitrogen\'s lone pair go?',
          options: [
            'Into the π system, contributing 2 of the 6 π electrons',
            'Into a sp² orbital in the plane of the ring — NOT in the π system. The N lone pair is available to act as a base/nucleophile',
            'Forms a separate molecular orbital outside the ring',
            'Pyridine\'s nitrogen lone pair is in an antibonding orbital',
          ],
          correct: 1,
          explanation: 'Pyridine\'s nitrogen is sp² hybridized. The two C–N bonds use two sp² orbitals; one sp² orbital holds the lone pair (in the plane of the ring). The remaining unhybridized p orbital on N contributes one electron to the π system (which already gets one from each ring carbon → 6 total for the 6-membered ring). The in-plane lone pair is NOT part of the π system — it is available as a Lewis base/Brønsted base (pyridine pKa 5.2). Compare pyrrole: N lone pair IS in the π system → pyrrole is aromatic but a MUCH weaker base (pKa ~−3.8 for N protonation).',
        },
      ],
      flashcards: [
        {
          front: 'Hückel\'s rule: four criteria for aromaticity',
          back: '1. CYCLIC: must form a ring\n2. PLANAR: all ring atoms must be sp² hybridized (or have p orbital perpendicular to ring)\n3. FULLY CONJUGATED: continuous overlap of p orbitals around the ring\n4. 4n+2 π ELECTRONS: n = 0 (2 e⁻), 1 (6 e⁻), 2 (10 e⁻), 3 (14 e⁻)...\n\nAll four must be satisfied. Missing any one → nonaromatic.',
        },
        {
          front: 'Aromatic vs antiaromatic vs nonaromatic',
          back: 'Aromatic (4n+2 π e⁻, all 4 criteria met): EXTRA STABLE, resists addition\nAntiaromatic (4n π e⁻, all 4 criteria met): EXTRA UNSTABLE, avoids forming\nNonaromatic: doesn\'t meet all 4 criteria (e.g., not planar, not fully conjugated)\n\nCOT (C₈H₈): has 8 π e⁻ (4n count) but tub-shaped → nonaromatic (escapes antiaromaticity by distorting)',
        },
        {
          front: 'Why is cyclopentadiene unusually acidic (pKa 16) for a hydrocarbon?',
          back: 'Cyclopentadiene (C₅H₆) has two conjugated double bonds + one CH₂ group. Deprotonation of the CH₂ gives cyclopentadienyl anion (C₅H₅⁻) — an aromatic species (6 π electrons, n=1). The aromatic stabilization of the anion dramatically lowers the pKa. Normal sp³ C–H pKa ~50; cyclopentadiene pKa ~16 (similar to water!) — 34 orders of magnitude more acidic because the conjugate base is aromatic.',
        },
        {
          front: 'Pyridine vs pyrrole nitrogen: which is more basic?',
          back: 'Pyridine (pKaH = 5.2): N lone pair in sp² orbital (in-plane) → freely available for protonation. Moderately basic.\n\nPyrrole (pKaH = −3.8): N lone pair IN the π system (contributes 2 of the 6 π e⁻). Protonation removes the lone pair from the π system → loses aromaticity → very unfavorable. Pyrrole is an extremely weak base.\n\nRule: if N lone pair is IN the ring π system → weak base. If N lone pair is OUT of the ring (sp² in-plane) → available for protonation, normal basicity.',
        },
      ],
    },

    // ── Concept 2: Aromatic Heterocycles ─────────────────────────────────────
    {
      id: 'ch12-c2-heterocycles',
      title: 'Aromatic Heterocycles',
      subtitle: 'Pyridine, pyrrole, furan, imidazole, and their special properties',
      estimatedMinutes: 12,
      accentHex: '#a855f7',
      blocks: [
        {
          type: 'text',
          body: 'Heterocyclic compounds contain one or more non-carbon atoms in the ring. Aromatic heterocycles are among the most important structures in biochemistry and pharmacology — purines and pyrimidines (DNA/RNA bases), heme (iron porphyrin), histidine, tryptophan, and the majority of drugs contain aromatic heterocycles. Understanding their aromaticity and reactivity is essential for biochemistry and medicinal chemistry.',
        },
        {
          type: 'table',
          headers: ['Compound', 'Heteroatom', 'Lone pair in π system?', 'Basicity (pKaH)', 'Key properties'],
          rows: [
            ['Pyridine', 'N', 'No (sp² lone pair in ring plane)', '5.2', 'Moderate base; EWG (like NO₂); EAS at C3; nucleophilic N'],
            ['Pyrrole', 'N (NH)', 'YES — N lone pair contributes 2 π e⁻', '−3.8 (essentially non-basic)', 'Weak base; acts as diene in D-A; N–H is acidic (pKa 17); EAS at C2'],
            ['Furan', 'O', 'YES — O lone pair contributes 2 π e⁻', '−5.9 (even weaker base)', 'Diene in Diels-Alder; EAS at C2'],
            ['Thiophene', 'S', 'YES — S lone pair', 'Very weakly basic', 'Most stable 5-membered heterocycle; EAS at C2'],
            ['Imidazole', 'N and NH', 'NH-N is in π system; N= lone pair is in plane', '7.0 (moderate base)', 'Amphoteric; key in enzyme catalysis (histidine); tautomers equivalent'],
            ['Indole', 'NH (fused)', 'YES', 'Very weak base', 'Found in tryptophan; EAS at C3; acidic N–H'],
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Purine & Pyrimidine: The DNA Bases',
          body: 'DNA and RNA bases are aromatic heterocycles:\n\nPyrimidine bases (6-membered ring with 2 N): cytosine (C), thymine (T, DNA only), uracil (U, RNA only)\nPurine bases (fused 5+6 ring): adenine (A), guanine (G)\n\nAll are aromatic by Hückel\'s rule. In Watson-Crick base pairing: A:T (2 H-bonds); G:C (3 H-bonds). The N lone pairs and carbonyl groups serve as H-bond acceptors; N–H and O–H are donors. The aromatic stability keeps the planar ring structure essential for base stacking (π–π interactions stabilizing the double helix).',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Where Do EAS Reactions Occur on Heterocycles?',
          body: '5-membered aromatic heterocycles (pyrrole, furan, thiophene): electrophile prefers C2 (adjacent to heteroatom). The heteroatom lone pair activates the ring and directs to C2 and C4 (like an OH group on benzene). These are MORE reactive than benzene.\n\n6-membered N-heterocycles (pyridine): the sp² N acts as an EWG (like –NO₂) — it withdraws electrons from the ring. EAS is sluggish and occurs preferentially at C3 (the β position, least deactivated). Pyridine is LESS reactive than benzene toward EAS but more reactive toward NAS (nucleophilic addition-elimination) — N accepts nucleophilic addition at C4.',
        },
      ],
      mcqs: [
        {
          question: 'Why is imidazole (pKaH = 7.0) a useful catalytic group in enzyme active sites?',
          options: [
            'Imidazole is a strong acid and can protonate any substrate',
            'The pKa of 7.0 is near physiological pH — imidazole can exist as both protonated (acid) and neutral (base) forms, enabling it to shuttle protons in enzyme mechanisms',
            'Imidazole has two nitrogen atoms that both act as Lewis acids',
            'Imidazole is stable due to its aromatic ring, making it an ideal leaving group',
          ],
          correct: 1,
          explanation: 'Imidazole\'s pKaH = 7.0 means it is 50% protonated at pH 7 (physiological). This is perfectly tuned for enzyme catalysis: one form (neutral, lone pair on N=) acts as a nucleophile/base to accept a proton; the protonated form (–N⁺H–) acts as an acid to donate a proton to a substrate. The histidine residue in serine proteases (chymotrypsin, trypsin) uses this dual-function imidazole to shuttle a proton from serine to the substrate during peptide bond cleavage. No other natural amino acid has this property.',
        },
        {
          question: 'Furan undergoes electrophilic aromatic substitution most readily at which position?',
          options: [
            'C1 (the oxygen carbon — it has no H)',
            'C2 (adjacent to oxygen)',
            'C3 (adjacent to a ring carbon far from O)',
            'Furan doesn\'t undergo EAS — the oxygen makes it too reactive for radical reactions only',
          ],
          correct: 1,
          explanation: 'Furan (5-membered ring with O) is activated toward EAS by the oxygen lone pairs (oxygen is an EDG, similar to OH on benzene — ortho/para director). In furan, C2 and C5 are equivalent (adjacent to O), as are C3 and C4. The oxygen activates C2 most strongly (like ortho position on benzene). The intermediate sigma complex (arenium ion) from C2 attack is more stable (more resonance structures with the O lone pair) than from C3 attack. So EAS occurs preferentially at C2. Furan is more reactive than benzene toward EAS, but less stable — at high temperatures it acts as a diene in Diels-Alder.',
        },
        {
          question: 'A student claims that pyridine\'s nitrogen lone pair contributes to the aromatic π system. Are they correct?',
          options: [
            'Correct — all nitrogen lone pairs in heteroaromatic rings contribute to the π system',
            'Incorrect — pyridine\'s N is sp² hybridized, and its lone pair is in an sp² orbital in the ring plane, NOT in the p orbital perpendicular to the ring. The p orbital on N contributes ONE electron to the 6 π electron system (the lone pair does not)',
            'Correct — pyridine has 8 π electrons total including the lone pair',
            'Incorrect — the lone pair is fully removed from the ring by resonance delocalization',
          ],
          correct: 1,
          explanation: 'Pyridine\'s N is sp² hybridized (like every other C in the ring). sp² hybridization gives: 3 sp² orbitals for bonding (2 C–N bonds + 1 lone pair IN THE RING PLANE) and 1 p orbital perpendicular to the ring. The p orbital contributes ONE electron to the π system (total 6 electrons = 6 atoms × 1 e⁻ each). The in-plane sp² lone pair is separate — not part of the aromatic π system. This is why pyridine is basic (lone pair available) but pyrrole is not (lone pair IS in the π system).',
        },
      ],
      flashcards: [
        {
          front: 'Pyridine vs pyrrole: key differences',
          back: 'Pyridine: N sp², lone pair in ring plane (not π), moderate base (pKaH 5.2), EWG (deactivates ring), EAS at C3, less reactive than benzene\n\nPyrrole: N sp², lone pair IN π system (provides 2 of 6 π e⁻), very weak base (pKaH −3.8), EDG (activates ring), EAS at C2, more reactive than benzene toward EAS',
        },
        {
          front: 'Five-membered aromatic heterocycles: pyrrole, furan, thiophene',
          back: 'All aromatic (lone pair on heteroatom contributes 2 of 6 π e⁻)\nAll EAS at C2 (heteroatom activates adjacent position)\nAll more reactive than benzene in EAS\n\nRelative stability: thiophene > pyrrole > furan\nRelative Diels-Alder reactivity as diene: furan >> pyrrole > thiophene (furan most "diene-like" due to O lone pair)',
        },
        {
          front: 'DNA bases: which are purines and which are pyrimidines?',
          back: 'Purines (6-membered + 5-membered fused N heterocycle): Adenine (A) and Guanine (G)\nPyrimidines (6-membered ring with 2 N): Cytosine (C), Thymine (T, DNA), Uracil (U, RNA)\n\nBase pairs: A:T (2 H-bonds); G:C (3 H-bonds)\nAll bases are aromatic → planar → stack in DNA double helix via π–π interactions',
        },
      ],
    },
  ],
}
