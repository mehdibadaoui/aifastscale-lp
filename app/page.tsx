'use client'

import React, { useEffect, useState, useRef, ReactNode, memo } from 'react'
import Image from 'next/image'
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
  Youtube,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
} from 'lucide-react'
import { trackFullCTAClick } from './utils/tracking'
import EmbeddedCheckout from './components/EmbeddedCheckout'

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
  const videoRef = useRef<HTMLVideoElement>(null)

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

      // Save progress to localStorage every 2 seconds
      if (currentTime % 2 < 0.1) {
        localStorage.setItem('heroVideoTime', currentTime.toString())
      }

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

    // Add event listeners
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('timeupdate', handleTimeUpdate)

    // Cleanup
    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('timeupdate', handleTimeUpdate)
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

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const tilt =
    'transition-transform duration-500 will-change-transform hover:-translate-y-1'

  // Redirect to Stripe hosted checkout
  const handleCheckout = async (ctaLocation: string) => {
    // Track button click
    trackFullCTAClick(ctaLocation)

    // Show loading state
    document.body.style.cursor = 'wait'

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const { url, error } = await response.json()

      if (error) {
        console.error('Checkout error:', error)
        alert('Something went wrong. Please try again.')
        document.body.style.cursor = 'default'
        return
      }

      if (url) window.location.href = url
    } catch (err) {
      console.error('Checkout exception:', err)
      alert('Something went wrong. Please try again.')
      document.body.style.cursor = 'default'
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
      q: 'Do I need any technical skills or video experience?',
      a: 'Zero. If you can take a photo with your phone, you can do this. The system guides you step-by-step through everything. Most agents create their first professional video in under 10 minutes on their first try.',
    },
    {
      q: 'Will the AI video look fake or robotic?',
      a: 'Not at all. Our AgentClone technology preserves your natural features, expressions, and speech patterns. Clients consistently tell our users they thought it was a real recording. The pacing is human, the lip-sync is flawless, and the voice sounds authentically you.',
    },
    {
      q: 'Do I need to film myself or record audio?',
      a: 'No filming or recording required. Just upload one clear photo of yourself, and the AI handles everything - script generation, voice synthesis, and video creation. You never have to be on camera or use a microphone.',
    },
    {
      q: 'Is this compliant with MLS rules and broker regulations?',
      a: 'Yes, 100%. We include a comprehensive broker compliance overlay kit with all required disclosures, watermarks, and export templates that meet MLS and NAR guidelines. We worked with real estate attorneys to ensure full compliance.',
    },
    {
      q: 'How long does it actually take to create a video?',
      a: 'The AI generation process takes 3-5 minutes. Adding your personal touches, captions, and exports takes another 2-5 minutes. Total time: 7-10 minutes from start to posting. Most agents batch-create multiple videos in one sitting.',
    },
    {
      q: "What if I'm not tech-savvy or hate learning new software?",
      a: 'This was designed for agents who hate tech. The interface is simpler than Instagram. We provide video walkthroughs, templates, and done-for-you prompts. If you can order an Uber, you can master this system.',
    },
    {
      q: 'Can I use this for luxury listings and high-end properties?',
      a: 'Absolutely. Many of our top users specialize in luxury real estate. The professional quality makes it perfect for premium properties. You can customize everything - tone, background, branding - to match your luxury positioning.',
    },
    {
      q: 'Will this work in my specific market or niche?',
      a: "Yes. Whether you're in residential, commercial, luxury, new construction, or rentals - the system adapts. We have successful users in 47 countries selling everything from starter homes to $10M+ estates. The principles of attention and trust work everywhere.",
    },
    {
      q: "What if I don't get any leads or results?",
      a: "30-day full money-back guarantee, no questions asked. You keep all the templates, training, and bonuses even if you refund. We're that confident you'll see results. Over 500+ agents are currently using this system profitably.",
    },
    {
      q: 'Do I need expensive equipment or subscriptions?',
      a: 'No additional costs. Everything works on your phone or computer. No expensive cameras, lighting, microphones, or ongoing software subscriptions. Just the one-time $37 investment gets you lifetime access to everything.',
    },
    {
      q: 'How is this different from hiring a video editor or production company?',
      a: 'Video production companies charge $500-2000 per video and take days or weeks. With AgentClone, you create unlimited videos yourself in minutes for a one-time $37. You control the content, timing, and messaging. No waiting, no revisions, no ongoing costs.',
    },
    {
      q: 'Can I create videos in multiple languages?',
      a: 'Yes. The AI supports 25+ languages including Spanish, Mandarin, French, Arabic, and more. Perfect if you serve multilingual markets. Create once in English, export in Spanish - same professional quality in both languages.',
    },
    {
      q: 'What kind of results are agents actually getting?',
      a: 'Results vary, but the pattern is consistent: more engagement, more DMs, more qualified leads. Average users report 3-10x increase in inbound inquiries within the first 30 days. Some close deals directly from video leads within the first week.',
    },
    {
      q: 'Is there a limit on how many videos I can create?',
      a: 'Zero limits. Create unlimited videos forever. Daily, weekly, for every listing, for every market update - as many as you want. Your $37 investment never expires and never requires renewal.',
    },
    {
      q: 'What if I need help or get stuck?',
      a: "Full access to our private support community, video tutorials, and template library. Most questions are answered within 2 hours. Plus the training includes troubleshooting guides for every possible scenario. You're never left alone.",
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
  }

  const FAQItem: React.FC<FAQItemProps> = memo(
    ({ question, answer, index }) => {
      const isOpen = openFAQ === index
      return (
        <div
          className={`rounded-2xl border-2 border-gray-300 bg-white transition-all hover:border-yellow-400/50 ${tilt}`}
        >
          <button
            onClick={() => setOpenFAQ(isOpen ? null : index)}
            className="flex w-full items-start justify-between gap-3 p-4 text-left md:p-6"
          >
            <h3 className="flex-1 text-sm leading-tight font-bold text-gray-900 md:text-xl">
              {question}
            </h3>
            <div className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full border-2 border-yellow-500 bg-yellow-400/20 md:h-8 md:w-8">
              <span className="text-lg font-black text-yellow-600 md:text-xl">
                {isOpen ? '−' : '+'}
              </span>
            </div>
          </button>
          <div
            className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
          >
            <div className="overflow-hidden px-4 pb-4 md:px-6 md:pb-6">
              <p className="text-xs leading-relaxed text-gray-700 md:text-lg">
                {answer}
              </p>
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
            <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 opacity-30 blur transition duration-300 group-hover:opacity-50 md:rounded-xl"></div>
            <div className="relative transform rounded-lg border border-yellow-500/30 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 p-2 text-center backdrop-blur-sm transition-all duration-300 group-hover:scale-105 md:rounded-xl md:p-4">
              <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg transition-shadow duration-300 group-hover:shadow-yellow-500/50 md:mb-2 md:h-12 md:w-12">
                <Users className="h-3 w-3 text-black md:h-6 md:w-6" />
              </div>
              <div className="mb-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-sm font-black text-transparent md:mb-1 md:text-2xl">
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
            <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 opacity-30 blur transition duration-300 group-hover:opacity-50 md:rounded-xl"></div>
            <div className="relative transform rounded-lg border border-yellow-500/30 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 p-2 text-center backdrop-blur-sm transition-all duration-300 group-hover:scale-105 md:rounded-xl md:p-4">
              <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg transition-shadow duration-300 group-hover:shadow-yellow-500/50 md:mb-2 md:h-12 md:w-12">
                <Video className="h-3 w-3 text-black md:h-6 md:w-6" />
              </div>
              <div className="mb-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-sm font-black text-transparent md:mb-1 md:text-2xl">
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
            <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 opacity-30 blur transition duration-300 group-hover:opacity-50 md:rounded-xl"></div>
            <div className="relative transform rounded-lg border border-yellow-500/30 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 p-2 text-center backdrop-blur-sm transition-all duration-300 group-hover:scale-105 md:rounded-xl md:p-4">
              <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg transition-shadow duration-300 group-hover:shadow-yellow-500/50 md:mb-2 md:h-12 md:w-12">
                <TrendingUp className="h-3 w-3 text-black md:h-6 md:w-6" />
              </div>
              <div className="mb-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-sm font-black text-transparent md:mb-1 md:text-2xl">
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
          className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-green-500 blur-3xl"
          style={{ animationDuration: '6s' }}
        />
        <div
          className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-yellow-500 blur-3xl"
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
                className="grid h-24 w-24 animate-pulse place-items-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-2xl md:h-40 md:w-40"
                style={{ animationDuration: '3s' }}
              >
                <Shield className="h-12 w-12 text-white md:h-20 md:w-20" />
              </div>
              <div className="absolute -top-2 -right-2 grid h-12 w-12 place-items-center rounded-full border-4 border-white bg-gradient-to-br from-yellow-400 to-amber-500 shadow-xl md:h-16 md:w-16">
                <CheckCircle className="h-6 w-6 text-white md:h-8 md:w-8" />
              </div>
            </div>
          </div>
          <div className="mb-4 text-center md:mb-6">
            <div className="mb-3 inline-block rounded-full border-2 border-green-500/40 bg-gradient-to-r from-green-50 to-green-100 px-4 py-2 md:mb-4 md:px-6 md:py-3">
              <p className="text-xs font-black tracking-wide text-green-700 uppercase md:text-base">
                100% Money-Back Guarantee
              </p>
            </div>
          </div>
          <h2 className="mb-4 text-center text-2xl leading-tight font-black text-gray-900 md:mb-6 md:text-5xl">
            Zero Risk, All Reward
          </h2>
          <div className="mx-auto mb-6 max-w-3xl space-y-4 text-sm leading-relaxed text-gray-700 md:mb-8 md:space-y-5 md:text-lg">
            <p className="text-center">
              Try{' '}
              <span className="font-black text-gray-900">7 Min AgentClone</span>{' '}
              risk-free. Get instant access to all templates, system prompts,
              and training videos.
            </p>
            <div className="rounded-2xl border-2 border-green-500/30 bg-gradient-to-r from-green-50 to-yellow-50 p-4 md:p-6">
              <p className="text-center font-semibold text-gray-800">
                If you don't generate quality leads within{' '}
                <span className="font-black text-green-700">30 days</span>,
                simply email us for a{' '}
                <span className="font-black text-green-700">full refund</span>.
                No questions asked. You even keep all the materials.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <div className="flex items-center gap-2">
                <div className="grid h-5 w-5 place-items-center rounded-full bg-green-500 md:h-6 md:w-6">
                  <CheckCircle className="h-3 w-3 text-white md:h-4 md:w-4" />
                </div>
                <span className="text-xs font-semibold text-gray-700 md:text-sm">
                  30 Day Guarantee
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="grid h-5 w-5 place-items-center rounded-full bg-green-500 md:h-6 md:w-6">
                  <CheckCircle className="h-3 w-3 text-white md:h-4 md:w-4" />
                </div>
                <span className="text-xs font-semibold text-gray-700 md:text-sm">
                  Keep All Materials
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="grid h-5 w-5 place-items-center rounded-full bg-green-500 md:h-6 md:w-6">
                  <CheckCircle className="h-3 w-3 text-white md:h-4 md:w-4" />
                </div>
                <span className="text-xs font-semibold text-gray-700 md:text-sm">
                  No Questions Asked
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => handleCheckout('hero_cta')}
              className="group relative inline-block w-full max-w-3xl"
            >
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 opacity-75 blur-lg transition duration-300 group-hover:opacity-100"></div>
              <div className="relative flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-4 text-base font-black tracking-wider text-black uppercase shadow-xl transition-all duration-300 group-hover:scale-105 hover:shadow-2xl md:gap-3 md:px-10 md:py-5 md:text-xl">
                <span>Yes, I want the $37 AI Mastery Course</span>
                <ArrowRight className="h-5 w-5 md:h-7 md:w-7" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  ))

  GuaranteeSection.displayName = 'GuaranteeSection'

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white select-none">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 z-50 h-1 w-full bg-gray-900">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Security Popup */}
      {showSecurityPopup && (
        <div className="animate-in fade-in slide-in-from-top-2 fixed top-20 left-1/2 z-[100] w-[90%] max-w-md -translate-x-1/2 duration-300">
          <div className="relative">
            <div className="absolute -inset-1 animate-pulse rounded-2xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 opacity-75 blur-lg"></div>
            <div className="relative rounded-2xl border-2 border-yellow-500/50 bg-gradient-to-br from-gray-900 to-black p-6 shadow-2xl">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-lg font-black text-white">
                    Content Protected
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-300">
                    This content is protected. Please respect our intellectual
                    property rights.
                  </p>
                </div>
                <button
                  onClick={() => setShowSecurityPopup(false)}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-800 transition-colors hover:bg-gray-700"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <AlertCircle className="h-4 w-4" />
                <span>For authorized use only</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky CTA Bar - Optimized for mobile */}
      <div
        className={`fixed top-0 right-0 left-0 z-40 border-b border-yellow-500/20 bg-black/95 shadow-2xl backdrop-blur-md transition-transform duration-300 ${showStickyCTA ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2.5 md:gap-4 md:py-3">
          <div className="flex items-center gap-2 md:gap-3">
            <Sparkles className="h-4 w-4 flex-shrink-0 text-yellow-400 md:h-5 md:w-5" />
            <span className="text-xs font-bold text-white md:text-base">
              7 Min AgentClone - $37
            </span>
          </div>
          <button
            onClick={() => handleCheckout('sticky_cta')}
            className="rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-4 text-base font-black whitespace-nowrap text-black uppercase transition-transform duration-200 active:scale-95 md:px-10 md:py-5 md:text-xl"
          >
            Get Access Now
          </button>
        </div>
      </div>

      {/* Top banner */}
      <div className="sticky top-0 z-30 border-b-2 border-yellow-400 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 shadow-xl">
        <div className="mx-auto max-w-7xl px-3 py-2 text-center md:py-3">
          <p className="text-[10px] font-black tracking-wide text-white uppercase md:text-sm">
            Limited Time {today}
          </p>
          <p className="text-[9px] font-semibold text-white/90 md:text-xs">
            Price jumps to $97 at midnight
          </p>
        </div>
      </div>

      {/* HERO SECTION - DARK */}
      <section className="relative overflow-hidden bg-black py-6 md:py-12">
        {/* Static background gradient - removed animations for performance */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-48 -left-48 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-yellow-500/30 to-orange-500/30 blur-[120px]" />
          <div className="absolute top-1/4 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 blur-[140px]" />
          <div className="absolute bottom-0 left-1/3 h-[700px] w-[700px] rounded-full bg-gradient-to-r from-orange-500/15 to-yellow-400/15 blur-[160px]" />
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
              <h1 className="px-2 text-3xl leading-[1.2] font-black tracking-tight uppercase sm:text-4xl md:text-5xl lg:text-6xl">
                <span className="text-white">Get </span>
                <span className="inline-block animate-pulse bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  5-15 Leads
                </span>
                <span className="text-white">
                  {' '}
                  This Week by turning your image to AI Video in{' '}
                </span>
                <span
                  className="inline-block animate-pulse bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent"
                  style={{ animationDelay: '0.5s' }}
                >
                  7 Minutes
                </span>
              </h1>

              <p className="mx-auto max-w-3xl px-2 text-base leading-relaxed text-gray-300 md:text-lg">
                Zero experience needed, start getting{' '}
                <span className="font-bold text-yellow-400">
                  100+ Real Buyer Leads Monthly
                </span>
              </p>

              <div className="mx-auto max-w-4xl">
                <div className="group relative">
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 opacity-75 blur-xl transition duration-500 group-hover:opacity-100"></div>
                  <div className="relative">
                    <div className="rounded-2xl border-2 border-yellow-400/40 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 p-1 shadow-2xl backdrop-blur-sm">
                      <div className="rounded-xl bg-yellow-400/5 p-2 text-center">
                        <p className="mb-2 text-xs font-bold tracking-wider text-yellow-300 uppercase md:text-sm">
                          PLAY THIS WITH SOUND ON
                        </p>
                      </div>
                      {/* Professional Video Player */}
                      <div className="overflow-hidden rounded-2xl border border-gray-800/50 bg-black shadow-2xl">
                        <div
                          className="group relative"
                          style={{ padding: '56.67% 0 0 0' }}
                        >
                          {/* HTML5 Video - Fast, Reliable, Full Control */}
                          <video
                            ref={videoRef}
                            className="absolute top-0 left-0 h-full w-full object-cover"
                            playsInline
                            preload="metadata"
                            muted={videoMuted}
                            poster="/images/thumbnail-vsl.webp"
                          >
                            <source
                              src="/videos/Hero-VSL.mp4"
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>

                          {/* Continue Watching Modal - Screenshot 3 */}
                          {showContinueModal && !videoPlaying && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95">
                              <div className="max-w-2xl px-6 text-center">
                                {/* Green bar at top */}
                                <div className="mb-8 h-2 bg-green-500"></div>

                                <h2 className="mb-8 text-3xl font-bold text-white md:text-4xl">
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
                                    className="group flex items-center gap-4 text-white transition-colors hover:text-green-400"
                                  >
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white transition-colors group-hover:border-green-400 md:h-20 md:w-20">
                                      <Play className="h-8 w-8 fill-white transition-colors group-hover:fill-green-400 md:h-10 md:w-10" />
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
                                    className="group flex items-center gap-4 text-white transition-colors hover:text-green-400"
                                  >
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white transition-colors group-hover:border-green-400 md:h-20 md:w-20">
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
                                <div className="mt-8 h-2 bg-green-500"></div>
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
                                  className="ml-auto transform rounded-full bg-white/20 p-2 backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white/30 active:scale-95 md:p-3"
                                >
                                  <Maximize className="h-5 w-5 text-white md:h-6 md:w-6" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Click anywhere to TOGGLE play/pause */}
                          {videoStarted && !showContinueModal && (
                            <div
                              className="absolute inset-0 z-20 cursor-pointer"
                              onClick={() => {
                                if (videoRef.current) {
                                  if (videoPlaying) {
                                    videoRef.current.pause()
                                  } else {
                                    videoRef.current.play()
                                  }
                                }
                              }}
                            />
                          )}
                        </div>

                        {/* BIGGER, SUPER SMOOTH Progress Bar */}
                        <div className="relative h-3 w-full bg-gray-900 md:h-4">
                          {/* Simple green progress bar - BUTTERY SMOOTH with easing */}
                          <div
                            className="absolute top-0 left-0 h-full bg-green-500"
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
                <div className="space-y-2 text-center md:space-y-3">
                  {!priceUnlocked ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 backdrop-blur-sm">
                        <Eye className="h-4 w-4 animate-pulse text-yellow-400 md:h-5 md:w-5" />
                        <span className="text-sm font-bold text-yellow-400 md:text-base">
                          Watch video to unlock special price
                        </span>
                      </div>
                      <div className="text-3xl font-black tracking-tight text-gray-400 blur-sm select-none md:text-5xl">
                        US$ ??
                      </div>
                    </div>
                  ) : (
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
                  )}
                </div>

                <button
                  onClick={() => handleCheckout('price_unlock_cta')}
                  disabled={!priceUnlocked}
                  className="group relative inline-block w-full max-w-3xl px-2"
                >
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-green-500 via-green-400 to-green-500 opacity-75 blur-lg transition duration-300 group-hover:opacity-100"></div>
                  <div
                    className={`relative flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 via-green-400 to-green-500 px-6 py-4 text-base font-black tracking-wider text-white uppercase shadow-2xl transition-transform duration-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 md:gap-3 md:px-10 md:py-5 md:text-xl ${priceUnlocked ? 'pump-animation' : ''}`}
                  >
                    <Zap className="h-5 w-5 md:h-7 md:w-7" />
                    <span>
                      {priceUnlocked
                        ? 'I want the AgentClone™ System'
                        : 'Watch video to unlock'}
                    </span>
                  </div>
                </button>

                <div className="flex items-center justify-center gap-2 rounded-full border border-red-500/50 bg-gradient-to-r from-red-600/95 to-red-700/95 px-3 py-2 shadow-lg backdrop-blur-sm md:px-4 md:py-2">
                  <AlertCircle className="h-3 w-3 text-white md:h-4 md:w-4" />
                  <span className="text-[10px] font-bold tracking-wide text-white uppercase md:text-sm">
                    Price jumps to <span className="text-yellow-300">$97</span>{' '}
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

      {/* ERIC RIES QUOTE - REDESIGNED WITH BRAND COLORS & ANIMATIONS */}
      <section className="relative overflow-hidden bg-black py-20 md:py-32">
        {/* Animated background glows */}
        <div
          className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-yellow-500/20 blur-3xl"
          style={{ animationDuration: '4s' }}
        ></div>
        <div
          className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-orange-500/20 blur-3xl"
          style={{ animationDuration: '5s', animationDelay: '1s' }}
        ></div>
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl px-4">
          {/* Main quote card with animated border */}
          <div className="group relative">
            {/* Animated gradient border */}
            <div
              className="absolute -inset-1 animate-pulse rounded-3xl bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 opacity-75 blur-xl transition-all duration-500 group-hover:opacity-100"
              style={{ animationDuration: '3s' }}
            ></div>

            {/* Card content */}
            <div className="relative rounded-3xl border-2 border-yellow-500/30 bg-gradient-to-br from-gray-900 to-black p-8 shadow-2xl md:p-16">
              <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16">
                {/* Eric Ries Image with floating animation */}
                <div
                  className="relative flex-shrink-0 animate-bounce"
                  style={{ animationDuration: '3s' }}
                >
                  {/* Multiple rotating gradient rings */}
                  <div
                    className="absolute -inset-2 animate-spin rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-75 blur-lg"
                    style={{ animationDuration: '8s' }}
                  ></div>
                  <div
                    className="absolute -inset-1 animate-spin rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 opacity-50 blur-md"
                    style={{
                      animationDuration: '6s',
                      animationDirection: 'reverse',
                    }}
                  ></div>

                  {/* Image */}
                  <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-yellow-400 shadow-2xl md:h-48 md:w-48">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
                      alt="Eric Ries"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                {/* Quote Content */}
                <div className="flex-1 text-center md:text-left">
                  {/* Animated quote icon */}
                  <div className="mb-6 animate-pulse font-serif text-7xl leading-none text-yellow-400 opacity-50 md:text-8xl">
                    "
                  </div>

                  {/* Quote Text */}
                  <blockquote className="space-y-6">
                    <p className="text-3xl leading-tight font-black text-white md:text-4xl lg:text-5xl">
                      The only way to win is to{' '}
                      <span className="relative inline-block">
                        <span className="absolute inset-0 animate-pulse bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 opacity-50 blur-xl"></span>
                        <span
                          className="relative animate-pulse bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent"
                          style={{ animationDuration: '2s' }}
                        >
                          learn faster
                        </span>
                      </span>{' '}
                      than anyone else
                    </p>

                    {/* Attribution with gradient border */}
                    <footer className="mt-6 border-t-2 border-yellow-500/30 pt-6">
                      <div className="flex items-center justify-center gap-4 md:justify-start">
                        <div className="text-left">
                          <cite className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-2xl font-black text-transparent not-italic md:text-3xl">
                            Eric Ries
                          </cite>
                          <p className="mt-1 text-base font-medium text-gray-400 md:text-lg">
                            Author of "The Lean Startup"
                          </p>
                        </div>
                      </div>
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
              <div className="mb-4 inline-flex items-center gap-3 rounded-full border-2 border-yellow-600 bg-gradient-to-r from-yellow-500 to-yellow-400 px-4 py-2 shadow-lg md:mb-6 md:px-6 md:py-3">
                <span className="text-xs font-black text-black uppercase md:text-base">
                  7 Minute AI Agent System
                </span>
                <Zap className="h-4 w-4 text-black md:h-5 md:w-5" />
              </div>
            </div>
            <div className="mb-8 px-4 text-center md:mb-10">
              <h3 className="mb-3 text-2xl font-black md:mb-4 md:text-5xl">
                From Image to Realistic Talking Video{' '}
                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  4 Simple Steps
                </span>
              </h3>
              <p className="mx-auto max-w-2xl text-sm text-gray-700 md:text-xl">
                No technical skills, no filming,{' '}
                <span className="font-black text-yellow-700">
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
                gradient: 'from-orange-500 to-amber-600',
                bg: 'bg-orange-500',
              },
              {
                num: '4',
                title: 'Get Leads',
                desc: 'Watch leads pour in',
                icon: TrendingUp,
                gradient: 'from-yellow-500 to-amber-600',
                bg: 'bg-yellow-500',
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
                className={`rounded-3xl border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-4 shadow-lg md:p-8 ${tilt}`}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 shadow-xl md:h-16 md:w-16">
                    <Sparkles className="h-6 w-6 text-white md:h-8 md:w-8" />
                  </div>
                  <div>
                    <h5 className="mb-2 text-base font-black text-yellow-900 md:text-xl">
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
          <div className="absolute top-0 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-yellow-500/5 blur-[200px]" />
          <div className="absolute right-1/4 bottom-0 h-[600px] w-[600px] rounded-full bg-orange-500/5 blur-[180px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <Card>
            <div className="mb-12 text-center md:mb-16">
              <h2 className="mb-6 px-4 text-3xl leading-[1.1] font-black md:mb-8 md:text-6xl lg:text-7xl">
                <span className="mb-2 block text-white">
                  You Don't Need More Information.
                </span>
                <span className="mb-2 block text-white">
                  You Need Execution.
                </span>
                <span className="text-white">That's </span>
                <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                  What We Deliver.
                </span>
              </h2>

              <div className="mb-4 flex items-center justify-center gap-4 md:mb-6 md:gap-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-yellow-500/50 md:w-16"></div>
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-4xl font-black text-transparent md:text-6xl">
                  $37
                </span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-yellow-500/50 md:w-16"></div>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-orange-500/10 px-4 py-2 backdrop-blur-sm md:gap-3 md:px-8 md:py-3">
                <span className="text-sm text-gray-400 line-through md:text-lg">
                  $1,561
                </span>
                <ArrowRight className="h-4 w-4 text-yellow-400 md:h-5 md:w-5" />
                <span className="text-sm font-black text-yellow-400 md:text-lg">
                  Save $1,524 Today
                </span>
              </div>
            </div>
          </Card>

          <div className="mb-12 grid gap-8 md:mb-16 md:gap-10 lg:grid-cols-2">
            {products.map((p, i) => (
              <div
                key={i}
                className="group overflow-hidden rounded-2xl border-2 border-gray-800 bg-gray-900/40 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400/40"
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
                    <span className="inline-block rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-black md:px-4 md:py-1.5 md:text-sm">
                      Module {i + 1}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="rounded-lg border border-yellow-400/30 bg-black/80 px-3 py-1 backdrop-blur-sm md:px-4 md:py-2">
                      <span className="text-sm font-black text-yellow-400 md:text-lg">
                        ${p.value}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <h3 className="mb-3 text-xl leading-tight font-black text-white md:text-2xl">
                    {p.title}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-gray-400 md:text-base">
                    {p.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Instant Access</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Step-by-Step</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-12 rounded-2xl border-2 border-gray-800 bg-gray-900/40 p-8 backdrop-blur-sm md:mb-16 md:p-12">
            <div className="mb-8 text-center md:mb-12">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 md:px-6 md:py-2">
                <Sparkles className="h-4 w-4 text-yellow-400 md:h-5 md:w-5" />
                <span className="text-xs font-black text-yellow-400 uppercase md:text-sm">
                  Bonus Content
                </span>
              </div>
              <h3 className="mb-2 text-2xl font-black text-white md:text-4xl">
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
                  className="group overflow-hidden rounded-xl border-2 border-gray-700 bg-gray-800/40 transition-all duration-300 hover:border-yellow-400/40"
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
                      <span className="inline-block rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-black">
                        Bonus {i + 1}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 md:p-6">
                    <h4 className="mb-3 text-base leading-tight font-black text-white md:text-lg">
                      {b.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-yellow-400 md:text-xl">
                        ${b.value} Value
                      </span>
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card>
            <div className="mt-10 flex flex-col items-center gap-4 px-4 md:mt-12 md:gap-6">
              <div className="w-full max-w-4xl">
                <div className="mb-4 rounded-2xl border-2 border-yellow-500/30 bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 md:mb-6 md:p-8">
                  <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4 md:gap-6">
                    <div className="space-y-1 md:space-y-2">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-2xl font-black text-transparent md:text-4xl">
                        $1,561
                      </div>
                      <div className="text-xs font-semibold text-gray-400 md:text-sm">
                        Total Value
                      </div>
                    </div>
                    <div className="space-y-1 md:space-y-2">
                      <div className="text-2xl font-black text-green-400 md:text-4xl">
                        $37
                      </div>
                      <div className="text-xs font-semibold text-gray-400 md:text-sm">
                        Today's Price
                      </div>
                    </div>
                    <div className="space-y-1 md:space-y-2">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-2xl font-black text-transparent md:text-4xl">
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
                className="group relative inline-block w-full max-w-3xl"
              >
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 opacity-75 blur-xl transition duration-300 group-hover:opacity-100"></div>
                <div className="relative flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 px-6 py-4 text-base font-black tracking-wider text-black uppercase shadow-2xl transition-all duration-300 group-hover:scale-[1.02] md:gap-3 md:px-10 md:py-5 md:text-xl">
                  <Zap className="h-5 w-5 md:h-7 md:w-7" />
                  <span>Get Complete System For $37</span>
                  <ArrowRight className="h-5 w-5 md:h-7 md:w-7" />
                </div>
              </button>

              <div className="flex items-center gap-2 text-xs text-gray-400 md:text-sm">
                <Shield className="h-4 w-4 text-green-400 md:h-5 md:w-5" />
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
            className="absolute top-0 left-1/4 h-[600px] w-[600px] animate-pulse rounded-full bg-yellow-500/10 blur-[150px]"
            style={{ animationDuration: '8s' }}
          />
          <div
            className="absolute right-1/4 bottom-0 h-[600px] w-[600px] animate-pulse rounded-full bg-orange-500/10 blur-[150px]"
            style={{ animationDuration: '10s' }}
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8 text-center md:mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 backdrop-blur-sm md:mb-6 md:px-6 md:py-3">
              <Award className="h-4 w-4 animate-pulse text-yellow-400 md:h-5 md:w-5" />
              <span className="text-xs font-black tracking-wide text-yellow-400 uppercase md:text-sm">
                Real Success Story
              </span>
            </div>
            <h2 className="mb-4 px-4 text-2xl leading-tight font-black md:text-5xl lg:text-6xl">
              <span>How Mr. Lucas Sold a </span>
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Palm Jumeirah Villa
              </span>
              <br />
              <span>with a </span>
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                $1 Video
              </span>
            </h2>
          </div>

          <div className="mx-auto mb-10 grid max-w-7xl items-start gap-6 md:mb-14 md:gap-10 lg:grid-cols-2">
            <div
              className={`relative overflow-hidden rounded-3xl border border-yellow-400/20 bg-gradient-to-br from-gray-900/95 to-black shadow-2xl ${tilt}`}
            >
              <div className="p-3 md:p-4">
                <div className="overflow-hidden rounded-2xl bg-black/50">
                  <div
                    className="wistia_responsive_padding"
                    style={{ padding: '177.78% 0 0 0', position: 'relative' }}
                  >
                    <div
                      className="wistia_responsive_wrapper"
                      style={{
                        height: '100%',
                        left: 0,
                        position: 'absolute',
                        top: 0,
                        width: '100%',
                      }}
                    >
                      <iframe
                        src="https://fast.wistia.net/embed/iframe/4o934arsbs?web_component=true&seo=true&videoFoam=true"
                        title="Mr Lucas Video"
                        allow="autoplay; fullscreen"
                        frameBorder="0"
                        scrolling="no"
                        width="100%"
                        height="100%"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4 md:px-6 md:pb-6">
                <div className="mb-2 flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-yellow-400 md:h-6 md:w-6" />
                  <h3 className="text-lg font-black text-white md:text-xl">
                    Mr. Lucas Actual Video
                  </h3>
                </div>
                <p className="text-xs text-gray-400 md:text-sm">
                  Created in 6 min • Sold for 17.9M AED
                </p>
              </div>
            </div>

            <div className="space-y-5 md:space-y-6">
              <div className="rounded-2xl border border-yellow-400/20 bg-gray-900/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400/40 md:p-7">
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg md:h-12 md:w-12">
                    <Upload className="h-5 w-5 text-black md:h-6 md:w-6" />
                  </div>
                  <div>
                    <h4 className="mb-2 text-lg font-black text-yellow-400 md:text-xl">
                      The Challenge
                    </h4>
                    <p className="text-sm leading-relaxed text-gray-300 md:text-base">
                      6 bedroom beachfront villa in Palm Jumeirah •{' '}
                      <span className="font-bold text-yellow-400">
                        18.5M AED
                      </span>{' '}
                      listing price • Needed qualified buyer leads fast
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-yellow-400/20 bg-gray-900/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400/40 md:p-7">
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg md:h-12 md:w-12">
                    <Video className="h-5 w-5 animate-pulse text-black md:h-6 md:w-6" />
                  </div>
                  <div>
                    <h4 className="mb-2 text-lg font-black text-yellow-400 md:text-xl">
                      The Solution
                    </h4>
                    <p className="text-sm leading-relaxed text-gray-300 md:text-base">
                      Used{' '}
                      <span className="font-bold text-yellow-400">
                        7 Min AgentClone
                      </span>{' '}
                      to create AI talking video from one photo • Posted with{' '}
                      <span className="font-bold text-yellow-400">
                        $1 boost
                      </span>{' '}
                      on Instagram + TikTok
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-900/30 to-amber-900/20 p-5 backdrop-blur-sm md:p-7">
                <div className="mb-5 flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg md:h-12 md:w-12">
                    <TrendingUp className="h-5 w-5 text-black md:h-6 md:w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-yellow-400 md:text-xl">
                      The Results
                    </h4>
                  </div>
                </div>
                <div className="mb-5 grid grid-cols-2 gap-3 md:gap-4">
                  <div className="rounded-xl border border-yellow-400/20 bg-black/30 p-3 transition-all hover:border-yellow-400/40 md:p-4">
                    <DollarSign className="mb-2 h-5 w-5 text-yellow-400 md:h-6 md:w-6" />
                    <p className="text-sm font-bold text-white md:text-base">
                      $1 boost
                    </p>
                    <p className="text-[10px] text-gray-400 md:text-xs">
                      Total ad spend
                    </p>
                  </div>
                  <div className="rounded-xl border border-yellow-400/20 bg-black/30 p-3 transition-all hover:border-yellow-400/40 md:p-4">
                    <Eye className="mb-2 h-5 w-5 text-yellow-400 md:h-6 md:w-6" />
                    <p className="text-sm font-bold text-white md:text-base">
                      400K+ views
                    </p>
                    <p className="text-[10px] text-gray-400 md:text-xs">
                      Organic reach
                    </p>
                  </div>
                  <div className="rounded-xl border border-yellow-400/20 bg-black/30 p-3 transition-all hover:border-yellow-400/40 md:p-4">
                    <MessageCircle className="mb-2 h-5 w-5 text-yellow-400 md:h-6 md:w-6" />
                    <p className="text-sm font-bold text-white md:text-base">
                      11 DMs
                    </p>
                    <p className="text-[10px] text-gray-400 md:text-xs">
                      By morning
                    </p>
                  </div>
                  <div className="rounded-xl border border-yellow-400/20 bg-black/30 p-3 transition-all hover:border-yellow-400/40 md:p-4">
                    <Clock className="mb-2 h-5 w-5 text-yellow-400 md:h-6 md:w-6" />
                    <p className="text-sm font-bold text-white md:text-base">
                      9 days
                    </p>
                    <p className="text-[10px] text-gray-400 md:text-xs">
                      To offer
                    </p>
                  </div>
                </div>
                <div className="rounded-xl border border-yellow-400/30 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 p-4 md:p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-8 w-8 flex-shrink-0 text-yellow-400 md:h-10 md:w-10" />
                    <div>
                      <p className="mb-1 text-xl font-black text-yellow-400 md:text-2xl">
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
                className="group relative inline-block w-full max-w-3xl"
              >
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 opacity-75 blur-lg transition duration-300 group-hover:opacity-100"></div>
                <div className="relative flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 px-6 py-4 text-base font-black tracking-wider text-black uppercase shadow-2xl transition-all duration-300 group-hover:scale-105 md:gap-3 md:px-10 md:py-5 md:text-xl">
                  <Video className="h-5 w-5 md:h-7 md:w-7" />
                  <span>I Want Results Like Mr. Lucas</span>
                </div>
              </button>
            </div>
          </Card>
        </div>
      </section>

      {/* TESTIMONIALS - LIGHT */}
      <section className="relative overflow-hidden bg-white py-10 text-black md:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-yellow-500 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-orange-500 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8 text-center md:mb-10">
            <Card>
              <h2 className="mb-3 text-2xl font-black md:mb-4 md:text-5xl">
                See More{' '}
                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
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
                id: 'k1gfuxd7uw',
                title: 'Agent Steven Video',
                aspectRatio: '175.83%',
              },
              {
                id: 'eilfzivcqu',
                title: 'Agent Gabriel Video',
                aspectRatio: '177.22%',
              },
            ].map((v, i) => (
              <Card key={i}>
                <div
                  className={`overflow-hidden rounded-3xl border-2 border-gray-200 bg-white shadow-xl hover:border-yellow-400/50 hover:shadow-2xl ${tilt}`}
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
                      <div
                        className="wistia_responsive_padding"
                        style={{
                          padding: i === 0 ? '175.83% 0 0 0' : '177.22% 0 0 0',
                          position: 'relative',
                        }}
                      >
                        <div
                          className="wistia_responsive_wrapper"
                          style={{
                            height: '100%',
                            left: 0,
                            position: 'absolute',
                            top: 0,
                            width: '100%',
                          }}
                        >
                          <iframe
                            src={`https://fast.wistia.net/embed/iframe/${v.id}?web_component=true&seo=true&videoFoam=true`}
                            title={v.title}
                            allow="autoplay; fullscreen"
                            frameBorder="0"
                            scrolling="no"
                            width="100%"
                            height="100%"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-t from-gray-50 to-white p-4 md:p-6">
                    <div className="mb-2 flex items-center gap-3 md:mb-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 md:h-12 md:w-12">
                        <CheckCircle className="h-5 w-5 text-white md:h-7 md:w-7" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-gray-900 md:text-xl">
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
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
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
                                <CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-yellow-400 md:h-4 md:w-4" />
                                <div>
                                  <p className="mb-0.5 text-[10px] font-black md:text-xs">
                                    {a.name}
                                  </p>
                                  <p className="text-[9px] font-semibold text-yellow-400 md:text-[10px]">
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
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
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
                                <CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-yellow-400 md:h-4 md:w-4" />
                                <div>
                                  <p className="mb-0.5 text-[10px] font-black md:text-xs">
                                    {a.name}
                                  </p>
                                  <p className="text-[9px] font-semibold text-yellow-400 md:text-[10px]">
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
              <div className="inline-flex flex-col items-center gap-3 rounded-2xl border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-50 to-orange-50 px-6 py-4 md:px-8 md:py-6">
                <Sparkles className="h-6 w-6 text-yellow-600 md:h-8 md:w-8" />
                <p className="text-base font-bold text-gray-800 md:text-lg">
                  Create videos like these in{' '}
                  <span className="font-black text-yellow-700">7 minutes</span>
                </p>
              </div>
            </div>
          </Card>

          {/* Meet Sara Section - Premium Personal Brand with Brand Colors */}
          <section className="relative overflow-hidden py-16 md:py-24">
            {/* Animated Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50"></div>

            {/* Floating Gradient Blobs */}
            <div className="absolute inset-0 opacity-40">
              <div
                className="absolute -top-32 -left-32 h-[500px] w-[500px] animate-pulse rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 blur-[120px]"
                style={{ animationDuration: '4s' }}
              ></div>
              <div
                className="absolute top-1/3 -right-40 h-[600px] w-[600px] animate-pulse rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 blur-[140px]"
                style={{ animationDuration: '6s' }}
              ></div>
              <div
                className="absolute bottom-0 left-1/3 h-[400px] w-[400px] animate-pulse rounded-full bg-gradient-to-r from-orange-400 to-red-500 blur-[100px]"
                style={{ animationDuration: '5s' }}
              ></div>
            </div>

            {/* Animated Dots Pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #f59e0b 1px, transparent 1px)',
                backgroundSize: '50px 50px',
              }}
            ></div>

            <div className="relative mx-auto max-w-7xl px-4">
              {/* Animated Badge */}
              <div className="animate-in fade-in slide-in-from-top-4 mb-8 flex justify-center duration-700 md:mb-12">
                <div className="group relative">
                  <div className="absolute -inset-1 animate-pulse rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-75 blur-lg transition duration-300 group-hover:opacity-100"></div>
                  <div className="relative inline-flex items-center gap-2 rounded-full border-2 border-yellow-400/50 bg-gradient-to-r from-yellow-100 to-orange-100 px-6 py-3 shadow-xl">
                    <Shield className="h-5 w-5 animate-pulse text-orange-600" />
                    <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-sm font-black tracking-wide text-transparent uppercase">
                      Meet Your AI Video Expert
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
                {/* Left: Image with Floating Animation */}
                <div className="group animate-in fade-in slide-in-from-left relative duration-1000">
                  {/* Animated Glow Effect */}
                  <div
                    className="absolute -inset-4 animate-pulse rounded-3xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-40 blur-3xl transition-all duration-700 group-hover:opacity-60"
                    style={{ animationDuration: '3s' }}
                  ></div>

                  {/* Floating Container */}
                  <div
                    className="relative transform rounded-3xl bg-gradient-to-br from-white to-yellow-50 p-4 shadow-2xl transition-all duration-500 group-hover:scale-[1.02]"
                    style={{ animation: 'float 6s ease-in-out infinite' }}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                      <Image
                        src="/images/Sara.webp"
                        alt="Sara - AI Video Specialist"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        priority
                      />
                      {/* Gradient Overlay with Brand Colors */}
                      <div className="absolute inset-0 bg-gradient-to-t from-orange-900/40 via-transparent to-yellow-400/10"></div>

                      {/* Animated Verified Badge */}
                      <div
                        className="animate-in zoom-in absolute top-4 right-4 rounded-full bg-white p-2 shadow-xl delay-300 duration-500"
                        style={{ animation: 'bounce 2s ease-in-out infinite' }}
                      >
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>

                      {/* Animated Stats Badge */}
                      <div className="animate-in slide-in-from-bottom absolute right-4 bottom-4 left-4 rounded-2xl border-2 border-yellow-400/30 bg-white/95 p-4 shadow-2xl backdrop-blur-sm delay-500 duration-700">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="transform transition-transform duration-300 hover:scale-110">
                            <div className="animate-pulse bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-2xl font-black text-transparent">
                              500+
                            </div>
                            <div className="text-xs font-bold text-gray-600">
                              Agents
                            </div>
                          </div>
                          <div className="transform transition-transform duration-300 hover:scale-110">
                            <div
                              className="animate-pulse bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-2xl font-black text-transparent"
                              style={{ animationDelay: '0.2s' }}
                            >
                              3K+
                            </div>
                            <div className="text-xs font-bold text-gray-600">
                              Videos
                            </div>
                          </div>
                          <div className="transform transition-transform duration-300 hover:scale-110">
                            <div
                              className="animate-pulse bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-2xl font-black text-transparent"
                              style={{ animationDelay: '0.4s' }}
                            >
                              4.9★
                            </div>
                            <div className="text-xs font-bold text-gray-600">
                              Rating
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Sparkles */}
                  <div
                    className="absolute -top-4 -right-4 h-8 w-8 animate-bounce text-yellow-400"
                    style={{ animationDuration: '2s' }}
                  >
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <div
                    className="absolute -bottom-4 -left-4 h-6 w-6 animate-bounce text-orange-400"
                    style={{ animationDuration: '3s', animationDelay: '0.5s' }}
                  >
                    <Sparkles className="h-6 w-6" />
                  </div>
                </div>

                {/* Right: Content */}
                <div className="animate-in fade-in slide-in-from-right space-y-6 duration-1000">
                  {/* Name and Title */}
                  <div className="animate-in fade-in slide-in-from-right delay-200 duration-700">
                    <h2 className="animate-in zoom-in mb-3 text-4xl font-black duration-500 md:text-6xl">
                      <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 bg-clip-text text-transparent">
                        Hi, I'm Sara
                      </span>
                    </h2>
                    <p className="text-xl font-bold text-gray-800 md:text-2xl">
                      Your AI Video Specialist & Real Estate Tech Expert
                    </p>
                  </div>

                  {/* Story */}
                  <div className="animate-in fade-in space-y-4 delay-300 duration-700">
                    <p className="text-lg leading-relaxed text-gray-700">
                      After helping{' '}
                      <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text font-black text-transparent">
                        500+ real estate agents
                      </span>{' '}
                      transform their marketing, I discovered the secret:
                      authentic AI videos that connect with buyers emotionally.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-700">
                      Most agents waste weeks learning complex video software. I
                      created the{' '}
                      <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text font-black text-transparent">
                        7-Minute AgentClone™
                      </span>{' '}
                      to give you the same results in minutes, not months.
                    </p>
                  </div>

                  {/* Credentials with Hover Animations */}
                  <div className="animate-in fade-in grid grid-cols-2 gap-4 delay-400 duration-700">
                    <div className="group relative transform rounded-2xl border-2 border-yellow-300/50 bg-gradient-to-br from-yellow-50 to-orange-50 p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl">
                      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 blur transition duration-300 group-hover:opacity-30"></div>
                      <div className="relative mb-2 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 shadow-lg transition-all duration-300 group-hover:shadow-yellow-500/50">
                          <Award className="h-5 w-5 text-white" />
                        </div>
                        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-2xl font-black text-transparent">
                          5+
                        </div>
                      </div>
                      <div className="relative text-sm font-bold text-gray-700">
                        Years in Real Estate Tech
                      </div>
                    </div>

                    <div className="group relative transform rounded-2xl border-2 border-orange-300/50 bg-gradient-to-br from-orange-50 to-red-50 p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl">
                      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 opacity-0 blur transition duration-300 group-hover:opacity-30"></div>
                      <div className="relative mb-2 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 shadow-lg transition-all duration-300 group-hover:shadow-orange-500/50">
                          <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <div className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-2xl font-black text-transparent">
                          $10M+
                        </div>
                      </div>
                      <div className="relative text-sm font-bold text-gray-700">
                        in Agent Sales Generated
                      </div>
                    </div>
                  </div>

                  {/* Promise with Glow Effect */}
                  <div className="group animate-in fade-in relative delay-500 duration-700">
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-30 blur-lg transition duration-500 group-hover:opacity-50"></div>
                    <div className="relative rounded-2xl border-2 border-yellow-400/50 bg-gradient-to-r from-yellow-100 via-orange-100 to-amber-100 p-6 shadow-xl">
                      <div className="flex items-start gap-3">
                        <div
                          className="flex h-12 w-12 flex-shrink-0 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 shadow-lg"
                          style={{ animationDuration: '2s' }}
                        >
                          <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="mb-2 text-xl font-black text-gray-900">
                            My Promise to You:
                          </h3>
                          <p className="leading-relaxed text-gray-700">
                            If you can take a photo, you can create professional
                            AI videos. I've stripped away all the complexity and
                            left only what works.{' '}
                            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text font-black text-transparent">
                              No tech skills needed. Just results.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Proof Bar with Animations */}
                  <div className="animate-in fade-in flex items-center gap-4 pt-4 delay-600 duration-700">
                    <div className="flex -space-x-3">
                      {[
                        '/images/P1_result.webp',
                        '/images/P2_result.webp',
                        '/images/P3_result.webp',
                        '/images/P4_result.webp',
                      ].map((img, i) => (
                        <div
                          key={i}
                          className="relative h-12 w-12 transform overflow-hidden rounded-full border-4 border-white shadow-lg transition-all duration-300 hover:z-10 hover:scale-110"
                          style={{
                            animation: `float ${3 + i}s ease-in-out infinite`,
                            animationDelay: `${i * 0.2}s`,
                          }}
                        >
                          <Image
                            src={img}
                            alt="Agent"
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900">
                        Join 500+ Successful Agents
                      </p>
                      <div className="flex items-center gap-1 text-sm text-yellow-500">
                        {'★'.repeat(5)}
                        <span className="ml-1 font-bold text-gray-600">
                          (4.9/5)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Float Animation Keyframes via inline style - this is a workaround */}
            <style jsx>{`
              @keyframes float {
                0%,
                100% {
                  transform: translateY(0px);
                }
                50% {
                  transform: translateY(-20px);
                }
              }
            `}</style>
          </section>

          <Card>
            <div className="mt-12 mb-8 text-center md:mt-16 md:mb-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-yellow-400/30 bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 md:mb-6 md:px-6 md:py-3">
                <Users className="h-4 w-4 text-yellow-600 md:h-5 md:w-5" />
                <span className="text-xs font-black tracking-wide text-yellow-800 uppercase md:text-sm">
                  Agent Success Stories
                </span>
              </div>
              <h2 className="mb-3 text-2xl font-black md:mb-4 md:text-5xl">
                Real Agents,{' '}
                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
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
                  className={`overflow-hidden rounded-3xl border-2 border-gray-200 bg-white shadow-xl transition-all duration-300 hover:border-yellow-400/50 hover:shadow-2xl ${tilt} p-5 md:p-7`}
                >
                  <div className="mb-3 flex items-start gap-3 md:mb-4 md:gap-4">
                    <div className="relative h-14 w-14 flex-shrink-0 md:h-16 md:w-16">
                      <Image
                        src={t.image}
                        alt={t.name}
                        fill
                        sizes="64px"
                        className="rounded-full border-2 border-yellow-400 object-cover shadow-lg"
                        loading="lazy"
                      />
                      {t.verified && (
                        <div className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg md:h-6 md:w-6">
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
                            className="text-base text-yellow-500 md:text-lg"
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
                className="group relative inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
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
            className="absolute top-0 left-1/4 h-96 w-96 animate-pulse rounded-full bg-green-500 blur-3xl"
            style={{ animationDuration: '7s' }}
          />
          <div
            className="absolute right-1/4 bottom-0 h-96 w-96 animate-pulse rounded-full bg-yellow-500 blur-3xl"
            style={{ animationDuration: '9s' }}
          />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 text-center md:px-6">
          <div className="mb-8 md:mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 md:mb-6 md:px-6 md:py-3">
              <Shield className="h-4 w-4 text-green-400 md:h-5 md:w-5" />
              <span className="text-xs font-black tracking-wide text-green-400 uppercase md:text-sm">
                Your Protection
              </span>
            </div>
            <h2 className="mb-3 text-2xl font-black text-white md:mb-4 md:text-5xl">
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
                color: 'from-green-500 to-green-600',
              },
              {
                icon: Zap,
                title: 'Instant Access',
                desc: 'Start creating AI videos in under 5 minutes. All materials delivered immediately.',
                color: 'from-yellow-400 to-amber-500',
              },
              {
                icon: Award,
                title: 'Lifetime Updates',
                desc: 'Free access to all future improvements, templates, and training forever.',
                color: 'from-yellow-400 to-orange-500',
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
                  <h3 className="mb-3 text-lg font-black text-white md:mb-4 md:text-xl">
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
      <section className="relative bg-white py-10 text-black md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <Card>
            <h2 className="mb-8 text-center text-2xl font-black md:mb-10 md:text-5xl">
              Common Questions
            </h2>
          </Card>
          <div className="space-y-3 md:space-y-4">
            {faqs.map((f, i) => (
              <Card key={i}>
                <FAQItem question={f.q} answer={f.a} index={i} />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CHECKOUT SECTION */}
      <EmbeddedCheckout />

      {/* FINAL CTA - DARK */}
      <section className="relative bg-black py-10 md:py-20">
        <Card>
          <div className="mx-auto max-w-5xl px-4 text-center md:px-6">
            <h2 className="mb-4 text-2xl font-black md:mb-6 md:text-5xl">
              Enrollment open now
            </h2>
            <p className="mb-6 text-lg text-gray-300 md:mb-10 md:text-xl">
              Price jumps to $97 at midnight
            </p>
            <button
              onClick={() => handleCheckout('final_cta')}
              className="group relative inline-block w-full max-w-3xl"
            >
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 opacity-75 blur-lg transition duration-300 group-hover:opacity-100"></div>
              <div className="relative flex items-center justify-center rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 px-6 py-4 text-base font-black tracking-wider text-black uppercase shadow-2xl transition-all duration-300 group-hover:scale-105 md:px-10 md:py-5 md:text-xl">
                <span>I want the AgentClone™ System</span>
              </div>
            </button>
          </div>
        </Card>
      </section>

      {/* FOOTER - LIGHT */}
      <footer className="relative border-t-2 border-gray-200 bg-gradient-to-br from-gray-50 via-white to-gray-50 py-10 text-black md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8 grid grid-cols-1 gap-6 md:mb-12 md:grid-cols-4 md:gap-8">
            <div className="md:col-span-2">
              <h3 className="mb-3 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-xl font-black text-transparent md:mb-4 md:text-2xl">
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
                    className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg transition-transform hover:scale-110 md:h-10 md:w-10"
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
                    className="text-sm font-semibold text-gray-700 transition-colors hover:text-yellow-600 md:text-base"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms-of-service"
                    className="text-sm font-semibold text-gray-700 transition-colors hover:text-yellow-600 md:text-base"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/refund-policy"
                    className="text-sm font-semibold text-gray-700 transition-colors hover:text-yellow-600 md:text-base"
                  >
                    Refund Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/disclaimer"
                    className="text-sm font-semibold text-gray-700 transition-colors hover:text-yellow-600 md:text-base"
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
                  <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-600 md:h-5 md:w-5" />
                  <span className="font-semibold">support@aifastscale.com</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700 md:text-base">
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-600 md:h-5 md:w-5" />
                  <span className="font-semibold">+1 (305) 555-0100</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700 md:text-base">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-600 md:h-5 md:w-5" />
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
    </div>
  )
}
