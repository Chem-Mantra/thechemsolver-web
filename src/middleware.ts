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
  // deployment — DNS points it at this same app, so every path under it
  // (the landing page, /news/[slug] article pages, etc.) needs an
  // internal rewrite into /patent-analytics/... . API routes and Next
  // internals already live at their real paths regardless of host, so
  // they're left alone.
  if (host === 'patent-analytics.thechemsolver.com') {
    const p = request.nextUrl.pathname
    // robots.txt/sitemap.xml are Next.js metadata routes that live at the
    // root (/robots.txt, /sitemap.xml), not under /patent-analytics/... --
    // rewriting them the same way everything else is rewritten pointed at
    // a path that doesn't exist and 404'd. Serve them as-is; sitemap.ts
    // already lists the subdomain's own URLs as absolute paths.
    if (p === '/robots.txt' || p === '/sitemap.xml') {
      return NextResponse.next()
    }
    if (!p.startsWith('/patent-analytics') && !p.startsWith('/api') && !p.startsWith('/_next')) {
      const url = request.nextUrl.clone()
      url.pathname = `/patent-analytics${p === '/' ? '' : p}`
      return NextResponse.rewrite(url)
    }
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
