/**
 * Premium Luxury Stripe Checkout Branding
 * Matches AIFastScale's Black & Gold Brand Identity
 */

import { Appearance } from '@stripe/stripe-js';

export const premiumStripeAppearance: Appearance = {
  theme: 'night', // Dark theme base

  variables: {
    // Brand Colors - Luxury Gold & Black
    colorPrimary: '#E7B93E',           // Primary gold
    colorBackground: '#0a0a0a',        // Deep black background
    colorText: '#ffffff',              // Pure white text
    colorDanger: '#ff4444',            // Error red
    colorSuccess: '#10b981',           // Success green

    // Typography - Premium Fonts
    fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSizeBase: '16px',
    fontSizeSm: '14px',
    fontSizeXs: '12px',
    fontWeightLight: '300',
    fontWeightNormal: '400',
    fontWeightMedium: '500',
    fontWeightBold: '600',

    // Spacing - Generous & Luxurious
    spacingUnit: '4px',
    borderRadius: '12px',

    // Input Fields
    colorTextSecondary: '#d1d5db',     // Light gray for labels
    colorTextPlaceholder: '#6b7280',   // Medium gray for placeholders

    // Focus States - Gold Glow
    focusBoxShadow: '0 0 0 3px rgba(231, 185, 62, 0.15)',
    focusOutline: '2px solid #E7B93E',
  },

  rules: {
    // Main container styling
    '.Container': {
      backgroundColor: '#000000',
      border: '1px solid #1f1f1f',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(231, 185, 62, 0.08)',
      padding: '32px',
    },

    // Header styling
    '.Header': {
      borderBottom: '1px solid #1f1f1f',
      paddingBottom: '20px',
      marginBottom: '24px',
    },

    '.HeaderText': {
      color: '#ffffff',
      fontSize: '24px',
      fontWeight: '600',
      fontFamily: '"Playfair Display", serif',
    },

    // Tab styling (for saved payment methods)
    '.Tab': {
      backgroundColor: '#1a1a1a',
      border: '1px solid #2a2a2a',
      color: '#d1d5db',
      borderRadius: '10px',
      padding: '12px 20px',
      transition: 'all 0.3s ease',
    },

    '.Tab:hover': {
      backgroundColor: '#252525',
      borderColor: '#E7B93E',
      color: '#E7B93E',
      boxShadow: '0 0 20px rgba(231, 185, 62, 0.15)',
    },

    '.Tab--selected': {
      backgroundColor: 'rgba(231, 185, 62, 0.1)',
      borderColor: '#E7B93E',
      color: '#E7B93E',
      boxShadow: '0 0 20px rgba(231, 185, 62, 0.2)',
    },

    // Input fields
    '.Input': {
      backgroundColor: '#1a1a1a',
      border: '1px solid #2a2a2a',
      color: '#ffffff',
      borderRadius: '10px',
      padding: '14px 16px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
    },

    '.Input:hover': {
      borderColor: '#3a3a3a',
      backgroundColor: '#1f1f1f',
    },

    '.Input:focus': {
      backgroundColor: '#1f1f1f',
      borderColor: '#E7B93E',
      boxShadow: '0 0 0 3px rgba(231, 185, 62, 0.15), 0 0 20px rgba(231, 185, 62, 0.1)',
      outline: 'none',
    },

    '.Input::placeholder': {
      color: '#6b7280',
    },

    '.Input--invalid': {
      borderColor: '#ff4444',
      boxShadow: '0 0 0 3px rgba(255, 68, 68, 0.15)',
    },

    // Labels
    '.Label': {
      color: '#d1d5db',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '8px',
      letterSpacing: '0.3px',
    },

    // Error messages
    '.Error': {
      color: '#ff4444',
      fontSize: '13px',
      marginTop: '6px',
      fontWeight: '400',
    },

    // Submit button - Premium Gold Gradient
    '.Button': {
      backgroundColor: 'transparent',
      backgroundImage: 'linear-gradient(135deg, #E7B93E 0%, #D4A62E 100%)',
      color: '#000000',
      fontSize: '18px',
      fontWeight: '600',
      padding: '16px 32px',
      borderRadius: '12px',
      border: 'none',
      boxShadow: '0 0 30px rgba(231, 185, 62, 0.4), 0 4px 20px rgba(0, 0, 0, 0.3)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },

    '.Button:hover': {
      backgroundImage: 'linear-gradient(135deg, #F4D77E 0%, #E7B93E 100%)',
      boxShadow: '0 0 40px rgba(231, 185, 62, 0.6), 0 6px 30px rgba(0, 0, 0, 0.4)',
      transform: 'translateY(-2px)',
    },

    '.Button:active': {
      transform: 'translateY(0px)',
      boxShadow: '0 0 25px rgba(231, 185, 62, 0.5)',
    },

    '.Button:disabled': {
      opacity: '0.5',
      cursor: 'not-allowed',
      backgroundImage: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
      boxShadow: 'none',
    },

    // Checkbox styling
    '.Checkbox': {
      borderColor: '#2a2a2a',
      backgroundColor: '#1a1a1a',
    },

    '.Checkbox--checked': {
      backgroundColor: '#E7B93E',
      borderColor: '#E7B93E',
    },

    // Payment method icons
    '.PaymentMethodIcon': {
      filter: 'brightness(1.2)',
    },

    // Link styling
    '.Link': {
      color: '#E7B93E',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'all 0.2s ease',
    },

    '.Link:hover': {
      color: '#F4D77E',
      textDecoration: 'underline',
    },

    // Terms and legal text
    '.TermsText': {
      color: '#9ca3af',
      fontSize: '13px',
      lineHeight: '1.6',
    },

    // Divider
    '.Divider': {
      backgroundColor: '#1f1f1f',
      height: '1px',
      margin: '24px 0',
    },

    // Loading spinner
    '.Spinner': {
      borderColor: 'rgba(231, 185, 62, 0.2)',
      borderTopColor: '#E7B93E',
    },

    // Success checkmark
    '.SuccessIcon': {
      color: '#10b981',
    },

    // Product/Price summary
    '.Block': {
      backgroundColor: '#1a1a1a',
      border: '1px solid #2a2a2a',
      borderRadius: '10px',
      padding: '16px',
    },

    '.Text': {
      color: '#ffffff',
    },

    '.Text--subdued': {
      color: '#9ca3af',
    },
  },
};

/**
 * Business Information for Stripe Branding Settings
 * (Configure this in your Stripe Dashboard > Settings > Branding)
 */
export const stripeBrandingConfig = {
  // Colors (Dashboard Settings)
  brandColor: '#E7B93E',      // Primary gold color
  accentColor: '#D4A62E',     // Darker gold for accents

  // Logo & Icon
  // Upload in: Stripe Dashboard > Settings > Branding > Brand elements
  logoUrl: 'https://aifastscale.com/logo.png',  // Replace with your actual logo URL
  iconUrl: 'https://aifastscale.com/icon.png',  // Replace with your actual icon URL

  // Business Details
  businessName: 'AIFastScale',
  supportEmail: 'support@aifastscale.com',
  supportPhone: '+971-XX-XXX-XXXX',  // Add your support phone

  // Custom Domain (for Payment Links & Checkout)
  // Set up in: Stripe Dashboard > Settings > Branding > Custom domain
  customDomain: 'checkout.aifastscale.com',  // Optional: for white-label checkout
};

/**
 * Usage Example:
 *
 * import { loadStripe } from '@stripe/stripe-js';
 * import { premiumStripeAppearance } from './utils/stripeAppearance';
 *
 * const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
 *
 * const { error } = await stripe.confirmPayment({
 *   elements,
 *   confirmParams: {
 *     return_url: 'https://aifastscale.com/thank-you-confirmed',
 *   },
 *   appearance: premiumStripeAppearance, // Apply custom branding
 * });
 */
