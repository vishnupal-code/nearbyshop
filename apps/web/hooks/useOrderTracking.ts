import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { OrderWithTracking } from '@nearbyshop/shared'

export const useOrderTracking = (orderId: string) => {
  const [order, setOrder] = useState<OrderWithTracking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      return
    }

    const orderRef = doc(db, 'orders', orderId)
    
    const unsubscribe = onSnapshot(
      orderRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data()
          const orderData: OrderWithTracking = {
            id: doc.id,
            userId: data.userId,
            items: data.items || [],
            totalAmount: data.totalAmount || 0,
            status: data.status || 'pending',
            shippingAddress: data.shippingAddress || {},
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            statusHistory: data.statusHistory?.map((update: any) => ({
              ...update,
              timestamp: update.timestamp?.toDate() || new Date(),
            })) || [],
            trackingNumber: data.trackingNumber,
            estimatedDelivery: data.estimatedDelivery?.toDate(),
          }
          setOrder(orderData)
          setError(null)
        } else {
          setError('Order not found')
        }
        setLoading(false)
      },
      (err) => {
        console.error('Error listening to order updates:', err)
        setError('Failed to load order details')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [orderId])

  return { order, loading, error }
}