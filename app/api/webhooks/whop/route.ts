import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createUser } from '@/lib/user-db'

// Initialize Resend
const getResend = () => new Resend(process.env.RESEND_API_KEY)

// Product configuration
const PRODUCTS = {
  dentist: {
    membersUrl: 'https://aifastscale.com/dentists/members',
    productName: 'CloneYourself for Dentists',
    price: '47.00'
  },
  realestate: {
    membersUrl: 'https://aifastscale.com/members',
    productName: '7-Minute AgentClone',
    price: '37.00'
  }
}

// MAIN COURSE plan IDs only - no upsells/downsells
const DENTIST_MAIN_PLAN = 'plan_SxMS4HqFxJKNT'

// Upsell/Downsell plan IDs - skip these (no email for add-ons)
const UPSELL_DOWNSELL_PLANS = [
  'plan_IbsV5qrvMPBgb',  // Dentist upsell ($9.95)
  'plan_C2l5ZPXSWCxQu',  // Dentist downsell ($4.95)
]

// Determine product type from webhook data
function getProductType(productData: any): 'dentist' | 'realestate' | null {
  const productName = productData?.name?.toLowerCase() || ''
  const planId = productData?.plan_id || productData?.id || ''

  // Skip upsells and downsells
  if (UPSELL_DOWNSELL_PLANS.includes(planId)) {
    console.log('Skipping upsell/downsell:', planId)
    return null
  }

  // Dentist main course
  if (planId === DENTIST_MAIN_PLAN || productName.includes('dentist')) {
    return 'dentist'
  }

  // Real estate products
  if (productName.includes('agent') || productName.includes('real estate') || productName.includes('realestate')) {
    return 'realestate'
  }

  return null
}

// Generate VIP welcome email with personalized password
function generateWelcomeEmail(
  product: typeof PRODUCTS.dentist,
  userPassword: string,
  userEmail: string,
  buyerName?: string
) {
  const firstName = buyerName ? buyerName.split(' ')[0] : ''

  // Premium color palette - matching dentist LP
  const accent = '#14b8a6'
  const teal = '#14b8a6'
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
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${cardBg}; border-radius: 20px; border: 1px solid ${cardBorder}; box-shadow: 0 0 60px rgba(20, 184, 166, 0.08);">

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

                          <p style="margin: 16px 0 0 0; color: ${textMuted}; font-size: 11px;">
                            This password is unique to you. Do not share it.
                          </p>
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
                        <td style="background-color: ${teal}; border-radius: 12px; text-align: center;">
                          <a href="${product.membersUrl}" style="display: block; padding: 20px 24px; color: ${textWhite}; text-decoration: none; font-size: 16px; font-weight: 700; letter-spacing: 0.5px;">
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

          <!-- Laptop Recommendation -->
          <tr>
            <td style="padding: 28px 0 0 0; text-align: center;">
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto; background-color: ${cardBg}; border-radius: 8px; border: 1px solid ${cardBorder};">
                <tr>
                  <td style="padding: 12px 20px;">
                    <p style="margin: 0; color: ${textGray}; font-size: 12px;">
                      💻 <span style="color: ${textMuted};">For best experience, we recommend using a laptop or desktop</span>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Spam Note -->
          <tr>
            <td style="padding: 16px 0 0 0; text-align: center;">
              <p style="margin: 0; color: ${textMuted}; font-size: 11px;">
                📧 Can't find this email later? Check your <strong style="color: ${textGray};">Spam</strong> or <strong style="color: ${textGray};">Promotions</strong> folder
              </p>
            </td>
          </tr>

          <!-- Social Proof -->
          <tr>
            <td style="padding: 24px 0; text-align: center;">
              <p style="margin: 0; color: ${textMuted}; font-size: 13px;">
                Trusted by <strong style="color: ${accent};">+21,000 dentists</strong> worldwide
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
    console.log('Whop webhook received:', JSON.stringify(body, null, 2))

    const action = body.action || body.event || ''
    const data = body.data || body

    // Only process successful payments
    if (!action.includes('payment') && !action.includes('membership') && !action.includes('sale')) {
      console.log('Ignoring non-payment webhook:', action)
      return NextResponse.json({ received: true, processed: false })
    }

    // Extract buyer info
    const buyerEmail = data?.user?.email ||
                       data?.customer?.email ||
                       data?.email ||
                       data?.buyer?.email

    const buyerName = data?.user?.name ||
                      data?.customer?.name ||
                      data?.buyer?.name ||
                      data?.user?.username || ''

    if (!buyerEmail) {
      console.error('No buyer email found in webhook:', body)
      return NextResponse.json({ error: 'No email found' }, { status: 400 })
    }

    // Get plan ID
    const planId = data?.plan?.id || data?.product?.plan_id || data?.plan_id || ''

    // Determine product type
    const productType = getProductType(data?.product || data?.plan || data)

    if (!productType) {
      console.log('Unknown product or upsell/downsell, skipping')
      return NextResponse.json({ received: true, processed: false })
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
      // Even if user creation fails, we should not block the webhook
      // Log the error but continue (user can contact support)
      return NextResponse.json({
        received: true,
        warning: 'User creation failed, manual setup may be needed',
        error: createResult.error
      })
    }

    const userPassword = createResult.password

    // Send welcome email with personalized credentials
    const resend = getResend()

    const emailResult = await resend.emails.send({
      from: 'CloneYourself <hello@mail.aifastscale.com>',
      to: buyerEmail,
      subject: `🎉 Your ${product.productName} Login Details - Save This Email!`,
      html: generateWelcomeEmail(product, userPassword, buyerEmail, buyerName),
    })

    console.log(`✅ Welcome email sent to ${buyerEmail} with unique password`)

    return NextResponse.json({
      success: true,
      email_sent: true,
      recipient: buyerEmail,
      user_created: true
    })

  } catch (error: any) {
    console.error('Whop webhook error:', error)
    // Return 200 to prevent Whop from retrying (we log the error for debugging)
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
