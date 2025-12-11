'use client'

import Image from 'next/image'
import { Award, CheckCircle, Globe, Users, Sparkles } from 'lucide-react'

export interface ExpertPersonaProps {
  name: string
  title: string
  credentials: string
  imageUrl?: string
  positioningStatement: string
  bulletPoints: string[]
  philosophy: string
  trustElement: string
  stats?: {
    value: string
    label: string
  }[]
  accentColor?: 'teal' | 'gold'
}

// Default expert data for Dr. Alexander Voss
export const DR_VOSS_DATA: ExpertPersonaProps = {
  name: 'Dr. Alexander Voss',
  title: 'Aesthetic and Restorative Dentistry Specialist',
  credentials: 'DDS, MClinDent',
  imageUrl: '/images/dentist/dr-voss.webp',
  positioningStatement: 'For 12 years, I spent $2,000-3,000/month on marketing. Got 4-6 new cosmetic patients monthly. Hired videographers at $500/video. Then I built this AI system for my own practice. Now I get 25+ new patient inquiries monthly, spend $0 on marketing, and my schedule is booked 2-3 months out. I\'m teaching 500+ dentists how to do the same.',
  bulletPoints: [
    'Built this for my OWN practice first — I use it daily',
    'Went from 4-6 new patients/month to 25+ inquiries/month',
    'Cut marketing costs from $2,500/month to $0 (organic only)',
    'Cosmetic cases increased from 40% to 65% of practice revenue',
    'Now helping 500+ dentists across 15+ countries replicate results',
  ],
  philosophy: 'I created this system because I was YOU. Spending thousands on marketing, getting minimal results, watching younger dentists on TikTok fill their schedules. Patients don\'t care about your clinical terminology — they want to see results and feel confident. This framework bridges that gap with simple AI videos that build trust and fill your chairs. If it didn\'t work for me personally, I wouldn\'t be teaching it.',
  trustElement: 'My practice went from 2-3 consults/week to 8-10/week after using this system',
  stats: [
    { value: '12+', label: 'Years Clinical' },
    { value: '$0', label: 'Marketing Now' },
    { value: '500+', label: 'Dentists Taught' },
    { value: '25+', label: 'Leads/Month' },
  ],
  accentColor: 'teal',
}

export function ExpertPersona({
  name,
  title,
  credentials,
  imageUrl,
  positioningStatement,
  bulletPoints,
  philosophy,
  trustElement,
  stats,
  accentColor = 'teal',
}: ExpertPersonaProps) {
  const colorClasses = {
    teal: {
      badge: 'bg-teal-500/10 border-teal-500/30 text-teal-600',
      accent: 'text-teal-500',
      border: 'border-teal-500/50',
      stat: 'text-teal-500',
      icon: 'text-teal-500',
      ring: 'ring-teal-500/30',
    },
    gold: {
      badge: 'bg-amber-500/10 border-amber-500/30 text-amber-600',
      accent: 'text-amber-500',
      border: 'border-amber-500/50',
      stat: 'text-amber-500',
      icon: 'text-amber-500',
      ring: 'ring-amber-500/30',
    },
  }

  const colors = colorClasses[accentColor]

  return (
    <article className="w-full" itemScope itemType="https://schema.org/Person">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 items-start">
        {/* Expert Image */}
        <div className="relative">
          <div className={`relative aspect-[3/4] max-w-[200px] sm:max-w-sm mx-auto rounded-xl sm:rounded-2xl overflow-hidden border-3 sm:border-4 ${colors.border} shadow-2xl`}>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`${name} - ${title}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <Users className="w-16 h-16 sm:w-24 sm:h-24 text-gray-600" />
              </div>
            )}
            <div className={`absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-gradient-to-r from-${accentColor}-500 to-${accentColor === 'teal' ? 'cyan' : 'amber'}-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-bold text-xs sm:text-sm shadow-lg`}>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Verified Expert
              </span>
            </div>
          </div>

          {/* Trust Element - Below image on mobile */}
          <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200 text-center lg:hidden">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Globe className={`w-4 h-4 ${colors.icon}`} />
              <span>{trustElement}</span>
            </div>
          </div>
        </div>

        {/* Expert Details */}
        <div className="space-y-4 sm:space-y-5">
          {/* Name & Title */}
          <div>
            <h3 className={`${colors.accent} font-black text-2xl sm:text-3xl mb-1`} itemProp="name">
              {name}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base font-medium" itemProp="jobTitle">
              {title}
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5" itemProp="honorificSuffix">
              {credentials}
            </p>
          </div>

          {/* Positioning Statement */}
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed border-l-3 border-gray-200 pl-4" itemProp="description">
            {positioningStatement}
          </p>

          {/* Authority Bullet Points */}
          <div className="space-y-2">
            {bulletPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
                <span className="text-gray-600 text-sm sm:text-base">{point}</span>
              </div>
            ))}
          </div>

          {/* Philosophy Section */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-100">
            <h4 className={`${colors.accent} font-bold text-sm sm:text-base mb-2 flex items-center gap-2`}>
              <Award className="w-4 h-4" />
              Why I Created This
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed italic">
              "{philosophy}"
            </p>
          </div>

          {/* Trust Element - Desktop only */}
          <div className="hidden lg:block p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe className={`w-4 h-4 ${colors.icon}`} />
              <span>{trustElement}</span>
            </div>
          </div>

          {/* Stats Grid */}
          {stats && stats.length > 0 && (
            <div className="grid grid-cols-4 gap-2 sm:gap-3 pt-2">
              {stats.map((stat, i) => (
                <div key={i} className="bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-4 text-center border border-gray-200">
                  <div className={`${colors.stat} font-black text-sm sm:text-xl`}>{stat.value}</div>
                  <div className="text-gray-500 text-[10px] sm:text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SEO-friendly hidden description */}
      <meta itemProp="knowsAbout" content="Smile design, veneers, dental implants, full mouth rehabilitation, Invisalign, cosmetic dentistry" />
    </article>
  )
}

// Compact inline mention component for use in other sections
export function ExpertMention({
  name = 'Dr. Alexander Voss',
  credentials = 'DDS, MClinDent',
  variant = 'inline'
}: {
  name?: string
  credentials?: string
  variant?: 'inline' | 'badge'
}) {
  if (variant === 'badge') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/30 px-2.5 py-1 rounded-full text-xs sm:text-sm">
        <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-500" />
        <span className="text-teal-600 font-medium">
          Clinically designed by {name}, {credentials}
        </span>
      </span>
    )
  }

  return (
    <span className="text-teal-600 font-medium">
      {name}, {credentials}
    </span>
  )
}

export default ExpertPersona
