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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Loader2 } from "lucide-react"
import { usePets } from "@/hooks/usePets"
import { uploadPetImage } from "@/lib/storage"
import { useAuth } from "@/hooks/useAuth"
import type { Pet } from "@/lib/types"

interface AddPetDialogProps {
  trigger?: React.ReactNode
}

export function AddPetDialog({ trigger }: AddPetDialogProps) {
  const { user } = useAuth()
  const { createPet } = usePets()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement // <-- NUEVO
    if (!user) return

    setLoading(true)
    setError("")

    const formData = new FormData(form) // <-- CAMBIO

    try {
      const petData: Omit<Pet, "id" | "ownerId" | "createdAt" | "updatedAt"> = {
        name: formData.get("name") as string,
        species: formData.get("species") as Pet["species"],
        breed: formData.get("breed") as string,
        age: Number(formData.get("age")),
        gender: formData.get("gender") as Pet["gender"],
        weight: formData.get("weight") as string,
        microchip: (formData.get("microchip") as string) || undefined,
        healthStatus: formData.get("healthStatus") as Pet["healthStatus"],
      }

      // Create pet first
      const petId = await createPet(petData)

      // Upload image if provided
      if (imageFile && petId) {
        try {
          const imageUrl = await uploadPetImage(user.uid, petId, imageFile)
          // Update pet with image URL
          await import("@/lib/firestore").then(({ updatePet }) => updatePet(petId, { image: imageUrl }))
        } catch (imageError) {
          console.error("Error uploading image:", imageError)
          // Pet was created successfully, just image upload failed
        }
      }

      setOpen(false)
      form.reset() // <-- CAMBIO
      setImageFile(null)
      setImagePreview(null)
    } catch (error: any) {
      console.error("Error adding pet:", error)
      setError("Error al agregar la mascota. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Mascota
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm border-orange-100">
        <DialogHeader className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-t-lg -m-6 mb-6 p-6">
          <DialogTitle className="text-2xl bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            ¡Agregar Nuevo Peludito! 🐾
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Completa la información de tu mascota para agregarla a tu familia digital
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-gray-700 font-medium">
              Foto de la mascota (opcional)
            </Label>
            <div className="flex items-center space-x-4">
              {imagePreview && (
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                  className="cursor-pointer border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Nombre *
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Nombre de la mascota"
                required
                disabled={loading}
                className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="species" className="text-gray-700 font-medium">
                Especie *
              </Label>
              <Select
                name="species"
                required
                disabled={loading}
                className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="perro">Perro</SelectItem>
                  <SelectItem value="gato">Gato</SelectItem>
                  <SelectItem value="ave">Ave</SelectItem>
                  <SelectItem value="pez">Pez</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="breed" className="text-gray-700 font-medium">
                Raza *
              </Label>
              <Input
                id="breed"
                name="breed"
                placeholder="Raza"
                required
                disabled={loading}
                className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age" className="text-gray-700 font-medium">
                Edad *
              </Label>
              <Input
                id="age"
                name="age"
                type="number"
                placeholder="Años"
                min="0"
                max="30"
                required
                disabled={loading}
                className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-gray-700 font-medium">
                Género *
              </Label>
              <Select
                name="gender"
                required
                disabled={loading}
                className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="macho">Macho</SelectItem>
                  <SelectItem value="hembra">Hembra</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-gray-700 font-medium">
                Peso *
              </Label>
              <Input
                id="weight"
                name="weight"
                placeholder="ej: 5.2 kg"
                required
                disabled={loading}
                className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="microchip" className="text-gray-700 font-medium">
              Microchip (opcional)
            </Label>
            <Input
              id="microchip"
              name="microchip"
              placeholder="Número de microchip"
              disabled={loading}
              className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="healthStatus" className="text-gray-700 font-medium">
              Estado de Salud *
            </Label>
            <Select
              name="healthStatus"
              required
              disabled={loading}
              className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excelente">Excelente</SelectItem>
                <SelectItem value="bueno">Bueno</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="preocupante">Preocupante</SelectItem>
              </SelectContent>
            </Select>
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
              className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Agregando...
                </>
              ) : (
                "Agregar Mascota"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
