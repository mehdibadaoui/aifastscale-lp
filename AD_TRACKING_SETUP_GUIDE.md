# 📊 Complete Ad Tracking & ROI Setup Guide

Track your Facebook and Google Ads spend automatically and calculate your true ROI!

---

## 🎯 What You'll Get

✅ **Automatic UTM Tracking** - Every sale is attributed to its source
✅ **Facebook Ads Spend Tracking** - See exactly how much you're spending
✅ **Google Ads Spend Tracking** - Track Google campaign costs
✅ **ROI Calculator** - Revenue vs Ad Spend per channel
✅ **Traffic Source Analytics** - See which ads perform best
✅ **Profit Dashboard** - Real profit after ad costs

---

## 🚀 Part 1: UTM Tracking (Already Done! ✅)

Your landing page now automatically captures UTM parameters when visitors click your ads.

### How to Use UTM Parameters

When creating ads, add these parameters to your URLs:

#### Facebook Ads Example:
```
https://yourdomain.com/?utm_source=facebook&utm_medium=cpc&utm_campaign=summer_sale&utm_content=video_ad_1
```

#### Google Ads Example:
```
https://yourdomain.com/?utm_source=google&utm_medium=cpc&utm_campaign=real_estate_dubai&utm_term=ai+video+agent
```

#### TikTok Ads Example:
```
https://yourdomain.com/?utm_source=tiktok&utm_medium=cpc&utm_campaign=viral_agent_video
```

### UTM Parameter Breakdown:
- `utm_source` - Where traffic comes from (facebook, google, tiktok, instagram)
- `utm_medium` - Marketing medium (cpc, social, email, banner)
- `utm_campaign` - Campaign name (summer_sale, black_friday, relaunch)
- `utm_term` - Keywords (for Google Ads mainly)
- `utm_content` - Ad variation (video_ad_1, image_ad_2, carousel_ad)

**The system automatically detects Facebook Click ID (fbclid) and Google Click ID (gclid) too!**

---

## 📘 Part 2: Facebook Ads API Setup

### Step 1: Create Facebook App

1. Go to https://developers.facebook.com/apps
2. Click **Create App**
3. Select **Business** as app type
4. Fill in app details and click **Create App**

### Step 2: Get Access Token

1. In your app dashboard, go to **Tools** → **Graph API Explorer**
2. Click **Generate Access Token**
3. Select these permissions:
   - `ads_read`
   - `read_insights`
4. Click **Generate Token**
5. **IMPORTANT:** Click "Get Long-Lived Token" to get a token that doesn't expire

### Step 3: Get Ad Account ID

1. Go to https://business.facebook.com/settings/ad-accounts
2. Find your Ad Account ID (format: `123456789`)
3. Prefix it with `act_` so it becomes: `act_123456789`

### Step 4: Add Environment Variables

Add these to your `.env.local` file:

```bash
# Facebook Marketing API
FACEBOOK_ACCESS_TOKEN=your_long_lived_access_token_here
FACEBOOK_AD_ACCOUNT_ID=act_123456789
```

### Step 5: Deploy to Vercel

```bash
vercel env add FACEBOOK_ACCESS_TOKEN production
# Paste your token

vercel env add FACEBOOK_AD_ACCOUNT_ID production
# Enter: act_123456789

vercel --prod
```

---

## 🔍 Part 3: Google Ads API Setup

**Note:** Google Ads setup is more complex. If you want a simpler approach, use manual entry (see Part 5).

### Step 1: Get Developer Token

1. Go to https://ads.google.com/aw/overview
2. Click **Tools & Settings** → **Setup** → **API Center**
3. Apply for a Developer Token
4. Wait for approval (can take 1-2 days)

### Step 2: Create OAuth Credentials

