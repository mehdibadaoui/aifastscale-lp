import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import LazyTrackingPixels from './components/LazyTrackingPixels'
import RootLayoutPixels from './components/RootLayoutPixels'
import { SITE_CONFIG } from './config/constants'

// Premium font: Inter for body text - only essential weights for performance
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '600', '700'], // Reduced from 4 to 3 weights
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
})

// Premium font: Plus Jakarta Sans for headings - only bold weights
const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
  weight: ['700', '800'], // Reduced from 3 to 2 weights
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
})

export const metadata: Metadata = {
  title: '7-Min AI Videos | 100+ Real Estate Leads UAE | $37',
  description:
    'UAE & Dubai real estate agents: Turn photos into AI talking videos in 7 min. Generate 15 leads/week. No camera needed. $37 course.',
  keywords:
    'AI video, real estate marketing, talking AI videos, lead generation, real estate agents, AI agent clone, video marketing, property listing videos',
  authors: [{ name: 'AI FastScale' }],
  creator: 'AI FastScale',
  publisher: 'AI FastScale',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title:
      'AI FastScale – 7-Minute AgentClone™ | Turn Photos Into Talking AI Videos',
    description:
      'Turn a photo into a realistic talking AI video in 7 minutes. Get 5-15 leads this week, 100+ real buyer leads monthly. Built for real estate agents.',
    url: SITE_CONFIG.url,
    siteName: 'AI FastScale',
    images: [
      {
        url: '/images/P1_result.webp',
        width: 1200,
        height: 630,
        alt: 'AI FastScale - 7 Minute AgentClone Course',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI FastScale – 7-Minute AgentClone™',
    description:
      'Turn a photo into a realistic talking AI video in 7 minutes. Get 5-15 leads this week. Built for real estate agents.',
    images: ['/images/P1_result.webp'],
    creator: '@aifastscale',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // verification: {
  //   google: 'your-google-verification-code',
  // },
}

// Next.js 14+ viewport configuration (separate from metadata)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover', // Support iPhone X+ notch
  themeColor: '#0a1128',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* META PIXELS: Now loaded via RootLayoutPixels client component */}
        {/* This allows path-aware loading (not on /dentists pages) */}

        {/* Google Analytics 4 (GA4) - Deferred loading */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function() {
                setTimeout(function() {
                  var s = document.createElement('script');
                  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-Q7JM9NRV7Z';
                  s.async = true;
                  document.head.appendChild(s);
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  window.gtag = gtag;
                  gtag('js', new Date());
                  gtag('config', 'G-Q7JM9NRV7Z');
                }, 2500);
              });
            `,
          }}
        />

        {/* CRITICAL: Inline critical CSS for instant hero rendering - prevents render blocking */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Critical above-fold styles - inlined for instant paint */
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          html{-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
          body{font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fafafa}
          .min-h-screen{min-height:100vh}.bg-\\[\\#fafafa\\]{background:#fafafa}
          .text-slate-900{color:#0f172a}.text-violet-600{color:#7c3aed}
          .font-black{font-weight:900}.font-bold{font-weight:700}.text-center{text-align:center}
          .flex{display:flex}.items-center{align-items:center}.justify-center{justify-content:center}
          .rounded-full{border-radius:9999px}.rounded-xl{border-radius:0.75rem}
          .relative{position:relative}.absolute{position:absolute}.fixed{position:fixed}
          .inset-0{inset:0}.z-10{z-index:10}.z-40{z-index:40}.z-50{z-index:50}
          .overflow-hidden{overflow:hidden}.border-b{border-bottom-width:1px}
          .bg-white{background:#fff}.bg-white\\/80{background:rgba(255,255,255,0.8)}
          .backdrop-blur-xl{backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px)}
          .max-w-4xl{max-width:56rem}.mx-auto{margin-left:auto;margin-right:auto}
          .px-3{padding-left:0.75rem;padding-right:0.75rem}.py-6{padding-top:1.5rem;padding-bottom:1.5rem}
          .mb-6{margin-bottom:1.5rem}.gap-2{gap:0.5rem}
          .text-2xl{font-size:1.5rem;line-height:2rem}.text-sm{font-size:0.875rem}
          .bg-gradient-to-r{background-image:linear-gradient(to right,var(--tw-gradient-stops))}
          .from-violet-600{--tw-gradient-from:#7c3aed;--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}
          .to-indigo-600{--tw-gradient-to:#4f46e5}.bg-clip-text{background-clip:text;-webkit-background-clip:text}
          .text-transparent{color:transparent}
        `}} />

        {/* CRITICAL: Preconnect to fonts FIRST for fastest font loading */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        {/* DNS prefetch for tracking (loaded later, so just prefetch) */}
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://analytics.tiktok.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Hreflang Tags for International SEO */}
        <link rel="alternate" hrefLang="en" href="https://aifastscale.com" />
        <link rel="alternate" hrefLang="ar" href="https://aifastscale.com/ar" />
        <link rel="alternate" hrefLang="en-AE" href="https://aifastscale.com" />
        <link rel="alternate" hrefLang="ar-AE" href="https://aifastscale.com/ar" />
        <link rel="alternate" hrefLang="x-default" href="https://aifastscale.com" />

        {/* Favicons - Generated by RealFaviconGenerator */}
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="AI FastScale" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* PWA Meta Tags for Sales Dashboard */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#7c3aed" />

        {/* Google Merchant Center Verification */}
        <meta name="google-site-verification" content="07UTX0YRgm3QIW1-mgHhLSko642Dbkp4ksQEZNq3z5g" />

        {/* Complete Schema.org Markup - Product + FAQ + Organization + LocalBusiness + Video */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Product',
                  '@id': 'https://aifastscale.com/#product',
                  name: '7 Minute AgentClone',
                  description:
                    'Turn a photo into a realistic talking AI video in 7 minutes. Complete step-by-step blueprint for real estate agents to generate 100+ leads monthly.',
                  image: 'https://aifastscale.com/images/P1_result.webp',
                  brand: {
                    '@type': 'Brand',
                    name: 'AI FastScale',
                  },
                  offers: {
                    '@type': 'Offer',
                    url: 'https://aifastscale.com',
                    priceCurrency: 'USD',
                    price: '37',
                    availability: 'https://schema.org/InStock',
                    priceValidUntil: '2025-12-31',
                    seller: {
                      '@type': 'Organization',
                      name: 'AI FastScale',
                    },
                  },
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '4.9',
                    reviewCount: '500',
                    bestRating: '5',
                    worstRating: '1',
                  },
                },
                {
                  '@type': 'FAQPage',
                  '@id': 'https://aifastscale.com/#faq',
                  mainEntity: [
                    {
                      '@type': 'Question',
                      name: 'How long does it take to create an AI video?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'With the 7-Minute AgentClone system, you can create professional talking AI videos in just 7 minutes. No technical skills or filming required.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'Will this work for real estate agents in UAE and Dubai?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Yes! The 7-Minute AgentClone works perfectly for UAE real estate agents in Dubai, Abu Dhabi, and Sharjah. Generate 5-15 leads per week with AI videos.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'Do I need to film myself or hire actors?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'No filming needed! Simply upload a photo and the AI creates a realistic talking video. Perfect for agents who want professional videos without being on camera.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'What is the refund policy?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'We offer a 30-day money-back guarantee. If you are not satisfied with the 7-Minute AgentClone course, request a full refund within 30 days.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'How many videos can I create?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Unlimited! After the one-time $37 investment, create as many AI talking videos as you want at no extra cost. No monthly subscriptions.',
                      },
                    },
                  ],
                },
                {
                  '@type': 'Organization',
                  '@id': 'https://aifastscale.com/#organization',
                  name: 'AI FastScale',
                  url: 'https://aifastscale.com',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://aifastscale.com/images/P1_result.webp',
                    width: 1200,
                    height: 630,
                  },
                  contactPoint: {
                    '@type': 'ContactPoint',
                    contactType: 'Customer Service',
                    areaServed: ['AE', 'SA', 'US', 'GB'],
                    availableLanguage: ['English', 'Arabic'],
                  },
                },
                {
                  '@type': 'LocalBusiness',
                  '@id': 'https://aifastscale.com/#localbusiness',
                  name: 'AI FastScale',
                  description:
                    'AI video creation platform for real estate agents in UAE. Turn photos into talking AI videos in 7 minutes.',
                  url: 'https://aifastscale.com',
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Dubai',
                    addressRegion: 'Dubai',
                    addressCountry: 'AE',
                  },
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: 25.2048,
                    longitude: 55.2708,
                  },
                  priceRange: '$37',
                  openingHours: 'Mo-Su 00:00-23:59',
                },
                {
                  '@type': 'VideoObject',
                  '@id': 'https://aifastscale.com/#herovideo',
                  name: '7-Minute AgentClone Demo - Turn Photos Into Talking AI Videos',
                  description:
                    'Watch how real estate agents create professional AI videos in 7 minutes to generate 100+ leads monthly.',
                  thumbnailUrl: 'https://aifastscale.com/images/P1_result.webp',
                  uploadDate: '2025-01-01',
                  duration: 'PT4M25S',
                  contentUrl: 'https://aifastscale.com/videos/Hero-VSL.mp4',
                  embedUrl: 'https://aifastscale.com',
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${plusJakarta.variable} min-h-screen bg-white text-black antialiased font-sans`}
      >
        {/* Real Estate Meta Pixels - Only loads on non-dentist pages */}
        <RootLayoutPixels />
        {/* Lazy load tracking pixels (TikTok + Meta) - path-aware */}
        <LazyTrackingPixels />
        {children}
      </body>
    </html>
  )
}
