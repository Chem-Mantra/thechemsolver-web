import type { EbookUnit } from '../types'

export const UNIT4: EbookUnit = {
  id: 'unit-4',
  number: 4,
  title: 'Chemical Reactions',
  examWeight: '7–9%',
  accentHex: '#fb923c',
  concepts: [

    // ── Concept 1: Introduction to Reactions ─────────────────────────────────
    {
      id: 'u4-c1-intro-reactions',
      title: 'Introduction to Chemical Reactions',
      subtitle: 'Types, evidence, and net ionic equations',
      estimatedMinutes: 10,
      accentHex: '#fb923c',
      blocks: [
        {
          type: 'text',
          body: 'A chemical reaction involves the rearrangement of atoms to form new substances with different chemical properties. Unlike physical changes, chemical reactions break and form chemical bonds. Reactants are consumed; products are formed. The law of conservation of mass requires that a balanced equation has equal numbers of each atom on both sides.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Six Types of Reactions — Know All Six',
          body: '1. Synthesis (combination): A + B → AB (e.g., 2Na + Cl₂ → 2NaCl)\n2. Decomposition: AB → A + B (e.g., 2H₂O₂ → 2H₂O + O₂)\n3. Single displacement: A + BC → AC + B (e.g., Zn + 2HCl → ZnCl₂ + H₂)\n4. Double displacement (metathesis): AB + CD → AD + CB (e.g., NaCl + AgNO₃ → AgCl↓ + NaNO₃)\n5. Combustion: Cₓhᵧ + O₂ → CO₂ + H₂O\n6. Acid-base (neutralization): HA + BOH → BA + H₂O',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Net Ionic Equations — Strip the Spectators',
          body: 'Spectator ions appear in both reactants and products in unchanged form — they don\'t participate in the reaction. The net ionic equation shows only the species that actually react.\nMolecular: NaCl(aq) + AgNO₃(aq) → AgCl(s) + NaNO₃(aq)\nFull ionic: Na⁺ + Cl⁻ + Ag⁺ + NO₃⁻ → AgCl(s) + Na⁺ + NO₃⁻\nNet ionic: Ag⁺(aq) + Cl⁻(aq) → AgCl(s)',
        },
        {
          type: 'list',
          variant: 'numbered',
          items: [
            'Write the balanced molecular equation.',
            'Write all soluble, strong electrolytes as dissociated ions (aq).',
            'Keep solids (s), liquids (l), and gases (g) in molecular form — do NOT split them.',
            'Cancel ions that appear identically on both sides (spectator ions).',
            'What remains is the net ionic equation.',
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Solubility Rules — Must Memorise for Net Ionic Equations',
          body: 'Always soluble: Group 1 cations (Na⁺, K⁺, Li⁺), NH₄⁺, NO₃⁻, CH₃COO⁻, ClO₄⁻\nUsually soluble: Cl⁻, Br⁻, I⁻ (EXCEPT Ag⁺, Pb²⁺, Hg₂²⁺), SO₄²⁻ (EXCEPT Ba²⁺, Pb²⁺, Ca²⁺, Sr²⁺)\nUsually insoluble: OH⁻ (EXCEPT Group 1 + Ba²⁺, Ca²⁺), CO₃²⁻, PO₄³⁻, SO₃²⁻ (all except Group 1 and NH₄⁺), S²⁻',
        },
      ],
      mcqs: [
        {
          question: 'Which of the following is the net ionic equation for the reaction of aqueous HCl with aqueous NaOH?',
          options: [
            'Na⁺(aq) + Cl⁻(aq) + H⁺(aq) + OH⁻(aq) → NaCl(aq) + H₂O(l)',
            'HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)',
            'H⁺(aq) + OH⁻(aq) → H₂O(l)',
            'Na⁺(aq) + OH⁻(aq) → NaOH(aq)',
          ],
          correct: 2,
          explanation: 'HCl is a strong acid (fully dissociated: H⁺ + Cl⁻). NaOH is a strong base (fully dissociated: Na⁺ + OH⁻). NaCl is a soluble salt (dissociated: Na⁺ + Cl⁻). After cancelling Na⁺ and Cl⁻ spectators: H⁺(aq) + OH⁻(aq) → H₂O(l).',
        },
        {
          question: 'Which compound is insoluble in water based on solubility rules?',
          options: ['KNO₃', 'Na₂SO₄', 'BaSO₄', 'NH₄Cl'],
          correct: 2,
          explanation: 'BaSO₄ is the classic exception: SO₄²⁻ is generally soluble, BUT Ba²⁺, Pb²⁺, Ca²⁺, and Sr²⁺ form insoluble sulfates. BaSO₄ (Ksp = 1.1 × 10⁻¹⁰) is practically insoluble — used in clinical X-ray "barium swallows."',
        },
        {
          question: 'The reaction of zinc metal with aqueous copper(II) sulfate is best classified as:',
          options: ['Synthesis', 'Combustion', 'Single displacement', 'Double displacement'],
          correct: 2,
          explanation: 'Zn(s) + CuSO₄(aq) → ZnSO₄(aq) + Cu(s). A more active metal (Zn) displaces a less active metal (Cu) from its salt solution. This is a single displacement (also called single replacement) reaction, driven by the activity series.',
        },
      ],
      flashcards: [
        { front: 'What are spectator ions?', back: 'Ions present in solution that do not participate in the actual chemical reaction — they appear unchanged on both sides of the ionic equation' },
        { front: 'How to write a net ionic equation', back: '(1) Balance molecular equation. (2) Dissociate all strong electrolytes. (3) Keep solids/gases/liquids intact. (4) Cancel spectator ions.' },
        { front: 'Always soluble ions (always form soluble compounds)', back: 'Na⁺, K⁺, Li⁺, NH₄⁺ (Group 1 cations + ammonium), NO₃⁻ (nitrate), CH₃COO⁻ (acetate), ClO₄⁻ (perchlorate)' },
        { front: 'Which sulfates are insoluble?', back: 'BaSO₄, PbSO₄, CaSO₄ (slightly), SrSO₄ — all others are soluble' },
      ],
    },

    // ── Concept 2: Stoichiometry & Limiting Reagent ──────────────────────────
    {
      id: 'u4-c2-stoich',
      title: 'Stoichiometry & Limiting Reagent',
      subtitle: 'Mole ratios, yield, and the bottleneck reactant',
      estimatedMinutes: 13,
      accentHex: '#fdba74',
      blocks: [
        {
          type: 'text',
          body: 'Stoichiometry uses mole ratios from a balanced equation to calculate amounts of reactants consumed and products formed. The central tool is the mole-to-mole conversion factor taken directly from the balanced equation\'s coefficients.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'The Stoichiometry Roadmap',
          body: 'mass A → (÷ molar mass A) → mol A → (× mole ratio B/A) → mol B → (× molar mass B) → mass B\nFor gases at STP: mol → (× 22.4 L/mol) → volume (STP only)\nFor solutions: mol = M × V(L) in either direction',
        },
        {
          type: 'text',
          body: 'The limiting reagent (limiting reactant) is the reactant that is completely consumed first and therefore limits the maximum amount of product that can form. The excess reagent is present in more than the stoichiometric amount — some remains after the reaction is complete.',
        },
        {
          type: 'list',
          variant: 'numbered',
          items: [
            'Convert each reactant to moles.',
            'Divide each mole amount by its stoichiometric coefficient.',
            'The reactant with the SMALLEST quotient is the limiting reagent.',
            'Use the limiting reagent\'s moles × (product coefficient / limiting reagent coefficient) to find theoretical yield.',
          ],
        },
        {
          type: 'formula',
          latex: '\\%\\,\\text{yield} = \\frac{\\text{actual yield}}{\\text{theoretical yield}} \\times 100\\%',
          display: true,
          caption: 'Theoretical yield = maximum product from limiting reagent; actual yield = measured in lab',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Don\'t Forget Solution Stoichiometry',
          body: 'For reactions in solution: n = M × V (in litres). In titrations, at the equivalence point: moles acid = moles base × appropriate ratio. For HCl + NaOH: M_a × V_a = M_b × V_b. For H₂SO₄ + 2NaOH: M_a × V_a × 2 = M_b × V_b (2 mol NaOH per mol H₂SO₄).',
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'The Sandwich Analogy for Limiting Reagent',
          body: 'Making sandwiches: 1 sandwich = 2 bread slices + 1 filling. If you have 10 slices of bread and 3 fillings, you can make only 3 sandwiches (filling is limiting). 4 bread slices are left over (excess). In chemistry: the reagent that runs out first is the limiting reagent; the other is in excess.',
        },
      ],
      mcqs: [
        {
          question: 'In the reaction N₂ + 3H₂ → 2NH₃, how many moles of NH₃ are produced from 4.5 mol H₂ (with excess N₂)?',
          options: ['1.5 mol', '3.0 mol', '4.5 mol', '9.0 mol'],
          correct: 1,
          explanation: 'Mole ratio: 3 mol H₂ → 2 mol NH₃. Moles NH₃ = 4.5 mol H₂ × (2 mol NH₃ / 3 mol H₂) = 3.0 mol NH₃.',
        },
        {
          question: 'In 2Al + 3Cl₂ → 2AlCl₃, which is the limiting reagent if 54 g Al and 150 g Cl₂ are mixed? (Molar masses: Al = 27, Cl₂ = 71 g/mol)',
          options: ['Al is limiting', 'Cl₂ is limiting', 'Both are consumed equally', 'Neither is limiting'],
          correct: 1,
          explanation: 'Mol Al = 54/27 = 2.0 mol. Mol Cl₂ = 150/71 = 2.11 mol. Compare: Al needs 2.0 × (3/2) = 3.0 mol Cl₂ to react fully — but only 2.11 mol Cl₂ available. OR: Cl₂ needs 2.11 × (2/3) = 1.41 mol Al, but 2.0 mol available. Quotient method: Al: 2.0/2 = 1.0; Cl₂: 2.11/3 = 0.70. Smaller quotient → Cl₂ is limiting.',
        },
        {
          question: 'A reaction has a theoretical yield of 25.0 g and the student obtained 21.3 g. What is the percent yield?',
          options: ['74.4%', '85.2%', '117%', '21.3%'],
          correct: 1,
          explanation: '% yield = (actual / theoretical) × 100 = (21.3 / 25.0) × 100 = 85.2%. Percent yield is always ≤ 100% for real reactions (losses from transfer, incomplete reaction, side products).',
        },
      ],
      flashcards: [
        { front: 'What is the limiting reagent?', back: 'The reactant completely consumed first, limiting the amount of product formed. Identified by dividing moles of each reactant by its stoichiometric coefficient — smallest value is limiting.' },
        { front: 'Formula for percent yield', back: '% yield = (actual yield / theoretical yield) × 100%. Theoretical yield is calculated from the limiting reagent.' },
        { front: 'Solution stoichiometry: moles from concentration', back: 'n = M × V(L). For titrations at equivalence: M₁V₁(n₁) = M₂V₂(n₂) where n₁,n₂ are mole ratios from equation.' },
        { front: 'Stoichiometry conversion chain', back: 'mass → ÷molar mass → moles → ×mole ratio → moles product → ×molar mass → mass product' },
      ],
    },

    // ── Concept 3: Oxidation-Reduction Reactions ─────────────────────────────
    {
      id: 'u4-c3-redox',
      title: 'Oxidation-Reduction Reactions',
      subtitle: 'Electron transfer, oxidation states, and balancing',
      estimatedMinutes: 13,
      accentHex: '#fb923c',
      blocks: [
        {
          type: 'text',
          body: 'Redox reactions involve the transfer of electrons from one species to another. Oxidation is the loss of electrons (OIL — Oxidation Is Loss). Reduction is the gain of electrons (RIG — Reduction Is Gain). These always occur together — one species can only be oxidized if another is simultaneously reduced.',
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'OIL RIG — The Classic Mnemonic',
          body: 'OIL RIG:\nOxidation Is Loss (of electrons)\nReduction Is Gain (of electrons)\nThe reducing agent donates electrons (is itself oxidized).\nThe oxidizing agent accepts electrons (is itself reduced).\nMnemonic: "LEO the lion says GER" — Lose Electrons Oxidation, Gain Electrons Reduction.',
        },
        {
          type: 'list',
          variant: 'numbered',
          items: [
            'Free elements always have oxidation state = 0 (e.g., O₂, Fe, N₂).',
            'Monatomic ions: oxidation state = ionic charge (Na⁺ = +1, O²⁻ = −2).',
            'H: usually +1 (except metal hydrides: H is −1, e.g., NaH).',
            'O: usually −2 (except peroxides: O is −1, e.g., H₂O₂; OF₂: O is +2).',
            'F: always −1 (most electronegative element).',
            'The sum of oxidation states equals the net charge of the species (0 for neutral, charge for ions).',
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Half-Reaction Method for Balancing Redox in Acidic Solution',
          body: '1. Split into oxidation and reduction half-reactions.\n2. Balance atoms other than H and O.\n3. Balance O by adding H₂O.\n4. Balance H by adding H⁺.\n5. Balance charge by adding electrons (e⁻).\n6. Multiply half-reactions to equalise electrons.\n7. Add half-reactions; cancel common species.\nFor basic solution: follow all steps, then add OH⁻ to both sides to neutralise H⁺ (H⁺ + OH⁻ → H₂O).',
        },
        {
          type: 'formula',
          latex: '\\text{Oxidation state of X in } A_mX_nB_p: \\quad m(\\text{OS}_A) + n(\\text{OS}_X) + p(\\text{OS}_B) = \\text{charge}',
          display: true,
          caption: 'Use this algebra to find unknown oxidation states',
        },
        {
          type: 'simulation',
          title: 'Redox Electron Transfer Visualiser',
          description: 'Watch electrons transfer between atoms in real-time animations. Input any redox reaction and see the oxidation state change highlighted, with the oxidizing and reducing agents labelled.',
        },
      ],
      mcqs: [
        {
          question: 'What is the oxidation state of Mn in KMnO₄?',
          options: ['+2', '+4', '+6', '+7'],
          correct: 3,
          explanation: 'K is +1; each O is −2 (4 oxygens = −8). Sum must equal 0 (neutral compound): +1 + OS(Mn) + (−8) = 0 → OS(Mn) = +7. Permanganate (MnO₄⁻) always has Mn in +7 state.',
        },
        {
          question: 'In the reaction 2Fe³⁺ + Sn²⁺ → 2Fe²⁺ + Sn⁴⁺, which species is the reducing agent?',
          options: ['Fe³⁺', 'Fe²⁺', 'Sn²⁺', 'Sn⁴⁺'],
          correct: 2,
          explanation: 'Sn²⁺ → Sn⁴⁺: Sn loses 2 electrons → oxidized. The reducing agent is the species that loses electrons (is oxidized). Fe³⁺ → Fe²⁺: gains electrons → reduced. Fe³⁺ is the oxidizing agent.',
        },
        {
          question: 'What is the oxidation state of chromium in Cr₂O₇²⁻ (dichromate ion)?',
          options: ['+3', '+5', '+6', '+7'],
          correct: 2,
          explanation: '7 oxygens at −2 each = −14. Charge of ion = −2. Let OS(Cr) = x: 2x + (−14) = −2 → 2x = 12 → x = +6. Each Cr in dichromate is +6.',
        },
      ],
      flashcards: [
        { front: 'OIL RIG mnemonic', back: 'Oxidation Is Loss (of electrons); Reduction Is Gain (of electrons). Reducing agent = loses e⁻ = gets oxidized. Oxidizing agent = gains e⁻ = gets reduced.' },
        { front: 'Oxidation state of O in peroxides (e.g., H₂O₂)', back: '−1 (not the usual −2). Check: 2(+1) + 2(OS_O) = 0 → OS_O = −1' },
        { front: 'Oxidation state rules — priority order', back: 'F always −1. O usually −2 (except peroxides −1, OF₂ +2). H usually +1 (except metal hydrides −1). Free elements = 0. Sum = net charge.' },
        { front: 'What is the oxidizing agent?', back: 'The species that accepts electrons (is itself reduced). It causes another species to be oxidized.' },
      ],
    },

    // ── Concept 4: Precipitation & Acid-Base Reactions ───────────────────────
    {
      id: 'u4-c4-precipitation',
      title: 'Precipitation & Acid-Base Reactions',
      subtitle: 'Metathesis and proton transfer',
      estimatedMinutes: 9,
      accentHex: '#fdba74',
      blocks: [
        {
          type: 'text',
          body: 'Precipitation reactions are double displacement reactions where two soluble ionic compounds react in solution to form one insoluble product (precipitate). The net ionic equation shows only the ions forming the precipitate. Acid-base (neutralization) reactions are proton-transfer reactions: in Brønsted-Lowry theory, an acid donates a proton (H⁺) and a base accepts a proton.',
        },
        {
          type: 'table',
          headers: ['Theory', 'Acid definition', 'Base definition', 'Example acid', 'Example base'],
          rows: [
            ['Arrhenius', 'Produces H⁺ in water', 'Produces OH⁻ in water', 'HCl', 'NaOH'],
            ['Brønsted-Lowry', 'Proton (H⁺) donor', 'Proton (H⁺) acceptor', 'NH₄⁺', 'NH₃'],
            ['Lewis', 'Electron pair acceptor', 'Electron pair donor', 'BF₃, Al³⁺', 'NH₃, OH⁻'],
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Conjugate Acid-Base Pairs — Always in Pairs',
          body: 'Every Brønsted-Lowry acid has a conjugate base (the species left after the acid donates H⁺), and every base has a conjugate acid (the species formed after the base accepts H⁺).\nHCl + H₂O → H₃O⁺ + Cl⁻\nAcid₁ + Base₂ → Acid₂ + Base₁\nConjugate pair 1: HCl / Cl⁻ (differ by H⁺)\nConjugate pair 2: H₃O⁺ / H₂O (differ by H⁺)',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Strong vs. Weak Acids — The Key List',
          body: 'Strong acids (memorise — fully ionised in water): HCl, HBr, HI, HNO₃, H₂SO₄, HClO₄, HClO₃.\nAll other acids are weak (partially ionised: Ka << 1) — CH₃COOH, HF, H₂CO₃, H₃PO₄, HCN, H₂S.\nStrong bases: Group 1 hydroxides (LiOH, NaOH, KOH, RbOH, CsOH) + Ba(OH)₂, Sr(OH)₂, Ca(OH)₂.\nWeak bases: NH₃, amines, CO₃²⁻, CH₃COO⁻.',
        },
        {
          type: 'text',
          body: 'A diprotic acid (H₂SO₄, H₂CO₃) has two ionizable protons. Each ionization step has its own Ka (Ka₁ >> Ka₂ always). In neutralization stoichiometry: H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O (2 moles of base per mole of diprotic acid).',
        },
      ],
      mcqs: [
        {
          question: 'Identify the conjugate acid of NH₃.',
          options: ['NH₂⁻', 'NH₄⁺', 'N₂', 'OH⁻'],
          correct: 1,
          explanation: 'A conjugate acid is formed when a base accepts a proton. NH₃ + H⁺ → NH₄⁺. The conjugate acid of NH₃ is NH₄⁺ (differs from NH₃ by one H⁺).',
        },
        {
          question: 'Which of the following is a strong acid?',
          options: ['CH₃COOH (acetic acid)', 'H₂CO₃ (carbonic acid)', 'HF (hydrofluoric acid)', 'HClO₄ (perchloric acid)'],
          correct: 3,
          explanation: 'HClO₄ (perchloric acid) is one of the seven strong acids — it ionizes completely in water. CH₃COOH (Ka = 1.8 × 10⁻⁵), H₂CO₃ (Ka₁ = 4.3 × 10⁻⁷), and HF (Ka = 6.8 × 10⁻⁴) are all weak acids that partially ionize.',
        },
        {
          question: 'In the Lewis theory of acids and bases, which species acts as a Lewis acid in the reaction BF₃ + NH₃ → F₃B–NH₃?',
          options: ['NH₃', 'BF₃', 'F₃B–NH₃', 'H⁺'],
          correct: 1,
          explanation: 'BF₃ has an incomplete octet on boron (only 6 electrons). It accepts a lone pair from NH₃ to form the adduct. Lewis acid = electron pair acceptor → BF₃. Lewis base = electron pair donor → NH₃.',
        },
      ],
      flashcards: [
        { front: 'Brønsted-Lowry acid and base definitions', back: 'Acid: proton (H⁺) donor. Base: proton (H⁺) acceptor. Every acid-base reaction involves conjugate pairs.' },
        { front: 'What are the 7 strong acids?', back: 'HCl, HBr, HI, HNO₃, H₂SO₄ (first ionization), HClO₄, HClO₃. All others are weak acids.' },
        { front: 'Conjugate acid-base pair — how do they differ?', back: 'By exactly one proton (H⁺). Acid → conjugate base (loses H⁺). Base → conjugate acid (gains H⁺).' },
        { front: 'Lewis acid definition', back: 'Electron pair acceptor (has an empty or incomplete orbital). Examples: BF₃, Al³⁺, Fe³⁺, CO₂.' },
      ],
    },

  ],
}
