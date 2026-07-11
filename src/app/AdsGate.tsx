import Script from 'next/script'

/** Loads the AdSense script unconditionally. There are no live <ins
 * class="adsbygoogle"> units yet (see the AdSlot placeholders in
 * LabSEOShell.tsx) — once real ad units are added, gate premium users out
 * at that <ins> level instead of here, so the base script tag stays
 * reliably present for crawlers (including AdSense's own review crawler)
 * regardless of auth/premium state. */
export default function AdsGate({ client }: { client: string }) {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}
