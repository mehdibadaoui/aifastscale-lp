'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { getCookieConsent } from './CookieConsent'

// Meta Pixel IDs - Add your pixel IDs here
const PIXEL_ID_1 = '' // TODO: Add your first Meta Pixel ID
const PIXEL_ID_2 = '' // TODO: Add your second Meta Pixel ID (optional)

// Loads Meta Pixels on non-product pages with consent
export default function RootLayoutPixels() {
  const pathname = usePathname()
  const [shouldLoad, setShouldLoad] = useState(false)
  const [hasConsent, setHasConsent] = useState(false)

  // Check if this is a product-specific page
  const isProductPage = pathname?.startsWith('/dentists') ||
    pathname?.startsWith('/psychologists') ||
    pathname?.startsWith('/lawyers') ||
    pathname?.startsWith('/plastic-surgeons')

  // Function to load Meta Pixel
  const loadMetaPixel = useCallback(() => {
    if (typeof window === 'undefined') return
    if ((window as any).fbq) return // Already loaded
    if (!PIXEL_ID_1) return // No pixel ID configured

    const pixelInits = PIXEL_ID_2
      ? `fbq('init', '${PIXEL_ID_1}'); fbq('init', '${PIXEL_ID_2}');`
      : `fbq('init', '${PIXEL_ID_1}');`

    const script = document.createElement('script')
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      ${pixelInits}
      fbq('track', 'PageView');
    `
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    // Don't load on product pages (they have their own pixels)
    if (isProductPage) {
      setShouldLoad(false)
      return
    }
    setShouldLoad(true)
  }, [pathname, isProductPage])

  useEffect(() => {
    // Check initial consent
    const consent = getCookieConsent()
    if (consent?.marketing) {
      setHasConsent(true)
    }

    // Listen for consent updates
    const handleConsentUpdate = (event: CustomEvent) => {
      if (event.detail?.marketing) {
        setHasConsent(true)
      }
    }

    window.addEventListener('cookieConsentUpdated', handleConsentUpdate as EventListener)
    return () => {
      window.removeEventListener('cookieConsentUpdated', handleConsentUpdate as EventListener)
    }
  }, [])

  useEffect(() => {
    // Only load pixel if:
    // 1. Should load (not a product page)
    // 2. Has marketing consent
    // 3. Pixel ID is configured
    if (!shouldLoad || !hasConsent || !PIXEL_ID_1) return

    // Load Meta Pixel after 2 seconds (performance optimization)
    const timeout = setTimeout(() => {
      loadMetaPixel()
    }, 2000)

    return () => clearTimeout(timeout)
  }, [shouldLoad, hasConsent, loadMetaPixel])

  // No visual output - just handles script loading
  return null
}
