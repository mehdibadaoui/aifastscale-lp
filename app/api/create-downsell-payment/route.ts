import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
})

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json()

    // Create Stripe Checkout Session for Downsell ($7)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: '$10M Personal Brand Blueprint (2026 Edition) - FINAL OFFER',
              description:
                'Last chance! The complete 5-week system to build a $10M personal brand using AI',
              images: [
                'https://aifastscale.com/images/blueprint-cover.jpg', // You can update this URL later
              ],
            },
            unit_amount: amount * 100, // $7 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/thank-you-confirmed?upsell=blueprint${amount}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/downsell`,
      customer_email: undefined, // Will use email from form if needed
      metadata: {
        product: 'blueprint',
        price: amount,
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
