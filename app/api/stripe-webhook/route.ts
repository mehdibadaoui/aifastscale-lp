import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { trackMetaPurchase } from '@/app/utils/meta-conversions'

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

      // Send Purchase event to Meta Conversions API (server-side tracking)
      try {
        // Extract customer data
        const email = session.customer_details?.email
        const phone = session.customer_details?.phone
        const name = session.customer_details?.name || ''
        const [firstName, ...lastNameParts] = name.split(' ')
        const lastName = lastNameParts.join(' ')

        const address = session.customer_details?.address
        const city = address?.city
        const state = address?.state
        const zip = address?.postal_code
        const country = address?.country

        // Get metadata for tracking
        const metadata = session.metadata || {}
        const fbp = metadata.fbp // _fbp cookie
        const fbc = metadata.fbc // _fbc cookie
        const eventSourceUrl = metadata.landing_page || 'https://aifastscale.com'

        // Get client IP and user agent from headers (stored in metadata)
        const clientIp = metadata.client_ip || req.headers.get('x-forwarded-for')?.split(',')[0]
        const userAgent = metadata.user_agent || req.headers.get('user-agent')

        // Determine product name
        let productName = 'AI Fast Scale Course'
        if (metadata.product_type === 'upsell') {
          productName = 'Upsell ($17)'
        } else if (metadata.product_type === 'downsell') {
          productName = 'Downsell ($7)'
        }

        await trackMetaPurchase({
          email,
          phone,
          firstName,
          lastName,
          city,
          state,
          zip,
          country,
          amount: session.amount_total || 0,
          currency: session.currency?.toUpperCase() || 'USD',
          orderId: session.id,
          productName,
          clientIp,
          userAgent,
          fbp,
          fbc,
          eventSourceUrl,
        })
      } catch (error) {
        console.error('Failed to send Meta Conversions API event:', error)
        // Don't fail the webhook if Meta tracking fails
      }
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
