'use client'

import { useState } from 'react'
import { Download, ExternalLink, Lock, CheckCircle, Copy, Check, Eye, EyeOff, BookOpen, Video, FileText, Sparkles } from 'lucide-react'

export default function MembersPage() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [copiedPassword, setCopiedPassword] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)

  const correctPassword = 'im the best agent in the world'
  const memberPortalUrl = 'https://aifastscale.com/members'

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput.toLowerCase().trim() === correctPassword) {
      setIsUnlocked(true)
    } else {
      alert('Incorrect password. Please try again.')
    }
  }

  const copyPassword = () => {
    navigator.clipboard.writeText(correctPassword)
    setCopiedPassword(true)
    setTimeout(() => setCopiedPassword(false), 2000)
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(memberPortalUrl)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  // Password Gate Screen
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          {/* Lock Icon */}
          <div className="w-20 h-20 bg-yellow-400/10 rounded-full flex items-center justify-center mb-8 mx-auto">
            <Lock className="w-10 h-10 text-yellow-400" />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              VIP Member Portal
            </h1>
            <p className="text-gray-400 text-lg">
              Enter your password to access your premium products
            </p>
          </div>

          {/* Password Form */}
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Paste your password here..."
                className="w-full bg-[#1a1a1a] border-2 border-gray-800 focus:border-yellow-400 rounded-xl px-6 py-4 text-white placeholder-gray-600 outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black py-4 px-6 rounded-xl font-black text-lg transition-all shadow-lg hover:shadow-yellow-400/50"
            >
              UNLOCK ACCESS
            </button>
          </form>

          {/* Footer Note */}
          <p className="text-center text-gray-600 text-sm mt-8">
            Lost your password? Check your email or contact support.
          </p>
        </div>
      </div>
    )
  }

  // Main Member Portal (after password unlocked)
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">AIFastScale</h1>
            <p className="text-sm text-gray-400">VIP Member Portal</p>
          </div>
          <div className="bg-yellow-400/10 border border-yellow-400/30 px-4 py-2 rounded-full">
            <span className="text-yellow-400 text-sm font-bold">✓ ACCESS GRANTED</span>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Bookmark Reminder */}
        <div className="bg-gradient-to-r from-[#da2b35]/10 to-[#c12431]/10 border-2 border-[#da2b35]/30 rounded-2xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#da2b35]/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-[#da2b35]" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-black text-xl mb-2">
                IMPORTANT: Bookmark This Page
              </h3>
              <p className="text-gray-400 mb-4">
                Save this URL so you can access your products anytime. Copy the link below:
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-black/40 border border-gray-700 rounded-xl px-4 py-3">
                  <p className="text-yellow-400 font-mono text-sm break-all">{memberPortalUrl}</p>
                </div>
                <button
                  onClick={copyUrl}
                  className="bg-[#da2b35] hover:bg-[#c12431] text-white py-3 px-6 rounded-xl font-black text-sm flex items-center gap-2 transition-all flex-shrink-0"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>COPY URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-16">
          <div className="inline-block bg-yellow-400/10 border border-yellow-400/30 px-6 py-2 rounded-full mb-6">
            <span className="text-yellow-400 text-sm font-bold uppercase tracking-wider">Your Complete Training Library</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
            Welcome to AgentClone™
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to dominate real estate. Your $37 investment gives you instant access to all these premium products.
          </p>
        </div>

        {/* MAIN COURSE SECTION */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-1 flex-1 bg-gradient-to-r from-transparent to-[#da2b35]"></div>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              YOUR MAIN COURSE <span className="text-[#da2b35]">($37 VALUE)</span>
            </h2>
            <div className="h-1 flex-1 bg-gradient-to-l from-transparent to-[#da2b35]"></div>
          </div>

          {/* Turn Your Image To Video Course */}
          <div className="bg-gradient-to-br from-[#da2b35]/20 to-[#c12431]/20 rounded-3xl p-8 border-4 border-[#da2b35] mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#da2b35]/10 rounded-full blur-3xl"></div>

            <div className="relative">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-20 h-20 bg-[#da2b35] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Video className="w-10 h-10 text-white" />
                </div>
                <div>
                  <div className="inline-block bg-[#da2b35] text-white px-4 py-1 rounded-full font-black text-xs mb-3">
                    FLAGSHIP COURSE
                  </div>
                  <h3 className="text-4xl font-black text-white mb-3">
                    Turn Your Image To Video
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Create professional real estate videos from static images using AI. Includes everything you need: registration guide, training videos, prompts, and templates.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <a href="/products/register-here.pdf" download className="bg-black/40 hover:bg-black/60 border border-[#da2b35]/30 rounded-xl p-4 transition-all group">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-[#da2b35]" />
                    <span className="text-white font-bold">Register Here.pdf</span>
                  </div>
                  <p className="text-gray-400 text-sm">Setup instructions</p>
                </a>

                <a href="/products/prompt-guide.pdf" download className="bg-black/40 hover:bg-black/60 border border-[#da2b35]/30 rounded-xl p-4 transition-all group">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-[#da2b35]" />
                    <span className="text-white font-bold">Prompt Guide.pdf</span>
                  </div>
                  <p className="text-gray-400 text-sm">AI prompt templates</p>
                </a>

                <a href="/products/training-video-1.mov" download className="bg-black/40 hover:bg-black/60 border border-[#da2b35]/30 rounded-xl p-4 transition-all group">
                  <div className="flex items-center gap-3 mb-2">
                    <Video className="w-5 h-5 text-[#da2b35]" />
                    <span className="text-white font-bold">Training Video 1</span>
                  </div>
                  <p className="text-gray-400 text-sm">Step-by-step walkthrough</p>
                </a>

                <a href="/products/training-video-2.mov" download className="bg-black/40 hover:bg-black/60 border border-[#da2b35]/30 rounded-xl p-4 transition-all group">
                  <div className="flex items-center gap-3 mb-2">
                    <Video className="w-5 h-5 text-[#da2b35]" />
                    <span className="text-white font-bold">Training Video 2</span>
                  </div>
                  <p className="text-gray-400 text-sm">Advanced techniques</p>
                </a>

                <a href="/products/prompt-template-1.rtf" download className="bg-black/40 hover:bg-black/60 border border-[#da2b35]/30 rounded-xl p-4 transition-all group">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-[#da2b35]" />
                    <span className="text-white font-bold">Prompt Template 1</span>
                  </div>
                  <p className="text-gray-400 text-sm">Ready-to-use prompts</p>
                </a>

                <a href="/products/prompt-template-2.rtf" download className="bg-black/40 hover:bg-black/60 border border-[#da2b35]/30 rounded-xl p-4 transition-all group">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-[#da2b35]" />
                    <span className="text-white font-bold">Prompt Template 2</span>
                  </div>
                  <p className="text-gray-400 text-sm">Advanced prompts</p>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* BONUSES SECTION */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-1 flex-1 bg-gradient-to-r from-transparent to-yellow-400"></div>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              YOUR EXCLUSIVE BONUSES <span className="text-yellow-400">(WORTH $1,000+)</span>
            </h2>
            <div className="h-1 flex-1 bg-gradient-to-l from-transparent to-yellow-400"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 89 DM Scripts */}
            <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-6 border-2 border-gray-800 hover:border-yellow-400 transition-all hover:scale-[1.02]">
              <div className="w-14 h-14 bg-yellow-400/10 rounded-xl flex items-center justify-center mb-4">
                <Download className="w-7 h-7 text-yellow-400" />
              </div>
              <div className="mb-4">
                <div className="text-yellow-400 text-xs font-black mb-2">$197 VALUE</div>
                <h3 className="text-xl font-black text-white mb-2">89 Instagram DM Scripts</h3>
                <p className="text-gray-400 text-sm">Copy-paste messages to book appointments</p>
              </div>
              <a href="/products/89-dm-scripts.pdf" download className="block w-full bg-yellow-400 hover:bg-yellow-300 text-black py-3 rounded-xl font-black text-sm text-center transition-all">
                DOWNLOAD
              </a>
            </div>

            {/* Marcus GPT */}
            <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-6 border-2 border-gray-800 hover:border-[#da2b35] transition-all hover:scale-[1.02]">
              <div className="w-14 h-14 bg-[#da2b35]/10 rounded-xl flex items-center justify-center mb-4">
                <ExternalLink className="w-7 h-7 text-[#da2b35]" />
              </div>
              <div className="mb-4">
                <div className="text-[#da2b35] text-xs font-black mb-2">EXCLUSIVE</div>
                <h3 className="text-xl font-black text-white mb-2">Marcus AI Mentor</h3>
                <p className="text-gray-400 text-sm">24/7 real estate mentor with 28 years experience</p>
              </div>
              <a href="https://chatgpt.com/g/g-6923615c25948191a95562d0181d1ee3-real-estate-mentor-marcus-rodriguez" target="_blank" rel="noopener noreferrer" className="block w-full bg-[#da2b35] hover:bg-[#c12431] text-white py-3 rounded-xl font-black text-sm text-center transition-all">
                ACCESS NOW
              </a>
            </div>

            {/* 17 Hooks */}
            <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-6 border-2 border-gray-800 hover:border-yellow-400 transition-all hover:scale-[1.02]">
              <div className="w-14 h-14 bg-yellow-400/10 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-yellow-400" />
              </div>
              <div className="mb-4">
                <div className="text-yellow-400 text-xs font-black mb-2">BONUS</div>
                <h3 className="text-xl font-black text-white mb-2">17 Viral Hooks</h3>
                <p className="text-gray-400 text-sm">Impossible-to-skip content starters</p>
              </div>
              <a href="/products/17-hooks.pdf" download className="block w-full bg-yellow-400 hover:bg-yellow-300 text-black py-3 rounded-xl font-black text-sm text-center transition-all">
                DOWNLOAD
              </a>
            </div>

            {/* 30 Funny Posts */}
            <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-6 border-2 border-gray-800 hover:border-yellow-400 transition-all hover:scale-[1.02]">
              <div className="w-14 h-14 bg-yellow-400/10 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-yellow-400" />
              </div>
              <div className="mb-4">
                <div className="text-yellow-400 text-xs font-black mb-2">BONUS</div>
                <h3 className="text-xl font-black text-white mb-2">30 Funny RE Posts</h3>
                <p className="text-gray-400 text-sm">Social media gold for engagement</p>
              </div>
              <a href="/products/30-funny-posts.pdf" download className="block w-full bg-yellow-400 hover:bg-yellow-300 text-black py-3 rounded-xl font-black text-sm text-center transition-all">
                DOWNLOAD
              </a>
            </div>

            {/* $10M Masterclass */}
            <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-6 border-2 border-gray-800 hover:border-yellow-400 transition-all hover:scale-[1.02]">
              <div className="w-14 h-14 bg-yellow-400/10 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-7 h-7 text-yellow-400" />
              </div>
              <div className="mb-4">
                <div className="text-yellow-400 text-xs font-black mb-2">$497 VALUE</div>
                <h3 className="text-xl font-black text-white mb-2">Personal Brand Masterclass</h3>
                <p className="text-gray-400 text-sm">Build a $10M personal brand</p>
              </div>
              <a href="/products/personal-brand-masterclass.pdf" download className="block w-full bg-yellow-400 hover:bg-yellow-300 text-black py-3 rounded-xl font-black text-sm text-center transition-all">
                DOWNLOAD
              </a>
            </div>

            {/* Video Editing */}
            <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-6 border-2 border-gray-800 hover:border-yellow-400 transition-all hover:scale-[1.02]">
              <div className="w-14 h-14 bg-yellow-400/10 rounded-xl flex items-center justify-center mb-4">
                <Video className="w-7 h-7 text-yellow-400" />
              </div>
              <div className="mb-4">
                <div className="text-yellow-400 text-xs font-black mb-2">BONUS</div>
                <h3 className="text-xl font-black text-white mb-2">Edit Video in 20Min</h3>
                <p className="text-gray-400 text-sm">Quick professional editing tutorial</p>
              </div>
              <a href="/products/edit-video-20min.mp4" download className="block w-full bg-yellow-400 hover:bg-yellow-300 text-black py-3 rounded-xl font-black text-sm text-center transition-all">
                DOWNLOAD
              </a>
            </div>

            {/* Reels Templates */}
            <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-6 border-2 border-gray-800 hover:border-yellow-400 transition-all hover:scale-[1.02]">
              <div className="w-14 h-14 bg-yellow-400/10 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-yellow-400" />
              </div>
              <div className="mb-4">
                <div className="text-yellow-400 text-xs font-black mb-2">BONUS</div>
                <h3 className="text-xl font-black text-white mb-2">Reels Templates</h3>
                <p className="text-gray-400 text-sm">Viral-ready video templates</p>
              </div>
              <a href="/products/reels-templates.pdf" download className="block w-full bg-yellow-400 hover:bg-yellow-300 text-black py-3 rounded-xl font-black text-sm text-center transition-all">
                DOWNLOAD
              </a>
            </div>

            {/* Stories & Posts Templates */}
            <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-6 border-2 border-gray-800 hover:border-yellow-400 transition-all hover:scale-[1.02]">
              <div className="w-14 h-14 bg-yellow-400/10 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-yellow-400" />
              </div>
              <div className="mb-4">
                <div className="text-yellow-400 text-xs font-black mb-2">BONUS</div>
                <h3 className="text-xl font-black text-white mb-2">Stories & Posts</h3>
                <p className="text-gray-400 text-sm">Ready-made social templates</p>
              </div>
              <a href="/products/stories-posts-templates.pdf" download className="block w-full bg-yellow-400 hover:bg-yellow-300 text-black py-3 rounded-xl font-black text-sm text-center transition-all">
                DOWNLOAD
              </a>
            </div>

            {/* Professional Signature */}
            <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-6 border-2 border-gray-800 hover:border-yellow-400 transition-all hover:scale-[1.02]">
              <div className="w-14 h-14 bg-yellow-400/10 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-yellow-400" />
              </div>
              <div className="mb-4">
                <div className="text-yellow-400 text-xs font-black mb-2">BONUS</div>
                <h3 className="text-xl font-black text-white mb-2">Pro Email Signature</h3>
                <p className="text-gray-400 text-sm">Professional realtor signature template</p>
              </div>
              <a href="/products/professional-signature.pdf" download className="block w-full bg-yellow-400 hover:bg-yellow-300 text-black py-3 rounded-xl font-black text-sm text-center transition-all">
                DOWNLOAD
              </a>
            </div>
          </div>

          {/* Business Planner Section */}
          <div className="mt-8 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-3xl p-8 border-2 border-gray-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-yellow-400/10 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <div className="text-yellow-400 text-xs font-black mb-1">PREMIUM BONUS</div>
                <h3 className="text-2xl font-black text-white">Complete Business Planner</h3>
                <p className="text-gray-400">5 essential planning documents</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a href="/products/business-planner-1.pdf" download className="bg-black/40 hover:bg-black/60 border border-gray-700 rounded-xl p-4 transition-all">
                <FileText className="w-5 h-5 text-yellow-400 mb-2" />
                <p className="text-white font-bold text-sm">Strategic Plan Template</p>
              </a>
              <a href="/products/business-planner-2.pdf" download className="bg-black/40 hover:bg-black/60 border border-gray-700 rounded-xl p-4 transition-all">
                <FileText className="w-5 h-5 text-yellow-400 mb-2" />
                <p className="text-white font-bold text-sm">Goal Setting Workbook</p>
              </a>
              <a href="/products/business-planner-3.pdf" download className="bg-black/40 hover:bg-black/60 border border-gray-700 rounded-xl p-4 transition-all">
                <FileText className="w-5 h-5 text-yellow-400 mb-2" />
                <p className="text-white font-bold text-sm">Marketing Calendar</p>
              </a>
              <a href="/products/business-planner-4.pdf" download className="bg-black/40 hover:bg-black/60 border border-gray-700 rounded-xl p-4 transition-all">
                <FileText className="w-5 h-5 text-yellow-400 mb-2" />
                <p className="text-white font-bold text-sm">Financial Tracker</p>
              </a>
              <a href="/products/business-planner-5.pdf" download className="bg-black/40 hover:bg-black/60 border border-gray-700 rounded-xl p-4 transition-all">
                <FileText className="w-5 h-5 text-yellow-400 mb-2" />
                <p className="text-white font-bold text-sm">Client Management System</p>
              </a>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-4">Need help accessing your products?</p>
          <a
            href="mailto:support@aifastscale.com"
            className="text-yellow-400 hover:text-yellow-300 font-bold underline"
          >
            Contact Support
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-500 text-sm">
          <p>© 2024 AIFastScale. All rights reserved.</p>
          <p className="mt-2">These products are for your personal use only. Please do not share or redistribute.</p>
        </div>
      </div>
    </div>
  )
}