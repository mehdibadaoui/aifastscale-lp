'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  Gift,
  Shield,
  CheckCircle,
  ArrowRight,
  ArrowDown,
  Clock,
  Users,
  Video,
  Upload,
  TrendingUp,
  Play,
  ChevronDown,
  Star,
  Check,
  X,
  AlertTriangle,
  Zap,
  Crown,
  MapPin,
  Award,
  DollarSign,
  Volume2,
  VolumeX,
  Eye,
  Heart,
  Camera,
  ThumbsUp,
  RefreshCw,
  MessageSquare,
  Calendar,
  FileText,
  Target,
  Bot,
  Sparkles,
} from 'lucide-react'
import { BONUS_PRODUCTS, getTotalBonusValue } from './config/bonus-products'
import { trackTikTokInitiateCheckout } from './components/TikTokPixel'
import { trackMetaEvent } from './components/MetaPixel'

// Combined tracking function for all platforms
const trackInitiateCheckout = (contentId: string, value: number) => {
  // TikTok tracking
  trackTikTokInitiateCheckout(contentId, value)
  // Meta Pixel tracking
  trackMetaEvent('InitiateCheckout', {
    content_ids: [contentId],
    content_name: '7 Minute AgentClone',
    content_type: 'product',
    value: value,
    currency: 'USD'
  })
}

