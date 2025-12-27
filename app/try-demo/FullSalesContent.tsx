'use client'

import React, { useEffect, useState } from 'react'
import { Sparkles, CheckCircle, Star, Shield, Clock, Zap, Users, TrendingUp, ArrowRight, MessageCircle, Target, Video, Lock, Verified, Check, Gift, Award, Flame } from 'lucide-react'
import Image from 'next/image'

const WHOP_CHECKOUT_LINK = 'https://whop.com/checkout/plan_7x5Kz1cflmrYH'

interface FullSalesContentProps {
  generatedVideo: string
}

export default function FullSalesContent({ generatedVideo }: FullSalesContentProps) {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    const sections = document.querySelectorAll('[data-animate]')
    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  const testimonials = [
    { name: 'Yasmin Al-Rashid', result: '15+ leads/week', text: "As a Dubai agent, I need to look premium. These AI videos make my listings look like million-dollar productions. Went from 2-3 leads to 15+ per week.", location: 'Dubai, UAE', avatar: '/images/Reviews/Review REA 3.webp' },
    { name: 'Dr. Raj Patel', result: '50x ROI', text: "Was spending £800/month on video production. Now I create better content myself in minutes. ROI was immediate.", location: 'London, UK', avatar: '/images/Reviews/Review REA 5.webp' },
    { name: 'Jennifer Kim', result: 'Sold $80K over asking', text: "My listing video got 47K views. Sold the property in 5 days for $80K over asking. This system pays for itself daily.", location: 'Vancouver, Canada', avatar: '/images/Reviews/Review REA 9.webp' },
    { name: 'Carlos Mendoza', result: '6 closings from social', text: "25 years selling homes and I wish I had this sooner. 6 closings last month from social media alone.", location: 'Los Angeles, CA', avatar: '/images/Reviews/Review REA 6.webp' },
    { name: 'Sofia Martinez', result: '4 leads in first week', text: "I was skeptical about AI videos, but this changed everything. Created my first video in 7 minutes - got 4 qualified leads that same week.", location: 'Miami, FL', avatar: '/images/Reviews/Review REA 1.webp' },
    { name: 'Marcus Williams', result: '$2.3M in closings', text: "After 15 years in real estate, I thought I'd seen it all. Closed $2.3M in listings last month - all from AI video leads.", location: 'Atlanta, GA', avatar: '/images/Reviews/Review REA 2.webp' },
  ]

  // Reusable CTA Button Component - Modern Glass Effect
  const CTAButton = ({ size = 'large', className = '' }: { size?: 'small' | 'large', className?: string }) => (
    <a
      href={WHOP_CHECKOUT_LINK}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-xl font-black text-violet-600 shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:shadow-white/50 active:scale-[0.98] ${
        size === 'large'
          ? 'px-6 py-4 text-base sm:px-12 sm:py-5 sm:text-xl gap-2 sm:gap-3'
          : 'px-5 py-3.5 text-sm sm:px-10 sm:py-4 sm:text-lg gap-2'
      } ${className}`}
      style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f7ff 50%, #ffffff 100%)' }}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <Sparkles className={`relative z-10 flex-shrink-0 ${size === 'large' ? 'h-5 w-5 sm:h-6 sm:w-6' : 'h-4 w-4 sm:h-5 sm:w-5'}`} />
      <span className="relative z-10">Get Instant Access - $37</span>
      <ArrowRight className={`relative z-10 flex-shrink-0 transition-transform group-hover:translate-x-1 ${size === 'large' ? 'h-5 w-5 sm:h-6 sm:w-6' : 'h-4 w-4 sm:h-5 sm:w-5'}`} />
    </a>
  )

  // Mini CTA Banner Component
  const CTABanner = ({ headline, subtext }: { headline: string, subtext: string }) => (
    <div className="mx-auto max-w-4xl px-4 py-4 sm:py-12">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 p-6 sm:rounded-3xl sm:p-8 shadow-2xl shadow-violet-500/20">
        {/* Animated background elements */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl animate-pulse" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-50" />

        <div className="relative z-10 text-center">
          <h3 className="mb-2 text-xl font-black text-white sm:text-2xl md:text-3xl">{headline}</h3>
          <p className="mb-5 text-sm text-white/80 sm:mb-6 sm:text-base">{subtext}</p>
          <CTAButton size="small" />
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-white/70 sm:text-sm">
            <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> 30-Day Guarantee</span>
            <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> Instant Access</span>
            <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="animate-fade-in -mx-3 sm:-mx-4 -mb-36 sm:-mb-12">
      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1: Video Result Hero
          ═══════════════════════════════════════════════════════════════ */}
      <section id="hero" data-animate className={`px-4 py-8 sm:py-20 transition-all duration-700 ${visibleSections.has('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="mx-auto max-w-4xl">
          {/* Success Badge */}
          <div className="mb-6 flex justify-center">
            <div className="animate-bounce-slow inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-2.5 text-white shadow-lg shadow-emerald-200">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-bold sm:text-base">Your AI Video is Ready!</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-4 text-center text-3xl font-black text-slate-900 sm:text-5xl md:text-6xl">
            Here's Your <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">AI Video</span>
          </h1>

          {/* Important Notice */}
          <div className="mx-auto mb-6 max-w-2xl rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 p-4 ring-1 ring-amber-200 sm:rounded-2xl sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-400 text-white sm:h-9 sm:w-9">
                <span className="text-lg font-black">!</span>
              </div>
              <div>
                <p className="text-sm font-bold text-amber-800 sm:text-base">This is just a quick sample.</p>
                <p className="mt-1 text-xs text-amber-700 sm:text-sm">
                  When you follow our step-by-step training, <span className="font-bold">your videos will be 10x better</span> — with your exact voice, perfect lighting, and pro-level quality. This demo barely scratches the surface of what you'll create.
                </p>
              </div>
            </div>
          </div>

          {/* Video Player */}
          <div className="relative mx-auto mb-8 max-w-sm overflow-hidden rounded-3xl bg-slate-900 shadow-2xl shadow-violet-300/30 ring-4 ring-violet-500/20 sm:max-w-md">
            <video
              src={generatedVideo}
              controls
              autoPlay
              playsInline
              className="aspect-[9/16] w-full bg-slate-900"
            />
            <div className="absolute bottom-4 left-4 rounded-xl bg-black/60 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm">
              Demo Version - Watermarked
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: First CTA - Upgrade Banner
          ═══════════════════════════════════════════════════════════════ */}
      <section id="cta1" data-animate className={`transition-all duration-700 delay-100 ${visibleSections.has('cta1') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <CTABanner
          headline="Want Unlimited Videos Without Watermark?"
          subtext="Create professional AI videos that generate leads 24/7 — unlock the full system now."
        />
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: Guarantee Section (Before Jessica)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="guarantee-top" data-animate className={`px-4 py-10 sm:py-16 transition-all duration-700 delay-150 ${visibleSections.has('guarantee-top') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-2xl shadow-violet-200/30 ring-1 ring-violet-100 sm:p-10">
            {/* Background decoration */}
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 blur-3xl" />

            <div className="relative z-10">
              {/* Header with Sara's Photo */}
              <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
                <div className="relative mb-4">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-emerald-500 shadow-xl shadow-emerald-200">
                    <Image src="/images/Sara-instructor.webp" alt="Sara" width={112} height={112} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="mb-2 text-2xl font-black text-slate-900 sm:text-3xl">
                  My Personal <span className="text-emerald-600">30-Day Guarantee</span>
                </h3>
                <p className="text-slate-600 max-w-lg">Your investment is 100% protected. No risk whatsoever.</p>
              </div>

              {/* The Promise */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-5 mb-6 ring-1 ring-emerald-200 sm:p-6">
                <p className="text-slate-700 text-base leading-relaxed text-center sm:text-lg">
                  "Try AgentClone for a <span className="font-black text-emerald-600">full 30 days</span>.
                  Go through the training. Create your AI videos. Use all the bonuses.
                  If at any point you decide this isn't for you — <span className="font-black text-slate-900">for ANY reason</span> — I'll personally refund every penny."
                </p>
                <p className="text-emerald-600 font-bold text-center mt-4">— Sara</p>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {[
                  { icon: Clock, title: '30 Days', sub: 'To try it all' },
                  { icon: MessageCircle, title: 'No Questions', sub: 'Easy refund' },
                  { icon: Zap, title: 'Fast Refund', sub: 'Within 24hrs' },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 text-center ring-1 ring-slate-100 shadow-lg">
                    <item.icon className="w-5 h-5 sm:w-7 sm:h-7 text-violet-600 mx-auto mb-1" />
                    <p className="text-slate-900 font-bold text-[10px] sm:text-sm leading-tight">{item.title}</p>
                    <p className="text-slate-500 text-[9px] sm:text-xs leading-tight">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4: Jessica Story
          ═══════════════════════════════════════════════════════════════ */}
      <section id="jessica" data-animate className={`px-4 py-10 sm:py-16 transition-all duration-700 delay-150 ${visibleSections.has('jessica') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-violet-700 shadow-lg ring-1 ring-violet-100 sm:text-base">
              <Star className="h-4 w-4 fill-violet-500 text-violet-500" />
              Real Results • Real Agent
            </div>
          </div>

          <h2 className="mb-2 text-center text-2xl font-black text-slate-900 sm:text-4xl md:text-5xl">
            This is Jessica. She Got <span className="text-violet-600">17 Buyer Leads</span>...
          </h2>
          <p className="mb-10 text-center text-lg text-slate-600 sm:text-xl">
            Without Recording a Single Video.
          </p>

          <div className="rounded-3xl bg-white p-6 shadow-2xl shadow-violet-200/30 ring-1 ring-violet-100 sm:p-10">
            <p className="mb-4 text-center text-sm text-slate-500">Yes, even if you see her talking on camera.</p>
            <h3 className="mb-4 text-center text-xl font-bold text-slate-900 sm:text-2xl">She Never Filmed Anything.</h3>
            <p className="mb-8 text-center text-slate-600">She just uploaded her photo, and the AI created a ready-to-post video for her.</p>

            {/* Video */}
            <div className="relative w-full mb-8 rounded-2xl overflow-hidden ring-2 ring-violet-200 shadow-2xl shadow-violet-100 bg-slate-900">
              <video autoPlay muted loop playsInline className="w-full h-auto block" poster="/images/jessica-collage-poster.webp">
                <source src="/videos/jessica-demo.mp4" type="video/mp4" />
              </video>
            </div>

            <div className="mb-8 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
                <Verified className="h-4 w-4" />
                Verified Story
              </div>
            </div>

            {/* Journey Stats */}
            <div className="mb-8">
              <p className="mb-4 text-center text-xs font-bold uppercase tracking-wider text-slate-400">The Journey</p>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="rounded-2xl bg-slate-50 p-4 text-center ring-1 ring-slate-100">
                  <p className="text-xs text-slate-500">Video 1</p>
                  <p className="text-2xl font-black text-slate-900 sm:text-3xl">2,700</p>
                  <p className="text-xs text-slate-500">views</p>
                </div>
                <div className="rounded-2xl bg-violet-50 p-4 text-center ring-1 ring-violet-100">
                  <p className="text-xs text-violet-500">Video 2</p>
                  <p className="text-2xl font-black text-violet-600 sm:text-3xl">19,000</p>
                  <p className="text-xs text-violet-500">views</p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 p-4 text-center text-white shadow-lg shadow-violet-200">
                  <p className="text-xs text-white/80">Video 3</p>
                  <p className="text-2xl font-black sm:text-3xl">220,000</p>
                  <p className="text-xs text-white/80">views</p>
                </div>
              </div>
            </div>

            <div className="mb-8 text-center">
              <p className="text-slate-600">The third one shocked her. It reached <span className="font-bold text-violet-600">220,000 views in 24 hours</span>...</p>
              <p className="text-lg font-bold text-violet-600">And later grew to 1.2 MILLION.</p>
            </div>

            {/* Results */}
            <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 p-6 ring-1 ring-violet-100">
              <p className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-violet-500">The Results</p>
              <p className="mb-4 text-center text-sm text-slate-600">She ended up closing deals she never imagined:</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-black text-violet-600 sm:text-4xl">17</p>
                  <p className="text-xs text-slate-500">Buyer Leads</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-violet-600 sm:text-4xl">2</p>
                  <p className="text-xs text-slate-500">Closings</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-emerald-500 sm:text-4xl">$18.4K</p>
                  <p className="text-xs text-slate-500">Commissions</p>
                </div>
              </div>
              <p className="mt-4 text-center text-sm font-semibold text-violet-600">All from videos she didn't even film.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5: Second CTA
          ═══════════════════════════════════════════════════════════════ */}
      <section id="cta2" data-animate className={`transition-all duration-700 delay-100 ${visibleSections.has('cta2') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <CTABanner
          headline="Ready to Get Results Like Jessica?"
          subtext="Join 847+ agents who are generating leads on autopilot with AI videos."
        />
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6: What You Get + Bonuses
          ═══════════════════════════════════════════════════════════════ */}
      <section id="bonuses" data-animate className={`px-4 py-10 sm:py-16 transition-all duration-700 delay-100 ${visibleSections.has('bonuses') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-2 text-center text-2xl font-black text-slate-900 sm:text-4xl md:text-5xl">
            Here's What You Get <span className="text-violet-600">Today</span>
          </h2>
          <p className="mb-10 text-center text-base text-slate-600 sm:text-lg">
            Everything you need to start generating leads with AI videos
          </p>

          {/* MAIN PRODUCT CARD */}
          <div className="relative mb-8 overflow-hidden rounded-3xl bg-white p-6 shadow-2xl shadow-violet-200/30 ring-2 ring-violet-200 sm:p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/80 via-white to-indigo-50/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-100/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />

            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg shadow-violet-200">
                  Core System
                </span>
                <span className="text-slate-400 line-through">$697</span>
                <span className="text-violet-600 font-black text-lg">INCLUDED</span>
              </div>

              <div className="relative mb-6 rounded-2xl overflow-hidden shadow-xl ring-1 ring-violet-200">
                <div className="relative w-full aspect-video">
                  <Image src="/images/vd-course-thumbnail.webp" alt="AgentClone 7-Minute Video System" fill className="object-cover" />
                </div>
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-3 sm:text-3xl">AgentClone 7-Minute Video System</h3>
              <p className="text-slate-600 mb-5">Even if you've never touched AI before — follow along and create your first talking video today.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {['Turn any photo into a talking AI video', 'Clone your voice in ANY language', 'Put yourself anywhere — beaches, offices, luxury homes', 'Ready-to-use AI scriptwriter', 'Every prompt you need — just copy & paste', 'Edit videos on your phone in minutes'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl px-4 py-3 ring-1 ring-violet-100">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-slate-700 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BONUSES HEADER */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-green-100 border border-emerald-300 px-6 py-3 rounded-full mb-3 shadow-lg shadow-emerald-100/50">
              <Gift className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-700 font-black uppercase tracking-wide">Premium Bonuses</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 sm:text-3xl">
              Plus <span className="text-emerald-600">$505</span> in Exclusive Bonuses
            </h3>
          </div>

          {/* BONUS CARDS */}
          <div className="space-y-4">
            {/* Bonus 1: Organic Leads Mastery */}
            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-xl shadow-emerald-100/50 ring-1 ring-emerald-200/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400" />
              <div className="relative z-10 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="sm:w-1/3 flex-shrink-0">
                    <div className="relative rounded-xl overflow-hidden shadow-lg ring-1 ring-emerald-200">
                      <Image src="/products/organic-leads-mastery.webp" alt="Organic Leads Mastery" width={400} height={240} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute top-2 right-2">
                        <span className="bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-black text-[9px] px-2 py-1 rounded-full shadow-lg uppercase">Most Valuable</span>
                      </div>
                    </div>
                  </div>
                  <div className="sm:w-2/3">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider">Bonus #1</span>
                      <span className="text-slate-400 line-through text-xs">$197</span>
                      <span className="bg-emerald-100 text-emerald-700 font-black text-[10px] px-2 py-0.5 rounded-full">FREE</span>
                    </div>
                    <h4 className="text-base font-black text-slate-900 mb-1 sm:text-xl">Organic Leads Mastery</h4>
                    <p className="text-emerald-600 font-medium text-xs sm:text-sm mb-3">Get Free Buyer Leads from Instagram & TikTok</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Viral Content Formula', '$0 Ad Spend', 'DM Pipeline', '30-Day Calendar'].map((feature, i) => (
                        <span key={i} className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] sm:text-xs font-medium px-2 py-1 rounded-lg ring-1 ring-emerald-200">
                          <CheckCircle className="w-3 h-3" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bonus 2: The Script Vault */}
            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-xl shadow-amber-100/50 ring-1 ring-amber-200/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-400" />
              <div className="relative z-10 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="sm:w-1/3 flex-shrink-0">
                    <div className="relative rounded-xl overflow-hidden shadow-lg ring-1 ring-amber-200">
                      <Image src="/products/script-vault.webp" alt="The Script Vault" width={400} height={240} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute top-2 right-2">
                        <span className="bg-gradient-to-r from-amber-500 to-amber-400 text-white font-black text-[9px] px-2 py-1 rounded-full shadow-lg uppercase">Fan Favorite</span>
                      </div>
                    </div>
                  </div>
                  <div className="sm:w-2/3">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-amber-600 font-bold text-xs uppercase tracking-wider">Bonus #2</span>
                      <span className="text-slate-400 line-through text-xs">$97</span>
                      <span className="bg-amber-100 text-amber-700 font-black text-[10px] px-2 py-0.5 rounded-full">FREE</span>
                    </div>
                    <h4 className="text-base font-black text-slate-900 mb-1 sm:text-xl">The Script Vault</h4>
                    <p className="text-amber-600 font-medium text-xs sm:text-sm mb-3">100+ Viral Hooks, Scripts & Captions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['45 Hooks', '30 Scripts', '25 Captions', 'Organized'].map((feature, i) => (
                        <span key={i} className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] sm:text-xs font-medium px-2 py-1 rounded-lg ring-1 ring-amber-200">
                          <CheckCircle className="w-3 h-3" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bonus 3: AI Real Estate Mentor */}
            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-xl shadow-violet-100/50 ring-1 ring-violet-200/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-violet-400" />
              <div className="relative z-10 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="sm:w-1/3 flex-shrink-0">
                    <div className="relative rounded-xl overflow-hidden shadow-lg ring-1 ring-violet-200">
                      <Image src="/products/ai-real-estate-mentor.webp" alt="AI Real Estate Mentor" width={400} height={240} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute top-2 right-2">
                        <span className="bg-gradient-to-r from-violet-500 to-violet-400 text-white font-black text-[9px] px-2 py-1 rounded-full shadow-lg uppercase">AI-Powered</span>
                      </div>
                    </div>
                  </div>
                  <div className="sm:w-2/3">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-violet-600 font-bold text-xs uppercase tracking-wider">Bonus #3</span>
                      <span className="text-slate-400 line-through text-xs">$97</span>
                      <span className="bg-violet-100 text-violet-700 font-black text-[10px] px-2 py-0.5 rounded-full">FREE</span>
                    </div>
                    <h4 className="text-base font-black text-slate-900 mb-1 sm:text-xl">AI Real Estate Mentor</h4>
                    <p className="text-violet-600 font-medium text-xs sm:text-sm mb-3">Your 24/7 Expert Coach</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Instant Answers', 'Pricing Tactics', 'Content Ideas', '24/7 Access'].map((feature, i) => (
                        <span key={i} className="inline-flex items-center gap-1 bg-violet-50 text-violet-700 text-[10px] sm:text-xs font-medium px-2 py-1 rounded-lg ring-1 ring-violet-200">
                          <CheckCircle className="w-3 h-3" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bonus 4: DM-to-Deal System */}
            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-xl shadow-pink-100/50 ring-1 ring-pink-200/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-pink-400" />
              <div className="relative z-10 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="sm:w-1/3 flex-shrink-0">
                    <div className="relative rounded-xl overflow-hidden shadow-lg ring-1 ring-pink-200">
                      <Image src="/products/dm-to-deal-system.webp" alt="DM-to-Deal System" width={400} height={240} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute top-2 right-2">
                        <span className="bg-gradient-to-r from-pink-500 to-pink-400 text-white font-black text-[9px] px-2 py-1 rounded-full shadow-lg uppercase">40%+ Response</span>
                      </div>
                    </div>
                  </div>
                  <div className="sm:w-2/3">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-pink-600 font-bold text-xs uppercase tracking-wider">Bonus #4</span>
                      <span className="text-slate-400 line-through text-xs">$67</span>
                      <span className="bg-pink-100 text-pink-700 font-black text-[10px] px-2 py-0.5 rounded-full">FREE</span>
                    </div>
                    <h4 className="text-base font-black text-slate-900 mb-1 sm:text-xl">DM-to-Deal System</h4>
                    <p className="text-pink-600 font-medium text-xs sm:text-sm mb-3">89 Copy-Paste Messages</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['First Message', 'Follow-ups', 'Objections', 'Appointments'].map((feature, i) => (
                        <span key={i} className="inline-flex items-center gap-1 bg-pink-50 text-pink-700 text-[10px] sm:text-xs font-medium px-2 py-1 rounded-lg ring-1 ring-pink-200">
                          <CheckCircle className="w-3 h-3" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bonus 5: 90-Day Authority Accelerator */}
            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-xl shadow-indigo-100/50 ring-1 ring-indigo-200/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-400" />
              <div className="relative z-10 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="sm:w-1/3 flex-shrink-0">
                    <div className="relative rounded-xl overflow-hidden shadow-lg ring-1 ring-indigo-200">
                      <Image src="/products/90-day-authority-accelerator.webp" alt="90-Day Authority Accelerator" width={400} height={240} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute top-2 right-2">
                        <span className="bg-gradient-to-r from-indigo-500 to-indigo-400 text-white font-black text-[9px] px-2 py-1 rounded-full shadow-lg uppercase">Done For You</span>
                      </div>
                    </div>
                  </div>
                  <div className="sm:w-2/3">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-indigo-600 font-bold text-xs uppercase tracking-wider">Bonus #5</span>
                      <span className="text-slate-400 line-through text-xs">$47</span>
                      <span className="bg-indigo-100 text-indigo-700 font-black text-[10px] px-2 py-0.5 rounded-full">FREE</span>
                    </div>
                    <h4 className="text-base font-black text-slate-900 mb-1 sm:text-xl">90-Day Authority Accelerator</h4>
                    <p className="text-indigo-600 font-medium text-xs sm:text-sm mb-3">Become THE Agent in Your Market</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Action Plan', 'Content Calendar', 'Brand Guide', 'Authority Tactics'].map((feature, i) => (
                        <span key={i} className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-[10px] sm:text-xs font-medium px-2 py-1 rounded-lg ring-1 ring-indigo-200">
                          <CheckCircle className="w-3 h-3" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Value Card */}
          <div className="mt-8 relative overflow-hidden rounded-3xl bg-white p-6 shadow-2xl shadow-violet-200/30 ring-2 ring-violet-300 sm:p-10">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-100/80 via-white to-indigo-100/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-100/30 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />

            <div className="relative z-10 text-center">
              <p className="mb-2 text-sm text-violet-600 font-semibold">Here's Everything You Get Today</p>
              <div className="space-y-1 mb-6 max-w-md mx-auto">
                {[
                  { name: 'AgentClone 7-Minute Video System', value: '$697' },
                  { name: 'Organic Leads Mastery', value: '$197' },
                  { name: 'The Script Vault (100+ Scripts)', value: '$97' },
                  { name: 'AI Real Estate Mentor (24/7)', value: '$97' },
                  { name: 'DM-to-Deal System (89 Scripts)', value: '$67' },
                  { name: '90-Day Authority Accelerator', value: '$47' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-violet-200/50">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-violet-500 flex-shrink-0" />
                      <span className="text-slate-700">{item.name}</span>
                    </div>
                    <span className="text-slate-500">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center items-center gap-2 mb-3">
                <span className="text-slate-900 font-black text-lg">Total Value:</span>
                <span className="text-slate-400 line-through text-xl">$1,202</span>
              </div>
              <p className="text-violet-600 font-bold mb-1">Get Everything For Just</p>
              <p className="text-6xl font-black bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-2 sm:text-7xl">$37</p>
              <p className="text-emerald-600 font-bold mb-6">Save $1,165 (97% off)</p>

              <CTAButton size="large" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 7: Testimonials (Real Agents. Real Results.)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="testimonials" data-animate className={`px-4 py-10 sm:py-16 transition-all duration-700 delay-200 ${visibleSections.has('testimonials') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-violet-700 shadow-lg ring-1 ring-violet-100">
              <Award className="h-4 w-4 text-violet-500" />
              Success Stories
            </div>
          </div>

          <h2 className="mb-2 text-center text-2xl font-black text-slate-900 sm:text-4xl">
            Real Agents. <span className="text-violet-600">Real Results.</span>
          </h2>
          <p className="mb-10 text-center text-base text-slate-600 sm:text-lg">
            847+ agents already seeing results • 40+ countries
          </p>

          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <div key={i} className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white p-4 shadow-xl shadow-violet-100/30 ring-1 ring-violet-100 transition-all duration-300 hover:shadow-2xl hover:ring-violet-200 hover:-translate-y-1 sm:p-6">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="mb-2 sm:mb-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-bold text-violet-700 ring-1 ring-violet-200">
                  <TrendingUp className="h-3 w-3" />
                  {t.result}
                </div>

                <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-slate-600 leading-relaxed">"{t.text}"</p>

                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 overflow-hidden rounded-full ring-2 ring-violet-200 shadow-md flex-shrink-0">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{t.name}</p>
                      <Verified className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-violet-500 flex-shrink-0" />
                    </div>
                    <p className="text-[10px] sm:text-xs text-slate-500">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 9: Before You Decide - Important Questions
          ═══════════════════════════════════════════════════════════════ */}
      <section id="questions" data-animate className={`px-4 py-10 sm:py-16 transition-all duration-700 delay-100 ${visibleSections.has('questions') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 px-4 py-2 text-sm font-semibold text-violet-700 shadow-lg ring-1 ring-violet-200">
              <MessageCircle className="h-4 w-4" />
              Before You Decide
            </div>
          </div>

          <h2 className="mb-3 text-center text-2xl font-black text-slate-900 sm:text-4xl">
            Questions You Might Be <span className="text-violet-600">Asking Yourself</span>
          </h2>
          <p className="mb-8 text-center text-sm text-slate-600 sm:text-base sm:mb-10">
            Here's what other agents asked before joining — answered honestly.
          </p>

          <div className="space-y-4">
            {/* Question 1: Monthly Subscription */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-xl ring-1 ring-violet-100 transition-all hover:shadow-2xl hover:ring-violet-200 sm:p-6">
              <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-emerald-500 to-green-500" />
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-200 sm:h-12 sm:w-12">
                  <span className="text-lg font-black sm:text-xl">$</span>
                </div>
                <div>
                  <h3 className="mb-2 text-base font-black text-slate-900 sm:text-lg">"Is there a monthly subscription?"</h3>
                  <div className="rounded-xl bg-emerald-50 p-3 ring-1 ring-emerald-200 sm:p-4">
                    <p className="text-sm text-slate-700 sm:text-base">
                      <span className="font-black text-emerald-600">No. You pay once — you own it forever.</span> This is lifetime access with free monthly updates. No hidden fees, no recurring charges, no surprises. One payment of $37 and you're in for life.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Question 2: Cost Per Video */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-xl ring-1 ring-violet-100 transition-all hover:shadow-2xl hover:ring-violet-200 sm:p-6">
              <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-violet-500 to-indigo-500" />
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-200 sm:h-12 sm:w-12">
                  <Video className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h3 className="mb-2 text-base font-black text-slate-900 sm:text-lg">"How much does each video cost to make?"</h3>
                  <div className="rounded-xl bg-violet-50 p-3 ring-1 ring-violet-200 sm:p-4">
                    <p className="text-sm text-slate-700 sm:text-base">
                      <span className="font-black text-violet-600">About $1 per 1-minute video. Basically free.</span> Compare that to hiring a videographer ($500+), paying for ads ($1000s/month), or your time spent filming for hours. For less than your morning coffee, you create content that generates leads 24/7.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Question 3: Realism Level */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-xl ring-1 ring-violet-100 transition-all hover:shadow-2xl hover:ring-violet-200 sm:p-6">
              <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-amber-500 to-yellow-500" />
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-200 sm:h-12 sm:w-12">
                  <Star className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h3 className="mb-2 text-base font-black text-slate-900 sm:text-lg">"Can I achieve the same realistic quality as your videos?"</h3>
                  <div className="rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200 sm:p-4">
                    <p className="text-sm text-slate-700 sm:text-base">
                      <span className="font-black text-amber-600">Yes — and probably even better.</span> Inside the course, I share every tool, every setting, every prompt I personally use. Plus, I've documented every mistake I made (so you don't waste money learning the hard way). Follow the training step-by-step and you'll match or exceed my results.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Question 4: For Real Estate Only */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-xl ring-1 ring-violet-100 transition-all hover:shadow-2xl hover:ring-violet-200 sm:p-6">
              <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-rose-500 to-pink-500" />
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-200 sm:h-12 sm:w-12">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h3 className="mb-2 text-base font-black text-slate-900 sm:text-lg">"Does this work only for real estate agents?"</h3>
                  <div className="rounded-xl bg-rose-50 p-3 ring-1 ring-rose-200 sm:p-4">
                    <p className="text-sm text-slate-700 sm:text-base">
                      <span className="font-black text-rose-600">The AI technology works for anyone — but this program is made specifically for real estate agents.</span> The scripts, strategies, bonuses, and training are all tailored for real estate success. If you're not a real estate agent, it might still work for you, but I don't recommend buying it.
                    </p>
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-rose-100 px-3 py-2 ring-1 ring-rose-300">
                      <Shield className="h-4 w-4 text-rose-600 flex-shrink-0" />
                      <p className="text-xs font-semibold text-rose-700 sm:text-sm">Important: We do not offer our 30-day guarantee to non-real estate agents.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 10: Fourth CTA
          ═══════════════════════════════════════════════════════════════ */}
      <section id="cta4" data-animate className={`transition-all duration-700 delay-100 ${visibleSections.has('cta4') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <CTABanner
          headline="Join 847+ Agents Getting Leads Daily"
          subtext="The same system that helped Jessica get 17 leads is waiting for you."
        />
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 11: Who Am I
          ═══════════════════════════════════════════════════════════════ */}
      <section id="whoami" data-animate className={`px-4 py-10 sm:py-16 transition-all duration-700 delay-100 ${visibleSections.has('whoami') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-violet-700 shadow-lg ring-1 ring-violet-100">
              <Users className="h-4 w-4" />
              Meet Your Instructor
            </div>
          </div>

          <h2 className="mb-10 text-center text-2xl font-black text-slate-900 sm:text-4xl">
            Who Am I & <span className="text-violet-600">Why Should You Listen?</span>
          </h2>

          <div className="grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-10">
            <div className="relative mx-auto w-full">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-100 to-indigo-100 shadow-2xl shadow-violet-200/50 ring-2 ring-violet-200">
                <Image src="/images/Sara-instructor.webp" alt="Sara - Your Instructor" width={1365} height={768} className="w-full h-auto" />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                  <Verified className="h-4 w-4" />
                  Verified Expert
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { title: 'I Was You', text: '8 years grinding as a luxury agent in Dubai. $127M+ in sales. But I was exhausted. Filming content felt like a second job.' },
                { title: 'Then I Found AI Video', text: 'One photo. 50 videos. In minutes. My social media exploded. More leads. More listings. More commissions.' },
                { title: "Now I'm Sharing Everything", text: '847+ agents have joined. The results speak for themselves. This is the exact system I use daily.' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 ring-1 ring-violet-100 shadow-lg">
                  <h3 className="mb-2 text-lg font-bold text-violet-600">{item.title}</h3>
                  <p className="text-slate-600">{item.text}</p>
                </div>
              ))}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 p-3 sm:p-4 ring-1 ring-violet-200">
                {[
                  { num: '$127M+', label: 'Sales' },
                  { num: '8 Years', label: 'Experience' },
                  { num: '847+', label: 'Agents' },
                  { num: '4.9/5', label: 'Rating' },
                ].map((stat, i) => (
                  <div key={i} className="text-center py-1">
                    <p className="text-base font-black text-violet-600 sm:text-xl">{stat.num}</p>
                    <p className="text-[9px] text-slate-500 sm:text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 12: Final CTA - Modern Design
          ═══════════════════════════════════════════════════════════════ */}
      <section id="final-cta" data-animate className={`px-4 py-10 sm:py-20 transition-all duration-700 delay-150 ${visibleSections.has('final-cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="mx-auto max-w-5xl">
          {/* Main Card */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 shadow-2xl sm:p-12 md:p-16">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-indigo-600/20" />
            {/* Animated gradient orbs */}
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-500/30 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-500/30 blur-3xl" />
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

            <div className="relative z-10">
              {/* Top badge */}
              <div className="mb-6 flex justify-center sm:mb-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 px-4 py-2 text-sm font-bold text-amber-300 ring-1 ring-amber-500/30 backdrop-blur-sm">
                  <Flame className="h-4 w-4" />
                  Limited Time — 97% Off
                </div>
              </div>

              {/* Main content - Two columns on desktop */}
              <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
                {/* Left side - Text */}
                <div className="text-center lg:text-left">
                  <h2 className="mb-4 text-3xl font-black text-white sm:text-4xl md:text-5xl leading-tight">
                    Stop Chasing Leads.
                    <span className="block bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">Start Attracting Them.</span>
                  </h2>
                  <p className="mb-6 text-base text-slate-400 sm:text-lg max-w-xl mx-auto lg:mx-0">
                    Join 847+ agents who are generating qualified buyer leads on autopilot — no cold calling, no door knocking, no expensive ads.
                  </p>

                  {/* Trust indicators */}
                  <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400 ring-2 ring-slate-900" />
                        ))}
                      </div>
                      <span className="text-sm text-slate-400">847+ agents</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                      <span className="text-sm text-slate-400 ml-1">4.9/5</span>
                    </div>
                  </div>
                </div>

                {/* Right side - Pricing card */}
                <div className="relative">
                  <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
                    {/* Card header */}
                    <div className="mb-4 text-center">
                      <p className="text-sm font-medium text-slate-500">Everything included</p>
                      <div className="mt-2 flex items-center justify-center gap-3">
                        <span className="text-2xl font-bold text-slate-300 line-through">$1,202</span>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-600">SAVE 97%</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-6 text-center">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-2xl font-bold text-slate-600">$</span>
                        <span className="text-6xl font-black text-slate-900 sm:text-7xl">37</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">one-time payment</p>
                    </div>

                    {/* CTA Button */}
                    <a
                      href={WHOP_CHECKOUT_LINK}
                      className="group relative mb-4 flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 text-lg font-black text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                      <Sparkles className="relative z-10 h-5 w-5" />
                      <span className="relative z-10">Get Instant Access</span>
                      <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </a>

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Lock className="h-3.5 w-3.5" /> Secure</span>
                      <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> 30-Day Guarantee</span>
                    </div>

                    {/* What's included mini list */}
                    <div className="mt-6 border-t border-slate-100 pt-4">
                      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Includes:</p>
                      <div className="space-y-2">
                        {['7-Minute Video System', '5 Premium Bonuses', 'Lifetime Access', 'Free Updates'].map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-violet-100 bg-white/80 backdrop-blur-sm py-8">
        <div className="mx-auto max-w-4xl px-4 text-center text-sm text-slate-500">
          <p className="mb-2">© 2024 AgentClone. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/privacy-policy" className="hover:text-violet-600 transition-colors">Privacy Policy</a>
            <a href="/terms-of-service" className="hover:text-violet-600 transition-colors">Terms of Service</a>
            <a href="/refund-policy" className="hover:text-violet-600 transition-colors">Refund Policy</a>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════
          ANIMATIONS
          ═══════════════════════════════════════════════════════════════ */}
      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-bounce-slow { animation: bounce-slow 2.5s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 20s linear infinite; }
      `}</style>
    </div>
  )
}
