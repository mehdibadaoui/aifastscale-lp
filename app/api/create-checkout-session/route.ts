import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID

    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined')
    }
    if (!priceId) {
      throw new Error('Price ID not configured')
    }

    const origin = req.headers.get('origin') || 'https://aifastscale.com'

    // Create checkout session using direct Stripe API call (SDK doesn't work in serverless)
    const params = new URLSearchParams({
      'mode': 'payment',
      'success_url': `${origin}/thank-you-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url': origin,
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      'billing_address_collection': 'auto',
      'phone_number_collection[enabled]': 'false',
      'payment_intent_data[setup_future_usage]': 'off_session',
      'customer_creation': 'always',
    })

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Stripe API error:', data)
      return NextResponse.json(
        { error: data.error?.message || 'Payment processing error' },
        { status: response.status }
      )
    }

    return NextResponse.json({ url: data.url })
  } catch (err: any) {
    console.error('Error creating checkout session:', err)
    return NextResponse.json(
      { error: err.message || 'Payment processing error' },
      { status: 500 }
    )
  }
}
