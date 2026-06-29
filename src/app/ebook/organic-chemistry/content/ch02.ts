import type { OrgoChapter } from '../types'

export const CH02: OrgoChapter = {
  id: 'ch02',
  number: 2,
  title: 'Acids & Bases in Organic Chemistry',
  orgo: 1,
  accentHex: '#10b981',
  concepts: [

    // ── Concept 1: Brønsted–Lowry Acids & Bases ───────────────────────────────
    {
      id: 'ch02-c1-bronsted',
      title: 'Brønsted–Lowry Acids & Bases',
      subtitle: 'Proton transfer — the most common elementary step in organic chemistry',
      estimatedMinutes: 12,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'In organic chemistry, an acid-base reaction is not a special event — it is the most common elementary step of all. Proton transfers underlie every carbonyl addition, every elimination, every enzyme mechanism. The Brønsted–Lowry definition is the one that matters most: an acid is a proton donor, a base is a proton acceptor. When an acid donates its proton, it becomes its conjugate base. When a base accepts a proton, it becomes its conjugate acid.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'The Conjugate Pair Relationship',
          body: 'Every acid-base reaction involves two conjugate pairs:\n\nHA  +  B:  ⇌  A⁻  +  BH⁺\n\nHA / A⁻ = conjugate acid/base pair 1\nBH⁺ / B: = conjugate acid/base pair 2\n\nThe stronger the acid, the weaker its conjugate base — and vice versa. This inverse relationship is the key to predicting reaction direction.',
        },
        {
          type: 'text',
          body: 'Acid strength is quantified by Ka, the acid dissociation constant, and more practically by pKa = −log(Ka). A lower pKa means a stronger acid (larger Ka, more dissociated at equilibrium). The pKa scale is logarithmic — a difference of 1 pKa unit means a 10-fold difference in acidity.',
        },
        {
          type: 'formula',
          latex: '\\text{p}K_a = -\\log_{10}(K_a)',
          display: true,
          caption: 'Lower pKa = stronger acid. pKa < 0: very strong acid. pKa 4–5: carboxylic acid. pKa ~10: phenol. pKa 15–16: alcohol. pKa ~25: terminal alkyne. pKa ~44: alkene C–H.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Predicting Acid-Base Equilibrium Direction',
          body: 'Equilibrium always favors the side with the WEAKER acid (higher pKa) and WEAKER base.\n\nRule: Proton transfer goes from the stronger acid to the stronger base, producing the weaker acid and weaker base.\n\nIf pKa(acid) > pKa(conjugate acid of base): equilibrium lies to the LEFT\nIf pKa(acid) < pKa(conjugate acid of base): equilibrium lies to the RIGHT\n\nQuick check: "Does the pKa go up or down on the right side?" — Up = products favored.',
        },
        {
          type: 'table',
          headers: ['Compound', 'pKa', 'Conjugate base'],
          rows: [
            ['HCl (hydrochloric acid)', '−7', 'Cl⁻'],
            ['H₂SO₄ (sulfuric acid)', '−3', 'HSO₄⁻'],
            ['CF₃COOH (trifluoroacetic acid)', '0', 'CF₃COO⁻'],
            ['CH₃COOH (acetic acid)', '4.7', 'CH₃COO⁻'],
            ['C₆H₅OH (phenol)', '10.0', 'C₆H₅O⁻'],
            ['H₂O (water)', '15.7', 'HO⁻'],
            ['CH₃CH₂OH (ethanol)', '16', 'CH₃CH₂O⁻'],
            ['HC≡CH (acetylene)', '25', 'HC≡C⁻'],
            ['H₂ (hydrogen)', '35', 'H⁻'],
            ['NH₃ (ammonia)', '38', 'NH₂⁻'],
            ['CH₂=CH₂ (ethylene C–H)', '44', 'vinyl anion'],
            ['CH₄ (methane)', '50', 'CH₃⁻'],
          ],
        },
      ],
      mcqs: [
        {
          question: 'Which of the following is the stronger acid, and why? Acetic acid (pKa 4.7) or phenol (pKa 10.0)?',
          options: [
            'Phenol — it has a benzene ring that stabilizes the O–H bond',
            'Acetic acid — lower pKa means it is a stronger acid',
            'They are equal in strength because both contain O–H bonds',
            'Phenol — the aromatic ring makes it more electronegative',
          ],
          correct: 1,
          explanation: 'Lower pKa = stronger acid. Acetic acid (pKa 4.7) is stronger than phenol (pKa 10.0) by a factor of 10^(10.0−4.7) ≈ 200,000. The acetate ion is stabilized by resonance over two equivalent oxygens; phenoxide is also resonance-stabilized but over one oxygen and four less-electronegative ring carbons — less effective stabilization.',
        },
        {
          question: 'An organic chemist uses NaOH (pKa of conjugate acid H₂O = 15.7) to deprotonate a terminal alkyne (pKa ~25). Does the equilibrium favor products or reactants?',
          options: [
            'Products — NaOH is a strong enough base to deprotonate alkynes',
            'Reactants — pKa of alkyne (25) > pKa of water (15.7), so proton transfer is thermodynamically unfavorable',
            'Neither — the reaction does not occur at all',
            'Products — because alkynes are very acidic compared to alkanes',
          ],
          correct: 1,
          explanation: 'Equilibrium favors the weaker acid side. The alkyne has pKa 25; water (conjugate acid of OH⁻) has pKa 15.7. For deprotonation of the alkyne by OH⁻ to be favorable, we need pKa(alkyne) < pKa(conjugate acid of base). Here 25 > 15.7, so equilibrium lies to the LEFT (reactants favored). To quantitatively deprotonate a terminal alkyne, you need a stronger base such as NaNH₂ (conjugate acid NH₃, pKa 38) or n-BuLi (conjugate acid butane, pKa ~50).',
        },
        {
          question: 'In the reaction of HBr with water, which is acting as the Brønsted-Lowry base?',
          options: [
            'HBr — it donates a proton',
            'Br⁻ — it accepts an electron pair',
            'H₂O — it accepts the proton from HBr',
            'H₃O⁺ — it is the product acid',
          ],
          correct: 2,
          explanation: 'Water accepts the proton from HBr to form H₃O⁺ and Br⁻. In Brønsted–Lowry terms: HBr is the acid (proton donor), H₂O is the base (proton acceptor). The conjugate pairs are HBr/Br⁻ and H₃O⁺/H₂O. HBr (pKa −9) is far stronger than H₃O⁺ (pKa −1.7), so equilibrium strongly favors products — HBr is considered fully dissociated in water.',
        },
      ],
      flashcards: [
        {
          front: 'Brønsted–Lowry acid vs base',
          back: 'Acid = proton (H⁺) donor. Base = proton (H⁺) acceptor. Every acid has a conjugate base (after losing H⁺); every base has a conjugate acid (after gaining H⁺). Stronger acid → weaker conjugate base.',
        },
        {
          front: 'pKa scale — key reference values',
          back: 'Strong acids: pKa < 0 (HCl, H₂SO₄)\nCarboxylic acids: pKa ~4–5\nPhenols: pKa ~10\nAlcohols: pKa ~15–16\nWater: pKa 15.7\nTerminal alkynes: pKa ~25\nAlkenes C–H: pKa ~44\nAlkanes C–H: pKa ~50',
        },
        {
          front: 'How do you predict equilibrium direction in an acid-base reaction?',
          back: 'Equilibrium favors production of the weaker acid. Compare pKa of the starting acid with the pKa of the conjugate acid of the base. If pKa(acid) > pKa(conjugate acid of base) → reactants favored. If pKa(acid) < → products favored.',
        },
        {
          front: 'Why is acetic acid (pKa 4.7) much more acidic than ethanol (pKa 16)?',
          back: 'The acetate ion is resonance-stabilized — the negative charge is delocalized over two equivalent electronegative oxygen atoms. Ethoxide bears the full negative charge on one oxygen with no resonance relief. Greater anion stability → stronger acid.',
        },
        {
          front: 'What base is needed to deprotonate each type of C–H bond?',
          back: 'sp C–H (alkyne, pKa 25): NaNH₂ or n-BuLi\nsp² C–H (vinyl, pKa 44): n-BuLi or organolithium\nsp³ C–H (alkane, pKa 50): LDA or LiHMDS (in specialized cases)\n\nOH⁻ (pKa 15.7) is too weak for any C–H deprotonation.',
        },
      ],
    },

    // ── Concept 2: Factors Governing Acidity ──────────────────────────────────
    {
      id: 'ch02-c2-factors',
      title: 'Four Factors That Govern Acidity',
      subtitle: 'Electronegativity, resonance, induction, and hybridization',
      estimatedMinutes: 14,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'The acidity of an O–H, N–H, or C–H bond depends entirely on how stable the resulting anion is after the proton is removed. Four structural factors stabilize anions and therefore increase acidity. Understanding all four — and how they interact — lets you rank any set of acids without memorizing pKa values.',
        },
        {
          type: 'table',
          headers: ['Factor', 'Effect on anion', 'Example comparison'],
          rows: [
            ['Electronegativity of atom bearing charge', 'More electronegative atom holds negative charge more stably', 'HF (pKa 3.2) > H₂O (15.7) > NH₃ (38) > CH₄ (50) — going left on periodic table'],
            ['Resonance delocalization', 'Charge spread over multiple atoms = greater stability', 'CH₃COOH (4.7) > C₂H₅OH (16) — acetate delocalized over 2 O'],
            ['Inductive effect (electronegativity of nearby groups)', 'Electron-withdrawing groups stabilize nearby negative charge', 'Cl₃CCOOH (0.77) > ClCH₂COOH (2.8) > CH₃COOH (4.7)'],
            ['Hybridization of carbon bearing the proton', 'More s-character = electrons closer to nucleus = more stable anion', 'sp (alkyne, pKa 25) > sp² (alkene, 44) > sp³ (alkane, 50)'],
          ],
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'Think of Anion Stability Like Distributing a Hot Potato',
          body: 'A negative charge is like a hot potato. The more atoms it can be spread across (resonance), the cooler each atom gets and the more comfortable the anion is. A single atom holding all the charge (no resonance, low electronegativity) is like one person holding a very hot potato — unstable, wants to drop it (weak acid because the anion is too unstable to form readily).',
        },
        {
          type: 'text',
          body: 'The inductive effect operates through sigma bonds and decreases rapidly with distance. In chloroacetic acid, the Cl atom withdraws electron density through the C–C bond, stabilizing the carboxylate anion and increasing acidity relative to acetic acid. With each additional Cl (dichloroacetic, trichloroacetic), the effect grows: Cl₃CCOOH has pKa ~0.77 — nearly as strong as a mineral acid. Two carbons away, the effect is much weaker; three carbons away, it is negligible.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Priority Order When Factors Conflict',
          body: 'When multiple factors apply, use this priority:\n\n1. Resonance — always dominates if present\n2. Electronegativity of the atom bearing the charge (row effect)\n3. Inductive effects from nearby EWG\n4. Hybridization\n\nExample: Why is phenol (pKa 10) more acidic than cyclohexanol (pKa ~17)? Both are O–H bonds. Phenoxide is resonance-stabilized by the benzene ring; cyclohexoxide is not. Resonance wins.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Row vs Column: The Periodic Table Trap',
          body: 'ACROSS a period (same row): electronegativity determines acidity. H₂O > NH₃ > CH₄ because O is more electronegative than N is more electronegative than C.\n\nDOWN a group (same column): SIZE determines acidity, which can override electronegativity. HI (pKa −10) > HBr (−9) > HCl (−7) > HF (3.2) even though F is more electronegative. The I–H bond is so long that charge-to-radius ratio of I⁻ is low — the negative charge is more diffuse on the larger, more polarizable iodide, making it more stable.\n\nDon\'t apply the across-period logic to down-group comparisons.',
        },
      ],
      mcqs: [
        {
          question: 'Rank these compounds in order of increasing acidity: trichloroacetic acid (Cl₃CCOOH), acetic acid (CH₃COOH), trifluoroacetic acid (CF₃COOH).',
          options: [
            'CH₃COOH < CF₃COOH < Cl₃CCOOH',
            'Cl₃CCOOH < CF₃COOH < CH₃COOH',
            'CH₃COOH < Cl₃CCOOH < CF₃COOH',
            'CF₃COOH < CH₃COOH < Cl₃CCOOH',
          ],
          correct: 2,
          explanation: 'All three are carboxylic acids (same resonance stabilization). The difference is inductive: CH₃ is weakly electron-donating, Cl is moderately electron-withdrawing (pKa ~0.7), F is strongly electron-withdrawing (pKa ~0.5 — F has higher electronegativity than Cl even though Cl is larger). CF₃COOH is the strongest acid here because F is more electronegative than Cl. Order: CH₃COOH (pKa 4.7) < Cl₃CCOOH (0.77) < CF₃COOH (0.52).',
        },
        {
          question: 'HI is a stronger acid than HF despite fluorine being far more electronegative. The best explanation is:',
          options: [
            'Iodine has a lower electronegativity so the H–I bond is weaker',
            'Iodine is much larger than fluorine; the H–I bond is longer and weaker, and I⁻ stabilizes negative charge better through polarizability',
            'Fluorine\'s electronegativity makes H–F too stable to ionize',
            'HI dissociates before HF because iodine is a better leaving group',
          ],
          correct: 1,
          explanation: 'For acids in the same group (down the column), bond strength and ion size dominate. The H–I bond is much longer and weaker than H–F (240 vs 570 kJ/mol), so it breaks more easily. Additionally, iodide (I⁻) is a large, highly polarizable ion — its negative charge is diffuse and well-accommodated, making I⁻ a more stable anion than the tiny F⁻ (where the high charge density on a small atom makes it reactive). Polarizability overrides electronegativity going down a group.',
        },
        {
          question: 'Which C–H bond is most acidic in propyne (HC≡C–CH₃)?',
          options: [
            'The sp³ C–H bonds of the CH₃ group (pKa ~50)',
            'The sp C–H bond of the terminal alkyne (pKa ~25)',
            'All C–H bonds are equally acidic',
            'There is no acidic C–H bond in propyne',
          ],
          correct: 1,
          explanation: 'The terminal C–H bond (≡C–H) is sp hybridized — the carbon has 50% s-character. Electrons in s orbitals are held closer to the nucleus and experience a higher effective nuclear charge, making the sp carbon more electronegative than sp² or sp³ carbon. After deprotonation, the resulting propargyl anion (HC≡C⁻) is sp hybridized and more stable than sp³ carbanions. This is why terminal alkynes can be deprotonated with NaNH₂ or n-BuLi, but simple alkanes cannot.',
        },
      ],
      flashcards: [
        {
          front: 'Four factors that increase acidity (stabilize the conjugate base)',
          back: '1. Electronegativity: more electronegative atom holding charge = more stable\n2. Resonance: delocalized charge = more stable\n3. Inductive: nearby EWG stabilize negative charge\n4. Hybridization: sp (50% s) > sp² (33%) > sp³ (25%) = more electronegative C',
        },
        {
          front: 'Why does adding Cl atoms to acetic acid increase its acidity?',
          back: 'Cl is strongly electron-withdrawing by induction (through σ bonds). It pulls electron density away from the carboxylate anion, dispersing and stabilizing the negative charge. Each Cl adds more electron withdrawal: CH₃COOH (4.7) → ClCH₂COOH (2.8) → Cl₂CHCOOH (1.5) → Cl₃CCOOH (0.77).',
        },
        {
          front: 'Why is HI a stronger acid than HF despite F being more electronegative?',
          back: 'Going down a group, ion size and bond strength matter more than electronegativity. H–I is a weaker bond (longer, lower BDE) and I⁻ is large and polarizable — disperses negative charge well. H–F is a strong, short bond; F⁻ is tiny with concentrated charge density. Bond strength wins over electronegativity within a group.',
        },
        {
          front: 'Across a period (same row), what determines relative acidity of X–H bonds?',
          back: 'Electronegativity of X. Within the same row, larger electronegativity = more stable anion = stronger acid. H₂O (pKa 15.7) > NH₃ (38) > CH₄ (50). O is more electronegative than N which is more electronegative than C.',
        },
        {
          front: 'How does resonance stabilization dominate over other acidity factors?',
          back: 'Resonance is the most powerful stabilizing force. Even if an atom is less electronegative, resonance delocalization can make it far more acidic. Example: carboxylic acid O–H (pKa ~5) vs. alcohol O–H (pKa ~16) — the carboxylate is resonance-stabilized; the alkoxide is not. The 10¹¹ acidity difference reflects the power of resonance.',
        },
      ],
    },

    // ── Concept 3: Lewis Acids & Bases ────────────────────────────────────────
    {
      id: 'ch02-c3-lewis',
      title: 'Lewis Acids & Bases',
      subtitle: 'Electron pair donors and acceptors — the broader picture',
      estimatedMinutes: 10,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'The Lewis definition is broader than Brønsted–Lowry and more useful for understanding organic reaction mechanisms. A Lewis acid is an electron pair acceptor — any species with an empty orbital or partial positive charge that can receive electrons. A Lewis base is an electron pair donor — any species with a lone pair or π bond that can donate electrons to a Lewis acid. Importantly, proton transfer is a special case of Lewis acid-base chemistry (H⁺ is itself a Lewis acid).',
        },
        {
          type: 'table',
          headers: ['Species', 'Lewis acid or base?', 'Why'],
          rows: [
            ['BF₃', 'Lewis acid', 'Boron has only 6 valence electrons — empty p orbital, electron deficient'],
            ['AlCl₃', 'Lewis acid', 'Aluminum has empty orbital; Friedel-Crafts catalyst'],
            ['FeBr₃', 'Lewis acid', 'Iron accepts lone pairs; used in electrophilic aromatic substitution'],
            ['ZnCl₂', 'Lewis acid', 'Coordinates to lone pairs; activates C=O bonds'],
            ['H₂O', 'Lewis base', 'Two lone pairs donate to Lewis acids'],
            ['NH₃', 'Lewis base', 'Lone pair on N donates to Lewis acids'],
            ['Alkenes (C=C)', 'Lewis base', 'π electrons donate to electrophiles (Lewis acids)'],
            ['Carbocations (R₃C⁺)', 'Lewis acid', 'Empty p orbital accepts electron pairs'],
          ],
        },
        {
          type: 'callout',
          variant: 'insight',
          title: 'Every Organic Reaction Is a Lewis Acid-Base Interaction',
          body: 'Look at any organic mechanism: a nucleophile (Lewis base, lone pair or π electrons) attacks an electrophile (Lewis acid, electron-deficient atom or empty orbital). SN2: nucleophile (Lewis base) attacks carbon (Lewis acid site). Electrophilic addition to alkene: π bond (Lewis base) attacks electrophile (Lewis acid). Carbonyl addition: nucleophile (Lewis base) attacks C=O carbon (Lewis acid).\n\nOnce you see every reaction this way, mechanisms become predictable rather than memorized.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Common Lewis Acid Catalysts in Orgo — Memorize These',
          body: 'BF₃, AlCl₃, FeBr₃, FeCl₃, ZnCl₂, SnCl₄, TiCl₄ — all Lewis acids used as catalysts.\n\nThey activate electrophiles by coordinating to a leaving group or lone pair, generating a more reactive electrophilic species. Example: AlCl₃ + RCOCl → [AlCl₄]⁻ + RCO⁺ (acylium ion, highly electrophilic carbonyl). This is Friedel-Crafts acylation.',
        },
      ],
      mcqs: [
        {
          question: 'In the reaction of BF₃ with NH₃ to form F₃B←NH₃, which species is the Lewis acid and which is the Lewis base?',
          options: [
            'BF₃ is the base (it has F atoms with lone pairs); NH₃ is the acid (H can be donated)',
            'BF₃ is the Lewis acid (empty p orbital on B accepts electron pair); NH₃ is the Lewis base (lone pair on N donates)',
            'BF₃ is the Lewis acid; NH₃ is the Brønsted-Lowry acid',
            'Both are amphoteric — each can act as acid or base',
          ],
          correct: 1,
          explanation: 'Boron in BF₃ has only 6 valence electrons and an empty p orbital — it is electron-deficient and accepts an electron pair (Lewis acid). Nitrogen in NH₃ has a lone pair it can donate (Lewis base). The arrow in F₃B←NH₃ points from N to B, showing the direction of lone pair donation. The product is a Lewis acid-base adduct (coordinate covalent bond). Note: BF₃ has no proton to donate, so it cannot be a Brønsted acid, but it is a classic Lewis acid.',
        },
        {
          question: 'Which of the following is acting as a Lewis base in an SN2 reaction where OH⁻ displaces Br⁻ from CH₃Br?',
          options: [
            'CH₃Br — it accepts the incoming nucleophile',
            'Br⁻ — it is the leaving group',
            'OH⁻ — it donates its lone pair to the electrophilic carbon',
            'The carbon of CH₃Br — it has an empty orbital',
          ],
          correct: 2,
          explanation: 'OH⁻ is the nucleophile — it donates its lone pair to the electrophilic (Lewis acid) carbon of CH₃Br. This is the definition of a Lewis base: electron pair donor. The carbon of CH₃Br is the Lewis acid (partial positive charge due to C–Br polarity, δ+ carbon). Br⁻ leaves as it is displaced. In every SN2 reaction, the nucleophile is a Lewis base and the electrophilic carbon is the Lewis acid.',
        },
        {
          question: 'Why can an alkene act as a Lewis base?',
          options: [
            'Because alkenes have lone pairs on the double-bonded carbons',
            'Because the π electrons of the double bond can be donated to an electrophile (Lewis acid)',
            'Because alkene C–H bonds are acidic and can donate protons',
            'Because alkenes are nonpolar and do not interact with acids',
          ],
          correct: 1,
          explanation: 'The π bond of an alkene consists of two electrons in a π orbital that lies above and below the σ-bond framework. These electrons are loosely held (π bonds are weaker than σ bonds) and are available to donate to electron-deficient species (Lewis acids/electrophiles). This is exactly what happens in electrophilic addition reactions — the π electrons of an alkene attack an electrophile (H⁺, Br₂, Hg²⁺) as a Lewis base, initiating the addition.',
        },
      ],
      flashcards: [
        {
          front: 'Lewis acid vs Lewis base definitions',
          back: 'Lewis acid = electron pair ACCEPTOR (has empty orbital or partial positive charge). Lewis base = electron pair DONOR (has lone pair or π electrons). Every nucleophile is a Lewis base; every electrophile is a Lewis acid.',
        },
        {
          front: 'What makes BF₃, AlCl₃, and FeBr₃ Lewis acids?',
          back: 'All three have central atoms with only 6 valence electrons (not a full octet) — they have an empty orbital available to accept an electron pair. They are used as Lewis acid catalysts in Friedel-Crafts reactions (AlCl₃, FeBr₃) and other electrophilic processes.',
        },
        {
          front: 'How does the Lewis definition extend the Brønsted–Lowry definition?',
          back: 'Brønsted–Lowry requires proton transfer (H⁺ must be involved). Lewis acid-base reactions include proton transfers (H⁺ is a Lewis acid) PLUS all reactions involving empty-orbital species like BF₃, carbocations, and metal ions. Lewis is broader — all Brønsted reactions are Lewis reactions, but not all Lewis reactions are Brønsted.',
        },
        {
          front: 'Give three examples of Lewis bases in organic chemistry',
          back: '1. Alkenes (π electrons donate to electrophiles)\n2. Water and alcohols (lone pairs on O)\n3. Amines (lone pair on N)\n4. Halide ions (lone pairs — nucleophiles in SN2)\n5. Carbanions and Grignard reagents (lone pair on C)',
        },
      ],
    },
  ],
}
