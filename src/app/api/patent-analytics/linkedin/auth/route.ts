import { NextRequest, NextResponse } from 'next/server'

// Starts the LinkedIn OAuth flow for personal-profile posting (the
// self-serve "Share on LinkedIn" product -> w_member_social scope, no
// lengthy partner review needed, unlike Company Page posting).
// Visit this route in a browser (while logged into the intended LinkedIn
// account) to begin -- LinkedIn will redirect to /callback with a code.
export async function GET(req: NextRequest) {
  const clientId = process.env.LINKEDIN_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'LINKEDIN_CLIENT_ID not configured' }, { status: 500 })
  }

  const redirectUri = `${req.nextUrl.origin}/api/patent-analytics/linkedin/callback`
  const state = crypto.randomUUID()

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope: 'openid profile w_member_social',
  })

  const res = NextResponse.redirect(`https://www.linkedin.com/oauth/v2/authorization?${params}`)
  // CSRF check on callback -- short-lived, this whole flow takes seconds.
  res.cookies.set('li_oauth_state', state, { httpOnly: true, maxAge: 600, path: '/' })
  return res
}
