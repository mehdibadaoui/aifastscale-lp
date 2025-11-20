import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    // Extract form fields
    const email = formData.get('email') as string
    const script = formData.get('script') as string
    const phone = formData.get('phone') as string
    const instructions = formData.get('instructions') as string

    // Validation
    if (!email || !script) {
      return NextResponse.json(
        { error: 'Email and script are required' },
        { status: 400 }
      )
    }

    // Extract images
    const images: File[] = []
    for (let i = 0; i < 3; i++) {
      const image = formData.get(`image_${i}`) as File
      if (image) {
        images.push(image)
      }
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'dfy')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Save images to disk
    const savedImages: string[] = []
    for (const image of images) {
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Generate unique filename
      const timestamp = Date.now()
      const filename = `${timestamp}-${image.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const filepath = join(uploadsDir, filename)

      await writeFile(filepath, buffer)
      savedImages.push(`/uploads/dfy/${filename}`)

      console.log('✅ Image saved:', filename)
    }

    // Log submission
    console.log('📧 DFY Submission Received:')
    console.log({
      email,
      script: script.substring(0, 50) + '...',
      phone: phone || 'Not provided',
      instructions: instructions || 'None',
      imageCount: images.length,
      imagePaths: savedImages,
      timestamp: new Date().toISOString()
    })

    // TODO: Implement actual business logic:
    // 1. Send email notification to admin/team
    // 2. Send confirmation email to customer
    // 3. Save to database for tracking
    // 4. Log to Google Sheets (if using)
    // 5. Send Slack/Telegram notification

    // Example: Send to Google Sheets webhook (if you have one)
    /*
    const sheetsWebhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL
    if (sheetsWebhookUrl) {
      await fetch(sheetsWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          script,
          phone,
          instructions,
          imageCount: images.length,
          timestamp: new Date().toISOString()
        })
      })
    }
    */

    return NextResponse.json({
      success: true,
      message: 'Submission received successfully',
      data: {
        email,
        imageCount: images.length,
        submittedAt: new Date().toISOString()
      }
    })
  } catch (err: any) {
    console.error('DFY submission error:', err)

    return NextResponse.json(
      { error: err.message || 'Failed to process submission' },
      { status: 500 }
    )
  }
}
