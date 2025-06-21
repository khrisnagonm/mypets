"use client"

import { useState, useEffect } from "react"
import type { User } from "firebase/auth"
import { onAuthStateChange, getUserProfile, type UserProfile } from "@/lib/auth"

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user)

      if (user) {
        // Get user profile from Firestore
        const profile = await getUserProfile(user.uid)
        setUserProfile(profile)
      } else {
        setUserProfile(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
  }
}
