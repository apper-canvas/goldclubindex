import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { toast } from "react-toastify"
import Header from "@/components/organisms/Header"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { userService } from "@/services/api/userService"

const Leaderboard = () => {
  const { onMobileMenuClick } = useOutletContext()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [period, setPeriod] = useState("month")
  const [metric, setMetric] = useState("revenue")

  const periods = [
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "This Quarter", value: "quarter" },
    { label: "This Year", value: "year" }
  ]

  const metrics = [
    { label: "Revenue", value: "revenue", icon: "DollarSign" },
    { label: "Deals Closed", value: "deals", icon: "Target" },
    { label: "New Leads", value: "leads", icon: "Users" },
    { label: "Conversion Rate", value: "conversion", icon: "TrendingUp" }
  ]

  const loadLeaderboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await userService.getLeaderboard(period, metric)
      setUsers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeaderboard()
  }, [period, metric])

  const handleCelebrate = (user) => {
    toast.success(`🎉 Great job ${user.name}! Keep up the excellent work!`)
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return "Trophy"
      case 2: return "Medal"
      case 3: return "Award"
      default: return "User"
    }
  }

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return "from-accent to-yellow-500"
      case 2: return "from-gray-300 to-gray-500"
      case 3: return "from-amber-600 to-yellow-700"
      default: return "from-gray-100 to-gray-200"
    }
  }

  const formatMetricValue = (value, metricType) => {
    switch (metricType) {
      case "revenue":
        return `$${value.toLocaleString()}`
      case "conversion":
        return `${value}%`
      default:
        return value.toString()
    }
  }

  const getMetricChange = (user) => {
    // Simulate change data
    const change = Math.floor(Math.random() * 30) - 10
    return {
      value: change,
      type: change >= 0 ? "positive" : "negative"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header
          title="Leaderboard"
          subtitle="Team performance rankings and achievements"
          onMobileMenuClick={onMobileMenuClick}
        />
        <div className="p-6">
          <Loading type="table" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header
          title="Leaderboard"
          subtitle="Team performance rankings and achievements"
          onMobileMenuClick={onMobileMenuClick}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadLeaderboard} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Leaderboard"
        subtitle={`${users.length} team members competing for excellence`}
        onMobileMenuClick={onMobileMenuClick}
      >
        <div className="flex items-center space-x-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {periods.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          <Button
            variant="accent"
            icon="Award"
          >
            Rewards
          </Button>
        </div>
      </Header>

      <div className="p-6">
        {users.length === 0 ? (
          <Empty
            title="No performance data available"
            description="Team performance data will appear here as sales activities are recorded"
            icon="Trophy"
          />
        ) : (
          <>
            {/* Metric Selection */}
            <div className="card p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Competition Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {metrics.map(m => (
                  <button
                    key={m.value}
                    onClick={() => setMetric(m.value)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${
                      metric === m.value
                        ? "border-primary bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      metric === m.value 
                        ? "bg-gradient-to-br from-primary to-secondary text-white" 
                        : "bg-gray-200 text-gray-600"
                    }`}>
                      <ApperIcon name={m.icon} size={16} />
                    </div>
                    <span className="font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Top 3 Podium */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">🏆 Top Performers</h3>
              <div className="flex justify-center items-end space-x-8">
                {users.slice(0, 3).map((user, index) => {
                  const rank = index + 1
                  const height = rank === 1 ? "h-32" : rank === 2 ? "h-28" : "h-24"
                  
                  return (
                    <div key={user.Id} className="text-center">
                      <div className="relative mb-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${getRankColor(rank)} rounded-full flex items-center justify-center shadow-elevation mb-2 mx-auto`}>
                          <ApperIcon name={getRankIcon(rank)} size={24} className={rank <= 3 ? "text-white" : "text-gray-600"} />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold shadow-card">
                          {rank}
                        </div>
                      </div>
                      
                      <div className={`${height} w-32 bg-gradient-to-t ${getRankColor(rank)} rounded-t-lg flex flex-col justify-end p-4 shadow-elevation`}>
                        <div className="text-white text-center">
                          <div className="font-bold text-sm mb-1">{user.name}</div>
                          <div className="text-xs opacity-90">
                            {formatMetricValue(user[metric] || 0, metric)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Full Leaderboard Table */}
            <div className="card overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Complete Rankings</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Sales Rep
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        {metrics.find(m => m.value === metric)?.label}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Change
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Deals
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user, index) => {
                      const rank = index + 1
                      const change = getMetricChange(user)
                      
                      return (
                        <tr 
                          key={user.Id} 
                          className={`hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-25 transition-colors duration-200 ${
                            rank <= 3 ? "bg-gradient-to-r from-primary-25 to-secondary-25" : ""
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 shadow-card ${
                                rank === 1 ? "bg-gradient-to-br from-accent to-yellow-500 text-white" :
                                rank === 2 ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white" :
                                rank === 3 ? "bg-gradient-to-br from-amber-600 to-yellow-700 text-white" :
                                "bg-gray-200 text-gray-600"
                              }`}>
                                {rank <= 3 ? (
                                  <ApperIcon name={getRankIcon(rank)} size={16} />
                                ) : (
                                  <span className="text-sm font-bold">{rank}</span>
                                )}
                              </div>
                              {rank <= 3 && (
                                <Badge variant={rank === 1 ? "accent" : rank === 2 ? "default" : "warning"} size="sm">
                                  {rank === 1 ? "🥇 Winner" : rank === 2 ? "🥈 Runner-up" : "🥉 Third"}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-card mr-4">
                                <ApperIcon name="User" size={16} className="text-white" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-lg font-bold text-gray-900">
                              {formatMetricValue(user[metric] || 0, metric)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <ApperIcon 
                                name={change.type === "positive" ? "TrendingUp" : "TrendingDown"} 
                                size={16} 
                                className={`mr-1 ${change.type === "positive" ? "text-success" : "text-error"}`}
                              />
                              <span className={`font-medium ${change.type === "positive" ? "text-success" : "text-error"}`}>
                                {change.value > 0 ? "+" : ""}{change.value}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {user.dealsCount || 0} closed
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleCelebrate(user)}
                                className="text-accent hover:text-accent-700 transition-colors duration-200 p-1 hover:bg-accent-50 rounded"
                                title="Celebrate achievement"
                              >
                                <ApperIcon name="PartyPopper" size={16} />
                              </button>
                              <button
                                onClick={() => toast.info(`View ${user.name}'s detailed performance`)}
                                className="text-primary hover:text-primary-700 transition-colors duration-200 p-1 hover:bg-primary-50 rounded"
                                title="View details"
                              >
                                <ApperIcon name="Eye" size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-card">
                  <ApperIcon name="Crown" size={24} className="text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Top Performer</h4>
                <p className="text-sm text-gray-600 mb-4">
                  {users[0]?.name} is leading this {period} with outstanding results!
                </p>
                <Badge variant="accent" size="md">🏆 Champion</Badge>
              </div>

              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-success to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-card">
                  <ApperIcon name="TrendingUp" size={24} className="text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Most Improved</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Biggest improvement in performance this period
                </p>
                <Badge variant="success" size="md">📈 Rising Star</Badge>
              </div>

              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-card">
                  <ApperIcon name="Target" size={24} className="text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Goal Crusher</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Consistently exceeding targets and expectations
                </p>
                <Badge variant="primary" size="md">🎯 Achiever</Badge>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Leaderboard