import type { OrgoChapter } from '../types'

export const CH09: OrgoChapter = {
  id: 'ch09',
  number: 9,
  title: 'Alkynes',
  orgo: 1,
  accentHex: '#10b981',
  concepts: [

    // ── Concept 1: Structure & Acidity of Alkynes ──────────────────────────────
    {
      id: 'ch09-c1-structure',
      title: 'Structure & Special Properties of Alkynes',
      subtitle: 'sp hybridization, linearity, and unique C–H acidity',
      estimatedMinutes: 10,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'Alkynes contain a carbon–carbon triple bond: one σ bond and two mutually perpendicular π bonds. The triple-bond carbons are sp hybridized — linear geometry with 180° bond angles. Two perpendicular p orbitals on each carbon overlap to form two π bonds, creating a cylindrically symmetric electron cloud around the C≡C axis. Terminal alkynes (RC≡CH) have a uniquely acidic C–H bond (pKa ~25) that sets them apart from all other hydrocarbons.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Why Terminal Alkynes Are Unusually Acidic',
          body: 'The sp carbon of a terminal alkyne has 50% s-character — far more than sp² (33%) or sp³ (25%). Electrons in s orbitals are held closer to the nucleus, experiencing a higher effective nuclear charge. This makes the sp carbon more electronegative than sp² or sp³ carbon, and the acetylenic C–H bond more polarized.\n\nAfter deprotonation, the acetylide anion (RC≡C⁻) is stabilized by placing the lone pair in the highly electronegative sp orbital.\n\npKa: terminal alkyne ~25; terminal alkene (vinyl C–H) ~44; alkane ~50\n\nConsequence: terminal alkynes can be deprotonated with NaNH₂ (pKa 38) or n-BuLi (pKa ~50) but NOT with NaOH (pKa 15.7).',
        },
        {
          type: 'table',
          headers: ['Property', 'Alkyne (R–C≡C–R)', 'Alkene (R–CH=CH–R)', 'Alkane (R–CH₂CH₂–R)'],
          rows: [
            ['Hybridization', 'sp', 'sp²', 'sp³'],
            ['Bond angle', '180°', '120°', '109.5°'],
            ['π bonds', '2', '1', '0'],
            ['C–H pKa (terminal)', '~25', '~44', '~50'],
            ['C≡C bond length', '120 pm', '—', '—'],
            ['C≡C bond strength', '~839 kJ/mol', '~611 kJ/mol (C=C)', '~347 kJ/mol (C–C)'],
            ['Typical reactions', 'Electrophilic addition, reduction, acetylide chemistry', 'Electrophilic addition', 'Radical halogenation, combustion'],
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Testing for Terminal Alkynes: Silver or Copper Reagents',
          body: 'Terminal alkynes (RC≡CH) react with Ag⁺ (ammoniacal silver nitrate, Tollens-like) to give insoluble silver acetylide precipitates:\nRC≡CH + AgNO₃(aq, NH₃) → RC≡CAg (silver acetylide, yellow-white precipitate)\n\nSimilarly with Cu⁺/NH₃ solution → red copper acetylide precipitate.\n\nInternal alkynes (RC≡CR\') do NOT give this test — they have no acidic C–H. This test distinguishes terminal from internal alkynes.\n\nCAUTION: silver acetylides are shock-sensitive explosives when dry. Always decompose carefully after identification.',
        },
      ],
      mcqs: [
        {
          question: 'Why is HC≡CH (acetylene, pKa 25) more acidic than H₂C=CH₂ (ethylene, pKa 44)?',
          options: [
            'Acetylene has more C–H bonds to ionize',
            'The sp carbon in acetylene holds more s-character (50% vs 33%), making the C–H bond more polarized and the acetylide anion more stable',
            'The triple bond withdraws electrons inductively from the C–H bond',
            'Acetylene is more acidic because it has a linear geometry',
          ],
          correct: 1,
          explanation: 'The key is orbital hybridization and s-character. sp carbon (acetylene): 50% s-character. sp² carbon (ethylene): 33% s-character. Electrons in s orbitals are held closer to the nucleus (lower energy, closer average distance). More s-character → more electronegative carbon → more polarized C–H → more acidic. The acetylide anion (HC≡C⁻) has the lone pair in an sp orbital — closer to the nucleus, lower energy, more stable. This makes acetylene 10^(44−25) = 10^19 times more acidic than ethylene.',
        },
        {
          question: 'Which reagent can deprotonate a terminal alkyne (pKa 25) to form an acetylide ion?',
          options: [
            'NaOH (conjugate acid H₂O, pKa 15.7) — too weak a base',
            'NaNH₂ (conjugate acid NH₃, pKa 38) — strong enough base',
            'NaHCO₃ — sodium bicarbonate',
            'NaI — sodium iodide',
          ],
          correct: 1,
          explanation: 'For deprotonation to be thermodynamically favorable, the pKa of the BASE\'S CONJUGATE ACID must be GREATER than the pKa of the acid being deprotonated. Terminal alkyne pKa = 25. NH₃ pKa = 38 > 25 → NaNH₂ (sodium amide) is a strong enough base. NaOH: conjugate acid H₂O, pKa = 15.7 < 25 → NOT strong enough (equilibrium favors reactants). NaHCO₃ and NaI are weak bases — far insufficient.',
        },
        {
          question: 'An unknown compound gives a yellow-white precipitate with ammoniacal silver nitrate solution. What does this indicate?',
          options: [
            'The compound is an alkene',
            'The compound contains a terminal alkyne (RC≡CH)',
            'The compound is an aldehyde (Tollens\'s test)',
            'The compound is an alcohol',
          ],
          correct: 1,
          explanation: 'Terminal alkynes react with Ag⁺ (ammoniacal AgNO₃) to form insoluble silver acetylide precipitates (RC≡CAg, yellow-white). This is a specific test for terminal alkynes — their acidic C–H is deprotonated by Ag⁺ acting as a Lewis acid. Internal alkynes (no acidic H) do not react. Note: Tollens\'s test (Ag⁺ in NH₃ + heat) for aldehydes gives a silver mirror on the test tube wall — different observation. The precipitate (not mirror) is the clue for the terminal alkyne.',
        },
      ],
      flashcards: [
        {
          front: 'Why are terminal alkynes acidic (pKa ~25) compared to alkenes (44) and alkanes (50)?',
          back: 'Hybridization → s-character → electronegativity of carbon:\nsp (alkyne): 50% s → most electronegative C\nsp² (alkene): 33% s → intermediate\nsp³ (alkane): 25% s → least electronegative\n\nMore electronegative carbon = more stable carbanion/anion in sp orbital → lower pKa → stronger acid. This is purely an orbital effect (no resonance).',
        },
        {
          front: 'Acetylide ion formation: what base is needed?',
          back: 'To deprotonate RC≡C–H (pKa 25):\n• NaNH₂ (pKa NH₃ = 38) ✓ — sodium amide works\n• n-BuLi (pKa butane = ~50) ✓ — organolithium works\n• NaH (pKa H₂ = 35) ✓ — sodium hydride works\n• NaOH (pKa H₂O = 15.7) ✗ — too weak\n• KOtBu (pKa tBuOH = 19) ✗ — too weak for alkyne\n\nAcetylide ion RC≡C⁻ is a powerful nucleophile and can alkylate primary halides (SN2).',
        },
        {
          front: 'Silver acetylide test for terminal alkynes',
          back: 'RC≡CH + AgNO₃(aq)/NH₃ → RC≡CAg↓ (yellow-white precipitate)\n\nThis test is POSITIVE only for terminal alkynes (acidic C–H). Internal alkynes: no reaction.\n\nAlso positive with ammoniacal Cu(I) → red/brown copper acetylide.\nAcetylides are shock-sensitive explosives — never allow to dry.',
        },
      ],
    },

    // ── Concept 2: Reactions of Alkynes ───────────────────────────────────────
    {
      id: 'ch09-c2-reactions',
      title: 'Reactions of Alkynes',
      subtitle: 'Addition, hydration, and selective reduction',
      estimatedMinutes: 12,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'Alkynes undergo many of the same reactions as alkenes (electrophilic addition) but have two π bonds available for reaction. Regioselectivity and the ability to add once (to give an alkene) or twice (to give a saturated product) are key considerations. The hydration of alkynes deserves special attention — it does not give an alcohol but an enol that tautomerizes to a ketone (or aldehyde for terminal alkynes).',
        },
        {
          type: 'table',
          headers: ['Reaction', 'Reagents', 'Product', 'Notes'],
          rows: [
            ['Addition of HX', 'HX (HBr, HCl)', 'Vinyl halide (Markovnikov) from mono-addition; gem-dihalide from double addition', 'Vinyl halide is resistant to further SN2/E2'],
            ['Addition of X₂', 'Br₂ (excess), CCl₄', 'Tetrahalide (double addition)', 'Mono-addition (1 eq Br₂) gives trans-dihaloalkene'],
            ['Hydration (Markovnikov)', 'H₂SO₄/H₂O + HgSO₄ catalyst', 'Ketone (Markovnikov; internal alkynes), or methyl ketone (terminal)', 'Enol intermediate tautomerizes to carbonyl'],
            ['Hydroboration-oxidation', '9-BBN, then H₂O₂/NaOH', 'Aldehyde (anti-Markovnikov; terminal)', 'syn addition of B and H; oxidation → enol → aldehyde'],
            ['Lindlar H₂', 'H₂, Pd/CaCO₃/Pb/quinoline', 'cis (Z) alkene', 'Stops at alkene; syn addition'],
            ['Na/NH₃ (dissolving metal)', 'Na or Li in liq. NH₃', 'trans (E) alkene', 'Radical anion mechanism; stops at alkene'],
            ['Full reduction', 'H₂, Pd/C (excess)', 'Alkane', 'Both π bonds reduced'],
            ['Acetylide formation + alkylation', 'NaNH₂, then R\'X (1°)', 'Internal alkyne RC≡CR\'', 'SN2 with acetylide on 1° halide'],
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Keto-Enol Tautomerism in Alkyne Hydration',
          body: 'When water adds to an alkyne (Markovnikov), the initial product is a vinyl alcohol (enol). Enols are unstable and rapidly tautomerize to the more stable carbonyl compound under acidic or basic conditions.\n\nInternal alkyne + H₂O (Markovnikov) → enol → ketone\nTerminal alkyne + H₂O (Markovnikov) → methyl ketone (acetyl = CH₃CO–)\nTerminal alkyne + hydroboration/oxidation (anti-Markovnikov) → aldehyde\n\nThis is a crucial difference:\n• Acid/Hg catalyst: Markovnikov → ketone (from internal) or methyl ketone (from terminal)\n• Hydroboration/oxidation: anti-Markovnikov → aldehyde (from terminal)\n\nSynoptic: propyne + H₂SO₄/H₂O/HgSO₄ → acetone (CH₃COCH₃)\npropyne + 9-BBN then H₂O₂/NaOH → propanal (CH₃CH₂CHO)',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'One HX or Two? Controlling Addition Extent',
          body: 'Adding exactly 1 equivalent of HBr to an internal alkyne gives a vinyl bromide (product of Markovnikov mono-addition).\nAdding excess HBr gives a geminal dihalide (two Br atoms on the same carbon).\n\nVinyl bromides are generally resistant to SN2 and E2 — the sp² carbon bearing halogen is not reactive toward backside attack. They require metal-catalyzed coupling (Pd) for further functionalization.\n\nFor X₂ (Br₂): one equivalent → trans-dihaloalkene (anti addition). Two equivalents → tetrahalide.',
        },
      ],
      mcqs: [
        {
          question: 'What is the major product when 1-butyne (HC≡CCH₂CH₃) is treated with dilute H₂SO₄ and HgSO₄ in water?',
          options: [
            'Butan-2-ol (a secondary alcohol)',
            'Butanal (CH₃CH₂CH₂CHO, an aldehyde)',
            'Butan-2-one (methyl ethyl ketone, CH₃COCH₂CH₃)',
            'Butanal after anti-Markovnikov hydration',
          ],
          correct: 2,
          explanation: 'H₂SO₄/H₂O/HgSO₄ is acid-catalyzed hydration with Markovnikov selectivity. For a terminal alkyne (HC≡CR), Markovnikov places the OH on the internal carbon (the more substituted one). The enol (H₂C=C(OH)–CH₂CH₃) tautomerizes to the ketone butan-2-one (CH₃COCH₂CH₃). Note: terminal alkynes always give methyl ketones under Markovnikov hydration (because the OH lands on C2, giving a CH₃CO– group). Anti-Markovnikov hydration (hydroboration/oxidation with 9-BBN) would give butanal (the aldehyde).',
        },
        {
          question: 'What product forms when 2-pentyne is treated with excess Br₂?',
          options: [
            '2-Bromo-2-pentene (vinyl bromide, mono-addition)',
            '2,3-Dibromopentane (from one equivalent Br₂ adding to the double bond)',
            '2,2,3,3-Tetrabromopentane (from double addition of Br₂)',
            'Pentane (full reduction)',
          ],
          correct: 2,
          explanation: 'Excess Br₂ adds to both π bonds of the alkyne. First equivalent of Br₂: anti addition across C≡C → trans-2,3-dibromo-2-pentene (a dibromoalkene). Second equivalent of Br₂: anti addition to the remaining C=C bond of the vinyl dibromide → 2,2,3,3-tetrabromopentane (geminal and vicinal tetrahalide). With exactly 1 equivalent Br₂, the product is the trans-dibromoalkene (stopped at vinyl dibromide stage). Excess Br₂ gives full tetrahalide.',
        },
        {
          question: 'Acetylide ion (RC≡C⁻) reacts with 1-iodopropane via SN2. What is the product?',
          options: [
            'A ketone',
            'An internal alkyne (RC≡C–CH₂CH₂CH₃)',
            'A terminal alkyne',
            'An aldehyde',
          ],
          correct: 1,
          explanation: 'Acetylide ions are excellent nucleophiles (C-nucleophile, sp lone pair). SN2 reaction with a primary alkyl halide (1-iodopropane, CH₃CH₂CH₂I): the acetylide C⁻ attacks the back face of C1 of propane, displacing I⁻. Product: internal alkyne R–C≡C–CH₂CH₂CH₃. This carbon–carbon bond-forming reaction is one of the most useful in synthesis — it extends a carbon chain by adding an alkyne unit. ONLY primary (and methyl) halides work for SN2 alkylation; secondary and tertiary give elimination instead.',
        },
      ],
      flashcards: [
        {
          front: 'Alkyne hydration: Markovnikov vs anti-Markovnikov products',
          back: 'Markovnikov (H₂SO₄/H₂O/HgSO₄): OH to more substituted C → enol → KETONE (internal alkyne) or methyl KETONE (terminal alkyne)\n\nAnti-Markovnikov (9-BBN then H₂O₂/NaOH): B (and ultimately OH) to less substituted C → enol → ALDEHYDE (terminal alkyne only)\n\nKey: Markovnikov terminal = methyl ketone; anti-Markovnikov terminal = aldehyde',
        },
        {
          front: 'Lindlar vs Na/NH₃: which gives cis, which gives trans?',
          back: 'Lindlar catalyst (H₂, Pd/CaCO₃ + Pb + quinoline):\n→ Syn addition → CIS (Z) alkene\n\nDissolving metal (Na or Li in liquid NH₃):\n→ Radical anion mechanism → TRANS (E) alkene\n\nFull reduction: H₂ + Pd/C → alkane (both π bonds reduced)',
        },
        {
          front: 'Acetylide alkylation: scope and limitations',
          back: 'RC≡C⁻ (formed from RC≡CH + NaNH₂) reacts with primary alkyl halides by SN2 to give internal alkynes.\n\nWorks: methyl and primary halides (RCH₂X)\nDoes NOT work: secondary and tertiary halides → elimination instead of substitution\n\nThis is a key C–C bond-forming reaction. Alkylation extends carbon skeleton: propyne + CH₃CH₂I → pent-2-yne.',
        },
        {
          front: 'Enol-keto tautomerism: what is an enol and why does it tautomerize?',
          back: 'Enol: R₂C=C(OH)–R\' — a vinyl alcohol; OH is on a sp² carbon adjacent to the C=C\nKeto: R₂CH–C(=O)–R\' — a carbonyl compound\n\nEnols tautomerize to ketones because C=O (stronger π bond, 716 kJ/mol) is thermodynamically more stable than C=C (611 kJ/mol). Enols are only stable when conjugated (phenols) or under special conditions. Equilibrium strongly favors keto form (>99.9% for simple carbonyl compounds).',
        },
      ],
    },
  ],
}
