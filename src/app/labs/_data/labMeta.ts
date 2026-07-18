export interface LabMeta {
  name: string
  h1: string
  description: string
  keywords: string[]
  apUnits: string[]
  icho: boolean
  topics: string[]
  howTo: string[]
}

export const LAB_META: Record<string, LabMeta> = {
  titration: {
    name: 'Titration Curve Simulator',
    h1: 'Free Titration Curve Simulator — AP Chemistry & IChO',
    description: 'Plot acid-base titration curves in real time. Supports strong/weak acid-base, polyprotic, and redox titrations. Equivalence point detection, pH at any volume, and indicator selection included.',
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
    h1: 'Organic Synthesis Multi-step Pathways — Reaction Routes & Mechanisms',
    description: 'Explore multi-step organic synthesis routes with step-by-step mechanism breakdowns. Covers benzene → aniline, diazonium chemistry, Grignard synthesis, aldol condensation, and more.',
    keywords: ['organic synthesis pathways', 'multi-step synthesis', 'Grignard synthesis', 'aldol condensation synthesis', 'diazonium chemistry synthesis'],
    apUnits: [],
    icho: true,
    topics: ['Benzene → aniline (nitration + reduction)', 'Benzene → phenol via diazonium', 'Aldol condensation synthesis', 'Grignard synthesis of secondary alcohols', 'Diazonium salt reactions (Sandmeyer, azo coupling)', 'Reagent and condition selection for each step'],
    howTo: ['Select a synthesis target from the list', 'Follow each step with reagents, conditions, and mechanism type', 'Review key points highlighted for each transformation'],
  },
  // ── New AP Chemistry labs ──────────────────────────────────────────────
  'gas-laws': {
    name: 'Gas Laws Simulator',
    h1: 'Gas Laws Simulator — Ideal Gas Law, Boyle\'s, Charles\'s & van der Waals Free Tool',
    description: 'Explore Boyle\'s, Charles\'s, Gay-Lussac\'s, and the combined ideal gas law interactively. Compare ideal gas behavior to van der Waals real-gas isotherms. Essential for AP Chemistry Unit 3 and IChO.',
    keywords: ['gas laws simulator', 'ideal gas law calculator', 'Boyle law Charles law', 'van der Waals equation', 'AP chemistry gas laws'],
    apUnits: ['Unit 3: Intermolecular Forces and Properties'],
    icho: true,
    topics: ['PV = nRT — ideal gas law', 'Boyle\'s law (P₁V₁ = P₂V₂)', 'Charles\'s law (V₁/T₁ = V₂/T₂)', 'Gay-Lussac\'s law', 'van der Waals real gas equation', 'Molar volume at STP and non-STP conditions'],
    howTo: ['Select a gas law scenario', 'Adjust pressure, volume, or temperature with sliders', 'Compare ideal and real gas curves on the PV isotherm plot'],
  },
  'colligative-properties': {
    name: 'Colligative Properties Calculator',
    h1: 'Colligative Properties Calculator — Boiling Point Elevation, Freezing Point Depression & Osmotic Pressure',
    description: 'Calculate boiling point elevation, freezing point depression, osmotic pressure, and vapor pressure lowering for any solute-solvent pair. Interactive sliders for molality, van\'t Hoff factor, and temperature. AP Chemistry Unit 3.',
    keywords: ['colligative properties calculator', 'boiling point elevation calculator', 'freezing point depression', 'osmotic pressure calculator', 'Raoult law vapor pressure'],
    apUnits: ['Unit 3: Intermolecular Forces and Properties'],
    icho: true,
    topics: ['Boiling point elevation (ΔTb = iKbm)', 'Freezing point depression (ΔTf = iKfm)', 'Osmotic pressure (π = iMRT)', 'Vapor pressure lowering (Raoult\'s law)', 'Van\'t Hoff factor for electrolytes', 'Molality vs molarity distinction'],
    howTo: ['Select solvent (water, benzene, etc.) and solute type', 'Set molality and van\'t Hoff factor i', 'Read boiling/freezing point shifts and osmotic pressure instantly'],
  },
  'phase-diagram': {
    name: 'Phase Diagram Explorer',
    h1: 'Phase Diagram Explorer — Pressure-Temperature Diagram for Water & CO₂',
    description: 'Explore P-T phase diagrams for water and carbon dioxide. Identify the triple point, critical point, and solid-liquid-gas phase boundaries. See why CO₂ sublimates at atmospheric pressure (dry ice) while water melts. AP Chemistry Unit 3 and IChO.',
    keywords: ['phase diagram explorer', 'pressure temperature diagram', 'triple point critical point', 'water phase diagram', 'CO2 dry ice sublimation'],
    apUnits: ['Unit 3: Intermolecular Forces and Properties'],
    icho: true,
    topics: ['Solid, liquid, gas regions on P-T diagram', 'Triple point — coexistence of all three phases', 'Critical point — supercritical fluid', 'Normal boiling and melting points', 'Water\'s anomalous solid-liquid slope', 'CO₂ sublimation and dry ice'],
    howTo: ['Select substance (water or CO₂)', 'Click or drag on the phase diagram to identify phase regions', 'Read off triple point and critical point coordinates'],
  },
  'unit-cell': {
    name: 'Unit Cell & Crystal Structure Simulator',
    h1: 'Unit Cell & Crystal Structure — SC, BCC, FCC Packing Efficiency & Density Calculator',
    description: 'Visualize simple cubic, body-centered cubic, and face-centered cubic unit cells. Calculate packing efficiency, coordination number, and crystal density from atomic radius. AP Chemistry Unit 2 and IChO solid-state chemistry.',
    keywords: ['unit cell simulator', 'BCC FCC crystal structure', 'packing efficiency calculator', 'crystal density calculator', 'AP chemistry solid state'],
    apUnits: ['Unit 2: Molecular and Ionic Compound Structure and Properties'],
    icho: true,
    topics: ['Simple cubic (SC) — 52% packing efficiency', 'Body-centered cubic (BCC) — 68% packing efficiency', 'Face-centered cubic (FCC) — 74% packing efficiency', 'Coordination number for each structure', 'Density calculation from atomic radius and molar mass', 'Relationship between radius ratio and crystal structure'],
    howTo: ['Select crystal structure (SC, BCC, or FCC)', 'Enter atomic radius and molar mass', 'Read packing efficiency, coordination number, and density'],
  },
  'mo-diagram': {
    name: 'MO Diagram Builder',
    h1: 'MO Diagram Builder — Molecular Orbital Theory for Diatomic Molecules',
    description: 'Fill molecular orbital diagrams for homonuclear and heteronuclear diatomics. Calculate bond order, predict paramagnetism or diamagnetism, and understand why O₂ is paramagnetic despite its apparent double bond. AP Chemistry and IChO.',
    keywords: ['MO diagram builder', 'molecular orbital theory', 'bond order calculator', 'paramagnetism diamagnetism', 'O2 molecular orbital diagram'],
    apUnits: ['Unit 2: Molecular and Ionic Compound Structure and Properties'],
    icho: true,
    topics: ['σ and π molecular orbital formation', 'Bonding vs antibonding orbital filling', 'Bond order = (bonding − antibonding) / 2', 'Paramagnetism from unpaired electrons', 'MO diagrams for H₂, He₂, Li₂, B₂, C₂, N₂, O₂, F₂, Ne₂', 'Why O₂ is paramagnetic (two unpaired electrons in π* orbitals)'],
    howTo: ['Select the diatomic molecule from the list', 'Watch electrons fill into σ and π MOs by energy', 'Read bond order and magnetic properties from the filled diagram'],
  },
  'lewis-structure': {
    name: 'Lewis Structure Builder',
    h1: 'Lewis Structure Builder — Formal Charge, Octet Rule & Resonance Checker',
    description: 'Click to build Lewis structures for any molecule. Set bond orders, assign lone pairs, and get real-time formal charge and octet-rule checking. Handles expanded octets, radicals, and resonance structures.',
    keywords: ['Lewis structure builder', 'formal charge calculator', 'octet rule checker', 'Lewis dot structure', 'resonance structure tool'],
    apUnits: ['Unit 2: Molecular and Ionic Compound Structure and Properties'],
    icho: true,
    topics: ['Lewis dot structure rules', 'Formal charge = valence − lone − ½(bonding)', 'Octet rule and expanded octets (P, S, Cl)', 'Resonance structures and delocalization', 'Radical species with odd electron counts', 'Minimizing formal charge to find best Lewis structure'],
    howTo: ['Click bonds to set bond order (single/double/triple)', 'Click atoms to add or remove lone pairs', 'Formal charge and octet status update instantly — red means check it'],
  },
  'bond-polarity': {
    name: 'Bond Polarity Visualizer',
    h1: 'Bond Polarity Visualizer — Electronegativity Difference, Dipole Arrows & Classification',
    description: 'Pick any two elements and see the electronegativity difference (ΔEN), dipole arrow direction, δ+/δ− partial charge labels, and automatic nonpolar/polar/ionic bond classification. AP Chemistry Unit 2.',
    keywords: ['bond polarity visualizer', 'electronegativity difference', 'dipole moment tool', 'polar covalent bond', 'ionic vs covalent bond'],
    apUnits: ['Unit 2: Molecular and Ionic Compound Structure and Properties'],
    icho: true,
    topics: ['Pauling electronegativity values', 'ΔEN classification: nonpolar (<0.4), polar (0.4–1.7), ionic (>1.7)', 'Dipole arrow direction (δ− toward more EN atom)', 'Bond polarity vs molecular polarity', 'Most and least electronegative elements', 'Effect of bond polarity on physical properties'],
    howTo: ['Select two elements from the periodic table', 'See ΔEN, dipole arrow, δ+/δ− labels, and bond type classification', 'Compare multiple bond pairs side by side'],
  },
  'imf-comparator': {
    name: 'IMF Comparator',
    h1: 'Intermolecular Forces Comparator — Predict Boiling Points from IMF Strength',
    description: 'Compare intermolecular forces between any two substances and predict which has a higher boiling point. Identifies hydrogen bonding, dipole-dipole, and London dispersion forces for 26 real molecules. AP Chemistry Unit 3.',
    keywords: ['intermolecular forces comparator', 'IMF boiling point predictor', 'hydrogen bonding tool', 'London dispersion forces', 'AP chemistry IMF'],
    apUnits: ['Unit 3: Intermolecular Forces and Properties'],
    icho: true,
    topics: ['London dispersion forces (all molecules)', 'Dipole-dipole interactions (polar molecules)', 'Hydrogen bonding (N-H, O-H, F-H)', 'Relative IMF strength and boiling point correlation', 'HF vs HCl: why smaller HF boils higher', 'Ethanol vs dimethyl ether: same formula, different IMF'],
    howTo: ['Select two substances from the dropdowns', 'Compare their IMF types side by side', 'Switch to Predict mode to test yourself before seeing the answer'],
  },
  'beer-lambert': {
    name: 'Beer-Lambert Law Lab',
    h1: 'Beer-Lambert Law Lab — Absorbance, Transmittance & Calibration Curve',
    description: 'Adjust solution concentration and watch the cuvette darken in real time as A = εbc is applied. Build a calibration curve (absorbance vs concentration) and solve for unknown sample concentration. AP Chemistry Unit 3 and IChO analytical chemistry.',
    keywords: ['Beer Lambert law simulator', 'absorbance concentration calculator', 'calibration curve chemistry', 'spectrophotometry tool', 'AP chemistry spectroscopy'],
    apUnits: ['Unit 3: Intermolecular Forces and Properties'],
    icho: true,
    topics: ['Beer-Lambert law: A = εbc', 'Absorbance and transmittance relationship: T = 10^(−A)', 'Molar absorptivity (extinction coefficient ε)', 'Building a calibration curve (absorbance vs concentration)', 'Solving for unknown concentration from absorbance', 'Effect of path length on absorbance'],
    howTo: ['Select a compound and set its concentration with the slider', 'Watch the cuvette color change and read off absorbance A', 'Switch to Calibration Curve mode to plot A vs c and solve for unknowns'],
  },
  chromatography: {
    name: 'Chromatography Simulator',
    h1: 'Paper Chromatography Simulator — Rf Value Calculator & Pigment Separation',
    description: 'Watch a mixed spot separate in real time as solvent climbs the paper strip. Calculate Rf values live for black ink, leaf pigments (carotene, chlorophylls a & b, xanthophyll), and food dyes. AP Chemistry Unit 3.',
    keywords: ['chromatography simulator', 'Rf value calculator', 'paper chromatography tool', 'leaf pigment separation', 'AP chemistry chromatography'],
    apUnits: ['Unit 3: Intermolecular Forces and Properties'],
    icho: false,
    topics: ['Rf = distance traveled by spot / distance traveled by solvent front', 'Paper chromatography separation principle', 'Relative polarity and stationary-phase affinity', 'Carotene, chlorophyll a, chlorophyll b, xanthophyll Rf ordering', 'Black ink component separation', 'Live Rf readout throughout the run'],
    howTo: ['Select a mixture (black ink, spinach extract, or food dyes)', 'Click Run to watch the solvent front rise and spots separate', 'Click Reveal to see the identity of each component and its Rf value'],
  },
  'reaction-classifier': {
    name: 'Reaction Type Classifier',
    h1: 'Reaction Type Classifier — Synthesis, Decomposition, Replacement & Combustion Quiz',
    description: 'Classify 25 real balanced equations into the 5 standard reaction types: synthesis, decomposition, single replacement, double replacement, and combustion. Instant feedback with explanation. Great for AP Chemistry Unit 4.',
    keywords: ['reaction type classifier', 'synthesis decomposition combustion quiz', 'single replacement double replacement', 'chemical reaction types AP chemistry', 'balanced equation classification'],
    apUnits: ['Unit 4: Chemical Reactions'],
    icho: false,
    topics: ['Synthesis: A + B → AB', 'Decomposition: AB → A + B', 'Single replacement: A + BC → AC + B', 'Double replacement: AB + CD → AD + CB', 'Combustion: fuel + O₂ → CO₂ + H₂O', 'Real examples: Haber process, limestone decomposition, Zn + HCl'],
    howTo: ['Click Quiz to get a random balanced equation', 'Select the reaction type you think it is', 'Get instant feedback and explanation — track your score'],
  },
  'net-ionic-equation': {
    name: 'Net Ionic Equation Builder',
    h1: 'Net Ionic Equation Builder — Identify & Remove Spectator Ions Interactively',
    description: 'Given a complete ionic equation, click the spectator ions to cancel them out and reveal the net ionic equation. Covers precipitation, acid-base, and gas-forming reactions. AP Chemistry Unit 4 and 8.',
    keywords: ['net ionic equation builder', 'spectator ion identifier', 'complete ionic equation', 'precipitation reaction net ionic', 'AP chemistry ionic equations'],
    apUnits: ['Unit 4: Chemical Reactions', 'Unit 8: Acids and Bases'],
    icho: true,
    topics: ['Identifying spectator ions from solubility rules', 'Writing complete ionic equations', 'Removing spectators to get net ionic equation', 'Precipitation reactions (AgNO₃ + NaCl, BaSO₄)', 'Acid-base neutralization net ionic: H⁺ + OH⁻ → H₂O', 'Gas-forming reactions'],
    howTo: ['Read the complete ionic equation shown', 'Click each ion or formula you believe is a spectator ion', 'Click Check to see if you correctly identified all spectators'],
  },
  'limiting-reagent': {
    name: 'Limiting Reagent Visualizer',
    h1: 'Limiting Reagent Visualizer — See Which Reactant Runs Out First',
    description: 'Adjust moles of each reactant and watch them pair up molecule by molecule by stoichiometric ratio. The limiting reagent runs out first; the excess reagent molecules are left over. Visual and intuitive. AP Chemistry Unit 4.',
    keywords: ['limiting reagent visualizer', 'limiting reactant calculator', 'excess reagent calculator', 'stoichiometry limiting reagent', 'AP chemistry stoichiometry'],
    apUnits: ['Unit 4: Chemical Reactions'],
    icho: false,
    topics: ['Limiting reagent definition and identification', 'Excess reagent calculation', 'Stoichiometric ratio from balanced equation', 'Moles of product from limiting reagent', 'Common reactions: N₂ + H₂ → NH₃, H₂ + O₂ → H₂O', 'Visual molecule pairing to show what runs out first'],
    howTo: ['Select a balanced reaction', 'Adjust moles of reactant A and B with the sliders', 'Watch the visual — the reagent that runs out of pairs first is the limiting reagent'],
  },
  'stoichiometry-mapper': {
    name: 'Stoichiometry Mapper',
    h1: 'Stoichiometry Mapper — The Complete Mole Road Map with Live Calculations',
    description: 'The classic mole road map: convert grams or particles of reactant A to grams or particles of product B, with every conversion factor (molar mass, Avogadro\'s number, mole ratio) shown live. AP Chemistry Unit 4.',
    keywords: ['stoichiometry calculator', 'mole road map', 'grams to moles calculator', 'Avogadro number calculator', 'AP chemistry stoichiometry'],
    apUnits: ['Unit 4: Chemical Reactions'],
    icho: false,
    topics: ['Grams → moles (÷ molar mass)', 'Moles A → moles B (× mole ratio from balanced equation)', 'Moles → grams (× molar mass)', 'Moles → particles (× 6.022 × 10²³)', 'Mole ratio from stoichiometric coefficients', 'Complete multi-step road map for any balanced reaction'],
    howTo: ['Select a balanced equation', 'Choose the starting substance, quantity, and unit (g, mol, particles)', 'Choose the target substance and unit — see the complete road map live'],
  },
  'hess-law': {
    name: "Hess's Law Builder",
    h1: "Hess's Law Builder — Manipulate Reaction Steps to Find Target ΔH",
    description: "Reverse or multiply given reaction steps so they add up to a target equation. ΔH follows the same manipulation: reversing flips the sign, scaling multiplies it. Covers 3 real puzzles including formation of C₂H₂. AP Chemistry Unit 6.",
    keywords: ["Hess's law calculator", 'enthalpy of formation Hess law', 'reaction enthalpy calculation', 'combustion enthalpy Hess', 'AP chemistry thermochemistry'],
    apUnits: ['Unit 6: Thermodynamics'],
    icho: true,
    topics: ["Hess's law: ΔH is path-independent", 'Reversing a reaction flips the sign of ΔH', 'Multiplying by a factor scales ΔH by the same factor', 'Standard enthalpy of formation via Hess\'s law', 'Combustion enthalpies as building blocks', 'Formation of acetylene (C₂H₂): ΔHf ≈ +226.7 kJ/mol'],
    howTo: ['Read the target equation shown at the top', 'For each given step, choose reverse or keep, and choose a multiplier', 'When all steps sum to the target, ΔH total is the answer — click Check'],
  },
  calorimetry: {
    name: 'Calorimetry Lab',
    h1: 'Calorimetry Lab — Mix Two Substances and Find Equilibrium Temperature',
    description: 'Mix two substances with different masses, specific heats, and starting temperatures. The simulation calculates the equilibrium temperature Tf using conservation of energy: m₁c₁ΔT₁ = m₂c₂ΔT₂. Real specific heat values for 8 materials. AP Chemistry Unit 6.',
    keywords: ['calorimetry lab simulator', 'specific heat calculator', 'equilibrium temperature calculator', 'heat transfer simulation', 'AP chemistry calorimetry'],
    apUnits: ['Unit 6: Thermodynamics'],
    icho: true,
    topics: ['q = mcΔT — heat equation', 'Conservation of energy: heat lost = heat gained', 'Equilibrium temperature formula: Tf = (m₁c₁T₁ + m₂c₂T₂)/(m₁c₁ + m₂c₂)', 'Specific heats: water 4.184, Al 0.897, Fe 0.449, Cu 0.385, Au 0.129', 'Coffee-cup vs bomb calorimetry', 'Water\'s high specific heat and its environmental significance'],
    howTo: ['Select material and set mass and temperature for Object 1 (hot)', 'Select material and set mass and temperature for Object 2 (cold)', 'Read the equilibrium temperature Tf and heat transferred q'],
  },
  'bond-energy': {
    name: 'Bond Energy Calculator',
    h1: 'Bond Energy Calculator — ΔH from Bonds Broken Minus Bonds Formed',
    description: 'Calculate reaction enthalpy from average bond energies: ΔH = Σ(bonds broken) − Σ(bonds formed). Predict exo/endothermic before revealing the full bond-by-bond energy accounting. Covers H₂ + Cl₂, N₂ + H₂, and methane combustion. AP Chemistry Unit 6.',
    keywords: ['bond energy calculator', 'bond enthalpy ΔH calculation', 'bonds broken bonds formed', 'average bond energy', 'AP chemistry bond energy'],
    apUnits: ['Unit 6: Thermodynamics'],
    icho: true,
    topics: ['ΔH = Σ(bonds broken) − Σ(bonds formed)', 'Breaking bonds: endothermic (costs energy)', 'Forming bonds: exothermic (releases energy)', 'Average vs molecule-specific bond energies', 'Real reactions: H₂+Cl₂→2HCl, N₂+3H₂→2NH₃, CH₄+O₂', 'Bond-energy ΔH as an estimate vs measured ΔH'],
    howTo: ['Select a reaction from the list', 'Predict whether it is exothermic or endothermic', 'Click Reveal to see the bond-by-bond tally and the calculated ΔH'],
  },
  'enthalpy-diagram': {
    name: 'Enthalpy Diagram Plotter',
    h1: 'Enthalpy Diagram Plotter — Reaction Coordinate, Activation Energy & Catalyst Effect',
    description: 'Drag reactant, transition state, and product energies to build a reaction-coordinate diagram. Add a catalyst and watch it lower both Ea(fwd) and Ea(rev) without changing ΔH. The most-tested catalyst fact on AP Chemistry. Unit 5 and 6.',
    keywords: ['enthalpy diagram plotter', 'reaction coordinate diagram', 'activation energy simulator', 'catalyst effect diagram', 'AP chemistry energy profile'],
    apUnits: ['Unit 5: Kinetics', 'Unit 6: Thermodynamics'],
    icho: true,
    topics: ['Reaction coordinate diagram components', 'Ea(forward) = E(TS) − E(reactants)', 'Ea(reverse) = E(TS) − E(products)', 'ΔH = E(products) − E(reactants)', 'Catalyst lowers Ea without changing ΔH', 'Exothermic vs endothermic from diagram shape'],
    howTo: ['Adjust reactant, transition state, and product energy sliders', 'Read Ea(fwd), Ea(rev), and ΔH from the diagram', 'Check the catalyst box and drag the drop slider to see how Ea changes'],
  },
  'electrolytic-cell': {
    name: 'Electrolytic Cell Simulator',
    h1: 'Electrolytic Cell Simulator — Faraday\'s Law of Electrolysis & Product Calculator',
    description: 'Set current (A) and time (min) to calculate exactly how much product forms at each electrode using Faraday\'s law: Q = It, mol e⁻ = Q/F. Covers molten NaCl, water electrolysis, CuSO₄ electroplating, and Hall-Héroult. AP Chemistry Unit 9.',
    keywords: ['electrolytic cell simulator', 'Faraday law electrolysis', 'electroplating calculator', 'moles electrons calculator', 'AP chemistry electrolysis'],
    apUnits: ['Unit 9: Applications of Thermodynamics'],
    icho: true,
    topics: ['Faraday\'s law: Q = It, mol e⁻ = Q/F (F = 96485 C/mol)', 'Mass deposited: m = (MIt)/(nF)', 'Electrolytic vs galvanic cell wiring (anode = + in electrolytic)', 'Molten NaCl electrolysis (Downs process)', 'Water electrolysis: H₂ at cathode, O₂ at anode', 'CuSO₄ electroplating', 'Hall-Héroult process for aluminum'],
    howTo: ['Select the electrolyte/scenario', 'Set current (A) and time (min) with sliders', 'Read Q, mol e⁻, and product amount at each electrode from the live calculation'],
  },
  'photoelectric-effect': {
    name: 'Photoelectric Effect Simulator',
    h1: 'Photoelectric Effect Simulator — Einstein\'s Equation, Work Function & Stopping Voltage',
    description: 'Simulate Einstein\'s photoelectric effect: shine light of adjustable frequency on a metal surface and measure kinetic energy of ejected electrons. Visualize the threshold frequency, work function, and stopping voltage. AP Chemistry Unit 1.',
    keywords: ['photoelectric effect simulator', 'Einstein photoelectric equation', 'work function calculator', 'stopping voltage calculator', 'AP chemistry quantum'],
    apUnits: ['Unit 1: Atomic Structure and Properties'],
    icho: true,
    topics: ['Einstein\'s equation: KE = hν − φ', 'Work function φ = hν₀ (threshold frequency)', 'Stopping voltage Vs = KE/e', 'Photon energy E = hν = hc/λ', 'Effect of intensity (more photons, not higher energy)', 'Real metals: Na, K, Mg, Al, Zn, Cu, Ag, Pt'],
    howTo: ['Select a metal from the list', 'Adjust light frequency with the slider', 'Watch KE of ejected electrons and read stopping voltage — below threshold, nothing happens'],
  },
  'h-emission-spectrum': {
    name: 'Hydrogen Emission Spectrum',
    h1: 'Hydrogen Emission Spectrum — Click Energy Levels to See Photon Wavelength & Color',
    description: 'Click initial and final electron energy levels (n=1 through n=6) to calculate photon wavelength, frequency, and energy for any hydrogen transition. Identifies Lyman, Balmer, Paschen, and Brackett series. AP Chemistry Unit 1.',
    keywords: ['hydrogen emission spectrum', 'Balmer series calculator', 'Lyman series wavelength', 'Rydberg formula calculator', 'AP chemistry atomic spectra'],
    apUnits: ['Unit 1: Atomic Structure and Properties'],
    icho: true,
    topics: ['Rydberg formula: 1/λ = R∞(1/n₁² − 1/n₂²)', 'Lyman series (UV): n→1 transitions', 'Balmer series (visible): n→2 transitions', 'Paschen series (IR): n→3 transitions', 'Brackett series (IR): n→4 transitions', 'Photon energy E = hν = hc/λ'],
    howTo: ['Click a starting energy level (n=2 through 6)', 'Click a final energy level (lower n)', 'Read wavelength in nm, identify the spectral series, and see the visible color band'],
  },
  'electron-config': {
    name: 'Electron Configuration Builder',
    h1: 'Electron Configuration Builder — Aufbau, Hund\'s Rule & Exceptions Interactive',
    description: 'Drag or click electrons into subshells with Aufbau, Pauli, and Hund\'s rule enforced live. Shows full electron configuration notation, magnetism, and handles Cr/Cu exceptions. AP Chemistry Unit 1.',
    keywords: ['electron configuration builder', 'Aufbau principle tool', 'Hund rule Pauli exclusion', 'electron config exceptions Cr Cu', 'AP chemistry electron configuration'],
    apUnits: ['Unit 1: Atomic Structure and Properties'],
    icho: true,
    topics: ['Aufbau principle — fill lowest energy first', 'Pauli exclusion — max 2 electrons per orbital', 'Hund\'s rule — maximize unpaired electrons in degenerate orbitals', 'Chromium (Cr): [Ar] 3d⁵ 4s¹ exception', 'Copper (Cu): [Ar] 3d¹⁰ 4s¹ exception', 'Diamagnetic vs paramagnetic from configuration'],
    howTo: ['Select an element by atomic number or name', 'Watch electrons fill into subshells in Aufbau order', 'See the full configuration notation and count of unpaired electrons'],
  },
  'pes-spectrum': {
    name: 'PES Spectrum Reader',
    h1: 'Photoelectron Spectrum (PES) Reader — Peak Position, Electron Count & Element ID',
    description: 'Read photoelectron spectra: peak position gives binding energy (subshell identity), peak height gives relative electron count. Explore known elements or guess the mystery element from its spectrum. AP Chemistry Unit 1.',
    keywords: ['PES spectrum reader', 'photoelectron spectroscopy AP chemistry', 'binding energy subshell', 'mystery element PES', 'AP chemistry PES'],
    apUnits: ['Unit 1: Atomic Structure and Properties'],
    icho: false,
    topics: ['PES peak position = binding energy of a subshell', 'PES peak height = number of electrons in that subshell', 'Identifying subshells from binding energy scale', 'Reading full electron configuration from PES', 'Mystery element identification from PES pattern', 'Core electrons vs valence electrons on PES'],
    howTo: ['Select Explore to see any element\'s PES', 'Select Quiz to identify a mystery element from its spectrum', 'Click peaks to read off binding energy and electron count'],
  },
  'isotope-mass-spec': {
    name: 'Isotope Mass Spectrometer',
    h1: 'Isotope Mass Spectrometer — Read Spectra & Calculate Weighted Average Atomic Mass',
    description: 'Real isotope masses and natural abundances for 30 elements displayed as mass spectra. Read the m/z peaks, compute the weighted average atomic mass, and verify against the periodic table value. AP Chemistry Unit 1.',
    keywords: ['isotope mass spectrometer', 'atomic mass calculation isotopes', 'weighted average atomic mass', 'mass spectrum isotopes', 'AP chemistry isotopes'],
    apUnits: ['Unit 1: Atomic Structure and Properties'],
    icho: true,
    topics: ['Mass spectrometer isotope peaks at m/z values', 'Relative abundance (%) for each isotope', 'Weighted average atomic mass = Σ(mass × abundance)', 'Why atomic mass is not a whole number', 'Real isotope data: C-12/C-13, Cl-35/Cl-37, Cu-63/Cu-65', 'Verification against IUPAC atomic weights'],
    howTo: ['Select an element from the list', 'Read m/z peak positions (isotope masses) and their heights (abundances)', 'Calculate weighted average mass and check against the known value'],
  },
  'nmr-predictor': {
    name: '¹H NMR Predictor',
    h1: '¹H NMR Predictor — Chemical Shift, n+1 Splitting Rule & Integration',
    description: 'Predict ¹H NMR spectra for classic organic teaching molecules. Shows chemical shift (δ ppm), integration ratio, and splitting pattern from the n+1 rule. Covers ethanol, acetone, diethyl ether, acetic acid, and more. AP Chemistry and IChO.',
    keywords: ['NMR predictor', '1H NMR chemical shift', 'n+1 splitting rule', 'NMR integration', 'organic chemistry NMR tool'],
    apUnits: [],
    icho: true,
    topics: ['Chemical shift δ (ppm) reference scale', 'n+1 splitting rule for adjacent H atoms', 'Integration ratio proportional to H count', 'TMS = 0 ppm reference', 'Characteristic shifts: CH₃ ~1, CH₂ ~2, OH ~3–5, ArH ~7–8', 'Common molecules: ethanol, acetone, diethyl ether'],
    howTo: ['Select a molecule from the list', 'See the predicted ¹H NMR spectrum with labeled peaks', 'Click a peak to see which H environment it corresponds to and the splitting pattern'],
  },
  'mass-spec': {
    name: 'Mass Spectrometry Simulator',
    h1: 'Mass Spectrometry Simulator — EI Fragmentation, Base Peak & Molecular Ion',
    description: 'Simulate electron-ionization (EI) mass spectrometry: see the molecular ion (M⁺) peak, common fragmentations (alpha-cleavage, tropylium cation, McLafferty rearrangement), and identify the base peak for classic organic molecules.',
    keywords: ['mass spectrometry simulator', 'EI fragmentation', 'base peak mass spectrum', 'molecular ion peak', 'organic chemistry mass spec'],
    apUnits: [],
    icho: true,
    topics: ['Molecular ion (M⁺) peak at full molar mass', 'Alpha-cleavage at C–C adjacent to heteroatom', 'Tropylium cation (m/z = 91) from benzyl cleavage', 'McLafferty rearrangement in carbonyl compounds', 'Base peak = most abundant fragment', 'Isotope patterns: M+1, M+2 for Cl, Br'],
    howTo: ['Select an organic molecule', 'View the EI mass spectrum with m/z vs relative abundance', 'Click labeled peaks to see the fragmentation mechanism that produced them'],
  },
  'sn1-sn2-e1-e2': {
    name: 'SN1 / SN2 / E1 / E2 Predictor',
    h1: 'SN1 / SN2 / E1 / E2 Predictor — Pick Substrate, Nucleophile & Solvent to Predict Mechanism',
    description: 'Select substrate class, nucleophile/base strength, solvent polarity, and temperature to predict which mechanism (SN1, SN2, E1, E2) dominates — with full step-by-step reasoning. AP Chemistry and IChO organic chemistry.',
    keywords: ['SN1 SN2 E1 E2 predictor', 'substitution elimination mechanism', 'nucleophile leaving group mechanism', 'organic mechanism predictor', 'Zaitsev Hofmann product'],
    apUnits: [],
    icho: true,
    topics: ['SN2: primary + strong nucleophile + polar aprotic', 'SN1: tertiary + weak nuc + polar protic + stable carbocation', 'E2: strong bulky base + anti-periplanar geometry + Zaitsev product', 'E1: tertiary substrate + heat + weak base', 'Solvent effect: polar aprotic favors SN2, polar protic favors SN1/E1', 'Competing pathway prediction with reasoning'],
    howTo: ['Select substrate (methyl, primary, secondary, tertiary, allylic/benzylic)', 'Select nucleophile/base strength and solvent', 'Read the predicted mechanism and the reasoning behind the prediction'],
  },
}

