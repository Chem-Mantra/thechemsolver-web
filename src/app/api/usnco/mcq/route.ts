import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/usnco/mcq?source=USNCO_Local&year=2024
// GET /api/usnco/mcq?years=true   → returns available {source, year} pairs
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const source = searchParams.get('source')  // 'USNCO_Local' | 'USNCO_Nat_Part1'
  const year   = searchParams.get('year')
  const years  = searchParams.get('years')   // if 'true', return available years only

  if (years === 'true') {
    const { data, error } = await supabase
      .from('QBankMCQ')
      .select('source, year')
      .order('source').order('year')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    // Deduplicate
    const seen = new Set<string>()
    const unique = (data ?? []).filter(r => {
      const key = `${r.source}_${r.year}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    return NextResponse.json(unique)
  }

  if (!source || !year) {
    return NextResponse.json({ error: 'source and year required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('QBankMCQ')
    .select('id, question_number, stem, options, correct_answer, topic, subtopic, has_visual, image_url')
    .eq('source', source)
    .eq('year', parseInt(year))
    .order('question_number')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
