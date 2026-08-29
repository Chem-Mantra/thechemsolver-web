import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_SESSION_COOKIE, checkAdminPassword, signSession } from '@/lib/adminAuth'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!process.env.PATENT_ANALYTICS_ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: 'Admin login is not configured yet.' }, { status: 503 })
  }

  if (!checkAdminPassword(password)) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set(ADMIN_SESSION_COOKIE, signSession(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  })
  return res
}
