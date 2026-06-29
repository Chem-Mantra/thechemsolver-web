import type { OrgoChapter } from '../types'

export const CH08: OrgoChapter = {
  id: 'ch08',
  number: 8,
  title: 'Alkenes — Reactions & Synthesis',
  orgo: 1,
  accentHex: '#10b981',
  concepts: [

    // ── Concept 1: Electrophilic Addition & Markovnikov ──────────────────────
    {
      id: 'ch08-c1-electrophilic-addition',
      title: 'Electrophilic Addition & Markovnikov\'s Rule',
      subtitle: 'How electrophiles attack the π bond and why regiochemistry matters',
      estimatedMinutes: 14,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'Alkenes are nucleophiles — their π electrons are loosely held and available to donate to electrophiles. The general mechanism of electrophilic addition is: (1) the π electrons attack an electrophile, forming a carbocation intermediate; (2) a nucleophile attacks the carbocation. The regiochemistry — which end of the double bond the electrophile adds to — is governed by Markovnikov\'s rule.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Markovnikov\'s Rule (Modern Form)',
          body: 'Markovnikov\'s rule: in electrophilic addition of HX to an asymmetric alkene, the hydrogen adds to the carbon that already has MORE hydrogens (or: the electrophile adds to give the MORE STABLE carbocation intermediate).\n\nOriginal statement: "H adds to the carbon with more H\'s"\nMechanistic statement: "The more stable carbocation forms first"\n\nThey are equivalent: the carbon with more H\'s is generally the less substituted end, and adding H there gives the more substituted (more stable) carbocation on the other end.\n\nExample: CH₃CH=CH₂ + HBr → CH₃CHBrCH₃ (major, Markovnikov) — H adds to CH₂ (more H\'s), Br goes to CHMe (more stable 2° carb vs 1° carb).',
        },
        {
          type: 'table',
          headers: ['Reagent', 'Mechanism', 'Regiochemistry', 'Stereochemistry', 'Key notes'],
          rows: [
            ['HX (HCl, HBr, HI)', 'Protonation → carbocation → Nu attack', 'Markovnikov (X to more substituted C)', 'Racemization (planar carbocation)', 'Rate: HI > HBr > HCl > HF (LG ability)'],
            ['H₂SO₄/H₂O', 'Protonation → carbocation → water', 'Markovnikov (OH to more substituted C)', 'Racemization', 'Acid-catalyzed hydration'],
            ['Hg(OAc)₂/H₂O then NaBH₄', 'Mercurinium ion (3-membered), anti-add', 'Markovnikov (OH to more substituted)', 'Net retention; no rearrangement', 'Oxymercuration–demercuration'],
            ['HBr + ROOR (peroxide)', 'Radical addition', 'Anti-Markovnikov (Br to less substituted)', 'No stereospecificity', 'Radical mechanism (ROOR = radical initiator)'],
            ['X₂ (Br₂, Cl₂)', 'Bromonium ion (3-membered ring)', 'X both carbons', 'Anti addition (trans dihalide)', 'Stereospecific; Br₂ in CCl₄ decolorizes'],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'HBr + Peroxide = Anti-Markovnikov! The Exception',
          body: 'In the presence of peroxides (ROOR) or UV light, HBr adds by a radical chain mechanism:\n• Initiation: ROOR → RO• → HBr → Br• radical\n• Propagation: Br• adds to the alkene at the less hindered carbon (anti-Markovnikov) → carbon radical at more substituted carbon → reacts with HBr → Br• regenerated\n\nResult: Br goes to the less substituted carbon — the OPPOSITE of normal Markovnikov addition.\n\nIMPORTANT: This ONLY applies to HBr (not HCl or HI — their radical additions are not useful). Adding ROOR changes the mechanism from ionic to radical.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Bromonium Ion: Why Br₂ Addition Is Anti (Trans)',
          body: 'When Br₂ approaches an alkene, one Br acts as electrophile. The π electrons attack one Br, pushing electrons to the other Br (forming Br⁻), and simultaneously the attacked Br bridges both carbons of the double bond — forming a 3-membered bromonium ion ring.\n\nThe Br⁻ then attacks the bromonium ion from the back face (anti attack, like SN2) at either carbon.\n\nResult: the two Br atoms add to OPPOSITE faces of the original alkene — anti addition. Product is trans-1,2-dibromide (from a cis alkene) or cis-1,2-dibromide (from a trans alkene). This is highly stereospecific.\n\nIn water, water attacks the bromonium ion instead of Br⁻ → bromohydrin (OH and Br trans, Markovnikov orientation of OH).',
        },
      ],
      mcqs: [
        {
          question: 'What is the major product of HBr addition to 2-methylpropene (isobutylene, (CH₃)₂C=CH₂)?',
          options: [
            '1-Bromo-2-methylpropane: (CH₃)₂CHCH₂Br (anti-Markovnikov)',
            '2-Bromo-2-methylpropane: (CH₃)₂CBrCH₃ (Markovnikov)',
            'Equal amounts of both (no regioselectivity)',
            '2-Bromo-1-methylpropane (rearranged product)',
          ],
          correct: 1,
          explanation: 'Markovnikov addition: HBr adds so that H goes to the less substituted carbon (=CH₂) and Br goes to the more substituted carbon (C(CH₃)₂). Mechanistically: proton adds to =CH₂ to give the tert-butyl carbocation [(CH₃)₃C⁺], which is tertiary and stable. The alternative would give a primary carbocation [(CH₃)₂CHCH₂⁺] — much less stable. Br⁻ attacks the tertiary carbocation → (CH₃)₂CBrCH₃ (2-bromo-2-methylpropane, also called tert-butyl bromide). This is the major product.',
        },
        {
          question: 'Br₂ is added to cis-2-butene in CCl₄. Which product is formed?',
          options: [
            'meso-2,3-dibromobutane (anti addition to cis gives meso)',
            '(±)-2,3-dibromobutane, racemic mixture (anti addition to cis gives both R,R and S,S)',
            'cis-2,3-dibromobutane (syn addition)',
            'No reaction — cis-2-butene does not react with Br₂',
          ],
          correct: 0,
          explanation: 'Br₂ addition to alkenes is anti (trans) addition — the two Br atoms add to opposite faces. For cis-2-butene: the two methyl groups are on the same face. Anti addition of Br places one Br on each face. The product is meso-2,3-dibromobutane — it has R configuration at one carbon and S at the other, with an internal plane of symmetry → optically inactive. If it were trans-2-butene, anti addition would give the (R,R) + (S,S) enantiomers = racemic mixture. So the alkene geometry determines the product stereochemistry in Br₂ addition.',
        },
        {
          question: 'Propene reacts with HBr in the presence of benzoyl peroxide (a radical initiator). What is the major product?',
          options: [
            '2-Bromopropane (CH₃CHBrCH₃) — Markovnikov',
            '1-Bromopropane (BrCH₂CH₂CH₃) — anti-Markovnikov',
            '1,2-Dibromopropane',
            '2-Propanol',
          ],
          correct: 1,
          explanation: 'In the presence of a radical initiator (peroxide or UV), HBr adds by a radical chain mechanism with ANTI-MARKOVNIKOV regiochemistry. Br• radical adds to the less hindered terminal carbon of propene (=CH₂), giving the more stable secondary radical on the internal carbon (CH₃CH•CH₂Br... wait — actually Br adds to terminal CH₂ to give •CHCH₃ at internal carbon — a secondary radical, more stable than primary). The secondary radical reacts with HBr to give 1-bromopropane and regenerate Br•. Result: 1-bromopropane (anti-Markovnikov). Compare: ionic HBr addition (no peroxide) → 2-bromopropane (Markovnikov).',
        },
      ],
      flashcards: [
        {
          front: 'Markovnikov\'s rule: mechanistic interpretation',
          back: 'In HX addition to an asymmetric alkene:\n→ H⁺ adds to the carbon with MORE hydrogens (less substituted C)\n→ X⁻ adds to the carbon with FEWER hydrogens (more substituted C)\n\nWhy: the more substituted carbocation forms as the intermediate (more stable). The regioselectivity follows carbocation stability: 3° > 2° > 1°.',
        },
        {
          front: 'Br₂ addition to alkenes: mechanism and stereochemistry',
          back: 'Step 1: Br₂ approaches alkene; one Br bridges both C of C=C as bromonium ion (3-membered ring with + charge on Br)\nStep 2: Br⁻ attacks from the back face of bromonium (anti attack)\nResult: ANTI (trans) addition of two Br atoms\n\nCis alkene → meso dibromide\nTrans alkene → racemic (R,R)/(S,S) dibromide\n\nBr₂/H₂O → bromohydrin (anti; OH Markovnikov, Br anti-Markovnikov)',
        },
        {
          front: 'When does HBr add anti-Markovnikov to alkenes?',
          back: 'When radical initiators are present: ROOR (peroxides) or hν (UV light). The mechanism switches from ionic (Markovnikov) to radical chain (anti-Markovnikov).\n\nThis ONLY applies to HBr — HCl and HI do not give useful anti-Markovnikov radical additions.\n\nNo peroxide: HBr → Markovnikov (ionic)\nWith peroxide: HBr → anti-Markovnikov (radical)',
        },
        {
          front: 'Oxymercuration–demercuration: when and why?',
          back: 'Reagents: Hg(OAc)₂/H₂O, then NaBH₄\nResult: Markovnikov addition of water (OH to more substituted C)\nAdvantage over acid-catalyzed hydration: no carbocation formed → no rearrangements!\n\nMechanism: mercurinium ion (like bromonium) → anti attack by water → NaBH₄ removes Hg and replaces with H. Net retention of configuration. Perfect when rearrangement would be a problem.',
        },
      ],
    },

    // ── Concept 2: Syn Addition Reactions ────────────────────────────────────
    {
      id: 'ch08-c2-syn-addition',
      title: 'Syn Addition: Hydroboration & Catalytic Hydrogenation',
      subtitle: 'Adding across the double bond from the same face',
      estimatedMinutes: 11,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'While most electrophilic additions are anti (trans), two important reactions add both groups to the same face of the alkene: hydroboration–oxidation and catalytic hydrogenation. These are "syn" additions. Understanding them is essential for stereochemistry problems and synthesis planning.',
        },
        {
          type: 'table',
          headers: ['Reaction', 'Reagents', 'Product', 'Regiochem.', 'Stereochem.'],
          rows: [
            ['Hydroboration-oxidation', 'BH₃·THF (or 9-BBN), then H₂O₂/NaOH', 'Primary or anti-Markovnikov alcohol', 'Anti-Markovnikov (OH to less substituted C)', 'Syn addition'],
            ['Catalytic hydrogenation', 'H₂, Pd/C (or Pt, Ni)', 'Alkane (both H added)', 'N/A (both carbons get H)', 'Syn addition (both H from same face of metal)'],
            ['Hydroboration then protonolysis', 'BH₃·THF, then H₂O (or AcOH)', 'Alkane (anti-Markovnikov)', 'Anti-Markovnikov', 'Syn addition of B and H'],
            ['Epoxidation then ring-opening', 'm-CPBA (peracid), then Nu:', 'Trans-diol or trans-Nu-OH', 'Markovnikov (Nu to more substituted C)', 'Anti addition overall'],
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Hydroboration–Oxidation: Anti-Markovnikov Alcohol',
          body: 'BH₃ adds to the alkene in a 4-centered cyclic transition state: B and H add simultaneously to the same face (SYN) with B going to the less hindered (less substituted) carbon — anti-Markovnikov.\n\nKey features:\n• No carbocation intermediate → no rearrangements\n• Syn addition: B and H add to the same face\n• B ends up on the less substituted C (anti-Markovnikov)\n• H₂O₂/NaOH oxidizes C–B bond to C–OH with RETENTION of configuration\n• Net: anti-Markovnikov, syn addition of water\n\nSyn + anti-Markovnikov → gives the alcohol that acid-catalyzed hydration (Markovnikov) cannot make',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Why Syn? The Metal Surface Mechanism for Hydrogenation',
          body: 'In catalytic hydrogenation (H₂/Pd or H₂/Pt): both H₂ molecules are adsorbed onto the metal surface. The alkene also adsorbs onto the metal surface (π bond interacts with metal). Both H atoms are transferred from the same face of the metal surface to the same face of the alkene — SYN addition.\n\nPractical consequence: if you hydrogenate a cis alkene, you get a specific diastereomer of the alkane (both H\'s added to the same face as the existing groups). This is stereospecific. Used in asymmetric synthesis with chiral metal catalysts.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Lindlar vs Na/NH₃ for Alkynes',
          body: 'Two methods to partially reduce an alkyne to an alkene:\n\n1. Lindlar catalyst (Pd/CaCO₃ poisoned with Pb/quinoline) + H₂:\n   → SYN addition → cis alkene (Z-alkene)\n   "Lindlar = cis"\n\n2. Na (or Li) in liquid NH₃ (dissolving metal reduction):\n   → radical anion mechanism → trans alkene (E-alkene)\n   "Dissolving metal = trans"\n\nBoth stop at the alkene (not alkane) because the alkene adsorbs less favorably than alkyne on Lindlar, and the radical anion mechanism is selective. Full reduction to alkane: H₂ + Pd/C (no catalyst poisoning).',
        },
      ],
      mcqs: [
        {
          question: 'What is the product of hydroboration–oxidation of 1-methylcyclohexene?',
          options: [
            '1-methylcyclohexan-1-ol (Markovnikov addition of OH)',
            'trans-2-methylcyclohexan-1-ol (syn addition, anti-Markovnikov, OH at C1)',
            'cis-2-methylcyclohexan-1-ol (syn addition, anti-Markovnikov, OH at C2)',
            '1-methylcyclohexene oxide (epoxide)',
          ],
          correct: 2,
          explanation: '1-methylcyclohexene has a C1=C2 double bond with methyl on C1. Hydroboration: B goes to the less substituted carbon (C2, anti-Markovnikov); H goes to C1. Both B and H add to the SAME face (syn addition). Oxidation with H₂O₂/NaOH replaces B with OH with retention. Result: OH on C2, H added to C1 from the same face as OH. Since addition is syn and the most accessible face is the less hindered equatorial face, the product is cis-2-methylcyclohexan-1-ol — OH and methyl on the same face. This is a classic distinction from acid-catalyzed hydration which gives 1-methylcyclohexan-1-ol (Markovnikov).',
        },
        {
          question: 'Propyne (CH₃C≡CH) is treated with Lindlar catalyst and H₂. What is the product?',
          options: [
            'Propane (CH₃CH₂CH₃) — full reduction',
            'cis-1-propene (same as propene — but propene is not cis/trans)',
            'Propene (CH₃CH=CH₂) from syn addition, but propene has no geometric isomers',
            'trans-propene — dissolving metal gives trans',
          ],
          correct: 2,
          explanation: 'Lindlar catalyst adds H₂ by syn addition to give an alkene. Propyne → propene (CH₃CH=CH₂). For this specific case, propene (a trisubstituted alkene with one hydrogen on C1 and two methyls... wait, propene is CH₃CH=CH₂: monosubstituted) does not have cis/trans isomers because one carbon of the double bond (CH₂=) has two identical H atoms. So Lindlar gives propene (the cis/trans distinction only matters for disubstituted internal alkynes like 2-pentyne → cis-2-pentene via Lindlar).',
        },
        {
          question: 'Catalytic hydrogenation of cis-2-butene gives what stereochemical result?',
          options: [
            'Racemic butane',
            'meso-butane',
            'Butane — no new stereocenters formed for this specific alkene',
            'trans-butane',
          ],
          correct: 2,
          explanation: 'Hydrogenation of cis-2-butene (CH₃CH=CHCH₃, Z) adds H₂ syn. The product is butane (CH₃CH₂CH₂CH₃). Butane itself has no stereocenters (the C2 and C3 carbons are not stereocenters — they each have two H\'s). For hydrogenation stereochemistry to be meaningful, we need a prochiral alkene that generates stereocenters upon addition. Example: hydrogenation of 2-butene does give diastereomeric butane-d₂ if deuterium (D₂) is used. With H₂, butane has no stereoisomers.',
        },
      ],
      flashcards: [
        {
          front: 'Hydroboration-oxidation: reagents, product, mechanism summary',
          back: 'Reagents: 1) BH₃·THF (or 9-BBN for bulkier), 2) H₂O₂, NaOH\nProduct: anti-Markovnikov alcohol (OH on less substituted C)\nMechanism: concerted 4-membered cyclic TS; SYN addition of B and H\nResult: syn + anti-Markovnikov + retention at C–B → C–OH\nNo carbocation, no rearrangements',
        },
        {
          front: 'Lindlar vs dissolving metal reduction of alkynes',
          back: 'Lindlar catalyst (H₂, Pd/CaCO₃/Pb): syn addition → CIS (Z) alkene\nDissolving metal (Na/NH₃ or Li/NH₃): radical anion mechanism → TRANS (E) alkene\n\nMnemonic: "Lindlar = cis; Liquid ammonia = trans"\n\nFull reduction to alkane: H₂/Pd/C (unmodified catalyst, no LG)',
        },
        {
          front: 'Syn vs anti addition to alkenes',
          back: 'SYN addition (same face): hydroboration-oxidation, catalytic hydrogenation, Lindlar H₂, epoxidation\n\nANTI addition (opposite faces): Br₂, Cl₂, bromohydrin formation (Br₂/H₂O), HBr without peroxide (anti via anti-Markovnikov attack on bromonium? Actually HX is anti for some substrates — depends)\n\nKey: Br₂ is definitively ANTI (bromonium); BH₃ is definitively SYN (4-centered TS)',
        },
      ],
    },

    // ── Concept 3: Oxidative Cleavage & Synthesis Strategy ───────────────────
    {
      id: 'ch08-c3-oxidative-cleavage',
      title: 'Oxidative Cleavage & Alkene Synthesis',
      subtitle: 'Ozonolysis, permanganate, and disconnection strategies',
      estimatedMinutes: 11,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'Oxidative cleavage reactions break the C=C double bond and install oxygen-containing functional groups at each fragment. They are powerful tools for both analysis (determining alkene structure) and synthesis (preparing carbonyl compounds). Two main reagents: ozone (O₃) for ozonolysis, and permanganate (KMnO₄) for dihydroxylation or oxidative cleavage.',
        },
        {
          type: 'table',
          headers: ['Reagent conditions', 'Product from R₂C=CR\'₂', 'Product from RCH=CHR\'', 'Product from RCH=CH₂'],
          rows: [
            ['O₃ then (CH₃)₂S (reductive workup)', 'Two ketones (R₂C=O + R\'₂C=O)', 'Two aldehydes (RCHO + R\'CHO)', 'Aldehyde + formaldehyde (RCHO + HCHO)'],
            ['O₃ then H₂O₂ (oxidative workup)', 'Two ketones (same)', 'Two carboxylic acids (RCOOH + R\'COOH)', 'Carboxylic acid + CO₂ (RCOOH + CO₂)'],
            ['KMnO₄ (cold, dilute, basic)', 'cis-Diol (OH on same face)', 'cis-Diol', 'Diol'],
            ['KMnO₄ (hot, concentrated, acidic)', 'Two ketones', 'Two carboxylic acids (RCOOH + R\'COOH)', 'Carboxylic acid + CO₂'],
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Ozonolysis: How to Identify Unknown Alkenes',
          body: 'Ozonolysis is the most powerful tool for identifying the position of a double bond:\n1. Write the products from ozonolysis (ozone cuts the C=C, puts =O on each fragment)\n2. Work backwards: identify what two carbonyl compounds would combine to regenerate the alkene\n\nWorking backwards from products:\n• If product is RCHO (aldehyde) → that carbon was =CHR in the alkene (one H on that C)\n• If product is RCHO where R = H (formaldehyde, HCHO) → that carbon was =CH₂ in the alkene (terminal alkene)\n• If product is R₂C=O (ketone) → that carbon was =CR₂ in the alkene (no H on that C)\n\nMnemonics: "Ozonolysis — break the bond, put oxygen where the π bond was"',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Retrosynthesis: Alkenes from Disconnection',
          body: 'Alkenes are made by:\n1. Elimination from alkyl halides (E2: strong base; E1: polar protic, tertiary)\n2. Dehydration of alcohols (H₂SO₄, heat)\n3. Reduction of alkynes (Lindlar: cis; Na/NH₃: trans)\n4. Wittig reaction (gives specific geometry, see Ch 16)\n\nSynthesis planning (retrosynthesis): look at the target molecule and ask "where might the alkene come from?" Disconnect the C=C bond and imagine an alkyl halide precursor with H on one carbon and LG on the adjacent carbon. Which elimination conditions give the desired regiochemistry (Zaitsev vs Hofmann)?',
        },
      ],
      mcqs: [
        {
          question: 'Ozonolysis of 2-butene followed by reductive workup ((CH₃)₂S) gives what products?',
          options: [
            'Two equivalents of acetaldehyde (CH₃CHO)',
            'One equivalent of butanal (CH₃CH₂CH₂CHO)',
            'Two equivalents of acetic acid (CH₃COOH)',
            'Acetone + formaldehyde',
          ],
          correct: 0,
          explanation: '2-Butene (CH₃CH=CHCH₃): the C=C bond between C2 and C3 is cleaved. Each carbon of the former double bond becomes a carbonyl carbon. C2 (–CH–) with one methyl → CH₃CHO (acetaldehyde). C3 (–CH–) with one methyl → CH₃CHO (acetaldehyde). Two equivalents of acetaldehyde. Reductive workup ((CH₃)₂S) gives aldehydes (not acids). Oxidative workup (H₂O₂) would give acetic acid from these same carbons. This is also why ozonolysis is a useful identification tool: two identical fragments from a symmetrical alkene like 2-butene.',
        },
        {
          question: 'An alkene of unknown structure is treated with ozone followed by H₂O₂. The products are cyclohexanone (O=cyclohexyl) and carbon dioxide. What is the structure of the alkene?',
          options: [
            'Methylenecyclohexane (cyclohexane with =CH₂)',
            '1-Methylcyclohexene',
            'Cyclohexene',
            'Cyclohexyl vinyl ether',
          ],
          correct: 0,
          explanation: 'Oxidative workup of ozonolysis converts terminal =CH₂ to CO₂ (H₂C=O from ozonolysis → HCOOH from H₂O₂ → then CO₂ under acidic conditions; formaldehyde with strong H₂O₂ → CO₂ + H₂O). The other fragment is cyclohexanone. So the alkene was methylenecyclohexane: C₆H₁₀=CH₂ (exocyclic double bond). The C=CH₂ cleaves: the ring-side carbon becomes C=O (cyclohexanone) and the =CH₂ becomes HCHO → CO₂. Cyclohexene would give two equivalents of OHC–(CH₂)₄–CHO (succinaldehyde-like fragment — actually one fragment since the double bond is in a ring).',
        },
        {
          question: 'Cold dilute KMnO₄ (basic) reacts with an alkene to give a syn-diol. In contrast, what does ozonolysis (reductive workup) give from the same alkene?',
          options: [
            'The same cis-diol',
            'Cleavage of the C=C bond to give two carbonyl compounds',
            'Epoxidation',
            'Anti diol via trans addition',
          ],
          correct: 1,
          explanation: 'Cold dilute KMnO₄ (basic, Baeyer test): dihydroxylation — adds two OH groups to the alkene, one on each carbon, from the same face (syn addition). The C=C bond is NOT broken. Product: cis-diol. This turns the purple permanganate colorless (a test for unsaturation). Hot, concentrated H₂SO₄/KMnO₄ (or hot acidic): cleaves the C=C like ozonolysis (oxidative cleavage). Ozonolysis (reductive workup): cleaves C=C to give carbonyl compounds (aldehydes or ketones depending on substitution). The two reactions are complementary: dihydroxylation preserves the C–C bond; ozonolysis breaks it.',
        },
      ],
      flashcards: [
        {
          front: 'Ozonolysis products: reductive vs oxidative workup',
          back: 'O₃ then (CH₃)₂S (or Zn/AcOH) = REDUCTIVE workup → aldehydes and/or ketones\nO₃ then H₂O₂ (or KMnO₄) = OXIDATIVE workup → carboxylic acids (from –CH=) and ketones (from –C=)\n\nTerminal alkene: =CH₂ → formaldehyde (HCHO) / CO₂ (after oxidative workup)\n\nUse reductive when you want aldehydes; use oxidative when you want acids.',
        },
        {
          front: 'KMnO₄: two different conditions, two different outcomes',
          back: 'COLD, dilute, basic KMnO₄: syn dihydroxylation (Baeyer test) → cis-diol; C=C NOT broken; purple → colorless\n\nHOT, concentrated, acidic KMnO₄: oxidative cleavage → same products as ozonolysis/oxidative workup (carboxylic acids and ketones). Breaks C=C.',
        },
        {
          front: 'Ways to make an alkene (retrosynthesis)',
          back: '1. E2 from R–X + strong base (KOH, NaOEt) → Zaitsev; (t-BuOK) → Hofmann\n2. E1 from R–X in polar protic (tertiary) → Zaitsev\n3. Alcohol dehydration: R–OH + H₂SO₄/heat → alkene (Zaitsev)\n4. Alkyne reduction: Lindlar → cis; Na/NH₃ → trans\n5. Wittig reaction: R₂C=O + Ph₃P=CR\'₂ → specific alkene (see Ch 16)',
        },
      ],
    },
  ],
}
