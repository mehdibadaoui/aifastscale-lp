/**
 * Unified Meta Pixel + Conversions API Tracking Utility
 * Sends events to both browser pixel AND server-side CAPI for maximum accuracy
 */

declare global {
  interface Window {
    fbq?: (...args: any[]) => void
  }
}

// Get Facebook cookies for better matching
// IMPORTANT: Must preserve exact fbc value - don't modify/truncate!
function getFacebookCookies(): { fbc: string | null; fbp: string | null } {
  if (typeof document === 'undefined') return { fbc: null, fbp: null }

  // Parse cookies properly - handle values that contain '='
  const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? decodeURIComponent(match[2]) : null
  }

  let fbc = getCookie('_fbc')
  const fbp = getCookie('_fbp')

  // If no fbc cookie, try to get fbclid from URL and construct fbc
  // Format: fb.1.{timestamp}.{fbclid}
  if (!fbc && typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    const fbclid = urlParams.get('fbclid')
    if (fbclid) {
      // Construct fbc from fbclid - must be exact format
      fbc = `fb.1.${Date.now()}.${fbclid}`
    }
  }

  return { fbc, fbp }
}

// Generate unique event ID for deduplication
function generateEventId(eventName: string): string {
  return `${eventName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Check if event was already fired (for deduplication)
function hasEventFired(eventId: string): boolean {
  if (typeof sessionStorage === 'undefined') return false
  return sessionStorage.getItem(`meta_event_${eventId}`) === 'fired'
}

// Mark event as fired
function markEventFired(eventId: string): void {
  if (typeof sessionStorage === 'undefined') return
  sessionStorage.setItem(`meta_event_${eventId}`, 'fired')
}

interface TrackEventParams {
  eventName: string
  value?: number
  currency?: string
  contentName?: string
  contentCategory?: string
  contentType?: string
  contentIds?: string[]
  email?: string
  externalId?: string
  deduplicate?: boolean // Prevent duplicate events (for Purchase)
  dedupeKey?: string // Custom key for deduplication
}

/**
 * Track event to both Browser Pixel AND Conversions API
 */
export async function trackMetaEvent({
  eventName,
  value,
  currency = 'USD',
  contentName,
  contentCategory,
  contentType = 'product',
  contentIds,
  email,
  externalId,
  deduplicate = false,
  dedupeKey,
}: TrackEventParams): Promise<{ success: boolean; eventId: string }> {

  // Generate unique event ID for deduplication between pixel and CAPI
  const eventId = generateEventId(eventName)

  // Check deduplication
  const dedupeId = dedupeKey || `${eventName}_${value}_${contentName}`
  if (deduplicate && hasEventFired(dedupeId)) {
    console.log(`Meta event ${eventName} already fired, skipping (deduplication)`)
    return { success: true, eventId: 'deduplicated' }
  }

  // Get Facebook cookies
  const { fbc, fbp } = getFacebookCookies()

  // Build custom data
  const customData: Record<string, any> = {}
  if (value !== undefined) customData.value = value
  if (currency) customData.currency = currency
  if (contentName) customData.content_name = contentName
  if (contentCategory) customData.content_category = contentCategory
  if (contentType) customData.content_type = contentType
  if (contentIds) customData.content_ids = contentIds

  // 1. Fire Browser Pixel (client-side)
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      window.fbq('track', eventName, customData, { eventID: eventId })
      console.log(`Meta Pixel ${eventName} fired:`, { eventId, ...customData })
    } catch (error) {
      console.error(`Meta Pixel ${eventName} error:`, error)
    }
  }

  // 2. Fire Conversions API (server-side) - async, non-blocking
  try {
    fetch('/api/meta-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        eventId, // Same ID for deduplication
        sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
        fbc,
        fbp,
        email,
        externalId,
        value,
        currency,
        contentName,
        contentCategory,
        contentType,
        contentIds,
      }),
    }).then(res => res.json())
      .then(data => console.log(`Meta CAPI ${eventName} sent:`, data))
      .catch(err => console.error(`Meta CAPI ${eventName} error:`, err))
  } catch (error) {
    console.error(`Meta CAPI ${eventName} error:`, error)
  }

  // Mark as fired if deduplication is enabled
  if (deduplicate) {
    markEventFired(dedupeId)
  }

  return { success: true, eventId }
}

// Convenience functions for common events

export function trackPageView() {
  return trackMetaEvent({
    eventName: 'PageView',
  })
}

export function trackViewContent(contentName: string, value: number = 37) {
  return trackMetaEvent({
    eventName: 'ViewContent',
    contentName,
    value,
    contentCategory: 'AI Video Course',
  })
}

export function trackAddToCart(contentName: string, value: number) {
  return trackMetaEvent({
    eventName: 'AddToCart',
    contentName,
    value,
    currency: 'USD',
    contentCategory: 'AI Video Course',
  })
}

export function trackInitiateCheckout(contentName: string, value: number) {
  return trackMetaEvent({
    eventName: 'InitiateCheckout',
    contentName,
    value,
    currency: 'USD',
    contentCategory: 'AI Video Course',
  })
}

export function trackPurchase(
  contentName: string,
  value: number,
  email?: string,
  externalId?: string
) {
  return trackMetaEvent({
    eventName: 'Purchase',
    contentName,
    value,
    currency: 'USD',
    contentCategory: 'AI Video Course',
    email,
    externalId,
    deduplicate: true, // Prevent duplicate purchase events on page refresh
    dedupeKey: `purchase_${value}_${contentName}`,
  })
}

export function trackLead(contentName?: string) {
  return trackMetaEvent({
    eventName: 'Lead',
    contentName: contentName || 'Email Signup',
    contentCategory: 'AI Video Course',
  })
}
