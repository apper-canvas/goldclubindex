import metricsData from "@/services/mockData/metrics.json"
import leadsData from "@/services/mockData/leads.json"
import dealsData from "@/services/mockData/deals.json"

export const dashboardService = {
  getMetrics: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return metricsData
  },

  getRecentLeads: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return leadsData
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  },

  getActiveDeals: async () => {
    await new Promise(resolve => setTimeout(resolve, 250))
    return dealsData
      .filter(deal => deal.stage !== "closed")
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }
}