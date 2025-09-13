'use client'

import { useOrderTracking } from '@/hooks/useOrderTracking'
import OrderStatusTracker from '@/components/OrderStatusTracker'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface OrderPageProps {
  params: {
    id: string
  }
}

export default function OrderPage({ params }: OrderPageProps) {
  const { order, loading, error } = useOrderTracking(params.id)
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  if (!isAuthenticated) {
    router.push('/login')
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'The order you are looking for does not exist.'}</p>
            <Link
              href="/orders"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
            >
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Check if the order belongs to the current user
  if (order.userId !== user?.userId) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-8">You don't have permission to view this order.</p>
            <Link
              href="/orders"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
            >
              View Your Orders
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="mt-2 text-gray-600">Order #{order.id.slice(-8)}</p>
            </div>
            <Link
              href="/orders"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              ← Back to Orders
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Status Tracker */}
          <div className="lg:col-span-1">
            <OrderStatusTracker order={order} />
          </div>

          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex items-center space-x-4">
                    {item.image && (
                      <div className="flex-shrink-0 w-16 h-16 relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        From: {item.shopName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
              <div className="text-sm text-gray-600">
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Order Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Order ID:</span>
                  <p className="text-gray-600 font-mono">{order.id}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Order Date:</span>
                  <p className="text-gray-600">{order.createdAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Last Updated:</span>
                  <p className="text-gray-600">{order.updatedAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Payment Status:</span>
                  <p className="text-gray-600">Paid</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}