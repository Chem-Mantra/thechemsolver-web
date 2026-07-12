'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Capacitor } from '@capacitor/core'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthProvider'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: { credential: string }) => void
            nonce?: string
            use_fedcm_for_prompt?: boolean
            auto_select?: boolean
            cancel_on_tap_outside?: boolean
          }) => void
          prompt: () => void
        }
      }
    }
  }
}

// Skip on the account/sign-in page — showing "sign in as X" over a page
// whose whole purpose is signing in would be confusing.
const SKIP_PREFIXES = ['/account']

// Supabase's signInWithIdToken requires a nonce, hashed with SHA-256 before
// it's sent to Google (the raw nonce is sent to Supabase alongside the
// token) — this is Supabase's documented anti-replay pattern for Google One
// Tap, see https://supabase.com/docs/guides/auth/social-login/auth-google.
async function generateNonce(): Promise<[raw: string, hashed: string]> {
  const raw = crypto.randomUUID()
  const encoded = new TextEncoder().encode(raw)
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded)
  const hashed = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return [raw, hashed]
}

export default function GoogleOneTap() {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const initialized = useRef(false)

  useEffect(() => {
    if (loading || user) return
    if (Capacitor.isNativePlatform()) return // native app has its own Google sign-in (googleAuth.ts)
    if (SKIP_PREFIXES.some((p) => pathname?.startsWith(p))) return
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!clientId) return
    if (initialized.current) return

    let cancelled = false

    generateNonce().then(([rawNonce, hashedNonce]) => {
      if (cancelled) return

      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => {
        if (cancelled || !window.google) return
        window.google.accounts.id.initialize({
          client_id: clientId,
          nonce: hashedNonce,
          // FedCM is the browser-native replacement for the third-party-cookie
          // based session check classic One Tap used — required now that
          // Chrome is phasing those cookies out.
          use_fedcm_for_prompt: true,
          auto_select: false,
          cancel_on_tap_outside: true,
          callback: async (response) => {
            await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.credential,
              nonce: rawNonce,
            })
          },
        })
        window.google.accounts.id.prompt()
        initialized.current = true
      }
      document.body.appendChild(script)
    })

    return () => {
      cancelled = true
    }
  }, [loading, user, pathname])

  return null
}
