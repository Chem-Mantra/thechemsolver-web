import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { notifyAdminWhatsApp } from '@/lib/whatsapp'

export const dynamic = 'force-dynamic'

const EXAMS = ['AP Chemistry', 'Organic Chemistry (Orgo 1 & 2)', 'USNCO', 'IChO'] as const

type Body = {
  studentName?: string
  email?: string
  mobile?: string
  examInterest?: string | string[]
  country?: string
  gradeYear?: string
  message?: string
  source?: string
}

export async function POST(req: NextRequest) {
  let body: Body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const studentName = (body.studentName || '').trim()
  const email = (body.email || '').trim().toLowerCase()
  const mobile = (body.mobile || '').replace(/\D/g, '')
  const country = (body.country || '').trim()
  const gradeYear = (body.gradeYear || '').trim()
  const message = (body.message || '').trim()
  const source = (body.source || 'homepage_interest').trim()

  let exams: string[] = []
  if (Array.isArray(body.examInterest)) {
    exams = body.examInterest.map(String)
  } else if (typeof body.examInterest === 'string' && body.examInterest) {
    exams = body.examInterest.split(',').map((s) => s.trim()).filter(Boolean)
  }

  if (!studentName) {
    return NextResponse.json({ error: 'Student name is required' }, { status: 422 })
  }
  if (!email && mobile.length < 10) {
    return NextResponse.json({ error: 'Email or mobile (10+ digits) is required' }, { status: 422 })
  }
  if (exams.length === 0) {
    return NextResponse.json(
      { error: 'Select at least one exam: AP Chemistry, Orgo, USNCO, or IChO' },
      { status: 422 },
    )
  }

  // Soft-validate known exam labels (allow free text extras)
  const examLabel = exams.join(', ')

  // Persist to Supabase Leads (email unique). Encode details in source_page.
  const supabaseUrl = process.env.NEXT_PUBLIC_THECHEMSOLVER_SUPABASE_URL
  const serviceKey = process.env.THECHEMSOLVER_SUPABASE_SERVICE_KEY
  const leadEmail = email || `phone-${mobile}@lead.thechemsolver.local`
  const sourcePayload = JSON.stringify({
    kind: 'exam_interest',
    studentName,
    mobile: mobile || null,
    email: email || null,
    exams,
    country: country || null,
    gradeYear: gradeYear || null,
    message: message || null,
    source,
    at: new Date().toISOString(),
  })

  let leadId: number | null = null
  if (supabaseUrl && serviceKey) {
    try {
      const admin = createClient(supabaseUrl, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
      const { data, error } = await admin
        .from('Leads')
        .upsert(
          { email: leadEmail, source_page: sourcePayload.slice(0, 2000) },
          { onConflict: 'email' },
        )
        .select('id')
        .maybeSingle()
      if (error) console.error('[interest] supabase', error)
      else leadId = (data as { id?: number } | null)?.id ?? null
    } catch (err) {
      console.error('[interest] supabase exception', err)
    }
  }

  // Real-time WhatsApp to founder
  const notifyText =
    `📩 TheChemSolver — exam interest\n\n` +
    `Name: ${studentName}\n` +
    (email ? `Email: ${email}\n` : '') +
    (mobile ? `Mobile: ${mobile}\n` : '') +
    `Exam(s): ${examLabel}\n` +
    (gradeYear ? `Grade/Year: ${gradeYear}\n` : '') +
    (country ? `Country: ${country}\n` : '') +
    (message ? `Note: ${message}\n` : '') +
    `Source: ${source}`

  const wa = await notifyAdminWhatsApp(notifyText)
  if (!wa.ok) {
    console.error('[interest] WhatsApp notify failed:', wa.detail)
  }

  return NextResponse.json({
    success: true,
    id: leadId,
    whatsapp: wa.ok,
    exams: EXAMS, // available options for clients
  })
}
