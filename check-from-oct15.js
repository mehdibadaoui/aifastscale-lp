// Check sales from October 15, 2025
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

const stripe = require('stripe')(envVars.STRIPE_SECRET_KEY)

const YOUR_PRICE_IDS = [
  envVars.NEXT_PUBLIC_STRIPE_PRICE_ID,
  envVars.NEXT_PUBLIC_STRIPE_UPSELL_17_PRICE_ID,
  envVars.NEXT_PUBLIC_STRIPE_UPSELL_7_PRICE_ID,
]

async function checkFromOct15() {
  console.log('🔍 Checking sales from October 15, 2025...\n')

  // October 15, 2025
  const oct15th2025 = new Date('2025-10-15T00:00:00Z')
  const startTimestamp = Math.floor(oct15th2025.getTime() / 1000)

  console.log(`Start Date: ${oct15th2025.toLocaleString()}\n`)

  // Fetch checkout sessions
  const sessions = await stripe.checkout.sessions.list({
    limit: 100,
    created: { gte: startTimestamp },
    expand: ['data.line_items'],
  })

  // Fetch payment intents
  const paymentIntents = await stripe.paymentIntents.list({
    limit: 100,
    created: { gte: startTimestamp },
  })

  console.log(`📦 Total checkout sessions: ${sessions.data.length}`)
  console.log(`📦 Total payment intents: ${paymentIntents.data.length}\n`)

  const allSales = []

  // Check sessions
  for (const session of sessions.data) {
    if (session.payment_status === 'paid') {
      const lineItems = session.line_items?.data || []

      for (const item of lineItems) {
        const priceId = item.price?.id || ''
        if (YOUR_PRICE_IDS.includes(priceId)) {
          const date = new Date(session.created * 1000)
          const amount = (session.amount_total || 0) / 100

          let productType = 'Unknown'
          if (priceId === envVars.NEXT_PUBLIC_STRIPE_PRICE_ID) productType = 'Main ($37)'
          else if (priceId === envVars.NEXT_PUBLIC_STRIPE_UPSELL_17_PRICE_ID) productType = 'Upsell ($17)'
          else if (priceId === envVars.NEXT_PUBLIC_STRIPE_UPSELL_7_PRICE_ID) productType = 'Downsell ($7)'

          allSales.push({
            type: 'Checkout Session',
            productType,
            amount,
            date: date.toLocaleString(),
            timestamp: session.created,
            email: session.customer_details?.email || 'No email',
            id: session.id,
          })
        }
      }
    }
  }

  // Check payment intents (upsells)
  for (const pi of paymentIntents.data) {
    if (pi.status === 'succeeded' && pi.metadata && pi.metadata.upsell_type) {
      const date = new Date(pi.created * 1000)
      const amount = (pi.amount || 0) / 100

      let productType = 'Unknown'
      if (pi.metadata.upsell_type === 'blueprint17') productType = 'Upsell ($17)'
      else if (pi.metadata.upsell_type === 'blueprint7') productType = 'Downsell ($7)'

      allSales.push({
        type: 'Payment Intent (1-click)',
        productType,
        amount,
        date: date.toLocaleString(),
        timestamp: pi.created,
        email: 'From 1-click',
        id: pi.id,
      })
    }
  }

  // Sort by timestamp
  allSales.sort((a, b) => a.timestamp - b.timestamp)

  console.log('═══════════════════════════════════════════════════════════')
  console.log('📊 AI FAST SCALE SALES FROM OCT 15, 2025:')
  console.log('═══════════════════════════════════════════════════════════')
  console.log(`✅ TOTAL SALES: ${allSales.length}`)
  console.log(`💰 TOTAL REVENUE: $${allSales.reduce((sum, sale) => sum + sale.amount, 0).toFixed(2)}`)
  console.log('═══════════════════════════════════════════════════════════\n')

  if (allSales.length > 0) {
    console.log('📋 ALL SALES DETAILS:\n')
    allSales.forEach((sale, i) => {
      console.log(`${i + 1}. ${sale.productType}`)
      console.log(`   Type: ${sale.type}`)
      console.log(`   Amount: $${sale.amount.toFixed(2)}`)
      console.log(`   Date: ${sale.date}`)
      console.log(`   Email: ${sale.email}`)
      console.log(`   ID: ${sale.id}`)
      console.log('')
    })
  } else {
    console.log('❌ No sales found from October 15, 2025')
  }
}

checkFromOct15().catch(console.error)
