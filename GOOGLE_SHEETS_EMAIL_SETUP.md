# Google Sheets Email Collection Setup Guide

## Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: **"AI FastScale - Email Subscribers"**

## Step 2: Set Up Column Headers

In **Row 1**, add these headers:

| A          | B     | C           | D        | E             | F         |
|------------|-------|-------------|----------|---------------|-----------|
| Timestamp  | Email | Name        | Source   | IP Address    | User Agent|

### Column Descriptions:
- **Timestamp**: Automatically captured when form is submitted
- **Email**: Customer's email address
- **Name**: Customer's name (optional, if collected from Stripe)
- **Source**: Where they came from (e.g., "Thank You Page")
- **IP Address**: For fraud detection
- **User Agent**: Browser/device info

## Step 3: Create Google Apps Script Webhook

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete the default code
3. Paste this code:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);

    // Add new row with data
    sheet.appendRow([
      new Date(),                    // Timestamp
      data.email || '',              // Email
      data.name || '',               // Name (optional)
      data.source || 'Thank You Page', // Source
      data.ip || '',                 // IP Address
      data.userAgent || ''           // User Agent
    ]);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        'success': true,
        'message': 'Email added successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        'success': false,
        'message': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** (💾 icon)
5. Click **Deploy** → **New deployment**
6. Click **⚙️ (Settings)** next to "Select type"
7. Choose **Web app**
8. Set these options:
   - **Description**: Email Collection Webhook
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
9. Click **Deploy**
10. **IMPORTANT**: Copy the **Web app URL** (looks like: `https://script.google.com/macros/s/ABC123.../exec`)
11. Save this URL - you'll need it for your website!

## Step 4: Test Your Webhook

Use this curl command to test (replace YOUR_WEBHOOK_URL):

```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","source":"Test"}'
```

Check your Google Sheet - you should see a new row!

## Step 5: Add Webhook URL to Environment Variables

1. Create `.env.local` file in your project root (if not exists)
2. Add this line:

```
NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_ACTUAL_URL/exec
```

3. Restart your dev server: `npm run dev`

## Step 6: Deploy to Production (Vercel)

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Key**: `NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL`
   - **Value**: Your Google Apps Script webhook URL
   - **Environments**: Production, Preview, Development
5. Click **Save**
6. Redeploy your site

## Step 7: Monitor Your Subscribers

Your Google Sheet will automatically update with:
- ✅ Real-time email submissions
- ✅ Timestamp for each submission
- ✅ Source tracking
- ✅ IP & browser info (for security)

## Tips for Email Marketing (Avoid Spam):

### ✅ DO:
- Send from a professional domain (not Gmail)
- Provide value in EVERY email
- Include unsubscribe link
- Send weekly or bi-weekly (not daily!)
- Personalize with their name
- Segment by interest

### ❌ DON'T:
- Buy email lists
- Send from no-reply@
- Use ALL CAPS or excessive !!!
- Send without unsubscribe option
- Spam daily
- Only sell (provide value first)

## Next Steps: Email Marketing Tools

When you reach **100+ subscribers**, migrate to:

1. **ConvertKit** ($29/month) - Best for creators
   - Auto-responders
   - Segmentation
   - A/B testing
   - Built-in landing pages

2. **Mailchimp** (Free up to 500 contacts)
   - Easy to use
   - Templates
   - Basic automation

3. **EmailOctopus** ($8/month)
   - Cheapest option
   - AWS SES integration
   - Good deliverability

## Sample Email Sequence (First 30 Days):

**Day 0 (Immediate):**
- Subject: "Welcome to AI FastScale! Here's your free AI prompts PDF"
- Content: Deliver promised 50 AI Prompts PDF

**Day 3:**
- Subject: "Got your first lead yet? (+ 3 video script templates)"
- Content: Check-in, provide 3 proven video scripts

**Day 7:**
- Subject: "Real Estate Agent Made $8K This Week (Here's How)"
- Content: Case study + tips

**Day 14:**
- Subject: "New: Monthly AI Prompt Pack (February 2025)"
- Content: Fresh prompts for the month

**Day 21:**
- Subject: "Quick question: What's your biggest challenge?"
- Content: Survey to understand their needs

**Day 30:**
- Subject: "Exclusive: Advanced AI Video Course (Early Access)"
- Content: Soft upsell to next product

---

**Questions?** Email support@aifastscale.com
