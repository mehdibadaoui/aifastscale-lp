import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // TODO: Integrate with your email service (Mailchimp, ConvertKit, SendGrid, etc.)
    // For now, just log it server-side
    console.log('📧 Demo Email Captured:', email, new Date().toISOString())

    // You can add email service integration here:
    // Example for Mailchimp:
    // const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY
    // const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID
    // await fetch(`https://us1.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     email_address: email,
    //     status: 'subscribed',
    //     tags: ['demo-user'],
    //   }),
    // })

    // Return success
    return NextResponse.json({
      success: true,
      message: 'Email saved successfully'
    })
  } catch (err: any) {
    console.error('Error saving demo email:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to save email' },
      { status: 500 }
    )
  }
}
