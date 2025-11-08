import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Your product price IDs
const YOUR_PRICE_IDS = [
  process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!, // Main product: $37
  process.env.NEXT_PUBLIC_STRIPE_UPSELL_17_PRICE_ID!, // Upsell 1: $17
  process.env.NEXT_PUBLIC_STRIPE_UPSELL_7_PRICE_ID!, // Upsell 2: $7
]

// Product names mapping
const PRODUCT_NAMES: { [key: string]: string } = {
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!]: 'AI Fast Scale Course ($37)',
  [process.env.NEXT_PUBLIC_STRIPE_UPSELL_17_PRICE_ID!]: 'AI Fast Scale Upsell ($17)',
  [process.env.NEXT_PUBLIC_STRIPE_UPSELL_7_PRICE_ID!]: 'AI Fast Scale Downsell ($7)',
}

export async function GET() {
  try {
    // Fetch all checkout sessions from last 30 days
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      created: {
        gte: Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60, // Last 30 days
      },
      expand: ['data.line_items'],
    })

    console.log('Fetched sessions:', sessions.data.length)

    // Filter and process sales
    const yourSales: any[] = []

    for (const session of sessions.data) {
      if (session.payment_status !== 'paid') continue

      // Get line items to find the product
      const lineItems = session.line_items?.data || []

      for (const item of lineItems) {
        const priceId = item.price?.id || ''

        // Check if this is one of YOUR products
        if (YOUR_PRICE_IDS.includes(priceId)) {
          const productName = PRODUCT_NAMES[priceId] || 'Unknown Product'

          yourSales.push({
            id: session.id,
            email: session.customer_details?.email || session.customer_email || 'No email',
            amount: session.amount_total || 0,
            product: productName,
            priceId: priceId,
            created: session.created,
            status: session.payment_status,
          })
        }
      }
    }

    console.log('Your sales found:', yourSales.length)

    // Calculate today's stats (midnight to now)
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayTimestamp = Math.floor(todayStart.getTime() / 1000)

    const todaySales = yourSales.filter(
      (sale) => sale.created >= todayTimestamp
    )

    const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.amount, 0)

    // Format sales for display
    const formattedSales = yourSales
      .map((sale) => {
        return {
          id: sale.id,
          email: sale.email,
          amount: sale.amount,
          product: sale.product,
          date: new Date(sale.created * 1000).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          status: 'paid',
        }
      })
      .sort((a, b) => {
        // Sort by date, newest first - compare the original date strings
        const aTime = new Date(a.date).getTime()
        const bTime = new Date(b.date).getTime()
        return bTime - aTime
      })

    return NextResponse.json({
      todaySales: todaySales.length,
      todayRevenue: todayRevenue,
      allSales: formattedSales,
    })
  } catch (error: any) {
    console.error('Error fetching sales:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch sales',
        message: error.message,
        todaySales: 0,
        todayRevenue: 0,
        allSales: []
      },
      { status: 200 } // Return 200 so frontend doesn't break
    )
  }
}
