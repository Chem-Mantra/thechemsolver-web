'use client'

import { useAuth } from '../AuthProvider'

/**
 * Ad placement wrapper.
 *
 * During AdSense site review, do NOT render empty "Advertisement" chrome —
 * fake ad boxes + no real units are a common rejection signal. When you have
 * approved units, set NEXT_PUBLIC_ADSENSE_SLOTS=1 and render real <ins> tags.
 * Paid users never see ads.
 */
export default function AdSlot({ className = '' }: { className?: string }) {
  const { access } = useAuth()
  if (access.loading || access.isPaid) return null

  // No approved ad units yet — render nothing (script tag may still load for crawlers).
  if (process.env.NEXT_PUBLIC_ADSENSE_SLOTS !== '1') {
    return null
  }

  return (
    <div
      className={`flex items-center justify-center min-h-[90px] bg-white/[0.02] border border-white/5 rounded-xl ${className}`}
      data-ad-slot-ready="true"
    />
  )
}
