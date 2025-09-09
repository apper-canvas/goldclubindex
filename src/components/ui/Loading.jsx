import { cn } from "@/utils/cn"

const Loading = ({ className, type = "default", ...props }) => {
  if (type === "table") {
    return (
      <div className={cn("space-y-4", className)} {...props}>
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-48 shimmer"></div>
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-32 shimmer"></div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg flex-1 shimmer"></div>
              <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-24 shimmer"></div>
              <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-32 shimmer"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (type === "cards") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)} {...props}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface rounded-xl p-6 space-y-4 shadow-card">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-2/3 shimmer"></div>
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-1/2 shimmer"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-1/3 shimmer"></div>
          </div>
        ))}
      </div>
    )
  }

  if (type === "chart") {
    return (
      <div className={cn("bg-surface rounded-xl p-6 space-y-4 shadow-card", className)} {...props}>
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-1/3 shimmer"></div>
        <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-100 rounded shimmer"></div>
        <div className="flex justify-between">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-20 shimmer"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-20 shimmer"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center justify-center p-12", className)} {...props}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-pulse border-t-accent"></div>
        </div>
        <p className="text-gray-500 font-medium">Loading amazing content...</p>
      </div>
    </div>
  )
}

export default Loading