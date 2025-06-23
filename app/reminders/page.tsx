"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Dog,
  Bell,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  Stethoscope,
  Syringe,
  Scissors,
  Weight,
  Pill,
  AlertCircle,
  CheckCircle,
  LogOut,
  User,
  Loader2,
  Heart,
  Sparkles,
  Trash2,
  Edit,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useAppointments } from "@/hooks/useAppointments"
import { usePets } from "@/hooks/usePets"
import { logoutUser } from "@/lib/auth"

export default function RemindersPage() {
  
  const { user, userProfile, loading: authLoading, isAuthenticated } = useAuth()
  const { appointments, loading: appointmentsLoading, createAppointment } = useAppointments()
  const { pets, loading: petsLoading } = usePets()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isCreatingReminder, setIsCreatingReminder] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newReminder, setNewReminder] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "recordatorio",
    petId: "",
    veterinarian: "Casa",
  })

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [authLoading, isAuthenticated, router])

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "vacuna":
        return <Syringe className="h-4 w-4" />
      case "veterinario":
        return <Stethoscope className="h-4 w-4" />
      case "peluqueria":
        return <Scissors className="h-4 w-4" />
      case "peso":
        return <Weight className="h-4 w-4" />
      case "medicacion":
        return <Pill className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completada":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "programada":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "recordatorio":
        return <Bell className="h-4 w-4 text-orange-600" />
      case "cancelada":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
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

  const handleCreateReminder = async () => {
    if (!user) return

    setIsCreatingReminder(true)
    try {
      const selectedPet = pets.find((pet) => pet.id === newReminder.petId)
      if (!selectedPet) {
        throw new Error("Mascota no encontrada")
      }

      await createAppointment({
        petId: newReminder.petId,
        petName: selectedPet.name,
        type: newReminder.type as any,
        title: newReminder.title,
        description: newReminder.description,
        date: newReminder.date,
        time: newReminder.time,
        veterinarian: newReminder.veterinarian,
        status: "recordatorio",
      })

      // Reset form
      setNewReminder({
        title: "",
        description: "",
        date: "",
        time: "",
        type: "recordatorio",
        petId: "",
        veterinarian: "Casa",
      })

      setDialogOpen(false)
    } catch (error) {
      console.error("Error creating reminder:", error)
    } finally {
      setIsCreatingReminder(false)
    }
  }

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Dog className="h-12 w-12 mx-auto mb-4 text-orange-500 animate-bounce" />
            <Bell className="h-6 w-6 absolute -top-2 -right-2 text-pink-400 animate-pulse" />
          </div>
          <p className="text-gray-600">Cargando recordatorios...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  // Filter appointments based on search and filters
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = selectedType === "all" || appointment.type === selectedType
    const matchesStatus = selectedStatus === "all" || appointment.status === selectedStatus

    return matchesSearch && matchesType && matchesStatus
  })

  console.log("DEBUG: Contenido de 'appointments' (directo del hook):", appointments);
  console.log("DEBUG: Contenido de 'filteredAppointments':", filteredAppointments);
  console.log("DEBUG: Search Term:", searchTerm);
  console.log("DEBUG: Selected Type:", selectedType);
  console.log("DEBUG: Selected Status:", selectedStatus);


  const now = new Date(); // Get current date and time
  now.setHours(0, 0, 0, 0); // Set to start of today for consistent date comparison

  // Separate appointments into categories
  const upcomingAppointments = filteredAppointments
    .filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate >= now && (apt.status === "programada" || apt.status === "recordatorio");
    })
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()); // Sort by full date+time

  const pastDueAppointments = filteredAppointments
    .filter((apt) => {
      const aptDate = new Date(apt.date);
      // A past due appointment is one with a date before today AND not completed/cancelled
      return aptDate < now && (apt.status === "programada" || apt.status === "recordatorio");
    })
    .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime()); // Sort past due from newest to oldest

  const completedAppointments = filteredAppointments.filter((apt) => apt.status === "completada")
    .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime()); // Sort completed from newest to oldest


    console.log("DEBUG: now (start of today):", now.toISOString());
