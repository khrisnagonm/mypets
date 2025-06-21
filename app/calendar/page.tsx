"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dog,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Stethoscope,
  Syringe,
  Scissors,
  Weight,
  Pill,
  LogOut,
  User,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { useAppointments } from "@/hooks/useAppointments"
import { AddAppointmentDialog } from "@/components/add-appointment-dialog"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const { appointments, loading: appointmentsLoading } = useAppointments()

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
        return <CalendarIcon className="h-4 w-4" />
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

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
    })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const getAppointmentsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return appointments.filter((apt) => apt.date === dateStr)
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 p-1"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayAppointments = getAppointmentsForDate(day)
      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === currentDate.getMonth() &&
        new Date().getFullYear() === currentDate.getFullYear()

      days.push(
        <div
          key={day}
          className={`h-24 p-1 border border-orange-100 ${
            isToday ? "bg-gradient-to-br from-orange-50 to-pink-50 border-orange-200" : "bg-white"
          } hover:bg-gradient-to-br hover:from-orange-50 hover:to-pink-50 cursor-pointer transition-all`}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? "text-orange-600" : "text-gray-900"}`}>{day}</div>
          <div className="space-y-1">
            {dayAppointments.slice(0, 2).map((apt) => (
              <div key={apt.id} className={`text-xs p-1 rounded ${getTypeColor(apt.type)} truncate`}>
                {apt.petName} - {apt.type}
              </div>
            ))}
            {dayAppointments.length > 2 && (
              <div className="text-xs text-gray-500">+{dayAppointments.length - 2} más</div>
            )}
          </div>
        </div>,
      )
    }

    return days
  }

  const todayAppointments = appointments.filter((apt) => {
    const today = new Date().toISOString().split("T")[0]
    return apt.date === today
  })

  const upcomingAppointments = appointments
    .filter((apt) => {
      const today = new Date()
      const aptDate = new Date(apt.date)
      return aptDate > today
    })
    .slice(0, 5)

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
              <Link href="/calendar" className="text-orange-500 font-medium flex items-center space-x-1">
                <CalendarIcon className="h-4 w-4" />
                <span>Calendario</span>
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
              <Button variant="outline" size="sm" className="border-pink-200 hover:bg-pink-50">
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
              <AddAppointmentDialog
                trigger={
                  <Button className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white shadow-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Cita
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Calendario de Citas 📅</h2>
          <p className="text-gray-600">Mantén organizadas todas las citas de tus peluditos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg border-orange-100">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-pink-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-gray-800">
                    <CalendarIcon className="h-5 w-5 mr-2 text-orange-500" />
                    {formatDate(currentDate)}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth("prev")}
                      className="border-orange-200 hover:bg-orange-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date())}
                      className="border-orange-200 hover:bg-orange-50"
                    >
                      Hoy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth("next")}
                      className="border-orange-200 hover:bg-orange-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-7 gap-0 mb-4">
                  {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                    <div
                      key={day}
                      className="p-2 text-center text-sm font-medium text-gray-500 bg-gradient-to-r from-orange-50 to-pink-50"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0 border border-orange-200 rounded-lg overflow-hidden">
                  {renderCalendarDays()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Appointments */}
            <Card className="shadow-lg border-green-100">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="text-lg text-gray-800">Citas de Hoy 💚</CardTitle>
                <CardDescription className="text-gray-600">
                  {todayAppointments.length} citas programadas
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {todayAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {todayAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100"
                      >
                        <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                          <AvatarImage src="/placeholder.svg" alt={apt.petName} />
                          <AvatarFallback className="bg-green-100 text-green-700 text-sm font-bold">
                            {apt.petName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{apt.petName}</p>
                          <p className="text-xs text-gray-600">{apt.title}</p>
                          <p className="text-xs text-green-600 font-medium">🕐 {apt.time}</p>
                        </div>
                        <Badge className={getTypeColor(apt.type)}>{getTypeIcon(apt.type)}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Sparkles className="h-8 w-8 text-green-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">¡Día libre para relajarse! 😌</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card className="shadow-lg border-purple-100">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="text-lg text-gray-800">Próximas Citas 💜</CardTitle>
                <CardDescription className="text-gray-600">
                  Los siguientes {upcomingAppointments.length} eventos
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {upcomingAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center space-x-3 p-3 border border-purple-100 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all"
                    >
                      <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                        <AvatarImage src="/placeholder.svg" alt={apt.petName} />
                        <AvatarFallback className="bg-purple-100 text-purple-700 text-sm font-bold">
                          {apt.petName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{apt.petName}</p>
                        <p className="text-xs text-gray-600">{apt.title}</p>
                        <p className="text-xs text-purple-600 font-medium">
                          📅 {apt.date} - {apt.time}
                        </p>
                      </div>
                      <Badge variant="outline" className={getTypeColor(apt.type)}>
                        {getTypeIcon(apt.type)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
