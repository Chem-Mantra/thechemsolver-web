import type { AdvChapter } from '../types'

export const CH04: AdvChapter = {
  id: 'ch04',
  number: 4,
  title: 'Advanced Equilibrium',
  examRelevance: 'Jumps from 3.3% (USNCO Local) to 8.3% (USNCO National) — same topic, deeper questions',
  accentHex: '#f59e0b',
  concepts: [

    // ── Concept 1: The Reaction Quotient–Thermodynamics Bridge ──────────────────
    {
      id: 'ch04-c1-q-thermodynamics-bridge',
      title: 'The Reaction Quotient–Thermodynamics Bridge',
      subtitle: 'Where ΔG° = −RT ln K actually comes from',
      estimatedMinutes: 12,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'AP-level equilibrium treats Q vs. K as a direction-prediction tool: Q < K means forward, Q > K means reverse, Q = K means equilibrium. What that comparison is actually built on is a single thermodynamic equation connecting the non-standard free energy of a reaction to how far it currently sits from equilibrium.',
        },
        {
          type: 'formula',
          latex: '\\Delta G = \\Delta G^\\circ + RT\\ln Q',
          display: true,
          caption: 'The reaction isotherm — ΔG at any instant, in terms of the standard free energy and current reaction quotient',
        },
        {
          type: 'text',
          body: 'At true equilibrium, ΔG = 0 and Q = K by definition, which collapses the isotherm equation into the famous relationship linking a reaction\'s inherent thermodynamic favorability directly to its equilibrium constant.',
        },
        {
          type: 'formula',
          latex: '\\Delta G^\\circ = -RT\\ln K',
          display: true,
          caption: 'A large positive K (product-favored) corresponds to a large negative ΔG°, and vice versa',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: "Don't Confuse ΔG with ΔG°",
          body: 'ΔG° is a fixed number for a reaction at a given temperature — it never changes regardless of the current mixture composition. ΔG is the instantaneous, composition-dependent quantity that actually determines which direction the reaction proceeds right now. A reaction with ΔG° > 0 can still have ΔG < 0 (and run forward) if Q is small enough that RT ln Q is very negative.',
        },
      ],
      mcqs: [
        {
          question: 'A reaction has ΔG° = +20 kJ/mol at 298 K, but the current reaction mixture gives Q = 1×10⁻⁶. Which correctly describes the situation?',
          options: [
            'The reaction cannot proceed forward since ΔG° > 0',
            'ΔG could still be negative, since RT ln Q is strongly negative for such a small Q, potentially outweighing the positive ΔG°',
            'ΔG° and ΔG are always equal, so the reaction is non-spontaneous',
            'Q has no effect on whether the reaction proceeds',
          ],
          correct: 1,
          explanation: 'ΔG = ΔG° + RT ln Q. With Q extremely small, ln Q is a large negative number, so RT ln Q can be very negative — enough to make the overall ΔG negative and drive the reaction forward, even though ΔG° itself is positive.',
        },
      ],
      flashcards: [
        { front: 'Reaction isotherm equation', back: 'ΔG = ΔG° + RT ln Q' },
        { front: 'What happens to the isotherm equation at equilibrium?', back: 'ΔG = 0 and Q = K, giving ΔG° = −RT ln K.' },
        { front: 'ΔG vs. ΔG° — the key distinction', back: 'ΔG° is fixed for a reaction at a given T. ΔG depends on the current composition (via Q) and determines the actual direction right now.' },
      ],
    },

    // ── Concept 2: Degree of Dissociation from Vapor Density Data ───────────────
    {
      id: 'ch04-c2-degree-of-dissociation',
      title: 'Degree of Dissociation from Vapor Density Data',
      subtitle: 'A quantitative technique for gas-phase dissociation equilibria',
      estimatedMinutes: 12,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'When a gas partially dissociates (e.g. PCl₅ ⇌ PCl₃ + Cl₂), the total number of gas particles increases, and the average molar mass of the mixture drops below that of the pure, undissociated reactant. This measurable drop is the basis for determining the degree of dissociation experimentally — without needing to measure any concentration directly.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Vapor Density Connects Directly to Molar Mass',
          body: 'For an ideal gas, molar mass = 2 × vapor density. The theoretical vapor density D corresponds to the pure, undissociated reactant; the observed vapor density d corresponds to the actual equilibrium mixture. Since dissociation always increases particle count, d ≤ D always.',
        },
        {
          type: 'formula',
          latex: '\\alpha = \\dfrac{D - d}{(n-1)d} = \\dfrac{M_{th} - M_{obs}}{(n-1)M_{obs}}',
          display: true,
          caption: 'Degree of dissociation from vapor density (D, d) or molar mass (Mth, Mobs); n = total moles of product formed per mole of reactant',
        },
        {
          type: 'text',
          body: 'The factor n is the sum of product stoichiometric coefficients, scaled to exactly one mole of reactant. For PCl₅ ⇌ PCl₃ + Cl₂, one mole of reactant produces two moles of product gas total, so n = 2. Getting n wrong — forgetting to scale to one mole of reactant, or mixing up numerator and denominator — is the most common way this calculation goes wrong.',
        },
      ],
      mcqs: [
        {
          question: 'N₂O₄ (M = 92 g/mol) partially dissociates into 2NO₂. The observed molar mass of the equilibrium mixture is 70 g/mol. What is the degree of dissociation?',
          options: ['0.24', '0.31', '0.46', '0.63'],
          correct: 1,
          explanation: 'n = 2 (one mole N₂O₄ gives 2 moles NO₂). α = (Mth − Mobs)/((n−1)×Mobs) = (92−70)/(1×70) = 22/70 ≈ 0.31.',
        },
      ],
      flashcards: [
        { front: 'Vapor density degree-of-dissociation formula', back: 'α = (D − d) / [(n−1)d], where D = theoretical, d = observed vapor density.' },
        { front: 'Why does observed vapor density drop upon dissociation?', back: 'Dissociation increases the total number of gas particles, lowering the mixture\'s average molar mass (and therefore its vapor density).' },
        { front: "What is 'n' in the degree-of-dissociation formula?", back: 'Total moles of product formed per one mole of reactant dissociating.' },
      ],
    },

    // ── Concept 3: Simultaneous Equilibria — Shared-Ion Solubility ──────────────
    {
      id: 'ch04-c3-simultaneous-equilibria',
      title: 'Simultaneous Equilibria: Shared-Ion Solubility & Complex Ions',
      subtitle: 'What happens when two equilibria compete for the same ion',
      estimatedMinutes: 13,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'Real solubility problems rarely involve just one salt in isolation. IChO and USNCO National problems frequently combine two sparingly-soluble salts sharing a common ion, or add a ligand that pulls a metal ion out of solution as a complex — both scenarios require solving two equilibria simultaneously rather than treating solubility as a single independent Ksp expression.',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Two Salts Sharing a Common Ion',
          body: 'Dissolve solid AgCl and solid AgI together in the same water. Let x and y be their respective solubilities. Both contribute Ag⁺ to a single shared pool, so [Ag⁺]total = x + y, while [Cl⁻] = x and [I⁻] = y independently. This gives Ksp(AgCl) = (x+y)x and Ksp(AgI) = (x+y)y — two simultaneous equations. Dividing them eliminates the shared (x+y) term: x/y = Ksp(AgCl)/Ksp(AgI).',
        },
        {
          type: 'text',
          body: 'When the two Ksp values differ by several orders of magnitude, the more soluble salt effectively dominates and supplies nearly all of the common ion — suppressing the less soluble salt\'s dissolution even further than its Ksp alone would predict, in the same spirit as the common-ion effect from acid-base equilibria.',
        },
        {
          type: 'text',
          body: 'Complex ion formation works in the opposite direction: adding a ligand (like NH₃ to Ag⁺, forming [Ag(NH₃)₂]⁺) removes free metal ion from solution, which by Le Chatelier\'s principle pulls the original dissolution equilibrium forward — dramatically increasing a salt\'s effective solubility. Solving these problems requires combining the Ksp expression with the complex-ion formation constant Kf, and being careful with stoichiometry — two ligands are consumed per complex ion formed in this example, so the ligand term is squared.',
        },
        {
          type: 'formula',
          latex: 'K_{overall} = K_{sp} \\times K_f = \\dfrac{[\\text{complex}]}{[\\text{ligand}]^n}',
          display: true,
          caption: 'Combining solubility and complex-ion formation into one overall equilibrium constant, n = ligands per complex ion',
        },
      ],
      mcqs: [
        {
          question: 'Solid AgCl (Ksp = 1.8×10⁻¹⁰) and solid AgI (Ksp = 8.5×10⁻¹⁷) are both added to pure water until each reaches its own solubility equilibrium, sharing a common Ag⁺ pool. Which statement is correct?',
          options: [
            'The solubility of AgI is completely unaffected by the presence of AgCl',
            'AgCl, being far more soluble, dominates the Ag⁺ pool and suppresses AgI\'s solubility below what it would be alone',
            'Both salts contribute exactly equal amounts of Ag⁺',
            'Neither salt can dissolve at all once the other is present',
          ],
          correct: 1,
          explanation: 'Since Ksp(AgCl) ≫ Ksp(AgI), AgCl supplies the overwhelming majority of the shared Ag⁺ pool, which — via the common-ion effect — suppresses AgI\'s solubility even further than it would be in pure water alone.',
        },
      ],
      flashcards: [
        { front: 'Two salts sharing a common ion: key relationship', back: 'x/y = Ksp(salt 1)/Ksp(salt 2), derived by dividing the two simultaneous Ksp expressions.' },
        { front: 'Why does complex-ion formation increase solubility?', back: 'Removing free metal ion (as a complex) shifts the original dissolution equilibrium forward by Le Chatelier\'s principle.' },
        { front: 'Combining Ksp and Kf', back: 'Koverall = Ksp × Kf — links the solid-dissolution equilibrium to the complex-formation equilibrium.' },
      ],
    },

  ],
}
