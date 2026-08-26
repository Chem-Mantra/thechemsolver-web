/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false
    return config
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // ESLint runs during `next build`. Rules tuned in .eslintrc.json so content
  // apostrophes / intentional hook deps don't fail production (see CI).
  eslint: {
    ignoreDuringBuilds: false,
  },
  poweredByHeader: false,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' }, // Google account avatars
    ],
    // Supabase Storage's public object endpoint always sends `cache-control:
    // no-cache` regardless of upload metadata, forcing a revalidation round
    // trip on every single image load. Question diagrams are immutable once
    // published, so cache the optimizer's output for a year instead of the
    // 60s default -- repeat views become instant from edge/browser cache.
    minimumCacheTTL: 31536000,
  },

  async redirects() {
    // These /strategy pages were merged directly into their exam hub pages.
    // The /labs/organic-* ones were renamed slugs — previously handled with
    // client-side `router.replace()` stub pages, which Search Console flagged
    // as "Page with redirect" / "Duplicate without user-selected canonical"
    // (a JS-driven redirect is a much weaker signal to crawlers than a real
    // HTTP redirect, and the stub page itself had no canonical tag).
    //
    // Host-level www/non-www + http→https is handled in src/middleware.ts
    // (Next path redirects cannot rewrite Host).
    return [
      { source: '/usnco/strategy',             destination: '/usnco',             permanent: true },
      { source: '/icho/strategy',              destination: '/icho',              permanent: true },
      { source: '/organic-chemistry/strategy', destination: '/organic-chemistry', permanent: true },
      { source: '/labs/organic-sequence',           destination: '/labs/organic-mechanism', permanent: true },
      { source: '/labs/organic-mechanism-sequence', destination: '/labs/mechanisms',        permanent: true },
      { source: '/labs/organic-stereo',             destination: '/labs/stereochemistry',   permanent: true },
    ]
  },

  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://securepubads.g.doubleclick.net https://tpc.googlesyndication.com https://*.google.com https://*.gstatic.com https://checkout.razorpay.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https://storage.googleapis.com https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://*.gstatic.com https://*.razorpay.com https://*.googleusercontent.com https://www.paypalobjects.com",
      "connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://*.supabase.co https://pagead2.googlesyndication.com https://*.doubleclick.net https://*.google.com https://*.razorpay.com",
      "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.doubleclick.net https://*.google.com https://api.razorpay.com https://checkout.razorpay.com",
      "worker-src 'self'",
      "manifest-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://www.paypal.com",
      "upgrade-insecure-requests",
    ].join('; ')

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control',   value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy',   value: csp },
        ],
      },
    ]
  },
}

export default nextConfig
