'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, X, Globe, Check, ArrowRight, Sparkles, Users, MapPin, Zap } from 'lucide-react'

// ============================================
// SUPPORTED LANGUAGES DATA
// ============================================

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', speakers: '1.5B', aliases: ['usa', 'america', 'united states', 'uk', 'united kingdom', 'britain', 'england', 'australia', 'canada'] },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', speakers: '560M', aliases: ['spain', 'mexico', 'argentina', 'colombia', 'peru', 'latino', 'latin america'] },
  { code: 'fr', name: 'French', flag: '🇫🇷', speakers: '280M', aliases: ['france', 'belgium', 'canada', 'quebec', 'morocco', 'algeria'] },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', speakers: '420M', aliases: ['saudi arabia', 'egypt', 'morocco', 'uae', 'dubai', 'middle east'] },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷', speakers: '265M', aliases: ['brazil', 'portugal', 'angola', 'mozambique'] },
  { code: 'de', name: 'German', flag: '🇩🇪', speakers: '135M', aliases: ['germany', 'austria', 'switzerland'] },
  { code: 'zh', name: 'Mandarin Chinese', flag: '🇨🇳', speakers: '1.1B', aliases: ['china', 'taiwan', 'singapore', 'chinese'] },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', speakers: '610M', aliases: ['india', 'indian', 'delhi', 'mumbai', 'bollywood'] },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', speakers: '255M', aliases: ['russia', 'belarus', 'kazakhstan'] },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', speakers: '125M', aliases: ['japan', 'tokyo', 'osaka'] },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', speakers: '82M', aliases: ['korea', 'south korea', 'seoul'] },
  { code: 'it', name: 'Italian', flag: '🇮🇹', speakers: '68M', aliases: ['italy', 'rome', 'milan'] },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', speakers: '88M', aliases: ['turkey', 'istanbul', 'ankara'] },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', speakers: '30M', aliases: ['netherlands', 'holland', 'belgium'] },
  { code: 'pl', name: 'Polish', flag: '🇵🇱', speakers: '45M', aliases: ['poland', 'warsaw', 'krakow'] },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', speakers: '85M', aliases: ['vietnam', 'hanoi', 'ho chi minh'] },
  { code: 'th', name: 'Thai', flag: '🇹🇭', speakers: '61M', aliases: ['thailand', 'bangkok'] },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩', speakers: '200M', aliases: ['indonesia', 'jakarta', 'bali'] },
  { code: 'ms', name: 'Malay', flag: '🇲🇾', speakers: '77M', aliases: ['malaysia', 'brunei', 'singapore'] },
  { code: 'tl', name: 'Filipino', flag: '🇵🇭', speakers: '82M', aliases: ['philippines', 'manila', 'tagalog'] },
  { code: 'fa', name: 'Persian', flag: '🇮🇷', speakers: '110M', aliases: ['iran', 'farsi', 'tehran'] },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰', speakers: '230M', aliases: ['pakistan', 'karachi', 'lahore'] },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩', speakers: '265M', aliases: ['bangladesh', 'india', 'dhaka', 'kolkata'] },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱', speakers: '9M', aliases: ['israel', 'jerusalem', 'tel aviv'] },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', speakers: '13M', aliases: ['sweden', 'stockholm'] },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴', speakers: '5.3M', aliases: ['norway', 'oslo'] },
  { code: 'da', name: 'Danish', flag: '🇩🇰', speakers: '6M', aliases: ['denmark', 'copenhagen'] },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮', speakers: '5.8M', aliases: ['finland', 'helsinki'] },
  { code: 'el', name: 'Greek', flag: '🇬🇷', speakers: '13.5M', aliases: ['greece', 'cyprus', 'athens'] },
  { code: 'cs', name: 'Czech', flag: '🇨🇿', speakers: '10.7M', aliases: ['czech', 'czechia', 'prague'] },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺', speakers: '13M', aliases: ['hungary', 'budapest'] },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴', speakers: '26M', aliases: ['romania', 'moldova', 'bucharest'] },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦', speakers: '45M', aliases: ['ukraine', 'kyiv', 'kiev'] },
  { code: 'bg', name: 'Bulgarian', flag: '🇧🇬', speakers: '8M', aliases: ['bulgaria', 'sofia'] },
  { code: 'hr', name: 'Croatian', flag: '🇭🇷', speakers: '5.5M', aliases: ['croatia', 'zagreb'] },
  { code: 'sr', name: 'Serbian', flag: '🇷🇸', speakers: '12M', aliases: ['serbia', 'belgrade'] },
  { code: 'sk', name: 'Slovak', flag: '🇸🇰', speakers: '5.2M', aliases: ['slovakia', 'bratislava'] },
  { code: 'sl', name: 'Slovenian', flag: '🇸🇮', speakers: '2.5M', aliases: ['slovenia', 'ljubljana'] },
  { code: 'lt', name: 'Lithuanian', flag: '🇱🇹', speakers: '3M', aliases: ['lithuania', 'vilnius'] },
  { code: 'lv', name: 'Latvian', flag: '🇱🇻', speakers: '1.7M', aliases: ['latvia', 'riga'] },
  { code: 'et', name: 'Estonian', flag: '🇪🇪', speakers: '1.1M', aliases: ['estonia', 'tallinn'] },
  { code: 'is', name: 'Icelandic', flag: '🇮🇸', speakers: '330K', aliases: ['iceland', 'reykjavik'] },
  { code: 'sw', name: 'Swahili', flag: '🇰🇪', speakers: '100M', aliases: ['kenya', 'tanzania', 'uganda', 'east africa'] },
  { code: 'am', name: 'Amharic', flag: '🇪🇹', speakers: '57M', aliases: ['ethiopia', 'addis ababa'] },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬', speakers: '77M', aliases: ['nigeria', 'niger', 'west africa'] },
  { code: 'yo', name: 'Yoruba', flag: '🇳🇬', speakers: '47M', aliases: ['nigeria', 'lagos'] },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬', speakers: '45M', aliases: ['nigeria', 'enugu'] },
  { code: 'zu', name: 'Zulu', flag: '🇿🇦', speakers: '27M', aliases: ['south africa', 'durban'] },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦', speakers: '7.2M', aliases: ['south africa', 'namibia', 'cape town'] },
  { code: 'zh-yue', name: 'Cantonese', flag: '🇭🇰', speakers: '85M', aliases: ['hong kong', 'macau', 'guangdong'] },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', speakers: '78M', aliases: ['india', 'sri lanka', 'singapore', 'chennai'] },
  { code: 'te', name: 'Telugu', flag: '🇮🇳', speakers: '83M', aliases: ['india', 'hyderabad', 'andhra pradesh'] },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳', speakers: '83M', aliases: ['india', 'mumbai', 'pune', 'maharashtra'] },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳', speakers: '57M', aliases: ['india', 'gujarat', 'ahmedabad'] },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳', speakers: '44M', aliases: ['india', 'karnataka', 'bangalore'] },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳', speakers: '38M', aliases: ['india', 'kerala', 'kochi'] },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳', speakers: '113M', aliases: ['india', 'pakistan', 'punjab', 'amritsar'] },
  { code: 'ne', name: 'Nepali', flag: '🇳🇵', speakers: '32M', aliases: ['nepal', 'kathmandu'] },
  { code: 'si', name: 'Sinhala', flag: '🇱🇰', speakers: '17M', aliases: ['sri lanka', 'colombo'] },
  { code: 'my', name: 'Burmese', flag: '🇲🇲', speakers: '43M', aliases: ['myanmar', 'burma', 'yangon'] },
  { code: 'km', name: 'Khmer', flag: '🇰🇭', speakers: '18M', aliases: ['cambodia', 'phnom penh'] },
  { code: 'lo', name: 'Lao', flag: '🇱🇦', speakers: '30M', aliases: ['laos', 'vientiane'] },
  { code: 'mn', name: 'Mongolian', flag: '🇲🇳', speakers: '5.7M', aliases: ['mongolia', 'ulaanbaatar'] },
  { code: 'kk', name: 'Kazakh', flag: '🇰🇿', speakers: '13M', aliases: ['kazakhstan', 'astana', 'almaty'] },
  { code: 'uz', name: 'Uzbek', flag: '🇺🇿', speakers: '35M', aliases: ['uzbekistan', 'tashkent'] },
  { code: 'az', name: 'Azerbaijani', flag: '🇦🇿', speakers: '23M', aliases: ['azerbaijan', 'baku'] },
  { code: 'ka', name: 'Georgian', flag: '🇬🇪', speakers: '4M', aliases: ['georgia', 'tbilisi'] },
  { code: 'hy', name: 'Armenian', flag: '🇦🇲', speakers: '7M', aliases: ['armenia', 'yerevan'] },
  { code: 'ku', name: 'Kurdish', flag: '🇮🇶', speakers: '30M', aliases: ['iraq', 'iran', 'turkey', 'kurdistan'] },
  { code: 'ps', name: 'Pashto', flag: '🇦🇫', speakers: '60M', aliases: ['afghanistan', 'pakistan', 'kabul'] },
  { code: 'ca', name: 'Catalan', flag: '🇪🇸', speakers: '10M', aliases: ['spain', 'catalonia', 'barcelona'] },
  { code: 'eu', name: 'Basque', flag: '🇪🇸', speakers: '750K', aliases: ['spain', 'basque country', 'bilbao'] },
  { code: 'gl', name: 'Galician', flag: '🇪🇸', speakers: '2.4M', aliases: ['spain', 'galicia'] },
  { code: 'cy', name: 'Welsh', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', speakers: '880K', aliases: ['wales', 'cardiff'] },
  { code: 'ga', name: 'Irish', flag: '🇮🇪', speakers: '1.7M', aliases: ['ireland', 'dublin', 'gaelic'] },
  { code: 'mt', name: 'Maltese', flag: '🇲🇹', speakers: '520K', aliases: ['malta', 'valletta'] },
  { code: 'sq', name: 'Albanian', flag: '🇦🇱', speakers: '7.5M', aliases: ['albania', 'kosovo', 'tirana'] },
  { code: 'mk', name: 'Macedonian', flag: '🇲🇰', speakers: '2M', aliases: ['north macedonia', 'skopje'] },
  { code: 'bs', name: 'Bosnian', flag: '🇧🇦', speakers: '2.5M', aliases: ['bosnia', 'sarajevo'] },
]

