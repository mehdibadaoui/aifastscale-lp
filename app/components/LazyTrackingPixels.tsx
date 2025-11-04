'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Lazy load all tracking pixels with 3-second delay
const GoogleAnalytics = dynamic(() => import('./GoogleAnalytics'), { ssr: false })
const GoogleAdsTag = dynamic(() => import('./GoogleAdsTag'), { ssr: false })
const MetaPixel = dynamic(() => import('./MetaPixel'), { ssr: false })
const TikTokPixel = dynamic(() => import('./TikTokPixel'), { ssr: false })
const MicrosoftClarity = dynamic(() => import('./MicrosoftClarity'), { ssr: false })

export default function LazyTrackingPixels() {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Wait 3 seconds after page is interactive before loading tracking pixels
    const timer = setTimeout(() => {
      setShouldLoad(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!shouldLoad) return null

  return (
    <>
      <GoogleAnalytics />
      <GoogleAdsTag />
      <MetaPixel />
      <TikTokPixel />
      <MicrosoftClarity />
    </>
  )
}
