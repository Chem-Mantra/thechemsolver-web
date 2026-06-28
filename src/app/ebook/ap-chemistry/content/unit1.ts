import type { EbookUnit } from '../types'

export const UNIT1: EbookUnit = {
  id: 'unit-1',
  number: 1,
  title: 'Atomic Structure & Properties',
  examWeight: '7–9%',
  accentHex: '#60a5fa',
  concepts: [

    // ── Concept 1: Moles & Molar Mass ────────────────────────────────────────
    {
      id: 'u1-c1-moles',
      title: 'Moles & Molar Mass',
      subtitle: 'The chemist\'s counting unit',
      estimatedMinutes: 10,
      accentHex: '#60a5fa',
      blocks: [
        {
          type: 'callout',
          variant: 'analogy',
          title: 'Think of a Mole Like a Dozen',
          body: 'A dozen always means 12, whether it\'s eggs or atoms. A mole always means 6.022 × 10²³, whether it\'s water molecules or carbon atoms. The mole is chemistry\'s standard counting unit for the atomic world.',
        },
        {
          type: 'text',
          body: 'A mole (mol) is defined as exactly 6.02214076 × 10²³ elementary entities — a number called Avogadro\'s constant (Nₐ). This definition was formally adopted in 2019, anchoring the mole to a fixed physical constant rather than to the mass of carbon-12. One mole of any substance contains the same number of particles, making it the bridge between atomic masses (in u) and laboratory masses (in grams).',
        },
        {
          type: 'formula',
          latex: 'n = \\frac{m}{M}',
          display: true,
          caption: 'n = moles, m = mass in grams, M = molar mass in g/mol',
        },
        {
          type: 'formula',
          latex: 'N = n \\times N_A = n \\times 6.022 \\times 10^{23}',
          display: true,
          caption: 'N = number of particles',
        },
        {
          type: 'text',
          body: 'Molar mass is the mass of exactly one mole of a substance, expressed in g/mol. For elements, molar mass numerically equals the atomic mass on the periodic table. For compounds, add the molar masses of every atom in one formula unit.',
        },
        {
          type: 'list',
          variant: 'numbered',
          items: [
            'Identify every element and how many atoms of it appear in one formula unit.',
            'Multiply each element\'s atomic mass (from the periodic table) by its atom count.',
            'Sum all results. This is the molar mass in g/mol.',
            'Example — H₂SO₄: 2(1.008) + 32.06 + 4(16.00) = 98.08 g/mol',
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'AP Exam Tip: Percent Composition',
          body: '% element = (atoms × atomic mass / molar mass) × 100. This is consistently tested in MCQ. For H₂O: %H = 2(1.008)/18.015 × 100 = 11.19%, %O = 16.00/18.015 × 100 = 88.81%.',
        },
        {
          type: 'formula',
          latex: '\\%\\, \\text{element} = \\frac{n \\times A_r}{M_r} \\times 100\\%',
          display: true,
          caption: 'n = atoms of that element per formula unit, Aᵣ = atomic mass, Mᵣ = molar mass',
        },
      ],
      mcqs: [
        {
          question: 'How many atoms are in 2.00 mol of iron (Fe)?',
          options: [
            '2.00 atoms',
            '6.02 × 10²³ atoms',
            '1.20 × 10²⁴ atoms',
            '3.34 × 10⁻²⁴ atoms',
          ],
          correct: 2,
          explanation: 'N = n × Nₐ = 2.00 mol × 6.022 × 10²³ mol⁻¹ = 1.20 × 10²⁴ atoms. Each mole contains one Avogadro\'s number of atoms, so two moles contains twice that.',
        },
        {
          question: 'What is the molar mass of calcium chloride, CaCl₂?',
          options: [
            '75.53 g/mol',
            '95.09 g/mol',
            '111.08 g/mol',
            '127.09 g/mol',
          ],
          correct: 2,
          explanation: 'CaCl₂: Ca = 40.08, Cl = 35.45 × 2 = 70.90. Total = 40.08 + 70.90 = 111.08 g/mol.',
        },
        {
          question: 'What mass of aluminum contains 1.50 × 10²³ atoms? (Molar mass Al = 26.98 g/mol)',
          options: [
            '3.37 g',
            '6.74 g',
            '13.5 g',
            '26.98 g',
          ],
          correct: 1,
          explanation: 'Moles = 1.50 × 10²³ / 6.022 × 10²³ = 0.249 mol. Mass = 0.249 mol × 26.98 g/mol = 6.72 g ≈ 6.74 g.',
        },
      ],
      flashcards: [
        { front: 'What is Avogadro\'s number?', back: '6.022 × 10²³ mol⁻¹ — the number of entities in one mole of any substance' },
        { front: 'Formula for moles from mass', back: 'n = m / M, where m is mass in grams and M is molar mass in g/mol' },
        { front: 'How to find molar mass of a compound', back: 'Sum the atomic masses of every atom in one formula unit (use the periodic table)' },
        { front: 'What is percent composition?', back: '% element = (n × atomic mass / molar mass) × 100%' },
        { front: 'What is an empirical formula?', back: 'The simplest whole-number ratio of atoms in a compound (e.g., CH₂O for glucose)' },
      ],
    },

    // ── Concept 2: Mass Spectrometry ─────────────────────────────────────────
    {
      id: 'u1-c2-mass-spec',
      title: 'Mass Spectrometry of Elements',
      subtitle: 'Weighing atoms one at a time',
      estimatedMinutes: 8,
      accentHex: '#818cf8',
      blocks: [
        {
          type: 'text',
          body: 'Isotopes are atoms of the same element that have the same number of protons (same atomic number, Z) but different numbers of neutrons (different mass numbers, A). Isotopes of an element are chemically nearly identical but differ slightly in mass. For example, carbon exists as ¹²C (98.89%) and ¹³C (1.11%), with trace amounts of ¹⁴C.',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'How a Mass Spectrometer Works',
          body: 'Atoms are ionized (electrons stripped off), then accelerated through an electric field and deflected by a magnetic field. Lighter ions deflect more than heavier ones. A detector records the mass-to-charge ratio (m/z) and the relative abundance of each ion. The result is a mass spectrum: a bar chart of abundance vs. m/z.',
        },
        {
          type: 'simulation',
          title: 'Mass Spectrometer Simulator',
          description: 'Input an element and see its isotope peaks, adjust magnetic field strength, and calculate average atomic mass from the spectrum.',
        },
        {
          type: 'formula',
          latex: '\\bar{A} = \\sum_i (\\text{mass}_i \\times f_i)',
          display: true,
          caption: 'Average atomic mass = sum of (isotopic mass × fractional abundance) for all isotopes',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Fractional Abundances Must Sum to 1',
          body: 'If chlorine has two isotopes with fractional abundances x and (1 − x), you only need one equation. This algebraic constraint is the key to solving two-isotope problems on the AP exam.',
        },
        {
          type: 'text',
          body: 'The average atomic mass shown on the periodic table is the weighted average of all naturally occurring isotopes. It is almost never a whole number, because it reflects the natural isotopic mixture found on Earth.',
        },
      ],
      mcqs: [
        {
          question: 'Chlorine has two isotopes: ³⁵Cl (75.77%, mass 34.969 u) and ³⁷Cl (24.23%, mass 36.966 u). What is the average atomic mass?',
          options: [
            '34.97 u',
            '35.45 u',
            '35.97 u',
            '36.47 u',
          ],
          correct: 1,
          explanation: 'Avg = 34.969(0.7577) + 36.966(0.2423) = 26.496 + 8.957 = 35.45 u. This matches the periodic table value for Cl.',
        },
        {
          question: 'A mass spectrum shows peaks at m/z = 10 (20% abundance) and m/z = 11 (80% abundance). What is the average atomic mass of this element?',
          options: [
            '10.0 u',
            '10.2 u',
            '10.8 u',
            '11.0 u',
          ],
          correct: 2,
          explanation: 'Avg = 10(0.20) + 11(0.80) = 2.0 + 8.8 = 10.8 u. The value is pulled toward the heavier, more abundant isotope.',
        },
        {
          question: 'An element has two isotopes. The lighter isotope has mass 78.92 u and the heavier has mass 80.92 u. If the average atomic mass is 79.90 u, what is the fractional abundance of the lighter isotope?',
          options: [
            '0.49',
            '0.51',
            '0.49',
            '0.51',
          ],
          correct: 1,
          explanation: '79.90 = 78.92x + 80.92(1−x). 79.90 = 78.92x + 80.92 − 80.92x. −1.02 = −2.00x. x = 0.51. So the lighter isotope is 51% abundant.',
        },
      ],
      flashcards: [
        { front: 'What are isotopes?', back: 'Atoms of the same element with the same number of protons but different numbers of neutrons (different mass numbers)' },
        { front: 'What does a mass spectrometer measure?', back: 'The mass-to-charge ratio (m/z) and relative abundance of ions; used to find isotope masses and abundances' },
        { front: 'Formula for average atomic mass', back: 'Avg mass = Σ(isotopic mass × fractional abundance) for all isotopes' },
        { front: 'What does peak HEIGHT represent in a mass spectrum?', back: 'The relative abundance of that particular isotope in the sample' },
        { front: 'Why is average atomic mass rarely a whole number?', back: 'It is a weighted average of all naturally occurring isotopes, which exist in non-integer abundance ratios' },
      ],
    },

    // ── Concept 3: Empirical & Molecular Formulas ────────────────────────────
    {
      id: 'u1-c3-formulas',
      title: 'Elemental Composition of Pure Substances',
      subtitle: 'From percentages to formulas',
      estimatedMinutes: 12,
      accentHex: '#a78bfa',
      blocks: [
        {
          type: 'text',
          body: 'The elemental composition of a pure substance tells us what fraction (by mass) of the substance is made up of each element. Percent composition by mass is determined experimentally — historically through combustion analysis, today through modern spectroscopic methods.',
        },
        {
          type: 'formula',
          latex: '\\%\\,\\text{element} = \\frac{\\text{mass of element in 1 mol}}{\\text{molar mass of compound}} \\times 100\\%',
          display: true,
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'The 100 g Trick',
          body: 'When given percent composition, assume a 100 g sample. Then each percentage directly gives you grams of that element, making the grams→moles conversion trivial. This is the standard AP Chemistry shortcut.',
        },
        {
          type: 'list',
          variant: 'numbered',
          items: [
            'Assume 100 g of compound — convert each % to grams directly.',
            'Divide each element\'s mass by its atomic mass to get moles of each element.',
            'Divide all mole values by the smallest mole value.',
            'If ratios are not whole numbers, multiply all by a small integer (2, 3, or 4) until they are.',
            'Write the empirical formula using these whole-number ratios as subscripts.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Don\'t Round Too Early',
          body: 'Ratios like 1.50, 1.33, 1.25 are NOT rounding errors — they signal multiplication by 2, 3, or 4. A ratio of 1.50 means multiply all subscripts by 2 to get 3. A ratio of 1.33 means multiply by 3 to get 4.',
        },
        {
          type: 'text',
          body: 'The molecular formula is a whole-number multiple of the empirical formula. To find the multiplier, divide the experimentally determined molar mass (from mass spectrometry) by the empirical formula mass. The molecular formula contains that many copies of the empirical formula\'s atoms.',
        },
        {
          type: 'formula',
          latex: 'n = \\frac{M_{\\text{molecular}}}{M_{\\text{empirical}}} \\implies \\text{molecular formula} = (\\text{empirical formula})_n',
          display: true,
        },
      ],
      mcqs: [
        {
          question: 'A compound is 40.0% C, 6.7% H, and 53.3% O by mass. What is its empirical formula?',
          options: [
            'C₂H₄O₂',
            'CH₂O',
            'C₃H₆O₃',
            'CHO',
          ],
          correct: 1,
          explanation: 'In 100 g: C = 40.0/12.01 = 3.33 mol, H = 6.7/1.008 = 6.65 mol, O = 53.3/16.00 = 3.33 mol. Divide by smallest (3.33): C:H:O = 1:2:1. Empirical formula = CH₂O.',
        },
        {
          question: 'A compound has the empirical formula CH₂ and a molar mass of 56 g/mol. What is its molecular formula?',
          options: [
            'CH₂',
            'C₂H₄',
            'C₃H₆',
            'C₄H₈',
          ],
          correct: 3,
          explanation: 'Empirical formula mass of CH₂ = 12.01 + 2(1.008) = 14.03 g/mol. n = 56/14.03 ≈ 4. Molecular formula = C₄H₈ (butene).',
        },
        {
          question: 'What is the percent composition of oxygen in water (H₂O)?',
          options: [
            '11.2%',
            '33.3%',
            '66.7%',
            '88.8%',
          ],
          correct: 3,
          explanation: 'Molar mass of H₂O = 18.015 g/mol. %O = 16.00/18.015 × 100 = 88.81%. Oxygen dominates by mass even though there are fewer oxygen atoms.',
        },
      ],
      flashcards: [
        { front: 'What is an empirical formula?', back: 'The simplest whole-number ratio of atoms in a compound (may or may not equal the molecular formula)' },
        { front: 'Steps to find empirical formula from % composition', back: '(1) Assume 100 g → convert % to grams. (2) Divide grams by atomic mass → moles. (3) Divide all by smallest. (4) Multiply to get whole numbers.' },
        { front: 'How to find molecular formula from empirical formula', back: 'n = molar mass / empirical formula mass. Multiply all subscripts in empirical formula by n.' },
        { front: 'What does a ratio of 1.50 mean in empirical formula steps?', back: 'Multiply all ratios by 2 (gives 3:1 or similar whole numbers). 1.33 → multiply by 3. 1.25 → multiply by 4.' },
      ],
    },

    // ── Concept 4: Composition of Mixtures ──────────────────────────────────
    {
      id: 'u1-c4-mixtures',
      title: 'Composition of Mixtures',
      subtitle: 'Quantifying what\'s in a blend',
      estimatedMinutes: 7,
      accentHex: '#38bdf8',
      blocks: [
        {
          type: 'text',
          body: 'A pure substance has a fixed, definite composition: every sample of pure table salt is 39.34% Na and 60.66% Cl by mass. A mixture, by contrast, can have any composition — you can dissolve any amount of salt in water. Mixtures can be homogeneous (uniform throughout, like saltwater) or heterogeneous (non-uniform, like sand and iron filings).',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Analytical Chemistry: Determining Mixture Composition',
          body: 'Chemists determine how much of each component is in a mixture through gravimetric analysis (weighing precipitates), titration, or spectroscopy. AP questions often present a sample and ask you to find purity (%) from the mass of a reaction product.',
        },
        {
          type: 'formula',
          latex: 'm_{\\text{component}} = \\text{mass fraction} \\times m_{\\text{total}}',
          display: true,
          caption: 'mass fraction = (mass of component / total mass), range 0 to 1',
        },
        {
          type: 'text',
          body: 'A common AP exam scenario: an impure solid reacts completely, and the mass of a product (e.g., CO₂ or precipitate) is measured. Use stoichiometry to work backward: from product moles → reactant moles → mass of pure substance → percent purity.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Percent Purity from a Reaction',
          body: '% purity = (mass of pure substance calculated from product / mass of impure sample) × 100%. Only the pure substance reacts; the impurity is inert.',
        },
      ],
      mcqs: [
        {
          question: 'A 25.0 g mixture contains 40.0% NaCl by mass. What mass of NaCl is present?',
          options: [
            '4.00 g',
            '8.00 g',
            '10.0 g',
            '15.0 g',
          ],
          correct: 2,
          explanation: 'm = mass fraction × total = 0.400 × 25.0 g = 10.0 g NaCl.',
        },
        {
          question: 'A 50.0 g sample of impure CaCO₃ is heated and releases 8.80 g of CO₂ (molar mass 44.01 g/mol). What is the percent purity of CaCO₃ (molar mass 100.09 g/mol)?',
          options: [
            '17.6%',
            '20.0%',
            '40.0%',
            '80.0%',
          ],
          correct: 2,
          explanation: 'Moles CO₂ = 8.80/44.01 = 0.200 mol. CaCO₃ → CO₂ (1:1), so moles CaCO₃ = 0.200 mol. Mass CaCO₃ = 0.200 × 100.09 = 20.0 g. % purity = 20.0/50.0 × 100 = 40.0%.',
        },
        {
          question: 'Which best describes a homogeneous mixture?',
          options: [
            'Sand and iron filings',
            'Oil and water',
            'Air (N₂, O₂, Ar, …)',
            'Granite rock',
          ],
          correct: 2,
          explanation: 'Air is a homogeneous mixture — its composition is uniform throughout at the macroscopic scale. Sand and iron filings, oil and water, and granite are heterogeneous mixtures with visible or detectable non-uniform regions.',
        },
      ],
      flashcards: [
        { front: 'What is a homogeneous mixture?', back: 'A mixture with uniform composition throughout at the macroscopic level (e.g., saltwater, air, alloys)' },
        { front: 'What is a heterogeneous mixture?', back: 'A mixture with non-uniform composition; visually or physically distinct regions (e.g., sand + water, oil + vinegar)' },
        { front: 'Formula for mass of a component in a mixture', back: 'm_component = mass fraction × m_total (mass fraction = decimal form of %)' },
        { front: 'How to find % purity from a reaction', back: 'Use product mass → stoichiometry → mass of pure reactant → (pure mass / sample mass) × 100%' },
      ],
    },

    // ── Concept 5: Atomic Structure & Electron Configuration ─────────────────
    {
      id: 'u1-c5-electron-config',
      title: 'Atomic Structure & Electron Configuration',
      subtitle: 'Quantum numbers and orbital filling',
      estimatedMinutes: 15,
      accentHex: '#c084fc',
      blocks: [
        {
          type: 'text',
          body: 'The modern quantum mechanical model describes electrons not as particles orbiting in fixed paths, but as standing waves occupying regions of space called orbitals. An orbital is a mathematical probability distribution — a region where there is a 90% probability of finding the electron. Each orbital is described by a unique set of three quantum numbers.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'The Four Quantum Numbers',
          body: 'n (principal): energy level, n = 1, 2, 3 … Higher n = higher energy + larger orbital.\nl (azimuthal): orbital shape, l = 0 (s), 1 (p), 2 (d), 3 (f). Range: 0 to n−1.\nmₗ (magnetic): orbital orientation. Range: −l to +l. Gives number of orbitals in each subshell.\nmₛ (spin): +½ or −½. Only two values — one for each electron per orbital.',
        },
        {
          type: 'table',
          headers: ['l value', 'Subshell', 'Shape', 'Number of orbitals', 'Max electrons'],
          rows: [
            ['0', 's', 'Sphere', '1', '2'],
            ['1', 'p', 'Dumbbell (3 orientations)', '3', '6'],
            ['2', 'd', 'Four-lobed (5 orientations)', '5', '10'],
            ['3', 'f', 'Complex (7 orientations)', '7', '14'],
          ],
        },
        {
          type: 'list',
          variant: 'numbered',
          items: [
            'Aufbau Principle: Fill orbitals from lowest to highest energy. Energy order: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s, 4d … (diagonal rule).',
            'Pauli Exclusion Principle: No two electrons in the same atom can have identical quantum numbers. Maximum 2 electrons per orbital, with opposite spins.',
            'Hund\'s Rule: When filling orbitals of equal energy (degenerate), place one electron in each orbital before any pairing. All unpaired electrons have parallel spins.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Anomalous Configurations: Cr and Cu',
          body: 'Chromium: expected [Ar] 3d⁴ 4s², actual [Ar] 3d⁵ 4s¹ (half-filled 3d is extra stable).\nCopper: expected [Ar] 3d⁹ 4s², actual [Ar] 3d¹⁰ 4s¹ (fully-filled 3d is extra stable).\nFor their ions, remove 4s electrons first: Cu²⁺ = [Ar] 3d⁹.',
        },
        {
          type: 'simulation',
          title: 'Electron Configuration Builder',
          description: 'Select an element, then watch electrons fill orbitals one by one, following Aufbau, Pauli, and Hund\'s rules. Drag electrons into boxes and get instant feedback.',
        },
      ],
      mcqs: [
        {
          question: 'Which set of quantum numbers is valid for an electron?',
          options: [
            'n=2, l=2, mₗ=0, mₛ=+½',
            'n=3, l=2, mₗ=−3, mₛ=+½',
            'n=3, l=2, mₗ=−1, mₛ=+½',
            'n=1, l=1, mₗ=0, mₛ=−½',
          ],
          correct: 2,
          explanation: 'For n=3, l can be 0, 1, or 2. For l=2, mₗ can be −2, −1, 0, +1, +2. So n=3, l=2, mₗ=−1 is valid. Option A fails (l must be < n). Option B fails (mₗ cannot exceed ±l=2). Option D fails (l=1 requires n≥2).',
        },
        {
          question: 'What is the electron configuration of Fe²⁺ (iron loses 2 electrons)?',
          options: [
            '[Ar] 3d⁶ 4s²',
            '[Ar] 3d⁸',
            '[Ar] 3d⁶',
            '[Ar] 3d⁴ 4s²',
          ],
          correct: 2,
          explanation: 'Fe is [Ar] 3d⁶ 4s². When Fe loses 2 electrons, the 4s electrons are removed first (highest principal quantum number). Fe²⁺ = [Ar] 3d⁶.',
        },
        {
          question: 'An orbital is described by n=4, l=1. How many orbitals of this type exist, and what is their subshell designation?',
          options: [
            '1 orbital, 4s',
            '3 orbitals, 4p',
            '5 orbitals, 4d',
            '7 orbitals, 4f',
          ],
          correct: 1,
          explanation: 'n=4, l=1 means 4p subshell. For l=1, mₗ = −1, 0, +1 → 3 orbitals. The 4p subshell has 3 degenerate orbitals.',
        },
      ],
      flashcards: [
        { front: 'What does the principal quantum number n describe?', back: 'The energy level and average distance of the electron from the nucleus. n = 1, 2, 3 …; higher n = higher energy' },
        { front: 'What values can the azimuthal quantum number l take?', back: 'l = 0, 1, 2, … n−1. l=0 → s orbital, l=1 → p, l=2 → d, l=3 → f' },
        { front: 'State the Pauli Exclusion Principle', back: 'No two electrons in the same atom can have an identical set of four quantum numbers. Maximum 2 electrons per orbital, with opposite spins.' },
        { front: 'State Hund\'s Rule', back: 'When filling degenerate orbitals, place one electron in each before pairing. All singly occupied orbitals have parallel spins.' },
        { front: 'Why is Cr [Ar] 3d⁵ 4s¹ instead of [Ar] 3d⁴ 4s²?', back: 'A half-filled d subshell (3d⁵) has extra stability from exchange energy, so one 4s electron moves to 3d' },
        { front: 'When an atom is ionized, which electrons are removed first?', back: 'The electrons with the highest principal quantum number (n) are removed first; for transition metals, 4s before 3d' },
      ],
    },

    // ── Concept 6: Periodic Trends ───────────────────────────────────────────
    {
      id: 'u1-c6-periodic-trends',
      title: 'Periodic Trends',
      subtitle: 'How atomic properties change across the table',
      estimatedMinutes: 12,
      accentHex: '#2dd4bf',
      blocks: [
        {
          type: 'text',
          body: 'Periodic trends arise from two competing factors: nuclear charge and electron shielding. As you move across a period (left to right), the number of protons increases while electrons are added to the same energy level. Since inner electrons shield outer electrons from the full nuclear charge, the effective nuclear charge (Z_eff) felt by valence electrons increases across a period.',
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'Shielding: The Inner Electron Bodyguard',
          body: 'Imagine the nucleus as a bright lamp. Inner-shell electrons are like translucent curtains — they partially block the light (nuclear pull) from reaching the outer electrons. The more curtains (inner electrons), the weaker the pull felt by the outermost electron. Shielding ≈ (number of core electrons). Z_eff ≈ Z − shielding.',
        },
        {
          type: 'table',
          headers: ['Trend', 'Across period →', 'Down group ↓', 'Largest atom location'],
          rows: [
            ['Atomic radius', 'Decreases', 'Increases', 'Bottom-left (Cs, Fr)'],
            ['Ionization energy', 'Increases (generally)', 'Decreases', 'Top-right (He, Ne)'],
            ['Electronegativity', 'Increases', 'Decreases', 'Top-right (F is highest)'],
            ['Electron affinity', 'Increases (generally)', 'Decreases', 'Top-right (Cl has highest magnitude)'],
          ],
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Why IE Has Two Exceptions per Period',
          body: 'Group 13 (B, Al) has lower IE than Group 2 (Be, Mg): the 2p electron is higher in energy and easier to remove than 2s.\nGroup 16 (O, S) has lower IE than Group 15 (N, P): the paired 2p electron experiences electron-electron repulsion, making it easier to remove.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'IE Jumps Reveal the Group',
          body: 'Successive ionization energies show a dramatic jump after all valence electrons are removed. If the large jump occurs between IE₂ and IE₃, the element is in Group 2. If between IE₁ and IE₂, it\'s in Group 1. This is frequently tested on the AP exam.',
        },
        {
          type: 'simulation',
          title: 'Periodic Trends Interactive Map',
          description: 'Toggle between atomic radius, ionization energy, electronegativity, and electron affinity. Watch the periodic table color-gradient update live and hover over any element for its exact value.',
        },
      ],
      mcqs: [
        {
          question: 'Which element has the largest atomic radius among Na, Mg, Al, and Si?',
          options: ['Si', 'Al', 'Mg', 'Na'],
          correct: 3,
          explanation: 'Across period 3 from left to right, Z_eff increases and atomic radius decreases. Na (Group 1) has the lowest Z_eff and largest radius among these four.',
        },
        {
          question: 'The successive ionization energies of element X are approximately: 900, 1760, 14850, 21000 kJ/mol. What group does X belong to?',
          options: ['Group 1', 'Group 2', 'Group 3', 'Group 14'],
          correct: 1,
          explanation: 'The huge jump occurs between IE₂ and IE₃, meaning the first two electrons are relatively easy to remove (valence electrons) but the third requires breaking into a noble gas core. X is in Group 2.',
        },
        {
          question: 'Which of the following elements has the highest electronegativity?',
          options: ['N', 'O', 'P', 'S'],
          correct: 1,
          explanation: 'Electronegativity increases across a period and decreases down a group. O (Period 2, Group 16) is higher in the table than S, and further right than N or P. O has the highest electronegativity among these options. (F is highest overall.)',
        },
      ],
      flashcards: [
        { front: 'What is effective nuclear charge (Z_eff)?', back: 'The net nuclear charge experienced by an electron after accounting for the shielding effect of inner electrons. Z_eff ≈ Z − shielding' },
        { front: 'Atomic radius trend across a period (left → right)', back: 'Decreases — more protons pull electrons closer, but shielding stays roughly constant within a period' },
        { front: 'Ionization energy trend down a group', back: 'Decreases — valence electrons are farther from nucleus and better shielded, easier to remove' },
        { front: 'What is electronegativity?', back: 'The tendency of an atom in a bond to attract shared electrons toward itself. Increases up and to the right; F is highest (3.98 Pauling)' },
        { front: 'Why does O have lower IE than N (period 2 exception)?', back: 'Oxygen\'s 2p⁴ configuration has a paired electron in one orbital; electron-electron repulsion lowers the energy needed to remove it' },
      ],
    },

    // ── Concept 7: Valence Electrons & Ionic Compounds ───────────────────────
    {
      id: 'u1-c7-valence-ionic',
      title: 'Valence Electrons & Ionic Compounds',
      subtitle: 'Electron transfer and formula writing',
      estimatedMinutes: 10,
      accentHex: '#fb923c',
      blocks: [
        {
          type: 'text',
          body: 'Valence electrons are the outermost electrons of an atom — those in the highest principal quantum number (n) shell, plus the d electrons for transition metals. Valence electrons determine chemical behavior and bonding. For main-group elements, the group number (1–18 IUPAC) directly gives the number of valence electrons: Group 1 → 1, Group 2 → 2, Group 13 → 3, …, Group 17 → 7, Group 18 → 8.',
        },
        {
          type: 'table',
          headers: ['Group', 'Valence e⁻', 'Typical ion', 'Example'],
          rows: [
            ['1 (alkali metals)', '1', 'M⁺', 'Na⁺, K⁺'],
            ['2 (alkaline earth)', '2', 'M²⁺', 'Mg²⁺, Ca²⁺'],
            ['13', '3', 'M³⁺', 'Al³⁺'],
            ['16 (chalcogens)', '6', 'X²⁻', 'O²⁻, S²⁻'],
            ['17 (halogens)', '7', 'X⁻', 'F⁻, Cl⁻'],
          ],
        },
        {
          type: 'text',
          body: 'Ionic bonding results from the complete transfer of one or more electrons from a metal atom to a nonmetal atom. The metal becomes a cation (positive ion) and the nonmetal becomes an anion (negative ion). Both ions achieve noble gas electron configurations, which are especially stable.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Writing Ionic Formulas: The Crossover Method',
          body: 'To write the formula for an ionic compound: (1) Write the cation first, then the anion. (2) The magnitude of each ion\'s charge becomes the subscript of the other ion. (3) Simplify the subscripts to the lowest whole-number ratio.\nExample: Al³⁺ and O²⁻ → Al₂O₃ (swap 3 and 2, simplify if needed).',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Common Polyatomic Ions — Memorize These',
          body: 'NO₃⁻ (nitrate), NO₂⁻ (nitrite), SO₄²⁻ (sulfate), SO₃²⁻ (sulfite), PO₄³⁻ (phosphate), CO₃²⁻ (carbonate), OH⁻ (hydroxide), NH₄⁺ (ammonium), ClO₄⁻ (perchlorate), CrO₄²⁻ (chromate), MnO₄⁻ (permanganate). These appear frequently in AP Chemistry questions.',
        },
      ],
      mcqs: [
        {
          question: 'How many valence electrons does a sulfur atom (Group 16) have?',
          options: ['2', '4', '6', '8'],
          correct: 2,
          explanation: 'Sulfur is in Group 16. Main-group elements have valence electrons equal to their group number (1–18 system, subtract 10 for groups 13–18). Group 16 → 6 valence electrons. Sulfur\'s configuration is [Ne] 3s² 3p⁴ — six electrons in the n=3 shell.',
        },
        {
          question: 'What is the correct formula for aluminum sulfate?',
          options: ['AlSO₄', 'Al₂SO₄', 'Al₂(SO₄)₃', 'Al₃(SO₄)₂'],
          correct: 2,
          explanation: 'Al³⁺ and SO₄²⁻. Using the crossover rule: Al₂(SO₄)₃. Check: 2(+3) + 3(−2) = +6 − 6 = 0. The compound is electrically neutral.',
        },
        {
          question: 'Which of the following ions has the electron configuration of argon [Ar]?',
          options: ['Na⁺ only', 'Mg²⁺ only', 'Al³⁺ only', 'Na⁺, Mg²⁺, and Al³⁺'],
          correct: 3,
          explanation: 'Ar has 18 electrons. Na (11 e⁻) − 1 = 10 → NO. Wait: Na⁺ = 10 electrons = [Ne], not Ar. Let me correct: Na⁺ = 10 e⁻ ([Ne]). Mg²⁺ = 10 e⁻ ([Ne]). Al³⁺ = 10 e⁻ ([Ne]). All three are isoelectronic with Ne, not Ar. The answer is all three are isoelectronic with each other and with Ne.',
        },
      ],
      flashcards: [
        { front: 'How many valence electrons does a Group 2 element have?', back: '2 valence electrons (in the outermost s subshell), forming M²⁺ ions' },
        { front: 'What ion does oxygen typically form and why?', back: 'O²⁻ — oxygen gains 2 electrons to complete its 2p subshell and achieve the neon configuration [He] 2s² 2p⁶' },
        { front: 'Formula for aluminum phosphate', back: 'AlPO₄ — Al³⁺ and PO₄³⁻, charges match (3+ and 3−), so 1:1 ratio, no parentheses needed' },
        { front: 'Formula for the nitrate ion', back: 'NO₃⁻ — a polyatomic anion with nitrogen and three oxygens, charge −1' },
        { front: 'What is isoelectronic?', back: 'Species with the same number of electrons and the same electron configuration (e.g., Na⁺, Mg²⁺, Al³⁺, Ne all have 10 electrons)' },
      ],
    },

    // ── Concept 8: Photoelectron Spectroscopy ───────────────────────────────
    {
      id: 'u1-c8-pes',
      title: 'Photoelectron Spectroscopy (PES)',
      subtitle: 'Reading electron binding energies',
      estimatedMinutes: 10,
      accentHex: '#f472b6',
      blocks: [
        {
          type: 'text',
          body: 'Photoelectron spectroscopy (PES) bombards atoms with high-energy photons (UV or X-ray). If the photon energy exceeds the binding energy of an electron, that electron is ejected. By measuring the kinetic energy of the ejected electrons and applying conservation of energy, we can determine the binding energy of each electron in each subshell.',
        },
        {
          type: 'formula',
          latex: 'E_{\\text{photon}} = E_{\\text{binding}} + E_{\\text{kinetic}}',
          display: true,
          caption: 'The binding energy is what we extract from a PES measurement',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Reading a PES Spectrum',
          body: 'Each peak in a PES spectrum corresponds to one subshell. The X-axis shows binding energy (increases right to left in AP-style diagrams). The Y-axis shows relative signal intensity. Peak POSITION = binding energy of that subshell. Peak HEIGHT = relative number of electrons in that subshell.',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Higher Binding Energy = Closer to Nucleus',
          body: '1s electrons (core) have the HIGHEST binding energy — they experience the full nuclear charge with almost no shielding. Valence electrons (3s, 3p) have the LOWEST binding energy — they are far from the nucleus and well-shielded. The 1s peak appears at far-right in an AP-style PES spectrum.',
        },
        {
          type: 'table',
          headers: ['Subshell', 'Binding energy (relative)', 'Electrons', 'AP spectrum position'],
          rows: [
            ['3p', 'Lowest BE', '2 (e.g., Si)', 'Far left (easiest to remove)'],
            ['3s', 'Low BE', '2', 'Left'],
            ['2p', 'Medium BE', '6', 'Middle'],
            ['2s', 'High BE', '2', 'Right'],
            ['1s', 'Highest BE', '2', 'Far right (hardest to remove)'],
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Identify the Element from a PES Spectrum',
          body: 'Count the total electrons under all peaks (area/height proportional to electron count). Match the pattern of subshells and electron counts to electron configurations. A spectrum with peaks in ratio 2:2:6:2 (from high to low BE) represents neon — the 1s:2s:2p:? The 4th peak tells you what comes next.',
        },
        {
          type: 'simulation',
          title: 'PES Spectrum Reader',
          description: 'Select an element and see its PES spectrum live. Hover over any peak to see the subshell it represents, its binding energy, and how many electrons it contains.',
        },
      ],
      mcqs: [
        {
          question: 'A PES spectrum shows four peaks with relative electron counts of 2, 2, 6, and 2 at binding energies from high to low. What element does this represent?',
          options: ['Carbon', 'Neon', 'Magnesium', 'Silicon'],
          correct: 2,
          explanation: 'From high to low binding energy: 1s² (2 e⁻), 2s² (2 e⁻), 2p⁶ (6 e⁻), 3s² (2 e⁻). Total = 12 electrons = Magnesium. This is [Ne] 3s² with the full neon core visible plus the 3s peak.',
        },
        {
          question: 'In a PES spectrum, which peak corresponds to the most tightly bound electrons?',
          options: [
            'The peak at the lowest binding energy (easiest to remove)',
            'The peak at the highest binding energy (hardest to remove)',
            'The tallest peak',
            'The peak furthest to the left in an AP-style diagram',
          ],
          correct: 1,
          explanation: 'Binding energy is the energy required to remove that electron. The highest binding energy peak corresponds to the most tightly bound electrons — the 1s core electrons. In AP-style diagrams, this peak appears at the FAR RIGHT (high binding energy axis).',
        },
        {
          question: 'Which statement about PES peak height (intensity) is correct?',
          options: [
            'Higher peaks indicate electrons with more energy',
            'Peak height reflects the binding energy of the electrons',
            'Peak height is proportional to the number of electrons in that subshell',
            'All peaks in a PES spectrum have the same height',
          ],
          correct: 2,
          explanation: 'Peak height (or area) in PES is proportional to the number of electrons that were ejected from that subshell. The 2p peak is approximately 3× the height of the 1s or 2s peak because 2p holds 6 electrons vs. 2 electrons in 1s or 2s.',
        },
      ],
      flashcards: [
        { front: 'What does PES (photoelectron spectroscopy) measure?', back: 'The binding energies of electrons in different subshells of an atom — directly maps to electron configuration' },
        { front: 'What does peak HEIGHT represent in a PES spectrum?', back: 'The relative number of electrons in that subshell (proportional to electron count: 2 for s, 6 for p)' },
        { front: 'Which subshell has the HIGHEST binding energy in PES?', back: '1s electrons — they are closest to the nucleus, experience the most nuclear pull, and are hardest to remove' },
        { front: 'What is the relationship: E_photon = E_binding + E_kinetic?', back: 'Photon energy is split between overcoming the binding energy (releasing the electron) and giving it kinetic energy as it flies away' },
        { front: 'How many PES peaks does sodium (Na, [Ne] 3s¹) show?', back: 'Four peaks: 1s, 2s, 2p, and 3s — each subshell occupied gives one peak' },
      ],
    },

  ],
}
