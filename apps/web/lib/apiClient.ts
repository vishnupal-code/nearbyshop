import { useAuth } from '@/hooks/useAuth'

export const useApiClient = () => {
  const { user } = useAuth()

  const apiRequest = async (url: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(user?.userId && { 'x-user-id': user.userId }),
      ...options.headers,
    }

    return fetch(url, {
      ...options,
      headers,
    })
  }

  return { apiRequest }
}