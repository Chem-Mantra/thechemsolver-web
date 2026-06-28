import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import LabWrapper from './LabWrapper'

interface LabMeta {
  name: string
  h1: string
  description: string
  keywords: string[]
  apUnits: string[]
  icho: boolean
  topics: string[]
  howTo: string[]
}

const LAB_META: Record<string, LabMeta> = {
  titration: {
    name: 'Titration Curve Simulator',
    h1: 'Free Titration Curve Simulator — AP Chemistry & IChO',
    description: 'Plot acid-base titration curves in real time. Supports strong/weak acid-base, polyprotic, and redox titrations. Equivalence point detection, pH at any volume, and indicator selection included. Free, no login required.',
    keywords: ['titration curve simulator', 'ap chemistry titration', 'acid base titration calculator free', 'weak acid strong base titration', 'titration curve generator'],
    apUnits: ['Unit 8: Acids and Bases'],
    icho: true,
    topics: ['Strong acid-base titrations', 'Weak acid-base titrations', 'Equivalence point calculation', 'pH at any point on curve', 'Acid-base indicators', 'Polyprotic acid titrations'],
    howTo: ['Select the titration type (strong/weak acid or base)', 'Set concentrations and volumes', 'Watch the S-curve plot in real time as you add titrant'],
  },
  nomenclature: {
    name: 'IUPAC Nomenclature Engine',
    h1: 'Free IUPAC Nomenclature Tool — Organic Chemistry Name Generator',
    description: 'Draw any organic molecule using the interactive editor and get the correct IUPAC name instantly. Step-by-step rule explanation included. Supports alkanes, alkenes, alkynes, alcohols, aldehydes, ketones, carboxylic acids, and more.',
    keywords: ['IUPAC nomenclature tool', 'organic chemistry naming', 'IUPAC name generator free', 'draw molecule get IUPAC name', 'organic chemistry nomenclature practice'],
    apUnits: ['Unit 1: Atomic Structure and Properties'],
    icho: true,
    topics: ['Alkane, alkene, alkyne naming', 'Functional group priority (IUPAC 2013)', 'Substituent locants and alphabetical order', 'Cyclic compound naming', 'Structural formula visualization', 'Bond-line notation'],
    howTo: ['Use the structure editor to draw your molecule', 'Add atoms, bonds, functional groups from the palette', 'The IUPAC name and step-by-step reasoning appear automatically'],
  },
  equilibrium: {
    name: 'Chemical Equilibrium Lab',
    h1: 'Chemical Equilibrium Calculator — ICE Table & Le Chatelier Simulator',
    description: 'Solve equilibrium problems with an interactive ICE table. Visualize Le Chatelier\'s principle by shifting concentration, temperature, or pressure and watch the system respond in real time. Covers Kc, Kp, Ksp, Ka, Kb.',
    keywords: ['chemical equilibrium calculator', 'ICE table calculator', 'Le Chatelier principle simulator', 'Kc Kp equilibrium', 'ap chemistry equilibrium practice'],
    apUnits: ["Unit 7: Equilibrium"],
    icho: true,
    topics: ['ICE table calculations', 'Kc and Kp expressions', 'Le Chatelier\'s principle', 'Reaction quotient Q vs K', 'Equilibrium shifts (concentration, temperature, pressure)', 'Ksp and solubility product'],
    howTo: ['Enter your balanced equation and initial concentrations', 'Set the equilibrium constant K', 'Shift conditions to see how the system responds'],
  },
  'ionic-equilibrium': {
    name: 'Ionic Equilibrium & Buffer Calculator',
    h1: 'Buffer pH Calculator — Henderson-Hasselbalch & Ionic Equilibrium Solver',
    description: 'Calculate pH of weak acids, weak bases, salts, and buffer solutions. Uses Henderson-Hasselbalch equation with interactive visualizations. Covers hydrolysis, buffer capacity, and common ion effect.',
    keywords: ['buffer pH calculator', 'Henderson-Hasselbalch calculator', 'ionic equilibrium solver', 'weak acid pH calculator', 'buffer solution calculator free'],
    apUnits: ['Unit 8: Acids and Bases'],
    icho: true,
    topics: ['Weak acid and weak base pH', 'Buffer system calculations', 'Henderson-Hasselbalch equation', 'Salt hydrolysis', 'Common ion effect', 'Buffer capacity visualization'],
    howTo: ['Select system type (weak acid, buffer, salt, etc.)', 'Enter the acid/base and its Ka or Kb', 'Get pH, pOH, and percent dissociation instantly'],
  },
  kinetics: {
    name: 'Reaction Kinetics Simulator',
    h1: 'Reaction Kinetics Simulator — Rate Laws, Half-Life & Arrhenius Equation',
    description: 'Simulate first, second, and zero-order reaction kinetics. Plot concentration vs. time, ln[A] vs. time, and 1/[A] vs. time to determine reaction order. Arrhenius equation calculator for activation energy included.',
    keywords: ['reaction kinetics simulator', 'rate law calculator', 'half life calculator chemistry', 'Arrhenius equation calculator', 'ap chemistry kinetics'],
    apUnits: ['Unit 5: Kinetics'],
    icho: true,
    topics: ['Zero, first, second order reactions', 'Integrated rate laws', 'Half-life calculations', 'Arrhenius equation and activation energy', 'Graphical determination of reaction order', 'Rate constant k units'],
    howTo: ['Select reaction order (0, 1st, or 2nd)', 'Set initial concentration and rate constant k', 'View all three linearization plots to confirm reaction order'],
  },
  thermodynamics: {
    name: 'Thermodynamics Calculator',
    h1: 'Thermodynamics Calculator — ΔG, ΔH, ΔS & Gibbs Free Energy',
    description: 'Calculate ΔG, ΔH, and ΔS for chemical reactions. Visualize Maxwell-Boltzmann speed distributions and Carnot cycle efficiency. Covers spontaneity, entropy, enthalpy, and free energy at different temperatures.',
    keywords: ['thermodynamics calculator chemistry', 'Gibbs free energy calculator', 'delta G delta H delta S', 'Maxwell Boltzmann distribution', 'ap chemistry thermodynamics'],
    apUnits: ['Unit 9: Applications of Thermodynamics'],
    icho: true,
    topics: ['ΔG = ΔH − TΔS calculations', 'Spontaneity prediction', 'Standard free energy', 'Maxwell-Boltzmann distribution', 'Carnot efficiency', 'Hess\'s law applications'],
    howTo: ['Enter ΔH and ΔS values for your reaction', 'Set temperature in Kelvin', 'See ΔG and whether the reaction is spontaneous'],
  },
  'electrochemical-potentials': {
    name: 'Electrochemical Cell Simulator',
    h1: 'Electrochemical Cell Simulator — Nernst Equation & Standard Reduction Potentials',
    description: 'Build galvanic and electrolytic cells, look up standard reduction potentials, and apply the Nernst equation. Calculates cell voltage (E°cell), ΔG, and equilibrium constant K from electrochemical data.',
    keywords: ['electrochemical cell simulator', 'Nernst equation calculator', 'standard reduction potential', 'galvanic cell calculator', 'ap chemistry electrochemistry'],
    apUnits: ['Unit 9: Applications of Thermodynamics'],
    icho: true,
    topics: ['Standard reduction potentials (E°)', 'Cell voltage calculation (E°cell)', 'Nernst equation at non-standard conditions', 'Relationship between ΔG and E°', 'Faraday\'s laws of electrolysis', 'Electrolytic vs galvanic cells'],
    howTo: ['Select half-reactions from the standard reduction table', 'Identify anode (oxidation) and cathode (reduction)', 'Apply Nernst equation for non-standard concentrations'],
  },
  coordination: {
    name: 'Crystal Field Theory Simulator',
    h1: 'Crystal Field Theory Simulator — Coordination Chemistry & d-Orbital Splitting',
    description: 'Visualize d-orbital splitting in octahedral, tetrahedral, and square planar coordination complexes. Calculate crystal field stabilization energy (CFSE), predict high-spin vs low-spin configurations, and determine magnetic properties.',
    keywords: ['crystal field theory simulator', 'coordination chemistry tool', 'd orbital splitting', 'CFSE calculator', 'IChO coordination chemistry'],
    apUnits: [],
    icho: true,
    topics: ['d-orbital splitting diagrams (Oh, Td, D4h)', 'Crystal field stabilization energy (CFSE)', 'High-spin vs low-spin complexes', 'Spectrochemical series', 'Magnetic moment calculation', 'Color and absorption in coordination compounds'],
    howTo: ['Select metal ion and oxidation state', 'Choose geometry (octahedral, tetrahedral, square planar)', 'Enter the ligand field strength (Δ) to see electron filling and CFSE'],
  },
  'nuclear-decay': {
    name: 'Nuclear Decay Simulator',
    h1: 'Nuclear Decay Simulator — Half-Life, Alpha/Beta/Gamma Decay Calculator',
    description: 'Simulate radioactive decay chains for alpha, beta, and gamma emitters. Plot activity vs. time, calculate remaining amount after any number of half-lives, and explore dose calculations.',
    keywords: ['nuclear decay simulator', 'half life calculator', 'radioactive decay calculator', 'alpha beta gamma decay', 'ap chemistry nuclear chemistry'],
    apUnits: ['Unit 1: Atomic Structure and Properties'],
    icho: true,
    topics: ['Alpha, beta-minus, beta-plus, gamma decay', 'Half-life calculations', 'Decay chains and daughter nuclides', 'Activity (Becquerels and Curies)', 'Carbon-14 dating', 'Nuclear binding energy'],
    howTo: ['Select a nuclide or enter mass number and atomic number', 'Choose decay type', 'View the decay curve and remaining activity over time'],
  },
  quantum: {
    name: 'Quantum Number Explorer',
    h1: 'Quantum Numbers & Atomic Orbital Visualizer — 3D Orbital Shapes',
    description: 'Explore all four quantum numbers (n, l, ml, ms) with real 3D orbital shape rendering. Visualize s, p, d, and f orbitals with electron density plots. Essential for AP Chemistry Unit 1 and IChO atomic structure problems.',
    keywords: ['quantum number explorer', 'atomic orbital visualizer', '3D orbital shapes', 'quantum numbers n l ml ms', 'ap chemistry atomic structure'],
    apUnits: ['Unit 1: Atomic Structure and Properties'],
    icho: true,
    topics: ['Principal quantum number n', 'Angular momentum quantum number l', 'Magnetic quantum number ml', 'Spin quantum number ms', 's, p, d, f orbital shapes', 'Pauli exclusion and Hund\'s rule'],
    howTo: ['Select n (1–4) and l (s, p, d, f)', 'Scroll through ml values to see all orientations', 'Toggle electron spin to build electron configurations'],
  },
  'radial-probability': {
    name: 'Radial Probability Density',
    h1: 'Radial Probability Density — Hydrogen Atom Orbital Wave Functions',
    description: 'Plot the radial probability distribution function ψ²(r) for any hydrogen atom orbital from 1s through 4f. Visualize radial nodes, most probable radius, and the difference between ψ(r) and ψ²(r). IChO-level quantum chemistry.',
    keywords: ['radial probability density', 'hydrogen atom orbital', 'wave function calculator', 'radial nodes orbital', 'IChO quantum chemistry'],
    apUnits: [],
    icho: true,
    topics: ['Radial wave functions ψ(r)', 'Radial probability distribution ψ²(r)4πr²', 'Number of radial nodes (n−l−1)', 'Most probable radius vs average radius', 'Comparison of 1s, 2s, 2p, 3s, 3p, 3d orbitals', 'Effective nuclear charge Zeff'],
    howTo: ['Select principal quantum number n (1–4)', 'Select orbital type (s, p, d, f)', 'Compare multiple orbitals by overlaying plots'],
  },
  'atomic-evolution': {
    name: 'Atomic Spectra Simulator',
    h1: 'Atomic Spectra Simulator — Bohr Model, Emission Lines & Energy Levels',
    description: 'Visualize hydrogen atom emission spectra and energy level diagrams. Calculate photon wavelength for any electron transition using the Rydberg formula. Covers Lyman, Balmer, Paschen, and Brackett series.',
    keywords: ['atomic spectra simulator', 'Bohr model calculator', 'emission spectrum calculator', 'Rydberg formula calculator', 'hydrogen energy levels'],
    apUnits: ['Unit 1: Atomic Structure and Properties'],
    icho: true,
    topics: ['Bohr model energy levels', 'Rydberg formula and emission wavelengths', 'Lyman, Balmer, Paschen series', 'Photon energy and frequency calculation', 'Ionization energy from spectra', 'Emission vs absorption spectra'],
    howTo: ['Select initial and final energy levels (ni and nf)', 'See wavelength, frequency, and photon energy', 'Identify which spectral series the transition belongs to'],
  },
  vsepr: {
    name: 'VSEPR Molecular Geometry Tool',
    h1: 'VSEPR Molecular Geometry Tool — 3D Bond Angle & Shape Predictor',
    description: 'Build molecules and predict their 3D geometry using VSEPR theory. Determine electron pair geometry vs. molecular geometry, bond angles, and polarity. Covers all AXₙEₘ notation geometries.',
    keywords: ['VSEPR theory tool', 'molecular geometry predictor', 'bond angle calculator', 'electron geometry vs molecular geometry', 'ap chemistry VSEPR'],
    apUnits: ['Unit 2: Molecular and Ionic Compound Structure and Properties'],
    icho: true,
    topics: ['Linear, bent, trigonal planar, tetrahedral', 'Trigonal bipyramidal, octahedral, and all variations', 'Lone pair vs bonding pair repulsion', 'AXₙEₘ notation', 'Bond angles with lone pairs', 'Molecular polarity from geometry'],
    howTo: ['Select the central atom and attach substituents', 'Add lone pairs to the central atom', 'View the predicted 3D geometry with bond angles'],
  },
  hydrocarbon: {
    name: 'Hydrocarbon Structure Builder',
    h1: 'Hydrocarbon Structure Builder — Alkane, Alkene & Alkyne 3D Visualization',
    description: 'Build hydrocarbon structures interactively and get IUPAC names automatically. Supports alkanes, alkenes (cis/trans), alkynes, cyclic hydrocarbons, and aromatic compounds. Displays structural, condensed, and bond-line formulas.',
    keywords: ['hydrocarbon structure builder', 'alkane alkene alkyne tool', 'organic chemistry structure drawer', 'IUPAC hydrocarbon naming', 'molecular structure visualizer'],
    apUnits: ['Unit 1: Atomic Structure and Properties'],
    icho: false,
    topics: ['Alkane structural and condensed formulas', 'Alkene geometric isomers (cis/trans, E/Z)', 'Alkyne nomenclature', 'Cycloalkane and cycloalkene naming', 'Aromatic compounds', 'Degree of unsaturation'],
    howTo: ['Click to add carbons and build your chain', 'Add double/triple bonds by clicking on existing bonds', 'IUPAC name updates automatically as you build'],
  },
  stereochemistry: {
    name: 'Stereochemistry & R/S Configuration Solver',
    h1: 'R/S Configuration Solver — Stereochemistry & Chirality Practice Tool',
    description: 'Assign R or S configuration to any stereocenter with step-by-step CIP priority rules. Practice with Fischer projections, Newman projections, wedge-dash structures, and enantiomer/diastereomer identification.',
    keywords: ['R S configuration solver', 'stereochemistry tool', 'CIP priority rules', 'chirality solver', 'organic chemistry stereochemistry'],
    apUnits: [],
    icho: true,
    topics: ['CIP priority rules (atomic number, mass)', 'R and S assignment', 'Enantiomers and diastereomers', 'Meso compounds', 'Fischer and Newman projections', 'Optical activity and specific rotation'],
    howTo: ['Draw or select a molecule with stereocenters', 'Apply CIP rules: assign priority 1–4 to substituents', 'Determine clockwise (R) or counterclockwise (S) arrangement'],
  },
  'organic-mechanism': {
    name: 'Organic Reaction Mechanism Viewer',
    h1: 'Organic Reaction Mechanism Viewer — Arrow Pushing & EAS Mechanisms',
    description: 'Visualize organic reaction mechanisms with animated electron arrow-pushing. Covers SN1, SN2, E1, E2, electrophilic aromatic substitution (EAS), addition to carbonyls, and more. Essential for Orgo 1 & 2.',
    keywords: ['organic mechanism viewer', 'arrow pushing organic chemistry', 'SN1 SN2 E1 E2 mechanism', 'EAS mechanism tool', 'organic reaction mechanisms free'],
    apUnits: [],
    icho: false,
    topics: ['SN1 and SN2 substitution mechanisms', 'E1 and E2 elimination mechanisms', 'Electrophilic aromatic substitution (EAS)', 'Nucleophilic addition to carbonyls', 'Acid-catalyzed and base-catalyzed reactions', 'Carbocation rearrangements'],
    howTo: ['Select the reaction type from the menu', 'View the step-by-step animated mechanism', 'Click on each arrow to see the electron movement explanation'],
  },
  'periodic-table': {
    name: 'Interactive Periodic Table',
    h1: 'Interactive Periodic Table — Element Properties, Trends & Electron Configuration',
    description: 'Explore all 118 elements with detailed properties: atomic mass, electron configuration, electronegativity, ionization energy, atomic radius, and more. Visualize periodic trends with color-coded overlays.',
    keywords: ['interactive periodic table', 'periodic table element properties', 'electron configuration tool', 'periodic trends visualizer', 'atomic radius electronegativity trend'],
    apUnits: ['Unit 1: Atomic Structure and Properties', 'Unit 3: Intermolecular Forces and Properties'],
    icho: true,
    topics: ['Atomic mass, number, and electron configuration', 'Electronegativity (Pauling scale)', 'First ionization energy trend', 'Atomic and ionic radius trends', 'Electron affinity', 'Periodic law and trends across periods/groups'],
    howTo: ['Click any element to view full properties', 'Select a trend from the overlay menu (electronegativity, radius, etc.)', 'Compare elements side by side'],
  },
  'crystal-field': {
    name: 'Crystal Field Theory Simulator',
    h1: 'Crystal Field Theory Simulator — CFSE, d-Orbital Splitting & Spin States',
    description: 'Interactive crystal field theory tool: select metal ion, oxidation state, and ligand to visualize d-orbital energy splitting, calculate crystal field stabilization energy (CFSE), and determine high-spin vs low-spin electron configurations in octahedral complexes.',
    keywords: ['crystal field theory simulator', 'CFSE calculator', 'd orbital splitting', 'high spin low spin', 'spectrochemical series tool'],
    apUnits: [],
    icho: true,
    topics: ['d-orbital energy splitting (Δo)', 'Crystal field stabilization energy (CFSE)', 'High-spin vs low-spin configurations', 'Spectrochemical series and ligand field strength', 'Electron filling diagrams', 'Magnetic properties from spin state'],
    howTo: ['Select a transition metal and oxidation state', 'Choose a ligand from the spectrochemical series', 'View d-orbital splitting diagram, CFSE value, and spin state'],
  },
  hybridization: {
    name: 'Hybridization Explorer',
    h1: 'Hybridization Explorer — sp, sp², sp³ Orbital Mixing & Molecular Geometry',
    description: 'Visualize sp, sp², sp³, sp³d, and sp³d² hybridization with interactive 3D geometry models. See orbital mixing diagrams, bond angles, lone-pair effects, and example molecules for each hybridization type.',
    keywords: ['hybridization explorer', 'sp sp2 sp3 hybridization', 'orbital mixing chemistry', 'bond angle hybridization', 'VSEPR hybridization tool'],
    apUnits: ['Unit 2: Molecular and Ionic Compound Structure and Properties'],
    icho: true,
    topics: ['sp hybridization — linear geometry', 'sp² hybridization — trigonal planar', 'sp³ hybridization — tetrahedral', 'sp³d hybridization — trigonal bipyramidal', 'sp³d² hybridization — octahedral', 'Lone pairs and bond angle distortion'],
    howTo: ['Select a hybridization type (sp through sp³d²)', 'See the orbital diagram and geometry model', 'View example molecules and bond angles for each type'],
  },
  'projection-formula': {
    name: 'Projection Formula Lab',
    h1: 'Projection Formula Lab — Fischer, Newman, Sawhorse & Wedge-Dash Converter',
    description: 'Draw and interconvert Fischer projections, Newman projections, sawhorse diagrams, and wedge-dash notation. Assign R/S configuration with step-by-step CIP rules. D/L notation for carbohydrates. Essential for AP Chemistry and IChO stereochemistry.',
    keywords: ['Fischer projection converter', 'Newman projection tool', 'R S configuration calculator', 'stereochemistry projection formula', 'wedge dash notation tool'],
    apUnits: [],
    icho: true,
    topics: ['Fischer projection drawing and interconversion', 'Newman projection (eclipsed, staggered, gauche)', 'Sawhorse and wedge-dash notation', 'R/S configuration via CIP priority rules', 'D/L notation for carbohydrates', 'Meso compound detection'],
    howTo: ['Draw your molecule using the structure editor', 'Select the projection type (Fischer, Newman, sawhorse, wedge-dash)', 'Click "Assign R/S" for step-by-step CIP rule application'],
  },
  electrochemistry: {
    name: 'Electrochemistry Simulator',
    h1: 'Electrochemistry Simulator — Galvanic Cells, Electrolysis & Nernst Equation',
    description: 'Full electrochemistry lab: build galvanic (voltaic) and electrolytic cells, calculate cell EMF using the Nernst equation, explore Faraday\'s laws of electrolysis, and simulate corrosion processes. Covers AP Chemistry Unit 9 and IChO electrochemistry topics.',
    keywords: ['electrochemistry simulator', 'galvanic cell calculator', 'electrolysis calculator', 'Nernst equation calculator', 'Faraday law electrochemistry'],
    apUnits: ['Unit 9: Applications of Thermodynamics'],
    icho: true,
    topics: ['Galvanic and electrolytic cell diagrams', 'Cell EMF from half-reaction potentials', 'Nernst equation at non-standard concentrations', 'Faraday\'s laws — mass deposited in electrolysis', 'Corrosion as an electrochemical process', 'ΔG and K from E°cell'],
    howTo: ['Select galvanic or electrolytic cell mode', 'Choose your half-reactions and concentrations', 'Apply the Nernst equation to get non-standard cell potential'],
  },
  electrochemical: {
    name: 'Electrochemical Cell Lab',
    h1: 'Electrochemical Cell Lab — Galvanic vs Electrolytic Cells with Nernst Equation',
    description: 'Interactive electrochemical cell lab: compare galvanic (spontaneous) and electrolytic (non-spontaneous) cells side by side. Apply the Nernst equation with adjustable concentration sliders. Covers standard reduction potentials and cell voltage calculations.',
    keywords: ['electrochemical cell lab', 'galvanic vs electrolytic cell', 'Nernst equation interactive', 'standard reduction potential', 'cell voltage calculator'],
    apUnits: ['Unit 9: Applications of Thermodynamics'],
    icho: true,
    topics: ['Galvanic vs electrolytic cell comparison', 'Standard cell voltage E°cell', 'Nernst equation with concentration dependence', 'Anode and cathode identification', 'Spontaneity from ΔG and E°', 'Half-reaction tables'],
    howTo: ['Select cell type (galvanic or electrolytic)', 'Adjust ion concentrations with the sliders', 'See how cell potential changes with the Nernst equation'],
  },
  periodic: {
    name: 'Periodic Properties Simulator',
    h1: 'Periodic Properties Variation Simulator — Trends Across Groups & Periods',
    description: 'Visualize how atomic radius, ionization energy, electronegativity, and electron affinity vary across the periodic table. Plot trends along any group or period, compare elements, and understand the reasons behind periodic law.',
    keywords: ['periodic properties simulator', 'atomic radius trend', 'ionization energy trend', 'electronegativity periodic table', 'periodic law visualization'],
    apUnits: ['Unit 1: Atomic Structure and Properties', 'Unit 3: Intermolecular Forces and Properties'],
    icho: true,
    topics: ['Atomic radius trends (across period, down group)', 'First ionization energy variations', 'Successive ionization energies', 'Electronegativity (Pauling scale) trends', 'Electron affinity patterns', 'Screening effect and effective nuclear charge'],
    howTo: ['Select a periodic property (radius, IE, electronegativity, etc.)', 'Choose a group or period to plot', 'Hover over data points to compare specific element values'],
  },
  mechanisms: {
    name: '3D Reaction Mechanism Viewer',
    h1: '3D Organic Reaction Mechanism Viewer — SN1, SN2, E1, E2, EAS & More',
    description: 'Step-through 3D animations of organic reaction mechanisms: nucleophilic substitution (SN1, SN2), elimination (E1, E2), electrophilic addition, electrophilic aromatic substitution (EAS), free radical reactions, oxidation, and reduction. See curved arrow notation, bond breaking/forming, and transition states.',
    keywords: ['organic mechanism 3D viewer', 'SN1 SN2 mechanism animation', 'E1 E2 elimination mechanism', 'EAS electrophilic aromatic substitution', 'organic chemistry mechanism tool'],
    apUnits: [],
    icho: true,
    topics: ['SN1 and SN2 nucleophilic substitution', 'E1 and E2 elimination', 'Electrophilic addition — Markovnikov and anti-Markovnikov', 'Electrophilic aromatic substitution (EAS)', 'Free radical substitution and addition', 'Oxidation and reduction mechanisms'],
    howTo: ['Select a reaction category (addition, substitution, elimination, etc.)', 'Choose a specific reaction from the list', 'Use Next/Prev to step through each mechanism stage with 3D visualization'],
  },
  'organic-synthesis': {
    name: 'Organic Synthesis Pathways',
    h1: 'Organic Synthesis Multi-step Pathways — JEE Advanced Reaction Routes',
    description: 'Explore multi-step organic synthesis routes with step-by-step mechanism breakdowns. Covers benzene → aniline, diazonium chemistry, Grignard synthesis, aldol condensation, and more. Each route shows reagents, conditions, and the key mechanism at every stage.',
    keywords: ['organic synthesis pathways', 'multi-step synthesis JEE', 'Grignard synthesis', 'aldol condensation synthesis', 'diazonium chemistry synthesis'],
    apUnits: [],
    icho: true,
    topics: ['Benzene → aniline (nitration + reduction)', 'Benzene → phenol via diazonium', 'Aldol condensation synthesis', 'Grignard synthesis of secondary alcohols', 'Diazonium salt reactions (Sandmeyer, azo coupling)', 'Reagent and condition selection for each step'],
    howTo: ['Select a synthesis target from the list', 'Follow each step with reagents, conditions, and mechanism type', 'Review key JEE points highlighted for each transformation'],
  },
}

