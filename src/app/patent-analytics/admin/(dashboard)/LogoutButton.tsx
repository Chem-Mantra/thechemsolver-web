'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  async function logout() {
    await fetch('/api/patent-analytics/admin/logout', { method: 'POST' })
    router.push('/patent-analytics/admin/login')
    router.refresh()
  }
  return (
    <button type="button" onClick={logout} className="pa-chip text-sm font-medium px-4 py-2">
      Log out
    </button>
  )
}
