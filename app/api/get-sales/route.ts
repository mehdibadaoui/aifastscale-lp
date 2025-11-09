import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Your product price IDs
const YOUR_PRICE_IDS = [
  process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!, // Main product: $37
  process.env.NEXT_PUBLIC_STRIPE_UPSELL_17_PRICE_ID!, // Upsell 1: $17
  process.env.NEXT_PUBLIC_STRIPE_UPSELL_7_PRICE_ID!, // Upsell 2: $7
]

// Product names mapping
const PRODUCT_NAMES: { [key: string]: string } = {
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!]: 'AI Fast Scale Course',
  [process.env.NEXT_PUBLIC_STRIPE_UPSELL_17_PRICE_ID!]: 'Upsell ($17)',
  [process.env.NEXT_PUBLIC_STRIPE_UPSELL_7_PRICE_ID!]: 'Downsell ($7)',
}

// Product types
const PRODUCT_TYPES: { [key: string]: string } = {
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!]: 'main',
  [process.env.NEXT_PUBLIC_STRIPE_UPSELL_17_PRICE_ID!]: 'upsell',
  [process.env.NEXT_PUBLIC_STRIPE_UPSELL_7_PRICE_ID!]: 'downsell',
}

export async function GET(request: Request) {
  try {
    // Parse query parameters for custom date range
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Default to last 30 days if no custom range
    const defaultStart = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60
    const customStart = startDate ? Math.floor(new Date(startDate).getTime() / 1000) : defaultStart
    const customEnd = endDate ? Math.floor(new Date(endDate).getTime() / 1000) : Math.floor(Date.now() / 1000)

    // Fetch all checkout sessions
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      created: {
        gte: customStart,
        lte: customEnd,
      },
      expand: ['data.line_items'],
    })

    console.log('Fetched sessions:', sessions.data.length)

    // Filter and process sales
    const yourSales: any[] = []

    for (const session of sessions.data) {
      if (session.payment_status !== 'paid') continue

      // Get line items to find the product
      const lineItems = session.line_items?.data || []

      for (const item of lineItems) {
        const priceId = item.price?.id || ''

        // Check if this is one of YOUR products
        if (YOUR_PRICE_IDS.includes(priceId)) {
          const productName = PRODUCT_NAMES[priceId] || 'Unknown Product'
          const productType = PRODUCT_TYPES[priceId] || 'unknown'

          // Extract UTM parameters from metadata
          const metadata = session.metadata || {}

          yourSales.push({
            id: session.id,
            sessionId: session.id,
            email: session.customer_details?.email || session.customer_email || 'No email',
            customerName: session.customer_details?.name || 'N/A',
            amount: session.amount_total || 0,
            product: productName,
            productType: productType,
            priceId: priceId,
            created: session.created,
            timestamp: session.created,
            status: session.payment_status,
            paymentMethod: session.payment_method_types?.[0] || 'card',
            // UTM tracking data
            utm_source: metadata.utm_source || '',
            utm_medium: metadata.utm_medium || '',
            utm_campaign: metadata.utm_campaign || '',
            utm_term: metadata.utm_term || '',
            utm_content: metadata.utm_content || '',
            fbclid: metadata.fbclid || '',
            gclid: metadata.gclid || '',
            traffic_source: metadata.traffic_source || 'Direct',
            referrer: metadata.referrer || '',
            landing_page: metadata.landing_page || '',
          })
        }
      }
    }

    console.log('Your sales found:', yourSales.length)

    // Calculate time ranges
    const now = Math.floor(Date.now() / 1000)
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayTimestamp = Math.floor(todayStart.getTime() / 1000)

    const yesterdayStart = new Date(todayStart)
    yesterdayStart.setDate(yesterdayStart.getDate() - 1)
    const yesterdayTimestamp = Math.floor(yesterdayStart.getTime() / 1000)

    const weekStart = new Date(todayStart)
    weekStart.setDate(weekStart.getDate() - 7)
    const weekTimestamp = Math.floor(weekStart.getTime() / 1000)

    const lastWeekStart = new Date(todayStart)
    lastWeekStart.setDate(lastWeekStart.getDate() - 14)
    const lastWeekTimestamp = Math.floor(lastWeekStart.getTime() / 1000)

    const monthStart = new Date(todayStart)
    monthStart.setDate(monthStart.getDate() - 30)
    const monthTimestamp = Math.floor(monthStart.getTime() / 1000)

    // Calculate stats
    const todaySales = yourSales.filter((sale) => sale.created >= todayTimestamp)
    const yesterdaySales = yourSales.filter(
      (sale) => sale.created >= yesterdayTimestamp && sale.created < todayTimestamp
    )
    const weekSales = yourSales.filter((sale) => sale.created >= weekTimestamp)
    const lastWeekSales = yourSales.filter(
      (sale) => sale.created >= lastWeekTimestamp && sale.created < weekTimestamp
    )
    const monthSales = yourSales

    // Calculate revenue
    const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.amount, 0)
    const yesterdayRevenue = yesterdaySales.reduce((sum, sale) => sum + sale.amount, 0)
    const weekRevenue = weekSales.reduce((sum, sale) => sum + sale.amount, 0)
    const lastWeekRevenue = lastWeekSales.reduce((sum, sale) => sum + sale.amount, 0)
    const monthRevenue = monthSales.reduce((sum, sale) => sum + sale.amount, 0)

    // Product breakdown
    const mainProductSales = yourSales.filter((s) => s.productType === 'main')
    const upsellSales = yourSales.filter((s) => s.productType === 'upsell')
    const downsellSales = yourSales.filter((s) => s.productType === 'downsell')

    const mainRevenue = mainProductSales.reduce((sum, s) => sum + s.amount, 0)
    const upsellRevenue = upsellSales.reduce((sum, s) => sum + s.amount, 0)
    const downsellRevenue = downsellSales.reduce((sum, s) => sum + s.amount, 0)

    // Average order value
    const avgOrderValue = yourSales.length > 0 ? monthRevenue / yourSales.length : 0

    // Format sales for display
    const formattedSales = yourSales
      .map((sale) => {
        const date = new Date(sale.created * 1000)
        return {
          id: sale.id,
          sessionId: sale.sessionId,
          email: sale.email,
          customerName: sale.customerName,
          amount: sale.amount,
          product: sale.product,
          productType: sale.productType,
          priceId: sale.priceId,
          timestamp: sale.created,
          date: date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          time: date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          fullDate: date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          status: 'paid',
          paymentMethod: sale.paymentMethod,
        }
      })
      .sort((a, b) => b.timestamp - a.timestamp)

    // Generate daily breakdown for charts (last 7 days)
    const dailyData: { [key: string]: { sales: number; revenue: number } } = {}
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      last7Days.push(dateStr)
      dailyData[dateStr] = { sales: 0, revenue: 0 }
    }

    // Fill in actual sales data
    yourSales.forEach((sale) => {
      const saleDate = new Date(sale.created * 1000)
      const dateStr = saleDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      if (dailyData[dateStr]) {
        dailyData[dateStr].sales += 1
        dailyData[dateStr].revenue += sale.amount
      }
    })

    const chartData = last7Days.map((date) => ({
      date,
      sales: dailyData[date]?.sales || 0,
      revenue: (dailyData[date]?.revenue || 0) / 100, // Convert to dollars
    }))

    return NextResponse.json({
      // Overall stats
      totalSales: yourSales.length,
      totalRevenue: monthRevenue,
      avgOrderValue: avgOrderValue,

      // Time-based stats
      today: {
        sales: todaySales.length,
        revenue: todayRevenue,
      },
      yesterday: {
        sales: yesterdaySales.length,
        revenue: yesterdayRevenue,
      },
      week: {
        sales: weekSales.length,
        revenue: weekRevenue,
      },
      lastWeek: {
        sales: lastWeekSales.length,
        revenue: lastWeekRevenue,
      },
      month: {
        sales: monthSales.length,
        revenue: monthRevenue,
      },

      // Product breakdown
      products: {
        main: {
          sales: mainProductSales.length,
          revenue: mainRevenue,
        },
        upsell: {
          sales: upsellSales.length,
          revenue: upsellRevenue,
        },
        downsell: {
          sales: downsellSales.length,
          revenue: downsellRevenue,
        },
      },

      // Chart data
      chartData: chartData,

      // All sales
      allSales: formattedSales,
    })
  } catch (error: any) {
    console.error('Error fetching sales:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch sales',
        message: error.message,
        totalSales: 0,
        totalRevenue: 0,
        avgOrderValue: 0,
        today: { sales: 0, revenue: 0 },
        yesterday: { sales: 0, revenue: 0 },
        week: { sales: 0, revenue: 0 },
        lastWeek: { sales: 0, revenue: 0 },
        month: { sales: 0, revenue: 0 },
        products: {
          main: { sales: 0, revenue: 0 },
          upsell: { sales: 0, revenue: 0 },
          downsell: { sales: 0, revenue: 0 },
        },
        chartData: [],
        allSales: [],
      },
      { status: 200 } // Return 200 so frontend doesn't break
    )
  }
}
