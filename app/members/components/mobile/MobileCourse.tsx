'use client'

import { memo, useState, useEffect, useRef, useCallback } from 'react'
import {
  Play, Check, Lock, Clock, FileText, Download, ExternalLink,
  ChevronRight, ChevronDown, CheckCircle, Edit3, Info, Sparkles,
  ArrowRight, X, Bookmark, BookmarkCheck
} from 'lucide-react'
import { BottomSheet, useHapticFeedback } from './MobileNavigation'

// ============================================
// MOBILE COURSE PAGE - PREMIUM REDESIGN
// ============================================

interface MobileCourseProps {
  state: {
    modules: any[]
    currentModuleIndex: number
    setCurrentModuleIndex: (index: number) => void
    videoProgress: Record<string, any>
    completedModules: string[]
    markModuleComplete: (id: string) => void
    config: any
  }
}

// ============================================
// ANIMATED PROGRESS RING
// ============================================

const ProgressRing = memo(function ProgressRing({
  progress,
  size = 44,
  strokeWidth = 3,
}: {
  progress: number
  size?: number
  strokeWidth?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white">{Math.round(progress)}%</span>
      </div>
    </div>
  )
})

// ============================================
// COMPACT MODULE CARD
// ============================================

const ModuleCard = memo(function ModuleCard({
  module,
  index,
  isActive,
  isCompleted,
  watchPercent,
  onSelect,
  animationDelay,
}: {
  module: any
  index: number
  isActive: boolean
  isCompleted: boolean
  watchPercent: number
  onSelect: () => void
  animationDelay: number
}) {
  const isComingSoon = module.comingSoon
  const haptic = useHapticFeedback()

  return (
    <button
      onClick={() => {
        if (!isComingSoon) {
          haptic.trigger('light')
          onSelect()
        }
      }}
      disabled={isComingSoon}
      className={`
        group relative w-full flex items-center gap-3 p-3 rounded-2xl
        transition-all duration-300 ease-out
        ${isComingSoon ? 'opacity-50' : 'active:scale-[0.98]'}
        ${isActive
          ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/40'
          : 'bg-white/[0.03] border border-white/[0.06] hover:border-white/10'
        }
      `}
    >
      {/* Thumbnail */}
      <div className={`
        relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0
        ${isComingSoon ? 'grayscale' : ''}
      `}>
        {module.thumbnail ? (
          <img
            src={module.thumbnail}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : module.wistiaId && !isComingSoon ? (
          <img
            src={`https://fast.wistia.com/embed/medias/${module.wistiaId}/swatch`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-yellow-600/20" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Play/Status Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center
            transition-transform duration-200 group-active:scale-90
            ${isComingSoon
              ? 'bg-white/20'
              : isCompleted
                ? 'bg-emerald-500'
                : isActive
                  ? 'bg-white'
                  : 'bg-white/90'
            }
          `}>
            {isComingSoon ? (
              <Lock className="w-3.5 h-3.5 text-white/60" />
            ) : isCompleted ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <Play
                className={`w-4 h-4 ${isActive ? 'text-amber-500' : 'text-zinc-700'}`}
                fill={isActive ? '#f59e0b' : '#3f3f46'}
              />
            )}
          </div>
        </div>

        {/* Progress bar */}
        {watchPercent > 0 && watchPercent < 100 && !isComingSoon && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/30">
            <div
              className="h-full bg-amber-400 transition-all duration-300"
              style={{ width: `${watchPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`
            text-[10px] font-bold uppercase tracking-wider
            ${isActive ? 'text-amber-400' : 'text-white/40'}
          `}>
            Module {module.number}
          </span>
          {isActive && !isCompleted && !isComingSoon && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500 text-[9px] font-bold text-black">
              NOW
            </span>
          )}
          {isCompleted && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[9px] font-bold text-emerald-400">
              DONE
            </span>
          )}
          {isComingSoon && (
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-bold text-white/50">
              SOON
            </span>
          )}
        </div>
        <h4 className={`
          text-sm font-semibold leading-tight line-clamp-1
          ${isComingSoon ? 'text-white/40' : isActive ? 'text-white' : 'text-white/80'}
        `}>
          {module.title}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-white/40 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {module.duration}
          </span>
          {watchPercent > 0 && watchPercent < 100 && !isComingSoon && (
            <span className="text-[11px] text-amber-400/80">{Math.round(watchPercent)}%</span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className={`
        w-4 h-4 flex-shrink-0 transition-transform duration-200
        ${isActive ? 'text-amber-400' : 'text-white/20'}
        ${!isComingSoon ? 'group-active:translate-x-0.5' : ''}
      `} />
    </button>
  )
})

// ============================================
// INLINE USER NOTES
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
  const [showSaved, setShowSaved] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    setNote(savedNote)
  }, [savedNote, moduleId])

  const handleChange = (value: string) => {
    setNote(value)
    setIsSaving(true)

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

    saveTimeoutRef.current = setTimeout(() => {
      onSave(value)
      setIsSaving(false)
      setShowSaved(true)
      setTimeout(() => setShowSaved(false), 2000)
    }, 800)
  }

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
            <Edit3 className="w-4 h-4 text-white/40" />
          </div>
          <span className="text-sm font-medium text-white/70">Notes</span>
        </div>
        <div className="text-[11px] text-white/40">
          {isSaving ? (
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Saving
            </span>
          ) : showSaved ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" />
              Saved
            </span>
          ) : null}
        </div>
      </div>
      <textarea
        value={note}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Add notes for this lesson..."
        className="
          w-full h-24 bg-white/[0.03] border border-white/[0.08] rounded-xl p-3
          text-white text-sm placeholder-white/25 resize-none
          focus:outline-none focus:border-amber-500/30 focus:bg-white/[0.05]
          transition-all duration-200
        "
      />
    </div>
  )
})

