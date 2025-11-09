'use client'

import Script from 'next/script'

export default function GoogleAnalytics() {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const GOOGLE_ADS_ID = 'AW-17695777512'

  // Don't load GA in development
  if (process.env.NODE_ENV === 'development') {
    return null
  }

  return (
    <>
      {/* Load gtag.js - Already delayed by 5s in LazyTrackingPixels */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          // Configure Google Analytics 4
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            send_page_view: true
          });

          // Configure Google Ads (same gtag instance!)
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
    </>
  )
}
