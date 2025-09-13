import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'
import { User as FirebaseUser } from 'firebase/auth'
import { User, UserRole } from '@nearbyshop/shared'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const auth = getAuth(app)
export const db = getFirestore(app)

// Google Auth Provider
const googleProvider = new GoogleAuthProvider()

// Auth functions
export const signInWithGoogle = async (role: UserRole) => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    await createOrUpdateUserDocument(user, role)
    return { success: true, user }
  } catch (error: any) {
    console.error('Error signing in with Google:', error)
    return { success: false, error: error.message }
  }
}

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return { success: true, user: result.user }
  } catch (error: any) {
    console.error('Error signing in with email:', error)
    return { success: false, error: error.message }
  }
}

export const signUpWithEmail = async (email: string, password: string, name: string, role: UserRole) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    const user = result.user
    await createOrUpdateUserDocument(user, role, name)
    return { success: true, user }
  } catch (error: any) {
    console.error('Error signing up with email:', error)
    return { success: false, error: error.message }
  }
}

export const logout = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error: any) {
    console.error('Error signing out:', error)
    return { success: false, error: error.message }
  }
}

// Helper function to create or update user document in Firestore
const createOrUpdateUserDocument = async (firebaseUser: FirebaseUser, role: UserRole, displayName?: string) => {
  const userRef = doc(db, 'users', firebaseUser.uid)
  const userSnap = await getDoc(userRef)
  
  const userData = {
    userId: firebaseUser.uid,
    email: firebaseUser.email!,
    name: displayName || firebaseUser.displayName || '',
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  if (!userSnap.exists()) {
    await setDoc(userRef, userData)
  } else {
    // Update existing user document
    await setDoc(userRef, { ...userData, createdAt: userSnap.data()?.createdAt }, { merge: true })
  }
}

// Helper function to get user document from Firestore
export const getUserDocument = async (userId: string): Promise<User | null> => {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      const data = userSnap.data()
      return {
        id: userSnap.id,
        userId: data.userId,
        email: data.email,
        name: data.name,
        role: data.role,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      }
    }
    return null
  } catch (error) {
    console.error('Error getting user document:', error)
    return null
  }
}

export default app