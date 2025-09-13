'use client'

import { useState, useEffect } from 'react'
import { Product, Shop } from '@nearbyshop/shared'
import ProductGrid from '@/components/ProductGrid'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

// Sample data for testing
const sampleShop: Shop = {
  id: 'shop-1',
  name: 'Tech Gadgets Store',
  description: 'Your one-stop shop for the latest tech gadgets and electronics',
  address: '123 Tech Street, Silicon Valley, CA 94000',
  coordinates: { lat: 37.7749, lng: -122.4194 },
  ownerId: 'owner-1',
  createdAt: new Date(),
  updatedAt: new Date(),
}

const sampleProducts: Product[] = [
  {
    id: 'product-1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life',
    price: 199.99,
    shopId: 'shop-1',
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'product-2',
    name: 'Smart Watch Series 8',
    description: 'Advanced smartwatch with health monitoring, GPS, and water resistance',
    price: 399.99,
    shopId: 'shop-1',
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'product-3',
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with customizable keys and tactile switches',
    price: 149.99,
    shopId: 'shop-1',
    category: 'Gaming',
    images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'product-4',
    name: '4K Ultra HD Monitor',
    description: '27-inch 4K monitor with HDR support and 99% sRGB color accuracy',
    price: 599.99,
    shopId: 'shop-1',
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'product-5',
    name: 'Wireless Gaming Mouse',
    description: 'Ergonomic wireless mouse with 16000 DPI sensor and 70-hour battery life',
    price: 79.99,
    shopId: 'shop-1',
    category: 'Gaming',
    images: ['https://images.unsplash.com/photo-1527864550417-7f91c4a76c63?w=400'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'product-6',
    name: 'USB-C Hub with 7 Ports',
    description: 'Multi-port USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery',
    price: 89.99,
    shopId: 'shop-1',
    category: 'Accessories',
    images: ['https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(sampleProducts)
      setLoading(false)
    }, 1000)
  }, [])

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
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Shop Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {sampleShop.name}
          </h1>
          <p className="text-gray-600 mb-4">
            {sampleShop.description}
          </p>
          <p className="text-sm text-gray-500">
            📍 {sampleShop.address}
          </p>
        </div>

        {/* Products Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Products ({products.length})
          </h2>
          <ProductGrid 
            products={products} 
            shopName={sampleShop.name}
            shopId={sampleShop.id}
          />
        </div>
      </div>
    </div>
  )
}