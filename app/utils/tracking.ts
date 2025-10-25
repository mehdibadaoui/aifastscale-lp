/**
 * Unified tracking utilities for Facebook Pixel and Google Analytics
 */

declare global {
  interface Window {
    fbq: any;
    gtag: any;
  }
}

/**
 * Track CTA button clicks (InitiateCheckout event)
 * @param buttonLocation - Where the button is located on the page
 */
export const trackCTAClick = (buttonLocation: string) => {
  // Facebook Pixel - InitiateCheckout
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_name: '7 Minute AgentClone Course',
      content_category: 'AI Video Course',
      content_type: 'product',
      value: 37.00,
      currency: 'USD',
      button_location: buttonLocation
    });
  }

  // Google Analytics - Conversion Event
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'USD',
      value: 37.00,
      items: [{
        item_id: 'agentclone_course',
        item_name: '7 Minute AgentClone Course',
        item_category: 'AI Video Course',
        price: 37.00,
        quantity: 1
      }],
      button_location: buttonLocation
    });

    // Also track as custom conversion
    window.gtag('event', 'cta_click', {
      event_category: 'engagement',
      event_label: buttonLocation,
      value: 37.00
    });
  }

  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🎯 CTA Click Tracked:', {
      event: 'InitiateCheckout',
      location: buttonLocation,
      value: 37.00,
      currency: 'USD'
    });
  }
};

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
      video_title: 'Hero VSL'
    });
  }

  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'video_' + action, {
      event_category: 'video',
      event_label: 'Hero VSL',
      value: percentage || 0
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('📹 Video Interaction:', action, percentage);
  }
};

/**
 * Track successful purchase (for later Stripe integration)
 * @param orderId - Order/transaction ID
 * @param value - Purchase amount
 */
export const trackPurchase = (orderId: string, value: number = 37.00) => {
  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      content_name: '7 Minute AgentClone Course',
      content_type: 'product',
      content_ids: ['agentclone_course'],
      value: value,
      currency: 'USD',
      transaction_id: orderId
    });
  }

  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: orderId,
      value: value,
      currency: 'USD',
      items: [{
        item_id: 'agentclone_course',
        item_name: '7 Minute AgentClone Course',
        item_category: 'AI Video Course',
        price: value,
        quantity: 1
      }]
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('💰 Purchase Tracked:', orderId, value);
  }
};

/**
 * Track page scrolling depth
 * @param depth - Percentage scrolled (25, 50, 75, 100)
 */
export const trackScrollDepth = (depth: number) => {
  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'ScrollDepth', {
      depth: depth + '%'
    });
  }

  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'scroll_depth', {
      event_category: 'engagement',
      event_label: depth + '%',
      value: depth
    });
  }
};
