import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

// Whop Webhook Handler
// This endpoint receives webhook events from Whop when payments are processed
// Configure this URL in Whop Dashboard → Settings → Webhooks:
// https://aifastscale.com/api/webhooks/whop

export async function POST(req: NextRequest) {
  try {
    // Get the raw body for signature verification
    const body = await req.text()
    const headersList = await headers()

    // Get Whop signature header (if available)
    const signature = headersList.get('x-whop-signature')

    // TODO: Verify webhook signature for security
    // For now, we'll log and process events
    // In production, you should verify the signature using your Whop webhook secret

    let event
    try {
      event = JSON.parse(body)
    } catch (err) {
      console.error('Invalid JSON payload')
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      )
    }

    // Log the event for debugging
    console.log('Whop Webhook Event:', {
      type: event.type,
      id: event.id,
      data: event.data,
      timestamp: new Date().toISOString()
    })

    // Handle different event types
    switch (event.type) {
      case 'payment.succeeded':
      case 'order.paid':
      case 'checkout.completed':
        await handleSuccessfulPayment(event)
        break

      case 'payment.failed':
        await handleFailedPayment(event)
        break

      case 'subscription.cancelled':
        await handleSubscriptionCancellation(event)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Return 200 to acknowledge receipt
    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('Webhook error:', err)
    return NextResponse.json(
      { error: err.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleSuccessfulPayment(event: any) {
  console.log('Processing successful payment:', event)

  const {
    amount,
    customer_email,
    customer_name,
    product_id,
    metadata,
  } = event.data || {}

  // Determine which product was purchased
  let productType = 'main'
  if (metadata?.type) {
    productType = metadata.type
  } else if (product_id) {
    // Map Whop plan IDs to product types - LIVE MODE
    const planMapping: Record<string, string> = {
      [process.env.NEXT_PUBLIC_WHOP_PLAN_MAIN || 'plan_7x5Kz1cflmrYH']: 'main',
      [process.env.NEXT_PUBLIC_WHOP_PLAN_OTO || 'plan_WsTHXLDJ3nJRo']: 'oto',
      [process.env.NEXT_PUBLIC_WHOP_PLAN_DOWNSELL || 'plan_3NOeRkpEhZVaV']: 'downsell',
    }
    productType = planMapping[product_id] || 'main'
  }

  console.log('Product type:', productType)
  console.log('Customer:', customer_email, customer_name)
  console.log('Amount:', amount)

  // TODO: Implement actual business logic:
  // 1. Grant course access in your database/membership platform
  // 2. Send welcome email with course login details
  // 3. If productType is 'oto' or 'downsell', send DFY form link via email
  // 4. Log to Google Sheets or database for tracking
  // 5. Send Slack/Telegram notification

  // For now, just log it
  console.log('✅ Payment processed successfully')

  // Example: Send different emails based on product type
  if (productType === 'oto' || productType === 'downsell') {
    console.log('📧 TODO: Send DFY video form link to:', customer_email)
    // Send email with form link to collect video script and images
  } else {
    console.log('📧 TODO: Send course access email to:', customer_email)
    // Send standard welcome email
  }

  return true
}

async function handleFailedPayment(event: any) {
  console.log('Payment failed:', event)

  const { customer_email, failure_reason } = event.data || {}

  console.log('Failed payment for:', customer_email)
  console.log('Reason:', failure_reason)

  // TODO: Implement failed payment logic:
  // 1. Log failed payment
  // 2. Send retry link to customer
  // 3. Notify admin

  return true
}

async function handleSubscriptionCancellation(event: any) {
  console.log('Subscription cancelled:', event)

  const { customer_email } = event.data || {}

  console.log('Cancelled subscription for:', customer_email)

  // TODO: Implement cancellation logic:
  // 1. Revoke course access
  // 2. Send cancellation confirmation email
  // 3. Update database

  return true
}
