import appointmentsData from "@/services/mockData/appointments.json"

let appointments = [...appointmentsData]

export const appointmentService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 350))
    return [...appointments]
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const appointment = appointments.find(a => a.Id === parseInt(id))
    if (!appointment) {
      throw new Error("Appointment not found")
    }
    return { ...appointment }
  },

  create: async (appointmentData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const maxId = Math.max(...appointments.map(a => a.Id), 0)
    const newAppointment = {
      ...appointmentData,
      Id: maxId + 1
    }
    appointments.push(newAppointment)
    return { ...newAppointment }
  },

  update: async (id, appointmentData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = appointments.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Appointment not found")
    }
    appointments[index] = { ...appointments[index], ...appointmentData }
    return { ...appointments[index] }
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = appointments.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Appointment not found")
    }
    appointments.splice(index, 1)
    return true
  }
}