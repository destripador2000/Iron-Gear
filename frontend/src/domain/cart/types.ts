import type { Product } from '../product/types';

export interface CartItem extends Product {
  quantity: number;
  imageUrl: string;
  imageAlt: string;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface CartState {
  items: CartItem[];
  summary: CartSummary;
}
