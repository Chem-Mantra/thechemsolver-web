/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false
    return config
  },
  typescript: {
    ignoreBuildErrors: false,
  },
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
  },

  async redirects() {
    // These /strategy pages were merged directly into their exam hub pages.
    return [
      { source: '/usnco/strategy',             destination: '/usnco',             permanent: true },
      { source: '/icho/strategy',              destination: '/icho',              permanent: true },
      { source: '/organic-chemistry/strategy', destination: '/organic-chemistry', permanent: true },
    ]
  },

  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://securepubads.g.doubleclick.net https://tpc.googlesyndication.com https://*.google.com https://*.gstatic.com https://checkout.razorpay.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https://storage.googleapis.com https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://*.gstatic.com https://*.razorpay.com https://*.googleusercontent.com",
      "connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://*.supabase.co https://pagead2.googlesyndication.com https://*.doubleclick.net https://*.google.com https://*.razorpay.com",
      "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.doubleclick.net https://*.google.com https://api.razorpay.com https://checkout.razorpay.com",
      "worker-src 'self'",
      "manifest-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
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
