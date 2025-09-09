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
import { dealService } from "@/services/api/dealService"

const pipelineStages = [
  { id: "prospect", name: "Prospect", color: "info" },
  { id: "qualified", name: "Qualified", color: "primary" },
  { id: "proposal", name: "Proposal", color: "warning" },
  { id: "negotiation", name: "Negotiation", color: "secondary" },
  { id: "closed", name: "Closed Won", color: "success" }
]

const DealPipeline = () => {
  const { onMobileMenuClick } = useOutletContext()
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [draggedDeal, setDraggedDeal] = useState(null)

  const loadDeals = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await dealService.getAll()
      setDeals(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDeals()
  }, [])

  const handleAddDeal = () => {
    toast.success("Add deal modal would open here!")
  }

  const handleDealClick = (deal) => {
    toast.info(`Deal details for ${deal.title} would open here!`)
  }

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e, newStage) => {
    e.preventDefault()
    
    if (!draggedDeal || draggedDeal.stage === newStage) {
      setDraggedDeal(null)
      return
    }

    try {
      const updatedDeal = { ...draggedDeal, stage: newStage }
      await dealService.update(draggedDeal.Id, updatedDeal)
      
      setDeals(deals.map(deal => 
        deal.Id === draggedDeal.Id 
          ? { ...deal, stage: newStage }
          : deal
      ))
      
      toast.success(`${draggedDeal.title} moved to ${newStage}`)
    } catch (err) {
      toast.error("Failed to update deal stage")
    } finally {
      setDraggedDeal(null)
    }
  }

  const getDealsForStage = (stageId) => {
    return deals.filter(deal => deal.stage === stageId)
  }

  const getTotalValue = (stageId) => {
    return getDealsForStage(stageId).reduce((sum, deal) => sum + deal.value, 0)
  }

  const getTotalPipelineValue = () => {
    return deals.reduce((sum, deal) => sum + deal.value, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header
          title="Deal Pipeline"
          subtitle="Track your sales opportunities through each stage"
          onMobileMenuClick={onMobileMenuClick}
        />
        <div className="p-6">
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header
          title="Deal Pipeline"
          subtitle="Track your sales opportunities through each stage"
          onMobileMenuClick={onMobileMenuClick}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadDeals} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Deal Pipeline"
        subtitle={`${deals.length} active deals worth $${getTotalPipelineValue().toLocaleString()}`}
        onMobileMenuClick={onMobileMenuClick}
      >
        <Button
          variant="accent"
          icon="Plus"
          onClick={handleAddDeal}
        >
          Add Deal
        </Button>
      </Header>

      <div className="p-6">
        {deals.length === 0 ? (
          <Empty
            title="No deals in pipeline"
            description="Start tracking your sales opportunities by adding your first deal"
            icon="GitBranch"
            action={handleAddDeal}
            actionLabel="Add First Deal"
          />
        ) : (
          <>
            {/* Pipeline Summary */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              {pipelineStages.map((stage) => {
                const stageDeals = getDealsForStage(stage.id)
                const stageValue = getTotalValue(stage.id)
                return (
                  <div key={stage.id} className="card p-4 text-center">
                    <div className="text-lg font-bold text-gray-900">{stageDeals.length}</div>
                    <div className="text-sm text-gray-600 mb-2">{stage.name}</div>
                    <div className="text-sm font-medium text-primary">
                      ${stageValue.toLocaleString()}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pipeline Board */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 overflow-x-auto">
              {pipelineStages.map((stage) => {
                const stageDeals = getDealsForStage(stage.id)
                return (
                  <div
                    key={stage.id}
                    className="flex-shrink-0 w-full lg:w-auto"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, stage.id)}
                  >
                    {/* Stage Header */}
                    <div className="card p-4 mb-4 bg-gradient-to-r from-gray-50 to-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900">{stage.name}</h3>
                          <p className="text-sm text-gray-600">
                            {stageDeals.length} deals • ${getTotalValue(stage.id).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant={stage.color} size="sm">
                          {stageDeals.length}
                        </Badge>
                      </div>
                    </div>

                    {/* Deal Cards */}
                    <div className="space-y-3 min-h-[400px]">
                      {stageDeals.length === 0 ? (
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                          <ApperIcon name="Plus" size={24} className="text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Drop deals here</p>
                        </div>
                      ) : (
                        stageDeals.map((deal) => (
                          <div
                            key={deal.Id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, deal)}
                            onClick={() => handleDealClick(deal)}
                            className="card p-4 cursor-move hover:shadow-elevation transition-all duration-200 hover:-translate-y-1"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900 truncate flex-1">
                                {deal.title}
                              </h4>
                              <ApperIcon name="GripVertical" size={16} className="text-gray-400" />
                            </div>
                            
                            <div className="space-y-2">
                              <div className="text-lg font-bold text-primary">
                                ${deal.value.toLocaleString()}
                              </div>
                              
                              <div className="flex items-center text-sm text-gray-600">
                                <ApperIcon name="User" size={14} className="mr-1" />
                                {deal.assignedTo}
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="text-xs text-gray-500">
                                  {deal.probability}% probability
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(deal.expectedCloseDate).toLocaleDateString()}
                                </div>
                              </div>
                              
                              {/* Progress Bar */}
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${deal.probability}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pipeline Analytics */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mr-4 shadow-card">
                    <ApperIcon name="DollarSign" size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${getTotalPipelineValue().toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Pipeline Value</div>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-success to-green-600 rounded-full flex items-center justify-center mr-4 shadow-card">
                    <ApperIcon name="TrendingUp" size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {Math.round(deals.reduce((sum, deal) => sum + deal.probability, 0) / deals.length) || 0}%
                    </div>
                    <div className="text-sm text-gray-600">Average Win Probability</div>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-amber-500 rounded-full flex items-center justify-center mr-4 shadow-card">
                    <ApperIcon name="Calendar" size={24} className="text-gray-900" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {deals.filter(deal => {
                        const daysToClose = Math.ceil((new Date(deal.expectedCloseDate) - new Date()) / (1000 * 60 * 60 * 24))
                        return daysToClose <= 30 && daysToClose >= 0
                      }).length}
                    </div>
                    <div className="text-sm text-gray-600">Closing This Month</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DealPipeline