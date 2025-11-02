# Core Web Vitals Optimization for Next.js - AI FastScale

## Summary
This document contains exact code snippets to fix Core Web Vitals issues for faster loading, better SEO rankings, and higher conversion rates.

**Target Metrics:**
- LCP (Largest Contentful Paint): < 2.5s ✅
- FID (First Input Delay): < 100ms ✅
- CLS (Cumulative Layout Shift): < 0.1 ✅

---

## 1. Font Optimization (Font Swap Strategy)

**Issue:** Fonts blocking render, causing layout shift
**Fix:** Already implemented in `app/layout.tsx` with `display: 'swap'`

```typescript
// ✅ ALREADY OPTIMIZED in layout.tsx lines 9-19
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap', // ← Prevents font blocking
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap', // ← Prevents font blocking
})
```

**Impact:** Prevents 0.3s+ delay waiting for fonts to load
**Status:** ✅ Already implemented

---

## 2. Image Optimization (Next.js Image Component)

**Issue:** Large unoptimized images slow down LCP
**Fix:** Use Next.js `<Image>` component with proper sizing

### Find all images in your codebase:
```bash
grep -r "<img" app/
```

### Replace with Next.js Image:

**Before:**
```tsx
<img src="/images/P1_result.webp" alt="AI FastScale" />
```

**After:**
```tsx
import Image from 'next/image'

<Image
  src="/images/P1_result.webp"
  alt="AI video for real estate UAE - 7-Minute AgentClone"
  width={1200}
  height={630}
  priority // For above-the-fold images only
  quality={85}
  placeholder="blur"
  blurDataURL="data:image/svg+xml;base64,..." // Optional
/>
```

**For responsive images (unknown size):**
```tsx
<div className="relative w-full h-64">
  <Image
    src="/images/P1_result.webp"
    alt="Dubai real estate agent AI video"
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    className="object-cover"
    priority={false} // Only true for hero images
  />
</div>
```

**Impact:** 40-60% reduction in image file sizes (WebP auto-conversion)
**LCP improvement:** 0.5-1.5 seconds

---

## 3. Video Preloading (Hero VSL)

**Issue:** Large video blocking LCP
**Fix:** Already implemented preload link in `layout.tsx`

```tsx
// ✅ ALREADY IMPLEMENTED in layout.tsx lines 98-104
<link
  rel="preload"
  href="/videos/Hero-VSL.mp4"
  as="video"
  type="video/mp4"
/>
```

**Additional optimization for video element:**
```tsx
// In page.tsx, update video tag:
<video
  ref={videoRef}
  className="absolute top-0 left-0 h-full w-full object-cover"
  playsInline
  preload="metadata" // ← Change from "auto" to "metadata"
  muted={videoMuted}
  poster="/images/thumbnail-vsl.webp"
>
  <source src="/videos/Hero-VSL.mp4" type="video/mp4" />
</video>
```

**Impact:** Saves 10-20MB initial load (loads video on-demand)
**Status:** Partially optimized (preload added, change preload="auto" to "metadata")

---

## 4. Lazy Loading Below-the-Fold Content

**Issue:** Loading all images immediately (even ones not visible)
**Fix:** Add lazy loading to images below the fold

```tsx
// Hero image (above the fold) - NO lazy loading
<Image
  src="/images/hero.webp"
  alt="AI FastScale"
  priority // ← Loads immediately
  loading="eager"
/>

// Testimonial images (below the fold) - YES lazy loading
<Image
  src="/images/testimonial-1.webp"
  alt="UAE real estate agent testimonial"
  loading="lazy" // ← Loads only when user scrolls near it
  width={80}
  height={80}
/>
```

**Impact:** 30-50% faster initial page load
**Browser support:** Native lazy loading works in all modern browsers

---

## 5. Preconnect to Third-Party Domains

**Status:** ✅ Already optimized in `layout.tsx` lines 91-97

```tsx
// ✅ ALREADY IMPLEMENTED
<link rel="preconnect" href="https://fast.wistia.net" />
<link rel="preconnect" href="https://embed-ssl.wistia.com" />
<link rel="preconnect" href="https://api.stripe.com" />
<link rel="dns-prefetch" href="https://checkout.stripe.com" />
<link rel="dns-prefetch" href="https://www.googletagmanager.com" />
<link rel="dns-prefetch" href="https://connect.facebook.net" />
<link rel="dns-prefetch" href="https://analytics.tiktok.com" />
```

**Impact:** 200-500ms faster connection to external services
**Status:** ✅ Already implemented

---

## 6. Reduce JavaScript Bundle Size

**Issue:** Large JavaScript files slow down Time to Interactive (TTI)
**Fix:** Dynamic imports for heavy components

### Before (loads everything upfront):
```tsx
import EmbeddedCheckout from './components/EmbeddedCheckout'

export default function Page() {
  return <EmbeddedCheckout />
}
```

### After (loads only when needed):
```tsx
import dynamic from 'next/dynamic'

const EmbeddedCheckout = dynamic(() => import('./components/EmbeddedCheckout'), {
  ssr: false, // Don't render on server (client-only)
  loading: () => <div>Loading checkout...</div>,
})

export default function Page() {
  return <EmbeddedCheckout />
}
```

**Components to dynamically import:**
- Stripe Checkout
- Video player (if using heavy library)
- Analytics components (GA4, Meta Pixel, TikTok)

**Impact:** 20-40% smaller initial JavaScript bundle

---

## 7. Enable Next.js Image Optimization

