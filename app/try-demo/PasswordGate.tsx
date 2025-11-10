'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'

interface PasswordGateProps {
  children: React.ReactNode
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const [password, setPassword] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [error, setError] = useState('')

  // Check if already unlocked in this session
  if (typeof window !== 'undefined') {
    const sessionUnlocked = sessionStorage.getItem('demo_unlocked')
    if (sessionUnlocked === 'true' && !isUnlocked) {
      setIsUnlocked(true)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple password check - change this password to whatever you want
    if (password === 'demo2025') {
      setIsUnlocked(true)
      sessionStorage.setItem('demo_unlocked', 'true')
      setError('')
    } else {
      setError('Incorrect password')
    }
  }

  if (isUnlocked) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Demo Access
          </h1>
          <p className="text-gray-400 text-center mb-6">
            This page is password protected
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-colors"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-3 rounded-lg hover:from-yellow-400 hover:to-orange-400 transition-all"
            >
              Unlock Demo
            </button>
          </form>

          <p className="text-gray-500 text-xs text-center mt-6">
            Contact support if you need access
          </p>
        </div>
      </div>
    </div>
  )
}
