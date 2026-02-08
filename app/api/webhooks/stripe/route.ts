import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'
import { Redis } from '@upstash/redis'
import { createUser, recordPurchase } from '@/lib/user-db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

function getRedis(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) throw new Error('Redis not configured')
  return new Redis({ url, token })
}

const getResend = () => new Resend(process.env.RESEND_API_KEY)

// Product configuration - ALL products use universal /members
const PRODUCTS: Record<string, { membersUrl: string; productName: string; price: string; accentColor: string }> = {
  dentist: {
    membersUrl: 'https://aifastscale.com/members',
    productName: 'CloneYourself AI Video Mastery',
    price: '47.82',
    accentColor: '#d4af37'
  },
  'plastic-surgeon': {
    membersUrl: 'https://aifastscale.com/plastic-surgeons/members',
    productName: 'CloneYourself AI Video Mastery',
    price: '47.82',
    accentColor: '#d4af37'
  },
  psychologist: {
    membersUrl: 'https://aifastscale.com/members',
    productName: 'CloneYourself AI Video Mastery',
    price: '47.82',
    accentColor: '#d4af37'
  },
  lawyer: {
    membersUrl: 'https://aifastscale.com/members',
    productName: 'CloneYourself AI Video Mastery',
    price: '47.82',
    accentColor: '#d4af37'
  },
  dermatologist: {
    membersUrl: 'https://aifastscale.com/members',
    productName: 'CloneYourself AI Video Mastery',
    price: '47.82',
    accentColor: '#d4af37'
  }
}

// Detect niche from product/price name
function detectNiche(name: string): string | null {
  const lower = name.toLowerCase()
  if (lower.includes('lawyer') || lower.includes('attorney') || lower.includes('legal')) return 'lawyer'
  if (lower.includes('dermatolog') || lower.includes('derm')) return 'dermatologist'
  if (lower.includes('psycholog') || lower.includes('therapist') || lower.includes('mental')) return 'psychologist'
  if (lower.includes('plastic') || lower.includes('cosmetic') || lower.includes('aesthetic')) return 'plastic-surgeon'
  if (lower.includes('dentist') || lower.includes('dental')) return 'dentist'
  return null
}

// Detect purchase type from amount (in cents)
function detectType(amountCents: number): { type: 'main' | 'upsell' | 'downsell'; price: number } {
  if (amountCents >= 900 && amountCents <= 1100) return { type: 'upsell', price: 9.95 }
  if (amountCents >= 400 && amountCents <= 600) return { type: 'downsell', price: 4.95 }
  return { type: 'main', price: amountCents / 100 }
}

// Log webhook to Redis for debugging
async function logWebhook(data: any, status: string) {
  try {
    const redis = getRedis()
    const logEntry = { timestamp: new Date().toISOString(), status, source: 'stripe', payload: data }
    await redis.lpush('webhook:logs', JSON.stringify(logEntry))
    await redis.ltrim('webhook:logs', 0, 49)
  } catch (e) {
    console.error('Failed to log webhook:', e)
  }
}

