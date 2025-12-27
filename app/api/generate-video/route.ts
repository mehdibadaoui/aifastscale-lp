import { NextRequest, NextResponse } from 'next/server'
import { saveVideo } from '@/lib/db'
import { shouldBlock } from '@/app/config/blocklist'

// Helper to get client IP from Vercel/Cloudflare headers
function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp
  const cfIp = request.headers.get('cf-connecting-ip')
  if (cfIp) return cfIp
  return 'unknown'
}

// Development logger - only logs in development mode
const devLog = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args)
  }
}

// Google Veo 3.1 API integration via Gemini API
// Ultra-realism prompt for talking video generation
const STANDARD_PROMPT = `You are generating an ultra-realistic talking video from the reference image.
The video MUST look like the original photo came to life with ZERO visual changes.

IDENTITY LOCK:
Preserve the person's exact face, proportions, skin texture, hair, eyes, eyebrows, nose,
mouth, beard/makeup, clothing, lighting, shadows, background, posture, and body shape.
Do not modify ANYTHING. No enhancements, no color shifts, no smoothing, no filters,
no contrast/saturation changes, no AI beautification.

CAMERA:
Use the same framing, angle, lens feel, and distance as the original image.
Camera must stay perfectly still. No zoom, no pan, no reframing.

MOVEMENT (Universal Human Motion Map):
0–2s: natural blink, small micro-smile, subtle breathing.
2–5s: tiny head movement (1–3 cm), realistic micro-expressions.
If hands are visible → allow one minimal natural gesture.
If hands are not visible → keep upper body stable.
5–7s: relaxed confident expression, natural blink.
7–8s: return to a neutral pose and hold for continuity.

VOICE:
Voice must be natural, warm, and human—not robotic.
Lip sync must be frame-perfect.
Natural speaking pace with appropriate pauses.

BACKGROUND AUDIO:
Add subtle ambient sound that matches the environment in the photo
(office hum, restaurant murmur, room tone, outdoor air, etc.).
No music.

REALISM REQUIREMENTS:
– Skin texture and lighting must never change.
– Avoid floating heads or unnatural mouth shapes.
– Avoid over-animated movement; keep it subtle and human.
– Final video must feel like a REAL person speaking, not AI.
– Every blink, breath, and micro-expression must be naturally human.

If the output looks even slightly modified compared to the original image, regenerate.`

