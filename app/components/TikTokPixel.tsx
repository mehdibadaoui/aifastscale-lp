'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    ttq: any
    TiktokAnalyticsObject: string
  }
}

export default function TikTokPixel() {
  const PIXEL_ID =
    process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || 'D3LRUDJC77U1N95DTTAG'

  // Don't load pixel in development
  if (process.env.NODE_ENV === 'development') {
    return null
  }

  useEffect(() => {
    // Initialize TikTok Pixel
    if (typeof window !== 'undefined' && !window.ttq) {
      window.TiktokAnalyticsObject = 'ttq'
      const ttq: any = (window.ttq = window.ttq || [])

      ttq.methods = [
        'page',
        'track',
        'identify',
        'instances',
        'debug',
        'on',
        'off',
        'once',
        'ready',
        'alias',
        'group',
        'enableCookie',
        'disableCookie',
      ]

      ttq.setAndDefer = function (t: any, e: any) {
        t[e] = function () {
          t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
        }
      }

      for (let i = 0; i < ttq.methods.length; i++) {
        ttq.setAndDefer(ttq, ttq.methods[i])
      }

      ttq.instance = function (t: any) {
        const e = ttq._i[t] || []
        for (let n = 0; n < ttq.methods.length; n++) {
          ttq.setAndDefer(e, ttq.methods[n])
        }
        return e
      }

      ttq.load = function (e: any, n: any) {
        const i = 'https://analytics.tiktok.com/i18n/pixel/events.js'
        ttq._i = ttq._i || {}
        ttq._i[e] = []
        ttq._i[e]._u = i
        ttq._t = ttq._t || {}
        ttq._t[e] = +new Date()
        ttq._o = ttq._o || {}
        ttq._o[e] = n || {}

        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.async = true
        script.src = i + '?sdkid=' + e + '&lib=ttq'
        const firstScript = document.getElementsByTagName('script')[0]
        if (firstScript && firstScript.parentNode) {
          firstScript.parentNode.insertBefore(script, firstScript)
        }
      }

      ttq.load(PIXEL_ID)
      ttq.page()
    }

    // Track initial events
    if (window.ttq) {
      window.ttq.track('Browse')

      // Track ViewContent with product details
      window.ttq.track('ViewContent', {
        content_name: '7 Minute AgentClone Course',
        content_category: 'AI Video Course',
        content_type: 'product',
        value: 37.0,
        currency: 'USD',
      })
    }
  }, [PIXEL_ID])

  return null
}