// ── 300-word SEO prose for each lab ────────────────────────────────────────
// Required for Google AdSense approval: "Low value content" is rejected when
// a page contains only an interactive element with no explanatory text.
const LAB_BODY: Record<string, string> = {
  titration: `The titration curve is one of the most powerful analytical tools in chemistry, forming the backbone of AP Chemistry Unit 8 and appearing consistently on USNCO and IChO examinations. Mastering titration goes beyond knowing that moles of acid equal moles of base at the equivalence point — it requires understanding the pH behavior at every stage of the reaction.

In a strong acid–strong base titration, such as HCl with NaOH, the equivalence point occurs exactly at pH 7.00, because the resulting salt (NaCl) does not undergo hydrolysis. The steep, near-vertical jump in pH around the equivalence point makes indicator selection flexible: phenolphthalein, methyl orange, or even bromothymol blue all work reliably.

Weak acid titrations reveal a richer landscape. When acetic acid (Ka = 1.8 × 10⁻⁵) is titrated with NaOH, the half-equivalence point falls at pH = pKa = 4.74. This point marks the center of the buffer region, where the concentration of the acid equals the concentration of its conjugate base and pH changes most gradually with added titrant. The Henderson–Hasselbalch equation (pH = pKa + log [A⁻]/[HA]) governs the buffer region precisely.

The equivalence point for a weak acid–strong base titration falls above pH 7, because the conjugate base formed (e.g., CH₃COO⁻) hydrolyzes water to release OH⁻. This is a common AP exam misconception — students who memorize "equivalence = pH 7" miss the fact that only strong acid–strong base systems meet exactly at neutral pH.

Polyprotic acids like H₂SO₄, H₃PO₄, and H₂CO₃ produce multiple equivalence points — one per ionizable proton — each separated by a distinct buffer region governed by its own Ka. Recognizing multiple inflection points on a titration curve is a common question type in both the AP MCQ and USNCO local exam.

This free titration simulator lets you explore all these scenarios in real time. Adjust acid and base concentrations, select strong or weak systems, enable polyprotic acids, and watch the full S-curve plot update instantly. The equivalence point, half-equivalence point, buffer region, and indicator transition zones are marked automatically, making it an ideal study tool for exam preparation.`,

  equilibrium: `Chemical equilibrium is the state at which the forward and reverse rates of a reaction are equal, resulting in constant concentrations of reactants and products. It is one of the most concept-dense topics in AP Chemistry (Unit 7) and represents a large fraction of USNCO and IChO theoretical problems, often appearing alongside thermodynamics and electrochemistry.

The equilibrium constant Kc is defined as the ratio of product concentrations to reactant concentrations, each raised to the power of its stoichiometric coefficient. For a gas-phase reaction, Kp uses partial pressures instead. The relationship Kp = Kc(RT)^Δn connects the two, where Δn is the change in moles of gas. A large K (>>1) indicates products are strongly favored; a small K (<<1) means reactants dominate.

The reaction quotient Q tells you where the system is relative to equilibrium. If Q < K, the reaction will proceed forward (toward products). If Q > K, it will shift in reverse. This Q versus K comparison is the single most-tested equilibrium concept on the AP Chemistry exam.

Le Chatelier's principle predicts how a system at equilibrium responds to stress. Adding more reactant shifts the reaction forward; removing product does the same. Increasing pressure on a gas-phase equilibrium shifts the reaction toward the side with fewer moles of gas. Temperature changes are the only stress that actually changes the numerical value of K — increasing temperature shifts an endothermic reaction forward and decreases K for an exothermic reaction.

The ICE table (Initial, Change, Equilibrium) is the workhorse method for solving quantitative equilibrium problems. You set up the algebraic expression for Kc in terms of x, solve for x (the change in concentration), and confirm the approximation |x| << [initial] is valid (or use the quadratic formula if it isn't).

This equilibrium simulator lets you explore all these concepts interactively: set up reactions, apply Le Chatelier stresses, and solve ICE table problems with visual feedback. Use it alongside your AP Chemistry review to build genuine understanding of one of the exam's highest-weighted topics.`,

  kinetics: `Reaction kinetics is the study of how fast chemical reactions proceed and what factors control that rate. For AP Chemistry Unit 5 and the USNCO examination, kinetics questions require both conceptual understanding (why rates change) and quantitative fluency (rate laws, half-life, and the Arrhenius equation).

The rate law for a reaction is determined experimentally, not from the balanced equation. For the reaction A + B → products, the rate may follow rate = k[A]^m[B]^n, where m and n are the reaction orders with respect to A and B respectively. These exponents must be measured from experimental data — they have no required relationship to stoichiometric coefficients.

Integrated rate laws connect concentration to time. For a first-order reaction: ln[A] = ln[A]₀ − kt, giving a straight line when ln[A] is plotted against time. For second order: 1/[A] = 1/[A]₀ + kt, linear in 1/[A] vs. time. For zero order: [A] = [A]₀ − kt, linear in [A] vs. time. Identifying reaction order from a graph is a standard AP MCQ question — whichever plot is linear reveals the order.

The half-life of a reaction is the time for the concentration to fall to exactly half its initial value. For first order reactions, t₁/₂ = ln2/k = 0.693/k — independent of initial concentration. This is why radioactive decay (always first order) has a constant half-life. For second order reactions, t₁/₂ = 1/(k[A]₀), which depends on the starting concentration.

The Arrhenius equation links the rate constant to temperature: k = Ae^(-Ea/RT). Taking the logarithm: ln k = ln A − Ea/RT. A plot of ln k versus 1/T is linear with slope −Ea/R, allowing activation energy to be determined experimentally. This relationship explains why reaction rates roughly double for every 10°C temperature increase near room temperature.

Use this kinetics simulator to explore rate laws, plot concentration–time graphs for all three orders, and apply the Arrhenius equation to understand how temperature and activation energy govern chemical reaction rates.`,

  thermodynamics: `Thermodynamics governs the energy flow of all chemical processes and determines whether reactions occur spontaneously. For AP Chemistry Unit 9 and the USNCO and IChO examinations, thermodynamics requires mastery of enthalpy, entropy, Gibbs free energy, and how these quantities interrelate.

The first law of thermodynamics states that energy is conserved: ΔU = q + w, where q is heat transferred and w is work done on the system. For constant-pressure processes, the heat transferred equals the enthalpy change ΔH. Reactions with ΔH < 0 are exothermic (release heat to surroundings); those with ΔH > 0 are endothermic (absorb heat).

Entropy S measures the dispersal of energy and matter. The second law states that the entropy of the universe always increases in any spontaneous process. Phase changes from solid to liquid to gas increase entropy dramatically; dissolving a solid ionic compound into ions also increases entropy. Reactions that decrease entropy can still be spontaneous if they are sufficiently exothermic.

The unifying quantity is Gibbs free energy: ΔG = ΔH − TΔS. A negative ΔG indicates a spontaneous process at constant temperature and pressure. When ΔH and ΔS have opposite signs, temperature determines spontaneity. At ΔG = 0, the system is at equilibrium, and the temperature at which this occurs is T = ΔH/ΔS — a commonly tested calculation on AP Chemistry free response.

The relationship between ΔG and the equilibrium constant K is: ΔG° = −RT ln K. This connects thermodynamics directly to equilibrium. A large negative ΔG° gives a large K (products heavily favored); a positive ΔG° gives K << 1 (reactants dominate). The Nernst equation extends this to electrochemical cells.

Hess's law allows ΔH values for complex reactions to be calculated by combining known ΔH values for simpler reactions. Bond energies provide an alternative estimate: ΔH ≈ Σ(bonds broken) − Σ(bonds formed). This simulator covers all these topics with interactive visualizations.`,

  nomenclature: `IUPAC nomenclature is the internationally standardized system for naming chemical compounds, established by the International Union of Pure and Applied Chemistry. Mastering systematic naming is foundational for all levels of organic chemistry, from AP Chemistry through university-level courses and competitive chemistry examinations.

The IUPAC name of an organic compound is built hierarchically. First, identify the longest continuous carbon chain — this gives the parent chain name (methane, ethane, propane... up to decane for 10 carbons). Then identify all substituents branching off the parent chain, number the chain to give substituents the lowest possible locants, and list substituents alphabetically with their locant numbers before the parent chain name.

Functional groups have strict naming priorities. Carboxylic acids (−COOH) take highest priority and are indicated by the suffix "-oic acid." Then come esters (-oate), amides (-amide), aldehydes (-al), ketones (-one), alcohols (-ol), and amines (-amine). When multiple functional groups are present, the highest-priority group determines the suffix; all others are cited as prefixes. This priority hierarchy is explicitly tested in both USNCO local and national exams.

Alkenes require the "en" suffix and a locant indicating the position of the double bond (e.g., but-1-ene vs. but-2-ene). Geometric isomers around double bonds are designated E (entgegen, "opposite") and Z (zusammen, "together") using CIP priority rules — superseding the older cis/trans notation in modern IUPAC nomenclature. Alkynes receive the "yn" suffix.

Cyclic compounds are named with the prefix "cyclo" before the parent chain name (e.g., cyclohexane, cyclopentanone). Aromatic compounds are often named as benzene derivatives; when benzene is a substituent, it becomes "phenyl."

This IUPAC naming engine lets you draw any organic molecule interactively and receive the correct systematic name with full step-by-step reasoning — invaluable for exam preparation and self-study.`,

  vsepr: `VSEPR theory (Valence Shell Electron Pair Repulsion) is one of the most powerful and widely applicable models in introductory chemistry, used to predict the three-dimensional geometry of molecules from a simple count of electron pairs. It forms the foundation of AP Chemistry Unit 2 and appears regularly in USNCO and IChO problems.

The central principle of VSEPR is that electron pairs — both bonding pairs and lone pairs — repel each other and arrange themselves to minimize that repulsion. The result is a predictable geometry: 2 electron pairs give linear, 3 give trigonal planar, 4 give tetrahedral, 5 give trigonal bipyramidal, and 6 give octahedral arrangements of electron pairs.

The molecular geometry (the shape described by the atoms alone) differs from the electron geometry when lone pairs are present on the central atom. Water (H₂O) has four electron pairs (2 bonding, 2 lone), giving a tetrahedral electron geometry — but the molecular geometry is bent, with a bond angle of approximately 104.5° rather than the ideal 109.5°. This is because lone pairs occupy more space than bonding pairs and compress the bonding angles.

Ammonia (NH₃) provides another classic example: three bonding pairs and one lone pair give a trigonal pyramidal molecular geometry with approximately 107° bond angles. Contrast this with methane (CH₄), which has four bonding pairs and no lone pairs, giving perfect tetrahedral geometry with exactly 109.5° angles.

Polarity follows directly from geometry. A molecule with polar bonds is nonpolar overall if the bond dipoles cancel due to symmetry (CO₂ is linear and nonpolar; H₂O is bent and polar). Understanding polarity from geometry is essential for predicting intermolecular forces and physical properties.

This VSEPR tool lets you build any molecule, add lone pairs, and immediately see the predicted 3D geometry with bond angles — making abstract molecular shapes concrete and memorable for any exam.`,

  quantum: `Quantum numbers define the allowed states of electrons in atoms and form the mathematical foundation of all atomic structure. Understanding quantum numbers is essential for AP Chemistry Unit 1, IChO atomic structure problems, and any university-level physical chemistry course.

The principal quantum number n (1, 2, 3...) determines the energy level and the overall size of the orbital. Higher n means higher energy and larger orbitals. The number of electrons that can occupy energy level n is 2n².

The angular momentum quantum number l (0 to n−1) defines the shape of the orbital. l = 0 gives a spherical s orbital; l = 1 gives dumbbell-shaped p orbitals; l = 2 gives the four-lobed d orbitals; l = 3 gives the complex f orbitals. The letter labels s, p, d, f derive from spectroscopic descriptions: sharp, principal, diffuse, fundamental.

The magnetic quantum number mₗ (−l to +l) specifies the orbital's orientation in space. For a p subshell (l = 1), mₗ can be −1, 0, or +1, giving the three mutually perpendicular p orbitals: px, py, pz. For d orbitals (l = 2), mₗ ranges from −2 to +2, giving five d orbitals.

The spin quantum number ms (+½ or −½) describes the intrinsic angular momentum of the electron. The Pauli exclusion principle states that no two electrons in an atom can have the same set of all four quantum numbers — meaning each orbital holds at most two electrons with opposite spins.

Hund's rule states that electrons occupy degenerate orbitals (same energy) singly before pairing. This is why carbon's ground-state configuration is 1s²2s²2p¹2p¹ (two unpaired electrons in separate p orbitals) rather than 1s²2s²2p² with both electrons in the same p orbital.

This quantum number explorer renders real 3D orbital shapes from the actual hydrogen-atom wave functions, helping you visualize the connection between quantum numbers and orbital geometry.`,

  'electrochemical-potentials': `Electrochemistry bridges thermodynamics and chemical reactions by quantifying the electrical work that oxidation-reduction reactions can perform. It is a major topic in AP Chemistry Unit 9, consistently tested in USNCO Part II free response questions, and a core IChO theoretical domain.

Standard reduction potentials (E°) measure the tendency of a half-reaction to proceed as a reduction relative to the standard hydrogen electrode (SHE), defined as 0.00 V. A more positive E° means a stronger oxidizing agent. To build a galvanic cell, pair a reduction half-reaction (cathode) with an oxidation half-reaction (anode, reverse the sign of E°): E°cell = E°cathode − E°anode.

The standard cell potential connects to thermodynamics via ΔG° = −nFE°cell, where n is the moles of electrons transferred and F is Faraday's constant (96,485 C/mol). A positive E°cell gives a negative ΔG° — confirming the cell reaction is spontaneous. The equilibrium constant K is related by ΔG° = −RT ln K, completing the triangle: E°cell, ΔG°, and K are all interconvertible.

At non-standard conditions, the Nernst equation applies: E = E° − (RT/nF) ln Q = E° − (0.0592/n) log Q at 25°C. As a cell discharges, reactant concentrations fall and product concentrations rise, increasing Q and decreasing E. When E = 0, the cell is at equilibrium and Q = K.

Electrolytic cells use an external power source to drive non-spontaneous reactions. Faraday's laws of electrolysis state that the mass of substance deposited is proportional to the charge passed: m = (MIt)/(nF), where M is molar mass, I is current, t is time, n is electrons per ion, and F is Faraday's constant. Electroplating, chlor-alkali production, and aluminum smelting all rely on electrolysis.

This electrochemical cell simulator lets you select half-reactions, build galvanic and electrolytic cells, apply the Nernst equation with adjustable concentration sliders, and calculate Faraday's law quantities — the complete AP Chemistry and USNCO electrochemistry toolkit.`,

  'nuclear-decay': `Radioactive decay is a spontaneous nuclear process in which an unstable nucleus emits particles or radiation to reach a more stable configuration. Nuclear chemistry appears in AP Chemistry Unit 1, USNCO examinations, and as an IChO theoretical topic with connections to both chemistry and physics.

Alpha (α) decay emits a helium-4 nucleus (²He, 2 protons + 2 neutrons), decreasing the atomic number by 2 and mass number by 4. Alpha particles have the highest ionizing power but the shortest range — stopped by a sheet of paper. Alpha decay is common among heavy nuclei above bismuth (Z > 83).

Beta-minus (β⁻) decay converts a neutron to a proton, emitting an electron and an antineutrino. The mass number is unchanged; the atomic number increases by 1. Beta-plus (β⁺) decay converts a proton to a neutron, emitting a positron and a neutrino; atomic number decreases by 1. Electron capture is an alternative to β⁺ where the nucleus absorbs an inner-shell electron.

Gamma (γ) radiation is high-energy electromagnetic radiation emitted when a nucleus transitions between energy states. It has no charge and no mass, so neither the atomic number nor mass number changes. Gamma rays have the greatest penetrating power, requiring lead or thick concrete for shielding.

Radioactive decay follows first-order kinetics: N = N₀e^(−λt), where λ is the decay constant. The half-life t₁/₂ = ln2/λ = 0.693/λ is independent of initial quantity — a defining property of first-order processes. Carbon-14 dating uses this: ¹⁴C (t₁/₂ = 5,730 years) decays at a known rate, allowing the age of organic materials to be determined from the remaining ¹⁴C/¹²C ratio.

This nuclear decay simulator plots activity versus time for any nuclide, simulates decay chains, and calculates remaining activity after any number of half-lives — covering everything from AP Chemistry homework to USNCO preparation.`,

  stereochemistry: `Stereochemistry is the study of the three-dimensional arrangement of atoms in molecules and how that arrangement affects physical and chemical properties. It is a major topic in IChO preparatory problems, appears in USNCO national exam free response questions, and is increasingly represented in advanced AP Chemistry coursework.

Chirality is the fundamental concept: a molecule is chiral if it is non-superimposable on its mirror image, like left and right hands. The most common source of chirality is a tetrahedral carbon bearing four different substituents — called a stereocenter or chiral center. Molecules with one stereocenter exist as a pair of enantiomers.

The Cahn–Ingold–Prelog (CIP) priority rules assign R or S configuration to each stereocenter. Step 1: rank the four substituents by atomic number (highest priority = 1). Step 2: orient the molecule with priority-4 pointing away from you. Step 3: trace a path from 1 → 2 → 3. Clockwise gives R (rectus); counterclockwise gives S (sinister). When two atoms attached to the stereocenter are the same element, compare the next atoms outward — the "phantom atom" rule handles double bonds.

Diastereomers are stereoisomers that are not mirror images of each other. A compound with n stereocenters has a maximum of 2ⁿ stereoisomers. Meso compounds contain stereocenters but are achiral overall due to an internal plane of symmetry — a classic exam trap that often catches students off-guard.

Fischer projections represent stereochemistry in two dimensions: horizontal bonds project toward the viewer, vertical bonds project away. Newman projections depict conformation by viewing down a C–C bond. Sawhorse diagrams show the 3D perspective from a slight angle. Converting between these representation types is heavily tested in USNCO and IChO problems.

This stereochemistry solver provides step-by-step CIP rule application, interconversion between all projection types, meso compound detection, and optical rotation concepts — the complete toolkit for mastering three-dimensional molecular structure.`,

  'crystal-field': `Crystal field theory (CFT) explains the electronic structure, color, and magnetic properties of transition metal coordination compounds by treating the effect of surrounding ligands as a purely electrostatic perturbation. It is a core IChO topic, tested in USNCO national part II free response, and increasingly present in AP Chemistry as coordination chemistry gains emphasis.

In an isolated transition metal ion, the five d orbitals are degenerate (equal in energy). When ligands approach the metal to form a coordination complex, their negative charges or lone pairs repel the d electrons, raising their energy. Crucially, this destabilization is not uniform — it depends on orbital orientation relative to the ligands.

In octahedral complexes, the d orbitals split into two sets: the higher-energy eᵍ set (dz² and dx²−y², which point directly at the ligands) and the lower-energy t₂ᵍ set (dxy, dxz, dyz, which point between the ligands). The energy gap between these sets is Δₒ (the octahedral crystal field splitting energy) and depends critically on the ligand: weak-field ligands (I⁻, Br⁻, F⁻) give small Δₒ; strong-field ligands (CN⁻, CO, NO₂⁻) give large Δₒ. This ordering is the spectrochemical series.

When Δₒ is large (strong-field ligands), electrons pair in the lower t₂ᵍ set before occupying the eᵍ set — giving a low-spin complex with few unpaired electrons and a large crystal field stabilization energy (CFSE). When Δₒ is small (weak-field ligands), electrons occupy all five d orbitals singly before pairing — giving a high-spin complex with maximum unpaired electrons and a small CFSE. d⁴ through d⁷ configurations can be either high-spin or low-spin depending on the ligand.

The color of coordination compounds arises because Δₒ corresponds to photon energies in the visible spectrum: the complement of the absorbed color is observed. A complex absorbing red light appears green.

This crystal field simulator visualizes d-orbital splitting diagrams, calculates CFSE, and determines spin state and magnetic moment for any metal–ligand combination.`,

  mechanisms: `Organic reaction mechanisms describe the step-by-step bond-breaking and bond-forming events that transform reactants into products. Understanding mechanisms — not merely memorizing reaction outcomes — is what separates excellent chemistry students from those who struggle under exam pressure. Mechanisms are the core of IChO organic chemistry and USNCO national part II.

The foundational tool is curved arrow notation: a full curved arrow shows the movement of two electrons (a bonding or lone pair); a half-headed arrow (fishhook) shows a single electron moving in radical reactions. Every mechanism step involves either breaking a bond (moving electrons away from it) or forming a bond (moving electrons toward an atom).

SN2 (substitution, nucleophilic, bimolecular) reactions occur in a single concerted step: the nucleophile attacks the electrophilic carbon from the back side of the leaving group, and the leaving group departs simultaneously. This gives inversion of configuration (Walden inversion) at the stereocenter. SN2 is favored for primary substrates with strong nucleophiles in polar aprotic solvents.

SN1 reactions proceed via a carbocation intermediate: the leaving group departs first (rate-determining step), forming a planar carbocation, which is then attacked by the nucleophile from either face — giving a racemic mixture at the former stereocenter. Tertiary and allylic/benzylic substrates stabilize carbocations via hyperconjugation and resonance, making them SN1-prone.

Elimination reactions (E1 and E2) compete with substitution. E2 is concerted: a base removes a proton anti-periplanar to the leaving group, forming the double bond in one step. E1 proceeds via the same carbocation intermediate as SN1, followed by proton removal. Zaitsev's rule predicts the more-substituted alkene as the major product; bulky bases favor the less-substituted Hofmann product.

Electrophilic aromatic substitution (EAS) — halogenation, nitration, Friedel-Crafts — follows a two-step mechanism: electrophile attack forms an arenium ion (Wheland intermediate), then deprotonation restores aromaticity. This 3D mechanism viewer animates every step with curved arrows, helping you internalize the mechanistic logic rather than merely memorize reaction equations.`,

  titration: `The titration curve is one of the most powerful analytical tools in chemistry, forming the backbone of AP Chemistry Unit 8 and appearing consistently on USNCO and IChO examinations. Mastering titration goes beyond knowing that moles of acid equal moles of base at the equivalence point — it requires understanding the pH behavior at every stage of the reaction.

In a strong acid–strong base titration, such as HCl with NaOH, the equivalence point occurs exactly at pH 7.00, because the resulting salt (NaCl) does not undergo hydrolysis. The steep, near-vertical jump in pH around the equivalence point makes indicator selection flexible: phenolphthalein, methyl orange, or bromothymol blue all work reliably.

Weak acid titrations reveal a richer landscape. When acetic acid (Ka = 1.8 × 10⁻⁵) is titrated with NaOH, the half-equivalence point falls at pH = pKa = 4.74. This point marks the center of the buffer region, where the concentration of the acid equals that of its conjugate base and pH changes most gradually with added titrant. The Henderson–Hasselbalch equation (pH = pKa + log [A⁻]/[HA]) governs the buffer region precisely. The equivalence point for this system falls above pH 7 because the conjugate base CH₃COO⁻ hydrolyzes water, producing OH⁻.

Polyprotic acids like H₃PO₄ produce multiple equivalence points — one per ionizable proton — each separated by a buffer region governed by its respective Ka. Identifying multiple inflection points on a curve is a standard USNCO and AP FRQ question type.

This free titration simulator plots full S-curves in real time, marks equivalence and half-equivalence points automatically, supports strong/weak systems and polyprotic acids, and lets you select indicators to see their color-transition ranges directly on the curve — everything you need to master this topic completely.`,
}

