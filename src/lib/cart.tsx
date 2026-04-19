import type { PropsWithChildren } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import type { CatalogueProductCard } from '../models/product'

const CART_STORAGE_KEY = 'fastagro_cart'

export type CartItem = {
  productId: number
  name: string
  imageUrl: string
  category: string
  quantity: number
  unitLabel: string
  unitWeightKg: number
  priceTiers: Array<{
    label: string
    amountDa: number
    highlighted?: boolean
  }>
}

type CartContextValue = {
  items: CartItem[]
  itemCount: number
  addItem: (product: CatalogueProductCard) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartItem[]>([])
  /** Prevents the persist effect from running on the first commit while `items` is still []. */
  const skipInitialPersist = useRef(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return
    try {
      const parsed: unknown = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        setItems(parsed.filter(isCartItem))
      }
    } catch {
      /* ignore invalid persisted cart */
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (skipInitialPersist.current) {
      skipInitialPersist.current = false
      return
    }
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product: CatalogueProductCard) => {
    const productId = Number(product.id)
    if (!Number.isFinite(productId) || productId < 1) return
    setItems((current) => {
      const existing = current.find((item) => item.productId === productId)
      if (existing) {
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }
      return [
        ...current,
        {
          productId,
          name: product.name,
          imageUrl: product.imageUrl,
          category: product.category,
          quantity: 1,
          unitLabel: 'unites',
          unitWeightKg: 1,
          priceTiers: product.priceTiers,
        },
      ]
    })
  }, [])

  const removeItem = useCallback((productId: number) => {
    setItems((current) => current.filter((item) => item.productId !== productId))
  }, [])

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setItems((current) =>
      current
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(1, Math.floor(quantity || 1)) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [addItem, clearCart, items, removeItem, updateQuantity],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider')
  }
  return ctx
}

export function getActiveCartTier(item: CartItem) {
  const sorted = [...item.priceTiers].sort((a, b) => {
    const aMin = extractTierMinQuantity(a.label)
    const bMin = extractTierMinQuantity(b.label)
    return bMin - aMin
  })
  return sorted.find((tier) => item.quantity >= extractTierMinQuantity(tier.label)) ?? sorted[0]
}

function extractTierMinQuantity(label: string): number {
  const match = /(\d+)/.exec(label)
  return match ? Number(match[1]) : 1
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Record<string, unknown>
  return (
    typeof item.productId === 'number' &&
    typeof item.name === 'string' &&
    typeof item.imageUrl === 'string' &&
    typeof item.category === 'string' &&
    typeof item.quantity === 'number' &&
    typeof item.unitLabel === 'string' &&
    typeof item.unitWeightKg === 'number' &&
    Array.isArray(item.priceTiers)
  )
}
