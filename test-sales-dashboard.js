// Test production sales dashboard
async function testSalesDashboard() {
  console.log('🧪 Testing PRODUCTION Sales Dashboard...\n')

  const apiUrl = 'https://aifastscale.com/api/get-sales'

  try {
    const response = await fetch(apiUrl)
    const data = await response.json()

    console.log('Status:', response.status)

    if (response.ok) {
      console.log('\n✅ SUCCESS!\n')

      console.log('📊 ALL-TIME TOTALS:')
      console.log(`  Total Sales: ${data.totalSales || 0}`)
      console.log(`  Total Revenue: $${data.totalRevenue?.toFixed(2) || '0.00'}`)

      if (data.sales && data.sales.length > 0) {
        console.log(`\n📋 Recent Sales (${data.sales.length}):`)
        data.sales.forEach((sale, i) => {
          console.log(`\n  ${i + 1}. ${sale.customerEmail}`)
          console.log(`     Amount: $${sale.amount}`)
          console.log(`     Product: ${sale.productName}`)
          console.log(`     Date: ${sale.date}`)
          console.log(`     Source: ${sale.trafficSource || 'Unknown'}`)
        })
      }
    } else {
      console.log('❌ Error:', data)
    }
  } catch (error) {
    console.error('❌ Exception:', error.message)
  }
}

testSalesDashboard()
