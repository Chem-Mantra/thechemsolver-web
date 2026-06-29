import type { OrgoChapter } from '../types'

export const CH01: OrgoChapter = {
  id: 'ch01',
  number: 1,
  title: 'Bonding & Molecular Structure',
  orgo: 1,
  accentHex: '#10b981',
  concepts: [

    // ── Concept 1: Atomic Orbitals & Hybridization ────────────────────────────
    {
      id: 'ch01-c1-hybridization',
      title: 'Atomic Orbitals & Hybridization',
      subtitle: 'How orbitals mix to give organic molecules their shapes',
      estimatedMinutes: 15,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'Organic chemistry is the chemistry of carbon, and carbon\'s versatility — single bonds, double bonds, triple bonds, chains, rings, flat molecules, twisted molecules — all comes down to one idea: orbital hybridization. Hybridization is the mathematical mixing of atomic orbitals to form new, equivalent hybrid orbitals that correctly predict bond angles and molecular geometry. Without it, we could not explain why methane is tetrahedral or why ethene is flat.',
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'Hybridization Is Like Mixing Paint',
          body: 'Mix one pot of blue paint with three pots of yellow and you don\'t get one blue pot and three yellow ones — you get four identical green pots. sp³ hybridization is exactly this: one 2s orbital and three 2p orbitals combine to give four equivalent sp³ hybrid orbitals. None is purely s or purely p; all four are identical in energy and shape.',
        },
        {
          type: 'text',
          body: 'Carbon\'s ground-state configuration is 1s²2s²2p², which would predict only 2 bonds (from the 2 unpaired p electrons). But carbon almost always forms 4 bonds. The resolution: one electron is promoted from 2s to the empty 2p orbital (giving 2s¹2p³), and then all four singly-occupied orbitals hybridize. The energy cost of promotion is more than recovered by forming two additional bonds. Three hybridization states are central to all of organic chemistry:',
        },
        {
          type: 'table',
          headers: ['Hybridization', 'Orbitals mixed', 'Geometry', 'Bond angles', 'Unhybridized p orbitals', 'Example'],
          rows: [
            ['sp³', '1s + 3p → 4 hybrid', 'Tetrahedral', '109.5°', '0', 'CH₄, C₂H₆, amines, alcohols'],
            ['sp²', '1s + 2p → 3 hybrid', 'Trigonal planar', '120°', '1 (forms π bond)', 'C₂H₄, benzene, carbonyls'],
            ['sp', '1s + 1p → 2 hybrid', 'Linear', '180°', '2 (forms 2 π bonds)', 'C₂H₂, CO₂, nitriles'],
          ],
        },
        {
          type: 'text',
          body: 'An sp³ carbon has four equivalent orbitals pointing toward the corners of a regular tetrahedron (109.5° angles). Each forms a σ bond by end-on overlap with another orbital — a covalent bond that allows free rotation around the bond axis. In methane, all four C–H bonds are sp³–1s overlaps; in ethane, the C–C bond is sp³–sp³ overlap.\n\nAn sp² carbon uses three hybrids for σ bonds in a plane at 120° to each other, leaving one unhybridized p orbital perpendicular to the plane. When two adjacent sp² carbons are present, their parallel p orbitals overlap sideways to form a π bond — the second bond of a double bond. The π bond locks the geometry: the groups attached to each doubly-bonded carbon cannot rotate relative to one another, which is why cis and trans isomers of alkenes are distinct compounds.\n\nAn sp carbon (found in alkynes and other triply-bonded systems) has two hybrids pointing 180° apart for σ bonds, and two perpendicular unhybridized p orbitals available for two π bonds. This gives a linear geometry and the characteristic triple bond.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'σ Bonds vs π Bonds — The Fundamental Distinction',
          body: 'Every single bond is a σ bond (end-on overlap, cylindrically symmetric). Every double bond = 1σ + 1π. Every triple bond = 1σ + 2π.\n\nσ bonds allow free rotation. π bonds do NOT — the sideways p-orbital overlap breaks if the bond is twisted, which is why alkenes have cis/trans isomers and proteins have rigid peptide bonds.\n\nS-character matters: sp orbitals have 50% s-character, sp² have 33%, sp³ have 25%. More s-character = electrons held closer to nucleus = more electronegative = more acidic C–H bond.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Count Electron Groups — Hybridization in 2 Seconds',
          body: 'Count the number of electron groups around any heavy atom (atoms bonded + lone pairs):\n  • 4 groups → sp³ (tetrahedral)\n  • 3 groups → sp² (trigonal planar)\n  • 2 groups → sp (linear)\n\nA double bond counts as ONE electron group. A triple bond counts as ONE. Lone pairs count as groups for hybridization (but not for molecular shape). Apply this to every non-hydrogen atom in a molecule and you instantly know its geometry.',
        },
      ],
      mcqs: [
        {
          question: 'What is the hybridization of the central carbon in allene (H₂C=C=CH₂)?',
          options: ['sp³', 'sp²', 'sp', 'The central carbon cannot be hybridized'],
          correct: 2,
          explanation: 'The central carbon of allene is bonded to two other carbons via double bonds and has no bonds to hydrogen. It has 2 electron groups (two σ bonds — one to each terminal carbon), giving sp hybridization and a 180° geometry. This linear arrangement means the two terminal CH₂ planes are perpendicular to each other, making allene a chiral molecule with no stereocenters — a fascinating consequence of the sp geometry.',
        },
        {
          question: 'Nitrogen in a primary amine (R–NH₂) has which hybridization and molecular geometry?',
          options: ['sp, linear', 'sp², trigonal planar', 'sp³, trigonal pyramidal', 'sp³d, square pyramidal'],
          correct: 2,
          explanation: 'Nitrogen has 3 bonds + 1 lone pair = 4 electron groups → sp³ hybridization. The molecular geometry (atoms only) is trigonal pyramidal, like ammonia. Bond angles are ~107° rather than 109.5° because the lone pair occupies more space than a bonding pair and compresses the H–N–H angles. The lone pair is in a specific sp³ orbital, making amines nucleophilic at nitrogen.',
        },
        {
          question: 'In the carbonate ion (CO₃²⁻), what is the hybridization of carbon and the expected C–O bond length relative to a C–O single bond?',
          options: [
            'sp³; longer than a C–O single bond due to extra electrons',
            'sp²; shorter than a C–O single bond due to partial π character',
            'sp; equal to a C=O double bond length',
            'sp³; shorter than a C=O double bond',
          ],
          correct: 1,
          explanation: 'Carbon in CO₃²⁻ has 3 σ bonds (one to each oxygen) = 3 electron groups → sp². The delocalized π system spreads one π bond over all three C–O bonds via resonance. Each C–O bond has one-third double bond character, making all three equivalent and shorter than a pure C–O single bond (~1.43 Å) but longer than a pure C=O double bond (~1.23 Å). The measured value is ~1.29 Å.',
        },
      ],
      flashcards: [
        {
          front: 'What hybridization and geometry does a carbon with four single bonds have?',
          back: 'sp³ hybridization → tetrahedral geometry → bond angles 109.5°. Examples: methane (CH₄), all alkane carbons, the central carbon in neopentane.',
        },
        {
          front: 'What two types of bonds make up a C=C double bond?',
          back: 'One σ bond (end-on sp²–sp² orbital overlap) + one π bond (sideways p-orbital overlap above and below the bond axis). The σ bond is stronger; the π bond is what breaks in addition reactions.',
        },
        {
          front: 'Why can an sp³ carbon NOT form a π bond?',
          back: 'sp³ carbon has no unhybridized p orbital remaining — all four orbitals are used as σ bonds. A π bond requires a pure, unhybridized p orbital for sideways overlap with an adjacent p orbital.',
        },
        {
          front: 'How does hybridization affect the acidity of C–H bonds?',
          back: 'sp C–H bonds are most acidic (pKₐ ~25), sp² next (~44), sp³ least acidic (~50). More s-character = electrons held closer to nucleus = more electronegative carbon = more stable carbanion after deprotonation.',
        },
        {
          front: 'Bond angles for sp³, sp², and sp carbon?',
          back: 'sp³ = 109.5° (tetrahedral)\nsp² = 120° (trigonal planar)\nsp = 180° (linear)\n\nActual angles deviate slightly when lone pairs are present (lone pairs occupy more space than bonding pairs).',
        },
      ],
    },

    // ── Concept 2: Lewis Structures & Formal Charge ───────────────────────────
    {
      id: 'ch01-c2-lewis',
      title: 'Lewis Structures & Formal Charge',
      subtitle: 'The bookkeeping system every organic mechanism is built on',
      estimatedMinutes: 13,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'Lewis structures are the single most important drawing tool in organic chemistry. Every mechanism — every curved arrow you will ever draw — is a transformation from one Lewis structure to another. Lewis structures tell you which atoms are bonded, how many lone pairs each atom carries, and whether any atom bears a formal charge. Mastering them is not optional: it is the foundation of the entire subject.',
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'Formal Charge Is a Financial Balance Sheet',
          body: 'Imagine electrons as money. Each atom starts with a fixed "income" (its valence electrons). In a molecule, bonds are shared expenses — each bonding atom gets half the bond\'s electrons. Lone pairs are private savings. Formal charge = what the atom is owed (valence electrons) minus what it actually holds (lone pairs + half the bonding electrons). Positive formal charge = the atom gave away more than it received.',
        },
        {
          type: 'formula',
          latex: '\\text{FC} = V - L - \\dfrac{B}{2}',
          display: true,
          caption: 'V = valence electrons of the neutral atom, L = lone pair electrons on this atom, B = total bonding electrons to this atom',
        },
        {
          type: 'text',
          body: 'For organic chemists, the shortcut is memorizing the neutral-atom defaults — the bonding and lone pair count that gives FC = 0. Any deviation immediately signals a formal charge without calculation:',
        },
        {
          type: 'table',
          headers: ['Atom', 'Neutral (FC = 0)', 'FC = +1', 'FC = −1'],
          rows: [
            ['C', '4 bonds, 0 lone pairs', '3 bonds, 0 LP (carbocation)', '3 bonds, 1 LP (carbanion)'],
            ['N', '3 bonds, 1 lone pair', '4 bonds, 0 LP (ammonium-type)', '2 bonds, 2 LP'],
            ['O', '2 bonds, 2 lone pairs', '3 bonds, 1 LP (hydronium-type)', '1 bond, 3 LP (alkoxide)'],
            ['H', '1 bond, 0 lone pairs', '—', '0 bonds, 1 LP (hydride)'],
          ],
        },
        {
          type: 'list',
          variant: 'numbered',
          items: [
            'Count total valence electrons: sum all atoms\' valence e⁻, then subtract 1 for each unit of positive charge, add 1 for each unit of negative charge.',
            'Arrange the atoms in their connectivity (C always chains/branches, H always terminal with exactly 1 bond).',
            'Connect all atoms with single bonds. Subtract 2 electrons per bond from the total.',
            'Distribute remaining electrons as lone pairs, filling the octets of the most electronegative atoms first (halogens, O, N, then C).',
            'If any central atom is short of an octet and the total electron count allows, convert a lone pair from an adjacent atom into an additional bond (creating double or triple bonds).',
            'Verify: every carbon has exactly 4 bonds; every hydrogen has exactly 1 bond; every nitrogen has 3 bonds + 1 LP (or 4 bonds with +1 charge); every oxygen has 2 bonds + 2 LP (or 1 bond + 3 LP with −1 charge).',
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Spot Charged Atoms Instantly Without Calculation',
          body: 'Memorize the neutral defaults: C = 4 bonds, N = 3 bonds, O = 2 bonds.\n\nDeviate → charge:\n• N with 4 bonds → N⁺ (as in ammonium, quaternary ammonium)\n• O with 1 bond → O⁻ (alkoxide, phenoxide, carboxylate)\n• C with 3 bonds, no LP → C⁺ (carbocation — electrophile)\n• C with 3 bonds, 1 LP → C⁻ (carbanion — nucleophile/base)\n\nThis recognition is essential for mechanism problems — you must know instantly which atoms are charged and why.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Second-Row Atoms Cannot Expand Their Octets',
          body: 'C, N, O, and F are strictly limited to 8 electrons in their valence shell — they have no accessible d orbitals for expansion. Unlike phosphorus (PCl₅, 10 electrons around P) or sulfur (H₂SO₄, 12 electrons around S), you must NEVER draw carbon with 5 bonds or oxygen with 3 bonds and 2 lone pairs without assigning a formal charge. A 5-bond carbon in a Lewis structure is always wrong. A 3-bond, 2-LP oxygen is wrong — it would be +1 charge. This is the most common structural error in introductory orgo.',
        },
      ],
      mcqs: [
        {
          question: 'What is the formal charge on oxygen in the hydronium ion (H₃O⁺)?',
          options: ['−1', '0', '+1', '+2'],
          correct: 2,
          explanation: 'Oxygen in H₃O⁺ forms 3 bonds (to 3 H atoms) and has 1 lone pair (2 electrons). FC = V − L − B/2 = 6 − 2 − 6/2 = 6 − 2 − 3 = +1. The three H atoms are each neutral (1 bond, 0 LP, FC = 1 − 0 − 1 = 0), so the overall charge is +1. Check: sum of all FCs = +1 = overall ion charge. ✓',
        },
        {
          question: 'A carbon atom in an organic molecule has 3 bonds to other atoms and no lone pairs. What is its formal charge, and what type of species is this?',
          options: [
            '+1; a carbocation — an electrophile',
            '0; a neutral carbon with an empty orbital',
            '−1; a carbanion — a nucleophile',
            '−2; a doubly-reduced carbon',
          ],
          correct: 0,
          explanation: 'FC = 4 − 0 − 6/2 = 4 − 3 = +1. This is a carbocation: electron-deficient, with an empty p orbital. Carbocations are powerful electrophiles and are key intermediates in SN1 reactions, E1 reactions, electrophilic addition to alkenes, and Friedel-Crafts reactions. Stability order: tertiary > secondary > primary > methyl.',
        },
        {
          question: 'The nitrate ion (NO₃⁻) has a nitrogen atom in the center. What is the formal charge on N, and how does the sum of all formal charges match the ion\'s charge?',
          options: [
            'N has FC = 0; each O has FC = −1/3 (fractional)',
            'N has FC = +1; two O atoms have FC = −1, one O has FC = 0; sum = −1',
            'N has FC = −1; all three O atoms have FC = 0; sum = −1',
            'N has FC = +2; all three O atoms have FC = −1; sum = −1',
          ],
          correct: 1,
          explanation: 'The most common Lewis structure has N double-bonded to one O and single-bonded to two O atoms. N has 4 bonds and 0 LP: FC = 5 − 0 − 8/2 = +1. The doubly-bonded O has 2 bonds and 2 LP: FC = 6 − 4 − 4/2 = 0. Each singly-bonded O has 1 bond and 3 LP: FC = 6 − 6 − 2/2 = −1. Sum: +1 + 0 + (−1) + (−1) = −1. Matches the ion charge. ✓ (Resonance makes all three N–O bonds equivalent in reality.)',
        },
      ],
      flashcards: [
        {
          front: 'Formal charge formula',
          back: 'FC = V − L − B/2\nwhere V = valence e⁻ of neutral atom, L = lone pair electrons on this atom, B = total bonding electrons to this atom.',
        },
        {
          front: 'Neutral oxygen in an organic molecule has...',
          back: '2 bonds and 2 lone pairs (FC = 0). Examples: ethers (R–O–R), alcohols (R–OH), ketone oxygen. Deviate: 1 bond + 3 LP = alkoxide (O⁻); 3 bonds + 1 LP = oxocarbenium (O⁺).',
        },
        {
          front: 'What does a carbon with 3 bonds and 1 lone pair represent?',
          back: 'A carbanion — formal charge −1. It is nucleophilic and basic (electron-rich). Example: the conjugate base of a terminal alkyne (RC≡C⁻), organolithium reagents (RLi). Very reactive.',
        },
        {
          front: 'Why must the sum of all formal charges in a Lewis structure equal the overall charge?',
          back: 'Formal charges are an accounting convention — they track where electrons "shifted" relative to neutral atoms. Total electron count is fixed, so charges must balance to the molecule\'s true charge. Neutral molecule: sum = 0. Ion of −1: sum = −1.',
        },
        {
          front: 'Which Lewis structure is more stable: one with charges on atoms, or one with minimal charges?',
          back: 'Minimal formal charges = more stable. Also: negative charge on a more electronegative atom is preferred over negative charge on a less electronegative atom. Structures with adjacent opposite charges are less stable (unless stabilized by proximity and resonance).',
        },
      ],
    },

    // ── Concept 3: Resonance & Electron Delocalization ────────────────────────
    {
      id: 'ch01-c3-resonance',
      title: 'Resonance & Electron Delocalization',
      subtitle: 'When electrons are shared across multiple bonds simultaneously',
      estimatedMinutes: 15,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'Some molecules cannot be described accurately by a single Lewis structure. The acetate ion (CH₃CO₂⁻) is the classic example: two oxygen atoms bonded to the same carbon, yet experiment shows both C–O bonds are identical — 1.27 Å, midway between a C–O single bond (1.43 Å) and a C=O double bond (1.23 Å). Neither possible Lewis structure captures this truth. The real structure is a resonance hybrid: a weighted average of all contributing Lewis structures.',
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'A Mule Is Not Switching Between a Horse and a Donkey',
          body: 'The true structure of acetate is not "sometimes one structure, sometimes the other." It is permanently in between — like a mule is neither horse nor donkey but its own stable hybrid. The resonance structures are snapshots of a real structure that our Lewis notation (designed for localized electrons) cannot represent in a single drawing. The double-headed arrow (↔) between them does NOT mean they interconvert. They are two descriptions of one reality.',
        },
        {
          type: 'text',
          body: 'Drawing resonance structures follows strict rules. The most important rule: atoms never move. Only electrons are repositioned. A curved full-headed arrow shows movement of an electron pair — the tail is at the source (a bond or a lone pair) and the head points to the destination. You can only move electrons into an adjacent position (the receiving atom must have room for them — either an empty orbital, a π bond to break, or be losing a different pair to create room).',
        },
        {
          type: 'list',
          variant: 'numbered',
          items: [
            'More stable: all second-row atoms satisfy the octet rule. Structures with expanded octets on C, N, or O are invalid.',
            'More stable: fewer formal charges. Structures with separated opposite charges are less stable unless resonance strongly compensates.',
            'More stable: negative formal charge on a more electronegative atom (O > N > C). Positive charge on a less electronegative atom is preferred.',
            'More stable: more bonds (more covalent bonding = lower energy). A structure with a C=O contributes more than one with a C–O⁻ if the atom counts allow.',
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Conjugation Is Required for Delocalization',
          body: 'Resonance delocalization requires continuous p-orbital overlap — a conjugated system. This means alternating single and double bonds (or a lone pair adjacent to a π bond) with no sp³ interruption. One sp³ carbon in a chain stops delocalization completely.\n\nExamples of conjugated systems where resonance operates:\n• Benzene: 6 p orbitals, fully delocalized\n• Enolate (R₂C=CH–O⁻): π bond + lone pair adjacent\n• Allyl cation (CH₂=CH–CH₂⁺): π bond + adjacent empty p orbital\n• Amide (R–CO–NR₂): lone pair on N conjugated with C=O',
        },
        {
          type: 'table',
          headers: ['System', 'Resonance structures', 'Practical consequence'],
          rows: [
            ['Acetate (CH₃CO₂⁻)', '2 equivalent', 'Charge spread over 2 O atoms → stabilized anion; carboxylic acids are strong acids (pKₐ ~5)'],
            ['Allyl cation (CH₂=CH–CH₂⁺)', '2 equivalent', 'Positive charge at C1 and C3; electrophiles attack at both; more stable than isolated carbocation'],
            ['Benzene (C₆H₆)', '2 Kekulé structures', 'All C–C bonds equal at 1.40 Å; 36 kcal/mol extra stabilization (aromaticity); does EAS, not addition'],
            ['Amide bond (R–CO–NHR)', '2', 'C–N has ~40% double bond character; restricted rotation; planar geometry at N — critical for protein structure'],
            ['Enolate (R₂C=CH–O⁻)', '2', 'Charge on both C and O; ambident nucleophile — can alkylate at C (thermodynamic) or O (kinetic)'],
          ],
        },
        {
          type: 'text',
          body: 'The practical payoff of understanding resonance is enormous. Acidity is the most immediate example: carboxylic acids (pKₐ ~5) are roughly 10¹¹ times more acidic than alcohols (pKₐ ~16) — not because the O–H bonds are chemically different, but because the resulting anions are. The carboxylate anion delocalizes the negative charge over two electronegative oxygen atoms via resonance; the alkoxide has the full negative charge on one oxygen. More stabilized conjugate base = weaker base = stronger acid. This logic drives every acid-base comparison in organic chemistry.',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Resonance vs. Isomers vs. Equilibria — Keep Them Distinct',
          body: 'Resonance structures: same connectivity, same atoms, only electrons differ. They are descriptions of ONE molecule. Symbol: ↔\n\nConstitutional isomers: same molecular formula but different atom connectivity. They are DIFFERENT compounds.\n\nEquilibrating species (tautomers, conformers): truly different structures that interconvert. Symbol: ⇌\n\nA common error is writing a resonance arrow (↔) where an equilibrium arrow (⇌) belongs, or confusing the keto and enol forms of a ketone (tautomers, NOT resonance structures — an H atom moves, so atoms change position).',
        },
      ],
      mcqs: [
        {
          question: 'The peptide (amide) bonds in proteins resist free rotation around the C–N bond. The best explanation is:',
          options: [
            'C–N bonds are inherently shorter than C–C bonds and rotation is sterically restricted',
            'The lone pair on N is delocalized into the C=O π system, giving the C–N bond significant double bond character (~40%)',
            'Steric clashes between adjacent side chains physically prevent rotation',
            'The C–N bond is a true double bond in the ground state',
          ],
          correct: 1,
          explanation: 'The amide nitrogen is sp² hybridized — its lone pair is in a p orbital that overlaps with the adjacent C=O π system. This delocalization (N lone pair → C=O) gives the C–N bond roughly 40% double bond character (measured bond length ~1.32 Å, between single bond 1.47 Å and double bond 1.27 Å). Breaking the π overlap costs energy, creating a rotational barrier of ~20 kcal/mol. This planarity is what makes possible the regular α-helix and β-sheet structures in proteins.',
        },
        {
          question: 'Arrange in order of increasing acidity (weakest acid first): phenol (C₆H₅OH), ethanol (CH₃CH₂OH), acetic acid (CH₃COOH).',
          options: [
            'Acetic acid < phenol < ethanol',
            'Ethanol < phenol < acetic acid',
            'Phenol < ethanol < acetic acid',
            'Acetic acid < ethanol < phenol',
          ],
          correct: 1,
          explanation: 'Acidity = stability of conjugate base. Acetate (from acetic acid, pKₐ 4.7): charge delocalized over 2 equivalent electronegative O atoms — most stable. Phenoxide (from phenol, pKₐ 10.0): charge delocalized into the aromatic ring over 4 additional carbon atoms — moderately stable but charge partially on less-electronegative C. Ethoxide (from ethanol, pKₐ 16): full negative charge on one O, no resonance — least stable. Acidity order: acetic acid > phenol > ethanol.',
        },
        {
          question: 'Which of the following is NOT a valid resonance structure of formamide (HCONH₂)?',
          options: [
            'C=O with C–N single bond; N has one lone pair',
            'C–O⁻ with C=N double bond; N has no lone pair; O⁻ has 3 lone pairs',
            'C=O with C=N double bond; N has no lone pair; O has 2 lone pairs — carbon has 5 bonds',
            'Both A and B are valid contributing resonance structures',
          ],
          correct: 2,
          explanation: 'Option C requires carbon to form 5 bonds (two double bonds = 4 bonds from π + 2 σ to C, plus the H). This violates the octet rule for a second-row element — carbon can have at most 4 bonds total. Options A (major contributor) and B (minor contributor showing N lone pair donation) are both valid. Option B shows why amide nitrogen is less basic than a simple amine: its lone pair is partially tied up in the C=N bond.',
        },
      ],
      flashcards: [
        {
          front: 'The most important rule about resonance structures',
          back: 'Atoms NEVER move. Only electrons are repositioned (via curved arrows). If two structures have different atom connectivity, they are constitutional isomers or tautomers — NOT resonance structures.',
        },
        {
          front: 'Why is acetate (CH₃CO₂⁻) more stable than ethoxide (CH₃CH₂O⁻)?',
          back: 'Acetate: negative charge delocalized over 2 equivalent oxygen atoms via resonance (C=O ↔ C–O⁻). Ethoxide: full −1 charge on one oxygen, no resonance stabilization. Greater delocalization = greater stability = weaker base = stronger conjugate acid.',
        },
        {
          front: 'What does a curved full-headed arrow represent in a resonance structure?',
          back: 'Movement of an electron PAIR: tail = where the electrons start (bond or lone pair), head = where they end up. The arrow shows redistribution of electron density, not physical movement of electrons between resonance structures (which don\'t interconvert).',
        },
        {
          front: 'What symbol separates resonance structures, and what does it mean?',
          back: 'The double-headed resonance arrow (↔). It means both drawings describe the SAME real molecule — a weighted hybrid. NOT an equilibrium. The true structure is intermediate between all contributors, weighted by their stability.',
        },
        {
          front: 'What is a conjugated system?',
          back: 'A continuous array of p orbitals — alternating single and double bonds (or lone pair adjacent to π bond) with no sp³ interruption. Examples: benzene, 1,3-butadiene, enolates, allyl systems. Conjugation is required for resonance delocalization.',
        },
      ],
    },

    // ── Concept 4: Bond Polarity, Geometry & Physical Properties ──────────────
    {
      id: 'ch01-c4-polarity',
      title: 'Bond Polarity, Geometry & Physical Properties',
      subtitle: 'From electron distribution to boiling points, solubility, and reactivity',
      estimatedMinutes: 13,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'A Lewis structure shows which atoms are connected, but says nothing about how evenly electrons are shared. That is answered by electronegativity — an atom\'s ability to attract shared electrons toward itself. When two atoms of different electronegativity form a bond, the bonding electrons shift toward the more electronegative partner, creating a polar covalent bond with partial charges: δ+ on the less electronegative atom, δ− on the more electronegative one. This polarity is the engine behind nucleophilic attack, acid-base reactions, and hydrogen bonding — every core mechanism in organic chemistry.',
        },
        {
          type: 'table',
          headers: ['Atom', 'Pauling electronegativity', 'Typical organic bond polarity'],
          rows: [
            ['F', '3.98', 'C–F: strongly polar, C is δ+'],
            ['O', '3.44', 'C–O, C=O: polar, C is δ+'],
            ['N', '3.04', 'C–N: moderately polar, C is δ+'],
            ['Cl', '3.16', 'C–Cl: polar, C is δ+ (good leaving group)'],
            ['C', '2.55', 'Reference'],
            ['H', '2.20', 'C–H: very slightly polar (Δχ = 0.35), nearly nonpolar'],
          ],
        },
        {
          type: 'text',
          body: 'The single most important polar bond in organic chemistry is the carbonyl group (C=O). The oxygen is far more electronegative, pulling electron density strongly toward itself and leaving the carbon electron-poor (δ+). This δ+ carbon is an electrophile — it attracts nucleophiles. Virtually all of Orgo 2 carbonyl chemistry (nucleophilic addition to aldehydes and ketones, nucleophilic acyl substitution of acid derivatives) is a direct consequence of this polarity.',
        },
        {
          type: 'text',
          body: 'Molecular polarity is not simply the sum of bond polarities — geometry determines whether individual bond dipoles add together or cancel. Bond dipoles are vectors. In CO₂ (linear, sp carbon), the two C=O dipoles point in exactly opposite directions and cancel: CO₂ has zero net dipole moment despite having two very polar bonds. In water (bent, ~105°), the two O–H dipoles point at an angle to each other and add to give a large net dipole (1.85 D). In CCl₄ (perfect tetrahedral), four equivalent C–Cl dipoles cancel. In CHCl₃ (one H replaces Cl), the symmetry is broken and a net dipole exists.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Polarity Predicts Physical Properties — Ranked',
          body: 'Boiling point is determined by the strength of intermolecular forces (IMF), strongest to weakest:\n\n1. Ion-ion interactions (salts, not applicable to most organic)\n2. Hydrogen bonding: H bonded to O, N, or F interacting with lone pair on O, N, or F\n3. Dipole–dipole: polar molecules without H-bond donors\n4. London dispersion: all molecules; increases with molecular weight and surface area\n\nLike dissolves like: polar solvents (water, DMSO, DMF) dissolve polar/ionic solutes. Nonpolar solvents (hexane, diethyl ether) dissolve nonpolar solutes. Mixing is driven by similar IMF strengths.',
        },
        {
          type: 'text',
          body: 'Hydrogen bonds deserve special treatment. A hydrogen bond forms when an H atom covalently bonded to N, O, or F (the H-bond donor) interacts with a lone pair on a nearby N, O, or F (the H-bond acceptor). The bond length is ~1.8–2.0 Å (longer than a covalent bond) and the strength is roughly 10–40 kJ/mol — much weaker than a covalent bond (~350 kJ/mol for C–C) but 10× stronger than a typical London dispersion interaction. Hydrogen bonds are directional, which is what makes them so important for protein secondary structure (α-helix, β-sheet) and DNA base pairing.',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Why Does Ethanol (bp 78°C) Boil 102° Higher Than Dimethyl Ether (bp −24°C)?',
          body: 'Both have molecular formula C₂H₆O and similar molecular weights. Ethanol (CH₃CH₂OH) has an O–H bond → it is both an H-bond donor AND acceptor. Each molecule can form multiple hydrogen bonds with neighbors. Dimethyl ether (CH₃–O–CH₃) has NO O–H bond → it CANNOT donate hydrogen bonds (though it can accept one via its lone pairs). Without this strong cohesive force, ether molecules are held together only by much weaker dipole–dipole and London forces. The result: 102°C difference in boiling point for the same molecular formula.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'London Dispersion Forces Explain Branching Effects on Boiling Point',
          body: 'London dispersion forces arise from instantaneous dipoles and are proportional to surface area. n-Pentane (bp 36°C) has a larger, more extended surface than neopentane (bp 9.5°C) — same molecular formula (C₅H₁₂), but neopentane\'s compact spherical shape reduces contact area between molecules. Lower surface area = weaker dispersion = lower boiling point. Linear chains always boil higher than their branched isomers.',
        },
      ],
      mcqs: [
        {
          question: 'Which molecule has a net dipole moment of zero despite containing polar covalent bonds?',
          options: ['Water (H₂O)', 'Ammonia (NH₃)', 'Carbon tetrachloride (CCl₄)', 'Chloroform (CHCl₃)'],
          correct: 2,
          explanation: 'CCl₄ has perfect tetrahedral geometry with four identical C–Cl bond dipoles pointing symmetrically to the four vertices of a tetrahedron. The vector sum of these four dipoles is exactly zero — they cancel completely. CHCl₃ replaces one Cl with H, breaking tetrahedral symmetry; its dipoles no longer cancel (net dipole = 1.04 D). Both water and ammonia have bent/pyramidal geometry — their dipoles add to give significant net dipole moments.',
        },
        {
          question: 'Rank these compounds in order of increasing boiling point: butane (C₄H₁₀), diethyl ether (C₂H₅OC₂H₅), 1-butanol (C₄H₉OH).',
          options: [
            'Butane < diethyl ether < 1-butanol',
            '1-butanol < diethyl ether < butane',
            'Butane < 1-butanol < diethyl ether',
            'Diethyl ether < 1-butanol < butane',
          ],
          correct: 0,
          explanation: 'Butane (bp −1°C): nonpolar, only London dispersion forces. Diethyl ether (bp 35°C): polar (has C–O bonds), dipole–dipole interactions, can H-bond accept but CANNOT donate H bonds (no O–H). 1-Butanol (bp 118°C): has O–H bond, hydrogen bonds as donor AND acceptor — strongest IMF of the three. Correct ranking: butane < diethyl ether < 1-butanol. This series is among the most tested polarity comparisons in Orgo 1.',
        },
        {
          question: 'The carbonyl carbon of a ketone (C=O) is δ+. In a nucleophilic addition reaction, which statement correctly describes the roles of the reactants?',
          options: [
            'The ketone acts as a nucleophile; the attacking reagent acts as an electrophile',
            'The ketone carbon (δ+) acts as the electrophile; the attacking reagent provides a lone pair or π electrons as the nucleophile',
            'The ketone oxygen (δ−) acts as the nucleophile; the reagent acts as the electrophile',
            'Both atoms of the C=O bond act as electrophiles simultaneously',
          ],
          correct: 1,
          explanation: 'The polarized C=O makes the carbon electron-poor (electrophilic, δ+). Nucleophiles — species with lone pairs (Grignard reagents, hydride, cyanide, water) or π electrons — attack this carbon. The π electrons of C=O shift toward oxygen as the new bond forms (oxygen becomes the leaving group site in substitution, or stays as an alkoxide in addition). This electrophile/nucleophile assignment is the basis of ALL carbonyl chemistry in Orgo 2.',
        },
      ],
      flashcards: [
        {
          front: 'Electronegativity order for the main organic chemistry atoms',
          back: 'F > O > N ≈ Cl > S ≈ C > H\n\nMost important differences: C–O and C=O are strongly polar (C is δ+). C–H is nearly nonpolar (Δχ ≈ 0.35). C–F is the most polar C–halogen bond.',
        },
        {
          front: 'Why does CO₂ have zero dipole moment despite two polar C=O bonds?',
          back: 'CO₂ is linear (O=C=O). The two C=O bond dipoles point in exactly opposite directions — they cancel as vectors. Molecular symmetry, not just bond polarity, determines net dipole. Always consider geometry when predicting polarity.',
        },
        {
          front: 'What makes an H-bond different from an ordinary dipole–dipole interaction?',
          back: 'Hydrogen bonds are specifically between H (bonded to N, O, or F) and a lone pair on N, O, or F. They are stronger (~10–40 kJ/mol) and directional (linear alignment is optimal). Only O–H, N–H, and F–H groups are H-bond donors; any lone pair on O, N, or F is an H-bond acceptor.',
        },
        {
          front: 'Why does a branched alkane boil lower than its straight-chain isomer?',
          back: 'London dispersion forces depend on surface area of contact between molecules. Branched isomers are more compact (spherical), reducing contact area and weakening dispersion attractions. Example: n-pentane (bp 36°C) vs. neopentane (bp 9.5°C) — same formula C₅H₁₂.',
        },
        {
          front: 'What makes the carbonyl carbon (C=O) an electrophile?',
          back: 'Oxygen\'s higher electronegativity (3.44 vs C\'s 2.55) pulls electron density away from carbon, leaving it δ+. Electron-deficient = electrophilic = attracted to electron-rich nucleophiles. The carbonyl carbon is the reaction site in almost all Orgo 2 carbonyl chemistry.',
        },
      ],
    },

  ],
}
