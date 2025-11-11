// Check ALL paid sessions (no filtering)
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

async function checkAllPaidSessions() {
  console.log('🔍 Checking ALL PAID CHECKOUT SESSIONS (no filtering)...\n')

  // Fetch ALL sessions (no date filter, no product filter)
  const sessions = await stripe.checkout.sessions.list({
    limit: 100,
    expand: ['data.line_items'],
  })

  console.log(`📦 Total checkout sessions fetched: ${sessions.data.length}\n`)

  // Filter only PAID sessions
  const paidSessions = sessions.data.filter(s => s.payment_status === 'paid')
  console.log(`✅ Total PAID sessions: ${paidSessions.length}\n`)

  // Show ALL paid sessions with details
  console.log('═══════════════════════════════════════════════════════════')
  console.log('📋 ALL PAID CHECKOUT SESSIONS (NO FILTERS):')
  console.log('═══════════════════════════════════════════════════════════')

  paidSessions.forEach((session, i) => {
    const date = new Date(session.created * 1000)
    const dateStr = date.toLocaleString()
    const amount = (session.amount_total || 0) / 100
    const email = session.customer_details?.email || 'No email'
    const lineItems = session.line_items?.data || []
    const priceId = lineItems[0]?.price?.id || 'Unknown'
    const productName = lineItems[0]?.description || 'Unknown Product'

    // Check if it's after Nov 1, 2025
    const nov1st2025 = new Date('2025-11-01T00:00:00Z')
    const isAfterNov1 = date >= nov1st2025

    console.log(`\n${i + 1}. Amount: $${amount.toFixed(2)}`)
    console.log(`   Email: ${email}`)
    console.log(`   Date: ${dateStr}`)
    console.log(`   After Nov 1, 2025? ${isAfterNov1 ? '✅ YES' : '❌ NO'}`)
    console.log(`   Product: ${productName}`)
    console.log(`   Price ID: ${priceId}`)
    console.log(`   Session ID: ${session.id}`)
  })

  console.log('\n═══════════════════════════════════════════════════════════')

  // Count sales after Nov 1, 2025
  const nov1st2025 = new Date('2025-11-01T00:00:00Z')
  const salesAfterNov1 = paidSessions.filter(s => {
    const date = new Date(s.created * 1000)
    return date >= nov1st2025
  })

  console.log(`\n📊 Sales after Nov 1, 2025: ${salesAfterNov1.length}`)
  console.log(`📊 Total revenue after Nov 1, 2025: $${salesAfterNov1.reduce((sum, s) => sum + (s.amount_total || 0) / 100, 0).toFixed(2)}`)

  // Now check Payment Intents
  console.log('\n\n═══════════════════════════════════════════════════════════')
  console.log('📋 CHECKING PAYMENT INTENTS (1-click upsells/downsells):')
  console.log('═══════════════════════════════════════════════════════════')

  const paymentIntents = await stripe.paymentIntents.list({
    limit: 100,
  })

  const succeededPIs = paymentIntents.data.filter(pi => pi.status === 'succeeded')
  console.log(`\n✅ Total succeeded payment intents: ${succeededPIs.length}`)

  // Show only those with upsell metadata
  const upsellPIs = succeededPIs.filter(pi => pi.metadata && pi.metadata.upsell_type)
  console.log(`💎 Payment intents with upsell_type: ${upsellPIs.length}\n`)

  upsellPIs.forEach((pi, i) => {
    const date = new Date(pi.created * 1000)
    const dateStr = date.toLocaleString()
    const amount = (pi.amount || 0) / 100

    const nov1st2025 = new Date('2025-11-01T00:00:00Z')
    const isAfterNov1 = date >= nov1st2025

    console.log(`\n${i + 1}. Amount: $${amount.toFixed(2)}`)
    console.log(`   Date: ${dateStr}`)
    console.log(`   After Nov 1, 2025? ${isAfterNov1 ? '✅ YES' : '❌ NO'}`)
    console.log(`   Upsell Type: ${pi.metadata.upsell_type}`)
    console.log(`   Payment Intent ID: ${pi.id}`)
  })

  console.log('\n═══════════════════════════════════════════════════════════')

  const upsellsAfterNov1 = upsellPIs.filter(pi => {
    const date = new Date(pi.created * 1000)
    return date >= nov1st2025
  })

  console.log(`\n🏆 TOTAL SALES AFTER NOV 1, 2025:`)
  console.log(`   Checkout Sessions: ${salesAfterNov1.length}`)
  console.log(`   1-Click Upsells/Downsells: ${upsellsAfterNov1.length}`)
  console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`   TOTAL: ${salesAfterNov1.length + upsellsAfterNov1.length}`)

  const totalRevenue = salesAfterNov1.reduce((sum, s) => sum + (s.amount_total || 0) / 100, 0) +
                       upsellsAfterNov1.reduce((sum, pi) => sum + (pi.amount || 0) / 100, 0)
  console.log(`   TOTAL REVENUE: $${totalRevenue.toFixed(2)}`)
  console.log('\n═══════════════════════════════════════════════════════════')
}

checkAllPaidSessions().catch(console.error)
