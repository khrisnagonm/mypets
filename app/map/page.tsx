"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Dog,
  MapPin,
  Search,
  Filter,
  Cat,
  Bird,
  Fish,
  Star,
  MessageCircle,
  Phone,
  LogOut,
  User,
  Heart,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { getNearbyPets } from "@/lib/firestore"

export default function MapPage() {
  const [searchRadius, setSearchRadius] = useState("5")
  const [selectedSpecies, setSelectedSpecies] = useState("all")
  const [selectedPet, setSelectedPet] = useState<number | null>(null)

  // Replace the hardcoded nearbyPets array with:
  const [nearbyPets, setNearbyPets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNearbyPets = async () => {
      try {
        const pets = await getNearbyPets(Number.parseFloat(searchRadius))
        setNearbyPets(pets)
      } catch (error) {
        console.error("Error fetching nearby pets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNearbyPets()
  }, [searchRadius])

  const getSpeciesIcon = (species: string) => {
    switch (species.toLowerCase()) {
      case "perro":
        return <Dog className="h-4 w-4" />
      case "gato":
        return <Cat className="h-4 w-4" />
      case "ave":
        return <Bird className="h-4 w-4" />
      case "pez":
        return <Fish className="h-4 w-4" />
      default:
        return <Heart className="h-4 w-4" />
    }
  }

  const filteredPets = nearbyPets.filter((pet) => {
    const matchesSpecies = selectedSpecies === "all" || pet.species.toLowerCase() === selectedSpecies
    const withinRadius = pet.distance <= Number.parseFloat(searchRadius)
    return matchesSpecies && withinRadius
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
                <p className="text-xs text-gray-500">Con cariño para tus peluditos</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-orange-500 transition-colors">
                Mi Hogar
              </Link>
              <Link href="/pets" className="text-gray-600 hover:text-orange-500 transition-colors">
                Mis Peluditos
              </Link>
              <Link href="/calendar" className="text-gray-600 hover:text-orange-500 transition-colors">
                Calendario
              </Link>
              <Link href="/reminders" className="text-gray-600 hover:text-orange-500 transition-colors">
                Recordatorios
              </Link>
              <Link href="/services" className="text-gray-600 hover:text-orange-500 transition-colors">
                Servicios
              </Link>
              <Link href="/map" className="text-orange-500 font-medium flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Explorar</span>
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Link href="/profile">
                <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-50">
                  <User className="h-4 w-4 mr-2" />
                  Perfil
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="border-pink-200 hover:bg-pink-50">
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Peluditos Cercanos 🗺️</h2>
          <p className="text-gray-600">Encuentra y conecta con otros amantes de las mascotas</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] shadow-lg border-orange-100">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-pink-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-gray-800">
                    <MapPin className="h-5 w-5 mr-2 text-orange-500" />
                    Mapa Interactivo
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-50">
                      <Filter className="h-4 w-4 mr-1" />
                      Filtros
                    </Button>
                    <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-50">
                      <Search className="h-4 w-4 mr-1" />
                      Buscar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-full p-0">
                {/* Simulación del mapa */}
                <div className="relative h-full bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 rounded-b-lg overflow-hidden">
                  {/* Fondo del mapa simulado */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="w-full h-full bg-gradient-to-br from-green-200 via-blue-200 to-purple-300"></div>
                  </div>

                  {/* Pins de mascotas en el mapa */}
                  {filteredPets.map((pet, index) => (
                    <div
                      key={pet.id}
                      className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                        selectedPet === pet.id ? "z-20" : "z-10"
                      }`}
                      style={{
                        left: `${20 + index * 15}%`,
                        top: `${30 + index * 10}%`,
                      }}
                      onClick={() => setSelectedPet(selectedPet === pet.id ? null : pet.id)}
                    >
                      <div className={`relative ${selectedPet === pet.id ? "scale-125" : ""} transition-transform`}>
                        <div
                          className={`w-12 h-12 rounded-full border-4 ${
                            pet.isOnline ? "border-green-400" : "border-gray-400"
                          } bg-white shadow-lg flex items-center justify-center`}
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={pet.image || "/placeholder.svg"} alt={pet.name} />
                            <AvatarFallback className="text-xs bg-gradient-to-br from-orange-200 to-pink-200 text-orange-700">
                              {pet.name[0]}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        {pet.isOnline && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}

                        {/* Tooltip */}
                        {selectedPet === pet.id && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white rounded-lg shadow-lg border p-3 z-30">
                            <div className="flex items-center space-x-2 mb-2">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={pet.image || "/placeholder.svg"} alt={pet.name} />
                                <AvatarFallback className="bg-gradient-to-br from-orange-200 to-pink-200 text-orange-700">
                                  {pet.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-sm text-gray-800">{pet.name}</p>
                                <p className="text-xs text-gray-600">{pet.breed}</p>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{pet.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-orange-600 font-medium">{pet.distance} km</span>
                              <div className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="text-xs ml-1">{pet.rating}</span>
                              </div>
                            </div>
                            {/* Flecha del tooltip */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Tu ubicación */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-orange-500 rounded-full opacity-20 animate-ping"></div>
                  </div>

                  {/* Leyenda */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-orange-100">
                    <h4 className="font-semibold text-sm mb-2 text-gray-800">Leyenda</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-gray-700">Tu ubicación</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-white border-2 border-green-400 rounded-full"></div>
                        <span className="text-gray-700">Peludito en línea</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-white border-2 border-gray-400 rounded-full"></div>
                        <span className="text-gray-700">Peludito sin conexión</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Filters */}
            <Card className="shadow-lg border-purple-100">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="text-lg text-gray-800">Filtros de Búsqueda 🔍</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">Radio de búsqueda</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={searchRadius}
                      onChange={(e) => setSearchRadius(e.target.value)}
                      min="1"
                      max="50"
                      className="w-20 border-orange-200 focus:border-orange-400"
                    />
                    <span className="text-sm text-gray-600">km</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">Tipo de peludito</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={selectedSpecies === "all" ? "default" : "outline"}
                      onClick={() => setSelectedSpecies("all")}
                      size="sm"
                      className={`text-xs ${
                        selectedSpecies === "all"
                          ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
                          : "border-orange-200 hover:bg-orange-50"
                      }`}
                    >
                      Todos
                    </Button>
                    <Button
                      variant={selectedSpecies === "perro" ? "default" : "outline"}
                      onClick={() => setSelectedSpecies("perro")}
                      size="sm"
                      className={`text-xs ${
                        selectedSpecies === "perro"
                          ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
                          : "border-orange-200 hover:bg-orange-50"
                      }`}
                    >
                      <Dog className="h-3 w-3 mr-1" />
                      Perritos
                    </Button>
                    <Button
                      variant={selectedSpecies === "gato" ? "default" : "outline"}
                      onClick={() => setSelectedSpecies("gato")}
                      size="sm"
                      className={`text-xs ${
                        selectedSpecies === "gato"
                          ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
                          : "border-orange-200 hover:bg-orange-50"
                      }`}
                    >
                      <Cat className="h-3 w-3 mr-1" />
                      Gatitos
                    </Button>
                    <Button
                      variant={selectedSpecies === "ave" ? "default" : "outline"}
                      onClick={() => setSelectedSpecies("ave")}
                      size="sm"
                      className={`text-xs ${
                        selectedSpecies === "ave"
                          ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
                          : "border-orange-200 hover:bg-orange-50"
                      }`}
                    >
                      <Bird className="h-3 w-3 mr-1" />
                      Pajaritos
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nearby Pets List */}
            <Card className="shadow-lg border-green-100">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="text-lg text-gray-800">Peluditos Cercanos 💚</CardTitle>
                <CardDescription className="text-gray-600">
                  {filteredPets.length} compañeros encontrados en {searchRadius} km
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredPets.length === 0 ? (
                    <div className="text-center py-8">
                      <Sparkles className="h-12 w-12 text-green-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">No hay peluditos cerca 😔</p>
                      <p className="text-xs text-gray-400 mt-1">Intenta ampliar el radio de búsqueda</p>
                    </div>
                  ) : (
                    filteredPets.map((pet) => (
                      <div
                        key={pet.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedPet === pet.id
                            ? "bg-gradient-to-r from-orange-50 to-pink-50 border-orange-200"
                            : "hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 border-orange-100"
                        }`}
                        onClick={() => setSelectedPet(selectedPet === pet.id ? null : pet.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                              <AvatarImage src={pet.image || "/placeholder.svg"} alt={pet.name} />
                              <AvatarFallback className="bg-gradient-to-br from-orange-200 to-pink-200 text-orange-700">
                                {pet.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            {pet.isOnline && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-sm truncate text-gray-800">{pet.name}</h4>
                              <div className="flex items-center space-x-1">
                                {getSpeciesIcon(pet.species)}
                                <span className="text-xs text-orange-600 font-medium">{pet.distance} km</span>
                              </div>
                            </div>

                            <p className="text-xs text-gray-600 mb-1">
                              {pet.breed} • {pet.age} años
                            </p>
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{pet.description}</p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  <span className="text-xs ml-1">{pet.rating}</span>
                                </div>
                                <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">
                                  {pet.location}
                                </Badge>
                              </div>
                              <div className="flex space-x-1">
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-orange-100">
                                  <MessageCircle className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-green-100">
                                  <Phone className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            <p className="text-xs text-gray-500 mt-1">
                              Dueño: {pet.owner} • {pet.lastSeen}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
