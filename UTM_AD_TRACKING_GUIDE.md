# 🎯 UTM Ad Tracking Guide - AI Fast Scale

## 📋 Quick Reference

**Your Base URL**: `https://aifastscale.com`

**UTM Parameters for Tracking**:
- `utm_source` - Where the traffic comes from (facebook, google, tiktok)
- `utm_medium` - Type of marketing (cpc, social, email)
- `utm_campaign` - Campaign name (promo_jan2025, black_friday)
- `utm_term` - Keywords (for Google Ads)
- `utm_content` - Ad variation (video_a, image_b)

---

## 🎨 UTM Link Templates

### Facebook Ads

```
https://aifastscale.com?utm_source=facebook&utm_medium=cpc&utm_campaign=CAMPAIGN_NAME&utm_content=AD_NAME
```

**Examples**:

**Campaign: Cold Traffic VSL**
```
https://aifastscale.com?utm_source=facebook&utm_medium=cpc&utm_campaign=cold_vsl_jan2025&utm_content=video_1
```

**Campaign: Retargeting**
```
https://aifastscale.com?utm_source=facebook&utm_medium=retargeting&utm_campaign=7day_retarget&utm_content=testimonial_ad
```

**Campaign: Lookalike Audiences**
```
https://aifastscale.com?utm_source=facebook&utm_medium=cpc&utm_campaign=lookalike_purchasers&utm_content=upsell_offer
```

---

### Google Ads

```
https://aifastscale.com?utm_source=google&utm_medium=cpc&utm_campaign=CAMPAIGN_NAME&utm_term=KEYWORD&utm_content=AD_VARIATION
```

**Examples**:

**Search Campaign**
```
https://aifastscale.com?utm_source=google&utm_medium=cpc&utm_campaign=search_ai_video&utm_term=ai_video_course&utm_content=headline_1
```

**Display Campaign**
```
https://aifastscale.com?utm_source=google&utm_medium=display&utm_campaign=remarketing_video&utm_content=banner_300x250
```

---

### TikTok Ads

```
https://aifastscale.com?utm_source=tiktok&utm_medium=cpc&utm_campaign=CAMPAIGN_NAME&utm_content=VIDEO_NAME
```

**Example**:
```
https://aifastscale.com?utm_source=tiktok&utm_medium=cpc&utm_campaign=viral_test&utm_content=hook_1
```

---

## 💡 Best Practices

### 1. **Use Consistent Naming**
✅ GOOD: `cold_traffic_vsl_jan2025`
❌ BAD: `Cold Traffic VSL Jan 2025` (spaces break URLs)

### 2. **Track Everything**
Always use UTM parameters on ALL paid ads:
- Facebook Ads ✅
- Google Ads ✅
- TikTok Ads ✅
- Instagram Ads ✅
- YouTube Ads ✅

### 3. **Naming Convention**
```
utm_campaign = {audience}_{offer}_{month}{year}
utm_content = {ad_type}_{variation}

Examples:
- cold_vsl_jan2025
- retarget_7day_jan2025
- lookalike_upsell_feb2025
```

### 4. **Test Multiple Creatives**
Use `utm_content` to track which ad performs best:
```
utm_content=video_hook_1
utm_content=video_hook_2
utm_content=image_testimonial_1
```

---

## 📊 What You'll See in Your Dashboard

Once you launch ads with UTM parameters, your Sales Dashboard will show:

**Traffic Source ROI (Analytics Tab)**:
```
Channel          | Sales | Revenue | Ad Spend | Profit | ROI   | ROAS | CPA
-----------------------------------------------------------------------------
Facebook Ads     | 15    | $555.00 | $300.00  | $231   | 77%   | 1.85 | $20
  ↳ cold_vsl_jan2025        | 10 sales | $370 | $200 | $150 | 75%
  ↳ retarget_7day_jan2025   | 5 sales  | $185 | $100 | $81  | 81%
Google Ads       | 8     | $296.00 | $200.00  | $75    | 37.5% | 1.48 | $25
Direct           | 3     | $111.00 | $0.00    | $107   | ∞     | ∞    | $0
```

