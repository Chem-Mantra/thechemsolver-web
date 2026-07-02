import { Metadata } from 'next'
import Link from 'next/link'
import TopicBarChart from '../../components/TopicBarChart'
import { USNCO_LOCAL, USNCO_NAT_PART1, USNCO_NAT_PART2, USNCO_NAT_PART3 } from '@/data/examTopicFrequency'

export const metadata: Metadata = {
  title: 'USNCO Exam Strategy — What Actually Gets Tested | TheChemSolver',
  description:
    'Real topic-frequency data from hundreds of official USNCO Local, National Part I, II, and III past papers — see exactly what USNCO tests before you study, not a generic syllabus guess.',
  alternates: { canonical: 'https://www.thechemsolver.com/usnco/strategy' },
  openGraph: {
    title: 'USNCO Exam Strategy — Real Past-Paper Data',
    description: 'What USNCO actually tests, based on real topic-frequency analysis of official past papers — not a generic syllabus summary.',
    url: 'https://www.thechemsolver.com/usnco/strategy',
    siteName: 'TheChemSolver',
    type: 'website',
  },
}

const USNCO_ORANGE = '#f97316'

export default function USNCOStrategyPage() {
  return (
    <div className="bg-[#060610] text-white">

      {/* Hero */}
      <section className="px-5 pt-14 pb-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-400">Data-Driven Strategy</span>
          <span className="text-white/20">·</span>
          <span className="text-xs text-gray-500">3,262 real past-paper questions analyzed</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-3 leading-tight">
          What USNCO Actually Tests
        </h1>
        <p className="text-gray-400 max-w-2xl leading-relaxed text-sm">
          USNCO publishes no formal syllabus document — ACS keeps the exam content structurally
          consistent year to year instead. So we did the next best thing: we tagged and counted
          every topic across hundreds of real Local, National Part I, Part II, and Part III past
          papers already in our question bank. Below is what that data actually shows — not a
          guess based on AP's syllabus or a generic "chemistry topics" list.
        </p>
      </section>

      {/* Key insight callout */}
      <section className="px-5 pb-10 max-w-4xl mx-auto">
        <div className="rounded-2xl bg-orange-900/10 border border-orange-700/20 p-5">
          <h2 className="text-sm font-bold text-orange-300 mb-2">The single biggest finding</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Equilibrium jumps from just <strong className="text-white">3.3%</strong> of Local exam
            questions to <strong className="text-white">8.3%</strong> at the National Part I level —
            the exact same topic, tested far more heavily once you clear the Local round. Kinetics,
            Thermodynamics, and Electrochemistry are consistently the three largest categories at
            every level, together making up close to a third of every exam.
          </p>
        </div>
      </section>

      {/* Charts */}
      <section className="px-5 pb-8 max-w-4xl mx-auto space-y-5">
        <TopicBarChart
          title="USNCO Local Exam"
          subtitle="60 MCQ · roughly AP-Chemistry level"
          data={USNCO_LOCAL}
          accentHex={USNCO_ORANGE}
        />
        <TopicBarChart
          title="USNCO National Part I"
          subtitle="60 MCQ · notably deeper than Local"
          data={USNCO_NAT_PART1}
          accentHex={USNCO_ORANGE}
        />
        <TopicBarChart
          title="USNCO National Part II"
          subtitle="Free-response · 6 questions"
          data={USNCO_NAT_PART2}
          accentHex={USNCO_ORANGE}
        />
        <TopicBarChart
          title="USNCO National Part III"
          subtitle="Lab practical · 2 tasks"
          data={USNCO_NAT_PART3}
          accentHex={USNCO_ORANGE}
        />
      </section>

      {/* Secondary insights */}
      <section className="px-5 pb-10 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <div className="text-2xl mb-2">🧪</div>
            <div className="font-semibold text-sm mb-1.5">Part III is a different game entirely</div>
            <div className="text-gray-500 text-xs leading-relaxed">
              Qualitative Analysis and Acid-Base Titration dominate the lab practical — real wet-chemistry
              skills, not the conceptual recall that carries you through Local and Part I. See our{' '}
              <Link href="/ebook/advanced-chemistry" className="text-orange-400 hover:text-orange-300">Advanced Chemistry ebook</Link>{' '}
              for the analytical-chemistry chapter built specifically for this gap.
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <div className="text-2xl mb-2">📈</div>
            <div className="font-semibold text-sm mb-1.5">Organic chemistry is bigger than you'd expect</div>
            <div className="text-gray-500 text-xs leading-relaxed">
              7–9% of both Local and Part I MCQs are organic chemistry — on par with atomic structure.
              Don't leave it for last; our{' '}
              <Link href="/organic-chemistry" className="text-orange-400 hover:text-orange-300">Organic Chemistry hub</Link>{' '}
              covers this at a depth that comfortably exceeds what's tested here.
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-16 max-w-4xl mx-auto text-center">
        <Link
          href="/usnco/practice"
          className="inline-block bg-orange-700 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
        >
          Practice With Real Past Papers →
        </Link>
      </section>

    </div>
  )
}
