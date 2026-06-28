import type { EbookUnit } from '../types'

export const UNIT3: EbookUnit = {
  id: 'unit-3',
  number: 3,
  title: 'Properties of Substances & Mixtures',
  examWeight: '18–22%',
  accentHex: '#f472b6',
  concepts: [

    // ── Concept 1: Intermolecular Forces ─────────────────────────────────────
    {
      id: 'u3-c1-imf',
      title: 'Intermolecular Forces',
      subtitle: 'What holds molecules together in bulk',
      estimatedMinutes: 13,
      accentHex: '#f472b6',
      blocks: [
        {
          type: 'text',
          body: 'Intermolecular forces (IMFs) are attractions between discrete molecules. Unlike intramolecular bonds (within molecules), IMFs are typically 10–100× weaker. Nevertheless, they determine boiling points, viscosity, surface tension, solubility, and many macroscopic properties. There are three major types: London dispersion forces, dipole-dipole interactions, and hydrogen bonding.',
        },
        {
          type: 'table',
          headers: ['Force', 'Present in', 'Relative strength', 'Origin'],
          rows: [
            ['London dispersion (LDF)', 'ALL molecules and noble gases', 'Weakest (but dominant for large molecules)', 'Temporary dipoles from electron fluctuation'],
            ['Dipole-dipole', 'Polar molecules (permanent dipole)', 'Moderate', 'Permanent partial-charge alignment'],
            ['Hydrogen bonding', 'Molecules with N–H, O–H, or F–H bonds', 'Strongest IMF', 'Extremely polar bond + lone pair on N, O, F acceptor'],
            ['Ion-dipole', 'Ion + polar molecule (solutions)', 'Very strong', 'Ion charge attracts polar molecule'],
          ],
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'London Dispersion Forces — Universal But Underestimated',
          body: 'Even nonpolar molecules (Ar, CH₄, I₂) experience LDF because electrons are always in motion. At any instant, one side of the molecule has more electrons than the other — an instantaneous dipole. This induces a dipole in a neighbouring molecule, creating a momentary attraction. Strength increases with: (1) more electrons (larger molar mass) → I₂ has stronger LDF than F₂; (2) larger surface area → n-pentane > neopentane (same formula, different shape).',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Hydrogen Bonding — AP Chemistry\'s Favourite',
          body: 'Hydrogen bonding requires: a H atom bonded to N, O, or F (highly electronegative) on the donor molecule, AND a lone pair on N, O, or F on the acceptor molecule. H bonds are ~10–40 kJ/mol — far stronger than other IMFs. They explain water\'s anomalously high boiling point (100°C vs. −60°C predicted from H₂S trend) and the secondary structure of proteins and DNA.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Predicting Relative Boiling Points',
          body: '1. Identify the strongest IMF present for each molecule.\n2. If same type of IMF: larger/heavier molecule has higher BP (stronger LDF).\n3. Hydrogen bonding > dipole-dipole > London dispersion for molecules of similar size.\nExample: H₂O (H-bond, BP 100°C) > HF (H-bond, BP 19.5°C) > HCl (dipole-dipole, BP −85°C) > Ar (LDF only, BP −186°C).',
        },
        {
          type: 'simulation',
          title: 'IMF Strength Comparator',
          description: 'Select two molecules, identify their IMF types, and compare predicted boiling points. Drag molecules to show dipole arrows and instantaneous dipole animations.',
        },
      ],
      mcqs: [
        {
          question: 'Which molecule experiences hydrogen bonding with water?',
          options: ['CH₄', 'CCl₄', 'NH₃', 'CO₂'],
          correct: 2,
          explanation: 'Hydrogen bonding requires a H bonded to N, O, or F. NH₃ has N–H bonds (donor) and a lone pair on N (acceptor) — it forms H bonds with water. CH₄ and CCl₄ are nonpolar with no H on N/O/F. CO₂ has no H at all.',
        },
        {
          question: 'Which compound has the highest boiling point? All have similar molar mass.',
          options: ['CH₃CH₂CH₃ (propane)', 'CH₃OCH₃ (dimethyl ether)', 'CH₃CH₂OH (ethanol)', 'F₂'],
          correct: 2,
          explanation: 'Ethanol has an O–H group → hydrogen bonding (strongest IMF). Dimethyl ether is polar (dipole-dipole only). Propane and F₂ are essentially nonpolar (LDF only). Ethanol\'s H-bonding gives the highest BP (~78°C vs −24°C for propane and −25°C for dimethyl ether).',
        },
        {
          question: 'Why does I₂ have a higher boiling point than F₂ despite being a nonpolar molecule?',
          options: [
            'I₂ has stronger hydrogen bonds',
            'I₂ has stronger dipole-dipole interactions',
            'I₂ has more electrons and larger molar mass, giving stronger London dispersion forces',
            'I₂ is polar due to its large size',
          ],
          correct: 2,
          explanation: 'Both F₂ and I₂ are nonpolar — only LDF present. LDF strength ∝ number of electrons and molecular size. I₂ (254 g/mol, 106 electrons) >> F₂ (38 g/mol, 18 electrons). I₂ BP = 184°C; F₂ BP = −188°C.',
        },
      ],
      flashcards: [
        { front: 'What three conditions are needed for hydrogen bonding?', back: 'H bonded to N, O, or F (donor); AND a lone pair on N, O, or F (acceptor). Both donor and acceptor needed for H bonding.' },
        { front: 'What causes London dispersion forces?', back: 'Temporary (instantaneous) dipoles from random electron fluctuations, inducing dipoles in neighbouring molecules' },
        { front: 'How does molecular size affect LDF?', back: 'More electrons (higher molar mass) → larger instantaneous dipoles → stronger LDF → higher boiling point' },
        { front: 'Rank IMF strengths (weakest to strongest)', back: 'LDF (nonpolar) < dipole-dipole (polar) < hydrogen bonding (N/O/F–H donor with N/O/F acceptor). Ion-dipole is strongest overall.' },
        { front: 'Why does water have an unusually high boiling point?', back: 'Each H₂O molecule can form up to 4 hydrogen bonds (2 as donor via O–H, 2 as acceptor via lone pairs). Extensive H-bonding network requires much more energy to overcome.' },
      ],
    },

    // ── Concept 2: Solids — Types and Properties ─────────────────────────────
    {
      id: 'u3-c2-solids',
      title: 'Solids — Molecular, Ionic, Metallic, Covalent Network',
      subtitle: 'Structure determines properties',
      estimatedMinutes: 11,
      accentHex: '#fb7185',
      blocks: [
        {
          type: 'text',
          body: 'Solids are classified by the particles at their lattice points and the forces holding those particles together. This classification predicts melting point, hardness, electrical conductivity, and solubility — all critical AP Chemistry topics.',
        },
        {
          type: 'table',
          headers: ['Type', 'Lattice particles', 'Bonding force', 'MP range', 'Conductivity', 'Examples'],
          rows: [
            ['Molecular', 'Molecules', 'IMFs (LDF, dipole-dipole, H-bond)', 'Very low to moderate', 'None (insulator)', 'Ice, sugar, I₂, dry ice'],
            ['Ionic', 'Cations + anions', 'Electrostatic lattice', 'High', 'Only when molten/dissolved', 'NaCl, MgO, CaCl₂'],
            ['Metallic', 'Metal cations', 'Delocalized e⁻ (electron sea)', 'Low to very high', 'Excellent (solid)', 'Cu, Fe, Na, alloys'],
            ['Covalent network', 'Atoms', 'Covalent bonds (entire network)', 'Very high', 'None (usually)', 'Diamond, SiO₂, graphite*'],
          ],
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Graphite: The Conductor Exception',
          body: 'Graphite is a covalent network solid but conducts electricity. Each carbon is sp² hybridized — 3 σ bonds to neighbours in a flat hexagonal layer + 1 unhybridized p orbital perpendicular to the layer. These p orbitals delocalize π electrons across each graphene sheet, enabling conduction parallel to the layers. Graphite is also soft/slippery because layers are held together only by weak London dispersion forces (easily slide past each other).',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Diamond vs. Graphite — Classic AP Comparison',
          body: 'Diamond: sp³ C, tetrahedral network, all σ bonds, hardest natural substance, electrical insulator, very high MP.\nGraphite: sp² C, hexagonal layers, π delocalization, electrical conductor, lubricant (weak interlayer LDF), very high MP but soft.\nBoth are pure carbon — allotropes of carbon.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Don\'t Confuse "Can Conduct" Conditions',
          body: 'Ionic solid: conducts only when molten or dissolved (ions become mobile).\nMetal: conducts always (solid, liquid, or dissolved — but dissolving means alloying/reacting, not solution).\nMolecular solid: never conducts.\nCovalent network: usually never conducts (exception: graphite, some semiconductors like Si).',
        },
      ],
      mcqs: [
        {
          question: 'A solid is hard, has a very high melting point, and does not conduct electricity in any phase. What type of solid is it?',
          options: ['Molecular solid', 'Ionic solid', 'Metallic solid', 'Covalent network solid'],
          correct: 3,
          explanation: 'Covalent network solids (diamond, SiO₂) are very hard, have extremely high melting points (all covalent bonds must break), and are non-conductors because there are no mobile charges in any phase. Ionic solids do conduct when molten. Metallic solids always conduct.',
        },
        {
          question: 'Which solid has the lowest melting point?',
          options: ['NaCl (ionic)', 'CO₂ (molecular)', 'Fe (metallic)', 'SiC (covalent network)'],
          correct: 1,
          explanation: 'CO₂ (dry ice) is a molecular solid held together only by London dispersion forces. It sublimes at −78.5°C at 1 atm. NaCl melts at 801°C, Fe at 1538°C, SiC (silicon carbide) at ~2730°C — all far higher because they have stronger bonding forces.',
        },
        {
          question: 'Why does graphite conduct electricity but diamond does not, even though both are pure carbon?',
          options: [
            'Graphite contains impurities that carry charge',
            'Diamond has ionic bonds between carbon atoms',
            'Graphite has delocalized π electrons in its layered sheets; diamond has only localised σ bonds (sp³)',
            'Graphite is metallic; diamond is covalent',
          ],
          correct: 2,
          explanation: 'In graphite, each C is sp² hybridized; the remaining p orbital contributes to a delocalized π system across each graphene layer. These mobile electrons act like the electron sea in metals. In diamond, each C is sp³ with all four valence electrons in localised σ bonds — no mobile charge carriers.',
        },
      ],
      flashcards: [
        { front: 'What determines whether a solid is molecular, ionic, metallic, or covalent network?', back: 'The type of particles at the lattice points (molecules, ions, metal atoms, or atoms) and the forces between them' },
        { front: 'When can ionic solids conduct electricity?', back: 'Only when molten or dissolved in water — ions become mobile. In the solid state, ions are fixed and cannot carry charge.' },
        { front: 'Why is diamond so hard?', back: 'Diamond has a 3D network of sp³ C–C σ bonds in all directions. Breaking any part requires breaking many strong covalent bonds simultaneously.' },
        { front: 'Why is graphite soft and slippery?', back: 'Graphene layers are held together only by weak London dispersion forces. Layers slide past each other easily.' },
      ],
    },

    // ── Concept 3: Conductivity and Photoelectric Effect ─────────────────────
    {
      id: 'u3-c3-conductivity',
      title: 'Conductivity & the Photoelectric Effect',
      subtitle: 'Electrons, photons, and band theory basics',
      estimatedMinutes: 9,
      accentHex: '#f472b6',
      blocks: [
        {
          type: 'text',
          body: 'The photoelectric effect — the emission of electrons when light strikes a metal surface — provided the first direct evidence that light is quantized into packets called photons. Albert Einstein explained in 1905 that each photon carries energy E = hν. An electron is only ejected if the photon\'s energy exceeds the work function (Φ) of the metal.',
        },
        {
          type: 'formula',
          latex: 'E_{\\text{photon}} = h\\nu = \\frac{hc}{\\lambda}',
          display: true,
          caption: 'h = 6.626 × 10⁻³⁴ J·s (Planck\'s constant), ν = frequency, λ = wavelength, c = 3.00 × 10⁸ m/s',
        },
        {
          type: 'formula',
          latex: 'KE_{\\text{electron}} = h\\nu - \\Phi',
          display: true,
          caption: 'Φ = work function (minimum energy to eject an electron); KE = 0 if hν < Φ',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Two Key Observations That Proved Quantization',
          body: '1. Threshold frequency: below a certain ν, NO electrons are ejected regardless of light intensity. (Classical wave theory predicted intensity, not frequency, should matter.)\n2. Electron KE increases with frequency, not intensity. Increasing intensity only increases the NUMBER of ejected electrons, not their energy.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Connecting Photoelectric Effect to PES',
          body: 'Photoelectron spectroscopy (Unit 1) is essentially the photoelectric effect applied to inner-shell electrons with high-energy X-ray/UV photons. The binding energy measured in PES is the work function for that specific orbital. The same equation applies: KE = E_photon − E_binding.',
        },
        {
          type: 'text',
          body: 'Electrical conductivity depends on the availability of mobile charge carriers. In metals, the partially filled band of delocalized electrons (conduction band) is always populated — metals are conductors at all temperatures. In semiconductors (Si, Ge), a small energy gap exists; thermal energy or dopants promote electrons into the conduction band. In insulators, the gap is large and electrons cannot be promoted under normal conditions.',
        },
      ],
      mcqs: [
        {
          question: 'Light of frequency 8.0 × 10¹⁴ Hz strikes a metal with work function 2.0 × 10⁻¹⁹ J. What is the kinetic energy of the ejected electrons? (h = 6.626 × 10⁻³⁴ J·s)',
          options: ['3.3 × 10⁻¹⁹ J', '5.3 × 10⁻¹⁹ J', '7.3 × 10⁻¹⁹ J', 'No electrons ejected'],
          correct: 0,
          explanation: 'E_photon = hν = 6.626 × 10⁻³⁴ × 8.0 × 10¹⁴ = 5.3 × 10⁻¹⁹ J. KE = E − Φ = 5.3 × 10⁻¹⁹ − 2.0 × 10⁻¹⁹ = 3.3 × 10⁻¹⁹ J.',
        },
        {
          question: 'For the photoelectric effect, doubling the INTENSITY of light (at the same frequency above the threshold) will:',
          options: [
            'Double the kinetic energy of ejected electrons',
            'Double the number of ejected electrons but not change their KE',
            'Cause no electrons to be ejected',
            'Increase the threshold frequency',
          ],
          correct: 1,
          explanation: 'Intensity determines the number of photons per unit time. Each photon still carries the same energy hν. More photons → more electrons ejected per second, but each electron still has KE = hν − Φ (unchanged). This was a key result that disproved the classical wave model.',
        },
        {
          question: 'Which type of solid is typically a semiconductor?',
          options: ['Ionic solid (NaCl)', 'Metallic solid (Cu)', 'Covalent network solid with a small band gap (Si)', 'Molecular solid (I₂)'],
          correct: 2,
          explanation: 'Silicon is a covalent network solid with a small band gap (~1.1 eV). Thermal energy or added dopants promote electrons across the gap into the conduction band, enabling controllable conductivity. Metals conduct without any gap; ionic and molecular solids have large gaps and are insulators.',
        },
      ],
      flashcards: [
        { front: 'What is the photoelectric effect?', back: 'Ejection of electrons from a metal surface when struck by photons of sufficient energy (hν ≥ Φ, the work function)' },
        { front: 'Formula for photoelectric effect', back: 'KE = hν − Φ. h = Planck\'s constant, ν = photon frequency, Φ = work function (binding energy of electron)' },
        { front: 'What is a threshold frequency?', back: 'The minimum photon frequency needed to eject an electron. Below this, no electrons are emitted regardless of light intensity.' },
        { front: 'What happens to KE of ejected electrons when light intensity doubles (same frequency)?', back: 'KE is unchanged. More photons → more electrons ejected, but each photon still has the same energy.' },
      ],
    },

    // ── Concept 4: Solutions and Solubility ──────────────────────────────────
    {
      id: 'u3-c4-solutions',
      title: 'Solutions & Solubility',
      subtitle: 'Like dissolves like — and why',
      estimatedMinutes: 11,
      accentHex: '#fb7185',
      blocks: [
        {
          type: 'text',
          body: 'A solution is a homogeneous mixture of two or more components. The solvent is the dissolving medium (present in greater amount); the solute is dissolved. "Like dissolves like" is the fundamental solubility principle: polar and ionic solutes dissolve in polar solvents (water); nonpolar solutes dissolve in nonpolar solvents (hexane).',
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'Dissolving as an Energy Battle',
          body: 'Three energy steps occur when dissolving:\n1. Separate solvent molecules (break solvent–solvent IMFs) — endothermic (+)\n2. Separate solute particles (break solute–solute forces) — endothermic (+)\n3. Form solute–solvent interactions (solvation/hydration) — exothermic (−)\nA substance dissolves if step 3 releases enough energy to offset steps 1 + 2. ΔH_soln = ΔH₁ + ΔH₂ + ΔH₃.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Hydration Enthalpy vs. Lattice Energy',
          body: 'For ionic salts: ΔH_soln = −ΔH_lattice + ΔH_hydration. If hydration energy (released by ion-dipole forces with water) exceeds lattice energy, dissolution is spontaneous. NaCl dissolves because hydration energy is nearly equal to lattice energy. MgO barely dissolves because its lattice energy far exceeds its hydration energy.',
        },
        {
          type: 'formula',
          latex: 'C = \\frac{n_{\\text{solute}}}{V_{\\text{solution (L)}}} \\quad [\\text{mol/L or M}]',
          display: true,
          caption: 'Molarity (M) — the most common AP Chemistry concentration unit',
        },
        {
          type: 'text',
          body: 'Solubility of gases in liquids follows Henry\'s Law: solubility increases with partial pressure of the gas above the liquid (more collisions force gas into solution). Solubility of gases decreases with increasing temperature (exothermic dissolution for most gases). Solubility of solid solutes in water generally increases with temperature (but there are exceptions — e.g., Ce₂(SO₄)₃ becomes less soluble when heated).',
        },
        {
          type: 'formula',
          latex: 'S_g = k_H \\cdot P_g',
          display: true,
          caption: 'Henry\'s Law: S = solubility of gas, k_H = Henry\'s constant, P_g = partial pressure of gas',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Electrolytes vs. Non-electrolytes',
          body: 'Strong electrolytes fully dissociate in water (NaCl → Na⁺ + Cl⁻; strong acids and bases). Weak electrolytes partially dissociate (acetic acid, NH₃). Non-electrolytes dissolve but don\'t ionize (glucose, ethanol).\nColligative properties (BP elevation, FP depression, osmotic pressure) depend on the number of solute particles, not their identity — so NaCl (2 particles) has twice the effect of glucose (1 particle) at the same molality.',
        },
      ],
      mcqs: [
        {
          question: 'Which solute is most soluble in hexane (a nonpolar solvent)?',
          options: ['NaCl (ionic)', 'KOH (ionic)', 'I₂ (nonpolar)', 'NH₃ (polar)'],
          correct: 2,
          explanation: '"Like dissolves like." Hexane is nonpolar — it forms strong LDF interactions with nonpolar solutes. I₂ is nonpolar and dissolves readily in hexane. Ionic NaCl and KOH require polar solvent water to provide ion-dipole interactions. Polar NH₃ prefers polar solvents.',
        },
        {
          question: 'A carbonated beverage is bottled under high CO₂ pressure. When the bottle is opened, CO₂ rapidly escapes. Which law explains this?',
          options: ['Raoult\'s Law', 'Henry\'s Law', 'Boyle\'s Law', 'Hess\'s Law'],
          correct: 1,
          explanation: 'Henry\'s Law: gas solubility ∝ partial pressure of that gas. Under high CO₂ pressure, CO₂ is highly soluble. Opening the bottle drops P(CO₂) to ~0.0004 atm (atmospheric), so the equilibrium solubility plummets and CO₂ rapidly escapes as bubbles.',
        },
        {
          question: 'Which aqueous solution would have the lowest freezing point? All at the same molality (m).',
          options: ['glucose (C₆H₁₂O₆)', 'NaCl', 'CaCl₂', 'AlCl₃'],
          correct: 3,
          explanation: 'Freezing point depression: ΔTf = i × Kf × m. "i" is the van\'t Hoff factor (particles per formula unit). AlCl₃ → Al³⁺ + 3Cl⁻ → i = 4 (most particles). CaCl₂: i = 3. NaCl: i = 2. Glucose: i = 1. AlCl₃ has the largest ΔTf → lowest FP.',
        },
      ],
      flashcards: [
        { front: '"Like dissolves like" — what does this mean?', back: 'Polar solutes dissolve in polar solvents (water). Nonpolar solutes dissolve in nonpolar solvents (hexane). Mismatched polarity → low solubility.' },
        { front: 'Henry\'s Law', back: 'S_gas = k_H × P_gas. Gas solubility is directly proportional to its partial pressure above the liquid. Higher pressure → more gas dissolved.' },
        { front: 'What is ΔH_soln for NaCl dissolving in water?', back: 'Slightly endothermic (+3.9 kJ/mol) — lattice energy exceeds hydration energy slightly, but entropy drives dissolution' },
        { front: 'Van\'t Hoff factor (i) for CaCl₂?', back: 'i = 3 (Ca²⁺ + 2 Cl⁻). At the same molality, CaCl₂ has 3× the colligative effect of glucose (i = 1).' },
        { front: 'How does temperature affect gas solubility?', back: 'Gas solubility DECREASES with increasing temperature (dissolving gas is exothermic; Le Chatelier: heating shifts equilibrium to produce less dissolved gas)' },
      ],
    },

    // ── Concept 5: Separation of Mixtures ────────────────────────────────────
    {
      id: 'u3-c5-separation',
      title: 'Separation of Mixtures',
      subtitle: 'Filtration, distillation, and chromatography',
      estimatedMinutes: 8,
      accentHex: '#f472b6',
      blocks: [
        {
          type: 'text',
          body: 'Mixtures can be separated by exploiting differences in physical properties between components — no chemical reaction involved. The choice of technique depends on the nature of the mixture (solid-liquid, liquid-liquid, or dissolved components) and the property being exploited (particle size, boiling point, or polarity/affinity for a stationary phase).',
        },
        {
          type: 'table',
          headers: ['Technique', 'Separates', 'Physical property used', 'Examples'],
          rows: [
            ['Filtration', 'Solid from liquid', 'Particle size', 'Sand from saltwater'],
            ['Distillation', 'Liquids from liquids (or dissolved solid)', 'Boiling point difference', 'Ethanol-water, crude oil fractionation'],
            ['Crystallization', 'Solid solute from solution', 'Solubility vs. temperature', 'Purifying sugar or salt'],
            ['Chromatography', 'Components in a mixture', 'Affinity for stationary vs. mobile phase', 'Amino acids (paper), drugs (HPLC)'],
            ['Extraction', 'Solute between two immiscible solvents', 'Relative solubility (partition)', 'Caffeine from tea using DCM'],
          ],
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Chromatography: Polarity Drives Separation',
          body: 'In paper/thin-layer chromatography (TLC), the stationary phase (paper/silica) is polar and the mobile phase (solvent) moves up by capillary action. Polar compounds interact strongly with the polar stationary phase → move slowly → low Rf. Nonpolar compounds prefer the nonpolar mobile phase → move quickly → high Rf.\nRf = (distance traveled by spot) / (distance traveled by solvent front). Range: 0–1.',
        },
        {
          type: 'formula',
          latex: 'R_f = \\frac{d_{\\text{solute}}}{d_{\\text{solvent}}}',
          display: true,
          caption: 'Rf (retardation factor) — unique for each compound under fixed conditions',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Distillation Success Requires Large ΔBP',
          body: 'Simple distillation works well when Δ(boiling points) > 25°C. For closely boiling mixtures (e.g., benzene-toluene), fractional distillation (a fractionating column) is needed. The component with the lower boiling point enriches the vapour at each stage and distils first.',
        },
      ],
      mcqs: [
        {
          question: 'In thin-layer chromatography (TLC) with a polar stationary phase, which compound will have the highest Rf value?',
          options: [
            'A highly polar compound with many OH groups',
            'A moderately polar compound',
            'A nonpolar hydrocarbon',
            'An ionic compound',
          ],
          correct: 2,
          explanation: 'Rf = distance spot moves / distance solvent moves. A nonpolar compound has little attraction to the polar stationary phase (silica/paper) and is carried far by the mobile phase → high Rf. Polar and ionic compounds adhere strongly to the polar stationary phase → low Rf.',
        },
        {
          question: 'Which technique is best for separating ethanol (BP 78°C) from water (BP 100°C)?',
          options: ['Filtration', 'Simple distillation', 'Crystallization', 'Magnetic separation'],
          correct: 1,
          explanation: 'Ethanol and water form a homogeneous liquid mixture. Filtration requires solid-liquid separation. Crystallization requires a solid solute. Distillation uses boiling point difference (78 vs. 100°C → ΔBP = 22°C, workable for simple distillation, better with fractional distillation) to separate them by vapour pressure.',
        },
        {
          question: 'A mixture of sand and NaCl(aq) is processed. What sequence of steps separates both components?',
          options: [
            'Filtration only',
            'Distillation, then crystallization',
            'Filtration (remove sand), then evaporation/crystallization (recover NaCl)',
            'Chromatography',
          ],
          correct: 2,
          explanation: 'First: filter to separate the insoluble sand from the NaCl solution (exploits particle size). Then: evaporate the water or crystallize to recover pure solid NaCl (exploits solubility). Two physical steps, no chemistry needed.',
        },
      ],
      flashcards: [
        { front: 'What is Rf in chromatography?', back: 'Rf = distance traveled by compound / distance traveled by solvent front. Range 0–1. Higher Rf = less polar (for polar stationary phase).' },
        { front: 'What property does distillation exploit?', back: 'Differences in boiling point (vapour pressure) between liquid components. The lower-BP component distils first.' },
        { front: 'What property does filtration exploit?', back: 'Particle size — solids too large to pass through filter paper are retained; dissolved solutes and liquid pass through.' },
        { front: 'Why does a polar compound have a low Rf on TLC (polar stationary phase)?', back: 'The polar compound strongly adsorbs to the polar stationary phase (silica/alumina), slowing its movement relative to the solvent front.' },
      ],
    },

    // ── Concept 6: Spectroscopy — IR and Mass Spec ───────────────────────────
    {
      id: 'u3-c6-spectroscopy',
      title: 'Spectroscopy — UV/Vis, IR, and MS',
      subtitle: 'Light and matter interaction for identification',
      estimatedMinutes: 10,
      accentHex: '#fb7185',
      blocks: [
        {
          type: 'text',
          body: 'Spectroscopy uses the interaction of electromagnetic radiation with matter to probe structure, composition, and bonding. Three spectroscopic techniques appear on the AP Chemistry exam: UV-Visible absorption, infrared (IR) absorption, and mass spectrometry (covered in Unit 1). Each probes a different aspect of molecular structure.',
        },
        {
          type: 'table',
          headers: ['Technique', 'Region used', 'What it measures', 'Information obtained'],
          rows: [
            ['UV-Vis', 'UV (200–400 nm) + visible (400–700 nm)', 'Electronic transitions (excited electrons)', 'Conjugation, color, concentration (Beer-Lambert law)'],
            ['IR spectroscopy', 'Infrared (~2.5–25 μm)', 'Molecular vibrations (stretching, bending)', 'Functional groups (–OH, C=O, N–H, C–H, etc.)'],
            ['Mass spectrometry', 'N/A (ions, not light)', 'Mass-to-charge ratio (m/z)', 'Molar mass, isotope pattern, molecular formula'],
          ],
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Beer-Lambert Law — Concentration from Absorbance',
          body: 'A = εlc\nA = absorbance (no units, 0–∞)\nε = molar absorptivity (L mol⁻¹ cm⁻¹, characteristic of molecule at that λ)\nl = path length of sample cell (cm)\nc = concentration (mol/L)\nAt a fixed wavelength and path length, absorbance is directly proportional to concentration. Used in colorimetry to determine unknown concentrations.',
        },
        {
          type: 'formula',
          latex: 'A = \\varepsilon l c',
          display: true,
          caption: 'Beer-Lambert Law: A = absorbance, ε = molar absorptivity, l = path length, c = concentration',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'IR Fingerprints: Key Absorptions to Know',
          body: '~3200–3600 cm⁻¹ broad: O–H stretch (alcohols, acids) or N–H stretch\n~1700–1750 cm⁻¹: C=O stretch (ketone, aldehyde, carboxylic acid, ester) — very strong\n~2850–3000 cm⁻¹: C–H stretch (alkanes)\n~1600–1650 cm⁻¹: C=C stretch (alkenes)\nAP questions provide IR spectra and ask you to identify functional groups.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Using Beer-Lambert for Calibration Curves',
          body: 'A common AP FRQ: given absorbance data for known concentrations (calibration curve), determine the concentration of an unknown. Plot A vs. c — linear relationship. Read the unknown\'s A on the y-axis and trace across to find c. The slope of the line = ε × l.',
        },
      ],
      mcqs: [
        {
          question: 'A solution has an absorbance of 0.60 at a specific wavelength. When the concentration is halved, the new absorbance is:',
          options: ['0.15', '0.30', '0.60', '1.20'],
          correct: 1,
          explanation: 'Beer-Lambert Law: A = εlc. At constant ε and l, A ∝ c. Halving c halves A: 0.60 / 2 = 0.30.',
        },
        {
          question: 'Which IR absorption indicates the presence of a carbonyl (C=O) group?',
          options: [
            '~3200–3600 cm⁻¹ (broad)',
            '~2850–3000 cm⁻¹ (medium)',
            '~1700–1750 cm⁻¹ (strong)',
            '~1600–1650 cm⁻¹ (medium)',
          ],
          correct: 2,
          explanation: 'The C=O stretch in carbonyl compounds (ketones, aldehydes, esters, carboxylic acids) appears as a strong, sharp peak at ~1700–1750 cm⁻¹. This is one of the most diagnostic absorptions in IR spectroscopy.',
        },
        {
          question: 'A compound appears blue to the human eye. Which wavelengths of light does it absorb?',
          options: [
            'Blue wavelengths (~450 nm)',
            'Red and orange wavelengths (~600–700 nm)',
            'All visible wavelengths equally',
            'Ultraviolet wavelengths only',
          ],
          correct: 1,
          explanation: 'The perceived color is the complementary color of the absorbed color. Blue (observed) is complementary to orange/red. The compound absorbs orange-red light (~600–700 nm) and transmits/reflects the remaining blue light, which is what we see.',
        },
      ],
      flashcards: [
        { front: 'Beer-Lambert Law — what does it relate?', back: 'A = εlc: absorbance is directly proportional to both molar absorptivity (ε), path length (l), and concentration (c)' },
        { front: 'What does an IR peak at ~1720 cm⁻¹ indicate?', back: 'C=O stretch — presence of a carbonyl group (ketone, aldehyde, ester, or carboxylic acid)' },
        { front: 'What does a broad IR peak at ~3200–3600 cm⁻¹ indicate?', back: 'O–H stretch (alcohols or carboxylic acids) — broad due to hydrogen bonding, or N–H stretch (amines, amides)' },
        { front: 'If a compound appears yellow, what color does it absorb?', back: 'Violet/purple (~400–420 nm) — the complementary color of yellow' },
      ],
    },

  ],
}
