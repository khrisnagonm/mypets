"use client"

import { useState, useEffect } from "react"
import { searchContacts, subscribeToContacts } from "@/lib/firestore"
import type { Contact } from "@/lib/types"

export const useContacts = (type?: string, searchTerm?: string) => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    if (searchTerm && searchTerm.length >= 2) {
      // Búsqueda
      const fetchSearchResults = async () => {
        try {
          const results = await searchContacts(searchTerm, type)
          setContacts(results)
        } catch (error) {
          console.error("Error searching contacts:", error)
          setError("Error al buscar servicios")
        } finally {
          setLoading(false)
        }
      }
      fetchSearchResults()
    } else {
      // Suscripción en tiempo real
      const unsubscribe = subscribeToContacts((updatedContacts) => {
        let filteredContacts = updatedContacts
        if (type && type !== "all") {
          filteredContacts = updatedContacts.filter((contact) => contact.type === type)
        }
        setContacts(filteredContacts)
        setLoading(false)
      })

      return () => unsubscribe()
    }
  }, [type, searchTerm])

  return {
    contacts,
    loading,
    error,
  }
}
