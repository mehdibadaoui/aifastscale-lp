const token = "EAARSIFSzdwgBP6q9K6O5fTro23AV5pK1ggiFxiNmZAUmdPHVBLFVqghgcptzKgX4muPP1Ra7c5o4y0qEBx8j2PNDWZB48kpuZCPIASa6RFva2XNPeEMs8ri6NDdvyjQKWit8CDH2ddSPkdkQsp4ZAFLd5XkTyGikbgY4YgGYcMKZBj5CINZBqlnTZBKxNN3Alsl"
const accountId = "act_407580227258570"

async function test() {
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
    fields: 'spend',
  })

  console.log('🧪 Testing CLEAN credentials...\n')
  const response = await fetch(`${apiUrl}?${params.toString()}`)
  const data = await response.json()

  console.log('Status:', response.status)
  if (response.ok && data.data) {
    const totalSpend = data.data.reduce((s, d) => s + parseFloat(d.spend || '0'), 0)
    console.log('✅ SUCCESS! Total Spend: $' + totalSpend.toFixed(2))
  } else {
    console.log('❌ Error:', data.error?.message || 'Unknown')
    console.log('Full response:', JSON.stringify(data, null, 2))
  }
}
test()
