import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { Redis } from '@upstash/redis'

// Lazy initialization
function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY not configured')
  return new Resend(apiKey)
}

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) throw new Error('Redis credentials not found')
  return new Redis({ url, token })
}

// Premium color palette
const accent = '#14b8a6'
const darkBg = '#09090b'
const cardBg = '#18181b'
const cardBorder = '#27272a'
const textWhite = '#fafafa'
const textGray = '#a1a1aa'
const textMuted = '#71717a'

function generateVipReviewEmail(
  password: string,
  email: string,
  name: string
) {
  const firstName = name.split(' ')[0]
  const productName = 'CloneYourself for Dentists'
  const membersUrl = 'https://aifastscale.com/dentists/members'
  const lpUrl = 'https://aifastscale.com/dentists'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your VIP Review Access</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${darkBg};">

  <!-- Preview text -->
  <div style="display: none; max-height: 0; overflow: hidden;">
    ${firstName}, your VIP review access to ${productName} is ready.
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${darkBg}; padding: 48px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px;">

          <!-- VIP Badge -->
          <tr>
            <td style="text-align: center; padding-bottom: 32px;">
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: ${cardBg}; border: 1px solid ${accent}; border-radius: 100px; padding: 10px 24px;">
                    <span style="color: ${accent}; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">★ VIP REVIEW ACCESS ★</span>
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
                  <td style="padding: 40px 32px 24px 32px; text-align: center;">
                    <p style="margin: 0 0 16px 0; color: ${accent}; font-size: 14px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">
                      Welcome, ${firstName}
                    </p>
                    <h1 style="margin: 0 0 12px 0; color: ${textWhite}; font-size: 26px; font-weight: 800; line-height: 1.2;">
                      Your Full Access Is Ready
                    </h1>
                    <p style="margin: 0; color: ${textGray}; font-size: 15px; line-height: 1.6;">
                      Below are your personal login credentials for <strong style="color: ${textWhite};">${productName}</strong>. This is the exact same experience every paying customer receives.
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding: 0 32px;">
                    <div style="height: 1px; background: linear-gradient(90deg, transparent, ${accent}, transparent);"></div>
                  </td>
                </tr>

                <!-- LOGIN CREDENTIALS -->
                <tr>
                  <td style="padding: 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f0f11; border-radius: 16px; border: 1px solid ${cardBorder};">
                      <tr>
                        <td style="padding: 28px; text-align: center;">
                          <p style="margin: 0 0 20px 0; color: ${accent}; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
                            Your Login Credentials
                          </p>

                          <!-- Email -->
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                            <tr>
                              <td style="background-color: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 10px; padding: 14px 16px; text-align: left;">
                                <p style="margin: 0 0 4px 0; color: ${textMuted}; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Email</p>
                                <p style="margin: 0; color: ${textWhite}; font-size: 15px; font-weight: 600;">
                                  ${email}
                                </p>
                              </td>
                            </tr>
                          </table>

                          <!-- Password -->
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="background-color: ${cardBg}; border: 2px solid ${accent}; border-radius: 12px; padding: 20px; text-align: center;">
                                <p style="margin: 0 0 10px 0; color: ${textMuted}; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Password</p>
                                <p style="margin: 0; color: ${textWhite}; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">
                                  ${password}
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA Button - Members Area -->
                <tr>
                  <td style="padding: 0 32px 16px 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color: ${accent}; border-radius: 12px; text-align: center;">
                          <a href="${membersUrl}" style="display: block; padding: 20px 24px; color: ${textWhite}; text-decoration: none; font-size: 16px; font-weight: 700;">
                            ENTER MEMBERS AREA →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Secondary CTA - View Landing Page -->
                <tr>
                  <td style="padding: 0 32px 32px 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="border: 1px solid ${cardBorder}; border-radius: 12px; text-align: center;">
                          <a href="${lpUrl}" style="display: block; padding: 16px 24px; color: ${textGray}; text-decoration: none; font-size: 14px; font-weight: 600;">
                            View Sales Page
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- What's Included -->
                <tr>
                  <td style="padding: 0 32px 32px 32px;">
                    <p style="margin: 0 0 16px 0; color: ${accent}; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
                      What's Included
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; color: ${textGray}; font-size: 14px;">
                          <span style="color: ${accent};">✦</span><span style="margin-left: 12px;">5 HD video training modules (step-by-step)</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: ${textGray}; font-size: 14px;">
                          <span style="color: ${accent};">✦</span><span style="margin-left: 12px;">AI script templates & prompts</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: ${textGray}; font-size: 14px;">
                          <span style="color: ${accent};">✦</span><span style="margin-left: 12px;">10 premium bonus resources ($3,970+ value)</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: ${textGray}; font-size: 14px;">
                          <span style="color: ${accent};">✦</span><span style="margin-left: 12px;">Custom GPT assistant for dentists</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: ${textGray}; font-size: 14px;">
                          <span style="color: ${accent};">✦</span><span style="margin-left: 12px;">Lifetime access — no recurring fees</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Funnel Overview -->
                <tr>
                  <td style="padding: 0 32px 32px 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f0f11; border-radius: 16px; border: 1px solid ${cardBorder};">
                      <tr>
                        <td style="padding: 24px;">
                          <p style="margin: 0 0 16px 0; color: ${accent}; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
                            Sales Funnel Overview
                          </p>
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 6px 0; color: ${textGray}; font-size: 13px;">
                                <strong style="color: ${textWhite};">1.</strong> Landing Page → <a href="${lpUrl}" style="color: ${accent}; text-decoration: none;">aifastscale.com/dentists</a>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: ${textGray}; font-size: 13px;">
                                <strong style="color: ${textWhite};">2.</strong> Whop Checkout ($47 main product)
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: ${textGray}; font-size: 13px;">
                                <strong style="color: ${textWhite};">3.</strong> Upsell Page ($9.95 — 5 extra tools)
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: ${textGray}; font-size: 13px;">
                                <strong style="color: ${textWhite};">4.</strong> Downsell Page ($4.95 — price drop)
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: ${textGray}; font-size: 13px;">
                                <strong style="color: ${textWhite};">5.</strong> Thank You Page (login credentials)
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: ${textGray}; font-size: 13px;">
                                <strong style="color: ${textWhite};">6.</strong> Welcome Email (this email)
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: ${textGray}; font-size: 13px;">
                                <strong style="color: ${textWhite};">7.</strong> Members Area → <a href="${membersUrl}" style="color: ${accent}; text-decoration: none;">Login with credentials above</a>
                              </td>
                            </tr>
                          </table>
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
            <td style="text-align: center; padding: 24px 0;">
              <p style="margin: 0 0 8px 0; color: ${textMuted}; font-size: 12px;">
                Questions? Reply to this email or reach us at support@aifastscale.com
              </p>
              <p style="margin: 0; color: ${textMuted}; font-size: 11px;">
                CloneYourself by AI FastScale — Helping professionals grow with AI video
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
    const { email, name, secret } = await request.json()

    // Security check
    if (secret !== process.env.ADMIN_SECRET && secret !== 'whop-vip-review-2026') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!email || !name) {
      return NextResponse.json({ error: 'email and name required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const password = 'dental-vip-review'

    // 1. Create user in Redis database (so login works)
    const redis = getRedis()
    const user = {
      email: normalizedEmail,
      password,
      name,
      purchaseDate: new Date().toISOString(),
      planId: 'vip-review',
      product: 'dentist',
      loginCount: 0,
      notes: 'VIP Review Account - Whop Team',
      tags: ['vip-review', 'whop-team'],
      revenue: { main: 0, total: 0 },
    }

    await redis.set(`user:${normalizedEmail}`, user)
    await redis.sadd('users:all', normalizedEmail)
    await redis.sadd('users:dentist', normalizedEmail)

    // 2. Send premium welcome email
    const resend = getResend()
    await resend.emails.send({
      from: 'CloneYourself <hello@mail.aifastscale.com>',
      replyTo: 'support@aifastscale.com',
      to: normalizedEmail,
      subject: `🎉 Your CloneYourself for Dentists - VIP Access Ready`,
      html: generateVipReviewEmail(password, normalizedEmail, name),
    })

    return NextResponse.json({
      success: true,
      message: `VIP review account created and email sent to ${normalizedEmail}`,
      credentials: { email: normalizedEmail, password },
    })
  } catch (error: any) {
    console.error('VIP review error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
