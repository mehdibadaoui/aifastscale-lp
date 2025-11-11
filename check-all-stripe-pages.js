// Check ALL Stripe data with pagination
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

async function checkAllStripePaginated() {
  console.log('🔍 Checking ALL Stripe data with PAGINATION...\n')

  let allSessions = []
  let hasMoreSessions = true
  let startingAfter = undefined

  // Fetch ALL checkout sessions with pagination
  while (hasMoreSessions) {
    const params = { limit: 100, expand: ['data.line_items'] }
    if (startingAfter) params.starting_after = startingAfter

    const sessions = await stripe.checkout.sessions.list(params)
    allSessions = allSessions.concat(sessions.data)

    hasMoreSessions = sessions.has_more
    if (hasMoreSessions) {
      startingAfter = sessions.data[sessions.data.length - 1].id
      console.log(`Fetched ${allSessions.length} sessions so far...`)
    }
  }

  console.log(`\n📦 TOTAL CHECKOUT SESSIONS: ${allSessions.length}`)

  // Fetch ALL payment intents with pagination
  let allPaymentIntents = []
  let hasMorePI = true
  let startingAfterPI = undefined

  while (hasMorePI) {
    const params = { limit: 100 }
    if (startingAfterPI) params.starting_after = startingAfterPI

    const pis = await stripe.paymentIntents.list(params)
    allPaymentIntents = allPaymentIntents.concat(pis.data)

    hasMorePI = pis.has_more
    if (hasMorePI) {
      startingAfterPI = pis.data[pis.data.length - 1].id
      console.log(`Fetched ${allPaymentIntents.length} payment intents so far...`)
    }
  }

  console.log(`📦 TOTAL PAYMENT INTENTS: ${allPaymentIntents.length}\n`)

  // Count PAID sessions
  const paidSessions = allSessions.filter(s => s.payment_status === 'paid')
  console.log(`✅ PAID CHECKOUT SESSIONS: ${paidSessions.length}`)

  // Count succeeded payment intents
  const succeededPIs = allPaymentIntents.filter(pi => pi.status === 'succeeded')
  console.log(`✅ SUCCEEDED PAYMENT INTENTS: ${succeededPIs.length}\n`)

  console.log('═══════════════════════════════════════════════════════════')
  console.log('📋 ALL PAID CHECKOUT SESSIONS:')
  console.log('═══════════════════════════════════════════════════════════')

  let totalRevenue = 0

  paidSessions.forEach((session, i) => {
    const date = new Date(session.created * 1000).toLocaleString()
    const amount = (session.amount_total || 0) / 100
    const email = session.customer_details?.email || 'No email'
    const lineItems = session.line_items?.data || []
    const priceId = lineItems[0]?.price?.id || 'Unknown'

    totalRevenue += amount

    console.log(`\n${i + 1}. Amount: $${amount.toFixed(2)}`)
    console.log(`   Email: ${email}`)
    console.log(`   Date: ${date}`)
    console.log(`   Price ID: ${priceId}`)
    console.log(`   Session ID: ${session.id}`)
  })

  console.log('\n═══════════════════════════════════════════════════════════')
  console.log('📋 ALL SUCCEEDED PAYMENT INTENTS:')
  console.log('═══════════════════════════════════════════════════════════')

  succeededPIs.forEach((pi, i) => {
    const date = new Date(pi.created * 1000).toLocaleString()
    const amount = (pi.amount || 0) / 100
    const description = pi.description || 'No description'

    totalRevenue += amount

    console.log(`\n${i + 1}. Amount: $${amount.toFixed(2)}`)
    console.log(`   Description: ${description}`)
    console.log(`   Date: ${date}`)
    console.log(`   Metadata:`, pi.metadata)
    console.log(`   Payment Intent ID: ${pi.id}`)
  })

  console.log('\n═══════════════════════════════════════════════════════════')
  console.log(`\n🏆 TOTAL LIFETIME SALES: ${paidSessions.length + succeededPIs.length}`)
  console.log(`💰 TOTAL LIFETIME REVENUE: $${totalRevenue.toFixed(2)}`)
  console.log('\n═══════════════════════════════════════════════════════════')
}

checkAllStripePaginated().catch(console.error)
