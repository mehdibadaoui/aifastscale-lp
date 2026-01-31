'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  Search, X, Globe, Check, ArrowRight, Sparkles, Users, MapPin, Zap,
  Play, Volume2, MessageSquare, ChevronRight, Star, TrendingUp
} from 'lucide-react'

// ============================================
// LANGUAGES DATA WITH REGIONS
// ============================================

type Region = 'popular' | 'europe' | 'asia' | 'africa' | 'americas' | 'middleeast'

interface Language {
  code: string
  name: string
  flag: string
  speakers: string
  speakerCount: number // For visual bars
  region: Region[]
  aliases: string[]
}

const LANGUAGES: Language[] = [
  // Most Popular (Tier 1)
  { code: 'en', name: 'English', flag: '🇺🇸', speakers: '1.5B', speakerCount: 1500, region: ['popular', 'europe', 'americas'], aliases: ['usa', 'america', 'united states', 'uk', 'united kingdom', 'britain', 'england', 'australia', 'canada'] },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', speakers: '560M', speakerCount: 560, region: ['popular', 'europe', 'americas'], aliases: ['spain', 'mexico', 'argentina', 'colombia', 'peru', 'latino', 'latin america'] },
  { code: 'zh', name: 'Mandarin Chinese', flag: '🇨🇳', speakers: '1.1B', speakerCount: 1100, region: ['popular', 'asia'], aliases: ['china', 'taiwan', 'singapore', 'chinese'] },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', speakers: '610M', speakerCount: 610, region: ['popular', 'asia'], aliases: ['india', 'indian', 'delhi', 'mumbai', 'bollywood'] },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', speakers: '420M', speakerCount: 420, region: ['popular', 'middleeast', 'africa'], aliases: ['saudi arabia', 'egypt', 'morocco', 'uae', 'dubai', 'middle east'] },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷', speakers: '265M', speakerCount: 265, region: ['popular', 'europe', 'americas', 'africa'], aliases: ['brazil', 'portugal', 'angola', 'mozambique'] },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩', speakers: '265M', speakerCount: 265, region: ['popular', 'asia'], aliases: ['bangladesh', 'india', 'dhaka', 'kolkata'] },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', speakers: '255M', speakerCount: 255, region: ['popular', 'europe', 'asia'], aliases: ['russia', 'belarus', 'kazakhstan'] },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', speakers: '125M', speakerCount: 125, region: ['popular', 'asia'], aliases: ['japan', 'tokyo', 'osaka'] },
  { code: 'fr', name: 'French', flag: '🇫🇷', speakers: '280M', speakerCount: 280, region: ['popular', 'europe', 'africa'], aliases: ['france', 'belgium', 'canada', 'quebec', 'morocco', 'algeria'] },
  { code: 'de', name: 'German', flag: '🇩🇪', speakers: '135M', speakerCount: 135, region: ['popular', 'europe'], aliases: ['germany', 'austria', 'switzerland'] },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', speakers: '82M', speakerCount: 82, region: ['popular', 'asia'], aliases: ['korea', 'south korea', 'seoul'] },

  // Europe
  { code: 'it', name: 'Italian', flag: '🇮🇹', speakers: '68M', speakerCount: 68, region: ['europe'], aliases: ['italy', 'rome', 'milan'] },
  { code: 'pl', name: 'Polish', flag: '🇵🇱', speakers: '45M', speakerCount: 45, region: ['europe'], aliases: ['poland', 'warsaw', 'krakow'] },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦', speakers: '45M', speakerCount: 45, region: ['europe'], aliases: ['ukraine', 'kyiv', 'kiev'] },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', speakers: '30M', speakerCount: 30, region: ['europe'], aliases: ['netherlands', 'holland', 'belgium'] },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴', speakers: '26M', speakerCount: 26, region: ['europe'], aliases: ['romania', 'moldova', 'bucharest'] },
  { code: 'el', name: 'Greek', flag: '🇬🇷', speakers: '13.5M', speakerCount: 13, region: ['europe'], aliases: ['greece', 'cyprus', 'athens'] },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺', speakers: '13M', speakerCount: 13, region: ['europe'], aliases: ['hungary', 'budapest'] },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', speakers: '13M', speakerCount: 13, region: ['europe'], aliases: ['sweden', 'stockholm'] },
  { code: 'cs', name: 'Czech', flag: '🇨🇿', speakers: '10.7M', speakerCount: 10, region: ['europe'], aliases: ['czech', 'czechia', 'prague'] },
  { code: 'sr', name: 'Serbian', flag: '🇷🇸', speakers: '12M', speakerCount: 12, region: ['europe'], aliases: ['serbia', 'belgrade'] },
  { code: 'bg', name: 'Bulgarian', flag: '🇧🇬', speakers: '8M', speakerCount: 8, region: ['europe'], aliases: ['bulgaria', 'sofia'] },
  { code: 'da', name: 'Danish', flag: '🇩🇰', speakers: '6M', speakerCount: 6, region: ['europe'], aliases: ['denmark', 'copenhagen'] },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮', speakers: '5.8M', speakerCount: 5, region: ['europe'], aliases: ['finland', 'helsinki'] },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴', speakers: '5.3M', speakerCount: 5, region: ['europe'], aliases: ['norway', 'oslo'] },
  { code: 'hr', name: 'Croatian', flag: '🇭🇷', speakers: '5.5M', speakerCount: 5, region: ['europe'], aliases: ['croatia', 'zagreb'] },
  { code: 'sk', name: 'Slovak', flag: '🇸🇰', speakers: '5.2M', speakerCount: 5, region: ['europe'], aliases: ['slovakia', 'bratislava'] },
  { code: 'lt', name: 'Lithuanian', flag: '🇱🇹', speakers: '3M', speakerCount: 3, region: ['europe'], aliases: ['lithuania', 'vilnius'] },
  { code: 'sl', name: 'Slovenian', flag: '🇸🇮', speakers: '2.5M', speakerCount: 2, region: ['europe'], aliases: ['slovenia', 'ljubljana'] },
  { code: 'lv', name: 'Latvian', flag: '🇱🇻', speakers: '1.7M', speakerCount: 1, region: ['europe'], aliases: ['latvia', 'riga'] },
  { code: 'et', name: 'Estonian', flag: '🇪🇪', speakers: '1.1M', speakerCount: 1, region: ['europe'], aliases: ['estonia', 'tallinn'] },
  { code: 'is', name: 'Icelandic', flag: '🇮🇸', speakers: '330K', speakerCount: 0.3, region: ['europe'], aliases: ['iceland', 'reykjavik'] },
  { code: 'ca', name: 'Catalan', flag: '🇪🇸', speakers: '10M', speakerCount: 10, region: ['europe'], aliases: ['spain', 'catalonia', 'barcelona'] },
  { code: 'eu', name: 'Basque', flag: '🇪🇸', speakers: '750K', speakerCount: 0.7, region: ['europe'], aliases: ['spain', 'basque country', 'bilbao'] },
  { code: 'gl', name: 'Galician', flag: '🇪🇸', speakers: '2.4M', speakerCount: 2, region: ['europe'], aliases: ['spain', 'galicia'] },
  { code: 'cy', name: 'Welsh', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', speakers: '880K', speakerCount: 0.8, region: ['europe'], aliases: ['wales', 'cardiff'] },
  { code: 'ga', name: 'Irish', flag: '🇮🇪', speakers: '1.7M', speakerCount: 1, region: ['europe'], aliases: ['ireland', 'dublin', 'gaelic'] },
  { code: 'mt', name: 'Maltese', flag: '🇲🇹', speakers: '520K', speakerCount: 0.5, region: ['europe'], aliases: ['malta', 'valletta'] },
  { code: 'sq', name: 'Albanian', flag: '🇦🇱', speakers: '7.5M', speakerCount: 7, region: ['europe'], aliases: ['albania', 'kosovo', 'tirana'] },
  { code: 'mk', name: 'Macedonian', flag: '🇲🇰', speakers: '2M', speakerCount: 2, region: ['europe'], aliases: ['north macedonia', 'skopje'] },
  { code: 'bs', name: 'Bosnian', flag: '🇧🇦', speakers: '2.5M', speakerCount: 2, region: ['europe'], aliases: ['bosnia', 'sarajevo'] },
  { code: 'be', name: 'Belarusian', flag: '🇧🇾', speakers: '5.1M', speakerCount: 5, region: ['europe'], aliases: ['belarus', 'minsk'] },
  { code: 'gd', name: 'Scottish Gaelic', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', speakers: '57K', speakerCount: 0.05, region: ['europe'], aliases: ['scotland', 'highlands'] },
  { code: 'lb', name: 'Luxembourgish', flag: '🇱🇺', speakers: '400K', speakerCount: 0.4, region: ['europe'], aliases: ['luxembourg'] },

  // Asia
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', speakers: '88M', speakerCount: 88, region: ['asia', 'europe'], aliases: ['turkey', 'istanbul', 'ankara'] },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', speakers: '85M', speakerCount: 85, region: ['asia'], aliases: ['vietnam', 'hanoi', 'ho chi minh'] },
  { code: 'zh-yue', name: 'Cantonese', flag: '🇭🇰', speakers: '85M', speakerCount: 85, region: ['asia'], aliases: ['hong kong', 'macau', 'guangdong'] },
  { code: 'te', name: 'Telugu', flag: '🇮🇳', speakers: '83M', speakerCount: 83, region: ['asia'], aliases: ['india', 'hyderabad', 'andhra pradesh'] },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳', speakers: '83M', speakerCount: 83, region: ['asia'], aliases: ['india', 'mumbai', 'pune', 'maharashtra'] },
  { code: 'tl', name: 'Filipino', flag: '🇵🇭', speakers: '82M', speakerCount: 82, region: ['asia'], aliases: ['philippines', 'manila', 'tagalog'] },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', speakers: '78M', speakerCount: 78, region: ['asia'], aliases: ['india', 'sri lanka', 'singapore', 'chennai'] },
  { code: 'ms', name: 'Malay', flag: '🇲🇾', speakers: '77M', speakerCount: 77, region: ['asia'], aliases: ['malaysia', 'brunei', 'singapore'] },
  { code: 'th', name: 'Thai', flag: '🇹🇭', speakers: '61M', speakerCount: 61, region: ['asia'], aliases: ['thailand', 'bangkok'] },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳', speakers: '57M', speakerCount: 57, region: ['asia'], aliases: ['india', 'gujarat', 'ahmedabad'] },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳', speakers: '44M', speakerCount: 44, region: ['asia'], aliases: ['india', 'karnataka', 'bangalore'] },
  { code: 'my', name: 'Burmese', flag: '🇲🇲', speakers: '43M', speakerCount: 43, region: ['asia'], aliases: ['myanmar', 'burma', 'yangon'] },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳', speakers: '38M', speakerCount: 38, region: ['asia'], aliases: ['india', 'kerala', 'kochi'] },
  { code: 'ne', name: 'Nepali', flag: '🇳🇵', speakers: '32M', speakerCount: 32, region: ['asia'], aliases: ['nepal', 'kathmandu'] },
  { code: 'lo', name: 'Lao', flag: '🇱🇦', speakers: '30M', speakerCount: 30, region: ['asia'], aliases: ['laos', 'vientiane'] },
  { code: 'km', name: 'Khmer', flag: '🇰🇭', speakers: '18M', speakerCount: 18, region: ['asia'], aliases: ['cambodia', 'phnom penh'] },
  { code: 'si', name: 'Sinhala', flag: '🇱🇰', speakers: '17M', speakerCount: 17, region: ['asia'], aliases: ['sri lanka', 'colombo'] },
  { code: 'mn', name: 'Mongolian', flag: '🇲🇳', speakers: '5.7M', speakerCount: 5, region: ['asia'], aliases: ['mongolia', 'ulaanbaatar'] },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩', speakers: '200M', speakerCount: 200, region: ['asia'], aliases: ['indonesia', 'jakarta', 'bali'] },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳', speakers: '113M', speakerCount: 113, region: ['asia'], aliases: ['india', 'pakistan', 'punjab', 'amritsar'] },

  // Middle East & Central Asia
  { code: 'fa', name: 'Persian', flag: '🇮🇷', speakers: '110M', speakerCount: 110, region: ['middleeast'], aliases: ['iran', 'farsi', 'tehran'] },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰', speakers: '230M', speakerCount: 230, region: ['middleeast', 'asia'], aliases: ['pakistan', 'karachi', 'lahore'] },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱', speakers: '9M', speakerCount: 9, region: ['middleeast'], aliases: ['israel', 'jerusalem', 'tel aviv'] },
  { code: 'ku', name: 'Kurdish', flag: '🇮🇶', speakers: '30M', speakerCount: 30, region: ['middleeast'], aliases: ['iraq', 'iran', 'turkey', 'kurdistan'] },
  { code: 'ps', name: 'Pashto', flag: '🇦🇫', speakers: '60M', speakerCount: 60, region: ['middleeast', 'asia'], aliases: ['afghanistan', 'pakistan', 'kabul'] },
  { code: 'kk', name: 'Kazakh', flag: '🇰🇿', speakers: '13M', speakerCount: 13, region: ['middleeast', 'asia'], aliases: ['kazakhstan', 'astana', 'almaty'] },
  { code: 'uz', name: 'Uzbek', flag: '🇺🇿', speakers: '35M', speakerCount: 35, region: ['middleeast', 'asia'], aliases: ['uzbekistan', 'tashkent'] },
  { code: 'az', name: 'Azerbaijani', flag: '🇦🇿', speakers: '23M', speakerCount: 23, region: ['middleeast'], aliases: ['azerbaijan', 'baku'] },
  { code: 'ka', name: 'Georgian', flag: '🇬🇪', speakers: '4M', speakerCount: 4, region: ['middleeast', 'europe'], aliases: ['georgia', 'tbilisi'] },
  { code: 'hy', name: 'Armenian', flag: '🇦🇲', speakers: '7M', speakerCount: 7, region: ['middleeast'], aliases: ['armenia', 'yerevan'] },
  { code: 'tg', name: 'Tajik', flag: '🇹🇯', speakers: '8.4M', speakerCount: 8, region: ['middleeast', 'asia'], aliases: ['tajikistan', 'dushanbe'] },
  { code: 'tk', name: 'Turkmen', flag: '🇹🇲', speakers: '11M', speakerCount: 11, region: ['middleeast', 'asia'], aliases: ['turkmenistan', 'ashgabat'] },
  { code: 'ky', name: 'Kyrgyz', flag: '🇰🇬', speakers: '4.5M', speakerCount: 4, region: ['middleeast', 'asia'], aliases: ['kyrgyzstan', 'bishkek'] },

  // Africa
  { code: 'sw', name: 'Swahili', flag: '🇰🇪', speakers: '100M', speakerCount: 100, region: ['africa'], aliases: ['kenya', 'tanzania', 'uganda', 'east africa'] },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬', speakers: '77M', speakerCount: 77, region: ['africa'], aliases: ['nigeria', 'niger', 'west africa'] },
  { code: 'am', name: 'Amharic', flag: '🇪🇹', speakers: '57M', speakerCount: 57, region: ['africa'], aliases: ['ethiopia', 'addis ababa'] },
  { code: 'yo', name: 'Yoruba', flag: '🇳🇬', speakers: '47M', speakerCount: 47, region: ['africa'], aliases: ['nigeria', 'lagos'] },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬', speakers: '45M', speakerCount: 45, region: ['africa'], aliases: ['nigeria', 'enugu'] },
  { code: 'zu', name: 'Zulu', flag: '🇿🇦', speakers: '27M', speakerCount: 27, region: ['africa'], aliases: ['south africa', 'durban'] },
  { code: 'so', name: 'Somali', flag: '🇸🇴', speakers: '22M', speakerCount: 22, region: ['africa'], aliases: ['somalia', 'mogadishu', 'djibouti'] },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦', speakers: '7.2M', speakerCount: 7, region: ['africa'], aliases: ['south africa', 'namibia', 'cape town'] },

  // Americas (additional)
]

