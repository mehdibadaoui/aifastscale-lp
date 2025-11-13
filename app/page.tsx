'use client'

import React, { useEffect, useState, useRef, ReactNode, memo } from 'react'
import Image from 'next/image'
import dynamicImport from 'next/dynamic'
import {
  Shield,
  CheckCircle,
  ArrowRight,
  Zap,
  Clock,
  AlertCircle,
  Users,
  Video,
  Wand2,
  Upload,
  TrendingUp,
  X,
  Sparkles,
  DollarSign,
  MessageCircle,
  Eye,
  Award,
  Mail,
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Laptop,
  Globe,
  Camera,
  RefreshCw,
  Smartphone,
  Headphones,
  Youtube,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
} from 'lucide-react'
import { trackFullCTAClick, collectTrackingParams } from './utils/tracking'
import { captureUTMParameters, storeUTMParameters } from './utils/utm-tracking'

// Stripe checkout now loaded immediately for instant CTA response
// Trade-off: +1MB bundle size for MUCH better UX (instant checkout)

// Lazy load SocialProofPopup - prevents blocking API call on initial render
const SocialProofPopup = dynamicImport(
  () => import('./components/SocialProofPopup'),
  {
    ssr: false,
  }
)

// Simple Card component without animations for better performance
interface CardProps {
  children: ReactNode
  className?: string
}

const Card: React.FC<CardProps> = memo(({ children, className = '' }) => {
  return <div className={className}>{children}</div>
})

Card.displayName = 'Card'

