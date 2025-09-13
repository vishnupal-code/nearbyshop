'use client'

import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SellerLayoutProps {
  children: React.ReactNode
}

export default function SellerLayout({ children }: SellerLayoutProps) {
  const { user } = useAuth()
  const pathname = usePathname()

  const navigation = [
    { name: 'Dashboard', href: '/seller', current: pathname === '/seller' },
    { name: 'Orders', href: '/seller/orders', current: pathname === '/seller/orders' },
    { name: 'Products', href: '/seller/products', current: pathname === '/seller/products' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Seller Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/seller" className="text-xl font-bold text-gray-900">
                  Seller Dashboard
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      item.current
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700">
                Welcome, {user?.name}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-6">
        {children}
      </main>
    </div>
  )
}