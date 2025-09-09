import { useState } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"

const SearchFilter = ({ 
  searchValue, 
  onSearchChange, 
  filters = [], 
  selectedFilter,
  onFilterChange,
  onReset,
  placeholder = "Search...",
  className,
  ...props 
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <div className={cn("flex flex-col sm:flex-row gap-4 items-stretch sm:items-center", className)} {...props}>
      <div className="flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={<ApperIcon name="Search" size={16} className="text-gray-400" />}
          className="w-full"
        />
      </div>
      
      {filters.length > 0 && (
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            icon="Filter"
            className="w-full sm:w-auto"
          >
            Filter
            {selectedFilter && selectedFilter !== "all" && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-primary text-white text-xs rounded-full">
                1
              </span>
            )}
          </Button>
          
          {isFilterOpen && (
            <div className="absolute top-full left-0 mt-2 w-full sm:w-48 bg-surface border border-gray-200 rounded-lg shadow-elevation z-50">
              <div className="p-2">
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => {
                      onFilterChange(filter.value)
                      setIsFilterOpen(false)
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 hover:bg-gray-100",
                      selectedFilter === filter.value && "bg-primary-50 text-primary-700 font-medium"
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {(searchValue || (selectedFilter && selectedFilter !== "all")) && (
        <Button
          variant="ghost"
          onClick={onReset}
          icon="X"
          className="w-full sm:w-auto"
        >
          Clear
        </Button>
      )}
    </div>
  )
}

export default SearchFilter