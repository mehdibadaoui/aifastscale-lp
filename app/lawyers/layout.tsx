import type { Metadata } from 'next'
// import MetaPixelLoader from './MetaPixelLoader'

export const metadata: Metadata = {
  title: 'CloneYourself for Lawyers | AI Video Marketing System | $47',
  description:
    'Attorneys & Law Firms: Turn your photo into AI talking videos in 7 minutes. Attract high-value clients. No filming needed. Created by Alex Morgan, Esq., 18+ years trial experience.',
  keywords:
    'lawyer marketing, attorney AI videos, law firm marketing, client acquisition, legal practice growth, AI video marketing, personal injury marketing, family law marketing',
  openGraph: {
    title: 'CloneYourself for Lawyers | AI Video Marketing System',
    description:
      'Turn your photo into AI talking videos in 7 minutes. Attract high-value clients without filming yourself.',
    url: 'https://aifastscale.com/lawyers',
    siteName: 'CloneYourself for Lawyers',
    images: [
      {
        url: '/images/lawyer/hero.webp',
        width: 1200,
        height: 630,
        alt: 'CloneYourself for Lawyers - AI Video Marketing',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function LawyerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Preconnect to Facebook for Meta Pixel */}
      <link rel="preconnect" href="https://connect.facebook.net" />

      {/* Preload hero images - Mobile and Desktop separately for optimal LCP */}
      <link
        rel="preload"
        href="/images/lawyer/attorney-hero-mobile.webp"
        as="image"
        type="image/webp"
        fetchPriority="high"
        media="(max-width: 639px)"
      />
      <link
        rel="preload"
        href="/images/lawyer/attorney-hero.webp"
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
