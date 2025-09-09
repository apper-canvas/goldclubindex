import React, { useCallback, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "@/components/atoms/Select";
import { leadService } from "@/services/api/leadService";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import SearchFilter from "@/components/molecules/SearchFilter";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Header from "@/components/organisms/Header";

// Business tool categories for dropdown
const CATEGORIES = [
  { value: "Form Builder", label: "Form Builder" },
  { value: "CRM", label: "CRM" },
  { value: "Project Management", label: "Project Management" },
  { value: "Affiliate Management", label: "Affiliate Management" },
  { value: "Help Desk", label: "Help Desk" },
  { value: "Live Chat", label: "Live Chat" },
  { value: "Graphic Design", label: "Graphic Design" },
  { value: "WordPress Plugin", label: "WordPress Plugin" },
  { value: "VPN", label: "VPN" },
  { value: "Landing Page Builder", label: "Landing Page Builder" },
  { value: "Meeting Assistant", label: "Meeting Assistant" },
  { value: "Course Builder", label: "Course Builder" },
  { value: "Sales Funnel Builder", label: "Sales Funnel Builder" },
  { value: "AI Writing Assistant", label: "AI Writing Assistant" },
  { value: "Transcription Software", label: "Transcription Software" },
  { value: "Email Marketing", label: "Email Marketing" },
  { value: "Social Media Management", label: "Social Media Management" },
  { value: "E-commerce", label: "E-commerce" },
  { value: "Analytics", label: "Analytics" },
  { value: "SEO Tools", label: "SEO Tools" },
  { value: "Accounting Software", label: "Accounting Software" },
  { value: "HR Management", label: "HR Management" },
  { value: "Inventory Management", label: "Inventory Management" },
  { value: "Video Editing", label: "Video Editing" },
  { value: "Password Manager", label: "Password Manager" },
  { value: "Backup Solutions", label: "Backup Solutions" },
  { value: "File Storage", label: "File Storage" },
  { value: "Survey Tools", label: "Survey Tools" },
  { value: "Web Hosting", label: "Web Hosting" },
  { value: "Domain Registration", label: "Domain Registration" },
  { value: "SSL Certificates", label: "SSL Certificates" },
  { value: "CDN Services", label: "CDN Services" },
  { value: "API Management", label: "API Management" },
  { value: "Database Tools", label: "Database Tools" },
  { value: "DevOps Tools", label: "DevOps Tools" },
  { value: "Testing Tools", label: "Testing Tools" },
  { value: "Code Editor", label: "Code Editor" },
  { value: "Version Control", label: "Version Control" },
  { value: "Collaboration Tools", label: "Collaboration Tools" },
  { value: "Time Tracking", label: "Time Tracking" },
  { value: "Invoicing", label: "Invoicing" },
  { value: "Payment Processing", label: "Payment Processing" },
  { value: "Subscription Management", label: "Subscription Management" },
  { value: "Customer Support", label: "Customer Support" },
  { value: "Knowledge Base", label: "Knowledge Base" },
  { value: "Community Platform", label: "Community Platform" },
  { value: "Event Management", label: "Event Management" },
  { value: "Appointment Scheduling", label: "Appointment Scheduling" },
  { value: "Calendar Management", label: "Calendar Management" },
  { value: "Task Management", label: "Task Management" },
  { value: "Document Management", label: "Document Management" },
  { value: "PDF Tools", label: "PDF Tools" },
  { value: "Image Optimization", label: "Image Optimization" },
  { value: "Content Management", label: "Content Management" },
  { value: "Blog Platform", label: "Blog Platform" },
  { value: "Newsletter Tools", label: "Newsletter Tools" },
  { value: "Push Notifications", label: "Push Notifications" },
  { value: "SMS Marketing", label: "SMS Marketing" },
  { value: "Voice Tools", label: "Voice Tools" },
  { value: "Video Conferencing", label: "Video Conferencing" },
  { value: "Screen Recording", label: "Screen Recording" },
  { value: "Webinar Platform", label: "Webinar Platform" },
  { value: "Podcast Tools", label: "Podcast Tools" },
  { value: "Music Production", label: "Music Production" },
  { value: "Photo Editing", label: "Photo Editing" },
  { value: "3D Design", label: "3D Design" },
  { value: "CAD Software", label: "CAD Software" },
  { value: "Architecture Tools", label: "Architecture Tools" },
  { value: "Real Estate", label: "Real Estate" },
  { value: "Legal Software", label: "Legal Software" },
  { value: "Healthcare Tools", label: "Healthcare Tools" },
  { value: "Fitness Apps", label: "Fitness Apps" },
  { value: "Diet Tracking", label: "Diet Tracking" },
  { value: "Mental Health", label: "Mental Health" },
  { value: "Education Platform", label: "Education Platform" },
  { value: "LMS", label: "Learning Management System" },
  { value: "Language Learning", label: "Language Learning" },
  { value: "Coding Education", label: "Coding Education" },
  { value: "Business Intelligence", label: "Business Intelligence" },
  { value: "Data Visualization", label: "Data Visualization" },
  { value: "Machine Learning", label: "Machine Learning" },
  { value: "AI Platform", label: "AI Platform" },
  { value: "Chatbot Builder", label: "Chatbot Builder" },
  { value: "Voice Assistant", label: "Voice Assistant" },
  { value: "OCR Tools", label: "OCR Tools" },
  { value: "Translation Tools", label: "Translation Tools" },
  { value: "Grammar Checker", label: "Grammar Checker" },
  { value: "Plagiarism Checker", label: "Plagiarism Checker" },
  { value: "Citation Tools", label: "Citation Tools" },
  { value: "Research Tools", label: "Research Tools" },
  { value: "Note Taking", label: "Note Taking" },
  { value: "Mind Mapping", label: "Mind Mapping" },
  { value: "Whiteboard Tools", label: "Whiteboard Tools" },
  { value: "Presentation Tools", label: "Presentation Tools" },
  { value: "Slideshow Maker", label: "Slideshow Maker" },
  { value: "Infographic Tools", label: "Infographic Tools" },
  { value: "Logo Maker", label: "Logo Maker" },
  { value: "Brand Management", label: "Brand Management" },
  { value: "Marketing Automation", label: "Marketing Automation" },
  { value: "Lead Generation", label: "Lead Generation" },
  { value: "Sales Automation", label: "Sales Automation" },
  { value: "Proposal Software", label: "Proposal Software" },
  { value: "Contract Management", label: "Contract Management" },
  { value: "E-signature", label: "E-signature" },
  { value: "Workflow Automation", label: "Workflow Automation" },
  { value: "Integration Platform", label: "Integration Platform" },
  { value: "No-Code Platform", label: "No-Code Platform" },
  { value: "Low-Code Platform", label: "Low-Code Platform" },
  { value: "App Builder", label: "App Builder" },
  { value: "Website Builder", label: "Website Builder" },
  { value: "Theme Marketplace", label: "Theme Marketplace" },
  { value: "Plugin Marketplace", label: "Plugin Marketplace" },
  { value: "Stock Photos", label: "Stock Photos" },
  { value: "Icon Library", label: "Icon Library" },
  { value: "Font Library", label: "Font Library" },
  { value: "Color Palette", label: "Color Palette" },
  { value: "Design System", label: "Design System" }
].sort((a, b) => a.label.localeCompare(b.label))

const TEAM_SIZE_OPTIONS = [
  { value: "1-3", label: "1-3" },
  { value: "4-10", label: "4-10" },
  { value: "11-50", label: "11-50" },
  { value: "51-200", label: "51-200" },
  { value: "200+", label: "200+" }
]

const STATUS_OPTIONS = [
  { value: "Connected", label: "Connected" },
  { value: "Locked", label: "Locked" },
  { value: "Meeting Booked", label: "Meeting Booked" },
  { value: "Meeting Done", label: "Meeting Done" },
  { value: "Negotiation", label: "Negotiation" },
  { value: "Closed", label: "Closed" },
  { value: "Lost", label: "Lost" },
  { value: "Launched on AppSumo", label: "Launched on AppSumo" },
  { value: "Launched on Prime Club", label: "Launched on Prime Club" },
  { value: "Keep an Eye", label: "Keep an Eye" },
  { value: "Rejected", label: "Rejected" },
  { value: "Unsubscribed", label: "Unsubscribed" },
  { value: "Outdated", label: "Outdated" },
  { value: "Hotlist", label: "Hotlist" },
  { value: "Out of League", label: "Out of League" }
]

const FUNDING_TYPE_OPTIONS = [
  { value: "Bootstrapped", label: "Bootstrapped" },
  { value: "Pre-seed", label: "Pre-seed" },
  { value: "Y Combinator", label: "Y Combinator" },
  { value: "Angel", label: "Angel" },
  { value: "Series A", label: "Series A" },
  { value: "Series B", label: "Series B" },
  { value: "Series C", label: "Series C" }
]

const EDITION_OPTIONS = [
  { value: "Select Edition", label: "Select Edition" },
  { value: "Black Edition", label: "Black Edition" },
  { value: "Collector's Edition", label: "Collector's Edition" },
  { value: "Limited Edition", label: "Limited Edition" }
]

const SALES_REP_OPTIONS = [
  { value: "Sarah Johnson", label: "Sarah Johnson" },
  { value: "Mike Chen", label: "Mike Chen" },
  { value: "Alex Rivera", label: "Alex Rivera" },
  { value: "Jessica Wong", label: "Jessica Wong" },
  { value: "David Kim", label: "David Kim" },
  { value: "Emma Thompson", label: "Emma Thompson" },
  { value: "Ryan Martinez", label: "Ryan Martinez" }
]

// Utility function to format website URL
const formatWebsiteURL = (url) => {
  if (!url) return ""
  let formatted = url.trim()
  if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
    formatted = "https://" + formatted
  }
  return formatted.replace(/\/$/, "") // Remove trailing slash
}

