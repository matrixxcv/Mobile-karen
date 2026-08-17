import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  slug?: string
  category?: 'iphone' | 'accessory'
}

type CartContextValue = {
  items: CartItem[]
  itemCount: number
  subtotal: number
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
}

const CART_KEY = 'mobile-karen-cart'
const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_KEY)
      return raw ? JSON.parse(raw) as CartItem[] : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems((current) => {
      const existing = current.find((entry) => entry.id === item.id)
      if (!existing) {
        return [...current, { ...item, quantity: item.quantity ?? 1 }]
      }

      return current.map((entry) =>
        entry.id === item.id
          ? { ...entry, quantity: entry.quantity + (item.quantity ?? 1) }
          : entry,
      )
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    setItems((current) =>
      current
        .map((entry) => (entry.id === id ? { ...entry, quantity: Math.max(0, quantity) } : entry))
        .filter((entry) => entry.quantity > 0),
    )
  }

  const removeItem = (id: string) => {
    setItems((current) => current.filter((entry) => entry.id !== id))
  }

  const clearCart = () => setItems([])

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items])

  const value = useMemo<CartContextValue>(
    () => ({ items, itemCount, subtotal, addItem, updateQuantity, removeItem, clearCart }),
    [items, itemCount, subtotal],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used inside CartProvider')
  }
  return ctx
}
