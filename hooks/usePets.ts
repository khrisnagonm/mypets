"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./useAuth"
import { subscribeToUserPets, addPet, updatePet, deletePet } from "@/lib/firestore"
import type { Pet } from "@/lib/types"

export const usePets = () => {
  const { user } = useAuth()
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setPets([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    // Subscribe to real-time updates
    const unsubscribe = subscribeToUserPets(user.uid, (updatedPets) => {
      setPets(updatedPets)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const createPet = async (petData: Omit<Pet, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user) throw new Error("User not authenticated")

    try {
      const petId = await addPet(user.uid, petData)
      return petId
    } catch (error) {
      console.error("Error creating pet:", error)
      throw error
    }
  }

  const editPet = async (petId: string, petData: Partial<Pet>) => {
    try {
      await updatePet(petId, petData)
    } catch (error) {
      console.error("Error updating pet:", error)
      throw error
    }
  }

  const removePet = async (petId: string) => {
    try {
      await deletePet(petId)
    } catch (error) {
      console.error("Error deleting pet:", error)
      throw error
    }
  }

  return {
    pets,
    loading,
    error,
    createPet,
    editPet,
    removePet,
  }
}
