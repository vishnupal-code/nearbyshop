import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { Product } from '@nearbyshop/shared'

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

    // Get products for this seller
    const productsSnapshot = await adminDb
      .collection('products')
      .where('shopId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get()

    const products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[]

    return NextResponse.json({
      success: true,
      data: products,
    })

  } catch (error) {
    console.error('Error fetching seller products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, category, images } = body

    // Validate required fields
    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { success: false, error: 'Name, description, price, and category are required' },
        { status: 400 }
      )
    }

    if (price <= 0) {
      return NextResponse.json(
        { success: false, error: 'Price must be greater than 0' },
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

    // Create product document
    const productData: Omit<Product, 'id'> = {
      name,
      description,
      price: parseFloat(price),
      shopId: userId,
      category,
      images: images || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Save to Firestore
    const productRef = await adminDb.collection('products').add(productData)
    
    // Get the created product with ID
    const productDoc = await productRef.get()
    const product = {
      id: productDoc.id,
      ...productDoc.data(),
      createdAt: productDoc.data()?.createdAt?.toDate() || new Date(),
      updatedAt: productDoc.data()?.updatedAt?.toDate() || new Date(),
    } as Product

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully'
    })

  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}