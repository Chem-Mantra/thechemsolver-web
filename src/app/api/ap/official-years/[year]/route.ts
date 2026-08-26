import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/ap/official-years/2019?type=mcq
// GET /api/ap/official-years/2019?type=frq
export async function GET(req: NextRequest, props: { params: Promise<{ year: string }> }) {
  const params = await props.params;
  const year = parseInt(params.year)
  const { searchParams } = req.nextUrl
  const type = searchParams.get('type')

  if (Number.isNaN(year)) {
    return NextResponse.json({ error: 'year must be a number' }, { status: 400 })
  }
  if (type !== 'mcq' && type !== 'frq') {
    return NextResponse.json({ error: 'type must be "mcq" or "frq"' }, { status: 400 })
  }

  if (type === 'mcq') {
    const { data, error } = await supabase
      .from('QBankMCQ')
      .select('id, question_number, stem, options, correct_answer, topic, subtopic, has_visual, image_url, year')
      .eq('source', 'AP_Official_MCQ')
      .eq('year', year)
      .order('question_number')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data ?? [])
  }

  const { data, error } = await supabase
    .from('QBankFRQ')
    .select('id, problem_number, frq_type, context, parts, total_points, topic, has_visual, image_url, year')
    .eq('source', 'AP_Official_FRQ')
    .eq('year', year)
    .order('problem_number')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // AP_Official_FRQ stores parts as {part_label, question_text, points,
  // scoring_rubric, has_visual, image_url, ...} -- not the {label, question,
  // points, model_answer, image_url} shape FRQViewer/FRQPart expects.
  type RawPart = {
    part_label?: string
    question_text?: string
    points?: number
    scoring_rubric?: string
    image_url?: string | null
  }
  const transformed = (data ?? []).map(row => ({
    ...row,
    parts: ((row.parts ?? []) as RawPart[]).map(p => ({
      label: p.part_label ?? '',
      question: p.question_text ?? '',
      points: p.points,
      model_answer: p.scoring_rubric,
      image_url: p.image_url ?? undefined,
    })),
  }))

  return NextResponse.json(transformed)
}