// ── 300-word SEO prose for each lab ────────────────────────────────────────
// Required for Google AdSense approval: "Low value content" is rejected when
// a page contains only an interactive element with no explanatory text.
export const LAB_BODY: Record<string, string> = {
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

  'ionic-equilibrium': `Buffer solutions resist changes in pH when small amounts of acid or base are added, making them essential in biological systems, industrial processes, and analytical chemistry. Understanding buffers requires connecting weak acid/base equilibrium to the Henderson-Hasselbalch equation, a core AP Chemistry Unit 8 topic and a recurring IChO calculation type.

The Henderson-Hasselbalch equation, pH = pKa + log([A-]/[HA]), is derived directly from the Ka expression and lets you calculate buffer pH without solving a full ICE table every time. It reveals the key insight: when [A-] = [HA] (equal moles of acid and conjugate base), pH = pKa exactly — this is the center of the buffer region, where the buffer resists pH change most effectively.

Buffer capacity — how much acid or base a buffer can absorb before its pH changes significantly — depends on the absolute concentrations of the acid/base pair, not just their ratio. A buffer made from 1 M acetic acid and 1 M acetate resists far more added strong acid than one made from 0.01 M concentrations, even though both start at the same pH.

Salt hydrolysis explains why solutions of salts like NH4Cl or NaCH3COO are not neutral. The ammonium ion (conjugate acid of a weak base) hydrolyzes water to produce H3O+, making NH4Cl solutions acidic; acetate ion (conjugate base of a weak acid) hydrolyzes to produce OH-, making sodium acetate solutions basic. The common ion effect further suppresses ionization of a weak acid or base when its conjugate is already present in solution, a principle that directly explains why buffers work.

This buffer and ionic equilibrium calculator lets you adjust acid/base concentrations, visualize the Henderson-Hasselbalch relationship in real time, and explore hydrolysis and common-ion scenarios — the exact calculation skill tested throughout AP Chemistry Unit 8 and IChO acid-base problems.`,

  coordination: `Coordination compounds — complexes of a central metal ion surrounded by ligands — display distinctive colors, magnetic behavior, and reactivity that simple ionic bonding models cannot explain. Crystal field theory provides the electrostatic framework used throughout AP Chemistry, USNCO, and IChO to predict and explain these properties.

When ligands approach a metal ion to form an octahedral complex, the five originally degenerate d orbitals split into two energy sets: a higher-energy eg set (dz² and dx²-y², pointing directly at the six ligands) and a lower-energy t2g set (dxy, dxz, dyz, pointing between ligands). The energy gap between them, the crystal field splitting parameter Δo, depends on both the ligand and the metal's oxidation state.

Ligand field strength follows the spectrochemical series, roughly: I- < Br- < Cl- < F- < H2O < NH3 < en < CN- ≈ CO. Weak-field ligands produce a small Δo, favoring high-spin configurations where electrons occupy all five d orbitals singly before pairing (maximizing unpaired electrons, per Hund's rule). Strong-field ligands produce a large Δo large enough that electrons preferentially pair in the lower t2g set rather than jump the gap, giving low-spin configurations. Only d4 through d7 metal ions can actually show this high-spin/low-spin distinction — d1-d3 and d8-d10 configurations are unambiguous regardless of field strength.

Color in coordination compounds arises because Δo often corresponds to a visible-light photon energy: an electron absorbs a photon to jump from t2g to eg, and the complex displays the complementary color of whatever wavelength was absorbed. Magnetic moment, measured experimentally, directly confirms the number of unpaired electrons predicted by the splitting diagram — a copper(II) complex with one unpaired d9 electron is paramagnetic, while a low-spin d6 complex like [Fe(CN)6]4- is diamagnetic.

This crystal field simulator builds d-orbital splitting diagrams for any metal-ligand combination, calculates crystal field stabilization energy, and predicts high-spin versus low-spin behavior and magnetic moment — the complete coordination chemistry toolkit for IChO and advanced AP Chemistry preparation.`,

  'radial-probability': `The radial probability distribution function answers a deceptively subtle question: at what distance from the nucleus is an electron most likely to be found? This IChO-level quantum chemistry topic goes beyond the simple orbital-shape pictures taught in introductory courses and requires distinguishing the wave function ψ(r) from the probability density ψ²(r)4πr².

The wave function ψ(r) itself is largest at the nucleus for an s orbital — but that does not mean the electron is most likely to be found there. The radial probability distribution multiplies |ψ(r)|² by the volume of a thin spherical shell at radius r, which is proportional to 4πr². Near the nucleus this shell volume is nearly zero, so even though ψ² is large there, the probability of finding the electron in that vanishingly thin shell is also near zero. The most probable radius for a 1s electron in hydrogen turns out to be exactly one Bohr radius (52.9 pm), not r = 0.

Radial nodes — spherical surfaces where the probability of finding the electron is exactly zero — occur where the radial wave function changes sign. The number of radial nodes for any orbital equals n - l - 1. A 1s orbital (n=1, l=0) has zero radial nodes; a 2s orbital (n=2, l=0) has one; a 3p orbital (n=3, l=1) has one as well. Counting nodes correctly is a frequent source of error on IChO quantum problems, especially distinguishing radial nodes from angular nodes (which depend only on l).

Comparing radial distributions across orbitals reveals orbital penetration: a 3s electron, despite having higher average energy than a 3p or 3d electron, has significant probability density very close to the nucleus due to an inner lobe — this penetration effect is what causes the 4s orbital to fill before 3d in multi-electron atoms, explaining several periodic table exceptions.

This radial probability simulator plots ψ(r) and ψ²(r)4πr² side by side for any hydrogen orbital from 1s through 4f, letting you directly see node positions, most probable radius, and orbital penetration — visualizations rarely available outside advanced physical chemistry coursework.`,

  'atomic-evolution': `The hydrogen atom's emission spectrum was the experimental result that forced physicists to abandon classical mechanics and accept quantized energy levels — a foundational story in AP Chemistry Unit 1 and a frequent IChO atomic structure topic.

When an electron in a hydrogen atom drops from a higher energy level ni to a lower one nf, it emits a photon with energy exactly equal to the difference between those two quantized levels. The Rydberg formula, 1/λ = R∞(1/nf² - 1/ni²), where R∞ = 1.097 × 10^7 m⁻¹, predicts the exact wavelength of every possible transition — and every wavelength predicted by this simple formula has been experimentally confirmed to extraordinary precision.

Transitions are grouped into series by their final energy level. The Lyman series (transitions ending at n=1) falls entirely in the ultraviolet, since these are the largest possible energy gaps. The Balmer series (transitions ending at n=2) is the only series with lines in the visible spectrum — the four famous hydrogen emission lines at 656 nm (red), 486 nm (cyan), 434 nm (blue), and 410 nm (violet) all belong to this series and were the first spectral lines ever measured precisely, decades before quantum theory existed to explain them. The Paschen (n=3) and Brackett (n=4) series fall in the infrared.

Because energy levels get closer together as n increases (En = -13.6 eV/n²), transitions from very high n converge toward a series limit — the ionization energy for that series' final state. Photon energy, frequency, and wavelength are related by E = hν = hc/λ, letting any one property be calculated from another. Absorption spectra show the reverse process: an atom absorbing exactly the photon energies needed to promote electrons upward, producing dark lines at the same wavelengths as the corresponding emission lines.

This atomic spectra simulator lets you select any electron transition, instantly see the resulting photon's wavelength, frequency, and energy, and visualize which series and region of the electromagnetic spectrum it falls into — turning the abstract Rydberg formula into an interactive, visual tool.`,

  hydrocarbon: `Hydrocarbons — compounds built purely from carbon and hydrogen — form the structural backbone of organic chemistry, and building them correctly by hand is the essential first skill before tackling reaction mechanisms or synthesis. This structure-building practice underlies AP Chemistry organic content and every subsequent IChO organic problem.

Alkanes (CnH2n+2) contain only single bonds and are named by identifying the longest continuous carbon chain, then numbering it to give substituents the lowest possible locants. Alkenes (CnH2n) contain at least one C=C double bond, introducing geometric isomerism: when each carbon of the double bond has two different substituents, cis/trans (or the more rigorous E/Z, based on CIP priority) isomers exist as genuinely different compounds with different physical properties, not just different drawings of the same molecule.

Alkynes (CnH2n-2) contain a C≡C triple bond and are named with the "-yne" suffix; because the triple bond is linear, alkynes cannot show cis/trans isomerism at that bond. Degree of unsaturation — calculated from molecular formula as DoU = (2C + 2 + N - H)/2 — tells you the total number of rings and pi bonds in a molecule before you even see its structure, a fast sanity check used throughout organic problem-solving.

Cyclic hydrocarbons introduce ring strain considerations: cyclopropane and cyclobutane have significant angle strain from forcing bond angles far from the ideal 109.5°, while cyclohexane can adopt a chair conformation with zero angle strain. Aromatic hydrocarbons, built on the benzene ring, follow Hückel's rule (4n+2 pi electrons) for aromatic stabilization and undergo substitution reactions rather than the addition reactions typical of alkenes.

This hydrocarbon builder lets you construct any structure by clicking to add carbons and bonds, automatically generates the correct IUPAC name, and displays structural, condensed, and bond-line formulas side by side — building the structural fluency that every later organic chemistry topic depends on.`,

  'organic-mechanism': `Nucleophilic addition to carbonyl compounds is one of the most important reaction classes in organic chemistry, forming the mechanistic basis for a huge share of synthetic transformations tested on AP Chemistry, Orgo 1/2, and IChO exams. This mechanism viewer focuses on that addition chemistry alongside the substitution and elimination fundamentals.

The carbonyl carbon (C=O) is electrophilic because oxygen's electronegativity pulls electron density away from carbon, leaving it partially positive and susceptible to nucleophilic attack. When a nucleophile attacks, the pi bond electrons move onto oxygen, generating a tetrahedral alkoxide intermediate — the single most common curved-arrow step in organic mechanisms. What happens next depends on the nucleophile and conditions: with water or alcohols under acid catalysis, this leads to hemiacetal and eventually acetal formation; with cyanide, it forms a cyanohydrin; with organometallic nucleophiles like Grignard reagents, it forms new carbon-carbon bonds en route to alcohols.

Acid catalysis accelerates carbonyl addition by protonating the carbonyl oxygen first, making the carbon even more electrophilic and allowing weaker nucleophiles to attack effectively — this is why acetal formation requires acid rather than proceeding readily under neutral conditions. Base catalysis works differently, typically generating a stronger, more reactive nucleophile (such as deprotonating an alcohol to an alkoxide) before it attacks the carbonyl.

This viewer also covers the SN1/SN2/E1/E2 substitution and elimination framework and electrophilic aromatic substitution, giving arrow-by-arrow animation for each — but its distinguishing strength is walking through carbonyl addition step by step: pi-bond attack, tetrahedral intermediate formation, and the acid- or base-catalyzed pathway that determines the final product. Click through each animated step to see exactly where electrons move and why the reaction proceeds the way it does — essential preparation for any exam that asks you to draw a full mechanism, not just predict a product.`,

  'periodic-table': `The periodic table is chemistry's single most information-dense reference tool, and knowing how to actually read element-specific data from it — not just recite trend directions — is what separates surface-level familiarity from exam-ready fluency for AP Chemistry, USNCO, and IChO.

Every element's position encodes real physical data: atomic mass (the weighted average of naturally occurring isotopes), electron configuration (which follows directly from an element's group and period position via the Aufbau principle), and a full set of measured properties including electronegativity, ionization energy, and atomic radius. Being able to look up any element and immediately see its full data profile — rather than deriving it from scratch each time — is essential for working through multi-step problems quickly under exam time pressure.

Color-coded overlays make trends visually obvious across the entire table simultaneously, rather than one group or period at a time. An electronegativity overlay immediately shows fluorine as the most electronegative element (3.98 on the Pauling scale) sitting in the top-right corner, while francium and cesium — the least electronegative — sit in the bottom-left, illustrating the diagonal trend that increases up and to the right. The same visual logic applies to ionization energy and atomic radius overlays, each revealing the underlying pattern of increasing effective nuclear charge across a period and increasing shielding down a group.

Electron configuration display for every element, including the notable exceptions like chromium ([Ar]3d⁵4s¹ instead of the "expected" [Ar]3d⁴4s²) and copper ([Ar]3d¹⁰4s¹), reinforces that half-filled and fully-filled d subshells carry extra stability — a detail frequently tested precisely because it breaks the naive pattern-matching approach.

This interactive periodic table lets you click any of all 118 elements to view its complete property profile, switch between color-coded trend overlays, and compare multiple elements side by side — a full element-by-element reference built for fast lookup during problem sets and exam review.`,

  hybridization: `Orbital hybridization explains why carbon, nitrogen, and other atoms form bonds at angles that pure atomic s and p orbitals could never produce on their own — a core AP Chemistry Unit 2 concept and prerequisite for understanding both VSEPR geometry and organic reactivity.

Hybridization mixes atomic orbitals on a single atom into new, equivalent hybrid orbitals suited to the bonding geometry actually observed. sp hybridization mixes one s and one p orbital into two sp orbitals arranged linearly (180°), seen in molecules like BeCl2 and any carbon with two pi bonds, such as the central carbon in CO2. sp² hybridization mixes one s and two p orbitals into three orbitals in a trigonal planar arrangement (120°), leaving one unhybridized p orbital available for pi bonding — exactly the geometry of every carbon in a C=C double bond or a benzene ring.

sp³ hybridization, the most common in organic chemistry, mixes one s and three p orbitals into four equivalent orbitals pointing toward the corners of a tetrahedron (109.5°), the geometry of methane and every sp³ carbon. Expanding beyond the octet, sp³d hybridization (trigonal bipyramidal, 90°/120°) and sp³d² hybridization (octahedral, 90°) describe central atoms like phosphorus in PCl5 and sulfur in SF6, which require d-orbital involvement to accommodate five or six bonding domains.

Lone pairs occupy hybrid orbitals just like bonding pairs but exert slightly greater repulsion, compressing observed bond angles below the idealized values — this is why water's H-O-H angle is 104.5° rather than the tetrahedral 109.5°, despite oxygen being sp³ hybridized with two lone pairs.

This hybridization explorer lets you select any hybridization state from sp through sp³d², see the corresponding 3D orbital mixing diagram and geometry, and view real example molecules for each — connecting the abstract orbital math directly to the molecular shapes you're asked to predict on exams.`,

  'projection-formula': `Two-dimensional representations of three-dimensional molecular structure — Fischer projections, Newman projections, sawhorse diagrams, and wedge-dash notation — are essential tools for communicating stereochemistry on paper, and fluently converting between them is heavily tested on both USNCO and IChO exams.

Fischer projections represent a molecule as a cross: horizontal lines project toward the viewer, vertical lines project away. This convention, developed originally for sugars, makes it fast to assign D/L configuration by checking whether the lowest carbon on the chain has the reference group on the right (D) or left (L) — distinct from, though often correlated with, the CIP R/S system. Rotating a Fischer projection by 180° in the plane of the page preserves its meaning, but rotating it 90° inverts the apparent configuration, a classic exam trap.

Newman projections view a molecule directly down a specific carbon-carbon bond, showing the front atom's substituents as lines from a center point and the back atom's substituents as lines from a surrounding circle. This projection is ideal for analyzing conformational analysis: eclipsed conformations (front and back substituents aligned) are higher energy due to torsional strain, while staggered conformations are lower energy, with the anti conformation (largest groups 180° apart) typically most stable of all, and gauche conformations (60° apart) intermediate.

Sawhorse diagrams show the same C-C bond from a angled perspective rather than end-on, making it easier to see the full 3D shape of both carbons simultaneously. Wedge-dash notation — solid wedges toward the viewer, dashed wedges away — is the standard for showing stereocenters in ordinary structural drawings, and correctly assigning R/S configuration from a wedge-dash structure using CIP priority rules is a fundamental stereochemistry skill.

This projection formula lab lets you draw a molecule once and instantly interconvert between all four representations, assign R/S configuration step by step, and practice D/L notation for carbohydrates — building fluency across every projection style you'll encounter on exams.`,

  electrochemistry: `Electrochemistry connects two of chemistry's biggest ideas — thermodynamics and redox reactions — into a single framework that predicts spontaneity, calculates cell voltage, and quantifies electrolysis. This complete electrochemistry lab walks through galvanic cells, electrolytic cells, and Faraday's law together, covering the full scope of AP Chemistry Unit 9 and IChO electrochemistry.

A galvanic (voltaic) cell harnesses a spontaneous redox reaction to generate electrical current: electrons flow from the anode (oxidation, negative terminal) through an external circuit to the cathode (reduction, positive terminal), with a salt bridge maintaining charge balance. Standard cell potential is calculated as E°cell = E°cathode - E°anode using tabulated standard reduction potentials, and a positive E°cell confirms the reaction is spontaneous as written.

Electrolytic cells run the opposite direction: an external power source forces a non-spontaneous reaction to proceed, and the electrode polarity conventions flip — the anode becomes positive and the cathode negative, the reverse of a galvanic cell. This sign-convention reversal is one of the most commonly missed points on exams, since students often assume anode = negative always holds.

Faraday's laws quantify exactly how much product forms during electrolysis: charge Q = It (current times time), moles of electrons = Q/F (where F = 96,485 C/mol), and mass deposited follows directly from the half-reaction stoichiometry. This is the calculation behind real industrial processes like the Hall-Héroult process for aluminum refining and electroplating.

Corrosion, particularly of iron, is itself a spontaneous electrochemical process — iron acts as the anode, oxygen and water act as the cathode reaction, and understanding this framework explains why sacrificial anodes (zinc coating on galvanized steel) protect iron from rusting.

This simulator lets you build both galvanic and electrolytic cells, calculate EMF from standard potentials, apply Faraday's law to electrolysis problems, and explore corrosion as a real-world application — the complete electrochemistry toolkit in one tool.`,

  electrochemical: `When AP Chemistry, USNCO, and IChO exams ask you to compare galvanic and electrolytic cells, the fastest path to the right answer is a clear side-by-side mental model — which is exactly what this comparison-focused electrochemical cell lab is built for, rather than walking through every electrochemistry topic in sequence.

The defining difference is spontaneity: a galvanic cell converts a spontaneous redox reaction (ΔG < 0, E°cell > 0) directly into electrical energy, while an electrolytic cell uses an external electrical energy source to force a non-spontaneous reaction (ΔG > 0, E°cell < 0) to occur. Every other difference between the two cell types follows from this one fact.

Electrode polarity is the single most commonly confused point: in a galvanic cell, the anode is negative and the cathode is positive, because electrons are being pushed out of the anode by the spontaneous reaction itself. In an electrolytic cell, the external power source forces electrons in the opposite direction, making the anode positive and the cathode negative. In both cell types, though, oxidation always occurs at the anode and reduction always occurs at the cathode — that identification never changes, only the sign.

The Nernst equation, E = E° - (RT/nF)ln Q, extends standard-condition calculations to real, non-standard concentrations, and applies identically to both cell types. As a galvanic cell discharges, Q increases and E decreases toward zero (equilibrium); running the same reaction electrolytically in reverse, sufficient applied voltage can force the reaction against its natural direction entirely.

This lab displays both cell types side by side with synchronized concentration sliders, letting you watch cell potential respond to the Nernst equation in real time while directly comparing the wiring, electrode signs, and spontaneity of each — purpose-built for the classic "compare and contrast galvanic and electrolytic cells" exam question.`,

  periodic: `Periodic trends explain why elements behave the way they do based purely on their position in the periodic table, and being able to predict — not just memorize — a trend's direction is one of the highest-leverage skills for AP Chemistry Unit 1 and 3, USNCO, and IChO.

Atomic radius decreases across a period (left to right) because each added proton increases effective nuclear charge on a roughly constant number of shielding inner-shell electrons, pulling the outer electrons in tighter. Atomic radius increases down a group because each successive element adds an entirely new principal energy level, and the increase in shell number outweighs the increase in nuclear charge.

First ionization energy — the energy required to remove the outermost electron from a gaseous atom — generally increases across a period for the same effective-nuclear-charge reason that shrinks radius, and decreases down a group as the outermost electron sits farther from the nucleus and is more shielded. Two systematic exceptions are frequently tested: ionization energy dips slightly from Group 2 to Group 13 (removing an electron from a filled s subshell to a half-empty p subshell is easier than the trend predicts) and from Group 15 to Group 16 (removing an electron from a half-filled p subshell, which has extra stability, to a paired p subshell is easier than expected).

Successive ionization energies within the same atom always increase, but jump dramatically once you cross from valence electrons into core electrons — the enormous jump between an element's nth and (n+1)th ionization energy directly reveals how many valence electrons it has, a classic identification technique.

Electronegativity and electron affinity trends largely parallel ionization energy, both increasing up and to the right toward fluorine, though electron affinity has more numerous and chemically-meaningful exceptions among individual elements.

This periodic properties simulator lets you plot any single trend as a continuous curve across a chosen period or down a chosen group, directly visualizing the increases, decreases, and exceptions that define periodic law — a focused complement to full element-by-element lookup tools.`,

  'organic-synthesis': `Multi-step organic synthesis is where individual named reactions stop being isolated facts to memorize and become tools you combine strategically to build a target molecule — the culminating skill tested in IChO organic problems and advanced Orgo coursework.

Working backward from the target molecule (retrosynthetic analysis) is usually more productive than working forward: identify the final bond or functional group that needs to be installed, ask what reagent could install it, and repeat until you reach available starting materials. The classic benzene-to-aniline route illustrates this clearly: aniline (an amine on a benzene ring) cannot be made by direct amination, so the actual route goes through nitration (installing -NO2 via electrophilic aromatic substitution with HNO3/H2SO4) followed by reduction (converting -NO2 to -NH2, typically with H2/Pd or Sn/HCl).

The benzene-to-phenol route via diazonium chemistry showcases a different strategy entirely: aniline is first converted to a diazonium salt (ArN2+) using NaNO2/HCl at low temperature, and this diazonium intermediate is a remarkably versatile synthetic handle — hydrolysis gives phenol, but the same intermediate can instead undergo azo coupling with another aromatic ring to build dyes, or a Sandmeyer reaction with CuCl/CuBr/CuCN to install halogens or nitriles that are otherwise difficult to introduce directly onto a benzene ring.

Grignard reagents (RMgX) are the workhorse for forming new carbon-carbon bonds: they attack the electrophilic carbon of an aldehyde or ketone, and after aqueous workup, produce secondary or tertiary alcohols. Aldol condensation is the other major carbon-carbon bond-forming strategy, where an enolate (formed by deprotonating alpha to a carbonyl) attacks a second carbonyl compound, ultimately eliminating water to form an alpha,beta-unsaturated carbonyl product.

This synthesis pathway tool breaks each multi-step route into individual steps with the specific reagents and conditions required, showing exactly how reagent and condition choice at each stage determines whether the target molecule is actually reached.`,

  'gas-laws': `The gas laws describe some of the most reliably predictable behavior in all of chemistry, which is exactly why they appear so often on AP Chemistry Unit 3, USNCO, and IChO exams — the ideal gas law and its historical special cases let you calculate any gas property from any other with high confidence.

The ideal gas law, PV = nRT, unifies pressure, volume, moles, and temperature into a single equation (R = 0.0821 L·atm/mol·K, or 8.314 J/mol·K in SI units). Historically, this was discovered piecewise: Boyle's law (P1V1 = P2V2, at constant n and T) established that pressure and volume are inversely proportional; Charles's law (V1/T1 = V2/T2, at constant n and P) established that volume and absolute temperature are directly proportional; and Gay-Lussac's law (P1/T1 = P2/T2, at constant n and V) established the same direct relationship between pressure and temperature. All three are special cases of the ideal gas law with one variable held fixed.

Real gases deviate from ideal behavior, especially at high pressure and low temperature, because the ideal gas law assumes gas particles have zero volume and experience no intermolecular attraction — both assumptions break down under those conditions. The van der Waals equation, (P + an²/V²)(V - nb) = nRT, corrects for this: the a term accounts for intermolecular attraction reducing the pressure gas particles actually exert on the container walls, and the b term accounts for the finite volume the gas particles themselves occupy, reducing the space available for particle motion.

Molar volume at STP (0°C, 1 atm, using the older definition, or the current IUPAC 0°C, 1 bar) is 22.4 L/mol for any ideal gas — a useful shortcut, but only valid exactly at STP; problems at non-standard conditions require the full PV = nRT calculation.

This gas laws simulator lets you manipulate pressure, volume, temperature, and moles interactively, compare Boyle's, Charles's, and combined gas law scenarios, and overlay van der Waals real-gas isotherms against ideal behavior — making the deviation between theory and reality directly visible.`,

  'colligative-properties': `Colligative properties depend only on the number of dissolved solute particles, not on what those particles chemically are — a distinction that makes this one of the more conceptually elegant topics in AP Chemistry Unit 3 and a reliable source of IChO calculation problems.

Boiling point elevation (ΔTb = iKbm) and freezing point depression (ΔTf = iKfm) both follow directly from the same underlying cause: dissolved solute particles disrupt the solvent's ability to form its ordered solid phase or escape into its gas phase, requiring a temperature shift to compensate. Kb and Kf are solvent-specific constants (for water, Kb = 0.512°C·kg/mol and Kf = 1.86°C·kg/mol), and m is molality — moles of solute per kilogram of solvent, deliberately chosen over molarity because molality doesn't change with temperature as the solution expands or contracts.

The van't Hoff factor i accounts for how many particles a formula unit actually produces in solution: a nonelectrolyte like glucose has i = 1, while an electrolyte like NaCl ideally has i = 2 (it fully dissociates into Na+ and Cl-) and CaCl2 ideally has i = 3. Real solutions show i values somewhat below these ideal integers due to ion pairing, especially at higher concentrations — a frequently tested subtlety.

Osmotic pressure (π = iMRT, using molarity M here rather than molality) describes the pressure needed to prevent osmosis — the net flow of solvent across a semipermeable membrane into the more concentrated solution. Because even dilute solutions produce measurable osmotic pressure, it's the most sensitive colligative property for determining molar mass of large molecules like proteins.

Vapor pressure lowering follows Raoult's law: the vapor pressure of a solution equals the mole fraction of solvent times the pure solvent's vapor pressure, explaining directly why boiling point rises (more energy needed to reach atmospheric pressure) and freezing point falls in tandem.

This calculator lets you adjust solute identity, molality, and van't Hoff factor to see all four colligative properties respond simultaneously — reinforcing that they are one phenomenon viewed four ways, not four separate topics to memorize.`,

  'phase-diagram': `A phase diagram compresses an enormous amount of information about a substance's behavior into a single pressure-temperature plot, and correctly reading one is a frequently tested AP Chemistry Unit 3 and IChO skill that goes well beyond memorizing "solid, liquid, gas."

Each region of a phase diagram represents the pressure-temperature conditions under which one phase is thermodynamically stable, and the lines separating regions represent conditions where two phases coexist in equilibrium — cross a line and the substance undergoes a phase transition. The triple point is the unique pressure-temperature combination where all three phases (solid, liquid, gas) coexist simultaneously; for water, this occurs at 0.01°C and 0.006 atm, a fixed reference point precise enough that it was historically used to define the Kelvin scale itself.

The critical point marks the end of the liquid-gas boundary line: above the critical temperature and pressure, the distinction between liquid and gas disappears entirely, and the substance becomes a supercritical fluid with properties of both. Beyond the critical point, no amount of additional pressure will condense the gas back into a distinct liquid phase.

Water's phase diagram contains a famous anomaly: the solid-liquid boundary line has a negative slope, meaning increasing pressure on ice at a fixed temperature near the triple point can melt it — a direct consequence of ice being less dense than liquid water. Nearly every other substance shows a positive slope here, because their solid phase is denser than their liquid phase, so increasing pressure favors the more compact solid.

Carbon dioxide's phase diagram explains a familiar phenomenon directly: at normal atmospheric pressure (1 atm), the CO2 triple point pressure (5.1 atm) is never reached, so solid CO2 (dry ice) sublimates straight to gas without ever passing through a liquid phase at ordinary pressure.

This phase diagram explorer lets you trace paths through pressure-temperature space for both water and CO2, directly identifying the triple point, critical point, and phase boundaries you'll be asked to read on exams.`,

  'unit-cell': `Crystal structure determines the density, hardness, and packing efficiency of metallic and ionic solids, and calculating these properties from a unit cell is a core AP Chemistry Unit 2 and IChO solid-state chemistry skill that rewards spatial reasoning over memorization.

A unit cell is the smallest repeating 3D block that, stacked in all directions, reproduces the entire crystal lattice. Simple cubic (SC) packing places atoms only at the eight corners of a cube, each shared among 8 adjacent cells, giving exactly 1 atom per unit cell and a packing efficiency of just 52% — the least efficient common packing arrangement, with a coordination number of only 6.

Body-centered cubic (BCC) adds one atom at the exact center of the cube in addition to the corner atoms, giving 2 atoms per unit cell (1 from corners + 1 full center atom), 68% packing efficiency, and coordination number 8. Face-centered cubic (FCC) instead places an atom at the center of each of the six faces (each shared between 2 cells) in addition to the corners, giving 4 atoms per unit cell, 74% packing efficiency — the maximum possible for spheres of equal size — and coordination number 12.

Density is calculated directly from unit cell geometry: ρ = (Z × M)/(NA × Vcell), where Z is atoms per unit cell, M is molar mass, NA is Avogadro's number, and Vcell is the unit cell volume calculated from the edge length, which itself relates to atomic radius differently for each packing type (a = 2r for SC, a = 4r/√3 for BCC, a = 2r√2 for FCC). Getting the correct radius-to-edge-length relationship for each structure is the step most often missed.

This simulator renders SC, BCC, and FCC unit cells in interactive 3D, calculates packing efficiency and coordination number automatically, and lets you compute crystal density from atomic radius and molar mass — connecting an abstract geometric model directly to measurable bulk properties.`,

  'mo-diagram': `Molecular orbital theory succeeds precisely where simple Lewis structures fail — most famously in explaining why O2 is paramagnetic despite textbook Lewis structures showing all electrons paired in a clean double bond. This makes MO theory a favorite AP Chemistry and IChO topic for testing genuine conceptual understanding over memorized rules.

When two atomic orbitals combine, they form two molecular orbitals: a lower-energy bonding orbital (constructive overlap, electron density concentrated between the nuclei) and a higher-energy antibonding orbital, marked with an asterisk (destructive overlap, a node between the nuclei). Sigma (σ) orbitals form from head-on overlap along the internuclear axis; pi (π) orbitals form from side-on overlap of parallel p orbitals, always occurring in pairs (πx and πy) at equal energy.

Bond order — a direct measure of bond strength and stability — is calculated as (bonding electrons - antibonding electrons)/2. For H2, both electrons occupy the bonding σ1s orbital, giving bond order 1 (a stable single bond); for He2, the bonding σ1s and antibonding σ1s* orbitals are both filled, giving bond order 0 — correctly predicting that He2 does not exist as a stable molecule, something Lewis theory has no mechanism to explain at all.

For period 2 diatomics, orbital energy ordering actually differs between the lighter elements (Li2 through N2) and the heavier ones (O2, F2, Ne2) due to s-p orbital mixing — a subtlety that changes which orbital fills first and is a common point of confusion. Filling the correct MO diagram for O2 reveals two unpaired electrons in the degenerate π2p* antibonding orbitals, correctly predicting paramagnetism (attraction to a magnetic field) that a simple Lewis structure entirely misses.

This MO diagram builder lets you fill molecular orbitals for any homonuclear diatomic from H2 through Ne2 (plus select heteronuclear examples), automatically calculates bond order, and flags paramagnetism from unpaired electrons — making visible exactly what Lewis structures cannot show.`,

  'lewis-structure': `Drawing a correct Lewis structure is the foundation every subsequent structural concept — VSEPR geometry, hybridization, molecular polarity — builds on, which is why getting formal charge and octet rules right by hand is emphasized so heavily in AP Chemistry Unit 2 and tested constantly on IChO.

Formal charge, calculated as (valence electrons) - (lone pair electrons) - ½(bonding electrons), identifies which of several possible Lewis structures for the same molecular formula is actually the best representation. The preferred structure minimizes formal charges overall and places any necessary negative formal charge on the more electronegative atom — this single rule resolves most ambiguous cases students encounter.

The octet rule (eight electrons around each atom, achieved through bonding and lone pairs) holds reliably for period 2 elements, but period 3 and beyond elements like phosphorus, sulfur, and chlorine can expand beyond the octet using available d orbitals, forming structures like PCl5 (10 electrons around P) or SF6 (12 electrons around S) that would be impossible to draw correctly under a strict octet assumption.

Resonance structures arise when a single Lewis structure cannot adequately represent a molecule's actual bonding — the true structure is a weighted average (resonance hybrid) of all valid contributing structures, not an equilibrium flipping between them. Ozone (O3) and the carbonate ion (CO3²⁻) are classic examples: experimentally, all bonds in these species are equal length, intermediate between single and double bond lengths, exactly as the resonance hybrid concept predicts.

Radical species, with an odd total electron count, cannot satisfy the octet rule on every atom no matter how electrons are arranged — one atom is left with an unpaired electron, and identifying which atom should bear that radical (typically the least electronegative, most stable position) requires the same formal-charge reasoning used elsewhere.

This Lewis structure builder gives real-time formal charge and octet-rule feedback as you place bonds and lone pairs, handles expanded octets and radicals correctly, and helps you find the lowest-formal-charge structure among multiple resonance contributors.`,

  'bond-polarity': `Bond polarity is the single most useful predictive tool in introductory chemistry — from it alone you can predict molecular polarity, intermolecular force type, boiling point trends, and solubility behavior, which is why AP Chemistry Unit 2 treats electronegativity difference as a starting point for so many other topics.

Electronegativity, on the Pauling scale, measures an atom's tendency to attract shared electrons in a covalent bond. The electronegativity difference (ΔEN) between two bonded atoms determines bond character along a continuum: ΔEN below about 0.4 is considered nonpolar covalent (electrons shared essentially equally, as in a C-H bond, ΔEN ≈ 0.4), ΔEN between 0.4 and 1.7 is polar covalent (electrons shared unequally, creating partial charges), and ΔEN above 1.7 is considered ionic (electron transfer rather than sharing, as in NaCl, ΔEN ≈ 2.1).

In a polar covalent bond, the more electronegative atom pulls electron density toward itself, acquiring a partial negative charge (δ-), while the less electronegative atom is left with a partial positive charge (δ+). The dipole arrow convention points from δ+ toward δ-, representing the direction of unequal electron sharing — and correctly drawing this arrow is a prerequisite for later predicting overall molecular polarity from bond geometry.

A critical distinction that trips up many students: bond polarity and molecular polarity are not the same thing. CO2 contains two highly polar C=O bonds, but the molecule itself is nonpolar overall because its linear geometry causes the two bond dipoles to point in exactly opposite directions and cancel. Predicting molecular polarity correctly requires combining bond polarity (from electronegativity) with molecular geometry (from VSEPR) — neither alone is sufficient.

This bond polarity visualizer lets you select any two elements, instantly calculates ΔEN and classifies the bond as nonpolar, polar, or ionic, and displays the dipole arrow with δ+/δ- labeling — building the electronegativity intuition that later molecular-polarity and intermolecular-force topics depend on.`,

  'imf-comparator': `Predicting which of two substances has the higher boiling point is a deceptively rich question that requires correctly identifying and ranking intermolecular forces — a core AP Chemistry Unit 3 skill, since stronger IMFs directly mean more energy (higher temperature) is required to separate molecules into the gas phase.

London dispersion forces exist between all molecules, arising from temporary, instantaneous dipoles created by random electron movement — and despite being the "weakest" force in a simplified ranking, dispersion forces actually dominate boiling point for large nonpolar molecules, since dispersion force strength increases with molecular size and surface area (more electrons, more polarizability). This is why nonpolar iodine (I2) is a solid at room temperature while nonpolar fluorine (F2) is a gas — same force type, vastly different magnitude due to size.

Dipole-dipole interactions occur between polar molecules, where the permanent partial positive end of one molecule aligns with the permanent partial negative end of another. These are generally stronger than dispersion forces between molecules of similar size, but the comparison inverts for very large nonpolar molecules versus small polar ones.

Hydrogen bonding is a particularly strong subset of dipole-dipole interaction, occurring specifically when hydrogen is bonded directly to nitrogen, oxygen, or fluorine — the three most electronegative, smallest elements capable of the tight, highly polarized N-H, O-H, or F-H bond that hydrogen bonding requires. This explains the classic exam comparison: HF (boiling point 19.5°C) boils higher than the larger, heavier HCl (boiling point -85°C) purely because HF can hydrogen bond and HCl cannot — a direct demonstration that IMF type can override molecular size.

Ethanol versus dimethyl ether is an equally revealing comparison: both share the identical molecular formula C2H6O, yet ethanol (boiling point 78°C, capable of hydrogen bonding through its O-H) boils dramatically higher than dimethyl ether (boiling point -24°C, no O-H bond, only dipole-dipole forces) — proof that molecular formula alone never determines boiling point; structure and IMF type do.

This comparator lets you select any two of 26 real molecules, identifies each substance's dominant IMF type, and predicts which has the higher boiling point with full reasoning — turning IMF ranking from a memorized rule into a checkable prediction.`,

  'beer-lambert': `The Beer-Lambert law is the quantitative foundation of nearly all spectrophotometric analysis, letting chemists determine an unknown concentration from nothing more than how much light a colored solution absorbs — a core analytical technique in AP Chemistry Unit 3 and IChO analytical chemistry.

The law states A = εbc, where A is absorbance (unitless), ε is the molar absorptivity or extinction coefficient (a constant specific to the substance and wavelength used, in L/mol·cm), b is the path length light travels through the solution (in cm, typically 1 cm for a standard cuvette), and c is molar concentration. Because absorbance is directly proportional to concentration, doubling concentration doubles absorbance — a linear relationship that makes calibration straightforward.

Absorbance and transmittance are related but different quantities: transmittance T is the fraction of light that passes through the sample unabsorbed, while A = -log(T), or equivalently T = 10^(-A). This logarithmic relationship means absorbance, not transmittance, is the quantity that scales linearly with concentration — which is why spectrophotometers report and chemists work with absorbance for quantitative analysis.

Building a calibration curve is the standard workflow: prepare several solutions of known concentration, measure each one's absorbance, and plot absorbance versus concentration — the result should be a straight line through (or near) the origin, with slope equal to εb. Once this line exists, measuring the absorbance of an unknown sample and reading its concentration off the calibration curve (or calculating it from the line's equation) gives a fast, accurate concentration determination without needing to know ε independently.

Path length matters directly and linearly: doubling the cuvette path length doubles absorbance at the same concentration, which is why standardized 1 cm cuvettes are used — comparing absorbance values measured at different path lengths without correcting for b produces meaningless results.

This lab lets you adjust concentration and watch the simulated cuvette visually darken as absorbance increases in real time, build a calibration curve from several data points, and solve for an unknown sample's concentration — the complete Beer-Lambert analytical workflow in one interactive tool.`,

  chromatography: `Paper chromatography separates a mixture into its individual components based on a simple physical principle — different substances travel at different rates through the same stationary phase — and calculating the resulting Rf value is a standard AP Chemistry Unit 3 analytical technique.

As solvent climbs a paper strip by capillary action, each dissolved substance in a spotted mixture is carried along at a rate determined by its relative affinity for the stationary phase (the paper itself, or more precisely the water trapped in its cellulose fibers) versus the mobile phase (the moving solvent). Less polar substances, which interact more weakly with the polar paper and more strongly with a less polar solvent, travel farther and faster; more polar substances cling more tightly to the paper and lag behind.

The retention factor, Rf = (distance traveled by the spot) / (distance traveled by the solvent front), is a normalized value between 0 and 1 that should, in principle, be reproducible for a given substance under fixed solvent and paper conditions — making Rf values useful for identifying unknown components by comparison to known standards run under the same conditions.

Chlorophyll extraction is a classic worked example: a leaf pigment extract separates into several visibly distinct bands with characteristically different Rf values — carotene (the least polar pigment, giving carrots their orange color) travels farthest and shows the highest Rf, followed by chlorophyll a, then chlorophyll b, with xanthophyll (the most polar, oxygen-containing pigment) traveling the shortest distance and showing the lowest Rf. This consistent ordering, driven entirely by relative polarity, is one of the most commonly performed real chromatography labs in introductory chemistry courses.

Black ink separation demonstrates the same principle on a mixture most people don't realize is a mixture at all — common black ink is actually a blend of several different dyes, each with distinct polarity, which paper chromatography visibly resolves into individual colored bands.

This chromatography simulator animates the separation in real time as solvent climbs the paper, calculates Rf values live for each component, and includes real pigment and ink datasets — turning a physical wet-lab technique into a repeatable, instant interactive demonstration.`,

  'reaction-classifier': `Correctly classifying a chemical reaction into one of five standard types is a foundational AP Chemistry Unit 4 skill that pays off throughout the course — knowing a reaction's type immediately tells you what kind of products to expect, before you've even balanced the equation.

Synthesis (combination) reactions combine two or more simpler substances into one more complex product: A + B → AB. Decomposition reactions run this in reverse, breaking one compound into two or more simpler products: AB → A + B, as seen when limestone (CaCO3) decomposes under heat into CaO and CO2.

Single replacement reactions occur when one element displaces another element from a compound: A + BC → AC + B, following activity series rules that predict whether the displacement actually occurs — zinc metal reacting with hydrochloric acid (Zn + 2HCl → ZnCl2 + H2) is a textbook single replacement, since zinc is more reactive than hydrogen and displaces it. Double replacement reactions swap the cations (or anions) between two ionic compounds: AB + CD → AD + CB, and typically proceed forward only when a precipitate, gas, or water forms — a solubility-rules judgment call.

Combustion reactions involve a fuel (usually a hydrocarbon) reacting with O2 to produce CO2 and H2O (for complete combustion) plus a large release of energy — recognizable by O2 always appearing as a reactant regardless of what specific fuel is burning. The industrial Haber process (N2 + 3H2 → 2NH3) is a synthesis reaction of major real-world significance, producing the ammonia that underlies most nitrogen fertilizer production worldwide.

Some reactions genuinely overlap categories or resist easy classification, and recognizing when a reaction is, for example, both a combustion and technically also fits no other category cleanly is itself part of building real classification fluency rather than pattern-matching on superficial equation shape.

This classifier presents 25 real balanced equations, asks you to identify the reaction type, and gives instant feedback with explanation for each — reinforcing the classification logic through repetition rather than memorized examples alone.`,

  'net-ionic-equation': `Writing a net ionic equation — stripping away everything that doesn't actually participate in a reaction — reveals the true chemistry happening in solution, and this skill is tested throughout AP Chemistry Unit 4 (reaction types) and Unit 8 (acid-base chemistry).

The process starts with a complete molecular equation, which is then rewritten as a complete ionic equation by dissociating every soluble strong electrolyte into its constituent ions — using solubility rules to correctly identify which compounds actually dissociate (soluble ionic compounds and strong acids/bases) versus which remain as intact formula units (insoluble precipitates, weak acids/bases, water, and molecular gases).

Spectator ions are ions that appear identically on both the reactant and product side of the complete ionic equation, meaning they don't actually undergo any chemical change — they're simply present in solution as bystanders. Canceling spectator ions from both sides leaves the net ionic equation: the species that actually react.

Precipitation reactions are the clearest illustration: mixing AgNO3 and NaCl solutions, the complete ionic equation shows Ag+, NO3-, Na+, and Cl- ions on the reactant side, but Na+ and NO3- remain unchanged as spectators — the net ionic equation is simply Ag+(aq) + Cl-(aq) → AgCl(s), correctly showing that silver and chloride ions are what actually combine to form the solid precipitate, regardless of which soluble silver and chloride salts were originally used.

Acid-base neutralization between any strong acid and strong base reduces to the same net ionic equation every time: H+(aq) + OH-(aq) → H2O(l) — a powerful generalization showing that the "identity" of the acid and base (HCl vs HNO3, NaOH vs KOH) is chemically irrelevant to the net reaction, since those counterions are always spectators in a strong acid-strong base reaction. Gas-forming reactions, like a carbonate reacting with acid to release CO2, follow the same spectator-ion-removal logic.

This builder shows the complete ionic equation and lets you click spectator ions to cancel them, revealing the net ionic equation step by step across precipitation, acid-base, and gas-forming reaction types.`,

  'limiting-reagent': `Limiting reagent problems are where stoichiometry stops being pure arithmetic and starts requiring genuine reasoning about which reactant actually constrains a reaction — one of the highest-value AP Chemistry Unit 4 skills, since almost every real synthesis and industrial process runs with reactants in non-stoichiometric ratios.

In any reaction with more than one reactant, the reactants are essentially never present in the exact mole ratio the balanced equation calls for. The limiting reagent is whichever reactant runs out first, and it alone determines the maximum amount of product that can form — once it's gone, the reaction stops, regardless of how much of the other reactant (the excess reagent) remains unreacted.

Identifying the limiting reagent requires converting both reactant quantities to moles, then dividing each by its stoichiometric coefficient in the balanced equation — whichever reactant gives the smaller resulting value is limiting. A common error is comparing raw mole amounts directly without accounting for the stoichiometric ratio; a reaction requiring 3 moles of H2 per mole of N2 (N2 + 3H2 → 2NH3) can be limited by N2 even if fewer total moles of N2 than H2 are present, because each mole of N2 demands three moles of H2 to fully react.

Once the limiting reagent is identified, theoretical yield of product is calculated using only the limiting reagent's initial amount and the balanced equation's mole ratio — the excess reagent's quantity is irrelevant to this calculation, only to how much of it is left over afterward.

Visualizing the reaction as molecules pairing up one-by-one according to the stoichiometric ratio — rather than as an abstract mole calculation — makes the concept concrete: watching N2 and H2 molecules pair up 1-to-3 until one species is exhausted shows directly, visually, which one ran out first and why.

This visualizer lets you adjust initial moles of each reactant for real reactions like N2 + H2 → NH3 and H2 + O2 → H2O, and watches molecules pair up by stoichiometric ratio in real time — making limiting reagent identification visually obvious rather than purely computational.`,

  'stoichiometry-mapper': `Stoichiometry is the calculation backbone of AP Chemistry Unit 4, and nearly every quantitative reaction problem — regardless of what's actually being asked — reduces to the same core sequence of conversions, commonly called the mole road map.

Starting from grams of a given substance, dividing by molar mass converts to moles — the universal "chemical currency" that lets different substances be compared on equal footing regardless of how much any one of them weighs. From moles of the given substance, multiplying by the mole ratio taken directly from the balanced equation's coefficients converts to moles of any other substance in the reaction — this single step is where the actual chemistry (which reaction, which coefficients) enters the calculation; every other step is pure unit conversion.

From moles of the target substance, multiplying by its molar mass converts back to grams, giving a mass-to-mass calculation overall. Alternatively, multiplying moles by Avogadro's number (6.022 × 10²³) converts to a count of individual particles — atoms, molecules, or formula units — useful when a problem asks "how many molecules" rather than "how many grams."

The power of the mole road map is that it handles any starting and ending unit combination using the exact same logical structure: grams-to-grams, grams-to-particles, particles-to-moles, or any other combination is just a different entry and exit point on the same map, never a fundamentally different calculation. Most stoichiometry errors come not from any individual conversion step being wrong, but from skipping the mole ratio step entirely and trying to convert directly between grams of two different substances — which is dimensionally meaningless without first passing through moles and the balanced equation's ratio.

This mapper displays every conversion factor explicitly and live as you work through a problem — molar mass, Avogadro's number, and the mole ratio from the balanced equation — turning the often-memorized "mole map" diagram into a tool that shows its work at every single step.`,

  'hess-law': `Hess's law states that the total enthalpy change of a reaction is independent of the pathway taken to get from reactants to products — a direct consequence of enthalpy being a state function, and the basis for calculating otherwise hard-to-measure ΔH values throughout AP Chemistry Unit 6.

Because ΔH is path-independent, any target reaction can be constructed by algebraically combining a series of other reactions with known ΔH values, as long as those reactions sum (after any needed manipulation) to exactly the target equation. Two manipulation rules govern how ΔH transforms alongside the equation: reversing a reaction flips the sign of its ΔH (since going backward releases what going forward absorbed, or vice versa), and multiplying a reaction by any factor scales its ΔH by that same factor.

Standard enthalpies of formation are the most common building blocks for Hess's law calculations, since ΔHf° values for a huge range of compounds are tabulated and can be combined to calculate ΔH for reactions that were never directly measured. Combustion enthalpies serve the same building-block role for organic compounds specifically, since combustion reactions are experimentally convenient to measure calorimetrically.

The formation of acetylene (C2H2) from its elements is a classic Hess's law puzzle precisely because it cannot be measured directly — carbon and hydrogen don't cleanly combine to form pure acetylene under laboratory conditions — but by combining the known combustion enthalpies of carbon, hydrogen, and acetylene itself (reversing the acetylene combustion equation, since we want acetylene as a product, not a reactant), the target formation enthalpy, ΔHf ≈ +226.7 kJ/mol, can be calculated exactly, revealing acetylene as an unusually high-energy, endothermic-to-form molecule.

This Hess's law builder presents a target equation and a set of given reaction steps, and lets you reverse or scale each step until they sum correctly to the target — with ΔH tracked automatically through every manipulation, reinforcing exactly how the sign and magnitude rules work rather than just stating them.`,

  calorimetry: `Calorimetry is the experimental technique for measuring heat flow directly, and the calculation behind it — conservation of energy applied to two substances reaching a shared equilibrium temperature — is one of the more intuitive quantitative topics in AP Chemistry Unit 6.

The core equation, q = mcΔT, relates heat transferred (q) to mass (m), specific heat capacity (c, the amount of energy needed to raise one gram of a substance by one degree Celsius), and temperature change (ΔT). When two substances at different starting temperatures are mixed and allowed to reach thermal equilibrium, conservation of energy requires that heat lost by the hotter substance exactly equals heat gained by the cooler one: m1c1ΔT1 = m2c2ΔT2 (with appropriate sign conventions, since one ΔT is negative).

Solving this relationship for the final equilibrium temperature gives Tf = (m1c1T1 + m2c2T2)/(m1c1 + m2c2) — a weighted average where each substance's contribution is weighted by its heat capacity (mass times specific heat), not just its mass alone. This is why mixing a small amount of very hot metal with a large amount of room-temperature water barely changes the water's temperature: water's specific heat (4.184 J/g°C) is dramatically higher than most metals (aluminum 0.897, iron 0.449, copper 0.385, gold 0.129 J/g°C), so water dominates the weighted average despite the metal starting much hotter.

Water's unusually high specific heat has real environmental and biological significance: large bodies of water moderate coastal climate by absorbing and releasing enormous amounts of heat with relatively small temperature swings, and the same property helps organisms maintain stable internal temperature.

Coffee-cup calorimetry (constant pressure, measuring ΔH directly) and bomb calorimetry (constant volume, sealed and pressurized, measuring ΔE) are the two standard experimental setups, differing in exactly what thermodynamic quantity they measure directly.

This calorimetry lab lets you mix two substances with adjustable mass, specific heat, and starting temperature, and calculates the equilibrium temperature live using real specific heat data for eight common materials.`,

  'bond-energy': `Estimating reaction enthalpy from bond energies offers a genuinely different calculation route than Hess's law or formation enthalpies — one grounded directly in the energy cost of breaking and forming individual chemical bonds — and is a standard AP Chemistry Unit 6 technique for reactions where tabulated ΔHf values aren't convenient.

The governing equation, ΔH = Σ(bonds broken) - Σ(bonds formed), reflects a simple physical truth: breaking any chemical bond always requires an energy input (endothermic), while forming any chemical bond always releases energy (exothermic). A reaction's overall enthalpy change is the net balance between the total energy spent breaking all reactant bonds and the total energy recovered forming all product bonds.

This framework lets you predict whether a reaction is exothermic or endothermic before doing any arithmetic at all, just by reasoning about relative bond strength: if the bonds being formed are collectively stronger than the bonds being broken, more energy is released than absorbed, and the reaction is exothermic — ΔH will come out negative once calculated. H2 + Cl2 → 2HCl is a clean illustration: breaking one H-H bond and one Cl-Cl bond costs energy, but forming two H-Cl bonds (each individually strong) releases more, giving a net exothermic result.

Average bond energies are tabulated values representing a typical bond strength across many different molecules containing that bond type — which is precisely why bond-energy calculations give only an estimate of ΔH, not an exact value the way Hess's law from measured formation enthalpies does. A specific C-H bond in methane doesn't have identically the same energy as a C-H bond in a more complex molecule, so bond-energy ΔH calculations carry inherent approximation that Hess's law calculations from directly measured data do not.

Methane combustion (CH4 + 2O2 → CO2 + 2H2O) and ammonia synthesis (N2 + 3H2 → 2NH3) are standard worked examples, each requiring careful bond-by-bond accounting of exactly which bonds break in the reactants and which form in the products.

This calculator walks through bond-by-bond energy accounting for real reactions, letting you predict exothermic or endothermic behavior before revealing the full calculation.`,

  'enthalpy-diagram': `A reaction coordinate (enthalpy) diagram visually unifies two topics that are often taught separately — kinetics (activation energy, reaction rate) and thermodynamics (ΔH, spontaneity) — making it a genuinely cross-cutting tool spanning AP Chemistry Units 5 and 6.

The diagram plots energy on the vertical axis against reaction progress on the horizontal axis, with three key points: the reactants' energy level, a peak representing the transition state (the highest-energy, least stable arrangement of atoms during the reaction), and the products' energy level. Activation energy for the forward reaction, Ea(forward), is the energy gap between reactants and the transition state peak; activation energy for the reverse reaction, Ea(reverse), is the gap between products and that same peak.

Overall reaction enthalpy, ΔH = E(products) - E(reactants), is read directly from the diagram's shape: if products sit lower than reactants, the reaction is exothermic (ΔH negative) and released net energy overall; if products sit higher, the reaction is endothermic (ΔH positive) and absorbed net energy. Critically, ΔH depends only on the reactant and product energy levels — the height and shape of the transition-state peak in between has zero effect on ΔH.

This last point is exactly why catalysts work the way they do, and it's the single most heavily tested fact from this topic: a catalyst provides an alternative reaction pathway with a lower-energy transition state, lowering both Ea(forward) and Ea(reverse) by the same amount — but it does not change the energy of either the reactants or the products, so ΔH remains completely unchanged. A catalyst speeds up how fast a reaction reaches equilibrium; it has no effect whatsoever on where that equilibrium ends up or how much energy the reaction releases overall.

This plotter lets you drag reactant, transition state, and product energy levels to build a custom reaction coordinate diagram, then add a catalyst and watch both activation energies drop while ΔH stays fixed — making the catalyst distinction visually unmistakable rather than just a memorized rule.`,

  'electrolytic-cell': `Electrolysis calculations are where electrochemistry becomes concrete, quantitative chemistry — given a current and a time, Faraday's law tells you exactly how many grams of a specific product will form at each electrode, a calculation type that appears throughout AP Chemistry Unit 9 and real industrial chemistry.

The calculation chain starts with charge: Q = It, where I is current in amperes and t is time in seconds, giving charge in coulombs. Dividing charge by Faraday's constant (F = 96,485 C per mole of electrons) converts coulombs directly to moles of electrons transferred — the bridge between an electrical measurement and a chemical quantity. From moles of electrons, the relevant half-reaction's stoichiometry (n, the number of electrons per formula unit deposited or produced) converts to moles of product, and multiplying by molar mass gives the final mass: m = (MIt)/(nF).

Electrode wiring conventions in an electrolytic cell are the reverse of a galvanic cell: because an external power source is forcing the reaction, the anode connects to the positive terminal and the cathode to the negative terminal — oxidation still occurs at the anode and reduction still occurs at the cathode, but which electrode is "positive" flips compared to a spontaneous galvanic cell.

Molten NaCl electrolysis (the Downs process) produces sodium metal at the cathode and chlorine gas at the anode — industrially essential since sodium cannot be isolated by any chemical reduction method, only electrolysis. Electrolysis of water splits H2O into H2 gas at the cathode and O2 gas at the anode in a 2:1 volume ratio, directly reflecting the reaction stoichiometry. CuSO4 electroplating deposits a controlled thickness of copper metal onto a cathode object, with thickness directly calculable from current and time via Faraday's law. The Hall-Héroult process uses the same underlying calculation to extract aluminum metal from molten alumina at industrial scale.

This simulator lets you set current and time for real electrolysis scenarios and calculates exactly how much product forms at each electrode using Faraday's law — connecting an abstract equation to real, checkable industrial-scale numbers.`,

  'photoelectric-effect': `The photoelectric effect provided the decisive experimental evidence that light behaves as discrete particles (photons) rather than a purely continuous wave — Einstein's explanation of it, not his relativity work, earned him the Nobel Prize, and it remains a cornerstone AP Chemistry Unit 1 topic precisely because it cannot be explained without quantum theory.

When light of sufficient frequency strikes a metal surface, electrons are ejected — but classical wave theory predicted this should depend on light intensity (brighter light, more energetic electrons), and experiments showed the opposite: ejected electron kinetic energy depends only on light frequency, not intensity at all. Einstein's equation, KE = hν - φ, resolves this: each photon carries energy hν (h = Planck's constant), and φ (the work function) is the minimum energy needed to free an electron from that specific metal's surface. Any photon energy beyond φ becomes the ejected electron's kinetic energy.

Below the threshold frequency ν0 = φ/h, no electrons are ejected regardless of how intense the light is — even an enormously bright beam of low-frequency light simply cannot eject a single electron, because no individual photon carries enough energy, and photons don't combine their energy together to eject one electron collectively. Above threshold frequency, increasing intensity increases the number of electrons ejected per second (more photons arriving means more individual ejection events) but does not increase each electron's kinetic energy — intensity and photon energy are independent variables.

Stopping voltage provides the standard experimental measurement: an opposing electric field is increased until it just stops the highest-energy ejected electrons from reaching a detector, and Vs = KE/e directly gives the maximum kinetic energy from an easily measured voltage.

Different metals have different work functions (sodium and potassium have low work functions, ejecting electrons even with visible light; platinum and gold require higher-energy UV light) — a direct, measurable consequence of how tightly each metal's electrons are held.

This simulator lets you adjust light frequency and intensity on real metals from sodium through platinum, directly visualizing threshold frequency, ejected electron kinetic energy, and stopping voltage as Einstein's equation predicts them.`,

  'h-emission-spectrum': `Clicking two energy levels and instantly seeing the resulting photon's exact wavelength and color turns the Rydberg formula from an equation to memorize into a relationship you can verify directly — core AP Chemistry Unit 1 content built entirely from the hydrogen atom's quantized energy levels.

Every electron transition in hydrogen, from any initial level ni down to any final level nf, releases a photon whose wavelength is given exactly by the Rydberg formula: 1/λ = R∞(1/nf² - 1/ni²), with R∞ = 1.097 × 10⁷ m⁻¹. Because hydrogen's energy levels follow En = -13.6 eV/n², larger transitions (bigger gap between ni and nf) release higher-energy, shorter-wavelength photons, while transitions between adjacent, high-n levels release lower-energy, longer-wavelength photons.

The four series are distinguished entirely by their final level: the Lyman series (nf = 1) has the largest possible energy gaps and falls entirely in the ultraviolet, invisible to the human eye. The Balmer series (nf = 2) is uniquely important because it's the only series with lines in the visible spectrum — these are the classic red, cyan, blue, and violet hydrogen emission lines visible directly in a spectroscope, historically the first spectral lines ever measured with precision. The Paschen series (nf = 3) and Brackett series (nf = 4) both fall in the infrared, invisible but detectable with appropriate instruments.

Because every transition within a series shares the same final level, series members converge as ni increases — the energy gap between consecutive transitions shrinks, and the series approaches (but never quite reaches) a series limit corresponding to complete ionization from that final level.

Photon energy, frequency, and wavelength are three ways of describing the same quantity: E = hν = hc/λ, so any transition's photon can be characterized in whichever unit a specific problem asks for, all derived from the same underlying energy-level difference.

This tool lets you click any initial and final energy level from n=1 through n=6, instantly calculates the resulting photon's wavelength, frequency, and energy, and identifies which series and spectral region it belongs to.`,

  'electron-config': `Building electron configurations correctly, with the three governing rules enforced simultaneously, is a foundational AP Chemistry Unit 1 skill — and the handful of elements that violate the naive pattern are exactly where exams concentrate their hardest questions.

The Aufbau principle states that electrons fill available orbitals starting from the lowest energy level upward, following the (n+l) ordering that explains why 4s fills before 3d despite 3 being a smaller principal quantum number — a frequent point of confusion since it seems to violate simple shell-by-shell filling. The Pauli exclusion principle limits any single orbital to a maximum of two electrons, and only if they have opposite spin — no two electrons in the same atom can share an identical set of all four quantum numbers.

Hund's rule governs how electrons fill a set of degenerate (equal-energy) orbitals, such as the three p orbitals or five d orbitals within the same subshell: electrons occupy separate orbitals singly, with parallel spin, before any pairing occurs. This is why nitrogen's three 2p electrons occupy px, py, and pz individually rather than doubling up in just two of the three — minimizing electron-electron repulsion and maximizing total spin, which is genuinely lower in energy.

Chromium and copper are the two most commonly tested Aufbau exceptions in period 4: chromium's actual ground-state configuration is [Ar]3d⁵4s¹ rather than the "expected" [Ar]3d⁴4s², and copper's is [Ar]3d¹⁰4s¹ rather than [Ar]3d⁹4s² — both violations exist because a half-filled (d⁵) or completely filled (d¹⁰) d subshell carries extra stability from favorable exchange energy, enough to make promoting one 4s electron into the d subshell energetically worthwhile.

Whether an atom or ion is diamagnetic (all electrons paired, weakly repelled by a magnetic field) or paramagnetic (one or more unpaired electrons, attracted to a magnetic field) follows directly and unambiguously from its completed electron configuration.

This builder lets you fill electrons into subshells with Aufbau, Pauli, and Hund's rule enforced live for any element, correctly handles the Cr/Cu exceptions, and displays magnetism directly from the resulting configuration.`,

  'pes-spectrum': `Photoelectron spectroscopy (PES) gives chemists a direct experimental window into electron configuration — rather than inferring configuration purely from periodic table position, PES measures it, and correctly reading a PES spectrum is an AP Chemistry Unit 1 skill that tests real data interpretation rather than memorized rules.

In PES, high-energy photons eject electrons from an atom, and the kinetic energy of each ejected electron is measured; subtracting from the known photon energy gives the binding energy of the subshell that electron came from. Because different subshells hold their electrons with characteristically different binding energies, a PES spectrum — plotted as peak position (binding energy) versus peak height (relative electron count) — is essentially a fingerprint of an atom's full electron configuration.

Peak position tells you which subshell a given peak corresponds to: core electrons, held very tightly by the nucleus with little shielding, produce peaks at very high binding energy, while valence electrons, more shielded and farther from the nucleus, produce peaks at much lower binding energy. Peak height directly reflects how many electrons occupy that subshell — a 2s peak is always shorter than a 2p peak's neighboring peaks in an element with a full 2p⁶ subshell, since 2s holds only 2 electrons versus 2p's 6.

Reading a complete electron configuration from a PES spectrum works in reverse from the usual Aufbau-based approach: rather than filling orbitals theoretically, you identify each peak's binding energy, assign it to the correct subshell based on that binding energy scale, and read off the relative electron count from peak height directly — reconstructing the actual measured configuration rather than a predicted one.

Mystery element identification is the natural culminating exercise: given only a PES spectrum with no other information, correctly counting subshells and electrons from peak position and height identifies the unknown element unambiguously, testing whether the underlying logic is genuinely understood rather than pattern-matched from familiar elements.

This reader lets you explore real PES spectra for known elements or attempt mystery-element identification, distinguishing core from valence electrons purely from spectral data.`,

  'isotope-mass-spec': `Atomic mass values on the periodic table are never whole numbers, and understanding exactly why requires connecting isotope abundance data to a weighted average calculation — a core AP Chemistry Unit 1 skill demonstrated directly through real mass spectrometry data.

A mass spectrometer separates isotopes of an element by mass-to-charge ratio (m/z), producing a spectrum with a distinct peak for each naturally occurring isotope, where peak height represents that isotope's relative abundance in a natural sample. Because different isotopes of the same element have different numbers of neutrons (and therefore different mass) but occur in fixed, characteristic natural proportions, each element's mass spectrum has a signature pattern of peaks.

The atomic mass reported on the periodic table is a weighted average: atomic mass = Σ(isotope mass × fractional abundance), summed across every naturally occurring isotope. Chlorine is the textbook example: Cl-35 (mass ≈ 34.97, abundance ≈ 75.8%) and Cl-37 (mass ≈ 36.97, abundance ≈ 24.2%) combine to a weighted average of approximately 35.45 — matching the periodic table value exactly, and explaining directly why chlorine's atomic mass isn't close to a whole number despite each individual isotope having a mass very near a whole number.

Copper shows the same principle with Cu-63 (abundance ≈ 69.2%) and Cu-65 (abundance ≈ 30.8%), weighting to approximately 63.55 — and because Cu-63 is more abundant, the weighted average sits closer to 63 than to 65, illustrating that the weighted average is always pulled toward whichever isotope is more common, not simply the midpoint between isotope masses.

Verifying a calculated weighted average against the accepted IUPAC atomic weight is a useful self-check built directly into working through these problems, confirming the calculation was set up correctly rather than just producing a plausible-looking number.

This tool displays real isotope mass and abundance data as mass spectra for 30 elements, lets you read m/z peaks directly, and calculates the weighted average atomic mass for comparison against the periodic table value.`,

  'nmr-predictor': `Proton NMR spectroscopy lets chemists determine an organic molecule's structure by reading how hydrogen atoms in different chemical environments absorb radio-frequency energy differently — a technique covered in both AP Chemistry and IChO organic chemistry, and one of the most information-rich structure-determination tools available.

Chemical shift (δ, measured in parts per million) indicates a hydrogen atom's electronic environment: hydrogens near electronegative atoms or functional groups are deshielded (their electron density is pulled away) and appear farther downfield (higher δ), while hydrogens in electron-rich environments are shielded and appear upfield (lower δ). Tetramethylsilane (TMS) is universally used as the zero-point reference, since its twelve equivalent hydrogens are unusually shielded and appear far upfield of nearly everything else measured.

Characteristic shift ranges let you assign structural fragments directly from a spectrum: alkyl CH3 hydrogens typically appear around 0.9-1.5 ppm, CH2 hydrogens adjacent to a carbonyl or similar group shift further downfield to roughly 2-2.5 ppm, hydroxyl (O-H) protons appear in a broad, variable range around 3-5 ppm (their exact position shifts with concentration and hydrogen bonding), and aromatic ring hydrogens appear characteristically far downfield, around 7-8 ppm, due to the ring current effect unique to aromatic systems.

The n+1 splitting rule governs peak multiplicity: a hydrogen (or equivalent set of hydrogens) with n neighboring, chemically non-equivalent hydrogens on adjacent carbons splits into n+1 peaks — a hydrogen next to a CH3 group (3 neighbors) splits into a quartet, while a hydrogen next to a CH2 group (2 neighbors) splits into a triplet, giving direct structural information about what's connected to what.

Integration — the relative area under each peak — is directly proportional to the number of equivalent hydrogens producing that peak, letting you determine the ratio of different hydrogen environments even without knowing the molecule's total hydrogen count in advance.

This predictor generates realistic ¹H NMR spectra for classic teaching molecules like ethanol, acetone, diethyl ether, and acetic acid, showing chemical shift, splitting, and integration together as an integrated structure-determination exercise.`,

  'mass-spec': `Electron-ionization mass spectrometry fragments organic molecules in predictable, chemically meaningful ways, and reading the resulting fragmentation pattern to identify a molecule's structure is a genuinely advanced organic chemistry skill covered in IChO and upper-level coursework.

Bombarding a molecule with high-energy electrons knocks out one electron, forming a radical cation called the molecular ion (M+•), whose mass-to-charge ratio directly gives the molecule's molar mass — the single most immediately useful piece of information a mass spectrum provides, assuming the molecular ion peak survives to be detected at all.

The molecular ion is often unstable and fragments further along predictable pathways. Alpha-cleavage — breaking a C-C bond immediately adjacent to a heteroatom (like the oxygen in a ketone or alcohol) — is favored because the resulting fragment can be stabilized by resonance donation from that heteroatom's lone pair, making this one of the most commonly observed fragmentation patterns in oxygen-containing organic molecules.

The tropylium cation, appearing characteristically at m/z = 91, arises when a benzylic C-C bond cleaves and the resulting cation rearranges into the remarkably stable, fully aromatic seven-membered tropylium ring — its distinctive stability means this peak, when present, is often unusually intense and immediately suggests a benzyl-containing structure in the original molecule.

McLafferty rearrangement is a more complex fragmentation specific to carbonyl compounds with a gamma hydrogen: the molecule undergoes an internal hydrogen transfer through a six-membered transition state, cleaving a C-C bond and producing a distinct fragment mass shift that's diagnostic once recognized.

Isotope patterns provide additional structural clues independent of fragmentation: chlorine and bromine each produce a characteristic M+2 peak (from the ³⁷Cl or ⁸¹Br isotope) at roughly the intensity ratio expected from natural isotope abundance, immediately signaling the presence of that halogen even before any other structural analysis.

This simulator shows the molecular ion, common fragmentation pathways, and base peak identification for classic organic molecules, building the pattern-recognition skill mass spectrum interpretation actually requires.`,

  'sn1-sn2-e1-e2': `Predicting which mechanism — SN1, SN2, E1, or E2 — actually dominates for a given set of reaction conditions is one of organic chemistry's genuinely decision-tree-shaped skills, and this predictor is built specifically around that decision framework rather than mechanism animation itself.

Substrate class is the first and often most decisive factor: primary substrates strongly favor SN2 (the backside nucleophilic attack has no steric hindrance) and essentially never proceed through SN1 or E1 (a primary carbocation is far too unstable to form). Tertiary substrates favor the opposite: SN2 is sterically blocked entirely by three bulky substituents crowding the backside approach, so tertiary substrates react exclusively through SN1/E1 pathways via a relatively stable tertiary carbocation intermediate. Secondary substrates are genuinely ambiguous and can go either way depending on the other three factors.

Nucleophile/base strength is the second major factor: strong nucleophiles favor the bimolecular SN2 and E2 pathways (which require the nucleophile or base to directly attack in the rate-determining step), while weak nucleophiles favor the unimolecular SN1 and E1 pathways (where the rate-determining step is simply the substrate ionizing on its own, independent of nucleophile strength). Whether the reagent acts primarily as a nucleophile (attacking carbon) or a base (removing a proton) further determines substitution versus elimination.

Solvent polarity governs the third factor: polar aprotic solvents (like DMSO or acetone, which cannot hydrogen bond to the nucleophile) leave nucleophiles "naked" and highly reactive, favoring SN2; polar protic solvents (like water or alcohols, which hydrogen bond to and stabilize both the nucleophile and any carbocation intermediate) favor SN1/E1 by stabilizing the ionization step.

Temperature is the final tiebreaker between substitution and elimination pathways specifically: higher temperature favors elimination (entropically favored, producing more product particles) over substitution when both are mechanistically plausible for a given substrate.

This predictor lets you select substrate class, nucleophile/base strength, solvent polarity, and temperature, then predicts the dominant mechanism with full step-by-step reasoning — turning a four-variable decision into a checkable, explainable prediction rather than memorized case-by-case rules.`,
}

