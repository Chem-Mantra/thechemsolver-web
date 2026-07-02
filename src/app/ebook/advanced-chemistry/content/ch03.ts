import type { AdvChapter } from '../types'

export const CH03: AdvChapter = {
  id: 'ch03',
  number: 3,
  title: 'Advanced Thermodynamics',
  examRelevance: '9-16% across every USNCO/IChO source',
  accentHex: '#f59e0b',
  concepts: [

    // ── Concept 1: Systems, State Functions & Thermodynamic Processes ──────────
    {
      id: 'ch03-c1-systems-state-functions',
      title: 'Systems, State Functions & Thermodynamic Processes',
      subtitle: 'The vocabulary every rigorous thermodynamics problem assumes you already know',
      estimatedMinutes: 12,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'An open system exchanges both mass and energy with its surroundings; a closed system exchanges only energy; an isolated system exchanges neither. True thermodynamic equilibrium requires three conditions simultaneously: thermal (uniform T), mechanical (uniform P, no net force), and chemical (constant composition) — missing any one means the system is still changing.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'State Functions vs. Path Functions',
          body: 'State functions (P, V, T, U, H, S, G) depend only on initial and final states — their change around any complete cycle is exactly zero. Heat (q) and work (w) are path functions: their values depend on the specific route taken, even between the same two endpoints. The one crucial exception: heat measured at constant volume (qv = ΔU) or constant pressure (qp = ΔH) behaves like a state function specifically because the constraint pins down the path.',
        },
        {
          type: 'table',
          headers: ['Process', 'Constraint', 'Key consequence'],
          rows: [
            ['Isothermal', 'ΔT = 0', 'For ideal gas: ΔU = 0, ΔH = 0'],
            ['Isochoric', 'ΔV = 0', 'w = 0 (no PV work possible)'],
            ['Isobaric', 'ΔP = 0', 'q = ΔH'],
            ['Adiabatic', 'q = 0', 'ΔU = w exactly'],
            ['Cyclic', 'returns to start', 'ΔU = ΔH = ΔS = ΔG = 0'],
          ],
        },
        {
          type: 'text',
          body: 'A reversible process proceeds through an infinite sequence of equilibrium states, with the driving force only infinitesimally greater than the opposing force at every step — it extracts the maximum possible work from an expansion. An irreversible process happens in one or a few finite jumps against a fixed opposing force; it is faster, but always less efficient. Every real, spontaneous process is irreversible — reversibility is a useful theoretical limit, never physically achieved.',
        },
      ],
      mcqs: [
        {
          question: 'Which combination correctly completes thermodynamic equilibrium?',
          options: [
            'Thermal equilibrium alone',
            'Thermal and mechanical equilibrium only',
            'Thermal, mechanical, AND chemical equilibrium simultaneously',
            'Chemical equilibrium alone is sufficient',
          ],
          correct: 2,
          explanation: 'All three — uniform temperature, uniform pressure with no net force, and constant composition — must hold at once for true thermodynamic equilibrium.',
        },
      ],
      flashcards: [
        { front: 'Isolated vs. closed system', back: 'Isolated: exchanges neither mass nor energy. Closed: exchanges energy but not mass.' },
        { front: 'When does heat (a path function) behave like a state function?', back: 'At constant volume, q = ΔU. At constant pressure, q = ΔH.' },
        { front: 'Reversible process: defining feature', back: 'Proceeds through a continuous sequence of equilibrium states; opposing force differs from driving force only infinitesimally.' },
      ],
    },

    // ── Concept 2: PV Work — Reversible vs. Irreversible Expansion ──────────────
    {
      id: 'ch03-c2-pv-work',
      title: 'PV Work: Reversible vs. Irreversible Expansion',
      subtitle: 'Why nature "taxes" you for rushing a process',
      estimatedMinutes: 14,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'Pressure-volume work is defined as w = −∫Pext dV, using the chemistry convention where work done ON the system is positive. During expansion (ΔV > 0), the system does work on the surroundings, so w is negative; during compression, w is positive. Graphically, the magnitude of work is the area under the P–V curve.',
        },
        {
          type: 'formula',
          latex: 'w_{rev} = -nRT\\ln\\left(\\dfrac{V_2}{V_1}\\right), \\qquad w_{irr} = -P_{ext}(V_2 - V_1)',
          display: true,
          caption: 'Reversible isothermal work (integrating the continuously-adjusting Pgas) vs. irreversible isothermal work (Pext fixed throughout)',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Reversible Always Wins — But It Costs Infinite Time',
          body: 'For the same expansion from V₁ to V₂, |wrev| > |wirr| — the reversible path extracts more work because it always pushes against a force just barely below the gas\'s own pressure, using every bit of available driving force. The irreversible path pushes against a fixed, lower Pext, "wasting" potential work. For compression, the relationship flips: |wirr| > |wrev|, since you must overcome a constant high external pressure rather than the gas\'s own gradually-rising resistance.',
        },
        {
          type: 'text',
          body: 'Reversible adiabatic processes (q = 0) for an ideal gas follow the Poisson relations — PVᵞ = constant, TVᵞ⁻¹ = constant — where γ = Cp/Cv. These hold only for reversible adiabatic changes; an irreversible adiabatic process must instead be solved directly from the first law, nCv(T₂−T₁) = −Pext(V₂−V₁), since there is no algebraic shortcut available.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Free Expansion Is a Favorite Trap',
          body: 'A gas expanding into a vacuum has Pext = 0, so w = 0 regardless of ΔV. If the container is also insulated, q = 0 too, making ΔU = 0 — and since ΔU = 0 for an ideal gas, ΔT = 0 as well. Free expansion of an ideal gas is simultaneously adiabatic (q=0) and isothermal (ΔT=0), a combination that seems contradictory until you recognize no work is actually being done against anything.',
        },
      ],
      mcqs: [
        {
          question: 'An ideal gas expands adiabatically and reversibly. What happens to its temperature?',
          options: ['Increases, since work is done on the surroundings', 'Decreases, since the gas does work at the expense of its own internal energy', 'Stays exactly constant', 'Cannot be determined without knowing Pext'],
          correct: 1,
          explanation: 'With q = 0, ΔU = w. Expansion work is negative (energy leaves the system), so ΔU < 0, meaning the gas cools as it does work using only its own internal energy.',
        },
      ],
      flashcards: [
        { front: 'Reversible isothermal work formula', back: 'w = −nRT ln(V₂/V₁)' },
        { front: 'Why is reversible expansion work always ≥ irreversible?', back: 'Reversible work uses the maximum available driving force at every step; irreversible work is capped by a fixed, lower Pext.' },
        { front: 'Free expansion of an ideal gas: w, q, ΔU, ΔT', back: 'All exactly zero — Pext = 0 means no work, insulated means no heat, so no internal energy or temperature change.' },
      ],
    },

    // ── Concept 3: Quantitative Entropy — Gas Processes & Phase Transitions ─────
    {
      id: 'ch03-c3-quantitative-entropy',
      title: 'Quantitative Entropy: Gas Processes & Phase Transitions',
      subtitle: 'Calculating ΔS directly, not just reasoning about "more disorder"',
      estimatedMinutes: 13,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'AP-level thermodynamics treats entropy mostly qualitatively — gases have more entropy than liquids, dissolving increases disorder. IChO and USNCO National problems expect you to actually calculate ΔS numerically, for both reversible and irreversible paths, since entropy is a state function and depends only on initial and final conditions.',
        },
        {
          type: 'formula',
          latex: '\\Delta S_{sys} = nC_v\\ln\\left(\\dfrac{T_2}{T_1}\\right) + nR\\ln\\left(\\dfrac{V_2}{V_1}\\right)',
          display: true,
          caption: 'Master entropy formula for an ideal gas — valid for any path since S is a state function',
        },
        {
          type: 'table',
          headers: ['Constraint', 'Simplified ΔS formula'],
          rows: [
            ['Isothermal (T₁=T₂)', 'ΔS = nR ln(V₂/V₁)'],
            ['Isochoric (V₁=V₂)', 'ΔS = nCv ln(T₂/T₁)'],
            ['Isobaric', 'ΔS = nCp ln(T₂/T₁)'],
            ['Reversible adiabatic', 'ΔS = 0 (isentropic)'],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Irreversible Adiabatic ≠ Isentropic',
          body: 'A reversible adiabatic process has ΔS = 0 by definition (q_rev/T = 0/T). An irreversible adiabatic process is NOT isentropic — it generates entropy spontaneously even with no heat exchanged, so ΔS > 0. Don\'t assume "adiabatic" automatically means "no entropy change."',
        },
        {
          type: 'text',
          body: 'Phase transitions occur reversibly at constant temperature and pressure, so q_rev = ΔH exactly, giving ΔS = ΔHtransition / Ttransition. This is how melting and boiling entropies are calculated — always with T in Kelvin.',
        },
        {
          type: 'formula',
          latex: '\\Delta S_{surr} = \\dfrac{-\\Delta H_{sys}}{T_{surr}}, \\qquad \\Delta S_{universe} = \\Delta S_{sys} + \\Delta S_{surr} > 0 \\;\\text{(spontaneous)}',
          display: true,
          caption: 'Surroundings entropy from the heat dumped/absorbed, and the true universal spontaneity criterion',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'A Spontaneous Process CAN Decrease System Entropy',
          body: 'Water freezing at −10°C has ΔSsys < 0 (a more ordered solid forms) — yet it is spontaneous, because the latent heat released warms the surroundings enough that ΔSsurr is large and positive, making ΔSuniverse > 0 overall. Spontaneity is judged strictly by the universe\'s entropy, never by the system\'s alone.',
        },
      ],
      mcqs: [
        {
          question: 'One mole of an ideal gas expands isothermally and reversibly from 10 L to 20 L at 298 K. What is ΔS for the gas? (R = 8.314 J/(mol·K))',
          options: ['0 J/K (isothermal means no entropy change)', '+5.76 J/K', '−5.76 J/K', '+11.5 J/K'],
          correct: 1,
          explanation: 'Isothermal: ΔS = nR ln(V₂/V₁) = (1)(8.314)ln(2) = 8.314 × 0.693 ≈ +5.76 J/K. Entropy increases because the gas occupies more volume (more accessible microstates), even though temperature is unchanged.',
        },
        {
          question: 'Liquid water freezes spontaneously at −10°C even though ΔSsystem < 0. This is only possible because:',
          options: [
            'The Second Law does not apply below 0°C',
            'ΔSsurroundings is sufficiently large and positive to make ΔSuniverse > 0',
            'Entropy is not actually a state function',
            'Freezing does not release any heat',
          ],
          correct: 1,
          explanation: 'The heat released during freezing (exothermic) increases the surroundings\' entropy enough to outweigh the system\'s entropy decrease, so ΔSuniverse still comes out positive.',
        },
      ],
      flashcards: [
        { front: 'Entropy of phase transition', back: 'ΔS = ΔH(transition) / T(transition), with T in Kelvin.' },
        { front: 'True criterion for spontaneity', back: 'ΔS(universe) = ΔS(system) + ΔS(surroundings) > 0 — never ΔS(system) alone.' },
        { front: 'Is an irreversible adiabatic process isentropic?', back: 'No — only reversible adiabatic processes have ΔS = 0. Irreversible adiabatic processes still generate ΔS > 0.' },
      ],
    },

  ],
}
