import type { Metadata } from 'next'
import MetaPixelLoader from './MetaPixelLoader'

export const metadata: Metadata = {
  title: 'CloneYourself for Dermatologists | AI Video Marketing System | $47',
  description:
    'Dermatologists: Turn your photo into AI talking videos in 7 minutes. Attract more cosmetic dermatology patients. No filming needed. Created by Dr. Priya Kapoor.',
  keywords:
    'dermatologist marketing, dermatology AI videos, cosmetic dermatologist marketing, patient acquisition, dermatology practice growth, AI video marketing, skincare marketing',
  openGraph: {
    title: 'CloneYourself for Dermatologists | AI Video Marketing System',
    description:
      'Turn your photo into AI talking videos in 7 minutes. Attract high-value cosmetic dermatology patients without filming yourself.',
    url: 'https://aifastscale.com/dermatologists',
    siteName: 'CloneYourself for Dermatologists',
    images: [
      {
        url: '/images/dentist/dr-voss.webp',
        width: 1200,
        height: 630,
        alt: 'CloneYourself for Dermatologists - AI Video Marketing',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function DermatologistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Preconnect to Facebook for Meta Pixel */}
      <link rel="preconnect" href="https://connect.facebook.net" />

      {/* Preload hero image for faster LCP */}
      <link
        rel="preload"
        href="/images/dentist/dentist-vdc-hero.webp"
        as="image"
        type="image/webp"
        fetchPriority="high"
      />

      {/* Meta Pixel - Loads after browser idle */}
      <MetaPixelLoader />

      {children}
    </>
  )
}
