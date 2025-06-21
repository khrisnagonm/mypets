"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Heart,
  Calendar,
  Stethoscope,
  Bell,
  Dog,
  Cat,
  Bird,
  Fish,
  LogOut,
  User,
  Loader2,
  Scissors,
  MapPin,
  Sparkles,
  Camera,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Zap,
  BookOpen,
  Star,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { usePets } from "@/hooks/usePets"
import { useAppointments } from "@/hooks/useAppointments"
import { logoutUser } from "@/lib/auth"

export default function DashboardPage() {
  const { user, userProfile, loading: authLoading, isAuthenticated } = useAuth()
  const { pets, loading: petsLoading } = usePets()
  const {
    appointments,
    loading: appointmentsLoading,
    getTodayAppointments,
    getUpcomingAppointments,
  } = useAppointments()
  const router = useRouter()
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

  const getPetStatus = (pet: any) => {
    const statuses = [
      "Listo para jugar 🎾",
      "Esperando su comida 🍖",
      "Hora de mimos 💕",
      "Necesita un paseo 🚶‍♂️",
      "Durmiendo plácidamente 😴",
      "Esperando aventuras 🌟",
    ]
    return statuses[Math.floor(Math.random() * statuses.length)]
  }

  const getNext7DaysAppointments = () => {
    const today = new Date()
    const next7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    return appointments
      .filter((apt) => {
        const aptDate = new Date(apt.date)
        return aptDate > today && aptDate <= next7Days
      })
      .slice(0, 5)
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
          <p className="text-gray-600">Cargando tu mundo de mascotas...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  const todayAppointments = getTodayAppointments()
  const next7DaysAppointments = getNext7DaysAppointments()
  const upcomingReminders = getUpcomingAppointments(3)

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
              <Link href="/dashboard" className="text-orange-500 font-medium flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>Mi Hogar</span>
              </Link>
              <Link href="/pets" className="text-gray-600 hover:text-orange-500 transition-colors">
                Mis Peluditos
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
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            ¡Hola, {userProfile?.displayName || user?.displayName || "Amante de las mascotas"}! 🐾
          </h2>
          <p className="text-lg text-gray-600 mb-2">¿Cómo están tus peluditos hoy?</p>
          {userProfile?.location && (
            <p className="text-sm text-gray-500 flex items-center justify-center">
              <MapPin className="h-4 w-4 mr-1" />
              {userProfile.location}
            </p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-100 to-orange-200 border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Mis Peluditos</p>
                  {petsLoading ? (
                    <Skeleton className="h-8 w-8" />
                  ) : (
                    <p className="text-3xl font-bold text-orange-800">{pets.length}</p>
                  )}
                  <p className="text-xs text-orange-600 mt-1">
                    {pets.length === 1 ? "compañero fiel" : "compañeros fieles"}
                  </p>
                </div>
                <div className="bg-orange-300 p-3 rounded-full">
                  <Heart className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-100 to-emerald-200 border-green-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Agenda de Hoy</p>
                  {appointmentsLoading ? (
                    <Skeleton className="h-8 w-8" />
                  ) : (
                    <p className="text-3xl font-bold text-green-800">{todayAppointments.length}</p>
                  )}
                  <p className="text-xs text-green-600 mt-1">
                    {todayAppointments.length === 0 ? "día libre" : "eventos programados"}
                  </p>
                </div>
                <div className="bg-green-300 p-3 rounded-full">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Próximos 7 Días</p>
                  {appointmentsLoading ? (
                    <Skeleton className="h-8 w-8" />
                  ) : (
                    <p className="text-3xl font-bold text-purple-800">{next7DaysAppointments.length}</p>
                  )}
                  <p className="text-xs text-purple-600 mt-1">eventos importantes</p>
                </div>
                <div className="bg-purple-300 p-3 rounded-full">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-100 to-rose-200 border-pink-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-pink-700">Estado General</p>
                  <p className="text-3xl font-bold text-pink-800">{pets.length > 0 ? "😊" : "🤗"}</p>
                  <p className="text-xs text-pink-600 mt-1">{pets.length > 0 ? "todos felices" : "esperando jugar"}</p>
                </div>
                <div className="bg-pink-300 p-3 rounded-full">
                  <Sparkles className="h-8 w-8 text-pink-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Agenda del Día y Próximos Eventos */}
            <Card className="shadow-lg border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center text-gray-800">
                      <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                      Agenda del Día y Próximos Eventos
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Tu agenda personalizada para el cuidado de tus peluditos
                    </CardDescription>
                  </div>
                  <Link href="/calendar">
                    <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50">
                      <ArrowRight className="h-4 w-4 mr-1" />
                      Ver todos los recordatorios
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {appointmentsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Eventos de Hoy */}
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="bg-green-100 p-2 rounded-lg mr-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">
                            Hoy -{" "}
                            {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
                          </h3>
                          <p className="text-sm text-gray-600">{todayAppointments.length} eventos programados</p>
                        </div>
                      </div>

                      {todayAppointments.length === 0 ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <p className="text-green-700 font-medium">¡Día libre para disfrutar!</p>
                          <p className="text-green-600 text-sm">No tienes eventos programados para hoy</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {todayAppointments.map((apt) => (
                            <div key={apt.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={apt.petName} />
                                    <AvatarFallback className="bg-green-100 text-green-700 text-sm font-bold">
                                      {apt.petName[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-bold text-gray-800">
                                      {apt.title} - {apt.petName}
                                    </p>
                                    <p className="text-sm text-gray-600">{apt.description}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                                    🕐 {apt.time}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Próximos 7 Días */}
                    {next7DaysAppointments.length > 0 && (
                      <div>
                        <div className="flex items-center mb-4">
                          <div className="bg-purple-100 p-2 rounded-lg mr-3">
                            <Clock className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">Próximos 7 días</h3>
                            <p className="text-sm text-gray-600">
                              {next7DaysAppointments.length} eventos importantes se acercan
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {next7DaysAppointments.map((apt) => (
                            <div key={apt.id} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                                    <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={apt.petName} />
                                    <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-bold">
                                      {apt.petName[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-gray-800">
                                      {apt.title} - {apt.petName}
                                    </p>
                                    <p className="text-xs text-gray-600">{apt.description}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-purple-700">{apt.date}</p>
                                  <p className="text-xs text-purple-600">{apt.time}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mis Compañeros de Vida */}
            <Card className="shadow-lg border-orange-100">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-pink-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center text-gray-800">
                      <Dog className="h-5 w-5 mr-2 text-orange-500" />
                      Mis Compañeros de Vida
                    </CardTitle>
                    <CardDescription className="text-gray-600">Los que llenan tu hogar de alegría</CardDescription>
                  </div>
                  <Link href="/pets">
                    <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-50">
                      <ArrowRight className="h-4 w-4 mr-1" />
                      Ver todos mis peluditos
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {petsLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="text-center">
                        <Skeleton className="h-20 w-20 rounded-full mx-auto mb-2" />
                        <Skeleton className="h-4 w-16 mx-auto mb-1" />
                        <Skeleton className="h-3 w-24 mx-auto" />
                      </div>
                    ))}
                  </div>
                ) : pets.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="relative mb-6">
                      <Dog className="h-20 w-20 text-orange-300 mx-auto" />
                      <Heart className="h-8 w-8 text-pink-400 absolute -top-2 -right-2 animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      ¡Tu familia de mascotas te está esperando!
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Cada mascota es una historia de amor. ¡Comienza la tuya agregando a tu primer compañero peludo!
                    </p>
                    <Link href="/pets">
                      <Button className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white shadow-lg text-lg px-8 py-3">
                        <Heart className="h-5 w-5 mr-2" />
                        Ir a Mis Peluditos
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {pets.map((pet) => (
                      <div
                        key={pet.id}
                        className="text-center group cursor-pointer hover:scale-105 transition-transform"
                      >
                        <div className="relative mb-3">
                          <Avatar className="h-20 w-20 mx-auto border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow">
                            <AvatarImage src={pet.image || "/placeholder.svg"} alt={pet.name} />
                            <AvatarFallback className="bg-gradient-to-br from-orange-200 to-pink-200 text-orange-700 text-xl font-bold">
                              {pet.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                            {getSpeciesIcon(pet.species)}
                          </div>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-1">{pet.name}</h3>
                        <p className="text-xs text-gray-600 mb-2 leading-relaxed">{getPetStatus(pet)}</p>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            pet.healthStatus === "excelente"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : pet.healthStatus === "bueno"
                                ? "bg-blue-100 text-blue-700 border-blue-200"
                                : pet.healthStatus === "regular"
                                  ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                  : "bg-red-100 text-red-700 border-red-200"
                          }`}
                        >
                          {pet.healthStatus === "excelente"
                            ? "💚 Excelente"
                            : pet.healthStatus === "bueno"
                              ? "💙 Bueno"
                              : pet.healthStatus === "regular"
                                ? "💛 Regular"
                                : "❤️ Necesita cuidados"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Acceso Rápido Mejorado */}
            <Card className="shadow-lg border-indigo-100">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle className="text-lg text-gray-800 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-indigo-500" />
                  Acceso Rápido
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Herramientas esenciales al alcance de un clic
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/care">
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col w-full border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all group"
                    >
                      <div className="bg-blue-100 p-2 rounded-lg mb-2 group-hover:bg-blue-200 transition-colors">
                        <Stethoscope className="h-6 w-6 text-blue-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">Cuidados</span>
                      <span className="text-xs text-gray-500">Salud y bienestar</span>
                    </Button>
                  </Link>
                  <Link href="/reminders">
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col w-full border-red-200 hover:bg-red-50 hover:border-red-300 transition-all group"
                    >
                      <div className="bg-red-100 p-2 rounded-lg mb-2 group-hover:bg-red-200 transition-colors">
                        <Bell className="h-6 w-6 text-red-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">Recordatorios</span>
                      <span className="text-xs text-gray-500">Nunca olvides nada</span>
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col w-full border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all group"
                    >
                      <div className="bg-purple-100 p-2 rounded-lg mb-2 group-hover:bg-purple-200 transition-colors">
                        <Scissors className="h-6 w-6 text-purple-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">Servicios</span>
                      <span className="text-xs text-gray-500">Encuentra profesionales</span>
                    </Button>
                  </Link>
                  <Link href="/pets">
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col w-full border-pink-200 hover:bg-pink-50 hover:border-pink-300 transition-all group"
                    >
                      <div className="bg-pink-100 p-2 rounded-lg mb-2 group-hover:bg-pink-200 transition-colors">
                        <Camera className="h-6 w-6 text-pink-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">Mis Peluditos</span>
                      <span className="text-xs text-gray-500">Gestiona perfiles</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recomendaciones para Ti */}
            <Card className="shadow-lg border-yellow-100">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardTitle className="text-lg text-gray-800 flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Recomendaciones para Ti
                </CardTitle>
                <CardDescription className="text-gray-600">Contenido personalizado para tus peluditos</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-yellow-100 p-2 rounded-lg">
                        <BookOpen className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 mb-1">Artículo del Día</h4>
                        <p className="text-sm text-gray-600 mb-2">"Cómo mantener a tu mascota hidratada en verano"</p>
                        <Button variant="outline" size="sm" className="text-xs border-yellow-200 hover:bg-yellow-50">
                          Leer más
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 mb-1">Consejo Semanal</h4>
                        <p className="text-sm text-gray-600 mb-2">"Rutina de ejercicios para perros en casa"</p>
                        <Button variant="outline" size="sm" className="text-xs border-green-200 hover:bg-green-50">
                          Ver rutina
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 mb-1">Recordatorio de Salud</h4>
                        <p className="text-sm text-gray-600 mb-2">"Es temporada de vacunas, revisa el calendario"</p>
                        <Link href="/calendar">
                          <Button variant="outline" size="sm" className="text-xs border-blue-200 hover:bg-blue-50">
                            Revisar calendario
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
