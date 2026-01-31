'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Lock, CheckCircle, Copy, Check, Play, Sparkles, Home, Gift,
  HelpCircle, ChevronRight, Zap, MessageCircle, ExternalLink,
  Download, ChevronLeft, Video, PartyPopper, Clock,
  ArrowRight, Star, Trophy, Flame, Target, Crown, X, Users, Shield
} from 'lucide-react'
import Image from 'next/image'

// Product data with UNIQUE images - images are in /images/products/
const MAIN_COURSE = {
  title: "AI Video Mastery",
  items: [
    { id: 'register', name: 'Register Account', type: 'pdf', file: '/products/register-here.pdf', duration: '2 min', image: '/images/products/chatgpt-mentor.webp', description: 'Create your HeyGen account' },
    { id: 'prompt-guide', name: 'Prompt Mastery Guide', type: 'pdf', file: '/products/prompt-guide.pdf', duration: '5 min', image: '/images/products/personal-brand.webp', description: 'Learn to write perfect prompts' },
    { id: 'video-1', name: 'Core Training', type: 'video', file: '/products/training-video-1.mov', duration: '12 min', image: '/images/products/brand-kit.webp', description: 'Step-by-step video creation' },
    { id: 'video-2', name: 'Advanced Tips', type: 'video', file: '/products/training-video-2.mov', duration: '8 min', image: '/images/products/hooks-impossible-to-skip.webp', description: 'Pro techniques & shortcuts' },
    { id: 'template-1', name: 'Script Template A', type: 'doc', file: '/products/prompt-template-1.rtf', duration: '1 min', image: '/images/products/instagram-dm-scripts.webp', description: 'Copy-paste video scripts' },
    { id: 'template-2', name: 'Script Template B', type: 'doc', file: '/products/prompt-template-2.rtf', duration: '1 min', image: '/images/products/instagram-stories.webp', description: 'More ready-to-use scripts' },
  ]
}

const BONUSES = [
  { id: 'marcus-gpt', name: 'Marcus AI Mentor', type: 'link', url: 'https://chatgpt.com/g/g-6923615c25948191a95562d0181d1ee3-real-estate-mentor-marcus-rodriguez', image: '/images/products/chatgpt-mentor.webp', cat: 'tool', description: 'Your 24/7 AI coach' },
  { id: 'dm-scripts', name: '89 DM Scripts', type: 'pdf', file: '/products/89-dm-scripts.pdf', image: '/images/products/instagram-dm-scripts.webp', cat: 'tool', description: 'Ready-to-send messages' },
  { id: 'hooks', name: '45 Viral Hooks', type: 'pdf', file: '/products/17-hooks.pdf', image: '/images/products/hooks-impossible-to-skip.webp', cat: 'tool', description: 'Scroll-stopping openers' },
  { id: 'reels', name: '25 Reel Templates', type: 'pdf', file: '/products/reels-templates.pdf', image: '/images/products/viral-reels.webp', cat: 'template', description: 'Trending reel formats' },
  { id: 'stories', name: '327 Story Ideas', type: 'pdf', file: '/products/stories-posts-templates.pdf', image: '/images/products/instagram-stories.webp', cat: 'template', description: 'Never run out of content' },
  { id: 'funny-posts', name: '30 Funny Posts', type: 'pdf', file: '/products/30-funny-posts.pdf', image: '/images/products/funny-posts.webp', cat: 'template', description: 'Engagement boosters' },
  { id: 'signature', name: 'Pro Email Signature', type: 'pdf', file: '/products/professional-signature.pdf', image: '/images/products/email-signature-professional.webp', cat: 'template', description: 'Look professional instantly' },
  { id: 'masterclass', name: '$10M Brand Secrets', type: 'pdf', file: '/products/personal-brand-masterclass.pdf', image: '/images/products/personal-brand.webp', cat: 'training', description: 'Build your personal brand' },
  { id: 'planner', name: '2026 Business Planner', type: 'pdf', file: '/products/business-planner-1.pdf', image: '/images/products/business-planner.webp', cat: 'training', description: 'Plan your success' },
  { id: 'edit-video', name: 'Edit Videos Fast', type: 'video', file: '/products/edit-video-20min.mp4', image: '/images/products/brand-kit.webp', cat: 'training', description: '20-minute editing course' },
]

