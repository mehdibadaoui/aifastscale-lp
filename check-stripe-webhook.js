// Check Stripe webhook configuration
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

async function checkWebhookConfig() {
  console.log('🔍 Checking Stripe webhook configuration...\\n')

  try {
    // List all webhooks
    const webhooks = await stripe.webhookEndpoints.list({ limit: 100 })

    console.log(`📡 Total webhooks configured: ${webhooks.data.length}\\n`)

    if (webhooks.data.length === 0) {
      console.log('❌ NO WEBHOOKS CONFIGURED!')
      console.log('\\nYou need to set up a webhook in Stripe Dashboard:')
      console.log('1. Go to: https://dashboard.stripe.com/webhooks')
      console.log('2. Click "Add endpoint"')
      console.log('3. Add your production URL: https://aifastscale.com/api/stripe-webhook')
      console.log('4. Select these events:')
      console.log('   - checkout.session.completed')
      console.log('   - payment_intent.succeeded')
      console.log('5. Copy the webhook secret and add to Vercel env vars\\n')
      return
    }

    // Check each webhook
    webhooks.data.forEach((webhook, i) => {
      console.log(`\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      console.log(`Webhook #${i + 1}:`)
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      console.log(`URL: ${webhook.url}`)
      console.log(`Status: ${webhook.status}`)
      console.log(`Created: ${new Date(webhook.created * 1000).toLocaleString()}`)
      console.log(`\\nEvents being listened to (${webhook.enabled_events.length} total):`)

      const importantEvents = [
        'checkout.session.completed',
        'payment_intent.succeeded',
      ]

      importantEvents.forEach(event => {
        const isListening = webhook.enabled_events.includes(event) || webhook.enabled_events.includes('*')
        const status = isListening ? '✅' : '❌'
        console.log(`  ${status} ${event}`)
      })

      if (webhook.enabled_events.includes('*')) {
        console.log('\\n  ℹ️  Listening to ALL events (*)\\n')
      }

      // Check if it's the production webhook
      const isProduction = webhook.url.includes('aifastscale.com')
      if (isProduction) {
        console.log('\\n🚀 This is your PRODUCTION webhook')
      }
    })

    console.log('\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\\n📋 RECOMMENDATIONS:\\n')

    const productionWebhook = webhooks.data.find(w => w.url.includes('aifastscale.com'))
    if (!productionWebhook) {
      console.log('⚠️  NO PRODUCTION WEBHOOK FOUND!')
      console.log('   Add webhook for: https://aifastscale.com/api/stripe-webhook\\n')
    } else {
      const hasCheckout = productionWebhook.enabled_events.includes('checkout.session.completed') || productionWebhook.enabled_events.includes('*')
      const hasPaymentIntent = productionWebhook.enabled_events.includes('payment_intent.succeeded') || productionWebhook.enabled_events.includes('*')

      if (!hasCheckout) {
        console.log('❌ Add event: checkout.session.completed')
      }
      if (!hasPaymentIntent) {
        console.log('❌ Add event: payment_intent.succeeded')
      }

      if (hasCheckout && hasPaymentIntent) {
        console.log('✅ All required events are configured!')
        console.log('✅ Telegram notifications will work for:')
        console.log('   - Main course sales ($37)')
        console.log('   - 1-click upsells ($17)')
        console.log('   - 1-click downsells ($7)\\n')
      }
    }
  } catch (error) {
    console.error('❌ Error checking webhooks:', error.message)
  }
}

checkWebhookConfig().catch(console.error)
