export interface Product {
  id: number;
  distributor_id: number;
  name: string;
  description: string | null;
  price: number;
  is_discount: boolean;
  stock: number;
  category: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  frozen_price: number;
  product: Product | null;
}

export interface Order {
  id: number;
  user_id: number;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  user: User | null;
  items: OrderItem[];
}

export interface OrderUpdate {
  status?: string;
}

export type OrderStatus = 'pendiente' | 'enviado' | 'entregado';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente: 'Pendiente',
  enviado: 'Enviado',
  entregado: 'Entregado',
};

export const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'entregado', label: 'Entregado' },
];