# Google Sheet Email Collection Upgrade Guide

## Goal
Modify the Google Sheet to capture valuable business data instead of technical data.

---

## PART 1: Update Google Sheet Column Headers

### Current Columns (Row 1):
```
Timestamp | Email | Name | Source | IP Address | User Agent
```

### NEW Columns (Row 1):
```
Timestamp | Email | Name | Country | Product Purchased | Upsell Purchased | Payment Method
```

### Column Descriptions:
- **Timestamp**: When they subscribed (keep this)
- **Email**: Customer email (keep this)
- **Name**: Customer name (keep this)
- **Country**: Customer's country (NEW)
- **Product Purchased**: "Course Only" or "Course + Upsell" (NEW)
- **Upsell Purchased**: "None", "$17 Blueprint", or "$7 Blueprint" (NEW)
- **Payment Method**: "Card", "Apple Pay", "Google Pay", etc. (NEW)

### Action Required:
1. Open your Google Sheet: "AI FastScale - Email Subscribers"
2. **Delete columns D, E, F** (Source, IP Address, User Agent)
3. **Add these NEW column headers in Row 1:**
   - Column D: `Country`
   - Column E: `Product Purchased`
   - Column F: `Upsell Purchased`
   - Column G: `Payment Method`

---

## PART 2: Update Google Apps Script Code

### Location:
https://script.google.com → Your "Untitled project" → Code.gs

