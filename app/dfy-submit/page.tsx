'use client'

import { useState } from 'react'
import { Upload, CheckCircle, FileText, Image as ImageIcon, Phone, MessageSquare, Send } from 'lucide-react'
import Link from 'next/link'

export default function DFYSubmitPage() {
  const [formData, setFormData] = useState({
    email: '',
    script: '',
    phone: '',
    instructions: '',
  })
  const [images, setImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    // Validate: max 3 images
    if (files.length + images.length > 3) {
      setError('Maximum 3 images allowed')
      return
    }

    // Validate: file types
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    const invalidFiles = files.filter(file => !validTypes.includes(file.type))
    if (invalidFiles.length > 0) {
      setError('Only JPG, PNG, and WebP images are allowed')
      return
    }

    // Validate: file size (max 10MB per file)
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      setError('Each image must be less than 10MB')
      return
    }

    setError('')
    setImages([...images, ...files])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.email || !formData.script) {
      setError('Please fill in all required fields')
      return
    }

    if (images.length === 0) {
      setError('Please upload at least 1 image')
      return
    }

    if (formData.script.length > 200) {
      setError('Script must be 200 characters or less (approximately 60 seconds)')
      return
    }

    setIsSubmitting(true)

    try {
      // Create FormData for file upload
      const submitData = new FormData()
      submitData.append('email', formData.email)
      submitData.append('script', formData.script)
      submitData.append('phone', formData.phone)
      submitData.append('instructions', formData.instructions)

      images.forEach((image, index) => {
        submitData.append(`image_${index}`, image)
      })

      const response = await fetch('/api/dfy-submit', {
        method: 'POST',
        body: submitData,
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        setError(data.error || 'Failed to submit. Please try again.')
      }
    } catch (err) {
      setError('Something went wrong. Please try again or contact support.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-deep via-navy-rich to-black text-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-gradient-to-br from-navy-rich to-black rounded-2xl p-8 md:p-12 border-2 border-emerald-400/50 shadow-2xl text-center">
            {/* Success Icon */}
            <div className="mb-6">
              <div className="relative mx-auto mb-4 w-20 h-20">
                <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                Submission Received!
              </h1>
              <p className="text-emerald-400 text-lg font-semibold mb-4">
                🎉 Thank you for your submission!
              </p>
              <p className="text-lg text-white/80">
                Your video details have been received successfully.
              </p>
            </div>

            {/* What Happens Next */}
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm rounded-xl p-6 mb-6 text-left border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4">What Happens Next:</h2>
              <div className="space-y-3 text-white/90">
                <div className="flex gap-3">
                  <span className="text-emerald-400 font-bold">1.</span>
                  <p>Our team will review your submission within 2-4 hours</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-emerald-400 font-bold">2.</span>
                  <p>We'll start creating your custom AI video</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-emerald-400 font-bold">3.</span>
                  <p>You'll receive your finished video within 24-48 hours via email</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-emerald-400 font-bold">4.</span>
                  <p>We'll include direct support contact for any revisions needed</p>
                </div>
              </div>
            </div>

            {/* Support Info */}
            <div className="bg-gold-premium/10 backdrop-blur-sm border border-gold-premium/30 rounded-xl p-4 mb-6">
              <p className="text-white/90 text-sm">
                <strong className="text-gold-premium">Need to make changes?</strong> Reply to your confirmation email or contact us at support@aifastscale.com
              </p>
            </div>

            {/* Back to Home Button */}
            <Link
              href="/"
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-lg shadow-emerald-500/25 relative overflow-hidden border border-emerald-400/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative">Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-deep via-navy-rich to-black text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gold-premium/10 backdrop-blur-sm border border-gold-premium/30 rounded-full px-6 py-2 mb-4">
            <FileText className="w-4 h-4 text-gold-premium" />
            <span className="text-gold-premium font-bold text-sm uppercase tracking-widest">Done-For-You Video Service</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
            Submit Your Video Details
          </h1>
          <p className="text-lg text-white/80">
            Fill out the form below and we'll create your custom AI video within 24-48 hours
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-navy-rich to-black rounded-2xl p-6 md:p-8 border-2 border-gold-premium shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-white font-bold mb-2">
                Email Address <span className="text-red-electric">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-gold-premium focus:outline-none"
              />
              <p className="text-white/60 text-sm mt-1">
                We'll send your finished video to this email
              </p>
            </div>

            {/* Video Script */}
            <div>
              <label className="block text-white font-bold mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Video Script (Max 60 seconds) <span className="text-red-electric">*</span>
              </label>
              <textarea
                required
                value={formData.script}
                onChange={(e) => setFormData({ ...formData, script: e.target.value })}
                placeholder="Write your video script here... (approximately 200 characters for 60 seconds)"
                maxLength={200}
                rows={5}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-gold-premium focus:outline-none resize-none"
              />
              <p className="text-white/60 text-sm mt-1">
                {formData.script.length}/200 characters • Keep it concise and impactful
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-white font-bold mb-2 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Upload Images (1-3 images) <span className="text-red-electric">*</span>
              </label>

              <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-gold-premium transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={images.length >= 3}
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-white/50 mx-auto mb-2" />
                  <p className="text-white/80 mb-1">
                    {images.length >= 3 ? 'Maximum 3 images uploaded' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-white/60 text-sm">
                    JPG, PNG or WebP (max 10MB per image)
                  </p>
                </label>
              </div>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-red-500/80 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                      >
                        ×
                      </button>
                      <p className="text-white/60 text-xs mt-1 truncate">
                        {image.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Phone Number (Optional) */}
            <div>
              <label className="block text-white font-bold mb-2 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-gold-premium focus:outline-none"
              />
              <p className="text-white/60 text-sm mt-1">
                For WhatsApp updates (optional)
              </p>
            </div>

            {/* Special Instructions (Optional) */}
            <div>
              <label className="block text-white font-bold mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Special Instructions (Optional)
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="Any specific requests? Style preferences? Colors? Music? Let us know..."
                rows={4}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-gold-premium focus:outline-none resize-none"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 backdrop-blur-sm border border-red-400/50 rounded-lg p-4 text-center">
                <p className="text-white font-semibold">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || images.length === 0}
              className="group w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 text-white px-8 py-5 rounded-xl font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-emerald-500/25 relative overflow-hidden border border-emerald-400/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative flex items-center justify-center gap-3">
                <Send className="w-6 h-6" />
                {isSubmitting ? 'Submitting...' : 'Submit My Video Details'}
              </span>
            </button>
          </form>

          {/* Trust Badges */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-center gap-6 text-white/60 text-sm">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                24-48h Delivery
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                100% Refund Guarantee
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
