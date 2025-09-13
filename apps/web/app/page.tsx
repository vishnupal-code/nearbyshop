'use client'

import { APP_NAME } from '@nearbyshop/shared'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

export default function Home() {
  const { user, isAuthenticated, isBuyer, isSeller } = useAuth()

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to {APP_NAME}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find and sell products from local shops near you
          </p>
          <div className="space-x-4">
            <Link
              href="/login"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-indigo-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {isBuyer 
            ? "Discover amazing products from local shops near you"
            : "Manage your shop and reach more customers"
          }
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {isBuyer ? (
            <>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Browse Products</h3>
                <p className="text-gray-600 mb-4">Find products from local shops</p>
                <Link
                  href="/shop"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block"
                >
                  Start Shopping
                </Link>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Find Shops</h3>
                <p className="text-gray-600 mb-4">Discover shops near your location</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                  Explore Shops
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Manage Products</h3>
                <p className="text-gray-600 mb-4">Add and update your product listings</p>
                <Link
                  href="/seller/products"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block"
                >
                  Manage Products
                </Link>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">View Analytics</h3>
                <p className="text-gray-600 mb-4">Track your shop's performance</p>
                <Link
                  href="/seller"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 inline-block"
                >
                  View Dashboard
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}