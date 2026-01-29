'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
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
  CalendarCheck,
  FileText,
  Sparkles,
  Phone,
  Mail,
  Send,
  Smile,
  Search,
  Globe,
  Languages,
  BadgeCheck,
  Mic,
} from 'lucide-react'
import { PLASTIC_SURGEON_BONUS_PRODUCTS, getPlasticSurgeonTotalBonusValue } from '../config/plastic-surgeon-bonus-products'
import { getMemberStats } from './members/components/config'
import { ExpertPersona, ExpertMention, DR_SOFIA_DATA } from '../components/ExpertPersona'
import { AnimatedBackground } from '../components/AnimatedBackground'

// Whop checkout link
const WHOP_CHECKOUT_LINK = 'https://whop.com/checkout/plan_OGprA4gd4Lr7N'

// ===========================================
// META TRACKING - Browser Pixel Only
// ===========================================

// Capture fbclid from Facebook ads and store as _fbc cookie (CRITICAL for attribution)
const captureFbclid = () => {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams(window.location.search)
  const fbclid = params.get('fbclid')

  if (fbclid) {
    // Standard _fbc format: fb.1.{timestamp}.{fbclid}
    const fbc = `fb.1.${Date.now()}.${fbclid}`
    // Set cookie for 90 days (standard Meta attribution window)
    document.cookie = `_fbc=${fbc}; path=/; max-age=${90 * 24 * 60 * 60}; SameSite=Lax`
    // Also store in sessionStorage for thank-you page
    sessionStorage.setItem('plastic_surgeon_fbc', fbc)
    console.log('📊 fbclid captured and stored as _fbc cookie')
  }
}

// Fire ViewContent event (Browser Pixel only)
const trackViewContent = () => {
  if (typeof window === 'undefined') return

  const eventId = `ViewContent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  if ((window as any).fbq) {
    (window as any).fbq('track', 'ViewContent', {
      value: 47.82,
      currency: 'USD',
      content_name: 'CloneYourself for Plastic Surgeons',
      content_type: 'product',
      content_ids: ['plastic-surgeon-main'],
    }, { eventID: eventId })
    console.log('📊 ViewContent pixel fired')
  }
}

// Fire InitiateCheckout event (Browser Pixel only)
const trackInitiateCheckout = () => {
  if (typeof window === 'undefined') return

  const eventId = `InitiateCheckout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  if ((window as any).fbq) {
    (window as any).fbq('track', 'InitiateCheckout', {
      value: 47.82,
      currency: 'USD',
      content_name: 'CloneYourself for Plastic Surgeons',
      content_type: 'product',
      content_ids: ['plastic-surgeon-main'],
    }, { eventID: eventId })
    console.log('📊 InitiateCheckout pixel fired')
  }
}

// 100+ World Languages - With comprehensive country aliases
// Users can search by language name OR country name
const SUPPORTED_LANGUAGES = [
  // === TIER 1: Most Common Languages ===
  { code: 'en', name: 'English', flag: '🇺🇸', aliases: [
    'usa', 'america', 'united states', 'uk', 'united kingdom', 'britain', 'england', 'scotland', 'wales', 'ireland',
    'australia', 'new zealand', 'canada', 'singapore', 'south africa', 'nigeria', 'kenya', 'ghana', 'uganda',
    'jamaica', 'bahamas', 'barbados', 'trinidad', 'guyana', 'belize', 'bermuda', 'virgin islands', 'puerto rico',
    'philippines', 'india', 'pakistan', 'hong kong', 'malta', 'cyprus', 'fiji', 'papua new guinea', 'liberia', 'sierra leone'
  ]},
  { code: 'es', name: 'Spanish', flag: '🇪🇸', aliases: [
    'spain', 'espana', 'mexico', 'argentina', 'colombia', 'peru', 'venezuela', 'chile', 'ecuador', 'guatemala',
    'cuba', 'dominican republic', 'honduras', 'bolivia', 'el salvador', 'nicaragua', 'costa rica', 'panama',
    'uruguay', 'paraguay', 'puerto rico', 'equatorial guinea', 'espanol', 'castellano', 'latino', 'latin america'
  ]},
  { code: 'fr', name: 'French', flag: '🇫🇷', aliases: [
    'france', 'belgium', 'switzerland', 'canada', 'quebec', 'morocco', 'algeria', 'tunisia', 'senegal', 'ivory coast',
    'cameroon', 'madagascar', 'mali', 'burkina faso', 'niger', 'benin', 'togo', 'guinea', 'chad', 'congo',
    'gabon', 'djibouti', 'comoros', 'seychelles', 'mauritius', 'haiti', 'luxembourg', 'monaco', 'francais', 'francophone'
  ]},
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', aliases: [
    'saudi arabia', 'saudi', 'egypt', 'morocco', 'algeria', 'tunisia', 'libya', 'sudan', 'iraq', 'syria',
    'jordan', 'lebanon', 'palestine', 'yemen', 'oman', 'uae', 'dubai', 'abu dhabi', 'qatar', 'bahrain', 'kuwait',
    'mauritania', 'somalia', 'djibouti', 'comoros', 'middle east', 'arab', 'gulf', 'maghreb', 'levant', 'arabie'
  ]},
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷', aliases: [
    'brazil', 'brasil', 'portugal', 'angola', 'mozambique', 'cape verde', 'guinea bissau', 'sao tome',
    'east timor', 'timor leste', 'macau', 'goa', 'brasileiro', 'portugues', 'lusophone'
  ]},
  { code: 'de', name: 'German', flag: '🇩🇪', aliases: [
    'germany', 'deutschland', 'austria', 'switzerland', 'liechtenstein', 'luxembourg', 'belgium',
    'south tyrol', 'alsace', 'deutsch', 'german speaking'
  ]},
  { code: 'zh', name: 'Mandarin Chinese', flag: '🇨🇳', aliases: [
    'china', 'taiwan', 'singapore', 'malaysia', 'chinese', 'zhongwen', 'putonghua', 'beijing', 'shanghai',
    'hong kong', 'macau', 'prc', 'mainland china', 'zhongguo'
  ]},
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', aliases: [
    'india', 'indian', 'bharat', 'hindustan', 'delhi', 'mumbai', 'bollywood', 'hindi belt', 'uttar pradesh',
    'madhya pradesh', 'rajasthan', 'bihar', 'jharkhand', 'uttarakhand', 'himachal', 'haryana', 'fiji hindi'
  ]},
  { code: 'ru', name: 'Russian', flag: '🇷🇺', aliases: [
    'russia', 'belarus', 'kazakhstan', 'kyrgyzstan', 'ukraine', 'moldova', 'estonia', 'latvia', 'lithuania',
    'uzbekistan', 'tajikistan', 'turkmenistan', 'georgia', 'armenia', 'azerbaijan', 'rossiya', 'russkiy', 'soviet'
  ]},
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', aliases: ['japan', 'nihon', 'nippon', 'tokyo', 'osaka', 'nihongo'] },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', aliases: ['korea', 'south korea', 'north korea', 'seoul', 'hangul', 'hangugeo', 'joseon'] },
  { code: 'it', name: 'Italian', flag: '🇮🇹', aliases: [
    'italy', 'italia', 'switzerland', 'san marino', 'vatican', 'italiano', 'rome', 'milan', 'sicily', 'sardinia'
  ]},
  // === TIER 2: Major Regional Languages ===
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', aliases: ['turkey', 'turkiye', 'cyprus', 'turkish republic', 'istanbul', 'ankara', 'turk'] },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', aliases: [
    'netherlands', 'holland', 'belgium', 'suriname', 'aruba', 'curacao', 'sint maarten', 'flemish', 'nederland', 'vlaams'
  ]},
  { code: 'pl', name: 'Polish', flag: '🇵🇱', aliases: ['poland', 'polska', 'polski', 'warsaw', 'krakow'] },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', aliases: ['vietnam', 'viet nam', 'hanoi', 'ho chi minh', 'saigon', 'tieng viet'] },
  { code: 'th', name: 'Thai', flag: '🇹🇭', aliases: ['thailand', 'bangkok', 'siam', 'thai', 'phasa thai'] },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩', aliases: ['indonesia', 'jakarta', 'bali', 'java', 'sumatra', 'bahasa indonesia'] },
  { code: 'ms', name: 'Malay', flag: '🇲🇾', aliases: ['malaysia', 'brunei', 'singapore', 'kuala lumpur', 'melayu', 'bahasa melayu'] },
  { code: 'tl', name: 'Filipino/Tagalog', flag: '🇵🇭', aliases: ['philippines', 'manila', 'tagalog', 'pinoy', 'pilipino', 'cebuano'] },
  { code: 'fa', name: 'Persian/Farsi', flag: '🇮🇷', aliases: ['iran', 'afghanistan', 'tajikistan', 'iranian', 'farsi', 'dari', 'tehran'] },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰', aliases: ['pakistan', 'pakistani', 'karachi', 'lahore', 'islamabad', 'urdu'] },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩', aliases: ['bangladesh', 'india', 'dhaka', 'kolkata', 'west bengal', 'bangla', 'bangladeshi'] },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱', aliases: ['israel', 'israeli', 'jerusalem', 'tel aviv', 'ivrit', 'jewish'] },
  // === TIER 3: European Languages ===
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', aliases: ['sweden', 'sverige', 'stockholm', 'svenska', 'finnish swedish'] },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴', aliases: ['norway', 'norge', 'oslo', 'norsk', 'bokmal', 'nynorsk'] },
  { code: 'da', name: 'Danish', flag: '🇩🇰', aliases: ['denmark', 'danmark', 'copenhagen', 'dansk', 'greenland', 'faroe'] },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮', aliases: ['finland', 'suomi', 'helsinki', 'finnish', 'suomalainen'] },
  { code: 'el', name: 'Greek', flag: '🇬🇷', aliases: ['greece', 'cyprus', 'athens', 'greek', 'ellada', 'hellas', 'ellinika'] },
  { code: 'cs', name: 'Czech', flag: '🇨🇿', aliases: ['czech republic', 'czechia', 'prague', 'cesko', 'cesky', 'bohemia', 'moravia'] },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺', aliases: ['hungary', 'budapest', 'magyar', 'magyarorszag'] },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴', aliases: ['romania', 'moldova', 'bucharest', 'romana', 'moldovan'] },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦', aliases: ['ukraine', 'kyiv', 'kiev', 'ukraina', 'ukrainska'] },
  { code: 'bg', name: 'Bulgarian', flag: '🇧🇬', aliases: ['bulgaria', 'sofia', 'balgaria', 'balgarski'] },
  { code: 'hr', name: 'Croatian', flag: '🇭🇷', aliases: ['croatia', 'zagreb', 'hrvatska', 'hrvatski'] },
  { code: 'sr', name: 'Serbian', flag: '🇷🇸', aliases: ['serbia', 'belgrade', 'srbija', 'srpski', 'montenegro'] },
  { code: 'sk', name: 'Slovak', flag: '🇸🇰', aliases: ['slovakia', 'bratislava', 'slovensko', 'slovensky'] },
  { code: 'sl', name: 'Slovenian', flag: '🇸🇮', aliases: ['slovenia', 'ljubljana', 'slovenija', 'slovenscina'] },
  { code: 'lt', name: 'Lithuanian', flag: '🇱🇹', aliases: ['lithuania', 'vilnius', 'lietuva', 'lietuviu'] },
  { code: 'lv', name: 'Latvian', flag: '🇱🇻', aliases: ['latvia', 'riga', 'latvija', 'latviesu'] },
  { code: 'et', name: 'Estonian', flag: '🇪🇪', aliases: ['estonia', 'tallinn', 'eesti', 'estonian'] },
  { code: 'is', name: 'Icelandic', flag: '🇮🇸', aliases: ['iceland', 'reykjavik', 'island', 'islenska'] },
  // === TIER 4: African & Middle Eastern ===
  { code: 'sw', name: 'Swahili', flag: '🇰🇪', aliases: [
    'kenya', 'tanzania', 'uganda', 'rwanda', 'burundi', 'congo', 'mozambique', 'nairobi', 'dar es salaam', 'kiswahili'
  ]},
  { code: 'am', name: 'Amharic', flag: '🇪🇹', aliases: ['ethiopia', 'addis ababa', 'ethiopian', 'amarinya'] },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬', aliases: ['nigeria', 'niger', 'ghana', 'cameroon', 'west africa', 'haoussa'] },
  { code: 'yo', name: 'Yoruba', flag: '🇳🇬', aliases: ['nigeria', 'benin', 'togo', 'lagos', 'west africa'] },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬', aliases: ['nigeria', 'biafra', 'igboland', 'enugu'] },
  { code: 'zu', name: 'Zulu', flag: '🇿🇦', aliases: ['south africa', 'kwazulu natal', 'durban', 'isizulu'] },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦', aliases: ['south africa', 'namibia', 'cape town', 'pretoria', 'boer'] },
  // === TIER 5: Asian Languages ===
  { code: 'zh-yue', name: 'Cantonese', flag: '🇭🇰', aliases: ['hong kong', 'macau', 'guangdong', 'guangzhou', 'hk', 'yue'] },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', aliases: ['india', 'sri lanka', 'singapore', 'malaysia', 'tamil nadu', 'chennai'] },
  { code: 'te', name: 'Telugu', flag: '🇮🇳', aliases: ['india', 'andhra pradesh', 'telangana', 'hyderabad'] },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳', aliases: ['india', 'maharashtra', 'mumbai', 'pune'] },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳', aliases: ['india', 'gujarat', 'ahmedabad', 'surat'] },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳', aliases: ['india', 'karnataka', 'bangalore', 'bengaluru'] },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳', aliases: ['india', 'kerala', 'kochi', 'trivandrum'] },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳', aliases: ['india', 'pakistan', 'punjab', 'amritsar', 'lahore', 'sikh'] },
  { code: 'ne', name: 'Nepali', flag: '🇳🇵', aliases: ['nepal', 'kathmandu', 'bhutan', 'sikkim', 'darjeeling'] },
  { code: 'si', name: 'Sinhala', flag: '🇱🇰', aliases: ['sri lanka', 'colombo', 'sinhalese', 'ceylon'] },
  { code: 'my', name: 'Burmese', flag: '🇲🇲', aliases: ['myanmar', 'burma', 'yangon', 'rangoon', 'mandalay'] },
  { code: 'km', name: 'Khmer', flag: '🇰🇭', aliases: ['cambodia', 'phnom penh', 'cambodian', 'kampuchea'] },
  { code: 'lo', name: 'Lao', flag: '🇱🇦', aliases: ['laos', 'vientiane', 'laotian'] },
  { code: 'mn', name: 'Mongolian', flag: '🇲🇳', aliases: ['mongolia', 'ulaanbaatar', 'inner mongolia'] },
  // === TIER 6: Central Asian & Caucasus ===
  { code: 'kk', name: 'Kazakh', flag: '🇰🇿', aliases: ['kazakhstan', 'astana', 'almaty', 'qazaq'] },
  { code: 'uz', name: 'Uzbek', flag: '🇺🇿', aliases: ['uzbekistan', 'tashkent', 'samarkand', 'ozbek'] },
  { code: 'az', name: 'Azerbaijani', flag: '🇦🇿', aliases: ['azerbaijan', 'baku', 'azeri'] },
  { code: 'ka', name: 'Georgian', flag: '🇬🇪', aliases: ['georgia', 'tbilisi', 'sakartvelo', 'kartuli'] },
  { code: 'hy', name: 'Armenian', flag: '🇦🇲', aliases: ['armenia', 'yerevan', 'hayastan', 'armenian diaspora'] },
  { code: 'ku', name: 'Kurdish', flag: '🇮🇶', aliases: ['iraq', 'iran', 'turkey', 'syria', 'kurdistan', 'erbil'] },
  { code: 'ps', name: 'Pashto', flag: '🇦🇫', aliases: ['afghanistan', 'pakistan', 'kabul', 'peshawar', 'pashtun'] },
]

