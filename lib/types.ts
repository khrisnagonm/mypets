export interface Pet {
  id: string
  ownerId: string // Cambiado de userId a ownerId para coincidir con las reglas
  name: string
  species: "perro" | "gato" | "ave" | "pez" | "otro"
  breed: string
  age: number
  gender: "macho" | "hembra"
  weight: string
  microchip?: string
  image?: string
  healthStatus: "excelente" | "bueno" | "regular" | "preocupante"
  createdAt: Date
  updatedAt: Date
}

export interface Appointment {
  id: string
  ownerId: string // Cambiado de userId a ownerId para coincidir con las reglas
  petId: string
  petName: string
  type: "vacuna" | "veterinario" | "peluqueria" | "peso" | "medicacion"
  title: string
  description: string
  date: string
  time: string
  veterinarian: string
  status: "programada" | "completada" | "cancelada" | "recordatorio"
  createdAt: Date
  updatedAt: Date
}

export interface MedicalRecord {
  id: string
  ownerId: string // Cambiado de userId a ownerId para coincidir con las reglas
  petId: string
  date: string
  type: "consulta" | "vacuna" | "cirugia" | "emergencia" | "revision"
  veterinarian: string
  diagnosis: string
  treatment: string
  medications?: string[]
  notes?: string
  cost?: number
  createdAt: Date
  updatedAt: Date
}

export interface NearbyPet {
  id: string
  userId: string // Para posts mantenemos userId según las reglas
  name: string
  species: string
  breed: string
  age: number
  owner: string
  distance: number
  location: string
  image?: string
  description: string
  rating: number
  coordinates: { lat: number; lng: number }
  lastSeen: string
  isOnline: boolean
  createdAt: Date
  updatedAt: Date
}

// Nuevos tipos para las colecciones adicionales
export interface WeightRecord {
  id: string
  ownerId: string
  petId: string
  weight: string
  date: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface GroomingRecord {
  id: string
  ownerId: string
  petId: string
  type: string
  date: string
  cost?: number
  notes?: string
  provider?: string
  createdAt: Date
  updatedAt: Date
}

export interface Contact {
  id: string
  name: string
  type: "veterinario" | "peluqueria" | "tienda" | "guarderia"
  address: string
  phone: string
  email?: string
  website?: string
  rating: number
  image?: string
  services: string[]
  coordinates: { lat: number; lng: number }
  createdAt: Date
  updatedAt: Date
}

export interface HealthAlert {
  id: string
  title: string
  content: string
  type: "noticia" | "consejo" | "alerta" | "promocion"
  image?: string
  priority: "baja" | "media" | "alta"
  createdAt: Date
  updatedAt: Date
}
