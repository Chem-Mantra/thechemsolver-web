import type { OrgoChapter } from '../types'

export const CH10: OrgoChapter = {
  id: 'ch10',
  number: 10,
  title: 'Alcohols, Ethers & Epoxides',
  orgo: 1,
  accentHex: '#10b981',
  concepts: [

    // ── Concept 1: Alcohols — Properties & Synthesis ──────────────────────────
    {
      id: 'ch10-c1-alcohols',
      title: 'Alcohols: Classification, Properties & Synthesis',
      subtitle: 'Oxidation states, H-bonding, and how to make ROH',
      estimatedMinutes: 11,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'Alcohols (R–OH) are one of the most important functional groups in organic chemistry and biology — every monosaccharide, every steroid, and most pharmaceuticals contain hydroxyl groups. The O–H bond is polar and can hydrogen-bond, giving alcohols disproportionately high boiling points and water solubility for their molecular weight. The carbon bearing –OH can be primary (1°), secondary (2°), or tertiary (3°), and this classification determines reactivity.',
        },
        {
          type: 'table',
          headers: ['Method', 'Starting material', 'Product', 'Conditions'],
          rows: [
            ['Hydration of alkene (Markovnikov)', 'Alkene', 'Markovnikov alcohol (OH on more substituted C)', 'H₂SO₄/H₂O or Hg(OAc)₂/H₂O then NaBH₄'],
            ['Hydroboration-oxidation', 'Alkene', 'Anti-Markovnikov alcohol (OH on less substituted C)', 'BH₃·THF or 9-BBN, then H₂O₂/NaOH'],
            ['Hydration of alkyne', 'Terminal alkyne', 'Methyl ketone (Markovnikov) or aldehyde (anti-Markovnikov)', 'H₂SO₄/H₂O/HgSO₄ or 9-BBN then oxidize'],
            ['Reduction of carbonyl', 'Aldehyde', 'Primary alcohol (1°)', 'NaBH₄/EtOH or LiAlH₄/ether'],
            ['Reduction of carbonyl', 'Ketone', 'Secondary alcohol (2°)', 'NaBH₄/EtOH or LiAlH₄/ether'],
            ['Reduction of ester/acid', 'Ester or carboxylic acid', 'Primary alcohol (1°)', 'LiAlH₄/ether (NaBH₄ too weak for esters)'],
            ['Grignard addition', 'Carbonyl + RMgX', '1°/2°/3° alcohol', 'R\'MgX in ether, then H₂O workup'],
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Oxidation Levels of Alcohols',
          body: 'The carbon bearing –OH can be at various oxidation levels:\n• Primary alcohol (RCH₂OH) → oxidized to aldehyde (RCHO) → further oxidized to carboxylic acid (RCOOH)\n• Secondary alcohol (R₂CHOH) → oxidized to ketone (R₂C=O); ketones cannot be easily oxidized further without C–C bond cleavage\n• Tertiary alcohol (R₃COH) → NOT oxidized by CrO₃, K₂Cr₂O₇, or KMnO₄ (no H on the C–OH carbon)\n\nOxidation "moves" the functional group up the oxidation ladder. The carbon loses H atoms or gains O atoms. Tertiary alcohols resist oxidation because there is no H on the carbinol carbon to remove.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Which Oxidant for Which Alcohol?',
          body: 'PCC (pyridinium chlorochromate) in CH₂Cl₂: oxidizes 1° → aldehyde (STOPS there; mild)\nK₂Cr₂O₇ or CrO₃/H₂SO₄ (Jones): oxidizes 1° → carboxylic acid; 2° → ketone (strong)\nKMnO₄ (hot, concentrated): same as Jones (also cleaves C=C)\nSwern oxidation (oxalyl chloride/DMSO/Et₃N): 1° → aldehyde or 2° → ketone; mild, good for sensitive substrates\n\nMechanic shortcut: PCC = stops at aldehyde. Jones = goes to acid.',
        },
      ],
      mcqs: [
        {
          question: 'Treatment of 1-butanol with PCC in CH₂Cl₂ gives what product?',
          options: [
            'Butanal (CH₃CH₂CH₂CHO) — oxidized to aldehyde, stopped by PCC',
            'Butanoic acid (CH₃CH₂CH₂COOH) — further oxidized to acid',
            'Butane — reduced',
            'No reaction — PCC does not oxidize primary alcohols',
          ],
          correct: 0,
          explanation: 'PCC (pyridinium chlorochromate) is a mild chromium-based oxidant that oxidizes primary alcohols to aldehydes and stops there — it does not further oxidize aldehydes to carboxylic acids (unlike Jones reagent or KMnO₄). 1-Butanol (CH₃CH₂CH₂CH₂OH, 1°) → butanal (CH₃CH₂CH₂CHO). To get all the way to butanoic acid from 1-butanol, you would need Jones reagent (CrO₃/H₂SO₄) or K₂Cr₂O₇/H₂SO₄.',
        },
        {
          question: 'Why does tert-butanol NOT react with PCC or K₂Cr₂O₇?',
          options: [
            'Tert-butanol is not an alcohol — it is an ether',
            'Oxidation requires removal of the H on the C–OH carbon, and tert-butanol has no such H (C–OH is bonded to three other carbons, no H)',
            'Tert-butanol\'s OH is too strongly H-bonded to react',
            'Chromium reagents only react with primary alcohols',
          ],
          correct: 1,
          explanation: 'Oxidation of an alcohol to a carbonyl compound requires loss of one H from the C–OH carbon (the hydrogen α to the OH is removed). In tert-butanol [(CH₃)₃COH], the carbon bearing the OH has three methyl groups attached and NO hydrogen. There is no H to remove → no oxidation possible by standard methods. This is why tertiary alcohols are resistant to oxidation by CrO₃, K₂Cr₂O₇, PCC, KMnO₄, etc. Oxidation by strong oxidants like HNO₃ would cause C–C bond cleavage instead.',
        },
        {
          question: 'Which set of reagents converts 2-butanone (methyl ethyl ketone) to 2-butanol?',
          options: [
            'K₂Cr₂O₇/H₂SO₄ (Jones conditions)',
            'NaBH₄ in ethanol, then H₂O workup',
            'LiAlH₄, then H₂O workup (gives more complete reduction to primary alcohol)',
            'PCC/CH₂Cl₂',
          ],
          correct: 1,
          explanation: 'NaBH₄ (sodium borohydride) is a mild reducing agent that selectively reduces ketones and aldehydes to secondary and primary alcohols respectively. 2-Butanone (CH₃COCH₂CH₃) is a ketone → NaBH₄ reduces C=O to C–OH → 2-butanol (CH₃CH(OH)CH₂CH₃, secondary alcohol). NaBH₄ does NOT reduce esters, carboxylic acids, or amides. Jones conditions and PCC are OXIDANTS (opposite direction). LiAlH₄ would give the same alcohol here, but is stronger and reduces esters/amides too.',
        },
      ],
      flashcards: [
        {
          front: 'Alcohol oxidation: which reagent gives which product?',
          back: 'PCC (CH₂Cl₂): 1° ROH → aldehyde (STOPS); 2° ROH → ketone; 3° ROH → no reaction\nJones (CrO₃/H₂SO₄ or K₂Cr₂O₇/H₂SO₄): 1° ROH → carboxylic acid; 2° ROH → ketone; 3° → no reaction\nSwern (oxalyl chloride, DMSO, Et₃N): 1° → aldehyde; 2° → ketone; mild\nKMnO₄ (hot acidic): 1° → acid; 2° → ketone; also cleaves alkenes',
        },
        {
          front: 'Grignard reagent addition to carbonyl: what determines product class?',
          back: 'RMgX (Grignard) adds to C=O, then H₂O/H⁺ workup gives alcohol:\n• Formaldehyde (HCHO) → primary alcohol (R–CH₂OH)\n• Aldehyde (RCHO) → secondary alcohol (R–CHOH–R\')\n• Ketone (R₂CO) → tertiary alcohol (R–C(OH)(R\')–R\'\')\n• Ester (R\'COOR) → tertiary alcohol (2 equivalents of RMgX adds)\n• CO₂ → carboxylic acid (RMgX + CO₂ → RCOOH after workup)',
        },
        {
          front: 'NaBH₄ vs LiAlH₄: what can each reduce?',
          back: 'NaBH₄ (mild): reduces aldehydes and ketones → alcohols. Does NOT reduce esters, amides, carboxylic acids, or C=C bonds.\n\nLiAlH₄ (strong): reduces aldehydes, ketones, esters, amides, carboxylic acids, nitriles → all reduced. Also reduces epoxides. Does NOT reduce isolated C=C bonds.\n\nLiAlH₄ must be used in dry ether (reacts violently with water). NaBH₄ is safe in alcoholic solution.',
        },
      ],
    },

    // ── Concept 2: Ethers & Epoxides ──────────────────────────────────────────
    {
      id: 'ch10-c2-ethers-epoxides',
      title: 'Ethers & Epoxides',
      subtitle: 'Williamson synthesis, ether cleavage, and the chemistry of strain',
      estimatedMinutes: 12,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'Ethers (R–O–R\') are relatively unreactive — they have no H-bond donors, resist most nucleophilic and electrophilic attack, and serve as excellent solvents for organometallic reactions. Epoxides (three-membered cyclic ethers) are the dramatic exception: ring strain (60° angles, ~105 kJ/mol) makes them highly reactive toward ring-opening by nucleophiles. This reactivity makes epoxides versatile synthetic intermediates.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Williamson Ether Synthesis',
          body: 'The standard method for making unsymmetrical ethers: an alkoxide (RO⁻) attacks a primary alkyl halide (R\'CH₂X) by SN2.\n\nR–OH + NaH → R–O⁻ Na⁺ + H₂↑\nR–O⁻ + R\'–X → R–O–R\' + X⁻\n\nWhy primary halide? SN2 requires unhindered electrophile. Secondary or tertiary halides would give mostly elimination (E2) instead.\n\nTo make tert-butyl ethyl ether: use ethanol (or ethoxide) as the alkoxide + tert-butyl halide? NO — the tertiary halide would eliminate. Instead: tert-butoxide + ethyl halide:\n(CH₃)₃C–O⁻ + CH₃CH₂Br → (CH₃)₃C–O–CH₂CH₃. Choose the halide to be 1° and the alkoxide to be the sterically hindered partner.',
        },
        {
          type: 'table',
          headers: ['Reaction', 'Conditions', 'Regiochemistry', 'Stereochemistry'],
          rows: [
            ['Epoxidation of alkene', 'm-CPBA (meta-chloroperoxybenzoic acid) or MCPBA in CH₂Cl₂', 'Peroxy acid delivers O to the less hindered face', 'Syn delivery of O (oxygen bridges both carbons from same face)'],
            ['Epoxide opening — acid conditions', 'HX or H₂SO₄/H₂O', 'Nu attacks more substituted C (Markovnikov, carbocation-like)', 'Anti addition (Nu and OH end up trans)'],
            ['Epoxide opening — base conditions', 'Nu⁻ (RO⁻, RS⁻, NH₃, RMgX)', 'Nu attacks less substituted C (SN2-like, backside)', 'Anti addition (Nu and OH trans)'],
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Acid vs Base Epoxide Opening: A Critical Distinction',
          body: 'Both acid and base conditions open epoxides with anti stereochemistry — the nucleophile attacks from the back face. The difference is REGIOCHEMISTRY:\n\nBase/neutral Nu⁻: Nu attacks the LESS hindered (less substituted) carbon → SN2 mechanism. Example: CH₃–CH–O–CH₂ (propylene oxide) + NaOMe → MeO attacks CH₂ end → 1-methoxypropan-2-ol\n\nAcid conditions (H₃O⁺, HX): the O is first protonated, building up partial positive charge on carbons. Nu attacks the MORE substituted carbon (more stable developing carbocation) → SN1-like, Markovnikov. Same propylene oxide + HBr → Br attacks C2 → 1-bromo-2-propanol (NOT 2-bromo-1-propanol)\n\nMnemonic: "Acid = Markovnikov; Base = less hindered (SN2)"',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Crown Ethers: A Special Class of Cyclic Ethers',
          body: 'Crown ethers (e.g., 18-crown-6) are cyclic polyethers with multiple oxygen lone pairs pointing inward. They can selectively bind metal cations (especially alkali metals) based on cavity size:\n• 12-crown-4: fits Li⁺\n• 15-crown-5: fits Na⁺\n• 18-crown-6: fits K⁺\n\nWhy useful? Crown ethers can "dissolve" ionic compounds in organic solvents by sequestering the cation, leaving a "naked" anion (like F⁻ or CN⁻) that is highly nucleophilic. This dramatically enhances SN2 rates. They are also used in ion-selective electrodes and as phase-transfer catalysts.',
        },
      ],
      mcqs: [
        {
          question: 'What product forms when styrene oxide (a phenyl-substituted epoxide, C₆H₅–CH–O–CH₂) is treated with NaCN (NaCN in DMF)?',
          options: [
            'CN⁻ attacks the benzylic carbon (more substituted) — product: NCCH₂CHPhOH',
            'CN⁻ attacks the less hindered terminal carbon (CH₂) via SN2 — product: PhCH(OH)CH₂CN',
            'No reaction — epoxides do not react with CN⁻',
            'CN⁻ attacks both carbons equally — racemic mixture of both regioisomers',
          ],
          correct: 1,
          explanation: 'Under neutral/basic conditions, CN⁻ is a good nucleophile that acts via SN2 mechanism. In SN2 epoxide opening, the nucleophile attacks the LESS substituted carbon — the terminal CH₂. Styrene oxide: benzylic carbon = more substituted (PhCH–); CH₂ end = less substituted (–CH₂). CN⁻ attacks CH₂ → product: PhCH(OH)–CH₂–CN (2-hydroxy-3-phenylpropanenitrile). Note: under ACID conditions, CN⁻ (or HCN as nucleophile) would attack the benzylic carbon (more stable developing carbocation) — opposite regiochemistry.',
        },
        {
          question: 'In the Williamson synthesis, why must the alkyl halide component be primary (1°)?',
          options: [
            'Alkoxides react only with primary halides because of electronic effects',
            'Secondary and tertiary halides would undergo E2 elimination rather than SN2 substitution when treated with the alkoxide (which is a base as well as a nucleophile)',
            'Primary halides have lower molecular weight, making the reaction faster',
            'Primary halides have better leaving groups',
          ],
          correct: 1,
          explanation: 'Alkoxides (RO⁻) are both nucleophiles and fairly strong bases (pKa of alcohol ~16). When treated with a secondary or tertiary alkyl halide, the base character dominates — elimination (E2) occurs preferentially over substitution (SN2), forming an alkene instead of an ether. Primary alkyl halides have less steric hindrance at the carbon bearing the leaving group, favoring backside SN2 attack. The Williamson synthesis is reliable only with methyl and primary halides. Exception: tert-butyl ethers can be made from tert-butyl cations (SN1), not via SN2.',
        },
        {
          question: 'meso-2,3-Epoxybutane (cis-2-butene epoxide) is treated with NaOH/H₂O. What is the stereochemical outcome?',
          options: [
            'meso-2,3-butanediol (retention)',
            '(2R,3R)-2,3-butanediol + (2S,3S)-2,3-butanediol (racemic)',
            '(2S,3R)-2,3-butanediol (meso diol) — but wait, this is anti addition',
            'A single enantiomer of the diol',
          ],
          correct: 1,
          explanation: 'The meso-2,3-epoxybutane is the epoxide from cis-2-butene. NaOH → OH⁻ is the nucleophile (base conditions → attacks less substituted C, which is C2 or C3 — they\'re equivalent by symmetry). Anti attack: OH⁻ attacks C2 from the back of C3, or C3 from the back of C2. Both are equivalent by symmetry for this meso epoxide. The attack at each carbon inverts its configuration. Starting from the meso epoxide (2R,3S configuration), anti attack gives a mixture of (2R,3R) + (2S,3S) butanediol — a racemic mixture of the two enantiomers. This is because the two carbons of the meso epoxide are homotopic — attack at either carbon gives the same pair of products.',
        },
      ],
      flashcards: [
        {
          front: 'Williamson ether synthesis: the rules',
          back: 'Route: R–OH → NaH or NaOH → R–O⁻, then R\'–X (SN2) → R–O–R\'\n\nAlways use the PRIMARY halide for the R\'–X component (SN2 requires unhindered electrophile)\nAlways use the alcohol that would be secondary or tertiary as the R–OH (becomes the alkoxide — acts as nucleophile, not electrophile)\n\nFor tert-butyl ethers: cannot use SN2 (3° halide would eliminate). Use acid-catalyzed addition to isobutylene instead (tBuOH under acidic conditions).',
        },
        {
          front: 'Epoxide opening: base vs acid conditions — regiochemistry',
          back: 'BASE (Nu⁻ in neutral/basic conditions): SN2 → attacks LESS substituted C. Back-face attack. Anti stereochemistry.\n\nACID (H₃O⁺, HX): protonates O first → builds partial + on carbons → Nu attacks MORE substituted C (like SN1). Anti stereochemistry.\n\nBoth base and acid opening: overall ANTI addition to the C–C bond (both OH and Nu trans). The difference is WHICH carbon the Nu attacks.',
        },
        {
          front: 'Epoxidation of an alkene: reagent and stereochemistry',
          back: 'm-CPBA (or peracid like MCPBA) delivers an oxygen atom to the C=C double bond. The oxygen bridges both carbons from the same face → epoxide is formed with retention of alkene geometry.\n\ncis alkene → cis epoxide (methyls on same side in the 3-membered ring)\ntrans alkene → trans epoxide (methyls on opposite sides)\n\nSubsequent ring opening (with Nu) then gives an overall TRANS (anti) diol or Nu-OH product relative to the starting alkene.',
        },
      ],
    },
  ],
}
