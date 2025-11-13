/**
 * Central configuration file for all constants used throughout the application
 * This ensures consistency and makes updates easier
 */

// ============================================================================
// SITE CONFIGURATION
// ============================================================================

export const SITE_CONFIG = {
  name: 'AI FastScale',
  tagline: '7-Minute AgentClone',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://aifastscale.com',
  supportEmail: 'support@aifastscale.com',
} as const

// ============================================================================
// PRICING CONFIGURATION
// ============================================================================

export const PRICING = {
  current: 37,
  original: 1691,
  currency: 'USD',
  currencySymbol: '$',
  discount: 0.98, // 98% off
  savings: 60, // $60 off messaging
  midnight_price: 97, // Price after midnight
} as const

// ============================================================================
// STRIPE CONFIGURATION
// ============================================================================

export const STRIPE = {
  paymentLink: 'https://buy.stripe.com/dRm3cvfiM8Ms4cA4IK2go01',
  apiUrl: 'https://api.stripe.com',
  checkoutUrl: 'https://buy.stripe.com',
} as const

// ============================================================================
// VIDEO CONFIGURATION
// ============================================================================

export const VIDEO = {
  duration: 265, // 4 minutes 25 seconds
  priceUnlockPercent: 0.924, // 92.4% = 245 seconds
  priceUnlockSeconds: 245,
  milestones: [25, 50, 75], // Percentage milestones for notifications

  // Progress calculation phases
  phases: {
    phase1: { end: 0.15, base: 0, multiplier: 4.67 },
    phase2: { end: 0.38, base: 0.7, multiplier: 0.96 },
    phase3: { end: 0.75, base: 0.92, multiplier: 0.16 },
    phase4: { end: 1.0, base: 0.98, multiplier: 0.08 },
  },
} as const

// ============================================================================
// GOOGLE DRIVE
// ============================================================================

export const GOOGLE_DRIVE = {
  courseMaterialsUrl: 'https://drive.google.com/drive/folders/1YLkKPgtU_q1BV6PVISO4VEru1UkAldw1?usp=sharing',
} as const

// ============================================================================
// TRACKING & ANALYTICS
// ============================================================================

export const TRACKING = {
  ga4: {
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
    adsId: 'AW-17695777512',
  },
  meta: {
    pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
    conversionsApiToken: process.env.META_CONVERSIONS_API_TOKEN || '',
  },
  tiktok: {
    pixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || '',
  },
  clarity: {
    projectId: process.env.NEXT_PUBLIC_CLARITY_ID || '',
  },
} as const

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const API_ROUTES = {
  generateVideo: '/api/generate-video',
  googleSheetsWebhook: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL || '',
} as const

// ============================================================================
// ROUTES & NAVIGATION
// ============================================================================

export const ROUTES = {
  home: '/',
  thankYou: '/thank-you-confirmed',
  tryDemo: '/try-demo',
  blog: '/blog',
  faq: '/faq',

  // Regional pages
  dubai: '/dubai',
  abuDhabi: '/abu-dhabi',
  sharjah: '/sharjah',

  // Legal pages
  privacy: '/privacy-policy',
  terms: '/terms-of-service',
  refund: '/refund-policy',
  disclaimer: '/disclaimer',
} as const

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION = {
  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: 'Please enter a valid email address',
  },
  image: {
    maxSize: 10 * 1024 * 1024, // 10MB
    minSize: 10 * 1024, // 10KB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
  },
  video: {
    script: {
      maxWords: 25,
      maxChars: 200,
    },
  },
} as const

// ============================================================================
// UI CONSTANTS
// ============================================================================

export const UI = {
  scroll: {
    stickyCtaThreshold: 800, // pixels scrolled before showing sticky CTA
  },
  animation: {
    loadDelay: 500, // ms delay before loading below-fold content
    pixelDelay: 10000, // ms delay before loading tracking pixels
  },
  security: {
    disableRightClick: true,
    disableDevTools: true,
    disableF12: true,
  },
} as const

// ============================================================================
// GUARANTEES & POLICIES
// ============================================================================

export const POLICIES = {
  refund: {
    days: 30,
    description: '30-Day Money-Back Guarantee',
  },
  guarantee: {
    agents: 500, // 500+ Happy Agents
    security: 'SSL Encrypted Payment',
  },
} as const

// ============================================================================
// SOCIAL PROOF
// ============================================================================

export const SOCIAL_PROOF = {
  totalAgents: '500+',
  countries: 40,
  videosCreated: '10,000+',
  avgLeadsIncrease: '200%',
} as const

// ============================================================================
// DEMO VIDEO GENERATOR
// ============================================================================

export const DEMO = {
  password: process.env.DEMO_PASSWORD || '',
  video: {
    duration: 8, // seconds
    resolution: '720p',
    aspectRatios: ['9:16', '16:9'] as const,
  },
  generation: {
    maxPollingTime: 7.5 * 60 * 1000, // 7.5 minutes in ms
    pollingInterval: 5000, // 5 seconds
    timeout: 600000, // 10 minutes
  },
} as const

// ============================================================================
// VALUE STACK
// ============================================================================

export const VALUE_STACK = {
  coreProducts: {
    course: 547,
    systemPrompt: 297,
    chatgptSpecialist: 197,
    photoToVideo: 217,
    editTemplates: 376,
  },
  bonuses: {
    brandBlueprint: 197,
    hooks17: 107,
    canvaPack: 147,
  },
  getTotalValue(): number {
    const coreTotal = Object.values(this.coreProducts).reduce((a, b) => a + b, 0)
    const bonusTotal = Object.values(this.bonuses).reduce((a, b) => a + b, 0)
    return coreTotal + bonusTotal
  },
} as const

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURES = {
  emailOptIn: true,
  demoGenerator: true,
  socialProof: true,
  videoProgress: true,
  priceReveal: true,
  countdownTimer: true,
} as const

// ============================================================================
// TELEGRAM (if implemented)
// ============================================================================

export const TELEGRAM = {
  enabled: process.env.TELEGRAM_NOTIFICATIONS_ENABLED === 'true',
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  chatId: process.env.TELEGRAM_CHAT_ID || '',
} as const

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type AspectRatio = typeof DEMO.video.aspectRatios[number]
export type Route = typeof ROUTES[keyof typeof ROUTES]
