'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

// Dynamic imports with SSR disabled to prevent BAILOUT_TO_CLIENT_SIDE_RENDERING
// This prevents useSearchParams in TikTokPixel from blocking SSR
const MetaPixel = dynamic(() => import('./MetaPixel'), { ssr: false })
const TikTokPixel = dynamic(() => import('./TikTokPixel'), { ssr: false })

export default function LazyTrackingPixels() {
  const pathname = usePathname()

  // Don't load real estate pixels on product pages (they have their own pixels)
  const isProductPage = pathname?.startsWith('/dentists') ||
    pathname?.startsWith('/psychologists') ||
    pathname?.startsWith('/lawyers') ||
    pathname?.startsWith('/plastic-surgeons')

  if (isProductPage) {
    return null
  }

  return (
    <>
      {/* Meta Pixel - Primary tracking solution (Real Estate only) */}
      <MetaPixel />
      {/* TikTok Pixel - For TikTok Ads */}
      <TikTokPixel />
    </>
  )
}
