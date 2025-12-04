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
  ThumbsUp,
  RefreshCw,
  MessageSquare,
  Calendar,
  FileText,
} from 'lucide-react'
import { WHOP_CONFIG } from './config/whop'
import { BONUS_PRODUCTS, getTotalBonusValue } from './config/bonus-products'

export default function CleanLandingPage() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(true)
  const [spotsLeft, setSpotsLeft] = useState(7)
  const [viewersNow, setViewersNow] = useState(23)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Animation refs for scroll detection
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())

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
      a: 'Immediately after purchase. Check your email for login details. You can create your first video in the next 10 minutes.',
    },
  ]

  const testimonials = [
    {
      id: 1,
      name: 'Sofia Martinez',
      role: 'Luxury Real Estate Agent',
      location: 'Miami, FL',
      image: '/images/Reviews/Review REA 1.jpeg',
      review: "I was skeptical about AI videos, but this changed everything. Created my first video in 7 minutes - got 4 qualified leads that same week.",
      results: '4 leads in first week',
    },
    {
      id: 2,
      name: 'Marcus Williams',
      role: 'Commercial Broker',
      location: 'Atlanta, GA',
      image: '/images/Reviews/Review REA 2.jpeg',
      review: "After 15 years in real estate, I thought I'd seen it all. Closed $2.3M in listings last month - all from AI video leads.",
      results: '$2.3M in closings',
    },
    {
      id: 3,
      name: 'Yasmin Al-Rashid',
      role: 'Property Consultant',
      location: 'Dubai, UAE',
      image: '/images/Reviews/Review REA 3.jpeg',
      review: "As a Dubai agent, I need to look premium. These AI videos make my listings look like million-dollar productions. Went from 2-3 leads to 15+ per week.",
      results: '15+ leads/week',
    },
    {
      id: 4,
      name: 'Dr. Raj Patel',
      role: 'Investment Specialist',
      location: 'London, UK',
      image: '/images/Reviews/Review REA 5.jpeg',
      review: "Was spending £800/month on video production. Now I create better content myself in minutes. ROI was immediate.",
      results: '50x ROI',
    },
    {
      id: 5,
      name: 'Jennifer Kim',
      role: 'Urban Properties',
      location: 'Vancouver, Canada',
      image: '/images/Reviews/Review REA 9.jpeg',
      review: "My listing video got 47K views. Sold the property in 5 days for $80K over asking. This system pays for itself daily.",
      results: 'Sold $80K over asking',
    },
    {
      id: 6,
      name: 'Carlos Mendoza',
      role: 'Family Homes Expert',
      location: 'Los Angeles, CA',
      image: '/images/Reviews/Review REA 11.jpeg',
      review: "25 years selling homes and I wish I had this sooner. 6 closings last month from social media alone.",
      results: '6 closings from social',
    },
  ]

  // Scroll animation observer - optimized for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add visible class for CSS animations
            entry.target.classList.add('visible')
            setVisibleSections((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    )

    // Observe all elements with scroll-animate classes
    const animatedElements = document.querySelectorAll('[data-animate], .scroll-animate, .scroll-animate-scale')
    animatedElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  // Countdown timer
  useEffect(() => {
    const calculateTimeToMidnight = () => {
      const now = new Date()
      const midnight = new Date(now)
      midnight.setHours(24, 0, 0, 0)
      const diff = midnight.getTime() - now.getTime()
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      }
    }
    setTimeLeft(calculateTimeToMidnight())
    const timer = setInterval(() => setTimeLeft(calculateTimeToMidnight()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Scarcity
  useEffect(() => {
    const interval = setInterval(() => {
      setSpotsLeft(prev => prev > 3 ? prev - 1 : 7)
    }, 45000)
    return () => clearInterval(interval)
  }, [])

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

  const handleCheckout = () => {
    window.open(WHOP_CONFIG.plans.mainCourse.checkoutUrl, '_blank')
  }

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
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
        className="relative bg-black text-white py-12 sm:py-20 md:py-24 overflow-hidden"
      >
        {/* Subtle gold grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.4) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="w-full px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Headline */}
            <h1 className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] ${visibleSections.has('hero') ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <span className="text-white">Turn Any Photo Into a</span>
              <br />
              <span className="bg-gradient-to-r from-gold-premium via-gold-light to-gold-premium bg-clip-text text-transparent">
                Talking AI Video
              </span>
              <br />
              <span className="text-white">&</span>
              <span className="bg-gradient-to-r from-gold-premium via-gold-light to-gold-premium bg-clip-text text-transparent">
                {' '}Generate 100+ Leads Monthly
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`text-lg sm:text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto ${visibleSections.has('hero') ? 'animate-fade-in-up animation-delay-200' : 'opacity-0'}`}>
              Even if you've never edited a video in your life —
              <br className="hidden sm:block" />
              <span className="text-white/80">all you need is your phone</span>
            </p>

            {/* Hero Image - Clean, no badge */}
            <div className={`relative max-w-5xl mx-auto mb-6 ${visibleSections.has('hero') ? 'animate-fade-in-up animation-delay-300' : 'opacity-0'}`}>
              <div className="relative rounded-2xl overflow-hidden border-2 border-gold-premium/40 shadow-2xl shadow-gold-premium/20">
                <Image
                  src="/images/hero-showcase.webp"
                  alt="AI Video System Showcase"
                  width={1365}
                  height={768}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>

            {/* Trust badges - UNDER the image */}
            <div className={`flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-gray-400 mb-8 ${visibleSections.has('hero') ? 'animate-fade-in-up animation-delay-400' : 'opacity-0'}`}>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gold-premium" />
                <span><span className="text-white font-bold">847+</span> agents</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-premium text-gold-premium" />
                ))}
                <span className="ml-1 text-white font-bold">4.9/5</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-gold-premium" />
                <span>30-Day Guarantee</span>
              </div>
            </div>

            {/* CTA - Scrolls to What's Inside */}
            <button
              onClick={() => scrollToSection('whats-inside')}
              className={`group relative bg-gradient-to-r from-gold-premium via-gold-light to-gold-premium text-black px-10 py-5 rounded-xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-gold-premium/30 overflow-hidden ${visibleSections.has('hero') ? 'animate-fade-in-up animation-delay-500' : 'opacity-0'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative flex items-center gap-3">
                See What's Inside
                <ArrowDown className="w-6 h-6" />
              </span>
            </button>

            <p className={`text-gray-600 text-sm mt-4 ${visibleSections.has('hero') ? 'animate-fade-in-up animation-delay-500' : 'opacity-0'}`}>
              ↓ Scroll to see everything you get ↓
            </p>

            {/* What is AgentClone? - Collapsible */}
            <div className={`max-w-xl mx-auto mt-8 ${visibleSections.has('hero') ? 'animate-fade-in-up animation-delay-500' : 'opacity-0'}`}>
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
          2. HOW IT WORKS - WHITE SECTION
          ================================================================ */}
      <section
        id="how-it-works"
        data-animate
        className="py-16 sm:py-20 bg-white"
      >
        <div className="w-full px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className={`text-center mb-12 ${visibleSections.has('how-it-works') ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="inline-flex items-center gap-2 bg-gold-premium/10 border border-gold-premium/30 px-4 py-2 rounded-full mb-4">
                <Zap className="w-4 h-4 text-gold-premium" />
                <span className="text-gold-premium font-bold text-sm uppercase tracking-wide">Simple Process</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Create Videos in <span className="text-gold-premium">3 Easy Steps</span>
              </h2>
              <p className="text-gray-600 text-lg">No filming. No editing. No experience needed.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: 1, icon: Upload, title: 'Upload Your Photo', time: '1 min', desc: 'Any headshot works - selfie, LinkedIn photo, or professional shot. The AI does the rest.' },
                { step: 2, icon: Video, title: 'Type Your Script', time: '2 min', desc: 'Write your message or pick from 50+ ready-made templates designed for real estate.' },
                { step: 3, icon: TrendingUp, title: 'Get Your Video', time: '4 min', desc: 'AI generates your video with perfect lip-sync. Download, post, watch leads come in.' },
              ].map((item, i) => (
                <div
                  key={item.step}
                  className={`relative bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-gold-premium/50 transition-all hover:shadow-xl ${
                    visibleSections.has('how-it-works') ? 'animate-fade-in-up' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="absolute -top-5 left-8 w-12 h-12 bg-gradient-to-br from-gold-premium to-gold-dark rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-black font-black text-xl">{item.step}</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-gold-premium/10 text-gold-dark px-3 py-1 rounded-full text-sm font-bold border border-gold-premium/30">
                    {item.time}
                  </div>
                  <div className="w-16 h-16 bg-gold-premium/10 rounded-xl flex items-center justify-center mb-5 mt-4">
                    <item.icon className="w-8 h-8 text-gold-premium" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className={`flex justify-center mt-12 ${visibleSections.has('how-it-works') ? 'animate-fade-in-up animation-delay-500' : 'opacity-0'}`}>
              <div className="flex items-center gap-6 bg-gold-premium/5 border border-gold-premium/30 rounded-full px-8 py-4">
                <Clock className="w-8 h-8 text-gold-premium" />
                <div>
                  <span className="text-gold-premium font-black text-3xl">7 minutes</span>
                  <span className="text-gray-600 text-lg ml-2">total time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          3. JESSICA CASE STUDY - BLACK SECTION (Matches Ad Creative)
          "She closed 17 buyer leads in 3 weeks"
          ================================================================ */}
      <section
        id="case-study"
        data-animate
        className="py-16 sm:py-24 bg-black"
      >
        <div className="w-full px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className={`text-center mb-10 ${visibleSections.has('case-study') ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="inline-flex items-center gap-2 bg-gold-premium/10 border border-gold-premium/30 px-4 py-2 rounded-full mb-4">
                <Play className="w-4 h-4 text-gold-premium" />
                <span className="text-gold-premium font-bold text-sm uppercase tracking-wide">Featured Case Study</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
                She Closed <span className="text-gold-premium">17 Buyer Leads</span> in 3 Weeks
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">...without recording a single video</p>
            </div>

            {/* Jessica Case Study Card */}
            <div className={`bg-gradient-to-br from-white/5 to-white/[0.02] border border-gold-premium/30 rounded-2xl overflow-hidden mb-16 ${visibleSections.has('case-study') ? 'animate-fade-in-up animation-delay-200' : 'opacity-0'}`}>

              {/* Top: Profile + Before Situation */}
              <div className="p-6 sm:p-8 border-b border-white/10">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {/* Profile */}
                  <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:text-center">
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 border-gold-premium">
                        <Image src="/images/jessica-photo.jpeg" alt="Jessica Rivera" width={96} height={96} className="object-cover w-full h-full" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-gold-premium text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                        VERIFIED
                      </div>
                    </div>
                    <div className="sm:mt-2">
                      <h3 className="text-white font-black text-lg">Jessica Rivera</h3>
                      <p className="text-gray-400 text-sm">Buyer's Agent</p>
                      <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>Miami, Florida</span>
                      </div>
                    </div>
                  </div>

                  {/* Before Story */}
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-full mb-3">
                      <span className="text-red-400 text-xs font-bold">THE PROBLEM</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      "I was spending <span className="text-white font-bold">3 hours every day</span> trying to create content.
                      Between filming, editing, and coming up with ideas - I had <span className="text-white font-bold">zero time left for actual clients</span>.
                      My social media looked dead. <span className="text-red-400 font-bold">I was invisible online</span>.
                      Then I discovered this system..."
                    </p>
                  </div>
                </div>
              </div>

              {/* Big Hero Image of Jessica */}
              <div className="p-4 sm:p-8 bg-black/50">
                {/* Image without overlay on mobile for clarity */}
                <div className="rounded-xl overflow-hidden border-2 border-gold-premium/40 shadow-2xl">
                  <Image
                    src="/images/jessica-photo.jpeg"
                    alt="Jessica Rivera - 17 Buyer Leads in 3 Weeks"
                    width={1365}
                    height={768}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
                {/* Caption below image for clarity */}
                <div className="mt-4 text-center">
                  <p className="text-gold-premium font-black text-xl sm:text-3xl mb-1">17 Buyer Leads in 3 Weeks</p>
                  <p className="text-gray-400 text-sm">Without recording a single video</p>
                </div>
              </div>

              {/* The Transformation */}
              <div className="p-4 sm:p-8 bg-black/30">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 bg-gold-premium/10 border border-gold-premium/30 px-3 py-1.5 rounded-full">
                    <span className="text-gold-premium text-xs font-bold">THE 7-MINUTE TRANSFORMATION</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {[
                    { number: '17', label: 'Buyer Leads', sub: 'in 3 weeks' },
                    { number: '7', label: 'Minutes', sub: 'per video' },
                    { number: '0', label: 'Hours Filming', sub: 'on camera' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-gold-premium/10 border border-gold-premium/30 rounded-xl p-3 sm:p-4 text-center">
                      <div className="text-gold-premium text-3xl sm:text-5xl font-black mb-0.5">{stat.number}</div>
                      <div className="text-white font-bold text-xs sm:text-sm">{stat.label}</div>
                      <div className="text-gray-500 text-[10px] sm:text-xs">{stat.sub}</div>
                    </div>
                  ))}
                </div>

                <p className="text-gray-500 text-xs sm:text-sm mt-4 text-center">
                  Posted <span className="text-gold-premium font-bold">21 AI videos</span> in 3 weeks • Zero filming • Zero editing stress
                </p>
              </div>

              {/* Timeline / Results */}
              <div className="p-4 sm:p-8 border-t border-white/10">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="inline-flex items-center gap-2 bg-gold-premium/10 border border-gold-premium/30 px-3 py-1.5 rounded-full">
                    <span className="text-gold-premium text-xs font-bold">WHAT HAPPENED NEXT</span>
                  </div>
                </div>

                {/* Timeline - improved mobile layout */}
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { time: 'Day 1', event: 'Created her first AI video (took 7 minutes)', icon: Upload, color: 'gray' },
                    { time: 'Day 3', event: '12,000 views on first 3 videos combined', icon: Eye, color: 'gray' },
                    { time: 'Week 1', event: '4 buyer inquiries in her DMs', icon: MessageSquare, color: 'gold' },
                    { time: 'Week 2', event: '8 more leads • 2 showing appointments booked', icon: Calendar, color: 'gold' },
                    { time: 'Week 3', event: '17 total buyer leads • 3 under contract', icon: FileText, color: 'gold' },
                    { time: 'Month 2', event: '2 closings • $18,400 commission earned', icon: DollarSign, color: 'green' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.color === 'green' ? 'bg-green-500/20 border border-green-500/40' :
                        item.color === 'gold' ? 'bg-gold-premium/20 border border-gold-premium/40' :
                        'bg-white/5 border border-white/20'
                      }`}>
                        <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          item.color === 'green' ? 'text-green-400' :
                          item.color === 'gold' ? 'text-gold-premium' :
                          'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`inline-block text-[10px] sm:text-xs font-black px-2 py-0.5 rounded mb-1 ${
                          item.color === 'green' ? 'bg-green-500/20 text-green-400' :
                          item.color === 'gold' ? 'bg-gold-premium/20 text-gold-premium' :
                          'bg-white/10 text-gray-400'
                        }`}>{item.time}</span>
                        <p className={`text-xs sm:text-sm leading-snug ${item.color === 'green' ? 'text-green-400 font-bold' : 'text-gray-300'}`}>{item.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Quote */}
              <div className="p-6 sm:p-8 bg-gradient-to-r from-gold-premium/10 to-gold-premium/5 border-t border-gold-premium/30">
                <div className="flex items-start gap-4">
                  <div className="text-gold-premium text-4xl font-serif leading-none">"</div>
                  <div>
                    <p className="text-white text-lg sm:text-xl font-medium italic leading-relaxed mb-4">
                      I went from <span className="text-gold-premium font-bold">invisible to booked out</span> in 3 weeks.
                      My buyers find ME now. I haven't cold called in months.
                      This system gave me my time back AND filled my pipeline.
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold-premium">
                        <Image src="/images/jessica-photo.jpeg" alt="Jessica" width={40} height={40} className="object-cover" />
                      </div>
                      <div>
                        <p className="text-white font-bold">Jessica Rivera</p>
                        <p className="text-gray-400 text-sm">2 months after joining</p>
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-gold-premium text-gold-premium" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Stats Bar */}
              <div className="grid grid-cols-3 divide-x divide-white/10 bg-black/50">
                {[
                  { value: '$37', label: 'Investment', sub: 'One-time' },
                  { value: '17', label: 'Buyer Leads', sub: '3 weeks' },
                  { value: '$18.4K', label: 'Commissions', sub: '2 months' },
                ].map((stat, i) => (
                  <div key={i} className="p-4 sm:p-6 text-center">
                    <div className={`text-xl sm:text-2xl font-black mb-1 ${i === 1 ? 'text-gold-premium' : i === 2 ? 'text-green-400' : 'text-white'}`}>{stat.value}</div>
                    <div className="text-gray-400 text-xs font-semibold">{stat.label}</div>
                    <div className="text-gray-600 text-[10px]">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          3B. LUCAS CASE STUDY - CREAM/WHITE SECTION (Listing Agent Story)
          ================================================================ */}
      <section
        id="case-study-lucas"
        data-animate
        className="py-16 sm:py-24 bg-gradient-to-b from-amber-50 to-white"
      >
        <div className="w-full px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className={`text-center mb-10 ${visibleSections.has('case-study') ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="inline-flex items-center gap-2 bg-gold-premium/10 border border-gold-premium/30 px-4 py-2 rounded-full mb-4">
                <Play className="w-4 h-4 text-gold-premium" />
                <span className="text-gold-premium font-bold text-sm uppercase tracking-wide">Listing Agent Success</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
                His First AI Video Got Him a <span className="text-gold-premium">$285K Listing</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">From paying $400/video to getting seller leads for free</p>
            </div>

            {/* Lucas Case Study Card - Light Theme */}
            <div className={`bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xl ${visibleSections.has('case-study') ? 'animate-fade-in-up animation-delay-200' : 'opacity-0'}`}>

              {/* Top: Profile + Before Situation */}
              <div className="p-6 sm:p-8 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {/* Profile */}
                  <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:text-center">
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 border-gold-premium shadow-lg">
                        <Image src="/images/lucas-photo.webp" alt="Lucas Martinez" width={96} height={96} className="object-cover w-full h-full" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-gold-premium text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                        VERIFIED
                      </div>
                    </div>
                    <div className="sm:mt-2">
                      <h3 className="text-gray-900 font-black text-lg">Lucas Martinez</h3>
                      <p className="text-gold-dark text-sm font-medium">Listing Specialist</p>
                      <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>Houston, Texas</span>
                      </div>
                    </div>
                  </div>

                  {/* Before Story */}
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1 rounded-full mb-3">
                      <span className="text-red-600 text-xs font-bold">THE PROBLEM</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      "I was paying <span className="text-gray-900 font-bold">$400 per video</span> to a local videographer.
                      After 3 months, I had 6 videos, <span className="text-gray-900 font-bold">$2,400 spent</span>, and
                      <span className="text-red-600 font-bold"> zero listing leads</span>. Meanwhile, newer agents were
                      dominating Instagram. I felt invisible..."
                    </p>
                  </div>
                </div>
              </div>

              {/* Video Section */}
              <div className="p-6 sm:p-8 bg-gray-50">
                <div className="inline-flex items-center gap-2 bg-gold-premium/10 border border-gold-premium/30 px-3 py-1 rounded-full mb-4">
                  <span className="text-gold-dark text-xs font-bold">HIS FIRST AI VIDEO</span>
                </div>

                <div className="relative rounded-xl overflow-hidden border-2 border-gold-premium/40 shadow-2xl">
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
                      className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer group"
                      onClick={handlePlayVideo}
                    >
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gold-premium to-gold-dark rounded-full flex items-center justify-center shadow-2xl shadow-gold-premium/50 group-hover:scale-110 transition-transform">
                        <Play className="w-10 h-10 sm:w-12 sm:h-12 text-black fill-black ml-1" />
                      </div>
                      <div className="absolute bottom-3 left-3 bg-black/80 text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-gold-premium/30">
                        ▶ Watch His First AI Video
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

                <p className="text-gray-500 text-sm mt-3 text-center">
                  Created in <span className="text-gold-dark font-bold">7 minutes</span> • Posted on Instagram Reels • Day 1 of using the system
                </p>
              </div>

              {/* The Speed Stats */}
              <div className="p-6 sm:p-8 bg-white border-t border-gray-100">
                <div className="inline-flex items-center gap-2 bg-gold-premium/10 border border-gold-premium/30 px-3 py-1 rounded-full mb-4">
                  <span className="text-gold-dark text-xs font-bold">THE SPEED OF AI CONTENT</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { number: '18', label: 'Hours to First Lead', sub: 'not weeks' },
                    { number: '$0', label: 'Video Cost', sub: 'vs $400 before' },
                    { number: '1', label: 'Listing Signed', sub: 'from 1 video' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-gradient-to-br from-amber-50 to-white border border-gold-premium/30 rounded-xl p-4 text-center">
                      <div className="text-gold-premium text-4xl sm:text-5xl font-black mb-1">{stat.number}</div>
                      <div className="text-gray-900 font-bold text-sm">{stat.label}</div>
                      <div className="text-gray-500 text-xs">{stat.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline / Results */}
              <div className="p-4 sm:p-8 border-t border-gray-100 bg-gray-50">
                <div className="inline-flex items-center gap-2 bg-gold-premium/10 border border-gold-premium/30 px-3 py-1 rounded-full mb-4 sm:mb-6">
                  <span className="text-gold-dark text-xs font-bold">THE TIMELINE</span>
                </div>

                {/* Timeline - improved mobile layout */}
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { time: 'Day 1', event: 'Posted his first AI video (took 7 minutes)', icon: Upload, color: 'gray' },
                    { time: 'Hour 18', event: 'Seller DM: "I have a home to sell"', icon: MessageSquare, color: 'gold' },
                    { time: 'Day 4', event: 'Listing appointment with the seller', icon: Calendar, color: 'gold' },
                    { time: 'Day 7', event: '$285K listing signed at 4.5%', icon: FileText, color: 'gold' },
                    { time: 'Day 52', event: 'SOLD • $12,825 commission', icon: DollarSign, color: 'green' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.color === 'green' ? 'bg-green-100 border border-green-300' :
                        item.color === 'gold' ? 'bg-amber-100 border border-gold-premium/40' :
                        'bg-gray-100 border border-gray-300'
                      }`}>
                        <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          item.color === 'green' ? 'text-green-600' :
                          item.color === 'gold' ? 'text-gold-dark' :
                          'text-gray-500'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`inline-block text-[10px] sm:text-xs font-black px-2 py-0.5 rounded mb-1 ${
                          item.color === 'green' ? 'bg-green-100 text-green-700' :
                          item.color === 'gold' ? 'bg-amber-100 text-gold-dark' :
                          'bg-gray-100 text-gray-600'
                        }`}>{item.time}</span>
                        <p className={`text-xs sm:text-sm leading-snug ${item.color === 'green' ? 'text-green-700 font-bold' : 'text-gray-700'}`}>{item.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Quote */}
              <div className="p-6 sm:p-8 bg-gradient-to-r from-gold-premium/10 to-amber-50 border-t border-gold-premium/20">
                <div className="flex items-start gap-4">
                  <div className="text-gold-premium text-4xl font-serif leading-none">"</div>
                  <div>
                    <p className="text-gray-800 text-lg sm:text-xl font-medium italic leading-relaxed mb-4">
                      One video. <span className="text-gold-dark font-bold">$12,825 commission</span>.
                      I spent $2,400 on a videographer and got nothing. Sara's system cost me $37 and
                      I had a listing in a week. The math is insane.
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold-premium">
                        <Image src="/images/lucas-photo.webp" alt="Lucas" width={40} height={40} className="object-cover" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-bold">Lucas Martinez</p>
                        <p className="text-gray-500 text-sm">52 days after joining</p>
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-gold-premium text-gold-premium" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Stats Bar */}
              <div className="grid grid-cols-3 divide-x divide-gray-200 bg-white">
                {[
                  { value: '$37', label: 'Investment', sub: 'One-time' },
                  { value: '$12,825', label: 'Commission', sub: '52 days' },
                  { value: '346x', label: 'ROI', sub: 'Return' },
                ].map((stat, i) => (
                  <div key={i} className="p-4 sm:p-6 text-center">
                    <div className={`text-xl sm:text-2xl font-black mb-1 ${i === 1 ? 'text-green-600' : i === 2 ? 'text-gold-premium' : 'text-gray-900'}`}>{stat.value}</div>
                    <div className="text-gray-600 text-xs font-semibold">{stat.label}</div>
                    <div className="text-gray-400 text-[10px]">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          4. WHAT'S INSIDE - BLACK SECTION (Product Showcase)
          ================================================================ */}
      <section
        id="whats-inside"
        data-animate
        className="py-16 sm:py-20 bg-black scroll-mt-16"
      >
        <div className="w-full px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className={`text-center mb-12 ${visibleSections.has('whats-inside') ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
                Here's What You Get <span className="text-gold-premium">Today</span>
              </h2>
              <p className="text-gray-400 text-lg">Everything you need to start generating leads with AI videos</p>
            </div>

            {/* PRODUCT #1 - THE MAIN COURSE */}
            <div className={`bg-gradient-to-br from-gold-premium/15 to-gold-premium/5 border-2 border-gold-premium rounded-2xl p-6 sm:p-8 mb-6 ${
              visibleSections.has('whats-inside') ? 'animate-fade-in-up animation-delay-200' : 'opacity-0'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-gold-premium text-black px-3 py-1 rounded-lg text-xs font-black">MAIN TRAINING</span>
                <span className="text-gray-400 line-through text-sm">$697</span>
                <span className="text-gold-premium font-black">INCLUDED</span>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                <div className="relative w-full lg:w-72 h-44 rounded-xl overflow-hidden flex-shrink-0 border-2 border-gold-premium/50">
                  <Image src="/images/VD-Course-demo.webp" alt="AgentClone System" fill className="object-cover" />
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">AgentClone 7-Minute Video System</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    The complete A-to-Z video training that shows you exactly how to create professional AI videos
                    in just 7 minutes. Watch over my shoulder as I walk you through every step —
                    from uploading your photo to posting viral content.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'Step-by-step video walkthrough',
                      '50+ ready-to-use scripts',
                      'AI tool setup guide',
                      'Best posting strategies',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                        <Check className="w-4 h-4 text-gold-premium flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* BONUSES HEADER */}
            <div className={`text-center mb-6 ${visibleSections.has('whats-inside') ? 'animate-fade-in-up animation-delay-300' : 'opacity-0'}`}>
              <div className="inline-flex items-center gap-2 bg-gold-premium/20 border border-gold-premium/40 px-5 py-2 rounded-full">
                <Gift className="w-5 h-5 text-gold-premium" />
                <span className="text-gold-premium font-black">+ 10 PREMIUM BONUSES (${totalBonusValue} Value)</span>
              </div>
            </div>

            {/* BONUS PRODUCTS - Full images with clear pricing */}
            <div className="space-y-4 mb-8">
              {/* Bonus 1 - Brand Kit */}
              <div className={`bg-white/5 border border-gold-premium/20 rounded-xl overflow-hidden hover:border-gold-premium/40 transition-all ${visibleSections.has('whats-inside') ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <div className="w-full aspect-[16/9] relative bg-gray-900">
                  <Image src="/images/products/brand-kit.webp" alt="Brand Kit" fill className="object-contain" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-white font-bold text-lg">The Luxury Agent's Brand Kit</h4>
                    <span className="text-gray-400 line-through text-sm">$55</span>
                    <span className="bg-green-500 text-white font-bold text-xs px-2 py-0.5 rounded">FREE</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Logo templates, business cards, letterheads & social media templates.
                    Look like a luxury agent from day one. Fully editable in Canva.
                  </p>
                </div>
              </div>

              {/* Bonus 2 - Business Planner */}
              <div className={`bg-white/5 border border-gold-premium/20 rounded-xl overflow-hidden hover:border-gold-premium/40 transition-all ${visibleSections.has('whats-inside') ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <div className="w-full aspect-[16/9] relative bg-gray-900">
                  <Image src="/images/products/business-planner.webp" alt="Business Planner" fill className="object-contain" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-white font-bold text-lg">2026 Million Dollar Roadmap Planner</h4>
                    <span className="text-gray-400 line-through text-sm">$67</span>
                    <span className="bg-green-500 text-white font-bold text-xs px-2 py-0.5 rounded">FREE</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    The exact 12-month planning system top 1% agents use.
                    Track goals, leads, listings & revenue in one beautiful planner.
                  </p>
                </div>
              </div>

              {/* Bonus 3 - Hooks */}
              <div className={`bg-white/5 border border-gold-premium/20 rounded-xl overflow-hidden hover:border-gold-premium/40 transition-all ${visibleSections.has('whats-inside') ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <div className="w-full aspect-[16/9] relative bg-gray-900">
                  <Image src="/images/products/hooks-impossible-to-skip.webp" alt="Hooks" fill className="object-contain" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-white font-bold text-lg">45 Scroll-Stopping Hooks</h4>
                    <span className="text-gray-400 line-through text-sm">$49</span>
                    <span className="bg-green-500 text-white font-bold text-xs px-2 py-0.5 rounded">FREE</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Opening lines tested on 10M+ views. Stop thumbs mid-scroll with hooks
                    that make people HAVE to watch your video.
                  </p>
                </div>
              </div>

              {/* Bonus 4 - ChatGPT Mentor */}
              <div className={`bg-white/5 border border-gold-premium/20 rounded-xl overflow-hidden hover:border-gold-premium/40 transition-all ${visibleSections.has('whats-inside') ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <div className="w-full aspect-[16/9] relative bg-gray-900">
                  <Image src="/images/products/chatgpt-mentor.webp" alt="AI Mentor" fill className="object-contain" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-white font-bold text-lg">Custom ChatGPT AI Mentor</h4>
                    <span className="text-gray-400 line-through text-sm">$45</span>
                    <span className="bg-green-500 text-white font-bold text-xs px-2 py-0.5 rounded">FREE</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Your personal AI coach trained on strategies from top producers.
                    Get instant answers on scripts, negotiations & positioning — 24/7.
                  </p>
                </div>
              </div>

              {/* Bonus 5 - Personal Brand */}
              <div className={`bg-white/5 border border-gold-premium/20 rounded-xl overflow-hidden hover:border-gold-premium/40 transition-all ${visibleSections.has('whats-inside') ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <div className="w-full aspect-[16/9] relative bg-gray-900">
                  <Image src="/images/products/personal-brand.webp" alt="Personal Brand" fill className="object-contain" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-white font-bold text-lg">$10M Personal Brand Masterclass</h4>
                    <span className="text-gray-400 line-through text-sm">$65</span>
                    <span className="bg-green-500 text-white font-bold text-xs px-2 py-0.5 rounded">FREE</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Build a magnetic personal brand in 90 days.
                    Includes the exact 17-minute daily ritual that compounds into market dominance.
                  </p>
                </div>
              </div>

              {/* Bonus 6 - Instagram Stories */}
              <div className={`bg-white/5 border border-gold-premium/20 rounded-xl overflow-hidden hover:border-gold-premium/40 transition-all ${visibleSections.has('whats-inside') ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <div className="w-full aspect-[16/9] relative bg-gray-900">
                  <Image src="/images/products/instagram-stories.webp" alt="Instagram Stories" fill className="object-contain" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-white font-bold text-lg">327 Instagram Story Templates</h4>
                    <span className="text-gray-400 line-through text-sm">$47</span>
                    <span className="bg-green-500 text-white font-bold text-xs px-2 py-0.5 rounded">FREE</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Done-for-you story templates that drive DMs.
                    Open house countdowns, just listed reveals, market updates — all ready to post.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bonus 7 - Fall Reels */}
              <div className={`bg-white/5 border border-gold-premium/20 rounded-xl overflow-hidden hover:border-gold-premium/40 transition-all ${visibleSections.has('whats-inside') ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <div className="w-full aspect-[16/9] relative bg-gray-900">
                  <Image src="/images/products/viral-reels.webp" alt="Viral Reels" fill className="object-contain" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-white font-bold text-lg">25 Seasonal Reel Templates</h4>
                    <span className="text-gray-400 line-through text-sm">$29</span>
                    <span className="bg-green-500 text-white font-bold text-xs px-2 py-0.5 rounded">FREE</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Seasonal content that converts during peak buying seasons.
                    Ready to edit in Canva — customize with your listings in 5 minutes.
                  </p>
                </div>
              </div>

              {/* Bonus 8 - Funny Posts */}
              <div className={`bg-white/5 border border-gold-premium/20 rounded-xl overflow-hidden hover:border-gold-premium/40 transition-all ${visibleSections.has('whats-inside') ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <div className="w-full aspect-[16/9] relative bg-gray-900">
                  <Image src="/images/products/funny-posts.webp" alt="Funny Posts" fill className="object-contain" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-white font-bold text-lg">30 Funny Real Estate Posts</h4>
                    <span className="text-gray-400 line-through text-sm">$25</span>
                    <span className="bg-green-500 text-white font-bold text-xs px-2 py-0.5 rounded">FREE</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Humor that gets 3X more engagement. Stand out with personality-driven
                    content that makes you memorable. Just add your logo and post.
                  </p>
                </div>
              </div>

              {/* Bonus 9 - DM Scripts */}
              <div className={`bg-white/5 border border-gold-premium/20 rounded-xl overflow-hidden hover:border-gold-premium/40 transition-all ${visibleSections.has('whats-inside') ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <div className="w-full aspect-[16/9] relative bg-gray-900">
                  <Image src="/images/products/instagram-dm-scripts.webp" alt="DM Scripts" fill className="object-contain" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-white font-bold text-lg">89 DM Scripts That Convert</h4>
                    <span className="text-gray-400 line-through text-sm">$39</span>
                    <span className="bg-green-500 text-white font-bold text-xs px-2 py-0.5 rounded">FREE</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Copy-paste messages with 40%+ response rates.
                    Turn story viewers into scheduled consultations without being salesy.
                  </p>
                </div>
              </div>

              {/* Bonus 10 - Email Signatures */}
              <div className={`bg-white/5 border border-gold-premium/20 rounded-xl overflow-hidden hover:border-gold-premium/40 transition-all ${visibleSections.has('whats-inside') ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <div className="w-full aspect-[16/9] relative bg-gray-900">
                  <Image src="/images/products/email-signature-professional.webp" alt="Email Signatures" fill className="object-contain" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-white font-bold text-lg">Professional Email Signatures</h4>
                    <span className="text-gray-400 line-through text-sm">$17</span>
                    <span className="bg-green-500 text-white font-bold text-xs px-2 py-0.5 rounded">FREE</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Turn every email into a marketing opportunity. 25+ templates with your
                    headshot, social links & latest listing. Works in Gmail, Outlook & Apple Mail.
                  </p>
                </div>
              </div>
            </div>

            {/* EXTRA BONUSES - Support & Updates */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 ${visibleSections.has('whats-inside') ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="bg-gradient-to-br from-gold-premium/10 to-transparent border border-gold-premium/30 rounded-xl p-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-gold-premium">
                    <Image src="/images/Sara 61kb.webp" alt="Sara" width={56} height={56} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Direct Access to Sara</h4>
                    <p className="text-gray-400 text-sm">Email + Instagram DM support</p>
                    <p className="text-gold-premium font-bold text-sm mt-1">$197 value — FREE</p>
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
                    <p className="text-gold-premium font-bold text-sm mt-1">$297 value — FREE</p>
                  </div>
                </div>
              </div>
            </div>

            {/* TOTAL VALUE + CTA - Compact on mobile */}
            <div className={`bg-gradient-to-br from-gold-premium/20 to-black rounded-2xl border-2 border-gold-premium p-4 sm:p-8 ${
              visibleSections.has('whats-inside') ? 'animate-fade-in-up' : 'opacity-0'
            }`}>
              {/* Price Box - Compact */}
              <div className="bg-black/50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 text-center border border-gold-premium/30">
                <p className="text-gold-premium font-bold text-sm sm:text-base mb-2">Get Everything Today For</p>
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1">
                  <span className="text-4xl sm:text-6xl font-black text-gold-premium">$37</span>
                  <div className="text-left">
                    <span className="bg-red-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm font-black block">98% OFF</span>
                    <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5">One-time</p>
                  </div>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">Lifetime access • No hidden costs</p>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-gold-premium to-gold-dark text-black py-4 sm:py-5 rounded-xl font-black text-base sm:text-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                Get Instant Access Now
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Trust - Compact */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-gray-400 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-premium" />
                  <span>30-Day Guarantee</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-premium" />
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          5. TESTIMONIALS - DARK ANIMATED CAROUSEL
          ================================================================ */}
      <section
        id="testimonials"
        data-animate
        className="py-12 sm:py-16 bg-black"
      >
        {/* Header */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8 sm:mb-10">
          <div className={`text-center ${visibleSections.has('testimonials') ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 bg-gold-premium/10 border border-gold-premium/30 px-4 py-2 rounded-full mb-4">
              <Users className="w-4 h-4 text-gold-premium" />
              <span className="text-gold-premium font-bold text-sm uppercase tracking-wide">Success Stories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
              Real Agents. <span className="text-gold-premium">Real Results.</span>
            </h2>
            <div className="flex items-center justify-center gap-6 text-gray-400">
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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 8H6C4.89543 8 4 8.89543 4 10V14C4 15.1046 4.89543 16 6 16H8C9.10457 16 10 15.1046 10 14V8ZM10 8C10 5.79086 8.20914 4 6 4" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M20 8H16C14.8954 8 14 8.89543 14 10V14C14 15.1046 14.8954 16 16 16H18C19.1046 16 20 15.1046 20 14V8ZM20 8C20 5.79086 18.2091 4 16 4" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>

                {/* Headline - Results */}
                <h3 className="text-white text-xl sm:text-2xl font-bold mb-3 leading-tight tracking-tight">
                  {t.results}
                </h3>

                {/* Review Text */}
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
                  "{t.review}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gold-premium/30">
                    <Image src={t.image} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Duplicated set for seamless infinite loop */}
            {testimonials.map((t) => (
              <div key={`second-${t.id}`} className="testimonial-card">
                {/* Quote Icon */}
                <div className="testimonial-quote-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 8H6C4.89543 8 4 8.89543 4 10V14C4 15.1046 4.89543 16 6 16H8C9.10457 16 10 15.1046 10 14V8ZM10 8C10 5.79086 8.20914 4 6 4" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M20 8H16C14.8954 8 14 8.89543 14 10V14C14 15.1046 14.8954 16 16 16H18C19.1046 16 20 15.1046 20 14V8ZM20 8C20 5.79086 18.2091 4 16 4" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>

                {/* Headline - Results */}
                <h3 className="text-white text-xl sm:text-2xl font-bold mb-3 leading-tight tracking-tight">
                  {t.results}
                </h3>

                {/* Review Text */}
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
                  "{t.review}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gold-premium/30">
                    <Image src={t.image} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.location}</p>
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
        className="py-16 sm:py-20 bg-white"
      >
        <div className="w-full px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className={`bg-gradient-to-br from-gold-premium/10 to-white border-2 border-gold-premium/40 rounded-2xl p-8 sm:p-10 ${
              visibleSections.has('guarantee1') ? 'animate-fade-in-up' : 'opacity-0'
            }`}>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-gold-premium/20 border border-gold-premium/40 rounded-full px-4 py-2 mb-4">
                  <Shield className="w-5 h-5 text-gold-premium" />
                  <span className="text-gold-dark font-bold text-sm uppercase">Iron-Clad Guarantee</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
                  30-Day Money Back + <span className="text-gold-premium">$50 Cash</span>
                </h2>
                <p className="text-gray-600">You literally cannot lose.</p>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gold-premium flex-shrink-0 shadow-xl">
                  <Image src="/images/Sara 61kb.webp" alt="Sara" width={128} height={128} className="object-cover w-full h-full" />
                </div>
                <div>
                  <p className="text-gray-700 text-lg leading-relaxed mb-4 italic">
                    "If you can't create professional videos in 7 minutes or less, or if this system doesn't work for you for ANY reason —
                    I'll refund every penny AND send you $50 for wasting your time. No questions asked. No hoops to jump through."
                  </p>
                  <p className="text-gold-dark font-bold text-lg">— Sara Cohen</p>
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
          7. PRICING - BLACK SECTION (Reveal price!)
          ================================================================ */}
      <section
        id="pricing"
        data-animate
        className="py-16 sm:py-20 bg-black scroll-mt-16"
      >
        <div className="w-full px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className={`text-center mb-10 ${visibleSections.has('pricing') ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-full mb-4 animate-pulse">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 font-bold text-sm">Only {spotsLeft} spots left at this price</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
                Get Everything Today For
              </h2>
            </div>

            {/* Price Comparison - horizontal scroll on mobile */}
            <div className={`overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible mb-8 sm:mb-10 ${visibleSections.has('pricing') ? 'animate-fade-in-up animation-delay-200' : 'opacity-0'}`}>
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

            {/* Main Price Box - Compact on mobile */}
            <div className={`bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-5 sm:p-10 text-center border-2 border-gold-premium/50 shadow-2xl ${
              visibleSections.has('pricing') ? 'animate-fade-in-up animation-delay-400' : 'opacity-0'
            }`}>
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                <span className="text-4xl sm:text-6xl font-black text-gold-premium">$37</span>
                <div className="text-left">
                  <span className="bg-red-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm font-black">98% OFF</span>
                  <p className="text-gray-400 text-[10px] sm:text-sm mt-0.5">One-time</p>
                </div>
              </div>
              <p className="text-gold-premium font-bold text-xs sm:text-base mb-4 sm:mb-6">Lifetime access • No monthly fees</p>

              <button
                onClick={handleCheckout}
                className="w-full max-w-md mx-auto bg-gradient-to-r from-gold-premium via-gold-light to-gold-premium text-black py-3.5 sm:py-5 rounded-xl font-black text-base sm:text-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                Get Instant Access Now
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4 sm:mt-6 text-gray-400 text-[10px] sm:text-sm">
                <div className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-gold-premium" />
                  <span>30-Day Guarantee</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-gold-premium" />
                  <span>Secure Checkout</span>
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
        className="py-16 sm:py-20 bg-white"
      >
        <div className="w-full px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className={`text-center mb-10 ${visibleSections.has('faq') ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                Common <span className="text-gold-premium">Questions</span>
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`bg-gray-50 border border-gray-200 rounded-xl overflow-hidden ${
                    visibleSections.has('faq') ? 'animate-fade-in-up' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-semibold pr-4 text-gray-900">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-gold-premium flex-shrink-0 transition-transform ${expandedFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFaq === i && (
                    <div className="px-5 pb-5">
                      <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          9. GUARANTEE #2 - BLACK SECTION
          ================================================================ */}
      <section
        id="guarantee2"
        data-animate
        className="py-16 sm:py-20 bg-black"
      >
        <div className="w-full px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className={`bg-gradient-to-br from-white/10 to-white/5 border-2 border-gold-premium/40 rounded-2xl p-8 sm:p-10 ${
              visibleSections.has('guarantee2') ? 'animate-fade-in-up' : 'opacity-0'
            }`}>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gold-premium/20 rounded-full mb-4">
                  <Shield className="w-10 h-10 text-gold-premium" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                  Try It Risk-Free for 30 Days
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  I'm so confident this will work for you that I'm taking ALL the risk.
                  If you're not 100% satisfied, you get every penny back — PLUS $50 for trying.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                  <div key={i} className="bg-black/50 rounded-xl p-6 text-center border border-gold-premium/20">
                    <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 bg-gold-premium/20">
                      <item.icon className="w-7 h-7 text-gold-premium" />
                    </div>
                    <h3 className="font-black text-white text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <p className="text-gold-premium font-bold text-lg">
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
        className="py-16 sm:py-20 bg-white"
      >
        <div className="w-full px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className={`text-center mb-10 ${visibleSections.has('meet-sara') ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="inline-flex items-center gap-2 bg-gold-premium/10 border border-gold-premium/30 px-4 py-2 rounded-full mb-4">
                <Award className="w-4 h-4 text-gold-premium" />
                <span className="text-gold-premium font-bold text-sm uppercase tracking-wide">Meet Your Instructor</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Who Am I & <span className="text-gold-premium">Why Should You Listen?</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Sara Image */}
              <div className={`relative ${visibleSections.has('meet-sara') ? 'animate-fade-in-up animation-delay-200' : 'opacity-0'}`}>
                <div className="relative aspect-[3/4] max-w-sm mx-auto rounded-2xl overflow-hidden border-4 border-gold-premium/50 shadow-2xl">
                  <Image
                    src="/images/Sara 61kb.webp"
                    alt="Sara Cohen"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-4 right-4 bg-gold-premium text-black px-3 py-1.5 rounded-lg font-bold text-sm">
                    ✦ Verified
                  </div>
                </div>
              </div>

              {/* Sara Story */}
              <div className={`space-y-6 ${visibleSections.has('meet-sara') ? 'animate-fade-in-up animation-delay-300' : 'opacity-0'}`}>
                <div>
                  <h3 className="text-gold-premium font-black text-xl mb-3">I Was You</h3>
                  <p className="text-gray-600 leading-relaxed">
                    8 years grinding as a luxury agent in Dubai. $127M+ in sales. But I was exhausted.
                    Filming content felt like a second job. I looked for a better way.
                  </p>
                </div>

                <div>
                  <h3 className="text-gold-premium font-black text-xl mb-3">Then I Found AI Video</h3>
                  <p className="text-gray-600 leading-relaxed">
                    One photo. 50 videos. In minutes. My social media exploded. More leads. More listings.
                    More commissions. All while working LESS.
                  </p>
                </div>

                <div>
                  <h3 className="text-gold-premium font-black text-xl mb-3">Now I'm Sharing Everything</h3>
                  <p className="text-gray-600 leading-relaxed">
                    847+ agents have joined. The results speak for themselves. This isn't theory —
                    it's the exact system I use daily.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 pt-6">
                  {[
                    { value: '$127M+', label: 'Career Sales' },
                    { value: '8 Years', label: 'Experience' },
                    { value: '847+', label: 'Agents Helped' },
                    { value: '4.9/5', label: 'Avg Rating' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
                      <div className="text-gold-premium font-black text-lg sm:text-xl">{stat.value}</div>
                      <div className="text-gray-500 text-xs">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          11. FINAL CTA - GOLD SECTION
          ================================================================ */}
      <section
        id="final-cta"
        data-animate
        className="py-16 sm:py-24 bg-gradient-to-br from-gold-premium via-gold-light to-gold-premium"
      >
        <div className="w-full px-4 sm:px-6">
          <div className={`max-w-xl mx-auto text-center ${visibleSections.has('final-cta') ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-2xl sm:text-4xl font-black text-black mb-3 sm:mb-4">
              Ready to Start Getting Leads?
            </h2>
            <p className="text-black/70 text-sm sm:text-lg mb-5 sm:mb-8">
              Join 847+ agents using AI videos to dominate their market
            </p>

            <div className="bg-black rounded-2xl p-5 sm:p-8 shadow-2xl mb-4 sm:mb-6">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className="text-3xl sm:text-5xl font-black text-gold-premium">$37</span>
                <span className="bg-red-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm font-black">98% OFF</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-gold-premium to-gold-dark text-black py-3.5 sm:py-5 rounded-xl font-black text-base sm:text-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                Get Instant Access Now
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <p className="text-gray-500 text-xs sm:text-sm mt-3 sm:mt-4 flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                30-Day Money-Back Guarantee
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          FOOTER - BLACK
          ================================================================ */}
      <footer className="py-8 sm:py-10 bg-black border-t border-gray-900">
        <div className="w-full px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-4 sm:mb-6 text-gray-500 text-sm">
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
            </div>
          </div>
        </div>
      </footer>


      {/* Animation Styles - Modern, smooth, GPU-accelerated */}
      <style jsx global>{`
        /* Modern cubic-bezier for smooth feel */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-up {
          animation: scaleUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Fade in from left */
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Fade in from right */
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Respect user motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up,
          .animate-scale-up,
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
