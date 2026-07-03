import type { CapacitorConfig } from '@capacitor/cli'

// Production: the native shell loads the live, server-rendered Next.js site
// directly (same origin as the CSP headers in next.config.mjs already allow).
// This app cannot ship as a static bundle: /api/ap, /api/icho, /api/usnco
// are live Supabase-backed route handlers that only work against a running
// Next.js server.
const PROD_URL = 'https://www.thechemsolver.com'

// Laptop-only dev/testing: point the native shell at a LAN-reachable
// `next dev` server instead of production, e.g.:
//   CAPACITOR_DEV_SERVER_URL=http://192.168.1.23:3000 npx cap sync ios
const devUrl = process.env.CAPACITOR_DEV_SERVER_URL
const isDevHttp = !!devUrl && devUrl.startsWith('http://')

const config: CapacitorConfig = {
  appId: 'com.thechemsolver.app',
  appName: 'TheChemSolver',
  webDir: 'www',
  backgroundColor: '#08020d',
  server: {
    url: devUrl || PROD_URL,
    cleartext: isDevHttp,
    androidScheme: 'https',
    allowNavigation: [
      'thechemsolver.com',
      '*.thechemsolver.com',
      '*.supabase.co',
      'pagead2.googlesyndication.com',
      'googleads.g.doubleclick.net',
      'securepubads.g.doubleclick.net',
      'tpc.googlesyndication.com',
      '*.google.com',
      '*.gstatic.com',
      '*.doubleclick.net',
      // Razorpay checkout — some card 3D-Secure/OTP bank flows escape their
      // iframe to a top-level redirect on mobile.
      '*.razorpay.com',
    ],
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#08020d',
  },
  android: {
    backgroundColor: '#08020d',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 600,
      launchAutoHide: false,
      backgroundColor: '#08020d',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
}

export default config
