'use client'
import { useState } from 'react'
import MCQExam, { MCQQuestion } from '@/app/components/MCQExam'

// ── Sample USNCO Local Exam questions ─────────────────────────────────────────
const USNCO_LOCAL_SAMPLE: MCQQuestion[] = [
  {
    id: 1,
    stem: 'How many sigma (σ) and pi (π) bonds are present in a molecule of CO₂?',
    options: { A: '2σ, 0π', B: '2σ, 2π', C: '1σ, 2π', D: '3σ, 1π' },
    answer: 'B',
    explanation: 'CO₂ has two C=O double bonds. Each double bond consists of 1σ + 1π. Total: 2σ + 2π.',
    unit: 'Bonding',
  },
  {
    id: 2,
    stem: 'A 1.00 L solution contains 0.100 mol HCl and 0.0500 mol NaOH. What is the approximate pH?',
    options: { A: '1.00', B: '1.30', C: '2.00', D: '7.00' },
    answer: 'B',
    explanation: 'HCl is strong acid, NaOH is strong base. Net H⁺ = 0.100 − 0.0500 = 0.0500 M. pH = −log(0.0500) = 1.30.',
    unit: 'Acids & Bases',
  },
  {
    id: 3,
    stem: 'At 25°C, which of the following aqueous solutions has the highest electrical conductivity?',
    options: { A: '0.10 M glucose', B: '0.10 M acetic acid', C: '0.10 M NaCl', D: '0.10 M HF' },
    answer: 'C',
    explanation: 'NaCl is a strong electrolyte and fully dissociates into Na⁺ and Cl⁻, giving the highest ion concentration and thus the highest conductivity. Glucose is a nonelectrolyte; acetic acid and HF are weak electrolytes.',
    unit: 'Solutions',
  },
  {
    id: 4,
    stem: 'The half-life of a radioactive isotope is 30.0 years. What fraction of a sample remains after 90.0 years?',
    options: { A: '1/2', B: '1/4', C: '1/8', D: '1/16' },
    answer: 'C',
    explanation: '90.0 years = 3 half-lives. Remaining fraction = (1/2)³ = 1/8.',
    unit: 'Nuclear Chemistry',
  },
  {
    id: 5,
    stem: 'Which of the following statements about entropy is correct?',
    options: { A: 'Entropy decreases when a gas dissolves in a liquid.', B: 'The entropy of a pure crystalline substance at 0 K is 1.', C: 'All spontaneous processes have positive ΔS.', D: 'Entropy is a path function.' },
    answer: 'A',
    explanation: 'When a gas dissolves in a liquid, the molecules become more ordered (go from gas-phase disorder to solution-phase constraint), so entropy decreases. The third law states S = 0 at 0 K for pure crystals. Spontaneous processes can have negative ΔS if ΔH drives the process. Entropy is a state function.',
    unit: 'Thermodynamics',
  },
]

// ── Sample USNCO National Part I questions ────────────────────────────────────
const USNCO_NAT_SAMPLE: MCQQuestion[] = [
  {
    id: 101,
    stem: 'For the reaction PCl₃(g) + Cl₂(g) ⇌ PCl₅(g), ΔH° = −87.9 kJ/mol. At equilibrium at 300°C, which change would most increase the equilibrium constant K?',
    options: { A: 'Increasing the total pressure', B: 'Decreasing the temperature', C: 'Adding more PCl₃', D: 'Using a catalyst' },
    answer: 'B',
    explanation: 'K depends only on temperature. For an exothermic reaction (ΔH < 0), decreasing temperature favors the forward reaction (products), increasing K. Pressure and concentration changes shift equilibrium but do not change K. Catalysts do not change K.',
    unit: 'Equilibrium',
  },
  {
    id: 102,
    stem: 'A 0.250 M solution of a diprotic acid H₂A has Ka1 = 1.2 × 10⁻² and Ka2 = 6.2 × 10⁻⁸. Which species is the predominant form at pH 5.0?',
    options: { A: 'H₂A', B: 'HA⁻', C: 'A²⁻', D: 'H₃O⁺' },
    answer: 'B',
    explanation: 'pKa1 = 1.92, pKa2 = 7.21. At pH 5.0: pH > pKa1, so H₂A is largely deprotonated to HA⁻; pH < pKa2, so HA⁻ is largely not yet deprotonated to A²⁻. Hence HA⁻ is the predominant species.',
    unit: 'Polyprotic Acids',
  },
  {
    id: 103,
    stem: 'The complex ion [Co(NH₃)₄Cl₂]⁺ can exist in two geometric isomers. The magnetic properties show the complex is diamagnetic. What is the geometry and oxidation state of cobalt?',
    options: { A: 'Tetrahedral, Co(II)', B: 'Octahedral, Co(III)', C: 'Square planar, Co(II)', D: 'Octahedral, Co(II)' },
    answer: 'B',
    explanation: '[Co(NH₃)₄Cl₂]⁺: 4 NH₃ + 2 Cl⁻ = 6 ligands → octahedral. Charge: Co + 0(NH₃)×4 + (−1)(Cl)×2 = +1 → Co = +3. Co(III) with strong NH₃ field ligands is typically low-spin and diamagnetic (d⁶, all paired).',
    unit: 'Coordination Chemistry',
  },
  {
    id: 104,
    stem: 'The activation energy for a reaction is 75.0 kJ/mol. By what factor does the rate constant increase when the temperature is raised from 300 K to 310 K? (R = 8.314 J/mol·K)',
    options: { A: '1.8', B: '2.2', C: '3.6', D: '4.1' },
    answer: 'B',
    explanation: 'ln(k₂/k₁) = (Ea/R)(1/T₁ − 1/T₂) = (75000/8.314)(1/300 − 1/310) = 9024 × 1.075 × 10⁻⁴ = 0.785. k₂/k₁ = e^0.785 ≈ 2.19 ≈ 2.2.',
    unit: 'Kinetics',
  },
  {
    id: 105,
    stem: 'Which of the following correctly ranks the compounds in order of increasing lattice energy? (Most negative = highest)',
    options: { A: 'NaF < NaCl < MgCl₂', B: 'MgCl₂ < NaCl < NaF', C: 'NaCl < NaF < MgCl₂', D: 'NaF < MgCl₂ < NaCl' },
    answer: 'C',
    explanation: 'Lattice energy increases with greater charge and smaller ionic radius. NaCl (+1/−1, larger Cl⁻) < NaF (+1/−1, smaller F⁻) < MgCl₂ (+2/−1 charges, doubly charged Mg²⁺ greatly increases lattice energy).',
    unit: 'Ionic Bonding',
  },
]

