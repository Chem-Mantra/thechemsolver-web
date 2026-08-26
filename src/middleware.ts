import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/** Canonical host for SEO — matches sitemap.ts and layout metadata. */
const CANONICAL_HOST = 'www.thechemsolver.com'

/**
 * Force https + www so Search Console stops seeing
 * "Duplicate without user-selected canonical" across www / non-www / http.
 */
export function middleware(request: NextRequest) {
  const hostHeader = request.headers.get('host') || ''
  const host = hostHeader.split(':')[0].toLowerCase()

  // Local / preview hosts — do not redirect
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.vercel.app') ||
    host.endsWith('.local')
  ) {
    return NextResponse.next()
  }

  // patent-analytics.thechemsolver.com is a subdomain, not a separate
  // deployment — DNS points it at this same app, so its root path needs
  // an internal rewrite to the /patent-analytics route. Everything the
  // page itself references (assets, API routes) already uses full
  // /patent-analytics/... or /api/patent-analytics/... paths, so only
  // the bare root needs rewriting here.
  if (host === 'patent-analytics.thechemsolver.com' && request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/patent-analytics'
    return NextResponse.rewrite(url)
  }

  const proto =
    request.headers.get('x-forwarded-proto') ||
    request.nextUrl.protocol.replace(':', '') ||
    'https'

  const needsHost = host === 'thechemsolver.com'
  const needsHttps = proto === 'http'

  if (needsHost || needsHttps) {
    const url = request.nextUrl.clone()
    url.protocol = 'https:'
    url.hostname = CANONICAL_HOST
    url.port = ''
    // 301 = permanent (stronger SEO signal than 308 for host consolidation)
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths except Next internals and common static files.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
