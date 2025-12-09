'use client'

import dynamic from 'next/dynamic'

// Dynamic imports with SSR disabled to prevent BAILOUT_TO_CLIENT_SIDE_RENDERING
// This prevents useSearchParams in TikTokPixel from blocking SSR
const MetaPixel = dynamic(() => import('./MetaPixel'), { ssr: false })
const TikTokPixel = dynamic(() => import('./TikTokPixel'), { ssr: false })

export default function LazyTrackingPixels() {
  return (
    <>
      {/* Meta Pixel - Primary tracking solution */}
      <MetaPixel />
      {/* TikTok Pixel - For TikTok Ads */}
      <TikTokPixel />
    </>
  )
}
