// UTM Tracking Utility
// Captures UTM parameters and stores them for attribution

export interface UTMParameters {
  utm_source?: string      // e.g., 'facebook', 'google'
  utm_medium?: string      // e.g., 'cpc', 'social'
  utm_campaign?: string    // e.g., 'summer_sale'
  utm_term?: string        // e.g., 'real+estate+dubai'
  utm_content?: string     // e.g., 'video_ad_1'
  fbclid?: string         // Facebook Click ID
  gclid?: string          // Google Click ID
  referrer?: string       // Referring URL
  landing_page?: string   // First page visited
}

const UTM_STORAGE_KEY = 'aifastscale_utm'
const UTM_EXPIRY_DAYS = 30 // UTM parameters expire after 30 days

export function captureUTMParameters(): UTMParameters {
  if (typeof window === 'undefined') return {}

  const urlParams = new URLSearchParams(window.location.search)
  const utmParams: UTMParameters = {}

  // Capture UTM parameters
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
  utmKeys.forEach((key) => {
    const value = urlParams.get(key)
    if (value) {
      utmParams[key as keyof UTMParameters] = value
    }
  })

  // Capture click IDs
  const fbclid = urlParams.get('fbclid')
  const gclid = urlParams.get('gclid')
  if (fbclid) utmParams.fbclid = fbclid
  if (gclid) utmParams.gclid = gclid

  // Capture referrer
  if (document.referrer && document.referrer !== window.location.href) {
    utmParams.referrer = document.referrer
  }

  // Capture landing page
  utmParams.landing_page = window.location.pathname + window.location.search

  return utmParams
}

export function getStoredUTMParameters(): UTMParameters | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(UTM_STORAGE_KEY)
    if (!stored) return null

    const { data, timestamp } = JSON.parse(stored)

    // Check if expired
    const daysSinceCapture = (Date.now() - timestamp) / (1000 * 60 * 60 * 24)
    if (daysSinceCapture > UTM_EXPIRY_DAYS) {
      localStorage.removeItem(UTM_STORAGE_KEY)
      return null
    }

    return data
  } catch (error) {
    console.error('Error reading UTM parameters:', error)
    return null
  }
}

export function storeUTMParameters(utmParams: UTMParameters): void {
  if (typeof window === 'undefined') return
  if (Object.keys(utmParams).length === 0) return

  const storageData = {
    data: utmParams,
    timestamp: Date.now(),
  }

  localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(storageData))
}

export function getAttributionData(): UTMParameters {
  // Try to get from URL first (highest priority)
  const urlUtm = captureUTMParameters()

  // If we have new UTM params, store them
  if (Object.keys(urlUtm).filter(k => k.startsWith('utm_') || k === 'fbclid' || k === 'gclid').length > 0) {
    storeUTMParameters(urlUtm)
    return urlUtm
  }

  // Otherwise, get stored UTM params
  const storedUtm = getStoredUTMParameters()
  return storedUtm || {}
}

export function getTrafficSource(utmParams: UTMParameters): string {
  // Determine traffic source from UTM parameters

  // 1. Check for paid ads (highest priority)
  if (utmParams.fbclid || utmParams.utm_source?.toLowerCase().includes('facebook')) {
    return 'Facebook Ads'
  }
  if (utmParams.gclid || (utmParams.utm_source?.toLowerCase().includes('google') && utmParams.utm_medium?.toLowerCase() === 'cpc')) {
    return 'Google Ads'
  }
  if (utmParams.utm_source?.toLowerCase().includes('instagram')) {
    return 'Instagram Ads'
  }
  if (utmParams.utm_source?.toLowerCase().includes('tiktok')) {
    return 'TikTok Ads'
  }

  // 2. Check for UTM source (could be email, social, etc.)
  if (utmParams.utm_source) {
    // Specific sources we want to track
    const source = utmParams.utm_source.toLowerCase()
    if (source.includes('email')) return 'Email Marketing'
    if (source.includes('youtube')) return 'YouTube'
    if (source.includes('linkedin')) return 'LinkedIn'
    if (source.includes('twitter') || source.includes('x.com')) return 'Twitter/X'
    if (source.includes('reddit')) return 'Reddit'

    // Return capitalized utm_source for custom campaigns
    return utmParams.utm_source.charAt(0).toUpperCase() + utmParams.utm_source.slice(1)
  }

  // 3. Check referrer for organic search engines (SEO)
  if (utmParams.referrer) {
    try {
      const url = new URL(utmParams.referrer)
      const hostname = url.hostname.toLowerCase()

      // Organic search engines (SEO traffic)
      if (hostname.includes('google.')) return 'Google Organic (SEO)'
      if (hostname.includes('bing.')) return 'Bing Organic (SEO)'
      if (hostname.includes('yahoo.')) return 'Yahoo Organic (SEO)'
      if (hostname.includes('duckduckgo.')) return 'DuckDuckGo Organic (SEO)'
      if (hostname.includes('baidu.')) return 'Baidu Organic (SEO)'
      if (hostname.includes('yandex.')) return 'Yandex Organic (SEO)'

      // Social media referrals (organic, not paid)
      if (hostname.includes('facebook.')) return 'Facebook Organic'
      if (hostname.includes('instagram.')) return 'Instagram Organic'
      if (hostname.includes('tiktok.')) return 'TikTok Organic'
      if (hostname.includes('youtube.')) return 'YouTube'
      if (hostname.includes('linkedin.')) return 'LinkedIn'
      if (hostname.includes('twitter.') || hostname.includes('x.com')) return 'Twitter/X'
      if (hostname.includes('reddit.')) return 'Reddit'
      if (hostname.includes('pinterest.')) return 'Pinterest'

      // Other referrals
      return `Referral: ${hostname.replace('www.', '')}`
    } catch {
      return 'Referral'
    }
  }

  // 4. No UTM params and no referrer = Direct traffic
  return 'Direct'
}

export function formatUTMForMetadata(utmParams: UTMParameters): Record<string, string> {
  // Format UTM parameters for Stripe metadata
  const metadata: Record<string, string> = {}

  Object.entries(utmParams).forEach(([key, value]) => {
    if (value) {
      metadata[key] = value
    }
  })

  // Add computed traffic source
  metadata.traffic_source = getTrafficSource(utmParams)

  return metadata
}
