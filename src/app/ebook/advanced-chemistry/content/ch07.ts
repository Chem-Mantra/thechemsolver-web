import type { AdvChapter } from '../types'

export const CH07: AdvChapter = {
  id: 'ch07',
  number: 7,
  title: 'Solid State Chemistry',
  examRelevance: 'Small but real — appears specifically at USNCO National/IChO level, not at AP/Local',
  accentHex: '#f59e0b',
  concepts: [

    // ── Concept 1: Packing Efficiency & Unit Cell Density ───────────────────────
    {
      id: 'ch07-c1-packing-density',
      title: 'Packing Efficiency & Unit Cell Density',
      subtitle: 'Connecting crystal geometry to a measurable bulk property',
      estimatedMinutes: 12,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'A unit cell\'s geometry determines exactly how much of its volume is actually filled by atoms versus empty space — and that packing efficiency, combined with the unit cell\'s edge length, gives a direct route to the crystal\'s bulk density, one of the few solid-state properties measurable in an ordinary lab.',
        },
        {
          type: 'table',
          headers: ['Cell type', 'Atoms per cell (Z)', 'Edge length vs. radius', 'Packing efficiency'],
          rows: [
            ['Simple cubic (SC)', '1', 'a = 2r', '52.4%'],
            ['Body-centered cubic (BCC)', '2', 'a = 4r/√3', '68.0%'],
            ['Face-centered cubic (FCC/CCP)', '4', 'a = 2√2r', '74.0%'],
          ],
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Where Do Atoms Actually Touch?',
          body: 'The edge-length relationship depends entirely on which direction atoms physically contact each other: along the cell edge (simple cubic), along the body diagonal (BCC), or along the face diagonal (FCC) — never along an edge for FCC, since corner atoms don\'t touch there. Deriving a vs. r always starts by identifying that contact direction.',
        },
        {
          type: 'formula',
          latex: 'd = \\dfrac{Z \\times M}{N_A \\times a^3}',
          display: true,
          caption: 'Unit cell density: Z = atoms per cell, M = molar mass, NA = Avogadro\'s number, a = edge length',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'HCP and FCC Are Secretly the Same Packing',
          body: 'Hexagonal close packing (HCP) and cubic close packing (FCC/CCP) both achieve 74.0% packing efficiency despite looking geometrically different — both are built from the same close-packed layers, just stacked in a different repeating sequence (ABAB... for HCP vs. ABCABC... for FCC).',
        },
      ],
      mcqs: [
        {
          question: 'A metal crystallizes in a face-centered cubic lattice with edge length a = 400 pm and molar mass 63.5 g/mol. What is Z for this cell, and what does it represent?',
          options: [
            'Z = 1; one atom touches at each corner',
            'Z = 2; two atoms fully inside the cell',
            'Z = 4; the effective number of atoms belonging entirely to one unit cell in FCC',
            'Z = 8; all corner and face atoms counted fully',
          ],
          correct: 2,
          explanation: 'FCC has atoms at 8 corners (each contributing 1/8) and 6 face centers (each contributing 1/2): Z = 8(1/8) + 6(1/2) = 1 + 3 = 4.',
        },
      ],
      flashcards: [
        { front: 'Packing efficiency: SC, BCC, FCC', back: 'SC = 52.4%, BCC = 68.0%, FCC/CCP = 74.0%.' },
        { front: 'Unit cell density formula', back: 'd = ZM / (NA × a³)' },
        { front: 'HCP vs. FCC packing efficiency', back: 'Identical — both 74.0% — despite different stacking sequences (ABAB vs. ABCABC).' },
      ],
    },

    // ── Concept 2: Crystal Defects — Schottky, Frenkel & Metal Excess ───────────
    {
      id: 'ch07-c2-crystal-defects',
      title: 'Crystal Defects: Schottky, Frenkel & Metal Excess',
      subtitle: 'Real crystals are never perfect — and the imperfections are exam-testable',
      estimatedMinutes: 11,
      accentHex: '#f59e0b',
      blocks: [
        {
          type: 'text',
          body: 'Two ionic point defects dominate this topic, and they are frequently confused because both involve a displaced or missing ion — but they have opposite effects on measurable density, which is exactly how exam questions distinguish them.',
        },
        {
          type: 'table',
          headers: ['Defect', 'Mechanism', 'Effect on density', 'Favored by', 'Classic examples'],
          rows: [
            ['Schottky', 'Equal numbers of cations and anions missing entirely from the lattice', 'Decreases', 'High coordination number, similarly-sized ions', 'NaCl, KCl, CsCl'],
            ['Frenkel', 'A smaller ion (usually the cation) leaves its site and lodges in an interstitial void', 'Unchanged', 'Low coordination number, large size difference between ions', 'ZnS, AgCl, AgI'],
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'AgBr: The One Compound That Does Both',
          body: 'Silver bromide is the standard example of a compound exhibiting both defects simultaneously — Ag⁺ and Br⁻ can both leave the lattice entirely (Schottky), and the small, mobile Ag⁺ ion also readily slips into interstitial sites (Frenkel). If an exam asks "which compound shows both Frenkel and Schottky defects," the expected answer is almost always AgBr.',
        },
        {
          type: 'text',
          body: 'Metal excess defects arise when an anion is missing from its lattice site, leaving behind a "trapped" electron in that vacancy to maintain charge balance. This trapped electron can absorb visible light and re-emit at a different wavelength, which is why alkali halide crystals with this defect — called F-centers, from the German Farbzentrum, "color center" — become visibly colored (e.g., NaCl heated in sodium vapor turns yellow).',
        },
      ],
      mcqs: [
        {
          question: 'A crystal shows a Frenkel defect. What happens to its measured density compared to a perfect crystal?',
          options: [
            'Density decreases significantly',
            'Density remains essentially unchanged',
            'Density increases significantly',
            'Density becomes impossible to measure',
          ],
          correct: 1,
          explanation: 'In a Frenkel defect, the displaced ion stays within the crystal (just in an interstitial site) rather than leaving entirely, so both mass and volume are unchanged — density stays constant, unlike Schottky defects where ions actually leave the lattice.',
        },
      ],
      flashcards: [
        { front: 'Schottky defect: effect on density', back: 'Decreases — ions are missing entirely, so mass drops while volume stays the same.' },
        { front: 'Frenkel defect: effect on density', back: 'Unchanged — the displaced ion stays inside the crystal (interstitial site), so mass and volume are both conserved.' },
        { front: 'F-centers', back: 'Anion vacancies with a trapped electron in place of the missing ion — responsible for color in defect alkali halide crystals.' },
      ],
    },

  ],
}
