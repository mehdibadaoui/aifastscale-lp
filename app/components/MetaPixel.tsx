'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    fbq: any
    _fbq: any
  }
}

export default function MetaPixel() {
  const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '806502898408304'

  // Don't load pixel in development
  if (process.env.NODE_ENV === 'development') {
    return null
  }

  useEffect(() => {
    // Initialize Meta Pixel using external script
    if (typeof window !== 'undefined' && !window.fbq) {
      // Create stub function
      const fbq: any = function () {
        fbq.callMethod
          ? fbq.callMethod.apply(fbq, arguments)
          : fbq.queue.push(arguments)
      }
      window.fbq = fbq
      window._fbq = fbq
      fbq.push = fbq
      fbq.loaded = true
      fbq.version = '2.0'
      fbq.queue = []

      // Load external script
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://connect.facebook.net/en_US/fbevents.js'
      const firstScript = document.getElementsByTagName('script')[0]
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript)
      }

      // Initialize pixel
      window.fbq('init', PIXEL_ID)
    }

    // Track initial PageView
    if (window.fbq) {
      window.fbq('track', 'PageView')

      // Track ViewContent with product details
      window.fbq('track', 'ViewContent', {
        content_name: '7 Minute AgentClone Course',
        content_category: 'AI Video Course',
        content_type: 'product',
        value: 37.0,
        currency: 'USD',
      })
    }
  }, [PIXEL_ID])

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
      />
    </noscript>
  )
}
