'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Upload, Sparkles, Video, ArrowRight, CheckCircle, Loader, Download, AlertCircle, X, Shield, Clock, Zap, ChevronRight, Home, TrendingUp, Lightbulb, PenLine, Smartphone, Monitor, Star, Plus, Users, Play, ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import DemoEmailCaptureModal from './try-demo/DemoEmailCaptureModal'
import FullSalesContent from './try-demo/FullSalesContent'

export default function HomePage() {
  // Step wizard state
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [selectedScript, setSelectedScript] = useState<string | null>(null)
  const [customScript, setCustomScript] = useState('')
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16')

  // Common state
  const [isGenerating, setIsGenerating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [hasAttemptedGeneration, setHasAttemptedGeneration] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Live counter
  const [liveCount, setLiveCount] = useState(2847)

  // Update live count periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + 1)
    }, 45000)
    return () => clearInterval(interval)
  }, [])

  // Clear error when step changes
  useEffect(() => {
    setError('')
    setHasAttemptedGeneration(false)
  }, [currentStep])

  const scripts = [
    { id: 'intro', icon: Sparkles, iconColor: 'text-violet-500', iconBg: 'bg-gradient-to-br from-violet-100 to-indigo-100', name: 'Personal Introduction', text: "Hi, I'm your local real estate expert. Whether you're buying or selling, I'm here to help you every step of the way. Let's connect!", badge: 'Most Popular', badgeColor: 'bg-violet-500' },
    { id: 'listing', icon: Home, iconColor: 'text-emerald-500', iconBg: 'bg-gradient-to-br from-emerald-100 to-green-100', name: 'Hot Property Alert', text: "Just listed! This stunning home won't last long. Beautiful finishes, prime location, and priced to sell. DM me for a private showing!", badge: 'High Converting', badgeColor: 'bg-emerald-500' },
  ]

  const customScriptWordCount = customScript.trim().split(/\s+/).filter(Boolean).length
  const maxWords = 25

  // Compress image
  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = document.createElement('img')
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (!ctx) { reject(new Error('Failed to get canvas context')); return }
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', quality))
        }
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (file.size > 10 * 1024 * 1024) { setError('Photo is too large. Please use one under 10MB.'); return }
    if (!validTypes.includes(file.type)) { setError('Please use a JPEG, PNG, or WebP image.'); return }
    if (uploadedImages.length >= 3) { setError('Maximum 3 photos allowed.'); return }

    setIsUploading(true)
    try {
      const compressedImage = await compressImage(file, 800, 0.7)
      setUploadedImages(prev => [...prev, compressedImage])
      setError('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      setError('Failed to process image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleScriptSelect = (scriptId: string) => {
    setSelectedScript(scriptId)
    setError('')
    if (scriptId !== 'custom') {
      setTimeout(() => setCurrentStep(3), 300)
    }
  }

  // Generate video
  const handleGenerateVideo = async () => {
    if (uploadedImages.length === 0) {
      setError('Please upload at least 2 photos')
      setCurrentStep(1)
      return
    }

    const scriptText = selectedScript === 'custom' ? customScript : scripts.find(s => s.id === selectedScript)?.text || ''

    if (!scriptText) {
      setError('Please select or write a script')
      return
    }

    setIsGenerating(true)
    setHasAttemptedGeneration(true)
    setError('')
    setProgress(0)

    const progressInterval = setInterval(() => {
      setProgress(prev => prev >= 90 ? 90 : prev + Math.random() * 15)
    }, 2000)

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: uploadedImages, script: scriptText, aspectRatio }),
      })

      clearInterval(progressInterval)
      setProgress(100)

      const data = await response.json()
      if (!response.ok) {
        if (data.allPhotosFailed) {
          throw new Error('Our AI needs different photos. Try casual selfies with natural lighting!')
        }
        throw new Error(data.error || 'Failed to generate video')
      }

      setGeneratedVideo(data.videoUrl)
      setShowEmailModal(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      clearInterval(progressInterval)
      setIsGenerating(false)
    }
  }

  const handleEmailSubmit = (email: string) => {
    setUserEmail(email)
    setShowEmailModal(false)
    // Video stays in state (generatedVideo) - no redirect needed
    // The page will show the success view with full sales content
  }

  // Progress tips
  const progressTips = [
    { threshold: 0, text: 'Analyzing your photo...' },
    { threshold: 20, text: 'Creating facial movements...' },
    { threshold: 40, text: 'Syncing lip movements...' },
    { threshold: 60, text: 'Adding natural expressions...' },
    { threshold: 80, text: 'Finalizing your video...' },
  ]
  const currentTip = progressTips.filter(t => progress >= t.threshold).pop()

  // Get CTA text based on step
  const getStepCTA = () => {
    if (currentStep === 1) {
      if (uploadedImages.length < 2) return { text: `Upload ${2 - uploadedImages.length} more photo${uploadedImages.length === 1 ? '' : 's'}`, disabled: true }
      return { text: `Continue with ${uploadedImages.length} photos`, disabled: false, action: () => setCurrentStep(2) }
    }
    if (currentStep === 2) {
      if (!selectedScript) return { text: 'Select a script', disabled: true }
      if (selectedScript === 'custom' && !customScript.trim()) return { text: 'Write your script', disabled: true }
      if (selectedScript === 'custom' && customScriptWordCount > maxWords) return { text: 'Script too long', disabled: true }
      return { text: 'Continue to preview', disabled: false, action: () => setCurrentStep(3) }
    }
    // Step 3 - Check for error state
    if (error && hasAttemptedGeneration) {
      return {
        text: 'Upload New Photos',
        disabled: false,
        action: () => {
          setUploadedImages([])
          setError('')
          setHasAttemptedGeneration(false)
          setCurrentStep(1)
        },
        isError: true
      }
    }
    return { text: 'Create My Video', disabled: false, action: handleGenerateVideo }
  }

  const ctaInfo = getStepCTA()

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fafafa]">
      {/* Modern Gradient Background */}
      <div className="pointer-events-none fixed inset-0" style={{ zIndex: 1 }}>
        {/* Soft top gradient glow */}
        <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-violet-100/80 via-indigo-50/40 to-transparent" />

        {/* Animated gradient orb - top right */}
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] animate-glow rounded-full bg-gradient-to-br from-violet-200/50 via-indigo-200/30 to-transparent blur-[80px]" />

        {/* Animated gradient orb - bottom left */}
        <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] animate-glow-delayed rounded-full bg-gradient-to-tr from-blue-200/40 via-cyan-100/20 to-transparent blur-[80px]" />

        {/* Subtle center glow */}
        <div className="absolute left-1/2 top-1/3 h-[300px] w-[600px] -translate-x-1/2 animate-pulse-slow rounded-full bg-gradient-to-r from-purple-100/30 via-violet-100/40 to-indigo-100/30 blur-[100px]" />

        {/* Dot pattern overlay */}
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(139,92,246,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      </div>
      {/* Header - Optimized for all devices */}
      <header className="relative z-10 sticky top-0 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="flex items-center justify-between">
            {/* Back button on mobile when not on step 1 */}
            {currentStep > 1 && !generatedVideo && !isGenerating ? (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-slate-600 hover:bg-slate-100 sm:hidden"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Back</span>
              </button>
            ) : (
              <a href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 sm:h-9 sm:w-9">
                  <Sparkles className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                </div>
                <span className="text-lg font-bold text-slate-900 sm:text-xl">AgentClone</span>
              </a>
            )}

            {/* Live counter - Always visible */}
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 sm:gap-2 sm:px-4 sm:py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-emerald-700 sm:text-sm">{liveCount.toLocaleString()} created</span>
            </div>

            {/* Desktop link to learn more */}
            <a href="/clean" className="hidden rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 sm:block">
              Learn More
            </a>
          </div>
        </div>
      </header>

      
      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-4xl px-3 py-6 pb-36 sm:px-4 sm:py-8 sm:pb-12 md:py-12 lg:pb-12">
        {!generatedVideo || !userEmail ? (
          <>
            {/* Hero - Responsive sizing */}
            <div className="mb-6 text-center sm:mb-8 md:mb-12">
              <h1 className="mb-2 text-2xl font-black text-slate-900 sm:mb-3 sm:text-4xl md:text-5xl">
                Turn Your Photo Into
                <span className="block bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">a Talking AI Video</span>
              </h1>
              <p className="mx-auto max-w-xl text-sm text-slate-600 sm:text-base md:text-lg">
                Upload your selfie, pick a script, and get a realistic talking video in 3 minutes.
              </p>
            </div>

            {/* Progress Steps - Clean and clear */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-center">
                {[1, 2, 3].map((step) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => step < currentStep && setCurrentStep(step)}
                        disabled={step > currentStep}
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all sm:h-11 sm:w-11 md:h-12 md:w-12 ${
                          currentStep === step
                            ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200'
                            : currentStep > step
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {currentStep > step ? (
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : step}
                      </button>
                      <span className={`mt-1.5 text-xs font-medium sm:mt-2 sm:text-sm ${
                        currentStep === step ? 'text-violet-600 font-semibold' : currentStep > step ? 'text-emerald-600' : 'text-slate-400'
                      }`}>
                        {step === 1 ? 'Upload' : step === 2 ? 'Script' : 'Create'}
                      </span>
                    </div>
                    {step < 3 && (
                      <div className={`mx-2 h-0.5 w-8 rounded-full sm:mx-3 sm:w-12 md:w-16 ${currentStep > step ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="mx-auto max-w-2xl">
              {/* Step 1: Upload Photos */}
              {currentStep === 1 && (
                <div className="animate-fade-in rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:p-6 md:p-8">
                  <div className="mb-5 text-center sm:mb-6">
                    <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 sm:mb-3 sm:h-14 sm:w-14 sm:rounded-2xl">
                      <Upload className="h-6 w-6 text-violet-600 sm:h-7 sm:w-7" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 sm:text-xl md:text-2xl">Upload Your Selfie</h2>
                    <p className="mt-1 text-sm text-slate-500">Upload 2-3 photos of yourself (not listings)</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      100% FREE - No credit card needed
                    </div>
                  </div>

                  {/* Photo counter - Clearer on mobile */}
                  <div className="mb-4 flex items-center justify-center gap-2 sm:gap-3">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all sm:h-10 sm:w-10 ${
                        uploadedImages.length > i
                          ? 'bg-emerald-500 text-white'
                          : i < 2
                          ? 'border-2 border-dashed border-violet-300 text-violet-400'
                          : 'border-2 border-dashed border-slate-200 text-slate-300'
                      }`}>
                        {uploadedImages.length > i ? <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" /> : i + 1}
                      </div>
                    ))}
                    <span className="ml-1 text-sm text-slate-500 sm:ml-2">
                      {uploadedImages.length}/3 {uploadedImages.length < 2 && <span className="font-medium text-violet-600">(need {2 - uploadedImages.length})</span>}
                    </span>
                  </div>

                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />

                  {/* Uploaded images grid - Better mobile layout */}
                  {uploadedImages.length > 0 && (
                    <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-3">
                      {uploadedImages.map((img, index) => (
                        <div key={index} className="group relative">
                          <div className="relative aspect-square overflow-hidden rounded-xl border-2 border-emerald-500 sm:rounded-2xl">
                            <Image src={img} alt={`Photo ${index + 1}`} fill className="object-cover" />
                            <div className="absolute left-1 top-1 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white sm:px-2 sm:text-xs">#{index + 1}</div>
                          </div>
                          {/* Delete button - Always visible on mobile */}
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-transform active:scale-95 sm:-right-2 sm:-top-2 sm:h-7 sm:w-7 sm:opacity-0 sm:group-hover:opacity-100"
                          >
                            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      ))}
                      {uploadedImages.length < 3 && (
                        <label
                          htmlFor="image-upload"
                          className={`flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all sm:rounded-2xl ${isUploading ? 'border-violet-400 bg-violet-50' : 'border-slate-300 bg-slate-50 hover:border-violet-400 hover:bg-violet-50 active:bg-violet-100'}`}
                        >
                          {isUploading ? (
                            <Loader className="h-6 w-6 animate-spin text-violet-500" />
                          ) : (
                            <>
                              <Plus className="h-6 w-6 text-slate-400" />
                              <span className="mt-1 text-xs text-slate-500">Add</span>
                            </>
                          )}
                        </label>
                      )}
                    </div>
                  )}

                  {/* Empty upload state */}
                  {uploadedImages.length === 0 && (
                    <label
                      htmlFor="image-upload"
                      className={`group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all sm:rounded-2xl sm:p-8 md:p-12 ${isUploading ? 'border-violet-400 bg-violet-50' : 'border-slate-300 bg-slate-50 hover:border-violet-400 hover:bg-violet-50 active:bg-violet-100'}`}
                    >
                      {isUploading ? (
                        <>
                          <Loader className="mb-3 h-10 w-10 animate-spin text-violet-500" />
                          <p className="text-base font-semibold text-violet-600">Processing photo...</p>
                        </>
                      ) : (
                        <>
                          <div className="mb-3 rounded-xl bg-white p-3 shadow-sm transition-transform group-hover:scale-110 group-active:scale-105 sm:mb-4 sm:rounded-2xl sm:p-4">
                            <Upload className="h-7 w-7 text-slate-400 transition-colors group-hover:text-violet-500 sm:h-8 sm:w-8" />
                          </div>
                          <p className="mb-1 text-base font-semibold text-slate-700 sm:text-lg">Tap to upload your selfie</p>
                          <p className="text-xs text-slate-500 sm:text-sm">Your face photos only - PNG, JPG</p>
                        </>
                      )}
                    </label>
                  )}

                  {error && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-2.5 text-sm text-red-600 sm:mt-4 sm:p-3">
                      <AlertCircle className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />{error}
                    </div>
                  )}

                  {/* Desktop continue button */}
                  {uploadedImages.length >= 2 && (
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="mt-4 hidden w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white hover:shadow-lg hover:shadow-violet-200 sm:flex"
                    >
                      Continue with {uploadedImages.length} photos <ChevronRight className="h-4 w-4" />
                    </button>
                  )}

                  {/* Tips - Collapsible on very small screens */}
                  <div className="mt-4 rounded-xl bg-blue-50 p-3 sm:mt-6 sm:p-4">
                    <p className="mb-2 text-sm font-semibold text-blue-900">Tips for best results:</p>
                    <ul className="space-y-1.5 text-xs text-blue-700 sm:space-y-1">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-blue-500" />
                        <span>Casual selfies work better than professional headshots</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-blue-500" />
                        <span>Natural lighting, relaxed expressions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-blue-500" />
                        <span>Different angles increase success rate</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-3 flex items-center justify-center gap-3 text-xs text-slate-500 sm:mt-4 sm:gap-4">
                    <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5 text-emerald-500 sm:h-4 sm:w-4" />Photos never stored</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-violet-500 sm:h-4 sm:w-4" />Ready in 3 min</span>
                  </div>
                </div>
              )}

              {/* Mini Testimonial - Shows below upload card */}
              {currentStep === 1 && (
                <div className="mx-auto mt-4 max-w-md sm:mt-6">
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-3 py-2 sm:px-4 sm:py-2.5">
                    <div className="flex -space-x-1.5">
                      {['S', 'M', 'J'].map((letter, i) => (
                        <div key={i} className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-violet-400 to-indigo-400 text-[10px] font-bold text-white sm:h-7 sm:w-7 sm:text-xs">
                          {letter}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400 sm:h-3.5 sm:w-3.5" />)}
                    </div>
                    <span className="text-xs text-slate-600 sm:text-sm">"Saved me hours!" - <span className="font-medium">Sarah M.</span></span>
                  </div>
                </div>
              )}

              {/* Step 2: Script Selection */}
              {currentStep === 2 && (
                <div className="animate-fade-in rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:p-6 md:p-8">
                  <div className="mb-5 text-center sm:mb-6">
                    <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 sm:mb-3 sm:h-14 sm:w-14 sm:rounded-2xl">
                      <Video className="h-6 w-6 text-violet-600 sm:h-7 sm:w-7" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 sm:text-xl md:text-2xl">Choose Your Script</h2>
                    <p className="mt-1 text-sm text-slate-500">What should you say in the video?</p>
                  </div>

                  {/* Pre-made Scripts */}
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 sm:mb-3">Ready-to-use Scripts</p>
                    <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                      {scripts.map((script) => {
                        const IconComponent = script.icon
                        const isSelected = selectedScript === script.id
                        return (
                          <button
                            key={script.id}
                            onClick={() => handleScriptSelect(script.id)}
                            className={`relative w-full rounded-xl border-2 p-3 text-left transition-all sm:rounded-2xl sm:p-4 ${
                              isSelected
                                ? 'border-violet-500 bg-gradient-to-br from-violet-50 to-indigo-50 shadow-lg shadow-violet-100'
                                : 'border-slate-200 bg-white hover:border-violet-300 hover:shadow-md active:bg-slate-50'
                            }`}
                          >
                            {/* Badge */}
                            <div className={`absolute -top-2 right-3 ${script.badgeColor} rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-sm sm:px-2.5 sm:text-xs`}>
                              {script.badge}
                            </div>

                            <div className="flex items-start gap-3">
                              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl shadow-sm sm:h-11 sm:w-11 ${script.iconBg}`}>
                                <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 ${script.iconColor}`} />
                              </div>
                              <div className="flex-1 min-w-0 pt-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-slate-900 text-sm sm:text-base">{script.name}</p>
                                  {isSelected && <CheckCircle className="h-4 w-4 text-violet-500" />}
                                </div>
                              </div>
                            </div>
                            <p className={`mt-2 text-xs text-slate-600 leading-relaxed sm:text-sm ${isSelected ? '' : 'line-clamp-2'}`}>
                              "{script.text}"
                            </p>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="relative my-5 sm:my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-3 text-xs font-medium text-slate-400 sm:text-sm">or write your own</span>
                    </div>
                  </div>

                  {/* Custom Script Option */}
                  <div>
                    <button
                      onClick={() => { setSelectedScript('custom'); setError('') }}
                      className={`w-full rounded-xl border-2 border-dashed p-4 text-left transition-all sm:rounded-2xl sm:p-5 ${
                        selectedScript === 'custom'
                          ? 'border-violet-400 bg-violet-50'
                          : 'border-slate-300 bg-slate-50 hover:border-violet-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 sm:h-11 sm:w-11">
                          <PenLine className="h-5 w-5 text-slate-500 sm:h-6 sm:w-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm sm:text-base">Custom Script</p>
                          <p className="text-xs text-slate-500">Write exactly what you want to say</p>
                        </div>
                        {selectedScript === 'custom' && <CheckCircle className="ml-auto h-5 w-5 text-violet-500" />}
                      </div>
                    </button>

                    {selectedScript === 'custom' && (
                      <div className="mt-3 animate-fade-in">
                        <textarea
                          value={customScript}
                          onChange={(e) => setCustomScript(e.target.value)}
                          placeholder="Example: Hi! I'm [Name], your local real estate expert. Looking to buy or sell? Let's chat!"
                          className="w-full rounded-xl border-2 border-violet-200 bg-white p-3 text-sm text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 sm:p-4 sm:text-base"
                          rows={3}
                          autoFocus
                        />
                        <div className="mt-2 flex items-center justify-between">
                          <span className={`text-xs sm:text-sm ${customScriptWordCount > maxWords ? 'text-red-500 font-medium' : 'text-slate-500'}`}>
                            {customScriptWordCount}/{maxWords} words
                          </span>
                          <button
                            onClick={() => setCurrentStep(3)}
                            disabled={!customScript.trim() || customScriptWordCount > maxWords}
                            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                          >
                            Continue →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Desktop back button */}
                  <button onClick={() => setCurrentStep(1)} className="mt-4 hidden w-full py-2 text-sm font-medium text-slate-500 hover:text-slate-700 sm:block">
                    ← Back to photos
                  </button>
                </div>
              )}

              {/* Step 3: Format & Generate */}
              {currentStep === 3 && !isGenerating && (
                <div className="animate-fade-in rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:p-6 md:p-8">
                  <div className="mb-5 text-center sm:mb-6">
                    <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 sm:mb-3 sm:h-14 sm:w-14 sm:rounded-2xl">
                      <Sparkles className="h-6 w-6 text-violet-600 sm:h-7 sm:w-7" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 sm:text-xl md:text-2xl">Almost Ready!</h2>
                    <p className="mt-1 text-sm text-slate-500">Choose format and create your video</p>
                  </div>

                  {/* Format Selection - Larger touch targets */}
                  <div className="mb-5 sm:mb-6">
                    <p className="mb-2 text-sm font-medium text-slate-700 sm:mb-3">Video Format</p>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <button
                        onClick={() => setAspectRatio('9:16')}
                        className={`rounded-xl border-2 p-3 transition-all sm:rounded-2xl sm:p-4 ${aspectRatio === '9:16' ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-violet-300 active:bg-slate-50'}`}
                      >
                        <Smartphone className={`mx-auto mb-2 h-6 w-6 sm:mb-3 sm:h-7 sm:w-7 ${aspectRatio === '9:16' ? 'text-violet-600' : 'text-slate-400'}`} />
                        <p className="font-semibold text-slate-900 text-sm sm:text-base">Portrait</p>
                        <p className="text-xs text-slate-500">TikTok, Reels</p>
                      </button>
                      <button
                        onClick={() => setAspectRatio('16:9')}
                        className={`rounded-xl border-2 p-3 transition-all sm:rounded-2xl sm:p-4 ${aspectRatio === '16:9' ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-violet-300 active:bg-slate-50'}`}
                      >
                        <Monitor className={`mx-auto mb-2 h-6 w-6 sm:mb-3 sm:h-7 sm:w-7 ${aspectRatio === '16:9' ? 'text-violet-600' : 'text-slate-400'}`} />
                        <p className="font-semibold text-slate-900 text-sm sm:text-base">Landscape</p>
                        <p className="text-xs text-slate-500">YouTube, FB</p>
                      </button>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mb-5 rounded-xl bg-slate-50 p-3 sm:mb-6 sm:rounded-2xl sm:p-4">
                    <p className="mb-2 text-xs font-medium text-slate-500 sm:text-sm">Your video summary</p>
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {uploadedImages.slice(0, 3).map((img, i) => (
                          <Image key={i} src={img} alt={`Photo ${i + 1}`} width={36} height={36} className="h-9 w-9 rounded-lg border-2 border-white object-cover sm:h-10 sm:w-10" />
                        ))}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 text-sm truncate sm:text-base">{scripts.find(s => s.id === selectedScript)?.name || 'Custom Script'}</p>
                        <p className="text-xs text-slate-500 sm:text-sm">{aspectRatio === '9:16' ? 'Portrait' : 'Landscape'} • {uploadedImages.length} photos • 8 sec</p>
                      </div>
                    </div>
                  </div>

                  {error && hasAttemptedGeneration ? (
                    /* Error State - Show helpful message with action */
                    <div className="space-y-4">
                      <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-5">
                        <div className="mb-3 flex items-start gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">Let's try different photos</h3>
                            <p className="mt-1 text-sm text-slate-600">
                              Our AI works best with casual, natural photos. Professional headshots and certain poses can be tricky.
                            </p>
                          </div>
                        </div>
                        <div className="rounded-xl bg-white/80 p-3">
                          <p className="mb-2 text-xs font-medium text-slate-500">For best results, try:</p>
                          <ul className="space-y-1 text-xs text-slate-600">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-emerald-500" />
                              Casual selfies with natural lighting
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-emerald-500" />
                              Relaxed, everyday expressions
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-emerald-500" />
                              Photos taken with your phone camera
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Upload New Photos Button - Desktop */}
                      <button
                        onClick={() => {
                          setUploadedImages([])
                          setError('')
                          setHasAttemptedGeneration(false)
                          setCurrentStep(1)
                        }}
                        className="hidden w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 p-4 text-base font-bold text-white shadow-xl shadow-violet-200 hover:shadow-2xl sm:flex sm:rounded-2xl sm:p-5 sm:text-lg"
                      >
                        <Upload className="h-5 w-5" />
                        Upload New Photos
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Desktop generate button */}
                      <button
                        onClick={handleGenerateVideo}
                        className="group relative hidden w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 p-4 text-base font-bold text-white shadow-xl shadow-violet-200 hover:shadow-2xl sm:block sm:rounded-2xl sm:p-5 sm:text-lg"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <Sparkles className="h-5 w-5" />
                          Create My Video
                          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </button>

                      {/* Desktop back button */}
                      <button onClick={() => setCurrentStep(2)} className="mt-4 hidden w-full py-2 text-sm font-medium text-slate-500 hover:text-slate-700 sm:block">
                        ← Back to script
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Generating State */}
              {isGenerating && (
                <div className="animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl sm:rounded-3xl sm:p-8 md:p-12">
                  <div className="mb-5 sm:mb-6">
                    <div className="relative mx-auto h-20 w-20 sm:h-24 sm:w-24">
                      <div className="absolute inset-0 animate-ping rounded-full bg-violet-200 opacity-75" />
                      <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500">
                        <Loader className="h-8 w-8 animate-spin text-white sm:h-10 sm:w-10" />
                      </div>
                    </div>
                  </div>
                  <h2 className="mb-2 text-xl font-bold text-slate-900 sm:text-2xl">Creating Your Video</h2>
                  <p className="mb-5 text-sm text-slate-500 sm:mb-6 sm:text-base">{currentTip?.text}</p>
                  <div className="mx-auto mb-3 max-w-xs sm:mb-4">
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 sm:h-3">
                      <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="mt-2 text-sm font-medium text-slate-600">{Math.round(progress)}% complete</p>
                  </div>
                  <p className="text-xs text-slate-400 sm:text-sm">This usually takes 2-3 minutes</p>
                </div>
              )}
            </div>

            {/* Trust Section - Better grid for small screens */}
            {!isGenerating && (
              <div className="mx-auto mt-8 max-w-2xl sm:mt-12">
                <div className="grid grid-cols-3 gap-2 text-center sm:gap-4">
                  <div className="rounded-xl bg-white p-3 shadow-sm sm:rounded-2xl sm:p-4">
                    <Users className="mx-auto mb-1 h-4 w-4 text-violet-400 sm:h-5 sm:w-5" />
                    <div className="text-lg font-black text-violet-600 sm:text-2xl md:text-3xl">{liveCount.toLocaleString()}</div>
                    <p className="text-[10px] text-slate-500 sm:text-xs md:text-sm">Videos made</p>
                  </div>
                  <div className="rounded-xl bg-white p-3 shadow-sm sm:rounded-2xl sm:p-4">
                    <Star className="mx-auto mb-1 h-4 w-4 fill-amber-400 text-amber-400 sm:h-5 sm:w-5" />
                    <div className="text-lg font-black text-emerald-600 sm:text-2xl md:text-3xl">4.9</div>
                    <p className="text-[10px] text-slate-500 sm:text-xs md:text-sm">Rating</p>
                  </div>
                  <div className="rounded-xl bg-white p-3 shadow-sm sm:rounded-2xl sm:p-4">
                    <Clock className="mx-auto mb-1 h-4 w-4 text-indigo-400 sm:h-5 sm:w-5" />
                    <div className="text-lg font-black text-indigo-600 sm:text-2xl md:text-3xl">3min</div>
                    <p className="text-[10px] text-slate-500 sm:text-xs md:text-sm">Avg time</p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Full Sales Page After Email - Everything in One Place */
          <FullSalesContent generatedVideo={generatedVideo!} />
        )}
      </main>

      {/* Sticky Mobile CTA - Shows for all steps */}
      {!generatedVideo && !isGenerating && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur-lg sm:hidden">
          <button
            onClick={ctaInfo.action}
            disabled={ctaInfo.disabled}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold shadow-lg transition-all ${
              ctaInfo.disabled
                ? 'bg-slate-200 text-slate-500'
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white active:opacity-90'
            }`}
          >
            {/* Show appropriate icon based on state */}
            {(ctaInfo as any).isError ? (
              <Upload className="h-5 w-5" />
            ) : currentStep === 3 ? (
              <Sparkles className="h-5 w-5" />
            ) : null}
            {ctaInfo.text}
            {!ctaInfo.disabled && currentStep < 3 && !((ctaInfo as any).isError) && <ChevronRight className="h-5 w-5" />}
          </button>
          {/* Safety text */}
          <p className="mt-2 text-center text-[10px] text-slate-400">
            <Shield className="mr-1 inline h-3 w-3" />Your photos are never stored
          </p>
        </div>
      )}

      {/* Email Modal */}
      <DemoEmailCaptureModal isOpen={showEmailModal} onEmailSubmit={handleEmailSubmit} />

      <style jsx global>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }

        /* Smooth glow animations */
        @keyframes glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes glow-delayed {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.08); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        .animate-glow { animation: glow 8s ease-in-out infinite; }
        .animate-glow-delayed { animation: glow-delayed 10s ease-in-out infinite 2s; }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }

        /* Better touch targets */
        @media (pointer: coarse) {
          button, a, label[for] {
            min-height: 44px;
          }
        }

        /* Prevent zoom on input focus (iOS) */
        input, textarea, select {
          font-size: 16px !important;
        }

        /* Safe area for notched phones */
        .pb-36 {
          padding-bottom: max(9rem, env(safe-area-inset-bottom) + 7rem);
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .animate-glow, .animate-glow-delayed, .animate-pulse-slow {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
