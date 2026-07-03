'use client'

import { useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'

/**
 * Native-shell glue. A no-op on the regular website (Capacitor.isNativePlatform()
 * is false in any normal browser), so this never affects the web experience.
 * Mounted once from the root layout.
 */
export default function CapacitorNative() {
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    const cleanupFns: Array<() => void> = []
    let cancelled = false

    ;(async () => {
      const [{ StatusBar, Style }, { SplashScreen }, { App }, { Browser }, { Network }, { Haptics, ImpactStyle }] =
        await Promise.all([
          import('@capacitor/status-bar'),
          import('@capacitor/splash-screen'),
          import('@capacitor/app'),
          import('@capacitor/browser'),
          import('@capacitor/network'),
          import('@capacitor/haptics'),
        ])
      if (cancelled) return

      document.documentElement.dataset.capacitor = Capacitor.getPlatform()

      // Site is dark-themed end to end -> light (white) status bar text.
      try {
        await StatusBar.setStyle({ style: Style.Dark })
        if (Capacitor.getPlatform() === 'android') {
          await StatusBar.setBackgroundColor({ color: '#08020d' })
        }
        await StatusBar.setOverlaysWebView({ overlay: false })
      } catch {
        // StatusBar plugin isn't available on web/some configs — safe to ignore.
      }

      SplashScreen.hide().catch(() => {})

      const backListener = await App.addListener('backButton', () => {
        if (window.history.length > 1) window.history.back()
        else App.exitApp()
      })
      cleanupFns.push(() => backListener.remove())

      const isExternal = (href: string) => {
        try {
          return new URL(href, window.location.href).origin !== window.location.origin
        } catch {
          return false
        }
      }

      const clickHandler = (e: MouseEvent) => {
        const anchor = (e.target as HTMLElement | null)?.closest('a')
        if (!anchor) return
        const href = anchor.getAttribute('href')
        if (!href || href.startsWith('#')) return
        if (href.startsWith('mailto:') || href.startsWith('tel:')) return

        if (isExternal(href) || anchor.target === '_blank') {
          e.preventDefault()
          Browser.open({ url: anchor.href })
          return
        }

        Haptics.impact({ style: ImpactStyle.Light }).catch(() => {})
      }
      document.addEventListener('click', clickHandler, true)
      cleanupFns.push(() => document.removeEventListener('click', clickHandler, true))

      const applyStatus = (connected: boolean) => {
        document.documentElement.dataset.offline = connected ? 'false' : 'true'
        setOffline(!connected)
      }
      const netListener = await Network.addListener('networkStatusChange', (status) => applyStatus(status.connected))
      cleanupFns.push(() => netListener.remove())
      const initial = await Network.getStatus()
      applyStatus(initial.connected)
    })()

    return () => {
      cancelled = true
      cleanupFns.forEach((fn) => fn())
    }
  }, [])

  if (!offline) return null
  return <div className="offline-banner">You&apos;re offline — some features may not load.</div>
}
