const token = "EAARSIFSzdwgBPZCZCe7kiR84Rmf4ZBfkUxuXDOkOXZCMWXePLLsX1ItoammXjAU4rrv3RNd9EO50DUR7uZABqPMoxqMZC4FqRMMHVdLM1epjwkVCv8kUFsE0eaTUdOZBLnNXX0ecEHslIWUyhh1p8WGj0Y4UBIQBsfZCrl59rMdUnUOpnZCwBsVNN6xZCLSy8NuXFZAuwRREI1P"
const accountId = "act_407580227258570"

async function testToken() {
  console.log('🧪 Testing NEW token...\n')

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)
  const endDate = new Date()

  const apiUrl = `https://graph.facebook.com/v18.0/${accountId}/insights`
  const params = new URLSearchParams({
    access_token: token,
    time_range: JSON.stringify({
      since: startDate.toISOString().split('T')[0],
      until: endDate.toISOString().split('T')[0],
    }),
    level: 'account',
    fields: 'spend,impressions,clicks',
  })

  const response = await fetch(`${apiUrl}?${params.toString()}`)
  const data = await response.json()

  console.log('Status:', response.status)

  if (response.ok && data.data) {
    const totalSpend = data.data.reduce((s, d) => s + parseFloat(d.spend || '0'), 0)
    const totalImpressions = data.data.reduce((s, d) => s + parseInt(d.impressions || '0'), 0)
    const totalClicks = data.data.reduce((s, d) => s + parseInt(d.clicks || '0'), 0)

    console.log('✅ SUCCESS!')
    console.log(`💰 Total Ad Spend: $${totalSpend.toFixed(2)}`)
    console.log(`👁️  Total Impressions: ${totalImpressions.toLocaleString()}`)
    console.log(`🖱️  Total Clicks: ${totalClicks.toLocaleString()}`)
    console.log(`📊 Data Points: ${data.data.length} days`)
  } else {
    console.log('❌ Error:', JSON.stringify(data, null, 2))
  }
}

testToken()
