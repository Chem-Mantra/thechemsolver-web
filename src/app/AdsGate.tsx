'use client'

import Script from 'next/script'
import { useAuth } from './AuthProvider'

/** Loads the AdSense script only for non-premium visitors. */
export default function AdsGate({ client }: { client: string }) {
  const { premium } = useAuth()

  if (premium.loading || premium.isPremium) return null

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}
