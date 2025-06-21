"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dog,
  MapPin,
  Search,
  Phone,
  Mail,
  Globe,
  Star,
  Navigation,
  Filter,
  Stethoscope,
  Scissors,
  ShoppingBag,
  Home,
  LogOut,
  User,
  Loader2,
  Heart,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useContacts } from "@/hooks/useContacts"
import { logoutUser } from "@/lib/auth"

export default function ServicesPage() {
  const { user, userProfile, loading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedDistance, setSelectedDistance] = useState("10")
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Use the contacts hook with search and type filters
  const { contacts, loading: contactsLoading, error } = useContacts(selectedType, searchTerm)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [authLoading, isAuthenticated, router])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "veterinario":
        return <Stethoscope className="h-5 w-5" />
      case "peluqueria":
        return <Scissors className="h-5 w-5" />
      case "tienda":
        return <ShoppingBag className="h-5 w-5" />
      case "guarderia":
        return <Home className="h-5 w-5" />
      default:
        return <Heart className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "veterinario":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "peluqueria":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "tienda":
        return "bg-green-100 text-green-800 border-green-200"
      case "guarderia":
        return "bg-orange-100 text-orange-800 border-orange-200"
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
            <Stethoscope className="h-6 w-6 absolute -top-2 -right-2 text-blue-400 animate-pulse" />
          </div>
          <p className="text-gray-600">Buscando servicios para tus peluditos...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  // Calculate distance (mock calculation for now)
  const contactsWithDistance = contacts.map((contact) => ({
    ...contact,
    distance: Math.random() * 10 + 0.5, // Mock distance between 0.5 and 10.5 km
  }))

  const filteredContacts = contactsWithDistance.filter((contact) => {
    const withinDistance = contact.distance <= Number.parseFloat(selectedDistance)
    return withinDistance
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
              <Link href="/services" className="text-orange-500 font-medium flex items-center space-x-1">
                <Stethoscope className="h-4 w-4" />
                <span>Servicios</span>
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
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Servicios para Mascotas 🏥</h2>
          <p className="text-gray-600">Encuentra los mejores cuidados para tus peluditos</p>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-lg border-orange-100">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar servicios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-40 border-orange-200 focus:border-orange-400">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="veterinario">Veterinarios</SelectItem>
                    <SelectItem value="peluqueria">Peluquerías</SelectItem>
                    <SelectItem value="tienda">Tiendas</SelectItem>
                    <SelectItem value="guarderia">Guarderías</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedDistance} onValueChange={setSelectedDistance}>
                  <SelectTrigger className="w-32 border-orange-200 focus:border-orange-400">
                    <SelectValue placeholder="Distancia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 km</SelectItem>
                    <SelectItem value="10">10 km</SelectItem>
                    <SelectItem value="20">20 km</SelectItem>
                    <SelectItem value="50">50 km</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-50">
                  <Filter className="h-4 w-4 mr-1" />
                  Más filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="mb-8 shadow-lg border-red-100">
            <CardContent className="p-6 text-center">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {contactsLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Services Grid */}
        {!contactsLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredContacts.map((contact) => (
              <Card
                key={contact.id}
                className="hover:shadow-xl transition-all duration-300 border-orange-100 hover:border-orange-200 bg-gradient-to-br from-white to-orange-50/30"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-xl ${getTypeColor(contact.type)} shadow-sm`}>
                        {getTypeIcon(contact.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-800">{contact.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getTypeColor(contact.type)} variant="secondary">
                            {contact.type.charAt(0).toUpperCase() + contact.type.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium text-gray-700">{contact.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">{contact.address}</p>
                      <p className="text-xs text-orange-600 font-medium">
                        {contact.distance.toFixed(1)} km de distancia
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-green-400" />
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Servicios:</p>
                    <div className="flex flex-wrap gap-1">
                      {contact.services.slice(0, 3).map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-orange-200 text-orange-700">
                          {service}
                        </Badge>
                      ))}
                      {contact.services.length > 3 && (
                        <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">
                          +{contact.services.length - 3} más
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-orange-100">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-green-200 hover:bg-green-50">
                        <Phone className="h-4 w-4 mr-1" />
                        Llamar
                      </Button>
                      {contact.website && (
                        <Button size="sm" variant="outline" className="border-blue-200 hover:bg-blue-50">
                          <Globe className="h-4 w-4 mr-1" />
                          Web
                        </Button>
                      )}
                      {contact.email && (
                        <Button size="sm" variant="outline" className="border-purple-200 hover:bg-purple-50">
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                      )}
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-orange-400 to-pink-500 text-white">
                      <Navigation className="h-4 w-4 mr-1" />
                      Cómo llegar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!contactsLoading && filteredContacts.length === 0 && (
          <Card className="text-center py-16 shadow-lg border-orange-100">
            <CardContent>
              <div className="relative mb-8">
                <Stethoscope className="h-20 w-20 text-orange-300 mx-auto" />
                <Sparkles className="h-8 w-8 text-pink-400 absolute -top-2 -right-2 animate-pulse" />
                <Heart className="h-6 w-6 text-purple-400 absolute -bottom-2 -left-2 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No se encontraron servicios</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {contacts.length === 0
                  ? "Aún no hay servicios registrados en tu área"
                  : "Intenta ajustar tus filtros de búsqueda o ampliar la distancia"}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedType("all")
                  setSelectedDistance("50")
                }}
                className="border-orange-200 hover:bg-orange-50"
              >
                Limpiar filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
