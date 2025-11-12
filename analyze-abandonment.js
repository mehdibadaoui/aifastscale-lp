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

async function analyzeAbandonment() {
  console.log('🔍 DETAILED ABANDONMENT ANALYSIS\n')
  console.log('='.repeat(80))

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTimestamp = Math.floor(today.getTime() / 1000)
  const nowTimestamp = Math.floor(Date.now() / 1000)

  try {
    // Fetch ALL checkout sessions
    let allSessions = []
    let hasMore = true
    let startingAfter = undefined

    while (hasMore) {
      const params = {
        limit: 100,
        created: { gte: todayTimestamp, lte: nowTimestamp },
        expand: ['data.line_items']
      }
      if (startingAfter) params.starting_after = startingAfter

      const sessions = await stripe.checkout.sessions.list(params)
      allSessions = allSessions.concat(sessions.data)

      hasMore = sessions.has_more
      if (hasMore) startingAfter = sessions.data[sessions.data.length - 1].id
    }

    console.log(`Total Sessions Today: ${allSessions.length}\n`)

    // Group by time of day
    const hourlyData = {}
    for (let i = 0; i < 24; i++) {
      hourlyData[i] = { total: 0, paid: 0 }
    }

    allSessions.forEach(session => {
      const date = new Date(session.created * 1000)
      const hour = date.getHours()
      hourlyData[hour].total++
      if (session.payment_status === 'paid') hourlyData[hour].paid++
    })

    console.log('📊 CHECKOUT ACTIVITY BY HOUR:\n')
    Object.entries(hourlyData).forEach(([hour, data]) => {
      if (data.total > 0) {
        const hourFormatted = hour.padStart(2, '0') + ':00'
        const bar = '█'.repeat(Math.ceil(data.total / 2))
        console.log(`${hourFormatted} | ${bar} ${data.total} checkouts (${data.paid} paid)`)
      }
    })

    // Analyze WHAT people see on the checkout page
    console.log('\n' + '='.repeat(80))
    console.log('💳 CHECKOUT SESSION DETAILS (Last 5):\n')

    const recentSessions = allSessions.slice(0, 5)
    for (const session of recentSessions) {
      const time = new Date(session.created * 1000).toLocaleTimeString()
      console.log(`Session: ${session.id}`)
      console.log(`Time: ${time}`)
      console.log(`Status: ${session.status}`)
      console.log(`Payment Status: ${session.payment_status}`)
      console.log(`Email: ${session.customer_details?.email || 'Not provided'}`)
      console.log(`Amount: $${(session.amount_total / 100).toFixed(2)}`)
      console.log(`Currency: ${session.currency?.toUpperCase() || 'USD'}`)
      console.log(`Mode: ${session.mode}`)

      // Check metadata
      if (session.metadata && Object.keys(session.metadata).length > 0) {
        console.log(`Metadata:`, session.metadata)
      }

      // Check line items
      if (session.line_items?.data?.[0]) {
        const item = session.line_items.data[0]
        console.log(`Product: ${item.description}`)
        console.log(`Price ID: ${item.price?.id}`)
      }

      console.log(`Checkout URL: ${session.url}`)
      console.log('')
    }

    // Check for common issues
    console.log('='.repeat(80))
    console.log('⚠️  POTENTIAL ISSUES:\n')

    const issues = []

    // Check if all are same mode
    const testModeSessions = allSessions.filter(s => s.livemode === false)
    if (testModeSessions.length > 0) {
      issues.push(`❌ ${testModeSessions.length} sessions in TEST mode - customers can't pay with real cards!`)
    }

    // Check if emails are being collected
    const noEmailSessions = allSessions.filter(s => !s.customer_details?.email)
    if (noEmailSessions.length > 30) {
      issues.push(`⚠️  ${noEmailSessions.length}/${allSessions.length} sessions have no email - customers leaving immediately`)
    }

    // Check currency
    const currencies = [...new Set(allSessions.map(s => s.currency))]
    if (currencies.length > 1) {
      issues.push(`⚠️  Multiple currencies detected: ${currencies.join(', ')}`)
    }

    // Check if prices match expected
    const amounts = [...new Set(allSessions.map(s => s.amount_total))]
    if (!amounts.includes(3700)) {
      issues.push(`❌ Price mismatch! Expected $37.00 (3700 cents), got: ${amounts.map(a => `$${(a/100).toFixed(2)}`).join(', ')}`)
    }

    if (issues.length === 0) {
      console.log('✅ No obvious technical issues detected')
      console.log('\nThe problem is likely:')
      console.log('1. Checkout page is too intimidating/complicated')
      console.log('2. Price is too high for cold traffic')
      console.log('3. No trust signals on checkout')
      console.log('4. People need to see more proof before buying')
      console.log('5. Landing page oversold and checkout undersells')
    } else {
      issues.forEach(issue => console.log(issue))
    }

    console.log('\n' + '='.repeat(80))
    console.log('💡 RECOMMENDATIONS:\n')

    console.log('IMMEDIATE ACTIONS:')
    console.log('1. Test the checkout yourself RIGHT NOW')
    console.log('2. Check if Stripe is in Live mode (not Test mode)')
    console.log('3. Verify the price is showing as $37 USD')
    console.log('4. Make sure checkout page loads fast')
    console.log('5. Add trust badges to checkout page')

    console.log('\nLONGER TERM:')
    console.log('1. Add social proof on checkout')
    console.log('2. Show money-back guarantee prominently')
    console.log('3. Reduce friction (fewer form fields)')
    console.log('4. A/B test different prices')
    console.log('5. Add urgency (limited time, spots left, etc.)')

  } catch (error) {
    console.error('❌ ERROR:', error.message)
  }
}

analyzeAbandonment()
