'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Order } from '@nearbyshop/shared'
import { useApiClient } from '@/lib/apiClient'
import Link from 'next/link'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { isAuthenticated, user } = useAuth()
  const { apiRequest } = useApiClient()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders()
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    router.push('/login')
    return null
  }

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await apiRequest('/api/orders')
      const result = await response.json()
      
      if (result.success) {
        setOrders(result.data)
      } else {
        setError(result.error || 'Failed to fetch orders')
      }
    } catch (err) {
      setError('An error occurred while fetching orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-blue-100 text-blue-800'
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '📝'
      case 'accepted':
        return '✅'
      case 'confirmed':
        return '🔄'
      case 'shipped':
        return '🚚'
      case 'delivered':
        return '📦'
      case 'cancelled':
        return '❌'
      default:
        return '📦'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
          <p className="mt-2 text-gray-600">Track and manage your orders</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-8">Start shopping to see your orders here!</p>
            <Link
              href="/shop"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getStatusIcon(order.status)}</span>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Order #{order.id.slice(-8)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Placed on {order.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-indigo-600 hover:text-indigo-500 font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Items</p>
                      <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Total Amount</p>
                      <p className="text-sm text-gray-600">${order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Last Updated</p>
                      <p className="text-sm text-gray-600">{order.updatedAt.toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <p>Shipping to: {order.shippingAddress.city}, {order.shippingAddress.state}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/orders/${order.id}`}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
                        >
                          Track Order
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}