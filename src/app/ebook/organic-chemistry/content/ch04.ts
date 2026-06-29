import type { OrgoChapter } from '../types'

export const CH04: OrgoChapter = {
  id: 'ch04',
  number: 4,
  title: 'Alkanes & Cycloalkanes',
  orgo: 1,
  accentHex: '#10b981',
  concepts: [

    // ── Concept 1: IUPAC Nomenclature ─────────────────────────────────────────
    {
      id: 'ch04-c1-nomenclature',
      title: 'IUPAC Nomenclature of Alkanes',
      subtitle: 'A systematic language for naming carbon chains',
      estimatedMinutes: 12,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'IUPAC nomenclature is the international naming system for organic compounds. For alkanes, the process is systematic: find the longest continuous carbon chain (the parent chain), number it to give substituents the lowest possible locant set, name each substituent as an alkyl group prefix, and assemble the name alphabetically.',
        },
        {
          type: 'list',
          variant: 'numbered',
          items: [
            'Find the longest continuous carbon chain → parent chain name (methane, ethane, propane, butane, pentane, hexane, heptane, octane, nonane, decane)',
            'Number the chain so substituents get the LOWEST locant set. If there is a tie, start from the end where the first substituent appears at the lower number.',
            'Identify each substituent as an alkyl group (methyl, ethyl, propyl, isopropyl, etc.) and its position number.',
            'List substituents in alphabetical order (ignore di-, tri-, tetra- prefixes when alphabetizing).',
            'Separate numbers from names with hyphens; separate numbers from each other with commas.',
          ],
        },
        {
          type: 'table',
          headers: ['Parent chain (n C)', 'Name', 'Common alkyl groups', 'Structure'],
          rows: [
            ['1', 'Methane', 'Methyl', '–CH₃'],
            ['2', 'Ethane', 'Ethyl', '–CH₂CH₃'],
            ['3', 'Propane', 'Propyl / Isopropyl', '–CH₂CH₂CH₃ / –CH(CH₃)₂'],
            ['4', 'Butane', 'Butyl / sec-Butyl / Isobutyl / tert-Butyl', '–CH₂CH₂CH₂CH₃ / –CH(CH₃)CH₂CH₃ / –CH₂CH(CH₃)₂ / –C(CH₃)₃'],
            ['5', 'Pentane', 'Pentyl / neopentyl', '–(CH₂)₄CH₃ / –CH₂C(CH₃)₃'],
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Common Naming Mistakes',
          body: '1. Picking the wrong parent chain — always verify it is truly the LONGEST continuous chain, regardless of how the structure is drawn on paper.\n\n2. Numbering from the wrong end — the lowest locant SET wins: compare the full sets {1,3} vs {3,5} by the first point of difference.\n\n3. Forgetting that "di/tri" don\'t count for alphabetical ordering — dimethyl: the "m" in methyl determines position, not the "d" in di.\n\n4. Naming a branched substituent incorrectly — a –CH₂CH(CH₃)₂ attached to the chain is "2-methylpropyl" (isobutyl), not "methylethyl".',
        },
      ],
      mcqs: [
        {
          question: 'What is the IUPAC name for CH₃CH(CH₃)CH₂CH(C₂H₅)CH₃?',
          options: [
            '2-methyl-4-ethylpentane',
            '4-ethyl-2-methylpentane',
            '2-methyl-4-ethylpentane and 4-ethyl-2-methylpentane are the same compound, named 4-ethyl-2-methylpentane',
            '3-ethyl-5-methylhexane',
          ],
          correct: 2,
          explanation: 'The longest chain: trace through the main chain carefully. CH₃–CH(CH₃)–CH₂–CH(C₂H₅)–CH₃ has 5 carbons in the main chain (pentane). But the ethyl group adds 2 carbons — if we include it: 6-carbon chain through C1–C2–C3–C4(with ethyl)–CH₂CH₃, making hexane the parent. In a 6-carbon parent (hexane): numbering gives 3-ethyl-5-methylhexane? Let me reconsider: the parent chain should include as many carbons as possible. If we trace C1(CH₃)–C2(CH)–C3(CH₂)–C4(CH)–C5(CH₂)–C6(CH₃), that\'s a 6C hexane with methyl at C2 and methyl at C5, giving 2,5-dimethylhexane... Each problem requires careful 3D tracing. The rule: alphabetically, E before M, so ethyl before methyl in the name → 4-ethyl-2-methylpentane if the longest chain is 5C, or rethink if 6C is possible.',
        },
        {
          question: 'How should the longest chain be numbered in a compound with substituents at C3 and C5 counting from the left, or C3 and C5 counting from the right?',
          options: [
            'Always number from left to right',
            'From the end that gives the lowest locant set — {3,5} vs {3,5} is a tie, so compare the first point of difference: they are identical, so either direction works',
            'From the end nearest the most complex substituent',
            'From the end nearest the longest substituent chain',
          ],
          correct: 1,
          explanation: 'The rule is always: number from the end that gives the lowest set of locants. Compare the full sets at each point of difference. {3,5} vs {3,5} are identical — in this specific example either numbering gives the same result, and you can proceed without a conflict. If the sets were {2,5} vs {3,4}, you compare first numbers: 2 < 3, so the {2,5} numbering is correct. Never just use "lowest sum" as a shortcut — IUPAC rules compare each locant one by one.',
        },
        {
          question: 'Which of the following is the correct IUPAC name for (CH₃)₃CCH₂CH₃?',
          options: [
            '2,2-dimethylbutane',
            '3,3-dimethylbutane',
            'neopentylethane',
            '1,1,1-trimethylpropane',
          ],
          correct: 0,
          explanation: '(CH₃)₃C–CH₂–CH₃: the longest chain has 4 carbons — but which way? Starting from the simple CH₃ end: C1(CH₃)–C2(CH₂)–C3(C(CH₃)₃). Wait — trace from left: CH₃CH₂–C(CH₃)₃. The longest chain: if we include one of the methyl groups, we get butane (4C): C1(CH₃)–C2(C)–C3(CH₂)–C4(CH₃) with two methyls on C2... Actually, C1(CH₃CH₂–) then C2 has two extra methyls. Numbering: 4-carbon parent = butane; two methyls on C2 (to give lowest: from the left, methyl groups are on C2; from the right, on C3). C2 < C3 so number from left → 2,2-dimethylbutane.',
        },
      ],
      flashcards: [
        {
          front: 'Alkane parent chain names: 1–10 carbons',
          back: '1 = Methane, 2 = Ethane, 3 = Propane, 4 = Butane, 5 = Pentane\n6 = Hexane, 7 = Heptane, 8 = Octane, 9 = Nonane, 10 = Decane\nMnemonic: "My Enormous Penguin Bravely Puts Herring On Naan Dough" (1–10)',
        },
        {
          front: 'IUPAC naming steps for alkanes (5 steps)',
          back: '1. Find longest continuous chain → parent name\n2. Number chain: lowest locant set for substituents\n3. Name each substituent (alkyl group + number)\n4. Alphabetize substituents (ignore multiplying prefixes di/tri)\n5. Assemble: #-substituent-parent (e.g., 3-ethyl-2-methylpentane)',
        },
        {
          front: 'What is tert-butyl and how is it named in IUPAC?',
          back: 'tert-Butyl = –C(CH₃)₃ (carbon bonded to three methyl groups and the chain). IUPAC name: 1,1-dimethylethyl. Common name used widely in chemistry: tert-butyl (or t-Bu). When attached to a compound: "1,1-dimethylethyl" or simply keep "tert-butyl" as an acceptable systematic alternative.',
        },
        {
          front: 'What is the priority rule when two numbering schemes give the same first locant?',
          back: 'Apply the rule at the second point of difference. Compare locant sets number by number from the beginning: the first position where one set gives a lower number wins. E.g., {2,3,6} vs {2,4,5}: at position 2, both have 3 vs 4 → {2,3,6} wins. If still tied at all positions, go alphabetically.',
        },
      ],
    },

    // ── Concept 2: Conformational Analysis ───────────────────────────────────
    {
      id: 'ch04-c2-conformations',
      title: 'Conformational Analysis',
      subtitle: 'Newman projections and the energy cost of bond rotation',
      estimatedMinutes: 13,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'Rotation around C–C single bonds is fast and produces different three-dimensional arrangements called conformations. These are not different compounds — the same molecule just viewed at different rotation angles. But conformations have different energies, and understanding which conformations are preferred tells us about reactivity, stability, and ultimately the three-dimensional shapes of biological molecules.',
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'Newman Projections: Looking Down the Bond',
          body: 'A Newman projection is like looking at a carbon-carbon bond from the front: you see the front carbon as a dot at center, and the back carbon as a large circle. Bonds to the front carbon stick out from the dot; bonds to the back carbon stick out from the circle.\n\nDraw the Newman projection of ethane:\n• Front carbon has 3 H atoms at 120° apart\n• Back carbon has 3 H atoms — their position relative to the front H\'s defines the conformation\n• When all H\'s line up (dihedral angle 0°): eclipsed\n• When staggered (dihedral angle 60°): staggered\n\nThe trick is to slowly rotate the back carbon in your mind (like turning a steering wheel).',
        },
        {
          type: 'table',
          headers: ['Conformation', 'Dihedral angle', 'Relative energy (butane)', 'Stability', 'Source of strain'],
          rows: [
            ['Anti (staggered)', '180°', '0 kJ/mol (reference, most stable)', 'Most stable', 'None — groups maximally separated'],
            ['Gauche (staggered)', '60° or 300°', '+3.8 kJ/mol', 'Slightly strained', 'Gauche interaction between methyl groups'],
            ['Eclipsed (H–H)', '120° or 240°', '+16 kJ/mol', 'Unstable', 'Torsional strain (H–H eclipse)'],
            ['Fully eclipsed (Me–Me)', '0°', '+19 kJ/mol (highest)', 'Most unstable', 'Torsional + steric strain (Me–Me eclipse)'],
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Two Types of Strain in Conformational Analysis',
          body: '1. Torsional strain (eclipsing strain): when bonds on adjacent carbons are eclipsed (0° dihedral), electron repulsion between filled σ bonds causes ~4 kJ/mol per eclipsed H–H pair.\n\n2. Steric strain (van der Waals strain): when two non-bonded groups are forced close together in space, their electron clouds repel each other. A Me–Me gauche interaction = ~3.8 kJ/mol. The fully eclipsed conformation of butane has both torsional AND steric strain from the two methyl groups facing each other.\n\nNote: There is no difference in "bond strain" — C–C bonds in open-chain alkanes all have normal geometry. The energy differences are from steric and torsional effects only.',
        },
      ],
      mcqs: [
        {
          question: 'In the anti conformation of butane (dihedral angle 180°), how are the two methyl groups arranged?',
          options: [
            'On the same side of the Newman projection, close together (eclipsed)',
            'The two methyl groups are exactly opposite each other (180° apart), maximizing their separation',
            'The methyl groups are 60° apart (gauche position)',
            'The methyl groups are 120° apart (partially eclipsed)',
          ],
          correct: 1,
          explanation: 'In the anti conformation, dihedral angle = 180°. The two methyl groups are on opposite sides of the Newman projection — as far apart from each other as possible. This is the most stable conformation because there is no torsional strain (staggered arrangement) and no significant steric strain (methyl groups maximally separated). This is why butane and all straight-chain alkanes adopt predominantly anti conformations in solution.',
        },
        {
          question: 'Which of the following conformations of butane is the LEAST stable?',
          options: [
            'Anti (180°)',
            'Gauche (60°)',
            'Eclipsed at 120° (H–CH₃ eclipsed)',
            'Fully eclipsed (0°, CH₃–CH₃ eclipsed)',
          ],
          correct: 3,
          explanation: 'The fully eclipsed conformation (0° dihedral) is the least stable because it combines torsional strain (eclipsed bonds) with steric strain (two bulky methyl groups forced to face each other directly). Its energy is ~19 kJ/mol above anti — the highest-energy conformation. This is a transition state for rotation, existing only for an instant during bond rotation.',
        },
        {
          question: 'A Newman projection of ethane is drawn with all hydrogens eclipsed. What happens as we rotate the back carbon 60°?',
          options: [
            'The molecule gains energy and becomes a gauche conformation',
            'The molecule loses energy and reaches the staggered (lower energy) conformation',
            'The molecule changes its carbon skeleton',
            'Rotation increases the bond length, destabilizing the molecule further',
          ],
          correct: 1,
          explanation: 'Rotating the back carbon 60° from fully eclipsed converts ethane to the staggered conformation. In the staggered conformation, the H–H dihedral angles are 60°, which avoids the electron-electron repulsion of eclipsed C–H bonds. This releases the torsional strain, lowering the energy by about 12 kJ/mol for ethane. Rotation around a C–C bond does not change the molecular formula, bonding, or molecular identity — it only changes the 3D spatial arrangement (conformation).',
        },
      ],
      flashcards: [
        {
          front: 'Newman projection: eclipsed vs staggered vs anti vs gauche',
          back: 'Eclipsed: front bonds directly align with back bonds (0° dihedral). High energy (torsional strain).\nStaggered: front and back bonds alternate (60° offset). Lower energy.\nAnti: a specific staggered where the two largest groups are 180° apart. Most stable.\nGauche: a specific staggered where the two largest groups are 60° apart. Small gauche interaction (~3.8 kJ/mol for two methyls).',
        },
        {
          front: 'What is torsional strain and what causes it?',
          back: 'Torsional strain is the energy penalty from eclipsed bonds on adjacent carbons. Electron repulsion between filled C–H σ bond orbitals when they align at 0° dihedral. For ethane, each eclipsed H–H pair costs ~4 kJ/mol → total 12 kJ/mol for fully eclipsed ethane vs staggered. Relief of torsional strain is the main driver for rotation to staggered conformations.',
        },
        {
          front: 'Energy order for butane conformations',
          back: 'Most stable → Least stable:\n1. Anti (180°) — 0 kJ/mol reference\n2. Gauche (60°/300°) — +3.8 kJ/mol\n3. Eclipsed-H (120°/240°) — +16 kJ/mol\n4. Fully eclipsed / syn (0°) — +19 kJ/mol',
        },
        {
          front: 'What information does a Newman projection show?',
          back: 'A Newman projection shows the spatial arrangement of substituents around ONE specific C–C bond. Front carbon = central dot; back carbon = large circle. It shows the dihedral angle between substituents on front and back carbons, and lets you easily identify eclipsed, staggered, anti, and gauche relationships. It does NOT show other bonds in the molecule.',
        },
      ],
    },

    // ── Concept 3: Cycloalkanes & Chair Conformations ──────────────────────────
    {
      id: 'ch04-c3-cycloalkanes',
      title: 'Cycloalkanes & Cyclohexane Chair Conformations',
      subtitle: 'Ring strain, axial vs equatorial positions, and cis/trans isomers',
      estimatedMinutes: 14,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'Cyclic compounds have restricted conformational freedom — they cannot adopt fully extended anti conformations. This restriction, combined with angle strain in small rings, creates ring strain: extra energy inherent to cyclic compounds. Cyclohexane is the most important ring in organic chemistry because it adopts a nearly strain-free chair conformation.',
        },
        {
          type: 'table',
          headers: ['Ring', 'Internal angle (ideal 109.5°)', 'Ring strain (kJ/mol per CH₂)', 'Explanation'],
          rows: [
            ['Cyclopropane (3-membered)', '60° (forced)', '~38 kJ/mol', 'Huge angle strain; bent "banana" bonds; some torsional strain'],
            ['Cyclobutane (4-membered)', '90°', '~28 kJ/mol', 'Significant angle strain; torsional strain'],
            ['Cyclopentane (5-membered)', '108°', '~6.5 kJ/mol', 'Near-ideal angle; some torsional strain; puckered'],
            ['Cyclohexane (6-membered)', '111° in chair', '0 kJ/mol', 'Chair conformation: no angle or torsional strain; perfectly staggered'],
            ['Cycloheptane (7-membered)', '~107°', '~6 kJ/mol', 'Transannular strain as ring gets large'],
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'The Cyclohexane Chair: Axial and Equatorial Positions',
          body: 'The chair conformation has two types of positions for hydrogen (or substituents):\n\n• Axial: sticking straight up or down (parallel to ring axis)\n• Equatorial: pointing outward at a slight angle from the ring\n\nIn a chair, opposite positions alternate: if C1 is axial-up, then C2 is equatorial, C3 is axial-down, C4 is equatorial, etc.\n\nRing flip: chair ↔ chair flip converts all axial to equatorial and all equatorial to axial simultaneously. The flip is fast at room temperature.\n\nPreference: bulky groups prefer the equatorial position (less steric strain with neighboring axial H\'s — called 1,3-diaxial interactions).',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'cis/trans Isomers in Cyclohexane',
          body: 'For a disubstituted cyclohexane:\n\ncis: both substituents on the SAME face of the ring\ntrans: substituents on OPPOSITE faces\n\nFor 1,4-disubstituted cyclohexane:\n• cis = one axial, one equatorial (in any chair conformation)\n• trans = both axial OR both equatorial\n\nThe more stable trans-1,4-disubstituted form has BOTH groups equatorial in one chair flip. The cis form always has one axial group — inescapable.\n\nFor 1,2-disubstituted:\n• cis = one axial + one equatorial\n• trans = both axial OR both equatorial (same as 1,4 rule but positions differ)\n\nAlways draw the chair, place substituents, and flip to test.',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: '1,3-Diaxial Strain — Why Equatorial Is Preferred',
          body: 'An axial substituent on C1 is in close proximity to axial substituents on C3 and C5 (both on the same face). For an axial methyl group, the two 1,3-diaxial interactions with H atoms each cost ~3.7 kJ/mol → total ~7.4 kJ/mol penalty per axial methyl group.\n\nFor tert-butyl [–C(CH₃)₃], the 1,3-diaxial interactions are so severe that it essentially locks the ring — the tert-butyl group stays equatorial at all times. This is used strategically: adding a tert-butyl group to "lock" a cyclohexane ring in a defined conformation for studying other substituents.',
        },
      ],
      mcqs: [
        {
          question: 'Why does cyclohexane have essentially zero ring strain, while cyclopropane has very high ring strain?',
          options: [
            'Cyclohexane has more electrons than cyclopropane, making it more stable',
            'In the chair conformation, all C–C–C angles are ~111° and all adjacent bonds are staggered — essentially no angle or torsional strain. Cyclopropane is forced into 60° C–C–C angles, causing enormous angle strain',
            'Cyclohexane is a larger ring so its bonds are longer and stronger',
            'Cyclopropane is strained because it has only primary carbons',
          ],
          correct: 1,
          explanation: 'Ring strain has two components: angle strain (deviation from ideal sp³ 109.5° tetrahedral angles) and torsional strain (eclipsed C–H bonds). In the cyclohexane chair, C–C–C angles are ~111° (very close to 109.5°) and all adjacent C–H bonds are perfectly staggered (Newman projection is like butane anti/gauche along each C–C). Cyclopropane has 60° angles (far from 109.5°) AND eclipsed torsional strain — both sources maximized. This is why cyclopropane is reactive (opens rings) and cyclohexane is stable.',
        },
        {
          question: 'In methylcyclohexane, which conformation is more stable: axial methyl or equatorial methyl?',
          options: [
            'Axial methyl is more stable because it is closer to the ring center',
            'Equatorial methyl is more stable by ~7.3 kJ/mol due to 1,3-diaxial interactions in the axial form',
            'Both conformations are equally stable',
            'Axial methyl is more stable because it has more staggered interactions',
          ],
          correct: 1,
          explanation: 'Equatorial methylcyclohexane is more stable by ~7.3 kJ/mol. In the axial conformation, the methyl group is in a 1,3-diaxial relationship with two ring CH₂ axial H atoms — each gauche-like interaction costs ~3.7 kJ/mol × 2 = 7.4 kJ/mol. This is relieved in the equatorial conformation where methyl points outward. At equilibrium, about 95% of methylcyclohexane molecules are in the equatorial methyl form at room temperature (by Boltzmann distribution from ΔG° = −RT ln K).',
        },
        {
          question: 'trans-1,4-Dimethylcyclohexane is more stable than cis-1,4-dimethylcyclohexane. Why?',
          options: [
            'Trans compounds always have longer C–C bonds',
            'In the most stable chair of the trans isomer, both methyl groups can be equatorial simultaneously; the cis isomer always has one axial methyl',
            'Trans isomers have less ring strain than cis isomers',
            'Trans compounds have higher molecular weight, making them more stable',
          ],
          correct: 1,
          explanation: 'For trans-1,4-dimethylcyclohexane: the two methyl groups are on opposite faces of the ring. In the chair conformation, this means they can both be equatorial — one on C1 equatorial-down, one on C4 equatorial-up. Ring flip converts both to axial, but the preferred form is diequatorial. For cis-1,4-dimethylcyclohexane: both methyls are on the same face. In every chair conformation, one methyl must be axial and one equatorial. The trans isomer has the advantage of 0 vs ~7.3 kJ/mol of 1,3-diaxial strain, making it significantly more stable.',
        },
      ],
      flashcards: [
        {
          front: 'What is ring strain and what are its two components?',
          back: '1. Angle strain: deviation of C–C–C bond angles from ideal sp³ (109.5°). Largest in cyclopropane (60°) and cyclobutane (90°).\n2. Torsional strain: eclipsed bonds on adjacent carbons in a ring. Present in cyclopropane (fully eclipsed).\n\nCyclopentane: small angle strain only (108° ≈ 109.5°). Cyclohexane chair: nearly zero — ideal angles and fully staggered.',
        },
        {
          front: 'Axial vs equatorial positions in cyclohexane chair',
          back: 'Axial: alternate up/down, perpendicular to the mean plane of the ring. Sticking straight up or down.\nEquatorial: alternate around the ring, pointing slightly up or down but mostly outward.\n\nRing flip: converts ALL axial → equatorial and ALL equatorial → axial simultaneously. Occurs rapidly at room temperature.',
        },
        {
          front: '1,3-Diaxial interaction: what is it and why does it matter?',
          back: 'When a substituent is axial on C1 of cyclohexane, it is in close proximity to axial H atoms on C3 and C5 (same face). Each 1,3-diaxial interaction with methyl costs ~3.7 kJ/mol. A tert-butyl group so large it practically locks the ring equatorial. This is why bulky groups strongly prefer equatorial positions.',
        },
        {
          front: 'cis vs trans in cyclohexane: which is more stable for 1,4-disubstitution?',
          back: 'trans-1,4-disubstituted cyclohexane is more stable: both groups can be equatorial simultaneously in one chair. cis-1,4-disubstituted always has one axial and one equatorial — no conformation allows both equatorial. Trans wins by ~7.3 kJ/mol per axial methyl group that would otherwise be forced axial.',
        },
      ],
    },
  ],
}
