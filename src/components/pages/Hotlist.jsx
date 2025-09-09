import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { leadService } from "@/services/api/leadService";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Header from "@/components/organisms/Header";
// Business tool categories and options - identical to Leads
const CATEGORIES = [
  { value: "Form Builder", label: "Form Builder" },
  { value: "CRM", label: "CRM" },
  { value: "Project Management", label: "Project Management" },
  // ... (keeping same categories structure as Leads for consistency)
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

// Utility functions - identical to Leads for consistency
const formatWebsiteURL = (url) => {
  if (!url) return ""
  let formatted = url.trim()
  if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
    formatted = "https://" + formatted
  }
  return formatted.replace(/\/$/, "")
}

const generateLinkedInURL = (websiteURL) => {
  if (!websiteURL) return ""
  const domain = websiteURL.replace(/https?:\/\//, '').replace(/\/$/, '').split('/')[0].replace('www.', '')
  return `https://linkedin.com/company/${domain}`
}

function Hotlist() {
  const { onMobileMenuClick } = useOutletContext()
  
  // State management
  const [hotLeads, setHotLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedLeads, setSelectedLeads] = useState(new Set())
  const [editingCell, setEditingCell] = useState(null)
  const [savingCells, setSavingCells] = useState(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const navigate = useNavigate()
  
  // Status filter options
  const statusFilters = [
    { value: "All", label: "All Status" },
    { value: "Connected", label: "Connected" },
    { value: "Locked", label: "Locked" },
    { value: "Meeting Booked", label: "Meeting Booked" },
    { value: "Pitched", label: "Pitched" },
    { value: "Demo Scheduled", label: "Demo Scheduled" },
    { value: "Proposal Sent", label: "Proposal Sent" },
    { value: "Follow-up", label: "Follow-up" },
    { value: "Qualified", label: "Qualified" },
    { value: "Not Interested", label: "Not Interested" },
    { value: "Unqualified", label: "Unqualified" },
    { value: "Do Not Contact", label: "Do Not Contact" }
]

  // Filter leads based on search and status
  const filteredLeads = hotLeads.filter(lead => {
    const matchesSearch = !searchTerm || 
      lead.ProductName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.Category?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "All" || lead.Status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Load hot leads data
  const loadHotLeads = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await leadService.getHotLeads()
      setHotLeads(response.data || [])
    } catch (err) {
      console.error('Error loading hot leads:', err)
      setError('Failed to load hot leads. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initialize data
  useEffect(() => {
    loadHotLeads()
  }, [loadHotLeads])

  // Handle cell edit
  const handleCellEdit = async (leadId, field, value) => {
    const cellKey = `${leadId}-${field}`
    
    try {
      setSavingCells(prev => new Set([...prev, cellKey]))
      
      // Update local state immediately
      setHotLeads(prev => prev.map(lead => 
        lead.Id === leadId ? { ...lead, [field]: value } : lead
      ))
      
      // Save to backend
      await leadService.updateLead(leadId, { [field]: value })
      toast.success('Lead updated successfully')
      
      // Auto-generate LinkedIn URL if website changed
      if (field === 'WebsiteURL' && value) {
        const linkedInURL = generateLinkedInURL(formatWebsiteURL(value))
        setHotLeads(prev => prev.map(lead => 
          lead.Id === leadId ? { ...lead, LinkedInURL: linkedInURL } : lead
        ))
        await leadService.updateLead(leadId, { LinkedInURL: linkedInURL })
      }
      
    } catch (err) {
      console.error('Error updating lead:', err)
      toast.error('Failed to update lead')
      // Revert local state on error
      loadHotLeads()
    } finally {
      setSavingCells(prev => {
        const newSet = new Set(prev)
        newSet.delete(cellKey)
        return newSet
      })
      setEditingCell(null)
    }
  }


  // Handle delete lead
  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this hot lead?')) {
      return
    }

    try {
      await leadService.deleteLead(leadId)
      setHotLeads(prev => prev.filter(lead => lead.Id !== leadId))
      setSelectedLeads(prev => {
        const newSet = new Set(prev)
        newSet.delete(leadId)
        return newSet
      })
      toast.success('Hot lead deleted successfully')
    } catch (err) {
      console.error('Error deleting lead:', err)
      toast.error('Failed to delete lead')
    }
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedLeads.size === 0) return
    
    if (!window.confirm(`Are you sure you want to delete ${selectedLeads.size} selected hot leads?`)) {
      return
    }

    try {
      await Promise.all(
        Array.from(selectedLeads).map(leadId => leadService.deleteLead(leadId))
      )
      
      setHotLeads(prev => prev.filter(lead => !selectedLeads.has(lead.Id)))
      setSelectedLeads(new Set())
      toast.success(`${selectedLeads.size} hot leads deleted successfully`)
    } catch (err) {
      console.error('Error deleting leads:', err)
      toast.error('Failed to delete some leads')
    }
  }

// Handle edit lead
  const handleEditLead = (leadId) => {
    navigate(`/hotlist/edit/${leadId}`)
  }

  // Get funding type variant for badges
  const getFundingVariant = (type) => {
    const variants = {
      'Bootstrapped': 'primary',
      'Pre-seed': 'warning',
      'Seed': 'info', 
      'Series A': 'success',
      'Series B': 'secondary',
      'Y Combinator': 'accent',
      'Venture Capital': 'info'
    }
    return variants[type] || 'default'
}

  // Status variant function for Badge styling
  function getStatusVariant(status) {
    switch (status) {
      case 'Connected':
        return 'success';
      case 'Locked':
        return 'error';
      case 'Meeting Booked':
        return 'info';
      case 'Qualified':
        return 'success';
      case 'Unqualified':
        return 'error';
      case 'Not Interested':
        return 'secondary';
      case 'Do Not Contact':
        return 'error';
      case 'Callback Requested':
        return 'warning';
      case 'Email Sent':
        return 'info';
      case 'Follow Up':
        return 'warning';
      case 'Proposal Sent':
        return 'primary';
      case 'Negotiating':
        return 'warning';
      case 'Closed Won':
        return 'success';
      case 'Closed Lost':
        return 'error';
      case 'On Hold':
        return 'secondary';
      default:
        return 'secondary';
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
          title="Hotlist"
          subtitle="High-priority leads requiring immediate attention"
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
          title="Hotlist"
          subtitle="High-priority leads requiring immediate attention"
          onMobileMenuClick={onMobileMenuClick}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadHotLeads} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
    <Header
        title="Hotlist Management"
        subtitle={`${hotLeads.length} high-priority leads requiring immediate attention`}
        onMobileMenuClick={onMobileMenuClick}>
        {selectedLeads.size > 0 && <Button variant="error" icon="Trash2" onClick={handleBulkDelete} className="mr-2">Delete ({selectedLeads.size})
                      </Button>}
        <Button
            variant="accent"
            icon="Flame"
            onClick={() => toast.info("Priority actions coming soon!")}>Priority Actions
                    </Button>
    </Header>
    <div className="p-6">
        {/* Priority Alert Banner */}
        <div
            className="bg-gradient-to-r from-error-50 to-red-100 border border-error-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
                <div
                    className="w-8 h-8 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center mr-3">
                    <ApperIcon name="AlertTriangle" size={16} className="text-white" />
                </div>
                <div>
<h3 className="font-bold text-error-800">Urgent Action Required</h3>
                    <p className="text-error-700 text-sm">You have {hotLeads.length} high-priority leads that need immediate follow-up to maximize conversion.
                                      </p>
                </div>
            </div>
        </div>
        {/* Comprehensive Hotlist Table - identical structure to Leads */}
        <div className="card overflow-visible">
            <div
                className="overflow-x-auto"
                onWheel={e => {
                    if (e.deltaY !== 0) {
                        e.preventDefault();
                        e.currentTarget.scrollLeft += e.deltaY;
                    }
                }}>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
<th
                                className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-10">
                                <input
                                    type="checkbox"
                                    checked={selectedLeads.size === hotLeads.length && hotLeads.length > 0}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedLeads(new Set(hotLeads.map(lead => lead.Id)));
                                        } else {
                                            setSelectedLeads(new Set());
                                        }
                                    }}
                                    className="rounded border-gray-300" />
                            </th>
                            <th
                                className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-40">Product Name
                                                  </th>
                            <th
                                className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-40">Company Name
                                                  </th>
                            <th
                                className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-48">Website URL
                                                  </th>
                            <th
                                className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-32">Team Size
                                                  </th>
                            <th
                                className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-24">ARR ($M)
                                                  </th>
                            <th
                                className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-48">Category
                                                  </th>
                            <th
                                className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-48">LinkedIn URL
                                                  </th>
                            <th
                                className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-40">Status
                                                  </th>
                            <th
                                className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-32">Funding
                                                  </th>
                            <th
                                className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-40">Edition
                                                  </th>
                            <th
                                className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-32">Sales Rep
                                                  </th>
                            <th
                                className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-32">Follow-up
                                                  </th>
                            <th
                                className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-20">Actions
                                                  </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {/* New Lead Entry Row - Always at top */}
                        {/* Existing Hotlist Leads */}
                        {filteredLeads.map(
                            lead => <tr key={lead.Id} className="hover:bg-gray-50 transition-colors duration-200">
                                <td className="px-3 py-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedLeads.has(lead.Id)}
                                        onChange={e => {
                                            const newSelected = new Set(selectedLeads);

                                            if (e.target.checked) {
                                                newSelected.add(lead.Id);
                                            } else {
                                                newSelected.delete(lead.Id);
                                            }

                                            setSelectedLeads(newSelected);
                                        }}
                                        className="rounded border-gray-300" />
                                </td>
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
                                    <CellDisplay
                                        lead={lead}
                                        field="FollowUpReminder"
                                        value={lead.FollowUpReminder}
                                        type="date" />
                                </td>
<td className="px-3 py-2">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleEditLead(lead.Id)}
                                            className="text-primary hover:text-primary-700 transition-colors duration-200 p-1 hover:bg-primary-50 rounded"
                                            title="Edit lead">
                                            <ApperIcon name="Edit2" size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteLead(lead.Id)}
                                            className="text-error hover:text-red-700 transition-colors duration-200 p-1 hover:bg-red-50 rounded"
                                            title="Delete lead">
                                            <ApperIcon name="Trash2" size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {filteredLeads.length === 0 && hotLeads.length > 0 && <tr>
                            <td colSpan="14" className="px-6 py-8 text-center text-gray-500">
                                <ApperIcon name="Search" size={24} className="mx-auto mb-2" />
                                <div className="text-lg font-medium">No hotlist leads match your filters</div>
                                <div className="text-sm">Try adjusting your search terms or filters</div>
                            </td>
                        </tr>}
                        {hotLeads.length === 0 && <tr>
                            <td colSpan="14" className="px-6 py-8 text-center text-gray-500">
                                <ApperIcon name="Flame" size={24} className="mx-auto mb-2" />
                                <div className="text-lg font-medium">No hotlist leads at the moment</div>
                                <div className="text-sm">Great job! All your priority leads have been handled.</div>
                            </td>
                        </tr>}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
  )
}

export default Hotlist