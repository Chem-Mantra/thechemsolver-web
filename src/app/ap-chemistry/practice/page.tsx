'use client'
import { useState } from 'react'
import MCQExam, { MCQQuestion } from '@/app/components/MCQExam'
import FRQViewer, { FRQProblem } from '@/app/components/FRQViewer'

// ── Sample AP Chemistry MCQ questions ─────────────────────────────────────────
const AP_MCQ_SAMPLE: MCQQuestion[] = [
  {
    id: 1,
    stem: 'A 0.100 M solution of a weak acid HA has a pH of 3.00. What is the Ka of this acid?',
    options: { A: '1.00 × 10⁻⁵', B: '1.00 × 10⁻⁴', C: '1.00 × 10⁻⁶', D: '1.00 × 10⁻³' },
    answer: 'A',
    explanation: 'pH = 3.00 → [H⁺] = 1.00 × 10⁻³ M. For HA ⇌ H⁺ + A⁻: Ka = (10⁻³)²/(0.100 − 10⁻³) ≈ 10⁻⁶/0.099 ≈ 1.01 × 10⁻⁵.',
    unit: 'Unit 8 — Equilibrium',
  },
  {
    id: 2,
    stem: 'Which of the following intermolecular forces is responsible for the unusually high boiling point of water compared to H₂S?',
    options: { A: 'London dispersion forces', B: 'Dipole–dipole interactions', C: 'Hydrogen bonding', D: 'Ion–dipole forces' },
    answer: 'C',
    explanation: 'Water molecules form hydrogen bonds (O–H···O) that are much stronger than the dipole–dipole forces in H₂S, resulting in a far higher boiling point.',
    unit: 'Unit 3 — Intermolecular Forces',
  },
  {
    id: 3,
    stem: 'For the reaction 2 NO₂(g) ⇌ N₂O₄(g), ΔH° = −57 kJ/mol. Which change will shift the equilibrium to the right?',
    options: { A: 'Increasing temperature', B: 'Decreasing pressure', C: 'Adding a catalyst', D: 'Decreasing the volume of the container' },
    answer: 'D',
    explanation: 'Decreasing volume increases pressure. The equilibrium shifts toward the side with fewer moles of gas (right: 1 mol N₂O₄) to partially relieve the pressure increase. Adding a catalyst does not shift equilibrium.',
    unit: 'Unit 7 — Equilibrium',
  },
  {
    id: 4,
    stem: 'The standard cell potential for the reaction Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s) is +1.10 V. What is ΔG° for this reaction? (F = 96485 C/mol)',
    options: { A: '−212 kJ/mol', B: '+212 kJ/mol', C: '−106 kJ/mol', D: '+106 kJ/mol' },
    answer: 'A',
    explanation: 'ΔG° = −nFE° = −(2)(96485)(1.10) = −212,267 J/mol ≈ −212 kJ/mol. n = 2 electrons transferred.',
    unit: 'Unit 9 — Electrochemistry',
  },
  {
    id: 5,
    stem: 'A first-order reaction has a rate constant of 0.0200 s⁻¹. What is the half-life of this reaction?',
    options: { A: '34.7 s', B: '50.0 s', C: '69.3 s', D: '100 s' },
    answer: 'A',
    explanation: 't₁/₂ = ln2 / k = 0.6931 / 0.0200 = 34.7 s.',
    unit: 'Unit 5 — Kinetics',
  },
  {
    id: 6,
    stem: 'Which of the following electron configurations represents an atom in an excited state?',
    options: { A: '1s² 2s² 2p⁶', B: '1s² 2s² 2p⁵', C: '1s² 2s¹ 2p¹', D: '1s² 2s² 2p⁶ 3s¹' },
    answer: 'C',
    explanation: '1s² 2s¹ 2p¹ represents carbon with one electron promoted from 2s to 2p — an excited state. Ground-state carbon is 1s² 2s² 2p².',
    unit: 'Unit 1 — Atomic Structure',
  },
  {
    id: 7,
    stem: 'What is the oxidation state of sulfur in H₂SO₄?',
    options: { A: '+4', B: '+6', C: '+2', D: '−2' },
    answer: 'B',
    explanation: 'H₂SO₄: 2(+1) + S + 4(−2) = 0 → S = +6.',
    unit: 'Unit 4 — Reactions',
  },
  {
    id: 8,
    stem: 'Which of the following species is amphoteric?',
    options: { A: 'Na⁺', B: 'H₂O', C: 'Cl⁻', D: 'Na₂O' },
    answer: 'B',
    explanation: 'Water is amphoteric — it can act as both an acid (donating H⁺ to form OH⁻) or a base (accepting H⁺ to form H₃O⁺).',
    unit: 'Unit 8 — Acids and Bases',
  },
  {
    id: 9,
    stem: 'The solubility of AgCl in water at 25°C is 1.34 × 10⁻⁵ mol/L. What is the Ksp of AgCl?',
    options: { A: '1.79 × 10⁻¹⁰', B: '1.34 × 10⁻⁵', C: '2.68 × 10⁻⁵', D: '3.58 × 10⁻¹⁰' },
    answer: 'A',
    explanation: 'AgCl → Ag⁺ + Cl⁻; [Ag⁺] = [Cl⁻] = 1.34 × 10⁻⁵. Ksp = (1.34 × 10⁻⁵)² = 1.79 × 10⁻¹⁰.',
    unit: 'Unit 7 — Equilibrium',
  },
  {
    id: 10,
    stem: 'Which molecular geometry corresponds to a molecule with 4 bonding pairs and 0 lone pairs?',
    options: { A: 'Square planar', B: 'Tetrahedral', C: 'Trigonal pyramidal', D: 'Bent' },
    answer: 'B',
    explanation: '4 bonding pairs + 0 lone pairs → tetrahedral geometry (e.g., CH₄). Bond angles are 109.5°.',
    unit: 'Unit 2 — Molecular Structure',
  },
]

