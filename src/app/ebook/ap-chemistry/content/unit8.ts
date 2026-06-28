import type { EbookUnit } from '../types'

export const UNIT8: EbookUnit = {
  id: 'unit-8',
  number: 8,
  title: 'Acids & Bases',
  examWeight: '11–15%',
  accentHex: '#4ade80',
  concepts: [

    // ── Concept 1: pH, pOH, and Ka/Kb ────────────────────────────────────────
    {
      id: 'u8-c1-ph',
      title: 'pH, pOH, and Acid/Base Strength',
      subtitle: 'The logarithmic scale of acidity',
      estimatedMinutes: 11,
      accentHex: '#4ade80',
      blocks: [
        {
          type: 'text',
          body: 'The pH scale expresses hydrogen ion concentration on a logarithmic scale, making it easier to work with very small numbers. At 25°C, pure water has [H⁺] = [OH⁻] = 1.00 × 10⁻⁷ M, giving pH = pOH = 7.00. The ion product constant Kw = [H⁺][OH⁻] = 1.00 × 10⁻¹⁴ at 25°C.',
        },
        {
          type: 'formula',
          latex: 'pH = -\\log[H^+] \\quad pOH = -\\log[OH^-] \\quad pH + pOH = 14.00 \\text{ at 25°C}',
          display: true,
        },
        {
          type: 'table',
          headers: ['[H⁺] (M)', 'pH', 'Classification'],
          rows: [
            ['1 × 10⁻¹', '1', 'Strongly acidic'],
            ['1 × 10⁻⁴', '4', 'Weakly acidic'],
            ['1 × 10⁻⁷', '7', 'Neutral'],
            ['1 × 10⁻¹⁰', '10', 'Weakly basic'],
            ['1 × 10⁻¹³', '13', 'Strongly basic'],
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Ka and Kb — Quantifying Weak Acid/Base Strength',
          body: 'Ka (acid dissociation constant) for HA ⇌ H⁺ + A⁻: Ka = [H⁺][A⁻] / [HA].\nLarger Ka → stronger acid → more ionization → lower pH at same concentration.\nFor conjugate pairs: Ka × Kb = Kw = 1.00 × 10⁻¹⁴ at 25°C.\npKa = −log Ka; stronger acids have smaller pKa.\nCommon Ka values: HF (6.8 × 10⁻⁴), CH₃COOH (1.8 × 10⁻⁵), HCN (6.2 × 10⁻¹⁰).',
        },
        {
          type: 'formula',
          latex: 'K_a \\times K_b = K_w = 1.00 \\times 10^{-14} \\text{ (at 25°C, for conjugate pair)}',
          display: true,
          caption: 'The stronger the acid (large Ka), the weaker its conjugate base (small Kb), and vice versa',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Calculating pH of Weak Acids',
          body: 'For HA ⇌ H⁺ + A⁻ with initial concentration C and Ka:\nICE: x² / (C − x) = Ka. If Ka << C (5% check), approximate: x² ≈ Ka × C → x = √(Ka × C) = [H⁺] → pH = −log x.',
        },
      ],
      mcqs: [
        {
          question: 'What is the pH of a 0.0050 M HCl solution?',
          options: ['1.0', '2.3', '3.0', '11.7'],
          correct: 1,
          explanation: 'HCl is a strong acid — fully dissociated. [H⁺] = 0.0050 M = 5.0 × 10⁻³ M. pH = −log(5.0 × 10⁻³) = −(log 5.0 + log 10⁻³) = −(0.699 − 3) = 3 − 0.699 = 2.30.',
        },
        {
          question: 'A weak acid has Ka = 1.8 × 10⁻⁵. What is the Kb of its conjugate base?',
          options: ['1.8 × 10⁻⁵', '5.6 × 10¹⁰', '5.6 × 10⁻¹⁰', '1.0 × 10⁻¹⁴'],
          correct: 2,
          explanation: 'Ka × Kb = Kw = 1.00 × 10⁻¹⁴. Kb = Kw / Ka = 1.00 × 10⁻¹⁴ / 1.8 × 10⁻⁵ = 5.56 × 10⁻¹⁰ ≈ 5.6 × 10⁻¹⁰.',
        },
        {
          question: 'Calculate the pH of 0.10 M acetic acid (Ka = 1.8 × 10⁻⁵). Which approximation is valid?',
          options: ['pH = 2.87; 5% check passes', 'pH = 5.0; no approximation needed', 'pH = 1.0; strong acid', 'pH = 7.0; neutral'],
          correct: 0,
          explanation: '[H⁺] = √(Ka × C) = √(1.8×10⁻⁵ × 0.10) = √(1.8×10⁻⁶) = 1.34 × 10⁻³ M. 5% check: (1.34×10⁻³/0.10) × 100% = 1.34% < 5% ✓. pH = −log(1.34 × 10⁻³) = 2.87.',
        },
      ],
      flashcards: [
        { front: 'pH + pOH = ?', back: '14.00 at 25°C. Derived from Kw = [H⁺][OH⁻] = 1.00 × 10⁻¹⁴. Also: pKw = pKa + pKb = 14.' },
        { front: 'Ka × Kb = ?', back: 'Kw = 1.00 × 10⁻¹⁴ at 25°C. This relates a conjugate acid-base pair: stronger acid → weaker conjugate base.' },
        { front: 'Approximate [H⁺] for weak acid (small Ka)', back: '[H⁺] ≈ √(Ka × C₀), valid when x/C₀ < 5%. Use when Ka << C₀.' },
        { front: 'What is pKa?', back: 'pKa = −log Ka. Smaller pKa = stronger acid. More useful than Ka for comparing acids.' },
      ],
    },

    // ── Concept 2: Buffer Solutions ───────────────────────────────────────────
    {
      id: 'u8-c2-buffers',
      title: 'Buffer Solutions',
      subtitle: 'Resisting pH change — Henderson-Hasselbalch',
      estimatedMinutes: 11,
      accentHex: '#86efac',
      blocks: [
        {
          type: 'text',
          body: 'A buffer solution resists large changes in pH when small amounts of strong acid or strong base are added. Buffers consist of a weak acid and its conjugate base (or a weak base and its conjugate acid) in comparable concentrations. Common examples: acetic acid/acetate (CH₃COOH/CH₃COO⁻), carbonate/bicarbonate (H₂CO₃/HCO₃⁻), and ammonium/ammonia (NH₄⁺/NH₃).',
        },
        {
          type: 'formula',
          latex: 'pH = pK_a + \\log\\frac{[A^-]}{[HA]}',
          display: true,
          caption: 'Henderson-Hasselbalch equation: pH of a buffer. [A⁻] = conjugate base, [HA] = weak acid.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Buffer pH = pKa When [A⁻] = [HA]',
          body: 'When the concentrations of weak acid and conjugate base are equal, log([A⁻]/[HA]) = log(1) = 0. Therefore pH = pKa. This is the mid-point of the buffer\'s effective range. A buffer is most effective within ±1 pH unit of pKa.',
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'How a Buffer Works — The Acid/Base Reserve',
          body: 'A buffer has two reserves:\n• The weak acid (HA) neutralizes added OH⁻: HA + OH⁻ → A⁻ + H₂O (converts A⁻/HA ratio slightly; pH barely changes)\n• The conjugate base (A⁻) neutralizes added H⁺: A⁻ + H⁺ → HA (same idea)\nThe buffer is exhausted only when all of one component is consumed.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Buffer Capacity and Buffer Range',
          body: 'Buffer capacity: how many moles of H⁺ or OH⁻ a buffer can absorb without significant pH change. Higher capacity when [HA] and [A⁻] are both high.\nBuffer effective range: pKa ± 1 pH unit.\nChoose buffer: select weak acid whose pKa is closest to the desired pH.',
        },
        {
          type: 'simulation',
          title: 'Buffer pH Simulator',
          description: 'Mix weak acid and conjugate base at various ratios and see the resulting pH. Add strong acid or base dropwise and watch the pH curve — observe the flat buffer region vs. the steep equivalence point jump.',
        },
      ],
      mcqs: [
        {
          question: 'A buffer contains 0.20 M CH₃COOH and 0.30 M CH₃COO⁻. Ka = 1.8 × 10⁻⁵. What is the pH?',
          options: ['4.57', '4.74', '4.92', '5.09'],
          correct: 2,
          explanation: 'pH = pKa + log([A⁻]/[HA]) = −log(1.8×10⁻⁵) + log(0.30/0.20) = 4.744 + log(1.5) = 4.744 + 0.176 = 4.92.',
        },
        {
          question: 'Which pair can act as a buffer?',
          options: [
            'HCl and NaCl',
            'NaOH and NaCl',
            'NH₃ and NH₄Cl',
            'HCl and NaOH',
          ],
          correct: 2,
          explanation: 'A buffer requires a weak acid + its conjugate base (or weak base + conjugate acid). NH₃ (weak base) and NH₄⁺ (conjugate acid, provided by NH₄Cl) form a buffer. HCl is a strong acid (not a weak acid), and NaOH/NaCl are not a conjugate pair.',
        },
        {
          question: 'To prepare a buffer with pH = 9.25 using ammonia (pKb = 4.74, pKa of NH₄⁺ = 9.26), what ratio of NH₃ to NH₄⁺ is needed?',
          options: [
            '[NH₃]/[NH₄⁺] ≈ 1.0',
            '[NH₃]/[NH₄⁺] ≈ 0.50',
            '[NH₃]/[NH₄⁺] ≈ 2.0',
            '[NH₃]/[NH₄⁺] ≈ 0.10',
          ],
          correct: 0,
          explanation: 'pH = pKa + log([A⁻]/[HA]) = pKa(NH₄⁺) + log([NH₃]/[NH₄⁺]). 9.25 = 9.26 + log([NH₃]/[NH₄⁺]) → log ratio = −0.01 → ratio ≈ 10^(−0.01) ≈ 0.98 ≈ 1.0. Nearly equal concentrations of NH₃ and NH₄⁺.',
        },
      ],
      flashcards: [
        { front: 'Henderson-Hasselbalch equation', back: 'pH = pKa + log([A⁻]/[HA]). Used to calculate pH of buffer solutions.' },
        { front: 'What is the pH of a buffer when [A⁻] = [HA]?', back: 'pH = pKa (log(1) = 0). This is the point of maximum buffer capacity.' },
        { front: 'Buffer effective range', back: 'pKa ± 1 pH unit. Outside this range, the buffer capacity is too low to resist pH changes effectively.' },
        { front: 'How does a buffer neutralize added acid (H⁺)?', back: 'The conjugate base (A⁻) reacts: A⁻ + H⁺ → HA. The [A⁻]/[HA] ratio changes slightly, but pH barely changes.' },
      ],
    },

    // ── Concept 3: Titrations ─────────────────────────────────────────────────
    {
      id: 'u8-c3-titrations',
      title: 'Acid-Base Titrations',
      subtitle: 'Equivalence points, indicators, and titration curves',
      estimatedMinutes: 12,
      accentHex: '#4ade80',
      blocks: [
        {
          type: 'text',
          body: 'In an acid-base titration, a solution of known concentration (titrant, in the burette) is added to a measured volume of an unknown (analyte, in the flask) until the stoichiometric amount has been delivered — the equivalence point. An indicator or pH meter detects the endpoint. The titration curve (pH vs. volume of titrant added) has a characteristic S-shape with a steep jump at the equivalence point.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Three Types of Titration Curves',
          body: 'Strong acid + strong base: equivalence point at pH = 7.00. Steep jump: pH ~3 to ~11 in ≈ 0.1 mL.\nWeak acid + strong base: equivalence point above 7 (conjugate base is basic). Half-equivalence point: pH = pKa (buffer region).\nWeak base + strong acid: equivalence point below 7 (conjugate acid is acidic).',
        },
        {
          type: 'table',
          headers: ['Titration type', 'Equivalence point pH', 'Best indicator range', 'Example'],
          rows: [
            ['Strong acid / Strong base', '7.00', 'Any with pKa ≈ 7 (bromthymol blue)', 'HCl + NaOH'],
            ['Weak acid / Strong base', '>7 (basic)', 'Phenolphthalein (8.2–10)', 'CH₃COOH + NaOH'],
            ['Weak base / Strong acid', '<7 (acidic)', 'Methyl orange (3.1–4.4)', 'NH₃ + HCl'],
          ],
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Half-Equivalence Point — pH = pKa',
          body: 'At the half-equivalence point of a weak acid titration (half the equivalence volume of base added), exactly half the weak acid has been neutralized. This means [HA] = [A⁻] exactly → pH = pKa (from Henderson-Hasselbalch). This is how to experimentally determine pKa from a titration curve.',
        },
        {
          type: 'formula',
          latex: 'n_{\\text{acid}} = n_{\\text{base}} \\quad \\Rightarrow \\quad M_a V_a = M_b V_b \\text{ (for 1:1 stoichiometry)}',
          display: true,
          caption: 'At the equivalence point: moles of acid = moles of base (adjusted for stoichiometry)',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Species Present at Each Stage of Weak Acid Titration',
          body: 'Before any base added: mostly HA (weak acid, some H⁺).\nBetween start and equivalence point: buffer region (HA + A⁻ mixture).\nAt equivalence point: only A⁻ in solution → hydrolyses: A⁻ + H₂O ⇌ HA + OH⁻ → pH > 7.\nPast equivalence: excess NaOH → pH determined by excess [OH⁻].',
        },
      ],
      mcqs: [
        {
          question: 'At the equivalence point of a weak acid/strong base titration, the solution is:',
          options: [
            'Acidic (pH < 7)',
            'Neutral (pH = 7)',
            'Basic (pH > 7)',
            'Cannot be determined without knowing Ka',
          ],
          correct: 2,
          explanation: 'At the equivalence point, all weak acid (HA) has been converted to its conjugate base (A⁻). The conjugate base hydrolyzes: A⁻ + H₂O ⇌ HA + OH⁻. This produces excess OH⁻, making the solution basic (pH > 7). The stronger the weak acid\'s conjugate base, the higher the pH above 7.',
        },
        {
          question: '25.0 mL of 0.100 M HCl is titrated with 0.100 M NaOH. What volume of NaOH is needed to reach the equivalence point?',
          options: ['12.5 mL', '25.0 mL', '50.0 mL', '100.0 mL'],
          correct: 1,
          explanation: 'At equivalence: MₐVₐ = MbVb. (0.100)(25.0) = (0.100)(Vb) → Vb = 25.0 mL. For a 1:1 acid:base ratio with equal concentrations, equal volumes are needed.',
        },
        {
          question: 'A weak acid is titrated with NaOH. At the half-equivalence point, pH = 4.74. What is Ka?',
          options: ['4.74', '1.8 × 10⁻⁵', '3.2 × 10⁻⁵', '1.0 × 10⁻⁷'],
          correct: 1,
          explanation: 'At the half-equivalence point, pH = pKa = 4.74. Ka = 10^(−pKa) = 10^(−4.74) = 1.8 × 10⁻⁵. This is the Ka of acetic acid — matching exactly.',
        },
      ],
      flashcards: [
        { front: 'What is the equivalence point?', back: 'The point in a titration when moles of titrant exactly equal the stoichiometric requirement. For strong/strong: pH = 7. For weak acid/strong base: pH > 7.' },
        { front: 'Half-equivalence point in a weak acid titration', back: 'Volume of base = half equivalence volume. [HA] = [A⁻]. pH = pKa. Used to determine pKa experimentally.' },
        { front: 'Why is pH > 7 at the equivalence point of weak acid/strong base titration?', back: 'The conjugate base A⁻ hydrolyzes in water: A⁻ + H₂O ⇌ HA + OH⁻, producing excess OH⁻.' },
        { front: 'How to choose an indicator for a titration', back: 'Choose an indicator whose pKaᵢₙ is close to the equivalence point pH. The color change should occur within the steep part of the titration curve.' },
      ],
    },

  ],
}
