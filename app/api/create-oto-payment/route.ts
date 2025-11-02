import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
})

export async function POST(req: NextRequest) {
  try {
    // Create Stripe Checkout Session for OTO ($17)
    // Using predefined Price ID for better tracking
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1SOyo2BCEDBlhdGKTGP34abr', // $10M Blueprint - OTO ($17)
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/thank-you-confirmed?upsell=blueprint17`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/oto`,
      customer_email: undefined, // Will use email from form if needed
      metadata: {
        product: 'blueprint',
        price: 17,
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
