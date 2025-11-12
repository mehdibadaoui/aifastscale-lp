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

async function auditTodayCheckouts() {
  console.log('🔍 AUDIT: Checking Today\'s Checkouts and Payment Failures\n')
  console.log('='.repeat(80))

  // Get today's timestamp
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTimestamp = Math.floor(today.getTime() / 1000)
  const nowTimestamp = Math.floor(Date.now() / 1000)

  console.log(`📅 Date Range: ${today.toLocaleDateString()} to now`)
  console.log('='.repeat(80))

  try {
    // 1. FETCH ALL CHECKOUT SESSIONS (both completed and incomplete)
    console.log('\n📊 FETCHING ALL CHECKOUT SESSIONS...\n')

    let allSessions = []
    let hasMore = true
    let startingAfter = undefined

    while (hasMore) {
      const params = {
        limit: 100,
        created: { gte: todayTimestamp, lte: nowTimestamp },
        expand: ['data.line_items', 'data.customer', 'data.payment_intent']
      }
      if (startingAfter) params.starting_after = startingAfter

      const sessions = await stripe.checkout.sessions.list(params)
      allSessions = allSessions.concat(sessions.data)

      hasMore = sessions.has_more
      if (hasMore) startingAfter = sessions.data[sessions.data.length - 1].id
    }

    console.log(`Total Checkout Sessions Today: ${allSessions.length}\n`)

    // 2. CATEGORIZE SESSIONS
    const paidSessions = allSessions.filter(s => s.payment_status === 'paid')
    const unpaidSessions = allSessions.filter(s => s.payment_status === 'unpaid')
    const incompleteSessions = allSessions.filter(s => s.status === 'open' || s.status === 'expired')

    console.log('📈 SESSION BREAKDOWN:')
    console.log(`  ✅ Paid (Successful): ${paidSessions.length}`)
    console.log(`  ❌ Unpaid: ${unpaidSessions.length}`)
    console.log(`  ⏳ Incomplete/Abandoned: ${incompleteSessions.length}`)
    console.log('')

    // 3. SHOW SUCCESSFUL SALES
    if (paidSessions.length > 0) {
      console.log('='.repeat(80))
      console.log('✅ TODAY\'S SUCCESSFUL SALES:\n')

      let totalRevenue = 0
      paidSessions.forEach((session, i) => {
        const amount = session.amount_total / 100
        totalRevenue += amount
        const time = new Date(session.created * 1000).toLocaleTimeString()

        console.log(`${i + 1}. $${amount.toFixed(2)} - ${session.customer_details?.email || 'No email'}`)
        console.log(`   Time: ${time}`)
        console.log(`   Payment Method: ${session.payment_method_types?.[0] || 'Unknown'}`)
        console.log('')
      })

      console.log(`💰 Total Revenue Today: $${totalRevenue.toFixed(2)}`)
    } else {
      console.log('='.repeat(80))
      console.log('❌ NO SALES TODAY - INVESTIGATING WHY...\n')
    }

    // 4. ANALYZE FAILED PAYMENTS
    console.log('='.repeat(80))
    console.log('🔍 CHECKING PAYMENT FAILURES...\n')

    // Fetch all payment intents from today
    let allPaymentIntents = []
    hasMore = true
    startingAfter = undefined

    while (hasMore) {
      const params = {
        limit: 100,
        created: { gte: todayTimestamp, lte: nowTimestamp }
      }
      if (startingAfter) params.starting_after = startingAfter

      const paymentIntents = await stripe.paymentIntents.list(params)
      allPaymentIntents = allPaymentIntents.concat(paymentIntents.data)

      hasMore = paymentIntents.has_more
      if (hasMore) startingAfter = paymentIntents.data[paymentIntents.data.length - 1].id
    }

    const failedPayments = allPaymentIntents.filter(pi =>
      pi.status === 'requires_payment_method' ||
      pi.status === 'canceled' ||
      pi.last_payment_error
    )

    console.log(`Total Payment Attempts: ${allPaymentIntents.length}`)
    console.log(`Failed Payment Attempts: ${failedPayments.length}\n`)

    if (failedPayments.length > 0) {
      console.log('❌ FAILED PAYMENTS DETAILS:\n')

      const errorCounts = {}

      failedPayments.forEach((pi, i) => {
        const time = new Date(pi.created * 1000).toLocaleTimeString()
        const amount = pi.amount / 100
        const errorMsg = pi.last_payment_error?.message || 'Unknown error'
        const errorCode = pi.last_payment_error?.code || 'unknown'

        // Count error types
        errorCounts[errorCode] = (errorCounts[errorCode] || 0) + 1

        console.log(`${i + 1}. Failed: $${amount.toFixed(2)}`)
        console.log(`   Time: ${time}`)
        console.log(`   Status: ${pi.status}`)
        console.log(`   Error: ${errorMsg}`)
        console.log(`   Error Code: ${errorCode}`)
        console.log('')
      })

      console.log('📊 ERROR BREAKDOWN:')
      Object.entries(errorCounts).forEach(([code, count]) => {
        console.log(`  ${code}: ${count} occurrences`)
      })
    }

    // 5. ANALYZE ABANDONED CHECKOUTS
    console.log('\n' + '='.repeat(80))
    console.log('🛒 ABANDONED CHECKOUTS ANALYSIS:\n')

    if (incompleteSessions.length > 0) {
      console.log(`Total Abandoned: ${incompleteSessions.length}\n`)

      incompleteSessions.forEach((session, i) => {
        const time = new Date(session.created * 1000).toLocaleTimeString()
        const amount = session.amount_total / 100

        console.log(`${i + 1}. Abandoned: $${amount.toFixed(2)}`)
        console.log(`   Time: ${time}`)
        console.log(`   Status: ${session.status}`)
        console.log(`   Email: ${session.customer_details?.email || 'Not provided'}`)
        console.log(`   URL: ${session.url || 'N/A'}`)
        console.log('')
      })

      // Calculate abandonment rate
      const abandonmentRate = (incompleteSessions.length / allSessions.length * 100).toFixed(1)
      console.log(`⚠️  Abandonment Rate: ${abandonmentRate}%`)
    } else {
      console.log('✅ No abandoned checkouts')
    }

    // 6. SUMMARY & RECOMMENDATIONS
    console.log('\n' + '='.repeat(80))
    console.log('📋 SUMMARY & RECOMMENDATIONS:\n')

    console.log(`Total Checkouts Initiated: ${allSessions.length}`)
    console.log(`Successful Purchases: ${paidSessions.length}`)
    console.log(`Conversion Rate: ${allSessions.length > 0 ? ((paidSessions.length / allSessions.length) * 100).toFixed(1) : 0}%`)
    console.log('')

    if (paidSessions.length === 0 && allSessions.length > 0) {
      console.log('🚨 CRITICAL ISSUE: You have checkouts but ZERO sales!\n')
      console.log('Possible Problems:')
      console.log('1. Payment processing errors')
      console.log('2. Checkout page not loading properly')
      console.log('3. Stripe test mode vs live mode mismatch')
      console.log('4. Webhook issues preventing order completion')
      console.log('5. Customers unable to complete payment')
    }

    if (failedPayments.length > 0) {
      console.log('\n⚠️  ACTION REQUIRED: Multiple payment failures detected')
      console.log('Check error codes above and fix issues ASAP')
    }

    if (incompleteSessions.length / allSessions.length > 0.5) {
      console.log('\n⚠️  HIGH ABANDONMENT RATE: Over 50% of customers are abandoning checkout')
      console.log('Possible causes:')
      console.log('- Checkout page too slow')
      console.log('- Unexpected costs (shipping, taxes)')
      console.log('- Complex checkout process')
      console.log('- Payment method issues')
    }

  } catch (error) {
    console.error('❌ ERROR:', error.message)
  }
}

auditTodayCheckouts()
