import type { EbookUnit } from '../types'

export const UNIT7: EbookUnit = {
  id: 'unit-7',
  number: 7,
  title: 'Equilibrium',
  examWeight: '7–9%',
  accentHex: '#22d3ee',
  concepts: [

    // ── Concept 1: Dynamic Equilibrium & Keq ─────────────────────────────────
    {
      id: 'u7-c1-keq',
      title: 'Dynamic Equilibrium & the Equilibrium Constant',
      subtitle: 'When forward and reverse rates are equal',
      estimatedMinutes: 12,
      accentHex: '#22d3ee',
      blocks: [
        {
          type: 'text',
          body: 'A reversible reaction reaches dynamic equilibrium when the forward and reverse reaction rates become equal — not when concentrations stop changing, but when the rates of formation and decomposition are balanced. The concentrations remain constant at equilibrium, but molecular-level activity continues in both directions.',
        },
        {
          type: 'formula',
          latex: 'K_c = \\frac{[C]^c[D]^d}{[A]^a[B]^b} \\quad \\text{for } aA + bB \\rightleftharpoons cC + dD',
          display: true,
          caption: 'Kc = equilibrium constant in terms of molar concentrations. Pure solids and pure liquids are omitted.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Kp vs. Kc for Gas-Phase Reactions',
          body: 'Kp uses partial pressures (atm) instead of molar concentrations. Related by:\nKp = Kc(RT)^Δn, where Δn = moles of gaseous products − moles of gaseous reactants\nIf Δn = 0: Kp = Kc. If Δn ≠ 0, they differ.',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Interpreting the Magnitude of K',
          body: 'K >> 1 (large): equilibrium lies to the RIGHT — mostly products at equilibrium. Reaction proceeds essentially to completion.\nK << 1 (small): equilibrium lies to the LEFT — mostly reactants at equilibrium. Reaction barely proceeds.\nK ≈ 1: significant amounts of both reactants and products at equilibrium.\nK is dimensionless (all concentrations in "standard" units, 1 M or 1 bar).',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Manipulating Equilibrium Expressions',
          body: 'Reversing a reaction: K_new = 1 / K_original.\nMultiplying by n: K_new = K_original^n.\nAdding two reactions: K_net = K₁ × K₂.\nThese rules allow Hess\'s Law-style K calculations.',
        },
        {
          type: 'simulation',
          title: 'Equilibrium Dynamic Simulation',
          description: 'Watch a reversible reaction approach equilibrium from either direction. Observe forward and reverse rate bars equalising. Adjust K by changing temperature and see concentrations shift.',
        },
      ],
      mcqs: [
        {
          question: 'For N₂(g) + 3H₂(g) ⇌ 2NH₃(g), Kc = 0.50 at a certain temperature. What is the value of Kc for ½N₂(g) + 3/2H₂(g) ⇌ NH₃(g)?',
          options: ['0.25', '0.50', '0.71', '1.41'],
          correct: 2,
          explanation: 'The new equation is the original multiplied by ½. K_new = K_original^(½) = (0.50)^(½) = √0.50 = 0.707 ≈ 0.71.',
        },
        {
          question: 'For the reaction PCl₅(g) ⇌ PCl₃(g) + Cl₂(g), Kc = 1.80 × 10⁻⁷ at 250°C. Which best describes the equilibrium position?',
          options: [
            'Mostly products; PCl₃ and Cl₂ predominate',
            'Mostly reactants; PCl₅ predominates',
            'Equal amounts of reactants and products',
            'Cannot determine without knowing initial concentrations',
          ],
          correct: 1,
          explanation: 'Kc = 1.80 × 10⁻⁷ << 1 → equilibrium lies strongly to the LEFT. Reactant PCl₅ predominates at equilibrium. Very little PCl₃ and Cl₂ are present.',
        },
        {
          question: 'Pure solids and pure liquids are excluded from the equilibrium expression because:',
          options: [
            'They don\'t participate in the reaction',
            'Their concentrations (activity) are defined as 1 by convention, as they are constant',
            'They are too large to affect equilibrium',
            'They only affect Kp, not Kc',
          ],
          correct: 1,
          explanation: 'The activity of a pure solid or pure liquid is defined as exactly 1 (it doesn\'t change during the reaction at fixed T and P). Including it would just multiply K by 1, which doesn\'t change K. By convention, they are omitted. Only dissolved species (aq) and gases (g) with variable concentrations appear in K.',
        },
      ],
      flashcards: [
        { front: 'What is dynamic equilibrium?', back: 'State where forward and reverse reaction rates are equal. Concentrations are constant but both reactions continue at equal rates.' },
        { front: 'What does K >> 1 mean?', back: 'Equilibrium lies to the right (products favoured). Reaction proceeds nearly to completion.' },
        { front: 'Kp and Kc relationship', back: 'Kp = Kc × (RT)^Δn, where Δn = moles gas products − moles gas reactants. R = 0.08206 L·atm/mol·K.' },
        { front: 'If reaction is reversed, what happens to K?', back: 'K_reversed = 1/K_original (K becomes its reciprocal)' },
        { front: 'Why are pure solids/liquids omitted from K?', back: 'Their activity is defined as 1 (constant). Only species with variable concentrations (aq, g) appear in K.' },
      ],
    },

    // ── Concept 2: ICE Tables & Calculating Equilibrium ──────────────────────
    {
      id: 'u7-c2-ice',
      title: 'ICE Tables & Equilibrium Calculations',
      subtitle: 'Systematic approach to finding equilibrium concentrations',
      estimatedMinutes: 12,
      accentHex: '#67e8f9',
      blocks: [
        {
          type: 'text',
          body: 'The ICE table (Initial, Change, Equilibrium) is the standard systematic method for calculating equilibrium concentrations. Set up the ICE table based on stoichiometry, express equilibrium concentrations in terms of x (the extent of reaction), substitute into the K expression, and solve for x.',
        },
        {
          type: 'list',
          variant: 'numbered',
          items: [
            'Write the balanced equation. Set up three rows: Initial (I), Change (C), Equilibrium (E).',
            'Fill in Initial concentrations from the problem.',
            'Assign Change: −ax for reactants, +cx for products (where a, c are stoichiometric coefficients). x is the amount reacted.',
            'Equilibrium = Initial + Change. Express each [species] in terms of x.',
            'Substitute into Kc = [products]^n / [reactants]^m and solve for x.',
            'Check: x must be positive and must not make any concentration negative. Verify by plugging back into K expression.',
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'The 5% Approximation',
          body: 'For small K values (K < 10⁻⁵), x << initial concentration. Approximate: (initial − x) ≈ initial. This simplifies the algebra from a quadratic to a linear equation. CHECK: x / [initial] × 100% < 5% validates the approximation. If ≥ 5%, use the quadratic formula.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'The Reaction Quotient Q — Which Way Does Equilibrium Shift?',
          body: 'Q has the same form as K but uses current (non-equilibrium) concentrations.\nQ < K: reaction must proceed FORWARD (toward products) to reach equilibrium.\nQ > K: reaction must proceed REVERSE (toward reactants) to reach equilibrium.\nQ = K: system is already at equilibrium.',
        },
        {
          type: 'formula',
          latex: 'Q_c = \\frac{[C]^c[D]^d}{[A]^a[B]^b} \\bigg|_{\\text{current conditions}}',
          display: true,
          caption: 'Compare Q to K to predict direction of shift. Same formula as Kc, but with current concentrations (not necessarily equilibrium).',
        },
      ],
      mcqs: [
        {
          question: 'For A(g) ⇌ B(g), Kc = 4.0. Starting with [A]₀ = 1.0 M and [B]₀ = 0, what is [B] at equilibrium?',
          options: ['0.25 M', '0.50 M', '0.80 M', '1.0 M'],
          correct: 2,
          explanation: 'ICE: I: [A]=1.0, [B]=0; C: [A]=−x, [B]=+x; E: [A]=(1.0−x), [B]=x. Kc = x/(1.0−x) = 4.0 → x = 4.0 − 4.0x → 5.0x = 4.0 → x = 0.80 M. [B] = 0.80 M, [A] = 0.20 M. Check: 0.80/0.20 = 4.0 ✓',
        },
        {
          question: 'At equilibrium, [A] = 0.60 M, [B] = 0.30 M, and [C] = 0.15 M for A(g) ⇌ B(g) + C(g). If [A] is suddenly increased to 1.20 M, what is Q compared to K?',
          options: [
            'Q > K; reaction shifts forward',
            'Q < K; reaction shifts forward',
            'Q > K; reaction shifts reverse',
            'Q = K; no shift',
          ],
          correct: 1,
          explanation: 'K = [B][C]/[A] = (0.30)(0.15)/0.60 = 0.075. After adding A: Q = (0.30)(0.15)/1.20 = 0.0375. Q (0.0375) < K (0.075) → reaction shifts FORWARD to produce more B and C.',
        },
        {
          question: 'For H₂(g) + I₂(g) ⇌ 2HI(g), Kc = 55.3 at 700 K. If [H₂] = [I₂] = 0.100 M and [HI] = 0.500 M, what is Q?',
          options: ['25.0', '55.3', '5.00', '0.0400'],
          correct: 0,
          explanation: 'Q = [HI]²/([H₂][I₂]) = (0.500)²/((0.100)(0.100)) = 0.250/0.0100 = 25.0. Since Q (25.0) < K (55.3), the reaction will shift forward (more HI will form).',
        },
      ],
      flashcards: [
        { front: 'What does Q < K mean?', back: 'The reaction quotient is less than K — the system is not at equilibrium and must shift forward (produce more products) to reach equilibrium.' },
        { front: 'ICE table acronym', back: 'I = Initial concentrations; C = Change (based on stoichiometry, expressed as ±x); E = Equilibrium (I + C, expressed in x)' },
        { front: 'When can you use the 5% approximation?', back: 'When K is very small (< 10⁻⁵) and [initial] >> x. Approximate (initial − x) ≈ initial. Verify: x/initial × 100% < 5%.' },
        { front: 'If Q > K, which direction does the reaction shift?', back: 'Reverse (toward reactants). Too many products relative to equilibrium — excess product is converted back to reactants.' },
      ],
    },

    // ── Concept 3: Le Chatelier\'s Principle ───────────────────────────────────
    {
      id: 'u7-c3-lechatelier',
      title: "Le Chatelier's Principle",
      subtitle: 'Predicting how equilibria respond to disturbances',
      estimatedMinutes: 10,
      accentHex: '#22d3ee',
      blocks: [
        {
          type: 'text',
          body: "Le Chatelier's Principle: when a system at equilibrium is subjected to a stress (disturbance), it responds by shifting in the direction that partially relieves that stress and restores a new equilibrium. The equilibrium position changes, but K itself changes only when temperature changes.",
        },
        {
          type: 'table',
          headers: ['Stress applied', 'System response (shift direction)', 'Effect on K'],
          rows: [
            ['Add reactant', 'Forward (→)', 'No change'],
            ['Remove reactant', 'Reverse (←)', 'No change'],
            ['Add product', 'Reverse (←)', 'No change'],
            ['Remove product', 'Forward (→)', 'No change'],
            ['Increase pressure (decrease V)', 'Toward fewer moles of gas', 'No change'],
            ['Decrease pressure (increase V)', 'Toward more moles of gas', 'No change'],
            ['Add inert gas (constant V)', 'No shift', 'No change'],
            ['Increase temperature', 'Toward endothermic direction', 'K changes'],
            ['Decrease temperature', 'Toward exothermic direction', 'K changes'],
            ['Add catalyst', 'No shift', 'No change (reaches eq. faster)'],
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Temperature Changes K — Everything Else Does Not',
          body: 'This is the most important exception: ONLY temperature changes the value of K. Concentration changes, pressure changes, and catalysts shift the equilibrium position (change concentrations) but K stays the same. For an exothermic reaction: increasing T shifts reverse → K decreases. For endothermic: increasing T shifts forward → K increases.',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Pressure Effects — Only Gases Count',
          body: 'Compare Δn_gas = moles gas products − moles gas reactants.\n• Δn_gas > 0: increasing pressure shifts REVERSE (toward fewer gas moles).\n• Δn_gas < 0: increasing pressure shifts FORWARD.\n• Δn_gas = 0: pressure change has no effect on equilibrium position.\nAdding an inert gas (He, Ar) at constant VOLUME has NO effect (partial pressures of reactive gases are unchanged).',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Industrial Significance: Haber Process',
          body: 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g) ΔH = −92 kJ (exothermic)\nHigh pressure (200 atm): shifts forward (fewer gas moles on product side → Δn_gas = −2). Increases yield.\nLow temperature: shifts forward (exothermic, cooling favours products) but rate is too slow.\nCompromise: ~450°C + iron catalyst (fast rate with reasonable yield). This is Le Chatelier\'s Principle in industrial practice.',
        },
      ],
      mcqs: [
        {
          question: 'For 2SO₂(g) + O₂(g) ⇌ 2SO₃(g), ΔH = −198 kJ, which change increases the yield of SO₃ at equilibrium?',
          options: [
            'Increase temperature',
            'Decrease pressure',
            'Add a catalyst',
            'Increase pressure',
          ],
          correct: 3,
          explanation: 'Higher pressure shifts toward fewer gas moles. Reactant side: 2 + 1 = 3 mol gas. Product side: 2 mol gas. Δn = 2 − 3 = −1. Increasing pressure shifts FORWARD → more SO₃. (Decreasing T also shifts forward for this exothermic reaction, but that\'s not listed. Catalyst doesn\'t affect yield.)',
        },
        {
          question: 'For an endothermic equilibrium reaction, what happens to K when temperature is increased?',
          options: ['K decreases', 'K increases', 'K stays the same', 'K becomes undefined'],
          correct: 1,
          explanation: 'For endothermic reactions, heat is a "reactant": A + B + heat ⇌ C + D. Increasing T adds more "heat reactant" → shifts FORWARD → more products → K increases. Only temperature changes K.',
        },
        {
          question: 'At equilibrium, which has NO effect on the equilibrium position?',
          options: [
            'Adding a reactant gas at constant volume',
            'Decreasing the volume (for a gas-phase reaction with Δn_gas ≠ 0)',
            'Adding an inert gas at constant volume',
            'Increasing temperature',
          ],
          correct: 2,
          explanation: 'Adding an inert gas at constant volume does not change the partial pressures of reactive gases — the system remains at equilibrium. If volume were increased (to accommodate the inert gas), then pressure would decrease and a shift would occur.',
        },
      ],
      flashcards: [
        { front: "Le Chatelier's Principle — one sentence", back: 'A system at equilibrium shifts to oppose any stress imposed on it, partially relieving the stress and establishing a new equilibrium.' },
        { front: 'What is the only factor that changes the value of K?', back: 'Temperature. Concentration changes, pressure changes, and catalysts shift equilibrium position but do NOT change K.' },
        { front: 'Effect of increasing pressure on N₂ + 3H₂ ⇌ 2NH₃', back: 'Shifts FORWARD. Reactants: 4 mol gas → Products: 2 mol gas. Δn_gas = −2. Higher pressure favours fewer gas moles (forward).' },
        { front: 'Effect of adding inert gas at constant volume', back: 'No effect on equilibrium position. Partial pressures of reactive species unchanged → Q unchanged → no shift.' },
      ],
    },

  ],
}
