import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { planId, metadata = {} } = await req.json()

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      )
    }

    // Get base URL from environment or request
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      req.headers.get('origin') ||
      'http://localhost:3000'

    // Determine redirect URL based on plan type
    let successUrl = `${baseUrl}/oto` // Default: go to OTO after main purchase

    if (metadata.type === 'oto') {
      successUrl = `${baseUrl}/thank-you-confirmed?purchased=oto`
    } else if (metadata.type === 'downsell') {
      successUrl = `${baseUrl}/thank-you-confirmed?purchased=downsell`
    }

    // Create Whop checkout URL
    // Whop uses their hosted checkout page with the plan ID
    const whopCheckoutUrl = `https://whop.com/checkout/${planId}?d=${encodeURIComponent(successUrl)}`

    return NextResponse.json({
      checkoutUrl: whopCheckoutUrl,
      success: true
    })
  } catch (err: any) {
    console.error('Whop checkout error:', err)

    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
