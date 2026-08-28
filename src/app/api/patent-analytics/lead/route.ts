import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// The one sample report we currently have ready to hand out instantly.
// When more real reports exist, this can become a lookup keyed by
// patentNumber instead of a single fixed file. Absolute subdomain URL, not
// the "/patent-analytics/downloads/..." relative form -- same double-prefix
// class of bug fixed in middleware.ts 2026-08-29 (middleware's own rewrite
// logic happens to route around it safely, but there's no reason to still
// emit the wrong-for-this-host URL from a live lead-capture flow).
const SAMPLE_REPORT_PATH = 'https://patent-analytics.thechemsolver.com/downloads/sample-report.zip'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const company = typeof body?.company === 'string' ? body.company.trim() : ''
  const patentNumber = typeof body?.patentNumber === 'string' ? body.patentNumber.trim() : ''

  if (!name || !email || !company) {
    return NextResponse.json({ error: 'Name, email, and company are required.' }, { status: 400 })
  }

  // Best-effort notification email -- never blocks or fails the actual
  // lead capture / download-link response, matching the same
  // never-throws pattern used elsewhere in this codebase for notifications.
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  const notifyTo = process.env.LEAD_NOTIFY_EMAIL || 'support@thechemsolver.com'
  if (apiKey && from) {
    try {
      const resend = new Resend(apiKey)
      await resend.emails.send({
        from,
        to: notifyTo,
        subject: `New patent-analytics lead: ${company}`,
        html: `
          <p><b>Name:</b> ${escapeHtml(name)}</p>
          <p><b>Email:</b> ${escapeHtml(email)}</p>
          <p><b>Company/Firm:</b> ${escapeHtml(company)}</p>
          <p><b>Patent of interest:</b> ${escapeHtml(patentNumber) || '(not provided)'}</p>
        `,
      })
    } catch (err) {
      console.warn('patent-analytics lead notification email failed (non-blocking):', err)
    }
  } else {
    console.warn('RESEND_API_KEY/RESEND_FROM_EMAIL not set — skipping lead notification email.')
  }

  // Relative path -- works correctly in both local dev and production
  // without depending on an env var matching whichever environment this
  // is actually running in.
  return NextResponse.json({ downloadUrl: SAMPLE_REPORT_PATH })
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))
}
