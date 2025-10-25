'use client';

import Script from 'next/script';
import { useEffect } from 'react';

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

export default function MetaPixel() {
  const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '806502898408304';

  // Don't load pixel in development
  if (process.env.NODE_ENV === 'development') {
    return null;
  }

  useEffect(() => {
    // Track initial PageView
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');

      // Track ViewContent with product details
      window.fbq('track', 'ViewContent', {
        content_name: '7 Minute AgentClone Course',
        content_category: 'AI Video Course',
        content_type: 'product',
        value: 37.00,
        currency: 'USD'
      });
    }
  }, []);

  return (
    <>
      <Script
        id="facebook-pixel"
        strategy="lazyOnload"
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

            fbq('init', '${PIXEL_ID}');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
