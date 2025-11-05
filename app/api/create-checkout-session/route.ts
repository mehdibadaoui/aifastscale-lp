import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

const stripe = new Stripe(stripeSecretKey)

export async function POST(req: NextRequest) {
  try {
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID
    if (!priceId) {
      throw new Error('Price ID not configured')
    }

    // MAXIMUM CONVERSION checkout - all payment methods enabled!
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/thank-you-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}`,
      // Enable ALL payment methods - Stripe auto-detects based on:
      // - Browser/device capabilities
      // - Payment methods enabled in Dashboard
      // - Domain verification status
      // Removing payment_method_types allows ALL methods (card, link, apple_pay, google_pay, etc.)
      // Minimal fields for fastest checkout
      billing_address_collection: 'auto', // Only ask if needed
      phone_number_collection: { enabled: false }, // No phone number
      // Save payment method for 1-click upsells
      payment_intent_data: {
        setup_future_usage: 'off_session', // Save payment method for future charges
      },
      customer_creation: 'always', // Always create a customer to attach payment method
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Stripe Error:', err.message)
    return NextResponse.json(
      { error: err.message || 'Payment processing error' },
      { status: 500 }
    )
  }
}