// Confetti Component - Light Theme Colors
function Confetti({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[400] overflow-hidden">
      {[...Array(60)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-20px',
            width: `${6 + Math.random() * 10}px`,
            height: `${6 + Math.random() * 10}px`,
            backgroundColor: ['#8b5cf6', '#6366f1', '#10b981', '#22d3ee', '#ec4899', '#f59e0b'][Math.floor(Math.random() * 6)],
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2.5 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function MembersPage() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [activeTab, setActiveTab] = useState<'home' | 'course' | 'bonuses' | 'help'>('home')
  const [downloaded, setDownloaded] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [viewer, setViewer] = useState<{ type: 'pdf' | 'video'; url: string; title: string } | null>(null)
  const [filter, setFilter] = useState<'all' | 'tool' | 'template' | 'training'>('all')
  const [showCelebration, setShowCelebration] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [justCompleted, setJustCompleted] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [streak, setStreak] = useState(0)

  const correctPassword = 'im the best agent in the world'
  const totalItems = MAIN_COURSE.items.length + BONUSES.length
  const progressPercent = Math.round((downloaded.length / totalItems) * 100)

  const totalMinutes = MAIN_COURSE.items.reduce((sum, item) => {
    const mins = parseInt(item.duration) || 0
    return sum + (downloaded.includes(item.id) ? 0 : mins)
  }, 0)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const playSound = (type: 'complete' | 'unlock' | 'celebrate') => {
    try {
      const frequencies: Record<string, number[]> = {
        complete: [523.25, 659.25, 783.99],
        unlock: [392, 523.25, 659.25, 783.99],
        celebrate: [523.25, 659.25, 783.99, 1046.50]
      }
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      const ctx = new AudioContext()
      frequencies[type].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        osc.type = 'sine'
        gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.1)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.3)
        osc.start(ctx.currentTime + i * 0.1)
        osc.stop(ctx.currentTime + i * 0.1 + 0.3)
      })
    } catch (e) {}
  }

  const vibrate = (pattern: number | number[] = 10) => {
    if (navigator.vibrate) navigator.vibrate(pattern)
  }

  useEffect(() => {
    const saved = localStorage.getItem('downloaded')
    if (saved) setDownloaded(JSON.parse(saved))
    if (localStorage.getItem('memberUnlocked') === 'true') setIsUnlocked(true)

    const lastVisitDate = localStorage.getItem('lastVisit')
    const savedStreak = parseInt(localStorage.getItem('streak') || '0')
    const today = new Date().toDateString()

    if (lastVisitDate) {
      const lastDate = new Date(lastVisitDate)
      const diffDays = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays === 1) {
        setStreak(savedStreak + 1)
        localStorage.setItem('streak', String(savedStreak + 1))
      } else if (diffDays === 0) {
        setStreak(savedStreak)
      } else {
        setStreak(1)
        localStorage.setItem('streak', '1')
      }
    } else {
      setStreak(1)
      localStorage.setItem('streak', '1')
    }

    localStorage.setItem('lastVisit', today)
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  useEffect(() => {
    if (downloaded.length) localStorage.setItem('downloaded', JSON.stringify(downloaded))
    if (downloaded.length === totalItems && downloaded.length > 0 && !showCelebration) {
      setShowCelebration(true)
      setShowConfetti(true)
      playSound('celebrate')
      vibrate([100, 50, 100, 50, 200])
      setTimeout(() => {
        setShowCelebration(false)
        setShowConfetti(false)
      }, 5000)
    }
  }, [downloaded, totalItems, showCelebration])

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput.toLowerCase().trim() === correctPassword) {
      setIsUnlocked(true)
      localStorage.setItem('memberUnlocked', 'true')
      playSound('unlock')
      vibrate([50, 30, 100])
    } else {
      setPasswordError('Wrong password. Check your email.')
      vibrate([100, 50, 100])
    }
  }

  const openItem = (item: { id: string; name: string; type: string; file?: string; url?: string }) => {
    const wasNew = !downloaded.includes(item.id)
    if (wasNew) {
      setDownloaded([...downloaded, item.id])
      setJustCompleted(item.id)
      setShowConfetti(true)
      playSound('complete')
      vibrate(50)
      setTimeout(() => {
        setJustCompleted(null)
        setShowConfetti(false)
      }, 2000)
    }

    if (item.type === 'link' && item.url) {
      window.open(item.url, '_blank')
    } else if (item.type === 'pdf' && item.file) {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      if (isMobile) {
        window.open(item.file, '_blank')
      } else {
        setViewer({ type: 'pdf', url: item.file, title: item.name })
      }
    } else if ((item.type === 'video' || item.file?.endsWith('.mp4') || item.file?.endsWith('.mov')) && item.file) {
      setViewer({ type: 'video', url: item.file, title: item.name })
    } else if (item.file) {
      const a = document.createElement('a')
      a.href = item.file
      a.download = item.name
      a.click()
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText('https://aifastscale.com/members')
    setCopied(true)
    vibrate(30)
    setTimeout(() => setCopied(false), 2000)
  }

  const getNextItem = () => {
    const courseItem = MAIN_COURSE.items.find(i => !downloaded.includes(i.id))
    if (courseItem) return { ...courseItem, section: 'course' }
    const bonusItem = BONUSES.find(i => !downloaded.includes(i.id))
    if (bonusItem) return { ...bonusItem, section: 'bonuses' }
    return null
  }

  const nextItem = getNextItem()
  const filteredBonuses = filter === 'all' ? BONUSES : BONUSES.filter(b => b.cat === filter)

  // ==================== PASSWORD GATE - LIGHT THEME ====================
  if (!isUnlocked) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#fafafa]">
        {/* Animated Background */}
        <div className="pointer-events-none fixed inset-0" style={{ zIndex: 1 }}>
          <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-violet-100/80 via-indigo-50/40 to-transparent" />
          <div className="absolute -right-32 -top-32 h-[500px] w-[500px] animate-glow rounded-full bg-gradient-to-br from-violet-200/50 via-indigo-200/30 to-transparent blur-[80px]" />
          <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] animate-glow-delayed rounded-full bg-gradient-to-tr from-blue-200/40 via-cyan-100/20 to-transparent blur-[80px]" />
        </div>

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-2xl shadow-violet-300">
                <Lock className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* Card */}
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-2xl shadow-violet-100/50 backdrop-blur-xl">
              <h1 className="mb-2 text-center text-3xl font-black text-slate-900">Welcome Back!</h1>
              <p className="mb-8 text-center text-slate-500">Enter your password to access your course</p>

              <form onSubmit={handleUnlock} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={passwordInput}
                    onChange={(e) => { setPasswordInput(e.target.value); setPasswordError('') }}
                    placeholder="Paste your password here..."
                    className={`w-full rounded-2xl border-2 bg-slate-50 px-5 py-4 text-center text-base text-slate-900 outline-none transition-all placeholder:text-slate-400 ${
                      passwordError ? 'border-red-400 animate-shake' : 'border-slate-200 focus:border-violet-500'
                    }`}
                  />
                  {passwordError && (
                    <p className="mt-2 text-center text-sm text-red-500">{passwordError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-4 text-base font-black text-white shadow-xl shadow-violet-200 transition-all hover:shadow-2xl hover:shadow-violet-300 active:scale-[0.98]"
                >
                  UNLOCK MY COURSE
                  <ArrowRight className="ml-2 inline h-5 w-5" />
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400">Check your email for the password</p>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 flex items-center justify-center gap-6 text-slate-400">
              <div className="flex items-center gap-1.5 text-xs">
                <Shield className="h-4 w-4" />
                <span>Secure Access</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Users className="h-4 w-4" />
                <span>847+ Members</span>
              </div>
            </div>
          </div>
        </div>

        {/* Animations */}
        <style jsx global>{`
          @keyframes glow { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.05); } }
          @keyframes glow-delayed { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.08); } }
          @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
          @keyframes confetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
          .animate-glow { animation: glow 8s ease-in-out infinite; }
          .animate-glow-delayed { animation: glow-delayed 10s ease-in-out infinite 2s; }
          .animate-shake { animation: shake 0.3s ease-in-out; }
          .animate-confetti { animation: confetti 3s ease-out forwards; }
        `}</style>
      </div>
    )
  }

  // ==================== LOADING STATE ====================
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <div className="mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 mx-auto">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <p className="text-slate-500">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // ==================== CELEBRATION MODAL ====================
  if (showCelebration) {
    return (
      <>
        <Confetti show={true} />
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-white/95 px-4 backdrop-blur-xl">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 animate-bounce items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 shadow-2xl shadow-violet-300">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <h2 className="mb-3 text-4xl font-black text-slate-900">CHAMPION!</h2>
            <p className="mb-6 text-lg text-slate-600">You completed everything!</p>
            <div className="mb-6 flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-8 w-8 animate-pulse fill-violet-500 text-violet-500" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
            <p className="font-bold text-violet-600">Now go create amazing videos!</p>
          </div>
        </div>
      </>
    )
  }

  // ==================== VIEWER MODAL ====================
  if (viewer) {
    return (
      <div className="fixed inset-0 z-[200] flex flex-col bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 lg:px-8">
          <button onClick={() => setViewer(null)} className="flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-900">
            <ChevronLeft className="h-5 w-5" />
            <span className="font-bold">Back</span>
          </button>
          <span className="max-w-[200px] truncate font-bold text-slate-900 lg:max-w-none">{viewer.title}</span>
          <a href={viewer.url} download className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-bold text-white transition-all hover:shadow-lg">
            <Download className="h-4 w-4" />
            Save
          </a>
        </div>
        <div className="flex-1 overflow-hidden bg-slate-100">
          {viewer.type === 'pdf' ? (
            <iframe src={`${viewer.url}#toolbar=0`} className="h-full w-full" />
          ) : (
            <video src={viewer.url} controls autoPlay playsInline className="h-full w-full object-contain" />
          )}
        </div>
      </div>
    )
  }

  // ==================== MAIN DASHBOARD - LIGHT THEME ====================
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fafafa]">
      <Confetti show={showConfetti} />

      {/* Animated Background */}
      <div className="pointer-events-none fixed inset-0" style={{ zIndex: 1 }}>
        <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-violet-100/60 via-indigo-50/30 to-transparent" />
        <div className="absolute -right-32 -top-32 h-[400px] w-[400px] animate-glow rounded-full bg-gradient-to-br from-violet-200/40 via-indigo-200/20 to-transparent blur-[80px]" />
        <div className="absolute -bottom-32 -left-32 h-[300px] w-[300px] animate-glow-delayed rounded-full bg-gradient-to-tr from-blue-200/30 via-cyan-100/15 to-transparent blur-[80px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 lg:h-12 lg:w-12">
                <Sparkles className="h-5 w-5 text-white lg:h-6 lg:w-6" />
              </div>
              <div>
                <h1 className="flex items-center gap-2 text-lg font-black text-slate-900 lg:text-xl">
                  AgentClone
                  {streak >= 3 && <Flame className="h-4 w-4 animate-pulse text-orange-500" />}
                </h1>
                <p className="text-xs text-slate-500">Your VIP Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {streak > 1 && (
                <div className="hidden items-center gap-1 rounded-full bg-orange-100 px-3 py-1.5 sm:flex">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-xs font-bold text-orange-600">{streak} day streak</span>
                </div>
              )}
              <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 lg:px-4 lg:py-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
                <span className="text-xs font-bold text-emerald-600 lg:text-sm">{progressPercent}% Complete</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-violet-500 transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
          </div>
          {totalMinutes > 0 && (
            <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
              <Clock className="h-3 w-3" />
              ~{totalMinutes} min remaining
            </p>
          )}
        </div>

        {/* Navigation Tabs - Desktop */}
        <div className="mx-auto hidden max-w-7xl border-t border-slate-100 lg:block">
          <div className="flex gap-1 px-8 py-2">
            {[
              { id: 'home', icon: Home, label: 'Dashboard' },
              { id: 'course', icon: Video, label: 'Course' },
              { id: 'bonuses', icon: Gift, label: 'Bonuses' },
              { id: 'help', icon: HelpCircle, label: 'Help' },
            ].map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 pb-24 lg:px-8 lg:pb-8">

        {/* ==================== HOME TAB ==================== */}
        {activeTab === 'home' && (
          <div className="space-y-6 lg:space-y-8">
            {/* Welcome Card */}
            <div className="overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-6 shadow-xl shadow-violet-100/50 lg:rounded-3xl lg:p-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-200 lg:h-16 lg:w-16">
                  {progressPercent === 100 ? <Crown className="h-7 w-7 text-white lg:h-8 lg:w-8" /> : <Sparkles className="h-7 w-7 text-white lg:h-8 lg:w-8" />}
                </div>
                <div className="flex-1">
                  <h2 className="mb-1 text-xl font-black text-slate-900 lg:text-2xl">
                    {progressPercent === 0 ? `${getGreeting()}! Let's begin your journey` :
                     progressPercent === 100 ? "You're a Champion!" :
                     `${getGreeting()}! Keep up the great work`}
                  </h2>
                  <p className="text-slate-600">
                    {progressPercent === 0 ? "Your path to AI video mastery starts now" :
                     progressPercent === 100 ? "You've completed everything. Time to create amazing videos!" :
                     `${downloaded.length} of ${totalItems} completed • ${100 - progressPercent}% to go`}
                  </p>
                </div>
                {progressPercent === 100 && (
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-violet-500 text-violet-500" />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Continue Where Left Off */}
            {nextItem && progressPercent > 0 && progressPercent < 100 && (
              <button
                onClick={() => openItem(nextItem as any)}
                className="group w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-lg transition-all hover:border-violet-300 hover:shadow-xl lg:p-6"
              >
                <div className="flex items-center gap-4 lg:gap-6">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl shadow-lg lg:h-24 lg:w-24">
                    <Image src={nextItem.image} alt={nextItem.name} fill className="object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
                        <Play className="h-6 w-6 text-violet-600" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="mb-1 text-xs font-bold uppercase tracking-wider text-violet-600">Continue Learning</p>
                    <p className="text-lg font-bold text-slate-900 lg:text-xl">{nextItem.name}</p>
                    <p className="text-sm text-slate-500">{(nextItem as any).description}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg transition-transform group-hover:scale-110">
                    <ArrowRight className="h-6 w-6 text-white" />
                  </div>
                </div>
              </button>
            )}

            {/* Quick Start Guide */}
            {progressPercent < 100 && (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg lg:rounded-3xl">
                <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                      <Zap className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Quick Start Guide</h3>
                      <p className="text-sm text-slate-500">Get started in 3 easy steps</p>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-slate-100 p-2">
                  {[
                    { n: 1, t: 'Register Your Account', id: 'register', item: MAIN_COURSE.items[0] },
                    { n: 2, t: 'Watch Core Training', id: 'video-1', item: MAIN_COURSE.items[2] },
                    { n: 3, t: 'Get Your Scripts', id: 'prompt-guide', item: MAIN_COURSE.items[1] },
                  ].map((s) => {
                    const done = downloaded.includes(s.id)
                    return (
                      <button
                        key={s.n}
                        onClick={() => openItem(s.item)}
                        className={`flex w-full items-center gap-4 rounded-xl p-4 transition-all hover:bg-slate-50 ${done ? 'opacity-80' : ''}`}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
                          done ? 'bg-emerald-500 text-white' : 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white'
                        }`}>
                          {done ? <Check className="h-5 w-5" /> : s.n}
                        </div>
                        <span className={`flex-1 text-left font-semibold ${done ? 'text-emerald-600' : 'text-slate-900'}`}>{s.t}</span>
                        {done ? (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-600">Complete</span>
                        ) : (
                          <ChevronRight className="h-5 w-5 text-slate-400" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Course & Bonuses Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Course Preview */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <h3 className="font-bold text-slate-900">Your Course</h3>
                  <button onClick={() => setActiveTab('course')} className="flex items-center gap-1 text-sm font-bold text-violet-600 hover:underline">
                    View All <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 p-4 lg:grid-cols-3">
                  {MAIN_COURSE.items.slice(0, 6).map((item) => {
                    const done = downloaded.includes(item.id)
                    return (
                      <button
                        key={item.id}
                        onClick={() => openItem(item)}
                        className={`group overflow-hidden rounded-xl border-2 transition-all hover:shadow-lg ${
                          done ? 'border-emerald-300' : 'border-slate-200 hover:border-violet-300'
                        }`}
                      >
                        <div className="relative aspect-square bg-slate-100">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                          {done && (
                            <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/40">
                              <CheckCircle className="h-8 w-8 text-emerald-500" />
                            </div>
                          )}
                          {item.type === 'video' && !done && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Play className="h-8 w-8 text-white" fill="white" />
                            </div>
                          )}
                        </div>
                        <div className="bg-white p-2">
                          <p className="truncate text-xs font-bold text-slate-900">{item.name}</p>
                          <p className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Clock className="h-2.5 w-2.5" />{item.duration}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Bonuses Preview */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <h3 className="font-bold text-slate-900">Your Bonuses</h3>
                  <button onClick={() => setActiveTab('bonuses')} className="flex items-center gap-1 text-sm font-bold text-violet-600 hover:underline">
                    View All <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 p-4 lg:grid-cols-3">
                  {BONUSES.slice(0, 6).map((item) => {
                    const done = downloaded.includes(item.id)
                    return (
                      <button
                        key={item.id}
                        onClick={() => openItem(item as any)}
                        className={`group overflow-hidden rounded-xl border-2 transition-all hover:shadow-lg ${
                          done ? 'border-emerald-300' : 'border-slate-200 hover:border-violet-300'
                        }`}
                      >
                        <div className="relative aspect-[4/3] bg-slate-100">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                          {done && (
                            <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/40">
                              <CheckCircle className="h-8 w-8 text-emerald-500" />
                            </div>
                          )}
                          {item.type === 'link' && !done && (
                            <div className="absolute right-2 top-2 rounded-lg bg-white/90 p-1.5 shadow">
                              <ExternalLink className="h-3 w-3 text-violet-600" />
                            </div>
                          )}
                        </div>
                        <div className="bg-white p-2">
                          <p className="truncate text-xs font-bold text-slate-900">{item.name}</p>
                          <p className="text-[10px] font-semibold text-emerald-500">Included Free</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Bookmark Button */}
            <button
              onClick={copyLink}
              className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all ${
                copied ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white hover:border-violet-300'
              }`}
            >
              {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5 text-slate-400" />}
              <span className={`font-semibold ${copied ? 'text-emerald-600' : 'text-slate-600'}`}>
                {copied ? 'Link Copied!' : 'Bookmark This Page'}
              </span>
            </button>
          </div>
        )}

        {/* ==================== COURSE TAB ==================== */}
        {activeTab === 'course' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">Main Course</h2>
              <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-600">
                {MAIN_COURSE.items.filter(i => downloaded.includes(i.id)).length}/{MAIN_COURSE.items.length} Complete
              </span>
            </div>

            <div className="space-y-3">
              {MAIN_COURSE.items.map((item, index) => {
                const done = downloaded.includes(item.id)
                const isNext = !done && MAIN_COURSE.items.slice(0, index).every(i => downloaded.includes(i.id))
                return (
                  <button
                    key={item.id}
                    onClick={() => openItem(item)}
                    className={`group flex w-full items-center gap-4 rounded-2xl border-2 p-4 transition-all lg:gap-6 lg:p-5 ${
                      done ? 'border-emerald-300 bg-emerald-50' :
                      isNext ? 'border-violet-300 bg-violet-50 shadow-lg shadow-violet-100' :
                      'border-slate-200 bg-white hover:border-violet-300 hover:shadow-lg'
                    }`}
                  >
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl shadow-md lg:h-20 lg:w-20">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                      {item.type === 'video' && !done && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Play className="h-6 w-6 text-white" fill="white" />
                        </div>
                      )}
                      {done && (
                        <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/50">
                          <CheckCircle className="h-8 w-8 text-emerald-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      {isNext && <p className="mb-1 text-xs font-bold uppercase tracking-wider text-violet-600">Up Next</p>}
                      <p className={`text-lg font-bold ${done ? 'text-emerald-600' : 'text-slate-900'}`}>{item.name}</p>
                      <p className="text-sm text-slate-500">{item.description}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="h-3 w-3" /> {item.duration}
                        </span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                          {item.type === 'video' ? 'Video' : 'PDF'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`h-6 w-6 transition-transform group-hover:translate-x-1 ${
                      done ? 'text-emerald-400' : isNext ? 'text-violet-500' : 'text-slate-300'
                    }`} />
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ==================== BONUSES TAB ==================== */}
        {activeTab === 'bonuses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">Your Bonuses</h2>
              <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-600">
                {BONUSES.filter(i => downloaded.includes(i.id)).length}/{BONUSES.length} Claimed
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {(['all', 'tool', 'template', 'training'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                    filter === f
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-violet-300'
                  }`}
                >
                  {f === 'all' ? `All (${BONUSES.length})` :
                   f === 'tool' ? `Tools (${BONUSES.filter(b => b.cat === 'tool').length})` :
                   f === 'template' ? `Templates (${BONUSES.filter(b => b.cat === 'template').length})` :
                   `Training (${BONUSES.filter(b => b.cat === 'training').length})`}
                </button>
              ))}
            </div>

            {/* Bonuses Grid */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {filteredBonuses.map((item) => {
                const done = downloaded.includes(item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => openItem(item as any)}
                    className={`group overflow-hidden rounded-2xl border-2 transition-all hover:shadow-xl ${
                      done ? 'border-emerald-300' : 'border-slate-200 hover:border-violet-300'
                    }`}
                  >
                    <div className="relative aspect-[4/3] bg-slate-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover transition-transform group-hover:scale-105" />
                      {done && (
                        <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/40">
                          <CheckCircle className="h-10 w-10 text-emerald-500" />
                        </div>
                      )}
                      {item.type === 'link' && !done && (
                        <div className="absolute right-2 top-2 rounded-lg bg-white/90 p-2 shadow">
                          <ExternalLink className="h-4 w-4 text-violet-600" />
                        </div>
                      )}
                    </div>
                    <div className="bg-white p-4">
                      <p className="truncate font-bold text-slate-900">{item.name}</p>
                      <p className="mt-1 truncate text-sm text-slate-500">{item.description}</p>
                      <p className={`mt-2 text-sm font-bold ${done ? 'text-emerald-500' : 'text-violet-600'}`}>
                        {done ? '✓ Claimed' : 'Included Free'}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ==================== HELP TAB ==================== */}
        {activeTab === 'help' && (
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-2xl font-black text-slate-900">Need Help?</h2>

            <div className="space-y-4">
              {[
                { q: 'How do I create my first AI video?', a: 'Go to Course tab → Watch "Core Training" video. It walks you through everything step-by-step!' },
                { q: 'Where are my downloads saved?', a: 'On iPhone: Check the Files app. On Android: Check Downloads folder. On Desktop: Your browser\'s download location.' },
                { q: 'Can I access this on multiple devices?', a: 'Yes! Just bookmark this page and use the same password on any device.' },
                { q: 'How do I use the AI Mentor?', a: 'Go to Bonuses → Click "Marcus AI Mentor" → It opens ChatGPT where Marcus will answer all your questions 24/7.' },
              ].map((f, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="mb-2 font-bold text-slate-900">{f.q}</p>
                  <p className="text-slate-600">{f.a}</p>
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 p-6 lg:p-8">
              <h3 className="mb-2 text-xl font-bold text-slate-900">Still stuck?</h3>
              <p className="mb-5 text-slate-600">Our support team typically responds within 24 hours.</p>
              <a
                href="mailto:support@aifastscale.com"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-violet-200 transition-all hover:shadow-xl"
              >
                <MessageCircle className="h-5 w-5" />
                Email Support
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Nav - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-xl lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-center justify-around py-2">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'course', icon: Video, label: 'Course' },
            { id: 'bonuses', icon: Gift, label: 'Bonuses' },
            { id: 'help', icon: HelpCircle, label: 'Help' },
          ].map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all ${
                  isActive ? 'bg-violet-100 text-violet-600' : 'text-slate-400'
                }`}
              >
                <tab.icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className="text-[10px] font-bold">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Global Animations */}
      <style jsx global>{`
        @keyframes glow { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.05); } }
        @keyframes glow-delayed { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.08); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes confetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
        .animate-glow { animation: glow 8s ease-in-out infinite; }
        .animate-glow-delayed { animation: glow-delayed 10s ease-in-out infinite 2s; }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .animate-confetti { animation: confetti 3s ease-out forwards; }
      `}</style>
    </div>
  )
}
