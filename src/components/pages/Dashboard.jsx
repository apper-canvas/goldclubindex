import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { toast } from "react-toastify"
import Header from "@/components/organisms/Header"
import MetricCard from "@/components/molecules/MetricCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { dashboardService } from "@/services/api/dashboardService"

const Dashboard = () => {
  const { onMobileMenuClick } = useOutletContext()
  const [metrics, setMetrics] = useState([])
  const [recentLeads, setRecentLeads] = useState([])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [metricsData, leadsData, dealsData] = await Promise.all([
        dashboardService.getMetrics(),
        dashboardService.getRecentLeads(),
        dashboardService.getActiveDeals()
      ])
      
      setMetrics(metricsData)
      setRecentLeads(leadsData)
      setDeals(dealsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const handleQuickAdd = () => {
    toast.success("Quick add modal would open here!")
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-64 shimmer mb-2"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-96 shimmer"></div>
        </div>
        <Loading type="cards" />
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Loading type="table" />
          <Loading type="chart" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadDashboardData} />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your golf club sales."
        onMobileMenuClick={onMobileMenuClick}
      >
        <Button
          variant="accent"
          icon="Plus"
          onClick={handleQuickAdd}
        >
          Quick Add
        </Button>
      </Header>

      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.Id}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              changeType={metric.changeType}
              icon={metric.icon}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Leads */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Recent Leads</h3>
              <Button variant="outline" size="sm" icon="ArrowRight">
                View All
              </Button>
            </div>
            
            {recentLeads.length === 0 ? (
              <Empty
                title="No recent leads"
                description="New leads will appear here as they come in"
                icon="Users"
                action={handleQuickAdd}
                actionLabel="Add Lead"
              />
            ) : (
              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <div key={lead.Id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-card">
                      <ApperIcon name="User" size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{lead.firstName} {lead.lastName}</p>
                      <p className="text-sm text-gray-500 truncate">{lead.email}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        lead.status === 'hot' 
                          ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800'
                          : lead.status === 'warm'
                          ? 'bg-gradient-to-r from-yellow-100 to-amber-200 text-yellow-800'
                          : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800'
                      }`}>
                        {lead.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{lead.source}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Deals */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Active Deals</h3>
              <Button variant="outline" size="sm" icon="ArrowRight">
                View Pipeline
              </Button>
            </div>
            
            {deals.length === 0 ? (
              <Empty
                title="No active deals"
                description="Track your sales opportunities and close more members"
                icon="GitBranch"
                action={handleQuickAdd}
                actionLabel="Add Deal"
              />
            ) : (
              <div className="space-y-4">
                {deals.map((deal) => (
                  <div key={deal.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-accent to-amber-500 rounded-full flex items-center justify-center shadow-card">
                        <ApperIcon name="DollarSign" size={16} className="text-gray-900" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{deal.title}</p>
                        <p className="text-sm text-gray-500">{deal.stage}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">${deal.value.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{deal.probability}% chance</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-6 text-center hover:shadow-elevation transition-all duration-200 cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-card">
              <ApperIcon name="UserPlus" size={24} className="text-white" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Add New Lead</h4>
            <p className="text-sm text-gray-600">Capture new prospects and grow your pipeline</p>
          </div>
          
          <div className="card p-6 text-center hover:shadow-elevation transition-all duration-200 cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-card">
              <ApperIcon name="Calendar" size={24} className="text-gray-900" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Schedule Tour</h4>
            <p className="text-sm text-gray-600">Book club tours for interested prospects</p>
          </div>
          
          <div className="card p-6 text-center hover:shadow-elevation transition-all duration-200 cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-card">
              <ApperIcon name="Trophy" size={24} className="text-white" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Close Deal</h4>
            <p className="text-sm text-gray-600">Convert prospects into club members</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard