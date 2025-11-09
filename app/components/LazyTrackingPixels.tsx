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
    // Wait for window load + 10 seconds for maximum PageSpeed score
    // This ensures tracking doesn't impact Core Web Vitals at all
    const loadTracking = () => {
      const timer = setTimeout(() => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => setShouldLoad(true))
        } else {
          setShouldLoad(true)
        }
      }, 10000) // 10 seconds after page load

      return () => clearTimeout(timer)
    }

    // Wait for window to fully load first
    if (document.readyState === 'complete') {
      return loadTracking()
    } else {
      window.addEventListener('load', loadTracking)
      return () => window.removeEventListener('load', loadTracking)
    }
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
