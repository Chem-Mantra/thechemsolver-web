import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Admin dashboard -- also has its own per-page noindex metadata, this
      // is belt-and-suspenders. Both path forms disallowed since the same
      // route resolves at "/patent-analytics/admin" on the main domain and
      // at "/admin" on the patent-analytics subdomain (middleware.ts
      // rewrites the latter into the former internally).
      disallow: ['/patent-analytics/admin', '/admin'],
    },
    sitemap: 'https://www.thechemsolver.com/sitemap.xml',
  }
}
