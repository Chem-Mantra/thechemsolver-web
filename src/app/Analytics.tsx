'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { GA_ID, trackEvent, TCSEvents } from '@/lib/analytics'

export default function Analytics() {
  const pathname = usePathname()

  // SPA-style page views + hub/lab engagement signals
  useEffect(() => {
    if (!GA_ID || typeof window === 'undefined' || !window.gtag) return
    window.gtag('config', GA_ID, { page_path: pathname })

    if (!pathname) return
    if (pathname.startsWith('/labs/') && pathname !== '/labs') {
      const slug = pathname.split('/')[2]
      if (slug) trackEvent(TCSEvents.labOpen, { lab_slug: slug })
    }
    const hubs = ['/ap-chemistry', '/organic-chemistry', '/usnco', '/icho']
    if (hubs.includes(pathname)) {
      trackEvent(TCSEvents.hubView, { hub: pathname.slice(1) })
    }
  }, [pathname])

  if (process.env.NODE_ENV !== 'production') return null
  if (!GA_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { page_path: window.location.pathname });
        `}
      </Script>
    </>
  )
}
