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
    // Fetch all payment intents from last 30 days
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
      created: {
        gte: Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60, // Last 30 days
      },
    })

    // Filter for your products only
    const yourSales = paymentIntents.data.filter((payment) => {
      // Check if this payment is for one of your products
      const metadata = payment.metadata
      const priceId = metadata.priceId || metadata.price_id
      return priceId && YOUR_PRICE_IDS.includes(priceId)
    })

    // Calculate today's stats (midnight to now)
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayTimestamp = Math.floor(todayStart.getTime() / 1000)

    const todaySales = yourSales.filter(
      (sale) => sale.created >= todayTimestamp && sale.status === 'succeeded'
    )

    const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.amount, 0)

    // Format sales for display
    const formattedSales = yourSales
      .filter((sale) => sale.status === 'succeeded')
      .map((sale) => {
        const priceId = sale.metadata.priceId || sale.metadata.price_id || 'unknown'
        const productName = PRODUCT_NAMES[priceId] || 'Unknown Product'

        return {
          id: sale.id,
          email: sale.receipt_email || sale.metadata.email || 'No email',
          amount: sale.amount,
          product: productName,
          date: new Date(sale.created * 1000).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          status: sale.status,
        }
      })
      .sort((a, b) => {
        // Sort by date, newest first
        return (
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      })

    return NextResponse.json({
      todaySales: todaySales.length,
      todayRevenue: todayRevenue,
      allSales: formattedSales,
    })
  } catch (error: any) {
    console.error('Error fetching sales:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sales', message: error.message },
      { status: 500 }
    )
  }
}
