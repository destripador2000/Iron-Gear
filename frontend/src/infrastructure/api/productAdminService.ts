import type { Product } from '../../domain/product/types';
import { authService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/router/rt_products`;
const INVENTORY_ENDPOINT = `${API_BASE_URL}/inventory`;

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status?: number;
}

export interface CreateProductData {
  distributor_id: number;
  name: string;
  description?: string;
  price: number;
  is_discount?: boolean;
  stock: number;
  category: string;
}

export interface UpdateProductData {
  distributor_id?: number;
  name?: string;
  description?: string;
  price?: number;
  is_discount?: boolean;
  stock?: number;
  category?: string;
}

export const productAdminService = {
  /**
   * Obtiene todos los productos (sin auth requerida)
   */
  async getProducts(): Promise<ApiResponse<Product[]>> {
    try {
      const response = await fetch(PRODUCTS_ENDPOINT, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: Product[] = await response.json();
      return { data, error: null, status: response.status };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  },

  /**
   * Crea un nuevo producto (requiere auth)
   */
  async createProduct(product: CreateProductData): Promise<ApiResponse<Product>> {
    try {
      const token = authService.getToken();
      if (!token) return { data: null, error: 'No autenticado' };

      const response = await fetch(PRODUCTS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      if (response.status === 401) {
        return { data: null, error: 'Sesión expirada', status: 401 };
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { data: null, error: errorData.detail || `Error: ${response.status}`, status: response.status };
      }

      const data: Product = await response.json();
      return { data, error: null, status: response.status };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Error de conexión' };
    }
  },

  /**
   * Actualiza un producto existente (requiere auth)
   */
  async updateProduct(productId: number, updates: UpdateProductData): Promise<ApiResponse<Product>> {
    try {
      const token = authService.getToken();
      if (!token) return { data: null, error: 'No autenticado' };

      const response = await fetch(`${PRODUCTS_ENDPOINT}/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (response.status === 401) {
        return { data: null, error: 'Sesión expirada', status: 401 };
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { data: null, error: errorData.detail || `Error: ${response.status}`, status: response.status };
      }

      const data: Product = await response.json();
      return { data, error: null, status: response.status };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Error de conexión' };
    }
  },

  /**
   * Elimina un producto (requiere auth)
   */
  async deleteProduct(productId: number): Promise<ApiResponse<void>> {
    try {
      const token = authService.getToken();
      if (!token) return { data: null, error: 'No autenticado' };

      const response = await fetch(`${PRODUCTS_ENDPOINT}/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        return { data: null, error: 'Sesión expirada', status: 401 };
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { data: null, error: errorData.detail || `Error: ${response.status}`, status: response.status };
      }

      return { data: undefined, error: null, status: response.status };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Error de conexión' };
    }
  },

  /**
   * Reabastece el stock de un producto (solo admin)
   */
  async restockProduct(productId: number, distributorId: number, quantity: number): Promise<ApiResponse<{ new_stock: number }>> {
    try {
      const token = authService.getToken();
      if (!token) return { data: null, error: 'No autenticado' };

      const response = await fetch(`${INVENTORY_ENDPOINT}/restock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId, distributor_id: distributorId, quantity_added: quantity }),
      });

      if (response.status === 401) {
        return { data: null, error: 'Sesión expirada', status: 401 };
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { data: null, error: errorData.detail || `Error: ${response.status}`, status: response.status };
      }

      const data = await response.json();
      return { data, error: null, status: response.status };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Error de conexión' };
    }
  },
};