// ============================================
// MAIN COMPONENT
// ============================================

export const MobileCourse = memo(function MobileCourse({ state }: MobileCourseProps) {
  const [showResources, setShowResources] = useState(false)
  const [userNotes, setUserNotes] = useState('')
  const [isVideoVisible, setIsVideoVisible] = useState(true)
  const videoRef = useRef<HTMLDivElement>(null)
  const haptic = useHapticFeedback()

  const currentModule = state.modules[state.currentModuleIndex]
  const isCompleted = state.completedModules.includes(currentModule?.id)
  const progress = state.videoProgress[currentModule?.id] || { seconds: 0, percent: 0 }

  // Stats
  const availableModules = state.modules.filter(m => !m.comingSoon)
  const completedCount = state.completedModules.filter(id =>
    availableModules.some(m => m.id === id)
  ).length
  const overallProgress = availableModules.length > 0
    ? (completedCount / availableModules.length) * 100
    : 0

  // Load notes
  useEffect(() => {
    if (currentModule?.id) {
      const saved = localStorage.getItem(`notes_${currentModule.id}`)
      setUserNotes(saved || '')
    }
  }, [currentModule?.id])

  // Save notes
  const saveNotes = useCallback((note: string) => {
    if (currentModule?.id) {
      localStorage.setItem(`notes_${currentModule.id}`, note)
      setUserNotes(note)
    }
  }, [currentModule?.id])

  // Video visibility observer
  useEffect(() => {
    if (!videoRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsVideoVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(videoRef.current)
    return () => observer.disconnect()
  }, [])

  // Navigation
  const canGoNext = state.modules.slice(state.currentModuleIndex + 1).some(m => !m.comingSoon)
  const canGoPrev = state.modules.slice(0, state.currentModuleIndex).some(m => !m.comingSoon)

  const goToNextLesson = () => {
    for (let i = state.currentModuleIndex + 1; i < state.modules.length; i++) {
      if (!state.modules[i].comingSoon) {
        haptic.trigger('medium')
        state.setCurrentModuleIndex(i)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
    }
  }

  const handleMarkComplete = () => {
    haptic.trigger('heavy')
    state.markModuleComplete(currentModule.id)
  }

  if (!currentModule) return null

  return (
    <div
      className="min-h-screen bg-[#09090b]"
      style={{
        backgroundColor: '#09090b',
        minHeight: '100dvh',
        overscrollBehavior: 'none',
      }}
    >
      {/* ===== STICKY HEADER ===== */}
      <header className="sticky top-0 z-40 bg-[#09090b]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <ProgressRing progress={overallProgress} size={40} strokeWidth={3} />
            <div>
              <h1 className="text-base font-bold text-white">Course</h1>
              <p className="text-[11px] text-white/40">
                {completedCount} of {availableModules.length} done
              </p>
            </div>
          </div>
          {currentModule.resources?.length > 0 && (
            <button
              onClick={() => {
                haptic.trigger('light')
                setShowResources(true)
              }}
              className="
                flex items-center gap-1.5 px-3 py-1.5 rounded-full
                bg-white/[0.05] border border-white/[0.08]
                text-xs font-medium text-white/70
                active:scale-95 transition-transform
              "
            >
              <FileText className="w-3.5 h-3.5" />
              {currentModule.resources.length}
            </button>
          )}
        </div>
      </header>

      {/* ===== VIDEO SECTION ===== */}
      <section ref={videoRef} className="relative bg-black">
        {currentModule.comingSoon ? (
          <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6 text-white/30" />
              </div>
              <p className="text-base font-semibold text-white/70">Coming Soon</p>
              <p className="text-sm text-white/40 mt-1">This module is not yet available</p>
            </div>
          </div>
        ) : (
          <div className="relative aspect-video">
            <div className="wistia_responsive_padding" style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
              <div className="wistia_responsive_wrapper" style={{ height: '100%', left: 0, position: 'absolute', top: 0, width: '100%' }}>
                <div
                  className={`wistia_embed wistia_async_${currentModule.wistiaId} seo=true videoFoam=true`}
                  style={{ height: '100%', position: 'relative', width: '100%' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Video progress bar */}
        {!currentModule.comingSoon && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-300"
              style={{ width: `${progress.percent || 0}%` }}
            />
          </div>
        )}
      </section>

      {/* ===== CURRENT MODULE INFO ===== */}
      <section className="px-4 py-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-amber-400 text-xs font-bold">MODULE {currentModule.number}</span>
              <span className="text-white/30">•</span>
              <span className="text-white/40 text-xs">{currentModule.duration}</span>
              {isCompleted && (
                <span className="ml-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  COMPLETED
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">{currentModule.title}</h2>
          </div>
        </div>

        {/* Action buttons */}
        {!currentModule.comingSoon && (
          <div className="flex gap-2">
            {!isCompleted ? (
              <button
                onClick={handleMarkComplete}
                className="
                  flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl
                  bg-gradient-to-r from-amber-500 to-yellow-500
                  text-black text-sm font-bold
                  active:scale-[0.98] transition-all duration-200
                  shadow-lg shadow-amber-500/20
                "
              >
                <CheckCircle className="w-4 h-4" />
                Mark Complete
              </button>
            ) : (
              <button
                onClick={goToNextLesson}
                disabled={!canGoNext}
                className="
                  flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl
                  bg-gradient-to-r from-emerald-500/20 to-emerald-500/10
                  border border-emerald-500/30
                  text-emerald-400 text-sm font-bold
                  active:scale-[0.98] transition-all duration-200
                  disabled:opacity-50
                "
              >
                Next Lesson
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </section>

      {/* ===== DIVIDER ===== */}
      <div className="h-2 bg-white/[0.02]" />

      {/* ===== ALL MODULES ===== */}
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white">All Modules</h3>
          <span className="text-xs text-white/40">{completedCount}/{availableModules.length}</span>
        </div>

        {/* Module list */}
        <div className="space-y-2">
          {state.modules.map((module, index) => {
            const moduleProgress = state.videoProgress[module.id]
            return (
              <ModuleCard
                key={module.id}
                module={module}
                index={index}
                isActive={state.currentModuleIndex === index}
                isCompleted={state.completedModules.includes(module.id)}
                watchPercent={moduleProgress?.percent || 0}
                onSelect={() => {
                  state.setCurrentModuleIndex(index)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                animationDelay={index * 50}
              />
            )
          })}
        </div>
      </section>

      {/* ===== NOTES SECTION ===== */}
      <section className="px-4 pb-32">
        <UserNotes
          moduleId={currentModule?.id || ''}
          savedNote={userNotes}
          onSave={saveNotes}
        />
      </section>

      {/* ===== FLOATING MINI PLAYER ===== */}
      {!isVideoVisible && !currentModule.comingSoon && (
        <div
          className="
            fixed top-0 left-0 right-0 z-50
            bg-[#09090b]/95 backdrop-blur-xl
            border-b border-white/[0.06]
            animate-slide-down
          "
        >
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-14 h-9 rounded-lg bg-black/50 flex items-center justify-center overflow-hidden">
              {currentModule.thumbnail || currentModule.wistiaId ? (
                <img
                  src={currentModule.thumbnail || `https://fast.wistia.com/embed/medias/${currentModule.wistiaId}/swatch`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <Play className="w-4 h-4 text-amber-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-amber-400 font-bold">Module {currentModule.number}</p>
              <p className="text-sm font-medium text-white truncate">{currentModule.title}</p>
            </div>
            <button
              onClick={() => {
                haptic.trigger('light')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="
                px-3 py-1.5 rounded-lg
                bg-amber-500/20 text-amber-400 text-xs font-bold
                active:scale-95 transition-transform
              "
            >
              Watch
            </button>
          </div>
          <div className="h-0.5 bg-white/5">
            <div
              className="h-full bg-amber-500"
              style={{ width: `${progress.percent || 0}%` }}
            />
          </div>
        </div>
      )}

      {/* ===== RESOURCES SHEET ===== */}
      <BottomSheet
        isOpen={showResources}
        onClose={() => setShowResources(false)}
        title="Resources"
        height="auto"
      >
        <div className="px-4 pb-8 space-y-2">
          {currentModule.resources?.length > 0 ? (
            currentModule.resources.map((resource: any, i: number) => (
              <a
                key={i}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => haptic.trigger('light')}
                className="
                  flex items-center gap-3 p-3 rounded-xl
                  bg-white/[0.03] border border-white/[0.06]
                  active:bg-white/[0.06] transition-colors
                "
              >
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center
                  ${resource.type === 'file' ? 'bg-blue-500/20' : resource.type === 'folder' ? 'bg-amber-500/20' : 'bg-emerald-500/20'}
                `}>
                  {resource.type === 'file' ? (
                    <Download className="w-5 h-5 text-blue-400" />
                  ) : resource.type === 'folder' ? (
                    <FileText className="w-5 h-5 text-amber-400" />
                  ) : (
                    <ExternalLink className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm">{resource.name}</p>
                  {resource.description && (
                    <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{resource.description}</p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-white/20" />
              </a>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-white/20" />
              </div>
              <p className="text-white/40 text-sm">No resources available</p>
            </div>
          )}
        </div>
      </BottomSheet>

    </div>
  )
})

export default MobileCourse
