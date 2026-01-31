/**
 * Payment Configuration
 * Configure your payment gateway here
 *
 * This file is a clean slate - add your payment integration credentials
 * and plan IDs when you set up a new payment system.
 */

export const PAYMENT_CONFIG = {
  // Add your plan IDs here when you integrate a payment system
  plans: {
    // Main Course
    mainCourse: {
      id: '', // TODO: Add your plan ID
      price: 47.82,
      name: 'CloneYourself Video System',
    },
    // Upsell - Done-For-You Package
    upsell: {
      id: '', // TODO: Add your plan ID
      price: 565,
      name: 'Done-For-You Content Package',
    },
    // Downsell - Discounted Package
    downsell: {
      id: '', // TODO: Add your plan ID
      price: 395,
      name: 'Done-For-You Content Package (Discounted)',
    },
  },

  // Redirect URLs after purchase
  redirects: {
    thankYou: '/thank-you-confirmed',
    upsell: '/oto',
    downsell: '/downsell',
  },
} as const

// Dentist-specific plan IDs
// ADD YOUR CHECKOUT LINKS BELOW
export const DENTIST_PAYMENT_CONFIG = {
  plans: {
    mainCourse: {
      id: '', // TODO: Add your plan ID
      price: 47.82,
      name: 'CloneYourself Dentist System',
    },
    upsell: {
      id: '', // TODO: Add your plan ID
      price: 9.95,
      name: 'CloneYourself Dentist - Premium Bundle',
    },
    downsell: {
      id: '', // TODO: Add your plan ID
      price: 4.95,
      name: 'CloneYourself Dentist - Value Bundle',
    },
  },

  // Checkout links - Add your payment provider links here
  checkoutLinks: {
    main: '', // TODO: Add your checkout link
    upsell: '', // TODO: Add your checkout link
    downsell: '', // TODO: Add your checkout link
  },

  redirects: {
    thankYou: '/dentists/thank-you',
    upsell: '/dentists/oto',
    downsell: '/dentists/downsell',
  },
} as const
