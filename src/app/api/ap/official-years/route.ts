import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/ap/official-years
// Returns each exam year (2012-2019 practice exams) with its MCQ/FRQ counts,
// from QBankMCQ/QBankFRQ source='AP_Official_MCQ'/'AP_Official_FRQ'.
export async function GET() {
  const [mcqRes, frqRes] = await Promise.all([
    supabase.from('QBankMCQ').select('year').eq('source', 'AP_Official_MCQ'),
    supabase.from('QBankFRQ').select('year').eq('source', 'AP_Official_FRQ'),
  ])

  if (mcqRes.error) return NextResponse.json({ error: mcqRes.error.message }, { status: 500 })
  if (frqRes.error) return NextResponse.json({ error: frqRes.error.message }, { status: 500 })

  const mcqCounts = new Map<number, number>()
  for (const row of mcqRes.data ?? []) {
    mcqCounts.set(row.year, (mcqCounts.get(row.year) ?? 0) + 1)
  }
  const frqCounts = new Map<number, number>()
  for (const row of frqRes.data ?? []) {
    frqCounts.set(row.year, (frqCounts.get(row.year) ?? 0) + 1)
  }

  const years = [...new Set([...mcqCounts.keys(), ...frqCounts.keys()])].sort((a, b) => b - a)

  const result = years.map(year => ({
    year,
    mcq_count: mcqCounts.get(year) ?? 0,
    frq_count: frqCounts.get(year) ?? 0,
  }))

  return NextResponse.json(result)
}
