import { NextResponse } from 'next/server'

export async function GET() {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID

  return NextResponse.json({
    stripeKeyExists: !!stripeKey,
    stripeKeyPrefix: stripeKey?.substring(0, 12) + '...',
    stripeKeyLength: stripeKey?.length,
    priceIdExists: !!priceId,
    priceIdValue: priceId,
    allEnvVars: Object.keys(process.env)
      .filter((key) => key.includes('STRIPE'))
      .map((key) => key),
  })
}
