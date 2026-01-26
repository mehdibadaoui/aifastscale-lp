import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

/**
 * Meta Conversions API for Psychologists
 *
 * Fires server-side events to Meta for accurate tracking.
 * Used for Purchase events from webhook (can't be blocked by browsers).
 */

// Psychologist Pixel ID
const PIXEL_ID = '778800911911121'
const ACCESS_TOKEN = process.env.PSYCHOLOGIST_META_CAPI_TOKEN || ''

// Hash function for PII (required by Meta)
function hashSHA256(value: string): string {
  if (!value) return ''
  return crypto
    .createHash('sha256')
    .update(value.toLowerCase().trim())
    .digest('hex')
}

// Generate unique event ID for deduplication
function generateEventId(eventName: string): string {
  return `${eventName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      eventName,
      email,
      value,
      currency = 'USD',
      contentName,
      contentType = 'product',
      contentIds = ['psychologist-main'],
      sourceUrl,
      eventId,
      // Optional user data for better matching
      firstName,
      lastName,
      phone,
      city,
      state,
      zipCode,
      country,
      // Client info for browser events
      userAgent,
      clientIpAddress,
      fbc, // Facebook click ID
      fbp, // Facebook browser ID
    } = body

    // Validate required fields
    if (!eventName) {
      return NextResponse.json(
        { success: false, error: 'eventName is required' },
        { status: 400 }
      )
    }

    if (!ACCESS_TOKEN) {
      console.log('⚠️ PSYCHOLOGIST_META_CAPI_TOKEN not configured')
      return NextResponse.json(
        { success: false, error: 'CAPI token not configured' },
        { status: 500 }
      )
    }

    // Get IP and UA from headers if not provided
    const ip = clientIpAddress ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') || ''
    const ua = userAgent || request.headers.get('user-agent') || ''

    // Build user data object with hashed PII
    const userData: Record<string, any> = {}

    if (email) userData.em = [hashSHA256(email)]
    if (firstName) userData.fn = [hashSHA256(firstName)]
    if (lastName) userData.ln = [hashSHA256(lastName)]
    if (phone) userData.ph = [hashSHA256(phone.replace(/\D/g, ''))]
    if (city) userData.ct = [hashSHA256(city)]
    if (state) userData.st = [hashSHA256(state)]
    if (zipCode) userData.zp = [hashSHA256(zipCode)]
    if (country) userData.country = [hashSHA256(country)]

    // Add client identifiers (not hashed)
    if (fbc) userData.fbc = fbc
    if (fbp) userData.fbp = fbp
    if (ip) userData.client_ip_address = ip
    if (ua) userData.client_user_agent = ua

    // Build custom data
    const customData: Record<string, any> = {
      content_type: contentType,
      content_ids: contentIds,
    }

    if (value !== undefined) customData.value = value
    if (currency) customData.currency = currency
    if (contentName) customData.content_name = contentName

    // Build event payload
    const eventData = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId || generateEventId(eventName),
      event_source_url: sourceUrl || 'https://aifastscale.com/psychologists',
      action_source: 'website',
      user_data: userData,
      custom_data: customData,
    }

    // Send to Meta
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [eventData] }),
      }
    )

    const result = await response.json()

    if (response.ok) {
      console.log(`✅ Psychologist CAPI ${eventName}: $${value || 0} - ${contentName || 'N/A'}`)
      return NextResponse.json({
        success: true,
        eventId: eventData.event_id,
        eventsReceived: result.events_received
      })
    } else {
      console.error('❌ Psychologist CAPI Error:', result)
      return NextResponse.json(
        { success: false, error: result.error?.message || 'CAPI request failed' },
        { status: 400 }
      )
    }

  } catch (error: any) {
    console.error('❌ Psychologist CAPI Exception:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error' },
      { status: 500 }
    )
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'Psychologist Meta CAPI endpoint active',
    pixelId: PIXEL_ID,
    tokenConfigured: !!ACCESS_TOKEN,
    timestamp: new Date().toISOString()
  })
}
