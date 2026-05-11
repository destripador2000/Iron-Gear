import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import type { CartItem, CartSummary } from '../../domain/cart/types';
import type { Product } from '../../domain/product/types';

// Clave para localStorage
const CART_STORAGE_KEY = 'iron_gear_cart';

// Configuración de gastos de envío e impuestos
const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 15;
const TAX_RATE = 0.08;

// Estado inicial del carrito
const initialState: CartItem[] = [];

// Acción para el reducer
type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; imageUrl: string; imageAlt: string } }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

// Helper para convertir Product a CartItem
const productToCartItem = (product: Product, quantity: number, imageUrl: string, imageAlt: string): CartItem => ({
  ...product,
  quantity,
  imageUrl,
  imageAlt,
});

// Reducer para el estado del carrito
const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, imageUrl, imageAlt } = action.payload;
      const existingIndex = state.findIndex((item) => item.id === product.id);

      if (existingIndex !== -1) {
        // Si el producto ya existe, actualizar la cantidad
        const updatedState = [...state];
        const newQuantity = updatedState[existingIndex].quantity + quantity;
        // Validar que no exceda el stock
        const maxQuantity = Math.min(newQuantity, product.stock);
        updatedState[existingIndex] = {
          ...updatedState[existingIndex],
          quantity: maxQuantity,
        };
        return updatedState;
      }

      // Si no existe, agregar nuevo item
      return [...state, productToCartItem(product, quantity, imageUrl, imageAlt)];
    }

    case 'REMOVE_ITEM': {
      return state.filter((item) => item.id !== action.payload);
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      return state.map((item) => {
        if (item.id === productId) {
          // Validar cantidad mínima de 1 y máximo el stock disponible
          const validQuantity = Math.max(1, Math.min(quantity, item.stock));
          return { ...item, quantity: validQuantity };
        }
        return item;
      });
    }

    case 'CLEAR_CART': {
      return [];
    }

    case 'LOAD_CART': {
      return action.payload;
    }

    default:
      return state;
  }
};

// Función para calcular el resumen del carrito
const calculateSummary = (items: CartItem[]): CartSummary => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  return { subtotal, shipping, tax, total };
};

// Interfaz del contexto del carrito
interface CartContextType {
  // Estado
  items: CartItem[];
  summary: CartSummary;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  // Acciones
  addToCart: (product: Product, quantity?: number, imageUrl?: string, imageAlt?: string) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  // Helpers
  isInCart: (productId: number) => boolean;
  getItemQuantity: (productId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider del carrito
interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, dispatch] = useReducer(cartReducer, initialState);
  const [loading, setLoading] = React.useState(true);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart) as CartItem[];
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    setLoading(false);
  }, []);

  // Guardar carrito en localStorage cuando cambian los items
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [items, loading]);

  // Derivados
  const summary = useMemo(() => calculateSummary(items), [items]);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  // Acciones
  const addToCart = useCallback(
    (product: Product, quantity: number = 1, imageUrl: string = '', imageAlt: string = '') => {
      dispatch({
        type: 'ADD_ITEM',
        payload: { product, quantity, imageUrl, imageAlt },
      });
    },
    []
  );

  const removeFromCart = useCallback((productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  // Helpers
  const isInCart = useCallback(
    (productId: number) => items.some((item) => item.id === productId),
    [items]
  );

  const getItemQuantity = useCallback(
    (productId: number) => {
      const item = items.find((item) => item.id === productId);
      return item?.quantity || 0;
    },
    [items]
  );

  const value: CartContextType = {
    items,
    summary,
    totalItems,
    totalPrice,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook personalizado para usar el carrito
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
