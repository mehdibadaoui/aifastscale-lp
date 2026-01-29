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
      id: '', // Add your plan ID
      price: 47.82,
      name: 'CloneYourself Video System',
    },
    // Upsell - Done-For-You Package
    upsell: {
      id: '', // Add your plan ID
      price: 565,
      name: 'Done-For-You Content Package',
    },
    // Downsell - Discounted Package
    downsell: {
      id: '', // Add your plan ID
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
// ADD YOUR WHOP CHECKOUT LINKS BELOW
export const DENTIST_PAYMENT_CONFIG = {
  plans: {
    mainCourse: {
      id: 'plan_chOBDoTBxc7NH',
      price: 47.82,
      name: 'CloneYourself Dentist System',
    },
    upsell: {
      id: 'plan_piIlcIeKKia85',
      price: 9.95,
      name: 'CloneYourself Dentist - Premium Bundle',
    },
    downsell: {
      id: 'plan_fEnYsa70KFAWW',
      price: 4.95,
      name: 'CloneYourself Dentist - Value Bundle',
    },
  },

  // Whop checkout links
  checkoutLinks: {
    main: 'https://whop.com/checkout/plan_chOBDoTBxc7NH',
    upsell: 'https://whop.com/checkout/plan_piIlcIeKKia85',
    downsell: 'https://whop.com/checkout/plan_fEnYsa70KFAWW',
  },

  redirects: {
    thankYou: '/dentists/thank-you',
    upsell: '/dentists/oto',
    downsell: '/dentists/downsell',
  },
} as const
