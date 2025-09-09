import analyticsData from "@/services/mockData/analytics.json"

export const analyticsService = {
  getAnalytics: async (timeRange = "3months") => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Filter analytics data based on time range
    const data = { ...analyticsData }
    
    // Adjust data based on time range (simplified simulation)
    if (timeRange === "7days") {
      data.conversionData.months = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      data.revenueData.months = data.conversionData.months
    } else if (timeRange === "1month") {
      data.conversionData.months = ["Week 1", "Week 2", "Week 3", "Week 4"]
      data.revenueData.months = data.conversionData.months
    }
    
    return data
  }
}