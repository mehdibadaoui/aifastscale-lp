import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "AI FastScale – 7-Minute AgentClone™ | Turn Photos Into Talking AI Videos",
  description: "Turn a photo into a realistic talking AI video in 7 minutes. Get 5-15 leads this week, 100+ real buyer leads monthly. Built for real estate agents. No filming, no technical skills needed. $37 limited time offer.",
  keywords: "AI video, real estate marketing, talking AI videos, lead generation, real estate agents, AI agent clone, video marketing, property listing videos",
  authors: [{ name: "AI FastScale" }],
  creator: "AI FastScale",
  publisher: "AI FastScale",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://aifastscale.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "AI FastScale – 7-Minute AgentClone™ | Turn Photos Into Talking AI Videos",
    description: "Turn a photo into a realistic talking AI video in 7 minutes. Get 5-15 leads this week, 100+ real buyer leads monthly. Built for real estate agents.",
    url: 'https://aifastscale.com',
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
    title: "AI FastScale – 7-Minute AgentClone™",
    description: "Turn a photo into a realistic talking AI video in 7 minutes. Get 5-15 leads this week. Built for real estate agents.",
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Resource hints for performance */}
        <link rel="preconnect" href="https://fast.wistia.net" />
        <link rel="preconnect" href="https://embed-ssl.wistia.com" />
        <link rel="dns-prefetch" href="https://fast.wistia.net" />
        <link rel="dns-prefetch" href="https://embed-ssl.wistia.com" />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "7 Minute AgentClone Course",
              "description": "Turn a photo into a realistic talking AI video in 7 minutes. Complete step by step blueprint with system prompts and workflows for real estate agents.",
              "image": "https://aifastscale.com/images/P1_result.webp",
              "brand": {
                "@type": "Organization",
                "name": "AI FastScale"
              },
              "offers": {
                "@type": "Offer",
                "url": "https://aifastscale.com",
                "priceCurrency": "USD",
                "price": "37",
                "priceValidUntil": "2025-12-31",
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@type": "Organization",
                  "name": "AI FastScale"
                }
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "500"
              }
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