// Utility function to generate LinkedIn URL from website
const generateLinkedInURL = (websiteURL) => {
  if (!websiteURL) return ""
  const domain = websiteURL.replace(/https?:\/\//, '').replace(/\/$/, '').split('/')[0].replace('www.', '')
return `https://linkedin.com/company/${domain}`
}

export default function Leads() {
  const { onMobileMenuClick } = useOutletContext()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingCell, setEditingCell] = useState(null)
  const [savingCells, setSavingCells] = useState(new Set())
  const [newLead, setNewLead] = useState({
    ProductName: "",
    Name: "",
    WebsiteURL: "",
    TeamSize: "",
    ARR: "",
    Category: "",
    LinkedInURL: "",
    Status: "",
    FundingType: "",
    Edition: "",
    SalesRep: "",
    FollowUpReminder: ""
  })

  const debounceTimers = useRef({})
  const inputRefs = useRef({})

  const statusFilters = [
    { label: "All Leads", value: "all" },
    { label: "Connected", value: "Connected" },
    { label: "Meeting Booked", value: "Meeting Booked" },
    { label: "Negotiation", value: "Negotiation" },
    { label: "Closed", value: "Closed" },
    { label: "Hotlist", value: "Hotlist" }
  ]

const loadLeads = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await leadService.getAll()
      setLeads(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [])

  // Debounced auto-save function
  const debouncedSave = useCallback((leadId, field, value) => {
    const key = `${leadId}-${field}`
    
    // Clear existing timer
    if (debounceTimers.current[key]) {
      clearTimeout(debounceTimers.current[key])
    }

    // Set new timer
    debounceTimers.current[key] = setTimeout(async () => {
      setSavingCells(prev => new Set([...prev, key]))
      
      try {
        const lead = leads.find(l => l.Id === leadId)
        const updatedData = { ...lead, [field]: value }
        
        // Auto-generate LinkedIn URL if website changed
        if (field === 'WebsiteURL' && value) {
          const formattedURL = formatWebsiteURL(value)
          updatedData.WebsiteURL = formattedURL
          updatedData.LinkedInURL = generateLinkedInURL(formattedURL)
        }

        await leadService.update(leadId, updatedData)
        setLeads(prev => prev.map(l => l.Id === leadId ? updatedData : l))
        toast.success("Lead updated successfully")
      } catch (err) {
        toast.error("Failed to update lead")
        console.error(err)
      } finally {
        setSavingCells(prev => {
          const newSet = new Set(prev)
          newSet.delete(key)
          return newSet
        })
      }
    }, 500)
  }, [leads])

  const handleCellEdit = (leadId, field, value) => {
    // Update local state immediately for responsive UI
    setLeads(prev => prev.map(l => 
      l.Id === leadId ? { ...l, [field]: value } : l
    ))
    
    // Debounced save to backend
    debouncedSave(leadId, field, value)
  }

  const handleNewLeadSubmit = async () => {
    if (!newLead.ProductName || !newLead.Name) {
      toast.error("Product name and company name are required")
      return
    }

    try {
      const leadData = {
        ...newLead,
        WebsiteURL: formatWebsiteURL(newLead.WebsiteURL),
        LinkedInURL: newLead.WebsiteURL ? generateLinkedInURL(formatWebsiteURL(newLead.WebsiteURL)) : "",
        ARR: parseFloat(newLead.ARR) || 0
      }

      const createdLead = await leadService.create(leadData)
      setLeads(prev => [createdLead, ...prev])
      setNewLead({
        ProductName: "",
        Name: "",
        WebsiteURL: "",
        TeamSize: "",
        ARR: "",
        Category: "",
        LinkedInURL: "",
        Status: "",
        FundingType: "",
        Edition: "",
        SalesRep: "",
        FollowUpReminder: ""
      })
      toast.success("Lead added successfully!")
    } catch (err) {
      toast.error("Failed to add lead")
      console.error(err)
    }
  }
const handleDeleteLead = async (leadId) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await leadService.delete(leadId)
        setLeads(leads.filter(lead => lead.Id !== leadId))
        toast.success("Lead deleted successfully!")
      } catch (err) {
        toast.error("Failed to delete lead")
      }
    }
  }

const handleResetFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
  }

const filteredLeads = leads.filter(lead => {
    const matchesSearch = (lead.ProductName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lead.Name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lead.Category || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || lead.Status === statusFilter
    return matchesSearch && matchesStatus
  })

const getStatusVariant = (status) => {
    switch (status) {
      case "Connected": return "success"
      case "Meeting Booked": return "info"
      case "Meeting Done": return "primary"
      case "Negotiation": return "warning"
      case "Closed": return "success"
      case "Lost": return "error"
      case "Hotlist": return "error"
      case "Launched on AppSumo": return "accent"
      case "Launched on Prime Club": return "secondary"
      default: return "default"
    }
  }

  const getFundingVariant = (type) => {
    switch (type) {
      case "Bootstrapped": return "default"
      case "Pre-seed": return "info"
      case "Y Combinator": return "accent"
      case "Angel": return "primary"
      case "Series A": return "success"
      case "Series B": return "warning"
      case "Series C": return "error"
      default: return "default"
    }
  }

  // Inline cell editor component
  const CellEditor = ({ lead, field, value, type = "text" }) => {
    const cellKey = `${lead.Id}-${field}`
    const isSaving = savingCells.has(cellKey)
    
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        setEditingCell(null)
      }
    }

    if (type === "select") {
      let options = []
      switch (field) {
        case "TeamSize": options = TEAM_SIZE_OPTIONS; break
        case "Category": options = CATEGORIES; break
        case "Status": options = STATUS_OPTIONS; break
        case "FundingType": options = FUNDING_TYPE_OPTIONS; break
        case "Edition": options = EDITION_OPTIONS; break
        case "SalesRep": options = SALES_REP_OPTIONS; break
      }
      
      return (
        <Select
          options={options}
          value={value}
          onChange={(newValue) => handleCellEdit(lead.Id, field, newValue)}
          searchable={field === "Category"}
          className="min-w-40"
        />
      )
    }

    return (
      <Input
        type={type}
        value={value || ""}
        onChange={(e) => handleCellEdit(lead.Id, field, e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => setEditingCell(null)}
        className="min-w-32"
        autoFocus
        disabled={isSaving}
      />
    )
  }

  // Inline cell display component
  const CellDisplay = ({ lead, field, value, type = "text" }) => {
    const cellKey = `${lead.Id}-${field}`
    const isSaving = savingCells.has(cellKey)
    const isEditing = editingCell === cellKey

    if (isEditing) {
      return <CellEditor lead={lead} field={field} value={value} type={type} />
    }

    const handleClick = () => setEditingCell(cellKey)

    if (type === "url" && value) {
      return (
        <div className="flex items-center space-x-2">
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-700 hover:underline truncate max-w-32"
            onClick={(e) => e.stopPropagation()}
          >
            {value.replace(/https?:\/\//, '')}
          </a>
          <button onClick={handleClick} className="text-gray-400 hover:text-gray-600">
            <ApperIcon name="Edit2" size={12} />
          </button>
          {isSaving && (
            <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      )
}

    if (type === "badge") {
      const variant = field === "Status" ? getStatusVariant(value) : getFundingVariant(value)
      return (
        <div className="flex items-center space-x-2 min-w-fit">
          {value ? (
            <Badge variant={variant} size="sm">{value}</Badge>
          ) : (
            <span className="text-gray-400 text-sm">Select {field}</span>
          )}
          <button onClick={handleClick} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <ApperIcon name="Edit2" size={12} />
          </button>
          {isSaving && (
            <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
          )}
        </div>
      )
    }

    return (
      <div 
        className="cursor-pointer hover:bg-gray-50 p-1 rounded min-h-6 flex items-center space-x-2"
        onClick={handleClick}
      >
        <span className="truncate">{value || "—"}</span>
        {isSaving && (
          <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header
          title="Leads"
          subtitle="Manage your sales prospects and potential club members"
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
          title="Leads"
          subtitle="Manage your sales prospects and potential club members"
          onMobileMenuClick={onMobileMenuClick}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadLeads} />
        </div>
      </div>
    )
  }

return (
    <div className="min-h-screen">
      <Header
        title="Leads Management"
        subtitle={`${leads.length} business leads in your pipeline`}
        onMobileMenuClick={onMobileMenuClick}
      >
        <Button
          variant="accent"
          icon="Download"
          onClick={() => toast.info("Export feature coming soon!")}
        >
          Export
        </Button>
      </Header>

<div className="p-6">
        {/* Search and Filters */}
        <div className="card p-6 mb-6">
          <SearchFilter
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            filters={statusFilters}
            selectedFilter={statusFilter}
            onFilterChange={setStatusFilter}
            onReset={handleResetFilters}
            placeholder="Search by product name, company, or category..."
          />
        </div>

{/* Comprehensive Leads Table */}
<div className="card overflow-visible">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-40">
                    Product Name
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-40">
                    Company Name
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-48">
                    Website URL
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-32">
                    Team Size
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-24">
                    ARR ($M)
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-48">
                    Category
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-48">
                    LinkedIn URL
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-40">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-32">
                    Funding
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-40">
                    Edition
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-32">
                    Sales Rep
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-32">
                    Follow-up
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-20">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* New Lead Entry Row - Always at top */}
                <tr className="bg-green-50 border-l-4 border-green-400">
                  <td className="px-3 py-2">
                    <Input
                      value={newLead.ProductName}
                      onChange={(e) => setNewLead(prev => ({ ...prev, ProductName: e.target.value }))}
                      placeholder="Enter product name..."
                      className="text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      value={newLead.Name}
                      onChange={(e) => setNewLead(prev => ({ ...prev, Name: e.target.value }))}
                      placeholder="Enter company name..."
                      className="text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      value={newLead.WebsiteURL}
                      onChange={(e) => {
                        const value = e.target.value
                        setNewLead(prev => ({ 
                          ...prev, 
                          WebsiteURL: value,
                          LinkedInURL: value ? generateLinkedInURL(formatWebsiteURL(value)) : ""
                        }))
                      }}
                      placeholder="website.com"
                      className="text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Select
                      options={TEAM_SIZE_OPTIONS}
                      value={newLead.TeamSize}
                      onChange={(value) => setNewLead(prev => ({ ...prev, TeamSize: value }))}
                      placeholder="Select..."
                      className="text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={newLead.ARR}
                      onChange={(e) => setNewLead(prev => ({ ...prev, ARR: e.target.value }))}
                      placeholder="0.0"
                      className="text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Select
                      options={CATEGORIES}
                      value={newLead.Category}
                      onChange={(value) => setNewLead(prev => ({ ...prev, Category: value }))}
                      placeholder="Select category..."
                      searchable
                      className="text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      value={newLead.LinkedInURL}
                      onChange={(e) => setNewLead(prev => ({ ...prev, LinkedInURL: e.target.value }))}
                      placeholder="Auto-generated..."
                      className="text-sm text-gray-500"
                      readOnly
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Select
                      options={STATUS_OPTIONS}
                      value={newLead.Status}
                      onChange={(value) => setNewLead(prev => ({ ...prev, Status: value }))}
                      placeholder="Select..."
                      className="text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Select
                      options={FUNDING_TYPE_OPTIONS}
                      value={newLead.FundingType}
                      onChange={(value) => setNewLead(prev => ({ ...prev, FundingType: value }))}
                      placeholder="Select..."
                      className="text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Select
                      options={EDITION_OPTIONS}
                      value={newLead.Edition}
                      onChange={(value) => setNewLead(prev => ({ ...prev, Edition: value }))}
                      placeholder="Select..."
                      className="text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Select
                      options={SALES_REP_OPTIONS}
                      value={newLead.SalesRep}
                      onChange={(value) => setNewLead(prev => ({ ...prev, SalesRep: value }))}
                      placeholder="Select..."
                      className="text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="date"
                      value={newLead.FollowUpReminder}
                      onChange={(e) => setNewLead(prev => ({ ...prev, FollowUpReminder: e.target.value }))}
                      className="text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Button
                      size="sm"
                      variant="accent"
                      icon="Plus"
                      onClick={handleNewLeadSubmit}
                      disabled={!newLead.ProductName || !newLead.Name}
                    >
                      Add
                    </Button>
                  </td>
                </tr>

                {/* Existing Leads */}
                {filteredLeads.map((lead) => (
                  <tr key={lead.Id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-3 py-2">
                      <CellDisplay lead={lead} field="ProductName" value={lead.ProductName} />
                    </td>
                    <td className="px-3 py-2">
                      <CellDisplay lead={lead} field="Name" value={lead.Name} />
                    </td>
                    <td className="px-3 py-2">
                      <CellDisplay lead={lead} field="WebsiteURL" value={lead.WebsiteURL} type="url" />
                    </td>
                    <td className="px-3 py-2">
                      <CellDisplay lead={lead} field="TeamSize" value={lead.TeamSize} type="select" />
                    </td>
                    <td className="px-3 py-2">
                      <CellDisplay lead={lead} field="ARR" value={lead.ARR} type="number" />
                    </td>
                    <td className="px-3 py-2">
                      <CellDisplay lead={lead} field="Category" value={lead.Category} type="select" />
                    </td>
                    <td className="px-3 py-2">
                      <CellDisplay lead={lead} field="LinkedInURL" value={lead.LinkedInURL} type="url" />
                    </td>
                    <td className="px-3 py-2">
                      <CellDisplay lead={lead} field="Status" value={lead.Status} type="badge" />
                    </td>
                    <td className="px-3 py-2">
                      <CellDisplay lead={lead} field="FundingType" value={lead.FundingType} type="badge" />
                    </td>
                    <td className="px-3 py-2">
                      <CellDisplay lead={lead} field="Edition" value={lead.Edition} type="select" />
                    </td>
                    <td className="px-3 py-2">
                      <CellDisplay lead={lead} field="SalesRep" value={lead.SalesRep} type="select" />
                    </td>
                    <td className="px-3 py-2">
                      <CellDisplay lead={lead} field="FollowUpReminder" value={lead.FollowUpReminder} type="date" />
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => handleDeleteLead(lead.Id)}
                        className="text-error hover:text-red-700 transition-colors duration-200 p-1 hover:bg-red-50 rounded"
                        title="Delete lead"
                      >
                        <ApperIcon name="Trash2" size={14} />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredLeads.length === 0 && leads.length > 0 && (
                  <tr>
                    <td colSpan="13" className="px-6 py-8 text-center text-gray-500">
                      <ApperIcon name="Search" size={24} className="mx-auto mb-2" />
                      <div className="text-lg font-medium">No leads match your filters</div>
                      <div className="text-sm">Try adjusting your search terms or filters</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        {leads.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {statusFilters.slice(1).map((filter) => {
              const count = leads.filter(lead => lead.Status === filter.value).length
              return (
                <div key={filter.value} className="card p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-xs text-gray-600">{filter.label}</div>
                </div>
              )
            })}
          </div>
)}
      </div>
    </div>
  )
}