// ── Sample AP Chemistry FRQ problems ─────────────────────────────────────────
const AP_FRQ_SAMPLE: FRQProblem[] = [
  {
    id: 1,
    year: 2023,
    number: 1,
    type: 'LEQ',
    total_points: 10,
    source: 'AP Chemistry 2023 FRQ — Sample',
    context: `A buffer solution is prepared by mixing 0.500 mol of CH₃COOH and 0.500 mol of CH₃COONa in enough water to make 1.00 L of solution. The Ka of acetic acid is 1.8 × 10⁻⁵.`,
    parts: [
      {
        label: 'a',
        question: 'Calculate the pH of the buffer solution.',
        points: 2,
        model_answer: 'Using Henderson–Hasselbalch: pH = pKa + log([A⁻]/[HA]) = −log(1.8 × 10⁻⁵) + log(0.500/0.500) = 4.74 + 0 = 4.74.',
      },
      {
        label: 'b',
        question: '0.100 mol of solid NaOH is added to the buffer. Calculate the new pH.',
        points: 3,
        model_answer: 'NaOH reacts with CH₃COOH: moles CH₃COOH = 0.500 − 0.100 = 0.400 mol; moles CH₃COO⁻ = 0.500 + 0.100 = 0.600 mol. pH = 4.74 + log(0.600/0.400) = 4.74 + 0.176 = 4.92.',
      },
      {
        label: 'c',
        question: 'Compare the buffering capacity after adding NaOH with that of the original buffer. Explain your reasoning.',
        points: 2,
        model_answer: 'The buffering capacity decreases because the ratio [A⁻]/[HA] has moved further from 1:1. Buffers are most effective when [A⁻] ≈ [HA], giving the maximum capacity to absorb both acid and base additions.',
      },
      {
        label: 'd',
        question: 'A student claims that adding water to the buffer will significantly change its pH. Is this student correct? Explain.',
        points: 3,
        model_answer: 'Incorrect. Diluting a buffer with water does not significantly change its pH because both [CH₃COOH] and [CH₃COO⁻] decrease by the same factor; their ratio and hence the Henderson–Hasselbalch pH remain essentially constant (ignoring the very small autoionization change).',
      },
    ],
  },
  {
    id: 2,
    year: 2023,
    number: 4,
    type: 'SAQ',
    total_points: 4,
    source: 'AP Chemistry 2023 FRQ — Sample',
    context: 'Consider the galvanic cell: Mg(s) | Mg²⁺(aq) || Ag⁺(aq) | Ag(s). Standard reduction potentials: Mg²⁺ + 2e⁻ → Mg(s), E° = −2.37 V; Ag⁺ + e⁻ → Ag(s), E° = +0.80 V.',
    parts: [
      {
        label: 'a',
        question: 'Write the overall balanced equation for the cell reaction.',
        points: 1,
        model_answer: 'Mg(s) + 2Ag⁺(aq) → Mg²⁺(aq) + 2Ag(s)',
      },
      {
        label: 'b',
        question: 'Calculate the standard cell potential, E°cell.',
        points: 1,
        model_answer: 'E°cell = E°cathode − E°anode = (+0.80) − (−2.37) = +3.17 V.',
      },
      {
        label: 'c',
        question: 'Identify the anode and explain the direction of electron flow in the external circuit.',
        points: 1,
        model_answer: 'Mg is oxidized at the anode. Electrons flow from the anode (Mg electrode) through the external wire to the cathode (Ag electrode) because oxidation releases electrons at the anode.',
      },
      {
        label: 'd',
        question: 'Predict what happens to E°cell if the concentration of Ag⁺ is increased. Explain using the Nernst equation.',
        points: 1,
        model_answer: 'Ecell increases. Nernst: E = E° − (RT/nF)ln(Q). Increasing [Ag⁺] decreases Q ([Mg²⁺]/[Ag⁺]²), so the −lnQ term becomes more positive, raising Ecell above E°.',
      },
    ],
  },
]

