import leadsData from "@/services/mockData/leads.json"

let leads = [...leadsData]

export const leadService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return [...leads]
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const lead = leads.find(l => l.Id === parseInt(id))
    if (!lead) {
      throw new Error("Lead not found")
    }
    return { ...lead }
  },

create: async (leadData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const maxId = Math.max(...leads.map(l => l.Id), 0)
    const newLead = {
      ...leadData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      lastContact: new Date().toISOString(),
      // Auto-generate LinkedIn URL from website
      LinkedInURL: leadData.WebsiteURL ? 
        `https://linkedin.com/company/${leadData.WebsiteURL.replace(/https?:\/\//, '').replace(/\/$/, '').split('/')[0].replace('www.', '')}` : 
        ''
    }
    leads.push(newLead)
    return { ...newLead }
  },

update: async (id, leadData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = leads.findIndex(l => l.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Lead not found")
    }
    
    // Auto-generate LinkedIn URL if website changed
    if (leadData.WebsiteURL) {
      leadData.LinkedInURL = `https://linkedin.com/company/${leadData.WebsiteURL.replace(/https?:\/\//, '').replace(/\/$/, '').split('/')[0].replace('www.', '')}`
    }
    
    leads[index] = { ...leads[index], ...leadData, updatedAt: new Date().toISOString() }
    return { ...leads[index] }
  },

delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = leads.findIndex(l => l.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Lead not found")
    }
    leads.splice(index, 1)
    return true
  },

  getHotLeads: async () => {
    await new Promise(resolve => setTimeout(resolve, 400))
    // Filter leads that are "hot" based on status and recent activity
    const hotStatuses = ['Connected', 'Meeting Booked', 'Proposal Sent', 'Follow-up Scheduled']
    const hotLeads = leads.filter(lead => {
      // Consider leads hot if they have active status or recent contact
      const hasHotStatus = hotStatuses.includes(lead.Status)
      const hasRecentContact = lead.lastContact && 
        new Date(lead.lastContact) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Within last 7 days
      
      return hasHotStatus || hasRecentContact
    })
    
    return {
      data: hotLeads,
      total: hotLeads.length
    }
  }
}