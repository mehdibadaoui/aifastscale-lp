import { NextRequest, NextResponse } from 'next/server'

/**
 * Facebook Marketing API Integration
 * Fetches ad spend data from Facebook Ads
 *
 * Setup Instructions:
 * 1. Go to https://developers.facebook.com/apps
 * 2. Create an app and get your Access Token
 * 3. Add these environment variables:
 *    - FACEBOOK_ACCESS_TOKEN
 *    - FACEBOOK_AD_ACCOUNT_ID (format: act_XXXXXXXXXX)
 */

export async function GET(req: NextRequest) {
  try {
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN
    const adAccountId = process.env.FACEBOOK_AD_ACCOUNT_ID

    if (!accessToken || !adAccountId) {
      return NextResponse.json({
        error: 'Facebook Ads not configured',
        message: 'Please add FACEBOOK_ACCESS_TOKEN and FACEBOOK_AD_ACCOUNT_ID to your environment variables',
        manualEntryMode: true,
      })
    }

    // Get date range from query params (default: last 30 days)
    const { searchParams } = new URL(req.url)
    const daysBack = parseInt(searchParams.get('days') || '30')

    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysBack)

    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = endDate.toISOString().split('T')[0]

    // Fetch ad insights from Facebook Marketing API
    const apiUrl = `https://graph.facebook.com/v18.0/${adAccountId}/insights`
    const params = new URLSearchParams({
      access_token: accessToken,
      time_range: JSON.stringify({
        since: startDateStr,
        until: endDateStr,
      }),
      level: 'account',
      fields: 'spend,impressions,clicks,actions,cost_per_action_type,cpc,cpm,ctr,reach,frequency',
      time_increment: '1', // Daily breakdown
    })

    const response = await fetch(`${apiUrl}?${params.toString()}`)
    const data = await response.json()

    if (!response.ok) {
      console.error('Facebook API error:', data)
      return NextResponse.json({
        error: 'Facebook API error',
        details: data.error?.message || 'Unknown error',
        manualEntryMode: true,
      }, { status: 400 })
    }

    // Process the data
    const dailyData = data.data || []

    // Calculate totals
    const totalSpend = dailyData.reduce((sum: number, day: any) => sum + parseFloat(day.spend || '0'), 0)
    const totalClicks = dailyData.reduce((sum: number, day: any) => sum + parseInt(day.clicks || '0'), 0)
    const totalImpressions = dailyData.reduce((sum: number, day: any) => sum + parseInt(day.impressions || '0'), 0)

    // Calculate daily breakdown
    const dailyBreakdown = dailyData.map((day: any) => ({
      date: day.date_start,
      spend: parseFloat(day.spend || '0'),
      clicks: parseInt(day.clicks || '0'),
      impressions: parseInt(day.impressions || '0'),
      ctr: parseFloat(day.ctr || '0'),
      cpc: parseFloat(day.cpc || '0'),
    }))

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
    console.error('Error fetching Facebook Ads data:', error)
    return NextResponse.json({
      error: 'Failed to fetch Facebook Ads data',
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
        source: 'facebook',
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to save ad spend data',
      message: error.message
    }, { status: 500 })
  }
}