type Section = 'mcq' | 'frq'

export default function APChemPracticePage() {
  const [section, setSection] = useState<Section>('mcq')
  const [started, setStarted] = useState(false)

  if (section === 'mcq' && started) {
    return (
      <MCQExam
        questions={AP_MCQ_SAMPLE}
        examName="AP Chemistry — Section I (Sample)"
        timeLimitSeconds={5400}
        onExit={() => setStarted(false)}
      />
    )
  }

  if (section === 'frq' && started) {
    return (
      <FRQViewer
        problems={AP_FRQ_SAMPLE}
        examLabel="AP Chemistry — Section II Free Response (Sample)"
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#060610] text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <a href="/ap-chemistry" className="text-sm text-gray-500 hover:text-white transition-colors mb-8 inline-block">← AP Chemistry Hub</a>

        <h1 className="text-4xl font-black mb-2">AP Chemistry Practice</h1>
        <p className="text-gray-400 mb-10">Select a section to begin. Questions mirror the official AP Chemistry exam format.</p>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Section I */}
          <div className={`border rounded-2xl p-6 cursor-pointer transition-all ${section === 'mcq' ? 'border-blue-500/50 bg-blue-600/10' : 'border-white/10 hover:border-white/20'}`}
            onClick={() => setSection('mcq')}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-300 font-bold text-sm">I</div>
              <div>
                <div className="font-bold">Section I — MCQ</div>
                <div className="text-xs text-gray-500">Multiple Choice</div>
              </div>
              {section === 'mcq' && <div className="ml-auto w-3 h-3 rounded-full bg-blue-500" />}
            </div>
            <div className="space-y-1 text-sm text-gray-400">
              <div>60 questions · 90 minutes</div>
              <div>50% of exam score</div>
              <div className="text-yellow-500 text-xs mt-2">Sample: 10 questions available</div>
            </div>
          </div>

          {/* Section II */}
          <div className={`border rounded-2xl p-6 cursor-pointer transition-all ${section === 'frq' ? 'border-blue-500/50 bg-blue-600/10' : 'border-white/10 hover:border-white/20'}`}
            onClick={() => setSection('frq')}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-sm">II</div>
              <div>
                <div className="font-bold">Section II — FRQ</div>
                <div className="text-xs text-gray-500">Free Response</div>
              </div>
              {section === 'frq' && <div className="ml-auto w-3 h-3 rounded-full bg-blue-500" />}
            </div>
            <div className="space-y-1 text-sm text-gray-400">
              <div>7 problems · 105 minutes</div>
              <div>50% of exam score</div>
              <div className="text-yellow-500 text-xs mt-2">Sample: 2 problems (1 LEQ + 1 SAQ)</div>
            </div>
          </div>
        </div>

        {/* Section info */}
        <div className="mt-8 bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          {section === 'mcq' ? (
            <div>
              <div className="text-sm font-semibold text-blue-300 mb-2">Section I — Multiple Choice</div>
              <p className="text-sm text-gray-400">Tests conceptual understanding across all 9 AP Chemistry units. Questions are standalone or in sets of 2–3 referencing shared data. A four-function calculator is NOT permitted in Section I.</p>
            </div>
          ) : (
            <div>
              <div className="text-sm font-semibold text-purple-300 mb-2">Section II — Free Response</div>
              <p className="text-sm text-gray-400">3 Long Essay Questions (LEQ, 10 pts each) and 4 Short Answer Questions (SAQ, 4 pts each). A scientific calculator and the AP periodic table/formula sheet are provided. Show all work for full credit.</p>
            </div>
          )}
        </div>

        <button
          onClick={() => setStarted(true)}
          className="mt-6 w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-lg transition-colors">
          Start {section === 'mcq' ? 'Section I — MCQ' : 'Section II — FRQ'} →
        </button>

        <p className="text-center text-xs text-gray-600 mt-4">
          Sample questions — full question banks coming soon
        </p>
      </div>
    </div>
  )
}
