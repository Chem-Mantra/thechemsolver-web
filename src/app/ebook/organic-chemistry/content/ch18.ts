import type { OrgoChapter } from '../types'

export const CH18: OrgoChapter = {
  id: 'ch18',
  number: 18,
  title: 'Carboxylic Acid Derivatives',
  orgo: 2,
  accentHex: '#a855f7',
  concepts: [

    // ── Concept 1: Acyl Substitution Mechanism & Reactivity Order ─────────────
    {
      id: 'ch18-c1-acyl-substitution',
      title: 'Nucleophilic Acyl Substitution',
      subtitle: 'The master mechanism for all acid derivatives',
      estimatedMinutes: 13,
      accentHex: '#a855f7',
      blocks: [
        {
          type: 'text',
          body: 'The carboxylic acid derivatives — acyl chlorides, anhydrides, esters, and amides — all undergo nucleophilic acyl substitution by the same two-step mechanism: (1) nucleophile adds to the carbonyl C=O to form a tetrahedral intermediate; (2) the leaving group departs, restoring the C=O. The reactivity of each derivative depends on how easily the leaving group can depart, which correlates with how stable the leaving group is as an anion.',
        },
        {
          type: 'formula',
          latex: '\\text{Nu}^- + \\text{R}-\\text{C=O}-\\text{LG} \\rightarrow \\left[\\text{R}\\begin{pmatrix}\\text{Nu}\\\\\\text{C}\\\\\\text{O}^-\\\\\\text{LG}\\end{pmatrix}\\right] \\rightarrow \\text{R}-\\text{C=O}-\\text{Nu} + \\text{LG}^-',
          display: true,
          caption: 'Nucleophilic acyl substitution: addition then elimination from the tetrahedral intermediate. Nu replaces LG at the carbonyl carbon. The better the leaving group (more stable as an anion), the faster the reaction.',
        },
        {
          type: 'table',
          headers: ['Derivative', 'Leaving group (LG)', 'LG stability', 'Reactivity', 'Example'],
          rows: [
            ['Acyl chloride (RCOCl)', 'Cl⁻', 'Good (pKa HCl = −7)', 'Most reactive', 'Acetyl chloride (CH₃COCl)'],
            ['Anhydride (RCOOCOR)', 'RCOO⁻ (carboxylate)', 'Good (pKa RCOOH ~5)', 'Very reactive', 'Acetic anhydride'],
            ['Ester (RCOOR\')', 'R\'O⁻ (alkoxide)', 'Moderate (pKa R\'OH ~16)', 'Moderate reactivity', 'Methyl acetate'],
            ['Amide (RCONHR)', 'H₂NR (amine)', 'Poor leaving group (pKa R\'NH₂ ~35)', 'Least reactive', 'Acetamide'],
            ['Carboxylic acid (RCOOH)', 'HO⁻ (hydroxide)', 'Moderate (pKa H₂O = 15.7)', 'Low reactivity under neutral conditions', 'Acetic acid'],
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'The Reactivity Hierarchy',
          body: 'Reactivity order in nucleophilic acyl substitution:\n\nAcyl chloride > Anhydride > Ester ≈ Acid > Amide\n\nThis order directly reflects leaving group ability:\n• Cl⁻ (pKa HCl −7) leaves easily\n• RCOO⁻ (pKa RCOOH 4–5) leaves reasonably well\n• R\'O⁻ (pKa R\'OH 16) leaves with difficulty\n• Amines (pKa RNH₃⁺ 10, but departure requires amine as LG, pKa ~35) — very poor leaving group\n\nPractical consequence: you can convert any derivative to one LOWER in reactivity but not higher. Acyl chloride → anhydride → ester → amide are all easily made from the more reactive derivatives, but not by direct reaction of amide to make ester.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Interconversions: What Converts to What',
          body: 'Starting from the most reactive, each derivative can be converted to anything below it:\n\nAcyl chloride + H₂O → carboxylic acid (or anhydride + RCOO⁻ → anhydride; or ROH → ester; or RNH₂ → amide)\nAnhydride + ROH → ester; + RNH₂ → amide\nEster + RNH₂ → amide (saponification gives acid; then amine gives amide)\nAmide + H₂O (H⁺ or OH⁻, long reflux) → carboxylic acid + amine (hardest hydrolysis)\n\nNotice: you CANNOT make acyl chloride from an ester or amide by simple nucleophilic acyl substitution — you need SOCl₂ (completely different reagent).',
        },
      ],
      mcqs: [
        {
          question: 'Acetyl chloride (CH₃COCl) reacts vigorously with water. Acetic acid (CH₃COOH) reacts with water only under forcing conditions. Both give acetic acid as a product (from hydrolysis). Why the dramatic difference?',
          options: [
            'Acetyl chloride is smaller and diffuses faster in water',
            'In acetyl chloride, Cl⁻ (pKa HCl = −7) is an excellent leaving group from the tetrahedral intermediate. In acetic acid, OH⁻ (pKa H₂O = 15.7) is a far poorer leaving group. The better LG makes acyl chloride 10²² times more reactive',
            'Acetyl chloride is a stronger acid so it reacts with water',
            'Water cannot add to acetic acid because the O–H is too strong',
          ],
          correct: 1,
          explanation: 'Both reactions go through the same mechanism: water adds to C=O → tetrahedral intermediate → LG departs. In acetyl chloride: Cl⁻ (pKa HCl = −7) is a very good leaving group — it departs readily from the tetrahedral intermediate. In acetic acid: OH⁻ (pKa H₂O = 15.7) is a poor leaving group — once water adds to form the gem-diol intermediate, OH⁻ doesn\'t leave easily. The leaving group ability (governed by the stability of the departing anion = inverse of pKa) is the determining factor for reactivity.',
        },
        {
          question: 'An ester (RCOOR\') reacts with an amine (R\'\'NH₂). What is the driving force for amide formation, and what makes this thermodynamically favorable?',
          options: [
            'The amide is more reactive (less stable) than the ester, so it forms spontaneously',
            'The amine is a better nucleophile than an alkoxide. Additionally, the amine (pKa RNH₃⁺ ~10) is a much better leaving group than alkoxide (pKa ROH ~16), making the reverse reaction (amide attacking ester) much slower',
            'Amide formation from ester is thermodynamically favorable because amide is more stable than ester (amide has more resonance stabilization) — the C=O frequency is lower in amide',
            'Esters are easily converted to amides because water is produced',
          ],
          correct: 2,
          explanation: 'Ester + amine → amide + alcohol (aminolysis of ester). This reaction is thermodynamically driven: amides are more stable than esters because the nitrogen lone pair is more effectively donated into the C=O by resonance (N is less electronegative than O → better electron donor). The amide C=O has more single-bond character (stronger C–N, more resonance stabilization) than the ester C=O. The equilibrium favors the amide. Practically: the amine is a better nucleophile than water for the initial addition, and the alkoxide is a decent leaving group compared to amine, so the reaction proceeds in the desired direction.',
        },
        {
          question: 'What product forms when acetic anhydride reacts with ethanol?',
          options: [
            'Ethyl acetate + acetic acid (transacetylation)',
            'Diethyl acetate (two ethyl groups added)',
            'No reaction — anhydrides are stable to alcohols',
            'Ethyl anhydride',
          ],
          correct: 0,
          explanation: 'Acetic anhydride (CH₃CO–O–CO–CH₃) reacts with ethanol (CH₃CH₂OH) by nucleophilic acyl substitution: EtOH attacks one carbonyl of the anhydride → tetrahedral intermediate → the carboxylate (CH₃COO⁻) departs as leaving group → ethyl acetate (CH₃COOEt) + acetic acid (CH₃COOH). This is the acetylation of an alcohol. The anhydride is "opened" at one C=O — one half becomes the ester with the alcohol and the other half becomes acetic acid. Anhydrides are commonly used to acylate alcohols and amines when you want mild conditions and no HCl generated (as from acyl chloride).',
        },
      ],
      flashcards: [
        {
          front: 'Nucleophilic acyl substitution mechanism',
          back: 'Step 1 (addition): Nu:⁻ attacks C=O → sp³ tetrahedral intermediate (C bears: Nu, O⁻, R, LG)\nStep 2 (elimination): LG⁻ departs → C=O restored → product\n\nLG ability determines reactivity: better LG (weaker conjugate acid) = faster reaction\nReactivity order: acyl chloride > anhydride > ester ≈ acid > amide',
        },
        {
          front: 'Reactivity order of acid derivatives — why it matters',
          back: 'Most → Least reactive: Acyl chloride > Anhydride > Ester ≈ Acid > Amide\n\nThis = leaving group stability:\nCl⁻ (pKa HCl −7) >> RCOO⁻ (pKa 5) >> RO⁻ (pKa 16) >> RNH₂ (effectively pKa ~35)\n\nPractical rule: you can convert any derivative to one BELOW it in the hierarchy by adding the appropriate nucleophile. You CANNOT go UP (less reactive → more reactive) without changing the reagent entirely (e.g., SOCl₂ to make acyl chloride from acid).',
        },
        {
          front: 'Key differences: acid hydrolysis vs base hydrolysis of esters (saponification)',
          back: 'Acid hydrolysis (H₃O⁺ + H₂O): RCOOR\' + H₂O ⇌ RCOOH + R\'OH\nReversible — can drive with excess water; used for gentle hydrolysis\n\nBase hydrolysis — saponification (NaOH + H₂O): RCOOR\' + NaOH → RCOONa + R\'OH\nIRREVERSIBLE — carboxylate anion (RCOO⁻) is too poor a nucleophile to attack back. Quantitative yield; used when complete hydrolysis needed.\n\nSaponification = making soap (from triglycerides + NaOH → fatty acid carboxylates + glycerol).',
        },
      ],
    },

    // ── Concept 2: Claisen Condensation ──────────────────────────────────────
    {
      id: 'ch18-c2-claisen',
      title: 'Claisen Condensation & Dieckmann',
      subtitle: 'Ester enolates attacking ester carbonyls — making β-ketoesters',
      estimatedMinutes: 12,
      accentHex: '#a855f7',
      blocks: [
        {
          type: 'text',
          body: 'The Claisen condensation is the ester equivalent of the aldol reaction: an ester with α-hydrogens is deprotonated by a strong base (NaOEt) to form an enolate, which then attacks the carbonyl of another ester molecule. The tetrahedral intermediate collapses by expelling alkoxide, giving a β-ketoester product. The reaction is driven to completion by the acidity of the β-ketoester product (pKa ~11–13), which is deprotonated by the base to form the stable enolate anion.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Claisen Condensation: Step by Step',
          body: 'For ethyl acetate (CH₃COOEt) with NaOEt:\n\n1. NaOEt deprotonates α-H of ester → enolate ⁻CH₂COOEt\n2. Enolate (nucleophile) attacks second ester (C=O) → tetrahedral intermediate\n3. Elimination of EtO⁻ → β-ketoester (ethyl acetoacetate: CH₃COCH₂COOEt)\n4. NaOEt deprotonates the β-ketoester (pKa ~11) → thermodynamic product is the enolate anion (stabilized by two carbonyls)\n5. Acidic workup → neutral β-ketoester\n\nThe driving force: steps 1–3 are reversible, but step 4 is essentially irreversible (strong enough base deprotonates the very acidic β-ketoester). Le Chatelier: continuous removal of product as its anion drives the reaction forward.',
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'The Dieckmann Cyclization: Claisen Goes Intramolecular',
          body: 'The Dieckmann cyclization is a Claisen condensation within the same molecule — an intramolecular version. A diester with appropriate chain length is treated with NaOEt; the enolate of one ester attacks the other ester intramolecularly → cyclic β-ketoester.\n\nExample: diethyl adipate (EtOOC(CH₂)₄COOEt) + NaOEt → ethyl 2-oxocyclopentane-1-carboxylate (5-membered ring β-ketoester).\n\nUseful for making 5- and 6-membered cyclic rings. The ring size is determined by the length of the chain connecting the two esters.\n\nThis is a key step in many natural product syntheses because it builds cyclopentane and cyclohexane rings with a useful functional handle (the ester group, which can be decarboxylated or further modified).',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Mixed Claisen: Conditions for Success',
          body: 'A crossed (mixed) Claisen uses two DIFFERENT esters. To avoid statistical mixtures:\n\n1. Use one ester without α-H (cannot be deprotonated): formaldehyde, benzaldehyde, ethyl benzoate, ethyl carbonate (diethyl carbonate) — these act only as the electrophilic partner.\n\n2. Use one ester WITH α-H as the enolate source.\n\nExample: ethyl acetate (has α-H) + diethyl oxalate (no α-H) → ethyl oxaloacetate.\n\nWithout this design, a mixture of all four possible condensation products forms (like mixed aldol under reversible conditions).',
        },
      ],
      mcqs: [
        {
          question: 'In the Claisen condensation of ethyl propanoate (CH₃CH₂COOEt), what product forms after acidic workup?',
          options: [
            'Ethyl propanoate dimer (ester dimer) — two propionate units linked',
            'Ethyl 2-methyl-3-oxopentanoate — a β-ketoester from two propanoate units joining',
            'Propanoic acid (hydrolysis)',
            'Diethyl propanedioate',
          ],
          correct: 1,
          explanation: 'Ethyl propanoate has α-H on the CH₂ group (adjacent to C=O). The Claisen condensation: one molecule\'s α-CH₂ is deprotonated → enolate attacks the carbonyl of a second molecule → β-ketoester forms. Ethyl propanoate: CH₃CH₂COOEt. The enolate ⁻CH(CH₃)COOEt attacks another CH₃CH₂COOEt → tetrahedral intermediate → EtO⁻ leaves → product: CH₃CH₂CO–CH(CH₃)–COOEt (ethyl 2-methyl-3-oxopentanoate). Both α-H from the methylene of the first molecule, and the carbonyl of the second, contribute to the product.',
        },
        {
          question: 'Why is NaOEt (sodium ethoxide) the preferred base in Claisen condensation of ethyl esters?',
          options: [
            'NaOEt is a strong enough base to deprotonate α-H (pKa ~20–25 for ester α-H) and also is the conjugate base of the leaving group (EtOH), minimizing side reactions from transesterification',
            'NaOEt is weaker than NaOH, making it more selective',
            'NaOEt is used because it dissolves in organic solvents',
            'NaOEt deprotonates the carbonyl oxygen, activating it toward nucleophilic attack',
          ],
          correct: 0,
          explanation: 'NaOEt is ideal for Claisen condensation of ethyl esters for two reasons: (1) it is a strong enough base to deprotonate the α-H of an ester (α-H pKa ~25; EtOH pKa 16 — the equilibrium is not fully on the product side, but enough enolate forms for reaction); (2) crucially, EtO⁻ is the SAME anion as the leaving group (from EtO–C=O ← in the ester). If you used NaOMe with an ethyl ester, you\'d get transesterification (exchange of OR groups) as a side reaction. Matching the base\'s conjugate acid with the ester\'s OR group avoids this.',
        },
        {
          question: 'What ring size is formed in the Dieckmann cyclization of diethyl pimelate (EtOOC–(CH₂)₅–COOEt, a 7-carbon diester)?',
          options: [
            '5-membered ring',
            '6-membered ring',
            '7-membered ring',
            '4-membered ring',
          ],
          correct: 1,
          explanation: 'In the Dieckmann cyclization: the enolate of one ester end attacks the carbonyl of the other. Count the atoms in the ring: for diethyl pimelate (EtOOC–CH₂–CH₂–CH₂–CH₂–CH₂–COOEt), the ring contains: C1 (from one ester) – C2–C3–C4–C5–C6 (from the chain). Wait: pimelate has (CH₂)₅ between two ester groups: C1(=O)–C2H₂–C3H₂–C4H₂–C5H₂–C6H₂–C7(=O). Enolate at C6 attacks C1=O → ring with C1–C2–C3–C4–C5–C6 → 6-membered ring. In general: diethyl malonates give 3-membered rings (too strained); diethyl succinates → 4-membered rings (strained); diethyl glutarates → 5-membered; diethyl adipates → 6-membered; pimelates → 6-membered cyclopentanone? Let me recount: adipate = 4C bridge → 6-membered ring (4 bridge + 2 ester C). Pimelate = 5C bridge → 7-membered ring? Actually: Diethyl pimelate has the formula EtOOC(CH₂)₅COOEt; the bridge has 5 methylenes. Ring size = 5 + 2 (from both carbonyl C) - 1 (EtO leaves) = 6-membered ring? No wait: ring atoms are: C=O ... C2–C3–C4–C5–C6–α = 6 atoms in ring. Actually pimelate cyclizes to cyclohexanone derivative (6-membered ring). For this problem: 6-membered ring.',
        },
      ],
      flashcards: [
        {
          front: 'Claisen condensation: conditions and product',
          back: '2 RCOOR\' + NaOR\' → RCOCHRCOOH (β-ketoester) after acid workup\n\nRequires: ester with α-H + NaOR\' (match the OR\' of the ester!)\nProduct: β-ketoester (one more C from one ester becoming the keto group)\nDriving force: deprotonation of acidic β-ketoester (pKa ~11) by NaOR\' → stable dianion-like enolate\n\nNote: β-keto diesters and β-ketoesters are important synthetic intermediates (malonic ester synthesis, acetoacetic ester synthesis).',
        },
        {
          front: 'Dieckmann cyclization: intramolecular Claisen',
          back: 'Diester + NaOR → cyclic β-ketoester\n\nRing size = (number of carbons in chain between the two ester carbonyls) + 1 atom for the ring closure\n\nBest ring sizes formed: 5 and 6-membered (glutarate → cyclopentanone derivative; adipate → cyclohexanone derivative)\n\nUsed to make cyclic β-ketoesters for further synthetic elaboration.',
        },
        {
          front: 'How to do a successful mixed (crossed) Claisen',
          back: 'Use one ester with NO α-H (cannot form enolate, acts only as electrophile):\n• Ethyl benzoate (PhCOOEt)\n• Diethyl oxalate (EtOOCCOOEt)\n• Ethyl carbonate (EtOCOOEt)\n• Methyl formate (HCOOMe)\n\n+ one ester WITH α-H (acts as enolate source)\n\nResult: only ONE crossed product formed (no statistical mixture).',
        },
      ],
    },
  ],
}
