# Setup Instructions for AI FastScale LP

## 🚀 Quick Start Checklist

Follow these steps to complete your landing page setup:

---

## 1. Install FFmpeg (for video compression)

**On macOS:**
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install FFmpeg
brew install ffmpeg
```

**On Windows:**
Download from: https://ffmpeg.org/download.html

**On Linux:**
```bash
sudo apt update && sudo apt install ffmpeg
```

---

## 2. Compress Hero Video (48MB → 10-15MB)

Run this command to compress your main video:

```bash
ffmpeg -i public/videos/Hero-VSL.mp4 \
  -vcodec libx264 \
  -crf 28 \
  -preset medium \
  -vf "scale=1920:-2" \
  -movflags +faststart \
  -c:a aac -b:a 128k \
  public/videos/Hero-VSL-compressed.mp4
```

Then replace the original:
```bash
mv public/videos/Hero-VSL.mp4 public/videos/Hero-VSL-original.mp4
mv public/videos/Hero-VSL-compressed.mp4 public/videos/Hero-VSL.mp4
```

**Expected result:** File size should be 10-15MB

---

## 3. Generate Favicon Files

We've created `public/icon.svg`. Now convert it to multiple formats:

**Option A: Using Online Tool (Easiest)**
1. Go to: https://realfavicongenerator.net/
2. Upload `public/icon.svg`
3. Download the package
4. Extract `favicon.ico` and `apple-touch-icon.png` to `/public/`

**Option B: Using ImageMagick**
```bash
# Install ImageMagick
brew install imagemagick

# Generate favicon.ico (multi-size)
convert public/icon.svg -define icon:auto-resize=256,128,64,48,32,16 public/favicon.ico

# Generate apple-touch-icon.png (180x180)
convert public/icon.svg -resize 180x180 public/apple-touch-icon.png
```

---

## 4. Setup Google Analytics 4

1. Go to: https://analytics.google.com/
2. Create a new property for your website
3. Copy your Measurement ID (looks like `G-XXXXXXXXXX`)
4. Create a `.env.local` file:

```bash
# Create .env.local
echo "NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX" > .env.local
```

**Replace `G-XXXXXXXXXX` with your actual Measurement ID!**

---

## 5. Setup Google Search Console

1. Go to: https://search.google.com/search-console
2. Add your property: `https://aifastscale.com`
3. Choose "HTML tag" verification method
4. Copy your verification code
5. Update `app/layout.tsx` line 71:

```typescript
verification: {
  google: 'YOUR_VERIFICATION_CODE_HERE',  // ← Replace this
},
```

---

## 6. Update Contact Information

Update these placeholder values in `app/page.tsx`:

**Social Media Links** (line 1662):
```typescript
{ icon: Facebook, href: 'https://facebook.com/YOUR_PAGE' },
{ icon: Instagram, href: 'https://instagram.com/YOUR_HANDLE' },
{ icon: Twitter, href: 'https://twitter.com/YOUR_HANDLE' },
{ icon: Youtube, href: 'https://youtube.com/@YOUR_CHANNEL' },
{ icon: Linkedin, href: 'https://linkedin.com/company/YOUR_COMPANY' }
```

**Phone Number** (line 1699):
```typescript
<span className="font-semibold">+1 (305) 555-0100</span>  // ← Replace
```

**Email** (line 1694):
- Verify `support@aifastscale.com` is correct or update it

**Address** (line 1703):
- Verify `Miami, FL USA` is correct or update it

---

## 7. Test Everything

```bash
# Install dependencies (if not already done)
npm install

# Run development server
npm run dev

# Open http://localhost:3000 and test:
# ✓ Favicon appears in browser tab
# ✓ Video loads and plays smoothly
# ✓ All links work
# ✓ Legal pages load correctly
# ✓ Stripe checkout buttons work
# ✓ Social media links go to correct pages

# Build for production
npm run build

# Test production build locally
npm start
```

---

## 8. Deploy to Production

**If using Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variable in Vercel dashboard:
# NEXT_PUBLIC_GA_MEASUREMENT_ID = G-XXXXXXXXXX
```

**If using other hosting:**
- Make sure to set `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable
- Upload all files including `public/favicon.ico` and `public/apple-touch-icon.png`

---

## 9. Post-Launch SEO

After deploying:

1. **Submit sitemap to Google:**
   - Go to Google Search Console
   - Sitemaps → Add sitemap: `https://aifastscale.com/sitemap.xml`

2. **Test in Google Rich Results:**
   - https://search.google.com/test/rich-results
   - Test your homepage for schema.org structured data

3. **Test Open Graph:**
   - https://www.opengraph.xyz/
   - Paste your URL to see social preview

4. **Check page speed:**
   - https://pagespeed.web.dev/
   - Test both mobile and desktop

---

## 📋 Final Checklist

Before going live, ensure:

- [ ] FFmpeg installed and video compressed to <15MB
- [ ] favicon.ico exists in `/public/`
- [ ] apple-touch-icon.png exists in `/public/`
- [ ] .env.local created with GA4 Measurement ID
- [ ] Google Search Console verification code added
- [ ] Social media links updated with real URLs
- [ ] Phone number updated with real number
- [ ] Email address verified
- [ ] Address verified
- [ ] `npm run build` completes without errors
- [ ] Test all Stripe payment links
- [ ] Test on mobile device
- [ ] Test in incognito/private browsing

---

## 🎉 You're Ready to Launch!

Once all items are checked, your landing page is production-ready.

**Need help?** Check the main README.md or contact support.
