import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { leadService } from "@/services/api/leadService";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Header from "@/components/organisms/Header";
import Leads from "@/components/pages/Leads";

const Hotlist = () => {
  const { onMobileMenuClick } = useOutletContext()
  const [hotLeads, setHotLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadHotLeads = async () => {
    try {
      setLoading(true)
      setError(null)
const allLeads = await leadService.getAll()
const filtered = allLeads.filter(lead => 
        lead.Status === "Hotlist"
      )
      setHotLeads(filtered)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHotLeads()
  }, [])

const handleCallLead = (lead) => {
    toast.success(`Calling ${lead.firstName} ${lead.lastName} at ${lead.phone}`)
  }

  const handleEmailLead = (lead) => {
    toast.info(`Opening email to ${lead.email}`)
  }

  const handleScheduleTour = (lead) => {
    toast.success(`Scheduling club tour for ${lead.firstName} ${lead.lastName}`)
  }

  const handleAddNote = (lead) => {
    toast.info(`Add note for ${lead.firstName} ${lead.lastName}`)
  }

  const handleEditLead = (lead) => {
    toast.info(`Edit lead functionality for ${lead.firstName} ${lead.lastName}`)
    // TODO: Navigate to edit form when available
  }

  const handleDeleteLead = async (lead) => {
    if (confirm(`Are you sure you want to delete ${lead.firstName} ${lead.lastName}? This action cannot be undone.`)) {
      try {
        await leadService.delete(lead.Id)
        toast.success(`${lead.firstName} ${lead.lastName} has been deleted successfully`)
        loadHotLeads() // Reload the list
      } catch (error) {
        toast.error(`Failed to delete lead: ${error.message}`)
      }
    }
  }

  const getPriorityIcon = (lead) => {
if (lead.Status === "Hotlist") return "Star"
    return "Star"
  }
const getPriorityColor = (lead) => {
    if (lead.Status === "Hotlist") return "warning"
    return "warning"
  }

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "hotlist":
        return "error"
      case "qualified":
        return "success"
      case "contacted":
        return "warning"
      case "new":
        return "info"
      default:
        return "neutral"
    }
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
          <Loading type="cards" />
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
        title="Hotlist"
subtitle={`${hotLeads.length} hotlist prospects need your attention`}
        onMobileMenuClick={onMobileMenuClick}
      >
        <Button
          variant="accent"
          icon="Flame"
        >
          Priority Actions
        </Button>
      </Header>

      <div className="p-6">
        {hotLeads.length === 0 ? (
          <Empty
            title="No hot leads at the moment"
            description="Great job! All your priority leads have been handled. Keep up the excellent work!"
            icon="Flame"
actionLabel="View All Leads"
          />
        ) : (
          <>
            {/* Priority Alert Banner */}
            <div className="bg-gradient-to-r from-error-50 to-red-100 border border-error-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center mr-3">
                  <ApperIcon name="AlertTriangle" size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-error-800">Urgent Action Required</h3>
                  <p className="text-error-700 text-sm">
                    You have {hotLeads.length} high-priority leads that need immediate follow-up to maximize conversion.
                  </p>
                </div>
              </div>
            </div>

            {/* Hotlist Leads List View */}
            <div className="card overflow-hidden">
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Contact</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {hotLeads.map((lead) => (
                        <tr key={lead.Id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-card mr-4">
                                <ApperIcon name="User" size={16} className="text-white" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {lead.firstName} {lead.lastName}
                                </div>
                                <div className="text-sm text-gray-500">Lead #{lead.Id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{lead.email}</div>
                            <div className="text-sm text-gray-500">{lead.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={getStatusVariant(lead.Status)} size="sm">
                              {lead.Status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {lead.source}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(lead.lastContact).toLocaleDateString()}
                          </td>
<td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="xs"
                                icon="Edit"
                                onClick={() => handleEditLead(lead)}
                                className="!p-2"
                              />
                              <Button
                                variant="outline"
                                size="xs"
                                icon="Trash2"
                                onClick={() => handleDeleteLead(lead)}
                                className="!p-2 text-error-600 hover:bg-error-50"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4 p-4">
                {hotLeads.map((lead) => (
                  <div key={lead.Id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-card transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-card mr-3">
                          <ApperIcon name="User" size={16} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {lead.firstName} {lead.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">Lead #{lead.Id}</p>
                        </div>
                      </div>
                      <Badge variant={getStatusVariant(lead.Status)} size="sm">
                        {lead.Status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <ApperIcon name="Mail" size={14} className="mr-2" />
                        {lead.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <ApperIcon name="Phone" size={14} className="mr-2" />
                        {lead.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <ApperIcon name="MapPin" size={14} className="mr-2" />
                        Source: {lead.source}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <ApperIcon name="Clock" size={14} className="mr-2" />
                        Last contact: {new Date(lead.lastContact).toLocaleDateString()}
                      </div>
                    </div>

                    {lead.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-700 italic">"{lead.notes}"</p>
                      </div>
                    )}

<div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon="Edit"
                        onClick={() => handleEditLead(lead)}
                        className="w-full"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        icon="Trash2"
                        onClick={() => handleDeleteLead(lead)}
                        className="w-full text-error-600 hover:bg-error-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-card">
                  <ApperIcon name="Flame" size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {hotLeads.filter(lead => lead.Status === "Hotlist").length}
                </div>
                <div className="text-sm text-gray-600">Hotlist Leads</div>
              </div>

              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-success to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-card">
<ApperIcon name="CheckCircle" size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {hotLeads.filter(lead => lead.Status === "qualified").length}
                </div>
                <div className="text-sm text-gray-600">Qualified Leads</div>
              </div>

              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-card">
                  <ApperIcon name="Clock" size={24} className="text-gray-900" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(hotLeads.reduce((acc, lead) => {
                    const daysSinceContact = Math.floor((Date.now() - new Date(lead.lastContact).getTime()) / (1000 * 60 * 60 * 24))
                    return acc + daysSinceContact
                  }, 0) / hotLeads.length) || 0}
                </div>
                <div className="text-sm text-gray-600">Avg Days Since Contact</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Hotlist