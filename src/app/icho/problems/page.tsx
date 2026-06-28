import IChOProblemViewer, { IChOProblem } from '@/app/components/IChOProblemViewer'

// ── Sample IChO preparatory problems ─────────────────────────────────────────
const ICHO_PROBLEMS: IChOProblem[] = [
  {
    id: 1,
    year: 2023,
    source: 'IChO 2023 (Zurich) Preparatory Problem 2',
    title: 'Atmospheric Carbon Capture',
    domain: 'Physical Chemistry — Thermodynamics',
    total_points: 16,
    context: `Direct air capture (DAC) of CO₂ involves the reaction of CO₂ with a solid sorbent such as calcium oxide.

Reaction 1: CaO(s) + CO₂(g) → CaCO₃(s)    ΔH°₁ = −178.3 kJ/mol
Reaction 2: CaCO₃(s) → CaO(s) + CO₂(g)    ΔH°₂ = +178.3 kJ/mol

Thermodynamic data at 298 K:
  CaO(s):  ΔGf° = −604.0 kJ/mol,  S° = 39.8 J/mol·K
  CaCO₃(s): ΔGf° = −1128.8 kJ/mol, S° = 91.7 J/mol·K
  CO₂(g):  ΔGf° = −394.4 kJ/mol,  S° = 213.8 J/mol·K`,
    parts: [
      {
        label: 'a',
        question: 'Calculate ΔG° for Reaction 1 at 298 K.',
        points: 3,
        model_answer: 'ΔG°₁ = ΔGf°(CaCO₃) − ΔGf°(CaO) − ΔGf°(CO₂)\n= −1128.8 − (−604.0) − (−394.4)\n= −1128.8 + 604.0 + 394.4\n= −130.4 kJ/mol\n\nReaction 1 is thermodynamically favorable at 298 K.',
      },
      {
        label: 'b',
        question: 'Calculate ΔS° for Reaction 1 at 298 K and comment on its sign.',
        points: 3,
        model_answer: 'ΔS°₁ = S°(CaCO₃) − S°(CaO) − S°(CO₂)\n= 91.7 − 39.8 − 213.8\n= −161.9 J/mol·K\n\nNegative ΔS° is expected: a gas (CO₂) is incorporated into a solid, greatly decreasing the system\'s entropy (disorder decreases).',
      },
      {
        label: 'c',
        question: 'Estimate the temperature at which Reaction 1 becomes thermodynamically unfavorable (ΔG° > 0). State any assumptions.',
        points: 4,
        model_answer: 'Setting ΔG° = 0: T = ΔH°/ΔS° = −178,300 / −161.9 = 1100 K (≈ 827°C)\n\nAbove ~1100 K, ΔG° > 0 and the reaction reverses (CaCO₃ decomposes back to CaO + CO₂).\n\nAssumption: ΔH° and ΔS° are assumed independent of temperature (valid as a first approximation).',
      },
      {
        label: 'd',
        question: 'In the industrial calcination step, CaCO₃ is heated to release pure CO₂. Explain why this release temperature (from part c) is industrially significant and what it implies for the energy cost of a CaO-based DAC cycle.',
        points: 3,
        model_answer: 'The ~1100 K decomposition temperature means significant high-temperature heat must be supplied to regenerate the CaO sorbent. If this heat comes from fossil fuels, the CO₂ emitted during regeneration may offset the CO₂ captured—a fundamental energy penalty of CaO-based DAC. Low-carbon heat sources (concentrated solar, electrolytic, nuclear) are needed for net-negative emissions.',
      },
      {
        label: 'e',
        question: 'A 1.00 kg sample of CaO is used to capture CO₂ at 298 K. Assuming 100% conversion, calculate the mass of CO₂ captured.',
        points: 3,
        model_answer: 'M(CaO) = 56.08 g/mol. Moles CaO = 1000/56.08 = 17.83 mol.\nFrom stoichiometry: 1 mol CaO captures 1 mol CO₂.\nM(CO₂) = 44.01 g/mol.\nMass CO₂ = 17.83 × 44.01 = 784.5 g ≈ 0.785 kg.',
      },
    ],
  },
  {
    id: 2,
    year: 2022,
    source: 'IChO 2022 (Tianjin) Preparatory Problem 5',
    title: 'Enzyme Kinetics and Inhibition',
    domain: 'Biochemistry — Enzyme Kinetics',
    total_points: 18,
    context: `Lactate dehydrogenase (LDH) catalyzes the reversible conversion of pyruvate to lactate.

Michaelis–Menten parameters for LDH (at 37°C, pH 7.4):
  Vmax = 120 μmol/min
  Km = 0.40 mM (for pyruvate)

An inhibitor I is added to the reaction mixture at concentration [I] = 2.0 mM.
In the presence of I, the apparent Km increases to 1.20 mM while Vmax remains unchanged at 120 μmol/min.`,
    parts: [
      {
        label: 'a',
        question: 'Identify the type of inhibition and justify your answer using the kinetic data provided.',
        points: 3,
        model_answer: 'Competitive inhibition. The apparent Km increases (Km,app = 1.20 mM > 0.40 mM) while Vmax remains unchanged (120 μmol/min). This is the hallmark of competitive inhibition: the inhibitor competes with substrate for the active site, reducing apparent affinity (raising Km) but not affecting the maximum rate at saturating [S].',
      },
      {
        label: 'b',
        question: 'Calculate the inhibitor constant Ki.',
        points: 4,
        model_answer: 'For competitive inhibition: Km,app = Km(1 + [I]/Ki)\n1.20 = 0.40(1 + 2.0/Ki)\n3.0 = 1 + 2.0/Ki\n2.0/Ki = 2.0\nKi = 1.0 mM\n\nA lower Ki would indicate a more potent inhibitor.',
      },
      {
        label: 'c',
        question: 'At a substrate concentration of [S] = 0.40 mM (no inhibitor), calculate the reaction velocity v.',
        points: 3,
        model_answer: 'Michaelis–Menten equation: v = Vmax[S] / (Km + [S])\nv = 120 × 0.40 / (0.40 + 0.40)\nv = 48 / 0.80\nv = 60 μmol/min (= Vmax/2, as expected when [S] = Km)',
      },
      {
        label: 'd',
        question: 'Draw and label a Lineweaver–Burk double-reciprocal plot for LDH with and without the inhibitor. Clearly indicate where the lines intersect the axes.',
        points: 4,
        model_answer: 'The Lineweaver–Burk plot (1/v vs 1/[S]) shows:\n\nWithout inhibitor:\n  y-intercept = 1/Vmax = 1/120\n  x-intercept = −1/Km = −1/0.40 = −2.5 mM⁻¹\n  Slope = Km/Vmax = 0.40/120\n\nWith competitive inhibitor:\n  y-intercept = 1/Vmax = 1/120 (SAME — Vmax unchanged)\n  x-intercept = −1/Km,app = −1/1.20 ≈ −0.83 mM⁻¹ (less negative)\n  Slope = Km,app/Vmax = 1.20/120 (STEEPER)\n\nThe two lines intersect at the y-axis (same 1/Vmax), which is the defining graphical feature of competitive inhibition.',
      },
      {
        label: 'e',
        question: 'Oxamate (structural analogue of pyruvate) also competitively inhibits LDH with Ki = 0.10 mM. Compare its potency to the inhibitor in parts a–d and suggest a structural reason.',
        points: 4,
        model_answer: 'Oxamate (Ki = 0.10 mM) is 10× more potent than inhibitor I (Ki = 1.0 mM) because a lower Ki means the inhibitor binds more tightly to the active site.\n\nStructural basis: Oxamate (NH₂COCOO⁻) mimics the carboxylate and keto groups of pyruvate (CH₃COCOO⁻) but replaces the methyl group with an amino group. This allows it to form additional hydrogen bonds with active-site residues, increasing binding affinity and explaining its lower Ki.',
      },
    ],
  },
  {
    id: 3,
    year: 2021,
    source: 'IChO 2021 (Japan/virtual) Preparatory Problem 3',
    title: 'Polycyclic Aromatic Synthesis',
    domain: 'Organic Chemistry — Synthesis',
    total_points: 20,
    context: `Pyrene is a polycyclic aromatic hydrocarbon (PAH) with molecular formula C₁₆H₁₀ and D₂h symmetry. It is synthesized industrially from coal tar.

A model synthesis uses the following sequence:
  A: naphthalene → B: 2,2′-binaphthyl (via Ullmann coupling)
  B → C: ring-closure step to form a cyclic intermediate
  C → Pyrene: aromatization (dehydrogenation)

¹H NMR of pyrene in CDCl₃: δ 8.17 (d, 4H), 8.10 (s, 4H), 7.98 (t, 2H) — all aromatic.`,
    parts: [
      {
        label: 'a',
        question: 'Explain why pyrene shows only three distinct ¹H NMR signals despite having 10 aromatic protons.',
        points: 3,
        model_answer: 'Pyrene has D₂h symmetry, which creates four distinct chemical environments:\n  Positions 1,2,3,6,7,8 — two sets, but they appear at δ 8.17 (d, 4H at positions 1,2,6,7) and δ 7.98 (t, 2H at positions 3,8), and the bridgehead-adjacent protons at δ 8.10 (s, 4H at positions 4,5,9,10).\n\nThe symmetry equivalences reduce 10 protons to 3 observed NMR environments. The doublet multiplicity arises from two adjacent H neighbors; the triplet from protons flanked by two non-equivalent neighbors; the singlet from isolated protons.',
      },
      {
        label: 'b',
        question: 'The Ullmann coupling (step A → B) uses Cu to couple 2-bromonaphthalene. Write the overall balanced equation and identify the driving force.',
        points: 4,
        model_answer: '2 C₁₀H₇Br + Cu → C₂₀H₁₄ (2,2′-binaphthyl) + CuBr₂\n\nOverall: 2 ArBr + Cu(0) → Ar-Ar + CuBr₂\n\nDriving force: Formation of a C–C bond from two aryl halides, aided by the oxidation of Cu(0) to Cu(II), which provides a thermodynamic driving force (CuBr₂ lattice energy and enthalpies of C–C vs C–Br bond formation favor product).',
      },
      {
        label: 'c',
        question: 'The ring closure (B → C) proceeds via electrophilic aromatic substitution (EAS). Identify the electrophile, the leaving group, and explain the regioselectivity (formation of 5-membered ring vs. 6-membered ring product at the 1,1′ vs 2,2′ positions).',
        points: 5,
        model_answer: 'In the Scholl-type ring closure (or acid-catalyzed EAS):\n\nElrophile: An arenium (Wheland) intermediate formed by protonation or Lewis acid activation at the reactive peri-position of the binaphthyl.\n\nLeaving group: H⁺ (proton loss to restore aromaticity, same as all EAS).\n\nRegioselectivity: The 2,2′-binaphthyl undergoes ring closure preferentially at the 1,1′ positions (peri to the bond junction) because: (1) these positions are closest in space (peri relationship), lowering the entropic cost of bond formation; (2) HOMO density is highest at C-1 in naphthalene; (3) five-membered ring formation would violate ring strain for this substrate — the geometry favors a 6-membered ring closure completing the pyrene skeleton.',
      },
      {
        label: 'd',
        question: 'Pyrene undergoes electrophilic bromination preferentially at position 1 (and equivalently 3, 6, 8). Using FMO (frontier molecular orbital) theory or resonance arguments, explain this regioselectivity.',
        points: 4,
        model_answer: 'Positions 1, 2, 3, 6, 7, 8 in pyrene differ in HOMO electron density. Resonance analysis shows that attack at C-1 (or C-3) gives a Wheland intermediate where the positive charge can be delocalized over more positions, including into the adjacent ring system via full conjugation pathways — providing a lower-energy arenium intermediate.\n\nFMO perspective: The HOMO of pyrene has larger coefficients at positions 1, 3, 6, 8, making them more reactive toward electrophilic attack (electrophile interacts with largest HOMO lobe for greatest orbital overlap).\n\nPositions 4, 5, 9, 10 (bridgehead) are less reactive because EAS there would generate an intermediate that breaks aromaticity in a more disruptive way.',
      },
      {
        label: 'e',
        question: 'Pyrene has 8 π-electrons... wait, it has 16 carbons and 10 H\'s. How many π-electrons does pyrene have? Does it follow Hückel\'s 4n+2 rule? Explain why Hückel\'s rule applies or does not apply to pyrene.',
        points: 4,
        model_answer: 'Pyrene has C₁₆H₁₀, so 16 carbons each contributing 1 π-electron = 16 π-electrons.\n\n16 = 4(4) + 0 — this is 4n with n=4, which would suggest antiaromaticity by simple Hückel counting. However, pyrene IS aromatic in practice.\n\nThe resolution: Hückel\'s 4n+2 rule strictly applies only to monocyclic (single ring) conjugated systems. Pyrene is a polycyclic aromatic — for polycyclics, aromaticity is better assessed by ring-by-ring analysis (each 6-membered ring in pyrene is locally aromatic) or by NICS calculations, BIRD index, etc. Pyrene shows all hallmarks of aromaticity: planarity, bond-length equalization, large ring current in NMR, thermodynamic stability.',
      },
    ],
  },
]

export default function IChOProblemsPage() {
  return (
    <IChOProblemViewer
      problems={ICHO_PROBLEMS}
      examLabel="IChO Preparatory Problems — Sample"
    />
  )
}
