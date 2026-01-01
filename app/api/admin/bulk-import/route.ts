import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createUser, getUser, recordPurchase } from '@/lib/user-db'

// Initialize Resend
const getResend = () => new Resend(process.env.RESEND_API_KEY)

// Product config
const PRODUCTS = {
  dentist: {
    membersUrl: 'https://aifastscale.com/dentists/members',
    productName: 'CloneYourself for Dentists',
    price: 47
  }
}

// Premium color palette - matching dentist LP
const accent = '#14b8a6'
const teal = '#14b8a6'
const darkBg = '#09090b'
const cardBg = '#18181b'
const cardBorder = '#27272a'
const textWhite = '#fafafa'
const textGray = '#a1a1aa'
const textMuted = '#71717a'

function generateWelcomeEmail(
  product: typeof PRODUCTS.dentist,
  userPassword: string,
  userEmail: string,
  buyerName?: string
) {
  const firstName = buyerName ? buyerName.split(' ')[0] : ''

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
                          <a href="${product.membersUrl}" style="display: block; padding: 20px 24px; color: ${textWhite}; text-decoration: none; font-size: 16px; font-weight: 700;">
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
    const body = await request.json()
    const { customers, dryRun = true } = body

    if (!customers || !Array.isArray(customers)) {
      return NextResponse.json({ error: 'customers array required' }, { status: 400 })
    }

    const results = {
      total: customers.length,
      alreadyExists: [] as string[],
      created: [] as string[],
      emailsSent: [] as string[],
      errors: [] as { email: string; error: string }[]
    }

    const resend = getResend()
    const product = PRODUCTS.dentist

    for (const customer of customers) {
      const email = customer.email?.toLowerCase().trim()
      const name = customer.name || ''

      if (!email) {
        results.errors.push({ email: 'unknown', error: 'No email provided' })
        continue
      }

      try {
        // Check if user already exists
        const existingUser = await getUser(email)

        if (existingUser) {
          results.alreadyExists.push(email)
          console.log(`⏭️ SKIP: ${email} already exists`)
          continue
        }

        if (dryRun) {
          // In dry run, just count what would be created
          results.created.push(email)
          console.log(`🔍 DRY RUN: Would create ${email}`)
          continue
        }

        // Create the user
        const createResult = await createUser({
          email,
          name,
          planId: 'bulk-import',
          product: 'dentist'
        })

        if (!createResult.success || !createResult.password) {
          results.errors.push({ email, error: createResult.error || 'Failed to create' })
          continue
        }

        results.created.push(email)

        // Record revenue
        await recordPurchase(email, 'main', product.price, 'bulk-import')

        // Send welcome email
        try {
          await resend.emails.send({
            from: 'CloneYourself <hello@mail.aifastscale.com>',
            replyTo: 'support@aifastscale.com',
            to: email,
            subject: `🎉 Your ${product.productName} Login Details - Save This Email!`,
            html: generateWelcomeEmail(product, createResult.password, email, name),
          })
          results.emailsSent.push(email)
          console.log(`✅ Created & emailed: ${email}`)
        } catch (emailError) {
          console.error(`Email failed for ${email}:`, emailError)
          results.errors.push({ email, error: 'User created but email failed' })
        }

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 200))

      } catch (error: any) {
        results.errors.push({ email, error: error.message })
      }
    }

    return NextResponse.json({
      success: true,
      dryRun,
      summary: {
        total: results.total,
        alreadyExisted: results.alreadyExists.length,
        created: results.created.length,
        emailsSent: results.emailsSent.length,
        errors: results.errors.length
      },
      details: results
    })

  } catch (error: any) {
    console.error('Bulk import error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
