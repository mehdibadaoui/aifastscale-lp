# Whop Compliance Checklist for Velon LLC

## CRITICAL: Read This File Before Launching Any New Project

This document contains all compliance requirements to prevent Whop account suspensions, payment holds, and legal issues.

---

## Company Information (FROM OFFICIAL LLC DOCUMENTS)

| Field | Value |
|-------|-------|
| **Legal Entity Name** | Velon LLC |
| **Entity Type** | Wyoming Limited Liability Company |
| **State of Formation** | Wyoming |
| **Filed Date** | October 24, 2025 |
| **State Filing ID** | 2025-001798721 |
| **Registered Agent** | Registered Agents Inc |
| **Business Address** | 30 N Gould St Ste R, Sheridan, WY 82801 |
| **Owner/Organizer** | Mohammed Elmehdi Badaoui |
| **Support Email** | support@aifastscale.com |
| **Product Price** | $47.82 USD (one-time) |
| **Upsell Price** | $9.95 USD (one-time) |
| **Downsell Price** | $4.95 USD (one-time) |

---

## What Whop's AI/Robot Checks For (AVOID THESE RED FLAGS)

### 1. ENTITY VERIFICATION
- [ ] Legal entity name matches LLC documents EXACTLY
- [ ] Business address is real (not fake/placeholder)
- [ ] Contact info is real and working
- [ ] Entity type is correctly stated (LLC, not Inc, Corp, etc.)
- [ ] State of formation is correct (Wyoming)

### 2. PRICING CONSISTENCY
- [ ] Price on sales page matches checkout price EXACTLY
- [ ] Price in Terms of Service matches actual price
- [ ] Price in Refund Policy matches actual price
- [ ] No misleading "was $997, now $47" without proof
- [ ] Currency clearly stated (USD)

### 3. PRODUCT DESCRIPTION MATCH
- [ ] ToS product description matches what's sold on sales page
- [ ] Product name is consistent across all pages
- [ ] Features listed match what's actually delivered
- [ ] Target audience matches (lawyers page says lawyers, not "real estate agents")

### 4. REQUIRED LEGAL PAGES (Must all exist and be linked)
- [ ] Terms of Service (/terms-of-service)
- [ ] Privacy Policy (/privacy-policy)
- [ ] Refund Policy (/refund-policy)
- [ ] Disclaimer (/disclaimer) - especially for income claims
- [ ] All pages accessible from footer

### 5. FTC COMPLIANCE (Income Claims)
- [ ] Earnings disclaimer on any page with income claims
- [ ] "Results not typical" near testimonials
- [ ] No guaranteed income promises
- [ ] Testimonial disclosure statement

### 6. PROFESSIONAL COMPLIANCE (Industry-Specific)
For LAWYERS:
- [ ] Attorney advertising disclaimer
- [ ] State bar compliance notice
- [ ] "Not legal advice" disclaimer

For MEDICAL (Dentists, Plastic Surgeons, Psychologists):
- [ ] "Not medical advice" disclaimer
- [ ] Professional licensing compliance notice
- [ ] HIPAA considerations mentioned

### 7. REFUND POLICY
- [ ] Clear refund timeframe (30 days)
- [ ] Process explained (email support@...)
- [ ] Matches what's set in Whop dashboard
- [ ] No contradictory statements

### 8. PAYMENT PROCESSING TRANSPARENCY
- [ ] Payment processor mentioned (Whop)
- [ ] PCI-DSS compliance mentioned
- [ ] Clear statement: "We don't store your card info"
- [ ] One-time payment clearly stated (no hidden subscriptions)

### 9. CONTACT INFORMATION
- [ ] Real email address (support@aifastscale.com)
- [ ] Real business address (Wyoming registered agent OK)
- [ ] NO fake phone numbers (555-xxx-xxxx)
- [ ] Response time stated (24-48 hours)

### 10. DELIVERY INFORMATION
- [ ] Digital product clearly stated
- [ ] Instant access mentioned
- [ ] How access is delivered (email, login)
- [ ] No physical shipping claims

---

## Required Footer Text (Copy to ALL Landing Pages)

