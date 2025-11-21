'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Script from 'next/script'
import {
  Gift,
  Shield,
  CheckCircle,
  ArrowRight,
  Clock,
  Users,
  Video,
  Upload,
  TrendingUp,
  Sparkles,
  DollarSign,
  Award,
  Play,
  PlayCircle,
  ChevronDown,
  Star,
  Check,
  X,
  Mail,
  MessageCircle,
  Heart,
  Copy,
  AlertTriangle,
} from 'lucide-react'
import SpinWheel from './components/SpinWheel'
import CountdownTimer from './components/CountdownTimer'

// Black Friday end date - December 2, 2025 at midnight
const BLACK_FRIDAY_END = new Date('2025-12-02T00:00:00')

export default function Home() {
  const [showSpinWheel, setShowSpinWheel] = useState(false)
  const [selectedGift, setSelectedGift] = useState<any>(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Check for saved gift on mount
  useEffect(() => {
    const savedGift = localStorage.getItem('blackFridayGift')
    if (savedGift) {
      // Set selected gift from storage
      setSelectedGift({ id: savedGift })
    }
  }, [])

  // Handle spin complete - Close modal & scroll to offer
  const handleSpinComplete = (gift: any) => {
    setSelectedGift(gift)
    // Close the modal
    setShowSpinWheel(false)
    // Scroll to offer section after a brief delay
    setTimeout(() => {
      scrollToCTA()
    }, 500)
  }

  // Scroll to CTA
  const scrollToCTA = () => {
    const ctaElement = document.getElementById('cta-section')
    ctaElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  // Copy email template to clipboard
  const copyEmailTemplate = () => {
    const emailText = `Subject: Refund Request

Hi Sara, I'd like a refund for my AgentClone purchase.
Order email: [your email]

Thanks!`
    navigator.clipboard.writeText(emailText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Handle video play button click
  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsVideoPlaying(true)
    }
  }

  return (
    <main className="min-h-screen bg-white">

      {/* ================================================================
          STICKY HEADER - Minimal & Professional
          ================================================================ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-navy-deep/95 backdrop-blur-md border-b border-gold-premium/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Black Friday Badge */}
            <div className="bg-gold-premium/10 backdrop-blur-sm border border-gold-premium/30 px-4 py-2 rounded-full">
              <span className="text-gold-premium font-bold text-xs md:text-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                FINAL HOURS: Price Jumps to $97 at Midnight • Only 13 Spots Left
              </span>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setShowSpinWheel(true)}
              className="bg-gradient-to-r from-gold-premium to-gold-dark text-navy-deep px-6 py-2.5 rounded-lg font-black text-sm md:text-base hover:scale-105 transition-transform shadow-lg"
            >
              <Gift className="w-4 h-4 inline mr-1" />
              Spin To Win
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* ================================================================
          1. UNIFIED HERO SECTION (Hero Text + Spin Wheel Together)
          ================================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-deep via-navy-rich to-black text-white py-12 md:py-24">
        {/* Refined Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.3) 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
          <div className="absolute top-0 left-0 w-64 h-64 bg-gold-premium rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Hero Text */}
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
            {/* Social Proof - Trust Before Pitch */}
            <div className="mb-6 flex items-center justify-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Users className="w-4 h-4 text-emerald-400" />
                <span className="text-white/90 text-sm font-semibold">847 Agents Transformed</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Star className="w-4 h-4 text-gold-premium fill-gold-premium" />
                <span className="text-white/90 text-sm font-semibold">4.9/5 Rating</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Turn 1 Photo Into{' '}
              <span className="bg-gradient-to-r from-gold-premium via-gold-light to-gold-premium bg-clip-text text-transparent">
                50 Personalized Videos
              </span>
              <br />
              In Just{' '}
              <span className="bg-gradient-to-r from-gold-premium via-gold-light to-gold-premium bg-clip-text text-transparent">
                7 Minutes
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-2xl text-gray-300 mb-4">
              No camera. No editing. No tech skills.
              <br />
              <span className="text-gold-light font-semibold">
                Real estate agents are using AI to get 3x more luxury listings
              </span>
            </p>
          </div>

          {/* Spin Wheel */}
          <div className="max-w-3xl mx-auto">

            {selectedGift ? (
              /* Already Spun - Show Bonus Secured */
              <div className="bg-gradient-to-r from-green-success to-emerald-500 p-6 md:p-8 rounded-2xl border-4 border-gold-premium shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-4xl md:text-5xl">{selectedGift.emoji || '🎁'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-black text-xl md:text-2xl mb-2 flex items-center gap-2">
                      <CheckCircle className="w-6 h-6" />
                      BONUS SECURED!
                    </p>
                    <p className="text-white/90 text-sm md:text-base">
                      {selectedGift.name || selectedGift.shortName} ({selectedGift.value})
                    </p>
                  </div>
                </div>
                <p className="text-white/80 text-sm md:text-base text-center">
                  Complete your purchase below to claim this exclusive bonus ↓
                </p>
              </div>
            ) : (
              /* Not Spun Yet - Show Spin Wheel CTA */
              <div className="bg-gradient-to-br from-navy-deep via-navy-rich to-black border-4 border-gold-premium rounded-3xl p-6 md:p-8">

                {/* FREE Badge */}
                <div className="flex justify-center mb-4">
                  <div className="bg-gold-premium/10 backdrop-blur-sm border border-gold-premium/30 text-gold-premium px-5 py-2 rounded-full font-bold text-xs md:text-sm uppercase tracking-wide shadow-lg flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    FREE 1 SPIN • LIMITED TIME
                  </div>
                </div>

                {/* Headline */}
                <h2 className="text-2xl md:text-4xl font-black text-center mb-3 leading-tight">
                  <span className="bg-gradient-to-r from-gold-premium via-gold-light to-gold-premium bg-clip-text text-transparent">
                    You Have 1 FREE Spin<br className="hidden md:block" /> Waiting For You!
                  </span>
                </h2>

                {/* Value Proposition */}
                <p className="text-white/90 text-center text-sm md:text-base mb-6">
                  Win <span className="text-gold-premium font-bold">exclusive bonuses worth up to $1,634</span> instantly!
                  <br />
                  <span className="text-white/70 text-xs flex items-center justify-center gap-1.5 mt-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    100% Win Rate • Everyone Gets Premium Bonuses
                  </span>
                </p>

                {/* VISUAL SPIN WHEEL PREVIEW - REFINED */}
                <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto mb-6">
                  {/* Refined Glow Rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-gold-premium/30"></div>
                  <div className="absolute inset-[-6px] rounded-full border-2 border-gold-premium/20"></div>
                  <div className="absolute inset-[-12px] rounded-full border-2 border-gold-premium/10"></div>

                  {/* Pointer Arrow - Refined */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
                    <div className="relative">
                      <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[36px] border-t-gold-premium drop-shadow-2xl" style={{ filter: 'drop-shadow(0 4px 8px rgba(212, 175, 55, 0.5))' }}></div>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-gold-light"></div>
                    </div>
                  </div>

                  {/* Spinning Wheel - Modern Gradients */}
                  <div className="absolute inset-0 animate-spin-slow">
                    <svg viewBox="0 0 200 200" className="w-full h-full" style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' }}>
                      <defs>
                        {/* Radial Gradients for Modern Look */}
                        <radialGradient id="redGrad" cx="50%" cy="50%">
                          <stop offset="0%" stopColor="#FF4060" stopOpacity="0.9"/>
                          <stop offset="60%" stopColor="#FF0040" />
                          <stop offset="100%" stopColor="#CC0033" />
                        </radialGradient>
                        <radialGradient id="goldGrad" cx="50%" cy="50%">
                          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9"/>
                          <stop offset="60%" stopColor="#FDB813" />
                          <stop offset="100%" stopColor="#D4A900" />
                        </radialGradient>
                        <radialGradient id="silverGrad" cx="50%" cy="50%">
                          <stop offset="0%" stopColor="#E8E8E8" stopOpacity="0.9"/>
                          <stop offset="60%" stopColor="#C0C0C0" />
                          <stop offset="100%" stopColor="#A0A0A0" />
                        </radialGradient>
                        <radialGradient id="centerGrad" cx="50%" cy="40%">
                          <stop offset="0%" stopColor="#FFD700" />
                          <stop offset="50%" stopColor="#D4AF37" />
                          <stop offset="100%" stopColor="#B8941E" />
                        </radialGradient>
                      </defs>

                      {/* Outer Golden Ring - Premium */}
                      <circle cx="100" cy="100" r="98" fill="none" stroke="url(#centerGrad)" strokeWidth="5"/>

                      {/* 9 Segments - Brand Colors with Gradients */}
                      {/* RED - PLATINUM (1 segment - ultra rare!) */}
                      <path d="M 100 100 L 100 2 A 98 98 0 0 1 169.7 30.3 Z" fill="url(#redGrad)" stroke="#ffffff" strokeWidth="2.5"/>

                      {/* GOLD - GOLD (3 segments) */}
                      <path d="M 100 100 L 169.7 30.3 A 98 98 0 0 1 198 100 Z" fill="url(#goldGrad)" stroke="#ffffff" strokeWidth="2.5"/>
                      <path d="M 100 100 L 30.3 169.7 A 98 98 0 0 1 2 100 Z" fill="url(#goldGrad)" stroke="#ffffff" strokeWidth="2.5"/>
                      <path d="M 100 100 L 169.7 169.7 A 98 98 0 0 1 100 198 Z" fill="url(#goldGrad)" stroke="#ffffff" strokeWidth="2.5"/>

                      {/* SILVER (5 segments) */}
                      <path d="M 100 100 L 30.3 30.3 A 98 98 0 0 1 2 100 Z" fill="url(#silverGrad)" stroke="#ffffff" strokeWidth="2.5"/>
                      <path d="M 100 100 L 198 100 A 98 98 0 0 1 169.7 169.7 Z" fill="url(#silverGrad)" stroke="#ffffff" strokeWidth="2.5"/>
                      <path d="M 100 100 L 100 198 A 98 98 0 0 1 30.3 169.7 Z" fill="url(#silverGrad)" stroke="#ffffff" strokeWidth="2.5"/>
                      <path d="M 100 100 L 2 100 A 98 98 0 0 1 30.3 30.3 Z" fill="url(#silverGrad)" stroke="#ffffff" strokeWidth="2.5"/>
                      <path d="M 100 100 L 100 2 A 98 98 0 0 0 30.3 30.3 Z" fill="url(#silverGrad)" stroke="#ffffff" strokeWidth="2.5"/>

                      {/* Glossy Overlay Effect */}
                      <circle cx="100" cy="100" r="95" fill="radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)" opacity="0.3"/>

                      {/* 3D Center Button - Golden */}
                      <circle cx="100" cy="100" r="32" fill="url(#centerGrad)" stroke="#ffffff" strokeWidth="4"/>
                      <circle cx="100" cy="95" r="28" fill="rgba(255,255,255,0.2)" opacity="0.4"/>
                      <text x="100" y="110" textAnchor="middle" fill="#0a1128" fontSize="22" fontWeight="900" letterSpacing="1">SPIN</text>
                    </svg>
                  </div>

                  {/* Refined Glow Effects */}
                  <div className="absolute inset-0 bg-gold-premium rounded-full blur-2xl opacity-15"></div>
                  <div className="absolute inset-[-20px] bg-emerald-400 rounded-full blur-3xl opacity-10"></div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => setShowSpinWheel(true)}
                  className="group relative w-full bg-gradient-to-r from-gold-premium via-gold-light to-gold-premium text-navy-deep px-8 py-4 md:py-5 rounded-2xl font-black text-xl md:text-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl border-4 border-white/50 overflow-hidden mb-4"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    <Gift className="w-6 h-6" />
                    CLAIM MY FREE SPIN NOW
                    <ArrowRight className="w-6 h-6" />
                  </span>
                </button>

                {/* Urgency + Trust */}
                <div className="space-y-1 text-center">
                  <p className="text-white/80 text-xs md:text-sm flex items-center justify-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-gold-premium font-bold">ONE-TIME ONLY</span> • Everyone wins guaranteed
                  </p>
                  <p className="text-gold-light text-xs flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    No email required • Instant reveal • Secure your bonus
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Spin Wheel Modal */}
      <SpinWheel
        isOpen={showSpinWheel}
        onClose={() => setShowSpinWheel(false)}
        onSpinComplete={handleSpinComplete}
      />

      {/* ================================================================
          3. BLACK FRIDAY COUNTDOWN SECTION
          ================================================================ */}
      <section className="bg-gradient-to-r from-gold-light to-white py-12 border-y-4 border-gold-premium">
        <div className="container mx-auto px-4">
          <CountdownTimer endDate={BLACK_FRIDAY_END} />
        </div>
      </section>

      {/* CTA After Countdown */}
      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <button
              onClick={() => {
                // Facebook Pixel - Lead event (user shows interest)
                if (typeof window !== 'undefined' && window.fbq) {
                  window.fbq('track', 'Lead', {
                    content_name: 'Spin to Win',
                    content_category: 'Engagement',
                  })
                }
                setShowSpinWheel(true)
              }}
              className="inline-block bg-gradient-to-r from-gold-premium to-gold-dark text-white px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-lg md:text-xl hover:scale-105 transition-transform shadow-2xl w-full md:w-auto"
            >
              <Gift className="w-5 h-5 md:w-6 md:h-6 inline mr-2" />
              Unlock Your Bonus - Spin Now →
            </button>
            <p className="text-xs md:text-sm text-gray-500 mt-3">
              Limited time offer - expires at midnight
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          4. GUARANTEE SECTION - TRIPLE PROTECTION
          ================================================================ */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-emerald-500/10 via-green-success/10 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(16, 185, 129, 0.3) 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="text-center mb-8 md:mb-12">
              {/* Triple Protection Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-success text-white px-6 py-2.5 rounded-full mb-6 shadow-lg">
                <Shield className="w-5 h-5" />
                <span className="font-black text-sm uppercase tracking-wide">Triple Guarantee Protection</span>
              </div>

              {/* Main Headline */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-navy-deep mb-4">
                You're <span className="bg-gradient-to-r from-emerald-500 to-green-success bg-clip-text text-transparent">100% Protected</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                We remove ALL risk from your decision. Here's how we protect you:
              </p>
            </div>

            {/* 2 Guarantee Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-12 max-w-4xl mx-auto">

              {/* Card 1: 30-Day Money Back */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl border-2 border-emerald-400/30 hover:border-emerald-400 transition-all hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-success rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                  <Shield className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-navy-deep mb-3 text-center">
                  30-Day Money Back
                </h3>
                <p className="text-gray-600 text-sm md:text-base text-center leading-relaxed">
                  Don't love it? Email me within 30 days for a <strong className="text-emerald-600">full refund</strong>. No questions asked. No forms to fill out.
                </p>
              </div>

              {/* Card 2: Instant Access */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl border-2 border-navy-deep/30 hover:border-navy-deep transition-all hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-navy-deep to-navy-rich rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                  <Clock className="w-8 h-8 text-gold-premium" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-navy-deep mb-3 text-center">
                  Instant Access
                </h3>
                <p className="text-gray-600 text-sm md:text-base text-center leading-relaxed">
                  Get immediate access to everything. Start creating videos in <strong className="text-navy-deep">under 10 minutes</strong> from right now.
                </p>
              </div>
            </div>

            {/* Personal Founder Promise + Detailed Refund Process */}
            <div className="bg-gradient-to-br from-navy-deep via-navy-rich to-navy-deep text-white rounded-2xl p-8 md:p-10 shadow-2xl mb-8">
              {/* Founder Promise Header */}
              <div className="flex flex-col md:flex-row items-start gap-6 mb-8 pb-8 border-b border-white/10">
                {/* Avatar */}
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-xl border-4 border-gold-premium/50 ring-4 ring-white/20">
                    <Image
                      src="/images/Sara 61kb.webp"
                      alt="Sara Cohen - Founder"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Promise Text */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                    <Heart className="w-5 h-5 text-red-400 fill-red-400" />
                    <h3 className="text-xl md:text-2xl font-black">My Personal Promise to You</h3>
                  </div>
                  <p className="text-white/90 text-base md:text-lg leading-relaxed mb-4">
                    "I've helped 500+ agents transform their businesses with AI. If you're not thrilled with AgentClone, or if you don't create your first video in 7 minutes, I'll personally refund you the same day—<span className="text-gold-premium font-bold">no questions asked</span>."
                  </p>
                  <div className="flex flex-col items-center md:items-start">
                    <p className="font-black text-lg text-gold-premium">Sara Cohen</p>
                    <p className="text-sm text-white/70">Founder, AIFastScale</p>
                  </div>
                </div>
              </div>

              {/* Super Easy Refund Process */}
              <div>
                <h4 className="text-xl md:text-2xl font-black text-center mb-6">
                  How to Get Your Refund <span className="text-emerald-400">(Takes 30 Seconds)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Option 1: Email - With Copy Template */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-success rounded-full flex items-center justify-center text-white font-black">
                        1
                      </div>
                      <div>
                        <h5 className="font-black text-white">Email Me</h5>
                        <p className="text-xs text-white/60">Copy & paste this template</p>
                      </div>
                    </div>

                    {/* Email Address - Easy to Copy */}
                    <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-lg p-3 mb-4">
                      <p className="text-xs text-white/70 mb-1">Send to:</p>
                      <div className="flex items-center justify-between gap-2">
                        <a
                          href="mailto:support@aifastscale.com"
                          className="text-emerald-400 font-bold text-sm hover:underline"
                        >
                          support@aifastscale.com
                        </a>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText('support@aifastscale.com')
                          }}
                          className="text-white/60 hover:text-white text-xs flex items-center gap-1 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          Copy
                        </button>
                      </div>
                    </div>

                    {/* Email Template - Easy to Copy */}
                    <div className="bg-navy-deep/50 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-white/70">Email Template:</p>
                        <button
                          onClick={copyEmailTemplate}
                          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3 h-3" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      <div className="text-xs text-white/80 leading-relaxed font-mono bg-black/20 p-3 rounded">
                        Subject: Refund Request
                        <br /><br />
                        Hi Sara, I'd like a refund for my AgentClone purchase.
                        <br />
                        Order email: [your email]
                        <br /><br />
                        Thanks!
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Instagram DM */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-gold-premium to-gold-dark rounded-full flex items-center justify-center text-white font-black">
                        2
                      </div>
                      <div>
                        <h5 className="font-black text-white">Instagram DM</h5>
                        <p className="text-xs text-white/60">Message me directly</p>
                      </div>
                    </div>

                    {/* Instagram Handle */}
                    <div className="bg-gradient-to-r from-gold-premium/10 to-gold-light/10 border-2 border-gold-premium/30 rounded-lg p-6 text-center">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <MessageCircle className="w-5 h-5 text-gold-premium" />
                        <p className="text-sm text-white/70">Find me on Instagram:</p>
                      </div>
                      <p className="text-3xl md:text-4xl font-black text-gold-premium">@sara.theagent</p>
                    </div>

                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <p className="text-xs text-white/60 mb-1">Just send me:</p>
                      <p className="text-sm text-white/90 italic">"Hi Sara, I'd like a refund for AgentClone"</p>
                    </div>
                  </div>
                </div>

                {/* Same Day Promise */}
                <div className="bg-emerald-500/10 border-2 border-emerald-400 rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Clock className="w-5 h-5 text-emerald-400" />
                    <p className="text-lg font-black text-white">Same-Day Refund Guarantee</p>
                  </div>
                  <p className="text-sm text-white/80">
                    I'll process your refund within 24 hours. No forms, no hassle, no questions.
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-emerald-400/30">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <p className="font-bold text-navy-deep text-sm">500+ Happy Agents</p>
                </div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gold-premium/30">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5 text-gold-premium" />
                  <p className="font-bold text-navy-deep text-sm">SSL Encrypted Payment</p>
                </div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-navy-deep/30">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5 text-navy-deep" />
                  <p className="font-bold text-navy-deep text-sm">Instant Access</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================
          5. MR. LUCAS CASE STUDY - Professional & Mobile-Optimized
          ================================================================ */}
      <section className="py-12 md:py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          {/* MR LUCAS VIDEO + CASE STUDY - PSYCHOLOGICAL PROOF */}
          <div className="bg-gradient-to-br from-purple-900/30 via-navy-rich to-black rounded-2xl p-6 md:p-8 border-2 border-purple-500/50 shadow-2xl mx-auto max-w-4xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm border border-purple-400/40 rounded-full px-5 py-2 mb-4">
                <PlayCircle className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 font-bold text-sm uppercase tracking-widest">Verified Case Study</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-white mb-3 leading-tight">
                Watch The <span className="text-purple-400">Exact Video</span> We Created<br className="hidden md:block" />
                That Got Mr. Lucas <span className="text-emerald-400">3 Paid Clients</span> In 7 Days
              </h2>
              <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                This isn't a testimonial. This is the <span className="text-emerald-400 font-bold">actual AI video</span> we delivered to him.
                <br className="hidden md:block" />
                <span className="text-white/70">He posted it once. Got 3 appointments. Closed deals worth $12,000+ in commission.</span>
              </p>
            </div>

            {/* VIDEO PLAYER WITH CUSTOM PLAY BUTTON - VERTICAL REEL FORMAT */}
            <div className="relative w-full max-w-md mx-auto mb-6 group">
              <div className="relative aspect-[9/16] rounded-xl overflow-hidden shadow-2xl border-2 border-purple-400/30">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  preload="metadata"
                  playsInline
                  poster="/images/mr-lucas-thumbnail.jpg"
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                  onEnded={() => setIsVideoPlaying(false)}
                  controls
                >
                  <source src="/videos/Mr Lucas.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* CUSTOM PROFESSIONAL PLAY BUTTON OVERLAY */}
                {!isVideoPlaying && (
                  <div
                    onClick={handlePlayVideo}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm cursor-pointer transition-all duration-300 group-hover:bg-black/50"
                  >
                    <div className="relative">
                      {/* Pulsing ring animation */}
                      <div className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping" />
                      {/* Play button */}
                      <div className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 shadow-2xl shadow-purple-500/50 group-hover:scale-110 transition-transform duration-300 border-4 border-white/20">
                        <PlayCircle className="w-10 h-10 md:w-12 md:h-12 text-white fill-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-0 right-0 text-center">
                      <p className="text-white font-bold text-sm md:text-base drop-shadow-lg">
                        Click to see Mr. Lucas's results
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* SOCIAL PROOF STAMP */}
              <div className="absolute -top-3 -right-3 bg-emerald-500 text-white px-4 py-2 rounded-full shadow-xl border-2 border-white transform rotate-12 z-10">
                <p className="font-black text-xs md:text-sm uppercase">Real Results</p>
              </div>
            </div>

            {/* RESULTS HIGHLIGHT - SPECIFIC & CREDIBLE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-center border border-purple-400/20 hover:border-purple-400/40 transition-all">
                <div className="text-3xl md:text-4xl font-black text-purple-400 mb-1">3</div>
                <div className="text-white/80 text-sm font-semibold">Listing Appointments</div>
                <div className="text-white/50 text-xs mt-1">In first 7 days</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-center border border-purple-400/20 hover:border-purple-400/40 transition-all">
                <div className="text-3xl md:text-4xl font-black text-purple-400 mb-1">18hrs</div>
                <div className="text-white/80 text-sm font-semibold">Delivery Time</div>
                <div className="text-white/50 text-xs mt-1">Under 24hr guarantee</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-center border border-purple-400/20 hover:border-purple-400/40 transition-all">
                <div className="text-3xl md:text-4xl font-black text-emerald-400 mb-1">$12K+</div>
                <div className="text-white/80 text-sm font-semibold">Commission Generated</div>
                <div className="text-white/50 text-xs mt-1">From ONE video</div>
              </div>
            </div>

            {/* PSYCHOLOGICAL TRIGGER: FEAR OF MISSING OUT */}
            <div className="bg-gradient-to-r from-gold-premium/20 to-yellow-500/20 border border-gold-premium/40 rounded-lg p-4">
              <p className="text-white/90 text-center text-sm md:text-base">
                <span className="font-black text-gold-premium">Think about it:</span> While you're learning editing software and fighting with AI tools,
                <br className="hidden md:block" />
                <span className="text-emerald-400 font-bold">other agents are already booking appointments with videos like this.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA After Case Study */}
      <section className="py-8 md:py-12 bg-gradient-to-r from-emerald-500/5 to-green-success/5">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <button
              onClick={() => setShowSpinWheel(true)}
              className="inline-block bg-gradient-to-r from-emerald-500 to-green-success text-white px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-lg md:text-xl hover:scale-105 transition-transform shadow-2xl w-full md:w-auto"
            >
              <Gift className="w-5 h-5 md:w-6 md:h-6 inline mr-2" />
              Start Your Transformation Now →
            </button>
            <p className="text-xs md:text-sm text-gray-500 mt-3">
              Join 500+ agents who transformed their business
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          GUARANTEE SECTION #2 - TRIPLE PROTECTION (After Case Study)
          ================================================================ */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-emerald-500/10 via-green-success/10 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(16, 185, 129, 0.3) 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="text-center mb-8 md:mb-12">
              {/* Triple Protection Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-success text-white px-6 py-2.5 rounded-full mb-6 shadow-lg">
                <Shield className="w-5 h-5" />
                <span className="font-black text-sm uppercase tracking-wide">Triple Guarantee Protection</span>
              </div>

              {/* Main Headline */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-navy-deep mb-4">
                You're <span className="bg-gradient-to-r from-emerald-500 to-green-success bg-clip-text text-transparent">100% Protected</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                We remove ALL risk from your decision. Here's how we protect you:
              </p>
            </div>

            {/* 2 Guarantee Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-12 max-w-4xl mx-auto">

              {/* Card 1: 30-Day Money Back */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl border-2 border-emerald-400/30 hover:border-emerald-400 transition-all hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-success rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                  <Shield className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-navy-deep mb-3 text-center">
                  30-Day Money Back
                </h3>
                <p className="text-gray-600 text-sm md:text-base text-center leading-relaxed">
                  Don't love it? Email me within 30 days for a <strong className="text-emerald-600">full refund</strong>. No questions asked. No forms to fill out.
                </p>
              </div>

              {/* Card 2: Instant Access */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl border-2 border-navy-deep/30 hover:border-navy-deep transition-all hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-navy-deep to-navy-rich rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                  <Clock className="w-8 h-8 text-gold-premium" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-navy-deep mb-3 text-center">
                  Instant Access
                </h3>
                <p className="text-gray-600 text-sm md:text-base text-center leading-relaxed">
                  Get immediate access to everything. Start creating videos in <strong className="text-navy-deep">under 10 minutes</strong> from right now.
                </p>
              </div>
            </div>

            {/* Personal Founder Promise + Detailed Refund Process */}
            <div className="bg-gradient-to-br from-navy-deep via-navy-rich to-navy-deep text-white rounded-2xl p-8 md:p-10 shadow-2xl mb-8">
              {/* Founder Promise Header */}
              <div className="flex flex-col md:flex-row items-start gap-6 mb-8 pb-8 border-b border-white/10">
                {/* Avatar */}
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-xl border-4 border-gold-premium/50 ring-4 ring-white/20">
                    <Image
                      src="/images/Sara 61kb.webp"
                      alt="Sara Cohen - Founder"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Promise Text */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                    <Heart className="w-5 h-5 text-red-400 fill-red-400" />
                    <h3 className="text-xl md:text-2xl font-black">My Personal Promise to You</h3>
                  </div>
                  <p className="text-white/90 text-base md:text-lg leading-relaxed mb-4">
                    "I've helped 500+ agents transform their businesses with AI. If you're not thrilled with AgentClone, or if you don't create your first video in 7 minutes, I'll personally refund you the same day—<span className="text-gold-premium font-bold">no questions asked</span>."
                  </p>
                  <div className="flex flex-col items-center md:items-start">
                    <p className="font-black text-lg text-gold-premium">Sara Cohen</p>
                    <p className="text-sm text-white/70">Founder, AIFastScale</p>
                  </div>
                </div>
              </div>

              {/* Super Easy Refund Process */}
              <div>
                <h4 className="text-xl md:text-2xl font-black text-center mb-6">
                  How to Get Your Refund <span className="text-emerald-400">(Takes 30 Seconds)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Option 1: Email - With Copy Template */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-success rounded-full flex items-center justify-center text-white font-black">
                        1
                      </div>
                      <div>
                        <h5 className="font-black text-white">Email Me</h5>
                        <p className="text-xs text-white/60">Copy & paste this template</p>
                      </div>
                    </div>

                    {/* Email Address - Easy to Copy */}
                    <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-lg p-3 mb-4">
                      <p className="text-xs text-white/70 mb-1">Send to:</p>
                      <div className="flex items-center justify-between gap-2">
                        <a
                          href="mailto:support@aifastscale.com"
                          className="text-emerald-400 font-bold text-sm hover:underline"
                        >
                          support@aifastscale.com
                        </a>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText('support@aifastscale.com')
                          }}
                          className="text-white/60 hover:text-white text-xs flex items-center gap-1 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          Copy
                        </button>
                      </div>
                    </div>

                    {/* Email Template - Easy to Copy */}
                    <div className="bg-navy-deep/50 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-white/70">Email Template:</p>
                        <button
                          onClick={copyEmailTemplate}
                          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3 h-3" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      <div className="text-xs text-white/80 leading-relaxed font-mono bg-black/20 p-3 rounded">
                        Subject: Refund Request
                        <br /><br />
                        Hi Sara, I'd like a refund for my AgentClone purchase.
                        <br />
                        Order email: [your email]
                        <br /><br />
                        Thanks!
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Instagram DM */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-gold-premium to-gold-dark rounded-full flex items-center justify-center text-white font-black">
                        2
                      </div>
                      <div>
                        <h5 className="font-black text-white">Instagram DM</h5>
                        <p className="text-xs text-white/60">Message me directly</p>
                      </div>
                    </div>

                    {/* Instagram Handle */}
                    <div className="bg-gradient-to-r from-gold-premium/10 to-gold-light/10 border-2 border-gold-premium/30 rounded-lg p-6 text-center">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <MessageCircle className="w-5 h-5 text-gold-premium" />
                        <p className="text-sm text-white/70">Find me on Instagram:</p>
                      </div>
                      <p className="text-3xl md:text-4xl font-black text-gold-premium">@sara.theagent</p>
                    </div>

                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <p className="text-xs text-white/60 mb-1">Just send me:</p>
                      <p className="text-sm text-white/90 italic">"Hi Sara, I'd like a refund for AgentClone"</p>
                    </div>
                  </div>
                </div>

                {/* Same Day Promise */}
                <div className="bg-emerald-500/10 border-2 border-emerald-400 rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Clock className="w-5 h-5 text-emerald-400" />
                    <p className="text-lg font-black text-white">Same-Day Refund Guarantee</p>
                  </div>
                  <p className="text-sm text-white/80">
                    I'll process your refund within 24 hours. No forms, no hassle, no questions.
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-emerald-400/30">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <p className="font-bold text-navy-deep text-sm">500+ Happy Agents</p>
                </div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gold-premium/30">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5 text-gold-premium" />
                  <p className="font-bold text-navy-deep text-sm">SSL Encrypted Payment</p>
                </div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-navy-deep/30">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5 text-navy-deep" />
                  <p className="font-bold text-navy-deep text-sm">Instant Access</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================
          6. PRICING COMPARISON (OLD vs DIY vs SMART WAY)
          ================================================================ */}
      <section className="py-8 md:py-16 bg-gradient-to-br from-navy-deep via-navy-rich to-navy-deep text-white">
        <div className="container mx-auto px-3 md:px-4">
          <div className="max-w-6xl mx-auto">

            {/* Section Header - Compact */}
            <div className="text-center mb-6 md:mb-10">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-black mb-2 leading-tight">
                Compare Your <span className="text-gold-premium">Options</span>
              </h2>
              <p className="text-sm md:text-base text-gray-400">See why 500+ agents chose the smart way</p>
            </div>

            {/* Comparison Grid - Redesigned for Mobile */}
            <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">

              {/* OLD WAY - Compact */}
              <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900 p-4 md:p-6 rounded-lg border border-red-500/30 hover:border-red-500/60 transition-all">
                {/* Badge */}
                <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  Expensive
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                    <X className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-red-400 uppercase tracking-wide mb-1">Old Way</div>
                    <h3 className="text-base md:text-lg font-black text-white leading-tight">Hire Videographer</h3>
                  </div>
                </div>

                <div className="bg-red-500/5 rounded-lg p-3 mb-3 border border-red-500/10">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl md:text-4xl font-black text-red-400">$500</span>
                    <span className="text-xs text-gray-500">/video</span>
                  </div>
                </div>

                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <X className="w-3 h-3 text-red-500/60 flex-shrink-0" />
                    <span>Wait for scheduling</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <X className="w-3 h-3 text-red-500/60 flex-shrink-0" />
                    <span>Travel to location</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <X className="w-3 h-3 text-red-500/60 flex-shrink-0" />
                    <span>Expensive equipment</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <X className="w-3 h-3 text-red-500/60 flex-shrink-0" />
                    <span>Revision fees</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-700">
                  <p className="text-center text-xs md:text-sm">
                    <span className="text-gray-500">50 videos =</span>{' '}
                    <span className="font-black text-red-400">$25,000</span>
                  </p>
                </div>
              </div>

              {/* DIY WAY - Compact */}
              <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900 p-4 md:p-6 rounded-lg border border-gray-600/30 hover:border-gray-500/60 transition-all">
                {/* Badge */}
                <div className="absolute -top-2 -right-2 bg-gray-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  Time Sink
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gray-600/10 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">DIY Way</div>
                    <h3 className="text-base md:text-lg font-black text-white leading-tight">Learn Video Editing</h3>
                  </div>
                </div>

                <div className="bg-gray-600/5 rounded-lg p-3 mb-3 border border-gray-600/10">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl md:text-4xl font-black text-gray-300">$3K+</span>
                  </div>
                  <p className="text-center text-[10px] text-gray-500 mt-1">+ 100+ hours learning</p>
                </div>

                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <X className="w-3 h-3 text-gray-500/60 flex-shrink-0" />
                    <span>Software subscriptions</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <X className="w-3 h-3 text-gray-500/60 flex-shrink-0" />
                    <span>Online courses</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <X className="w-3 h-3 text-gray-500/60 flex-shrink-0" />
                    <span>Months to learn</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <X className="w-3 h-3 text-gray-500/60 flex-shrink-0" />
                    <span>Still looks amateur</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-700">
                  <p className="text-center text-xs md:text-sm font-bold text-gray-400">
                    Time = Money Lost
                  </p>
                </div>
              </div>

              {/* SMART WAY - AgentClone - Highlighted */}
              <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 md:p-6 rounded-lg border-2 border-gold-premium shadow-2xl shadow-emerald-500/20 scale-[1.02] md:scale-105">
                {/* Badge */}
                <div className="absolute -top-2 -right-2 bg-gold-premium text-navy-deep px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg">
                  Best Value
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Check className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={3} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-emerald-100 uppercase tracking-wide mb-1">Smart Way</div>
                    <h3 className="text-base md:text-lg font-black text-white leading-tight">AgentClone AI</h3>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-3 border border-white/20">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl md:text-4xl font-black text-white">$37</span>
                  </div>
                  <p className="text-center text-[10px] text-emerald-100 mt-1 font-semibold">one-time payment</p>
                </div>

                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-xs text-white font-medium">
                    <Check className="w-3 h-3 text-gold-premium flex-shrink-0" strokeWidth={3} />
                    <span>Works in 7 minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white font-medium">
                    <Check className="w-3 h-3 text-gold-premium flex-shrink-0" strokeWidth={3} />
                    <span>Unlimited videos</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white font-medium">
                    <Check className="w-3 h-3 text-gold-premium flex-shrink-0" strokeWidth={3} />
                    <span>No skills needed</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white font-medium">
                    <Check className="w-3 h-3 text-gold-premium flex-shrink-0" strokeWidth={3} />
                    <span>Professional quality</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/20">
                  <p className="text-center text-xs md:text-sm">
                    <span className="text-emerald-100">You save:</span>{' '}
                    <span className="font-black text-gold-premium text-base md:text-lg">$24,963!</span>
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ================================================================
          7. FINAL CTA SECTION
          ================================================================ */}
      <section id="cta-section" className="py-12 md:py-20 bg-gradient-to-br from-gold-premium via-gold-light to-gold-premium">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">

            <h2 className="text-3xl md:text-5xl font-black text-navy-deep mb-4 md:mb-6">
              Ready to Transform Your<br />Real Estate Business?
            </h2>

            <p className="text-lg md:text-2xl text-navy-rich mb-8 md:mb-12">
              Join 500+ agents who are already using AI to dominate their market
            </p>

            {/* Selected Gift Display */}
            {selectedGift && (
              <div className="bg-gradient-to-r from-emerald-500 to-green-success text-white p-6 rounded-2xl mb-8 shadow-2xl">
                <div className="flex items-center justify-center gap-4 mb-3">
                  <span className="text-4xl">{selectedGift.emoji || '🎁'}</span>
                  <div>
                    <p className="font-black text-xl">YOUR BONUS IS LOCKED IN!</p>
                    <p className="text-sm">{selectedGift.name || selectedGift.shortName}</p>
                  </div>
                </div>
                <p className="text-white/90 text-sm">
                  Complete your purchase now to claim this exclusive bonus
                </p>
              </div>
            )}

            {/* Price Display */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-2xl">
              <p className="text-gray-600 text-lg mb-2">Total Value: <span className="line-through">$2,085</span></p>
              <p className="text-5xl md:text-6xl font-black text-navy-deep mb-2">$37</p>
              <p className="text-emerald-600 font-bold text-lg">98% OFF - BLACK FRIDAY ONLY</p>
              <p className="text-sm text-gray-600 mt-3 flex items-center justify-center gap-1.5">
                <Clock className="w-4 h-4" />
                Price increases to $97 after midnight
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setShowSpinWheel(true)}
              className="inline-block bg-gradient-to-r from-navy-deep to-navy-rich text-white px-10 py-6 rounded-2xl font-black text-xl md:text-2xl hover:scale-105 transition-transform shadow-2xl border-4 border-white w-full md:w-auto mb-4"
            >
              YES! Give Me Everything For $37 →
            </button>

            <p className="text-navy-deep text-sm">
              <Shield className="w-4 h-4 inline mr-1" />
              30-Day Money-Back Guarantee • Instant Access • SSL Secured
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          8. FAQ SECTION
          ================================================================ */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-center text-navy-deep mb-8 md:mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {[
                {
                  q: "Do I need any tech skills?",
                  a: "Absolutely not! If you can upload a photo and copy/paste text, you can do this. The AI handles everything else. We've had 70-year-old agents master this in under 10 minutes."
                },
                {
                  q: "How long does it take to create videos?",
                  a: "About 7 minutes to create your first video. Once you have your avatar set up, you can create 50+ personalized videos in a single afternoon. Most agents spend less than 10 minutes per week on content creation."
                },
                {
                  q: "Do I have to appear on camera?",
                  a: "Not at all! That's the beauty of AI. You can use a single photo (professional headshot or even a casual photo) and the AI creates realistic talking videos. Never record yourself again if you don't want to."
                },
                {
                  q: "What if I don't get results?",
                  a: "We offer a 30-day money-back guarantee. If you don't create at least one video in 7 minutes, or if you're not satisfied for ANY reason, just email me at support@aifastscale.com and I'll refund you the same day. No forms, no questions."
                },
                {
                  q: "Is this a subscription or one-time payment?",
                  a: "One-time payment of $37. No monthly fees, no hidden costs. You get lifetime access to the training, all bonuses, and any future updates we add."
                },
                {
                  q: "Will this work for my market/niche?",
                  a: "Yes! Our system works for residential, luxury, commercial, and even property management. The AI can be customized for any real estate niche. We have agents in 47 states using this successfully."
                },
                {
                  q: "When do I get access?",
                  a: "Immediately after purchase. You'll receive login credentials via email within 60 seconds. You can literally create your first AI video in the next 10 minutes."
                },
                {
                  q: "Is the $37 price really going up?",
                  a: "Yes. This is a Black Friday special. On December 2nd at midnight, the price increases to $97. We're only offering this price to the first 500 agents who join during this promotion."
                }
              ].map((faq, i) => (
                <div key={i} className="bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200">
                  <button
                    onClick={() => setActiveQuestion(activeQuestion === i ? null : i)}
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-bold text-navy-deep text-base md:text-lg pr-4">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-gold-premium flex-shrink-0 transition-transform ${activeQuestion === i ? 'rotate-180' : ''}`} />
                  </button>
                  {activeQuestion === i && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA after FAQ */}
            <div className="text-center mt-12">
              <p className="text-xl text-navy-deep font-bold mb-6">
                Still have questions? Try it risk-free for 30 days.
              </p>
              <button
                onClick={() => setShowSpinWheel(true)}
                className="inline-block bg-gradient-to-r from-gold-premium to-gold-dark text-navy-deep px-10 py-5 rounded-xl font-bold text-xl hover:scale-105 transition-transform shadow-2xl"
              >
                <Gift className="w-6 h-6 inline mr-2" />
                Spin The Wheel & Save Big →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          GUARANTEE SECTION #3 - TRIPLE PROTECTION (Before Footer)
          ================================================================ */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-emerald-500/10 via-green-success/10 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(16, 185, 129, 0.3) 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="text-center mb-8 md:mb-12">
              {/* Triple Protection Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-success text-white px-6 py-2.5 rounded-full mb-6 shadow-lg">
                <Shield className="w-5 h-5" />
                <span className="font-black text-sm uppercase tracking-wide">Triple Guarantee Protection</span>
              </div>

              {/* Main Headline */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-navy-deep mb-4">
                You're <span className="bg-gradient-to-r from-emerald-500 to-green-success bg-clip-text text-transparent">100% Protected</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                We remove ALL risk from your decision. Here's how we protect you:
              </p>
            </div>

            {/* 2 Guarantee Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-12 max-w-4xl mx-auto">

              {/* Card 1: 30-Day Money Back */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl border-2 border-emerald-400/30 hover:border-emerald-400 transition-all hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-success rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                  <Shield className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-navy-deep mb-3 text-center">
                  30-Day Money Back
                </h3>
                <p className="text-gray-600 text-sm md:text-base text-center leading-relaxed">
                  Don't love it? Email me within 30 days for a <strong className="text-emerald-600">full refund</strong>. No questions asked. No forms to fill out.
                </p>
              </div>

              {/* Card 2: Instant Access */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl border-2 border-navy-deep/30 hover:border-navy-deep transition-all hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-navy-deep to-navy-rich rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                  <Clock className="w-8 h-8 text-gold-premium" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-navy-deep mb-3 text-center">
                  Instant Access
                </h3>
                <p className="text-gray-600 text-sm md:text-base text-center leading-relaxed">
                  Get immediate access to everything. Start creating videos in <strong className="text-navy-deep">under 10 minutes</strong> from right now.
                </p>
              </div>
            </div>

            {/* Personal Founder Promise + Detailed Refund Process */}
            <div className="bg-gradient-to-br from-navy-deep via-navy-rich to-navy-deep text-white rounded-2xl p-8 md:p-10 shadow-2xl mb-8">
              {/* Founder Promise Header */}
              <div className="flex flex-col md:flex-row items-start gap-6 mb-8 pb-8 border-b border-white/10">
                {/* Avatar */}
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-xl border-4 border-gold-premium/50 ring-4 ring-white/20">
                    <Image
                      src="/images/Sara 61kb.webp"
                      alt="Sara Cohen - Founder"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Promise Text */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                    <Heart className="w-5 h-5 text-red-400 fill-red-400" />
                    <h3 className="text-xl md:text-2xl font-black">My Personal Promise to You</h3>
                  </div>
                  <p className="text-white/90 text-base md:text-lg leading-relaxed mb-4">
                    "I've helped 500+ agents transform their businesses with AI. If you're not thrilled with AgentClone, or if you don't create your first video in 7 minutes, I'll personally refund you the same day—<span className="text-gold-premium font-bold">no questions asked</span>."
                  </p>
                  <div className="flex flex-col items-center md:items-start">
                    <p className="font-black text-lg text-gold-premium">Sara Cohen</p>
                    <p className="text-sm text-white/70">Founder, AIFastScale</p>
                  </div>
                </div>
              </div>

              {/* Super Easy Refund Process */}
              <div>
                <h4 className="text-xl md:text-2xl font-black text-center mb-6">
                  How to Get Your Refund <span className="text-emerald-400">(Takes 30 Seconds)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Option 1: Email - With Copy Template */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-success rounded-full flex items-center justify-center text-white font-black">
                        1
                      </div>
                      <div>
                        <h5 className="font-black text-white">Email Me</h5>
                        <p className="text-xs text-white/60">Copy & paste this template</p>
                      </div>
                    </div>

                    {/* Email Address - Easy to Copy */}
                    <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-lg p-3 mb-4">
                      <p className="text-xs text-white/70 mb-1">Send to:</p>
                      <div className="flex items-center justify-between gap-2">
                        <a
                          href="mailto:support@aifastscale.com"
                          className="text-emerald-400 font-bold text-sm hover:underline"
                        >
                          support@aifastscale.com
                        </a>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText('support@aifastscale.com')
                          }}
                          className="text-white/60 hover:text-white text-xs flex items-center gap-1 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          Copy
                        </button>
                      </div>
                    </div>

                    {/* Email Template - Easy to Copy */}
                    <div className="bg-navy-deep/50 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-white/70">Email Template:</p>
                        <button
                          onClick={copyEmailTemplate}
                          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3 h-3" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      <div className="text-xs text-white/80 leading-relaxed font-mono bg-black/20 p-3 rounded">
                        Subject: Refund Request
                        <br /><br />
                        Hi Sara, I'd like a refund for my AgentClone purchase.
                        <br />
                        Order email: [your email]
                        <br /><br />
                        Thanks!
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Instagram DM */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-gold-premium to-gold-dark rounded-full flex items-center justify-center text-white font-black">
                        2
                      </div>
                      <div>
                        <h5 className="font-black text-white">Instagram DM</h5>
                        <p className="text-xs text-white/60">Message me directly</p>
                      </div>
                    </div>

                    {/* Instagram Handle */}
                    <div className="bg-gradient-to-r from-gold-premium/10 to-gold-light/10 border-2 border-gold-premium/30 rounded-lg p-6 text-center">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <MessageCircle className="w-5 h-5 text-gold-premium" />
                        <p className="text-sm text-white/70">Find me on Instagram:</p>
                      </div>
                      <p className="text-3xl md:text-4xl font-black text-gold-premium">@sara.theagent</p>
                    </div>

                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <p className="text-xs text-white/60 mb-1">Just send me:</p>
                      <p className="text-sm text-white/90 italic">"Hi Sara, I'd like a refund for AgentClone"</p>
                    </div>
                  </div>
                </div>

                {/* Same Day Promise */}
                <div className="bg-emerald-500/10 border-2 border-emerald-400 rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Clock className="w-5 h-5 text-emerald-400" />
                    <p className="text-lg font-black text-white">Same-Day Refund Guarantee</p>
                  </div>
                  <p className="text-sm text-white/80">
                    I'll process your refund within 24 hours. No forms, no hassle, no questions.
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-emerald-400/30">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <p className="font-bold text-navy-deep text-sm">500+ Happy Agents</p>
                </div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gold-premium/30">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5 text-gold-premium" />
                  <p className="font-bold text-navy-deep text-sm">SSL Encrypted Payment</p>
                </div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-navy-deep/30">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5 text-navy-deep" />
                  <p className="font-bold text-navy-deep text-sm">Instant Access</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================
          9. FOOTER
          ================================================================ */}
      <footer className="bg-navy-deep text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">

            {/* Footer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

              {/* Column 1: Brand */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-8 h-8 text-gold-premium" />
                  <span className="text-2xl font-bold">
                    AI<span className="text-gold-premium">FastScale</span>
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  Helping real estate agents dominate their market with AI-powered video marketing.
                </p>
              </div>

              {/* Column 2: Quick Links */}
              <div>
                <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <button onClick={() => setShowSpinWheel(true)} className="text-gray-400 hover:text-gold-premium transition-colors">
                      Spin To Win
                    </button>
                  </li>
                  <li>
                    <a href="mailto:support@aifastscale.com" className="text-gray-400 hover:text-gold-premium transition-colors">
                      Contact Support
                    </a>
                  </li>
                  <li>
                    <a href="https://instagram.com/sara.theagent" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold-premium transition-colors">
                      Instagram
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 3: Contact */}
              <div>
                <h3 className="font-bold text-lg mb-4">Contact</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gold-premium" />
                    <a href="mailto:support@aifastscale.com" className="text-gray-400 hover:text-gold-premium transition-colors">
                      support@aifastscale.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-gold-premium" />
                    <a href="https://instagram.com/sara.theagent" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold-premium transition-colors">
                      @sara.theagent
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-gray-700 pt-8 text-center">
              <p className="text-gray-400 text-sm mb-4">
                © 2025 AIFastScale. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs">
                Disclaimer: Results may vary. Your success depends on your effort, market conditions, and implementation. We cannot guarantee specific results.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Wistia Video Player Script */}
      <Script
        src="https://fast.wistia.net/assets/external/E-v1.js"
        strategy="lazyOnload"
      />

    </main>
  )
}
