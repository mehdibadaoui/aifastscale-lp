import { NextRequest, NextResponse } from 'next/server'

/**
 * Google Ads API Integration
 * Fetches ad spend data from Google Ads
 *
 * Setup Instructions:
 * 1. Go to https://ads.google.com/aw/overview
 * 2. Set up Google Ads API access (https://developers.google.com/google-ads/api/docs/first-call/overview)
 * 3. Get your Developer Token, Client ID, Client Secret, Refresh Token
 * 4. Add these environment variables:
 *    - GOOGLE_ADS_DEVELOPER_TOKEN
 *    - GOOGLE_ADS_CLIENT_ID
 *    - GOOGLE_ADS_CLIENT_SECRET
 *    - GOOGLE_ADS_REFRESH_TOKEN
 *    - GOOGLE_ADS_CUSTOMER_ID (format: 123-456-7890)
 */

export async function GET(req: NextRequest) {
  try {
    const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
    const clientId = process.env.GOOGLE_ADS_CLIENT_ID
    const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET
    const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN
    const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID

    if (!developerToken || !clientId || !clientSecret || !refreshToken || !customerId) {
      return NextResponse.json({
        error: 'Google Ads not configured',
        message: 'Please add Google Ads API credentials to your environment variables',
        manualEntryMode: true,
      })
    }

    // Step 1: Get Access Token from Refresh Token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error('Google OAuth error:', tokenData)
      return NextResponse.json({
        error: 'Google OAuth failed',
        details: tokenData.error_description || 'Unknown error',
        manualEntryMode: true,
      }, { status: 400 })
    }

    const accessToken = tokenData.access_token

    // Get date range from query params (default: last 30 days)
    const { searchParams } = new URL(req.url)
    const daysBack = parseInt(searchParams.get('days') || '30')

    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysBack)

    const startDateStr = startDate.toISOString().split('T')[0].replace(/-/g, '')
    const endDateStr = endDate.toISOString().split('T')[0].replace(/-/g, '')

    // Step 2: Query Google Ads API
    const query = `
      SELECT
        segments.date,
        metrics.cost_micros,
        metrics.clicks,
        metrics.impressions,
        metrics.average_cpc,
        metrics.ctr
      FROM customer
      WHERE segments.date BETWEEN '${startDateStr}' AND '${endDateStr}'
      ORDER BY segments.date DESC
    `

    const customerIdFormatted = customerId.replace(/-/g, '')
    const adsApiUrl = `https://googleads.googleapis.com/v14/customers/${customerIdFormatted}/googleAds:searchStream`

    const adsResponse = await fetch(adsApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': developerToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    const adsData = await adsResponse.json()

    if (!adsResponse.ok) {
      console.error('Google Ads API error:', adsData)
      return NextResponse.json({
        error: 'Google Ads API error',
        details: adsData.error?.message || 'Unknown error',
        manualEntryMode: true,
      }, { status: 400 })
    }

    // Process the data
    const results = adsData[0]?.results || []

    // Calculate totals
    let totalSpend = 0
    let totalClicks = 0
    let totalImpressions = 0

    const dailyBreakdown = results.map((result: any) => {
      const spend = (result.metrics.costMicros || 0) / 1000000 // Convert from micros to dollars
      const clicks = parseInt(result.metrics.clicks || '0')
      const impressions = parseInt(result.metrics.impressions || '0')

      totalSpend += spend
      totalClicks += clicks
      totalImpressions += impressions

      return {
        date: result.segments.date,
        spend: spend.toFixed(2),
        clicks,
        impressions,
        ctr: parseFloat(result.metrics.ctr || '0') * 100,
        cpc: (result.metrics.averageCpc || 0) / 1000000,
      }
    })

    return NextResponse.json({
      success: true,
      period: `${startDateStr} to ${endDateStr}`,
      summary: {
        totalSpend: totalSpend.toFixed(2),
        totalClicks,
        totalImpressions,
        avgCPC: totalClicks > 0 ? (totalSpend / totalClicks).toFixed(2) : '0',
        avgCTR: totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0',
      },
      dailyBreakdown,
    })
  } catch (error: any) {
    console.error('Error fetching Google Ads data:', error)
    return NextResponse.json({
      error: 'Failed to fetch Google Ads data',
      message: error.message,
      manualEntryMode: true,
    }, { status: 500 })
  }
}

/**
 * POST endpoint to manually save ad spend data
 * Use this if you don't want to connect the API
 */
export async function POST(req: NextRequest) {
  try {
    const { date, spend, clicks, impressions } = await req.json()

    if (!date || spend === undefined) {
      return NextResponse.json({
        error: 'Missing required fields: date, spend'
      }, { status: 400 })
    }

    // In a production app, you'd save this to a database
    // For now, we'll just return it to be stored client-side
    return NextResponse.json({
      success: true,
      data: {
        date,
        spend: parseFloat(spend),
        clicks: parseInt(clicks || '0'),
        impressions: parseInt(impressions || '0'),
        source: 'google',
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to save ad spend data',
      message: error.message
    }, { status: 500 })
  }
}
