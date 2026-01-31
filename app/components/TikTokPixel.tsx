'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    ttq: any
    TiktokAnalyticsObject: string
  }
}

// TikTok Pixel ID - Add your pixel ID here
const TIKTOK_PIXEL_ID = '' // TODO: Add your TikTok Pixel ID

function TikTokPixelInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize TikTok Pixel - deferred for performance
  useEffect(() => {
    // Don't load if no pixel ID configured
    if (!TIKTOK_PIXEL_ID) return

    // Delay loading to not block initial render
    const timer = setTimeout(() => {
      // Load TikTok Pixel script
      if (typeof window !== 'undefined' && !window.ttq) {
        (function(w: any, d: Document, t: string) {
        w.TiktokAnalyticsObject = t
        const ttq = w[t] = w[t] || []
        ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie', 'holdConsent', 'revokeConsent', 'grantConsent']
        ttq.setAndDefer = function(t: any, e: string) {
          t[e] = function() {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
          }
        }
        for (let i = 0; i < ttq.methods.length; i++) {
          ttq.setAndDefer(ttq, ttq.methods[i])
        }
        ttq.instance = function(t: string) {
          const e = ttq._i[t] || []
          for (let n = 0; n < ttq.methods.length; n++) {
            ttq.setAndDefer(e, ttq.methods[n])
          }
          return e
        }
        ttq.load = function(e: string, n?: any) {
          const r = 'https://analytics.tiktok.com/i18n/pixel/events.js'
          ttq._i = ttq._i || {}
          ttq._i[e] = []
          ttq._i[e]._u = r
          ttq._t = ttq._t || {}
          ttq._t[e] = +new Date()
          ttq._o = ttq._o || {}
          ttq._o[e] = n || {}
          const o = document.createElement('script')
          o.type = 'text/javascript'
          o.async = true
          o.src = r + '?sdkid=' + e + '&lib=' + t
          const s = document.getElementsByTagName('script')[0]
          s.parentNode?.insertBefore(o, s)
        }

        ttq.load(TIKTOK_PIXEL_ID)
        ttq.page()
      })(window, document, 'ttq')
      }
    }, 3000) // Delay 3 seconds for better performance

    return () => clearTimeout(timer)
  }, [])

  // Track page views on route change
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.page()
    }
  }, [pathname, searchParams])

  return null
}

// Wrapper with Suspense
export default function TikTokPixel() {
  // Don't render if no pixel ID
  if (!TIKTOK_PIXEL_ID) return null

  return (
    <Suspense fallback={null}>
      <TikTokPixelInner />
    </Suspense>
  )
}

// Helper functions for tracking events
export const trackTikTokEvent = (eventName: string, eventData?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track(eventName, eventData)
  }
}

export const trackTikTokViewContent = (contentId?: string, contentName?: string, value?: number) => {
  trackTikTokEvent('ViewContent', {
    content_id: contentId,
    content_name: contentName,
    value: value,
    currency: 'USD'
  })
}

export const trackTikTokInitiateCheckout = (contentId?: string, value?: number) => {
  trackTikTokEvent('InitiateCheckout', {
    content_id: contentId,
    value: value,
    currency: 'USD'
  })
}

export const trackTikTokCompletePayment = (contentId?: string, value?: number, orderId?: string) => {
  trackTikTokEvent('CompletePayment', {
    content_id: contentId,
    value: value,
    currency: 'USD',
    order_id: orderId
  })
}
