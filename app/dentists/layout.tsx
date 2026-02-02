import type { Metadata } from 'next'
import MetaPixelLoader from './MetaPixelLoader'

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

      {/* Meta Pixel - Loads only after cookie consent */}
      <MetaPixelLoader />

      {children}
    </>
  )
}