export default function AgentLandingPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showStickyCTA, setShowStickyCTA] = useState(false)
  const [showSecurityPopup, setShowSecurityPopup] = useState(false)
  const [showAllTestimonials, setShowAllTestimonials] = useState(false)
  const [priceUnlocked, setPriceUnlocked] = useState(false)
  const [isReturningVisitor, setIsReturningVisitor] = useState(false)
  const [fakeProgress, setFakeProgress] = useState(0)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [videoStarted, setVideoStarted] = useState(false) // Track if user clicked to start
  const [videoMuted, setVideoMuted] = useState(false) // Video starts unmuted (with sound)
  const [showContinueModal, setShowContinueModal] = useState(false)
  const [savedVideoTime, setSavedVideoTime] = useState(0)
  const [timeLeft, setTimeLeft] = useState('')
  const [showClickFeedback, setShowClickFeedback] = useState(false) // Visual click feedback
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 }) // Click position for ripple
  const [videoProgress, setVideoProgress] = useState(0) // Video progress percentage (0-100)
  const [showMilestone, setShowMilestone] = useState(false) // Show progress milestone
  const [milestoneMessage, setMilestoneMessage] = useState('') // Milestone message
  const [showBelowFold, setShowBelowFold] = useState(false) // Lazy load below-the-fold content
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null) // Track which button is loading
  const videoRef = useRef<HTMLVideoElement>(null)
  const belowFoldRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Security: Light anti-inspect measures - NOTE: This only stops casual users, not developers
    if (typeof window !== 'undefined') {
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault()
        setShowSecurityPopup(true)
        setTimeout(() => setShowSecurityPopup(false), 3000)
        return false
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          e.key === 'F12' ||
          (e.ctrlKey &&
            e.shiftKey &&
            (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
          (e.ctrlKey && e.key === 'U')
        ) {
          e.preventDefault()
          setShowSecurityPopup(true)
          setTimeout(() => setShowSecurityPopup(false), 3000)
          return false
        }
      }

      document.addEventListener('contextmenu', handleContextMenu)
      document.addEventListener('keydown', handleKeyDown)

      console.log(
        '%c⚠️ Security Notice',
        'color: red; font-size: 20px; font-weight: bold;'
      )
      console.log(
        '%cThis site has basic protection enabled. Please respect intellectual property.',
        'font-size: 14px;'
      )

      return () => {
        document.removeEventListener('contextmenu', handleContextMenu)
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [])

  // Check if returning visitor and unlock price immediately
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasVisited = localStorage.getItem('hasVisitedLP')
      if (hasVisited === 'true') {
        setIsReturningVisitor(true)
        setPriceUnlocked(true)
      } else {
        // Mark as visited for future visits
        localStorage.setItem('hasVisitedLP', 'true')
      }
    }
  }, [])

  // 📊 Capture UTM parameters for ad attribution tracking
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const utmParams = captureUTMParameters()
      if (Object.keys(utmParams).length > 0) {
        storeUTMParameters(utmParams)
        console.log('📊 UTM parameters captured:', utmParams)
      }
    }
  }, [])

  // HTML5 Video Setup - much simpler and faster than Wistia!
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Play event
    const handlePlay = () => {
      console.log('Video playing')
      setVideoPlaying(true)
    }

    // Pause event
    const handlePause = () => {
      console.log('Video paused')
      setVideoPlaying(false)
    }

    // Ended event
    const handleEnded = () => {
      console.log('Video ended')
      setVideoPlaying(false)
      // Mark video as completed when it reaches the end
      localStorage.setItem('heroVideoCompleted', 'true')
    }

    // Time update - track progress with SUPER FAST beginning
    const handleTimeUpdate = () => {
      if (!video.duration) return

      const percent = video.currentTime / video.duration
      const currentTime = video.currentTime
      const progressPercent = Math.floor(percent * 100)

      // Update video progress percentage
      setVideoProgress(progressPercent)

      // Save progress to localStorage every 2 seconds
      if (currentTime % 2 < 0.1) {
        localStorage.setItem('heroVideoTime', currentTime.toString())
      }

      // Show progress milestones (only once per milestone)
      const milestones = {
        25: "You're 25% through! This is where it gets good...",
        50: '🔥 Halfway there! The best part is coming up...',
        75: '⚡ Almost done! The price unlocks in just 1 minute...',
      }

      Object.entries(milestones).forEach(([threshold, message]) => {
        const milestoneKey = `milestone_${threshold}`
        const alreadyShown = sessionStorage.getItem(milestoneKey)

        if (progressPercent >= parseInt(threshold) && progressPercent < parseInt(threshold) + 2 && !alreadyShown) {
          setMilestoneMessage(message)
          setShowMilestone(true)
          sessionStorage.setItem(milestoneKey, 'true')

          // Hide after 3 seconds
          setTimeout(() => setShowMilestone(false), 3000)
        }
      })

      // Unlock price at 245s (92.4% of 265s video) - only for first-time visitors
      if (percent >= 0.924 && !priceUnlocked && !isReturningVisitor) {
        setPriceUnlocked(true)
        localStorage.setItem('priceUnlocked', 'true')
      }

      // Calculate fake progress - 4 PHASES based on 4:25min video (265s total)
      let fake = 0
      if (percent <= 0.15) {
        // Phase 1: 0-40s (0-15%) → x14 speed: show 0-70% progress
        fake = percent * 4.67
      } else if (percent <= 0.38) {
        // Phase 2: 40-100s (15-38%) → x8 speed: show 70-92% progress
        fake = 0.7 + (percent - 0.15) * 0.96
      } else if (percent <= 0.75) {
        // Phase 3: 100-200s (38-75%) → slower: show 92-98% progress
        fake = 0.92 + (percent - 0.38) * 0.16
      } else {
        // Phase 4: 200-265s (75-100%) → very slow: show 98-100% progress
        fake = 0.98 + (percent - 0.75) * 0.08
      }

      setFakeProgress(Math.min(fake * 100, 100))
    }

    // CRITICAL: Buffering events for smooth playback
    const handleWaiting = () => {
      // Video is buffering - could show loading spinner here if needed
      console.log('Video buffering...')
    }

    const handleCanPlayThrough = () => {
      // Video has buffered enough to play through without stopping
      console.log('Video ready - can play through without buffering')
    }

    const handleLoadedData = () => {
      // First frame is loaded - video is ready to play
      console.log('Video loaded - ready to play')
    }

    const handleError = (e: Event) => {
      // Video failed to load
      console.error('Video error:', e)
    }

    const handleStalled = () => {
      // Video download has stalled (network issue)
      console.warn('Video download stalled')
    }

    // Add event listeners
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('canplaythrough', handleCanPlayThrough)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('error', handleError)
    video.addEventListener('stalled', handleStalled)

    // Cleanup
    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('canplaythrough', handleCanPlayThrough)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('error', handleError)
      video.removeEventListener('stalled', handleStalled)
    }
  }, [priceUnlocked])

  // Check for saved video progress on load - ONLY show if video was completed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTime = localStorage.getItem('heroVideoTime')
      const videoCompleted = localStorage.getItem('heroVideoCompleted')

      // ONLY show continue modal if user COMPLETED the video (watched to the end)
      if (videoCompleted === 'true' && savedTime && parseFloat(savedTime) > 5) {
        setSavedVideoTime(parseFloat(savedTime))
        setShowContinueModal(true)
      }
    }
  }, [])

  // Countdown timer to midnight
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const midnight = new Date()
      midnight.setHours(24, 0, 0, 0) // Next midnight

      const diff = midnight.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
    }

    updateCountdown() // Initial call
    const interval = setInterval(updateCountdown, 1000) // Update every second

    return () => clearInterval(interval)
  }, [])

  // Styles and scroll tracking
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-scroll {
        animation: scroll 8s linear infinite;
      }
      .animate-scroll:hover {
        animation-play-state: paused;
      }
      .animate-scroll-reverse {
        animation: scroll 8s linear infinite reverse;
      }
      .animate-scroll-reverse:hover {
        animation-play-state: paused;
      }
      @keyframes priceReveal {
        0% {
          opacity: 0;
          transform: scale(0.8) translateY(20px);
        }
        50% {
          transform: scale(1.1) translateY(0);
        }
        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
      @keyframes pump {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }
      .price-reveal {
        animation: priceReveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      .pump-animation {
        animation: pump 0.6s ease-in-out 3;
      }

      /* Hide HTML5 video native controls */
      video::-webkit-media-controls {
        display: none !important;
      }
      video::-webkit-media-controls-enclosure {
        display: none !important;
      }
      video::-webkit-media-controls-panel {
        display: none !important;
      }
    `
    document.head.appendChild(style)

    // Throttled scroll handler for better performance on mobile
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const t = document.documentElement.scrollTop
          const h =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight
          setScrollProgress((t / h) * 100)
          setShowStickyCTA(t > 800)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (style.parentNode) {
        style.parentNode.removeChild(style)
      }
    }
  }, [])

  // Lazy load below-the-fold content for performance
  useEffect(() => {
    // Load after 500ms OR when sentinel comes into view (whichever first)
    const timer = setTimeout(() => {
      setShowBelowFold(true)
    }, 500)

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowBelowFold(true)
        }
      },
      { rootMargin: '200px' } // Start loading 200px before visible
    )

    if (belowFoldRef.current) {
      observer.observe(belowFoldRef.current)
    }

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const tilt =
    'transition-transform duration-500 will-change-transform hover:-translate-y-1'

  // PROPER Checkout Session with full metadata
  const handleCheckout = async (ctaLocation: string) => {
    // Fire tracking in background
    setTimeout(() => trackFullCTAClick(ctaLocation), 0)

    try {
      // Get Facebook Pixel cookies for tracking
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts.length === 2) return parts.pop()?.split(';').shift()
        return undefined
      }

      const fbp = getCookie('_fbp')
      const fbc = getCookie('_fbc')

      // Get UTM parameters from URL
      const urlParams = new URLSearchParams(window.location.search)
      const utmSource = urlParams.get('utm_source')
      const utmMedium = urlParams.get('utm_medium')
      const utmCampaign = urlParams.get('utm_campaign')
      const utmContent = urlParams.get('utm_content')
      const utmTerm = urlParams.get('utm_term')

      // Create Checkout Session with FULL metadata
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
          fbp,
          fbc,
          utmSource,
          utmMedium,
          utmCampaign,
          utmContent,
          utmTerm,
          landingPage: window.location.href,
          referrer: document.referrer || 'direct',
        }),
      })

      const { url, error } = await response.json()

      if (error) {
        console.error('Checkout error:', error)
        alert('Payment system error. Please try again or contact support.')
        return
      }

      // Redirect to Stripe Checkout with full customer context
      window.location.href = url
    } catch (error) {
      console.error('Checkout failed:', error)
      alert('Payment system error. Please try again or contact support.')
    }
  }

  const products = [
    {
      title: '7min AgentClone Course',
      value: '547',
      description:
        'Complete step by step blueprint with system prompts and workflows',
      image: '/images/P1_result.webp',
    },
    {
      title: 'Real Estate System Prompt',
      value: '297',
      description: 'High converting scripts for listings and DMs',
      image: '/images/P2_result.webp',
    },
    {
      title: 'ChatGPT Specialist for Real Estate',
      value: '197',
      description: 'Your Personal AI Real Estate Expert',
      image: '/images/P8-c.webp',
    },
    {
      title: 'Photo to Talking Video',
      value: '217',
      description: 'Turn photos into natural talking videos in minutes',
      image: '/images/P3_result.webp',
    },
    {
      title: '10 Min Phone Edit Templates',
      value: '376',
      description: 'Captions, logos, CTAs ready to export',
      image: '/images/P4_result.webp',
    },
  ]

  const bonuses = [
    {
      title: '2026 Personal Brand Blueprint',
      value: '197',
      image: '/images/P5_result.webp',
    },
    {
      title: '17 Unskippable Real Estate Hooks',
      value: '107',
      image: '/images/P6_result.webp',
    },
    {
      title: 'Realtor Canva Pack 100 Templates',
      value: '147',
      image: '/images/P7_result.webp',
    },
  ]

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      location: 'Miami, Florida',
      image: '/images/IMG_3329_result.webp',
      text: 'Honestly thought this was too good to be true. Made my first video on a Monday, by Friday I had 11 serious buyer inquiries. Already closed one $740K listing. This paid for itself 200x over.',
      rating: 5,
      verified: true,
    },
    {
      name: 'Marcus Johnson',
      location: 'Houston, Texas',
      image: '/images/IMG_3365_result.webp',
      text: 'Been in real estate 6 years, nothing compares. Posted my AgentClone video at 9am, had 47 DMs by dinner. Three became clients within the week. My wife thinks I hired a marketing agency.',
      rating: 5,
      verified: true,
    },
    {
      name: 'Isabella Rodriguez',
      location: 'Los Angeles, California',
      image: '/images/IMG_3360_result.webp',
      text: 'No tech skills, no fancy equipment. Just me, my phone, and 7 minutes. Now I create 3 videos per week and my lead flow is completely transformed. Broker keeps asking for my secret.',
      rating: 5,
      verified: true,
    },
    {
      name: 'David Chen',
      location: 'New York, New York',
      image: '/images/IMG_3380_result.webp',
      text: 'Skeptical at first - tried everything from Facebook ads to door knocking. This system brought me from 2-3 monthly leads to 22 last month. ROI is insane. Wish I found this sooner.',
      rating: 5,
      verified: true,
    },
    {
      name: 'Aisha Al Mansoori',
      location: 'Dubai, UAE',
      image: '/images/IMG_3200_result.webp',
      text: 'Working in Dubai luxury market, presentation is everything. These AI videos look premium, professional, and took me minutes to create. Closed a 2.3M AED property last week from a video lead.',
      rating: 5,
      verified: true,
    },
    {
      name: 'Carlos Mendoza',
      location: 'Madrid, Spain',
      image: '/images/IMG_3367_result.webp',
      text: 'Funcionó mejor de lo que esperaba. My Spanish and English videos both convert like crazy. 15 new leads in 2 weeks, 3 already under contract. This is the future of real estate marketing.',
      rating: 5,
      verified: true,
    },
    {
      name: 'Yuki Tanaka',
      location: 'Tokyo, Japan',
      image: '/images/IMG_3424_result.webp',
      text: "Tokyo market is extremely competitive. This system helped me stand out completely. My videos get shared, my phone doesn't stop ringing. Best $37 I ever spent on my business.",
      rating: 5,
      verified: true,
    },
    {
      name: 'Mohammed Al Rashid',
      location: 'Riyadh, Saudi Arabia',
      image: '/images/IMG_3379_result.webp',
      text: 'Premium properties need premium marketing. These AI videos deliver both. My Arabic and English content now reaches wider audience. 8 new high-net-worth clients in one month.',
      rating: 5,
      verified: true,
    },
    {
      name: 'Priya Patel',
      location: 'London, United Kingdom',
      image: '/images/IMG_3203_result.webp',
      text: 'London property market is brutal. This gave me unfair advantage. My videos get engagement, shares, and most importantly - qualified buyers. 12 deals in pipeline, all from video leads.',
      rating: 5,
      verified: true,
    },
    {
      name: 'Tyler Brooks',
      location: 'Austin, Texas',
      image: '/images/IMG_3375_result.webp',
      text: 'Tech capital of Texas, and even here people are blown away. My videos feel personal, authentic, and scale infinitely. Went from cold calling to inbound leads flowing daily. Life changing.',
      rating: 5,
      verified: true,
    },
    {
      name: 'DeAndre Carter',
      location: 'Detroit, Michigan',
      image: '/images/IMG_3376_result.webp',
      text: 'From struggling to thriving in 45 days. This system brought consistency I never had. My videos reach people I could never reach door-knocking. 14 active clients now. This changed everything for me.',
      rating: 5,
      verified: true,
    },
    {
      name: 'Elena Volkov',
      location: 'Moscow, Russia',
      image: '/images/IMG_3368_result.webp',
      text: 'Москва - огромный рынок. AI videos helped me dominate my neighborhood. Russian buyers love the personal touch. My lead cost dropped 80%, my income tripled. Best investment in my 8-year career.',
      rating: 5,
      verified: true,
    },
  ]

  const faqs = [
    {
      q: 'Do I need technical skills or video editing experience?',
      a: 'Absolutely not. The 7-Minute AgentClone is specifically designed for real estate professionals with zero technical background. If you can take a photo with your smartphone, you can create professional AI videos. Our step-by-step system guides you through each click—most agents create their first high-converting video in under 10 minutes on their very first attempt. No software downloads, no learning curve.',
      icon: 'Laptop',
    },
    {
      q: 'How quickly can I start generating leads with this?',
      a: 'You can create your first AI video within 7 minutes of accessing the course and start getting leads the same day. Many agents report receiving 5-15 qualified buyer/seller inquiries within their first week. The system is designed for immediate implementation—upload a photo, follow the blueprint, and your professional talking AI video is ready to post on social media and start attracting leads instantly.',
      icon: 'Zap',
    },
    {
      q: 'Will this work for my specific real estate market?',
      a: 'Yes. Whether you\'re in Dubai, Abu Dhabi, the USA, or anywhere globally, AI talking videos work universally. The psychology of trust and engagement is the same everywhere—people want to see and hear from real agents, and AI videos let you scale your personal presence 24/7. We have successful students across UAE, Saudi Arabia, USA, Canada, UK, and 50+ countries.',
      icon: 'Globe',
    },
    {
      q: 'What if I\'m camera-shy or don\'t like being on video?',
      a: 'That\'s exactly why this system exists. You don\'t film yourself—you simply upload ONE photo (even a professional headshot works), and the AI creates a natural, professional talking video of you. No awkward filming, no retakes, no expensive videographers. It\'s perfect for agents who want the power of video marketing without the discomfort of being on camera.',
      icon: 'Camera',
    },
    {
      q: 'How is this different from expensive video marketing agencies?',
      a: 'Traditional video marketing costs $500-$2,000 per video and requires scheduling, filming, editing, and weeks of back-and-forth. With the 7-Minute AgentClone, you create unlimited professional videos for a one-time $37 investment. No monthly fees, no per-video costs, no waiting. You control everything and can create a new video whenever you need one—whether that\'s daily, weekly, or for every new listing.',
      icon: 'DollarSign',
    },
    {
      q: 'Do I get updates if AI technology improves?',
      a: 'Yes! You get lifetime access with free monthly updates. As AI video technology evolves and we discover new techniques, templates, and workflows, you\'ll automatically receive all updates at no additional cost. Your $37 investment today gives you access to future improvements forever.',
      icon: 'RefreshCw',
    },
    {
      q: 'What if this doesn\'t work for me? Is there a guarantee?',
      a: 'Absolutely. We offer an ironclad 30-day money-back guarantee. If you don\'t generate quality leads or see results within 30 days, simply email support@aifastscale.com and we\'ll refund every penny—no questions asked, no hassle. We\'re real estate tech specialists who use this system ourselves, and we\'re confident it will work for you.',
      icon: 'Shield',
    },
    {
      q: 'How much time will this take each week?',
      a: '7 minutes per video. That\'s it. You can create a week\'s worth of content (5-7 videos) in under an hour on Sunday evening, schedule them out, and watch the leads roll in all week while you focus on showing properties and closing deals. This is about working smarter, not harder.',
      icon: 'Clock',
    },
    {
      q: 'Can I really use just my phone, or do I need special equipment?',
      a: 'Your smartphone is all you need—iPhone or Android, doesn\'t matter. No ring lights, no microphones, no green screens, no fancy cameras. The entire process works from your phone or computer browser. We\'ve intentionally designed this to be accessible for every agent, regardless of technical resources.',
      icon: 'Smartphone',
    },
    {
      q: 'What kind of support do I get after purchase?',
      a: 'You get instant access to our comprehensive step-by-step video training, downloadable templates, copy-paste scripts, and email support at support@aifastscale.com. Most agents never need support because the system is so straightforward, but if you get stuck, we\'re here to help. Average response time is under 24 hours.',
      icon: 'Headphones',
    },
  ]

  const agents1 = [
    {
      img: '/images/IMG_3197_result.webp',
      name: 'Iman Al Farsi',
      loc: 'Dubai',
    },
    {
      img: '/images/IMG_3199_result.webp',
      name: 'Camila Silva',
      loc: 'Sao Paulo',
    },
    {
      img: '/images/IMG_3200_result.webp',
      name: 'Aisha Al Mansoori',
      loc: 'Abu Dhabi',
    },
    {
      img: '/images/IMG_3203_result.webp',
      name: 'Noor Al Zahra',
      loc: 'Dubai',
    },
    {
      img: '/images/IMG_3329_result.webp',
      name: 'Hannah Schmidt',
      loc: 'Berlin',
    },
    {
      img: '/images/IMG_3360_result.webp',
      name: 'Isabella Martinez',
      loc: 'Barcelona',
    },
    {
      img: '/images/IMG_3364_result.webp',
      name: 'Chinedu Okafor',
      loc: 'Lagos',
    },
    {
      img: '/images/IMG_3365_result.webp',
      name: 'James Thompson',
      loc: 'Miami',
    },
    {
      img: '/images/IMG_3366_result.webp',
      name: 'Tyrone Davis',
      loc: 'Houston',
    },
  ]

  const agents2 = [
    {
      img: '/images/IMG_3367_result.webp',
      name: 'David Martinez',
      loc: 'Los Angeles',
    },
    {
      img: '/images/IMG_3368_result.webp',
      name: 'Alexei Volkov',
      loc: 'Moscow',
    },
    {
      img: '/images/IMG_3375_result.webp',
      name: 'Jamal Washington',
      loc: 'Chicago',
    },
    {
      img: '/images/IMG_3376_result.webp',
      name: 'DeAndre Carter',
      loc: 'Detroit',
    },
    { img: '/images/IMG_3379_result.webp', name: 'Rashid Ahmed', loc: 'Dubai' },
    {
      img: '/images/IMG_3380_result.webp',
      name: 'Michael Brown',
      loc: 'New York',
    },
    { img: '/images/IMG_3424_result.webp', name: 'Raj Sharma', loc: 'Mumbai' },
    {
      img: '/images/IMG_3425_result.webp',
      name: 'Oliver Harris',
      loc: 'London',
    },
  ]

  interface FAQItemProps {
    question: string
    answer: string
    index: number
    icon: string
  }

  const FAQItem: React.FC<FAQItemProps> = memo(
    ({ question, answer, index, icon }) => {
      const isOpen = openFAQ === index

      // Icon mapping
      const iconMap: Record<string, React.ReactNode> = {
        Laptop: <Laptop className="h-5 w-5 md:h-6 md:w-6" />,
        Zap: <Zap className="h-5 w-5 md:h-6 md:w-6" />,
        Globe: <Globe className="h-5 w-5 md:h-6 md:w-6" />,
        Camera: <Camera className="h-5 w-5 md:h-6 md:w-6" />,
        DollarSign: <DollarSign className="h-5 w-5 md:h-6 md:w-6" />,
        RefreshCw: <RefreshCw className="h-5 w-5 md:h-6 md:w-6" />,
        Shield: <Shield className="h-5 w-5 md:h-6 md:w-6" />,
        Clock: <Clock className="h-5 w-5 md:h-6 md:w-6" />,
        Smartphone: <Smartphone className="h-5 w-5 md:h-6 md:w-6" />,
        Headphones: <Headphones className="h-5 w-5 md:h-6 md:w-6" />,
      }

      return (
        <div
          className={`group rounded-2xl border-2 transition-all ${
            isOpen
              ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg'
              : 'border-gray-200 bg-white hover:border-amber-400/50 hover:shadow-md'
          }`}
        >
          <button
            onClick={() => setOpenFAQ(isOpen ? null : index)}
            className="flex w-full items-center gap-4 p-5 text-left transition-all md:p-6"
          >
            {/* Icon with gradient background */}
            <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all md:h-12 md:w-12 ${
              isOpen
                ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-white shadow-lg'
                : 'bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600 group-hover:from-amber-200 group-hover:to-orange-200'
            }`}>
              {iconMap[icon]}
            </div>

            {/* Question */}
            <h3 className="font-sans flex-1 text-base font-bold leading-tight text-gray-900 md:text-xl">
              {question}
            </h3>

            {/* Expand/Collapse Icon */}
            <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all md:h-9 md:w-9 ${
              isOpen
                ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white'
                : 'bg-amber-100 text-amber-600 group-hover:bg-amber-200'
            }`}>
              <span className="text-xl font-black md:text-2xl">
                {isOpen ? '−' : '+'}
              </span>
            </div>
          </button>

          {/* Answer */}
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="border-t border-amber-200/50 px-5 pb-5 pt-4 md:px-6 md:pb-6 md:pt-5">
                <p className="text-sm leading-relaxed text-gray-700 md:text-base md:leading-relaxed">
                  {answer}
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  )

  FAQItem.displayName = 'FAQItem'

  const SecureCheckout = memo(() => (
    <div className="mt-6 w-full max-w-4xl px-4">
      <div className="flex flex-nowrap justify-center gap-2 md:gap-4">
        <div className="group flex-1">
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 opacity-30 blur transition duration-300 group-hover:opacity-50 md:rounded-xl"></div>
            <div className="relative transform rounded-lg border border-amber-500/30 bg-gradient-to-br from-amber-900/20 to-amber-800/20 p-2 text-center backdrop-blur-sm transition-all duration-300 group-hover:scale-105 md:rounded-xl md:p-4">
              <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-lg transition-shadow duration-300 group-hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] md:mb-2 md:h-12 md:w-12">
                <Users className="h-3 w-3 text-black md:h-6 md:w-6" />
              </div>
              <div className="mb-0.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-sm font-black text-transparent md:mb-1 md:text-2xl">
                500+
              </div>
              <div className="text-[10px] font-semibold text-gray-300 md:text-xs">
                Active Agents
              </div>
            </div>
          </div>
        </div>

        <div className="group flex-1">
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 opacity-30 blur transition duration-300 group-hover:opacity-50 md:rounded-xl"></div>
            <div className="relative transform rounded-lg border border-amber-500/30 bg-gradient-to-br from-amber-900/20 to-amber-800/20 p-2 text-center backdrop-blur-sm transition-all duration-300 group-hover:scale-105 md:rounded-xl md:p-4">
              <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-lg transition-shadow duration-300 group-hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] md:mb-2 md:h-12 md:w-12">
                <Video className="h-3 w-3 text-black md:h-6 md:w-6" />
              </div>
              <div className="mb-0.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-sm font-black text-transparent md:mb-1 md:text-2xl">
                7 Min
              </div>
              <div className="text-[10px] font-semibold text-gray-300 md:text-xs">
                Video Creation
              </div>
            </div>
          </div>
        </div>

        <div className="group flex-1">
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 opacity-30 blur transition duration-300 group-hover:opacity-50 md:rounded-xl"></div>
            <div className="relative transform rounded-lg border border-amber-500/30 bg-gradient-to-br from-amber-900/20 to-amber-800/20 p-2 text-center backdrop-blur-sm transition-all duration-300 group-hover:scale-105 md:rounded-xl md:p-4">
              <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-lg transition-shadow duration-300 group-hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] md:mb-2 md:h-12 md:w-12">
                <TrendingUp className="h-3 w-3 text-black md:h-6 md:w-6" />
              </div>
              <div className="mb-0.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-sm font-black text-transparent md:mb-1 md:text-2xl">
                100+
              </div>
              <div className="text-[10px] font-semibold text-gray-300 md:text-xs">
                Monthly Leads
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))

  SecureCheckout.displayName = 'SecureCheckout'

  const GuaranteeSection = memo(() => (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 md:py-20">
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <div
          className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-amber-500 blur-3xl"
          style={{ animationDuration: '6s' }}
        />
        <div
          className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-amber-400 blur-3xl"
          style={{ animationDuration: '8s' }}
        />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 md:px-6">
        <div
          className={`rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-2xl md:p-12 ${tilt}`}
        >
          <div className="mb-6 flex justify-center md:mb-8">
            <div className="relative">
              <div
                className="grid h-24 w-24 animate-pulse place-items-center rounded-full bg-gradient-to-br from-amber-500 to-amber-600 shadow-2xl md:h-40 md:w-40"
                style={{ animationDuration: '3s' }}
              >
                <Shield className="h-12 w-12 text-white md:h-20 md:w-20" />
              </div>
              <div className="absolute -top-2 -right-2 grid h-12 w-12 place-items-center rounded-full border-4 border-white bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-xl md:h-16 md:w-16">
                <CheckCircle className="h-6 w-6 text-white md:h-8 md:w-8" />
              </div>
            </div>
          </div>
          <div className="mb-4 text-center md:mb-6">
            <div className="mb-3 inline-block rounded-full border-2 border-amber-500/40 bg-gradient-to-r from-amber-50 to-amber-100 px-4 py-2 md:mb-4 md:px-6 md:py-3">
              <p className="text-xs font-black tracking-wide text-amber-700 uppercase md:text-base">
                100% Money-Back Guarantee
              </p>
            </div>
          </div>
          <div className="font-sans mb-4 text-center text-2xl leading-tight font-black text-gray-900 md:mb-6 md:text-5xl" role="heading" aria-level={2}>
            Zero Risk, All Reward
          </div>
          <div className="mx-auto mb-6 max-w-3xl space-y-4 text-sm leading-relaxed text-gray-700 md:mb-8 md:space-y-5 md:text-lg">
            <p className="text-center">
              Try{' '}
              <span className="font-black text-gray-900">7 Min AgentClone</span>{' '}
              risk-free. Get instant access to all templates, system prompts,
              and training videos.
            </p>
            <div className="rounded-2xl border-2 border-amber-500/30 bg-gradient-to-r from-amber-50 to-amber-100 p-4 md:p-6">
              <p className="text-center font-semibold text-gray-800">
                If you don't generate quality leads within{' '}
                <span className="font-black text-amber-700">30 days</span>,
                simply email us for a{' '}
                <span className="font-black text-amber-700">full refund</span>.
                No questions asked. You even keep all the materials.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <div className="flex items-center gap-2">
                <div className="grid h-5 w-5 place-items-center rounded-full bg-amber-500 md:h-6 md:w-6">
                  <CheckCircle className="h-3 w-3 text-white md:h-4 md:w-4" />
                </div>
                <span className="text-xs font-semibold text-gray-700 md:text-sm">
                  30 Day Guarantee
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="grid h-5 w-5 place-items-center rounded-full bg-amber-500 md:h-6 md:w-6">
                  <CheckCircle className="h-3 w-3 text-white md:h-4 md:w-4" />
                </div>
                <span className="text-xs font-semibold text-gray-700 md:text-sm">
                  Keep All Materials
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="grid h-5 w-5 place-items-center rounded-full bg-amber-500 md:h-6 md:w-6">
                  <CheckCircle className="h-3 w-3 text-white md:h-4 md:w-4" />
                </div>
                <span className="text-xs font-semibold text-gray-700 md:text-sm">
                  No Questions Asked
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            {/* Main CTA Button */}
            <button
              onClick={() => handleCheckout('hero_cta')}
              disabled={checkoutLoading !== null}
              className="group relative inline-block w-full max-w-3xl disabled:cursor-wait disabled:opacity-75"
            >
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 opacity-75 blur-lg transition duration-300 group-hover:opacity-100"></div>
              <div className={`relative flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black tracking-wider text-black uppercase shadow-xl transition-all duration-300 group-hover:scale-105 hover:shadow-2xl md:gap-3 md:px-10 md:py-5 md:text-xl ${
                checkoutLoading === 'hero_cta'
                  ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600'
                  : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600'
              }`}>
                <span className="whitespace-nowrap">
                  {checkoutLoading === 'hero_cta' ? 'Processing...' : 'Get 100+ Leads - $37'}
                </span>
                {checkoutLoading === 'hero_cta' ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent md:h-7 md:w-7" />
                ) : (
                  <ArrowRight className="h-4 w-4 md:h-7 md:w-7" />
                )}
              </div>
            </button>

            {/* Try Free Demo Button */}
            <a
              href="/try-demo"
              className="group relative inline-flex w-full max-w-3xl items-center justify-center gap-2 rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 text-sm font-bold text-white uppercase transition-all duration-300 hover:scale-105 hover:border-amber-400/50 hover:bg-white/20 md:gap-3 md:px-10 md:py-4 md:text-lg"
            >
              <Play className="h-4 w-4 md:h-6 md:w-6" />
              <span className="whitespace-nowrap">Try Free Demo - See It In Action</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 md:h-6 md:w-6" />
            </a>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 md:text-sm">
              <Shield className="h-4 w-4 text-amber-400 md:h-5 md:w-5" />
              <span className="font-semibold">
                30-Day Money-Back Guarantee • Instant Access • Secure Checkout
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  ))

  GuaranteeSection.displayName = 'GuaranteeSection'

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-gray-900 select-none">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 z-50 h-1 w-full bg-gray-100">
        <div
          className="h-full bg-blue-900 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Security Popup */}
      {showSecurityPopup && (
        <div className="animate-in fade-in slide-in-from-top-2 fixed top-20 left-1/2 z-[100] w-[90%] max-w-md -translate-x-1/2 duration-300">
          <div className="relative">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-900">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-sans mb-1 text-lg font-bold text-gray-900">
                    Content Protected
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">
                    This content is protected. Please respect our intellectual
                    property rights.
                  </p>
                </div>
                <button
                  onClick={() => setShowSecurityPopup(false)}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <AlertCircle className="h-4 w-4" />
                <span>For authorized use only</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky CTA Bar - Optimized for mobile */}
      <div
        className={`fixed top-0 right-0 left-0 z-40 border-b border-amber-500/20 bg-black/95 shadow-2xl backdrop-blur-md transition-transform duration-300 ${showStickyCTA ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2.5 md:gap-4 md:py-3">
          <div className="flex items-center gap-2 md:gap-3">
            <Sparkles className="h-4 w-4 flex-shrink-0 text-amber-400 md:h-5 md:w-5" />
            <span className="text-xs font-bold text-white md:text-base">
              7 Min AgentClone - $37
            </span>
          </div>
          <button
            onClick={() => handleCheckout('sticky_cta')}
            disabled={checkoutLoading !== null}
            className={`rounded-2xl px-4 py-3 text-sm font-black whitespace-nowrap text-black uppercase transition-transform duration-200 active:scale-95 disabled:cursor-wait disabled:opacity-75 md:px-10 md:py-5 md:text-xl ${
              checkoutLoading === 'sticky_cta'
                ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600'
                : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600'
            }`}
          >
            {checkoutLoading === 'sticky_cta' ? 'Processing...' : 'Get 100+ Leads - $37'}
          </button>
        </div>
      </div>

      {/* Top banner */}
      <div className="sticky top-0 z-30 border-b-2 border-amber-400 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 shadow-xl">
        <div className="mx-auto max-w-7xl px-3 py-2 text-center md:py-3">
          <p className="text-[10px] font-black tracking-wide text-white uppercase md:text-sm">
            Limited Time {today}
          </p>
          <p className="text-[9px] font-semibold text-white/90 md:text-xs">
            Price jumps to $97 in: <span className="font-black text-amber-300">{timeLeft}</span>
          </p>
        </div>
      </div>

      {/* HERO SECTION - DARK */}
      <section className="relative overflow-hidden bg-black py-6 md:py-12">
        {/* Static background gradient - removed animations for performance */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-48 -left-48 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-amber-500/30 to-amber-600/30 blur-[120px]" />
          <div className="absolute top-1/4 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-amber-400/20 to-amber-500/20 blur-[140px]" />
          <div className="absolute bottom-0 left-1/3 h-[700px] w-[700px] rounded-full bg-gradient-to-r from-amber-500/15 to-amber-400/15 blur-[160px]" />
        </div>

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(251, 191, 36, 0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl px-4 md:px-6">
          <Card>
            <div className="space-y-6 text-center md:space-y-8">
              <h1 className="font-sans px-2 text-3xl leading-[1.2] font-black tracking-tight uppercase sm:text-4xl md:text-5xl lg:text-6xl">
                <span className="text-white">Get </span>
                <span className="inline-block animate-pulse bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
                  5-15 Leads
                </span>
                <span className="text-white">
                  {' '}
                  This Week by turning your image to AI Video in{' '}
                </span>
                <span
                  className="inline-block animate-pulse bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent"
                  style={{ animationDelay: '0.5s' }}
                >
                  7 Minutes
                </span>
              </h1>

              <p className="mx-auto max-w-3xl px-2 text-base leading-relaxed text-gray-300 md:text-lg">
                Zero experience needed, start getting{' '}
                <span className="font-bold text-amber-400">
                  100+ Real Buyer Leads Monthly
                </span>
              </p>

              <div className="mx-auto max-w-4xl">
                <div className="group relative">
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 opacity-75 blur-xl transition duration-500 group-hover:opacity-100"></div>
                  <div className="relative">
                    <div className="rounded-2xl border-2 border-amber-400/40 bg-gradient-to-br from-amber-400/20 to-amber-500/20 p-1 shadow-2xl backdrop-blur-sm">
                      <div className="rounded-xl bg-amber-400/5 p-2 text-center">
                        <p className="mb-2 text-xs font-bold tracking-wider text-amber-300 uppercase md:text-sm">
                          PLAY THIS WITH SOUND ON
                        </p>
                      </div>
                      {/* Professional Video Player */}
                      <div className="overflow-hidden rounded-2xl border border-gray-800/50 bg-black shadow-2xl">
                        <div
                          className="group relative"
                          style={{ padding: '56.67% 0 0 0' }}
                        >
                          {/* HTML5 Video - MAXIMUM PERFORMANCE: preload=none for instant LCP */}
                          <video
                            ref={videoRef}
                            className="absolute top-0 left-0 h-full w-full bg-black object-contain"
                            playsInline
                            preload="none"
                            poster="/videos/VSL-thumbnail.jpg"
                            muted={videoMuted}
                          >
                            <source
                              src="/videos/VSL-optimized.mp4"
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>

                          {/* Continue Watching Modal - Screenshot 3 */}
                          {showContinueModal && !videoPlaying && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95">
                              <div className="max-w-2xl px-6 text-center">
                                {/* Green bar at top */}
                                <div className="mb-8 h-2 bg-amber-500"></div>

                                <h2 className="font-sans mb-8 text-3xl font-bold text-white md:text-4xl">
                                  You have already started watching this video
                                </h2>

                                <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:gap-12">
                                  {/* Continue watching button */}
                                  <button
                                    onClick={() => {
                                      setShowContinueModal(false)
                                      setVideoStarted(true)
                                      if (videoRef.current) {
                                        videoRef.current.muted = false
                                        videoRef.current.currentTime =
                                          savedVideoTime
                                        videoRef.current.play()
                                      }
                                    }}
                                    className="group flex items-center gap-4 text-white transition-colors hover:text-amber-400"
                                  >
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white transition-colors group-hover:border-amber-400 md:h-20 md:w-20">
                                      <Play className="h-8 w-8 fill-white transition-colors group-hover:fill-amber-400 md:h-10 md:w-10" />
                                    </div>
                                    <span className="text-xl font-bold md:text-2xl">
                                      Continue watching?
                                    </span>
                                  </button>

                                  {/* Start from beginning button */}
                                  <button
                                    onClick={() => {
                                      setShowContinueModal(false)
                                      setVideoStarted(true)
                                      // Clear both time and completed flag when starting from beginning
                                      localStorage.removeItem('heroVideoTime')
                                      localStorage.removeItem(
                                        'heroVideoCompleted'
                                      )
                                      if (videoRef.current) {
                                        videoRef.current.muted = false
                                        videoRef.current.currentTime = 0
                                        videoRef.current.play()
                                      }
                                    }}
                                    className="group flex items-center gap-4 text-white transition-colors hover:text-amber-400"
                                  >
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white transition-colors group-hover:border-amber-400 md:h-20 md:w-20">
                                      <div className="flex h-8 w-8 items-center justify-center text-2xl font-bold md:h-10 md:w-10 md:text-3xl">
                                        ↻
                                      </div>
                                    </div>
                                    <span className="text-xl font-bold md:text-2xl">
                                      Start from beginning?
                                    </span>
                                  </button>
                                </div>

                                {/* Green bar at bottom */}
                                <div className="mt-8 h-2 bg-amber-500"></div>
                              </div>
                            </div>
                          )}

                          {/* Minimal Play Button Overlay - Shows video thumbnail! */}
                          {!videoStarted && !showContinueModal && (
                            <div
                              className="group absolute inset-0 z-40 cursor-pointer"
                              onClick={() => {
                                if (videoRef.current) {
                                  setVideoStarted(true)
                                  localStorage.removeItem('heroVideoCompleted')
                                  videoRef.current.muted = false
                                  videoRef.current.play()
                                }
                              }}
                            >
                              {/* Dark overlay on hover */}
                              <div className="absolute inset-0 bg-black/30 transition-all duration-300 group-hover:bg-black/50"></div>

                              {/* Large Play Button Center */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative">
                                  {/* Animated rings */}
                                  <div
                                    className="absolute inset-0 animate-ping rounded-full bg-white/20"
                                    style={{ animationDuration: '2s' }}
                                  ></div>
                                  <div
                                    className="absolute inset-0 animate-pulse rounded-full bg-white/10"
                                    style={{ animationDuration: '3s' }}
                                  ></div>

                                  {/* Play button */}
                                  <div className="relative rounded-full bg-white p-8 shadow-2xl transition-transform duration-300 group-hover:scale-110 md:p-10">
                                    <Play className="h-16 w-16 fill-black text-black md:h-20 md:w-20" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Video Controls Overlay - Shows on hover */}
                          <div className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <div className="pointer-events-auto absolute right-0 bottom-0 left-0 p-4 md:p-6">
                              {/* Controls Container */}
                              <div className="flex items-center gap-3 md:gap-4">
                                {/* Play/Pause Toggle */}
                                <button
                                  onClick={() => {
                                    if (videoRef.current) {
                                      if (videoPlaying) {
                                        videoRef.current.pause()
                                      } else {
                                        videoRef.current.play()
                                      }
                                    }
                                  }}
                                  aria-label={videoPlaying ? "Pause video" : "Play video"}
                                  className="transform rounded-full bg-white/20 p-2 backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white/30 active:scale-95 md:p-3"
                                >
                                  {videoPlaying ? (
                                    <Pause className="h-5 w-5 fill-white text-white md:h-6 md:w-6" />
                                  ) : (
                                    <Play className="h-5 w-5 fill-white text-white md:h-6 md:w-6" />
                                  )}
                                </button>

                                {/* Mute/Unmute */}
                                <button
                                  onClick={() => {
                                    if (videoRef.current) {
                                      const newMuted = !videoMuted
                                      setVideoMuted(newMuted)
                                      videoRef.current.muted = newMuted
                                    }
                                  }}
                                  aria-label={videoMuted ? "Unmute video" : "Mute video"}
                                  className="transform rounded-full bg-white/20 p-2 backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white/30 active:scale-95 md:p-3"
                                >
                                  {videoMuted ? (
                                    <VolumeX className="h-5 w-5 text-white md:h-6 md:w-6" />
                                  ) : (
                                    <Volume2 className="h-5 w-5 text-white md:h-6 md:w-6" />
                                  )}
                                </button>

                                {/* Fullscreen */}
                                <button
                                  onClick={() => {
                                    if (videoRef.current) {
                                      if (videoRef.current.requestFullscreen) {
                                        videoRef.current.requestFullscreen()
                                      }
                                    }
                                  }}
                                  aria-label="Enter fullscreen mode"
                                  className="ml-auto transform rounded-full bg-white/20 p-2 backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white/30 active:scale-95 md:p-3"
                                >
                                  <Maximize className="h-5 w-5 text-white md:h-6 md:w-6" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Click anywhere to TOGGLE play/pause - FIXED WITH HIGHER Z-INDEX */}
                          {videoStarted && !showContinueModal && (
                            <div
                              className="absolute inset-0 z-35 cursor-pointer"
                              onClick={(e) => {
                                // Get click position for ripple effect
                                const rect = e.currentTarget.getBoundingClientRect()
                                const x = e.clientX - rect.left
                                const y = e.clientY - rect.top
                                setClickPosition({ x, y })

                                // Show feedback
                                setShowClickFeedback(true)
                                setTimeout(() => setShowClickFeedback(false), 600)

                                // Toggle play/pause
                                if (videoRef.current) {
                                  if (videoPlaying) {
                                    videoRef.current.pause()
                                  } else {
                                    videoRef.current.play()
                                  }
                                }
                              }}
                              onTouchEnd={(e) => {
                                // Better touch support for mobile
                                e.preventDefault()
                                const touch = e.changedTouches[0]
                                const rect = e.currentTarget.getBoundingClientRect()
                                const x = touch.clientX - rect.left
                                const y = touch.clientY - rect.top
                                setClickPosition({ x, y })

                                setShowClickFeedback(true)
                                setTimeout(() => setShowClickFeedback(false), 600)

                                if (videoRef.current) {
                                  if (videoPlaying) {
                                    videoRef.current.pause()
                                  } else {
                                    videoRef.current.play()
                                  }
                                }
                              }}
                            >
                              {/* Ripple Effect on Click */}
                              {showClickFeedback && (
                                <div
                                  className="pointer-events-none absolute"
                                  style={{
                                    left: `${clickPosition.x}px`,
                                    top: `${clickPosition.y}px`,
                                    transform: 'translate(-50%, -50%)',
                                  }}
                                >
                                  <div className="h-32 w-32 animate-ping rounded-full bg-white/30 md:h-40 md:w-40"></div>
                                </div>
                              )}

                              {/* Play/Pause Icon Feedback - Shows briefly on click */}
                              {showClickFeedback && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="animate-in zoom-in fade-in rounded-full bg-black/60 p-8 backdrop-blur-sm duration-200 md:p-10">
                                    {videoPlaying ? (
                                      <Play className="h-16 w-16 fill-white text-white md:h-20 md:w-20" />
                                    ) : (
                                      <Pause className="h-16 w-16 fill-white text-white md:h-20 md:w-20" />
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* CONVERSION BOOST: Progress Milestone Popup */}
                              {showMilestone && milestoneMessage && (
                                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                  <div className="animate-in zoom-in fade-in max-w-sm rounded-2xl border-2 border-amber-400/50 bg-gradient-to-r from-amber-500/20 via-amber-400/20 to-amber-500/20 px-6 py-4 text-center backdrop-blur-xl duration-300 md:px-8 md:py-5">
                                    <p className="text-base font-black text-white md:text-lg">
                                      {milestoneMessage}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* CONVERSION BOOST: Strategic CTA at 70% */}
                              {videoPlaying && videoProgress >= 70 && videoProgress < 92 && (
                                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 md:bottom-24">
                                  <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                                    <button
                                      onClick={() => {
                                        // Scroll to checkout section
                                        document.getElementById('checkout-section')?.scrollIntoView({
                                          behavior: 'smooth',
                                          block: 'center'
                                        })
                                      }}
                                      className="group relative"
                                    >
                                      <div className="absolute -inset-1 animate-pulse rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 opacity-75 blur-lg"></div>
                                      <div className="relative flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 transition-transform duration-200 hover:scale-105 active:scale-95 md:px-8 md:py-4">
                                        <span className="text-sm font-black text-white md:text-base">
                                          Ready? Unlock $37 Price Now
                                        </span>
                                        <ArrowRight className="h-5 w-5 text-white" />
                                      </div>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* BIGGER, SUPER SMOOTH Progress Bar */}
                        <div className="relative h-3 w-full bg-gray-900 md:h-4">
                          {/* Simple green progress bar - BUTTERY SMOOTH with easing */}
                          <div
                            className="absolute top-0 left-0 h-full bg-amber-500"
                            style={{
                              width: `${fakeProgress}%`,
                              transition: 'width 0.3s ease-out',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 px-2 pt-4 md:gap-6">
                {/* Try Free Demo Button - HIDDEN until optimized */}
                {/* <a
                  href="/try-demo"
                  className="group relative inline-block w-full max-w-3xl"
                >
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-50 blur-lg transition duration-300 group-hover:opacity-75"></div>
                  <div className="relative flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 px-4 py-3 text-sm font-black tracking-wider text-white uppercase shadow-2xl transition-transform duration-300 group-hover:scale-105 md:gap-3 md:px-10 md:py-4 md:text-lg">
                    <Sparkles className="h-4 w-4 md:h-6 md:w-6" />
                    <span className="whitespace-nowrap">
                      Try Free Demo - See It Work
                    </span>
                    <ArrowRight className="h-4 w-4 md:h-6 md:w-6" />
                  </div>
                </a>

                <div className="text-center text-sm text-gray-400 md:text-base">
                  <span className="font-semibold">OR</span>
                </div> */}

                <div className="space-y-2 text-center md:space-y-3">
                  <div className="price-reveal">
                    <div className="flex flex-wrap items-center justify-center gap-2 px-2">
                      <span className="text-lg font-black text-red-400 uppercase line-through decoration-2 md:text-xl">
                        FROM $97
                      </span>
                      <span className="text-lg font-black text-white uppercase md:text-xl">
                        FOR ONLY
                      </span>
                    </div>
                    <div className="mt-2 text-5xl font-black tracking-tight text-green-400 md:text-6xl">
                      US$ 37
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleCheckout('price_unlock_cta')}
                  disabled={checkoutLoading !== null}
                  className="group relative inline-block w-full max-w-3xl px-2 disabled:cursor-wait disabled:opacity-75"
                >
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-green-500 via-green-400 to-green-500 opacity-75 blur-lg transition duration-300 group-hover:opacity-100"></div>
                  <div
                    className={`relative flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black tracking-wider text-white uppercase shadow-2xl transition-transform duration-300 active:scale-95 md:gap-3 md:px-10 md:py-5 md:text-xl pump-animation ${
                      checkoutLoading === 'price_unlock_cta'
                        ? 'bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500'
                        : 'bg-gradient-to-r from-green-500 via-green-400 to-green-500'
                    }`}
                  >
                    {checkoutLoading === 'price_unlock_cta' ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent md:h-7 md:w-7" />
                    ) : (
                      <Zap className="h-4 w-4 md:h-7 md:w-7" />
                    )}
                    <span className="whitespace-nowrap">
                      {checkoutLoading === 'price_unlock_cta'
                        ? 'Processing...'
                        : 'Get AgentClone™ - $37'}
                    </span>
                  </div>
                </button>

                <div className="flex items-center justify-center gap-2 rounded-full border border-red-500/50 bg-gradient-to-r from-red-600/95 to-red-700/95 px-3 py-2 shadow-lg backdrop-blur-sm md:px-4 md:py-2">
                  <AlertCircle className="h-3 w-3 text-white md:h-4 md:w-4" />
                  <span className="text-[10px] font-bold tracking-wide text-white uppercase md:text-sm">
                    Price jumps to <span className="text-amber-300">$97</span>{' '}
                    tonight
                  </span>
                  <Clock className="h-3 w-3 text-white md:h-4 md:w-4" />
                </div>

                <SecureCheckout />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Lazy load sentinel - triggers below-the-fold content */}
      <div ref={belowFoldRef} className="h-px" />

      {/* Below-the-fold content - lazy loaded for performance */}
      {showBelowFold && (
        <>
          {/* ERIC RIES QUOTE - MOBILE OPTIMIZED */}
          <section className="relative overflow-hidden bg-black py-8 md:py-20">
        {/* Single background glow - simplified for mobile */}
        <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-600/10 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl px-4">
          {/* Main quote card */}
          <div className="relative">
            {/* Subtle gradient border - less animation on mobile */}
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-amber-400/50 to-amber-500/50 opacity-75 blur md:-inset-1 md:rounded-3xl"></div>

            {/* Card content */}
            <div className="relative rounded-2xl border border-amber-500/30 bg-gradient-to-br from-gray-900 to-black p-5 shadow-2xl md:rounded-3xl md:p-12">
              <div className="flex flex-col items-center gap-5 md:flex-row md:gap-12">
                {/* Eric Ries Image - smaller on mobile */}
                <div className="relative flex-shrink-0">
                  {/* Single gradient ring - simpler on mobile */}
                  <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 opacity-60 blur-md"></div>

                  {/* Image */}
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-amber-400 shadow-xl md:h-40 md:w-40 md:border-4">
                    <Image
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
                      alt="Eric Ries"
                      fill
                      sizes="(max-width: 768px) 96px, 160px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Quote Content */}
                <div className="flex-1 text-center md:text-left">
                  {/* Quote Text - compact on mobile */}
                  <blockquote className="space-y-3 md:space-y-5">
                    <p className="text-xl font-black leading-tight text-white md:text-4xl lg:text-5xl">
                      The only way to win is to{' '}
                      <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
                        learn faster
                      </span>{' '}
                      than anyone else
                    </p>

                    {/* Attribution - compact on mobile */}
                    <footer className="border-t border-amber-500/20 pt-3 md:pt-4">
                      <cite className="block bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-lg font-black text-transparent not-italic md:text-2xl">
                        Eric Ries
                      </cite>
                      <p className="mt-1 text-xs text-gray-400 md:text-base">
                        Author of "The Lean Startup"
                      </p>
                    </footer>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - LIGHT */}
      <section className="relative bg-white py-10 text-black md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Card>
            <div className="mb-6 text-center md:mb-10">
              <div className="mb-4 inline-flex items-center gap-3 rounded-full border-2 border-amber-600 bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2 shadow-lg md:mb-6 md:px-6 md:py-3">
                <span className="text-xs font-black text-black uppercase md:text-base">
                  7 Minute AI Agent System
                </span>
                <Zap className="h-4 w-4 text-black md:h-5 md:w-5" />
              </div>
            </div>
            <div className="mb-8 px-4 text-center md:mb-10">
              <h3 className="font-sans mb-3 text-2xl font-black md:mb-4 md:text-5xl">
                From Image to Realistic Talking Video{' '}
                <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
                  4 Simple Steps
                </span>
              </h3>
              <p className="mx-auto max-w-2xl text-sm text-gray-700 md:text-xl">
                No technical skills, no filming,{' '}
                <span className="font-black text-amber-700">
                  just copy and paste.
                </span>
              </p>
            </div>
          </Card>

          <div className="mb-8 grid grid-cols-2 gap-3 px-4 md:mb-10 md:grid-cols-4 md:gap-6">
            {[
              {
                num: '1',
                title: 'AI Video Script',
                desc: 'Paste a ready prompt',
                icon: Wand2,
                gradient: 'from-pink-500 to-rose-600',
                bg: 'bg-pink-500',
              },
              {
                num: '2',
                title: 'Upload Photo',
                desc: 'Just one image needed',
                icon: Upload,
                gradient: 'from-purple-500 to-violet-600',
                bg: 'bg-purple-500',
              },
              {
                num: '3',
                title: 'Video Created',
                desc: 'Realistic AI video ready',
                icon: Video,
                gradient: 'from-amber-500 to-amber-600',
                bg: 'bg-amber-500',
              },
              {
                num: '4',
                title: 'Get Leads',
                desc: 'Watch leads pour in',
                icon: TrendingUp,
                gradient: 'from-amber-500 to-amber-600',
                bg: 'bg-amber-500',
              },
            ].map((s, i) => (
              <Card key={i}>
                <div
                  className={`rounded-3xl border-2 border-gray-200 bg-white p-3 text-center hover:border-gray-300 hover:shadow-2xl md:p-6 ${tilt}`}
                >
                  <div
                    className={`mx-auto mb-3 h-12 w-12 rounded-full bg-gradient-to-br md:mb-6 md:h-20 md:w-20 ${s.gradient} grid place-items-center shadow-xl`}
                  >
                    <span className="text-lg font-black text-white md:text-3xl">
                      {s.num}
                    </span>
                  </div>
                  <div
                    className={`mx-auto mb-2 h-10 w-10 md:mb-4 md:h-14 md:w-14 ${s.bg} grid place-items-center rounded-2xl shadow-lg`}
                  >
                    <s.icon className="h-5 w-5 text-white md:h-7 md:w-7" />
                  </div>
                  <h4 className="mb-1 text-xs font-black text-gray-900 md:mb-2 md:text-xl">
                    {s.title}
                  </h4>
                  <p className="text-[10px] font-semibold text-gray-600 md:text-sm">
                    {s.desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <div className="mx-auto grid max-w-5xl gap-4 px-4 md:grid-cols-2 md:gap-6">
            <Card>
              <div
                className={`rounded-3xl border-2 border-red-200 bg-gradient-to-br from-red-50 via-pink-50 to-red-50 p-4 shadow-lg md:p-8 ${tilt}`}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 shadow-xl md:h-16 md:w-16">
                    <X className="h-6 w-6 text-white md:h-8 md:w-8" />
                  </div>
                  <div>
                    <h5 className="mb-2 text-base font-black text-red-900 md:text-xl">
                      Unlike traditional methods
                    </h5>
                    <p className="text-xs text-gray-700 md:text-base">
                      You do not need expensive equipment or a film crew.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
            <Card>
              <div
                className={`rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 p-4 shadow-lg md:p-8 ${tilt}`}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-xl md:h-16 md:w-16">
                    <Sparkles className="h-6 w-6 text-white md:h-8 md:w-8" />
                  </div>
                  <div>
                    <h5 className="mb-2 text-base font-black text-amber-900 md:text-xl">
                      AI handles everything
                    </h5>
                    <p className="text-xs text-gray-700 md:text-base">
                      Automatic script, voice, and video generation.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* OFFER VALUE STACK - DARK */}
      <section className="relative overflow-hidden bg-gradient-to-b from-black via-gray-950 to-black py-12 md:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-amber-500/5 blur-[200px]" />
          <div className="absolute right-1/4 bottom-0 h-[600px] w-[600px] rounded-full bg-amber-500/5 blur-[180px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <Card>
            <div className="mb-12 text-center md:mb-16">
              <h2 className="font-sans mb-6 px-4 text-3xl leading-[1.1] font-black md:mb-8 md:text-6xl lg:text-7xl">
                <span className="mb-2 block text-white">
                  You Don't Need More Information.
                </span>
                <span className="mb-2 block text-white">
                  You Need Execution.
                </span>
                <span className="text-white">That's </span>
                <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
                  What We Deliver.
                </span>
              </h2>

              <div className="mb-4 flex items-center justify-center gap-4 md:mb-6 md:gap-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/50 md:w-16"></div>
                <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-4xl font-black text-transparent md:text-6xl">
                  $37
                </span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/50 md:w-16"></div>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/10 px-4 py-2 backdrop-blur-sm md:gap-3 md:px-8 md:py-3">
                <span className="text-sm text-gray-400 line-through md:text-lg">
                  $1,561
                </span>
                <ArrowRight className="h-4 w-4 text-amber-400 md:h-5 md:w-5" />
                <span className="text-sm font-black text-amber-400 md:text-lg">
                  Save $1,524 Today
                </span>
              </div>
            </div>
          </Card>

          <div className="mb-12 grid gap-8 md:mb-16 md:gap-10 lg:grid-cols-2">
            {products.map((p, i) => (
              <div
                key={i}
                className="group overflow-hidden rounded-2xl border-2 border-gray-800 bg-gray-900/40 backdrop-blur-sm transition-all duration-300 hover:border-amber-400/40"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-900">
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      priority={i < 2}
                      loading={i < 2 ? undefined : 'lazy'}
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="inline-block rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-black md:px-4 md:py-1.5 md:text-sm">
                      Module {i + 1}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="rounded-lg border border-amber-400/30 bg-black/80 px-3 py-1 backdrop-blur-sm md:px-4 md:py-2">
                      <span className="text-sm font-black text-amber-400 md:text-lg">
                        ${p.value}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <h3 className="font-sans mb-3 text-xl leading-tight font-black text-white md:text-2xl">
                    {p.title}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-gray-400 md:text-base">
                    {p.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-amber-400" />
                      <span>Instant Access</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-amber-400" />
                      <span>Step-by-Step</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-12 rounded-2xl border-2 border-gray-800 bg-gray-900/40 p-8 backdrop-blur-sm md:mb-16 md:p-12">
            <div className="mb-8 text-center md:mb-12">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 md:px-6 md:py-2">
                <Sparkles className="h-4 w-4 text-amber-400 md:h-5 md:w-5" />
                <span className="text-xs font-black text-amber-400 uppercase md:text-sm">
                  Bonus Content
                </span>
              </div>
              <h3 className="font-sans mb-2 text-2xl font-black text-white md:text-4xl">
                3 Premium Add-Ons Included
              </h3>
              <p className="text-sm text-gray-400 md:text-base">
                No extra cost • Instant access
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 md:gap-8">
              {bonuses.map((b, i) => (
                <div
                  key={i}
                  className="group overflow-hidden rounded-xl border-2 border-gray-700 bg-gray-800/40 transition-all duration-300 hover:border-amber-400/40"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-900">
                    {b.image && (
                      <Image
                        src={b.image}
                        alt={b.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="inline-block rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-black">
                        Bonus {i + 1}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 md:p-6">
                    <h4 className="mb-3 text-base leading-tight font-black text-white md:text-lg">
                      {b.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-amber-400 md:text-xl">
                        ${b.value} Value
                      </span>
                      <CheckCircle className="h-5 w-5 text-amber-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card>
            <div className="mt-10 flex flex-col items-center gap-4 px-4 md:mt-12 md:gap-6">
              <div className="w-full max-w-4xl">
                <div className="mb-4 rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 md:mb-6 md:p-8">
                  <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4 md:gap-6">
                    <div className="space-y-1 md:space-y-2">
                      <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-2xl font-black text-transparent md:text-4xl">
                        $1,561
                      </div>
                      <div className="text-xs font-semibold text-gray-400 md:text-sm">
                        Total Value
                      </div>
                    </div>
                    <div className="space-y-1 md:space-y-2">
                      <div className="text-2xl font-black text-amber-400 md:text-4xl">
                        $37
                      </div>
                      <div className="text-xs font-semibold text-gray-400 md:text-sm">
                        Today's Price
                      </div>
                    </div>
                    <div className="space-y-1 md:space-y-2">
                      <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-2xl font-black text-transparent md:text-4xl">
                        98%
                      </div>
                      <div className="text-xs font-semibold text-gray-400 md:text-sm">
                        Discount
                      </div>
                    </div>
                    <div className="space-y-1 md:space-y-2">
                      <div className="text-2xl font-black text-white md:text-4xl">
                        7min
                      </div>
                      <div className="text-xs font-semibold text-gray-400 md:text-sm">
                        To Results
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCheckout('mid_page_cta')}
                disabled={checkoutLoading !== null}
                className="group relative inline-block w-full max-w-3xl disabled:cursor-wait disabled:opacity-75"
              >
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 opacity-75 blur-xl transition duration-300 group-hover:opacity-100"></div>
                <div className={`relative flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black tracking-wider text-black uppercase shadow-2xl transition-all duration-300 group-hover:scale-[1.02] md:gap-3 md:px-10 md:py-5 md:text-xl ${
                  checkoutLoading === 'mid_page_cta'
                    ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600'
                    : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600'
                }`}>
                  {checkoutLoading === 'mid_page_cta' ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent md:h-7 md:w-7" />
                  ) : (
                    <Zap className="h-4 w-4 md:h-7 md:w-7" />
                  )}
                  <span className="whitespace-nowrap">
                    {checkoutLoading === 'mid_page_cta' ? 'Processing...' : 'Get 100+ Leads - $37'}
                  </span>
                  {checkoutLoading !== 'mid_page_cta' && <ArrowRight className="h-4 w-4 md:h-7 md:w-7" />}
                </div>
              </button>

              <div className="flex items-center gap-2 text-xs text-gray-400 md:text-sm">
                <Shield className="h-4 w-4 text-amber-400 md:h-5 md:w-5" />
                <span className="font-semibold">
                  30-Day Money-Back Guarantee • Instant Access • Secure Checkout
                </span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* GUARANTEE SECTION - LIGHT */}
      <GuaranteeSection />

      {/* CASE STUDY - DARK */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-black to-gray-950 py-10 md:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-0 left-1/4 h-[600px] w-[600px] animate-pulse rounded-full bg-amber-500/10 blur-[150px]"
            style={{ animationDuration: '8s' }}
          />
          <div
            className="absolute right-1/4 bottom-0 h-[600px] w-[600px] animate-pulse rounded-full bg-amber-500/10 blur-[150px]"
            style={{ animationDuration: '10s' }}
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8 text-center md:mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-gradient-to-r from-amber-500/20 to-amber-600/20 px-4 py-2 backdrop-blur-sm md:mb-6 md:px-6 md:py-3">
              <Award className="h-4 w-4 animate-pulse text-amber-400 md:h-5 md:w-5" />
              <span className="text-xs font-black tracking-wide text-amber-400 uppercase md:text-sm">
                Real Success Story
              </span>
            </div>
            <h2 className="mb-4 px-4 text-2xl leading-tight font-black md:text-5xl lg:text-6xl">
              <span className="text-white">How Mr. Lucas Sold a </span>
              <span className="text-amber-400">
                Palm Jumeirah Villa
              </span>
              <br />
              <span className="text-white">with a </span>
              <span className="text-amber-400">
                $1 Video
              </span>
            </h2>
          </div>

          <div className="mx-auto mb-10 grid max-w-7xl items-start gap-6 md:mb-14 md:gap-10 lg:grid-cols-2">
            <div
              className={`relative overflow-hidden rounded-3xl border border-amber-400/20 bg-gradient-to-br from-gray-900/95 to-black shadow-2xl ${tilt}`}
            >
              <div className="p-3 md:p-4">
                <div className="overflow-hidden rounded-2xl bg-black/50">
                  <div style={{ padding: '133.33% 0 0 0', position: 'relative' }}>
                    <video
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      playsInline
                      controls
                      preload="metadata"
                      poster="/videos/Mr-Lucas-thumbnail.jpg"
                    >
                      <source src="/videos/Mr-Lucas-optimized.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4 md:px-6 md:pb-6">
                <div className="mb-2 flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-amber-400 md:h-6 md:w-6" />
                  <h3 className="font-sans text-lg font-black text-white md:text-xl">
                    Mr. Lucas Actual Video
                  </h3>
                </div>
                <p className="text-xs text-gray-400 md:text-sm">
                  Created in 6 min • Sold for 17.9M AED
                </p>
              </div>
            </div>

            <div className="space-y-5 md:space-y-6">
              <div className="rounded-2xl border border-amber-400/20 bg-gray-900/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-amber-400/40 md:p-7">
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg md:h-12 md:w-12">
                    <Upload className="h-5 w-5 text-black md:h-6 md:w-6" />
                  </div>
                  <div>
                    <h4 className="mb-2 text-lg font-black text-amber-400 md:text-xl">
                      The Challenge
                    </h4>
                    <p className="text-sm leading-relaxed text-gray-300 md:text-base">
                      6 bedroom beachfront villa in Palm Jumeirah •{' '}
                      <span className="font-bold text-amber-400">
                        18.5M AED
                      </span>{' '}
                      listing price • Needed qualified buyer leads fast
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-400/20 bg-gray-900/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-amber-400/40 md:p-7">
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg md:h-12 md:w-12">
                    <Video className="h-5 w-5 animate-pulse text-black md:h-6 md:w-6" />
                  </div>
                  <div>
                    <h4 className="mb-2 text-lg font-black text-amber-400 md:text-xl">
                      The Solution
                    </h4>
                    <p className="text-sm leading-relaxed text-gray-300 md:text-base">
                      Used{' '}
                      <span className="font-bold text-amber-400">
                        7 Min AgentClone
                      </span>{' '}
                      to create AI talking video from one photo • Posted with{' '}
                      <span className="font-bold text-amber-400">
                        $1 boost
                      </span>{' '}
                      on Instagram + TikTok
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-amber-400/30 bg-gradient-to-br from-amber-900/30 to-amber-800/20 p-5 backdrop-blur-sm md:p-7">
                <div className="mb-5 flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg md:h-12 md:w-12">
                    <TrendingUp className="h-5 w-5 text-black md:h-6 md:w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-amber-400 md:text-xl">
                      The Results
                    </h4>
                  </div>
                </div>
                <div className="mb-5 grid grid-cols-2 gap-3 md:gap-4">
                  <div className="rounded-xl border border-amber-400/20 bg-black/30 p-3 transition-all hover:border-amber-400/40 md:p-4">
                    <DollarSign className="mb-2 h-5 w-5 text-amber-400 md:h-6 md:w-6" />
                    <p className="text-sm font-bold text-white md:text-base">
                      $1 boost
                    </p>
                    <p className="text-[10px] text-gray-400 md:text-xs">
                      Total ad spend
                    </p>
                  </div>
                  <div className="rounded-xl border border-amber-400/20 bg-black/30 p-3 transition-all hover:border-amber-400/40 md:p-4">
                    <Eye className="mb-2 h-5 w-5 text-amber-400 md:h-6 md:w-6" />
                    <p className="text-sm font-bold text-white md:text-base">
                      400K+ views
                    </p>
                    <p className="text-[10px] text-gray-400 md:text-xs">
                      Organic reach
                    </p>
                  </div>
                  <div className="rounded-xl border border-amber-400/20 bg-black/30 p-3 transition-all hover:border-amber-400/40 md:p-4">
                    <MessageCircle className="mb-2 h-5 w-5 text-amber-400 md:h-6 md:w-6" />
                    <p className="text-sm font-bold text-white md:text-base">
                      11 DMs
                    </p>
                    <p className="text-[10px] text-gray-400 md:text-xs">
                      By morning
                    </p>
                  </div>
                  <div className="rounded-xl border border-amber-400/20 bg-black/30 p-3 transition-all hover:border-amber-400/40 md:p-4">
                    <Clock className="mb-2 h-5 w-5 text-amber-400 md:h-6 md:w-6" />
                    <p className="text-sm font-bold text-white md:text-base">
                      9 days
                    </p>
                    <p className="text-[10px] text-gray-400 md:text-xs">
                      To offer
                    </p>
                  </div>
                </div>
                <div className="rounded-xl border border-amber-400/30 bg-gradient-to-r from-amber-400/20 to-amber-500/20 p-4 md:p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-8 w-8 flex-shrink-0 text-amber-400 md:h-10 md:w-10" />
                    <div>
                      <p className="mb-1 text-xl font-black text-amber-400 md:text-2xl">
                        17.9M AED Sold
                      </p>
                      <p className="text-sm font-semibold text-white md:text-base">
                        Offer accepted 9 days after posting
                      </p>
                      <p className="mt-1 text-xs text-gray-300 md:text-sm">
                        Closed in 21 days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Card>
            <div className="mt-8 px-4 text-center md:mt-12">
              <button
                onClick={() => handleCheckout('testimonial_cta')}
                disabled={checkoutLoading !== null}
                className="group relative inline-block w-full max-w-3xl disabled:cursor-wait disabled:opacity-75"
              >
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 opacity-75 blur-lg transition duration-300 group-hover:opacity-100"></div>
                <div className={`relative flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black tracking-wider text-black uppercase shadow-2xl transition-all duration-300 group-hover:scale-105 md:gap-3 md:px-10 md:py-5 md:text-xl ${
                  checkoutLoading === 'testimonial_cta'
                    ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600'
                    : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600'
                }`}>
                  {checkoutLoading === 'testimonial_cta' ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent md:h-7 md:w-7" />
                  ) : (
                    <Video className="h-4 w-4 md:h-7 md:w-7" />
                  )}
                  <span className="whitespace-nowrap">
                    {checkoutLoading === 'testimonial_cta' ? 'Processing...' : 'Get 100+ Leads - $37'}
                  </span>
                </div>
              </button>
            </div>
          </Card>
        </div>
      </section>

      {/* TESTIMONIALS - LIGHT */}
      <section className="relative overflow-hidden bg-white py-10 text-black md:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-amber-500 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-amber-500 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8 text-center md:mb-10">
            <Card>
              <h2 className="font-sans mb-3 text-2xl font-black md:mb-4 md:text-5xl">
                See More{' '}
                <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
                  AI Videos
                </span>{' '}
                in Action
              </h2>
              <p className="mx-auto max-w-2xl text-sm text-gray-700 md:text-xl">
                Real agents getting real results with AI powered videos, zero
                filming required
              </p>
            </Card>
          </div>

          <div className="mx-auto mb-8 grid max-w-6xl gap-6 md:mb-10 md:grid-cols-2 md:gap-8">
            {[
              {
                title: 'Agent Steven Video',
                videoSrc: '/videos/Steven-optimized.mp4',
                posterSrc: '/videos/Steven-thumbnail.jpg',
                aspectRatio: '133.33%', // 4:3 vertical - matches video better
              },
              {
                title: 'Agent Gabriel Video',
                videoSrc: '/videos/Gabriel-optimized.mp4',
                posterSrc: '/videos/Gabriel-thumbnail.jpg',
                aspectRatio: '133.33%', // 4:3 vertical - matches video better
              },
            ].map((v, i) => (
              <Card key={`video-${i}-${v.title}`}>
                <div
                  className={`overflow-hidden rounded-3xl border-2 border-gray-200 bg-white shadow-xl hover:border-amber-400/50 hover:shadow-2xl ${tilt}`}
                >
                  <div className="relative p-3 md:p-4">
                    <div className="absolute top-5 left-5 z-10 md:top-6 md:left-6">
                      <div className="rounded-full border border-white/20 bg-black/80 px-3 py-1 backdrop-blur-sm md:px-4 md:py-2">
                        <span className="text-[10px] font-bold tracking-wide text-white uppercase md:text-xs">
                          Real AI Video
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-2xl bg-black">
                      <div style={{ padding: `${v.aspectRatio} 0 0 0`, position: 'relative' }}>
                        <video
                          className="absolute top-0 left-0 w-full h-full object-cover"
                          playsInline
                          controls
                          preload="metadata"
                          poster={v.posterSrc}
                        >
                          <source src={v.videoSrc} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>                  </div>
                  <div className="bg-gradient-to-t from-gray-50 to-white p-4 md:p-6">
                    <div className="mb-2 flex items-center gap-3 md:mb-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 md:h-12 md:w-12">
                        <CheckCircle className="h-5 w-5 text-white md:h-7 md:w-7" />
                      </div>
                      <div>
                        <h3 className="font-sans text-base font-black text-gray-900 md:text-xl">
                          {v.title.replace(' Video', '')}
                        </h3>
                        <p className="text-xs font-semibold text-gray-600 md:text-sm">
                          Generated in 6,7 minutes
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 md:text-sm">
                      AI powered video, no filming, no equipment
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mb-8 space-y-3 md:mb-10 md:space-y-4">
            <Card>
              <div className="relative overflow-hidden">
                <div className="animate-scroll flex">
                  {[...Array(2)].map((_, setIndex) => (
                    <div
                      key={setIndex}
                      className="flex gap-3 pr-3 md:gap-4 md:pr-4"
                    >
                      {agents1.map((a, i) => (
                        <div
                          key={i}
                          className="group w-32 flex-shrink-0 md:w-48"
                        >
                          <div
                            className={`relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-lg hover:scale-105 hover:shadow-2xl ${tilt}`}
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-amber-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
                            <div className="relative h-40 w-full md:h-56">
                              <Image
                                src={a.img}
                                alt={a.name}
                                fill
                                sizes="(max-width: 768px) 128px, 192px"
                                className="object-cover"
                                loading="lazy"
                              />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            <div className="absolute right-0 bottom-0 left-0 translate-y-full transform p-2 transition-transform group-hover:translate-y-0 md:p-3">
                              <div className="flex items-start gap-2 text-white">
                                <CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-amber-400 md:h-4 md:w-4" />
                                <div>
                                  <p className="mb-0.5 text-[10px] font-black md:text-xs">
                                    {a.name}
                                  </p>
                                  <p className="text-[9px] font-semibold text-amber-400 md:text-[10px]">
                                    {a.loc}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <div className="relative overflow-hidden">
                <div className="animate-scroll-reverse flex">
                  {[...Array(2)].map((_, setIndex) => (
                    <div
                      key={setIndex}
                      className="flex gap-3 pr-3 md:gap-4 md:pr-4"
                    >
                      {agents2.map((a, i) => (
                        <div
                          key={i}
                          className="group w-32 flex-shrink-0 md:w-48"
                        >
                          <div
                            className={`relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-lg hover:scale-105 hover:shadow-2xl ${tilt}`}
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-amber-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
                            <div className="relative h-40 w-full md:h-56">
                              <Image
                                src={a.img}
                                alt={a.name}
                                fill
                                sizes="(max-width: 768px) 128px, 192px"
                                className="object-cover"
                                loading="lazy"
                              />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            <div className="absolute right-0 bottom-0 left-0 translate-y-full transform p-2 transition-transform group-hover:translate-y-0 md:p-3">
                              <div className="flex items-start gap-2 text-white">
                                <CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-amber-400 md:h-4 md:w-4" />
                                <div>
                                  <p className="mb-0.5 text-[10px] font-black md:text-xs">
                                    {a.name}
                                  </p>
                                  <p className="text-[9px] font-semibold text-amber-400 md:text-[10px]">
                                    {a.loc}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <div className="text-center">
              <div className="inline-flex flex-col items-center gap-3 rounded-2xl border-2 border-amber-400/30 bg-gradient-to-br from-amber-50 to-amber-100 px-6 py-4 md:px-8 md:py-6">
                <Sparkles className="h-6 w-6 text-amber-600 md:h-8 md:w-8" />
                <p className="text-base font-bold text-gray-800 md:text-lg">
                  Create videos like these in{' '}
                  <span className="font-black text-amber-700">7 minutes</span>
                </p>
              </div>
            </div>
          </Card>

          {/* Meet Sara Section - Modern Circular Design with Glow */}
          <section className="relative overflow-hidden bg-black py-20 md:py-32">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>

            {/* Floating Orbs */}
            <div className="absolute inset-0 overflow-hidden opacity-30">
              <div
                className="absolute -left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-amber-500/20 blur-3xl"
                style={{ animationDuration: '4s' }}
              ></div>
              <div
                className="absolute -right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-amber-500/20 blur-3xl"
                style={{ animationDuration: '6s', animationDelay: '1s' }}
              ></div>
            </div>

            <div className="relative mx-auto max-w-7xl px-4">
              {/* Badge */}
              <div className="mb-12 flex justify-center">
                <div className="group relative">
                  <div className="absolute -inset-1 animate-pulse rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 opacity-75 blur-lg"></div>
                  <div className="relative flex items-center gap-2 rounded-full border border-amber-500/30 bg-black px-6 py-3">
                    <Shield className="h-5 w-5 text-amber-400" />
                    <span className="text-sm font-black uppercase tracking-wider text-amber-400">
                      Your AI Video Expert
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Grid */}
              <div className="grid items-center gap-16 md:grid-cols-2">
                {/* Left: Circular Image with Glow */}
                <div className="flex justify-center">
                  <div className="group relative">
                    {/* Outer Rotating Gradient Ring */}
                    <div
                      className="absolute -inset-8 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 opacity-75 blur-2xl"
                      style={{
                        animation: 'spin 8s linear infinite, pulse 2s ease-in-out infinite'
                      }}
                    ></div>

                    {/* Middle Glow */}
                    <div className="absolute -inset-4 animate-pulse rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 opacity-60 blur-xl"></div>

                    {/* Circular Image Container */}
                    <div className="relative h-80 w-80 md:h-96 md:w-96">
                      {/* Image with border */}
                      <div className="absolute inset-0 overflow-hidden rounded-full border-4 border-amber-500/50 shadow-2xl">
                        <Image
                          src="/images/Sara.webp"
                          alt="Sara - AI Video Specialist"
                          fill
                          sizes="(max-width: 768px) 320px, 384px"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/40 via-transparent to-transparent"></div>
                      </div>

                      {/* Verified Badge */}
                      <div
                        className="absolute -right-2 top-8 rounded-full border-4 border-black bg-amber-500 p-3 shadow-2xl"
                        style={{ animation: 'bounce 2s infinite' }}
                      >
                        <CheckCircle className="h-8 w-8 text-white" />
                      </div>

                      {/* Stats Badge */}
                      <div className="absolute bottom-0 left-1/2 w-full max-w-xs -translate-x-1/2 translate-y-6 rounded-2xl border border-amber-500/30 bg-black/90 p-4 backdrop-blur-md">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-2xl font-black text-transparent">
                              500+
                            </div>
                            <div className="text-xs font-bold text-gray-400">Agents</div>
                          </div>
                          <div>
                            <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-2xl font-black text-transparent">
                              3K+
                            </div>
                            <div className="text-xs font-bold text-gray-400">Videos</div>
                          </div>
                          <div>
                            <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-2xl font-black text-transparent">
                              4.9★
                            </div>
                            <div className="text-xs font-bold text-gray-400">Rating</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Floating Sparkles */}
                    <Sparkles
                      className="absolute -top-6 -right-6 h-10 w-10 animate-bounce text-amber-400"
                      style={{ animationDuration: '2s' }}
                    />
                    <Sparkles
                      className="absolute -bottom-12 -left-6 h-8 w-8 animate-bounce text-amber-400"
                      style={{ animationDuration: '3s', animationDelay: '0.5s' }}
                    />
                  </div>
                </div>

                {/* Right: Content */}
                <div className="space-y-8">
                  {/* Name */}
                  <div>
                    <h2 className="font-sans mb-3 text-5xl font-black md:text-6xl">
                      <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
                        Hi, I'm Sara
                      </span>
                    </h2>
                    <p className="text-xl font-bold text-gray-300 md:text-2xl">
                      Your AI Video Specialist & Real Estate Tech Expert
                    </p>
                  </div>

                  {/* Story */}
                  <div className="space-y-4 text-lg text-gray-300">
                    <p className="leading-relaxed">
                      After helping{' '}
                      <span className="font-black text-amber-400">500+ real estate agents</span>{' '}
                      transform their marketing, I discovered the secret: authentic AI videos that connect with buyers emotionally.
                    </p>
                    <p className="leading-relaxed">
                      Most agents waste weeks learning complex video software. I created the{' '}
                      <span className="font-black text-amber-400">7-Minute AgentClone™</span>{' '}
                      to give you the same results in minutes, not months.
                    </p>
                  </div>

                  {/* Credentials - MOBILE OPTIMIZED */}
                  <div className="grid gap-3 md:grid-cols-2 md:gap-4">
                    <div className="group relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-600/10 p-3 transition-all hover:scale-105 md:rounded-2xl md:p-6">
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 opacity-0 blur transition-opacity group-hover:opacity-20"></div>
                      <div className="relative">
                        <div className="mb-2 flex items-center gap-2 md:mb-3 md:gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 md:h-12 md:w-12">
                            <Award className="h-5 w-5 text-black md:h-6 md:w-6" />
                          </div>
                          <div className="text-2xl font-black text-amber-400 md:text-3xl">5+</div>
                        </div>
                        <div className="text-xs font-bold text-gray-300 md:text-sm">
                          Years in Real Estate Tech
                        </div>
                      </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-red-500/10 p-3 transition-all hover:scale-105 md:rounded-2xl md:p-6">
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400 to-red-500 opacity-0 blur transition-opacity group-hover:opacity-20"></div>
                      <div className="relative">
                        <div className="mb-2 flex items-center gap-2 md:mb-3 md:gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-red-500 md:h-12 md:w-12">
                            <TrendingUp className="h-5 w-5 text-white md:h-6 md:w-6" />
                          </div>
                          <div className="text-2xl font-black text-amber-400 md:text-3xl">$10M+</div>
                        </div>
                        <div className="text-xs font-bold text-gray-300 md:text-sm">
                          in Agent Sales Generated
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Promise Box - MOBILE OPTIMIZED */}
                  <div className="group relative">
                    <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 opacity-30 blur-lg transition-opacity group-hover:opacity-50 md:rounded-2xl"></div>
                    <div className="relative rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-amber-600/5 p-4 backdrop-blur-sm md:rounded-2xl md:p-6">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 animate-pulse md:h-14 md:w-14">
                          <Sparkles className="h-5 w-5 text-black md:h-7 md:w-7" />
                        </div>
                        <div>
                          <h3 className="font-sans mb-1 text-base font-black text-white md:mb-2 md:text-xl">
                            My Promise to You:
                          </h3>
                          <p className="text-sm leading-relaxed text-gray-300 md:text-base">
                            If you can take a photo, you can create professional AI videos. I've stripped away all the complexity and left only what works.{' '}
                            <span className="font-black text-amber-400">
                              No tech skills needed. Just results.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Proof */}
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {[
                        '/images/P1_result.webp',
                        '/images/P2_result.webp',
                        '/images/P3_result.webp',
                        '/images/P4_result.webp',
                      ].map((img, i) => (
                        <div
                          key={i}
                          className="h-12 w-12 overflow-hidden rounded-full border-4 border-black shadow-lg transition-transform hover:z-10 hover:scale-110"
                        >
                          <Image
                            src={img}
                            alt="Agent"
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          
                      loading="lazy"
                    />
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">
                        Join 500+ Successful Agents
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400">★★★★★</span>
                        <span className="text-sm font-bold text-gray-400">(4.9/5)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CSS for spin animation */}
            <style jsx>{`
              @keyframes spin {
                from {
                  transform: rotate(0deg);
                }
                to {
                  transform: rotate(360deg);
                }
              }
            `}</style>
          </section>

          <Card>
            <div className="mt-12 mb-8 text-center md:mt-16 md:mb-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-amber-400/30 bg-gradient-to-r from-amber-100 to-amber-50 px-4 py-2 md:mb-6 md:px-6 md:py-3">
                <Users className="h-4 w-4 text-amber-600 md:h-5 md:w-5" />
                <span className="text-xs font-black tracking-wide text-amber-800 uppercase md:text-sm">
                  Agent Success Stories
                </span>
              </div>
              <h2 className="font-sans mb-3 text-2xl font-black md:mb-4 md:text-5xl">
                Real Agents,{' '}
                <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
                  Real Results
                </span>
              </h2>
              <p className="mx-auto max-w-2xl text-sm text-gray-700 md:text-xl">
                Agents just like you are closing more deals with AI videos
              </p>
            </div>
          </Card>

          <div className="mx-auto mb-8 grid max-w-6xl gap-4 md:mb-10 md:grid-cols-2 md:gap-6">
            {(showAllTestimonials
              ? testimonials
              : testimonials.slice(0, 6)
            ).map((t, i) => (
              <Card key={i}>
                <div
                  className={`overflow-hidden rounded-3xl border-2 border-gray-200 bg-white shadow-xl transition-all duration-300 hover:border-amber-400/50 hover:shadow-2xl ${tilt} p-5 md:p-7`}
                >
                  <div className="mb-3 flex items-start gap-3 md:mb-4 md:gap-4">
                    <div className="relative h-14 w-14 flex-shrink-0 md:h-16 md:w-16">
                      <Image
                        src={t.image}
                        alt={t.name}
                        fill
                        sizes="64px"
                        className="rounded-full border-2 border-amber-400 object-cover shadow-lg"
                        loading="lazy"
                      />
                      {t.verified && (
                        <div className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg md:h-6 md:w-6">
                          <CheckCircle className="h-3 w-3 text-white md:h-4 md:w-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h4 className="text-base font-black text-gray-900 md:text-lg">
                          {t.name}
                        </h4>
                      </div>
                      <p className="mb-2 text-xs font-semibold text-gray-600 md:text-sm">
                        {t.location}
                      </p>
                      <div className="flex gap-1">
                        {[...Array(t.rating)].map((_, idx) => (
                          <span
                            key={idx}
                            className="text-base text-amber-500 md:text-lg"
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700 italic md:text-base">
                    "{t.text}"
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {!showAllTestimonials && (
            <div className="text-center">
              <button
                onClick={() => setShowAllTestimonials(true)}
                className="group relative inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-8 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <Eye className="h-5 w-5" />
                <span>See More Success Stories</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <p className="mt-3 text-sm text-gray-500">
                Discover what other agents are achieving
              </p>
            </div>
          )}
        </div>
      </section>

      {/* TRIPLE GUARANTEE - DARK */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black py-12 md:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div
            className="absolute top-0 left-1/4 h-96 w-96 animate-pulse rounded-full bg-amber-500 blur-3xl"
            style={{ animationDuration: '7s' }}
          />
          <div
            className="absolute right-1/4 bottom-0 h-96 w-96 animate-pulse rounded-full bg-amber-500 blur-3xl"
            style={{ animationDuration: '9s' }}
          />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 text-center md:px-6">
          <div className="mb-8 md:mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 md:mb-6 md:px-6 md:py-3">
              <Shield className="h-4 w-4 text-amber-400 md:h-5 md:w-5" />
              <span className="text-xs font-black tracking-wide text-amber-400 uppercase md:text-sm">
                Your Protection
              </span>
            </div>
            <h2 className="font-sans mb-3 text-2xl font-black text-white md:mb-4 md:text-5xl">
              Complete Peace of Mind
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-gray-400 md:text-lg">
              Three guarantees to ensure your success and satisfaction
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3 md:gap-6">
            {[
              {
                icon: Shield,
                title: '30 Day Money Back',
                desc: 'Full refund if not satisfied. No questions, no hassle, keep all materials.',
                color: 'from-amber-500 to-amber-600',
              },
              {
                icon: Zap,
                title: 'Instant Access',
                desc: 'Start creating AI videos in under 5 minutes. All materials delivered immediately.',
                color: 'from-amber-400 to-amber-600',
              },
              {
                icon: Award,
                title: 'Lifetime Updates',
                desc: 'Free access to all future improvements, templates, and training forever.',
                color: 'from-amber-400 via-amber-500 to-amber-600',
              },
            ].map((it, i) => (
              <div key={i}>
                <div
                  className={`h-full rounded-2xl border-2 border-gray-700/50 bg-gradient-to-br from-gray-900/80 to-black/80 p-5 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-gray-600/80 md:p-7 ${tilt}`}
                >
                  <div
                    className={`mx-auto mb-4 h-14 w-14 bg-gradient-to-br md:mb-5 md:h-16 md:w-16 ${it.color} grid place-items-center rounded-xl shadow-lg`}
                  >
                    <it.icon className="h-7 w-7 text-black md:h-8 md:w-8" />
                  </div>
                  <h3 className="font-sans mb-3 text-lg font-black text-white md:mb-4 md:text-xl">
                    {it.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-gray-300 md:text-sm">
                    {it.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ - LIGHT */}
      <section className="relative bg-gradient-to-b from-white via-amber-50/30 to-white py-12 text-black md:py-24">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="mb-12 text-center md:mb-16">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 text-sm font-bold text-amber-900 md:px-6 md:py-2.5 md:text-base">
              <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
              Got Questions? We've Got Answers
            </div>
            <h2 className="font-sans mb-4 bg-gradient-to-r from-gray-900 via-amber-900 to-gray-900 bg-clip-text text-3xl font-black text-transparent md:text-5xl lg:text-6xl">
              Everything You Need to Know
            </h2>
            <p className="mx-auto max-w-2xl text-base text-gray-600 md:text-lg">
              Clear, honest answers to help you make the right decision for your
              real estate business
            </p>
          </div>
          <div className="space-y-3 md:space-y-4">
            {faqs.map((f, i) => (
              <FAQItem key={i} question={f.q} answer={f.a} index={i} icon={f.icon} />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA - DARK */}
      <section className="relative bg-black py-10 md:py-20">
        <Card>
          <div className="mx-auto max-w-5xl px-4 text-center md:px-6">
            <h2 className="mb-4 text-3xl font-black text-white md:mb-6 md:text-5xl">
              Enrollment open now
            </h2>
            <p className="mb-6 text-xl font-bold text-gray-300 md:mb-10 md:text-2xl">
              Price jumps to $97 in: <span className="font-black text-amber-400">{timeLeft}</span>
            </p>
            <button
              onClick={() => handleCheckout('final_cta')}
              disabled={checkoutLoading !== null}
              className="group relative inline-block w-full max-w-3xl disabled:cursor-wait disabled:opacity-75"
            >
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 opacity-75 blur-lg transition duration-300 group-hover:opacity-100"></div>
              <div className={`relative flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-black tracking-wider text-black uppercase shadow-2xl transition-all duration-300 group-hover:scale-105 md:px-10 md:py-5 md:text-xl ${
                checkoutLoading === 'final_cta'
                  ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600'
                  : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600'
              }`}>
                {checkoutLoading === 'final_cta' && (
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent md:h-7 md:w-7" />
                )}
                <span className="whitespace-nowrap">
                  {checkoutLoading === 'final_cta' ? 'Processing...' : 'Get $60 Off - Ends Midnight'}
                </span>
              </div>
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 md:text-sm">
              <Shield className="h-4 w-4 text-amber-400 md:h-5 md:w-5" />
              <span className="font-semibold">
                SSL Encrypted Payment • 30-Day Full Refund • 500+ Happy Agents
              </span>
            </div>
          </div>
        </Card>
      </section>

      {/* FOOTER - LIGHT */}
      <footer className="relative border-t-2 border-gray-200 bg-gradient-to-br from-gray-50 via-white to-gray-50 py-10 text-black md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8 grid grid-cols-1 gap-6 md:mb-12 md:grid-cols-4 md:gap-8">
            <div className="md:col-span-2">
              <h3 className="font-sans mb-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-xl font-black text-transparent md:mb-4 md:text-2xl">
                AI FastScale
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                Turn a photo into a realistic talking AI video in 7 minutes,
                built for real estate agents who want more leads without
                expensive video production.
              </p>
              <div className="flex gap-3">
                {[
                  {
                    icon: Facebook,
                    href: 'https://facebook.com/aifastscale',
                    label: 'Facebook',
                  },
                  {
                    icon: Instagram,
                    href: 'https://instagram.com/aifastscale',
                    label: 'Instagram',
                  },
                  {
                    icon: Twitter,
                    href: 'https://twitter.com/aifastscale',
                    label: 'Twitter',
                  },
                  {
                    icon: Youtube,
                    href: 'https://youtube.com/@aifastscale',
                    label: 'YouTube',
                  },
                  {
                    icon: Linkedin,
                    href: 'https://linkedin.com/company/aifastscale',
                    label: 'LinkedIn',
                  },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-lg transition-transform hover:scale-110 md:h-10 md:w-10"
                  >
                    <social.icon className="h-4 w-4 text-black md:h-5 md:w-5" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-base font-black text-gray-900 md:mb-4 md:text-lg">
                Legal
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/privacy-policy"
                    className="text-sm font-semibold text-gray-700 transition-colors hover:text-amber-600 md:text-base"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms-of-service"
                    className="text-sm font-semibold text-gray-700 transition-colors hover:text-amber-600 md:text-base"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/refund-policy"
                    className="text-sm font-semibold text-gray-700 transition-colors hover:text-amber-600 md:text-base"
                  >
                    Refund Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/disclaimer"
                    className="text-sm font-semibold text-gray-700 transition-colors hover:text-amber-600 md:text-base"
                  >
                    Disclaimer
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-base font-black text-gray-900 md:mb-4 md:text-lg">
                Contact
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-gray-700 md:text-base">
                  <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 md:h-5 md:w-5" />
                  <span className="font-semibold">support@aifastscale.com</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700 md:text-base">
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 md:h-5 md:w-5" />
                  <span className="font-semibold">+1 (305) 555-0100</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700 md:text-base">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 md:h-5 md:w-5" />
                  <span className="font-semibold">Miami, FL USA</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-6 text-center md:pt-8">
            <p className="mb-2 text-xs font-semibold text-gray-600 md:text-sm">
              © {new Date().getFullYear()} AI FastScale. All rights reserved.
            </p>
            <p className="text-[10px] text-gray-500 md:text-xs">
              <span className="font-bold">Security Notice:</span> This site uses
              light protection measures (right-click blocking, keyboard
              shortcuts disabled). These only deter casual users, not
              experienced developers. We respect that code is never fully
              protected on the web.
            </p>
          </div>
        </div>
      </footer>

      {/* CRO Elements - Social Proof */}
      <SocialProofPopup />
        </>
      )}
    </div>
  )
}
