// Test script to verify tracking is working correctly
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
  envVars.NEXT_PUBLIC_STRIPE_PRICE_ID, // Main product: $37
  envVars.NEXT_PUBLIC_STRIPE_UPSELL_17_PRICE_ID, // Upsell 1: $17
  envVars.NEXT_PUBLIC_STRIPE_UPSELL_7_PRICE_ID, // Upsell 2: $7
]

async function testTracking() {
  console.log('🔍 Testing Sales Tracking...\n')
  console.log('✅ Configured Price IDs:')
  console.log(`   Main ($37):     ${envVars.NEXT_PUBLIC_STRIPE_PRICE_ID}`)
  console.log(`   Upsell ($17):   ${envVars.NEXT_PUBLIC_STRIPE_UPSELL_17_PRICE_ID}`)
  console.log(`   Downsell ($7):  ${envVars.NEXT_PUBLIC_STRIPE_UPSELL_7_PRICE_ID}`)
  console.log('')

  // Fetch sessions from November 1st
  const nov1st2024 = new Date('2024-11-01T00:00:00Z')
  const startTimestamp = Math.floor(nov1st2024.getTime() / 1000)

  console.log(`📅 Fetching all sessions since November 1st, 2024...\n`)

  const sessions = await stripe.checkout.sessions.list({
    limit: 100,
    created: {
      gte: startTimestamp,
    },
    expand: ['data.line_items'],
  })

  console.log(`📦 Total sessions found: ${sessions.data.length}\n`)

  // Analyze sessions
  let mainSales = 0
  let upsellSales = 0
  let downsellSales = 0
  let unknownSales = 0

  const salesDetails = []

  for (const session of sessions.data) {
    if (session.payment_status !== 'paid') continue

    const lineItems = session.line_items?.data || []

    for (const item of lineItems) {
      const priceId = item.price?.id || ''
      const amount = session.amount_total || 0
      const email = session.customer_details?.email || 'No email'
      const date = new Date(session.created * 1000).toLocaleString()

      if (YOUR_PRICE_IDS.includes(priceId)) {
        // This sale WILL be tracked
        if (priceId === envVars.NEXT_PUBLIC_STRIPE_PRICE_ID) {
          mainSales++
          salesDetails.push({ type: '✅ Main ($37)', email, amount, date, priceId })
        } else if (priceId === envVars.NEXT_PUBLIC_STRIPE_UPSELL_17_PRICE_ID) {
          upsellSales++
          salesDetails.push({ type: '✅ Upsell ($17)', email, amount, date, priceId })
        } else if (priceId === envVars.NEXT_PUBLIC_STRIPE_UPSELL_7_PRICE_ID) {
          downsellSales++
          salesDetails.push({ type: '✅ Downsell ($7)', email, amount, date, priceId })
        }
      } else {
        // This sale will NOT be tracked (old dynamic pricing)
        unknownSales++
        salesDetails.push({ type: '❌ NOT TRACKED', email, amount, date, priceId })
      }
    }
  }

  console.log('📊 TRACKING SUMMARY:')
  console.log('═══════════════════════════════════════════════════')
  console.log(`✅ Main Course ($37):       ${mainSales} sales`)
  console.log(`✅ Upsell ($17):            ${upsellSales} sales`)
  console.log(`✅ Downsell ($7):           ${downsellSales} sales`)
  console.log(`❌ NOT TRACKED (old):       ${unknownSales} sales`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`📈 TOTAL TRACKED:           ${mainSales + upsellSales + downsellSales} sales`)
  console.log('═══════════════════════════════════════════════════\n')

  if (unknownSales > 0) {
    console.log('⚠️  WARNING: Old sales with dynamic pricing detected!')
    console.log('   These sales exist in Stripe but won\'t show in dashboard.')
    console.log('   All NEW sales from now on will be tracked correctly! ✅\n')
  }

  console.log('📋 DETAILED SALES LIST:')
  console.log('═══════════════════════════════════════════════════')
  salesDetails.forEach((sale, i) => {
    console.log(`${i + 1}. ${sale.type}`)
    console.log(`   Email: ${sale.email}`)
    console.log(`   Amount: $${(sale.amount / 100).toFixed(2)}`)
    console.log(`   Date: ${sale.date}`)
    console.log(`   Price ID: ${sale.priceId}`)
    console.log('')
  })
}

testTracking().catch(console.error)
