import { create } from 'zustand'
import { User, UserRole } from '@nearbyshop/shared'
import { User as FirebaseUser } from 'firebase/auth'
import { getUserDocument } from '@/lib/firebase'

interface AuthState {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  error: string | null
  setUser: (user: User | null) => void
  setFirebaseUser: (firebaseUser: FirebaseUser | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  loadUserData: (firebaseUser: FirebaseUser) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  firebaseUser: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  
  setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),

  loadUserData: async (firebaseUser) => {
    set({ loading: true, error: null })
    try {
      const userData = await getUserDocument(firebaseUser.uid)
      if (userData) {
        set({ user: userData, firebaseUser, loading: false })
      } else {
        set({ error: 'User data not found', loading: false })
      }
    } catch (error) {
      set({ error: 'Failed to load user data', loading: false })
    }
  },

  logout: () => {
    set({ user: null, firebaseUser: null, loading: false, error: null })
  },
}))