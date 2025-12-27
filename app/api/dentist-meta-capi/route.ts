import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// DENTIST Meta Conversions API Configuration
// BOTH pixels for maximum tracking coverage
const PIXELS = [
  {
    id: '834713712860127',
    token: process.env.DENTIST_META_CAPI_TOKEN || '',
    name: 'Dentist Pixel 1'
  },
  {
    id: '1176362697938270',
    token: process.env.DENTIST_PIXEL2_CAPI_TOKEN || '',
    name: 'Dentist Pixel 2'
  }
]

const API_VERSION = 'v18.0'

// Hash function for PII (required by Meta)
function hashSHA256(value: string): string {
  if (!value) return ''
  return crypto
    .createHash('sha256')
    .update(value.toLowerCase().trim())
    .digest('hex')
}

interface EventData {
  event_name: string
  event_time: number
  event_id: string
  event_source_url: string
  action_source: 'website'
  user_data: {
    em?: string
    ph?: string
    fn?: string
    ln?: string
    client_ip_address?: string
    client_user_agent?: string
    fbc?: string
    fbp?: string
    external_id?: string
  }
  custom_data?: {
    value?: number
    currency?: string
    content_name?: string
    content_category?: string
    content_type?: string
    content_ids?: string[]
    num_items?: number
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      eventName,
      eventId,
      sourceUrl,
      email,
      phone,
      firstName,
      lastName,
      fbc,
      fbp,
      externalId,
      value,
      currency,
      contentName,
      contentCategory,
      contentType,
      contentIds,
    } = body

    // Validate required fields
    if (!eventName) {
      return NextResponse.json(
        { error: 'eventName is required' },
        { status: 400 }
      )
    }

    // Get client info from headers
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                     request.headers.get('x-real-ip') ||
                     ''
    const userAgent = request.headers.get('user-agent') || ''

    // Generate unique event ID
    const uniqueEventId = eventId || `${eventName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Build event data
    const eventData: EventData = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: uniqueEventId,
      event_source_url: sourceUrl || 'https://aifastscale.com/dentists',
      action_source: 'website',
      user_data: {
        client_ip_address: clientIp,
        client_user_agent: userAgent,
      },
    }

    // Add hashed PII if provided
    if (email) eventData.user_data.em = hashSHA256(email)
    if (phone) eventData.user_data.ph = hashSHA256(phone)
    if (firstName) eventData.user_data.fn = hashSHA256(firstName)
    if (lastName) eventData.user_data.ln = hashSHA256(lastName)
    if (fbc) eventData.user_data.fbc = fbc
    if (fbp) eventData.user_data.fbp = fbp
    if (externalId) eventData.user_data.external_id = hashSHA256(externalId)

    // Add custom data for conversion events
    if (value || contentName || contentIds) {
      eventData.custom_data = {}
      if (value) eventData.custom_data.value = value
      if (currency) eventData.custom_data.currency = currency || 'USD'
      if (contentName) eventData.custom_data.content_name = contentName
      if (contentCategory) eventData.custom_data.content_category = contentCategory
      if (contentType) eventData.custom_data.content_type = contentType || 'product'
      if (contentIds) eventData.custom_data.content_ids = contentIds
    }

    // Send to BOTH Meta pixels in parallel
    const results = await Promise.allSettled(
      PIXELS.filter(pixel => pixel.token).map(async (pixel) => {
        const response = await fetch(
          `https://graph.facebook.com/${API_VERSION}/${pixel.id}/events?access_token=${pixel.token}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              data: [eventData],
            }),
          }
        )

        const result = await response.json()

        if (!response.ok) {
          console.error(`${pixel.name} CAPI Error:`, result)
          return { pixel: pixel.name, success: false, error: result }
        }

        console.log(`${pixel.name} CAPI ${eventName} sent:`, result)
        return { pixel: pixel.name, success: true, events_received: result.events_received }
      })
    )

    // Check results
    const successful = results.filter(r => r.status === 'fulfilled' && (r.value as any).success)
    const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !(r.value as any).success))

    console.log(`Dentist CAPI: ${successful.length}/${PIXELS.length} pixels received ${eventName}`)

    return NextResponse.json({
      success: successful.length > 0,
      event_id: uniqueEventId,
      pixels_sent: successful.length,
      pixels_total: PIXELS.filter(p => p.token).length,
      results: results.map(r => r.status === 'fulfilled' ? r.value : { error: 'failed' })
    })

  } catch (error) {
    console.error('Dentist Meta CAPI Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
