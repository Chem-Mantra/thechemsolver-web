import type { OrgoChapter } from '../types'

export const CH13: OrgoChapter = {
  id: 'ch13',
  number: 13,
  title: 'Electrophilic Aromatic Substitution',
  orgo: 2,
  accentHex: '#a855f7',
  concepts: [

    // ── Concept 1: EAS Mechanism ──────────────────────────────────────────────
    {
      id: 'ch13-c1-mechanism',
      title: 'EAS General Mechanism',
      subtitle: 'Arenium ion (σ complex), rate-determining step, and regioselectivity',
      estimatedMinutes: 12,
      accentHex: '#a855f7',
      blocks: [
        {
          type: 'text',
          body: 'Electrophilic aromatic substitution (EAS) is the defining reaction of aromatic compounds. Instead of electrophilic addition (which would destroy aromaticity), benzene undergoes substitution — the electrophile replaces one H, and aromaticity is restored. The mechanism is two-step: (1) the electrophile attacks the ring, forming a carbocation intermediate called the arenium ion (Wheland intermediate, σ complex); (2) the base removes a proton from the ring carbon, restoring aromaticity.',
        },
        {
          type: 'list',
          variant: 'numbered',
          items: [
            'STEP 1 (Rate-determining): electrophile (E⁺) attacks one carbon of the benzene ring, using the ring π electrons. This forms a sigma bond with loss of aromaticity → arenium ion (the remaining 4 π electrons are delocalized over the other 5 ring carbons as 3 resonance structures).',
            'STEP 2 (Fast): a base (usually the conjugate base of the electrophile, e.g., FeBr₄⁻ or BF₄⁻) abstracts the H⁺ from the carbon bearing E⁺. The electrons from C–H form the new π bond restoring aromaticity → substitution product.',
          ],
        },
        {
          type: 'table',
          headers: ['Reaction', 'Electrophile generated', 'Reagents', 'Catalyst'],
          rows: [
            ['Halogenation (Br)', 'Br⁺ (from Br–FeBr₃ → Br⁺ FeBr₄⁻)', 'Br₂ + FeBr₃', 'FeBr₃ (Lewis acid)'],
            ['Halogenation (Cl)', 'Cl⁺ (from Cl–FeCl₃ → Cl⁺ FeCl₄⁻)', 'Cl₂ + FeCl₃', 'FeCl₃'],
            ['Nitration', 'NO₂⁺ (nitronium ion)', 'HNO₃ + H₂SO₄', 'H₂SO₄ protonates HNO₃ → NO₂⁺ + H₂O + HSO₄⁻'],
            ['Sulfonation', 'SO₃ or HSO₃⁺', 'H₂SO₄ (fuming/oleum)', 'Reversible; high T → desulfonation'],
            ['Friedel-Crafts alkylation', 'R⁺ (carbocation)', 'RX + AlCl₃', 'AlCl₃ (Lewis acid); problems: rearrangements, polyalkylation'],
            ['Friedel-Crafts acylation', 'RCO⁺ (acylium ion)', 'RCOCl or (RCO)₂O + AlCl₃', 'AlCl₃; NO rearrangement (acylium stable); followed by reduction for alkyl'],
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Friedel-Crafts Alkylation: Three Major Problems',
          body: '1. Carbocation rearrangements: the carbocation R⁺ can rearrange before attacking (e.g., n-propyl → isopropyl carbocation via H-shift). The product often has a rearranged carbon skeleton.\n\n2. Polyalkylation: the alkylated product is MORE reactive than benzene (alkyl groups are EDGs). Once one R group is added, the ring reacts faster than unreacted benzene → multiple alkylation.\n\n3. Does not work with deactivated rings: rings bearing EWG (NO₂, CF₃, COOH) are too electron-poor for EAS.\n\nSolution: Friedel-Crafts ACYLATION avoids all three problems. Acylium ion (RCO⁺) is stabilized and doesn\'t rearrange. The product (aryl ketone) is deactivated (C=O is EWG) → no polyacylation. The ketone can then be reduced to alkyl group (Clemmensen: Zn/Hg, HCl; Wolff-Kishner: H₂NNH₂, KOH, heat).',
        },
      ],
      mcqs: [
        {
          question: 'In EAS, why does benzene undergo SUBSTITUTION rather than ADDITION across the double bond?',
          options: [
            'Benzene is too stable to react with electrophiles at all',
            'Addition would generate a non-aromatic cyclohexadienyl cation that is too unstable; substitution restores aromaticity (150 kJ/mol resonance energy recovered)',
            'Benzene\'s bonds are too long for addition to occur',
            'The electrophile is not reactive enough for addition',
          ],
          correct: 1,
          explanation: 'The two-step mechanism forms the arenium ion (sp³ carbon, non-aromatic) in step 1. Step 2 has two options: (a) a nucleophile attacks → addition product (cyclohexadienyl, non-aromatic, no resonance stabilization); or (b) loss of H⁺ → restoration of aromaticity. Recovery of the 150 kJ/mol aromatic stabilization energy provides a powerful thermodynamic driving force for elimination of H⁺ (step 2 of EAS) over addition. The addition product retains no aromatic stabilization; the substitution product does. Aromaticity preservation wins.',
        },
        {
          question: 'Why does nitration of benzene require both HNO₃ AND H₂SO₄?',
          options: [
            'H₂SO₄ acts as a solvent for the reaction',
            'H₂SO₄ protonates HNO₃ to generate the electrophilic nitronium ion (NO₂⁺): HNO₃ + H₂SO₄ → NO₂⁺ + H₂O + HSO₄⁻. NO₂⁺ is the actual electrophile in nitration',
            'H₂SO₄ catalyzes the decomposition of NO₂⁺ before it reacts',
            'Both acids together create a stronger reducing environment for the ring',
          ],
          correct: 1,
          explanation: 'H₂SO₄ is a stronger acid than HNO₃ (H₂SO₄: pKa −3; HNO₃: pKa −1.3). H₂SO₄ protonates HNO₃ on its carbonyl oxygen → gives H₂NO₃⁺ → H₂O leaves → nitronium ion NO₂⁺. NO₂⁺ is a powerful electrophile (linear, empty orbital, full positive charge). Without H₂SO₄, HNO₃ would not generate enough NO₂⁺ for efficient reaction with benzene. The mixture is called "mixed acid" or "nitrating mixture".',
        },
        {
          question: 'Friedel-Crafts acylation of benzene with acetyl chloride (CH₃COCl) and AlCl₃ gives acetophenone (C₆H₅COCH₃). Why doesn\'t polyacylation occur?',
          options: [
            'AlCl₃ is consumed in the first acylation and cannot catalyze a second',
            'The acetophenone product has a deactivating C=O group (meta director, EWG). The ring is less reactive than starting benzene → further acylation is much slower',
            'Acylium ions are too bulky for a second attack',
            'Acetophenone is insoluble and precipitates out of solution',
          ],
          correct: 1,
          explanation: 'The product acetophenone has a C=O group directly attached to the ring (an aryl ketone). The carbonyl is an EWG — it deactivates the ring by withdrawing electrons through resonance and induction. Deactivated rings react far more slowly in EAS than benzene. Since benzene (the starting material) is more reactive than acetophenone (the product), benzene is consumed preferentially. This self-limiting feature makes Friedel-Crafts acylation synthetically superior to alkylation: you get clean monosubstitution. Compare alkyl groups (EDGs) which activate the ring → polyalkylation is hard to prevent.',
        },
      ],
      flashcards: [
        {
          front: 'EAS general mechanism (2 steps)',
          back: 'Step 1 (SLOW, rate-determining): E⁺ attacks ring carbon → σ bond forms → arenium ion (carbocation, non-aromatic, 4π delocalized over 5 carbons)\nStep 2 (FAST): base removes H⁺ from the sp³ carbon → aromaticity restored → net substitution\n\nResult: H replaced by E. Aromaticity is preserved. This is why aromatic compounds react by substitution, not addition.',
        },
        {
          front: 'Five common EAS reactions and their electrophiles',
          back: '1. Halogenation: X₂/FeX₃ → X⁺ equivalent\n2. Nitration: HNO₃/H₂SO₄ → NO₂⁺ (nitronium)\n3. Sulfonation: H₂SO₄ (fuming) → SO₃ or HSO₃⁺\n4. FC alkylation: RX/AlCl₃ → R⁺ (carbocation, rearranges!)\n5. FC acylation: RCOCl/AlCl₃ → RCO⁺ (acylium, stable, no rearrangement)',
        },
        {
          front: 'Friedel-Crafts acylation vs alkylation: why acylation is preferred',
          back: 'FC alkylation problems: (1) carbocation rearrangements, (2) polyalkylation, (3) fails for deactivated rings\n\nFC acylation advantages: (1) acylium ion is stabilized (C≡O⁺ resonance structure), no rearrangement; (2) product is deactivated (no polyacylation); (3) Clemmensen or Wolff-Kishner reduction converts ArCOR → ArCH₂R afterward\n\nSynthesis rule: to make ArCH₂R, do acylation then reduce. Don\'t use alkylation.',
        },
      ],
    },

    // ── Concept 2: Directing Effects in EAS ───────────────────────────────────
    {
      id: 'ch13-c2-directing',
      title: 'Directing Effects & Ring Activation',
      subtitle: 'ortho/para vs meta directors — activating vs deactivating',
      estimatedMinutes: 14,
      accentHex: '#a855f7',
      blocks: [
        {
          type: 'text',
          body: 'When a substituent is already on a benzene ring, it controls where the next electrophile adds — this is the directing effect. Substituents fall into two categories: those that direct to ortho and para positions, and those that direct to meta positions. Additionally, substituents either activate the ring (make it more reactive than benzene) or deactivate it (less reactive). Understanding this determines product regiochemistry and is essential for synthesis planning.',
        },
        {
          type: 'table',
          headers: ['Substituent', 'Direction', 'Activation/Deactivation', 'Mechanism'],
          rows: [
            ['–OH, –OR', 'ortho/para', 'Strongly activating', 'O lone pair → resonance donation into ring at o/p positions'],
            ['–NH₂, –NHR, –NR₂', 'ortho/para', 'Strongly activating', 'N lone pair → resonance donation (stronger than O)'],
            ['–F, –Cl, –Br, –I', 'ortho/para', 'Deactivating (weakly)', 'X lone pair → resonance donation (o/p dir) but X electronegative → inductive withdrawal (deactivating)'],
            ['–CH₃, –C₂H₅, alkyl', 'ortho/para', 'Weakly activating', 'Hyperconjugation / weak induction (electron donation)'],
            ['–NO₂, –CF₃, –CCl₃', 'meta', 'Strongly deactivating', 'Strong EWG by resonance; depletes o/p positions most; meta is least-deactivated'],
            ['–COOH, –COOR, –CHO, –COCH₃', 'meta', 'Deactivating', 'Carbonyl EWG by resonance; withdraws from o/p'],
            ['–SO₃H', 'meta', 'Deactivating', 'S=O acts as EWG analogous to carbonyl'],
            ['–CN', 'meta', 'Deactivating', 'Nitrile EWG by resonance'],
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'The Logic Behind Directing Effects',
          body: 'The arenium ion intermediate determines the regiochemistry. Compare the stability of the arenium ion for electrophile attack at ortho/para vs meta:\n\nFor an EDG (e.g., –OH): ortho and para attack give an arenium ion where the + charge can be delocalized onto the oxygen → extra stabilization. Meta attack does NOT place + charge on O. → ortho/para preferred.\n\nFor an EWG (e.g., –NO₂): ortho and para attack place + charge adjacent to or on the EWG → destabilization. Meta attack avoids placing + charge directly next to EWG → meta is least bad (still deactivated, but less so than ortho/para).\n\nKey memory: EDG = activates + ortho/para. EWG = deactivates + meta.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Halogens: The Deactivating ortho/para Directors',
          body: 'Halogens are the only common EWG that are ortho/para directors. Why? Two competing effects:\n\n1. Inductive effect (σ bonds): electronegativity of X withdraws electrons through σ bonds → DEACTIVATES the ring (makes EAS slower)\n\n2. Resonance effect (π system): lone pair of X donates into the ring at ortho and para positions → ACTIVATES specifically at o/p, DIRECTS to ortho/para\n\nNet: halogen is a net deactivator (slower reaction than benzene) but an ortho/para director (because resonance donation, though weak, preferentially stabilizes the arenium ion from o/p attack). This is the famous split personality of halogens in EAS.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Predicting Products with Two Substituents',
          body: 'When two substituents are on a ring, both direct incoming electrophile:\n\nRule 1: If both groups direct to the SAME position → that position is favored\nRule 2: If groups direct to DIFFERENT positions → the stronger activator (or weaker deactivator) wins\nRule 3: Products where E would be between two groups are often disfavored (steric effects)\n\nExample: m-nitroaniline\n• –NH₂ at C1: directs to C2(ortho), C4(para), C6(ortho) [strongly activating]\n• –NO₂ at C3: directs to C5(meta to NO₂)\n• NH₂ wins (stronger activator) → product at C4 (para to NH₂, meta to NO₂)',
        },
      ],
      mcqs: [
        {
          question: 'Chlorobenzene undergoes EAS more slowly than benzene, but faster than nitrobenzene. What is the major product of chlorobenzene + HNO₃/H₂SO₄?',
          options: [
            'Meta-chloronitrobenzene — Cl is meta director',
            'Para-chloronitrobenzene (major) and ortho-chloronitrobenzene (minor) — Cl is ortho/para director',
            'No reaction — Cl deactivates ring too much',
            'Chlorobenzene gives equal amounts of o, m, and p products',
          ],
          correct: 1,
          explanation: 'Chlorine is an ortho/para director (lone pairs donate to ring via resonance at o/p positions, stabilizing the arenium ion from o/p attack) despite being an overall deactivator (electronegative Cl withdraws via induction). Products are ~60% para + ~38% ortho + ~2% meta. Para product is major (avoiding steric interaction with Cl, and p gives most stable arenium ion). Nitrobenzene is far more deactivated (meta director, NO₂ withdraws strongly by resonance) — much slower than chlorobenzene.',
        },
        {
          question: 'Why does anisole (methoxybenzene, C₆H₅–OCH₃) react with Br₂/FeBr₃ much faster than benzene?',
          options: [
            'The OCH₃ group is an EWG that makes the ring more reactive',
            'The OCH₃ oxygen lone pair donates electrons into the ring via resonance, strongly activating the ring (especially ortho and para positions) and lowering the transition state for arenium ion formation',
            'FeBr₃ reacts preferentially with OCH₃ compounds',
            'Anisole has a lower molecular weight than benzene, making diffusion faster',
          ],
          correct: 1,
          explanation: 'The OCH₃ group has an oxygen with lone pairs that can donate into the ring via resonance. Drawing the resonance structures: –O–C₆H₅ ↔ ⁺O=C, placing extra electron density at ortho and para positions. This makes the ring an electron-rich π nucleophile, attacking electrophiles (E⁺) much faster. The arenium ion from o/p attack on anisole has an extra resonance structure with oxygen bearing a + charge but still with a complete octet — significantly stabilized. Anisole reacts 10⁸ times faster than nitrobenzene and much faster than benzene.',
        },
        {
          question: 'Which product is the major product from Friedel-Crafts acylation of toluene (methylbenzene) with CH₃COCl/AlCl₃?',
          options: [
            'meta-methylacetophenone — because methyl is meta director',
            'para-methylacetophenone (4-methylacetophenone) — major product; methyl is ortho/para director, para preferred over ortho for steric reasons',
            'ortho-methylacetophenone is major — adjacent substitution favored',
            'No reaction — toluene is deactivated by the methyl group',
          ],
          correct: 1,
          explanation: 'Methyl group (alkyl) is an ortho/para director (weak activator via hyperconjugation). Toluene reacts faster than benzene. In Friedel-Crafts acylation, the ortho and para positions are both directed, but: (1) para position avoids steric crowding with the existing methyl; (2) para attack gives a less sterically hindered arenium ion. Major product: 4-methylacetophenone (para-methylacetophenone). The ortho product forms as minor product. No meta product (meta would only form from meta-directing groups like EWG).',
        },
      ],
      flashcards: [
        {
          front: 'Directing effects summary table',
          back: 'ortho/para DIRECTORS (EDG or resonance EDG):\nStrong activators: –OH, –OR, –NH₂, –NHR, –NR₂\nWeak activators: alkyl groups (–CH₃, –Et)\nDeactivating o/p: –F, –Cl, –Br, –I (lone pair resonance donation, but electronegative)\n\nmeta DIRECTORS (all are deactivators):\n–NO₂, –CF₃, –NR₃⁺, –SO₃H, –COOH, –COOR, –CHO, –COR, –CN',
        },
        {
          front: 'Why are halogens the deactivating ortho/para directors?',
          back: 'Halogens have both inductive (-I) and resonance effects on the ring:\n• Inductive withdrawal (−I): electronegative X pulls σ electrons → DEACTIVATES ring (slower EAS)\n• Resonance donation (+R): X lone pairs donate to ring at o/p → DIRECTS to ortho/para\n\nNet: X is a deactivating ortho/para director — slow reaction (deactivated) but the small amount of product is mostly ortho + para.',
        },
        {
          front: 'How to predict EAS product regiochemistry with two ring substituents',
          back: '1. Draw the ring and all directing arrows for each substituent\n2. Find positions directed by BOTH groups → major product\n3. If groups direct to different positions → stronger activator wins\n4. Avoid sterically crowded positions (between two substituents at 1,2 positions)\n\nExample: p-nitroaniline: NO₂ at C4 (meta director) + NH₂ at C1 (strong o/p activator). NH₂ wins → C2 (ortho to NH₂, meta to NO₂). Also C6 is directed.',
        },
      ],
    },
  ],
}
