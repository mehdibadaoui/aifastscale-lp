/**
 * Test Facebook Conversion API
 * Run this to verify the API is working correctly
 */

const crypto = require('crypto')

const PIXEL_ID = '806502898408304'
const ACCESS_TOKEN = process.env.META_CONVERSIONS_API_TOKEN || ''

function hashData(data) {
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex')
}

async function testFacebookConversionAPI() {
  console.log('🧪 Testing Facebook Conversion API...\n')

  if (!ACCESS_TOKEN) {
    console.error('❌ META_CONVERSIONS_API_TOKEN not set!')
    console.log('Run: source .env.vercel.production && node test-facebook-conversion-api.js')
    process.exit(1)
  }

  console.log('✅ Access token found')
  console.log('📌 Pixel ID:', PIXEL_ID)
  console.log('')

  // Create test event data
  const testEmail = 'test@example.com'
  const hashedEmail = hashData(testEmail)

  const eventData = {
    event_name: 'Purchase',
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: 'https://aifastscale.com/thank-you-confirmed',
    action_source: 'website',
    user_data: {
      em: hashedEmail,
      fn: hashData('Test'),
      ln: hashData('User'),
    },
    custom_data: {
      currency: 'USD',
      value: 37,
      content_name: 'AI Video Mastery Course (TEST)',
      content_category: 'main',
      num_items: 1,
    },
  }

  console.log('📤 Sending test Purchase event...')
  console.log('   Email (hashed):', hashedEmail)
  console.log('   Value: $37 USD')
  console.log('')

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [eventData],
          test_event_code: 'TEST12345', // Always use test mode for testing
        }),
      }
    )

    const result = await response.json()

    console.log('📥 Response from Facebook:')
    console.log(JSON.stringify(result, null, 2))
    console.log('')

    if (result.events_received === 1) {
      console.log('✅ SUCCESS! Facebook Conversion API is working!')
      console.log('')
      console.log('🔍 Check your events in Facebook Events Manager:')
      console.log('   https://business.facebook.com/events_manager2/list/pixel/' + PIXEL_ID)
      console.log('')
      console.log('📝 Look for test events with code: TEST12345')
      console.log('')
      console.log('🚀 Ready for production!')
    } else {
      console.log('❌ ERROR: Facebook did not receive the event')
      console.log('Response:', result)
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message)
  }
}

testFacebookConversionAPI()
