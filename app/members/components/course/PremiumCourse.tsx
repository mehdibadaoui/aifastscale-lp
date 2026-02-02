'use client'

import { memo, useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import {
  Play, Pause, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  CheckCircle, Check, Clock, Lock, Bookmark, BookmarkCheck,
  Download, ExternalLink, FileText, Link2, Folder, Copy,
  Lightbulb, Sparkles, ArrowRight, X, Volume2, VolumeX,
  Maximize2, Settings, Keyboard, SkipForward, SkipBack,
  Edit3, Save, RotateCcw, Zap, Target, Award, PlayCircle,
  FileDown, Layers, GripVertical, List, Grid3X3, Info, HelpCircle
} from 'lucide-react'

// ============================================
// TYPES
// ============================================

interface ModuleResource {
  name: string
  url: string
  type: 'link' | 'file' | 'folder'
  description?: string
  timestamp?: string
}

interface CourseModule {
  id: string
  number: number
  title: string
  description: string
  duration: string
  durationMinutes: number
  wistiaId: string | null
  thumbnail: string | null
  lessons: string[]
  resources: ModuleResource[]
  comingSoon?: boolean
}

interface VideoProgress {
  percent: number
  seconds: number
}

interface CourseState {
  currentModule: CourseModule
  currentModuleIndex: number
  totalModules: number
  completedModules: string[]
  videoProgress: Record<string, VideoProgress>
  moduleNotes: Record<string, string>
  bookmarkedModules: string[]
  markComplete: () => void
  nextModule: () => void
  prevModule: () => void
  setCurrentModuleIndex: (index: number) => void
  handleVideoProgress: (percent: number, seconds: number) => void
  toggleBookmark: (moduleId: string) => void
  saveNote: (moduleId: string, note: string) => void
  config: {
    modules: CourseModule[]
  }
  reducedMotion: boolean
  showConfetti: boolean
}

// ============================================
// ACTIVE USERS INDICATOR (323-773)
// ============================================

const ActiveUsersIndicator = memo(function ActiveUsersIndicator() {
  const [count, setCount] = useState(() => Math.floor(Math.random() * (773 - 323 + 1)) + 323)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        const change = Math.floor(Math.random() * 21) - 10
        return Math.max(323, Math.min(773, prev + change))
      })
    }, 30000 + Math.random() * 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-50" />
      </div>
      <span className="text-xs text-emerald-400 font-bold">{count}</span>
      <span className="text-xs text-white/40">online</span>
    </div>
  )
})

// ============================================
// KEYBOARD SHORTCUTS TOOLTIP
// ============================================

