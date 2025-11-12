// Test production FB Ads API
async function testProductionFB() {
  console.log('🧪 Testing PRODUCTION Facebook Ads API...\n')

  const apiUrl = 'https://aifastscale.com/api/analytics-roi'

  try {
    const response = await fetch(apiUrl)
    const data = await response.json()

    console.log('Status:', response.status)

    if (response.ok) {
      console.log('\n✅ SUCCESS!\n')

      if (data.channels && data.channels.length > 0) {
        console.log('📊 Traffic Sources:')
        data.channels.forEach(ch => {
          console.log(`\n  ${ch.channel}:`)
          console.log(`    Sales: ${ch.sales}`)
          console.log(`    Revenue: $${ch.revenue.toFixed(2)}`)
          console.log(`    Profit: $${ch.profit.toFixed(2)}`)
          console.log(`    Ad Spend: $${ch.spend.toFixed(2)}`)
          if (ch.spend > 0) {
            console.log(`    ROI: ${ch.roi.toFixed(1)}%`)
            console.log(`    ROAS: ${ch.roas.toFixed(2)}x`)
          }
        })
      }

      console.log('\n📈 TOTALS:')
      console.log(`  Total Sales: ${data.totals?.sales || 0}`)
      console.log(`  Total Revenue: $${data.totals?.revenue?.toFixed(2) || '0.00'}`)
      console.log(`  Total Ad Spend: $${data.totals?.spend?.toFixed(2) || '0.00'}`)
      console.log(`  Total Profit: $${data.totals?.profit?.toFixed(2) || '0.00'}`)

      console.log('\n🔌 Ad Platform Status:')
      console.log(`  Facebook Ads: ${data.adSpendConfigured?.facebook ? '✅ Configured' : '❌ Not Configured'}`)
      console.log(`  Google Ads: ${data.adSpendConfigured?.google ? '✅ Configured' : '❌ Not Configured'}`)
    } else {
      console.log('❌ Error:', data)
    }
  } catch (error) {
    console.error('❌ Exception:', error.message)
  }
}

testProductionFB()
