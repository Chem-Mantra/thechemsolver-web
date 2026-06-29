import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/ap/frq?year=2024
// GET /api/ap/frq?years=true   → [2023, 2024, 2025, 2026]
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const year  = searchParams.get('year')
  const years = searchParams.get('years')

  if (years === 'true') {
    const { data, error } = await supabase
      .from('QBankFRQ')
      .select('year')
      .eq('source', 'AP_FRQ')
      .order('year')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    const unique = [...new Set((data ?? []).map(r => r.year))].sort()
    return NextResponse.json(unique)
  }

  if (!year) return NextResponse.json({ error: 'year required' }, { status: 400 })

  const { data, error } = await supabase
    .from('QBankFRQ')
    .select('id, problem_number, frq_type, context, parts, total_points, topic, has_visual, image_url')
    .eq('source', 'AP_FRQ')
    .eq('year', parseInt(year))
    .order('problem_number')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
