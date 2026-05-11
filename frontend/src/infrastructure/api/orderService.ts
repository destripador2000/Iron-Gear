import type { Order, OrderUpdate } from '../../domain/orders/types';
import { authService } from './authService';

const API_BASE = '/router';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status?: number;
}

const getAuthHeaders = (): HeadersInit => {
  const token = authService.getToken();
  return token
    ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
};

export const orderService = {
  async getOrders(): Promise<ApiResponse<Order[]>> {
    try {
      const response = await fetch(`${API_BASE}/rt_orders`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data: Order[] = await response.json();
      return { data, error: null, status: response.status };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  },

  async getOrder(orderId: number): Promise<ApiResponse<Order>> {
    try {
      const response = await fetch(`${API_BASE}/rt_orders/${orderId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data: Order = await response.json();
      return { data, error: null, status: response.status };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  },

  async updateOrderStatus(orderId: number, status: string): Promise<ApiResponse<Order>> {
    try {
      const response = await fetch(`${API_BASE}/rt_orders/${orderId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status } as OrderUpdate),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Error: ${response.status}`);
      }

      const data: Order = await response.json();
      return { data, error: null, status: response.status };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  },

  async downloadInvoice(orderId: number): Promise<Blob | null> {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE}/rt_orders/${orderId}/invoice`, {
        method: 'GET',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      return await response.blob();
    } catch (error) {
      console.error('Error downloading invoice:', error);
      return null;
    }
  },
};