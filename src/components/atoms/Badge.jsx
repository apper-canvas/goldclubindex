import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const badgeVariants = {
  default: "bg-gray-100 text-gray-800 border-gray-200",
  primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border-primary-300",
  secondary: "bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800 border-secondary-300",
  accent: "bg-gradient-to-r from-accent-100 to-accent-200 text-accent-900 border-accent-300",
  success: "bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 border-green-300",
  warning: "bg-gradient-to-r from-yellow-100 to-amber-200 text-yellow-800 border-yellow-300",
  error: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300",
  info: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300"
}

const badgeSizes = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base"
}

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  size = "sm",
  children,
  ...props 
}, ref) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium border transition-all duration-200 hover:scale-105",
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  )
})

Badge.displayName = "Badge"

export default Badge