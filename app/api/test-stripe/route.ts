import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function GET() {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID

    if (!stripeKey) {
      return NextResponse.json({ error: 'No Stripe key' }, { status: 500 })
    }

    const stripe = new Stripe(stripeKey)

    // Test 1: List prices to see if API connection works
    const prices = await stripe.prices.list({ limit: 3 })

    //Test 2: Try to retrieve the specific price ID
    let priceDetails = null
    let priceError = null
    if (priceId) {
      try {
        priceDetails = await stripe.prices.retrieve(priceId)
      } catch (err: any) {
        priceError = {
          message: err.message,
          type: err.type,
          code: err.code,
        }
      }
    }

    return NextResponse.json({
      success: true,
      connectionWorks: true,
      pricesCount: prices.data.length,
      priceIdTested: priceId,
      priceExists: !!priceDetails,
      priceError,
      priceDetails: priceDetails
        ? {
            id: priceDetails.id,
            active: priceDetails.active,
            unit_amount: priceDetails.unit_amount,
            currency: priceDetails.currency,
          }
        : null,
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
        type: err.type,
        code: err.code,
        statusCode: err.statusCode,
      },
      { status: 500 }
    )
  }
}
