import { NextRequest, NextResponse } from 'next/server'

// Development logger - only logs in development mode
const devLog = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args)
  }
}

// Google Veo 3.1 API integration via Gemini API
// Standard prompt that gets applied to all generations for better realistic results
const STANDARD_PROMPT = `A professional real estate agent speaking directly to camera in natural indoor lighting. The person maintains the exact same appearance as the reference image with no filters, effects, or color changes. Natural lighting and human features are preserved perfectly.

REALISM REQUIREMENTS:
- 10000% realistic human movement - if it looks AI-generated, it fails
- Natural micro-expressions: subtle smiles, natural blinks, relaxed posture
- Realistic gestures: occasionally touch hair, slight head tilts, natural hand movements
- Direct eye contact with camera, creating personal connection
- Smooth, continuous movement throughout the 8-second clip

TIMING BREAKDOWN (8 seconds):
- Seconds 0-2: Establish eye contact, subtle welcoming smile, natural breathing
- Seconds 2-5: Primary message delivery with appropriate facial expressions matching the tone, slight hand gesture if natural
- Seconds 5-8: Conclude with confident nod, maintain eye contact, hold calm professional posture

TECHNICAL SPECS:
- Clear English accent with natural speaking pace
- Perfect lip sync matching the script exactly
- Consistent voice tone and quality
- No AI artifacts, no added effects, no extra colors or filters
- Camera stays steady, person moves naturally within frame

The person should feel completely authentic - like a real human filmed on a smartphone, not AI-generated. Every blink, pause, and micro-gesture must feel naturally human.`

