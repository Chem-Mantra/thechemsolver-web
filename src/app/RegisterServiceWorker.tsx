'use client'

import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'

/** Registers the offline/installable-PWA service worker. Skipped in dev so
 * caching never fights with Next's HMR, and skipped entirely inside the
 * Capacitor native shell, which loads the live server directly. */
export default function RegisterServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator)) return
    if (Capacitor.isNativePlatform()) return

    navigator.serviceWorker.register('/sw.js').catch(() => {})
  }, [])

  return null
}
