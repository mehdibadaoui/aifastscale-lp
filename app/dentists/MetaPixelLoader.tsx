'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { getCookieConsent } from '../components/CookieConsent'

const META_PIXEL_ID = '1176362697938270'

export default function MetaPixelLoader() {
  // Check cookie consent before loading
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    const consent = getCookieConsent()
    if (consent?.marketing === true) {
      setHasConsent(true)
    }

    // Listen for consent updates
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail?.marketing === true) setHasConsent(true)
    }
    window.addEventListener('cookieConsentUpdated', handler)
    return () => window.removeEventListener('cookieConsentUpdated', handler)
  }, [])

  if (!hasConsent) return null

  const [loaded, setLoaded] = useState(false)

  // Don't load twice
  if (loaded) return null

  return (
    <Script
      id="meta-pixel-dentist"
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
