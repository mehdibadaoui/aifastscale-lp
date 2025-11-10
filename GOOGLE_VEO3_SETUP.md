# Google Veo 3 API Setup Guide

## 🎯 What You Need

To make the demo page work, you need to set up Google Cloud and get API access to Veo 3.

## 📋 Step-by-Step Setup

### 1. Create Google Cloud Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Accept terms and create a new project
4. Name it something like "AgentClone-Demo"

### 2. Enable Billing

**IMPORTANT:** Veo 3 requires billing to be enabled (it's a compute-heavy API)

1. Go to **Billing** in the left menu
2. Click **Link a billing account**
3. Add your payment method
4. Don't worry - you'll only pay for what you use

**Estimated costs:**
- ~$0.10 - $0.50 per video (depending on length/quality)
- You can set budget alerts to avoid surprises

### 3. Enable Vertex AI API

1. Go to **APIs & Services** → **Library**
2. Search for "Vertex AI API"
3. Click **Enable**
4. Wait for it to activate (takes 1-2 minutes)

### 4. Request Veo 3 Access (If Needed)

Veo 3 might be in preview/allowlist:

1. Go to [Google AI for Developers](https://ai.google.dev/)
2. Look for Veo 3 access request form
3. Fill it out (mention you're building a real estate AI video tool)
4. Wait for approval (usually 1-3 days)

**Alternative:** If Veo 3 is not available yet, you can use:
- Imagen Video (Google's other video model)
- Or temporarily use HeyGen/D-ID API (I can switch the code)

### 5. Get Your API Key

**Option A: Service Account (Recommended for Production)**

1. Go to **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
3. Name: "veo3-demo-api"
4. Grant role: **Vertex AI User**
5. Click **Create Key** → **JSON**
6. Download the JSON file

**Option B: API Key (Easier for Testing)**

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API Key**
3. Copy the API key
4. Click **Restrict Key** → Select **Vertex AI API**

### 6. Add Environment Variables

Add these to your `.env.local` file:

```bash
# Google Cloud / Veo 3 API
GOOGLE_CLOUD_API_KEY=your_api_key_here
GOOGLE_CLOUD_PROJECT_ID=your_project_id_here
```

**To find your Project ID:**
- It's at the top of Google Cloud Console
- Or in the downloaded JSON file (if using service account)

### 7. Test the API

1. Restart your dev server: `npm run dev`
2. Go to: http://localhost:3000/try-demo
3. Upload a photo
4. Click "Generate My Video"
5. Wait 30-90 seconds
6. Video should appear!

## 🚨 Troubleshooting

### "API authentication failed"
- Check your API key is correct in `.env.local`
- Make sure you enabled Vertex AI API
- Restart your dev server

### "Video generation failed"
- Veo 3 might not be available in your region yet
- Try requesting access through Google AI
- Consider using HeyGen API temporarily (let me know and I'll switch it)

### "Too many requests"
- Google has rate limits
- Wait a few minutes and try again
- Consider adding a queue system (I can build this)

## 💰 Cost Management

**Set up budget alerts:**
1. Go to **Billing** → **Budgets & alerts**
2. Create budget: $10/month (adjust as needed)
3. Set alert at 50%, 90%, 100%
4. You'll get email notifications

**Estimated monthly costs for 100 demo videos:**
- 100 videos × $0.30 avg = ~$30/month
- If you get lots of traffic, consider:
  - Rate limiting (1 video per user per day)
  - Caching popular results
  - Using cheaper alternatives for demos

## 🎨 Alternative APIs (If Veo 3 Not Available)

If Veo 3 is not accessible yet, I can switch the code to use:

### Option 1: HeyGen API ($$$)
- **Pros:** Best quality, very realistic
- **Cons:** More expensive (~$0.50/video)
- **Setup:** 10 minutes

### Option 2: D-ID API ($$)
- **Pros:** Good quality, faster
- **Cons:** Medium pricing (~$0.30/video)
- **Setup:** 5 minutes

### Option 3: Replicate (Wav2Lip) ($)
- **Pros:** Cheap (~$0.05/video)
- **Cons:** Lower quality
- **Setup:** 15 minutes

**Just let me know which one you want and I'll update the code!**

## 📊 Monitoring Usage

**Check your usage:**
1. Go to **Billing** → **Reports**
2. Filter by **Vertex AI**
3. See costs per day/week/month

## ✅ Final Checklist

Before going live:

- [ ] Google Cloud account created
- [ ] Billing enabled with budget alerts
- [ ] Vertex AI API enabled
- [ ] Veo 3 access granted (or alternative API chosen)
- [ ] API key added to `.env.local`
- [ ] Tested demo page locally
- [ ] Deployed to Vercel with environment variables
- [ ] Set rate limits (optional but recommended)

## 🚀 Ready to Deploy?

Once everything works locally:

1. Go to Vercel dashboard
2. Settings → Environment Variables
3. Add:
   - `GOOGLE_CLOUD_API_KEY`
   - `GOOGLE_CLOUD_PROJECT_ID`
4. Redeploy

Your demo page will be live at: `https://aifastscale.com/try-demo`

---

## Need Help?

If you get stuck:
1. Check the API response in browser console (F12)
2. Check server logs: `vercel logs`
3. Let me know and I'll help debug!
