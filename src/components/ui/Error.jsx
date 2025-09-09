import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ 
  className, 
  message = "Something went wrong", 
  onRetry,
  showRetry = true,
  ...props 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)} {...props}>
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center shadow-elevation">
          <ApperIcon name="AlertTriangle" size={32} className="text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-accent to-amber-500 rounded-full flex items-center justify-center">
          <ApperIcon name="X" size={12} className="text-white" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-600 mb-6 max-w-md">
        {message}. Our golf pros are working to fix this issue. Please try again in a moment.
      </p>
      
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary flex items-center space-x-2"
        >
          <ApperIcon name="RefreshCw" size={16} />
          <span>Try Again</span>
        </button>
      )}
      
      {!onRetry && (
        <div className="flex space-x-3">
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary flex items-center space-x-2"
          >
            <ApperIcon name="RefreshCw" size={16} />
            <span>Refresh Page</span>
          </button>
          <button 
            onClick={() => window.history.back()}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  )
}

export default Error