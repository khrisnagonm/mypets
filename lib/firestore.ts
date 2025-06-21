import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  type DocumentData,
} from "firebase/firestore"
import { db } from "./firebase"
import type { Pet, Appointment, MedicalRecord, NearbyPet, Contact } from "./types"


export const convertTimestamp = (data: DocumentData) => {
  const convertedData: any = {};
  for (const key in data) {
    if (data[key] instanceof Timestamp) {
      convertedData[key] = data[key].toDate(); 
    } else {
      convertedData[key] = data[key];
    }
  }
  return convertedData;
};

// PETS CRUD OPERATIONS
export const addPet = async (userId: string, petData: Omit<Pet, "id" | "ownerId" | "createdAt" | "updatedAt">) => {
  try {
    /**
     * Firestore no acepta valores `undefined`.
     * Sanitizamos el objeto para evitar errores.
     */
    const sanitizedData = Object.fromEntries(
      Object.entries(petData).filter(([, value]) => value !== undefined && value !== null && value !== ""),
    )

    const docRef = await addDoc(collection(db, "pets"), {
      ...sanitizedData,
      ownerId: userId, // Cambiado de userId a ownerId para coincidir con las reglas
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding pet:", error)
    throw error
  }
}

export const updatePet = async (petId: string, petData: Partial<Pet>) => {
  try {
    const petRef = doc(db, "pets", petId)
    await updateDoc(petRef, {
      ...petData,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error updating pet:", error)
    throw error
  }
}

export const deletePet = async (petId: string) => {
  try {
    await deleteDoc(doc(db, "pets", petId))
  } catch (error) {
    console.error("Error deleting pet:", error)
    throw error
  }
}

export const getUserPets = async (userId: string): Promise<Pet[]> => {
  try {
    const q = query(collection(db, "pets"), where("ownerId", "==", userId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...convertTimestamp(doc.data()),
        }) as Pet,
    )
  } catch (error) {
    console.error("Error getting user pets:", error)
    throw error
  }
}

export const getPet = async (petId: string): Promise<Pet | null> => {
  try {
    const docRef = doc(db, "pets", petId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...convertTimestamp(docSnap.data()),
      } as Pet
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting pet:", error)
    throw error
  }
}

// APPOINTMENTS CRUD OPERATIONS (usando colección 'reminders' según tus reglas)
export const addAppointment = async (
  userId: string,
  appointmentData: Omit<Appointment, "id" | "ownerId" | "createdAt" | "updatedAt">,
) => {
  try {
    const docRef = await addDoc(collection(db, "reminders"), {
      ...appointmentData,
      ownerId: userId, // Cambiado para coincidir con las reglas
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding appointment:", error)
    throw error
  }
}

export const updateAppointment = async (appointmentId: string, appointmentData: Partial<Appointment>) => {
  try {
    const appointmentRef = doc(db, "reminders", appointmentId)
    await updateDoc(appointmentRef, {
      ...appointmentData,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error updating appointment:", error)
    throw error
  }
}

export const deleteAppointment = async (appointmentId: string) => {
  try {
    await deleteDoc(doc(db, "reminders", appointmentId))
  } catch (error) {
    console.error("Error deleting appointment:", error)
    throw error
  }
}

export const getUserAppointments = async (userId: string): Promise<Appointment[]> => {
  try {
    const q = query(collection(db, "reminders"), where("ownerId", "==", userId), orderBy("date", "asc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...convertTimestamp(doc.data()), // Aquí se usa la función
        }) as Appointment,
    )
  } catch (error) {
    console.error("Error getting user appointments:", error)
    throw error
  }
}

// MEDICAL RECORDS CRUD OPERATIONS
export const addMedicalRecord = async (
  userId: string,
  recordData: Omit<MedicalRecord, "id" | "ownerId" | "createdAt" | "updatedAt">,
) => {
  try {
    const docRef = await addDoc(collection(db, "medicalHistory"), {
      ...recordData,
      ownerId: userId, // Cambiado para coincidir con las reglas
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding medical record:", error)
    throw error
  }
}

export const getPetMedicalRecords = async (userId: string, petId: string): Promise<MedicalRecord[]> => {
  try {
    const q = query(
      collection(db, "medicalHistory"),
      where("ownerId", "==", userId),
      where("petId", "==", petId),
      orderBy("date", "desc"),
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...convertTimestamp(doc.data()),
        }) as MedicalRecord,
    )
  } catch (error) {
    console.error("Error getting pet medical records:", error)
    throw error
  }
}

// NEARBY PETS CRUD OPERATIONS (usando colección 'posts' para mascotas cercanas)
export const addNearbyPet = async (
  userId: string,
  nearbyPetData: Omit<NearbyPet, "id" | "userId" | "createdAt" | "updatedAt">,
) => {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      ...nearbyPetData,
      userId: userId, // Para posts usamos userId según las reglas
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding nearby pet:", error)
    throw error
  }
}

export const getNearbyPets = async (maxDistance = 10): Promise<NearbyPet[]> => {
  try {
    // Para posts, todos pueden leer según las reglas
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...convertTimestamp(doc.data()),
          }) as NearbyPet,
      )
      .filter((pet) => pet.distance <= maxDistance)
  } catch (error) {
    console.error("Error getting nearby pets:", error)
    throw error
  }
}

// SERVICES/CONTACTS CRUD OPERATIONS
export const addContact = async (contactData: Omit<Contact, "id" | "createdAt" | "updatedAt">) => {
  try {
    const docRef = await addDoc(collection(db, "contacts"), {
      ...contactData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding contact:", error)
    throw error
  }
}

export const getContacts = async (type?: string): Promise<Contact[]> => {
  try {
    let q
    if (type && type !== "all") {
      q = query(collection(db, "contacts"), where("type", "==", type), orderBy("name", "asc"))
    } else {
      q = query(collection(db, "contacts"), orderBy("name", "asc"))
    }

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...convertTimestamp(doc.data()),
        }) as Contact,
    )
  } catch (error) {
    console.error("Error getting contacts:", error)
    throw error
  }
}

export const searchContacts = async (searchTerm: string, type?: string): Promise<Contact[]> => {
  try {
    // En una implementación real, usarías Algolia o similar para búsqueda de texto completo
    // Por ahora, obtenemos todos y filtramos en el cliente
    const contacts = await getContacts(type)
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.services.some((service) => service.toLowerCase().includes(searchTerm.toLowerCase())) ||
        contact.address.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  } catch (error) {
    console.error("Error searching contacts:", error)
    throw error
  }
}

// REAL-TIME LISTENERS
export const subscribeToUserPets = (userId: string, callback: (pets: Pet[]) => void) => {
  const q = query(collection(db, "pets"), where("ownerId", "==", userId), orderBy("createdAt", "desc"))

  return onSnapshot(q, (querySnapshot) => {
    const pets = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...convertTimestamp(doc.data()),
        }) as Pet,
    )
    callback(pets)
  })
}

