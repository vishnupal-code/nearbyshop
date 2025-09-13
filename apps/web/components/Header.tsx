'use client'

import { useAuth } from '@/hooks/useAuth'
import { useCartStore } from '@/store/cartStore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { user, isAuthenticated, logout, loading } = useAuth()
  const { getTotalItems } = useCartStore()
  const router = useRouter()
  const cartItemsCount = getTotalItems()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  if (!isAuthenticated) {
    return (
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                NearbyShop
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/shop"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Shop
              </Link>
              <Link
                href="/login"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              NearbyShop
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/shop"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Shop
            </Link>
            
            <Link
              href="/cart"
              className="relative text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Cart
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            <Link
              href="/orders"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Orders
            </Link>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Welcome, {user?.name || user?.email}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user?.role === 'buyer' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {user?.role === 'buyer' ? 'Buyer' : 'Seller'}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}