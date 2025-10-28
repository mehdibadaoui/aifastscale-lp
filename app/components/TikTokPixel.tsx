'use client';

import Script from 'next/script';
import { useEffect } from 'react';

declare global {
  interface Window {
    ttq: any;
  }
}

export default function TikTokPixel() {
  const PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || 'D3LRUDJC77U1N95DTTAG';

  // Don't load pixel in development
  if (process.env.NODE_ENV === 'development') {
    return null;
  }

  useEffect(() => {
    // Track initial PageView
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.track('Browse');

      // Track ViewContent with product details
      window.ttq.track('ViewContent', {
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
        id="tiktok-pixel"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=i+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

              ttq.load('${PIXEL_ID}');
              ttq.page();
            }(window, document, 'ttq');
          `,
        }}
      />
    </>
  );
}
