# 📘 Facebook Ads API Setup Guide for Beginners

This guide will help you connect your Facebook Ads account to your Sales Dashboard so you can track ROI, ROAS, and ad spend automatically.

---

## 🎯 What You'll Get After Setup

Once configured, your dashboard will automatically:
- ✅ Show **total ad spend** from Facebook Ads
- ✅ Calculate **ROI** (Return on Investment) per channel
- ✅ Calculate **ROAS** (Return on Ad Spend)
- ✅ Show **profit** after subtracting ad costs
- ✅ Compare performance between Facebook Ads, Google Ads, SEO, and Direct traffic

---

## 📋 Prerequisites

Before you start, make sure you have:
1. ✅ A Facebook Business account with active ad campaigns
2. ✅ Admin access to your Facebook Business Manager
3. ✅ Your Facebook Ad Account ID
4. ⏱️ About 15-20 minutes to complete setup

---

## 🚀 Step-by-Step Setup

### Step 1: Find Your Facebook Ad Account ID

1. Go to [Facebook Ads Manager](https://business.facebook.com/adsmanager)
2. Click on your ad account name in the top left
3. Go to **Settings** (gear icon)
4. Look for **"Ad Account ID"** - it looks like: `act_123456789`
5. **Copy this ID** - you'll need it later

> 💡 **Tip**: The ID always starts with `act_` followed by numbers.

---

### Step 2: Create a Facebook App (for API Access)

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **"My Apps"** in the top right
3. Click **"Create App"**
4. Choose app type: **"Business"**
5. Fill in:
   - **App Name**: "My Sales Dashboard" (or any name you like)
   - **App Contact Email**: Your email
6. Click **"Create App"**

---

### Step 3: Add Marketing API to Your App

1. In your newly created app, go to **"Add Products"** from the left sidebar
2. Find **"Marketing API"** and click **"Set Up"**
3. Click **"Get Started"**

---

### Step 4: Generate Your Access Token

This is the most important step!

1. In your app dashboard, go to **"Tools"** → **"Graph API Explorer"**
2. In the top section:
   - Select your app from the dropdown
   - Click **"Generate Access Token"**
3. You'll be asked to grant permissions. Check these boxes:
   - ✅ `ads_read` - Read ads performance data
   - ✅ `ads_management` - Manage your ads
   - ✅ `business_management` - Access business data
4. Click **"Generate Access Token"**
5. **COPY THE TOKEN** - it's a long string starting with `EAAA...`

> ⚠️ **IMPORTANT**: This token is like a password - keep it secret!

---

### Step 5: Get a Long-Lived Access Token (Recommended)

The token you just got expires in 1 hour. Let's make it last longer!

**Option A: Use Facebook's Access Token Debugger (Easy)**

1. Go to [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)
2. Paste your token from Step 4
3. Click **"Extend Access Token"**
4. Copy the new long-lived token (lasts 60 days)

**Option B: Use This API Call (Advanced)**

Replace the values in this URL:
```
https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=YOUR_SHORT_TOKEN
```

- `YOUR_APP_ID`: From your app dashboard
- `YOUR_APP_SECRET`: From app dashboard → Settings → Basic
- `YOUR_SHORT_TOKEN`: The token from Step 4

Open this URL in your browser, and you'll get a JSON response with `access_token`.

---

### Step 6: Add Credentials to Your Dashboard

1. Open your project folder
2. Find the file **`.env.local`** (if it doesn't exist, create it)
3. Add these lines:

```bash
# Facebook Ads API Configuration
FACEBOOK_ACCESS_TOKEN=EAAA... # Paste your long-lived token here
FACEBOOK_AD_ACCOUNT_ID=act_123456789 # Paste your ad account ID here
```

4. Save the file

---

### Step 7: Test Your Connection

1. Go to your Sales Dashboard at `http://localhost:3000/sales-dashboard`
2. Click on the **"Analytics"** tab
3. Look for the **ROI Dashboard** section
4. If configured correctly, you should see:
   - ✅ Your Facebook ad spend
   - ✅ "Facebook Ads API: ✅ Connected"
   - ✅ ROI and ROAS calculations

> If you see "Not configured", double-check your `.env.local` file.

---

## 🔧 Troubleshooting

### ❌ "Error: Invalid OAuth access token"

**Solution**: Your token expired or is invalid.
- Generate a new long-lived token (Step 5)
- Update `.env.local` with the new token
- Restart your dev server: `npm run dev`

### ❌ "Error: Ad account not found"

**Solution**: Your Ad Account ID is incorrect.
- Double-check the ID in Facebook Ads Manager (Step 1)
- Make sure it starts with `act_`
- Update `.env.local`

### ❌ "Error: Insufficient permissions"

**Solution**: Your app doesn't have the right permissions.
- Go to Graph API Explorer
- Regenerate token with `ads_read`, `ads_management`, and `business_management` permissions
- Update `.env.local`

### ❌ Dashboard shows "$0.00" ad spend

**Possible reasons**:
1. No ad spend in the selected date range
2. Ads are still pending/in review
3. Token doesn't have access to the correct ad account

**Solution**:
- Check your Facebook Ads Manager to verify you have active spending
- Make sure you selected the correct ad account ID
- Wait a few hours for Facebook's API to sync data

---

## 🔄 Token Renewal (Every 60 Days)

Long-lived tokens expire after 60 days. Set a reminder to:

1. Repeat Step 4 to generate a new short-lived token
2. Repeat Step 5 to convert it to a long-lived token
3. Update `.env.local` with the new token
4. Restart your server

> 💡 **Pro Tip**: Add a calendar reminder 55 days from today!

---

## 🎓 Advanced: Automate Token Refresh (Optional)

If you want to avoid manual token renewal, you can implement Facebook's OAuth flow with refresh tokens. This requires:

1. Setting up a Facebook Login flow
2. Storing refresh tokens in a database
3. Creating a cron job to refresh tokens automatically

**Resources**:
- [Facebook OAuth Documentation](https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived)
- [Token Refresh Guide](https://developers.facebook.com/docs/facebook-login/guides/access-tokens/refresh)

---

## 📊 What Data You'll See

Once set up, your dashboard shows:

### Per-Channel Metrics:
- **Sales**: Number of sales from Facebook Ads traffic
- **Revenue**: Total revenue from Facebook Ads
- **Spend**: Total money spent on Facebook Ads
- **Profit**: Revenue - Ad Spend - Stripe Fees
- **ROI**: (Profit / Spend) × 100%
- **ROAS**: Revenue / Spend
- **CPA**: Cost Per Acquisition (Spend / Sales)

### Example Dashboard View:
```
╔═══════════════════════════════════════════════╗
║           ROI Analytics Dashboard             ║
╠═══════════════════════════════════════════════╣
║ Channel        │ Sales │ Revenue │ Spend │ ROI ║
╟───────────────┼───────┼─────────┼───────┼─────╢
║ Facebook Ads  │   15  │ $555.00 │ $200  │ 144%║
║ Google Ads    │   10  │ $370.00 │ $150  │  90%║
║ Google SEO    │    8  │ $296.00 │   $0  │  ∞  ║
║ Direct        │    5  │ $185.00 │   $0  │  ∞  ║
╚═══════════════════════════════════════════════╝
```

---

## 🆘 Still Need Help?

If you're stuck:

1. **Check Facebook's Status**: [https://developers.facebook.com/status/](https://developers.facebook.com/status/)
2. **Read Facebook's Docs**: [Marketing API Quickstart](https://developers.facebook.com/docs/marketing-api/get-started)
3. **Check Your App Permissions**: Make sure your app is in "Development" or "Live" mode
4. **Verify API Version**: We use v21.0 - make sure it's not deprecated

---

## ✅ Setup Complete!

Congratulations! Your Facebook Ads tracking is now connected to your Sales Dashboard.

**What's Next?**
- Set up [Google Ads tracking](./GOOGLE_ADS_SETUP_GUIDE.md) (if you run Google Ads)
- Review your ROI data daily to optimize ad spend
- Use the dashboard's forecasting tools to predict future revenue

---

## 🔐 Security Best Practices

- ❌ **Never** commit `.env.local` to Git
- ❌ **Never** share your access token publicly
- ✅ **Always** use environment variables for credentials
- ✅ **Rotate** tokens every 60 days
- ✅ **Use** a `.gitignore` file to exclude `.env.local`

---

**Generated for AI Fast Scale Sales Dashboard**
Last Updated: November 2025
