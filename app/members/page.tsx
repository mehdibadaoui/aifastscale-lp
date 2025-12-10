'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Lock, CheckCircle, Copy, Check, Play, Sparkles, Home, Gift,
  HelpCircle, ChevronRight, Zap, MessageCircle, ExternalLink,
  Download, ChevronLeft, Video, PartyPopper, Clock,
  ArrowRight, Star, Trophy, Flame, Target, Crown
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

// Confetti Component
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
            backgroundColor: ['#d4af37', '#f4d03f', '#10b981', '#22d3ee', '#ffffff', '#ec4899'][Math.floor(Math.random() * 6)],
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2.5 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  )
}

// Skeleton Loader
function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white/10 rounded-lg ${className}`} />
  )
}

// Achievement Badge
function AchievementBadge({ icon: Icon, label, unlocked }: { icon: any; label: string; unlocked: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
      unlocked ? 'bg-[#d4af37]/20 scale-100' : 'bg-white/5 scale-95 opacity-50'
    }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        unlocked ? 'bg-[#d4af37] text-black' : 'bg-white/10 text-white/30'
      }`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className={`text-[8px] font-bold ${unlocked ? 'text-[#d4af37]' : 'text-white/30'}`}>{label}</span>
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
  const [lastVisit, setLastVisit] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const correctPassword = 'im the best agent in the world'
  const totalItems = MAIN_COURSE.items.length + BONUSES.length
  const progressPercent = Math.round((downloaded.length / totalItems) * 100)

  // Calculate total time remaining
  const totalMinutes = MAIN_COURSE.items.reduce((sum, item) => {
    const mins = parseInt(item.duration) || 0
    return sum + (downloaded.includes(item.id) ? 0 : mins)
  }, 0)

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  // Play completion sound
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

  // Haptic feedback
  const vibrate = (pattern: number | number[] = 10) => {
    if (navigator.vibrate) navigator.vibrate(pattern)
  }

  useEffect(() => {
    const saved = localStorage.getItem('downloaded')
    if (saved) setDownloaded(JSON.parse(saved))
    if (localStorage.getItem('memberUnlocked') === 'true') setIsUnlocked(true)

    // Streak tracking
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
    setLastVisit(today)

    // Simulate loading for smooth transition
    setTimeout(() => setIsLoading(false), 800)
  }, [])

  useEffect(() => {
    if (downloaded.length) localStorage.setItem('downloaded', JSON.stringify(downloaded))

    // Show celebration when hitting 100%
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
      // Direct download for PDFs on mobile (better UX than iframe)
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

  const switchTab = (tab: typeof activeTab) => {
    vibrate(10)
    setActiveTab(tab)
  }

  // Find next incomplete item for "Continue" feature
  const getNextItem = () => {
    const courseItem = MAIN_COURSE.items.find(i => !downloaded.includes(i.id))
    if (courseItem) return { ...courseItem, section: 'course' }
    const bonusItem = BONUSES.find(i => !downloaded.includes(i.id))
    if (bonusItem) return { ...bonusItem, section: 'bonuses' }
    return null
  }

  const nextItem = getNextItem()

  // Achievement checks
  const achievements = {
    firstStep: downloaded.length >= 1,
    halfway: downloaded.length >= Math.floor(totalItems / 2),
    courseComplete: MAIN_COURSE.items.every(i => downloaded.includes(i.id)),
    allDone: downloaded.length === totalItems,
    streakMaster: streak >= 3,
  }

  // Password Gate
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="max-w-sm w-full">
          <div className="w-20 h-20 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#d4af37]/30 animate-pulse">
            <Lock className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-black text-white text-center mb-2">Welcome!</h1>
          <p className="text-white/50 text-sm text-center mb-8">Enter your password to unlock your course</p>
          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={passwordInput}
                onChange={(e) => { setPasswordInput(e.target.value); setPasswordError('') }}
                placeholder="Paste your password here..."
                className={`w-full bg-white/5 border-2 ${passwordError ? 'border-red-500 animate-shake' : 'border-white/10'} rounded-2xl px-5 py-4 text-white text-base placeholder-white/30 outline-none focus:border-[#d4af37] text-center transition-all duration-300`}
              />
              {passwordError && (
                <p className="text-red-400 text-xs text-center mt-2 animate-fadeIn">{passwordError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black py-4 rounded-2xl font-black text-base shadow-xl shadow-[#d4af37]/30 active:scale-[0.97] transition-all duration-200 hover:shadow-2xl hover:shadow-[#d4af37]/40"
            >
              UNLOCK MY COURSE →
            </button>
          </form>
          <p className="text-white/30 text-xs text-center mt-6">Check your email for the password</p>
        </div>
      </div>
    )
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="w-32 h-10" />
          <Skeleton className="w-16 h-8 rounded-full" />
        </div>
        <Skeleton className="w-full h-2 mb-6" />
        <Skeleton className="w-full h-24 rounded-2xl mb-4" />
        <Skeleton className="w-full h-40 rounded-xl mb-4" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="aspect-[4/3] rounded-xl" />
          <Skeleton className="aspect-[4/3] rounded-xl" />
        </div>
      </div>
    )
  }

  // Celebration Modal
  if (showCelebration) {
    return (
      <>
        <Confetti show={true} />
        <div className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center px-4">
          <div className="text-center animate-scaleIn">
            <div className="w-24 h-24 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#d4af37]/50 animate-bounce">
              <Trophy className="w-12 h-12 text-black" />
            </div>
            <h2 className="text-3xl font-black text-white mb-3">CHAMPION! 🏆</h2>
            <p className="text-white/70 text-base mb-6">You completed everything!</p>
            <div className="flex justify-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 text-[#d4af37] fill-[#d4af37] animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
            <p className="text-[#d4af37] text-sm font-bold">Now go create amazing videos!</p>
          </div>
        </div>
      </>
    )
  }

  // Viewer Modal
  if (viewer) {
    return (
      <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-slideUp">
        <div className="flex items-center justify-between px-4 py-4 bg-[#0a0a0a] border-b border-white/10">
          <button onClick={() => setViewer(null)} className="flex items-center gap-2 text-white/70 active:opacity-50 transition-opacity">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-bold">Back</span>
          </button>
          <span className="text-white text-sm font-bold truncate max-w-[180px]">{viewer.title}</span>
          <a href={viewer.url} download className="bg-[#d4af37] text-black px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-transform">
            <Download className="w-4 h-4" />
            Save
          </a>
        </div>
        <div className="flex-1 overflow-hidden">
          {viewer.type === 'pdf' ? (
            <iframe src={`${viewer.url}#toolbar=0`} className="w-full h-full" />
          ) : (
            <video src={viewer.url} controls autoPlay playsInline className="w-full h-full object-contain" />
          )}
        </div>
      </div>
    )
  }

  const filteredBonuses = filter === 'all' ? BONUSES : BONUSES.filter(b => b.cat === filter)

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>
      <Confetti show={showConfetti} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/98 backdrop-blur-md border-b border-white/5 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-white flex items-center gap-2">
              AgentClone™
              {streak >= 3 && <Flame className="w-4 h-4 text-orange-500 animate-pulse" />}
            </h1>
            <p className="text-[10px] text-white/40">Your VIP Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            {streak > 1 && (
              <div className="bg-orange-500/20 px-2 py-1 rounded-full flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-400" />
                <span className="text-orange-400 text-[10px] font-bold">{streak} days</span>
              </div>
            )}
            <div className="bg-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 text-xs font-bold">{progressPercent}%</span>
            </div>
          </div>
        </div>
        {/* Animated Progress Bar */}
        <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#d4af37] via-emerald-400 to-[#d4af37] rounded-full transition-all duration-700 ease-out relative overflow-hidden"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
        {totalMinutes > 0 && (
          <p className="text-[10px] text-white/30 mt-1.5 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            ~{totalMinutes} min remaining
          </p>
        )}
      </header>

      <main className="px-4 py-4">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Welcome Message */}
            <div className="bg-gradient-to-br from-[#d4af37]/20 via-[#d4af37]/10 to-transparent border border-[#d4af37]/30 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#d4af37]/20">
                  {progressPercent === 100 ? <Crown className="w-6 h-6 text-black" /> : <Sparkles className="w-6 h-6 text-black" />}
                </div>
                <div>
                  <h2 className="text-white font-bold text-base mb-1">
                    {progressPercent === 0 ? `${getGreeting()}! Let's begin` :
                     progressPercent === 100 ? "You're a Champion! 🏆" :
                     `${getGreeting()}! Keep going`}
                  </h2>
                  <p className="text-white/60 text-sm">
                    {progressPercent === 0 ? "Your journey to AI video mastery starts now" :
                     progressPercent === 100 ? "You've mastered everything. Time to create!" :
                     `${downloaded.length} of ${totalItems} completed • ${100 - progressPercent}% to go`}
                  </p>
                </div>
              </div>
            </div>

            {/* Achievements Row */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
              <AchievementBadge icon={Target} label="First Step" unlocked={achievements.firstStep} />
              <AchievementBadge icon={Zap} label="Halfway" unlocked={achievements.halfway} />
              <AchievementBadge icon={Video} label="Course Done" unlocked={achievements.courseComplete} />
              <AchievementBadge icon={Trophy} label="Champion" unlocked={achievements.allDone} />
              <AchievementBadge icon={Flame} label="3-Day Streak" unlocked={achievements.streakMaster} />
            </div>

            {/* Continue Where You Left Off */}
            {nextItem && progressPercent > 0 && progressPercent < 100 && (
              <button
                onClick={() => openItem(nextItem as any)}
                className="w-full bg-gradient-to-r from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/30 rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-all duration-200"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative shadow-lg">
                  <Image src={nextItem.image} alt={nextItem.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[10px] text-[#d4af37] font-bold uppercase tracking-wider">Continue</p>
                  <p className="text-white text-base font-bold truncate">{nextItem.name}</p>
                  <p className="text-white/40 text-xs">{(nextItem as any).description}</p>
                </div>
                <div className="w-10 h-10 bg-[#d4af37] rounded-full flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-black" />
                </div>
              </button>
            )}

            {/* Quick Start - CLICKABLE */}
            {progressPercent < 100 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-[#d4af37]/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <span className="text-white text-sm font-bold">Quick Start Guide</span>
                </div>
                <div className="space-y-2">
                  {[
                    { n: 1, t: 'Register Account', id: 'register', item: MAIN_COURSE.items[0] },
                    { n: 2, t: 'Watch Core Training', id: 'video-1', item: MAIN_COURSE.items[2] },
                    { n: 3, t: 'Get Your Scripts', id: 'prompt-guide', item: MAIN_COURSE.items[1] },
                  ].map((s) => {
                    const done = downloaded.includes(s.id)
                    return (
                      <button
                        key={s.n}
                        onClick={() => openItem(s.item)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 active:scale-[0.98] ${
                          done ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-white/5 border border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                          done ? 'bg-emerald-500 text-white' : 'bg-[#d4af37] text-black'
                        }`}>
                          {done ? <Check className="w-4 h-4" /> : s.n}
                        </div>
                        <span className={`text-sm flex-1 text-left font-medium ${done ? 'text-emerald-400' : 'text-white'}`}>{s.t}</span>
                        {!done && <ChevronRight className="w-5 h-5 text-white/30" />}
                        {done && <span className="text-emerald-400 text-xs font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full">Done</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Course Preview */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white text-sm font-bold">Your Course</h3>
                <button onClick={() => switchTab('course')} className="text-[#d4af37] text-xs font-bold flex items-center gap-1 active:opacity-70">
                  See All <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
                {MAIN_COURSE.items.slice(0, 4).map((item) => {
                  const done = downloaded.includes(item.id)
                  return (
                    <button
                      key={item.id}
                      onClick={() => openItem(item)}
                      className={`flex-shrink-0 w-32 rounded-2xl overflow-hidden border-2 snap-start transition-all duration-200 active:scale-[0.95] ${
                        done ? 'border-emerald-500/50' : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="aspect-square relative bg-white/5">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                        {done && <div className="absolute inset-0 bg-emerald-500/40 flex items-center justify-center"><CheckCircle className="w-8 h-8 text-emerald-400" /></div>}
                        {item.type === 'video' && !done && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <Play className="w-5 h-5 text-white ml-0.5" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-2.5 bg-[#0a0a0a]">
                        <p className="text-white text-[11px] font-bold truncate">{item.name}</p>
                        <p className="text-white/40 text-[10px] flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{item.duration}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Bonuses Preview */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white text-sm font-bold">Your Bonuses</h3>
                <button onClick={() => switchTab('bonuses')} className="text-[#d4af37] text-xs font-bold flex items-center gap-1 active:opacity-70">
                  See All <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {BONUSES.slice(0, 4).map((item) => {
                  const done = downloaded.includes(item.id)
                  return (
                    <button
                      key={item.id}
                      onClick={() => openItem(item as any)}
                      className={`rounded-2xl overflow-hidden border-2 transition-all duration-200 active:scale-[0.95] ${
                        done ? 'border-emerald-500/50' : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="aspect-[4/3] relative bg-white/5">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                        {done && <div className="absolute inset-0 bg-emerald-500/40 flex items-center justify-center"><CheckCircle className="w-8 h-8 text-emerald-400" /></div>}
                        {item.type === 'link' && !done && <div className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-lg backdrop-blur-sm"><ExternalLink className="w-3.5 h-3.5 text-white" /></div>}
                      </div>
                      <div className="p-2.5 bg-[#0a0a0a]">
                        <p className="text-white text-[11px] font-bold truncate">{item.name}</p>
                        <p className="text-emerald-400 text-[10px] font-bold">Included</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Save Link - Subtle */}
            <button
              onClick={copyLink}
              className={`w-full p-3.5 rounded-xl border-2 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] ${
                copied ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-white/5 border-white/10'
              }`}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/50" />}
              <span className={`text-xs font-bold ${copied ? 'text-emerald-400' : 'text-white/50'}`}>
                {copied ? 'Link Copied!' : 'Bookmark This Page'}
              </span>
            </button>
          </div>
        )}

        {/* COURSE TAB */}
        {activeTab === 'course' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-lg font-bold">Main Course</h2>
              <span className="text-emerald-400 text-xs font-bold bg-emerald-500/20 px-3 py-1 rounded-full">
                {MAIN_COURSE.items.filter(i => downloaded.includes(i.id)).length}/{MAIN_COURSE.items.length} Done
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
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 active:scale-[0.98] ${
                      done ? 'bg-emerald-500/10 border-emerald-500/30' :
                      isNext ? 'bg-[#d4af37]/10 border-[#d4af37]/40 shadow-lg shadow-[#d4af37]/10' :
                      'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative shadow-md">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                      {item.type === 'video' && !done && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Play className="w-7 h-7 text-white" />
                        </div>
                      )}
                      {done && (
                        <div className="absolute inset-0 bg-emerald-500/50 flex items-center justify-center">
                          <CheckCircle className="w-7 h-7 text-emerald-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      {isNext && <p className="text-[10px] text-[#d4af37] font-bold uppercase tracking-wider mb-0.5">Up Next</p>}
                      <p className={`text-base font-bold ${done ? 'text-emerald-400' : 'text-white'}`}>{item.name}</p>
                      <p className="text-white/50 text-xs">{item.description}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-white/30 text-[10px] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {item.duration}
                        </span>
                        {item.type === 'video' && <span className="text-white/30 text-[10px] bg-white/10 px-1.5 py-0.5 rounded">Video</span>}
                        {item.type === 'pdf' && <span className="text-white/30 text-[10px] bg-white/10 px-1.5 py-0.5 rounded">PDF</span>}
                      </div>
                    </div>
                    <ChevronRight className={`w-6 h-6 ${done ? 'text-emerald-400' : isNext ? 'text-[#d4af37]' : 'text-white/20'}`} />
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* BONUSES TAB */}
        {activeTab === 'bonuses' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-lg font-bold">Bonuses</h2>
              <span className="text-emerald-400 text-xs font-bold bg-emerald-500/20 px-3 py-1 rounded-full">
                {BONUSES.filter(i => downloaded.includes(i.id)).length}/{BONUSES.length} Claimed
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
              {(['all', 'tool', 'template', 'training'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); vibrate(10) }}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                    filter === f
                      ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20'
                      : 'bg-white/5 text-white/50 border border-white/10'
                  }`}
                >
                  {f === 'all' ? `All (${BONUSES.length})` :
                   f === 'tool' ? `Tools (${BONUSES.filter(b => b.cat === 'tool').length})` :
                   f === 'template' ? `Templates (${BONUSES.filter(b => b.cat === 'template').length})` :
                   `Training (${BONUSES.filter(b => b.cat === 'training').length})`}
                </button>
              ))}
            </div>

            {/* Bonus Grid */}
            <div className="grid grid-cols-2 gap-3">
              {filteredBonuses.map((item) => {
                const done = downloaded.includes(item.id)
                const isJustCompleted = justCompleted === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => openItem(item as any)}
                    className={`rounded-2xl overflow-hidden border-2 transition-all duration-300 active:scale-[0.95] ${
                      isJustCompleted ? 'border-emerald-400 ring-4 ring-emerald-400/30 scale-[1.02]' :
                      done ? 'border-emerald-500/50' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="aspect-[4/3] relative bg-white/5">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                      {done && (
                        <div className="absolute inset-0 bg-emerald-500/40 flex items-center justify-center">
                          <CheckCircle className="w-10 h-10 text-emerald-400" />
                        </div>
                      )}
                      {item.type === 'link' && !done && (
                        <div className="absolute top-2 right-2 bg-black/70 p-2 rounded-lg backdrop-blur-sm">
                          <ExternalLink className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-[#0a0a0a]">
                      <p className="text-white text-xs font-bold truncate">{item.name}</p>
                      <p className="text-white/40 text-[10px] truncate mt-0.5">{item.description}</p>
                      <p className={`text-[10px] font-bold mt-1.5 ${done ? 'text-emerald-400' : 'text-[#d4af37]'}`}>
                        {done ? '✓ Claimed' : 'Included Free'}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* HELP TAB */}
        {activeTab === 'help' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-white text-lg font-bold">Need Help?</h2>

            <div className="space-y-3">
              {[
                { q: 'How do I create my first AI video?', a: 'Go to Course tab → Watch "Core Training" video. It walks you through everything step-by-step!' },
                { q: 'Where are my downloads saved?', a: 'On iPhone: Check the Files app. On Android: Check Downloads folder. On Desktop: Your browser\'s download location.' },
                { q: 'Can I access this on multiple devices?', a: 'Yes! Just bookmark this page and use the same password on any device.' },
                { q: 'How do I use the AI Mentor?', a: 'Go to Bonuses → Click "Marcus AI Mentor" → It opens ChatGPT where Marcus will answer all your questions 24/7.' },
              ].map((f, i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <p className="text-white text-sm font-bold mb-2">{f.q}</p>
                  <p className="text-white/60 text-xs leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/30 rounded-2xl p-5">
              <h3 className="text-white font-bold text-base mb-2">Still stuck?</h3>
              <p className="text-white/60 text-sm mb-4">Our support team typically responds within 24 hours.</p>
              <a
                href="mailto:support@aifastscale.com"
                className="block w-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black py-3.5 rounded-xl text-sm font-bold text-center active:scale-[0.97] transition-transform shadow-lg shadow-[#d4af37]/20"
              >
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Email Support
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Nav - Premium */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/98 backdrop-blur-md border-t border-white/10 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
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
                onClick={() => switchTab(tab.id as typeof activeTab)}
                className={`flex flex-col items-center gap-1 py-2 px-5 rounded-2xl transition-all duration-200 ${
                  isActive ? 'text-[#d4af37] bg-[#d4af37]/10' : 'text-white/30'
                }`}
              >
                <tab.icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5] scale-110' : ''}`} />
                <span className="text-[10px] font-bold">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
