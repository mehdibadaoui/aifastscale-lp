'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Meta Pixel loads IMMEDIATELY for ad tracking (critical for Facebook ads!)
const MetaPixel = dynamic(() => import('./MetaPixel'), { ssr: false })

// Other pixels load with delay for performance
const GoogleAnalytics = dynamic(() => import('./GoogleAnalytics'), { ssr: false })
const MicrosoftClarity = dynamic(() => import('./MicrosoftClarity'), { ssr: false })

export default function LazyTrackingPixels() {
  const [shouldLoadOthers, setShouldLoadOthers] = useState(false)

  useEffect(() => {
    // Load non-critical pixels after 5 seconds
    const timer = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => setShouldLoadOthers(true))
      } else {
        setShouldLoadOthers(true)
      }
    }, 5000) // 5 seconds for non-critical pixels

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Meta Pixel loads IMMEDIATELY - critical for ad tracking */}
      <MetaPixel />

      {/* Other pixels load after delay */}
      {shouldLoadOthers && (
        <>
          <GoogleAnalytics />
          <MicrosoftClarity />
        </>
      )}
    </>
  )
}
