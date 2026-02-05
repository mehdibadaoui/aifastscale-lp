import type { Metadata } from 'next'
// import MetaPixelLoader from './MetaPixelLoader'
import CookieConsent from '../components/CookieConsent'

export const metadata: Metadata = {
  title: 'CloneYourself for Plastic Surgeons | AI Video Marketing System | $47',
  description:
    'Plastic Surgeons: Turn your photo into AI talking videos in 7 minutes. Attract more cosmetic patients. No filming needed. Created by Dr. Sofia Martinez, MD, FACS.',
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
      {/* Preload hero images - Mobile and Desktop separately for optimal LCP */}
      <link
        rel="preload"
        href="/images/plastic-surgeon/surgeon-hero-mobile.webp"
        as="image"
        type="image/webp"
        fetchPriority="high"
        media="(max-width: 639px)"
      />
      <link
        rel="preload"
        href="/images/plastic-surgeon/surgeon-hero.webp"
        as="image"
        type="image/webp"
        fetchPriority="high"
        media="(min-width: 640px)"
      />

      {/* Meta Pixel - Loads only after cookie consent */}
      {/* <MetaPixelLoader /> */}

      {/* Cookie Consent Banner */}
      <CookieConsent />

      {children}
    </>
  )
}
