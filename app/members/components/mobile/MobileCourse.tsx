'use client'

import { memo, useState, useEffect, useRef, useCallback } from 'react'
import {
  Play, Pause, ChevronLeft, ChevronRight, Check, Lock, Clock,
  FileText, Download, ExternalLink, X, ChevronDown, ChevronUp,
  Bookmark, Share2, RotateCcw, SkipForward, Volume2, VolumeX,
  Maximize, List, StickyNote
} from 'lucide-react'
import { BottomSheet, TouchButton, useHapticFeedback } from './MobileNavigation'
import Image from 'next/image'

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

export const MobileCourse = memo(function MobileCourse({ state }: MobileCourseProps) {
  const [showResources, setShowResources] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [showMiniPlayer, setShowMiniPlayer] = useState(false)
  const [userNotes, setUserNotes] = useState('')
  const [notesSaved, setNotesSaved] = useState(false)
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
      if (userNotes) {
        setNotesSaved(true)
        setTimeout(() => setNotesSaved(false), 2000)
      }
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
    <div className="min-h-screen pb-28">
      {/* VIDEO PLAYER SECTION */}
      <div ref={videoContainerRef} className="relative bg-black">
        {/* Video Container - 16:9 aspect ratio */}
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          {currentModule.comingSoon ? (
            // Coming soon placeholder
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-white/40" />
                </div>
                <p className="text-xl font-bold text-white mb-1">Coming Soon</p>
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

      {/* LESSON INFO */}
      <div className="px-4 py-4 space-y-4">
        {/* Module number & completion status */}
        <div className="flex items-center justify-between">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
            Module {currentModule.number}
          </span>
          {isCompleted && (
            <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
              <Check className="w-3.5 h-3.5" />
              Completed
            </span>
          )}
          {currentModule.comingSoon && (
            <span className="flex items-center gap-1 text-amber-400 text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              Coming Soon
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-xl font-black text-white leading-tight">
          {currentModule.title}
        </h1>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm text-white/50">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {currentModule.duration}
          </span>
          {progress.seconds > 0 && !currentModule.comingSoon && (
            <span className="text-amber-400">
              {Math.floor(progress.seconds / 60)}:{String(Math.floor(progress.seconds % 60)).padStart(2, '0')} watched
            </span>
          )}
        </div>

        {/* Quick action buttons - only show for available modules */}
        {!currentModule.comingSoon && (
          <div className="flex gap-2">
            {!isCompleted && (
              <button
                onClick={handleMarkComplete}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold active:scale-[0.98] transition-transform"
              >
                <Check className="w-5 h-5" />
                Mark Complete
              </button>
            )}
            <button
              onClick={() => {
                haptic.trigger('light')
                setShowResources(true)
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold active:scale-[0.98] transition-transform"
            >
              <FileText className="w-5 h-5" />
              {currentModule.resources?.length || 0}
            </button>
            <button
              onClick={() => {
                haptic.trigger('light')
                setShowNotes(true)
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold active:scale-[0.98] transition-transform"
            >
              <StickyNote className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* LESSON NAVIGATION */}
      <div className="px-4 py-2">
        <div className="flex gap-2">
          <button
            onClick={goToPrevLesson}
            disabled={!canGoPrev}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border transition-all active:scale-[0.98] ${
              !canGoPrev
                ? 'bg-white/5 border-white/5 text-white/30 cursor-not-allowed'
                : 'bg-white/5 border-white/10 text-white'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>
          <button
            onClick={goToNextLesson}
            disabled={!canGoNext}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border transition-all active:scale-[0.98] ${
              !canGoNext
                ? 'bg-white/5 border-white/5 text-white/30 cursor-not-allowed'
                : 'bg-amber-500/20 border-amber-500/30 text-amber-400'
            }`}
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* WHAT YOU'LL LEARN */}
      {currentModule.lessons && currentModule.lessons.length > 0 && !currentModule.comingSoon && (
        <div className="px-4 py-4">
          <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-3">
            What You'll Learn
          </h3>
          <div className="space-y-2">
            {currentModule.lessons.map((item: string, i: number) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/5"
              >
                <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-amber-400" />
                </div>
                <p className="text-sm text-white/80">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALL MODULES LIST - VISIBLE ON PAGE */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider">
            All Modules
          </h3>
          <span className="text-xs text-white/40">
            {completedCount}/{availableModules.length} complete
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
            style={{ width: `${availableModules.length > 0 ? (completedCount / availableModules.length) * 100 : 0}%` }}
          />
        </div>

        {/* Module cards */}
        <div className="space-y-3">
          {state.modules.map((module, index) => {
            const moduleCompleted = state.completedModules.includes(module.id)
            const moduleProgress = state.videoProgress[module.id]
            const isCurrent = index === state.currentModuleIndex
            const isComingSoon = module.comingSoon

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
                className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  isComingSoon
                    ? 'bg-white/5 border-white/5 opacity-60'
                    : isCurrent
                    ? 'bg-amber-500/10 border-amber-500/30 active:scale-[0.98]'
                    : moduleCompleted
                    ? 'bg-emerald-500/5 border-emerald-500/20 active:scale-[0.98]'
                    : 'bg-white/5 border-white/10 active:bg-white/10 active:scale-[0.98]'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative w-20 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-amber-500/20 to-yellow-500/10">
                  {module.wistiaId && !isComingSoon ? (
                    <Image
                      src={`https://fast.wistia.com/embed/medias/${module.wistiaId}/swatch`}
                      alt={module.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isComingSoon ? (
                        <Lock className="w-4 h-4 text-white/30" />
                      ) : (
                        <span className="text-lg font-black text-white/30">{module.number}</span>
                      )}
                    </div>
                  )}

                  {/* Play overlay */}
                  {!isComingSoon && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      {moduleCompleted ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center animate-pulse">
                          <Play className="w-3 h-3 text-black" fill="black" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center">
                          <Play className="w-3 h-3 text-black" fill="black" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Duration badge */}
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-[10px] font-bold text-white">
                    {module.duration}
                  </div>

                  {/* Progress bar */}
                  {moduleProgress?.percent > 0 && !moduleCompleted && !isComingSoon && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/50">
                      <div
                        className="h-full bg-amber-400"
                        style={{ width: `${moduleProgress.percent}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Module info */}
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      isCurrent ? 'text-amber-400' : 'text-white/40'
                    }`}>
                      Module {module.number}
                    </span>
                    {isComingSoon && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                        SOON
                      </span>
                    )}
                  </div>
                  <p className={`font-bold text-sm truncate mt-0.5 ${
                    isComingSoon ? 'text-white/50' : isCurrent ? 'text-amber-400' : 'text-white'
                  }`}>
                    {module.title}
                  </p>
                  {moduleProgress?.seconds > 0 && !moduleCompleted && !isComingSoon && (
                    <p className="text-[10px] text-amber-400 mt-0.5">
                      Resume at {Math.floor(moduleProgress.seconds / 60)}:{String(Math.floor(moduleProgress.seconds % 60)).padStart(2, '0')}
                    </p>
                  )}
                </div>

                {/* Status indicator */}
                <div className="flex-shrink-0">
                  {isComingSoon ? (
                    <Lock className="w-4 h-4 text-white/30" />
                  ) : moduleCompleted ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                      <Play className="w-3 h-3 text-black" fill="black" />
                    </div>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-white/30" />
                  )}
                </div>
              </button>
            )
          })}
        </div>
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

      {/* NOTES BOTTOM SHEET */}
      <BottomSheet
        isOpen={showNotes}
        onClose={() => setShowNotes(false)}
        title="Your Notes"
        height="half"
      >
        <div className="px-4 pb-6">
          <textarea
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            placeholder="Type your notes here..."
            className="w-full h-48 p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 resize-none focus:outline-none focus:border-amber-500/50 transition-colors"
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-white/40">
              {notesSaved ? (
                <span className="text-emerald-400">Saved!</span>
              ) : userNotes ? (
                'Auto-saves as you type'
              ) : (
                'Notes are saved locally'
              )}
            </p>
            <p className="text-xs text-white/40">
              {userNotes.length} characters
            </p>
          </div>
        </div>
      </BottomSheet>
    </div>
  )
})

export default MobileCourse
