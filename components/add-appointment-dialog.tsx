"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { usePets } from "@/hooks/usePets"
import { useAppointments } from "@/hooks/useAppointments"
import type { Appointment } from "@/lib/types"

interface AddAppointmentDialogProps {
  trigger?: React.ReactNode
}

export function AddAppointmentDialog({ trigger }: AddAppointmentDialogProps) {
  const { user } = useAuth()
  const { pets } = usePets()
  const { createAppointment } = useAppointments()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    try {
      const selectedPet = pets.find((pet) => pet.id === formData.get("petId"))
      if (!selectedPet) {
        throw new Error("Mascota no encontrada")
      }

      const appointmentData: Omit<Appointment, "id" | "ownerId" | "createdAt" | "updatedAt"> = {
        petId: formData.get("petId") as string,
        petName: selectedPet.name,
        type: formData.get("type") as Appointment["type"],
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        date: formData.get("date") as string,
        time: formData.get("time") as string,
        veterinarian: formData.get("veterinarian") as string,
        status: "programada",
      }

      await createAppointment(appointmentData)
      setOpen(false)
      e.currentTarget.reset()
    } catch (error: any) {
      console.error("Error creating appointment:", error)
      setError("Error al crear la cita. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            Nueva Cita
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm border-purple-100">
        <DialogHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg -m-6 mb-6 p-6">
          <DialogTitle className="text-2xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            ✨ Programar Nueva Cita
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Agenda una cita veterinaria o recordatorio especial para tu peludito
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="petId" className="text-gray-700 font-medium">
              Mascota *
            </Label>
            <Select
              name="petId"
              required
              disabled={loading}
              className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar mascota" />
              </SelectTrigger>
              <SelectContent>
                {pets.map((pet) => (
                  <SelectItem key={pet.id} value={pet.id}>
                    {pet.name} ({pet.species})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-gray-700 font-medium">
              Tipo de cita *
            </Label>
            <Select
              name="type"
              required
              disabled={loading}
              className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="veterinario">Consulta Veterinaria</SelectItem>
                <SelectItem value="vacuna">Vacunación</SelectItem>
                <SelectItem value="peluqueria">Peluquería</SelectItem>
                <SelectItem value="peso">Control de Peso</SelectItem>
                <SelectItem value="medicacion">Medicación</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700 font-medium">
              Título *
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="ej: Vacuna anual, Revisión general"
              required
              disabled={loading}
              className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 font-medium">
              Descripción
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Detalles adicionales sobre la cita..."
              disabled={loading}
              rows={3}
              className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-gray-700 font-medium">
                Fecha *
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                required
                disabled={loading}
                min={new Date().toISOString().split("T")[0]}
                className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-gray-700 font-medium">
                Hora *
              </Label>
              <Input
                id="time"
                name="time"
                type="time"
                required
                disabled={loading}
                className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="veterinarian" className="text-gray-700 font-medium">
              Veterinario/Lugar *
            </Label>
            <Input
              id="veterinarian"
              name="veterinarian"
              placeholder="ej: Dr. García, Clínica San Martín"
              required
              disabled={loading}
              className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="border-gray-300 hover:bg-gray-50 text-gray-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Programando...
                </>
              ) : (
                "Programar Cita"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
