import { supabaseAdmin } from './supabase-admin'

// SERVER-ONLY. Posts a text update to the connected personal LinkedIn
// profile via the Posts API (w_member_social scope, "Share on LinkedIn"
// product). Returns null on success, or an error string -- never throws,
// so a LinkedIn failure never blocks the website article from publishing
// (same non-blocking-side-effect discipline used for the lead-notify email).
export async function postToLinkedIn(text: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.from('linkedin_tokens').select('*').eq('id', 1).single()
  if (error || !data) return 'No LinkedIn account connected yet.'
  if (new Date(data.expires_at) <= new Date()) return 'LinkedIn access token expired -- needs reconnecting.'

  const res = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${data.access_token}`,
      'Content-Type': 'application/json',
      'LinkedIn-Version': '202601',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      author: data.member_urn,
      commentary: text,
      visibility: 'PUBLIC',
      distribution: { feedDistribution: 'MAIN_FEED', targetEntities: [], thirdPartyDistributionChannels: [] },
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: false,
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    return `LinkedIn post failed (${res.status}): ${detail}`
  }
  return null
}
