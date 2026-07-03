'use client'

import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { supabase } from '@/lib/supabase'
import { NATIVE_AUTH_REDIRECT } from '@/lib/googleAuth'

/**
 * Captures the deep link Google/Supabase redirects to after the system
 * browser completes sign-in (see signInWithGoogle in googleAuth.ts), and
 * exchanges the PKCE `code` for a real session inside the app's WebView.
 */
export default function AuthCallbackListener() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    let remove: (() => void) | undefined
    let cancelled = false

    ;(async () => {
      const [{ App }, { Browser }] = await Promise.all([import('@capacitor/app'), import('@capacitor/browser')])
      if (cancelled) return

      const listener = await App.addListener('appUrlOpen', async ({ url }) => {
        if (!url.startsWith(NATIVE_AUTH_REDIRECT)) return

        try {
          const code = new URL(url).searchParams.get('code')
          if (code) await supabase.auth.exchangeCodeForSession(code)
        } catch (err) {
          console.error('Google sign-in callback failed', err)
        } finally {
          Browser.close().catch(() => {})
        }
      })
      remove = () => listener.remove()
    })()

    return () => {
      cancelled = true
      remove?.()
    }
  }, [])

  return null
}
