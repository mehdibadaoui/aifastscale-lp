import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { Redis } from '@upstash/redis'
import { createUser, recordPurchase } from '@/lib/user-db'

// Store user_id -> email mapping in Redis (for lookups when email not in webhook)
async function storeUserIdEmailMapping(userId: string, email: string): Promise<void> {
  try {
    const redis = getRedis()
    await redis.set(`whop:user:${userId}`, email, { ex: 60 * 60 * 24 * 30 }) // 30 days
    console.log(`📝 Stored user mapping: ${userId} -> ${email}`)
  } catch (e) {
    console.error('Failed to store user mapping:', e)
  }
}

// Look up email from our stored mapping
async function lookupStoredEmail(userId: string): Promise<string | null> {
  try {
    const redis = getRedis()
    const email = await redis.get<string>(`whop:user:${userId}`)
    if (email) {
      console.log(`✅ Found stored email for ${userId}: ${email}`)
    }
    return email
  } catch (e) {
    console.error('Failed to lookup stored email:', e)
    return null
  }
}

// Fetch user email - try our stored mapping first, then Whop API as fallback
async function fetchWhopUserEmail(userId: string): Promise<string | null> {
  if (!userId) {
    console.log('❌ Cannot fetch Whop user: missing user ID')
    return null
  }

  // First, try our stored mapping (from previous payment.succeeded events)
  const storedEmail = await lookupStoredEmail(userId)
  if (storedEmail) {
    return storedEmail
  }

  // Fallback: Try Whop API - try all API keys (Flow for plastic surgeons, Ayden for dentist/psychologist/lawyer)
  const apiKeys = [
    process.env.WHOP_API_KEY,
    process.env.WHOP_API_KEY_FLOW,
    process.env.WHOP_API_KEY_AYDEN,
  ].filter(Boolean)

  if (apiKeys.length === 0) {
    console.log('❌ No Whop API keys configured')
    return null
  }

  for (const apiKey of apiKeys) {
    try {
      console.log(`🔍 Fetching from Whop API for user: ${userId}`)
      const response = await fetch(`https://api.whop.com/api/v1/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const userData = await response.json()
        if (userData.email) {
          // Store for future lookups
          await storeUserIdEmailMapping(userId, userData.email)
          return userData.email
        }
      }
    } catch (error) {
      console.error('❌ Whop API error:', error)
    }
  }

  return null
}

// Redis for webhook logging
function getRedis(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) throw new Error('Redis not configured')
  return new Redis({ url, token })
}

// Log webhook to Redis for debugging
async function logWebhook(data: any, status: string) {
  try {
    const redis = getRedis()
    const logEntry = {
      timestamp: new Date().toISOString(),
      status,
      payload: data
    }
    await redis.lpush('webhook:logs', JSON.stringify(logEntry))
    await redis.ltrim('webhook:logs', 0, 49)
  } catch (e) {
    console.error('Failed to log webhook:', e)
  }
}

// Initialize Resend
const getResend = () => new Resend(process.env.RESEND_API_KEY)

// Product configuration - ALL products point to universal /members
const PRODUCTS = {
  dentist: {
    membersUrl: 'https://aifastscale.com/members',
    productName: 'CloneYourself AI Video Mastery',
    price: '47.00',
    accentColor: '#d4af37' // Gold (universal)
  },
  'plastic-surgeon': {
    membersUrl: 'https://aifastscale.com/plastic-surgeons/members',
    productName: 'CloneYourself AI Video Mastery',
    price: '47.82',
    accentColor: '#d4af37'
  },
  'psychologist': {
    membersUrl: 'https://aifastscale.com/members',
    productName: 'CloneYourself AI Video Mastery',
    price: '47.82',
    accentColor: '#d4af37'
  },
  'lawyer': {
    membersUrl: 'https://aifastscale.com/lawyers/members',
    productName: 'CloneYourself AI Video Mastery',
    price: '47.82',
    accentColor: '#d4af37'
  }
}

// Plan IDs and prices - Add your plan IDs here
// TODO: Configure your payment gateway plan IDs
const PLANS = {
  // Dentist products
  DENTIST_MAIN: { id: '', price: 47, type: 'main' as const, product: 'dentist' as const },
  DENTIST_UPSELL: { id: '', price: 9.95, type: 'upsell' as const, product: 'dentist' as const },
  DENTIST_DOWNSELL: { id: '', price: 4.95, type: 'downsell' as const, product: 'dentist' as const },
  // Plastic Surgeon products
  PLASTIC_SURGEON_MAIN: { id: 'plan_OGprA4gd4Lr7N', price: 47.82, type: 'main' as const, product: 'plastic-surgeon' as const },
  PLASTIC_SURGEON_UPSELL: { id: 'plan_c7mDkR3oBXE7n', price: 9.95, type: 'upsell' as const, product: 'plastic-surgeon' as const },
  PLASTIC_SURGEON_DOWNSELL: { id: 'plan_3QGO1WJI50ujP', price: 4.95, type: 'downsell' as const, product: 'plastic-surgeon' as const },
  // Psychologist products
  PSYCHOLOGIST_MAIN: { id: '', price: 47.82, type: 'main' as const, product: 'psychologist' as const },
  PSYCHOLOGIST_UPSELL: { id: '', price: 9.95, type: 'upsell' as const, product: 'psychologist' as const },
  PSYCHOLOGIST_DOWNSELL: { id: '', price: 4.95, type: 'downsell' as const, product: 'psychologist' as const },
  // Lawyer products
  LAWYER_MAIN: { id: 'plan_GpUjd1q7kN6pj', price: 47.82, type: 'main' as const, product: 'lawyer' as const },
  LAWYER_UPSELL: { id: 'plan_97EdLFRTEConC', price: 9.95, type: 'upsell' as const, product: 'lawyer' as const },
  LAWYER_DOWNSELL: { id: 'plan_sdONQXGabaCd0', price: 4.95, type: 'downsell' as const, product: 'lawyer' as const },
}

// Get plan info from plan ID
function getPlanInfo(planId: string): { product: 'dentist' | 'plastic-surgeon' | 'psychologist' | 'lawyer', type: 'main' | 'upsell' | 'downsell', price: number } | null {
  // Dentist plans
  if (planId === PLANS.DENTIST_MAIN.id) return { product: 'dentist', type: 'main', price: PLANS.DENTIST_MAIN.price }
  if (planId === PLANS.DENTIST_UPSELL.id) return { product: 'dentist', type: 'upsell', price: PLANS.DENTIST_UPSELL.price }
  if (planId === PLANS.DENTIST_DOWNSELL.id) return { product: 'dentist', type: 'downsell', price: PLANS.DENTIST_DOWNSELL.price }
  // Plastic Surgeon plans
  if (planId === PLANS.PLASTIC_SURGEON_MAIN.id) return { product: 'plastic-surgeon', type: 'main', price: PLANS.PLASTIC_SURGEON_MAIN.price }
  if (planId === PLANS.PLASTIC_SURGEON_UPSELL.id) return { product: 'plastic-surgeon', type: 'upsell', price: PLANS.PLASTIC_SURGEON_UPSELL.price }
  if (planId === PLANS.PLASTIC_SURGEON_DOWNSELL.id) return { product: 'plastic-surgeon', type: 'downsell', price: PLANS.PLASTIC_SURGEON_DOWNSELL.price }
  // Psychologist plans
  if (planId === PLANS.PSYCHOLOGIST_MAIN.id) return { product: 'psychologist', type: 'main', price: PLANS.PSYCHOLOGIST_MAIN.price }
  if (planId === PLANS.PSYCHOLOGIST_UPSELL.id) return { product: 'psychologist', type: 'upsell', price: PLANS.PSYCHOLOGIST_UPSELL.price }
  if (planId === PLANS.PSYCHOLOGIST_DOWNSELL.id) return { product: 'psychologist', type: 'downsell', price: PLANS.PSYCHOLOGIST_DOWNSELL.price }
  // Lawyer plans
  if (planId === PLANS.LAWYER_MAIN.id) return { product: 'lawyer', type: 'main', price: PLANS.LAWYER_MAIN.price }
  if (planId === PLANS.LAWYER_UPSELL.id) return { product: 'lawyer', type: 'upsell', price: PLANS.LAWYER_UPSELL.price }
  if (planId === PLANS.LAWYER_DOWNSELL.id) return { product: 'lawyer', type: 'downsell', price: PLANS.LAWYER_DOWNSELL.price }
  return null
}

// Determine product type from webhook data (for main course only - backward compatibility)
// ROBUST VERSION - checks multiple paths and patterns
function getProductType(fullData: any, productData: any): 'dentist' | 'plastic-surgeon' | 'psychologist' | 'lawyer' | null {
  // Collect ALL possible name sources from the webhook
  const possibleNames = [
    productData?.name,
    productData?.title,
    fullData?.product?.name,
    fullData?.product?.title,
    fullData?.plan?.name,
    fullData?.plan?.title,
    fullData?.membership?.product?.name,
    fullData?.name,
    fullData?.title,
  ].filter(Boolean).map(n => n.toLowerCase())

  // Collect ALL possible plan IDs
  const possiblePlanIds = [
    productData?.plan_id,
    productData?.id,
    fullData?.plan?.id,
    fullData?.product?.plan_id,
    fullData?.plan_id,
    fullData?.membership?.plan_id,
  ].filter(Boolean)

  // Get price for detection fallback
  const price = productData?.price || fullData?.price || fullData?.amount || 0
  const priceNum = typeof price === 'string' ? parseFloat(price) : price

  console.log(`🔍 Product detection - Names found: ${JSON.stringify(possibleNames)}`)
  console.log(`🔍 Product detection - Plan IDs found: ${JSON.stringify(possiblePlanIds)}`)
  console.log(`🔍 Product detection - Price: ${priceNum}`)

  // Check known plan IDs first
  for (const planId of possiblePlanIds) {
    const planInfo = getPlanInfo(planId)
    if (planInfo) {
      console.log(`✅ Matched plan ID: ${planId} -> ${planInfo.product} (${planInfo.type})`)
      return planInfo.type === 'main' ? planInfo.product : null
    }
  }

  // Check names for lawyer keywords (check first, most specific)
  const lawyerKeywords = ['lawyer', 'attorney', 'law firm', 'legal', 'esq', 'counsel', 'solicitor', 'barrister']
  for (const name of possibleNames) {
    for (const keyword of lawyerKeywords) {
      if (name.includes(keyword)) {
        console.log(`✅ Matched lawyer by name: "${name}" contains "${keyword}"`)
        return 'lawyer'
      }
    }
  }

  // Check names for psychologist keywords
  const psychologistKeywords = ['psychologist', 'therapist', 'mental health', 'counselor', 'psychology', 'therapy']
  for (const name of possibleNames) {
    for (const keyword of psychologistKeywords) {
      if (name.includes(keyword)) {
        console.log(`✅ Matched psychologist by name: "${name}" contains "${keyword}"`)
        return 'psychologist'
      }
    }
  }

  // Check names for plastic surgeon keywords
  const plasticSurgeonKeywords = ['plastic surgeon', 'plastic surgery', 'cosmetic surgeon', 'aesthetic surgeon', 'cosmetic surgery']
  for (const name of possibleNames) {
    for (const keyword of plasticSurgeonKeywords) {
      if (name.includes(keyword)) {
        console.log(`✅ Matched plastic-surgeon by name: "${name}" contains "${keyword}"`)
        return 'plastic-surgeon'
      }
    }
  }

  // Check names for dentist keywords
  const dentistKeywords = ['dentist', 'clone yourself - dentist', 'dental', 'dr.', 'doctor']
  for (const name of possibleNames) {
    for (const keyword of dentistKeywords) {
      if (name.includes(keyword)) {
        console.log(`✅ Matched dentist by name: "${name}" contains "${keyword}"`)
        return 'dentist'
      }
    }
  }

  // Price-based fallback detection
  if (priceNum >= 95 && priceNum <= 100) {
    console.log(`✅ Matched plastic-surgeon by price: $${priceNum} (in $95-100 range)`)
    return 'plastic-surgeon'
  }
  if (priceNum >= 45 && priceNum <= 50) {
    console.log(`✅ Matched dentist by price: $${priceNum} (in $45-50 range)`)
    return 'dentist'
  }

  console.log(`❌ No product match found`)
  return null
}

// Generate VIP welcome email with personalized password
// UNIVERSAL VERSION - same premium branding for all customers
function generateWelcomeEmail(
  product: typeof PRODUCTS.dentist,
  userPassword: string,
  userEmail: string,
  buyerName?: string,
  productType?: 'dentist' | 'plastic-surgeon' | 'psychologist' | 'lawyer'
) {
  const firstName = buyerName ? buyerName.split(' ')[0] : ''

  // Universal premium branding - Gold color palette
  const accent = '#d4af37' // Gold
  const buttonColor = '#d4af37'
  const glowColor = 'rgba(212, 175, 55, 0.08)'

  // Universal social proof
  const socialProof = 'Trusted by <strong style="color: ' + accent + ';">+25,000 professionals</strong> worldwide'

  const darkBg = '#09090b'
  const cardBg = '#18181b'
  const cardBorder = '#27272a'
  const textWhite = '#fafafa'
  const textGray = '#a1a1aa'
  const textMuted = '#71717a'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to the Club</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${darkBg};">

  <!-- Preview text -->
  <div style="display: none; max-height: 0; overflow: hidden;">
    ${firstName ? firstName + ', your' : 'Your'} exclusive access is ready. Password: ${userPassword}
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${darkBg}; padding: 48px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 460px;">

          <!-- VIP Badge -->
          <tr>
            <td style="text-align: center; padding-bottom: 32px;">
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: ${cardBg}; border: 1px solid ${accent}; border-radius: 100px; padding: 10px 24px;">
                    <span style="color: ${accent}; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">★ VIP MEMBER ACCESS ★</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${cardBg}; border-radius: 20px; border: 1px solid ${cardBorder}; box-shadow: 0 0 60px ${glowColor};">

                <!-- Welcome Header -->
                <tr>
                  <td style="padding: 40px 32px 32px 32px; text-align: center;">
                    <p style="margin: 0 0 16px 0; color: ${accent}; font-size: 14px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">
                      You're In
                    </p>
                    <h1 style="margin: 0 0 12px 0; color: ${textWhite}; font-size: 28px; font-weight: 800; line-height: 1.2;">
                      ${firstName ? `Welcome, ${firstName}` : 'Welcome'}
                    </h1>
                    <p style="margin: 0; color: ${textGray}; font-size: 15px;">
                      Your exclusive access to <strong style="color: ${textWhite};">${product.productName}</strong> is now active.
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding: 0 32px;">
                    <div style="height: 1px; background: linear-gradient(90deg, transparent, ${accent}, transparent);"></div>
                  </td>
                </tr>

                <!-- LOGIN CREDENTIALS SECTION -->
                <tr>
                  <td style="padding: 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f0f11; border-radius: 16px; border: 1px solid ${cardBorder};">
                      <tr>
                        <td style="padding: 28px; text-align: center;">
                          <p style="margin: 0 0 20px 0; color: ${accent}; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
                            Your Personal Login
                          </p>

                          <!-- Email -->
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                            <tr>
                              <td style="background-color: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 10px; padding: 14px 16px; text-align: left;">
                                <p style="margin: 0 0 4px 0; color: ${textMuted}; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Email</p>
                                <p style="margin: 0; color: ${textWhite}; font-size: 15px; font-weight: 600; text-decoration: none;">
                                  <span style="color: ${textWhite}; text-decoration: none;">${userEmail}</span>
                                </p>
                              </td>
                            </tr>
                          </table>

                          <!-- Password -->
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="background-color: ${cardBg}; border: 2px solid ${accent}; border-radius: 12px; padding: 20px; text-align: center;">
                                <p style="margin: 0 0 10px 0; color: ${textMuted}; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Password</p>
                                <p style="margin: 0; color: ${textWhite}; font-size: 22px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; letter-spacing: 0.5px;">
                                  ${userPassword}
                                </p>
                                <p style="margin: 12px 0 0 0; color: ${textMuted}; font-size: 11px;">
                                  📋 Hold to copy on mobile
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                  <td style="padding: 0 32px 32px 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color: ${buttonColor}; border-radius: 12px; text-align: center;">
                          <a href="${product.membersUrl}?email=${encodeURIComponent(userEmail)}&password=${encodeURIComponent(userPassword)}" style="display: block; padding: 20px 24px; color: ${textWhite}; text-decoration: none; font-size: 16px; font-weight: 700; letter-spacing: 0.5px;">
                            ENTER MEMBERS AREA →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Quick Start -->
                <tr>
                  <td style="padding: 0 32px 32px 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 6px 0; color: ${textGray}; font-size: 14px;">
                          <span style="color: ${accent}; font-weight: 600;">1</span><span style="color: ${cardBorder}; margin: 0 12px;">—</span>Click "Enter Members Area"
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: ${textGray}; font-size: 14px;">
                          <span style="color: ${accent}; font-weight: 600;">2</span><span style="color: ${cardBorder}; margin: 0 12px;">—</span>Enter your email & password
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: ${textGray}; font-size: 14px;">
                          <span style="color: ${accent}; font-weight: 600;">3</span><span style="color: ${cardBorder}; margin: 0 12px;">—</span>Start creating AI videos!
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding: 0 32px;">
                    <div style="height: 1px; background-color: ${cardBorder};"></div>
                  </td>
                </tr>

                <!-- VIP Benefits -->
                <tr>
                  <td style="padding: 32px;">
                    <p style="margin: 0 0 16px 0; color: ${accent}; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
                      Your VIP Benefits
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; color: ${textGray}; font-size: 14px;">
                          <span style="color: ${accent};">✦</span><span style="margin-left: 12px;">Complete video training library</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: ${textGray}; font-size: 14px;">
                          <span style="color: ${accent};">✦</span><span style="margin-left: 12px;">Premium templates & scripts</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: ${textGray}; font-size: 14px;">
                          <span style="color: ${accent};">✦</span><span style="margin-left: 12px;">Lifetime access — no recurring fees</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: ${textGray}; font-size: 14px;">
                          <span style="color: ${accent};">✦</span><span style="margin-left: 12px;">All future updates included free</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Social Proof -->
          <tr>
            <td style="padding: 24px 0; text-align: center;">
              <p style="margin: 0; color: ${textMuted}; font-size: 13px;">
                ${socialProof}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="text-align: center; padding-bottom: 20px;">
              <p style="margin: 0 0 8px 0; color: ${textMuted}; font-size: 12px;">
                Questions? Simply reply to this email.
              </p>
              <p style="margin: 0; color: ${cardBorder}; font-size: 11px;">
                © ${new Date().getFullYear()} CloneYourself
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const timestamp = new Date().toISOString()

    // LOG TO REDIS FOR DEBUGGING
    await logWebhook(body, 'RECEIVED')

    // DETAILED LOGGING FOR DEBUGGING
    console.log('═══════════════════════════════════════════════════════════')
    console.log(`🔔 WHOP WEBHOOK RECEIVED @ ${timestamp}`)
    console.log('═══════════════════════════════════════════════════════════')
    console.log('Full payload:', JSON.stringify(body, null, 2))

    const action = body.action || body.event || body.type || ''
    const data = body.data || body

    console.log(`📋 Action/Type: ${action || '(none - Whop sends event type via endpoint)'}`)

    // Check if this looks like a valid purchase webhook
    // Whop sends event type as the endpoint itself, not always in payload
    // So we check: if there's user.email, it's likely a real purchase
    const hasUserEmail = data?.user?.email || data?.customer?.email || data?.email || data?.buyer?.email

    // If there's an action/type field, validate it
    if (action) {
      const validActions = ['payment', 'membership', 'sale', 'invoice_paid', 'invoice_created', 'succeeded', 'created']
      const isValidAction = validActions.some(valid => action.toLowerCase().includes(valid))

      // Skip clearly non-payment events (like membership.canceled, etc.)
      const skipActions = ['canceled', 'cancelled', 'deleted', 'failed', 'refund']
      const shouldSkip = skipActions.some(skip => action.toLowerCase().includes(skip))

      if (shouldSkip) {
        console.log(`⏭️ SKIPPED: Non-payment action "${action}"`)
        await logWebhook({ action, reason: 'non-payment action' }, 'SKIPPED')
        return NextResponse.json({ received: true, processed: false })
      }
    }

    // Extract buyer info with logging
    let buyerEmail = data?.user?.email ||
                     data?.customer?.email ||
                     data?.email ||
                     data?.buyer?.email

    const buyerName = data?.user?.name ||
                      data?.customer?.name ||
                      data?.buyer?.name ||
                      data?.user?.username || ''

    // Get user ID for mapping storage
    const userId = data?.user?.id || data?.customer?.id || data?.member?.user_id

    // If we have email AND user_id, store the mapping for future lookups
    if (buyerEmail && userId) {
      await storeUserIdEmailMapping(userId, buyerEmail)
    }

    // If no email in payload, try to fetch from our stored mapping or Whop API
    if (!buyerEmail && userId) {
      console.log(`⚠️ No email in payload, looking up for user: ${userId}`)
      const fetchedEmail = await fetchWhopUserEmail(userId)
      if (fetchedEmail) {
        buyerEmail = fetchedEmail
        console.log(`✅ Successfully found email: ${buyerEmail}`)
      }
    }

    console.log(`👤 Buyer Email: ${buyerEmail || 'NOT FOUND'}`)
    console.log(`👤 Buyer Name: ${buyerName || 'NOT FOUND'}`)

    if (!buyerEmail) {
      console.error('❌ ERROR: No buyer email found in webhook or via Whop API')
      await logWebhook({ reason: 'no user email (even after API lookup)' }, 'SKIPPED')
      return NextResponse.json({ received: true, processed: false, reason: 'No email found' })
    }

    // Get plan ID with detailed logging
    const planId = data?.plan?.id || data?.product?.plan_id || data?.plan_id || ''
    console.log(`📦 Plan ID: ${planId || 'NOT FOUND'}`)
    console.log(`📦 Plan paths checked: data.plan.id="${data?.plan?.id}", data.product.plan_id="${data?.product?.plan_id}", data.plan_id="${data?.plan_id}"`)

    // Check if this is an upsell/downsell (no email, just record purchase)
    const planInfo = getPlanInfo(planId)
    console.log(`📊 Plan Info: ${planInfo ? JSON.stringify(planInfo) : 'NO MATCH - will check product name'}`)
    if (planInfo && (planInfo.type === 'upsell' || planInfo.type === 'downsell')) {
      // Record the upsell/downsell purchase (for internal tracking only, NOT Meta)
      await recordPurchase(buyerEmail, planInfo.type, planInfo.price, planId)
      console.log(`✅ Recorded ${planInfo.type} ($${planInfo.price}) for ${buyerEmail}`)

      // NOTE: Upsell/downsell only records revenue, no user creation or email

      return NextResponse.json({
        success: true,
        type: planInfo.type,
        amount: planInfo.price,
        email: buyerEmail,
        purchase_recorded: true
      })
    }

    // Determine product type (main course only)
    const productData = data?.product || data?.plan || data
    console.log(`🔍 Product data for type detection:`, JSON.stringify(productData, null, 2))

    const productType = getProductType(data, productData)
    console.log(`🏷️ Determined product type: ${productType || 'UNKNOWN'}`)

    if (!productType) {
      console.log('⚠️ WARNING: Unknown product type - user NOT created')
      console.log('Product name checked:', productData?.name?.toLowerCase() || 'NO NAME')
      console.log('This purchase will NOT receive login credentials!')
      return NextResponse.json({ received: true, processed: false, warning: 'Unknown product type' })
    }

    const product = PRODUCTS[productType]

    // Create user in database with unique password
    const createResult = await createUser({
      email: buyerEmail,
      name: buyerName,
      planId: planId,
      product: productType
    })

    if (!createResult.success || !createResult.password) {
      console.error('Failed to create user:', createResult.error)
      return NextResponse.json({
        received: true,
        warning: 'User creation failed, manual setup may be needed',
        error: createResult.error
      })
    }

    const userPassword = createResult.password

    // Store credentials in Redis for thank-you page instant lookup
    // This allows the thank-you page to show credentials without waiting for email
    try {
      const redis = getRedis()
      const credentialsData = JSON.stringify({
        email: buyerEmail,
        password: userPassword,
        name: buyerName || '',
        product: productType,
        created: Date.now()
      })
      // Store by email (primary lookup) - 2 hour TTL
      await redis.set(`thankyou:${buyerEmail.toLowerCase()}`, credentialsData, { ex: 7200 })
      // Store by user_id if available (backup lookup)
      if (userId) {
        await redis.set(`thankyou:user:${userId}`, credentialsData, { ex: 7200 })
      }
      console.log(`📝 Stored thank-you credentials for ${buyerEmail}`)
    } catch (e) {
      console.error('Failed to store thank-you credentials (non-blocking):', e)
    }

    // Record main course purchase with revenue
    let mainPrice = 47.82 // Default price
    if (productType === 'dentist') mainPrice = 47.82
    await recordPurchase(buyerEmail, 'main', mainPrice, planId)

    // Send welcome email with personalized credentials
    const resend = getResend()

    await resend.emails.send({
      from: 'CloneYourself <hello@mail.aifastscale.com>',
      replyTo: 'support@aifastscale.com',
      to: buyerEmail,
      subject: `🎉 Your ${product.productName} Login Details - Save This Email!`,
      html: generateWelcomeEmail(product, userPassword, buyerEmail, buyerName, productType),
    })

    console.log(`✅ Welcome email sent to ${buyerEmail} with unique password`)

    console.log('═══════════════════════════════════════════════════════════')
    console.log(`✅ SUCCESS: ${buyerEmail} - User created & email sent!`)
    console.log(`💰 Revenue: $${mainPrice} | Product: ${productType}`)
    console.log('═══════════════════════════════════════════════════════════')

    await logWebhook({ email: buyerEmail, product: productType, revenue: mainPrice }, 'SUCCESS')

    return NextResponse.json({
      success: true,
      email_sent: true,
      recipient: buyerEmail,
      user_created: true,
      purchase_tracked: true,
      revenue_recorded: mainPrice
    })

  } catch (error: any) {
    console.error('═══════════════════════════════════════════════════════════')
    console.error('❌ WEBHOOK ERROR:', error.message || error)
    console.error('Stack:', error.stack)
    console.error('═══════════════════════════════════════════════════════════')
    await logWebhook({ error: error.message, stack: error.stack }, 'ERROR')
    return NextResponse.json({
      received: true,
      error: error.message || 'Webhook processing failed'
    })
  }
}

// Handle GET for webhook verification
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'Whop webhook endpoint active',
    version: '2.0-personalized-login',
    timestamp: new Date().toISOString()
  })
}
