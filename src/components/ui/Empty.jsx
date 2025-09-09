import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  className,
  title = "No data available",
  description = "Get started by adding your first item",
  action,
  actionLabel = "Add New",
  icon = "Database",
  ...props 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)} {...props}>
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center shadow-card">
          <ApperIcon name={icon} size={32} className="text-primary-600" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-accent to-amber-500 rounded-full flex items-center justify-center shadow-card">
          <ApperIcon name="Plus" size={12} className="text-white" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      
      {action && (
        <button
          onClick={action}
          className="btn-accent flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>{actionLabel}</span>
        </button>
      )}
      
      <div className="mt-8 text-xs text-gray-400">
        <p>Ready to grow your golf club membership? Let's get started!</p>
      </div>
    </div>
  )
}

export default Empty