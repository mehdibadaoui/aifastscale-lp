import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// Track purchase data with selected bonuses
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    const {
      selectedBonuses = [],
      spinGift = null,
      timestamp = new Date().toISOString(),
      sessionId = null,
      productType = 'main',
    } = data

    // Create purchase record
    const purchaseRecord = {
      id: `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp,
      sessionId,
      productType,
      spinGift,
      selectedBonuses: selectedBonuses.map((bonus: any) => ({
        id: bonus.id,
        title: bonus.title,
        category: bonus.category || 'uncategorized',
      })),
      metadata: {
        userAgent: req.headers.get('user-agent'),
        referer: req.headers.get('referer'),
      },
    }

    // Save to JSON file in /tmp (Vercel serverless)
    const dataDir = '/tmp/purchase-data'
    const dataFile = path.join(dataDir, 'purchases.json')

    // Create directory if it doesn't exist
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }

    // Read existing data or create new array
    let purchases = []
    if (existsSync(dataFile)) {
      const fileContent = await readFile(dataFile, 'utf-8')
      purchases = JSON.parse(fileContent)
    }

    // Add new purchase
    purchases.push(purchaseRecord)

    // Keep only last 1000 purchases to prevent file from growing too large
    if (purchases.length > 1000) {
      purchases = purchases.slice(-1000)
    }

    // Save updated data
    await writeFile(dataFile, JSON.stringify(purchases, null, 2))

    console.log('✅ Purchase tracked:', purchaseRecord)

    return NextResponse.json({
      success: true,
      message: 'Purchase tracked successfully',
      recordId: purchaseRecord.id
    })
  } catch (error: any) {
    console.error('❌ Error tracking purchase:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// Get analytics data
export async function GET(req: NextRequest) {
  try {
    const dataFile = '/tmp/purchase-data/purchases.json'

    if (!existsSync(dataFile)) {
      return NextResponse.json({
        purchases: [],
        analytics: {
          totalPurchases: 0,
          topBonuses: [],
          categoryCounts: {},
        }
      })
    }

    const fileContent = await readFile(dataFile, 'utf-8')
    const purchases = JSON.parse(fileContent)

    // Calculate analytics
    const analytics = calculateAnalytics(purchases)

    return NextResponse.json({
      purchases: purchases.slice(-50), // Return last 50 purchases
      analytics,
      totalCount: purchases.length,
    })
  } catch (error: any) {
    console.error('❌ Error fetching analytics:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

function calculateAnalytics(purchases: any[]) {
  const bonusCounts: Record<string, number> = {}
  const categoryCounts: Record<string, number> = {}
  const giftCounts: Record<string, number> = {}

  purchases.forEach((purchase) => {
    // Count bonuses
    purchase.selectedBonuses?.forEach((bonus: any) => {
      const key = bonus.title
      bonusCounts[key] = (bonusCounts[key] || 0) + 1

      if (bonus.category) {
        categoryCounts[bonus.category] = (categoryCounts[bonus.category] || 0) + 1
      }
    })

    // Count spin gifts
    if (purchase.spinGift) {
      const giftKey = purchase.spinGift.title || purchase.spinGift
      giftCounts[giftKey] = (giftCounts[giftKey] || 0) + 1
    }
  })

  // Top bonuses (sorted by count)
  const topBonuses = Object.entries(bonusCounts)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Top gifts
  const topGifts = Object.entries(giftCounts)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count)

  return {
    totalPurchases: purchases.length,
    topBonuses,
    topGifts,
    categoryCounts,
    averageBonusesPerPurchase:
      purchases.length > 0
        ? purchases.reduce((sum, p) => sum + (p.selectedBonuses?.length || 0), 0) / purchases.length
        : 0,
  }
}
