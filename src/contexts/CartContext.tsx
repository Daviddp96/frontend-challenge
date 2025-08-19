import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { Product, CartItem } from '../types/Product'

interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number; selectedColor?: string; selectedSize?: string } }
  | { type: 'REMOVE_FROM_CART'; payload: { id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity, selectedColor, selectedSize } = action.payload
      
      // Calculate unit price based on quantity
      let unitPrice = product.basePrice
      if (product.priceBreaks && product.priceBreaks.length > 0) {
        for (let i = product.priceBreaks.length - 1; i >= 0; i--) {
          if (quantity >= product.priceBreaks[i].minQty) {
            unitPrice = product.priceBreaks[i].price
            break
          }
        }
      }

      // Check if item already exists with same properties
      const existingItemIndex = state.items.findIndex(item => 
        item.id === product.id && 
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize
      )

      let newItems: CartItem[]
      
      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            const newQuantity = item.quantity + quantity
            return {
              ...item,
              quantity: newQuantity,
              unitPrice,
              totalPrice: unitPrice * newQuantity
            }
          }
          return item
        })
      } else {
        // Add new item
        const newItem: CartItem = {
          ...product,
          quantity,
          selectedColor,
          selectedSize,
          unitPrice,
          totalPrice: unitPrice * quantity
        }
        newItems = [...state.items, newItem]
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + item.totalPrice, 0)

      return {
        items: newItems,
        totalItems,
        totalPrice
      }
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.id !== action.payload.id)
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + item.totalPrice, 0)

      return {
        items: newItems,
        totalItems,
        totalPrice
      }
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: { id } })
      }

      const newItems = state.items.map(item => {
        if (item.id === id) {
          return {
            ...item,
            quantity,
            totalPrice: item.unitPrice * quantity
          }
        }
        return item
      })

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + item.totalPrice, 0)

      return {
        items: newItems,
        totalItems,
        totalPrice
      }
    }

    case 'CLEAR_CART':
      return initialState

    case 'LOAD_CART': {
      const items = action.payload
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0)

      return {
        items,
        totalItems,
        totalPrice
      }
    }

    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addToCart: (product: Product, quantity: number, selectedColor?: string, selectedSize?: string) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const [isLoaded, setIsLoaded] = React.useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('swag-cart')
    if (savedCart) {
      try {
        const cartItems: CartItem[] = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: cartItems })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save cart to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('swag-cart', JSON.stringify(state.items))
    }
  }, [state.items, isLoaded])

  const addToCart = (product: Product, quantity: number, selectedColor?: string, selectedSize?: string) => {
    dispatch({ 
      type: 'ADD_TO_CART', 
      payload: { product, quantity, selectedColor, selectedSize } 
    })
  }

  const removeFromCart = (id: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id } })
  }

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const value: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
