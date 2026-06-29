import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/usnco/frq?part=Part2&year=2024
// GET /api/usnco/frq?part=Part3_Lab&year=2024
// GET /api/usnco/frq?years=true&part=Part2   → available years for that part
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const part  = searchParams.get('part')   // 'Part2' | 'Part3_Lab'
  const year  = searchParams.get('year')
  const years = searchParams.get('years')

  const source = part === 'Part3_Lab' ? 'USNCO_Nat_Part3' : 'USNCO_Nat_Part2'

  if (years === 'true') {
    const { data, error } = await supabase
      .from('QBankFRQ')
      .select('year')
      .eq('source', source)
      .order('year')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    const unique = [...new Set((data ?? []).map(r => r.year))].sort()
    return NextResponse.json(unique)
  }

  if (!year) return NextResponse.json({ error: 'year required' }, { status: 400 })

  const { data, error } = await supabase
    .from('QBankFRQ')
    .select('id, problem_number, frq_type, context, parts, total_points, topic, has_visual, image_url')
    .eq('source', source)
    .eq('year', parseInt(year))
    .order('problem_number')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
