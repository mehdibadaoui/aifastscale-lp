import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

export async function POST(req: NextRequest) {
  try {
    // Create Stripe Checkout Session for Downsell ($7)
    // Using dynamic pricing for test/live mode compatibility
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: '$10M Personal Brand Blueprint',
              description: '5-Week System to Build a $10M Personal Brand',
            },
            unit_amount: 700, // $7.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/thank-you-confirmed?upsell=blueprint7`,
      cancel_url: `${req.headers.get('origin')}/downsell`,
      billing_address_collection: 'auto',
      metadata: {
        product: 'blueprint',
        price: 7,
        type: 'downsell',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Error creating downsell payment:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to create payment session' },
      { status: 500 }
    )
  }
}
