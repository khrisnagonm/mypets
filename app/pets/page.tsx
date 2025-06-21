"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Heart,
  Search,
  Plus,
  Dog,
  Cat,
  Bird,
  Fish,
  Calendar,
  Edit,
  MoreVertical,
  LogOut,
  User,
  Loader2,
  Sparkles,
  Camera,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { usePets } from "@/hooks/usePets"
import { logoutUser } from "@/lib/auth"
import { AddPetDialog } from "@/components/add-pet-dialog"
import { EditPetDialog } from "@/components/edit-pet-dialog"
import { AddAppointmentDialog } from "@/components/add-appointment-dialog"

export default function PetsPage() {
  const { user, userProfile, loading: authLoading, isAuthenticated } = useAuth()
  const { pets, loading: petsLoading } = usePets()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecies, setSelectedSpecies] = useState("all")
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [authLoading, isAuthenticated, router])

  const getSpeciesIcon = (species: string) => {
    switch (species.toLowerCase()) {
      case "perro":
        return <Dog className="h-5 w-5" />
      case "gato":
        return <Cat className="h-5 w-5" />
      case "ave":
        return <Bird className="h-5 w-5" />
      case "pez":
        return <Fish className="h-5 w-5" />
      default:
        return <Heart className="h-5 w-5" />
    }
  }

  const getHealthStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "excelente":
        return "bg-green-100 text-green-800 border-green-200"
      case "bueno":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "regular":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "preocupante":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logoutUser()
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Dog className="h-12 w-12 mx-auto mb-4 text-orange-500 animate-bounce" />
            <Sparkles className="h-6 w-6 absolute -top-2 -right-2 text-pink-400 animate-pulse" />
          </div>
          <p className="text-gray-600">Cargando a tus peluditos...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecies = selectedSpecies === "all" || pet.species.toLowerCase() === selectedSpecies
    return matchesSearch && matchesSpecies
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-orange-400 to-pink-500 p-2 rounded-xl shadow-lg">
                <Dog className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  My Pets
                </h1>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-orange-500 transition-colors">
                Mi Hogar
              </Link>
              <Link href="/pets" className="text-orange-500 font-medium flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>Mis Peluditos</span>
              </Link>
              <Link href="/calendar" className="text-gray-600 hover:text-orange-500 transition-colors">
                Calendario
              </Link>
              <Link href="/care" className="text-gray-600 hover:text-orange-500 transition-colors">
                Cuidados
              </Link>
              <Link href="/reminders" className="text-gray-600 hover:text-orange-500 transition-colors">
                Recordatorios
              </Link>
              <Link href="/services" className="text-gray-600 hover:text-orange-500 transition-colors">
                Servicios
              </Link>
              <Link href="/map" className="text-gray-600 hover:text-orange-500 transition-colors">
                Explorar
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Link href="/profile">
                <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-50">
                  <User className="h-4 w-4 mr-2" />
                  Perfil
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="border-pink-200 hover:bg-pink-50"
              >
                {isLoggingOut ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <LogOut className="h-4 w-4 mr-2" />}
                Salir
              </Button>
              <AddPetDialog
                trigger={
                  <Button className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white shadow-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Peludito
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Mis Compañeros de Vida 🐾</h2>
          <p className="text-lg text-gray-600">Cada uno con su propia personalidad y amor único</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8 shadow-lg border-orange-100">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por nombre o raza..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={selectedSpecies === "all" ? "default" : "outline"}
                  onClick={() => setSelectedSpecies("all")}
                  size="sm"
                  className={
                    selectedSpecies === "all"
                      ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
                      : "border-orange-200 hover:bg-orange-50"
                  }
                >
                  Todos mis bebés
                </Button>
                <Button
                  variant={selectedSpecies === "perro" ? "default" : "outline"}
                  onClick={() => setSelectedSpecies("perro")}
                  size="sm"
                  className={
                    selectedSpecies === "perro"
                      ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
                      : "border-orange-200 hover:bg-orange-50"
                  }
                >
                  <Dog className="h-4 w-4 mr-1" />
                  Perritos
                </Button>
                <Button
                  variant={selectedSpecies === "gato" ? "default" : "outline"}
                  onClick={() => setSelectedSpecies("gato")}
                  size="sm"
                  className={
                    selectedSpecies === "gato"
                      ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
                      : "border-orange-200 hover:bg-orange-50"
                  }
                >
                  <Cat className="h-4 w-4 mr-1" />
                  Gatitos
                </Button>
                <Button
                  variant={selectedSpecies === "ave" ? "default" : "outline"}
                  onClick={() => setSelectedSpecies("ave")}
                  size="sm"
                  className={
                    selectedSpecies === "ave"
                      ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
                      : "border-orange-200 hover:bg-orange-50"
                  }
                >
                  <Bird className="h-4 w-4 mr-1" />
                  Pajaritos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {petsLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-8" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pets Grid */}
        {!petsLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet) => (
              <Card
                key={pet.id}
                className="hover:shadow-xl transition-all duration-300 cursor-pointer border-orange-100 hover:border-orange-200 bg-gradient-to-br from-white to-orange-50/30"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                          <AvatarImage src={pet.image || "/placeholder.svg"} alt={pet.name} />
                          <AvatarFallback className="bg-gradient-to-br from-orange-200 to-pink-200 text-orange-700 text-lg font-bold">
                            {pet.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                          {getSpeciesIcon(pet.species)}
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-800">{pet.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            variant="secondary"
                            className="capitalize bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 border-orange-200"
                          >
                            {pet.species}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="hover:bg-orange-100">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/60 p-3 rounded-lg">
                      <p className="text-gray-500 text-xs">Raza</p>
                      <p className="font-medium text-gray-800">{pet.breed}</p>
                    </div>
                    <div className="bg-white/60 p-3 rounded-lg">
                      <p className="text-gray-500 text-xs">Edad</p>
                      <p className="font-medium text-gray-800">
                        {pet.age} {pet.age === 1 ? "añito" : "años"}
                      </p>
                    </div>
                    <div className="bg-white/60 p-3 rounded-lg">
                      <p className="text-gray-500 text-xs">Género</p>
                      <p className="font-medium text-gray-800 capitalize">{pet.gender}</p>
                    </div>
                    <div className="bg-white/60 p-3 rounded-lg">
                      <p className="text-gray-500 text-xs">Peso</p>
                      <p className="font-medium text-gray-800">{pet.weight}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Estado de salud</span>
                      <Badge className={getHealthStatusColor(pet.healthStatus)} variant="secondary">
                        {pet.healthStatus === "excelente"
                          ? "💚 Excelente"
                          : pet.healthStatus === "bueno"
                            ? "💙 Bueno"
                            : pet.healthStatus === "regular"
                              ? "💛 Regular"
                              : "❤️ Necesita cuidados"}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">En la familia desde</span>
                      <span className="text-sm font-medium text-gray-700">
                        {pet.createdAt.toLocaleDateString("es-ES")}
                      </span>
                    </div>
                  </div>

                  {pet.microchip && (
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                      <p className="text-xs text-blue-600 mb-1 font-medium">🔍 Microchip</p>
                      <p className="text-sm font-mono text-blue-800">{pet.microchip}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <EditPetDialog
                      pet={pet}
                      trigger={
                        <Button size="sm" variant="outline" className="flex-1 border-orange-200 hover:bg-orange-50">
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      }
                    />
                    <AddAppointmentDialog
                      trigger={
                        <Button size="sm" variant="outline" className="border-green-200 hover:bg-green-50">
                          <Calendar className="h-4 w-4 mr-1" />
                          Citas
                        </Button>
                      }
                    />
                    <Button size="sm" variant="outline" className="border-purple-200 hover:bg-purple-50">
                      <Camera className="h-4 w-4 mr-1" />
                      Fotos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!petsLoading && filteredPets.length === 0 && (
          <Card className="text-center py-16 shadow-lg border-orange-100">
            <CardContent>
              <div className="relative mb-8">
                <Dog className="h-20 w-20 text-orange-300 mx-auto" />
                <Heart className="h-10 w-10 text-pink-400 absolute -top-2 -right-2 animate-pulse" />
                <Sparkles className="h-6 w-6 text-purple-400 absolute -bottom-2 -left-2 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {pets.length === 0
                  ? "¡Tu familia de mascotas te está esperando!"
                  : "No encontramos peluditos con esos filtros"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm || selectedSpecies !== "all"
                  ? "Intenta ajustar tus filtros de búsqueda para encontrar a tus compañeros"
                  : "Cada mascota es una historia de amor. ¡Comienza la tuya agregando a tu primer compañero peludo!"}
              </p>
              <AddPetDialog
                trigger={
                  <Button className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white shadow-lg text-lg px-8 py-3">
                    <Plus className="h-5 w-5 mr-2" />
                    {pets.length === 0 ? "Agregar Mi Primer Peludito" : "Agregar Otro Peludito"}
                  </Button>
                }
              />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
