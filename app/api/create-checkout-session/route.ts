import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from './middleware'

export async function POST(req: NextRequest) {
  // Anti-spam/bot protection - Rate limit checkout attempts
  const rateLimitResponse = rateLimit(req)
  if (rateLimitResponse) {
    return rateLimitResponse // Return 429 error if rate limited
  }

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

    // Get UTM parameters from request body
    const body = await req.json().catch(() => ({}))
    const utmParams = body.utmParams || {}

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

    // Add UTM parameters to metadata for tracking
    if (utmParams.utm_source) params.append('metadata[utm_source]', utmParams.utm_source)
    if (utmParams.utm_medium) params.append('metadata[utm_medium]', utmParams.utm_medium)
    if (utmParams.utm_campaign) params.append('metadata[utm_campaign]', utmParams.utm_campaign)
    if (utmParams.utm_term) params.append('metadata[utm_term]', utmParams.utm_term)
    if (utmParams.utm_content) params.append('metadata[utm_content]', utmParams.utm_content)
    if (utmParams.fbclid) params.append('metadata[fbclid]', utmParams.fbclid)
    if (utmParams.gclid) params.append('metadata[gclid]', utmParams.gclid)
    if (utmParams.referrer) params.append('metadata[referrer]', utmParams.referrer)
    if (utmParams.landing_page) params.append('metadata[landing_page]', utmParams.landing_page)
    if (utmParams.traffic_source) params.append('metadata[traffic_source]', utmParams.traffic_source)

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
