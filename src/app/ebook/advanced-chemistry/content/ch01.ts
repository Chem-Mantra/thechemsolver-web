import type { AdvChapter } from '../types'

export const CH01: AdvChapter = {
  id: 'ch01',
  number: 1,
  title: 'Analytical Chemistry',
  examRelevance: '~20% of IChO Prep Problems · dominant theme of USNCO Part III',
  accentHex: '#f59e0b',
  concepts: [

    // ── Concept 1: Equivalents, Normality & the Law of Chemical Equivalence ────
    {
      id: 'ch01-c1-equivalents',
      title: 'Equivalents, Normality & the Law of Chemical Equivalence',
      subtitle: 'The stoichiometric shortcut that powers every titration calculation',
      estimatedMinutes: 14,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'Every quantitative analytical technique — acid-base titration, redox titration, gravimetric analysis — ultimately reduces to one question: how much of substance A reacted with how much of substance B? The mole concept answers this, but it requires a fully balanced equation. The equivalent concept answers the same question without ever balancing anything, which is why it is the working currency of the analytical chemistry lab and of USNCO/IChO titration problems.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Moles vs. Equivalents',
          body: 'Moles are absolute — they depend only on the molecule\'s identity. Equivalents are relative — they depend on what the molecule actually does in a specific reaction. The same compound can have different equivalent weights in different reactions.',
        },
        {
          type: 'formula',
          latex: 'E = \\dfrac{M}{n\\text{-factor}}, \\qquad \\text{Number of equivalents} = \\dfrac{\\text{mass (g)}}{E}',
          display: true,
          caption: 'Equivalent weight (E) and number of equivalents, where M is molar mass',
        },
        {
          type: 'text',
          body: 'The n-factor is the number of "reacting units" one formula unit provides. For an acid, it is the number of replaceable H⁺ ions actually donated in that reaction (not necessarily the total acidic hydrogens — H₃PO₃ has three hydrogens but an n-factor of 2, since only two are ionizable; H₃BO₃ behaves as a Lewis acid with n = 1). For a base, it is the number of OH⁻ accepted or replaced. For a redox species, it is the number of electrons gained or lost per formula unit — and this can change with pH, which is exactly why permanganate\'s n-factor depends on medium.',
        },
        {
          type: 'formula',
          latex: 'N = M \\times n\\text{-factor}, \\qquad meq = N \\times V_{mL} = M \\times V_{mL} \\times n',
          display: true,
          caption: 'Normality from molarity, and milliequivalents — the working unit for titration data',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Never default to M₁V₁ = M₂V₂',
          body: 'M₁V₁ = M₂V₂ only holds when both species have n-factor = 1. The generally correct titration relationship is N₁V₁ = N₂V₂, i.e. (M₁n₁)V₁ = (M₂n₂)V₂. USNCO and IChO problems routinely use titrants with n ≠ 1 specifically to test whether you default to the wrong formula.',
        },
        {
          type: 'text',
          body: 'The Law of Chemical Equivalence states that in any completed reaction, all reactants and products are consumed/produced in equal numbers of equivalents: Eq(A) = Eq(B) = Eq(products). This is what lets you skip balancing the equation entirely — you only need to correctly identify each species\' n-factor in that specific reaction.',
        },
      ],
      mcqs: [
        {
          question: 'What is the n-factor of H₃PO₃ (phosphorous acid) when it reacts completely with NaOH?',
          options: ['1', '2', '3', '0'],
          correct: 1,
          explanation: 'H₃PO₃ has one P–H bond that is non-ionizable; only two of its three hydrogens are acidic (attached to oxygen), so its n-factor as an acid is 2, not 3.',
        },
        {
          question: '25.0 mL of a 0.150 M solution of a diprotic acid (n-factor = 2) is exactly neutralized by 37.5 mL of NaOH. What is the normality of the NaOH?',
          options: ['0.100 N', '0.150 N', '0.200 N', '0.300 N'],
          correct: 2,
          explanation: 'N(acid) = M × n = 0.150 × 2 = 0.300 N. At equivalence, N₁V₁ = N₂V₂ → 0.300 × 25.0 = N₂ × 37.5 → N₂ = 0.200 N.',
        },
      ],
      flashcards: [
        { front: 'Equivalent weight formula', back: 'E = Molar Mass ÷ n-factor' },
        { front: 'Why use equivalents instead of moles in titrations?', back: 'The Law of Chemical Equivalence (Eq of A = Eq of B) holds without ever balancing the chemical equation.' },
        { front: 'Correct general titration formula', back: 'N₁V₁ = N₂V₂ — NOT M₁V₁ = M₂V₂ (which only works when both n-factors equal 1).' },
      ],
    },

    // ── Concept 2: Redox Reactions — Oxidation Number & Balancing ──────────────
    {
      id: 'ch01-c2-redox-balancing',
      title: 'Redox Reactions: Oxidation Number & Balancing',
      subtitle: 'The ion-electron method, and the exceptions that trip up every student once',
      estimatedMinutes: 13,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'The modern definition of oxidation is loss of electrons; reduction is gain of electrons. A useful mnemonic: LEO the lion says GER — Loss of Electrons is Oxidation, Gain of Electrons is Reduction. The two halves never occur alone: every electron lost by a reducing agent is immediately accepted by an oxidizing agent, so oxidation number decreases for the oxidizing agent and increases for the reducing agent.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Common Oxidation-State Exceptions',
          body: 'Oxygen is −1 in peroxides (H₂O₂) and −½ in superoxides (KO₂), not the usual −2. Hydrogen is −1 in ionic metal hydrides (NaH). Fe₃O₄ is not "iron in a +8/3 state" — it is a genuine 1:2 mixture of FeO and Fe₂O₃, so treat it as such in any calculation.',
        },
        {
          type: 'text',
          body: 'The ion-electron (half-reaction) method balances redox equations by splitting the overall reaction into an oxidation half and a reduction half, balancing atoms and charge in each separately, then combining them so electrons cancel exactly. In acidic solution, balance oxygen with H₂O and hydrogen with H⁺; in basic solution, balance the same way and then add OH⁻ to both sides to neutralize any leftover H⁺.',
        },
        {
          type: 'list',
          variant: 'numbered',
          items: [
            'Write the two unbalanced half-reactions (oxidation and reduction).',
            'Balance all atoms except O and H in each half.',
            'Balance O using H₂O, then balance H using H⁺ (acidic medium).',
            'Balance charge on each side by adding electrons.',
            'Multiply each half-reaction so electrons lost = electrons gained, then add the halves together.',
            'For a basic-medium reaction, add OH⁻ equal to the H⁺ present on both sides, combining H⁺ + OH⁻ → H₂O.',
          ],
        },
        {
          type: 'formula',
          latex: 'MnO_4^- + 8H^+ + 5e^- \\rightarrow Mn^{2+} + 4H_2O',
          display: true,
          caption: 'Permanganate half-reaction in acidic medium (n = 5)',
        },
      ],
      mcqs: [
        {
          question: 'In the reaction 3Br₂ + 6OH⁻ → 5Br⁻ + BrO₃⁻ + 3H₂O, what type of redox reaction is occurring?',
          options: ['Simple redox between two different elements', 'Disproportionation of bromine', 'Comproportionation', 'Intramolecular redox'],
          correct: 1,
          explanation: 'The same element (Br, oxidation state 0) is simultaneously oxidized (to +5 in BrO₃⁻) and reduced (to −1 in Br⁻) — the defining feature of disproportionation.',
        },
      ],
      flashcards: [
        { front: 'LEO says GER', back: 'Loss of Electrons is Oxidation; Gain of Electrons is Reduction.' },
        { front: 'Oxidation state of O in H₂O₂', back: '−1 (peroxide), not the usual −2.' },
        { front: 'Ion-electron method: balancing O and H in acidic medium', back: 'Balance O with H₂O, then balance H with H⁺.' },
      ],
    },

    // ── Concept 3: Redox Titrations — Permanganometry, Iodometry, Iodimetry ────
    {
      id: 'ch01-c3-redox-titrations',
      title: 'Redox Titrations: Permanganometry, Iodometry & Iodimetry',
      subtitle: 'Self-indicating titrants and the classic KMnO₄–oxalate standardization',
      estimatedMinutes: 15,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'A titration\'s equivalence point is the theoretical moment where moles (or equivalents) of titrant exactly match the analyte; the end point is the practical moment an observable signal — usually a color change — tells you to stop. Good analytical technique is choosing an indicator whose end point falls as close as possible to the true equivalence point.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Self-Indicating vs. External Indicators',
          body: 'KMnO₄ is a self-indicator: it is intensely purple as MnO₄⁻ and becomes nearly colorless as Mn²⁺, so the first permanent pink tinge marks the end point with no added indicator. K₂Cr₂O₇, by contrast, changes color too gradually (orange to green) to serve this role — it needs an external indicator like diphenylamine.',
        },
        {
          type: 'text',
          body: 'Permanganate\'s n-factor depends entirely on the medium: n = 5 in acidic solution (MnO₄⁻ → Mn²⁺), n = 3 in neutral or mildly basic solution (MnO₄⁻ → MnO₂), and n = 1 in strongly basic solution (MnO₄⁻ → MnO₄²⁻). The mnemonic "BAN 153" captures this: Basic = 1, Acidic = 5, Neutral = 3.',
        },
        {
          type: 'formula',
          latex: '2MnO_4^- + 5C_2O_4^{2-} + 16H^+ \\rightarrow 2Mn^{2+} + 10CO_2 + 8H_2O',
          display: true,
          caption: 'Standardizing KMnO₄ against oxalate — a textbook redox titration',
        },
        {
          type: 'text',
          body: 'Iodometric and iodimetric methods use the I⁻/I₂ couple, detected with starch (which turns deep blue-black with I₂). Iodimetry is direct titration with an I₂ solution as the titrant. Iodometry is indirect: an oxidizing analyte first liberates I₂ from excess KI, and that liberated I₂ is then titrated against a standard reducing agent — almost always sodium thiosulfate, Na₂S₂O₃.',
        },
        {
          type: 'table',
          headers: ['Method', 'Titrant', 'Use case'],
          rows: [
            ['Iodimetry', 'I₂ solution (direct)', 'Titrating a reducing analyte directly with iodine'],
            ['Iodometry', 'Na₂S₂O₃ (indirect)', 'Oxidizing analyte + excess KI → I₂ liberated, then titrated'],
          ],
        },
      ],
      mcqs: [
        {
          question: 'Why is K₂Cr₂O₇ not used as a self-indicator, unlike KMnO₄?',
          options: [
            'K₂Cr₂O₇ is not an oxidizing agent',
            'Its orange-to-green color change is too gradual to pinpoint a sharp end point',
            'K₂Cr₂O₇ does not dissolve in water',
            'Dichromate titrations never reach an equivalence point',
          ],
          correct: 1,
          explanation: 'Both are oxidants, but dichromate\'s color transition is too gradual for precise visual end-point detection, so an external indicator (diphenylamine) is required.',
        },
        {
          question: 'In an iodometric determination, what is titrated in the final step?',
          options: [
            'The oxidizing analyte directly with I₂',
            'Excess KI with the analyte',
            'The I₂ liberated by the analyst\'s reaction with excess KI, titrated with Na₂S₂O₃',
            'Starch indicator with NaOH',
          ],
          correct: 2,
          explanation: 'Iodometry is indirect: the oxidizing analyte first liberates I₂ from excess iodide, and that liberated I₂ is what actually gets titrated, using sodium thiosulfate.',
        },
      ],
      flashcards: [
        { front: 'BAN 153', back: 'KMnO₄ n-factor: Basic = 1, Acidic = 5, Neutral = 3.' },
        { front: 'Iodimetry vs. Iodometry', back: 'Iodimetry = direct titration with I₂. Iodometry = indirect; liberated I₂ is titrated with Na₂S₂O₃.' },
        { front: 'Indicator for iodine titrations', back: 'Starch — turns deep blue-black in the presence of I₂.' },
      ],
    },

    // ── Concept 4: Acid-Base Titrations — Curves, Indicators & Double Titrations
    {
      id: 'ch01-c4-acid-base-titrations',
      title: 'Acid-Base Titrations: Curves, Indicators & Mixture Analysis',
      subtitle: 'Reading a titration curve, and untangling a two-component mixture',
      estimatedMinutes: 13,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'A strong acid–strong base titration produces a sharp, near-vertical jump through pH 7 at the equivalence point, so almost any indicator with a transition range inside that jump works. Weak acid–strong base titrations behave very differently: the equivalence point lies above pH 7 (the conjugate base hydrolyzes water), the curve rises gradually through a buffer region, and the half-equivalence point is special — there, pH = pKₐ exactly, because [HA] = [A⁻].',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Back Titration',
          body: 'When an analyte reacts too slowly or incompletely for direct titration (e.g. determining the purity of an impure solid), add a known excess of a reagent that reacts completely, then titrate the unreacted excess with a second standard solution. The amount that reacted with the analyte is the initial excess minus what the back-titration measured.',
        },
        {
          type: 'text',
          body: 'A double titration determines the composition of a mixture — classically, NaOH and Na₂CO₃ together — using two indicators with different transition pH ranges in the same titration. Phenolphthalein (pH 8.2–10) marks the point where all NaOH is neutralized and Na₂CO₃ has converted only to NaHCO₃. Methyl orange (pH 3.1–4.4) marks the second, later end point, where the remaining NaHCO₃ is fully converted to H₂CO₃. Comparing the two volumes lets you back-calculate the original amounts of each component.',
        },
        {
          type: 'table',
          headers: ['Mixture component', 'Phenolphthalein end point', 'Methyl orange end point'],
          rows: [
            ['NaOH', 'Fully neutralized', '(already neutralized)'],
            ['Na₂CO₃ → NaHCO₃ → H₂CO₃', 'Half-converted (to NaHCO₃)', 'Fully converted (to H₂CO₃)'],
          ],
        },
      ],
      mcqs: [
        {
          question: 'For the titration of acetic acid (Ka = 1.8 × 10⁻⁵) with NaOH, at the point where exactly half the acid has been neutralized, what is true?',
          options: ['pH = 7', 'pH = pKa of acetic acid', 'The solution contains only NaOH', 'The equivalence point has been reached'],
          correct: 1,
          explanation: 'At half-neutralization, [CH₃COOH] = [CH₃COO⁻], so by the Henderson–Hasselbalch equation pH = pKa + log(1) = pKa.',
        },
      ],
      flashcards: [
        { front: 'Weak acid + strong base: equivalence point pH', back: 'Above 7 — the conjugate base hydrolyzes water to produce OH⁻.' },
        { front: 'Half-equivalence point significance', back: 'pH = pKa exactly, since [HA] = [A⁻] there.' },
        { front: 'Double titration of NaOH + Na₂CO₃: two indicators', back: 'Phenolphthalein (first end point, NaOH done + Na₂CO₃→NaHCO₃) then methyl orange (second end point, NaHCO₃→H₂CO₃).' },
      ],
    },

    // ── Concept 5: Qualitative Analysis — Systematic Identification of Unknowns
    {
      id: 'ch01-c5-qualitative-analysis',
      title: 'Qualitative Analysis: Systematic Identification of Unknowns',
      subtitle: 'Selective precipitation, group reagents, and confirmatory tests',
      estimatedMinutes: 14,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'USNCO\'s National Part III lab practical and many IChO practical tasks ask students to identify an unknown from its chemical behavior — the classic "wet chemistry" analytical skill. The underlying strategy is always the same: exploit differences in solubility to separate ions into groups, then use a specific confirmatory test to pin down the exact species within each group.',
        },
        {
          type: 'text',
          body: 'Preliminary tests come first and are fast, non-destructive clues: color (transition metal ions are often colored due to d–d electron transitions), odor (H₂S smells of rotten eggs; acetate smells of vinegar), and flame tests, where a volatile chloride is heated in a flame and the emitted light\'s color reveals the metal — lithium burns crimson, sodium a strong golden-yellow, potassium lilac, calcium brick-red, strontium crimson, barium apple-green, and copper blue-green.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Systematic Cation Separation Logic',
          body: 'Cations are separated into groups by adding reagents in a specific order, each precipitating one group while leaving the rest in solution: dilute HCl precipitates Group 1 (Ag⁺, Pb²⁺, Hg₂²⁺); H₂S in acidic solution precipitates Group 2 sulfides (Cu²⁺, Cd²⁺, Bi³⁺, Sn, Sb, As); NH₄OH/NH₄Cl precipitates Group 3 hydroxides (Fe³⁺, Al³⁺, Cr³⁺) — the NH₄Cl suppresses NH₄OH\'s ionization via the common-ion effect, preventing Group 4/5 hydroxides from precipitating prematurely.',
        },
        {
          type: 'table',
          headers: ['Test', 'Positive result', 'Identifies'],
          rows: [
            ['Flame test', 'Crimson flame', 'Li⁺ (or Sr²⁺ — confirm separately)'],
            ['Flame test', 'Golden yellow flame', 'Na⁺'],
            ['Precipitate with excess NH₃', 'Deep blue solution', 'Cu²⁺ (forms [Cu(NH₃)₄]²⁺)'],
            ['Add BaCl₂ to solution', 'White precipitate insoluble in acid', 'SO₄²⁻'],
            ['Add AgNO₃ to solution', 'Precipitate color: white / cream / yellow', 'Cl⁻ / Br⁻ / I⁻'],
          ],
        },
        {
          type: 'text',
          body: 'Anion identification generally starts by testing reaction with dilute acid: carbonate, sulfite, and sulfide evolve gas immediately (CO₂, SO₂, H₂S respectively) and can be distinguished by odor and by the gas\'s effect on limewater or acidified dichromate paper. Halides are confirmed with silver nitrate — the precipitate colors (white for Cl⁻, cream for Br⁻, yellow for I⁻) and their differing solubility in ammonia let you distinguish all three without any other reagent.',
        },
      ],
      mcqs: [
        {
          question: 'Why is NH₄Cl added along with NH₄OH when precipitating Group 3 hydroxides (Fe³⁺, Al³⁺, Cr³⁺)?',
          options: [
            'To dissolve the Group 3 precipitates faster',
            'To suppress NH₄OH ionization via the common-ion effect, keeping OH⁻ low enough that Group 4/5 hydroxides do not precipitate',
            'To provide a color change indicator',
            'NH₄Cl has no functional purpose; it is only a buffer for pH measurement',
          ],
          correct: 1,
          explanation: 'NH₄⁺ from NH₄Cl shifts the NH₄OH ⇌ NH₄⁺ + OH⁻ equilibrium left (common-ion effect), lowering [OH⁻] enough to precipitate only the more insoluble Group 3 hydroxides while leaving Group 4/5 metal ions in solution.',
        },
      ],
      flashcards: [
        { front: 'Why do flame tests work?', back: 'Heat promotes electrons to higher energy levels; as they fall back, each element emits light at characteristic wavelengths (colors).' },
        { front: 'Role of NH₄Cl in qualitative cation analysis', back: 'Suppresses NH₄OH ionization (common-ion effect) so only Group 3 hydroxides precipitate, not Group 4/5.' },
        { front: 'AgNO₃ precipitate colors for halides', back: 'Cl⁻ = white, Br⁻ = cream/pale yellow, I⁻ = yellow.' },
      ],
    },

    // ── Concept 6: Gravimetric Analysis & the Gravimetric Factor ───────────────
    {
      id: 'ch01-c6-gravimetric',
      title: 'Gravimetric Analysis & the Gravimetric Factor',
      subtitle: 'Determining composition by precipitating, filtering, and weighing',
      estimatedMinutes: 13,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'Gravimetric analysis determines the quantity of an analyte by converting it into a pure, insoluble compound of known composition, then isolating and weighing that compound. It is the oldest quantitative analytical method and remains the reference standard against which faster instrumental methods are validated, because its accuracy depends only on the balance and the stoichiometry — not on any calibration curve.',
        },
        {
          type: 'list',
          variant: 'numbered',
          items: [
            'Precipitate the analyte as an insoluble compound, using conditions (slow addition, digestion/heating) that favor large, filterable crystals over a fine colloidal precipitate.',
            'Filter the precipitate and wash it to remove co-precipitated impurities.',
            'Dry or ignite the precipitate to a compound of exactly known, reproducible composition.',
            'Weigh the dried/ignited precipitate.',
            'Convert the mass of precipitate to mass of the original analyte using the gravimetric factor.',
          ],
        },
        {
          type: 'formula',
          latex: '\\text{Gravimetric factor} = \\dfrac{(\\text{moles analyte per mole precipitate}) \\times M_{\\text{analyte}}}{M_{\\text{precipitate}}}',
          display: true,
          caption: 'Converts mass of precipitate directly to mass of the species being determined',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Worked Example: Chloride as AgCl',
          body: 'A 0.500 g sample containing chloride is precipitated completely as AgCl (M = 143.32 g/mol) and 0.322 g of dry AgCl is recovered. Since 1 mol AgCl contains 1 mol Cl (M = 35.45 g/mol), the gravimetric factor is 35.45/143.32 = 0.2474. Mass of Cl⁻ = 0.322 g × 0.2474 = 0.0797 g, so %Cl⁻ = (0.0797/0.500) × 100 = 15.9%.',
        },
        {
          type: 'text',
          body: 'The choice of precipitating reagent matters: it should react essentially completely with the analyte (very low Ksp for the precipitate), be reasonably selective for the analyte over other ions present, and yield a precipitate that filters cleanly rather than passing through the filter paper as a colloid. Common gravimetric determinations include sulfate as BaSO₄, chloride as AgCl, and iron as Fe₂O₃ after igniting a hydroxide precipitate.',
        },
      ],
      mcqs: [
        {
          question: 'A sample is analyzed for sulfate by precipitating it as BaSO₄ (M = 233.4 g/mol; sulfate M = 96.1 g/mol). What is the gravimetric factor to convert mass of BaSO₄ to mass of SO₄²⁻?',
          options: ['233.4/96.1 = 2.429', '96.1/233.4 = 0.412', '1.000 (they are equal)', 'Cannot be determined without the sample mass'],
          correct: 1,
          explanation: 'The gravimetric factor converts mass of precipitate to mass of analyte: since 1 mol BaSO₄ contains 1 mol SO₄²⁻, factor = M(SO₄²⁻)/M(BaSO₄) = 96.1/233.4 ≈ 0.412.',
        },
      ],
      flashcards: [
        { front: 'What makes a good gravimetric precipitate?', back: 'Very low solubility (low Ksp), high selectivity for the analyte, and a form that filters cleanly (large crystals, not colloidal).' },
        { front: 'Gravimetric factor', back: '(mol analyte per mol precipitate × M analyte) ÷ M precipitate — converts precipitate mass directly to analyte mass.' },
      ],
    },

    // ── Concept 7: Spectrophotometric Analysis — The Beer-Lambert Law ──────────
    {
      id: 'ch01-c7-spectrophotometry',
      title: 'Spectrophotometric Analysis: The Beer-Lambert Law',
      subtitle: 'Quantifying concentration from how much light a solution absorbs',
      estimatedMinutes: 12,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'Many species absorb light at characteristic wavelengths, and the amount of light absorbed increases predictably with concentration — this is the basis of UV-Vis spectrophotometric analysis, one of the fastest and most widely used quantitative techniques in analytical and biochemical labs. Instead of weighing a precipitate, you measure how much of a chosen wavelength of light a solution absorbs and read the concentration off a calibration curve.',
        },
        {
          type: 'formula',
          latex: 'A = \\varepsilon b c, \\qquad A = \\log_{10}\\left(\\dfrac{I_0}{I}\\right)',
          display: true,
          caption: 'Beer-Lambert law: absorbance A, molar absorptivity ε (L·mol⁻¹·cm⁻¹), path length b (cm), concentration c (mol/L)',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Why Absorbance, Not Transmittance?',
          body: 'Absorbance is directly proportional to concentration, which makes calibration curves linear and easy to use. Percent transmittance (%T = I/I₀ × 100) is what the instrument physically measures, but it is logarithmically — not linearly — related to concentration, which is exactly why spectrophotometers report both A and %T but chemists calculate with A.',
        },
        {
          type: 'text',
          body: 'In practice, a calibration curve is built by measuring the absorbance of several standard solutions of known concentration at a fixed wavelength (usually the wavelength of maximum absorbance, λmax, chosen for maximum sensitivity), plotting A vs. c, and confirming it is linear with a slope of εb. An unknown\'s concentration is then read directly from its measured absorbance using that line.',
        },
        {
          type: 'text',
          body: 'Beer\'s law breaks down at high concentrations (deviations from linearity), and it assumes monochromatic light, a non-absorbing solvent, and no chemical interactions (e.g. aggregation) between absorbing molecules that would change ε. IChO problems frequently combine Beer\'s law with an equilibrium calculation — for example, using absorbance to determine the concentration of a colored complex ion at equilibrium, then back-calculating an equilibrium constant.',
        },
      ],
      mcqs: [
        {
          question: 'A solution with molar absorptivity ε = 5000 L·mol⁻¹·cm⁻¹ is measured in a 1.00 cm cell and gives an absorbance of 0.750. What is its concentration?',
          options: ['1.5 × 10⁻⁴ M', '1.5 × 10⁻⁵ M', '6.67 × 10⁻³ M', '3.75 × 10³ M'],
          correct: 0,
          explanation: 'A = εbc → c = A/(εb) = 0.750/(5000 × 1.00) = 1.5 × 10⁻⁴ M.',
        },
      ],
      flashcards: [
        { front: 'Beer-Lambert law', back: 'A = εbc — absorbance is directly proportional to concentration.' },
        { front: 'Why use absorbance instead of %transmittance for calibration?', back: 'Absorbance is linear with concentration; %transmittance is logarithmically related, so it is not directly usable for a linear calibration curve.' },
      ],
    },

    // ── Concept 8: Electroanalytical Methods — Conductometric & Potentiometric
    {
      id: 'ch01-c8-electroanalytical',
      title: 'Electroanalytical Methods: Conductometric & Potentiometric Titration',
      subtitle: 'Finding the end point by measuring conductivity or voltage instead of color',
      estimatedMinutes: 12,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'Not every titration has a convenient color-changing indicator — colored or turbid solutions, and reactions with no sharp visual signal, need an instrumental end-point detection method instead. Two of the most important are conductometric titration (tracking solution conductivity) and potentiometric titration (tracking electrode potential, essentially pH for acid-base reactions).',
        },
        {
          type: 'text',
          body: 'In a conductometric titration, conductivity depends on the concentration and mobility of all ions present, and different ions conduct very differently — H⁺ and OH⁻ have unusually high mobility compared to other ions. As titrant is added, ions are consumed and replaced by others of different mobility, producing a conductivity-vs-volume plot made of straight-line segments whose slope changes abruptly at the equivalence point — that break point, found by extrapolating the two lines to their intersection, is far more precise than trying to spot a subtle color change.',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Why the Conductivity Curve Bends at the Equivalence Point',
          body: 'Titrating HCl with NaOH: initially, highly mobile H⁺ is being replaced by less mobile Na⁺ as neutralization proceeds, so conductivity falls. Past the equivalence point, excess OH⁻ (also highly mobile) starts accumulating, so conductivity rises again. The sharp minimum is the equivalence point.',
        },
        {
          type: 'text',
          body: 'A potentiometric titration measures the potential (voltage) of an indicator electrode against a reference electrode as titrant is added — for acid-base titrations this is simply a pH electrode, giving the same S-shaped curve as a manual pH titration but with instrumental precision. The equivalence point is located at the inflection point (steepest slope) of the curve, which can be found precisely using a first- or second-derivative plot of potential vs. volume — the first-derivative plot peaks sharply exactly at the equivalence point.',
        },
      ],
      mcqs: [
        {
          question: 'In a conductometric titration of a weak acid with a strong base, why does conductivity typically stay relatively flat (or rise only slightly) before the equivalence point, unlike the sharp drop seen for a strong acid–strong base titration?',
          options: [
            'Weak acids do not conduct electricity at all',
            'The weak acid is only slightly ionized, so replacing H⁺ with Na⁺ has little effect, while the sodium salt formed increases ionic strength',
            'The indicator changes color and blocks the conductivity probe',
            'Conductometric titration cannot be used for weak acids',
          ],
          correct: 1,
          explanation: 'Because a weak acid contributes few free H⁺ ions to begin with, the dominant effect as titrant is added is the growing concentration of the fully ionized sodium salt, so conductivity tends to rise gradually rather than fall sharply.',
        },
      ],
      flashcards: [
        { front: 'What is measured in a conductometric titration?', back: 'Solution conductivity vs. volume of titrant — the equivalence point is the sharp break/intersection of two linear segments.' },
        { front: 'Why do H⁺ and OH⁻ dominate conductivity changes?', back: 'They have unusually high ionic mobility compared to almost all other ions.' },
        { front: 'How is the equivalence point found in a potentiometric titration?', back: 'At the inflection point (steepest slope) of the potential-vs-volume curve — precisely located using a first-derivative plot.' },
      ],
    },

    // ── Concept 9: Error Analysis — Precision, Accuracy & Propagation ──────────
    {
      id: 'ch01-c9-error-analysis',
      title: 'Error Analysis: Precision, Accuracy & Propagation of Uncertainty',
      subtitle: 'Every measurement has a limit — knowing that limit is part of the answer',
      estimatedMinutes: 11,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'USNCO\'s Part III lab practical and IChO\'s practical exam both grade experimental design and data analysis, not just the final number. Precision describes how close repeated measurements are to each other (reproducibility); accuracy describes how close a measurement is to the true value. A measurement can be highly precise but inaccurate (a consistent systematic error) or accurate on average but imprecise (large random scatter).',
        },
        {
          type: 'table',
          headers: ['Error type', 'Behavior', 'Example'],
          rows: [
            ['Systematic (determinate)', 'Consistent direction, affects accuracy', 'Uncalibrated balance reading consistently 0.05 g high'],
            ['Random (indeterminate)', 'Unpredictable direction, affects precision', 'Slight variation in reading a buret meniscus each time'],
          ],
        },
        {
          type: 'text',
          body: 'When a calculated result depends on several measured quantities, uncertainties propagate. For addition or subtraction, absolute uncertainties add (in quadrature, for random errors): the uncertainty in a sum is the square root of the sum of the squares of the individual absolute uncertainties. For multiplication or division, it is the relative (percent) uncertainties that combine this way.',
        },
        {
          type: 'formula',
          latex: '\\text{Sum/difference: } \\sigma_{result} = \\sqrt{\\sigma_1^2 + \\sigma_2^2}\\quad\\quad \\text{Product/quotient: } \\dfrac{\\sigma_{result}}{result} = \\sqrt{\\left(\\dfrac{\\sigma_1}{x_1}\\right)^2 + \\left(\\dfrac{\\sigma_2}{x_2}\\right)^2}',
          display: true,
          caption: 'Propagation of random uncertainty through arithmetic operations',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Significant Figures Are a Shortcut, Not the Real Rule',
          body: 'Sig-fig rules approximate proper error propagation for quick classroom use, but a rigorous lab report propagates actual uncertainties through the calculation rather than just counting digits — this is exactly what a USNCO Part III or IChO practical write-up is graded on.',
        },
      ],
      mcqs: [
        {
          question: 'A student repeats a titration three times and gets 24.98, 24.99, and 25.01 mL — but the true value (from the actual analyte) is 26.50 mL. This data is best described as:',
          options: ['Precise and accurate', 'Precise but not accurate', 'Accurate but not precise', 'Neither precise nor accurate'],
          correct: 1,
          explanation: 'The three trials agree closely with each other (high precision — small random scatter), but they are all consistently far from the true value (poor accuracy — a systematic error is present).',
        },
      ],
      flashcards: [
        { front: 'Precision vs. accuracy', back: 'Precision = reproducibility of repeated measurements. Accuracy = closeness to the true value.' },
        { front: 'Systematic vs. random error', back: 'Systematic: consistent direction, affects accuracy. Random: unpredictable direction, affects precision.' },
        { front: 'Uncertainty propagation for multiplication/division', back: 'Relative (percent) uncertainties combine in quadrature: (σ/x)_result = √[(σ₁/x₁)² + (σ₂/x₂)²].' },
      ],
    },

  ],
}
