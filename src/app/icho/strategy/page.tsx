import { Metadata } from 'next'
import Link from 'next/link'
import TopicBarChart from '../../components/TopicBarChart'
import { ICHO_PREP, ICHO_VOLUMES } from '@/data/examTopicFrequency'

export const metadata: Metadata = {
  title: 'IChO Exam Strategy — What Actually Gets Tested',
  description:
    'Real topic-frequency data from 261 official IChO preparatory problems and compiled volumes — see exactly what IChO tests before you study, not a generic syllabus guess.',
  alternates: { canonical: 'https://www.thechemsolver.com/icho/strategy' },
  openGraph: {
    title: 'IChO Exam Strategy — Real Past-Paper Data',
    description: 'What IChO actually tests, based on real topic-frequency analysis of official preparatory problems — not a generic syllabus summary.',
    url: 'https://www.thechemsolver.com/icho/strategy',
    siteName: 'TheChemSolver',
    type: 'website',
  },
}

const ICHO_YELLOW = '#eab308'

export default function IChOStrategyPage() {
  return (
    <div className="bg-[#060610] text-white">

      {/* Hero */}
      <section className="px-5 pt-14 pb-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">Data-Driven Strategy</span>
          <span className="text-white/20">·</span>
          <span className="text-xs text-gray-500">261 official problems analyzed</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-3 leading-tight">
          What IChO Actually Tests
        </h1>
        <p className="text-gray-400 max-w-2xl leading-relaxed text-sm">
          IChO does publish an official syllabus each year — but syllabus documents describe
          what's <em>in scope</em>, not what's actually emphasized. We tagged and counted every
          topic across the official IChO preparatory problems and compiled problem volumes
          already in our question bank, to see what's really being asked, not just what's allowed.
        </p>
      </section>

      {/* Key insight callout */}
      <section className="px-5 pb-10 max-w-4xl mx-auto">
        <div className="rounded-2xl bg-yellow-900/10 border border-yellow-700/20 p-5">
          <h2 className="text-sm font-bold text-yellow-300 mb-2">The single biggest finding</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Physical chemistry — kinetics, thermodynamics, and electrochemistry combined — makes up
            over <strong className="text-white">50%</strong> of every IChO problem set we analyzed.
            Analytical chemistry alone is <strong className="text-white">~20%</strong> of preparatory
            problems, while coordination chemistry — often assumed to be a headline IChO topic —
            barely registers. If you're prioritizing study time, physical chemistry depth and
            analytical technique matter far more than coordination chemistry memorization.
          </p>
        </div>
      </section>

      {/* Charts */}
      <section className="px-5 pb-8 max-w-4xl mx-auto space-y-5">
        <TopicBarChart
          title="IChO Preparatory Problems"
          subtitle="Official pre-competition problem sets, by domain"
          data={ICHO_PREP}
          accentHex={ICHO_YELLOW}
        />
        <TopicBarChart
          title="IChO Compiled Volumes"
          subtitle="Multi-year compiled official problem collections"
          data={ICHO_VOLUMES}
          accentHex={ICHO_YELLOW}
        />
      </section>

      {/* Secondary insights */}
      <section className="px-5 pb-10 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold text-sm mb-1.5">Analytical chemistry is the real gap</div>
            <div className="text-gray-500 text-xs leading-relaxed">
              Titrimetric/gravimetric methods, spectrophotometry, and electroanalytical technique
              are heavily tested but rarely taught alongside general/organic chemistry. Our{' '}
              <Link href="/ebook/advanced-chemistry" className="text-yellow-400 hover:text-yellow-300">Advanced Chemistry ebook</Link>{' '}
              opens with exactly this chapter.
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <div className="text-2xl mb-2">🔬</div>
            <div className="font-semibold text-sm mb-1.5">Spectroscopy shows up as real technique, not trivia</div>
            <div className="text-gray-500 text-xs leading-relaxed">
              Spectrophotometry, IR, Raman, and mass spectrometry appear repeatedly as analytical
              methods within larger problems. Our{' '}
              <Link href="/labs" className="text-yellow-400 hover:text-yellow-300">simulators</Link>{' '}
              for NMR, mass spec, and Beer-Lambert absorption cover exactly this.
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-16 max-w-4xl mx-auto text-center">
        <Link
          href="/icho/problems"
          className="inline-block bg-yellow-700 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
        >
          Browse Official Prep Problems →
        </Link>
      </section>

    </div>
  )
}
