"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dog,
  User,
  Mail,
  MapPin,
  Edit,
  Save,
  X,
  Camera,
  LogOut,
  Loader2,
  Settings,
  Bell,
  Shield,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { usePets } from "@/hooks/usePets"
import { logoutUser } from "@/lib/auth"
import { LocationAutocomplete } from "@/components/location-autocomplete"

export default function ProfilePage() {
  const { user, userProfile, loading: authLoading, isAuthenticated } = useAuth()
  const { pets, loading: petsLoading } = usePets()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Form state
  const [displayName, setDisplayName] = useState("")
  const [location, setLocation] = useState("")

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [authLoading, isAuthenticated, router])

  // Initialize form with user data
  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || "")
      setLocation(userProfile.location || "")
    } else if (user) {
      setDisplayName(user.displayName || "")
    }
  }, [user, userProfile])

  const handleSave = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Here you would update the user profile in Firebase
      // For now, we'll just simulate the save
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess("Perfil actualizado correctamente")
      setIsEditing(false)
    } catch (error: any) {
      setError("Error al actualizar el perfil")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset form to original values
    if (userProfile) {
      setDisplayName(userProfile.displayName || "")
      setLocation(userProfile.location || "")
    } else if (user) {
      setDisplayName(user.displayName || "")
    }
    setIsEditing(false)
    setError("")
    setSuccess("")
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

  // Helper function to safely format dates
  const formatDate = (date: any) => {
    if (!date) return "N/A"

    // If it's a Firestore Timestamp, convert to Date
    if (date.toDate && typeof date.toDate === "function") {
      return date.toDate().toLocaleDateString("es-ES")
    }

    // If it's already a Date object
    if (date instanceof Date) {
      return date.toLocaleDateString("es-ES")
    }

    // If it's a string, try to parse it
    if (typeof date === "string") {
      const parsedDate = new Date(date)
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleDateString("es-ES")
      }
    }

    return "N/A"
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
          <p className="text-gray-600">Cargando tu perfil...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Mi Perfil 👤</h2>
          <p className="text-gray-600">Gestiona tu información personal y configuración</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-orange-100">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-pink-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-800">Información Personal</CardTitle>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="border-orange-200 hover:bg-orange-50"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="border-gray-200 hover:bg-gray-50"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-orange-400 to-pink-500 text-white"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Guardar
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {/* Avatar */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-orange-200 to-pink-200 text-orange-700">
                        {displayName ? displayName[0].toUpperCase() : user?.email?.[0].toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 border-orange-200 hover:bg-orange-50"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {displayName || user?.displayName || "Usuario"}
                    </h3>
                    <p className="text-gray-600">{user?.email}</p>
                    <p className="text-sm text-gray-500">Miembro desde {formatDate(userProfile?.createdAt)}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-gray-700">
                      Nombre completo
                    </Label>
                    {isEditing ? (
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Tu nombre completo"
                        disabled={isLoading}
                        className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-md border border-orange-100">
                        <User className="h-4 w-4 text-orange-400" />
                        <span className="text-gray-800">{displayName || "No especificado"}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">
                      Correo electrónico
                    </Label>
                    <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-md border border-blue-100">
                      <Mail className="h-4 w-4 text-blue-400" />
                      <span className="text-gray-800">{user?.email}</span>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="location" className="text-gray-700">
                      Ubicación
                    </Label>
                    {isEditing ? (
                      <LocationAutocomplete
                        id="location"
                        value={location}
                        onChange={setLocation}
                        placeholder="Tu ciudad..."
                        disabled={isLoading}
                        className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-md border border-green-100">
                        <MapPin className="h-4 w-4 text-green-400" />
                        <span className="text-gray-800">{location || "No especificada"}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="mt-8 shadow-lg border-purple-100">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center text-gray-800">
                  <Settings className="h-5 w-5 mr-2 text-purple-500" />
                  Configuración de Cuenta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between p-4 border border-purple-100 rounded-lg bg-gradient-to-r from-purple-50/50 to-pink-50/50">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Bell className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Notificaciones</p>
                      <p className="text-sm text-gray-600">Recibir recordatorios y alertas</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-purple-200 hover:bg-purple-50">
                    Configurar
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-blue-100 rounded-lg bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Privacidad</p>
                      <p className="text-sm text-gray-600">Controla quién puede ver tu información</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50">
                    Configurar
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-orange-100 rounded-lg bg-gradient-to-r from-orange-50/50 to-pink-50/50">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <User className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Cambiar contraseña</p>
                      <p className="text-sm text-gray-600">Actualiza tu contraseña de acceso</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-50">
                    Cambiar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="shadow-lg border-green-100">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="text-gray-800">Estadísticas 📊</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Peluditos registrados</span>
                  {petsLoading ? (
                    <Skeleton className="h-6 w-8" />
                  ) : (
                    <span className="font-semibold text-green-600">{pets.length}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cuenta creada</span>
                  <span className="font-semibold text-gray-700">{formatDate(userProfile?.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Última actualización</span>
                  <span className="font-semibold text-gray-700">{formatDate(userProfile?.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
