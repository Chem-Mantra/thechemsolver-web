'use client'

import { Capacitor } from '@capacitor/core'
import { supabase } from './supabase'

// Must match the custom URL scheme registered in capacitor.config.ts,
// ios/App/App/Info.plist, and android/app/src/main/AndroidManifest.xml —
// and must be added to Supabase's Auth → URL Configuration → Redirect URLs
// allowlist (see docs/RAZORPAY_SETUP.md).
export const NATIVE_AUTH_REDIRECT = 'com.thechemsolver.app://auth-callback'

/**
 * Google sign-in that works both on the regular website and inside the
 * Capacitor app. Google blocks OAuth consent screens from loading inside
 * embedded WebViews (including Capacitor's), so on native we open the
 * system browser instead and catch the redirect via a deep link —
 * see AuthCallbackListener.tsx.
 */
export async function signInWithGoogle() {
  const isNative = Capacitor.isNativePlatform()
  const redirectTo = isNative ? NATIVE_AUTH_REDIRECT : window.location.href

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: true },
  })

  if (error || !data?.url) {
    throw error ?? new Error('Could not start Google sign-in.')
  }

  if (isNative) {
    const { Browser } = await import('@capacitor/browser')
    await Browser.open({ url: data.url })
  } else {
    window.location.href = data.url
  }
}
