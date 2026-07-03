import { Metadata } from 'next'
import Link from 'next/link'
import TopicBarChart from '../../components/TopicBarChart'
import { ORGO1, ORGO2 } from '@/data/examTopicFrequency'

export const metadata: Metadata = {
  title: 'Organic Chemistry Exam Strategy — What Actually Gets Tested',
  description:
    'Real topic-frequency data from 1,125 Orgo 1 & 2 exam problems — see exactly which chapters dominate real exams before you study, not a generic syllabus guess.',
  alternates: { canonical: 'https://www.thechemsolver.com/organic-chemistry/strategy' },
  openGraph: {
    title: 'Organic Chemistry Exam Strategy — Real Past-Exam Data',
    description: 'What Orgo 1 & 2 exams actually test, based on real topic-frequency analysis of university exam archives.',
    url: 'https://www.thechemsolver.com/organic-chemistry/strategy',
    siteName: 'TheChemSolver',
    type: 'website',
  },
}

const ORGO1_GREEN = '#10b981'
const ORGO2_PURPLE = '#a855f7'

export default function OrganicChemistryStrategyPage() {
  return (
    <div className="bg-[#060610] text-white">

      {/* Hero */}
      <section className="px-5 pt-14 pb-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Data-Driven Strategy</span>
          <span className="text-white/20">·</span>
          <span className="text-xs text-gray-500">1,125 real exam problems analyzed</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-3 leading-tight">
          What Orgo 1 & 2 Actually Test
        </h1>
        <p className="text-gray-400 max-w-2xl leading-relaxed text-sm">
          There's no single national exam for Orgo — every university writes its own. So instead
          of guessing from a textbook's table of contents, we pulled real exams from university
          archives (CU Boulder, Dartmouth, Michigan, ACS sample questions, and more), tagged every
          problem to a chapter, and counted. Below is what actually shows up, weighted by how often
          it's tested — not how many pages a textbook spends on it.
        </p>
      </section>

      {/* Key insight callout */}
      <section className="px-5 pb-10 max-w-4xl mx-auto">
        <div className="rounded-2xl bg-emerald-900/10 border border-emerald-700/20 p-5">
          <h2 className="text-sm font-bold text-emerald-300 mb-2">The single biggest finding</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Two chapters — <strong className="text-white">Alkene Reactions</strong> (24.5%) and{' '}
            <strong className="text-white">Stereochemistry</strong> (23.9%) — make up nearly{' '}
            <strong className="text-white">half of every Orgo 1 exam</strong>. Add Acid-Base (17.8%)
            and Functional Groups (13.7%) and four chapters account for roughly 80% of what's tested.
            Alkanes, Alkynes, and Conjugated Systems barely register on their own — they mostly show
            up folded into alkene/stereochemistry problems, not as standalone questions.
          </p>
        </div>
      </section>

      {/* Charts */}
      <section className="px-5 pb-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 px-3 py-1 bg-emerald-900/20 border border-emerald-700/30 rounded-full">
            Orgo 1 — Chapters 1–11
          </span>
        </div>
        <TopicBarChart
          title="Orgo 1 Exams"
          subtitle="CU Boulder, Dartmouth, MNSU & compiled practice archives"
          data={ORGO1}
          accentHex={ORGO1_GREEN}
        />
      </section>

      <section className="px-5 pb-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400 px-3 py-1 bg-purple-900/20 border border-purple-700/30 rounded-full">
            Orgo 2 — Chapters 12–22
          </span>
        </div>
        <TopicBarChart
          title="Orgo 2 Exams"
          subtitle="Early sample · aromatic + carbonyl-heavy archives"
          data={ORGO2}
          accentHex={ORGO2_PURPLE}
        />
        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
          Note: our Orgo 2 sample (66 problems) is much smaller than Orgo 1's (1,059) — most of the
          free university archives we found so far skew toward Orgo 1. Treat this chart as an early
          read, not a settled picture: it will get more representative as we source more Orgo 2 exams.
        </p>
      </section>

      {/* Secondary insights */}
      <section className="px-5 pb-10 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <div className="text-2xl mb-2">🔬</div>
            <div className="font-semibold text-sm mb-1.5">Stereochemistry is never "just one chapter"</div>
            <div className="text-gray-500 text-xs leading-relaxed">
              At 23.9% of Orgo 1, stereochemistry questions are woven through alkene addition,
              substitution, and elimination problems too — R/S assignment and predicting stereochemical
              outcome of a reaction is tested far more than a standalone "name this molecule" chapter
              would suggest.
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <div className="text-2xl mb-2">⚗️</div>
            <div className="font-semibold text-sm mb-1.5">Carbonyl chemistry dominates what we've seen of Orgo 2</div>
            <div className="text-gray-500 text-xs leading-relaxed">
              60.6% of our current Orgo 2 sample is Aldehydes & Ketones — nucleophilic addition,
              acetal formation, and related mechanisms. Our{' '}
              <Link href="/ebook/organic-chemistry" className="text-purple-400 hover:text-purple-300">Organic Chemistry ebook</Link>{' '}
              covers this chapter in full depth, plus everything else across all 22 chapters.
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-16 max-w-4xl mx-auto text-center">
        <Link
          href="/ebook/organic-chemistry"
          className="inline-block bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
        >
          Study the Full Ebook →
        </Link>
      </section>

    </div>
  )
}