const REGIONS: { id: Region | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All Languages', icon: '🌍' },
  { id: 'popular', label: 'Most Popular', icon: '⭐' },
  { id: 'europe', label: 'Europe', icon: '🇪🇺' },
  { id: 'asia', label: 'Asia', icon: '🌏' },
  { id: 'middleeast', label: 'Middle East', icon: '🕌' },
  { id: 'africa', label: 'Africa', icon: '🌍' },
  { id: 'americas', label: 'Americas', icon: '🌎' },
]

// Social proof messages
const SOCIAL_PROOF_MESSAGES = [
  { country: 'Brazil', lang: 'Portuguese', flag: '🇧🇷' },
  { country: 'Japan', lang: 'Japanese', flag: '🇯🇵' },
  { country: 'Germany', lang: 'German', flag: '🇩🇪' },
  { country: 'France', lang: 'French', flag: '🇫🇷' },
  { country: 'Mexico', lang: 'Spanish', flag: '🇲🇽' },
  { country: 'India', lang: 'Hindi', flag: '🇮🇳' },
  { country: 'Saudi Arabia', lang: 'Arabic', flag: '🇸🇦' },
  { country: 'South Korea', lang: 'Korean', flag: '🇰🇷' },
  { country: 'Italy', lang: 'Italian', flag: '🇮🇹' },
  { country: 'Vietnam', lang: 'Vietnamese', flag: '🇻🇳' },
  { country: 'Turkey', lang: 'Turkish', flag: '🇹🇷' },
  { country: 'Poland', lang: 'Polish', flag: '🇵🇱' },
]

