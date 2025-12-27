import { NextRequest, NextResponse } from 'next/server'

// Development logger
const devLog = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args)
  }
}

// Image generation prompt template for Nano Banana
const IMAGE_GENERATION_PROMPT = `You are generating a new ultra-realistic photograph of the person from the reference image.
The most important requirement is IDENTITY LOCK: the person must remain EXACTLY the same
in every output. Preserve all physical features with extreme precision:

– facial proportions (jawline, chin, cheekbones, forehead)
– eye shape, iris size, eyelid fold, eyebrow angle
– nose shape, nostril width
– lip shape and fullness
– hairline, hair texture, hair length
– skin tone, skin texture, pores, natural lines
– neck shape, shoulders, body proportions

ABSOLUTELY DO NOT alter or beautify the person. No slimming, no smoothing, no makeup changes,
no artistic style changes, no age reduction, no AI exaggeration. They must be instantly recognizable.

TRANSFORM ONLY the SCENE based on the user's scenario: {SCENARIO}.

Scene Requirements:
– Place the person naturally inside the new environment.
– Lighting on the face and body must MATCH the environment realistically.
– Shadows must be physically accurate.
– Clothing may adapt to the scenario but MUST stay realistic and consistent with the person's style.
– Body posture must remain natural and proportional.

Quality Requirements:
– Photorealistic, sharp, full detail.
– Professional photography style.
– Natural depth of field, correct perspective.

Avoid:
– AI artifacts
– distorted limbs
– cartoon or plastic skin
– mismatched lighting
– unrealistic poses
– identity drift`

export async function POST(req: NextRequest) {
  try {
    const { images, scenario } = await req.json()

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      )
    }

    if (!scenario) {
      return NextResponse.json(
        { error: 'Scenario is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY

    if (!apiKey) {
      console.error('Missing Google Gemini API key')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    devLog(`🖼️ Generating images for scenario: ${scenario}`)

    // Use the first image as reference (best quality one)
    const referenceImage = images[0]
    const mimeTypeMatch = referenceImage.match(/^data:(image\/\w+);base64,/)
    const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg'
    const imageData = referenceImage.replace(/^data:image\/\w+;base64,/, '')

    // Build the prompt with user's scenario
    const fullPrompt = IMAGE_GENERATION_PROMPT.replace('{SCENARIO}', scenario)

    // Generate 4 images using Nano Banana (free model: gemini-2.0-flash-exp)
    const generatedImages: string[] = []
    const errors: string[] = []

    // We'll make 4 separate requests since each generates 1 image
    for (let i = 0; i < 4; i++) {
      devLog(`🎨 Generating image ${i + 1}/4...`)

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-image-generation:generateContent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey,
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      inlineData: {
                        mimeType: mimeType,
                        data: imageData,
                      },
                    },
                    {
                      text: fullPrompt + `\n\nVariation ${i + 1}: Generate a unique angle or pose while keeping the EXACT same person.`,
                    },
                  ],
                },
              ],
              generationConfig: {
                responseModalities: ['TEXT', 'IMAGE'],
              },
            }),
          }
        )

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`Image ${i + 1} generation failed:`, errorText)
          errors.push(`Image ${i + 1}: ${errorText}`)
          continue
        }

        const data = await response.json()

        // Extract image from response
        const parts = data.candidates?.[0]?.content?.parts || []
        for (const part of parts) {
          if (part.inlineData?.mimeType?.startsWith('image/')) {
            const base64Image = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
            generatedImages.push(base64Image)
            devLog(`✅ Image ${i + 1} generated successfully`)
            break
          }
        }
      } catch (error: any) {
        console.error(`Image ${i + 1} error:`, error)
        errors.push(`Image ${i + 1}: ${error.message}`)
      }
    }

    if (generatedImages.length === 0) {
      return NextResponse.json(
        {
          error: 'Failed to generate any images. Please try again with a different photo.',
          details: errors
        },
        { status: 500 }
      )
    }

    devLog(`✅ Generated ${generatedImages.length}/4 images successfully`)

    return NextResponse.json({
      success: true,
      images: generatedImages,
      count: generatedImages.length,
    })

  } catch (error: any) {
    console.error('Error generating images:', error)
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
