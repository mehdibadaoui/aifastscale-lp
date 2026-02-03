'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

const META_PIXEL_ID = '778800911911121'

export default function MetaPixelLoader() {
  const [loaded, setLoaded] = useState(false)

  // Don't load twice
  if (loaded) return null

  return (
    <Script
      id="meta-pixel-psychologist"
      strategy="afterInteractive"
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
