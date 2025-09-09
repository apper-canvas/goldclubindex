import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Input = forwardRef(({ 
  className, 
  type = "text", 
  label,
  error,
  helper,
  icon,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {props.required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          className={cn(
            "block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white",
            icon && "pl-10",
            error && "border-error focus:ring-error focus:border-error",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-error">{error}</p>
      )}
      
      {helper && !error && (
        <p className="mt-2 text-sm text-gray-500">{helper}</p>
      )}
    </div>
  )
})

Input.displayName = "Input"

export default Input