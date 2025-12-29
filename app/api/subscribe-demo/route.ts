import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { saveLead, updateLatestAnonymousVideoWithEmail } from '@/lib/db'
import { shouldBlock } from '@/app/config/blocklist'

// Initialize Resend only when API key is available (not at build time)
const getResend = () => new Resend(process.env.RESEND_API_KEY)

// Helper to get client IP from Vercel/Cloudflare headers
function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp
  const cfIp = request.headers.get('cf-connecting-ip')
  if (cfIp) return cfIp
  return 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    const clientIp = getClientIp(request)

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if email OR IP is blocked (silently accept but don't process)
    if (shouldBlock(email, clientIp)) {
      console.log(`🚫 Blocked attempt - Email: ${email}, IP: ${clientIp}`)
      // Return success to not alert the blocked user
      return NextResponse.json({
        success: true,
        message: 'Email submitted successfully'
      })
    }

    // Save lead to database
    try {
      await saveLead(email, 'demo')
      // Link the most recent anonymous video to this email
      await updateLatestAnonymousVideoWithEmail(email)
    } catch (dbError) {
      console.log('Database save failed (optional):', dbError)
    }

    const resend = getResend()

    // Send notification email to you (includes IP for blocking if needed)
    await resend.emails.send({
      from: 'AI FastScale <hello@mail.aifastscale.com>',
      to: 'badaoui577@gmail.com',
      subject: '🎬 New Demo Lead - AI FastScale',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d4af37;">New Demo Lead! 🎉</h2>
          <p>Someone just used the AI video demo and submitted their email:</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 18px;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0 0 0; color: #666;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;"><strong>IP:</strong> ${clientIp}</p>
          </div>
          <p>This person experienced your AI video generation - they're a warm lead!</p>
          <p style="color: #666; font-size: 14px;">— AI FastScale System</p>
        </div>
      `,
    })

    // Also add to Resend audience (contact list) for future marketing
    try {
      await resend.contacts.create({
        email: email,
        audienceId: process.env.RESEND_AUDIENCE_ID || '',
        unsubscribed: false,
      })
    } catch (contactError) {
      // Audience might not be set up yet - that's okay
      console.log('Contact not added to audience (optional):', contactError)
    }

    console.log(`✅ Demo lead captured: ${email}`)

    return NextResponse.json({
      success: true,
      message: 'Email submitted successfully'
    })

  } catch (error: any) {
    console.error('Subscribe demo error:', error)

    // Still return success to user - don't block their video
    // Just log the error for debugging
    return NextResponse.json({
      success: true,
      message: 'Email submitted'
    })
  }
}
