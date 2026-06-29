import type { OrgoChapter } from '../types'

export const CH21: OrgoChapter = {
  id: 'ch21',
  number: 21,
  title: 'Carbohydrates',
  orgo: 2,
  accentHex: '#a855f7',
  concepts: [

    // ── Concept 1: Monosaccharides: Structure, D/L, Fischer & Haworth ─────────
    {
      id: 'ch21-c1-monosaccharides',
      title: 'Monosaccharides: Structure & Stereochemistry',
      subtitle: 'D/L notation, Fischer projections, ring closure, and anomers',
      estimatedMinutes: 14,
      accentHex: '#a855f7',
      blocks: [
        {
          type: 'text',
          body: 'Carbohydrates (saccharides) are polyhydroxy aldehydes or ketones, or compounds that hydrolyze to give them. Monosaccharides are the simplest units. Their names encode structure: aldo- (aldehyde C1) vs keto- (ketone, usually C2), and the number of carbons (triose, tetrose, pentose, hexose). The most important monosaccharide, D-glucose, is an aldohexose — it has 6 carbons, an aldehyde at C1, and 4 stereocenters (theoretically 2⁴ = 16 stereoisomers of an aldohexose, of which 8 are D and 8 are L).',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'D/L Convention for Monosaccharides',
          body: 'The D/L designation is NOT based on optical rotation but on the configuration of the HIGHEST-NUMBERED STEREOCENTER (the one farthest from the carbonyl, usually the penultimate carbon):\n\n• D-configuration: –OH is on the RIGHT in a Fischer projection\n• L-configuration: –OH is on the LEFT in a Fischer projection\n\nReference compound: D-glyceraldehyde (the simplest chiral carbohydrate).\n\nImportant: D/L tells you the configuration at ONE specific center; it does NOT predict [α] (which could be + or −). For example, D-glucose is dextrorotatory (+112°), but D-fructose is levorotatory (−92°) despite both being D-sugars.\n\nIn biological systems: essentially all naturally occurring sugars are D-configuration. L-sugars exist (L-fucose, L-galactose in bacterial cell walls) but are rare.',
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'Fischer → Haworth → Chair: Three Ways to Draw Glucose',
          body: 'D-Glucose exists in three interconvertible representations:\n\n1. Fischer projection (open chain): vertical chain, C1 at top (aldehyde). Horizontal bonds → coming toward you; vertical bonds → going away. Each chiral center\'s configuration read from horizontal OH positions.\n\n2. Haworth projection (ring): glucose cyclizes when C1 aldehyde reacts with C5 –OH → 6-membered pyranose ring (glucopyranose). The ring is drawn flat. Configuration rule: groups on RIGHT in Fischer → DOWN in Haworth; groups on LEFT → UP. Except C6: always UP (it\'s outside the ring on the same side as the hydroxymethyl).\n\n3. Chair conformation (most accurate): Haworth is wrong about the ring geometry — it is not flat. The real conformer is a chair. For D-glucopyranose: the ⁴C₁ chair is most stable, with ALL substituents in equatorial positions (a very favorable geometry — partly why glucose is so abundant in nature).',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Anomers: α and β Glucose',
          body: 'When glucose cyclizes (mutarotation), a NEW stereocenter forms at C1 (the anomeric carbon). This gives two anomers:\n\n• α-D-glucopyranose: –OH at C1 is AXIAL (in chair form) or DOWN (in Haworth). [α] = +112°\n• β-D-glucopyranose: –OH at C1 is EQUATORIAL (in chair form) or UP (in Haworth). [α] = +18.7°\n\nIn water, the two anomers equilibrate (mutarotation) via the open-chain aldehyde form:\n• Equilibrium mixture: ~64% β + ~36% α (+ trace open chain)\n• β predominates because its axial anomeric –OH in α (axial = destabilized by 1,3-diaxial strain) becomes equatorial in β\n\nAnomeric effect: in sugars with electronegative substituents at C1, the axial position is slightly preferred due to electronic effects (interaction of ring O lone pairs with C–X antibonding orbital) — BUT for glucose, the equatorial β is still preferred.\n\nGlycosidic bonds (in polysaccharides) lock the anomer: α-glycosidic bonds (starch, glycogen) vs β-glycosidic bonds (cellulose) have drastically different properties.',
        },
        {
          type: 'table',
          headers: ['Feature', 'α-D-Glucopyranose', 'β-D-Glucopyranose'],
          rows: [
            ['Anomeric OH (C1)', 'Axial (chair) / Down (Haworth)', 'Equatorial (chair) / Up (Haworth)'],
            ['[α]D in water', '+112°', '+18.7°'],
            ['Equilibrium %', '~36%', '~64%'],
            ['Stability', 'Less stable (axial 1,3-diaxial strain)', 'More stable (equatorial)'],
            ['Polymer formed', 'α-glycosidic bond → starch, glycogen', 'β-glycosidic bond → cellulose'],
            ['Human digestion', 'Digestible (amylase cleaves α bonds)', 'Not digestible (no β-glucosidase in humans)'],
          ],
        },
      ],
      mcqs: [
        {
          question: 'D-Fructose is classified as a ketohexose and is levorotatory ([α] = −92°). Which statement about fructose is correct?',
          options: [
            'Fructose is an L-sugar because it is levorotatory (−)',
            'Fructose is a D-sugar because the –OH on the highest-numbered stereocenter (C5) is on the right in a Fischer projection; the negative optical rotation is independent of the D/L designation',
            'Fructose has 3 stereocenters and 8 possible stereoisomers',
            'Fructose cannot form a ring because the ketone is at C2',
          ],
          correct: 1,
          explanation: 'D/L designation and optical rotation are completely independent. D/L tells you the configuration at the penultimate stereocenter (highest-numbered chiral center, which for fructose is C5): D = OH on right in Fischer. Optical rotation (+ or −) is measured experimentally. D-fructose is a D-sugar (C5–OH on right in Fischer projection) but happens to rotate polarized light to the left (−). Many D-sugars are levorotatory (D-fructose, D-ribose). The common mistake is equating D with + and L with −. As for fructose forming a ring: yes it does! The C2 ketone reacts with C5–OH → furanose ring (5-membered, very common for fructose = β-D-fructofuranose in sucrose).',
        },
        {
          question: 'In β-D-glucopyranose (⁴C₁ chair), how are the substituents at C1, C2, C3, C4, and C6 oriented?',
          options: [
            'All hydroxyl groups and the CH₂OH are equatorial',
            'C1–OH is axial; all others equatorial',
            'C2–OH is axial; all others equatorial',
            'All are axial except CH₂OH which is equatorial',
          ],
          correct: 0,
          explanation: 'This is the key reason β-D-glucopyranose is so stable and so abundant in nature. In the ⁴C₁ chair conformation of β-D-glucopyranose, ALL five hydroxyl groups (at C1, C2, C3, C4) and the hydroxymethyl group (C6, –CH₂OH) are in equatorial positions. This is extremely unusual — no other hexose achieves this. The all-equatorial arrangement minimizes 1,3-diaxial strain dramatically. In α-D-glucopyranose (⁴C₁ chair), C1–OH is axial → less stable by ~1.5 kcal/mol. This explains why β predominates at equilibrium (64%) and why glucose is the most naturally abundant monosaccharide (thermodynamically the most stable aldohexose).',
        },
        {
          question: 'Why can humans digest starch (α-1,4-glycosidic bonds) but not cellulose (β-1,4-glycosidic bonds), even though both are polymers of glucose?',
          options: [
            'Starch has fewer glucose units and is therefore smaller and easier to break down',
            'The α-glycosidic linkage in starch produces a helical structure that is accessible to amylase; cellulose\'s β-glycosidic linkage produces an extended flat ribbon that hydrogen-bonds laterally into microfibrils. Human amylase (and salivary/pancreatic amylase) is evolutionarily shaped to cleave α-1,4 bonds. No human enzyme can cleave β-1,4 bonds — termites and ruminants outsource this to gut bacteria with β-glucosidase',
            'Starch is water-soluble and cellulose is not, so starch enters cells more easily',
            'Cellulose has α-1,6 branch points that amylase cannot reach',
          ],
          correct: 1,
          explanation: 'The α vs β glycosidic bond makes a profound structural difference: α-1,4 linkages in starch cause each glucose to flip 180° along the chain, producing a helical coil (right-handed helix, ~6 residues per turn). This helical structure is accessible to α-amylase (an enzyme evolutionarily tuned to the α-linkage geometry). β-1,4 linkages in cellulose produce an extended, flat, ribbon-like chain where alternating glucose units are flipped 180°. These chains align side-by-side and form extensive hydrogen-bonding networks → cellulose microfibrils (the most abundant polymer on Earth, provides structural rigidity in plant cell walls). The β-1,4 bond geometry is completely different from α-1,4 → different enzyme required → humans lack this enzyme.',
        },
      ],
      flashcards: [
        {
          front: 'Fischer → Haworth conversion rule for pyranose',
          back: 'Fischer (open chain) → Haworth (cyclic ring) for D-aldopyranose:\n\n1. Draw ring with O at back-right, C1 (anomeric) at right, going clockwise: C1–C2–C3–C4–C5–O\n2. Groups on RIGHT in Fischer → DOWN in Haworth (except C6)\n3. Groups on LEFT in Fischer → UP in Haworth\n4. C6 (–CH₂OH): always UP in Haworth for D-sugars\n5. α-anomer: anomeric –OH DOWN (same side as C6 reference — actually opposite C6 for D-sugars). Rule: α = axial = down in Haworth for D-glucopyranose\n6. β-anomer: anomeric –OH UP\n\nNote: Haworth is just a flattened ring — not the actual chair shape.',
        },
        {
          front: 'Important monosaccharides and their properties',
          back: 'D-Glucose: aldohexose; all–equatorial in β-⁴C₁ chair; [α] = +52.7° (equilibrium)\nD-Fructose: 2-ketohexose; forms furanose ring; [α] = −92°; sweeter than glucose\nD-Galactose: aldohexose; differs from glucose ONLY at C4 (C4–OH axial) = epimer at C4\nD-Mannose: aldohexose; C2 epimer of glucose; C2–OH changes\nD-Ribose: aldopentose; major structural sugar in RNA\n2-Deoxy-D-ribose: deoxyribose; C2 has H instead of OH; DNA backbone\n\nKey epimers: epimers differ at exactly ONE stereocenter (not anomers).',
        },
        {
          front: 'Glycosidic bond: α vs β and their consequences',
          back: 'Glycosidic bond = bond from anomeric C1 –OH to another alcohol (sugar or non-sugar = aglycone):\n\nα-glycosidic (axial at C1):\n• Starch (amylose = α-1,4; amylopectin = α-1,4 + α-1,6 branches)\n• Glycogen: same as amylopectin, more branched\n• Digestible by human amylase (cleaves α-1,4)\n\nβ-glycosidic (equatorial at C1):\n• Cellulose: β-1,4-D-glucose; flat ribbon; H-bonded microfibrils; NOT digestible by humans\n• Lactose: β-1,4-Gal-Glc (galactose–glucose)\n• Maltose: α-1,4-Glc-Glc\n• Sucrose: α-Glc–β-Fru (1,2 bond; no anomeric OH free → non-reducing sugar)',
        },
      ],
    },

    // ── Concept 2: Disaccharides, Polysaccharides & Reactions ────────────────
    {
      id: 'ch21-c2-reactions',
      title: 'Reactions of Monosaccharides',
      subtitle: 'Oxidation, reduction, glycoside formation, and key tests for reducing sugars',
      estimatedMinutes: 10,
      accentHex: '#a855f7',
      blocks: [
        {
          type: 'text',
          body: 'Monosaccharides undergo characteristic reactions via the free anomeric –OH (reducing sugars have a free hemiacetal at C1). Oxidation tests (Benedict\'s, Tollens\') work by oxidizing the aldehyde to a carboxylate — these work for all monosaccharides and disaccharides where C1 is free. The anomeric –OH can be converted to a glycoside (acetal) by reaction with an alcohol + acid, blocking mutarotation and making the compound a non-reducing sugar.',
        },
        {
          type: 'table',
          headers: ['Reaction', 'Reagent', 'Product', 'Test / Use'],
          rows: [
            ['Oxidation (mild)', 'Benedict\'s (Cu²⁺ citrate), Tollens\' (Ag⁺ NH₃)', 'Aldonic acid (COOH at C1); Cu₂O precipitate (brick-red) or Ag mirror', 'Tests for reducing sugars (free aldehyde/hemiacetal)'],
            ['Oxidation (strong)', 'Nitric acid (HNO₃)', 'Aldaric acid (COOH at both C1 and C6)', 'Used to identify aldohexose stereochemistry (aldaric acid may be meso → diagnostic)'],
            ['Reduction', 'NaBH₄ or H₂/catalyst', 'Alditol (polyol — all –OH, no carbonyl)', 'D-glucose → D-glucitol (sorbitol); D-fructose → D-glucitol + D-mannitol (both epimers at C2)'],
            ['Glycoside formation', 'ROH + H⁺ (Fischer glycosidation)', 'O-glycoside (acetal at C1); non-reducing', 'Locks anomer; basis of polysaccharide glycosidic bonds; anomeric OH now OR'],
            ['Osazone formation', 'PhNHNH₂ (phenylhydrazine, 3 equiv)', 'Bis-hydrazone at C1 and C2 (osazone)', 'Used historically to identify sugars; C3–C6 unchanged → same osazone for glucose, fructose, mannose'],
            ['Periodic acid oxidation', 'IO₄⁻ (periodate)', 'Cleavage between adjacent –OH groups; formaldehyde and formate fragments', 'Used to determine ring size and connectivity of polysaccharides'],
          ],
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Reducing vs Non-Reducing Sugars',
          body: 'A reducing sugar has a free hemiacetal (anomeric –OH not locked in glycosidic bond) → can open to free aldehyde → reducible by Benedict\'s/Tollens\'.\n\nReducing sugars: all monosaccharides (glucose, fructose, galactose, etc.); most disaccharides (maltose, lactose, cellobiose — where one anomeric OH is free).\n\nNon-reducing: sucrose (glucose C1 is linked to fructose C2 — BOTH anomeric carbons are in the glycosidic bond → no free hemiacetal → does not reduce Cu²⁺).\n\nTest: Benedict\'s test: add sugar to blue Cu²⁺ citrate solution → heat → if reducing sugar present → brick-red Cu₂O precipitate. Sucrose → no reaction (negative test).',
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'Mutarotation: The Equilibrium Between Anomers',
          body: 'Dissolve pure α-D-glucopyranose in water: [α]D = +112°. Over time, the rotation decreases to +52.7°. Dissolve pure β-D-glucopyranose: [α]D = +18.7°. Over time, the rotation increases to +52.7°. Both converge to the same equilibrium value (+52.7°) — this is mutarotation.\n\nMechanism: the ring opens to the open-chain aldehyde form (small amount present at any time), then closes to either α or β. The equilibrium lies ~64% β + ~36% α at 25°C (because β has all equatorial groups).\n\nCatalyzed by: acid or base (both accelerate ring opening). Also catalyzed by mutarotase enzyme in the body.\n\nPractical consequence: any solution of glucose in water is always a mixture of α and β. When you measure [α]D of "glucose," you measure the equilibrium mixture.',
        },
      ],
      mcqs: [
        {
          question: 'Sucrose is not a reducing sugar, but lactose is. Explain why.',
          options: [
            'Sucrose has more glucose units than lactose',
            'Sucrose has a 1,2-glycosidic bond between the anomeric C1 of glucose and anomeric C2 of fructose — both anomeric carbons are engaged in the glycosidic bond, leaving no free hemiacetal. Lactose has a β-1,4 bond from C1 of galactose to C4 of glucose — C1 of glucose is free (unmodified hemiacetal) → reducing sugar',
            'Sucrose cannot open its ring because it is too large',
            'Lactose has an α-glycosidic bond that is more easily hydrolyzed',
          ],
          correct: 1,
          explanation: 'Reducing sugar test (Benedict\'s) requires a free anomeric hemiacetal that can open to an aldehyde and reduce Cu²⁺. In sucrose (α-D-glucopyranose–1,2-β-D-fructofuranose), BOTH anomeric carbons (C1 of glucose AND C2 of fructose) are used in the glycosidic bond — there is no free anomeric –OH → sucrose cannot open to an aldehyde → non-reducing sugar. In lactose (β-D-galactopyranose–1,4-D-glucopyranose), only C1 of galactose is the glycosidic carbon; C1 of glucose (the other half) is a FREE hemiacetal → can open → reducing sugar → positive Benedict\'s test.',
        },
        {
          question: 'Reduction of D-fructose (a ketohexose) with NaBH₄ gives TWO products. Why?',
          options: [
            'NaBH₄ reduces both C1 and C2 of fructose simultaneously',
            'D-Fructose has a ketone at C2, which when reduced gives a new stereocenter at C2. Hydride can attack from either face → two different C2 configurations → D-glucitol (sorbitol) and D-mannitol (two different diastereomers differing at C2)',
            'D-Fructose is a mixture of two anomers that give different products',
            'NaBH₄ reduction is not stereospecific for any substrate — always gives mixtures',
          ],
          correct: 1,
          explanation: 'D-Fructose (open chain: HOCH₂–C(=O)–CHOH–CHOH–CHOH–CH₂OH): C2 is the ketone. NaBH₄ reduces the C2 ketone → new –OH at C2. But C2 is a prochiral center — NaBH₄ delivery is not stereospecific (no face selectivity). Hydride from either face:\n• From re face at C2 → D-glucitol (sorbitol)\n• From si face at C2 → D-mannitol\nBoth products are alditols (polyols). D-Glucitol and D-mannitol are diastereomers that differ only at C2 (which was the original ketone carbon). This is also why reduction of glucose gives only ONE product (D-glucitol): glucose\'s C1 aldehyde, when reduced, gives a non-chiral new CH₂OH — no new stereocenter created.',
        },
        {
          question: 'Why do D-glucose, D-fructose, and D-mannose all give the same osazone (phenylosazone) with excess phenylhydrazine?',
          options: [
            'They are all D-sugars with the same optical rotation',
            'Phenylhydrazine reacts with both C1 (aldehyde/ketone) and C2 (adjacent –OH, which is oxidized to ketone), destroying stereochemistry at C1 and C2. Since glucose, fructose, and mannose have identical configurations at C3, C4, and C5 (only C1 and C2 differ), they all give the same osazone crystal',
            'All three sugars have the same molecular weight',
            'Phenylhydrazine reduces all three to D-glucitol first',
          ],
          correct: 1,
          explanation: 'Osazone formation with excess PhNHNH₂ converts C1 AND C2 into phenylhydrazone groups. In this process, C1 and C2 lose their stereocenters (C1 becomes =N–NHPh and C2 is oxidized then becomes =N–NHPh). Since glucose, fructose, and mannose differ ONLY in the configuration at C1 and C2 (and nothing at C3, C4, C5), they all give the same osazone with the same melting point and crystal form. The osazone test was Emil Fischer\'s key method (1884) for identifying sugars before X-ray crystallography — osazones form characteristic yellow crystals with distinct melting points, allowing different sugar families to be distinguished even when the C1/C2 stereochemistry was not yet known.',
        },
      ],
      flashcards: [
        {
          front: 'Reducing sugar test: which sugars give positive Benedict\'s test?',
          back: 'Positive (reducing sugar): all monosaccharides (including fructose, which is a ketose but still reduces Cu²⁺ via enolization to an aldehyde); maltose (free C1 of the second glucose); lactose (free C1 of glucose component).\n\nNegative (non-reducing): sucrose (both anomeric C are locked in glycosidic bond); trehalose; many glycosides where anomeric OH is in acetal form.\n\nBenedict\'s test: Cu²⁺ (blue) → Cu₂O (brick-red precipitate) = positive for reducing sugar.\nTollens\' test: Ag⁺ → Ag mirror = positive for reducing sugar.',
        },
        {
          front: 'Key disaccharides: structure and properties',
          back: 'Maltose: α-1,4-Glc-Glc; reducing; from starch hydrolysis; cleaved by maltase\nCellobiose: β-1,4-Glc-Glc; reducing; from cellulose hydrolysis; cleaved by cellulase\nLactose: β-1,4-Gal-Glc; reducing; milk sugar; cleaved by lactase (deficiency = lactose intolerance)\nSucrose: α-Glc(1↔2β)Fru; NON-reducing (both anomeric C locked); table sugar; cleaved by sucrase/invertase → glucose + fructose (= invert sugar, levorotatory)\nTrehalose: α-1,1-Glc-Glc; non-reducing; found in yeast, insects; protects against desiccation',
        },
      ],
    },
  ],
}