export default function LanguagesPage() {
  const [search, setSearch] = useState('')
  const [activeRegion, setActiveRegion] = useState<Region | 'all'>('all')
  const [detectedLang, setDetectedLang] = useState<Language | null>(null)
  const [socialProof, setSocialProof] = useState(SOCIAL_PROOF_MESSAGES[0])
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [requestEmail, setRequestEmail] = useState('')
  const [requestLang, setRequestLang] = useState('')
  const [requestSubmitted, setRequestSubmitted] = useState(false)

  // Detect user's browser language
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language?.split('-')[0] || 'en'
      const found = LANGUAGES.find(l => l.code === browserLang || l.code.startsWith(browserLang))
      if (found && found.code !== 'en') {
        setDetectedLang(found)
      }
    }
  }, [])

  // Rotate social proof messages
  useEffect(() => {
    const interval = setInterval(() => {
      setSocialProof(prev => {
        const currentIndex = SOCIAL_PROOF_MESSAGES.findIndex(m => m.country === prev.country)
        const nextIndex = (currentIndex + 1) % SOCIAL_PROOF_MESSAGES.length
        return SOCIAL_PROOF_MESSAGES[nextIndex]
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Filter languages
  const filtered = useMemo(() => {
    let result = LANGUAGES

    // Region filter
    if (activeRegion !== 'all') {
      result = result.filter(lang => lang.region.includes(activeRegion))
    }

    // Search filter
    if (search.trim()) {
      const term = search.toLowerCase()
      result = result.filter(lang =>
        lang.name.toLowerCase().includes(term) ||
        lang.aliases.some(a => a.includes(term))
      )
    }

    return result
  }, [search, activeRegion])

  // Max speaker count for visual bars
  const maxSpeakers = Math.max(...LANGUAGES.map(l => l.speakerCount))

  const handleRequestSubmit = () => {
    if (requestEmail && requestLang) {
      setRequestSubmitted(true)
      setTimeout(() => {
        setShowRequestModal(false)
        setRequestSubmitted(false)
        setRequestEmail('')
        setRequestLang('')
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Social Proof Ticker */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-2 text-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-white/60">Just now:</span>
          <span className="font-medium text-white">
            Someone in {socialProof.country} {socialProof.flag} created a video in {socialProof.lang}
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-white/10 bg-zinc-950/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <span className="font-black text-xl hidden sm:block">AIFastScale</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-sm hover:shadow-lg hover:shadow-amber-500/25 transition-all"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Detected Language Banner */}
      {detectedLang && (
        <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border-b border-emerald-500/20">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-3">
            <span className="text-4xl">{detectedLang.flag}</span>
            <div>
              <p className="font-bold text-emerald-400">We detected you speak {detectedLang.name}!</p>
              <p className="text-sm text-white/60">Yes, we support it. Create videos in {detectedLang.name} today.</p>
            </div>
            <Link
              href="/"
              className="ml-4 px-4 py-2 rounded-full bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-colors"
            >
              Try Now
            </Link>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="pt-12 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <Globe className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 font-medium text-sm">Speak to the World</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">
            Create Videos in{' '}
            <span className="text-amber-400">{LANGUAGES.length}+ Languages</span>
          </h1>

          <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">
            Reach <span className="text-white font-bold">5.8B+</span> potential viewers worldwide.
            Your AI clone speaks any language fluently.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10">
              <Globe className="w-6 h-6 text-amber-400" />
              <div className="text-left">
                <p className="text-2xl font-black">{LANGUAGES.length}+</p>
                <p className="text-xs text-white/50">Languages</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10">
              <Users className="w-6 h-6 text-emerald-400" />
              <div className="text-left">
                <p className="text-2xl font-black">5.8B+</p>
                <p className="text-xs text-white/50">Potential Reach</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10">
              <MapPin className="w-6 h-6 text-violet-400" />
              <div className="text-left">
                <p className="text-2xl font-black">195+</p>
                <p className="text-xs text-white/50">Countries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="px-4 pb-6">
        <div className="max-w-5xl mx-auto">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by language or country (e.g. 'Spanish', 'Brazil', 'Tokyo')..."
              className="w-full pl-14 pr-14 py-5 rounded-2xl bg-white/5 border border-white/20 text-white text-lg placeholder-white/40 focus:outline-none focus:border-amber-500/50 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5 text-white/50" />
              </button>
            )}
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {REGIONS.map(region => (
              <button
                key={region.id}
                onClick={() => setActiveRegion(region.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeRegion === region.id
                    ? 'bg-amber-500 text-black'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                <span>{region.icon}</span>
                <span>{region.label}</span>
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-center text-white/50 text-sm">
            Showing <span className="text-white font-bold">{filtered.length}</span> languages
            {search && (
              <button onClick={() => setSearch('')} className="ml-2 text-amber-400 hover:underline">
                Clear search
              </button>
            )}
          </p>
        </div>
      </section>

      {/* Languages Grid */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-white/20" />
              </div>
              <h3 className="text-xl font-bold mb-2">No languages found</h3>
              <p className="text-white/50 mb-4">Try searching by country name</p>
              <button
                onClick={() => { setSearch(''); setActiveRegion('all'); }}
                className="px-6 py-3 rounded-full bg-amber-500 text-black font-bold"
              >
                Show All
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((lang) => (
                <div
                  key={lang.code}
                  className={`relative p-5 rounded-2xl border transition-all hover:scale-[1.02] ${
                    detectedLang?.code === lang.code
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : lang.region.includes('popular')
                        ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Popular badge */}
                  {lang.region.includes('popular') && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
                      <Star className="w-3 h-3 text-amber-400" fill="currentColor" />
                      <span className="text-[10px] font-bold text-amber-400">POPULAR</span>
                    </div>
                  )}

                  {/* Detected badge */}
                  {detectedLang?.code === lang.code && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                      <span className="text-[10px] font-bold text-emerald-400">YOUR LANGUAGE</span>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Flag */}
                    <div className="text-5xl">{lang.flag}</div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-white mb-1">{lang.name}</h3>
                      <p className="text-sm text-white/50 mb-3">{lang.speakers} speakers</p>

                      {/* Speaker bar */}
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            lang.region.includes('popular')
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                              : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                          }`}
                          style={{ width: `${Math.max(5, (lang.speakerCount / maxSpeakers) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Checkmark */}
                  <div className="absolute bottom-4 right-4 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-black" strokeWidth={3} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Request Language CTA */}
      <section className="px-4 py-12 bg-gradient-to-b from-transparent to-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-violet-400" />
          </div>
          <h3 className="text-2xl font-black mb-2">Can't find your language?</h3>
          <p className="text-white/60 mb-6">
            We're always adding more. Let us know which language you need and we'll prioritize it.
          </p>
          <button
            onClick={() => setShowRequestModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-500 text-white font-bold hover:bg-violet-400 transition-colors"
          >
            Request a Language
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-medium text-sm">Ready to go global?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Start Creating in <span className="text-amber-400">Any Language</span> Today
          </h2>

          <p className="text-lg text-white/60 mb-8">
            Your AI video clone can speak any of these {LANGUAGES.length}+ languages fluently.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-lg hover:shadow-xl hover:shadow-amber-500/25 transition-all"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="text-white/40 text-sm mt-4">
            Join 12,000+ creators already using AI FastScale
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-white/80">AIFastScale</span>
          </div>
          <p className="text-white/40 text-sm">© 2025 AIFastScale. All rights reserved.</p>
        </div>
      </footer>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowRequestModal(false)} />
          <div className="relative bg-zinc-900 rounded-3xl border border-white/10 p-6 w-full max-w-md">
            <button
              onClick={() => setShowRequestModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5 text-white/50" />
            </button>

            {requestSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Request Submitted!</h3>
                <p className="text-white/60">We'll notify you when your language is available.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-2">Request a Language</h3>
                <p className="text-white/60 text-sm mb-6">Tell us which language you need and we'll prioritize it.</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Language you need</label>
                    <input
                      type="text"
                      value={requestLang}
                      onChange={(e) => setRequestLang(e.target.value)}
                      placeholder="e.g. Swahili, Tagalog..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Your email</label>
                    <input
                      type="email"
                      value={requestEmail}
                      onChange={(e) => setRequestEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <button
                    onClick={handleRequestSubmit}
                    disabled={!requestEmail || !requestLang}
                    className="w-full py-3 rounded-xl bg-amber-500 text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-400 transition-colors"
                  >
                    Submit Request
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
