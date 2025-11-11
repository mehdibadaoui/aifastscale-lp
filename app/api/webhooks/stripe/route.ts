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

          // Determine product type from metadata
          const metadata = session.metadata || {}
          let productEmoji = '📦'
          let productName = 'AI Fast Scale Course ($37)'

          if (metadata.product_type === 'upsell') {
            productEmoji = '🚀'
            productName = 'Upsell ($17)'
          } else if (metadata.product_type === 'downsell') {
            productEmoji = '💎'
            productName = 'Downsell ($7)'
          }

          const message = `
🎉 <b>NEW SALE!</b> 🎉

${productEmoji} <b>Product:</b> ${productName}
💰 <b>Amount:</b> $${amount}
👤 <b>Customer:</b> ${customerName}
📧 <b>Email:</b> ${customerEmail}
🆔 <b>Session ID:</b> ${session.id}

Keep crushing it! 🚀
          `.trim()

          // Send directly to Telegram API (more reliable than self-fetch)
          const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`
          const telegramResponse = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
              parse_mode: 'HTML',
            }),
          })

          if (!telegramResponse.ok) {
            const errorData = await telegramResponse.json()
            console.error('Telegram API error:', errorData)
          } else {
            console.log('✅ Telegram notification sent successfully!')
          }
        } else {
          console.log('⚠️ Telegram notifications disabled or not configured')
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
          email: email || undefined,
          phone: phone || undefined,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          city: city || undefined,
          state: state || undefined,
          zip: zip || undefined,
          country: country || undefined,
          amount: session.amount_total || 0,
          currency: session.currency?.toUpperCase() || 'USD',
          orderId: session.id,
          productName,
          clientIp: clientIp || undefined,
          userAgent: userAgent || undefined,
          fbp: fbp || undefined,
          fbc: fbc || undefined,
          eventSourceUrl: eventSourceUrl || undefined,
        })
      } catch (error) {
        console.error('Failed to send Meta Conversions API event:', error)
        // Don't fail the webhook if Meta tracking fails
      }
    }

    // Handle payment_intent.succeeded event (for 1-click upsells/downsells)
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      // Only process if it's an upsell/downsell (has metadata.upsell_type)
      if (paymentIntent.metadata && paymentIntent.metadata.upsell_type) {
        console.log('💰 1-Click Upsell/Downsell successful!', {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          upsellType: paymentIntent.metadata.upsell_type,
        })

        // Send Telegram notification if enabled
        try {
          const telegramEnabled = process.env.TELEGRAM_NOTIFICATIONS_ENABLED === 'true'
          const botToken = process.env.TELEGRAM_BOT_TOKEN
          const chatId = process.env.TELEGRAM_CHAT_ID

          if (telegramEnabled && botToken && chatId) {
            const amount = (paymentIntent.amount / 100).toFixed(2)

            // Determine product type
            let productEmoji = '🚀'
            let productName = 'Upsell ($17)'

            if (paymentIntent.metadata.upsell_type === 'blueprint7') {
              productEmoji = '💎'
              productName = 'Downsell ($7)'
            }

            // Try to get customer email from original session
            let customerEmail = 'From 1-click purchase'
            let customerName = 'N/A'

            if (paymentIntent.metadata.original_session) {
              try {
                const originalSession = await stripe.checkout.sessions.retrieve(
                  paymentIntent.metadata.original_session
                )
                customerEmail = originalSession.customer_details?.email || customerEmail
                customerName = originalSession.customer_details?.name || 'N/A'
              } catch (e) {
                // Ignore if we can't fetch session
              }
            }

            const message = `
🎉 <b>NEW SALE!</b> 🎉

${productEmoji} <b>Product:</b> ${productName}
💰 <b>Amount:</b> $${amount}
👤 <b>Customer:</b> ${customerName}
📧 <b>Email:</b> ${customerEmail}
🆔 <b>Payment ID:</b> ${paymentIntent.id}

Keep crushing it! 🚀
            `.trim()

            // Send directly to Telegram API
            const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`
            const telegramResponse = await fetch(telegramApiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML',
              }),
            })

            if (!telegramResponse.ok) {
              const errorData = await telegramResponse.json()
              console.error('Telegram API error:', errorData)
            } else {
              console.log('✅ Telegram notification sent for upsell/downsell!')
            }
          }
        } catch (error) {
          console.error('Failed to send Telegram notification for upsell:', error)
          // Don't fail the webhook if notification fails
        }
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
