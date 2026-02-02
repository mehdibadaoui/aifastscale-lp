'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { getCookieConsent } from '../components/CookieConsent'

const META_PIXEL_ID = '1526841625273321'
const LOAD_DELAY_MS = 3000 // Defer loading by 3 seconds for better performance

export default function MetaPixelLoader() {
  const [hasConsent, setHasConsent] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)

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

  // Defer pixel loading by 3 seconds after consent
  useEffect(() => {
    if (hasConsent && !loaded) {
      const timer = setTimeout(() => {
        setShouldLoad(true)
      }, LOAD_DELAY_MS)
      return () => clearTimeout(timer)
    }
  }, [hasConsent, loaded])

  // Don't load if no consent, already loaded, or not ready
  if (!hasConsent || loaded || !shouldLoad) return null

  return (
    <Script
      id="meta-pixel"
      strategy="lazyOnload"
      onLoad={() => setLoaded(true)}
      dangerouslySetInnerHTML={{
        __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `,
      }}
    />
  )
}
