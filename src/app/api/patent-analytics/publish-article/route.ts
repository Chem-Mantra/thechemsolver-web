import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Internal-only endpoint for publishing the daily curated patent-news
// article: writes to Supabase (source of truth the website reads from),
// emails the LinkedIn draft so it survives even if this chat session is
// lost, and returns the draft too. LinkedIn's Community Management API
// needs a registered business entity + approval, so auto-posting as the
// Page isn't available -- the human posts it by hand instead. Protected
// by a shared secret rather than public auth since this is only ever
// called by the daily agent task, never by the browser.
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-internal-secret')
  if (!secret || secret !== process.env.INTERNAL_NOTIFY_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const reqBody = await req.json().catch(() => null)
  const title = typeof reqBody?.title === 'string' ? reqBody.title.trim() : ''
  const summary = typeof reqBody?.summary === 'string' ? reqBody.summary.trim() : ''
  const articleBody = typeof reqBody?.body === 'string' ? reqBody.body.trim() : ''
  const parties = typeof reqBody?.parties === 'string' ? reqBody.parties.trim() : ''
  const sourceUrl = typeof reqBody?.sourceUrl === 'string' ? reqBody.sourceUrl.trim() : ''

  if (!title || !summary || !articleBody || !parties || !sourceUrl) {
    return NextResponse.json({ error: 'title, summary, body, parties, and sourceUrl are all required.' }, { status: 400 })
  }

  // `body` carries our own full write-up of the case, in our own words --
  // visitors read the whole thing here rather than being sent to the
  // source, which is cited only as a small attribution line, not the
  // primary destination.
  const { data, error: dbError } = await supabaseAdmin
    .from('patent_news')
    .insert({ title, summary, body: articleBody, parties, source_url: sourceUrl })
    .select()
    .single()

  if (dbError) {
    return NextResponse.json({ error: 'Failed to save article', detail: dbError.message }, { status: 500 })
  }

  const linkedInDraft = `${title}\n\n${summary}\n\nParties involved: ${parties}\n\nSource: ${sourceUrl}\n\n#PatentLaw #IP #Pharma #ChemistryPatents`

  // Best-effort: emails the draft so it's never stranded in a chat
  // session that might close before you see it. Never blocks or fails
  // the actual publish response, same non-blocking pattern used for the
  // lead-notify email in ../lead/route.ts.
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  const notifyTo = process.env.PATENT_NEWS_NOTIFY_EMAIL || 'kotian333@gmail.com'
  if (apiKey && from) {
    try {
      const resend = new Resend(apiKey)
      await resend.emails.send({
        from,
        to: notifyTo,
        subject: `Patent news published: ${title}`,
        text: `Article is live on the site.\n\n--- LinkedIn draft (paste to patent-analytics.thechemsolver.com Page) ---\n\n${linkedInDraft}`,
      })
    } catch (err) {
      console.warn('patent-news draft email failed (non-blocking):', err)
    }
  } else {
    console.warn('RESEND_API_KEY/RESEND_FROM_EMAIL not set — skipping patent-news draft email.')
  }

  return NextResponse.json({
    success: true,
    article: data,
    linkedInDraft,
  })
}