// Helper function to try generating video with a single image
async function tryGenerateWithImage(
  imageBase64: string,
  enhancedScript: string,
  aspectRatio: string,
  apiKey: string,
  imageIndex: number,
  totalImages: number
): Promise<{ success: boolean; videoUrl?: string; error?: string; isFilterError?: boolean }> {

  devLog(`🎬 Trying image ${imageIndex + 1}/${totalImages}...`)

  // Extract MIME type and convert base64 image
  const mimeTypeMatch = imageBase64.match(/^data:(image\/\w+);base64,/)
  const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg'
  const imageData = imageBase64.replace(/^data:image\/\w+;base64,/, '')

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:predictLongRunning`

  try {
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
      console.error(`Image ${imageIndex + 1} - Google API error:`, errorText)
      return { success: false, error: errorText, isFilterError: false }
    }

    const operationData = await response.json()
    const operationName = operationData.name

    if (!operationName) {
      return { success: false, error: 'No operation name', isFilterError: false }
    }

    devLog(`🔄 Image ${imageIndex + 1} - Operation started: ${operationName}`)

    // Poll the operation
    let attempts = 0
    const maxAttempts = 90
    let videoData = null

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000))

      try {
        const pollResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/${operationName}`,
          { headers: { 'X-goog-api-key': apiKey } }
        )

        if (!pollResponse.ok) {
          attempts++
          continue
        }

        const pollData = await pollResponse.json()

        if (pollData.done) {
          videoData = pollData.response
          devLog(`✅ Image ${imageIndex + 1} - Video ready after ${attempts + 1} polls`)
          break
        }

        if (pollData.error) {
          console.error(`Image ${imageIndex + 1} - Operation failed:`, pollData.error)
          return { success: false, error: pollData.error.message, isFilterError: false }
        }

        attempts++
      } catch (error) {
        attempts++
      }
    }

    if (!videoData) {
      return { success: false, error: 'Timeout', isFilterError: false }
    }

    // Check for content filtering (celebrity detection, etc.)
    if (videoData.generateVideoResponse?.raiMediaFilteredCount > 0) {
      const filterReason = videoData.generateVideoResponse.raiMediaFilteredReasons?.[0] || 'filtered'
      console.error(`Image ${imageIndex + 1} - Content filtered:`, filterReason)
      return { success: false, error: filterReason, isFilterError: true }
    }

    // Extract video URI
    const videoUri = videoData.generateVideoResponse?.generatedSamples?.[0]?.video?.uri

    if (!videoUri) {
      return { success: false, error: 'No video URI', isFilterError: false }
    }

    // Download video
    devLog(`📥 Image ${imageIndex + 1} - Downloading video...`)
    let videoBuffer: ArrayBuffer | null = null
    let downloadAttempts = 0

    while (downloadAttempts < 3 && !videoBuffer) {
      try {
        const videoDownloadResponse = await fetch(videoUri, {
          headers: { 'X-goog-api-key': apiKey },
        })

        if (videoDownloadResponse.ok) {
          videoBuffer = await videoDownloadResponse.arrayBuffer()
        }
      } catch (error) {
        downloadAttempts++
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
      downloadAttempts++
    }

    if (!videoBuffer) {
      return { success: false, error: 'Download failed', isFilterError: false }
    }

    const videoBase64 = Buffer.from(videoBuffer).toString('base64')
    const finalVideoUrl = `data:video/mp4;base64,${videoBase64}`

    devLog(`✅ Image ${imageIndex + 1} - SUCCESS!`)
    return { success: true, videoUrl: finalVideoUrl }

  } catch (error: any) {
    console.error(`Image ${imageIndex + 1} - Error:`, error)
    return { success: false, error: error.message, isFilterError: false }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { image, images, script, aspectRatio = '9:16', email, agentName, listingAddress } = await req.json()
    const clientIp = getClientIp(req)

    // Check if email OR IP is blocked - return fake "processing" error to not alert abuser
    if (shouldBlock(email, clientIp)) {
      console.log(`🚫 Blocked video generation - Email: ${email || 'none'}, IP: ${clientIp}`)
      // Return a generic error that looks normal
      return NextResponse.json(
        { error: 'Video generation is temporarily unavailable. Please try again later.' },
        { status: 503 }
      )
    }

    // Accept either single image (backward compatible) or multiple images
    const imageList = images && Array.isArray(images) ? images : (image ? [image] : [])

    if (imageList.length === 0 || !script) {
      return NextResponse.json(
        { error: 'At least one image and script are required' },
        { status: 400 }
      )
    }

    devLog(`📸 Received ${imageList.length} image(s) for video generation`)

    // Get Gemini API key from environment
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY

    if (!apiKey) {
      console.error('Missing Google Gemini API key')
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    // Apply standard prompt to enhance the script
    const enhancedScript = `${STANDARD_PROMPT}\n\n${script}`

    // Try each image in sequence until one succeeds
    let filterErrorCount = 0
    let lastError = ''

    for (let i = 0; i < imageList.length; i++) {
      const result = await tryGenerateWithImage(
        imageList[i],
        enhancedScript,
        aspectRatio,
        apiKey,
        i,
        imageList.length
      )

      if (result.success && result.videoUrl) {
        // Save video to database
        try {
          await saveVideo(email || 'anonymous', result.videoUrl, agentName, listingAddress)
        } catch (dbError) {
          console.log('Video save to DB failed (optional):', dbError)
        }

        // SUCCESS! Return the video
        return NextResponse.json({
          success: true,
          videoUrl: result.videoUrl,
          usedImageIndex: i + 1, // Which image worked (1-indexed for user display)
        })
      }

      // Track if this was a filter error (celebrity/professional photo detection)
      if (result.isFilterError) {
        filterErrorCount++
      }
      lastError = result.error || 'Unknown error'

      devLog(`❌ Image ${i + 1} failed, trying next...`)
    }

    // All images failed
    console.error(`All ${imageList.length} images failed. Filter errors: ${filterErrorCount}`)

    // If all images were filtered (celebrity detection), return special flag
    if (filterErrorCount === imageList.length) {
      return NextResponse.json(
        {
          error: 'All photos were filtered by our AI safety system. Please upload different photos with more casual poses and natural lighting.',
          allPhotosFailed: true,
          photosTried: imageList.length
        },
        { status: 400 }
      )
    }

    // Mixed errors or other failures
    return NextResponse.json(
      {
        error: 'Video generation failed after trying all photos. Please try again with different images.',
        allPhotosFailed: true,
        photosTried: imageList.length
      },
      { status: 500 }
    )

  } catch (error: any) {
    console.error('Error generating video:', error)
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
