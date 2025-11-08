'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Lazy load all tracking pixels with 5-second delay (was 3s)
const GoogleAnalytics = dynamic(() => import('./GoogleAnalytics'), { ssr: false })
// GoogleAdsTag is now merged into GoogleAnalytics (both use same gtag.js)
const MetaPixel = dynamic(() => import('./MetaPixel'), { ssr: false })
const MicrosoftClarity = dynamic(() => import('./MicrosoftClarity'), { ssr: false })
// TikTok Pixel temporarily disabled for performance optimization
// const TikTokPixel = dynamic(() => import('./TikTokPixel'), { ssr: false })

export default function LazyTrackingPixels() {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Wait 5 seconds + idle callback for maximum PageSpeed score
    // Prioritize performance over instant tracking
    const timer = setTimeout(() => {
      // Use requestIdleCallback if available, otherwise just load
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => setShouldLoad(true))
      } else {
        setShouldLoad(true)
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  if (!shouldLoad) return null

  return (
    <>
      <GoogleAnalytics />
      <MetaPixel />
      <MicrosoftClarity />
      {/* TikTok Pixel temporarily disabled for performance */}
      {/* <TikTokPixel /> */}
    </>
  )
}
