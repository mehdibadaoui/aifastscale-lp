import type { Metadata } from 'next'

// Dentist Pixel ID - Add your pixel ID here
const DENTIST_PIXEL_ID = '' // TODO: Add your Dentist Meta Pixel ID

export const metadata: Metadata = {
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

      {/* Meta Pixel for Dentist LP - Add your pixel script here when ready */}
      {/*
      When you have your new pixel ID, uncomment and update this section:

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
            fbq('init', 'YOUR_PIXEL_ID_HERE');
            fbq('track', 'PageView');
          `,
        }}
      />
      */}

      {children}
    </>
  )
}
