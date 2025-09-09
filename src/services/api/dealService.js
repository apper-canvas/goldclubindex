import dealsData from "@/services/mockData/deals.json"

let deals = [...dealsData]

export const dealService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return [...deals]
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const deal = deals.find(d => d.Id === parseInt(id))
    if (!deal) {
      throw new Error("Deal not found")
    }
    return { ...deal }
  },

  create: async (dealData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const maxId = Math.max(...deals.map(d => d.Id), 0)
    const newDeal = {
      ...dealData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    deals.push(newDeal)
    return { ...newDeal }
  },

  update: async (id, dealData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = deals.findIndex(d => d.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Deal not found")
    }
    deals[index] = { ...deals[index], ...dealData, updatedAt: new Date().toISOString() }
    return { ...deals[index] }
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = deals.findIndex(d => d.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Deal not found")
    }
    deals.splice(index, 1)
    return true
  }
}