import type { CartItem } from '../../domain/cart/types';
import { authService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Endpoints del backend
const ORDERS_BASE = `${API_BASE_URL}/router/rt_orders`;

export interface OrderItemRequest {
  product_id: number;
  quantity: number;
}

export interface CheckoutRequest {
  items: OrderItemRequest[];
}

export interface PaymentRequest {
  payment_method: string;
  transaction_id: string;
}

export interface OrderResponse {
  id: number;
  user_id: number;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface PaymentResponse {
  order_id: number;
  status: string;
  payment_method: string;
  transaction_id: string;
  message: string;
}

export interface ApiError {
  error: string;
  status: number;
}

export const checkoutService = {
  /**
   * Transforma los items del carrito al formato requerido por el backend
   */
  transformCartToOrderItems(items: CartItem[]): OrderItemRequest[] {
    return items.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));
  },

  /**
   * Crea una orden en el backend
   * POST /orders/checkout
   */
  async createOrder(items: CartItem[]): Promise<{ data?: OrderResponse; error?: string; status?: number }> {
    try {
      const token = authService.getToken();
      
      if (!token) {
        return { error: 'Debes iniciar sesión para realizar el pedido', status: 401 };
      }

      const orderItems = this.transformCartToOrderItems(items);
      
      const response = await fetch(`${ORDERS_BASE}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ items: orderItems } as CheckoutRequest),
      });

      if (response.status === 401) {
        return { error: 'Sesión expirada. Por favor inicia sesión de nuevo.', status: 401 };
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { 
          error: errorData.detail || `Error al crear la orden (${response.status})`, 
          status: response.status 
        };
      }

      const data: OrderResponse = await response.json();
      return { data, status: response.status };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      return { error: errorMessage };
    }
  },

  /**
   * Procesa el pago de una orden existente
   * POST /orders/{order_id}/pay
   */
  async processPayment(orderId: number, paymentData: PaymentRequest): Promise<{ data?: PaymentResponse; error?: string; status?: number }> {
    try {
      const token = authService.getToken();

      if (!token) {
        return { error: 'Debes iniciar sesión para realizar el pedido', status: 401 };
      }

      const response = await fetch(`${ORDERS_BASE}/${orderId}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (response.status === 401) {
        return { error: 'Sesión expirada. Por favor inicia sesión de nuevo.', status: 401 };
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: errorData.detail || `Error al procesar el pago (${response.status})`,
          status: response.status
        };
      }

      const data: PaymentResponse = await response.json();
      return { data, status: response.status };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      return { error: errorMessage };
    }
  },

  /**
   * Descarga la factura PDF de una orden
   * GET /orders/{order_id}/invoice
   */
  async downloadInvoice(orderId: number): Promise<{ blob?: Blob; error?: string }> {
    try {
      const token = authService.getToken();

      if (!token) {
        return { error: 'Debes iniciar sesión para descargar la factura' };
      }

      const response = await fetch(`${ORDERS_BASE}/${orderId}/invoice`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        return { error: 'Sesión expirada. Por favor inicia sesión de nuevo.' };
      }

      if (!response.ok) {
        return { error: `Error al obtener la factura (${response.status})` };
      }

      const blob = await response.blob();

      if (!blob || blob.size === 0) {
        return { error: 'La factura está vacía o no está disponible' };
      }

      return { blob };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      return { error: errorMessage };
    }
  },
};