'use client'

import { useEffect, useState, useCallback } from 'react'
import { getCookieConsent } from './CookieConsent'

declare global {
  interface Window {
    fbq?: (...args: any[]) => void
    _fbq?: any
  }
}

// Meta Pixel ID - hardcoded for reliability
const PIXEL_ID = '806502898408304'

export default function MetaPixel() {
  const [hasConsent, setHasConsent] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Function to load Meta Pixel
  const loadMetaPixel = useCallback(() => {
    if (typeof window === 'undefined') return
    if (window.fbq) return // Already loaded
    if (isLoaded) return

    // Create and inject the Meta Pixel script
    const script = document.createElement('script')
    script.id = 'meta-pixel-base'
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${PIXEL_ID}');
      fbq('track', 'PageView');
      fbq('track', 'ViewContent', {
        content_name: 'CloneYourself Video System',
        content_category: 'AI Video Course',
        content_type: 'product',
        value: 47.82,
        currency: 'USD'
      });
    `
    document.head.appendChild(script)
    setIsLoaded(true)
  }, [isLoaded])

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
    // Only load pixel with consent
    if (!hasConsent) return
    loadMetaPixel()
  }, [hasConsent, loadMetaPixel])

  // Noscript fallback only shown if consent given (for SEO crawlers with consent)
  if (!hasConsent) return null

  return (
    <noscript dangerouslySetInnerHTML={{
      __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1" />`
    }} />
  )
}

// Helper function to track custom events (can be imported and used anywhere)
export function trackMetaEvent(
  eventName: string,
  params?: Record<string, any>
) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params)
  }
}

// Helper function to track custom conversions
export function trackMetaCustomEvent(
  eventName: string,
  params?: Record<string, any>
) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, params)
  }
}
