import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import CookieConsent from './components/CookieConsent'
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
  title: 'CloneYourself Video System | AI Videos for Professionals | $47.81',
  description:
    'Create AI talking videos in minutes. Perfect for lawyers, dentists, psychologists, and professionals. One-time $47.81 payment, lifetime access.',
  keywords:
    'AI video, professional marketing, talking AI videos, lead generation, lawyer marketing, dentist marketing, AI video course',
  authors: [{ name: 'Velon LLC' }],
  creator: 'Velon LLC',
  publisher: 'Velon LLC',
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
      'CloneYourself Video System | AI Videos for Professionals',
    description:
      'Create realistic AI talking videos in minutes. Perfect for lawyers, dentists, psychologists, and service professionals. One-time payment, lifetime access.',
    url: SITE_CONFIG.url,
    siteName: 'CloneYourself Video System',
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
    title: 'CloneYourself Video System | AI Videos for Professionals',
    description:
      'Create realistic AI talking videos in minutes. Perfect for lawyers, dentists, psychologists, and service professionals.',
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
        {/* TRACKING PIXELS: Add your pixel scripts here when ready */}

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

        {/* DNS prefetch for tracking - add when pixels are configured */}

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
                  name: 'CloneYourself Video System',
                  description:
                    'Turn a photo into a realistic talking AI video in minutes. Complete step-by-step system for professionals to create AI videos.',
                  image: 'https://aifastscale.com/images/P1_result.webp',
                  brand: {
                    '@type': 'Brand',
                    name: 'CloneYourself Video System',
                  },
                  offers: {
                    '@type': 'Offer',
                    url: 'https://aifastscale.com',
                    priceCurrency: 'USD',
                    price: '47.81',
                    availability: 'https://schema.org/InStock',
                    priceValidUntil: '2026-12-31',
                    seller: {
                      '@type': 'Organization',
                      name: 'Velon LLC',
                    },
                  },
                  // aggregateRating removed - no verified review data to substantiate
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
                        text: 'With the CloneYourself Video System, you can create professional talking AI videos in minutes. No technical skills or filming required.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'Who is this product for?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'The CloneYourself Video System is designed for professionals including lawyers, dentists, psychologists, plastic surgeons, and other service professionals who want to create AI videos for their practice.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'Do I need to film myself or hire actors?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'No filming needed! Simply upload a photo and the AI creates a realistic talking video. Perfect for professionals who want marketing videos without being on camera.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'What is the refund policy?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'We offer a 30-day money-back guarantee. If you are not satisfied with the CloneYourself Video System, request a full refund within 30 days.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'How many videos can I create?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Unlimited! After the one-time $47.81 investment, create as many AI talking videos as you want at no extra cost. No monthly subscriptions.',
                      },
                    },
                  ],
                },
                {
                  '@type': 'Organization',
                  '@id': 'https://aifastscale.com/#organization',
                  name: 'Velon LLC',
                  url: 'https://aifastscale.com',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://aifastscale.com/images/P1_result.webp',
                    width: 1200,
                    height: 630,
                  },
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: '30 N Gould St Ste R',
                    addressLocality: 'Sheridan',
                    addressRegion: 'WY',
                    postalCode: '82801',
                    addressCountry: 'US',
                  },
                  contactPoint: {
                    '@type': 'ContactPoint',
                    contactType: 'Customer Service',
                    areaServed: ['US', 'GB', 'AE', 'SA'],
                    availableLanguage: ['English'],
                  },
                },
                {
                  '@type': 'LocalBusiness',
                  '@id': 'https://aifastscale.com/#localbusiness',
                  name: 'Velon LLC',
                  description:
                    'AI video creation system for professionals. Turn photos into talking AI videos in minutes.',
                  url: 'https://aifastscale.com',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: '30 N Gould St Ste R',
                    addressLocality: 'Sheridan',
                    addressRegion: 'WY',
                    postalCode: '82801',
                    addressCountry: 'US',
                  },
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: 44.7972,
                    longitude: -106.9561,
                  },
                  priceRange: '$47.81',
                  openingHours: 'Mo-Su 00:00-23:59',
                },
                {
                  '@type': 'VideoObject',
                  '@id': 'https://aifastscale.com/#herovideo',
                  name: 'CloneYourself Video System Demo - Turn Photos Into Talking AI Videos',
                  description:
                    'Watch how professionals create AI videos in minutes for their practice marketing.',
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
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
