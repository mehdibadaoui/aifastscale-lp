# AI FastScale Landing Page

Professional landing page for the 7-Minute AgentClone™ course, built with Next.js 16, React 19, and Tailwind CSS v4.

**Live Demo:** [https://aifastscale.com](https://aifastscale.com)

---

## 🚀 Quick Setup

**First time setup? Read [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) first!**

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 📋 Pre-Launch Checklist

Before deploying, complete these steps:

- [ ] Compress video: `./scripts/compress-video.sh`
- [ ] Generate favicons: `./scripts/generate-favicons.sh`
- [ ] Setup Google Analytics (create `.env.local`)
- [ ] Update social media links in `app/page.tsx`
- [ ] Update phone number in `app/page.tsx`
- [ ] Add Google Search Console verification code
- [ ] Test: `npm run build`

**See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for detailed steps.**

---

## 📚 Documentation

- **[SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)** - Complete setup guide
- **[CHANGES_SUMMARY.md](CHANGES_SUMMARY.md)** - Overview of recent improvements
- **README.md** - This file

---

## 🛠 Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with Server Components
- **Tailwind CSS v4** - Utility-first CSS framework
- **TypeScript** - Type safety
- **Lucide React** - Icon library
- **Google Analytics 4** - Analytics tracking
- **Stripe** - Payment processing

---

## 📁 Project Structure

```
├── app/
│   ├── components/
│   │   └── GoogleAnalytics.tsx    # GA4 tracking
│   ├── privacy-policy/            # Legal pages
│   ├── terms-of-service/
│   ├── refund-policy/
│   ├── disclaimer/
│   ├── layout.tsx                 # Root layout + metadata
│   ├── page.tsx                   # Main landing page
│   ├── sitemap.ts                 # Dynamic sitemap
│   └── globals.css                # Global styles
├── public/
│   ├── images/                    # Optimized WebP images
│   ├── videos/                    # Hero + demo videos
│   ├── icon.svg                   # Brand icon
│   └── robots.txt                 # SEO
├── scripts/
│   ├── compress-video.sh          # Video optimization
│   └── generate-favicons.sh       # Favicon generation
└── [docs]                         # Setup guides
```

---

## 🎯 Features

- ✅ **Optimized Performance** - Next.js Image, lazy loading, WebP images
- ✅ **SEO Ready** - Metadata, sitemap, robots.txt, structured data
- ✅ **Analytics** - Google Analytics 4 integration
- ✅ **Legal Pages** - Complete privacy policy, terms, refund policy, disclaimer
- ✅ **Mobile Responsive** - Fully responsive design
- ✅ **Video Player** - Custom HTML5 video player with progress tracking
- ✅ **Price Reveal** - Dynamic price unlock based on video watch time
- ✅ **Testimonials** - 12 real estate agent testimonials
- ✅ **FAQ Section** - 15 comprehensive FAQs
- ✅ **Security** - Light anti-inspect protection

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
vercel --prod
```

Set environment variable in Vercel dashboard:
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` = Your GA4 Measurement ID

### Other Platforms

Build and export:
```bash
npm run build
npm start
```

---

## 📈 Performance

- **Build Time:** ~1.6s compile + 324ms generation
- **Bundle Size:** Optimized with Next.js
- **Images:** 26 WebP images (2.2MB total)
- **Videos:** 4 videos (compress Hero-VSL.mp4 for optimal performance)
- **Routes:** 9 static pages, all pre-rendered

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
