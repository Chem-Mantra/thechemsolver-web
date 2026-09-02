import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const maxDuration = 60

const RAZORPAY_API_BASE = 'https://api.razorpay.com/v1'
const UNLOCK_PRICE_INR_PAISE = 124500 // ~$15 at a conservative USD/INR rate, same fixed-rate approach as the $10 tier

async function getAuthHeader(): Promise<string> {
  const keyId = process.env.RAZORPAY_KEY_ID!
  const keySecret = process.env.RAZORPAY_KEY_SECRET!
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`
}

export async function POST(req: NextRequest) {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: 'UPI/card payments are not configured yet.' }, { status: 503 })
  }

  const body = await req.json().catch(() => null)
  const requestId = typeof body?.requestId === 'string' ? body.requestId.trim() : ''
  if (!requestId) {
    return NextResponse.json({ error: 'Missing request ID.' }, { status: 400 })
  }

  const { data: row } = await supabaseAdmin
    .from('live_extraction_requests')
    .select('id, status, outcome, unlocked')
    .eq('id', requestId)
    .maybeSingle()
  if (!row) {
    return NextResponse.json({ error: 'Request not found.' }, { status: 404 })
  }
  if (row.status !== 'completed' || row.outcome !== 'confirmed') {
    return NextResponse.json({ error: 'This result is not available to unlock.' }, { status: 400 })
  }
  if (row.unlocked) {
    return NextResponse.json({ error: 'This result is already unlocked.' }, { status: 400 })
  }

  const res = await fetch(`${RAZORPAY_API_BASE}/orders`, {
    method: 'POST',
    headers: { Authorization: await getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: UNLOCK_PRICE_INR_PAISE,
      currency: 'INR',
      receipt: `unlock_${requestId}_${Date.now()}`,
      notes: { requestId },
    }),
  })
  const order = await res.json()
  if (!res.ok || !order.id) {
    console.error('[newest-patents unlock razorpay-create-order] Razorpay order creation failed', order)
    return NextResponse.json({ error: 'Could not start payment -- please try again.' }, { status: 502 })
  }

  return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId })
}
