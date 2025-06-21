"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dog,
  Heart,
  Plus,
  Search,
  Stethoscope,
  Syringe,
  Scissors,
  Weight,
  Calendar,
  Clock,
  FileText,
  Activity,
  TrendingUp,
  LogOut,
  User,
  Loader2,
  Sparkles,
  Shield,
  Thermometer,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { usePets } from "@/hooks/usePets"
import { useAppointments } from "@/hooks/useAppointments"
import { logoutUser } from "@/lib/auth"

export default function CarePage() {
  const { user, userProfile, loading: authLoading, isAuthenticated } = useAuth()
  const { pets, loading: petsLoading } = usePets()
  const { appointments, loading: appointmentsLoading } = useAppointments()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPet, setSelectedPet] = useState("all")
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [authLoading, isAuthenticated, router])

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
            <Heart className="h-6 w-6 absolute -top-2 -right-2 text-pink-400 animate-pulse" />
          </div>
          <p className="text-gray-600">Cargando cuidados...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  // Process real appointments data
  const getAppointmentsByType = (type: string) => {
    return appointments.filter((apt) => apt.type === type)
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "vacuna":
        return <Syringe className="h-6 w-6" />
      case "veterinario":
        return <Stethoscope className="h-6 w-6" />
      case "peluqueria":
        return <Scissors className="h-6 w-6" />
      case "peso":
        return <Weight className="h-6 w-6" />
      case "medicacion":
        return <FileText className="h-6 w-6" />
      default:
        return <Heart className="h-6 w-6" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "vacuna":
        return "bg-red-100 text-red-800 border-red-200"
      case "veterinario":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "peluqueria":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "peso":
        return "bg-green-100 text-green-800 border-green-200"
      case "medicacion":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getBgGradient = (type: string) => {
    switch (type.toLowerCase()) {
      case "vacuna":
        return "from-red-50 to-pink-50"
      case "veterinario":
        return "from-blue-50 to-cyan-50"
      case "peluqueria":
        return "from-purple-50 to-indigo-50"
      case "peso":
        return "from-green-50 to-emerald-50"
      case "medicacion":
        return "from-orange-50 to-yellow-50"
      default:
        return "from-gray-50 to-slate-50"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completada":
        return "bg-green-100 text-green-800 border-green-200"
      case "programada":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "recordatorio":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "cancelada":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Create care categories from real data
  const careTypes = ["vacuna", "veterinario", "peluqueria", "peso", "medicacion"]
  const careCategories = careTypes
    .map((type) => {
      const typeAppointments = getAppointmentsByType(type)
      return {
        id: type,
        title:
          type === "vacuna"
            ? "Vacunas"
            : type === "veterinario"
              ? "Salud General"
              : type === "peluqueria"
                ? "Peluquería"
                : type === "peso"
                  ? "Nutrición"
                  : "Medicación",
        icon: getTypeIcon(type),
        color: getTypeColor(type),
        bgColor: getBgGradient(type),
        items: typeAppointments.slice(0, 3).map((apt) => ({
          name: apt.title,
          lastDate: apt.date,
          nextDate: apt.date,
          status: apt.status === "completada" ? "Completado" : apt.status === "programada" ? "Programado" : "Pendiente",
          petName: apt.petName,
        })),
      }
    })
    .filter((category) => category.items.length > 0)

  // Calculate stats from real data
  const completedCount = appointments.filter((apt) => apt.status === "completada").length
  const upcomingCount = appointments.filter((apt) => {
    const aptDate = new Date(apt.date)
    const today = new Date()
    return aptDate >= today && apt.status === "programada"
  }).length
  const overdueCount = appointments.filter((apt) => {
    const aptDate = new Date(apt.date)
    const today = new Date()
    return aptDate < today && apt.status === "programada"
  }).length

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
              <Link href="/pets" className="text-gray-600 hover:text-orange-500 transition-colors">
                Mis Peluditos
              </Link>
              <Link href="/calendar" className="text-gray-600 hover:text-orange-500 transition-colors">
                Calendario
              </Link>
              <Link href="/care" className="text-orange-500 font-medium flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>Cuidados</span>
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
              <Link href="/reminders">
                <Button className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Cuidado
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Cuidados Integrales 💖</h2>
          <p className="text-gray-600">El bienestar completo de tus peluditos en un solo lugar</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Completados</p>
                  <p className="text-2xl font-bold text-green-700">{completedCount}</p>
                  <p className="text-xs text-green-600 mt-1">cuidados realizados</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-yellow-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Próximos</p>
                  <p className="text-2xl font-bold text-yellow-700">{upcomingCount}</p>
                  <p className="text-xs text-yellow-600 mt-1">programados</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-red-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Atrasados</p>
                  <p className="text-2xl font-bold text-red-700">{overdueCount}</p>
                  <p className="text-xs text-red-600 mt-1">necesitan atención</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <Activity className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Total Mascotas</p>
                  <p className="text-2xl font-bold text-purple-700">{pets.length}</p>
                  <p className="text-xs text-purple-600 mt-1">bajo cuidado</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-lg border-orange-100">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar cuidados..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedPet === "all" ? "default" : "outline"}
                  onClick={() => setSelectedPet("all")}
                  size="sm"
                  className={
                    selectedPet === "all"
                      ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
                      : "border-orange-200 hover:bg-orange-50"
                  }
                >
                  Todas las mascotas
                </Button>
                {pets.slice(0, 3).map((pet) => (
                  <Button
                    key={pet.id}
                    variant={selectedPet === pet.id ? "default" : "outline"}
                    onClick={() => setSelectedPet(pet.id)}
                    size="sm"
                    className={
                      selectedPet === pet.id
                        ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
                        : "border-orange-200 hover:bg-orange-50"
                    }
                  >
                    {pet.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Care Categories */}
        {appointmentsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="shadow-lg border-orange-100">
                <CardHeader>
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : careCategories.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {careCategories.map((category) => (
              <Card key={category.id} className="shadow-lg border-orange-100">
                <CardHeader className={`bg-gradient-to-r ${category.bgColor}`}>
                  <CardTitle className="flex items-center text-gray-800">
                    <div className="bg-white p-2 rounded-lg mr-3 shadow-sm">{category.icon}</div>
                    {category.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Seguimiento completo de {category.title.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {category.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
                          <p className="text-sm text-gray-600 mb-1">{item.petName}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Fecha: {item.lastDate}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(item.status)} variant="outline">
                            {item.status}
                          </Badge>
                          <Link href="/reminders">
                            <Button size="sm" variant="outline" className="border-orange-200 hover:bg-orange-50">
                              <Calendar className="h-4 w-4 mr-1" />
                              Agendar
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <Link href="/reminders">
                      <Button variant="outline" className="w-full border-orange-200 hover:bg-orange-50">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar {category.title}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16 shadow-lg border-orange-100">
            <CardContent>
              <div className="relative mb-8">
                <Heart className="h-20 w-20 text-orange-300 mx-auto" />
                <Sparkles className="h-8 w-8 text-pink-400 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">¡Comienza el cuidado integral!</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Agrega recordatorios y citas para comenzar a llevar un registro completo de los cuidados
              </p>
              <Link href="/reminders">
                <Button className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primer Recordatorio
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="mt-8 shadow-lg border-orange-100">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-pink-50">
            <CardTitle className="flex items-center text-gray-800">
              <Sparkles className="h-5 w-5 mr-2 text-orange-500" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription className="text-gray-600">Herramientas útiles para el cuidado diario</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/reminders">
                <Button variant="outline" className="h-20 flex-col space-y-2 border-blue-200 hover:bg-blue-50 w-full">
                  <Thermometer className="h-6 w-6 text-blue-600" />
                  <span className="text-sm">Registro de Temperatura</span>
                </Button>
              </Link>
              <Link href="/reminders">
                <Button variant="outline" className="h-20 flex-col space-y-2 border-green-200 hover:bg-green-50 w-full">
                  <Weight className="h-6 w-6 text-green-600" />
                  <span className="text-sm">Control de Peso</span>
                </Button>
              </Link>
              <Link href="/calendar">
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2 border-purple-200 hover:bg-purple-50 w-full"
                >
                  <FileText className="h-6 w-6 text-purple-600" />
                  <span className="text-sm">Historial Médico</span>
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2 border-orange-200 hover:bg-orange-50 w-full"
                >
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                  <span className="text-sm">Reportes</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Empty State for no pets */}
        {pets.length === 0 && (
          <Card className="text-center py-16 shadow-lg border-orange-100 mt-8">
            <CardContent>
              <div className="relative mb-8">
                <Heart className="h-20 w-20 text-orange-300 mx-auto" />
                <Sparkles className="h-8 w-8 text-pink-400 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">¡Comienza el cuidado integral!</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Agrega a tu primera mascota para comenzar a llevar un registro completo de sus cuidados
              </p>
              <Link href="/pets">
                <Button className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Mi Primera Mascota
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
