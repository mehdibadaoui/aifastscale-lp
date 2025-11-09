import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      console.log('💰 Payment successful!', {
        sessionId: session.id,
        customerId: session.customer,
        customerEmail: session.customer_details?.email,
        amountTotal: session.amount_total,
      })

      // Send Telegram notification if enabled
      try {
        const telegramEnabled = process.env.TELEGRAM_NOTIFICATIONS_ENABLED === 'true'
        const botToken = process.env.TELEGRAM_BOT_TOKEN
        const chatId = process.env.TELEGRAM_CHAT_ID

        if (telegramEnabled && botToken && chatId) {
          const amount = ((session.amount_total || 0) / 100).toFixed(2)
          const customerEmail = session.customer_details?.email || 'No email'
          const customerName = session.customer_details?.name || 'N/A'

          const message = `
🎉 <b>NEW SALE!</b> 🎉

💰 Amount: $${amount}
👤 Customer: ${customerName}
📧 Email: ${customerEmail}
🆔 Session ID: ${session.id}

Keep crushing it! 🚀
          `.trim()

          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-telegram`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ botToken, chatId, message }),
          })
        }
      } catch (error) {
        console.error('Failed to send Telegram notification:', error)
        // Don't fail the webhook if notification fails
      }

      // Here you could also:
      // - Send confirmation email
      // - Update database
      // - Grant access to product
      // - Track in analytics
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
