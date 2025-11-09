/**
 * Meta Conversions API - Server-Side Event Tracking
 *
 * This bypasses iOS 14.5 limitations and ad blockers for accurate conversion tracking.
 * Sends Purchase, AddToCart, and other events directly from server to Facebook.
 */

import crypto from 'crypto'

interface MetaEventData {
  event_name: string // 'Purchase', 'AddToCart', 'InitiateCheckout', 'ViewContent'
  event_time: number // Unix timestamp
  action_source: 'website' | 'email' | 'app'
  event_source_url: string // URL where event occurred
  user_data: {
    em?: string[] // Hashed email
    ph?: string[] // Hashed phone
    fn?: string[] // Hashed first name
    ln?: string[] // Hashed last name
    ct?: string[] // Hashed city
    st?: string[] // Hashed state
    zp?: string[] // Hashed zip
    country?: string[] // Hashed country code
    client_ip_address?: string
    client_user_agent?: string
    fbp?: string // Facebook browser ID (_fbp cookie)
    fbc?: string // Facebook click ID (_fbc cookie)
    external_id?: string[] // Customer ID from your system
  }
  custom_data?: {
    currency?: string
    value?: number
    content_ids?: string[]
    content_type?: string
    content_name?: string
    num_items?: number
  }
}

/**
 * Hash data for privacy (SHA-256)
 */
function hashData(data: string): string {
  if (!data) return ''
  return crypto
    .createHash('sha256')
    .update(data.trim().toLowerCase())
    .digest('hex')
}

/**
 * Send event to Meta Conversions API
 */
export async function sendMetaEvent(eventData: MetaEventData): Promise<boolean> {
  try {
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
    const accessToken = process.env.META_CONVERSIONS_API_TOKEN

    if (!pixelId || !accessToken) {
      console.warn('Meta Conversions API not configured. Skipping server-side event.')
      return false
    }

    const url = `https://graph.facebook.com/v18.0/${pixelId}/events`

    const payload = {
      data: [eventData],
      access_token: accessToken,
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (result.events_received === 1) {
      console.log(`✅ Meta Conversions API: ${eventData.event_name} sent successfully`)
      return true
    } else {
      console.error('❌ Meta Conversions API error:', result)
      return false
    }
  } catch (error) {
    console.error('Failed to send Meta Conversions API event:', error)
    return false
  }
}

/**
 * Send Purchase event to Meta
 */
export async function trackMetaPurchase({
  email,
  phone,
  firstName,
  lastName,
  city,
  state,
  zip,
  country,
  amount,
  currency = 'USD',
  orderId,
  productName,
  clientIp,
  userAgent,
  fbp,
  fbc,
  eventSourceUrl,
}: {
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  amount: number
  currency?: string
  orderId: string
  productName: string
  clientIp?: string
  userAgent?: string
  fbp?: string
  fbc?: string
  eventSourceUrl?: string
}): Promise<boolean> {
  const eventData: MetaEventData = {
    event_name: 'Purchase',
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_source_url: eventSourceUrl || 'https://aifastscale.com',
    user_data: {
      em: email ? [hashData(email)] : undefined,
      ph: phone ? [hashData(phone)] : undefined,
      fn: firstName ? [hashData(firstName)] : undefined,
      ln: lastName ? [hashData(lastName)] : undefined,
      ct: city ? [hashData(city)] : undefined,
      st: state ? [hashData(state)] : undefined,
      zp: zip ? [hashData(zip)] : undefined,
      country: country ? [hashData(country)] : undefined,
      client_ip_address: clientIp,
      client_user_agent: userAgent,
      fbp: fbp,
      fbc: fbc,
      external_id: orderId ? [hashData(orderId)] : undefined,
    },
    custom_data: {
      currency,
      value: amount / 100, // Convert cents to dollars
      content_ids: [orderId],
      content_type: 'product',
      content_name: productName,
      num_items: 1,
    },
  }

  return await sendMetaEvent(eventData)
}
