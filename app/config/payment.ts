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

// Dentist-specific plan IDs (if different from main)
export const DENTIST_PAYMENT_CONFIG = {
  plans: {
    mainCourse: {
      id: '', // Add your plan ID
      price: 37,
      name: 'CloneYourself Dentist System',
    },
    upsell: {
      id: '', // Add your plan ID
      price: 565,
      name: 'Done-For-You Dental Content Package',
    },
    downsell: {
      id: '', // Add your plan ID
      price: 395,
      name: 'Done-For-You Dental Content Package (Discounted)',
    },
  },

  redirects: {
    thankYou: '/dentists/thank-you',
    upsell: '/dentists/oto',
    downsell: '/dentists/downsell',
  },
} as const
