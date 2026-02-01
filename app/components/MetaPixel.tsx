'use client'

// Meta Pixel - Disabled (tracking removed)
export default function MetaPixel() {
  return null
}

// Helper functions - no-op
export function trackMetaEvent(eventName: string, params?: Record<string, any>) {}
export function trackMetaCustomEvent(eventName: string, params?: Record<string, any>) {}
