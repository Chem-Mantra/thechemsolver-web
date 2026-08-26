import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const state = req.nextUrl.searchParams.get('state')
  const storedState = req.cookies.get('li_oauth_state')?.value
  const error = req.nextUrl.searchParams.get('error')

  if (error) {
    return NextResponse.json({ error: `LinkedIn returned an error: ${error}` }, { status: 400 })
  }
  if (!code || !state || state !== storedState) {
    // Specific diagnostic (temporary, while debugging a real reported
    // failure) rather than one generic message covering three different
    // possible causes.
    return NextResponse.json(
      {
        error: 'Invalid or missing OAuth state/code.',
        debug: {
          hasCode: Boolean(code),
          hasStateParam: Boolean(state),
          hasStoredCookie: Boolean(storedState),
          statesMatch: state === storedState,
          allCookieNames: req.cookies.getAll().map((c) => c.name),
        },
      },
      { status: 400 },
    )
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'LinkedIn credentials not configured.' }, { status: 500 })
  }

  const redirectUri = `${req.nextUrl.origin}/api/patent-analytics/linkedin/callback`

  // Exchange the authorization code for an access token.
  const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })
  if (!tokenRes.ok) {
    const text = await tokenRes.text()
    return NextResponse.json({ error: 'Token exchange failed', detail: text }, { status: 502 })
  }
  const tokenData = await tokenRes.json()
  const accessToken: string = tokenData.access_token
  const refreshToken: string | undefined = tokenData.refresh_token
  const expiresInSeconds: number = tokenData.expires_in

  // Get the member's URN (needed as the "author" on every post).
  const meRes = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!meRes.ok) {
    const text = await meRes.text()
    return NextResponse.json({ error: 'Fetching LinkedIn profile failed', detail: text }, { status: 502 })
  }
  const me = await meRes.json()
  const memberUrn = `urn:li:person:${me.sub}`

  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString()

  const { error: dbError } = await supabaseAdmin.from('linkedin_tokens').upsert({
    id: 1,
    access_token: accessToken,
    refresh_token: refreshToken ?? null,
    expires_at: expiresAt,
    member_urn: memberUrn,
    updated_at: new Date().toISOString(),
  })
  if (dbError) {
    return NextResponse.json({ error: 'Failed to store LinkedIn token', detail: dbError.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    message: `LinkedIn connected as ${me.name || memberUrn}. You can now close this tab.`,
    memberUrn,
    expiresAt,
  })
}
