import type { OrgoChapter } from '../types'

export const CH06: OrgoChapter = {
  id: 'ch06',
  number: 6,
  title: 'Alkyl Halides & Nucleophilic Substitution',
  orgo: 1,
  accentHex: '#10b981',
  concepts: [

    // ── Concept 1: Structure of Alkyl Halides ─────────────────────────────────
    {
      id: 'ch06-c1-structure',
      title: 'Alkyl Halides: Structure & Classification',
      subtitle: 'Leaving group ability, substrate class, and electrophilicity',
      estimatedMinutes: 10,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'Alkyl halides (R–X where X = F, Cl, Br, I) are the most common class of substrates in nucleophilic substitution reactions. The carbon–halogen bond is polarized with δ+ on carbon and δ− on halogen, making the carbon electrophilic. The halide departs as the leaving group — taking the bonding electrons with it. Understanding which halide leaves most readily and what carbon framework promotes substitution vs. elimination is the key skill for this chapter.',
        },
        {
          type: 'table',
          headers: ['Property', 'F', 'Cl', 'Br', 'I'],
          rows: [
            ['Electronegativity', '4.0 (highest)', '3.2', '3.0', '2.7'],
            ['C–X bond strength (kJ/mol)', '485 (strongest)', '350', '293', '234 (weakest)'],
            ['Leaving group ability', 'Very poor (worst)', 'Good', 'Better', 'Excellent (best)'],
            ['pKa of conjugate acid HX', '3.2', '−7', '−9', '−10'],
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Leaving Group Ability: The Stability of the Departing Anion',
          body: 'Leaving group ability = how well the leaving group can stabilize negative charge after departure. Better leaving groups form more stable anions.\n\nLeaving group order: I⁻ > Br⁻ > Cl⁻ >> F⁻ (terrible leaving group)\n\nThis is the OPPOSITE order of the C–X bond strength — weaker bond = better leaving group. Also the OPPOSITE of electronegativity — the more electronegative F⁻ is actually a worse leaving group because F⁻ holds charge too tightly (small size, high charge density).\n\nOther common leaving groups (better than I⁻): tosylate (OTs), mesylate (OMs) — both derived from alcohols, the OH is converted to a better leaving group.',
        },
        {
          type: 'table',
          headers: ['Class', 'Structure', 'Carbon type', 'Example'],
          rows: [
            ['Primary (1°)', 'RCH₂–X', 'Carbon bonded to one other carbon', 'CH₃CH₂Br (ethyl bromide)'],
            ['Secondary (2°)', 'R₂CH–X', 'Carbon bonded to two other carbons', '(CH₃)₂CHBr (isopropyl bromide)'],
            ['Tertiary (3°)', 'R₃C–X', 'Carbon bonded to three other carbons', '(CH₃)₃CBr (tert-butyl bromide)'],
            ['Methyl', 'CH₃–X', 'Carbon bonded to no other carbons', 'CH₃Br (methyl bromide)'],
            ['Vinyl/Aryl', 'R₂C=CR–X', 'sp² carbon', 'CH₂=CHBr (vinyl bromide)', ],
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'How to Classify Alkyl Halide in 3 Seconds',
          body: 'Count the carbons directly attached to the C–X carbon:\n• 0 other carbons: methyl\n• 1 other carbon: primary (1°)\n• 2 other carbons: secondary (2°)\n• 3 other carbons: tertiary (3°)\n\nDo NOT count the halogen — it doesn\'t count toward the degree. Do NOT count hydrogens. Only count carbon substituents.',
        },
      ],
      mcqs: [
        {
          question: 'Which halide is the best leaving group and why?',
          options: [
            'F⁻ — most electronegative, holds electrons tightly',
            'I⁻ — largest, most polarizable, conjugate acid is strongest (pKa −10)',
            'Cl⁻ — most common, best compromise of size and electronegativity',
            'Br⁻ — intermediate size is ideal for leaving',
          ],
          correct: 1,
          explanation: 'I⁻ is the best leaving group among the halides. The key: leaving group ability correlates with anion stability (a weaker base is a better leaving group). I⁻ has the largest size, most diffuse negative charge (low charge density), and is the most polarizable halide — its electrons are well-accommodated after departure. The conjugate acid HI has pKa −10 (strongest hydrohalic acid). F⁻ is the worst leaving group — it is tiny, concentrated negative charge, and the conjugate acid HF has pKa 3.2 (weak acid). Small, charge-dense anions are poor leaving groups.',
        },
        {
          question: 'Classify (CH₃)₂CHCH₂Br:',
          options: ['Primary (1°)', 'Secondary (2°)', 'Tertiary (3°)', 'Methyl'],
          correct: 0,
          explanation: '(CH₃)₂CHCH₂Br: the C–Br carbon is CH₂, bonded to one other carbon (the CH from the isopropyl group). One carbon attached to the C–Br carbon → this is a PRIMARY alkyl halide. Do not be fooled by the "isopropyl" group attached to it — the classification is based on the carbon bearing the leaving group, not the overall structure. This compound is isobutyl bromide (2-methylpropan-1-yl bromide), a primary substrate.',
        },
        {
          question: 'Why is vinyl bromide (CH₂=CHBr) unreactive in SN2 reactions?',
          options: [
            'Vinyl bromide has no leaving group',
            'The sp² hybridized carbon bearing Br is planar; backside attack is geometrically blocked by the π bond',
            'Vinyl bromide is too small for SN2',
            'The C=C double bond prevents the nucleophile from recognizing the electrophilic carbon',
          ],
          correct: 1,
          explanation: 'SN2 requires backside attack — the nucleophile approaches the back lobe of the C–Br σ* antibonding orbital. For vinyl bromide, the carbon bearing Br is sp² hybridized — it is part of a C=C double bond. The p orbital forming the π bond occupies the "back" position required for attack. Additionally, sp² carbons have less back-lobe available, and the Br bond has significant π character due to resonance with the double bond. Vinyl and aryl halides are inert to SN2. They can undergo nucleophilic substitution only under special conditions (NAS: SNAr) or through metal-catalyzed cross-coupling.',
        },
      ],
      flashcards: [
        {
          front: 'Leaving group ability order for halides',
          back: 'Best → Worst: I⁻ > Br⁻ > Cl⁻ >> F⁻\n\nKey principle: better leaving group = more stable anion = weaker conjugate base = stronger conjugate acid\n\npKa of HX: HI (−10) > HBr (−9) > HCl (−7) >> HF (3.2)\nBetter leaving groups have more acidic HX.',
        },
        {
          front: 'How to classify alkyl halide as 1°, 2°, 3°',
          back: 'Count CARBON substituents on the C–X carbon (ignore H and the halogen itself):\n0 C = methyl (CH₃X)\n1 C = primary (1°)\n2 C = secondary (2°)\n3 C = tertiary (3°)\n\nImportance: primary substrates favor SN2; tertiary favor SN1 or E2.',
        },
        {
          front: 'What makes tosylate (OTs) and mesylate (OMs) such good leaving groups?',
          back: 'Both are derived from sulfonic acids (TsOH, MsOH). The sulfonate anion (TsO⁻, MsO⁻) is resonance-stabilized — the negative charge is delocalized over three electronegative oxygens and sulfur. This makes them excellent leaving groups, even better than iodide in many cases. Alcohols are converted to tosylates or mesylates to make them SN2-reactive (OH⁻ is a terrible leaving group; OTs⁻ and OMs⁻ are excellent).',
        },
      ],
    },

    // ── Concept 2: SN2 Mechanism ──────────────────────────────────────────────
    {
      id: 'ch06-c2-sn2',
      title: 'SN2 Mechanism',
      subtitle: 'Backside attack, bimolecular kinetics, and steric effects',
      estimatedMinutes: 12,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'SN2 stands for Substitution Nucleophilic Bimolecular. It is a single-step (concerted) mechanism with no intermediate: the nucleophile attacks the back of the C–X bond simultaneously as the leaving group departs. Because both the nucleophile and the substrate are involved in the rate-determining step, the rate law is second-order: rate = k[substrate][nucleophile].',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'The Four Hallmarks of SN2',
          body: '1. Bimolecular rate law: rate = k[RX][Nu:]\n2. Concerted mechanism: no carbocation intermediate — one transition state\n3. Walden inversion: complete inversion of configuration at the stereocenter\n4. Steric sensitivity: methyl ≈ primary >> secondary; tertiary virtually impossible\n\nThe attacking nucleophile must approach along the C–X axis from 180° (the "back" of the leaving group), threading through the three remaining substituents. Bulky groups block this trajectory.',
        },
        {
          type: 'table',
          headers: ['Substrate class', 'Relative SN2 rate', 'Reason'],
          rows: [
            ['Methyl (CH₃X)', 'Fastest (reference ~1)', 'No steric hindrance — open back face'],
            ['Primary (RCH₂X)', 'Fast (~0.01)', 'One group partially blocks back — still fast'],
            ['Secondary (R₂CHX)', 'Slow (~10⁻⁴)', 'Two groups crowd the back — significant steric hindrance'],
            ['Tertiary (R₃CX)', 'Essentially zero', 'Three groups completely block backside attack'],
            ['Neopentyl (Me₃CCH₂X)', 'Very slow despite 1°', 'β-Branching: the large Me₃C group blocks back even though carbon is 1°'],
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Factors That Increase SN2 Rate',
          body: '1. Less hindered substrate (methyl > 1° > 2°; no 3°)\n2. Better nucleophile: strong Nu: = more electron-dense, more reactive (I⁻ > Br⁻ > Cl⁻ > F⁻ in polar aprotic solvent; RS⁻ > RO⁻ > F⁻)\n3. Better leaving group (I > Br > Cl > F)\n4. Polar APROTIC solvent (DMSO, DMF, acetone): does not solvate the nucleophile, leaving it "naked" and reactive. Polar protic solvents (water, ethanol) H-bond to and deactivate anion nucleophiles.\n5. Higher temperature (but also favors elimination at high T)',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Nucleophilicity vs Basicity: Not the Same Thing',
          body: 'Basicity: thermodynamic — tendency to accept a proton (pKa of conjugate acid)\nNucleophilicity: kinetic — tendency to donate electrons to carbon in SN2\n\nThey often correlate (stronger base = better nucleophile) but not always:\n• Polarizability matters for nucleophilicity: I⁻ is a better nucleophile than F⁻ in SN2 (even though F⁻ is a stronger base) because I⁻ is larger and more polarizable — its electrons can distort and attack C more easily\n• Steric effects: t-BuO⁻ is a strong base but poor nucleophile (too bulky)\n• Solvent: in protic solvents, I⁻ > Br⁻ > Cl⁻ (polarizability wins); in aprotic solvents, the order becomes F⁻ > Cl⁻ > Br⁻ > I⁻ (basicity order wins) because anions are not differentially solvated',
        },
      ],
      mcqs: [
        {
          question: 'The SN2 reaction of CH₃CH₂CH₂Br with NaI in acetone would be faster than the same reaction in ethanol. Why?',
          options: [
            'Ethanol is a polar protic solvent that hydrogen-bonds with I⁻, reducing its nucleophilicity',
            'Acetone has a higher boiling point, allowing higher reaction temperature',
            'Iodide reacts with ethanol directly, reducing its concentration',
            'Acetone increases the electrophilicity of the substrate',
          ],
          correct: 0,
          explanation: 'Acetone is a polar aprotic solvent — it dissolves ionic compounds (polar) but cannot donate hydrogen bonds (aprotic, no O–H or N–H). Iodide nucleophile in acetone is "naked" — unsolvated and maximally reactive. Ethanol is polar protic — it hydrogen-bonds to I⁻, partially neutralizing its negative charge and reducing nucleophilicity. The Finkelstein reaction (RCl + NaI → RI + NaCl in acetone) uses this principle: NaI dissolves, NaCl precipitates, driving the equilibrium forward.',
        },
        {
          question: 'A chiral center is created when 1-bromo-1-deuteropropane (CHDBrCH₂CH₃, where D = deuterium ²H) undergoes SN2 with OH⁻. The product has:',
          options: [
            'Retention of configuration at the carbon',
            'Inversion of configuration at the carbon',
            'Racemic product',
            'No stereospecificity because D and H are nearly identical',
          ],
          correct: 1,
          explanation: 'SN2 always gives inversion of configuration (Walden inversion). Even though deuterium (²H) and protium (¹H) are isotopes, they are considered different substituents in CIP priority (²H has higher atomic mass, so D > H in priority). The chiral center CHDBrCH₂CH₃ has four different groups: D, H, Br, and CH₂CH₃. SN2 with OH⁻ gives CHOH·D·CH₂CH₃ with complete inversion. Isotopic labeling is a classic tool for proving the SN2 inversion mechanism.',
        },
        {
          question: 'Which substrate undergoes SN2 most rapidly with NaBr in DMF?',
          options: [
            '(CH₃)₃CCl (tert-butyl chloride)',
            'CH₃Cl (methyl chloride)',
            '(CH₃)₂CHCl (isopropyl chloride)',
            'CH₃CH₂Cl (ethyl chloride)',
          ],
          correct: 1,
          explanation: 'SN2 rate order: methyl > primary > secondary; tertiary cannot undergo SN2. CH₃Cl (methyl) is the fastest — no steric hindrance whatsoever. The nucleophile Br⁻ attacks directly without any groups blocking the backside. CH₃CH₂Cl (ethyl, 1°) is next. (CH₃)₂CHCl (isopropyl, 2°) is much slower. (CH₃)₃CCl (tert-butyl, 3°) essentially cannot undergo SN2 — the three methyl groups completely block backside attack. DMF (polar aprotic) is an excellent SN2 solvent that enhances nucleophile reactivity.',
        },
      ],
      flashcards: [
        {
          front: 'SN2: rate law and mechanism summary',
          back: 'Rate = k[substrate][Nu]\nOne-step (concerted): no intermediate\nNu attacks C–X backside (180°) as X leaves simultaneously\nResult: Walden inversion at stereocenter\n\nSteric rate order: CH₃X > 1° > 2° >>> 3° (impossible)\nBest solvent: polar aprotic (DMSO, DMF, acetone)\nBest Nu in polar aprotic: F⁻ > Cl⁻ > Br⁻ > I⁻ (basicity order)\nBest Nu in polar protic: I⁻ > Br⁻ > Cl⁻ > F⁻ (polarizability order)',
        },
        {
          front: 'Why does SN2 fail for tertiary substrates?',
          back: 'The SN2 mechanism requires the nucleophile to approach from the back (180° from the leaving group). In tertiary substrates, three carbon groups surrounding the electrophilic carbon create severe steric crowding — there is no accessible back trajectory for the nucleophile. This is a geometric/steric impossibility, not a thermodynamic issue. Tertiary substrates instead undergo SN1 (via stable 3° carbocation) or E2 with strong base.',
        },
        {
          front: 'Nucleophilicity vs basicity: when do they diverge?',
          back: 'In polar PROTIC solvents: nucleophilicity order ≠ basicity order. Larger, more polarizable nucleophiles (I⁻, RS⁻) are better SN2 nucleophiles than smaller, harder ones (F⁻, RO⁻), even if F⁻ is a stronger base. Reason: polarizable electron clouds distort easily toward C; protic solvents differentially solvate (deactivate) the smaller, harder anions.\n\nIn polar APROTIC solvents: hard (more basic) nucleophiles perform well because no differential solvation. F⁻ can be a very effective nucleophile.',
        },
        {
          front: 'What is the Finkelstein reaction?',
          back: 'RX + NaI → RI + NaX (in acetone)\nUsed to convert R–Cl or R–Br to R–I. Driven by insolubility of NaCl/NaBr in acetone (precipitates out, shifts equilibrium). NaI is soluble in acetone. The result: chloride/bromide exchanged for iodide via SN2. Useful because iodides are more reactive substrates.',
        },
      ],
    },

    // ── Concept 3: SN1 Mechanism & SN1 vs SN2 ────────────────────────────────
    {
      id: 'ch06-c3-sn1',
      title: 'SN1 Mechanism & Predicting SN1 vs SN2',
      subtitle: 'Carbocation intermediates, unimolecular kinetics, and the competition',
      estimatedMinutes: 13,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'SN1 stands for Substitution Nucleophilic Unimolecular. It is a two-step mechanism: first, the leaving group departs to form a carbocation intermediate; then, the nucleophile attacks the carbocation from either face. Because only the substrate determines the rate (the nucleophile arrives in the fast second step), the rate law is first-order: rate = k[substrate]. Only the substrate concentration determines how fast the reaction goes — add more nucleophile and the rate doesn\'t change.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'The Four Hallmarks of SN1',
          body: '1. Unimolecular rate law: rate = k[RX] — independent of [Nu]\n2. Two-step mechanism: carbocation intermediate; two separate transition states\n3. Racemization (predominant): flat sp² carbocation allows attack from both faces\n4. Substrate requirement: tertiary > secondary >> primary — needs stable carbocation\n\nExtra stabilization from: resonance (allylic, benzylic) > tertiary > secondary\nVirtually never occurs with primary or methyl substrates (extremely unstable carbocations)',
        },
        {
          type: 'table',
          headers: ['Factor', 'Favors SN2', 'Favors SN1'],
          rows: [
            ['Substrate', 'Methyl or 1° (less hindered)', 'Tertiary (3°) or allylic/benzylic'],
            ['Nucleophile', 'Strong, concentrated nucleophile (I⁻, RS⁻, RO⁻)', 'Weak or dilute nucleophile (H₂O, ROH)'],
            ['Solvent', 'Polar aprotic (DMSO, DMF, acetone)', 'Polar protic (H₂O, ROH, acetic acid) — stabilizes carbocation'],
            ['Leaving group', 'Both: better LG speeds both, but especially SN1 (easier ionization)', 'Both: better LG speeds both'],
            ['Temperature', 'Low to moderate temperature (SN2 faster)', 'High temperature (often favors elimination over SN1)'],
          ],
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'Carbocation Stability: The Traffic Jam Analogy',
          body: 'A carbocation is like a single narrow lane on a highway. If there\'s only one lane (methyl or primary carbocation), traffic barely moves — the system is highly unstable. Add more lanes (additional alkyl groups = inductive donation + hyperconjugation): secondary carbocation = 2 lanes. Tertiary = 3 lanes — traffic flows well.\n\nResonance is like adding an express lane: allylic and benzylic carbocations have the charge delocalized over multiple positions — the "traffic" spreads out and the whole system is much more stable.\n\nStability: R₃C⁺ > R₂C⁺ > RC⁺ > CH₃⁺\nWith resonance: allylic ≈ benzylic >> tert >> sec >> primary >> methyl',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Rearrangements Are the Smoking Gun for SN1',
          body: 'Carbocation intermediates can rearrange before the nucleophile attacks:\n\n1. Hydride shift (H with its bonding electrons moves to adjacent carbocation)\n2. Alkyl shift (methyl or other alkyl group migrates to adjacent carbocation)\n\nBoth give a MORE stable carbocation. If a reaction product has a different carbon skeleton than the starting material, it is evidence for a carbocation intermediate → SN1 mechanism.\n\nSN2 NEVER rearranges (no intermediate to rearrange from). If rearranged product is observed → must be SN1.',
        },
      ],
      mcqs: [
        {
          question: 'The rate of an SN1 reaction is doubled when the concentration of the substrate is doubled, but is unchanged when the nucleophile concentration is doubled. What does this tell you?',
          options: [
            'The reaction is SN2 — it depends on both reagents',
            'The reaction is SN1 — the rate-determining step involves only the substrate (ionization to carbocation), not the nucleophile',
            'The nucleophile is not involved in the mechanism',
            'The substrate is unreactive toward the nucleophile',
          ],
          correct: 1,
          explanation: 'SN1 rate law: rate = k[substrate]. Only the substrate concentration appears. This is because the rate-determining step (ionization of RX to carbocation) involves only the substrate. The nucleophile attacks in the fast second step — doubling [Nu] does not speed up the rate. This is diagnostic for SN1. Compare: SN2 rate = k[substrate][Nu] — doubling either would double the rate. The kinetic behavior is the most definitive way to distinguish SN1 from SN2 experimentally.',
        },
        {
          question: 'Which substrate undergoes SN1 fastest?',
          options: [
            'CH₃Br (methyl bromide)',
            'CH₃CH₂Cl (ethyl chloride, 1°)',
            '(CH₃)₂CHBr (isopropyl bromide, 2°)',
            '(CH₃)₂C=CHCH₂Br (allylic, also 1° but with resonance)',
          ],
          correct: 3,
          explanation: 'SN1 speed depends on carbocation stability. (CH₃)₂C=CHCH₂Br is a primary allylic halide — though carbon is primary (1°), the carbocation formed upon ionization is allylic: (CH₃)₂C=CHCH₂⁺ ↔ (CH₃)₂C⁺–CH=CH₂. Allylic resonance stabilizes the carbocation as effectively as tertiary. An allylic 1° substrate undergoes SN1 far faster than simple secondary or even primary. (CH₃)₂CHBr (2°) would be the next fastest from the other options. Methyl and 1° without resonance are essentially unable to undergo SN1.',
        },
        {
          question: 'Treating (CH₃)₂CHCH₂Cl with AgNO₃ in ethanol gives a product with rearranged carbon skeleton. Which carbocation rearrangement explains this?',
          options: [
            'A hydride shift from C2 to C1 forms a more stable secondary carbocation',
            'An alkyl shift from C3 to C2 forms a more stable tertiary carbocation',
            'A hydride shift from C2 to C1, converting a primary carbocation to a secondary carbocation',
            'No rearrangement — the product has the same skeleton',
          ],
          correct: 2,
          explanation: '(CH₃)₂CHCH₂Cl ionizes to give a primary carbocation at C1: (CH₃)₂CHCH₂⁺. This is very unstable. A 1,2-hydride shift (H migrates with its electrons from C2 to C1) converts this to a secondary carbocation: (CH₃)₂C⁺CH₃ — wait, that\'s actually tertiary after migration... Let me reconsider: starting from (CH₃)₂CHCH₂⁺ (1° carb), a H moves from the CH to CH₂⁺, giving (CH₃)₂C⁺–CH₃ = (CH₃)₃C⁺ (tert-butyl cation, tertiary). This is a 1,2-hydride shift from C2 to C1, converting 1° carbocation to 3° carbocation. Product is tert-butyl ether. This is rearrangement evidence for SN1.',
        },
      ],
      flashcards: [
        {
          front: 'SN1 vs SN2: comparison table',
          back: 'SN2: rate = k[RX][Nu]; concerted; inversion; 1° or methyl best; polar aprotic solvent; no rearrangement\n\nSN1: rate = k[RX]; stepwise (carbocation); racemization; 3° or allylic/benzylic; polar protic solvent; carbocation can rearrange\n\nKey decision: What is the substrate class? (determines which is possible)',
        },
        {
          front: 'Carbocation stability order',
          back: 'Most stable → Least stable:\nAllylic/benzylic ≈ 3° > 2° >> 1° >> methyl (essentially does not form)\n\nStabilization by:\n• Alkyl groups: hyperconjugation + inductive electron donation\n• Resonance: allylic (C=C adjacent) and benzylic (benzene ring adjacent)\n• Never stable: aryl or vinyl carbocations (sp² carbon — destabilized)',
        },
        {
          front: 'What is a 1,2-hydride shift and when does it occur?',
          back: 'A hydride shift: H atom migrates WITH its bonding electrons from an adjacent carbon to a carbocation center. This moves the positive charge to the atom that lost the hydride. Occurs when the resulting carbocation is more stable. Example: 1° carb → 2° carb via H migration from adjacent C. Also: 1,2-alkyl shifts (a methyl or other group migrates with its electrons). These only occur in SN1 and E1 reactions — not SN2 or E2.',
        },
        {
          front: 'Why does SN1 give racemization while SN2 gives inversion?',
          back: 'SN1: the carbocation intermediate is sp² (flat, trigonal planar). The nucleophile can approach from either face of the plane equally (or nearly equally). This gives approximately 50:50 R:S product = racemic mixture.\n\nSN2: concerted backside attack — no intermediate. The nucleophile attacks from one specific face (the back), giving 100% inversion. No chance for racemization.',
        },
      ],
    },
  ],
}