// Fallback for labs without a custom seoBody
function getLabBody(slug: string, meta: { h1: string; description: string; topics: string[]; apUnits: string[] }): string {
  if (LAB_BODY[slug]) return LAB_BODY[slug]
  return `${meta.h1} is a free interactive chemistry simulation tool for high school and university students, covering topics aligned with the AP Chemistry curriculum, USNCO competition syllabus, and IChO preparatory problem sets. ${meta.description}

This tool covers: ${meta.topics.join(', ')}. ${meta.apUnits.length > 0 ? `It maps to ${meta.apUnits.join(' and ')} in the College Board AP Chemistry framework.` : ''} Use it alongside your textbook to build hands-on intuition that goes beyond worked examples — seeing a simulation respond to your inputs reinforces conceptual understanding far more effectively than passive reading.

All tools on TheChemSolver are 100% free with no account required, no time limits, and no paywalls. We believe quality chemistry education should be accessible to every student regardless of school resources. Whether you are preparing for the AP Chemistry exam in May, working through USNCO practice problems, or studying IChO preparatory materials, these simulators are designed to complement — not replace — rigorous study with textbooks and past exam papers.

The interactive format is particularly valuable for topics that are hard to visualize from static diagrams alone. Experiment freely: change parameters, observe the system's response, and build the kind of physical intuition that separates top scorers from average performers on high-stakes chemistry exams.`
}

