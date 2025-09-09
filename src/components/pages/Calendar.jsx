import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { toast } from "react-toastify"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns"
import Header from "@/components/organisms/Header"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { appointmentService } from "@/services/api/appointmentService"

const Calendar = () => {
  const { onMobileMenuClick } = useOutletContext()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState("month") // month, week, day

  const loadAppointments = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await appointmentService.getAll()
      setAppointments(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAppointments()
  }, [])

  const handleAddAppointment = () => {
    toast.success("Add appointment modal would open here!")
  }

  const handleAppointmentClick = (appointment) => {
    toast.info(`Appointment details: ${appointment.title}`)
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
    toast.info(`Selected ${format(date, "MMMM d, yyyy")}`)
  }

  const getAppointmentsForDate = (date) => {
    return appointments.filter(apt => 
      isSameDay(new Date(apt.startTime), date)
    )
  }

  const getAppointmentsByType = (type) => {
    return appointments.filter(apt => apt.type === type).length
  }

  const getUpcomingAppointments = () => {
    const today = new Date()
    return appointments
      .filter(apt => new Date(apt.startTime) >= today)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 5)
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const getEventTypeColor = (type) => {
    switch (type) {
      case "tour": return "primary"
      case "consultation": return "secondary"
      case "follow-up": return "warning"
      case "closing": return "success"
      default: return "info"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header
          title="Calendar"
          subtitle="Manage appointments and schedule club tours"
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
          title="Calendar"
          subtitle="Manage appointments and schedule club tours"
          onMobileMenuClick={onMobileMenuClick}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadAppointments} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Calendar"
        subtitle={`${appointments.length} appointments scheduled`}
        onMobileMenuClick={onMobileMenuClick}
      >
        <Button
          variant="accent"
          icon="Plus"
          onClick={handleAddAppointment}
        >
          Schedule Tour
        </Button>
      </Header>

      <div className="p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Calendar */}
          <div className="xl:col-span-3">
            <div className="card p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {format(currentDate, "MMMM yyyy")}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="ChevronLeft"
                      onClick={() => navigateMonth(-1)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="ChevronRight"
                      onClick={() => navigateMonth(1)}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant={view === "month" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setView("month")}
                  >
                    Month
                  </Button>
                  <Button
                    variant={view === "week" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setView("week")}
                  >
                    Week
                  </Button>
                </div>
              </div>

              {appointments.length === 0 ? (
                <Empty
                  title="No appointments scheduled"
                  description="Start building your schedule by adding your first appointment"
                  icon="Calendar"
                  action={handleAddAppointment}
                  actionLabel="Schedule First Tour"
                />
              ) : (
                <>
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map(date => {
                      const dayAppointments = getAppointmentsForDate(date)
                      const isCurrentMonth = isSameMonth(date, currentDate)
                      const isSelected = isSameDay(date, selectedDate)
                      const isCurrentDay = isToday(date)

                      return (
                        <div
                          key={date.toString()}
                          onClick={() => handleDateClick(date)}
                          className={`
                            min-h-[120px] p-2 border border-gray-200 cursor-pointer transition-all duration-200 hover:bg-gray-50
                            ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : "bg-white"}
                            ${isSelected ? "ring-2 ring-primary bg-primary-50" : ""}
                            ${isCurrentDay ? "bg-accent-50 border-accent-300" : ""}
                          `}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-medium ${isCurrentDay ? "text-accent-800" : ""}`}>
                              {format(date, "d")}
                            </span>
                            {dayAppointments.length > 0 && (
                              <Badge variant="primary" size="sm">
                                {dayAppointments.length}
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-1">
                            {dayAppointments.slice(0, 2).map(apt => (
                              <div
                                key={apt.Id}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleAppointmentClick(apt)
                                }}
                                className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 ${
                                  apt.type === "tour" ? "bg-primary-100 text-primary-800" :
                                  apt.type === "consultation" ? "bg-secondary-100 text-secondary-800" :
                                  apt.type === "follow-up" ? "bg-warning-100 text-warning-800" :
                                  apt.type === "closing" ? "bg-success-100 text-success-800" :
                                  "bg-info-100 text-info-800"
                                }`}
                              >
                                {format(new Date(apt.startTime), "HH:mm")} {apt.title}
                              </div>
                            ))}
                            {dayAppointments.length > 2 && (
                              <div className="text-xs text-gray-500 text-center">
                                +{dayAppointments.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Appointments */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Clock" size={20} className="mr-2" />
                Upcoming
              </h3>

              {getUpcomingAppointments().length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No upcoming appointments
                </p>
              ) : (
                <div className="space-y-3">
                  {getUpcomingAppointments().map(apt => (
                    <div
                      key={apt.Id}
                      onClick={() => handleAppointmentClick(apt)}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm truncate">
                          {apt.title}
                        </h4>
                        <Badge variant={getEventTypeColor(apt.type)} size="sm">
                          {apt.type}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        <div className="flex items-center mb-1">
                          <ApperIcon name="Calendar" size={12} className="mr-1" />
                          {format(new Date(apt.startTime), "MMM d")}
                        </div>
                        <div className="flex items-center">
                          <ApperIcon name="Clock" size={12} className="mr-1" />
                          {format(new Date(apt.startTime), "HH:mm")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Appointment Types Summary */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="PieChart" size={20} className="mr-2" />
                This Month
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">Club Tours</span>
                  </div>
                  <span className="font-medium">{getAppointmentsByType("tour")}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-secondary rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">Consultations</span>
                  </div>
                  <span className="font-medium">{getAppointmentsByType("consultation")}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-warning rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">Follow-ups</span>
                  </div>
                  <span className="font-medium">{getAppointmentsByType("follow-up")}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-success rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">Closings</span>
                  </div>
                  <span className="font-medium">{getAppointmentsByType("closing")}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Zap" size={20} className="mr-2" />
                Quick Actions
              </h3>

              <div className="space-y-2">
                <Button
                  variant="primary"
                  size="sm"
                  icon="Calendar"
                  className="w-full justify-start"
                  onClick={handleAddAppointment}
                >
                  Schedule Tour
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon="Phone"
                  className="w-full justify-start"
                  onClick={() => toast.info("Follow-up call scheduler would open")}
                >
                  Schedule Call
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon="Users"
                  className="w-full justify-start"
                  onClick={() => toast.info("Group event scheduler would open")}
                >
                  Group Event
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar