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

    // Minimal Stripe checkout - fastest, simplest checkout possible
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/thank-you-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}`,
      // Minimal fields for fastest checkout
      billing_address_collection: 'auto', // Only ask if needed for tax
      phone_number_collection: { enabled: false }, // Don't ask for phone
      submit_type: 'pay', // Shows "Pay" button
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
