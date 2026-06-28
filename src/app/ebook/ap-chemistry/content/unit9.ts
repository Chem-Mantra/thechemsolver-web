import type { EbookUnit } from '../types'

export const UNIT9: EbookUnit = {
  id: 'unit-9',
  number: 9,
  title: 'Thermodynamics & Electrochemistry',
  examWeight: '7–9%',
  accentHex: '#e879f9',
  concepts: [

    // ── Concept 1: Entropy & Gibbs Free Energy ────────────────────────────────
    {
      id: 'u9-c1-gibbs',
      title: 'Entropy & Gibbs Free Energy',
      subtitle: 'Predicting spontaneity — ΔG = ΔH − TΔS',
      estimatedMinutes: 12,
      accentHex: '#e879f9',
      blocks: [
        {
          type: 'text',
          body: 'Thermodynamics asks: will a reaction occur spontaneously? Two driving forces operate: enthalpy (tendency toward lower energy, ΔH < 0) and entropy (tendency toward greater disorder, ΔS > 0). Gibbs free energy (ΔG) combines both into a single spontaneity criterion. A process is spontaneous if ΔG < 0 at constant temperature and pressure.',
        },
        {
          type: 'formula',
          latex: '\\Delta G = \\Delta H - T\\Delta S',
          display: true,
          caption: 'ΔG < 0 → spontaneous; ΔG > 0 → non-spontaneous; ΔG = 0 → equilibrium. T must be in Kelvin.',
        },
        {
          type: 'table',
          headers: ['ΔH', 'ΔS', 'ΔG', 'Spontaneity'],
          rows: [
            ['−', '+', 'Always −', 'Spontaneous at all temperatures'],
            ['+', '−', 'Always +', 'Never spontaneous (under these conditions)'],
            ['−', '−', '− at low T, + at high T', 'Spontaneous at low temperature'],
            ['+', '+', '+ at low T, − at high T', 'Spontaneous at high temperature'],
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Second Law: ΔS_universe ≥ 0',
          body: 'The Second Law of Thermodynamics: for any spontaneous process, the entropy of the universe (system + surroundings) increases. ΔS_universe = ΔS_system + ΔS_surroundings ≥ 0. The Third Law: the entropy of a perfect crystalline substance at 0 K is exactly zero (S = 0 at 0 K).',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Predicting Sign of ΔS',
          body: 'ΔS > 0 (entropy increases) when:\n• More gas molecules produced (Δn_gas > 0)\n• Solid → liquid → gas phase transition\n• Dissolving a solid in water\n• A complex molecule breaks into simpler fragments\n• Mixing different substances\nΔS < 0 when the reverse conditions apply.',
        },
        {
          type: 'formula',
          latex: '\\Delta G^\\circ = -RT\\ln K \\quad \\text{and} \\quad \\Delta G = \\Delta G^\\circ + RT\\ln Q',
          display: true,
          caption: 'Connects thermodynamics to equilibrium: if ΔG° < 0, K > 1 (products favoured)',
        },
        {
          type: 'formula',
          latex: '\\Delta G^\\circ_{\\text{rxn}} = \\sum n\\,\\Delta G^\\circ_f(\\text{products}) - \\sum m\\,\\Delta G^\\circ_f(\\text{reactants})',
          display: true,
          caption: 'Standard Gibbs free energy from formation values; ΔGf° of elements in standard state = 0',
        },
      ],
      mcqs: [
        {
          question: 'A reaction has ΔH = +50 kJ and ΔS = +200 J/K. At what temperature does the reaction become spontaneous?',
          options: ['Below 250 K', 'Above 250 K', 'At all temperatures', 'Never'],
          correct: 1,
          explanation: 'Spontaneous when ΔG < 0 → ΔH − TΔS < 0 → T > ΔH/ΔS = 50,000 J / 200 J/K = 250 K. (Note: convert ΔH to joules.) Above 250 K, the +TΔS term dominates and ΔG becomes negative.',
        },
        {
          question: 'For a reaction at equilibrium, ΔG equals:',
          options: ['ΔH', '−ΔH', 'Zero', 'ΔG°'],
          correct: 2,
          explanation: 'At equilibrium, ΔG = 0 (not ΔG°). The equation ΔG = ΔG° + RT ln Q becomes 0 = ΔG° + RT ln K when Q = K at equilibrium. ΔG° ≠ 0 in general; it is related to K by ΔG° = −RT ln K.',
        },
        {
          question: 'For N₂(g) + 3H₂(g) → 2NH₃(g), ΔS° is most likely:',
          options: ['Positive (entropy increases)', 'Zero (entropy unchanged)', 'Negative (entropy decreases)', 'Cannot be determined'],
          correct: 2,
          explanation: 'Δn_gas = 2 − (1 + 3) = 2 − 4 = −2. Fewer moles of gas in products → entropy decreases (ΔS < 0). This reaction trades entropy for enthalpy (it\'s exothermic), which is why industrial conditions must be carefully controlled.',
        },
      ],
      flashcards: [
        { front: 'ΔG = ΔH − TΔS — when is a reaction spontaneous?', back: 'When ΔG < 0. Both negative ΔH (exothermic) and positive ΔS (disorder increase) favour spontaneity.' },
        { front: 'ΔG° and K relationship', back: 'ΔG° = −RT ln K. If ΔG° < 0 → K > 1 (products favoured). If ΔG° > 0 → K < 1 (reactants favoured). If ΔG° = 0 → K = 1.' },
        { front: 'When does entropy increase?', back: 'More gas molecules (Δn_gas > 0), phase change to more disordered state (s→l→g), dissolving a solid, or mixing.' },
        { front: 'Third Law of Thermodynamics', back: 'The entropy of a perfect crystalline substance at absolute zero (0 K) is exactly zero: S(0 K) = 0.' },
        { front: 'ΔG at equilibrium', back: 'ΔG = 0 at equilibrium (not ΔG°). This means the system has minimized its free energy.' },
      ],
    },

    // ── Concept 2: Electrochemical Cells ──────────────────────────────────────
    {
      id: 'u9-c2-electrochemistry',
      title: 'Electrochemical Cells',
      subtitle: 'Galvanic and electrolytic cells, cell potential',
      estimatedMinutes: 14,
      accentHex: '#d946ef',
      blocks: [
        {
          type: 'text',
          body: 'Electrochemistry connects redox chemistry and electrical energy. In a galvanic (voltaic) cell, a spontaneous redox reaction (ΔG < 0) generates electrical energy. In an electrolytic cell, electrical energy drives a non-spontaneous redox reaction (ΔG > 0 — electrolysis). Both cells have an anode (oxidation) and cathode (reduction).',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Anode and Cathode — ALWAYS',
          body: 'Anode: OXidation occurs (AN OX)\nCathode: REDuction occurs (RED CAT)\nIn a galvanic cell: anode is negative (−), cathode is positive (+). Electrons flow through external circuit from anode to cathode.\nIn an electrolytic cell: anode is positive (+), cathode is negative (−). The battery forces current in reverse.',
        },
        {
          type: 'formula',
          latex: 'E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}} = E^\\circ_{\\text{reduction, cathode}} - E^\\circ_{\\text{reduction, anode}}',
          display: true,
          caption: 'Standard reduction potentials (E°) are always tabulated as reductions. E°cell > 0 = spontaneous (galvanic).',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Connecting E°cell, ΔG°, and K',
          body: 'ΔG° = −nFE°cell\nΔG° = −RT ln K\nTherefore: nFE°cell = RT ln K → E°cell = (RT/nF) ln K = (0.0592/n) log K at 25°C.\nSpontaneous (ΔG° < 0) ↔ E°cell > 0 ↔ K > 1. All three are equivalent criteria for a spontaneous cell reaction.',
        },
        {
          type: 'formula',
          latex: 'E = E^\\circ - \\frac{0.0592}{n}\\log Q \\quad \\text{(Nernst equation at 25°C)}',
          display: true,
          caption: 'n = moles of electrons transferred; Q = reaction quotient for the cell reaction. At equilibrium: E = 0 and Q = K.',
        },
        {
          type: 'table',
          headers: ['Property', 'Galvanic cell', 'Electrolytic cell'],
          rows: [
            ['Energy', 'Converts chemical → electrical', 'Converts electrical → chemical'],
            ['ΔG', '< 0 (spontaneous)', '> 0 (non-spontaneous)'],
            ['E°cell', '> 0', '< 0 (applied voltage needed)'],
            ['Anode charge', 'Negative (−)', 'Positive (+)'],
            ['Cathode charge', 'Positive (+)', 'Negative (−)'],
            ['Examples', 'Batteries, fuel cells', 'Electroplating, refining Cu, H₂O electrolysis'],
          ],
        },
        {
          type: 'simulation',
          title: 'Electrochemical Cell Builder',
          description: 'Select half-cells from a reduction potential table. Watch the galvanic cell form with anode, cathode, salt bridge, and electron flow. Calculate E°cell and ΔG° in real time.',
        },
      ],
      mcqs: [
        {
          question: 'Given E°(Zn²⁺/Zn) = −0.76 V and E°(Cu²⁺/Cu) = +0.34 V. What is E°cell for the Zn-Cu galvanic cell?',
          options: ['−1.10 V', '+0.42 V', '+1.10 V', '−0.42 V'],
          correct: 2,
          explanation: 'Zn is more easily oxidized (lower reduction potential → anode). Cu²⁺ is reduced at cathode. E°cell = E°cathode − E°anode = (+0.34) − (−0.76) = 0.34 + 0.76 = +1.10 V. Positive E°cell confirms spontaneous reaction.',
        },
        {
          question: 'In a galvanic cell, where do oxidation and reduction occur?',
          options: [
            'Oxidation at cathode; reduction at anode',
            'Oxidation at anode; reduction at cathode',
            'Both occur at the anode',
            'Both occur at the cathode',
          ],
          correct: 1,
          explanation: 'AN OX, RED CAT: Anode = OXidation; Cathode = REDuction. This is true for both galvanic AND electrolytic cells. In a galvanic cell: anode is (−), cathode is (+). Electrons flow from anode to cathode through the external wire.',
        },
        {
          question: 'What is ΔG° for a cell with E°cell = +1.10 V and n = 2? (F = 96485 C/mol)',
          options: ['−212 kJ/mol', '+212 kJ/mol', '−106 kJ/mol', '+106 kJ/mol'],
          correct: 0,
          explanation: 'ΔG° = −nFE°cell = −(2 mol)(96485 C/mol)(1.10 V) = −212,267 J/mol ≈ −212 kJ/mol. Negative ΔG° confirms spontaneous reaction, consistent with positive E°cell.',
        },
      ],
      flashcards: [
        { front: 'ANOX REDCAT mnemonic', back: 'Anode = OXidation; Cathode = REDuction. In galvanic cell: anode (−), cathode (+). Electrons flow anode → cathode.' },
        { front: 'ΔG° = −nFE°cell', back: 'n = moles of electrons; F = 96485 C/mol (Faraday\'s constant); E°cell in volts. ΔG in joules. Spontaneous: E°cell > 0 ↔ ΔG° < 0.' },
        { front: 'Nernst equation', back: 'E = E° − (0.0592/n) log Q at 25°C. Corrects standard cell potential for non-standard conditions.' },
        { front: 'What is a salt bridge?', back: 'Allows ions to flow between half-cells to maintain electrical neutrality. Without it, charge builds up and the cell stops working.' },
        { front: 'What happens to E as Q increases?', back: 'E decreases (Nernst equation: larger Q → larger log Q → subtract more from E°). At Q = K: E = 0 (dead battery).' },
      ],
    },

    // ── Concept 3: Electrolysis and Faraday's Laws ────────────────────────────
    {
      id: 'u9-c3-electrolysis',
      title: 'Electrolysis & Faraday\'s Laws',
      subtitle: 'Using electrical current to drive chemistry',
      estimatedMinutes: 10,
      accentHex: '#e879f9',
      blocks: [
        {
          type: 'text',
          body: 'Electrolysis uses electrical energy to drive a thermodynamically non-spontaneous redox reaction. Faraday\'s Laws quantify the relationship between the amount of substance produced and the charge passed. The core concept: 1 mole of electrons carries 1 Faraday of charge (F = 96485 C/mol).',
        },
        {
          type: 'formula',
          latex: 'q = I \\times t \\quad \\text{and} \\quad n_{e^-} = \\frac{q}{F} = \\frac{I \\cdot t}{96485}',
          display: true,
          caption: 'q = charge (C), I = current (A), t = time (s), F = 96485 C/mol. Then use stoichiometry: mol product = mol e⁻ / (electrons per ion).',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Faraday\'s Law Calculation Roadmap',
          body: 'Current (A) × Time (s) → Charge (C) → ÷ F → Moles of e⁻ → ÷ electrons per ion → Moles of product → × molar mass → Mass of product\nExample: Cu²⁺ + 2e⁻ → Cu. 2 moles of electrons deposit 1 mole of Cu.',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Competing Reactions in Aqueous Electrolysis',
          body: 'In aqueous electrolysis, water can also be oxidized/reduced. The products depend on which species is more easily reduced (cathode) or oxidized (anode).\nCathode: prefer to reduce species with more positive reduction potential. If E°(reduction) << E°(H₂O/H₂), water is reduced instead.\nAnode: prefer to oxidize species with smaller (less positive) oxidation potential. Cl⁻ is oxidized in preference to H₂O in concentrated NaCl (the chlor-alkali process).',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Industrial Applications of Electrolysis',
          body: 'Electroplating: coat a metal surface with another metal (e.g., silver plate on spoons). Object being plated = cathode; source metal = anode.\nChlorine production (chlor-alkali process): 2NaCl(aq) + 2H₂O → Cl₂(g) + H₂(g) + 2NaOH(aq).\nAluminum smelting (Hall-Héroult): Al₂O₃ dissolved in molten cryolite, electrolysed at cathode to give Al metal.',
        },
      ],
      mcqs: [
        {
          question: 'How many grams of copper are deposited by passing 2.00 A through a CuSO₄ solution for 60.0 minutes? (Cu: 63.55 g/mol, F = 96485 C/mol)',
          options: ['1.19 g', '2.38 g', '4.76 g', '0.596 g'],
          correct: 1,
          explanation: 'Charge = 2.00 A × (60.0 × 60 s) = 7200 C. Mol e⁻ = 7200 / 96485 = 0.0746 mol e⁻. Cu²⁺ + 2e⁻ → Cu, so mol Cu = 0.0746/2 = 0.0373 mol. Mass = 0.0373 × 63.55 = 2.37 ≈ 2.38 g.',
        },
        {
          question: 'In the electrolysis of molten NaCl, which product forms at the cathode?',
          options: ['Cl₂(g)', 'Na(l)', 'NaOH(aq)', 'H₂(g)'],
          correct: 1,
          explanation: 'Molten NaCl contains Na⁺ and Cl⁻. At the cathode (reduction): Na⁺ + e⁻ → Na(l). At the anode (oxidation): 2Cl⁻ → Cl₂(g) + 2e⁻. This is the Downs process for industrial production of sodium metal.',
        },
        {
          question: 'What current is needed to deposit 10.0 g of silver (Ag, 107.9 g/mol) in 2.00 hours? (F = 96485 C/mol, Ag⁺ + e⁻ → Ag)',
          options: ['0.124 A', '1.24 A', '2.49 A', '4.96 A'],
          correct: 1,
          explanation: 'Mol Ag = 10.0/107.9 = 0.0927 mol. Mol e⁻ = 0.0927 mol (1:1 ratio). Charge = 0.0927 × 96485 = 8945 C. Time = 2.00 h × 3600 s/h = 7200 s. Current = q/t = 8945/7200 = 1.24 A.',
        },
      ],
      flashcards: [
        { front: 'Faraday\'s constant', back: 'F = 96485 C/mol of electrons. The charge carried by one mole of electrons.' },
        { front: 'Electrolysis calculation steps', back: 'I × t → charge (C) → ÷F → mol e⁻ → ÷ (electrons per ion) → mol product → × molar mass → grams' },
        { front: 'In electrolysis, where does reduction occur?', back: 'At the cathode (same as galvanic cells: RED CAT). Cations are reduced to give the metal or hydrogen gas.' },
        { front: 'What is electroplating?', back: 'Depositing a thin layer of metal (e.g., Ag, Au, Cr) onto an object using electrolysis. The object = cathode; source metal = anode.' },
        { front: 'Chlor-alkali electrolysis products', back: 'Cathode: 2H₂O + 2e⁻ → H₂(g) + 2OH⁻. Anode: 2Cl⁻ → Cl₂(g) + 2e⁻. Overall produces Cl₂, H₂, and NaOH.' },
      ],
    },

  ],
}
