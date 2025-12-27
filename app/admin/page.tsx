'use client'

import { useState, useEffect } from 'react'
import { Shield, Users, Video, TrendingUp, RefreshCw, Eye, EyeOff, Download, Mail, Clock, Calendar, Play, X } from 'lucide-react'

interface Lead {
  id: string
  email: string
  createdAt: string
  videoUrl?: string
  videoGeneratedAt?: string
  source: string
}

interface VideoRecord {
  id: string
  email: string
  videoUrl?: string
  createdAt: string
  agentName?: string
  listingAddress?: string
  hasVideo?: boolean
}

interface Stats {
  totalLeads: number
  totalVideos: number
  todayLeads: number
  todayVideos: number
}

interface AdminData {
  stats: Stats
  leads: Lead[]
  videos: VideoRecord[]
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'leads' | 'videos'>('leads')
  const [selectedVideo, setSelectedVideo] = useState<VideoRecord | null>(null)
  const [loadingVideo, setLoadingVideo] = useState(false)

  const fetchVideo = async (videoId: string) => {
    setLoadingVideo(true)
    try {
      const res = await fetch(`/api/admin/video?password=${encodeURIComponent(password)}&id=${videoId}`)
      const json = await res.json()
      if (res.ok && json.video) {
        setSelectedVideo(json.video)
      } else {
        alert('Failed to load video')
      }
    } catch (err) {
      alert('Failed to load video')
    } finally {
      setLoadingVideo(false)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin?password=${encodeURIComponent(password)}`)
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'Failed to fetch data')
      }

      setData(json)
      setIsAuthenticated(true)
    } catch (err: any) {
      setError(err.message)
      if (err.message === 'Unauthorized') {
        setIsAuthenticated(false)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    fetchData()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const exportToCSV = () => {
    if (!data) return

    const csvContent = activeTab === 'leads'
      ? [
          ['Email', 'Source', 'Created At', 'Has Video'],
          ...data.leads.map(l => [l.email, l.source, l.createdAt, l.videoUrl ? 'Yes' : 'No'])
        ].map(row => row.join(',')).join('\n')
      : [
          ['Email', 'Agent Name', 'Listing', 'Created At'],
          ...data.videos.map(v => [v.email, v.agentName || '', v.listingAddress || '', v.createdAt])
        ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeTab}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {error && (
                <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !password}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Access Dashboard'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">AgentClone Admin</span>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        {data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
                <span className="text-white/60 text-sm">Total Leads</span>
              </div>
              <p className="text-3xl font-bold text-white">{data.stats.totalLeads}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Video className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-white/60 text-sm">Total Videos</span>
              </div>
              <p className="text-3xl font-bold text-white">{data.stats.totalVideos}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                </div>
                <span className="text-white/60 text-sm">Today Leads</span>
              </div>
              <p className="text-3xl font-bold text-white">{data.stats.todayLeads}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-amber-400" />
                </div>
                <span className="text-white/60 text-sm">Today Videos</span>
              </div>
              <p className="text-3xl font-bold text-white">{data.stats.todayVideos}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'leads'
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Leads ({data?.leads.length || 0})
              </span>
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'videos'
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Videos ({data?.videos.length || 0})
              </span>
            </button>
          </div>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 hover:bg-emerald-500/30 transition-colors ml-auto"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {activeTab === 'leads' && data && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="text-left text-white/60 text-sm font-medium px-6 py-4">Email</th>
                    <th className="text-left text-white/60 text-sm font-medium px-6 py-4">Source</th>
                    <th className="text-left text-white/60 text-sm font-medium px-6 py-4">Date</th>
                    <th className="text-left text-white/60 text-sm font-medium px-6 py-4">Video</th>
                  </tr>
                </thead>
                <tbody>
                  {data.leads.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-white/40 py-12">
                        No leads yet. They will appear here once users submit their email.
                      </td>
                    </tr>
                  ) : (
                    data.leads.map((lead) => (
                      <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-6 py-4">
                          <span className="text-white font-medium">{lead.email}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-lg">
                            {lead.source}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white/60 text-sm flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {formatDate(lead.createdAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {lead.videoUrl ? (
                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-lg">
                              Generated
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-white/10 text-white/40 text-xs rounded-lg">
                              No video
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'videos' && data && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="text-left text-white/60 text-sm font-medium px-6 py-4">Email</th>
                    <th className="text-left text-white/60 text-sm font-medium px-6 py-4">Agent Name</th>
                    <th className="text-left text-white/60 text-sm font-medium px-6 py-4">Date</th>
                    <th className="text-left text-white/60 text-sm font-medium px-6 py-4">Video</th>
                  </tr>
                </thead>
                <tbody>
                  {data.videos.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-white/40 py-12">
                        No videos generated yet. They will appear here once users create videos.
                      </td>
                    </tr>
                  ) : (
                    data.videos.map((video) => (
                      <tr key={video.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-6 py-4">
                          <span className="text-white font-medium">{video.email}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white/80">{video.agentName || '-'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white/60 text-sm flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {formatDate(video.createdAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => fetchVideo(video.id)}
                            disabled={loadingVideo}
                            className="flex items-center gap-2 px-3 py-1.5 bg-violet-500/20 border border-violet-500/30 rounded-lg text-violet-400 hover:bg-violet-500/30 transition-colors text-sm font-medium disabled:opacity-50"
                          >
                            <Play className="h-4 w-4" />
                            {loadingVideo ? 'Loading...' : 'Watch'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            {error}
          </div>
        )}
      </main>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-2xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <h3 className="text-white font-semibold">Video from {selectedVideo.email}</h3>
                <p className="text-white/60 text-sm">{formatDate(selectedVideo.createdAt)}</p>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="p-6">
              <video
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                className="w-full rounded-xl bg-black"
                style={{ maxHeight: '60vh' }}
              >
                Your browser does not support video playback.
              </video>
            </div>

            {/* Download Button */}
            <div className="px-6 pb-6">
              <a
                href={selectedVideo.videoUrl}
                download={`video-${selectedVideo.email}-${selectedVideo.id}.mp4`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors"
              >
                <Download className="h-5 w-5" />
                Download Video
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
