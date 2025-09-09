import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { toast } from "react-toastify"
import Header from "@/components/organisms/Header"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { leadService } from "@/services/api/leadService"

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
        lead.status === "Hotlist"
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

  const getPriorityIcon = (lead) => {
if (lead.status === "Hotlist") return "Star"
    return "Star"
  }
  
  const getPriorityColor = (lead) => {
    if (lead.status === "Hotlist") return "warning"
    return "warning"
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

            {/* Hot Leads Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {hotLeads.map((lead) => (
                <div key={lead.Id} className="card p-6 hover:shadow-elevation transition-all duration-200 relative overflow-hidden">
                  {/* Priority Indicator */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-error-100 to-transparent rounded-xl opacity-50"></div>
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant={getPriorityColor(lead)} size="md" className="flex items-center">
                        <ApperIcon name={getPriorityIcon(lead)} size={12} className="mr-1" />
                        {lead.status.toUpperCase()}
                      </Badge>
                      <div className="text-xs text-gray-500">
                        Lead #{lead.Id}
                      </div>
                    </div>

                    {/* Lead Info */}
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-card mr-4">
                        <ApperIcon name="User" size={20} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">
                          {lead.firstName} {lead.lastName}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">{lead.email}</p>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-2 mb-6">
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

                    {/* Notes */}
                    {lead.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-700 italic">"{lead.notes}"</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        icon="Phone"
                        onClick={() => handleCallLead(lead)}
                        className="w-full"
                      >
                        Call
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon="Mail"
                        onClick={() => handleEmailLead(lead)}
                        className="w-full"
                      >
                        Email
                      </Button>
                      <Button
                        variant="accent"
                        size="sm"
                        icon="Calendar"
                        onClick={() => handleScheduleTour(lead)}
                        className="w-full"
                      >
                        Tour
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        icon="FileText"
                        onClick={() => handleAddNote(lead)}
                        className="w-full"
                      >
                        Note
                      </Button>
                    </div>
                  </div>

                  {/* Urgency Indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-error via-warning to-success opacity-75"></div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-card">
                  <ApperIcon name="Flame" size={24} className="text-white" />
                </div>
<div className="text-2xl font-bold text-gray-900">
                  {hotLeads.filter(lead => lead.status === "Hotlist").length}
                </div>
                <div className="text-sm text-gray-600">Hotlist Leads</div>
              </div>

              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-success to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-card">
                  <ApperIcon name="CheckCircle" size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {hotLeads.filter(lead => lead.status === "qualified").length}
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