export function SkeletonLoader({ className = "", rows = 5, cols = 4 }) {
  return (
    <div className={`animate-pulse ${className}`}>
      {/* Table skeleton */}
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="grid grid-cols-4 gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-700">
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          ))}
        </div>
        
        {/* Rows skeleton */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 gap-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <div 
                key={colIndex} 
                className={`h-4 bg-zinc-100 dark:bg-zinc-800 rounded ${
                  colIndex === 0 ? 'w-3/4' : colIndex === cols - 1 ? 'w-1/2' : 'w-full'
                }`}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardSkeletonLoader({ className = "" }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
        <div className="space-y-4">
          <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3"></div>
          <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-full"></div>
            <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardSkeletonLoader() {
  return (
    <div className="space-y-6">
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeletonLoader key={i} />
        ))}
      </div>
      
      {/* Recent activity skeleton */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-1/4 mb-4"></div>
          <SkeletonLoader rows={3} cols={3} />
        </div>
      </div>
    </div>
  )
}
