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

    // Fetch ALL sales data from Stripe with pagination
    let allSessions: any[] = []
    let hasMore = true
    let startingAfter: string | undefined = undefined

    while (hasMore) {
      const params: any = {
        limit: 100,
        created: { gte: startDate, lte: endDate },
        expand: ['data.line_items'],
      }
      if (startingAfter) params.starting_after = startingAfter

      const sessions = await stripe.checkout.sessions.list(params)
      allSessions = allSessions.concat(sessions.data)

      hasMore = sessions.has_more
      if (hasMore) {
        startingAfter = sessions.data[sessions.data.length - 1].id
      }
    }

    // Price IDs
    const YOUR_PRICE_IDS = [
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
      process.env.NEXT_PUBLIC_STRIPE_UPSELL_17_PRICE_ID!,
      process.env.NEXT_PUBLIC_STRIPE_UPSELL_7_PRICE_ID!,
    ]

    // Group sales by traffic source
    const channelData: Record<string, ChannelMetrics> = {}

    for (const session of allSessions) {
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

    // ALSO process Payment Intents (1-click upsells/downsells)
    // Fetch ALL Payment Intents with pagination
    let allPaymentIntents: any[] = []
    let hasMorePI = true
    let startingAfterPI: string | undefined = undefined

    while (hasMorePI) {
      const params: any = {
        limit: 100,
        created: { gte: startDate, lte: endDate },
      }
      if (startingAfterPI) params.starting_after = startingAfterPI

      const paymentIntents = await stripe.paymentIntents.list(params)
      allPaymentIntents = allPaymentIntents.concat(paymentIntents.data)

      hasMorePI = paymentIntents.has_more
      if (hasMorePI) {
        startingAfterPI = paymentIntents.data[paymentIntents.data.length - 1].id
      }
    }

    // Process Payment Intents (1-click upsells/downsells)
    for (const pi of allPaymentIntents) {
      if (pi.status !== 'succeeded') continue
      if (!pi.metadata || !pi.metadata.upsell_type) continue

      // Get traffic source from original session
      let trafficSource = '1-Click Upsell'
      let customerEmail = 'unknown'

      if (pi.metadata.original_session) {
        const originalSession = allSessions.find(s => s.id === pi.metadata.original_session)
        if (originalSession) {
          const metadata = originalSession.metadata || {}
          trafficSource = metadata.traffic_source || 'Direct'
          customerEmail = originalSession.customer_details?.email || 'unknown'
        }
      }

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
      channelData[trafficSource].revenue += (pi.amount || 0) / 100
      if (!channelData[trafficSource].customers.includes(customerEmail)) {
        channelData[trafficSource].customers.push(customerEmail)
      }
    }

    // Fetch ad spend data (if configured)
    const adSpend: Record<string, number> = {}

    // Try to fetch Facebook Ads spend directly
    try {
      const accessToken = process.env.FACEBOOK_ACCESS_TOKEN
      const adAccountId = process.env.FACEBOOK_AD_ACCOUNT_ID

      if (accessToken && adAccountId) {
        // Calculate date range for Facebook API
        const endDateObj = new Date()
        const startDateObj = new Date()
        startDateObj.setDate(startDateObj.getDate() - daysBack)

        const startDateStr = startDateObj.toISOString().split('T')[0]
        const endDateStr = endDateObj.toISOString().split('T')[0]

        // Fetch from Facebook Marketing API
        const apiUrl = `https://graph.facebook.com/v18.0/${adAccountId}/insights`
        const params = new URLSearchParams({
          access_token: accessToken,
          time_range: JSON.stringify({
            since: startDateStr,
            until: endDateStr,
          }),
          level: 'account',
          fields: 'spend',
        })

        const fbResponse = await fetch(`${apiUrl}?${params.toString()}`)
        const fbData = await fbResponse.json()

        if (fbResponse.ok && fbData.data) {
          const totalSpend = fbData.data.reduce((sum: number, day: any) => sum + parseFloat(day.spend || '0'), 0)
          adSpend['Facebook Ads'] = totalSpend
          console.log(`✅ Facebook Ads spend: $${totalSpend.toFixed(2)}`)
        } else {
          // Log error details for debugging
          console.error('❌ Facebook Ads API error:')
          console.error('Status:', fbResponse.status)
          console.error('Response:', JSON.stringify(fbData, null, 2))

          // Common errors:
          if (fbData.error?.code === 190) {
            console.error('Token expired or invalid - regenerate access token')
          } else if (fbData.error?.code === 100) {
            console.error('Invalid Ad Account ID')
          }
        }
      } else {
        console.log('⚠️ Facebook Ads not configured (missing access token or account ID)')
      }
    } catch (error: any) {
      console.error('❌ Facebook Ads API exception:', error.message)
    }

    // Try to fetch Google Ads spend directly
    try {
      const googleAccessToken = process.env.GOOGLE_ADS_ACCESS_TOKEN
      const googleCustomerId = process.env.GOOGLE_ADS_CUSTOMER_ID

      if (googleAccessToken && googleCustomerId) {
        // Google Ads API integration would go here
        // For now, skip if not configured
        console.log('⚠️ Google Ads API not implemented yet')
      }
    } catch (error) {
      console.log('Google Ads API error:', error)
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
