import { NextRequest, NextResponse } from 'next/server'

// Google Veo 3 API integration
export async function POST(req: NextRequest) {
  try {
    const { image, script } = await req.json()

    if (!image || !script) {
      return NextResponse.json(
        { error: 'Image and script are required' },
        { status: 400 }
      )
    }

    // Get Google Cloud credentials from environment
    const googleApiKey = process.env.GOOGLE_CLOUD_API_KEY
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID

    if (!googleApiKey || !projectId) {
      console.error('Missing Google Cloud credentials')
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    // Convert base64 image to buffer
    const imageData = image.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(imageData, 'base64')

    console.log('📸 Generating video with Veo 3...')
    console.log('Script length:', script.length)
    console.log('Image size:', buffer.length, 'bytes')

    // Call Google Veo 3 API via Gemini/Vertex AI
    // Using Vertex AI endpoint for Veo 3
    const endpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/veo-3.1-generate-preview:predict`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${googleApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [
          {
            prompt: script,
            image: {
              bytesBase64Encoded: imageData,
            },
          },
        ],
        parameters: {
          // Veo 3 parameters
          sampleCount: 1,
          aspectRatio: '16:9',
          // Enable audio generation
          includeAudio: true,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Google Veo 3 API error:', errorData)

      // Return user-friendly error
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          { error: 'API authentication failed. Please check your Google Cloud setup.' },
          { status: 500 }
        )
      }

      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again in a few minutes.' },
          { status: 429 }
        )
      }

      return NextResponse.json(
        { error: 'Video generation failed. Please try again.' },
        { status: 500 }
      )
    }

    const data = await response.json()
    console.log('✅ Video generated successfully')

    // Extract video URL from response
    // The structure might vary, adjust based on actual API response
    const videoUrl = data.predictions?.[0]?.video?.bytesBase64Encoded ||
                     data.predictions?.[0]?.videoUri ||
                     null

    if (!videoUrl) {
      console.error('No video URL in response:', data)
      return NextResponse.json(
        { error: 'Video generation completed but no video URL received' },
        { status: 500 }
      )
    }

    // If video is base64, convert to blob URL
    // Otherwise return the URI directly
    let finalVideoUrl = videoUrl
    if (videoUrl.startsWith('data:') || !videoUrl.startsWith('http')) {
      // Video is base64 encoded
      finalVideoUrl = `data:video/mp4;base64,${videoUrl}`
    }

    return NextResponse.json({
      success: true,
      videoUrl: finalVideoUrl,
    })

  } catch (error: any) {
    console.error('Error generating video:', error)
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