const US_BASE = 'https://www.thechemsolver.com'

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const meta = LAB_META[params.slug]
  if (!meta) return { title: 'Chemistry Tool — TheChemSolver' }
  return {
    title: `${meta.h1} | TheChemSolver`,
    description: meta.description,
    keywords: meta.keywords.join(', '),
    alternates: { canonical: `${US_BASE}/labs/${params.slug}` },
    openGraph: {
      title: `${meta.name} — Free Chemistry Tool`,
      description: meta.description,
      url: `${US_BASE}/labs/${params.slug}`,
      siteName: 'TheChemSolver',
      type: 'website',
    },
  }
}

function AdSlot({ className = '', label = 'Advertisement' }: { className?: string; label?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center bg-white/[0.02] border border-dashed border-white/10 rounded-xl text-gray-700 text-[10px] ${className}`}>
      {/* Replace the div above with <ins className="adsbygoogle"> once AdSense is approved */}
      <span className="uppercase tracking-widest opacity-50">{label}</span>
    </div>
  )
}

export default function LabSEOPage({ params }: { params: { slug: string } }) {
  const meta = LAB_META[params.slug]
  if (!meta) notFound()

  return (
    <div className="bg-[#060610] text-white min-h-screen">
      {/* Brief header for SEO — above the tool */}
      <div className="border-b border-white/10 px-5 py-4 bg-[#060610]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Link href="/" className="hover:text-white transition-colors">TheChemSolver</Link>
            <span>/</span>
            <Link href="/labs" className="hover:text-white transition-colors">Tools</Link>
            <span>/</span>
            <span className="text-gray-300">{meta.name}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold text-white">{meta.h1}</h1>
              <p className="text-xs text-gray-400 mt-0.5 max-w-2xl">{meta.description.split('.')[0]}.</p>
            </div>
            <div className="flex gap-2 shrink-0">
              {meta.apUnits.length > 0 && (
                <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-full whitespace-nowrap">
                  {meta.apUnits[0].split(':')[0]}
                </span>
              )}
              {meta.icho && (
                <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-1 rounded-full">IChO</span>
              )}
              <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded-full">Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard ad above tool */}
      <div className="px-5 py-2 max-w-6xl mx-auto">
        <AdSlot className="h-14 max-w-[728px]" label="728×90 Leaderboard" />
      </div>

      {/* Two-column layout: 70% tool + 30% sticky sidebar ad */}
      <div className="flex gap-5 max-w-6xl mx-auto px-5 items-start">

        {/* ── Left: interactive tool (70%) ────────────────────── */}
        <div className="flex-1 min-w-0">
          <LabWrapper slug={params.slug} />

          {/* Horizontal ad directly below the tool — high CTR position */}
          <div className="mt-4">
            <AdSlot className="h-24" label="300×250 Below Tool" />
          </div>
        </div>

        {/* ── Right: sticky 300×600 ad sidebar (30%) ───────────── */}
        <aside className="hidden lg:block w-[300px] shrink-0">
          <div className="sticky top-20 space-y-4">
            <AdSlot className="w-[300px] h-[600px]" label="300×600 Half Page" />
            <AdSlot className="w-[300px] h-[250px]" label="300×250 Rectangle" />
          </div>
        </aside>
      </div>

      {/* Mobile sticky anchor ad (hidden on desktop) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#060610]/95 backdrop-blur border-t border-white/10 py-1.5 px-3 flex justify-center">
        <AdSlot className="h-14 w-full max-w-[320px]" label="320×50 Mobile Anchor" />
      </div>
      {/* Spacer so content doesn't hide behind mobile anchor */}
      <div className="lg:hidden h-16" />

      {/* SEO content section — below the tool */}
      <div className="border-t border-white/10 mt-8 px-5 py-12 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">

          {/* Topics covered */}
          <div>
            <h2 className="font-bold text-sm text-gray-300 mb-3 uppercase tracking-wider">Topics Covered</h2>
            <ul className="space-y-1.5">
              {meta.topics.map(t => (
                <li key={t} className="flex items-start gap-2 text-xs text-gray-400">
                  <span className="text-purple-400 mt-0.5 shrink-0">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* How to use */}
          <div>
            <h2 className="font-bold text-sm text-gray-300 mb-3 uppercase tracking-wider">How to Use</h2>
            <ol className="space-y-2">
              {meta.howTo.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                  <span className="bg-purple-600/30 text-purple-300 rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold text-[10px]">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Curriculum alignment */}
          <div>
            <h2 className="font-bold text-sm text-gray-300 mb-3 uppercase tracking-wider">Curriculum Alignment</h2>
            <div className="space-y-2">
              {meta.apUnits.length > 0 && (
                <div>
                  <div className="text-xs text-blue-400 font-semibold mb-1">AP Chemistry</div>
                  {meta.apUnits.map(u => (
                    <div key={u} className="text-xs text-gray-400 bg-blue-500/5 border border-blue-500/10 rounded px-2 py-1 mb-1">{u}</div>
                  ))}
                </div>
              )}
              {meta.icho && (
                <div>
                  <div className="text-xs text-yellow-400 font-semibold mb-1">IChO Syllabus</div>
                  <div className="text-xs text-gray-400 bg-yellow-500/5 border border-yellow-500/10 rounded px-2 py-1">Included in IChO preparatory topics</div>
                </div>
              )}
              <div className="mt-3">
                <div className="text-xs text-green-400 font-semibold mb-1">Access</div>
                <div className="text-xs text-gray-400">100% free · No account · No time limit</div>
              </div>
            </div>
          </div>
        </div>

        {/* 300+ word SEO prose — required for AdSense approval */}
        <div className="max-w-4xl mx-auto mt-10 pt-8 border-t border-white/10">
          <h2 className="text-lg font-bold mb-4">{meta.h1.split('—')[0].trim()} — In Depth</h2>
          <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed space-y-4">
            {getLabBody(params.slug, meta).split('\n\n').filter(Boolean).map((para, i) => (
              <p key={i}>{para.trim()}</p>
            ))}
          </div>
        </div>

        {/* Ad below long-form content */}
        <div className="max-w-4xl mx-auto mt-8">
          <AdSlot className="h-24" label="728×90 Below Article" />
        </div>

        {/* Related tools */}
        <div className="max-w-4xl mx-auto mt-8 pt-6 border-t border-white/10">
          <h2 className="font-bold text-sm text-gray-300 mb-4 uppercase tracking-wider">More Free Chemistry Tools</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(LAB_META)
              .filter(([s]) => s !== params.slug)
              .slice(0, 8)
              .map(([s, m]) => (
                <Link
                  key={s}
                  href={`/labs/${s}`}
                  className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-3 py-1.5 rounded-full transition-colors"
                >
                  {m.name}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
