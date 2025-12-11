import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'CloneYourself for Dentists | AI Video Marketing System | $37',
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
      {/* DENTIST-SPECIFIC META PIXEL - Separate from real estate pixel */}
      {/* Pixel ID: 834713712860127 */}
      <Script
        id="dentist-meta-pixel"
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
            fbq('init', '834713712860127');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
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
