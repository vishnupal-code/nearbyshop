import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params
    const { status } = await request.json()

    // Validate status
    const validStatuses = ['pending', 'accepted', 'confirmed', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Get user ID from request headers
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User authentication required' },
        { status: 401 }
      )
    }

    // Verify user is a seller
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

    // Get the order
    const orderRef = adminDb.collection('orders').doc(orderId)
    const orderDoc = await orderRef.get()
    
    if (!orderDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    const orderData = orderDoc.data()
    
    // Verify the order contains items from this seller's shop
    const hasItemsFromShop = orderData?.items?.some((item: any) => item.shopId === userId)
    if (!hasItemsFromShop) {
      return NextResponse.json(
        { success: false, error: 'Order does not belong to this seller' },
        { status: 403 }
      )
    }

    // Update the order status
    await orderRef.update({
      status,
      updatedAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully'
    })

  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update order status' },
      { status: 500 }
    )
  }
}