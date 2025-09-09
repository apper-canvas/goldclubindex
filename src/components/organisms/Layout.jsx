import { useState } from "react"
import { Outlet } from "react-router-dom"
import { DesktopSidebar, MobileSidebar } from "@/components/organisms/Sidebar"

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <DesktopSidebar />
      
      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="min-h-screen">
          <Outlet context={{ onMobileMenuClick: () => setIsMobileMenuOpen(true) }} />
        </main>
      </div>
    </div>
  )
}

export default Layout