'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '../AuthProvider'
import { signInWithGoogle } from '@/lib/googleAuth'
import GoogleIcon from './GoogleIcon'

// Optional Google sign-in, shown alongside the nav on every page. The site
// itself stays fully free/open either way — signing in doesn't gate
// anything today, it just gives a student an account (see /account).
export default function AuthNavButton({ variant = 'nav' }: { variant?: 'nav' | 'mobile' }) {
  const { user, loading } = useAuth()
  const [busy, setBusy] = useState(false)

  if (loading) return null

  if (user) {
    const avatar = user.user_metadata?.avatar_url as string | undefined
    const initial = (user.email?.[0] ?? '?').toUpperCase()

    if (variant === 'mobile') {
      return (
        <Link href="/account" className="flex items-center gap-2 text-sm text-gray-300 px-3 py-3 rounded-md hover:bg-white/5 transition-colors">
          <Avatar avatar={avatar} initial={initial} size={22} />
          My Account
        </Link>
      )
    }
    return (
      <Link href="/account" aria-label="My account" className="shrink-0">
        <Avatar avatar={avatar} initial={initial} size={28} />
      </Link>
    )
  }

  async function handleSignIn() {
    setBusy(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      console.error('Google sign-in failed:', err)
      setBusy(false)
    }
  }

  if (variant === 'mobile') {
    return (
      <button
        type="button" onClick={handleSignIn} disabled={busy}
        className="flex items-center gap-2 text-sm text-gray-300 disabled:opacity-50 px-3 py-3 rounded-md hover:bg-white/5 transition-colors"
      >
        <GoogleIcon /> Sign in with Google
      </button>
    )
  }

  return (
    <button
      type="button" onClick={handleSignIn} disabled={busy}
      className="hidden sm:flex items-center gap-1.5 text-xs bg-white/95 hover:bg-white disabled:opacity-50 text-gray-900 font-semibold px-3 py-1.5 rounded-lg transition-colors shrink-0"
    >
      <GoogleIcon /> Sign in
    </button>
  )
}

function Avatar({ avatar, initial, size }: { avatar?: string; initial: string; size: number }) {
  if (avatar) {
    // eslint-disable-next-line @next/next/no-img-element -- tiny avatar, next/image overhead isn't worth it here
    return <img src={avatar} alt="" width={size} height={size} className="rounded-full" referrerPolicy="no-referrer" />
  }
  return (
    <div
      className="rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      {initial}
    </div>
  )
}
