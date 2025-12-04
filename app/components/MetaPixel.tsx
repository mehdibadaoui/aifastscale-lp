'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

declare global {
  interface Window {
    fbq?: (...args: any[]) => void
    _fbq?: any
  }
}

// Meta Pixel ID - hardcoded for reliability
const PIXEL_ID = '806502898408304'

export default function MetaPixel() {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // PERFORMANCE: Defer Facebook pixel loading to improve TBT
    // Load after 3 seconds OR when browser is idle
    const loadPixel = () => setShouldLoad(true)

    // Use requestIdleCallback if available (better for performance)
    if (typeof window !== 'undefined') {
      const ric = (window as any).requestIdleCallback
      if (ric) {
        ric(() => {
          setTimeout(loadPixel, 2000) // Additional 2s delay after idle
        })
      } else {
        // Fallback: load after 4 seconds
        setTimeout(loadPixel, 4000)
      }
    }
  }, [])

  if (!shouldLoad) {
    return (
      // Noscript fallback for users with JS disabled
      <noscript dangerouslySetInnerHTML={{
        __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1" />`
      }} />
    )
  }

  return (
    <>
      {/* Meta Pixel Base Code - loads after idle + delay for maximum performance */}
      <Script
        id="meta-pixel-base"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
            fbq('track', 'ViewContent', {
              content_name: '7 Minute AgentClone Course',
              content_category: 'AI Video Course',
              content_type: 'product',
              value: 37.0,
              currency: 'USD'
            });
          `
        }}
      />

      {/* Noscript fallback for users with JS disabled */}
      <noscript dangerouslySetInnerHTML={{
        __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1" />`
      }} />
    </>
  )
}

// Helper function to track custom events (can be imported and used anywhere)
export function trackMetaEvent(
  eventName: string,
  params?: Record<string, any>
) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params)
  }
}

// Helper function to track custom conversions
export function trackMetaCustomEvent(
  eventName: string,
  params?: Record<string, any>
) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, params)
  }
}
