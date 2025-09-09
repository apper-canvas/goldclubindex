import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import Dashboard from "@/components/pages/Dashboard"
import Leads from "@/components/pages/Leads"
import Hotlist from "@/components/pages/Hotlist"
import EditLead from "@/components/pages/EditLead"
import DealPipeline from "@/components/pages/DealPipeline"
import Calendar from "@/components/pages/Calendar"
import Analytics from "@/components/pages/Analytics"
import Leaderboard from "@/components/pages/Leaderboard"
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
<Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="hotlist" element={<Hotlist />} />
            <Route path="hotlist/edit/:id" element={<EditLead />} />
            <Route path="pipeline" element={<DealPipeline />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="leaderboard" element={<Leaderboard />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="text-sm font-medium"
        />
      </div>
    </BrowserRouter>
  )
}

export default App