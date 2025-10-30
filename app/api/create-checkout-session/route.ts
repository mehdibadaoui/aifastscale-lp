import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

const stripe = new Stripe(stripeSecretKey, {
  typescript: true,
});

export async function POST(req: NextRequest) {
  try {
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
    if (!priceId) {
      throw new Error('Price ID not configured');
    }

    // MAXIMUM CONVERSION checkout - all payment methods enabled!
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/thank-you-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}`,
      // Enable ALL payment methods for maximum conversion
      automatic_payment_methods: {
        enabled: true, // Enables Apple Pay, Google Pay, Link, etc.
      },
      // Minimal fields for fastest checkout
      billing_address_collection: 'auto', // Only ask if needed
      phone_number_collection: { enabled: false }, // No phone number
      submit_type: 'pay', // Clear "Pay" button
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Payment processing error' },
      { status: 500 }
    );
  }
}
