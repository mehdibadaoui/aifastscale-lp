'use client'

import { useState, useEffect } from 'react'
import { Shield, Users, Video, TrendingUp, RefreshCw, Eye, EyeOff, Download, Mail, Clock, Calendar, Play, X, UserPlus, Trash2, Copy, Search, Activity, CheckCircle, AlertCircle, Key } from 'lucide-react'

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

interface User {
  email: string
  password: string
  name: string
  purchaseDate: string
  planId: string
  product: 'dentist' | 'plastic-surgeon' | 'psychologist' | 'lawyer'
  lastLogin?: string
  loginCount?: number
}

interface UserStats {
  total: number
  dentist: number
  lawyer: number
  psychologist: number
  plasticSurgeon: number
  activeUsersLast24h: number
  activeUsersLast7d: number
  activeUsersLast30d: number
  usersNeverLoggedIn: number
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
  users: User[]
  userStats: UserStats
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState<'users' | 'leads' | 'videos'>('users')
  const [selectedVideo, setSelectedVideo] = useState<VideoRecord | null>(null)
  const [loadingVideo, setLoadingVideo] = useState(false)

  // User management
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [productFilter, setProductFilter] = useState<'all' | 'dentist' | 'lawyer' | 'psychologist' | 'plastic-surgeon'>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUserDetails, setShowUserDetails] = useState<User | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Create user form
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserName, setNewUserName] = useState('')
  const [newUserProduct, setNewUserProduct] = useState<'dentist' | 'lawyer' | 'psychologist' | 'plastic-surgeon'>('dentist')

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

  const handleUserAction = async (action: string, email: string) => {
    setActionLoading(email)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, action, email })
      })
      const result = await res.json()

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(result.message || 'Action completed')
        fetchData()
      }
    } catch (e) {
      setError('Action failed')
    }
    setActionLoading(null)
  }

  const handleCreateUser = async () => {
    if (!newUserEmail) {
      setError('Email required')
      return
    }

    setActionLoading('create')
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          action: 'create',
          email: newUserEmail,
          name: newUserName,
          product: newUserProduct
        })
      })
      const result = await res.json()

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(`User created! Password: ${result.password}`)
        setNewUserEmail('')
        setNewUserName('')
        setShowCreateModal(false)
        fetchData()
      }
    } catch (e) {
      setError('Failed to create user')
    }
    setActionLoading(null)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess('Copied!')
    setTimeout(() => setSuccess(''), 2000)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatRelativeTime = (dateString: string) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return formatDate(dateString)
  }

  const exportToCSV = () => {
    if (!data) return

    let csvContent = ''

    if (activeTab === 'users') {
      csvContent = [
        ['Email', 'Password', 'Name', 'Product', 'Purchase Date', 'Last Login', 'Login Count'],
        ...data.users.map(u => [u.email, u.password, u.name || '', u.product, u.purchaseDate, u.lastLogin || 'Never', String(u.loginCount || 0)])
      ].map(row => row.join(',')).join('\n')
    } else if (activeTab === 'leads') {
      csvContent = [
        ['Email', 'Source', 'Created At', 'Has Video'],
        ...data.leads.map(l => [l.email, l.source, l.createdAt, l.videoUrl ? 'Yes' : 'No'])
      ].map(row => row.join(',')).join('\n')
    } else {
      csvContent = [
        ['Email', 'Agent Name', 'Listing', 'Created At'],
        ...data.videos.map(v => [v.email, v.agentName || '', v.listingAddress || '', v.createdAt])
      ].map(row => row.join(',')).join('\n')
    }

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeTab}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  // Check for saved password
  useEffect(() => {
    const savedPassword = localStorage.getItem('admin_password')
    if (savedPassword) {
      setPassword(savedPassword)
      fetch(`/api/admin?password=${encodeURIComponent(savedPassword)}`)
        .then(res => res.json())
        .then(json => {
          if (!json.error) {
            setIsAuthenticated(true)
            setData(json)
          }
        })
        .catch(() => {})
    }
  }, [])

  // Save password on successful login
  useEffect(() => {
    if (isAuthenticated && password) {
      localStorage.setItem('admin_password', password)
    }
  }, [isAuthenticated, password])

  // Filter users
  const filteredUsers = data?.users?.filter(user => {
    const matchesSearch =
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(userSearchTerm.toLowerCase())
    const matchesProduct = productFilter === 'all' || user.product === productFilter
    return matchesSearch && matchesProduct
  }) || []

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-500/50 pr-12"
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
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
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
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Admin Dashboard</span>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'users' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-500 rounded-xl text-white hover:bg-teal-600 transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Add User</span>
              </button>
            )}
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Alerts */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
            <button onClick={() => setError('')} className="ml-auto">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl flex items-center gap-3 text-emerald-400">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            {success}
            <button onClick={() => setSuccess('')} className="ml-auto">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* User Stats Cards */}
        {data?.userStats && activeTab === 'users' && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
            <StatCard icon={Users} label="Total Users" value={data.userStats.total} color="teal" />
            <StatCard icon={Users} label="Dentists" value={data.userStats.dentist} color="cyan" />
            <StatCard icon={Users} label="Lawyers" value={data.userStats.lawyer} color="purple" />
            <StatCard icon={Users} label="Psychologists" value={data.userStats.psychologist} color="blue" />
            <StatCard icon={Users} label="Plastic Surgeons" value={data.userStats.plasticSurgeon} color="indigo" />
            <StatCard icon={Activity} label="Active 24h" value={data.userStats.activeUsersLast24h} color="green" />
            <StatCard icon={Activity} label="Active 7d" value={data.userStats.activeUsersLast7d} color="blue" />
            <StatCard icon={Activity} label="Active 30d" value={data.userStats.activeUsersLast30d} color="indigo" />
            <StatCard icon={Clock} label="Never Logged" value={data.userStats.usersNeverLoggedIn} color="amber" />
          </div>
        )}

        {/* Original Stats Cards */}
        {data && activeTab !== 'users' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'users'
                  ? 'bg-teal-500 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Users ({data?.users?.length || 0})
              </span>
            </button>
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
                Leads ({data?.leads?.length || 0})
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
                Videos ({data?.videos?.length || 0})
              </span>
            </button>
          </div>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 hover:bg-emerald-500/30 transition-colors sm:ml-auto"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {/* Users Tab - Search and Filter */}
        {activeTab === 'users' && (
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                placeholder="Search by email or name..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {(['all', 'dentist', 'lawyer', 'psychologist', 'plastic-surgeon'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setProductFilter(filter)}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                    productFilter === filter
                      ? 'bg-teal-500 text-white'
                      : 'bg-white/5 text-white/60 hover:text-white border border-white/20'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter === 'dentist' ? 'Dentist' : filter === 'lawyer' ? 'Lawyer' : filter === 'psychologist' ? 'Psychologist' : 'Plastic Surgeon'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {/* Users Table */}
          {activeTab === 'users' && data && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="text-left text-white/60 text-sm font-medium px-4 py-3">User</th>
                    <th className="text-left text-white/60 text-sm font-medium px-4 py-3 hidden md:table-cell">Password</th>
                    <th className="text-left text-white/60 text-sm font-medium px-4 py-3 hidden lg:table-cell">Product</th>
                    <th className="text-left text-white/60 text-sm font-medium px-4 py-3 hidden lg:table-cell">Purchased</th>
                    <th className="text-left text-white/60 text-sm font-medium px-4 py-3">Last Login</th>
                    <th className="text-left text-white/60 text-sm font-medium px-4 py-3">Logins</th>
                    <th className="text-right text-white/60 text-sm font-medium px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center text-white/40 py-12">
                        {loading ? 'Loading...' : 'No users found'}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.email} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-4 py-3">
                          <div>
                            <div className="text-white font-medium text-sm">{user.email}</div>
                            {user.name && <div className="text-white/50 text-xs">{user.name}</div>}
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <code className="text-teal-400 text-sm bg-teal-500/10 px-2 py-1 rounded">{user.password}</code>
                            <button
                              onClick={() => copyToClipboard(user.password)}
                              className="text-white/40 hover:text-white"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            user.product === 'dentist' ? 'bg-cyan-500/20 text-cyan-400' :
                            user.product === 'lawyer' ? 'bg-purple-500/20 text-purple-400' :
                            user.product === 'psychologist' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-indigo-500/20 text-indigo-400'
                          }`}>
                            {user.product === 'dentist' ? 'Dentist' : user.product === 'lawyer' ? 'Lawyer' : user.product === 'psychologist' ? 'Psychologist' : 'Plastic Surgeon'}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-white/60 text-sm">
                          {formatRelativeTime(user.purchaseDate)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm ${user.lastLogin ? 'text-white/80' : 'text-amber-400'}`}>
                            {user.lastLogin ? formatRelativeTime(user.lastLogin) : 'Never'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-medium ${
                            (user.loginCount || 0) > 5 ? 'text-emerald-400' :
                            (user.loginCount || 0) > 0 ? 'text-white/80' : 'text-amber-400'
                          }`}>
                            {user.loginCount || 0}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setShowUserDetails(user)}
                              className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUserAction('resend', user.email)}
                              disabled={actionLoading === user.email}
                              className="p-2 text-white/40 hover:text-teal-400 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                              title="Resend Email"
                            >
                              {actionLoading === user.email ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Mail className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete user ${user.email}?`)) {
                                  handleUserAction('delete', user.email)
                                }
                              }}
                              disabled={actionLoading === user.email}
                              className="p-2 text-white/40 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="px-4 py-3 border-t border-white/10 text-white/50 text-sm">
                Showing {filteredUsers.length} of {data.users?.length || 0} users
              </div>
            </div>
          )}

          {/* Leads Table */}
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

          {/* Videos Table */}
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
      </main>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-slate-800 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-teal-400" />
              Create New User
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white/60 text-sm mb-1">Email *</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-1">Name (optional)</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-1">Product</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setNewUserProduct('dentist')}
                    className={`py-2 rounded-lg font-medium transition-colors text-sm ${
                      newUserProduct === 'dentist'
                        ? 'bg-cyan-500 text-white'
                        : 'bg-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    Dentist
                  </button>
                  <button
                    onClick={() => setNewUserProduct('lawyer')}
                    className={`py-2 rounded-lg font-medium transition-colors text-sm ${
                      newUserProduct === 'lawyer'
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    Lawyer
                  </button>
                  <button
                    onClick={() => setNewUserProduct('psychologist')}
                    className={`py-2 rounded-lg font-medium transition-colors text-sm ${
                      newUserProduct === 'psychologist'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    Psychologist
                  </button>
                  <button
                    onClick={() => setNewUserProduct('plastic-surgeon')}
                    className={`py-2 rounded-lg font-medium transition-colors text-sm ${
                      newUserProduct === 'plastic-surgeon'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    Plastic Surgeon
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                disabled={actionLoading === 'create'}
                className="flex-1 py-3 bg-teal-500 text-white font-bold rounded-xl hover:bg-teal-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading === 'create' ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>Create User</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-slate-800 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">User Details</h2>
              <button
                onClick={() => setShowUserDetails(null)}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <DetailRow label="Email" value={showUserDetails.email} onCopy={() => copyToClipboard(showUserDetails.email)} />
              <DetailRow label="Password" value={showUserDetails.password} onCopy={() => copyToClipboard(showUserDetails.password)} />
              <DetailRow label="Name" value={showUserDetails.name || '-'} />
              <DetailRow label="Product" value={
                showUserDetails.product === 'dentist' ? 'CloneYourself Dentist' :
                showUserDetails.product === 'lawyer' ? 'CloneYourself Lawyer' :
                showUserDetails.product === 'psychologist' ? 'CloneYourself Psychologist' :
                'CloneYourself Plastic Surgeon'
              } />
              <DetailRow label="Plan ID" value={showUserDetails.planId} />
              <DetailRow label="Purchased" value={formatDate(showUserDetails.purchaseDate)} />
              <DetailRow label="Last Login" value={showUserDetails.lastLogin ? formatDate(showUserDetails.lastLogin) : 'Never'} />
              <DetailRow label="Login Count" value={String(showUserDetails.loginCount || 0)} />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUserDetails(null)}
                className="flex-1 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleUserAction('resend', showUserDetails.email)
                  setShowUserDetails(null)
                }}
                className="flex-1 py-3 bg-teal-500 text-white font-bold rounded-xl hover:bg-teal-600 transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Resend Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-2xl border border-white/10 overflow-hidden">
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

// Stat Card Component
function StatCard({ icon: Icon, label, value, color }: {
  icon: any,
  label: string,
  value: number,
  color: 'teal' | 'cyan' | 'purple' | 'green' | 'blue' | 'indigo' | 'amber'
}) {
  const colorClasses = {
    teal: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    indigo: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  }

  return (
    <div className={`p-3 rounded-xl border ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium opacity-80">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}

// Detail Row Component
function DetailRow({ label, value, onCopy }: { label: string, value: string, onCopy?: () => void }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/10">
      <span className="text-white/60 text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-white text-sm font-medium">{value}</span>
        {onCopy && (
          <button onClick={onCopy} className="text-white/40 hover:text-teal-400">
            <Copy className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
