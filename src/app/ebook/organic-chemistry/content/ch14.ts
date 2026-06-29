import type { OrgoChapter } from '../types'

export const CH14: OrgoChapter = {
  id: 'ch14',
  number: 14,
  title: 'Nucleophilic Aromatic Substitution',
  orgo: 2,
  accentHex: '#a855f7',
  concepts: [

    // ── Concept 1: SNAr Mechanism ─────────────────────────────────────────────
    {
      id: 'ch14-c1-snar',
      title: 'SNAr: Addition-Elimination Mechanism',
      subtitle: 'Meisenheimer complex and the role of electron-withdrawing groups',
      estimatedMinutes: 12,
      accentHex: '#a855f7',
      blocks: [
        {
          type: 'text',
          body: 'Under normal conditions, aryl halides (PhX) are completely inert to SN2 and SN1 because: (a) the sp² carbon cannot undergo backside attack (SN2 impossible), and (b) aryl cations are extremely unstable. However, when strongly electron-withdrawing groups (EWG like –NO₂) are present ortho or para to the leaving group, nucleophilic aromatic substitution (NAS or SNAr) becomes possible through an addition-elimination mechanism.',
        },
        {
          type: 'list',
          variant: 'numbered',
          items: [
            'STEP 1 — Addition (rate-determining): the nucleophile (Nu:⁻) attacks the ipso carbon (the one bearing the leaving group, LG) to form a cyclohexadienyl anion intermediate called the Meisenheimer complex. The ring becomes sp³ at the attacked carbon and is no longer aromatic.',
            'STEP 2 — Elimination (fast): the leaving group (X⁻, typically halide) departs as the carbanion, restoring aromaticity. The Meisenheimer complex is stabilized by delocalization of the negative charge — especially onto EWG groups at ortho and para positions.',
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Requirements for SNAr',
          body: '1. One or more strongly EWG groups ortho or para to the leaving group (–NO₂ is the classic; also –CN, –COOR, –CF₃; multiple EWG groups dramatically accelerate the reaction)\n2. A good nucleophile (Nu⁻ or neutral Nu with lone pair: RO⁻, RS⁻, NHR₂, NH₃, HO⁻)\n3. A reasonable leaving group (F is actually the BEST leaving group in SNAr — opposite of normal SN2!)\n\nWhy F is best leaving group in SNAr: the step that matters in SNAr is the formation of the Meisenheimer complex (step 1). F is the most electronegative halogen — it stabilizes the adjacent carbanion in the Meisenheimer complex most effectively (inductive stabilization). The actual C–F bond breaking in step 2 is fast and not rate-determining. Compare SN2: the C–F bond is strongest → F is worst leaving group in SN2.',
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'The Meisenheimer Complex: A Relay Station',
          body: 'The Meisenheimer complex is like a relay station in a race. The nucleophile arrives first (step 1), temporarily disrupting aromaticity — the ring holds the negative charge at the relay station, stabilized by the electron-withdrawing group nearby. Then the leaving group picks up the baton and departs (step 2), restoring the aromatic ring.\n\nThe relay station (Meisenheimer complex) is more stable when there\'s a big "receiving antenna" for the negative charge — that\'s the EWG (especially nitro groups). With no EWG, the relay station is too unstable to form at all. With two ortho-nitro groups, the relay station is so stable that SNAr is fast even at room temperature.',
        },
        {
          type: 'table',
          headers: ['Compound', 'EWG present', 'Relative SNAr rate', 'Notes'],
          rows: [
            ['Chlorobenzene (PhCl)', 'None', 'Essentially zero', 'Requires >300°C and high pressure (Dow process)'],
            ['2-Chloronitrobenzene (o-Cl, o-NO₂)', 'One NO₂ (ortho)', '~10⁶ relative to PhCl', 'Reacts with hot NaOH'],
            ['4-Chloronitrobenzene (p-Cl, p-NO₂)', 'One NO₂ (para)', '~10⁶ relative to PhCl', 'Similar to ortho isomer'],
            ['2-Chloro-4,6-dinitrobenzene', 'Two NO₂ groups', '~10¹² relative to PhCl', 'Very fast; reacts at RT with amines'],
            ['1-Fluoro-2,4-dinitrobenzene (Sanger\'s reagent)', 'Two NO₂ groups + F (best LG)', 'Very fast', 'Used for N-terminal amino acid labeling'],
          ],
        },
      ],
      mcqs: [
        {
          question: 'Why does 1-fluoro-4-nitrobenzene react faster in SNAr than 1-chloro-4-nitrobenzene?',
          options: [
            'Fluorine is a better leaving group than chlorine in all reactions',
            'In SNAr, the rate-determining step is formation of the Meisenheimer complex (addition). The more electronegative F stabilizes the developing carbanion by inductive withdrawal in the TS, lowering the activation energy for step 1',
            'Chlorine is larger and more sterically hindered',
            'Fluorine forms stronger hydrogen bonds with the nucleophile',
          ],
          correct: 1,
          explanation: 'In SNAr, the rate-determining step is nucleophilic addition to form the Meisenheimer complex (step 1), NOT departure of the leaving group (step 2). F is more electronegative than Cl — it inductively stabilizes the partial negative charge developing on the ring carbon in the TS for step 1. This lowers Ea for the addition step → faster reaction. In step 2 (breaking C–X bond), F leaves more slowly than Cl (stronger C–F bond), but since step 2 is fast and not rate-determining, this doesn\'t matter. SNAr reactivity: F > Cl > Br > I (exact opposite of SN2!).',
        },
        {
          question: 'What is the Meisenheimer complex in SNAr?',
          options: [
            'The electrophilic intermediate before the nucleophile attacks',
            'A carbocation intermediate formed after the leaving group departs',
            'A cyclohexadienyl carbanion formed after nucleophile addition to the aromatic ring, stabilized by adjacent EWG, with the attacked carbon now sp³',
            'The final aromatic product with the new substituent',
          ],
          correct: 2,
          explanation: 'The Meisenheimer complex is the anionic sigma complex (σ complex) — a cyclohexadienyl carbanion formed in step 1 of SNAr when the nucleophile adds to the arene. The attacked carbon becomes sp³; the remaining 4 π electrons are delocalized over the other ring carbons. The negative charge in the Meisenheimer complex is stabilized by resonance onto EWG groups at ortho and para positions relative to the point of nucleophilic attack. This is in contrast to the arenium ion (cationic sigma complex) in EAS. The Meisenheimer complex has been isolated and characterized by X-ray crystallography.',
        },
        {
          question: 'Can SNAr occur when the EWG is META to the leaving group?',
          options: [
            'Yes — any EWG position can stabilize SNAr',
            'No — a meta EWG cannot stabilize the Meisenheimer complex by resonance; only ortho or para EWG can place negative charge directly on the EWG in resonance structures',
            'Meta EWG actually accelerates SNAr more than ortho/para',
            'Meta EWG has no effect on SNAr rate',
          ],
          correct: 1,
          explanation: 'The Meisenheimer complex has its negative charge delocalized over the ring. The resonance structures place the negative charge at C1 (attacked), C3 (ortho to C1), and C5 (para to C1). An EWG at C2 or C6 (ortho to LG, which = ortho/para to the attacked C1) can accept the negative charge by resonance, stabilizing the complex. An EWG at C4 (meta to LG = ortho or para to the nucleophile site) also stabilizes. A meta-to-LG EWG position does NOT align with where the negative charge sits in the Meisenheimer → cannot stabilize by resonance → no SNAr acceleration. This is the exact mirror image of EAS (where meta EWGs deactivate by the same logic).',
        },
      ],
      flashcards: [
        {
          front: 'SNAr mechanism: addition-elimination',
          back: 'Step 1 (SLOW): Nu⁻ attacks ipso carbon → Meisenheimer complex (cyclohexadienyl carbanion, sp³ at attacked C)\nStep 2 (FAST): LG (X⁻) departs → aromaticity restored\n\nRequirements:\n• EWG at ortho or para to LG (stabilizes Meisenheimer)\n• Good Nu (anions or lone-pair nucleophiles)\n• Best LG in SNAr: F (not I!)',
        },
        {
          front: 'Why is F the BEST leaving group in SNAr but WORST in SN2?',
          back: 'SN2: rate depends on C–X bond breaking. Strongest bond = worst leaving group. C–F strongest → F worst.\n\nSNAr: rate depends on Meisenheimer complex formation (nucleophile addition, step 1). Most electronegative atom → best inductive stabilization of developing carbanion in TS → F best.\n\nCompletely opposite reactivity order:\nSN2: I > Br > Cl >> F\nSNAr: F > Cl > Br > I',
        },
        {
          front: 'What structural features make a compound reactive in SNAr?',
          back: '1. Halide (or other LG) on an aryl ring\n2. Strong EWG (especially –NO₂) at ortho or para positions to the LG\n3. More EWG = faster reaction (each –NO₂ ortho/para accelerates by ~10⁶)\n\nSanger\'s reagent (1-fluoro-2,4-dinitrobenzene, FDNB): two ortho/para NO₂ groups + F → reacts readily with amines at RT. Used to label N-terminal amino acids in peptide sequencing.',
        },
      ],
    },

    // ── Concept 2: Benzyne Mechanism & Comparison ─────────────────────────────
    {
      id: 'ch14-c2-benzyne',
      title: 'Benzyne Mechanism & Comparing NAS to EAS',
      subtitle: 'Elimination-addition via benzyne and strategic comparison',
      estimatedMinutes: 10,
      accentHex: '#a855f7',
      blocks: [
        {
          type: 'text',
          body: 'When a very strong base (like NaNH₂ or alkyllithium) reacts with an aryl halide without activating EWG groups, a completely different mechanism operates: elimination-addition via a benzyne (aryne) intermediate. Benzyne is a distorted aromatic species with an extra "triple bond" in the ring — extremely reactive and short-lived.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Benzyne Mechanism: Elimination then Addition',
          body: 'STEP 1 (Elimination): strong base (NaNH₂, NH₂⁻) abstracts an ortho H from the aryl halide. Loss of H and the halide anion from adjacent carbons forms benzyne — a strained intermediate where the two carbons have an "additional" bond (a strained σ-type overlap in the plane of the ring).\n\nSTEP 2 (Addition): the nucleophile (NH₂⁻ or NH₃) adds to one end of the new "triple bond." Because the benzyne is symmetrical (or nearly so), addition can occur at either end → two products (scrambled position of substitution).\n\nEVIDENCE for benzyne: (1) substituents on the ring scramble — the nucleophile adds with equal probability to C1 and C2 of the benzyne (ortho labeling experiments); (2) benzyne can be trapped by Diels-Alder reaction with dienes; (3) 14C labeling experiments showed position scrambling.',
        },
        {
          type: 'table',
          headers: ['Feature', 'SNAr (addition-elimination)', 'Benzyne (elimination-addition)'],
          rows: [
            ['Intermediate', 'Meisenheimer complex (anionic σ complex)', 'Benzyne (distorted aromatic intermediate)'],
            ['Base required', 'Nucleophile (moderate base okay)', 'Very strong base (NaNH₂, RLi)'],
            ['EWG required', 'Yes — ortho or para to LG', 'No — benzyne forms without EWG (in fact EWG not needed)'],
            ['Regiochemistry', 'Specific — Nu goes to ipso C (where LG was)', 'Scrambled — Nu can add to either end of the "triple bond"'],
            ['Leaving group', 'F best (stabilizes Meisenheimer)', 'Any halide (Cl, Br, I typical)'],
            ['Evidence', 'Meisenheimer isolated, X-ray confirmed', 'Position scrambling in 14C-labeled experiments, Diels-Alder trapping'],
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'EAS vs NAS: When Does Each Occur?',
          body: 'EAS (electrophilic aromatic substitution):\n• Electron-RICH aromatic ring (benzene, toluene, phenol, aniline)\n• React with ELECTROPHILES (E⁺: Br⁺, NO₂⁺, R⁺, RCO⁺)\n• Substituents: EDG activate (o/p director); EWG deactivate (meta director)\n\nNAS (nucleophilic aromatic substitution — SNAr):\n• Electron-POOR aromatic ring (with EWG ortho/para to LG)\n• React with NUCLEOPHILES (Nu⁻: RO⁻, RS⁻, NHR₂, HO⁻)\n• Requires F or other halide at ipso carbon\n\nBenzyne pathway:\n• Any aryl halide + very strong base (NaNH₂, RLi)\n• No EWG needed\n• Gives scrambled (ortho to F/Cl) products\n\nDiagnosis: EWG present + NuH → SNAr. No EWG + strong base → benzyne.',
        },
      ],
      mcqs: [
        {
          question: 'Chlorobenzene is treated with NaNH₂ in liquid ammonia. Using ¹⁴C labeling at C1 (the C–Cl carbon), both 1-aminobenzene (C1 labeled) and 2-aminobenzene (C2 labeled, but at the same carbon position) are found. What does this scrambling indicate?',
          options: [
            'SNAr mechanism — the Meisenheimer complex is forming at two different positions',
            'Benzyne mechanism — the intermediate benzyne has the extra bond between C1 and C2, and NH₂⁻ adds to either end with equal probability',
            'The reaction goes through a radical intermediate',
            'The ¹⁴C label migrates by 1,2-shifts',
          ],
          correct: 1,
          explanation: 'If the mechanism were SNAr, the nucleophile (NH₂⁻) would ONLY attack the ipso carbon (C1, where Cl is). The label would remain at C1 in the product. The observed scrambling (label found at both C1 and C2 of aniline) is diagnostic for the benzyne mechanism: Cl departs with an ortho H to form 1,2-didehydrobenzene (benzyne). NH₂⁻ then adds to either C1 or C2 of the benzyne with equal probability (the benzyne is symmetrical about the new "triple bond"). This scrambling experiment was the historical proof for the benzyne mechanism.',
        },
        {
          question: 'Which compound would react fastest with NaOMe via SNAr?',
          options: [
            'Fluorobenzene (no EWG)',
            '4-Nitrochlorobenzene (one NO₂ para to Cl)',
            '2,4-Dinitrochlorobenzene (two NO₂ groups)',
            '3-Nitrochlorobenzene (one NO₂ meta to Cl)',
          ],
          correct: 2,
          explanation: '2,4-Dinitrochlorobenzene has two –NO₂ groups: one at C2 (ortho to Cl at C1) and one at C4 (para to Cl). Both are optimally positioned to stabilize the Meisenheimer complex by resonance. Each –NO₂ group accelerates SNAr by roughly 10⁶ relative to no EWG. With two such groups, the rate acceleration is ~10¹². 4-Nitrochlorobenzene (one –NO₂ para) is next fastest. 3-Nitrochlorobenzene (meta –NO₂) is very slow (no resonance stabilization of Meisenheimer). Fluorobenzene with no EWG doesn\'t react by SNAr under normal conditions.',
        },
      ],
      flashcards: [
        {
          front: 'Benzyne mechanism: how it forms and what it gives',
          back: 'Formation: strong base (NaNH₂) abstracts ortho-H from aryl halide → carbanion → LG departs → benzyne (1,2-didehydrobenzene)\n\nBenzyne is a strained, reactive intermediate — the extra bond is a strained σ-type π bond in the ring plane.\n\nNucleophile adds to either end of the "triple bond" → scrambled (mixture of ortho isomers)\n\nIdentified by: isotope scrambling, Diels-Alder trapping with furan or cyclopentadiene',
        },
        {
          front: 'SNAr vs benzyne: choose the mechanism',
          back: 'SNAr: aryl halide + moderate nucleophile (RO⁻, RS⁻) + EWG ortho/para to LG → specific regiochemistry, no scrambling\n\nBenzyne: aryl halide + VERY STRONG base (NaNH₂, RLi) + no EWG required → scrambled products (nu at two adjacent positions)\n\nQuick test: "Is there an EWG ortho or para?" Yes → SNAr. "Is the base extremely strong (amide, alkyllithium)?" Yes + no EWG → benzyne.',
        },
        {
          front: 'Sanger\'s reagent: structure and use',
          back: '1-Fluoro-2,4-dinitrobenzene (FDNB, "Sanger\'s reagent")\nStructure: benzene ring with F at C1, NO₂ at C2 (ortho), NO₂ at C4 (para)\n\nUse: labels the free N-terminal amino group (α-amine) of a peptide by SNAr. The F is displaced, giving a 2,4-dinitrophenyl (DNP) derivative. Acid hydrolysis of the peptide then gives the labeled N-terminal amino acid (yellow color from DNP group → identified by paper chromatography).\n\nHistorical: Used by Frederick Sanger to sequence insulin (first protein sequence, 1955 Nobel Prize).',
        },
      ],
    },
  ],
}
