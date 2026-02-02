import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getUser } from '@/lib/user-db'
import { Redis } from '@upstash/redis'

// Rate limiting
function getRedis(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) throw new Error('Redis not configured')
  return new Redis({ url, token })
}

// Product configuration for emails
const PRODUCTS = {
  dentist: {
    membersUrl: 'https://aifastscale.com/members',
    productName: 'CloneYourself AI Video Mastery',
  },
  realestate: {
    membersUrl: 'https://aifastscale.com/members',
    productName: 'CloneYourself AI Video Mastery',
  },
  'plastic-surgeon': {
    membersUrl: 'https://aifastscale.com/plastic-surgeons/members',
    productName: 'CloneYourself AI Video Mastery',
  },
  'psychologist': {
    membersUrl: 'https://aifastscale.com/members',
    productName: 'CloneYourself AI Video Mastery',
  },
  'lawyer': {
    membersUrl: 'https://aifastscale.com/members',
    productName: 'CloneYourself AI Video Mastery',
  }
}

// Generate credentials email
function generateCredentialsEmail(
  productName: string,
  membersUrl: string,
  userEmail: string,
  userPassword: string,
  userName?: string
) {
  const firstName = userName ? userName.split(' ')[0] : ''
  const accent = '#d4af37'
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
  <title>Your Login Credentials</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${darkBg};">
  <div style="display: none; max-height: 0; overflow: hidden;">
    ${firstName ? firstName + ', here' : 'Here'} are your login credentials. Password: ${userPassword}
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${darkBg}; padding: 48px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 460px;">
          <!-- Badge -->
          <tr>
            <td style="text-align: center; padding-bottom: 32px;">
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: ${cardBg}; border: 1px solid ${accent}; border-radius: 100px; padding: 10px 24px;">
                    <span style="color: ${accent}; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">YOUR LOGIN DETAILS</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${cardBg}; border-radius: 20px; border: 1px solid ${cardBorder};">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 32px 32px 32px; text-align: center;">
                    <h1 style="margin: 0 0 12px 0; color: ${textWhite}; font-size: 28px; font-weight: 800; line-height: 1.2;">
                      ${firstName ? `Hey ${firstName}!` : 'Hey there!'}
                    </h1>
                    <p style="margin: 0; color: ${textGray}; font-size: 15px;">
                      Here are your login credentials for <strong style="color: ${textWhite};">${productName}</strong>
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding: 0 32px;">
                    <div style="height: 1px; background: linear-gradient(90deg, transparent, ${accent}, transparent);"></div>
                  </td>
                </tr>

                <!-- Credentials -->
                <tr>
                  <td style="padding: 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f0f11; border-radius: 16px; border: 1px solid ${cardBorder};">
                      <tr>
                        <td style="padding: 28px; text-align: center;">
                          <!-- Email -->
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                            <tr>
                              <td style="background-color: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 10px; padding: 14px 16px; text-align: left;">
                                <p style="margin: 0 0 4px 0; color: ${textMuted}; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Email</p>
                                <p style="margin: 0; color: ${textWhite}; font-size: 15px; font-weight: 600;">${userEmail}</p>
                              </td>
                            </tr>
                          </table>

                          <!-- Password -->
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="background-color: ${cardBg}; border: 2px solid ${accent}; border-radius: 12px; padding: 20px; text-align: center;">
                                <p style="margin: 0 0 10px 0; color: ${textMuted}; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Password</p>
                                <p style="margin: 0; color: ${textWhite}; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">${userPassword}</p>
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
                        <td style="background-color: ${accent}; border-radius: 12px; text-align: center;">
                          <a href="${membersUrl}" style="display: block; padding: 20px 24px; color: ${textWhite}; text-decoration: none; font-size: 16px; font-weight: 700; letter-spacing: 0.5px;">
                            LOGIN NOW →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="text-align: center; padding-top: 24px;">
              <p style="margin: 0; color: ${textMuted}; font-size: 12px;">
                Questions? Reply to this email.
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
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Rate limiting: max 3 requests per email per hour
    const redis = getRedis()
    const rateLimitKey = `resend-limit:${normalizedEmail}`
    const attempts = await redis.incr(rateLimitKey)
    if (attempts === 1) {
      await redis.expire(rateLimitKey, 3600) // 1 hour
    }
    if (attempts > 3) {
      return NextResponse.json({
        success: false,
        error: 'Too many requests. Please try again later or check your email inbox.'
      }, { status: 429 })
    }

    // Get user from database
    const user = await getUser(normalizedEmail)
    if (!user) {
      // Don't reveal if user exists or not
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, credentials will be sent.'
      })
    }

    // Get product config
    const productConfig = PRODUCTS[user.product] || PRODUCTS['plastic-surgeon']

    // Send email
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'CloneYourself <hello@mail.aifastscale.com>',
      replyTo: 'support@aifastscale.com',
      to: normalizedEmail,
      subject: `Your Login Credentials - ${productConfig.productName}`,
      html: generateCredentialsEmail(
        productConfig.productName,
        productConfig.membersUrl,
        normalizedEmail,
        user.password,
        user.name
      ),
    })

    console.log(`Resent credentials to ${normalizedEmail}`)

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, credentials will be sent.'
    })

  } catch (error: any) {
    console.error('Resend credentials error:', error)
    return NextResponse.json({
      success: false,
      error: 'Something went wrong. Please try again.'
    }, { status: 500 })
  }
}
