import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { toast } from "react-toastify"
import Chart from "react-apexcharts"
import Header from "@/components/organisms/Header"
import MetricCard from "@/components/molecules/MetricCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { analyticsService } from "@/services/api/analyticsService"

const Analytics = () => {
  const { onMobileMenuClick } = useOutletContext()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeRange, setTimeRange] = useState("3months")

  const timeRanges = [
    { label: "Last 7 Days", value: "7days" },
    { label: "Last Month", value: "1month" },
    { label: "Last 3 Months", value: "3months" },
    { label: "Last Year", value: "1year" }
  ]

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await analyticsService.getAnalytics(timeRange)
      setAnalytics(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const handleExportReport = () => {
    toast.success("Analytics report export would start here!")
  }

  // Chart configurations
  const conversionChartOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif"
    },
    colors: ["#2D5D3F", "#4A7C59", "#FFB300"],
    stroke: {
      curve: "smooth",
      width: 3
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: analytics?.conversionData?.months || [],
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px"
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px"
        }
      }
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 3
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      labels: {
        colors: "#6B7280"
      }
    },
    tooltip: {
      theme: "light",
      style: {
        fontSize: "12px"
      }
    }
  }

  const revenueChartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif"
    },
    colors: ["#FFB300", "#2D5D3F"],
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "60%"
      }
    },
    xaxis: {
      categories: analytics?.revenueData?.months || [],
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px"
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px"
        },
        formatter: (value) => `$${value.toLocaleString()}`
      }
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 3
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      labels: {
        colors: "#6B7280"
      }
    },
    tooltip: {
      theme: "light",
      style: {
        fontSize: "12px"
      },
      y: {
        formatter: (value) => `$${value.toLocaleString()}`
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header
          title="Analytics"
          subtitle="Track performance and identify growth opportunities"
          onMobileMenuClick={onMobileMenuClick}
        />
        <div className="p-6">
          <Loading type="cards" />
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Loading type="chart" />
            <Loading type="chart" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header
          title="Analytics"
          subtitle="Track performance and identify growth opportunities"
          onMobileMenuClick={onMobileMenuClick}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadAnalytics} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Analytics"
        subtitle="Comprehensive insights into your sales performance"
        onMobileMenuClick={onMobileMenuClick}
      >
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <Button
            variant="accent"
            icon="Download"
            onClick={handleExportReport}
          >
            Export
          </Button>
        </div>
      </Header>

      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={`$${analytics?.metrics?.totalRevenue?.toLocaleString() || 0}`}
            change={`${analytics?.metrics?.revenueGrowth || 0}%`}
            changeType={analytics?.metrics?.revenueGrowth >= 0 ? "positive" : "negative"}
            icon="DollarSign"
          />
          <MetricCard
            title="Conversion Rate"
            value={`${analytics?.metrics?.conversionRate || 0}%`}
            change={`${analytics?.metrics?.conversionGrowth || 0}%`}
            changeType={analytics?.metrics?.conversionGrowth >= 0 ? "positive" : "negative"}
            icon="TrendingUp"
          />
          <MetricCard
            title="New Members"
            value={analytics?.metrics?.newMembers || 0}
            change={`${analytics?.metrics?.memberGrowth || 0}%`}
            changeType={analytics?.metrics?.memberGrowth >= 0 ? "positive" : "negative"}
            icon="Users"
          />
          <MetricCard
            title="Avg Deal Size"
            value={`$${analytics?.metrics?.avgDealSize?.toLocaleString() || 0}`}
            change={`${analytics?.metrics?.dealSizeGrowth || 0}%`}
            changeType={analytics?.metrics?.dealSizeGrowth >= 0 ? "positive" : "negative"}
            icon="Target"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Lead Conversion Chart */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Lead Conversion Funnel</h3>
              <ApperIcon name="TrendingUp" size={20} className="text-primary" />
            </div>
            <Chart
              options={conversionChartOptions}
              series={[
                {
                  name: "New Leads",
                  data: analytics?.conversionData?.newLeads || []
                },
                {
                  name: "Qualified Leads",
                  data: analytics?.conversionData?.qualified || []
                },
                {
                  name: "Closed Deals",
                  data: analytics?.conversionData?.closed || []
                }
              ]}
              type="area"
              height={300}
            />
          </div>

          {/* Revenue Chart */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Revenue Performance</h3>
              <ApperIcon name="DollarSign" size={20} className="text-accent" />
            </div>
            <Chart
              options={revenueChartOptions}
              series={[
                {
                  name: "Target",
                  data: analytics?.revenueData?.target || []
                },
                {
                  name: "Actual",
                  data: analytics?.revenueData?.actual || []
                }
              ]}
              type="bar"
              height={300}
            />
          </div>
        </div>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Sources */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="MapPin" size={20} className="mr-2" />
              Top Lead Sources
            </h3>
            <div className="space-y-4">
              {analytics?.topSources?.map((source, index) => (
                <div key={source.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      index === 0 ? "bg-primary" :
                      index === 1 ? "bg-secondary" :
                      index === 2 ? "bg-accent" : "bg-gray-400"
                    }`}></div>
                    <span className="text-sm text-gray-700">{source.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{source.leads}</div>
                    <div className="text-xs text-gray-500">{source.percentage}%</div>
                  </div>
                </div>
              )) || []}
            </div>
          </div>

          {/* Conversion by Stage */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="GitBranch" size={20} className="mr-2" />
              Pipeline Performance
            </h3>
            <div className="space-y-4">
              {analytics?.pipelinePerformance?.map((stage, index) => (
                <div key={stage.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">{stage.name}</span>
                    <span className="font-medium">{stage.conversionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stage.conversionRate}%` }}
                    ></div>
                  </div>
                </div>
              )) || []}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Activity" size={20} className="mr-2" />
              Quick Insights
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-success-50 to-emerald-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-success-800">Best Day</div>
                  <div className="text-xs text-success-600">Most leads converted</div>
                </div>
                <div className="text-lg font-bold text-success-700">
                  {analytics?.insights?.bestDay || "Tuesday"}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-warning-50 to-amber-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-warning-800">Avg Response Time</div>
                  <div className="text-xs text-warning-600">To new leads</div>
                </div>
                <div className="text-lg font-bold text-warning-700">
                  {analytics?.insights?.avgResponseTime || "2.4h"}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-info-50 to-blue-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-info-800">Tours Booked</div>
                  <div className="text-xs text-info-600">This period</div>
                </div>
                <div className="text-lg font-bold text-info-700">
                  {analytics?.insights?.toursBooked || "47"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics