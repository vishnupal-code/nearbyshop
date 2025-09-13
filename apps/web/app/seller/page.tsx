'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import SellerLayout from '@/components/SellerLayout'
import { SellerOrder } from '@nearbyshop/shared'
import Link from 'next/link'

export default function SellerDashboard() {
  const [orders, setOrders] = useState<SellerOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/seller/orders')
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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/seller/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const result = await response.json()
      
      if (result.success) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus as any } : order
        ))
      } else {
        setError(result.error || 'Failed to update order status')
      }
    } catch (err) {
      setError('An error occurred while updating order status')
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

  const pendingOrders = orders.filter(order => order.status === 'pending')
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)

  return (
    <ProtectedRoute requiredRole="seller">
      <SellerLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your orders and products</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📦</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Orders
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {orders.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">⏳</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pending Orders
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {pendingOrders.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">💰</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Revenue
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        ${totalRevenue.toFixed(2)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Recent Orders
                </h3>
                <Link
                  href="/seller/orders"
                  className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                >
                  View all orders
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading orders...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-600">
                {error}
              </div>
            ) : orders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No orders yet. Start selling to see orders here!
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {orders.slice(0, 5).map((order) => (
                  <li key={order.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            Order #{order.id.slice(-8)}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                          <p>{order.customerName}</p>
                          <span>•</span>
                          <p>{order.items.length} items</p>
                          <span>•</span>
                          <p>${order.totalAmount.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'accepted')}
                            className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
                          >
                            Accept
                          </button>
                        )}
                        <Link
                          href={`/seller/orders/${order.id}`}
                          className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </SellerLayout>
    </ProtectedRoute>
  )
}