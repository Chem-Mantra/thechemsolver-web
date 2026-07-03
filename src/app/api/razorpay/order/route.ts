import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { razorpay, PAYMENT_CURRENCY, PAYMENT_AMOUNT_USD } from '@/lib/razorpay'

// Creates a Razorpay order for the signed-in user. The website is the only
// caller — the native app never initiates a purchase; see
// docs/RAZORPAY_SETUP.md for why.
export async function POST(req: NextRequest) {
  if (!razorpay) {
    return NextResponse.json({ error: 'Payments are not configured yet.' }, { status: 503 })
  }

  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) {
    return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_THECHEMSOLVER_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_THECHEMSOLVER_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, anonKey)
  const { data: userData, error: userError } = await supabase.auth.getUser(token)

  if (userError || !userData.user) {
    return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  }

  // Smallest currency unit — cents for USD, paise for INR.
  const amount = PAYMENT_AMOUNT_USD * 100

  try {
    const order = await razorpay.orders.create({
      amount,
      currency: PAYMENT_CURRENCY,
      receipt: `chemsolver_${userData.user.id}_${Date.now()}`,
      notes: { supabase_user_id: userData.user.id },
    })

    return NextResponse.json(order)
  } catch (err) {
    console.error('Razorpay order creation failed:', err)
    return NextResponse.json(
      {
        error:
          PAYMENT_CURRENCY !== 'INR'
            ? `Could not create a ${PAYMENT_CURRENCY} order. If International Payments isn't enabled on this Razorpay account yet, see docs/RAZORPAY_SETUP.md.`
            : 'Could not create order. Please try again.',
      },
      { status: 502 }
    )
  }
}
