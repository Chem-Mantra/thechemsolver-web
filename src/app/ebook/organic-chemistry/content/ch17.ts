import type { OrgoChapter } from '../types'

export const CH17: OrgoChapter = {
  id: 'ch17',
  number: 17,
  title: 'Carboxylic Acids',
  orgo: 2,
  accentHex: '#a855f7',
  concepts: [

    // ── Concept 1: Acidity, Structure & Synthesis ─────────────────────────────
    {
      id: 'ch17-c1-acidity',
      title: 'Carboxylic Acid Acidity & Synthesis',
      subtitle: 'Resonance stabilization, pKa factors, and how to make RCOOH',
      estimatedMinutes: 12,
      accentHex: '#a855f7',
      blocks: [
        {
          type: 'text',
          body: 'Carboxylic acids (R–COOH) are the most acidic common organic functional group, with pKa values typically in the range 4–5. This acidity arises from resonance stabilization of the carboxylate anion (RCOO⁻) — the negative charge is delocalized over both oxygens, making the anion far more stable than a simple alkoxide. Understanding what structural features make an acid stronger or weaker, and how to synthesize carboxylic acids, are the practical skills of this chapter.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Resonance Stabilization of Carboxylate',
          body: 'The carboxylate anion has two equivalent resonance structures — the negative charge is delocalized equally over both oxygens. Each C–O bond has bond order 1.5 (intermediate between single and double bond). This is proven by X-ray crystallography: both C–O bonds in acetate are 127 pm (between 143 pm for C–O and 122 pm for C=O).\n\nRCOO⁻: ←→ two resonance structures with ⁻O–C=O and O=C–O⁻\n\nThis resonance stabilization (~13 kJ/mol relative to localized anion) is the primary reason carboxylic acids are 10¹¹ times more acidic than alcohols (pKa ~5 vs ~16).',
        },
        {
          type: 'table',
          headers: ['Method', 'Starting material', 'Product', 'Conditions'],
          rows: [
            ['Oxidation of 1° alcohol', 'RCH₂OH', 'RCOOH', 'K₂Cr₂O₇/H₂SO₄ or KMnO₄'],
            ['Oxidation of aldehyde', 'RCHO', 'RCOOH', 'Ag₂O/NH₃ (Tollens), KMnO₄, K₂Cr₂O₇'],
            ['Oxidation of methyl ketone', 'RCO–CH₃', 'RCOOH + CHCl₃', 'Iodoform reaction: I₂/NaOH → CHI₃ + RCOO⁻'],
            ['Ozonolysis (oxidative)', 'RCH=CHR\'', 'RCOOH + R\'COOH', 'O₃ then H₂O₂'],
            ['Hydrolysis of nitrile', 'RC≡N', 'RCOOH + NH₃', 'H₃O⁺ (or NaOH) + H₂O, heat'],
            ['Grignard + CO₂', 'RMgX + CO₂', 'RCOOH', 'RMgX in ether + CO₂ → RCOOH after H₂O workup'],
            ['Carboxylation (Kolbe)', 'ArONa + CO₂', 'ArCOONa', 'High pressure, heat; phenol → salicylate (aspirin precursor)'],
            ['Hydrolysis of ester/amide', 'RCOOR\' or RCONH₂', 'RCOOH', 'Acid or base + H₂O, heat'],
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Substituent Effects on Carboxylic Acid pKa',
          body: 'Starting from acetic acid (pKa 4.75), substituents modify acidity:\n\nEDG (alkyl groups) — donate electrons → destabilize carboxylate anion → WEAKEN acid:\n• Propanoic acid (CH₃CH₂COOH): pKa 4.87 (slightly weaker)\n\nEWG (halogens, NO₂) — withdraw electrons → stabilize carboxylate → STRENGTHEN acid:\n• Chloroacetic acid (ClCH₂COOH): pKa 2.86\n• Dichloroacetic: pKa 1.48\n• Trichloroacetic: pKa 0.66\n\nDistance matters: halogen two carbons away has smaller effect than one carbon away.\nMultiple EWG are additive.\nAromaticity: benzoic acid pKa 4.20 (phenyl ring is slightly EWG).',
        },
      ],
      mcqs: [
        {
          question: 'Rank these acids from STRONGEST to WEAKEST: acetic acid (CH₃COOH, pKa 4.75), trichloroacetic acid (Cl₃CCOOH, pKa 0.66), propanoic acid (CH₃CH₂COOH, pKa 4.87), and chloroacetic acid (ClCH₂COOH, pKa 2.86).',
          options: [
            'Cl₃CCOOH > ClCH₂COOH > CH₃COOH > CH₃CH₂COOH',
            'CH₃CH₂COOH > CH₃COOH > ClCH₂COOH > Cl₃CCOOH',
            'All are equal because they all have –COOH',
            'Cl₃CCOOH > CH₃CH₂COOH > CH₃COOH > ClCH₂COOH',
          ],
          correct: 0,
          explanation: 'Lower pKa = stronger acid. Trichloroacetic (pKa 0.66) > chloroacetic (2.86) > acetic (4.75) > propanoic (4.87). The trend: Cl atoms withdraw electrons inductively from the carboxylate anion, stabilizing the negative charge → increasing acidity. Three Cl atoms (Cl₃C–) have a much larger electron-withdrawing effect than one Cl (ClCH₂–). Propanoic acid is slightly weaker than acetic because the ethyl group (CH₂CH₃) is a slightly larger electron-donating alkyl group, slightly destabilizing the carboxylate anion.',
        },
        {
          question: 'What is the product of the reaction of propylmagnesium bromide (C₃H₇MgBr) with CO₂ (dry ice) followed by aqueous HCl workup?',
          options: [
            'Propan-1-ol (after reduction)',
            'Butanoic acid (CH₃CH₂CH₂COOH) — Grignard + CO₂ gives carboxylic acid with one more carbon',
            'Propanoic acid (same number of C as Grignard)',
            'An ester of propanol',
          ],
          correct: 1,
          explanation: 'Grignard + CO₂ → after workup, carboxylic acid with ONE MORE CARBON than the Grignard. Propylmagnesium bromide has 3 carbons. CO₂ provides the carboxyl carbon (+1 carbon). Product: butanoic acid (4C: CH₃CH₂CH₂COOH). Mechanism: the nucleophilic propyl carbanion (from RMgBr) attacks electrophilic C of CO₂ → carboxylate anion (RCOO⁻ MgBr⁺) → HCl workup protonates → RCOOH. This is a useful one-carbon chain extension to a carboxylic acid.',
        },
        {
          question: 'The iodoform reaction (I₂/NaOH) converts acetyl groups (–COCH₃) to carboxylate + CHI₃. What type of compound gives a POSITIVE iodoform test?',
          options: [
            'Any ketone (RCOR\')',
            'Only methyl ketones (RCOCH₃) and acetaldehyde (CH₃CHO), or secondary alcohols that can be oxidized to a methyl ketone (CH₃CHOHR → CH₃COR)',
            'Carboxylic acids with α-CH₃ group',
            'Any compound with a methyl group',
          ],
          correct: 1,
          explanation: 'The iodoform reaction specifically cleaves the –COCH₃ or –CH(OH)CH₃ group. Positive result for: (1) Methyl ketones (RCOCH₃) — the CH₃ is at the α-carbon of the carbonyl; (2) Acetaldehyde (CH₃CHO) — the methyl is directly on the carbonyl; (3) Secondary alcohols adjacent to the methyl group (CH₃CHOHR) — oxidized first by NaOI to methyl ketone. Ethanol (CH₃CH₂OH) also gives positive: CH₃CH₂OH → NaOI → CH₃CHO → NaOI → CHI₃ + HCOONa. Yellow CHI₃ (iodoform) precipitate = positive test.',
        },
      ],
      flashcards: [
        {
          front: 'Why are carboxylic acids (pKa ~5) much more acidic than alcohols (pKa ~16)?',
          back: 'Carboxylate anion (RCOO⁻) is resonance-stabilized: negative charge delocalized over TWO equivalent electronegative oxygens. Both C–O bonds have bond order 1.5. Alkoxide (RO⁻) has no resonance: all negative charge on ONE oxygen.\n\nResonance stabilization of carboxylate = ~13 kJ/mol extra stabilization → pKa difference of ~11 (10¹¹ fold in acidity).',
        },
        {
          front: 'Synthesis of carboxylic acids: key routes',
          back: '1. Oxidize 1° alcohol or aldehyde (K₂Cr₂O₇/H₂SO₄, or KMnO₄)\n2. Hydrolyze nitrile (H₃O⁺/heat or NaOH/heat) → RCOOH from RC≡N\n3. Grignard + CO₂ → RCOOH (one-carbon extension)\n4. Ozonolysis (oxidative workup) of alkene → two RCOOH\n5. Hydrolyze ester or amide (acid or base + H₂O)\n6. Iodoform reaction: RCOCH₃ + I₂/NaOH → RCOO⁻ + CHI₃',
        },
        {
          front: 'Effect of EWG on carboxylic acid pKa: the inductive effect',
          back: 'EWG (Cl, F, NO₂, CF₃) withdraws electron density from the carboxylate anion through σ bonds → STABILIZES the anion → LOWERS pKa → STRONGER acid.\n\nStrength increases with:\n• More EWG atoms (Cl₃C- >> ClCH₂-)\n• Higher electronegativity of atom (F > Cl > Br)\n• Closer proximity to COOH (β < α << γ)\n\nEDG (alkyl groups) have the opposite effect: slightly weaken the acid.',
        },
      ],
    },

    // ── Concept 2: Reactions of Carboxylic Acids ──────────────────────────────
    {
      id: 'ch17-c2-reactions',
      title: 'Reactions of Carboxylic Acids',
      subtitle: 'Esterification, reduction, decarboxylation, and acyl substitution',
      estimatedMinutes: 12,
      accentHex: '#a855f7',
      blocks: [
        {
          type: 'text',
          body: 'Carboxylic acids undergo several characteristic reactions: they form esters by reaction with alcohols (Fischer esterification), they are reduced to primary alcohols by LiAlH₄, they undergo decarboxylation under specific conditions (especially β-keto acids and malonic acids), and they react with amines to form amides. Each reaction has a mechanistic rationale worth understanding deeply.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Fischer Esterification: Equilibrium and Mechanisms',
          body: 'RCOOH + R\'OH ⇌ RCOOR\' + H₂O (acid-catalyzed, equilibrium)\n\nMechanism: (1) acid protonates C=O → activates carbonyl; (2) alcohol attacks C=O → tetrahedral intermediate; (3) proton transfers; (4) loss of water; (5) deprotonation → ester.\n\nThe reaction is an EQUILIBRIUM — it doesn\'t go to completion on its own. To drive it forward:\n• Use excess alcohol (cheap solvent, shifts equilibrium)\n• Remove water (Dean-Stark trap, molecular sieves)\n• Use acid as both catalyst and dehydrating agent (concentrated H₂SO₄)\n\nThe reverse reaction is acid-catalyzed hydrolysis: RCOOR\' + H₂O → RCOOH + R\'OH (use excess water to drive forward).',
        },
        {
          type: 'table',
          headers: ['Reaction', 'Reagents', 'Product', 'Notes'],
          rows: [
            ['Fischer esterification', 'R\'OH + H₂SO₄ cat., heat', 'RCOOR\'', 'Equilibrium; use excess alcohol or remove H₂O'],
            ['Acyl chloride formation', 'SOCl₂ or PCl₃ or PCl₅', 'RCOCl', 'SOCl₂ cleanest (SO₂ and HCl by-products are gases)'],
            ['Anhydride formation', '(RCO)₂O or P₂O₅', 'RCOOCOR (anhydride)', 'Self-condensation under dehydration conditions'],
            ['Amide formation', 'R\'NH₂ + heat (or SOCl₂ first)', 'RCONHR\'', 'Direct amide bond formation from salt; or via acyl chloride route'],
            ['Reduction', 'LiAlH₄/ether then H₂O', 'RCH₂OH (primary alcohol)', 'NaBH₄ NOT strong enough for carboxylic acids'],
            ['Decarboxylation', 'Heat (for β-keto acids)', 'R–H + CO₂', 'Requires β-carbonyl for cyclic TS; malonic acids also decarboxylate'],
            ['Hell-Volhard-Zelinsky', 'Br₂/P (phosphorus)', 'α-bromoacid (RCHBrCOOH)', 'Bromination at α-carbon; P converts RCOOH to acyl bromide in situ'],
          ],
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Decarboxylation: Why β-Keto Acids Are Special',
          body: 'Simple carboxylic acids don\'t decarboxylate at mild temperatures. But β-keto acids (a C=O group β to the COOH) decarboxylate readily when heated (~100°C).\n\nWhy? The β-keto acid adopts a 6-membered cyclic transition state where:\n1. The β-carbonyl accepts a proton from the COOH\n2. CO₂ is lost simultaneously\n3. An enol is formed (which tautomerizes to the ketone)\n\nThe 6-membered cyclic TS is geometrically perfect — no high-energy intermediates. This concerted mechanism explains why malonic acid (HOOCCH₂COOH) and acetoacetic acid (CH₃COCH₂COOH) decarboxylate so readily — both have the β-carbonyl group required.\n\nThis is the basis of the malonic ester synthesis and acetoacetic ester synthesis (see Ch 19).',
        },
      ],
      mcqs: [
        {
          question: 'In Fischer esterification of acetic acid with methanol (excess), with H₂SO₄ catalyst, what is the rate-determining step?',
          options: [
            'Protonation of the carbonyl oxygen',
            'Nucleophilic attack of methanol on the activated (protonated) carbonyl carbon',
            'Loss of water from the tetrahedral intermediate',
            'Deprotonation of the product ester',
          ],
          correct: 1,
          explanation: 'In Fischer esterification: (1) H⁺ protonates C=O (fast); (2) ROH nucleophilic attack on protonated C=O (rate-determining — this is the slow, bond-forming step); (3) proton transfer within tetrahedral intermediate (fast); (4) H₂O leaves (fast); (5) deprotonation (fast). The nucleophilic addition of the alcohol to the activated carbonyl (step 2) is the slowest step — it involves two species coming together and forming a C–O bond with an energy barrier. Using excess alcohol or acid catalyst that makes the C=O more electrophilic helps this step.',
        },
        {
          question: 'Why does β-ketoacid acetoacetic acid (CH₃COCH₂COOH) decarboxylate so easily when heated, while acetic acid (CH₃COOH) does not?',
          options: [
            'Acetoacetic acid has a lower molecular weight',
            'Acetoacetic acid contains a β-carbonyl group (ketone one carbon away from COOH) that allows a 6-membered cyclic transition state for concerted proton transfer and CO₂ loss',
            'The methyl ketone in acetoacetic acid acts as a radical initiator for CO₂ loss',
            'Acetic acid has a stronger C–C bond because it is smaller',
          ],
          correct: 1,
          explanation: 'In acetoacetic acid (CH₃CO–CH₂–COOH), the carbonyl group is in the β position (two carbons from COOH). A 6-membered cyclic TS forms where: O of β-carbonyl accepts the proton from COOH, C–C(=O)₂ breaks, CO₂ leaves, and the enol of acetone forms simultaneously. This concerted, pericyclic-like pathway has a low activation energy. Acetic acid (CH₃COOH) has no β-carbonyl → cannot form a 6-membered cyclic TS → decarboxylation requires much higher temperatures and is far less efficient.',
        },
        {
          question: 'Benzoic acid is treated with SOCl₂ (thionyl chloride). What is the product and what are the advantages over using PCl₃?',
          options: [
            'Benzaldehyde — SOCl₂ reduces the acid',
            'Benzoyl chloride (C₆H₅COCl) — the acyl chloride. Advantages of SOCl₂: by-products (SO₂ and HCl) are gases, making workup easy (just evaporate). No solid phosphoric acid by-products to separate',
            'Sodium benzoate — SOCl₂ is basic and neutralizes the acid',
            'Benzene — decarboxylation',
          ],
          correct: 1,
          explanation: 'Thionyl chloride (SOCl₂) converts carboxylic acids to acyl chlorides: RCOOH + SOCl₂ → RCOCl + SO₂ + HCl. Benzoic acid → benzoyl chloride (C₆H₅COCl). The advantage of SOCl₂ over PCl₃ or PCl₅: the by-products SO₂ and HCl are gaseous — they escape from the reaction mixture, simplifying workup (no phosphorous-containing residues). PCl₃ gives phosphorous acid (H₃PO₃); PCl₅ gives POCl₃ and HCl — both require more complex workup. The acyl chloride product is more reactive and can subsequently form anhydrides, esters, or amides.',
        },
      ],
      flashcards: [
        {
          front: 'Fischer esterification: how to drive the equilibrium forward',
          back: 'RCOOH + R\'OH ⇌ RCOOR\' + H₂O (equilibrium)\n\nShift right by:\n1. Excess alcohol (cheapest reagent as co-solvent)\n2. Remove water (Dean-Stark trap for high-bp alcohols; molecular sieves)\n3. Concentrated H₂SO₄ (catalyst + desiccant)\n\nReverse (hydrolysis) driven right by excess water + acid or base.',
        },
        {
          front: 'Decarboxylation of β-keto acids: mechanism',
          back: 'β-Keto acid: C=O in the β position to COOH\n\n6-membered cyclic TS: carbonyl O accepts COOH proton simultaneously with C–COOH bond breaking → enol + CO₂\n\nEnol tautomerizes → ketone\n\nExamples that decarboxylate readily: malonic acid (HOOCCH₂COOH), acetoacetic acid (CH₃COCH₂COOH)\nApplication: malonic ester synthesis, acetoacetic ester synthesis',
        },
        {
          front: 'Making acyl chlorides: SOCl₂ vs PCl₃',
          back: 'SOCl₂ (thionyl chloride): RCOOH + SOCl₂ → RCOCl + SO₂↑ + HCl↑\nAdvantage: gaseous by-products (easy workup, pure product)\n\nPCl₃: 3 RCOOH + PCl₃ → 3 RCOCl + H₃PO₃ (solid by-product)\nPCl₅: RCOOH + PCl₅ → RCOCl + POCl₃ + HCl\nDisadvantage: phosphorus by-products need separation\n\nPreferred in lab: SOCl₂ for most purposes',
        },
      ],
    },
  ],
}
