import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/store/authStore'

export const useAuth = () => {
  const {
    user,
    firebaseUser,
    loading,
    error,
    setUser,
    setFirebaseUser,
    setLoading,
    setError,
    clearError,
    loadUserData,
    logout: logoutStore,
  } = useAuthStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser)
        await loadUserData(firebaseUser)
      } else {
        logoutStore()
      }
    })

    return () => unsubscribe()
  }, [setFirebaseUser, loadUserData, logoutStore])

  const logout = async () => {
    try {
      setLoading(true)
      clearError()
      await auth.signOut()
      logoutStore()
    } catch (error) {
      setError('Failed to sign out')
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    firebaseUser,
    loading,
    error,
    isAuthenticated: !!user,
    isBuyer: user?.role === 'buyer',
    isSeller: user?.role === 'seller',
    logout,
    clearError,
  }
}