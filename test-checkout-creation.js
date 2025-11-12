const fs = require('fs')
const path = require('path')

// Load .env.local manually
const envPath = path.join(__dirname, '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const envVars = {}
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    envVars[match[1].trim()] = match[2].trim()
  }
})

const Stripe = require('stripe')
const stripe = new Stripe(envVars.STRIPE_SECRET_KEY)

async function testCheckoutCreation() {
  console.log('🧪 Testing Checkout Creation...\n')

  try {
    // Create a test checkout session with same params as production
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: 'https://aifastscale.com/thank-you-confirmed?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://aifastscale.com',
      line_items: [{
        price: envVars.NEXT_PUBLIC_STRIPE_PRICE_ID,
        quantity: 1,
      }],
      billing_address_collection: 'auto',
      phone_number_collection: {
        enabled: false,
      },
      customer_creation: 'always',
      payment_method_types: ['card', 'link'],
      custom_text: {
        submit: {
          message: '🔒 Secure payment • 30-day money-back guarantee',
        },
      },
      submit_type: 'pay',
      metadata: {
        product_type: 'main',
        traffic_source: 'Test',
      },
    })

    console.log('✅ Checkout Session Created Successfully!\n')
    console.log('Session ID:', session.id)
    console.log('Status:', session.status)
    console.log('Payment Status:', session.payment_status)
    console.log('Amount:', `$${(session.amount_total / 100).toFixed(2)}`)
    console.log('Currency:', session.currency)
    console.log('Payment Methods:', session.payment_method_types)
    console.log('\n📝 Custom Text:', session.custom_text?.submit?.message)
    console.log('\n🔗 Checkout URL:', session.url)
    console.log('\n💡 Open this URL in your browser to see what customers see!')
    console.log('\nTest the checkout on:')
    console.log('  - Your phone (to see mobile experience)')
    console.log('  - Safari (to see Apple Pay)')
    console.log('  - Chrome (to see Google Pay)')

  } catch (error) {
    console.error('❌ ERROR Creating Checkout:\n')
    console.error(error.message)
    if (error.raw) {
      console.error('\nRaw Error:', JSON.stringify(error.raw, null, 2))
    }
  }
}

testCheckoutCreation()
