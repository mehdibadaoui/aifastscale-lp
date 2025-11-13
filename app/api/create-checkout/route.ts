import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      priceId,
      fbp,
      fbc,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      landingPage,
      referrer,
    } = body

    // Get customer IP and user agent from headers
    const forwardedFor = req.headers.get('x-forwarded-for')
    const clientIp = forwardedFor ? forwardedFor.split(',')[0] : req.headers.get('x-real-ip') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'

    // Create Checkout Session with FULL metadata
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'cashapp', 'affirm', 'afterpay_clearpay'],
      line_items: [
        {
          price: priceId || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://aifastscale.com'}/thank-you-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://aifastscale.com'}`,

      // CRITICAL: Pass ALL metadata to Stripe for proper tracking
      metadata: {
        fbp: fbp || 'unknown',
        fbc: fbc || 'unknown',
        utm_source: utmSource || 'direct',
        utm_medium: utmMedium || 'none',
        utm_campaign: utmCampaign || 'none',
        utm_content: utmContent || 'none',
        utm_term: utmTerm || 'none',
        landing_page: landingPage || 'unknown',
        referrer: referrer || 'none',
        client_ip: clientIp,
        user_agent: userAgent,
        timestamp: new Date().toISOString(),
        product: '7 Minute AgentClone Course',
      },

      // Customer information for Stripe's fraud detection
      customer_creation: 'always',
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },

      // Shipping address (optional but helps with fraud detection)
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'AE', 'SA', 'EG', 'MA'],
      },

      // Additional fraud prevention
      payment_intent_data: {
        metadata: {
          fbp: fbp || 'unknown',
          fbc: fbc || 'unknown',
          client_ip: clientIp,
          user_agent: userAgent,
        },
      },
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
