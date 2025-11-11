// Check for upsell/downsell payment intents (not checkout sessions)
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

async function checkPaymentIntents() {
  console.log('🔍 Checking Payment Intents (for 1-click upsells/downsells)...\n')

  // Fetch payment intents from November 1st
  const nov1st2024 = new Date('2024-11-01T00:00:00Z')
  const startTimestamp = Math.floor(nov1st2024.getTime() / 1000)

  const paymentIntents = await stripe.paymentIntents.list({
    limit: 100,
    created: {
      gte: startTimestamp,
    },
  })

  console.log(`📦 Total payment intents: ${paymentIntents.data.length}\n`)

  const upsellPayments = paymentIntents.data.filter(pi => {
    return pi.metadata && (pi.metadata.upsell_type || pi.metadata.type === 'oto' || pi.metadata.type === 'downsell')
  })

  console.log(`💎 Upsell/Downsell payments: ${upsellPayments.length}\n`)

  if (upsellPayments.length > 0) {
    console.log('═══════════════════════════════════════════════════════════')
    upsellPayments.forEach((pi, i) => {
      const date = new Date(pi.created * 1000).toLocaleString()
      const amount = (pi.amount || 0) / 100
      const status = pi.status

      console.log(`\n${i + 1}. Payment Intent: ${pi.id}`)
      console.log(`   Date: ${date}`)
      console.log(`   Amount: $${amount.toFixed(2)}`)
      console.log(`   Status: ${status}`)
      console.log(`   Description: ${pi.description || 'N/A'}`)
      console.log(`   Metadata:`, pi.metadata)
    })
    console.log('\n═══════════════════════════════════════════════════════════')
  } else {
    console.log('❌ No upsell/downsell payments found')
    console.log('\nThis means:')
    console.log('1. No customer has accepted an upsell/downsell yet, OR')
    console.log('2. The upsell/downsell payments are in checkout sessions (not payment intents)\n')
  }
}

checkPaymentIntents().catch(console.error)
