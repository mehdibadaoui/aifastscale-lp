import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
})

export async function POST(req: NextRequest) {
  try {
    const { sessionId, upsellType } = await req.json()

    if (!sessionId || !upsellType) {
      return NextResponse.json(
        { error: 'Missing sessionId or upsellType' },
        { status: 400 }
      )
    }

    // Get the original checkout session to retrieve customer and payment method
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'payment_intent'],
    })

    if (!session.customer || !session.payment_intent) {
      return NextResponse.json(
        { error: 'Invalid session - no customer or payment method found' },
        { status: 400 }
      )
    }

    const customerId =
      typeof session.customer === 'string'
        ? session.customer
        : session.customer.id

    // Get the payment intent to retrieve the payment method
    const paymentIntent =
      typeof session.payment_intent === 'string'
        ? await stripe.paymentIntents.retrieve(session.payment_intent)
        : session.payment_intent

    const paymentMethodId = paymentIntent.payment_method

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: 'No payment method found' },
        { status: 400 }
      )
    }

    // Determine which upsell product to charge
    let priceId: string
    let amount: number
    let description: string

    if (upsellType === 'blueprint17') {
      priceId = process.env.NEXT_PUBLIC_STRIPE_UPSELL_17_PRICE_ID!
      amount = 1700 // $17.00 in cents
      description = '10M Creator Blueprint - Premium ($17)'
    } else if (upsellType === 'blueprint7') {
      priceId = process.env.NEXT_PUBLIC_STRIPE_UPSELL_7_PRICE_ID!
      amount = 700 // $7.00 in cents
      description = '10M Creator Blueprint - Starter ($7)'
    } else {
      return NextResponse.json(
        { error: 'Invalid upsell type' },
        { status: 400 }
      )
    }

    // Create a payment intent with the saved payment method
    const upsellPayment = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: customerId,
      payment_method:
        typeof paymentMethodId === 'string'
          ? paymentMethodId
          : paymentMethodId.id,
      off_session: true,
      confirm: true,
      description,
      metadata: {
        upsell_type: upsellType,
        original_session: sessionId,
      },
    })

    console.log('✅ 1-Click Upsell Successful!', {
      upsellType,
      amount: amount / 100,
      customerId,
      paymentIntentId: upsellPayment.id,
    })

    return NextResponse.json({
      success: true,
      paymentIntentId: upsellPayment.id,
      amount: amount / 100,
    })
  } catch (error: any) {
    console.error('❌ Upsell purchase failed:', error)

    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return NextResponse.json(
        {
          error: 'Your card was declined. Please contact your bank.',
          code: error.code,
        },
        { status: 402 }
      )
    }

    return NextResponse.json(
      {
        error: error.message || 'Payment failed. Please try again.',
      },
      { status: 500 }
    )
  }
}
