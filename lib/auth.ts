import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User,
  type AuthError,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "./firebase"

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  location: string
  createdAt: Date
  updatedAt: Date
}

// Helper function to handle Firebase Auth errors
const handleAuthError = (error: AuthError): string => {
  // Log error for debugging but don't throw
  console.warn("Firebase Auth Error:", error.code, error.message)

  switch (error.code) {
    case "auth/email-already-in-use":
      return "Este correo electrónico ya está registrado"
    case "auth/weak-password":
      return "La contraseña debe tener al menos 6 caracteres"
    case "auth/invalid-email":
      return "Correo electrónico inválido"
    case "auth/user-not-found":
      return "No existe una cuenta con este correo electrónico"
    case "auth/wrong-password":
      return "Contraseña incorrecta"
    case "auth/invalid-credential":
      return "Credenciales inválidas"
    case "auth/too-many-requests":
      return "Demasiados intentos fallidos. Intenta más tarde"
    case "auth/user-disabled":
      return "Esta cuenta ha sido deshabilitada"
    case "auth/operation-not-allowed":
      return "Operación no permitida"
    case "auth/network-request-failed":
      return "Error de conexión. Verifica tu internet"
    default:
      return "Ha ocurrido un error. Inténtalo de nuevo."
  }
}

// Register new user
export const registerUser = async (email: string, password: string, name: string, location: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update user profile
    await updateProfile(user, {
      displayName: name,
    })

    // Create user document in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: name,
      location,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await setDoc(doc(db, "users", user.uid), userProfile)

    return { user, profile: userProfile }
  } catch (error) {
    const authError = error as AuthError
    const errorMessage = handleAuthError(authError)

    // Create a custom error object that won't cause console errors
    const customError = new Error(errorMessage)
    customError.name = "AuthError"
    throw customError
  }
}

// Login user
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    const authError = error as AuthError
    const errorMessage = handleAuthError(authError)

    // Create a custom error object that won't cause console errors
    const customError = new Error(errorMessage)
    customError.name = "AuthError"
    throw customError
  }
}

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    const authError = error as AuthError
    console.warn("Logout error:", authError.code, authError.message)
    // Don't throw logout errors, just log them
  }
}

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, "users", uid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile
    } else {
      return null
    }
  } catch (error) {
    console.warn("Error getting user profile:", error)
    return null
  }
}

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}
