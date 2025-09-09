import usersData from "@/services/mockData/users.json"

export const userService = {
  getLeaderboard: async (period = "month", metric = "revenue") => {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    // Sort users by the specified metric
    const sortedUsers = [...usersData].sort((a, b) => {
      const aValue = a[metric] || 0
      const bValue = b[metric] || 0
      return bValue - aValue
    })
    
    return sortedUsers
  },

  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...usersData]
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const user = usersData.find(u => u.Id === parseInt(id))
    if (!user) {
      throw new Error("User not found")
    }
    return { ...user }
  }
}