// Fallback for labs without a custom seoBody
export function getLabBody(slug: string, meta: { h1: string; description: string; topics: string[]; apUnits: string[] }): string {
  if (LAB_BODY[slug]) return LAB_BODY[slug]
  return `${meta.h1} is a free interactive chemistry simulation tool for high school and university students, covering topics aligned with the AP Chemistry curriculum, USNCO competition syllabus, and IChO preparatory problem sets. ${meta.description}

This tool covers: ${meta.topics.join(', ')}. ${meta.apUnits.length > 0 ? `It maps to ${meta.apUnits.join(' and ')} in the College Board AP Chemistry framework.` : ''} Use it alongside your textbook to build hands-on intuition that goes beyond worked examples — seeing a simulation respond to your inputs reinforces conceptual understanding far more effectively than passive reading.

Every interactive lab starts with a 15-day free trial so you can explore fully before deciding. After the trial, full student access is $15/year. Public study guides and hub pages stay free to browse. Whether you are preparing for the AP Chemistry exam in May, working through USNCO practice problems, or studying IChO preparatory materials, these simulators are designed to complement — not replace — rigorous study with textbooks and past exam papers.

The interactive format is particularly valuable for topics that are hard to visualize from static diagrams alone. Experiment freely: change parameters, observe the system's response, and build the kind of physical intuition that separates top scorers from average performers on high-stakes chemistry exams.`
}
