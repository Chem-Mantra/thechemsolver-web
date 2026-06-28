import type { Metadata } from 'next'
import ChemEbook, { EbookUnit } from '@/app/components/ChemEbook'

export const metadata: Metadata = {
  title: 'Free AP Chemistry eBook — Units 1–9 + USNCO + IChO | TheChemSolver',
  description: 'Complete free AP Chemistry study guide covering all 9 units plus advanced USNCO and IChO topics: crystal field theory, advanced thermodynamics, stereochemistry, and coordination chemistry. Clear explanations, formulas, and exam strategy.',
  keywords: ['AP Chemistry study guide free', 'AP chem unit 1 through 9', 'USNCO study guide', 'IChO preparatory notes', 'chemistry ebook free', 'AP chemistry notes PDF alternative'],
}

const UNITS: EbookUnit[] = [
  {
    id: 'unit1',
    number: 'Unit 1',
    title: 'Atomic Structure & Properties',
    color: 'text-blue-400',
    sections: [
      {
        id: 'u1-moles',
        title: 'Moles and Molar Mass',
        content: `The mole is the fundamental counting unit of chemistry, defined as exactly 6.02214076 × 10²³ entities (Avogadro's number). This definition was formally adopted in 2019, replacing the older definition based on carbon-12. One mole of any substance contains the same number of particles — whether atoms, molecules, ions, or formula units.

Molar mass is the mass of one mole of a substance, expressed in grams per mole (g/mol). For elements, the molar mass equals the atomic mass shown on the periodic table in atomic mass units (u or Da). For compounds, add the molar masses of all atoms in one formula unit: for H₂O, M = 2(1.008) + 15.999 = 18.015 g/mol.

## Converting Between Grams, Moles, and Particles

The mole acts as a bridge between the macroscopic (laboratory) scale and the microscopic (atomic) scale. Three conversions connect these worlds:

>> moles = mass (g) ÷ molar mass (g/mol)

>> particles = moles × 6.022 × 10²³

>> mass (g) = moles × molar mass (g/mol)

For example, 36.03 g of H₂O contains 36.03 / 18.015 = 2.000 mol of water molecules, or 2.000 × 6.022 × 10²³ = 1.204 × 10²⁴ molecules.

## Percent Composition and Empirical Formulas

Percent composition by mass is calculated as: % element = (mass of element in 1 mol of compound / molar mass of compound) × 100. This is tested directly on the AP Chemistry exam in MCQ format.

The empirical formula is the simplest whole-number ratio of atoms in a compound. To find it from percent composition: (1) assume 100 g of compound, (2) convert grams of each element to moles, (3) divide all mole amounts by the smallest, (4) round to whole numbers (or multiply to eliminate fractions). The molecular formula is a whole-number multiple of the empirical formula: molecular formula mass / empirical formula mass gives the multiplier.`,
      },
      {
        id: 'u1-quantum',
        title: 'Quantum Numbers & Electron Configuration',
        content: `Quantum mechanics describes the behavior of electrons in atoms through wave functions — mathematical functions whose square gives the probability of finding an electron at a given location. Each allowed state for an electron is specified by four quantum numbers that arise naturally from solving the Schrödinger equation for hydrogen.

## The Four Quantum Numbers

The principal quantum number n (n = 1, 2, 3, ...) determines the energy level and overall size of the orbital. Higher n means higher energy and greater average distance from the nucleus. The maximum electrons in energy level n is 2n².

The angular momentum quantum number l (l = 0, 1, ..., n−1) determines the shape of the orbital. l = 0 is an s orbital (spherical); l = 1 is a p orbital (dumbbell); l = 2 is a d orbital (four-lobed, generally); l = 3 is an f orbital. For n = 3, l can be 0, 1, or 2.

The magnetic quantum number mₗ (mₗ = −l, ..., 0, ..., +l) specifies the orientation of the orbital in space. For l = 1, mₗ = −1, 0, +1 — the three p orbitals (px, py, pz).

The spin quantum number ms (+½ or −½) describes the intrinsic angular momentum (spin) of the electron.

## Building Electron Configurations

Three rules govern how electrons fill orbitals:

>> Aufbau principle: electrons fill the lowest available energy orbital first (1s → 2s → 2p → 3s → 3p → 4s → 3d ...).

>> Pauli exclusion principle: no two electrons in an atom share the same four quantum numbers. Each orbital holds at most two electrons with opposite spins.

>> Hund's rule: electrons occupy degenerate (equal-energy) orbitals singly before pairing. This minimizes electron-electron repulsion.

Exception configurations memorized for the AP exam: Cr = [Ar]3d⁵4s¹ (half-filled d) and Cu = [Ar]3d¹⁰4s¹ (fully filled d), because these are especially stable configurations.`,
      },
      {
        id: 'u1-periodic-trends',
        title: 'Periodic Trends',
        content: `Periodic trends arise from the interplay of nuclear charge (Z), electron shielding, and the principal quantum number n. Understanding trends — rather than memorizing them — allows you to predict properties of unfamiliar elements and answer AP Chemistry MCQs efficiently.

## Effective Nuclear Charge (Zeff)

Core electrons shield valence electrons from the full nuclear charge. The effective nuclear charge felt by a valence electron is approximately Zeff = Z − σ, where σ is the shielding constant (roughly equal to the number of core electrons for simple estimates). Across a period, Z increases while shielding barely changes, so Zeff increases — pulling electrons closer and increasing many trends in that direction.

## Atomic Radius

Atomic radius decreases across a period (left to right): increasing Zeff pulls electrons inward. Atomic radius increases down a group: adding a principal quantum level (n) increases the distance of valence electrons from the nucleus, outweighing the modest increase in Zeff.

## Ionization Energy

First ionization energy (IE₁) is the energy required to remove one electron from a neutral gas-phase atom: X(g) → X⁺(g) + e⁻. IE₁ generally increases across a period and decreases down a group — the inverse of atomic radius. Notable exceptions occur at Groups 3 and 6 (e.g., IE₁ of O < IE₁ of N) because removing an electron from a doubly occupied orbital (O) releases electron-electron repulsion, and removing an electron from a half-filled, stable configuration (N: 2p³) requires extra energy.

## Electronegativity and Electron Affinity

Electronegativity (Pauling scale) measures the tendency of a bonded atom to attract electrons. It increases across periods and decreases down groups. Fluorine (χ = 3.98) is the most electronegative element. Electron affinity is the energy change when a neutral atom gains an electron. Trends are similar to electronegativity but with more exceptions due to orbital stability effects.`,
      },
    ],
  },
  {
    id: 'unit2',
    number: 'Unit 2',
    title: 'Molecular Structure & Properties',
    color: 'text-violet-400',
    sections: [
      {
        id: 'u2-bonding',
        title: 'Chemical Bonding',
        content: `Chemical bonds form when atoms interact in ways that lower their total energy. The three primary bond types — ionic, covalent, and metallic — differ in how electrons are shared or transferred, and these differences produce dramatically different macroscopic properties.

## Ionic Bonds

Ionic bonds form between atoms with large electronegativity differences (generally > 1.7 on the Pauling scale), typically a metal and a nonmetal. The more electronegative atom removes electron(s) from the less electronegative atom, forming cations (positive) and anions (negative). The electrostatic attraction between oppositely charged ions is the ionic bond.

Lattice energy — the energy released when gaseous ions form a crystalline solid — determines many properties of ionic compounds: melting point, solubility, and hardness. Lattice energy increases with greater ionic charge and smaller ionic radius, following the Born-Landé or simplified Kapustinskii equation.

## Covalent Bonds

In covalent bonds, atoms share electrons rather than fully transferring them. A single bond shares 2 electrons (one pair); a double bond shares 4; a triple bond shares 6. Triple bonds are the shortest and strongest of the three.

Bond polarity depends on the electronegativity difference between bonded atoms. A polar covalent bond (Δχ between ~0.4 and 1.7) has an asymmetric electron distribution, creating a bond dipole. In molecules, the vector sum of bond dipoles determines whether the molecule is polar overall.

## Lewis Structures

Lewis structures represent valence electrons as dots or lines. The procedure: (1) count total valence electrons, (2) connect atoms with single bonds, (3) complete octets on terminal atoms with lone pairs, (4) give remaining electrons to the central atom, (5) convert lone pairs to double or triple bonds if the central atom lacks an octet. Formal charge = (valence e⁻) − (lone pair e⁻) − ½(bonding e⁻). Minimize formal charges to identify the best resonance structure.`,
      },
      {
        id: 'u2-vsepr',
        title: 'VSEPR and Molecular Geometry',
        content: `VSEPR (Valence Shell Electron Pair Repulsion) theory predicts molecular geometry by minimizing repulsion among all electron pairs — both bonding pairs and lone pairs — around a central atom. Developed by Sidgwick and Powell and refined by Gillespie and Nyholm, VSEPR gives accurate geometries for most main-group compounds with remarkable simplicity.

## Electron Geometry vs. Molecular Geometry

The electron geometry is the arrangement of all electron pairs (bonding and lone pairs). The molecular geometry describes only the arrangement of atoms. These are identical when no lone pairs are present; they differ when lone pairs occupy positions.

For 4 electron pairs (tetrahedral electron geometry): with 0 lone pairs → tetrahedral molecular geometry, 109.5° bond angles; with 1 lone pair → trigonal pyramidal, ~107°; with 2 lone pairs → bent, ~104.5°. Each lone pair compresses bond angles more than a bonding pair because lone pairs are held closer to the nucleus and exert stronger repulsion.

## Polarity from Geometry

A molecule is nonpolar if either: (a) it contains no polar bonds, or (b) it has polar bonds that cancel due to symmetry. CO₂ is linear and perfectly symmetric — its two C=O dipoles point in opposite directions and cancel, making CO₂ a nonpolar molecule despite having polar bonds. Water is bent (due to two lone pairs), so its two O–H dipoles do not cancel — water is polar (μ = 1.85 D).

>> Polar: H₂O, NH₃, HCl, CH₃Cl, SO₂
>> Nonpolar: CO₂, BF₃, CCl₄, SF₆, XeF₄`,
      },
    ],
  },
  {
    id: 'unit7',
    number: 'Unit 7',
    title: 'Equilibrium',
    color: 'text-emerald-400',
    sections: [
      {
        id: 'u7-equilibrium',
        title: 'Chemical Equilibrium & K',
        content: `Chemical equilibrium is reached when the rates of the forward and reverse reactions become equal, resulting in constant concentrations of all species. Equilibrium does not mean the reaction has stopped — both directions continue at equal rates. This dynamic character is fundamental to understanding why equilibrium can be disturbed and re-established.

## The Equilibrium Constant K

For a general reaction aA + bB ⇌ cC + dD, the equilibrium constant is:

>> Kc = [C]^c [D]^d / ([A]^a [B]^b)

where square brackets denote molar concentrations at equilibrium. Pure solids and liquids are omitted from K expressions because their concentrations are constant (activity = 1).

For gas-phase reactions, Kp uses partial pressures: Kp = Kc(RT)^Δn, where Δn = (moles of gaseous products) − (moles of gaseous reactants).

The magnitude of K tells you the position of equilibrium: K >> 1 means products dominate; K << 1 means reactants dominate. The AP exam frequently asks you to distinguish between these cases and predict the direction of reaction from K.

## Reaction Quotient Q and Le Chatelier's Principle

Q has the same mathematical form as K but uses non-equilibrium concentrations. Comparing Q to K predicts the direction of shift: if Q < K, the reaction shifts right (toward products); if Q > K, it shifts left.

Le Chatelier's principle: a system at equilibrium adjusts to minimize the effect of any stress applied. Adding reactant shifts the equilibrium right. Increasing pressure (decreasing volume) shifts toward fewer moles of gas. Increasing temperature shifts an endothermic reaction right (and decreases K for an exothermic reaction). A catalyst has no effect on equilibrium position — it speeds up both forward and reverse reactions equally.`,
      },
      {
        id: 'u7-ice',
        title: 'ICE Tables & Calculation Methods',
        content: `The ICE table (Initial, Change, Equilibrium) is the standard quantitative tool for solving equilibrium problems. Mastering ICE tables is essential for both AP Chemistry free response questions and USNCO Part II problems.

## ICE Table Setup

Set up columns for each species in the equilibrium expression. Row 1: initial concentrations (before any reaction toward equilibrium). Row 2: changes in concentration (−x for species that decrease, +x for species that increase, with stoichiometric coefficients as multipliers). Row 3: equilibrium concentrations (Initial + Change).

Example: H₂(g) + I₂(g) ⇌ 2HI(g), Kc = 50 at 445°C. Initial: [H₂] = [I₂] = 0.100 M, [HI] = 0 M.

>> Change: −x, −x, +2x
>> Equilibrium: (0.100−x), (0.100−x), 2x

Substituting into Kc = [HI]²/([H₂][I₂]):

>> 50 = (2x)² / (0.100−x)²

Taking the square root: √50 = 2x/(0.100−x), so 7.071(0.100−x) = 2x. Solving: x = 0.0780 M.

Final concentrations: [H₂] = [I₂] = 0.022 M; [HI] = 0.156 M.

## The 5% Rule

When K is small (< 10⁻³), the change x is often much smaller than the initial concentration. You can approximate: (C − x) ≈ C, simplifying the algebra to avoid the quadratic formula. After solving, verify the approximation is valid: x/C < 5%. If not, solve the full quadratic.

## Ksp and Solubility

For sparingly soluble ionic compounds like AgCl ⇌ Ag⁺ + Cl⁻, Ksp = [Ag⁺][Cl⁻]. The molar solubility s equals [Ag⁺] = [Cl⁻] = √Ksp. The common ion effect reduces solubility: if Cl⁻ is already present from another source, the equilibrium shifts left, precipitating more AgCl.`,
      },
    ],
  },
  {
    id: 'unit8',
    number: 'Unit 8',
    title: 'Acids, Bases & Buffers',
    color: 'text-rose-400',
    sections: [
      {
        id: 'u8-acidbase',
        title: 'Acid-Base Theories',
        content: `Three frameworks for acids and bases are used in chemistry, each progressively more general. The AP Chemistry course emphasizes Brønsted-Lowry; USNCO and IChO require fluency with all three.

## Arrhenius Definition (1884)

Acid: produces H⁺ (or H₃O⁺) in aqueous solution. Base: produces OH⁻ in aqueous solution. This is the most restrictive definition — it only applies to aqueous systems and does not explain why NH₃ behaves as a base.

## Brønsted-Lowry Definition (1923)

Acid: proton (H⁺) donor. Base: proton acceptor. Every Brønsted-Lowry acid-base reaction involves proton transfer. NH₃ + H₂O ⇌ NH₄⁺ + OH⁻: water is the acid (donates H⁺), NH₃ is the base (accepts H⁺). After the reaction, NH₄⁺ is the conjugate acid of NH₃, and OH⁻ is the conjugate base of H₂O.

Conjugate pairs differ by exactly one H⁺. A strong acid has a very weak conjugate base (the anion of a strong acid, like Cl⁻, has essentially no basic character). A weak acid has a moderately weak conjugate base that can accept protons. The quantitative relationship: Ka × Kb = Kw = 1.0 × 10⁻¹⁴ at 25°C for a conjugate acid-base pair.

## Lewis Definition (1923)

Acid: electron pair acceptor. Base: electron pair donor. This is the most general framework. BF₃ + NH₃ → F₃B:NH₃ — BF₃ is a Lewis acid (accepts the lone pair of N); NH₃ is a Lewis base. This explains coordination chemistry, where metal ions (Lewis acids) accept electron pairs from ligands (Lewis bases). All Brønsted-Lowry acids are Lewis acids, but not vice versa.`,
      },
      {
        id: 'u8-buffers',
        title: 'Buffer Solutions',
        content: `A buffer is a solution that resists changes in pH when small amounts of strong acid or strong base are added. Buffers consist of a weak acid and its conjugate base (or a weak base and its conjugate acid) in similar concentrations.

## Henderson-Hasselbalch Equation

For a weak acid HA and its conjugate base A⁻:

>> pH = pKa + log([A⁻]/[HA])

At the half-equivalence point in a titration, [HA] = [A⁻] and pH = pKa exactly. This is the point of maximum buffering capacity — the pH changes most slowly per unit of added acid or base. The buffer works effectively in the pH range pKa ± 1.

## Buffer Capacity

Buffer capacity is the amount of acid or base (in moles) a buffer can absorb before the pH changes significantly. A buffer has greater capacity when: (1) the concentrations of HA and A⁻ are larger (more moles available to react), and (2) the ratio [A⁻]/[HA] is close to 1 (both components present in quantity).

## Choosing a Buffer System

To prepare a buffer at a target pH, choose a weak acid with pKa within 1 unit of the desired pH. For a blood buffer at pH 7.4, the carbonate system (H₂CO₃/HCO₃⁻, pKa = 6.35) and phosphate system (H₂PO₄⁻/HPO₄²⁻, pKa = 7.21) are physiologically relevant. The phosphate buffer is actually used in laboratory cell culture media.

## Buffer Calculations

When strong base OH⁻ is added to a buffer containing HA and A⁻: OH⁻ reacts quantitatively with HA to form A⁻ and water. Recalculate the new [HA] and [A⁻] concentrations and substitute into Henderson-Hasselbalch. Similarly for added H₃O⁺: it reacts with A⁻ to form HA.`,
      },
    ],
  },
  {
    id: 'usnco',
    number: 'USNCO',
    title: 'Advanced Topics for USNCO',
    color: 'text-orange-400',
    sections: [
      {
        id: 'usnco-thermo',
        title: 'Advanced Thermodynamics',
        content: `The USNCO national examination tests thermodynamics well beyond the AP Chemistry level, requiring fluency with Gibbs free energy, the van't Hoff equation, activity, and non-ideal behavior.

## Gibbs Free Energy in Depth

ΔG = ΔH − TΔS at constant temperature and pressure. The sign of ΔG determines spontaneity: ΔG < 0 is spontaneous; ΔG > 0 is non-spontaneous (the reverse is spontaneous); ΔG = 0 is equilibrium. The four sign combinations of ΔH and ΔS:

>> ΔH < 0, ΔS > 0: always spontaneous (favored at all T)
>> ΔH > 0, ΔS < 0: never spontaneous (ΔG always positive)
>> ΔH < 0, ΔS < 0: spontaneous only at low T (entropy term TΔS becomes dominant at high T)
>> ΔH > 0, ΔS > 0: spontaneous only at high T

The crossover temperature where ΔG = 0: T = ΔH/ΔS. Above this T (for ΔH > 0, ΔS > 0), the entropy term wins.

## The van't Hoff Equation

The temperature dependence of K is described by:

>> ln(K₂/K₁) = −(ΔH°/R)(1/T₂ − 1/T₁)

This allows calculation of ΔH° from two K values at different temperatures, or prediction of K at a new temperature from ΔH°. A plot of ln K vs. 1/T (van't Hoff plot) has slope = −ΔH°/R and y-intercept = ΔS°/R.

## Activity and Non-Ideal Solutions

At concentrations above ~0.1 M, ionic solutions deviate from ideality. Activity aᵢ = γᵢ[cᵢ/c°], where γᵢ is the activity coefficient and c° = 1 M. For ideal solutions, γ = 1. Strong electrolytes with high charge and small size depress γ significantly. The Debye-Hückel limiting law: log γ± = −0.509|z₊z₋|√I, where I is the ionic strength.`,
      },
      {
        id: 'usnco-coordination',
        title: 'Crystal Field Theory (CFT)',
        content: `Crystal field theory is an electrostatic model that explains the color, magnetism, and stability of transition metal coordination compounds. It is among the most frequently tested advanced topics in USNCO national examinations and IChO theoretical problems.

## d-Orbital Splitting in Octahedral Complexes

In an isolated metal ion, all five d orbitals are degenerate. When six ligands approach along ±x, ±y, ±z axes (octahedral geometry), they repel electrons in d orbitals differently: the dz² and dx²−y² orbitals (eᵍ set) point directly at the ligands and are destabilized more; the dxy, dxz, dyz orbitals (t₂ᵍ set) point between the ligands and are destabilized less. The energy gap between eᵍ and t₂ᵍ is Δₒ (the octahedral splitting energy).

## High-Spin vs. Low-Spin

Electrons preferentially occupy the lower t₂ᵍ orbitals. When adding the 4th through 7th d electrons, there is a choice between pairing in t₂ᵍ (costs pairing energy P) or occupying eᵍ (costs Δₒ). If Δₒ > P (strong-field ligand), electrons pair in t₂ᵍ → low-spin. If Δₒ < P (weak-field ligand), electrons go to eᵍ → high-spin.

## Crystal Field Stabilization Energy (CFSE)

CFSE = energy gained by placing electrons in t₂ᵍ instead of a hypothetical unsplit d set. Each t₂ᵍ electron contributes −0.4Δₒ; each eᵍ electron contributes +0.6Δₒ. For d⁶ low-spin: 6 electrons in t₂ᵍ: CFSE = 6(−0.4Δₒ) + 3P (correction for pairing) − 3P (vs unsplit) = −2.4Δₒ. High CFSE corresponds to extra thermodynamic stability.

## Color and the Spectrochemical Series

The color of a complex is the complementary color of the wavelength absorbed. Δₒ determines which wavelength is absorbed. The spectrochemical series ranks ligands by their ability to split d orbitals:

>> I⁻ < Br⁻ < S²⁻ < Cl⁻ < F⁻ < OH⁻ < H₂O < NH₃ < en < CN⁻ < CO`,
      },
    ],
  },
  {
    id: 'icho',
    number: 'IChO',
    title: 'IChO Preparatory Topics',
    color: 'text-yellow-400',
    sections: [
      {
        id: 'icho-kinetics',
        title: 'Advanced Kinetics & Mechanisms',
        content: `IChO kinetics problems extend well beyond rate laws and half-lives, requiring mastery of reaction mechanisms, steady-state approximation, enzyme kinetics, and photochemical reactions.

## Reaction Mechanisms and Rate Laws

A reaction mechanism is the sequence of elementary steps through which a reaction occurs. Each elementary step has a rate law that follows directly from its molecularity: unimolecular A → products, rate = k[A]; bimolecular A + B → products, rate = k[A][B]. The overall rate law must be derived from the mechanism — it cannot always be read from the balanced equation.

The rate-determining step (slowest step) controls the overall rate. The rate law of the mechanism matches the experimental rate law if and only if the mechanism is correct. Testing mechanisms against experimental rate laws is a common IChO multi-part problem format.

## Steady-State Approximation (SSA)

For intermediates (species formed and consumed within the mechanism), the SSA sets d[intermediate]/dt = 0. This allows [intermediate] to be expressed in terms of reactant concentrations, giving a rate law that can be compared with experiment.

Example: mechanism with fast equilibrium step followed by slow step. If A ⇌ B (K_eq) and B → C (slow, rate constant k₂), then [B] = K_eq[A] and rate = k₂[B] = k₂K_eq[A] — an overall first-order rate law with k_obs = k₂K_eq.

## Michaelis-Menten Enzyme Kinetics

Enzymes (E) bind substrates (S) to form an enzyme-substrate complex (ES), which converts to product (P) and releases E:

>> E + S ⇌ ES → E + P (with rate constants k₁, k₋₁, k₂)

Michaelis-Menten equation: v = Vmax[S]/(Km + [S]), where Km = (k₋₁ + k₂)/k₁ is the Michaelis constant and Vmax = k₂[E]total. At [S] = Km, v = Vmax/2. The Lineweaver-Burk double-reciprocal plot (1/v vs. 1/[S]) linearizes the equation for easy determination of Km and Vmax from experimental data.`,
      },
      {
        id: 'icho-stereo',
        title: 'Stereochemistry — Advanced',
        content: `IChO stereochemistry extends to complex ring systems, atropisomerism, axial chirality, and detailed conformational analysis — topics that rarely appear in AP Chemistry or USNCO local examinations.

## Conformational Analysis

Rotation about C–C single bonds produces conformers — structures related by rotation that do not require bond breaking. The Newman projection is the standard tool for analyzing conformations. Staggered conformations have dihedral angles of 60° between substituents and are lower in energy. Eclipsed conformations (0° dihedral) have maximum torsional strain. Anti conformation (180°) is the most stable for most molecules.

For cyclohexane, the chair conformation eliminates torsional strain and minimizes angle strain. Substituents prefer equatorial positions (more space, less 1,3-diaxial interactions). A-values quantify the preference: the conformational free energy difference ΔG° = −RT ln K for axial ⇌ equatorial equilibrium. Methyl group A-value ≈ 7.3 kJ/mol; tert-butyl ≈ 23 kJ/mol (essentially locks the ring in one conformer).

## Axial Chirality and Atropisomerism

When rotation about a single bond is restricted (by bulky substituents), distinct rotational isomers (atropisomers) can be isolated. The classic example is 2,2'-disubstituted biphenyl: if the substituents are large enough to prevent rotation about the Ar–Ar bond, the two rings are locked at an angle, creating axial chirality. Binaphthol (BINOL) and BINAP are important chiral catalysts based on axial chirality.

## E/Z Nomenclature and Geometric Isomerism

The E/Z system (CIP rules) supersedes cis/trans for alkenes when the two groups on either carbon are not the same. Assign CIP priorities to both groups on each carbon: if the higher-priority groups are on the same side, the isomer is Z (zusammen, "together"); if on opposite sides, E (entgegen, "opposite"). The E/Z system is unambiguous even for complex substituted alkenes where cis/trans is unclear.`,
      },
    ],
  },
]

export default function EbookPage() {
  return (
    <ChemEbook
      title="Chemistry Study Guide"
      subtitle="AP Chemistry · USNCO · IChO"
      units={UNITS}
    />
  )
}
