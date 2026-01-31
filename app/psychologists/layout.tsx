import type { Metadata } from 'next'

// Psychologist Pixel ID - Add your pixel ID here
const PSYCHOLOGIST_PIXEL_ID = '' // TODO: Add your Psychologist Meta Pixel ID

export const metadata: Metadata = {
  title: 'CloneYourself for Psychologists | AI Video Marketing System | $47',
  description:
    'Psychologists & Therapists: Turn your photo into AI talking videos in 7 minutes. Attract more clients. No filming needed. Created by Dr. Marcus Rivers, PhD, Licensed Clinical Psychologist.',
  keywords:
    'psychologist marketing, therapist AI videos, mental health practice marketing, client acquisition, therapy practice growth, AI video marketing',
  openGraph: {
    title: 'CloneYourself for Psychologists | AI Video Marketing System',
    description:
      'Turn your photo into AI talking videos in 7 minutes. Attract more therapy clients without filming yourself.',
    url: 'https://aifastscale.com/psychologists',
    siteName: 'CloneYourself for Psychologists',
    images: [
      {
        url: '/images/psychologist/hero.webp',
        width: 1200,
        height: 630,
        alt: 'CloneYourself for Psychologists - AI Video Marketing',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function PsychologistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Preload hero images - Mobile and Desktop separately for optimal LCP */}
      <link
        rel="preload"
        href="/images/psychologist/therapist-hero-mobile.webp"
        as="image"
        type="image/webp"
        fetchPriority="high"
        media="(max-width: 639px)"
      />
      <link
        rel="preload"
        href="/images/psychologist/therapist-hero.webp"
        as="image"
        type="image/webp"
        fetchPriority="high"
        media="(min-width: 640px)"
      />

      {/* Meta Pixel for Psychologist LP - Add your pixel script here when ready */}
      {/*
      When you have your new pixel ID, uncomment and update this section:

      <Script
        id="psychologist-meta-pixel"
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
