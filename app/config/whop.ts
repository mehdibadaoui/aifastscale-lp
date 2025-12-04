// Whop Configuration
// API credentials are stored in environment variables (not in code)
// WHOP_API_KEY, WHOP_WEBHOOK_SECRET in .env.local

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
    // Upsell Pack 1 - Done-For-You 6 Month Package (72 videos)
    upsell: {
      id: 'plan_0fbyyZAq8n1yI',
      price: 565.20,
      pricePerVideo: 7.85,
      totalVideos: 72,
      months: 6,
      videosPerWeek: 3,
      name: 'Done-For-You 6 Month Content',
      checkoutUrl: 'https://whop.com/checkout/plan_0fbyyZAq8n1yI',
    },
    // Upsell Pack 2 - Done-For-You 3 Month Package (24 videos)
    upsellLite: {
      id: 'plan_gdD4gop6sejQG',
      price: 295,
      pricePerVideo: 12.29,
      totalVideos: 24,
      months: 3,
      videosPerWeek: 2,
      name: 'Done-For-You 3 Month Content',
      checkoutUrl: 'https://whop.com/checkout/plan_gdD4gop6sejQG',
    },
    // Downsell 6 Months - $395 (30% off from $565)
    downsell6month: {
      id: 'plan_zzn3Y7w2G5NQq',
      price: 395,
      pricePerVideo: 5.49,
      totalVideos: 72,
      months: 6,
      videosPerWeek: 3,
      name: 'Done-For-You 6 Month Content (Downsell)',
      checkoutUrl: 'https://whop.com/checkout/plan_zzn3Y7w2G5NQq',
    },
    // Downsell 3 Months - $195 (34% off from $295)
    downsell3month: {
      id: 'plan_kBs0C47hTeNS7',
      price: 195,
      pricePerVideo: 8.13,
      totalVideos: 24,
      months: 3,
      videosPerWeek: 2,
      name: 'Done-For-You 3 Month Content (Downsell)',
      checkoutUrl: 'https://whop.com/checkout/plan_kBs0C47hTeNS7',
    },
  },

  // Redirect URLs after purchase (configured in Whop dashboard)
  redirects: {
    thankYou: 'https://aifastscale.com/thank-you-confirmed',
    upsell: 'https://aifastscale.com/upsell',
    downsell: 'https://aifastscale.com/downsell-final',
    membersArea: 'https://whop.com/agentclone',
  },

  // Theme settings for embedded checkout
  theme: {
    mode: 'light' as const,
    accentColor: 'gold' as const,
  },
} as const
