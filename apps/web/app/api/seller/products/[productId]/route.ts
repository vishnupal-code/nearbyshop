import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params

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

    // Get the product
    const productRef = adminDb.collection('products').doc(productId)
    const productDoc = await productRef.get()
    
    if (!productDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    const productData = productDoc.data()
    
    // Verify the product belongs to this seller
    if (productData?.shopId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Product does not belong to this seller' },
        { status: 403 }
      )
    }

    // Delete the product
    await productRef.delete()

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}