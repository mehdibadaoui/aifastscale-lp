import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// TikTok Pixel ID - Add your pixel ID here
const TIKTOK_PIXEL_ID = process.env.TIKTOK_PIXEL_ID || '' // TODO: Add your TikTok Pixel ID
const TIKTOK_ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN || ''

// TikTok Events API v1.3 endpoint (Web events)
const TIKTOK_API_URL = 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/'

// Hash function for PII (TikTok requires SHA256)
function hashData(data: string): string {
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    // Return early if not configured
    if (!TIKTOK_PIXEL_ID || !TIKTOK_ACCESS_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'TikTok CAPI not configured' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const {
      event_name,
      event_id,
      email,
      phone,
      external_id,
      content_id,
      content_name,
      value,
      currency = 'USD',
      order_id,
      url,
      referrer,
      ttclid, // TikTok click ID from URL params
    } = body

    // Get user info from request
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               ''
    const userAgent = request.headers.get('user-agent') || ''

    // Build user context
    const userContext: Record<string, string> = {}

    // Add ttclid if available (most important for attribution)
    if (ttclid) {
      userContext.ttclid = ttclid
    }

    // Add hashed PII if available
    if (email) {
      userContext.email = hashData(email)
    }
    if (phone) {
      userContext.phone_number = hashData(phone)
    }
    if (external_id) {
      userContext.external_id = hashData(external_id)
    }

    // Build properties object
    const properties: Record<string, any> = {}
    if (content_id) properties.content_id = content_id
    if (content_name) properties.content_name = content_name
    if (value) {
      properties.value = value
      properties.currency = currency
    }
    if (order_id) properties.order_id = order_id
    if (content_id || content_name) {
      properties.content_type = 'product'
    }

    // Build the request payload according to TikTok's v1.3 API spec
    const payload = {
      pixel_code: TIKTOK_PIXEL_ID,
      event: event_name,
      event_id: event_id || crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      context: {
        ad: ttclid ? { callback: ttclid } : undefined,
        page: {
          url: url || 'https://aifastscale.com',
          referrer: referrer || '',
        },
        user: Object.keys(userContext).length > 0 ? userContext : undefined,
        user_agent: userAgent,
        ip: ip,
      },
      properties: Object.keys(properties).length > 0 ? properties : undefined,
    }

    // Send to TikTok Events API
    const response = await fetch(TIKTOK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': TIKTOK_ACCESS_TOKEN,
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!response.ok || result.code !== 0) {
      console.error('TikTok CAPI Error:', result)
      return NextResponse.json(
        { success: false, error: result },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: `TikTok ${event_name} event sent successfully`,
      data: result,
    })
  } catch (error) {
    console.error('TikTok CAPI Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    status: 'TikTok CAPI endpoint ready',
    configured: !!(TIKTOK_PIXEL_ID && TIKTOK_ACCESS_TOKEN),
  })
}