// Generate premium welcome email
function generateWelcomeEmail(
  product: typeof PRODUCTS.dentist,
  userPassword: string,
  userEmail: string,
  buyerName?: string,
) {
  const firstName = buyerName ? buyerName.split(' ')[0] : ''
  const accent = '#d4af37'
  const buttonColor = '#d4af37'
  const glowColor = 'rgba(212, 175, 55, 0.08)'
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
  <div style="display: none; max-height: 0; overflow: hidden;">
    ${firstName ? firstName + ', your' : 'Your'} exclusive access is ready. Password: ${userPassword}
  </div>
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${darkBg}; padding: 48px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 460px;">
          <tr>
            <td style="text-align: center; padding-bottom: 32px;">
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: ${cardBg}; border: 1px solid ${accent}; border-radius: 100px; padding: 10px 24px;">
                    <span style="color: ${accent}; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">&#9733; VIP MEMBER ACCESS &#9733;</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${cardBg}; border-radius: 20px; border: 1px solid ${cardBorder}; box-shadow: 0 0 60px ${glowColor};">
                <tr>
                  <td style="padding: 40px 32px 32px 32px; text-align: center;">
                    <p style="margin: 0 0 16px 0; color: ${accent}; font-size: 14px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">You're In</p>
                    <h1 style="margin: 0 0 12px 0; color: ${textWhite}; font-size: 28px; font-weight: 800; line-height: 1.2;">
                      ${firstName ? `Welcome, ${firstName}` : 'Welcome'}
                    </h1>
                    <p style="margin: 0; color: ${textGray}; font-size: 15px;">
                      Your exclusive access to <strong style="color: ${textWhite};">${product.productName}</strong> is now active.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 32px;">
                    <div style="height: 1px; background: linear-gradient(90deg, transparent, ${accent}, transparent);"></div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f0f11; border-radius: 16px; border: 1px solid ${cardBorder};">
                      <tr>
                        <td style="padding: 28px; text-align: center;">
                          <p style="margin: 0 0 20px 0; color: ${accent}; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">Your Personal Login</p>
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                            <tr>
                              <td style="background-color: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 10px; padding: 14px 16px; text-align: left;">
                                <p style="margin: 0 0 4px 0; color: ${textMuted}; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Email</p>
                                <p style="margin: 0; color: ${textWhite}; font-size: 15px; font-weight: 600;">
                                  <span style="color: ${textWhite}; text-decoration: none;">${userEmail}</span>
                                </p>
                              </td>
                            </tr>
                          </table>
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="background-color: ${cardBg}; border: 2px solid ${accent}; border-radius: 12px; padding: 20px; text-align: center;">
                                <p style="margin: 0 0 10px 0; color: ${textMuted}; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Password</p>
                                <p style="margin: 0; color: ${textWhite}; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">${userPassword}</p>
                                <p style="margin: 12px 0 0 0; color: ${textMuted}; font-size: 11px;">Hold to copy on mobile</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 32px 32px 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color: ${buttonColor}; border-radius: 12px; text-align: center;">
                          <a href="${product.membersUrl}?email=${encodeURIComponent(userEmail)}&password=${encodeURIComponent(userPassword)}" style="display: block; padding: 20px 24px; color: ${textWhite}; text-decoration: none; font-size: 16px; font-weight: 700; letter-spacing: 0.5px;">
                            ENTER MEMBERS AREA &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 32px 32px 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="padding: 6px 0; color: ${textGray}; font-size: 14px;"><span style="color: ${accent}; font-weight: 600;">1</span><span style="color: ${cardBorder}; margin: 0 12px;">&mdash;</span>Click "Enter Members Area"</td></tr>
                      <tr><td style="padding: 6px 0; color: ${textGray}; font-size: 14px;"><span style="color: ${accent}; font-weight: 600;">2</span><span style="color: ${cardBorder}; margin: 0 12px;">&mdash;</span>Enter your email &amp; password</td></tr>
                      <tr><td style="padding: 6px 0; color: ${textGray}; font-size: 14px;"><span style="color: ${accent}; font-weight: 600;">3</span><span style="color: ${cardBorder}; margin: 0 12px;">&mdash;</span>Start creating AI videos!</td></tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 32px;"><div style="height: 1px; background-color: ${cardBorder};"></div></td>
                </tr>
                <tr>
                  <td style="padding: 32px;">
                    <p style="margin: 0 0 16px 0; color: ${accent}; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">Your VIP Benefits</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="padding: 8px 0; color: ${textGray}; font-size: 14px;"><span style="color: ${accent};">&#10022;</span><span style="margin-left: 12px;">Complete video training library</span></td></tr>
                      <tr><td style="padding: 8px 0; color: ${textGray}; font-size: 14px;"><span style="color: ${accent};">&#10022;</span><span style="margin-left: 12px;">Premium templates &amp; scripts</span></td></tr>
                      <tr><td style="padding: 8px 0; color: ${textGray}; font-size: 14px;"><span style="color: ${accent};">&#10022;</span><span style="margin-left: 12px;">Lifetime access &mdash; no recurring fees</span></td></tr>
                      <tr><td style="padding: 8px 0; color: ${textGray}; font-size: 14px;"><span style="color: ${accent};">&#10022;</span><span style="margin-left: 12px;">All future updates included free</span></td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 0; text-align: center;">
              <p style="margin: 0; color: ${textMuted}; font-size: 13px;">${socialProof}</p>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding-bottom: 20px;">
              <p style="margin: 0 0 8px 0; color: ${textMuted}; font-size: 12px;">Questions? Simply reply to this email.</p>
              <p style="margin: 0; color: ${cardBorder}; font-size: 11px;">&copy; ${new Date().getFullYear()} CloneYourself</p>
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
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  // Verify Stripe webhook signature
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('Stripe signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const timestamp = new Date().toISOString()
  console.log('═══════════════════════════════════════════════════════════')
  console.log(`🔔 STRIPE WEBHOOK @ ${timestamp} | ${event.type}`)
  console.log('═══════════════════════════════════════════════════════════')

  await logWebhook({ type: event.type, id: event.id }, 'RECEIVED')

  // Only handle completed checkout sessions
  if (event.type !== 'checkout.session.completed') {
    console.log(`⏭️ Ignoring event: ${event.type}`)
    return NextResponse.json({ received: true })
  }

  try {
    const session = event.data.object as Stripe.Checkout.Session

    // Get customer email
    const buyerEmail = session.customer_details?.email || session.customer_email
    const buyerName = session.customer_details?.name || ''

    if (!buyerEmail) {
      console.error('❌ No email in checkout session')
      await logWebhook({ reason: 'no email in session', sessionId: session.id }, 'SKIPPED')
      return NextResponse.json({ received: true, processed: false, reason: 'No email' })
    }

    const normalizedEmail = buyerEmail.toLowerCase().trim()
    const amountCents = session.amount_total || 0
    const paymentLinkId = (session.payment_link as string) || ''
    const { type: purchaseType, price } = detectType(amountCents)

    console.log(`👤 Email: ${normalizedEmail}`)
    console.log(`💰 Amount: $${(amountCents / 100).toFixed(2)} (${amountCents} cents)`)
    console.log(`📋 Type: ${purchaseType} | Payment Link: ${paymentLinkId}`)

    // Detect niche from multiple sources
    let niche: string | null = null

    // 1. Check session metadata (if set on payment link)
    if (session.metadata?.product) {
      niche = session.metadata.product
      console.log(`✅ Niche from metadata: ${niche}`)
    }

    // 2. Try to detect from line items product name
    if (!niche) {
      try {
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items', 'line_items.data.price.product']
        })
        for (const item of fullSession.line_items?.data || []) {
          const productObj = item.price?.product as Stripe.Product
          const productName = productObj?.name || item.description || ''
          console.log(`🔍 Line item: "${productName}"`)
          niche = detectNiche(productName)
          if (niche) {
            console.log(`✅ Niche from product name: ${niche}`)
            break
          }
        }
      } catch (e) {
        console.error('Failed to retrieve line items:', e)
      }
    }

    // 3. Fallback - default to dermatologist (most active niche)
    if (!niche) {
      console.log('⚠️ Could not detect niche, defaulting to dermatologist')
      niche = 'dermatologist'
    }

    console.log(`🏷️ Final: ${normalizedEmail} | ${niche} | ${purchaseType} | $${price}`)

    // Handle upsell/downsell - just record purchase
    if (purchaseType === 'upsell' || purchaseType === 'downsell') {
      await recordPurchase(normalizedEmail, purchaseType, price, paymentLinkId)
      console.log(`✅ Recorded ${purchaseType} ($${price}) for ${normalizedEmail}`)
      await logWebhook({ email: normalizedEmail, type: purchaseType, price, niche }, 'SUCCESS')

      return NextResponse.json({
        success: true,
        type: purchaseType,
        amount: price,
        email: normalizedEmail,
        purchase_recorded: true
      })
    }

    // Main product - create user account and send welcome email
    const product = PRODUCTS[niche] || PRODUCTS.dermatologist

    const createResult = await createUser({
      email: normalizedEmail,
      name: buyerName,
      planId: paymentLinkId || session.id,
      product: niche as any
    })

    if (!createResult.success || !createResult.password) {
      console.error('❌ User creation failed:', createResult.error)
      await logWebhook({ email: normalizedEmail, error: createResult.error }, 'ERROR')
      return NextResponse.json({ received: true, error: 'User creation failed' })
    }

    const userPassword = createResult.password

    // Store credentials in Redis for thank-you page instant lookup
    try {
      const redis = getRedis()
      const credentialsData = JSON.stringify({
        email: normalizedEmail,
        password: userPassword,
        name: buyerName || '',
        product: niche,
        created: Date.now()
      })
      // Store by email (primary lookup) - 2 hour TTL
      await redis.set(`thankyou:${normalizedEmail}`, credentialsData, { ex: 7200 })
      // Store by session_id (backup lookup from Stripe redirect)
      await redis.set(`thankyou:session:${session.id}`, credentialsData, { ex: 7200 })
      console.log(`📝 Stored thank-you credentials for ${normalizedEmail}`)
    } catch (e) {
      console.error('Failed to store thank-you credentials (non-blocking):', e)
    }

    // Record main course purchase
    await recordPurchase(normalizedEmail, 'main', price, paymentLinkId)

    // Send welcome email
    const resend = getResend()
    await resend.emails.send({
      from: 'CloneYourself <hello@mail.aifastscale.com>',
      replyTo: 'support@aifastscale.com',
      to: normalizedEmail,
      subject: `🎉 Your ${product.productName} Login Details - Save This Email!`,
      html: generateWelcomeEmail(product, userPassword, normalizedEmail, buyerName),
    })

    console.log('═══════════════════════════════════════════════════════════')
    console.log(`✅ SUCCESS: ${normalizedEmail} | ${niche} | $${price}`)
    console.log(`📧 Welcome email sent with password`)
    console.log('═══════════════════════════════════════════════════════════')

    await logWebhook({ email: normalizedEmail, product: niche, revenue: price }, 'SUCCESS')

    return NextResponse.json({
      success: true,
      email_sent: true,
      recipient: normalizedEmail,
      user_created: true,
      purchase_tracked: true,
      revenue_recorded: price
    })

  } catch (error: any) {
    console.error('═══════════════════════════════════════════════════════════')
    console.error('❌ STRIPE WEBHOOK ERROR:', error.message || error)
    console.error('═══════════════════════════════════════════════════════════')
    await logWebhook({ error: error.message, stack: error.stack }, 'ERROR')
    return NextResponse.json({ received: true, error: error.message })
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'Stripe webhook endpoint active',
    version: '1.0',
    timestamp: new Date().toISOString()
  })
}
