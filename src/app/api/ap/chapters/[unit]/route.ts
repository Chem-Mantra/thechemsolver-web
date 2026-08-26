import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/ap/chapters/3?type=mcq
// GET /api/ap/chapters/3?type=frq
export async function GET(req: NextRequest, props: { params: Promise<{ unit: string }> }) {
  const params = await props.params;
  const unit = parseInt(params.unit)
  const { searchParams } = req.nextUrl
  const type = searchParams.get('type')

  if (Number.isNaN(unit)) {
    return NextResponse.json({ error: 'unit must be a number 1-9' }, { status: 400 })
  }
  if (type !== 'mcq' && type !== 'frq') {
    return NextResponse.json({ error: 'type must be "mcq" or "frq"' }, { status: 400 })
  }

  if (type === 'mcq') {
    const { data, error } = await supabase
      .from('APChapterMCQ')
      .select('id, stem, options, correct_answer, topic, subtopic, has_visual, image_url, unit_title, year')
      .eq('unit_number', unit)
      .order('year')
      .order('question_number')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data ?? [])
  }

  const { data, error } = await supabase
    .from('APChapterFRQ')
    .select('id, problem_number, frq_type, context, parts, total_points, topic, has_visual, image_url, unit_title, year')
    .eq('unit_number', unit)
    .order('year')
    .order('problem_number')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