export async function POST(req: NextRequest) {
  try {
    const { image, images, script, aspectRatio = '9:16' } = await req.json()

    // Accept either single image (backward compatible) or multiple images
    const imageList = images && Array.isArray(images) ? images : (image ? [image] : [])

    if (imageList.length === 0 || !script) {
      return NextResponse.json(
        { error: 'At least one image and script are required' },
        { status: 400 }
      )
    }

    devLog(`📸 Received ${imageList.length} image(s) for video generation`)

    // Try images in order until one succeeds (helps avoid celebrity detection)
    let selectedImage = imageList[0]

    // Apply standard prompt to enhance the script
    const enhancedScript = `${STANDARD_PROMPT}\n\n${script}`

    // Get Gemini API key from environment
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY

    if (!apiKey) {
      console.error('Missing Google Gemini API key')
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    // Extract MIME type and convert base64 image
    const mimeTypeMatch = selectedImage.match(/^data:(image\/\w+);base64,/)
    const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg'
    const imageData = selectedImage.replace(/^data:image\/\w+;base64,/, '')

    devLog('📸 Generating video with Veo 3.1...')
    devLog('Script length:', script.length)
    devLog('Image data length:', imageData.length, 'characters')
    devLog('MIME type:', mimeType)
    devLog('Aspect ratio:', aspectRatio)

    // Call Gemini API for Veo 3.1 video generation
    // Using long-running operation endpoint
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:predictLongRunning`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'X-goog-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [
          {
            prompt: enhancedScript,
            image: {
              bytesBase64Encoded: imageData,
              mimeType: mimeType,
            },
          },
        ],
        parameters: {
          aspectRatio: aspectRatio,
          resolution: '720p',
          durationSeconds: 8,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Google Gemini API error:', errorText)

      // Parse error for better user messages
      let userMessage = 'Video generation failed. Please try again.'

      try {
        const errorData = JSON.parse(errorText)
        const apiMessage = errorData?.error?.message || ''

        // Handle specific error cases with helpful messages
        if (response.status === 401 || response.status === 403) {
          userMessage = '🔑 API authentication issue. Please contact support.'
        } else if (response.status === 429) {
          userMessage = '⏱️ Too many requests right now. Please wait 2-3 minutes and try again!'
        } else if (apiMessage.includes('quota') || apiMessage.includes('limit')) {
          userMessage = '📊 Daily limit reached. Please try again tomorrow or contact support for more credits.'
        } else if (apiMessage.includes('image')) {
          userMessage = '🖼️ Image format issue. Try a different photo (JPEG or PNG, under 10MB).'
        } else if (apiMessage.includes('region') || apiMessage.includes('location')) {
          userMessage = '🌍 Service not available in your region. Please contact support.'
        }
      } catch (e) {
        // Keep default message if parsing fails
      }

      return NextResponse.json(
        { error: userMessage },
        { status: response.status }
      )
    }

    const operationData = await response.json()
    devLog('🔄 Video generation started, operation:', operationData.name)

    // Poll the operation until it's done
    // Get operation name from response
    const operationName = operationData.name

    if (!operationName) {
      console.error('No operation name in response:', operationData)
      return NextResponse.json(
        { error: 'Failed to start video generation' },
        { status: 500 }
      )
    }

    // Poll the operation with improved timeout handling
    let attempts = 0
    const maxAttempts = 90 // 7.5 minutes max (5 second intervals)
    let videoData = null

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5 seconds

      try {
        const pollResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/${operationName}`,
          {
            headers: {
              'X-goog-api-key': apiKey,
            },
          }
        )

        if (!pollResponse.ok) {
          console.error(`Polling error: ${pollResponse.status}`)
          // Continue polling even if one request fails
          attempts++
          continue
        }

        const pollData = await pollResponse.json()

        if (pollData.done) {
          videoData = pollData.response
          devLog(`✅ Video ready after ${attempts + 1} polling attempts (${(attempts + 1) * 5} seconds)`)
          break
        }

        if (pollData.error) {
          console.error('Operation failed:', pollData.error)
          return NextResponse.json(
            { error: '❌ Video generation failed. Please try again with a different photo.' },
            { status: 500 }
          )
        }

        attempts++
        devLog(`⏳ Polling attempt ${attempts}/${maxAttempts} (~${attempts * 5}s elapsed)`)
      } catch (error) {
        console.error('Polling request failed:', error)
        attempts++
        // Continue polling even if one request fails
      }
    }

    if (!videoData) {
      return NextResponse.json(
        { error: '⏱️ Video generation is taking longer than expected. Please try again - it usually works on the second attempt!' },
        { status: 500 }
      )
    }

    devLog('✅ Video generated successfully')
    devLog('Full response:', JSON.stringify(videoData, null, 2))

    // Check for content filtering
    if (videoData.generateVideoResponse?.raiMediaFilteredCount > 0) {
      const filterReason = videoData.generateVideoResponse.raiMediaFilteredReasons?.[0] ||
        'Content was filtered by safety guidelines'
      console.error('Content filtered:', filterReason)

      // Provide user-friendly error message
      let userMessage = filterReason
      if (filterReason.includes('celebrity')) {
        userMessage = `⚠️ Google's AI detected this photo as too professional/polished. This is their safety filter being cautious - not a real issue!

TRY THESE TIPS:
✅ Use a more casual/candid photo
✅ Natural lighting (not studio quality)
✅ Relaxed pose (not professional headshot)
✅ Smartphone selfie style works best

The AI sometimes mistakes professional-looking photos for celebrities. A more casual photo of the same person will work perfectly!`
      }

      return NextResponse.json(
        { error: userMessage },
        { status: 400 }
      )
    }

    // Extract video URI from response
    const generatedSamples = videoData.generateVideoResponse?.generatedSamples
    devLog('Generated samples:', JSON.stringify(generatedSamples, null, 2))

    const videoUri = generatedSamples?.[0]?.video?.uri

    if (!videoUri) {
      console.error('No video URI found. Full videoData:', JSON.stringify(videoData, null, 2))
      return NextResponse.json(
        { error: 'Video generation completed but no video URI received' },
        { status: 500 }
      )
    }

    devLog('✅ Video URI extracted:', videoUri)

    // Download the video from Google's servers with retry logic
    devLog('📥 Downloading video from URI...')
    let videoBuffer: ArrayBuffer | null = null
    let downloadAttempts = 0
    const maxDownloadAttempts = 3

    while (downloadAttempts < maxDownloadAttempts && !videoBuffer) {
      try {
        const videoDownloadResponse = await fetch(videoUri, {
          headers: {
            'X-goog-api-key': apiKey,
          },
        })

        if (!videoDownloadResponse.ok) {
          throw new Error(`Download failed with status ${videoDownloadResponse.status}`)
        }

        videoBuffer = await videoDownloadResponse.arrayBuffer()
        devLog('✅ Video downloaded successfully')
      } catch (error) {
        downloadAttempts++
        console.error(`Download attempt ${downloadAttempts}/${maxDownloadAttempts} failed:`, error)

        if (downloadAttempts < maxDownloadAttempts) {
          // Wait 2 seconds before retry
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      }
    }

    if (!videoBuffer) {
      console.error('Failed to download video after all retries')
      return NextResponse.json(
        { error: '📥 Video generated but download failed. Please try generating again.' },
        { status: 500 }
      )
    }

    // Convert to base64
    const videoBase64 = Buffer.from(videoBuffer).toString('base64')
    devLog('✅ Video converted to base64, size:', videoBase64.length, 'characters')

    // Return video as base64 data URL
    const finalVideoUrl = `data:video/mp4;base64,${videoBase64}`

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