console.log("DEBUG: upcomingAppointments:", upcomingAppointments);
console.log("DEBUG: pastDueAppointments:", pastDueAppointments); // <--- ESTE ES CLAVE!
console.log("DEBUG: completedAppointments:", completedAppointments);

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
              <Link href="/reminders" className="text-orange-500 font-medium flex items-center space-x-1">
                <Bell className="h-4 w-4" />
                <span>Recordatorios</span>
              </Link>
              <Link href="/services" className="text-gray-600 hover:text-orange-500 transition-colors">
                Servicios
              </Link>
              <Link href="/map" className="text-gray-600 hover:text-orange-500 transition-colors">
                Explorar
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-50">
                    <User className="h-4 w-4 mr-1" />
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
                  {isLoggingOut ? (
                    <span className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Salir
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <LogOut className="h-4 w-4 mr-1" />
                      Salir
                    </span>
                  )}
                </Button>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white shadow-lg whitespace-nowrap"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Nuevo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Crear Recordatorio</DialogTitle>
                      <DialogDescription>Programa un recordatorio para el cuidado de tus peluditos</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="pet" className="text-right">
                          Mascota
                        </Label>
                        <Select
                          value={newReminder.petId}
                          onValueChange={(value) => setNewReminder({ ...newReminder, petId: value })}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecciona una mascota" />
                          </SelectTrigger>
                          <SelectContent>
                            {pets.map((pet) => (
                              <SelectItem key={pet.id} value={pet.id}>
                                {pet.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          Título
                        </Label>
                        <Input
                          id="title"
                          value={newReminder.title}
                          onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                          className="col-span-3"
                          placeholder="Ej: Vacuna anual"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                          Tipo
                        </Label>
                        <Select
                          value={newReminder.type}
                          onValueChange={(value) => setNewReminder({ ...newReminder, type: value })}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="recordatorio">Recordatorio</SelectItem>
                            <SelectItem value="vacuna">Vacuna</SelectItem>
                            <SelectItem value="veterinario">Veterinario</SelectItem>
                            <SelectItem value="peluqueria">Peluquería</SelectItem>
                            <SelectItem value="medicacion">Medicación</SelectItem>
                            <SelectItem value="peso">Control de peso</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                          Fecha
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={newReminder.date}
                          onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time" className="text-right">
                          Hora
                        </Label>
                        <Input
                          id="time"
                          type="time"
                          value={newReminder.time}
                          onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="description" className="text-right">
                          Descripción
                        </Label>
                        <Textarea
                          id="description"
                          value={newReminder.description}
                          onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                          className="col-span-3"
                          placeholder="Detalles adicionales..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleCreateReminder}
                        disabled={
                          isCreatingReminder ||
                          !newReminder.petId ||
                          !newReminder.title ||
                          !newReminder.date ||
                          !newReminder.time
                        }
                        className="bg-gradient-to-r from-orange-400 to-pink-500 text-white"
                      >
                        {isCreatingReminder ? (
                          <span className="flex items-center">
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Crear Recordatorio
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Bell className="h-4 w-4 mr-2" />
                            Crear Recordatorio
                          </span>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Recordatorios 🔔</h2>
          <p className="text-gray-600">Nunca olvides los cuidados importantes de tus peluditos</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Próximos</p>
                  {appointmentsLoading ? (
                    <Skeleton className="h-8 w-8" />
                  ) : (
                    <p className="text-2xl font-bold text-blue-700">{upcomingAppointments.length}</p>
                  )}
                  <p className="text-xs text-blue-600 mt-1">por realizar</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Completados</p>
                  {appointmentsLoading ? (
                    <Skeleton className="h-8 w-8" />
                  ) : (
                    <p className="text-2xl font-bold text-green-700">{completedAppointments.length}</p>
                  )}
                  <p className="text-xs text-green-600 mt-1">¡bien hecho!</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-red-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Atrasados</p>
                  {appointmentsLoading ? (
                    <Skeleton className="h-8 w-8" />
                  ) : (
                    <p className="text-2xl font-bold text-red-700">
                      {pastDueAppointments.length}
                    </p>
                  )}
                  <p className="text-xs text-red-600 mt-1">necesitan atención</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Esta Semana</p>
                  {appointmentsLoading ? (
                    <Skeleton className="h-8 w-8" />
                  ) : (
                    <p className="text-2xl font-bold text-purple-700">
                      {
                        appointments.filter((apt) => {
                          const aptDate = new Date(apt.date)
                          const today = new Date()
                          const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
                          return aptDate >= today && aptDate <= weekFromNow
                        }).length
                      }
                    </p>
                  )}
                  <p className="text-xs text-purple-600 mt-1">próximos 7 días</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Calendar className="h-8 w-8 text-purple-600" />
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
                    placeholder="Buscar recordatorios..."
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
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="vacuna">Vacunas</SelectItem>
                    <SelectItem value="veterinario">Veterinario</SelectItem>
                    <SelectItem value="peluqueria">Peluquería</SelectItem>
                    <SelectItem value="peso">Control de peso</SelectItem>
                    <SelectItem value="medicacion">Medicación</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40 border-orange-200 focus:border-orange-400">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="programada">Programadas</SelectItem>
                    <SelectItem value="recordatorio">Recordatorios</SelectItem>
                    <SelectItem value="completada">Completadas</SelectItem>
                    <SelectItem value="cancelada">Canceladas</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-50">
                  <Filter className="h-4 w-4 mr-1" />
                  Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Sections */}
        {!appointmentsLoading && (
          <div className="space-y-8">
            {/* Upcoming Appointments */}
            {upcomingAppointments.length > 0 && (
              <Card className="shadow-lg border-blue-100">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardTitle className="flex items-center text-gray-800">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Próximos Recordatorios ({upcomingAppointments.length})
                  </CardTitle>
                  <CardDescription className="text-gray-600">Recordatorios programados</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center space-x-4 p-4 border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-all"
                      >
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                          <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={appointment.petName} />
                          <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                            {appointment.petName[0]}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{appointment.petName}</h4>
                            <Badge className={getTypeColor(appointment.type)}>
                              {getTypeIcon(appointment.type)}
                              <span className="ml-1 capitalize">{appointment.type}</span>
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1">{appointment.title}</p>
                          <p className="text-sm text-gray-600 mb-2">{appointment.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {appointment.date}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {appointment.time}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" className="border-green-200 hover:bg-green-50">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Completar
                          </Button>
                          <Button size="sm" variant="outline" className="border-orange-200 hover:bg-orange-50">
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-200 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Past Due Appointments */}
            {pastDueAppointments.length > 0 && (
              <Card className="shadow-lg border-red-100">
                <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
                  <CardTitle className="flex items-center text-gray-800">
                    <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                    Recordatorios Atrasados ({pastDueAppointments.length})
                  </CardTitle>
                  <CardDescription className="text-gray-600">Necesitan tu atención</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {pastDueAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center space-x-4 p-4 border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg hover:from-red-100 hover:to-orange-100 transition-all"
                      >
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                          <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={appointment.petName} />
                          <AvatarFallback className="bg-red-100 text-red-700 font-bold">
                            {appointment.petName[0]}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{appointment.petName}</h4>
                            <Badge className={getTypeColor(appointment.type)}>
                              {getTypeIcon(appointment.type)}
                              <span className="ml-1 capitalize">{appointment.type}</span>
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1">{appointment.title}</p>
                          <p className="text-sm text-gray-600 mb-2">{appointment.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {appointment.date}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {appointment.time}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" className="border-green-200 hover:bg-green-50">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Completar
                          </Button>
                          <Button size="sm" variant="outline" className="border-orange-200 hover:bg-orange-50">
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-200 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Completed Appointments */}
            {completedAppointments.length > 0 && (
              <Card className="shadow-lg border-green-100">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="flex items-center text-gray-800">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    Completados ({completedAppointments.length})
                  </CardTitle>
                  <CardDescription className="text-gray-600">Recordatorios ya realizados</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {completedAppointments.slice(0, 5).map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center space-x-4 p-4 border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg"
                      >
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={appointment.petName} />
                          <AvatarFallback className="bg-green-100 text-green-700 font-bold">
                            {appointment.petName[0]}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900">{appointment.petName}</h4>
                            <Badge className={getTypeColor(appointment.type)} variant="outline">
                              {getTypeIcon(appointment.type)}
                              <span className="ml-1 capitalize">{appointment.type}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{appointment.title}</p>
                          <p className="text-xs text-gray-500">
                            {appointment.date} - {appointment.time}
                          </p>
                        </div>

                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1">Completado</span>
                        </Badge>
                      </div>
                    ))}
                    {completedAppointments.length > 5 && (
                      <Button variant="outline" className="w-full border-green-200 hover:bg-green-50">
                        Ver todos los completados ({completedAppointments.length - 5} más)
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {filteredAppointments.length === 0 && (
              <Card className="text-center py-16 shadow-lg border-orange-100">
                <CardContent>
                  <div className="relative mb-8">
                    <Bell className="h-20 w-20 text-orange-300 mx-auto" />
                    <Sparkles className="h-8 w-8 text-pink-400 absolute -top-2 -right-2 animate-pulse" />
                    <Heart className="h-6 w-6 text-purple-400 absolute -bottom-2 -left-2 animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {appointments.length === 0 ? "¡Crea tu primer recordatorio!" : "No se encontraron recordatorios"}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {searchTerm || selectedType !== "all" || selectedStatus !== "all"
                      ? "Intenta ajustar tus filtros de búsqueda para encontrar lo que buscas"
                      : "Los recordatorios te ayudan a mantener a tus peluditos saludables y felices"}
                  </p>
                  <Button
                    onClick={() => setDialogOpen(true)}
                    className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white shadow-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Mi Primer Recordatorio
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
