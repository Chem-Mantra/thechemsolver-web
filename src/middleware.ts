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
    return NextResponse.redirect(url, 308)
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