**Sales Table**:
Each sale will show:
- Customer email
- Product purchased (Main/$37, Upsell/$17, Downsell/$7)
- Traffic source (Facebook Ads, Google Ads, etc.)
- Campaign name (from utm_campaign)
- Date & time

---

## 🚀 Quick Start for Today

### For Facebook Ads:

**Ad Set 1: Cold Traffic**
```
https://aifastscale.com?utm_source=facebook&utm_medium=cpc&utm_campaign=cold_jan2025&utm_content=vsl_v1
```

**Ad Set 2: Retargeting**
```
https://aifastscale.com?utm_source=facebook&utm_medium=retargeting&utm_campaign=7day_jan2025&utm_content=testimonial_v1
```

### For Google Ads:

**Campaign 1: Search**
```
https://aifastscale.com?utm_source=google&utm_medium=cpc&utm_campaign=search_jan2025&utm_term={keyword}&utm_content=ad1
```

*Note: `{keyword}` is a Google Ads dynamic parameter that auto-fills the actual keyword*

---

## 🔧 UTM Builder Tool (Use This!)

**Online Tool**: https://ga-dev-tools.google/campaign-url-builder/

1. Enter website URL: `https://aifastscale.com`
2. Fill in:
   - Campaign Source: `facebook` or `google`
   - Campaign Medium: `cpc`
   - Campaign Name: Your campaign name
   - Campaign Content: Ad variation name
3. Copy the generated URL
4. Paste into your ad

---

## ✅ Setup Checklist Before Launching Ads

- [ ] All ad links include UTM parameters
- [ ] Campaign names are lowercase with underscores
- [ ] Each ad variation has unique `utm_content`
- [ ] Meta Conversions API access token added (see next section)
- [ ] Test purchase to verify tracking works

---

## 🎯 Next Step: Get Meta Conversions API Token

To complete the setup, you need to get your **Meta Conversions API Access Token**:

### Steps:
1. Go to https://business.facebook.com/events_manager
2. Click on your Pixel: **806502898408304**
3. Click **Settings** tab
4. Scroll to **Conversions API**
5. Click **Generate Access Token**
6. Copy the token (starts with `EAAG...`)
7. Send it to me to add to the system

**Why this matters**: Without this, your server-side tracking won't work and you'll miss 20-30% of conversions due to iOS 14.5 and ad blockers.

---

## 📈 Expected Results

**With This Setup**:
✅ See exactly which campaigns are profitable
✅ Track every sale back to specific ads
✅ Calculate true ROI per campaign
✅ Optimize Facebook Pixel with server-side data
✅ Bypass iOS 14.5 tracking limitations

**Tracking Stack**:
1. ✅ **Meta Pixel** (client-side) - Tracks page views, clicks
2. ✅ **Meta Conversions API** (server-side) - Sends purchases from server
3. ✅ **Google Analytics 4** - Tracks funnel, behavior
4. ✅ **Facebook Ads API** - Pulls ad spend automatically
5. ✅ **Stripe** - Tracks actual revenue
6. ✅ **Sales Dashboard** - Shows everything combined

---

## 🆘 Troubleshooting

**Q: My sales don't show campaign names**
A: You forgot UTM parameters in your ad link

**Q: Dashboard shows "Direct" instead of "Facebook Ads"**
A: Use `utm_source=facebook` in all FB ad links

**Q: Can I change UTM parameters after launching?**
A: Yes, but create a new ad with new UTM. Don't edit running ads.

**Q: Do I need UTM for organic traffic?**
A: No, organic/direct traffic works without UTM. Only use for PAID ads.

---

## 📞 Need Help?

If you have questions about setting up your ad links, just ask! I can generate the exact URLs you need for your campaigns.
