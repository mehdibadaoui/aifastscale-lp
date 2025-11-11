// Test Facebook Ads API with production credentials
const fs = require('fs')
const path = require('path')

// Load production env
const envPath = path.join(__dirname, '.env.vercel.production')
const envContent = fs.readFileSync(envPath, 'utf8')
const envVars = {}
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    envVars[match[1].trim()] = match[2].trim()
  }
})

const accessToken = envVars.FACEBOOK_ACCESS_TOKEN
const adAccountId = envVars.FACEBOOK_AD_ACCOUNT_ID

console.log('🔍 Testing Facebook Ads API...\n')
console.log('Access Token:', accessToken ? `${accessToken.substring(0, 20)}...` : 'NOT FOUND')
console.log('Ad Account ID:', adAccountId || 'NOT FOUND')
console.log('')

if (!accessToken || !adAccountId) {
  console.error('❌ Missing credentials!')
  process.exit(1)
}

// Test the API
async function testFacebookAPI() {
  try {
    // Calculate date range (last 30 days)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)

    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = endDate.toISOString().split('T')[0]

    console.log(`Date Range: ${startDateStr} to ${endDateStr}\n`)

    // Call Facebook API
    const apiUrl = `https://graph.facebook.com/v18.0/${adAccountId}/insights`
    const params = new URLSearchParams({
      access_token: accessToken,
      time_range: JSON.stringify({
        since: startDateStr,
        until: endDateStr,
      }),
      level: 'account',
      fields: 'spend,impressions,clicks',
    })

    console.log('📡 Calling Facebook API...')
    console.log(`URL: ${apiUrl}`)
    console.log('')

    const response = await fetch(`${apiUrl}?${params.toString()}`)
    const data = await response.json()

    console.log('Status Code:', response.status)
    console.log('Response:', JSON.stringify(data, null, 2))
    console.log('')

    if (response.ok && data.data) {
      const totalSpend = data.data.reduce((sum, day) => sum + parseFloat(day.spend || '0'), 0)
      console.log('✅ SUCCESS!')
      console.log(`💰 Total Ad Spend: $${totalSpend.toFixed(2)}`)
      console.log(`📊 Data Points: ${data.data.length}`)
    } else if (data.error) {
      console.error('❌ FACEBOOK API ERROR:')
      console.error('Error Code:', data.error.code)
      console.error('Error Type:', data.error.type)
      console.error('Error Message:', data.error.message)
      console.error('')

      // Common errors
      if (data.error.code === 190) {
        console.error('🔧 FIX: Token expired or invalid')
        console.error('   Go to: https://developers.facebook.com/tools/debug/accesstoken/')
        console.error('   Paste token and click "Extend Access Token"')
      } else if (data.error.code === 100) {
        console.error('🔧 FIX: Invalid Ad Account ID')
        console.error('   Current ID:', adAccountId)
        console.error('   Check: https://business.facebook.com/adsmanager (Settings → Ad Account ID)')
        console.error('   Must start with "act_"')
      } else if (data.error.code === 17) {
        console.error('🔧 FIX: User request limit reached')
        console.error('   Wait a few minutes and try again')
      }
    }
  } catch (error) {
    console.error('❌ EXCEPTION:', error.message)
  }
}

testFacebookAPI()
