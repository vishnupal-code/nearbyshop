import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@nearbyshop/shared'

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getItemQuantity: (productId: string) => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get()
        const existingItem = items.find(i => i.productId === item.productId)
        
        if (existingItem) {
          set({
            items: items.map(i =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          })
        } else {
          set({
            items: [...items, { ...item, quantity: 1 }]
          })
        }
      },

      removeItem: (productId) => {
        const { items } = get()
        set({
          items: items.filter(item => item.productId !== productId)
        })
      },

      updateQuantity: (productId, quantity) => {
        const { items } = get()
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        
        set({
          items: items.map(item =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          )
        })
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalItems: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        const { items } = get()
        return items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },

      getItemQuantity: (productId) => {
        const { items } = get()
        const item = items.find(i => i.productId === productId)
        return item ? item.quantity : 0
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)