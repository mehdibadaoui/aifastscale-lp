import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { sessionId, upsellType } = await req.json()
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    if (!sessionId || !upsellType) {
      return NextResponse.json(
        { error: 'Missing sessionId or upsellType' },
        { status: 400 }
      )
    }

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe configuration error' },
        { status: 500 }
      )
    }

    // Get the original checkout session to retrieve customer and payment method
    const sessionResponse = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${sessionId}?expand[]=customer&expand[]=payment_intent`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
        },
      }
    )

    const session = await sessionResponse.json()

    if (!sessionResponse.ok || !session.customer || !session.payment_intent) {
      return NextResponse.json(
        { error: 'Invalid session - no customer or payment method found' },
        { status: 400 }
      )
    }

    const customerId = typeof session.customer === 'string' ? session.customer : session.customer.id

    // Get the payment intent to retrieve the payment method
    const paymentIntentId = typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent.id

    const piResponse = await fetch(
      `https://api.stripe.com/v1/payment_intents/${paymentIntentId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
        },
      }
    )

    const paymentIntent = await piResponse.json()

    if (!piResponse.ok || !paymentIntent.payment_method) {
      return NextResponse.json(
        { error: 'No payment method found' },
        { status: 400 }
      )
    }

    const paymentMethodId = typeof paymentIntent.payment_method === 'string'
      ? paymentIntent.payment_method
      : paymentIntent.payment_method.id

    // Determine which upsell product to charge
    let amount: number
    let description: string

    if (upsellType === 'blueprint17') {
      amount = 1700 // $17.00 in cents
      description = '10M Creator Blueprint - Premium ($17)'
    } else if (upsellType === 'blueprint7') {
      amount = 700 // $7.00 in cents
      description = '10M Creator Blueprint - Starter ($7)'
    } else {
      return NextResponse.json(
        { error: 'Invalid upsell type' },
        { status: 400 }
      )
    }

    // Create a payment intent with the saved payment method using direct API call
    const params = new URLSearchParams({
      'amount': amount.toString(),
      'currency': 'usd',
      'customer': customerId,
      'payment_method': paymentMethodId,
      'off_session': 'true',
      'confirm': 'true',
      'description': description,
      'metadata[upsell_type]': upsellType,
      'metadata[original_session]': sessionId,
    })

    const upsellResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    const upsellPayment = await upsellResponse.json()

    if (!upsellResponse.ok) {
      console.error('❌ Upsell purchase failed:', upsellPayment)

      // Handle specific Stripe errors
      if (upsellPayment.error?.type === 'card_error') {
        return NextResponse.json(
          {
            error: 'Your card was declined. Please contact your bank.',
            code: upsellPayment.error.code,
          },
          { status: 402 }
        )
      }

      return NextResponse.json(
        {
          error: upsellPayment.error?.message || 'Payment failed. Please try again.',
        },
        { status: 400 }
      )
    }

    console.log('✅ 1-Click Upsell Successful!', {
      upsellType,
      amount: amount / 100,
      customerId,
      paymentIntentId: upsellPayment.id,
    })

    // Send Telegram notification for upsell
    try {
      const telegramEnabled = process.env.TELEGRAM_NOTIFICATIONS_ENABLED === 'true'
      const botToken = process.env.TELEGRAM_BOT_TOKEN
      const chatId = process.env.TELEGRAM_CHAT_ID

      if (telegramEnabled && botToken && chatId) {
        const upsellAmount = (amount / 100).toFixed(2)
        const customerEmail = session.customer_details?.email || session.customer_email || 'No email'
        const customerName = session.customer_details?.name || 'N/A'

        const message = `
💎 <b>UPSELL PURCHASED!</b> 💎

💰 Amount: $${upsellAmount}
📦 Product: ${description}
👤 Customer: ${customerName}
📧 Email: ${customerEmail}

You're on fire! 🔥
        `.trim()

        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-telegram`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ botToken, chatId, message }),
        })
      }
    } catch (error) {
      console.error('Failed to send Telegram notification for upsell:', error)
      // Don't fail the upsell if notification fails
    }

    return NextResponse.json({
      success: true,
      paymentIntentId: upsellPayment.id,
      amount: amount / 100,
    })
  } catch (error: any) {
    console.error('❌ Upsell purchase failed:', error)

    return NextResponse.json(
      {
        error: error.message || 'Payment failed. Please try again.',
      },
      { status: 500 }
    )
  }
}
