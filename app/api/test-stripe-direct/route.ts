import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY

    if (!stripeKey) {
      return NextResponse.json({ error: 'No Stripe key' }, { status: 500 })
    }

    // Test direct HTTP call to Stripe API without using the SDK
    const response = await fetch('https://api.stripe.com/v1/prices?limit=3', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({
        error: 'Stripe API returned error',
        status: response.status,
        statusText: response.statusText,
        data,
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Direct HTTP call to Stripe API works!',
      pricesCount: data.data?.length || 0,
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
        stack: err.stack,
      },
      { status: 500 }
    )
  }
}