1. Go to https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Enable **Google Ads API**
4. Go to **Credentials** → **Create Credentials** → **OAuth Client ID**
5. Select **Web Application**
6. Add authorized redirect URI: `http://localhost`
7. Download credentials (you'll get `client_id` and `client_secret`)

### Step 3: Get Refresh Token

This requires running a one-time authentication flow. Here's a simple script:

```javascript
// Run this in your browser console at https://accounts.google.com/o/oauth2/v2/auth

const clientId = 'YOUR_CLIENT_ID'
const scope = 'https://www.googleapis.com/auth/adwords'
const redirectUri = 'http://localhost'

const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`

console.log('Visit this URL:', authUrl)
// After auth, you'll get a code in the URL. Exchange it for a refresh token.
```

### Step 4: Get Customer ID

1. Go to https://ads.google.com/
2. Your Customer ID is at the top-right (format: `123-456-7890`)

### Step 5: Add Environment Variables

```bash
# Google Ads API
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
GOOGLE_ADS_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_ADS_CLIENT_SECRET=your_client_secret
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token
GOOGLE_ADS_CUSTOMER_ID=123-456-7890
```

### Step 6: Deploy to Vercel

```bash
vercel env add GOOGLE_ADS_DEVELOPER_TOKEN production
vercel env add GOOGLE_ADS_CLIENT_ID production
vercel env add GOOGLE_ADS_CLIENT_SECRET production
vercel env add GOOGLE_ADS_REFRESH_TOKEN production
vercel env add GOOGLE_ADS_CUSTOMER_ID production

vercel --prod
```

---

## 📝 Part 4: Manual Entry (Easier Alternative)

If API setup is too complex, you can manually enter your daily ad spend in the dashboard.

The dashboard has a "Manual Entry" button where you can input:
- Date
- Platform (Facebook/Google/TikTok)
- Amount Spent
- Clicks (optional)
- Impressions (optional)

This data is stored locally and used to calculate ROI.

---

## 📊 Part 5: Understanding Your ROI Dashboard

Once set up, your dashboard will show:

### Traffic Source Breakdown
```
Facebook Ads:    15 sales | $555 revenue | $200 spent | $355 profit | 177% ROI
Google Ads:      8 sales  | $296 revenue | $150 spent | $146 profit | 97% ROI
Direct:          3 sales  | $111 revenue | $0 spent   | $111 profit | ∞ ROI
```

### Key Metrics:
- **Revenue:** Total sales from this channel
- **Spend:** Total ad costs
- **Profit:** Revenue - Spend - Stripe fees
- **ROI:** (Profit / Spend) × 100%
- **CPA (Cost Per Acquisition):** Spend / Sales
- **ROAS (Return on Ad Spend):** Revenue / Spend

---

## 🎯 Pro Tips

1. **Always use UTM parameters** - This is the foundation of tracking
2. **Test your URLs** - Click your ad and check if UTM params appear in the browser
3. **Be consistent** - Use the same utm_source values (lowercase, no spaces)
4. **Track everything** - Even organic and email traffic with UTMs
5. **Review weekly** - Check which channels are profitable
6. **Optimize** - Pause campaigns with ROI < 100%, scale winners

---

## 🔥 Advanced: Auto-Optimization

Based on ROI data, you can:
- Pause ads with ROI < 50%
- Double budget on ads with ROI > 200%
- A/B test different utm_content values
- Track seasonal trends

---

## ❓ Troubleshooting

### "UTM parameters not showing"
- Check if localStorage is enabled
- Visit your site with `?utm_source=test` and check browser console
- Clear cache and try again

### "Facebook API returns error"
- Verify your access token hasn't expired
- Check if ad account ID has `act_` prefix
- Ensure permissions include `ads_read` and `read_insights`

### "Google Ads API error"
- Verify Developer Token is approved
- Check if refresh token is valid
- Ensure Customer ID format is correct (with dashes)

### "Sales not attributed correctly"
- UTM parameters expire after 30 days
- If user visits multiple times, last-click attribution is used
- Check Stripe metadata to see captured UTM params

---

## 📞 Need Help?

If you get stuck:
1. Check browser console for errors
2. Test API endpoints directly: `/api/facebook-ads` and `/api/google-ads`
3. Use manual entry as fallback
4. Review Stripe checkout session metadata to verify UTM capture

---

**You're all set! 🚀 Now you can track EXACTLY where your sales come from and optimize your ad spend for maximum profit!**