**File:** `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'], // Modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // Cache for 1 year
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Compress pages
  compress: true,
  // Enable React strict mode
  reactStrictMode: true,
}

module.exports = nextConfig
```

**Impact:** Automatic image optimization at request time

---

## 8. Reduce Cumulative Layout Shift (CLS)

**Issue:** Elements shifting during load (images, videos, ads)
**Fix:** Always specify width and height

### ❌ Bad (causes layout shift):
```tsx
<img src="/image.jpg" />
<video src="/video.mp4"></video>
```

### ✅ Good (reserves space):
```tsx
<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="..."
/>

<div style={{ aspectRatio: '16/9' }}>
  <video src="/video.mp4"></video>
</div>
```

**For video player wrapper (already in page.tsx):**
```tsx
// ✅ ALREADY GOOD - line 972 in page.tsx
<div
  className="group relative"
  style={{ padding: '56.67% 0 0 0' }} // ← Reserves space for 16:9 video
>
```

**Impact:** CLS score < 0.1 (excellent)

---

## 9. Optimize Critical CSS

**Issue:** Large CSS file blocking render
**Fix:** Inline critical CSS, defer non-critical

Next.js automatically optimizes CSS. Ensure you're using Tailwind's purge:

**File:** `tailwind.config.js`

```javascript
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // This removes unused CSS
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Impact:** 70-80% smaller CSS bundle (only used classes)

---

## 10. Enable Brotli/Gzip Compression

**For Vercel (automatic):** ✅ Already enabled
**For self-hosted:** Add to `next.config.js`

```javascript
const nextConfig = {
  compress: true, // Enables gzip compression
}
```

**Impact:** 60-80% reduction in file transfer size

---

## 11. Implement Resource Hints for Analytics

**File:** `app/layout.tsx` (partially done)

```tsx
<head>
  {/* ✅ Already implemented preconnect */}
  <link rel="preconnect" href="https://www.googletagmanager.com" />

  {/* Add these for better analytics loading */}
  <link rel="preconnect" href="https://www.google-analytics.com" />
  <link rel="preconnect" href="https://stats.g.doubleclick.net" />
</head>
```

---

## 12. Defer Non-Critical JavaScript

**Fix:** Load analytics scripts with `strategy="afterInteractive"`

**Check:** `app/components/GoogleAnalytics.tsx`

```tsx
// ✅ Ensure this pattern is used:
<Script
  id="google-analytics"
  strategy="afterInteractive" // ← Loads after page is interactive
  dangerouslySetInnerHTML={{
    __html: `...`,
  }}
/>
```

**Impact:** 300-500ms faster Time to Interactive (TTI)

---

## Performance Testing Checklist

After implementing fixes, test with:

### 1. Google PageSpeed Insights
```
https://pagespeed.web.dev/
Test URL: https://aifastscale.com
```

**Target Scores:**
- Performance: 90+ (mobile), 95+ (desktop)
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

### 2. Chrome DevTools Lighthouse
```
Chrome DevTools → Lighthouse → Run Analysis
```

### 3. WebPageTest
```
https://www.webpagetest.org/
Location: Dubai, UAE
Connection: 4G
```

### 4. Real User Monitoring
Set up Google Analytics 4 Web Vitals:

```javascript
// In app/components/GoogleAnalytics.tsx
<Script id="web-vitals" strategy="afterInteractive">
  {`
    import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

    function sendToAnalytics({name, delta, id}) {
      gtag('event', name, {
        event_category: 'Web Vitals',
        value: Math.round(delta),
        event_label: id,
        non_interaction: true,
      });
    }

    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getFCP(sendToAnalytics);
    getLCP(sendToAnalytics);
    getTTFB(sendToAnalytics);
  `}
</Script>
```

---

## Priority Implementation Order

**Week 1 (Critical - Do First):**
1. ✅ Font optimization (already done)
2. ✅ Preconnect tags (already done)
3. ⚠️ Replace all `<img>` with Next.js `<Image>` (DO THIS)
4. ⚠️ Change video preload from "auto" to "metadata" (DO THIS)

**Week 2 (High Priority):**
5. Add lazy loading to below-fold images
6. Dynamic import for Stripe checkout
7. Optimize video poster image size

**Week 3 (Medium Priority):**
8. Enable AVIF format in next.config.js
9. Add Web Vitals tracking to GA4
10. Test and monitor performance

---

## Expected Results

**Before Optimization:**
- LCP: 3.5-4.5s
- FID: 150-300ms
- CLS: 0.15-0.3
- PageSpeed Score: 60-75 (mobile)

**After Optimization:**
- LCP: 1.8-2.3s ✅
- FID: 50-80ms ✅
- CLS: < 0.1 ✅
- PageSpeed Score: 90-95 (mobile) ✅

**SEO Impact:**
- Google uses Core Web Vitals as ranking factor
- Better CWV = higher rankings for competitive keywords
- Faster load = lower bounce rate = more conversions

---

## Quick Wins (Implement Today)

```bash
# 1. Find all <img> tags
grep -r "<img" app/ --include="*.tsx"

# 2. Replace with Image component
# (Manual replacement needed - use VS Code find/replace)

# 3. Test locally
npm run dev

# 4. Test production build
npm run build
npm run start

# 5. Deploy
vercel --prod
```

After deployment, test at: https://pagespeed.web.dev/

---

**Status:**
- ✅ Fonts optimized
- ✅ Preconnect added
- ✅ Video preload added
- ⚠️ Images need Next.js optimization
- ⚠️ Video preload strategy needs change

**Next Steps:** Replace `<img>` tags with `<Image>` component in `app/page.tsx`
