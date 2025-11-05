'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Lazy load all tracking pixels with 5-second delay (was 3s)
const GoogleAnalytics = dynamic(() => import('./GoogleAnalytics'), { ssr: false })
// GoogleAdsTag is now merged into GoogleAnalytics (both use same gtag.js)
const MetaPixel = dynamic(() => import('./MetaPixel'), { ssr: false })
// TikTok Pixel temporarily disabled for performance optimization
// const TikTokPixel = dynamic(() => import('./TikTokPixel'), { ssr: false })
// Microsoft Clarity temporarily disabled for performance optimization
// const MicrosoftClarity = dynamic(() => import('./MicrosoftClarity'), { ssr: false })

export default function LazyTrackingPixels() {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Wait 5 seconds after page is interactive before loading tracking pixels
    // This ensures better FCP, LCP, and overall PageSpeed score
    const timer = setTimeout(() => {
      setShouldLoad(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  if (!shouldLoad) return null

  return (
    <>
      <GoogleAnalytics />
      <MetaPixel />
      {/* TikTok Pixel temporarily disabled for performance */}
      {/* <TikTokPixel /> */}
      {/* Microsoft Clarity temporarily disabled for performance */}
      {/* <MicrosoftClarity /> */}
    </>
  )
}
