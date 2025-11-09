import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  maxNetworkRetries: 3, // Retry up to 3 times on network errors
  timeout: 20000, // 20 second timeout
})

/**
 * Analytics ROI API
 * Combines sales data with ad spend to calculate true profit and ROI per channel
 */

interface ChannelMetrics {
  sales: number
  revenue: number
  spend: number
  profit: number
  roi: number
  roas: number
  cpa: number
  customers: string[]
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const daysBack = parseInt(searchParams.get('days') || '30')

    // Calculate date range
    const endDate = Math.floor(Date.now() / 1000)
    const startDate = endDate - (daysBack * 24 * 60 * 60)

    // Fetch sales data from Stripe
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      created: { gte: startDate, lte: endDate },
      expand: ['data.line_items'],
    })

    // Price IDs
    const YOUR_PRICE_IDS = [
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
      process.env.NEXT_PUBLIC_STRIPE_UPSELL_17_PRICE_ID!,
      process.env.NEXT_PUBLIC_STRIPE_UPSELL_7_PRICE_ID!,
    ]

    // Group sales by traffic source
    const channelData: Record<string, ChannelMetrics> = {}

    for (const session of sessions.data) {
      if (session.payment_status !== 'paid') continue

      const lineItems = session.line_items?.data || []
      for (const item of lineItems) {
        const priceId = item.price?.id || ''
        if (!YOUR_PRICE_IDS.includes(priceId)) continue

        // Get traffic source from metadata
        const metadata = session.metadata || {}
        const trafficSource = metadata.traffic_source || 'Direct'
        const customerEmail = session.customer_details?.email || 'unknown'

        // Initialize channel if not exists
        if (!channelData[trafficSource]) {
          channelData[trafficSource] = {
            sales: 0,
            revenue: 0,
            spend: 0,
            profit: 0,
            roi: 0,
            roas: 0,
            cpa: 0,
            customers: [],
          }
        }

        // Add to channel metrics
        channelData[trafficSource].sales += 1
        channelData[trafficSource].revenue += (session.amount_total || 0) / 100
        if (!channelData[trafficSource].customers.includes(customerEmail)) {
          channelData[trafficSource].customers.push(customerEmail)
        }
      }
    }

    // Fetch ad spend data (if configured)
    const adSpend: Record<string, number> = {}

    // Try to fetch Facebook Ads spend
    try {
      const fbResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/facebook-ads?days=${daysBack}`)
      const fbData = await fbResponse.json()
      if (fbData.success) {
        adSpend['Facebook Ads'] = parseFloat(fbData.summary.totalSpend)
      }
    } catch (error) {
      console.log('Facebook Ads API not configured or error:', error)
    }

    // Try to fetch Google Ads spend
    try {
      const googleResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/google-ads?days=${daysBack}`)
      const googleData = await googleResponse.json()
      if (googleData.success) {
        adSpend['Google Ads'] = parseFloat(googleData.summary.totalSpend)
      }
    } catch (error) {
      console.log('Google Ads API not configured or error:', error)
    }

    // Calculate profit and ROI for each channel
    Object.keys(channelData).forEach((channel) => {
      const metrics = channelData[channel]
      const spend = adSpend[channel] || 0

      // Stripe fees (2.9% + $0.30 per transaction)
      const stripeFees = (metrics.revenue * 0.029) + (metrics.sales * 0.30)

      // Calculate profit
      metrics.spend = spend
      metrics.profit = metrics.revenue - spend - stripeFees

      // Calculate ROI (Return on Investment)
      metrics.roi = spend > 0 ? ((metrics.profit / spend) * 100) : 0

      // Calculate ROAS (Return on Ad Spend)
      metrics.roas = spend > 0 ? (metrics.revenue / spend) : 0

      // Calculate CPA (Cost Per Acquisition)
      metrics.cpa = metrics.sales > 0 ? (spend / metrics.sales) : 0
    })

    // Sort channels by revenue
    const sortedChannels = Object.entries(channelData)
      .sort(([, a], [, b]) => b.revenue - a.revenue)
      .map(([channel, metrics]) => ({
        channel,
        ...metrics,
        customers: metrics.customers.length, // Return count instead of array
      }))

    // Calculate totals
    const totalSales = sortedChannels.reduce((sum, ch) => sum + ch.sales, 0)
    const totalRevenue = sortedChannels.reduce((sum, ch) => sum + ch.revenue, 0)
    const totalSpend = sortedChannels.reduce((sum, ch) => sum + ch.spend, 0)
    const totalProfit = sortedChannels.reduce((sum, ch) => sum + ch.profit, 0)

    const totals = {
      sales: totalSales,
      revenue: totalRevenue,
      spend: totalSpend,
      profit: totalProfit,
      roi: totalSpend > 0 ? ((totalProfit / totalSpend) * 100) : 0,
      roas: totalSpend > 0 ? (totalRevenue / totalSpend) : 0,
    }

    return NextResponse.json({
      success: true,
      period: { daysBack, startDate, endDate },
      channels: sortedChannels,
      totals,
      adSpendConfigured: {
        facebook: adSpend['Facebook Ads'] !== undefined,
        google: adSpend['Google Ads'] !== undefined,
      },
    })
  } catch (error: any) {
    console.error('Error calculating ROI analytics:', error)
    return NextResponse.json({
      error: 'Failed to calculate ROI analytics',
      message: error.message,
    }, { status: 500 })
  }
}
