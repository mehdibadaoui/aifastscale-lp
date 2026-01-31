'use client'

import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import Link from 'next/link'
import {
  Search, X, Globe, Check, ChevronDown, ArrowRight,
  Sparkles, Languages, MapPin, Users, Zap, MessageSquare
} from 'lucide-react'

// ============================================
// 100+ SUPPORTED LANGUAGES DATA
// ============================================

const SUPPORTED_LANGUAGES = [
  // === TIER 1: Most Common Languages ===
  { code: 'en', name: 'English', flag: '🇺🇸', tier: 1, speakers: '1.5B', aliases: [
    'usa', 'america', 'united states', 'uk', 'united kingdom', 'britain', 'england', 'scotland', 'wales', 'ireland',
    'australia', 'new zealand', 'canada', 'singapore', 'south africa', 'nigeria', 'kenya', 'ghana', 'uganda',
    'jamaica', 'bahamas', 'barbados', 'trinidad', 'guyana', 'belize', 'bermuda', 'virgin islands', 'puerto rico',
    'philippines', 'india', 'pakistan', 'hong kong', 'malta', 'cyprus', 'fiji', 'papua new guinea', 'liberia', 'sierra leone'
  ]},
  { code: 'es', name: 'Spanish', flag: '🇪🇸', tier: 1, speakers: '560M', aliases: [
    'spain', 'espana', 'mexico', 'argentina', 'colombia', 'peru', 'venezuela', 'chile', 'ecuador', 'guatemala',
    'cuba', 'dominican republic', 'honduras', 'bolivia', 'el salvador', 'nicaragua', 'costa rica', 'panama',
    'uruguay', 'paraguay', 'puerto rico', 'equatorial guinea', 'espanol', 'castellano', 'latino', 'latin america'
  ]},
  { code: 'fr', name: 'French', flag: '🇫🇷', tier: 1, speakers: '280M', aliases: [
    'france', 'belgium', 'switzerland', 'canada', 'quebec', 'morocco', 'algeria', 'tunisia', 'senegal', 'ivory coast',
    'cameroon', 'madagascar', 'mali', 'burkina faso', 'niger', 'benin', 'togo', 'guinea', 'chad', 'congo',
    'gabon', 'djibouti', 'comoros', 'seychelles', 'mauritius', 'haiti', 'luxembourg', 'monaco', 'francais', 'francophone'
  ]},
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', tier: 1, speakers: '420M', aliases: [
    'saudi arabia', 'saudi', 'egypt', 'morocco', 'algeria', 'tunisia', 'libya', 'sudan', 'iraq', 'syria',
    'jordan', 'lebanon', 'palestine', 'yemen', 'oman', 'uae', 'dubai', 'abu dhabi', 'qatar', 'bahrain', 'kuwait',
    'mauritania', 'somalia', 'djibouti', 'comoros', 'middle east', 'arab', 'gulf', 'maghreb', 'levant', 'arabie'
  ]},
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷', tier: 1, speakers: '265M', aliases: [
    'brazil', 'brasil', 'portugal', 'angola', 'mozambique', 'cape verde', 'guinea bissau', 'sao tome',
    'east timor', 'timor leste', 'macau', 'goa', 'brasileiro', 'portugues', 'lusophone'
  ]},
  { code: 'de', name: 'German', flag: '🇩🇪', tier: 1, speakers: '135M', aliases: [
    'germany', 'deutschland', 'austria', 'switzerland', 'liechtenstein', 'luxembourg', 'belgium',
    'south tyrol', 'alsace', 'deutsch', 'german speaking'
  ]},
  { code: 'zh', name: 'Mandarin Chinese', flag: '🇨🇳', tier: 1, speakers: '1.1B', aliases: [
    'china', 'taiwan', 'singapore', 'malaysia', 'chinese', 'zhongwen', 'putonghua', 'beijing', 'shanghai',
    'hong kong', 'macau', 'prc', 'mainland china', 'zhongguo'
  ]},
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', tier: 1, speakers: '610M', aliases: [
    'india', 'indian', 'bharat', 'hindustan', 'delhi', 'mumbai', 'bollywood', 'hindi belt', 'uttar pradesh',
    'madhya pradesh', 'rajasthan', 'bihar', 'jharkhand', 'uttarakhand', 'himachal', 'haryana', 'fiji hindi'
  ]},
  { code: 'ru', name: 'Russian', flag: '🇷🇺', tier: 1, speakers: '255M', aliases: [
    'russia', 'belarus', 'kazakhstan', 'kyrgyzstan', 'ukraine', 'moldova', 'estonia', 'latvia', 'lithuania',
    'uzbekistan', 'tajikistan', 'turkmenistan', 'georgia', 'armenia', 'azerbaijan', 'rossiya', 'russkiy', 'soviet'
  ]},
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', tier: 1, speakers: '125M', aliases: ['japan', 'nihon', 'nippon', 'tokyo', 'osaka', 'nihongo'] },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', tier: 1, speakers: '82M', aliases: ['korea', 'south korea', 'north korea', 'seoul', 'hangul', 'hangugeo', 'joseon'] },
  { code: 'it', name: 'Italian', flag: '🇮🇹', tier: 1, speakers: '68M', aliases: [
    'italy', 'italia', 'switzerland', 'san marino', 'vatican', 'italiano', 'rome', 'milan', 'sicily', 'sardinia'
  ]},
  // === TIER 2: Major Regional Languages ===
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', tier: 2, speakers: '88M', aliases: ['turkey', 'turkiye', 'cyprus', 'turkish republic', 'istanbul', 'ankara', 'turk'] },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', tier: 2, speakers: '30M', aliases: [
    'netherlands', 'holland', 'belgium', 'suriname', 'aruba', 'curacao', 'sint maarten', 'flemish', 'nederland', 'vlaams'
  ]},
  { code: 'pl', name: 'Polish', flag: '🇵🇱', tier: 2, speakers: '45M', aliases: ['poland', 'polska', 'polski', 'warsaw', 'krakow'] },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', tier: 2, speakers: '85M', aliases: ['vietnam', 'viet nam', 'hanoi', 'ho chi minh', 'saigon', 'tieng viet'] },
  { code: 'th', name: 'Thai', flag: '🇹🇭', tier: 2, speakers: '61M', aliases: ['thailand', 'bangkok', 'siam', 'thai', 'phasa thai'] },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩', tier: 2, speakers: '200M', aliases: ['indonesia', 'jakarta', 'bali', 'java', 'sumatra', 'bahasa indonesia'] },
  { code: 'ms', name: 'Malay', flag: '🇲🇾', tier: 2, speakers: '77M', aliases: ['malaysia', 'brunei', 'singapore', 'kuala lumpur', 'melayu', 'bahasa melayu'] },
  { code: 'tl', name: 'Filipino/Tagalog', flag: '🇵🇭', tier: 2, speakers: '82M', aliases: ['philippines', 'manila', 'tagalog', 'pinoy', 'pilipino', 'cebuano'] },
  { code: 'fa', name: 'Persian/Farsi', flag: '🇮🇷', tier: 2, speakers: '110M', aliases: ['iran', 'afghanistan', 'tajikistan', 'iranian', 'farsi', 'dari', 'tehran'] },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰', tier: 2, speakers: '230M', aliases: ['pakistan', 'pakistani', 'karachi', 'lahore', 'islamabad', 'urdu'] },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩', tier: 2, speakers: '265M', aliases: ['bangladesh', 'india', 'dhaka', 'kolkata', 'west bengal', 'bangla', 'bangladeshi'] },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱', tier: 2, speakers: '9M', aliases: ['israel', 'israeli', 'jerusalem', 'tel aviv', 'ivrit', 'jewish'] },
  // === TIER 3: European Languages ===
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', tier: 3, speakers: '13M', aliases: ['sweden', 'sverige', 'stockholm', 'svenska', 'finnish swedish'] },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴', tier: 3, speakers: '5.3M', aliases: ['norway', 'norge', 'oslo', 'norsk', 'bokmal', 'nynorsk'] },
  { code: 'da', name: 'Danish', flag: '🇩🇰', tier: 3, speakers: '6M', aliases: ['denmark', 'danmark', 'copenhagen', 'dansk', 'greenland', 'faroe'] },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮', tier: 3, speakers: '5.8M', aliases: ['finland', 'suomi', 'helsinki', 'finnish', 'suomalainen'] },
  { code: 'el', name: 'Greek', flag: '🇬🇷', tier: 3, speakers: '13.5M', aliases: ['greece', 'cyprus', 'athens', 'greek', 'ellada', 'hellas', 'ellinika'] },
  { code: 'cs', name: 'Czech', flag: '🇨🇿', tier: 3, speakers: '10.7M', aliases: ['czech republic', 'czechia', 'prague', 'cesko', 'cesky', 'bohemia', 'moravia'] },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺', tier: 3, speakers: '13M', aliases: ['hungary', 'budapest', 'magyar', 'magyarorszag'] },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴', tier: 3, speakers: '26M', aliases: ['romania', 'moldova', 'bucharest', 'romana', 'moldovan'] },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦', tier: 3, speakers: '45M', aliases: ['ukraine', 'kyiv', 'kiev', 'ukraina', 'ukrainska'] },
  { code: 'bg', name: 'Bulgarian', flag: '🇧🇬', tier: 3, speakers: '8M', aliases: ['bulgaria', 'sofia', 'balgaria', 'balgarski'] },
  { code: 'hr', name: 'Croatian', flag: '🇭🇷', tier: 3, speakers: '5.5M', aliases: ['croatia', 'zagreb', 'hrvatska', 'hrvatski'] },
  { code: 'sr', name: 'Serbian', flag: '🇷🇸', tier: 3, speakers: '12M', aliases: ['serbia', 'belgrade', 'srbija', 'srpski', 'montenegro'] },
  { code: 'sk', name: 'Slovak', flag: '🇸🇰', tier: 3, speakers: '5.2M', aliases: ['slovakia', 'bratislava', 'slovensko', 'slovensky'] },
  { code: 'sl', name: 'Slovenian', flag: '🇸🇮', tier: 3, speakers: '2.5M', aliases: ['slovenia', 'ljubljana', 'slovenija', 'slovenscina'] },
  { code: 'lt', name: 'Lithuanian', flag: '🇱🇹', tier: 3, speakers: '3M', aliases: ['lithuania', 'vilnius', 'lietuva', 'lietuviu'] },
  { code: 'lv', name: 'Latvian', flag: '🇱🇻', tier: 3, speakers: '1.7M', aliases: ['latvia', 'riga', 'latvija', 'latviesu'] },
  { code: 'et', name: 'Estonian', flag: '🇪🇪', tier: 3, speakers: '1.1M', aliases: ['estonia', 'tallinn', 'eesti', 'estonian'] },
  { code: 'is', name: 'Icelandic', flag: '🇮🇸', tier: 3, speakers: '330K', aliases: ['iceland', 'reykjavik', 'island', 'islenska'] },
  // === TIER 4: African & Middle Eastern ===
  { code: 'sw', name: 'Swahili', flag: '🇰🇪', tier: 4, speakers: '100M', aliases: [
    'kenya', 'tanzania', 'uganda', 'rwanda', 'burundi', 'congo', 'mozambique', 'nairobi', 'dar es salaam', 'kiswahili'
  ]},
  { code: 'am', name: 'Amharic', flag: '🇪🇹', tier: 4, speakers: '57M', aliases: ['ethiopia', 'addis ababa', 'ethiopian', 'amarinya'] },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬', tier: 4, speakers: '77M', aliases: ['nigeria', 'niger', 'ghana', 'cameroon', 'west africa', 'haoussa'] },
  { code: 'yo', name: 'Yoruba', flag: '🇳🇬', tier: 4, speakers: '47M', aliases: ['nigeria', 'benin', 'togo', 'lagos', 'west africa'] },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬', tier: 4, speakers: '45M', aliases: ['nigeria', 'biafra', 'igboland', 'enugu'] },
  { code: 'zu', name: 'Zulu', flag: '🇿🇦', tier: 4, speakers: '27M', aliases: ['south africa', 'kwazulu natal', 'durban', 'isizulu'] },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦', tier: 4, speakers: '7.2M', aliases: ['south africa', 'namibia', 'cape town', 'pretoria', 'boer'] },
  // === TIER 5: Asian Languages ===
  { code: 'zh-yue', name: 'Cantonese', flag: '🇭🇰', tier: 5, speakers: '85M', aliases: ['hong kong', 'macau', 'guangdong', 'guangzhou', 'hk', 'yue'] },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', tier: 5, speakers: '78M', aliases: ['india', 'sri lanka', 'singapore', 'malaysia', 'tamil nadu', 'chennai'] },
  { code: 'te', name: 'Telugu', flag: '🇮🇳', tier: 5, speakers: '83M', aliases: ['india', 'andhra pradesh', 'telangana', 'hyderabad'] },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳', tier: 5, speakers: '83M', aliases: ['india', 'maharashtra', 'mumbai', 'pune'] },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳', tier: 5, speakers: '57M', aliases: ['india', 'gujarat', 'ahmedabad', 'surat'] },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳', tier: 5, speakers: '44M', aliases: ['india', 'karnataka', 'bangalore', 'bengaluru'] },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳', tier: 5, speakers: '38M', aliases: ['india', 'kerala', 'kochi', 'trivandrum'] },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳', tier: 5, speakers: '113M', aliases: ['india', 'pakistan', 'punjab', 'amritsar', 'lahore', 'sikh'] },
  { code: 'ne', name: 'Nepali', flag: '🇳🇵', tier: 5, speakers: '32M', aliases: ['nepal', 'kathmandu', 'bhutan', 'sikkim', 'darjeeling'] },
  { code: 'si', name: 'Sinhala', flag: '🇱🇰', tier: 5, speakers: '17M', aliases: ['sri lanka', 'colombo', 'sinhalese', 'ceylon'] },
  { code: 'my', name: 'Burmese', flag: '🇲🇲', tier: 5, speakers: '43M', aliases: ['myanmar', 'burma', 'yangon', 'rangoon', 'mandalay'] },
  { code: 'km', name: 'Khmer', flag: '🇰🇭', tier: 5, speakers: '18M', aliases: ['cambodia', 'phnom penh', 'cambodian', 'kampuchea'] },
  { code: 'lo', name: 'Lao', flag: '🇱🇦', tier: 5, speakers: '30M', aliases: ['laos', 'vientiane', 'laotian'] },
  { code: 'mn', name: 'Mongolian', flag: '🇲🇳', tier: 5, speakers: '5.7M', aliases: ['mongolia', 'ulaanbaatar', 'inner mongolia'] },
  // === TIER 6: Central Asian & Caucasus ===
  { code: 'kk', name: 'Kazakh', flag: '🇰🇿', tier: 6, speakers: '13M', aliases: ['kazakhstan', 'astana', 'almaty', 'qazaq'] },
  { code: 'uz', name: 'Uzbek', flag: '🇺🇿', tier: 6, speakers: '35M', aliases: ['uzbekistan', 'tashkent', 'samarkand', 'ozbek'] },
  { code: 'az', name: 'Azerbaijani', flag: '🇦🇿', tier: 6, speakers: '23M', aliases: ['azerbaijan', 'baku', 'azeri'] },
  { code: 'ka', name: 'Georgian', flag: '🇬🇪', tier: 6, speakers: '4M', aliases: ['georgia', 'tbilisi', 'sakartvelo', 'kartuli'] },
  { code: 'hy', name: 'Armenian', flag: '🇦🇲', tier: 6, speakers: '7M', aliases: ['armenia', 'yerevan', 'hayastan', 'armenian diaspora'] },
  { code: 'ku', name: 'Kurdish', flag: '🇮🇶', tier: 6, speakers: '30M', aliases: ['iraq', 'iran', 'turkey', 'syria', 'kurdistan', 'erbil'] },
  { code: 'ps', name: 'Pashto', flag: '🇦🇫', tier: 6, speakers: '60M', aliases: ['afghanistan', 'pakistan', 'kabul', 'peshawar', 'pashtun'] },
  // === TIER 7: Additional Languages ===
  { code: 'ca', name: 'Catalan', flag: '🇪🇸', tier: 7, speakers: '10M', aliases: ['spain', 'catalonia', 'barcelona', 'andorra', 'valencia', 'catala'] },
  { code: 'eu', name: 'Basque', flag: '🇪🇸', tier: 7, speakers: '750K', aliases: ['spain', 'france', 'basque country', 'bilbao', 'euskara', 'euskadi'] },
  { code: 'gl', name: 'Galician', flag: '🇪🇸', tier: 7, speakers: '2.4M', aliases: ['spain', 'galicia', 'galego'] },
  { code: 'cy', name: 'Welsh', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', tier: 7, speakers: '880K', aliases: ['wales', 'cardiff', 'cymru', 'cymraeg'] },
  { code: 'ga', name: 'Irish', flag: '🇮🇪', tier: 7, speakers: '1.7M', aliases: ['ireland', 'dublin', 'gaeilge', 'gaelic', 'eire'] },
  { code: 'gd', name: 'Scottish Gaelic', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', tier: 7, speakers: '57K', aliases: ['scotland', 'highlands', 'gaidhlig'] },
  { code: 'mt', name: 'Maltese', flag: '🇲🇹', tier: 7, speakers: '520K', aliases: ['malta', 'valletta', 'malti'] },
  { code: 'lb', name: 'Luxembourgish', flag: '🇱🇺', tier: 7, speakers: '400K', aliases: ['luxembourg', 'letzebuergesch'] },
  { code: 'sq', name: 'Albanian', flag: '🇦🇱', tier: 7, speakers: '7.5M', aliases: ['albania', 'kosovo', 'tirana', 'pristina', 'shqip'] },
  { code: 'mk', name: 'Macedonian', flag: '🇲🇰', tier: 7, speakers: '2M', aliases: ['north macedonia', 'skopje', 'makedonski'] },
  { code: 'bs', name: 'Bosnian', flag: '🇧🇦', tier: 7, speakers: '2.5M', aliases: ['bosnia', 'herzegovina', 'sarajevo', 'bosanski'] },
  { code: 'be', name: 'Belarusian', flag: '🇧🇾', tier: 7, speakers: '5.1M', aliases: ['belarus', 'minsk', 'belaruskaya'] },
]

// ============================================
// TIER LABELS & COLORS
// ============================================

const TIER_INFO: Record<number, { label: string; color: string; bgColor: string }> = {
  1: { label: 'Most Popular', color: 'text-amber-400', bgColor: 'bg-amber-500/20 border-amber-500/30' },
  2: { label: 'Major Regional', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20 border-emerald-500/30' },
  3: { label: 'European', color: 'text-blue-400', bgColor: 'bg-blue-500/20 border-blue-500/30' },
  4: { label: 'African & Middle Eastern', color: 'text-violet-400', bgColor: 'bg-violet-500/20 border-violet-500/30' },
  5: { label: 'Asian', color: 'text-pink-400', bgColor: 'bg-pink-500/20 border-pink-500/30' },
  6: { label: 'Central Asian', color: 'text-cyan-400', bgColor: 'bg-cyan-500/20 border-cyan-500/30' },
  7: { label: 'Regional & Minority', color: 'text-orange-400', bgColor: 'bg-orange-500/20 border-orange-500/30' },
}

// ============================================
// ANIMATED COMPONENTS
// ============================================

const AnimatedNumber = memo(function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const duration = 1500
    const start = performance.now()
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.floor(value * eased))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [value])

  return <>{display}</>
})

