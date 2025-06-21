import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { storage } from "./firebase"

// Upload pet profile image
export const uploadPetImage = async (userId: string, petId: string, file: File): Promise<string> => {
  try {
    const fileName = `profile_image_${Date.now()}.${file.name.split(".").pop()}`
    const storageRef = ref(storage, `pets/${userId}/${petId}/${fileName}`)

    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)

    return downloadURL
  } catch (error) {
    console.error("Error uploading pet image:", error)
    throw error
  }
}

// Upload medical record document
export const uploadMedicalDocument = async (userId: string, recordId: string, file: File): Promise<string> => {
  try {
    const fileName = `${file.name}_${Date.now()}`
    const storageRef = ref(storage, `medicalRecords/${userId}/${recordId}/${fileName}`)

    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)

    return downloadURL
  } catch (error) {
    console.error("Error uploading medical document:", error)
    throw error
  }
}

// Upload post image (for social features)
export const uploadPostImage = async (postId: string, file: File): Promise<string> => {
  try {
    const fileName = `image_${Date.now()}.${file.name.split(".").pop()}`
    const storageRef = ref(storage, `posts/${postId}/${fileName}`)

    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)

    return downloadURL
  } catch (error) {
    console.error("Error uploading post image:", error)
    throw error
  }
}

// Delete file from storage
export const deleteStorageFile = async (filePath: string): Promise<void> => {
  try {
    const storageRef = ref(storage, filePath)
    await deleteObject(storageRef)
  } catch (error) {
    console.error("Error deleting file:", error)
    throw error
  }
}
