import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { SellerOrder } from '@nearbyshop/shared'

export async function GET(request: NextRequest) {
  try {
    // Get user ID from request headers (you might want to implement proper auth middleware)
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User authentication required' },
        { status: 401 }
      )
    }

    // Get user document to verify seller role and get shop ID
    const userDoc = await adminDb.collection('users').doc(userId).get()
    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const userData = userDoc.data()
    if (userData?.role !== 'seller') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Seller role required.' },
        { status: 403 }
      )
    }

    // For now, we'll get all orders and filter by shop ID
    // In a real app, you'd want to create a more efficient query
    const ordersSnapshot = await adminDb
      .collection('orders')
      .orderBy('createdAt', 'desc')
      .get()

    const orders: SellerOrder[] = []
    
    for (const doc of ordersSnapshot.docs) {
      const orderData = doc.data()
      
      // Filter orders that contain items from this seller's shop
      const hasItemsFromShop = orderData.items?.some((item: any) => item.shopId === userId)
      
      if (hasItemsFromShop) {
        // Get customer information
        const customerDoc = await adminDb.collection('users').doc(orderData.userId).get()
        const customerData = customerDoc.data()
        
        orders.push({
          id: doc.id,
          userId: orderData.userId,
          items: orderData.items,
          totalAmount: orderData.totalAmount,
          status: orderData.status,
          shippingAddress: orderData.shippingAddress,
          createdAt: orderData.createdAt?.toDate() || new Date(),
          updatedAt: orderData.updatedAt?.toDate() || new Date(),
          customerName: customerData?.name || 'Unknown',
          customerEmail: customerData?.email || 'Unknown',
          shopId: userId,
          shopName: userData?.name || 'Your Shop',
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: orders,
    })

  } catch (error) {
    console.error('Error fetching seller orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}