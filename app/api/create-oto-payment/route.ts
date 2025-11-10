import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    // Create Stripe Checkout Session for OTO ($17)
    // IMPORTANT: Using permanent price ID for dashboard tracking
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_UPSELL_17_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/thank-you-confirmed?upsell=blueprint17`,
      cancel_url: `${req.headers.get('origin')}/oto`,
      billing_address_collection: 'auto',
      metadata: {
        product: 'blueprint',
        price: 17,
        product_type: 'upsell', // CRITICAL: Must match webhook expectation
        type: 'oto',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Error creating OTO payment:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to create payment session' },
      { status: 500 }
    )
  }
}
