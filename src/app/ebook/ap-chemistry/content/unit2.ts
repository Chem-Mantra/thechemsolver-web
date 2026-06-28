import type { EbookUnit } from '../types'

export const UNIT2: EbookUnit = {
  id: 'unit-2',
  number: 2,
  title: 'Compound Structure & Properties',
  examWeight: '7–9%',
  accentHex: '#34d399',
  concepts: [

    // ── Concept 1: Types of Chemical Bonds ───────────────────────────────────
    {
      id: 'u2-c1-bond-types',
      title: 'Types of Chemical Bonds',
      subtitle: 'Ionic, covalent, and metallic bonding',
      estimatedMinutes: 10,
      accentHex: '#34d399',
      blocks: [
        {
          type: 'text',
          body: 'Chemical bonds form because the bonded state is lower in energy than the separated atoms. Three fundamental bond types emerge from how electrons are shared or transferred between atoms: ionic bonds (electron transfer, metal to nonmetal), covalent bonds (electron sharing, nonmetal to nonmetal), and metallic bonds (delocalized electrons in a lattice of metal cations).',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Electronegativity Difference Predicts Bond Type',
          body: 'ΔEN < 0.5 → nonpolar covalent\n0.5 ≤ ΔEN < 1.7 → polar covalent\nΔEN ≥ 1.7 → ionic\nThese are approximate cutoffs — AP Chemistry treats bond type as a continuum, not a strict boundary.',
        },
        {
          type: 'table',
          headers: ['Bond Type', 'Electron behaviour', 'Typical partners', 'Examples'],
          rows: [
            ['Ionic', 'Complete transfer: cation + anion form', 'Metal + nonmetal', 'NaCl, MgO, CaCl₂'],
            ['Polar covalent', 'Unequal sharing, partial charges (δ+/δ−)', 'Two nonmetals (different EN)', 'HCl, H₂O, NH₃'],
            ['Nonpolar covalent', 'Equal sharing, no partial charges', 'Same element or similar EN', 'H₂, Cl₂, CH₄'],
            ['Metallic', 'Delocalized "sea of electrons"', 'Metal + metal (or pure metal)', 'Fe, Cu, steel'],
          ],
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'Bond Polarity as a Tug of War',
          body: 'Electronegativity is each atom\'s "grip strength" in the tug of war for shared electrons. When grip strengths are equal (same element), the rope sits perfectly centred — nonpolar. When one side is stronger (different EN), the rope shifts toward that atom — polar covalent. If one side is vastly stronger, it wins the electron outright — ionic.',
        },
        {
          type: 'text',
          body: 'Lattice energy is the energy released when gaseous ions combine to form one mole of an ionic solid. It is always negative (exothermic) and increases in magnitude with higher ion charges and smaller ionic radii. MgO (charge 2+/2−) has a much larger lattice energy than NaCl (charge 1+/1−), which is why MgO has a far higher melting point.',
        },
        {
          type: 'formula',
          latex: 'E_{\\text{lattice}} \\propto \\frac{|q_+||q_-|}{r_+ + r_-}',
          display: true,
          caption: 'Coulomb\'s law analogy: lattice energy scales with charge product and inversely with interionic distance',
        },
      ],
      mcqs: [
        {
          question: 'The electronegativity difference between Na (0.93) and Cl (3.16) is 2.23. What type of bond forms?',
          options: ['Nonpolar covalent', 'Polar covalent', 'Ionic', 'Metallic'],
          correct: 2,
          explanation: 'ΔEN = 2.23 ≥ 1.7 → ionic bond. Sodium transfers its valence electron to chlorine, forming Na⁺ and Cl⁻ ions held together by electrostatic attraction.',
        },
        {
          question: 'Which compound would have the largest lattice energy?',
          options: ['LiF', 'NaCl', 'MgO', 'KBr'],
          correct: 2,
          explanation: 'Lattice energy ∝ (q₊)(q₋) / r. MgO has 2+ and 2− charges (product = 4) vs. 1×1 = 1 for LiF, NaCl, KBr. Even accounting for slightly larger Mg²⁺/O²⁻ radii vs Li⁺/F⁻, the charge factor dominates — MgO has by far the largest lattice energy (~3795 kJ/mol vs ~1037 kJ/mol for NaCl).',
        },
        {
          question: 'A compound of element X (EN = 2.1) and element Y (EN = 3.5) is best described as having what type of bond?',
          options: ['Nonpolar covalent', 'Polar covalent', 'Ionic', 'Metallic'],
          correct: 1,
          explanation: 'ΔEN = 3.5 − 2.1 = 1.4. This falls in the 0.5–1.7 range → polar covalent bond. Electrons are unequally shared, creating partial charges δ+ on X and δ− on Y.',
        },
      ],
      flashcards: [
        { front: 'What ΔEN range indicates an ionic bond?', back: 'ΔEN ≥ 1.7 (approximately). Complete electron transfer from metal to nonmetal.' },
        { front: 'What is lattice energy?', back: 'Energy released when gaseous ions form 1 mol of ionic solid. Always exothermic. Increases with higher charge and smaller ionic radii.' },
        { front: 'How does metallic bonding work?', back: 'Metal cations sit in a "sea" of delocalized valence electrons that are free to move throughout the lattice, explaining electrical conductivity and malleability.' },
        { front: 'What causes bond polarity?', back: 'A difference in electronegativity between bonded atoms. The more electronegative atom carries a partial negative charge (δ−).' },
      ],
    },

    // ── Concept 2: Intramolecular Force & Potential Energy ───────────────────
    {
      id: 'u2-c2-potential-energy',
      title: 'Intramolecular Force & Potential Energy',
      subtitle: 'Bond formation, energy, and length',
      estimatedMinutes: 8,
      accentHex: '#6ee7b7',
      blocks: [
        {
          type: 'text',
          body: 'As two atoms approach each other from a large distance, two opposing forces operate: nuclear-electron attraction (draws them together, lowers energy) and nuclear-nuclear / electron-electron repulsion (pushes them apart, raises energy). The bond length is the internuclear distance at the potential energy minimum — where the net force is zero.',
        },
        {
          type: 'simulation',
          title: 'Potential Energy Curve Explorer',
          description: 'Drag two atoms toward each other and watch the potential energy curve in real time. Observe the minimum (bond length), the dissociation energy, and the repulsion wall.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Reading a PE Curve',
          body: 'The depth of the energy well below zero = bond dissociation energy (BDE). The x-value at the minimum = equilibrium bond length. The curve rises steeply at short distances (repulsion dominates) and asymptotically approaches zero at large distances (atoms separated).',
        },
        {
          type: 'text',
          body: 'Bond order is the number of electron pairs shared between two atoms. Higher bond order correlates with shorter bond length and greater bond dissociation energy. For carbon-carbon bonds: C–C (single, 154 pm, ~347 kJ/mol) → C=C (double, 134 pm, ~614 kJ/mol) → C≡C (triple, 120 pm, ~839 kJ/mol).',
        },
        {
          type: 'table',
          headers: ['Bond', 'Bond order', 'Length (pm)', 'BDE (kJ/mol)'],
          rows: [
            ['C–C', '1', '154', '~347'],
            ['C=C', '2', '134', '~614'],
            ['C≡C', '3', '120', '~839'],
            ['N–N', '1', '145', '~163'],
            ['N=N', '2', '124', '~418'],
            ['N≡N', '3', '110', '~945'],
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Bond Energy Estimation (Hess\'s Law for Bonds)',
          body: 'ΔH_rxn ≈ Σ(bonds broken, reactants) − Σ(bonds formed, products). Bond breaking is endothermic (+); bond forming is exothermic (−). This method gives approximate values because tabulated BDEs are averages.',
        },
        {
          type: 'formula',
          latex: '\\Delta H_{\\text{rxn}} \\approx \\sum D_{\\text{broken}} - \\sum D_{\\text{formed}}',
          display: true,
          caption: 'D = bond dissociation energy (all values positive); sign convention makes the formula correct',
        },
      ],
      mcqs: [
        {
          question: 'Which bond has the shortest length and highest bond energy?',
          options: ['N–N', 'N=N', 'N≡N', 'All have equal length'],
          correct: 2,
          explanation: 'Bond order 3 (triple bond) gives the shortest length (110 pm) and highest BDE (~945 kJ/mol). Greater bond order → shorter and stronger.',
        },
        {
          question: 'Using bond energies, estimate ΔH for H₂ + Cl₂ → 2 HCl. [BDE: H–H = 436, Cl–Cl = 242, H–Cl = 431 kJ/mol]',
          options: ['+247 kJ', '−184 kJ', '+184 kJ', '−247 kJ'],
          correct: 1,
          explanation: 'Bonds broken: H–H (436) + Cl–Cl (242) = 678 kJ. Bonds formed: 2 × H–Cl (2 × 431) = 862 kJ. ΔH ≈ 678 − 862 = −184 kJ. The reaction is exothermic.',
        },
        {
          question: 'On a potential energy curve for a diatomic molecule, the equilibrium bond length corresponds to which feature?',
          options: [
            'Where the curve crosses zero PE',
            'The minimum (most negative) point on the curve',
            'The maximum (most positive) point on the curve',
            'Where the curve asymptotically flattens at large distance',
          ],
          correct: 1,
          explanation: 'The equilibrium bond length is the internuclear separation at the PE minimum. At this point, attractive and repulsive forces exactly balance, resulting in the lowest-energy (most stable) configuration.',
        },
      ],
      flashcards: [
        { front: 'What is bond dissociation energy (BDE)?', back: 'The energy required to break one mole of a specific bond in the gas phase (endothermic, always positive). Equal to the depth of the PE well.' },
        { front: 'How does bond order affect bond length?', back: 'Higher bond order → shorter bond length and higher BDE. Triple bonds are shortest and strongest; single bonds are longest and weakest.' },
        { front: 'Formula for ΔH using bond energies', back: 'ΔH ≈ Σ(BDE broken) − Σ(BDE formed). Bonds broken are (+), bonds formed are (−).' },
        { front: 'What does the steep left wall on a PE curve represent?', back: 'Nuclear-nuclear and electron-electron repulsion at short internuclear distances, which rapidly increases energy.' },
      ],
    },

    // ── Concept 3: Structure of Ionic Solids ─────────────────────────────────
    {
      id: 'u2-c3-ionic-solids',
      title: 'Structure of Ionic Solids',
      subtitle: 'Lattices, unit cells, and properties',
      estimatedMinutes: 9,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'An ionic solid is a 3D array of cations and anions arranged to maximize attractive forces and minimize repulsive forces. The repeating unit is the unit cell. Ions of opposite charge pack as closely as possible while keeping like-charge ions separated. The result is a crystal lattice with a characteristic geometry.',
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'The NaCl (Rock Salt) Structure — The Most-Tested',
          body: 'NaCl has a face-centred cubic (FCC) lattice of Cl⁻ ions with Na⁺ ions filling the octahedral holes. Each Na⁺ is surrounded by 6 Cl⁻ neighbours, and each Cl⁻ is surrounded by 6 Na⁺ neighbours. Coordination number = 6 for both ions. The unit cell contains 4 formula units of NaCl.',
        },
        {
          type: 'simulation',
          title: '3D Ionic Crystal Lattice Viewer',
          description: 'Rotate and zoom into NaCl, CsCl, and ZnS crystal structures. Toggle between ball-and-stick and space-fill views. Count coordination numbers and identify unit cells.',
        },
        {
          type: 'text',
          body: 'The properties of ionic solids flow directly from their structure. High melting and boiling points result from strong electrostatic lattice forces (proportional to charge and inversely to distance). Ionic solids are brittle: displacing a layer causes like-charge ions to align, creating strong repulsion that shatters the crystal. They conduct electricity when molten or dissolved (ions free to move) but not when solid (ions locked in place).',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Predict Relative Melting Points',
          body: 'Higher ionic charges → stronger lattice → higher MP. Smaller ions → shorter bond distance → stronger lattice → higher MP.\nRanking: MgO (2+/2−) > NaF (1+/1−) ≈ NaCl (1+/1−, larger ions) > KCl (larger ions still).\nCompare: MgO MP = 2852°C vs NaCl MP = 801°C.',
        },
        {
          type: 'list',
          variant: 'bullet',
          items: [
            'High melting/boiling point — strong electrostatic lattice energy',
            'Hard but brittle — layers crack when offset (like-charge alignment)',
            'Non-conductor when solid — ions fixed in lattice positions',
            'Conductor when molten or dissolved — ions become mobile charge carriers',
            'Soluble in polar solvents (water) when ion-dipole forces exceed lattice energy',
          ],
        },
      ],
      mcqs: [
        {
          question: 'In the NaCl crystal structure, each Na⁺ ion is surrounded by how many Cl⁻ ions?',
          options: ['4', '6', '8', '12'],
          correct: 1,
          explanation: 'In the rock salt structure, each Na⁺ sits in an octahedral hole surrounded by 6 nearest-neighbour Cl⁻ ions (one above, one below, and four in the equatorial plane). Coordination number = 6 for both ions.',
        },
        {
          question: 'Which ionic compound would be expected to have the highest melting point?',
          options: ['KCl', 'NaCl', 'MgO', 'LiF'],
          correct: 2,
          explanation: 'Melting point ∝ lattice energy ∝ (charge product) / (interionic distance). MgO (2+ × 2− = 4) >> KCl, NaCl, LiF (1+ × 1− = 1). Even accounting for ion size, the 4× charge advantage of MgO dominates → highest MP (~2852°C vs LiF 845°C, NaCl 801°C, KCl 776°C).',
        },
        {
          question: 'Why are ionic solids brittle rather than malleable?',
          options: [
            'They have weak interionic forces',
            'Shifting lattice layers brings like-charge ions into alignment, causing strong repulsion',
            'Their electrons are delocalized and cannot support stress',
            'Their bond angles are fixed by VSEPR',
          ],
          correct: 1,
          explanation: 'When an external force shifts one layer relative to the next, formerly opposite-charge neighbours become same-charge neighbours. The resulting repulsion is so strong the crystal fractures along the slip plane rather than deforming. This contrasts with metals, where the electron sea accommodates layer sliding.',
        },
      ],
      flashcards: [
        { front: 'What is a crystal lattice?', back: 'A 3D, periodic arrangement of ions (or atoms/molecules) in an ionic solid, described by a repeating unit cell' },
        { front: 'Why do ionic solids conduct electricity only when molten or dissolved?', back: 'In the solid, ions are immobile (fixed lattice). Melting or dissolving frees ions to move and carry charge.' },
        { front: 'How does ion charge affect lattice energy?', back: 'Lattice energy ∝ q₊ × q₋. Doubling both charges (e.g., Na⁺Cl⁻ → Mg²⁺O²⁻) quadruples lattice energy.' },
        { front: 'What is the coordination number in NaCl?', back: '6 — each ion is surrounded by 6 nearest neighbours of opposite charge in an octahedral arrangement' },
      ],
    },

    // ── Concept 4: Metallic Bonding ───────────────────────────────────────────
    {
      id: 'u2-c4-metallic-bonding',
      title: 'Metallic Bonding',
      subtitle: 'The electron sea model and properties',
      estimatedMinutes: 7,
      accentHex: '#059669',
      blocks: [
        {
          type: 'text',
          body: 'In metallic bonding, each metal atom contributes its valence electrons to a communal pool — the "electron sea" or "electron cloud." The resulting structure consists of positively charged metal cation cores arranged in a close-packed lattice, bathed in a fluid of delocalized electrons. No specific electron belongs to any specific cation; instead, electrons are shared collectively by all ions in the lattice.',
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'The Ball-Bearing and Syrup Model',
          body: 'Imagine steel ball-bearings (metal cations) floating in thick syrup (the electron sea). You can slide or reshape the arrangement without breaking anything — the syrup simply flows around the balls. This explains why metals are malleable (layers slide) and ductile (drawn into wires), unlike brittle ionic crystals.',
        },
        {
          type: 'list',
          variant: 'bullet',
          items: [
            'Electrical conductivity — delocalized electrons carry charge freely when a voltage is applied',
            'Thermal conductivity — mobile electrons and lattice vibrations (phonons) rapidly transfer heat',
            'Malleability / ductility — layers of cations slide without breaking the electron sea holding them together',
            'Metallic lustre — free electrons absorb and re-emit light at all visible wavelengths',
            'High melting points — especially for d-block metals with many valence electrons in the sea',
          ],
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Metallic Bond Strength Trends',
          body: 'Strength increases with: (1) more valence electrons per atom in the sea (e.g., W has 6 vs. Na has 1 → W is far harder and has a higher MP of 3422°C). (2) Smaller atomic radius → stronger attraction between cation core and electron cloud. Group 1 metals are soft with low MPs; transition metals are hard with high MPs.',
        },
        {
          type: 'table',
          headers: ['Metal', 'Valence e⁻', 'Melting point (°C)', 'Hardness'],
          rows: [
            ['Na (Group 1)', '1', '98', 'Very soft (cut with knife)'],
            ['Al (Group 13)', '3', '660', 'Soft-moderate'],
            ['Fe (Group 8)', '2–3 (+ 3d)', '1538', 'Hard'],
            ['W (Group 6)', '6', '3422', 'Hardest pure metal'],
          ],
        },
      ],
      mcqs: [
        {
          question: 'Which property of metals is BEST explained by the electron sea model?',
          options: [
            'High melting points compared to ionic solids',
            'Electrical conductivity in the solid state',
            'Formation of 1+ ions in reactions',
            'Insolubility in water',
          ],
          correct: 1,
          explanation: 'The electron sea model directly explains electrical conductivity: delocalized electrons can move freely through the lattice in response to an applied electric field. Ionic solids must be melted or dissolved first because their electrons are localised in bonds.',
        },
        {
          question: 'Which metal would be expected to have the highest melting point based on the electron sea model?',
          options: ['Na', 'K', 'Fe', 'Cs'],
          correct: 2,
          explanation: 'Fe (transition metal) has more valence electrons participating in the electron sea (including 3d electrons) and smaller atomic radius than the alkali metals Na, K, Cs. Stronger metal-sea attraction → higher MP. Fe MP = 1538°C vs. Na 98°C, K 64°C, Cs 28°C.',
        },
        {
          question: 'Why are metals malleable while ionic solids are brittle?',
          options: [
            'Metal bonds are weaker than ionic bonds',
            'Metals have lower melting points than ionic solids',
            'In metals, the electron sea accommodates layer sliding without disrupting bonding; ionic solids create charge repulsion on layer shift',
            'Ionic solids have no metallic character',
          ],
          correct: 2,
          explanation: 'When metal layers slide, the non-directional electron sea simply redistributes — no bonds break. When ionic crystal layers shift, formerly opposite-charge neighbours become like-charge, causing strong repulsion that fractures the crystal.',
        },
      ],
      flashcards: [
        { front: 'What is the electron sea model?', back: 'Metal cation cores sit in a lattice bathed in a pool of delocalized valence electrons shared collectively by all atoms' },
        { front: 'Why are metals electrically conductive?', back: 'Delocalized electrons move freely through the lattice in response to an applied electric field' },
        { front: 'Why are metals malleable and ductile?', back: 'Layers of metal cations can slide past each other; the non-directional electron sea flows around them without breaking' },
        { front: 'What increases metallic bond strength?', back: 'More valence electrons per atom in the sea, and smaller atomic radius (stronger cation-sea attraction) → higher MP and hardness' },
      ],
    },

    // ── Concept 5: Lewis Diagrams ─────────────────────────────────────────────
    {
      id: 'u2-c5-lewis',
      title: 'Lewis Diagrams',
      subtitle: 'Drawing valence electrons and bonds',
      estimatedMinutes: 12,
      accentHex: '#34d399',
      blocks: [
        {
          type: 'text',
          body: 'A Lewis diagram (Lewis structure) shows all valence electrons in a molecule or ion: bonding pairs (between atoms, shown as lines) and lone pairs (non-bonding, shown as dots). The goal is to satisfy the octet rule for all atoms (except hydrogen: duet, and some third-row+ elements that may have expanded octets) using the fewest formal charges possible.',
        },
        {
          type: 'list',
          variant: 'numbered',
          items: [
            'Count total valence electrons: sum valence e⁻ of all atoms. Add 1 e⁻ for each negative charge; subtract 1 for each positive charge.',
            'Connect atoms with single bonds (1 bond = 2 e⁻). Place the least electronegative atom (other than H) in the centre.',
            'Subtract bonding electrons from the total. Distribute remaining electrons as lone pairs — fill outer atoms first (to satisfy octets), then the central atom.',
            'If the central atom has fewer than 8 e⁻, convert lone pairs on adjacent atoms into double or triple bonds until all octets are satisfied.',
            'Calculate formal charges to identify the best structure (minimize magnitude and place negative formal charge on the most electronegative atom).',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Exceptions to the Octet Rule',
          body: 'H and He: duet (2 e⁻ max).\nBe: often only 4 e⁻ around Be (e.g., BeCl₂).\nB: often only 6 e⁻ around B (e.g., BF₃) — Lewis acid.\nPeriod 3+ central atoms (P, S, Cl, Si): can expand beyond 8 using d orbitals (e.g., PCl₅ = 10 e⁻, SF₆ = 12 e⁻).',
        },
        {
          type: 'formula',
          latex: '\\text{FC} = V - L - \\frac{B}{2}',
          display: true,
          caption: 'FC = formal charge, V = valence e⁻ of free atom, L = lone pair e⁻ on atom, B = bonding e⁻ on atom',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Formal Charge Tells You the Best Lewis Structure',
          body: 'Best structure has: (1) all formal charges as close to zero as possible, (2) any negative formal charge on the most electronegative atom, (3) no like-charge atoms adjacent. For CO₂: the double-bond structure (O=C=O) gives FC = 0 on all atoms — preferred over single-bond alternatives with formal charges.',
        },
      ],
      mcqs: [
        {
          question: 'How many total valence electrons are in the sulfate ion, SO₄²⁻?',
          options: ['30', '32', '34', '36'],
          correct: 1,
          explanation: 'S: 6 valence e⁻. O: 4 × 6 = 24 valence e⁻. Charge (2−): +2 electrons. Total = 6 + 24 + 2 = 32 valence electrons.',
        },
        {
          question: 'In the Lewis structure of NH₃, what is the formal charge on nitrogen?',
          options: ['−1', '0', '+1', '+3'],
          correct: 1,
          explanation: 'N has 5 valence e⁻. In NH₃: N has 1 lone pair (2 e⁻) and 3 N–H bonds (6 bonding e⁻ total, 3 belong to N). FC(N) = 5 − 2 − 3 = 0.',
        },
        {
          question: 'Which molecule is an exception to the octet rule because the central atom has fewer than 8 electrons?',
          options: ['CO₂', 'BF₃', 'PCl₅', 'H₂O'],
          correct: 1,
          explanation: 'BF₃: B has 3 valence e⁻. Three B–F bonds use 6 bonding electrons; no lone pairs on B. Total electrons around B = 6 (incomplete octet). BF₃ is an electrophile/Lewis acid because of this. PCl₅ has an expanded octet (10 e⁻ on P), not a deficient one.',
        },
      ],
      flashcards: [
        { front: 'Steps to draw a Lewis structure', back: '(1) Count total valence e⁻ (adjust for charge). (2) Connect with single bonds, central atom least EN. (3) Distribute remaining e⁻ as lone pairs (outer atoms first). (4) Add multiple bonds if central atom has < 8 e⁻. (5) Calculate formal charges.' },
        { front: 'Formula for formal charge', back: 'FC = V − L − B/2 (V = free-atom valence e⁻, L = lone pair e⁻, B = bonding e⁻ on that atom)' },
        { front: 'What atoms can have expanded octets?', back: 'Period 3 and higher (P, S, Cl, Si, Xe, etc.) — they can use d orbitals for > 8 electrons around the central atom' },
        { front: 'What is the best Lewis structure?', back: 'The one with formal charges closest to zero, negative FC on the most electronegative atom, and no adjacent like-charge formal charges' },
        { front: 'Total valence e⁻ for NO₃⁻?', back: 'N(5) + 3×O(6) + 1(charge) = 5 + 18 + 1 = 24 electrons' },
      ],
    },

    // ── Concept 6: Resonance & Formal Charge ──────────────────────────────────
    {
      id: 'u2-c6-resonance',
      title: 'Resonance & Formal Charge',
      subtitle: 'Delocalized electrons and equivalent structures',
      estimatedMinutes: 9,
      accentHex: '#6ee7b7',
      blocks: [
        {
          type: 'text',
          body: 'Resonance occurs when a molecule or ion cannot be adequately represented by a single Lewis structure — instead, two or more valid structures can be drawn that differ only in the position of electrons (bonds and lone pairs), not in the positions of atoms. The true structure is a resonance hybrid: a weighted average of all contributing resonance structures, with bonds that are intermediate in character.',
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'Resonance Is Not Alternating — It\'s an Average',
          body: 'A common misconception: the molecule does NOT flip between resonance structures. The resonance hybrid exists permanently as an intermediate. Like a mule (hybrid of a horse and a donkey), the hybrid is its own entity — not an oscillating horse-to-donkey. For benzene, all 6 C–C bonds are identical (bond order 1.5), not alternating single and double.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Nitrate Ion (NO₃⁻) — Classic Example',
          body: 'Three equivalent resonance structures can be drawn for NO₃⁻, each with one N=O double bond and two N–O single bonds in a different position. The resonance hybrid has three identical N–O bonds with bond order 4/3 ≈ 1.33. All three N–O bond lengths are equal (127 pm) — confirmed experimentally by X-ray crystallography.',
        },
        {
          type: 'text',
          body: 'Resonance structures are compared and ranked using formal charge. The dominant (most contributing) structure has the lowest magnitude of formal charges, with negative formal charges placed on the most electronegative atoms. Structures with formal charges that violate these rules contribute less to the hybrid.',
        },
        {
          type: 'list',
          variant: 'numbered',
          items: [
            'Draw all valid Lewis structures (atoms fixed, only move electrons).',
            'Calculate formal charges on each atom in each structure.',
            'Prefer the structure(s) where: all FCs are 0 or close to 0; negative FC is on the more electronegative atom.',
            'The actual molecule reflects the weighted average of all contributors.',
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Delocalization Stabilizes Molecules',
          body: 'Resonance delocalization lowers energy — a molecule with resonance is more stable than predicted by any single Lewis structure. Benzene\'s unusual stability (does not readily undergo addition reactions) is direct evidence of resonance stabilization (≈ 150 kJ/mol resonance energy).',
        },
      ],
      mcqs: [
        {
          question: 'The resonance hybrid of NO₃⁻ has three identical N–O bonds. What is the bond order of each bond?',
          options: ['1.0', '1.33', '1.5', '2.0'],
          correct: 1,
          explanation: 'NO₃⁻ has three resonance structures, each with one double bond and two single bonds. Average bond order = (1 + 1 + 2) / 3 = 4/3 ≈ 1.33. This intermediate bond order is confirmed by the equal bond lengths (~127 pm, between N–O single bond 140 pm and N=O double bond 115 pm).',
        },
        {
          question: 'Which statement about resonance structures is correct?',
          options: [
            'The molecule alternates rapidly between resonance structures',
            'Resonance structures differ in the arrangement of atoms',
            'The true structure is a hybrid with properties intermediate between all resonance structures',
            'Resonance only occurs in benzene',
          ],
          correct: 2,
          explanation: 'The molecule exists as a single resonance hybrid — not an oscillating mixture. Resonance structures have the same atomic positions but differ in electron placement. The hybrid has bond orders, lengths, and charges that are weighted averages of all contributors.',
        },
        {
          question: 'For CO₂, which Lewis structure is preferred based on formal charge analysis?',
          options: [
            'O=C=O (FC = 0 on all atoms)',
            'O≡C–O (FC = +1 on O, −1 on terminal O)',
            'O–C≡O (FC = −1 on O, +1 on C)',
            'Both O≡C–O and O–C≡O equally',
          ],
          correct: 0,
          explanation: 'O=C=O assigns FC = 0 to C and both O atoms (verify: C has 4 valence e⁻, 0 lone pairs, 8 bonding e⁻ → FC = 4−0−4 = 0; O has 6 valence e⁻, 2 lone pairs = 4 e⁻, 4 bonding e⁻ → FC = 6−4−2 = 0). The symmetric double-bond structure is strongly preferred.',
        },
      ],
      flashcards: [
        { front: 'What is a resonance hybrid?', back: 'The true structure of a molecule that cannot be represented by a single Lewis structure. It is a weighted average of all resonance contributors — not an oscillating mixture.' },
        { front: 'What do resonance structures have in common?', back: 'The same atomic connectivity (atom positions). Only the positions of electrons (bonds and lone pairs) differ between structures.' },
        { front: 'How does resonance affect bond lengths?', back: 'Bonds that are single in some resonance structures and double in others have intermediate lengths — shorter than a pure single bond, longer than a pure double bond.' },
        { front: 'Bond order in benzene (C₆H₆)?', back: '1.5 — each C–C bond is a resonance hybrid between single and double, confirmed by equal bond lengths of 140 pm' },
      ],
    },

    // ── Concept 7: VSEPR & Hybridization ──────────────────────────────────────
    {
      id: 'u2-c7-vsepr',
      title: 'VSEPR & Bond Hybridization',
      subtitle: 'Geometry, bond angles, and orbital mixing',
      estimatedMinutes: 14,
      accentHex: '#34d399',
      blocks: [
        {
          type: 'text',
          body: 'Valence Shell Electron Pair Repulsion (VSEPR) theory predicts molecular geometry based on one principle: electron groups (bonding pairs + lone pairs) around a central atom arrange themselves to maximise their separation, minimizing repulsion. The electron group geometry determines positions of all electron groups; the molecular geometry considers only atom positions (ignoring lone pairs).',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Lone Pairs Compress Bond Angles',
          body: 'Lone pairs repel more strongly than bonding pairs (lone pairs are held closer to the nucleus and spread out more). Each lone pair on the central atom compresses the remaining bond angles by ~2–2.5°.\nNH₃: tetrahedral electron geometry (4 groups), pyramidal molecular geometry, bond angle ≈ 107° (vs. 109.5° for perfect tetrahedron).\nH₂O: tetrahedral electron geometry, bent molecular geometry, bond angle ≈ 104.5°.',
        },
        {
          type: 'table',
          headers: ['Electron groups', 'Lone pairs', 'Electron geometry', 'Molecular geometry', 'Bond angle', 'Example'],
          rows: [
            ['2', '0', 'Linear', 'Linear', '180°', 'CO₂, BeCl₂'],
            ['3', '0', 'Trigonal planar', 'Trigonal planar', '120°', 'BF₃, SO₃'],
            ['3', '1', 'Trigonal planar', 'Bent', '<120°', 'SO₂'],
            ['4', '0', 'Tetrahedral', 'Tetrahedral', '109.5°', 'CH₄, CCl₄'],
            ['4', '1', 'Tetrahedral', 'Trigonal pyramidal', '~107°', 'NH₃'],
            ['4', '2', 'Tetrahedral', 'Bent', '~104.5°', 'H₂O'],
            ['5', '0', 'Trigonal bipyramidal', 'Trigonal bipyramidal', '90°/120°', 'PCl₅'],
            ['6', '0', 'Octahedral', 'Octahedral', '90°', 'SF₆'],
          ],
        },
        {
          type: 'text',
          body: 'Hybridization is an orbital model that reconciles VSEPR geometry with quantum mechanics. Atomic orbitals on the central atom mathematically "mix" to form hybrid orbitals with the correct number and geometry for bonding. The number of hybrid orbitals = number of electron groups = number of atomic orbitals mixed.',
        },
        {
          type: 'table',
          headers: ['Electron groups', 'Hybridization', 'Geometry', 'Bond angles', 'Example'],
          rows: [
            ['2', 'sp', 'Linear', '180°', 'BeCl₂, CO₂ (C), C₂H₂ (C)'],
            ['3', 'sp²', 'Trigonal planar', '120°', 'BF₃, C₂H₄ (C), SO₃ (S)'],
            ['4', 'sp³', 'Tetrahedral', '109.5°', 'CH₄, NH₃, H₂O'],
            ['5', 'sp³d', 'Trigonal bipyramidal', '90°/120°', 'PCl₅'],
            ['6', 'sp³d²', 'Octahedral', '90°', 'SF₆'],
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'σ and π Bond Counts From Bond Order',
          body: 'Every bond has 1 σ bond. Multiple bonds add π bonds: double bond = 1σ + 1π; triple bond = 1σ + 2π.\nFor C₂H₂ (HC≡CH): 3 σ bonds (H–C, C≡C counts 1σ, C–H) + 2 π bonds in the triple bond.\nRotation is possible around σ bonds; π bonds lock rotation → geometric (cis/trans) isomers arise.',
        },
        {
          type: 'simulation',
          title: '3D Molecular Geometry Builder',
          description: 'Input any molecule formula, add electron groups to the central atom, and watch the 3D geometry auto-construct using VSEPR rules. Toggle between electron geometry and molecular geometry views.',
        },
      ],
      mcqs: [
        {
          question: 'What is the molecular geometry and approximate bond angle of H₂O?',
          options: [
            'Linear, 180°',
            'Trigonal planar, 120°',
            'Bent, ~104.5°',
            'Trigonal pyramidal, ~107°',
          ],
          correct: 2,
          explanation: 'H₂O has 4 electron groups (2 bonding pairs + 2 lone pairs) → tetrahedral electron geometry. The 2 lone pairs cause stronger repulsion than bonding pairs, compressing the H–O–H angle to ~104.5° below the 109.5° tetrahedral ideal. Molecular geometry = bent (only atom positions counted).',
        },
        {
          question: 'What hybridization does the nitrogen atom in NH₃ have?',
          options: ['sp', 'sp²', 'sp³', 'sp³d'],
          correct: 2,
          explanation: 'N in NH₃ has 4 electron groups (3 N–H bonding pairs + 1 lone pair) → 4 hybrid orbitals → sp³ hybridization. One of the four sp³ orbitals holds the lone pair; three form N–H σ bonds.',
        },
        {
          question: 'How many σ bonds and π bonds are in a molecule of acetylene, HC≡CH?',
          options: [
            '2 σ bonds, 2 π bonds',
            '3 σ bonds, 2 π bonds',
            '3 σ bonds, 1 π bond',
            '2 σ bonds, 3 π bonds',
          ],
          correct: 1,
          explanation: 'HC≡CH: H–C σ (1) + C≡C triple bond (1σ + 2π) + C–H σ (1) = 3 σ bonds + 2 π bonds. The triple bond consists of one σ bond (head-to-head orbital overlap) and two π bonds (sideways p orbital overlap).',
        },
      ],
      flashcards: [
        { front: 'VSEPR: what determines molecular geometry?', back: 'The number and position of bonding pairs AND lone pairs (electron groups) around the central atom, arranged to maximize separation' },
        { front: 'Why does H₂O have a smaller bond angle than CH₄?', back: 'H₂O has 2 lone pairs on O; lone pairs repel more than bonding pairs, compressing the H–O–H angle from 109.5° (CH₄) to ~104.5°' },
        { front: 'How many electron groups for sp³ hybridization?', back: '4 electron groups → 4 hybrid orbitals (sp³) → tetrahedral geometry. Example: C in CH₄, N in NH₃, O in H₂O' },
        { front: 'What is a π bond?', back: 'A bond formed by sideways (lateral) overlap of p orbitals above and below the internuclear axis. Present in double bonds (1π) and triple bonds (2π).' },
        { front: 'How many σ and π bonds in a double bond?', back: '1 σ bond + 1 π bond. A triple bond has 1 σ + 2 π.' },
      ],
    },

  ],
}
