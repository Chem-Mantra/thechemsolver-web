import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { AP_UNITS } from '@/data/apUnits'

// GET /api/ap/chapters
// Returns all 9 AP units with their MCQ/FRQ counts from APChapterMCQ/APChapterFRQ.
export async function GET() {
  const [mcqRes, frqRes] = await Promise.all([
    supabase.from('APChapterMCQ').select('unit_number'),
    supabase.from('APChapterFRQ').select('unit_number'),
  ])

  if (mcqRes.error) return NextResponse.json({ error: mcqRes.error.message }, { status: 500 })
  if (frqRes.error) return NextResponse.json({ error: frqRes.error.message }, { status: 500 })

  const mcqCounts = new Map<number, number>()
  for (const row of mcqRes.data ?? []) {
    mcqCounts.set(row.unit_number, (mcqCounts.get(row.unit_number) ?? 0) + 1)
  }
  const frqCounts = new Map<number, number>()
  for (const row of frqRes.data ?? []) {
    frqCounts.set(row.unit_number, (frqCounts.get(row.unit_number) ?? 0) + 1)
  }

  const units = AP_UNITS.map(u => ({
    n: u.n,
    name: u.name,
    weight: u.weight,
    mcq_count: mcqCounts.get(u.n) ?? 0,
    frq_count: frqCounts.get(u.n) ?? 0,
  }))

  return NextResponse.json(units)
}
