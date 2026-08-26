import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import RichText from '@/app/components/RichText'

interface Props {
  params: Promise<{ type: string; id: string }>
}

// Maps the URL's [type] segment to a Supabase table + a normalized shape all
// 5 tables get read into, so the rest of this file doesn't need to branch
// on table-specific column names.
const TABLES: Record<string, { table: string; label: string; examLabel: string }> = {
  mcq:     { table: 'QBankMCQ',     label: 'MCQ',  examLabel: 'USNCO / General Chemistry' },
  'ap-mcq': { table: 'APChapterMCQ', label: 'MCQ',  examLabel: 'AP Chemistry' },
  frq:     { table: 'QBankFRQ',     label: 'FRQ',  examLabel: 'USNCO / General Chemistry' },
  'ap-frq': { table: 'APChapterFRQ', label: 'FRQ',  examLabel: 'AP Chemistry' },
  icho:    { table: 'QBankIChO',    label: 'IChO', examLabel: 'International Chemistry Olympiad' },
}

type FRQPart = { label: string; question: string; points: number | null; model_answer: string | null; image_url?: string | null }
type IChOSubPart = { label: string; question: string; points: number | null; model_answer: string | null; image_url?: string | null }
type IChOPart = FRQPart & { sub_parts?: IChOSubPart[] }

async function getQuestion(type: string, id: string) {
  const meta = TABLES[type]
  if (!meta) return null
  const numericId = Number(id)
  if (!Number.isFinite(numericId)) return null

  const { data, error } = await supabase.from(meta.table).select('*').eq('id', numericId).maybeSingle()
  if (error || !data) return null
  return { meta, row: data as Record<string, unknown> }
}

const stripFormatting = (s: string) =>
  s.replace(/\$[^$]+\$/g, '').replace(/\\\(|\\\)|\\\[|\\\]/g, '').replace(/\s+/g, ' ').trim()

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type, id } = await params
  const found = await getQuestion(type, id)
  if (!found) return { title: 'Question' }
  const { meta, row } = found

  const stemText = String(row.stem ?? row.context ?? row.title ?? '')
  const qText = stripFormatting(stemText).slice(0, 160)
  const topic = String(row.topic ?? row.domain ?? row.unit_title ?? meta.examLabel)
  const explanationText = row.explanation ? stripFormatting(String(row.explanation)).slice(0, 200) : ''

  const title = `${qText || `${meta.label} Question`} | ${topic}`
  const description = explanationText
    ? `${explanationText} — Full solution. Free ${meta.examLabel} chemistry practice on TheChemSolver.`
    : `${meta.examLabel} ${meta.label} question on ${topic}. Free practice with solutions on TheChemSolver.`

  return {
    title,
    description,
    keywords: [topic, meta.examLabel, `${meta.label} chemistry question`, 'free chemistry practice'],
    openGraph: {
      title: `${qText} — ${topic}`,
      description,
      url: `https://www.thechemsolver.com/q/${type}/${id}`,
      siteName: 'TheChemSolver',
      type: 'article',
      images: row.image_url
        ? [{ url: String(row.image_url), alt: `Chemistry diagram for: ${qText}` }]
        : [{ url: 'https://www.thechemsolver.com/logo.png', alt: 'TheChemSolver Chemistry' }],
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://www.thechemsolver.com/q/${type}/${id}` },
  }
}

const LETTERS = ['A', 'B', 'C', 'D', 'E']

