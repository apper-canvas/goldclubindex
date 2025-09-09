import { NavLink, useLocation } from "react-router-dom"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: "LayoutDashboard"
  },
  {
    name: "Leads",
    href: "/leads",
    icon: "Users"
  },
  {
    name: "Hotlist",
    href: "/hotlist",
    icon: "Star"
  },
  {
    name: "Deal Pipeline",
    href: "/pipeline",
    icon: "GitBranch"
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: "Calendar"
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: "BarChart3"
  },
  {
    name: "Leaderboard",
    href: "/leaderboard",
    icon: "Trophy"
  }
]

// Desktop Sidebar Component
const DesktopSidebar = () => {
  const location = useLocation()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-surface lg:border-r lg:border-gray-200">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Logo */}
        <div className="flex items-center h-16 flex-shrink-0 px-6 bg-gradient-to-r from-primary to-secondary">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center mr-3 shadow-card">
              <ApperIcon name="Users" size={18} className="text-gray-900" />
            </div>
            <h1 className="text-xl font-bold text-white">GoldClub CRM</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "sidebar-item",
                  isActive && "active"
                )}
              >
                <ApperIcon name={item.icon} size={20} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-card">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Sales Manager</p>
              <p className="text-xs text-gray-500 truncate">sales@goldclub.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

// Mobile Sidebar Component
const MobileSidebar = ({ isOpen, onClose }) => {
  const location = useLocation()

  if (!isOpen) return null

  return (
    <div className="lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-gray-200 transform transition-transform duration-300 ease-in-out">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 flex-shrink-0 px-6 bg-gradient-to-r from-primary to-secondary">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center mr-3 shadow-card">
                <ApperIcon name="Users" size={18} className="text-gray-900" />
              </div>
              <h1 className="text-xl font-bold text-white">GoldClub CRM</h1>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors duration-200"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "sidebar-item",
                    isActive && "active"
                  )}
                >
                  <ApperIcon name={item.icon} size={20} />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-card">
                <ApperIcon name="User" size={16} className="text-white" />
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Sales Manager</p>
                <p className="text-xs text-gray-500 truncate">sales@goldclub.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

export { DesktopSidebar, MobileSidebar }