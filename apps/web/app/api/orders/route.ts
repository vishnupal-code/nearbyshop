import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { Order, CartItem } from '@nearbyshop/shared'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, shippingAddress, totalAmount } = body

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Items are required' },
        { status: 400 }
      )
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      return NextResponse.json(
        { success: false, error: 'Complete shipping address is required' },
        { status: 400 }
      )
    }

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid total amount' },
        { status: 400 }
      )
    }

    // Get user ID from request headers (you might want to implement proper auth middleware)
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User authentication required' },
        { status: 401 }
      )
    }

    // Create order document
    const orderData: Omit<Order, 'id'> = {
      userId,
      items: items as CartItem[],
      totalAmount,
      status: 'pending',
      shippingAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Save to Firestore
    const orderRef = await adminDb.collection('orders').add(orderData)
    
    // Get the created order with ID
    const orderDoc = await orderRef.get()
    const order = {
      id: orderDoc.id,
      ...orderDoc.data(),
    } as Order

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order created successfully'
    })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user ID from request headers
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User authentication required' },
        { status: 401 }
      )
    }

    // Verify user exists
    const userDoc = await adminDb.collection('users').doc(userId).get()
    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Get orders for the user
    const ordersSnapshot = await adminDb
      .collection('orders')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get()

    const orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({
      success: true,
      data: orders,
    })

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}