export default async function QuestionPage({ params }: Props) {
  const { type, id } = await params
  const found = await getQuestion(type, id)
  if (!found) notFound()
  const { meta, row } = found

  const isMCQ = type === 'mcq' || type === 'ap-mcq'
  const isFRQ = type === 'frq' || type === 'ap-frq'
  const isIChO = type === 'icho'

  const stemText = String(row.stem ?? row.context ?? '')
  const topic = String(row.topic ?? row.domain ?? row.unit_title ?? meta.examLabel)
  const qPlain = stripFormatting(stemText)
  const options = (row.options as Record<string, string> | null) ?? null
  const correct = row.correct_answer ? String(row.correct_answer).trim().toUpperCase() : null
  const explanation = row.explanation ? String(row.explanation) : null
  const parts = (row.parts as (FRQPart | IChOPart)[] | null) ?? []

  // ── Rich JSON-LD schema for Google + AI search engines ──────────────────
  const answerText = isMCQ
    ? `${correct ? `Correct answer: ${correct}. ` : ''}${explanation ? stripFormatting(explanation) : ''}`
    : parts.map(p => `${p.label}: ${p.model_answer ? stripFormatting(p.model_answer) : ''}`).join(' ')

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'QAPage',
        '@id': `https://www.thechemsolver.com/q/${type}/${id}#page`,
        url: `https://www.thechemsolver.com/q/${type}/${id}`,
        name: qPlain.slice(0, 200) || `${meta.label} question`,
        mainEntity: {
          '@type': 'Question',
          '@id': `https://www.thechemsolver.com/q/${type}/${id}#question`,
          name: qPlain.slice(0, 200),
          text: stemText,
          answerCount: 1,
          about: { '@type': 'Thing', name: topic },
          acceptedAnswer: {
            '@type': 'Answer',
            '@id': `https://www.thechemsolver.com/q/${type}/${id}#answer`,
            text: answerText.slice(0, 2000),
          },
        },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.thechemsolver.com' },
            { '@type': 'ListItem', position: 2, name: meta.examLabel, item: `https://www.thechemsolver.com/q/${type}/${id}` },
            { '@type': 'ListItem', position: 3, name: topic, item: `https://www.thechemsolver.com/q/${type}/${id}` },
          ],
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="min-h-screen" style={{ background: '#060c1a' }}>
        <div className="border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-cyan-400 font-bold text-lg">🧪 TheChemSolver</Link>
          <span className="text-xs text-zinc-400">{meta.examLabel}</span>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-10">
          <nav aria-label="Breadcrumb" className="text-xs text-zinc-500 mb-6 flex gap-2 flex-wrap">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <span>{meta.examLabel}</span>
            <span>›</span>
            <span>{topic}</span>
          </nav>

          <div className="flex gap-2 flex-wrap mb-5">
            <span className="px-2 py-1 text-xs rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{topic}</span>
            <span className="px-2 py-1 text-xs rounded-full bg-zinc-800 text-zinc-400">{meta.label}</span>
          </div>

          <article>
            <header>
              <h1 className="sr-only">{qPlain.slice(0, 100)} — {topic} Chemistry Question</h1>
            </header>

            {(isMCQ || isFRQ) && (
              <div className="rounded-2xl p-6 mb-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-sm text-zinc-500 mb-3 font-medium uppercase tracking-wide">
                  {isMCQ ? 'Question' : 'Problem Context'}
                </p>
                <RichText text={stemText} className="text-white text-lg leading-relaxed font-medium" />
              </div>
            )}

            {isIChO && (
              <div className="rounded-2xl p-6 mb-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-sm text-zinc-500 mb-1 font-medium uppercase tracking-wide">{String(row.title ?? '')}</p>
                <RichText text={stemText} className="text-white text-lg leading-relaxed font-medium" />
              </div>
            )}

            {isMCQ && options && (
              <div className="space-y-3 mb-6" role="list" aria-label="Answer options">
                {LETTERS.filter(l => options[l]).map(letter => {
                  const isCorrect = correct === letter
                  return (
                    <div key={letter} role="listitem" className="flex gap-3 items-start rounded-xl px-4 py-3"
                      style={{ background: isCorrect ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.07)'}` }}>
                      <span className="font-bold shrink-0 text-sm mt-0.5" style={{ color: isCorrect ? '#10b981' : '#6b7280' }}>{letter}.</span>
                      <div className={`text-sm leading-relaxed flex-1 ${isCorrect ? 'text-green-300 font-semibold' : 'text-zinc-300'}`}>
                        <RichText text={options[letter]} />
                        {isCorrect && <span className="ml-2 text-green-400 text-xs" aria-label="Correct answer">✓ Correct</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {isMCQ && explanation && (
              <section aria-label="Solution and explanation" className="rounded-2xl p-6 mb-8"
                style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <h2 className="text-sm text-blue-400 mb-3 font-semibold uppercase tracking-wide">💡 Solution &amp; Explanation</h2>
                <RichText text={explanation} className="text-zinc-300 text-sm leading-relaxed" />
              </section>
            )}

            {(isFRQ || isIChO) && parts.length > 0 && (
              <div className="space-y-4 mb-8">
                {parts.map((part, i) => (
                  <div key={i} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="flex items-start gap-3 mb-3">
                      <span className="shrink-0 text-xs font-bold text-cyan-400 mt-0.5">{part.label}.</span>
                      <RichText text={part.question} className="text-sm leading-relaxed text-white flex-1" />
                      {part.points != null && <span className="text-xs text-zinc-600 shrink-0">{part.points} pt{part.points !== 1 ? 's' : ''}</span>}
                    </div>
                    {'sub_parts' in part && part.sub_parts && part.sub_parts.length > 0 && (
                      <div className="ml-6 space-y-2 mb-3">
                        {part.sub_parts.map((sp, si) => (
                          <div key={si} className="text-xs text-zinc-400">
                            <span className="font-bold text-cyan-500/70 mr-1">{sp.label}.</span>
                            <RichText text={sp.question} />
                            {sp.model_answer && (
                              <div className="mt-1 pl-3 border-l-2 border-green-500/30 text-green-200">
                                <RichText text={sp.model_answer} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {part.model_answer && (
                      <div className="mt-2 pl-3 border-l-2 border-green-500/40 bg-green-500/5 rounded-r-lg py-2 pr-2">
                        <p className="text-[10px] font-bold text-green-400 uppercase tracking-wide mb-1">Model Answer</p>
                        <RichText text={part.model_answer} className="text-sm text-green-100 leading-relaxed" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-xl p-4 mb-6 flex items-center gap-4" style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <span className="text-2xl">💬</span>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">Still have doubts about this question?</div>
                <div className="text-xs text-zinc-400">Practice more questions like this, completely free.</div>
              </div>
            </div>
          </article>

          <div className="rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg,rgba(6,182,212,0.1),rgba(59,130,246,0.1))', border: '1px solid rgba(6,182,212,0.25)' }}>
            <h2 className="text-2xl font-bold text-white mb-2">Practice {meta.examLabel} questions like this — free</h2>
            <p className="text-zinc-400 mb-6 text-sm">4,000+ questions across AP Chemistry, USNCO, and IChO — all free, no signup required.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/ap-chemistry" className="px-7 py-3 rounded-xl font-bold text-white text-sm" style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}>
                Explore AP Chemistry →
              </Link>
              <Link href="/labs" className="px-7 py-3 rounded-xl font-semibold text-white text-sm border border-zinc-700">
                Try Interactive Labs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
