/**
 * Unified tracking utilities for Google Analytics, Meta Pixel, and TikTok Pixel
 * All conversion events fire to all 3 platforms for optimal ad optimization
 */

declare global {
  interface Window {
    fbq: any
    gtag: any
    ttq: any
  }
}

/**
 * Track button clicks (AddToCart / ClickButton event)
 * Fires BEFORE user leaves the page - signals strong intent
 * @param buttonLocation - Where the button is located on the page
 */
export const trackButtonClick = (buttonLocation: string) => {
  // Meta/Facebook Pixel - AddToCart (signals buying intent)
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_name: '7 Minute AgentClone Course',
      content_category: 'AI Video Course',
      content_type: 'product',
      value: 37.0,
      currency: 'USD',
      button_location: buttonLocation,
    })
  }

  // TikTok Pixel - ClickButton
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track('ClickButton', {
      content_name: '7 Minute AgentClone Course',
      content_category: 'AI Video Course',
      content_type: 'product',
      value: 37.0,
      currency: 'USD',
      button_location: buttonLocation,
    })
  }

  // Google Analytics - add_to_cart event
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'USD',
      value: 37.0,
      items: [
        {
          item_id: 'agentclone_course',
          item_name: '7 Minute AgentClone Course',
          item_category: 'AI Video Course',
          price: 37.0,
          quantity: 1,
        },
      ],
      button_location: buttonLocation,
    })
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('🛒 AddToCart/ClickButton Tracked:', {
      location: buttonLocation,
      value: 37.0,
      currency: 'USD',
    })
  }
}

/**
 * Track checkout initiation (InitiateCheckout event)
 * Fires when user is redirected to Stripe payment page
 * @param buttonLocation - Where the button is located on the page
 */
export const trackCTAClick = (buttonLocation: string) => {
  // Meta/Facebook Pixel - InitiateCheckout
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_name: '7 Minute AgentClone Course',
      content_category: 'AI Video Course',
      content_type: 'product',
      value: 37.0,
      currency: 'USD',
      button_location: buttonLocation,
    })
  }

  // TikTok Pixel - InitiateCheckout
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track('InitiateCheckout', {
      content_name: '7 Minute AgentClone Course',
      content_category: 'AI Video Course',
      content_type: 'product',
      value: 37.0,
      currency: 'USD',
      button_location: buttonLocation,
    })
  }

  // Google Analytics - begin_checkout event
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'USD',
      value: 37.0,
      items: [
        {
          item_id: 'agentclone_course',
          item_name: '7 Minute AgentClone Course',
          item_category: 'AI Video Course',
          price: 37.0,
          quantity: 1,
        },
      ],
      button_location: buttonLocation,
    })
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('🎯 InitiateCheckout Tracked:', {
      location: buttonLocation,
      value: 37.0,
      currency: 'USD',
    })
  }
}

/**
 * Track video interactions
 * @param action - play, pause, complete, etc.
 * @param percentage - percentage watched (optional)
 */
export const trackVideoInteraction = (action: string, percentage?: number) => {
  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'VideoInteraction', {
      action,
      percentage,
      video_title: 'Hero VSL',
    })
  }

  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'video_' + action, {
      event_category: 'video',
      event_label: 'Hero VSL',
      value: percentage || 0,
    })
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('📹 Video Interaction:', action, percentage)
  }
}

/**
 * Track successful purchase - THE MOST IMPORTANT EVENT!
 * Fire this on the thank you page after Stripe payment success
 * @param orderId - Order/transaction ID from Stripe
 * @param value - Purchase amount (default $37)
 */
export const trackPurchase = (orderId: string, value: number = 37.0) => {
  // Meta/Facebook Pixel - Purchase
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      content_name: '7 Minute AgentClone Course',
      content_type: 'product',
      content_ids: ['agentclone_course'],
      value: value,
      currency: 'USD',
      transaction_id: orderId,
    })
  }

  // TikTok Pixel - CompletePayment
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track('CompletePayment', {
      content_name: '7 Minute AgentClone Course',
      content_type: 'product',
      content_id: 'agentclone_course',
      value: value,
      currency: 'USD',
      quantity: 1,
      order_id: orderId,
    })
  }

  // Google Analytics - purchase event
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: orderId,
      value: value,
      currency: 'USD',
      items: [
        {
          item_id: 'agentclone_course',
          item_name: '7 Minute AgentClone Course',
          item_category: 'AI Video Course',
          price: value,
          quantity: 1,
        },
      ],
    })

    // Also send conversion event (for Google Ads)
    window.gtag('event', 'conversion', {
      send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with your Google Ads conversion ID
      value: value,
      currency: 'USD',
      transaction_id: orderId,
    })
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('💰 Purchase Tracked:', orderId, value)
  }
}

/**
 * Track CompleteRegistration - Signals user completed the purchase flow
 * Fire this alongside Purchase event on thank you page
 * @param orderId - Order/transaction ID from Stripe
 */
export const trackCompleteRegistration = (orderId: string) => {
  // Meta/Facebook Pixel - CompleteRegistration
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'CompleteRegistration', {
      content_name: '7 Minute AgentClone Course',
      status: 'completed',
      value: 37.0,
      currency: 'USD',
      transaction_id: orderId,
    })
  }

  // TikTok Pixel - Subscribe (alternative to CompleteRegistration)
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track('Subscribe', {
      content_name: '7 Minute AgentClone Course',
      value: 37.0,
      currency: 'USD',
      order_id: orderId,
    })
  }

  // Google Analytics - sign_up event
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'sign_up', {
      method: 'Stripe Checkout',
      value: 37.0,
      currency: 'USD',
      transaction_id: orderId,
    })
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('✅ CompleteRegistration Tracked:', orderId)
  }
}

/**
 * Combined tracking function for CTA clicks
 * Fires both AddToCart/ClickButton AND InitiateCheckout for complete funnel tracking
 * Use this for all "GET INSTANT ACCESS" buttons
 * @param buttonLocation - Where the button is located on the page
 */
export const trackFullCTAClick = (buttonLocation: string) => {
  // First fire the AddToCart/ClickButton event (shows interest)
  trackButtonClick(buttonLocation)

  // Then fire InitiateCheckout (shows strong buying intent)
  trackCTAClick(buttonLocation)

  if (process.env.NODE_ENV === 'development') {
    console.log(
      '🚀 Full CTA Click Tracked (AddToCart + InitiateCheckout):',
      buttonLocation
    )
  }
}

/**
 * Track page scrolling depth
 * @param depth - Percentage scrolled (25, 50, 75, 100)
 */
export const trackScrollDepth = (depth: number) => {
  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'ScrollDepth', {
      depth: depth + '%',
    })
  }

  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'scroll_depth', {
      event_category: 'engagement',
      event_label: depth + '%',
      value: depth,
    })
  }
}
