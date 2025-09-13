'use client'

import { OrderWithTracking } from '@nearbyshop/shared'

interface OrderStatusTrackerProps {
  order: OrderWithTracking
}

const statusConfig = {
  pending: {
    label: 'Order Placed',
    description: 'Your order has been placed and is waiting for confirmation',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '📝',
  },
  accepted: {
    label: 'Order Accepted',
    description: 'The seller has accepted your order and is preparing it',
    color: 'bg-blue-100 text-blue-800',
    icon: '✅',
  },
  confirmed: {
    label: 'Order Confirmed',
    description: 'Your order is confirmed and being processed',
    color: 'bg-green-100 text-green-800',
    icon: '🔄',
  },
  shipped: {
    label: 'Shipped',
    description: 'Your order has been shipped and is on its way',
    color: 'bg-purple-100 text-purple-800',
    icon: '🚚',
  },
  delivered: {
    label: 'Delivered',
    description: 'Your order has been delivered successfully',
    color: 'bg-gray-100 text-gray-800',
    icon: '📦',
  },
  cancelled: {
    label: 'Cancelled',
    description: 'This order has been cancelled',
    color: 'bg-red-100 text-red-800',
    icon: '❌',
  },
}

const statusOrder = ['pending', 'accepted', 'confirmed', 'shipped', 'delivered']

export default function OrderStatusTracker({ order }: OrderStatusTrackerProps) {
  const currentStatusIndex = statusOrder.indexOf(order.status)
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h3>
      
      {/* Current Status */}
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">
            {statusConfig[order.status as keyof typeof statusConfig]?.icon || '📦'}
          </span>
          <div>
            <h4 className="text-lg font-medium text-gray-900">
              {statusConfig[order.status as keyof typeof statusConfig]?.label || order.status}
            </h4>
            <p className="text-sm text-gray-600">
              {statusConfig[order.status as keyof typeof statusConfig]?.description || 'Order status updated'}
            </p>
          </div>
        </div>
        <div className="mt-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusConfig[order.status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-800'
          }`}>
            {order.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentStatusIndex + 1) / statusOrder.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStatusIndex + 1) / statusOrder.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Status Timeline */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Status Timeline</h4>
        <div className="space-y-3">
          {statusOrder.map((status, index) => {
            const isCompleted = index <= currentStatusIndex
            const isCurrent = index === currentStatusIndex
            const config = statusConfig[status as keyof typeof statusConfig]
            
            return (
              <div key={status} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  isCompleted
                    ? isCurrent
                      ? 'bg-indigo-600 text-white'
                      : 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {isCompleted ? '✓' : index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${
                    isCompleted ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {config?.label}
                  </p>
                  <p className={`text-xs ${
                    isCompleted ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {config?.description}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-indigo-600 font-medium mt-1">
                      Current Status
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tracking Information */}
      {order.trackingNumber && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Tracking Information</h4>
          <p className="text-sm text-gray-600">
            Tracking Number: <span className="font-mono font-medium">{order.trackingNumber}</span>
          </p>
          {order.estimatedDelivery && (
            <p className="text-sm text-gray-600 mt-1">
              Estimated Delivery: {order.estimatedDelivery.toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  )
}