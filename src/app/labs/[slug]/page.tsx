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

function AdSlot({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center bg-white/[0.02] border border-white/5 rounded-xl text-gray-700 text-xs ${className}`}>
      {/* <ins className="adsbygoogle" data-ad-client="ca-pub-XXXXXXXX" data-ad-slot="XXXXXXXX" data-ad-format="auto" data-full-width-responsive="true" /> */}
      Advertisement
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

      {/* AdSense — horizontal leaderboard above tool */}
      <div className="px-5 py-3 max-w-6xl mx-auto">
        <AdSlot className="h-16" />
      </div>

      {/* The actual interactive tool */}
      <LabWrapper slug={params.slug} />

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

        {/* AdSense — rectangle below content */}
        <div className="max-w-4xl mx-auto mt-8">
          <AdSlot className="h-24" />
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
