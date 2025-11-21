/**
 * Facebook Conversions API Helper
 * Sends server-side events to Facebook for better tracking (bypasses ad blockers & iOS ATT)
 */

import crypto from 'crypto'

const PIXEL_ID = '806502898408304' // Hardcoded for reliability
const ACCESS_TOKEN = process.env.META_CONVERSIONS_API_TOKEN || ''

interface UserData {
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  ip?: string
  userAgent?: string
}

interface FacebookEvent {
  eventName: string
  eventTime: number
  eventSourceUrl: string
  userData: UserData
  customData?: {
    currency?: string
    value?: number
    content_name?: string
    content_category?: string
    content_ids?: string[]
    num_items?: number
  }
}

// Hash user data for privacy (Facebook requirement)
function hashData(data: string): string {
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex')
}

export async function sendFacebookEvent(event: FacebookEvent): Promise<boolean> {
  if (!ACCESS_TOKEN) {
    console.warn('⚠️ META_CONVERSIONS_API_TOKEN not set - skipping Facebook Conversion API')
    return false
  }

  try {
    // Hash sensitive user data
    const hashedUserData: any = {}

    if (event.userData.email) {
      hashedUserData.em = hashData(event.userData.email)
    }

    if (event.userData.phone) {
      hashedUserData.ph = hashData(event.userData.phone)
    }

    if (event.userData.firstName) {
      hashedUserData.fn = hashData(event.userData.firstName)
    }

    if (event.userData.lastName) {
      hashedUserData.ln = hashData(event.userData.lastName)
    }

    if (event.userData.city) {
      hashedUserData.ct = hashData(event.userData.city)
    }

    if (event.userData.state) {
      hashedUserData.st = hashData(event.userData.state)
    }

    if (event.userData.zip) {
      hashedUserData.zp = hashData(event.userData.zip)
    }

    if (event.userData.country) {
      hashedUserData.country = hashData(event.userData.country)
    }

    // Client IP and User Agent (not hashed)
    if (event.userData.ip) {
      hashedUserData.client_ip_address = event.userData.ip
    }

    if (event.userData.userAgent) {
      hashedUserData.client_user_agent = event.userData.userAgent
    }

    // Build event payload
    const eventData = {
      event_name: event.eventName,
      event_time: event.eventTime,
      event_source_url: event.eventSourceUrl,
      action_source: 'website',
      user_data: hashedUserData,
      custom_data: event.customData || {},
    }

    // Send to Facebook
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [eventData],
          test_event_code: process.env.NODE_ENV === 'production' ? undefined : 'TEST12345', // Use test mode in development
        }),
      }
    )

    const result = await response.json()

    if (result.events_received === 1) {
      console.log('✅ Facebook Conversion API event sent:', event.eventName)
      return true
    } else {
      console.error('❌ Facebook Conversion API error:', result)
      return false
    }
  } catch (error) {
    console.error('❌ Facebook Conversion API failed:', error)
    return false
  }
}
