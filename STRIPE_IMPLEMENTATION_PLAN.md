# 🔷 STRIPE IMPLEMENTATION PLAN - From Scratch

**Created by:** Stripe Developer Expert
**Project:** AI FastScale Landing Page
**Approach:** Clean slate implementation following Stripe best practices

---

## 📋 TABLE OF CONTENTS

1. [Phase 1: Complete Cleanup](#phase-1-complete-cleanup)
2. [Phase 2: Stripe Setup & Configuration](#phase-2-stripe-setup--configuration)
3. [Phase 3: Frontend Implementation](#phase-3-frontend-implementation)
4. [Phase 4: Backend API Implementation](#phase-4-backend-api-implementation)
5. [Phase 5: Webhook Setup](#phase-5-webhook-setup)
6. [Phase 6: Testing & Deployment](#phase-6-testing--deployment)
7. [Phase 7: Production Checklist](#phase-7-production-checklist)

---

## PHASE 1: COMPLETE CLEANUP

### ✅ Files Already Deleted
- `/app/api/create-checkout-session/`
- `/app/api/stripe-webhook/`
- `/app/api/create-oto-payment/`
- `/app/api/create-downsell-payment/`
- `/app/api/upsell-purchase/`
- `/app/api/analytics-roi/`
- `/app/api/get-sales/`
- `/app/sales-dashboard/`
- `/app/thank-you-confirmed/`
- `/app/oto/`
- `/app/downsell/`
- `/app/components/UpsellOffer.tsx`
- `/app/components/ROIDashboard.tsx`
- `/app/components/AdvancedAnalytics.tsx`
- `/app/components/FinalDashboardFeatures.tsx`
- `/app/components/EmailOptInModal.tsx`
- `/app/components/ExitIntentPopup.tsx`
- `/app/components/SocialProofPopup.tsx`
- `/app/utils/stripeAppearance.ts`
- `/app/utils/meta-conversions.ts`
- `/app/utils/tracking.ts`
- `/app/utils/utm-tracking.ts`
- All Stripe documentation files
- NPM packages: `stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js`

### 🔴 Remaining Cleanup Required

#### 1. Update `app/page.tsx`

**Current Issues:**
- Line 44-45: Imports deleted tracking utilities
- Line 463: Hardcoded Stripe checkout URL
- Line 91: `checkoutLoading` state for buttons
- 6 CTA buttons with payment logic

**Action Required:**
```typescript
// REMOVE these imports (lines 44-45):
import { trackFullCTAClick, collectTrackingParams } from './utils/tracking'
import { captureUTMParameters, storeUTMParameters } from './utils/utm-tracking'

// REMOVE SocialProofPopup import and usage (lines 51-56)

// REMOVE checkoutLoading state (line 91)
const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)

// REMOVE handleCTAClick function (line 463):
window.location.href = 'https://buy.stripe.com/dRm3cvfiM8Ms4cA4IK2go01'

// CONVERT CTA buttons to simple placeholders or remove them:
// - hero_cta (line 992)
// - sticky_cta (line 1090)
// - price_unlock_cta (line 1538)
// - mid_page_cta (line 1972)
// - testimonial_cta (line 2191)
// - final_cta (line 2857)
```

#### 2. Clean Up Other Pages

**Files with payment references:**
- `app/refund-policy/page.tsx` - Update to remove Stripe-specific language
- `app/terms-of-service/page.tsx` - Update to remove Stripe-specific language
- `app/privacy-policy/page.tsx` - Update to remove Stripe-specific language
- `app/faq/page.tsx` - Update payment-related FAQs
- `app/try-demo/page.tsx` - Remove any purchase CTAs
- `app/dubai/page.tsx`, `app/abu-dhabi/page.tsx`, `app/sharjah/page.tsx` - Remove payment links

#### 3. Clean Up Layout

**File:** `app/layout.tsx`

Check for:
- Stripe script tags
- Payment-related metadata
- Tracking pixels for payment events

---

## PHASE 2: STRIPE SETUP & CONFIGURATION

### Step 2.1: Create Stripe Account

1. **Sign up at:** https://dashboard.stripe.com/register
2. **Business Type:** Individual / Company (choose appropriate)
3. **Complete onboarding:**
   - Business details
   - Bank account information
   - Identity verification

### Step 2.2: Get API Keys

**Dashboard → Developers → API Keys**

```env
# Test Mode (for development)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Live Mode (for production - get after testing)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE=pk_live_...
STRIPE_SECRET_KEY_LIVE=sk_live_...
```

**Security Notes:**
- Never commit secret keys to git
- Use `.env.local` for development
- Use Vercel environment variables for production

### Step 2.3: Create Products & Prices

**Dashboard → Products → Create Product**

**Product:** AI FastScale - 7-Minute AgentClone Course

1. **Name:** AI FastScale Course
2. **Description:** Learn to create AI videos for real estate in 7 minutes
3. **Pricing Model:** One-time payment
4. **Price:** $37.00 USD
5. **Tax Behavior:** Taxable (or adjust based on jurisdiction)

**Save the Price ID:**
```env
NEXT_PUBLIC_STRIPE_PRICE_ID=price_1Xxx...
```

**Why Permanent Price IDs?**
- Dashboard analytics work properly
- Tax calculations are accurate
- Subscription upgrades possible later
- Easier to track in reports

### Step 2.4: Configure Stripe Dashboard

#### Tax Settings
**Dashboard → Settings → Tax**
- Enable automatic tax calculation (if applicable)
- Set tax registration for your jurisdictions

#### Branding
**Dashboard → Settings → Branding**
- Upload business logo
- Set brand color: `#E7B93E` (gold)
- Business name: AI FastScale
- Support email: `support@aifastscale.com`
- Support phone: Your number

#### Customer Portal (Optional for future)
**Dashboard → Settings → Customer portal**
- Enable customer portal
- Allow cancellations (if subscriptions)
- Allow plan changes

#### Email Notifications
**Dashboard → Settings → Emails**
- Customize receipt emails
- Enable refund confirmations
- Set "from" email address

#### Payment Methods
**Dashboard → Settings → Payment methods**

Enable:
- ✅ Cards (Visa, Mastercard, Amex)
- ✅ Link by Stripe (one-click autofill)
- ✅ Apple Pay / Google Pay (automatic on mobile)

Optional (if targeting international):
- SEPA Direct Debit (Europe)
- iDEAL (Netherlands)
- Klarna (Buy now, pay later)

### Step 2.5: Fraud & Radar Configuration

**Dashboard → Radar → Rules**

**Recommended Rules:**
```
# Allow legitimate traffic
Allow if ::metadata::utm_source:: exists

# Block high-risk
Block if ::risk_score:: > 85 AND ::ip_country:: != ["US", "CA", "GB", "AE"]

# Block disposable emails
Block if ::email_domain:: in ["tempmail.com", "guerrillamail.com", "10minutemail.com"]

# Block suspicious patterns
Block if ::card_funding:: = "prepaid" AND ::risk_score:: > 70

# Block VPN/proxy (optional)
Block if ::ip_address_is_proxy:: = true AND ::risk_score:: > 60
```

**Important:** Don't make rules too strict or you'll block legitimate customers.

---

## PHASE 3: FRONTEND IMPLEMENTATION

### Step 3.1: Install Stripe Libraries

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

**Versions:**
- `@stripe/stripe-js`: ^5.0.0
- `@stripe/react-stripe-js`: ^3.0.0

### Step 3.2: Create Stripe Context

**File:** `app/lib/stripe.ts`

```typescript
import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe with publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export { stripePromise }
```

### Step 3.3: Create Checkout Button Component

**File:** `app/components/CheckoutButton.tsx`

```typescript
'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface CheckoutButtonProps {
  priceId: string
  text?: string
  className?: string
  onSuccess?: () => void
  metadata?: Record<string, string>
}

export default function CheckoutButton({
  priceId,
  text = 'Buy Now - $37',
  className = '',
  metadata = {},
  onSuccess,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)

    try {
      // Call your API to create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          metadata,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment processing failed')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url

      if (onSuccess) onSuccess()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`${className} ${
          loading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Processing...
          </>
        ) : (
          text
        )}
      </button>

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  )
}
```

### Step 3.4: Create Success Page

**File:** `app/success/page.tsx`

```typescript
'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

function SuccessContent() {
  const searchParams = useSearchParams()
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')

    if (sessionId) {
      // Verify the session on your backend
      fetch(`/api/verify-session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setSession(data)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase. You'll receive an email with your course access details shortly.
        </p>

        {session?.customer_email && (
          <p className="text-sm text-gray-500 mb-6">
            Confirmation sent to: <strong>{session.customer_email}</strong>
          </p>
        )}

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition"
          >
            Access Your Course
          </Link>

          <Link
            href="/"
            className="block w-full text-gray-600 hover:text-gray-900 transition"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
```

### Step 3.5: Update Landing Page

**File:** `app/page.tsx`

Replace CTA buttons with:

```typescript
import CheckoutButton from './components/CheckoutButton'

// In your JSX:
<CheckoutButton
  priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!}
  text="Get 100+ Leads - $37"
  className="your-tailwind-classes"
  metadata={{
    source: 'landing_page',
    cta_position: 'hero',
  }}
/>
```

---

## PHASE 4: BACKEND API IMPLEMENTATION

### Step 4.1: Install Server-Side Stripe

```bash
npm install stripe
```

### Step 4.2: Create Checkout Session API

**File:** `app/api/create-checkout-session/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe with API version pinning
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

export async function POST(req: NextRequest) {
  try {
    const { priceId, metadata = {} } = await req.json()

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      )
    }

    // Get base URL from environment or request
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
                    req.headers.get('origin') ||
                    'http://localhost:3000'

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',

      // Success/Cancel URLs
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}?canceled=true`,

      // Customer creation
      customer_creation: 'always',

      // Collect email
      customer_email: undefined, // Let Stripe collect

      // Payment methods
      payment_method_types: ['card'],

      // Metadata for tracking
      metadata: {
        ...metadata,
        environment: process.env.NODE_ENV,
      },

      // Billing info collection
      billing_address_collection: 'auto',

      // Allow promotion codes
      allow_promotion_codes: true,

      // Custom text
      custom_text: {
        submit: {
          message: '🔒 Secure payment • 30-day money-back guarantee',
        },
      },

      // Automatic tax (if configured)
      automatic_tax: {
        enabled: false, // Set to true if you've configured tax
      },

      // Invoice creation
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: 'AI FastScale Course Purchase',
          metadata: {
            order_id: `order_${Date.now()}`,
          },
        },
      },

      // Shipping address collection (if needed)
      // shipping_address_collection: {
      //   allowed_countries: ['US', 'CA', 'GB', 'AE'],
      // },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Stripe checkout error:', err)

    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Key Features:**
- ✅ API version pinned (prevents breaking changes)
- ✅ Customer creation enabled (for future marketing)
- ✅ Invoice creation (for accounting)
- ✅ Promotion codes supported
- ✅ Metadata for tracking
- ✅ Proper error handling

### Step 4.3: Create Session Verification API

**File:** `app/api/verify-session/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Only return necessary data (don't expose sensitive info)
    return NextResponse.json({
      id: session.id,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email,
      amount_total: session.amount_total,
      currency: session.currency,
    })
  } catch (err: any) {
    console.error('Session verification error:', err)

    return NextResponse.json(
      { error: 'Session not found' },
      { status: 404 }
    )
  }
}
```

---

## PHASE 5: WEBHOOK SETUP

### Step 5.1: Create Webhook Handler

**File:** `app/api/webhooks/stripe/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Store processed events to prevent duplicates
const processedEvents = new Set<string>()

export async function POST(req: NextRequest) {
  try {
    // Get the raw body
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')!

    // Verify webhook signature
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Prevent duplicate processing
    if (processedEvents.has(event.id)) {
      console.log('Event already processed:', event.id)
      return NextResponse.json({ received: true })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        console.log('✅ Payment successful:', {
          sessionId: session.id,
          customerId: session.customer,
          email: session.customer_details?.email,
          amount: session.amount_total,
        })

        // TODO: Grant access to course
        // TODO: Send welcome email
        // TODO: Add to CRM/email list
        // TODO: Send notification to admin

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        console.log('❌ Payment failed:', {
          paymentIntentId: paymentIntent.id,
          error: paymentIntent.last_payment_error?.message,
        })

        // TODO: Send failed payment notification
        // TODO: Log for fraud analysis

        break
      }

      case 'customer.created': {
        const customer = event.data.object as Stripe.Customer

        console.log('👤 New customer created:', {
          customerId: customer.id,
          email: customer.email,
        })

        // TODO: Add to CRM

        break
      }

      default:
        console.log('Unhandled event type:', event.type)
    }

    // Mark event as processed
    processedEvents.add(event.id)

    // Clean up old events (prevent memory leak)
    if (processedEvents.size > 1000) {
      const oldestEvents = Array.from(processedEvents).slice(0, 500)
      oldestEvents.forEach((id) => processedEvents.delete(id))
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('Webhook error:', err)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
```

### Step 5.2: Configure Webhook in Stripe

**Development (Local Testing):**

1. Install Stripe CLI:
```bash
brew install stripe/stripe-cli/stripe
```

2. Login to Stripe:
```bash
stripe login
```

3. Forward webhooks to local:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

4. Get webhook secret:
```bash
# Stripe CLI will show: whsec_...
# Add to .env.local:
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Production (Vercel):**

1. Go to: **Dashboard → Developers → Webhooks**

2. Click **Add endpoint**

3. **Endpoint URL:** `https://aifastscale.com/api/webhooks/stripe`

4. **Events to send:**
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
   - `customer.created`
   - `charge.refunded` (if you offer refunds)

5. **Copy webhook secret** → Add to Vercel environment variables

---

## PHASE 6: TESTING & DEPLOYMENT

### Step 6.1: Test Cards

**Use these test cards in test mode:**

| Scenario | Card Number | CVC | Date |
|----------|-------------|-----|------|
| **Success** | 4242 4242 4242 4242 | Any 3 digits | Any future date |
| **Decline (generic)** | 4000 0000 0000 0002 | Any | Any future |
| **Decline (insufficient funds)** | 4000 0000 0000 9995 | Any | Any future |
| **3D Secure required** | 4000 0027 6000 3184 | Any | Any future |
| **Dispute** | 4000 0000 0000 0259 | Any | Any future |

### Step 6.2: Test Checklist

**Local Testing:**
- [ ] Create checkout session
- [ ] Complete payment with test card
- [ ] Verify redirect to success page
- [ ] Check webhook received event
- [ ] Test cancellation flow
- [ ] Test with promotion code
- [ ] Test failed payment (use decline card)
- [ ] Verify invoice creation
- [ ] Check email receipts

**Dashboard Testing:**
- [ ] View payment in Stripe Dashboard
- [ ] Check customer created
- [ ] Verify metadata attached
- [ ] View invoice PDF
- [ ] Test refund flow
- [ ] Check analytics graphs

### Step 6.3: Environment Variables

**File:** `.env.local` (Development)

```env
# Stripe Test Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Product IDs
NEXT_PUBLIC_STRIPE_PRICE_ID=price_1Xxx...

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Vercel Production Variables:**
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (Live)
- STRIPE_SECRET_KEY (Live, Secret)
- STRIPE_WEBHOOK_SECRET (Live, Secret)
- NEXT_PUBLIC_STRIPE_PRICE_ID
- NEXT_PUBLIC_BASE_URL=https://aifastscale.com

### Step 6.4: Deploy to Vercel

```bash
# Commit changes
git add .
git commit -m "Add Stripe payment integration"
git push

# Deploy
vercel --prod
```

**Post-Deployment:**
1. Update webhook URL in Stripe Dashboard
2. Test payment with live card (small amount)
3. Verify webhook received
4. Test refund flow
5. Check Stripe logs for errors

---

## PHASE 7: PRODUCTION CHECKLIST

### Security

- [ ] API keys stored in environment variables (not in code)
- [ ] Webhook signature verification enabled
- [ ] HTTPS enforced on all endpoints
- [ ] Rate limiting implemented (optional)
- [ ] Fraud detection configured (Radar rules)
- [ ] PCI compliance (handled by Stripe)

### Functionality

- [ ] Payment flow works end-to-end
- [ ] Success page displays correctly
- [ ] Emails sent automatically
- [ ] Customer receives invoice
- [ ] Course access granted automatically
- [ ] Refund process documented
- [ ] Support email/phone listed

### Monitoring

- [ ] Stripe Dashboard bookmarked
- [ ] Email notifications enabled (failed payments)
- [ ] Webhook logs monitored
- [ ] Revenue tracking set up
- [ ] Error logging implemented (Sentry/LogRocket)

### Legal

- [ ] Terms of Service updated with payment terms
- [ ] Privacy Policy updated with Stripe data processing
- [ ] Refund Policy clearly stated (30-day guarantee)
- [ ] Contact information for support

### Marketing

- [ ] Conversion tracking implemented (GA4, Meta)
- [ ] UTM parameters captured in metadata
- [ ] Customer email added to CRM
- [ ] Receipt email customized with branding
- [ ] Thank you page optimized

---

## 🎯 SIMPLIFIED 3-STEP QUICK START

If you want to get running quickly:

### Step 1: Stripe Setup (15 minutes)
1. Create Stripe account
2. Get API keys
3. Create $37 product
4. Copy price ID

### Step 2: Code Implementation (30 minutes)
1. Install: `npm install @stripe/stripe-js stripe`
2. Create: `/api/create-checkout-session/route.ts`
3. Create: `/app/components/CheckoutButton.tsx`
4. Add button to landing page

### Step 3: Webhook Setup (10 minutes)
1. Create: `/api/webhooks/stripe/route.ts`
2. Add webhook in Stripe Dashboard
3. Test with test card

**Total Time:** 55 minutes to first payment

---

## 📚 ADDITIONAL RESOURCES

### Stripe Documentation
- API Reference: https://docs.stripe.com/api
- Checkout Session: https://docs.stripe.com/payments/checkout
- Webhooks Guide: https://docs.stripe.com/webhooks
- Testing Guide: https://docs.stripe.com/testing

### Next.js + Stripe
- Official Example: https://github.com/stripe/stripe-demos
- Vercel Template: https://vercel.com/templates/next.js/stripe-payments

### Security Best Practices
- PCI Compliance: https://docs.stripe.com/security
- Radar Rules: https://stripe.com/docs/radar/rules
- Webhook Security: https://docs.stripe.com/webhooks/best-practices

---

## 🔄 NEXT STEPS AFTER BASIC IMPLEMENTATION

### Week 2-4: Enhancements

1. **Add Subscription Support** (recurring revenue)
   - Monthly/annual plans
   - Free trial period
   - Plan upgrades/downgrades

2. **Customer Portal**
   - View invoices
   - Update payment method
   - Download receipts
   - Cancel subscription

3. **Advanced Analytics**
   - Revenue dashboard
   - MRR/ARR tracking
   - Churn analysis
   - Cohort reports

4. **Email Automation**
   - Welcome sequence
   - Course progress emails
   - Re-engagement campaigns
   - Feedback requests

5. **International Support**
   - Multi-currency pricing
   - Local payment methods
   - Automatic tax calculation
   - Localized checkout

---

## ❓ TROUBLESHOOTING

### "Invalid API Key" Error
- Check if using test key in production
- Verify key copied correctly (no spaces)
- Ensure environment variable is set

### Webhook Not Firing
- Verify webhook URL is correct
- Check webhook secret matches
- Look for signature verification errors in logs
- Ensure endpoint returns 200 status

### Payment Declined
- Use correct test cards
- Check if Radar rules are too strict
- Verify amount is above minimum ($0.50)
- Test with different card networks

### Redirect Not Working
- Check success_url is absolute URL
- Verify NEXT_PUBLIC_BASE_URL is set
- Ensure no trailing slashes

---

## 📞 SUPPORT

- **Stripe Support:** https://support.stripe.com
- **Stripe Status:** https://status.stripe.com
- **Community:** https://github.com/stripe/stripe-node/discussions

---

**Document Version:** 1.0
**Last Updated:** 2025-01-13
**Next Review:** After basic implementation complete
