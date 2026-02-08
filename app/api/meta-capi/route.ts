import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const META_ACCESS_TOKEN = process.env.META_PIXEL_ACCESS_TOKEN

// Pixel IDs per niche
const PIXEL_IDS: Record<string, string> = {
  dermatologists: '1435824824556725',
  lawyers: '2660533017679840',
}

const API_VERSION = 'v21.0'

function hashSHA256(value: string): string {
  return crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex')
}

// Send event to Meta Conversions API
async function sendEvent({
  pixelId,
  eventName,
  eventId,
  email,
  userAgent,
  ip,
  url,
  value,
  currency,
  contentName,
}: {
  pixelId: string
  eventName: string
  eventId: string
  email?: string
  userAgent?: string
  ip?: string
  url?: string
  value?: number
  currency?: string
  contentName?: string
}) {
  if (!META_ACCESS_TOKEN) {
    console.error('[META CAPI] No access token configured')
    return { success: false, error: 'No access token' }
  }

  const userData: Record<string, string> = {}
  if (email) userData.em = hashSHA256(email)
  if (ip) userData.client_ip_address = ip
  if (userAgent) userData.client_user_agent = userAgent

  const customData: Record<string, any> = {}
  if (value) customData.value = value
  if (currency) customData.currency = currency
  if (contentName) {
    customData.content_name = contentName
    customData.content_type = 'product'
  }

  const eventData: any = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    action_source: 'website',
    user_data: userData,
  }

  if (url) eventData.event_source_url = url
  if (Object.keys(customData).length > 0) eventData.custom_data = customData

  try {
    const response = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${pixelId}/events?access_token=${META_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [eventData] }),
      }
    )

    const result = await response.json()

    if (!response.ok) {
      console.error(`[META CAPI] Error for ${pixelId}:`, result)
      return { success: false, error: result }
    }

    console.log(`[META CAPI] ${eventName} sent to pixel ${pixelId}:`, result)
    return { success: true, result }
  } catch (error) {
    console.error(`[META CAPI] Fetch error:`, error)
    return { success: false, error: String(error) }
  }
}

// POST: Send conversion event server-side
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { niche, eventName, eventId, email, value, currency, contentName, url } = body

    const pixelId = PIXEL_IDS[niche]
    if (!pixelId) {
      return NextResponse.json({ error: `Unknown niche: ${niche}` }, { status: 400 })
    }

    const userAgent = request.headers.get('user-agent') || undefined
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') || undefined

    const result = await sendEvent({
      pixelId,
      eventName,
      eventId: eventId || `${eventName}_${Date.now()}`,
      email,
      userAgent,
      ip,
      url,
      value,
      currency,
      contentName,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('[META CAPI] Route error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// Exported helper for use from Stripe webhook
export { sendEvent, PIXEL_IDS }
