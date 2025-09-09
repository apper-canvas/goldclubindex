import { useState, useRef, useEffect, forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Select = forwardRef(({ 
  className, 
  options = [],
  value,
  onChange,
  placeholder = "Select option...",
  searchable = false,
  label,
  error,
  disabled = false,
  ...props 
}, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const selectRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options

  const selectedOption = options.find(option => option.value === value)

  const handleSelect = (optionValue) => {
    onChange?.(optionValue)
    setIsOpen(false)
    setSearchTerm("")
  }

  return (
    <div className="w-full" ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {props.required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          className={cn(
            "w-full px-4 py-3 text-left border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200",
            disabled && "opacity-50 cursor-not-allowed bg-gray-50",
            error && "border-error focus:ring-error focus:border-error",
            className
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          ref={ref}
          {...props}
        >
          <div className="flex items-center justify-between">
            <span className={cn(
              "block truncate",
              !selectedOption && "text-gray-400"
            )}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ApperIcon 
              name="ChevronDown" 
              size={16} 
              className={cn(
                "transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </button>

{isOpen && (
          <div className="absolute z-[50000] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <ApperIcon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="Search options..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}
            
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      "w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors duration-150",
                      value === option.value && "bg-primary-50 text-primary-700 font-medium"
                    )}
                    onClick={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-error">{error}</p>
      )}
    </div>
  )
})

Select.displayName = "Select"

export default Select