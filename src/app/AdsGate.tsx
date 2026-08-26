'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'

/** Loads the AdSense script unconditionally on the student site. There are
 * no live <ins class="adsbygoogle"> units yet (see the AdSlot placeholders
 * in LabSEOShell.tsx) — once real ad units are added, gate premium users
 * out at that <ins> level instead of here, so the base script tag stays
 * reliably present for crawlers (including AdSense's own review crawler)
 * regardless of auth/premium state.
 *
 * Excluded on Patent Analytics — a B2B page pitching services to law firms
 * has no business showing AdSense units. Subdomain access rewrites the
 * path internally, invisible to usePathname() (it keeps returning the
 * pre-rewrite path), so window.location.hostname is checked too. */
export default function AdsGate({ client }: { client: string }) {
  const pathname = usePathname()
  const [isPatentAnalyticsHost, setIsPatentAnalyticsHost] = useState(false)

  useEffect(() => {
    setIsPatentAnalyticsHost(window.location.hostname.startsWith('patent-analytics.'))
  }, [])

  if (pathname?.startsWith('/patent-analytics') || isPatentAnalyticsHost) return null

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}
