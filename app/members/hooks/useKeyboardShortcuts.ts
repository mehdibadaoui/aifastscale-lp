'use client'

import { useEffect } from 'react'
import { PlatformStateType } from './usePlatformState'

// Keyboard shortcuts hook
export function useKeyboardShortcuts(state: PlatformStateType) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      // Escape to close any modal
      if (e.key === 'Escape') {
        if (state.showNotesModal) state.setShowNotesModal(false)
        if (state.showKeyboardModal) state.setShowKeyboardModal(false)
        if (state.showSettingsModal) state.setShowSettingsModal(false)
        if (state.showCertificateModal) state.setShowCertificateModal(false)
        if (state.showLogoutConfirm) state.setShowLogoutConfirm(false)
        return
      }

      if (e.key === '?') {
        state.setShowKeyboardModal(true)
        return
      }

      if (e.key.toLowerCase() === 'd' && !e.metaKey && !e.ctrlKey) {
        state.setDarkMode((d: boolean) => !d)
        return
      }

      if (e.key.toLowerCase() === 'n' && !e.metaKey && !e.ctrlKey) {
        if (state.activeSectionRef.current === 'course') {
          state.setShowNotesModal(true)
        }
        return
      }

      if (e.key.toLowerCase() === 'b' && !e.metaKey && !e.ctrlKey) {
        if (state.activeSectionRef.current === 'course') {
          state.toggleBookmark(state.currentModule.id)
        }
        return
      }

      if (e.key.toLowerCase() === 'm' && !e.metaKey && !e.ctrlKey) {
        if (state.activeSectionRef.current === 'course') {
          state.markComplete()
        }
        return
      }

      if (state.activeSectionRef.current === 'course') {
        const idx = state.currentModuleIndexRef.current
        const modules = state.config.modules
        if (e.key === 'ArrowRight' && idx < modules.length - 1 && !modules[idx + 1]?.comingSoon) {
          state.setCurrentModuleIndex(idx + 1)
        } else if (e.key === 'ArrowLeft' && idx > 0) {
          state.setCurrentModuleIndex(idx - 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state])
}
