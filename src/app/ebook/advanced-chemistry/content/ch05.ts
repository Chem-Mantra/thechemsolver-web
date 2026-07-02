import type { AdvChapter } from '../types'

export const CH05: AdvChapter = {
  id: 'ch05',
  number: 5,
  title: 'Electrochemistry Beyond the Nernst Basics',
  examRelevance: '5-15% across USNCO/IChO sources — largely coverable via conductance and concentration-cell depth',
  accentHex: '#f59e0b',
  concepts: [

    // ── Concept 1: Molar Conductivity & Kohlrausch's Law ────────────────────────
    {
      id: 'ch05-c1-molar-conductivity',
      title: "Molar Conductivity & Kohlrausch's Law",
      subtitle: 'The conductance toolkit behind conductometric titration',
      estimatedMinutes: 13,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'Conductometric titration (Chapter 1) relies on how solution conductivity changes as ions are consumed and replaced — but that qualitative picture becomes quantitative once you separate out how much of the conducting power comes from concentration versus how much comes from the ions themselves.',
        },
        {
          type: 'formula',
          latex: '\\Lambda_m = \\dfrac{\\kappa \\times 1000}{M}',
          display: true,
          caption: 'Molar conductivity: the conducting power contributed by exactly one mole of dissolved electrolyte, from measured specific conductivity κ and molarity M',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Dilution Increases Λm — Even Though κ Decreases',
          body: 'Specific conductivity (κ) drops on dilution simply because there are fewer ions per unit volume. But molar conductivity (Λm) always increases on dilution: for strong electrolytes, ions move apart and interionic drag decreases; for weak electrolytes, dilution pushes the dissociation equilibrium further forward, creating more ions per mole overall. Both effects push Λm up as concentration falls, reaching a maximum value Λm° at infinite dilution.',
        },
        {
          type: 'text',
          body: 'Strong electrolytes (KCl, HCl) show a Λm vs. √C plot that is linear, so Λm° can be found simply by extrapolating to C = 0. Weak electrolytes (acetic acid) curve sharply upward at low concentration and never approach a finite intercept experimentally — extrapolation fails. This is exactly the gap Kohlrausch\'s law of independent migration solves.',
        },
        {
          type: 'formula',
          latex: '\\Lambda_m^{\\circ} = \\nu_+\\lambda_+^{\\circ} + \\nu_-\\lambda_-^{\\circ}',
          display: true,
          caption: "Kohlrausch's law: at infinite dilution, each ion contributes independently to the total, regardless of its counter-ion",
        },
        {
          type: 'callout',
          variant: 'insight',
          title: "Kohlrausch's Law Is Hess's Law for Conductivity",
          body: 'Because each ion contributes independently, limiting molar conductivities of strong electrolytes can be added and subtracted algebraically to find the value for a weak electrolyte you could never measure directly. For acetic acid: Λm°(CH₃COOH) = Λm°(HCl) + Λm°(CH₃COONa) − Λm°(NaCl) — the Na⁺ and Cl⁻ contributions cancel, isolating H⁺ and CH₃COO⁻.',
        },
      ],
      mcqs: [
        {
          question: 'Why can Λm° for acetic acid not be found by extrapolating its own Λm vs. √C plot to zero concentration?',
          options: [
            'Acetic acid does not conduct electricity at any concentration',
            'As a weak electrolyte, its curve rises steeply and becomes nearly vertical at low concentration, so the line never reaches a clean, extrapolatable intercept',
            'Acetic acid has no molar mass',
            'Λm° only applies to solid electrolytes',
          ],
          correct: 1,
          explanation: "Weak electrolytes show sharply curving Λm vs. √C behavior with no linear region reaching C=0, unlike strong electrolytes — this is precisely why Kohlrausch's law (combining strong-electrolyte data) is needed instead.",
        },
      ],
      flashcards: [
        { front: 'Molar conductivity formula', back: 'Λm = κ × 1000 / M' },
        { front: 'Effect of dilution on κ vs. Λm', back: 'κ decreases (fewer ions per volume); Λm always increases, approaching Λm° at infinite dilution.' },
        { front: "Kohlrausch's law", back: 'Λm° = ν₊λ°₊ + ν₋λ°₋ — each ion contributes independently at infinite dilution, so values can be combined algebraically like Hess\'s law.' },
      ],
    },

    // ── Concept 2: Degree of Dissociation from Conductivity ─────────────────────
    {
      id: 'ch05-c2-dissociation-from-conductivity',
      title: 'Degree of Dissociation from Conductivity Data',
      subtitle: "A second route to α — independent of the vapor-density method",
      estimatedMinutes: 9,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'For a weak electrolyte, the ratio of its molar conductivity at a given concentration to its limiting molar conductivity at infinite dilution gives the degree of dissociation directly — a completely different technique from the vapor-density method in Chapter 4, but solving the same kind of question.',
        },
        {
          type: 'formula',
          latex: '\\alpha = \\dfrac{\\Lambda_m^{c}}{\\Lambda_m^{\\circ}}',
          display: true,
          caption: 'Degree of dissociation of a weak electrolyte at concentration c, from measured vs. limiting molar conductivity',
        },
        {
          type: 'text',
          body: 'This works because at infinite dilution, dissociation is essentially complete (α → 1), so Λm° represents the fully-dissociated conducting power. At any finite concentration, only a fraction α of the electrolyte has actually dissociated into conducting ions, so the ratio of the two directly measures that fraction — no separate vapor-phase measurement required.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Combine with Ostwald\'s Dilution Law',
          body: 'Once α is known from conductivity, it plugs directly into Ostwald\'s dilution law (Ka = cα²/(1−α)) to find the acid dissociation constant — a common two-step IChO/USNCO problem that starts from a conductivity measurement and ends at Ka.',
        },
      ],
      mcqs: [
        {
          question: 'A weak acid has Λm = 48.2 S·cm²/mol at a given concentration, and Λm° = 390.7 S·cm²/mol. What is its degree of dissociation?',
          options: ['0.081', '0.123', '0.234', '0.481'],
          correct: 1,
          explanation: 'α = Λm/Λm° = 48.2/390.7 ≈ 0.123.',
        },
      ],
      flashcards: [
        { front: 'Degree of dissociation from conductivity', back: 'α = Λm(at concentration c) / Λm°(at infinite dilution)' },
        { front: 'Why does this formula work?', back: 'At infinite dilution, dissociation is essentially complete, so Λm° represents full conducting power; the ratio at finite c measures the fraction actually dissociated.' },
      ],
    },

    // ── Concept 3: Concentration Cells ──────────────────────────────────────────
    {
      id: 'ch05-c3-concentration-cells',
      title: 'Concentration Cells',
      subtitle: 'Generating voltage from nothing but a concentration difference',
      estimatedMinutes: 12,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'A concentration cell uses identical electrodes and identical electrolyte chemistry on both sides — the only difference between the two half-cells is concentration (or, for a gas electrode, pressure). Because both electrodes are chemically the same substance, E°cell = 0 exactly, and the entire measured voltage comes purely from the Nernst equation\'s Q-dependent term.',
        },
        {
          type: 'formula',
          latex: 'E_{cell} = -\\dfrac{0.0591}{n}\\log\\dfrac{C_{1}}{C_{2}}',
          display: true,
          caption: 'Electrolyte concentration cell: M(s) | Mⁿ⁺(C₁) || Mⁿ⁺(C₂) | M(s). Since E° = 0, only the concentration ratio matters',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Which Side Is Which?',
          body: 'The dilute solution is the anode (oxidation) — metal dissolves into it, increasing its ion concentration. The concentrated solution is the cathode (reduction) — ions plate out, decreasing its concentration. The cell runs spontaneously in the direction that equalizes the two concentrations, exactly like any other system driven toward equilibrium; current stops once C₁ = C₂.',
        },
        {
          type: 'text',
          body: 'The same logic extends to gas-electrode concentration cells, where two hydrogen electrodes at the same [H⁺] but different H₂ pressures generate a voltage driven purely by the pressure ratio — spontaneous only when the higher-pressure side is the anode, since gas at higher pressure has a stronger thermodynamic drive to be oxidized (lose electrons and go into solution as ions).',
        },
      ],
      mcqs: [
        {
          question: 'A concentration cell is built from two Ag/Ag⁺ half-cells: [Ag⁺] = 0.010 M on one side and 1.0 M on the other. Which statement is correct?',
          options: [
            'E°cell for this setup is large and positive, since silver is a good conductor',
            'E°cell = 0 exactly, since both electrodes involve the same chemical species; the observed voltage comes entirely from the concentration ratio',
            'No voltage can be generated since both electrodes are made of the same metal',
            'The dilute side is the cathode',
          ],
          correct: 1,
          explanation: 'Identical electrode chemistry means E° = 0 by definition for any concentration cell — the entire measured EMF arises purely from the −(0.0591/n)log(C1/C2) term in the Nernst equation.',
        },
      ],
      flashcards: [
        { front: 'Concentration cell: E°cell value', back: 'Always exactly 0 V — both electrodes are the same chemical species, differing only in concentration or pressure.' },
        { front: 'Concentration cell: which side is the anode?', back: 'The dilute (lower concentration) side — it undergoes oxidation, increasing its own ion concentration toward equilibrium with the other side.' },
      ],
    },

    // ── Concept 4: Corrosion as an Electrochemical Process ──────────────────────
    {
      id: 'ch05-c4-corrosion',
      title: 'Corrosion as an Electrochemical Process',
      subtitle: 'Why iron rusts fastest at the waterline, not underwater',
      estimatedMinutes: 10,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'Rusting is not a simple direct reaction between iron and oxygen — it is a full galvanic cell operating on the metal\'s own surface, with distinct anodic and cathodic regions connected through the metal itself (which conducts electrons) and through a thin surface film of moisture (which conducts ions).',
        },
        {
          type: 'formula',
          latex: '\\text{Anode: } Fe(s) \\rightarrow Fe^{2+} + 2e^- \\qquad \\text{Cathode: } O_2 + 4H^+ + 4e^- \\rightarrow 2H_2O',
          display: true,
          caption: 'The two half-reactions of iron corrosion — physically separated on the metal surface, connected by electron flow through the metal',
        },
        {
          type: 'text',
          body: 'The Fe²⁺ formed at the anode migrates through the moisture film and is further oxidized by dissolved oxygen to Fe³⁺, which precipitates as hydrated iron(III) oxide — rust — often at a location physically distant from the actual anodic pitting site. This is why corrosion damage often appears to spread away from where the metal is actually being consumed.',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Cathodic Protection: Using a Sacrificial Anode',
          body: 'Because corrosion is electrochemical, it can be suppressed electrochemically: attaching a more easily oxidized metal (zinc or magnesium) to iron makes that metal the anode instead — it corrodes preferentially, sacrificing itself while the iron is cathodically protected. This is exactly why ship hulls and buried pipelines are studded with zinc or magnesium blocks.',
        },
      ],
      mcqs: [
        {
          question: 'Why does attaching a block of zinc to a ship\'s steel hull protect the steel from corroding?',
          options: [
            'Zinc physically blocks water from reaching the steel',
            'Zinc is more easily oxidized than iron, so it preferentially becomes the anode and corrodes instead, protecting the steel cathodically',
            'Zinc reacts with oxygen to remove it from the water entirely',
            'Zinc makes the steel more resistant to physical abrasion',
          ],
          correct: 1,
          explanation: "Zinc's greater tendency to be oxidized makes it the sacrificial anode in the resulting galvanic system, so it corrodes in place of the iron — the iron becomes the protected cathode.",
        },
      ],
      flashcards: [
        { front: 'Corrosion: anode and cathode half-reactions', back: 'Anode: Fe → Fe²⁺ + 2e⁻. Cathode: O₂ + 4H⁺ + 4e⁻ → 2H₂O.' },
        { front: 'Cathodic protection', back: 'Attaching a more easily oxidized metal (Zn, Mg) so it becomes the sacrificial anode instead of the iron.' },
      ],
    },

  ],
}
