import type { Metadata } from 'next'
import MetaPixelLoader from './MetaPixelLoader'

export const metadata: Metadata = {
  title: 'CloneYourself for Dermatologists | AI Video Marketing System | $47',
  description:
    'Dermatologists: Turn your photo into AI talking videos in 7 minutes. Attract more cosmetic dermatology patients. No filming needed. Created by Dr. Alexander Voss.',
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
      {/* DNS Prefetch & Preconnect for faster resource loading */}
      <link rel="dns-prefetch" href="https://connect.facebook.net" />
      <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />

      {/* Preload hero image for faster LCP - CRITICAL */}
      <link
        rel="preload"
        href="/images/dentist/dentist-vdc-hero.webp"
        as="image"
        type="image/webp"
        fetchPriority="high"
      />

      {/* Critical CSS for above-the-fold hero - prevents layout shift */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Critical hero styles - inlined for instant render */
        .bg-gradient-hero{background:linear-gradient(135deg,#000 0%,#0a1628 50%,#000 100%)}
        .text-gradient-premium{background:linear-gradient(135deg,#2dd4bf,#22d3ee,#2dd4bf);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .glass-premium{background:rgba(20,184,166,.08);border:1px solid rgba(20,184,166,.2);backdrop-filter:blur(8px)}
        .glass-teal{background:rgba(20,184,166,.1);border:1px solid rgba(20,184,166,.25)}
        .btn-premium{background:linear-gradient(135deg,#14b8a6,#06b6d4,#14b8a6);background-size:200% 200%}
        .shadow-glow-teal{box-shadow:0 0 30px rgba(20,184,166,.4),0 0 60px rgba(20,184,166,.2)}
        .badge-premium{background:rgba(20,184,166,.1);border:1px solid rgba(20,184,166,.3);padding:.5rem 1rem;border-radius:9999px}
        .section-premium{min-height:auto}
        /* Prevent CLS - reserve space for hero image */
        .hero-image-container{aspect-ratio:1365/768;width:100%;max-width:1024px;margin:0 auto}
        /* Initial animation state */
        .animate-fade-in-up{opacity:0;transform:translateY(30px)}
        [data-animate]{opacity:1}
      `}} />

      {/* Meta Pixel - Loads after browser idle */}
      <MetaPixelLoader />

      {children}
    </>
  )
}
