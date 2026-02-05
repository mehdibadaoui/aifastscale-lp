import type { Metadata } from 'next'
// import MetaPixelLoader from './MetaPixelLoader'

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

      {/* Meta Pixel - Loads only after cookie consent */}
      {/* <MetaPixelLoader /> */}

      {children}
    </>
  )
}
