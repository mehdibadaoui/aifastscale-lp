import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
});

export async function POST(req: NextRequest) {
  try {
    // Use price ID from environment variable (server-side)
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;

    if (!priceId) {
      throw new Error('Price ID not configured');
    }

    console.log('Creating Stripe checkout session with price:', priceId);

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/thank-you-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}`,
      automatic_tax: { enabled: false },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      payment_method_types: ['card'],
      customer_creation: 'always',
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    console.error('Stripe Error Details:', {
      message: err.message,
      type: err.type,
      code: err.code,
      statusCode: err.statusCode,
      raw: err.raw,
      stack: err.stack
    });

    // Return detailed error for debugging
    return NextResponse.json(
      {
        error: err.message,
        type: err.type,
        code: err.code,
        statusCode: err.statusCode,
        details: err.raw?.message || 'No additional details'
      },
      { status: err.statusCode || 500 }
    );
  }
}
