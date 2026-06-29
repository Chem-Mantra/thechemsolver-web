import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/icho?source=IChO_Prep&year=2019
// GET /api/icho?source=IChO_Volumes
// GET /api/icho?years=true   → [{source, year}] pairs
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const source = searchParams.get('source') ?? 'IChO_Prep'
  const year   = searchParams.get('year')
  const years  = searchParams.get('years')

  if (years === 'true') {
    const { data, error } = await supabase
      .from('QBankIChO')
      .select('source, year')
      .order('source').order('year')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    const seen = new Set<string>()
    const unique = (data ?? []).filter(r => {
      const key = `${r.source}_${r.year}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    return NextResponse.json(unique)
  }

  let query = supabase
    .from('QBankIChO')
    .select('id, year, icho_edition, problem_number, title, domain, context, parts, total_points, has_visual, image_url')
    .eq('source', source)
    .order('problem_number')

  if (year) query = query.eq('year', parseInt(year))

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
