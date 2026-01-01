import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Lazy initialization to avoid build errors when API key is not set
function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY not configured')
  return new Resend(apiKey)
}

// Premium color palette
const accent = '#14b8a6'
const teal = '#14b8a6'
const darkBg = '#09090b'
const cardBg = '#18181b'
const cardBorder = '#27272a'
const textWhite = '#fafafa'
const textGray = '#a1a1aa'
const textMuted = '#71717a'

function generateWelcomeEmail(
  userPassword: string,
  userEmail: string,
  buyerName?: string
) {
  const firstName = buyerName ? buyerName.split(' ')[0] : ''
  const productName = 'CloneYourself for Dentists'
  const membersUrl = 'https://aifastscale.com/dentists/members'

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
                      Your exclusive access to <strong style="color: ${textWhite};">${productName}</strong> is now active.
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
                                <p style="margin: 0; color: ${textWhite}; font-size: 15px; font-weight: 600;">
                                  ${userEmail}
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
                                  ${userPassword}
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
                        <td style="background-color: ${teal}; border-radius: 12px; text-align: center;">
                          <a href="${membersUrl}" style="display: block; padding: 20px 24px; color: ${textWhite}; text-decoration: none; font-size: 16px; font-weight: 700;">
                            ENTER MEMBERS AREA →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- VIP Benefits -->
                <tr>
                  <td style="padding: 0 32px 32px 32px;">
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
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="text-align: center; padding: 24px 0;">
              <p style="margin: 0; color: ${textMuted}; font-size: 12px;">
                Questions? Simply reply to this email.
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
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'email required' }, { status: 400 })
    }

    const testPassword = 'dental-test123'

    await getResend().emails.send({
      from: 'CloneYourself <hello@mail.aifastscale.com>',
      replyTo: 'support@aifastscale.com',
      to: email,
      subject: `🎉 Your CloneYourself for Dentists Login Details - Save This Email!`,
      html: generateWelcomeEmail(testPassword, email, name || 'Test User'),
    })

    return NextResponse.json({ success: true, message: `Test email sent to ${email}` })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
