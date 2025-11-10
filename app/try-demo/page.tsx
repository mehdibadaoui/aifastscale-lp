'use client'

import React, { useState, useRef } from 'react'
import { Upload, Sparkles, Video, ArrowRight, CheckCircle, Loader, Play, Download, AlertCircle } from 'lucide-react'
import Image from 'next/image'

export default function TryDemoPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [selectedScript, setSelectedScript] = useState('listing')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scripts = {
    listing: {
      name: 'New Listing Announcement',
      text: 'Hey everyone! I just listed this stunning 4-bedroom home in a prime location. This property features a modern kitchen, spacious backyard, and is move-in ready. Schedule your showing today before it\'s gone!',
    },
    market: {
      name: 'Market Update',
      text: 'Quick market update for you! Interest rates are still favorable, and inventory is moving fast in our area. If you\'ve been thinking about buying or selling, now is the perfect time. Let\'s chat about your real estate goals!',
    },
    tips: {
      name: 'Home Buying Tips',
      text: 'Here\'s my top tip for first-time home buyers: Get pre-approved before you start house hunting. It shows sellers you\'re serious and helps you move fast in competitive markets. Want to learn more? Reach out anytime!',
    },
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be less than 10MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
        setError('')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!uploadedImage) {
      setError('Please upload an image first')
      return
    }

    setIsGenerating(true)
    setError('')
    setProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 3000)

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: uploadedImage,
          script: scripts[selectedScript as keyof typeof scripts].text,
        }),
      })

      clearInterval(progressInterval)
      setProgress(100)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate video')
      }

      setGeneratedVideo(data.videoUrl)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    setUploadedImage(null)
    setGeneratedVideo(null)
    setError('')
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-black text-white">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                AgentClone™
              </span>
            </a>
            <a
              href="/"
              className="rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-2 text-sm font-bold text-black transition-all hover:scale-105"
            >
              Back to Home
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-2">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            <span className="text-sm font-bold text-yellow-400">FREE DEMO - TRY IT NOW</span>
          </div>
          <h1 className="mb-4 text-4xl font-black md:text-6xl">
            Turn Your Photo Into
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              AI Talking Video
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            See how AgentClone™ works in real-time. Upload your photo, choose a script, and watch AI create a professional talking video in minutes.
          </p>
        </div>

        {!generatedVideo ? (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column - Upload & Settings */}
            <div className="space-y-6">
              {/* Upload Image */}
              <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
                  <Upload className="h-6 w-6 text-yellow-400" />
                  Step 1: Upload Your Photo
                </h3>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />

                {!uploadedImage ? (
                  <label
                    htmlFor="image-upload"
                    className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-700 bg-gray-800/50 p-12 transition-all hover:border-yellow-500 hover:bg-gray-800"
                  >
                    <Upload className="mb-4 h-12 w-12 text-gray-500 transition-colors group-hover:text-yellow-400" />
                    <p className="mb-2 text-lg font-semibold text-gray-300">Click to upload your photo</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  </label>
                ) : (
                  <div className="relative">
                    <div className="overflow-hidden rounded-xl border border-yellow-500/30">
                      <Image
                        src={uploadedImage}
                        alt="Uploaded"
                        width={500}
                        height={500}
                        className="h-auto w-full object-cover"
                      />
                    </div>
                    <button
                      onClick={handleReset}
                      className="mt-3 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-300 transition-colors hover:bg-gray-700"
                    >
                      Change Photo
                    </button>
                  </div>
                )}
              </div>

              {/* Choose Script */}
              <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
                  <Video className="h-6 w-6 text-yellow-400" />
                  Step 2: Choose Your Script
                </h3>

                <div className="space-y-3">
                  {Object.entries(scripts).map(([key, script]) => (
                    <label
                      key={key}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-all ${
                        selectedScript === key
                          ? 'border-yellow-500 bg-yellow-500/10'
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="script"
                        value={key}
                        checked={selectedScript === key}
                        onChange={(e) => setSelectedScript(e.target.value)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="mb-1 font-bold text-white">{script.name}</p>
                        <p className="text-sm text-gray-400">{script.text}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!uploadedImage || isGenerating}
                className="group relative w-full overflow-hidden rounded-xl p-[2px] transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 opacity-75 blur transition-opacity group-hover:opacity-100"></div>
                <div className="relative flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-5 text-xl font-black text-black">
                  {isGenerating ? (
                    <>
                      <Loader className="h-6 w-6 animate-spin" />
                      <span>Generating Video...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-6 w-6" />
                      <span>Generate My Video</span>
                      <ArrowRight className="h-6 w-6" />
                    </>
                  )}
                </div>
              </button>

              {error && (
                <div className="flex items-center gap-3 rounded-lg border border-red-500/50 bg-red-500/10 p-4">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}
            </div>

            {/* Right Column - Preview & Info */}
            <div className="space-y-6">
              {/* Preview */}
              <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
                <h3 className="mb-4 text-xl font-bold">Preview</h3>

                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center rounded-xl bg-gray-800 p-12">
                    <Loader className="mb-4 h-12 w-12 animate-spin text-yellow-400" />
                    <p className="mb-2 text-lg font-semibold">Creating your AI video...</p>
                    <div className="mb-4 h-2 w-64 overflow-hidden rounded-full bg-gray-700">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-400">{progress}% complete</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl bg-gray-800 p-12">
                    <Video className="mb-4 h-16 w-16 text-gray-600" />
                    <p className="text-gray-500">Your video will appear here</p>
                  </div>
                )}
              </div>

              {/* What You'll Get */}
              <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-6">
                <h3 className="mb-4 text-xl font-bold">What You'll Get:</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-yellow-400" />
                    <span className="text-gray-300">Realistic AI talking video</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-yellow-400" />
                    <span className="text-gray-300">Natural voice & lip sync</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-yellow-400" />
                    <span className="text-gray-300">HD quality output</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-yellow-400" />
                    <span className="text-gray-300">Ready to share on social media</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Success View */
          <div className="space-y-8">
            {/* Generated Video */}
            <div className="rounded-2xl border border-yellow-500/30 bg-gray-900/50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-2xl font-bold">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                  Your Video is Ready!
                </h3>
                <button
                  onClick={handleReset}
                  className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-300 transition-colors hover:bg-gray-700"
                >
                  Create Another
                </button>
              </div>

              <div className="overflow-hidden rounded-xl">
                <video
                  src={generatedVideo}
                  controls
                  className="w-full"
                  autoPlay
                >
                  Your browser does not support video playback.
                </video>
              </div>

              <div className="mt-4 flex gap-3">
                <a
                  href={generatedVideo}
                  download
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-6 py-3 font-semibold transition-colors hover:bg-gray-700"
                >
                  <Download className="h-5 w-5" />
                  Download Video
                </a>
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 font-bold text-black transition-all hover:scale-105"
                  onClick={() => window.location.href = '/#pricing'}
                >
                  <Sparkles className="h-5 w-5" />
                  Get Full Course - $37
                </button>
              </div>
            </div>

            {/* CTA Section */}
            <div className="rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-8 text-center">
              <h3 className="mb-4 text-3xl font-black">
                Want to Create Unlimited Videos Like This?
              </h3>
              <p className="mx-auto mb-6 max-w-2xl text-lg text-gray-300">
                Learn the complete system to create AI talking videos in just 7 minutes. Get instant access to all templates, scripts, and training.
              </p>
              <div className="mb-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-yellow-500/30 bg-gray-900/50 p-4">
                  <p className="mb-1 text-3xl font-black text-yellow-400">$1,691</p>
                  <p className="text-sm text-gray-400">Total Value</p>
                </div>
                <div className="rounded-xl border border-yellow-500/30 bg-gray-900/50 p-4">
                  <p className="mb-1 text-3xl font-black text-green-400">$37</p>
                  <p className="text-sm text-gray-400">Today's Price</p>
                </div>
                <div className="rounded-xl border border-yellow-500/30 bg-gray-900/50 p-4">
                  <p className="mb-1 text-3xl font-black text-yellow-400">98%</p>
                  <p className="text-sm text-gray-400">Discount</p>
                </div>
              </div>
              <a
                href="/#pricing"
                className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-10 py-5 text-xl font-black text-black shadow-2xl transition-all hover:scale-105"
              >
                <Sparkles className="h-6 w-6" />
                Get Full Access - $37
                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