// ============================================
// LANGUAGE CARD COMPONENT
// ============================================

const LanguageCard = memo(function LanguageCard({
  lang,
  index,
  isHighlighted
}: {
  lang: typeof SUPPORTED_LANGUAGES[0]
  index: number
  isHighlighted: boolean
}) {
  const tierInfo = TIER_INFO[lang.tier]

  return (
    <div
      className={`group relative p-4 rounded-2xl border transition-all duration-500 cursor-default
        ${isHighlighted
          ? 'bg-amber-500/20 border-amber-500/50 scale-105 shadow-lg shadow-amber-500/20'
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
        }`}
      style={{
        animationDelay: `${index * 30}ms`,
      }}
    >
      {/* Flag */}
      <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
        {lang.flag}
      </div>

      {/* Language name */}
      <h3 className={`font-bold text-lg mb-1 transition-colors ${isHighlighted ? 'text-amber-400' : 'text-white'}`}>
        {lang.name}
      </h3>

      {/* Speakers count */}
      <p className="text-sm text-white/50 mb-2">
        {lang.speakers} speakers
      </p>

      {/* Tier badge */}
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${tierInfo.bgColor} ${tierInfo.color}`}>
        {tierInfo.label}
      </span>

      {/* Checkmark */}
      <div className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300
        ${isHighlighted ? 'bg-amber-500 scale-100' : 'bg-emerald-500/80 scale-90 group-hover:scale-100'}`}>
        <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />
      </div>
    </div>
  )
})

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function LanguagesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTier, setSelectedTier] = useState<number | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Animate on mount
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Filter languages based on search and tier
  const filteredLanguages = useMemo(() => {
    return SUPPORTED_LANGUAGES.filter(lang => {
      // Tier filter
      if (selectedTier !== null && lang.tier !== selectedTier) return false

      // Search filter
      const searchTerm = searchQuery.toLowerCase().trim()
      if (!searchTerm) return true

      // Search in language name
      if (lang.name.toLowerCase().includes(searchTerm)) return true

      // Search in country/region aliases
      if (lang.aliases?.some(alias => alias.toLowerCase().includes(searchTerm))) return true

      return false
    })
  }, [searchQuery, selectedTier])

  // Check if search matches a specific language
  const highlightedLanguage = useMemo(() => {
    if (!searchQuery.trim()) return null
    const searchTerm = searchQuery.toLowerCase().trim()
    return filteredLanguages.find(lang =>
      lang.name.toLowerCase() === searchTerm ||
      lang.aliases?.some(alias => alias.toLowerCase() === searchTerm)
    )?.code || null
  }, [searchQuery, filteredLanguages])

  // Stats
  const totalLanguages = SUPPORTED_LANGUAGES.length
  const totalSpeakers = '5.8B+'

  const handleClearSearch = useCallback(() => {
    setSearchQuery('')
    setSelectedTier(null)
  }, [])

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-x-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-[#09090b]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-shadow">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <span className="font-black text-xl hidden sm:block">AIFastScale</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-sm hover:shadow-lg hover:shadow-amber-500/30 transition-all active:scale-95"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`relative z-10 pt-12 pb-8 px-4 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <Globe className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 font-medium text-sm">Speak to the World</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 leading-tight">
            <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
              Create Videos in
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              {totalLanguages}+ Languages
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white/60 mb-8 max-w-2xl mx-auto">
            Reach <span className="text-white font-bold">{totalSpeakers}</span> potential viewers worldwide.
            Your AI clone speaks any language fluently.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-10">
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10">
              <Languages className="w-6 h-6 text-amber-400" />
              <div className="text-left">
                <p className="text-2xl font-black text-white"><AnimatedNumber value={totalLanguages} />+</p>
                <p className="text-xs text-white/50">Languages</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10">
              <Users className="w-6 h-6 text-emerald-400" />
              <div className="text-left">
                <p className="text-2xl font-black text-white">{totalSpeakers}</p>
                <p className="text-xs text-white/50">Potential Reach</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10">
              <MapPin className="w-6 h-6 text-violet-400" />
              <div className="text-left">
                <p className="text-2xl font-black text-white">195+</p>
                <p className="text-xs text-white/50">Countries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className={`relative z-10 px-4 pb-6 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-3xl mx-auto">
          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by language or country (e.g., 'Spanish', 'Brazil', 'Tokyo')..."
              className="w-full pl-14 pr-14 py-5 rounded-2xl bg-white/5 border border-white/20 text-white text-lg placeholder-white/40 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/50 hover:text-white" />
              </button>
            )}
          </div>

          {/* Tier Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <button
              onClick={() => setSelectedTier(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedTier === null
                  ? 'bg-white text-black'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
              }`}
            >
              All Languages
            </button>
            {Object.entries(TIER_INFO).map(([tier, info]) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(Number(tier))}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTier === Number(tier)
                    ? `${info.bgColor} ${info.color} border`
                    : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                {info.label}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-center text-white/50 text-sm">
            {searchQuery || selectedTier !== null ? (
              <>
                Showing <span className="text-white font-bold">{filteredLanguages.length}</span> of {totalLanguages} languages
                {searchQuery && (
                  <button onClick={handleClearSearch} className="ml-2 text-amber-400 hover:underline">
                    Clear search
                  </button>
                )}
              </>
            ) : (
              <>All <span className="text-white font-bold">{totalLanguages}</span> languages available</>
            )}
          </p>
        </div>
      </section>

      {/* Languages Grid */}
      <section className={`relative z-10 px-4 pb-16 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto">
          {filteredLanguages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-white/20" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No languages found</h3>
              <p className="text-white/50 mb-4">Try searching by country name (e.g., "Japan", "Germany")</p>
              <button
                onClick={handleClearSearch}
                className="px-6 py-3 rounded-full bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors"
              >
                Show All Languages
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredLanguages.map((lang, index) => (
                <LanguageCard
                  key={lang.code}
                  lang={lang}
                  index={index}
                  isHighlighted={highlightedLanguage === lang.code}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 py-16 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-medium text-sm">Ready to go global?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Start Creating in <span className="text-amber-400">Any Language</span> Today
          </h2>

          <p className="text-lg text-white/60 mb-8">
            Your AI video clone can speak any of these {totalLanguages}+ languages fluently.
            No accent, no subtitles needed.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-lg hover:shadow-xl hover:shadow-amber-500/30 transition-all active:scale-95"
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
      <footer className="relative z-10 border-t border-white/10 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-white/80">AIFastScale</span>
          </div>
          <p className="text-white/40 text-sm">
            &copy; 2025 AIFastScale. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
