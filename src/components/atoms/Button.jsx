import { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const buttonVariants = {
  primary: "bg-gradient-to-r from-primary to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-card hover:shadow-elevation",
  secondary: "bg-gradient-to-r from-secondary to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700 shadow-card hover:shadow-elevation",
  accent: "bg-gradient-to-r from-accent to-accent-600 text-gray-900 hover:from-accent-600 hover:to-accent-700 shadow-card hover:shadow-elevation font-semibold",
  outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white",
  ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  danger: "bg-gradient-to-r from-error to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-card hover:shadow-elevation"
}

const buttonSizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
  xl: "px-10 py-5 text-xl"
}

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  children,
  disabled,
  ...props 
}, ref) => {
  const isDisabled = disabled || loading

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      ref={ref}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          Loading...
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <ApperIcon name={icon} size={16} className="mr-2" />
          )}
          {children}
          {icon && iconPosition === "right" && (
            <ApperIcon name={icon} size={16} className="ml-2" />
          )}
        </>
      )}
    </button>
  )
})

Button.displayName = "Button"

export default Button