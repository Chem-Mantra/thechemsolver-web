'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Capacitor } from '@capacitor/core'

/**
 * Locks the screen to landscape while viewing an individual simulation
 * (not the /labs index itself), then restores auto-rotate on the way out.
 *
 * - Native app: @capacitor/screen-orientation gives a real, reliable lock.
 * - Mobile web/PWA: the Screen Orientation Lock API only works in Chrome/
 *   Android, and only while in fullscreen — iOS Safari has never supported
 *   it, even installed. So on the web we attempt the lock as a bonus, and
 *   always show a "rotate your phone" hint for portrait mobile viewports
 *   as the honest, universally-working fallback.
 */
export default function LabOrientation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isSimulationPage = pathname !== '/labs' && pathname !== null
  const [showRotateHint, setShowRotateHint] = useState(false)

  useEffect(() => {
    if (!isSimulationPage) return

    let cancelled = false
    const cleanupFns: Array<() => void> = []

    const mobilePortrait = () =>
      window.matchMedia('(orientation: portrait)').matches && window.matchMedia('(max-width: 900px)').matches

    if (Capacitor.isNativePlatform()) {
      import('@capacitor/screen-orientation').then(({ ScreenOrientation }) => {
        if (cancelled) return
        ScreenOrientation.lock({ orientation: 'landscape' }).catch(() => {})
        cleanupFns.push(() => {
          ScreenOrientation.unlock().catch(() => {})
        })
      })
    } else {
      // Best-effort on the web — silently no-ops where unsupported (iOS Safari,
      // non-fullscreen contexts). `.lock()` isn't in TS's DOM lib (non-standard
      // outside Chromium), so it's typed loosely here on purpose.
      // Never blocks the rotate-hint fallback below.
      const webOrientation = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> }
      webOrientation?.lock?.('landscape').catch(() => {})

      const updateHint = () => setShowRotateHint(mobilePortrait())
      updateHint()
      const mq = window.matchMedia('(orientation: portrait)')
      mq.addEventListener('change', updateHint)
      window.addEventListener('resize', updateHint)
      cleanupFns.push(() => {
        mq.removeEventListener('change', updateHint)
        window.removeEventListener('resize', updateHint)
      })
    }

    return () => {
      cancelled = true
      setShowRotateHint(false)
      cleanupFns.forEach((fn) => fn())
    }
  }, [isSimulationPage, pathname])

  return (
    <>
      {showRotateHint && (
        <div className="rotate-hint" role="status">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="rotate-hint-icon">
            <rect x="6" y="2" width="12" height="20" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M9 20h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <p>Rotate your phone for the best view of this simulation</p>
        </div>
      )}
      {children}
    </>
  )
}
