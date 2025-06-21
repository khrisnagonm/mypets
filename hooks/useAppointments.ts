// hooks/useAppointments.ts

"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./useAuth"
import { subscribeToUserAppointments, addAppointment, updateAppointment, deleteAppointment } from "@/lib/firestore"
import type { Appointment } from "@/lib/types"

export const useAppointments = () => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !user.uid) { // Asegúrate de verificar user.uid aquí también
      console.log("DEBUG: No user.uid, saltando suscripción.");
      setAppointments([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const unsubscribe = subscribeToUserAppointments(user.uid, (updatedAppointments) => {
      console.log("DEBUG: Citas recibidas de Firestore:", updatedAppointments);
      // Ordena las citas aquí si es necesario, o confía en el orderBy de Firestore.
      // Si quieres que las próximas salgan primero y luego las pasadas, necesitarías una lógica de ordenamiento más compleja aquí.
      setAppointments(updatedAppointments)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const createAppointment = async (appointmentData: Omit<Appointment, "id" | "ownerId" | "createdAt" | "updatedAt">) => {
    if (!user) throw new Error("User not authenticated")

    try {
      const appointmentId = await addAppointment(user.uid, appointmentData)
      return appointmentId
    } catch (error) {
      console.error("Error creating appointment:", error)
      throw error
    }
  }

  const editAppointment = async (appointmentId: string, appointmentData: Partial<Appointment>) => {
    try {
      await updateAppointment(appointmentId, appointmentData)
    } catch (error) {
      console.error("Error updating appointment:", error)
      throw error
    }
  }

  const removeAppointment = async (appointmentId: string) => {
    try {
      await deleteAppointment(appointmentId)
    } catch (error) {
      console.error("Error deleting appointment:", error)
      throw error
    }
  }

  // --- CAMBIO AQUÍ ---
  // Opción 1: Simplemente devuelve todas las citas ordenadas por fecha/hora
  const getAllRemindersSorted = () => {
    // Si orderBy("date", "asc") en Firestore es suficiente, puedes devolver appointments directamente.
    // Si necesitas un orden más específico (ej. próximas primero, luego pasadas ordenadas),
    // la lógica sería más compleja aquí. Para empezar, solo devolverlas ordenadas por BD.
    return [...appointments].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  };

  // Puedes mantener getTodayAppointments si lo necesitas
  const getTodayAppointments = () => {
    const today = new Date().toISOString().split("T")[0]
    return appointments.filter((apt) => apt.date === today)
  }

  // Opción 2: Si aún quieres un filtro para "upcoming" pero también tener "all"
  const getOnlyUpcomingAppointments = (limit = 5) => {
    const today = new Date();
    return appointments.filter((apt) => new Date(`${apt.date}T${apt.time}`) > today)
                       .sort((a,b) => { // Asegurarse de que estén ordenadas las próximas
                           const dateA = new Date(`${a.date}T${a.time}`);
                           const dateB = new Date(`${b.date}T${b.time}`);
                           return dateA.getTime() - dateB.getTime();
                       })
                       .slice(0, limit);
  }
  // --- FIN CAMBIO ---

  return {
    appointments, // Retorna el array completo de citas directamente
    loading,
    error,
    createAppointment,
    editAppointment,
    removeAppointment,
    getTodayAppointments, // Si aún lo usas
    getAllRemindersSorted, // Nueva función para todas las citas (recomendado)
    getOnlyUpcomingAppointments, // Si quieres mantener el filtro de "upcoming" aparte
  }
}