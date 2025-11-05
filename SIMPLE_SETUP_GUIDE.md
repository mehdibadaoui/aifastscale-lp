# SUPER SIMPLE Google Sheets Setup (5 Minutes)

## What You'll Get:
Every time someone subscribes on your thank-you page, their email will automatically appear in a Google Sheet. That's it!

---

## Step 1: Create Your Google Sheet (1 minute)

1. Go to https://sheets.google.com
2. Click **"Blank"** to create a new spreadsheet
3. Name it: **"AI FastScale - Email Subscribers"** (top left corner)

---

## Step 2: Add Column Headers (30 seconds)

In **Row 1**, type these headers (one per column):

| Column A   | Column B | Column C | Column D      | Column E   | Column F   |
|------------|----------|----------|---------------|------------|------------|
| Timestamp  | Email    | Name     | Source        | IP Address | User Agent |

**That's it!** Your sheet is ready.

---

## Step 3: Copy the Script Code (1 minute)

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. You'll see some default code - **DELETE ALL OF IT**
3. Open the file **"GOOGLE_APPS_SCRIPT_CODE.txt"** (I just created it for you)
4. Copy ALL the code from that file
5. Paste it into Apps Script
6. Click the **💾 Save** icon
7. Name the project: **"Email Webhook"**

---

## Step 4: Deploy the Script (2 minutes)

1. Click **Deploy** → **New deployment**
2. Click the **⚙️ (gear icon)** next to "Select type"
3. Choose **"Web app"**
4. Set these options:
   - **Description**: Email Collection
   - **Execute as**: Me
   - **Who has access**: **Anyone**
5. Click **Deploy**
6. Click **Authorize access** (it will ask you to sign in)
7. Choose your Google account
8. Click **Advanced** → **Go to Email Webhook (unsafe)** → **Allow**
9. **COPY THE WEB APP URL** - it looks like:
   ```
   https://script.google.com/macros/s/ABC123XYZ.../exec
   ```

**SAVE THIS URL!** You'll need it in the next step.

---

## Step 5: Add the URL to Your Website (1 minute)

1. Open the file **.env.local** in your project
2. Find this line:
   ```
   NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/REPLACE_WITH_YOUR_ACTUAL_WEBHOOK_URL/exec
   ```
3. Replace the entire URL with YOUR webhook URL (the one you copied in Step 4)
4. Save the file

Example:
```
NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/ABC123XYZ.../exec
```

---

## Step 6: Add to Production (Vercel) (1 minute)

Run this command in your terminal:

```bash
vercel env add NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL
```

When prompted:
1. Paste your webhook URL
2. Press Enter
3. Select: **Production, Preview, Development** (use space to select all, then Enter)

Then deploy:

```bash
git add .env.local
git commit -m "Add Google Sheets webhook URL"
git push
```

---

## Done! 🎉

Now every time someone subscribes:
- Their email automatically appears in your Google Sheet
- You'll see their name, timestamp, and source
- No manual work required!

---

## Test It:

1. Go to http://localhost:3000/thank-you-confirmed
2. The popup will appear
3. Enter a test email
4. Click "YES, SEND ME FREE TRAINING"
5. Check your Google Sheet - the email should appear instantly!

---

## Need Help?

If you get stuck, just send me a screenshot of where you're stuck and I'll help you!
