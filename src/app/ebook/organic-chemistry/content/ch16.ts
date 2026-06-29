import type { OrgoChapter } from '../types'

export const CH16: OrgoChapter = {
  id: 'ch16',
  number: 16,
  title: 'Aldehydes & Ketones',
  orgo: 2,
  accentHex: '#a855f7',
  concepts: [

    // ── Concept 1: Nucleophilic Addition to the Carbonyl ──────────────────────
    {
      id: 'ch16-c1-nucl-addition',
      title: 'Nucleophilic Addition to the Carbonyl',
      subtitle: 'The mechanism that underlies all carbonyl chemistry',
      estimatedMinutes: 13,
      accentHex: '#a855f7',
      blocks: [
        {
          type: 'text',
          body: 'The carbon-oxygen double bond of aldehydes and ketones is polarized: oxygen is electronegative (δ−) and carbon is electrophilic (δ+). The fundamental reaction is nucleophilic addition: Nu:⁻ attacks the electrophilic carbonyl carbon, the π bond breaks to give a tetrahedral alkoxide intermediate, which is then protonated to give the product. This mechanism underlies hemiacetal, acetal, hydrate, imine, and enamine formation — all variations on the same theme.',
        },
        {
          type: 'table',
          headers: ['Nucleophile', 'Product', 'Conditions', 'Reversible?'],
          rows: [
            ['H₂O', 'Hydrate (geminal diol, R₂C(OH)₂)', 'Acid or base catalysis', 'Yes — equilibrium strongly favors ketone; only formaldehyde significantly hydrated'],
            ['ROH (1 eq.)', 'Hemiacetal (R\'C(OH)(OR))', 'Acid catalysis', 'Yes — equilibrium slightly favors hemiacetal for some structures'],
            ['ROH (2 eq.)', 'Acetal (R\'C(OR)₂)', 'Acid catalysis + remove water (Dean-Stark)', 'Reversible under acid; stable under base'],
            ['RNH₂', 'Imine (Schiff base, R\'C=NR) + H₂O', 'Mild acid (pH 4–5), remove water', 'Reversible at pH extremes'],
            ['R₂NH', 'Enamine + H₂O', 'Acid catalysis, remove water', 'Reversible under hydrolysis'],
            ['HCN', 'Cyanohydrin (R\'C(OH)(CN))', 'Base catalysis (NaCN + H⁺)', 'Reversible; equilibrium depends on substrate'],
            ['R\'MgX (Grignard)', 'Tertiary alcohol (from ketone)', 'Ether, then H₂O workup', 'No — irreversible; addition is exothermic'],
            ['NaBH₄, LiAlH₄', 'Primary or secondary alcohol', 'EtOH (NaBH₄); ether (LAH)', 'No — reduction; irreversible'],
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Why Aldehydes Are More Reactive Than Ketones',
          body: 'Two factors make aldehydes more reactive toward nucleophilic addition:\n\n1. Steric effects: aldehydes have one H on the carbonyl carbon — less hindered. Ketones have two R groups — more steric crowding blocks nucleophile approach.\n\n2. Electronic effects: alkyl groups are electron-donating (hyperconjugation, inductive). Each R group on the carbonyl carbon donates electrons, partially reducing the δ+ on carbonyl C and making it less electrophilic. Aldehydes have only one such R group; ketones have two → ketones are less electrophilic.\n\nReactivity: formaldehyde (HCHO) > acetaldehyde (CH₃CHO) > propionaldehyde > ketones. Both factors work in the same direction: more substitution = less reactive.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Acetals as Protecting Groups',
          body: 'Acetals (R\'C(OR)₂) are stable under basic conditions but hydrolyze under acidic aqueous conditions. This makes them ideal protecting groups for aldehydes and ketones:\n\nProtecting: RCHO + excess ROH + H⁺ → acetal (protected). Now you can do base-sensitive reactions elsewhere in the molecule.\n\nDeprotecting: acetal + H₃O⁺ (dilute acid, water) → RCHO (restored).\n\nClassic protecting group: ethylene glycol (HOCH₂CH₂OH) + aldehyde → cyclic 1,3-dioxolane (very stable cyclic acetal). The cyclic structure makes it especially stable (entropy advantage).',
        },
      ],
      mcqs: [
        {
          question: 'Which carbonyl compound reacts most readily with nucleophiles?',
          options: [
            'Acetone (propan-2-one, (CH₃)₂CO)',
            'Benzaldehyde (PhCHO)',
            'Formaldehyde (HCHO) — two H atoms, no alkyl groups, least hindered',
            'Cyclohexanone',
          ],
          correct: 2,
          explanation: 'Formaldehyde is the most reactive carbonyl compound toward nucleophilic addition. It has H₂C=O with two H atoms on carbon — no steric hindrance, and no electron-donating alkyl groups to reduce the electrophilicity of the carbonyl carbon. Formaldehyde is so reactive it is essentially completely hydrated in water (gem-diol equilibrium >> 99%). Acetone and cyclohexanone (ketones) are much less reactive due to two alkyl groups. Benzaldehyde is less reactive than aliphatic aldehydes because the phenyl ring withdraws electrons by resonance from the carbonyl partially, but also has some conjugation.',
        },
        {
          question: 'Cyclohexanone reacts with ethylene glycol (HOCH₂CH₂OH) under acidic conditions with a Dean-Stark trap (removes water). What is the product and why is the trap needed?',
          options: [
            'A cyanohydrin — the glycol acts as a carbon nucleophile',
            'A cyclic acetal (1,3-dioxolane) — the Dean-Stark trap removes water to shift the equilibrium toward acetal formation (Le Chatelier)',
            'A hemiacetal only — cyclic acetals require different conditions',
            'Cyclohexanol — the glycol reduces the ketone',
          ],
          correct: 1,
          explanation: 'Acetal formation from a ketone and a diol under acid catalysis is an equilibrium reaction. The overall process loses H₂O: RCHO + HO–CH₂CH₂–OH ⇌ cyclic acetal + H₂O. By removing water with a Dean-Stark trap (a reflux device that collects the water azeotropically), the equilibrium is shifted to the right (Le Chatelier), favoring the cyclic acetal. The cyclic acetal product (a 1,3-dioxolane ring) is additionally stabilized by the favorable entropy effect of cyclization. This is the standard method for protecting a ketone as a cyclic acetal.',
        },
        {
          question: 'Acetaldehyde (CH₃CHO) reacts with methylamine (CH₃NH₂) under mild acid conditions. What is the final product after loss of water?',
          options: [
            'An acetal: CH₃CH(NHCH₃)₂',
            'An imine (Schiff base): CH₃CH=NCH₃',
            'A hemiacetal: CH₃CH(OH)(NHCH₃)',
            'An amide: CH₃CONHCH₃',
          ],
          correct: 1,
          explanation: 'Primary amines (RNH₂) react with aldehydes or ketones via nucleophilic addition-elimination to form imines (Schiff bases, R\'CH=NR). Mechanism: (1) RNH₂ adds to C=O → hemiaminal intermediate (R\'CH(OH)(NHR)); (2) acid-catalyzed elimination of water → imine (R\'CH=NR). Mild acid (pH 4–5) is optimal: too basic and insufficient activation; too acidic and the amine is protonated (no lone pair). For methylamine + acetaldehyde: CH₃CHO + CH₃NH₂ → CH₃CH=NCH₃ + H₂O (N-methylmethyleneimine or N-methyl ethylideneamine).',
        },
      ],
      flashcards: [
        {
          front: 'Nucleophilic addition to C=O: general mechanism',
          back: 'Step 1: Nu:⁻ attacks electrophilic carbonyl C → π bond breaks → tetrahedral alkoxide intermediate (C now sp³, bears –O⁻)\nStep 2: protonation of O⁻ (by solvent, acid, or H₂O workup) → product alcohol or hemi-acetal or imine\n\nNote: the nucleophile adds to the less hindered face (important for stereocontrol in ketones). Aldehydes react faster than ketones (less steric + less electron donation).',
        },
        {
          front: 'Acetal formation and its use as a protecting group',
          back: 'RCHO + 2 ROH + H⁺ → acetal (RCHOR)₂ + H₂O\nOr with diol: RCHO + HOCH₂CH₂OH + H⁺ → cyclic 1,3-dioxolane + H₂O\n\nStable: to base, nucleophiles, reductants (NaBH₄, LAH)\nUnstable: to aqueous acid (hydrolysis)\n\nUse: protect RCHO (or RCOR) during base reactions elsewhere in molecule. Deprotect with H₃O⁺.',
        },
        {
          front: 'Imine (Schiff base) vs enamine formation',
          back: 'Imine: PRIMARY amine (R-NH₂) + aldehyde/ketone → R-C=N-R\' (carbon-nitrogen double bond, nitrogen has H removed)\n\nEnamine: SECONDARY amine (R₂NH) + aldehyde/ketone → R₂N-C=C (carbon-carbon double bond; the α-carbon loses H instead of N-H, because N has no H to lose)\n\nBoth: add-then-eliminate water; reversible; mild acid conditions optimal (pH 4-5)',
        },
      ],
    },

    // ── Concept 2: Wittig Reaction, Wolff-Kishner & Oxidation ─────────────────
    {
      id: 'ch16-c2-advanced',
      title: 'Wittig Reaction, Wolff-Kishner & Baeyer-Villiger',
      subtitle: 'Carbonyl conversion to alkene, to alkane, and to ester',
      estimatedMinutes: 12,
      accentHex: '#a855f7',
      blocks: [
        {
          type: 'text',
          body: 'Three advanced transformations of aldehydes and ketones deserve special attention: the Wittig reaction converts C=O to C=C (alkene synthesis with control of geometry), the Wolff-Kishner reduction converts C=O to C–H (alkane synthesis), and the Baeyer-Villiger oxidation converts a ketone to an ester by inserting an oxygen atom.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Wittig Reaction: Converting C=O to C=C',
          body: 'Reagent: a phosphorus ylide (R₂C=PPh₃ or R₂C⁻–⁺PPh₃)\nMechanism: ylide C attacks carbonyl C → betaine → oxaphosphetane → [2+2] retrocycloaddition releases alkene + triphenylphosphine oxide (Ph₃P=O)\n\nKey features:\n• The C=O carbon and the ylide carbon exchange partners: what was C=O becomes C=C\n• Regiochemistry: the new double bond forms exactly where the C=O was\n• Geometry: stabilized ylides (EWG on ylide, e.g., ester) → trans (E) alkene; non-stabilized ylides (alkyl) → cis (Z) alkene\n• Driving force: formation of very stable Ph₃P=O (P=O bond ~540 kJ/mol)\n\nPh₃P + RX → Ph₃P⁺–CHR → n-BuLi → Ph₃P=CR⁻ (ylide). First make alkyl triphenylphosphonium salt, then deprotonate.',
        },
        {
          type: 'table',
          headers: ['Reaction', 'Reagents', 'C=O → Product', 'Notes'],
          rows: [
            ['Wittig', 'R₂C=PPh₃ (ylide)', 'C=O → C=C (alkene)', 'Stereocontrol; E or Z depending on ylide type'],
            ['Wolff-Kishner', 'H₂NNH₂ (hydrazine), KOH, ethylene glycol, heat', 'C=O → CH₂', 'Strongly basic conditions; converts ketone/aldehyde to alkane'],
            ['Clemmensen', 'Zn/Hg amalgam, concentrated HCl, heat', 'C=O → CH₂', 'Strongly acidic conditions; alternative to Wolff-Kishner'],
            ['Baeyer-Villiger', 'm-CPBA or peracid', 'R–CO–R\' → R–CO–O–R\' (ester)', 'O inserted between C=O and the more substituted R group'],
            ['Tollens\' test', 'AgNO₃/NH₃ (silver mirror)', 'Aldehyde oxidized to acid; Ag mirror', 'Test for ALDEHYDES only (not ketones)'],
            ['Fehling\'s/Benedict\'s', 'Cu²⁺ complex', 'Aldehyde → acid; Cu²⁺ → Cu₂O (red)', 'Test for reducing sugars and aliphatic aldehydes'],
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Baeyer-Villiger: Which C–C Bond Migrates?',
          body: 'The Baeyer-Villiger oxidation uses a peracid (m-CPBA, peracetic acid) to insert an oxygen into the C–CO bond. The key is: which C migrates?\n\nMigration aptitude: tertiary > secondary > phenyl > primary > methyl (same as in carbocation rearrangements)\n\nThe MORE substituted (or more electron-rich) C–C bond migrates, placing O between C=O and that group:\n\n• Cyclohexanone + peracid → caprolactone (7-membered ring lactone) — ring expansion by 1 atom\n• Methyl ketone (RCOCH₃) + peracid → ester RCOOCH₃ (the R migrates, not CH₃ — tertiary > methyl)\n\nThe driving force: the "Criegee intermediate" (peracid O attacks C=O to form intermediate, then the better-migrating group migrates with its electrons to the peracid O).',
        },
      ],
      mcqs: [
        {
          question: 'A non-stabilized phosphonium ylide (Ph₃P=CHCH₃, from ethyl triphenylphosphonium + n-BuLi) reacts with cyclohexanone. What is the major product?',
          options: [
            'Methylenecyclohexane (C=CH₂ exocyclic) — non-stabilized ylides give Z products',
            '(Z)-1-methylenecyclohexane is not meaningful; actually exocyclic alkene (methylenecyclohexane, 1-methylcyclohexyl type)',
            'Ethylidenecyclohexane (cyclohexane with =CHCH₃ exocyclic), predominantly the Z (cis) isomer',
            'Cyclohexyl methyl ether',
          ],
          correct: 2,
          explanation: 'The Wittig reaction converts C=O to C=C. Cyclohexanone (C=O) + Ph₃P=CHCH₃ (ylide with one CH₃ group) → ethylidenecyclohexane (cyclohexyl ring with exocyclic C=CHCH₃). The ring C=O carbon becomes the new C=C carbon. The new double bond is exocyclic to the ring. Non-stabilized ylides (no EWG on ylide carbon) give predominantly the Z (cis) alkene via the "syn" betaine/oxaphosphetane pathway. For exocyclic alkenes, the Z designation refers to the relative arrangement of groups around the new C=C.',
        },
        {
          question: 'Phenyl methyl ketone (acetophenone, C₆H₅–CO–CH₃) is treated with m-CPBA. What is the major Baeyer-Villiger product?',
          options: [
            'Methyl benzoate (C₆H₅–CO–O–CH₃) — phenyl migrates preferentially over methyl',
            'Phenyl acetate (C₆H₅–O–CO–CH₃) — methyl migrates',
            'An equal mixture of both esters',
            'No reaction — acetophenone is resistant to peracids',
          ],
          correct: 0,
          explanation: 'Baeyer-Villiger: the group with the higher migration aptitude migrates. Migration aptitude: tertiary > secondary > phenyl > primary > methyl (H). The phenyl group (Ar) migrates more readily than methyl (CH₃). Phenyl migrates → the O is inserted between C=O and phenyl → methyl benzoate (PhCO–O–CH₃). In methyl benzoate, the phenyl is now on the acid side and O connects to CH₃. This gives phenol-derived ester, not phenyl acetate.',
        },
        {
          question: 'How does the Wolff-Kishner reduction differ from the Clemmensen reduction?',
          options: [
            'Wolff-Kishner reduces ketones to alcohols; Clemmensen reduces aldehydes to alkanes',
            'Both reduce C=O to CH₂, but Wolff-Kishner uses strongly basic conditions (hydrazine/KOH/heat) and Clemmensen uses strongly acidic conditions (Zn/Hg, HCl). Used complementarily for acid- or base-sensitive molecules',
            'Wolff-Kishner is more selective — only reduces aromatic ketones',
            'Clemmensen uses D₂ for deuterium labeling while Wolff-Kishner uses H₂',
          ],
          correct: 1,
          explanation: 'Both Wolff-Kishner and Clemmensen achieve the same transformation: C=O (aldehyde or ketone) → CH₂ (methylated/reduced carbon). The choice depends on the rest of the molecule: If the molecule has acid-sensitive groups (acetals, epoxides, some esters): use Wolff-Kishner (strongly basic, not acidic). If the molecule has base-sensitive groups (esters under reflux with KOH, acid-stable substrates): use Clemmensen (strongly acidic, not basic). These are complementary tools for the same goal.',
        },
      ],
      flashcards: [
        {
          front: 'Wittig reaction: mechanism summary',
          back: 'Ylide (R₂C=PPh₃) + C=O → betaine → oxaphosphetane (4-membered ring) → [2+2] retrocycloaddition → alkene + Ph₃P=O\n\nStabilized ylides (EWG on carbon): thermodynamic path → mostly (E) alkene\nNon-stabilized ylides (alkyl on carbon): kinetic path → mostly (Z) alkene\n\nKey use: put a double bond exactly where the C=O was, with controlled geometry',
        },
        {
          front: 'Wolff-Kishner vs Clemmensen: conditions and choice',
          back: 'Both: C=O → CH₂ (reduction of carbonyl to methylene)\n\nWolff-Kishner: H₂NNH₂, KOH, heat (ethylene glycol solvent). BASIC conditions.\nClemmensen: Zn(Hg), concentrated HCl, heat. ACIDIC conditions.\n\nChoose Wolff-Kishner when: molecule is acid-sensitive.\nChoose Clemmensen when: molecule is base-sensitive.\n\nApplication: Friedel-Crafts acylation + Clemmensen or Wolff-Kishner → make alkylbenzenes (avoids F-C alkylation problems).',
        },
        {
          front: 'Baeyer-Villiger oxidation: which bond migrates?',
          back: 'Peracid (m-CPBA) inserts O into the C–CO bond. The more substituted/electron-rich group migrates:\n\nMigration aptitude: 3° > 2° > Ph/vinyl > 1° > CH₃\n\nResult: O inserted between C=O and the migrating R group → ester (or lactone for cyclic ketones).\n\nKetone → ester: RCOR\' → RCOOR\' (if R migrates, R\' stays on acid side; oxygen goes between C=O and R).\n\nCyclohexanone → caprolactone (ε-caprolactone, 7-membered cyclic ester — ring expansion).',
        },
      ],
    },
  ],
}
