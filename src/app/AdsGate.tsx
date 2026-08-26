'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'

declare global {
  interface Window {
    __PA_HOST__?: boolean
  }
}

/** Loads the AdSense script unconditionally on the student site. There are
 * no live <ins class="adsbygoogle"> units yet (see the AdSlot placeholders
 * in LabSEOShell.tsx) — once real ad units are added, gate premium users
 * out at that <ins> level instead of here, so the base script tag stays
 * reliably present for crawlers (including AdSense's own review crawler)
 * regardless of auth/premium state.
 *
 * Excluded on Patent Analytics — a B2B page pitching services to law firms
 * has no business showing AdSense units. Reads window.__PA_HOST__ (set by
 * a synchronous inline script in layout.tsx, before hydration) directly in
 * the render body rather than via an effect: an effect fires after this
 * component already mounted <Script>, and next/script doesn't undo the
 * network request an unmount triggers -- it has to never render at all. */
export default function AdsGate({ client }: { client: string }) {
  const pathname = usePathname()
  const isPatentAnalyticsHost = typeof window !== 'undefined' && window.__PA_HOST__

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
