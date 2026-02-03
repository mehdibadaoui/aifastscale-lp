'use client'

import { memo, useState, useMemo } from 'react'
import {
  Wrench, ExternalLink, FileDown, Download, Search, X,
  Sparkles, Brain, Video, Image, FileText, Folder, Link2,
  ChevronRight, Star, Zap, Copy, Check, Bot
} from 'lucide-react'
import type { NicheConfig, CourseModule } from '../../config/types'

// ============================================
// TYPES
// ============================================

interface Resource {
  name: string
  url: string
  type: 'link' | 'file' | 'folder'
  moduleNumber?: number
  moduleTitle?: string
  category?: 'chatgpt' | 'tool' | 'file' | 'prompt'
}

interface ResourcesSectionProps {
  state: {
    config: NicheConfig
  }
}

// ============================================
// HELPER: Categorize resources
// ============================================

function categorizeResource(resource: { name: string; url: string; type: string }): Resource['category'] {
  const nameLower = resource.name.toLowerCase()
  const urlLower = resource.url.toLowerCase()

  if (urlLower.includes('chatgpt.com') || urlLower.includes('chat.openai.com') || nameLower.includes('gpt')) {
    return 'chatgpt'
  }
  if (nameLower.includes('prompt')) {
    return 'prompt'
  }
  if (resource.type === 'link') {
    return 'tool'
  }
  return 'file'
}

// ============================================
// RESOURCE CARD COMPONENT
// ============================================

