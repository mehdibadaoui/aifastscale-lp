import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Members Area | CloneYourself for Lawyers',
  description: 'Access your premium AI video marketing course and bonuses.',
  robots: 'noindex, nofollow', // Members area should not be indexed
}

export const viewport: Viewport = {
  themeColor: '#0a0f1a',
  colorScheme: 'dark',
}

export default function MembersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Preload critical assets for faster LCP */}
      <link
        rel="preload"
        href="/images/lawyer/dr-marcus.webp"
        as="image"
        type="image/webp"
      />

      {/* Preconnect to Wistia for faster video load */}
      <link rel="preconnect" href="https://fast.wistia.com" />
      <link rel="dns-prefetch" href="https://fast.wistia.com" />

      {/* Preconnect to fonts if used */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />

      {children}
    </>
  )
}
