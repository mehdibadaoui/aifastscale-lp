import type { Metadata } from 'next'
import Script from 'next/script'

// Preconnect to external domains for faster loading
export const metadata: Metadata = {
  other: {
    'dns-prefetch': '//connect.facebook.net',
  },
  title: 'CloneYourself for Dentists | AI Video Marketing System | $47',
  description:
    'Dentists: Turn your photo into AI talking videos in 7 minutes. Attract more cosmetic patients. No filming needed. Created by Dr. Alexander Voss.',
  keywords:
    'dentist marketing, dental AI videos, cosmetic dentist marketing, patient acquisition, dental practice growth, AI video marketing',
  openGraph: {
    title: 'CloneYourself for Dentists | AI Video Marketing System',
    description:
      'Turn your photo into AI talking videos in 7 minutes. Attract high-value cosmetic patients without filming yourself.',
    url: 'https://aifastscale.com/dentists',
    siteName: 'CloneYourself for Dentists',
    images: [
      {
        url: '/images/dentist/dr-voss.webp',
        width: 1200,
        height: 630,
        alt: 'CloneYourself for Dentists - AI Video Marketing',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function DentistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Preload hero image for faster LCP */}
      <link
        rel="preload"
        href="/images/dentist/dentist-vdc-hero.webp"
        as="image"
        type="image/webp"
        fetchPriority="high"
      />

      {/* Preconnect to critical third-party origins */}
      <link rel="preconnect" href="https://connect.facebook.net" />
      <link rel="dns-prefetch" href="https://connect.facebook.net" />

      {/* DENTIST META PIXELS - Deferred to not block rendering */}
      {/* Pixel 1: 1176362697938270 (Ad Account 1) */}
      {/* Pixel 2: 834713712860127 (Ad Account 2) */}
      <Script
        id="dentist-meta-pixels"
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

            // Initialize BOTH dentist pixels
            fbq('init', '1176362697938270');
            fbq('init', '834713712860127');

            // Track PageView on both
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=1176362697938270&ev=PageView&noscript=1"
          alt=""
        />
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=834713712860127&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>

      {children}
    </>
  )
}
