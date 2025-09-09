import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { toast } from "react-toastify"
import Header from "@/components/organisms/Header"
import SearchFilter from "@/components/molecules/SearchFilter"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { leadService } from "@/services/api/leadService"

const Leads = () => {
  const { onMobileMenuClick } = useOutletContext()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const statusFilters = [
    { label: "All Leads", value: "all" },
    { label: "New", value: "new" },
    { label: "Contacted", value: "contacted" },
    { label: "Qualified", value: "qualified" },
    { label: "Hot", value: "hot" },
    { label: "Cold", value: "cold" }
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

  const handleAddLead = () => {
    toast.success("Add lead modal would open here!")
  }

  const handleEditLead = (leadId) => {
    toast.info(`Edit lead ${leadId} modal would open here!`)
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
    const matchesSearch = lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusVariant = (status) => {
    switch (status) {
      case "hot": return "error"
      case "warm": return "warning"
      case "qualified": return "success"
      case "contacted": return "info"
      case "new": return "primary"
      default: return "default"
    }
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
        title="Leads"
        subtitle={`${leads.length} total prospects in your pipeline`}
        onMobileMenuClick={onMobileMenuClick}
      >
        <Button
          variant="accent"
          icon="Plus"
          onClick={handleAddLead}
        >
          Add Lead
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
            placeholder="Search leads by name or email..."
          />
        </div>

        {/* Leads Table */}
        {filteredLeads.length === 0 ? (
          <Empty
            title="No leads found"
            description={searchTerm || statusFilter !== "all" 
              ? "Try adjusting your search terms or filters" 
              : "Start building your prospect database by adding your first lead"
            }
            icon="Users"
            action={searchTerm || statusFilter !== "all" ? null : handleAddLead}
            actionLabel="Add First Lead"
          />
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Lead
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Last Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.Id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-25 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-card mr-4">
                            <ApperIcon name="User" size={16} className="text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{lead.firstName} {lead.lastName}</div>
                            <div className="text-sm text-gray-500">Lead #{lead.Id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{lead.email}</div>
                        <div className="text-sm text-gray-500">{lead.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getStatusVariant(lead.status)} size="md">
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {lead.source}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(lead.lastContact).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditLead(lead.Id)}
                            className="text-primary hover:text-primary-700 transition-colors duration-200 p-1 hover:bg-primary-50 rounded"
                          >
                            <ApperIcon name="Edit2" size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteLead(lead.Id)}
                            className="text-error hover:text-red-700 transition-colors duration-200 p-1 hover:bg-red-50 rounded"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </button>
                          <button
                            onClick={() => toast.info(`Call ${lead.firstName} ${lead.lastName}`)}
                            className="text-success hover:text-green-700 transition-colors duration-200 p-1 hover:bg-green-50 rounded"
                          >
                            <ApperIcon name="Phone" size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {filteredLeads.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            {statusFilters.slice(1).map((filter) => {
              const count = leads.filter(lead => lead.status === filter.value).length
              return (
                <div key={filter.value} className="card p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-sm text-gray-600">{filter.label} Leads</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Leads