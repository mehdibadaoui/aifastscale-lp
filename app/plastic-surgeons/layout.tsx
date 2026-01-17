import type { Metadata } from 'next'
import Script from 'next/script'

// Plastic Surgeon Pixel ID
const PLASTIC_SURGEON_PIXEL_ID = '1526841625273321'

export const metadata: Metadata = {
  title: 'CloneYourself for Plastic Surgeons | AI Video Marketing System | $97',
  description:
    'Plastic Surgeons: Turn your photo into AI talking videos in 7 minutes. Attract more cosmetic patients. No filming needed. Created by Dr. Alexander Voss.',
  keywords:
    'plastic surgeon marketing, cosmetic surgery AI videos, aesthetic practice marketing, patient acquisition, plastic surgery practice growth, AI video marketing',
  openGraph: {
    title: 'CloneYourself for Plastic Surgeons | AI Video Marketing System',
    description:
      'Turn your photo into AI talking videos in 7 minutes. Attract high-value cosmetic surgery patients without filming yourself.',
    url: 'https://aifastscale.com/plastic-surgeons',
    siteName: 'CloneYourself for Plastic Surgeons',
    images: [
      {
        url: '/images/plastic-surgeon/hero.webp',
        width: 1200,
        height: 630,
        alt: 'CloneYourself for Plastic Surgeons - AI Video Marketing',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function PlasticSurgeonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Preload hero image for faster LCP */}
      <link
        rel="preload"
        href="/images/plastic-surgeon/hero.webp"
        as="image"
        type="image/webp"
        fetchPriority="high"
      />

      {/* Meta Pixel for Plastic Surgeon LP */}
      <Script
        id="plastic-surgeon-meta-pixel"
        strategy="afterInteractive"
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
            fbq('init', '${PLASTIC_SURGEON_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PLASTIC_SURGEON_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>

      {children}
    </>
  )
}
