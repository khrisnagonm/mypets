"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Edit, Loader2 } from "lucide-react"
import { usePets } from "@/hooks/usePets"
import { uploadPetImage } from "@/lib/storage"
import { useAuth } from "@/hooks/useAuth"
import type { Pet } from "@/lib/types"

interface EditPetDialogProps {
  pet: Pet
  trigger?: React.ReactNode
}

export function EditPetDialog({ pet, trigger }: EditPetDialogProps) {
  const { user } = useAuth()
  const { editPet } = usePets()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(pet.image || null)

  // Form state
  const [formData, setFormData] = useState({
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    age: pet.age,
    gender: pet.gender,
    weight: pet.weight,
    microchip: pet.microchip || "",
    healthStatus: pet.healthStatus,
  })

  useEffect(() => {
    if (open) {
      setFormData({
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        gender: pet.gender,
        weight: pet.weight,
        microchip: pet.microchip || "",
        healthStatus: pet.healthStatus,
      })
      setImagePreview(pet.image || null)
      setImageFile(null)
      setError("")
    }
  }, [open, pet])

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
    if (!user) return

    setLoading(true)
    setError("")

    try {
      const updateData: Partial<Pet> = {
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        age: formData.age,
        gender: formData.gender,
        weight: formData.weight,
        microchip: formData.microchip || "",
        healthStatus: formData.healthStatus,
      }

      // Upload new image if provided
      if (imageFile) {
        try {
          const imageUrl = await uploadPetImage(user.uid, pet.id, imageFile)
          updateData.image = imageUrl
        } catch (imageError) {
          console.error("Error uploading image:", imageError)
          setError("Error al subir la imagen, pero los demás datos se guardarán.")
        }
      }

      await editPet(pet.id, updateData)
      setOpen(false)
    } catch (error: any) {
      console.error("Error updating pet:", error)
      setError("Error al actualizar la mascota. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm border-orange-100">
        <DialogHeader className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-t-lg -m-6 mb-6 p-6">
          <DialogTitle className="text-2xl bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            Editar a {pet.name} 🐾
          </DialogTitle>
          <DialogDescription className="text-gray-600">Actualiza la información de tu mascota</DialogDescription>
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
              Foto de la mascota
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                value={formData.species}
                onValueChange={(value) => setFormData({ ...formData, species: value as Pet["species"] })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
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
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
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
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
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
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value as Pet["gender"] })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
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
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
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
              value={formData.microchip}
              onChange={(e) => setFormData({ ...formData, microchip: e.target.value })}
              disabled={loading}
              className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="healthStatus" className="text-gray-700 font-medium">
              Estado de Salud *
            </Label>
            <Select
              value={formData.healthStatus}
              onValueChange={(value) => setFormData({ ...formData, healthStatus: value as Pet["healthStatus"] })}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
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
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
