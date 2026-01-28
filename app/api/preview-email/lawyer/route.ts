import { NextResponse } from 'next/server'

/**
 * Preview route for Lawyer Welcome Email
 * Visit: /api/preview-email/lawyer
 * This shows how the email will look for lawyer/attorney customers
 */

// Product configuration (same as webhook)
const product = {
  membersUrl: 'https://aifastscale.com/lawyers/members',
  productName: 'CloneYourself for Lawyers',
  price: '47.82',
  accentColor: '#d4af37'
}

export async function GET() {
  const userEmail = 'alex.morgan@example.com'
  const userPassword = 'DEMO-LAW2026'
  const firstName = 'Alex'

  // Gold branding for lawyers (black and gold theme)
  const accent = '#d4af37' // Gold
  const buttonColor = '#d4af37'
  const glowColor = 'rgba(212, 175, 55, 0.08)'
  const socialProof = 'Trusted by <strong style="color: #d4af37;">+750 lawyers & attorneys</strong> worldwide'

  const darkBg = '#09090b'
  const cardBg = '#18181b'
  const cardBorder = '#27272a'
  const textWhite = '#fafafa'
  const textGray = '#a1a1aa'
  const textMuted = '#71717a'

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to the Club - Preview</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${darkBg};">

  <!-- Preview text -->
  <div style="display: none; max-height: 0; overflow: hidden;">
    ${firstName}, your exclusive access is ready. Password: ${userPassword}
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
                      Welcome, ${firstName}
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

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' }
  })
}
