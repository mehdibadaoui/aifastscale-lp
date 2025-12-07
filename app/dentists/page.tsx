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
  Stethoscope,
  Phone,
} from 'lucide-react'
import { DENTIST_BONUS_PRODUCTS, getDentistTotalBonusValue } from '../config/dentist-bonus-products'

export default function DentistCleanLandingPage() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(true)
  const [spotsLeft, setSpotsLeft] = useState(7)
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
      q: 'Will patients know it\'s AI?',
      a: 'Most can\'t tell. The lip-sync is incredibly realistic. Your patients care about your message and expertise, not how you made it. 500+ dentists are already using this successfully.',
    },
    {
      q: 'I\'m not tech-savvy. Can I do this?',
      a: 'If you can text and upload a photo, you can do this. Step-by-step training included. Plus support is available if you get stuck.',
    },
    {
      q: 'Do I need expensive AI tools?',
      a: 'No. Everything is included. The system shows you exactly which free/cheap tools to use. No hidden costs.',
    },
    {
      q: 'Will this work for my dental practice?',
      a: 'Yes. 500+ dentists across the US, UK, Canada, and Australia use this daily. Works for general dentistry, cosmetic, ortho, and all specialties.',
    },
    {
      q: 'When do I get access?',
      a: 'Immediately after signing up. Check your email for login details. You can create your first video in the next 10 minutes.',
    },
  ]

  const testimonials = [
    {
      id: 1,
      name: 'Dr. Sarah Mitchell',
      role: 'Cosmetic Dentist',
      location: 'Los Angeles, CA',
      image: '/images/dentist/review-1.webp',
      review: "I was skeptical about AI videos, but this changed everything. Created my first video in 7 minutes - got 12 new patient inquiries that same week.",
      results: '12 new patients in first week',
    },
    {
      id: 2,
      name: 'Dr. James Rodriguez',
      role: 'Family Dentistry',
      location: 'Houston, TX',
      image: '/images/dentist/review-2.webp',
      review: "After 20 years in dentistry, I thought I'd seen it all. My hygiene schedule is now booked 6 weeks out - all from AI video leads.",
      results: 'Booked 6 weeks out',
    },
    {
      id: 3,
      name: 'Dr. Emily Chen',
      role: 'Orthodontist',
      location: 'San Francisco, CA',
      image: '/images/dentist/review-3.webp',
      review: "As a Bay Area orthodontist, I need to stand out. These AI videos make my practice look like a premium brand. Went from 2-3 consults to 15+ per week.",
      results: '15+ consults/week',
    },
    {
      id: 4,
      name: 'Dr. Michael Thompson',
      role: 'Implant Specialist',
      location: 'Chicago, IL',
      image: '/images/dentist/review-5.webp',
      review: "Was spending $2,000/month on video production. Now I create better content myself in minutes. ROI was immediate.",
      results: '50x ROI',
    },
    {
      id: 5,
      name: 'Dr. Lisa Park',
      role: 'Pediatric Dentist',
      location: 'Seattle, WA',
      image: '/images/dentist/review-9.webp',
      review: "My TikTok video got 89K views. Booked 23 new pediatric patients that month. This system pays for itself daily.",
      results: '23 new patients from 1 video',
    },
    {
      id: 6,
      name: 'Dr. Robert Johnson',
      role: 'General Dentist',
      location: 'Phoenix, AZ',
      image: '/images/dentist/review-11.webp',
      review: "25 years in dentistry and I wish I had this sooner. 8 new patients last month from social media alone.",
      results: '8 patients from social',
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

  const allBonuses = DENTIST_BONUS_PRODUCTS
  const totalBonusValue = getDentistTotalBonusValue()

  // Animation class helper
  const getAnimClass = (sectionId: string, delay: number = 0) => {
    const isVisible = visibleSections.has(sectionId)
    return `transition-all duration-700 ${delay ? `delay-[${delay}ms]` : ''} ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`
  }

  return (
    <main className="min-h-screen bg-black bg-animated-gradient-dentist">
      {/* Subtle floating particles */}
      <div className="bg-particles-dentist" />

      {/* ================================================================
          1. HERO SECTION - BLACK WITH TEAL (Normal Structure)
          ================================================================ */}
      <section
        id="hero"
        data-animate
        className="relative bg-black text-white py-8 sm:py-16 md:py-20 overflow-hidden"
      >
        {/* Subtle teal grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(20, 184, 166, 0.4) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="w-full px-4 sm:px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Main Headline - BIG & BOLD */}
            <h1 className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-5 sm:mb-8 leading-[1.05] tracking-tight ${visibleSections.has('hero') ? 'animate-fade-in-up' : ''}`}>
              <span className="text-white drop-shadow-lg">Turn Any Photo Into a</span>
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent drop-shadow-2xl" style={{ textShadow: '0 0 40px rgba(20, 184, 166, 0.3)' }}>
                  Talking AI Video
                </span>
              </span>
              <br />
              <span className="text-white drop-shadow-lg">&</span>
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent" style={{ textShadow: '0 0 40px rgba(20, 184, 166, 0.3)' }}>
                {' '}Get 100+ New Patients
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
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-teal-500/30 sm:border-2 sm:border-teal-500/40 shadow-xl shadow-teal-500/10">
                <Image
                  src="/images/dentist/course-demo.webp"
                  alt="AI Video System for Dentists Showcase"
                  width={1365}
                  height={768}
                  className="w-full h-auto"
                  priority
                  fetchPriority="high"
                />
              </div>
            </div>

            {/* Trust badges - UNDER the image */}
            <div className={`flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 ${visibleSections.has('hero') ? 'animate-fade-in-up animation-delay-400' : ''}`}>
              <div className="flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
                <span><span className="text-white font-bold">500+</span> dentists</span>
              </div>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-teal-400 text-teal-400" />
                ))}
                <span className="ml-1 text-white font-bold">4.9/5</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
                <span>30-Day Guarantee</span>
              </div>
            </div>

            {/* CTA - Scrolls to What's Inside */}
            <button
              onClick={() => scrollToSection('whats-inside')}
              className={`group relative bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 text-white px-10 py-5 rounded-xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-teal-500/30 overflow-hidden ${visibleSections.has('hero') ? 'animate-fade-in-up animation-delay-500' : ''}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative flex items-center gap-3">
                See What's Inside
                <ArrowDown className="w-6 h-6" />
              </span>
            </button>

            <p className={`text-gray-600 text-sm mt-4 ${visibleSections.has('hero') ? 'animate-fade-in-up animation-delay-500' : ''}`}>
              ↓ Scroll to see everything you get ↓
            </p>

            {/* What is CloneYourself? - Collapsible */}
            <div className={`max-w-xl mx-auto mt-8 ${visibleSections.has('hero') ? 'animate-fade-in-up animation-delay-500' : ''}`}>
              <button
                onClick={() => setExpandedFaq(expandedFaq === -1 ? null : -1)}
                className="group flex items-center justify-center gap-2 mx-auto text-sm"
              >
                <span className="text-teal-400 font-medium border-b border-dashed border-teal-400/40 group-hover:border-teal-400 transition-colors">
                  What is the CloneYourself System?
                </span>
                <ChevronDown className={`w-4 h-4 text-teal-400 transition-transform duration-300 ${expandedFaq === -1 ? 'rotate-180' : ''}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-500 ease-out ${expandedFaq === -1 ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
                <div className="bg-gradient-to-br from-teal-500/10 to-white/5 backdrop-blur-sm border border-teal-500/20 rounded-xl p-5 text-left">
                  <p className="text-white text-sm leading-relaxed mb-3">
                    You upload <span className="text-teal-400 font-bold">one clear selfie</span> to a free AI software — the #1 tool for generating realistic talking videos in {new Date().getFullYear()}.
                  </p>
                  <p className="text-white/80 text-sm leading-relaxed mb-3">
                    The AI transforms your photo into a <span className="text-teal-400 font-bold">talking video of YOU</span> — your face moves, your lips sync perfectly, it looks 100% real. No filming. No editing. No experience needed.
                  </p>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Inside the CloneYourself System, you get the <span className="text-white font-bold">complete A-to-Z video course</span> that shows you exactly how to do this — even if you've never touched AI before. Just follow along, copy-paste, and create professional videos that bring in new patients.
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
        className="py-10 sm:py-20 bg-white"
      >
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className={`text-center mb-6 sm:mb-12 ${visibleSections.has('how-it-works') ? 'animate-fade-in-up' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 px-3 py-1.5 rounded-full mb-3">
                <Zap className="w-3.5 h-3.5 text-teal-500" />
                <span className="text-teal-600 font-bold text-xs uppercase tracking-wide">Simple Process</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-2 sm:mb-4">
                Create Videos in <span className="text-teal-500">3 Easy Steps</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-lg">No filming. No editing. No experience needed.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
              {[
                { step: 1, icon: Upload, title: 'Upload Your Photo', time: '1 min', desc: 'Any headshot works - selfie, professional shot, or even your website photo. The AI does the rest.' },
                { step: 2, icon: Video, title: 'Type Your Script', time: '2 min', desc: 'Write your message or pick from 100+ ready-made templates designed for dental practices.' },
                { step: 3, icon: TrendingUp, title: 'Get Your Video', time: '4 min', desc: 'AI generates your video with perfect lip-sync. Download, post, watch new patients call.' },
              ].map((item, i) => (
                <div
                  key={item.step}
                  className={`relative bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-gray-200 hover:border-teal-500/50 transition-all hover:shadow-xl ${
                    visibleSections.has('how-it-works') ? 'animate-fade-in-up' : ''
                  }`}
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="absolute -top-3 sm:-top-5 left-4 sm:left-8 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-black text-sm sm:text-xl">{item.step}</span>
                  </div>
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-teal-500/10 text-teal-600 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold border border-teal-500/30">
                    {item.time}
                  </div>
                  <div className="w-10 h-10 sm:w-16 sm:h-16 bg-teal-500/10 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-5 mt-3 sm:mt-4">
                    <item.icon className="w-5 h-5 sm:w-8 sm:h-8 text-teal-500" />
                  </div>
                  <h3 className="text-base sm:text-xl font-black text-gray-900 mb-1.5 sm:mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className={`flex justify-center mt-6 sm:mt-12 ${visibleSections.has('how-it-works') ? 'animate-fade-in-up animation-delay-500' : ''}`}>
              <div className="flex items-center gap-3 sm:gap-6 bg-teal-500/5 border border-teal-500/30 rounded-full px-4 sm:px-8 py-2.5 sm:py-4">
                <Clock className="w-5 h-5 sm:w-8 sm:h-8 text-teal-500" />
                <div>
                  <span className="text-teal-500 font-black text-xl sm:text-3xl">7 minutes</span>
                  <span className="text-gray-600 text-sm sm:text-lg ml-1.5 sm:ml-2">total time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          3. DR. MARCUS CASE STUDY - BLACK SECTION
          "She booked 23 new patients in 3 weeks"
          ================================================================ */}
      <section
        id="case-study"
        data-animate
        className="py-10 sm:py-24 bg-black"
      >
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className={`text-center mb-6 sm:mb-10 ${visibleSections.has('case-study') ? 'animate-fade-in-up' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 px-3 py-1.5 rounded-full mb-3">
                <Play className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-teal-400 font-bold text-xs uppercase tracking-wide">Featured Case Study</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-4">
                She Booked <span className="text-teal-400">23 New Patients</span> in 3 Weeks
              </h2>
              <p className="text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto">...without recording a single video</p>
            </div>

            {/* Dr. Sarah Case Study Card */}
            <div className={`bg-gradient-to-br from-white/5 to-white/[0.02] border border-teal-500/30 rounded-xl sm:rounded-2xl overflow-hidden mb-8 sm:mb-16 ${visibleSections.has('case-study') ? 'animate-fade-in-up animation-delay-200' : ''}`}>

              {/* Top: Profile + Before Situation */}
              <div className="p-4 sm:p-8 border-b border-white/10">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                  {/* Profile */}
                  <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:text-center">
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 border-teal-400">
                        <Image src="/images/dentist/dr-marcus.webp" alt="Dr. Sarah Mitchell" width={96} height={96} className="object-cover w-full h-full" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-teal-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                        VERIFIED
                      </div>
                    </div>
                    <div className="sm:mt-2">
                      <h3 className="text-white font-black text-lg">Dr. Sarah Mitchell</h3>
                      <p className="text-gray-400 text-sm">Cosmetic Dentist</p>
                      <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>Los Angeles, CA</span>
                      </div>
                    </div>
                  </div>

                  {/* Before Story */}
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-full mb-3">
                      <span className="text-red-400 text-xs font-bold">THE PROBLEM</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      "I was spending <span className="text-white font-bold">$3,000 every month</span> on marketing with barely any results.
                      My social media looked dead. <span className="text-white font-bold">New patient calls were declining</span>.
                      My front desk was slow. <span className="text-red-400 font-bold">I was invisible online</span>.
                      Then I discovered this system..."
                    </p>
                  </div>
                </div>
              </div>

              {/* Big Hero Image */}
              <div className="p-4 sm:p-8 bg-black/50">
                {/* Image without overlay on mobile for clarity */}
                <div className="rounded-xl overflow-hidden border-2 border-teal-500/40 shadow-2xl">
                  <Image
                    src="/images/dentist/dr-marcus.webp"
                    alt="Dr. Sarah Mitchell - 23 New Patients in 3 Weeks"
                    width={1365}
                    height={768}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
                {/* Caption below image for clarity */}
                <div className="mt-4 text-center">
                  <p className="text-teal-400 font-black text-xl sm:text-3xl mb-1">23 New Patients in 3 Weeks</p>
                  <p className="text-gray-400 text-sm">Without recording a single video</p>
                </div>
              </div>

              {/* The Transformation */}
              <div className="p-4 sm:p-8 bg-black/30">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 px-3 py-1.5 rounded-full">
                    <span className="text-teal-400 text-xs font-bold">THE 7-MINUTE TRANSFORMATION</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {[
                    { number: '23', label: 'New Patients', sub: 'in 3 weeks' },
                    { number: '7', label: 'Minutes', sub: 'per video' },
                    { number: '0', label: 'Hours Filming', sub: 'on camera' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-3 sm:p-4 text-center">
                      <div className="text-teal-400 text-3xl sm:text-5xl font-black mb-0.5">{stat.number}</div>
                      <div className="text-white font-bold text-xs sm:text-sm">{stat.label}</div>
                      <div className="text-gray-500 text-[10px] sm:text-xs">{stat.sub}</div>
                    </div>
                  ))}
                </div>

                <p className="text-gray-500 text-xs sm:text-sm mt-4 text-center">
                  Posted <span className="text-teal-400 font-bold">18 AI videos</span> in 3 weeks • Zero filming • Zero editing stress
                </p>
              </div>

              {/* Timeline / Results */}
              <div className="p-4 sm:p-8 border-t border-white/10">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 px-3 py-1.5 rounded-full">
                    <span className="text-teal-400 text-xs font-bold">WHAT HAPPENED NEXT</span>
                  </div>
                </div>

                {/* Timeline - improved mobile layout */}
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { time: 'Day 1', event: 'Created her first AI video (took 7 minutes)', icon: Upload, color: 'gray' },
                    { time: 'Day 3', event: '15,000 views on first 3 videos combined', icon: Eye, color: 'gray' },
                    { time: 'Week 1', event: '6 new patient calls from Instagram', icon: Phone, color: 'teal' },
                    { time: 'Week 2', event: '12 more inquiries • 8 appointments booked', icon: Calendar, color: 'teal' },
                    { time: 'Week 3', event: '23 total new patients • Schedule full', icon: FileText, color: 'teal' },
                    { time: 'Month 2', event: '$47,000 in new patient revenue', icon: DollarSign, color: 'green' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.color === 'green' ? 'bg-green-500/20 border border-green-500/40' :
                        item.color === 'teal' ? 'bg-teal-500/20 border border-teal-500/40' :
                        'bg-white/5 border border-white/20'
                      }`}>
                        <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          item.color === 'green' ? 'text-green-400' :
                          item.color === 'teal' ? 'text-teal-400' :
                          'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`inline-block text-[10px] sm:text-xs font-black px-2 py-0.5 rounded mb-1 ${
                          item.color === 'green' ? 'bg-green-500/20 text-green-400' :
                          item.color === 'teal' ? 'bg-teal-500/20 text-teal-400' :
                          'bg-white/10 text-gray-400'
                        }`}>{item.time}</span>
                        <p className={`text-xs sm:text-sm leading-snug ${item.color === 'green' ? 'text-green-400 font-bold' : 'text-gray-300'}`}>{item.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Quote */}
              <div className="p-6 sm:p-8 bg-gradient-to-r from-teal-500/10 to-teal-500/5 border-t border-teal-500/30">
                <div className="flex items-start gap-4">
                  <div className="text-teal-400 text-4xl font-serif leading-none">"</div>
                  <div>
                    <p className="text-white text-lg sm:text-xl font-medium italic leading-relaxed mb-4">
                      I went from <span className="text-teal-400 font-bold">invisible to fully booked</span> in 3 weeks.
                      Patients find ME now. My phone rings daily.
                      This system gave me my practice back AND filled my schedule.
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-teal-400">
                        <Image src="/images/dentist/dr-marcus.webp" alt="Dr. Sarah" width={40} height={40} className="object-cover" />
                      </div>
                      <div>
                        <p className="text-white font-bold">Dr. Sarah Mitchell</p>
                        <p className="text-gray-400 text-sm">2 months after joining</p>
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-teal-400 text-teal-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Stats Bar */}
              <div className="grid grid-cols-3 divide-x divide-white/10 bg-black/50">
                {[
                  { value: '$58', label: 'Investment', sub: 'One-time' },
                  { value: '23', label: 'New Patients', sub: '3 weeks' },
                  { value: '$47K', label: 'Revenue', sub: '2 months' },
                ].map((stat, i) => (
                  <div key={i} className="p-4 sm:p-6 text-center">
                    <div className={`text-xl sm:text-2xl font-black mb-1 ${i === 1 ? 'text-teal-400' : i === 2 ? 'text-green-400' : 'text-white'}`}>{stat.value}</div>
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
          3B. DR. DAVID CASE STUDY - CREAM/WHITE SECTION (Implant Specialist)
          ================================================================ */}
      <section
        id="case-study-david"
        data-animate
        className="py-10 sm:py-24 bg-gradient-to-b from-teal-50 to-white"
      >
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className={`text-center mb-6 sm:mb-10 ${visibleSections.has('case-study') ? 'animate-fade-in-up' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 px-3 py-1.5 rounded-full mb-3">
                <Play className="w-3.5 h-3.5 text-teal-500" />
                <span className="text-teal-600 font-bold text-xs uppercase tracking-wide">Implant Specialist Success</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-2 sm:mb-4">
                His First AI Video Generated <span className="text-teal-500">$47,000</span> in Implant Cases
              </h2>
              <p className="text-gray-600 text-sm sm:text-lg max-w-2xl mx-auto">From spending $2,000/month on marketing to getting patients for free</p>
            </div>

            {/* Dr. David Case Study Card - Light Theme */}
            <div className={`bg-white border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl ${visibleSections.has('case-study') ? 'animate-fade-in-up animation-delay-200' : ''}`}>

              {/* Top: Profile + Before Situation */}
              <div className="p-4 sm:p-8 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                  {/* Profile */}
                  <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:text-center">
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 border-teal-500 shadow-lg">
                        <Image src="/images/dentist/review-5.webp" alt="Dr. David Kim" width={96} height={96} className="object-cover w-full h-full" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        VERIFIED
                      </div>
                    </div>
                    <div className="sm:mt-2">
                      <h3 className="text-gray-900 font-black text-lg">Dr. David Kim</h3>
                      <p className="text-teal-600 text-sm font-medium">Implant Specialist</p>
                      <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>Chicago, IL</span>
                      </div>
                    </div>
                  </div>

                  {/* Before Story */}
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1 rounded-full mb-3">
                      <span className="text-red-600 text-xs font-bold">THE PROBLEM</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      "I was spending <span className="text-gray-900 font-bold">$2,000 every month</span> on dental marketing agencies.
                      After 6 months, I had <span className="text-gray-900 font-bold">$12,000 spent</span> and
                      <span className="text-red-600 font-bold"> only 3 implant consultations</span>. Meanwhile, younger dentists were
                      getting all the attention on social media. I felt outdated..."
                    </p>
                  </div>
                </div>
              </div>

              {/* Video Section */}
              <div className="p-6 sm:p-8 bg-gray-50">
                <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 px-3 py-1 rounded-full mb-4">
                  <span className="text-teal-600 text-xs font-bold">HIS FIRST AI VIDEO</span>
                </div>

                <div className="relative rounded-xl overflow-hidden border-2 border-teal-500/40 shadow-2xl">
                  <Image
                    src="/images/dentist/review-5.webp"
                    alt="Dr. David Kim - AI Video Success"
                    width={1365}
                    height={768}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />

                  {/* Play Overlay - like Lucas video */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer group">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl shadow-teal-500/50 group-hover:scale-110 transition-transform">
                      <Play className="w-10 h-10 sm:w-12 sm:h-12 text-white fill-white ml-1" />
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/80 text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-teal-500/30">
                      ▶ Watch His First AI Video
                    </div>
                  </div>
                </div>

                <p className="text-gray-500 text-sm mt-3 text-center">
                  Created in <span className="text-teal-600 font-bold">7 minutes</span> • Posted on Instagram Reels • Day 1 of using the system
                </p>
              </div>

              {/* The Speed Stats */}
              <div className="p-6 sm:p-8 bg-white border-t border-gray-100">
                <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 px-3 py-1 rounded-full mb-4">
                  <span className="text-teal-600 text-xs font-bold">THE SPEED OF AI CONTENT</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { number: '48', label: 'Hours to First Lead', sub: 'not weeks' },
                    { number: '$0', label: 'Marketing Cost', sub: 'vs $2,000/mo before' },
                    { number: '5', label: 'Implant Cases', sub: 'from 1 week of videos' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-gradient-to-br from-teal-50 to-white border border-teal-500/30 rounded-xl p-4 text-center">
                      <div className="text-teal-500 text-4xl sm:text-5xl font-black mb-1">{stat.number}</div>
                      <div className="text-gray-900 font-bold text-sm">{stat.label}</div>
                      <div className="text-gray-500 text-xs">{stat.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline / Results */}
              <div className="p-4 sm:p-8 border-t border-gray-100 bg-gray-50">
                <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 px-3 py-1 rounded-full mb-4 sm:mb-6">
                  <span className="text-teal-600 text-xs font-bold">THE TIMELINE</span>
                </div>

                {/* Timeline - improved mobile layout */}
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { time: 'Day 1', event: 'Posted his first AI video about implant benefits (took 7 minutes)', icon: Upload, color: 'gray' },
                    { time: 'Day 2', event: 'Instagram inquiry: "I need implants, are you accepting patients?"', icon: MessageSquare, color: 'teal' },
                    { time: 'Day 5', event: '3 implant consultations scheduled', icon: Calendar, color: 'teal' },
                    { time: 'Week 2', event: '5 implant cases accepted • $47,000 in treatment plans', icon: FileText, color: 'teal' },
                    { time: 'Month 2', event: 'All 5 cases completed • Cancelled marketing agency', icon: DollarSign, color: 'green' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.color === 'green' ? 'bg-green-100 border border-green-300' :
                        item.color === 'teal' ? 'bg-teal-100 border border-teal-500/40' :
                        'bg-gray-100 border border-gray-300'
                      }`}>
                        <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          item.color === 'green' ? 'text-green-600' :
                          item.color === 'teal' ? 'text-teal-600' :
                          'text-gray-500'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`inline-block text-[10px] sm:text-xs font-black px-2 py-0.5 rounded mb-1 ${
                          item.color === 'green' ? 'bg-green-100 text-green-700' :
                          item.color === 'teal' ? 'bg-teal-100 text-teal-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>{item.time}</span>
                        <p className={`text-xs sm:text-sm leading-snug ${item.color === 'green' ? 'text-green-700 font-bold' : 'text-gray-700'}`}>{item.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Quote */}
              <div className="p-6 sm:p-8 bg-gradient-to-r from-teal-500/10 to-teal-50 border-t border-teal-500/20">
                <div className="flex items-start gap-4">
                  <div className="text-teal-500 text-4xl font-serif leading-none">"</div>
                  <div>
                    <p className="text-gray-800 text-lg sm:text-xl font-medium italic leading-relaxed mb-4">
                      One week of AI videos. <span className="text-teal-600 font-bold">$47,000 in implant cases</span>.
                      I spent $12,000 on marketing agencies and got 3 consultations. This system cost me $58 and
                      I had 5 cases in a week. The ROI is unreal.
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-teal-500">
                        <Image src="/images/dentist/review-5.webp" alt="Dr. David" width={40} height={40} className="object-cover" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-bold">Dr. David Kim</p>
                        <p className="text-gray-500 text-sm">2 months after joining</p>
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-teal-500 text-teal-500" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Stats Bar */}
              <div className="grid grid-cols-3 divide-x divide-gray-200 bg-white">
                {[
                  { value: '$58', label: 'Investment', sub: 'One-time' },
                  { value: '$47K', label: 'Revenue', sub: '2 weeks' },
                  { value: '810x', label: 'ROI', sub: 'Return' },
                ].map((stat, i) => (
                  <div key={i} className="p-4 sm:p-6 text-center">
                    <div className={`text-xl sm:text-2xl font-black mb-1 ${i === 1 ? 'text-green-600' : i === 2 ? 'text-teal-500' : 'text-gray-900'}`}>{stat.value}</div>
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
        className="py-10 sm:py-20 bg-gradient-to-b from-black via-slate-950 to-black"
      >
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className={`text-center mb-6 sm:mb-12 ${visibleSections.has('whats-inside') ? 'animate-fade-in-up' : ''}`}>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-4">
                Here's What You Get <span className="text-teal-400">Today</span>
              </h2>
              <p className="text-gray-400 text-sm sm:text-lg">Everything you need to start getting new patients with AI videos</p>
            </div>

            {/* PRODUCT #1 - THE MAIN COURSE */}
            <div className={`bg-gradient-to-br from-teal-500/15 to-teal-500/5 border-2 border-teal-500 rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-6 ${
              visibleSections.has('whats-inside') ? 'animate-fade-in-up animation-delay-200' : ''
            }`}>
              {/* Large Course Thumbnail */}
              <div className="relative w-full aspect-video">
                <Image
                  src="/images/dentist/course-demo.webp"
                  alt="CloneYourself 7-Minute Video System for Dentists"
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>

              {/* Course Details */}
              <div className="p-4 sm:p-8">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="bg-teal-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-black">MAIN TRAINING</span>
                  <span className="text-gray-400 line-through text-xs sm:text-sm">$497</span>
                  <span className="text-teal-400 font-black text-xs sm:text-base">INCLUDED</span>
                </div>

                <h3 className="text-xl sm:text-3xl font-black text-white mb-2 sm:mb-3">CloneYourself 7-Minute Video System</h3>
                <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed">
                  Even if you've never touched AI before — follow along and create your first talking video today.
                  No tech skills needed. I show you everything click-by-click.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                  {[
                    'Turn any photo into a talking AI video',
                    'Create your personal AI avatar that looks like you',
                    'Clone your voice so the AI speaks exactly like you',
                    'Put yourself anywhere — your office, treatment rooms, anywhere',
                    'All free tools included — zero monthly fees',
                    'Ready-to-use AI scriptwriter (writes viral scripts for you)',
                    'Every prompt you need — just copy & paste',
                    'Edit videos on your phone in minutes (no experience needed)',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm">
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BONUSES HEADER */}
            <div className={`text-center mb-4 sm:mb-6 ${visibleSections.has('whats-inside') ? 'animate-fade-in-up animation-delay-300' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/40 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full">
                <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
                <span className="text-teal-400 font-black text-sm sm:text-base">+ 10 BONUSES (${totalBonusValue} Value)</span>
              </div>
            </div>

            {/* ALL 10 BONUS PRODUCTS */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {allBonuses.map((bonus, index) => (
                <div key={bonus.id} className={`bg-gradient-to-br from-white/8 to-white/3 border border-teal-500/30 rounded-xl sm:rounded-2xl overflow-hidden hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 ${visibleSections.has('whats-inside') ? 'animate-fade-in-up' : ''}`}>
                  <div className="w-full aspect-[16/9] relative bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
                    <Image src={bonus.image || '/images/dentist/course-demo.webp'} alt={bonus.title} fill className="object-contain p-2" />
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <h4 className="text-white font-bold text-base sm:text-lg">{bonus.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 line-through text-sm sm:text-base font-semibold">${bonus.value}</span>
                        <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-xs sm:text-sm px-2.5 py-1 rounded-lg shadow-lg">FREE</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                      {bonus.description.substring(0, 150)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* EXTRA BONUSES - Support & Updates */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 ${visibleSections.has('whats-inside') ? 'animate-fade-in-up' : ''}`}>
              <div className="bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/30 rounded-xl p-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Direct Support</h4>
                    <p className="text-gray-400 text-sm">Email + chat support included</p>
                    <p className="text-teal-400 font-bold text-sm mt-1">$197 value — FREE</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/30 rounded-xl p-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Lifetime Updates</h4>
                    <p className="text-gray-400 text-sm">New tools & templates weekly</p>
                    <p className="text-teal-400 font-bold text-sm mt-1">$297 value — FREE</p>
                  </div>
                </div>
              </div>
            </div>

            {/* TOTAL VALUE + CTA - Compact on mobile */}
            <div className={`bg-gradient-to-br from-teal-500/20 to-black rounded-2xl border-2 border-teal-500 p-4 sm:p-8 ${
              visibleSections.has('whats-inside') ? 'animate-fade-in-up' : ''
            }`}>
              {/* Price Box - Compact */}
              <div className="bg-black/50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 text-center border border-teal-500/30">
                <p className="text-teal-400 font-bold text-sm sm:text-base mb-2">Get Everything Today For</p>
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1">
                  <span className="text-4xl sm:text-6xl font-black text-teal-400">$58</span>
                  <div className="text-left">
                    <span className="bg-red-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm font-black block">88% OFF</span>
                    <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5">One-time</p>
                  </div>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">Lifetime access • No hidden costs</p>
              </div>

              {/* CTA Button */}
              <div
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-4 sm:py-5 rounded-xl font-black text-base sm:text-xl shadow-xl flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                Get Instant Access Now
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              {/* Trust - Compact */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-gray-400 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400" />
                  <span>30-Day Guarantee</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400" />
                  <span>SSL Secured</span>
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
        className="py-8 sm:py-16 bg-black"
      >
        {/* Header */}
        <div className="max-w-6xl mx-auto px-3 sm:px-6 mb-6 sm:mb-10">
          <div className={`text-center ${visibleSections.has('testimonials') ? 'animate-fade-in-up' : ''}`}>
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 px-3 py-1.5 rounded-full mb-3">
              <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-teal-400 font-bold text-xs uppercase tracking-wide">Success Stories</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-4">
              Real Dentists. <span className="text-teal-400">Real Results.</span>
            </h2>
            <div className="flex items-center justify-center gap-3 sm:gap-6 text-gray-400 text-xs sm:text-base">
              <span><span className="text-teal-400 font-bold">500+</span> success stories</span>
              <span>•</span>
              <span><span className="text-teal-400 font-bold">20+</span> countries</span>
            </div>
          </div>
        </div>

        {/* Infinite Scroll Carousel with fade shadows */}
        <div className="testimonial-carousel-wrapper-dentist">
          <div className="testimonial-scroll-track-dentist">
            {/* First set of testimonials */}
            {testimonials.map((t) => (
              <div key={`first-${t.id}`} className="testimonial-card-dentist">
                {/* Quote Icon */}
                <div className="testimonial-quote-icon-dentist">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 8H6C4.89543 8 4 8.89543 4 10V14C4 15.1046 4.89543 16 6 16H8C9.10457 16 10 15.1046 10 14V8ZM10 8C10 5.79086 8.20914 4 6 4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M20 8H16C14.8954 8 14 8.89543 14 10V14C14 15.1046 14.8954 16 16 16H18C19.1046 16 20 15.1046 20 14V8ZM20 8C20 5.79086 18.2091 4 16 4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
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
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-teal-500/40 shadow-lg">
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
              <div key={`second-${t.id}`} className="testimonial-card-dentist">
                {/* Quote Icon */}
                <div className="testimonial-quote-icon-dentist">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 8H6C4.89543 8 4 8.89543 4 10V14C4 15.1046 4.89543 16 6 16H8C9.10457 16 10 15.1046 10 14V8ZM10 8C10 5.79086 8.20914 4 6 4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M20 8H16C14.8954 8 14 8.89543 14 10V14C14 15.1046 14.8954 16 16 16H18C19.1046 16 20 15.1046 20 14V8ZM20 8C20 5.79086 18.2091 4 16 4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
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
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-teal-500/40 shadow-lg">
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
            <div className={`bg-gradient-to-br from-teal-500/10 to-white border-2 border-teal-500/40 rounded-xl sm:rounded-2xl p-5 sm:p-10 ${
              visibleSections.has('guarantee1') ? 'animate-fade-in-up' : ''
            }`}>
              <div className="text-center mb-5 sm:mb-8">
                <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/40 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />
                  <span className="text-teal-600 font-bold text-xs sm:text-sm uppercase">Iron-Clad Guarantee</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-2">
                  30-Day Money Back + <span className="text-teal-500">$50 Cash</span>
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">You literally cannot lose.</p>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-8">
                {/* Guarantee Badge - Instantly Recognizable */}
                <div className="relative flex-shrink-0">
                  {/* Modern Guarantee Seal */}
                  <div className="w-28 h-28 sm:w-40 sm:h-40 relative">
                    {/* Outer rotating ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-dashed border-teal-500/40 animate-spin-slow" />
                    {/* Main badge */}
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-teal-500 via-cyan-500 to-teal-500 shadow-2xl shadow-teal-500/30 flex flex-col items-center justify-center">
                      {/* Inner circle with text */}
                      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center text-center p-2">
                        <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-teal-400 mb-1" />
                        <span className="text-teal-400 font-black text-lg sm:text-2xl leading-none">30</span>
                        <span className="text-white font-bold text-[8px] sm:text-xs uppercase tracking-wider">Day Money</span>
                        <span className="text-white font-bold text-[8px] sm:text-xs uppercase tracking-wider">Back</span>
                        <span className="text-teal-400 font-black text-[10px] sm:text-sm mt-0.5">+$50</span>
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
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-teal-500 flex-shrink-0 bg-teal-500 flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <p className="text-teal-600 font-bold text-sm sm:text-lg">— CloneYourself Team</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 sm:mt-8">
                {[
                  { icon: CheckCircle, title: 'Full Refund', desc: 'Every penny back' },
                  { icon: DollarSign, title: '+$50 Cash', desc: 'For your time' },
                  { icon: Clock, title: '30 Days', desc: 'To try everything' },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 sm:p-4 text-center border border-teal-500/20 shadow-lg">
                    <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-teal-500 mx-auto mb-1.5 sm:mb-2" />
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
        className="py-10 sm:py-20 bg-black scroll-mt-16"
      >
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className={`text-center mb-6 sm:mb-10 ${visibleSections.has('pricing') ? 'animate-fade-in-up' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-full mb-3 sm:mb-4 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
                <span className="text-red-400 font-bold text-xs sm:text-sm">Only {spotsLeft} spots left at this price</span>
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
                <div className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl p-4 sm:p-6 border-2 border-white/20 relative shadow-xl sm:scale-105 flex-shrink-0 w-[200px] sm:w-auto">
                  <div className="absolute -top-2 sm:-top-3 right-3 sm:right-4 bg-black text-teal-400 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-black">
                    Best Value
                  </div>
                  <div className="flex items-center gap-2 mb-3 sm:mb-4 mt-1">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    <h3 className="font-bold text-white text-sm sm:text-base">CloneYourself AI</h3>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white mb-1 sm:mb-2">$58<span className="text-sm sm:text-lg text-white/70"> one-time</span></div>
                  <p className="text-white/70 text-xs sm:text-sm">Unlimited videos forever</p>
                </div>
              </div>
            </div>

            {/* Main Price Box - Compact on mobile */}
            <div className={`bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-5 sm:p-10 text-center border-2 border-teal-500/50 shadow-2xl ${
              visibleSections.has('pricing') ? 'animate-fade-in-up animation-delay-400' : ''
            }`}>
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                <span className="text-4xl sm:text-6xl font-black text-teal-400">$58</span>
                <div className="text-left">
                  <span className="bg-red-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm font-black">88% OFF</span>
                  <p className="text-gray-400 text-[10px] sm:text-sm mt-0.5">One-time</p>
                </div>
              </div>
              <p className="text-teal-400 font-bold text-xs sm:text-base mb-4 sm:mb-6">Lifetime access • No monthly fees</p>

              <div
                className="w-full max-w-md mx-auto bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 text-white py-3.5 sm:py-5 rounded-xl font-black text-base sm:text-xl shadow-xl flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                Get Instant Access Now
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4 sm:mt-6 text-gray-400 text-[10px] sm:text-sm">
                <div className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-teal-400" />
                  <span>30-Day Guarantee</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-teal-400" />
                  <span>SSL Secured</span>
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
                Common <span className="text-teal-500">Questions</span>
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
                    <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-teal-500 flex-shrink-0 transition-transform ${expandedFaq === i ? 'rotate-180' : ''}`} />
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
          9. GUARANTEE #2 - BLACK SECTION
          ================================================================ */}
      <section
        id="guarantee2"
        data-animate
        className="py-10 sm:py-20 bg-black"
      >
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className={`bg-gradient-to-br from-white/10 to-white/5 border-2 border-teal-500/40 rounded-xl sm:rounded-2xl p-5 sm:p-10 ${
              visibleSections.has('guarantee2') ? 'animate-fade-in-up' : ''
            }`}>
              <div className="text-center mb-5 sm:mb-8">
                {/* Modern Guarantee Badge - Instantly Recognizable */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6 relative">
                  {/* Outer rotating ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-dashed border-teal-500/40 animate-spin-slow" />
                  {/* Main badge */}
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-teal-500 via-cyan-500 to-teal-500 shadow-2xl shadow-teal-500/40 flex flex-col items-center justify-center">
                    {/* Inner circle with text */}
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center text-center p-1">
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400 mb-0.5" />
                      <span className="text-teal-400 font-black text-base sm:text-xl leading-none">30</span>
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
                    desc: 'Keep everything and start getting new patients with AI videos.',
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
                  <div key={i} className="bg-black/50 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center border border-teal-500/20">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto rounded-full flex items-center justify-center mb-2 sm:mb-4 bg-teal-500/20">
                      <item.icon className="w-5 h-5 sm:w-7 sm:h-7 text-teal-400" />
                    </div>
                    <h3 className="font-black text-white text-base sm:text-lg mb-1 sm:mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <p className="text-teal-400 font-bold text-sm sm:text-lg">
                  You literally have NOTHING to lose and everything to gain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          10. MEET YOUR INSTRUCTOR - WHITE SECTION (matches Sara)
          ================================================================ */}
      <section
        id="meet-instructor"
        data-animate
        className="py-10 sm:py-20 bg-white"
      >
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className={`text-center mb-6 sm:mb-10 ${visibleSections.has('meet-instructor') ? 'animate-fade-in-up' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 px-3 py-1.5 rounded-full mb-3">
                <Award className="w-3.5 h-3.5 text-teal-500" />
                <span className="text-teal-600 font-bold text-xs uppercase tracking-wide">Meet Your Instructor</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-2 sm:mb-4">
                Who Am I & <span className="text-teal-500">Why Should You Listen?</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 items-center">
              {/* Instructor Image */}
              <div className={`relative ${visibleSections.has('meet-instructor') ? 'animate-fade-in-up animation-delay-200' : ''}`}>
                <div className="relative aspect-[3/4] max-w-[200px] sm:max-w-sm mx-auto rounded-xl sm:rounded-2xl overflow-hidden border-3 sm:border-4 border-teal-500/50 shadow-2xl">
                  <Image
                    src="/images/dentist/dr-marcus.webp"
                    alt="Dr. Marcus Chen"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-teal-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-bold text-xs sm:text-sm">
                    ✦ Verified
                  </div>
                </div>
              </div>

              {/* Instructor Story */}
              <div className={`space-y-4 sm:space-y-6 ${visibleSections.has('meet-instructor') ? 'animate-fade-in-up animation-delay-300' : ''}`}>
                <div>
                  <h3 className="text-teal-500 font-black text-lg sm:text-xl mb-2 sm:mb-3">I Was You</h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    15 years running a successful practice. $2M+ in annual revenue. But I was exhausted.
                    Creating content felt like a second job. I looked for a better way.
                  </p>
                </div>

                <div>
                  <h3 className="text-teal-500 font-black text-lg sm:text-xl mb-2 sm:mb-3">Then I Found AI Video</h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    One photo. 50 videos. In minutes. My social media exploded. More patients. More revenue.
                    More referrals. All while working LESS.
                  </p>
                </div>

                <div>
                  <h3 className="text-teal-500 font-black text-lg sm:text-xl mb-2 sm:mb-3">Now I'm Sharing Everything</h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    500+ dentists have joined. The results speak for themselves. This isn't theory —
                    it's the exact system I use daily.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-2 sm:gap-3 pt-4 sm:pt-6">
                  {[
                    { value: '$2M+', label: 'Annual Revenue' },
                    { value: '15 Years', label: 'Experience' },
                    { value: '500+', label: 'Dentists Helped' },
                    { value: '4.9/5', label: 'Avg Rating' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-4 text-center border border-gray-200">
                      <div className="text-teal-500 font-black text-sm sm:text-xl">{stat.value}</div>
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
          11. FINAL CTA - TEAL SECTION
          ================================================================ */}
      <section
        id="final-cta"
        data-animate
        className="py-10 sm:py-24 bg-gradient-to-br from-teal-500 via-cyan-500 to-teal-500"
      >
        <div className="w-full px-3 sm:px-6">
          <div className={`max-w-xl mx-auto text-center ${visibleSections.has('final-cta') ? 'animate-fade-in-up' : ''}`}>
            <h2 className="text-xl sm:text-4xl font-black text-white mb-2 sm:mb-4">
              Ready to Get More Patients?
            </h2>
            <p className="text-white/80 text-xs sm:text-lg mb-4 sm:mb-8">
              Join 500+ dentists using AI videos to fill their schedules
            </p>

            <div className="bg-black rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-2xl mb-3 sm:mb-6">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                <span className="text-2xl sm:text-5xl font-black text-teal-400">$58</span>
                <span className="bg-red-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm font-black">88% OFF</span>
              </div>

              <div
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3.5 sm:py-5 rounded-xl font-black text-base sm:text-xl flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                Get Instant Access Now
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

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
      <footer className="py-6 sm:py-10 bg-black border-t border-gray-900">
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-8 mb-3 sm:mb-6 text-gray-500 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-teal-400" />
                <span>500+ Dentists</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-teal-400" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-teal-400" />
                <span>Instant Access</span>
              </div>
            </div>
            <p className="text-gray-700 text-xs sm:text-sm mb-3">
              © {new Date().getFullYear()} CloneYourself. All rights reserved.
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
        /* Dentist-specific background gradient */
        .bg-animated-gradient-dentist {
          background: linear-gradient(135deg, #000000 0%, #0f172a 50%, #000000 100%);
        }

        .bg-particles-dentist {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          opacity: 0.3;
          background-image: radial-gradient(circle at 2px 2px, rgba(20, 184, 166, 0.15) 1px, transparent 0);
          background-size: 50px 50px;
        }

        /* Testimonial carousel styles for dentist */
        .testimonial-carousel-wrapper-dentist {
          position: relative;
          overflow: hidden;
          width: 100%;
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }

        .testimonial-scroll-track-dentist {
          display: flex;
          gap: 1rem;
          animation: scroll-dentist 40s linear infinite;
          width: fit-content;
        }

        .testimonial-card-dentist {
          flex-shrink: 0;
          width: 300px;
          background: linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%);
          border: 1px solid rgba(20, 184, 166, 0.2);
          border-radius: 1rem;
          padding: 1.5rem;
          position: relative;
        }

        .testimonial-quote-icon-dentist {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 24px;
          height: 24px;
          opacity: 0.3;
        }

        @keyframes scroll-dentist {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

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

        /* Slow spin for guarantee badge */
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        /* Respect user motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up,
          .animate-scale-up,
          .animate-scale-in,
          .testimonial-scroll-track-dentist {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </main>
  )
}
