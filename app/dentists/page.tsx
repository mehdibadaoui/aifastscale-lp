'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
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
  VolumeX,
  Eye,
  Heart,
  ThumbsUp,
  RefreshCw,
  MessageSquare,
  Calendar,
  CalendarCheck,
  FileText,
  Stethoscope,
  Phone,
  Mail,
  Send,
  Smile,
} from 'lucide-react'
import { DENTIST_BONUS_PRODUCTS, getDentistTotalBonusValue } from '../config/dentist-bonus-products'
import { getMemberStats } from './members/components/config'
import { ExpertPersona, ExpertMention, DR_VOSS_DATA } from '../components/ExpertPersona'
const AnimatedBackground = dynamic(() => import('../components/AnimatedBackground').then(mod => ({ default: mod.AnimatedBackground })), { ssr: false })

// Checkout link placeholder
const CHECKOUT_LINK = '/dentists/checkout'

export default function DentistCleanLandingPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(true)
  // Dynamic member stats
  const [memberStats, setMemberStats] = useState(getMemberStats())
  const videoRef = useRef<HTMLVideoElement>(null)

  // Animation refs for scroll detection - initialize with hero visible for instant animation
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['hero']))

  // Update member stats every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setMemberStats(getMemberStats())
    }, 60000)
    return () => clearInterval(interval)
  }, [])


  const faqs = [
    {
      q: 'Does this really take only 7 minutes?',
      a: 'Yes. Upload photo (1 min), type script (2 min), AI generates (4 min). Done. Zero editing needed. I timed it myself.',
    },
    {
      q: 'Will patients know it\'s AI?',
      a: `Most can't tell. The lip-sync is incredibly realistic. Your patients care about your message and expertise, not how you made it. ${memberStats.totalMembers.toLocaleString()}+ dentists are already using this successfully.`,
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
      a: `Yes. ${memberStats.totalMembers.toLocaleString()}+ dentists across the US, UK, Canada, and Australia use this daily. Works for general dentistry, cosmetic, ortho, and all specialties.`,
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
      { threshold: 0, rootMargin: '100px 0px 600px 0px' } // Trigger 600px before entering viewport to prevent blank sections on fast mobile scroll
    )

    const animatedElements = document.querySelectorAll('[data-animate]')
    animatedElements.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
    }
  }, [])

  // Countdown timer - REAL deadline: December 20th for Premium Bundle bonus
  const BONUS_DEADLINE = new Date('2024-12-20T23:59:59')

  useEffect(() => {
    const calculateTimeLeft = () => {
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
    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  // REMOVED: Fake scarcity that resets - kills trust
  // Real urgency comes from the December 20th bonus deadline
  // Note: viewersNow replaced by memberStats.activeNow

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
    <main className="min-h-screen bg-gradient-premium noise-overlay font-sans relative">
      {/* Animated Background - Performance Optimized */}
      <AnimatedBackground variant="dentist" />

      {/* ================================================================
          1. HERO SECTION - PREMIUM ANIMATED GRADIENT
          ================================================================ */}
      <section
        id="hero"
        data-animate
        className="relative bg-gradient-hero text-white py-8 sm:py-16 md:py-20 overflow-hidden section-premium"
      >
        {/* Premium animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-cyan-500/5 animate-gradient-xy" style={{ backgroundSize: '400% 400%' }} />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(20, 184, 166, 0.5) 1px, transparent 0)',
            backgroundSize: '48px 48px'
          }} />
        </div>

        {/* Premium floating orbs */}
        <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-br from-teal-500/10 to-cyan-500/5 rounded-full blur-3xl floating-slow" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-gradient-to-br from-cyan-500/8 to-teal-500/5 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/3 rounded-full blur-3xl" />

        <div className="w-full px-4 sm:px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Main Headline - PREMIUM TYPOGRAPHY */}
            <h1 className={`font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-5 sm:mb-8 leading-[1.05] tracking-tight ${visibleSections.has('hero') ? 'animate-fade-in-up' : ''}`}>
              <span className="text-white drop-shadow-lg">Turn Any Photo Into a</span>
              <br />
              <span className="relative inline-block">
                <span className="text-gradient-premium drop-shadow-2xl">
                  Talking AI Video
                </span>
                {/* Glow effect */}
                <span className="absolute inset-0 text-gradient-premium blur-2xl opacity-50 -z-10">
                  Talking AI Video
                </span>
              </span>
              <br />
              <span className="text-white drop-shadow-lg">&</span>
              <span className="text-gradient-premium">
                {' '}Get 100+ New Patients
              </span>
            </h1>

            {/* Subtitle - Larger & More Visible */}
            <p className={`text-base sm:text-xl md:text-2xl text-gray-300 mb-4 sm:mb-5 max-w-2xl mx-auto font-medium ${visibleSections.has('hero') ? 'animate-fade-in-up animation-delay-200' : ''}`}>
              Even if you've never edited a video in your life —
              <br className="hidden sm:block" />
              <span className="text-white font-semibold">all you need is your phone</span>
            </p>

            {/* Expert Trust Line - Premium Badge */}
            <div className={`mb-5 sm:mb-8 ${visibleSections.has('hero') ? 'animate-fade-in-up animation-delay-250' : ''}`}>
              <div className="inline-flex items-center gap-2 badge-premium badge-glow">
                <Award className="w-4 h-4 text-teal-400" />
                <span className="text-gray-300 text-xs sm:text-sm">Clinically-inspired framework by</span>
                <span className="text-teal-300 font-semibold text-xs sm:text-sm">Dr. Alexander Voss, DDS, MClinDent</span>
              </div>
            </div>

            {/* Hero Image - Premium Glass Container */}
            <div className={`relative max-w-5xl mx-auto mb-4 sm:mb-6 ${visibleSections.has('hero') ? 'animate-fade-in-up animation-delay-300' : ''}`}>
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden glass-premium shadow-premium-lg hover-lift">
                <Image
                  src="/images/dentist/dentist-vdc-hero.webp"
                  alt="AI Video System for Dentists Showcase"
                  width={1365}
                  height={768}
                  className="w-full h-auto"
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              </div>
            </div>

            {/* Trust badges - Premium Glass Cards */}
            <div className={`flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 ${visibleSections.has('hero') ? 'animate-fade-in-up animation-delay-400' : ''}`}>
              <div className="flex items-center gap-2 glass-teal px-4 py-2.5 rounded-full">
                <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
                <span className="text-gray-300 text-xs sm:text-sm"><span className="text-white font-bold">{memberStats.totalMembers.toLocaleString()}+</span> dentists</span>
              </div>
              <div className="flex items-center gap-2 glass-teal px-4 py-2.5 rounded-full">
                <div className="relative">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                </div>
                <span className="text-gray-300 text-xs sm:text-sm"><span className="text-emerald-400 font-bold">{memberStats.activeNow.toLocaleString()}</span> active now</span>
              </div>
              <div className="flex items-center gap-1.5 glass-teal px-4 py-2.5 rounded-full">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-teal-400 text-teal-400" />
                ))}
                <span className="ml-1 text-white font-bold text-xs sm:text-sm">4.9/5</span>
              </div>
              <div className="flex items-center gap-2 glass-teal px-4 py-2.5 rounded-full">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
                <span className="text-gray-300 text-xs sm:text-sm">30-Day Guarantee</span>
              </div>
            </div>

            {/* CTA - Premium Button with Glow */}
            <a
              href={CHECKOUT_LINK}
              className={`group relative inline-flex items-center justify-center btn-premium text-white px-8 sm:px-14 py-4 sm:py-5 rounded-2xl font-black text-base sm:text-xl shadow-glow-teal animate-pulse-glow ${visibleSections.has('hero') ? 'animate-fade-in-up animation-delay-500' : ''}`}
            >
              <span className="relative flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap">
                <span className="sm:hidden">Get Instant Access</span>
                <span className="hidden sm:inline">Start Creating AI Videos</span>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>

            {/* PRICE TEASER - Premium Glass Style */}
            <div className={`mt-5 sm:mt-6 flex flex-col items-center gap-3 ${visibleSections.has('hero') ? 'animate-fade-in-up animation-delay-600' : ''}`}>
              <div className="flex items-center gap-3 sm:gap-4 glass-premium px-6 py-3 rounded-2xl">
                <span className="text-gray-500 text-sm line-through">${getDentistTotalBonusValue() + 47}</span>
                <span className="text-gradient-premium font-black text-2xl sm:text-3xl">$47.82</span>
                <span className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">98% OFF</span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm font-medium">One-time payment • Lifetime access • 30-day guarantee</p>
              <p className="text-gray-500 text-[10px] sm:text-xs mt-1">Must be 18+ years old to purchase</p>
            </div>

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
          2. CASE STUDY #1 - DR. SARAH - LIGHT CREAM SECTION (Alternating)
          "She booked 23 new patients in 3 weeks"
          ================================================================ */}
      <section
        id="case-study"
        data-animate
        className="py-10 sm:py-24 bg-gradient-to-br from-stone-100 via-white to-stone-50 relative overflow-hidden"
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(20, 184, 166, 0.15) 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Section Header - Attention Grabbing */}
            <div className={`text-center mb-8 sm:mb-12 relative z-10 ${visibleSections.has('case-study') ? 'animate-fade-in-up' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/40 px-4 py-2 rounded-full mb-4">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                <span className="text-teal-700 font-bold text-xs uppercase tracking-wide">Real Results • Real Dentist</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-3 sm:mb-4 leading-tight">
                This is Dr. Marcus. He Got <span className="text-teal-600">31 New Patients</span>...
              </h2>
              <p className="text-xl sm:text-2xl text-gray-700 font-bold">Without Recording a Single Video.</p>
            </div>

            {/* Dr. Marcus Case Study Card - Premium Modern Design */}
            <div className={`relative bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-teal-500/20 rounded-2xl sm:rounded-3xl overflow-hidden ${visibleSections.has('case-study') ? 'animate-fade-in-up animation-delay-200' : ''}`}>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-teal-500/5 pointer-events-none" />

              {/* Hero Section - Big Visual */}
              <div className="relative p-4 sm:p-8">
                {/* The Hook Text */}
                <div className="text-center mb-6">
                  <p className="text-gray-400 text-sm sm:text-base mb-2">Yes, even if you see him talking on camera...</p>
                  <p className="text-white text-2xl sm:text-3xl font-black mb-3 leading-tight">
                    He Never Filmed Anything.
                  </p>
                  <p className="text-teal-400 text-base sm:text-lg font-medium">
                    He just uploaded his photo, and the AI created a ready-to-post video for him.
                  </p>
                </div>

                {/* Video - Autoplay, Loop, Muted - Mobile-optimized (183KB) - preload="none" for faster LCP */}
                <div className="relative w-full rounded-2xl overflow-hidden border-2 border-teal-500/30 shadow-2xl shadow-teal-500/10 bg-black aspect-square max-w-md mx-auto">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    className="w-full h-full object-cover"
                    src="/videos/dentist-case-study-mobile.mp4"
                  />
                </div>

                {/* Verified Badge */}
                <div className="flex justify-center mt-4">
                  <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 px-4 py-2 rounded-full">
                    <Check className="w-4 h-4 text-teal-400" />
                    <span className="text-white text-sm font-medium">Real dentist • Verified results</span>
                  </div>
                </div>
              </div>

              {/* Results Strip */}
              <div className="bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-teal-500/20 border-y border-teal-500/30 py-4 px-4 sm:px-8">
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { number: '31', label: 'New Patients', sub: 'in 4 weeks' },
                    { number: '7', label: 'Minutes', sub: 'per video' },
                    { number: '$0', label: 'Ad Spend', sub: 'organic only' },
                  ].map((stat, i) => (
                    <div key={i}>
                      <div className="text-teal-400 text-2xl sm:text-4xl font-black">{stat.number}</div>
                      <div className="text-white text-xs sm:text-sm font-bold">{stat.label}</div>
                      <div className="text-gray-500 text-[10px] sm:text-xs">{stat.sub}</div>
                    </div>
                  ))}
                </div>
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
                    { time: 'Day 1', event: 'Created his first AI video (took 7 minutes)', icon: Upload, color: 'gray' },
                    { time: 'Day 2', event: 'Posted on Instagram & TikTok', icon: Eye, color: 'gray' },
                    { time: 'Week 1', event: '8 new patient calls from social media', icon: Phone, color: 'teal' },
                    { time: 'Week 2', event: '14 more inquiries • 11 appointments booked', icon: Calendar, color: 'teal' },
                    { time: 'Week 4', event: '31 total new patients • Hygiene fully booked', icon: FileText, color: 'teal' },
                    { time: 'Month 2', event: '$62,000 in new patient revenue', icon: DollarSign, color: 'green' },
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
                      I was skeptical at first. <span className="text-teal-400 font-bold">31 new patients in 4 weeks</span> changed my mind.
                      No filming. No editing. Just results.
                      Best $47.82 I ever spent on my practice.
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-teal-400">
                        <Image src="/images/dentist/dr-marcus.webp" alt="Dr. Marcus" width={40} height={40} className="object-cover" loading="lazy" />
                      </div>
                      <div>
                        <p className="text-white font-bold">Dr. Marcus Bennett</p>
                        <p className="text-gray-400 text-sm">General Dentist, Austin TX</p>
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
                  { value: '$47.82', label: 'Investment', sub: 'One-time' },
                  { value: '31', label: 'New Patients', sub: '4 weeks' },
                  { value: '$62K', label: 'Revenue', sub: '2 months' },
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

          {/* FTC Disclaimer after Case Study */}
          <p className="text-center text-gray-500 text-xs italic mt-6 max-w-2xl mx-auto px-4 py-3 border-l-2 border-gray-300 bg-gray-100/50">
            *RESULTS NOT TYPICAL: This testimonial represents an individual&apos;s experience. Income and results vary significantly based on effort, market conditions, skills, and circumstances. We do not guarantee any specific results. <a href="/disclaimer" className="text-teal-600 hover:text-teal-700 underline">See full disclaimer</a>.
          </p>

          {/* ========== TWO MORE CASE STUDIES - SIDE BY SIDE ========== */}
          <div className="max-w-6xl mx-auto mt-10 sm:mt-16">
            <div className={`text-center mb-8 sm:mb-12 relative z-10 ${visibleSections.has('case-study') ? 'animate-fade-in-up' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/40 px-4 py-2 rounded-full mb-4">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                <span className="text-teal-700 font-bold text-xs uppercase tracking-wide">Documented Results • Verified Dentists</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-3 sm:mb-4 leading-tight">
                The Economics of <span className="text-teal-600">Zero-Effort Content</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600">Two dentists. Zero hours of filming. Measurable patient increases.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

              {/* CASE STUDY 2: Dr. Sarah Chen - Cosmetic Dentistry */}
              <div className={`relative bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-teal-500/20 rounded-2xl sm:rounded-3xl overflow-hidden ${visibleSections.has('case-study') ? 'animate-scale-in animation-delay-200' : ''}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-teal-500/5 pointer-events-none" />

                <div className="relative p-4 sm:p-6">
                  <div className="text-center mb-4">
                    <p className="text-gray-400 text-xs sm:text-sm mb-1">This is him presenting. Here&apos;s the critical detail:</p>
                    <p className="text-white text-lg sm:text-xl font-black leading-tight">
                      Zero Camera Time. Zero Studio Costs.
                    </p>
                  </div>

                  <div className="relative w-full rounded-xl overflow-hidden border-2 border-teal-500/30 shadow-xl bg-black aspect-[4/3] max-w-[400px] mx-auto">
                    <video autoPlay loop muted playsInline preload="none" className="w-full h-full object-contain">
                      <source src="/videos/lawyer/case-study-1.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-white text-[10px] font-medium">AI Generated</span>
                    </div>
                  </div>

                  <p className="text-teal-400 text-xs sm:text-sm font-medium text-center mt-3">
                    Input: One headshot. Output: 12 veneer consultations within the first week.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-teal-500/20 border-y border-teal-500/30 py-3 px-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-teal-400 text-xl sm:text-2xl font-black">22+</div>
                      <div className="text-white text-[10px] sm:text-xs font-bold">New Patients*</div>
                      <div className="text-gray-500 text-[9px]">first 5 weeks</div>
                    </div>
                    <div>
                      <div className="text-teal-400 text-xl sm:text-2xl font-black">7</div>
                      <div className="text-white text-[10px] sm:text-xs font-bold">Minutes</div>
                      <div className="text-gray-500 text-[9px]">production time</div>
                    </div>
                    <div>
                      <div className="text-teal-400 text-xl sm:text-2xl font-black">$0</div>
                      <div className="text-white text-[10px] sm:text-xs font-bold">Paid Media</div>
                      <div className="text-gray-500 text-[9px]">organic only</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 border-t border-white/10">
                  <div className="text-center mb-3">
                    <span className="text-teal-400 text-[10px] sm:text-xs font-bold bg-teal-500/10 border border-teal-500/30 px-2 py-1 rounded-full">DOCUMENTED PROGRESSION</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { time: 'Day 1', event: 'Generated AI video: "What veneers actually cost in 2026"', color: 'gray' },
                      { time: 'Day 3', event: 'Distributed via Instagram Reels and TikTok', color: 'gray' },
                      { time: 'Week 1', event: 'Strong organic reach • 12 veneer consultation requests*', color: 'gold' },
                      { time: 'Week 3', event: 'Multiple cosmetic cases booked • Revenue growing*', color: 'gold' },
                      { time: 'Week 5', event: 'Significant cosmetic revenue • Booked 3 weeks out*', color: 'green' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className={`text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded ${
                          item.color === 'green' ? 'bg-green-500/20 text-green-400' :
                          item.color === 'gold' ? 'bg-teal-500/20 text-teal-400' :
                          'bg-white/10 text-gray-400'
                        }`}>{item.time}</span>
                        <p className={`text-[10px] sm:text-xs ${item.color === 'green' ? 'text-green-400 font-bold' : 'text-gray-300'}`}>{item.event}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-500/10 to-teal-500/5 border-t border-teal-500/30">
                  <p className="text-white text-sm sm:text-base italic leading-relaxed mb-3">
                    &quot;I spent thousands on Google Ads with mediocre results. One AI video about veneers brought in <span className="text-teal-400 font-bold">more consultations in a week than ads did in a month</span>. Patients come in already wanting the procedure.*&quot;
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                      <span className="text-white font-bold text-xs">SC</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Dr. Sarah Chen, DDS</p>
                      <p className="text-gray-400 text-xs">Cosmetic Dentistry • San Diego, CA</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-teal-400 text-teal-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CASE STUDY 3: Dr. Ryan Mitchell - Family Dentistry */}
              <div className={`relative bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-teal-500/20 rounded-2xl sm:rounded-3xl overflow-hidden ${visibleSections.has('case-study') ? 'animate-scale-in animation-delay-400' : ''}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-teal-500/5 pointer-events-none" />

                <div className="relative p-4 sm:p-6">
                  <div className="text-center mb-4">
                    <p className="text-gray-400 text-xs sm:text-sm mb-1">This content reached 180K views. The key detail:</p>
                    <p className="text-white text-lg sm:text-xl font-black leading-tight">
                      He Was With a Patient When It Went Viral.
                    </p>
                  </div>

                  <div className="relative w-full rounded-xl overflow-hidden border-2 border-teal-500/30 shadow-xl bg-black aspect-[4/3] max-w-[400px] mx-auto">
                    <video autoPlay loop muted playsInline preload="none" className="w-full h-full object-contain">
                      <source src="/videos/lawyer/case-study-2.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-white text-[10px] font-medium">AI Generated</span>
                    </div>
                  </div>

                  <p className="text-teal-400 text-xs sm:text-sm font-medium text-center mt-3">
                    Posted Friday evening. Monday morning: 18 missed calls from new patients.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-teal-500/20 border-y border-teal-500/30 py-3 px-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-teal-400 text-xl sm:text-2xl font-black">27+</div>
                      <div className="text-white text-[10px] sm:text-xs font-bold">New Patients*</div>
                      <div className="text-gray-500 text-[9px]">first 6 weeks</div>
                    </div>
                    <div>
                      <div className="text-teal-400 text-xl sm:text-2xl font-black">Full</div>
                      <div className="text-white text-[10px] sm:text-xs font-bold">Schedule*</div>
                      <div className="text-gray-500 text-[9px]">booked solid</div>
                    </div>
                    <div>
                      <div className="text-teal-400 text-xl sm:text-2xl font-black">$0</div>
                      <div className="text-white text-[10px] sm:text-xs font-bold">Paid Media</div>
                      <div className="text-gray-500 text-[9px]">organic only</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 border-t border-white/10">
                  <div className="text-center mb-3">
                    <span className="text-teal-400 text-[10px] sm:text-xs font-bold bg-teal-500/10 border border-teal-500/30 px-2 py-1 rounded-full">DOCUMENTED PROGRESSION</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { time: 'Day 1', event: 'Generated AI video: "Why your dentist wants you to floss differently"', color: 'gray' },
                      { time: 'Day 2', event: 'Published to TikTok — total effort: 7 minutes', color: 'gray' },
                      { time: 'Week 1', event: 'Strong organic reach • Multiple new patient calls*', color: 'gold' },
                      { time: 'Week 3', event: 'Hygiene schedule fully booked • Hired new hygienist*', color: 'gold' },
                      { time: 'Week 6', event: 'Significant new patient revenue • Expanded hours*', color: 'green' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className={`text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded ${
                          item.color === 'green' ? 'bg-green-500/20 text-green-400' :
                          item.color === 'gold' ? 'bg-teal-500/20 text-teal-400' :
                          'bg-white/10 text-gray-400'
                        }`}>{item.time}</span>
                        <p className={`text-[10px] sm:text-xs ${item.color === 'green' ? 'text-green-400 font-bold' : 'text-gray-300'}`}>{item.event}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-500/10 to-teal-500/5 border-t border-teal-500/30">
                  <p className="text-white text-sm sm:text-base italic leading-relaxed mb-3">
                    &quot;I was doing root canals when my receptionist said the phone wouldn&apos;t stop ringing. My AI video about flossing went viral. <span className="text-teal-400 font-bold">We had to hire another hygienist</span> just to handle the new patient volume.*&quot;
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                      <span className="text-white font-bold text-xs">RM</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Dr. Ryan Mitchell, DMD</p>
                      <p className="text-gray-400 text-xs">Family Dentistry • Denver, CO</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-teal-400 text-teal-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* AI Disclosure */}
            <div className="text-center mt-6">
              <p className="text-gray-500 text-[10px] sm:text-xs flex items-center justify-center gap-2">
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-1.5 py-0.5 rounded text-[9px] font-bold">AI</span>
                Video demonstrations created using AI video generation—the same technology taught in this course.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          3. WHAT'S INSIDE - BLACK SECTION (Product Showcase)
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
                  src="/images/dentist/course-demo-new.webp"
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

                {/* Expert credibility line */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-gray-400 text-xs sm:text-sm flex items-center gap-2">
                    <Award className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <span>Clinically-structured lessons and examples created with input from <span className="text-teal-400 font-medium">Dr. Alexander Voss</span>, Aesthetic and Restorative Dentist</span>
                  </p>
                </div>
              </div>
            </div>

            {/* BONUSES HEADER */}
            <div className={`text-center mb-4 sm:mb-6 ${visibleSections.has('whats-inside') ? 'animate-fade-in-up animation-delay-300' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/40 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full">
                <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
                <span className="text-teal-400 font-black text-sm sm:text-base">+ 12 BONUSES (${totalBonusValue} Value)</span>
              </div>
            </div>

            {/* ALL 12 BONUS PRODUCTS */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {allBonuses.map((bonus, index) => (
                <div key={bonus.id} className={`bg-gradient-to-br from-white/8 to-white/3 border border-teal-500/30 rounded-xl sm:rounded-2xl overflow-hidden hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 ${visibleSections.has('whats-inside') ? 'animate-fade-in-up' : ''}`}>
                  <div className="w-full aspect-[16/9] relative bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
                    <Image src={bonus.image || '/images/dentist/course-demo.webp'} alt={bonus.title} fill className="object-contain p-2" loading="lazy" />
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
                  <span className="text-4xl sm:text-6xl font-black text-teal-400">$47.82</span>
                  <div className="text-left">
                    <span className="bg-red-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm font-black block">98% OFF</span>
                    <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5">One-time</p>
                  </div>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">Lifetime access • No hidden costs</p>
              </div>

              {/* CTA Button */}
              <Link
                  href={CHECKOUT_LINK}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-4 sm:py-5 rounded-xl font-black text-base sm:text-xl shadow-xl flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4 hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                Get Instant Access Now
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>

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

            {/* What Happens After - Hormozi Style */}
            <div className={`mt-6 sm:mt-8 bg-white/5 rounded-xl border border-white/10 p-4 sm:p-6 ${
              visibleSections.has('whats-inside') ? 'animate-fade-in-up' : ''
            }`}>
              <h4 className="text-white font-bold text-base sm:text-lg mb-4 text-center">What Happens After You Click The Button?</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { step: '1', title: 'Checkout', desc: 'Secure payment (2 min)', icon: CheckCircle },
                  { step: '2', title: 'Check Email', desc: 'Instant access link', icon: Clock },
                  { step: '3', title: 'Watch Training', desc: '15-min setup video', icon: Play },
                  { step: '4', title: 'Create & Post', desc: 'Your first AI video today', icon: Video },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-teal-400 font-black text-lg sm:text-xl">{item.step}</span>
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
          4. HOW IT WORKS - WHITE SECTION - 4 STEPS CREATIVE
          ================================================================ */}
      <section
        id="how-it-works"
        data-animate
        className="py-10 sm:py-20 bg-white relative overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl" />

        <div className="w-full px-3 sm:px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className={`text-center mb-8 sm:mb-14 ${visibleSections.has('how-it-works') ? 'animate-fade-in-up' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/30 px-4 py-2 rounded-full mb-4">
                <Zap className="w-4 h-4 text-teal-500 animate-pulse" />
                <span className="text-teal-600 font-black text-xs uppercase tracking-wide">4 Simple Steps</span>
                <span className="text-gray-400 text-xs">•</span>
                <span className="text-cyan-600 font-bold text-xs">~20 min total</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-3 sm:mb-4">
                From Zero to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">AI Video</span> in Minutes
              </h2>
              <p className="text-gray-600 text-sm sm:text-lg max-w-2xl mx-auto">
                Even if you've never touched AI before. Works <span className="font-bold text-gray-800">only for dentists</span>.
              </p>
            </div>

            {/* 4 Steps - Creative Timeline */}
            <div className="relative">
              {/* Connecting line - desktop */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-green-500 -translate-y-1/2 rounded-full opacity-20" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* Step 1 - Generate Script */}
                <div className={`group relative ${visibleSections.has('how-it-works') ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '0ms' }}>
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 sm:p-6 border-2 border-gray-100 hover:border-teal-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/10 h-full">
                    {/* Step number - floating */}
                    <div className="absolute -top-3 -left-2 sm:-top-4 sm:-left-3">
                      <div className="relative">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform">
                          <span className="text-white font-black text-lg sm:text-xl">1</span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                          <Zap className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Time badge */}
                    <div className="flex justify-end mb-4 mt-2">
                      <span className="bg-teal-500/10 text-teal-600 px-3 py-1 rounded-full text-xs font-bold border border-teal-500/20">
                        5 min
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500/20 to-cyan-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <MessageSquare className="w-7 h-7 text-teal-500" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">Generate Script</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Use our <span className="text-teal-600 font-semibold">ChatGPT specialist</span> built for dental practices. Just describe your topic.
                    </p>

                    {/* Mini feature */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        <span>100+ ready templates included</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 - Select Image / Create AI Model */}
                <div className={`group relative ${visibleSections.has('how-it-works') ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '100ms' }}>
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 sm:p-6 border-2 border-gray-100 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 h-full">
                    {/* Step number */}
                    <div className="absolute -top-3 -left-2 sm:-top-4 sm:-left-3">
                      <div className="relative">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
                          <span className="text-white font-black text-lg sm:text-xl">2</span>
                        </div>
                      </div>
                    </div>

                    {/* Time badge */}
                    <div className="flex justify-end mb-4 mt-2">
                      <span className="bg-cyan-500/10 text-cyan-600 px-3 py-1 rounded-full text-xs font-bold border border-cyan-500/20">
                        3 min
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-teal-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <Upload className="w-7 h-7 text-cyan-500" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">Pick Your Image</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Upload a selfie <span className="text-cyan-600 font-semibold">OR</span> generate your personalized AI model from scratch.
                    </p>

                    {/* Mini feature */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        <span>Works with any headshot</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 - Make It Talk */}
                <div className={`group relative ${visibleSections.has('how-it-works') ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '200ms' }}>
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 sm:p-6 border-2 border-gray-100 hover:border-teal-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/10 h-full">
                    {/* Step number */}
                    <div className="absolute -top-3 -left-2 sm:-top-4 sm:-left-3">
                      <div className="relative">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform">
                          <span className="text-white font-black text-lg sm:text-xl">3</span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <Play className="w-2.5 h-2.5 text-white ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Time badge */}
                    <div className="flex justify-end mb-4 mt-2">
                      <span className="bg-teal-500/10 text-teal-600 px-3 py-1 rounded-full text-xs font-bold border border-teal-500/20">
                        5 min
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500/20 to-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <Video className="w-7 h-7 text-teal-500" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">Make It Talk</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      AI generates a <span className="text-teal-600 font-semibold">realistic talking video</span> with perfect lip-sync. Like magic.
                    </p>

                    {/* Mini feature */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        <span>Ultra-realistic results</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4 - Edit & Post */}
                <div className={`group relative ${visibleSections.has('how-it-works') ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '300ms' }}>
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-5 sm:p-6 border-2 border-green-100 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10 h-full relative overflow-hidden">
                    {/* Success glow */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full blur-2xl" />

                    {/* Step number */}
                    <div className="absolute -top-3 -left-2 sm:-top-4 sm:-left-3">
                      <div className="relative">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                          <span className="text-white font-black text-lg sm:text-xl">4</span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                          <Star className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Time badge */}
                    <div className="flex justify-end mb-4 mt-2">
                      <span className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
                        7 min
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <TrendingUp className="w-7 h-7 text-green-500" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">Edit & Post</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Quick edit, add captions, post to <span className="text-green-600 font-semibold">Instagram/TikTok</span>. Watch patients call.
                    </p>

                    {/* Mini feature */}
                    <div className="mt-4 pt-3 border-t border-green-100">
                      <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        <span>Your calendar fills up!</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total time banner */}
            <div className={`flex justify-center mt-8 sm:mt-12 ${visibleSections.has('how-it-works') ? 'animate-fade-in-up animation-delay-500' : ''}`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full blur-xl opacity-20 animate-pulse" />
                <div className="relative flex items-center gap-4 sm:gap-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-full px-6 sm:px-10 py-3 sm:py-4 shadow-2xl">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-teal-400" />
                  <div className="flex items-baseline gap-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 font-black text-2xl sm:text-4xl">~20</span>
                    <span className="text-gray-400 text-sm sm:text-lg font-medium">minutes total</span>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-gray-700" />
                  <span className="hidden sm:block text-gray-500 text-sm">That's it. Done.</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className={`flex flex-col items-center mt-8 sm:mt-12 ${visibleSections.has('how-it-works') ? 'animate-fade-in-up animation-delay-600' : ''}`}>
              <a
                  href={CHECKOUT_LINK}
                className="group relative inline-flex items-center justify-center bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-xl font-black text-base sm:text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-teal-500/30"
              >
                <span className="relative flex items-center gap-2 sm:gap-3 whitespace-nowrap">
                  <Video className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="sm:hidden">Start Creating Now</span>
                  <span className="hidden sm:inline">Start Creating My AI Videos</span>
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
              <p className="text-gray-500 text-xs sm:text-sm mt-3">Save $2,622+ today • 100% refund if not satisfied</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          5. CASE STUDY #2 - DR. DAVID - CREAM/WHITE SECTION (Implant Specialist)
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
                His First AI Video Generated <span className="text-teal-500">$47.82,000</span> in Implant Cases
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
                        <Image src="/images/dentist/review-5.webp" alt="Dr. David Kim" width={96} height={96} className="object-cover w-full h-full" loading="lazy" />
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
                    { time: 'Week 2', event: '5 implant cases accepted • $47.82,000 in treatment plans', icon: FileText, color: 'teal' },
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
                      One week of AI videos. <span className="text-teal-600 font-bold">$47.82,000 in implant cases</span>.
                      I spent $12,000 on marketing agencies and got 3 consultations. This system cost me $47.82 and
                      I had 5 cases in a week. The ROI is unreal.
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-teal-500">
                        <Image src="/images/dentist/review-5.webp" alt="Dr. David" width={40} height={40} className="object-cover" loading="lazy" />
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
                  { value: '$47.82', label: 'Investment', sub: 'One-time' },
                  { value: '$47.82K', label: 'Revenue', sub: '2 weeks' },
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

          {/* FTC Disclaimer after Case Study */}
          <p className="text-center text-gray-500 text-xs italic mt-6 max-w-2xl mx-auto px-4 py-3 border-l-2 border-teal-500/30 bg-teal-50/30">
            *RESULTS NOT TYPICAL: This testimonial represents an individual&apos;s experience. Income and results vary significantly based on effort, market conditions, skills, and circumstances. We do not guarantee any specific results. <a href="/disclaimer" className="text-teal-600 hover:text-teal-700 underline">See full disclaimer</a>.
          </p>
        </div>
      </section>

      {/* ================================================================
          6. TESTIMONIALS - DARK ANIMATED CAROUSEL
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
            {/* Testimonial Disclosure - FTC Compliance */}
            <p className="text-gray-600 text-[10px] sm:text-xs mt-3 max-w-2xl mx-auto">
              *Testimonials collected 2024-2026. Results verified at time of submission. Testimonials reflect individual experiences and are not guaranteed results. Individual results vary based on effort, market conditions, and other factors. See our <a href="/disclaimer" className="text-teal-500 hover:text-teal-400 underline">full disclaimer</a>.
            </p>
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    <Image src={t.image} alt={t.name} fill className="object-cover" loading="lazy" />
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    <Image src={t.image} alt={t.name} fill className="object-cover" loading="lazy" />
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
          6. GUARANTEE #1 - WHITE SECTION - SATISFACTION GUARANTEE
          ================================================================ */}
      <section
        id="guarantee1"
        data-animate
        className="py-10 sm:py-20 bg-white"
      >
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className={`bg-gradient-to-br from-teal-500/10 to-white border-2 border-teal-500/40 rounded-xl sm:rounded-2xl p-5 sm:p-10 relative overflow-hidden ${
              visibleSections.has('guarantee1') ? 'animate-fade-in-up' : ''
            }`}>
              {/* Animated background pulse */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-cyan-500/10 to-teal-500/5 animate-pulse" />

              <div className="relative z-10">
                <div className="text-center mb-5 sm:mb-8">
                  <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/40 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4 animate-bounce">
                    <CalendarCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    <span className="text-green-600 font-bold text-xs sm:text-sm uppercase">Satisfaction Guarantee</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-2">
                    100% Satisfaction or <span className="text-teal-500">Full Refund</span>
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">No questions. No hassle. Period.</p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-8">
                  {/* Animated Calendar Badge */}
                  <div className="relative flex-shrink-0">
                    <div className="w-28 h-28 sm:w-40 sm:h-40 relative">
                      {/* Outer pulsing ring */}
                      <div className="absolute inset-0 rounded-full border-4 border-dashed border-green-500/40 animate-spin-slow" />
                      {/* Glowing effect */}
                      <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping opacity-30" />
                      {/* Main badge */}
                      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-green-500 via-teal-500 to-green-500 shadow-2xl shadow-green-500/30 flex flex-col items-center justify-center">
                        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center text-center p-2">
                          <CalendarCheck className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mb-1" />
                          <span className="text-green-400 font-black text-lg sm:text-2xl leading-none">100%</span>
                          <span className="text-white font-bold text-[8px] sm:text-xs uppercase tracking-wider">Money</span>
                          <span className="text-white font-bold text-[8px] sm:text-xs uppercase tracking-wider">Back</span>
                        </div>
                      </div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-[8px] sm:text-xs px-3 py-0.5 rounded-full shadow-lg">
                        GUARANTEED
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-teal-500/20 shadow-lg">
                      <p className="text-gray-800 text-sm sm:text-lg leading-relaxed font-medium">
                        If you're not completely satisfied with the CloneYourself Video System for any reason,
                        I'll refund <span className="text-teal-500 font-black">every single penny</span> — no questions asked.
                      </p>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-gray-600 text-xs sm:text-sm">
                          Use the scripts, create the videos, follow the system. If it doesn't work for you, you pay nothing.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-6 sm:mt-8">
                  {[
                    { icon: Shield, title: 'Complete Satisfaction', desc: 'Or your money back' },
                    { icon: Shield, title: '30-Day Trial', desc: 'Full refund anytime' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-xl p-3 sm:p-4 text-center border border-teal-500/20 shadow-lg hover:shadow-xl transition-shadow hover:scale-[1.02] transform duration-200">
                      <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-teal-500 mx-auto mb-1.5 sm:mb-2" />
                      <p className="text-gray-900 font-bold text-xs sm:text-base">{item.title}</p>
                      <p className="text-gray-500 text-[10px] sm:text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
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
              <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-full mb-3 sm:mb-4">
                <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
                <span className="text-red-400 font-bold text-xs sm:text-sm">Bonus expires December 20th</span>
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
                  <div className="text-2xl sm:text-3xl font-black text-white mb-1 sm:mb-2">$47.82<span className="text-sm sm:text-lg text-white/70"> one-time</span></div>
                  <p className="text-white/70 text-xs sm:text-sm">Unlimited videos forever</p>
                </div>
              </div>
            </div>

            {/* VISUAL VALUE STACK - Hormozi Style */}
            <div className={`bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-5 sm:p-8 border border-teal-500/30 mb-6 ${
              visibleSections.has('pricing') ? 'animate-fade-in-up animation-delay-300' : ''
            }`}>
              <h3 className="text-white font-black text-lg sm:text-xl text-center mb-4 sm:mb-6">Here's What Your $47.82 Actually Includes:</h3>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                {/* Main Course */}
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300 text-sm sm:text-base">CloneYourself 7-Minute Video Course</span>
                  <span className="text-gray-400 font-bold text-sm sm:text-base">$497</span>
                </div>

                {/* Bonuses */}
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300 text-sm sm:text-base">100 Viral Dental Video Scripts</span>
                  <span className="text-gray-400 font-bold text-sm sm:text-base">$297</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300 text-sm sm:text-base">365 Days Social Media Content</span>
                  <span className="text-gray-400 font-bold text-sm sm:text-base">$197</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300 text-sm sm:text-base">High-Converting Website Template</span>
                  <span className="text-gray-400 font-bold text-sm sm:text-base">$397</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300 text-sm sm:text-base">Dental Profit Simulator</span>
                  <span className="text-gray-400 font-bold text-sm sm:text-base">$247</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300 text-sm sm:text-base">Front Desk Conversion Scripts</span>
                  <span className="text-gray-400 font-bold text-sm sm:text-base">$297</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300 text-sm sm:text-base">+ 5 More Premium Bonuses</span>
                  <span className="text-gray-400 font-bold text-sm sm:text-base">$836</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300 text-sm sm:text-base">Direct Support + Lifetime Updates</span>
                  <span className="text-gray-400 font-bold text-sm sm:text-base">$494</span>
                </div>
              </div>

              {/* Total */}
              <div className="bg-black/30 rounded-xl p-4 sm:p-5">
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/20">
                  <span className="text-white font-bold text-base sm:text-lg">TOTAL VALUE:</span>
                  <span className="text-white font-black text-xl sm:text-2xl">${(497 + totalBonusValue + 494).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-teal-400 font-black text-lg sm:text-xl">YOUR INVESTMENT:</span>
                  <span className="text-teal-400 font-black text-2xl sm:text-3xl">$47.82</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-400 font-bold text-sm sm:text-base">YOUR SAVINGS:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 font-black text-lg sm:text-xl">${(497 + totalBonusValue + 494 - 47).toLocaleString()}</span>
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">98% OFF</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Price Box - Compact on mobile */}
            <div className={`bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-5 sm:p-10 text-center border-2 border-teal-500/50 shadow-2xl ${
              visibleSections.has('pricing') ? 'animate-fade-in-up animation-delay-400' : ''
            }`}>
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                <span className="text-4xl sm:text-6xl font-black text-teal-400">$47.82</span>
                <div className="text-left">
                  <span className="bg-red-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm font-black">98% OFF</span>
                  <p className="text-gray-400 text-[10px] sm:text-sm mt-0.5">One-time</p>
                </div>
              </div>
              <p className="text-teal-400 font-bold text-xs sm:text-base mb-4 sm:mb-6">Lifetime access • No monthly fees</p>

              <Link
                  href={CHECKOUT_LINK}
                className="w-full max-w-md mx-auto bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 text-white py-3.5 sm:py-5 rounded-xl font-black text-base sm:text-xl shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                Get Instant Access Now
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>

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

            {/* CTA - After FAQ */}
            <div className={`mt-8 sm:mt-12 text-center ${visibleSections.has('faq') ? 'animate-fade-in-up animation-delay-500' : ''}`}>
              <p className="text-gray-600 text-sm mb-4">Still have questions? The best answer is trying it risk-free.</p>
              <a
                  href={CHECKOUT_LINK}
                className="group relative inline-flex items-center justify-center bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-xl font-black text-base sm:text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-teal-500/30"
              >
                <span className="relative flex items-center gap-2 sm:gap-3 whitespace-nowrap">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="sm:hidden">Try It Risk-Free</span>
                  <span className="hidden sm:inline">Try It Risk-Free for 30 Days</span>
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
              <p className="text-gray-500 text-xs mt-3">30-day money-back guarantee • No questions asked</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          9. GUARANTEE #2 - BLACK SECTION - SUPER EASY REFUND STEPS
          ================================================================ */}
      <section
        id="guarantee2"
        data-animate
        className="py-10 sm:py-20 bg-black relative overflow-hidden"
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-2 h-2 bg-teal-500/30 rounded-full animate-ping" />
          <div className="absolute top-1/3 right-20 w-3 h-3 bg-cyan-500/20 rounded-full animate-pulse" />
          <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-teal-400/30 rounded-full animate-bounce" />
          <div className="absolute top-1/2 right-10 w-2 h-2 bg-green-500/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        </div>

        <div className="w-full px-3 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className={`bg-gradient-to-br from-white/10 to-white/5 border-2 border-teal-500/40 rounded-xl sm:rounded-2xl p-5 sm:p-10 backdrop-blur-sm ${
              visibleSections.has('guarantee2') ? 'animate-fade-in-up' : ''
            }`}>
              <div className="text-center mb-6 sm:mb-10">
                <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/40 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4">
                  <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 animate-bounce" />
                  <span className="text-teal-400 font-bold text-xs sm:text-sm uppercase">No Hassle Policy</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white mb-2 sm:mb-4">
                  Need a Refund? <span className="text-teal-400">It's THIS Easy</span>
                </h2>
                <p className="text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto">
                  We made the refund process so simple, you can do it in 30 seconds.
                  No phone calls. No guilt trips. No waiting.
                </p>
              </div>

              {/* Creative Animated Steps - Timeline Style */}
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-500 via-cyan-500 to-green-500 -translate-x-1/2 hidden md:block" />

                {/* Mobile: Simple stacked layout | Desktop: Zigzag with line */}
                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className={`relative flex flex-col md:flex-row items-center gap-3 md:gap-4 ${visibleSections.has('guarantee2') ? 'animate-fade-in-up' : ''}`}>
                    {/* Icon - shown first on mobile */}
                    <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/40 md:order-2">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                      <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                        <span className="text-teal-600 font-black text-xs sm:text-sm">1</span>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="w-full md:flex-1 md:text-right md:order-1">
                      <div className="bg-gradient-to-r from-teal-500/20 to-transparent rounded-xl p-4 border border-teal-500/30">
                        <h3 className="text-white font-black text-base sm:text-lg mb-1">Send a Quick Email</h3>
                        <p className="text-gray-400 text-xs sm:text-sm">Just write "I want a refund" - that's it!</p>
                      </div>
                    </div>
                    {/* Desktop spacer */}
                    <div className="hidden md:block md:flex-1 md:order-3" />
                  </div>

                  {/* Step 2 */}
                  <div className={`relative flex flex-col md:flex-row items-center gap-3 md:gap-4 ${visibleSections.has('guarantee2') ? 'animate-fade-in-up animation-delay-200' : ''}`}>
                    {/* Icon */}
                    <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/40 md:order-2">
                      <Send className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                      <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                        <span className="text-cyan-600 font-black text-xs sm:text-sm">2</span>
                      </div>
                    </div>
                    {/* Desktop spacer */}
                    <div className="hidden md:block md:flex-1 md:order-1" />
                    {/* Content */}
                    <div className="w-full md:flex-1 md:order-3">
                      <div className="bg-gradient-to-l from-cyan-500/20 to-transparent rounded-xl p-4 border border-cyan-500/30">
                        <h3 className="text-white font-black text-base sm:text-lg mb-1">We Process Instantly</h3>
                        <p className="text-gray-400 text-xs sm:text-sm">No questions, no forms, no waiting period</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className={`relative flex flex-col md:flex-row items-center gap-3 md:gap-4 ${visibleSections.has('guarantee2') ? 'animate-fade-in-up animation-delay-400' : ''}`}>
                    {/* Icon */}
                    <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40 md:order-2">
                      <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                      <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                        <span className="text-green-600 font-black text-xs sm:text-sm">3</span>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="w-full md:flex-1 md:text-right md:order-1">
                      <div className="bg-gradient-to-r from-green-500/20 to-transparent rounded-xl p-4 border border-green-500/30">
                        <h3 className="text-white font-black text-base sm:text-lg mb-1">Money Back in Your Account</h3>
                        <p className="text-gray-400 text-xs sm:text-sm">Full refund within 24-48 hours. Done!</p>
                      </div>
                    </div>
                    {/* Desktop spacer */}
                    <div className="hidden md:block md:flex-1 md:order-3" />
                  </div>
                </div>
              </div>

              {/* Bottom Message */}
              <div className="mt-6 sm:mt-10 text-center">
                <div className="inline-block bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-green-500/20 rounded-xl p-4 sm:p-6 border border-white/10">
                  <p className="text-white font-bold text-sm sm:text-lg mb-2">
                    That's it. <span className="text-teal-400">3 simple steps.</span>
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    We respect your decision and value your trust. No hard feelings, ever.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          10. MEET YOUR EXPERT - WHITE SECTION (Dr. Alexander Voss)
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
                <span className="text-teal-600 font-bold text-xs uppercase tracking-wide">Meet Your Expert</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-2 sm:mb-4">
                The Clinical Mind <span className="text-teal-500">Behind This System</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-lg max-w-2xl mx-auto">
                Learn from an internationally trained specialist who understands both clinical excellence and modern patient acquisition.
              </p>
            </div>

            <div className={`${visibleSections.has('meet-instructor') ? 'animate-fade-in-up animation-delay-200' : ''}`}>
              <ExpertPersona {...DR_VOSS_DATA} />
            </div>


            {/* SEO-friendly expert description */}
            <p className="sr-only">
              Dr. Alexander Voss is an aesthetic and restorative dentist with over 12 years of experience in veneers, smile makeovers, dental implants, and full mouth rehabilitation. He has helped dentists across 15+ countries attract high-value cosmetic patients.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          REASONS WHY - Why Is This Only $47.82? (Hormozi Principle)
          ================================================================ */}
      <section
        id="reasons-why"
        data-animate
        className="py-8 sm:py-16 bg-gradient-to-b from-black to-slate-950"
      >
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className={`text-center mb-6 sm:mb-8 ${visibleSections.has('reasons-why') ? 'animate-fade-in-up' : ''}`}>
              <h2 className="font-heading text-xl sm:text-3xl font-extrabold text-white mb-2">
                Why Is This Only <span className="text-gradient-premium">$47.82</span>?
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">You're probably wondering why I'm not charging $497...</p>
            </div>

            <div className={`space-y-4 ${visibleSections.has('reasons-why') ? 'animate-fade-in-up animation-delay-200' : ''}`}>
              {[
                {
                  num: '1',
                  title: 'I Use This Every Day',
                  desc: 'I built this system for my own practice first. I use it to create 3-5 videos weekly. This works because it solves MY problem before it solves yours.',
                },
                {
                  num: '2',
                  title: 'I Don\'t Need To Charge You A Lot',
                  desc: 'Unlike software companies that need recurring revenue, my success comes from helping dentists succeed. When you win, I win. So I price based on value delivered, not what I can get away with.',
                },
                {
                  num: '3',
                  title: 'High Volume = Better For Both Of Us',
                  desc: `At $47.82, I can reach ${memberStats.totalMembers.toLocaleString()}+ dentists. Even if only 10% create videos and 5% get results, that's hundreds of dentists getting new patients. That's hundreds of success stories. That's worth more to me than charging $497 to 50 dentists.`,
                },
                {
                  num: '4',
                  title: 'I\'m Betting On You',
                  desc: 'The 30-day guarantee isn\'t marketing fluff. It\'s me saying: "I\'m confident this works. Try it risk-free." That confidence only works if the price is low enough that you\'ll actually TRY it.',
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 bg-white/5 border border-teal-500/20 rounded-xl p-4 sm:p-5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-teal-400 font-black text-sm sm:text-base">{item.num}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`mt-6 text-center ${visibleSections.has('reasons-why') ? 'animate-fade-in-up animation-delay-400' : ''}`}>
              <p className="text-teal-400 font-bold text-sm sm:text-base">
                Bottom line: This is priced to be tried, not priced to be expensive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          10.5 GUARANTEE #3 - WHITE SECTION - NO QUESTIONS ASKED
          ================================================================ */}
      <section
        id="guarantee3"
        data-animate
        className="py-10 sm:py-20 bg-white"
      >
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className={`bg-gradient-to-br from-teal-500/5 via-white to-cyan-500/5 border-2 border-teal-500/30 rounded-xl sm:rounded-2xl p-5 sm:p-10 relative overflow-hidden ${
              visibleSections.has('guarantee3') ? 'animate-fade-in-up' : ''
            }`}>
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10">
                <div className="text-center mb-5 sm:mb-8">
                  <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/40 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 animate-pulse" />
                    <span className="text-teal-600 font-bold text-xs sm:text-sm uppercase">Zero Risk Promise</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-2">
                    Don't Love It? <span className="text-teal-500">Full Refund.</span>
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
                    If you feel it doesn't work for you, seems complicated, or simply isn't what you expected — you get every penny back.
                  </p>
                </div>

                {/* Main content card */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-xl border border-gray-100">
                  <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-8">
                    {/* Badge */}
                    <div className="relative flex-shrink-0">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 relative">
                        <div className="absolute inset-0 rounded-full border-4 border-dashed border-teal-500/40 animate-spin-slow" />
                        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-teal-500 via-cyan-500 to-teal-500 shadow-2xl shadow-teal-500/30 flex flex-col items-center justify-center">
                          <div className="absolute inset-2 rounded-full bg-white flex flex-col items-center justify-center text-center p-2">
                            <Heart className="w-5 h-5 sm:w-7 sm:h-7 text-teal-500 mb-1" />
                            <span className="text-teal-600 font-black text-xs sm:text-sm leading-none">NO</span>
                            <span className="text-gray-800 font-bold text-[7px] sm:text-[9px] uppercase tracking-wider">Questions</span>
                            <span className="text-gray-800 font-bold text-[7px] sm:text-[9px] uppercase tracking-wider">Asked</span>
                          </div>
                        </div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-[7px] sm:text-[9px] px-2.5 py-0.5 rounded-full shadow-lg whitespace-nowrap">
                          30 DAYS
                        </div>
                      </div>
                    </div>

                    {/* Text */}
                    <div className="flex-1 text-center md:text-left">
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
                          <p className="text-gray-700 text-sm sm:text-base">
                            <span className="font-bold text-gray-900">Think it's too complicated?</span> Refund.
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
                          <p className="text-gray-700 text-sm sm:text-base">
                            <span className="font-bold text-gray-900">Doesn't fit your practice?</span> Refund.
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
                          <p className="text-gray-700 text-sm sm:text-base">
                            <span className="font-bold text-gray-900">Changed your mind?</span> Still a refund.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom highlight */}
                  <div className="mt-5 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-100 text-center">
                    <p className="text-gray-900 font-bold text-sm sm:text-lg">
                      We only want happy customers. <span className="text-teal-500">Period.</span>
                    </p>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">
                      Try the entire system for 30 days. If it's not for you, one email and you're refunded.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          11. FINAL CTA - PREMIUM DARK (Hormozi Two Options Style)
          ================================================================ */}
      <section
        id="final-cta"
        data-animate
        className="py-10 sm:py-24 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="w-full px-3 sm:px-6">
          <div className={`max-w-2xl mx-auto text-center ${visibleSections.has('final-cta') ? 'animate-fade-in-up' : ''}`}>
            {/* Hormozi-Style Last Chance Copy */}
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4">
              You Have Two Options Right Now...
            </h2>

            {/* Option 1 vs Option 2 - CLEAN CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
              {/* Option 1 - Pain */}
              <div className="bg-gray-100 rounded-xl p-4 sm:p-5 text-left border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="font-black text-gray-900 text-base sm:text-lg">Option 1: Leave</span>
                </div>
                <div className="space-y-2 text-gray-600 text-xs sm:text-sm">
                  <p>→ Your schedule stays half-empty</p>
                  <p>→ You watch TikTok dentists book patients</p>
                  <p>→ Keep spending $2,000/month on ads that barely convert</p>
                  <p>→ Your team sits around bored</p>
                  <p>→ Next year? Same problem. Still struggling.</p>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-red-600 font-bold text-xs">Cost: $24K/year in marketing + lost revenue</p>
                </div>
              </div>

              {/* Option 2 - Future */}
              <div className="bg-teal-50 rounded-xl p-4 sm:p-5 text-left border-2 border-teal-500">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-teal-600" />
                  </div>
                  <span className="font-black text-gray-900 text-base sm:text-lg">Option 2: Get Access</span>
                </div>
                <div className="space-y-2 text-gray-700 text-xs sm:text-sm">
                  <p>→ In 7 minutes, create your first AI video</p>
                  <p>→ By tomorrow, it's live on Instagram Reels</p>
                  <p>→ By day 3, first patient inquiry comes in</p>
                  <p>→ By week 2, schedule starts filling up</p>
                  <p>→ By month 2? Booked 6 weeks out like Dr. Sarah</p>
                </div>
                <div className="mt-3 pt-3 border-t border-teal-200">
                  <p className="text-teal-700 font-bold text-xs">Cost: $47.82 one-time. Worst case: full refund, no questions asked</p>
                </div>
              </div>
            </div>

            {/* The Math Section */}
            <div className="bg-gray-100 rounded-xl p-4 sm:p-5 mb-4 sm:mb-6 text-left border border-gray-200">
              <h3 className="font-black text-gray-900 text-center text-base sm:text-lg mb-3">The Math Is Simple:</h3>
              <div className="space-y-2 text-gray-600 text-sm">
                <p>• If Option 2 gets you <span className="font-bold text-gray-900">just 1 new patient</span> in month 1... that's <span className="text-teal-600 font-bold">$2,000-5,000</span> from a $47.82 investment.</p>
                <p>• If you get <span className="font-bold text-gray-900">5 new patients</span> (average result)... that's <span className="text-teal-600 font-bold">$10,000-25,000</span> from $47.82.</p>
                <p>• Even if you try it for 30 days and ask for a refund... <span className="text-teal-600 font-bold">you get 100% back</span> and lost nothing.</p>
              </div>
              <p className="text-center text-gray-900 font-bold text-sm sm:text-base mt-4">There is no losing move here. Only moving forward or staying stuck.</p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-2xl mb-3 sm:mb-6">
              {/* Price with Savings */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <span className="text-3xl sm:text-5xl font-black text-teal-400">$47.82</span>
                <div className="text-left">
                  <span className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-black block">SAVE ${totalBonusValue.toLocaleString()}</span>
                  <p className="text-gray-500 text-xs mt-0.5">One-time</p>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                  href={CHECKOUT_LINK}
                className="group relative w-full bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 text-black py-4 sm:py-5 rounded-xl font-black text-lg sm:text-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative flex items-center gap-2">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                  Get Instant Access Now
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              {/* Guarantee */}
              <div className="flex items-center justify-center gap-2 mt-4 text-gray-400 text-xs sm:text-sm">
                <Shield className="w-4 h-4 text-green-500" />
                <span>30-Day Money-Back Guarantee • No Questions Asked</span>
              </div>
            </div>

            {/* Final Reassurance */}
            <p className="text-black/60 text-xs sm:text-sm">
              Join {memberStats.totalMembers.toLocaleString()}+ dentists • Instant access • No risk
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          STILL THINKING? - Regret Prevention (Hormozi)
          ================================================================ */}
      <section
        id="still-thinking"
        data-animate
        className="py-8 sm:py-16 bg-slate-950"
      >
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <div className={`bg-gradient-to-br from-white/5 to-white/[0.02] border border-teal-500/20 rounded-xl sm:rounded-2xl p-5 sm:p-8 ${visibleSections.has('still-thinking') ? 'animate-fade-in-up' : ''}`}>
              <h2 className="text-xl sm:text-2xl font-black text-white text-center mb-4 sm:mb-6">
                Still Thinking About It?
              </h2>

              <div className="text-gray-400 text-sm sm:text-base leading-relaxed space-y-3 mb-6">
                <p>Here's what usually happens:</p>
                <p>You leave this page. You think about it tonight. You wake up tomorrow thinking <span className="text-white">"Yeah, I should try that."</span></p>
                <p>But you get busy. Patients to see. Staff drama. Insurance calls.</p>
                <p>Two weeks later you forgot about this completely.</p>
                <p>Three months later you're frustrated your schedule is slow again.</p>
                <p className="text-teal-400 font-bold">You regret not trying it when you saw it.</p>
              </div>

              <div className="bg-black/30 rounded-xl p-4 sm:p-5 mb-6">
                <p className="text-white font-bold text-center text-sm sm:text-base mb-3">Don't be that person.</p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-teal-400 font-black text-lg sm:text-xl">$47.82</p>
                    <p className="text-gray-500 text-xs">Cost</p>
                  </div>
                  <div>
                    <p className="text-teal-400 font-black text-lg sm:text-xl">$0</p>
                    <p className="text-gray-500 text-xs">Risk</p>
                  </div>
                  <div>
                    <p className="text-red-400 font-black text-lg sm:text-xl">$$$</p>
                    <p className="text-gray-500 text-xs">Regret of NOT trying</p>
                  </div>
                </div>
              </div>

              <p className="text-white font-bold text-center text-sm sm:text-base mb-4">
                Click now. Decide later. You have 30 days.
              </p>

              <a
                  href={CHECKOUT_LINK}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-4 rounded-xl font-black text-base sm:text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <Zap className="w-5 h-5" />
                Get Instant Access Now
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          FOOTER - BLACK (with extra padding for sticky CTA)
          ================================================================ */}
      <footer className="py-6 sm:py-10 pb-24 sm:pb-10 bg-black border-t border-gray-900">
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
            {/* Contact & Support */}
            <p className="text-gray-400 text-xs sm:text-sm mb-3">
              Questions? <a href="mailto:support@aifastscale.com" className="text-teal-400 hover:text-teal-300 underline">support@aifastscale.com</a>
            </p>
            {/* Wyoming LLC Identification */}
            <p className="text-gray-600 text-[10px] sm:text-xs mb-1">
              Velon LLC, a Wyoming Limited Liability Company
            </p>
            <p className="text-gray-700 text-[9px] sm:text-[10px] mb-2">
              30 N Gould St Ste R, Sheridan, WY 82801
            </p>
            <p className="text-gray-700 text-xs sm:text-sm mb-3">
              © {new Date().getFullYear()} Velon LLC. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-gray-700 text-xs sm:text-sm mb-4">
              <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
              <span className="hidden sm:inline">•</span>
              <a href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</a>
              <span className="hidden sm:inline">•</span>
              <a href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</a>
              <span className="hidden sm:inline">•</span>
              <a href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</a>
              <span className="hidden sm:inline">•</span>
              <a href="/contact" className="hover:text-white transition-colors">Contact</a>
              <span className="hidden sm:inline">•</span>
              <a href="/accessibility" className="hover:text-white transition-colors">Accessibility</a>
              <span className="hidden sm:inline">•</span>
              <a href="/do-not-sell" className="hover:text-white transition-colors">Do Not Sell My Info</a>
            </div>
            {/* FTC Earnings & Professional Disclaimer */}
            <div className="max-w-3xl mx-auto text-[9px] sm:text-[10px] text-gray-600 leading-relaxed space-y-2">
              <p>
                <strong>EARNINGS DISCLAIMER:</strong> Results shown are not typical. Income and results vary based on effort, experience, and market conditions. We make no guarantees regarding income or results.
              </p>
              <p>
                <strong>PROFESSIONAL NOTICE:</strong> This product is for educational purposes only. Dental professionals must ensure compliance with their state dental board regulations and advertising guidelines. Velon LLC does not provide legal or professional compliance advice.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* ================================================================
          STICKY MOBILE CTA - Always visible on mobile
          ================================================================ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-gradient-to-t from-black via-black/95 to-transparent pt-4 pb-safe">
        <div className="px-4 pb-4" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
          <a
            href={CHECKOUT_LINK}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-4 rounded-xl font-black text-base flex items-center justify-center gap-2 shadow-2xl shadow-teal-500/30 active:scale-[0.98] transition-transform"
          >
            <span>Get Access</span>
            <span className="text-teal-200 font-bold">$47.82</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>

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

        /* Testimonial carousel styles for dentist - MOBILE OPTIMIZED */
        .testimonial-carousel-wrapper-dentist {
          position: relative;
          overflow: hidden;
          width: 100%;
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }

        .testimonial-scroll-track-dentist {
          display: flex;
          gap: 0.75rem;
          animation: scroll-dentist 35s linear infinite;
          width: fit-content;
          padding: 0.5rem 0;
        }

        .testimonial-card-dentist {
          flex-shrink: 0;
          width: 280px;
          background: linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%);
          border: 1px solid rgba(20, 184, 166, 0.2);
          border-radius: 1rem;
          padding: 1.25rem;
          position: relative;
        }

        .testimonial-quote-icon-dentist {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          width: 20px;
          height: 20px;
          opacity: 0.3;
          overflow: hidden;
        }

        .testimonial-quote-icon-dentist svg {
          width: 100%;
          height: 100%;
          max-width: 20px;
          max-height: 20px;
        }

        @keyframes scroll-dentist {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Mobile-specific testimonial adjustments */
        @media (max-width: 640px) {
          .testimonial-card-dentist {
            width: 260px;
            padding: 1rem;
          }
          .testimonial-scroll-track-dentist {
            gap: 0.5rem;
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

        /* Safety net: ensure sections become visible even if IntersectionObserver misses them on fast scroll */
        [data-animate] {
          animation: fallbackReveal 0s 1.5s forwards;
        }
        [data-animate].visible {
          animation: none;
        }
        @keyframes fallbackReveal {
          to { opacity: 1; transform: none; }
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