const ResourceCard = memo(function ResourceCard({
  resource,
  isPrimaryAmber
}: {
  resource: Resource
  isPrimaryAmber: boolean
}) {
  const [copied, setCopied] = useState(false)
  const primaryColor = isPrimaryAmber ? 'amber' : 'teal'

  const categoryConfig = {
    chatgpt: {
      icon: Bot,
      gradient: 'from-emerald-500 to-teal-500',
      label: 'ChatGPT',
      labelColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30'
    },
    tool: {
      icon: Wrench,
      gradient: 'from-blue-500 to-cyan-500',
      label: 'Tool',
      labelColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    prompt: {
      icon: FileText,
      gradient: `from-${primaryColor}-500 to-orange-500`,
      label: 'Prompt',
      labelColor: `text-${primaryColor}-400`,
      bgColor: `bg-${primaryColor}-500/10`,
      borderColor: `border-${primaryColor}-500/30`
    },
    file: {
      icon: FileDown,
      gradient: 'from-purple-500 to-pink-500',
      label: 'File',
      labelColor: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    }
  }

  const config = categoryConfig[resource.category || 'file']
  const Icon = config.icon

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(resource.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`group relative overflow-hidden rounded-xl sm:rounded-2xl glass-premium border ${config.borderColor} hover:border-opacity-60 transition-all duration-300 hover-lift`}>
      {/* Glow effect */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${config.gradient} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`} />

      <div className="relative p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start gap-3 sm:gap-4 mb-3">
          <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold ${config.bgColor} ${config.labelColor} border ${config.borderColor}`}>
                {config.label}
              </span>
              {resource.moduleNumber && (
                <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-medium bg-white/5 text-slate-400 border border-white/10">
                  Module {resource.moduleNumber}
                </span>
              )}
            </div>
            <h3 className="font-bold text-white text-sm sm:text-base leading-tight line-clamp-2">
              {resource.name}
            </h3>
            {resource.moduleTitle && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                From: {resource.moduleTitle}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-xl font-bold text-sm transition-all bg-gradient-to-r ${config.gradient} text-white shadow-lg hover:shadow-xl active:scale-[0.98] min-h-[44px]`}
          >
            {resource.type === 'link' ? (
              <>
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Open</span>
                <span className="sm:hidden">Open</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
                <span className="sm:hidden">Get</span>
              </>
            )}
          </a>
          <button
            onClick={handleCopyLink}
            className={`p-3 sm:p-3.5 rounded-xl glass-dark border border-white/10 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
              copied ? 'bg-emerald-500/20 border-emerald-500/30' : 'hover:bg-white/5'
            }`}
            title="Copy link"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
})

// ============================================
// MAIN RESOURCES SECTION
// ============================================

export const ResourcesSection = memo(function ResourcesSection({ state }: ResourcesSectionProps) {
  const { config } = state
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'chatgpt' | 'tool' | 'prompt' | 'file'>('all')

  const isPrimaryAmber = config.theme.primary.includes('amber')
  const primaryColor = isPrimaryAmber ? 'amber' : 'teal'

  // Collect all resources from all modules
  const allResources = useMemo(() => {
    const resources: Resource[] = []

    config.modules.forEach((module: CourseModule) => {
      if (module.resources && module.resources.length > 0) {
        module.resources.forEach((res) => {
          resources.push({
            name: res.name,
            url: res.url,
            type: res.type as 'link' | 'file' | 'folder',
            moduleNumber: module.number,
            moduleTitle: module.title,
            category: categorizeResource(res)
          })
        })
      }
    })

    return resources
  }, [config.modules])

  // Filter resources
  const filteredResources = useMemo(() => {
    return allResources.filter(resource => {
      const matchesSearch = searchQuery === '' ||
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (resource.moduleTitle?.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = categoryFilter === 'all' || resource.category === categoryFilter

      return matchesSearch && matchesCategory
    })
  }, [allResources, searchQuery, categoryFilter])

  // Count by category
  const categoryCounts = useMemo(() => {
    const counts = { all: allResources.length, chatgpt: 0, tool: 0, prompt: 0, file: 0 }
    allResources.forEach(r => {
      if (r.category) counts[r.category]++
    })
    return counts
  }, [allResources])

  // Category filter buttons
  const categories = [
    { id: 'all' as const, label: 'All', icon: Sparkles },
    { id: 'chatgpt' as const, label: 'ChatGPT', icon: Bot },
    { id: 'tool' as const, label: 'Tools', icon: Wrench },
    { id: 'prompt' as const, label: 'Prompts', icon: FileText },
    { id: 'file' as const, label: 'Files', icon: FileDown },
  ]

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center sm:justify-start gap-3">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-${primaryColor}-500 to-orange-500 flex items-center justify-center shadow-lg`}>
                <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              AI Tools & Resources
            </h1>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">
              Quick access to all your AI tools, prompts, and downloads
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full bg-gradient-to-r from-${primaryColor}-500 to-orange-500 text-white text-sm font-bold shadow-lg`}>
            {allResources.length} Resources
          </div>
        </div>
      </div>

      {/* ChatGPT Highlight Box - Show if there are ChatGPT resources */}
      {categoryCounts.chatgpt > 0 && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-500/30 p-4 sm:p-6">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl flex-shrink-0">
              <Bot className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Looking for ChatGPT?</h3>
              <p className="text-emerald-300/80 text-sm">
                Your custom AI assistants are ready. Click "ChatGPT" filter below to find them instantly.
              </p>
            </div>
            <button
              onClick={() => setCategoryFilter('chatgpt')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Bot className="w-5 h-5" />
              Show ChatGPT Tools
            </button>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="space-y-3 sm:space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            className={`w-full pl-12 pr-12 py-3 sm:py-3.5 rounded-xl glass-premium border border-${primaryColor}-500/20 text-white placeholder-slate-500 focus:border-${primaryColor}-400 focus:outline-none focus:ring-4 focus:ring-${primaryColor}-400/10 transition-all text-base`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {categories.map((cat) => {
            const count = categoryCounts[cat.id]
            if (cat.id !== 'all' && count === 0) return null

            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all min-h-[44px] ${
                  categoryFilter === cat.id
                    ? `bg-gradient-to-r from-${primaryColor}-500 to-orange-500 text-white shadow-lg`
                    : 'glass-dark text-slate-300 hover:bg-white/5'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
                <span className={`text-xs ${categoryFilter === cat.id ? 'text-white/70' : 'text-slate-500'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Resources Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource, index) => (
            <ResourceCard
              key={`${resource.url}-${index}`}
              resource={resource}
              isPrimaryAmber={isPrimaryAmber}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16">
          <div className="w-16 h-16 rounded-2xl glass-premium border border-white/10 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-white/50 text-lg mb-2">No resources found</p>
          <p className="text-white/30 text-sm">Try a different search term or category</p>
          <button
            onClick={() => { setSearchQuery(''); setCategoryFilter('all') }}
            className="mt-4 px-4 py-2 rounded-xl glass-dark border border-white/10 text-white/70 hover:text-white transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Help Text */}
      <div className="text-center py-4">
        <p className="text-white/30 text-xs sm:text-sm">
          Can't find what you're looking for? Resources are also available in each module's lesson page.
        </p>
      </div>
    </div>
  )
})

export default ResourcesSection
