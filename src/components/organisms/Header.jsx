import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Header = ({ title, subtitle, onMobileMenuClick, onQuickAdd, className, children, ...props }) => {
  return (
    <header className={cn("bg-surface border-b border-gray-200 px-6 py-4", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center min-w-0 flex-1">
          {/* Mobile menu button */}
          <button
            onClick={onMobileMenuClick}
            className="lg:hidden mr-4 p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors duration-200"
          >
            <ApperIcon name="Menu" size={20} />
          </button>

          {/* Title section */}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-gray-900 truncate">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1 truncate">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {children}
          
          {/* Notifications */}
          <div className="relative">
            <button className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors duration-200">
              <ApperIcon name="Bell" size={20} />
            </button>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-error to-red-600 rounded-full border-2 border-white"></div>
          </div>

          {/* Quick add button */}
<Button
            variant="accent"
            size="sm"
            icon="Plus"
            onClick={onQuickAdd}
            className="hidden sm:inline-flex"
          >
            Quick Add
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header