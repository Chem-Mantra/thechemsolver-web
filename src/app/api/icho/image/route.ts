import { NextRequest } from 'next/server'

// Proxies IChO question-diagram images through our own origin instead of the
// browser embedding Supabase Storage's public URL directly.
//
// Root cause (2026-07-20): the exact same Supabase Storage object that loads
// fine via a direct top-level navigation returns a 503 when fetched as a
// cross-origin embedded <img> from thechemsolver.com -- consistent with
// hotlink-style abuse protection treating cross-site image-embed requests
// more strictly than normal navigation. Fetching server-to-server from here
// (Vercel -> Supabase) doesn't carry that "embedded from another site"
// signature. This also lets us set our own cache headers, since Supabase's
// public object endpoint always sends cache-control: no-cache.
//
// Only ever proxies from this fixed bucket -- prevents this becoming an
// open SSRF proxy for arbitrary URLs.
const ALLOWED_PREFIX =
  'https://jmdyfboaowxagxrshaab.supabase.co/storage/v1/object/public/question-images/'

export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get('src')
  if (!src || !src.startsWith(ALLOWED_PREFIX)) {
    return new Response('Invalid src', { status: 400 })
  }

  let upstream: Response
  try {
    upstream = await fetch(src, { cache: 'no-store' })
  } catch {
    return new Response('Upstream fetch failed', { status: 502 })
  }

  if (!upstream.ok || !upstream.body) {
    return new Response('Upstream error', { status: 502 })
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': upstream.headers.get('content-type') ?? 'image/png',
      // Question diagrams are immutable once published -- cache hard so
      // repeat views are instant and we don't re-hit Supabase per view.
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