export default function LanguagesPage() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return LANGUAGES
    const term = search.toLowerCase()
    return LANGUAGES.filter(lang =>
      lang.name.toLowerCase().includes(term) ||
      lang.aliases.some(a => a.includes(term))
    )
  }, [search])

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-sm"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

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

      {/* Search */}
      <section className="px-4 pb-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by language or country..."
              className="w-full pl-14 pr-14 py-5 rounded-2xl bg-white/5 border border-white/20 text-white text-lg placeholder-white/40 focus:outline-none focus:border-amber-500/50"
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
          <p className="text-center text-white/50 text-sm mt-3">
            {search ? `Found ${filtered.length} languages` : `All ${LANGUAGES.length} languages available`}
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
                onClick={() => setSearch('')}
                className="px-6 py-3 rounded-full bg-amber-500 text-black font-bold"
              >
                Show All
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map((lang) => (
                <div
                  key={lang.code}
                  className="relative p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <div className="text-5xl mb-3">{lang.flag}</div>
                  <h3 className="font-bold text-lg mb-1 text-white">{lang.name}</h3>
                  <p className="text-sm text-white/50">{lang.speakers} speakers</p>
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />
                  </div>
                </div>
              ))}
            </div>
          )}
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
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-lg"
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
    </div>
  )
}
