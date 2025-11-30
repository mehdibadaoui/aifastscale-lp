// Whop Configuration
// API Key: apik_5I4iYWtjxHXj3_C3816808_0d897f14aaf8b062a7df7e2f31f022d33453593193559aa064e5daf8d0e0e2fd
// Webhook Secret: ws_6605b0e8bccbc3747f8b14198fada8ca8934d03dcf83006ff789966024c50564
// Webhook Hook ID: hook_6dLA0ExwCuJ8S

export const WHOP_CONFIG = {
  // Plan IDs
  plans: {
    // Main Course - $37
    mainCourse: {
      id: 'plan_7x5Kz1cflmrYH',
      price: 37,
      name: 'AgentClone 7-Minute System',
      checkoutUrl: 'https://whop.com/checkout/plan_7x5Kz1cflmrYH',
    },
    // Upsell/OTO - Higher tier offer
    upsell: {
      id: 'plan_R3FywBSQynds0',
      price: 97, // Adjust based on your actual upsell price
      name: 'AgentClone Pro Bundle',
      checkoutUrl: 'https://whop.com/checkout/plan_R3FywBSQynds0',
    },
    // Downsell - Lower tier offer for those who decline upsell
    downsell: {
      id: 'plan_plZSk0NMKNZJj',
      price: 27, // Adjust based on your actual downsell price
      name: 'AgentClone Lite',
      checkoutUrl: 'https://whop.com/checkout/plan_plZSk0NMKNZJj',
    },
  },

  // Redirect URLs after purchase
  redirects: {
    thankYou: 'https://aifastscale.com/thank-you',
    upsell: 'https://aifastscale.com/oto',
    downsell: 'https://aifastscale.com/downsell',
    membersArea: 'https://whop.com/agentclone',
  },

  // Theme settings for embedded checkout
  theme: {
    mode: 'dark' as const,
    accentColor: 'gold' as const,
  },
} as const

// Helper to get plan by type
export type PlanType = 'mainCourse' | 'upsell' | 'downsell'

export function getPlan(type: PlanType) {
  return WHOP_CONFIG.plans[type]
}
