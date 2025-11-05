# 🎨 AIFastScale Stripe Branding Reference Card

Quick reference for your premium luxury Stripe checkout branding.

---

## 🎯 Brand Colors

### Primary Gold Palette
```
Primary Gold:     #E7B93E  ━━━━━━━━  Main brand color
Light Gold:       #F4D77E  ━━━━━━━━  Highlights & hover states
Dark Gold:        #D4A62E  ━━━━━━━━  Shadows & depth
```

### Supporting Colors
```
Black:            #000000  ━━━━━━━━  Primary background
Deep Black:       #0a0a0a  ━━━━━━━━  Card backgrounds
Dark Gray:        #1a1a1a  ━━━━━━━━  Input fields
White:            #ffffff  ━━━━━━━━  Primary text
```

### Accent Colors
```
Success Green:    #10b981  ━━━━━━━━  Success messages
Error Red:        #ff4444  ━━━━━━━━  Error messages
```

---

## ✍️ Typography

### Primary Font Stack
```
Poppins (Sans-serif) - Body text, UI elements
Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
```

### Secondary Font Stack
```
Playfair Display (Serif) - Headlines, emphasis
Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
```

---

## 🎨 Visual Style Guide

### Gradients
```css
/* Primary Button Gradient */
background: linear-gradient(135deg, #E7B93E 0%, #D4A62E 100%);

/* Hover State */
background: linear-gradient(135deg, #F4D77E 0%, #E7B93E 100%);

/* Gold Badge Gradient */
background: linear-gradient(to right, #E7B93E, #F4D77E, #D4A62E);
```

### Shadows & Glows
```css
/* Gold Glow Effect */
box-shadow: 0 0 30px rgba(231, 185, 62, 0.4),
            0 4px 20px rgba(0, 0, 0, 0.3);

/* Hover Gold Glow */
box-shadow: 0 0 40px rgba(231, 185, 62, 0.6),
            0 6px 30px rgba(0, 0, 0, 0.4);

/* Focus Ring */
box-shadow: 0 0 0 3px rgba(231, 185, 62, 0.15),
            0 0 20px rgba(231, 185, 62, 0.1);
```

### Border Radius
```
Buttons:      12px   (rounded-xl)
Input Fields: 10px   (rounded-lg)
Cards:        16px   (rounded-2xl)
```

---

## 📱 Component Styling Examples

### Button Style
```css
/* Primary CTA Button */
background: linear-gradient(135deg, #E7B93E 0%, #D4A62E 100%);
color: #000000;
font-weight: 600;
font-size: 18px;
padding: 16px 32px;
border-radius: 12px;
box-shadow: 0 0 30px rgba(231, 185, 62, 0.4);
text-transform: uppercase;
letter-spacing: 1px;

/* Hover */
background: linear-gradient(135deg, #F4D77E 0%, #E7B93E 100%);
box-shadow: 0 0 40px rgba(231, 185, 62, 0.6);
transform: translateY(-2px);
```

### Input Field Style
```css
background: #1a1a1a;
border: 1px solid #2a2a2a;
color: #ffffff;
border-radius: 10px;
padding: 14px 16px;

/* Focus */
border-color: #E7B93E;
box-shadow: 0 0 0 3px rgba(231, 185, 62, 0.15);
```

### Card Style
```css
background: #0a0a0a;
border: 1px solid #1f1f1f;
border-radius: 16px;
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8),
            0 0 40px rgba(231, 185, 62, 0.08);
padding: 32px;
```

---

## 🖼️ Layout Specifications

### Spacing System
```
4px   - Tight spacing (icons, badges)
8px   - Small spacing (form fields)
16px  - Medium spacing (card padding)
24px  - Large spacing (section gaps)
32px  - XL spacing (major sections)
```

### Container Widths
```
Checkout Form:    max-width: 600px
Product Card:     max-width: 500px
Full Section:     max-width: 1280px (7xl)
```

---

## ✨ Animation & Transitions

### Transition Timings
```css
/* Standard Transitions */
transition: all 0.3s ease;

/* Quick Interactions */
transition: all 0.2s ease;

/* Smooth Hover */
transition: transform 0.3s ease, box-shadow 0.3s ease;
```

### Hover Effects
```css
/* Button Hover */
transform: translateY(-2px);
box-shadow: increased glow;

/* Input Focus */
border-color: #E7B93E;
glow effect;
```

---

## 📋 Stripe Dashboard Settings

### What to Configure in Stripe Dashboard:

1. **Settings → Branding → Brand elements:**
   - Upload logo (800x200px PNG, transparent)
   - Upload icon (512x512px PNG, transparent)
   - Brand color: `#E7B93E`
   - Accent color: `#D4A62E`

2. **Settings → Branding → Checkout & Payment Links:**
   - Click "Customize" under the preview
   - Add this CSS in the custom CSS box:

   ```css
   @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');

   * {
     font-family: 'Poppins', sans-serif !important;
   }

   h1, h2, h3, h4, h5, h6 {
     font-family: 'Playfair Display', serif !important;
   }
   ```

3. **Settings → Customer emails:**
   - Enable custom emails
   - Use same colors and branding

---

## 🎯 Brand Personality

**Adjectives:** Luxury, Professional, Trustworthy, Premium, Sophisticated, Modern, Elegant

**Mood:** High-end but accessible, exclusive yet welcoming, premium without being pretentious

**Target Feeling:** Customer should feel they're making a smart, premium investment in their business

---

## ✅ Branding Checklist

Use this to verify your branding is consistent:

- [ ] Logo appears correctly on all pages
- [ ] Gold color (#E7B93E) used consistently
- [ ] Poppins font loaded on all pages
- [ ] Playfair Display used for headlines
- [ ] Dark theme (black background) everywhere
- [ ] Gold glow effects on interactive elements
- [ ] Consistent border radius (12-16px)
- [ ] Smooth transitions (0.3s ease)
- [ ] Mobile responsive on all devices
- [ ] High contrast for accessibility

---

## 🔗 Quick Links

- **Stripe Dashboard:** https://dashboard.stripe.com/settings/branding
- **Custom CSS:** Settings → Branding → Checkout & Payment Links → Customize
- **Email Settings:** Settings → Customer emails
- **Test Mode:** Use test cards to preview checkout experience

---

## 📞 Need Help?

If colors look different:
1. Check hex codes match exactly
2. Clear browser cache
3. Use DevTools inspector
4. Verify CSS specificity

If fonts don't load:
1. Check Google Fonts URL
2. Verify font-family names
3. Try font-display: swap
4. Test on multiple browsers

---

**Last Updated:** 2025-11-04
**Brand Version:** 1.0
**Status:** ✅ Production Ready

---

_This branding creates a premium, high-converting checkout experience that builds trust and increases sales._
