// Check ALL sales EVER (no date limit)
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

async function checkAllSalesEver() {
  console.log('🔍 Checking ALL SALES EVER (no date limit)...\n')

  // Fetch ALL sessions (no date filter)
  const sessions = await stripe.checkout.sessions.list({
    limit: 100,
    expand: ['data.line_items'],
  })

  // Fetch ALL payment intents (no date filter)
  const paymentIntents = await stripe.paymentIntents.list({
    limit: 100,
  })

  console.log(`📦 Total checkout sessions: ${sessions.data.length}`)
  console.log(`📦 Total payment intents: ${paymentIntents.data.length}\n`)

  // Count paid sales
  let paidSessions = 0
  let paidSessionsWithOurProducts = 0
  let paidUpsells = 0

  const allSales = []

  // Check sessions
  for (const session of sessions.data) {
    if (session.payment_status === 'paid') {
      paidSessions++
      const lineItems = session.line_items?.data || []

      for (const item of lineItems) {
        const priceId = item.price?.id || ''
        if (YOUR_PRICE_IDS.includes(priceId)) {
          paidSessionsWithOurProducts++
          const date = new Date(session.created * 1000).toLocaleString()
          const amount = (session.amount_total || 0) / 100

          let productType = 'Unknown'
          if (priceId === envVars.NEXT_PUBLIC_STRIPE_PRICE_ID) productType = 'Main ($37)'
          else if (priceId === envVars.NEXT_PUBLIC_STRIPE_UPSELL_17_PRICE_ID) productType = 'Upsell ($17)'
          else if (priceId === envVars.NEXT_PUBLIC_STRIPE_UPSELL_7_PRICE_ID) productType = 'Downsell ($7)'

          allSales.push({
            type: 'Checkout Session',
            productType,
            amount,
            date,
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
      paidUpsells++
      const date = new Date(pi.created * 1000).toLocaleString()
      const amount = (pi.amount || 0) / 100

      let productType = 'Unknown'
      if (pi.metadata.upsell_type === 'blueprint17') productType = 'Upsell ($17)'
      else if (pi.metadata.upsell_type === 'blueprint7') productType = 'Downsell ($7)'

      allSales.push({
        type: 'Payment Intent (1-click)',
        productType,
        amount,
        date,
        email: 'From 1-click',
        id: pi.id,
      })
    }
  }

  console.log('═══════════════════════════════════════════════════════════')
  console.log('📊 LIFETIME SALES SUMMARY:')
  console.log('═══════════════════════════════════════════════════════════')
  console.log(`✅ Total paid checkout sessions: ${paidSessions}`)
  console.log(`✅ Paid sessions with YOUR products: ${paidSessionsWithOurProducts}`)
  console.log(`✅ Paid 1-click upsells/downsells: ${paidUpsells}`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`🏆 TOTAL LIFETIME SALES: ${allSales.length}`)
  console.log('═══════════════════════════════════════════════════════════\n')

  if (allSales.length > 0) {
    console.log('📋 ALL SALES DETAILS:')
    console.log('═══════════════════════════════════════════════════════════')
    allSales.forEach((sale, i) => {
      console.log(`\n${i + 1}. ${sale.productType}`)
      console.log(`   Type: ${sale.type}`)
      console.log(`   Amount: $${sale.amount.toFixed(2)}`)
      console.log(`   Date: ${sale.date}`)
      console.log(`   Email: ${sale.email}`)
      console.log(`   ID: ${sale.id}`)
    })
    console.log('\n═══════════════════════════════════════════════════════════')

    const totalRevenue = allSales.reduce((sum, sale) => sum + sale.amount, 0)
    console.log(`\n💰 TOTAL LIFETIME REVENUE: $${totalRevenue.toFixed(2)}`)
  }
}

checkAllSalesEver().catch(console.error)