### Instructions:
1. Click **Extensions** → **Apps Script** in your Google Sheet
2. **Delete ALL existing code**
3. **Paste this NEW code:**

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);

    // Add new row with updated columns
    sheet.appendRow([
      new Date(),                           // Timestamp
      data.email || '',                     // Email
      data.name || '',                      // Name (optional)
      data.country || 'Unknown',            // Country (NEW)
      data.productPurchased || 'Course Only', // Product Purchased (NEW)
      data.upsellPurchased || 'None',       // Upsell Purchased (NEW)
      data.paymentMethod || 'Card'          // Payment Method (NEW)
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

// Handle OPTIONS requests for CORS preflight
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({'status': 'ready'}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Click **💾 Save**
5. Click **Deploy** → **Manage deployments**
6. Click **✏️ Edit** (pencil icon)
7. Click **Deploy**
8. **IMPORTANT**: Copy the new Web app URL if it changed
9. If the URL changed, update it in your `.env.local` file

---

## PART 3: Update Website Code to Send New Data

### File to Modify:
`/Users/a1111/aifastscale-lp/app/components/EmailOptInModal.tsx`

### Find this code (around line 59-65):

```typescript
const data = {
  email: email.trim().toLowerCase(),
  name: name.trim() || 'Not provided',
  source: 'Thank You Page - VIP List Popup',
  ip: '',
  userAgent: navigator.userAgent,
}
```

### Replace it with this NEW code:

```typescript
// Get upsell info from URL params (passed from thank-you page)
const urlParams = new URLSearchParams(window.location.search)
const upsell = urlParams.get('upsell')

// Determine product purchased and upsell info
let productPurchased = 'Course Only'
let upsellPurchased = 'None'

if (upsell === 'blueprint17') {
  productPurchased = 'Course + $17 Blueprint'
  upsellPurchased = '$17 Blueprint'
} else if (upsell === 'blueprint7') {
  productPurchased = 'Course + $7 Blueprint'
  upsellPurchased = '$7 Blueprint'
}

// Get country from browser (approximate via timezone)
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
const country = getCountryFromTimezone(timezone)

const data = {
  email: email.trim().toLowerCase(),
  name: name.trim() || 'Not provided',
  country: country,
  productPurchased: productPurchased,
  upsellPurchased: upsellPurchased,
  paymentMethod: 'Card', // Default to Card (Stripe doesn't expose this easily)
}
```

### Add this helper function at the TOP of the file (after imports, before the component):

```typescript
// Helper function to get country from timezone
function getCountryFromTimezone(timezone: string): string {
  // Map common timezones to countries
  const timezoneMap: { [key: string]: string } = {
    'Asia/Dubai': 'UAE',
    'Asia/Riyadh': 'Saudi Arabia',
    'Asia/Kuwait': 'Kuwait',
    'Asia/Qatar': 'Qatar',
    'Asia/Bahrain': 'Bahrain',
    'Europe/London': 'UK',
    'America/New_York': 'USA',
    'America/Los_Angeles': 'USA',
    'America/Chicago': 'USA',
    'Europe/Paris': 'France',
    'Europe/Berlin': 'Germany',
    'Asia/Singapore': 'Singapore',
    'Australia/Sydney': 'Australia',
    'Asia/Tokyo': 'Japan',
    'Asia/Shanghai': 'China',
    'Asia/Hong_Kong': 'Hong Kong',
    'Europe/Istanbul': 'Turkey',
    'Africa/Cairo': 'Egypt',
    'Asia/Karachi': 'Pakistan',
    'Asia/Kolkata': 'India',
  }

  // Check if we have a direct match
  if (timezoneMap[timezone]) {
    return timezoneMap[timezone]
  }

  // Extract region from timezone (e.g., "Europe" from "Europe/Madrid")
  const region = timezone.split('/')[0]
  return region || 'Unknown'
}
```

---

## PART 4: Pass Upsell Data via URL

### File to Modify:
`/Users/a1111/aifastscale-lp/app/thank-you-confirmed/page.tsx`

### Find this code (around line 344):

```typescript
<EmailOptInModal
  isOpen={showEmailModal}
  onClose={() => setShowEmailModal(false)}
/>
```

### This is already correct! The upsell data is available via URL params, so no changes needed here.

---

## PART 5: Testing

### Test the new setup:

1. **Clear existing test data** from your Google Sheet (delete Row 2 if it has test data)

2. **Test on localhost:**
   - Go to: `http://localhost:3000/thank-you-confirmed?upsell=blueprint17`
   - Fill the email form
   - Submit

3. **Check Google Sheet** - you should see:
   - Timestamp: Current date/time
   - Email: Your test email
   - Name: Your test name
   - Country: Your country (based on timezone)
   - Product Purchased: "Course + $17 Blueprint"
   - Upsell Purchased: "$17 Blueprint"
   - Payment Method: "Card"

4. **Test without upsell:**
   - Go to: `http://localhost:3000/thank-you-confirmed`
   - Fill and submit
   - Should show: "Course Only" and "None"

5. **Test $7 upsell:**
   - Go to: `http://localhost:3000/thank-you-confirmed?upsell=blueprint7`
   - Fill and submit
   - Should show: "Course + $7 Blueprint" and "$7 Blueprint"

---

## PART 6: Deploy to Production

After testing successfully:

```bash
git add app/components/EmailOptInModal.tsx
git commit -m "Update email collection with business data (country, product, upsell)"
git push
```

Wait 1-2 minutes for Vercel to deploy, then test on your live site.

---

## Summary of Changes:

### REMOVED:
- ❌ Source (always "Thank You Page")
- ❌ IP Address (not useful)
- ❌ User Agent (technical, not useful)

### ADDED:
- ✅ Country (based on timezone)
- ✅ Product Purchased (Course Only vs Course + Upsell)
- ✅ Upsell Purchased (None, $17 Blueprint, $7 Blueprint)
- ✅ Payment Method (Card by default)

---

## Note About Payment Method:

Stripe doesn't expose the payment method (Apple Pay, Google Pay, Card) to the frontend for security reasons. To get this data, you'd need to:

1. Set up a Stripe webhook
2. Listen for `checkout.session.completed` event
3. Store the payment method in a database
4. Match it to the email later

This requires backend setup. For now, we're defaulting to "Card" since that's the most common method.

If you want to implement payment method tracking later, let me know!

---

## Expected Google Sheet Format:

| Timestamp | Email | Name | Country | Product Purchased | Upsell Purchased | Payment Method |
|-----------|-------|------|---------|-------------------|------------------|----------------|
| 11/5/2025 20:24 | customer@email.com | John Doe | UAE | Course + $17 Blueprint | $17 Blueprint | Card |
| 11/5/2025 20:30 | another@email.com | Jane Smith | USA | Course Only | None | Card |
| 11/5/2025 20:35 | buyer@email.com | Ahmed Ali | Saudi Arabia | Course + $7 Blueprint | $7 Blueprint | Card |

---

## Questions or Issues?

If something doesn't work:
1. Check that the Google Apps Script code is saved and deployed
2. Check that the new column headers are correct in Row 1
3. Check browser console for errors
4. Verify the webhook URL hasn't changed

Good luck! 🚀