```html
<!-- COMPLIANCE FOOTER - REQUIRED ON ALL PAGES -->
<footer>
  <!-- Wyoming LLC Identification -->
  <p>Velon LLC, a Wyoming Limited Liability Company</p>
  <p>30 N Gould St Ste R, Sheridan, WY 82801</p>

  <!-- Copyright -->
  <p>© {YEAR} Velon LLC. All rights reserved.</p>

  <!-- Legal Links -->
  <a href="/privacy-policy">Privacy Policy</a>
  <a href="/terms-of-service">Terms of Service</a>
  <a href="/refund-policy">Refund Policy</a>
  <a href="/disclaimer">Disclaimer</a>

  <!-- Earnings Disclaimer (if income claims on page) -->
  <p>EARNINGS DISCLAIMER: Results shown are not typical. Individual results vary based on effort, experience, and market conditions. We make no guarantees regarding income or results.</p>

  <!-- Professional Disclaimer (customize per industry) -->
  <p>This product is for educational purposes only. Users must ensure compliance with their professional licensing requirements and regulations.</p>
</footer>
```

---

## Required Disclaimer Text Near Testimonials

```
*Testimonials reflect individual experiences and are not guaranteed results. Individual results vary significantly based on effort, market conditions, and other factors. See our full disclaimer for details.
```

---

## Terms of Service - Key Sections That MUST Match

1. **Company Name**: "Velon LLC, a Wyoming Limited Liability Company"
2. **Product Name**: "CloneYourself Video System"
3. **Price**: "$47.82 USD" (or "prices displayed at checkout")
4. **Refund Period**: "30 days"
5. **Governing Law**: "State of Wyoming"
6. **Contact**: "support@aifastscale.com"

---

## Whop Dashboard Settings (Must Match Website)

| Setting | Value |
|---------|-------|
| Business Name | Velon LLC |
| Product Price | $47.82 |
| Refund Policy | 30 days |
| Delivery Method | Digital/Instant |
| Support Email | support@aifastscale.com |

---

## Common Whop Suspension Triggers (AVOID THESE)

1. **Mismatch between website and Whop settings**
   - Fix: Ensure all prices, names, policies match exactly

2. **Missing or incomplete legal pages**
   - Fix: All 4 legal pages must exist and be linked

3. **Fake/placeholder contact info**
   - Fix: Use real email, real address (registered agent is fine)

4. **Misleading income claims without disclaimers**
   - Fix: Add FTC-compliant earnings disclaimer

5. **Product description mismatch**
   - Fix: ToS must describe actual product being sold

6. **Wrong entity name**
   - Fix: Use exact LLC name from formation documents

7. **High refund/chargeback rate**
   - Fix: Clear refund policy, good customer service

8. **Suspicious pricing patterns**
   - Fix: Consistent pricing, no bait-and-switch

---

## Pre-Launch Checklist (Do Before Going Live)

- [ ] All 4 legal pages updated with Velon LLC info
- [ ] Footer on ALL pages shows Velon LLC
- [ ] Price is $47.82 everywhere (or matches Whop)
- [ ] Earnings disclaimer added to sales pages
- [ ] Testimonial disclosure added
- [ ] Professional compliance disclaimer added
- [ ] Contact email is real and working
- [ ] Whop dashboard matches website
- [ ] Test purchase flow works
- [ ] Webhook is configured and working

---

## Files That Need Compliance Updates

### Legal Pages (CRITICAL)
- `/app/terms-of-service/page.tsx`
- `/app/privacy-policy/page.tsx`
- `/app/refund-policy/page.tsx`
- `/app/disclaimer/page.tsx`

### Landing Pages (Add footer + disclaimers)
- `/app/lawyers/page.tsx`
- `/app/dentists/page.tsx`
- `/app/psychologists/page.tsx`
- `/app/plastic-surgeons/page.tsx`

### Upsell/Downsell Pages (Check pricing)
- `/app/*/upsell/page.tsx`
- `/app/*/downsell/page.tsx`

### Thank You Pages
- `/app/*/thank-you/page.tsx`

---

## Quick Reference: Entity Information Block

Use this exact text in all legal pages:

```
Velon LLC
A Wyoming Limited Liability Company
30 N Gould St Ste R
Sheridan, WY 82801
Email: support@aifastscale.com
```

---

## Version History

| Date | Changes |
|------|---------|
| 2026-01-29 | Initial compliance setup - Fixed from "AI FastScale LLC" to "Velon LLC" |

---

## Notes

- LLC was filed on October 24, 2025
- Always use "Velon LLC" - never "AI FastScale LLC" in legal docs
- "AI FastScale" can be used as a brand/DBA but legal entity is Velon LLC
- Wyoming governing law provides favorable LLC protections
- Registered agent address is acceptable for business address on website
