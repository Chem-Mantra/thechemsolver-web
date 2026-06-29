import type { OrgoChapter } from '../types'

export const CH11: OrgoChapter = {
  id: 'ch11',
  number: 11,
  title: 'Conjugated Systems & Diels-Alder',
  orgo: 1,
  accentHex: '#10b981',
  concepts: [

    // ── Concept 1: Conjugated Dienes & Resonance Stabilization ───────────────
    {
      id: 'ch11-c1-conjugation',
      title: 'Conjugated Dienes & Delocalization',
      subtitle: 'Resonance energy, s-cis conformation, and UV absorption',
      estimatedMinutes: 11,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'When two double bonds are separated by one single bond (1,3-diene arrangement), their p orbitals overlap to form a continuous π system — this is conjugation. Conjugated systems are more stable than isolated alkenes (lower energy by ~15 kJ/mol due to delocalization), absorb light at longer wavelengths, and exhibit unique chemistry including 1,2 and 1,4 addition patterns.',
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'Conjugation as a Highway System',
          body: 'Electrons in a conjugated system are like cars with access to an express highway — they can move freely over the entire π system rather than being trapped in one lane (localized π bond). More delocalization = lower energy = greater stability.\n\nExtending the analogy: each additional double bond added to the conjugated chain extends the highway, lowering the energy of the HOMO and allowing longer wavelength (lower energy) light to be absorbed. Lycopene (11 conjugated double bonds in tomatoes) absorbs blue/green light and appears red. Beta-carotene (11 double bonds) appears orange.',
        },
        {
          type: 'table',
          headers: ['System', 'λmax (UV absorption)', 'Color (complementary)', 'Notes'],
          rows: [
            ['Isolated alkene (C=C)', '~170 nm (vacuum UV)', 'Colorless', 'Too far UV to see'],
            ['Butadiene (2 conj. C=C)', '~217 nm (UV)', 'Colorless', 'Still UV'],
            ['Hexatriene (3 conj.)', '~258 nm', 'Colorless', 'Near UV'],
            ['β-carotene (11 conj.)', '~450 nm', 'Appears orange', 'Visible light absorbed'],
            ['Lycopene (11 conj., no ring)', '~472 nm', 'Appears red', 'Tomatoes'],
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'The s-cis Conformation: Required for Diels-Alder',
          body: 'A 1,3-diene can rotate around the C2–C3 single bond to adopt two conformations:\n\n• s-trans: C1=C2–C3=C4 with the two double bonds on opposite sides (more stable, ~96% at equilibrium)\n• s-cis: C1=C2–C3=C4 with the two double bonds on the same side (~4% at equilibrium)\n\nOnly the s-cis conformation can react in the Diels-Alder reaction — both terminal carbons (C1 and C4) must be close enough in space to react simultaneously with the dienophile. Dienes locked s-cis (like cyclopentadiene) react much faster. Dienes locked s-trans (like trans,trans-1,3-pentadiene) essentially cannot react in Diels-Alder.',
        },
      ],
      mcqs: [
        {
          question: 'Why is 1,3-butadiene (a conjugated diene) more stable than 1,4-pentadiene (an isolated diene)?',
          options: [
            '1,3-Butadiene has fewer carbons',
            'The 4 π electrons in 1,3-butadiene are delocalized over all 4 carbons, lowering the overall energy (~15 kJ/mol resonance stabilization). In 1,4-pentadiene the two double bonds are isolated — no delocalization',
            '1,4-Pentadiene is more reactive and therefore less stable',
            '1,3-Butadiene has a more symmetrical structure',
          ],
          correct: 1,
          explanation: 'Conjugation stabilizes the molecule through delocalization of π electrons. In 1,3-butadiene, the p orbitals on all four carbons overlap continuously — the π electrons are not localized in either double bond but are spread over the entire 4-carbon system (delocalization energy ≈ 15 kJ/mol). In 1,4-pentadiene, the two C=C bonds are separated by a CH₂ unit — no p-orbital overlap between them, no delocalization. The conjugated system is lower in energy (more stable). This is demonstrated by heats of hydrogenation: conjugated dienes have lower ΔH_hydrogenation than expected for two isolated double bonds.',
        },
        {
          question: 'Why is the s-cis conformation essential for Diels-Alder reactions?',
          options: [
            's-cis is more reactive because it has higher energy',
            'In s-cis, C1 and C4 of the diene are close in space and can simultaneously react with the two carbons of the dienophile in a concerted cycloaddition',
            's-cis allows better conjugation with the dienophile\'s π system',
            'The s-trans conformer is locked and cannot react',
          ],
          correct: 1,
          explanation: 'The Diels-Alder reaction is a concerted [4+2] cycloaddition: all 6 electrons shift simultaneously in a cyclic transition state. The diene must bring C1 and C4 close together to react with both carbons of the dienophile. In the s-cis conformation, C1 and C4 are on the same side of the C2–C3 bond (~3.5 Å apart) — they can reach the two ends of the dienophile simultaneously. In the s-trans conformation, C1 and C4 are far apart (~5 Å) — they cannot simultaneously bond to the dienophile. Dienes locked in s-cis (cyclopentadiene) react very fast; those locked s-trans cannot react at all.',
        },
        {
          question: 'Compared to an isolated C=C, a conjugated diene absorbs UV light at:',
          options: [
            'Shorter wavelengths (higher energy photons)',
            'Longer wavelengths (lower energy photons, because HOMO-LUMO gap is smaller)',
            'The same wavelength',
            'Infrared region instead of UV',
          ],
          correct: 1,
          explanation: 'Conjugation extends the π system. In molecular orbital terms, conjugation raises the HOMO energy (bonding MO with nodes between carbons) and lowers the LUMO energy (lowest empty antibonding MO). The smaller HOMO-LUMO gap means less energy is needed for the electronic transition — which corresponds to longer wavelength (lower frequency, lower energy per photon) light. Isolated alkenes absorb ~170 nm (high energy UV); 1,3-butadiene absorbs ~217 nm; highly conjugated systems (carotenoids) absorb visible light. Extending conjugation always shifts absorption to longer wavelengths.',
        },
      ],
      flashcards: [
        {
          front: 'What makes a diene conjugated vs isolated vs cumulated?',
          back: 'Conjugated diene: C=C–C=C (alternating single-double bonds, p orbitals overlap)\nIsolated diene: C=C–C–C=C (double bonds separated by ≥2 single bonds, no overlap)\nCumulated diene (allene): C=C=C (two double bonds share one carbon, orthogonal p orbitals)\n\nOnly conjugated dienes have resonance stabilization, UV shift, and Diels-Alder reactivity.',
        },
        {
          front: 's-cis vs s-trans conformations of a 1,3-diene',
          back: 's-cis: the two C=C double bonds on the SAME side of the C–C single bond. Less stable (eclipsing). Required for Diels-Alder. C1 and C4 are close in space.\n\ns-trans: the two C=C double bonds on OPPOSITE sides. More stable (~96% at equilibrium for butadiene). C1 and C4 are far apart. Cannot do Diels-Alder.',
        },
        {
          front: 'How does conjugation affect UV absorption wavelength?',
          back: 'Conjugation narrows the HOMO-LUMO gap → electronic excitation requires LESS energy → LONGER wavelength absorbed.\n\nIsolated C=C: ~170 nm (vacuum UV, invisible)\nConjugated diene: ~217 nm\nConjugated triene: ~258 nm\nHighly conjugated (carotenoids, 11 C=C): 450–480 nm (visible, colored)\n\nRule: more conjugation = longer wavelength = possibly colored compound.',
        },
      ],
    },

    // ── Concept 2: 1,2 vs 1,4 Addition & Thermodynamic Control ───────────────
    {
      id: 'ch11-c2-addition',
      title: '1,2- vs 1,4-Addition & Thermodynamic Control',
      subtitle: 'Kinetic vs thermodynamic products in diene chemistry',
      estimatedMinutes: 11,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'When an electrophile (like HBr) adds to a conjugated diene, the initial protonation generates an allylic carbocation that is delocalized over three carbons. The nucleophile (Br⁻) can then attack at C2 (giving 1,2-addition product) or at C4 (giving 1,4-addition product). The ratio of these products depends dramatically on the temperature — an early triumph of thermodynamics vs kinetics.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Kinetic vs Thermodynamic Product',
          body: 'For HBr addition to 1,3-butadiene:\n\n• Low temperature (−80°C): 1,2-addition product predominates (3,4-dibromo-1-butene)\n  → Kinetic control: forms faster (lower activation energy), less stable\n\n• High temperature (40°C or above): 1,4-addition product predominates (1,4-dibromo-2-butene)\n  → Thermodynamic control: more stable product (internal alkene more substituted), forms slower\n\nKey insight: at low temperature, the reaction is irreversible — whatever forms first "wins" (kinetic). At high temperature, the reaction is reversible — the more stable product accumulates (thermodynamic). This principle extends beyond diene chemistry to many reactions.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Why the 1,4-Product Is More Stable',
          body: '1,2-product: CH₂=CH–CHBr–CH₂Br → 3,4-dibromo-1-butene; has a terminal (monosubstituted) alkene\n\n1,4-product: BrCH₂–CH=CH–CH₂Br → 1,4-dibromo-2-butene; has an internal (disubstituted, trans) alkene\n\nInternal alkenes are more stable than terminal alkenes (more alkyl substitution = more hyperconjugation = lower energy). The 1,4-product with the internal trans-alkene is the thermodynamic product.\n\nMnemonic: Low T = kinetic (1,2); High T = thermodynamic (1,4). "Cold is quick (1,2); Hot is stable (1,4)".',
        },
      ],
      mcqs: [
        {
          question: 'HBr adds to 1,3-butadiene at −80°C. What is the major product?',
          options: [
            '3,4-Dibromo-1-butene (1,4-addition product, thermodynamic)',
            '1,4-Dibromo-2-butene (1,4-addition product, thermodynamic)',
            '3-Bromo-1-butene (1,2-addition product, kinetic)',
            '1-Bromo-2-butene (the Markovnikov product)',
          ],
          correct: 2,
          explanation: 'At low temperature (−80°C), kinetic control predominates. Proton adds to C1 of butadiene (Markovnikov, giving the more stable allylic 2° carbocation at C2 delocalized to C4). Br⁻ attacks the closer allylic carbon (C2) preferentially at low T — forming 3-bromo-1-butene (with the double bond between C1 and C2 from 1,2-addition... wait: HBr: H adds to C1 → cation at C2 ↔ C4. Br at C2 = 1,2 product (3-bromobut-1-ene? No: H at C1, Br at C2 gives CH₃CHBrCH=CH₂ = 3-bromo-1-butene). At low T: 3-bromo-1-butene is kinetic. At high T: 1-bromo-2-butene (the 1,4 product from Br at C4) is thermodynamic. Major kinetic = 3-bromo-1-butene.',
        },
        {
          question: 'Which product accumulates when HBr addition to 1,3-butadiene is run at 40°C with a long reaction time?',
          options: [
            '3-Bromo-1-butene — kinetic product still forms but slower',
            '1-Bromo-2-butene (trans) — thermodynamic product, more stable internal alkene',
            'An equimolar mixture of 1,2- and 1,4-addition products',
            'Butane (double addition)',
          ],
          correct: 1,
          explanation: 'At 40°C (thermodynamic conditions), the reaction is reversible. The kinetic product (3-bromo-1-butene) can reform the allylic carbocation, which then reacts again. Over time, the equilibrium composition is established — dominated by the more stable 1,4-addition product: 1-bromo-2-butene (specifically trans-1-bromo-2-butene, since the trans alkene is more stable). The 1,4-product has an internal disubstituted alkene (more hyperconjugation, lower energy) vs. the terminal monosubstituted alkene in the kinetic product.',
        },
      ],
      flashcards: [
        {
          front: 'Kinetic vs thermodynamic control: summary',
          back: 'Kinetic product: forms faster (lower Ea), less stable. Favored at LOW temperature, short reaction time, irreversible conditions.\n\nThermodynamic product: more stable (lower energy), forms slower (higher Ea). Favored at HIGH temperature, long reaction time, reversible conditions.\n\nFor HBr + 1,3-butadiene:\nLow T → 1,2-addition product (kinetic)\nHigh T → 1,4-addition product (thermodynamic, more stable internal alkene)',
        },
        {
          front: 'What is an allylic carbocation and why is it stable?',
          back: 'Allylic carbocation: C⁺ adjacent to a C=C double bond → resonance delocalization over 3 carbons: C1=C2–C3⁺ ↔ C1⁺–C2=C3\n\nStabilized by resonance (charge delocalized over 3 carbons). Stability: allylic ≈ tertiary > secondary > primary.\n\nNucleophile can attack at EITHER end of the allylic system → two different regiochemical products (1,2 and 1,4).',
        },
      ],
    },

    // ── Concept 3: Diels-Alder Reaction ───────────────────────────────────────
    {
      id: 'ch11-c3-diels-alder',
      title: 'The Diels-Alder Reaction',
      subtitle: '[4+2] cycloaddition — predictable stereo- and regiochemistry',
      estimatedMinutes: 14,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'The Diels-Alder reaction is one of the most powerful and elegant reactions in organic chemistry. It forms a six-membered ring in a single concerted step — no intermediates, no side reactions when designed properly. Diels and Alder received the Nobel Prize in 1950 for this discovery. The reaction: a conjugated diene (4 π electrons, s-cis) reacts with a dienophile (2 π electrons, usually electron-poor) to form a cyclohexene.',
        },
        {
          type: 'formula',
          latex: '\\text{Diene (s-cis)} + \\text{Dienophile} \\xrightarrow{\\Delta} \\text{Cyclohexene}',
          display: true,
          caption: '[4+2] cycloaddition: 4π electrons from diene + 2π electrons from dienophile → 6-membered ring. Thermal (Δ), concerted, pericyclic reaction.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Optimal Diene-Dienophile Combinations',
          body: 'The Diels-Alder works best when:\n\n1. DIENE is electron-rich: alkyl groups, OR, NR₂, etc. push electrons into the diene\n   → Good: 1,3-butadiene, Danishefsky\'s diene, cyclopentadiene\n\n2. DIENOPHILE is electron-poor: EWG pulls electrons from the C=C\n   → Good: maleic anhydride, maleate esters, acrylate esters, nitroolefins, vinyl ketone, fumarate\n   → The C=C is electron-deficient and acts as a LUMO-lowered electrophile\n\nFMO theory: the reaction is controlled by HOMO(diene)/LUMO(dienophile) overlap. EWG on dienophile lowers LUMO energy → smaller gap → faster reaction.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Stereochemistry: Endo vs Exo & Syn Addition',
          body: 'The Diels-Alder has two crucial stereochemical rules:\n\n1. Syn addition: groups on the same face of the diene and dienophile remain on the same face of the product ring. The transition state is a boat-like 6-membered structure where all bonds form simultaneously from the same face.\n\n2. Endo rule: substituents on the dienophile prefer to point TOWARD the diene (endo approach) — secondary orbital overlap stabilizes the endo TS despite slight steric cost. Endo = kinetic product. Exo = more stable, thermodynamic product.\n   Endo: substituents inside the boat-like TS (under the diene)\n   Exo: substituents outside\n\nFor exams: unless told otherwise, assume endo product (kinetic control, lower activation energy).',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Retro-Diels-Alder: The Reverse Reaction',
          body: 'At high temperatures, the Diels-Alder reaction reverses: the cycloadduct breaks apart into diene + dienophile. This retro-Diels-Alder is thermally allowed (same orbital symmetry) and is used in synthesis:\n\n1. As a protecting group strategy: a diene is "stored" as its cyclopentadiene adduct, then released by pyrolysis\n2. In biosynthesis: some natural product transformations involve retro-[4+2]\n3. In total synthesis: retro-Diels-Alder generates reactive intermediates (like benzyne) in controlled ways\n\nCyclopentadiene dimerizes rapidly at room temperature (Diels-Alder self-reaction) and must be freshly cracked (retro-Diels-Alder at ~170°C) before use.',
        },
      ],
      mcqs: [
        {
          question: 'Which of the following is the best dienophile for a Diels-Alder reaction with 1,3-butadiene?',
          options: [
            'Ethylene (CH₂=CH₂) — simple, electron-neutral',
            'Butadiene itself (too hindered)',
            'Maleic anhydride (C₄H₂O₃, a cyclic anhydride with two C=O groups flanking a C=C)',
            'Vinyl ether (CH₂=CHOCH₃) — electron-rich',
          ],
          correct: 2,
          explanation: 'Maleic anhydride is an excellent dienophile because it has two strongly electron-withdrawing carbonyl groups (C=O) flanking the C=C double bond. This makes the π bond of the C=C very electron-poor (LUMO is very low in energy). According to FMO theory, the closer the HOMO(diene) and LUMO(dienophile) energies, the faster and more favorable the Diels-Alder. Electron-withdrawing groups lower the LUMO → better match with HOMO of diene → fast reaction. Vinyl ether is electron-rich (OMe donates electrons) — it acts as a diene in some cases, not a good normal dienophile. Ethylene is a very slow dienophile (LUMO too high).',
        },
        {
          question: 'In the Diels-Alder reaction of cyclopentadiene with maleic anhydride, the endo product predominates. The endo approach means:',
          options: [
            'Maleic anhydride approaches from the exo face (same side as the bridge)',
            'Maleic anhydride approaches from the endo face — the C=O groups of the anhydride point toward (under) the cyclopentadiene ring in the transition state',
            'Both substituents end up on the same face as the ring bridge',
            'The reaction preferentially gives the exo product due to steric effects',
          ],
          correct: 1,
          explanation: 'In the endo TS, the dienophile\'s substituents (C=O groups of maleic anhydride) are folded toward the diene\'s π system (pointing "under" the cyclopentadiene ring). This endo approach is stabilized by secondary orbital interactions between the carbonyl groups and the diene\'s p orbitals. Although the endo TS is slightly more crowded than exo, the secondary orbital stabilization lowers the activation energy. The endo product is thus the kinetic product. Endo = substituents "inside" the bicyclic product (pointing into the concave face of the norbornane-like ring system).',
        },
        {
          question: 'What are the reactants (diene and dienophile) that would give this product from a Diels-Alder reaction: cyclohex-2-enecarbaldehyde?',
          options: [
            'Butadiene + crotonaldehyde (CH₃CH=CHCHO, trans)',
            'Isoprene + formaldehyde',
            'Butadiene + acrolein (CH₂=CHCHO, propenal)',
            'Cyclopentadiene + acetylene',
          ],
          correct: 2,
          explanation: 'Retrosynthetically: disconnection of the cyclohexene ring. Cyclohex-2-enecarbaldehyde has a CHO group. Using retro-Diels-Alder: cut the two new σ bonds (C1–C6 and C3–C4 new bonds in the product). This gives 1,3-butadiene (diene, 4C, no substituents) + acrolein CH₂=CHCHO (dienophile, 3C with terminal CHO). The CHO on C2 of the ring comes from the CHO on acrolein. So butadiene + acrolein → cyclohex-2-ene-1-carbaldehyde. This is exactly the product of a regioselective Diels-Alder (the "ortho" orientation where CHO ends at C1 of the ring).',
        },
      ],
      flashcards: [
        {
          front: 'Diels-Alder: key requirements',
          back: 'Diene: must be conjugated (C=C–C=C) and in s-CIS conformation\nDienophile: usually electron-poor (EWG like C=O, NO₂, CN adjacent to C=C)\nProduct: cyclohexene (6-membered ring with one double bond)\nMechanism: concerted [4+2] cycloaddition, pericyclic, thermal\nStereo: SYN addition; ENDO rule (EWG under diene in TS → kinetic product)',
        },
        {
          front: 'Endo vs exo in Diels-Alder',
          back: 'ENDO: dienophile substituents point TOWARD the diene π system in the TS. Secondary orbital interactions stabilize TS → KINETIC product (lower Ea).\n\nEXO: dienophile substituents point AWAY from diene. Less secondary orbital stabilization but less steric crowding → THERMODYNAMIC product (more stable).\n\nOn exams: assume ENDO unless told "high temperature / thermodynamic control" → then exo.',
        },
        {
          front: 'Diels-Alder stereo rule: what is syn addition?',
          back: 'In Diels-Alder, all new bonds form simultaneously from the same face (like a pancake press squeezing from one side). Groups that are cis on the dienophile remain cis in the product (relative stereochemistry preserved).\n\nExample: maleic anhydride (cis C=C) reacts with butadiene → the two H atoms on the dienophile C=C end up CIS in the cyclohexene product. Fumaric acid (trans C=C) → the same H atoms end up TRANS in the product.',
        },
        {
          front: 'Why does cyclopentadiene dimerize and how do you recover it?',
          back: 'Cyclopentadiene (CP) is locked in s-cis (due to ring geometry) and is a very reactive diene. It dimerizes slowly at room temperature via Diels-Alder with itself (CP as both diene and dienophile) to give dicyclopentadiene (endo product).\n\nRecovery: heat dicyclopentadiene to ~170°C → retro-Diels-Alder → monomer CP released. Collect by distillation. Use fresh CP immediately (redimerizes within hours at RT).',
        },
      ],
    },
  ],
}
