'use client'

import Script from 'next/script'

declare global {
  interface Window {
    fbq: any
    _fbq: any
  }
}

export default function MetaPixel() {
  const PIXEL_ID = '806502898408304' // Hardcoded for reliability

  return (
    <>
      {/* Meta Pixel - CRITICAL: Load with beforeInteractive for immediate firing */}
      <Script
        id="meta-pixel-base"
        strategy="beforeInteractive"
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
            fbq('track', 'PageView');
            fbq('track', 'ViewContent', {
              content_name: '7 Minute AgentClone Course',
              content_category: 'AI Video Course',
              content_type: 'product',
              value: 37.0,
              currency: 'USD'
            });
          `
        }}
      />

      <noscript dangerouslySetInnerHTML={{
        __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1" />`
      }} />
    </>
  )
}
