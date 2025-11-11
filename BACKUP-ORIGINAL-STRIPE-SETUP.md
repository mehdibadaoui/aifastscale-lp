# ORIGINAL STRIPE SETUP - DO NOT DELETE
## Save this file to restore the exact setup later

### Original Flow:
1. Homepage → Stripe Checkout ($37 main product)
2. After payment → Thank You page with upsell popup
3. Upsell flow:
   - First offer: $17 blueprint upsell
   - If declined: $7 downsell
   - If accepted: Thank you page

### Files Used:
- `/app/api/create-checkout-session/route.ts` - Main checkout creation
- `/app/api/create-oto-payment/route.ts` - $17 upsell
- `/app/api/create-downsell-payment/route.ts` - $7 downsell
- `/app/api/upsell-purchase/route.ts` - 1-click upsell processing
- `/app/thank-you-confirmed/page.tsx` - Thank you page with upsell popup

### Stripe Products:
- Main: `price_1SQqXk00rcGKJTDag08UZ8T5` ($37)
- Upsell: `price_1SQALaBCEDBlhdGK7XTC87HD` ($17)
- Downsell: `price_1SQAKrBCEDBlhdGK0U3TfDWK` ($7)

### Homepage Button:
- Triggers: `createCheckoutSession()` function
- Creates Stripe session via API
- Redirects to Stripe hosted checkout

### To Restore:
Tell me: "Restore the exact Stripe upsell/downsell structure from backup"
I will:
1. Re-enable the original checkout button code
2. Re-enable upsell popup on thank you page
3. Re-enable all 3 payment flows
4. Test everything works exactly as before
