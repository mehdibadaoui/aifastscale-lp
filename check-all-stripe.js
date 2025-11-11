// Check ALL Stripe sessions to find the missing downsell
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

async function checkAllSessions() {
  console.log('🔍 Checking ALL Stripe sessions since November 1st...\n')

  // Fetch sessions from November 1st
  const nov1st2024 = new Date('2024-11-01T00:00:00Z')
  const startTimestamp = Math.floor(nov1st2024.getTime() / 1000)

  const sessions = await stripe.checkout.sessions.list({
    limit: 100,
    created: {
      gte: startTimestamp,
    },
    expand: ['data.line_items'],
  })

  console.log(`📦 Total sessions: ${sessions.data.length}\n`)
  console.log('═══════════════════════════════════════════════════════════')

  sessions.data.forEach((session, i) => {
    const date = new Date(session.created * 1000).toLocaleString()
    const email = session.customer_details?.email || 'No email'
    const amount = (session.amount_total || 0) / 100
    const status = session.payment_status
    const lineItems = session.line_items?.data || []

    console.log(`\n${i + 1}. Session: ${session.id}`)
    console.log(`   Date: ${date}`)
    console.log(`   Email: ${email}`)
    console.log(`   Amount: $${amount.toFixed(2)}`)
    console.log(`   Status: ${status}`)

    if (lineItems.length > 0) {
      lineItems.forEach(item => {
        const priceId = item.price?.id || 'Unknown'
        const productName = item.description || 'Unknown Product'
        console.log(`   Product: ${productName}`)
        console.log(`   Price ID: ${priceId}`)

        // Check if it matches our permanent IDs
        if (priceId === envVars.NEXT_PUBLIC_STRIPE_PRICE_ID) {
          console.log(`   ✅ TRACKED: Main Course ($37)`)
        } else if (priceId === envVars.NEXT_PUBLIC_STRIPE_UPSELL_17_PRICE_ID) {
          console.log(`   ✅ TRACKED: Upsell ($17)`)
        } else if (priceId === envVars.NEXT_PUBLIC_STRIPE_UPSELL_7_PRICE_ID) {
          console.log(`   ✅ TRACKED: Downsell ($7)`)
        } else {
          console.log(`   ❌ NOT TRACKED: Old dynamic pricing`)
        }
      })
    } else {
      console.log(`   ⚠️  No line items`)
    }

    // Show metadata
    if (session.metadata && Object.keys(session.metadata).length > 0) {
      console.log(`   Metadata:`, session.metadata)
    }
  })

  console.log('\n═══════════════════════════════════════════════════════════')
}

checkAllSessions().catch(console.error)
