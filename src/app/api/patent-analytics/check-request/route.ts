import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Instant Compound Check ($10 tier): looks up whether we've already
// screened a given patent. If yes, points straight at the result. If not,
// captures the request and notifies the founder so it can be run through
// the pipeline by hand -- this is the "email you within 1 hour" promise,
// not a fully automated turnaround (no daily-automation infra exists yet
// for on-demand single-patent runs).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const patentNumber = typeof body?.patentNumber === 'string' ? body.patentNumber.trim().toUpperCase() : ''
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const name = typeof body?.name === 'string' ? body.name.trim() : ''

  if (!patentNumber || !email) {
    return NextResponse.json({ error: 'Patent number and email are required.' }, { status: 400 })
  }

  // Check both live-data products for an existing auto-verified result.
  const { data: existing } = await supabaseAdmin
    .from('product_results')
    .select('product_type, patent_number')
    .eq('patent_number', patentNumber)
    .eq('confidence_tier', 'auto_verified')
    .limit(1)
    .maybeSingle()

  if (existing) {
    const slugMap: Record<string, string> = { fto_triage: 'fto-triage', portfolio_landscape: 'portfolio-landscape' }
    const slug = slugMap[existing.product_type] || existing.product_type
    return NextResponse.json({
      found: true,
      // Absolute, not "/patent-analytics/data/...": that relative form only
      // resolves correctly when this API is called from the main-domain
      // direct-access path. Called from the subdomain (the only place this
      // modal is actually wired up), a relative link with that prefix hits
      // the exact double-prefix bug fixed in middleware.ts 2026-08-29 --
      // middleware.ts now 301s it back to the right place, but that's a
      // safety net, not a reason to still emit the wrong URL on a
      // conversion-critical, paid-flow "view your result" link.
      url: `https://patent-analytics.thechemsolver.com/data/${slug}/${existing.patent_number}`,
    })
  }

  const { error: dbError } = await supabaseAdmin
    .from('check_requests')
    .insert({ patent_number: patentNumber, requester_email: email, requester_name: name || null })

  if (dbError) {
    return NextResponse.json({ error: 'Failed to save your request.', detail: dbError.message }, { status: 500 })
  }

  // Best-effort founder notification -- never blocks the user-facing
  // response, same pattern as every other notification email in this app.
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  const notifyTo = process.env.PATENT_NEWS_NOTIFY_EMAIL || 'kotian333@gmail.com'
  if (apiKey && from) {
    try {
      const resend = new Resend(apiKey)
      await resend.emails.send({
        from,
        to: notifyTo,
        subject: `Check request: ${patentNumber} (no data yet)`,
        text: `A visitor requested a check on ${patentNumber} but we don't have it yet.\n\nRequester: ${name || '(no name)'} <${email}>\n\nRun it through the pipeline and upload via 04_upload_to_website.py -- the fulfillment step will automatically email them the result once it's uploaded.`,
      })
    } catch (err) {
      console.warn('check-request founder notification failed (non-blocking):', err)
    }
  } else {
    console.warn('RESEND_API_KEY/RESEND_FROM_EMAIL not set — skipping check-request notification.')
  }

  return NextResponse.json({
    found: false,
    message: "We don't have data on this patent yet. We'll run it and email you the results within 1 hour.",
  })
}