type Tab = 'local' | 'national'

export default function USNCOPracticePage() {
  const [tab, setTab] = useState<Tab>('local')
  const [started, setStarted] = useState(false)

  if (started && tab === 'local') {
    return (
      <MCQExam
        questions={USNCO_LOCAL_SAMPLE}
        examName="USNCO Local Exam (Sample)"
        timeLimitSeconds={6600}
        onExit={() => setStarted(false)}
      />
    )
  }

  if (started && tab === 'national') {
    return (
      <MCQExam
        questions={USNCO_NAT_SAMPLE}
        examName="USNCO National Exam — Part I (Sample)"
        timeLimitSeconds={6600}
        onExit={() => setStarted(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#060610] text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <a href="/usnco" className="text-sm text-gray-500 hover:text-white transition-colors mb-8 inline-block">← USNCO Hub</a>

        <h1 className="text-4xl font-black mb-2">USNCO Practice</h1>
        <p className="text-gray-400 mb-10">Practice for all stages of the US National Chemistry Olympiad.</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/10 pb-0">
          {[
            { id: 'local' as Tab, label: 'Local Exam', sub: '60 MCQ · 110 min', color: 'text-orange-300 border-orange-500' },
            { id: 'national' as Tab, label: 'National Part I', sub: '60 MCQ · 110 min', color: 'text-red-300 border-red-500' },
          ].map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setStarted(false) }}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${tab === t.id ? t.color : 'border-transparent text-gray-500 hover:text-white'}`}>
              {t.label}
              <span className="ml-2 text-[10px] font-normal opacity-60">{t.sub}</span>
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid gap-5 md:grid-cols-2">
          {tab === 'local' ? (
            <>
              <div className="border border-white/10 rounded-2xl p-6">
                <div className="text-sm font-bold text-orange-300 mb-3">USNCO Local Exam</div>
                <div className="space-y-2 text-sm text-gray-400">
                  <div>60 multiple-choice questions</div>
                  <div>110 minutes (approx. 6600s)</div>
                  <div>Held at your school / regional site</div>
                  <div>Covers general to advanced college chemistry</div>
                  <div className="text-yellow-500 text-xs mt-3">Sample: 5 questions available</div>
                </div>
              </div>
              <div className="border border-white/10 rounded-2xl p-6">
                <div className="text-sm font-bold text-gray-400 mb-3">Scoring</div>
                <div className="space-y-1 text-sm text-gray-400">
                  <div>+1 per correct answer</div>
                  <div>No penalty for wrong answers</div>
                  <div>Top ~1500 students nationally advance</div>
                  <div>Typically &gt;70% correct to advance</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="border border-white/10 rounded-2xl p-6">
                <div className="text-sm font-bold text-red-300 mb-3">National Exam — Part I</div>
                <div className="space-y-2 text-sm text-gray-400">
                  <div>60 multiple-choice questions</div>
                  <div>110 minutes</div>
                  <div>Held at regional sites (April)</div>
                  <div>College-level analytical, physical, organic chemistry</div>
                  <div className="text-yellow-500 text-xs mt-3">Sample: 5 questions available</div>
                </div>
              </div>
              <div className="border border-white/10 rounded-2xl p-6">
                <div className="text-sm font-bold text-gray-400 mb-3">National Exam Structure</div>
                <div className="space-y-1 text-sm text-gray-400">
                  <div>Part I: 60 MCQ (110 min)</div>
                  <div>Part II: 8 Free Response (105 min)</div>
                  <div>Part III: Lab practical (90 min)</div>
                  <div>Top 20 form the US IChO team</div>
                </div>
              </div>
            </>
          )}
        </div>

        <button
          onClick={() => setStarted(true)}
          className="mt-8 w-full py-4 bg-orange-600 hover:bg-orange-500 rounded-2xl font-bold text-lg transition-colors">
          Start {tab === 'local' ? 'Local Exam Practice' : 'National Part I Practice'} →
        </button>

        <p className="text-center text-xs text-gray-600 mt-4">
          Sample questions only — full question banks coming soon
        </p>
      </div>
    </div>
  )
}
