import type { AdvChapter } from '../types'

export const CH02: AdvChapter = {
  id: 'ch02',
  number: 2,
  title: 'Advanced Kinetics',
  examRelevance: 'Highest-frequency topic overall — 10-22% across every USNCO/IChO source',
  accentHex: '#f59e0b',
  concepts: [

    // ── Concept 1: Determining Reaction Order Experimentally ───────────────────
    {
      id: 'ch02-c1-determining-order',
      title: 'Determining Reaction Order Experimentally',
      subtitle: 'Four methods for turning raw lab data into a rate law',
      estimatedMinutes: 15,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'Reaction order can never be read off a balanced equation — it is a purely experimental quantity, determined only from how measured rate or concentration actually behaves. USNCO and IChO problems routinely hand you a data table and expect you to pick the right extraction method rather than being told the rate law outright.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'The Initial Rate Method',
          body: 'Run the reaction multiple times, changing the initial concentration of one reactant while holding all others fixed. For Rate = k[A]ˣ[B]ʸ, comparing two trials where only [A] changes isolates x: r₁/r₂ = ([A]₁/[A]₂)ˣ. If [B] alone changes between two other trials, the same ratio isolates y. If changing a reactant\'s concentration produces zero change in rate, its order is 0 — no algebra required.',
        },
        {
          type: 'table',
          headers: ['Order n', 'Half-life relationship', 'Straight-line plot'],
          rows: [
            ['0', 't₁/₂ ∝ [A]₀ (directly proportional)', '[A] vs. t'],
            ['1', 't₁/₂ independent of [A]₀', 'ln[A] vs. t'],
            ['2', 't₁/₂ ∝ 1/[A]₀ (inversely proportional)', '1/[A] vs. t'],
          ],
        },
        {
          type: 'text',
          body: 'When two trials at different starting concentrations give different half-lives, the order can be extracted directly: n = 1 + log(t₁/t₂)/log(a₂/a₁). Notice the ratios don\'t match — it\'s t₁/t₂ but a₂/a₁ — reversing them is the single most common way to get a sign error here.',
        },
        {
          type: 'formula',
          latex: 'n = \\dfrac{\\log(r_1/r_2)}{\\log(c_1/c_2)}',
          display: true,
          caption: 'Van\'t Hoff differential method — plot log(rate) vs. log(concentration); the slope is the order directly, even for fractional or negative orders',
        },
      ],
      mcqs: [
        {
          question: 'In two trials of a reaction, doubling [A] (with [B] held constant) causes the rate to increase 4-fold. What is the order with respect to A?',
          options: ['0', '1', '2', '4'],
          correct: 2,
          explanation: 'r₁/r₂ = ([A]₁/[A]₂)ˣ → 4 = 2ˣ → x = 2.',
        },
        {
          question: 'A reaction has a half-life of 20 min at [A]₀ = 0.40 M and a half-life of 40 min at [A]₀ = 0.20 M. What is the reaction order?',
          options: ['Zero order', 'First order', 'Second order', 'Cannot be determined from this data'],
          correct: 2,
          explanation: 'Half-life doubles when concentration is halved — an inverse relationship between t₁/₂ and [A]₀, which is the signature of second order (t₁/₂ ∝ 1/[A]₀).',
        },
      ],
      flashcards: [
        { front: 'Initial rate method: what must be held constant?', back: 'All reactant concentrations except the one whose order you are isolating.' },
        { front: 'Half-life vs. order (0, 1, 2)', back: 'Zero: t½ ∝ a. First: t½ independent of a. Second: t½ ∝ 1/a.' },
        { front: "Van't Hoff differential method formula", back: 'n = log(r₁/r₂) ÷ log(c₁/c₂) — slope of log(rate) vs. log(concentration).' },
      ],
    },

    // ── Concept 2: Complex Kinetics I — Parallel & Consecutive Reactions ────────
    {
      id: 'ch02-c2-parallel-consecutive',
      title: 'Parallel & Consecutive Reactions',
      subtitle: 'What happens when a reactant has more than one path forward',
      estimatedMinutes: 15,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'Real mechanisms rarely proceed as a single clean step. Two patterns dominate advanced kinetics problems: parallel (side) reactions, where one reactant branches into multiple products simultaneously, and consecutive (sequential) reactions, where a reactant passes through an unstable intermediate before reaching the final product.',
        },
        {
          type: 'text',
          body: 'For A branching into B (rate constant k₁) and C (rate constant k₂), A is consumed by both paths at once, so its effective decay is first-order overall with a combined rate constant: -d[A]/dt = (k₁ + k₂)[A]. This means A\'s true half-life is always shorter than either branch would predict alone — it is being destroyed from two directions at the same time.',
        },
        {
          type: 'formula',
          latex: '[A]_t = [A]_0 e^{-(k_1+k_2)t}, \\qquad \\dfrac{[B]}{[C]} = \\dfrac{k_1}{k_2}, \\qquad \\%\\,B = \\dfrac{k_1}{k_1+k_2}\\times 100',
          display: true,
          caption: 'Parallel reactions: overall decay, and the product ratio — fixed for the entire reaction, from t=0 to completion',
        },
        {
          type: 'text',
          body: 'Consecutive reactions (A → B → C) behave completely differently: A decays as a simple exponential, C rises in an S-shaped curve after an induction period, and the intermediate B is the interesting part — it rises from zero, passes through a maximum, then falls back to zero as it\'s converted onward. That peak occurs exactly when B\'s formation rate equals its destruction rate.',
        },
        {
          type: 'formula',
          latex: 't_{max} = \\dfrac{\\ln(k_1/k_2)}{k_1 - k_2}',
          display: true,
          caption: 'Time at which the intermediate B reaches its maximum concentration in A → B → C',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'The k₁ = k₂ Special Case',
          body: 'If k₁ exactly equals k₂, the tmax formula becomes 0/0 — undefined. Taking the limit (L\'Hôpital\'s rule) gives the clean result tmax = 1/k, at which point [B]max = [A]₀/e. This edge case appears often specifically because it trips up the direct-substitution approach.',
        },
      ],
      mcqs: [
        {
          question: 'A decomposes via parallel first-order paths with k₁ = 2.0 × 10⁻⁴ s⁻¹ (→B) and k₂ = 6.0 × 10⁻⁴ s⁻¹ (→C). What percent of A converts to B?',
          options: ['25%', '33%', '67%', '75%'],
          correct: 0,
          explanation: '%B = k₁/(k₁+k₂) × 100 = 2.0/(2.0+6.0) × 100 = 25%.',
        },
      ],
      flashcards: [
        { front: 'Parallel reactions: overall rate constant', back: 'k_overall = k₁ + k₂ — always faster (shorter half-life) than either branch alone.' },
        { front: 'Parallel reactions: product ratio', back: '[B]/[C] = k₁/k₂, constant throughout the entire reaction.' },
        { front: 'Consecutive reactions: intermediate concentration profile', back: 'Rises from 0, peaks at tmax = ln(k₁/k₂)/(k₁−k₂), then decays back to 0.' },
      ],
    },

    // ── Concept 3: Reversible Reactions & the Kinetics–Thermodynamics Link ──────
    {
      id: 'ch02-c3-reversible-reactions',
      title: 'Reversible Reactions & the Kinetics–Thermodynamics Link',
      subtitle: 'How Keq falls directly out of forward and reverse rate constants',
      estimatedMinutes: 12,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'An opposing reaction A ⇌ B never reaches 100% completion — as soon as B forms, it starts converting back to A. The net rate is the forward rate minus the reverse rate: net rate = kf[A] − kb[B]. At equilibrium, the net rate is exactly zero, which means the forward and reverse rates are equal, not that either has stopped.',
        },
        {
          type: 'formula',
          latex: 'K_{eq} = \\dfrac{[B]_{eq}}{[A]_{eq}} = \\dfrac{k_f}{k_b}',
          display: true,
          caption: 'The equilibrium constant is simply the ratio of forward to reverse rate constants',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Why a Catalyst Never Shifts Keq',
          body: 'A catalyst speeds up both the forward and reverse steps by the exact same factor, since it lowers the activation energy of both directions equally. Because Keq = kf/kb, multiplying both by the same number leaves the ratio — and therefore the equilibrium position — completely unchanged. A catalyst gets you to equilibrium faster; it never moves where equilibrium sits.',
        },
        {
          type: 'text',
          body: 'For a first-order opposing reaction starting with pure A, the system approaches equilibrium exponentially, and the rate of approach depends on the sum of the two rate constants, not just the forward one: (kf + kb) = (1/t)ln[xeq/(xeq − x)], where x is how much product has formed by time t and xeq is the final equilibrium amount.',
        },
      ],
      mcqs: [
        {
          question: 'A catalyst increases both kf and kb of a reversible reaction by a factor of 500. What happens to Keq?',
          options: ['Increases by a factor of 500', 'Decreases by a factor of 500', 'Stays exactly the same', 'Increases by a factor of 250,000'],
          correct: 2,
          explanation: 'Keq = kf/kb. Multiplying both by the same factor leaves the ratio, and therefore Keq, unchanged — a catalyst affects rate, not equilibrium position.',
        },
      ],
      flashcards: [
        { front: 'Keq in terms of rate constants', back: 'Keq = kf/kb for an elementary reversible reaction.' },
        { front: 'Why doesn\'t a catalyst shift equilibrium?', back: 'It speeds up forward and reverse rates equally, so kf/kb (= Keq) is unchanged.' },
        { front: 'Rate of approach to equilibrium depends on...', back: 'The sum (kf + kb), not just the forward rate constant.' },
      ],
    },

    // ── Concept 4: Reaction Mechanisms — RDS & Pre-Equilibrium ──────────────────
    {
      id: 'ch02-c4-mechanisms-rds',
      title: 'Reaction Mechanisms: Rate-Determining Step & Pre-Equilibrium',
      subtitle: 'Deriving a rate law from a proposed multi-step mechanism',
      estimatedMinutes: 14,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'Most reactions proceed through a sequence of elementary steps — the reaction mechanism — and the overall rate is bottlenecked by whichever step is slowest: the rate-determining step (RDS). Just as a chain is only as strong as its weakest link, a multi-step reaction is only as fast as its slowest step, and the overall rate law is built from that step\'s reactants and stoichiometry.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Intermediates Cannot Appear in the Final Rate Law',
          body: 'If the RDS involves a species that isn\'t one of the overall reactants (an intermediate formed in an earlier step), it must be eliminated algebraically before the rate law is considered complete — a rate law expressed in terms of an unmeasurable intermediate isn\'t useful or verifiable.',
        },
        {
          type: 'text',
          body: 'The pre-equilibrium approximation handles this when the RDS is preceded by a fast, reversible step. Because that earlier step reaches equilibrium quickly relative to the slow step, its equilibrium constant lets you substitute the intermediate\'s concentration in terms of the actual reactants: [intermediate] = Keq × [reactants of the fast step]. The resulting effective rate constant is typically a product like keff = kslow × Keq.',
        },
        {
          type: 'text',
          body: 'This directly explains why algebraically combined rate constants translate into algebraically combined activation energies: since k = Ae^(−Ea/RT), multiplying rate constants adds their Ea values, dividing subtracts them, and raising to a power multiplies Ea by that power. A fast pre-equilibrium step\'s "activation energy" contribution is really its forward-minus-reverse difference — which is just ΔH for that step.',
        },
        {
          type: 'table',
          headers: ['k operation', 'Corresponding Ea operation'],
          rows: [
            ['k₁ × k₂', 'Ea1 + Ea2'],
            ['k₁ / k₂', 'Ea1 − Ea2'],
            ['k₁ⁿ', 'n × Ea1'],
          ],
        },
      ],
      mcqs: [
        {
          question: 'A proposed mechanism has an effective rate constant keff = k₁(k₂/k₃)^(1/2). If Ea1 = 40, Ea2 = 60, Ea3 = 20 (all kJ/mol), what is Ea(eff)?',
          options: ['60 kJ/mol', '70 kJ/mol', '50 kJ/mol', '100 kJ/mol'],
          correct: 0,
          explanation: 'keff = k₁ × k₂^(1/2) × k₃^(−1/2), so multiplication becomes addition and the square roots become ½-multipliers: Ea(eff) = Ea1 + ½Ea2 − ½Ea3 = 40 + 30 − 10 = 60 kJ/mol.',
        },
      ],
      flashcards: [
        { front: 'Rate-determining step (RDS)', back: 'The slowest elementary step in a mechanism — it controls the overall rate and rate law.' },
        { front: 'When to use pre-equilibrium approximation', back: 'When the RDS is preceded by a fast, reversible step — substitute the intermediate using that step\'s Keq.' },
        { front: 'Rule: k₁ × k₂ in terms of Ea', back: 'Multiplication of rate constants → addition of activation energies.' },
      ],
    },

    // ── Concept 5: The Steady-State Approximation ───────────────────────────────
    {
      id: 'ch02-c5-steady-state',
      title: 'The Steady-State Approximation',
      subtitle: 'Solving mechanisms with a highly reactive intermediate that never builds up',
      estimatedMinutes: 13,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'The steady-state approximation (SSA) is the mirror image of the pre-equilibrium method: it applies when an intermediate is consumed almost as fast as it forms, so it never accumulates to a meaningful concentration. Because its concentration stays vanishingly small and roughly constant through the bulk of the reaction, its rate of change can be set to zero — even though it is not actually at equilibrium.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Pre-Equilibrium vs. Steady-State: Don\'t Mix Them Up',
          body: 'Pre-equilibrium applies when the intermediate\'s formation is much faster than its consumption (kformation ≫ kconsumption) — it has time to reach a genuine equilibrium. Steady-state applies in the opposite regime (kconsumption ≫ kformation) — the intermediate is destroyed almost instantly, never truly at equilibrium, but small and constant enough that d[I]/dt ≈ 0 is still a valid approximation.',
        },
        {
          type: 'list',
          variant: 'numbered',
          items: [
            'Write the full differential rate equation for the intermediate I, accounting for every step that forms it and every step that consumes it.',
            'Set that expression equal to zero: d[I]/dt = (rate of formation) − (rate of consumption) = 0.',
            'Solve this algebraic equation for [I] in terms of the actual reactant concentrations.',
            'Substitute this expression for [I] into the rate law for the final product to eliminate the unmeasurable intermediate.',
          ],
        },
        {
          type: 'text',
          body: 'A simple case: in A → B → C where the second step is far faster than the first (k₂ ≫ k₁), B is consumed almost as soon as it forms. Setting d[B]/dt ≈ 0 gives k₁[A] ≈ k₂[B], so [B] ≈ (k₁/k₂)[A] — small, and directly tied to [A] rather than accumulating independently.',
        },
      ],
      mcqs: [
        {
          question: 'The steady-state approximation is most appropriate when:',
          options: [
            'The intermediate is very stable and accumulates to high concentration',
            'The intermediate is highly reactive and consumed almost as fast as it forms',
            'The reaction has only one elementary step',
            'The reaction is at true thermodynamic equilibrium throughout',
          ],
          correct: 1,
          explanation: 'SSA assumes the intermediate never accumulates because its consumption rate is comparable to or greater than its formation rate — the opposite scenario from pre-equilibrium.',
        },
      ],
      flashcards: [
        { front: 'Steady-state approximation: core assumption', back: 'd[intermediate]/dt ≈ 0 — because the intermediate is consumed almost as fast as it forms.' },
        { front: 'SSA vs. pre-equilibrium: which applies when?', back: 'SSA: kconsumption ≫ kformation. Pre-equilibrium: kformation ≫ kconsumption.' },
      ],
    },

    // ── Concept 6: Pseudo-First-Order Reactions ─────────────────────────────────
    {
      id: 'ch02-c6-pseudo-first-order',
      title: 'Pseudo-First-Order Reactions',
      subtitle: 'When a second-order reaction behaves like a first-order one',
      estimatedMinutes: 10,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'A reaction can be truly bimolecular (rate = k[A][B]) yet experimentally follow first-order kinetics. This happens whenever one reactant — typically the solvent — is present in such overwhelming excess that its concentration barely changes over the course of the reaction. Its (nearly constant) concentration merges into the rate constant to form a pseudo-rate constant k′ = k[B]excess, giving rate = k′[A].',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Two Classic Examples',
          body: 'Acid-catalyzed ester hydrolysis (ethyl acetate + water → acetic acid + ethanol) is pseudo-first-order because water, the solvent, is present at roughly 55.5 M — vastly more than the ester. Acid-catalyzed inversion of sucrose into glucose and fructose is pseudo-first-order for the same reason, and is classically monitored with a polarimeter since sucrose, glucose, and fructose rotate polarized light differently.',
        },
        {
          type: 'text',
          body: 'The molecularity/order mismatch is the defining signature: a molecularity of 2 (two species colliding) paired with an experimentally observed order of 1. Note this only holds for the acid-catalyzed (excess water) case — base-catalyzed ester hydrolysis (saponification) is genuinely second order, because hydroxide is consumed stoichiometrically and is not present in overwhelming excess.',
        },
      ],
      mcqs: [
        {
          question: 'Why is acid-catalyzed hydrolysis of an ester pseudo-first-order, while base-catalyzed hydrolysis (saponification) of the same ester is genuinely second order?',
          options: [
            'Acids react faster than bases in general',
            'Water (the "second" reactant in acid catalysis) is in vast excess and stays essentially constant; hydroxide in saponification is consumed and not in excess',
            'Esters cannot undergo second-order kinetics',
            'The two reactions have completely different products',
          ],
          correct: 1,
          explanation: 'The distinguishing feature is not the catalyst\'s identity but whether the second reactant is present in overwhelming, effectively-constant excess (water) or is stoichiometrically consumed (hydroxide).',
        },
      ],
      flashcards: [
        { front: 'Pseudo-first-order signature', back: 'True molecularity = 2, but experimentally observed order = 1 — caused by one reactant being in vast excess.' },
        { front: 'Two classic pseudo-first-order reactions', back: 'Acid-catalyzed ester hydrolysis; acid-catalyzed inversion of sucrose (both use water in vast excess).' },
      ],
    },

    // ── Concept 7: Collision Theory & Beyond the Basic Arrhenius Equation ───────
    {
      id: 'ch02-c7-collision-theory-arrhenius',
      title: 'Collision Theory & Beyond the Basic Arrhenius Equation',
      subtitle: 'What actually makes a collision "effective," and the Arrhenius toolkit exam problems expect',
      estimatedMinutes: 14,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'Collision theory explains why not every molecular collision leads to a reaction — of the roughly 10²⁵–10²⁸ collisions occurring per cm³ per second in a typical reaction vessel, only a tiny fraction are "effective." An effective collision requires two things simultaneously: sufficient kinetic energy to reach the threshold energy ET, and correct spatial orientation for the reacting orbitals to overlap.',
        },
        {
          type: 'formula',
          latex: '\\text{Rate} = P \\cdot Z_{AB} \\cdot e^{-E_a/RT}',
          display: true,
          caption: 'Collision theory master equation: steric factor P, collision frequency Z, and the Boltzmann factor — matches Arrhenius\'s A with P × Z',
        },
        {
          type: 'text',
          body: 'The steric (probability) factor P captures how much orientation matters: for simple, symmetric species P is close to 1, but for large, geometrically fussy organic molecules P can be as small as 10⁻⁵. This is exactly why comparing measured pre-exponential factors A to theoretical collision frequencies Z can reveal how "picky" a reaction is about molecular orientation.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'The Temperature Coefficient — A Quick Estimate',
          body: 'For most reactions, the rate roughly doubles to triples for every 10°C rise — formalized as the temperature coefficient μ = k(T+10)/kT. For a larger jump, rate₂/rate₁ = μ^(ΔT/10). This is only a rule of thumb (assume μ = 2 if not given), but it\'s a fast way to sanity-check an Arrhenius calculation.',
        },
        {
          type: 'formula',
          latex: '\\log_{10}\\dfrac{k_2}{k_1} = \\dfrac{E_a}{2.303R}\\left[\\dfrac{T_2-T_1}{T_1 T_2}\\right]',
          display: true,
          caption: 'Two-temperature Arrhenius formula — the most heavily tested numerical Ea calculation',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Negative Effective Activation Energy Is Real (But Rare)',
          body: 'An elementary step\'s Ea is always positive. But when a complex mechanism\'s Eeff is derived as a difference (e.g. Ea1 − Ea2 with Ea2 > Ea1), the overall effective activation energy can come out negative — meaning the reaction actually slows down as temperature rises. This happens in reactions dominated by a pre-equilibrium step that shifts backward on heating, such as 2NO + O₂ → 2NO₂.',
        },
      ],
      mcqs: [
        {
          question: 'The slope of a plot of log₁₀k vs. 1/T is −6000 K. What is the activation energy? (R = 8.314 J K⁻¹mol⁻¹)',
          options: ['≈ 49.9 kJ/mol', '≈ 114.9 kJ/mol', '≈ 6.0 kJ/mol', '≈ 6000 kJ/mol'],
          correct: 1,
          explanation: 'Slope = −Ea/(2.303R) → Ea = 6000 × 2.303 × 8.314 ≈ 114,900 J/mol ≈ 114.9 kJ/mol.',
        },
        {
          question: 'Why can the overall effective activation energy of a complex mechanism be negative, even though every elementary step has Ea > 0?',
          options: [
            'It cannot — this is never physically possible',
            'When Eeff is a difference of two elementary Ea values, a larger subtracted term can make the result negative',
            'Negative Ea just means the reaction is exothermic',
            'It only happens for reactions run below 0°C',
          ],
          correct: 1,
          explanation: 'Complex mechanisms (e.g. those involving a pre-equilibrium step) can produce Eeff = Ea1 − Ea2. If Ea2 > Ea1, the result is negative, even though no individual elementary step ever has negative Ea.',
        },
      ],
      flashcards: [
        { front: 'Two conditions for an effective collision', back: 'Sufficient kinetic energy (≥ threshold energy) AND correct spatial orientation (steric factor).' },
        { front: 'Collision theory master equation', back: 'Rate = P · Z_AB · e^(−Ea/RT) — matches Arrhenius A with P × Z.' },
        { front: 'Temperature coefficient μ, typical range', back: 'μ = k(T+10)/kT, typically between 2 and 3 for most homogeneous reactions.' },
      ],
    },

  ],
}
