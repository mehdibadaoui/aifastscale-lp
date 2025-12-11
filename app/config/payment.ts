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
      price: 37,
      name: 'AgentClone 7-Minute System',
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
// IMPORTANT: Replace these placeholder IDs with your actual Whop plan IDs
export const DENTIST_PAYMENT_CONFIG = {
  plans: {
    mainCourse: {
      id: 'plan_DENTIST_MAIN_37', // REPLACE: Your Whop plan ID for $37 dentist course
      price: 37,
      name: 'CloneYourself Dentist System',
    },
    upsell: {
      id: 'plan_DENTIST_OTO_10', // REPLACE: Your Whop plan ID for $9.95 upsell
      price: 9.95,
      name: 'CloneYourself Dentist - Premium Bundle',
    },
    downsell: {
      id: 'plan_DENTIST_DS_5', // REPLACE: Your Whop plan ID for $4.97 downsell
      price: 4.97,
      name: 'CloneYourself Dentist - Value Bundle',
    },
  },

  // Whop checkout links - REPLACE with your actual Whop links
  checkoutLinks: {
    main: 'https://whop.com/checkout/plan_DENTIST_MAIN_37', // REPLACE with real link
    upsell: 'https://whop.com/checkout/plan_DENTIST_OTO_10', // REPLACE with real link
    downsell: 'https://whop.com/checkout/plan_DENTIST_DS_5', // REPLACE with real link
  },

  redirects: {
    thankYou: '/dentists/thank-you',
    upsell: '/dentists/oto',
    downsell: '/dentists/downsell',
  },
} as const
