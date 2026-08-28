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

  // international.chem-mantra.online serves this same app's existing
  // education routes (ap-chemistry, usnco, icho, organic-chemistry, labs,
  // blog, ebook, q) directly -- no path-prefix rewrite needed since those
  // routes already live at these exact paths, unlike patent-analytics
  // below. Domain-split migration (2026-08-28), step 3: root "/" now
  // rewrites (not redirects) to the real dedicated homepage at
  // /international-home, same pattern as the patent-analytics rewrite below
  // -- the URL bar stays at the clean root, replacing the provisional
  // 302-to-/ap-chemistry from step 1.
  if (host === 'international.chem-mantra.online' || host === 'www.international.chem-mantra.online') {
    const p = request.nextUrl.pathname
    if (p === '/robots.txt' || p === '/sitemap.xml' || p.startsWith('/api') || p.startsWith('/_next')) {
      return NextResponse.next()
    }
    if (p === '/') {
      const url = request.nextUrl.clone()
      url.pathname = '/international-home'
      return NextResponse.rewrite(url)
    }
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
    // Real bug found 2026-08-29: every internal <Link> across this product
    // (21 occurrences, 8 files) hardcodes an href starting with
    // "/patent-analytics/..." -- correct for direct access via
    // www.thechemsolver.com/patent-analytics/*, but on THIS subdomain the
    // browser resolves that href against patent-analytics.thechemsolver.com
    // itself, producing an ugly double-prefixed URL
    // (patent-analytics.thechemsolver.com/patent-analytics/data/...) that
    // the rewrite below then just serves as-is (its own startsWith check
    // sees the prefix already present and skips rewriting) -- it works, but
    // the address bar and canonical tag disagree, an SEO problem on every
    // single click. Rather than editing all 8 files, self-heal it here:
    // strip the redundant prefix and 301 to the clean equivalent, which
    // matches this product's own <link rel=canonical> URLs.
    if (p === '/patent-analytics' || p.startsWith('/patent-analytics/')) {
      const url = request.nextUrl.clone()
      url.pathname = p === '/patent-analytics' ? '/' : p.slice('/patent-analytics'.length)
      return NextResponse.redirect(url, 301)
    }
    if (!p.startsWith('/api') && !p.startsWith('/_next')) {
      const url = request.nextUrl.clone()
      url.pathname = `/patent-analytics${p === '/' ? '' : p}`
      return NextResponse.rewrite(url)
    }
  }

  // Step 2 of the domain-split migration (2026-08-28): the education
  // sections below now live at international.chem-mantra.online (step 1,
  // already deployed and confirmed working). Anyone hitting these paths on
  // the old thechemsolver.com host gets a permanent redirect to the new
  // host, same path preserved -- this is what actually moves the SEO
  // equity/traffic over, not just serving the new host correctly. The site
  // root ("/") is deliberately NOT included here: it's the AdSense-funnel
  // homepage and moving it is a separate, bigger decision than this
  // path-prefix migration.
  const EDU_PATH_PREFIXES = ['/ap-chemistry', '/usnco', '/icho', '/organic-chemistry', '/labs', '/blog', '/ebook', '/q']
  if (host === 'thechemsolver.com' || host === 'www.thechemsolver.com') {
    const p = request.nextUrl.pathname
    if (EDU_PATH_PREFIXES.some((prefix) => p === prefix || p.startsWith(`${prefix}/`))) {
      const url = new URL(`https://international.chem-mantra.online${p}${request.nextUrl.search}`)
      return NextResponse.redirect(url, 301)
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
