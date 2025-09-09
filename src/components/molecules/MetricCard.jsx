import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = "positive",
  icon,
  className,
  loading = false,
  ...props 
}) => {
  if (loading) {
    return (
      <div className={cn("metric-card", className)} {...props}>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-24 shimmer"></div>
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-16 shimmer"></div>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full shimmer"></div>
        </div>
        <div className="mt-4">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-20 shimmer"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("metric-card", className)} {...props}>
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-50 to-transparent opacity-50 rounded-xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          </div>
          
          {icon && (
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-card">
              <ApperIcon name={icon} size={24} className="text-white" />
            </div>
          )}
        </div>
        
        {change && (
          <div className="flex items-center mt-4">
            <ApperIcon 
              name={changeType === "positive" ? "TrendingUp" : "TrendingDown"} 
              size={16} 
              className={cn(
                "mr-2",
                changeType === "positive" ? "text-success" : "text-error"
              )}
            />
            <span className={cn(
              "text-sm font-medium",
              changeType === "positive" ? "text-success" : "text-error"
            )}>
              {change}
            </span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default MetricCard