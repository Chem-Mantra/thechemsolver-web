import type { OrgoChapter } from '../types'

export const CH20: OrgoChapter = {
  id: 'ch20',
  number: 20,
  title: 'Amines',
  orgo: 2,
  accentHex: '#a855f7',
  concepts: [

    // ── Concept 1: Structure, Basicity & Nucleophilicity ─────────────────────
    {
      id: 'ch20-c1-basicity',
      title: 'Amines: Basicity & Nucleophilicity',
      subtitle: 'Why nitrogen is basic — and what makes one amine more basic than another',
      estimatedMinutes: 12,
      accentHex: '#a855f7',
      blocks: [
        {
          type: 'text',
          body: 'Amines are the most important nitrogen-containing functional group in organic chemistry. They are both bases (proton acceptors via the N lone pair) and nucleophiles (lone pair donors to electrophiles). The pKa of the conjugate acid (ammonium ion, R₃NH⁺) measures basicity — a higher pKa means a stronger base. Basicity and nucleophilicity are related but distinct: basicity is thermodynamic (equilibrium), while nucleophilicity is kinetic (rate of reaction with an electrophile).',
        },
        {
          type: 'formula',
          latex: 'K_b = \\frac{[\\text{RNH}_3^+][\\text{OH}^-]}{[\\text{RNH}_2]} \\quad\\text{and}\\quad \\text{p}K_a(\\text{RNH}_3^+) = 14 - \\text{p}K_b',
          display: true,
          caption: 'Basicity measured as pKa of the conjugate acid (ammonium salt). Higher pKa = stronger base. Alkylamines pKa ~10–11; arylamines pKa ~4–5; amides pKa ~0 (barely basic).',
        },
        {
          type: 'table',
          headers: ['Amine type', 'Example', 'pKa (conjugate acid)', 'Basicity reason'],
          rows: [
            ['Alkylamine (1°)', 'Methylamine (CH₃NH₂)', '10.6', 'Alkyl group donates electrons by induction → lone pair more available'],
            ['Alkylamine (2°)', 'Dimethylamine (CH₃)₂NH', '10.7', 'Two alkyl groups, slightly more basic than 1°'],
            ['Alkylamine (3°)', 'Trimethylamine (CH₃)₃N', '9.8', 'Three alkyl groups BUT steric hindrance of solvation lowers effective basicity'],
            ['Arylamine (aniline)', 'C₆H₅NH₂', '4.6', 'N lone pair delocalized into ring (resonance) → less available for protonation'],
            ['Amide (RCONH₂)', 'Acetamide', '~0', 'Lone pair delocalized into C=O → almost no basicity; protonation on O'],
            ['Pyridine', 'C₅H₅N', '5.3', 'N is sp² → lone pair in plane, not in ring π system → basic, but less than alkylamine'],
            ['Pyrrole', 'C₄H₅N', '−3.8 (very weak)', 'N lone pair IN the aromatic ring → delocalized, not available for proton'],
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'The Basicity Trend: Alkylamine >> Arylamine >> Amide',
          body: 'The key structural feature governing amine basicity is the availability of the N lone pair:\n\n1. Alkyl groups (σ-donors) push electrons toward N → lone pair more available → stronger base (pKa ~10)\n2. Aryl groups (π-acceptors via resonance) delocalize N lone pair into ring → less basic (pKa ~5)\n3. Carbonyl C=O (strong π-acceptor) heavily delocalizes N lone pair → amides barely basic (pKa ~0)\n\nKey rule for arylamines: draw the resonance forms where N lone pair pushes into the ring — if this delocalization is possible, basicity drops dramatically. For pyrrole: N lone pair is part of the 6π aromatic system (completes aromaticity) — cannot be donated without destroying aromaticity → least basic nitrogen compound.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Basicity vs Nucleophilicity: Not the Same',
          body: 'An amine is a nucleophile (donates lone pair to electrophile) AND a base (donates lone pair to H⁺). But:\n\n• Basicity is THERMODYNAMIC (pKa, equilibrium constant)\n• Nucleophilicity is KINETIC (rate of reaction with electrophile)\n\nIn aprotic solvents: nucleophilicity correlates with basicity (better base = better Nu).\nIn protic solvents: steric effects matter more. A hindered base like t-BuNH₂ is very basic but reacts slowly as a nucleophile.\n\nAryl amines: poor bases (resonance delocalization) but can still be moderate nucleophiles toward reactive electrophiles (acyl chlorides), because nucleophilicity is measured by rate, not thermodynamics.\n\nAmides: poor nucleophiles AND poor bases — the lone pair is so delocalized that both basicity and nucleophilicity are negligible.',
        },
      ],
      mcqs: [
        {
          question: 'Order these from most to least basic: (A) aniline (PhNH₂), (B) acetamide (CH₃CONH₂), (C) cyclohexylamine (c-C₆H₁₁NH₂), (D) pyridine',
          options: [
            'C > A > D > B',
            'B > C > A > D',
            'C > D > A > B',
            'A > C > D > B',
          ],
          correct: 2,
          explanation: 'Ranking by pKa of conjugate acid:\n• Cyclohexylamine (alkylamine, pKa ~10.7) — N lone pair augmented by alkyl induction → most basic\n• Pyridine (sp² N, pKa 5.3) — lone pair in plane, not in aromatic system → moderately basic\n• Aniline (arylamine, pKa 4.6) — N lone pair delocalized into benzene ring → less basic than pyridine\n• Acetamide (amide, pKa ~0) — N lone pair delocalized into C=O → almost no basicity\n\nSo: C > D > A > B. Note that pyridine is MORE basic than aniline because in pyridine, the N lone pair is in an sp² orbital in the plane of the ring (NOT part of the aromatic π system) so it IS available; in aniline, the N lone pair IS delocalized into the ring via resonance.',
        },
        {
          question: 'Why is N-methylacetamide (CH₃CONHCH₃) a nearly flat molecule around the N–CO bond (rotational barrier ~75 kJ/mol), unlike ordinary amines?',
          options: [
            'The N lone pair is delocalized into the C=O via resonance (amide resonance) → partial double-bond character of the C–N bond → restricted rotation',
            'The methyl group on N creates steric strain that flattens the molecule',
            'Hydrogen bonding locks the N–CO bond in place',
            'The sp³ nitrogen in amide cannot rotate',
          ],
          correct: 0,
          explanation: 'In an amide, the nitrogen lone pair is delocalized into the adjacent C=O by resonance:\n\nR–CO–NHR\' ↔ R–C(O⁻)=NHR\' (partial positive on N, partial negative on O)\n\nThis partial N=C double bond character (~40% double-bond character) prevents free rotation around the C–N bond. The result is a planar amide group (C, O, N, and the first atoms on each are all in one plane) and a rotational barrier of ~75 kJ/mol (much higher than a C–C single bond, ~15 kJ/mol). This is why amide bonds in proteins (peptide bonds) give rise to secondary structures like α-helices and β-sheets: the peptide bond is always trans (E) and planar.',
        },
        {
          question: 'Dimethylamine (pKa 10.7) is more basic than trimethylamine (pKa 9.8) in water. But in the gas phase, trimethylamine is more basic. Why the reversal?',
          options: [
            'In water, trimethylamine is protonated reversibly; in the gas phase it is not',
            'In water, the ammonium cation (CH₃)₃NH⁺ is poorly solvated (hydrated) compared to (CH₃)₂NH₂⁺ because the three bulky methyl groups prevent water molecules from forming efficient hydrogen bonds around the positively charged N. This solvation penalty offsets the inductive stabilization. In the gas phase, no solvation → purely inductive/steric → trimethylamine wins',
            'Trimethylamine undergoes oxidation in water to give N-oxide, reducing apparent basicity',
            'Dimethylamine self-condenses in the gas phase to form a more stable species',
          ],
          correct: 1,
          explanation: 'This is the classic example of the importance of solvation. In the gas phase, more alkyl groups always increase basicity (more inductive electron donation → lone pair more available). Gas-phase basicity: Me₃N > Me₂NH > MeNH₂ > NH₃. In water, the conjugate acid (ammonium ion) must be solvated by water molecules via hydrogen bonding. The more alkyl groups present, the more sterically hindered the N–H of the ammonium ion → water molecules cannot approach as effectively → lower solvation energy of the conjugate acid → effectively weaker base in water. The peak basicity in water falls at 2° amines (dimethylamine), which balances inductive effect (favors more alkyl) and solvation (favors fewer alkyl). Above 2°, the steric desolvation penalty dominates in aqueous solution.',
        },
      ],
      flashcards: [
        {
          front: 'Amine basicity: key trend and pKa values',
          back: 'pKa of conjugate acid (higher = more basic):\n\n• Alkylamines (1°, 2°): pKa ~10–11\n• Alkylamines (3°): pKa ~9–10 (slight decrease from poor solvation in water)\n• Pyridine (sp² N, not in aromatic π): pKa ~5.3\n• Aniline (N lone pair delocalized in ring): pKa ~4.6\n• Amide (N lone pair → C=O): pKa ~0\n• Pyrrole (N lone pair IS the aromatic π electron): pKa ≈ −4 (barely basic at all)\n\nKey: if the N lone pair is delocalized (resonance into C=O or aromatic π), basicity drops dramatically.',
        },
        {
          front: 'Gas-phase vs aqueous basicity of alkylamines — why they differ',
          back: 'Gas phase (no solvation): R₃N > R₂NH > RNH₂ > NH₃\n(more alkyl groups = more inductive donation = stronger base)\n\nWater (solvation matters): R₂NH ≈ max; R₃N slightly less basic\n(reason: ammonium cation R₃NH⁺ is sterically hindered → poor solvation by water → destabilized conjugate acid → weaker base)\n\nRule of thumb: 2° alkylamine is typically the strongest base in water among simple alkylamines.',
        },
      ],
    },

    // ── Concept 2: Synthesis of Amines ───────────────────────────────────────
    {
      id: 'ch20-c2-synthesis',
      title: 'Synthesis & Reactions of Amines',
      subtitle: 'Reductive amination, Gabriel synthesis, diazonium chemistry, and Hofmann rearrangement',
      estimatedMinutes: 14,
      accentHex: '#a855f7',
      blocks: [
        {
          type: 'text',
          body: 'Amines are synthesized by several key methods, each with distinct advantages. Reductive amination is the most general and widely used route: a carbonyl compound reacts with an amine (or ammonia) to form an imine (or iminium ion), which is then reduced to give the amine. The Hofmann rearrangement converts primary amides to primary amines with one fewer carbon — a rare carbon-loss reaction. Diazonium salts, formed from primary aromatic amines and NaNO₂/HCl at 0°C, are highly versatile intermediates for making aryl halides, aryl nitriles, phenols, and other aromatics.',
        },
        {
          type: 'table',
          headers: ['Method', 'Reaction', 'Product type', 'Key reagent', 'Limitation'],
          rows: [
            ['Reductive amination', 'RCHO + RNH₂ → imine → amine', '2° amine (R₂NH)', 'NaBH₃CN or NaBH(OAc)₃ (selective for iminium)', 'Over-alkylation if R is primary amine'],
            ['Gabriel synthesis', 'Phthalimide + R–X → N-alkylphthalimide → NH₂R', '1° amine (pure)', 'KOH or NH₂NH₂ (hydrazinolysis)', 'Only for 1° amines; 2°/3° amines not possible; no aryl X'],
            ['Reduction of amide', 'RCONH₂ + LAH → RCH₂NH₂', '1° amine', 'LiAlH₄ (LAH)', 'Harsh conditions; not selective with other reducible groups'],
            ['Reduction of nitrile', 'R–CN + 2H₂ → R–CH₂–NH₂', '1° amine (one extra C)', 'LAH or H₂/Ni', 'Nitrile synthesis requires good RX for SN2'],
            ['Hofmann rearrangement', 'RCONH₂ + Br₂/NaOH → RNH₂', '1° amine (one fewer C)', 'Br₂ + NaOH', 'Rare C-loss; works only for primary amides'],
            ['Curtius rearrangement', 'RCOON₃ (acyl azide) → isocyanate → amine', '1° amine (one fewer C)', 'NaN₃ then heat', 'Similar to Hofmann; mild conditions'],
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Reductive Amination: The Most Versatile Route',
          body: 'Reductive amination converts R₁CHO + R₂NH₂ → R₁CH₂NHR₂ (2° amine):\n\nStep 1: Carbonyl + amine → hemiaminal → dehydration → imine (Schiff base, if R₁R₂CHNH₂) or iminium ion (R₁R₂C=NR₃⁺, if 2° amine reacts)\n\nStep 2: Reduce imine/iminium → amine. Use:\n• NaBH₃CN (sodium cyanoborohydride): mild, selective — reduces iminium (C=N⁺, pKa ~5) but not ketone at neutral pH. This selectivity is crucial.\n• NaBH(OAc)₃ (sodium triacetoxyborohydride): similar selectivity, milder, commonly used in industry.\n• H₂/Pd or H₂/PtO₂: also works but less selective; may over-reduce.\n\nPractical advantage: starts from a carbonyl (easy to make) and any amine → direct single-step access to complex amines.',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Diazonium Salt Chemistry: Aryl Groups Without EAS Limitations',
          body: 'Diazonium salts (ArN₂⁺ BF₄⁻ or Cl⁻) are made from primary AROMATIC amines:\n\nArNH₂ + NaNO₂ + HCl → Ar–N₂⁺ Cl⁻ + H₂O (must be 0°C; diazonium salts are unstable above 5–10°C)\n\nFrom Ar–N₂⁺, you can make:\n• Ar–F (Schiemann): heat with BF₄⁻\n• Ar–Cl (Sandmeyer): CuCl\n• Ar–Br (Sandmeyer): CuBr\n• Ar–I: KI (no copper needed)\n• Ar–CN (Sandmeyer): CuCN → nitrile → acid, amide, or amine\n• Ar–OH: H₂O, heat → phenol (N₂ driven off)\n• Ar–H: H₃PO₂ (hypophosphorous acid) → remove NH₂ group\n• Azo coupling: Ar–N₂⁺ + Ar\'H (activated) → Ar–N=N–Ar\' (azo dye)\n\nSignificance: gives access to halides and other aryl substituents that CANNOT be put on benzene by simple EAS. For example, ArF by EAS is very slow — but from diazonium via Schiemann it is easy.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Gabriel Synthesis: Pure Primary Amines (No Contamination)',
          body: 'The Gabriel synthesis solves the selectivity problem of primary amine synthesis. Direct alkylation of NH₃ with R–X gives a mixture of 1°, 2°, 3° amines AND quaternary ammonium salts (over-alkylation). Gabriel avoids this:\n\n1. Phthalimide (pKa ~9, acidic N–H due to two adjacent C=O groups) + KOH → potassium phthalimide\n2. SN2 alkylation with R–X → N-alkylphthalimide (only ONE alkyl group can go on N)\n3. Hydrolysis (KOH/H₂O under pressure) or hydrazinolysis (NH₂NH₂) → liberates the PRIMARY amine RNH₂ + phthalhydrazide\n\nLimitations:\n• Only primary amines (N is locked into one bond to R)\n• Aryl halides (ArX) do not undergo SN2 → aryl amines cannot be made this way\n• Tertiary alkyl halides do not undergo SN2 either',
        },
      ],
      mcqs: [
        {
          question: 'What is the product of the Hofmann rearrangement of benzamide (C₆H₅CONH₂) with Br₂/NaOH?',
          options: [
            'Benzonitrile (C₆H₅CN)',
            'Aniline (C₆H₅NH₂) — a primary amine with one fewer carbon than the starting amide',
            'Benzoic acid (C₆H₅COOH)',
            'N-bromobenzamide',
          ],
          correct: 1,
          explanation: 'Hofmann rearrangement: RCONH₂ + Br₂ + NaOH → RNH₂ + CO₂. The mechanism: (1) Br₂ + NaOH brominate the amide N → N-bromoamide (RCONHBr); (2) Base deprotonates → N-bromo anion (RCON⁻Br); (3) The key step — rearrangement: R migrates from C=O to nitrogen (nitrene-like intermediate, isocyanate RNCO forms); (4) Isocyanate + H₂O → carbamic acid → amine + CO₂. Starting material: benzamide (C₆H₅CONH₂, 7 carbons total). Product: aniline (C₆H₅NH₂, 6 carbons) — lost one carbon as CO₂. This is one of the rare reactions in organic chemistry where you lose a carbon. Use it when you want RNH₂ from RCONH₂ (one fewer carbon in the backbone).',
        },
        {
          question: 'In reductive amination of cyclohexanone with benzylamine (PhCH₂NH₂) using NaBH₃CN, why is NaBH₃CN preferred over NaBH₄?',
          options: [
            'NaBH₄ does not reduce imines; NaBH₃CN does',
            'NaBH₃CN is a milder reducing agent — it reduces the iminium ion (C=N⁺) selectively at pH 5–7 but does NOT reduce the ketone itself at this pH, ensuring only the iminium formed from the amine + ketone is reduced, not excess unreacted ketone',
            'NaBH₃CN is cheaper',
            'NaBH₄ would cause elimination of benzylamine',
          ],
          correct: 1,
          explanation: 'NaBH₄ would reduce both the ketone AND the iminium ion — so you\'d get a mixture of the desired amine and the alcohol (from direct ketone reduction). NaBH₃CN has weaker hydride delivery power. At pH ~5–7 (slightly acidic, maintained by acetate buffer), the imine is protonated to the iminium ion (C=N⁺), which is much more electrophilic and much more easily reduced than the neutral ketone. At this pH, NaBH₃CN selectively reduces the iminium but leaves the ketone largely untouched. This selectivity is the hallmark of reductive amination. Similarly, NaBH(OAc)₃ works the same way: mild, selective, avoids reducing the starting ketone.',
        },
        {
          question: 'In the Sandmeyer reaction for making ArCl from a diazonium salt, CuCl is used (not HCl alone). Why is copper(I) needed?',
          options: [
            'CuCl stabilizes the diazonium salt and prevents decomposition',
            'The Sandmeyer reaction proceeds by a radical mechanism via single electron transfer (SET) from Cu(I) to ArN₂⁺, generating an aryl radical + N₂ + Cu(II). The aryl radical captures Cl from Cu(II)Cl to give ArCl. The Cu(I)/Cu(II) cycle is catalytic',
            'Copper increases the nucleophilicity of Cl⁻ by chelation',
            'CuCl is a Lewis acid that activates the benzene ring toward substitution',
          ],
          correct: 1,
          explanation: 'Why doesn\'t ArN₂⁺ + Cl⁻ → ArCl directly? Aryl cations are too unstable — the diazonium directly cannot lose N₂ to give a free aryl cation under Sandmeyer conditions (you\'d need very high energy). The Sandmeyer reaction works by a Cu(I)-mediated radical chain: (1) Cu(I) donates one electron to ArN₂⁺ → Ar• + N₂ + Cu(II); (2) Ar• + Cu(II)Cl → ArCl + Cu(I) (regenerated). The copper cycles between Cu(I) and Cu(II) — truly catalytic. The aryl radical is much more reactive and easier to form than an aryl cation. This is why Sandmeyer requires CuCl (or CuBr for ArBr, CuCN for ArCN) — not just the anion. For ArI, simple KI works because I⁻ is an easy one-electron donor to form I• and the radical coupling is fast.',
        },
      ],
      flashcards: [
        {
          front: 'Diazonium salt reactions: what ArN₂⁺ gives',
          back: 'From ArNH₂ + NaNO₂/HCl at 0°C → ArN₂⁺\n\nSandmeyer reactions (Cu salt needed):\n• CuCl → ArCl\n• CuBr → ArBr\n• CuCN → ArCN (→ acid, amide, amine)\n\nOther:\n• KI → ArI (no Cu needed)\n• BF₄⁻ + heat → ArF (Schiemann)\n• H₂O + heat → ArOH (phenol)\n• H₃PO₂ → Ar–H (remove NH₂ completely)\n• Activated ArH → Ar–N=N–Ar\' (azo coupling)\n\nKey: 0°C required — diazonium salts decompose above 5°C',
        },
        {
          front: 'Gabriel synthesis: clean route to primary amines',
          back: 'Steps:\n1. Phthalimide + KOH → K⁺ phthalimide anion (pKa ~9)\n2. SN2 with R–X → N-alkylphthalimide\n3. Hydrazinolysis (NH₂NH₂) → RNH₂ + phthalhydrazide\n  OR: acidic hydrolysis (HCl, H₂O, reflux) → RNH₂ + phthalic acid\n\nGives ONLY primary amines — no over-alkylation\nWon\'t work: aryl halides (no SN2), 3° alkyl halides (no SN2)\nOtherwise: excellent for primary amines where direct alkylation of NH₃ would give mixtures',
        },
        {
          front: 'Hofmann rearrangement: amide → amine (lose one C)',
          back: 'RCONH₂ + Br₂ + NaOH → RNH₂ + CO₂\n\nMechanism: amide → N-bromo → nitrene-like rearrangement → isocyanate (R–N=C=O) → hydrolysis → carbamic acid → amine + CO₂\n\nKey: R migrates from C to N with RETENTION of configuration (if R is chiral)\nProduct: 1° amine with ONE FEWER CARBON than starting amide\nTest reagent: Br₂ + NaOH\nRelated: Curtius (acyl azide → isocyanate → amine, same carbon loss); Lossen (hydroxamic acid); Schmidt (ketone + HN₃)',
        },
      ],
    },
  ],
}