const KeyboardShortcuts = memo(function KeyboardShortcuts({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) {
  if (!isOpen) return null

  const shortcuts = [
    { key: 'Space', action: 'Play / Pause' },
    { key: '←', action: 'Rewind 10s' },
    { key: '→', action: 'Forward 10s' },
    { key: 'M', action: 'Mute / Unmute' },
    { key: 'F', action: 'Fullscreen' },
    { key: 'N', action: 'Next lesson' },
    { key: 'P', action: 'Previous lesson' },
  ]

  return (
    <div className="absolute bottom-full right-0 mb-2 z-50 animate-fade-in">
      <div className="bg-zinc-900/95 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-4 shadow-2xl shadow-amber-500/10 min-w-[220px]">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
          <Keyboard className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-bold text-white">Keyboard Shortcuts</span>
        </div>
        <div className="space-y-2">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <span className="text-xs text-white/60">{s.action}</span>
              <kbd className="px-2 py-0.5 rounded bg-white/10 text-xs text-amber-400 font-mono">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

// ============================================
// LESSON COMPLETION TOAST
// ============================================

const CompletionToast = memo(function CompletionToast({
  show,
  lessonTitle,
  nextLessonTitle,
  onGoNext,
  onClose
}: {
  show: boolean
  lessonTitle: string
  nextLessonTitle?: string
  onGoNext?: () => void
  onClose: () => void
}) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 8000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-[1px] rounded-2xl shadow-2xl shadow-emerald-500/30">
        <div className="bg-zinc-900 rounded-2xl p-5 flex items-center gap-4 min-w-[320px]">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-emerald-400 font-bold">Lesson Completed!</p>
            <p className="text-white/60 text-sm">Great work on finishing this lesson</p>
          </div>
          {nextLessonTitle && onGoNext && (
            <button
              onClick={onGoNext}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-sm hover:scale-105 transition-transform"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-4 h-4 text-white/40" />
          </button>
        </div>
      </div>
    </div>
  )
})

// ============================================
// PREMIUM VIDEO PLAYER WRAPPER
// ============================================

const PremiumVideoPlayer = memo(function PremiumVideoPlayer({
  wistiaId,
  onVideoEnd,
  onProgress,
  resumeTime = 0,
  title,
  moduleNumber
}: {
  wistiaId: string
  onVideoEnd: () => void
  onProgress: (percent: number, seconds: number) => void
  resumeTime?: number
  title: string
  moduleNumber: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

  // Initialize Wistia player
  useEffect(() => {
    if (!wistiaId || !containerRef.current) return

    containerRef.current.innerHTML = ''

    const wistiaDiv = document.createElement('div')
    wistiaDiv.className = 'wistia_responsive_padding'
    wistiaDiv.style.padding = '56.25% 0 0 0'
    wistiaDiv.style.position = 'relative'

    const innerDiv = document.createElement('div')
    innerDiv.className = 'wistia_responsive_wrapper'
    innerDiv.style.cssText = 'height:100%;left:0;position:absolute;top:0;width:100%;'

    const embedDiv = document.createElement('div')
    embedDiv.className = `wistia_embed wistia_async_${wistiaId} seo=true videoFoam=true`
    embedDiv.style.cssText = 'height:100%;position:relative;width:100%;'

    innerDiv.appendChild(embedDiv)
    wistiaDiv.appendChild(innerDiv)
    containerRef.current.appendChild(wistiaDiv)

    // Load Wistia script
    const script = document.createElement('script')
    script.src = 'https://fast.wistia.com/assets/external/E-v1.js'
    script.async = true
    document.head.appendChild(script)

    // Initialize video
    const checkWistia = setInterval(() => {
      if ((window as any).Wistia) {
        const video = (window as any).Wistia.api(wistiaId)
        if (video) {
          clearInterval(checkWistia)
          videoRef.current = video

          video.bind('play', () => setIsPlaying(true))
          video.bind('pause', () => setIsPlaying(false))
          video.bind('end', onVideoEnd)
          video.bind('secondchange', (s: number) => {
            if (s % 5 === 0) {
              const duration = video.duration()
              const percent = duration > 0 ? (s / duration) * 100 : 0
              onProgress(percent, s)
            }
          })

          if (resumeTime > 0) {
            video.time(resumeTime)
          }
        }
      }
    }, 100)

    return () => {
      clearInterval(checkWistia)
      if (videoRef.current) {
        videoRef.current.unbind()
      }
    }
  }, [wistiaId, onVideoEnd, onProgress, resumeTime])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (!videoRef.current) return
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault()
          videoRef.current.playing() ? videoRef.current.pause() : videoRef.current.play()
          break
        case 'arrowleft':
          e.preventDefault()
          videoRef.current.time(Math.max(0, videoRef.current.time() - 10))
          break
        case 'arrowright':
          e.preventDefault()
          videoRef.current.time(videoRef.current.time() + 10)
          break
        case 'm':
          videoRef.current.muted(!videoRef.current.muted())
          break
        case 'f':
          videoRef.current.requestFullscreen()
          break
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [])

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed)
    if (videoRef.current) {
      videoRef.current.playbackRate(speed)
    }
    setShowSpeedMenu(false)
  }

  return (
    <div className="relative group">
      {/* Ambient glow effect - pointer-events-none to not block video clicks */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Video container with glass effect */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-500/20 shadow-2xl shadow-amber-500/10 bg-black">
        {/* Module indicator overlay - pointer-events-none to not block video clicks */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 pointer-events-none">
          <span className="text-xs font-bold text-amber-400">Module {moduleNumber}</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span className="text-xs text-white/70 line-clamp-1 max-w-[150px] sm:max-w-[250px]">{title}</span>
        </div>

        {/* Keyboard shortcuts toggle */}
        <div className="absolute bottom-4 right-4 z-10">
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white/60 hover:text-white hover:bg-black/80 transition-all"
          >
            <Keyboard className="w-4 h-4" />
          </button>
          <KeyboardShortcuts isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
        </div>

        {/* Speed control */}
        <div className="absolute bottom-4 right-16 z-10">
          <button
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white/80 hover:text-white text-xs font-bold hover:bg-black/80 transition-all"
          >
            {playbackSpeed}x
          </button>
          {showSpeedMenu && (
            <div className="absolute bottom-full right-0 mb-2 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-2 shadow-xl animate-fade-in">
              {speeds.map(speed => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`block w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    playbackSpeed === speed
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Wistia embed container */}
        <div ref={containerRef} className="aspect-video" />
      </div>
    </div>
  )
})

// ============================================
// CONTINUE WATCHING BANNER
// ============================================

const ContinueWatchingBanner = memo(function ContinueWatchingBanner({
  lessonTitle,
  savedTime,
  onResume
}: {
  lessonTitle: string
  savedTime: number
  onResume: () => void
}) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${String(secs).padStart(2, '0')}`
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 sm:p-5">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl" />
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <PlayCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white font-bold">Continue where you left off</p>
            <p className="text-amber-200/70 text-sm">
              {lessonTitle} • Stopped at {formatTime(savedTime)}
            </p>
          </div>
        </div>
        <button
          onClick={onResume}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold hover:scale-105 transition-transform shadow-lg shadow-amber-500/25"
        >
          <Play className="w-4 h-4" fill="currentColor" />
          Resume
        </button>
      </div>
    </div>
  )
})

// ============================================
// LESSON HEADER BLOCK
// ============================================

const LessonHeader = memo(function LessonHeader({
  module,
  isCompleted,
  isBookmarked,
  onMarkComplete,
  onToggleBookmark,
  onNext,
  canGoNext,
  completedCount,
  totalModules
}: {
  module: CourseModule
  isCompleted: boolean
  isBookmarked: boolean
  onMarkComplete: () => void
  onToggleBookmark: () => void
  onNext: () => void
  canGoNext: boolean
  completedCount: number
  totalModules: number
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-white/[0.05] to-transparent p-5 sm:p-6">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="relative">
        {/* Module tag and badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-500/25">
            MODULE {module.number}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/70 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {module.duration}
          </span>
          {isCompleted ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 flex items-center gap-1 border border-emerald-500/30">
              <CheckCircle className="w-3 h-3" /> Done
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
              In Progress
            </span>
          )}
          <span className="ml-auto text-xs text-white/40 hidden sm:block">
            {completedCount}/{totalModules} complete
          </span>
        </div>

        {/* Title and description */}
        <h1 className="text-xl sm:text-2xl font-black text-white mb-2">{module.title}</h1>
        <p className="text-white/60 text-sm sm:text-base mb-6">{module.description}</p>

        {/* Actions - All buttons in a row */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isCompleted ? (
            <button
              onClick={onMarkComplete}
              className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm transition-all hover:bg-emerald-500/20"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="hidden xs:inline">Completed</span>
            </button>
          ) : (
            <button
              onClick={onMarkComplete}
              className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="hidden xs:inline">Mark</span> Complete
            </button>
          )}

          {canGoNext && (
            <button
              onClick={onNext}
              className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onToggleBookmark}
            className={`p-3 rounded-xl border transition-all flex-shrink-0 ${
              isBookmarked
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-white/5 border-white/10 text-white/50 hover:text-amber-400 hover:border-amber-500/30'
            }`}
          >
            {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  )
})

// ============================================
// WHAT YOU'LL LEARN BLOCK
// ============================================

const WhatYoullLearn = memo(function WhatYoullLearn({
  lessons,
  isCompleted
}: {
  lessons: string[]
  isCompleted: boolean
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-white/[0.03] to-transparent p-5 sm:p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 flex items-center justify-center border border-amber-500/20">
          <Lightbulb className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg">What You'll Learn</h3>
          <p className="text-white/40 text-xs">Key takeaways from this lesson</p>
        </div>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
              isCompleted
                ? 'bg-emerald-500/10 border border-emerald-500/20'
                : 'bg-white/5 border border-white/5'
            }`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
              isCompleted ? 'bg-emerald-500' : 'bg-amber-500/20'
            }`}>
              {isCompleted ? (
                <Check className="w-3.5 h-3.5 text-white" />
              ) : (
                <span className="text-xs font-bold text-amber-400">{i + 1}</span>
              )}
            </div>
            <span className={`text-sm font-medium ${isCompleted ? 'text-emerald-300' : 'text-white/80'}`}>
              {lesson}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-white/40 text-xs italic">
        By the end of this lesson, you'll have actionable skills to implement immediately.
      </p>
    </div>
  )
})

// ============================================
// RESOURCES & TOOLS BLOCK
// ============================================

const ResourcesBlock = memo(function ResourcesBlock({
  resources
}: {
  resources: ModuleResource[]
}) {
  if (resources.length === 0) return null

  const getIcon = (type: string) => {
    switch (type) {
      case 'link': return <ExternalLink className="w-5 h-5 text-white" />
      case 'file': return <FileDown className="w-5 h-5 text-white" />
      case 'folder': return <Folder className="w-5 h-5 text-white" />
      default: return <Link2 className="w-5 h-5 text-white" />
    }
  }

  const getActionLabel = (type: string) => {
    switch (type) {
      case 'link': return 'Open'
      case 'file': return 'Download'
      case 'folder': return 'Open'
      default: return 'View'
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-white/[0.03] to-transparent p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Tools & Downloads</h3>
            <p className="text-white/40 text-xs">Everything mentioned in this video</p>
          </div>
        </div>
        {resources.length > 1 && (
          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <Download className="w-3.5 h-3.5" />
            Download All
          </button>
        )}
      </div>

      <div className="space-y-3">
        {resources.map((resource, i) => (
          <a
            key={i}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all hover:shadow-lg hover:shadow-amber-500/10"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform">
              {getIcon(resource.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                {resource.name}
              </div>
              <div className="text-sm text-white/50">
                {resource.description || `${getActionLabel(resource.type)} resource`}
                {resource.timestamp && (
                  <span className="text-amber-400/70"> • Mentioned at {resource.timestamp}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-xs font-medium text-white/70 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-all">
              {getActionLabel(resource.type)}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </a>
        ))}
      </div>
    </div>
  )
})

// ============================================
// USER NOTES SECTION
// ============================================

const UserNotes = memo(function UserNotes({
  moduleId,
  savedNote,
  onSave
}: {
  moduleId: string
  savedNote: string
  onSave: (note: string) => void
}) {
  const [note, setNote] = useState(savedNote)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Auto-save with debounce
  useEffect(() => {
    setNote(savedNote)
  }, [savedNote, moduleId])

  const handleChange = (value: string) => {
    setNote(value)
    setIsSaving(true)

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      onSave(value)
      setIsSaving(false)
      setLastSaved(new Date())
    }, 1000)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Edit3 className="w-5 h-5 text-white/50" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Your Notes</h3>
            <p className="text-white/40 text-xs">Private notes for this lesson</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          {isSaving ? (
            <>
              <div className="w-3 h-3 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : lastSaved ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400/70">Saved</span>
            </>
          ) : null}
        </div>
      </div>

      <textarea
        value={note}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Write your own shortcuts, script ideas, or timestamps here. Only you can see these notes."
        className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 resize-none focus:outline-none focus:border-amber-500/30 focus:ring-2 focus:ring-amber-500/10 transition-all text-sm"
      />

      <p className="mt-3 text-white/30 text-xs flex items-center gap-2">
        <Info className="w-3 h-3" />
        Notes are saved locally and only visible to you
      </p>
    </div>
  )
})

// ============================================
// MODULE SIDEBAR
// ============================================

const ModuleSidebar = memo(function ModuleSidebar({
  modules,
  currentModuleIndex,
  completedModules,
  videoProgress,
  onSelectModule,
  completedCount,
  totalModules
}: {
  modules: CourseModule[]
  currentModuleIndex: number
  completedModules: string[]
  videoProgress: Record<string, VideoProgress>
  onSelectModule: (index: number) => void
  completedCount: number
  totalModules: number
}) {
  const availableModules = modules.filter(m => !m.comingSoon)
  const progressPercent = totalModules > 0 ? (completedCount / totalModules) * 100 : 0

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-white/[0.03] to-transparent overflow-hidden">
      {/* Header with progress */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-black text-white">All Modules</h2>
          <span className="text-xs text-white/50">{completedCount}/{totalModules}</span>
        </div>
        {/* Progress bar */}
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-white/40">{progressPercent.toFixed(0)}% complete</p>
          <ActiveUsersIndicator />
        </div>
      </div>

      {/* All modules visible - no max-height scroll */}
      <div className="p-3 space-y-2">
        {modules.map((module, index) => {
          const isCurrent = currentModuleIndex === index
          const isCompleted = completedModules.includes(module.id)
          const isComingSoon = module.comingSoon
          const progress = videoProgress[module.id]
          const watchPercent = progress?.percent || 0

          return (
            <button
              key={module.id}
              onClick={() => !isComingSoon && onSelectModule(index)}
              disabled={isComingSoon}
              className={`w-full text-left rounded-xl overflow-hidden transition-all duration-200 group ${
                isComingSoon
                  ? 'opacity-60 cursor-not-allowed'
                  : isCurrent
                  ? 'ring-2 ring-amber-500 shadow-lg shadow-amber-500/20'
                  : 'hover:bg-white/5'
              }`}
            >
              {/* Thumbnail */}
              <div className={`relative aspect-video bg-gradient-to-br from-amber-500/20 to-yellow-500/10 ${isComingSoon ? 'grayscale' : ''}`}>
                {module.thumbnail ? (
                  <img
                    src={module.thumbnail}
                    alt={module.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ imageRendering: 'auto', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
                    loading="lazy"
                  />
                ) : module.wistiaId && !isComingSoon && (
                  <img
                    src={`https://fast.wistia.com/embed/medias/${module.wistiaId}/swatch`}
                    alt={module.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ imageRendering: 'auto', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
                    loading="lazy"
                  />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30" />

                {/* Module number */}
                <div className="absolute top-1 left-2 text-2xl font-black text-white/30">
                  {module.number}
                </div>

                {/* Play/Check/Lock button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isComingSoon
                      ? 'bg-white/20'
                      : isCurrent
                      ? 'bg-white'
                      : 'bg-white/80 group-hover:bg-white group-hover:scale-110'
                  }`}>
                    {isComingSoon ? (
                      <Lock className="w-5 h-5 text-white/60" />
                    ) : isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Play className={`w-5 h-5 ${isCurrent ? 'text-amber-500' : 'text-slate-600'}`} fill={isCurrent ? '#f59e0b' : '#475569'} />
                    )}
                  </div>
                </div>

                {/* Duration */}
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-sm">
                  <span className="text-[10px] font-bold text-white">{module.duration}</span>
                </div>

                {/* Status badge */}
                {isComingSoon && (
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-amber-500/80 text-[10px] font-bold text-white">
                    Coming Soon
                  </div>
                )}
                {isCompleted && !isComingSoon && (
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-emerald-500 text-[10px] font-bold text-white">
                    Done
                  </div>
                )}
                {isCurrent && !isCompleted && !isComingSoon && (
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-amber-500 text-[10px] font-bold text-white animate-pulse">
                    Playing
                  </div>
                )}

                {/* Progress bar */}
                {watchPercent > 0 && watchPercent < 100 && !isComingSoon && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/30">
                    <div className="h-full bg-amber-400" style={{ width: `${watchPercent}%` }} />
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="p-3">
                <h4 className={`text-sm font-bold leading-tight line-clamp-2 ${
                  isComingSoon ? 'text-white/50' : isCurrent ? 'text-amber-400' : 'text-white'
                }`}>
                  {module.title}
                </h4>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
})

// ============================================
// MOBILE MODULE DRAWER
// ============================================

const MobileModuleDrawer = memo(function MobileModuleDrawer({
  isOpen,
  onClose,
  modules,
  currentModuleIndex,
  completedModules,
  videoProgress,
  onSelectModule,
  completedCount,
  totalModules
}: {
  isOpen: boolean
  onClose: () => void
  modules: CourseModule[]
  currentModuleIndex: number
  completedModules: string[]
  videoProgress: Record<string, VideoProgress>
  onSelectModule: (index: number) => void
  completedCount: number
  totalModules: number
}) {
  const progressPercent = totalModules > 0 ? (completedCount / totalModules) * 100 : 0

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 sm:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-zinc-900 rounded-t-3xl border-t border-amber-500/20 animate-slide-up overflow-hidden">
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1.5 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="px-5 pb-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-black text-white">All Modules</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <X className="w-5 h-5 text-white/50" />
            </button>
          </div>
          {/* Progress bar */}
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-white/40 mt-2">{completedCount}/{totalModules} lessons completed</p>
        </div>

        {/* Module list - all modules including coming soon */}
        <div className="overflow-y-auto max-h-[65vh] p-4 space-y-3">
          {modules.map((module, index) => {
            const isCurrent = currentModuleIndex === index
            const isCompleted = completedModules.includes(module.id)
            const isComingSoon = module.comingSoon
            const progress = videoProgress[module.id]
            const watchPercent = progress?.percent || 0

            return (
              <button
                key={module.id}
                onClick={() => {
                  if (!isComingSoon) {
                    onSelectModule(index)
                    onClose()
                  }
                }}
                disabled={isComingSoon}
                className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all ${
                  isComingSoon
                    ? 'bg-white/5 border border-transparent opacity-60'
                    : isCurrent
                    ? 'bg-amber-500/10 border border-amber-500/30'
                    : 'bg-white/5 border border-transparent hover:border-white/10'
                }`}
              >
                {/* Module number */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isComingSoon
                    ? 'bg-white/10'
                    : isCompleted
                    ? 'bg-emerald-500'
                    : isCurrent
                    ? 'bg-amber-500'
                    : 'bg-white/10'
                }`}>
                  {isComingSoon ? (
                    <Lock className="w-5 h-5 text-white/40" />
                  ) : isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-lg font-black text-white">{module.number}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-bold text-sm truncate ${
                      isComingSoon ? 'text-white/50' : isCurrent ? 'text-amber-400' : 'text-white'
                    }`}>
                      {module.title}
                    </h4>
                    {isComingSoon && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold flex-shrink-0">
                        SOON
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-white/50">{module.duration}</span>
                    {watchPercent > 0 && watchPercent < 100 && !isComingSoon && (
                      <>
                        <span className="text-white/20">•</span>
                        <span className="text-xs text-amber-400">{Math.round(watchPercent)}% watched</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Status */}
                {isComingSoon ? (
                  <Lock className="w-4 h-4 text-white/30" />
                ) : isCurrent && !isCompleted ? (
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                ) : null}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
})

// ============================================
// MAIN PREMIUM COURSE COMPONENT
// ============================================

export const PremiumCourse = memo(function PremiumCourse({ state }: { state: CourseState }) {
  const [showCompletionToast, setShowCompletionToast] = useState(false)
  const [showMobileDrawer, setShowMobileDrawer] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)

  const currentModule = state.currentModule
  const isCompleted = state.completedModules.includes(currentModule.id)
  const isBookmarked = state.bookmarkedModules.includes(currentModule.id)
  const savedProgress = state.videoProgress[currentModule.id]
  const savedNote = state.moduleNotes[currentModule.id] || ''

  const canGoNext = state.currentModuleIndex < state.totalModules - 1 &&
    !state.config.modules[state.currentModuleIndex + 1]?.comingSoon
  const canGoPrev = state.currentModuleIndex > 0

  const nextModule = canGoNext ? state.config.modules[state.currentModuleIndex + 1] : null

  // Handle video end - auto mark complete
  const handleVideoEnd = useCallback(() => {
    if (!isCompleted) {
      state.markComplete()
      setJustCompleted(true)
      setShowCompletionToast(true)
    }
  }, [isCompleted, state])

  // Keyboard navigation
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.key.toLowerCase() === 'n' && canGoNext) {
        state.nextModule()
      } else if (e.key.toLowerCase() === 'p' && canGoPrev) {
        state.prevModule()
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [canGoNext, canGoPrev, state])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Completion Toast */}
      <CompletionToast
        show={showCompletionToast}
        lessonTitle={currentModule.title}
        nextLessonTitle={nextModule?.title}
        onGoNext={canGoNext ? () => {
          state.nextModule()
          setShowCompletionToast(false)
        } : undefined}
        onClose={() => setShowCompletionToast(false)}
      />

      {/* Mobile Drawer */}
      <MobileModuleDrawer
        isOpen={showMobileDrawer}
        onClose={() => setShowMobileDrawer(false)}
        modules={state.config.modules}
        currentModuleIndex={state.currentModuleIndex}
        completedModules={state.completedModules}
        videoProgress={state.videoProgress}
        onSelectModule={state.setCurrentModuleIndex}
        completedCount={state.completedModules.length}
        totalModules={state.totalModules}
      />

      {/* Mobile Header - Compact info */}
      <div className="lg:hidden flex items-center justify-between">
        <div>
          <p className="text-xs text-amber-400 font-bold">Now Playing: Module {currentModule.number}</p>
          <p className="text-[10px] text-white/50">
            {state.completedModules.length}/{state.totalModules} modules complete
          </p>
        </div>
      </div>

      {/* Continue Watching Banner */}
      {savedProgress && savedProgress.seconds > 10 && savedProgress.percent < 95 && !isCompleted && (
        <ContinueWatchingBanner
          lessonTitle={currentModule.title}
          savedTime={savedProgress.seconds}
          onResume={() => {}}
        />
      )}

      {/* Main Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Video + Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          {currentModule.wistiaId && !currentModule.comingSoon ? (
            <PremiumVideoPlayer
              wistiaId={currentModule.wistiaId}
              onVideoEnd={handleVideoEnd}
              onProgress={state.handleVideoProgress}
              resumeTime={savedProgress?.seconds || 0}
              title={currentModule.title}
              moduleNumber={currentModule.number}
            />
          ) : (
            <div className="aspect-video rounded-2xl sm:rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-amber-500/20 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-white/40" />
                </div>
                <p className="text-xl font-bold text-white mb-1">Coming Soon</p>
                <p className="text-sm text-white/50">This module is not yet available</p>
              </div>
            </div>
          )}

          {/* Lesson Header */}
          <LessonHeader
            module={currentModule}
            isCompleted={isCompleted}
            isBookmarked={isBookmarked}
            onMarkComplete={state.markComplete}
            onToggleBookmark={() => state.toggleBookmark(currentModule.id)}
            onNext={state.nextModule}
            canGoNext={canGoNext}
            completedCount={state.completedModules.length}
            totalModules={state.totalModules}
          />

          {/* Mobile: All Modules Section - RIGHT AFTER HEADER */}
          <div className="lg:hidden space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white">All Modules</h3>
              <span className="text-xs text-white/50">{state.completedModules.length}/{state.totalModules} complete</span>
            </div>

            {/* Progress bar */}
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-500"
                style={{ width: `${state.totalModules > 0 ? (state.completedModules.length / state.totalModules) * 100 : 0}%` }}
              />
            </div>

            {/* All modules grid with thumbnails */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {state.config.modules.map((module, index) => {
                const isCurrent = state.currentModuleIndex === index
                const isModuleCompleted = state.completedModules.includes(module.id)
                const isComingSoon = module.comingSoon
                const progress = state.videoProgress[module.id]
                const watchPercent = progress?.percent || 0

                return (
                  <button
                    key={module.id}
                    onClick={() => !isComingSoon && state.setCurrentModuleIndex(index)}
                    disabled={isComingSoon}
                    className={`w-full text-left rounded-2xl overflow-hidden transition-all group ${
                      isComingSoon
                        ? 'opacity-60 cursor-not-allowed'
                        : isCurrent
                        ? 'ring-2 ring-amber-500 shadow-lg shadow-amber-500/20'
                        : 'hover:ring-1 hover:ring-amber-500/30'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className={`relative aspect-video bg-gradient-to-br from-amber-500/20 to-yellow-500/10 ${isComingSoon ? 'grayscale' : ''}`}>
                      {module.thumbnail ? (
                        <img
                          src={module.thumbnail}
                          alt={module.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : module.wistiaId && !isComingSoon && (
                        <img
                          src={`https://fast.wistia.com/embed/medias/${module.wistiaId}/swatch`}
                          alt={module.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/30" />
                      <div className="absolute top-2 left-3 text-3xl font-black text-white/30">{module.number}</div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          isComingSoon ? 'bg-white/20' : isCurrent ? 'bg-white' : 'bg-white/80 group-hover:bg-white group-hover:scale-110'
                        }`}>
                          {isComingSoon ? <Lock className="w-6 h-6 text-white/60" /> : isModuleCompleted ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : <Play className={`w-6 h-6 ${isCurrent ? 'text-amber-500' : 'text-slate-600'}`} fill={isCurrent ? '#f59e0b' : '#475569'} />}
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm">
                        <span className="text-xs font-bold text-white">{module.duration}</span>
                      </div>
                      {isComingSoon && <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-amber-500/80 text-xs font-bold text-white">Coming Soon</div>}
                      {isModuleCompleted && !isComingSoon && <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-emerald-500 text-xs font-bold text-white">Done</div>}
                      {isCurrent && !isModuleCompleted && !isComingSoon && <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-amber-500 text-xs font-bold text-white animate-pulse">Now Playing</div>}
                      {watchPercent > 0 && watchPercent < 100 && !isComingSoon && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30"><div className="h-full bg-amber-400" style={{ width: `${watchPercent}%` }} /></div>
                      )}
                    </div>
                    <div className="p-3 bg-gradient-to-br from-white/[0.03] to-transparent border-t border-white/5">
                      <h4 className={`text-sm font-bold leading-tight line-clamp-2 ${isComingSoon ? 'text-white/50' : isCurrent ? 'text-amber-400' : 'text-white'}`}>{module.title}</h4>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* What You'll Learn */}
          <WhatYoullLearn
            lessons={currentModule.lessons}
            isCompleted={isCompleted}
          />

          {/* Resources */}
          <ResourcesBlock resources={currentModule.resources} />

          {/* Navigation Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={state.prevModule}
              disabled={!canGoPrev}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
                canGoPrev
                  ? 'text-white/70 hover:text-white hover:bg-white/5'
                  : 'text-white/30 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <span className="text-sm text-white/40 font-medium">
              {state.currentModuleIndex + 1} / {state.totalModules}
            </span>

            <button
              onClick={state.nextModule}
              disabled={!canGoNext}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
                canGoNext
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* User Notes - AT THE END */}
          <UserNotes
            moduleId={currentModule.id}
            savedNote={savedNote}
            onSave={(note) => state.saveNote(currentModule.id, note)}
          />
        </div>

        {/* Right Column: Module Sidebar (Desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <ModuleSidebar
              modules={state.config.modules}
              currentModuleIndex={state.currentModuleIndex}
              completedModules={state.completedModules}
              videoProgress={state.videoProgress}
              onSelectModule={state.setCurrentModuleIndex}
              completedCount={state.completedModules.length}
              totalModules={state.totalModules}
            />
          </div>
        </div>
      </div>
    </div>
  )
})

export default PremiumCourse
