"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dog, Mail, Lock, User, Eye, EyeOff, Loader2, Heart, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { registerUser, loginUser } from "@/lib/auth"
import { LocationAutocomplete } from "@/components/location-autocomplete"

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [location, setLocation] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await loginUser(email, password)
      setSuccess("¡Bienvenido de vuelta! 🐾")
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (error: any) {
      setError(error.message || "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("register-email") as string
    const password = formData.get("register-password") as string
    const name = formData.get("name") as string

    // Basic validation
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      return
    }

    if (!email.includes("@")) {
      setError("Ingresa un correo electrónico válido")
      setIsLoading(false)
      return
    }

    if (!location.trim()) {
      setError("Por favor selecciona una ubicación")
      setIsLoading(false)
      return
    }

    if (name.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres")
      setIsLoading(false)
      return
    }

    try {
      await registerUser(email, password, name, location)
      setSuccess("¡Cuenta creada! Bienvenido a la familia 🎉")
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (error: any) {
      setError(error.message || "Error al crear la cuenta")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <div className="bg-gradient-to-br from-orange-400 to-pink-500 p-6 rounded-full w-24 h-24 mx-auto shadow-xl">
              <Dog className="h-12 w-12 text-white" />
            </div>
            <Sparkles className="h-8 w-8 text-pink-400 absolute -top-2 -right-2 animate-pulse" />
            <Heart className="h-6 w-6 text-orange-400 absolute -bottom-1 -left-1 animate-bounce" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-3">
            My Pets
          </h1>
          <p className="text-gray-600 text-lg">El hogar digital de tus peluditos</p>
          <p className="text-sm text-gray-500 mt-2">Donde cada mascota es familia 🐾</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center bg-gradient-to-r from-orange-50 to-pink-50 rounded-t-lg">
            <CardTitle className="text-2xl text-gray-800">¡Bienvenido!</CardTitle>
            <CardDescription className="text-gray-600">
              Únete a nuestra comunidad de amantes de las mascotas
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {error && (
              <Alert variant="destructive" className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-orange-100 to-pink-100">
                <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-orange-600">
                  Iniciar Sesión
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-white data-[state=active]:text-pink-600"
                >
                  Unirme
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">
                      Correo Electrónico
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 h-4 w-4" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="tu@email.com"
                        className="pl-10 border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                        required
                        disabled={isLoading}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700">
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 h-4 w-4" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                        required
                        disabled={isLoading}
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      <>
                        <Dog className="mr-2 h-4 w-4" />
                        Entrar a Mi Hogar
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <Button variant="link" className="text-sm text-orange-600 hover:text-orange-700">
                    ¿Olvidaste tu contraseña?
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700">
                      Nombre Completo
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 h-4 w-4" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Tu nombre completo"
                        className="pl-10 border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                        required
                        disabled={isLoading}
                        autoComplete="name"
                        minLength={2}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-gray-700">
                      Correo Electrónico
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 h-4 w-4" />
                      <Input
                        id="register-email"
                        name="register-email"
                        type="email"
                        placeholder="tu@email.com"
                        className="pl-10 border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                        required
                        disabled={isLoading}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-gray-700">
                      Ubicación
                    </Label>
                    <LocationAutocomplete
                      id="location"
                      name="location"
                      value={location}
                      onChange={setLocation}
                      placeholder="¿Dónde vives con tus peluditos?"
                      disabled={isLoading}
                      required
                      className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                    />
                    <p className="text-xs text-gray-500">Para encontrar servicios cerca de ti 📍</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-gray-700">
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 h-4 w-4" />
                      <Input
                        id="register-password"
                        name="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                        required
                        disabled={isLoading}
                        minLength={6}
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Mínimo 6 caracteres para proteger a tus peluditos 🔒</p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando tu hogar...
                      </>
                    ) : (
                      <>
                        <Heart className="mr-2 h-4 w-4" />
                        Unirme a la Familia
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-gray-600">
              Al continuar, aceptas cuidar a tus mascotas con mucho amor 💕
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">¿Necesitas ayuda? Escríbenos con cariño 💌</p>
        </div>
      </div>
    </div>
  )
}
