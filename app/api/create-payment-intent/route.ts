import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

const stripe = new Stripe(stripeSecretKey)

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    // Create a PaymentIntent with the order amount and currency
    // MAXIMUM CONVERSION - all payment methods enabled!
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 3700, // $37.00 in cents
      currency: 'usd',
      receipt_email: email,
      // Removing payment_method_types allows ALL methods
      // Stripe auto-detects: card, link, apple_pay, google_pay, etc.
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        product: '7-Minute AgentClone AI Video System',
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (err: any) {
    console.error('PaymentIntent Error:', err.message)
    return NextResponse.json(
      { error: err.message || 'Payment setup failed' },
      { status: 500 }
    )
  }
}