export const subscribeToUserAppointments = (userId: string, callback: (appointments: Appointment[]) => void) => {
  const q = query(collection(db, "reminders"), where("ownerId", "==", userId), orderBy("date", "asc"))

  return onSnapshot(q, (querySnapshot) => {
    const appointments = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...convertTimestamp(doc.data()),
        }) as Appointment,
    )
    callback(appointments)
  })
}

export const subscribeToContacts = (callback: (contacts: Contact[]) => void) => {
  const q = query(collection(db, "contacts"), orderBy("name", "asc"))

  return onSnapshot(q, (querySnapshot) => {
    const contacts = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...convertTimestamp(doc.data()),
        }) as Contact,
    )
    callback(contacts)
  })
}

// WEIGHT LOG OPERATIONS
export const addWeightRecord = async (
  userId: string,
  weightData: { petId: string; weight: string; date: string; notes?: string },
) => {
  try {
    const docRef = await addDoc(collection(db, "weightLog"), {
      ...weightData,
      ownerId: userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding weight record:", error)
    throw error
  }
}

export const getPetWeightHistory = async (userId: string, petId: string) => {
  try {
    const q = query(
      collection(db, "weightLog"),
      where("ownerId", "==", userId),
      where("petId", "==", petId),
      orderBy("date", "desc"),
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamp(doc.data()),
    }))
  } catch (error) {
    console.error("Error getting pet weight history:", error)
    throw error
  }
}

// GROOMING RECORDS OPERATIONS
export const addGroomingRecord = async (
  userId: string,
  groomingData: { petId: string; type: string; date: string; cost?: number; notes?: string; provider?: string },
) => {
  try {
    const docRef = await addDoc(collection(db, "grooming"), {
      ...groomingData,
      ownerId: userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding grooming record:", error)
    throw error
  }
}

export const getPetGroomingHistory = async (userId: string, petId: string) => {
  try {
    const q = query(
      collection(db, "grooming"),
      where("ownerId", "==", userId),
      where("petId", "==", petId),
      orderBy("date", "desc"),
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamp(doc.data()),
    }))
  } catch (error) {
    console.error("Error getting pet grooming history:", error)
    throw error
  }
}
