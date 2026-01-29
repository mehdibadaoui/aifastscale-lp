'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { getCookieConsent, hasMarketingConsent } from './CookieConsent'

// Real Estate Meta Pixels - Only loads on non-product pages AND with consent
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
      fbq('init', '806502898408304');
      fbq('init', '1897880187469286');
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
    if (!shouldLoad || !hasConsent) return

    // Load Meta Pixel after 2 seconds (performance optimization)
    const timeout = setTimeout(() => {
      loadMetaPixel()
    }, 2000)

    return () => clearTimeout(timeout)
  }, [shouldLoad, hasConsent, loadMetaPixel])

  // No visual output - just handles script loading
  return null
}
