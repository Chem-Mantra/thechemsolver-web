import type { OrgoChapter } from '../types'

export const CH07: OrgoChapter = {
  id: 'ch07',
  number: 7,
  title: 'Elimination Reactions',
  orgo: 1,
  accentHex: '#10b981',
  concepts: [

    // ── Concept 1: E2 Mechanism ───────────────────────────────────────────────
    {
      id: 'ch07-c1-e2',
      title: 'E2 Elimination',
      subtitle: 'Anti-periplanar requirement, Zaitsev\'s rule, and stereospecificity',
      estimatedMinutes: 13,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'Elimination reactions remove two substituents from adjacent carbons to form a π bond — typically a C=C alkene. E2 (Elimination Bimolecular) is a concerted, one-step mechanism: a strong base abstracts a β-hydrogen (one carbon away from the leaving group) simultaneously as the leaving group departs, forming the alkene in one concerted step.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'The Three Requirements for E2',
          body: '1. Strong base (KOH, NaOEt, LDA, t-BuOK — deprotonates the β-carbon)\n2. Good leaving group (Br, Cl, I, OTs) on the α-carbon\n3. Anti-periplanar geometry: H and LG must be 180° (anti) in the transition state\n\nRate = k[substrate][base] → bimolecular, like SN2.\n\nThe anti-periplanar requirement is the most important geometric constraint: the C–H and C–LG bonds must be aligned in the same plane, anti to each other (like a perfectly staggered Newman projection viewed along the C_α–C_β bond).',
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'Anti-Periplanar: The Zipper Analogy',
          body: 'Imagine the C_β–H bond and the C_α–LG bond as two sides of a zipper. For E2 to work, both sides must line up perfectly (anti, 180°) so the electrons from C–H can flow through to form the π bond while LG departs. If the zipper sides are at 90° or 60°, the electrons can\'t flow — no reaction. The transition state requires maximum overlap between the breaking C–H bond and the σ* antibond of C–LG.\n\nIn cyclohexane, this means H and LG must both be axial (axial-axial anti arrangement) for E2 to proceed.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Zaitsev\'s Rule vs Hofmann Rule',
          body: 'Zaitsev\'s rule: elimination gives the MORE substituted alkene (more stable product).\n• E2 with KOH or NaOEt (small base) → Zaitsev product\n• Example: 2-bromobutane + KOH → 2-butene (major, more substituted) + 1-butene (minor)\n\nHofmann rule: elimination gives the LESS substituted alkene.\n• E2 with bulky base (t-BuOK, LDA) → Hofmann product\n• Bulky base cannot access the more hindered β-H near the leaving group; it abstracts the less hindered terminal H\n• Example: 2-bromobutane + t-BuOK → 1-butene (major, less substituted)\n\nFor E1 (see next concept), Zaitsev always applies (thermodynamic control).',
        },
        {
          type: 'table',
          headers: ['Reagent', 'Type', 'E2 or SN2 outcome'],
          rows: [
            ['KOH (ethanol)', 'Strong base, moderate size', 'E2 (Zaitsev alkene)'],
            ['NaOEt / EtOH', 'Strong base, moderate size', 'E2 (Zaitsev alkene)'],
            ['t-BuOK / t-BuOH', 'Strong, bulky base', 'E2 (Hofmann alkene — less substituted)'],
            ['NaI / acetone', 'Good nucleophile, weak base', 'SN2'],
            ['NaCN / DMSO', 'Good nucleophile, weak base', 'SN2'],
            ['NaOH / H₂O', 'Nucleophile AND base', 'SN2 favored for 1°; E2 for 3°'],
            ['DBN, DBU', 'Strong non-nucleophilic base', 'E2 strongly favored'],
          ],
        },
      ],
      mcqs: [
        {
          question: 'Which anti-periplanar H is abstracted in E2 of trans-1-bromo-4-methylcyclohexane with KOH?',
          options: [
            'Any equatorial H on C2 or C6',
            'Only an axial H on C2 or C6 — the anti-periplanar H must be axial when Br is axial',
            'The H on C4 (the methyl-bearing carbon)',
            'Any H in the molecule regardless of geometry',
          ],
          correct: 1,
          explanation: 'For E2 in a cyclohexane ring, the H and the leaving group must both be axial to achieve the required anti-periplanar (180°) arrangement. In the chair conformation where Br is axial, only the axial H atoms on C2 or C6 are anti-periplanar to Br. Equatorial H atoms are gauche (60°) to axial Br — they cannot participate in E2. This geometric constraint makes cyclohexane E2 reactions highly stereospecific. If no anti-axial H is available (as in some rigid polycyclic systems), E2 is blocked.',
        },
        {
          question: 'Treatment of 2-bromobutane with NaOEt/EtOH gives a major and minor alkene product. What is the major product and why?',
          options: [
            '1-Butene (less substituted) — Hofmann product, because NaOEt is small',
            '2-Butene (more substituted) — Zaitsev product, because NaOEt gives thermodynamic control',
            'Both in equal amounts — E2 does not have a regiochemical preference',
            '1-Butene — because E2 with any base gives the terminal alkene',
          ],
          correct: 1,
          explanation: 'NaOEt is a strong but not sterically bulky base → Zaitsev rule applies → more substituted alkene is major product. 2-Butene (either cis or trans) is disubstituted (two methyl groups); 1-butene is monosubstituted (one CH₂CH₃ group). The Zaitsev product (2-butene) is thermodynamically more stable (more substituted = more hyperconjugation = lower energy) and kinetically preferred with small bases. trans-2-Butene is the major product over cis-2-butene due to less steric strain.',
        },
        {
          question: 'Why does t-BuOK favor the Hofmann (less substituted) product in E2 reactions?',
          options: [
            't-BuOK is a weaker base than KOH',
            'The bulky tert-butoxy group cannot approach the more hindered internal β-H; it selectively abstracts the less hindered terminal β-H, giving the less substituted alkene',
            't-BuOK reacts only with primary substrates',
            'The Hofmann product is thermodynamically more stable',
          ],
          correct: 1,
          explanation: 'tert-Butoxide [(CH₃)₃CO⁻] has three methyl groups around the oxygen, creating a bulky base. The β-carbon adjacent to the leaving group (the internal β-carbon) has more substituents, so its H atoms are more sterically hindered. t-BuO⁻ cannot easily reach these internal H atoms. Instead, it prefers to abstract the less hindered terminal H atoms (on the primary β-carbon), giving the less substituted (terminal) alkene — the Hofmann product. This is a kinetic preference based on steric accessibility of the base.',
        },
      ],
      flashcards: [
        {
          front: 'E2 mechanism requirements',
          back: 'Rate = k[substrate][base] — bimolecular, one step\nRequirements:\n1. Strong base\n2. Good leaving group\n3. Anti-periplanar geometry (H and LG at 180°)\n\nProduct: alkene. No intermediate. Stereospecific: specific alkene geometry depends on which anti-H is abstracted.\nIn cyclohexane: must have axial-axial anti arrangement.',
        },
        {
          front: 'Zaitsev vs Hofmann elimination',
          back: 'Zaitsev (more substituted alkene): small base (KOH, NaOEt), E1 (any base — thermodynamic)\nHofmann (less substituted alkene): bulky base (t-BuOK, LDA)\n\nZaitsev product is more stable (hyperconjugation in more substituted alkene).\nHofmann product is less hindered — preferred when bulky base cannot access internal H.',
        },
        {
          front: 'E2 in cyclohexane: axial-axial rule',
          back: 'For E2 in a cyclohexane, the leaving group and the β-H must both be axial to achieve anti-periplanar (180°) geometry. The chair must be drawn with both groups axial.\n\nIf the leaving group is equatorial: the ring must flip to put LG axial before E2 can occur (and the competing axial H must also be available on the adjacent carbon).',
        },
        {
          front: 'Which reagents favor E2 over SN2?',
          back: 'Favor E2: strong bases (KOH, NaOEt, t-BuOK), especially with tertiary or secondary substrates; high temperature; bulky base (t-BuOK)\n\nFavor SN2: strong nucleophiles that are weak bases (I⁻, CN⁻, RS⁻, RO⁻ in polar aprotic), primary substrates, low temperature\n\nKey: the same reagent can do both. The substrate class is the most important predictor.',
        },
      ],
    },

    // ── Concept 2: E1 Mechanism & E1 vs E2 Competition ──────────────────────
    {
      id: 'ch07-c2-e1',
      title: 'E1 Mechanism & Predicting Elimination vs Substitution',
      subtitle: 'Carbocation route, Zaitsev products, and the full competition',
      estimatedMinutes: 12,
      accentHex: '#10b981',
      blocks: [
        {
          type: 'text',
          body: 'E1 (Elimination Unimolecular) shares its first step with SN1: the leaving group departs to form a carbocation. But instead of a nucleophile attacking the carbocation, a base abstracts an adjacent β-hydrogen, forming the alkene. Because the rate-determining step is the same ionization step as SN1, E1 and SN1 always compete when both are possible. The selectivity between them depends on whether the nucleophile or the base is more reactive toward the carbocation.',
        },
        {
          type: 'table',
          headers: ['Feature', 'E1', 'SN1'],
          rows: [
            ['First step', 'Ionization: RX → R⁺ + X⁻ (same)', 'Ionization: RX → R⁺ + X⁻ (same)'],
            ['Second step', 'Base removes β-H → alkene forms', 'Nucleophile attacks carbocation → substitution product'],
            ['Rate law', 'rate = k[RX] (unimolecular)', 'rate = k[RX] (unimolecular)'],
            ['Substrate', 'Tertiary > secondary >> primary', 'Tertiary > secondary >> primary'],
            ['Temperature effect', 'High temperature favors E1 over SN1', 'Lower temperature favors SN1'],
            ['Stereochemistry', 'Zaitsev product (thermodynamic)', 'Racemization'],
            ['Rearrangements', 'Yes — carbocation can rearrange', 'Yes — same intermediate'],
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Temperature as the E1/SN1 Switch',
          body: 'When both E1 and SN1 can occur (tertiary substrate, polar protic solvent, weak base/nucleophile):\n• Higher temperature: favors E1 (elimination — more disordered TS, positive ΔS)\n• Lower temperature: favors SN1 (substitution)\n\nEntropy explains this: elimination produces two molecules from one (substrate + base → alkene + small acid), while substitution produces one product. Higher entropy products are favored at high temperature (ΔG = ΔH − TΔS, more negative when T and ΔS are large).',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Decision Tree: Which Reaction Occurs?',
          body: 'Step 1 — Substrate class?\n• Methyl or 1°: E2 or SN2 only (no E1/SN1)\n• 2° or 3°: E1, E2, SN1, or SN2 all possible\n\nStep 2 — Reagent?\n• Strong base + polar aprotic + 1° substrate → SN2\n• Strong base + polar aprotic + 3° substrate → E2 (SN2 blocked)\n• Strong, bulky base (t-BuOK) → E2 (Hofmann)\n• Weak base/nucleophile + polar protic + 3° → SN1/E1 (depends on T)\n• Strong nucleophile + weak base (I⁻, CN⁻) + 2° substrate → SN2\n\nStep 3 — Temperature?\n• High T → favors elimination; low T → favors substitution\n\nRemember: SN2 and E2 compete; SN1 and E1 compete. SN2 and SN1 compete only at secondary substrates.',
        },
      ],
      mcqs: [
        {
          question: 'Treatment of tert-butyl bromide with warm water gives primarily tert-butanol (SN1 product). What conditions would shift the outcome to give more isobutylene (E1 product)?',
          options: [
            'Using cold water and a polar aprotic solvent',
            'Adding a strong base and increasing the temperature',
            'Using concentrated sodium iodide',
            'Decreasing the concentration of tert-butyl bromide',
          ],
          correct: 1,
          explanation: 'E1 competes with SN1 from the same carbocation intermediate. To favor E1 over SN1: (1) Increase temperature — entropy favors the two-product elimination pathway at high T; (2) Add a weak base to assist H⁺ removal from the carbocation; (3) Dilute nucleophile conditions make substitution less favorable. Adding a strong base (option B) could even convert the reaction to E2 at high temperature. The key shift: warm conditions and added base tip the balance from SN1 → E1.',
        },
        {
          question: 'E1 and SN1 share the same rate-determining step. This means:',
          options: [
            'E1 is always faster than SN1 because it makes two products',
            'Changing the nucleophile concentration changes the rate of both E1 and SN1',
            'Adding more of the base or nucleophile does NOT change the overall rate of either E1 or SN1',
            'The two reactions must give the same product',
          ],
          correct: 2,
          explanation: 'Since E1 and SN1 share the rate-limiting ionization step (RX → R⁺ + X⁻), the overall rate for the competing reactions is the same function: rate = k[RX]. Adding more nucleophile does NOT speed up SN1 (or E1) — these are unimolecular reactions. Once the carbocation forms, it rapidly reacts with whatever is available (nucleophile for SN1, base for E1). The ratio of E1/SN1 products can be changed (by adding more base, changing temperature) but the overall rate is unchanged.',
        },
        {
          question: 'Can a primary (1°) alkyl halide undergo E1 elimination?',
          options: [
            'Yes — primary substrates undergo E1 as readily as SN1',
            'No — E1 (like SN1) requires a stable carbocation intermediate, and 1° carbocations are too unstable to form under normal conditions',
            'Yes — E1 from 1° substrates gives the Hofmann product',
            'Only if the solvent is polar aprotic',
          ],
          correct: 1,
          explanation: 'E1 requires formation of a carbocation intermediate in the first step. Primary carbocations (RCH₂⁺) are extremely high energy and do not form under normal solvolysis conditions. Therefore, E1 is restricted to secondary and especially tertiary substrates (and allylic/benzylic cases). Primary substrates that undergo elimination do so via E2 only (which requires a strong base but no carbocation intermediate). This mirrors the restriction on SN1: both SN1 and E1 require stable carbocations.',
        },
      ],
      flashcards: [
        {
          front: 'E1 vs E2: comparison',
          back: 'E1: rate = k[RX]; stepwise (carbocation intermediate); Zaitsev product; 3° > 2°; polar protic solvent; weak base; rearrangements possible; no stereospecificity at β-H\n\nE2: rate = k[RX][base]; concerted (no intermediate); Zaitsev (small base) or Hofmann (bulky base); all substrates possible; anti-periplanar requirement; no rearrangements; stereospecific',
        },
        {
          front: 'SN2 vs E2: which wins?',
          back: 'Key factors:\n• Substrate: 1° favors SN2; 3° with strong base → E2 (SN2 blocked); 2° → both compete\n• Base/nucleophile: strong small base → can do both; bulky base (t-BuOK) → E2 only; strong Nu but weak base (I⁻, CN⁻) → SN2\n• Temperature: high T → E2; low T → SN2\n\nRule of thumb: tertiary + strong base → E2 always. Primary + strong nucleophile + polar aprotic → SN2 always.',
        },
        {
          front: 'Why does high temperature favor elimination over substitution?',
          back: 'Thermodynamics: ΔG = ΔH − TΔS. Elimination produces two molecules from one (alkene + HX or H₂O), giving a positive ΔS (entropy increase). At high temperature, the −TΔS term becomes more negative (more favorable), lowering ΔG for elimination.\n\nSubstitution produces only one new molecule — smaller entropy gain. As temperature rises, elimination becomes progressively more favorable relative to substitution.',
        },
      ],
    },
  ],
}
