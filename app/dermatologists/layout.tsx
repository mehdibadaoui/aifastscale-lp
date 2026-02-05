import type { Metadata } from 'next'

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
      {/* Preload hero image for faster LCP - CRITICAL - must be first */}
      <link
        rel="preload"
        href="/images/dentist/dentist-vdc-hero.webp"
        as="image"
        type="image/webp"
        fetchPriority="high"
      />

      {/* Critical CSS - MOBILE FIRST - All content visible immediately */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Base styles */
        .bg-gradient-hero{background:linear-gradient(135deg,#000 0%,#0a1628 50%,#000 100%)}
        .text-gradient-premium{background:linear-gradient(135deg,#2dd4bf,#22d3ee,#2dd4bf);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .btn-premium{background:linear-gradient(135deg,#14b8a6,#06b6d4,#14b8a6)}
        .shadow-glow-teal{box-shadow:0 0 20px rgba(20,184,166,.3)}
        .badge-premium{background:rgba(20,184,166,.15);border:1px solid rgba(20,184,166,.3);padding:.5rem 1rem;border-radius:9999px}
        .hero-image-container{aspect-ratio:1365/768;width:100%;max-width:1024px;margin:0 auto}

        /* CRITICAL: All content visible by default - NO hidden content */
        .animate-fade-in-up,.animate-scale-in,.animate-scale-up,[data-animate]{opacity:1!important;transform:none!important}

        /* Mobile: No blur effects (performance) */
        @media(max-width:767px){
          .glass-premium,.glass-teal{background:rgba(20,184,166,.15)!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
          .backdrop-blur-sm,.backdrop-blur-md,.backdrop-blur-lg,.backdrop-blur-xl{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
        }
        @media(min-width:768px){
          .glass-premium{background:rgba(20,184,166,.08);border:1px solid rgba(20,184,166,.2);backdrop-filter:blur(8px)}
          .glass-teal{background:rgba(20,184,166,.1);border:1px solid rgba(20,184,166,.25);backdrop-filter:blur(4px)}
        }
      `}} />

      {children}

      {/* Meta Pixel */}
      <script
        defer
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','1435824824556725');fbq('track','PageView');
          `,
        }}
      />
    </>
  )
}