export default function CleanLandingPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(true)
  // REMOVED: spotsLeft - fake scarcity kills trust
  const [viewersNow, setViewersNow] = useState(23)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Animation refs for scroll detection - initialize with hero visible for instant animation
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['hero']))

  const faqs = [
    {
      q: 'Does this really take only 7 minutes?',
      a: 'Yes. Upload photo (1 min), type script (2 min), AI generates (4 min). Done. Zero editing needed. I timed it myself.',
    },
    {
      q: 'Will people know it\'s AI?',
      a: 'Most can\'t tell. The lip-sync is incredibly realistic. Your clients care about your message, not how you made it. 847+ agents are already using this successfully.',
    },
    {
      q: 'I\'m not tech-savvy. Can I do this?',
      a: 'If you can text and upload a photo, you can do this. Step-by-step training included. Plus I\'m on Instagram if you get stuck.',
    },
    {
      q: 'Do I need expensive AI tools?',
      a: 'No. Everything is included. The system shows you exactly which free/cheap tools to use. No hidden costs.',
    },
    {
      q: 'Will this work in my market?',
      a: 'Yes. 847+ agents in Dubai, US, UK, Canada, Australia use this daily. Works globally. Supports all major languages.',
    },
    {
      q: 'When do I get access?',
      a: 'Immediately after signing up. Check your email for login details. You can create your first video in the next 10 minutes.',
    },
  ]

  const testimonials = [
    {
      id: 1,
      name: 'Sofia Martinez',
      role: 'Luxury Real Estate Agent',
      location: 'Miami, FL',
      image: '/images/Reviews/Review REA 1.webp',
      review: "I was skeptical about AI videos, but this changed everything. Created my first video in 7 minutes - got 4 qualified leads that same week.",
      results: '4 leads in first week',
    },
    {
      id: 2,
      name: 'Marcus Williams',
      role: 'Commercial Broker',
      location: 'Atlanta, GA',
      image: '/images/Reviews/Review REA 2.webp',
      review: "After 15 years in real estate, I thought I'd seen it all. Closed $2.3M in listings last month - all from AI video leads.",
      results: '$2.3M in closings',
    },
    {
      id: 3,
      name: 'Yasmin Al-Rashid',
      role: 'Property Consultant',
      location: 'Dubai, UAE',
      image: '/images/Reviews/Review REA 3.webp',
      review: "As a Dubai agent, I need to look premium. These AI videos make my listings look like million-dollar productions. Went from 2-3 leads to 15+ per week.",
      results: '15+ leads/week',
    },
    {
      id: 4,
      name: 'Dr. Raj Patel',
      role: 'Investment Specialist',
      location: 'London, UK',
      image: '/images/Reviews/Review REA 5.webp',
      review: "Was spending £800/month on video production. Now I create better content myself in minutes. ROI was immediate.",
      results: '50x ROI',
    },
    {
      id: 5,
      name: 'Jennifer Kim',
      role: 'Urban Properties',
      location: 'Vancouver, Canada',
      image: '/images/Reviews/Review REA 9.webp',
      review: "My listing video got 47K views. Sold the property in 5 days for $80K over asking. This system pays for itself daily.",
      results: 'Sold $80K over asking',
    },
    {
      id: 6,
      name: 'Carlos Mendoza',
      role: 'Family Homes Expert',
      location: 'Los Angeles, CA',
      image: '/images/Reviews/Review REA 11.webp',
      review: "25 years selling homes and I wish I had this sooner. 6 closings last month from social media alone.",
      results: '6 closings from social',
    },
  ]

  // Scroll animation observer - trigger animations as sections come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            if (entry.target.id) {
              setVisibleSections((prev) => new Set([...prev, entry.target.id]))
            }
          }
        })
      },
      { threshold: 0, rootMargin: '50px 0px 200px 0px' } // Trigger 200px before entering viewport
    )

    // Small delay to ensure DOM is ready
    const initTimer = setTimeout(() => {
      const animatedElements = document.querySelectorAll('[data-animate]')
      animatedElements.forEach((el) => observer.observe(el))
    }, 100)

    return () => {
      observer.disconnect()
      clearTimeout(initTimer)
    }
  }, [])

  // Countdown timer - REAL deadline: December 15th for Organic Leads Mastery bonus
  const BONUS_DEADLINE = new Date('2024-12-15T23:59:59')

  useEffect(() => {
    const calculateTimeToDeadline = () => {
      const now = new Date()
      const diff = BONUS_DEADLINE.getTime() - now.getTime()

      // If deadline passed, show zeros
      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      }
    }
    setTimeLeft(calculateTimeToDeadline())
    const timer = setInterval(() => setTimeLeft(calculateTimeToDeadline()), 1000)
    return () => clearInterval(timer)
  }, [])

  // REMOVED: Fake scarcity that resets - kills trust
  // Real urgency comes from the December 15th bonus deadline

  // Viewers
  useEffect(() => {
    const interval = setInterval(() => {
      setViewersNow(prev => {
        const change = Math.random() > 0.5 ? 1 : -1
        const newVal = prev + change
        return newVal < 15 ? 15 : newVal > 35 ? 35 : newVal
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (!element) return

    // Scroll to exactly the top of the section (with small padding)
    const targetPosition = element.offsetTop - 10
    const startPosition = window.scrollY
    const distance = targetPosition - startPosition
    const duration = 1200 // 1.2 seconds for smooth feel
    let startTime: number | null = null

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const animateScroll = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeProgress = easeOutCubic(progress)

      window.scrollTo(0, startPosition + distance * easeProgress)

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }

    requestAnimationFrame(animateScroll)
  }

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.muted = false
      setIsVideoMuted(false)
      videoRef.current.play()
      setIsVideoPlaying(true)
    }
  }

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsVideoMuted(!isVideoMuted)
    }
  }

  const totalBonusValue = getTotalBonusValue()

  // Animation class helper
  const getAnimClass = (sectionId: string, delay: number = 0) => {
    const isVisible = visibleSections.has(sectionId)
    return `transition-all duration-700 ${delay ? `delay-[${delay}ms]` : ''} ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`
  }

  return (
    <main className="min-h-screen bg-black bg-animated-gradient">
      {/* Subtle floating particles */}
      <div className="bg-particles" />

      {/* ================================================================
          1. HERO SECTION - BLACK WITH GOLD (Normal Structure)
          ================================================================ */}
      <section
        id="hero"
        data-animate
        className="relative bg-black text-white py-8 sm:py-16 md:py-20 overflow-hidden"
      >
        {/* Subtle gold grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.4) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        {/* Floating morphing blobs */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-gold-premium/5 rounded-full blur-3xl morph-blob animate-float-slow" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-gold-premium/5 rounded-full blur-3xl morph-blob animate-float-medium" style={{ animationDelay: '2s' }} />

        <div className="w-full px-4 sm:px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Main Headline - BIG & BOLD */}
            <h1 className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-5 sm:mb-8 leading-[1.05] tracking-tight ${visibleSections.has('hero') ? 'animate-fade-in-up' : ''}`}>
              <span className="text-white drop-shadow-lg">Turn Any Photo Into a</span>
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-gold-premium via-yellow-400 to-gold-premium bg-clip-text text-transparent drop-shadow-2xl" style={{ textShadow: '0 0 40px rgba(212, 175, 55, 0.3)' }}>
                  Talking AI Video
                </span>
              </span>
              <br />
              <span className="text-white drop-shadow-lg">&</span>
              <span className="bg-gradient-to-r from-gold-premium via-yellow-400 to-gold-premium bg-clip-text text-transparent" style={{ textShadow: '0 0 40px rgba(212, 175, 55, 0.3)' }}>
                {' '}Generate 100+ Leads
              </span>
            </h1>

            {/* Subtitle - Larger & More Visible */}
            <p className={`text-base sm:text-xl md:text-2xl text-gray-300 mb-5 sm:mb-8 max-w-2xl mx-auto font-medium ${visibleSections.has('hero') ? 'animate-fade-in-up animation-delay-200' : ''}`}>
              Even if you've never edited a video in your life —
              <br className="hidden sm:block" />
              <span className="text-white font-semibold">all you need is your phone</span>
            </p>

            {/* Hero Image - Clean, no badge - RESPONSIVE for mobile performance */}
            <div className={`relative max-w-5xl mx-auto mb-4 sm:mb-6 ${visibleSections.has('hero') ? 'animate-fade-in-up animation-delay-300' : ''}`}>
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-gold-premium/30 sm:border-2 sm:border-gold-premium/40 shadow-xl shadow-gold-premium/10">
                {/* Mobile: smaller optimized image */}
                <picture>
                  <source
                    media="(max-width: 768px)"
                    srcSet="/images/hero-showcase-mobile.webp"
                    type="image/webp"
                  />
                  <Image
                    src="/images/hero-showcase.webp"
                    alt="AI Video System Showcase"
                    width={1365}
                    height={768}
                    className="w-full h-auto"
                    priority
                    fetchPriority="high"
                  />
                </picture>
              </div>
            </div>

            {/* Trust badges - UNDER the image */}
            <div className={`flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 ${visibleSections.has('hero') ? 'animate-fade-in-up animation-delay-400' : ''}`}>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gold-premium" />
                <span><span className="text-white font-bold">847+</span> agents</span>
              </div>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-gold-premium text-gold-premium" />
                ))}
                <span className="ml-1 text-white font-bold">4.9/5</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gold-premium" />
                <span>30-Day Guarantee</span>
              </div>
            </div>

            {/* CTA - Scrolls to What's Inside */}
            <button
              onClick={() => scrollToSection('whats-inside')}
              className={`group relative bg-gradient-to-r from-gold-premium via-gold-light to-gold-premium text-black px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-black text-lg sm:text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-gold-premium/30 overflow-hidden animate-glow-pulse ${visibleSections.has('hero') ? 'animate-fade-in-up animation-delay-500' : ''}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative flex items-center gap-2 sm:gap-3">
                See What's Inside
                <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6" />
              </span>
            </button>

            {/* PRICE TEASER - Shows value early */}
            <div className={`mt-4 sm:mt-5 flex flex-col items-center gap-2 ${visibleSections.has('hero') ? 'animate-fade-in-up animation-delay-600' : ''}`}>
              <div className="flex items-center gap-2 sm:gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                <span className="text-gray-400 text-sm line-through">$1,696</span>
                <span className="text-gold-premium font-black text-lg sm:text-xl">$37</span>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">98% OFF</span>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm">One-time payment • Lifetime access • 30-day guarantee</p>
            </div>

            {/* What is AgentClone? - Collapsible */}
            <div className={`max-w-xl mx-auto mt-8 ${visibleSections.has('hero') ? 'animate-fade-in-up animation-delay-500' : ''}`}>
              <button
                onClick={() => setExpandedFaq(expandedFaq === -1 ? null : -1)}
                className="group flex items-center justify-center gap-2 mx-auto text-sm"
              >
                <span className="text-gold-premium font-medium border-b border-dashed border-gold-premium/40 group-hover:border-gold-premium transition-colors">
                  What is the AgentClone System?
                </span>
                <ChevronDown className={`w-4 h-4 text-gold-premium transition-transform duration-300 ${expandedFaq === -1 ? 'rotate-180' : ''}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-500 ease-out ${expandedFaq === -1 ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
                <div className="bg-gradient-to-br from-gold-premium/10 to-white/5 backdrop-blur-sm border border-gold-premium/20 rounded-xl p-5 text-left">
                  <p className="text-white text-sm leading-relaxed mb-3">
                    You upload <span className="text-gold-premium font-bold">one clear selfie</span> to a free AI software — the #1 tool for generating realistic talking videos in {new Date().getFullYear()}.
                  </p>
                  <p className="text-white/80 text-sm leading-relaxed mb-3">
                    The AI transforms your photo into a <span className="text-gold-premium font-bold">talking video of YOU</span> — your face moves, your lips sync perfectly, it looks 100% real. No filming. No editing. No experience needed.
                  </p>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Inside the AgentClone System, you get the <span className="text-white font-bold">complete A-to-Z video course</span> that shows you exactly how to do this — even if you've never touched AI before. Just follow along, copy-paste, and create professional videos that help you scale to 7 figures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          2. JESSICA CASE STUDY - LIGHT CREAM SECTION (Alternating)
          "She closed 17 buyer leads in 3 weeks"
          ================================================================ */}
      <section
        id="case-study"
        data-animate
        className="py-10 sm:py-24 bg-gradient-to-br from-stone-100 via-white to-stone-50 relative overflow-hidden"
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.15) 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Section Header - Attention Grabbing */}
            <div className={`text-center mb-8 sm:mb-12 relative z-10 ${visibleSections.has('case-study') ? 'animate-fade-in-up' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-gold-premium/20 border border-gold-premium/40 px-4 py-2 rounded-full mb-4">
                <div className="w-2 h-2 bg-gold-premium rounded-full animate-pulse" />
                <span className="text-gold-dark font-bold text-xs uppercase tracking-wide">Real Results • Real Agent</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-3 sm:mb-4 leading-tight">
                This is Jessica. She Got <span className="text-gold-dark">17 Buyer Leads</span>...
              </h2>
              <p className="text-xl sm:text-2xl text-gray-700 font-bold">Without Recording a Single Video.</p>
            </div>

            {/* Jessica Case Study Card - Premium Modern Design */}
            <div className={`relative bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-gold-premium/20 rounded-2xl sm:rounded-3xl overflow-hidden ${visibleSections.has('case-study') ? 'animate-fade-in-up animation-delay-200' : ''}`}>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold-premium/5 via-transparent to-gold-premium/5 pointer-events-none" />

              {/* Hero Section - Big Visual */}
              <div className="relative p-4 sm:p-8">
                {/* The Hook Text */}
                <div className="text-center mb-6">
                  <p className="text-gray-400 text-sm sm:text-base mb-2">Yes, even if you see her talking on camera...</p>
                  <p className="text-white text-2xl sm:text-3xl font-black mb-3 leading-tight">
                    She Never Filmed Anything.
                  </p>
                  <p className="text-gold-premium text-base sm:text-lg font-medium">
                    She just uploaded her photo, and the AI created a ready-to-post video for her.
                  </p>
                </div>

                {/* Big Before/After Video - Full Width - Autoplay like GIF */}
                <div className="relative w-full rounded-2xl overflow-hidden border-2 border-gold-premium/30 shadow-2xl shadow-gold-premium/10">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-auto"
                    poster="/images/jessica-photo_result.webp"
                  >
                    <source src="/videos/jessica-demo.mp4" type="video/mp4" />
                    {/* Fallback to static image for browsers that don't support video */}
                    <Image
                      src="/images/jessica-photo_result.webp"
                      alt="Jessica - Photo to AI Video transformation"
                      width={1365}
                      height={768}
                      className="w-full h-auto"
                    />
                  </video>
                  {/* Subtle gradient overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Verified Badge */}
                <div className="flex justify-center mt-4">
                  <div className="bg-gold-premium text-black text-xs sm:text-sm font-black px-4 py-2 rounded-full inline-flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    VERIFIED STORY
                  </div>
                </div>
              </div>

              {/* The Viral Growth Story - Visual Timeline */}
              <div className="bg-black/60 border-t border-b border-white/10 p-5 sm:p-10">
                <div className="text-center mb-6">
                  <span className="text-gold-premium text-xs sm:text-sm font-black uppercase tracking-wider">The Journey</span>
                </div>

                {/* Video Performance Cards */}
                <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8">
                  {[
                    { video: 'Video 1', views: '2,700', color: 'from-gray-600 to-gray-700' },
                    { video: 'Video 2', views: '19,000', color: 'from-gold-premium/60 to-gold-premium/40' },
                    { video: 'Video 3', views: '220,000', color: 'from-gold-premium to-yellow-500', highlight: true },
                  ].map((item, i) => (
                    <div key={i} className={`relative rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center ${item.highlight ? 'ring-2 ring-gold-premium shadow-lg shadow-gold-premium/20' : ''}`}
                      style={{ background: `linear-gradient(135deg, ${item.color.includes('gray') ? '#374151, #4b5563' : '#d4af37, #fbbf24'})` }}>
                      {item.highlight && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] sm:text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                          VIRAL
                        </div>
                      )}
                      <p className={`text-[10px] sm:text-xs font-bold mb-1 ${item.highlight ? 'text-black' : 'text-white/80'}`}>{item.video}</p>
                      <p className={`text-lg sm:text-3xl font-black ${item.highlight ? 'text-black' : 'text-white'}`}>{item.views}</p>
                      <p className={`text-[9px] sm:text-xs ${item.highlight ? 'text-black/70' : 'text-white/60'}`}>views</p>
                    </div>
                  ))}
                </div>

                {/* The Shock Moment */}
                <div className="bg-gradient-to-r from-gold-premium/10 to-transparent border-l-4 border-gold-premium rounded-r-xl p-4 sm:p-6 mb-6">
                  <p className="text-white text-base sm:text-xl font-bold leading-relaxed">
                    The third one shocked her. It reached <span className="text-gold-premium">220,000 views in 24 hours</span>...
                  </p>
                  <p className="text-gold-premium text-lg sm:text-2xl font-black mt-2">
                    And later grew to 1.2 MILLION.
                  </p>
                </div>

                {/* Social Proof Messages */}
                <div className="space-y-3">
                  <p className="text-gray-400 text-xs sm:text-sm font-medium text-center mb-3">Then something crazy happened...</p>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-gray-300 text-sm sm:text-base mb-3">Other real estate agents started messaging her:</p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-gold-premium flex-shrink-0 mt-0.5" />
                        <p className="text-white text-sm sm:text-base italic">"I saw your viral video on TikTok and Instagram"</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-gold-premium flex-shrink-0 mt-0.5" />
                        <p className="text-white text-sm sm:text-base italic">"I love how confident you looked on camera"</p>
                      </div>
                    </div>
                    <p className="text-gold-premium text-sm sm:text-base font-bold mt-4">
                      None of them knew Jessica never recorded anything herself.
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">It was all AI turning her image into a realistic talking video.</p>
                  </div>
                </div>
              </div>

              {/* Results Section - The Money Shot */}
              <div className="p-5 sm:p-10 bg-gradient-to-b from-transparent to-gold-premium/5">
                <div className="text-center mb-6">
                  <span className="text-gold-premium text-xs sm:text-sm font-black uppercase tracking-wider">The Results</span>
                </div>

                <div className="bg-white/5 border border-gold-premium/30 rounded-2xl p-5 sm:p-8 mb-6">
                  <p className="text-gray-300 text-sm sm:text-base mb-4">She didn't expect buyers from these videos...</p>
                  <p className="text-white text-lg sm:text-xl font-bold mb-6">But she ended up closing deals she never imagined:</p>

                  {/* Big Numbers */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-6">
                    <div className="text-center">
                      <div className="text-gold-premium text-3xl sm:text-5xl font-black">17</div>
                      <div className="text-white text-xs sm:text-sm font-bold">Buyer Leads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gold-premium text-3xl sm:text-5xl font-black">2</div>
                      <div className="text-white text-xs sm:text-sm font-bold">Closings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 text-3xl sm:text-5xl font-black">$18.4K</div>
                      <div className="text-white text-xs sm:text-sm font-bold">Commissions</div>
                    </div>
                  </div>

                  <p className="text-center text-gold-premium font-black text-base sm:text-xl mt-6">
                    All from videos she didn't even film.
                  </p>
                </div>
              </div>

              {/* CTA Section */}
              <div className="p-5 sm:p-10 bg-gradient-to-r from-gold-premium/20 via-gold-premium/10 to-gold-premium/20 border-t border-gold-premium/30">
                <div className="text-center max-w-2xl mx-auto">
                  <p className="text-gray-300 text-sm sm:text-base mb-3">I know it sounds strange, but you should try it yourself.</p>
                  <p className="text-white text-lg sm:text-xl font-bold mb-4">
                    For the first time ever, I'm giving a special offer on my video course that teaches real estate agents exactly how to do this from A to Z — <span className="text-gold-premium">even with zero experience</span>.
                  </p>

                  {/* Promise/Guarantee */}
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mt-6">
                    <p className="text-white font-bold text-sm sm:text-base mb-1">And here's my promise:</p>
                    <p className="text-green-400 text-sm sm:text-base">
                      If you don't get results, or you feel it's not worth it, contact me and I'll refund you 100%, no questions asked.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Stats Bar */}
              <div className="grid grid-cols-3 divide-x divide-white/10 bg-black/80">
                {[
                  { icon: Clock, value: '7 min', label: 'Per Video' },
                  { icon: Camera, value: '0', label: 'Filming Required' },
                  { icon: TrendingUp, value: '1.2M+', label: 'Total Views' },
                ].map((stat, i) => (
                  <div key={i} className="p-4 sm:p-6 text-center">
                    <stat.icon className="w-5 h-5 text-gold-premium mx-auto mb-2" />
                    <div className="text-white text-lg sm:text-2xl font-black">{stat.value}</div>
                    <div className="text-gray-500 text-[10px] sm:text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          3. WHAT'S INSIDE - DARK SECTION (Product Showcase)
          Now positioned right after Jessica's proof for maximum impact
          ================================================================ */}
      <section
        id="whats-inside"
        data-animate
        className="py-10 sm:py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden"
      >
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-premium/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold-premium/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="w-full px-3 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className={`text-center mb-6 sm:mb-12 ${visibleSections.has('whats-inside') ? 'animate-fade-in-up' : ''}`}>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-4">
                Here's What You Get <span className="text-gold-premium">Today</span>
              </h2>
              <p className="text-gray-400 text-sm sm:text-lg">Everything you need to start generating leads with AI videos</p>
            </div>

            {/* PRODUCT #1 - THE MAIN COURSE */}
            <div className={`bg-gradient-to-br from-gold-premium/15 to-gold-premium/5 border-2 border-gold-premium rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-6 ${
              visibleSections.has('whats-inside') ? 'animate-fade-in-up animation-delay-200' : ''
            }`}>
              {/* Large Course Thumbnail */}
              <div className="relative w-full aspect-video">
                <Image
                  src="/images/vd-course-thumbnail.webp"
                  alt="AgentClone 7-Minute Video System - Turn Your Image Into a Talking AI Video"
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>

              {/* Course Details */}
              <div className="p-4 sm:p-8">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="bg-gold-premium text-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-black">MAIN TRAINING</span>
                  <span className="text-gray-400 line-through text-xs sm:text-sm">$697</span>
                  <span className="text-gold-premium font-black text-xs sm:text-base">INCLUDED</span>
                </div>

                <h3 className="text-xl sm:text-3xl font-black text-white mb-2 sm:mb-3">AgentClone 7-Minute Video System</h3>
                <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed">
                  Even if you've never touched AI before — follow along and create your first talking video today.
                  No tech skills needed. I show you everything click-by-click.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                  {[
                    'Turn any photo into a talking AI video',
                    'Create your personal AI avatar that looks like you',
                    'Clone your voice so the AI speaks exactly like you',
                    'Put yourself anywhere — beaches, offices, luxury homes (looks 100% real)',
                    'All free tools included — zero monthly fees',
                    'Ready-to-use AI scriptwriter (writes viral scripts for you)',
                    'Every prompt you need — just copy & paste',
                    'Edit videos on your phone in minutes (no experience needed)',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm">
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-premium flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════
                BONUSES SECTION - HORMOZI OPTIMIZED (5 High-Value Products)
                Strategy: Quality > Quantity | Each passes "I'd buy this alone" test
                ════════════════════════════════════════════════════════════ */}

            {/* BONUSES HEADER - Premium Presentation */}
            <div className={`text-center mb-6 sm:mb-10 ${visibleSections.has('whats-inside') ? 'animate-fade-in-up animation-delay-300' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/40 px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-3">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                <span className="text-emerald-400 font-black text-sm sm:text-base uppercase tracking-wide">Limited Time Bonuses</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white mb-2">
                Plus <span className="text-gold-premium">${totalBonusValue}</span> in Premium Bonuses
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">5 irresistible resources that solve your biggest challenges</p>
            </div>

            {/* BONUS PRODUCTS - Premium Cards with Highlights */}
            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">

              {/* ══════════════════════════════════════════════════════════
                  BONUS #1 - ORGANIC LEADS MASTERY (THE ANCHOR - $197)
                  This is the "I'd pay for this alone" product
                  ══════════════════════════════════════════════════════════ */}
              <div className={`relative bg-gradient-to-br from-emerald-500/10 via-black to-emerald-500/5 border-2 border-emerald-500/50 rounded-2xl sm:rounded-3xl overflow-hidden hover-lift ${visibleSections.has('whats-inside') ? 'animate-fade-in-up' : ''}`}>
                {/* Premium Badge */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                  <span className="bg-gradient-to-r from-emerald-500 to-green-500 text-white font-black text-[10px] sm:text-xs px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/30 uppercase tracking-wider">
                    Most Valuable
                  </span>
                </div>

                <div className="p-5 sm:p-8">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
                      <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Bonus #1</span>
                        <div className="flex items-center gap-2">
                          <span className="text-red-400 line-through text-sm font-semibold">$197</span>
                          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-xs px-2.5 py-1 rounded-lg">FREE</span>
                        </div>
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black text-white">Organic Leads Mastery</h4>
                      <p className="text-emerald-400 font-medium text-sm sm:text-base">The Zero-Ad Blueprint: Get Free Buyer Leads from Instagram & TikTok</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    The complete system for attracting international buyers and sellers <span className="text-white font-bold">WITHOUT spending a single dollar on ads</span>. Learn exactly how to create viral content that reaches worldwide buyers, turn views into DMs, and DMs into signed deals.
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {[
                      'The Viral Content Formula (beat the algorithm)',
                      'Reach worldwide buyers with $0 ad spend',
                      'Content-to-DM Pipeline (views → conversations)',
                      '30-Day Viral Content Calendar (just post)',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 bg-emerald-500/10 rounded-lg px-3 py-2">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-white text-xs sm:text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ══════════════════════════════════════════════════════════
                  BONUS #2 - THE SCRIPT VAULT ($97)
                  ══════════════════════════════════════════════════════════ */}
              <div className={`relative bg-gradient-to-br from-amber-500/10 via-black to-amber-500/5 border border-amber-500/40 rounded-2xl overflow-hidden hover-lift ${visibleSections.has('whats-inside') ? 'animate-fade-in-up' : ''}`}>
                {/* Fan Favorite Badge */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[10px] sm:text-xs px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                    Fan Favorite
                  </span>
                </div>

                <div className="p-5 sm:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/30">
                      <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Bonus #2</span>
                        <div className="flex items-center gap-2">
                          <span className="text-red-400 line-through text-sm font-semibold">$97</span>
                          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-xs px-2.5 py-1 rounded-lg">FREE</span>
                        </div>
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black text-white">The Script Vault</h4>
                      <p className="text-amber-400 font-medium text-sm sm:text-base">100+ Viral Hooks, Scripts & Captions That Stop The Scroll</p>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    Never stare at a blank screen again. <span className="text-white font-bold">100+ proven hooks tested on 10M+ views</span>, ready-to-use video scripts, and captions that drive engagement. Just copy, paste, and post.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {[
                      '45 scroll-stopping hooks (tested on 10M+ views)',
                      '30 ready-to-film video scripts',
                      '25 high-engagement caption templates',
                      'Organized by category for quick access',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 bg-amber-500/10 rounded-lg px-3 py-2">
                        <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span className="text-white text-xs sm:text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ══════════════════════════════════════════════════════════
                  BONUS #3 - AI REAL ESTATE MENTOR ($97)
                  ══════════════════════════════════════════════════════════ */}
              <div className={`relative bg-gradient-to-br from-indigo-500/10 via-black to-indigo-500/5 border border-indigo-500/40 rounded-2xl overflow-hidden ${visibleSections.has('whats-inside') ? 'animate-fade-in-up' : ''}`}>
                <div className="p-5 sm:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
                      <Bot className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-indigo-400 font-bold text-xs uppercase tracking-wider">Bonus #3</span>
                        <div className="flex items-center gap-2">
                          <span className="text-red-400 line-through text-sm font-semibold">$97</span>
                          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-xs px-2.5 py-1 rounded-lg">FREE</span>
                        </div>
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black text-white">AI Real Estate Mentor</h4>
                      <p className="text-indigo-400 font-medium text-sm sm:text-base">Your 24/7 Expert Coach Trained on Top Producer Strategies</p>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    Get instant answers at 3am or 3pm. This custom AI is <span className="text-white font-bold">trained on strategies from agents who close $10M+ annually</span>. It's like having a mentor who never sleeps and never charges hourly.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {[
                      'Instant answers on scripts & objections',
                      'Pricing strategy & negotiation tactics',
                      'Content ideas generated in seconds',
                      'Available 24/7 (no $500/hour fees)',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 bg-indigo-500/10 rounded-lg px-3 py-2">
                        <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                        <span className="text-white text-xs sm:text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ══════════════════════════════════════════════════════════
                  BONUS #4 - DM-TO-DEAL SYSTEM ($67)
                  ══════════════════════════════════════════════════════════ */}
              <div className={`relative bg-gradient-to-br from-pink-500/10 via-black to-pink-500/5 border border-pink-500/40 rounded-2xl overflow-hidden ${visibleSections.has('whats-inside') ? 'animate-fade-in-up' : ''}`}>
                <div className="p-5 sm:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-pink-500/30">
                      <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-pink-400 font-bold text-xs uppercase tracking-wider">Bonus #4</span>
                        <div className="flex items-center gap-2">
                          <span className="text-red-400 line-through text-sm font-semibold">$67</span>
                          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-xs px-2.5 py-1 rounded-lg">FREE</span>
                        </div>
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black text-white">DM-to-Deal System</h4>
                      <p className="text-pink-400 font-medium text-sm sm:text-base">89 Copy-Paste Messages That Turn Followers Into Clients</p>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    The exact messages top agents use to convert DMs into signed deals. Each script tested to achieve <span className="text-white font-bold">40%+ response rates</span>. Stop winging your DMs and start closing.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {[
                      'First-touch messages that get replies',
                      'Follow-up sequences (day 1, 3, 7, 14)',
                      'Objection handling scripts',
                      '40%+ response rate proven',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 bg-pink-500/10 rounded-lg px-3 py-2">
                        <Check className="w-4 h-4 text-pink-400 flex-shrink-0" />
                        <span className="text-white text-xs sm:text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ══════════════════════════════════════════════════════════
                  BONUS #5 - 90-DAY AUTHORITY ACCELERATOR ($47)
                  ══════════════════════════════════════════════════════════ */}
              <div className={`relative bg-gradient-to-br from-purple-500/10 via-black to-purple-500/5 border border-purple-500/40 rounded-2xl overflow-hidden ${visibleSections.has('whats-inside') ? 'animate-fade-in-up' : ''}`}>
                <div className="p-5 sm:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
                      <Target className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-purple-400 font-bold text-xs uppercase tracking-wider">Bonus #5</span>
                        <div className="flex items-center gap-2">
                          <span className="text-red-400 line-through text-sm font-semibold">$47</span>
                          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-xs px-2.5 py-1 rounded-lg">FREE</span>
                        </div>
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black text-white">90-Day Authority Accelerator</h4>
                      <p className="text-purple-400 font-medium text-sm sm:text-base">The Week-by-Week Roadmap to Becoming THE Agent in Your Market</p>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    Stop guessing what to do next. This <span className="text-white font-bold">90-day blueprint</span> breaks down exactly what to post, when to post, and how to position yourself as the go-to agent in your market.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {[
                      'Week-by-week action plan (no guessing)',
                      '17-minute daily ritual for consistency',
                      'Milestone checkpoints to track progress',
                      'Position yourself as THE market expert',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 bg-purple-500/10 rounded-lg px-3 py-2">
                        <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <span className="text-white text-xs sm:text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* EXTRA VALUE - Support & Updates (Compact) */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 ${visibleSections.has('whats-inside') ? 'animate-fade-in-up' : ''}`}>
              <div className="bg-gradient-to-br from-gold-premium/10 to-transparent border border-gold-premium/30 rounded-xl p-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-gold-premium">
                    <Image src="/images/Sara 61kb.webp" alt="Sara" width={56} height={56} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Direct Access to Sara</h4>
                    <p className="text-gray-400 text-sm">Email + Instagram DM support</p>
                    <p className="text-gold-premium font-bold text-sm mt-1">INCLUDED</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gold-premium/10 to-transparent border border-gold-premium/30 rounded-xl p-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gold-premium rounded-full flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="w-7 h-7 text-black" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Lifetime Updates</h4>
                    <p className="text-gray-400 text-sm">New tools & templates weekly</p>
                    <p className="text-gold-premium font-bold text-sm mt-1">INCLUDED</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════
                HORMOZI VALUE STACK - Visual Price Breakdown
                Shows exactly what they get and the math
                ════════════════════════════════════════════════════════════ */}
            <div className={`bg-gradient-to-br from-gold-premium/20 via-black to-gold-premium/10 rounded-2xl border-2 border-gold-premium p-4 sm:p-8 ${
              visibleSections.has('whats-inside') ? 'animate-fade-in-up' : ''
            }`}>

              {/* Value Stack Header */}
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-black text-white mb-1">Here's Everything You Get Today</h3>
                <p className="text-gray-400 text-sm">The complete system to generate leads with AI videos</p>
              </div>

              {/* VALUE STACK - Line by Line */}
              <div className="bg-black/60 rounded-xl border border-gold-premium/30 p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="space-y-2 sm:space-y-3">
                  {/* Main Product */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold-premium flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base font-medium">AgentClone 7-Minute Video System</span>
                    </div>
                    <span className="text-gray-400 text-sm sm:text-base font-bold">$697</span>
                  </div>

                  {/* Bonus 1 */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base">Organic Leads Mastery</span>
                    </div>
                    <span className="text-gray-400 text-sm sm:text-base">$197</span>
                  </div>

                  {/* Bonus 2 */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base">The Script Vault (100+ Scripts)</span>
                    </div>
                    <span className="text-gray-400 text-sm sm:text-base">$97</span>
                  </div>

                  {/* Bonus 3 */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base">AI Real Estate Mentor (24/7)</span>
                    </div>
                    <span className="text-gray-400 text-sm sm:text-base">$97</span>
                  </div>

                  {/* Bonus 4 */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-pink-400 flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base">DM-to-Deal System (89 Scripts)</span>
                    </div>
                    <span className="text-gray-400 text-sm sm:text-base">$67</span>
                  </div>

                  {/* Bonus 5 */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base">90-Day Authority Accelerator</span>
                    </div>
                    <span className="text-gray-400 text-sm sm:text-base">$47</span>
                  </div>

                  {/* Extra Value */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold-premium flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base">Direct Access to Sara</span>
                    </div>
                    <span className="text-gray-400 text-sm sm:text-base">$197</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold-premium flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base">Lifetime Updates</span>
                    </div>
                    <span className="text-gray-400 text-sm sm:text-base">$297</span>
                  </div>

                  {/* TOTAL LINE */}
                  <div className="flex justify-between items-center pt-3 mt-2 border-t-2 border-gold-premium/50">
                    <span className="text-white text-base sm:text-lg font-black">TOTAL VALUE</span>
                    <span className="text-white text-base sm:text-lg font-black line-through decoration-red-500">$1,696</span>
                  </div>
                </div>
              </div>

              {/* TODAY'S PRICE - Big & Bold */}
              <div className="bg-gradient-to-r from-gold-premium/20 to-gold-premium/10 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 text-center border border-gold-premium/40">
                <p className="text-gold-premium font-bold text-sm sm:text-base mb-2">Get Everything Above For Just</p>
                <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2">
                  <span className="text-5xl sm:text-7xl font-black text-gold-premium">$37</span>
                  <div className="text-left">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm sm:text-base font-black block">SAVE $1,659</span>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">One-time payment</p>
                  </div>
                </div>
                <p className="text-white/60 text-xs sm:text-sm">That's less than a coffee a day for a month</p>
              </div>

              {/* DEADLINE - Creates Real Urgency */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 font-bold text-sm sm:text-base">Bonus Deadline</span>
                </div>
                <p className="text-white text-xs sm:text-sm">
                  <span className="font-bold">Organic Leads Mastery ($197 value)</span> is only included until{' '}
                  <span className="text-red-400 font-black">December 15th</span>
                </p>
              </div>

              {/* CTA Button - Hormozi Style */}
              <a
                href="https://whop.com/checkout/plan_7x5Kz1cflmrYH"
                onClick={() => trackInitiateCheckout('7min-agentclone', 37)}
                className="group relative w-full bg-gradient-to-r from-gold-premium via-yellow-400 to-gold-premium text-black py-5 sm:py-6 rounded-xl font-black text-lg sm:text-2xl shadow-2xl shadow-gold-premium/30 flex items-center justify-center gap-3 mb-4 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative flex items-center gap-2 sm:gap-3">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                  Yes! Give Me Instant Access
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </span>
              </a>

              {/* GUARANTEE - Prominent */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4 sm:p-5 mb-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-black text-base sm:text-lg mb-1">30-Day Money Back + $50 Cash Guarantee</h4>
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                      If you can't create videos in 7 minutes or this doesn't work for you — I'll refund every penny AND send you $50 for wasting your time. No questions. No hoops.
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-gray-400 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>100% Secure</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Instant Access</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-gold-premium" />
                  <span>847+ Agents</span>
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════
                WHAT HAPPENS NEXT - Reduces Purchase Anxiety
                ════════════════════════════════════════════════════════════ */}
            <div className={`mt-6 sm:mt-8 bg-white/5 rounded-xl border border-white/10 p-4 sm:p-6 ${
              visibleSections.has('whats-inside') ? 'animate-fade-in-up' : ''
            }`}>
              <h4 className="text-white font-bold text-base sm:text-lg mb-4 text-center">What Happens After You Click The Button?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { step: '1', title: 'Checkout', desc: 'Secure payment (2 min)', icon: CheckCircle },
                  { step: '2', title: 'Check Email', desc: 'Instant access link', icon: Clock },
                  { step: '3', title: 'Watch Quick Start', desc: '15-min setup video', icon: Play },
                  { step: '4', title: 'Create & Post', desc: 'Your first AI video today', icon: Video },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold-premium/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-gold-premium font-black text-lg sm:text-xl">{item.step}</span>
                    </div>
                    <h5 className="text-white font-bold text-sm sm:text-base">{item.title}</h5>
                    <p className="text-gray-400 text-xs sm:text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          4. HOW IT WORKS - WHITE SECTION
          ================================================================ */}
      <section
        id="how-it-works"
        data-animate
        className="py-10 sm:py-20 bg-white"
      >
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className={`text-center mb-6 sm:mb-12 ${visibleSections.has('how-it-works') ? 'animate-fade-in-up' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-gold-premium/10 border border-gold-premium/30 px-3 py-1.5 rounded-full mb-3">
                <Zap className="w-3.5 h-3.5 text-gold-premium" />
                <span className="text-gold-premium font-bold text-xs uppercase tracking-wide">Simple Process</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-2 sm:mb-4">
                Create Videos in <span className="text-gold-premium">3 Easy Steps</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-lg">No filming. No editing. No experience needed.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
              {[
                { step: 1, icon: Upload, title: 'Upload Your Photo', time: '1 min', desc: 'Any headshot works - selfie, LinkedIn photo, or professional shot. The AI does the rest.' },
                { step: 2, icon: Video, title: 'Type Your Script', time: '2 min', desc: 'Write your message or pick from 50+ ready-made templates designed for real estate.' },
                { step: 3, icon: TrendingUp, title: 'Get Your Video', time: '4 min', desc: 'AI generates your video with perfect lip-sync. Download, post, watch leads come in.' },
              ].map((item, i) => (
                <div
                  key={item.step}
                  className={`relative bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-gray-200 hover:border-gold-premium/50 transition-all hover-3d hover:shadow-xl ${
                    visibleSections.has('how-it-works') ? 'animate-fade-in-up' : ''
                  }`}
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="absolute -top-3 sm:-top-5 left-4 sm:left-8 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-gold-premium to-gold-dark rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-black font-black text-sm sm:text-xl">{item.step}</span>
                  </div>
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-gold-premium/10 text-gold-dark px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold border border-gold-premium/30">
                    {item.time}
                  </div>
                  <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gold-premium/10 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-5 mt-3 sm:mt-4">
                    <item.icon className="w-5 h-5 sm:w-8 sm:h-8 text-gold-premium" />
                  </div>
                  <h3 className="text-base sm:text-xl font-black text-gray-900 mb-1.5 sm:mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className={`flex justify-center mt-6 sm:mt-12 ${visibleSections.has('how-it-works') ? 'animate-fade-in-up animation-delay-500' : ''}`}>
              <div className="flex items-center gap-3 sm:gap-6 bg-gold-premium/5 border border-gold-premium/30 rounded-full px-4 sm:px-8 py-2.5 sm:py-4">
                <Clock className="w-5 h-5 sm:w-8 sm:h-8 text-gold-premium" />
                <div>
                  <span className="text-gold-premium font-black text-xl sm:text-3xl">7 minutes</span>
                  <span className="text-gray-600 text-sm sm:text-lg ml-1.5 sm:ml-2">total time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          5. LUCAS CASE STUDY - LIGHT SECTION (Alternating)
          ================================================================ */}
      <section
        id="case-study-lucas"
        data-animate
        className="py-10 sm:py-24 bg-gradient-to-br from-stone-100 via-white to-amber-50/30 relative overflow-hidden"
      >
        {/* Subtle animated particles */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.2) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Section Header - Different from Jessica */}
            <div className={`mb-8 sm:mb-12 relative z-10 ${visibleSections.has('case-study-lucas') ? 'animate-fade-in-up' : ''}`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 bg-gold-premium/20 border border-gold-premium/40 px-3 py-1.5 rounded-full mb-3">
                    <div className="w-2 h-2 bg-gold-premium rounded-full animate-pulse" />
                    <span className="text-gold-dark font-bold text-xs uppercase tracking-wide">Luxury Listing Success</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                    One AI Video Sold a<br />
                    <span className="text-gold-dark">$1.85M Luxury Villa</span>
                  </h2>
                </div>
                {/* Big Commission Badge */}
                <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/10 border-2 border-green-600/50 rounded-2xl p-4 sm:p-6 text-center shadow-lg">
                  <p className="text-green-700 text-xs font-bold uppercase tracking-wider mb-1">Commission Earned</p>
                  <p className="text-green-600 text-3xl sm:text-5xl font-black">$46,250</p>
                  <p className="text-green-700/70 text-xs mt-1">From 1 video</p>
                </div>
              </div>
            </div>

            {/* Main Content - Side by Side Layout */}
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${visibleSections.has('case-study-lucas') ? 'animate-fade-in-up animation-delay-200' : ''}`}>

              {/* Left: Video + Profile */}
              <div className="space-y-4">
                {/* Video */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-gold-premium/40 shadow-2xl shadow-gold-premium/20">
                  <video
                    ref={videoRef}
                    src="/videos/Mr Lucas.mp4"
                    poster="/images/lucas-photo.webp"
                    className="w-full h-auto"
                    muted={isVideoMuted}
                    playsInline
                    preload="metadata"
                    onEnded={() => setIsVideoPlaying(false)}
                  />

                  {/* Play Overlay */}
                  {!isVideoPlaying && (
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center cursor-pointer group"
                      onClick={handlePlayVideo}
                    >
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gold-premium to-yellow-400 rounded-full flex items-center justify-center shadow-2xl shadow-gold-premium/50 group-hover:scale-110 transition-transform">
                        <Play className="w-10 h-10 sm:w-12 sm:h-12 text-black fill-black ml-1" />
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-3 rounded-xl border border-gold-premium/30">
                          <p className="text-gold-premium font-bold text-sm mb-1">Watch Lucas's AI Video</p>
                          <p className="text-gray-400 text-xs">The exact video that sold a $1.85M villa</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {isVideoPlaying && (
                    <button
                      onClick={toggleVideoMute}
                      className="absolute bottom-3 right-3 bg-black/80 p-2 rounded-full border border-gold-premium/30"
                    >
                      {isVideoMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                    </button>
                  )}
                </div>

                {/* Profile Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-lg">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold-premium">
                      <Image src="/images/lucas-photo.webp" alt="Lucas Martinez" width={64} height={64} className="object-cover w-full h-full" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-gold-premium text-black text-[8px] font-black px-1.5 py-0.5 rounded-full">
                      VERIFIED
                    </div>
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-black text-lg">Lucas Martinez</h3>
                    <p className="text-gold-dark text-sm font-medium">Luxury Property Specialist</p>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>Dubai, UAE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: The Story */}
              <div className="space-y-4 relative z-10">
                {/* Before Box */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-5 shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <X className="w-5 h-5 text-red-500" />
                    <span className="text-red-600 font-bold text-sm">THE STRUGGLE</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    "I was spending <span className="text-gray-900 font-bold">$500/video</span> on professional shoots.
                    After <span className="text-gray-900 font-bold">$3,000</span> and 6 months, I had zero luxury listings.
                    High-net-worth clients weren't finding me online."
                  </p>
                </div>

                {/* The Transformation */}
                <div className="bg-amber-50 border border-gold-premium/40 rounded-xl p-4 sm:p-5 shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-gold-dark" />
                    <span className="text-gold-dark font-bold text-sm">THE TRANSFORMATION</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { day: 'Day 1', text: 'Created first AI video showcasing a villa (7 min)' },
                      { day: 'Day 3', text: 'Video hit 45,000 views on Instagram' },
                      { day: 'Day 5', text: 'International buyer DMs: "I want to see this villa"' },
                      { day: 'Day 12', text: 'Virtual tour with buyer from London' },
                      { day: 'Day 28', text: '$1.85M sale closed at 2.5% commission' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-gold-dark font-bold text-xs bg-gold-premium/20 px-2 py-1 rounded whitespace-nowrap">{item.day}</span>
                        <p className="text-gray-700 text-sm">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Result Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-md">
                    <p className="text-gold-dark text-2xl sm:text-3xl font-black">$1.85M</p>
                    <p className="text-gray-500 text-xs">Villa Sold</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-md">
                    <p className="text-green-600 text-2xl sm:text-3xl font-black">28</p>
                    <p className="text-gray-500 text-xs">Days to Close</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-md">
                    <p className="text-gold-dark text-2xl sm:text-3xl font-black">1,250x</p>
                    <p className="text-gray-500 text-xs">ROI</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Quote */}
            <div className={`mt-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gold-premium/40 rounded-2xl p-5 sm:p-8 shadow-2xl relative z-10 ${visibleSections.has('case-study-lucas') ? 'animate-fade-in-up animation-delay-400' : ''}`}>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="text-gold-premium text-5xl font-serif leading-none">"</div>
                <div className="flex-1">
                  <p className="text-white text-lg sm:text-xl font-medium leading-relaxed mb-4">
                    <span className="text-gold-premium font-bold">$46,250 commission</span> from a 7-minute video.
                    My videographer wanted $2,000 to shoot that villa. I spent $37 on Sara's system and
                    the AI video outperformed everything I ever paid for. <span className="text-gold-premium">The luxury market is all about perception</span> —
                    and these AI videos make you look like a million-dollar agent.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold-premium">
                      <Image src="/images/lucas-photo.webp" alt="Lucas" width={48} height={48} className="object-cover" />
                    </div>
                    <div>
                      <p className="text-white font-bold">Lucas Martinez</p>
                      <p className="text-gray-400 text-sm">28 days after joining • $1.85M sale</p>
                    </div>
                    <div className="ml-auto hidden sm:flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-gold-premium text-gold-premium" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          6. TESTIMONIALS - DARK ANIMATED CAROUSEL
          ================================================================ */}
      <section
        id="testimonials"
        data-animate
        className="py-8 sm:py-16 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden"
      >
        {/* Animated gradient orbs */}
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-gold-premium/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-premium/3 rounded-full blur-3xl" />
        {/* Header */}
        <div className="max-w-6xl mx-auto px-3 sm:px-6 mb-6 sm:mb-10 relative z-10">
          <div className={`text-center ${visibleSections.has('testimonials') ? 'animate-fade-in-up' : ''}`}>
            <div className="inline-flex items-center gap-2 bg-gold-premium/10 border border-gold-premium/30 px-3 py-1.5 rounded-full mb-3">
              <Users className="w-3.5 h-3.5 text-gold-premium" />
              <span className="text-gold-premium font-bold text-xs uppercase tracking-wide">Success Stories</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-4">
              Real Agents. <span className="text-gold-premium">Real Results.</span>
            </h2>
            <div className="flex items-center justify-center gap-3 sm:gap-6 text-gray-400 text-xs sm:text-base">
              <span><span className="text-gold-premium font-bold">847+</span> success stories</span>
              <span>•</span>
              <span><span className="text-gold-premium font-bold">40+</span> countries</span>
            </div>
          </div>
        </div>

        {/* Infinite Scroll Carousel with fade shadows */}
        <div className="testimonial-carousel-wrapper">
          <div className="testimonial-scroll-track">
            {/* First set of testimonials */}
            {testimonials.map((t) => (
              <div key={`first-${t.id}`} className="testimonial-card">
                {/* Quote Icon */}
                <div className="testimonial-quote-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 8H6C4.89543 8 4 8.89543 4 10V14C4 15.1046 4.89543 16 6 16H8C9.10457 16 10 15.1046 10 14V8ZM10 8C10 5.79086 8.20914 4 6 4" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M20 8H16C14.8954 8 14 8.89543 14 10V14C14 15.1046 14.8954 16 16 16H18C19.1046 16 20 15.1046 20 14V8ZM20 8C20 5.79086 18.2091 4 16 4" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>

                {/* Headline - Results */}
                <h3 className="text-white text-lg sm:text-xl font-bold mb-2 leading-tight">
                  {t.results}
                </h3>

                {/* Review Text */}
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">
                  "{t.review}"
                </p>

                {/* Author - Larger image */}
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-gold-premium/40 shadow-lg">
                    <Image src={t.image} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm sm:text-base">{t.name}</p>
                    <p className="text-gray-500 text-xs sm:text-sm">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Duplicated set for seamless infinite loop */}
            {testimonials.map((t) => (
              <div key={`second-${t.id}`} className="testimonial-card">
                {/* Quote Icon */}
                <div className="testimonial-quote-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 8H6C4.89543 8 4 8.89543 4 10V14C4 15.1046 4.89543 16 6 16H8C9.10457 16 10 15.1046 10 14V8ZM10 8C10 5.79086 8.20914 4 6 4" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M20 8H16C14.8954 8 14 8.89543 14 10V14C14 15.1046 14.8954 16 16 16H18C19.1046 16 20 15.1046 20 14V8ZM20 8C20 5.79086 18.2091 4 16 4" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>

                {/* Headline - Results */}
                <h3 className="text-white text-lg sm:text-xl font-bold mb-2 leading-tight">
                  {t.results}
                </h3>

                {/* Review Text */}
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">
                  "{t.review}"
                </p>

                {/* Author - Larger image */}
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-gold-premium/40 shadow-lg">
                    <Image src={t.image} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm sm:text-base">{t.name}</p>
                    <p className="text-gray-500 text-xs sm:text-sm">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          6. GUARANTEE #1 - WHITE SECTION
          ================================================================ */}
      <section
        id="guarantee1"
        data-animate
        className="py-10 sm:py-20 bg-white"
      >
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className={`bg-gradient-to-br from-gold-premium/10 to-white border-2 border-gold-premium/40 rounded-xl sm:rounded-2xl p-5 sm:p-10 ${
              visibleSections.has('guarantee1') ? 'animate-fade-in-up' : ''
            }`}>
              <div className="text-center mb-5 sm:mb-8">
                <div className="inline-flex items-center gap-2 bg-gold-premium/20 border border-gold-premium/40 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gold-premium" />
                  <span className="text-gold-dark font-bold text-xs sm:text-sm uppercase">Iron-Clad Guarantee</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-2">
                  30-Day Money Back + <span className="text-gold-premium">$50 Cash</span>
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">You literally cannot lose.</p>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-8">
                {/* Guarantee Badge - Instantly Recognizable */}
                <div className="relative flex-shrink-0">
                  {/* Modern Guarantee Seal */}
                  <div className="w-28 h-28 sm:w-40 sm:h-40 relative">
                    {/* Outer rotating ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-dashed border-gold-premium/40 animate-spin-slow" />
                    {/* Main badge */}
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gold-premium via-gold-light to-gold-premium shadow-2xl shadow-gold-premium/30 flex flex-col items-center justify-center">
                      {/* Inner circle with text */}
                      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center text-center p-2">
                        <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-gold-premium mb-1" />
                        <span className="text-gold-premium font-black text-lg sm:text-2xl leading-none">30</span>
                        <span className="text-white font-bold text-[8px] sm:text-xs uppercase tracking-wider">Day Money</span>
                        <span className="text-white font-bold text-[8px] sm:text-xs uppercase tracking-wider">Back</span>
                        <span className="text-gold-premium font-black text-[10px] sm:text-sm mt-0.5">+$50</span>
                      </div>
                    </div>
                    {/* Ribbon accent */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-[8px] sm:text-xs px-3 py-0.5 rounded-full shadow-lg">
                      GUARANTEED
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 text-sm sm:text-lg leading-relaxed mb-3 sm:mb-4 italic">
                    "If you can't create professional videos in 7 minutes or less, or if this system doesn't work for you for ANY reason —
                    I'll refund every penny AND send you $50 for wasting your time. No questions asked. No hoops to jump through."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-gold-premium flex-shrink-0">
                      <Image src="/images/Sara 61kb.webp" alt="Sara" width={48} height={48} className="object-cover w-full h-full" />
                    </div>
                    <p className="text-gold-dark font-bold text-sm sm:text-lg">— Sara Cohen</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 sm:mt-8">
                {[
                  { icon: CheckCircle, title: 'Full Refund', desc: 'Every penny back' },
                  { icon: DollarSign, title: '+$50 Cash', desc: 'For your time' },
                  { icon: Clock, title: '30 Days', desc: 'To try everything' },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 sm:p-4 text-center border border-gold-premium/20 shadow-lg">
                    <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-gold-premium mx-auto mb-1.5 sm:mb-2" />
                    <p className="text-gray-900 font-bold text-xs sm:text-base">{item.title}</p>
                    <p className="text-gray-500 text-[10px] sm:text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          8. PRICING - DARK SECTION (Reveal price!)
          ================================================================ */}
      <section
        id="pricing"
        data-animate
        className="py-10 sm:py-20 bg-gradient-to-br from-black via-gray-900 to-black scroll-mt-16 relative overflow-hidden"
      >
        {/* Animated gold glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-premium/5 rounded-full blur-3xl animate-pulse" />
        <div className="w-full px-3 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className={`text-center mb-6 sm:mb-10 ${visibleSections.has('pricing') ? 'animate-fade-in-up' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-full mb-3 sm:mb-4">
                <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
                <span className="text-red-400 font-bold text-xs sm:text-sm">Bonus expires December 15th</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-4">
                Get Everything Today For
              </h2>
            </div>

            {/* Price Comparison - horizontal scroll on mobile */}
            <div className={`overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 sm:overflow-visible mb-6 sm:mb-10 ${visibleSections.has('pricing') ? 'animate-fade-in-up animation-delay-200' : ''}`}>
              <div className="flex gap-3 sm:grid sm:grid-cols-3 sm:gap-4" style={{ minWidth: 'max-content' }}>
                {/* Old Way */}
                <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-red-500/30 relative flex-shrink-0 w-[200px] sm:w-auto">
                  <div className="absolute -top-2 sm:-top-3 right-3 sm:right-4 bg-red-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold">
                    Expensive
                  </div>
                  <div className="flex items-center gap-2 mb-3 sm:mb-4 mt-1">
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                    <h3 className="font-bold text-white text-sm sm:text-base">Hire Videographer</h3>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-red-400 mb-1 sm:mb-2">$500<span className="text-sm sm:text-lg text-gray-500">/video</span></div>
                  <p className="text-gray-500 text-xs sm:text-sm">50 videos = $25,000</p>
                </div>

                {/* DIY */}
                <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-gray-600 relative flex-shrink-0 w-[200px] sm:w-auto">
                  <div className="absolute -top-2 sm:-top-3 right-3 sm:right-4 bg-gray-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold">
                    Time Sink
                  </div>
                  <div className="flex items-center gap-2 mb-3 sm:mb-4 mt-1">
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                    <h3 className="font-bold text-white text-sm sm:text-base">Learn Video Editing</h3>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-gray-400 mb-1 sm:mb-2">$3,000+</div>
                  <p className="text-gray-500 text-xs sm:text-sm">+ 100 hours learning</p>
                </div>

                {/* Smart Way */}
                <div className="bg-gradient-to-br from-gold-premium to-gold-dark rounded-xl p-4 sm:p-6 border-2 border-white/20 relative shadow-xl sm:scale-105 flex-shrink-0 w-[200px] sm:w-auto">
                  <div className="absolute -top-2 sm:-top-3 right-3 sm:right-4 bg-black text-gold-premium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-black">
                    Best Value
                  </div>
                  <div className="flex items-center gap-2 mb-3 sm:mb-4 mt-1">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                    <h3 className="font-bold text-black text-sm sm:text-base">AgentClone AI</h3>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-black mb-1 sm:mb-2">$37<span className="text-sm sm:text-lg text-black/70"> one-time</span></div>
                  <p className="text-black/70 text-xs sm:text-sm">Unlimited videos forever</p>
                </div>
              </div>
            </div>

            {/* Main Price Box - Compact on mobile with full guarantee */}
            <div className={`bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-5 sm:p-10 text-center border-2 border-gold-premium/50 shadow-2xl ${
              visibleSections.has('pricing') ? 'animate-fade-in-up animation-delay-400' : ''
            }`}>
              {/* Price */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <span className="text-5xl sm:text-7xl font-black text-gold-premium">$37</span>
                <div className="text-left">
                  <span className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-black block">SAVE $1,659</span>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">One-time payment</p>
                </div>
              </div>
              <p className="text-gold-premium font-bold text-sm sm:text-base mb-4 sm:mb-6">Lifetime access • No monthly fees • No hidden costs</p>

              {/* CTA Button */}
              <a
                href="https://whop.com/checkout/plan_7x5Kz1cflmrYH"
                onClick={() => trackInitiateCheckout('7min-agentclone', 37)}
                className="group relative w-full max-w-md mx-auto bg-gradient-to-r from-gold-premium via-yellow-400 to-gold-premium text-black py-4 sm:py-6 rounded-xl font-black text-lg sm:text-2xl shadow-2xl shadow-gold-premium/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer overflow-hidden mb-4 sm:mb-6 shine-effect animate-glow-pulse"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative flex items-center gap-2">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                  Yes! Give Me Instant Access
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </span>
              </a>

              {/* Guarantee Box - Prominent */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/40 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-sm sm:text-base">30-Day Money Back + $50 Cash</p>
                    <p className="text-gray-400 text-xs sm:text-sm">Don't love it? Get a full refund + $50</p>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-gray-400 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>100% Secure</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Instant Access</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-gold-premium" />
                  <span>847+ Agents</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          8. FAQ - WHITE SECTION
          ================================================================ */}
      <section
        id="faq"
        data-animate
        className="py-10 sm:py-20 bg-white"
      >
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className={`text-center mb-6 sm:mb-10 ${visibleSections.has('faq') ? 'animate-fade-in-up' : ''}`}>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-2 sm:mb-4">
                Common <span className="text-gold-premium">Questions</span>
              </h2>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden ${
                    visibleSections.has('faq') ? 'animate-fade-in-up' : ''
                  }`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-3.5 sm:p-5 text-left"
                  >
                    <span className="font-semibold pr-3 text-gray-900 text-sm sm:text-base">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-gold-premium flex-shrink-0 transition-transform ${expandedFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFaq === i && (
                    <div className="px-3.5 pb-3.5 sm:px-5 sm:pb-5">
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          10. GUARANTEE #2 - DARK SECTION
          ================================================================ */}
      <section
        id="guarantee2"
        data-animate
        className="py-10 sm:py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden"
      >
        {/* Subtle animated gradient */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-green-500/5 rounded-full blur-3xl" />
        <div className="w-full px-3 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className={`bg-gradient-to-br from-white/10 to-white/5 border-2 border-gold-premium/40 rounded-xl sm:rounded-2xl p-5 sm:p-10 ${
              visibleSections.has('guarantee2') ? 'animate-fade-in-up' : ''
            }`}>
              <div className="text-center mb-5 sm:mb-8">
                {/* Modern Guarantee Badge - Instantly Recognizable */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6 relative">
                  {/* Outer rotating ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-dashed border-gold-premium/40 animate-spin-slow" />
                  {/* Main badge */}
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gold-premium via-gold-light to-gold-premium shadow-2xl shadow-gold-premium/40 flex flex-col items-center justify-center">
                    {/* Inner circle with text */}
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center text-center p-1">
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-gold-premium mb-0.5" />
                      <span className="text-gold-premium font-black text-base sm:text-xl leading-none">30</span>
                      <span className="text-white font-bold text-[7px] sm:text-[9px] uppercase tracking-wider">Day Money</span>
                      <span className="text-white font-bold text-[7px] sm:text-[9px] uppercase tracking-wider">Back</span>
                    </div>
                  </div>
                  {/* Ribbon accent */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-[7px] sm:text-[9px] px-2.5 py-0.5 rounded-full shadow-lg whitespace-nowrap">
                    100% RISK FREE
                  </div>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white mb-2 sm:mb-4">
                  Try It Risk-Free for 30 Days
                </h2>
                <p className="text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto">
                  I'm so confident this will work for you that I'm taking ALL the risk.
                  If you're not 100% satisfied, you get every penny back — PLUS $50 for trying.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 mb-5 sm:mb-8">
                {[
                  {
                    icon: ThumbsUp,
                    title: 'Love It?',
                    desc: 'Keep everything and start generating leads with AI videos.',
                  },
                  {
                    icon: Heart,
                    title: 'Not Sure?',
                    desc: 'Take the full 30 days to test everything. No rush.',
                  },
                  {
                    icon: DollarSign,
                    title: 'Don\'t Like It?',
                    desc: 'Get a full refund + $50 cash. Keep the bonuses.',
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-black/50 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center border border-gold-premium/20">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto rounded-full flex items-center justify-center mb-2 sm:mb-4 bg-gold-premium/20">
                      <item.icon className="w-5 h-5 sm:w-7 sm:h-7 text-gold-premium" />
                    </div>
                    <h3 className="font-black text-white text-base sm:text-lg mb-1 sm:mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <p className="text-gold-premium font-bold text-sm sm:text-lg">
                  You literally have NOTHING to lose and everything to gain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          10. MEET SARA - WHITE SECTION (Moved to bottom)
          ================================================================ */}
      <section
        id="meet-sara"
        data-animate
        className="py-10 sm:py-20 bg-white"
      >
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className={`text-center mb-6 sm:mb-10 ${visibleSections.has('meet-sara') ? 'animate-fade-in-up' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-gold-premium/10 border border-gold-premium/30 px-3 py-1.5 rounded-full mb-3">
                <Award className="w-3.5 h-3.5 text-gold-premium" />
                <span className="text-gold-premium font-bold text-xs uppercase tracking-wide">Meet Your Instructor</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-2 sm:mb-4">
                Who Am I & <span className="text-gold-premium">Why Should You Listen?</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 items-center">
              {/* Sara Image */}
              <div className={`relative ${visibleSections.has('meet-sara') ? 'animate-fade-in-up animation-delay-200' : ''}`}>
                <div className="relative aspect-[3/4] max-w-[200px] sm:max-w-sm mx-auto rounded-xl sm:rounded-2xl overflow-hidden border-3 sm:border-4 border-gold-premium/50 shadow-2xl">
                  <Image
                    src="/images/Sara 61kb.webp"
                    alt="Sara Cohen"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-gold-premium text-black px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-bold text-xs sm:text-sm">
                    ✦ Verified
                  </div>
                </div>
              </div>

              {/* Sara Story */}
              <div className={`space-y-4 sm:space-y-6 ${visibleSections.has('meet-sara') ? 'animate-fade-in-up animation-delay-300' : ''}`}>
                <div>
                  <h3 className="text-gold-premium font-black text-lg sm:text-xl mb-2 sm:mb-3">I Was You</h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    8 years grinding as a luxury agent in Dubai. $127M+ in sales. But I was exhausted.
                    Filming content felt like a second job. I looked for a better way.
                  </p>
                </div>

                <div>
                  <h3 className="text-gold-premium font-black text-lg sm:text-xl mb-2 sm:mb-3">Then I Found AI Video</h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    One photo. 50 videos. In minutes. My social media exploded. More leads. More listings.
                    More commissions. All while working LESS.
                  </p>
                </div>

                <div>
                  <h3 className="text-gold-premium font-black text-lg sm:text-xl mb-2 sm:mb-3">Now I'm Sharing Everything</h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    847+ agents have joined. The results speak for themselves. This isn't theory —
                    it's the exact system I use daily.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-2 sm:gap-3 pt-4 sm:pt-6">
                  {[
                    { value: '$127M+', label: 'Career Sales' },
                    { value: '8 Years', label: 'Experience' },
                    { value: '847+', label: 'Agents Helped' },
                    { value: '4.9/5', label: 'Avg Rating' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-4 text-center border border-gray-200">
                      <div className="text-gold-premium font-black text-sm sm:text-xl">{stat.value}</div>
                      <div className="text-gray-500 text-[10px] sm:text-xs">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          11. FINAL CTA - GOLD SECTION (Hormozi-Style Last Chance)
          ================================================================ */}
      <section
        id="final-cta"
        data-animate
        className="py-10 sm:py-24 bg-gradient-to-br from-gold-premium via-gold-light to-gold-premium"
      >
        <div className="w-full px-3 sm:px-6">
          <div className={`max-w-xl mx-auto text-center ${visibleSections.has('final-cta') ? 'animate-fade-in-up' : ''}`}>
            {/* Hormozi-Style Last Chance Copy */}
            <h2 className="text-2xl sm:text-4xl font-black text-black mb-3 sm:mb-4">
              You Have Two Options...
            </h2>

            {/* Option 1 vs Option 2 */}
            <div className="grid grid-cols-2 gap-3 mb-4 sm:mb-6">
              <div className="bg-black/10 rounded-xl p-3 sm:p-4 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <X className="w-5 h-5 text-red-600" />
                  <span className="font-bold text-black text-sm sm:text-base">Option 1</span>
                </div>
                <p className="text-black/70 text-xs sm:text-sm">
                  Leave this page. Keep struggling with content. Watch competitors pass you.
                </p>
              </div>
              <div className="bg-black/10 rounded-xl p-3 sm:p-4 text-left border-2 border-black">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-black text-sm sm:text-base">Option 2</span>
                </div>
                <p className="text-black/70 text-xs sm:text-sm">
                  Get instant access. Create your first video today. Start getting leads this week.
                </p>
              </div>
            </div>

            <div className="bg-black rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-2xl mb-3 sm:mb-6">
              {/* Price with Savings */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <span className="text-3xl sm:text-5xl font-black text-gold-premium">$37</span>
                <div className="text-left">
                  <span className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-black block">SAVE $1,659</span>
                  <p className="text-gray-500 text-xs mt-0.5">One-time</p>
                </div>
              </div>

              {/* CTA Button */}
              <a
                href="https://whop.com/checkout/plan_7x5Kz1cflmrYH"
                onClick={() => trackInitiateCheckout('7min-agentclone', 37)}
                className="group relative w-full bg-gradient-to-r from-gold-premium via-yellow-400 to-gold-premium text-black py-4 sm:py-5 rounded-xl font-black text-lg sm:text-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer overflow-hidden shine-effect"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative flex items-center gap-2">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                  Yes! Give Me Instant Access
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </span>
              </a>

              {/* Guarantee */}
              <div className="flex items-center justify-center gap-2 mt-4 text-gray-400 text-xs sm:text-sm">
                <Shield className="w-4 h-4 text-green-500" />
                <span>30-Day Money Back + $50 Cash Guarantee</span>
              </div>
            </div>

            {/* Final Reassurance */}
            <p className="text-black/60 text-xs sm:text-sm">
              Join 847+ agents • Instant access • No risk
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          STICKY MOBILE CTA - Shows after scrolling past hero
          ================================================================ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-black/95 backdrop-blur-lg border-t border-gold-premium/30 p-3 transform translate-y-0 transition-transform duration-300"
           style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        <a
          href="https://whop.com/checkout/plan_7x5Kz1cflmrYH"
          onClick={() => trackInitiateCheckout('7min-agentclone', 37)}
          className="w-full bg-gradient-to-r from-gold-premium via-yellow-400 to-gold-premium text-black py-3.5 rounded-xl font-black text-base flex items-center justify-center gap-2 shadow-lg"
        >
          <span className="flex items-center gap-2">
            Get Access — $37
            <ArrowRight className="w-4 h-4" />
          </span>
        </a>
        <div className="flex items-center justify-center gap-3 mt-2 text-gray-400 text-[10px]">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-green-500" />
            30-Day Guarantee
          </span>
          <span>•</span>
          <span>Instant Access</span>
        </div>
      </div>

      {/* ================================================================
          FOOTER - BLACK (Extra padding on mobile for sticky CTA)
          ================================================================ */}
      <footer className="py-6 sm:py-10 pb-24 sm:pb-10 bg-black border-t border-gray-900">
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-8 mb-3 sm:mb-6 text-gray-500 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-gold-premium" />
                <span>847+ Agents</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-gold-premium" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-gold-premium" />
                <span>Instant Access</span>
              </div>
            </div>
            <p className="text-gray-700 text-xs sm:text-sm mb-3">
              © {new Date().getFullYear()} AI FastScale. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-gray-700 text-xs sm:text-sm">
              <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
              <span className="hidden sm:inline">•</span>
              <a href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</a>
              <span className="hidden sm:inline">•</span>
              <a href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</a>
              <span className="hidden sm:inline">•</span>
              <a href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</a>
            </div>
            <p className="text-gray-500 text-xs mt-3">
              Contact: support@aifastscale.com
            </p>
          </div>
        </div>
      </footer>


      {/* Animation Styles - Modern, smooth, GPU-accelerated */}
      <style jsx global>{`
        /* Modern cubic-bezier for buttery smooth feel */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          will-change: opacity, transform;
        }

        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }

        /* Scale up animation */
        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-up {
          animation: scaleUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* Modal scale in animation */
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-scale-in {
          animation: scaleIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* Fade in from left */
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-25px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* Fade in from right */
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(25px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* Stagger animation for lists */
        .stagger-children > *:nth-child(1) { animation-delay: 0ms; }
        .stagger-children > *:nth-child(2) { animation-delay: 80ms; }
        .stagger-children > *:nth-child(3) { animation-delay: 160ms; }
        .stagger-children > *:nth-child(4) { animation-delay: 240ms; }
        .stagger-children > *:nth-child(5) { animation-delay: 320ms; }
        .stagger-children > *:nth-child(6) { animation-delay: 400ms; }

        /* Respect user motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up,
          .animate-scale-up,
          .animate-scale-in,
          .animate-fade-in-left,
          .animate-fade-in-right {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </main>
  )
}
