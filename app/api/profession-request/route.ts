import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY not configured')
  return new Resend(apiKey)
}

export async function POST(request: NextRequest) {
  try {
    const { profession, email } = await request.json()

    if (!profession) {
      return NextResponse.json({ error: 'Profession is required' }, { status: 400 })
    }

    // Send notification to support
    await getResend().emails.send({
      from: 'AIFastScale <hello@mail.aifastscale.com>',
      to: 'support@aifastscale.com',
      subject: `👤 New "Other" Profession Interest: ${profession}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="margin: 0; padding: 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #09090b; color: #fafafa;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #18181b; border-radius: 16px; border: 1px solid #27272a; padding: 32px;">
            <h1 style="margin: 0 0 24px 0; font-size: 24px; color: #a78bfa;">
              👤 New Profession Interest
            </h1>

            <p style="margin: 0 0 20px 0; color: #a1a1aa; font-size: 14px;">
              Someone selected "Other" profession on the languages page and proceeded to checkout.
            </p>

            <div style="background-color: #27272a; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
              <p style="margin: 0 0 8px 0; color: #a1a1aa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Profession / Industry</p>
              <p style="margin: 0; font-size: 20px; font-weight: bold; color: #fafafa;">${profession}</p>
            </div>

            ${email ? `
            <div style="background-color: #27272a; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
              <p style="margin: 0 0 8px 0; color: #a1a1aa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">User Email</p>
              <p style="margin: 0; font-size: 16px; color: #fafafa;">
                <a href="mailto:${email}" style="color: #a78bfa; text-decoration: none;">${email}</a>
              </p>
            </div>
            ` : `
            <div style="background-color: #27272a; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
              <p style="margin: 0 0 8px 0; color: #a1a1aa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">User Email</p>
              <p style="margin: 0; font-size: 16px; color: #71717a;">Not provided</p>
            </div>
            `}

            <div style="background-color: #22c55e20; border: 1px solid #22c55e40; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
              <p style="margin: 0; color: #22c55e; font-size: 14px; font-weight: 600;">
                ✓ User was redirected to Whop checkout
              </p>
            </div>

            <p style="margin: 24px 0 0 0; color: #71717a; font-size: 13px;">
              Consider creating a landing page for "${profession}" if you see multiple requests.
            </p>
          </div>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Profession request error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