// Number of languages to show initially
const INITIAL_LANGUAGES_COUNT = 24

export default function PlasticSurgeonLandingPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(true)
  // Dynamic member stats
  const [memberStats, setMemberStats] = useState(getMemberStats())
  const videoRef = useRef<HTMLVideoElement>(null)
  // Language search filter
  const [languageSearch, setLanguageSearch] = useState('')
  const [showAllLanguages, setShowAllLanguages] = useState(false)

  // Animation refs for scroll detection - initialize with hero visible for instant animation
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['hero']))

  // Sticky mobile CTA - shows after scrolling past hero
  const [showStickyCTA, setShowStickyCTA] = useState(false)

  // Live viewers count for urgency (realistic range)
  const [liveViewers, setLiveViewers] = useState(0)

  // Filter languages based on search (searches name AND country aliases)
  const filteredLanguages = SUPPORTED_LANGUAGES.filter(lang => {
    const searchTerm = languageSearch.toLowerCase().trim()
    if (!searchTerm) return true
    // Search in language name
    if (lang.name.toLowerCase().includes(searchTerm)) return true
    // Search in country/region aliases
    if (lang.aliases?.some(alias => alias.toLowerCase().includes(searchTerm))) return true
    return false
  })

  // Determine which languages to display (limited or all)
  const displayedLanguages = languageSearch
    ? filteredLanguages // Show all matches when searching
    : showAllLanguages
      ? filteredLanguages
      : filteredLanguages.slice(0, INITIAL_LANGUAGES_COUNT)

  const hiddenCount = filteredLanguages.length - INITIAL_LANGUAGES_COUNT

  // Update member stats every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setMemberStats(getMemberStats())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  // Meta tracking on page load - capture fbclid and fire ViewContent
  useEffect(() => {
    captureFbclid()
    // Small delay to ensure pixel is loaded
    const timer = setTimeout(() => {
      trackViewContent()
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Sticky mobile CTA - show after scrolling past 600px
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Live viewers count - realistic fluctuation
  useEffect(() => {
    // Start with realistic number
    setLiveViewers(Math.floor(Math.random() * 8) + 12) // 12-19

    // Update every 5-15 seconds with small changes
    const interval = setInterval(() => {
      setLiveViewers(prev => {
        const change = Math.floor(Math.random() * 5) - 2 // -2 to +2
        const newValue = prev + change
        return Math.max(8, Math.min(24, newValue)) // Keep between 8-24
      })
    }, Math.random() * 10000 + 5000)

    return () => clearInterval(interval)
  }, [])

  const faqs = [
    {
      q: 'Does this really take only 7 minutes?',
      a: 'Yes. Upload photo (1 min), type script (2 min), AI generates (4 min). Done. Zero editing needed. I timed it myself.',
    },
    {
      q: 'Will patients know it\'s AI?',
      a: `Most can't tell. The lip-sync is incredibly realistic. Your patients care about your message and expertise, not how you made it. ${memberStats.totalMembers.toLocaleString()}+ plastic surgeons are already using this successfully.`,
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
      q: 'Will this work for my plastic surgery practice?',
      a: `Yes. ${memberStats.totalMembers.toLocaleString()}+ plastic surgeons across the US, UK, Canada, and Australia use this daily. Works for cosmetic, reconstructive, facial, body contouring, and all specialties.`,
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
      role: 'Facial Plastic Surgeon',
      location: 'Los Angeles, CA',
      image: '/images/plastic-surgeon/review-1.webp',
      review: "I was skeptical about AI videos, but this changed everything. Created my first video in 7 minutes - got 12 new consultation inquiries that same week.",
      results: '12 new consults in first week',
    },
    {
      id: 2,
      name: 'Dr. James Rodriguez',
      role: 'Cosmetic Surgeon',
      location: 'Houston, TX',
      image: '/images/plastic-surgeon/review-2.webp',
      review: "After 20 years in plastic surgery, I thought I'd seen it all. My consultation calendar is now booked 6 weeks out - all from AI video leads.",
      results: 'Booked 6 weeks out',
    },
    {
      id: 3,
      name: 'Dr. Emily Chen',
      role: 'Body Contouring Specialist',
      location: 'San Francisco, CA',
      image: '/images/plastic-surgeon/review-3.webp',
      review: "As a Bay Area surgeon, I need to stand out. These AI videos make my practice look like a premium brand. Went from 2-3 consults to 15+ per week.",
      results: '15+ consults/week',
    },
    {
      id: 4,
      name: 'Dr. Michael Thompson',
      role: 'Breast Augmentation Specialist',
      location: 'Chicago, IL',
      image: '/images/plastic-surgeon/review-5.webp',
      review: "Was spending $2,000/month on video production. Now I create better content myself in minutes. ROI was immediate.",
      results: '50x ROI',
    },
    {
      id: 5,
      name: 'Dr. Lisa Park',
      role: 'Rhinoplasty Specialist',
      location: 'Seattle, WA',
      image: '/images/plastic-surgeon/review-9.webp',
      review: "My TikTok video got 89K views. Booked 23 new rhinoplasty consultations that month. This system pays for itself daily.",
      results: '23 consults from 1 video',
    },
    {
      id: 6,
      name: 'Dr. Robert Johnson',
      role: 'Aesthetic Plastic Surgeon',
      location: 'Phoenix, AZ',
      image: '/images/plastic-surgeon/review-11.webp',
      review: "25 years in plastic surgery and I wish I had this sooner. 8 new patients last month from social media alone.",
      results: '8 patients from social',
    },
  ]

  // Scroll animation observer - optimized for mobile performance
  useEffect(() => {
    // Track already-triggered sections to avoid duplicate state updates
    const triggeredSections = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        // Batch DOM updates
        const sectionsToAdd: string[] = []

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            const id = entry.target.id
            if (id && !triggeredSections.has(id)) {
              triggeredSections.add(id)
              sectionsToAdd.push(id)
              // Unobserve after triggering to reduce overhead
              observer.unobserve(entry.target)
            }
          }
        })

        // Single state update for all new sections
        if (sectionsToAdd.length > 0) {
          setVisibleSections((prev) => {
            const next = new Set(prev)
            sectionsToAdd.forEach(id => next.add(id))
            return next
          })
        }
      },
      {
        threshold: 0.1, // Slightly higher threshold for better triggering
        rootMargin: '0px 0px 100px 0px' // Reduced margin for mobile
      }
    )

    // Use requestIdleCallback for non-critical initialization
    const initObserver = () => {
      const animatedElements = document.querySelectorAll('[data-animate]')
      animatedElements.forEach((el) => observer.observe(el))
    }

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(initObserver, { timeout: 200 })
    } else {
      setTimeout(initObserver, 100)
    }

    return () => observer.disconnect()
  }, [])

  // Countdown timer - Dynamic deadline: 3 days from first visit (stored in localStorage)
  useEffect(() => {
    // Get or set deadline for this user
    const getDeadline = () => {
      const storedDeadline = localStorage.getItem('ps_bonus_deadline')
      if (storedDeadline) {
        return new Date(storedDeadline)
      }
      // Set deadline to 3 days from now
      const deadline = new Date()
      deadline.setDate(deadline.getDate() + 3)
      deadline.setHours(23, 59, 59, 999)
      localStorage.setItem('ps_bonus_deadline', deadline.toISOString())
      return deadline
    }

    const BONUS_DEADLINE = getDeadline()

    const calculateTimeLeft = () => {
      const now = new Date()
      const diff = BONUS_DEADLINE.getTime() - now.getTime()

      // If deadline passed, reset to 3 days from now
      if (diff <= 0) {
        localStorage.removeItem('ps_bonus_deadline')
        return { days: 2, hours: 23, minutes: 59, seconds: 59 }
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

  const allBonuses = PLASTIC_SURGEON_BONUS_PRODUCTS
  const totalBonusValue = getPlasticSurgeonTotalBonusValue()

  // Animation class helper
  const getAnimClass = (sectionId: string, delay: number = 0) => {
    const isVisible = visibleSections.has(sectionId)
    return `transition-all duration-700 ${delay ? `delay-[${delay}ms]` : ''} ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`
  }

  return (
    <main
      className="min-h-screen noise-overlay font-sans relative plastic-surgeon-theme"
      style={{
        background: `
          radial-gradient(ellipse at 20% 0%, rgba(212, 175, 55, 0.12) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 100%, rgba(184, 134, 11, 0.08) 0%, transparent 50%),
          linear-gradient(135deg, #0a0a0a 0%, #0f0d08 50%, #1a1505 100%)
        `
      }}
    >
      {/* Plastic Surgeon Theme Overrides - Black & Gold */}
      <style jsx global>{`
        .plastic-surgeon-theme .text-gradient-premium {
          background: linear-gradient(135deg, #f4d03f 0%, #d4af37 50%, #b8860b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .plastic-surgeon-theme .btn-premium {
          background: linear-gradient(135deg, #d4af37 0%, #c9a227 100%);
        }
        .plastic-surgeon-theme .btn-premium:hover {
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4), 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .plastic-surgeon-theme .shadow-glow-teal {
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.3), 0 0 60px rgba(212, 175, 55, 0.15);
        }
        .plastic-surgeon-theme .glass-teal {
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.2);
          backdrop-filter: blur(8px);
        }
        .plastic-surgeon-theme .animate-pulse-glow {
          animation: pulse-glow-gold 2s ease-in-out infinite;
        }
        @keyframes pulse-glow-gold {
          0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.4), 0 0 40px rgba(212, 175, 55, 0.2); }
          50% { box-shadow: 0 0 30px rgba(212, 175, 55, 0.6), 0 0 60px rgba(212, 175, 55, 0.3); }
        }
      `}</style>

      {/* Animated Background - Performance Optimized */}
      <AnimatedBackground variant="plastic-surgeon" />

      {/* ================================================================
          1. HERO SECTION - PREMIUM ANIMATED GRADIENT
          ================================================================ */}
      <section
        id="hero"
        data-animate
        className="relative text-white py-8 sm:py-16 md:py-20 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #0f0d08 25%, #1a1505 50%, #0f0d08 75%, #0a0a0a 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 20s ease infinite'
        }}
      >
        {/* Premium animated gold gradient overlay */}
        <div
          className="absolute inset-0 animate-gradient-xy"
          style={{
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(184, 134, 11, 0.08) 25%, transparent 50%, rgba(245, 158, 11, 0.08) 75%, rgba(217, 119, 6, 0.12) 100%)',
            backgroundSize: '400% 400%'
          }}
        />

        {/* Subtle grid pattern - gold themed */}
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.6) 1px, transparent 0)',
            backgroundSize: '48px 48px'
          }} />
        </div>

        {/* Premium floating orbs - gold themed */}
        <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-gradient-to-br from-amber-600/20 to-yellow-500/10 rounded-full blur-[100px] floating-slow" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-amber-500/15 to-orange-500/10 rounded-full blur-[80px] floating" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/10 to-yellow-500/5 rounded-full blur-[120px] floating-slow" style={{ animationDelay: '4s' }} />

        {/* Mobile-only animated particles */}
        <div className="sm:hidden">
          <div className="absolute top-20 left-10 w-2 h-2 bg-amber-400/40 rounded-full animate-ping" />
          <div className="absolute top-40 right-8 w-3 h-3 bg-yellow-500/30 rounded-full animate-pulse" />
          <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-amber-300/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
        </div>

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
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-gray-300 text-xs sm:text-sm">Clinically-inspired framework by</span>
                <span className="text-amber-300 font-semibold text-xs sm:text-sm">Dr. Sofia Martinez, MD, FACS — Board-Certified Plastic Surgeon</span>
              </div>
            </div>

            {/* Hero Image - Premium Glass Container - Mobile Optimized */}
            <div className={`relative max-w-5xl mx-auto mb-4 sm:mb-6 ${visibleSections.has('hero') ? 'animate-scale-in animation-delay-300' : ''}`}>
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden glass-premium shadow-premium-lg hover-lift img-zoom">
                {/* Mobile: 22KB optimized hero */}
                <Image
                  src="/images/plastic-surgeon/surgeon-hero-mobile.webp"
                  alt="AI Video System for Plastic Surgeons Showcase"
                  width={640}
                  height={358}
                  className="w-full h-auto sm:hidden"
                  priority
                />
                {/* Desktop: Full quality hero */}
                <Image
                  src="/images/plastic-surgeon/surgeon-hero.webp"
                  alt="AI Video System for Plastic Surgeons Showcase"
                  width={1365}
                  height={768}
                  className="w-full h-auto hidden sm:block"
                  priority
                  sizes="(max-width: 1024px) 80vw, 800px"
                />
              </div>
            </div>

            {/* Trust badges - Premium Glass Cards */}
            <div className={`flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 stagger-fast ${visibleSections.has('hero') ? 'visible' : ''}`}>
              <div className="flex items-center gap-2 glass-teal px-4 py-2.5 rounded-full hover-scale">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                <span className="text-gray-300 text-xs sm:text-sm"><span className="text-white font-bold">{memberStats.totalMembers.toLocaleString()}+</span> plastic surgeons</span>
              </div>
              <div className="flex items-center gap-2 glass-teal px-4 py-2.5 rounded-full hover-scale">
                <div className="relative">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                </div>
                <span className="text-gray-300 text-xs sm:text-sm"><span className="text-emerald-400 font-bold">{memberStats.activeNow.toLocaleString()}</span> active now</span>
              </div>
              <div className="flex items-center gap-1.5 glass-teal px-4 py-2.5 rounded-full hover-scale">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1 text-white font-bold text-xs sm:text-sm">4.9/5</span>
              </div>
              <div className="flex items-center gap-2 glass-teal px-4 py-2.5 rounded-full hover-scale">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                <span className="text-gray-300 text-xs sm:text-sm">30-Day Guarantee</span>
              </div>
              {/* Countdown Badge */}
              <div className="flex items-center gap-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/40 px-4 py-2.5 rounded-full hover-scale animate-pulse-soft">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                <span className="text-red-300 text-xs sm:text-sm font-bold">
                  {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m left
                </span>
              </div>
            </div>

            {/* CTA - Premium Button with Glow */}
            <a
              onClick={trackInitiateCheckout} href={WHOP_CHECKOUT_LINK}
                            className={`group relative inline-flex items-center justify-center btn-premium btn-press text-white px-8 sm:px-14 py-4 sm:py-5 rounded-2xl font-black text-base sm:text-xl shadow-glow-teal animate-pulse-glow hover-glow ${visibleSections.has('hero') ? 'animate-bounce-in animation-delay-500' : ''}`}
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
                <span className="text-gray-500 text-sm line-through">${getPlasticSurgeonTotalBonusValue() + 98}</span>
                <span className="text-gradient-premium font-black text-2xl sm:text-3xl">$47.82</span>
                <span className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">98% OFF</span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm font-medium">One-time payment • Lifetime access • 30-day guarantee</p>
            </div>

            {/* What is CloneYourself? - Collapsible */}
            <div className={`max-w-xl mx-auto mt-8 ${visibleSections.has('hero') ? 'animate-fade-in-up animation-delay-500' : ''}`}>
              <button
                onClick={() => setExpandedFaq(expandedFaq === -1 ? null : -1)}
                className="group flex items-center justify-center gap-2 mx-auto text-sm"
              >
                <span className="text-amber-400 font-medium border-b border-dashed border-amber-400/40 group-hover:border-amber-400 transition-colors">
                  What is the CloneYourself System?
                </span>
                <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform duration-300 ${expandedFaq === -1 ? 'rotate-180' : ''}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-500 ease-out ${expandedFaq === -1 ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
                <div className="bg-gradient-to-br from-amber-500/10 to-white/5 backdrop-blur-sm border border-amber-500/20 rounded-xl p-5 text-left">
                  <p className="text-white text-sm leading-relaxed mb-3">
                    You upload <span className="text-amber-400 font-bold">one clear selfie</span> to a free AI software — the #1 tool for generating realistic talking videos in {new Date().getFullYear()}.
                  </p>
                  <p className="text-white/80 text-sm leading-relaxed mb-3">
                    The AI transforms your photo into a <span className="text-amber-400 font-bold">talking video of YOU</span> — your face moves, your lips sync perfectly, it looks 100% real. No filming. No editing. No experience needed.
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
          LANGUAGE SUPPORT - PREMIUM HIGH-CVR SECTION
          Global coverage with search, stats & social proof
          ================================================================ */}
      {/* HIDDEN FOR NOW - To re-enable, remove the {false && ( wrapper and closing )} */}
      {false && (
      <section
        id="languages"
        className="py-12 sm:py-20 bg-black relative"
      >
        {/* Background glow effects - hidden on mobile for performance */}
        <div className="absolute inset-0 pointer-events-none hidden sm:block">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        <div className="w-full px-3 sm:px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Header with impressive stats */}
            <div className="text-center mb-6 sm:mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-500/20 border border-amber-500/40 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span className="text-white font-bold text-xs sm:text-sm">Used by 3,247+ Surgeons in 100+ Countries</span>
              </div>
              <h2 className="text-xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-3 leading-tight">
                Works in <span className="bg-gradient-to-r from-amber-400 to-amber-400 bg-clip-text text-transparent">Your Language</span>
              </h2>
              <p className="text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto">
                AI generates videos with <span className="text-white font-semibold">perfect native pronunciation</span> in 100+ languages.
              </p>
            </div>

            {/* Live stats bar */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-white/5 border border-white/10 rounded-lg sm:rounded-xl p-2.5 sm:p-4 text-center">
                <div className="text-lg sm:text-3xl font-black text-amber-400">3,247+</div>
                <div className="text-gray-400 text-[10px] sm:text-sm">Surgeons Worldwide</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg sm:rounded-xl p-2.5 sm:p-4 text-center">
                <div className="text-lg sm:text-3xl font-black text-amber-400">100+</div>
                <div className="text-gray-400 text-[10px] sm:text-sm">Languages</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg sm:rounded-xl p-2.5 sm:p-4 text-center">
                <div className="text-lg sm:text-3xl font-black text-green-400">127K+</div>
                <div className="text-gray-400 text-[10px] sm:text-sm">Videos Created</div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-5 sm:mb-6">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search your language..."
                  value={languageSearch}
                  onChange={(e) => setLanguageSearch(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all"
                />
                {languageSearch && (
                  <button
                    onClick={() => setLanguageSearch('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {languageSearch && (
                <p className="text-center text-gray-500 text-xs sm:text-sm mt-2">
                  Found {filteredLanguages.length} language{filteredLanguages.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Languages Grid - Mobile optimized */}
            <div className="bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-6 mb-5 sm:mb-6">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3">
                {displayedLanguages.map((lang) => (
                  <div
                    key={lang.code}
                    className="text-center"
                  >
                    <div className="bg-white/5 border border-white/10 rounded-lg p-1.5 sm:p-3 hover:bg-white/10 hover:border-amber-500/30 transition-all">
                      <span className="text-xl sm:text-3xl block">{lang.flag}</span>
                      <p className="text-white text-[8px] sm:text-xs font-medium truncate mt-0.5 sm:mt-1">{lang.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* No results message */}
              {filteredLanguages.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-gray-400 text-sm">No languages found for "{languageSearch}"</p>
                  <p className="text-gray-500 text-xs mt-1">Try searching by country name (e.g., "Brazil", "Japan")</p>
                  <button
                    onClick={() => setLanguageSearch('')}
                    className="text-amber-400 hover:text-amber-300 text-sm mt-3 underline"
                  >
                    Clear search
                  </button>
                </div>
              )}

              {/* Show more/less button */}
              {!languageSearch && hiddenCount > 0 && (
                <div className="text-center mt-4 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setShowAllLanguages(!showAllLanguages)}
                    className="inline-flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-full text-sm font-medium transition-all"
                  >
                    {showAllLanguages ? (
                      <>
                        <ChevronDown className="w-4 h-4 rotate-180" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Show {hiddenCount} More Languages
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Testimonial from international surgeon */}
            <div className="bg-gradient-to-r from-amber-500/10 to-amber-500/10 border border-amber-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-500 flex items-center justify-center text-white text-sm sm:text-xl font-bold">
                    CS
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-gray-500 text-[10px] sm:text-xs">Verified</span>
                  </div>
                  <p className="text-white text-xs sm:text-base leading-relaxed mb-2 sm:mb-3">
                    "The Portuguese accent is <span className="text-amber-400 font-semibold">perfect</span> — my patients can't tell it's AI. Consultation requests tripled. <span className="text-amber-400 font-semibold">Worth every penny.</span>"
                  </p>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="text-white font-semibold text-xs sm:text-sm">Dr. Carolina Santos</span>
                    <span className="text-gray-500 text-[10px] sm:text-xs">• São Paulo 🇧🇷</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom note */}
            <div className="text-center mt-4 sm:mt-6">
              <p className="text-gray-500 text-[10px] sm:text-sm">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1 text-green-400" />
                New languages added monthly • <a href="mailto:support@aifastscale.com" className="text-amber-400 hover:underline">Request yours</a>
              </p>
            </div>
          </div>
        </div>
      </section>
      )}
      {/* END HIDDEN LANGUAGE SECTION */}

      {/* ================================================================
          NO HASSLE REFUND POLICY - AFTER LANGUAGES (DUPLICATE)
          ================================================================ */}
      <section
        id="refund-policy-top"
        data-animate
        className="py-10 sm:py-20 bg-black relative overflow-hidden"
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-2 h-2 bg-amber-500/30 rounded-full animate-ping" />
          <div className="absolute top-1/3 right-20 w-3 h-3 bg-amber-500/20 rounded-full animate-pulse" />
          <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-amber-400/30 rounded-full animate-bounce" />
          <div className="absolute top-1/2 right-10 w-2 h-2 bg-green-500/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        </div>

        <div className="w-full px-3 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className={`bg-gradient-to-br from-white/10 to-white/5 border-2 border-amber-500/40 rounded-xl sm:rounded-2xl p-5 sm:p-10 backdrop-blur-sm ${
              visibleSections.has('refund-policy-top') ? 'animate-fade-in-up' : ''
            }`}>
              <div className="text-center mb-6 sm:mb-10">
                <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4">
                  <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-bounce" />
                  <span className="text-amber-400 font-bold text-xs sm:text-sm uppercase">No Hassle Policy</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white mb-2 sm:mb-4">
                  Need a Refund? <span className="text-amber-400">It's THIS Easy</span>
                </h2>
                <p className="text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto">
                  We made the refund process so simple, you can do it in 30 seconds.
                  No phone calls. No guilt trips. No waiting.
                </p>
              </div>

              {/* Creative Animated Steps - Timeline Style */}
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-amber-500 to-green-500 -translate-x-1/2 hidden md:block" />

                {/* Mobile: Simple stacked layout | Desktop: Zigzag with line */}
                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className={`relative flex flex-col md:flex-row items-center gap-3 md:gap-4 ${visibleSections.has('refund-policy-top') ? 'animate-fade-in-up' : ''}`}>
                    {/* Icon - shown first on mobile */}
                    <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-amber-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/40 md:order-2">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                      <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                        <span className="text-amber-600 font-black text-xs sm:text-sm">1</span>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="w-full md:flex-1 md:text-right md:order-1">
                      <div className="bg-gradient-to-r from-amber-500/20 to-transparent rounded-xl p-4 border border-amber-500/30">
                        <h3 className="text-white font-black text-base sm:text-lg mb-1">Send a Quick Email</h3>
                        <p className="text-gray-400 text-xs sm:text-sm">Just write "I want a refund" - that's it!</p>
                      </div>
                    </div>
                    {/* Desktop spacer */}
                    <div className="hidden md:block md:flex-1 md:order-3" />
                  </div>

                  {/* Step 2 */}
                  <div className={`relative flex flex-col md:flex-row items-center gap-3 md:gap-4 ${visibleSections.has('refund-policy-top') ? 'animate-fade-in-up animation-delay-200' : ''}`}>
                    {/* Icon */}
                    <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-amber-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/40 md:order-2">
                      <Send className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                      <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                        <span className="text-amber-600 font-black text-xs sm:text-sm">2</span>
                      </div>
                    </div>
                    {/* Desktop spacer */}
                    <div className="hidden md:block md:flex-1 md:order-1" />
                    {/* Content */}
                    <div className="w-full md:flex-1 md:order-3">
                      <div className="bg-gradient-to-l from-amber-500/20 to-transparent rounded-xl p-4 border border-amber-500/30">
                        <h3 className="text-white font-black text-base sm:text-lg mb-1">We Process Instantly</h3>
                        <p className="text-gray-400 text-xs sm:text-sm">No questions, no forms, no waiting period</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className={`relative flex flex-col md:flex-row items-center gap-3 md:gap-4 ${visibleSections.has('refund-policy-top') ? 'animate-fade-in-up animation-delay-400' : ''}`}>
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
                <div className="inline-block bg-gradient-to-r from-amber-500/20 via-amber-500/20 to-green-500/20 rounded-xl p-4 sm:p-6 border border-white/10">
                  <p className="text-white font-bold text-sm sm:text-lg mb-2">
                    That's it. <span className="text-amber-400">3 simple steps.</span>
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
          2. CASE STUDY #1 - DR. DANIEL - LIGHT CREAM SECTION
          "He booked $156K in procedures in 8 weeks"
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
            <div className={`text-center mb-8 sm:mb-12 relative z-10 ${visibleSections.has('case-study') ? 'animate-fade-in-down' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 px-4 py-2 rounded-full mb-4 hover-scale">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-amber-700 font-bold text-xs uppercase tracking-wide">Real Results • Board-Certified Surgeon</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-3 sm:mb-4 leading-tight">
                Dr. Daniel Booked <span className="text-amber-600">$156K in Procedures</span>...
              </h2>
              <p className="text-xl sm:text-2xl text-gray-700 font-bold">Without Filming a Single Video Himself.</p>
            </div>

            {/* Dr. Daniel Case Study Card - Premium Modern Design */}
            <div className={`relative bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-amber-500/20 rounded-2xl sm:rounded-3xl overflow-hidden card-hover ${visibleSections.has('case-study') ? 'animate-scale-in animation-delay-200' : ''}`}>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-500/5 pointer-events-none" />

              {/* Hero Section - Big Visual */}
              <div className="relative p-4 sm:p-8">
                {/* The Hook Text */}
                <div className="text-center mb-6">
                  <p className="text-gray-400 text-sm sm:text-base mb-2">Yes, that's him talking on camera. But here's the thing...</p>
                  <p className="text-white text-2xl sm:text-3xl font-black mb-3 leading-tight">
                    He Never Stepped in Front of a Camera.
                  </p>
                  <p className="text-amber-400 text-base sm:text-lg font-medium">
                    He uploaded one photo. The AI cloned his voice and face. Now his OR is booked 6 weeks out.
                  </p>
                </div>

                {/* Video - Lazy loaded, Autoplay when visible, Mobile optimized */}
                <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-2xl shadow-amber-500/10 bg-black aspect-square max-w-md mx-auto">
                  {visibleSections.has('case-study') ? (
                    <>
                      {/* Mobile: 315KB video */}
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster="/images/plastic-surgeon/dr-sofia.webp"
                        className="w-full h-full object-contain sm:hidden"
                        src="/videos/plastic-surgeon-daniel-mobile.mp4"
                      />
                      {/* Desktop: Full quality video */}
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster="/images/plastic-surgeon/dr-sofia.webp"
                        className="w-full h-full object-contain hidden sm:block"
                        src="/videos/plastic-surgeon-daniel.mp4"
                      />
                    </>
                  ) : (
                    <Image
                      src="/images/plastic-surgeon/dr-sofia.webp"
                      alt="Dr. Daniel - AI Video Example"
                      fill
                      className="object-contain"
                      loading="lazy"
                    />
                  )}
                </div>

                {/* Verified Badge */}
                <div className="flex justify-center mt-4">
                  <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-full">
                    <Check className="w-4 h-4 text-amber-400" />
                    <span className="text-white text-sm font-medium">Board-Certified Surgeon • Verified Results</span>
                  </div>
                </div>
              </div>

              {/* Results Strip */}
              <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/20 to-amber-500/20 border-y border-amber-500/30 py-4 px-4 sm:px-8">
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { number: '28', label: 'Consultations', sub: 'in 4 weeks' },
                    { number: '7', label: 'Minutes', sub: 'per video' },
                    { number: '$0', label: 'Ad Spend', sub: '100% organic' },
                  ].map((stat, i) => (
                    <div key={i}>
                      <div className="text-amber-400 text-2xl sm:text-4xl font-black">{stat.number}</div>
                      <div className="text-white text-xs sm:text-sm font-bold">{stat.label}</div>
                      <div className="text-gray-500 text-[10px] sm:text-xs">{stat.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline / Results */}
              <div className="p-4 sm:p-8 border-t border-white/10">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full">
                    <span className="text-amber-400 text-xs font-bold">FROM SKEPTIC TO BELIEVER</span>
                  </div>
                </div>

                {/* Timeline - improved mobile layout */}
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { time: 'Day 1', event: 'Created first AI video explaining rhinoplasty recovery (7 min)', icon: Upload, color: 'gray' },
                    { time: 'Day 3', event: 'Posted on Instagram Reels & TikTok', icon: Eye, color: 'gray' },
                    { time: 'Week 1', event: 'Video hit 47K views • 12 consultation requests', icon: Phone, color: 'teal' },
                    { time: 'Week 2', event: '3 rhinoplasties booked ($24K avg each = $72K)', icon: Calendar, color: 'teal' },
                    { time: 'Week 4', event: '28 total consultations • 9 surgeries scheduled', icon: FileText, color: 'teal' },
                    { time: 'Week 8', event: '$156,000 in new procedure revenue', icon: DollarSign, color: 'green' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.color === 'green' ? 'bg-green-500/20 border border-green-500/40' :
                        item.color === 'teal' ? 'bg-amber-500/20 border border-amber-500/40' :
                        'bg-white/5 border border-white/20'
                      }`}>
                        <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          item.color === 'green' ? 'text-green-400' :
                          item.color === 'teal' ? 'text-amber-400' :
                          'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`inline-block text-[10px] sm:text-xs font-black px-2 py-0.5 rounded mb-1 ${
                          item.color === 'green' ? 'bg-green-500/20 text-green-400' :
                          item.color === 'teal' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-white/10 text-gray-400'
                        }`}>{item.time}</span>
                        <p className={`text-xs sm:text-sm leading-snug ${item.color === 'green' ? 'text-green-400 font-bold' : 'text-gray-300'}`}>{item.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Quote */}
              <div className="p-6 sm:p-8 bg-gradient-to-r from-amber-500/10 to-amber-500/5 border-t border-amber-500/30">
                <div className="flex items-start gap-4">
                  <div className="text-amber-400 text-4xl font-serif leading-none">"</div>
                  <div>
                    <p className="text-white text-lg sm:text-xl font-medium italic leading-relaxed mb-4">
                      I've spent <span className="text-gray-400">$50,000+</span> on marketing agencies over the years. Nothing worked like this.
                      <span className="text-amber-400 font-bold"> 28 qualified consultations in 4 weeks</span> — patients who already trusted me before walking in.
                      My OR is now booked 6 weeks out.
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">DR</span>
                      </div>
                      <div>
                        <p className="text-white font-bold">Dr. Daniel Rivera</p>
                        <p className="text-gray-400 text-sm">Facial Plastic Surgeon, Miami FL</p>
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
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
                  { value: '28', label: 'Consultations', sub: '4 weeks' },
                  { value: '$156K', label: 'Revenue', sub: '8 weeks' },
                ].map((stat, i) => (
                  <div key={i} className="p-4 sm:p-6 text-center">
                    <div className={`text-xl sm:text-2xl font-black mb-1 ${i === 1 ? 'text-amber-400' : i === 2 ? 'text-green-400' : 'text-white'}`}>{stat.value}</div>
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
          3. WHAT'S INSIDE - BLACK SECTION (Product Showcase)
          ================================================================ */}
      <section
        id="whats-inside"
        data-animate
        className="py-10 sm:py-20 bg-gradient-to-b from-black via-slate-950 to-black"
      >
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className={`text-center mb-6 sm:mb-12 ${visibleSections.has('whats-inside') ? 'animate-blur-in' : ''}`}>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-4">
                Here's What You Get <span className="text-amber-400">Today</span>
              </h2>
              <p className="text-gray-400 text-sm sm:text-lg">Everything you need to start getting new patients with AI videos</p>
            </div>

            {/* PRODUCT #1 - THE MAIN COURSE */}
            <div className={`bg-gradient-to-br from-amber-500/15 to-amber-500/5 border-2 border-amber-500 rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-6 card-hover img-zoom ${
              visibleSections.has('whats-inside') ? 'animate-fade-in-left animation-delay-200' : ''
            }`}>
              {/* Large Course Thumbnail */}
              <div className="relative w-full aspect-video">
                <Image
                  src="/images/plastic-surgeon/course-demo.webp"
                  alt="CloneYourself 7-Minute Video System for Plastic Surgeons"
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 800px"
                />
              </div>

              {/* Course Details */}
              <div className="p-4 sm:p-8">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="bg-amber-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-black">MAIN TRAINING</span>
                  <span className="text-gray-400 line-through text-xs sm:text-sm">$497</span>
                  <span className="text-amber-400 font-black text-xs sm:text-base">INCLUDED</span>
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
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Expert credibility line */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-gray-400 text-xs sm:text-sm flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>Clinically-structured lessons and examples created with input from <span className="text-amber-400 font-medium">Dr. Sofia Martinez</span>, Board-Certified Plastic Surgeon, MD, FACS</span>
                  </p>
                </div>
              </div>
            </div>

            {/* BONUSES HEADER */}
            <div className={`text-center mb-4 sm:mb-6 ${visibleSections.has('whats-inside') ? 'animate-fade-in-up animation-delay-300' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full">
                <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                <span className="text-amber-400 font-black text-sm sm:text-base">+ 10 BONUSES (${totalBonusValue} Value)</span>
              </div>
            </div>

            {/* ALL 10 BONUS PRODUCTS */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {allBonuses.map((bonus, index) => (
                <div key={bonus.id} className={`bg-gradient-to-br from-white/8 to-white/3 border border-amber-500/30 rounded-xl sm:rounded-2xl overflow-hidden hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 ${visibleSections.has('whats-inside') ? 'animate-fade-in-up' : ''}`}>
                  <div className="w-full aspect-[16/9] relative bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
                    <Image src={bonus.image || '/images/plastic-surgeon/course-demo.webp'} alt={bonus.title} fill className="object-contain p-2" loading="lazy" sizes="(max-width: 640px) 100vw, 400px" />
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
              <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 rounded-xl p-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Direct Support</h4>
                    <p className="text-gray-400 text-sm">Email + chat support included</p>
                    <p className="text-amber-400 font-bold text-sm mt-1">$197 value — FREE</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 rounded-xl p-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Lifetime Updates</h4>
                    <p className="text-gray-400 text-sm">New tools & templates weekly</p>
                    <p className="text-amber-400 font-bold text-sm mt-1">$297 value — FREE</p>
                  </div>
                </div>
              </div>
            </div>

            {/* TOTAL VALUE + CTA - Compact on mobile */}
            <div className={`bg-gradient-to-br from-amber-500/20 to-black rounded-2xl border-2 border-amber-500 p-4 sm:p-8 ${
              visibleSections.has('whats-inside') ? 'animate-fade-in-up' : ''
            }`}>
              {/* Price Box - Compact */}
              <div className="bg-black/50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 text-center border border-amber-500/30">
                <p className="text-amber-400 font-bold text-sm sm:text-base mb-2">Get Everything Today For</p>
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1">
                  <span className="text-4xl sm:text-6xl font-black text-amber-400">$47.82</span>
                  <div className="text-left">
                    <span className="bg-red-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm font-black block">98% OFF</span>
                    <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5">One-time</p>
                  </div>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">Lifetime access • No hidden costs</p>
              </div>

              {/* CTA Button */}
              <Link
                onClick={trackInitiateCheckout} href={WHOP_CHECKOUT_LINK}
                                className="w-full bg-gradient-to-r from-amber-500 to-amber-500 text-white py-4 sm:py-5 rounded-xl font-black text-base sm:text-xl shadow-xl flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4 hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                Get Instant Access Now
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>

              {/* Trust - Compact */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-gray-400 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                  <span>30-Day Guarantee</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
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
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-amber-400 font-black text-lg sm:text-xl">{item.step}</span>
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
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl" />

        <div className="w-full px-3 sm:px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className={`text-center mb-8 sm:mb-14 ${visibleSections.has('how-it-works') ? 'animate-zoom-in' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-full mb-4 hover-scale">
                <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
                <span className="text-amber-600 font-black text-xs uppercase tracking-wide">4 Simple Steps</span>
                <span className="text-gray-400 text-xs">•</span>
                <span className="text-amber-600 font-bold text-xs">~20 min total</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-3 sm:mb-4">
                From Zero to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-500">AI Video</span> in Minutes
              </h2>
              <p className="text-gray-600 text-sm sm:text-lg max-w-2xl mx-auto">
                Even if you've never touched AI before. Works <span className="font-bold text-gray-800">only for plastic surgeons</span>.
              </p>
            </div>

            {/* 4 Steps - Creative Timeline */}
            <div className="relative">
              {/* Connecting line - desktop */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-500 to-green-500 -translate-y-1/2 rounded-full opacity-20" />

              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 stagger-children ${visibleSections.has('how-it-works') ? 'visible' : ''}`}>
                {/* Step 1 - Generate Script */}
                <div className="group relative">
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 sm:p-6 border-2 border-gray-100 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 h-full hover-lift">
                    {/* Step number - floating */}
                    <div className="absolute -top-3 -left-2 sm:-top-4 sm:-left-3">
                      <div className="relative">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                          <span className="text-white font-black text-lg sm:text-xl">1</span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                          <Zap className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Time badge */}
                    <div className="flex justify-end mb-4 mt-2">
                      <span className="bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/20">
                        5 min
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-amber-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <MessageSquare className="w-7 h-7 text-amber-500" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">Generate Script</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Use our <span className="text-amber-600 font-semibold">ChatGPT specialist</span> built for plastic surgery practices. Just describe your topic.
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
                <div className="group relative">
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 sm:p-6 border-2 border-gray-100 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 h-full hover-lift">
                    {/* Step number */}
                    <div className="absolute -top-3 -left-2 sm:-top-4 sm:-left-3">
                      <div className="relative">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                          <span className="text-white font-black text-lg sm:text-xl">2</span>
                        </div>
                      </div>
                    </div>

                    {/* Time badge */}
                    <div className="flex justify-end mb-4 mt-2">
                      <span className="bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/20">
                        3 min
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-amber-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <Upload className="w-7 h-7 text-amber-500" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">Pick Your Image</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Upload a selfie <span className="text-amber-600 font-semibold">OR</span> generate your personalized AI model from scratch.
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
                <div className="group relative">
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 sm:p-6 border-2 border-gray-100 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 h-full hover-lift">
                    {/* Step number */}
                    <div className="absolute -top-3 -left-2 sm:-top-4 sm:-left-3">
                      <div className="relative">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                          <span className="text-white font-black text-lg sm:text-xl">3</span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-500 to-amber-500 rounded-full flex items-center justify-center">
                          <Play className="w-2.5 h-2.5 text-white ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Time badge */}
                    <div className="flex justify-end mb-4 mt-2">
                      <span className="bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/20">
                        5 min
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <Video className="w-7 h-7 text-amber-500" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">Make It Talk</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      AI generates a <span className="text-amber-600 font-semibold">realistic talking video</span> with perfect lip-sync. Like magic.
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
                <div className="group relative">
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-5 sm:p-6 border-2 border-green-100 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10 h-full relative overflow-hidden hover-lift">
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
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-500 rounded-full blur-xl opacity-20 animate-pulse" />
                <div className="relative flex items-center gap-4 sm:gap-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-full px-6 sm:px-10 py-3 sm:py-4 shadow-2xl">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
                  <div className="flex items-baseline gap-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-400 font-black text-2xl sm:text-4xl">~20</span>
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
                onClick={trackInitiateCheckout} href={WHOP_CHECKOUT_LINK}
                                className="group relative inline-flex items-center justify-center bg-gradient-to-r from-amber-500 via-amber-500 to-amber-500 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-xl font-black text-base sm:text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-amber-500/30"
              >
                <span className="relative flex items-center gap-2 sm:gap-3 whitespace-nowrap">
                  <Video className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="sm:hidden">Start Creating Now</span>
                  <span className="hidden sm:inline">Start Creating My AI Videos</span>
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
              <p className="text-gray-500 text-xs sm:text-sm mt-3">73% off today • 100% refund if not satisfied</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          5. CASE STUDY #2 - DR. MICHAEL - CREAM/WHITE SECTION (Facelift Specialist)
          ================================================================ */}
      <section
        id="case-study-michael"
        data-animate
        className="py-10 sm:py-24 bg-gradient-to-b from-amber-50 to-white"
      >
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className={`text-center mb-6 sm:mb-10 ${visibleSections.has('case-study') ? 'animate-fade-in-up' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full mb-3">
                <Play className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-amber-600 font-bold text-xs uppercase tracking-wide">Facial Rejuvenation Success</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-2 sm:mb-4">
                His First AI Video Generated <span className="text-amber-500">$189,000</span> in Facelift Cases
              </h2>
              <p className="text-gray-600 text-sm sm:text-lg max-w-2xl mx-auto">From struggling with content creation to dominating local social media</p>
            </div>

            {/* Dr. Michael Case Study Card - Light Theme */}
            <div className={`bg-white border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl ${visibleSections.has('case-study') ? 'animate-fade-in-up animation-delay-200' : ''}`}>

              {/* Top: Profile + Before Situation */}
              <div className="p-4 sm:p-8 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                  {/* Profile */}
                  <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:text-center">
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 border-amber-500 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">MC</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        VERIFIED
                      </div>
                    </div>
                    <div className="sm:mt-2">
                      <h3 className="text-gray-900 font-black text-lg">Dr. Michael Chen</h3>
                      <p className="text-amber-600 text-sm font-medium">Facial Plastic Surgeon</p>
                      <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>Los Angeles, CA</span>
                      </div>
                    </div>
                  </div>

                  {/* Before Story */}
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1 rounded-full mb-3">
                      <span className="text-red-600 text-xs font-bold">THE PROBLEM</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      "I was spending <span className="text-gray-900 font-bold">$3,500 every month</span> on a marketing agency.
                      After 8 months, I had <span className="text-gray-900 font-bold">$28,000 spent</span> and
                      <span className="text-red-600 font-bold"> only 4 facelift consultations</span>. Meanwhile, younger surgeons were
                      going viral on TikTok and filling their schedules. I felt invisible..."
                    </p>
                  </div>
                </div>
              </div>

              {/* Video Section */}
              <div className="p-6 sm:p-8 bg-gray-50">
                <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full mb-4">
                  <span className="text-amber-600 text-xs font-bold">HIS FIRST AI VIDEO</span>
                </div>

                <div className="relative rounded-xl overflow-hidden border-2 border-amber-500/40 shadow-2xl">
                  {/* Mobile: 27KB optimized image */}
                  <Image
                    src="/images/plastic-surgeon/case-study-facelift-mobile.webp"
                    alt="Dr. Michael Chen - AI Video Success"
                    width={480}
                    height={270}
                    className="w-full h-auto object-cover sm:hidden"
                    loading="lazy"
                  />
                  {/* Desktop: Full quality image */}
                  <Image
                    src="/images/plastic-surgeon/case-study-facelift.webp"
                    alt="Dr. Michael Chen - AI Video Success"
                    width={1376}
                    height={768}
                    className="w-full h-auto object-cover hidden sm:block"
                    loading="lazy"
                    sizes="(max-width: 1024px) 90vw, 700px"
                  />
                </div>

                <p className="text-gray-500 text-sm mt-3 text-center">
                  Created in <span className="text-amber-600 font-bold">7 minutes</span> • Posted on Instagram Reels • Day 1 of using the system
                </p>
              </div>

              {/* The Speed Stats */}
              <div className="p-6 sm:p-8 bg-white border-t border-gray-100">
                <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full mb-4">
                  <span className="text-amber-600 text-xs font-bold">THE SPEED OF AI CONTENT</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { number: '72', label: 'Hours to First Lead', sub: 'not weeks' },
                    { number: '$0', label: 'Marketing Cost', sub: 'vs $3,500/mo before' },
                    { number: '6', label: 'Facelift Cases', sub: 'from 2 weeks of videos' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-gradient-to-br from-amber-50 to-white border border-amber-500/30 rounded-xl p-4 text-center">
                      <div className="text-amber-500 text-4xl sm:text-5xl font-black mb-1">{stat.number}</div>
                      <div className="text-gray-900 font-bold text-sm">{stat.label}</div>
                      <div className="text-gray-500 text-xs">{stat.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline / Results */}
              <div className="p-4 sm:p-8 border-t border-gray-100 bg-gray-50">
                <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full mb-4 sm:mb-6">
                  <span className="text-amber-600 text-xs font-bold">THE TIMELINE</span>
                </div>

                {/* Timeline - improved mobile layout */}
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { time: 'Day 1', event: 'Posted his first AI video about facelift recovery (took 7 minutes)', icon: Upload, color: 'gray' },
                    { time: 'Day 3', event: 'Instagram DM: "I\'ve been researching facelifts for months. Your video answered all my questions."', icon: MessageSquare, color: 'teal' },
                    { time: 'Day 7', event: '4 facelift consultations scheduled ($18K-$32K each)', icon: Calendar, color: 'teal' },
                    { time: 'Week 2', event: '6 procedures booked • $189,000 in surgical fees', icon: FileText, color: 'teal' },
                    { time: 'Month 2', event: 'OR booked 8 weeks out • Fired marketing agency', icon: DollarSign, color: 'green' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.color === 'green' ? 'bg-green-100 border border-green-300' :
                        item.color === 'teal' ? 'bg-amber-100 border border-amber-500/40' :
                        'bg-gray-100 border border-gray-300'
                      }`}>
                        <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          item.color === 'green' ? 'text-green-600' :
                          item.color === 'teal' ? 'text-amber-600' :
                          'text-gray-500'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`inline-block text-[10px] sm:text-xs font-black px-2 py-0.5 rounded mb-1 ${
                          item.color === 'green' ? 'bg-green-100 text-green-700' :
                          item.color === 'teal' ? 'bg-amber-100 text-amber-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>{item.time}</span>
                        <p className={`text-xs sm:text-sm leading-snug ${item.color === 'green' ? 'text-green-700 font-bold' : 'text-gray-700'}`}>{item.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Quote */}
              <div className="p-6 sm:p-8 bg-gradient-to-r from-amber-500/10 to-amber-50 border-t border-amber-500/20">
                <div className="flex items-start gap-4">
                  <div className="text-amber-500 text-4xl font-serif leading-none">"</div>
                  <div>
                    <p className="text-gray-800 text-lg sm:text-xl font-medium italic leading-relaxed mb-4">
                      Two weeks of AI videos. <span className="text-amber-600 font-bold">$189,000 in facelift procedures</span>.
                      I spent $28,000 on marketing agencies over 8 months and got 4 consultations. This system cost me $47.82 and
                      I booked 6 surgeries in two weeks. My only regret is not starting sooner.
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-500 bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">MC</span>
                      </div>
                      <div>
                        <p className="text-gray-900 font-bold">Dr. Michael Chen</p>
                        <p className="text-gray-500 text-sm">2 months after joining</p>
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
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
                  { value: '$189K', label: 'Revenue', sub: '2 weeks' },
                  { value: '1,932x', label: 'ROI', sub: 'Return' },
                ].map((stat, i) => (
                  <div key={i} className="p-4 sm:p-6 text-center">
                    <div className={`text-xl sm:text-2xl font-black mb-1 ${i === 1 ? 'text-green-600' : i === 2 ? 'text-amber-500' : 'text-gray-900'}`}>{stat.value}</div>
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
          CASE STUDY #3 - DR. LISA PARK - RHINOPLASTY SPECIALIST (Compact)
          ================================================================ */}
      <section
        id="case-study-lisa"
        data-animate
        className="py-10 sm:py-16 bg-black"
      >
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className={`text-center mb-6 sm:mb-8 ${visibleSections.has('case-study-lisa') ? 'animate-fade-in-up' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full mb-3">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400 font-bold text-xs uppercase tracking-wide">Rhinoplasty Success Story</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white mb-2">
                One Video. <span className="text-amber-400">23 Rhinoplasty Consultations.</span>
              </h2>
              <p className="text-gray-400 text-sm sm:text-lg">From skeptic to booked solid in 30 days</p>
            </div>

            {/* Dr. Lisa Case Study Card */}
            <div className={`bg-gradient-to-br from-white/10 to-white/5 border border-amber-500/30 rounded-xl sm:rounded-2xl overflow-hidden ${visibleSections.has('case-study-lisa') ? 'animate-fade-in-up animation-delay-200' : ''}`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Left: Image - Mobile optimized */}
                <div className="relative aspect-video lg:aspect-auto">
                  {/* Mobile: 22KB optimized image */}
                  <Image
                    src="/images/plastic-surgeon/case-study-rhinoplasty-mobile.webp"
                    alt="Dr. Lisa Park - Rhinoplasty Consultation AI Video"
                    fill
                    className="object-cover sm:hidden"
                    loading="lazy"
                  />
                  {/* Desktop: Full quality image */}
                  <Image
                    src="/images/plastic-surgeon/case-study-rhinoplasty.webp"
                    alt="Dr. Lisa Park - Rhinoplasty Consultation AI Video"
                    fill
                    className="object-cover hidden sm:block"
                    loading="lazy"
                    sizes="(max-width: 1024px) 50vw, 500px"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <span className="text-amber-400 text-xs font-bold">89K Views on TikTok</span>
                  </div>
                </div>

                {/* Right: Content */}
                <div className="p-5 sm:p-8 flex flex-col justify-center">
                  {/* Profile */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500 bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">LP</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Dr. Lisa Park</h3>
                      <p className="text-amber-400 text-sm">Rhinoplasty Specialist • Seattle, WA</p>
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4 italic">
                    "My TikTok video explaining what to expect during rhinoplasty recovery got 89K views.
                    I booked <span className="text-amber-400 font-bold">23 new consultations</span> that month.
                    This system pays for itself daily."
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { value: '89K', label: 'Views' },
                      { value: '23', label: 'Consults' },
                      { value: '$276K', label: 'Revenue' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-black/40 rounded-lg p-3 text-center border border-white/10">
                        <div className={`text-lg sm:text-xl font-black ${i === 2 ? 'text-green-400' : 'text-amber-400'}`}>{stat.value}</div>
                        <div className="text-gray-500 text-xs">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-gray-500 text-xs ml-2">Verified Member</span>
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
        className="py-8 sm:py-16 bg-gradient-to-b from-black to-zinc-900"
      >
        {/* Header */}
        <div className="max-w-6xl mx-auto px-3 sm:px-6 mb-6 sm:mb-10">
          <div className={`text-center ${visibleSections.has('testimonials') ? 'animate-fade-in-down' : ''}`}>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full mb-3 hover-scale sparkle">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wide">Success Stories</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-4">
              Real Plastic Surgeons. <span className="text-amber-400">Real Results.</span>
            </h2>
            <div className="flex items-center justify-center gap-3 sm:gap-6 text-gray-400 text-xs sm:text-base">
              <span><span className="text-amber-400 font-bold">500+</span> success stories</span>
              <span>•</span>
              <span><span className="text-amber-400 font-bold">20+</span> countries</span>
            </div>
            {/* Testimonial Disclosure - FTC Compliance */}
            <p className="text-gray-600 text-[10px] sm:text-xs mt-3 max-w-2xl mx-auto">
              *Testimonials reflect individual experiences and are not guaranteed results. Individual results vary based on effort, market conditions, and other factors. See our <a href="/disclaimer" className="text-amber-500 hover:text-amber-400 underline">full disclaimer</a>.
            </p>
          </div>
        </div>

        {/* Infinite Scroll Carousel with fade shadows */}
        <div className="testimonial-carousel-wrapper-plastic-surgeon">
          <div className="testimonial-scroll-track-plastic-surgeon">
            {/* First set of testimonials */}
            {testimonials.map((t) => (
              <div key={`first-${t.id}`} className="testimonial-card-plastic-surgeon">
                {/* Quote Icon */}
                <div className="testimonial-quote-icon-plastic-surgeon">
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
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-amber-500/40 shadow-lg">
                    <Image src={t.image} alt={t.name} fill className="object-cover" loading="lazy" sizes="64px" />
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
              <div key={`second-${t.id}`} className="testimonial-card-plastic-surgeon">
                {/* Quote Icon */}
                <div className="testimonial-quote-icon-plastic-surgeon">
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
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-amber-500/40 shadow-lg">
                    <Image src={t.image} alt={t.name} fill className="object-cover" loading="lazy" sizes="64px" />
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
          WHO THIS IS FOR / NOT FOR - QUALIFICATION SECTION
          ================================================================ */}
      <section
        id="who-is-this-for"
        data-animate
        className="py-10 sm:py-16 bg-gradient-to-b from-zinc-900 to-black"
      >
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className={`text-center mb-8 sm:mb-12 ${visibleSections.has('who-is-this-for') ? 'animate-blur-in' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full mb-3 hover-scale">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400 font-bold text-xs uppercase tracking-wide">Is This Right For You?</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white mb-2">
                This System Is <span className="text-amber-400">NOT</span> For Everyone
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">Be honest with yourself before you invest</p>
            </div>

            {/* Two Columns */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 ${visibleSections.has('who-is-this-for') ? '' : ''}`}>
              {/* This IS For You */}
              <div className={`bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-xl sm:rounded-2xl p-5 sm:p-8 card-hover ${visibleSections.has('who-is-this-for') ? 'animate-fade-in-left animation-delay-200' : ''}`}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-emerald-400">This IS For You If...</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "You want more high-value cosmetic patients",
                    "You're willing to spend 7 minutes creating content",
                    "You understand social media drives consultations",
                    "You're ready to stand out from competitors",
                    "You want to stop paying agencies $3,000+/month",
                    "You believe in taking action, not just learning",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* This is NOT For You */}
              <div className={`bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/30 rounded-xl sm:rounded-2xl p-5 sm:p-8 card-hover ${visibleSections.has('who-is-this-for') ? 'animate-fade-in-right animation-delay-400' : ''}`}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-red-400">This is NOT For You If...</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "You expect results without creating any content",
                    "You think AI is \"beneath\" your practice",
                    "You're not willing to post on social media",
                    "You want someone else to do everything for you",
                    "You're looking for a magic pill with zero effort",
                    "You'll buy this and let it collect digital dust",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Note */}
            <div className={`text-center mt-6 sm:mt-8 ${visibleSections.has('who-is-this-for') ? 'animate-fade-in-up animation-delay-300' : ''}`}>
              <p className="text-gray-400 text-sm sm:text-base">
                If you checked more boxes on the <span className="text-emerald-400 font-bold">left side</span>, you're exactly who we built this for.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          6. GUARANTEE #1 - WHITE SECTION - FILL YOUR CALENDAR
          ================================================================ */}
      <section
        id="guarantee1"
        data-animate
        className="py-10 sm:py-20 bg-white"
      >
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className={`bg-gradient-to-br from-amber-500/10 to-white border-2 border-amber-500/40 rounded-xl sm:rounded-2xl p-5 sm:p-10 relative overflow-hidden ${
              visibleSections.has('guarantee1') ? 'animate-fade-in-up' : ''
            }`}>
              {/* Animated background pulse */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-amber-500/10 to-amber-500/5 animate-pulse" />

              <div className="relative z-10">
                <div className="text-center mb-5 sm:mb-8">
                  <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/40 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4 animate-bounce">
                    <CalendarCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    <span className="text-green-600 font-bold text-xs sm:text-sm uppercase">Calendar Guarantee</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-2">
                    Fill Your Calendar or <span className="text-amber-500">100% Refund</span>
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
                      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-green-500 via-amber-500 to-green-500 shadow-2xl shadow-green-500/30 flex flex-col items-center justify-center">
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
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-amber-500/20 shadow-lg">
                      <p className="text-gray-800 text-sm sm:text-lg leading-relaxed font-medium">
                        If you don't fill your next month's calendar with new patients using this system,
                        I'll refund <span className="text-amber-500 font-black">every single penny</span> — no questions asked.
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
                    { icon: CalendarCheck, title: 'More Patients', desc: 'Or your money back' },
                    { icon: Shield, title: '30-Day Trial', desc: 'Full refund anytime' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-xl p-3 sm:p-4 text-center border border-amber-500/20 shadow-lg hover:shadow-xl transition-shadow hover:scale-[1.02] transform duration-200">
                      <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 mx-auto mb-1.5 sm:mb-2" />
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
          COMPARISON TABLE - Why CloneYourself Wins
          ================================================================ */}
      <section
        id="comparison"
        data-animate
        className="py-10 sm:py-16 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className={`text-center mb-8 sm:mb-10 ${visibleSections.has('comparison') ? 'animate-fade-in-up' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full mb-3">
                <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-amber-600 font-bold text-xs uppercase tracking-wide">Compare Your Options</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-2">
                Why <span className="text-amber-500">CloneYourself</span> Beats Everything Else
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">See the difference for yourself</p>
            </div>

            {/* Comparison Table */}
            <div className={`overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0 ${visibleSections.has('comparison') ? 'animate-fade-in-up animation-delay-200' : ''}`}>
              <table className="w-full min-w-[600px] bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden shadow-xl">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-4 sm:px-6 text-gray-500 text-sm font-semibold">Feature</th>
                    <th className="text-center py-4 px-3 sm:px-4 border-x border-gray-200">
                      <div className="text-red-500 font-bold text-sm">Marketing Agency</div>
                      <div className="text-gray-400 text-xs">$3,000+/mo</div>
                    </th>
                    <th className="text-center py-4 px-3 sm:px-4 border-r border-gray-200">
                      <div className="text-gray-500 font-bold text-sm">DIY Video Editing</div>
                      <div className="text-gray-400 text-xs">100+ hours</div>
                    </th>
                    <th className="text-center py-4 px-3 sm:px-4 bg-amber-50">
                      <div className="text-amber-600 font-bold text-sm">CloneYourself</div>
                      <div className="text-amber-400 text-xs">$47.82 one-time</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { feature: 'Time to create 1 video', agency: '1-2 weeks', diy: '4-8 hours', us: '7 minutes', winner: true },
                    { feature: 'Monthly cost', agency: '$3,000+', diy: '$0 (your time)', us: '$0', winner: true },
                    { feature: 'Upfront investment', agency: '$3,000+', diy: '$500+ software', us: '$47.82', winner: true },
                    { feature: 'Videos per month', agency: '4-8', diy: '2-4', us: 'Unlimited', winner: true },
                    { feature: 'Need to be on camera', agency: 'Yes', diy: 'Yes', us: 'No', winner: true },
                    { feature: 'Learning curve', agency: 'None', diy: 'Steep', us: 'None', winner: true },
                    { feature: 'Control over content', agency: 'Low', diy: 'High', us: 'High', winner: true },
                    { feature: 'Available 24/7', agency: 'No', diy: 'Yes', us: 'Yes', winner: true },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                      <td className="py-3 px-4 sm:px-6 text-gray-700 text-sm font-medium">{row.feature}</td>
                      <td className="py-3 px-3 sm:px-4 text-center border-x border-gray-100">
                        <span className="text-red-500 text-sm">{row.agency}</span>
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-center border-r border-gray-100">
                        <span className="text-gray-500 text-sm">{row.diy}</span>
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-center bg-amber-50/50">
                        <span className="text-amber-600 font-bold text-sm flex items-center justify-center gap-1">
                          {row.us}
                          {row.winner && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom CTA */}
            <div className={`text-center mt-8 ${visibleSections.has('comparison') ? 'animate-fade-in-up animation-delay-300' : ''}`}>
              <a
                href={WHOP_CHECKOUT_LINK}
                onClick={trackInitiateCheckout}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-lg shadow-amber-500/25"
              >
                <Zap className="w-5 h-5" />
                Get CloneYourself Now
                <ArrowRight className="w-5 h-5" />
              </a>
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
            <div className={`text-center mb-6 sm:mb-10 ${visibleSections.has('pricing') ? 'animate-zoom-in' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-full mb-3 sm:mb-4 hover-scale animate-pulse-soft">
                <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
                <span className="text-red-400 font-bold text-xs sm:text-sm">Bonus expires in {timeLeft.days}d {timeLeft.hours}h</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-4">
                Get Everything Today For
              </h2>
            </div>

            {/* Price Comparison - horizontal scroll on mobile */}
            <div className={`overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 sm:overflow-visible mb-6 sm:mb-10 ${visibleSections.has('pricing') ? '' : ''}`}>
              <div className={`flex gap-3 sm:grid sm:grid-cols-3 sm:gap-4 stagger-fast ${visibleSections.has('pricing') ? 'visible' : ''}`} style={{ minWidth: 'max-content' }}>
                {/* Old Way */}
                <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-red-500/30 relative flex-shrink-0 w-[200px] sm:w-auto hover-lift">
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
                <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-gray-600 relative flex-shrink-0 w-[200px] sm:w-auto hover-lift">
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
                <div className="bg-gradient-to-br from-amber-500 to-amber-500 rounded-xl p-4 sm:p-6 border-2 border-white/20 relative shadow-xl sm:scale-105 flex-shrink-0 w-[200px] sm:w-auto hover-lift hover-glow">
                  <div className="absolute -top-2 sm:-top-3 right-3 sm:right-4 bg-black text-amber-400 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-black">
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
            <div className={`bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-5 sm:p-8 border border-amber-500/30 mb-6 card-hover ${
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
                  <span className="text-amber-400 font-black text-lg sm:text-xl">YOUR INVESTMENT:</span>
                  <span className="text-amber-400 font-black text-2xl sm:text-3xl">$47.82</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-400 font-bold text-sm sm:text-base">YOUR SAVINGS:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 font-black text-lg sm:text-xl">${(497 + totalBonusValue + 494 - 98).toLocaleString()}</span>
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">98% OFF</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Price Box - Compact on mobile */}
            <div className={`bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-5 sm:p-10 text-center border-2 border-amber-500/50 shadow-2xl hover-glow ${
              visibleSections.has('pricing') ? 'animate-bounce-in animation-delay-400' : ''
            }`}>
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                <span className="text-4xl sm:text-6xl font-black text-amber-400">$47.82</span>
                <div className="text-left">
                  <span className="bg-red-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm font-black">98% OFF</span>
                  <p className="text-gray-400 text-[10px] sm:text-sm mt-0.5">One-time</p>
                </div>
              </div>
              <p className="text-amber-400 font-bold text-xs sm:text-base mb-4 sm:mb-6">Lifetime access • No monthly fees</p>

              <Link
                onClick={trackInitiateCheckout} href={WHOP_CHECKOUT_LINK}
                                className="w-full max-w-md mx-auto bg-gradient-to-r from-amber-500 via-amber-500 to-amber-500 text-white py-3.5 sm:py-5 rounded-xl font-black text-base sm:text-xl shadow-xl flex items-center justify-center gap-2 btn-press hover-glow animate-pulse-glow transition-transform"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                Get Instant Access Now
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4 sm:mt-6 text-gray-400 text-[10px] sm:text-sm">
                <div className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-400" />
                  <span>30-Day Guarantee</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-400" />
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
            <div className={`text-center mb-6 sm:mb-10 ${visibleSections.has('faq') ? 'animate-fade-in-down' : ''}`}>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-2 sm:mb-4">
                Common <span className="text-amber-500">Questions</span>
              </h2>
            </div>

            <div className={`space-y-2 sm:space-y-3 stagger-children ${visibleSections.has('faq') ? 'visible' : ''}`}>
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-3.5 sm:p-5 text-left hover:bg-amber-50/50 transition-colors"
                  >
                    <span className="font-semibold pr-3 text-gray-900 text-sm sm:text-base">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0 transition-transform ${expandedFaq === i ? 'rotate-180' : ''}`} />
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
            <div className={`mt-8 sm:mt-12 text-center ${visibleSections.has('faq') ? 'animate-bounce-in animation-delay-500' : ''}`}>
              <p className="text-gray-600 text-sm mb-4">Still have questions? The best answer is trying it risk-free.</p>
              <a
                onClick={trackInitiateCheckout} href={WHOP_CHECKOUT_LINK}
                                className="group relative inline-flex items-center justify-center bg-gradient-to-r from-amber-500 via-amber-500 to-amber-500 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-xl font-black text-base sm:text-xl btn-press hover-glow animate-pulse-glow transition-all shadow-2xl shadow-amber-500/30"
              >
                <span className="relative flex items-center gap-2 sm:gap-3 whitespace-nowrap">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="sm:hidden">Try It Risk-Free</span>
                  <span className="hidden sm:inline">Try It Risk-Free for 30 Days</span>
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
              <p className="text-gray-500 text-xs mt-3">Full refund + $50 if it doesn't work</p>
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
          <div className="absolute top-10 left-10 w-2 h-2 bg-amber-500/30 rounded-full animate-ping" />
          <div className="absolute top-1/3 right-20 w-3 h-3 bg-amber-500/20 rounded-full animate-pulse" />
          <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-amber-400/30 rounded-full animate-bounce" />
          <div className="absolute top-1/2 right-10 w-2 h-2 bg-green-500/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        </div>

        <div className="w-full px-3 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className={`bg-gradient-to-br from-white/10 to-white/5 border-2 border-amber-500/40 rounded-xl sm:rounded-2xl p-5 sm:p-10 backdrop-blur-sm ${
              visibleSections.has('guarantee2') ? 'animate-fade-in-up' : ''
            }`}>
              <div className="text-center mb-6 sm:mb-10">
                <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4">
                  <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-bounce" />
                  <span className="text-amber-400 font-bold text-xs sm:text-sm uppercase">No Hassle Policy</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white mb-2 sm:mb-4">
                  Need a Refund? <span className="text-amber-400">It's THIS Easy</span>
                </h2>
                <p className="text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto">
                  We made the refund process so simple, you can do it in 30 seconds.
                  No phone calls. No guilt trips. No waiting.
                </p>
              </div>

              {/* Creative Animated Steps - Timeline Style */}
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-amber-500 to-green-500 -translate-x-1/2 hidden md:block" />

                {/* Mobile: Simple stacked layout | Desktop: Zigzag with line */}
                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className={`relative flex flex-col md:flex-row items-center gap-3 md:gap-4 ${visibleSections.has('guarantee2') ? 'animate-fade-in-up' : ''}`}>
                    {/* Icon - shown first on mobile */}
                    <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-amber-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/40 md:order-2">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                      <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                        <span className="text-amber-600 font-black text-xs sm:text-sm">1</span>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="w-full md:flex-1 md:text-right md:order-1">
                      <div className="bg-gradient-to-r from-amber-500/20 to-transparent rounded-xl p-4 border border-amber-500/30">
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
                    <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-amber-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/40 md:order-2">
                      <Send className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                      <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                        <span className="text-amber-600 font-black text-xs sm:text-sm">2</span>
                      </div>
                    </div>
                    {/* Desktop spacer */}
                    <div className="hidden md:block md:flex-1 md:order-1" />
                    {/* Content */}
                    <div className="w-full md:flex-1 md:order-3">
                      <div className="bg-gradient-to-l from-amber-500/20 to-transparent rounded-xl p-4 border border-amber-500/30">
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
                <div className="inline-block bg-gradient-to-r from-amber-500/20 via-amber-500/20 to-green-500/20 rounded-xl p-4 sm:p-6 border border-white/10">
                  <p className="text-white font-bold text-sm sm:text-lg mb-2">
                    That's it. <span className="text-amber-400">3 simple steps.</span>
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
          10. MEET YOUR EXPERT - WHITE SECTION (Dr. Sofia Martinez)
          ================================================================ */}
      <section
        id="meet-instructor"
        data-animate
        className="py-10 sm:py-20 bg-white"
      >
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className={`text-center mb-6 sm:mb-10 ${visibleSections.has('meet-instructor') ? 'animate-fade-in-up' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full mb-3">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-amber-600 font-bold text-xs uppercase tracking-wide">Meet Your Expert</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-2 sm:mb-4">
                The Clinical Mind <span className="text-amber-500">Behind This System</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-lg max-w-2xl mx-auto">
                Learn from an internationally trained specialist who understands both clinical excellence and modern patient acquisition.
              </p>
            </div>

            <div className={`${visibleSections.has('meet-instructor') ? 'animate-fade-in-up animation-delay-200' : ''}`}>
              <ExpertPersona {...DR_SOFIA_DATA} />
            </div>


            {/* SEO-friendly expert description */}
            <p className="sr-only">
              Dr. Sofia Martinez is a board-certified plastic surgeon (MD, FACS) with over 15 years of experience in facial rejuvenation, rhinoplasty, breast augmentation, body contouring, and aesthetic procedures. She has helped plastic surgeons across 20+ countries attract high-value cosmetic patients using AI video marketing.
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
                  desc: 'Unlike software companies that need recurring revenue, my success comes from helping plastic surgeons succeed. When you win, I win. So I price based on value delivered, not what I can get away with.',
                },
                {
                  num: '3',
                  title: 'High Volume = Better For Both Of Us',
                  desc: `At $47.82, I can reach ${memberStats.totalMembers.toLocaleString()}+ plastic surgeons. Even if only 10% create videos and 5% get results, that's hundreds of plastic surgeons getting new patients. That's hundreds of success stories. That's worth more to me than charging $497 to 50 plastic surgeons.`,
                },
                {
                  num: '4',
                  title: 'I\'m Betting On You',
                  desc: 'The $50 guarantee isn\'t a loss leader. It\'s me saying: "I\'m confident this works. I\'ll literally pay you $50 if it doesn\'t." That confidence only works if the price is low enough that you\'ll actually TRY it.',
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 bg-white/5 border border-amber-500/20 rounded-xl p-4 sm:p-5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-400 font-black text-sm sm:text-base">{item.num}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`mt-6 text-center ${visibleSections.has('reasons-why') ? 'animate-fade-in-up animation-delay-400' : ''}`}>
              <p className="text-amber-400 font-bold text-sm sm:text-base">
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
            <div className={`bg-gradient-to-br from-amber-500/5 via-white to-amber-500/5 border-2 border-amber-500/30 rounded-xl sm:rounded-2xl p-5 sm:p-10 relative overflow-hidden ${
              visibleSections.has('guarantee3') ? 'animate-fade-in-up' : ''
            }`}>
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10">
                <div className="text-center mb-5 sm:mb-8">
                  <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 animate-pulse" />
                    <span className="text-amber-600 font-bold text-xs sm:text-sm uppercase">Zero Risk Promise</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-2">
                    Don't Love It? <span className="text-amber-500">Full Refund.</span>
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
                        <div className="absolute inset-0 rounded-full border-4 border-dashed border-amber-500/40 animate-spin-slow" />
                        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-amber-500 via-amber-500 to-amber-500 shadow-2xl shadow-amber-500/30 flex flex-col items-center justify-center">
                          <div className="absolute inset-2 rounded-full bg-white flex flex-col items-center justify-center text-center p-2">
                            <Heart className="w-5 h-5 sm:w-7 sm:h-7 text-amber-500 mb-1" />
                            <span className="text-amber-600 font-black text-xs sm:text-sm leading-none">NO</span>
                            <span className="text-gray-800 font-bold text-[7px] sm:text-[9px] uppercase tracking-wider">Questions</span>
                            <span className="text-gray-800 font-bold text-[7px] sm:text-[9px] uppercase tracking-wider">Asked</span>
                          </div>
                        </div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-500 text-white font-bold text-[7px] sm:text-[9px] px-2.5 py-0.5 rounded-full shadow-lg whitespace-nowrap">
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
                      We only want happy customers. <span className="text-amber-500">Period.</span>
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
                  <p>→ You watch TikTok plastic surgeons book patients</p>
                  <p>→ Keep spending $2,000/month on ads that barely convert</p>
                  <p>→ Your team sits around bored</p>
                  <p>→ Next year? Same problem. Still struggling.</p>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-red-600 font-bold text-xs">Cost: $24K/year in marketing + lost revenue</p>
                </div>
              </div>

              {/* Option 2 - Future */}
              <div className="bg-amber-50 rounded-xl p-4 sm:p-5 text-left border-2 border-amber-500">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-amber-600" />
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
                <div className="mt-3 pt-3 border-t border-amber-200">
                  <p className="text-amber-700 font-bold text-xs">Cost: $47.82 one-time. Worst case: refund + $50</p>
                </div>
              </div>
            </div>

            {/* The Math Section */}
            <div className="bg-gray-100 rounded-xl p-4 sm:p-5 mb-4 sm:mb-6 text-left border border-gray-200">
              <h3 className="font-black text-gray-900 text-center text-base sm:text-lg mb-3">The Math Is Simple:</h3>
              <div className="space-y-2 text-gray-600 text-sm">
                <p>• If Option 2 gets you <span className="font-bold text-gray-900">just 1 new patient</span> in month 1... that's <span className="text-amber-600 font-bold">$2,000-5,000</span> from a $47.82 investment.</p>
                <p>• If you get <span className="font-bold text-gray-900">5 new patients</span> (average result)... that's <span className="text-amber-600 font-bold">$10,000-25,000</span> from $47.82.</p>
                <p>• Even if you try it for 30 days and ask for a refund... <span className="text-amber-600 font-bold">you're up $50</span> and lost nothing.</p>
              </div>
              <p className="text-center text-gray-900 font-bold text-sm sm:text-base mt-4">There is no losing move here. Only moving forward or staying stuck.</p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-2xl mb-3 sm:mb-6">
              {/* Price with Savings */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <span className="text-3xl sm:text-5xl font-black text-amber-400">$47.82</span>
                <div className="text-left">
                  <span className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-black block">SAVE ${totalBonusValue.toLocaleString()}</span>
                  <p className="text-gray-500 text-xs mt-0.5">One-time</p>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                onClick={trackInitiateCheckout} href={WHOP_CHECKOUT_LINK}
                                className="group relative w-full bg-gradient-to-r from-amber-400 via-amber-400 to-amber-400 text-black py-4 sm:py-5 rounded-xl font-black text-lg sm:text-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer overflow-hidden"
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
                <span>30-Day Money Back + $50 Cash Guarantee</span>
              </div>
            </div>

            {/* Final Reassurance */}
            <p className="text-black/60 text-xs sm:text-sm">
              Join {memberStats.totalMembers.toLocaleString()}+ plastic surgeons • Instant access • No risk
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
            <div className={`bg-gradient-to-br from-white/5 to-white/[0.02] border border-amber-500/20 rounded-xl sm:rounded-2xl p-5 sm:p-8 ${visibleSections.has('still-thinking') ? 'animate-fade-in-up' : ''}`}>
              <h2 className="text-xl sm:text-2xl font-black text-white text-center mb-4 sm:mb-6">
                Still Thinking About It?
              </h2>

              <div className="text-gray-400 text-sm sm:text-base leading-relaxed space-y-3 mb-6">
                <p>Here's what usually happens:</p>
                <p>You leave this page. You think about it tonight. You wake up tomorrow thinking <span className="text-white">"Yeah, I should try that."</span></p>
                <p>But you get busy. Patients to see. Staff drama. Insurance calls.</p>
                <p>Two weeks later you forgot about this completely.</p>
                <p>Three months later you're frustrated your schedule is slow again.</p>
                <p className="text-amber-400 font-bold">You regret not trying it when you saw it.</p>
              </div>

              <div className="bg-black/30 rounded-xl p-4 sm:p-5 mb-6">
                <p className="text-white font-bold text-center text-sm sm:text-base mb-3">Don't be that person.</p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-amber-400 font-black text-lg sm:text-xl">$47.82</p>
                    <p className="text-gray-500 text-xs">Cost</p>
                  </div>
                  <div>
                    <p className="text-amber-400 font-black text-lg sm:text-xl">$0</p>
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
                onClick={trackInitiateCheckout} href={WHOP_CHECKOUT_LINK}
                                className="w-full bg-gradient-to-r from-amber-500 to-amber-500 text-white py-4 rounded-xl font-black text-base sm:text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
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
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>500+ Plastic Surgeons</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Instant Access</span>
              </div>
            </div>
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
            </div>
            {/* FTC Earnings & Medical Professional Disclaimer */}
            <div className="max-w-3xl mx-auto text-[9px] sm:text-[10px] text-gray-600 leading-relaxed space-y-2">
              <p>
                <strong>EARNINGS DISCLAIMER:</strong> Results shown are not typical. Income and results vary based on effort, experience, and market conditions. We make no guarantees regarding income or results.
              </p>
              <p>
                <strong>MEDICAL PROFESSIONAL NOTICE:</strong> This product is for educational purposes only. Medical professionals must ensure compliance with their state medical board regulations, HIPAA requirements, and medical advertising guidelines. Velon LLC does not provide legal or medical compliance advice.
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
            onClick={trackInitiateCheckout} href={WHOP_CHECKOUT_LINK}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-500 text-white py-4 rounded-xl font-black text-base flex items-center justify-center gap-2 shadow-2xl shadow-amber-500/30 active:scale-[0.98] transition-transform"
          >
            <span>Get Access</span>
            <span className="text-amber-200 font-bold">$47.82</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Animation Styles - Modern, smooth, GPU-accelerated */}
      <style jsx global>{`
        /* Override global text-gradient-premium for plastic surgeon (gold theme) */
        .text-gradient-premium {
          background: linear-gradient(135deg, #f4d03f 0%, #d4af37 50%, #b8860b 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
        }

        .text-shadow-glow {
          text-shadow: 0 0 30px rgba(212, 175, 55, 0.5) !important;
        }

        /* Override btn-premium for gold theme */
        .btn-premium {
          background: linear-gradient(135deg, #d4af37 0%, #c9a227 100%) !important;
        }

        .btn-premium:hover {
          box-shadow:
            0 8px 25px rgba(212, 175, 55, 0.4),
            0 4px 10px rgba(0, 0, 0, 0.1) !important;
        }

        /* Override glass-teal for gold theme */
        .glass-teal {
          background: rgba(212, 175, 55, 0.08) !important;
          border: 1px solid rgba(168, 85, 247, 0.2) !important;
        }

        /* Override shadow-glow-teal for gold theme */
        .shadow-glow-teal {
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.3), 0 0 40px rgba(212, 175, 55, 0.1) !important;
        }

        /* Plastic Surgeon background gradient */
        .bg-animated-gradient-plastic-surgeon {
          background: linear-gradient(135deg, #000000 0%, #0f172a 50%, #000000 100%);
        }

        .bg-particles-plastic-surgeon {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          opacity: 0.3;
          background-image: radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.15) 1px, transparent 0);
          background-size: 50px 50px;
        }

        /* Testimonial carousel styles for dentist - MOBILE OPTIMIZED */
        .testimonial-carousel-wrapper-plastic-surgeon {
          position: relative;
          overflow: hidden;
          width: 100%;
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }

        .testimonial-scroll-track-plastic-surgeon {
          display: flex;
          gap: 0.75rem;
          animation: scroll-plastic-surgeon 35s linear infinite;
          width: fit-content;
          padding: 0.5rem 0;
        }

        .testimonial-card-plastic-surgeon {
          flex-shrink: 0;
          width: 280px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 1rem;
          padding: 1.25rem;
          position: relative;
        }

        .testimonial-quote-icon-plastic-surgeon {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          width: 20px;
          height: 20px;
          opacity: 0.3;
          overflow: hidden;
        }

        .testimonial-quote-icon-plastic-surgeon svg {
          width: 100%;
          height: 100%;
          max-width: 20px;
          max-height: 20px;
        }

        @keyframes scroll-plastic-surgeon {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Mobile-specific testimonial adjustments */
        @media (max-width: 640px) {
          .testimonial-card-plastic-surgeon {
            width: 260px;
            padding: 1rem;
          }
          .testimonial-scroll-track-plastic-surgeon {
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

        /* Respect user motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up,
          .animate-scale-up,
          .animate-scale-in,
          .testimonial-scroll-track-plastic-surgeon {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }

        /* ================================================================
           MOBILE PERFORMANCE OPTIMIZATIONS
           Fixes: scroll jank, blank screens, slow performance
           ================================================================ */

        /* GPU acceleration for carousel - CRITICAL */
        .testimonial-scroll-track-plastic-surgeon {
          will-change: transform;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        /* Contain sections to isolate paint areas */
        section {
          contain: layout style;
        }

        /* Mobile-specific performance fixes */
        @media (max-width: 768px) {
          /* CRITICAL: Disable backdrop-blur on mobile - causes major jank */
          .backdrop-blur-sm,
          .backdrop-blur,
          .backdrop-blur-md,
          .backdrop-blur-lg,
          [class*="backdrop-blur"] {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }

          /* Replace blurred backgrounds with solid ones on mobile */
          .bg-white\\/10,
          .bg-white\\/5,
          .bg-black\\/80 {
            background-color: rgba(0, 0, 0, 0.95) !important;
          }

          /* Reduce animation complexity on mobile */
          .animate-fade-in-up {
            animation-duration: 0.4s !important;
          }

          .animate-scale-up,
          .animate-scale-in {
            animation-duration: 0.3s !important;
          }

          /* Disable will-change on mobile to save memory */
          .animate-fade-in-up,
          .animate-scale-up,
          .animate-scale-in {
            will-change: auto !important;
          }

          /* Slow down carousel on mobile for smoother performance */
          .testimonial-scroll-track-plastic-surgeon {
            animation-duration: 45s !important;
          }

          /* Disable complex shadows on mobile */
          .shadow-2xl {
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
          }

          .shadow-xl {
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15) !important;
          }

          /* Simplify gradients on mobile */
          .bg-gradient-to-br,
          .bg-gradient-to-r,
          .bg-gradient-to-b {
            background-attachment: scroll !important;
          }

          /* Disable hover transitions on mobile (saves CPU) */
          .transition-all,
          .transition-colors,
          .transition-transform,
          .transition-opacity {
            transition-duration: 0.15s !important;
          }

          /* Hide decorative animated elements on mobile */
          .animate-pulse:not(button):not(a),
          .animate-bounce:not(button):not(a),
          .animate-spin-slow {
            animation: none !important;
          }

          /* Optimize font rendering */
          * {
            text-rendering: optimizeSpeed;
            -webkit-font-smoothing: antialiased;
          }

          /* Contain paint for cards */
          .testimonial-card-plastic-surgeon {
            contain: layout style paint;
          }

          /* Optimize images for mobile rendering */
          img {
            content-visibility: auto;
          }

          /* Hardware acceleration for sticky elements */
          .sticky, .fixed {
            transform: translateZ(0);
            -webkit-transform: translateZ(0);
          }
        }

        /* Very small screens - further optimizations */
        @media (max-width: 480px) {
          /* Even simpler animations */
          .animate-fade-in-up,
          .animate-scale-up,
          .animate-scale-in {
            animation-duration: 0.25s !important;
            transform: none !important;
          }

          /* Pause carousel when not visible */
          .testimonial-scroll-track-plastic-surgeon {
            animation-play-state: paused;
          }

          .testimonial-carousel-wrapper-plastic-surgeon:hover .testimonial-scroll-track-plastic-surgeon,
          .testimonial-carousel-wrapper-plastic-surgeon:focus-within .testimonial-scroll-track-plastic-surgeon {
            animation-play-state: running;
          }

          /* Reduce border radius calculations */
          .rounded-2xl, .rounded-3xl {
            border-radius: 1rem !important;
          }
        }

        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          /* Disable hover effects on touch devices */
          .hover\\:scale-105:hover,
          .hover\\:scale-\\[1\\.02\\]:hover {
            transform: none !important;
          }

          /* Faster touch response */
          button, a, [role="button"] {
            touch-action: manipulation;
          }

          /* Optimize scroll on touch */
          .overflow-x-auto,
          .overflow-y-auto {
            -webkit-overflow-scrolling: touch;
            scroll-behavior: auto !important;
          }
        }

        /* Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

        /* Force GPU layers only when needed */
        .force-gpu {
          transform: translateZ(0);
          will-change: transform;
        }
      `}</style>

      {/* ================================================================
          STICKY MOBILE CTA - Shows after scrolling
          ================================================================ */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 sm:hidden transition-all duration-300 ${
        showStickyCTA ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}>
        <div className="bg-gradient-to-t from-black via-black/95 to-transparent pt-4 pb-4 px-4">
          <a
            href={WHOP_CHECKOUT_LINK}
            onClick={trackInitiateCheckout}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-amber-500 to-amber-500 text-white py-4 rounded-xl font-black text-base shadow-2xl shadow-amber-500/30 animate-pulse"
          >
            <Zap className="w-5 h-5" />
            Get Instant Access — $47.82
            <ArrowRight className="w-5 h-5" />
          </a>
          <div className="flex items-center justify-center gap-3 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              30-Day Guarantee
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              {liveViewers} viewing now
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
