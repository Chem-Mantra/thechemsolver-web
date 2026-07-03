'use client'

import { useAuth } from '../AuthProvider'

/** Shared ad placeholder — renders nothing for premium (ad-free) users. */
export default function AdSlot({ className = '' }: { className?: string }) {
  const { premium } = useAuth()
  if (premium.loading || premium.isPremium) return null

  return (
    <div className={`flex items-center justify-center bg-white/[0.02] border border-white/5 rounded-xl text-gray-700 text-xs ${className}`}>
      {/* Replace with: <ins class="adsbygoogle" data-ad-client="ca-pub-XXXXXXXX" data-ad-slot="XXXXXXXX" /> */}
      Advertisement
    </div>
  )
}
