'use client'

import MetaPixel from './MetaPixel'
import TikTokPixel from './TikTokPixel'

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
