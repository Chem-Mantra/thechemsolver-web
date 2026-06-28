import type { EbookUnit } from '../types'

export const UNIT5: EbookUnit = {
  id: 'unit-5',
  number: 5,
  title: 'Kinetics',
  examWeight: '7–9%',
  accentHex: '#a78bfa',
  concepts: [

    // ── Concept 1: Reaction Rates ─────────────────────────────────────────────
    {
      id: 'u5-c1-rates',
      title: 'Reaction Rates',
      subtitle: 'Measuring how fast reactions proceed',
      estimatedMinutes: 9,
      accentHex: '#a78bfa',
      blocks: [
        {
          type: 'text',
          body: 'The rate of a chemical reaction is the change in concentration of a reactant or product per unit time. Rates are always expressed as positive numbers — since reactant concentrations decrease, a negative sign converts the change to a positive rate. The stoichiometric coefficients ensure the rate is the same regardless of which species is monitored.',
        },
        {
          type: 'formula',
          latex: '\\text{Rate} = -\\frac{1}{a}\\frac{\\Delta[A]}{\\Delta t} = -\\frac{1}{b}\\frac{\\Delta[B]}{\\Delta t} = +\\frac{1}{c}\\frac{\\Delta[C]}{\\Delta t}',
          display: true,
          caption: 'For aA + bB → cC; rate is always positive; units are M/s or mol L⁻¹ s⁻¹',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Factors That Affect Reaction Rate',
          body: '1. Concentration — more collisions per unit time at higher [reactant]\n2. Temperature — higher T → more molecules have energy ≥ activation energy\n3. Surface area — more exposed area → more collision sites (heterogeneous reactions)\n4. Catalyst — lowers activation energy without being consumed\n5. Nature of reactants — some bonds break more easily than others',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Average vs. Instantaneous Rate',
          body: 'Average rate = Δ[conc] / Δt over a time interval (slope of secant line on concentration-time graph).\nInstantaneous rate = slope of the tangent line at a specific time point.\nThe initial rate (at t = 0) is the most reproducible and is used in rate law experiments.',
        },
      ],
      mcqs: [
        {
          question: 'For the reaction 2NO(g) + O₂(g) → 2NO₂(g), if [NO] decreases at a rate of 0.040 M/s, at what rate does [NO₂] increase?',
          options: ['0.020 M/s', '0.040 M/s', '0.080 M/s', '0.010 M/s'],
          correct: 1,
          explanation: 'From stoichiometry: rate of [NO] decrease / 2 = rate of [NO₂] increase / 2. Since coefficients are equal (both 2), rate of [NO₂] increase = rate of [NO] decrease = 0.040 M/s.',
        },
        {
          question: 'Which factor does NOT directly increase the rate of a homogeneous reaction?',
          options: ['Increasing temperature', 'Increasing reactant concentration', 'Adding a catalyst', 'Increasing surface area of reactants'],
          correct: 3,
          explanation: 'Surface area matters for heterogeneous reactions (solid reacting with liquid/gas). In a homogeneous reaction (all in same phase, e.g., all aqueous or all gaseous), there is no surface area variable — all particles are uniformly mixed. The other three factors directly affect homogeneous reaction rates.',
        },
        {
          question: 'At time t = 0 a reaction begins and [A] = 1.00 M. At t = 30 s, [A] = 0.76 M. What is the average rate of disappearance of A?',
          options: ['0.0080 M/s', '0.0025 M/s', '0.0053 M/s', '0.026 M/s'],
          correct: 0,
          explanation: 'Average rate = −Δ[A]/Δt = −(0.76 − 1.00)/(30 − 0) = −(−0.24)/30 = 0.0080 M/s.',
        },
      ],
      flashcards: [
        { front: 'What are the units of reaction rate?', back: 'Typically mol L⁻¹ s⁻¹ (M/s) for solution reactions, or mol L⁻¹ s⁻¹ for gas-phase reactions expressed in molarity' },
        { front: 'Why is a negative sign used in the rate expression for reactants?', back: 'Reactant concentrations decrease over time (Δ[A] is negative). The negative sign makes the rate a positive number.' },
        { front: 'Five factors affecting reaction rate', back: 'Concentration, temperature, surface area (heterogeneous), catalyst, and nature of reactants' },
        { front: 'Initial rate vs. average rate', back: 'Initial rate = instantaneous rate at t = 0 (tangent slope). Average rate = Δ[conc]/Δt over a time interval (secant slope).' },
      ],
    },

    // ── Concept 2: Rate Laws and Reaction Orders ──────────────────────────────
    {
      id: 'u5-c2-rate-laws',
      title: 'Rate Laws & Reaction Orders',
      subtitle: 'Experimental determination of kinetics',
      estimatedMinutes: 12,
      accentHex: '#c4b5fd',
      blocks: [
        {
          type: 'text',
          body: 'The rate law relates the reaction rate to reactant concentrations raised to empirical powers (orders). Rate laws are ALWAYS determined experimentally — they cannot be deduced from the balanced stoichiometric equation (which describes overall, not mechanism). The rate constant k has units that depend on the overall order.',
        },
        {
          type: 'formula',
          latex: '\\text{Rate} = k[A]^m[B]^n',
          display: true,
          caption: 'm = order in A, n = order in B, m+n = overall order, k = rate constant (temperature-dependent)',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Determining Orders from Initial Rate Data',
          body: 'Use the method of initial rates: compare two experiments where only [A] changes (hold [B] constant). The ratio of rates gives the order in A.\n(Rate₂/Rate₁) = ([A]₂/[A]₁)^m → solve for m.\nRepeat for each reactant. Then substitute any experiment\'s data into Rate = k[A]^m[B]^n to solve for k.',
        },
        {
          type: 'table',
          headers: ['Order', 'Rate law', 'Integrated form', 'Half-life', 'Units of k'],
          rows: [
            ['0 (zero)', 'Rate = k', '[A] = [A]₀ − kt', 't₁/₂ = [A]₀ / 2k', 'M s⁻¹'],
            ['1 (first)', 'Rate = k[A]', 'ln[A] = ln[A]₀ − kt', 't₁/₂ = 0.693/k', 's⁻¹'],
            ['2 (second)', 'Rate = k[A]²', '1/[A] = 1/[A]₀ + kt', 't₁/₂ = 1/(k[A]₀)', 'M⁻¹ s⁻¹'],
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Graphical Method to Identify Order',
          body: 'Plot three graphs from concentration-time data:\n[A] vs. t → straight line = zero order\nln[A] vs. t → straight line = first order\n1/[A] vs. t → straight line = second order\nSlope of the linear graph gives ±k (negative for zero/first; positive for second).',
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'Half-Life: Only First Order is Constant',
          body: 'First-order reactions have a constant half-life (t₁/₂ = 0.693/k) independent of initial concentration — the key property of radioactive decay. Second-order: half-life DOUBLES each successive half-life (depends on [A]₀). Zero-order: half-life DECREASES over time. Only first-order gives the characteristic exponential decay of radioactivity.',
        },
        {
          type: 'simulation',
          title: 'Kinetics Data Analyser',
          description: 'Input concentration-time data and watch the app auto-plot [A] vs. t, ln[A] vs. t, and 1/[A] vs. t. The straightest line identifies the reaction order and the slope gives k.',
        },
      ],
      mcqs: [
        {
          question: 'Using initial rates: when [A] doubles and [B] is constant, the rate quadruples. What is the order in A?',
          options: ['0', '1', '2', '4'],
          correct: 2,
          explanation: 'Rate₂/Rate₁ = ([A]₂/[A]₁)^m → 4 = (2)^m → m = 2. The reaction is second order in A.',
        },
        {
          question: 'A first-order reaction has k = 0.0231 s⁻¹. What is the half-life?',
          options: ['10 s', '20 s', '30 s', '43.3 s'],
          correct: 2,
          explanation: 't₁/₂ = 0.693 / k = 0.693 / 0.0231 = 30.0 s. For a first-order reaction, t₁/₂ is constant and independent of [A]₀.',
        },
        {
          question: 'A reaction is first order. After two half-lives, what fraction of the original reactant remains?',
          options: ['1/2', '1/4', '1/8', '1/3'],
          correct: 1,
          explanation: 'After 1 half-life: 1/2 remains. After 2 half-lives: (1/2)² = 1/4 remains. Each half-life reduces the amount by 50%. This exponential decay is the defining feature of first-order kinetics.',
        },
      ],
      flashcards: [
        { front: 'How is a rate law determined?', back: 'Experimentally, using initial rate data from multiple runs where each reactant is varied independently (method of initial rates). Cannot be deduced from stoichiometry.' },
        { front: 'Half-life of a first-order reaction', back: 't₁/₂ = 0.693 / k. Constant — independent of initial concentration. Radioactive decay is always first order.' },
        { front: 'Integrated rate law for first-order', back: 'ln[A] = ln[A]₀ − kt, or [A] = [A]₀ × e^(−kt). A plot of ln[A] vs. t is linear with slope = −k.' },
        { front: 'Units of k for a second-order reaction', back: 'M⁻¹ s⁻¹ (or L mol⁻¹ s⁻¹). Units of k depend on overall reaction order: k units = M^(1-n) s⁻¹ where n = overall order.' },
      ],
    },

    // ── Concept 3: Arrhenius & Activation Energy ──────────────────────────────
    {
      id: 'u5-c3-arrhenius',
      title: 'Arrhenius Equation & Activation Energy',
      subtitle: 'Temperature dependence of reaction rates',
      estimatedMinutes: 10,
      accentHex: '#a78bfa',
      blocks: [
        {
          type: 'text',
          body: 'The Arrhenius equation quantifies how the rate constant k changes with temperature. The key insight: only molecules with energy ≥ Ea (activation energy) at the moment of collision can react. As temperature increases, a larger fraction of molecules have sufficient energy — k increases exponentially.',
        },
        {
          type: 'formula',
          latex: 'k = A\\,e^{-E_a/RT}',
          display: true,
          caption: 'k = rate constant, A = frequency factor (pre-exponential factor), Eₐ = activation energy (J/mol), R = 8.314 J mol⁻¹ K⁻¹, T = temperature (K)',
        },
        {
          type: 'formula',
          latex: '\\ln\\frac{k_2}{k_1} = \\frac{E_a}{R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)',
          display: true,
          caption: 'Two-temperature form — use this when comparing k at two temperatures T₁ and T₂',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Interpreting Activation Energy Diagrams',
          body: 'An energy diagram (reaction coordinate diagram) shows:\n• Reactants on the left, products on the right\n• The transition state (activated complex) at the energy maximum — not a stable species, it\'s the top of the energy barrier\n• Eₐ(forward) = energy difference from reactants to peak\n• Eₐ(reverse) = energy difference from products to peak\n• ΔH = energy difference between reactants and products\n• Eₐ(forward) − Eₐ(reverse) = ΔH',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Catalysts Lower Activation Energy',
          body: 'A catalyst provides an alternative reaction pathway with a lower activation energy. On an energy diagram, the peak is shorter but the reactant and product energies are UNCHANGED (so ΔH is unchanged). A catalyst increases both forward and reverse rates equally (by the same factor). It does NOT shift equilibrium position — it only helps equilibrium be reached faster.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Rule of Thumb: Rate Doubles per 10°C',
          body: 'For a typical reaction with Eₐ ≈ 50 kJ/mol near room temperature, raising T by 10°C approximately doubles the rate. For higher Eₐ reactions, the doubling is larger. This is just an approximation — use the Arrhenius equation for exact calculations.',
        },
      ],
      mcqs: [
        {
          question: 'A reaction has k = 0.010 s⁻¹ at 300 K and k = 0.040 s⁻¹ at 320 K. Using the Arrhenius equation, the activation energy is closest to: (R = 8.314 J/mol·K)',
          options: ['25 kJ/mol', '55 kJ/mol', '75 kJ/mol', '100 kJ/mol'],
          correct: 1,
          explanation: 'ln(k₂/k₁) = (Eₐ/R)(1/T₁ − 1/T₂). ln(0.040/0.010) = ln(4) = 1.386. 1/300 − 1/320 = (320−300)/(300×320) = 20/96000 = 2.08×10⁻⁴ K⁻¹. Eₐ = 1.386 × 8.314 / 2.08×10⁻⁴ ≈ 55,500 J/mol ≈ 55 kJ/mol.',
        },
        {
          question: 'On an energy diagram, what does a catalyst do?',
          options: [
            'Raises the energy of products, making ΔH more negative',
            'Lowers the energy of reactants',
            'Lowers the activation energy without changing ΔH',
            'Shifts the equilibrium position toward products',
          ],
          correct: 2,
          explanation: 'A catalyst provides an alternative pathway with a lower Eₐ. The energies of reactants and products are unchanged → ΔH unchanged → equilibrium position unchanged. Both forward and reverse rates increase by the same factor — equilibrium is reached faster, but Keq is unaffected.',
        },
        {
          question: 'Which best describes the transition state in a reaction energy diagram?',
          options: [
            'A stable intermediate that can be isolated',
            'The energy minimum between reactants and products',
            'The highest-energy point on the reaction coordinate',
            'The activated complex that increases rate when temperature rises',
          ],
          correct: 2,
          explanation: 'The transition state (activated complex) is the maximum energy point on the reaction coordinate. It is not a stable species and cannot be isolated. The energy difference between reactants and the transition state is the activation energy (Eₐ).',
        },
      ],
      flashcards: [
        { front: 'Arrhenius equation', back: 'k = A·e^(−Eₐ/RT). k increases exponentially with temperature. ln(k) = ln(A) − Eₐ/RT → linear plot of ln(k) vs. 1/T gives slope = −Eₐ/R.' },
        { front: 'What is the activation energy (Eₐ)?', back: 'The minimum energy that colliding molecules must possess for a successful reaction. Higher Eₐ → more sensitive to temperature change.' },
        { front: 'How does a catalyst appear on an energy diagram?', back: 'Lower activation energy peak (alternative pathway), but same reactant and product energy levels → ΔH unchanged.' },
        { front: 'Does a catalyst shift equilibrium?', back: 'No — a catalyst speeds up both forward and reverse reactions equally. Keq is unchanged; equilibrium is reached faster.' },
      ],
    },

    // ── Concept 4: Reaction Mechanisms ───────────────────────────────────────
    {
      id: 'u5-c4-mechanisms',
      title: 'Reaction Mechanisms',
      subtitle: 'Elementary steps, intermediates, and rate-determining step',
      estimatedMinutes: 10,
      accentHex: '#c4b5fd',
      blocks: [
        {
          type: 'text',
          body: 'A reaction mechanism is a step-by-step sequence of elementary reactions (steps) that sum to the overall balanced equation. Each elementary step shows the actual collision event at the molecular level. Unlike overall reactions, the rate law for an elementary step can be written directly from its stoichiometry — molecularity equals order.',
        },
        {
          type: 'table',
          headers: ['Elementary step type', 'Example', 'Rate law from step', 'Notes'],
          rows: [
            ['Unimolecular', 'A → products', 'Rate = k[A]', '1st order; always 1st order'],
            ['Bimolecular', 'A + B → products', 'Rate = k[A][B]', '2nd order; most common'],
            ['Termolecular', 'A + B + C → products', 'Rate = k[A][B][C]', 'Rare; requires 3-body collision'],
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Rate-Determining Step and Intermediates',
          body: 'The slowest elementary step controls the overall reaction rate — it is the rate-determining step (RDS). The overall rate law equals the rate law of the RDS.\nA reaction intermediate is produced in one elementary step and consumed in a later step — it appears in the mechanism but NOT in the overall balanced equation.\nA catalyst is added before the reaction and regenerated at the end — it appears in the mechanism but NOT in the overall equation as a net reactant.',
        },
        {
          type: 'list',
          variant: 'numbered',
          items: [
            'Check that elementary steps sum to the overall balanced equation (add and cancel intermediates).',
            'Identify the slow (rate-determining) step.',
            'Write the rate law from the RDS using its stoichiometry.',
            'If an intermediate appears in the RDS rate law, substitute its concentration using the fast equilibrium step(s) before it.',
            'Verify the derived rate law matches experimental data.',
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Pre-Equilibrium Mechanism — Substituting Intermediates',
          body: 'If the RDS contains an intermediate [X], use the fast equilibrium step to express [X] in terms of reactants:\nFast: A + B ⇌ X (Keq = [X]/([A][B]) → [X] = Keq[A][B])\nSlow: X → products (Rate = k₂[X] = k₂Keq[A][B])\nOverall rate law: Rate = k_obs[A][B] where k_obs = k₂Keq.\nThis gives a second-order rate law matching experimental Rate = k[A][B].',
        },
      ],
      mcqs: [
        {
          question: 'For the mechanism: Step 1 (slow): NO + NO → N₂O₂; Step 2 (fast): N₂O₂ + O₂ → 2NO₂. What is the overall rate law?',
          options: ['Rate = k[NO]', 'Rate = k[NO]²', 'Rate = k[NO][O₂]', 'Rate = k[NO]²[O₂]'],
          correct: 1,
          explanation: 'The RDS (slow step) is Step 1: NO + NO → N₂O₂. Rate law from slow step = k[NO][NO] = k[NO]². The O₂ in Step 2 (fast step) does not appear in the rate law because the slow step determines the rate.',
        },
        {
          question: 'In the mechanism below, which species is the reaction intermediate? Step 1: A + B → C + D; Step 2: C → E',
          options: ['A', 'B', 'C', 'D'],
          correct: 2,
          explanation: 'Species C is produced in Step 1 and consumed in Step 2 — it does not appear in the overall equation (A + B → D + E). That makes C a reaction intermediate. D is a product; A and B are reactants.',
        },
        {
          question: 'The experimental rate law for a reaction is Rate = k[A][B]². A proposed mechanism has a fast equilibrium first step (A + B ⇌ X) followed by a slow step (X + B → products). Does this mechanism agree with the experimental rate law?',
          options: [
            'Yes — the slow step gives Rate = k[X][B] = k·Keq[A][B][B] = k[A][B]²',
            'No — the slow step gives Rate = k[X][B]² = k[A][B]³',
            'No — the fast step determines the rate',
            'Yes — the fast step gives Rate = k[A][B]',
          ],
          correct: 0,
          explanation: 'From the fast equilibrium: Keq = [X]/([A][B]) → [X] = Keq[A][B]. RDS rate: Rate = k₂[X][B] = k₂·Keq[A][B][B] = k_obs[A][B]². This matches the experimental rate law — the mechanism is consistent.',
        },
      ],
      flashcards: [
        { front: 'What is a reaction intermediate?', back: 'A species formed in one elementary step and consumed in a later step. It does not appear in the overall balanced equation.' },
        { front: 'What is the rate-determining step?', back: 'The slowest elementary step in a mechanism. The overall rate law equals the rate law derived from this step.' },
        { front: 'What is molecularity?', back: 'The number of molecules that collide in a single elementary step (1 = unimolecular, 2 = bimolecular, 3 = termolecular).' },
        { front: 'How do you check if a mechanism is valid?', back: '(1) Elementary steps must sum to the overall equation. (2) Rate law derived from RDS must match the experimentally determined rate law.' },
      ],
    },

  ],
}
