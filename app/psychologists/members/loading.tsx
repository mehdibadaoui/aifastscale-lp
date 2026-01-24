// Loading skeleton for members page - improves perceived performance
export default function MembersLoading() {
  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      {/* Nav skeleton */}
      <div className="h-16 border-b border-teal-500/20 bg-[#0d1525]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 animate-pulse" />
            <div className="hidden sm:block space-y-1">
              <div className="h-4 w-24 bg-slate-700 rounded animate-pulse" />
              <div className="h-3 w-20 bg-slate-800 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-16 bg-slate-700 rounded-full animate-pulse" />
            <div className="h-8 w-16 bg-slate-700 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Mobile nav skeleton */}
      <div className="flex md:hidden border-b border-teal-500/20 bg-[#0d1525]/50">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 py-3 flex flex-col items-center gap-1">
            <div className="w-5 h-5 bg-slate-700 rounded animate-pulse" />
            <div className="w-12 h-2 bg-slate-800 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Hero card skeleton */}
        <div className="rounded-3xl bg-[#0d1525] border border-teal-500/20 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-2">
              <div className="h-3 w-20 bg-slate-700 rounded animate-pulse" />
              <div className="h-8 w-40 bg-slate-600 rounded animate-pulse" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/50 to-cyan-500/50 animate-pulse" />
          </div>
          <div className="h-3 bg-slate-800 rounded-full mb-4 animate-pulse" />
          <div className="h-12 bg-gradient-to-r from-teal-500/50 to-teal-600/50 rounded-2xl animate-pulse" />
        </div>

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl bg-[#0d1525] border border-teal-500/10 p-4">
              <div className="w-10 h-10 rounded-xl bg-slate-700 mb-2 animate-pulse" />
              <div className="h-6 w-12 bg-slate-600 rounded mb-1 animate-pulse" />
              <div className="h-3 w-16 bg-slate-800 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Module card skeleton */}
        <div className="rounded-2xl bg-[#0d1525] border border-teal-500/10 p-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500/30 to-cyan-500/30 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-20 bg-teal-500/30 rounded animate-pulse" />
              <div className="h-5 w-48 bg-slate-600 rounded animate-pulse" />
              <div className="h-3 w-16 bg-slate-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/20 border border-teal-500/30">
        <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-teal-400 font-medium">Loading...</span>
      </div>
    </div>
  )
}
