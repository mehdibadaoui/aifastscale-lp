const token = "EAARSIFSzdwgBP6q9K6O5fTro23AV5pK1ggiFxiNmZAUmdPHVBLFVqghgcptzKgX4muPP1Ra7c5o4y0qEBx8j2PNDWZB48kpuZCPIASa6RFva2XNPeEMs8ri6NDdvyjQKWit8CDH2ddSPkdkQsp4ZAFLd5XkTyGikbgY4YgGYcMKZBj5CINZBqlnTZBKxNN3Alsl"

async function checkToken() {
  console.log('🔍 Checking token details...\n')

  // Debug token to see its info
  const debugUrl = `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${token}`
  const response = await fetch(debugUrl)
  const data = await response.json()

  console.log('Token Info:', JSON.stringify(data, null, 2))
}

checkToken()
