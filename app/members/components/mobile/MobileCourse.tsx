'use client'

import { memo, useState, useEffect, useRef, useCallback } from 'react'
import {
  Play, ChevronRight, Check, Lock, Clock,
  FileText, Download, ExternalLink,
  CheckCircle, Edit3, Info
} from 'lucide-react'
import { BottomSheet, useHapticFeedback } from './MobileNavigation'

// ============================================
// MOBILE COURSE PAGE
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
// USER NOTES COMPONENT (INLINE)
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
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Edit3 className="w-4 h-4 text-white/50" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Your Notes</h3>
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
        className="w-full h-28 bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/30 resize-none focus:outline-none focus:border-amber-500/30 focus:ring-2 focus:ring-amber-500/10 transition-all text-sm"
      />

      <p className="mt-2 text-white/30 text-xs flex items-center gap-2">
        <Info className="w-3 h-3" />
        Notes are saved locally and only visible to you
      </p>
    </div>
  )
})

export const MobileCourse = memo(function MobileCourse({ state }: MobileCourseProps) {
  const [showResources, setShowResources] = useState(false)
  const [showMiniPlayer, setShowMiniPlayer] = useState(false)
  const [userNotes, setUserNotes] = useState('')
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const haptic = useHapticFeedback()

  const currentModule = state.modules[state.currentModuleIndex]
  const isCompleted = state.completedModules.includes(currentModule?.id)
  const progress = state.videoProgress[currentModule?.id] || { seconds: 0, percent: 0 }

  // Count available (non-coming-soon) modules
  const availableModules = state.modules.filter(m => !m.comingSoon)
  const completedCount = state.completedModules.filter(id =>
    availableModules.some(m => m.id === id)
  ).length

  // Load notes from localStorage
  useEffect(() => {
    if (currentModule?.id) {
      const savedNotes = localStorage.getItem(`notes_${currentModule.id}`)
      if (savedNotes) setUserNotes(savedNotes)
      else setUserNotes('')
    }
  }, [currentModule?.id])

  // Auto-save notes
  useEffect(() => {
    if (!currentModule?.id) return
    const timer = setTimeout(() => {
      localStorage.setItem(`notes_${currentModule.id}`, userNotes)
    }, 1000)
    return () => clearTimeout(timer)
  }, [userNotes, currentModule?.id])

  // Show mini player on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (videoContainerRef.current) {
        const rect = videoContainerRef.current.getBoundingClientRect()
        setShowMiniPlayer(rect.bottom < 0)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const goToNextLesson = useCallback(() => {
    // Find next non-coming-soon module
    for (let i = state.currentModuleIndex + 1; i < state.modules.length; i++) {
      if (!state.modules[i].comingSoon) {
        haptic.trigger('medium')
        state.setCurrentModuleIndex(i)
        return
      }
    }
  }, [state.currentModuleIndex, state.modules])

  const goToPrevLesson = useCallback(() => {
    // Find previous non-coming-soon module
    for (let i = state.currentModuleIndex - 1; i >= 0; i--) {
      if (!state.modules[i].comingSoon) {
        haptic.trigger('medium')
        state.setCurrentModuleIndex(i)
        return
      }
    }
  }, [state.currentModuleIndex, state.modules])

  const handleMarkComplete = () => {
    haptic.trigger('heavy')
    state.markModuleComplete(currentModule.id)
  }

  // Check if can go prev/next (excluding coming soon)
  const canGoPrev = state.modules.slice(0, state.currentModuleIndex).some(m => !m.comingSoon)
  const canGoNext = state.modules.slice(state.currentModuleIndex + 1).some(m => !m.comingSoon)

  if (!currentModule) return null

  return (
    <div className="min-h-screen pb-28 bg-zinc-950">
      {/* HEADER - Course Progress */}
      <div className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">Course</h1>
            <p className="text-xs text-white/50">{completedCount}/{availableModules.length} completed</p>
          </div>
          <div className="flex-1 mx-4">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${availableModules.length > 0 ? (completedCount / availableModules.length) * 100 : 0}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-bold text-amber-400">{Math.round(availableModules.length > 0 ? (completedCount / availableModules.length) * 100 : 0)}%</span>
        </div>
      </div>

      {/* ALL MODULES - HORIZONTAL SCROLL (ALWAYS VISIBLE) */}
      <div className="px-4 py-3 bg-zinc-900/50 border-b border-white/5">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1" style={{ WebkitOverflowScrolling: 'touch' }}>
          {state.modules.map((module, index) => {
            const moduleCompleted = state.completedModules.includes(module.id)
            const isCurrent = index === state.currentModuleIndex
            const isComingSoon = module.comingSoon

            return (
              <button
                key={module.id}
                onClick={() => {
                  if (!isComingSoon) {
                    haptic.trigger('medium')
                    state.setCurrentModuleIndex(index)
                  }
                }}
                disabled={isComingSoon}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                  isComingSoon
                    ? 'bg-white/5 border border-white/5 opacity-50'
                    : isCurrent
                    ? 'bg-amber-500/20 border border-amber-500/40'
                    : moduleCompleted
                    ? 'bg-emerald-500/10 border border-emerald-500/30'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  moduleCompleted ? 'bg-emerald-500' : isCurrent ? 'bg-amber-500' : 'bg-white/10'
                }`}>
                  {moduleCompleted ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : isComingSoon ? (
                    <Lock className="w-3.5 h-3.5 text-white/40" />
                  ) : (
                    <span className="text-xs font-bold text-white">{module.number}</span>
                  )}
                </div>
                <span className={`text-xs font-medium whitespace-nowrap ${
                  isCurrent ? 'text-amber-400' : moduleCompleted ? 'text-emerald-400' : 'text-white/70'
                }`}>
                  {module.title.length > 15 ? module.title.slice(0, 15) + '...' : module.title}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* VIDEO PLAYER SECTION */}
      <div ref={videoContainerRef} className="relative bg-black">
        {/* Video Container - 16:9 aspect ratio */}
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          {currentModule.comingSoon ? (
            // Coming soon placeholder
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-7 h-7 text-white/40" />
                </div>
                <p className="text-lg font-bold text-white mb-1">Coming Soon</p>
                <p className="text-sm text-white/50">This module is not yet available</p>
              </div>
            </div>
          ) : (
            // Wistia Video Embed
            <div className="absolute inset-0">
              <div
                className="wistia_responsive_padding"
                style={{ padding: '56.25% 0 0 0', position: 'relative' }}
              >
                <div
                  className="wistia_responsive_wrapper"
                  style={{ height: '100%', left: 0, position: 'absolute', top: 0, width: '100%' }}
                >
                  <div
                    className={`wistia_embed wistia_async_${currentModule.wistiaId} seo=true videoFoam=true`}
                    style={{ height: '100%', position: 'relative', width: '100%' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Progress bar under video */}
        {!currentModule.comingSoon && (
          <div className="h-1 bg-white/10">
            <div
              className="h-full bg-amber-500 transition-all duration-300"
              style={{ width: `${progress.percent || 0}%` }}
            />
          </div>
        )}
      </div>

      {/* LESSON INFO - COMPACT */}
      <div className="px-4 py-3 space-y-3">
        {/* Title & status row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-amber-400 text-xs font-bold">MODULE {currentModule.number}</span>
              <span className="text-white/30 text-xs">{currentModule.duration}</span>
            </div>
            <h2 className="text-lg font-bold text-white leading-tight">{currentModule.title}</h2>
          </div>
          {isCompleted && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/20">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">Done</span>
            </div>
          )}
        </div>

        {/* Quick action buttons - only show for available modules */}
        {!currentModule.comingSoon && (
          <div className="flex gap-2">
            {!isCompleted ? (
              <button
                onClick={handleMarkComplete}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold active:scale-[0.98] transition-transform"
              >
                <Check className="w-5 h-5" />
                Mark Complete
              </button>
            ) : (
              <button
                onClick={goToNextLesson}
                disabled={!canGoNext}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold active:scale-[0.98] transition-transform disabled:opacity-50"
              >
                Next Lesson
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => {
                haptic.trigger('light')
                setShowResources(true)
              }}
              className="flex items-center justify-center gap-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold active:scale-[0.98] transition-transform"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm">{currentModule.resources?.length || 0}</span>
            </button>
          </div>
        )}
      </div>

      {/* ALL MODULES - THUMBNAIL GRID (MATCHING DESKTOP) */}
      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white">All Modules</h3>
          <span className="text-xs text-white/50">{completedCount}/{availableModules.length} complete</span>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-500"
            style={{ width: `${availableModules.length > 0 ? (completedCount / availableModules.length) * 100 : 0}%` }}
          />
        </div>

        {/* Thumbnail grid */}
        <div className="grid grid-cols-1 gap-4">
          {state.modules.map((module, index) => {
            const moduleCompleted = state.completedModules.includes(module.id)
            const moduleProgress = state.videoProgress[module.id]
            const isCurrent = index === state.currentModuleIndex
            const isComingSoon = module.comingSoon
            const watchPercent = moduleProgress?.percent || 0

            return (
              <button
                key={module.id}
                onClick={() => {
                  if (!isComingSoon) {
                    haptic.trigger('medium')
                    state.setCurrentModuleIndex(index)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                }}
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

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/30" />

                  {/* Module number watermark */}
                  <div className="absolute top-2 left-3 text-3xl font-black text-white/30">
                    {module.number}
                  </div>

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isComingSoon ? 'bg-white/20' : isCurrent ? 'bg-white' : 'bg-white/80 group-active:bg-white group-active:scale-110'
                    }`}>
                      {isComingSoon ? (
                        <Lock className="w-6 h-6 text-white/60" />
                      ) : moduleCompleted ? (
                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                      ) : (
                        <Play className={`w-6 h-6 ${isCurrent ? 'text-amber-500' : 'text-slate-600'}`} fill={isCurrent ? '#f59e0b' : '#475569'} />
                      )}
                    </div>
                  </div>

                  {/* Duration badge */}
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm">
                    <span className="text-xs font-bold text-white">{module.duration}</span>
                  </div>

                  {/* Status badges */}
                  {isComingSoon && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-amber-500/80 text-xs font-bold text-white">
                      Coming Soon
                    </div>
                  )}
                  {moduleCompleted && !isComingSoon && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-emerald-500 text-xs font-bold text-white">
                      Done
                    </div>
                  )}
                  {isCurrent && !moduleCompleted && !isComingSoon && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-amber-500 text-xs font-bold text-white animate-pulse">
                      Now Playing
                    </div>
                  )}

                  {/* Progress bar */}
                  {watchPercent > 0 && watchPercent < 100 && !isComingSoon && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                      <div className="h-full bg-amber-400" style={{ width: `${watchPercent}%` }} />
                    </div>
                  )}
                </div>

                {/* Title */}
                <div className="p-3 bg-gradient-to-br from-white/[0.03] to-transparent border-t border-white/5">
                  <h4 className={`text-sm font-bold leading-tight line-clamp-2 ${
                    isComingSoon ? 'text-white/50' : isCurrent ? 'text-amber-400' : 'text-white'
                  }`}>
                    {module.title}
                  </h4>
                  {moduleProgress?.percent > 0 && !moduleCompleted && !isComingSoon && (
                    <p className="text-xs text-amber-400 mt-1">{Math.round(moduleProgress.percent)}% watched</p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* USER NOTES - INLINE AT THE END */}
      <div className="px-4 pb-6">
        <UserNotes
          moduleId={currentModule?.id || ''}
          savedNote={userNotes}
          onSave={(note) => {
            setUserNotes(note)
          }}
        />
      </div>

      {/* STICKY MINI PLAYER */}
      {showMiniPlayer && !currentModule.comingSoon && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-xl border-b border-white/10 animate-slide-down">
          <div className="flex items-center gap-3 p-3">
            {/* Mini thumbnail */}
            <div className="w-16 h-10 rounded-lg bg-black/50 flex items-center justify-center overflow-hidden">
              <Play className="w-4 h-4 text-amber-400" />
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-amber-400 font-bold">Module {currentModule.number}</p>
              <p className="text-sm font-bold text-white truncate">{currentModule.title}</p>
            </div>
            {/* Scroll to video */}
            <button
              onClick={() => {
                haptic.trigger('light')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="px-3 py-2 rounded-lg bg-amber-500/20 text-amber-400 text-sm font-bold"
            >
              Watch
            </button>
          </div>
          {/* Progress */}
          <div className="h-0.5 bg-white/10">
            <div
              className="h-full bg-amber-500"
              style={{ width: `${progress.percent || 0}%` }}
            />
          </div>
        </div>
      )}

      {/* RESOURCES BOTTOM SHEET */}
      <BottomSheet
        isOpen={showResources}
        onClose={() => setShowResources(false)}
        title="Resources & Tools"
        height="auto"
      >
        <div className="px-4 pb-6 space-y-3">
          {currentModule.resources && currentModule.resources.length > 0 ? (
            currentModule.resources.map((resource: any, i: number) => (
              <a
                key={i}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => haptic.trigger('light')}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 active:bg-white/10 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  resource.type === 'file' ? 'bg-blue-500/20' :
                  resource.type === 'folder' ? 'bg-amber-500/20' : 'bg-emerald-500/20'
                }`}>
                  {resource.type === 'file' ? (
                    <Download className={`w-6 h-6 ${
                      resource.type === 'file' ? 'text-blue-400' : 'text-emerald-400'
                    }`} />
                  ) : resource.type === 'folder' ? (
                    <FileText className="w-6 h-6 text-amber-400" />
                  ) : (
                    <ExternalLink className="w-6 h-6 text-emerald-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white">{resource.name}</p>
                  {resource.description && (
                    <p className="text-sm text-white/50 mt-0.5">{resource.description}</p>
                  )}
                  {resource.timestamp && (
                    <p className="text-xs text-amber-400 mt-1">@ {resource.timestamp}</p>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-white/30" />
              </a>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white/20" />
              </div>
              <p className="text-white/40">No resources for this lesson</p>
            </div>
          )}
        </div>
      </BottomSheet>

    </div>
  )
})

export default MobileCourse
