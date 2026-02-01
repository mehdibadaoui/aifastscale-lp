'use client'

// TikTok Pixel - Disabled (tracking removed)
export default function TikTokPixel() {
  return null
}

// Helper functions - no-op
export const trackTikTokEvent = (eventName: string, eventData?: Record<string, any>) => {}
export const trackTikTokViewContent = (contentId?: string, contentName?: string, value?: number) => {}
export const trackTikTokInitiateCheckout = (contentId?: string, value?: number) => {}
export const trackTikTokCompletePayment = (contentId?: string, value?: number, orderId?: string) => {}
