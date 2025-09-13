'use client'

import { Product } from '@nearbyshop/shared'
import { useCartStore } from '@/store/cartStore'
import Image from 'next/image'

interface ProductGridProps {
  products: Product[]
  shopName: string
  shopId: string
}

export default function ProductGrid({ products, shopName, shopId }: ProductGridProps) {
  const { addItem, getItemQuantity } = useCartStore()

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      shopId: shopId,
      shopName: shopName,
    })
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products available in this shop.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const quantityInCart = getItemQuantity(product.id)
        
        return (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {product.images[0] && (
              <div className="aspect-w-16 aspect-h-9 w-full h-48 relative">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-indigo-600">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>
              
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                {quantityInCart > 0 ? `Add More (${quantityInCart} in cart)` : 'Add to Cart'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}